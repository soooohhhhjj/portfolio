import { useState, useEffect, useCallback, useRef } from "react";
import { lenis } from "../lib/lenis";
import { SLIDE_DURATION_MS } from "../lib/animations";

type IntroPhase = 'welcome' | 'sliding' | 'done';

const SCROLL_KEYS = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', ' ', 'Home', 'End'];

/**
 * useIntroSequence
 * 
 * Manages the three-phase state machine of the initial site load:
 * 1. 'welcome' : The typed-out welcome text is visible. Scrolling is locked.
 * 2. 'sliding' : Welcome screen slides up, main content slides up. Cinematic stars activate.
 * 3. 'done'    : Normal site operation. Scrolling is unlocked, stars resume default movement.
 */
export function useIntroSequence() {
    const [phase, setPhase] = useState<IntroPhase>('welcome');
    const timerRef = useRef<number | null>(null);

    // Prevent browser scroll restoration on refresh
    useEffect(() => {
        if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
        window.scrollTo(0, 0);
    }, []);

    // Single scroll lock effect — covers welcome + sliding phases
    useEffect(() => {
        if (phase === 'done') {
            document.body.style.overflow = '';
            lenis.start();
            return;
        }

        document.body.style.overflow = 'hidden';
        lenis.stop();

        const preventScroll = (e: Event) => {
            if (e instanceof KeyboardEvent && !SCROLL_KEYS.includes(e.key)) return;
            e.preventDefault();
        };

        window.addEventListener('wheel', preventScroll, { passive: false });
        window.addEventListener('touchmove', preventScroll, { passive: false });
        window.addEventListener('keydown', preventScroll, { passive: false });

        return () => {
            window.removeEventListener('wheel', preventScroll);
            window.removeEventListener('touchmove', preventScroll);
            window.removeEventListener('keydown', preventScroll);
            
            // Fallback unlock to ensure scrolling isn't permanently locked if the component unmounts prematurely
            document.body.style.overflow = '';
            lenis.start();
        };
    }, [phase]);

    // Cleanup timer on unmount
    useEffect(() => () => {
        if (timerRef.current) clearTimeout(timerRef.current);
    }, []);

    const handleWelcomeDone = useCallback(() => {
        setPhase('sliding');
        timerRef.current = window.setTimeout(() => {
            setPhase('done');
        }, SLIDE_DURATION_MS + 300);
    }, []);

    return {
        welcomeVisible: phase === 'welcome',       // controls AnimatePresence
        contentVisible: phase !== 'welcome',       // controls main content slide-in
        starMode: phase === 'sliding'              // cinematic only during slide
            ? 'cinematic' : 'normal',
        handleWelcomeDone,
    } as const;
}