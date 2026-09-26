import { motion } from "framer-motion";
import { DATA } from "../data/resume";
import { monogram } from "../lib/text";

export function Skills() {
  return (
    <section className="section skills-section" aria-label="Skills">
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
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
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
