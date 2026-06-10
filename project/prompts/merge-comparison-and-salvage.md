# MERGE COMPARISON & SALVAGE — approval gate before any code

Pre-build inventory requested before touching the live build. Compares the **retired
4.3 Signature Transition** (`site/fm-transition.js`, archived/inert), the **current
live pflow** (`site/fm-pflow.js` / `.css`), and the **merged target**. Nothing here
edits the live flow. Tasks 3–4 (Platform sync + tweaks) are **already shipped** — see §H.

Files inspected: `site/fm-transition.js`, `site/fm-pflow.js`, `site/fm-pflow.css`,
`site/fm-rebuild.js` (wheel render), `FrontM Homepage v2.html` (incl. the Archive
board markup for 4.3).

---

## A · AVAILABLE MECHANICS IN OLD 4.3 / `fm-transition.js`

| Mechanic | Present? | Where / how it works |
|---|---|---|
| **Ring build** | ✅ | `buildRing(MODS, R_IN=19vmin, 'mod', -90)` + `buildRing(STK, R_OUT=33vmin, 'stk', -90+15)` → real DOM nodes appended to `.t-net`, each with `ax/ay` (vmin ring target) + `sx/sy` (% scatter). Modules carry brand colour + label; stakeholders carry icon + label. |
| **Scattered dots** | ✅ | One `.t-dot` per ring node in `.t-dots-layer`, coloured to match, random `sx/sy` + drift phase. |
| **Gather-to-ring** | ✅ | `gather = smooth(0.78,0.95,p)`; each dot lerps `scatter → ringTarget`; `dotFade = 1 - smooth(0.84,0.95,p)` hides the dot as the DOM node blooms. (This IS "converge to wheel".) |
| **Glyph bloom** | ✅ | `gShow = smooth(0.84,0.93,p)`; `.fm-glyph-c` scales `0.4→1` + opacity; `--gnet` on `.t-net`. |
| **Node bloom** | ✅ | per-node `--g = smooth(0.86+delay, 0.97, p)`; modules first, stakeholders +0.04 delay. |
| **Connection / spoke draw-in** | ✅ | SVG `buildLines()`: centre→each module (blue `rgba(1,179,246,0.5)`), each module→2 nearest stakeholders (purple `rgba(154,134,255,0.4)`); drawn via `strokeDashoffset` over `lineDraw = smooth(0.86,0.97,p)`. |
| **Arriving / recovering pulses** | ✅ | `spawnArrive()` at `p>0.86`: pulse centre→module, colour blue→purple, **arrival `bloom()`**. The "recovering pulse" idea is already built. |
| **Failing pulses** | ✅ | `spawnFail()` `0.08<p<0.54`, colour orange→grey, fade — duplicate of pflow's. |
| **Bloom rings** | ✅ | `blooms[]` + `bloom(x,y)`: expanding stroked ring on pulse arrival. |
| **Cursor parallax** | ✅ | `pointermove` → `mtx/mty`, eased into `.t-parallax` translate (±26/18px). |
| **Cursor magnetism** | ✅ | per-frame nearest-dot-to-cursor follows the pointer (`tox/toy`, scale 1.8). Not isolated — runs inside the main canvas loop, needs `pointermove` + per-frame nearest search. |
| **Horizon / eclipse / sun** | ✅ | `.t-horizon` curved line handed off from a global `__fmHorizon` (`scroll-horizon.js`), plus a `.t-sun` eclipse riding the horizon at the cursor x. Belongs to the retired sky scene. |
| **Old two-card problem→solution copy** | ✅ | `.card-problem` ("Maritime operations remain **fragmented**…") slides left/shrinks; `.card-solution` ("FrontM is **changing** that." / "One maritime workflow at a time…") fades in, chrome dissolves, lone `h2` lifts to top. This exact copy is also frozen in the Archive board markup. |

---

## B · OLD vs CURRENT vs MERGED

