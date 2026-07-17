# \# BBS Style Discovery — Founder Handover

# 

# \## What This Is

# 

# BBS Style Discovery is a browser-based internal knowledge and 

# discovery engine for Benjamin Barker Studios.

# 

# It is not a prototype.  

# It is not a static guide.  

# It is a credible, complete, internal product.

# 

# It currently supports:

# \- guided wardrobe direction discovery

# \- structured editorial guide navigation

# \- metadata-backed search and filtering across 288 topics

# \- ranked, explainable discovery results

# \- Top Picks editorial shortlist behavior

# \- grouped and collapsible result browsing

# \- deep keyword search including body text

# \- combined keyword and filter discovery

# \- related-topic navigation with context disambiguation

# \- accessories and shoes taxonomy

# \- colour and wardrobe-building logic

# \- cloth origin and mill reference coverage

# \- image rendering architecture (pending photography)

# \- full metadata coverage across all 288 topics

# \- clean topic\_kind classification across all 288 topics

# \- premium editorial UI across all screens

# \- full \*\*Style Direction\*\* quiz with branching logic and 24 archetypes

# \- full \*\*Colour Direction\*\* quiz with 8 colour profiles

# \- premium result cards for both style and colour

# \- PDF export for style cards

# \- PDF export for colour cards

# \- PNG sharing to phone via native device share sheet

# \- wardrobe worksheet generation tied to style result

# \- worksheet PDF export

# \- worksheet PNG sharing to phone

# \- local session persistence for iPad / in-store continuity

# \- hidden logo reset for staff between clients

# \- lookbook gallery entry point from home

# \- climate-aware onboarding palette selection

# \- visual palette swatches in onboarding

# \- separate Colour Direction feature architecture

# 

# \---

# 

# \## Strategic Position

# 

# \### What phase we are in

# The product has moved through four distinct phases:

# 

# \*\*Phase 1: Architecture\*\*  

# Building the guide tree, validation layer, query engine, 

# and discovery UI from scratch.  

# Status: Complete.

# 

# \*\*Phase 2: Refinement\*\*  

# UI/UX polish, typography, editorial design, questionnaire 

# improvements, result page upgrade, metadata enrichment, 

# topic\_kind classification, deep search.  

# Status: Complete.

# 

# \*\*Phase 3: Connection\*\*  

# Connecting the knowledge to real assets (photography) and 

# real inventory (product linking).  

# Status: In pipeline. Not yet started.

# 

# \*\*Phase 4: Consultation Engine\*\*  

# Building guided style and colour consultation tools with 

# shareable outputs and in-store utility.  

# Status: In progress, but functionally strong.

# 

# \---

# 

# \## What Was Built and Why

# 

# \### The Guide Tree

# A nested JavaScript object in `data.js` containing 288 topics 

# across six top-level sections:

# \- About BBS

# \- Tailoring

# \- Fabrics

# \- Colour and Wardrobe

# \- Cloth Origins and Mills

# \- Accessories

# 

# Every topic has:

# \- a unique key

# \- a title and intro

# \- tags

# \- an explicit topic\_kind

# \- a full metadata object

# \- body sections

# 

# \### The Validation Layer

# `validator.js` checks the guide tree for structural errors on 

# every page load. It catches malformed nodes, missing fields, 

# duplicate tags, and forbidden paths.

# 

# This exists because as the taxonomy grows, structural errors 

# become hard to spot manually.

# 

# \### The Query Engine

# `query.js` powers all search and discovery.

# 

# Key capabilities:

# \- metadata filtering (climate, formality, use case)

# \- keyword search across title, intro, tags, and body text

# \- ranked results with explainable match reasons

# \- result diversification to prevent clustering

# \- related topic scoring

# \- Top Picks shortlist logic

# \- preset query helpers

# 

# \### The Discovery Panel

# A slide-out panel with:

# \- five preset queries with SVG icons

# \- keyword search with inline search icon

# \- three filter dropdowns with inline SVG icons

# \- unified search flow (keyword, filters, or both)

# \- Top Picks for large result sets

