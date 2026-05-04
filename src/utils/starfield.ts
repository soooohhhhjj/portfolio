/**
 * Represents a single star in the background animation.
 * Contains positional, sizing, and movement data required for rendering.
 */
export interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

// Breakpoints for responsive design to adjust the star counts based on screen width
export const BREAKPOINTS = {
  mobile: 0,
  dinosaur: 320,
  xxsm: 380,
  xsm: 480,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

// Defines how many [slow, medium, fast] stars to generate at each breakpoint
export const STAR_COUNTS = {
  mobile: [20, 6, 4],
  dinosaur: [24, 7, 5],
  xxsm: [28, 9, 6],
  xsm: [34, 11, 7],
  sm: [46, 15, 10],
  md: [90, 30, 22],
  lg: [120, 50, 25],
  xl: [120, 50, 25],
} as const;

/**
 * Returns the appropriate array of star counts [slow, medium, fast] for a given screen width.
 */
export const getStarCountsForWidth = (width: number): readonly [number, number, number] => {
  if (width >= BREAKPOINTS.xl) return STAR_COUNTS.xl;
  if (width >= BREAKPOINTS.lg) return STAR_COUNTS.lg;
  if (width >= BREAKPOINTS.md) return STAR_COUNTS.md;
  if (width >= BREAKPOINTS.sm) return STAR_COUNTS.sm;
  if (width >= BREAKPOINTS.xsm) return STAR_COUNTS.xsm;
  if (width >= BREAKPOINTS.xxsm) return STAR_COUNTS.xxsm;
  if (width >= BREAKPOINTS.dinosaur) return STAR_COUNTS.dinosaur;
  return STAR_COUNTS.mobile;
};

/**
 * Generates an array of randomized stars within the specified size and speed ranges.
 */
export function generateStars(
  count: number,
  width: number,
  height: number,
  sizeRange: [number, number],
  speedRange: [number, number],
): Star[] {
  const stars: Star[] = [];

  for (let index = 0; index < count; index += 1) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * (sizeRange[1] - sizeRange[0]) + sizeRange[0],
      speed: Math.random() * (speedRange[1] - speedRange[0]) + speedRange[0],
      opacity: Math.random() * 0.5 + 0.5,
      twinkleSpeed: Math.random() * 0.015 + 0.005,
      twinkleOffset: Math.random() * Math.PI * 2,
    });
  }

  return stars;
}

/**
 * Adjusts the positions of existing stars proportionally when the window is resized.
 * This prevents the stars from clumping together or leaving empty spaces.
 */
export const scaleStarsToViewport = (
  stars: Star[],
  previousWidth: number,
  previousHeight: number,
  nextWidth: number,
  nextHeight: number,
) => {
  if (previousWidth <= 0 || previousHeight <= 0) return;

  const scaleX = nextWidth / previousWidth;
  const scaleY = nextHeight / previousHeight;

  stars.forEach((star) => {
    star.x *= scaleX;
    star.y *= scaleY;

    // Clamp coordinates to the new viewport bounds to prevent stars escaping the screen
    if (star.x < 0) star.x = 0;
    if (star.x > nextWidth) star.x = nextWidth;
    if (star.y < 0) star.y = 0;
    if (star.y > nextHeight) star.y = nextHeight;
  });
};
