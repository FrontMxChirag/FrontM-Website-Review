# FrontM Deploy — Design Changelist

Running record of structural/design changes to the deploy build. Newest first.

---

## 2026-06-17 · Impact section (S7) moved off homepage → Solutions ▸ By Industry

- The S7 "Measure what matters / Turn adoption into measurable operating value" evidence
  journey (usage signals → operating proof → business outcomes bridge, the four evidence
  cards, and the business-case CTA) was **moved off `index.html`** to a new standalone page
  `solutions-by-industry.html`, following the same pattern as the S6 → By Department move.
- **New page** `deploy/solutions-by-industry.html`: shared nav/footer/demo-modal chrome; the
  Impact section verbatim, reframed with a page hero (eyebrow "Solutions · By Industry", the
  headline promoted to `<h1>`, `.sbi-hero` framing). Reuses shared `.s7e-*` / `.impact-*`
  styles from `fm-rebuild.css`. Loads the same script set as the By Department page
  (`fm-data · signal-field · fm-platform · fm-rebuild · fm.js`).
- **Nav wired**: `fm-data.js` NAV → Solutions ▸ By Industry now carries
  `'solutions-by-industry.html'` (was an inert "Soon" placeholder). By Module / By Plan
  remain "Soon".
- **Homepage**: section replaced with a breadcrumb comment. No JS change needed — the Impact
  block is static markup with no builder.

---

## 2026-06-17 · Collaboration wheel — hub colour well + animated gradient + live constellation

- `deploy/site/fm-rebuild.css` — the center FrontM hub sits on a **darkened-brand colour
  well** (`.cw-hub::before`: deep blue / green / amber / orange radial gradients clipped to the
  disc). It is now **animated**: two un-synced cycles (`cwHubDrift` 14s rotate+breathe,
  `cwHubGlow` 8s saturation/brightness) read as alive, not looping. On hover both cycles speed
  up (6s / 3.4s), the well brightens, the mark scales up smoothly with a teal halo, and the hub
  picks up a stronger glow.
- **Card hover** (`.cw-mod` / `.cw-stk`): pills now *pop* — lift (`translateY`) + scale, fill
  with a brand-colour gradient, brighter border + drop shadow. Applied to the inner pill (not
  the `.cw-node` wrapper) so it survives the pointer-tilt's inline transforms.
- **Focus**: hovering any node dims the others to 0.5 (`:has(.cw-node:hover)` → siblings),
  never hiding them.
- `deploy/site/fm-rebuild.js` — the living-connector constellation got more alive: endpoints
  **drift continuously** (small per-point sine/cosine wobble; hub stays anchored), and on hover
  the network **clusters around the hovered node** — link target rises 5→9, ~62% of new links
  attach to the hovered node, those links spawn faster (shorter durations) and render brighter
  (related-line highlight). Still one `requestAnimationFrame` loop.
- Wheel tilt JS, star convergence, and reduced-motion untouched (hub gradient animation is
  disabled under `prefers-reduced-motion`).

---

## 2026-06-17 · Horizon — tied to WHOLE-PAGE scroll progress (was absolute TRAVEL)

- `deploy/site/scroll-horizon.js` — the scroll-mode crest now rises proportionally to the
  **entire page**, like the archived v2 mapping. Replaced the absolute `TRAVEL = 2.6`
  viewport-heights mapping (rise finished in the first ~2.6 screens then held) with
  `p = scrollY / (scrollHeight − vh)`, so the water-line is a progress indicator for total
  page scroll — rising the full way top→bottom (the long pinned pflow section just makes the
  rise gradual, which is the intended feel).
- **Eased**: `pe = p²(3−2p)` (smoothstep) so the crest holds gracefully at both ends with no
  sudden jumps.
- **START** 0.80 → **0.75**·vh — crest sits low at the top but lifted off the very bottom, so a
  thin ocean band is visible from the top (slightly fuller than before).
