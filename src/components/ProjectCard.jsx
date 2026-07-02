import { useState, useEffect } from 'react';
import { ArrowSquareOut, GithubLogo } from '@phosphor-icons/react';
import BorderGlow from './BorderGlow';

export function ProjectCard({ project }) {
  const [canHover, setCanHover] = useState(true);

  useEffect(() => {
    setCanHover(window.matchMedia('(hover: hover)').matches);
  }, []);

  return (
    <BorderGlow
      animated
      backgroundColor="#13131a"
      borderRadius={16}
      glowColor="340 80 70"
      glowIntensity={1.5}
      colors={['#e8336b', '#ff80a8', '#c084fc']}
      edgeSensitivity={21}
      glowRadius={28}
      coneSpread={25}
      className="h-full"
    >
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '100%' }}>
        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#ff80a8', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px' }}>
          {project.name}
        </p>

        <p style={{ fontSize: '17px', fontWeight: 600, color: '#f5f0ff', lineHeight: 1.3, marginBottom: '12px' }}>
          {project.tagline}
        </p>

        <p style={{ fontSize: '13px', color: '#9d97b0', lineHeight: 1.7, marginBottom: '20px', flex: 1 }}>
          {project.description}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
          {project.tech.map((tech) => (
            <span
              key={tech}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '11px',
                color: '#5c5875',
              }}
            >
              {tech}
            </span>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#ff80a8', fontWeight: 500, textDecoration: 'none' }}
            >
              Live <ArrowSquareOut size={13} />
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#5c5875', fontWeight: 500, textDecoration: 'none' }}
            >
              <GithubLogo size={13} /> Source
            </a>
          )}
        </div>
      </div>
    </BorderGlow>
  );
}
