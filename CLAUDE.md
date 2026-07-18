# CLAUDE.md — BBS Style Discovery

In-store iPad app for Benjamin Barker Studios: style/colour quizzes, a 288-topic
menswear guide, wardrobe worksheet, and PDF/PNG exports. Vanilla JS/HTML/CSS,
no framework, no build step, no backend, no runtime dependencies (everything is
vendored). It runs by opening `index.html` (or any static file server), and is
deployed via GitHub Pages at https://turbocheese.github.io/bbs-style-discovery/
(serves `master`, HTTPS, service worker active). Keep it that way — do not
suggest frameworks, bundlers, TypeScript, or a backend unless the founder asks.

**Product framing (founder direction, July 2026):** the quizzes are a fun,
"wow"-factor experience for customers — NOT a consultation. Prefer playful,
experiential copy (quiz, discovery, "Taking your measurements…") over service
language (consultation, assessment). Older docs in this repo predate this and
still say "consultation"; the framing here wins.

Deep context lives in the other docs — read them only when needed:
- `FOUNDER_HANDOVER.md` — product history and decisions, plus a July 2026 addendum
- `METADATA_GOVERNANCE.md` — approved vocabulary for `data.js` metadata
- `SMOKE_TEST_CHECKLIST.md` — manual QA checklist + the two console audit scripts
- `PRODUCT_LINKING_SCHEMA.md` — future SKU linking (parked; do not build)

## Architecture and load order

Script order in `index.html` is load-bearing (globals defined top-down). Current, real order:

1. `data.js` — guide tree (`window.guideTree`, exactly **288 topics**)
2. `validator.js` — structural validation of the tree
3. `query.js` — search/ranking/related-topics engine
4. `discovery-ui.js` — FAB + slide-out discovery panel, result cards
5. `colour-direction.js` — colour quiz data/scoring (separate feature by design)
6. `lookbook.js` — editorial lookbook
7. `wardrobe-templates.js` — worksheet templates per archetype
8. `fabric-visualiser.js` — the Cloth Room (SVG garment re-rendered in tap-selected cloths, plus a two-cloth side-by-side compare mode)
9. `archetype-avatars.js` — faceless SVG tailoring busts for the Archetype Gallery
10. `vendor/html2canvas.min.js` (vendored, was cdnjs)
11. `vendor/jspdf.umd.min.js` (vendored, was cdnjs)
12. `app.js?v=N` — views, both quizzes, worksheet, exports, navigation
13. inline `<script>` in index.html that calls `runValidation()` and registers `sw.js` — runs **after** app.js

Do not reorder. Do not move the validation runner.

**Cache busting:** `app.js` is loaded as `app.js?v=N` and `styles.css` as
`styles.css?v=N`. When you change either file, bump its `N` in index.html AND
update the matching `?v=` entries + `CACHE_VERSION` in `sw.js` — the service
worker precaches by exact URL, so a mismatched version serves stale files.
(Other files have no version param but are also precached; bump `CACHE_VERSION`
whenever any cached file changes.)

**Dependencies are fully vendored:** html2canvas and jsPDF live in `vendor/`,
EB Garamond + Manrope variable fonts (latin subset) in `fonts/` — no CDN at
runtime, and `sw.js` makes the whole app work offline. Keep the existing
`typeof html2canvas === "undefined"` guards in export code anyway — the app
must degrade to an alert, never crash.

## State model

- Single global `appState`; shape defined by `getFreshState()` in app.js. New state fields go there first.
- Persisted to `localStorage` key `bbs_session` on every `render()`. Loading is wrapped in try/catch that clears a corrupted key — do not remove that guard.
- `render()` in app.js is the single router: every view is a `case` in its `switch`. New views = new `case` + a `render<View>()` function returning an HTML string.
- Views are built by **string concatenation** returning full HTML, injected via `innerHTML`. Follow that pattern; do not introduce templating.
- Double-tap on the logo wipes the session (staff reset between clients). Preserve it.
- **Idle attract-reset:** 3 minutes without interaction on any non-welcome view wipes
  the session and returns to welcome (`_armIdleReset()` in app.js, listening on
  pointerdown/keydown/scroll). Kiosk behaviour — an abandoned iPad must never show
  the previous client's name or results. Preserve it.

## Loading moments and motion

