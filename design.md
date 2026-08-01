# Design — BBS Style Discovery

Locked design system for this app. Every view redesign reads this file
before emitting code. Do not regenerate per view — extend or amend this
file when the system genuinely needs to grow. This is an in-store iPad
kiosk app, not a marketing site: it has no persistent top nav and no
footer. Its existing chrome (home/back affordance, the floating
discovery-panel FAB, the single delegated `data-action` click handler)
is out of scope for redesign and stays exactly as is.

## Genre

Editorial (canonical) as the base, with **playful microinteraction
accents** scoped only to the two quizzes and the Discovery panel — per
the founder's July 2026 "wow-factor, not consultation" framing. The
Guide, Lookbook, Worksheet, and Cloth Room stay quieter/editorial; do
not let playful motion bleed into those.

## View-type families

This app doesn't have marketing pages, so macrostructures are mapped to
view *type* rather than route. Within a family, vary archetype choices;
do not swap families.

- **Reveal** — Welcome, Style/Colour quiz results, Client Dossier. One
  considered visual moment (swatch, archetype portrait, tape ticker) +
  a single primary action. No card grid, no feature-stack.
- **Guided flow** — Style quiz, Colour quiz, Worksheet steps. Narrative
  Workflow shape. The tape-measure progress bar already *is* this
  pattern — keep it as the spine, don't replace it.
- **Hub / Index** — Main menu, Discovery panel browse, Archetype
  Gallery. Index-First shape; card-grid rhythm (matches the July 2026
  main-menu redesign — don't regress it).
- **Workbench** — Cloth Room (single / compare / ensemble), Cloth
  Study, Mill Map. Tool-in-frame, function-led. No decorative
  enrichment beyond what the render itself needs.
- **Editorial content** — Guide topic pages, Lookbook. Long Document
  shape: continuous prose, inline section heads, typography +
  photography only, no interactive chrome.

## Theme — locked, do not invent new values

- `--bg` `#eae5dd` (cream)
- `--surface` `#fff`
- `--text` / `--accent` `#111110` (ink), hover `#000`
- `--bronze` `#8a6d43` on light surfaces (corrected from `#9a7b4f`,
  which failed AA contrast — see `styles.css:7275`), `--bronze-on-dark`
  `#a98a5c` on dark/ink cards. Micro-labels and accents. Always check
  the actual winning `:root` block before quoting a token value — this
  file had the pre-correction value until 2026-08-01.
- Radii, shadow rgbas, and `--max: 940px` as already declared in
  `styles.css`'s primary `:root` (`styles.css:49-83`).
- These are sourced from benjaminbarkerstudios.com's live theme. Never
  drift back to the old warm-brown palette, and never introduce a
  second accent hue.

## Typography

- Display: EB Garamond, regular + true italic cut, hero titles only.
- Body / UI: Manrope, all other text.
- No new faces. No italic on headings beyond EB Garamond's existing use
  (italic headers are otherwise banned — body-copy emphasis only).

## Motion

- Easings/durations: existing `--ease-out`, `--ease-standard`,
  150/220/380ms tokens.
- The tape-measure moment (`runMeasureMoment`) is the app's one loading
  language — do not add a second loading pattern.
- No scroll-reveals: this is a touch app, not a scrolling site.
  Deeper navigation stays instant; add a loading beat only where a
  real wait exists.
- `prefers-reduced-motion` kill rules stay as-is.
- Playful accents (Guided-flow + Hub families only): may add one small
  celebratory or responsive touch per view (e.g. a result reveal
  flourish) — never more than one per view, and never in the Workbench
  or Editorial-content families.

## Microinteractions stance

- Touch-first: 44px minimum targets on coarse pointers,
  `touch-action: manipulation`, visible `:active` press state (cream
  `--bg` flash, never white-on-white).
- Inputs/selects ≥16px font (iOS Safari zoom guard).
- Hover delay 800ms / focus delay 0ms on any tooltip, per existing
  convention.

## CTA voice

- Primary: chrome-pill button, ink fill, inverts on hover
  (`button:hover` → `background: var(--accent) !important` — the
  known cascade trap; anything that is a card/pin/label/swatch and not
  a true button carries `.btn-bare`).
- Secondary: outline/transparent pill, same radius family.
- No new button shape or CTA copy pattern — match what's shipped.

## Per-view-type allowances

- Reveal and Guided-flow MAY use the one playful motion touch above.
- Workbench MUST NOT add enrichment beyond the render itself — the
  cloth/garment compositor and drape simulation already carry the
  visual weight.
- Editorial content is typography + vendored photography only.
- Hub/Index uses the established card-grid rhythm; do not reintroduce
  a list-only layout.

## What every view MUST share

- Cream/ink/bronze palette, EB Garamond + Manrope pairing, chrome-pill
  button voice, the tape-measure motion signature, the single
  delegated `data-action` click handler.

## What views MAY differ on

- Which view-type family macrostructure applies (per view type above).
- Archetype choice within a family (e.g. which Reveal layout knob).
- Card-grid density on Hub/Index views.
- The one playful motion touch, where the family allows it.

## Exports

Skipped — nothing outside this app consumes these tokens, so
Tailwind/DTCG/shadcn export blocks would be dead weight. `styles.css`'s
primary `:root` (`styles.css:49-83`) is already the source of truth.
Add an export block only if this design system needs to travel to
another project.
