import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { personal } from '../data/personal';
import { Orb } from './Orb';
import { ArrowDown, GithubLogo, DiscordLogo } from '@phosphor-icons/react';

const spring = { type: 'spring', stiffness: 100, damping: 20 };

export function Hero() {
  const el = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap
        .timeline()
        .set('.hero-name', { clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)' })
        .set('.hero-tagline', { opacity: 0, y: 20 })
        .set('.hero-subtitle', { opacity: 0, y: 20 })
        .set('.hero-cta', { opacity: 0, y: 20 })
        .to('.hero-name', {
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          duration: 1.2,
          ease: 'power4.inOut',
          delay: 0.2,
        })
        .to('.hero-tagline', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.6')
        .to('.hero-subtitle', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
        .to('.hero-cta', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3');
    }, el);

    return () => ctx.revert();
  }, []);

  const scrollToProjects = () => {
    const el = document.getElementById('projects');
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={el}
      id="hero"
      className="relative min-h-[100dvh] flex items-center overflow-hidden"
      style={{ backgroundColor: 'var(--gradient-hero)' }}
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] md:w-[800px] md:h-[800px] opacity-20">
          <Orb
            hue={330}
            hoverIntensity={0}
            rotateOnHover={false}
            backgroundColor="#0a0a0f"
          />
        </div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-10 w-full py-24 md:py-0">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent-500/20 text-accent-300 text-xs font-mono tracking-wide mb-10 bg-accent-500/5">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-[statusPulse_2s_ease-in-out_infinite]" />
          available for interesting problems
        </div>

        <div className="overflow-hidden mb-4">
          <h1 className="hero-name font-heading text-6xl md:text-8xl font-bold tracking-tighter leading-none text-text-primary">
            {personal.name}
          </h1>
        </div>

        <p className="hero-tagline font-mono text-accent-300 text-lg md:text-xl mb-6 tracking-tight">
          {personal.tagline}
        </p>

        <p className="hero-subtitle text-text-secondary text-base md:text-lg leading-relaxed max-w-[52ch] mb-10">
          {personal.subtitle}
        </p>

        <div className="hero-cta flex flex-wrap gap-4 items-center">
          <button
            onClick={scrollToProjects}
            className="cursor-target group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent-500 text-white font-semibold text-sm cursor-pointer transition-all hover:bg-accent-400 active:scale-[0.98]"
          >
            View Projects
            <ArrowDown size={16} weight="bold" className="transition-transform group-hover:translate-y-0.5" />
          </button>

          <a
            href={personal.github}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-target inline-flex items-center gap-2 px-6 py-3 rounded-full border border-zinc-700 text-text-primary font-medium text-sm transition-all hover:border-zinc-500 hover:bg-white/[0.03] active:scale-[0.98]"
          >
            <GithubLogo size={16} weight="bold" />
            GitHub
          </a>

          <a
            href={personal.discord}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-target inline-flex items-center gap-2 px-6 py-3 rounded-full border border-zinc-700 text-text-primary font-medium text-sm transition-all hover:border-zinc-500 hover:bg-white/[0.03] active:scale-[0.98]"
          >
            <DiscordLogo size={16} weight="bold" />
            Discord
          </a>
        </div>
      </div>
    </section>
  );
}
