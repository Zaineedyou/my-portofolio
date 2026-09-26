import { motion } from "framer-motion";
import { DATA } from "../data/resume";
import { CornerBlossom } from "./SakuraDecor";
import { GitHubIcon, DiscordIcon, InstagramIcon, EmailIcon } from "./icons";

const socialIcons: Record<string, (props: { className?: string }) => JSX.Element> = {
  GitHub: GitHubIcon,
  Discord: DiscordIcon,
  Instagram: InstagramIcon,
  email: EmailIcon,
};

export function Contact() {
  const socials = Object.entries(DATA.contact.social);
  const year = new Date().getFullYear();

  return (
    <footer className="section contact-section" aria-label="Contact">
      <div className="container">
        <motion.div
          className="card contact-card"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <CornerBlossom className="contact-blossom" />

          <span className="eyebrow">Contact</span>
          <h2 className="contact-name">{DATA.name}</h2>
          <a className="contact-url" href={DATA.url} target="_blank" rel="noreferrer">
            {DATA.url.replace(/^https?:\/\//, "")}
          </a>

          <ul className="hero-socials contact-socials" aria-label="Social links">
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

          <p className="contact-copyright">&copy; {year} {DATA.name}</p>
        </motion.div>
      </div>
    </footer>
  );
}