- **REST** kept at **0.20**·vh — crest reaches ~4/5 up the screen at page bottom.
- Applies to every scroll-mode page (homepage + legal/about/contact/hiring); proportional
  mapping rises cleanly across each page's own full scroll, short pages included (`p` still
  spans 0→1). Wheel animation, star convergence, and reduced-motion untouched.

---

## 2026-06-17 · Legal pages — missing GDPR/Privacy built + homepage horizon background

- **Built the two missing pages**: `legal-gdpr.html` and `legal-privacy.html` (only
  `legal-terms.html` existed, so the GDPR + Privacy cards on `legal.html` 404'd). Both use the
  exact Terms template (shared nav/drawer/demo-modal chrome + `fm-legal.css` reading sheet).
  Content is **verbatim** from the supplied source files: Roman-/numbered-section headings →
  `h2`, bold lead-in sub-labels (`Affiliates.`, `Performance of a contract:` …) → `<strong>`,
  `○`/bullet runs → real `<ul>`s, Privacy TOPICS index → 2-col `.legal-toc`, emails/URLs as
  links, Privacy shows "Last updated: 5 December 2018".
- **Wider reading layout** (`site/fm-legal.css`, shared): `.legal-wrap` 1040 → **1340px**,
  `.legal-sheet` 920 → **1140px**.
- **Homepage horizon background on the Legal pages**: all four (`legal.html` + 3 sub-pages) now
  load `scroll-horizon.js` (`data-horizon-mode="scroll"`), so the curved crest rises top→bottom
  on scroll and `signal-field.js` draws the ocean + mirrored reflection fleet (was the flat
  star-field fallback).
- **2× nodes & ships on Legal**: new `data-density` knob on the `#signal-field` canvas scales the
  node count, virtual fleet pool, and ship floor. Defaults to **1** (homepage et al. untouched);
  Legal pages set `data-density="2"`.

---

## 2026-06-17 · 404 background brought in line with the homepage

- `404.html` previously used only the flat static `.page-base` gradient (no living layer). Added the
  shared `#signal-field` canvas + `signal-field.js` — same setup as the homepage/site pages — so the
  background is the living constellation field instead of a dead gradient. No `scroll-horizon` (the
  page is a single centred viewport with nothing to scroll); matches the `platform.html` treatment.

---

## 2026-06-17 · Community → onship.com hand-off interstitial + onship placeholder logo

- **Community** nav item is no longer inert. It now carries an `interstitial` config in `fm-data.js`
  (`{ url:'https://onship.com', host:'onship.com', logo:'…/onship-logo-placeholder.png' }`) and
  renders as a clickable `nav-link` button in both the desktop nav and the mobile drawer.
- Clicking it opens a **glass interstitial** (reuses `.modal-scrim`/`.modal` chrome + new `.ois-*`
  styles in `fm-chrome.css`): onship logo, "Leaving FrontM" eyebrow, "You'll be taken to
  onship.com", and two actions — **Proceed** (anchor → `https://onship.com`, opens new tab) and
  **Go back** (closes). Esc + scrim-click + ✕ all dismiss. The overlay is built once by `fm.js` and
  appended to `<body>`, so it works on every page that loads the shared chrome — no per-page markup.
- **onship placeholder logo** — `assets/logos/onship/onship-logo-placeholder.png` (760×252).
  Derived from the FrontM mark rendered as a **blue (`#01B3F6`) outline only** + an "onship" wordmark
  in white. **Placeholder pending the real onship asset** from the client.

---

## 2026-06-17 · Resources nav dropdown + branded 404 page

- **Resources dropdown** added to the top nav, immediately **left of Company**. New NAV order:
  Home · Platform · Solutions · Community · **Resources** · Company. Data-driven via `fm-data.js`
  (same shape as Company/Solutions) → renders in both the desktop dropdown and the mobile drawer
  with no JS change. Items: **Blog** and **Newsletter**, both inert "Soon" placeholders (no `href`)
  — they auto-render with the existing `dd-soon`/`drawer-soon` "Soon" badge, same pattern as the
  unbuilt Solutions sub-items. Actual Blog + Newsletter pages come in the pages stage.
- **Branded 404** — new `deploy/404.html`, title "Page not found | FrontM". FrontM visual language:
  dark `--grad-page` shared background layer (`.page-base`, cheap/static — signal-field canvas
  intentionally omitted to keep it light), single centred `.glass` panel, brand-gradient "404",
  friendly copy, and two CTAs → **Back to Home** (`index.html`) + **Explore the Platform**
  (`platform.html`). Shared nav/drawer chrome (loads `fm-data.js` + `fm.js`); footer omitted.
  `noindex`. Reduced-motion safe (no heavy animation; reveal/marquee gating inherited from shared CSS).

---

## 2026-06-17 · Legal pages added (Legal landing + GDPR / Privacy / Terms)

- New pages: `legal.html` (landing — "Legal" heading, intro, 3 glass cards → GDPR / Privacy /
  Terms), `legal-gdpr.html`, `legal-privacy.html`, `legal-terms.html`.
- Content is **verbatim** from the supplied source files (no rewriting). Mapping: GDPR Policy →
  gdpr · Privacy Policy → privacy (shows "Last updated: 5 December 2018", the date stated in the
  file) · Terms & Conditions → terms (no date in source → none shown).
- Reading layout: one glass sheet, ~900px measure, line-height 1.65, dark bg + brand tokens via
  new shared `site/fm-legal.css`. Heading order h1 → h2 (numbered/roman sections) → bold lead-in
  sub-labels; `○` and TOPICS lists rendered as real `<ul>`s. **Footer omitted** (nav + content
  only). a11y: focusable cards, reduced-motion safe, fully readable with JS off (static content);
  indexable.
- Nav: appended `['Legal','legal.html']` to the Company dropdown in `fm-data.js` (after We Are
  Hiring) — renders in both the desktop dropdown and the mobile drawer. Not top-level.

---

## 2026-06-17 · Department explorer (S6) moved off homepage → Solutions ▸ By Department

- **Homepage stays the main page.** The S6 "One platform for the teams running today's fleets"
  department explorer (six teams: Crewing, Marine HR, HSQE, Technical, Operations, Digital
  Leaders) was **moved off `index.html`** to a new standalone page `solutions-by-department.html`.
- **New page** `deploy/solutions-by-department.html`: shared nav/footer/demo-modal chrome; the
  explorer section verbatim (same `.fn-explorer` / `#fn-rail` / `#fn-detail` markup, same segue
  line). Loads `fm-data.js · signal-field.js · fm-platform.js · fm-rebuild.js · fm.js` (the set
  the explorer needs; omits homepage-only `fm-pflow.js` + `scroll-horizon.js`).
- **Nav wired**: `fm-data.js` NAV → Solutions ▸ By Department now carries
  `'solutions-by-department.html'` (was an inert "Soon" placeholder). The other three Solutions
  sub-items (By Module / By Industry / By Plan) remain "Soon".
- **No JS render change needed**: the S6 builder in `fm-rebuild.js` self-guards on the now-absent
  `#fn-rail`/`#fn-detail`, so it cleanly no-ops on the homepage and renders on the new page.
- Homepage section flow is now S5 (Buy/Build/Integrate) → S7 (Impact); the S6 slot carries a
  comment pointer to the new location.

---

## 2026-06-17 · deploy/ declared canonical — root homepage v2 + UXR fork retired

- **Source of truth resolved**: inspection confirmed `deploy/` is the current, complete build
  and root `FrontM Homepage v2.html` was the stale relic (old logo crop, pre-dropdown nav, dead
  UXR fork). `deploy/` is now the single canonical source; the `deploy/` ↔ root divergence is
  closed.
- **Archived (moved, not deleted)** → `archive/superseded/`:
  - `FrontM Homepage v2.html` → `archive/superseded/FrontM Homepage v2.html`. Static `site/` +
    `assets/` refs rewritten to `../../`; a small inline shim repoints the JS-injected asset
    paths (`fm-rebuild.js` wheel-hub mark, `fm.js` "Trusted by" marquee) up two levels so the
    relic still renders. No `<base>` tag (would break in-page hash nav). Renders clean, console 0.
  - Dead UXR fork + orphaned variants from root `site/` → `archive/superseded/site/`:
    `fm-uxr.css`, `fm-uxr.js`, `fm-data-uxr.js`, `fm-rebuild-uxr.js`, `fm-glass.css`, and the dev
    `fm-debug.js` overlay. All six were referenced by **no** page (confirmed via full grep).
- **Not moved** (verified still in use): `pflow-v3-narrative.html` + the live animation files it
  loads (`fm.css`, `fm-rebuild.*`, `fm-pflow.*`, `fm-data.js`); `site/fm-transition.js` (gated
  animation salvage source + loaded by the 4.3 archive); `site/hub-field.js` (loaded by the
  canonical Design System + Work Hub). All shared `site/` engine files stay in place.
- Indexed in `FrontM Archive.html` and the Control Dashboard (inventory row flipped to
  Superseded, archive-viewer relinked, "Source of truth" fact resolved, stale guardrail retired).
- **deploy/ build itself: untouched.** No pages built this pass.

---

## 2026-06-16 · Archive index — dead cards marked "removed"

- `FrontM Archive.html`: 12 lab files deleted in the earlier cleanup (Background Lab/Map,
  Finale Background Options, Glass Lab, Problem-Solution Versions, Ripple Options + v2, Pflow
  Timing Map, pflow-v2-atoms, Functions × Modules, Section 7 Options, Logo Wall Options) are now
  shown as disabled "removed" cards (dashed, greyed, link off) instead of live links that 404.
  Kept as a record; not recovered (per decision to let them go).
- Two surviving files relinked to their archived locations: Signature Transition 4.3 →
  `archive/ripple/` (asset paths rewritten `site/`→`../../site/`), Mobile Legibility Harness →
  `archive/qa/`. Group counts + footer note updated.
- Not touched: live build, canonical source, pflow-v3-narrative, directions/, Type Explorer,
  Build Audit, ripple-lab.

---

## 2026-06-16 · Platform hero entrance + transition polish

- **Hero entrance** (`deploy/platform.html` + `fm-rebuild.css`, root mirror): `.pf-arch-head`
  now cascades like the homepage — eyebrow → `h2` (`data-d=1`) → `p` (2) → CTA (3), each
  `.reveal` — with a richer **blur-in** (translateY 34px + blur 8px → clear, 0.95s). Same
  blur-in applied to the homepage hero (`.hero .reveal`, excluding the tuned h1 `.hero-scan`).
  Reduced-motion safe.
- **Top transition light** (`fm-platform.css`/`.js` + `platform.html`, root mirror): the lighter
  `--s-1` band at the stage top is now its own `.pf-toplight` element, faded out by JS as the
  heading docks (`opacity = 1 − dock`), so it no longer persists as a seam once "One platform…"
  is in. Removed the static `--s-1` layer from `.pf-stage`.
- **Floor/glow release fade pushed later**: `1 − smooth(0.965, 1, s)` (was `0.94`) so the 3D
  grid holds longer and only fully vanishes right before the stage hands off.

**Evidence**: hero children cascade with `.reveal`/`data-d`; `.pf-toplight` present; console
clean. Desktop ≥980px (dynamic stage) visual confirmation pending Chrome.

---

## 2026-06-16 · Platform hero — full-viewport, vertically centred

- `deploy/site/fm-rebuild.css` (+ root mirror) — `.pf-arch-head` is now a full-height hero:
  `min-height: calc(100vh - var(--nav-h))`, flex column centred (`align-items` / `justify-content:
  center`). The "Build once. Deploy across maritime." block now sits in the vertical centre of
  the first screen and fills it (was content-height with a top `--section-y` pad, sitting high
  with dead space below). Flows seamlessly into the `#platform` stage (transparent stage top
  from the prior seam fix).

**Evidence**: computed `display:flex`, `justify-content:center`, `min-height calc(100vh − nav)`;
content vertically centred; console clean.

---

## 2026-06-16 · Platform page — bottom seam fix (surface recedes on release)

The `#platform` → `.pf-arch-support` (Exchange) boundary had the same seam at the **bottom**:
`.pf-floor` (teal grid) + `.pf-floor-glow` (blue) hold at full opacity through the end of the
pin, so the assembled stage's coloured surface cut a hard edge against the plain next section
as the sticky stage released.

- `deploy/site/fm-platform.js` (+ root mirror) — floor + glow opacity now multiplied by a
  **release fade** `(1 - smooth(0.94, 1, s))`, so the surface recedes as the pinned stage hands
  off to the next section. Scrub-reversible. No coloured edge at the boundary.

**Evidence**: console clean. Desktop ≥980px (pinned stage active) visual confirmation pending Chrome.

---

## 2026-06-16 · Platform page — seam fix (pf-stage scrim retimed)

Follow-up: removing `scroll-horizon` alone didn't resolve the "two sections" look. The
root cause was the `.pf-stage` background — a `linear-gradient(180deg, var(--bg) 74%` at the
**top** …) dark scrim. The stage sticks to the top of the viewport, so its dark top edge
butted the lighter hero / page-base above it = the visible seam.

