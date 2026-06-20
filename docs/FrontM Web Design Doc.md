# FrontM — Web Design & Dev Doc

> Single source of truth for how the FrontM website looks, behaves, and is built.
> This is **not** a company-wide brand book — it documents the website's design system only.
> New team members: start here, then read `ONBOARDING.md`.

**Status:** Draft v3 · **Owner:** Chirag · **Last updated:** 2 June 2026

> Colour (§3), type (§4) and the core components (§7) are **finalized and WCAG-validated**, dark-first.
> Values are the **target system** — a one-time reconciliation against the live build is still pending (§11). Fix code or doc when they disagree; never let them drift.

---

## 0 · How to use this doc

- **Tokens are the contract.** Every value here should map 1:1 to a CSS custom property in `globals.css` (`@theme inline`). If a value drifts in code, fix the code or fix the doc — never let them disagree.
- **Sections are independent.** Colour, type, spacing, radius, components, motion, and a11y can be read or edited in isolation.
- **What's intentionally left out:** build history, per-round change logs, and superseded experiments. Those live in the planning doc, not here. This file only describes the *current, correct* system.

---

## 1 · Stack & conventions

| Area | Choice |
|---|---|
| Framework | Next.js 16.x (App Router) |
| Styling | Tailwind **v4** — `@import "tailwindcss"` + `@theme inline` for tokens |
| Language | JavaScript (`.jsx`), no TypeScript |
| Components | `app/_components/` |
| Import alias | `@/*` → project root |
| Dev server | port `5000` |
| Data files | `app/_components/data/` (e.g. `partners.js`, `formspree.js`) |
| Static assets | `public/` (logos, images) |

**Conventions**
- One component per file; shared building blocks (`Nav`, `Footer`, `SectionLabel`, `Reveal`) imported, never duplicated.
- Design tokens via CSS variables; no hard-coded hex/px in components where a token exists.
- Animation lives in the component that owns it; global motion rules in `globals.css`.

---

## 2 · Brand & logo

The mark is two figures forming an **M**, built from the four brand-spectrum colours (blue, green, yellow, orange). Those four hues are the root of the entire colour system — the spectrum used across the site is derived from the logo, not invented separately.

### Lockups

| Lockup | File | Use |
|---|---|---|
| Full wordmark (colour) | `public/logo-full.png` | Default on light/neutral — footer, marketing |
| Mark only (colour) | `public/fm-logo-mark.png` | Tight spaces, favicons, ecosystem centre, app icons |
| **Full wordmark (white)** | `assets/fm-logo-full-white.png` | **Default on dark / coloured surfaces** (nav, dark hero) |
| **Mark only (white)** | `assets/fm-logo-mark-white.png` | White mono mark on dark / photos |
| Wordmark + tagline | `public/logo-with-tagline.png` _(to add)_ | Nav top-left primary placement |

### Usage rules
- **Dark-first:** since most of the site is dark, the **white** lockups are the primary on-screen logo. Colour lockups are for light/neutral surfaces.
- **Clear space:** padding around the mark equal to the height of one "head" circle.
- **Minimum size:** mark ≥ 24px; wordmark ≥ ~96px wide (legibility of "frontM").
- **Don't:** recolour, add effects, stretch, rotate, or place the wordmark on low-contrast backgrounds.
- The white versions are rasterized from source PNGs; for print or very large display, export white from the original vector.

---

## 3 · Colour system (vibrant, dark-first)

Three layers: **core operational** (surfaces, text, borders), **brand spectrum** (logo-derived identity & accents), **semantic** (product states only). The accents are tuned for vibrancy on the dark canvas — the two weak hues were lifted (purple → electric, green → emerald), the already-strong brand hues kept true.

Code references **roles**, not raw hex. Every accent has a *fill* (bright; takes dark text) and a *text-safe* value (for small text/icons). Using the wrong one is the most common contrast bug.

### 3.1 Surfaces — dark (primary mode)

