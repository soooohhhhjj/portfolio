//src/App.tsx

import { useState } from 'react';

//Import Sections
import Welcome from "./components/welcome/Welcome"
import Hero from "./components/sections/Hero"
import RelevantExperiences from "./components/sections/RelevantExperiences"
import SkillsNTools from "./components/sections/Skills&Tools"

import { StarfieldBackground } from "./components/background/StarfieldBackground";

//Import Layouts
import Navbar from "./components/layout/Navbar"
import Footer from "./components/layout/Footer"

//Import UI
import { ResumeDisclaimerModal } from "./components/ui/ResumeDisclaimerModal";

//Import Hooks
import { useLenis } from "./hooks/useLenis";
import { useIntroSequence } from "./hooks/useIntroSequence";

import { motion, AnimatePresence } from "framer-motion";
import { SLIDE_TRANSITION, slideTransitionWithDuration } from "./lib/animations";

export default function App() {
  useLenis();
  const { welcomeVisible, contentVisible, introDone, starMode, handleWelcomeDone } = useIntroSequence();
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

  const resumeUrl = `${import.meta.env.BASE_URL}Abellera-Carlo_Joshua_B.pdf`;

  const handleConfirmResume = () => {
    window.open(resumeUrl, '_blank', 'noopener,noreferrer');
    setIsResumeModalOpen(false);
  };

  return (
    <div className="f-col gap-6 overflow-x-hidden">
      <StarfieldBackground mode={starMode} />

      <AnimatePresence>
        {welcomeVisible && (
          <motion.div
            className="fixed inset-0 z-50"
            exit={{ y: '-100vh' }}
            transition={SLIDE_TRANSITION}
          >
            <Welcome onDone={handleWelcomeDone} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="f-col gap-6">
        <Navbar introDone={introDone} contentVisible={contentVisible} />
        <main className="f-col 
         gap-32 md:gap-24 lg:gap-32">
          <Hero contentVisible={contentVisible} onResumeClick={() => setIsResumeModalOpen(true)} />
          <motion.div
            id="relevant-experiences-section"
            initial={{ y: '100vh' }}
            animate={{ y: contentVisible ? 0 : '100vh' }}
            transition={slideTransitionWithDuration(2)}
          >
            <RelevantExperiences />
          </motion.div>
          <motion.div
            id="skills-section"
            initial={{ y: '100vh' }}
            animate={{ y: contentVisible ? 0 : '100vh' }}
            transition={slideTransitionWithDuration(2.05)}
          >
            <SkillsNTools />
          </motion.div>
        </main>
        <motion.div
          initial={{ y: '100vh' }}
          animate={{ y: contentVisible ? 0 : '100vh' }}
          transition={slideTransitionWithDuration(2.1)}
        >
          <Footer onResumeClick={() => setIsResumeModalOpen(true)} />
        </motion.div>
      </div>

      <ResumeDisclaimerModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
        onConfirm={handleConfirmResume}
      />
    </div>
  );
}

