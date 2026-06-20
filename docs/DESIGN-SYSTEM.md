# FrontM Web Design System
**Draft v3 · 4 Jun 2026**

This is the source of truth for `site/fm.css`.
When code and this doc disagree, the doc wins — unless a decision is recorded below that explicitly flips that rule for a specific token.

Place this file at `/docs/DESIGN-SYSTEM.md` in the repo root.

---

## §1 Positioning

FrontM is a **crew welfare and engagement platform**, not a maritime ERP.

Correct module vocabulary: **Connect · Care · Engage · Inform · Entertain · Sailor Cart · eSIM · OnShip Mentorship**

Do not use ERP / PMS / QHSE / Procurement terminology anywhere on the site.

Positioning line: **AI-Native Maritime Operations Platform**

---

## §2 Brand identity

- **Display / heading typeface:** Instrument Serif (Roman, 400) — see §4
- **Body / UI typeface:** Hanken Grotesk (Google Fonts)
- **Logo pebble radius:** 8px (`rounded-[8px]`)
- **Narrative direction:** The Voyage — cinematic, follows one ship

---

## §3 Color — Colour System v3 (three-tier)

**Adopted 4 Jun 2026 (Option 2 — doc-leads).** This section is rebased on the **Colour System v3 Reference** (`uploads/FrontM Colors Reference.html`), the single canonical source for every colour decision across web, product UI, marketing, and video. It supersedes the earlier flat token model. `site/fm.css` still ships the old flat tokens — those are tracked as **drift in §11** and will be migrated section by section. Until then, this doc describes the **target**, not the current code.

### §3.0 Architecture — three tiers

| Tier | What | Rule |
|------|------|------|
| **1 · Primitives** | 10 ramps × 10 stops (`--graphite-50 … --alert-900`) | The bedrock. **Never referenced directly in component code** — only when defining Tier-2/semantic tokens. Enables theming + rebasing. |
| **2 · Surfaces / ink / glass** | Dark ladder, ink scale, hairlines, glass | Named, mode-aware foundations built from Tier 1. |
| **3 · Gradients / glows / elevation** | Composite effects | Built from Tier 1 + 2. |
| **Semantic** | `--color-*` intent tokens | What components actually consume. Describe **purpose, not colour**; switch automatically light/dark. |

**Golden rule:** components reference **semantic** tokens (`--color-text-primary`), never primitives (`--graphite-900`). Logo hexes (§3.9) never appear in UI code.

---

### §3.1 Tier 1 — Primitive ramps

Ten ramps, ten stops each (50 = lightest → 900 = darkest). The **brand anchor** is the stop used in logos / high-visibility UI.

