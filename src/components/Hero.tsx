import { useRef } from "react";
import type { PointerEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
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

  const portraitRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springX = useSpring(mx, { stiffness: 120, damping: 14 });
  const springY = useSpring(my, { stiffness: 120, damping: 14 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-10, 10]);

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    const el = portraitRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handlePointerLeave() {
    mx.set(0);
    my.set(0);
  }

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
                  <motion.a
                    className="charm-btn"
                    href={href}
                    target={key === "email" ? undefined : "_blank"}
                    rel="noreferrer"
                    aria-label={s.name}
                    title={s.name}
                    whileHover={{ y: -4, scale: 1.08, rotate: -6 }}
                    whileTap={{ scale: 0.94 }}
                    transition={{ type: "spring", stiffness: 320, damping: 18 }}
                  >
                    {Icon ? <Icon className="charm-icon" /> : null}
                  </motion.a>
                </li>
              );
            })}
          </ul>
        </motion.div>

        <motion.div
          className="hero-portrait"
          ref={portraitRef}
          style={{ rotateX, rotateY }}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          initial={{ opacity: 0, scale: 0.92, rotate: -3 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        >
          <motion.span
            className="hero-portrait-ring hero-portrait-ring--a"
            aria-hidden="true"
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          />
          <motion.span
            className="hero-portrait-ring hero-portrait-ring--b"
            aria-hidden="true"
            animate={{ rotate: -360 }}
            transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
          />
          <img src={DATA.avatarUrl} alt={DATA.name} className="hero-portrait-img" />
        </motion.div>
      </div>
    </section>
  );
}
