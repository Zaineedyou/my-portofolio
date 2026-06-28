import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { projects } from '../data/projects';
import { ProjectCard } from './ProjectCard';

function AnimatedCard({ project, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: '0px 0px -50px 0px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
    >
      <ProjectCard project={project} />
    </motion.div>
  );
}

export function Projects() {
  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { once: false, margin: '0px 0px -40px 0px' });

  return (
    <section id="projects" className="py-24 md:py-32">
      <motion.div
        ref={titleRef}
        className="max-w-5xl mx-auto px-6 md:px-10 mb-12"
        initial={{ opacity: 0, y: 24 }}
        animate={titleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#ff80a8', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px' }}>work</p>
        <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.02em', color: '#f5f0ff', margin: 0 }}>
          Things I've built
        </h2>
      </motion.div>

      <div
        className="max-w-5xl mx-auto px-6 md:px-10"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '20px',
        }}
      >
        {projects.map((project, i) => (
          <AnimatedCard key={project.id} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}
