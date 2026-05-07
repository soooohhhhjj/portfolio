// src/hooks/useModalBehavior.ts
import { useEffect } from 'react';
import { lenis } from '../lib/lenis';

export function useModalBehavior(isOpen: boolean, onClose: () => void) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            lenis.stop();
        } else {
            document.body.style.overflow = '';
            lenis.start();
        }
        return () => {
            document.body.style.overflow = '';
            lenis.start();
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