| Token | Value | × vs base | Role |
|---|---|---|---|
| `--fm-bg-inset` | `#06071A` | 1.03 | Recessed wells, inputs, grooves |
| `--fm-bg` | `#0A0B1E` | 1.00 | Page / base surface |
| `--fm-surface-1` | `#12152F` | 1.09 | Cards on the page |
| `--fm-surface-2` | `#1A1E3D` | 1.20 | Raised cards, popovers |
| `--fm-surface-3` | `#23284E` | 1.38 | Modals, menus |
| `--fm-surface-4` | `#2C3160` | 1.59 | Highest surface / overlays |

**Elevation rule (dark):** depth = a **1px top inner-highlight**, not a shadow. `--fm-elev-1: inset 0 1px 0 rgba(255,255,255,0.06), 0 16px 40px rgba(0,0,0,0.5)`.

> Deprecated, migrate off: `#06081D`, `#08091C`, `#10122A`, `#11142B`, `#171B38`.

### 3.2 Primary (violet — product layer / Engage)

| Token | Value | Use |
|---|---|---|
| `--fm-primary` | `#6B5FD9` | Brand purple — fills, primary buttons (white text, 4.9:1) |
| `--fm-primary-on-dark` | `#9A86FF` | **Text/icons & accents on dark** (6.7:1) — electric, not pastel |
| `--fm-primary-hover` | `#B7AFFF` | Hover on dark |
| `--fm-primary-active` | `#493CB6` | Active / pressed (also text-safe on light) |
| `--fm-primary-bg` | `rgba(122,107,255,0.16)` | Container / tint on dark |
| `--fm-primary-soft` | `#EDE9FF` | Container on **light** only |

### 3.3 Brand spectrum

| Stop | Fill (dark UI) | Text-safe (light) | Notes |
|---|---|---|---|
| Blue (Connect) | `#01B3F6` | `#0077A8` | Links on dark, data lines |
| Aqua | `#1FE6D4` | _dark teal — TBD_ | Supporting accent (from teal action colour) |
| Green (Care) | `#18C95C` | `#057029` | **Emerald — lifted from `#079B33`** |
| Lime (Train) | `#3CAD33` | `#057029` | Secondary community accents |
| Yellow (Inform) | `#FFC500` | `#9A5B00` | Attention, markers |
| Orange (Entertain) | `#FF6A04` | `#B94700` | Callouts, campaigns |
| Slate (Manage) | `#404858` | `#1A1830` | Logo text, neutral anchors |

**Rules:** bright hues = fills, chart marks, large display — not small text on white. **Yellow & orange take dark navy text, never white.** On dark, blue/yellow/orange/emerald read fine as text; for purple use `--fm-primary-on-dark`.

### 3.4 Module accents

| Module | Fill | Text on dark | Container (dark) |
|---|---|---|---|
| Connect | `#01B3F6` | `#01B3F6` (8.1) | `rgba(1,179,246,0.14)` |
| Engage | `#6B5FD9` | `#9A86FF` (6.7) | `rgba(122,107,255,0.16)` |
| Care | `#18C95C` | `#18C95C` (8.8) | `rgba(24,201,92,0.14)` |
| Inform | `#FFC500` | `#FFC500` (12.3) | `rgba(255,197,0,0.13)` |
| Entertain | `#FF6A04` | `#FF6A04` (6.8) | `rgba(255,106,4,0.14)` |
| Train | `#3CAD33` | `#3CAD33` (6.7) | `rgba(60,173,51,0.14)` |
| Maintain | `#4F6BFF` | `#8CA0F5` (7.8) | `rgba(79,107,255,0.16)` |
| Manage | `#404858` | `#AEB5C9` (9.5) | `rgba(255,255,255,0.06)` |

> Engage = the primary violet. Manage's `#404858` fill takes white text but is invisible as text on dark — use its `#AEB5C9` text variant there.

### 3.5 Semantic states

Never rely on colour alone — pair with an icon, label, or shape.

**Dark (primary):**

