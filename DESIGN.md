# Portfolio design direction

## Design read

Developer portfolio for readers who want to inspect Zaineedyou's software, tools, and point of view. Native CSS adapts the visual language of Claudia Ó Loki without presenting it as an official component system.

## Dials

- `DESIGN_VARIANCE`: 8
- `MOTION_INTENSITY`: 5
- `VISUAL_DENSITY`: 4

## Visual decisions

- Claudia Marker handles headlines and Claudia Tag is used for labels and longer authored project/about/field-note copy. Both font files are self-hosted in `public/fonts/`.
- Warm paper, black ink, Claudia tan `#c48a62`, and the reference's dot texture carry the identity. The Claudia hero swoosh is repeated as a quiet SVG backdrop to tie the portfolio to its visual source.
- Reference cards use a 28px radius and soft shadow. Smaller controls and nested media use a tighter 18px radius. Rounded project cards replace the earlier hard-edged rows.
- The hero states what Zaineedyou does and the Android environment he works from. The full summary remains verbatim in the About section, now typeset with Claudia Tag.
- CaineGO and ClaudiaRPC-Rust project entries and links remain, but their two project images are not shown. No replacement or fake screenshots are used.
- Category filter buttons and keyboard feedback remain. Redundant filter instructions and project-count status are removed as requested.
- The political note remains verbatim. Its compact dark card uses Claudia Tag for the note body; the working-principle card is intentionally taller so the two notes no longer compete at the same height.
- Hero motion remains restrained and respects reduced-motion preferences. Mobile stacks the note cards while keeping the working-principle card taller.

## Content constraints

Project, technology, contact, summary, and field-note data remain in `src/data/resume.ts` and `src/data/fieldNotes.ts`. The visual layer must not invent project claims, statistics, testimonials, links, or replacement political copy.
