# CLAUDE.md — BBS Style Discovery

In-store iPad app for Benjamin Barker Studios: style/colour quizzes, a 313-topic
menswear guide, wardrobe worksheet, and PDF/PNG exports. Vanilla JS/HTML/CSS,
no framework, no build step, no backend, no runtime dependencies (everything is
vendored). It runs by opening `index.html` (or any static file server), and is
deployed via GitHub Pages at https://turbocheese.github.io/bbs-style-discovery/
(serves `master`, HTTPS, service worker active). This is deliberately vanilla / no-build / offline / no-backend — that is what makes it "open index.html" and run on a kiosk offline. A framework, bundler, or backend trades that away, so it is the wrong default. If the founder is weighing one, show the real cost rather than just agreeing or refusing.

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

Script order in `index.html` is load-bearing (globals defined top-down). **`index.html` is the source of truth for the order — read the script block there, do not trust a list here.** The files, in that order, and what is load-bearing about each:

- `data.js` — guide tree (`window.guideTree`, exactly **313 topics**)
- `validator.js` — structural validation of the tree
- `query.js` — search/ranking/related-topics engine
- `discovery-ui.js` — FAB + slide-out discovery panel, result cards
- `colour-direction.js` — colour quiz data/scoring (separate feature by design)
- `lookbook.js` — editorial lookbook
- `wardrobe-templates.js` — worksheet templates per archetype
- `cloth-data.js` — the cloth library: **117 cloths across 34 mills, 34 of them verified**, pure data, no functions. Read its header before adding one. The load-bearing rule is the `verified` flag: a cloth is either a real researched bunch (carrying `bunch` + spec + a `source` URL) or it carries **no** `composition`, `weight` or `bunch` at all. `verify/audit.js` enforces that, plus that every `millPath` resolves in Cloth Origins. Never fill a spec in to make a card look complete.
- `heritage.js` — animated number tickers on the heritage strips
- `attract-shader.js` — the `#app-backdrop` canvas shader behind the welcome screen
- `weave-engine.js` — renders a cloth's 96×96 tile from its parameters: six weave grounds (plain, twill, hopsack, flannel, birdseye, herringbone) × five overlays (none, chalkstripe, pinstripe, windowpane, glen). Deterministic — texture is seeded from the cloth key, never `Math.random`, so a cloth looks identical on every load. Pattern pitch is snapped to a divisor of 96 by `snapWeavePitch()` or the tile visibly seams. This replaced 14 hand-written `drawTile` functions; do not add new ones (the `drawTile` escape hatch in `getFabricTile` still works, but no cloth currently needs it).
- `garment-photo.js` — the runtime compositor that pours a cloth into a photographed garment (mask, luminance multiply, displacement, drawn buttons/lining). Must precede `fabric-visualiser.js`, which calls `renderGarmentPhoto()`.
- `fabric-visualiser.js` — the Cloth Room. Three mutually exclusive modes off one view: single cloth, two-cloth compare, and ensemble (three-piece flat-lay with per-garment cloths + jacket styling, exports a Design Spec PDF). Mode flags live in `appState` (`visCompare`, `visEnsemble`) and `renderFabricVisualiser()` routes on them — keep them mutually exclusive when adding a mode. Ensemble style options are **per-garment** (`ens.style.jacket` / `.vest` / `.trousers`, defined in `VIS_ENS_STYLE_OPTIONS`); `getVisEnsembleState()` migrates the old flat jacket-only shape and backfills defaults, so a persisted state from before an option existed still renders. Add an option by adding it to `VIS_ENS_STYLE_OPTIONS` and `VIS_ENS_STYLE_DEFAULTS` — the menu, the Design Spec PDF note (`visEnsStyleNote`) and the migration all read from those, so nothing else needs touching. Faceted filtering (`VIS_FACETS`) filters by **region**, not mill: 34 houses is too many chips for an iPad, and region derives from `millPath` so it cannot disagree with Cloth Origins.
- `cloth-study.js` — the Cloth Study panel (drape, sheen, loupe, pairing web).
  The drape is a **gathered** panel: the cloth is wider than the bar it hangs
  from (`handle.gather`), so the surplus buckles out of the plane and the mesh
  is solved in 3D. Three parts hold that up and each one has already been the
  difference between cloth and a flat grey rectangle — the diagonal shear
  constraints (without them the surplus splays sideways and the fold relaxes
  away within a second), the Lambert shading off the real surface normal (so a
  fold has a lit face and a shaded face rather than symmetric corrugation), and
  the per-quad texture mapping (so a chalkstripe bends around the fold; per
  column strip was tried and stretched the weave into pale wedges at the
  edges). Folds are seeded from the cloth key, never `Math.random`, so a cloth
  hangs the same way every time. `node verify/drape.js` measures all of this
  from pixels — run it after touching the drape.
