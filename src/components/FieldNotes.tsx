import { motion } from "framer-motion";
import { FIELD_NOTES } from "../data/fieldNotes";
import { CornerBlossom } from "./SakuraDecor";

export function FieldNotes() {
  return (
    <section className="section fieldnotes-section" aria-label="Field Notes">
      <div className="container">
        <span className="eyebrow fieldnotes-eyebrow">Field Notes</span>

        <div className="fieldnotes-grid">
          <motion.blockquote
            className="fieldnotes-quote card"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <CornerBlossom className="fieldnotes-blossom" />
            <p>&ldquo;{FIELD_NOTES.quote}&rdquo;</p>
          </motion.blockquote>

          <ol className="fieldnotes-list">
            {FIELD_NOTES.points.map((point, i) => (
              <motion.li
                key={point.title}
                className="fieldnotes-item"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="fieldnotes-index">{String(i + 1).padStart(2, "0")}</span>
                <div className="fieldnotes-item-body">
                  <h3 className="fieldnotes-item-title">{point.title}</h3>
                  <p className="fieldnotes-item-desc">{point.description}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
