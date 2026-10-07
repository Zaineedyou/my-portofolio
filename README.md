# Zaineedyou | Personal Archive

A personal software archive for Zaineedyou. It holds software, experiments, field notes, and work that is still allowed to be unfinished. This is not a recruiter landing page or a client pitch deck.

## Stack

Vite, React, TypeScript, and native CSS. The site uses the two locally hosted typefaces from Claudia Ó Loki, plus the portfolio's existing image assets. No new UI package is required.

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

The visual language is an editorial poster/archive inspired by Claudia Ó Loki: warm paper, black ink, the Claudia tan accent, bold cutout typography, and a restrained print-dot texture. Claudia Marker and Claudia Tag are self-hosted in `public/fonts/`. The page uses native CSS rather than pretending this aesthetic is an official component system.

The portfolio's original project entries, technical notes, links, summary, and political criticism remain in their source data. The political field note is displayed verbatim. Project imagery is used only when a real preview exists in the data. Mobile uses a dedicated stacked layout, visible keyboard focus, and reduced-motion support.

## Content source

Project data lives in `src/data/resume.ts`. Field notes live in `src/data/fieldNotes.ts`. Change those files when the archive changes. The visual layer should not invent project facts, statistics, testimonials, or contact details.
