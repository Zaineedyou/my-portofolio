import { motion } from "framer-motion";
import { DATA, type Project } from "../data/resume";
import { ArrowIcon, GitHubIcon } from "./icons";
import { monogram } from "../lib/text";

/** Groups projects by their primary language/technology (the first entry
 * in each project's technologies list), preserving first-seen order. */
function groupByCategory(projects: Project[]) {
  const order: string[] = [];
  const map = new Map<string, Project[]>();

  for (const project of projects) {
    const category = project.technologies[0] ?? "Other";
    if (!map.has(category)) {
      map.set(category, []);
      order.push(category);
    }
    map.get(category)!.push(project);
  }

  return order.map((category) => ({
    category,
    items: map.get(category)!,
  }));
}

function ProjectMedia({ project }: { project: Project }) {
  if (project.image) {
    return (
      <div className="project-media project-media--image">
        <img src={project.image} alt={project.title} loading="lazy" />
      </div>
    );
  }
  return (
    <div className="project-media project-media--mono" aria-hidden="true">
      <span className="project-mono-letter">{project.title.charAt(0)}</span>
    </div>
  );
}

function CategoryRibbon({ label }: { label: string }) {
  return (
    <span className="ribbon-wrap" aria-hidden="true">
      <span className="ribbon">{label}</span>
    </span>
  );
}

export function Projects() {
  const groups = groupByCategory(DATA.projects);
  let rowIndex = 0;

  return (
    <section className="section projects-section" aria-label="Projects" id="projects">
      <div className="container">
        <h2 className="projects-heading">Projects</h2>

        <div className="project-categories">
          {groups.map((group) => (
            <div className="project-category" key={group.category}>
              <div className="category-heading">
                <span className="category-mono" aria-hidden="true">
                  {monogram(group.category)}
                </span>
                <h3 className="category-label">{group.category}</h3>
                <span className="category-line" aria-hidden="true" />
                <span className="category-count">
                  {group.items.length} {group.items.length === 1 ? "project" : "projects"}
                </span>
              </div>

              <div className="project-rows">
                {group.items.map((project) => {
                  const i = rowIndex++;
                  return (
                    <motion.article
                      key={project.title}
                      className={`project-row ${i % 2 === 1 ? "project-row--reverse" : ""}`}
                      initial={{ opacity: 0, y: 28 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.25 }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <ProjectMedia project={project} />

                      <div className="project-copy card">
                        <CategoryRibbon label={group.category} />

                        <div className="project-copy-head">
                          <h4 className="project-title">{project.title}</h4>
                          <span className="project-dates">{project.dates}</span>
                        </div>

                        <p className="project-desc">{project.description}</p>

                        <ul className="project-tech" aria-label="Technologies">
                          {project.technologies.map((tech) => (
                            <li key={tech} className="pill project-tech-pill">
                              {tech}
                            </li>
                          ))}
                        </ul>

                        <div className="project-links">
                          {project.links.map((link) => (
                            <a
                              key={link.href}
                              href={link.href}
                              target="_blank"
                              rel="noreferrer"
                              className="project-link"
                            >
                              <GitHubIcon className="project-link-icon" />
                              {link.type}
                              <ArrowIcon className="project-link-arrow" />
                            </a>
                          ))}
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
