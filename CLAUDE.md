# CLAUDE.md — BBS Style Discovery

Internal styling/consultation tool for Benjamin Barker Studios. Vanilla JS/HTML/CSS,
no framework, no build step, no backend, no package.json dependencies. It runs by
opening `index.html` (or any static file server). Keep it that way — do not suggest
frameworks, bundlers, TypeScript, or a backend unless the founder asks.

Deep context lives in the other docs — read them only when needed:
- `FOUNDER_HANDOVER.md` — product history and decisions (note: its script-order list is correct; PROJECT_CONTEXT.md's is stale)
- `METADATA_GOVERNANCE.md` — approved vocabulary for `data.js` metadata
- `SMOKE_TEST_CHECKLIST.md` — manual QA steps + the two console audit scripts (~line 648)
- `PRODUCT_LINKING_SCHEMA.md` — future SKU linking (parked; do not build)

## Architecture and load order

Script order in `index.html` is load-bearing (globals defined top-down). Current, real order:

1. `data.js` — guide tree (`window.guideTree`, exactly **288 topics**), auto-enrichment script at bottom
2. `validator.js` — structural validation of the tree
3. `query.js` — search/ranking/related-topics engine
4. `discovery-ui.js` — FAB + slide-out discovery panel, result cards
5. `colour-direction.js` — colour quiz data/scoring (separate feature by design)
6. `lookbook.js` — editorial lookbook
7. `wardrobe-templates.js` — worksheet templates per archetype
8. `html2canvas` (cdnjs CDN)
9. `jspdf` (cdnjs CDN)
10. `app.js?v=N` — views, both quizzes, worksheet, exports, navigation
11. inline `<script>` in index.html that calls `runValidation()` — runs **after** app.js

Do not reorder. Do not move the validation runner.

**Cache busting:** `app.js` is loaded as `app.js?v=N` and `styles.css` as
`styles.css?v=N`. When you change either file, bump its `N` in index.html AND
update the matching `?v=` entries + `CACHE_VERSION` in `sw.js` — the service
worker precaches by exact URL, so a mismatched version serves stale files.
(Other files have no version param but are also precached; bump `CACHE_VERSION`
whenever any cached file changes.)

**Dependencies are fully vendored:** html2canvas and jsPDF live in `vendor/`,
fonts in `fonts/` — no CDN at runtime, and `sw.js` makes the whole app work
offline. Keep the existing `typeof html2canvas === "undefined"` guards in export
code anyway — the app must degrade to an alert, never crash.

## State model

- Single global `appState`; shape defined by `getFreshState()` in app.js. New state fields go there first.
- Persisted to `localStorage` key `bbs_session` on every `render()`. Loading is wrapped in try/catch that clears a corrupted key — do not remove that guard.
- `render()` in app.js is the single router: every view is a `case` in its `switch`. New views = new `case` + a `render<View>()` function returning an HTML string.
- Views are built by **string concatenation** returning full HTML, injected via `innerHTML`. Follow that pattern; do not introduce templating.
- Double-tap on the logo wipes the session (staff reset between clients). Preserve it.

## Event handling — hard rule

There is exactly **one** delegated click handler on `document.body` in app.js,
dispatching on `data-action` attributes. Add new interactions as new `data-action`
branches inside it. **Never attach a second click listener** — duplicate handlers
caused serious false-trail bugs in this project's history. Keyboard and input
handlers follow the same single-listener pattern.

## Code conventions (match, don't modernize)

- ES5 style: `var`, function declarations, string concatenation. No `let`/`const`,
  arrow functions, template literals, classes, or modules in these files — consistency
  beats modernity in a no-build codebase.
- 4-space indent, double quotes dominant in app.js (some worksheet-era blocks use
  single quotes — match whichever the block you're editing uses).
- One source of truth per function. When replacing or reverting anything, delete the
  old copy entirely — JS hoisting means a leftover duplicate silently shadows or gets
  shadowed, which has already caused shipped bugs here.
- Shared export helpers exist in app.js: `renderElementToCanvas`, `canvasToPDF`
  (page-fit + centering math), `shareCanvasAsPNG`. All export/share paths must go
  through them — do not re-inline html2canvas/jsPDF calls.
- Conceptually separate features get their own file (as colour-direction.js did),
  not more length in app.js.

## styles.css — read before editing

The file contains **stacked override layers**: the same selector defined multiple
times, later blocks patching earlier ones with `!important` (e.g. `.arch-shell`
appears 3+ times; `#app` twice). The *last* definition in file order wins. Before
changing any style, grep for every occurrence of the selector and edit the final
winning block — or append a new clearly-commented section at the end of the file.
Do not add new `!important` layers when editing the winning block works.

Other UI invariants:
- `body.has-fab` (toggled by `syncFabVisibility()` in app.js) adds bottom padding so
  content clears the floating discovery button. Keep the class and CSS in sync.
- Worksheet tier badges display **Essential / Upgrade / Luxury** (data values remain
  `foundation` / `enhancement` / `luxury`). The display labels were deliberately
  renamed to avoid colliding with the "Foundation Pieces" / "Refinements" section
  headings — do not "fix" them back to match the data keys.

## data.js rules

- Every topic node needs explicit `type`, `key`, `title`, `topic_kind`, `tags`,
  `intro`, `metadata`, `sections`. Never infer or omit `topic_kind`.
- Metadata values must use the approved vocabulary in `METADATA_GOVERNANCE.md`.
- The auto-enrichment script at the bottom of data.js is a safety net — do not remove
  it, and do not rely on it instead of writing explicit metadata.
- Topic count is currently 288. If you add/remove topics, update the count where it
  appears in docs, and re-run the audits (below).
- Duplicate topic concepts across contexts (Oxford, Travel, etc.) are intentional;
  disambiguation is `getTopicContextLabel()` in discovery-ui.js.

## Product decisions that constrain code (do not relitigate)

- Shoes live under Accessories.
- Style Direction and Colour Direction are separate consultations — never merge.
- Quiz branching is id/path-based (`quizAnswersById`), never positional array indexes.
- Sharing is native device share (PNG) + PDF export. QR-code sharing is **deferred by
  explicit founder decision until minimal hosting exists** — do not build it, and do
  not remove native share, without the founder saying hosting is ready.
- No pricing in the worksheet. No digitized measurement flow.

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
5. **If you touched export/share code:** exercise all three paths (style card PDF,
   colour card PDF, worksheet PDF) and native share. In sandboxes that block cdnjs,
   stub `window.html2canvas` and `window.jspdf` via an init script and assert the
   save/share calls fire.
6. **If you touched data.js:** paste both audit scripts from `SMOKE_TEST_CHECKLIST.md`
   into the console — targets are 0 missing metadata, 0 missing/suspicious topic_kind —
   and confirm Browse All Topics still returns the full topic count.
7. **If you changed app.js:** bump the `?v=` cache-bust number in index.html.
8. Before a staff demo, run the full `SMOKE_TEST_CHECKLIST.md`.

There is no test suite and no CI — these manual checks are the only safety net, so
skipping them is how regressions ship.
