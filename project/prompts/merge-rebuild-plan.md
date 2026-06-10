# REBUILD PLAN — Problem→Solution→Wheel: live (clean-break) → merged (one pin)

Planning doc. Puts the **current live sequence** next to the **new merged sequence**
and marks, element by element, what is **KEEP / RE-TIME / MOVE / CHANGE / NEW /
REMOVE**, then lists the per-file work, the risks, and a build order. Nothing is
edited until we agree this.

Files in play today: `site/fm-pflow.css`, `site/fm-pflow.js` (the cinematic),
`site/fm-rebuild.css` + `site/fm-rebuild.js` (the static Solution outcomes + the
collaboration wheel render), `FrontM Homepage v2.html` (markup).

---

## 1 · THE TWO SEQUENCES, SIDE BY SIDE

### A. LIVE NOW — "clean break", THREE separate sections

| # | Section (DOM)                     | Type            | Behaviour |
|---|-----------------------------------|-----------------|-----------|
| 2 | Problem `#problem-flow`            | **Pinned** 460vh| OPEN headline → atoms split (3→46) + 5 friction cards one-by-one → $52K → TURN "FrontM is changing that." rises while nodes **converge to centre and DISSOLVE**. Unpins. |
| 3 | Solution `[data-screen-label=Solution]` | **Static**| Eyebrow "The FrontM approach" + heading + paragraph + **8 outcome cards** (grid), fade-in via IntersectionObserver. |
| 4 | Segue (wheel) `#cw-stage`          | **Static**      | Title "Anchoring Maritime Collaboration"; native wheel **builds its own fresh nodes** (hub + 8 modules + 12 stakeholders + spokes), scale-in on reveal. |

Live beat fractions (in `fm-pflow.js` `update()`): headline `0.02–0.10`/out `0.44–0.52`;
cards `0.13+i*0.058 … `, out `0.45–0.52`; stat `0.37–0.44`; turn `0.52–0.62` (holds);
canvas `problem` `0.05–0.46`, `gather`(→centre) `0.50–0.70`, `fade` `0.56–0.74`.

### B. TARGET — "the merge", ONE pinned story (~640vh)

| beat        | range       | what happens |
|-------------|-------------|--------------|
| OPEN        | `0.00–0.10` | headline + lead wipe in; ~3 nodes |
| PROBLEM BUILD | `0.10–0.46`| atoms split 3→46, 5 friction cards one-by-one, failing pulses orange→grey |
| COST        | `0.46–0.54` | friction clears; $52K pill |
| TURN        | `0.54–0.64` | problem fades; "FrontM is changing that." rises (no longer holds) |
| HEAL        | `0.64–0.84` | network resolves; **8 outcomes scan in one-by-one** on settling nodes; recovering pulses (→green); approach framing copy |
| FINALE      | `0.84–1.00` | fragments **converge onto WHEEL coords** (not centre); native wheel **blooms over them**; title lands |

Plus: static fallback now covers the **full** story, not just the problem.

---

## 1B · THREE-WAY INVENTORY — what the RETIRED 4.3 transition already has

The old **Signature Transition** (`site/fm-transition.js`, retired to the Archive,
`#transition` no longer in the live flow) is **not** dead weight — it already
implements most of the merged FINALE. Inventory of its mechanics and whether we
salvage them:

| Mechanic in `fm-transition.js` | What it does | Salvage for the merge? |
|---|---|---|
| `buildRing(MODS, R_IN=19vmin, 'mod', -90)` | Places the **8 module nodes** as real DOM, evenly spaced on the inner ring, brand-coloured, with labels | **LIFT** — this *is* the wheel's inner ring |
| `buildRing(STK, R_OUT=33vmin, 'stk', -90+15)` | Places the **12 stakeholder nodes** on the outer ring, +15° offset, with icons | **LIFT** — this *is* the wheel's outer ring |
| Paired scattered dots (one per ring node) + `gather = smooth(0.78,0.95,p)` | Each ring node has a drifting dot that **lerps from scatter → ring target**; `dotFade` hides the dot as the node blooms | **LIFT** — this is exactly "fragments converge onto wheel coords" |
| Glyph bloom `0.84–0.93` + node bloom `--g 0.86–0.97` (modules first, stk +0.04) | FrontM mark scales up, then chips/pills fade-scale in centre-out | **LIFT** — this is the wheel "bloom over converged nodes" |
| Connection lines (SVG): centre→module (blue), module→2 nearest stk (purple), draw-in via `strokeDashoffset` | The spokes/relationships draw themselves in | **LIFT** (optional richness over the current static wheel) |
| **Arriving** signal pulses `p>0.86` (blue→purple) + arrival **bloom rings** | Pulses that *reach* their target and burst — order restored | **LIFT** — this is the "recovering pulses" the spec marked NEW; already built |
| Failing signal pulses `0.08<p<0.54` (orange→grey) | Messages that don't arrive | **REDUNDANT** — current `fm-pflow.js` already has this; keep one impl |
| Two-card problem→solution (`cardP` slides left/shrinks; `cardS` chrome dissolves, lone `h2` lifts to top) | The old turn choreography | **DROP** — superseded by pflow's headline/turn + the new HEAL beat |
| `scanIn()` clip-path wipe helper | Left-to-right text reveal | **REDUNDANT** — pflow has the identical helper; keep one |
| Cursor parallax + per-dot magnetism (nearest dot follows pointer) | Hover flourish on the scattered field | **OPTIONAL** — nice but not required; adds pointer-move cost |
| Horizon line + eclipse "sun" riding it (`__fmHorizon` handoff to `scroll-horizon.js`) | The old scene's sky/horizon, crossfaded with a global horizon | **DROP** — belongs to the retired scene; the merge uses the `signal-field` bg, not a horizon |

