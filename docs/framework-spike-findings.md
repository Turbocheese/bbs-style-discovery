# Framework Spike — React vs Vue vs Vanilla for the BBS Cloth Room

**Question:** Would migrating BBS Style Discovery to React or Vue improve it, or should it stay vanilla?

**Method:** Reimplemented the app's most state-heavy screen — the single-cloth **Cloth Room**
(filter dropdowns + swatch tray + cloth selection + info panel) — three ways: the existing
vanilla code (read), a React POC (`spike/react/`), and a Vue POC (`spike/vue/`). Both POCs use a
real 24-cloth slice of the production `cloth-data.js` (`spike/shared/cloths.js`, identical shape),
a realistic Vite build, and the same faceted-filter rules as the real screen (region derived from
`millPath`, OR-within-facet / AND-across-facet). The garment canvas is stubbed as a coloured box —
this spike tests state/UI plumbing, not the weave engine.

**Bottom line: stay vanilla.** For a solo-maintained, offline-first, no-backend kiosk app, a
framework's genuine wins (~30% less UI code on one screen) are real but small, and they are bought
by dismantling the three properties that make this app cheap and durable to run: zero build,
one-file vendoring, and exact-URL service-worker precaching. The screen that would benefit most is
already solved. See "When would this change?" at the end.

---

## 1. Code clarity / lines of code (same screen)

Non-blank source lines for the single-cloth screen, excluding the shared cloth-data JSON:

| Implementation | Files | Non-blank lines | Notes |
|---|---|---|---|
| **Vanilla** (existing) | `fabric-visualiser.js` (single-cloth slice) + shared dropdown helpers in `app.js` | **~255** (~231 in the feature + 24 shared) | Carries extra real features the POCs stub: recommended-cloth strip, weave/pattern/mill guide-links, swatch re-sync. Trimmed to the POCs' exact scope it is roughly **190–210**. |
| **React** | `ClothRoom.jsx` + `cloth-logic.js` + `main.jsx` | **165** | JSX + `useState`/`useMemo`/`useEffect`. |
| **Vue** | `ClothRoom.vue` + `FacetDropdown.vue` + `cloth-logic.js` + `main.js` | **146** | `<script setup>` + `ref`/`computed`/`watch`. |

**Reading of it:** both frameworks are meaningfully more concise (~30% fewer lines even against the
trimmed vanilla), and the win is *qualitative* more than quantitative. The vanilla code's real cost
is not line count — it is the three hand-maintained partial-update functions (`visApplyFabric`,
`visSyncSwatchMarks`, `visApplyCompareFabric`) that manually reach into the DOM (`getElementById`,
`el.innerHTML = …`, `el.className = …`) to keep the canvas, info panel, cloth-study block and
swatch rings in sync after a tap. In both frameworks that entire class of code **disappears**: you
set `selKey` and everything downstream re-renders from it. That is the honest case for a framework,
and on this one screen it is a fair case.

Vue edged React on both concision and readability here: the template reads close to the app's
existing HTML-string mental model, and `ref`/`computed` needed less ceremony than
`useMemo`/`useEffect` + immutable-update spreads for the filter object.

**But** the vanilla screen is not badly written — it is *understandable top-to-bottom with no
framework knowledge*. A solo maintainer returning after months reads plain functions that return
strings; there is no reconciler, no reactivity graph, no hook-dependency footguns.

## 2. Build & tooling cost

This is where the migration stops being cheap.

- **"Just open `index.html`" dies.** The vanilla app runs by double-clicking a file. Both POCs are
  ES-module Vite apps: `.jsx`/`.vue` must be compiled; opening `index.html` from disk does nothing.
  You gain `npm install` (React POC pulled **63 packages**; Vue **31**), a dev server, and a
  `dist/` build step before anything is viewable.