| Ramp | Role | Brand anchor | 50 → 900 |
|------|------|-------------|----------|
| **Operational Graphite** | neutrals · text · surfaces · borders · Manage | 500 | `#F7F8FB` `#EEF0F5` `#DDE1EB` `#C4CAD8` `#9AA1B4` `#6E7689` `#525A6E` `#3B4253` `#272D3B` `#161A24` |
| **Voyage Violet** | product layer · primary · focus | 500 | `#F1EEFF` `#E5E0FF` `#CFC6FF` `#B7AFFF` `#9A86FF` `#6B5FD9` `#5A4EC8` `#493CB6` `#372C8E` `#241B5E` |
| **Signal Blue** | Connect · links · live data | 400 | `#E6F7FF` `#C7ECFE` `#8FD8FB` `#4CC4F8` `#01B3F6` `#0090CC` `#0077A8` `#0A5C82` `#0E4A68` `#0E3247` |
| **Crew Green** | Care · success · wellbeing | 400 | `#E6F7EF` `#C5EFD8` `#92E0B6` `#5BD98B` `#18C95C` `#0F9B45` `#057029` `#0A5A24` `#0B441D` `#082C13` |
| **Reef Lime** | Engage · community | — | `#ECFBEA` `#D6F5D2` `#AEEAA6` `#7FD974` `#4DC243` `#3CAD33` `#2E8C27` `#27701F` `#1F5419` `#143810` |
| **Beacon Amber** | Inform · warning · highlight | 400 | `#FFF7D6` `#FFEFAE` `#FFE16B` `#FFD22E` `#FFC500` `#D99F00` `#A77100` `#8A5B00` `#6B4500` `#472D00` |
| **Cargo Orange** | Entertain · callouts · campaign | 400 | `#FFF0E6` `#FFDCC4` `#FFB98C` `#FF8F4D` `#FF6A04` `#D9550A` `#B94700` `#963700` `#732A00` `#4D1C00` |
| **Depth Indigo** | Info · eSIM · status | — | `#EAF0FF` `#D3E0FF` `#A9C2FF` `#7799FF` `#4F6BF0` `#2457D6` `#1C46AE` `#173A8E` `#122C6B` `#0C1D47` |
| **Anchor Steel** | interactive borders · input states | — | `#EDF2F7` `#D7E1EC` `#B4C4D6` `#85A0B8` `#5E7E9C` `#4D6B86` `#3C5670` `#2F4459` `#23323F` `#172029` |
| **Alert Red** | error · destructive | — | `#FDEAEA` `#FAD1D1` `#F4A8A8` `#EC7676` `#E04545` `#C93434` `#A92626` `#8A1F1F` `#681818` `#451010` |

---

### §3.2 Tier 2 — Dark surface ladder

Six named steps, each lighter than the one below. Never skip steps — graduation creates spatial hierarchy without borders.

| Token | Value | Role |
|-------|-------|------|
| `--abyss` | `#06071A` | Sunken / inset — input wells, code blocks |
| `--canvas` | `#0A0B1E` | Page base — the ground everything sits on |
| `--hull` | `#12152F` | Default card / panel / modal surface |
| `--deck` | `#1A1E3D` | Raised card (always pair with `--elev`) |
| `--bridge` | `#23284E` | Overlay — dialogs, drawers, sheets |
| `--helm` | `#2C3160` | Highest — floating panels, tooltips |

> Darkest brand value is `--abyss` `#06071A`. **Never use pure black `#000`** — off-brand.

---

### §3.3 Tier 2 — Ink scale & hairlines

| Token | Value | Role | A11y on `--canvas` |
|-------|-------|------|------|
| `--ink` | `#FFFFFF` | Headings, primary copy | AAA |
| `--ink-2` | `#D6DAEA` | Secondary — sub-labels, descriptions | AA |
| `--ink-3` | `#AEB5C9` | Tertiary — captions, timestamps | AA |
| `--ink-4` | `#8A92A8` | Muted — disabled & placeholders only | — |
| `--line` | `rgba(255,255,255,0.10)` | Hairline — dividers, default card edges |
| `--line-2` | `rgba(255,255,255,0.18)` | Border — prominent / elevated strokes |

> Highlights cap at `#D6DAEA`; let `--signal-400` be the brightest accent point.

---

### §3.4 Tier 2 — Glass system

Every glass panel pairs a **fill + border + blur**, plus a composite shadow when elevated.

**Dark glass — weight scale:** `--glass-dk-thin` `rgba(255,255,255,.04)` (ghost) · `--glass-dk` `.07` (default) · `--glass-dk-medium` `.11` (hover/active) · `--glass-dk-heavy` `.17` (elevated).
**Light glass:** `--glass-lt-thin` `rgba(255,255,255,.60)` · `--glass-lt` `.80` · `--glass-lt-heavy` `.92`.
**Borders:** `--glass-dk-border` `rgba(255,255,255,.10)` · `--glass-dk-border-strong` `.20` · `--glass-lt-border` `rgba(107,95,217,.16)` · `--glass-lt-border-strong` `.28`.
**Chromatic tints:** `--glass-voyage` `rgba(107,95,217,.15)` · `--glass-signal` `rgba(1,179,246,.10)` · `--glass-crew` `rgba(24,201,92,.09)` · `--glass-beacon` `rgba(255,197,0,.08)` — always paired with `--glass-dk-border`.
**Blur levels:** `--glass-blur-sm` `8px` (hint) · `--glass-blur` `24px` (standard product glass) · `--glass-blur-heavy` `56px` (deep frost / hero).
**Shadows:** `--glass-dk-shadow` `0 8px 32px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.16)` · `--glass-lt-shadow` `0 8px 32px rgba(26,24,48,.14), inset 0 1px 0 rgba(255,255,255,.90)`.

