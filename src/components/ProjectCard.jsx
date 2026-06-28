import { useState, useEffect } from 'react';
import { Tilt } from 'react-tilt';
import { ArrowSquareOut, GithubLogo } from '@phosphor-icons/react';
import { useReducedMotion } from '../hooks/useReducedMotion';

const tiltOptions = { max: 8, scale: 1, speed: 300 };

export function ProjectCard({ project }) {
  const [canHover, setCanHover] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    setCanHover(window.matchMedia('(hover: hover)').matches);
  }, []);

  const enableTilt = canHover && !prefersReducedMotion;

  const cardContent = (
    <div
      role="article"
      className="cursor-target bg-bg-surface border border-zinc-800 rounded-2xl p-6 h-full transition-all duration-200 hover:border-accent-500/30 hover:-translate-y-[2px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.4)] hover:shadow-[0_24px_48px_-12px_rgba(232,51,107,0.1)]"
    >
      <p className="font-mono text-xs text-accent-400 mb-2 tracking-wide uppercase">
        {project.name}
      </p>

      <p className="text-lg font-semibold text-text-primary leading-snug mb-3">
        {project.tagline}
      </p>

      <p className="text-sm text-text-secondary mb-5 leading-relaxed">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-5">
        {project.tech.map((tech) => (
          <span
            key={tech}
            className="px-2.5 py-1 rounded-md bg-zinc-800/60 border border-zinc-700/40 font-mono text-xs text-text-caption"
          >
            {tech}
          </span>
        ))}
      </div>

      <div className="flex gap-4">
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-target inline-flex items-center gap-1.5 text-sm text-accent-300 font-medium hover:text-accent-200 transition-colors"
          >
            Live <ArrowSquareOut size={14} />
          </a>
        )}
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-target inline-flex items-center gap-1.5 text-sm text-text-caption font-medium hover:text-text-secondary transition-colors"
          >
            <GithubLogo size={14} /> Source
          </a>
        )}
      </div>
    </div>
  );

  if (enableTilt) {
    return <Tilt options={tiltOptions}>{cardContent}</Tilt>;
  }

  return cardContent;
}
