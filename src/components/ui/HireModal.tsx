import { ModalOverlay } from './ModalOverlay';

interface HireModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function HireModal({ isOpen, onClose }: HireModalProps) {
  return (
    <ModalOverlay isOpen={isOpen} onClose={onClose}
     backdropClassName="bg-[#0a0a0f] border-b border-[rgb(247,247,217)]">
        <div className="relative w-full min-h-screen pt-20 pb-8">
            <button
                type="button"
                className="absolute top-6 right-0 font-jura uppercase tracking-[0.16rem]
                bg-transparent border-0 base-text cursor-pointer"
                onClick={onClose}
                aria-label="Close modal">Close
            </button>
        {/* content here */}
      </div>
    </ModalOverlay>
  );
}