---

### §3.5 Tier 3 — Gradients, glows, elevation

| Token | Construction | Use |
|-------|-------------|-----|
| `--gradient-spectrum` | `linear-gradient(90deg,#01B3F6,#18C95C,#FFC500,#FF6A04)` | Bars, accent lines, accent words — **never body text** |
| `--gradient-operational` | `linear-gradient(160deg,#0A0B1E,#141A3A,#1F2A55)` | Dark cinematic — the default backdrop |
| `--gradient-intelligence` | `linear-gradient(120deg,#01B3F6,#4F6BF0,#9A86FF)` | AI / smart-feature visuals |
| `--glow-voyage` / `-signal` / `-crew` | `0 0 26px rgba(…,0.40–0.45)` | Ambient depth on violet / blue / green |
| `--elev` | `inset 0 1px 0 rgba(255,255,255,.06), 0 18px 44px rgba(0,0,0,.55)` | Raised-surface depth (top-light + deep shadow) |

---

### §3.6 Core identity — six colours, one voice

| Colour | Value | Token | Role |
|--------|-------|-------|------|
| **Operational Navy** | `#0A0B1E` | `--color-bg-canvas` | The deep canvas the whole product composes on |
| **Voyage Violet** | `#6B5FD9` | `voyage.500` | Product layer — primary actions, focus, selection |
| **Signal Blue** | `#01B3F6` | `signal.400` | Connect, links, live data, active indicators |
| **Crew Green** | `#18C95C` | `crew.400` | Care, wellbeing, success, completion |
| **Beacon Amber** | `#FFC500` | `beacon.400` | Inform, attention, markers, highlights |
| **Cargo Orange** | `#FF6A04` | `cargo.400` | Entertain, callouts, campaign accents |

---

### §3.7 Module palettes (×9)

Each module owns a ramp + brand anchor. **accent** → pills, icon fills, active tabs. **text-safe** → coloured copy on white. **soft bg** → tinted section backgrounds on light.

| Module | Ramp | Accent | Text-safe | Soft bg | Purpose |
|--------|------|--------|-----------|---------|---------|
| **Connect** | Signal Blue 400 | `#01B3F6` | `#0077A8` | `#E6F7FF` | Ship-to-shore comms, messaging, links |
| **Care** | Crew Green 400 | `#18C95C` | `#057029` | `#E6F7EF` | Crew wellbeing, health, check-ins |
| **Engage** | Reef Lime 400 | `#4DC243` | `#2E8C27` | `#ECFBEA` | Community, learning, social |
| **Inform** | Beacon Amber 400 | `#FFC500` | `#8A5B00` | `#FFF7D6` | Notices, bulletins, announcements |
| **Entertain** | Cargo Orange 400 | `#FF6A04` | `#963700` | `#FFF0E6` | Media, content, recreation |
| **Sailor Cart** | Crew Green 500 | `#0F9B45` | `#0A5A24` | `#E6F7EF` | Onboard commerce, purchases |
| **eSIM** | Depth Indigo 400 | `#4F6BF0` | `#1C46AE` | `#EAF0FF` | Connectivity, data plans, Airalo |
| **OnShip Mentorship** | Voyage Violet 400 | `#9A86FF` | `#493CB6` | `#F1EEFF` | Peer learning, growth, skills |
| **Manage** | Graphite 500 | `#6E7689` | `#3B4253` | `#EEF0F5` | Platform admin, settings, ops |

