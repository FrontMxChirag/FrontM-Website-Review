# PROMPT — FrontM "Problem → Solution" scroll cinematic (Sections 2–4)

> Paste this into your cloud design tool to reproduce the FrontM homepage's
> animated **Problem → Solution → Collaboration-Wheel** sequence. It is the
> direct spec of the sequence already shipped on `FrontM Homepage v2.html`.
> All copy is **verbatim from the 7-June-2026 "Go with this" PDF** (the homepage
> source of truth) — do not rewrite, shorten, or "fix" it. British spelling as-is.
>
> The prompt is **self-contained**: it lists the palette, type, and exact motion
> mechanics so it animates identically even in a codebase that has never seen
> FrontM's files. If you ARE in the FrontM system, you already have these tokens
> (`fm.css`), the glass recipe, and a global `signal-field` background — reuse them
> instead of redeclaring.

---

## 0 · WHAT THIS IS (read first)

Three consecutive homepage sections that read as **one continuous story**:

1. **Section 2 — Problem.** A single **scroll-pinned cinematic**. As the user
   scrolls, a dark field of glowing nodes **multiplies and splits like dividing
   atoms** (fragmentation getting worse). Five "friction" cards reveal **one-by-one**
   in time with the splitting, signal pulses **fail** (orange → grey) between nodes,
   and a cost stat lands. Then the whole problem **dissolves** as the scattered
   fragments rush together and the line **"FrontM is changing that."** rises.
2. **Section 3 — Solution.** A **clean break** — a fresh, static section. Eyebrow,
   heading, paragraph, then **8 outcome cards** that fade in on scroll.
3. **Section 4 — Segue.** A **collaboration wheel** (hub + 8 modules + 12
   stakeholders), titled **"Anchoring Maritime Collaboration."**

The cinematic is the hero moment. Sections 3 and 4 are calmer and static by design —
**do not** merge them into the pinned scroll.

---

## 1 · DESIGN TOKENS (self-contained — match these exactly)

**Background:** near-black navy `#0A0B1E`, with a faint radial lift
(`radial-gradient(circle at top, #12152F 0%, #0A0B1E 48%, #06071A 100%)`).
A low-opacity animated "signal field" of drifting dots sits behind everything.

**Surfaces (glass cards):** base `#12152F`; card =
`background: color-mix(in oklch, #12152F 80%, transparent)`,
`border: 1px solid rgba(255,255,255,0.12)`,
`backdrop-filter: blur(12px)`, `border-radius: 16px`,
`box-shadow: 0 18px 40px -24px rgba(0,0,0,0.8)`.

**Text:** heading `#FFFFFF` · body `#D6DAEA` · muted `#AEB5C9` · subtle `#8A92A8`.

**Accent palette (the node colours):**
purple `#6B5FD9` (primary) · light purple `#9A86FF` · blue `#01B3F6` ·
cyan `#1FE6D4` · green `#18C95C` / `#3CAD33` · gold `#FFC500` ·
orange `#FF6A04` · indigo `#435FE8`.

**Type:**
- Display (headlines, the turn line): a serif — **Instrument Serif**, weight 400.
  `clamp(2.6rem, 6vw, 4.6rem)` for the turn; `clamp(2.2rem, 5vw, 3.6rem)` for the
  problem headline.
- Body / cards: **Hanken Grotesk**, 400–700.
- Eyebrows / labels: **JetBrains Mono**, 12px, `letter-spacing: 0.16em`, UPPERCASE.

**Gradient text:** the word **"changing"** in the turn line uses an "intel"
gradient `linear-gradient(90deg, #01B3F6, #435FE8, #6B5FD9)` clipped to text.
The phrase **"operating gap"** in the problem headline uses a "spectrum"
gradient `linear-gradient(90deg, #01B3F6, #3CAD33, #FFC500, #FF6A04)` clipped to text.

---

## 2 · SECTION 2 — PROBLEM (the pinned cinematic)

### 2.1 Verbatim copy (7-June PDF)

