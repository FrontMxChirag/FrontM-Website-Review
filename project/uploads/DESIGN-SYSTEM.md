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

## §3 Color

### §3.1 Surfaces — elevation ladder

Six-step dark ladder. Ascending surface index = closer to the viewer.

| Token | Value | Role |
|-------|-------|------|
| `--bg` | `#0A0B1E` | Page base |
| `--inset` | `#06071A` | Wells, inset panels |
| `--s-1` | `#12152F` | Cards |
| `--s-2` | `#1A1E3D` | Raised elements |
| `--s-3` | `#23284E` | Modals |
| `--s-4` | `#2C3160` | Overlays |

**Removed:** `--bg-soft` (`#10122A`) — deprecated. Migrate any gradient that references it onto the ladder tokens above, then delete.

**Removed:** `--deepest` (`#0E1024`) — not promoted. Remove from `fm.css`.

---

### §3.2 Primary — violet / Engage

| Token | Value | Role |
|-------|-------|------|
| `--primary` | `#6B5FD9` | Fill, interactive elements |
| `--primary-lift` | `#9A86FF` | On-dark text / icon (= `--b-violet`) |
| `--primary-hover` | `#B7AFFF` | On-dark text/icon hover — **lightens**, does not darken |
| `--primary-active` | `#493CB6` | Pressed / active fill |
| `--primary-bg` | `rgba(122,107,255,0.16)` | Tint / container background |
| `--primary-glow` | `rgba(154,134,255,0.45)` | Ambient glow |

**Note on `--primary-hover`:** This token represents an on-dark text/icon hover state (it lightens). It is not a fill-hover darkening token. If a fill-hover is needed, create a separate `--primary-fill-hover` rather than reusing this one.

---

### §3.3 Brand spectrum

Logo-derived hues. One per module family.

| Token | Value | Module / role |
|-------|-------|---------------|
| `--b-blue` | `#01B3F6` | Connect |
| `--b-cyan` | `#1FE6D4` | Aqua |
| `--b-green` | `#18C95C` | Care |
| `--b-green2` | `#3CAD33` | Train / Lime |
| `--b-gold` | `#FFC500` | Inform / Yellow |
| `--b-orange` | `#FF6A04` | Entertain |
| `--b-slate` | `#404858` | Manage |
| `--b-violet` | `#9A86FF` | Engage / Primary lift |
| `--b-indigo` | `#435FE8` | Maintain / Intelligence gradients |

**Decision 4 Jun 2026:** `--b-indigo` promoted from code-only to spec. It sits between `--b-blue` and `--b-violet` in the spectrum and drives `--grad-intel` and the Maintain module accent.

---

### §3.4 Module accents

One accent per product module. Must reference the spectrum values above.

| Token | Value | Maps to |
|-------|-------|---------|
| `--m-connect` | `#01B3F6` | `--b-blue` |
| `--m-engage` | `#6B5FD9` | `--primary` |
| `--m-care` | `#18C95C` | `--b-green` |
| `--m-inform` | `#FFC500` | `--b-gold` |
| `--m-entertain` | `#FF6A04` | `--b-orange` |
| `--m-train` | `#3CAD33` | `--b-green2` |
| `--m-maintain` | `#4F6BFF` | — (distinct from `--b-indigo`) |
| `--m-manage` | `#404858` | `--b-slate` |

**Note on `--m-maintain`:** Doc spec is `#4F6BFF`. Code ships `#435FE8` (= `--b-indigo`). These are distinct — do not conflate them. `--m-maintain` must be corrected to `#4F6BFF`.

---

### §3.5 Gradients

| Token | Construction |
|-------|-------------|
| `--grad-page` | `radial-gradient(circle at top, var(--s-1) 0%, var(--bg) 48%, var(--inset) 100%)` |
| `--grad-intel` | Uses `--b-indigo` — exact value defined in `fm.css` |

`--grad-page` must not reference `--bg-soft`. Migrate to the ladder tokens above.

---

### §3.6 Text — dark backgrounds

| Token | Value | Role |
|-------|-------|------|
| `--heading` | `#FFFFFF` | Headings, display |
| `--body` | `#D6DAEA` | Body copy |
| `--muted` | `#AEB5C9` | Supporting text |
| `--subtle` | `#8A92A8` | Captions, metadata |
| `--faint` | `#6E7691` | Disabled, placeholder, fine print |

