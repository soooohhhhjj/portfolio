import { type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useModalBehavior } from '../../hooks/useModalBehavior';

interface ModalOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    backdrop?: ReactNode;
}

export function ModalOverlay({ isOpen, onClose, children, backdrop }: ModalOverlayProps) {
    useModalBehavior(isOpen, onClose);

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50"
                    initial={{ y: '-100vh' }}
                    animate={{ y: 0 }}
                    exit={{ y: '-100vh' }}
                    transition={{ duration: 0.3, ease: [0.12, 0.7, 0.63, 0.9] }}
                    onClick={onClose}
                >
                    {/* Backdrop layer */}
                    <div className="absolute inset-0">
                        {backdrop ?? <div className="w-full h-full bg-black" />}
                    </div>

                    {/* Content layer */}
                    <div className="absolute inset-0 flex justify-center items-start">
                        <div className="content-width w-full min-h-screen"
                         onClick={(e) => e.stopPropagation()}>
                            {children}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
}