> **Changed from old model:** `Engage` is now **Reef Lime `#4DC243`** (was the violet primary); **Train / Maintain** are dropped; **Sailor Cart, eSIM, OnShip Mentorship** added. Voyage Violet is the **product/primary layer**, not a module accent.

---

### §3.8 Semantic layer (light + dark)

Components reference these — never primitives. Each resolves per mode.

| Token | Light | Dark |
|-------|-------|------|
| `--color-bg-canvas` | graphite-50 `#F7F8FB` | `#0A0B1E` |
| `--color-bg-surface` | `#FFFFFF` | hull |
| `--color-bg-raised` | `#FFF` + `--elev` | deck |
| `--color-bg-sunken` | graphite-100 | abyss |
| `--color-bg-overlay` | — | bridge |
| `--color-text-primary` | graphite-900 | `#FFFFFF` (AAA) |
| `--color-text-secondary` | graphite-600 | ink-2 (AA) |
| `--color-text-tertiary` | graphite-500 | ink-3 (AA) |
| `--color-text-muted` | graphite-400 | ink-4 (disabled only) |
| `--color-text-link` | signal-700 | signal-400 |
| `--color-border-interactive` | steel-400 | steel-300 (3:1 min) |
| `--color-border-focus` | voyage-400 | voyage-400 |

**Feedback (semantic):** success → crew · warning → beacon · error → alert · info → signal. Never colour alone — pair with icon/label/shape.

---

### §3.9 Logo anchors — measured, kept separate

Six anchors extracted pixel-by-pixel from `FM-logo-no-text.png` (451×531). These are the **exact values inside the artwork** — source of truth for logo reproduction only (favicons, app icons, watermark bugs, brand-mark animations).

| Anchor | Hex | Nearest system token | Verdict |
|--------|-----|----------------------|---------|
| Sky Dot Blue | `#01ADFF` | signal-400 `#01B3F6` | harmonised |
| Signal Body (gradient) | `#0096DB → #00B2EE` | signal-500 → 400 | in family |
| Heritage Green | `#019934` | crew-500 `#0F9B45` | harmonised |
| Reef Lime | `≈#40AE33` | reef-500 `#3CAD33` | match |
| Gold (gradient) | `#FFB600 → #FFCC00` | beacon-400 `#FFC500` | exact (mid-gradient) |
| Flame Orange | `#FF6600` | cargo-400 `#FF6A04` | harmonised |

> **Rule:** Logo hexes **never** appear in component code or section backgrounds. "Logo green" outside the mark → `crew-500 #0F9B45` (UI) or `crew-400 #18C95C` (brand accent), never `#019934`.

---

### §3.10 Migration map — old flat tokens → v3

`site/fm.css` still uses the old flat names. Target mapping for the code migration tracked in §11:

| Old (`fm.css`, current) | v3 target |
|-------------------------|-----------|
| `--bg` | `--canvas` (same value `#0A0B1E`) |
| `--inset` | `--abyss` |
| `--s-1 / -2 / -3 / -4` | `--hull / --deck / --bridge / --helm` |
| `--heading / body / muted / subtle / faint` | `--ink / ink-2 / ink-3 / ink-4` (+ map `--faint` onto graphite) |
| `--line` `0.12` | `--line` `0.10` ⚠️ value change |
| `--line-strong` | not in v3 — fold into `--line-2` |
| `--b-*` spectrum | primitive ramp `*-400/500` brand anchors |
| `--m-engage` `#6B5FD9` | `--reef-400` `#4DC243` ⚠️ hue change |
| `--m-train`, `--m-maintain` | removed (modules dropped) |
| `--primary*` | `voyage.*` ramp |

---

## §4 Typography