- **Headline:** `The maritime operating gap.`  *(gradient on "operating gap")*
- **Lead:** `Inefficient operations and fragmented tools are holding maritime back.`
- **Five friction cards** — each = bold label + one line. They reveal in this order:
  1. `Too many channels` — `Critical information gets scattered.`
  2. `Too much manual work` — `Teams chase instead of progress.`
  3. `Too little visibility` — `Issues escalate out of sight.`
  4. `Too slow to change` — `Digitalisation gets stuck in silos.`
  5. `Too much human risk` — `Fatigue and safety risk compound.`
- **Cost stat (pill):** `$52K+` · `Avoidable operational friction can cost over $52K per ship per year.`
- **The turn:**
  - kicker `THE SOLUTION`
  - line `FrontM is changing that.`  *(gradient on "changing")*
  - sub `One maritime workflow at a time, on a modular and scalable operating platform.`

Each friction card has a small square **icon tile** (orange-tinted): channels =
branching/broadcast glyph, manual work = circular-arrows, visibility = eye-with-slash,
slow = hourglass, human risk = warning triangle.

### 2.2 The feel (plain language)

Scroll in → the headline **wipes in** left-to-right. Keep scrolling → nodes start
**dividing** (one becomes two becomes four…), drifting apart and wobbling more as
they multiply — visibly *more chaotic and fragmented* the further you go. In step
with that, the five friction cards **pop in one at a time** along the bottom. Faint
links flicker between nearby nodes and **signal pulses travel but die** (orange
fading to grey) — messages that don't arrive. The `$52K+` pill slides up. Then the
sequence **turns**: the problem fades, every scattered node **rushes to centre and
dissolves**, and **"FrontM is changing that."** rises into the cleared space. Unpin.

### 2.3 Layout (inside the pinned stage)

A tall outer section (**`height: 460vh`**) contains a **sticky stage**
(`position: sticky; top: 0; height: 100vh; overflow: hidden`). Children, all
absolutely positioned inside the stage, `z-index` low→high:

| element            | position                                   |
|--------------------|--------------------------------------------|
| `<canvas>` (nodes) | full-bleed, `inset: 0`, `pointer-events:none` |
| headline + lead    | top ~12%, centred, max-width ~820px        |
| friction card row  | bottom ~19%, centred, horizontal flex, gap 14px, cards ~188px wide |
| cost-stat pill     | bottom ~7%, centred                        |
| the turn block     | dead-centre (`top:50%; translate(-50%,-50%)`) |
| scroll cue         | bottom ~3%, centred, gentle bob            |

### 2.4 Scroll clock

```
p = clamp( -stage.parentSection.getBoundingClientRect().top
           / (sectionHeight - innerHeight), 0, 1 )
```
`p` runs 0→1 across the pinned scroll. Use an eased smoothstep for every range:
`smooth(a,b,p) = t*t*(3-2t)` where `t = clamp((p-a)/(b-a),0,1)`.

### 2.5 DOM phase timeline (fractions of `p`)

| element / property                       | in (fade/scan)        | out (fade)        | transform                              |
|------------------------------------------|-----------------------|-------------------|----------------------------------------|
| headline block opacity                   | `0.02–0.10`           | `0.44–0.52`       | translateY `-16→0` on the in           |
| headline `<h2>` scan-in (clip-path wipe) | `0.03–0.12`           | —                 | `inset(0 (1-r)*102% 0 0)` + translateX `-18→0` |
| lead scan-in                             | `0.07–0.16`           | —                 | same wipe technique                    |
| friction card `i` (i = 0..4)             | `0.13+i*0.058 → 0.20+i*0.058` | `0.45–0.52` | translateY `26→0`, scale `0.94→1`      |
| cost-stat pill                           | `0.37–0.44`           | `0.45–0.52`       | translateY `20→0`                      |
| the turn block                           | `0.52–0.62`           | (holds to end)    | translateY `26→0`, scale `0.96→1`      |
| scroll cue                               | (starts at 1)         | `0.06–0.16`       | —                                      |

