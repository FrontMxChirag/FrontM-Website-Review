/* ============================================================
   FM MOTION DEBUG OVERLAY — dev only, ships inert.
   Enable: add ?motion-debug to the URL, or press Shift+D.
   Shows: active section · p/s · active beats · FPS · reduced-motion.
   Reads window.__fmMotion published by fm-pflow.js / fm-platform.js.
   No coupling: engines never read from this file.
   ============================================================ */
(function () {
  var KEY = 'fm-motion-debug';
  var on = /motion-debug/.test(location.search) || localStorage.getItem(KEY) === '1';

  /* beat tables — keep in sync with fm-pflow.js applyPhases() + fm-platform.js PH */
  var PFLOW_BEATS = [
    [0.02, 0.09, 'OPEN: headline glass in'],
    [0.03, 0.13, 'OPEN: h2+lead scan-in'],
    [0.13, 0.21, 'OPEN: glass→dot, dock top'],
    [0.10, 0.46, 'PROBLEM: node mitosis 3→46'],
    [0.20, 0.47, 'PROBLEM: friction cards ×5'],
    [0.48, 0.53, 'COST: $52K pill in'],
    [0.54, 0.60, 'TURN: stat→dot'],
    [0.55, 0.62, 'TURN: headline scan-out'],
    [0.60, 0.72, 'SOLUTION: approach in + scans'],
    [0.62, 0.75, 'TURN: friction flips ×5'],
    [0.64, 0.84, 'HEAL: canvas resolves'],
    [0.66, 0.815, 'HEAL: outcomes flip in ×8'],
    [0.70, 0.78, 'SOLUTION: approach docks'],
    [0.84, 1.00, 'FINALE: fragments converge'],
    [0.84, 0.932, 'EXIT: outcomes scan-out ×8'],
    [0.86, 0.93, 'FINALE: wheel bloom'],
    [0.93, 1.00, 'FINALE: canvas handoff']
  ];
  var PLAT_BEATS = [
    [0.03, 0.13, 'SEED: floor+heading+slab'],
    [0.13, 0.27, 'PIVOT: tip into 3D'],
    [0.27, 0.44, 'SPLIT: 3 cards'],
    [0.44, 0.54, 'CHANNELS: tile row'],
    [0.54, 0.66, 'LEFT ecosystem'],
    [0.66, 0.80, 'RIGHT ecosystem'],
    [0.80, 0.96, 'CIRCUIT: wires+banner'],
    [0.96, 1.001, 'HOLD: pulses loop (tail)']
  ];

  var el = null, fpsN = 0, fpsT = 0, fps = 0, rafId = 0;

  function beats(table, v) {
    var out = [];
    for (var i = 0; i < table.length; i++) if (v >= table[i][0] && v <= table[i][1]) out.push(table[i][2]);
    return out.length ? out.join('<br>') : '—';
  }
  function fmt(v) { return v == null ? '—' : v.toFixed(4); }

  function build() {
    el = document.createElement('div');
    el.id = 'fm-motion-debug';
    el.style.cssText = 'position:fixed;left:12px;bottom:12px;z-index:9999;background:rgba(8,10,22,0.92);' +
      'border:1px solid rgba(255,255,255,0.18);border-radius:6px;padding:10px 13px;min-width:250px;' +
      'font:11px/1.6 ui-monospace,monospace;color:#B9BFD8;pointer-events:none;white-space:nowrap;';
    document.body.appendChild(el);
  }
  function activeSection() {
    var mid = innerHeight / 2;
    var ids = ['problem-flow', 'platform'];
    for (var i = 0; i < ids.length; i++) {
      var s = document.getElementById(ids[i]);
      if (!s) continue;
      var r = s.getBoundingClientRect();
      if (r.top <= mid && r.bottom >= mid) return ids[i];
    }
    return '—';
  }
  function loop(now) {
    if (!on) { rafId = 0; return; }
    fpsN++;
    if (now - fpsT >= 500) { fps = Math.round(fpsN * 1000 / (now - fpsT)); fpsN = 0; fpsT = now; }
    var m = window.__fmMotion || {};
    var sec = activeSection();
    var red = matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.innerHTML =
      '<b style="color:#fff">§ ' + sec + '</b>' +
      '<br>p (pflow): <b style="color:#9A86FF">' + fmt(m.pflow) + '</b>' +
      '<br>s (platform): <b style="color:#5FE6D0">' + fmt(m.platform) + '</b>' +
      '<br>fps: <b style="color:' + (fps < 45 ? '#FF6A04' : '#18C95C') + '">' + fps + '</b>' +
      ' · reduced-motion: <b>' + (red ? 'ON' : 'off') + '</b>' +
      '<br><span style="color:#7E86A8">' +
      (sec === 'problem-flow' ? beats(PFLOW_BEATS, m.pflow || 0) :
       sec === 'platform' ? beats(PLAT_BEATS, m.platform || 0) : '—') + '</span>';
    rafId = requestAnimationFrame(loop);
  }
  function setOn(v) {
    on = v;
    localStorage.setItem(KEY, v ? '1' : '0');
    if (on) { if (!el) build(); el.style.display = ''; if (!rafId) rafId = requestAnimationFrame(loop); }
    else if (el) el.style.display = 'none';
  }
  addEventListener('keydown', function (e) {
    if (e.shiftKey && (e.key === 'D' || e.key === 'd') && !/input|textarea/i.test(e.target.tagName)) setOn(!on);
  });
  if (on) { build(); rafId = requestAnimationFrame(loop); }
})();