| Mechanic / element | Old 4.3 transition | Current pflow (live) | Merged target | Verdict |
|---|---|---|---|---|
| Scroll clock `p` + `smooth()` | ✅ (`-r.top/total`) | ✅ identical | same | **KEEP** (pflow's) |
| Atom-split **mitosis** (3→46, parent `(i-1)>>1`) | ✗ (20 fixed dots) | ✅ | ✅ | **KEEP** |
| Chaotic wobble grows w/ problem | partial (drift) | ✅ | ✅, damps in HEAL | **KEEP + RE-TIME** |
| 5 friction cards one-by-one | ✗ | ✅ | ✅ | **RE-TIME** |
| `$52K` cost stat | ✗ | ✅ | ✅ | **RE-TIME** |
| Failing pulses (orange→grey) | ✅ | ✅ | ✅ (one impl) | **KEEP** pflow's / **DROP** old |
| Headline scan-in (clip wipe) | ✅ (`scanIn`) | ✅ (`scanIn`) | ✅ | **KEEP** pflow's / **DROP** old dup |
| Turn "FrontM is changing that." | ✅ (two-card) | ✅ (single block) | ✅ re-timed, hands off | **KEEP + CHANGE** (stop holding) |
| Approach eyebrow/heading/para | ✗ | static Section 3 | into the pin (HEAL) | **MOVE** |
| 8 outcomes inside the pin | ✗ | ✗ (static grid + IO) | ✅ scan-in on settling nodes | **NEW** |
| Ring build (8 mods + 12 stk DOM) | ✅ `buildRing` | wheel render in `fm-rebuild.js` | reuse native wheel | **LIFT logic / KEEP wheel** |
| Scatter dots paired to ring | ✅ | ✗ | ✅ | **LIFT** |
| Gather → ring/wheel | ✅ | ✗ (→centre, dissolves) | ✅ converge onto wheel coords | **LIFT** |
| Glyph bloom | ✅ | ✗ | ✅ | **LIFT** |
| Node bloom (mods→stk) | ✅ | wheel `.in` CSS scale-in | ✅ drive from `gather` | **LIFT + reconcile** |
| Connection/spoke draw-in | ✅ SVG | static `.cw-spokes` | optional richer draw-in | **LIFT (optional)** |
| Arriving pulses + bloom rings | ✅ | ✗ | ✅ ("recovering" cue) | **LIFT** |
| Two-card choreography | ✅ | ✗ | ✗ | **DROP** |
| Horizon / eclipse / sun | ✅ | ✗ | ✗ | **DROP** |
| Cursor parallax + magnetism | ✅ | ✗ | ✗ (skip; not cheap/isolated) | **DROP** |
| Static fallback | ✅ (problem) | ✅ (problem) | full story stack | **RE-TIME / EXTEND** |
| Retired `#transition` IDs | live in archive only | n/a | must stay inert | **DO NOT TOUCH** |

---

## C · SALVAGE MAP (per usable old mechanic)

> Target engine = `site/fm-pflow.js`. Port by **copying the math into pflow**, not by
> running `fm-transition.js` — it early-returns unless `#transition` exists, so it
> stays dormant. Lifted code must be re-pointed onto the **wheel `%`-of-square
> geometry** (see §G), not the old vmin system.

| # | Source (`fm-transition.js`) | Target (`fm-pflow.js`) | What changes | Depends on old IDs/classes? | Safe without reviving `#transition`? |
|---|---|---|---|---|---|
| 1 | `buildRing()` ring-target math (`ang`, `cos/sin`) | new `wheelTargets()` helper (§G) | Convert vmin radii → `%`-of-square (`rMod=33`, `rStk=45`, `+15°` stk). Output target coords per module/stakeholder. | No (just the loop math) | ✅ |
| 2 | scatter-dot pairing + `gather` lerp (`update()` dots loop) | pflow canvas FINALE branch | Map pflow's existing 46 nodes: 8 most-saturated → module coords, (opt) 12 → stk coords; lerp by `gather=smooth(0.84,1,p)`; fade the rest. | No | ✅ |
| 3 | glyph bloom (`gShow`) | drive `#cw-stage .cw-hub` opacity/scale | Replace standalone `.fm-glyph-c` with the **native wheel hub**; gate on `gather`. | Uses `.cw-hub` (current), not old `.fm-glyph-c` | ✅ |
| 4 | node bloom (`--g`, mods→stk delay) | toggle `#cw-stage.in` or per-node stagger | Reuse the wheel's existing `.in` scale-in CSS; trigger as `gather→1` instead of IntersectionObserver. | Uses current `.cw-node` | ✅ |
| 5 | arriving pulses + `bloom()` rings | pflow canvas HEAL/FINALE | Re-point endpoints to wheel coords; colour orange/grey→**green `#18C95C`** for "recovering". | No | ✅ |
| 6 | connection draw-in (`buildLines`, `strokeDashoffset`) | optional: animate `.cw-spokes line` | Convert px line endpoints to the `%` viewBox the wheel SVG already uses; draw-in on `gather`. | Uses current `.cw-spokes` | ✅ |
| 7 | `scanIn()` helper | already in pflow | None — pflow has an identical copy; **do not** import the old one. | — | ✅ |

---

## D · DO-NOT-PORT LIST

- **Two-card problem→solution choreography** (`.card-problem` / `.card-solution`,
  slide-left/shrink, chrome-dissolve, lone-h2 lift). Superseded by pflow's headline +
  turn + the new HEAL beat. Its copy stays frozen in the Archive board only.
- **Horizon / eclipse / sun scene** (`.t-horizon`, `.t-sun`, `__fmHorizon` handoff to
  `scroll-horizon.js`). Belongs to the retired sky; the merge uses the `signal-field`
  background. Porting it would re-introduce a global-coupling seam.
- **Cursor parallax + per-dot magnetism.** Not cheap or isolated (per-frame nearest
  search + `pointermove`); adds cost for a flourish the merge doesn't need.
- **Failing-pulse + `scanIn` duplicates** from the old file — pflow already has both.
- **Any retired `#transition` IDs/classes** (`.t-dots-layer`, `.t-net`, `.t-signal-canvas`,
  `.fm-glyph-c`, `#transition`). Never reintroduce these IDs into the live flow — the
  archived snapshot must stay un-initialisable. Port the **math**, author **fresh
  markup** bound to the existing `#problem-flow` + `#cw-stage`.

---

## E · GEOMETRY DECISION (Task 2)

| | Old transition | Current wheel (`fm-rebuild.js`) |
|---|---|---|
| Basis | **vmin** | **% of a square stage** |
| Module radius | `R_IN = 19vmin` | `rMod = 33%` |
| Stakeholder radius | `R_OUT = 33vmin` | `rStk = 45%` |
| Centre | `cx=0.5·W, cy=0.56·H` | `50% / 50%` (`.cw-stage`, `aspect-ratio:1`) |
| Module angle | `-90 + i·(360/8)` | `-90 + i·(360/8)` ✅ same |
| Stakeholder angle | `-90 + 15 + i·(360/12)` | `-90 + i·(360/12) + 15` ✅ same |
| Node coords | `cx + ax·vmin` | `50 + r·cos(a)` (% of square) |

- **Used by the homepage right now:** the **current wheel** (`#cw-stage` in
  `fm-rebuild.js`). The old vmin system is dormant.
- **Angle conventions already match** (both start at -90°, stk +15°) — only the
  radius **basis** differs (vmin vs %-of-square).
- **Recommendation (confirms your default):** **current wheel `%`-of-square is the
  single source of truth.** It's what users see, it's resolution-independent within
  the square, and it avoids the old vmin/centre-0.56 offset.

**Shared helper to create** (in `fm-rebuild.js`, exported on `FM`, consumed by both
the wheel render and the pflow converge):

```js
// FM.wheelGeometry() → canonical, %-of-square targets used by BOTH the DOM wheel
// bloom and the canvas convergence, so they line up pixel-for-pixel.
FM.wheelGeometry = function () {
  var DEG = Math.PI / 180, rMod = 33, rStk = 45;
  var mods = FM.MODULES.map(function (m, i) {
    var a = (-90 + i * (360 / FM.MODULES.length)) * DEG;
    return { id: m.id, color: m.color, x: 50 + rMod * Math.cos(a), y: 50 + rMod * Math.sin(a) };
  });
  var stk = FM.WHEEL_STK.map(function (s, i) {
    var a = (-90 + i * (360 / FM.WHEEL_STK.length) + 15) * DEG;
    return { n: s.n, x: 50 + rStk * Math.cos(a), y: 50 + rStk * Math.sin(a) };
  });
  return { rMod: rMod, rStk: rStk, center: { x: 50, y: 50 }, mods: mods, stk: stk };
};
```

`fm-rebuild.js`'s existing wheel render is refactored to call this; pflow's converge
maps node → `mods[i]`/`stk[i]` and converts `%`→stage px with the same centre. One
source, zero drift. (When the wheel sits inside the pinned square stage, the canvas
must use the **wheel element's** box for the `%`→px conversion, not the full stage —
noted as the key integration detail.)

---

## F · PLATFORM SYNC DIFF (Task 3) — ✅ ALREADY DONE

For the record (shipped last turn in `FrontM Platform Section.html`):

| Field | Was (stale) | Now (synced to homepage) |
|---|---|---|
| Heading | "Introducing: The FrontM Platform" | "One platform to build, run, and scale maritime AI." |
| Subhead | "AI-native sovereign platform for remote enterprise operations" | "FrontM connects the full maritime innovation cycle: build with Studio, deploy through Fabric, and distribute products, services, and apps through Exchange." |
| Exchange | "Apps, agents and workflows" / "Marketplace and user layer across every screen" | "Marketplace layer" / "Products, services, apps." |
| Studio | "Low-code and agentic development" / "Builder layer for developers, partners and enterprise teams" | "Builder layer" / "Apps, agents, workflows." |
| Fabric | "Sovereign runtime, data and integration" / "Edge-cloud orchestration that makes remote operations AI-ready" | "Foundation layer" / "Runtime, data, integration." |

**Divergence risk going forward:** copy is duplicated between the homepage §8 markup
and this standalone file (no shared include). If the homepage Platform copy changes
again, this file must be re-synced by hand. The standalone now also exposes a
**Layer/Function** tweak that can flip back to the old wording — that's intentional
exploration, not the default (default = synced "Layer" copy).

---

## G · TWEAK CONTROLS (Task 4) — ✅ ALREADY DONE

Shipped in `platform-tweaks.jsx` (matches `tweaks-panel.jsx`/`tweaks-app.jsx`
conventions; CSS-var driven; defaults = approved homepage design; no new brand
colours; standalone preview intact):

- **Content** — Heading (text), Subheading (text), Card labels (Layer/Function).
- **Look** — Accent (4 curated brand pairs), Circuit traces (toggle), Depth grid
  (toggle), Perspective (slider).
- **Motion** — Scroll length (vh), End hold (vh) — via the backwards-compatible
  `window.__pf` hook added to `fm-platform.js`.

> The original task list also suggested glass-opacity / glow / reduced-motion toggles.
> Those weren't added — flag if you want them; glass-opacity + glow are clean CSS-var
> adds, a "disable animation" toggle would force `pf-static`.

---

## H · REQUIRED FINAL OUTPUT (the merge build, pending your go)

1. **Comparison inventory** — §A / §B above.
2. **Salvage map** — §C above.
3. **Platform sync diff** — §F (done).
4. **Proposed controls list** — §G (done).
5. **Exact files to edit (merge build):**
   - `site/fm-rebuild.js` — add `FM.wheelGeometry()`; refactor wheel render to use it.
   - `site/fm-pflow.js` — extend clock to ~640vh; add HEAL + FINALE; port salvage
     items 2–6 onto wheel geometry; replace centre-dissolve; extend static path.
   - `site/fm-pflow.css` — taller stage; positioned slots for approach copy + outcomes;
     mount/hide wheel in-stage; extend `.pf-static` to the full story.
   - `FrontM Homepage v2.html` — fold S2+S3+S4 into one `#problem-flow`; retire the
     standalone Solution + Segue to the Archive; re-point any in-page anchors.
   - `site/fm-transition.js` — untouched (stays inert); delete only after nothing refs it.
6. **Risks / rollback:**
   - *Geometry drift* → mitigated by the single `FM.wheelGeometry()` helper (§E).
   - *`%`→px basis* → convert against the **wheel element box**, not the full stage.
   - *Pin length / pace* → 640vh is a start value; tune.
   - *Outcome legibility near centre* → prototype HEAL in isolation first.
   - *Rollback* → the live clean-break build is intact; keep this branch of edits
     reversible by retaining `fm-pflow.*` current behaviour behind the existing
     static fallback until the merge is verified.
7. **Build order:** geometry helper → re-time problem half → port FINALE (converge+
   bloom+arriving) → HEAL outcomes beat (prototype) → extend fallback → cleanup/retire
   + re-point links → verify (desktop scrub + mobile) → fork verifier.

### Still need from you before code
- **Pin length:** ~640vh or tighter ~520vh?
- **Outcomes in HEAL:** orbiting labels vs compact 2×4 that fades before the wheel?
- **Converge scope:** 8 modules only, or 8 modules + 12 stakeholders?
- **Extra platform tweaks** (glass opacity / glow / disable-animation)? add or skip?
