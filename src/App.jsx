import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TechStack } from './components/TechStack';
import { Projects } from './components/Projects';
import { VibeSection } from './components/VibeSection';
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
          <TechStack />
        </SectionReveal>
        <SectionReveal>
          <Projects />
        </SectionReveal>
        <SectionReveal>
          <VibeSection />
        </SectionReveal>
        <SectionReveal>
          <Contact />
        </SectionReveal>
      </main>
    </div>
  );
}
