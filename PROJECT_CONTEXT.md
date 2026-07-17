# project_context.md

Last updated: 18 July 2026. Earlier versions of this file predate the colour
quiz, the Cloth Room, offline support, and the July 2026 design pass — if
anything here disagrees with CLAUDE.md, CLAUDE.md wins.

## 1. Project Overview

### What this project is
BBS Style Discovery is a browser-based discovery and experience app for
Benjamin Barker Studios, run in-store on iPads.

It is a fully operational product with:
- a Style Direction quiz (7 branching questions + onboarding, 24 archetypes)
- a Colour Direction quiz (5 questions, 8 colour profiles)
- premium result cards for both, with PDF export and native PNG sharing
- a Client Dossier multi-page PDF export
- a wardrobe worksheet tied to the style result (checklist, progress, exports)
- a structured menswear guide: 288 topics across six sections
- metadata-backed search, filtering, and ranked explainable discovery
- the Cloth Room: an SVG garment re-rendered live in tap-selected cloths
- an editorial lookbook (placeholder imagery, pending photography)
- full offline operation via a service worker, with all dependencies vendored
- kiosk behaviours: idle attract-reset, staff double-tap-logo reset,
  session persistence for iPad continuity

### Product framing (important)
The quizzes are a fun, memorable experience for customers — **not a
consultation**. Copy and future features should feel playful and premium
("Taking your measurements…", "Take the style quiz"), never clinical.

### Target audience
Primary: customers in-store (guided by staff), and internal BBS staff.
Future: product linking to real inventory, customer-facing adaptation.

## 2. Tech Stack

- Vanilla HTML/CSS/JavaScript (ES5 style). No framework, no bundler, no backend.
- All dependencies vendored: html2canvas + jsPDF in `vendor/`, EB Garamond +
  Manrope variable fonts (latin subset) in `fonts/`. No CDN at runtime.
- `sw.js` service worker: precaches everything, network-first for the shell,
  cache-first for assets. The app works fully offline.
- Hosted on **GitHub Pages**: https://turbocheese.github.io/bbs-style-discovery/
  (serves `master`, HTTPS enforced — required for the service worker and
  Add-to-Home-Screen standalone mode).
- Automated smoke test: `verify/smoke.js` (Playwright; see file header).

### Project files
- `index.html` — app shell, discovery panel HTML, script tags, SW registration
- `styles.css` — all styling (layered override structure; see CLAUDE.md)
- `data.js` — 288-topic guide tree
- `validator.js` — structural validation, runs on every load
- `query.js` — search/ranking engine
- `discovery-ui.js` — discovery panel + result cards
- `colour-direction.js` — colour quiz data/scoring
- `lookbook.js` — lookbook rendering
- `wardrobe-templates.js` — worksheet templates per archetype
- `fabric-visualiser.js` — the Cloth Room
- `app.js` — views, quizzes, worksheet, exports, navigation, kiosk behaviours
- `sw.js` — service worker (bump CACHE_VERSION on every deploy that changes cached files)
- `verify/smoke.js` — automated smoke harness

### Critical script load order
data.js → validator.js → query.js → discovery-ui.js → colour-direction.js →
lookbook.js → wardrobe-templates.js → fabric-visualiser.js →
vendor/html2canvas.min.js → vendor/jspdf.umd.min.js → app.js → inline
validation runner + SW registration. This order is critical and must not change.

## 3. Architecture

Four layers:

**1. Content layer (data.js)** — nested JS object tree, two node types
(group/topic), 288 topics across six top-level sections (About BBS, Tailoring,
Fabrics, Colour and Wardrobe, Cloth Origins and Mills, Accessories). Every
topic has explicit `topic_kind`, tags, intro, metadata, sections.
Note: the "auto-enrichment script at the bottom of data.js" described in older
docs does not exist in the committed code — write explicit metadata.

**2. Validation layer (validator.js)** — structural checks on every page load
(missing key/title/type, the tabs-vs-tags typo, forbidden/required paths).

**3. Query layer (query.js)** — flatten, metadata queries, preset queries,
keyword search including body text, combined search, ranked explainable
results, related-topic scoring, Top Picks, result diversification.

**4. UI layer (discovery-ui.js + app.js + feature files)** — discovery panel,
result cards with context disambiguation (`getTopicContextLabel()`), the view
router (`render()` switch on `appState.view`), both quizzes, worksheet,
exports (shared helpers: `renderElementToCanvas`, `fitCanvasToA4Page` —
JPEG q0.92, `canvasToPDF`, `canvasesToPDF`, `shareCanvasAsPNG`), the
measure-moment loading interstitial, and kiosk behaviours.

## 4. Design language (July 2026)

- Brand-exact tokens from benjaminbarkerstudios.com: ink `#111110`, cream
  `#eae5dd`, taupe `#a4a19c`, white surfaces, bronze `#9a7b4f` micro-labels.
- Type: EB Garamond (display/serif voice) + Manrope (UI), self-hosted.
- Signature element: the **tape measure**. Quiz progress renders as a numbered
  tape blade; the worksheet progress bar shares the ticked-track language; the
  loading interstitial ("measure moment") animates the tape unrolling and
  rolling back.
- Touch-first: 44px targets, `:active` press states, no hover-only affordances,
  16px+ inputs (prevents iOS focus zoom), reduced-motion respected everywhere.
- British English copy. Em-dashes are house style in editorial content only,
  not UI chrome.

## 5. Data State

- 288 topics; 0 missing metadata objects; 0 missing core fields (audited
  18 July 2026 via `node verify/audit.js`).
- **topic_kind: 181 of 288 topics have it explicitly; 107 (mostly tailoring
  sub-trees) do not.** Earlier claims of full coverage were never true of the
  committed code — rendering falls back gracefully, but backfill these per
  METADATA_GOVERNANCE.md when touching those topics.
- topic_kind values: garment, garment_detail, fabric, fabric_reference,
  wardrobe_strategy, brand_philosophy, guide.
- Image pipeline: `image_refs` renders with graceful fallback; photography pending.
- Product linking: schema documented (PRODUCT_LINKING_SCHEMA.md), not populated,
  UI not built — parked pending photography/staff testing/confirmed SKUs.

## 6. Intentional Decisions

- Shoes under Accessories. Do not change.
- Duplicate concepts across contexts are intentional (context labels disambiguate).
- No framework/bundler/backend. Deliberate; portable and offline-capable.
- Script load order is critical.
- Style and Colour quizzes stay separate.
- Quiz advance is tap-answer → tap-Next; no auto-advance.
- Native PNG share + PDF export; QR state-sharing rejected.
- No pricing in the worksheet; measurements stay offline (Goodnotes).
- Browse All Topics is uncapped (288 results).
- One delegated click handler; idle-reset listeners use pointerdown/keydown/scroll.

## 7. Verification

- `node verify/smoke.js` after any meaningful change (see CLAUDE.md definition
  of done). It is the only automated safety net.
- The two console audit scripts in SMOKE_TEST_CHECKLIST.md after any data.js edit.
- Full SMOKE_TEST_CHECKLIST.md before staff demos.

## 8. Next Steps

Blocked on founder/business inputs:
1. Staff testing (2–3 internal users) — highest leverage, zero code.
2. Photography — unlocks lookbook, Cloth Room real renders, topic images.
3. Product linking — schema ready; needs confirmed SKUs + photography.

Available anytime:
4. styles.css consolidation (~80 selectors still have layered duplicate
   definitions from past redesign generations; smoke harness makes this safe).
5. Customer-facing adaptation (only after internal validation).
