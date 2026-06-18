# BBS Style Discovery — Founder Handover

## What This Is

BBS Style Discovery is a browser-based internal knowledge and 
discovery engine for Benjamin Barker Studios.

It is not a prototype.
It is not a static guide.
It is a credible, complete, internal product.

It currently supports:
- guided wardrobe direction discovery
- structured editorial guide navigation
- metadata-backed search and filtering across 288 topics
- ranked, explainable discovery results
- Top Picks editorial shortlist behavior
- grouped and collapsible result browsing
- deep keyword search including body text
- combined keyword and filter discovery
- related-topic navigation with context disambiguation
- accessories and shoes taxonomy
- colour and wardrobe-building logic
- cloth origin and mill reference coverage
- image rendering architecture (pending photography)
- full metadata coverage across all 288 topics
- clean topic_kind classification across all 288 topics
- premium editorial UI across all screens

---

## Strategic Position

### What phase we are in
The product has moved through three distinct phases:

**Phase 1: Architecture**
Building the guide tree, validation layer, query engine, 
and discovery UI from scratch.
Status: Complete.

**Phase 2: Refinement**
UI/UX polish, typography, editorial design, questionnaire 
improvements, result page upgrade, metadata enrichment, 
topic_kind classification, deep search.
Status: Complete.

**Phase 3: Connection**
Connecting the knowledge to real assets (photography) and 
real inventory (product linking).
Status: In pipeline. Not yet started.

---

## What Was Built and Why

### The Guide Tree
A nested JavaScript object in `data.js` containing 288 topics 
across six top-level sections:
- About BBS
- Tailoring
- Fabrics
- Colour and Wardrobe
- Cloth Origins and Mills
- Accessories

Every topic has:
- a unique key
- a title and intro
- tags
- an explicit topic_kind
- a full metadata object
- body sections

### The Validation Layer
`validator.js` checks the guide tree for structural errors on 
every page load. It catches malformed nodes, missing fields, 
duplicate tags, and forbidden paths.

This exists because as the taxonomy grows, structural errors 
become hard to spot manually.

### The Query Engine
`query.js` powers all search and discovery.

Key capabilities:
- metadata filtering (climate, formality, use case)
- keyword search across title, intro, tags, and body text
- ranked results with explainable match reasons
- result diversification to prevent clustering
- related topic scoring
- Top Picks shortlist logic
- preset query helpers

### The Discovery Panel
A slide-out panel with:
- five preset queries with SVG icons
- keyword search with inline search icon
- three filter dropdowns with inline SVG icons
- unified search flow (keyword, filters, or both)
- Top Picks for large result sets
- grouped and collapsible results
- small result mode for narrow searches
- result cards with type label, context label, match reason, badges

### The Questionnaire
A five-step guided discovery flow that:
- scores answers into five direction profiles
- surfaces a primary and secondary direction
- generates answer-aware Explore Next recommendations
- renders a luxury editorial result page
- never flashes on option selection

### The Topic Pages
Each topic page renders:
- breadcrumb navigation
- explicit topic_kind label
- large editorial title
- intro text
- metadata spec strip with SVG icons
- body sections in EB Garamond editorial layout
- image block if image_refs is populated
- related topics with context disambiguation

### The Guide Menus
Guide home and group pages use an editorial table-of-contents 
layout rather than heavy card boxes.

---

## Key Product Decisions

### Shoes under Accessories
Intentional editorial decision.
Garments and cloth are primary.
Accessories and footwear complete the outfit.
Do not change this.

### Duplicate concepts are intentional
Oxford, Smart Casual, Travel, Wedding, and High-Twist Wool 
all exist in multiple contexts with different metadata.
This is correct.
Context disambiguation is handled by getTopicContextLabel().

### topic_kind is a first-class field
It affects:
- result labels
- ranking behavior
- related topic quality
- user trust
Do not remove or infer it on high-visibility topics.

### No framework, no backend, no bundler
This is a deliberate architecture decision.
The product runs as a static browser file.
This makes it fast, portable, and easy to hand off.
Do not casually suggest migrating to a framework.

### Script load order is critical
1. data.js
2. validator.js
3. query.js
4. discovery-ui.js
5. inline validation runner
6. app.js
Do not change this order.

### Metadata enrichment script
A runtime function at the bottom of data.js patches any 
topics with missing metadata by reading their tags.
It acts as a safety net.
It does not override explicitly set values.
Do not remove it.

