# BBS Style Discovery — Smoke Test Checklist

## Purpose

Run this checklist before staff demos and after large changes.

Fast founder-grade confidence check. Not a full QA plan.

---

## 0. Automated checks (run these FIRST)

Most of this checklist is now covered automatically:

```
npx serve .                     # terminal 1 (port 3000)
npm i --no-save playwright      # once per machine
node verify/smoke.js            # terminal 2 — full app smoke, must print ALL GREEN
node verify/audit.js            # data health (metadata + topic_kind)
```

`verify/smoke.js` drives the real app headless: load + validator, all menu
entries, both quizzes to result, worksheet, dossier export, offline boot via
the service worker, and fails on any console error or 4xx/5xx response.

`verify/audit.js` replaces the "console audit scripts" older versions of this
document referenced (they were never committed). Known pre-existing gap: 107
topics lack an explicit topic_kind — the audit reports it; do not add new gaps.

The manual sections below remain useful for eyes-on QA of visual quality,
touch feel, and export appearance on a real iPad.

---

## 1. Load and Validation

- app loads successfully
- no blank screen
- no console errors
- validator passes
- `node verify/audit.js` passes metadata checks (0 missing, 0 missing core fields)
- topic_kind gap not grown (known baseline: 107 topics without explicit topic_kind)

---

## 2. Welcome and Home Flow

- page loads into welcome correctly
- entering name works
- continue button works
- home screen renders correctly
- "Take the style quiz" card works (shows measure moment, then quiz)
- "The BBS Guide" card works (shows measure moment, then guide)
- Not [Name]? button works if name is set
- no Start Over button visible on home

---

## 3. Discovery Questionnaire

- each step renders cleanly
- selecting an option does NOT cause a full-page flash
- continue button enables correctly after selection
- text step accepts input
- tape-measure progress fills correctly per step
- back button works
- home button works
- result page renders after final step

---

## 4. Result Page

- primary direction renders
- Why this fits block renders
- two-column summary grid renders
- Colour Direction renders
- Cloth and Texture renders
- What Would Suit You Best renders
- Secondary Tendency renders if applicable
- Explore Next cards render
- Explore Next cards show context labels
- Explore Next cards show why-suggested reason
- Enter the BBS Guide button works

---

## 5. Guide Navigation

- guide home renders with editorial list layout
- all top-level sections render:
  - About BBS
  - Tailoring
  - Fabrics
  - Colour and Wardrobe
  - Cloth Origins and Mills
  - Accessories
- group pages render with item counts
- breadcrumbs render correctly
- child navigation works
- back button works
- home button works

---

## 6. Topic Pages

Test these specific topics:

**Core garments**
- Soft Odd Jacket
- Teba
- Long Sleeve
- Short Sleeve

**Core fabrics**
- Fresco
- High-Twist Wool
- Hopsack
- Oxford (shirting)
- Linen Shirting

**Wardrobe strategy**
- Smart Casual (jacket use case)
- Building a Wardrobe
- Warm-Weather Palette
- Core Wardrobe Anchors
- Layering in Warm Climates

**Accessories and shoes**
- Penny Loafer
- Suede Loafer
- When to Wear Loafers
- When to Skip the Belt
- Suede Belt

**Brand philosophy**
- Tropical Tailoring
- What BBS Is
- Soft Structure and Cloth-Led Dressing

**Cloth references**
- Solbiati
- VBC
- Holland and Sherry

On each topic page confirm:
- breadcrumb renders correctly
- topic_kind label is correct
- title renders
- intro renders
- metadata spec strip renders with SVG icons
- climate label and icon render
- formality label and icon render
- versatility label and icon render
- BBS Signature label and SVG star render if applicable
- no yellow emoji star visible
- all text sections render cleanly
- section headings use small caps kicker style
- section body text uses EB Garamond
- related topics block renders
- related topics show type label
- related topics show context label for disambiguation
- related topics are clickable
- back button works
- home button works

