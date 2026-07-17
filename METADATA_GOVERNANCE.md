# BBS Style Discovery — Metadata Governance

## Purpose

This document defines the working metadata discipline for the 
BBS Style Discovery system.

The goal is to keep the discovery engine:
- trustworthy
- queryable
- explainable
- stable as the taxonomy grows

---

## Current Coverage State

As of the 18 July 2026 audit (`node verify/audit.js`):
- 288 topics total
- 0 topics with missing metadata objects
- 0 topics missing core fields (formality + versatility)
- **107 topics with missing topic_kind** (mostly tailoring sub-trees).
  Earlier versions of this document claimed 0 — that was never true of the
  committed code. Rendering falls back gracefully, but backfill per the
  assignment rules below when touching those topics, and never let the
  count grow.

Run `node verify/audit.js` after any bulk edits.

---

## Core Principle

Metadata should be:
- useful
- consistent
- intentionally limited
- tied to product behavior

Do not add fields or values casually.

---

## Audit Script

Run `node verify/audit.js` from the repo root after any significant edit
to `data.js`. It checks:
- completely missing metadata objects
- missing formality / versatility fields
- missing or invalid topic_kind values
- total topic count (expected 288)

(The two "console audit scripts" earlier versions of this document
described were never committed to the repo; `verify/audit.js` is their
committed replacement.)

---

## Auto-Enrichment Script — DOES NOT EXIST

Earlier versions of this document described a runtime enrichment function
at the bottom of `data.js` that inferred metadata from tags. **Verified
July 2026: no such script exists in the committed code** (it was
apparently a console one-off). There is no metadata safety net — write
explicit metadata on every new topic.

---

## Current Metadata Fields

### Core discovery fields (required on all topics)
- `formality`
- `versatility`

### Standard fields
- `climate`
- `seasonality`
- `use_cases`
- `bbs_signature`
- `priority`

### Optional fields
- `care`
- `performance`
- `weight`
- `texture`
- `frequency`
- `price_sensitivity`
- `structure`

### Pipeline fields (do not populate until ready)
- `image_refs`
- `related_skus`
- `product_categories`
- `cloth_links`

---

## Approved Vocabulary

### climate
- tropical
- warm_climate
- humid
- temperate
- indoor

### seasonality
- year_round
- spring
- summer
- autumn
- winter

### formality
- casual
- smart_casual
- business_casual
- business
- professional
- formal

### use_cases
- everyday
- work
- travel
- smart_casual
- casual
- resort
- wedding
- occasion
- evening
- formal

### performance
- breathable
- recovery
- wrinkle_resistant
- durable
- easy_movement
- easy_care
- versatile
- textured

### weight
- lightweight
- midweight
- heavyweight

### texture
- smooth
- soft
- textured
- open_weave
- crisp

### priority
- high
- medium
- low

### versatility
- 5 = foundational across many wardrobes
- 4 = broadly useful
- 3 = useful but contextual
- 2 = specific
- 1 = narrow or specialized
- 0 = highly specific or ceremonial

### bbs_signature
Boolean only. Use true selectively.
Only when topic clearly expresses:
- tropical appropriateness
- soft structure
- cloth-led dressing
- refined ease
- quiet distinction
- central BBS editorial stance

---

## topic_kind Governance

### Approved values
- garment
- garment_detail
- fabric
- fabric_reference
- wardrobe_strategy
- brand_philosophy
- guide

### Assignment rules
- `brand_philosophy`: about section, editorial philosophy topics
- `wardrobe_strategy`: colour wardrobe, use-case topics, accessories strategy
- `garment`: named garments and silhouettes
- `garment_detail`: construction details, pockets, lapels, buttons
- `fabric`: cloth types and weaves
- `fabric_reference`: mill and cloth origin topics
- `guide`: fallback only

### Do not rely on inference for high-visibility topics
Set topic_kind explicitly on:
- all about section topics
- all colour wardrobe strategy topics
- all accessories topics
- all cloth origins topics
- any topic where the inferred value would be wrong

---

## Image Governance

### image_refs field
- array of strings
- each string is a relative path to a local image file
- example: `["./images/garment-soft-odd-jacket-01.jpg"]`
- if empty or missing, the UI gracefully hides the image block
- do not use external URLs in production

### Naming convention
Format: `[category]-[topic-key]-[number].jpg`

Categories:
- garment
- fabric
- detail
- shoe

Examples:
- garment-soft-odd-jacket-01.jpg
- fabric-fresco-01.jpg
- detail-spalla-camicia-01.jpg
- shoe-penny-loafer-01.jpg

### When to add images
Only add image_refs when:
- the image file is already in the images/ folder
- the file name matches the naming convention
- the image is sartorial and brand-appropriate

Do not add placeholder or external URLs to production data.

---

## Governance Workflow

### When adding a new topic
1. confirm the topic belongs in the taxonomy
2. assign explicit topic_kind
3. add metadata using approved vocabulary
4. set versatility conservatively
5. set bbs_signature selectively
6. run `node verify/audit.js`
7. confirm audit passes cleanly

### When editing existing metadata
1. check whether the change affects ranking
2. check whether the change affects query match behavior
3. confirm vocabulary remains inside approved values
4. run `node verify/audit.js` after editing

### Recommended audit cadence
Run `node verify/audit.js`:
- after adding any new topic
- after bulk metadata edits
- before any staff demo or testing session
- before any customer-facing adaptation work