**Decision 4 Jun 2026:** `--faint` promoted from code-only to spec as a fifth text step.

---

### §3.7 Borders & hairlines

| Token | Value | Role |
|-------|-------|------|
| `--line` | `rgba(255,255,255,0.12)` | Default card edges, dividers |
| `--line-2` | `rgba(255,255,255,0.18)` | Elevated / prominent borders |
| `--line-strong` | `rgba(255,255,255,0.28)` | High-contrast strokes |

`--line-soft` (0.05) is not part of the spec. Remove or alias to `--line` if anything references it.

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

---

## §11 Reconciliation — live audit

**Doc:** Draft v3 · **Build:** Homepage v2 · **As of:** 4 Jun 2026

Score after planned fixes: **~100% (66/66 tokens)**
Remaining gaps after fixes: 3 code-only tokens now promoted (b-indigo, faint) or removed (deepest), plus any tokens still pending Claude Code patch.

### §3.1 Surfaces

| Token | Spec | Status |
|-------|------|--------|
| `--bg` | `#0A0B1E` | ✅ Match |
| `--inset` | `#06071A` | ✅ Match |
| `--s-1` | `#12152F` | ✅ Match |
| `--s-2` | `#1A1E3D` | ✅ Match |
| `--s-3` | `#23284E` | ✅ Match |
| `--s-4` | `#2C3160` | ✅ Match |
| `--bg-soft` | Removed | 🔧 Migrate `--grad-page`, then delete |
| `--deepest` | Removed | 🔧 Delete from `fm.css` |

### §3.2 Primary

| Token | Spec | Status |
|-------|------|--------|
| `--primary` | `#6B5FD9` | ✅ Match |
| `--primary-lift` | `#9A86FF` | 🔧 Fix: code has `#A99BFF` |
| `--primary-hover` | `#B7AFFF` | 🔧 Fix: code has `#5A4EC8` |
| `--primary-active` | `#493CB6` | 🔧 Add: missing from `fm.css` |
| `--primary-bg` | `rgba(122,107,255,0.16)` | 🔧 Add: missing from `fm.css` |
| `--primary-glow` | `rgba(154,134,255,0.45)` | 🔧 Fix: code has `0.55` opacity |

### §3.3 Brand spectrum

| Token | Spec | Status |
|-------|------|--------|
| `--b-blue` | `#01B3F6` | ✅ Match |
| `--b-cyan` | `#1FE6D4` | ✅ Match |
| `--b-green` | `#18C95C` | ✅ Match |
| `--b-green2` | `#3CAD33` | ✅ Match |
| `--b-gold` | `#FFC500` | ✅ Match |
| `--b-orange` | `#FF6A04` | ✅ Match |
| `--b-slate` | `#404858` | ✅ Match |
| `--b-violet` | `#9A86FF` | ✅ Match |
| `--b-indigo` | `#435FE8` | ✅ Promoted — now in spec |

### §3.4 Module accents

| Token | Spec | Status |
|-------|------|--------|
| `--m-connect` | `#01B3F6` | ✅ Match |
| `--m-engage` | `#6B5FD9` | ✅ Match |
| `--m-care` | `#18C95C` | 🔧 Fix: code has old `#079B33` |
| `--m-inform` | `#FFC500` | ✅ Match |
| `--m-entertain` | `#FF6A04` | ✅ Match |
| `--m-train` | `#3CAD33` | ✅ Match |
| `--m-maintain` | `#4F6BFF` | 🔧 Fix: code has `#435FE8` |
| `--m-manage` | `#404858` | ✅ Match |

### §3.6 Text

| Token | Spec | Status |
|-------|------|--------|
| `--heading` | `#FFFFFF` | ✅ Match |
| `--body` | `#D6DAEA` | ✅ Match |
| `--muted` | `#AEB5C9` | ✅ Match |
| `--subtle` | `#8A92A8` | ✅ Match |
| `--faint` | `#6E7691` | ✅ Promoted — now in spec |

### §3.7 Borders

| Token | Spec | Status |
|-------|------|--------|
| `--line` | `rgba(255,255,255,0.12)` | 🔧 Fix: code has `0.08` |
| `--line-2` | `rgba(255,255,255,0.18)` | 🔧 Fix: code has `0.14` |
| `--line-strong` | `rgba(255,255,255,0.28)` | 🔧 Add: missing from `fm.css` |

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