---

## 7. Discovery Panel

- FAB opens panel smoothly
- FAB entrance animation plays on load
- close button closes panel
- panel slides in and out cleanly
- panel retains state while open
- panel closes when a result is clicked

**Preset buttons**
- all five preset buttons have SVG icons
- BBS Signature Pieces icon renders
- High Versatility icon renders
- Tropical Work icon renders
- Build a First Suit icon renders
- Browse All Topics icon renders
- active preset button highlights correctly
- clicking a different preset clears the previous active state

**Keyword search**
- search icon renders inside the input
- typing works
- Enter key triggers search
- keyword persists in input after search

**Filter controls**
- Climate filter label has thermometer icon
- Formality filter label has diamond icon
- Use Case filter label has map pin icon
- all dropdowns work
- filters persist after search

**Search button**
- Search button triggers combined query
- clearing filters and keyword resets results

**Toolbar**
- Clear results button works
- clearing resets the panel to empty state

---

## 8. Preset Query Tests

### BBS Signature Pieces
- returns results
- active preset button highlights
- BBS Signature badges appear on relevant cards
- no yellow emoji star visible anywhere in results
- result cards show SVG star badge

### High Versatility
- returns results
- broadly useful topics surface
- Versatility 5/5 badges appear

### Tropical Work
- returns results
- climate and work relevant topics appear
- Top Picks feel relevant to tropical work context

### Build First Suit
- returns results
- foundational suiting topics appear
- BBS Signature topics surface prominently

### Browse All Topics
- returns all 288 topics
- NOT capped at 20
- grouped sections all render
- expand all works
- collapse all works

---

## 9. Search Quality Tests

### Filter only: Tropical + Formal
- returns 70 or more results
- Top Picks appear
- grouped sections appear and are collapsed by default
- Expand All works
- Collapse All works
- result count label is correct
- current query label reads correctly

### Filter only: Tropical + Casual
- returns broad result set
- wardrobe strategy topics appear prominently
- soft jackets, linen, and smart casual topics surface

### Filter only: Warm Climate + Smart Casual
- jackets, shirts, loafers, and wardrobe topics appear

### Filter only: Temperate + Formal
- more formal cloths and dress shoes surface
- tropical-first topics do not dominate

### Keyword only: linen
- returns 18 or more results
- linen fabrics and garments surface
- match reason says Matches keyword in title or tags

### Keyword only: flax
- returns linen-related topics
- match reason says Matches keyword in body text
- confirms deep search is working

### Keyword only: loafer
- small result mode activates
- no Top Picks section
- no grouped sections
- flat list only
- match reason is specific

### Combined: loafer + tropical + smart casual
- results are narrow and relevant
- keyword remains in input after search
- filters remain selected after search
- query label is readable

### Combined: wedding + formal + temperate
- wedding and occasion topics surface
- result quality is believable

---

## 10. Result Card Quality

On multiple query outputs confirm for each card:

- type label is correct
  - Garment for garment topics
  - Fabric for fabric topics
  - Wardrobe Strategy for wardrobe topics
  - Brand Philosophy for about section topics
  - Fabric Reference for cloth origin topics
  - Garment Detail for construction and detail topics
- context label appears for duplicate-prone topics
  - Oxford shows Shirt Fabric or Dress Shoe depending on context
  - Smart Casual shows Jacket Use Case or Shirt Use Case
  - Travel shows Suit Use Case or Jacket Use Case
  - Wedding shows Suit Use Case or Jacket Use Case
- path breadcrumb renders with correct separators
- intro text renders
- match reason is believable and specific
- BBS Signature shows as SVG star with text not emoji
- versatility badge renders correctly
- card is clickable and navigates to correct topic

---

## 11. Top Picks Quality

For larger result sets (Tropical + Formal, Tropical + Casual):

