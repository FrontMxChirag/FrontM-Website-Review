# FrontM, Logo Assets

Drop logos into the matching folder. SVG is strongly preferred (crisp at any
size, recolors cleanly on dark backgrounds). Transparent PNG @2x is the fallback.

────────────────────────────────────────────────────────
assets/logos/
├── frontm/                         ← FrontM's own brand marks
│   ├── frontm-logo.svg             full lockup (icon + "frontM" wordmark)
│   ├── frontm-logo-light.svg       lockup for DARK backgrounds (white/light text)
│   ├── frontm-logo-dark.svg        lockup for LIGHT backgrounds (dark text)
│   ├── frontm-mark.svg             icon / glyph only (the gradient dot mark)
│   └── frontm-favicon.svg          square mark for tabs / app icon
│
└── companies/                      ← customer + partner logos ("Trusted by")
    ├── _index.json                 optional: order + display names (see below)
    ├── maersk.svg
    ├── stena.svg
    ├── wallenius.svg
    └── …one file per company, lowercase-hyphenated name
────────────────────────────────────────────────────────

## Naming rules
- lowercase, hyphenated, no spaces:  `blue-water-shipping.svg`
- one logo per company; use the **monochrome / white** version if you have it
  (partner strips read best as a single tint on dark).
- if a company only sent a color raster: `company-name@2x.png`, transparent bg.

## Optional: companies/_index.json
Lets me control order + tooltip text without renaming files:
```json
[
  { "file": "maersk.svg",   "name": "Maersk" },
  { "file": "stena.svg",    "name": "Stena Line" },
  { "file": "wallenius.svg", "name": "Wallenius Wilhelmsen" }
]
```

When the files are in, tell me and I'll wire:
- `frontm/` → the nav wordmark, the hub, and the footer brand block
- `companies/` → the "Trusted by" marquee on the homepage
