/* ============================================================
   FrontM scroll-horizon
   A single glowing curved horizon line, fixed to the viewport,
   that rises from the bottom of the screen to the top as the
   page is scrolled. Self-contained: injects its own styles and
   element. Drop into ANY page with one line, just before </body>:

     <script src="site/scroll-horizon.js"></script>
     (adjust the relative path per page, e.g. ../site/...)

   Optional knobs via data-attrs on the <script> tag:
     data-color    accent of the crest      (default #1FE6D4)
     data-glow     glow / bloom colour       (default #01B3F6)
     data-opacity  max opacity 0..1          (default 0.5)
     data-z        z-index                   (default 3)

   Any section that should NOT show the line (because it has its
   own horizon, e.g. the signature transition) gets the attribute
   data-no-horizon, and the line fades out while that section
   dominates the viewport.
   ============================================================ */
(function () {
  if (window.__fmScrollHorizon) return;
  window.__fmScrollHorizon = true;

  var s = document.currentScript || (function () {
    var all = document.getElementsByTagName('script');
    return all[all.length - 1];
  })();
  var d = (s && s.dataset) || {};
  var COLOR = d.color || '#1FE6D4';
  var GLOW = d.glow || '#01B3F6';
  var MAXOP = d.opacity != null ? parseFloat(d.opacity) : 0.5;
  var ZIDX = d.z != null ? d.z : 3;
  // travel mode: 'scroll' (homepage — crest rises bottom→rest with scroll) or
  // 'fixed' (other pages — crest pinned at rest, ocean fully active regardless of scroll)
  var MODE = d.horizonMode === 'scroll' ? 'scroll' : 'fixed';
  var REST = 0.20;    // resting crest height = 20% from top (do not touch)
  var START = 0.80;   // scroll-top crest: ~20% ocean + fuller fleet at hero, reveal preserved (0.80 → 0.20)

  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // brand palette the crest drifts through (subtle, slow)
  var PAL = ['#1FE6D4', '#01B3F6', '#18C95C', '#9A86FF'];
  function hexToRgb(h) { return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]; }
  var PRGB = PAL.map(hexToRgb);
  function mix(a, b, t) { return 'rgb(' + Math.round(a[0] + (b[0] - a[0]) * t) + ',' + Math.round(a[1] + (b[1] - a[1]) * t) + ',' + Math.round(a[2] + (b[2] - a[2]) * t) + ')'; }
  function paletteAt(phase) {            // phase 0..1 around the ring
    var f = phase * PAL.length, i = Math.floor(f) % PAL.length, t = f - Math.floor(f);
    return mix(PRGB[i], PRGB[(i + 1) % PAL.length], t);
  }

  // ---- styles ----
  var css = '' +
    '.fm-horizon{position:fixed;left:50%;top:0;width:260vw;height:100vh;' +
      'transform:translate(-50%,100vh);border-radius:50% 50% 0 0;' +
      'pointer-events:none;z-index:' + ZIDX + ';mix-blend-mode:screen;' +
      'opacity:0;will-change:transform,opacity;' +
      'border-top:1px solid color-mix(in oklch,var(--hz,' + COLOR + ') 56%,transparent);' +
      'box-shadow:0 -10px 44px -30px color-mix(in oklch,var(--hzg,' + GLOW + ') 50%,transparent);}' +
    // bloom clip wrapper: full-viewport; a clip-path polygon traces the actual horizon
    // curve along its bottom edge, so the bloom is masked exactly along the line (not a
    // straight cut) and only its upper half shows. Same screen-blend stratum as the line (A3).
    '.fm-bloom-clip{position:fixed;left:0;top:0;width:100vw;height:100vh;' +
      'pointer-events:none;z-index:' + ZIDX + ';mix-blend-mode:screen;will-change:clip-path;opacity:0;}' +
    '.fm-bloom{position:absolute;left:0;top:0;' +
      'width:min(300px,44vw);height:min(110px,16vh);' +
      'transform:translate(-50%,-50%) scale(var(--b,1));' +
      'pointer-events:none;will-change:transform,opacity,left,top;' +
      'background:radial-gradient(50% 50% at 50% 50%,' +
        'color-mix(in oklch,var(--hz,' + COLOR + ') 38%,white 62%),' +
        'color-mix(in oklch,var(--hzg,' + GLOW + ') 42%,transparent) 46%,transparent 100%);}' +
    // local line brightening: a soft lift on the crest line, tracking the bloom x
    '.fm-line-lift{position:absolute;left:0;top:0;width:360px;height:3px;' +
      'transform:translate(-50%,-50%);border-radius:3px;pointer-events:none;will-change:left,top,opacity;' +
      'background:radial-gradient(50% 50% at 50% 50%,var(--hz,' + COLOR + '),transparent 72%);opacity:0;}' +
    '.fm-horizon::before{content:"";position:absolute;left:50%;top:-1px;transform:translateX(-50%);' +
      'width:min(560px,48vw);height:1px;border-radius:1px;' +
      'background:radial-gradient(50% 50% at 50% 50%,var(--hz,' + COLOR + '),transparent 80%);' +
      'box-shadow:0 0 14px 1px color-mix(in oklch,var(--hz,' + COLOR + ') 48%,transparent);opacity:.9;}' +
    '@media(prefers-reduced-motion:reduce){.fm-horizon{transition:none;}}';
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  // ---- elements ----
  var el = document.createElement('div');
  el.className = 'fm-horizon';
  el.setAttribute('aria-hidden', 'true');
  var clip = document.createElement('div');         // bloom clip wrapper (above-line only)
  clip.className = 'fm-bloom-clip';
  clip.setAttribute('aria-hidden', 'true');
  var bloom = document.createElement('div');
  bloom.className = 'fm-bloom';
  clip.appendChild(bloom);
  var lift = document.createElement('div');         // local crest-line brightening under the bloom
  lift.className = 'fm-line-lift';
  clip.appendChild(lift);
  var mount = function () { var b = document.body || document.documentElement; b.appendChild(el); b.appendChild(clip); };
  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);

  // ---- scroll → position ----
  var curY = null, curOp = 0;       // smoothed
  var tgtY = 0, tgtOp = 0;

  function compute() {
    var doc = document.documentElement;
    var max = (doc.scrollHeight - window.innerHeight);
    var p = max > 0 ? Math.min(1, Math.max(0, (window.scrollY || doc.scrollTop) / max)) : 0;
    var vh = window.innerHeight;
    if (MODE === 'scroll') {
      // crest starts at START·vh (ocean sliver already visible) -> rests at REST·vh; same
      // scroll distance + easing as before, just a shorter travel (0.86 → 0.20).
      tgtY = (START - p * (START - REST)) * vh;
    } else {
      // fixed pages: crest pinned at the resting line
      tgtY = vh * REST;
    }

    // suppress while a [data-no-horizon] section dominates the viewport centre.
    // The attribute may carry a 0..1 STRENGTH: bare/"" or 1 = fully hide (own-horizon
    // scenes like the transition); a fraction (e.g. "0.5") only damps the line so it
    // still reads through, e.g. the platform where the line is the surface it rises from.
    var suppress = 0;
    var blocks = document.querySelectorAll('[data-no-horizon]');
    var midY = vh * 0.5;
    for (var i = 0; i < blocks.length; i++) {
      var r = blocks[i].getBoundingClientRect();
      if (r.top < midY && r.bottom > midY) {
        var coverage = Math.min(1, (Math.min(r.bottom, vh) - Math.max(r.top, 0)) / vh);
        var raw = blocks[i].getAttribute('data-no-horizon');
        var strength = (raw == null || raw === '') ? 1 : parseFloat(raw);
        if (isNaN(strength)) strength = 1;
        strength = Math.max(0, Math.min(1, strength));
        suppress = Math.max(suppress, coverage * strength);
      }
    }
    tgtOp = MAXOP * (1 - suppress);
  }

  // ---- published geometry — single source of truth for the curve.
  //      signal-field.js reads this each frame to draw the ocean / reflection / ships.
  //      Matches the CSS ellipse exactly: semi-axes a = 1.3*vw (half of 260vw), b = 0.5*vh,
  //      crest at viewport centre = curY, dropping outward.
  function yAt(x) {
    var vw = window.innerWidth, vh = window.innerHeight;
    var a = 1.3 * vw, b = 0.5 * vh, u = x - vw / 2;
    if (u < -a) u = -a; if (u > a) u = a;
    return curY + b * (1 - Math.sqrt(1 - (u / a) * (u / a)));
  }
  var pub = (window.__fmHorizon = window.__fmHorizon || {});
  pub.yAt = yAt; pub.mode = MODE; pub.rest = REST; pub.start = START; pub.maxOp = MAXOP;

  // ---- bloom x: eases toward the cursor (mouse only), recentres on idle / leave ----
  var bloomTX = null, bloomX = null, idleTimer = 0;
  window.addEventListener('pointermove', function (e) {
    if (e.pointerType && e.pointerType !== 'mouse') return;   // ignore touch → centred
    bloomTX = e.clientX;
    clearTimeout(idleTimer);
    idleTimer = setTimeout(function () { bloomTX = null; }, 2500);
  }, { passive: true });
  window.addEventListener('blur', function () { bloomTX = null; });
  document.addEventListener('mouseleave', function () { bloomTX = null; }, { passive: true });

  // ---- dynamic glow: layered (incommensurate) breathing + an occasional gentle swell ----
  function multi(ts) {   // sum of 3 sines, periods 7s / 11s / 17s → never visibly repeats; ~ -1..1
    return (Math.sin(ts / 7 * 6.2832) + Math.sin(ts / 11 * 6.2832 + 1.3) + Math.sin(ts / 17 * 6.2832 + 2.7)) / 3;
  }
  var swellActive = false, swellT0 = 0, swellDur = 2000, swellNext = 0;
  function swellMul(now) {
    if (reduced) return 1;
    if (!swellNext) swellNext = now + (8000 + Math.random() * 12000);
    if (!swellActive && now >= swellNext) { swellActive = true; swellT0 = now; swellDur = 1500 + Math.random() * 1000; }
    if (swellActive) {
      var st = (now - swellT0) / swellDur;
      if (st >= 1) { swellActive = false; swellNext = now + (8000 + Math.random() * 12000); return 1; }
      return 1 + 0.2 * Math.sin(st * Math.PI);     // ease up ~+20% and back — a swell, never a flash
    }
    return 1;
  }

  function frame(now) {
    if (curY === null) curY = tgtY;
    if (reduced) { curY = tgtY; curOp = tgtOp; }
    else {
      curY += (tgtY - curY) * 0.12;
      curOp += (tgtOp - curOp) * 0.12;
    }
    el.style.transform = 'translate(-50%,' + curY.toFixed(1) + 'px)';
    el.style.opacity = curOp.toFixed(3);

    // crest colour drift (~55s, unchanged) + layered breathing + swell
    var t = now * 0.001;
    var col = reduced ? paletteAt(0) : paletteAt((t * 0.018) % 1);
    var glow = reduced ? paletteAt(0.12) : paletteAt((t * 0.018 + 0.12) % 1);
    var sw = swellMul(now);
    var br = reduced ? 0 : multi(t);                 // -1..1, non-repeating
    var br2 = reduced ? 0 : multi(t + 5);
    var breath = reduced ? 1 : (0.95 + 0.05 * br2) * sw;
    var bAlpha = (reduced ? 0.38 : (0.34 + 0.10 * br)) * sw;     // extra faded crest glow
    if (bAlpha > 1) bAlpha = 1;
    el.style.setProperty('--hz', col);
    el.style.setProperty('--hzg', glow);
    bloom.style.setProperty('--hz', col);
    bloom.style.setProperty('--hzg', glow);
    bloom.style.setProperty('--b', breath.toFixed(3));
    bloom.style.opacity = bAlpha.toFixed(3);
    lift.style.setProperty('--hz', col);

    // bloom x → position bloom centred ON the line at yAt(bloomX); the clip-path (below)
    // masks everything beneath the curve, so only the bloom's upper half shows. (A2)
    var vw = window.innerWidth;
    var targetX = bloomTX == null ? vw / 2 : bloomTX;
    if (bloomX == null) bloomX = targetX;
    bloomX += (targetX - bloomX) * (reduced ? 1 : 0.03);        // slower mouse follow
    var lineY = yAt(bloomX);
    bloom.style.left = bloomX.toFixed(1) + 'px';
    bloom.style.top = lineY.toFixed(1) + 'px';
    lift.style.left = bloomX.toFixed(1) + 'px';
    lift.style.top = lineY.toFixed(1) + 'px';
    lift.style.opacity = (0.35 * bAlpha * (curOp / (MAXOP || 0.5))).toFixed(3);

    // clip-path polygon tracing the curve: top edge then the horizon curve right→left,
    // so the mask boundary IS the line (no straight cut against the curved edge).
    if (curOp > 0.001) {
      var N = 22, poly = '0 0,' + vw.toFixed(0) + 'px 0';
      for (var k = N; k >= 0; k--) { var xx = vw * k / N; poly += ',' + xx.toFixed(1) + 'px ' + yAt(xx).toFixed(1) + 'px'; }
      clip.style.clipPath = 'polygon(' + poly + ')';
      clip.style.webkitClipPath = 'polygon(' + poly + ')';
      clip.style.opacity = '1';
    } else {
      clip.style.opacity = '0';
    }

    // publish live geometry + bloom for the ocean layer (signal-field.js).
    // bloomAlpha carries ALL dynamics (breathing + swell) so the glade inherits them.
    pub.crestY = curY; pub.opacity = curOp;
    pub.bloomX = bloomX; pub.bloomColor = col; pub.bloomAlpha = bAlpha * curOp;

    requestAnimationFrame(frame);
  }

  compute();
  curY = tgtY; curOp = tgtOp;     // prime to target so the first synchronous frame shows fully (even while hidden)
  bloomX = window.innerWidth / 2;
  pub.crestY = curY; pub.opacity = curOp;
  pub.bloomX = bloomX; pub.bloomColor = paletteAt(0); pub.bloomAlpha = 0.8 * curOp;
  window.addEventListener('scroll', compute, { passive: true });
  window.addEventListener('resize', compute, { passive: true });
  frame(performance.now());       // paint immediately, then self-schedule the loop
})();
