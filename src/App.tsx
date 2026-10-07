import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DATA, type Project } from "./data/resume";
import { FIELD_NOTES } from "./data/fieldNotes";
import "./index.css";

const ALL = "All";

function ExternalMark() {
  return <span aria-hidden="true" className="external-mark">↗</span>;
}

function SocialLinks({ compact = false }: { compact?: boolean }) {
  return (
    <nav className={compact ? "social-links social-links--compact" : "social-links"} aria-label="Social links">
      {Object.values(DATA.contact.social).map((social) => (
        <a key={social.name} href={social.url} target="_blank" rel="noreferrer">
          {social.name}
          <ExternalMark />
        </a>
      ))}
    </nav>
  );
}

function ProjectVisual({ project }: { project: Project }) {
  if (project.image) {
    return <img src={project.image} alt={`${project.title} project preview`} loading="lazy" />;
  }

  return (
    <div className="project-visual project-visual--type" aria-label={`No preview image supplied for ${project.title}`}>
      <span className="visual-kicker">Source / build</span>
      <strong>{project.title}</strong>
      <span className="visual-line" />
      <span className="visual-foot">Open the repository to inspect the work</span>
    </div>
  );
}

function ProjectRow({ project, index }: { project: Project; index: number }) {
  return (
    <motion.article
      className="project-row"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay: Math.min(index * 0.04, 0.2) }}
    >
      <div className="project-number">{String(index + 1).padStart(2, "0")}</div>
      <div className="project-main">
        <div className="project-copy">
          <p className="project-meta">{project.dates} / {project.technologies[0]}</p>
          <h3>{project.title}</h3>
          <p>{project.description}</p>
          <div className="project-actions">
            {project.links.map((link) => (
              <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className="text-link">
                {link.type} <ExternalMark />
              </a>
            ))}
          </div>
        </div>
        <div className="project-media"><ProjectVisual project={project} /></div>
      </div>
    </motion.article>
  );
}

function App() {
  const [activeCategory, setActiveCategory] = useState(ALL);
  const categories = useMemo(() => {
    const values = DATA.projects.map((project) => project.technologies[0]).filter(Boolean);
    return [ALL, ...Array.from(new Set(values))];
  }, []);
  const filteredProjects = activeCategory === ALL
    ? DATA.projects
    : DATA.projects.filter((project) => project.technologies[0] === activeCategory);

  return (
    <div className="site-shell">
      <a className="skip-link" href="#content">Skip to content</a>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Back to top">Zaineedyou<span>.</span></a>
        <nav className="primary-nav" aria-label="Primary navigation">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#notes">Notes</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className="header-location" href={DATA.locationLink} target="_blank" rel="noreferrer">{DATA.location}</a>
      </header>

      <main id="content">
        <section className="hero-section" id="top" aria-labelledby="hero-title">
          <div className="hero-rule" aria-hidden="true" />
          <div className="hero-grid">
            <div className="hero-intro">
              <p className="eyebrow">Personal space / project archive</p>
              <h1 id="hero-title">A place for the work in progress.</h1>
              <p className="hero-lede">An imperfect index of software, experiments, notes, and things I kept building after the easy version stopped being interesting.</p>
              <div className="hero-actions">
                <a className="button button--accent" href="#work">See selected work <ExternalMark /></a>
                <a className="button button--quiet" href="#contact">Start a conversation</a>
              </div>
            </div>
            <div className="hero-aside">
              <div className="hero-portrait-wrap">
                <img src={DATA.avatarUrl} alt={DATA.name} className="hero-portrait" />
                <span className="portrait-caption">Working from {DATA.location}</span>
              </div>
              <p className="hero-index">001 / Portfolio index<br />Build, test, refine.</p>
            </div>
          </div>
          <div className="hero-bottomline">
            <span>Not a pitch deck. Just the archive.</span>
            <a href={DATA.url} target="_blank" rel="noreferrer">{DATA.url.replace("https://", "")} <ExternalMark /></a>
          </div>
        </section>

        <section className="intro-section" id="about" aria-labelledby="about-title">
          <div className="section-label"><span>01</span><span>About</span></div>
          <div className="intro-content">
            <h2 id="about-title">The constraint is often where the idea gets sharper.</h2>
            <p>{DATA.summary}</p>
            <div className="skill-line" aria-label="Technical skills">
              {DATA.skills.map((skill) => <span key={skill.name}>{skill.name}</span>)}
            </div>
          </div>
        </section>

        <section className="work-section" id="work" aria-labelledby="work-title">
          <div className="section-heading">
            <div className="section-label"><span>02</span><span>Selected work</span></div>
            <h2 id="work-title">Things I built, broke,<br /><em>and kept.</em></h2>
          </div>
          <div className="filter-bar" role="tablist" aria-label="Filter projects by primary technology">
            {categories.map((category) => (
              <button key={category} type="button" role="tab" aria-selected={activeCategory === category} className={activeCategory === category ? "filter-button is-active" : "filter-button"} onClick={() => setActiveCategory(category)}>
                {category}
              </button>
            ))}
          </div>
          <div className="project-list">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => <ProjectRow key={project.title} project={project as Project} index={index} />)}
            </AnimatePresence>
          </div>
        </section>

        <section className="statement-section" aria-label="Working approach">
          <p className="statement">Good software keeps its promises after the novelty wears off.</p>
          <span className="statement-mark">/</span>
        </section>

        <section className="notes-section" id="notes" aria-labelledby="notes-title">
          <div className="section-label"><span>03</span><span>Field notes</span></div>
          <div className="notes-layout">
            <blockquote><p>“{FIELD_NOTES.quote}”</p><cite>Working principle</cite></blockquote>
            <div className="notes-list">
              {FIELD_NOTES.points.map((point, index) => (
                <article key={point.title} className="note-item">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div><h3>{point.title}</h3><p>{point.description}</p></div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer" id="contact">
        <div className="footer-top">
          <div>
            <p className="eyebrow">No pitch deck. No polished case study.</p>
            <h2>Keep digging<br /><em>through the archive.</em></h2>
          </div>
          <a className="footer-cta" href="#work">Open the archive <ExternalMark /></a>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {DATA.name}</span>
          <SocialLinks compact />
          <a href="#top">Back to top ↑</a>
        </div>
      </footer>
    </div>
  );
}

export default App;
