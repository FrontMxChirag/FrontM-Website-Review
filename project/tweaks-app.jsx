/* FrontM Homepage, Tweaks panel.
   Drives cinematic atmosphere + motion via CSS vars on :root and a shared
   window.__cine config object the vanilla ambient loop reads each frame. */

const CINE_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": ["#29C5F0", "#9A86FF"],
  "glow": 60,
  "grain": 22,
  "vignette": true,
  "parallax": 60,
  "spotlight": true,
  "tilt": true
}/*EDITMODE-END*/;

const PALETTES = [
  ["#29C5F0", "#9A86FF"],  // azure · violet (brand)
  ["#2BD4C4", "#3F86FF"],  // teal · blue
  ["#7AA2FF", "#C58BFF"],  // periwinkle · lilac
  ["#48E0A0", "#29C5F0"],  // aqua · azure
  ["#FF9D6B", "#F06BD0"]    // coral · magenta
];

function applyCine(t) {
  const r = document.documentElement;
  const a1 = t.palette[0], a2 = t.palette[1];
  r.style.setProperty('--accent', a1);
  r.style.setProperty('--accent-2', a2);
  r.style.setProperty('--glow', 'color-mix(in oklch, ' + a1 + ' ' + Math.round(34 + t.glow * 0.42) + '%, transparent)');
  r.style.setProperty('--glow-mul', (0.4 + t.glow / 100 * 1.2).toFixed(2));
  r.style.setProperty('--grain-op', (t.grain / 100 * 0.42).toFixed(3));
  r.style.setProperty('--vignette-op', t.vignette ? '1' : '0');
  window.__cine = {
    parallax: t.parallax / 60,
    spotlight: t.spotlight,
    tilt: t.tilt
  };
}

function CineTweaks() {
  const [t, setTweak] = useTweaks(CINE_DEFAULTS);
  React.useEffect(() => { applyCine(t); }, [t]);

  return (
    <TweaksPanel>
      <TweakSection label="Atmosphere" />
      <TweakColor label="Accent" value={t.palette} options={PALETTES}
                  onChange={(v) => setTweak('palette', v)} />
      <TweakSlider label="Glow" value={t.glow} min={0} max={100} unit="%"
                   onChange={(v) => setTweak('glow', v)} />
      <TweakSlider label="Film grain" value={t.grain} min={0} max={100} unit="%"
                   onChange={(v) => setTweak('grain', v)} />
      <TweakToggle label="Vignette" value={t.vignette}
                   onChange={(v) => setTweak('vignette', v)} />

      <TweakSection label="Motion" />
      <TweakSlider label="Parallax" value={t.parallax} min={0} max={140} unit="%"
                   onChange={(v) => setTweak('parallax', v)} />
      <TweakToggle label="Cursor spotlight" value={t.spotlight}
                   onChange={(v) => setTweak('spotlight', v)} />
      <TweakToggle label="Hero tilt" value={t.tilt}
                   onChange={(v) => setTweak('tilt', v)} />
    </TweaksPanel>
  );
}

// apply defaults immediately so the look is correct before the panel is opened
applyCine(CINE_DEFAULTS);
ReactDOM.createRoot(document.getElementById('tweaks-root')).render(<CineTweaks />);
