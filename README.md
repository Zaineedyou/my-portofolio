# Zaineedyou | Personal Archive

A personal software portfolio showing projects, field notes, and the Android-based workbench behind them. This is not a recruiter landing page or a client pitch deck.

## Stack

Vite, React, TypeScript, and native CSS. Claudia Marker and Claudia Tag are self-hosted from `public/fonts/`. The visual treatment adapts the rounded cards, print dots, and hero swoosh from the user's Claudia Ó Loki project.

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

Warm paper, black ink, and Claudia tan form the palette. A quiet version of Claudia Ó Loki's swoosh sits behind the hero, while rounded 28px cards frame the project archive and field notes. Claudia Tag is used for longer descriptions and notes; Claudia Marker remains the display face. Mobile has a stacked layout, visible keyboard focus, and reduced-motion support.

## Content source

Project data lives in `src/data/resume.ts`. Field notes live in `src/data/fieldNotes.ts`. Those original descriptions and political notes remain the content source. The portfolio hides the CaineGO and ClaudiaRPC-Rust preview images without changing their project data.
