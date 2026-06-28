import { AnimateOnScroll } from '../helpers/AnimateOnScroll';
import { personal } from '../data/personal';
import { GithubLogo, DiscordLogo, InstagramLogo } from '@phosphor-icons/react';

export function Contact() {
  return (
    <section id="contact" className="py-24 md:py-32 border-t border-zinc-800/50">
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        <AnimateOnScroll direction="up">
          <p className="font-mono text-xs text-accent-400 tracking-widest uppercase mb-3">contact</p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-text-primary mb-4">
            Find me here
          </h2>
          <p className="text-text-secondary text-base max-w-[42ch] mb-10">
            Got something interesting? Reach out on Discord or check out my GitHub.
          </p>
        </AnimateOnScroll>

        <AnimateOnScroll direction="up" delay={0.1}>
          <div className="flex flex-wrap gap-4">
            <a
              href={personal.github}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-target group inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-bg-surface border border-zinc-800 hover:border-zinc-600 transition-all hover:-translate-y-[2px]"
            >
              <GithubLogo size={20} className="text-text-secondary group-hover:text-text-primary transition-colors" />
              <div>
                <p className="text-text-primary font-medium text-sm">GitHub</p>
                <p className="text-text-caption font-mono text-xs">Zaineedyou</p>
              </div>
            </a>

            <a
              href={personal.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-target group inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-bg-surface border border-zinc-800 hover:border-accent-500/40 transition-all hover:-translate-y-[2px]"
            >
              <DiscordLogo size={20} className="text-accent-400 group-hover:text-accent-300 transition-colors" />
              <div>
                <p className="text-text-primary font-medium text-sm">Discord</p>
                <p className="text-text-caption font-mono text-xs">Send a message</p>
              </div>
            </a>

            <a
              href={personal.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-target group inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-bg-surface border border-zinc-800 hover:border-accent-500/40 transition-all hover:-translate-y-[2px]"
            >
              <InstagramLogo size={20} className="text-accent-400 group-hover:text-accent-300 transition-colors" />
              <div>
                <p className="text-text-primary font-medium text-sm">Instagram</p>
                <p className="text-text-caption font-mono text-xs">dear.claudiaaa</p>
              </div>
            </a>
          </div>
        </AnimateOnScroll>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-10 mt-24 pt-8 border-t border-zinc-800/30 flex items-center justify-between">
        <p className="text-text-caption text-xs font-mono">
          © {new Date().getFullYear()} Claudia
        </p>
        <p className="text-text-caption text-xs font-mono">
          claudia.web.id
        </p>
      </div>
    </section>
  );
}
