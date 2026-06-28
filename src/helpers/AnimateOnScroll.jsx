import { useRef } from 'react';
import { motion, useInView } from 'motion/react';

const hidden = {
  up: { opacity: 0, y: 28 },
  left: { opacity: 0, x: -28 },
  right: { opacity: 0, x: 28 },
  scale: { opacity: 0, scale: 0.92 },
  fade: { opacity: 0 },
};

const visible = {
  up: { opacity: 1, y: 0 },
  left: { opacity: 1, x: 0 },
  right: { opacity: 1, x: 0 },
  scale: { opacity: 1, scale: 1 },
  fade: { opacity: 1 },
};

export function AnimateOnScroll({ children, direction = 'up', delay = 0, className }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: '0px 0px -50px 0px' });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={hidden[direction]}
      animate={isInView ? visible[direction] : hidden[direction]}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
