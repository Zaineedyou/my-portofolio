import { useMemo, useState, type PointerEvent } from "react";
import { AnimatePresence, motion, useMotionValue } from "framer-motion";
import { DATA, type Project } from "../data/resume";
import { ArrowIcon, GitHubIcon } from "./icons";
import { PetalDrift, SakuraBranch, FloatingBlossoms } from "./SakuraDecor";

const ALL = "All";

function useCategories(projects: Project[]) {
  return useMemo(() => {
    const order: string[] = [];
    const counts = new Map<string, number>();
    for (const p of projects) {
      const cat = p.technologies[0] ?? "Other";
      counts.set(cat, (counts.get(cat) ?? 0) + 1);
      if (!order.includes(cat)) order.push(cat);
    }
    return [
      { name: ALL, count: projects.length },
      ...order.map((name) => ({ name, count: counts.get(name)! })),
    ];
  }, [projects]);
}

function ProjectCard({ project }: { project: Project }) {
  const mediaX = useMotionValue(0);
  const mediaY = useMotionValue(0);

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    mediaX.set(((event.clientX - rect.left) / rect.width - 0.5) * 4);
    mediaY.set(((event.clientY - rect.top) / rect.height - 0.5) * 4);
  }

  return (
    <motion.article
      layout
      className="proj-card"
      initial={{ opacity: 0, y: 22, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -14, scale: 0.96 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => {
        mediaX.set(0);
        mediaY.set(0);
      }}
    >
      <img src="/ribbon.png" alt="" aria-hidden="true" className="ribbon" />

      <div className="proj-media">
        {project.image ? (
          <motion.img src={project.image} alt={project.title} loading="lazy" style={{ x: mediaX, y: mediaY }} />
        ) : (
          <motion.div className="proj-media-emblem" aria-hidden="true" style={{ x: mediaX, y: mediaY }}>
            <span className="proj-media-blob proj-media-blob--a" />
            <span className="proj-media-blob proj-media-blob--b" />
            <span className="proj-media-ring" />
            <span className="proj-media-spark proj-media-spark--1" />
            <span className="proj-media-spark proj-media-spark--2" />
            <span className="proj-media-spark proj-media-spark--3" />
            <span className="proj-media-mono">{project.title}</span>
          </motion.div>
        )}
      </div>

      <h3 className="proj-title">{project.title}</h3>
      <p className="proj-desc">{project.description}</p>

      <ul className="proj-tech" aria-label="Technologies">
        {project.technologies.map((tech) => (
          <li key={tech} className="pill proj-tech-pill">
            {tech}
          </li>
        ))}
      </ul>

      <div className="proj-footer">
        <span className="proj-dates">{project.dates}</span>
        {project.links.map((link) => (
          <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className="proj-link">
            <GitHubIcon className="proj-link-icon" />
            {link.type}
            <ArrowIcon className="proj-link-arrow" />
          </a>
        ))}
      </div>
    </motion.article>
  );
}

export function Projects() {
  const categories = useCategories(DATA.projects);
  const [active, setActive] = useState(ALL);

  const filtered =
    active === ALL
      ? DATA.projects
      : DATA.projects.filter((p) => (p.technologies[0] ?? "Other") === active);

  return (
    <section className="section projects-section" aria-label="Projects" id="projects">
      <PetalDrift />
      <FloatingBlossoms />
      <SakuraBranch className="hero-branch hero-branch--right projects-branch" />
      <div className="container">
        <h2 className="projects-heading">Projects</h2>

        <div className="category-tabs" role="tablist" aria-label="Filter by category">
          {categories.map((cat) => (
            <button
              key={cat.name}
              type="button"
              role="tab"
              aria-selected={active === cat.name}
              className={`category-tab ${active === cat.name ? "is-active" : ""}`}
              onClick={() => setActive(cat.name)}
            >
              <span className="category-tab-label">{cat.name}</span>
              <span className="category-tab-count">{String(cat.count).padStart(2, "0")}</span>
              {active === cat.name && (
                <motion.span
                  layoutId="category-tab-indicator"
                  className="category-tab-indicator"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
            </button>
          ))}
        </div>

        <motion.div layout className="project-grid">
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <ProjectCard project={project} key={project.title} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
