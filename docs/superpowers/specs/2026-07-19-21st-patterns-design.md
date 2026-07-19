# Borrowing from 21st.dev — Design

Date: 19 July 2026
Status: approved, ready for implementation

## The constraint that shapes everything

[21st.dev](https://21st.dev) is a shadcn/ui registry: React + Tailwind + Radix, installed with
`npx shadcn add`. This app is vanilla ES5, no framework, no bundler, everything vendored so it
runs offline on an in-store iPad.

**Nothing is installed from 21st.dev.** These are its ideas, rebuilt from scratch. Two filters
decided what was worth rebuilding:

1. **Touch, not pointer.** The most-liked components — Spotlight Card (6.2k), tilt-on-cursor,
   hover-reveal — track a cursor that does not exist on an iPad. A tap can also leave a sticky
   hover, which is exactly the bug that inverted a look card to unreadable earlier today.
2. **Offline, not CDN.** Spline Scene (6.5k) loads a 3D runtime from a CDN, which breaks the
   offline operation every vendored dependency exists to protect.

Assessed live against the house tokens:
https://claude.ai/code/artifact/bdb8f815-1c19-4004-b0a1-82a2cb0a012d

## 1. Scroll-linked reveal

*Source: Container Scroll Animation, 7.6k likes.*

Guide sections and the guide index currently deliver every row at once — Tailoring alone is 148
topics. Rows fade and rise as they enter the viewport, staggered slightly.

One `IntersectionObserver`, one class. Fully skipped under `prefers-reduced-motion`, and the
initial state must be visible-if-JS-fails rather than hidden, so a failure degrades to "no
animation" instead of "no content".

## 2. Bento grid

*Source: bento layouts across the Features category.*

The home screen is a stack of equal-weight cards, so nothing reads as primary. An unequal grid
lets "Discover your direction" occupy a double tile while the Cloth Room, Mill Map and Guide
take smaller ones. Pure CSS grid — no motion, no dependency, no pointer.

## 3. Spotlight card, rebuilt for touch

*Source: Spotlight Card, 6.2k likes.*

As published it does nothing on the target device. Rebuilt, the highlight anchors to the
**touch point**: tap a cloth swatch and light blooms from where the finger landed, reading as
sheen moving across the weave — what you would do holding real cloth to a window.

`pointerdown` sets two custom properties, a class drives a CSS transition, and the class is
removed on completion so nothing sticks. No pointer tracking, no hover.

## 4. Background paths, as a tape blade

*Source: Background Paths, 4.2k likes.*

Generic drifting lines are the "gimmicky" register already rejected twice. But the app has a
signature motif — the tape measure runs through quiz progress and the loading interstitial — so
the drifting paths become tape blades carrying real measure ticks.

Canvas, not hand-authored SVG. Sits behind the welcome screen at low contrast, must never
compete with the portrait or the type, and freezes under `prefers-reduced-motion`.

## 5. COBE globe — Cloth Origins

*Source: cobe-globe-interactive.*

[COBE](https://github.com/shuding/cobe) is 12.9KB, MIT, zero dependencies, and makes **no
external requests** — the dotted world texture is embedded. It is therefore vendorable exactly
like html2canvas and jsPDF, unlike Spline.

It ships as ESM (`export{Pe as default}`) while this app is plain script tags with a
load-bearing order. The vendored copy rewrites that export to a global assignment rather than
introducing a module script, which would otherwise defer past the app's initialisation.

**Role: opening, not replacement.** The existing Mill Map stays. It carries geographically
accurate Natural Earth coastlines, 40 house pins, and district charts that de-overlap 18 mills
around Biella and 8 across West Yorkshire. A globe cannot show those — at world scale Biella
collapses to a single dot. So the globe answers "where in the world does BBS cloth come from",
and tapping a region drops into the flat chart, which answers "which mills, and exactly where".
Each does the job it is good at and nothing is lost.

**Styling: house tokens.** Ink landmass dots on a cream sphere, bronze markers, no glow —
an engraved terrestrial globe rather than a WebGL object. Dark theme inverts via the same
tokens.

## Rejected, and why

**Radial Orbital Timeline (5.7k).** A ring encodes nothing about mills. They have real
geography and the Mill Map already shows it; swapping true position for decorative arrangement
would make the app less informative while looking busier.

## Verification

Each pattern is driven in the real app at iPad size, not asserted from unit state — the
turn-up bug earlier today passed a green check while rendering nothing, because the check
verified that a control *selected* rather than that output *changed*. Checks here compare
rendered output between states.

Plus: `verify/smoke.js` and `verify/audit.js` green, no target under 44px, no console errors,
hover stability on every new control, and `prefers-reduced-motion` honoured by 1, 4 and 5.