### What each of the three has (at a glance)

| Capability | OLD 4.3 transition | CURRENT pflow (live) | MERGED target |
|---|---|---|---|
| Atom-split **mitosis** (3→46, binary tree) | ✗ (20 fixed scatter dots) | ✓ | ✓ (keep from pflow) |
| 5 friction cards one-by-one | ✗ | ✓ | ✓ |
| $52K cost stat | ✗ | ✓ | ✓ |
| Failing pulses (orange→grey) | ✓ | ✓ | ✓ (one impl) |
| Turn "FrontM is changing that." | ✓ (two-card) | ✓ (single block) | ✓ (pflow's, re-timed) |
| 8 outcomes **inside the pin** | ✗ | ✗ (static section) | ✓ **(new beat)** |
| **Converge → ring/wheel** | ✓ | ✗ (→centre, dissolves) | ✓ (lift from OLD) |
| Wheel **bloom** (glyph+nodes+lines) | ✓ | ✗ | ✓ (lift from OLD) |
| **Arriving** pulses + bloom rings | ✓ | ✗ | ✓ (lift from OLD) |

**Takeaway:** the merge ≈ **pflow's problem half** (mitosis + cards + $52K + turn,
already live) **＋ the old transition's resolution half** (gather-to-rings + bloom +
arriving pulses, already written) **＋ one genuinely new beat** (the 8 outcomes
scanning in during HEAL). The risky-sounding FINALE is largely a **port**, not new R&D.

### One geometry reconciliation needed
The two ring systems use different coordinate bases:
- OLD transition: `R_IN = 19vmin`, `R_OUT = 33vmin`, centre at `(0.5, 0.56)` of stage.
- CURRENT wheel (`fm-rebuild.js`): `rMod = 33%`, `rStk = 45%` of a square stage, centre `(0.5, 0.5)`.

For the merge we pick **one** geometry and make both the converging canvas/dots and
the blooming wheel read it (the "shared geometry helper" in §3). Recommend adopting
the **current wheel's** `%`-of-square basis (it's what the live wheel users already
see) and porting the old gather/bloom onto it.

---

## 2 · ELEMENT-BY-ELEMENT DISPOSITION

| Element / mechanic | Live state | Target | Verdict |
|---|---|---|---|
| Sticky stage + full-bleed canvas | exists, 460vh | 640vh, same technique | **RE-TIME** (height + clock denominator) |
| Scroll clock `p` + smoothstep | exists | same | **KEEP** |
| Node mitosis tree (3→46, parent `(i-1)>>1`, scatter targets) | exists, correct | same | **KEEP** |
| Chaotic wobble grows with `problem` | exists | same, damps in HEAL | **KEEP + extend** |
| Failing pulses orange→grey (`0.10<p<0.50`) | exists | same | **KEEP** |
| Nearest-neighbour links | exists | strengthen through HEAL | **KEEP + extend** |
| Headline + lead scan-in | exists | same, re-timed to OPEN | **RE-TIME** |
| 5 friction cards one-by-one | exists | same, re-timed | **RE-TIME** |
| $52K cost pill | exists `0.37–0.44` | COST `0.46–0.54` | **RE-TIME** |
| Turn "FrontM is changing that." | holds to end | hands off to HEAL, fades `0.66–0.72` | **CHANGE** (stops holding) |
| Canvas end-state | `gather`→centre + `fade`→dissolve | converge onto **wheel coords**, fade the rest | **CHANGE** (the core delta) |
| "Recovering" green pulses during heal | — | new cue as outcomes land | **NEW** |
| Approach eyebrow/heading/paragraph | static Section 3 | moves **into the pin** (HEAL framing) | **MOVE** |
| 8 outcome cards | static grid, IO fade-in | **into the pin**, scan in one-by-one on settling nodes | **MOVE + CHANGE** |
| Standalone Solution section | exists | folded into pin | **REMOVE** (as a separate section) |
| Native collaboration wheel | self-contained static section, own nodes | **mounts inside the pin**, blooms over converged nodes at FINALE | **MOVE + CHANGE** |
| Wheel geometry (rMod / rStk / angles) | in `fm-rebuild.js` | canvas must read the **same** coords to hand off | **REUSE → SHARE** |
| Static fallback | problem only | full story stack (headline→friction→$52K→turn+approach→outcomes→wheel) | **EXTEND** |
| CARE / MAINTAIN colours | token↔data clash | one canonical each (CARE `#18C95C`, MAINTAIN `#435FE8`) | **FIX** |
| Turn copy provenance | labelled PDF in old prompt | it's existing-build, not PDF | **FIX (doc only)** |