- Top Picks section appears above grouped results
- heading reads Recommended Starting Points
- 8 or fewer picks
- picks feel editorially useful
- picks do not feel random
- no duplicate titles in Top Picks
- picks include a mix of types (garment, fabric, wardrobe strategy)
- results section divider appears between Top Picks and grouped results
- Expand All and Collapse All controls appear

---

## 12. Small Result Mode

For a small keyword search such as loafer:

- no Top Picks section
- no grouped sections
- no Expand All or Collapse All controls
- flat result list only
- result count label appears
- query label appears
- UI feels simpler than large result mode

---

## 13. Related Topics Quality

On topic pages test:

- Soft Odd Jacket
- Oxford (shirting)
- Penny Loafer
- Warm-Weather Palette
- High-Twist Wool
- Building a Wardrobe

On each confirm:
- 3 related topics render
- links work and navigate correctly
- results are plausible and contextually relevant
- current topic is not shown as its own related topic
- type label appears on each related card
- context label appears where relevant
- no broken paths

---

## 14. Duplicate Concept Check

Search for or navigate to these known duplicate concepts:

- Oxford (search keyword)
  - should surface both shirt fabric and dress shoe
  - context labels distinguish them
- Smart Casual (search keyword)
  - should surface jacket, shirt, and wardrobe strategy versions
  - context labels distinguish them
- Travel (search keyword)
  - should surface suit, jacket, and wardrobe versions
- Wedding (search keyword)
  - should surface suit, jacket, and vest versions
- High-Twist Wool (search keyword)
  - should surface both the suits section version and the fabrics section version

Confirm:
- duplicates coexist without confusion
- context labels make the distinction clear
- paths support disambiguation
- duplicates do not look accidental

---

## 15. Accessories and Shoes Taxonomy

Navigate through:
- Accessories
- Shoes
- Loafers
  - Penny Loafer
  - Suede Loafer
  - Belgian Loafer
  - Tassel Loafer
  - Horsebit Loafer
  - Loafers Without Socks
  - When to Wear Loafers
- Dress Shoes
  - Oxford
  - Derby
  - Brogue
  - Cap-Toe
  - Plain-Toe
  - Black vs Brown Shoes
  - When to Wear Dress Shoes
- Boots
  - Chelsea Boot
  - Chukka Boot
  - Suede Boots
  - Leather Boots
  - When to Wear Boots
- Sneakers
  - Minimal Leather Sneaker
  - White Sneaker
  - When to Wear Sneakers
- Ties
- Pocket Squares
- Belts
  - Suede Belt
  - When to Skip the Belt
- Formal Accessories
- Trouser Accessories

Confirm:
- shoes remain correctly nested under accessories
- all group pages render
- all topic pages render
- breadcrumbs are correct throughout
- no broken paths

---

## 16. Colour and Wardrobe

Navigate through:
- Colour and Wardrobe
- Core Colours
  - Navy
  - Stone and Beige
  - Sand
  - Soft Blue
  - Brown
  - Tan and Camel
  - Olive and Khaki
  - Cream and Off-White
  - Charcoal
  - Tobacco
- Warm-Weather Palette
- Core Wardrobe Anchors
- Building a Wardrobe
- Texture vs Colour
- Layering in Warm Climates
- Why Black Is Not Always the Answer
- Grey and Occasion Dressing
- Light Colours and Translucency

Confirm:
- all topics render
- colour topics show as Wardrobe Strategy not Garment
- metadata strip renders correctly
- related topics are relevant

---

## 17. Cloth Origins and Mills

Navigate through:
- Cloth Origins and Mills
- Suiting
  - English
    - Standeven
    - Fox
    - Harrisons
    - Alfred Brown
    - Huddersfield
    - Holland and Sherry
  - Italian
    - VBC
    - Piacenza
    - Loro Piana
    - Solbiati
    - Drago
    - Reda
  - French
    - Dormeuil