- `archetype-avatars.js` — faceless SVG tailoring busts for the Archetype Gallery
- `vendor/cobe.js` — the Cloth Origins globe (vendored, ESM rewritten to a global). Must precede `mill-map.js`.
- `mill-map.js` — the Mill Map ("Provenance Chart"). Coastlines in `MAP_COASTS` are **generated**, not hand-drawn: Natural Earth 50m land polygons (public domain), clipped to the chart bbox and Douglas-Peucker simplified. Regenerate with `tools/make-coasts.js` (see its header) if the bbox changes — do not hand-edit the coordinate arrays.
- `vendor/html2canvas.min.js` (vendored, was cdnjs)
- `vendor/jspdf.umd.min.js` (vendored, was cdnjs)
- `app.js?v=N` — views, both quizzes, worksheet, exports, navigation
- inline `<script>` in index.html that calls `runValidation()` and registers `sw.js` — runs **after** app.js

Script order is load-bearing — globals are defined top-down, so reordering breaks references, and the validation runner must stay after app.js. Move something only once you have traced the dependency and know it holds.

**The `button:hover` trap.** `styles.css` restyles every `button` as a chrome pill and inverts it on hover with `background: var(--accent) !important`. That selector is `button:hover` — element + pseudo-class (0,1,1) — so it **outranks any single class (0,1,0), including one with `!important`**. Five components have hit this: the Complete-the-Look cards, the provenance tape markers, the globe country labels, the split's side selectors and the gallery view toggle, each turning into an unreadable black box under the pointer. On a touch-first app a tap can leave a sticky hover, so this is a real fault and not desktop cosmetics. **A button that is a card, pin, label or swatch should carry `.btn-bare`**, which opts out. Otherwise you will find it the hard way.

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
- Views are built by **string concatenation** returning full HTML, injected via `innerHTML`. Match that string-concat pattern. A templating layer would fragment the codebase for no build-time payoff, so it is not worth it here.
- Double-tap on the logo wipes the session (staff reset between clients). Preserve it.
- **No idle attract-reset.** There used to be one (3 minutes wiped the session
  and returned to welcome); the founder removed it in July 2026 because a client
  who finishes a quiz, walks the floor and comes back must still find their
  results. The double-tap-logo wipe is now the only reset. Do not reintroduce a
  timed wipe without the founder asking.

## Loading moments and motion

- `runMeasureMoment(label, done, ms)` in app.js is the app's only loading screen:
  a tape-measure interstitial. Full 1.5s unroll/hold/roll-back cycle before quiz
  results ("Taking your measurements…" / "Reading your colours…"); short ~650ms
  beat entering each main-menu section. Deeper navigation is instant by design; add a loading beat only where a real wait exists, not for decoration.
- The tape-measure is the app's visual signature: quiz/colour-quiz progress renders
  as a numbered tape blade (numbers self-invert via `mix-blend-mode: difference`
  as the fill sweeps under them), the worksheet progress bar shares the same
  ticked-track language, and the measure moment animates it via the `tapeCycle`
  CSS keyframe. Motion tokens (`--ease-out`, `--dur-*`) live in the primary `:root`.
- All motion must respect `prefers-reduced-motion` (global kill rules exist in styles.css).

## Event handling — hard rule

There is exactly **one** delegated click handler on `document.body` in app.js,
dispatching on `data-action` attributes. Add new interactions as new `data-action`
branches inside it. **A second click listener is almost never right** — duplicate handlers caused serious false-trail bugs in this project's history, so route clicks through the one delegated handler. Anything that must observe
interaction outside that handler uses `pointerdown`/`keydown`/`scroll`, not
`click`. Export/share buttons get an automatic "Preparing…" busy state
in the click handler — a fixed 4s restore, because the export paths share no
completion callback; wire real hooks if exports ever grow slower.

