import { ModalOverlay } from './ModalOverlay';
import { AnimatedCloseIcon } from './AnimatedCloseIcon';
import { hireModalData } from '../../data/hireModalData';
import { motion } from 'framer-motion';

interface HireModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const renderTextWithHighlights = (text: string) => {
  const parts = text.split(/(<highlight>.*?<\/highlight>)/g);
  return parts.map((part, i) => {
    if (part.startsWith('<highlight>') && part.endsWith('</highlight>')) {
      const content = part.slice(11, -12);
      return <span key={i} className="hm-ht">{content}</span>;
    }
    return <span key={i}>{part}</span>;
  });
};

const SectionTitle = ({ title }: { title: string }) => (
  <div className="absolute top-0 left-0 w-full border-b border-dashed border-white/30 bg-black/20
        flex items-center justify-center py-2 font-anta text-[11px] hmcc-title tracking-[3px]">
    <span>
      {title}
    </span>
  </div>
);

export function HireModal({ isOpen, onClose }: HireModalProps) {
  return (
    <ModalOverlay
      isOpen={isOpen}
      onClose={onClose}
      backdrop={<div className="wh-full grid-background gb--bottom-border" />}
    >
      {/* Scrollable area that centers content vertically when there's space */}
      <div 
        className="relative wh-full overflow-y-auto"
        onClick={onClose}
      >
        <div className="f-y-center min-h-full py-12">
          <div 
            className="content-width"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="f-col gap-4 font-jura
                  text-[17px] leading-snug"> {/* <-- control here the text of all containers */}
              
              {/* === ROW 1: Header & Close Icon === */}
              <div className="f-col md:f-row gap-4">
                {/* Header Container (takes remaining space) */}
                <motion.div 
                  className="f-row-sb flex-1 w-full md:w-auto hmc-bd px-6 py-5 font-jura hmh-title"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50, transition: { duration: 0.2, ease: "easeIn" } }}
                  transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
                >
                  <span className="block w-full text-[22px] sm:text-[27px] text-center md:text-left tracking-[1px]">{hireModalData.header}</span> {/* <-- text of the header */}
                </motion.div>
                
                {/* Close Icon Container (fixed square-ish width) */}
                <motion.div 
                  className="hidden md:f-xy-center w-[82px] hmc-bd "
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50, transition: { duration: 0.2, ease: "easeIn" } }}
                  transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
                >
                  <button
                    type="button"
                    className="group cursor-pointer p-4"
                    onClick={onClose}
                    aria-label="Close modal">
                    <AnimatedCloseIcon size={26} strokeWidth={1.3}/>
                  </button>
                </motion.div>
              </div>

              {/* === ROW 2: Intro (Left) & Location/Schedule (Right) === */}
              <div className="f-col md:f-row gap-4">
                
                {/* Left Column: Intro Text */}
                <motion.div 
                  className="relative md:w-[55%] hmc-bd p-6 pt-12 f-col-sb"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50, transition: { duration: 0.2, ease: "easeIn" } }}
                  transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }}
                >
                  <SectionTitle title={hireModalData.intro.title} />
                  {hireModalData.intro.text.map((paragraph, index) => (
                    <p key={index} className={paragraph.startsWith('-') ? "text-right" : ""}>
                      {renderTextWithHighlights(paragraph)}
                    </p>
                  ))}
                </motion.div>

                {/* Right Column: Location & Schedule */}
                <div className="md:w-[45%] f-col gap-4">
                  
                  {/* Location Container */}
                  <motion.div 
                    className="relative hmc-bd p-6 pt-12 f-col"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50, transition: { duration: 0.2, ease: "easeIn" } }}
                    transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }}
                  >
                    <SectionTitle title={hireModalData.location.title} />
                    {hireModalData.location.text.map((paragraph, index) => (
                      <p key={index}>
                        {renderTextWithHighlights(paragraph)}
                      </p>
                    ))}
                  </motion.div>

                  {/* Schedule Container (flex-1 to stretch and fill remaining vertical height if needed) */}
                  <motion.div 
                    className="relative flex-1 hmc-bd p-6 pt-12 f-col gap-4"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50, transition: { duration: 0.2, ease: "easeIn" } }}
                    transition={{ delay: 0.4, duration: 0.4, ease: "easeOut" }}
                  >
                    <SectionTitle title={hireModalData.schedule.title} />
                    {hireModalData.schedule.text.map((paragraph, index) => (
                      <p key={index}>
                        {renderTextWithHighlights(paragraph)}
                      </p>
                    ))}
                  </motion.div>

                </div>
              </div>

              {/* === ROW 3: Mobile Close Button === */}
              <motion.div 
                className="f-xy-center md:hidden w-full hmc-bd py-4 font-anta tracking-[3px] hmcc-title cursor-pointer"
                onClick={onClose}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50, transition: { duration: 0.2, ease: "easeIn" } }}
                transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }}
              >
                <span className="text-center text-[15px]">EXIT</span>
              </motion.div>

            </div>

          </div>
        </div>
      </div>
    </ModalOverlay>
  );
}