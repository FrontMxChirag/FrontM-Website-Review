/* ============================================================
   FrontM Platform, scroll-driven 3D assembly + circuit finale.
   One rAF loop reads scroll progress p (0..1), smooths to s,
   writes every transform/opacity, and renders the circuit
   overlay (ambient brand nodes + wired traces + looping pulses).
   Reverses on scroll-up. Cursor parallax tilts the deck.
   ============================================================ */
(function () {
  var sec = document.getElementById('platform');
  if (!sec) return;

  var stage   = sec.querySelector('.pf-stage');
  var floor   = sec.querySelector('.pf-floor');
  var fglow   = sec.querySelector('.pf-floor-glow');
  var head    = sec.querySelector('.pf-head');
  var chans   = sec.querySelector('.pf-channels');
  var tiles   = Array.prototype.slice.call(sec.querySelectorAll('.pf-tile'));
  var deck    = sec.querySelector('.pf-deck');
  var cards   = {
    exchange: sec.querySelector('[data-card="exchange"]'),
    studio:   sec.querySelector('[data-card="studio"]'),
    fabric:   sec.querySelector('[data-card="fabric"]')
  };
  var leftNodes  = Array.prototype.slice.call(sec.querySelectorAll('[data-grp="left"] .pf-node'));
  var rightNodes = Array.prototype.slice.call(sec.querySelectorAll('[data-grp="right"] .pf-node'));
  var ecoL    = sec.querySelector('.pf-eco-left');
  var ecoR    = sec.querySelector('.pf-eco-right');
  var banner  = sec.querySelector('.pf-banner');
  var shield  = sec.querySelector('.pf-banner svg');
  var mark    = sec.querySelector('.pf-mark');
  var canvas  = sec.querySelector('.pf-circuit');
  var cctx    = canvas.getContext('2d');

  var mqNarrow  = matchMedia('(max-width: 980px)');
  var mqReduced = matchMedia('(prefers-reduced-motion: reduce)');

  // ---------- math ----------
  function clamp01(x){ return x < 0 ? 0 : x > 1 ? 1 : x; }
  function smooth(a, b, x){ var t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); }
  function lerp(a, b, t){ return a + (b - a) * t; }
  function rnd(a, b){ return a + Math.random() * (b - a); }
  function hexA(hex, a){ hex = (hex||'#9A86FF').trim().replace('#',''); var r=parseInt(hex.substr(0,2),16),g=parseInt(hex.substr(2,2),16),b=parseInt(hex.substr(4,2),16); return 'rgba('+r+','+g+','+b+','+a+')'; }

  // ============================================================
  //  PHASE WINDOWS  (p 0..1), small dead-zone so nothing fires
  //  until the stage is pinned and filling the viewport.
  // ============================================================
  var PH = {
    seedA: 0.03, seedB: 0.13,       // floor + heading + slab
    pivA:  0.13, pivB:  0.27,       // tip into 3D
    splitA:0.27, splitB:0.44,       // split into 3 cards (CENTRE DONE)
    chA:   0.44, chB:   0.54,       // channel row settles
    leftA: 0.54, leftB: 0.66,       // left ecosystem, one by one
    rightA:0.66, rightB:0.80,       // right ecosystem, one by one
    cirA:  0.80, cirB:  0.96         // circuit wires draw on; pulses loop after
  };

  // ============================================================
  //  CIRCUIT OVERLAY
  // ============================================================
  var DPR = Math.min(devicePixelRatio || 1, 2);
  var cw = 0, ch = 0;
  var BRAND = ['#01B3F6', '#3CAD33', '#FFC500', '#FF6A04', '#9A86FF', '#1FE6D4'];
  var anodes = [], alinks = [], wires = [], pulses = [];

  function sizeCanvas(){
    cw = stage.clientWidth; ch = stage.clientHeight;
    canvas.width = cw * DPR; canvas.height = ch * DPR;
    cctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  function buildAmbient(){
    anodes = [];
    var count = Math.round(Math.min(46, Math.max(20, (cw * ch) / 46000)));
    for (var i = 0; i < count; i++){
      var port = Math.random() < 0.16;
      anodes.push({ x: Math.random()*cw, y: Math.random()*ch, vx: rnd(-0.05,0.05), vy: rnd(-0.05,0.05),
        r: port ? rnd(2.4,3.2) : rnd(1.2,2.2), port: port, c: BRAND[(Math.random()*BRAND.length)|0], ph: Math.random()*6.2832 });
    }
  }

  // wired connections: left nodes -> Exchange (teal), right nodes -> nearest of Studio/Fabric (gold)
  function buildWires(){
    wires = [];
    leftNodes.forEach(function(n, i){ wires.push({ from: n, to: cards.exchange, side: 'l', c: '#00D9C9', i: i, grp: 'left' }); });
    rightNodes.forEach(function(n, i){ wires.push({ from: n, to: null, side: 'r', c: '#FFC500', i: i, grp: 'right' }); });
  }

  function rectIn(el){ var r = el.getBoundingClientRect(), s = stage.getBoundingClientRect();
    return { l: r.left - s.left, t: r.top - s.top, r: r.right - s.left, b: r.bottom - s.top, cx: r.left - s.left + r.width/2, cy: r.top - s.top + r.height/2 }; }

  var WIRE_GUTTER = 78;  // keep each wire's vertical leg this far OUT from the card (away from centre)
  // polyline helpers, orthogonal routes built as point lists
  function polyLen(p){ var L=0; for (var i=1;i<p.length;i++) L+=Math.hypot(p[i][0]-p[i-1][0], p[i][1]-p[i-1][1]); return L; }
  function drawPoly(p, frac){
    var target = polyLen(p) * frac, acc = 0;
    cctx.beginPath(); cctx.moveTo(p[0][0], p[0][1]);
    for (var i=1;i<p.length;i++){
      var dx=p[i][0]-p[i-1][0], dy=p[i][1]-p[i-1][1], seg=Math.hypot(dx,dy);
      if (acc+seg <= target){ cctx.lineTo(p[i][0], p[i][1]); acc+=seg; }
      else { var r = seg ? (target-acc)/seg : 0; cctx.lineTo(p[i-1][0]+dx*r, p[i-1][1]+dy*r); break; }
    }
    cctx.stroke();
  }
  function polyAt(p, t){
    var target = polyLen(p) * t, acc = 0;
    for (var i=1;i<p.length;i++){
      var dx=p[i][0]-p[i-1][0], dy=p[i][1]-p[i-1][1], seg=Math.hypot(dx,dy);
      if (acc+seg >= target){ var r = seg ? (target-acc)/seg : 0; return [p[i-1][0]+dx*r, p[i-1][1]+dy*r]; }
      acc += seg;
    }
    return p[p.length-1];
  }
  function linkPts(ax,ay,bx,by){ return [[ax,ay],[bx,ay],[bx,by]]; }   // ambient L-route
  // wired route: node -> out to a gutter BEYOND the card edge -> vertical -> short hop into the card
  function wirePtsOf(w){ var e = wireEnds(w); var bx = e[2] + Math.sign(e[0]-e[2]) * WIRE_GUTTER;
    return [[e[0],e[1]],[bx,e[1]],[bx,e[3]],[e[2],e[3]]]; }

  function wireEnds(w){
    var f = rectIn(w.from);
    var to = w.to;
    if (!to){ // pick nearest of studio/fabric by vertical proximity
      var fs = rectIn(cards.studio), ff = rectIn(cards.fabric);
      to = Math.abs(f.cy - fs.cy) <= Math.abs(f.cy - ff.cy) ? cards.studio : cards.fabric;
    }
    var c = rectIn(to);
    if (w.side === 'l') return [ f.r, f.cy, c.l, c.cy ];      // left node right-edge -> card left-edge
    return [ f.l, f.cy, c.r, c.cy ];                          // right node left-edge -> card right-edge
  }

  function wireDraw(w, s){
    if (w.grp === 'left')  return smooth(PH.cirA + w.i*0.015, PH.cirA + 0.10 + w.i*0.015, s);
    return smooth(PH.cirA + 0.05 + w.i*0.014, PH.cirA + 0.15 + w.i*0.014, s);
  }

  function spawnPulse(){
    // wired pulse most of the time, ambient pulse sometimes, each at a random speed
    if (wires.length && Math.random() < 0.72){
      var w = wires[(Math.random()*wires.length)|0];
      pulses.push({ kind:'wire', w:w, t:0, sp: rnd(0.004, 0.013), c: w.c });
    } else if (alinks.length){
      var l = alinks[(Math.random()*alinks.length)|0];
      pulses.push({ kind:'link', l:l, t:0, sp: rnd(0.004, 0.013), c: anodes[l.a].c });
    }
  }

  function drawCircuit(s, now){
    cctx.clearRect(0, 0, cw, ch);
    var fade = smooth(PH.cirA - 0.04, PH.cirA + 0.06, s);   // overall fade-in of the board
    if (fade <= 0.001) { pulses.length = 0; return; }

    // drift ambient nodes
    for (var i = 0; i < anodes.length; i++){
      var n = anodes[i];
      n.x += n.vx; n.y += n.vy;
      if (n.x < -10) n.x = cw+10; if (n.x > cw+10) n.x = -10;
      if (n.y < -10) n.y = ch+10; if (n.y > ch+10) n.y = -10;
    }
    // ambient nearest-neighbour links (orthogonal, faint)
    alinks = [];
    var maxd = Math.min(cw, ch) * 0.26;
    for (i = 0; i < anodes.length; i++){
      var best = -1, bd = maxd*maxd;
      for (var j = 0; j < anodes.length; j++){ if (j===i) continue; var dx=anodes[i].x-anodes[j].x, dy=anodes[i].y-anodes[j].y, d=dx*dx+dy*dy; if (d<bd){bd=d;best=j;} }
      if (best >= 0 && i < best) alinks.push({ a:i, b:best });
    }
    cctx.lineWidth = 1;
    for (i = 0; i < alinks.length; i++){
      var a = anodes[alinks[i].a], b = anodes[alinks[i].b];
      cctx.strokeStyle = 'rgba(130,150,220,' + (0.11*fade).toFixed(3) + ')';
      drawPoly(linkPts(a.x,a.y,b.x,b.y), 1);
      cctx.fillStyle = 'rgba(130,150,220,' + (0.16*fade).toFixed(3) + ')';
      cctx.fillRect(b.x-1, a.y-1, 2, 2);
    }
    // ambient nodes
    for (i = 0; i < anodes.length; i++){
      var nd = anodes[i], tw = (0.55 + 0.45*Math.sin(now*0.001 + nd.ph)) * fade;
      cctx.save(); cctx.globalAlpha = tw; cctx.fillStyle = nd.c; cctx.shadowColor = nd.c; cctx.shadowBlur = 7;
      if (nd.port) cctx.fillRect(nd.x-nd.r, nd.y-nd.r, nd.r*2, nd.r*2);
      else { cctx.beginPath(); cctx.arc(nd.x, nd.y, nd.r, 0, 6.2832); cctx.fill(); }
      cctx.restore();
    }

    // wired traces (left->Exchange teal, right->Studio/Fabric gold), drawn on + staggered
    for (i = 0; i < wires.length; i++){
      var w = wires[i], dp = wireDraw(w, s);
      if (dp <= 0) continue;
      var pts = wirePtsOf(w), e0 = pts[0], eN = pts[pts.length-1];
      cctx.strokeStyle = hexA(w.c, 0.30*fade); cctx.lineWidth = 1.4;
      drawPoly(pts, dp);
      // solder pads at both ends (only once nearly drawn)
      if (dp > 0.98){
        cctx.fillStyle = hexA(w.c, 0.9*fade); cctx.shadowColor = w.c; cctx.shadowBlur = 8;
        cctx.fillRect(eN[0]-2.3, eN[1]-2.3, 4.6, 4.6);
        cctx.shadowBlur = 0;
        cctx.fillStyle = hexA(w.c, 0.6*fade);
        cctx.fillRect(e0[0]-1.6, e0[1]-1.6, 3.2, 3.2);
      }
    }

    // pulses, loop indefinitely once wires are drawn, each at its own random speed
    if (fade > 0.6){
      if (pulses.length < 22 && Math.random() < 0.16) spawnPulse();
    }
    for (i = pulses.length - 1; i >= 0; i--){
      var pu = pulses[i]; pu.t += pu.sp;
      if (pu.t >= 1){ pulses.splice(i, 1); continue; }
      var ppts;
      if (pu.kind === 'wire'){ ppts = wirePtsOf(pu.w); }
      else { var la = anodes[pu.l.a], lb = anodes[pu.l.b]; ppts = linkPts(la.x,la.y,lb.x,lb.y); }
      var pt = polyAt(ppts, pu.t), f2 = Math.sin(pu.t*Math.PI)*fade;
      cctx.globalAlpha = f2; cctx.fillStyle = pu.c; cctx.shadowColor = pu.c; cctx.shadowBlur = 11;
      cctx.beginPath(); cctx.arc(pt[0], pt[1], 2.1, 0, 6.2832); cctx.fill();
      cctx.globalAlpha = 1; cctx.shadowBlur = 0;
    }
  }

  // ---------- cursor parallax ----------
  var tgx = 0, tgy = 0, cgx = 0, cgy = 0;
  sec.addEventListener('pointermove', function(e){ var r = stage.getBoundingClientRect();
    tgx = ((e.clientX - r.left) / r.width - 0.5) * 2; tgy = ((e.clientY - r.top) / r.height - 0.5) * 2; }, { passive: true });
  sec.addEventListener('pointerleave', function(){ tgx = 0; tgy = 0; }, { passive: true });

  // ---------- hover ----------
  var hot = null;
  Object.keys(cards).forEach(function(k){
    var c = cards[k];
    c.addEventListener('pointerenter', function(){ if (running){ hot = k; c.classList.add('is-hot'); sec.setAttribute('data-hot', k); } });
    c.addEventListener('pointerleave', function(){ hot = null; c.classList.remove('is-hot'); sec.removeAttribute('data-hot'); });
  });

  // ---------- DOM writer ----------
  function render(s, now){
    // SEED
    var seed = smooth(PH.seedA, PH.seedB, s);
    floor.style.opacity = (seed * 0.6).toFixed(3);
    fglow.style.opacity = (seed * 0.9).toFixed(3);
    head.style.opacity = seed.toFixed(3);
    head.style.transform = 'translateX(-50%) translateY(' + lerp(-14, 0, seed).toFixed(1) + 'px)';

    // PIVOT (two-stage yaw 0->+22->-6, pitch 0->14)
    var piv = smooth(PH.pivA, PH.pivB, s), ry;
    if (piv < 0.5) ry = lerp(0, 22, smooth(0, 0.5, piv)); else ry = lerp(22, -6, smooth(0.5, 1, piv));
    var rx = lerp(0, 14, piv);
    cgx += (tgx - cgx) * 0.08; cgy += (tgy - cgy) * 0.08;
    var slabScale = lerp(0.92, 1, seed);
    deck.style.opacity = seed.toFixed(3);
    deck.style.transform = 'translate(-50%,-50%) rotateX(' + (rx - cgy*3).toFixed(2) + 'deg) rotateY(' + (ry + cgx*5).toFixed(2) + 'deg) scale(' + slabScale.toFixed(3) + ')';

    // SPLIT
    var split = smooth(PH.splitA, PH.splitB, s), content = smooth(PH.splitA + 0.05, PH.splitB - 0.02, s);
    setCard(cards.exchange, lerp(0, -140, split), lerp(6, 60, split), content, hot === 'exchange');
    setCard(cards.studio,  0,                   0,                  content, hot === 'studio');
    setCard(cards.fabric,  lerp(0, 140, split), lerp(-6, -60, split), content, hot === 'fabric');

    // CHANNELS (no connector lines)
    chans.style.opacity = smooth(PH.chA, PH.chB, s) > 0 ? 1 : 0;
    tiles.forEach(function(t, i){ var g = smooth(PH.chA + i*0.018, PH.chB + i*0.018, s);
      t.style.opacity = g.toFixed(3); t.style.transform = 'translateY(' + lerp(12, 0, g).toFixed(1) + 'px)'; });

    // LEFT ecosystem, one by one
    ecoL.style.opacity = smooth(PH.leftA - 0.03, PH.leftA + 0.05, s).toFixed(3);
    leftNodes.forEach(function(n, i){ var g = smooth(PH.leftA + i*0.024, PH.leftA + 0.08 + i*0.024, s);
      n.style.opacity = g.toFixed(3); n.style.transform = 'translateX(' + lerp(-48, 0, g).toFixed(1) + 'px)'; });

    // RIGHT ecosystem, one by one
    ecoR.style.opacity = smooth(PH.rightA - 0.03, PH.rightA + 0.05, s).toFixed(3);
    rightNodes.forEach(function(n, i){ var g = smooth(PH.rightA + i*0.022, PH.rightA + 0.08 + i*0.022, s);
      n.style.opacity = g.toFixed(3); n.style.transform = 'translateX(' + lerp(48, 0, g).toFixed(1) + 'px)'; });

    // banner + mark settle alongside the circuit
    var set = smooth(PH.cirA, PH.cirB, s);
    banner.style.opacity = set.toFixed(3);
    banner.style.transform = 'translateX(-50%) translateY(' + lerp(18, 0, set).toFixed(1) + 'px)';
    var stamp = smooth(PH.cirA + 0.02, PH.cirB, s);
    if (shield) shield.style.transform = 'scale(' + (0.6 + stamp*0.45 - Math.sin(stamp*Math.PI)*0.05).toFixed(3) + ')';
    mark.style.opacity = set.toFixed(3);

    // circuit overlay
    drawCircuit(s, now);
  }

  function setCard(card, ty, tz, content, hotCard){
    var lift = hotCard ? 46 : 0;
    card.style.transform = 'translateY(' + ty.toFixed(1) + 'px) translateZ(' + (tz + lift).toFixed(1) + 'px)';
    card.style.setProperty('opacity', '1');
    var kids = card.children;
    for (var i = 0; i < kids.length; i++) kids[i].style.opacity = content.toFixed(3);
  }

  // ---------- scroll clock + loop ----------
  var s = 0, running = false, rafId = 0;
  function progress(){
    var total = sec.offsetHeight - window.innerHeight;
    var top = sec.getBoundingClientRect().top;
    return total > 0 ? clamp01(-top / total) : 0;
  }
  function tick(now){
    if (!running) return;
    var p = progress();
    s += (p - s) * 0.18;
    if (Math.abs(p - s) < 0.0004) s = p;
    render(s, now || 0);
    rafId = requestAnimationFrame(tick);
  }

  function clearInline(){
    [head, deck, chans, banner, mark, floor, fglow, ecoL, ecoR]
      .concat(tiles, leftNodes, rightNodes, [cards.exchange, cards.studio, cards.fabric])
      .forEach(function(el){ if (el) el.removeAttribute('style'); });
    if (shield) shield.removeAttribute('style');
    cards.exchange.setAttribute('data-card', 'exchange');
    cards.studio.setAttribute('data-card', 'studio');
    cards.fabric.setAttribute('data-card', 'fabric');
    cctx.clearRect(0, 0, cw, ch); pulses.length = 0;
  }

  function start(){
    if (running) return;
    sec.classList.remove('pf-static');
    sizeCanvas(); buildAmbient(); buildWires();
    running = true; rafId = requestAnimationFrame(tick);
  }
  function stop(){
    running = false; if (rafId) cancelAnimationFrame(rafId);
    hot = null; sec.removeAttribute('data-hot');
    sec.classList.add('pf-static'); clearInline();
  }
  function apply(){ if (mqNarrow.matches || mqReduced.matches) stop(); else start(); }

  (mqNarrow.addEventListener ? mqNarrow.addEventListener('change', apply) : mqNarrow.addListener(apply));
  (mqReduced.addEventListener ? mqReduced.addEventListener('change', apply) : mqReduced.addListener(apply));
  window.addEventListener('resize', function(){ if (running){ sizeCanvas(); buildAmbient(); render(s, performance.now()); } }, { passive: true });

  apply();
})();