- `deploy/site/fm-platform.css` (+ root mirror) — `.pf-stage` background recut: the vertical
  scrim now starts **transparent at the top** (`transparent` 0→30%) and only deepens toward
  the bottom waterline; the deck legibility scrim is recentred (`radial 72% 56% at 50% 58%`)
  and ramps in from transparent so the stage top matches the hero. Top `--s-1` glow softened.

**Evidence**: computed `.pf-stage` linear layer now begins `rgba(0,0,0,0) 0%` (transparent
top); console clean. Desktop ≥980px (sticky stage active) visual confirmation pending Chrome.

---

## 2026-06-16 · Platform page — even background (scroll-horizon removed)

- `deploy/platform.html` — stopped loading `site/scroll-horizon.js`. On the Platform
  page the rising ocean/fleet horizon rendered as an **uneven curved band + bloom hotspot**
  in the gap between the hero (`.pf-arch-head`) and the `#platform` animation.
  `signal-field.js` gates the ocean on `window.__fmHorizon`, so with the script gone it
  falls back to an **even constellation field**; the `#platform` section keeps its own
  depth (`pf-floor` grid + `pf-floor-glow`). Horizon stays on the homepage (`index.html`)
  where the ocean/fleet metaphor belongs.

**Evidence**: no `.fm-horizon` element · `__fmHorizon` undefined · console clean ·
even background from hero → `#platform`.