So: headline first, friction cards cascade across `~0.13–0.49`, cost stat just
before the cards clear, then everything wipes and the turn rises by `~0.62`.

### 2.6 The "atoms splitting" canvas (the signature)

Particle system on the full-bleed `<canvas>` (DPR-aware; redraw via `requestAnimationFrame`,
gated to when the section is on-screen).

- **Population:** `MAX ≈ 46` nodes. Precompute for each node `i`:
  - **scatter target** on a ring away from centre — angle random, radius
    `0.16–0.56` of `min(stageW,stageH)`, biased so the dead-centre stays clear for text.
  - **parent index** `= (i-1) >> 1` — a binary **mitosis tree** (node 1's parent is 0,
    nodes 2–3 parent 0–1, etc.), so growth looks like repeated division.
  - **colour** cycling through the accent palette; **radius** `2.2–4.8px`; random phase.
  - **birth fraction** `= i / MAX`.
- **Problem driver:** `problem = smooth(0.05, 0.46, p)`.
  - `activeCount = round(lerp(3, MAX, problem))` — start with ~3 nodes, divide up to 46.
  - Each node is **born** progressively: `spawnT = smooth(born*0.9, born*0.9+0.06, problem)`.
    While being born it **springs from its parent's position to its own scatter target**
    (`pos = lerp(parentScatter, ownScatter, spawnT)`) — the visual "split".
  - **Chaotic wobble** grows with `problem`:
    `wobble = sin(now*0.0006 + phase) * (0.004 + problem*0.012)` added to x/y.
- **Convergence on the turn:** `gather = smooth(0.50, 0.70, p)` →
  lerp every node's position toward centre by `gather`. `fade = 1 - smooth(0.56, 0.74, p)` →
  multiply node/link/pulse alpha by `fade` so they dissolve as the turn headline lands.
- **Links:** for each active node, draw a 1px line to its nearest neighbour;
  `linkAlpha = (0.06 + gather*0.18) * fade` — faint during chaos, **strengthening as
  they converge** (order emerging from fragmentation), then fading out.
- **Failing signal pulses (only while `0.10 < p < 0.50`):** occasionally spawn a dot
  that travels from one active node toward another; over its short life it morphs
  colour **orange `#FF6A04` → grey `#6B7280`** and fades — a message that doesn't
  arrive. Spawn rate rises with `problem`; cap ~16 concurrent.
- **Render polish:** each node drawn with a soft glow (`shadowBlur ~10`, shadow =
  its own colour) and a slow twinkle (`0.6 + 0.4*sin(now*0.001 + phase)`).

### 2.7 Fallback (REQUIRED)

On `max-width: 980px` **or** `prefers-reduced-motion: reduce`: drop the pin and the
canvas entirely. Render a **static stack** — headline, the five friction cards
wrapped in a centred grid, the cost-stat pill, then the turn line — all at full
opacity, no clip-path, normal document flow (`height: auto`, sticky off). The story
must be fully readable with zero motion.

---

## 3 · SECTION 3 — SOLUTION (clean break, static)

A normal section (NOT pinned, NOT on the canvas). Standard section padding.

### 3.1 Verbatim copy (7-June PDF)

- **Eyebrow:** `The FrontM approach`
- **Heading:** `One digital layer for ships, shore teams, crews, workflows, and partners.`
- **Paragraph:** `FrontM brings communication, engagement, information access, workflow automation, skills development, healthcare, management, reporting, and marketplace services into one secure maritime platform.`
- **Eight outcome cards** — label + one-line caption, each with its own icon:
  1. `Reach frontline consistently` — `Critical updates reach the right people.`
  2. `Coordinate workflows` — `Teams, tasks, and vessels stay connected.`
  3. `Safeguard earlier` — `Risks are spotted before they escalate.`
  4. `Connect stakeholders` — `Departments, partners, and services align.`
  5. `Launch faster` — `Apps and services deploy without silos.`
  6. `Improve adoption` — `New tools become easier to use.`
  7. `Measure value` — `Impact becomes visible and reportable.`
  8. `Scale AI roadmap` — `Digital initiatives grow on one platform.`

