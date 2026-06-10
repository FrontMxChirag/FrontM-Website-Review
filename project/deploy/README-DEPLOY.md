# FrontM Homepage — Deployment Package

Static site, no build step, no server-side code. Upload the contents of this folder
to any static host (Netlify, Vercel, S3+CloudFront, nginx, cPanel docroot, …) and it works.

## Contents
```
index.html                  the homepage (production-cleaned)
site/                       6 CSS + 7 JS modules (plain files, no bundler needed)
assets/logos/frontm/        brand lockup + mark (favicon)
assets/logos/companies/     14 partner logos for the "Trusted by" marquee
```

## What was cleaned for production (vs. the working file)
- Internal **Archive board** (retired-sections reference) removed
- Inert `fm-transition.js` and the dev `fm-debug.js` overlay removed
- SEO/meta added: description, OG tags, theme-color, favicon
- Fixed `height` removed from the hero h1 inline style (was clipping on mobile); all other
  hero typography choices kept as-is

## External dependencies
- **Google Fonts** (IBM Plex Sans Condensed, Hanken Grotesk, JetBrains Mono) via `@import`
  in `site/fm.css` — needs internet. For a fully self-hosted setup, download the families
  and replace the `@import` with local `@font-face` rules.
- Nothing else: no CDN scripts, no analytics, no trackers.

## ⚠️ Before going live — content blockers
1. **"⚑ Pending verification" flag** is visible on the Impact proof row — the stats
   (vessels/users) are placeholders pending Venkat's numbers. Replace in `site/fm-data.js`
   and remove the flag in `index.html`.
2. **All nav routes, footer links, and CTAs point to `#`** (`data-route` placeholders).
   Wire them to real URLs (pricing, frontm.ai, marketplace pages).
3. **Book a Demo modal** is front-end only — the form does not submit anywhere.
   Connect it to your scheduling/CRM endpoint (see `site/fm.js`, demo modal section).
4. **Newsletter form** likewise does not submit.
5. **Partner logos**: confirm permission to display all 14 marquee logos.
6. og:image is not set — add a 1200×630 social card when you have one.

## Behaviour notes
- Scroll-driven sections (problem→solution, platform) run on desktop landscape only;
  portrait/touch/narrow (≤980px or portrait ≤1366px) and reduced-motion users get
  static stacked layouts. This is by design (legibility pass, June 2026).
- All animation pauses offscreen; canvases cap at 2× DPR.
