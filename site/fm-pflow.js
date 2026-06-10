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

  // ---- pin length — ONE named constant (tune here; CSS 720vh is the no-JS fallback)
  var PIN_VH = 7.2;
  // rest hold at p=1: the finished wheel stays pinned for this extra slice before unpin
  var PFLOW_TAIL_VH = 0.35;

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
  var wheelPts = [];
  function measureWheel(){
    wheelPts = [];
    if (!cwStage || !FM.wheelGeometry) return;
    var G = FM.wheelGeometry();
    var sr = stage.getBoundingClientRect(), wr = cwStage.getBoundingClientRect();
    if (!wr.width) return;
    var ox = wr.left - sr.left, oy = wr.top - sr.top;
    G.mods.forEach(function (m) { wheelPts.push({ x: ox + (m.x / 100) * wr.width, y: oy + (m.y / 100) * wr.height, c: m.color }); });
    G.stk.forEach(function (s)  { wheelPts.push({ x: ox + (s.x / 100) * wr.width, y: oy + (s.y / 100) * wr.height, c: '#9A86FF' }); });
  }
  function geo(){
    sW = stage.clientWidth; sH = stage.clientHeight;
    canvas.width = sW * DPR; canvas.height = sH * DPR;
    canvas.style.width = sW + 'px'; canvas.style.height = sH + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    measureWheel();
  }
  if ('ResizeObserver' in window && cwStage) new ResizeObserver(measureWheel).observe(cwStage);
  function px(n, X, Y){ return [X * sW, Y * sH]; }

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

  var p = 0, activeCount = 0;
  function draw(now){
    if (!dynamicOn || !visible){ rafId = 0; return; }
    // eased scroll progress — same inertia recipe as the platform engine
    var tp = targetP();
    if (!reduced){
      p += (tp - p) * 0.16;
      if (Math.abs(tp - p) < 0.0005) p = tp;
    } else { p = tp; }
    applyPhases();
    ctx.clearRect(0, 0, sW, sH);

    var problem = smooth(0.08, 0.40, p);
    var heal    = smooth(0.56, 0.76, p);              // chaos resolves (HEAL)
    var gather  = smooth(0.875, 0.975, p);            // fragments converge onto WHEEL coords (FINALE)
    var fade    = 1 - smooth(0.935, 0.995, p);        // canvas hands off to the DOM wheel at the very end
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
      // FINALE: 8 earliest-born → module coords (colour-matched), next 12 → stakeholder coords, rest fade
      if (gather > 0 && wheelPts.length === 20){
        if (i < 20){
          var tgt = wheelPts[i];
          nd.cx = lerp(nd.cx, tgt.x, gather); nd.cy = lerp(nd.cy, tgt.y, gather);
          nd.gc = tgt.c;
        } else {
          nd.alpha *= (1 - gather);
        }
      }
      nd.alpha *= fade;
    }

    // faint links between near neighbours — strengthen as the network HEALS (order from chaos)
    var linkAlpha = (0.06 + heal * 0.22) * fade * (1 - gather * 0.6);
    if (linkAlpha > 0.01){
      ctx.lineWidth = 1;
      for (i = 0; i < activeCount; i++){
        var n1 = nodes[i]; if (n1.alpha < 0.05) continue;
        var nb = -1, bd = 1e9;
        for (var j = 0; j < activeCount; j++){ if (j === i) continue; var dx = nodes[j].cx - n1.cx, dy = nodes[j].cy - n1.cy, d = dx*dx + dy*dy; if (d < bd){ bd = d; nb = j; } }
        if (nb > i){
          ctx.strokeStyle = 'rgba(140,160,225,' + linkAlpha.toFixed(3) + ')';
          ctx.beginPath(); ctx.moveTo(n1.cx, n1.cy); ctx.lineTo(nodes[nb].cx, nodes[nb].cy); ctx.stroke();
        }
      }
    }

    // nodes
    for (i = 0; i < activeCount; i++){
      var n = nodes[i]; if (n.alpha < 0.02) continue;
      var tw = (0.6 + 0.4 * Math.sin(now * 0.001 + n.ph));
      var col = (gather > 0 && n.gc) ? mix(n.c, n.gc, gather) : n.c;
      ctx.save(); ctx.globalAlpha = n.alpha * tw; ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 10;
      ctx.beginPath(); ctx.arc(n.cx, n.cy, n.r, 0, 6.2832); ctx.fill(); ctx.restore();
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

    // arrival bloom rings (order restored)
    for (i = blooms.length - 1; i >= 0; i--){
      var bl = blooms[i]; bl.r += 0.9; bl.a -= 0.02;
      if (bl.a <= 0){ blooms.splice(i, 1); continue; }
      ctx.save(); ctx.globalAlpha = bl.a * fade; ctx.strokeStyle = '#18C95C'; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.arc(bl.x, bl.y, bl.r, 0, 6.2832); ctx.stroke(); ctx.restore();
    }

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
  /* glass → scan-out: the panel wipes away L\u2192R behind its text (replaces the dot collapse) */
  function scanOutBg(el, g){
    if (!el) return;
    if (g <= 0){
      el.style.clipPath = el.style.webkitClipPath = ''; el.style.filter = '';
      el.style.transform = ''; el.style.opacity = '';
      return;
    }
    el.style.clipPath = el.style.webkitClipPath = 'inset(0 0 0 ' + (g * 102).toFixed(1) + '%)';
    el.style.transform = 'translateX(' + (g * 24).toFixed(1) + 'px)';
    el.style.filter = 'brightness(' + (1 + g * 0.5).toFixed(2) + ')';
    el.style.opacity = g > 0.9 ? ((1 - g) / 0.1).toFixed(3) : '1';
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
  var gapH2 = head.querySelector('h2'), gapLead = head.querySelector('.pflow-lead');
  var paH = approach ? approach.querySelector('.pa-h') : null;
  var paP = approach ? approach.querySelector('.pa-p') : null;
  var paEye = approach ? approach.querySelector('.eyebrow') : null;

  function targetP(){
    // scrub over the PIN span only; the tail clamps p at 1 (dead-zone hold, mirrors platform)
    var total = (PIN_VH - 1) * window.innerHeight;
    return total > 0 ? clamp(-sec.getBoundingClientRect().top / total) : 0;
  }
  function update(){
    p = targetP();
    applyPhases();
  }
  function applyPhases(){
    (window.__fmMotion || (window.__fmMotion = {})).pflow = p;
    /* ============================================================
       BEAT MAP (strict sequence — no beat starts before the prior one ends)
       0.012–0.052  glass + headline materialise at centre
       0.100–0.148  1) GLASS SCAN-OUT — completes fully first
       0.158–0.215  2) headline DOCKS to top (gentle rise, no snap)
       0.228–0.368  3) five problem cards stagger in (only after dock)
       0.382–0.415  4a) $52K metric pill
       0.428–0.468  4b) supporting copy (only after pill is visible)
       0.490–0.566  EXIT — unified L→R scan-out across the whole problem state
       0.572–0.625  GLASS RESET — “One digital layer…” bridge (then breathe)
       0.648–0.690  glass scan-out completes
       0.698–0.748  “FrontM approach” docks at top
       0.760–0.863  eight capability cards reveal (translateY + rotateX)
       0.878–0.947  capabilities scan out · 0.900–0.958 wheel blooms
       ============================================================ */

    // ---- OPEN — glass card is the only active element; it scans out FIRST ----
    var gIn  = smooth(0.012, 0.052, p);
    var gOut = smooth(0.10, 0.148, p);             // 1) glass scan-out, completes before anything else moves
    var dock = smooth(0.158, 0.215, p);            // 2) headline docks only after the glass is gone
    var hOut = smooth(0.49, 0.538, p);             // exit: headline wipes L→R with the rest of the state
    head.style.opacity = (gIn * (1 - smooth(0.545, 0.572, p))).toFixed(3);
    head.style.top = lerp(50, 10, dock).toFixed(2) + '%';
    head.style.transform = 'translate(-50%, ' + lerp(-50, 0, dock).toFixed(1) + '%) scale(' + (lerp(0.97, 1, gIn) * lerp(1, 0.78, dock)).toFixed(3) + ')';
    scanClip(gapH2, smooth(0.022, 0.066, p), hOut);
    scanClip(gapLead, smooth(0.04, 0.084, p), hOut);
    scanOutBg(headGlass, gOut);

    // ---- 3) PROBLEM BUILD: five cards stagger in; exit is a unified L→R scan, gently staggered ----
    cards.forEach(function (c, i){
      var inT = smooth(0.228 + i * 0.024, 0.272 + i * 0.024, p);
      var out = smooth(0.498 + i * 0.006, 0.542 + i * 0.006, p);
      c.style.opacity = inT.toFixed(3);
      c.style.transform = 'translateY(' + lerp(22, 0, inT).toFixed(1) + 'px) translateX(' + (out * 18).toFixed(1) + 'px)';
      if (out > 0){
        c.style.clipPath = c.style.webkitClipPath = 'inset(0 0 0 ' + (out * 102).toFixed(1) + '%)';
        c.style.filter = 'brightness(' + (1 + out * 0.5).toFixed(2) + ')';
      } else {
        c.style.clipPath = c.style.webkitClipPath = '';
        c.style.filter = '';
      }
    });

    // ---- 4) COST: metric pill first, supporting copy second (problem → impact) ----
    var stIn = smooth(0.382, 0.415, p);
    var stOut = smooth(0.512, 0.556, p);
    stat.style.opacity = stIn.toFixed(3);
    stat.style.transform = 'translateX(calc(-50% + ' + (stOut * 20).toFixed(1) + 'px)) translateY(' + lerp(10, 0, stIn).toFixed(1) + 'px)';
    stat.style.borderRadius = ''; stat.style.boxShadow = '';
    if (stOut > 0){
      stat.style.clipPath = stat.style.webkitClipPath = 'inset(0 0 0 ' + (stOut * 102).toFixed(1) + '%)';
      stat.style.filter = 'brightness(' + (1 + stOut * 0.6).toFixed(2) + ')';
    } else {
      stat.style.clipPath = stat.style.webkitClipPath = '';
      stat.style.filter = '';
    }
    if (statCopy){
      var cpIn = smooth(0.428, 0.468, p);
      var cpOut = smooth(0.518, 0.562, p);
      statCopy.style.opacity = cpIn.toFixed(3);
      statCopy.style.transform = 'translateX(calc(-50% + ' + (cpOut * 20).toFixed(1) + 'px)) translateY(' + lerp(8, 0, cpIn).toFixed(1) + 'px)';
      if (cpOut > 0){
        statCopy.style.clipPath = statCopy.style.webkitClipPath = 'inset(0 0 0 ' + (cpOut * 102).toFixed(1) + '%)';
      } else {
        statCopy.style.clipPath = statCopy.style.webkitClipPath = '';
      }
    }

    // ---- GLASS RESET: “One digital layer…” bridge — appears only after the problem state is fully cleared,
    //      breathes, scans out completely, and ONLY THEN docks as “The FrontM approach” ----
    var aIn   = smooth(0.572, 0.615, p);           // glass returns calmly
    var agOut = smooth(0.648, 0.69, p);            // glass scan-out completes
    var aDock = smooth(0.698, 0.748, p);           // headline docks at top
    var aOut  = smooth(0.885, 0.928, p);           // clears ahead of the wheel finale
    if (approach){
      approach.style.opacity = (aIn * (1 - aOut)).toFixed(3);
      approach.style.top = lerp(50, 8, aDock).toFixed(2) + '%';
      approach.style.transform = 'translate(-50%, ' + lerp(-50, 0, aDock).toFixed(1) + '%) scale(' + (lerp(0.97, 1, aIn) * lerp(1, 0.78, aDock)).toFixed(3) + ')';
      scanClip(paH, smooth(0.582, 0.628, p), smooth(0.885, 0.928, p));
      scanClip(paP, smooth(0.736, 0.778, p), smooth(0.89, 0.932, p));   // support copy reveals AFTER the dock
      if (paEye) paEye.style.opacity = (smooth(0.71, 0.755, p) * (1 - aOut)).toFixed(3); // eyebrow arrives with the dock
      scanOutBg(apprGlass, agOut);
    }

    // ---- the 8 capabilities: soft translateY + rotateX reveal (subtle, controlled flip); later SCAN OUT L→R ----
    ocCards.forEach(function (c, i){
      var fi = smooth(0.76 + i * 0.009, 0.80 + i * 0.009, p);
      var oOut = smooth(0.878 + i * 0.0045, 0.915 + i * 0.0045, p);   // staggered scan-out before the wheel is live
      c.style.opacity = fi.toFixed(3);
      c.style.transform = 'translateY(' + lerp(18, 0, fi).toFixed(1) + 'px) rotateX(' + ((1 - fi) * 8).toFixed(1) + 'deg) translateX(' + (oOut * 18).toFixed(1) + 'px)';
      c.style.borderRadius = ''; c.style.boxShadow = '';
      if (oOut > 0){
        // erased region grows from the left, with a slight brightness lift on the wipe
        c.style.clipPath = c.style.webkitClipPath = 'inset(0 0 0 ' + (oOut * 102).toFixed(1) + '%)';
        c.style.filter = 'brightness(' + (1 + oOut * 0.6).toFixed(2) + ')';
      } else {
        c.style.clipPath = c.style.webkitClipPath = '';
        c.style.filter = '';
      }
    });

    // FINALE: wheel blooms over the converged fragments
    var wIn = smooth(0.90, 0.958, p);
    if (wheelWrap){
      wheelWrap.style.opacity = wIn.toFixed(3);
      wheelWrap.style.transform = 'translate(-50%, -50%) scale(' + lerp(0.94, 1, wIn).toFixed(3) + ')';
      wheelWrap.classList.toggle('live', p > 0.96);
      if (cwStage){
        if (p > 0.905 && !cwStage.classList.contains('in')) cwStage.classList.add('in');
        else if (p <= 0.885 && cwStage.classList.contains('in')) cwStage.classList.remove('in');
      }
    }
    if (wheelTitle){
      var wtIn = smooth(0.92, 0.972, p);
      wheelTitle.style.opacity = wtIn.toFixed(3);
      wheelTitle.style.transform = 'translateY(' + lerp(14, 0, wtIn).toFixed(1) + 'px)';
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
    [head, stat, statCopy, approach, wheelWrap, wheelTitle].forEach(function (el){ if (el){ el.style.opacity = ''; el.style.transform = ''; el.style.top = ''; } });
    [gapH2, gapLead, paH, paP].forEach(function (el){ if (el){ el.style.clipPath = el.style.webkitClipPath = ''; el.style.transform = ''; } });
    [headGlass, apprGlass, stat, statCopy].forEach(function (el){ if (el){ el.style.borderRadius = ''; el.style.filter = ''; el.style.boxShadow = ''; el.style.transform = ''; el.style.opacity = ''; el.style.clipPath = el.style.webkitClipPath = ''; } });
    if (paEye) paEye.style.opacity = '';
    cards.forEach(function (c){ c.style.opacity = ''; c.style.transform = ''; });
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
    geo(); update();
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
      if (visible && dynamicOn && !rafId) rafId = requestAnimationFrame(draw);
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