# \- grouped and collapsible results

# \- small result mode for narrow searches

# \- result cards with type label, context label, match reason, badges

# 

# \### The Style Direction Quiz

# A full branching style consultation flow that:

# \- uses id/path-based branching rather than positional arrays

# \- scores across 24 archetypes

# \- supports climate branching

# \- supports garment-draw branching

# \- supports wardrobe-priority branching

# \- writes result-aware copy based on climate, palette, garment lens, and wardrobe logic

# \- renders a premium result card

# \- connects into onboarding preferences

# \- feeds a wardrobe worksheet

# 

# \### The Colour Direction Quiz

# A separate feature, not merged into the style quiz.

# 

# It:

# \- asks 5 lightweight consultation questions

# \- scores into 8 colour direction profiles

# \- uses inclusive skin depth and undertone options

# \- renders premium palette-led results

# \- includes best colours, strong neutrals, accent colours

# \- includes bespoke insights tied to fabric finish, contrast, hardware, pattern, and strategy

# \- supports guide exploration from colour results

# 

# \### The Wardrobe Worksheet

# A post-result wardrobe-building tool tied to the style result.

# 

# It currently supports:

# \- archetype-based wardrobe templates

# \- progress tracking

# \- checklist toggling

# \- worksheet export to PDF

# \- worksheet share to phone as PNG

# \- in-store wardrobe planning utility

# 

# \### The Result Cards

# Both Style Direction and Colour Direction results now support:

# \- premium result presentation

# \- PDF export

# \- native PNG sharing to phone

# \- use in-store as a consultation card

# 

# \### The Topic Pages

# Each topic page renders:

# \- breadcrumb navigation

# \- explicit topic\_kind label

# \- large editorial title

# \- intro text

# \- metadata spec strip with SVG icons

# \- body sections in EB Garamond editorial layout

# \- image block if image\_refs is populated

# \- related topics with context disambiguation

# 

# \### The Guide Menus

# Guide home and group pages use an editorial table-of-contents 

# layout rather than heavy card boxes.

# 

# \---

# 

# \## Key Product Decisions

# 

# \### Shoes under Accessories

# Intentional editorial decision.  

# Garments and cloth are primary.  

# Accessories and footwear complete the outfit.  

# Do not change this.

# 

# \### Duplicate concepts are intentional

# Oxford, Smart Casual, Travel, Wedding, and High-Twist Wool 

# all exist in multiple contexts with different metadata.  

# This is correct.  

# Context disambiguation is handled by `getTopicContextLabel()`.

# 

# \### topic\_kind is a first-class field

# It affects:

# \- result labels

# \- ranking behavior

# \- related topic quality

# \- user trust

# 

# Do not remove or infer it on high-visibility topics.

# 

# \### No framework, no backend, no bundler

# This is a deliberate architecture decision.  

# The product runs as a static browser file.  

# This makes it fast, portable, and easy to hand off.  

# Do not casually suggest migrating to a framework.

# 

# \### Script load order is critical

# Current order:

# 1\. `data.js`

# 2\. `validator.js`

# 3\. `query.js`

# 4\. `discovery-ui.js`

# 5\. `colour-direction.js`

# 6\. `lookbook.js`

# 7\. `wardrobe-templates.js`

# 8\. `html2canvas`

# 9\. `jspdf`

# 10\. `app.js`

# 

# Do not change this order casually.

# 

# \### Style and Colour are intentionally separate

# Colour Direction is not mixed into Style Direction.

# This was a product decision.

# Style and colour are related, but they are not the same consultation.

# 

# \### Native share over QR / URL state

# A QR / URL handoff path was explored and partially built, but it introduced unnecessary complexity and state fragility.

# 

# Current decision:

# \- \*\*Use native device sharing for PNG handoff\*\*

# \- \*\*Use PDF export for archival / print / sending\*\*

# \- \*\*Do not continue QR state-sharing unless there is a strong operational reason\*\*

# 

# This is the correct retail decision for now.

# 

# \### Wardrobe worksheet is a support tool, not a pricing tool

