import { useEffect, useRef, type RefObject } from 'react';
import {
    type Star,
    BREAKPOINTS,
    getStarCountsForWidth,
    generateStars,
    scaleStarsToViewport,
} from '../utils/starfield';
import { lenis } from '../lib/lenis';

/**
  * Custom hook that manages the lifecycle, rendering, and logic of the starfield animation.
  * It attaches to a canvas element and uses requestAnimationFrame for efficient drawing.
  */
export function useStarfield(canvasRef: RefObject<HTMLCanvasElement | null>) {
    const starsRef = useRef<Star[]>([]);
    const viewportRef = useRef<{ width: number; height: number } | null>(null);
    const twinkleEnabledRef = useRef(true);
    const timeRef = useRef(0);
    const scrollInfluenceRef = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d', { alpha: false });
        if (!context) return;

        context.imageSmoothingEnabled = true;

        // Populates the flat array with slow, medium, and fast stars based on screen width
        const createStars = (width: number, height: number) => {
            const [slowCount, mediumCount, fastCount] = getStarCountsForWidth(width);
            starsRef.current = [
                ...generateStars(slowCount, width, height, [0.5, 0.8], [0.05, 0.15]),
                ...generateStars(mediumCount, width, height, [0.8, 1.3], [0.1, 0.25]),
                ...generateStars(fastCount, width, height, [1.3, 1.8], [0.3, 0.55]),
            ];
        };

        // Handles window resize and orientation events to scale the canvas seamlessly
        const resizeCanvas = () => {
            const nextWidth = window.innerWidth;
            const nextHeight = window.innerHeight;
            const previous = viewportRef.current;
            
            // Disable twinkling on small screens for better performance
            twinkleEnabledRef.current = nextWidth > BREAKPOINTS.sm;
            
            const isMobileViewport =
                window.matchMedia('(hover: none) and (pointer: coarse)').matches ||
                nextWidth < BREAKPOINTS.lg;

            // Initial canvas setup
            if (!previous) {
                canvas.width = nextWidth;
                canvas.height = nextHeight;
                createStars(nextWidth, nextHeight);
                viewportRef.current = { width: nextWidth, height: nextHeight };
                return;
            }

            const widthDelta = Math.abs(nextWidth - previous.width);
            const heightDelta = Math.abs(nextHeight - previous.height);
            const orientationChanged = (previous.width > previous.height) !== (nextWidth > nextHeight);
            
            // Prevent annoying UI jumps on mobile devices when browser address bar collapses
            const isHeightOnlyResize = widthDelta <= 2 && heightDelta > 0;
            if (isMobileViewport && isHeightOnlyResize && !orientationChanged) {
                return;
            }

            canvas.width = nextWidth;
            canvas.height = nextHeight;

            const shouldRegenerate = orientationChanged || widthDelta > 120;

            // If the screen size changed drastically, create a brand new set of stars
            if (shouldRegenerate) {
                createStars(nextWidth, nextHeight);
            } else {
                // Otherwise, gracefully scale existing stars to fit the new viewport
                scaleStarsToViewport(starsRef.current, previous.width, previous.height, nextWidth, nextHeight);
            }

            viewportRef.current = { width: nextWidth, height: nextHeight };
        };

        resizeCanvas();

        let isInitialized = false;
        // Ignore scroll events for the first 500ms. This prevents the stars from rocketing 
        // across the screen when the browser instantly restores your saved scroll position on a hard refresh.
        const initTimer = setTimeout(() => {
            isInitialized = true;
        }, 500);

        let animationFrame = 0;
        const TWO_PI = Math.PI * 2; // Pre-calculate for performance inside the loop
        
        // The main rendering loop that runs ~60 times per second
        const animate = () => {
            animationFrame = window.requestAnimationFrame(animate);

            const width = canvas.width;
            const height = canvas.height;

            timeRef.current += 0.016;
      
            let currentScrollVelocity = lenis?.velocity || 0;
            
            // Enforce the 500ms startup delay
            if (!isInitialized) {
                currentScrollVelocity = 0;
            } else {
                // Clamp the max velocity to prevent chaotic spikes
                currentScrollVelocity = Math.max(-150, Math.min(150, currentScrollVelocity));
            }

            // Smoothly interpolate the visual scroll influence so it eases in and out
            scrollInfluenceRef.current += (currentScrollVelocity - scrollInfluenceRef.current) * 0.08;

            context.fillStyle = '#000000';
            context.fillRect(0, 0, width, height);

            starsRef.current.forEach((star) => {
                // Calculate the pulsing opacity effect
                const twinkle = twinkleEnabledRef.current
                    ? Math.sin(timeRef.current * star.twinkleSpeed + star.twinkleOffset) * 0.2 + 0.8
                    : 1;

                context.fillStyle = `rgba(255,255,255,${star.opacity * twinkle})`;
                context.beginPath();
                context.arc(star.x, star.y, star.size, 0, TWO_PI);
                context.fill();

                // Default slow diagonal drift
                let deltaX = -0.5 * star.speed;
                let deltaY = 0.5 * star.speed;

                // When scrolling quickly, stop diagonal drift and respond to scroll velocity instead
                if (Math.abs(scrollInfluenceRef.current) > 0.1) {
                    deltaX = 0;
                    deltaY = -scrollInfluenceRef.current * star.speed * 0.6;
                }

                star.x += deltaX;
                star.y += deltaY;

                // Mathematical boundary wrapping: When a star exits one side of the screen, 
                // it reappears seamlessly on the opposite side.
                if (star.x < 0) star.x += width;
                else if (star.x > width) star.x -= width;
                
                if (star.y < 0) star.y += height;
                else if (star.y > height) star.y -= height;
            });
        };

        animate();
        window.addEventListener('resize', resizeCanvas);
        window.addEventListener('orientationchange', resizeCanvas);

        return () => {
            clearTimeout(initTimer);
            window.cancelAnimationFrame(animationFrame);
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('orientationchange', resizeCanvas);
        };
    }, [canvasRef]);
}
