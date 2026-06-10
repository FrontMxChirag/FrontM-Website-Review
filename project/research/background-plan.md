# Background Plan — Horizon reflection layer + fleet markers

Status: **PLAN — awaiting review before implementation.**
Scope: extend the global reactive background with an "earth zone" (ocean) below the curved horizon, holding a live reflection of the constellation plus drifting fleet markers.

---

## 0. Critical finding — the two backgrounds are NOT one system

The brief assumes a single canvas constellation that owns both the stars and the horizon. The code is two independent pieces:

| | `site/signal-field.js` | `site/scroll-horizon.js` |
|---|---|---|
| Medium | **Canvas** (`#signal-field`, z-index −1) | **CSS `<div>`** (`.fm-horizon`, z-index 3, `mix-blend-mode:screen`) |
| The "stars" | `nodes[]` — normalized `{x,y}` 0..1, drawn via `px(n)` (applies camera) | n/a |
| The "horizon line" | n/a | the **top border of a 260vw × 100vh ellipse** (`border-radius:50% 50% 0 0`) translated up/down |
| Loop | own rAF `tick()` | own rAF `frame()` |
| `horizonY(x)` | does not exist | does not exist — curve is implicit in CSS geometry |

So the reflection (which must mirror live stars through the curve, same frame, same data) **must be drawn on the signal-field canvas**, and it needs to know the horizon's current crest Y + curve shape, which currently only `scroll-horizon.js` knows.

**Proposed coordination (no new rAF loop, no duplicate physics):**
`scroll-horizon.js` publishes its live geometry each frame on a shared object; `signal-field.js` reads it inside its existing `tick()` and renders the ocean. The horizon line stays the CSS div on top (z-index already puts it above the canvas, satisfying "horizon line on top").

```
window.__fmHorizon = {
  crestY,        // smoothed crest Y in CSS px (viewport coords) — from scroll-horizon compute()/frame()
  opacity,       // current horizon opacity (for fading the ocean with it)
  yAt(xPx)       // horizonY(x): crestY + 0.5*vh*(1 - sqrt(1 - (u/(1.3*vw))^2)), u = xPx - vw/2
};
```

`yAt(x)` is derived to match the CSS ellipse exactly: semi-axes a = 1.3·vw (half of 260vw), b = 0.5·vh; crest at viewport-center, dropping ~3.85vh by the viewport edges (the gentle wide curve you already see).

---

## The four required answers

1. **Where `horizonY(x)` comes from:** newly derived from the CSS ellipse geometry and exposed as `window.__fmHorizon.yAt(x)` by `scroll-horizon.js`. Single source of truth for the curve; `signal-field.js` consumes it. Falls back to "below viewport / no ocean" if the horizon script hasn't published yet.

2. **Where the live star position array lives:** `signal-field.js` → `nodes[]` (normalized), converted to screen px by `px(n)` (already camera-aware). The reflection pass reuses this exact array in the same frame — zero duplicate simulation.

3. **Where scroll → horizon mapping happens:** `scroll-horizon.js` → `compute()`, line `tgtY = (1 - p) * vh - p * (vh * 0.06)`. We remap the **end bound** only (see §1 below) and add a per-page mode.

4. **Where the reflection pass slots into render order:** inside `signal-field.js` `tick()`. New on-canvas order:
   ```
   clear
   cursor glow (faint, full-screen)            ← existing
   clip BELOW curve:
     earth-zone gradient
     reflected connection lines (dimmer)
     reflected stars (0.4 alpha, 0.7× r, wave)
     fleet markers + sonar pings
   clip ABOVE curve:
     proximity mesh + nodes + pulses           ← existing, now clipped to "sky"
   (horizon line = CSS div, drawn on top via z-index 3)
   ```

---

## 1. Horizon travel bounds (+ per-page mode)

Current: bottom (p=0) → ~6vh past the top (p=1). New:
- **Homepage (`data-horizon-mode="scroll"`):** p=0 → crest at viewport bottom (`vh`); p=1 → crest rests at **20% from top** (`0.2*vh`), never higher. Keep existing easing/smoothing; change only the end bound.
- **All other pages (default, fixed):** crest pinned at the resting position `0.2*vh` always; earth zone + reflection + ships fully active regardless of scroll.

Mode comes from a `data-horizon-mode` attr on the `<script>` tag (default = fixed). Homepage's include gets `data-horizon-mode="scroll"`.

## 2. Constellation density
`buildNodes()` density divisor halved (`/34000 → /68000`, and the narrow `/46000 → /92000`; caps scaled too). All drift/connect/interaction unchanged — fewer points only.