| State | Text / icon | Background | Border |
|---|---|---|---|
| Success | `#34D399` (10.1) | `rgba(7,155,51,0.14)` | `rgba(7,155,51,0.42)` |
| Warning | `#FFC107` (11.9) | `rgba(255,197,0,0.12)` | `rgba(255,197,0,0.40)` |
| Error | `#FB7185` (7.2) | `rgba(201,52,52,0.16)` | `rgba(201,52,52,0.46)` |
| Info | `#38BDF8` (9.1) | `rgba(1,179,246,0.12)` | `rgba(1,179,246,0.38)` |

**Light (reading subset only):** Success `#0F7A4E`/`#E6F7EF`/`#8BD8B4` · Warning `#A15C00`/`#FFF3D8`/`#F1C36D` · Error `#C93434`/`#FDEAEA`/`#F0A2A2` · Info `#2457D6`/`#EAF0FF`/`#9CB6FF`.

### 3.6 Text — dark

| Token | Value | Use | Contrast on `--fm-bg` |
|---|---|---|---|
| `--fm-text` | `#FFFFFF` | Headings | 19.5:1 |
| `--fm-text-body` | `#D6DAEA` | Primary body | 14.0:1 |
| `--fm-text-muted` | `#AEB5C9` | Secondary | 9.5:1 |
| `--fm-text-subtle` | `#8A92A8` | Hints | 6.3:1 (4.8 on surface-4) |

Links on dark: `#01B3F6` or `--fm-primary-on-dark` `#9A86FF`. Optional: cap brightest text at `#F2F4FB` to reduce OLED halation.

### 3.7 Borders & glass — dark

`--fm-border-subtle: rgba(255,255,255,0.12)` · `--fm-border-default: rgba(255,255,255,0.18)` · `--fm-border-strong: rgba(255,255,255,0.28)`.

**Glass (one-off exception, use sparingly):** bg `rgba(255,255,255,0.08)` (strong `0.12`), border `rgba(255,255,255,0.18)` or brand `rgba(1,179,246,0.32)`, shadow `0 24px 80px rgba(0,0,0,0.42)`, blur `24px`. Default cards are **not** glass.

### 3.8 Light subset — reading surfaces only

Dark-first; light is scoped to long-form reading (blog/article, docs, legal, maybe pricing). _(Which sections stay light — see §11.)_ Page `#F7F6FF` · white `#FFFFFF` · soft `#F1EFFF` · heading `#1A1830` · body `#64687A` · subtle `#9CA3AF` · borders `#E8E6F0` / `#D8D3EA` / `#8A84B8`. Use text-safe accents (§3.3/3.4); yellow & orange take dark navy text.

### 3.9 Gradients

| Gradient | Stops | Use |
|---|---|---|
| Spectrum | `#01B3F6 → #18C95C → #FFC500 → #FF6A04` | Dividers, hero accent lines, diagrams, **display em-text only** |
| Blue intelligence | `#01B3F6 → #4F6BFF → #9A86FF` | AI, automation, data-movement visuals |
| Operational dark | `#0A0B1E → #141A3A → #1F2A55` | Hero / section backdrop wash |

### 3.10 Glow (dark-mode depth)

| Token | Value |
|---|---|
| `--fm-glow-violet` | `0 0 22px rgba(154,134,255,0.45)` |
| `--fm-glow-blue` | `0 0 22px rgba(1,179,246,0.45)` |
| `--fm-glow-aqua` | `0 0 22px rgba(31,230,212,0.45)` |

> Glow reads best on violet / blue / aqua. Warm-hue glows (orange/yellow) skew "alert" — reserve those for genuine alerts.

---

## 4 · Typography

**Family:** `Figtree` (variable, weights 400–800 loaded). Fallback: `system-ui, -apple-system, "Segoe UI", sans-serif`. Load via `next/font`.

### Type scale (tuned for Figtree, dark-first)

