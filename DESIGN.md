# Portfolio design direction

## Design read

Developer portfolio and personal archive for people exploring Zaineedyou's software and point of view. The visual direction is a hard-edged editorial poster inspired by Claudia Ó Loki's paper, ink, tan, and chunky type treatment. It is implemented with native CSS, not presented as an official component system.

## Dials

- `DESIGN_VARIANCE`: 8
- `MOTION_INTENSITY`: 5
- `VISUAL_DENSITY`: 4

## Visual decisions

- The Claudia Marker and Claudia Tag TTF files are self-hosted from `public/fonts/`, avoiding remote font requests and retaining the source project's distinctive type.
- Warm paper, black ink, white paper panels, and Claudia tan `#c48a62` form the palette. The dotted paper background is a light print-stock cue from the reference; black outlines and offset shadows make the poster/archive direction legible.
- The hero uses the existing avatar asset. Project previews only appear where the source data provides real images. Projects without images stay typographic rather than receiving fake screenshots.
- A project archive replaces duplicate featured-project cards plus a second full list. Category filtering, source/live links, field notes, social links, and the authored political criticism remain present.
- The human-rights note keeps its original title and body text. The dark ink panel gives that authored statement a deliberate, high-contrast editorial position rather than turning it into a decorative slogan.
- Hero entrance motion supports initial hierarchy. It is omitted for users who request reduced motion. Hover movement is restrained and does not carry information by itself.
- Mobile has a separate stacked composition; links and filters maintain practical touch targets and visible keyboard focus.

## Content constraints

Project, technology, contact, summary, and field-note data remain in `src/data/resume.ts` and `src/data/fieldNotes.ts`. Do not invent project claims, statistics, testimonials, links, or replacement political copy in the visual layer.
