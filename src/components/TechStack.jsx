import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import BorderGlow from './BorderGlow';

const stack = [
  { category: 'Languages', items: ['Rust', 'Go', 'JavaScript', 'Kotlin', 'C++'] },
  { category: 'Backend', items: ['Node.js', 'Chi'] },
  { category: 'Frontend', items: ['React', 'Vite', 'Tailwind CSS', 'HTML5', 'CSS3'] },
  { category: 'Tools & DevOps', items: ['Git', 'GitHub', 'Vercel', 'Railway', 'Termux', 'Linux', 'CMake'] },
];

function TechCard({ category, items, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: '0px 0px -50px 0px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <BorderGlow
        animated={inView}
        backgroundColor="#13131a"
        borderRadius={16}
        glowColor="340 80 70"
        glowIntensity={1.5}
        colors={['#e8336b', '#ff80a8', '#c084fc']}
        edgeSensitivity={21}
        glowRadius={28}
        coneSpread={25}
      >
        <div style={{ padding: '20px 24px' }}>
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#ff80a8', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '14px' }}>
            {category}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {items.map((item) => (
              <span
                key={item}
                style={{
                  padding: '5px 12px',
                  borderRadius: '6px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '12px',
                  color: '#9d97b0',
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </BorderGlow>
    </motion.div>
  );
}

export function TechStack() {
  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { once: false, margin: '0px 0px -40px 0px' });

  return (
    <section style={{ borderTop: '1px solid rgba(255,255,255,0.04)', padding: '96px 0' }}>
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 24 }}
          animate={titleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: '40px' }}
        >
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#ff80a8', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px' }}>
            tech stack
          </p>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.02em', color: '#f5f0ff', margin: 0 }}>
            Tools I work with
          </h2>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
          {stack.map((group, i) => (
            <TechCard key={group.category} category={group.category} items={group.items} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