| Role | Size | Line-height | Weight | Tracking |
|---|---|---|---|---|
| Display / H1 | 46px | 1.1 | 700 | −0.02em |
| H2 / section | 34px | 1.15 | 700 | −0.01em |
| H3 | 24px | 1.25 | 600 | −0.01em |
| H4 / large label | 18px | 1.35 | 600 | 0 |
| Lead / intro | 18px | 1.5 | 400 | 0 |
| Body | 16px | 1.6 | 400 | 0 |
| Body small | 14px | 1.55 | 400 | 0 |
| Caption / meta | 13px | 1.45 | 500 | 0 |
| Overline / eyebrow | 12px | 1.4 | 600 | +0.12em, UPPERCASE |
| Stat number | clamp(48px → 80px) | 1.0 | 800 | −0.02em |

> H4 and Lead are both 18px on purpose — one's a 600 label, the other a 400 intro; weight separates them.

**Rules**
- **400 is the floor on dark** (never the 300 for body/small — thin strokes shimmer). 500 emphasis, 700 headings (600 = softer).
- **Tracking:** tighten display/H2 (−0.01 to −0.02em); open the overline (+0.12em).
- **Fluid display:** `clamp(2rem, 5vw, 2.875rem)` for H1.
- Spectrum gradient (§3.9) on display em-text only.

---

## 5 · Spacing & layout

### Breakpoints

| Name | Width | Notes |
|---|---|---|
| Mobile | ≤ 600px | Single column |
| Tablet | ≤ 900px | **Primary mobile breakpoint** |
| Small-desktop | ≤ 1024px | Carousels/grids may need an intermediate rule |
| Desktop | > 1024px | Full layout |

> Standardize new work to **900px**; add 600/1024 only where a component needs it.

### Section rhythm

Desktop sections 104–130px top/bottom; mobile (≤760px) 64/72px; footer (mobile) 56/64px. Dark scroll-choreography sections (hero, ecosystem) manage their own spacing.

### Grid & nav offset

Content max-width ~1200px, centered. Fixed nav height **60px**. `section[id], div[id] { scroll-margin-top: 80px }`. `html { scroll-behavior: smooth }`.

---

## 6 · Border radius

| Token | Value | Role |
|---|---|---|
| `--r-xs` | 6px | Chips, badges, tags |
| `--r-sm` | 10px | Buttons, inputs, small cards |
| `--r-md` | 14px | Standard cards |
| `--r-lg` | 18px | Large cards, glass, detail panels |
| `--r-xl` | 24px | Hero-scale tiles, feature containers |
| `--r-pill` | 999px | Pills, full-round buttons, tabs |
| `--r-circle` | 50% | Dots, avatars, icon circles |

**Exemptions (leave literal):** animated radii (ecosystem labels), device-frame realism (phone mockup), asymmetric/multi-value radii.

---

## 7 · Component standards

All values validated dark-first. States: **resting / hover / focus-visible / active / disabled / loading**.

### Buttons
Radius `--r-sm`, weight 600, transition `all 0.18s var(--ease-emphasized)`. Sizes: sm `7px 14px / 13px`, md `9px 18px / 14px`, lg `12px 24px / 15px`.

### Tags / pills
Container pattern: bg = module container tint, text = module text-on-dark, optional 6px dot in the accent. Radius `--r-pill`, 12px / 500.

### Focus ring
`:focus-visible` → 1px accent border + `box-shadow: 0 0 0 3px rgba(154,134,255,0.22)`. Never remove the outline.

### Inputs / forms
Input: bg `--fm-surface-1`, 1px `--fm-border-default`, radius `--r-sm`, 9×12px, text white, placeholder `#8A92A8`. Focus: border `--fm-primary-on-dark` + violet ring. Error: `--fm-error` border + ring. Label 12px muted above. _(checkbox / radio / select — TBD.)_

### Toggle
Track 40×22 pill. On = `--fm-primary` + `--fm-glow-violet`, white knob. Off = `rgba(255,255,255,0.14)`, `#AEB5C9` knob.

### Cards
`--fm-surface-1`, 1px `--fm-border-subtle`, `--r-md` (large → `--r-lg`), ~17px padding. Raised → `--fm-surface-2` + `--fm-elev-1` (top-light + deep shadow), no glow. Glass = exception only.

