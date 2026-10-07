import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DATA, type Project } from "./data/resume";
import { FIELD_NOTES } from "./data/fieldNotes";
import "./index.css";

const ALL = "All";

function Arrow() {
  return <span aria-hidden="true" className="arrow">↗</span>;
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.article
      className="archive-card"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.04, 0.18) }}
    >
      <div className="archive-card-top">
        <span className="number-sticker">{String(index + 1).padStart(2, "0")}</span>
        <span className="archive-year">{project.dates}</span>
      </div>
      {project.image ? (
        <div className="archive-image-frame"><img src={project.image} alt={`${project.title} project preview`} loading="lazy" /></div>
      ) : (
        <div className="archive-image-frame archive-image-frame--empty" aria-label={`No preview supplied for ${project.title}`}>
          <span>{project.title}</span>
          <small>source archive</small>
        </div>
      )}
      <h3>{project.title}</h3>
      <p>{project.description}</p>
      <div className="tag-row">
        {project.technologies.slice(0, 3).map((technology) => <span className="tag" key={technology}>{technology}</span>)}
      </div>
      <div className="archive-links">
        {project.links.map((link) => (
          <a href={link.href} target="_blank" rel="noreferrer" key={link.href}>{link.type} <Arrow /></a>
        ))}
      </div>
    </motion.article>
  );
}

function App() {
  const [activeCategory, setActiveCategory] = useState(ALL);
  const categories = useMemo(() => [ALL, ...Array.from(new Set(DATA.projects.map((project) => project.technologies[0])))], []);
  const filteredProjects = activeCategory === ALL ? DATA.projects : DATA.projects.filter((project) => project.technologies[0] === activeCategory);
  const featuredProjects = DATA.projects.slice(0, 3);

  return (
    <div className="claudia-layout">
      <a className="skip-link" href="#content">Skip to content</a>
      <nav className="top-nav" aria-label="Primary navigation">
        <a className="claudia-logo" href="#top">Zaineedyou</a>
        <div className="nav-links">
          <a href="#archive">Archive</a>
          <a href="#about">About</a>
          <a href="#notes">Notes</a>
          <a className="nav-button" href={DATA.contact.social.GitHub.url} target="_blank" rel="noreferrer">GitHub <Arrow /></a>
        </div>
      </nav>

      <main id="content" className="page-wrap">
        <section className="hero-card card" id="top" aria-labelledby="hero-title">
          <div className="swoosh swoosh-hero" aria-hidden="true" />
          <div className="hero-copy">
            <p className="date-sticker">PERSONAL / ARCHIVE</p>
            <div className="hero-sticker">Zaineedyou</div>
            <p className="hero-byline">Hi, this is my corner of the internet.</p>
            <h1 id="hero-title">Software, experiments, notes, and things I refused to leave unfinished.</h1>
            <p className="hero-lead">{DATA.summary}</p>
            <div className="hero-actions">
              <a className="btn btn-tan" href="#archive">Open the archive <Arrow /></a>
              <a className="btn btn-alt" href="#notes">Read the notes</a>
            </div>
          </div>
          <div className="hero-art">
            <img src={DATA.avatarUrl} alt={DATA.name} />
            <span className="hero-caption">{DATA.location} / still building</span>
          </div>
        </section>

        <div className="stripbar" aria-label="Archive categories">
          <strong>#PERSONALARCHIVE</strong>
          <span>Code · memory · constraints · criticism</span>
        </div>

        <section className="metrics" aria-label="Archive counts">
          <div className="card metric"><strong>{DATA.projects.length}</strong><span>project entries</span></div>
          <div className="card metric"><strong>{DATA.skills.length}</strong><span>tools in rotation</span></div>
          <div className="card metric"><strong>{FIELD_NOTES.points.length}</strong><span>field notes</span></div>
          <div className="card metric"><strong>∞</strong><span>unfinished ideas</span></div>
        </section>

        <section className="section-block" id="about" aria-labelledby="about-title">
          <div className="section-heading"><h2 id="about-title">About</h2><span className="sticker-note">Built under constraints</span></div>
          <div className="about-grid">
            <div className="card about-card">
              <p className="large-copy">The constraint is often where the idea gets sharper.</p>
              <p>{DATA.summary}</p>
            </div>
            <div className="card skill-card">
              <h3>Tools I keep close</h3>
              <div className="tag-cloud">{DATA.skills.map((skill) => <span className="pill" key={skill.name}>{skill.name}</span>)}</div>
            </div>
          </div>
        </section>

        <section className="section-block" id="archive" aria-labelledby="archive-title">
          <div className="section-heading"><h2 id="archive-title">Archive</h2><span className="sticker-note">Things I built, broke, and kept</span></div>
          <div className="featured-grid">
            {featuredProjects.map((project, index) => <ProjectCard project={project} index={index} key={project.title} />)}
          </div>
          <div className="archive-index-header">
            <h3>Every entry</h3>
            <div className="filter-tabs" role="tablist" aria-label="Filter archive by primary technology">
              {categories.map((category) => <button key={category} role="tab" type="button" aria-selected={activeCategory === category} onClick={() => setActiveCategory(category)}>{category}</button>)}
            </div>
          </div>
          <div className="index-list">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <motion.article className="index-row" key={project.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                  <span className="index-number">{String(index + 1).padStart(2, "0")}</span>
                  <strong>{project.title}</strong>
                  <span>{project.technologies.join(" · ")}</span>
                  <a href={project.href} target="_blank" rel="noreferrer" aria-label={`Open ${project.title}`}>Open <Arrow /></a>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        </section>

        <section className="section-block" id="notes" aria-labelledby="notes-title">
          <div className="section-heading"><h2 id="notes-title">Field notes</h2><span className="sticker-note">No polished case study</span></div>
          <div className="notes-grid">
            <blockquote className="card quote-card"><p>“{FIELD_NOTES.quote}”</p><cite>Working principle</cite></blockquote>
            <div className="note-stack">
              {FIELD_NOTES.points.map((point, index) => <article className="card note-card" key={point.title}><span className="note-number">{String(index + 1).padStart(2, "0")}</span><div><h3>{point.title}</h3><p>{point.description}</p></div></article>)}
            </div>
          </div>
        </section>

        <section className="card closing-card" aria-label="Closing note">
          <div className="swoosh swoosh-closing" aria-hidden="true" />
          <h2>Keep digging.<br /><span>There is more in here.</span></h2>
          <a className="btn btn-dark" href="#top">Back to top <Arrow /></a>
        </section>
      </main>

      <footer className="footer page-wrap">
        <div><strong className="claudia-logo">Zaineedyou</strong><p>Personal space, project archive, and occasional refusal to shut up.</p></div>
        <div className="footer-links"><a href={DATA.contact.social.GitHub.url} target="_blank" rel="noreferrer">GitHub</a><a href={DATA.contact.social.Discord.url} target="_blank" rel="noreferrer">Discord</a><a href={DATA.contact.social.Instagram.url} target="_blank" rel="noreferrer">Instagram</a></div>
        <span>© {new Date().getFullYear()} {DATA.name}</span>
      </footer>
    </div>
  );
}

export default App;
