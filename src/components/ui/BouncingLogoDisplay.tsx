import { useRef, useEffect } from 'react';

export default function BouncingLogoDisplay({
  src,
  alt,
  className,
  logoClassName,
}: {
  src: string;
  alt: string;
  className?: string;
  logoClassName?: string;
}) {
  const frameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const positionRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0.07, y: 0.065 });
  const boundsRef = useRef({ width: 0, height: 0, logoWidth: 0, logoHeight: 0 });
  const shellRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const shell = shellRef.current;
    const logo = logoRef.current;
    if (!shell || !logo) return;

    const updateBounds = () => {
      const nextBounds = {
        width: shell.clientWidth,
        height: shell.clientHeight,
        logoWidth: logo.clientWidth,
        logoHeight: logo.clientHeight,
      };
      boundsRef.current = nextBounds;
      positionRef.current = {
        x: Math.max(0, Math.min(positionRef.current.x, nextBounds.width - nextBounds.logoWidth)),
        y: Math.max(0, Math.min(positionRef.current.y, nextBounds.height - nextBounds.logoHeight)),
      };
      logo.style.transform = `translate(${positionRef.current.x}px, ${positionRef.current.y}px)`;
    };

    const step = (time: number) => {
      if (lastTimeRef.current === null) lastTimeRef.current = time;
      const delta = Math.min(32, time - lastTimeRef.current);
      lastTimeRef.current = time;

      const { width, height, logoWidth, logoHeight } = boundsRef.current;
      const maxX = Math.max(0, width - logoWidth);
      const maxY = Math.max(0, height - logoHeight);

      if (maxX > 0 || maxY > 0) {
        let nextX = positionRef.current.x + velocityRef.current.x * delta;
        let nextY = positionRef.current.y + velocityRef.current.y * delta;

        if (nextX <= 0 || nextX >= maxX) {
          velocityRef.current.x *= -1;
          nextX = Math.max(0, Math.min(nextX, maxX));
        }
        if (nextY <= 0 || nextY >= maxY) {
          velocityRef.current.y *= -1;
          nextY = Math.max(0, Math.min(nextY, maxY));
        }

        positionRef.current = { x: nextX, y: nextY };
        logo.style.transform = `translate(${nextX}px, ${nextY}px)`;
      }

      frameRef.current = window.requestAnimationFrame(step);
    };

    const resizeObserver = new ResizeObserver(updateBounds);
    resizeObserver.observe(shell);
    resizeObserver.observe(logo);
    updateBounds();
    frameRef.current = window.requestAnimationFrame(step);

    return () => {
      resizeObserver.disconnect();
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
      lastTimeRef.current = null;
    };
  }, []);

  return (
    <div ref={shellRef} className={`relative w-full min-h-[248px] overflow-hidden ${className ?? ''}`}>
      <img
        ref={logoRef}
        src={src}
        alt={alt}
        className={`block w-[clamp(96px,28%,160px)] h-auto ${logoClassName ?? ''}`}
        loading="lazy"
        draggable={false}
      />
    </div>
  );
}
