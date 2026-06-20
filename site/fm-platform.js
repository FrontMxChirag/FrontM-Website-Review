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
  var toplight = sec.querySelector('.pf-toplight');
  var head    = sec.querySelector('.pf-head');
  var headGlassP = sec.querySelector('.pf-head .pf-glass');
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

  /* static stack for: narrow screens, PORTRAIT touch viewports (e.g. 1080×1920 phones,
     tablets in portrait — the 3D split layout assumes landscape width), and coarse pointers */
  var mqNarrow  = matchMedia('(max-width: 980px), (orientation: portrait) and (max-width: 1366px)');
  var mqReduced = matchMedia('(prefers-reduced-motion: reduce)');
  var finePointer = matchMedia('(hover: hover) and (pointer: fine)');

  // Scroll-tail: after the assembly completes, hold the fully-assembled stack for an
  // extra slice of scroll before the next section enters. TEST value — tune freely.
  // Kept DISTINCT from scroll-horizon's 0.80·vh horizon-start constant.
  var PLATFORM_TAIL_VH = 0.8;

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
    seedA: 0.20, seedB: 0.30,       // floor + slab rise (AFTER the intro glass beat)
    pivA:  0.30, pivB:  0.42,       // tip into 3D
    splitA:0.42, splitB:0.56,       // split into 3 cards (CENTRE DONE)
    chA:   0.56, chB:   0.64,       // channel row settles
    leftA: 0.64, leftB: 0.73,       // left ecosystem, one by one
    rightA:0.73, rightB:0.82,       // right ecosystem, one by one
    cirA:  0.82, cirB:  0.96         // circuit wires draw on — ALL complete by ~0.96; pulses loop after
  };

  // ---- INTRO (mirrors the problem→solution opening): the heading sits CENTRED
  // in a glass panel; past the trigger the glass sinks on its own ~0.85s clock
  // and a W1 field-swell + W4 crest-light wave rolls through the ambient board
  // once the glass has FULLY disappeared. Text then docks to the top.
  var INTRO = { inA: 0.015, inB: 0.05, trig: 0.085, dockA: 0.115, dockB: 0.185 };
  var gx = { v: 0, on: false, w: 0, placed: false, cx: 0, cy: 0, amp: 22, maxR: 900, wDur: 1400 };
  function stepIntro(dt){
    if (gx.on){ if (s < INTRO.trig - 0.012) gx.on = false; }
    else if (s >= INTRO.trig) gx.on = true;
    if (gx.on){ if (gx.v < 1) gx.v = Math.min(1, gx.v + dt / 850); }
    else if (gx.v > 0) gx.v = Math.max(0, gx.v - dt / 550);
    if (headGlassP){
      if (gx.v > 0.03 && !gx.placed){
        var sr = stage.getBoundingClientRect(), r = headGlassP.getBoundingClientRect();
        if (r.width){
          gx.cx = r.left + r.width / 2 - sr.left;
          gx.cy = r.top + r.height / 2 - sr.top;
          gx.amp = Math.max(14, Math.min(28, r.width * 0.04));
          gx.maxR = Math.max(460, r.width * 1.5);
          gx.placed = true;
        }
      } else if (gx.v <= 0.02 && gx.placed) gx.placed = false;
    }
    if (gx.v >= 0.66 && gx.placed){ if (gx.w < 1) gx.w = Math.min(1, gx.w + dt / gx.wDur); }
    else if (gx.v < 0.5) gx.w = 0;
    // fast-scroll guard: the dock holds while the glass is mid-sink, then eases
    // in at a capped rate (~0.6s) — text never moves under a sinking glass
    var dTarget = (gx.v > 0.02 && gx.v < 0.995) ? Math.min(dockAnim.raw, dockAnim.v) : dockAnim.raw;
    var dRate = dt / 600;
    if (dockAnim.v < dTarget) dockAnim.v = Math.min(dTarget, dockAnim.v + dRate);
    else if (dockAnim.v > dTarget) dockAnim.v = Math.max(dTarget, dockAnim.v - dRate);
  }
  var dockAnim = { v: 0, raw: 0 };

  // ============================================================
  //  CIRCUIT OVERLAY
  // ============================================================
  var DPR = Math.min(devicePixelRatio || 1, 2);
  var cw = 0, ch = 0;
  var BRAND = ['#01B3F6', '#3CAD33', '#FFC500', '#FF6A04', '#9A86FF', '#1FE6D4'];
  var anodes = [], alinks = [], wires = [], pulses = [];
  var WATER = '#5FD8F0';                  // ocean/horizon tie-back colour for the waterline rig
  var waterlineReady = false;             // true once the waterline bus + trunks are drawn in

  // current waterline (the global horizon curve) in STAGE-LOCAL px; null if no horizon yet
  function wlY(xStage, sr){
    var H = window.__fmHorizon;
    if (!H || typeof H.yAt !== 'function') return null;
    var y = H.yAt(sr.left + xStage) - sr.top;
    if (y < 2) y = 2; if (y > ch - 2) y = ch - 2;
    return y;
  }

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
  // wired route: node -> out to a gutter BEYOND the card edge -> vertical -> short hop into the card.
  // The gutter leg is CLAMPED so it can never re-enter the ecosystem column on narrow stages
  // (connectors must not cross or cover the node labels).
  function wirePtsOf(w){ var e = wireEnds(w); var bx = e[2] + Math.sign(e[0]-e[2]) * WIRE_GUTTER;
    if (w.side === 'l'){ if (bx < e[0] + 14) bx = e[0] + 14; }
    else               { if (bx > e[0] - 14) bx = e[0] - 14; }
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
    // tightened stagger so EVERY wire — including the LAST ecosystem rows
    // (Identity & security, Enterprise systems…) — completes well before s=1
    if (w.grp === 'left')  return smooth(PH.cirA + w.i*0.008, PH.cirA + 0.07 + w.i*0.008, s);
    return smooth(PH.cirA + 0.03 + w.i*0.008, PH.cirA + 0.10 + w.i*0.008, s);
  }

  /* channel rail: the 5 end-user surfaces terminate into EXCHANGE specifically —
     per-tile drops onto a bus, bus draws outward from centre, one drop into the card.
     Locked semantics: channels feed Exchange only; never Studio/Fabric. */
  function drawChannelRail(s){
    var g = smooth(PH.chA + 0.02, PH.chB + 0.06, s);
    if (g <= 0.001 || !tiles.length) return;
    var C = '#00D9C9';
    var ex = rectIn(cards.exchange);
    var rowBottom = 0, xs = [];
    for (var i = 0; i < tiles.length; i++){ var r = rectIn(tiles[i]); if (r.b > rowBottom) rowBottom = r.b; xs.push(r.cx); }
    if (ex.t - rowBottom < 18) return;   // layout too tight (mid-resize) — skip this frame
    var busY = rowBottom + (ex.t - rowBottom) * 0.42;
    cctx.lineWidth = 1.2;
    // per-tile drops onto the bus, staggered with the tiles themselves
    for (i = 0; i < xs.length; i++){
      var gi = smooth(PH.chA + 0.02 + i * 0.012, PH.chB + i * 0.012, s);
      if (gi <= 0) continue;
      cctx.strokeStyle = hexA(C, 0.32 * gi);
      drawPoly([[xs[i], rowBottom + 4], [xs[i], busY]], gi);
    }
    // the bus, drawing outward from the Exchange axis
    var bg = smooth(PH.chA + 0.05, PH.chB + 0.04, s);
    if (bg > 0){
      var minX = Math.min.apply(null, xs), maxX = Math.max.apply(null, xs);
      cctx.strokeStyle = hexA(C, 0.32 * bg);
      drawPoly([[ex.cx, busY], [minX, busY]], bg);
      drawPoly([[ex.cx, busY], [maxX, busY]], bg);
    }
    // single terminating drop into the Exchange card's top edge + anchor pad
    var dg = smooth(PH.chA + 0.08, PH.chB + 0.08, s);
    if (dg > 0){
      cctx.strokeStyle = hexA(C, 0.48 * dg);
      drawPoly([[ex.cx, busY], [ex.cx, ex.t - 2]], dg);
      if (dg > 0.9){
        cctx.fillStyle = hexA(C, 0.85); cctx.shadowColor = C; cctx.shadowBlur = 8;
        cctx.fillRect(ex.cx - 2, ex.t - 4, 4, 4); cctx.shadowBlur = 0;
      }
    }
  }

  function spawnPulse(){
    // a riser pulse (sea -> card) when the waterline rig is live, else wired/ambient
    if (waterlineReady && Math.random() < 0.42){
      pulses.push({ kind:'riser', ci: (Math.random()*3)|0, t:0, sp: rnd(0.005, 0.011), c: WATER });
      return;
    }
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
    drawChannelRail(s);
    var fade = smooth(PH.cirA - 0.04, PH.cirA + 0.06, s);   // wired board fade-in
    var amb = Math.max(fade, smooth(0.01, 0.06, s) * 0.55); // ambient field lives from the very start
    if (amb <= 0.001) { pulses.length = 0; return; }

    // intro wave state (W1 swell through the ambient field)
    var wEff = gx.placed && gx.w > 0 && gx.w < 1;
    var wex = 0, wR = 0, wWd = 0, wDec = 0;
    if (wEff){
      wex = 1 - Math.pow(1 - gx.w, 3);
      wR = wex * gx.maxR;
      wWd = Math.max(80, gx.maxR * 0.18);
      wDec = Math.pow(1 - gx.w, 0.9);
    }

    // drift ambient nodes (+ wave displacement into render coords dx/dy)
    for (var i = 0; i < anodes.length; i++){
      var n = anodes[i];
      n.x += n.vx; n.y += n.vy;
      if (n.x < -10) n.x = cw+10; if (n.x > cw+10) n.x = -10;
      if (n.y < -10) n.y = ch+10; if (n.y > ch+10) n.y = -10;
      n.dx = n.x; n.dy = n.y; n.wI = 0;
      if (wEff){
        var wdx = n.x - gx.cx, wdy = n.y - gx.cy;
        var wd = Math.sqrt(wdx * wdx + wdy * wdy) || 1;
        var wq = (wd - wR) / wWd;
        var wk = Math.exp(-wq * wq * 2) * wDec;
        if (wk > 0.01){ n.wI = wk; n.dx += (wdx / wd) * wk * gx.amp; n.dy += (wdy / wd) * wk * gx.amp * 0.92; }
      }
    }
    // ambient nearest-neighbour links (orthogonal, faint; warp with the wave)
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
      var wBoost = Math.max(a.wI || 0, b.wI || 0);
      cctx.strokeStyle = 'rgba(130,150,220,' + Math.min(0.5, 0.11*amb + wBoost*0.3).toFixed(3) + ')';
      drawPoly(linkPts(a.dx,a.dy,b.dx,b.dy), 1);
      cctx.fillStyle = 'rgba(130,150,220,' + (0.16*amb).toFixed(3) + ')';
      cctx.fillRect(b.dx-1, a.dy-1, 2, 2);
    }
    // ambient nodes (brighten as the crest passes)
    for (i = 0; i < anodes.length; i++){
      var nd = anodes[i], tw = Math.min(1, (0.55 + 0.45*Math.sin(now*0.001 + nd.ph)) * amb * (1 + (nd.wI || 0) * 1.3));
      cctx.save(); cctx.globalAlpha = tw; cctx.fillStyle = nd.c; cctx.shadowColor = nd.c; cctx.shadowBlur = 7 + (nd.wI || 0) * 10;
      if (nd.port) cctx.fillRect(nd.dx-nd.r, nd.dy-nd.r, nd.r*2, nd.r*2);
      else { cctx.beginPath(); cctx.arc(nd.dx, nd.dy, nd.r * (1 + (nd.wI || 0) * 0.5), 0, 6.2832); cctx.fill(); }
      cctx.restore();
    }
    // W4 crest light: an ultra-soft band of luminance rides the intro wavefront
    if (wEff){
      var cgrd = cctx.createRadialGradient(gx.cx, gx.cy, Math.max(0, wR - wWd), gx.cx, gx.cy, wR + wWd);
      cgrd.addColorStop(0, 'rgba(1,179,246,0)');
      cgrd.addColorStop(0.5, 'rgba(1,179,246,' + (0.07 * wDec).toFixed(3) + ')');
      cgrd.addColorStop(1, 'rgba(1,179,246,0)');
      cctx.fillStyle = cgrd;
      cctx.fillRect(0, 0, cw, ch);
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

    // ---- WATERLINE RIG: tie the board to the ocean surface (global __fmHorizon) ----
    // The circuit's baseline reads the live horizon curve, so the traces visibly emerge
    // from the sea: a bus runs ALONG the surface, trunks drop from it to each card.
    var sr = stage.getBoundingClientRect();
    var trunkCards = [cards.exchange, cards.studio, cards.fabric];
    waterlineReady = false;
    var wlFade = smooth(PH.cirA - 0.02, PH.cirA + 0.12, s);
    if (wlFade > 0.001 && wlY(cw/2, sr) != null){
      // bus along the curve
      cctx.lineWidth = 1.2;
      cctx.strokeStyle = hexA(WATER, 0.22 * wlFade * fade);
      cctx.beginPath();
      var NB = 26;
      for (var bi = 0; bi <= NB; bi++){ var bx = cw*bi/NB, by = wlY(bx, sr); if (bi===0) cctx.moveTo(bx, by); else cctx.lineTo(bx, by); }
      cctx.stroke();
      // trunks: surface -> card top, staggered draw-on
      for (var ti = 0; ti < trunkCards.length; ti++){
        var rc = rectIn(trunkCards[ti]), fx = rc.cx, fy = wlY(fx, sr);
        var dp = smooth(PH.cirA + 0.04 + ti*0.012, PH.cirA + 0.14 + ti*0.012, s);
        if (dp <= 0) continue;
        cctx.strokeStyle = hexA(WATER, 0.32 * wlFade * fade); cctx.lineWidth = 1.4;
        drawPoly([[fx, fy], [fx, rc.t]], dp);
        if (dp > 0.5){   // anchor pad sitting ON the surface
          cctx.fillStyle = hexA(WATER, 0.85 * wlFade * fade); cctx.shadowColor = WATER; cctx.shadowBlur = 9;
          cctx.fillRect(fx-2.2, fy-2.2, 4.4, 4.4); cctx.shadowBlur = 0;
        }
      }
      if (wlFade > 0.5) waterlineReady = true;
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
      else if (pu.kind === 'riser'){ var rc2 = rectIn(trunkCards[pu.ci]), fx2 = rc2.cx, fy2 = wlY(fx2, sr); if (fy2 == null){ pulses.splice(i,1); continue; } ppts = [[fx2, fy2], [fx2, rc2.t]]; }
      else { var la = anodes[pu.l.a], lb = anodes[pu.l.b]; ppts = linkPts(la.x,la.y,lb.x,lb.y); }
      var pt = polyAt(ppts, pu.t), f2 = Math.sin(pu.t*Math.PI)*fade;
      cctx.globalAlpha = f2; cctx.fillStyle = pu.c; cctx.shadowColor = pu.c; cctx.shadowBlur = 11;
      cctx.beginPath(); cctx.arc(pt[0], pt[1], 2.1, 0, 6.2832); cctx.fill();
      cctx.globalAlpha = 1; cctx.shadowBlur = 0;
    }
  }

  // ---------- cursor parallax (desktop fine-pointer only — inert on touch) ----------
  var tgx = 0, tgy = 0, cgx = 0, cgy = 0;
  function clampT(v){ return v < -1 ? -1 : (v > 1 ? 1 : v); }
  if (finePointer.matches){
    sec.addEventListener('pointermove', function(e){ var r = stage.getBoundingClientRect();
      tgx = clampT(((e.clientX - r.left) / r.width - 0.5) * 2);
      tgy = clampT(((e.clientY - r.top) / r.height - 0.5) * 2); }, { passive: true });
    sec.addEventListener('pointerleave', function(){ tgx = 0; tgy = 0; }, { passive: true });
  }

  // ---------- hover (desktop fine-pointer only) ----------
  var hot = null;
  if (finePointer.matches) Object.keys(cards).forEach(function(k){
    var c = cards[k];
    c.addEventListener('pointerenter', function(){ if (running){ hot = k; c.classList.add('is-hot'); sec.setAttribute('data-hot', k); } });
    c.addEventListener('pointerleave', function(){ hot = null; c.classList.remove('is-hot'); sec.removeAttribute('data-hot'); });
  });

  // ---------- DOM writer ----------
  function render(s, now){
    // INTRO — glass card centred with the full message; glass sinks (trigger-played),
    // the text docks to the top, THEN the electronic deck rises
    var hIn = smooth(INTRO.inA, INTRO.inB, s);
    dockAnim.raw = smooth(INTRO.dockA, INTRO.dockB, s);
    var dock = dockAnim.v;
    var seed = smooth(PH.seedA, PH.seedB, s);
    // surface recedes as the pinned stage hands off to the next section, so the teal floor +
    // blue glow don't cut a hard coloured edge against .pf-arch-support (seamless; reversible)
    var release = 1 - smooth(0.965, 1, s);
    floor.style.opacity = (seed * 0.6 * release).toFixed(3);
    fglow.style.opacity = (seed * 0.9 * release).toFixed(3);
    // the soft top transition light fades out as the heading docks, so the lighter band
    // never persists into the platform scene (reversible on scroll-up)
    if (toplight) toplight.style.opacity = (1 - dock).toFixed(3);
    head.style.opacity = hIn.toFixed(3);
    head.style.top = lerp(46, 4.8, dock).toFixed(2) + '%';
    head.style.transform = 'translate(-50%, ' + lerp(-50, 0, dock).toFixed(1) + '%) scale(' + (lerp(0.97, 1, hIn) * lerp(1, 0.88, dock)).toFixed(3) + ')';
    if (headGlassP){
      if (gx.v <= 0){ headGlassP.style.transform = ''; headGlassP.style.filter = ''; headGlassP.style.opacity = ''; }
      else {
        var gf = smooth(0, 0.62, gx.v);
        headGlassP.style.transform = 'translateY(' + (gf * 34).toFixed(1) + 'px) scale(' + lerp(1, 0.7, gf).toFixed(3) + ')';
        headGlassP.style.filter = 'brightness(' + lerp(1, 0.5, gf).toFixed(2) + ') blur(' + (gf * 4).toFixed(1) + 'px)';
        headGlassP.style.opacity = (1 - smooth(0.5, 0.66, gx.v)).toFixed(3);
      }
    }

    // PIVOT (two-stage yaw 0->+22->-6, pitch 0->14)
    var piv = smooth(PH.pivA, PH.pivB, s), ry;
    if (piv < 0.5) ry = lerp(0, 22, smooth(0, 0.5, piv)); else ry = lerp(22, -2, smooth(0.5, 1, piv));
    var rx = lerp(0, 9, piv);
    cgx += (tgx - cgx) * 0.06; cgy += (tgy - cgy) * 0.06;
    var slabScale = lerp(0.92, 1, seed);
    deck.style.opacity = seed.toFixed(3);
    deck.style.transform = 'translate(-50%,-50%) rotateX(' + (rx - cgy*2.2).toFixed(2) + 'deg) rotateY(' + (ry + cgx*3.4).toFixed(2) + 'deg) scale(' + slabScale.toFixed(3) + ')';

    // SPLIT — the vertical spread scales with stage height (fixed ±140px collided with
    // the channel row on short viewports and starved the connector rail of its ≥18px gap)
    var split = smooth(PH.splitA, PH.splitB, s), content = smooth(PH.splitA + 0.05, PH.splitB - 0.02, s);
    var off = Math.max(124, Math.min(152, (ch || stage.clientHeight) * 0.135));
    setCard(cards.exchange, lerp(0, -off, split), lerp(6, 60, split), content, hot === 'exchange');
    setCard(cards.studio,  0,                   0,                  content, hot === 'studio');
    setCard(cards.fabric,  lerp(0, off, split), lerp(-6, -60, split), content, hot === 'fabric');

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
    // eased hover: card floats up + forward, on top of its siblings
    var h = card.__h == null ? 0 : card.__h;
    h += ((hotCard ? 1 : 0) - h) * 0.14;
    if (h < 0.001) h = 0;
    card.__h = h;
    card.style.transform = 'translateY(' + (ty - h * 8).toFixed(1) + 'px) translateZ(' + (tz + h * 52).toFixed(1) + 'px) scale(' + (1 + h * 0.025).toFixed(3) + ')';
    card.style.zIndex = h > 0.05 ? '9' : '';
    card.style.setProperty('opacity', '1');
    var kids = card.children;
    for (var i = 0; i < kids.length; i++) kids[i].style.opacity = content.toFixed(3);
  }

  // ---------- scroll clock + loop ----------
  var s = 0, running = false, rafId = 0;
  // Base scrollable height mirrors CSS `.platform { height: 560vh }` → 5.6 viewports
  // (intro glass beat + an extra page so the circuit finale fully completes on screen).
  var BASE_VH = 5.6;
  // Optional live overrides (set by a Tweaks panel as window.__pf = {base, tail}).
  // Undefined on the homepage, so defaults hold there.
  function pfBase(){ return (window.__pf && typeof window.__pf.base === 'number') ? window.__pf.base : BASE_VH; }
  function pfTail(){ return (window.__pf && typeof window.__pf.tail === 'number') ? window.__pf.tail : PLATFORM_TAIL_VH; }
  function layoutTail(){
    // Grow the section by the tail so the sticky stage stays pinned for an extra hold.
    sec.style.height = ((pfBase() + pfTail()) * window.innerHeight) + 'px';
  }
  function progress(){
    // Drive the assembly over the BASE span only; the trailing tail clamps s at 1 (dead-zone hold).
    var total = (pfBase() - 1) * window.innerHeight;   // base scrollable distance, tail excluded
    var top = sec.getBoundingClientRect().top;
    return total > 0 ? clamp01(-top / total) : 0;
  }
  var lastNowP = 0;
  function tick(now){
    if (!running || !visible){ rafId = 0; lastNowP = 0; return; }
    var dt = lastNowP ? Math.min(50, now - lastNowP) : 16; lastNowP = now;
    var p = progress();
    s += (p - s) * 0.18;
    if (Math.abs(p - s) < 0.0004) s = p;
    stepIntro(dt);
    (window.__fmMotion || (window.__fmMotion = {})).platform = s;
    render(s, now || 0);
    rafId = requestAnimationFrame(tick);
  }

  /* pause the loop entirely while the section is offscreen */
  var visible = true;
  if ('IntersectionObserver' in window){
    new IntersectionObserver(function(e){
      visible = e[e.length - 1].isIntersecting;   // last entry — e[0] is stale when leave+enter batch
      if (visible && running && !rafId) rafId = requestAnimationFrame(tick);
    }, { rootMargin: '0px' }).observe(sec);
  }

  function clearInline(){
    [head, headGlassP, deck, chans, banner, mark, floor, fglow, toplight, ecoL, ecoR]
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
    layoutTail();
    sizeCanvas(); buildAmbient(); buildWires();
    // snap the intro to its end-state if the page loads already scrolled past it
    s = progress();
    gx.on = s >= INTRO.trig; gx.v = gx.on ? 1 : 0; gx.w = gx.on ? 1 : 0; gx.placed = false;
    dockAnim.v = dockAnim.raw = smooth(INTRO.dockA, INTRO.dockB, s);
    running = true; rafId = requestAnimationFrame(tick);
  }
  function stop(){
    running = false; if (rafId) cancelAnimationFrame(rafId); rafId = 0;
    hot = null; sec.removeAttribute('data-hot');
    sec.style.height = '';   // hand height back to CSS (.pf-static { height:auto })
    sec.classList.add('pf-static'); clearInline();
  }
  function apply(){ if (mqNarrow.matches || mqReduced.matches) stop(); else start(); }

  (mqNarrow.addEventListener ? mqNarrow.addEventListener('change', apply) : mqNarrow.addListener(apply));
  (mqReduced.addEventListener ? mqReduced.addEventListener('change', apply) : mqReduced.addListener(apply));
  window.addEventListener('resize', function(){ if (running){ layoutTail(); sizeCanvas(); buildAmbient(); render(s, performance.now()); } }, { passive: true });

  apply();
})();
