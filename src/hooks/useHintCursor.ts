import { useState, useRef, useEffect } from 'react';
import { useAnimate, useInView } from 'framer-motion';

export function useHintCursor(introDone: boolean, onHireClick: () => void) {
    const [hasClicked, setHasClicked] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef);
    const [scope, animate] = useAnimate();

    useEffect(() => {
        let isActive = true;

        const runAnimationLoop = async () => {
            // Give it a moment before the very first tease
            await new Promise(r => setTimeout(r, 500));

            while (isActive) {
                if (!introDone || hasClicked || !isInView || !scope.current) break;
                
                // Start invisible and offset to bottom right
                await animate(scope.current, { scale: 0, opacity: 0, x: 0, y: 0 }, { duration: 0 });
                
                // 1. Poof in
                await animate(scope.current, { scale: 1, opacity: 1 }, { type: 'spring', bounce: 0.5, duration: 0.6 });
                if (!isActive || hasClicked || !isInView) break;
                
                await new Promise(r => setTimeout(r, 400));
                if (!isActive || hasClicked || !isInView) break;
                
                // 2. Glide towards button
                await animate(scope.current, { x: -70, y: -8 }, { duration: 0.7, ease: "easeInOut" });
                if (!isActive || hasClicked || !isInView) break;
                
                // 3. Click down & up
                await animate(scope.current, { scale: 0.85 }, { duration: 0.1 });
                await animate(scope.current, { scale: 1 }, { duration: 0.1 });
                if (!isActive || hasClicked || !isInView) break;
                
                await new Promise(r => setTimeout(r, 400));
                if (!isActive || hasClicked || !isInView) break;
                
                // 4. Poof out in place (small bounce to 0)
                await animate(scope.current, { scale: 0, opacity: 0 }, { type: 'spring', bounce: 0.2, duration: 0.5 });

                // Wait 5s interval before repeating the animation
                await new Promise(r => setTimeout(r, 5000));
            }
        };

        if (isInView && introDone && !hasClicked) {
            runAnimationLoop();
        } else if (!isInView && scope.current) {
            // Reset to initial invisible state when scrolled out of view
            animate(scope.current, { scale: 0, opacity: 0, x: 0, y: 0 }, { duration: 0 });
        }

        return () => { isActive = false; };
    }, [introDone, hasClicked, isInView, animate, scope]);

    const handleHireClick = () => {
        setHasClicked(true);
        onHireClick();
    };

    return {
        containerRef,
        scope,
        hasClicked,
        handleHireClick
    } as const;
}
