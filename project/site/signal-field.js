/* ============================================================
   FrontM, "Signal Field" global animated background
   Calm, ambient maritime network: drifting ship/port nodes,
   faint proximity mesh, occasional signal pulses, cursor glow,
   and a gentle hero-only camera zoom. Text always wins.
   ============================================================ */
(function () {
  var canvas = document.getElementById('signal-field');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var narrow = matchMedia('(max-width: 980px)').matches;   // lighten the field on phones/tablets

  var BRAND = ['#01B3F6', '#3CAD33', '#FFC500', '#FF6A04', '#9A86FF', '#1FE6D4'];
  var W = 0, H = 0, DPR = Math.min(devicePixelRatio || 1, 2);

  var nodes = [], pulses = [];
  var mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
  var cam = { x: 0.5, y: 0.5, z: 1, tx: 0.5, ty: 0.5, tz: 1 };
  var heroEl = document.querySelector('.hero');
  var statusCard = document.getElementById('field-status');
  var heroInView = true;

  function resize() {
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = W * DPR; canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  function rand(a, b) { return a + Math.random() * (b - a); }

  // Pre-rendered glow sprites: drawing a cached radial-gradient disc is far cheaper than
  // setting ctx.shadowBlur per node every frame (a full blur pass per draw call).
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
      ? Math.round(Math.min(22, Math.max(13, (W * H) / 46000)))
      : Math.round(Math.min(64, Math.max(28, (W * H) / 34000)));
    for (var i = 0; i < count; i++) {
      var isPort = Math.random() < 0.16;
      nodes.push({
        x: Math.random(), y: Math.random(),
        vx: rand(-0.012, 0.012), vy: rand(-0.012, 0.012),
        r: isPort ? rand(2.6, 3.4) : rand(1.4, 2.6),
        port: isPort,
        c: BRAND[(Math.random() * BRAND.length) | 0],
        ph: Math.random() * Math.PI * 2
      });
    }
  }

  function px(n) { // node -> screen px with camera
    var x = (n.x - cam.x) * cam.z + 0.5;
    var y = (n.y - cam.y) * cam.z + 0.5;
    return [x * W, y * H];
  }

  function spawnPulse() {
    if (nodes.length < 2) return;
    var a = nodes[(Math.random() * nodes.length) | 0];
    var b = nodes[(Math.random() * nodes.length) | 0];
    if (a === b) return;
    var mx = (a.x + b.x) / 2 + rand(-0.08, 0.08);
    var my = (a.y + b.y) / 2 + rand(-0.08, 0.08);
    pulses.push({ a: a, b: b, cx: mx, cy: my, t: 0, sp: rand(0.0045, 0.008), c: BRAND[(Math.random() * BRAND.length) | 0] });
  }

  function bezier(p0, p1, p2, t) {
    var u = 1 - t;
    return u * u * p0 + 2 * u * t * p1 + t * t * p2;
  }

  var lastZoom = 0, zoomState = 'idle', zoomNode = null, zoomT = 0;
  var lastFrame = 0;

  function tick(now) {
    if (!reduced) requestAnimationFrame(tick);     // reduced-motion renders one static frame, no loop
    if (narrow && !reduced && now - lastFrame < 33) return;   // cap to ~30fps on mobile
    lastFrame = now;
    // camera easing
    cam.x += (cam.tx - cam.x) * 0.04;
    cam.y += (cam.ty - cam.y) * 0.04;
    cam.z += (cam.tz - cam.z) * 0.04;
    mouse.x += (mouse.tx - mouse.x) * 0.08;
    mouse.y += (mouse.ty - mouse.y) * 0.08;

    ctx.clearRect(0, 0, W, H);

    // cursor glow (warm follows + cool purple mirror)
    if (mouse.x > -1000) {
      var g1 = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, Math.max(W, H) * 0.34);
      g1.addColorStop(0, 'rgba(255,150,70,0.06)'); g1.addColorStop(1, 'rgba(255,150,70,0)');
      ctx.fillStyle = g1; ctx.fillRect(0, 0, W, H);
      var mx2 = W - mouse.x, my2 = H - mouse.y;
      var g2 = ctx.createRadialGradient(mx2, my2, 0, mx2, my2, Math.max(W, H) * 0.32);
      g2.addColorStop(0, 'rgba(154,134,255,0.07)'); g2.addColorStop(1, 'rgba(154,134,255,0)');
      ctx.fillStyle = g2; ctx.fillRect(0, 0, W, H);
    }

    // update + draw proximity mesh
    var thresh = 0.13;
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      if (!reduced) {
        n.x += n.vx * 0.0016 * 16; n.y += n.vy * 0.0016 * 16;
        if (n.x < -0.05) n.x = 1.05; if (n.x > 1.05) n.x = -0.05;
        if (n.y < -0.05) n.y = 1.05; if (n.y > 1.05) n.y = -0.05;
      }
    }
    ctx.lineWidth = 1;
    for (i = 0; i < nodes.length; i++) {
      for (var j = i + 1; j < nodes.length; j++) {
        var dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
        var d = Math.sqrt(dx * dx + dy * dy);
        if (d < thresh) {
          var pa = px(nodes[i]), pb = px(nodes[j]);
          var alpha = (1 - d / thresh) * 0.13;
          ctx.strokeStyle = 'rgba(169,155,255,' + alpha.toFixed(3) + ')';
          ctx.beginPath(); ctx.moveTo(pa[0], pa[1]); ctx.lineTo(pb[0], pb[1]); ctx.stroke();
        }
      }
    }

    // draw nodes (cheap sprite glow + crisp core; no per-frame shadowBlur)
    var glowMul = narrow ? 2.6 : 3.6;
    for (i = 0; i < nodes.length; i++) {
      var nd = nodes[i], p = px(nd);
      var tw = reduced ? 0.85 : 0.65 + 0.35 * Math.sin(now * 0.001 + nd.ph);
      var r = nd.r * cam.z, gr = r * glowMul;
      ctx.globalAlpha = tw * 0.9;
      ctx.drawImage(glowSprite(nd.c), p[0] - gr, p[1] - gr, gr * 2, gr * 2);
      ctx.globalAlpha = tw;
      ctx.fillStyle = nd.c;
      if (nd.port) { ctx.fillRect(p[0] - r, p[1] - r, r * 2, r * 2); }
      else { ctx.beginPath(); ctx.arc(p[0], p[1], r, 0, 6.2832); ctx.fill(); }
      ctx.globalAlpha = 1;
    }

    // pulses + hero camera zoom: desktop only (skip the extra redraw cost on mobile)
    if (!reduced && !narrow) {
      if (now - lastZoom > 220 && pulses.length < 8 && Math.random() < 0.04) spawnPulse();
      for (i = pulses.length - 1; i >= 0; i--) {
        var pu = pulses[i]; pu.t += pu.sp;
        if (pu.t >= 1) { pulses.splice(i, 1); continue; }
        var bx = bezier(pu.a.x, pu.cx, pu.b.x, pu.t);
        var by = bezier(pu.a.y, pu.cy, pu.b.y, pu.t);
        var sx = (bx - cam.x) * cam.z + 0.5, sy = (by - cam.y) * cam.z + 0.5;
        sx *= W; sy *= H;
        // trail
        var tt = Math.max(0, pu.t - 0.06);
        var tx = (bezier(pu.a.x, pu.cx, pu.b.x, tt) - cam.x) * cam.z + 0.5;
        var ty = (bezier(pu.a.y, pu.cy, pu.b.y, tt) - cam.y) * cam.z + 0.5;
        tx *= W; ty *= H;
        var fade = Math.sin(pu.t * Math.PI);
        ctx.strokeStyle = pu.c; ctx.globalAlpha = 0.5 * fade; ctx.lineWidth = 1.5 * cam.z;
        ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(sx, sy); ctx.stroke();
        ctx.globalAlpha = fade; ctx.fillStyle = pu.c; ctx.shadowColor = pu.c; ctx.shadowBlur = 12;
        ctx.beginPath(); ctx.arc(sx, sy, 2.4 * cam.z, 0, 6.2832); ctx.fill();
        ctx.globalAlpha = 1; ctx.shadowBlur = 0;
      }

      // hero camera zoom every ~14s
      if (heroInView) {
        if (zoomState === 'idle' && now - lastZoom > 14000) {
          zoomNode = nodes[(Math.random() * nodes.length) | 0];
          zoomState = 'in'; zoomT = 0;
        } else if (zoomState === 'in') {
          zoomT += 0.006;
          cam.tx = zoomNode.x; cam.ty = zoomNode.y; cam.tz = 1.7;
          if (zoomT >= 1) { zoomState = 'hold'; zoomT = 0; showStatus(true); }
        } else if (zoomState === 'hold') {
          cam.tx = zoomNode.x; cam.ty = zoomNode.y;
          zoomT += 0.004;
          if (zoomT >= 1) { zoomState = 'out'; zoomT = 0; showStatus(false); }
        } else if (zoomState === 'out') {
          cam.tx = 0.5; cam.ty = 0.5; cam.tz = 1;
          zoomT += 0.006;
          if (zoomT >= 1) { zoomState = 'idle'; lastZoom = now; }
        }
      } else if (zoomState !== 'idle') {
        cam.tx = 0.5; cam.ty = 0.5; cam.tz = 1; zoomState = 'idle'; showStatus(false); lastZoom = now;
      }
    }
  }

  function showStatus(on) {
    if (!statusCard) return;
    statusCard.classList.toggle('show', !!on);
  }

  window.addEventListener('pointermove', function (e) { mouse.tx = e.clientX; mouse.ty = e.clientY; }, { passive: true });
  window.addEventListener('resize', function () { resize(); buildNodes(); }, { passive: true });

  if (heroEl && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (en) { heroInView = en[0].isIntersecting; }, { threshold: 0.15 })
      .observe(heroEl);
  }

  resize(); buildNodes();
  if (reduced) { tick(0); } // single static frame is fine; loop guarded by reduced flag
  else { requestAnimationFrame(tick); }
})();
