# Zaineedyou | Personal Archive

A personal software portfolio showing projects, field notes, and the Android-based workbench behind them. This is not a recruiter landing page or a client pitch deck.

## Stack

Vite, React, TypeScript, native CSS, and Three.js/WebGL for the 3D turntable. Claudia Marker and Claudia Tag are self-hosted from `public/fonts/`. The visual treatment adapts the rounded cards, visible shadows, print dots, and hero swoosh from the user's Claudia Ó Loki project.

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

Warm paper, black ink, and Claudia tan form the palette. The Working Principle quote sits in a wide horizontal card. Notes 01 and 02 stack in the left column, and the political note is 03 in the right column. Claudia Tag is used for longer descriptions and notes; Claudia Marker remains the display face. Mobile reflows the cards into one column while keeping visible keyboard focus and reduced-motion support.

## For Mom

Open `/#for-mom` from the portfolio or use the heart-marked **For Mom** button. The page pairs the supplied poem, presented in a rounded card, with a Three.js/WebGL turntable built from real 3D meshes and accessible play, pause, and seek controls. Drag the model to inspect its geometry; playback spins the vinyl and moves the tonearm. The player serves the source segment from 0:07 to 4:22 as Ogg Opus with a 2-second fade-in at `public/audio/Number One For Me-Maher Zain.ogg`; the `.ogg` extension lets Vercel serve it as browser-playable audio.

## Content source

Project data lives in `src/data/resume.ts`. Field notes live in `src/data/fieldNotes.ts`. Those original descriptions and political notes remain the content source. The portfolio hides the CaineGO and ClaudiaRPC-Rust preview images without changing their project data.
