// src/hooks/useModalBehavior.ts
import { useEffect } from 'react';
import { lenis } from '../lib/lenis';

export function useModalBehavior(isOpen: boolean, onClose: () => void) {
    useEffect(() => {
        if (isOpen) {
            const scrollY = window.scrollY;
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed'; // fixes iOS bleed
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            lenis.stop(); // still needed
        } else {
            const scrollY = document.body.style.top;
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            window.scrollTo(0, -parseInt(scrollY || '0')); // restore position
            lenis.start();
        }

        return () => {
            if (document.body.style.position === 'fixed') {
                const scrollY = document.body.style.top;
                document.body.style.overflow = '';
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.width = '';
                window.scrollTo(0, -parseInt(scrollY || '0'));
                lenis.start();
            }
        };
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);
}