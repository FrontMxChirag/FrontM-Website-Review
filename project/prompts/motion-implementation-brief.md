# FrontM Homepage — Motion System Implementation Brief

For: Claude Code / any engineer taking the motion system to production.
Source of truth: `site/fm-pflow.js`, `site/fm-platform.js`, visual map in `FrontM Pflow Timing Map.html`.

## Architecture (do not change)

Two independent scroll-scrubbed pinned sections. **No shared animation state.**

| | `#problem-flow` | `#platform` |
|---|---|---|
| Clock | `p` 0→1 | `s` 0→1 |
| Pin | `PIN_VH = 5.6` (scrub over 4.6 vh) | `BASE_VH = 3.6` (scrub over 2.6 vh) + `PLATFORM_TAIL_VH = 0.8` hold |
| Inertia | `p += (tp−p)×0.16`/frame | `s += (tp−s)×0.18`/frame |
| Easing | `smoothstep(start, end, clock)` on every beat — scrub-reversible by construction | same |
| Engine | IIFE in fm-pflow.js | IIFE in fm-platform.js |

**Constraint:** the retired `#transition` system (`fm-transition.js`) stays inert. Useful math from it has already been ported (spawnArrive/bloom → pflow `spawnRecover`). Never re-enable it or add cross-section coupling.

## Beat tables

Use `FrontM Pflow Timing Map.html` as the canonical table (charts + exact windows). Summary of structure:

- pflow: OPEN (.02–.21) → PROBLEM (.10–.50) → COST (.48–.63) → TURN (.55–.75) → HEAL/SOLUTION (.58–.84) → EXIT+FINALE (.84–1.0)
- platform: SEED (.03–.13) → PIVOT (.13–.27) → SPLIT (.27–.44) → CHANNELS (.44–.54) → ECOSYSTEMS (.54–.80) → CIRCUIT (.80–.96) → HOLD (tail)

## Recommended timing changes (reviewed, not yet applied)

1. **pflow stat→dot**: `0.56–0.63` → `0.54–0.60` (finish before approach enters)
2. **pflow approach entrance**: `0.58–0.65` → `0.60–0.67` (headline mostly gone first); shift eyebrow + H/P scan-ins by +0.02 to match
3. **pflow outcome scan-out**: stagger `+0.008` → `+0.006`, start `0.85` → `0.84` (last card exits ~0.93, before wheel is live)
4. **pflow tail**: add `PFLOW_TAIL_VH = 0.35` mirroring the platform tail, so the finished wheel holds at rest before unpin
5. Platform: no changes — tail stays `0.8`

## Production safeguards (all implemented)

- Reduced-motion → `pf-static` class, all inline styles cleared, content fully visible (both engines)
- Mobile ≤980px → same static fallback (both)
- DPR capped at 2 on both canvases
- `IntersectionObserver` pauses both rAF loops offscreen (`rafId = 0` when `!visible`); callbacks read the LAST entry (`e[e.length-1]`) — `e[0]` is stale when leave+enter events batch under fast scroll
- **Channel rail** (drawChannelRail, fm-platform.js): the 5 channel tiles visually terminate into the Exchange card only (teal bus + single drop + anchor pad, drawn over the `ch` window) — locked semantics: channels never wire Studio/Fabric
- Inter-pin breather measured: **6.8vh** of unpinned content between #problem-flow and #platform — comfortably above the 0.6–1.0vh floor
- Debug overlay: `site/fm-debug.js` — enable with `?motion-debug` or Shift+D. Shows active section, p/s, active beat, FPS, reduced-motion. Reads `window.__fmMotion` (write-only from engines; engines never read it).
- QA hooks: `window.__pflowQA.update/draw/assertGeometry()` — geometry assert must return `ok: true` (<2px) after any wheel layout change

## Implementation risks

0. **Synthetic scroll probes** — the page sets `scroll-behavior: smooth`; QA scripts must call `window.scrollTo({top, behavior:'instant'})` or the jump is silently animated/cancelled
1. **Handoff geometry drift** — canvas converge targets are measured from live DOM wheel nodes; any CSS change to `.cw-stage` sizing requires re-running `__pflowQA.assertGeometry()`
2. **Inertia + anchor jumps** — deep-linking past a pinned section leaves the eased clock catching up; acceptable (resolves in ~10 frames) but don't lower inertia below ~0.1
3. **Debug beat tables are duplicated** in fm-debug.js — if windows are retuned, update them (labels only; engines don't read them)
4. **`will-change` density** — pflow stage has many composited layers; avoid adding more without profiling on low-end hardware
5. **Resize during pin** — both engines re-measure on resize, but mid-pin orientation change on tablets can momentarily mis-scrub; static fallback covers ≤980px which captures most tablets in portrait
