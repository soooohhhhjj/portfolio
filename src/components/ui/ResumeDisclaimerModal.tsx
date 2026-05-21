import { FileText } from 'lucide-react';
import { ModalOverlay } from './ModalOverlay';
import './ResumeDisclaimerModal.css';

type ResumeDisclaimerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function ResumeDisclaimerModal({
  isOpen,
  onClose,
  onConfirm,
}: ResumeDisclaimerModalProps) {
  return (
    <ModalOverlay
      isOpen={isOpen}
      onClose={onClose}
      variant="fade"
      backdrop={<div className="w-full h-full bg-black/60 backdrop-blur-[3px]" />}
    >
      <div className="rdm-wrap" onClick={onClose}>
        <div className="rdm-dg" onClick={(e) => e.stopPropagation()}>
          <div className="rdmc-ct">
            <div className="rdmc-icw">
              <FileText className="rdmc-ic" />
            </div>
            <h3 className="rdm-tt">
              Resume Notice
            </h3>
            <p className="rdmc-cp">
              This is a general version of my resume.
              The one shown may differ from what I submitted for a specific application.
            </p>
            <button
              type="button"
              className="rdmc-btn font-jura"
              onClick={onConfirm}
            >
              I Understand
            </button>
          </div>
        </div>
      </div>
    </ModalOverlay>
  );
}
