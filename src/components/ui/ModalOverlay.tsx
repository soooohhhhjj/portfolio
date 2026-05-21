import { type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useModalBehavior } from '../../hooks/useModalBehavior';

interface ModalOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    backdrop?: ReactNode;
    variant?: 'slide' | 'fade' | 'none';
}

export function ModalOverlay({ isOpen, onClose, children, backdrop, variant = 'slide' }: ModalOverlayProps) {
    useModalBehavior(isOpen, onClose);

    const animConfig = {
        slide: {
            initial: { y: '-100vh' },
            animate: { y: 0 },
            exit: { y: '-100vh', transition: { delay: 0.2, duration: 0.2, ease: 'easeInOut' as const } },
            transition: { duration: 0.2, ease: 'easeInOut' as const }
        },
        fade: {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0, transition: { duration: 0.15, ease: 'easeOut' as const } },
            transition: { duration: 0.15, ease: 'easeOut' as const }
        },
        none: {
            initial: {},
            animate: {},
            exit: {}
        }
    }[variant];

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50"
                    initial={animConfig.initial}
                    animate={animConfig.animate}
                    exit={animConfig.exit}
                    transition={'transition' in animConfig ? animConfig.transition : undefined}
                    onClick={onClose}
                >
                    {/* Backdrop layer */}
                    <div className="absolute inset-0">
                        {backdrop ?? <div className="w-full h-full bg-black" />}
                    </div>

                    {/* Content layer */}
                    <div className="absolute inset-0" onClick={(e) => e.stopPropagation()}>
                        {children}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
}