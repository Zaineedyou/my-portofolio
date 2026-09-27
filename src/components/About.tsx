import { motion } from "framer-motion";
import { DATA } from "../data/resume";
import { CornerBlossom, PetalDrift, FloatingBlossoms } from "./SakuraDecor";

export function About() {
  return (
    <section className="section about-section" aria-label="About">
      <PetalDrift />
      <FloatingBlossoms />
      <div className="container">
        <motion.div
          className="card about-card"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -4 }}
        >
          <CornerBlossom className="about-blossom" />
          <span className="eyebrow">About</span>
          <p className="about-text">{DATA.summary}</p>
        </motion.div>
      </div>
    </section>
  );
}
