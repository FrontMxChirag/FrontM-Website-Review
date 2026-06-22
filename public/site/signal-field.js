/* ============================================================
   FrontM, "Signal Field" global background  (Rework v3)
   SKY (above the curve): drifting brand stars + faint proximity mesh.
   OCEAN (below, geometry from window.__fmHorizon):
     gradient → caustics (banded Voronoi web, depth-scaled)
             → fleet (every node, placed by its own depth) + sonar
             → glade (binding-glow column + glint pool under the bloom).
   One rAF loop, no second simulation. Subtlety target = the sky mesh.
   ============================================================ */
(function () {
  var canvas = document.getElementById('signal-field');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  // per-page density knob: data-density on the canvas scales node + ship counts.
  // Defaults to 1 (homepage et al. unchanged); legal pages set it to 2.
  var DENS = (canvas.dataset && parseFloat(canvas.dataset.density) > 0) ? parseFloat(canvas.dataset.density) : 1;
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var narrow = matchMedia('(max-width: 980px)').matches;

  var BRAND = ['#01B3F6', '#3CAD33', '#FFC500', '#FF6A04', '#9A86FF', '#1FE6D4'];
  var W = 0, H = 0, DPR = Math.min(devicePixelRatio || 1, 2);

  var nodes = [];
  var sp = [];
  var conns = [];
  var virtuals = [], activeV = 0;     // virtual top-up fleet + smoothed shown count (B/C/D)
  var links = {}, lastLink = 0;       // per-link lifecycle state (E)
  var mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
  var SEG = 26;

  // caustics
  var CAUS = [], pat = [], causBuf = null, causCtx = null, TS = 384, causMul = 1;
  try {
    var _cq = new URLSearchParams(location.search).get('caustics');
    if (_cq != null) causMul = Math.max(0, Math.min(8, parseFloat(_cq) || 1));
  } catch (e) {}

  // sonar
  var sonars = [], nextSonar = 0, MAX_SONAR = 3;

  // glade
  var glints = [], glintSprite = null, glintRGB = [0, 0, 0], lastGlade = 0;

  function resize() {
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = W * DPR; canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    if (!causBuf) { causBuf = document.createElement('canvas'); causCtx = causBuf.getContext('2d'); }
    causBuf.width = Math.max(1, W); causBuf.height = Math.max(1, H);
  }

  function rand(a, b) { return a + Math.random() * (b - a); }
  function hexA(hex, a) {
    var h = hex.replace('#', '');
    return 'rgba(' + parseInt(h.substr(0, 2), 16) + ',' + parseInt(h.substr(2, 2), 16) + ',' + parseInt(h.substr(4, 2), 16) + ',' + (a < 0 ? 0 : a).toFixed(3) + ')';
  }
  function parseRGB(s) { var m = /(\d+)[^\d]+(\d+)[^\d]+(\d+)/.exec(s || ''); return m ? [+m[1], +m[2], +m[3]] : [31, 230, 212]; }
  function rgba(c, a) { return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + (a < 0 ? 0 : a).toFixed(3) + ')'; }
  function lerpAngle(a, b, t) {
    var d = b - a;
    while (d > Math.PI) d -= 2 * Math.PI;
    while (d < -Math.PI) d += 2 * Math.PI;
    return a + d * t;
  }

  var glowCache = {};
  function glowSprite(color) {
    if (glowCache[color]) return glowCache[color];
    var S = 64, oc = document.createElement('canvas'); oc.width = oc.height = S;
    var o = oc.getContext('2d');
    var h = color.replace('#', '');
    var R = parseInt(h.substr(0, 2), 16), G = parseInt(h.substr(2, 2), 16), B = parseInt(h.substr(4, 2), 16);
    var g = o.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
    g.addColorStop(0, 'rgba(' + R + ',' + G + ',' + B + ',0.9)');
    g.addColorStop(0.25, 'rgba(' + R + ',' + G + ',' + B + ',0.45)');
    g.addColorStop(1, 'rgba(' + R + ',' + G + ',' + B + ',0)');
    o.fillStyle = g; o.fillRect(0, 0, S, S);
    glowCache[color] = oc; return oc;
  }

  function buildNodes() {
    nodes = [];
    var count = narrow
      ? Math.round(DENS * Math.min(12, Math.max(8, (W * H) / 92000)))
      : Math.round(DENS * Math.min(32, Math.max(14, (W * H) / 68000)));
    for (var i = 0; i < count; i++) {
      var isPort = Math.random() < 0.16;
      var vx = rand(-0.012, 0.012), vy = rand(-0.012, 0.012);
      nodes.push({
        x: Math.random(), y: Math.random(),
        vx: vx, vy: vy,
        r: isPort ? rand(2.6, 3.4) : rand(1.4, 2.6),
        port: isPort,
        c: BRAND[(Math.random() * BRAND.length) | 0],
        ph: Math.random() * Math.PI * 2,
        depth: Math.random(),                          // stable vertical place in the ocean band
        offsetX: 0, psx: null, psy: null               // 2x parallax offset + previous ship pos
      });
    }
  }

  function buildVirtuals() {
    virtuals = [];
    for (var i = 0; i < Math.round(16 * DENS); i++) {
      virtuals.push({
        bf: Math.random(), x: Math.random(),
        vx: rand(-0.012, 0.012), vy: rand(-0.012, 0.012),
        c: BRAND[(Math.random() * BRAND.length) | 0],
        fade: 0, hdg: null
      });
    }
  }

  // ---- caustic tiles: Voronoi F2−F1 edge web. Toroidal distance → seamless.
  //      ~40 points → smaller cells; tight smoothstep → thin filaments. ----
  function bakeCaustics() {
    CAUS = []; pat = [];
    for (var k = 0; k < 2; k++) {
      var S = TS, oc = document.createElement('canvas'); oc.width = oc.height = S;
      var o = oc.getContext('2d'), img = o.createImageData(S, S), dt = img.data;
      var N = 40, fx = [], fy = [], q;
      for (q = 0; q < N; q++) { fx.push(Math.random() * S); fy.push(Math.random() * S); }
      for (var y = 0; y < S; y++) {
        for (var x = 0; x < S; x++) {
          var f1 = 1e9, f2 = 1e9;
          for (q = 0; q < N; q++) {
            var dx = x - fx[q]; if (dx > S / 2) dx -= S; else if (dx < -S / 2) dx += S;
            var dy = y - fy[q]; if (dy > S / 2) dy -= S; else if (dy < -S / 2) dy += S;
            var d2 = dx * dx + dy * dy;
            if (d2 < f1) { f2 = f1; f1 = d2; } else if (d2 < f2) { f2 = d2; }
          }
          var e = Math.sqrt(f2) - Math.sqrt(f1);
          var edgeW = 1.4 * (0.7 + 0.6 * Math.sin((x + y) * 0.05));  // thin filaments, slight breathing width
          var tt = e / edgeW; if (tt < 0) tt = 0; if (tt > 1) tt = 1;
          var b = 1 - (tt * tt * (3 - 2 * tt));
          var idx = (y * S + x) * 4;
          dt[idx] = 20; dt[idx + 1] = 200; dt[idx + 2] = 235;
          dt[idx + 3] = (b * 255) | 0;
        }
      }
      o.putImageData(img, 0, 0);
      CAUS.push(oc);
      pat.push((causCtx || ctx).createPattern(oc, 'repeat'));
    }
  }

  function pathBelow(yAt) {
    ctx.beginPath();
    ctx.moveTo(0, yAt(0));
    for (var s = 1; s <= SEG; s++) { var x = W * s / SEG; ctx.lineTo(x, yAt(x)); }
    ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath();
  }
  function pathAbove(yAt) {
    ctx.beginPath();
    ctx.moveTo(0, 0); ctx.lineTo(W, 0); ctx.lineTo(W, yAt(W));
    for (var s = SEG - 1; s >= 0; s--) { var x = W * s / SEG; ctx.lineTo(x, yAt(x)); }
    ctx.closePath();
  }

  // ---- caustics: depth-scaled bands (0.5x under crest → 1.2x at the bottom), two
  //      cross-faded tiles per band, slow diagonal drift. ≤ 2×6 fills/frame. ----
  function drawCaustics(now, crest, oA) {
    if (narrow || !pat.length || !causCtx) return;
    var oceanH = H - crest; if (oceanH < 80) return;
    var bx = causCtx;
    bx.setTransform(1, 0, 0, 1, 0, 0);
    bx.clearRect(0, 0, W, H);
    var dr = reduced ? 0 : 1;
    var cf = reduced ? 0.5 : 0.5 + 0.5 * Math.sin(now * 0.00011);
    var ox = now * 0.0040 * dr, oy = now * 0.0026 * dr;
    var ox2 = -now * 0.0034 * dr, oy2 = -now * 0.0022 * dr;
    var BANDS = 5;
    for (var bI = 0; bI < BANDS; bI++) {
      var y0 = crest + oceanH * (bI / BANDS), y1 = crest + oceanH * ((bI + 1) / BANDS);
      var scale = 0.5 + 0.7 * ((bI + 0.5) / BANDS);      // 0.5x (far) → ~1.2x (near)
      fillBand(bx, pat[0], scale, ox, oy, y0, y1, 1 - cf);
      fillBand(bx, pat[1], scale, ox2, oy2, y0, y1, cf);
    }

    // soft fade-in under the crest; carry the web to the bottom (depth perspective), slight bottom dim
    bx.globalCompositeOperation = 'destination-in';
    var c0 = Math.max(0, Math.min(1, crest / H));
    var c1 = Math.max(c0 + 0.001, Math.min(1, (crest + oceanH * 0.10) / H));
    var g = bx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, 'rgba(255,255,255,0)');
    if (c0 - 0.001 > 0) g.addColorStop(c0 - 0.001, 'rgba(255,255,255,0)');
    g.addColorStop(c0, 'rgba(255,255,255,0)');
    g.addColorStop(c1, 'rgba(255,255,255,1)');
    g.addColorStop(1, 'rgba(255,255,255,0.8)');
    bx.fillStyle = g; bx.fillRect(0, 0, W, H);
    bx.globalCompositeOperation = 'source-over';

    ctx.globalAlpha = Math.min(1, 0.06 * oA * causMul);    // default ceiling pulled to 0.06
    ctx.drawImage(causBuf, 0, 0);
    ctx.globalAlpha = 1;
  }
  function fillBand(bx, p, scale, ox, oy, y0, y1, alpha) {
    if (p && p.setTransform) {
      try { p.setTransform(new DOMMatrix([scale, 0, 0, scale, ox % (TS * scale), oy % (TS * scale)])); } catch (e) {}
    }
    bx.save();
    bx.globalAlpha = alpha < 0 ? 0 : alpha;
    bx.fillStyle = p;
    bx.fillRect(0, y0, W, y1 - y0);
    bx.restore();
  }

  // ---- glint sprite: soft-edged streak, baked white then tinted; rebaked only when
  //      the bloom colour drifts past a threshold. ----
  function bakeGlint(c) {
    var w = 64, h = 16, oc = document.createElement('canvas'); oc.width = w; oc.height = h;
    var o = oc.getContext('2d');
    var gx = o.createLinearGradient(0, 0, w, 0);
    gx.addColorStop(0, 'rgba(255,255,255,0)'); gx.addColorStop(0.5, 'rgba(255,255,255,1)'); gx.addColorStop(1, 'rgba(255,255,255,0)');
    o.fillStyle = gx; o.fillRect(0, 0, w, h);
    var gy = o.createLinearGradient(0, 0, 0, h);
    gy.addColorStop(0, 'rgba(255,255,255,0)'); gy.addColorStop(0.5, 'rgba(255,255,255,1)'); gy.addColorStop(1, 'rgba(255,255,255,0)');
    o.globalCompositeOperation = 'destination-in'; o.fillStyle = gy; o.fillRect(0, 0, w, h);
    o.globalCompositeOperation = 'source-in'; o.fillStyle = 'rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')'; o.fillRect(0, 0, w, h);
    glintSprite = oc; glintRGB = c.slice();
  }

  // ---- glade: binding-glow column + glint pool under the bloom (bloomX) ----
  function drawGlade(now, yAt, oA, HZ) {
    if (narrow) return;
    var bxp = HZ.bloomX != null ? HZ.bloomX : W / 2;
    var crgb = parseRGB(HZ.bloomColor);
    var ba = HZ.bloomAlpha != null ? HZ.bloomAlpha : 0.8;
    var top = yAt(bxp), oceanH = H - top, span = oceanH * 0.33;
    if (span < 30) return;
    var colW = Math.min(W * 0.5, 360);

    // Layer A — binding glow column (brightest just under the line, gone by ~top third)
    var rg = ctx.createRadialGradient(bxp, top, 0, bxp, top, span);
    rg.addColorStop(0, rgba(crgb, 0.16 * ba * oA));
    rg.addColorStop(0.5, rgba(crgb, 0.05 * ba * oA));
    rg.addColorStop(1, rgba(crgb, 0));
    ctx.fillStyle = rg; ctx.fillRect(bxp - colW, top, colW * 2, span);

    // Layer B — glint pool
    if (reduced) return;
    if (!glintSprite || Math.abs(crgb[0] - glintRGB[0]) + Math.abs(crgb[1] - glintRGB[1]) + Math.abs(crgb[2] - glintRGB[2]) > 24) bakeGlint(crgb);
    var dt = lastGlade ? Math.min(0.05, (now - lastGlade) / 1000) : 0.016; lastGlade = now;
    var t = now * 0.001;
    while (glints.length < 20) glints.push(spawnGlint(top, span, colW, bxp));
    for (var i = glints.length - 1; i >= 0; i--) {
      var gl = glints[i];
      gl.t += dt / gl.dur;
      if (gl.t >= 1) { glints[i] = spawnGlint(top, span, colW, bxp); continue; }
      var life = gl.t < 0.3 ? gl.t / 0.3 : (gl.t > 0.7 ? (1 - gl.t) / 0.3 : 1);   // fade in → hold → out
      var depth = (gl.y - top) / span;                                            // 0 near line → 1 deep
      var sway = Math.sin(gl.y * 0.05 + t * 1.4) * 6 * depth;
      var a = life * 0.5 * ba * oA * (1 - 0.55 * depth);
      if (a < 0.004) continue;
      ctx.globalAlpha = a;
      ctx.drawImage(glintSprite, gl.x + sway - gl.len / 2, gl.y - gl.h / 2, gl.len, gl.h);
    }
    ctx.globalAlpha = 1;
  }
  function spawnGlint(top, span, colW, bxp) {
    var y = top + Math.random() * span;
    var depth = (y - top) / span;
    var spread = colW * (0.45 + 0.85 * depth);                 // footprint widens with depth
    return {
      x: bxp + (Math.random() * 2 - 1) * spread,
      y: y,
      len: (40 - 28 * depth) * (0.55 + 0.45 * Math.random()),  // shorter with depth
      h: 1 + (1 - depth),                                       // 1–2px
      t: Math.random() * 0.6,                                   // staggered start
      dur: 1 + Math.random() * 2                                // 1–3s
    };
  }

  var lastFrame = 0;

  // ---- the reflection fleet: every sky star mirrored straight through the curve
  //   and drawn as a vessel (ry = 2·yAt(x) − star_y), 1:1, dimmer + wavering with depth,
  //   heading = the star's mirrored motion. The ships ARE the reflection.
  //   A virtual top-up (B/C/D) keeps the fleet populated when the sky is small. ----
  function drawVessel(x, y, hdg, c, a) {
    ctx.save();
    ctx.translate(x, y); ctx.rotate(hdg);
    ctx.beginPath();
    ctx.moveTo(6.5, 0); ctx.lineTo(1, -2.3); ctx.lineTo(-5, -1.9);
    ctx.lineTo(-5, 1.9); ctx.lineTo(1, 2.3); ctx.closePath();
    ctx.fillStyle = hexA(c, a); ctx.fill();
    ctx.restore();
  }
  function drawReflectionFleet(now, yAt, oA, WAVE) {
    var ships = {}, n = 0, i;
    // --- natural mirrors: every visible sky star reflected through the curve ---
    for (i = 0; i < nodes.length; i++) {
      var nd = nodes[i], p = sp[i], yy = yAt(p[0]);
      if (p[1] >= yy) continue;                          // only sky stars cast a reflection
      var bandH = H - yy; if (bandH < 40) continue;
      var ry = 2 * yy - p[1]; if (ry > H) continue;       // mirror through the curve
      var depth = Math.min(1, (ry - yy) / bandH);
      var fade = Math.min(1, (bandH - 30) / 50) * oA * (1 - 0.4 * depth);
      if (fade <= 0.01) continue;
      var rx = p[0] + (reduced ? 0 : Math.sin(ry * 0.018 + WAVE) * 1.6);
      var tgt = Math.atan2(-(nd.vy * H), nd.vx * W);
      nd.hdg = (reduced || nd.hdg == null) ? tgt : lerpAngle(nd.hdg, tgt, 0.06);
      drawVessel(rx, ry, nd.hdg, nd.c, 0.9 * fade);
      ships[i] = { x: rx, y: ry, c: nd.c, fade: fade }; n++;
    }
    // --- virtual top-up: seed extra reflections so the fleet stays full when the
    //     sky is small. Sources sit in the band that mirrors into the visible ocean:
    //     y ∈ [2·hN−1, hN]  (self-extinguishes mid-scroll where natural already covers). ---
    var HZ = window.__fmHorizon || {};
    var hN = (HZ.crestY || H) / H;
    var START = HZ.start || 0.86, REST = HZ.rest || 0.20;
    var ppF = Math.max(0, Math.min(1, (START - hN) / (START - REST)));
    var floorN = Math.round((narrow ? 0.6 : 1) * (5 + ppF * 8) * DENS);   // top ~5 → rest ~13 (×DENS)
    var want = Math.max(0, floorN - n);
    activeV += (want - activeV) * 0.10;                            // ease so ships don't pop
    var showV = Math.round(activeV), drawn = 0;
    if (!reduced && showV > 0) {
      var bTop = 2 * hN - 1, bBot = hN;
      for (i = 0; i < virtuals.length && drawn < showV; i++) {
        var v = virtuals[i];
        v.x += v.vx * 0.0016 * 16;
        if (v.x < -0.05) v.x = 1.05; if (v.x > 1.05) v.x = -0.05;
        var vx = v.x * W, yy2 = yAt(vx);
        var srcY = (bTop + v.bf * (bBot - bTop)) * H;
        var ry2 = 2 * yy2 - srcY, bandH2 = H - yy2;
        if (ry2 <= yy2 + 2 || ry2 > H || bandH2 < 40) { v.fade += (0 - v.fade) * 0.1; continue; }
        var depth2 = Math.min(1, (ry2 - yy2) / bandH2);
        var tgtFade = Math.min(1, (bandH2 - 30) / 50) * oA * (1 - 0.4 * depth2);
        v.fade += (tgtFade - v.fade) * 0.10;                       // fade in/out, no pop
        if (v.fade <= 0.01) continue;
        var rx2 = vx + (reduced ? 0 : Math.sin(ry2 * 0.018 + WAVE) * 1.6);
        var tgt2 = Math.atan2(-(v.vy * H), v.vx * W);
        v.hdg = (v.hdg == null) ? tgt2 : lerpAngle(v.hdg, tgt2, 0.06);
        drawVessel(rx2, ry2, v.hdg, v.c, 0.9 * v.fade);
        ships['v' + drawn] = { x: rx2, y: ry2, c: v.c, fade: v.fade }; drawn++;
      }
    }
    return { ships: ships, n: n + drawn, nat: n };
  }

  function tick(now) {
    if (!reduced) requestAnimationFrame(tick);
    if (narrow && !reduced && now - lastFrame < 33) return;
    lastFrame = now;

    mouse.x += (mouse.tx - mouse.x) * 0.08;
    mouse.y += (mouse.ty - mouse.y) * 0.08;

    ctx.clearRect(0, 0, W, H);

    if (mouse.x > -1000) {
      var g1 = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, Math.max(W, H) * 0.34);
      g1.addColorStop(0, 'rgba(255,150,70,0.06)'); g1.addColorStop(1, 'rgba(255,150,70,0)');
      ctx.fillStyle = g1; ctx.fillRect(0, 0, W, H);
      var mx2 = W - mouse.x, my2 = H - mouse.y;
      var g2 = ctx.createRadialGradient(mx2, my2, 0, mx2, my2, Math.max(W, H) * 0.32);
      g2.addColorStop(0, 'rgba(154,134,255,0.07)'); g2.addColorStop(1, 'rgba(154,134,255,0)');
      ctx.fillStyle = g2; ctx.fillRect(0, 0, W, H);
    }

    var thresh = 0.13, i, j;
    for (i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      if (!reduced) {
        n.x += n.vx * 0.0016 * 16; n.y += n.vy * 0.0016 * 16;
        if (n.x < -0.05) n.x = 1.05; if (n.x > 1.05) n.x = -0.05;
        if (n.y < -0.05) n.y = 1.05; if (n.y > 1.05) n.y = -0.05;
      }
      sp[i] = [n.x * W, n.y * H];
    }
    // ---- proximity mesh with link lifecycle (E): dormant→connecting→held→releasing→cooldown.
    //      Max 2 concurrent links per star; a ~65% floor keeps the mesh feeling alive. ----
    conns.length = 0;
    if (reduced) {
      for (i = 0; i < nodes.length; i++) for (j = i + 1; j < nodes.length; j++) {
        var dxr = nodes[i].x - nodes[j].x, dyr = nodes[i].y - nodes[j].y, dr = Math.sqrt(dxr * dxr + dyr * dyr);
        if (dr < thresh) conns.push({ i: i, j: j, a: (1 - dr / thresh) * 0.13 });
      }
    } else {
      var dtL = lastLink ? Math.min(0.05, (now - lastLink) / 1000) : 0.016; lastLink = now;
      var elig = {}, deg = {}, eligCount = 0, lk, pr;
      for (i = 0; i < nodes.length; i++) deg[i] = 0;
      for (i = 0; i < nodes.length; i++) for (j = i + 1; j < nodes.length; j++) {
        var dx2 = nodes[i].x - nodes[j].x, dy2 = nodes[i].y - nodes[j].y, d2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
        if (d2 < thresh) { elig[i + '_' + j] = (1 - d2 / thresh); eligCount++; }
      }
      var activeCount = 0;
      for (lk in links) {
        var L = links[lk]; L.t += dtL; pr = lk.split('_');
        if (L.phase === 'connecting') { if (L.t >= L.dur) { L.phase = 'held'; L.t = 0; L.dur = rand(4, 10); } }
        else if (L.phase === 'held') { if (!elig[lk] || L.t >= L.dur) { L.phase = 'releasing'; L.t = 0; L.dur = 0.8; } }
        else if (L.phase === 'releasing') { if (L.t >= L.dur) { L.phase = 'cooldown'; L.t = 0; L.dur = rand(2, 6); } }
        else if (L.phase === 'cooldown') { if (L.t >= L.dur) { delete links[lk]; continue; } }
        if (L.phase === 'connecting' || L.phase === 'held') { deg[+pr[0]]++; deg[+pr[1]]++; activeCount++; }
      }
      var needFloor = activeCount < 0.65 * eligCount;
      for (lk in elig) {
        if (links[lk]) continue;
        pr = lk.split('_'); var a2 = +pr[0], b2 = +pr[1];
        if (deg[a2] >= 2 || deg[b2] >= 2) continue;
        if (needFloor || Math.random() < 0.02) {
          links[lk] = { phase: 'connecting', t: 0, dur: rand(0.6, 1.0) };
          deg[a2]++; deg[b2]++; activeCount++;
          if (activeCount >= 0.65 * eligCount) needFloor = false;
        }
      }
      for (lk in links) {
        var L2 = links[lk]; var base = elig[lk]; if (base == null) base = 0.4;
        var env = L2.phase === 'connecting' ? (L2.t / L2.dur)
                : L2.phase === 'held' ? 1
                : L2.phase === 'releasing' ? (1 - L2.t / L2.dur) : 0;
        if (env <= 0) continue;
        pr = lk.split('_');
        conns.push({ i: +pr[0], j: +pr[1], a: base * 0.13 * env });
      }
    }

    var HZ = window.__fmHorizon;
    var ocean = !!(HZ && HZ.yAt && HZ.opacity > 0.005);
    var yAt = ocean ? HZ.yAt : null;
    var oA = ocean ? Math.min(1, HZ.opacity / (HZ.maxOp || 0.5)) : 0;
    var WAVE = reduced ? 0 : now * 0.001;

    // ===================== OCEAN =====================
    if (ocean) {
      var crest = HZ.crestY;
      ctx.save();
      pathBelow(yAt); ctx.clip();

      var grad = ctx.createLinearGradient(0, crest, 0, H);
      grad.addColorStop(0, 'rgba(10,11,30,0)');
      grad.addColorStop(0.45, hexA('#070815', 0.55 * oA));
      grad.addColorStop(1, hexA('#05060F', 0.94 * oA));
      ctx.fillStyle = grad; ctx.fillRect(0, crest - 2, W, H - crest + 2);

      drawCaustics(now, crest, oA);

      // the ships ARE the reflection — every sky star mirrored through the curve, 1:1,
      // plus a virtual top-up so the fleet stays populated when the sky is small.
      var _fleet = drawReflectionFleet(now, yAt, oA, WAVE);
      var shipScreen = _fleet.ships, shipCount = _fleet.n;
      // F: mirrored constellation events — when both endpoints of a sky link have a TRUE
      //    reflection (integer keys; virtual 'vN' ships are skipped), draw a faint
      //    counterpart line between the ships at ~28% of the sky link's opacity.
      ctx.lineWidth = 1;
      for (var fm = 0; fm < conns.length; fm++) {
        var fc = conns[fm], sa = shipScreen[fc.i], sb = shipScreen[fc.j];
        if (!sa || !sb) continue;
        ctx.strokeStyle = 'rgba(169,155,255,' + (fc.a * 0.28).toFixed(3) + ')';
        ctx.beginPath(); ctx.moveTo(sa.x, sa.y); ctx.lineTo(sb.x, sb.y); ctx.stroke();
      }

      // sonar — global scheduler: 2–3 rings across the whole fleet, never silent
      if (!reduced) {
        for (i = sonars.length - 1; i >= 0; i--) {
          sonars[i].t += sonars[i].sp * 0.016;
          if (sonars[i].t >= 1 || !shipScreen[sonars[i].idx]) sonars.splice(i, 1);
        }
        if (sonars.length < MAX_SONAR && now >= nextSonar) {
          var pool = [];
          for (var key in shipScreen) {
            var used = false;
            for (var qq = 0; qq < sonars.length; qq++) if (sonars[qq].idx == key) { used = true; break; }
            if (!used) pool.push(key);
          }
          if (pool.length) {
            sonars.push({ idx: pool[(Math.random() * pool.length) | 0], t: 0, sp: rand(0.30, 0.40) });
            nextSonar = now + (sonars.length <= 1 ? rand(300, 700) : rand(800, 1600));
          } else { nextSonar = now + 400; }
        }
        for (i = 0; i < sonars.length; i++) {
          var sc = shipScreen[sonars[i].idx]; if (!sc) continue;
          var ph = sonars[i].t;
          ctx.strokeStyle = hexA(sc.c, (1 - ph) * 0.45 * sc.fade);
          ctx.lineWidth = 1.2;
          ctx.beginPath(); ctx.arc(sc.x, sc.y, ph * 20, 0, 6.2832); ctx.stroke();
        }
      }

      drawGlade(now, yAt, oA, HZ);

      var flagged = nodes.length;
      window.__fmField = { nodes: nodes.length, flagged: flagged, ships: shipCount, nat: _fleet.nat };

      ctx.restore();
    }

    // ===================== SKY =====================
    ctx.save();
    if (ocean) { pathAbove(yAt); ctx.clip(); }

    ctx.lineWidth = 1;
    for (var m = 0; m < conns.length; m++) {
      var cc = conns[m], pa = sp[cc.i], pb = sp[cc.j];
      ctx.strokeStyle = 'rgba(169,155,255,' + cc.a.toFixed(3) + ')';
      ctx.beginPath(); ctx.moveTo(pa[0], pa[1]); ctx.lineTo(pb[0], pb[1]); ctx.stroke();
    }

    var glowMul = narrow ? 2.6 : 3.6;
    for (i = 0; i < nodes.length; i++) {
      var ndd = nodes[i], pp = sp[i];
      var tw = reduced ? 0.85 : 0.65 + 0.35 * Math.sin(now * 0.001 + ndd.ph);
      var rr = ndd.r, gr = rr * glowMul;
      ctx.globalAlpha = tw * 0.9;
      ctx.drawImage(glowSprite(ndd.c), pp[0] - gr, pp[1] - gr, gr * 2, gr * 2);
      ctx.globalAlpha = tw;
      ctx.fillStyle = ndd.c;
      if (ndd.port) { ctx.fillRect(pp[0] - rr, pp[1] - rr, rr * 2, rr * 2); }
      else { ctx.beginPath(); ctx.arc(pp[0], pp[1], rr, 0, 6.2832); ctx.fill(); }
      ctx.globalAlpha = 1;
    }

    ctx.restore();
  }

  window.addEventListener('pointermove', function (e) { mouse.tx = e.clientX; mouse.ty = e.clientY; }, { passive: true });
  window.addEventListener('resize', function () { resize(); buildNodes(); }, { passive: true });

  resize(); bakeCaustics(); buildNodes(); buildVirtuals();
  tick(performance.now());
})();