- Shirtings
  - Italian
    - Albini
    - Thomas Mason
    - Loro Piana
    - Solbiati
  - Turkish
    - Soktas
  - Egyptian
    - Egyptian Shirting

Confirm:
- all pages render
- mill topics show as Fabric Reference
- breadcrumbs are correct
- no broken paths

---

## 18. Data Audit

Run `node verify/audit.js` from the repo root after the smoke test.

Expected: metadata checks PASS (0 missing objects, 0 missing core fields),
total topics scanned 288, no invalid topic_kind values. Known pre-existing
gap: 107 topics without an explicit topic_kind (the audit reports the count;
it must not grow).



---

## 19. CSS and Visual Regression

Confirm across all screens:

**Typography**
- EB Garamond renders on all headings and topic body text
- Manrope renders on all labels, buttons, and UI text
- no fallback fonts visible

**Home screen**
- brand mark renders
- hero title renders correctly
- two path cards render side by side on desktop
- compass icon on Discover card
- book icon on Guide card
- single column on mobile

**Welcome screen**
- name input renders and focuses automatically
- hint text renders
- continue button works on Enter key

**Questionnaire**
- progress pips render
- option cards render cleanly
- selected state is warm gradient not harsh
- no flash on selection
- continue button sits below options

**Result page**
- hero block renders cleanly
- Why this fits block has left border accent
- two-column grid renders on desktop
- single column on mobile
- Explore Next cards render with rounded corners
- no horizontal rule dividers between sections

**Topic pages**
- breadcrumb renders in small caps
- topic_kind label renders in small caps
- h1 is large EB Garamond
- intro is slightly larger muted text
- metadata strip sits between intro and body
- body sections use kicker labels and EB Garamond paragraphs
- no grey boxes around sections
- related topics sit below a top border
- nav buttons have correct spacing

**Guide menus**
- editorial list layout renders
- hover state slides text right slightly
- arrow animates on hover
- no heavy card boxes

**Discovery panel**
- panel width is correct on desktop
- panel is full width on mobile
- header is sticky
- preset buttons have correct icon alignment
- keyword input has search icon inside
- filter labels have icons inline with text
- result cards have correct structure

**Badges and labels**
- BBS Signature badge uses SVG star not emoji
- Versatility badge renders correctly
- context label renders in muted smaller text below type label
- match reason is italic and below a dashed border

---

## 20. Console Sanity Check

Open browser console and confirm:

- validation success message appears
- query engine loaded message appears
- discovery UI loaded message appears
- no undefined function errors
- no script load order errors
- no repeated fatal errors

---

## 21. Final Pass Criteria

Smoke test passes if:

### Structural
- app loads
- validator passes
- `node verify/audit.js` passes (no new gaps beyond the known 107 topic_kind baseline)
- no broken navigation anywhere

### Discovery
- all preset queries return useful results
- custom filter queries work
- keyword search works including body text match
- combined search works
- result labels are trustworthy
- BBS Signature shows SVG star not emoji
- Browse All Topics returns 288 results

### Content
- all topic pages render with editorial layout
- metadata strip renders with SVG icons
- related topics render with context labels
- duplicate concepts are disambiguated by context labels

### Taxonomy
- accessories and shoes are correctly nested
- colour topics show as Wardrobe Strategy
- brand philosophy topics show as Brand Philosophy
- cloth origin topics show as Fabric Reference
- `node verify/audit.js` passes

### Product trust
- Top Picks feel editorially useful
- match reasons feel believable
- context labels feel clarifying not cluttering
- no obvious metadata drift in results
- the product feels like a premium internal tool

---
## Founder Summary

This checklist exists to protect trust.

Run it after any meaningful change.

The two audit scripts are your primary data health checks.
Run them first and every time.

If both audits pass and the smoke test passes:
the system is healthy and ready for use.

The main discipline now is:
- preserving data quality
- keeping topic_kind clean
- adding images correctly when photography is ready
- not overbuilding before staff testing confirms real needs
