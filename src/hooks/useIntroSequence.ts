import { useState, useEffect, useCallback } from "react";
import { lenis } from "../lib/lenis";
import { SLIDE_DURATION_MS } from "../lib/animations";

export function useIntroSequence() {
    const [welcomeDone, setWelcomeDone] = useState(false);

    // Prevent browser from restoring scroll position on refresh
    useEffect(() => {
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
        window.scrollTo(0, 0);
    }, []);

    // Lock scrolling while the welcome screen is active
    useEffect(() => {
        let timer: number;

        if (!welcomeDone) {
            document.body.style.overflow = 'hidden';
            lenis.stop(); // Stop smooth scrolling via Lenis
        } else {
            timer = window.setTimeout(() => {
                document.body.style.overflow = '';
                lenis.start(); // Restore smooth scrolling
            }, SLIDE_DURATION_MS + 500); // 500ms buffer after the animation completes
        }

        return () => {
            if (timer) clearTimeout(timer);
            // Always ensure we unlock the scroll if the component unmounts
            document.body.style.overflow = '';
            lenis.start(); 
        };
    }, [welcomeDone]);

    const handleWelcomeDone = useCallback(() => {
        setWelcomeDone(true);
    }, []);

    return {
        welcomeDone,
        handleWelcomeDone,
    };
}
