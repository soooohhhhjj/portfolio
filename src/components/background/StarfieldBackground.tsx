import { useRef } from 'react';
import { useStarfield } from '../../hooks/useStarfield';

/**
 * StarfieldBackground component
 * 
 * Renders a full-screen, fixed canvas that displays the dynamic starfield animation.
 * The actual rendering and logic are fully delegated to the custom `useStarfield` hook.
 */
interface StarfieldBackgroundProps {
  mode?: 'normal' | 'cinematic';
}

export function StarfieldBackground({ mode = 'normal' }: StarfieldBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Attach the hook to our canvas element
  useStarfield(canvasRef, mode);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: -999999, // Placed extremely far back so it doesn't block interactions
        pointerEvents: 'none', // Critical: ensures clicks pass through the canvas to elements underneath
      }}
      aria-hidden="true" // Hide from screen readers since it is purely decorative
    />
  );
}