### 3.2 Layout & motion

4-column grid on desktop (2 on tablet, 1 on mobile), gap ~16px. Each card: small
purple-tinted icon tile, bold title, one muted line. Cards **fade + rise in on
scroll** (IntersectionObserver, ~40–80ms stagger) — a quiet settle, deliberately
calmer than the cinematic. Hover: lift `translateY(-4px)`, border brightens.

> **Important:** do **not** repeat "FrontM is changing that." here — that beat
> belongs only to the turn in Section 2.

---

## 4 · SECTION 4 — SEGUE (the collaboration wheel)

### 4.1 Verbatim copy (7-June PDF)

- **Title:** `Anchoring Maritime Collaboration`
- (Supporting line, optional) `Eight modules at the core, twelve stakeholder groups around the network — connected through one operating layer.`

### 4.2 The wheel

A centred radial diagram in a square stage (`min(760px, 92vw)`):
- **Centre hub** — the FrontM mark in a glowing disc.
- **Inner ring — 8 module chips**, evenly spaced, **each keeps its own brand colour**:
  CONNECT `#01B3F6` · ENGAGE `#6B5FD9` · CARE `#18C95C` · ENTERTAIN `#FF6A04` ·
  INFORM `#FFC500` · TRAIN `#3CAD33` · MAINTAIN `#435FE8` *(label "Soon")* ·
  MANAGE `#404858` *(label "Soon")*. Each = rounded icon chip + name.
- **Outer ring — 12 stakeholder pills**, evenly spaced (offset ~15° from the modules
  so they interleave): Ship Owners · Ship Managers · Class Societies · Crew Manning ·
  Ports & Authorities · Charterers · Insurers · Regulators · Engine OEMs ·
  Service Providers · Brokers · Surveyors. Each = small mono-purple icon + label pill.
- Two faint **dashed concentric rings** mark the two orbits; thin **spokes** run hub→modules.
- **Entrance:** on scroll-into-view, hub scales up first, then nodes scale/fade in
  from the centre outward; rings/spokes fade last. Respect reduced-motion (show static).

---

## 5 · EXTRA SECTIONS  ⬅️ FILL THIS IN

> You mentioned "a few extra sections to be added" — none were specified yet.
> Add them here and tell the build **where they slot** in the flow. Template per section:
>
> - **Name / purpose:**
> - **Goes:** (e.g. between Section 3 Solution and Section 4 Wheel)
> - **Verbatim copy:** eyebrow / heading / body / card or bullet text / CTA labels
> - **Layout:** (hero / split / grid-of-N / accordion / carousel …)
> - **Motion:** static reveal, or part of a pinned sequence?
> - **Reuse:** which tokens / components from §1 it should match
>
> Until filled, the build is Section 2 → 3 → 4 exactly as above.

---

## 6 · OPTIONAL ADDENDUM — "fragments form the wheel"

The shipped version uses a **clean break**: the cinematic's nodes dissolve at the
turn, and the wheel (Section 4) builds its own fresh nodes. If you instead want the
scattered fragments to read as literally *forming* the wheel:

- Don't fully fade the converged nodes at the end of Section 2; carry a subset's
  positions/colours forward.
- Have Section 4's 8 module chips **animate out from the centre** along the same
  radius the fragments converged to, so the chaos visibly resolves into the ordered
  ring. Keep the section break, but match the exit colours/positions of Section 2 to
  the entrance of Section 4 so the eye reads continuity.

This is a nice-to-have, not the default. Ship the clean break first.

---

## 7 · GUARDRAILS

- Copy is **verbatim from the 7-June PDF** — never rewrite. British spelling.
- No new fonts, colours, or libraries beyond §1. Reuse existing tokens if present.
- Everything must degrade to a **readable static stack** without JS / with reduced-motion.
- The cinematic is the only pinned/animated part. Sections 3 and 4 are calm and static.
- Text must stay legible over the canvas at all times (centre-bias the node scatter;
  the headline and turn both sit where node density is lowest).
