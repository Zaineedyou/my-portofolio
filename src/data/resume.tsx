import { Icons } from "@/components/icons";
import { HomeIcon } from "lucide-react";
import { Golang } from "@/components/ui/svgs/golang";
import { Kotlin } from "@/components/ui/svgs/kotlin";
import { Javascript } from "@/components/ui/svgs/javascript";
import { Cplusplus } from "@/components/ui/svgs/cplusplus";
import { Rust } from "@/components/ui/svgs/rust";
import { Nodejs } from "@/components/ui/svgs/nodejs";
import { ReactLight } from "@/components/ui/svgs/reactLight";
import { Csharp } from "@/components/ui/svgs/csharp";
import { ReactNode } from "react";

type WorkItem = {
  company: string;
  href: string;
  logoUrl: string;
  title: string;
  start: string;
  end?: string;
  description: string;
};

type EducationItem = {
  school: string;
  href: string;
  degree: string;
  logoUrl: string;
  start: string;
  end: string;
};

type HackathonLink = {
  title: string;
  href: string;
  icon?: ReactNode;
};

type HackathonItem = {
  title: string;
  dates: string;
  location?: string;
  description?: string;
  image?: string;
  links?: HackathonLink[];
};

export const DATA = {
  name: "Zaineedyou",
  initials: "Zaineedyou",
  url: "https://claudia.web.id",
  location: "Indonesia",
  locationLink: "https://www.google.com/maps/place/Indonesia",
  description: "Software Architect & AI-Assisted Software Engineer",
  summary:
    "I design and ship durable software across AI-assisted automation, backend systems, developer tools, and constrained-device experiences. I work primarily from Android using Termux, turning tight constraints into clearer architecture and practical products.",
  avatarUrl: "/me.png",
  skills: [
    { name: "Go", icon: Golang },
    { name: "Rust", icon: Rust },
    { name: "JavaScript", icon: Javascript },
    { name: "Kotlin", icon: Kotlin },
    { name: "C++", icon: Cplusplus },
    { name: "Node.js", icon: Nodejs },
    { name: "React", icon: ReactLight },
  ],
  navbar: [
    { href: "/", icon: HomeIcon, label: "Home" },
  ],
  contact: {
    email: "",
    tel: "",
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://github.com/Zaineedyou",
        icon: Icons.github,
        navbar: true,
      },
      Discord: {
        name: "Discord",
        url: "https://discord.com/users/1133016364857180301",
        icon: Icons.discord,
        navbar: true,
      },
      Instagram: {
        name: "Instagram",
        url: "https://instagram.com/krebipeettiiii",
        icon: Icons.instagram,
        navbar: true,
      },
      email: {
        name: "Send Email",
        url: "claudia@claudia.web.id",
        icon: Icons.email,
        navbar: true,
      },
    },
  },

  work: [] as WorkItem[],
  education: [] as EducationItem[],

  projects: [
    {
      title: "CaineGO",
      href: "https://github.com/Zaineedyou/CaineGO",
      dates: "2026",
      active: true,
      description: "A production-ready Go Discord bot powered by Groq AI, combining multi-model chat and image analysis with conversational memory, moderation, leveling, AFK, welcome, and server administration tools.",
      technologies: ["Go", "Discord", "Groq API"],
      links: [{ type: "Source", href: "https://github.com/Zaineedyou/CaineGO", icon: <Icons.github className="size-3" /> }],
      image: "/CaineGO.png",
      video: "",
    },
    {
      title: "ClaudiaRPC-Rust",
      href: "https://github.com/Zaineedyou/ClaudiaRPC-Rust",
      dates: "2026",
      active: true,
      description: "A self-hosted Rust web application for custom Discord Rich Presence through Gateway v10, with an Axum/Tokio backend, live browser preview, profile persistence, image hosting, REST APIs, and automatic reconnects.",
      technologies: ["Rust", "Discord RPC", "WebUI"],
      links: [{ type: "Source", href: "https://github.com/Zaineedyou/ClaudiaRPC-Rust", icon: <Icons.github className="size-3" /> }],
      image: "/RpcRust.png",
      video: "",
    },
    {
      title: "CaineASM",
      href: "https://github.com/Zaineedyou/CaineASM",
      dates: "2026",
      active: true,
      description: "A low-level Discord bot built primarily in x86-64 assembly, with C adapters for secure transport, Discord Gateway and REST integration, Groq AI, moderation, attachments, vision payloads, persistence, and vector-tested subsystems.",
      technologies: ["x86-64 Assembly", "C", "Discord", "Groq AI"],
      links: [{ type: "Source", href: "https://github.com/Zaineedyou/CaineASM", icon: <Icons.github className="size-3" /> }],
      image: "",
      video: "",
    },
    {
      title: "Valtique",
      href: "https://github.com/Zaineedyou/Valtique",
      dates: "2026",
      active: true,
      description: "A mobile-first CRT/VHS post-processing shaderpack for Iris, combining letterbox framing, tube curvature, analog signal instability, phosphor persistence, and a low-end-friendly Potato Mode without compute shaders.",
      technologies: ["GLSL", "Iris", "Minecraft", "Mobile Graphics"],
      links: [{ type: "Source", href: "https://github.com/Zaineedyou/Valtique", icon: <Icons.github className="size-3" /> }],
      image: "",
      video: "",
    },
    {
      title: "Val0x2F",
      href: "https://github.com/Zaineedyou/Val0x2F",
      dates: "2026",
      active: true,
      description: "A client-side Fabric optimization foundation for constrained devices: persistent low-allocation chunk caching, bounded background work, batched I/O, memory-aware data paths, and an FPS-aware cache governor.",
      technologies: ["Java", "Fabric", "Minecraft", "Performance"],
      links: [{ type: "Source", href: "https://github.com/Zaineedyou/Val0x2F", icon: <Icons.github className="size-3" /> }],
      image: "",
      video: "",
    },
    {
      title: "val0x07",
      href: "https://github.com/Zaineedyou/val0x07",
      dates: "2026",
      active: true,
      description: "A client-side Fabric addon for Simple Voice Chat that applies reusable PCM effects to outgoing microphone audio through the official API, with War Radio, Female Voice, and customizable low-CPU DSP presets.",
      technologies: ["Java", "Fabric", "Audio DSP", "Minecraft"],
      links: [{ type: "Source", href: "https://github.com/Zaineedyou/val0x07", icon: <Icons.github className="size-3" /> }],
      image: "",
      video: "",
    },
    {
      title: "Val-Krypton-Wrapper",
      href: "https://github.com/Zaineedyou/Val-Krypton-Wrapper",
      dates: "2026",
      active: true,
      description: "A Kotlin Android plugin application for Fold Craft Launcher, Zalith Launcher, and Pojav·Glow·Worm, with tested Realme 9i / Adreno 610 performance profiles and conservative Krypton Wrapper settings.",
      technologies: ["Kotlin", "Android", "OpenGL", "Performance"],
      links: [{ type: "Source", href: "https://github.com/Zaineedyou/Val-Krypton-Wrapper", icon: <Icons.github className="size-3" /> }],
      image: "",
      video: "",
    },
    {
      title: "ValAuth",
      href: "https://github.com/Zaineedyou/ValAuth",
      dates: "2026",
      active: true,
      description: "A secure Fabric 26.2 authentication mod with Argon2id hashing, per-password salts, server-side pepper, bcrypt-to-Argon2id upgrades, sessions, TOTP, passkeys, abuse limits, and SQLite or external database storage.",
      technologies: ["Java", "Fabric", "Argon2id", "Security"],
      links: [{ type: "Source", href: "https://github.com/Zaineedyou/ValAuth", icon: <Icons.github className="size-3" /> }],
      image: "",
      video: "",
    },
    {
      title: "ZalithLauncher2Plus-OpenAL-Fix",
      href: "https://github.com/Zaineedyou/ZalithLauncher2Plus-OpenAL-Fix",
      dates: "2026",
      active: true,
      description: "An unofficial Android launcher fork for Minecraft: Java Edition, built on Zalith Launcher 2 and PojavLauncher with a modern Jetpack Compose/Material 3 UI, offline accounts, import/export tools, and mobile-focused fixes.",
      technologies: ["Kotlin", "Android", "Jetpack Compose", "Minecraft"],
      links: [{ type: "Source", href: "https://github.com/Zaineedyou/ZalithLauncher2Plus-OpenAL-Fix", icon: <Icons.github className="size-3" /> }],
      image: "",
      video: "",
    },
  ],

  hackathons: [] as HackathonItem[],
} as const;
