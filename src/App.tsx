//src/App.tsx

//Import Sections
import Welcome from "./components/welcome/Welcome"
import Hero from "./components/sections/Hero"
import RelevantExperiences from "./components/sections/RelevantExperiences"
import SkillsNTools from "./components/sections/Skills&Tools"

import { StarfieldBackground } from "./components/background/StarfieldBackground";

//Import Layouts
import Navbar from "./components/layout/Navbar"
import Footer from "./components/layout/Footer"

//Import Hooks
import { useLenis } from "./hooks/useLenis";
import { useIntroSequence } from "./hooks/useIntroSequence";

import { motion, AnimatePresence } from "framer-motion";
import { SLIDE_TRANSITION, slideTransitionWithDuration } from "./lib/animations";

export default function App() {
  useLenis();
  const { welcomeVisible, contentVisible, introDone, starMode, handleWelcomeDone } = useIntroSequence();

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
          <Hero contentVisible={contentVisible} />
          <motion.div
            initial={{ y: '100vh' }}
            animate={{ y: contentVisible ? 0 : '100vh' }}
            transition={slideTransitionWithDuration(2)}
          >
            <RelevantExperiences />
          </motion.div>
          <motion.div
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
          <Footer />
        </motion.div>
      </div>
    </div>
  );
}