- `runMeasureMoment(label, done, ms)` in app.js is the app's only loading screen:
  a tape-measure interstitial. Full 1.5s unroll/hold/roll-back cycle before quiz
  results ("Taking your measurements…" / "Reading your colours…"); short ~650ms
  beat entering each main-menu section. Deeper navigation is instant on purpose —
  do not add more loading screens.
- The tape-measure is the app's visual signature: quiz/colour-quiz progress renders
  as a numbered tape blade (numbers self-invert via `mix-blend-mode: difference`
  as the fill sweeps under them), the worksheet progress bar shares the same
  ticked-track language, and the measure moment animates it via the `tapeCycle`
  CSS keyframe. Motion tokens (`--ease-out`, `--dur-*`) live in the primary `:root`.
- All motion must respect `prefers-reduced-motion` (global kill rules exist in styles.css).

## Event handling — hard rule

There is exactly **one** delegated click handler on `document.body` in app.js,
dispatching on `data-action` attributes. Add new interactions as new `data-action`
branches inside it. **Never attach a second click listener** — duplicate handlers
caused serious false-trail bugs in this project's history. (The idle-reset
listeners deliberately use `pointerdown`/`keydown`/`scroll`, not `click`, to
stay compliant.) Export/share buttons get an automatic "Preparing…" busy state
in the click handler — a fixed 4s restore, because the export paths share no
completion callback; wire real hooks if exports ever grow slower.

## Code conventions (match, don't modernize)

- ES5 style: `var`, function declarations, string concatenation. No `let`/`const`,
  arrow functions, template literals, classes, or modules in these files — consistency
  beats modernity in a no-build codebase.
- 4-space indent, double quotes dominant in app.js (some worksheet-era blocks use
  single quotes — match whichever the block you're editing uses).
- One source of truth per function. When replacing or reverting anything, delete the
  old copy entirely — JS hoisting means a leftover duplicate silently shadows or gets
  shadowed, which has already caused shipped bugs here.
- Shared export helpers exist in app.js: `renderElementToCanvas`,
  `fitCanvasToA4Page` (page-fit + centering; converts canvases to **JPEG q0.92** —
  PNG produced 30–90MB PDFs, do not revert), `canvasToPDF`, `canvasesToPDF`
  (multi-page, used by the Client Dossier), `shareCanvasAsPNG`. All export/share
  paths must go through them — do not re-inline html2canvas/jsPDF calls.
- Conceptually separate features get their own file (colour-direction.js,
  fabric-visualiser.js, lookbook.js), not more length in app.js.
- Copy voice is British English (colour, honours). Em-dashes are house style in
  editorial content (archetype/topic copy) but are avoided in UI chrome strings.

## Design tokens and styles.css — read before editing

- The primary `:root` at the top of styles.css holds **brand-exact tokens** sourced
  from benjaminbarkerstudios.com's live theme: ink `#111110` (near-black stand-in
  for the brand's #000), cream `#eae5dd`, taupe `#a4a19c`, white surfaces, plus a
  bronze accent `--bronze: #9a7b4f` used on micro-labels. Do not drift back to the
  old warm-brown palette.
- The file contains **stacked override layers**: the same selector defined multiple
  times, later blocks patching earlier ones with `!important` (~80 selectors still
  have layered definitions from past redesign generations). The *last* definition
  in file order wins. Before changing any style, grep for every occurrence of the
  selector and edit the final winning block — or append a new clearly-commented
  section at the end of the file. Do not add new `!important` layers when editing
  the winning block works.
- **Known cascade trap:** the maison layer's blanket
  `button { background: transparent !important }` reset has repeatedly eaten
  solid button fills declared without `!important` (FAB, onboarding selections,
  panel Search button — all fixed with `!important`). If a dark-filled control
  renders invisible, check this first.

Other UI invariants:
- `body.has-fab` (toggled by `syncFabVisibility()` in app.js) adds bottom padding so
  content clears the floating discovery button. Keep the class and CSS in sync.
- Worksheet tier badges display **Essential / Upgrade / Luxury** (data values remain
  `foundation` / `enhancement` / `luxury`). The display labels were deliberately
  renamed to avoid colliding with the "Foundation Pieces" / "Refinements" section
  headings — do not "fix" them back to match the data keys.
- Touch-first: interactive controls have 44px minimum targets on coarse pointers,
  `touch-action: manipulation`, and visible `:active` press states (cream `--bg`
  flash — never white-on-white). Inputs/selects are ≥16px font so iOS Safari
  doesn't auto-zoom on focus.
- On the colour result, `.colour-hero-swatch` bands must NOT be in any
  `border-radius: 50%` rule (50% radius on the ribbon bands renders distended
  ellipses — this shipped once).

## data.js rules

- Every topic node needs explicit `type`, `key`, `title`, `topic_kind`, `tags`,
  `intro`, `metadata`, `sections`. Never infer or omit `topic_kind`.
- Metadata values must use the approved vocabulary in `METADATA_GOVERNANCE.md`.
- **Doc/code gap, verified July 2026:** the "auto-enrichment script at the bottom
  of data.js" described in the older docs does NOT exist in the code (it was
  apparently a console one-off, never committed). Write explicit metadata; there
  is no safety net.
