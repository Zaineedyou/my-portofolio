import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Projects } from './components/Projects';
import { Contact } from './components/Contact';
import { TargetCursor } from './components/TargetCursor';
import { SectionReveal } from './helpers/SectionReveal';
import { LoadingScreen } from './components/LoadingScreen';

export function App() {
  return (
    <div className="overflow-x-clip">
      <TargetCursor targetSelector=".cursor-target" spinDuration={2.8} hoverDuration={0.45} />
      <LoadingScreen />
      <Navbar />
      <main id="main-content" className="pt-16">
        <Hero />
        <SectionReveal>
          <Projects />
        </SectionReveal>
        <SectionReveal>
          <Contact />
        </SectionReveal>
      </main>
    </div>
  );
}
