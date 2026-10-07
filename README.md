# Zaineedyou — Personal Archive

A personal space and project archive for Zaineedyou. This is not a recruiter landing page or a client pitch deck. It is an index of software, experiments, notes, and work that is still allowed to be unfinished.

## Stack

- Vite + React + TypeScript
- Framer Motion for restrained reveal transitions
- Native CSS for the visual system and responsive layout
- Existing project assets from `public/`

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## Production build

```bash
npm run build
npm run preview
```

## Design direction

- **Language:** editorial, kinetic, high-contrast, personal archive
- **Palette:** warm paper, black ink, and one burnt-orange accent
- **Type:** Space Grotesk for display and body, DM Mono for metadata and indexing
- **Structure:** one strong opening statement, an indexed project list, field notes, and a direct archive footer
- **Motion:** subtle section reveals and image hover treatment, with a reduced-motion fallback
- **Content:** project descriptions and field notes remain grounded in the source data. The human-rights criticism in `src/data/fieldNotes.ts` is intentionally preserved as authored text.

## Content source

Project data lives in `src/data/resume.ts`. Field notes live in `src/data/fieldNotes.ts`. Edit those files when the archive changes; the visual layer should not invent project facts, statistics, testimonials, or contact details.
