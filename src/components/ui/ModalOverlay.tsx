// src/components/ui/ModalOverlay.tsx
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useModalBehavior } from '../../hooks/useModalBehavior';

interface ModalOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    backdropClassName?: string; // ← optional override per modal
}

export function ModalOverlay({ isOpen, onClose, children, backdropClassName }: ModalOverlayProps) {
    useModalBehavior(isOpen, onClose);

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className={`fixed inset-0 z-50 flex justify-center items-start ${backdropClassName ?? 'bg-black'}`}
                    initial={{ y: '-100vh' }}
                    animate={{ y: 0 }}
                    exit={{ y: '-100vh' }}
                    transition={{ duration: .3, ease: [0.12, 0.7, 0.63, 0.9] }}
                    onClick={onClose}
                >
                    <div
                        className="content-width w-full min-h-screen base-border border"
                        onClick={(e) => e.stopPropagation()}
                    >
                    {children}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
}