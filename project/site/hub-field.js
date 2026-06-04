/* ============================================================
   FrontM Work Hub, circuit-board background.
   Same brand nodes as the site's signal field, but linked with
   straight orthogonal (PCB) traces, and traces that route into
   each hub card. Calm drift + travelling signal pulses.
   ============================================================ */
(function () {
  var canvas = document.getElementById('hub-field');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  var BRAND = ['#01B3F6', '#3CAD33', '#FFC500', '#FF6A04', '#9A86FF', '#1FE6D4'];
  var W = 0, H = 0, DPR = Math.min(devicePixelRatio || 1, 2);
  var nodes = [], traces = [], anchors = [], pulses = [];
  var cards = [].slice.call(document.querySelectorAll('.hub-card'));
  var mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };

  function rnd(a, b) { return a + Math.random() * (b - a); }
  function hexA(hex, a) {
    hex = hex.trim().replace('#', '');
    var r = parseInt(hex.substr(0, 2), 16), g = parseInt(hex.substr(2, 2), 16), b = parseInt(hex.substr(4, 2), 16);
    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
  }

  function resize() {
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = W * DPR; canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    build();
  }

  function build() {
    nodes = [];
    var count = Math.round(Math.min(58, Math.max(24, (W * H) / 42000)));
    for (var i = 0; i < count; i++) {
      var port = Math.random() < 0.18;
      nodes.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: rnd(-0.05, 0.05), vy: rnd(-0.05, 0.05),
        r: port ? rnd(2.6, 3.4) : rnd(1.3, 2.4), port: port,
        c: BRAND[(Math.random() * BRAND.length) | 0], ph: Math.random() * 6.2832
      });
    }
    // ambient PCB links: each node to a near neighbour
    traces = [];
    var maxd = Math.min(W, H) * 0.28;
    for (i = 0; i < nodes.length; i++) {
      var best = -1, bd = maxd * maxd;
      for (var j = 0; j < nodes.length; j++) {
        if (j === i) continue;
        var dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y, d = dx * dx + dy * dy;
        if (d < bd) { bd = d; best = j; }
      }
      if (best >= 0 && i < best) traces.push({ a: i, b: best });
    }
    buildAnchors();
  }

  // anchor points on each card perimeter, each wired to the nearest node
  function buildAnchors() {
    anchors = [];
    cards.forEach(function (el) {
      var cc = (getComputedStyle(el).getPropertyValue('--cc') || '#9A86FF').trim() || '#9A86FF';
      var r = el.getBoundingClientRect();
      // a few tap points spread around the card edges (fractions of the card box)
      var taps = [
        { fx: 0, fy: 0.32, side: 'l' },
        { fx: 1, fy: 0.66, side: 'r' },
        { fx: 0.28, fy: 0, side: 't' }
      ];
      taps.forEach(function (t) {
        var ax = r.left + t.fx * r.width, ay = r.top + t.fy * r.height;
        // nearest node to this tap
        var best = -1, bd = 1e12;
        for (var k = 0; k < nodes.length; k++) {
          var dx = nodes[k].x - ax, dy = nodes[k].y - ay, d = dx * dx + dy * dy;
          if (d < bd) { bd = d; best = k; }
        }
        anchors.push({ el: el, fx: t.fx, fy: t.fy, side: t.side, node: best, c: cc });
      });
    });
  }

  // orthogonal (one-bend) path between two points; bend goes horizontal-first
  function orth(ctx2, x1, y1, x2, y2) {
    ctx2.beginPath();
    ctx2.moveTo(x1, y1);
    ctx2.lineTo(x2, y1);
    ctx2.lineTo(x2, y2);
  }
  function orthPoint(x1, y1, x2, y2, t) {
    var lx = Math.abs(x2 - x1), ly = Math.abs(y2 - y1), tot = lx + ly || 1;
    var dh = lx / tot;
    if (t <= dh) { var tt = dh ? t / dh : 1; return [x1 + (x2 - x1) * tt, y1]; }
    var tv = (t - dh) / (1 - dh || 1); return [x2, y1 + (y2 - y1) * tv];
  }

  function spawnPulse() {
    if (anchors.length && Math.random() < 0.7) {
      var an = anchors[(Math.random() * anchors.length) | 0];
      pulses.push({ kind: 'card', an: an, t: 0, sp: rnd(0.006, 0.011) });
    } else if (traces.length) {
      var tr = traces[(Math.random() * traces.length) | 0];
      pulses.push({ kind: 'trace', tr: tr, t: 0, sp: rnd(0.006, 0.012), c: nodes[tr.a].c });
    }
  }

  function anchorXY(an) {
    var r = an.el.getBoundingClientRect();
    return [r.left + an.fx * r.width, r.top + an.fy * r.height];
  }

  function tick(now) {
    mouse.x += (mouse.tx - mouse.x) * 0.08; mouse.y += (mouse.ty - mouse.y) * 0.08;
    ctx.clearRect(0, 0, W, H);

    if (!reduced) {
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        n.x += n.vx; n.y += n.vy;
        if (n.x < -10) n.x = W + 10; if (n.x > W + 10) n.x = -10;
        if (n.y < -10) n.y = H + 10; if (n.y > H + 10) n.y = -10;
      }
    }

    // cursor glow (cool purple), subtle
    if (mouse.x > -1000) {
      var g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, Math.max(W, H) * 0.3);
      g.addColorStop(0, 'rgba(154,134,255,0.06)'); g.addColorStop(1, 'rgba(154,134,255,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    }

    // ambient PCB traces
    ctx.lineWidth = 1;
    for (i = 0; i < traces.length; i++) {
      var a = nodes[traces[i].a], b = nodes[traces[i].b];
      ctx.strokeStyle = 'rgba(130,150,220,0.13)';
      orth(ctx, a.x, a.y, b.x, b.y); ctx.stroke();
      // bend pad
      ctx.fillStyle = 'rgba(130,150,220,0.2)';
      ctx.fillRect(b.x - 1.1, a.y - 1.1, 2.2, 2.2);
    }

    // card connector traces (route node -> card edge), brighter, in card accent
    for (i = 0; i < anchors.length; i++) {
      var an = anchors[i]; if (an.node < 0) continue;
      var nd = nodes[an.node]; var axy = anchorXY(an);
      ctx.strokeStyle = hexA(an.c, 0.30); ctx.lineWidth = 1.2;
      orth(ctx, nd.x, nd.y, axy[0], axy[1]); ctx.stroke();
      // glowing solder pad where it meets the card
      ctx.fillStyle = hexA(an.c, 0.9); ctx.shadowColor = an.c; ctx.shadowBlur = 9;
      ctx.fillRect(axy[0] - 2.4, axy[1] - 2.4, 4.8, 4.8);
      ctx.shadowBlur = 0;
      // small node-side pad
      ctx.fillStyle = hexA(an.c, 0.5);
      ctx.fillRect(nd.x - 1.2, nd.y - 1.2, 2.4, 2.4);
    }

    // nodes (brand colours; ports are squares, like the site)
    for (i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      var tw = reduced ? 0.85 : 0.6 + 0.4 * Math.sin(now * 0.001 + node.ph);
      ctx.save(); ctx.globalAlpha = tw; ctx.fillStyle = node.c;
      ctx.shadowColor = node.c; ctx.shadowBlur = 8;
      if (node.port) ctx.fillRect(node.x - node.r, node.y - node.r, node.r * 2, node.r * 2);
      else { ctx.beginPath(); ctx.arc(node.x, node.y, node.r, 0, 6.2832); ctx.fill(); }
      ctx.restore();
    }

    // travelling pulses
    if (!reduced) {
      if (pulses.length < 9 && Math.random() < 0.06) spawnPulse();
      for (i = pulses.length - 1; i >= 0; i--) {
        var pu = pulses[i]; pu.t += pu.sp;
        if (pu.t >= 1) { pulses.splice(i, 1); continue; }
        var x1, y1, x2, y2, col;
        if (pu.kind === 'card') {
          var ndp = nodes[pu.an.node]; var ap = anchorXY(pu.an);
          x1 = ndp.x; y1 = ndp.y; x2 = ap[0]; y2 = ap[1]; col = pu.an.c;
        } else {
          var na = nodes[pu.tr.a], nb = nodes[pu.tr.b];
          x1 = na.x; y1 = na.y; x2 = nb.x; y2 = nb.y; col = pu.c;
        }
        var p = orthPoint(x1, y1, x2, y2, pu.t);
        var fade = Math.sin(pu.t * Math.PI);
        ctx.globalAlpha = fade; ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 12;
        ctx.beginPath(); ctx.arc(p[0], p[1], 2.2, 0, 6.2832); ctx.fill();
        ctx.globalAlpha = 1; ctx.shadowBlur = 0;
      }
    }

    requestAnimationFrame(tick);
  }

  window.addEventListener('pointermove', function (e) { mouse.tx = e.clientX; mouse.ty = e.clientY; }, { passive: true });
  window.addEventListener('resize', function () { resize(); }, { passive: true });
  window.addEventListener('scroll', buildAnchors, { passive: true });

  resize();
  // re-measure once layout/scrollbars settle (first paint can report a stale width)
  setTimeout(resize, 200);
  window.addEventListener('load', resize);
  if (reduced) tick(0); else requestAnimationFrame(tick);
})();
