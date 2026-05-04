//src/App.tsx

//Import Sections
import Hero from "./components/sections/Hero"
import RelevantExperiences from "./components/sections/RelevantExperiences"
import SkillsNTools from "./components/sections/Skills&Tools"

//Import Layouts
import Navbar from "./components/layout/Navbar"
import Footer from "./components/layout/Footer"

//Import Hooks
import { useLenis } from "./hooks/useLenis";

export default function App() {
  useLenis();

  return (
    <div className="f-col gap-6 px-3 sm:px-0">
    <Navbar />

    <main className="f-col gap-6">
      <Hero/>
      <RelevantExperiences/>
      <SkillsNTools/>
    </main>

    <Footer/>
    </div>
  )
}