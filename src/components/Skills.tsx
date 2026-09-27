import { motion } from "framer-motion";
import { DATA } from "../data/resume";
import { monogram } from "../lib/text";
import { FloatingBlossoms } from "./SakuraDecor";

export function Skills() {
  return (
    <section className="section skills-section" aria-label="Skills">
      <FloatingBlossoms />
      <div className="container">
        <span className="eyebrow skills-eyebrow">Skills</span>
        <div className="charm-bracelet">
          <svg className="charm-string" viewBox="0 0 100 6" preserveAspectRatio="none" aria-hidden="true">
            <line x1="0" y1="3" x2="100" y2="3" stroke="currentColor" strokeWidth="0.6" strokeDasharray="1.6 2.4" />
          </svg>
          <ul className="charm-list">
            {DATA.skills.map((skill, i) => (
              <motion.li
                key={skill.name}
                className={`charm ${i % 2 === 0 ? "charm--sakura" : "charm--lavender"}`}
                initial={{ opacity: 0, y: 14, rotate: i % 2 === 0 ? -6 : 6 }}
                whileInView={{
                  opacity: 1,
                  y: [0, -6, 0],
                  rotate: i % 2 === 0 ? -2.5 : 2.5,
                }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{
                  opacity: { duration: 0.5, delay: i * 0.06 },
                  rotate: { duration: 0.5, delay: i * 0.06 },
                  y: {
                    duration: 2.6 + (i % 3) * 0.4,
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: "easeInOut",
                    delay: i * 0.15,
                  },
                }}
                whileHover={{
                  y: -10,
                  rotate: 0,
                  scale: 1.08,
                  transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
                }}
              >
                <span className="charm-mono">{monogram(skill.name)}</span>
                <span className="charm-label">{skill.name}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
