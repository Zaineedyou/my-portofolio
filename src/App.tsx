import { useEffect, useMemo, useRef, useState } from "react";
import { DATA, type Project } from "./data/resume";
import { FIELD_NOTES } from "./data/fieldNotes";
import "./index.css";

const ALL = "All";
const HIDDEN_PROJECT_PREVIEWS = new Set(["CaineGO", "ClaudiaRPC-Rust"]);

function ProjectEntry({ project, ordinal }: { project: Project; ordinal: number }) {
  const hasImage = Boolean(project.image) && !HIDDEN_PROJECT_PREVIEWS.has(project.title);

  return (
    <article className={`project-entry${ordinal === 0 ? " project-entry--lead" : ""}${hasImage ? " project-entry--image" : ""}`}>
      <div className="project-number" aria-label={`Project ${String(ordinal + 1).padStart(2, "0")}`}>
        {String(ordinal + 1).padStart(2, "0")}
      </div>
      <div className="project-body">
        <div className="project-heading-row">
          <h3>{project.title}</h3>
          <span className="project-date">{project.dates}</span>
        </div>
        <p className="project-description">{project.description}</p>
        <ul className="technology-list" aria-label={`Technologies used for ${project.title}`}>
          {project.technologies.map((technology) => <li key={technology}>{technology}</li>)}
        </ul>
        <div className="project-links" aria-label={`${project.title} links`}>
          {project.links.map((link) => (
            <a href={link.href} target="_blank" rel="noreferrer" key={`${link.type}-${link.href}`}>
              {link.type}
            </a>
          ))}
        </div>
      </div>
      {hasImage && (
        <figure className="project-visual">
          <img src={project.image} alt={`${project.title} project preview`} loading="lazy" />
        </figure>
      )}
    </article>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const portfolioContentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let disposed = false;
    let completed = false;
    let fallbackTimer = 0;
    let revealTimer = 0;
    const startedAt = performance.now();
    const finish = () => {
      if (disposed || completed) return;
      completed = true;
      window.clearTimeout(fallbackTimer);
      window.clearTimeout(revealTimer);
      setIsLoading(false);
    };

    fallbackTimer = window.setTimeout(finish, 1600);
    const heroImageReady = new Promise<void>((resolve) => {
      const image = new window.Image();
      const settle = () => resolve();
      image.addEventListener("load", settle, { once: true });
      image.addEventListener("error", settle, { once: true });
      image.src = DATA.avatarUrl;
      if (image.complete) settle();
    });
    const fontsReady = document.fonts?.ready ?? Promise.resolve();

    void Promise.allSettled([fontsReady, heroImageReady]).then(() => {
      if (disposed || completed) return;
      const remaining = Math.max(0, 420 - (performance.now() - startedAt));
      revealTimer = window.setTimeout(finish, remaining);
    });

    return () => {
      disposed = true;
      window.clearTimeout(fallbackTimer);
      window.clearTimeout(revealTimer);
    };
  }, []);
  useEffect(() => {
    const content = portfolioContentRef.current;
    if (!content) return;
    if (isLoading) content.setAttribute("inert", "");
    else content.removeAttribute("inert");
  }, [isLoading]);

  const [activeCategory, setActiveCategory] = useState(ALL);
  const categories = useMemo(
    () => [ALL, ...Array.from(new Set(DATA.projects.map((project) => project.technologies[0])))],
    [],
  );
  const filteredProjects = activeCategory === ALL
    ? DATA.projects
    : DATA.projects.filter((project) => project.technologies[0] === activeCategory);
  const politicalNote = FIELD_NOTES.points.find((point) => point.title === "Fuck You, Human Rights Violator");
  const otherNotes = FIELD_NOTES.points.filter((point) => point !== politicalNote);

  return (
    <div className={`portfolio-shell${isLoading ? " portfolio-shell--loading" : ""}`}>
      {isLoading && (
        <div className="loading-screen" role="status" aria-live="polite">
          <div className="loading-content">
            <p className="loading-eyebrow">Personal archive / {DATA.location}</p>
            <p className="loading-brand">{DATA.name}</p>
            <div className="loading-track" aria-hidden="true"><span /></div>
            <p className="loading-status">Opening the archive</p>
          </div>
        </div>
      )}
      <div className="portfolio-content" ref={portfolioContentRef}>
      <a className="skip-link" href="#content">Skip to content</a>

      <header className="top-nav">
        <a className="site-mark" href="#top" aria-label={`${DATA.name}, home`}>{DATA.name}</a>
        <nav aria-label="Main navigation" className="nav-links">
          <a href="#about">About</a>
          <a href="#work">Work</a>
          <a href="#notes">Notes</a>
          <a className="nav-github" href={DATA.contact.social.GitHub.url} target="_blank" rel="noreferrer">GitHub</a>
        </nav>
      </header>

      <main id="content" className="page-wrap">
        <section className="hero" id="top" aria-labelledby="hero-title">
          <svg className="hero-swoosh" viewBox="0 0 500 300" fill="none" aria-hidden="true" preserveAspectRatio="none">
            <path d="M-30 240C150 150 330 230 540 110" stroke="currentColor" strokeWidth="40" strokeLinecap="round" />
          </svg>
          <div className="hero-copy">
            <p className="eyebrow">Personal archive / {DATA.location}</p>
            <h1 id="hero-title">I build software<br /><span>on Android.</span></h1>
            <p className="hero-intro">I work on backend systems and developer tools using Termux.</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#work">See the work</a>
            </div>
          </div>
          <figure className="hero-art">
            <div className="hero-image-wrap">
              <img src={DATA.avatarUrl} alt={DATA.name} fetchPriority="high" />
            </div>
            <figcaption><span>{DATA.name}</span><span>{DATA.location} / still building</span></figcaption>
          </figure>
          <div className="hero-foot" aria-hidden="true">
            <span>Code</span><span>Memory</span><span>Constraints</span><span>Criticism</span>
          </div>
        </section>

        <section className="about-section section-block" id="about" aria-labelledby="about-title">
          <div className="section-title">
            <p className="eyebrow">The person behind the commits</p>
            <h2 id="about-title">About</h2>
          </div>
          <div className="about-copy">
            <p className="about-role">{DATA.description}</p>
            <p className="body-copy">{DATA.summary}</p>
            <a className="location-link" href={DATA.locationLink} target="_blank" rel="noreferrer">Based in {DATA.location}</a>
          </div>
          <div className="skills-block">
            <h3>Tools I keep close</h3>
            <ul className="skill-list">
              {DATA.skills.map((skill) => <li key={skill.name}>{skill.name}</li>)}
            </ul>
          </div>
        </section>

        <section className="work-section section-block" id="work" aria-labelledby="work-title">
          <div className="section-title section-title--work">
            <p className="eyebrow">Things I built, broke, and kept</p>
            <h2 id="work-title">Selected work<br /><span>and the whole archive.</span></h2>
          </div>
          <div className="archive-controls">
            <div className="filter-list" role="group" aria-label="Project technology filters">
              {categories.map((category) => (
                <button
                  key={category}
                  className="filter-button"
                  type="button"
                  aria-pressed={activeCategory === category}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          <div className="project-list">
            {filteredProjects.map((project) => (
              <ProjectEntry project={project} ordinal={DATA.projects.indexOf(project)} key={project.title} />
            ))}
          </div>
        </section>

        <section className="notes-section section-block" id="notes" aria-labelledby="notes-title">
          <div className="section-title">
            <h2 id="notes-title">Field notes</h2>
          </div>
          <blockquote className="working-principle">
            <p>“{FIELD_NOTES.quote}”</p>
            <cite>Working principle</cite>
          </blockquote>
          <div className="field-notes-layout">
            <div className="technical-notes">
              {otherNotes.map((point, index) => (
                <article className="technical-note" key={point.title}>
                  <span className="note-index">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{point.title}</h3>
                    <p>{point.description}</p>
                  </div>
                </article>
              ))}
            </div>
            {politicalNote && (
              <article className="political-note" aria-labelledby="political-note-title">
                <span className="political-note-index">
                  {String(FIELD_NOTES.points.indexOf(politicalNote) + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 id="political-note-title">{politicalNote.title}</h3>
                  <p>{politicalNote.description}</p>
                </div>
              </article>
            )}
          </div>
        </section>

        <section className="closing-section" aria-label="Closing note">
          <p className="eyebrow">Still building / still paying attention</p>
          <h2>Keep digging.<br /><span>There is more in here.</span></h2>
          <a className="button button-inverse" href={DATA.contact.social.GitHub.url} target="_blank" rel="noreferrer">Find me on GitHub</a>
        </section>
      </main>

      <footer className="site-footer page-wrap">
        <div className="footer-identity">
          <a className="site-mark" href="#top">{DATA.name}</a>
        </div>
        <nav className="social-links" aria-label="Social links">
          {Object.values(DATA.contact.social).map((social) => (
            <a href={social.url} target="_blank" rel="noreferrer" key={social.name}>{social.name}</a>
          ))}
        </nav>
        <p className="copyright">© {new Date().getFullYear()} {DATA.name}</p>
      </footer>
      </div>
    </div>
  );
}

export default App;