# Pricing was intentionally removed from the worksheet.

# Reason:

# \- bespoke pricing varies by fabric

# \- showing fixed price ranges creates the wrong expectation

# \- the worksheet should guide wardrobe architecture, not act as a quote sheet

# 

# \### The measurement process stays offline

# A “cutter’s docket” / digital tailoring measurement handoff was considered.

# It was intentionally rejected.

# Reason:

# \- measurements and posture notes are still better handled in Goodnotes

# \- that process is personal, tactile, and part of the luxury experience

# \- do not digitise it unless the business model changes

# 

# \---

# 

# \## Data Health

# 

# \### Current state

# \- 288 topics total

# \- 0 topics with missing metadata

# \- 0 topics with missing topic\_kind

# \- 0 suspicious topic\_kind classifications

# \- all topics have formality and versatility scores

# 

# \### Audit scripts

# Two console scripts exist to check data health:

# 

# Metadata audit:

# \- checks for missing metadata objects

# \- checks for missing formality and versatility

# \- target: 0 missing, 0 missing core fields

# 

# Topic kind audit:

# \- checks for missing topic\_kind

# \- checks for invalid values

# \- checks for likely misclassifications by path

# \- target: 0 missing, 0 suspicious

# 

# Run both audits after any bulk edit to `data.js`.

# 

# \---

# 

# \## UI and UX State

# 

# \### What was intentionally upgraded

# \- questionnaire: no-flash option selection

# \- questionnaire: editorial progress pips

# \- questionnaire: warm gradient selected state

# \- result page: luxury editorial layout

# \- result page: answer-aware explore next recommendations

# \- result page: context labels on suggested next cards

# \- topic pages: editorial article layout replacing grey boxes

# \- topic pages: metadata spec strip with SVG icons

# \- topic pages: EB Garamond body text

# \- guide menus: editorial table-of-contents layout

# \- discovery panel: SVG icons on all interactive elements

# \- result cards: type label, context label, match reason, badges

# \- result cards: SVG star badge replacing yellow emoji

# \- home page: compass and book SVG icons on path cards

# \- browse all topics: uncapped, returns all 288 topics

# \- home page expanded into a four-card entry system:

# &#x20; - Style Direction

# &#x20; - Colour Direction

# &#x20; - The BBS Guide

# &#x20; - Editorial Lookbook

# \- command-bar style quick queries on home

# \- onboarding palette swatches with visual circles

# \- Open / Unsure palette represented by wardrobe icons instead of fake colours

# \- hidden staff reset via double-tap logo

# \- export-safe card rendering mode

# \- native share-to-phone flow for PNG delivery

# 

# \### What was intentionally not built yet

# \- photography (architecture ready, assets pending)

# \- product linking / SKUs (schema documented, UI parked)

# \- customer-facing adaptation

# \- search synonyms

# \- backend or database

# \- persistent multi-client archive

# \- QR-based state handoff (explored, not adopted)

# \- full wardrobe worksheet template completeness for every archetype if not yet finished in final code state

# \- worksheet pricing / quote logic

# 

# \---

# 

# \## File Reference

# 

# \### Core files

# \- `index.html`: app shell, discovery panel HTML, modal shells, script tags

# \- `styles.css`: all visual styling

# \- `data.js`: guide tree, discovery steps, auto-enrichment script

# \- `validator.js`: structural validation

# \- `query.js`: search, ranking, related topics

# \- `discovery-ui.js`: panel rendering, result cards, context labels

# \- `colour-direction.js`: colour quiz logic, colour profiles, scoring

# \- `lookbook.js`: editorial lookbook rendering

# \- `wardrobe-templates.js`: worksheet templates and wardrobe logic

# \- `app.js`: views, style quiz, colour quiz, onboarding, results, worksheet, guide navigation, exports, sharing

# 

# \### Documentation files

# \- `FOUNDER\_HANDOVER.md`: this document

# \- `PROJECT\_CONTEXT.md`: full technical and product context

# \- `METADATA\_GOVERNANCE.md`: data standards and vocabulary