- **The no-build story becomes a build story for all ~15 modules.** The current 16-script,
  load-order-dependent `index.html` (globals defined top-down: `data.js` → `validator.js` → … →
  `app.js`) would be replaced by module imports and a bundler graph. That is not a one-screen
  change — `app.js` alone is ~293 KB and every feature file (`colour-direction.js`, `mill-map.js`,
  `weave-engine.js`, the quizzes, worksheet, exports) shares the global `appState` and global
  helper functions. A partial migration means running vanilla globals *and* a framework runtime
  side by side, which is strictly worse than either.
- **Service-worker caching changes character.** Today `sw.js` precaches by **exact URL** and
  cache-busts with hand-bumped `?v=N` on `app.js`/`styles.css` plus `CACHE_VERSION`. A bundler emits
  **content-hashed filenames** (`index-B2s2HBh4.js`) that change every build, so the precache list
  can no longer be a hand-maintained set of literal names — it must be generated from the build
  manifest (Workbox or `vite-plugin-pwa`). Offline still works, but the offline story is now
  coupled to the build tool, not to a file you can read and edit by hand.

## 3. Bundle size (production build vs current footprint)

Real numbers from `npm run build` on each POC (24-cloth data inlined):

| Build | JS (raw) | JS (gzip) | CSS |
|---|---|---|---|
| **React POC** | 155.7 KB | 49.8 KB | 2.85 KB |
| **Vue POC** | 76.8 KB | 29.3 KB | 2.85 KB |

Context — what the app already ships (measured):

- Vendored libs it *needs* for exports: `html2canvas.min.js` 194 KB (45.5 KB gz) + `jspdf.umd.min.js`
  356 KB (113.6 KB gz) = **550 KB raw / 159 KB gz**.
- The framework runtime is **net-new payload on top of the app's own code** — it replaces nothing.
  React adds ~50 KB gz, Vue ~29 KB gz *before* any of the app's actual logic is bundled. Vue is
  roughly half of React's runtime, which matters on an in-store iPad on shop Wi-Fi.
- Against the current model, the framework is not "one more vendored file." A vendored lib is a
  single static file the SW caches; a framework is compiled *into* your hashed bundle and pulls a
  `node_modules` toolchain (31–63 packages) that a solo maintainer now has to keep patched.

**Reading:** if a framework were adopted, **Vue is the lighter choice** by ~20 KB gzipped runtime.
Neither is disqualifying on size alone — but neither buys back its weight on this app.

## 4. Developer experience for *this app's* patterns

| App pattern | Vanilla today | Under a framework |
|---|---|---|
| **Single delegated `click` on `document.body`** dispatching `data-action` | One handler, one hard rule, no per-view wiring; duplicate-listener bugs are structurally prevented | Replaced by hundreds of inline `onClick`/`@click` bindings. The "never add a second listener" invariant becomes moot, but so does the single obvious place to reason about all interactions. |
| **String-concatenation views** injected via `innerHTML` | Trivial to read; no template language | JSX / SFC templates are nicer to write and safer (auto-escaping, no `innerHTML` XSS surface), and this is a genuine ergonomic win |
| **Single global `appState` → localStorage on every `render()`** | One object, one save site, one router `switch` | Maps cleanly to `useState`/`ref` + a persist effect (both POCs do exactly this in ~4 lines). Fine — but the app's global-mutation style (`appState.visFabricKey = key`) is *anti-idiomatic* in React and would need reworking everywhere. |
| **Manual partial updates** (`visApplyFabric` et al.) | Hand-written DOM sync — the real pain point | **Eliminated.** This is the framework's strongest, clearest win on this screen. |
| **Canvas weave engine / SVG garment art** | Direct canvas/DOM calls, no abstraction in the way | Must live behind `useRef` + effects (React) or `onMounted`/template refs (Vue). Works, but the framework is pure overhead here — imperative canvas code fights the declarative model. |

Net: the framework helps most exactly where this screen has hand-rolled reactivity, and helps
least (or hurts) where the app does imperative canvas/SVG/gesture work — of which there is a lot
(coverflow drag, split-drag chalk line, weave tiles, mill-map, tape-measure motion).

## 5. Migration risk

