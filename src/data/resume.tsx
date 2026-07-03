import { Icons } from "@/components/icons";
import { HomeIcon } from "lucide-react";
import { Golang } from "@/components/ui/svgs/golang";
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
  name: "Claudia",
  initials: "CL",
  url: "https://claudia.web.id",
  location: "Indonesia",
  locationLink: "https://www.google.com/maps/place/Indonesia",
  description: "Fullstack Dev & Engineering Architect",
  summary:
    "I build things that I find interesting — backends, bots, tools, whatever catches my attention. I work primarily from Android using Termux, building everything from Discord bots to RPC gateways to native Android apps.",
  avatarUrl: "/me.png",
  skills: [
    { name: "Go", icon: Golang },
    { name: "Rust", icon: Golang },
    { name: "JavaScript", icon: ReactLight },
    { name: "Kotlin", icon: Csharp },
    { name: "C++", icon: Csharp },
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
        icon: Icons.globe,
        navbar: true,
      },
      Instagram: {
        name: "Instagram",
        url: "https://instagram.com/dear.claudiaaa",
        icon: Icons.globe,
        navbar: true,
      },
      email: {
        name: "Send Email",
        url: "#",
        icon: Icons.email,
        navbar: false,
      },
    },
  },

  work: [] as WorkItem[],
  education: [] as EducationItem[],

  projects: [
    {
      title: "ClaudiaRPC (Go)",
      href: "https://rpc.claudia.web.id",
      dates: "2024",
      active: true,
      description:
        "Web-based Discord Rich Presence tool built in Go with a Chi router and vanilla JS frontend. Profile save/load, external image URL resolution, and a glassmorphism UI.",
      technologies: ["Go", "Chi", "JavaScript", "Discord RPC"],
      links: [
        {
          type: "Website",
          href: "https://rpc.claudia.web.id",
          icon: <Icons.globe className="size-3" />,
        },
        {
          type: "Source",
          href: "https://github.com/Zaineedyou/ClaudiaRPC",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "",
      video: "",
    },
    {
      title: "ClaudiaRPC (Rust)",
      href: "https://github.com/Zaineedyou/ClaudiaRPC-Rust",
      dates: "2024",
      active: true,
      description:
        "A Rust reimplementation of ClaudiaRPC. Same feature set, rebuilt from the ground up for performance and as an exercise in systems-level thinking.",
      technologies: ["Rust", "Discord RPC", "WebUI"],
      links: [
        {
          type: "Source",
          href: "https://github.com/Zaineedyou/ClaudiaRPC-Rust",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "",
      video: "",
    },
    {
      title: "CaineGO",
      href: "https://github.com/Zaineedyou/CaineGO",
      dates: "2024",
      active: true,
      description:
        "A Discord bot with Groq API integration, moderation commands, automod, warning systems, per-channel memory, logging, and slash commands.",
      technologies: ["Go", "Discord", "Groq API"],
      links: [
        {
          type: "Source",
          href: "https://github.com/Zaineedyou/CaineGO",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "",
      video: "",
    },
    {
      title: "CaineMP",
      href: "https://github.com/Zaineedyou/CaineMP",
      dates: "2024",
      active: true,
      description:
        "A native Android music player app built with Kotlin and C++. Clean UI, local library management, and optimized audio playback.",
      technologies: ["Kotlin", "C++", "Android", "CMake"],
      links: [
        {
          type: "Source",
          href: "https://github.com/Zaineedyou/CaineMP",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "",
      video: "",
    },
  ],

  hackathons: [] as HackathonItem[],
} as const;
