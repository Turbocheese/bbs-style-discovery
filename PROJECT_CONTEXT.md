# project_context.md

## 1. Project Overview

### What this project is
BBS Style Discovery is a browser-based internal knowledge and 
discovery system for Benjamin Barker Studios.

It is a fully operational internal discovery engine with:
- guided discovery flow
- structured menswear and tailoring knowledge architecture
- metadata-backed search and filtering
- ranked explainable discovery results
- Top Picks editorial shortlist behavior
- grouped and collapsible result browsing
- deep keyword search including body text
- combined keyword and filter discovery
- related-topic navigation with context disambiguation
- accessories and shoes taxonomy
- colour and wardrobe-building support
- cloth origin and mill reference support
- image rendering capability (pending photography)
- auto-enrichment for metadata coverage
- full topic_kind classification across all 288 topics

### Core purpose
Help internal users discover, navigate, and explain BBS 
knowledge across:
- tailoring
- shirts
- trousers
- fabrics
- colour and wardrobe logic
- accessories
- shoes
- cloth origins and mills
- brand philosophy

### Target audience
Primary:
- internal BBS staff
- stylists
- sales advisors
- brand and education users

Future:
- customer-facing discovery
- product-linked guidance
- editorial discovery experiences

---

## 2. Tech Stack

### Languages
- HTML
- CSS
- JavaScript (vanilla)

### Project files
- index.html
- styles.css
- data.js
- validator.js
- query.js
- discovery-ui.js
- app.js

### Documentation files
- FOUNDER_HANDOVER.md
- METADATA_GOVERNANCE.md
- SMOKE_TEST_CHECKLIST.md
- PRODUCT_LINKING_SCHEMA.md
- project_context.md

### Frameworks and libraries
- no JS framework
- no build system
- no bundler
- Google Fonts: EB Garamond, Manrope

### Runtime environment
- browser-based static front-end
- no backend dependency
- no database
- hosted on CodeSandbox during development

### Critical script load order
1. data.js
2. validator.js
3. query.js
4. discovery-ui.js
5. inline validation runner
6. app.js

This order is critical and must not change.

---

## 3. Architecture

### Four layers

**1. Content layer (data.js)**
Nested JS object tree.
Two node types: group and topic.
288 topics across six top-level sections.

Topic node structure:
- type
- key
- title
- topic_kind (explicit, not inferred)
- tags
- intro
- metadata
- sections
- image_refs (optional)

Auto-enrichment script at bottom of data.js patches any 
future topics with missing metadata by reading tags.

**2. Validation layer (validator.js)**
Runs on every page load.
Checks:
- required paths exist
- forbidden paths do not exist
- malformed nodes
- missing key, title, type
- group missing children
- topic missing sections
- accidental tabs property
- duplicate tags

Validation is structural not vocabulary-strict.

**3. Query layer (query.js)**
- flatten all topics
- metadata queries
- preset query helpers
- browse all topics (uncapped, 288 topics)
- ranked results
- explainable matching
- keyword search (title, intro, tags, body text)
- combined keyword and filter search
- related-topic scoring
- topic_kind-aware ranking
- result diversification

**4. UI layer (discovery-ui.js, app.js)**

discovery-ui.js handles:
- floating FAB
- slide-out panel
- preset queries with SVG icons
- keyword input with inline search icon
- filter dropdowns with inline SVG icons
- unified search flow
- Top Picks
- grouped results
- result cards with type label, context label, badges, match reason
- getTopicContextLabel() for duplicate disambiguation

app.js handles:
- welcome, home, discover, result, guide views
- discovery questionnaire (no-flash)
- direction scoring
- answer-aware explore-next links
- guide navigation
- topic rendering with editorial layout
- metadata spec strip with SVG icons
- image rendering with graceful fallback
- related topics with context disambiguation
- guide menus with editorial table-of-contents layout

---

## 4. Data State

### Coverage
- 288 topics total
- 0 topics with missing metadata
- 0 topics with missing topic_kind
- 0 suspicious topic_kind classifications
- all topics have formality and versatility scores

### topic_kind values
- garment
- garment_detail
- fabric
- fabric_reference
- wardrobe_strategy
- brand_philosophy
- guide

### Image pipeline
- image_refs field is live in renderTopic()
- CSS renders centered 4:5 portrait with graceful fallback
- naming convention is documented
- images folder structure is ready
- photography is pending

### Auto-enrichment
Runtime function at bottom of data.js.
Reads tags to infer climate, formality, use_cases, 
bbs_signature, versatility, priority, weight.
Does not override explicitly set values.
Acts as safety net for future additions.

---

## 5. Current Product State

### Fully working
- validator passes
- app loads
- questionnaire works without flashing
- result page is editorial and premium
- guide navigation works
- topic pages render with editorial layout and SVG icons
- related topics render with context disambiguation
- discovery panel works with SVG icons
- all preset queries work
- custom filter queries work
- keyword search works including body text
- combined search works
- result cards are trustworthy
- browse all topics returns 288 results
- BBS Signature uses SVG star not emoji
- both audit scripts pass cleanly

### Pipeline
- Photography: architecture ready, assets pending
- Product linking: schema documented, UI ready to build
- Staff testing: recommended as immediate next step
- Customer-facing adaptation: future phase

---

## 6. Intentional Decisions

### Shoes under Accessories
Editorial decision. Do not change.

### Duplicate concepts
Intentional where context differs.
Handled by getTopicContextLabel() in discovery-ui.js.

### No framework
Deliberate. Static, portable, fast, easy to hand off.

### Script load order
Critical. Do not change.

### Auto-enrichment script
Safety net. Do not remove.

### Browse all topics is uncapped
Intentional. Returns all 288 topics.

---

## 7. Audit Health

Run both audit scripts after any bulk edit.

### Metadata audit
Target: 0 missing, 0 missing core fields.

### Topic kind audit
Target: 0 missing, 0 suspicious.
Total topics scanned: 288.

---

## 8. Next Steps

### Immediate
1. Staff testing (2-3 internal users)
2. Photography (drop images into pipeline)

### Near term
3. Product linking (connect topics to SKUs)

### Future
4. Customer-facing adaptation
5. Search synonym expansion
6. Deeper product recommendation logic