- Topic count is currently 288. If you add/remove topics, update the count where it
  appears in docs, and re-run the audits (below).
- **True topic_kind coverage (audited 18 July 2026): 181 of 288 topics have an
  explicit topic_kind; 107 (mostly tailoring sub-trees) have none.** The older
  docs' claim of full coverage was never true of the committed code. Rendering
  falls back gracefully, so this is a data-quality gap, not a bug — backfill per
  METADATA_GOVERNANCE.md's assignment rules when touching those topics.
- Duplicate topic concepts across contexts (Oxford, Travel, etc.) are intentional;
  disambiguation is `getTopicContextLabel()` in discovery-ui.js.
- Colour result rendering de-duplicates Strong Neutrals against Best On You at
  render time (card and dossier) — the raw profile lists in colour-direction.js
  overlap by design; do not "fix" the data to match.

## Product decisions that constrain code (do not relitigate)

- Shoes live under Accessories.
- Style Direction and Colour Direction are separate quizzes — never merge.
- Quiz branching is id/path-based (`quizAnswersById`), never positional array indexes.
- Quiz advance is tap-answer → tap-Next. No auto-advance (founder decision).
- Sharing is native device share (PNG) + PDF export. QR-code sharing was deferred
  until hosting existed; hosting now exists (GitHub Pages) but QR remains
  unbuilt — do not build it without the founder asking.
- No pricing in the worksheet. No digitized measurement flow.
- The lookbook currently has placeholder hotlinked photos; its look-02 entry was
  removed when its hotlink died. Restore/expand only with real BBS campaign
  photography. Lookbook `<img>` tags carry an `onerror` that hides a failed tile.

## Definition of done

Work is not finished until all of these pass:

1. **Syntax:** `node --check` on every `.js` file you touched.
2. **Validator:** load the app and confirm the console shows validation passing with
   zero errors (the inline runner calls `runValidation()` on every load).
3. **No console errors** on load or during the flows you touched.
4. **Run the committed smoke harness: `node verify/smoke.js`** (see the file
   header for setup — `npx serve .` + `npm i --no-save playwright`). It covers
   the full behavioral check automatically: load + validator, all menu entries,
   both quizzes to result, worksheet, dossier export, offline boot, and fails
   on any console error or 4xx/5xx response. For flows it doesn't cover, drive
   them in Playwright yourself.
5. **If you touched export/share code:** exercise the export paths for real
   (libraries are vendored — no CDN stubbing needed) and sanity-check output
   file sizes: each PDF should be well under ~1MB. A multi-MB PDF means the
   JPEG conversion in `fitCanvasToA4Page` regressed.
6. **If you touched data.js:** run `node verify/audit.js` (committed data-health
   audit; the "console audit scripts" older docs mention were never committed).
   Metadata must stay at zero missing; topic_kind has a known pre-existing gap
   (107 topics) — do not add new gaps, and confirm Browse All Topics still
   returns the full topic count.
7. **If you changed app.js or styles.css:** bump the `?v=` in index.html AND in
   `sw.js`'s precache list, and bump `CACHE_VERSION` in sw.js.
8. Before a staff demo, run the full `SMOKE_TEST_CHECKLIST.md`.

`verify/smoke.js` is the only automated safety net (no unit tests, no CI) —
skipping it is how regressions ship.