### Alerts / toasts
Banner: semantic tint bg + 1px tint border + `--r-sm`, icon + bold coloured label + body. One per state (§3.5). Always icon + colour.

### Stat block
Number clamp 48–80 / 800 / −0.02em / white; small-caps label 12px / 600 / +0.08em / muted; optional body detail. Reads top-down.

### Nav
Fixed 60px, transparent over hero. Auto dark/light text toggle by the section under it. Hover wash. Mixed anchors + routes. Primary CTA ("Book a demo") may carry a glow.

### Reveal
Shared scroll-in wrapper (fade + rise) via IntersectionObserver. Honours reduced-motion.

### DemoModal
Fields Name*, Work email*, Company*, Role, Fleet size, Message. Submit via Formspree → team inbox. States idle → submitting → success toast → error.

---

## 8 · Motion

**Signature pattern — scroll-scrubbed sticky reveals.** Hero, ecosystem, and platform sections pin and animate against smoothed scroll progress.

- **Easing:** `--ease-emphasized` for interactions; standard transitions ~0.18s.
- **Performance:** cap concurrent animated elements; pre-render glow sprites to offscreen canvases; gate heavy work to in-view only. 60fps on desktop **and** a real mid-range Android.
- One scroll clock drives both the choreography and nav colour.

---

## 9 · Accessibility baseline

- **Contrast:** body/link ≥ 4.5:1; large ≥ 3:1; check **hover states**.
- **Never colour alone** for state — pair with icon/label/shape.
- **Reduced motion:** `prefers-reduced-motion: reduce` respected everywhere — pinned sections show final state directly; timers/rAF stop; marquees freeze; modals still open.
- **Keyboard:** real `<button>`/`<a>`, visible `:focus-visible`, modals trap focus.
- **Anchors:** `scroll-margin-top: 80px`. **Forms:** labelled, clear validation, visible focus.

---

## 10 · Information architecture (candidate sitemap — ratify)

| Top-level | Pages |
|---|---|
| **Products** | Category pages (Connect & Engage, Care, Entertain, Inform, Edutain) + per-app (Drop Local, Spinnet, Emma AI, Loft Meeting, Seasurfer) |
| **Partners** | Build, Distribute, Dev Docs |
| **Community** | Why OnShip, Join OnShip |
| **Resources** | Case Studies, White-papers, Blogs, News |
| **About** | Team, Contact |
| **Legal** | GDPR, Terms, Privacy, Status |

Positioning: reconcile "One-Stop Digital Toolbox" → "AI-Native Maritime Operations Platform".

---

## 11 · Open items & still-to-cover

**Open:**
- [ ] **Reconcile against the live build** — run the design-system audit, paste real values back, align doc ↔ code. *Next action.*
- [ ] **Confirm which sections stay light** (§3.8); then validate the light subset.
- [ ] **Final logo exports** — vector white + wordmark-with-tagline; favicon / app-icon set.
- [ ] **Aqua text-safe-on-light** value (§3.3).

**Still to cover (not yet in this doc):**
- [ ] **Iconography** — library, line vs filled, stroke weight, sizing grid.
- [ ] **Spacing scale** — base 4/8 token set (`--space-*`) + grid columns/gutters.
- [ ] **Elevation & z-index ladder** — surfaces vs nav, modals, toasts, the signal-field canvas.
- [ ] **Motion tokens** — duration + easing scale.
- [ ] **Visual language** — the signal/constellation motif; imagery/photography treatment.
- [ ] **Forms (full)** — checkbox, radio, select, validation states.
- [ ] **UX writing** — voice & tone, capitalization, microcopy.
- [ ] **SEO / metadata** — titles, meta, OG images, favicon.
- [ ] **Performance budget** — LCP, bundle size, animation fps targets.
- [ ] **Data viz** — chart series colours (spectrum sequencing).

---

*End of Web Design & Dev Doc.*
