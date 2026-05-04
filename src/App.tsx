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
    <div className="bg-black text-white px-9 
    flex flex-col gap-6">
    <Navbar />

    <main className="flex flex-col gap-6">
      <Hero/>
      <RelevantExperiences/>
      <SkillsNTools/>
    </main>

    <Footer/>
    </div>
  )
}