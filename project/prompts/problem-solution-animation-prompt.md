# PROMPT — FrontM "Problem → Solution → Wheel" scroll cinematic (Sections 2–4, MERGED)

> Paste this into your cloud design tool to build the FrontM homepage's
> **Problem → Solution → Collaboration-Wheel** moment as **ONE continuous,
> scroll-pinned story** on a single sticky stage and a single canvas.
>
> Architecture = **the merge**: the fragmented network multiplies like splitting
> atoms (Problem), the system heals as the 8 outcomes settle in (Solution), and the
> scattered fragments **converge to FORM the collaboration wheel** (Segue) as the
> finale. **Do not** split these into three separate static sections.
>
> Copy is from the **7-June-2026 "Go with this" PDF** (the homepage source of truth)
> **except the turn line**, which intentionally revives the existing build's beat
> (see §7-F). British spelling as-is — never rewrite, shorten, or "fix" copy.
>
> The prompt is **self-contained**: §1 lists the palette, type, and glass recipe so
> it animates identically even in a codebase that has never seen FrontM's files. If
> you ARE in the FrontM system, you already have these tokens (`fm.css`), the glass
> recipe, a global `signal-field` background, AND the native v2 collaboration-wheel
> component — reuse them, do not rebuild.

---

## 0 · WHAT THIS IS (read first)

A single tall **scroll-pinned cinematic** that tells one story in five beats on one
sticky stage + one full-bleed canvas:

1. **OPEN** — "The maritime operating gap." headline + lead wipe in over a dark field
   of a few glowing nodes.
2. **PROBLEM BUILD** — nodes **multiply and split like dividing atoms** (fragmentation
   worsening); the five friction cards reveal **one-by-one** in step; signal pulses
   **fail** (orange → grey) between nodes.
3. **COST** — the `$52K+` stat lands.
4. **TURN** — the problem fades and **"FrontM is changing that."** rises into the
   cleared centre.
5. **HEAL** — the network resolves (chaos → order, pulses recover); the **8 outcomes
   scan in one-by-one**, each tied to a node settling into place. Framing copy:
   eyebrow "The FrontM approach" + the "one digital layer" heading + paragraph.
6. **FINALE** — the scattered fragments **converge onto the collaboration wheel's
   coordinates** and the native wheel (hub + 8 modules + 12 stakeholders + spokes)
   blooms in over them. Title: **"Anchoring Maritime Collaboration."**

This is **one pinned section**, not three. The only non-pinned states are the
required static fallbacks (§6).

---

## 1 · DESIGN TOKENS (self-contained — match exactly)  ‹unchanged & correct›

**Background:** near-black navy `#0A0B1E`, faint radial lift
(`radial-gradient(circle at top, #12152F 0%, #0A0B1E 48%, #06071A 100%)`).
A low-opacity animated "signal field" of drifting dots sits behind everything.

**Surfaces (glass cards):** base `#12152F`; card =
`background: color-mix(in oklch, #12152F 80%, transparent)`,
`border: 1px solid rgba(255,255,255,0.12)`, `backdrop-filter: blur(12px)`,
`border-radius: 16px`, `box-shadow: 0 18px 40px -24px rgba(0,0,0,0.8)`.

**Text:** heading `#FFFFFF` · body `#D6DAEA` · muted `#AEB5C9` · subtle `#8A92A8`.

**Accent palette (the node colours):**
purple `#6B5FD9` (primary) · light purple `#9A86FF` · blue `#01B3F6` ·
cyan `#1FE6D4` · green `#18C95C` / `#3CAD33` · gold `#FFC500` ·
orange `#FF6A04` · indigo `#435FE8`.

**Type:**
- Display (headlines, the turn line): serif — **Instrument Serif**, weight 400.
  `clamp(2.6rem, 6vw, 4.6rem)` for the turn; `clamp(2.2rem, 5vw, 3.6rem)` for the
  problem headline.
- Body / cards: **Hanken Grotesk**, 400–700.
- Eyebrows / labels: **JetBrains Mono**, 12px, `letter-spacing: 0.16em`, UPPERCASE.

**Gradient text:** "changing" in the turn → "intel" gradient
`linear-gradient(90deg, #01B3F6, #435FE8, #6B5FD9)` clipped to text.
"operating gap" in the headline → "spectrum" gradient
`linear-gradient(90deg, #01B3F6, #3CAD33, #FFC500, #FF6A04)` clipped to text.