---

## 2026-06-16 · Animation — module chips enlarged (combined pass, Design portion)

Source: approved Animation Source Map + Combined Build Spec. Design owns this pass;
Code is holding `fm-rebuild.js` / `fm-pflow.js` (no collision).

- `site/fm-rebuild.css` + deploy mirror — `.cw-mod` recut from a vertical chip (icon
  above name) to a **premium horizontal pill: icon LEFT, name RIGHT**, enlarged (46px
  chip, 12.5px label, glass bg + per-module accent border/glow). **Node centres
  preserved** — `.cw-node` keeps `translate(-50%,-50%)`, so the pill grows symmetrically
  around the same ring anchor and `assertGeometry` targets are unchanged. Narrow (<980px)
  override rescaled (38px chip).
- `fm-pflow.js` — **unchanged.** The face-on sink + ripple (~0.85s, exit-only, reversible,
  no rings, stays dark) is already production-on-spec (the shipped "W1+5" recipe = Ripple v2).
  Confirmed only.
- Canonical module colours (CARE `#18C95C` via `fm-data.js`) — unchanged.
- **WS2.3 cinematic diet NOT included** (Code's content) — Code rebases on top of this commit.

**Evidence**: row layout on all 8 modules · 0 pill overlaps at 924px · console clean.
**Pending Chirag Chrome ≥980px**: `__pflowQA.assertGeometry()` 20 nodes < 2px · scrub
forward/back (ripple un-fires) · `prefers-reduced-motion` static end-state.

---

## 2026-06-16 · Nav + font + logo (deploy build)

Source: Change Queue P1 (nav IA + logo) + Code-batch font check.

**Nav** (`deploy/site/fm-data.js`)
- Added top-level `Home → index.html` (first item).
- Converted `Solutions` from a link into a dropdown: **By Department · By Module ·
  By Industry · By Plan** (Plan = subscription / pricing). Sub-page destinations are
  empty — the Solutions PAGE is HELD (Change Queue item 04), so these render as inert
  "Soon" items, **not** broken `#` links (see fm.js + fm-chrome.css below).
- Learn remains OUT of the top nav (lives at `platform.html#learn`).
- Final top nav: **Home · Platform · Solutions ▾ · Community · Company ▾**.

**Inert dropdown items** (`deploy/site/fm.js`, `deploy/site/fm-chrome.css`)
- Dropdown + mobile-drawer builders now emit a non-navigating `<span class="dd-soon">`
  / `<span class="drawer-soon">` with a faint `Soon` tag when a menu item has no href,
  instead of `<a href="#">` (which jumped to top). New `.dd-soon` / `.drawer-soon` CSS.

**Body font** (`deploy/site/fm.css`)
- Body type swapped to **IBM Plex Sans** (non-condensed): `--sans: "IBM Plex Sans"`.
  Headings stay **IBM Plex Sans Condensed** (`--disp`, unchanged). Retired the
  `Hanken Grotesk` fallback; `@import` now loads IBM Plex Sans 400–700 + Plex Sans
  Condensed + JetBrains Mono. (Stat figures previously at weight 800 cap at 700 — Plex
  Sans has no 800.) Evidence: computed `<body>` font-family = `"IBM Plex Sans", …`.

**Logo** (assets + deploy markup)
- Cropped "Intelligent Collaboration. Anywhere." subtext from
  `frontm-logo-full-light-opt.png` (760×324 → 760×252) in root + deploy; full-res
  `frontm-logo-full-light.png` / `frontm-logo-full.png` (3030×1290 → 3030×1005) in root.
- Deploy `*.html` nav/footer `<img>` updated: `height="324"→"252"`, nav `alt` text
  dropped the now-removed tagline (→ `alt="FrontM"`). Display size unchanged
  (`.brand-lockup img { height: 60px }`).

**⚠ Root divergence (NOT touched this pass)** — root canonical `FrontM Homepage v2.html`
still uses the **mega-menu** nav schema (Platform/Product/Industries/Community/Company
with `menu.grid`), has **no Home item and no Solutions dropdown**, and its logo `<img>`
still declares `height="324"`. Reconcile root ↔ deploy nav + logo dims before the next
Design export so this pass isn't reverted.

**Evidence to clear**: Chrome — desktop + mobile nav shows Home · Platform · Solutions ▾
(4 inert items) · Community · Company ▾, Learn absent; computed body font = IBM Plex Sans;
logo renders without tagline, no layout shift; no console errors.

---

## 2026-06-15 · Prompt 02 — Homepage canonicalisation onto v2

Source: Change Queue P0. Goal: collapse the `FrontM Homepage v2.html` ↔
`Homepage v2 _ UXR.html` fork into one canonical homepage; fold the UXR copy +
the Code fixes; extract Platform; delete UXR.

**Canonical homepage**
- `FrontM Homepage v2.html` (root) is now the canonical source. `deploy/index.html`
  is its shipped mirror (identical template; the root file additionally keeps the
  out-of-flow **Archive board** of retired sections for design reference).
- **Platform extracted** — the three Platform sections (architecture intro, the
  scroll-driven 3D assembly `#platform`, architecture close) are gone from the
  homepage; they live on `platform.html`. Homepage flow is now
  Hero → Problem → Buy/Build/Integrate → Why Subscribe → Impact → Blogs →
  Testimonials → **Final CTA**.
- **UXR copy folded in** (tighter v4 wording): hero lede + "Explore Platform Plans"
  CTA; problem head ("Fragmented tools are holding modern fleets back"); approach
  ("One operating layer…"); Buy/Build ("Three ways in" + new lede); Why-Subscribe
  sub (adds Marine HR + digital leadership); Impact intro; two evidence-bridge lines.
- **S12 Final CTA band** added from UXR (slim conversion close).
- **Code fixes** retained from the deploy build: `1,500+` proof row with the
  `⚑ Pending verification` flag, hero clamp via shared CSS, SEO/OG/theme-color +
  favicon head, single demo modal.
- **Accessibility (from UXR)**: keyboard skip-link; `aria-label`s on nav toggle,
  blog + testimonial arrows; labelled (`for`/`id` + `autocomplete`) demo form;
  newsletter `nl-label` + consent line + live `nl-msg` region.
- **Scripts**: production set only — `fm-data.js`, `signal-field.js`,
  `fm-platform.js`, `fm-rebuild.js`, `fm-pflow.js`, `fm.js`, `scroll-horizon.js`.
  The `-uxr` forks and `fm-debug.js` / `fm-transition.js` are no longer loaded.
- **CSS**: `.fcta*`, `.newsletter .nl-*`, and `.skip-link` migrated from the
  retired `fm-uxr.css` into the production `site/fm-content.css` (root + deploy).

**Deleted**
- `Homepage v2 _ UXR.html` removed (fork collapsed).

**Open / deferred**
- `site/fm-data-uxr.js`, `fm-rebuild-uxr.js`, `fm-uxr.js`, `fm-uxr.css` are now
  orphaned. Left in place because `fm-data-uxr.js` still holds UXR refinements to
  the **rendered** sections (track `Best-for` lines, tighter module/track copy)
  that were NOT merged into the production `fm-data.js`/`fm-rebuild.js` this pass.
  Reconcile in a follow-up, then delete.
- **Venkat verification call**: the homepage keeps the live numbers
  (`$52K+` friction stat, `1,500+ / 100K+ / 50+ / 30+` proof row) with the
  pending-verification flag, rather than UXR's "numbers held" fallback copy.
  One reconciliation decision remains for Venkat.

**Evidence to clear**: Chrome render of the homepage end-to-end (no Platform
section, Final CTA present); confirm UXR file gone; this file diff.

---

## 2026-06-15 · Prompt 01 — Learn out of top nav, into Platform

Source: Change Queue (15-Jun meetings + Platform deck slide 3). Decisions: fold
standalone Learn page into a Platform section; keep the existing walkthrough
poster in an upgraded laptop frame; place after the Exchange/Studio/Fabric block.

**Nav**
- `site/fm-data.js` — removed top-level `{ label: 'Learn', href: 'learn.html' }`.
  Top level is now **Platform · Solutions · Community · Company**. IA comment
  updated to note Learn lives at `platform.html#learn`.

**Platform page**
- `platform.html` — added a `#learn` section after the Platform architecture
  close (`.pf-arch-support`), before the page's closing CTA, per deck order:
  architecture → build/deploy → Exchange/Studio/Fabric → **Learn** → (Already
  Built / What can we build — pending P1).
  - Two-column: copy + stats + CTAs (Open learn.frontm.ai / Browse curriculum)
    alongside an upgraded laptop device frame showing
    `assets/learn-walkthrough-poster.png`.
  - Condensed 3-section / 16-module curriculum grid carried over from the old
    page so no content is lost in the fold.
  - Styles are a scoped `<style>` block in the page head (`.pf-learn*`,
    `.lc-*`); no shared stylesheet touched.

**Retired page**
- `learn.html` — replaced full page with a redirect stub
  (`meta refresh` + `location.replace` + `noindex`) → `platform.html#learn`.
  Footer "Learn" links elsewhere already pointed at `#`/overview; the only
  `learn.html` references were the nav (removed) and this page itself.

**Asset**
- `assets/learn-walkthrough-poster.png` reused as-is. Pending: swap for the
  recorded walkthrough GIF when delivered (Chirag).

**Evidence to clear**: Chrome nav check — Learn gone from top bar; screenshot of
the new `#learn` section on platform.html; this file diff.