# \- `SMOKE\_TEST\_CHECKLIST.md`: QA checklist with audit scripts

# \- `PRODUCT\_LINKING\_SCHEMA.md`: future product linking architecture

# 

# \---

# 

# \## What Needs to Happen Next

# 

# \### Immediate priority: Code cleanup and stabilization

# Before building more features, the current `app.js` needs to be kept clean.

# 

# The biggest current risk is:

# \- duplicated functions

# \- half-removed experiments

# \- export logic fragmentation

# \- multiple versions of the same helper left in the file

# 

# Rule:

# \- when reverting a feature, remove all old copies fully

# \- do not leave “temporary” duplicate implementations in place

# \- keep one source of truth per function

# 

# \### Second priority: Staff Testing

# Put this in front of 2–3 internal staff members.  

# Watch them use:

# \- the discovery panel

# \- the style quiz

# \- the colour quiz

# \- the worksheet

# \- the export / share flows

# 

# You will learn more from 15 minutes of observation than from 

# weeks of further building without user input.

# 

# Do this before building anything major.

# 

# \### Third priority: Photography

# The image architecture is fully built and waiting.  

# The naming convention is documented.  

# The folder structure is ready.  

# When you have sartorial photography, drop the files in and 

# add `image\_refs` lines to the relevant topics.

# 

# \### Fourth priority: Product Linking

# When staff testing confirms the tool is useful and photography 

# gives it visual grounding, connect the knowledge to inventory.  

# The schema is documented in `PRODUCT\_LINKING\_SCHEMA.md`.  

# The UI can be built in a single focused session.

# 

# \### Future consideration: Customer-facing adaptation

# The architecture supports a customer-facing version but it 

# would require:

# \- simplified language

# \- reduced editorial complexity

# \- connection to live product data

# \- user session handling

# 

# Do not start this until the internal version is validated.

# 

# \---

# 

# \## Recommended Governance Cadence

# 

# \### After any meaningful edit

# \- run metadata audit

# \- run topic kind audit

# \- run smoke test checklist

# 

# \### Before any staff demo

# \- run both audit scripts

# \- confirm Browse All Topics returns 288 results

# \- confirm BBS Signature Pieces returns relevant results

# \- confirm at least one keyword search works correctly

# \- confirm style result export works

# \- confirm colour result export works

# \- confirm native PNG sharing works on device

# \- confirm worksheet export works

# 

# \### Before adding new topics

# \- confirm topic\_kind is explicit

# \- confirm metadata uses approved vocabulary

# \- confirm versatility is set conservatively

# \- confirm bbs\_signature is set selectively

# \- run both audit scripts after adding

# 

# \---

# 

# \## Known Product Lessons So Far

# 

# \### 1. Separate features cleanly

# Colour Direction worked better once it was split into its own file and flow.

# 

# \### 2. Branching quizzes must use IDs, not positions

# The old positional scoring bug created misleading debugging trails.

# The current id/path architecture is the correct foundation.

# 

# \### 3. Duplicate click handlers are dangerous

# This caused major false debugging trails earlier.

# There must only ever be one main click handler.

# 

# \### 4. Native sharing is better than clever sharing

# QR / URL state-sharing sounded elegant but created unnecessary fragility.

# Native PNG sharing is simpler and more premium in-store.

# 

# \### 5. Don’t over-digitise the luxury ritual

# The tailoring measurement / cutter note process is better left in Goodnotes.

# Not everything should be turned into software.

# 

# \### 6. Do not let `app.js` become a dumping ground

# The product is now rich enough that code discipline matters.

# If a feature is conceptually separate, it should live in its own file.

# 

# \---

# 

# \## Founder Position

# 

# This product started as a static guide tree.

# 

# It is now a credible internal knowledge engine and consultation tool with:

# \- a validated content architecture

# \- operational metadata coverage

# \- a clean ranked query engine

# \- explainable discovery results

# \- a premium editorial interface

# \- accessories, shoes, colour, fabric, and mill coverage

# \- deep search across 288 fully enriched topics

