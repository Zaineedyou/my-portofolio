import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Skills } from "./components/Skills";
import { Projects } from "./components/Projects";
import { FieldNotes } from "./components/FieldNotes";
import { Contact } from "./components/Contact";
import "./styles/sections.css";

export default function App() {
  return (
    <main>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <FieldNotes />
      <Contact />
    </main>
  );
}