---

## Data Health

### Current state
- 288 topics total
- 0 topics with missing metadata
- 0 topics with missing topic_kind
- 0 suspicious topic_kind classifications
- All topics have formality and versatility scores

### Audit scripts
Two console scripts exist to check data health:

Metadata audit:
- checks for missing metadata objects
- checks for missing formality and versatility
- target: 0 missing, 0 missing core fields

Topic kind audit:
- checks for missing topic_kind
- checks for invalid values
- checks for likely misclassifications by path
- target: 0 missing, 0 suspicious

Run both audits after any bulk edit to data.js.

---

## UI and UX State

### What was intentionally upgraded
- questionnaire: no-flash option selection
- questionnaire: editorial progress pips
- questionnaire: warm gradient selected state
- result page: luxury editorial layout
- result page: answer-aware explore next recommendations
- result page: context labels on suggested next cards
- topic pages: editorial article layout replacing grey boxes
- topic pages: metadata spec strip with SVG icons
- topic pages: EB Garamond body text
- guide menus: editorial table-of-contents layout
- discovery panel: SVG icons on all interactive elements
- result cards: type label, context label, match reason, badges
- result cards: SVG star badge replacing yellow emoji
- home page: compass and book SVG icons on path cards
- browse all topics: uncapped, returns all 288 topics

### What was intentionally not built yet
- photography (architecture ready, assets pending)
- product linking / SKUs (schema documented, UI parked)
- customer-facing adaptation
- search synonyms
- backend or database

---

## File Reference

### Core files
- index.html: app shell, discovery panel HTML, script tags
- styles.css: all visual styling
- data.js: guide tree, discovery steps, auto-enrichment script
- validator.js: structural validation
- query.js: search, ranking, related topics
- discovery-ui.js: panel rendering, result cards, context labels
- app.js: views, questionnaire, guide navigation, topic rendering

### Documentation files
- FOUNDER_HANDOVER.md: this document
- PROJECT_CONTEXT.md: full technical and product context
- METADATA_GOVERNANCE.md: data standards and vocabulary
- SMOKE_TEST_CHECKLIST.md: QA checklist with audit scripts
- PRODUCT_LINKING_SCHEMA.md: future product linking architecture

---

## What Needs to Happen Next

### Immediate priority: Staff Testing
Put this in front of 2-3 internal staff members.
Watch them use the discovery panel.
Watch them take the questionnaire.
Watch them navigate the guide.

You will learn more from 15 minutes of observation than from 
weeks of further building without user input.

Do this before building anything new.

### Second priority: Photography
The image architecture is fully built and waiting.
The naming convention is documented.
The folder structure is ready.
When you have sartorial photography, drop the files in and 
add image_refs lines to the relevant topics.
Start with the Phase 1 priority shot list in FOUNDER_HANDOVER.md.

### Third priority: Product Linking
When staff testing confirms the tool is useful and photography 
gives it visual grounding, connect the knowledge to inventory.
The schema is documented in PRODUCT_LINKING_SCHEMA.md.
The UI can be built in a single focused session.

### Future consideration: Customer-facing adaptation
The architecture supports a customer-facing version but it 
would require:
- simplified language
- reduced editorial complexity
- connection to live product data
- user session handling
Do not start this until the internal version is validated.

---

## Recommended Governance Cadence

### After any meaningful edit
- run metadata audit
- run topic kind audit
- run smoke test checklist

### Before any staff demo
- run both audit scripts
- confirm Browse All Topics returns 288 results
- confirm BBS Signature Pieces returns relevant results
- confirm at least one keyword search works correctly

### Before adding new topics
- confirm topic_kind is explicit
- confirm metadata uses approved vocabulary
- confirm versatility is set conservatively
- confirm bbs_signature is set selectively
- run both audit scripts after adding

---

## Founder Position

This product started as a static guide tree.

It is now a credible internal knowledge engine with:
- a validated content architecture
- operational metadata coverage
- a clean ranked query engine
- explainable discovery results
- a premium editorial interface
- accessories, shoes, colour, fabric, and mill coverage
- deep search across 288 fully enriched topics
- a complete image and product linking architecture ready to activate

The main risk now is not architecture.
The main risk is building more without validating what exists.

The highest-leverage next move is putting this in front of staff.

Everything else can wait.
