# Platform Section — Animation Reference

Files: `site/fm-platform.js` (all motion) · `site/fm-platform.css` (layout/styling) · markup in `index.html` (`#platform`).

## How it operates

- The section is **5.6 viewports tall** (`BASE_VH = 5.6`) plus a **0.8-viewport "tail"** hold at the end (`PLATFORM_TAIL_VH`). The stage inside is `position: sticky` — it pins fullscreen while you scroll through.
- Scroll progress through the section becomes **p (0→1)**. Every frame, a rAF loop smooths it: `s += (p − s) × 0.18` — so motion eases ~18% toward the target per frame and **fully reverses on scroll-up**.
- One `render(s)` function writes every transform/opacity from `s`. There are no CSS keyframe timings for the main beats — everything is a scroll-progress window.
- Each beat uses `smooth(a, b, s)` — a smoothstep ramp from progress `a` to `b`.

## Timeline (progress windows, % of the section's scroll)

| Beat | Window (s) | What happens |
|---|---|---|
| Heading fades in | 0.015 → 0.05 | Glass panel + heading appear centred mid-screen |
| Glass sink trigger | at 0.085 | Glass sinks on its own clock: **850ms down / 550ms back** (drops 34px, scales 1→0.7, blurs 4px, fades). Then a radial "wave" (~**1400ms**) swells through the ambient dot-field |
| Text docks to top | 0.115 → 0.185 | Heading travels from 46% (centre) to 4.8% (top), scales to 0.88. Rate-capped (~600ms) so it never moves under a sinking glass |
| Floor + slab rise | 0.20 → 0.30 | Grid floor + glow fade in; the deck slab rises (scale 0.92→1) |
| Pivot into 3D | 0.30 → 0.42 | Two-stage yaw 0→+22°→−2°, pitch 0→9° |
| Split into 3 cards | 0.42 → 0.56 | Exchange/Studio/Fabric spread vertically (±~140px, scales with stage height); card text fades in 0.47→0.54 |
| Channel row settles | 0.56 → 0.64 | 5 channel tiles fade up one by one (stagger 0.018 each, 12px rise) |
| Left ecosystem | 0.64 → 0.73 | Nodes slide in from −48px, stagger 0.024 each |
| Right ecosystem | 0.73 → 0.82 | Nodes slide in from +48px, stagger 0.022 each |
| Circuit finale | 0.82 → 0.96 | See below. Banner rises 18px + shield "stamps" (scale 0.6→1.05→1); corner mark fades in |
| Tail hold | 0.96 → end +0.8vh | Everything assembled; pulses keep looping |

## The circuit overlay (canvas, z-index 4)

Drawn every frame on a `<canvas>` covering the stage:

1. **Ambient board** — ~20–46 drifting brand-coloured dots with faint orthogonal nearest-neighbour links. Alive from the very start (fades in over s 0.01→0.06 at 55% strength).
2. **Channel rail** (teal `#00D9C9`) — per-tile drops onto a horizontal bus, the bus draws outward from centre, then a single drop terminates into the **Exchange** card (locked semantics: channels feed Exchange only).
3. **Wired traces** — left ecosystem nodes → Exchange (teal); right nodes → nearest of Studio/Fabric (gold `#FFC500`). Orthogonal routes through a 78px gutter; staggered 0.008/wire; solder pads appear when a wire is >98% drawn.
4. **Waterline rig** (cyan `#5FD8F0`) — a bus drawn along the live ocean-horizon curve plus vertical trunks from the surface up to each card, with glowing anchor pads. Ties the board to the sea.
5. **Pulses** — once wires are >60% faded in, up to 22 glowing dots loop along random routes forever. 42% spawn as sea→card "risers", else wired/ambient. Speeds random 0.004–0.013 per frame.

## Other behaviours

- **Cursor parallax** (desktop only): pointer tilts the deck ±3.4° yaw / ±2.2° pitch, eased 6%/frame.
- **Card hover** (desktop only): hovered card floats up 8px, forward 52px, scale +2.5%; opposite ecosystem column dims to 32%.
- **Static fallback**: narrow screens / portrait tablets / reduced-motion get a plain stacked layout (`.pf-static`) with zero animation.
- **Perf**: loop pauses entirely when the section is offscreen (IntersectionObserver).
- **Live overrides**: `window.__pf = { base, tail }` can override the 5.6 / 0.8 viewport spans at runtime.