# \- a complete image and product linking architecture ready to activate

# \- a branching 24-archetype style consultation

# \- a separate 8-profile colour consultation

# \- premium result cards

# \- worksheet planning utility

# \- PDF export

# \- PNG phone sharing

# \- lookbook integration

# \- iPad-ready in-store behavior

# 

# The main risk now is not architecture.  

# The main risk is building more without validating what exists, 

# and letting code duplication accumulate.

# 

# The highest-leverage next move is:

# 1\. clean the codebase

# 2\. test with staff

# 3\. only then decide what to expand

# 

# Everything else can wait.




---

# ADDENDUM — 17–18 July 2026

(This addendum is plain markdown; the historical text above it was damaged by
an earlier paste — every line carries a stray "# " prefix — but is preserved
as-is for its content. For current technical truth, CLAUDE.md and
PROJECT_CONTEXT.md are authoritative.)

## Product reframing

The quizzes are officially a fun, wow-factor experience for customers, NOT a
consultation. All UI copy now reflects this ("Take the style quiz",
"Begin the Discovery", "Taking your measurements…"). Service language is out.

## What changed since the last handover

**Design**
- Brand-exact tokens pulled from benjaminbarkerstudios.com's live theme:
  ink #111110, cream #eae5dd, taupe #a4a19c, bronze #9a7b4f micro-labels.
- New signature element: the tape measure. Quiz progress is a numbered tape
  blade, the worksheet progress bar shares the language, and loading
  interstitials ("measure moments") animate the tape unrolling.
- Colour result: palette renders as a seamless ribbon (a circular-swatch
  rule had distorted it), serif page headlines, Strong Neutrals de-duplicated
  against Best On You, touch-press swatch expansion.
- Welcome page decluttered; British-spelling pass across user-facing copy.
- A recurring cascade bug family was exterminated: a blanket
  button-transparency reset had silently hidden the FAB fill, onboarding
  selections, and the panel Search button at various times.

**Kiosk behaviour**
- Idle attract-reset: 3 minutes untouched wipes the session and returns to
  welcome. The staff double-tap-logo reset remains.
- Touch-first pass: 44px targets, press states, no iOS focus-zoom.

**Infrastructure**
- Fully offline: fonts self-hosted, html2canvas + jsPDF vendored, service
  worker (sw.js) precaches everything. Deploy note: bump CACHE_VERSION and
  the ?v= entries in sw.js with every release.
- Hosted on GitHub Pages: https://turbocheese.github.io/bbs-style-discovery/
  (HTTPS, offline verified live). Add to Home Screen on the iPad for
  standalone full-screen mode.
- PDF exports shrunk ~100x (JPEG instead of PNG): the Client Dossier went
  from 93MB to under 1MB, now actually shareable.
- New: Client Dossier multi-page PDF export; the Cloth Room (live fabric
  visualiser); export buttons show a "Preparing…" busy state.

**Verification (new discipline)**
- `node verify/smoke.js` — automated full-app smoke (Playwright). Caught a
  dead lookbook image hotlink and a sitewide favicon 404 on its first runs.
- `node verify/audit.js` — data health. The "console audit scripts" the old
  docs referenced never existed in the repo; this replaces them.

## Two honest corrections to the old record

1. **The auto-enrichment script does not exist.** The old docs describe a
   metadata-inference safety net at the bottom of data.js. It is not in the
   committed code and apparently never was. Write explicit metadata.
2. **topic_kind coverage was never 100%.** The audited truth: 181 of 288
   topics have an explicit topic_kind; 107 (mostly tailoring sub-trees) have
   none. The app renders fine via fallbacks. Backfill when convenient using
   METADATA_GOVERNANCE.md's assignment rules; never let the count grow.

## Still blocked on business inputs

1. Staff testing (highest leverage, zero code).
2. Photography (unlocks the lookbook — currently two placeholder photos, one
   dead hotlink already removed — plus Cloth Room real renders, topic images).
3. Product linking (schema ready in PRODUCT_LINKING_SCHEMA.md; needs
   confirmed SKUs and photography).