---

## 2 · THE PINNED STAGE — structure & clock

### 2.1 Stage

Outer section **`height: ~640vh`** (tunable — tune for pace). Inside, a **sticky
stage**: `position: sticky; top: 0; height: 100vh; overflow: hidden`. All beat
elements are absolutely positioned inside the stage; one `<canvas>` is full-bleed
(`inset: 0; pointer-events: none`) behind them. The native collaboration-wheel
component mounts inside the stage too (centre), hidden until the FINALE beat.

| element                  | position                                                        |
|--------------------------|-----------------------------------------------------------------|
| `<canvas>` (nodes)       | full-bleed, `inset:0`                                           |
| problem headline + lead  | top ~12%, centred, max-width ~820px                            |
| friction card row        | bottom ~19%, centred, horizontal flex, gap 14px, ~188px cards  |
| cost-stat pill           | bottom ~7%, centred                                            |
| the turn block           | dead-centre (`top:50%; translate(-50%,-50%)`)                  |
| outcomes (8)             | centred cluster / ring around centre (see §5)                  |
| collaboration wheel      | dead-centre, square `min(760px, 92vw)`, hidden until FINALE    |
| scroll cue               | bottom ~3%, centred, gentle bob                                |

### 2.2 Scroll clock

```
p = clamp( -section.getBoundingClientRect().top
           / (sectionHeight - innerHeight), 0, 1 )
```
`p` runs 0→1 across the pin. Ease every range with smoothstep:
`smooth(a,b,p) = t*t*(3-2t)`, `t = clamp((p-a)/(b-a),0,1)`.

### 2.3 Beat map (fractions of `p` — all tunable)

| beat            | range        | what happens                                                        |
|-----------------|--------------|---------------------------------------------------------------------|
| **OPEN**        | `0.00–0.10`  | headline + lead wipe in; ~3 nodes glowing                           |
| **PROBLEM BUILD** | `0.10–0.46`| atom-split mitosis (3→46), 5 friction cards one-by-one, failing pulses |
| **COST**        | `0.46–0.54`  | friction clears; `$52K+` pill rises                                 |
| **TURN**        | `0.54–0.64`  | problem fades; "FrontM is changing that." rises centre              |
| **HEAL**        | `0.64–0.84`  | network resolves; 8 outcomes scan in one-by-one, each on a settling node |
| **FINALE**      | `0.84–1.00`  | fragments converge to wheel coords; wheel blooms in; title lands    |

The turn does **not** hold to the end — it hands off to HEAL.

---

## 3 · DOM PHASE TIMELINE (fractions of `p`)

| element / property                        | in (fade/scan)                  | out (fade)        | transform                                |
|-------------------------------------------|---------------------------------|-------------------|------------------------------------------|
| headline block opacity                    | `0.01–0.08`                     | `0.50–0.58`       | translateY `-16→0` on the in             |
| headline `<h2>` scan-in (clip wipe)       | `0.02–0.10`                     | —                 | `inset(0 (1-r)*102% 0 0)` + translateX `-18→0` |
| lead scan-in                              | `0.05–0.13`                     | —                 | same wipe                                |
| friction card `i` (i = 0..4)              | `0.13+i*0.05 → 0.20+i*0.05`     | `0.47–0.54`       | translateY `26→0`, scale `0.94→1`        |
| cost-stat pill                            | `0.46–0.52`                     | `0.55–0.62`       | translateY `20→0`                        |
| approach eyebrow + heading + paragraph    | `0.58–0.66`                     | `0.86–0.92`       | translateY `18→0`                        |
| the turn block                            | `0.54–0.62`                     | `0.66–0.72`       | translateY `26→0`, scale `0.96→1`        |
| outcome `i` (i = 0..7) scan-in            | `0.66+i*0.018 → 0.72+i*0.018`   | `0.86–0.92`       | clip wipe + translateY `14→0`            |
| wheel title                               | `0.88–0.96`                     | (holds)           | translateY `18→0`                        |

(The exact fractions are tunable; keep the **order** and non-overlap of beats.)

---

## 4 · THE CANVAS — atom-split → heal → converge-to-wheel

