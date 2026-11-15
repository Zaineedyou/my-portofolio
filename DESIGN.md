# Portfolio design direction

## Design read

Developer portfolio for readers who want to inspect Zaineedyou's software, tools, and point of view. Native CSS adapts the visual language of Claudia Ó Loki without presenting it as an official component system.

## Dials

- `DESIGN_VARIANCE`: 8
- `MOTION_INTENSITY`: 5
- `VISUAL_DENSITY`: 4

## Visual decisions

Claudia Marker handles headlines; Claudia Tag is used for labels and longer authored project, About, and field-note copy. Both font files are self-hosted in `public/fonts/`. White paper (`#ffffff`), black ink, and the exact sampled image accent (`#bd8668`, RGB 189, 134, 104) carry the visual identity alongside the print dots and the reference's quiet hero swoosh.

Cards use a 28px radius and the portfolio's hard offset shadow. The Working Principle quote is a full-width landscape card with its label set beside the quote. Below it, notes `01` and `02` stack in the left column while the political criticism is the dark note `03` in the right column, without an extra eyebrow; mobile stacks them in source order.

The initial loading screen follows Claudia Ó Loki's boot card, swoosh, outlined wordmark, rounded percentage bar, and fade-out. The centered `Zaineedyou` wordmark is sized to stay inside the card. The progress and closing transition complete a four-second sequence; the bar remains smooth with reduced motion enabled.

CaineGO and ClaudiaRPC-Rust project entries and links remain, but their two project images are not shown. Category filters, keyboard feedback, restrained hero motion, reduced-motion support, and mobile reflow remain.

The About section, work heading, project entries, field notes, and closing section reveal once as they enter view. Project cards rise 72px and scale from 95% with a stagger; section headings and other blocks use a shorter 44px rise. Reduced-motion users see the content immediately without movement. Every project title uses the same type scale, including the lead card.

## Content constraints

Project, technology, contact, summary, and field-note data remain in `src/data/resume.ts` and `src/data/fieldNotes.ts`. The visual layer must not invent project claims, statistics, testimonials, links, or replacement political copy.

## For Mom

The `#for-mom` route keeps the portfolio's paper, Claudia fonts, and sampled image accent outside the music player. Inside the player, the supplied video guides a tall charcoal lyrics screen: a small top handle and track header, left-aligned lines, one steady focus position, and an eased vertical scroll with neighboring lyrics fading and blurring by distance. The focus moves by whole line, not word by word. Existing timestamps in `src/data/numberOneForMe.ts` stay synced to the bundled audio, and play, pause, seek, and reduced-motion behavior remain available. The small `MZ` tile is an artist-initial mark, not official cover art. The provided poem remains in its own rounded card.
