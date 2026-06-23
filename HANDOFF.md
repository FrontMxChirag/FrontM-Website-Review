# FrontM Website — Next.js Handoff (devops)

Prepared 23 Jun 2026 for Karthik. This is the **lift-and-shell** port of FrontM's
marketing site into Next.js, carrying Design's `frontm-deploy-2026-06-23` build verbatim.

## Stack
- **Next.js 16** (App Router) — **pure JavaScript, no TypeScript** (`jsconfig.json`, `.jsx`).
- React 19 (bundled with Next 16). No other runtime deps.
- No CSS framework — the site's hand-written CSS is carried as-is. No build of the styles.

## Run
```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (static prerender of every route)
npm run start    # serve the production build
```
Node 18+ required (built/tested on Node 24).

## What this is (architecture)
The original site renders most of its content at runtime via vanilla-JS scripts hung off a
global `window.FM` object, plus pixel-tuned canvas/scroll animations. Rather than rewrite that
into React (weeks, high regression risk), this port:
- **Carries the CSS + JS unchanged** under `public/site/` (served as static files) and `styles/`
  (imported by the layout).
- **Emits each page's exact HTML body** (host `<div>`s left empty) server-side via
  `dangerouslySetInnerHTML`, so the markup is byte-faithful and SSR-rendered.
- **Loads the original scripts client-side**, in the per-page order, via `app/ScriptRunner.jsx`.
  Navigation is plain `<a href>` (full page loads) — simplest correct model for the global,
  once-per-load scripts.

### The only edit to Design's source
Three asset-path strings were prefixed with `/` so they resolve on nested routes:
`fm.js:167`, `fm-data.js:51`, `fm-rebuild.js:205` (`assets/logos/…` → `/assets/logos/…`).
Everything else under `public/site/` is byte-identical to the Design export.

### Notable choices
- **All 9 CSS load globally** in `app/layout.jsx` (cascade order) — selectors are class-scoped,
  so this is safe and avoids per-route CSS-order bugs. Per-route CSS splitting is a future optimisation.
- **Scripts are strictly per-route** (order matters) — see `SCRIPTS` in each `app/**/page.jsx`.
- **`reactStrictMode: true`** with a one-shot guard in `ScriptRunner` (`window.__fmScriptsLoaded`)
  so dev's double-invoke can't double-inject the scripts.
- `/learn` and `/learn.html` **301/308 → `/platform#learn`** (next.config redirects).
- Favicon via `metadata.icons` → `/assets/logos/frontm/frontm-mark.png` (no separate `.ico`).

## STAGING status — NOT production-ready
- **`noindex`**: `public/robots.txt` is `Disallow: /` **and** layout metadata sets `robots: noindex`.
  Lift both only at launch.
- **Forms are front-end-only** (demo, newsletter). No backend yet — the `/api/lead` chain
  (Turnstile → Copper → Resend → audit log → GA4) is a later stage.
- **Blogs & testimonials are on placeholders** pending content mapping; blog covers may be absent
  (fallback tiles). This is expected.

## Route completeness
All routes are **ported and build-verified** (every page prerenders static; SSR returns 200 with
the page body present). The homepage was additionally verified to carry the **new static hero**
("Operating Platform / For Maritime") plus all host divs in the server HTML.

| Route | Source page | Status |
|---|---|---|
| `/` | index.html | ported · **full SSR parity verified** (hero + host divs) |
| `/platform` | platform.html | ported · SSR 200 |
| `/blogs` | blogs.html | ported · SSR 200 (uses fm-resources.css/js) |
| `/newsletter` | newsletter.html | ported · SSR 200 |
| `/about`, `/contact`, `/hiring` | about/contact/hiring.html | ported · SSR 200 |
| `/solutions-by-department`,`-industry`,`-module` | solutions-by-*.html | ported · SSR 200 |
| `/legal`, `/legal-privacy`, `/legal-terms`, `/legal-gdpr` | legal*.html | ported · SSR 200 |
| `/404` (not-found) | 404.html | ported |
| `/learn` | learn.html (stub) | **redirect** → `/platform#learn` |

**Pending a human browser pass** (canvas/scroll behaviour, not machine-verifiable here): on the
homepage confirm nav fills, marquee scrolls, the problem→solution cinematic scrubs, the
collaboration wheel converges, the demo modal opens, and the horizon background renders.

## Known follow-ups (not blockers for handoff)
- Per-route CSS splitting (currently all-global).
- Upgrade plain-anchor nav to `next/link` + script teardown (deferred on purpose).
- **Content-Reactification for SEO**: script-injected sections (nav, blogs, testimonials) are not
  in the server HTML, so full crawlability needs a later pass. Acceptable now (noindex).
- Vercel deploy (preview per branch).
