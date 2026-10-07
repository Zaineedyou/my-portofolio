# Portfolio design direction

## Design read

Developer portfolio for readers who want to inspect Zaineedyou's software, tools, and point of view. Native CSS adapts the visual language of Claudia Ó Loki without presenting it as an official component system.

## Dials

- `DESIGN_VARIANCE`: 8
- `MOTION_INTENSITY`: 5
- `VISUAL_DENSITY`: 4

## Visual decisions

Claudia Marker handles headlines; Claudia Tag is used for labels and longer authored project, About, and field-note copy. Both font files are self-hosted in `public/fonts/`. Warm paper, black ink, Claudia tan `#c48a62`, print dots, and the reference's quiet hero swoosh carry the visual identity.

Cards use a 28px radius and a visible shadow. The Working Principle quote is a full-width landscape card with its label set beside the quote. The three source field notes follow beneath it in source order; the political criticism is the dark third card, numbered `03`, with no extra eyebrow.

CaineGO and ClaudiaRPC-Rust project entries and links remain, but their two project images are not shown. Category filters, keyboard feedback, restrained hero motion, reduced-motion support, and mobile reflow remain.

## Content constraints

Project, technology, contact, summary, and field-note data remain in `src/data/resume.ts` and `src/data/fieldNotes.ts`. The visual layer must not invent project claims, statistics, testimonials, links, or replacement political copy.