## 3. Reflection layer
Derived render pass (see render order). Mirror in **screen space**: `ry = yAt(sx) + (yAt(sx) - sy)`; lines mirror each endpoint through its own x. Stars 0.4 alpha / 0.7× r; lines dimmer. Wave: `rx = sx + sin(ry*k + t)*1.2`. Clipped to below the curve; skip off-viewport.

## 4. Earth-zone gradient
Vertical fill below the curve: from `--bg` at the horizon → a deeper navy (e.g. `#05060F`, not black) at viewport bottom. Reads as depth. Drawn first in the below-curve clip.

## 5. Fleet markers (6–9)
Small vessel silhouette (~10–12px, pointed bow, rotated to heading) on its own sonar ring (expanding ~20px, fading, ~3s, staggered phases). Constellation colour family, slightly brighter than reflection. Very slow drift along heading; wrap at zone edges. Fade in only when earth-zone height > ~120px; fade out as horizon descends.

## 6. Performance & a11y
- All new drawing in signal-field's existing `tick()` — no new loop.
- Reflection reuses computed positions — no extra physics.
- `prefers-reduced-motion`: freeze sonar, wave, ship drift; keep static reflection + gradient.
- Mobile: if perf drops, drop **reflected lines** before reflected stars.

---

## OPEN QUESTIONS FOR REVIEW

1. **"All other pages … with earth zone, reflection, and ships fully active" — scope conflict.** The reflection needs the constellation's `nodes[]`, but Type Explorer / Platform / Work Hub load `scroll-horizon.js` **without** `signal-field.js` (Work Hub has its own `hub-field.js`). To make the ocean truly active on those pages, the unified constellation+ocean has to **run there too** — i.e. add `signal-field.js` to them (and resolve the Work Hub `hub-field.js` overlap). Options:
   - **(A)** Make signal-field the single site-wide background: add it to all content pages in fixed-horizon mode; retire/merge `hub-field.js`. (Biggest change; truest to "site-wide".)
   - **(B)** This task = homepage + Background Lab only; roll the ocean out to other pages as a follow-up once the hub-field overlap is decided.
   - **Recommendation: B now, A as a tracked follow-up.** Confirm.

2. **Clip the upper constellation to "sky" (above the curve)?** I propose yes — stars render only above the horizon, reflections only below — for a clean sea-meets-sky read. Alternative: stars stay full-screen and reflections layer under. Confirm the clip.

3. **Hero camera-zoom** (homepage, zooms into a star) coexisting with the ocean: keep, or suppress once an earth zone is present? Proposed: keep but skip a zoom if the chosen star sits in the ocean band.

4. **Resting height:** brief says "~20% from top." Confirm 20% (`0.2*vh`) is the number for both the homepage end-bound and the fixed position on other pages.

> Build 1 shipped: homepage scroll mode (20% rest), ocean = gradient + reflected dots + reflected mesh + standalone 6–9 fleet w/ per-ship sonar; camera-zoom kept (underwater-skip); pulses kept. Background Lab tabs added. Type Explorer/Platform/Work Hub NOT wired. — superseded by Rework v2 below.

---

# REWORK v2 — fleet-reflection, caustics, glade glow, camera removal