**Display / heading family:** Instrument Serif (Google Fonts) — Roman (upright), weight 400 only.
**Body / UI family:** Hanken Grotesk (Google Fonts).

**Weights to load:** Instrument Serif 400 (roman + italic) · Hanken Grotesk 400 · 500 · 600 · 700 · 800.
Do not load Hanken 300 or 900 — weight 300 shimmers unacceptably on dark backgrounds.

```
@import url("https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Hanken+Grotesk:wght@400;500;600;700;800&display=swap");
```

### Scale

| Element | Family | Size | Weight | Tracking |
|---------|--------|------|--------|----------|
| H1 / Display | Instrument Serif | `clamp(2.8rem, 6vw, 5rem)` | 400 | 0 |
| H2 / Section | Instrument Serif | `clamp(2.1rem, 4vw, 3.2rem)` | 400 | 0 |
| H3 | Instrument Serif | `clamp(1.5rem, 2.4vw, 2rem)` | 400 | 0 |
| H4 | Hanken Grotesk | `1.125rem` (18px) | 600 | −0.01em |
| Body | Hanken Grotesk | `1rem` (16px) | 400 | 0 |
| Small / Caption | Hanken Grotesk | `0.875rem` (14px) | 400 | 0 |

**Heading rule:** H1–H3 are Instrument Serif Roman at weight 400 — the serif carries the emphasis, so do not bolden it. H4 and below switch to Hanken Grotesk. Body weight 800 is reserved for stat numbers and hero callout figures.

**Accent word:** a single emphasis word per heading may take the spectrum gradient (`.g-spectrum`), which shifts subtly and continuously (≈9s loop). One accent word per heading, never a whole line.

---

## §5 Spacing & layout

| Token | Value | Role |
|-------|-------|------|
| `--maxw` | `1200px` | Content max-width |
| `--nav-h` | `60px` | Nav bar height |
| `--section-y` | `clamp(104px, 10vh, 130px)` | Section vertical rhythm |

**Anchor offset:**
```css
[id] {
  scroll-margin-top: 80px;
}
```
This must be present in the global stylesheet, not only inline.

**Note on `--nav-h`:** Scroll-margin math site-wide is calibrated to 60px. If this changes, audit all `scroll-margin-top` values.

---

## §6 Border radius

| Token | Value | Role |
|-------|-------|------|
| `--r-xs` | `6px` | Chips, tags |
| `--r-sm` | `10px` | Buttons, small cards |
| `--r-md` | `14px` | Cards, inputs |
| `--r-lg` | `18px` | Large panels |
| `--r-xl` | `24px` | Hero panels, feature cards |
| `--r-pill` | `999px` | Full pill shape |
| `--r-circle` | `50%` | Avatars, circular badges |

**Code alias:** `--pill` currently exists in `fm.css`. Keep as a temporary alias pointing to `--r-pill`, then migrate usages and remove.

```css
--pill: var(--r-pill); /* alias — migrate and delete */
```

---

## §7 Components (spot-check spec)

### Button `.btn`

| Property | Value |
|----------|-------|
| Border radius | `--r-sm` |
| Font weight | 600 |
| Transition | `0.18s var(--ease-emphasized)` on background, color, border-color, transform, box-shadow |

### Card `.card`

| Property | Value |
|----------|-------|
| Background | `--s-1` |
| Border | `1px solid var(--line)` |
| Border radius | `--r-md` or `--r-lg` depending on context |

**Exception:** The solution glass panel uses `rounded-2xl` — do not convert to `--r-pill`. This is intentional.

### Focus ring (accessibility — required)

```css
:focus-visible {
  outline: 3px solid rgba(154, 134, 255, 0.22);
  outline-offset: 3px;
}
```

This must be present in the global stylesheet. It is an accessibility requirement, not optional.

---

## §8 Motion

