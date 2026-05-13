import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { lenis as globalLenis } from '../lib/lenis';

export function useModalLenis(isOpen: boolean) {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen || !scrollRef.current) return;

        globalLenis.stop();

        const modalLenis = new Lenis({
            wrapper: scrollRef.current,   // scroll container
            content: scrollRef.current.firstElementChild as HTMLElement,
            duration: 1.2,
            smoothWheel: true,
            touchMultiplier: 1.5,
        });

        const raf = (time: number) => {
            modalLenis.raf(time);
            requestAnimationFrame(raf);
        };
        const rafId = requestAnimationFrame(raf);

        return () => {
            cancelAnimationFrame(rafId);
            modalLenis.destroy();
            globalLenis.start();
        };
    }, [isOpen]);

    return scrollRef;
}
