/* FrontM Platform Section — Tweaks panel.
   Drives the platform assembly's copy, accent scheme, depth, and scroll pacing.
   Content tweaks rewrite DOM text; look tweaks set CSS vars on :root / the
   section; motion tweaks write window.__pf (read live by fm-platform.js) and
   nudge a resize so the pin re-lays-out. */

const PF_DEFAULTS = /*EDITMODE-BEGIN*/{
  "heading": "One platform to build, run, and scale maritime AI.",
  "subhead": "FrontM connects the full maritime innovation cycle: build with Studio, deploy through Fabric, and distribute products, services, and apps through Exchange.",
  "labels": "layer",
  "accent": ["#5FE6D0", "#FFD24D"],
  "circuit": true,
  "floor": true,
  "depth": 1400,
  "scroll": 360,
  "hold": 80
}/*EDITMODE-END*/;

// Card tag/desc pairs for the two naming styles (the recent homepage update vs the
// previous "function" wording — handy to compare the two side by side).
const CARD_COPY = {
  layer: {
    exchange: ["Marketplace layer", "Products, services, apps."],
    studio:   ["Builder layer", "Apps, agents, workflows."],
    fabric:   ["Foundation layer", "Runtime, data, integration."]
  },
  function: {
    exchange: ["Apps, agents and workflows", "Marketplace and user layer across every screen"],
    studio:   ["Low-code and agentic development", "Builder layer for developers, partners and enterprise teams"],
    fabric:   ["Sovereign runtime, data and integration", "Edge-cloud orchestration that makes remote operations AI-ready"]
  }
};

// Accent schemes: [Exchange family, Studio/Fabric family]. Each value is a
// [accent, connector] pair so the glow + canvas traces stay coherent.
const ACCENTS = [
  ["#5FE6D0", "#FFD24D"],  // brand — teal · gold (default)
  ["#29C5F0", "#9A86FF"],  // cool — azure · violet
  ["#18C95C", "#FF6A04"],  // spectrum — green · orange
  ["#01B3F6", "#435FE8"]   // intel — blue · indigo
];
// connector (deeper) tone per accent hero
const CONN = {
  "#5FE6D0": "#00D9C9", "#FFD24D": "#FFC500",
  "#29C5F0": "#1F9FE0", "#9A86FF": "#6B5FD9",
  "#18C95C": "#079B33", "#FF6A04": "#E25400",
  "#01B3F6": "#0185C9", "#435FE8": "#2C45C0"
};

function setText(sel, text) { const el = document.querySelector(sel); if (el) el.textContent = text; }

function applyPF(t) {
  const r = document.documentElement;
  const sec = document.getElementById('platform');

  // ---- content ----
  setText('.pf-head h2', t.heading);
  setText('.pf-head p', t.subhead);
  const copy = CARD_COPY[t.labels] || CARD_COPY.layer;
  Object.keys(copy).forEach((k) => {
    const card = document.querySelector('.pf-card[data-card="' + k + '"]');
    if (!card) return;
    const tag = card.querySelector('.pf-tag'), desc = card.querySelector('.pf-desc');
    if (tag) tag.textContent = copy[k][0];
    if (desc) desc.textContent = copy[k][1];
  });

  // ---- look ----
  const a1 = t.accent[0], a2 = t.accent[1];
  r.style.setProperty('--pf-a1', a1);
  r.style.setProperty('--pf-a1c', CONN[a1] || a1);
  r.style.setProperty('--pf-a2', a2);
  r.style.setProperty('--pf-a2c', CONN[a2] || a2);
  r.style.setProperty('--pf-circuit', t.circuit ? '1' : '0');
  r.style.setProperty('--pf-persp', t.depth + 'px');
  if (sec) sec.setAttribute('data-floor', t.floor ? '1' : '0');

  // ---- motion (read live by fm-platform.js) ----
  window.__pf = { base: t.scroll / 100, tail: t.hold / 100 };
  // nudge the engine to re-layout the pin height + redraw at the new pacing
  window.dispatchEvent(new Event('resize'));
}

function PlatformTweaks() {
  const [t, setTweak] = useTweaks(PF_DEFAULTS);
  React.useEffect(() => { applyPF(t); }, [t]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Content" />
      <TweakText label="Heading" value={t.heading}
                 onChange={(v) => setTweak('heading', v)} />
      <TweakText label="Subheading" value={t.subhead}
                 onChange={(v) => setTweak('subhead', v)} />
      <TweakRadio label="Card labels" value={t.labels}
                  options={[{ value: 'layer', label: 'Layer' }, { value: 'function', label: 'Function' }]}
                  onChange={(v) => setTweak('labels', v)} />

      <TweakSection label="Look" />
      <TweakColor label="Accent" value={t.accent} options={ACCENTS}
                  onChange={(v) => setTweak('accent', v)} />
      <TweakToggle label="Circuit traces" value={t.circuit}
                   onChange={(v) => setTweak('circuit', v)} />
      <TweakToggle label="Depth grid" value={t.floor}
                   onChange={(v) => setTweak('floor', v)} />
      <TweakSlider label="Perspective" value={t.depth} min={700} max={2400} step={50} unit="px"
                   onChange={(v) => setTweak('depth', v)} />

      <TweakSection label="Motion" />
      <TweakSlider label="Scroll length" value={t.scroll} min={250} max={520} step={10} unit="vh"
                   onChange={(v) => setTweak('scroll', v)} />
      <TweakSlider label="End hold" value={t.hold} min={0} max={180} step={10} unit="vh"
                   onChange={(v) => setTweak('hold', v)} />
    </TweaksPanel>
  );
}

// apply defaults immediately so the section is correct before the panel opens
applyPF(PF_DEFAULTS);
ReactDOM.createRoot(document.getElementById('tweaks-root')).render(<PlatformTweaks />);
