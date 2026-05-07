import { ModalOverlay } from './ModalOverlay';
import { GridBackground } from './GridBackground';
import { AnimatedCloseIcon } from './AnimatedCloseIcon';

interface HireModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HireModal({ isOpen, onClose }: HireModalProps) {
  return (
    <ModalOverlay
      isOpen={isOpen}
      onClose={onClose}
      backdrop={<GridBackground borderTop={false} borderBottom className="w-full h-full" />}
    >
      <div className="relative pt-20 pb-8">
        <button
          type="button"
          className="group absolute top-6 right-0 font-jura uppercase tracking-[0.16rem]
            bg-transparent border-0 base-text cursor-pointer"
          onClick={onClose}
          aria-label="Close modal"
        >
          <AnimatedCloseIcon className="base-text" />
        </button>
        {/* content here */}
      </div>
    </ModalOverlay>
  );
}