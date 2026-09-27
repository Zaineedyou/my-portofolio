import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DATA, type Project } from "../data/resume";
import { ArrowIcon, GitHubIcon } from "./icons";

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
  return (
    <motion.article
      layout
      className="proj-card"
      initial={{ opacity: 0, y: 22, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -14, scale: 0.96 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8 }}
    >
      <img src="/ribbon.png" alt="" aria-hidden="true" className="ribbon" />

      <div className="proj-media">
        {project.image ? (
          <img src={project.image} alt={project.title} loading="lazy" />
        ) : (
          <span className="proj-media-mono" aria-hidden="true">
            {project.title.charAt(0)}
          </span>
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