Particle system on the full-bleed `<canvas>` (DPR-aware; `requestAnimationFrame`,
gated to on-screen). **§4.1–4.3 are the shipped, correct mechanics — keep them.**
§4.4 is the changed end-state (converge to wheel, not centre-dissolve).

### 4.1 Population (mitosis tree)  ‹keep›

`MAX ≈ 46` nodes. Precompute per node `i`:
- **scatter target** on a ring away from centre — angle random, radius `0.16–0.56`
  of `min(stageW,stageH)`, biased so dead-centre stays clear for text.
- **parent index** `= (i-1) >> 1` — a **binary mitosis tree**, so growth reads as
  repeated division.
- **colour** cycling the accent palette; **radius** `2.2–4.8px`; random phase;
  **birth fraction** `= i / MAX`.

### 4.2 Problem driver (atom-split)  ‹keep›

`problem = smooth(0.10, 0.46, p)`.
- `activeCount = round(lerp(3, MAX, problem))` — ~3 nodes divide up to 46.
- Each node is born progressively: `spawnT = smooth(born*0.9, born*0.9+0.06, problem)`;
  while born it **springs from parent's position to its own scatter target**
  (`lerp(parentScatter, ownScatter, spawnT)`) — the visible "split".
- **Chaotic wobble** grows with `problem`:
  `sin(now*0.0006 + phase) * (0.004 + problem*0.012)` added to x/y.

### 4.3 Failing signals + links  ‹keep›

- **Failing pulses (only `0.10 < p < 0.50`):** dots travel node→node, morph colour
  **orange `#FF6A04` → grey `#6B7280`** over a short life and fade — messages that
  don't arrive. Spawn rate rises with `problem`; cap ~16.
- **Links:** each active node draws a 1px line to its nearest neighbour.
- **Render:** soft glow per node (`shadowBlur ~10`, own colour) + slow twinkle.

### 4.4 HEAL + FINALE (changed end-state — converge to wheel, NOT centre-dissolve)

- **HEAL `0.64–0.84`:** `heal = smooth(0.64, 0.84, p)`.
  - Damp the wobble toward 0 as `heal` rises (chaos resolving).
  - Strengthen links: `linkAlpha = 0.06 + heal*0.22` (order emerging).
  - **Recovering pulses:** during HEAL, spawn pulses that morph the *other* way —
    grey/orange **→ success green `#18C95C`** and arrive (reach their target) — the
    visual counterpart to the 8 outcomes landing.
- **FINALE `0.84–1.00`:** `gather = smooth(0.84, 1.00, p)`.
  - Compute the **wheel target coordinates**: the 8 inner-ring module-chip positions
    (evenly spaced on radius `rMod`) and the 12 outer-ring stakeholder positions
    (radius `rStk`, offset ~15°), all relative to stage centre — matching the native
    wheel component's geometry exactly.
  - Assign the **8 most-saturated / earliest-born nodes** to the 8 module positions
    and (optionally) 12 nodes to the stakeholder positions, **carrying their colours**;
    lerp each toward its wheel target by `gather`. **Remaining nodes fade out**
    (`alpha *= 1 - gather`).
  - As `gather → 1`, **bloom the native collaboration wheel in over those converged
    positions** (hub scales up first, chips/pills fade/scale in from centre, rings +
    spokes fade last) so the chaos visibly **resolves into the ordered wheel**.
  - Once the wheel is fully in, you may fade the canvas nodes entirely (the wheel DOM
    now carries the visual) to keep paint cost low.

---

## 5 · COPY + the in-pin "heal" beat (8 outcomes)

### 5.1 Verbatim copy

**OPEN (7-June PDF):**
- Headline: `The maritime operating gap.`  *(gradient on "operating gap")*
- Lead: `Inefficient operations and fragmented tools are holding maritime back.`

**PROBLEM BUILD — five friction cards (7-June PDF)** — bold label + one line, in order:
1. `Too many channels` — `Critical information gets scattered.`
2. `Too much manual work` — `Teams chase instead of progress.`
3. `Too little visibility` — `Issues escalate out of sight.`
4. `Too slow to change` — `Digitalisation gets stuck in silos.`
5. `Too much human risk` — `Fatigue and safety risk compound.`

Each card has a small orange-tinted icon tile (channels = broadcast/branch,
manual = circular-arrows, visibility = eye-with-slash, slow = hourglass, risk =
warning triangle).

