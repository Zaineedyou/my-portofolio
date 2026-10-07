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

- **Language:** playful product landing-page language adapted from Claudia Ó Loki: chunky uppercase display type, sticker-like headings, large rounded cards, pill buttons, swooshes, and dotted paper texture
- **Palette:** Claudia's light grey paper, black ink, white cards, and tan `#c48a62` accent
- **Type:** bold system fallback stack using Impact/Arial Narrow style display treatment and system body text
- **Structure:** sticky pill navigation, poster-like hero, archive metrics, rounded feature cards, project index, field notes, and closing CTA card
- **Motion:** subtle card reveals and color-preserving image hover treatment, with a reduced-motion fallback
- **Content:** project descriptions and field notes remain grounded in the source data. The human-rights criticism in `src/data/fieldNotes.ts` is intentionally preserved as authored text.

## Content source

Project data lives in `src/data/resume.ts`. Field notes live in `src/data/fieldNotes.ts`. Edit those files when the archive changes; the visual layer should not invent project facts, statistics, testimonials, or contact details.
