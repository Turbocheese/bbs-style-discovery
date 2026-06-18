# BBS Style Discovery — Product Linking Schema

## Purpose

This document defines the schema for connecting the BBS knowledge 
system to real products.

The goal is not to turn the guide into commerce immediately.

The goal is to make the system structurally ready for:
- product association
- cloth-to-product linking
- image references
- SKU bridges
- future customer-facing discovery
- styling and sales support

---

## Strategic Principle

The guide must remain a knowledge system first.

Product linking should support discovery, not collapse the guide 
into a catalogue.

That means:
- knowledge topics remain editorial
- product links remain optional
- product fields must not distort taxonomy
- product data must be additive, not dominant

---

## Current Status

### Architecture
Complete. The metadata object already supports all required fields.
No structural changes needed to activate product linking.

### UI
The topic page renderTopic() function has a dedicated slot for a 
product linking block, commented out and ready to activate.

### Data
No topics currently have related_skus or product_categories 
populated. This is intentional.
Do not populate these fields until photography and staff testing 
are complete.

---

## Recommended Placement

All product linking fields sit inside the metadata object.

This keeps the shape consistent with the current system and 
allows gradual rollout topic by topic.

Example:
```javascript
metadata: {
  climate: ["tropical", "warm_climate"],
  formality: ["smart_casual"],
  versatility: 5,
  bbs_signature: true,
  product_categories: ["odd_jackets"],
  related_skus: ["BBS-OJ-001"],
  image_refs: ["./images/garment-soft-odd-jacket-01.jpg"]
}
Field Definitions
image_refs
Purpose: Associates a topic with image assets. Type: Array of strings (relative file paths). Status: Live and rendering in topic pages.


image_refs: ["./images/garment-soft-odd-jacket-01.jpg"]
Notes:

Use relative paths only in production
File must exist in images/ folder before adding the reference
If array is missing or empty, image block hides gracefully
Naming convention: [category]-[topic-key]-[number].jpg
product_categories
Purpose: Maps a topic to one or more product groupings. Type: Array of strings. Status: Schema ready. Not yet populated.


product_categories: ["odd_jackets", "soft_tailoring"]
Use cases:

linking discovery topics to product collections
filtering products by knowledge topic
future recommendation logic
Notes:

Stay broad and stable
Do not use SKU-level values here
related_skus
Purpose: Links a topic directly to specific products. Type: Array of strings. Status: Schema ready. Not yet populated.


related_skus: ["BBS-OJ-001", "BBS-OJ-014"]
Use cases:

direct product association
styling support
sales enablement
future customer-facing recommendations
Notes:

Use selectively
Do not force every topic to have SKU links
Many educational topics may never need them
cloth_links
Purpose: Connects garment or wardrobe topics to cloth references. Type: Array of strings (topic keys). Status: Schema ready. Not yet populated.


cloth_links: ["hopsack", "wool_linen", "high_twist_wool"]
Use cases:

connecting product recommendations to cloth education
helping staff explain material logic
future cloth-led product discovery
product_families
Purpose: Groups related products at a level between category and SKU. Type: Array of strings. Status: Schema ready. Not yet populated.


product_families: ["napoli_soft_jackets", "tropical_shirting_core"]
Notes:

Only use if product organisation needs an intermediate grouping
If not needed yet, do not add it
silhouette_refs
Purpose: Associates topics with silhouette or fit systems. Type: Array of strings. Status: Schema ready. Not yet populated.


silhouette_refs: ["soft_jacket_regular", "trouser_high_rise_single_pleat"]
styling_refs
Purpose: Associates topics with outfits or curated looks. Type: Array of strings. Status: Schema ready. Not yet populated.


styling_refs: ["look-soft-jacket-stone-trouser-01"]
Notes:

Especially useful for shoes, accessories, colour topics
availability_status
Purpose: Signals whether linked products are currently available. Type: Single string. Status: Schema ready. Not yet populated.


availability_status: "current"
Approved values:

current
seasonal
archived
reference_only
Notes:

Only use once product linking is operational
commercial_priority
Purpose: Optional commercial weighting for recommendation logic. Type: Single string. Status: Schema ready. Not yet populated.


commercial_priority: "high"
Approved values:

high
medium
low
Notes:

Use with extreme care
Must never override editorial integrity
Minimal First Schema
When starting product linking, use only these four fields:

product_categories
related_skus
image_refs (already live)
cloth_links
That is enough to unlock meaningful product linkage without overbuilding.
## UI Implementation Plan

When ready to build the product linking UI:

### Step 1: Add data
Populate related_skus on a small pilot set of topics:
- Soft Odd Jacket
- Smart Casual (jacket use case)
- Penny Loafer
- Suede Loafer
- Oxford (shirting)
- Hopsack
- Warm-Weather Palette
- Core Wardrobe Anchors

### Step 2: Build the UI block
Add a product linking block to renderTopic() in app.js.
Place it between the body sections and the related topics block.

The block should render:
- a section heading (In Store Now or Relevant Pieces)
- a clean grid of SKU cards
- each card shows the SKU name and a View action
- the block only renders if related_skus exists and has items
- if empty or missing the block is completely hidden

### Step 3: Style it
The product linking block should feel:
- more utilitarian than the educational cards
- like a bridge to a retail POS system
- clean and functional
- not decorative

### Step 4: Test it
Run the smoke test checklist.
Confirm the block appears only when SKUs are present.
Confirm the block hides gracefully when SKUs are absent.
Confirm the rest of the topic page is unaffected.

---

## SKU Naming Convention

When populating related_skus, use a consistent naming format 
so the data stays maintainable as inventory grows.

### Recommended format
BBS-[CATEGORY]-[DESCRIPTOR]-[COLOUR]

### Category codes
- OJ = Odd Jacket
- SU = Suit
- TR = Trouser
- SH = Shirt
- BE = Belt
- TI = Tie
- PS = Pocket Square
- LO = Loafer
- DS = Dress Shoe
- BO = Boot
- SN = Sneaker

### Examples
```javascript
related_skus: [
  "BBS-OJ-TEBA-NAVY",
  "BBS-OJ-TEBA-OLIVE",
  "BBS-OJ-HOPSACK-SAND",
  "BBS-SU-TWOPCE-FRESCO-NAVY",
  "BBS-TR-PLEAT-WOOLINEN-STONE",
  "BBS-SH-LS-OXFORD-WHITE",
  "BBS-LO-PENNY-TAN",
  "BBS-LO-SUEDE-TOBACCO"
]
Rules
always uppercase
always hyphen separated
no spaces
no special characters
keep descriptor short but meaningful
colour at the end always
if no colour variant exists omit it
Topics That Should Get Product Links First
First priority (garments)
Soft Odd Jacket
Teba
Safari
Single-Breasted Jacket
Long Sleeve (shirt)
Short Sleeve (shirt)
Single Pleats (trouser)
Second priority (accessories)
Penny Loafer
Suede Loafer
Derby
Oxford (shoe)
Suede Belt
Grenadine Tie
Linen Pocket Square
Third priority (fabrics)
Hopsack
Fresco
High-Twist Wool
Oxford (shirting)
Linen Shirting
Fourth priority (colour and wardrobe)
Warm-Weather Palette
Core Wardrobe Anchors
Navy
Stone and Beige
Sand
Topics that should not get SKU links
Brand philosophy topics
Construction detail topics
Abstract wardrobe theory topics
Mill and cloth origin reference topics
Highly ceremonial or low-frequency topics
Topics where the knowledge is purely educational
Example Topic With Full Product Linking
This is what a fully linked topic looks like in data.js. Use this as the template when populating product data.