Status: **PLAN — awaiting review. No code yet.** Reference photo = water caustics for *understanding only*, not to replicate; target weight = **as subtle as the sky proximity-mesh lines** (alpha ceiling ≈ the mesh's ~0.13, caustics likely lower ~0.06–0.10).

## (1) Full deletion list
- **Camera zoom + slow-mo (signal-field.js):** remove `cam.tx/ty/tz` zoom targeting, the `idle→in→hold→out` state machine, `zoomNode/zoomT/zoomState/lastZoom`, the underwater-star skip, `heroEl`/`heroInView` + its IntersectionObserver, and `showStatus()`/`statusCard` driving. Camera fixed at `x=.5,y=.5,z=1`; one constant time scale, every page. (Dissolves the "pages without `.hero`" TODO.) — *Open: the `#field-status` call-out card was only surfaced by the zoom; with zoom gone it never shows. Plan: stop toggling it (leave element inert). Confirm if it should be removed from markup too.*
- **Sky signal pulses (signal-field.js):** remove `pulses[]`, `spawnPulse()`, `bezier()`, and the pulse draw/trail block. Sky keeps **drifting stars + proximity mesh only**.
- **Reflected dots (signal-field.js):** remove the reflected-star dot pass (the `0.4 alpha / 0.7×` mirrored dots).
- **Reflected mesh (signal-field.js):** remove the below-horizon reflected connection-line pass entirely.
- **Standalone fleet (signal-field.js):** remove `ships[]`, `initShips()`, the drift/band-bounce/edge-wrap/120px-fade-in logic, per-ship sonar, and the unused `WAVE` local in `drawShips`. The reflection-ships (below) replace it.

## (2) Exact additions to `window.__fmHorizon` (published by scroll-horizon.js)
Existing keys unchanged (`yAt, mode, rest, maxOp, crestY, opacity`). **Add three, updated every frame:**
- `bloomX` — smoothed bloom centre x in **CSS px** (eases toward cursor x; recentres on idle/leave; centered on touch).
- `bloomColor` — current palette-drift crest colour as an `'rgb(r,g,b)'` string (the value already computed for `--hz`).
- `bloomAlpha` — current breathing opacity (the `0.78±0.22` value already computed for the bloom).
signal-field reads these for the glade ripple (§7).

## (3) Caustic tile technique + per-frame cost
- **Bake once at init (and on resize):** render **2 seamless tiles** (~256×256 each) to offscreen canvases. Pattern = sum of a handful of low-freq sinusoids thresholded into a thin bright "cell-network" (cheap nested loop over the 256² **once**, via `ImageData`), tinted cool teal/blue from the ocean palette (`#1FE6D4`/`#01B3F6`), transparent elsewhere. No white.
- **Per frame (in the existing tick, below-curve clip):** `drawImage` the two tiles **stretched to cover the ocean rect**, with slow opposing drift offsets and a sine **cross-fade** between them; global alpha = caustic-ceiling × `oceanAlpha`, and an extra vertical fade so it only blooms just under the crest and thins with depth. **Cost: 2 `drawImage` calls/frame** (+ the clip already built). No procedural math, no `ctx.filter` in the loop.
- Reduced-motion: freeze drift/cross-fade (draw one tile static). Mobile: **caustics dropped first**.

## (4) Clipping the bloom to above-line
- scroll-horizon's bloom currently lives inside `.fm-horizon` (the ocean ellipse) and pokes half above the crest. **Move the bloom into a new fixed clip wrapper** `.fm-bloom-clip` spanning `top:0 → height:crestY` with `overflow:hidden`; the bloom anchors to that wrapper's **bottom edge** (= the crest line) so only its upper half is visible. Update the wrapper height (and bloom x = `bloomX`) each frame. The thin bright **line core (`.fm-horizon::before`) stays on the crest unchanged**; only the soft breathing bloom is clipped to above-line. (Curve is near-flat at centre, so a straight horizontal clip at `crestY` reads correctly.)

## New below-horizon render order (signal-field ocean pass)
`gradient → caustics (§6) → ships + sonar (§3/§4) → glade ripple (§7, on top)`.

## Ships (reflection-as-fleet) — summary for review
Flag **every 2nd node at build time** (`i % 2`) as ship-bearer; only flagged nodes reflect, as the **~11px pointed-bow vessel glyph** at the mirrored position, **solid ≈0.9×oceanAlpha in the node's brand colour**, heading = **lerped** angle of mirrored drift, keeping the faint `sin(ry·0.018+t)·1.2px` x-sway. Unflagged stars have **no** reflection.

## Sonar — global scheduler
At most **2–3 rings active across the whole fleet**; on completion (~2.5–3.3s, ~20px, existing styling) a random currently-quiet ship starts one after a short random delay. Never all, never silent.

## Glade ripple (§7) — summary
Column under `bloomX`: broken **horizontal shimmer streaks**, widest/brightest just under the crest, dispersing/fading by ~top third of the ocean; streak x sways with the wave phase; colour = `bloomColor`, intensity breathes with `bloomAlpha`, all × `oceanAlpha`. Replaces the old below-line glow bleed.

## Rollout (LAST, after Lab verification)
Add `signal-field.js` to **Type Explorer** + **Platform Section** (fixed mode, no `data-horizon-mode`). **Work Hub: do not touch.**

## a11y / perf
No new rAF loops (caustics + glade in the existing tick). Mobile drop order: **caustics → glade**, ships+sonar stay. Reduced-motion: freeze sonar, wave sway, caustic drift, glade shimmer; bloom centered.

### One question before I build
The `#field-status` card (“Mooring update acknowledged”) was only ever shown by the now-deleted camera-zoom. Leave it inert in markup, or remove it from the homepage/Lab? (Everything else above I'll take as specified.)