**COST (7-June PDF):** `$52K+` · `Avoidable operational friction can cost over $52K per ship per year.`

**TURN (existing-build beat — NOT PDF-verbatim, see §7-F):**
- kicker `THE SOLUTION`
- line `FrontM is changing that.`  *(gradient on "changing")*
- sub `One maritime workflow at a time, on a modular and scalable operating platform.`

**HEAL — approach framing (7-June PDF):**
- Eyebrow: `The FrontM approach`
- Heading: `One digital layer for ships, shore teams, crews, workflows, and partners.`
- Paragraph: `FrontM brings communication, engagement, information access, workflow automation, skills development, healthcare, management, reporting, and marketplace services into one secure maritime platform.`

**HEAL — eight outcomes (7-June PDF)** — label + one-line, each with its own icon,
revealed **one-by-one inside the pin**, each tied to a node settling into place:
1. `Reach frontline consistently` — `Critical updates reach the right people.`
2. `Coordinate workflows` — `Teams, tasks, and vessels stay connected.`
3. `Safeguard earlier` — `Risks are spotted before they escalate.`
4. `Connect stakeholders` — `Departments, partners, and services align.`
5. `Launch faster` — `Apps and services deploy without silos.`
6. `Improve adoption` — `New tools become easier to use.`
7. `Measure value` — `Impact becomes visible and reportable.`
8. `Scale AI roadmap` — `Digital initiatives grow on one platform.`

**FINALE (7-June PDF):**
- Title: `Anchoring Maritime Collaboration`
- (optional support) `Eight modules at the core, twelve stakeholder groups around the network — connected through one operating layer.`

### 5.2 How the 8 outcomes animate (in-pin, NOT a separate grid)

- They live **inside the pinned stage**, not in a separate IntersectionObserver
  section. **Remove any standalone static outcomes section.**
- During HEAL, as the network resolves, the outcomes **scan/fade in one-by-one**
  (reuse the headline's clip-path wipe), each timed to a node arriving at rest — the
  copy and the canvas tell the same "healing" beat together.
- Arrange them as a centred cluster or loose ring framing the turn line / centre, so
  the eye connects each outcome to a settling node. They fade out (`0.86–0.92`) as
  the FINALE converge begins, handing the centre to the wheel.

---

## 6 · FALLBACK (REQUIRED) — full story as a static stack

On `max-width: 980px` **or** `prefers-reduced-motion: reduce`: drop the pin and the
canvas entirely; render the **entire story in normal document flow**, full opacity,
no clip-path, `height: auto`, sticky off — in this order:

1. gap headline + lead
2. the five friction cards (wrapped, centred grid)
3. the `$52K+` stat
4. the turn line + the approach eyebrow/heading/paragraph
5. the 8 outcome cards (static grid, 4/2/1 cols)
6. the collaboration wheel (static — hub + modules + stakeholders + spokes)

The whole narrative must be fully readable with zero motion and no scroll-jack.
(Scroll-jacking a ~6.4-viewport pin is heavy and rough on touch — this fallback is
non-negotiable.)

---

## 7 · GUARDRAILS & FIXES

- **A.** This is **one pinned story** — never split into separate static sections.
  §4.4 converge-to-wheel is the **default** finale.
- **B.** No new fonts, colours, or libraries beyond §1. Reuse existing FrontM tokens,
  glass recipe, signal-field, and the **native v2 collaboration-wheel component** if
  present — do not rebuild the wheel.
- **C.** Text must stay legible over the canvas at all times (centre-bias the scatter;
  headline, turn, and outcomes all sit where node density is lowest).
- **E.** The §6 static fallback covers the full story — not just the problem.
- **F — small fixes (independent of the merge):**
  - **Turn copy** ("FrontM is changing that." / "One maritime workflow at a time…")
    is from the **existing build, NOT the 7-June PDF** — intentional (reviving the old
    turn beat). Keep it, but **do not label it PDF-verbatim**.
  - **Module colours:** resolve the **CARE** and **MAINTAIN** token-vs-data clashes to
    **one canonical value each**, applied consistently across the wheel chips and any
    converged node colours: CARE `#18C95C`, MAINTAIN `#435FE8` (pick once, use everywhere).