| Token | Value | Role |
|-------|-------|------|
| `--ease-emphasized` | `cubic-bezier(.16, 1, .3, 1)` | All standard transitions |
| `--duration-standard` | `0.18s` | Default interaction timing |

**Code alias:** `--ease` currently exists in `fm.css`. Keep as a temporary alias, then migrate and remove.

```css
--ease: var(--ease-emphasized); /* alias — migrate and delete */
```

Reduced motion:
```css
@media (prefers-reduced-motion: reduce) {
  /* respect it — already in fm.css, keep intact */
}
```

---

## §9 Accessibility

- `:focus-visible` ring: see §7
- Colour contrast: all text tokens were chosen for WCAG AA compliance on the surface ladder
- `--primary-lift` (`#9A86FF`) achieves 6.7:1 on `--bg` (`#0A0B1E`) — do not lighten it
- Reduced motion: respected in all animations

---

## §10 Decisions log

| Date | Token | Decision |
|------|-------|----------|
| 4 Jun 2026 | `--b-indigo` | Promoted from code-only to spectrum spec. Sits between `--b-blue` and `--b-violet`. |
| 4 Jun 2026 | `--faint` | Promoted from code-only to §3.6 as fifth text step. |
| 4 Jun 2026 | `--deepest` | Removed. Not promoted. Delete from `fm.css`. |
| 4 Jun 2026 | `--primary-hover` | Confirmed as on-dark text/icon hover (lightens to `#B7AFFF`). Not a fill-hover token. |
| 4 Jun 2026 | `--section-y` / `--nav-h` | Doc wins. Code must be patched. Scroll-margin audit required after `--nav-h` change. |
| 4 Jun 2026 | `--m-maintain` | Doc wins: `#4F6BFF`. Code's `#435FE8` is `--b-indigo` and must not bleed into the module accent. |
| 4 Jun 2026 | Typeface | **Direction change (Option A):** display/headings move to **Instrument Serif** (Roman, 400); body/UI to **Hanken Grotesk**. Supersedes Figtree. Accent word takes the shifting `.g-spectrum` gradient. Adopted from Type Explorer pairing 01 and applied across Homepage v2. |
| 4 Jun 2026 | **Colour System v3** | **Architecture change (Option 2 — doc-leads):** §3 rebased on the Colour System v3 Reference — 3-tier tokens, 10 primitive ramps, named surface ladder (abyss…helm), ink scale, 17-token glass system, semantic light/dark layer, 9 module palettes, 6 measured logo anchors. Supersedes the flat token model. `fm.css` still ships flat tokens — tracked as drift in §11; code migrates section by section. |

---

## §11 Reconciliation — live audit

**Doc:** v3 (Colour System v3) · **Build:** Homepage v2 · **As of:** 4 Jun 2026

**Live tracker:** `FrontM Design System.html` (the interactive dashboard) is the source of record for reconciliation status. This table is a summary.

**Colour:** ~38% reconciled. Type, spacing, radius, motion and components are on-spec from the earlier reconciliation; the **entire colour layer is now mid-migration** because §3 was rebased on Colour System v3 while `fm.css` still ships the old flat tokens.

### §3 Colour — v3 migration status

The doc target is now **Colour System v3** (§3). `fm.css` ships the old flat tokens, so the colour layer is mid-migration. Summary by group:

