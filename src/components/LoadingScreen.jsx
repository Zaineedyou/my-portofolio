import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function LoadingScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 2400);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          exit={{ y: '-100%', transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: '#0a0a0f',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '24px',
          }}
        >
          <div style={{ overflow: 'hidden', position: 'relative' }}>
            <motion.h1
              initial={{ y: '100%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 1.0, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: 'clamp(3rem, 12vw, 8rem)',
                fontWeight: 700,
                letterSpacing: '-0.04em',
                color: '#f5f0ff',
                margin: 0,
                lineHeight: 1,
              }}
            >
              Zaineedyou
            </motion.h1>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.0, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: 'linear-gradient(90deg, #e8336b, #ff80a8)',
                transformOrigin: 'left',
              }}
            />
          </div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.9 }}
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '12px',
              color: '#9d97b0',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              margin: 0,
            }}
          >
            Fullstack Dev & Engineering Architect
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.4 }}
            style={{ position: 'absolute', bottom: '48px', display: 'flex', gap: '6px' }}
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: [0, 1, 1, 0] }}
                transition={{
                  duration: 1.0,
                  delay: 1.3 + i * 0.12,
                  repeat: Infinity,
                  repeatDelay: 0.2,
                  ease: 'easeInOut',
                }}
                style={{
                  display: 'block',
                  width: '24px',
                  height: '2px',
                  background: i === 1 ? '#e8336b' : '#5c5875',
                  transformOrigin: 'left',
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
