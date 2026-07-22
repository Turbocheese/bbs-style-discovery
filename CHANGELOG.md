# What's New — BBS Style Discovery

A running log of the major updates to the in-store Style Discovery app, newest
first. Think of it like an App Store "What's New" — the headline changes a
customer or staff member would actually notice, with the date they landed.

> **How to add an entry:** when you ship something notable, add a dated section
> at the top with a short, plain-language summary of what changed. Keep the
> internal detail in the git history — this file is the highlights reel.

---

## 2026-07-22 — Archetype figures no longer missing their trousers

- **The cut-out figures are whole again.** Several archetype illustrations
  wear cream or linen trousers (and light shirts) that are the exact colour of
  the background they were cut from, so the cut-out had punched transparent
  holes through them — the trousers looked like they were missing on the
  welcome screen and in the Archetype Gallery. The cut-out now fills those
  interior holes back in, so every garment renders whole while the figure still
  floats cleanly on the page. Gallery cards also lift on touch instead of
  flashing dark.

## 2026-07-22 — Cloth Room refinements

- **Named cloth cards.** The bunch now reads as tidy cloth cards — four to a
  row — each showing the woven swatch with its name and mill, so a specific
  cloth is easy to spot and pick. (The 3D coverflow browse is kept in reserve
  for a future feature.)
- **Trousers always dress in cloth.** Fixed a case where a returning session
  could show a garment — most visibly the trousers — as a bare white/cream
  shape instead of its cloth. Every garment now always renders dressed.
- **No black swatch on touch.** Fixed cloth cards turning dark when pressed or
  hovered.

## 2026-07-22 — In-store experience polish

A warmer, more considered feel across the whole app, plus a mobile fix.
- **A living backdrop.** A soft, flowing "cashmere mist" now drifts quietly
  behind every screen — light and low-key, with the content sitting on a gently
  textured cream sheet. The old drifting-tape background is retired.
- **The house, in numbers.** The Mill Map counts up the scale of the collection
  as you arrive: 259 years, 40 houses, 102 cloths.
- **A foil-stamp reveal.** Your name, and your style-result headline, settle in
  and then catch a brass foil sheen sweeping across — like a real foil stamp.
- **A more refined discovery flow.** The style and colour quizzes and the final
  details step now read in elegant sentence case instead of shouting in full
  capitals, and every muted label was checked for legibility.
- **Flip cards fixed on iPhone and iPad.** The turn-over cards in the guide and
  lookbook were being cut to a sliver in Safari; they now show at full height.

## 2026-07-21 — Photographic garments

The centrepiece of the Cloth Room — the jacket, waistcoat and trousers — is now
built from real **photographs** instead of drawn silhouettes, so every one of
the 100+ cloths drapes onto a genuinely tailored shape.

- **Second-generation photography.** New pure-white studio shots with the black
  Bemberg lining and horn buttons captured in-camera. Cleaner silhouettes, no
  grey halo around the edges.
- **Softer, smarter linings.** The lining now reads as a rich tonal dark —
  near-black against dark cloths, a soft shadow behind pale ones — instead of a
  harsh black block.
- **Crisper edges.** Garment outlines are now smoothly anti-aliased rather than
  jagged.
- **Simpler trouser choices.** Trousers are now a single clear pick — **Flat
  Front, Double Pleat, or Belt Loops** — each straight-legged in the house cut.
- **Tidier tailoring options.** Double-breasted waistcoats are hidden for now
  (returning once photographed); buttons come straight from the photograph.

## 2026-07-20 — The cloth-compositing engine

The technology that lets any cloth "pour" into a photographed garment in real
time.

- **Live cloth on real garments.** Selecting a cloth now composites its weave
  and colour directly into the garment photo as you browse.
- **Cloth that bends with the cut.** Stripes and checks curve around the lapel
  roll and sleeves, so patterns follow the garment instead of sitting flat on
  top.

## 2026-07-19 — Cloth library, guide & the store experience

A large release across the whole app.

- **102 cloths, from 14.** The Cloth Room library grew to over a hundred cloths
  across 34 mills, with faceted filtering by region, weave and weight.
- **Cloth Origins globe.** An interactive globe opens the mill map, every mill
  country named on leader lines.
- **The Provenance Tape.** 358 years of mill history, drawn as a tailor's tape
  blade.
- **A rebuilt home screen** and a new "Gallery Wall" welcome.
- **Ensemble mode.** Design a full three-piece outfit — jacket, waistcoat and
  trousers — each cloth-swappable with its own detailing.
- **The Guide.** 312 topics with a clear editorial hierarchy, dead links fixed,
  and navigation that tells you how deep each section goes.
- **A full accessibility, touch and typography pass** across the app.