| v3 group | Target | Code today (`fm.css`) | Status |
|----------|--------|------------------------|--------|
| Tier 1 — primitive ramps | 10 ramps × 10 stops (`--graphite-50…--alert-900`) | none — flat `--b-*` only | 🔧 Add |
| Surface ladder | `--abyss / canvas / hull / deck / bridge / helm` | `--inset / bg / s-1…s-4` (same values) | 🔧 Rename |
| Ink scale | `--ink / ink-2 / ink-3 / ink-4` | `--heading / body / muted / subtle / faint` | 🔧 Rename |
| Hairlines | `--line` `0.10`, `--line-2` `0.18` | `--line` `0.12`, `--line-2` `0.18`, `--line-strong` `0.28` | 🔧 Fix `--line`; drop `--line-strong` |
| Glass system | 17 tokens | none | 🔧 Add |
| Gradients / glows / elev | spectrum · operational · intelligence · glows · `--elev` | partial (`--grad-*`) | 🔧 Extend |
| Module palettes | 9 (incl. Reef-Lime Engage, Sailor Cart, eSIM, OnShip) | 8 (violet Engage, Train, Maintain) | 🔧 Re-map |
| Semantic layer | `--color-*` light + dark | none (flat values inline) | 🔧 Add |
| Logo anchors | 6 measured, kept separate | n/a | ✅ Documented |

> The interactive dashboard (`FrontM Design System.html`) tracks this group-by-group. Flip rows to ✅ as `fm.css` adopts each v3 group.

### §4 Typography

| Token | Spec | Status |
|-------|------|--------|
| Display family | Instrument Serif (Roman, 400) | ✅ Match |
| Body family | Hanken Grotesk | ✅ Match |
| Weights | Instrument 400 + Hanken 400–800 | ✅ Match |
| H1 | `clamp(2.8rem,6vw,5rem)` / 400 serif | ✅ Match |
| H2 | `clamp(2.1rem,4vw,3.2rem)` / 400 serif | ✅ Match |
| H3 | `clamp(1.5rem,2.4vw,2rem)` / 400 serif | ✅ Match |
| H4 | 18px / 600 Hanken | ✅ Match |
| Tracking | 0 (serif headings) | ✅ Match |
| Accent word | `.g-spectrum`, shifting gradient | ✅ Match |

### §5 Spacing & layout

| Token | Spec | Status |
|-------|------|--------|
| `--maxw` | `1200px` | ✅ Match |
| `--nav-h` | `60px` | 🔧 Fix: code has `68px` |
| `--section-y` | `clamp(104px,10vh,130px)` | 🔧 Fix: code range is wider |
| `scroll-margin-top` | `80px` on `[id]` | 🔧 Add: not in `fm.css` |

### §6 Border radius

| Token | Spec | Status |
|-------|------|--------|
| `--r-xs` | `6px` | ✅ Match |
| `--r-sm` | `10px` | ✅ Match |
| `--r-md` | `14px` | ✅ Match |
| `--r-lg` | `18px` | ✅ Match |
| `--r-xl` | `24px` | ✅ Match |
| `--r-pill` | `999px` | 🔧 Fix: code uses `--pill` not `--r-pill` — alias and rename |
| `--r-circle` | `50%` | 🔧 Add: missing from `fm.css` |

### §7 Components

| Token | Spec | Status |
|-------|------|--------|
| `.btn` radius | `--r-sm` | ✅ Match |
| `.btn` weight | 600 | ✅ Match |
| `.btn` transition | `0.18s` | 🔧 Fix: code uses `0.25s` |
| `.card` surface | `--s-1` | ✅ Match |
| `.card` border | `--line` (0.12) | 🔧 Fix: inherits from §3.7 |
| `:focus-visible` | `3px rgba(154,134,255,0.22)` | 🔧 Add: not in `fm.css` |

### §8 Motion

| Token | Spec | Status |
|-------|------|--------|
| `--ease-emphasized` | `cubic-bezier(.16,1,.3,1)` | 🔧 Fix: code uses `--ease` — alias |
| `--duration-standard` | `0.18s` | 🔧 Fix: code uses `0.25s` on buttons |
| Reduced motion | Respected | ✅ Match |

---

## §12 How to keep this current

When you change a value in `site/fm.css` or in this doc:

1. Find the matching row in §11
2. Flip its status to `✅ Match` or back to `🔧 Fix`
3. If you're adding a net-new token, add a row to the relevant section and a decision log entry in §10

**The goal is all ✅ in §11.** When that is true, close the §11 reconciliation item.
