# Wow-factor polish — design

## Problem
Design-reference research (styles.refero.design, 21st.dev, manus.im, remix.run
— screenshotted directly via Playwright rather than text-only WebFetch, which
missed most of the actual visual detail) surfaced three small, concrete
techniques worth adding to this app's existing visual language. All three
reuse established patterns already proven elsewhere in the codebase rather
than introducing new visual vocabulary.

## 1. Hover shimmer sweep — `.map-tour-start`

**Scope decision:** originally considered two buttons. The home hero CTA
(`.home-hero-card`) already carries the pointer-follow spotlight glow from
`SPOT_SEL` (styles.css, `initSpotlightCards`) — a second light effect on the
same surface would compete rather than complement. `.vis-surprise-btn` is
text-only/underlined (`.vis-mode-toggle` styling — no border-radius, no
fill, just a bottom border) with no filled surface for a sweep to travel
across. `.map-tour-start` (the Mill Map's "Take the Tour" button, shipped
this session) is a real filled chrome-pill button with nothing else
competing on it — the only clean candidate. Scoped to one button, not two.

**Technique:** a `::after` pseudo-element — a skewed, semi-transparent
light band — travels across the button on `:hover` via a CSS transition on
`left`. Distinct implementation from Kinetic Titles' existing foil sweep
(`.kin-shine`, which uses `background-clip: text` since it animates text),
but the same spirit: one light band, once, not a repeating shimmer loop.

```css
.map-tour-start {
    position: relative;
    overflow: hidden;
}
.map-tour-start::after {
    content: "";
    position: absolute;
    top: 0;
    left: -60%;
    width: 40%;
    height: 100%;
    background: linear-gradient(100deg, transparent, rgba(255, 255, 255, 0.35), transparent);
    transform: skewX(-20deg);
    transition: left 0.6s ease;
    pointer-events: none;
}
.map-tour-start:hover::after {
    left: 130%;
}
```

Reduced-motion is already covered for free: the existing global rule
(styles.css:7438, `@media (prefers-reduced-motion: reduce) { * { transition-duration: 0.01ms !important } }`)
applies to any new `transition`, so this needs no separate exemption.

## 2. Paper grain — two reveal surfaces

**Target surfaces:** `.arch-style-card` (the quiz result reveal card's
visible face — not `.arch-card-wrap`, which is only an invisible
width-constraining wrapper around it with no `position` set and no visual
surface of its own) and `.map-tour-card` (the Mill Map dossier card). Both
are the app's "considered reveal" moments — a result or a fact landing
after a pause — which is exactly the register the reference sites' "quiet
desk on warm paper" / "serif analytics on warm paper" entries described.

**Technique:** an inline SVG `feTurbulence` noise filter as a data-URI
background on a `::before` overlay, at very low opacity with a `multiply`
blend so it reads as paper grain, not a visible pattern.

```css
.arch-style-card::before,
.map-tour-card::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    opacity: 0.035;
    mix-blend-mode: multiply;
    pointer-events: none;
}
```

Both target elements already establish a containing block for the
`::before`'s `inset: 0` to size against — `.arch-style-card` already carries
`position: relative` (styles.css:3092) and `.map-tour-card` already carries
`position: absolute` — so no positioning fix is needed on either, only the
new `::before` rule. `::before` paints after its element's own background
but before its other DOM children, so on both targets the grain sits
correctly between the card's base fill and its text content, not on top of
either.

## 3. Bronze retint — `attract-shader.js`

**Scope decision:** the file's own comments are explicit that its job is to
be "low-key... read as ground" behind the welcome screen's type, not a
decorative statement. A loud new liquid-metal accent would contradict that
already-deliberate restraint, so this is a retint of the existing shader,
not a new element.

**Technique:** a numeric nudge to the shader's `shade` colour stop (the
tone the drifting haze mixes toward at its noise peaks), warming it a few
percent toward the brand's `--bronze` (`#8a6d43`) without raising saturation
enough to stop reading as ambient ground. Everything else about the shader
(speed, `fbm` noise structure, the `base` colour stop, opacity/role) stays
untouched.

```glsl
// before:
vec3 shade=vec3(0.836,0.793,0.716);
// after:
vec3 shade=vec3(0.847,0.775,0.678);
```

## Non-goals
- No second shimmer button — see the scope decision in section 1.
- No new decorative liquid-metal element — see the scope decision in
  section 3; this is a retint of existing code, not a new visual.
- No change to the shader's noise structure, animation speed, or the
  screens it appears on (welcome screen only, unchanged).
- No paper grain anywhere except the two named surfaces — this is not a
  blanket texture applied app-wide.

## Testing / deploy checklist
- Playwright before/after screenshot of `.map-tour-start` hover state.
- Confirm computed `left` on `.map-tour-start::after` changes on hover in a
  live page (not just visual inspection).
- Playwright screenshot of both paper-grain surfaces at production opacity
  — confirm the grain is present but genuinely subtle (a design judgement
  call to verify visually, not just assert numerically).
- Visual/manual check of the welcome screen shader before and after the
  retint — confirm it still reads as pale ambient ground, not a visible
  colour shift.
- `node verify/smoke.js` and `node verify/audit.js` — both green (this
  work is CSS/shader-only, but confirms no regression elsewhere).
- Bump `styles.css?v=` and `attract-shader.js?v=` (currently `?v=2`, going
  to `?v=3` — confirmed via index.html) in index.html + sw.js precache
  list, and `CACHE_VERSION` in sw.js.
