import { motion } from "framer-motion";
import { DATA } from "../data/resume";
import { SakuraBranch, PetalDrift } from "./SakuraDecor";
import { GitHubIcon, DiscordIcon, InstagramIcon, EmailIcon } from "./icons";

const socialIcons: Record<string, (props: { className?: string }) => JSX.Element> = {
  GitHub: GitHubIcon,
  Discord: DiscordIcon,
  Instagram: InstagramIcon,
  email: EmailIcon,
};

export function Hero() {
  const socials = Object.entries(DATA.contact.social);

  return (
    <section className="hero" aria-label="Introduction">
      <PetalDrift />
      <SakuraBranch className="hero-branch hero-branch--right" />
      <SakuraBranch className="hero-branch hero-branch--left" />

      <div className="container hero-inner">
        <motion.div
          className="hero-copy"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="hero-location pill">{DATA.location}</span>

          <h1 className="hero-name">{DATA.name}</h1>

          <p className="hero-desc">{DATA.description}</p>

          <p className="hero-summary">{DATA.summary}</p>

          <ul className="hero-socials" aria-label="Social links">
            {socials.map(([key, s]) => {
              const Icon = socialIcons[key];
              const href = key === "email" ? `mailto:${s.url}` : s.url;
              return (
                <li key={key}>
                  <a
                    className="charm-btn"
                    href={href}
                    target={key === "email" ? undefined : "_blank"}
                    rel="noreferrer"
                    aria-label={s.name}
                    title={s.name}
                  >
                    {Icon ? <Icon className="charm-icon" /> : null}
                  </a>
                </li>
              );
            })}
          </ul>
        </motion.div>

        <motion.div
          className="hero-portrait"
          initial={{ opacity: 0, scale: 0.92, rotate: -3 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        >
          <span className="hero-portrait-ring hero-portrait-ring--a" aria-hidden="true" />
          <span className="hero-portrait-ring hero-portrait-ring--b" aria-hidden="true" />
          <img src={DATA.avatarUrl} alt={DATA.name} className="hero-portrait-img" />
        </motion.div>
      </div>
    </section>
  );
}