- **Exports (`html2canvas` / `jsPDF`).** Currently vendored globals used through shared helpers
  (`renderElementToCanvas`, `fitCanvasToA4Page` at JPEG q0.92, `canvasesToPDF`). These are
  DOM-snapshot tools — they'd keep working, but every export path reaches into concrete DOM nodes,
  so each would need refs and careful timing against the framework's async render cycle. Medium
  risk, high tedium, and the "PDFs must stay well under ~1 MB" JPEG constraint is easy to regress
  during the rewrite.
- **Weave engine / canvas rendering.** Deterministic seeded canvas tiles and the garment photo
  compositing are imperative and ref-bound. No benefit from a framework; real risk of subtle
  regressions (re-render churn re-triggering expensive canvas paints if effects/deps are wrong).
- **Offline SW.** Must move from hand-listed exact URLs to a generated manifest (see §2). Doable,
  but it trades a file the maintainer fully understands for tool-generated config.
- **GitHub Pages hosting.** Still works — you'd publish `dist/` (via an action or a `docs/` output).
  But deployment goes from "push `master`" to "build, then publish build output." One more moving
  part that can break the store's live kiosk.
- **The whole-app, not one-screen, reality.** `appState` is global and shared by every feature; the
  helpers are global functions. You cannot migrate the Cloth Room alone without either (a) a
  framework runtime coexisting with global vanilla for a long time, or (b) a big-bang rewrite of all
  ~15 modules. Both are high-risk for a solo maintainer with no CI and one Playwright smoke test as
  the entire safety net.

---

## Recommendation: **Stay vanilla.**

For this specific product — a solo-maintained, offline-first, no-backend, single-user-at-a-time
in-store kiosk — the evidence says the migration cost outweighs the benefit:

- The **one** decisive framework win (killing hand-written partial-update DOM sync) applies to the
  handful of `visApply*` functions on essentially one screen. It is real, but it is not worth
  rebuilding the build, deploy, and offline story of the entire app.
- The costs are structural and permanent: you lose zero-build, lose "open `index.html`," take on a
  `node_modules` toolchain a solo owner must maintain, add 29–50 KB gzipped net-new runtime, and
  couple offline caching to a bundler manifest.
- The app's heavy lifting is **imperative** (canvas weave tiles, SVG garment art, drag gestures,
  tape-measure motion, PDF snapshotting). Frameworks add the least value — and the most friction —
  precisely there.

If the founder ever *does* want a framework, **choose Vue over React**: it was leaner in both source
(146 vs 165 lines) and shipped bundle (77 KB vs 156 KB raw / 29 vs 50 KB gz), and its template model
sits closer to the existing HTML-string codebase, making an incremental migration marginally less
alien.

### When would this recommendation change?

Revisit the moment any of these becomes true — each erodes a pillar the vanilla case rests on:

1. **A backend / multi-user / live data.** If the kiosk starts syncing to a server, showing shared
   or real-time inventory, or serving multiple concurrent sessions, the manual-DOM-sync cost
   multiplies across screens and a framework's data-binding starts paying for itself.
2. **Heavy client-side routing / many new stateful screens.** Today there's one `render()` switch and
   mostly read-only content. If the app grows a dozen more Cloth-Room-class interactive screens, the
   `visApply*`-style hand-sync burden scales linearly and a framework amortises.
3. **A team, not a solo maintainer.** The build/tooling overhead is fixed cost; with 2–3 developers
   and CI it's absorbed, and component boundaries + typed props help more than they cost.
4. **A build step arrives for another reason** (TypeScript, a component library, a design system). Once
   you already own a bundler and lose "just open `index.html`," the marginal cost of a framework drops
   sharply — at that point Vue becomes reasonable.

Until then, the vanilla architecture is not technical debt — it is a deliberate, well-fitted choice
for what this app is.

---

### Spike artifacts

- `spike/react/` — React + Vite POC (`npm install && npm run build`; builds clean, 28 modules)
- `spike/vue/` — Vue + Vite POC (`npm install && npm run build`; builds clean, 13 modules)
- `spike/shared/cloths.js` — 24-cloth slice of real `cloth-data.js` (identical shape)
- Nothing here touches the real app; all changes are confined to `spike/`.
