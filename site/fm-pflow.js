/* ============================================================
   FrontM — Problem→Solution pinned cinematic ("atoms splitting")
   One scroll clock drives: headline in → friction cards reveal
   one-by-one while background nodes MULTIPLY/SPLIT and signals
   fail → everything resolves as "FrontM is changing that." rises
   and the fragments converge. Degrades to a static stack on
   narrow screens / reduced-motion.
   ============================================================ */
(function () {
  var sec = document.getElementById('problem-flow');
  if (!sec) return;
  var FM = window.FM, ico = FM.ico;
  var stage = sec.querySelector('.pflow-stage');
  var canvas = sec.querySelector('.pflow-canvas');
  var ctx = canvas.getContext('2d');
  var head = sec.querySelector('.pflow-head');
  var frHost = sec.querySelector('#pflow-friction');
  var stat = sec.querySelector('.pflow-stat');
  var statCopy = sec.querySelector('.pflow-statcopy');
  var turn = null; /* "FrontM is changing that." beat REPLACED by the approach reveal */
  var approach = sec.querySelector('.pflow-approach');
  var headGlass = sec.querySelector('.pflow-head .pflow-glass');
  var apprGlass = sec.querySelector('.pflow-approach .pflow-glass');
  var ocHost = sec.querySelector('#pflow-outcomes');
  var wheelWrap = sec.querySelector('.pflow-wheelwrap');
  var wheelTitle = sec.querySelector('.pflow-wheel-head');
  var cwStage = sec.querySelector('#cw-stage');
  var cue = sec.querySelector('.pflow-cue');
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- pin length — ONE named constant (tune here; CSS 1100vh is the no-JS fallback)
  var PIN_VH = 10;
  // TAIL choreography (q 0→1 across these extra viewports while still pinned):
  //   0 – 0.625  (1.25 pages)  title gradient-fill, SCRUBBED line by line
  //   0.625–0.75 (0.25 page)   the outline title SINKS into the background like a glass
  //   0.75 – 1   (0.5 page)    rest hold on the wheel alone, then unpin
  var PFLOW_TAIL_VH = 2.0;

  /* ---- render friction cards ---- */
  frHost.innerHTML = FM.FRICTION.map(function (f) {
    return '<div class="pflow-fr" style="--cc:' + (f.c || '#FF6A04') + '"><div class="pfr-ico">' + ico(f.ic) + '</div>' +
      '<div class="pfr-t">' + f.t + '</div><div class="pfr-d">' + f.d + '</div></div>';
  }).join('');
  var cards = [].slice.call(frHost.querySelectorAll('.pflow-fr'));

  /* ---- render the 8 HEAL outcomes (compact 2×4) ---- */
  if (ocHost && FM.OUTCOMES) {
    ocHost.innerHTML = FM.OUTCOMES.map(function (o) {
      return '<div class="pflow-oc" style="--cc:' + (o.c || '#9A86FF') + '"><div class="poc-ico">' + ico(o.ic) + '</div>' +
        '<div class="poc-t">' + o.t + '</div><div class="poc-d">' + o.d + '</div></div>';
    }).join('');
  }
  var ocCards = ocHost ? [].slice.call(ocHost.querySelectorAll('.pflow-oc')) : [];

  /* ---- math ---- */
  function clamp(x){ return x < 0 ? 0 : x > 1 ? 1 : x; }
  function smooth(a, b, x){ var t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); }
  function lerp(a, b, t){ return a + (b - a) * t; }
  var seed = 11;
  function rnd(){ seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }

  /* ---- node system (atoms that split/multiply) ----
     Each node carries a SCATTER target (where it lives during the
     fragmentation) and a parent it springs FROM (mitosis). It is
     "born" progressively as the problem deepens. */
  var BRAND = ['#01B3F6', '#3CAD33', '#FFC500', '#FF6A04', '#9A86FF', '#1FE6D4', '#435FE8'];
  var MAX = 46;
  var nodes = [];
  (function build(){
    for (var i = 0; i < MAX; i++){
      // bias scatter away from dead-centre so headline/turn text stays legible
      var ang = rnd() * Math.PI * 2;
      var rad = 0.16 + rnd() * 0.40;                 // fraction of min(stage) from centre
      nodes.push({
        sx: 0.5 + Math.cos(ang) * rad * 0.92,        // scatter pos (0..1 of stage W)
        sy: 0.5 + Math.sin(ang) * rad,               // scatter pos (0..1 of stage H)
        parent: i === 0 ? 0 : ((i - 1) >> 1),        // binary mitosis tree
        c: BRAND[i % BRAND.length],
        r: 2.2 + rnd() * 2.6,
        ph: rnd() * 6.2832,
        born: i / MAX                                 // birth fraction along problem progress
      });
    }
  })();

  var DPR = Math.min(devicePixelRatio || 1, 2);
  var sW = 0, sH = 0;
  /* wheel convergence targets, in CANVAS px — measured against the ACTUAL
     #cw-stage element box (NOT the sticky stage; they differ). */
  var wheelPts = [], wc = null;
  function measureWheel(){
    wheelPts = [];
    if (!cwStage || !FM.wheelGeometry) return;
    var G = FM.wheelGeometry();
    var sr = stage.getBoundingClientRect(), wr = cwStage.getBoundingClientRect();
    if (!wr.width) return;
    var ox = wr.left - sr.left, oy = wr.top - sr.top;
    wc = { x: ox + wr.width / 2, y: oy + wr.height / 2 };
    G.mods.forEach(function (m) { wheelPts.push({ x: ox + (m.x / 100) * wr.width, y: oy + (m.y / 100) * wr.height, c: m.color }); });
    G.stk.forEach(function (s)  { wheelPts.push({ x: ox + (s.x / 100) * wr.width, y: oy + (s.y / 100) * wr.height, c: '#9A86FF' }); });
  }
  function geo(){
    sW = stage.clientWidth; sH = stage.clientHeight;
    canvas.width = sW * DPR; canvas.height = sH * DPR;
    canvas.style.width = sW + 'px'; canvas.style.height = sH + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    measureWheel();
    geoTitle();
  }
  if ('ResizeObserver' in window && cwStage) new ResizeObserver(measureWheel).observe(cwStage);
  function px(n, X, Y){ return [X * sW, Y * sH]; }

  /* ---- giant-title constellation: a 2×-dense mini star field rendered INSIDE
     the title glyphs (canvas, clipped by destination-in text). It lives inside
     the drifting title so it moves with it; painted only during the finale. ---- */
  var wtEl = wheelTitle ? wheelTitle.querySelector('.pflow-wheel-title') : null;
  var wtLines = wtEl ? [].slice.call(wtEl.querySelectorAll('.wt-l')) : [];
  var wtCanvas = null, wtCtx = null, wtStars = [], wtLinks = [], wtFont = '', wtW = 0, wtH = 0, wtDrawn = false;
  if (wtEl){
    wtCanvas = document.createElement('canvas');
    wtCanvas.className = 'pwt-stars'; wtCanvas.setAttribute('aria-hidden', 'true');
    wtEl.appendChild(wtCanvas);
    wtCtx = wtCanvas.getContext('2d');
  }
  function geoTitle(){
    if (!wtEl || !wtCtx) return;
    wtW = wtEl.offsetWidth; wtH = wtEl.offsetHeight;
    if (!wtW || !wtH) return;
    wtCanvas.width = wtW * DPR; wtCanvas.height = wtH * DPR;
    wtCanvas.style.width = wtW + 'px'; wtCanvas.style.height = wtH + 'px';
    wtCtx.setTransform(DPR, 0, 0, DPR, 0, 0);
    var cs = getComputedStyle(wtEl);
    wtFont = cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily;
    if ('letterSpacing' in wtCtx && cs.letterSpacing !== 'normal') wtCtx.letterSpacing = cs.letterSpacing;
    var n = Math.max(60, Math.round((wtW * wtH) / 6000));   // ~2× the ambient field density
    wtStars = [];
    for (var i = 0; i < n; i++){
      wtStars.push({ x: Math.random() * wtW, y: Math.random() * wtH, c: BRAND[i % BRAND.length], r: 1.2 + Math.random() * 1.9, ph: Math.random() * 6.2832 });
    }
    wtLinks = [];
    for (i = 0; i < n; i++){
      var bd = 1e9, bj = -1;
      for (var j = 0; j < n; j++){ if (j === i) continue; var dx = wtStars[j].x - wtStars[i].x, dy = wtStars[j].y - wtStars[i].y, dd = dx * dx + dy * dy; if (dd < bd){ bd = dd; bj = j; } }
      if (bj > i && bd < 200 * 200) wtLinks.push([i, bj]);
    }
  }
  function drawTitleStars(now){
    // progressive line-by-line gradient fill + igniting stroke — SCRUBBED across
    // the first 1.25 pages of the tail (q), fully reversible on scroll-back:
    // --fa = fill amount, --gw = glow weight (peaks mid-fill, dies when solid,
    // with a slow living pulse while it burns)
    for (var li = 0; li < wtLines.length; li++){
      var fi = smooth(0.03 + li * 0.19, 0.25 + li * 0.19, q);
      var gwv = Math.sin(Math.PI * fi) * (0.72 + 0.28 * Math.sin(now * 0.005 + li * 2.1));
      wtLines[li].style.setProperty('--fa', fi.toFixed(3));
      wtLines[li].style.setProperty('--gw', Math.max(0, gwv).toFixed(3));
    }
    if (!wtCtx || !wtW) return;
    if (p < 0.9 || smooth(0, 0.62, exTitle.v) > 0.97){   // skip while hidden (pre-finale or title sunk)
      if (wtDrawn){ wtCtx.clearRect(0, 0, wtW, wtH); wtDrawn = false; }
      return;
    }
    wtDrawn = true;
    wtCtx.clearRect(0, 0, wtW, wtH);
    wtCtx.lineWidth = 1;
    wtCtx.strokeStyle = 'rgba(140,160,225,0.30)';
    for (var i = 0; i < wtLinks.length; i++){
      var la = wtStars[wtLinks[i][0]], lb = wtStars[wtLinks[i][1]];
      wtCtx.beginPath(); wtCtx.moveTo(la.x, la.y); wtCtx.lineTo(lb.x, lb.y); wtCtx.stroke();
    }
    for (i = 0; i < wtStars.length; i++){
      var s = wtStars[i];
      var tw = 0.55 + 0.45 * Math.sin(now * 0.0012 + s.ph);
      wtCtx.save(); wtCtx.globalAlpha = tw; wtCtx.fillStyle = s.c; wtCtx.shadowColor = s.c; wtCtx.shadowBlur = 9;
      wtCtx.beginPath(); wtCtx.arc(s.x, s.y, s.r, 0, 6.2832); wtCtx.fill(); wtCtx.restore();
    }
    // clip everything to the glyphs — same font + 3-line grid as the DOM text
    // (canvas has no text-transform; the DOM renders uppercase, so draw uppercase)
    wtCtx.globalCompositeOperation = 'destination-in';
    wtCtx.font = wtFont; wtCtx.textAlign = 'center'; wtCtx.textBaseline = 'middle';
    wtCtx.fillStyle = '#fff';
    var lh = wtH / 3;
    wtCtx.fillText('ANCHORING', wtW / 2, lh * 0.5 + lh * 0.05);
    wtCtx.fillText('MARITIME', wtW / 2, lh * 1.5 + lh * 0.05);
    wtCtx.fillText('COLLABORATION', wtW / 2, lh * 2.5 + lh * 0.05);
    wtCtx.globalCompositeOperation = 'source-over';
    wtCtx.globalCompositeOperation = 'source-over';
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function (){ geoTitle(); });

  /* ---- signal pulses (failing during the problem) ---- */
  var pulses = [];
  var blooms = [];
  function spawnFail(){
    var n = Math.max(2, activeCount);
    var a = nodes[(rnd() * n) | 0], b = nodes[(rnd() * n) | 0];
    if (a === b) return;
    pulses.push({ ax: a.cx, ay: a.cy, bx: b.cx, by: b.cy, t: 0, sp: 0.012, die: 0.4 + rnd() * 0.35 });
  }
  /* HEAL: pulses that ARRIVE (grey → green) + bloom ring on arrival — ported from
     the retired transition's spawnArrive()/bloom(), re-pointed onto pflow nodes. */
  function spawnRecover(){
    var n = Math.max(2, activeCount);
    var a = nodes[(rnd() * n) | 0], b = nodes[(rnd() * n) | 0];
    if (a === b) return;
    pulses.push({ ax: a.cx, ay: a.cy, bx: b.cx, by: b.cy, t: 0, sp: 0.016, die: 1, ok: true });
  }
  function hx(h){ h = h.replace('#',''); return [parseInt(h.substr(0,2),16), parseInt(h.substr(2,2),16), parseInt(h.substr(4,2),16)]; }
  function mix(c1, c2, t){ var a = hx(c1), b = hx(c2); return 'rgb(' + Math.round(lerp(a[0],b[0],t)) + ',' + Math.round(lerp(a[1],b[1],t)) + ',' + Math.round(lerp(a[2],b[2],t)) + ')'; }

  var p = 0, q = 0, activeCount = 0, lastNow = 0;
  function draw(now){
    if (!dynamicOn || !visible){ rafId = 0; lastNow = 0; return; }
    var dt = lastNow ? Math.min(50, now - lastNow) : 16; lastNow = now;
    // eased scroll progress — softer inertia for a calmer, less snappy scrub
    var tp = targetP();
    if (!reduced){
      p += (tp - p) * 0.11;
      if (Math.abs(tp - p) < 0.0005) p = tp;
      var tq = targetQ();
      q += (tq - q) * 0.11;
      if (Math.abs(tq - q) < 0.0005) q = tq;
    } else { p = tp; q = targetQ(); }
    stepExits(dt);
    stepDocks(dt);
    applyPhases();
    ctx.clearRect(0, 0, sW, sH);

    var problem = smooth(0.08, 0.40, p);
    var heal    = smooth(0.56, 0.76, p);              // chaos resolves (HEAL)
    var gather  = smooth(0.922, 0.972, p);            // stars spiral onto WHEEL coords — AFTER the cards have cleared
    var fade    = 1 - smooth(0.972, 0.998, p);        // canvas hands off to the DOM wheel at the very end
    // TAIL: a faint ambient sky returns while the title beat plays, so the
    // title's sink wave has a medium to ripple through (and clears again at unpin)
    var tailAmb = smooth(0.12, 0.4, q) * (1 - smooth(0.92, 1, q));
    var fade2 = Math.max(fade, tailAmb * 0.55);
    activeCount = Math.round(lerp(3, MAX, problem));

    // compute live positions
    for (var i = 0; i < MAX; i++){
      var nd = nodes[i];
      if (i >= activeCount){ nd.alpha = 0; continue; }
      // mitosis: spring from parent's scatter to own scatter as it is born
      var spawnT = smooth(nd.born * 0.9, nd.born * 0.9 + 0.06, problem);
      var par = nodes[nd.parent];
      var baseX = lerp(par.sx, nd.sx, spawnT);
      var baseY = lerp(par.sy, nd.sy, spawnT);
      // chaotic drift grows with the problem, then DAMPS as the network heals
      var wob = reduced ? 0 : Math.sin(now * 0.0006 + nd.ph) * (0.004 + problem * 0.012) * (1 - heal);
      var fx = baseX + wob, fy = baseY + wob * 0.7;
      var pos = px(nd, fx, fy);
      nd.cx = pos[0]; nd.cy = pos[1];
      nd.alpha = spawnT;
      // FINALE: 8 earliest-born → module coords (colour-matched), next 12 → stakeholder coords, rest fade.
      // Cinematic path: each star SPIRALS about the wheel centre with a mid-flight swirl,
      // staggered so they lock home one after another (bloom ring fires on lock).
      if (gather > 0 && wheelPts.length === 20 && wc){
        if (i < 20){
          var tgt = wheelPts[i];
          var gi = clamp((gather - (i / 20) * 0.3) / 0.7);
          var si = gi * gi * (3 - 2 * gi);
          var dx0 = nd.cx - wc.x, dy0 = nd.cy - wc.y;
          var a0 = Math.atan2(dy0, dx0), r0 = Math.sqrt(dx0 * dx0 + dy0 * dy0);
          var a1 = Math.atan2(tgt.y - wc.y, tgt.x - wc.x);
          var r1 = Math.sqrt((tgt.x - wc.x) * (tgt.x - wc.x) + (tgt.y - wc.y) * (tgt.y - wc.y));
          var da = a1 - a0; da = Math.atan2(Math.sin(da), Math.cos(da));
          var ang = a0 + da * si + Math.sin(Math.PI * si) * 0.5;
          var rad = lerp(r0, r1, si);
          nd.cx = wc.x + Math.cos(ang) * rad; nd.cy = wc.y + Math.sin(ang) * rad;
          nd.gc = tgt.c; nd.gI = si;
          if (si > 0.96 && !nd.lk){ nd.lk = true; blooms.push({ x: tgt.x, y: tgt.y, r: 2.5, a: 0.6, c: tgt.c }); }
          if (si < 0.5) nd.lk = false;
        } else {
          nd.alpha *= (1 - gather * (1 - tailAmb));   // scattered stars return for the tail
        }
      } else { nd.lk = false; nd.gI = 0; }
      // FIELD WAVES (W1): each sunken card pushes the constellation — stars
      // heave radially at the crest, brighten, and spring back as it passes
      nd.wI = 0;
      for (var wi = 0; wi < exitAnims.length; wi++){
        var ws = exitAnims[wi];
        if (!ws.placed || ws.w <= 0 || ws.w >= 1) continue;
        var wex = 1 - Math.pow(1 - ws.w, 3);
        var wR = wex * ws.maxR;
        var wW = Math.max(70, ws.maxR * 0.18);
        var wdx = nd.cx - ws.cx, wdy = nd.cy - ws.cy;
        var wd = Math.sqrt(wdx * wdx + wdy * wdy) || 1;
        var wq = (wd - wR) / wW;
        var wk = Math.exp(-wq * wq * 2) * Math.pow(1 - ws.w, 0.9);
        if (wk < 0.01) continue;
        nd.wI = Math.max(nd.wI, wk);
        nd.cx += (wdx / wd) * wk * ws.amp;
        nd.cy += (wdy / wd) * wk * ws.amp * 0.92;
      }
      nd.alpha *= fade2;
    }

    // faint links between near neighbours — strengthen as the network HEALS (order from chaos)
    var linkAlpha = (0.06 + heal * 0.22) * fade2 * (1 - gather * 0.6 * (1 - tailAmb));
    if (linkAlpha > 0.01){
      ctx.lineWidth = 1;
      for (i = 0; i < activeCount; i++){
        var n1 = nodes[i]; if (n1.alpha < 0.05) continue;
        var nb = -1, bd = 1e9;
        for (var j = 0; j < activeCount; j++){ if (j === i) continue; var dx = nodes[j].cx - n1.cx, dy = nodes[j].cy - n1.cy, d = dx*dx + dy*dy; if (d < bd){ bd = d; nb = j; } }
        if (nb > i){
          ctx.strokeStyle = 'rgba(140,160,225,' + Math.min(0.6, linkAlpha + Math.max(n1.wI || 0, nodes[nb].wI || 0) * 0.35).toFixed(3) + ')';
          ctx.beginPath(); ctx.moveTo(n1.cx, n1.cy); ctx.lineTo(nodes[nb].cx, nodes[nb].cy); ctx.stroke();
        }
      }
    }

    // nodes (+ motion streaks while they spiral home)
    for (i = 0; i < activeCount; i++){
      var n = nodes[i]; if (n.alpha < 0.02){ n.px = null; continue; }
      var tw = (0.6 + 0.4 * Math.sin(now * 0.001 + n.ph));
      var col = (gather > 0 && n.gc) ? mix(n.c, n.gc, n.gI || gather) : n.c;
      if (gather > 0 && gather < 1 && n.px != null){
        var vx = n.px - n.cx, vy = n.py - n.cy;
        var vl = Math.sqrt(vx * vx + vy * vy);
        if (vl > 0.6){
          var vk = Math.min(26 / vl, 5);
          ctx.save(); ctx.globalAlpha = n.alpha * 0.45; ctx.strokeStyle = col; ctx.lineWidth = 1.3; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(n.cx, n.cy); ctx.lineTo(n.cx + vx * vk, n.cy + vy * vk); ctx.stroke(); ctx.restore();
        }
      }
      ctx.save(); ctx.globalAlpha = Math.min(1, n.alpha * tw * (1 + (n.wI || 0) * 1.3)); ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 10 + (n.gI || 0) * 8 + (n.wI || 0) * 12;
      ctx.beginPath(); ctx.arc(n.cx, n.cy, n.r * (1 + (n.gI || 0) * 0.25 + (n.wI || 0) * 0.5), 0, 6.2832); ctx.fill(); ctx.restore();
      n.px = n.cx; n.py = n.cy;
    }

    // failing signals while the problem deepens; recovering signals while it heals
    if (p > 0.08 && p < 0.46){
      var rate = 0.05 + problem * 0.18;
      if (rnd() < rate && pulses.length < 16) spawnFail();
    }
    if (p > 0.56 && p < 0.90){
      if (rnd() < 0.04 + heal * 0.10 && pulses.length < 16) spawnRecover();
    }
    for (i = pulses.length - 1; i >= 0; i--){
      var s = pulses[i]; s.t += s.sp;
      if (s.t >= s.die){
        if (s.ok) blooms.push({ x: s.bx, y: s.by, r: 2, a: 0.6 });
        pulses.splice(i, 1); continue;
      }
      var tt = s.t / s.die;
      var x = lerp(s.ax, s.bx, s.t), y = lerp(s.ay, s.by, s.t);
      var col = s.ok ? mix('#6B7280', '#18C95C', tt) : mix('#FF6A04', '#6B7280', tt);
      ctx.save(); ctx.globalAlpha = (s.ok ? 0.9 : (1 - tt) * 0.85) * fade; ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 12;
      ctx.beginPath(); ctx.arc(x, y, 2.3, 0, 6.2832); ctx.fill(); ctx.restore();
    }

    // arrival bloom rings (order restored / stars locking home)
    for (i = blooms.length - 1; i >= 0; i--){
      var bl = blooms[i]; bl.r += 0.9; bl.a -= 0.02;
      if (bl.a <= 0){ blooms.splice(i, 1); continue; }
      ctx.save(); ctx.globalAlpha = bl.a * fade; ctx.strokeStyle = bl.c || '#18C95C'; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.arc(bl.x, bl.y, bl.r, 0, 6.2832); ctx.stroke(); ctx.restore();
    }

    // IGNITION: soft flash at the wheel centre as the last stars lock in
    if (wc){
      var ign = smooth(0.965, 0.982, p) * (1 - smooth(0.982, 0.999, p));
      if (ign > 0.01){
        var ir = 70 + ign * 170;
        var grd = ctx.createRadialGradient(wc.x, wc.y, 0, wc.x, wc.y, ir);
        grd.addColorStop(0, 'rgba(180,200,255,' + (0.5 * ign).toFixed(3) + ')');
        grd.addColorStop(0.45, 'rgba(1,179,246,' + (0.22 * ign).toFixed(3) + ')');
        grd.addColorStop(1, 'rgba(1,179,246,0)');
        ctx.fillStyle = grd;
        ctx.fillRect(wc.x - ir, wc.y - ir, ir * 2, ir * 2);
      }
    }

    // UNDERGLOW (W5): each sunken card keeps glowing softly beneath the surface
    for (i = 0; i < exitAnims.length; i++){
      var us = exitAnims[i];
      if (!us.placed || us.u <= 0 || us.u >= 1) continue;
      var ua = Math.sin(Math.PI * us.u) * fade2;
      if (ua < 0.02) continue;
      var ugr = ctx.createRadialGradient(us.cx, us.cy, 0, us.cx, us.cy, us.glowR);
      ugr.addColorStop(0, 'rgba(67,95,232,' + (0.12 * ua).toFixed(3) + ')');
      ugr.addColorStop(0.55, 'rgba(1,179,246,' + (0.045 * ua).toFixed(3) + ')');
      ugr.addColorStop(1, 'rgba(1,179,246,0)');
      ctx.fillStyle = ugr;
      ctx.fillRect(us.cx - us.glowR, us.cy - us.glowR, us.glowR * 2, us.glowR * 2);
    }

    drawTitleStars(now);

    rafId = requestAnimationFrame(draw);
  }

  /* ---- DOM phase writer ---- */
  function scanClip(el, rIn, rOut){
    // reveal L→R (rIn 0→1), then SCAN OUT L→R (rOut 0→1: erased region grows from the left)
    if (!el) return;
    var right = (1 - rIn) * 102, left = rOut * 102;
    el.style.clipPath = el.style.webkitClipPath = 'inset(0 ' + right.toFixed(1) + '% 0 ' + left.toFixed(1) + '%)';
    el.style.transform = 'translateX(' + (((1 - rIn) * -18) + rOut * 18).toFixed(1) + 'px)';
  }
  /* ---- the house EXIT: SINK + FLAT RIPPLE ----
     A card falls straight DOWN and shrinks UNIFORMLY (translateY + uniform scale
     + fade) staying PARALLEL to the screen — no tilt, no perspective. Pure
     functions of exit progress g — fully scrub-reversible (ripples un-fire). */
  function fallT(g, depth){
    var f = smooth(0, 0.62, g);
    return ' translateY(' + (f * depth * 0.5).toFixed(1) + 'px) scale(' + lerp(1, 0.66, f).toFixed(3) + ')';
  }
  function fallFilter(g){
    var f = smooth(0, 0.62, g);
    return 'brightness(' + lerp(1, 0.55, f).toFixed(2) + ') blur(' + (f * 3.5).toFixed(1) + 'px)';
  }
  function fallGone(g){ return 1 - smooth(0.5, 0.66, g); }   // opacity multiplier for a sinking card
  function splashOutBg(el, g){
    if (!el) return;
    if (g <= 0){
      el.style.clipPath = el.style.webkitClipPath = ''; el.style.filter = '';
      el.style.transform = ''; el.style.opacity = '';
      return;
    }
    /* the glass shell sinks straight DOWN + shrinks uniformly — facing us the
       whole way (no tilt); its TEXT stays anchored, readable, and ends on top */
    var f = smooth(0, 0.62, g);
    el.style.clipPath = el.style.webkitClipPath = '';
    el.style.transform = 'translateY(' + (f * 34).toFixed(1) + 'px) scale(' + lerp(1, 0.7, f).toFixed(3) + ')';
    el.style.filter = 'brightness(' + lerp(1, 0.5, f).toFixed(2) + ') blur(' + (f * 4).toFixed(1) + 'px)';
    el.style.opacity = fallGone(g).toFixed(3);
  }
  /* glass → dot: shines, collapses to a glowing dot, fades. Fully scrub-reversible. */
  function dotMorph(el, g, accent, base){
    if (!el) return;
    base = base || '';
    if (g <= 0){
      el.style.transform = base; el.style.borderRadius = ''; el.style.filter = '';
      el.style.boxShadow = ''; if (!base) el.style.opacity = '';
      return;
    }
    var sc = lerp(1, 0.04, smooth(0.12, 0.9, g));
    el.style.transform = base + ' scale(' + sc.toFixed(3) + ')';
    el.style.borderRadius = (18 + g * 420) + 'px';
    el.style.filter = 'brightness(' + (1 + g * 2.2).toFixed(2) + ') saturate(' + (1 + g).toFixed(2) + ')';
    el.style.boxShadow = '0 0 ' + (g * 46).toFixed(0) + 'px ' + (g * 16).toFixed(0) + 'px color-mix(in oklch, ' + accent + ' ' + Math.round(g * 55) + '%, transparent)';
    el.style.opacity = g > 0.84 ? (1 - (g - 0.84) / 0.16).toFixed(3) : '1';
  }
  var statWrap = sec.querySelector('.pflow-statwrap');
  /* ---- trigger-to-play exits + FIELD WAVES (the approved W1+5 recipe) ----
     When p crosses an exit's trigger the card plays its sink on its OWN clock
     (~0.85s). Once the card has FULLY disappeared, an invisible wavefront
     launches through the constellation: nearby stars + their links are
     displaced radially, brighten at the crest, and a soft underglow lingers
     where the card sank. NO rings are drawn — the medium itself reacts.
     Scrolling back above the trigger rewinds everything (waves un-fire). */
  var exitAnims = [];
  function exitAnim(trigger, el, clock){
    var st = { v: 0, on: false, trigger: trigger, el: el || null, clock: clock || 'p',
               w: 0, u: 0, placed: false, cx: 0, cy: 0, amp: 0, maxR: 0, glowR: 0, wDur: 1000 };
    exitAnims.push(st);
    return st;
  }
  function placeWave(st){
    var sr = stage.getBoundingClientRect(), r = st.el.getBoundingClientRect();
    if (!r.width) return;
    st.cx = r.left + r.width / 2 - sr.left;
    st.cy = r.top + r.height / 2 - sr.top;
    st.amp = Math.max(12, Math.min(30, r.width * 0.07));
    st.maxR = Math.max(240, Math.min(1400, r.width * 2.4));
    st.glowR = Math.min(700, r.width * 0.9 + 60);
    st.wDur = Math.max(850, Math.min(1500, r.width * 1.3));
    st.placed = true;
  }
  function stepExits(dt){
    for (var i = 0; i < exitAnims.length; i++){
      var st = exitAnims[i];
      var ck = st.clock === 'q' ? q : p;
      if (st.on){ if (ck < st.trigger - 0.012) st.on = false; }   // hysteresis vs eased jitter
      else if (ck >= st.trigger) st.on = true;
      if (st.on){ if (st.v < 1) st.v = Math.min(1, st.v + dt / 850); }
      else if (st.v > 0) st.v = Math.max(0, st.v - dt / 550);
      // capture the card's position early in the exit (before it shrinks much)
      if (st.el){
        if (st.v > 0.03 && !st.placed) placeWave(st);
        else if (st.v <= 0.02 && st.placed) st.placed = false;
      }
      // wave + underglow run on their own clocks, ONLY once the card is fully gone
      if (st.v >= 0.66 && st.placed){
        if (st.w < 1) st.w = Math.min(1, st.w + dt / st.wDur);
        if (st.u < 1) st.u = Math.min(1, st.u + dt / (st.wDur + 700));
      } else if (st.v < 0.5 && (st.w > 0 || st.u > 0)){
        st.w = 0; st.u = 0;
      }
    }
  }
  function snapExits(){
    for (var i = 0; i < exitAnims.length; i++){
      var st = exitAnims[i];
      st.on = (st.clock === 'q' ? q : p) >= st.trigger;
      st.v = st.on ? 1 : 0;
      st.w = st.on ? 1 : 0;
      st.u = st.on ? 1 : 0;
    }
    dockHeadAnim.v = dockHeadAnim.raw = smooth(0.158, 0.215, p);
    dockApprAnim.v = dockApprAnim.raw = smooth(0.698, 0.748, p);
  }
  var exGlassHead = exitAnim(0.10, headGlass);
  var exStat = exitAnim(0.512, statWrap);
  var exGlassAppr = exitAnim(0.648, apprGlass);
  var exCards = cards.map(function (c, i){ return exitAnim(0.498 + i * 0.008, c); });
  var exOc = ocCards.map(function (c, i){ return exitAnim(0.858 + i * 0.0035, c); });
  /* the giant finale title sinks JUST LIKE the cards — same trigger-played sink,
     same W1 swell + W5 underglow — on the TAIL clock (q), after its fill beat */
  var exTitle = exitAnim(0.64, wtEl, 'q');
  /* fast-scroll guard: a dock NEVER moves its block while that block's glass is
     still mid-sink — it holds, then eases in at a capped rate (~0.6s full travel).
     Slow scrubbing is unaffected (the cap is faster than a normal scrub). */
  var dockHeadAnim = { v: 0, raw: 0 };
  var dockApprAnim = { v: 0, raw: 0 };
  function stepDocks(dt){
    var pairs = [[dockHeadAnim, exGlassHead], [dockApprAnim, exGlassAppr]];
    for (var i = 0; i < pairs.length; i++){
      var d = pairs[i][0], ex = pairs[i][1];
      var target = (ex.v > 0.02 && ex.v < 0.995) ? Math.min(d.raw, d.v) : d.raw;
      var rate = dt / 600;
      if (d.v < target) d.v = Math.min(target, d.v + rate);
      else if (d.v > target) d.v = Math.max(target, d.v - rate);
    }
  }
  var gapH2 = head.querySelector('h2'), gapLead = head.querySelector('.pflow-lead'), gapEye = head.querySelector('.eyebrow');
  var paH = approach ? approach.querySelector('.pa-h') : null;
  var paP = approach ? approach.querySelector('.pa-p') : null;
  var paEye = approach ? approach.querySelector('.eyebrow') : null;

  function targetP(){
    // scrub over the PIN span only; the tail clamps p at 1 (dead-zone hold, mirrors platform)
    var total = (PIN_VH - 1) * window.innerHeight;
    return total > 0 ? clamp(-sec.getBoundingClientRect().top / total) : 0;
  }
  function targetQ(){
    // tail progress: 0→1 across the PFLOW_TAIL_VH hold after the base span
    var vh = window.innerHeight;
    var over = -sec.getBoundingClientRect().top - (PIN_VH - 1) * vh;
    var total = PFLOW_TAIL_VH * vh;
    return total > 0 ? clamp(over / total) : 0;
  }
  function update(){
    p = targetP();
    q = targetQ();
    applyPhases();
  }
  function applyPhases(){
    (window.__fmMotion || (window.__fmMotion = {})).pflow = p;
    /* ============================================================
       BEAT MAP (strict sequence — no beat starts before the prior one ends)
       0.012–0.052  glass + eyebrow + headline materialise at centre
       0.100–0.148  1) GLASS SINK — shell drops straight down + shrinks (face-on) with a flat
                    concentric ripple; eyebrow + headline stay on top (text never splashes)
       0.158–0.215  2) headline DOCKS to top (gentle rise, no snap)
       0.228–0.368  3) five problem cards stagger in (only after dock)
       0.382–0.415  4a) $52K metric pill
       0.428–0.468  4b) supporting copy (only after pill is visible)
       0.490–0.566  PROBLEM EXIT — text FADES (no splash); friction cards + $52K SINK with flat ripples
       0.572–0.642  GLASS RESET — full “One digital layer…” message (eyebrow + headline + support copy) at centre
       0.648–0.690  glass shell sinks + flat ripple — text stays on top
       0.698–0.748  headline docks at top — support copy FADES; eyebrow + headline PERSIST
       0.760–0.860  eight capability cards reveal (translateY + rotateX)
       0.858–0.921  capability cards SINK + flat ripple out (staggered) · 0.872–0.916 solution text fades
       0.922–0.972  stars SPIRAL + lock onto the wheel coords (scene already cleared)
       0.958–0.990  wheel blooms hub-first · ~0.97 ignition flash · giant title drifts behind
       ============================================================ */

    // ---- OPEN — glass card is the only active element; it FALLS + SPLASHES away FIRST ----
    var gIn  = smooth(0.012, 0.052, p);
    var gOut = exGlassHead.v;                      // 1) trigger-played: glass sinks on its own clock once p crosses 0.10
    dockHeadAnim.raw = smooth(0.158, 0.215, p);
    var dock = dockHeadAnim.v;                     // 2) docks only AFTER the glass sink completes (fast-scroll safe)
    var hOut = smooth(0.49, 0.538, p);             // exit: TEXT fades only — it never splashes
    head.style.opacity = (gIn * (1 - hOut)).toFixed(3);
    head.style.top = lerp(50, 10, dock).toFixed(2) + '%';
    var headSc = lerp(0.97, 1, gIn) * lerp(1, 0.78, dock);
    head.style.transform = 'translate(-50%, ' + lerp(-50, 0, dock).toFixed(1) + '%) scale(' + headSc.toFixed(3) + ')';
    head.style.filter = '';
    if (gapEye){
      gapEye.style.opacity = smooth(0.022, 0.06, p).toFixed(3);          // eyebrow PERSISTS until the exit fade
      gapEye.style.transform = 'scale(' + (1 / headSc).toFixed(4) + ')'; // …and NEVER resizes through the settle
    }
    scanClip(gapH2, smooth(0.04, 0.084, p), 0);
    scanClip(gapLead, smooth(0.058, 0.102, p), 0);   // legacy pages only — V3 markup has no .pflow-lead
    splashOutBg(headGlass, gOut);

    // ---- 3) PROBLEM BUILD: five cards stagger in; exit is a staggered FALL + SPLASH ----
    cards.forEach(function (c, i){
      var inT = smooth(0.228 + i * 0.024, 0.272 + i * 0.024, p);
      var out = exCards[i].v;                                       // trigger-played sink
      c.style.opacity = (inT * fallGone(out)).toFixed(3);
      c.style.transform = 'translateY(' + lerp(22, 0, inT).toFixed(1) + 'px)' + (out > 0 ? fallT(out, 44) : '');
      c.style.filter = out > 0 ? fallFilter(out) : '';
      c.style.clipPath = c.style.webkitClipPath = '';
    });

    // ---- 4) COST: one glass block — pill first, copy second; the whole block falls out ----
    var swIn = smooth(0.375, 0.412, p);
    var swOut = exStat.v;                          // trigger-played sink
    if (statWrap){
      statWrap.style.opacity = (swIn * fallGone(swOut)).toFixed(3);
      statWrap.style.transform = 'translateX(-50%) scale(' + lerp(0.97, 1, swIn).toFixed(3) + ')' + (swOut > 0 ? fallT(swOut, 56) : '');
      statWrap.style.filter = swOut > 0 ? fallFilter(swOut) : '';
    }
    var stIn = smooth(0.382, 0.415, p);
    stat.style.opacity = stIn.toFixed(3);
    stat.style.transform = 'translateY(' + lerp(10, 0, stIn).toFixed(1) + 'px)';
    stat.style.borderRadius = ''; stat.style.boxShadow = '';
    stat.style.clipPath = stat.style.webkitClipPath = ''; stat.style.filter = '';
    if (statCopy){
      var cpIn = smooth(0.428, 0.468, p);
      statCopy.style.opacity = cpIn.toFixed(3);
      statCopy.style.transform = 'translateY(' + lerp(8, 0, cpIn).toFixed(1) + 'px)';
      statCopy.style.clipPath = statCopy.style.webkitClipPath = '';
    }

    // ---- GLASS RESET: “One digital layer…” bridge — appears only after the problem state is fully cleared,
    //      breathes, scans out completely, and ONLY THEN docks as “The FrontM approach” ----
    var aIn   = smooth(0.572, 0.615, p);           // glass returns calmly
    var agOut = exGlassAppr.v;                     // trigger-played: glass sinks on its own clock
    dockApprAnim.raw = smooth(0.698, 0.748, p);
    var aDock = dockApprAnim.v;                    // docks only AFTER the reset glass sink completes
    var aOut  = smooth(0.872, 0.916, p);           // exit: TEXT fades only, before the stars converge
    if (approach){
      approach.style.opacity = (aIn * (1 - aOut)).toFixed(3);
      approach.style.top = lerp(50, 8, aDock).toFixed(2) + '%';
      var apprSc = lerp(0.97, 1, aIn) * lerp(1, 0.78, aDock);
      approach.style.transform = 'translate(-50%, ' + lerp(-50, 0, aDock).toFixed(1) + '%) scale(' + apprSc.toFixed(3) + ')';
      approach.style.filter = '';
      scanClip(paH, smooth(0.582, 0.628, p), 0);
      /* the FULL message reads at the centred bridge; the support copy FADES (it
         never splashes) across the dock — eyebrow + headline PERSIST to the exit */
      var paMidOut = smooth(0.700, 0.744, p);
      scanClip(paP, smooth(0.598, 0.642, p), 0);
      if (paP){
        paP.style.opacity = paMidOut > 0 ? (1 - paMidOut).toFixed(3) : '';
        paP.style.filter = '';
      }
      if (paEye){
        paEye.style.opacity = smooth(0.576, 0.612, p).toFixed(3);          // PERSISTS — exact mirror of the problem eyebrow
        paEye.style.transform = 'scale(' + (1 / apprSc).toFixed(4) + ')';  // never resizes through the settle
      }
      splashOutBg(apprGlass, agOut);
    }

    // ---- the 8 capabilities: soft translateY + rotateX reveal; staggered FALL + SPLASH out ----
    ocCards.forEach(function (c, i){
      var fi = smooth(0.76 + i * 0.009, 0.80 + i * 0.009, p);
      var oOut = exOc[i].v;                                          // trigger-played sink, staggered triggers
      c.style.opacity = (fi * fallGone(oOut)).toFixed(3);
      c.style.transform = 'translateY(' + lerp(18, 0, fi).toFixed(1) + 'px) rotateX(' + ((1 - fi) * 8).toFixed(1) + 'deg)' + (oOut > 0 ? fallT(oOut, 40) : '');
      c.style.borderRadius = ''; c.style.boxShadow = '';
      c.style.filter = oOut > 0 ? fallFilter(oOut) : '';
      c.style.clipPath = c.style.webkitClipPath = '';
    });

    // FINALE: the stars converge first (scene already cleared), THEN the wheel blooms hub-first
    var wIn = smooth(0.958, 0.99, p);
    if (wheelWrap){
      wheelWrap.style.opacity = wIn.toFixed(3);
      wheelWrap.style.transform = 'translate(-50%, -50%) scale(' + lerp(0.96, 1, wIn).toFixed(3) + ')';
      wheelWrap.classList.toggle('live', p > 0.985);
      if (cwStage){
        if (p > 0.962 && !cwStage.classList.contains('in')) cwStage.classList.add('in');
        else if (p <= 0.93 && cwStage.classList.contains('in')) cwStage.classList.remove('in');
      }
    }
    if (wheelTitle){
      var wtIn = smooth(0.965, 0.995, p);
      // TAIL: after the 1.25-page fill, the title sinks EXACTLY like the cards —
      // trigger-played on the tail clock, with W1 swell + W5 underglow after it’s gone
      var ts = exTitle.v;
      var tf = smooth(0, 0.62, ts);
      wheelTitle.style.opacity = (wtIn * fallGone(ts)).toFixed(3);
      wheelTitle.style.transform = 'translate(-50%, calc(-50% + ' + (lerp(40, 0, wtIn) + tf * 64).toFixed(1) + 'px)) scale(' + lerp(1, 0.72, tf).toFixed(3) + ')';
      wheelTitle.style.filter = ts > 0 ? 'brightness(' + lerp(1, 0.5, tf).toFixed(2) + ') blur(' + (tf * 4).toFixed(1) + 'px)' : '';
    }

    // cue fades once the glass starts its scan
    if (cue) cue.style.opacity = (1 - smooth(0.03, 0.10, p)).toFixed(3);
  }

  /* ---- scroll + raf plumbing ---- */
  var ticking = false;
  function onScroll(){
    // the rAF draw loop owns phase application while running; this is the fallback
    if (rafId) return;
    if (!ticking){ ticking = true; requestAnimationFrame(function(){ update(); ticking = false; }); }
  }

  var narrowMQ = matchMedia('(max-width: 980px), (orientation: portrait) and (max-width: 1366px)');
  var dynamicOn = false, rafId = 0, visible = true;

  function clearInline(){
    [head, stat, statCopy, statWrap, approach, wheelWrap, wheelTitle].forEach(function (el){ if (el){ el.style.opacity = ''; el.style.transform = ''; el.style.top = ''; el.style.filter = ''; } });
    [gapH2, gapLead, paH, paP].forEach(function (el){ if (el){ el.style.clipPath = el.style.webkitClipPath = ''; el.style.transform = ''; el.style.filter = ''; el.style.opacity = ''; } });
    [headGlass, apprGlass, stat, statCopy].forEach(function (el){ if (el){ el.style.borderRadius = ''; el.style.filter = ''; el.style.boxShadow = ''; el.style.transform = ''; el.style.opacity = ''; el.style.clipPath = el.style.webkitClipPath = ''; } });
    exitAnims.forEach(function (st){ st.v = 0; st.on = false; st.w = 0; st.u = 0; st.placed = false; });
    dockHeadAnim.v = dockHeadAnim.raw = 0;
    dockApprAnim.v = dockApprAnim.raw = 0;
    if (paEye){ paEye.style.opacity = ''; paEye.style.transform = ''; }
    if (gapEye) gapEye.style.opacity = '';
    wtLines.forEach(function (l){ l.style.removeProperty('--fa'); l.style.removeProperty('--gw'); });
    cards.forEach(function (c){ c.style.opacity = ''; c.style.transform = ''; c.style.filter = ''; c.style.clipPath = c.style.webkitClipPath = ''; });
    ocCards.forEach(function (c){ c.style.opacity = ''; c.style.transform = ''; c.style.borderRadius = ''; c.style.filter = ''; c.style.boxShadow = ''; c.style.clipPath = c.style.webkitClipPath = ''; });
    if (cue) cue.style.opacity = '';
    if (cwStage) cwStage.classList.add('in');   // static fallback: wheel fully visible
    ctx.clearRect(0, 0, sW, sH); pulses.length = 0; blooms.length = 0;
  }
  function startDynamic(){
    if (dynamicOn) return;
    dynamicOn = true; sec.classList.remove('pf-static');
    sec.style.height = ((PIN_VH + PFLOW_TAIL_VH) * window.innerHeight) + 'px';
    if (cwStage) cwStage.classList.remove('in');   // FINALE drives the bloom
    window.addEventListener('scroll', onScroll, { passive: true });
    geo(); p = targetP(); snapExits(); update();
    if (visible && !rafId) rafId = requestAnimationFrame(draw);
  }
  function stopDynamic(){
    dynamicOn = false;
    window.removeEventListener('scroll', onScroll);
    if (rafId){ cancelAnimationFrame(rafId); rafId = 0; }
    sec.style.height = '';
    clearInline(); sec.classList.add('pf-static');
  }
  function applyMode(){
    var red = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (narrowMQ.matches || red) stopDynamic(); else startDynamic();
  }

  window.addEventListener('resize', function(){
    if (dynamicOn){ sec.style.height = ((PIN_VH + PFLOW_TAIL_VH) * window.innerHeight) + 'px'; geo(); update(); }
    else applyMode();   // viewport may have crossed the 980px threshold without an mq event
  }, { passive: true });
  if ('IntersectionObserver' in window){
    new IntersectionObserver(function (e){
      visible = e[e.length - 1].isIntersecting;   // last entry — e[0] is stale when leave+enter batch
      if (visible && dynamicOn){ p = targetP(); snapExits(); if (!rafId) rafId = requestAnimationFrame(draw); }
    }, { rootMargin: '0px' }).observe(sec);
  }

  applyMode();
  (narrowMQ.addEventListener ? narrowMQ.addEventListener('change', applyMode) : narrowMQ.addListener(applyMode));
  setTimeout(function(){ applyMode(); if (dynamicOn){ geo(); update(); } }, 250);

  /* QA hook: drive the scrub without rAF (throttled iframes) + geometry assertion. */
  window.__pflowQA = {
    update: update,
    draw: function(t){ draw(t || performance.now()); },
    isDynamic: function(){ return dynamicOn; },
    /* assert the canvas converge targets land on the DOM wheel nodes (same px) */
    assertGeometry: function(){
      measureWheel();
      if (wheelPts.length !== 20 || !cwStage) return { ok: false, reason: 'no wheel points' };
      var sr = stage.getBoundingClientRect();
      var domNodes = [].slice.call(cwStage.querySelectorAll('.cw-node'));
      var maxD = 0;
      domNodes.slice(0, 20).forEach(function (el, i){
        var r = el.getBoundingClientRect();
        var cx = r.left + r.width / 2 - sr.left, cy = r.top + r.height / 2 - sr.top;
        var d = Math.hypot(cx - wheelPts[i].x, cy - wheelPts[i].y);
        if (d > maxD) maxD = d;
      });
      return { ok: maxD < 2, maxDeltaPx: +maxD.toFixed(2), points: wheelPts.length, domNodes: domNodes.length };
    }
  };
})();