---

## 3 · PER-FILE WORK

**`site/fm-pflow.css`**
- Stage height `460vh → 640vh`.
- Add positioned slots for the approach copy + the 8 outcomes inside the stage
  (centre cluster / loose ring framing the turn).
- Mount the wheel centre, hidden until FINALE (opacity/scale driven by JS).
- Extend `.pf-static` fallback styles to lay out the full story in flow.

**`site/fm-pflow.js`** (the bulk)
- Re-time all DOM phases to the new beat map (§1B / spec §3).
- Turn: remove "holds to end"; add fade-out `0.66–0.72`.
- Render approach copy + 8 outcomes from `FM.OUTCOMES`; scan them in one-by-one in HEAL.
- Canvas: add `heal` (damp wobble, strengthen links) and **port from `fm-transition.js`**:
  the `gather`-to-ring lerp, glyph/node bloom (`--g`), connection-line draw-in, and the
  **arriving pulses + bloom rings** — re-pointed onto the chosen geometry. Replace the
  current centre-dissolve.
- Drive the wheel bloom (hub → chips → rings/spokes) as `gather → 1`.
- Extend `clearInline()` + static path for the new elements.

**`site/fm-transition.js`** (salvage source — currently inert)
- Lift `buildRing`, the scatter-dot pairing, `gather` lerp, glyph/node bloom,
  connection-line draw-in, and `spawnArrive`/`bloom` into the pflow engine (or a shared
  module). Do **not** lift: the two-card problem→solution, horizon/sun, cursor magnetism.
- After porting, this file can stay archived/inert or be deleted once nothing references it.

**`site/fm-rebuild.js`**
- Extract the wheel geometry (rMod=33, rStk=45, angle spacing, +15° stakeholder offset)
  into a shared helper both the wheel render and the canvas converge can call — single
  source of truth so the handoff lines up pixel-for-pixel.
- The standalone outcomes render + standalone wheel section render get retired from the
  live flow (kept for the archive / fallback).

**`FrontM Homepage v2.html`**
- Collapse Sections 2–4 into the single `#problem-flow` pinned section markup
  (headline, friction, stat, turn, approach copy host, outcomes host, wheel host, cue).
- Remove the now-empty standalone Solution + Segue sections from the live flow.
- Move the retired standalone versions to the Archive board (preserve, per discipline).

---

## 4 · RISKS / OPEN QUESTIONS (decide before build)

1. **Geometry handoff precision.** The canvas converge and the DOM wheel must use the
   *exact* same centre + radii or the bloom won't sit on the converged nodes. Plan:
   shared geometry helper (above). Low risk once shared.
2. **Pace / length.** ~6.4 viewports of scroll-jack is long. 640vh is a starting value;
   we'll tune. Question: is a longer, more cinematic pin OK, or keep it tighter (~520vh)?
3. **Outcome legibility.** 8 cards + a turn line + a forming wheel all near centre is
   busy. Options: (a) outcomes as small labels orbiting, (b) a compact 2×4 cluster that
   fades before the wheel. Which reads better — we should prototype the HEAL beat alone.
4. **Mobile/touch.** Pin gets heavier. The full-story static fallback (≤980px /
   reduced-motion) stays non-negotiable; no behaviour change there.
5. **Wheel "Soon" modules + 12 stakeholders in converge.** Map only the 8 modules, or
   the 12 stakeholders too? More nodes = richer but messier. Lean: 8 modules carry
   colour-matched, stakeholders bloom fresh.
6. **SEO/linking.** Folding 3 sections into 1 changes `data-screen-label`s and anchor
   targets used by nav/footer. Need to re-point any in-page links.

---

## 5 · PROPOSED BUILD ORDER

1. Pick the **geometry** (recommend current wheel's %-of-square) + write the shared
   helper both converge + bloom read.
2. **Re-time** the existing problem beats into the longer clock (no new content) —
   verify the problem half still reads.
3. **Port the resolution half from `fm-transition.js`**: `buildRing` → scatter dots →
   `gather` lerp → glyph/node bloom → connection lines → arriving pulses, re-pointed
   onto the chosen geometry. This replaces the centre-dissolve and is the FINALE.
4. **HEAL beat (the one genuinely new piece)**: move approach copy + 8 outcomes into
   the pin, scan-in on settling nodes. Prototype in isolation (risk #3).
5. **Fallback**: extend static stack to full story.
6. **Cleanup**: retire standalone Solution/Segue to Archive, re-point links, fix
   CARE/MAINTAIN, decide whether `fm-transition.js` stays archived or is deleted.
7. Verify (desktop scrub + mobile fallback), fork verifier.

---

### Decisions I need from you
- **Pin length:** cinematic-long (~640vh) or tighter (~520vh)?
- **Outcomes in HEAL:** orbiting labels, or a compact 2×4 cluster that fades before the wheel?
- **Converge scope:** 8 modules only, or 8 modules + 12 stakeholders?
- Anything from §4 you want handled differently.