## Code conventions (match, don't modernize)

- ES5 style: `var`, function declarations, string concatenation. Match this style — half a file in modern syntax and half in ES5 is the real cost, so consistency beats modernity in a no-build codebase. Introduce `let`/`const`, arrow functions, template literals, classes, or modules only if you would convert the whole file, and there is no reason to.
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
- Topic count is currently 313 (288 + 24 mill/merchant topics added July 2026 with
  the Mill Map, + 1 outerwear/overcoat topic added August 2026). If you add/remove
  topics, update the count where it appears in docs (and the expected total in
  `verify/audit.js`), and re-run the audits (below).
- **topic_kind coverage is complete: 313 of 313 (audited 19 July 2026, +1 August 2026).** The
  long-standing gap (98 topics, all in tailoring sub-trees) was backfilled per
  METADATA_GOVERNANCE.md's assignment rules. `node verify/audit.js` now exits
  clean — it had failed on this check on every previous run. Keep it at zero:
  every new topic needs an explicit topic_kind.
- **A node's `key` must equal its position in the tree.** Links are built from
  paths, so a node sitting at `peak_lapel` whose key says `"peak"` produces a
  path that resolves to nothing and renders a blank page. Fourteen nodes had
  drifted this way; validator.js now enforces it.
- Mill topics carry only facts that were verified when written (founding years,
  towns, ownership). If you add a house, verify it or leave the field out —
  clients read these pages.
- Duplicate topic concepts across contexts (Oxford, Travel, etc.) are intentional;
  disambiguation is `getTopicContextLabel()` in discovery-ui.js.
- Colour result rendering de-duplicates Strong Neutrals against Best On You at
  render time (card and dossier) — the raw profile lists in colour-direction.js
  overlap by design; do not "fix" the data to match.

## Founder product decisions (settled defaults, not laws)

These are the current answers, and the founder revisits them. Do not silently override one — flag it and let the founder call it.

- Shoes live under Accessories.
- Score Style and Colour independently — keep the two diagnostics separate (fusing them loses each read). Combining their presentation into one result is fine and expected; combining the scoring is not.
- Quiz branching is id/path-based (`quizAnswersById`), never positional array indexes.
- Quiz advance is tap-answer → tap-Next. No auto-advance (founder decision).
- Sharing is native device share (PNG) + PDF export. QR-code sharing was deferred
  until hosting existed; hosting now exists (GitHub Pages) but QR remains
  unbuilt — do not build it without the founder asking.
- No pricing in the worksheet. No digitized measurement flow.
- The lookbook is **28 looks, all real BBS campaign photography vendored into
  `images/lookbook/`** (scraped from benjaminbarkerstudios.com's Shopify CDN via
  its sitemap, July 2026). Never hotlink — the app must work offline, and a dead
  hotlink is what killed the old look-02 entry. Captions describe only what is
  visible in the frame: do not assert fibre content or cloth names you cannot
  see, link the guide topic and let the topic do the talking. Lookbook `<img>`
  tags carry an `onerror` that hides a failed tile, so a missing photo makes a
  look vanish silently — `node verify/lookbook.js` is what catches that.

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
6. **If you touched the drape in cloth-study.js:** run `node verify/drape.js`
   (needs the same `npx serve .` as the smoke harness). It fails if the panel
   stops folding — which looks like working code and renders a flat rectangle.
7. **If you touched lookbook.js or `images/lookbook/`:** run
   `node verify/lookbook.js` (plain Node, no server). It fails if a photo is
   not vendored, is missing from `sw.js`'s PRECACHE, or a `guidePath` does not
   resolve to a topic — all three break silently in the browser.
8. **If you touched data.js:** run `node verify/audit.js` (committed data-health
   audit; the "console audit scripts" older docs mention were never committed).
   Metadata and topic_kind must both stay at zero missing — the audit is fully
   green as of 19 July 2026, so any failure is something you introduced.
   Confirm Browse All Topics still returns the full topic count.
9. **If you changed app.js or styles.css:** bump the `?v=` in index.html AND in
   `sw.js`'s precache list, and bump `CACHE_VERSION` in sw.js.
10. Before a staff demo, run the full `SMOKE_TEST_CHECKLIST.md`.

`verify/smoke.js` is the only automated safety net (no unit tests, no CI) —
skipping it is how regressions ship.