soft_odd_jacket: {
  type: "topic",
  key: "soft_odd_jacket",
  topic_kind: "garment",
  title: "Soft Odd Jacket",
  tags: [
    "tailoring",
    "jackets",
    "other_styles",
    "soft_odd_jacket",
    "soft_structure",
    "smart_casual",
    "travel",
    "versatile",
    "warm_climate",
    "bbs_core"
  ],
  intro: "The core BBS expression of casual tailoring.",
  metadata: {
    climate: ["tropical", "warm_climate"],
    seasonality: ["year_round"],
    formality: ["casual", "smart_casual"],
    use_cases: ["everyday", "travel", "smart_casual"],
    weight: "lightweight",
    structure: "soft",
    performance: ["breathable", "easy_care"],
    care: "professional_clean",
    versatility: 5,
    bbs_signature: true,
    priority: "high",
    frequency: "daily",
    price_sensitivity: "medium",
    image_refs: ["./images/garment-soft-odd-jacket-01.jpg"],
    product_categories: ["odd_jackets", "soft_tailoring"],
    related_skus: [
      "BBS-OJ-HOPSACK-NAVY",
      "BBS-OJ-HOPSACK-SAND",
      "BBS-OJ-WOOLINEN-OLIVE"
    ],
    cloth_links: ["hopsack", "wool_linen", "high_twist_wool"]
  },
  sections: [...]
}
Query Layer Implications
When product linking is active, the query engine can be extended to support:

