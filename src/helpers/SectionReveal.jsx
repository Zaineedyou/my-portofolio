import { useRef } from 'react';
import { motion, useInView } from 'motion/react';

export function SectionReveal({ children, className }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: '0px 0px -80px 0px' });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 40, scale: 0.98 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.98 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
