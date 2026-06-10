/* ============================================================
   FrontM, signature "changing that" transition
   Scroll-pinned, single scroll clock. STAYS DARK throughout
   (reference flips to light mid-way, we deliberately do NOT).
   20 scattered dots -> converge into 2 concentric rings (8
   modules + 12 stakeholders) around the FrontM glyph.
   ============================================================ */
(function () {
  var sec = document.getElementById('transition');
  if (!sec) return;
  var stage = sec.querySelector('.transition-stage');
  var dotsLayer = sec.querySelector('.t-dots-layer');
  var cardP = sec.querySelector('.card-problem');
  var cardS = sec.querySelector('.card-solution');
  var probKick = cardP && cardP.querySelector('.kicker'), probH2 = cardP && cardP.querySelector('h2'), probPar = cardP && cardP.querySelector('p');
  var solKick = cardS && cardS.querySelector('.kicker'), solH2 = cardS && cardS.querySelector('h2'), solPar = cardS && cardS.querySelector('p');
  var glyph = sec.querySelector('.fm-glyph-c');
  var net = sec.querySelector('.t-net');
  var svg = sec.querySelector('.t-svg');
  var canvas = sec.querySelector('.t-signal-canvas');
  var par = sec.querySelector('.t-parallax');
  var horizon = sec.querySelector('.t-horizon');
  var sun = sec.querySelector('.t-sun');
  var ctx = canvas.getContext('2d');
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  var MODS = [
    ['CONNECT', '#01B3F6'], ['ENGAGE', '#6B5FD9'], ['CARE', '#079B33'], ['ENTERTAIN', '#FF6A04'],
    ['INFORM', '#FFC500'], ['TRAIN', '#3CAD33'], ['MAINTAIN', '#435FE8'], ['MANAGE', '#404858']
  ];
  var STK = ['Ship Owners', 'Ship Managers', 'Class Societies', 'Crew Manning', 'Ports & Authorities',
    'Charterers', 'Insurers', 'Regulators', 'Engine OEMs', 'Service Providers', 'Brokers', 'Surveyors'];

  function ico(p) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + p + '</svg>'; }
  var ICONS = {
    'Ship Owners': '<path d="M4 15h16l-2 5H6z"/><path d="M12 3v12"/><path d="M12 6l6 3-6 1z"/>',
    'Ship Managers': '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4h6v3H9z"/><path d="M8.5 12l2 2 4-4"/>',
    'Class Societies': '<path d="M12 3l7 3v5c0 4-3 7-7 9-4-2-7-5-7-9V6z"/><path d="M9 12l2 2 4-4"/>',
    'Crew Manning': '<circle cx="9" cy="9" r="3"/><path d="M3.5 20c0-3 2.7-5 5.5-5s5.5 2 5.5 5"/><path d="M16 7a3 3 0 010 6"/><path d="M20.5 20c0-2.3-1.4-3.9-3.5-4.6"/>',
    'Ports & Authorities': '<circle cx="12" cy="4" r="2"/><path d="M12 6v14"/><path d="M9 9l3-3 3 3"/><path d="M8 11H5c0 5 3 8 7 8s7-3 7-8h-3"/>',
    'Charterers': '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/><path d="M9 12h6M9 16h6"/>',
    'Insurers': '<path d="M12 3v2"/><path d="M3 12a9 9 0 0118 0z"/><path d="M12 12v6a2 2 0 01-4 0"/>',
    'Regulators': '<path d="M12 4v16"/><path d="M7 20h10"/><path d="M4 8h16"/><path d="M4 8l-2.2 5a3 3 0 006.4 0z"/><path d="M20 8l-2.2 5a3 3 0 006.4 0z"/>',
    'Engine OEMs': '<circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.2 5.2l2 2M16.8 16.8l2 2M18.8 5.2l-2 2M7.2 16.8l-2 2"/>',
    'Service Providers': '<path d="M14.7 6.3a4 4 0 00-5.6 5.6L3 18v3h3l6.1-6.1a4 4 0 005.6-5.6l-2.9 2.9-2-2 2.9-2.9Z"/>',
    'Brokers': '<path d="M4 18l5-5 3 3 7-7"/><path d="M15 9h5v5"/>',
    'Surveyors': '<circle cx="11" cy="11" r="6"/><path d="M15.5 15.5L20 20"/><path d="M11 8.5v5M8.5 11h5"/>'
  };

  var R_IN = 19, R_OUT = 33;           // ring radii in vmin
  var nodes = [];                       // {el, ax,ay (vmin ring target), sx,sy (% scatter), kind, color}
  var seed = 7;
  function rnd() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }

  // build ring nodes (8 modules inner, 12 stakeholders outer)
  function buildRing(list, radius, kind, start) {
    for (var i = 0; i < list.length; i++) {
      var ang = (start + i / list.length * 360) * Math.PI / 180;
      var x = Math.cos(ang) * radius, y = Math.sin(ang) * radius;
      var el = document.createElement('div'); el.className = 'node ' + (kind === 'mod' ? 'is-mod' : 'is-stk');
      var color;
      if (kind === 'mod') {
        color = list[i][1];
        el.innerHTML = '<span class="mod" style="--cc:' + color + '"><span class="d"></span>' + list[i][0] + '</span>';
      } else {
        color = '#9A86FF';
        el.innerHTML = '<span class="stk">' + ico(ICONS[list[i]] || '') + list[i] + '</span>';
      }
      el.style.left = x + 'vmin'; el.style.top = y + 'vmin';
      net.appendChild(el);
      nodes.push({ el: el, ax: x, ay: y, kind: kind, color: color, sx: 6 + rnd() * 88, sy: 12 + rnd() * 74 });
    }
  }
  buildRing(MODS, R_IN, 'mod', -90);
  buildRing(STK, R_OUT, 'stk', -90 + 15);

  // scattered drifting dots (one per ring node) in the dots layer
  var dots = [];
  for (var i = 0; i < nodes.length; i++) {
    var d = document.createElement('span'); d.className = 't-dot';
    var c = nodes[i].color, sz = 5 + rnd() * 7;
    d.style.cssText = 'width:' + sz + 'px;height:' + sz + 'px;background:' + c + ';box-shadow:0 0 12px ' + c + ';';
    dotsLayer.appendChild(d);
    dots.push({ el: d, sx: nodes[i].sx, sy: nodes[i].sy, drift: rnd() * Math.PI * 2 });
  }

  function clamp(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function smooth(a, b, x) { var t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); }
  function lerp(a, b, t) { return a + (b - a) * t; }

  // ---- geometry for signal canvas + svg lines ----
  var vmin = 1, cx = 0, cy = 0, sW = 0, sH = 0;
  function geo() {
    sW = stage.clientWidth; sH = stage.clientHeight;
    vmin = Math.min(window.innerWidth, window.innerHeight) / 100;
    cx = sW * 0.5; cy = sH * 0.56;
    canvas.width = sW * Math.min(devicePixelRatio || 1, 2);
    canvas.height = sH * Math.min(devicePixelRatio || 1, 2);
    canvas.style.width = sW + 'px'; canvas.style.height = sH + 'px';
    ctx.setTransform(Math.min(devicePixelRatio || 1, 2), 0, 0, Math.min(devicePixelRatio || 1, 2), 0, 0);
    buildLines();
  }
  function nodePx(n) { return [cx + n.ax * vmin, cy + n.ay * vmin]; }

  // ---- connection lines (center->module blue; module->2 nearest stk purple) ----
  var lines = [];
  function buildLines() {
    svg.setAttribute('viewBox', '0 0 ' + sW + ' ' + sH);
    svg.innerHTML = '';
    lines = [];
    var modNodes = nodes.filter(function (n) { return n.kind === 'mod'; });
    var stkNodes = nodes.filter(function (n) { return n.kind === 'stk'; });
    modNodes.forEach(function (m) {
      var mp = nodePx(m);
      addLine(cx, cy, mp[0], mp[1], 'rgba(1,179,246,0.5)');
      // 2 nearest stakeholders
      var sorted = stkNodes.slice().sort(function (a, b) {
        return dist(m, a) - dist(m, b);
      }).slice(0, 2);
      sorted.forEach(function (s) { var sp = nodePx(s); addLine(mp[0], mp[1], sp[0], sp[1], 'rgba(154,134,255,0.4)'); });
    });
  }
  function dist(a, b) { var dx = a.ax - b.ax, dy = a.ay - b.ay; return dx * dx + dy * dy; }
  function addLine(x1, y1, x2, y2, color) {
    var ln = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    ln.setAttribute('x1', x1); ln.setAttribute('y1', y1); ln.setAttribute('x2', x2); ln.setAttribute('y2', y2);
    ln.setAttribute('stroke', color); ln.setAttribute('stroke-width', '1');
    var len = Math.hypot(x2 - x1, y2 - y1);
    ln.style.strokeDasharray = len; ln.style.strokeDashoffset = len;
    svg.appendChild(ln); lines.push({ el: ln, len: len });
  }

  // ---- signal pulses on the stage canvas (failing -> arriving) ----
  var sigPulses = [];
  function spawnFail() {
    var a = dots[(Math.random() * dots.length) | 0];
    var b = dots[(Math.random() * dots.length) | 0];
    if (a === b) return;
    sigPulses.push({ kind: 'fail', ax: a.sx / 100 * sW, ay: a.sy / 100 * sH, bx: b.sx / 100 * sW, by: b.sy / 100 * sH, t: 0, sp: 0.012, die: 0.45 + Math.random() * 0.3 });
  }
  function spawnArrive() {
    var m = nodes.filter(function (n) { return n.kind === 'mod'; });
    var target = m[(Math.random() * m.length) | 0];
    var tp = nodePx(target);
    sigPulses.push({ kind: 'arrive', ax: cx, ay: cy, bx: tp[0], by: tp[1], t: 0, sp: 0.02 });
  }

  var p = 0, failTimer = 0;
  var mtx = 0, mty = 0, mcx = 0, mcy = 0, hy = 0, hOp = 1;
  var mClientX = -9999, mClientY = -9999;
  function renderCanvas() {
    if (!dynamicOn || !visible) { rafId = 0; return; }   // stop the loop entirely when offscreen; observer restarts it
    ctx.clearRect(0, 0, sW, sH);
    // cursor parallax across the whole scene + scroll-driven curved horizon
    mcx += (mtx - mcx) * 0.06; mcy += (mty - mcy) * 0.06;
    if (par) par.style.transform = 'translate(' + (mcx * 26).toFixed(1) + 'px,' + (mcy * 18).toFixed(1) + 'px)';
    if (horizon) {
      // SEAM WORK: this scene's horizon is the SAME line as the global one (scroll-horizon.js),
      // handed off by a matched-geometry crossfade — never two curves at once. Track the live
      // global crest so entry & exit are positionally invisible; add a gentle rise that is ZERO
      // at both seams; crossfade opacity against the global line; borrow its drifting colour.
      var thVH = window.innerHeight, thBase = 0.54 * thVH;     // .t-horizon crest baseline (bottom:-54vh)
      var H = window.__fmHorizon;
      var thG = (H && isFinite(H.crestY)) ? H.crestY : thBase;
      var thBump = -0.085 * thVH * Math.sin(Math.PI * smooth(0.0, 0.72, p));
      horizon.style.transform = 'translateX(-50%) translateY(' + ((thG + thBump) - thBase).toFixed(1) + 'px)';
      var gMax = (H && H.maxOp) || 0.5, gOp = (H && isFinite(H.opacity)) ? H.opacity : 0;
      var fillIn = clamp(1 - gOp / gMax);                       // 1 when global hidden, 0 when global full
      var recede = lerp(1, 0.16, smooth(0.55, 0.86, p));        // network resolves -> line recedes
      hOp = fillIn * recede;
      horizon.style.opacity = hOp.toFixed(3);
      if (H && H.bloomColor) horizon.style.borderTopColor = H.bloomColor;
    }

    // ---- eclipse sun: rides the curved horizon line at the cursor's x ----
    if (sun) {
      var hr = horizon.getBoundingClientRect();
      var sr0 = stage.getBoundingClientRect();
      var rx = hr.width / 2, ry = hr.height / 2, ccx = hr.left + rx;
      var dxs = mClientX - ccx;
      var onScene = mClientX >= sr0.left && mClientX <= sr0.right && Math.abs(dxs) < rx;
      if (onScene && hOp > 0.18) {
        var cy = hr.top + ry - ry * Math.sqrt(Math.max(0, 1 - (dxs / rx) * (dxs / rx)));
        sun.style.left = (mClientX - sr0.left) + 'px';
        sun.style.top  = (cy - sr0.top) + 'px';
        sun.style.opacity = Math.min(1, hOp).toFixed(3);
      } else {
        sun.style.opacity = '0';
      }
    }

    // ---- per-dot magnetism: ONLY the single closest dot follows the cursor,
    //      handing off one-by-one as the mouse moves ----
    var sr = stage.getBoundingClientRect();
    var inside = mClientX >= sr.left && mClientX <= sr.right && mClientY >= sr.top && mClientY <= sr.bottom;
    var mX = (mClientX - sr.left) / sW * 100, mY = (mClientY - sr.top) / sH * 100;
    var nearest = -1, nbest = 1e9;
    if (inside) {
      for (var di = 0; di < dots.length; di++) {
        var DD = dots[di];
        if (DD.bx == null || (parseFloat(DD.el.style.opacity || '0') < 0.06)) continue;
        var ex = DD.bx - mX, ey = DD.by - mY, e2 = ex * ex + ey * ey;
        if (e2 < nbest) { nbest = e2; nearest = di; }
      }
    }
    for (var dj = 0; dj < dots.length; dj++) {
      var D = dots[dj];
      if (D.bx == null) continue;
      var tox = 0, toy = 0, tsc = 1;
      if (dj === nearest) { tox = (mX - D.bx) * 0.82; toy = (mY - D.by) * 0.82; tsc = 1.8; }
      D.ox = (D.ox || 0) + (tox - (D.ox || 0)) * 0.14;
      D.oy = (D.oy || 0) + (toy - (D.oy || 0)) * 0.14;
      D.sc = (D.sc || 1) + (tsc - (D.sc || 1)) * 0.14;
      D.el.style.left = (D.bx + D.ox) + '%';
      D.el.style.top = (D.by + D.oy) + '%';
      D.el.style.transform = 'translate(-50%,-50%) scale(' + D.sc.toFixed(2) + ')';
    }
    // failing signals during 0.08-0.52, rate rises mid-section
    if (p > 0.08 && p < 0.54) {
      var rate = 0.06 + smooth(0.1, 0.5, p) * 0.16;
      if (Math.random() < rate && sigPulses.length < 14) spawnFail();
    }
    // arriving signals during network phase
    if (p > 0.86 && Math.random() < 0.08 && sigPulses.length < 10) spawnArrive();

    for (var i = sigPulses.length - 1; i >= 0; i--) {
      var s = sigPulses[i]; s.t += s.sp;
      if (s.kind === 'fail') {
        if (s.t >= s.die) { sigPulses.splice(i, 1); continue; }
        var tt = s.t / s.die;
        var x = lerp(s.ax, s.bx, s.t), y = lerp(s.ay, s.by, s.t);
        // color sent(orange) -> lost(grey), fade out as it dies
        var col = mix('#FF6A04', '#6B7280', tt);
        var al = (1 - tt) * 0.9;
        dot(x, y, col, al, 2.4);
      } else {
        if (s.t >= 1) { sigPulses.splice(i, 1); bloom(s.bx, s.by); continue; }
        var x2 = lerp(s.ax, s.bx, s.t), y2 = lerp(s.ay, s.by, s.t);
        var col2 = mix('#01B3F6', '#9A86FF', s.t);
        dot(x2, y2, col2, Math.sin(s.t * Math.PI), 2.6);
      }
    }
    // arrival blooms
    for (i = blooms.length - 1; i >= 0; i--) {
      var bl = blooms[i]; bl.t += 0.035;
      if (bl.t >= 1) { blooms.splice(i, 1); continue; }
      var rr = 4 + bl.t * 30;
      ctx.strokeStyle = 'rgba(154,134,255,' + ((1 - bl.t) * 0.6).toFixed(3) + ')';
      ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(bl.x, bl.y, rr, 0, 6.2832); ctx.stroke();
    }
    rafId = requestAnimationFrame(renderCanvas);
  }
  var blooms = [];
  function bloom(x, y) { blooms.push({ x: x, y: y, t: 0 }); }
  function dot(x, y, color, alpha, r) {
    ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = color; ctx.shadowColor = color; ctx.shadowBlur = 12;
    ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fill(); ctx.restore();
  }
  function mix(c1, c2, t) {
    var a = hx(c1), b = hx(c2);
    return 'rgb(' + Math.round(lerp(a[0], b[0], t)) + ',' + Math.round(lerp(a[1], b[1], t)) + ',' + Math.round(lerp(a[2], b[2], t)) + ')';
  }
  function hx(h) { h = h.replace('#', ''); return [parseInt(h.substr(0, 2), 16), parseInt(h.substr(2, 2), 16), parseInt(h.substr(4, 2), 16)]; }

  // ---- scroll driver ----
  function update() {
    var r = sec.getBoundingClientRect();
    var total = sec.offsetHeight - window.innerHeight;
    p = total > 0 ? clamp(-r.top / total) : 0;

    // 1. chaos -> 9. converge. dots scatter then move to ring targets
    var gather = smooth(0.78, 0.95, p);
    var livelier = smooth(0.50, 0.58, p) * (1 - smooth(0.78, 0.9, p));
    var dotFade = 1 - smooth(0.84, 0.95, p);
    for (var i = 0; i < dots.length; i++) {
      var dt = dots[i], nd = nodes[i];
      var ringX = (cx + nd.ax * vmin) / sW * 100;
      var ringY = (cy + nd.ay * vmin) / sH * 100;
      var wob = reduced ? 0 : Math.sin(performance.now() * 0.0006 + dt.drift) * (1.5 + livelier * 4);
      var x = lerp(dt.sx + wob, ringX, gather);
      var y = lerp(dt.sy + wob * 0.6, ringY, gather);
      dt.el.style.left = x + '%'; dt.el.style.top = y + '%';
      dt.el.style.opacity = dotFade;
      dt.bx = x; dt.by = y;
    }

    // 2/4. problem card in then slides left + shrinks + fades
    var pin = smooth(0.08, 0.16, p);
    var pout = smooth(0.40, 0.48, p);
    cardP.style.opacity = pin * (1 - pout);
    cardP.style.transform = 'translate(calc(-50% - ' + (pout * 120) + 'px), -50%) scale(' + lerp(1, 0.78, pout) + ')';
    // text scans in from the left AFTER the panel has appeared, staggered
    scanIn(probKick, 0.15, 0.22, p);
    scanIn(probH2, 0.18, 0.29, p);
    scanIn(probPar, 0.24, 0.34, p);

    // 6/7/8. solution card fades in, then its glass chrome + kicker + sub dissolve,
    // leaving the SAME h2 which lifts center -> top. One element => no ghost text.
    var sin = smooth(0.54, 0.64, p);
    var chrome = smooth(0.66, 0.80, p);          // glass / kicker / sub fade out
    var hRise = smooth(0.78, 0.92, p);           // lone headline lifts to the top
    cardS.style.opacity = sin;
    cardS.style.setProperty('--chrome', (1 - chrome).toFixed(3));
    var rise = -hRise * window.innerHeight * 0.34;
    var sSc = lerp(0.96, 1, sin) * lerp(1, 1.08, hRise);
    cardS.style.transform = 'translate(-50%, calc(-50% + ' + rise.toFixed(1) + 'px)) scale(' + sSc.toFixed(3) + ')';
    // solution text scans in from the left once its panel is in, before the chrome dissolves
    scanIn(solKick, 0.55, 0.61, p);
    scanIn(solH2, 0.575, 0.66, p);
    scanIn(solPar, 0.59, 0.66, p);

    // 9. glyph + rings bloom
    var gShow = smooth(0.84, 0.93, p);
    glyph.style.opacity = gShow;
    glyph.style.transform = 'translate(-50%,-50%) scale(' + lerp(0.4, 1, gShow) + ')';
    net.style.setProperty('--gnet', gShow.toFixed(3));
    for (i = 0; i < nodes.length; i++) {
      var delay = nodes[i].kind === 'mod' ? 0 : 0.04;
      var g = smooth(0.86 + delay, 0.97, p);
      nodes[i].el.style.setProperty('--g', g.toFixed(3));
    }
    // connection lines draw in
    var lineDraw = smooth(0.86, 0.97, p);
    for (i = 0; i < lines.length; i++) { lines[i].el.style.strokeDashoffset = lines[i].len * (1 - lineDraw); }

    // curved horizon position + opacity are now driven each frame in renderCanvas() from the
    // live global crest (__fmHorizon), so the global<->transition handoff is seamless. (no-op here)
  }

  function scanIn(el, a, b, prog) {
    if (!el || !el.style) return;
    var r = smooth(a, b, prog);
    var clip = 'inset(0 ' + ((1 - r) * 102).toFixed(1) + '% 0 0)';
    el.style.clipPath = clip; el.style.webkitClipPath = clip;
    el.style.transform = 'translateX(' + ((1 - r) * -20).toFixed(1) + 'px)';
  }

  var ticking = false;
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(function () { update(); ticking = false; }); } }
  window.addEventListener('resize', function () { if (dynamicOn) { geo(); onScroll(); } }, { passive: true });
  window.addEventListener('pointermove', function (e) {
    mtx = (e.clientX / window.innerWidth - 0.5) * 2;
    mty = (e.clientY / window.innerHeight - 0.5) * 2;
    mClientX = e.clientX; mClientY = e.clientY;
  }, { passive: true });

  // ---- mode switching: full scroll choreography on desktop, clean static
  //      layout on narrow screens / reduced-motion (no canvas, no pin) ----
  var narrowMQ = matchMedia('(max-width: 980px)');
  var dynamicOn = false, rafId = 0, visible = true;

  function clearInline() {
    [cardP, cardS, glyph].forEach(function (el) { if (el) { el.style.opacity = ''; el.style.transform = ''; } });
    if (cardS) cardS.style.removeProperty('--chrome');
    [probKick, probH2, probPar, solKick, solH2, solPar].forEach(function (el) {
      if (el) { el.style.clipPath = ''; el.style.webkitClipPath = ''; el.style.transform = ''; }
    });
    if (net) net.style.removeProperty('--gnet');
    nodes.forEach(function (n) { n.el.style.removeProperty('--g'); n.el.style.transform = ''; });
    dots.forEach(function (d) { d.el.style.opacity = ''; });
    if (par) par.style.transform = '';
    if (horizon) { horizon.style.transform = ''; horizon.style.opacity = ''; }
    if (sun) sun.style.opacity = '';
  }

  function startDynamic() {
    if (dynamicOn) return;
    dynamicOn = true;
    sec.classList.remove('t-static');
    window.addEventListener('scroll', onScroll, { passive: true });
    geo(); update();
    if (visible && !rafId) rafId = requestAnimationFrame(renderCanvas);
  }
  function stopDynamic() {
    dynamicOn = false;
    window.removeEventListener('scroll', onScroll);
    if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
    ctx.clearRect(0, 0, sW, sH);
    clearInline();
    sec.classList.add('t-static');
  }
  function applyMode() { if (narrowMQ.matches || reduced) stopDynamic(); else startDynamic(); }

  // pause the canvas loop whenever the section is offscreen (no per-frame dot churn / layout thrash
  // for the page's whole life). rootMargin 0 so it stays OFF while the hero is showing — running it
  // there forces per-frame getBoundingClientRect layout that stalls the hero's reveal transitions.
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (e) {
      visible = e[0].isIntersecting;
      if (visible && dynamicOn && !rafId) rafId = requestAnimationFrame(renderCanvas);
    }, { rootMargin: '0px' }).observe(sec);
  }

  applyMode();
  (narrowMQ.addEventListener ? narrowMQ.addEventListener('change', applyMode) : narrowMQ.addListener(applyMode));
  setTimeout(function () { if (dynamicOn) { geo(); update(); } }, 250);
})();