Product-aware preset queries
New presets such as:

In Stock Now (topics with related_skus populated)
New Arrivals (topics with availability_status: current)
Signature Pieces with Products
These would require no architecture changes. Just new preset functions in query.js using metadata filters.

Cloth-to-product bridges
If cloth_links is populated, a topic page can show:

which garments use this cloth
which garments are currently in stock in this cloth
Category-level filtering
If product_categories is populated, the discovery panel could add a Product Category filter:

Odd Jackets
Suits
Shirts
Trousers
Shoes
This would surface only topics with linked products, making the tool more commercially useful on the shop floor.

UI Layer Implications
Topic page product block
Renders between body sections and related topics. Only renders if related_skus has items. Hides completely if empty or missing.

Proposed structure:


IN STORE NOW
[SKU card] [SKU card] [SKU card]
Each SKU card shows:

product name derived from SKU string
a small tag icon
a View action (links to product page or POS system)
Discovery panel future filters
A Product Category filter could be added to the panel dropdowns when product_categories is populated across enough topics.

This would require:

one new select element in index.html
one new filter condition in queryByMetadata() in query.js
no other changes
Result card future enhancements
When a result card topic has related_skus populated, the card could show a small In Stock indicator badge.

This would require:

one condition in generateResultCardHTML() in discovery-ui.js
one new CSS class for the badge
no other changes
Governance Rules
Add product linking fields only when:
the topic has real product relevance
the link improves internal utility
the association is stable enough to maintain
photography is already in place for that topic
the SKU exists in the real product catalogue
Do not add product linking fields when:
the topic is too abstract
the relationship is unclear
the data will go stale quickly
the field exists only for hypothetical future use
the SKU has not been confirmed with the merchandising team
Maintain SKU accuracy
A broken or outdated SKU link is worse than no link at all.

If a product is discontinued:

remove the SKU from related_skus
or update availability_status to archived
Do not leave dead links in the data.

Keep the guide editorial first
The system must remain:

educational
navigable
discovery-led
Product linking should support that, not replace it.

Rollout Phases
Phase 1 (current)
Schema defined. image_refs live and rendering. No SKU population yet. No product linking UI built yet.

Phase 2 (activate when ready)
Prerequisites:

staff testing complete
photography in place for pilot topics
SKU format agreed with merchandising team
Actions:

populate related_skus on pilot set of 8-10 topics
build product linking UI block in renderTopic()
test graceful fallback for topics without SKUs
run smoke test checklist
Phase 3 (expand)
Prerequisites:

Phase 2 validated by staff
SKU data stable and maintained
Actions:

expand related_skus coverage to first and second priority topics
populate product_categories across relevant topics
add cloth_links to fabric topics
consider adding Product Category filter to discovery panel
Phase 4 (connect to live data)
Prerequisites:

Phase 3 validated
live inventory API or feed available
Actions:

connect availability_status to real inventory
consider replacing static SKU strings with live product data
evaluate customer-facing adaptation
Relationship to Current Discovery Product
The discovery layer is now strong enough that product linking should be treated as the next strategic layer, not a rescue mechanism.

The current system already supports:

presets
filters
deep keyword search
combined query flows
Top Picks
grouped discovery
explainable results
288 fully enriched topics
Product linking should build on this strength. It should not compensate for weak discovery.

Founder Summary
This schema exists to prepare the BBS knowledge system for its next strategic layer.

The right next move is not full integration. The right next move is disciplined readiness.

Do not build the product linking UI until:

Staff testing has confirmed the tool is genuinely useful.
Photography is in place for the pilot topics.
SKU data is stable and confirmed with merchandising.
Keep the guide editorial. Keep the schema optional. Expand only where the link genuinely improves the product.

The architecture is ready. The data structure is waiting. The UI slot is reserved.

When the business is ready, this can be activated in a single focused build session.