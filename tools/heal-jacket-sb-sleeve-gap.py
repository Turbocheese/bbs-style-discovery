#!/usr/bin/env python3
# Regenerates images/styleBuilder/jacket-sb-notch-sleeve-gap-healed.png
# from the original, unmodified source photo. Not run automatically by
# build-garment-assets.js — this is a one-off preprocessing step whose
# OUTPUT is committed and consumed as a normal source file. Re-run only
# if the original source photo changes.
#
# What this fixes: the raw jacket-sb source has a hard-edged, near-
# white gap between the sleeve and torso (ghost-mannequin volume
# standing the sleeve away from the body more than a worn garment
# would, letting the white studio backdrop show through). It survives
# mask extraction as opaque "garment" because it's an enclosed island
# the frame-edge flood fill in extractMask can never reach.
#
# Three earlier attempts were tried and rejected (see the commit
# history / docs/2026-08-23-style-room-image-prompts.md item #1 for the
# full account) before landing on this: cv2.seamlessClone with
# NORMAL_CLONE, which solves a Poisson blend so the transplanted patch
# matches the surrounding gradient — real photographed fabric grain,
# not inpainting-blurred or hand-feathered, so a stripe or check
# pattern multiplied over it at render time runs straight through with
# no visible seam. Founder's bar for "correct": a screenshot of
# jacket-sb-peak-patch's own sleeve/body seam (a different source photo
# with no gap at all) — nothing visible there whatsoever.
#
# Requires: pip install opencv-python-headless pillow numpy
#
# Usage: python3 tools/heal-jacket-sb-sleeve-gap.py

import cv2
import numpy as np
from PIL import Image

SRC = "images/styleBuilder/replicate-prediction-mapxkr394drmr0d05wa9n2cnbw.png"
OUT = "images/styleBuilder/jacket-sb-notch-sleeve-gap-healed.png"

im = Image.open(SRC).convert("RGB")
arr = np.array(im)
h, w = arr.shape[:2]
lum = 0.299 * arr[:, :, 0].astype(float) + 0.587 * arr[:, :, 1].astype(float) + 0.114 * arr[:, :, 2].astype(float)

# Restricted to where the gap actually lives (measured directly off the
# raw source) so this can never sweep in a real highlight elsewhere on
# the garment -- a real highlight has a soft gradient falloff; this gap
# is pegged 253-255 with a hard, silhouette-like boundary.
search = np.zeros((h, w), dtype=np.uint8)
search[650:1200, 150:320] = 1
core = ((lum > 235) & (search.astype(bool))).astype(np.uint8) * 255
n, labels = cv2.connectedComponents(core)
sizes = [(labels == i).sum() for i in range(1, n)]
best = int(np.argmax(sizes)) + 1 if sizes else 0
blob = (labels == best).astype(np.uint8) * 255
# Grown past the hard-saturated core to also cover the natural darkened
# fold-shadow leading into it (column mean drops ~154 to ~99 over
# ~250px before the blowout -- a real fold, not photo noise), so the
# donor patch below replaces the whole anomaly, not just its brightest
# pixels.
mask = cv2.dilate(blob, np.ones((25, 25), np.uint8), iterations=1)

ys, xs = np.where(mask > 0)
y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
bh, bw = y1 - y0, x1 - x0
center = (x0 + bw // 2, y0 + bh // 2)

bgr = cv2.cvtColor(arr, cv2.COLOR_RGB2BGR)

# Donor: a same-size patch of real, clean, unshaded sleeve fabric --
# well clear of the defect, the garment's own silhouette edge, and the
# pocket flap.
donor_x0, donor_y0 = 335, 560
donor = bgr[donor_y0:donor_y0 + bh, donor_x0:donor_x0 + bw].copy()
donor_mask = np.zeros((bh, bw), dtype=np.uint8)
cv2.ellipse(donor_mask, (bw // 2, bh // 2), (bw // 2 - 3, bh // 2 - 3), 0, 0, 360, 255, -1)

result = cv2.seamlessClone(donor, bgr, donor_mask, center, cv2.NORMAL_CLONE)
Image.fromarray(cv2.cvtColor(result, cv2.COLOR_BGR2RGB)).save(OUT)
print("wrote " + OUT)
