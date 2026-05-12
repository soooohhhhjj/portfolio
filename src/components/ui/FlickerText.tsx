import { useMemo } from 'react';
import './flickerText.css';

export type FlickerIntensity = 'strong' | 'medium' | 'light';

export interface FlickerConfig {
  intensity: FlickerIntensity;
  delay: number;
  duration: number;
}

interface FlickerTextProps {
  text: string;
  className?: string;
  runFlicker?: boolean;
  configs?: Record<number, FlickerConfig>;
}

function buildShuffledPool(count: number): (FlickerIntensity | null)[] {
  // Controlled proportions — tweak these to taste
  const proportions = { none: 0.2, light: 0.35, medium: 0.3, strong: 0.15 };

  const pool: (FlickerIntensity | null)[] = [
    ...Array(Math.round(count * proportions.none)).fill(null),
    ...Array(Math.round(count * proportions.light)).fill('light'),
    ...Array(Math.round(count * proportions.medium)).fill('medium'),
    ...Array(Math.round(count * proportions.strong)).fill('strong'),
  ];

  // Pad/trim to exact length (rounding can drift)
  while (pool.length < count) pool.push('light');
  pool.length = count;

  // Fisher-Yates shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return pool;
}

export function FlickerText({ text, className = '', runFlicker = true, configs }: FlickerTextProps) {
  const chars = useMemo(() => text.split(''), [text]);

  const flickerStyles = useMemo(() => {
    if (!runFlicker) return chars.map(() => ({}));

    if (configs) {
      return chars.map((_, i) => {
        const config = configs[i];
        if (!config) return {};
        return { animation: `navbar-flicker-${config.intensity} ${config.duration}s linear ${config.delay}s both` };
      });
    }

    // Shuffled pool — guaranteed variety
    const pool = buildShuffledPool(chars.length);

    return chars.map((_, i) => {
      const intensity = pool[i];
      if (!intensity) return {}; // this char is the "none" slot

      // Staggered delay: left-to-right wave + small jitter
      const baseDelay = (i / chars.length) * 0.3;         // 0 → 0.3s cascade
      const jitter    = (Math.random() * 0.1) - 0.05;     // ±0.05s noise
      const delay     = Math.max(0, baseDelay + jitter).toFixed(2);

      // Duration tied to intensity — strong flickers faster
      const durationRanges = { strong: [0.3, 0.45], medium: [0.45, 0.6], light: [0.55, 0.75] };
      const [min, max] = durationRanges[intensity];
      const duration = (min + Math.random() * (max - min)).toFixed(2);

      return { animation: `navbar-flicker-${intensity} ${duration}s linear ${delay}s both` };
    });
  }, [chars, runFlicker, configs]);

  return (
    <span className={className}>
      {chars.map((char, index) => (
        <span
          key={index}
          style={flickerStyles[index] || {}}
          className={char === ' ' ? 'inline-block w-[0.25em]' : 'inline-block'}
        >
          {char}
        </span>
      ))}
    </span>
  );
}
