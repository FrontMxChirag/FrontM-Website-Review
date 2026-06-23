/* ============================================================
   FrontM Homepage v2 — 7-June rebuild: render new sections.
   Loads BEFORE fm.js so the reveal observer + demo-modal wiring
   in fm.js pick up the nodes rendered here.
   ============================================================ */
(function () {
  var FM = window.FM, ico = FM.ico;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };

  /* primary platform CTAs route to placeholder anchors (TODO: real routes) */
  function platBtn(label, route, primary) {
    return '<a class="btn ' + (primary ? 'btn-primary btn-pill' : 'btn-secondary') + '" href="#" data-route="' + route + '">' + label + '</a>';
  }
  function demoBtn(label, fn) {
    return '<button class="btn btn-secondary" data-open-demo' + (fn ? ' data-demo-fn="' + fn + '"' : '') + '>' + label + '</button>';
  }

  /* ---------- S2 · friction ---------- */
  (function () {
    var host = $('#friction-grid'); if (!host) return;
    host.innerHTML = FM.FRICTION.map(function (f, i) {
      return '<div class="fr-card reveal" data-d="' + (i % 4) + '"><div class="fr-ico">' + ico(f.ic) + '</div>' +
        '<div class="fr-t">' + f.t + '</div><div class="fr-d">' + f.d + '</div></div>';
    }).join('');
  })();

  /* ---------- S3 · outcomes ---------- */
  (function () {
    var host = $('#outcomes'); if (!host) return;
    host.innerHTML = FM.OUTCOMES.map(function (o, i) {
      return '<div class="oc-card reveal" data-d="' + (i % 4) + '"><div class="oc-ico">' + ico(o.ic) + '</div>' +
        '<h4>' + o.t + '</h4><p>' + o.d + '</p></div>';
    }).join('');
  })();

  /* ---------- S5 · tracks (buy/build/integrate) ---------- */
  (function () {
    var host = $('#tracks'); if (!host) return;
    host.innerHTML = FM.TRACKS.map(function (t, i) {
      var num = t.label ? (i + 1) + ' \u00B7 ' + t.label : '0' + (i + 1);
      var dest, ctaAttr, cardAttr;
      if (t.interstitial) {
        dest = t.interstitial;
        ctaAttr = ' data-interstitial="' + t.interstitial + '"';
        cardAttr = ' data-card-interstitial="' + t.interstitial + '"';
      } else if (t.href) {
        dest = t.href; ctaAttr = ''; cardAttr = ' data-card-href="' + t.href + '"';
      } else {
        dest = '#'; ctaAttr = ' data-route="' + t.route + '"'; cardAttr = '';
      }
      return '<div class="track-card reveal" data-d="' + i + '" style="--cc:' + t.color + '"' + cardAttr + '>' +
        '<div class="tk-num">' + num + '</div>' +
        '<div class="tk-ico">' + ico(t.ic) + '</div>' +
        '<h3>' + t.t + '</h3><p>' + t.d + '</p>' +
        '<div class="tk-cta"><a class="tk-link" href="' + dest + '"' + ctaAttr + '>' + t.cta +
        ' <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a></div></div>';
    }).join('');
    /* whole card is clickable when it has a real destination */
    $$('#tracks .track-card[data-card-href]').forEach(function (card) {
      card.style.cursor = 'pointer';
      card.addEventListener('click', function (e) {
        if (e.target.closest('a, button')) return; /* let real links/buttons handle their own clicks */
        window.location.href = card.getAttribute('data-card-href');
      });
    });
    /* community card hands off to the onship interstitial (same as nav) */
    $$('#tracks .track-card[data-card-interstitial]').forEach(function (card) {
      card.style.cursor = 'pointer';
      card.addEventListener('click', function (e) {
        if (e.target.closest('a, button')) return;
        var link = card.querySelector('[data-interstitial]');
        if (link) link.click();
      });
    });
  })();

  /* ---------- S6 · function explorer — master–detail (the old modules layout,
     now carrying the six teams; modules section fully replaced) ---------- */
  (function () {
    var rail = $('#fn-rail'), detail = $('#fn-detail');
    if (!rail || !detail) return;
    var COLS = ['#01B3F6', '#9A86FF', '#18C95C', '#FFC500', '#1FE6D4', '#FF6A04'];
    rail.innerHTML = FM.FUNCTIONS.map(function (f, i) {
      return '<button class="fnx-item' + (i === 0 ? ' on' : '') + '" data-i="' + i + '" style="--cc:' + COLS[i % COLS.length] + '">' +
        '<span class="fnx-ico">' + ico(f.icon) + '</span>' +
        '<span class="fnx-text"><b>' + f.title + '</b><span>' + f.tag + '</span></span>' +
        '<svg class="fnx-arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>' +
      '</button>';
    }).join('');
    /* all six panes pre-rendered (buttons get their global bindings at load);
       switching only toggles classes — cheap + keeps the fade transition */
    detail.innerHTML = FM.FUNCTIONS.map(function (f, i) {
      var helps = f.x.helps.slice(0, 6).map(function (h) {
        return '<li>' + ico(FM.I.check) + '<span><b>' + h[0] + '</b><span class="l">' + h[1] + '</span></span></li>';
      }).join('');
      return '<div class="fnx-pane' + (i === 0 ? ' show' : '') + '" style="--cc:' + COLS[i % COLS.length] + '">' +
        '<div class="fnx-pill">' + ico(f.icon) + '<span>' + f.title + '</span></div>' +
        '<h3>' + f.x.h + '</h3>' +
        '<p class="fnx-p">' + f.x.p + '</p>' +
        '<div class="fnx-impact"><b>Impact:</b> ' + f.impact + '</div>' +
        '<ul class="fnx-helps">' + helps + '</ul>' +
        '<div class="fnx-cta">' + platBtn('Explore Platform Plans', 'pricing', true) + demoBtn(f.demo, f.id) + '</div>' +
      '</div>';
    }).join('');
    var items = $$('.fnx-item', rail), panes = $$('.fnx-pane', detail);
    var cur = 0, manualUntil = 0;
    function show(i) {
      cur = i;
      items.forEach(function (el, k) { el.classList.toggle('on', k === i); });
      panes.forEach(function (el, k) { el.classList.toggle('show', k === i); });
    }
    items.forEach(function (el) {
      el.addEventListener('click', function () { manualUntil = Date.now() + 6000; show(+el.dataset.i); });
    });
    /* mobile: auto-walk the six teams as the explorer scrolls through view
       (a tap pauses auto-select for a few seconds) */
    var fnxWrap = rail.parentElement, fnxTick = false;
    function fnxAuto() {
      fnxTick = false;
      if (!matchMedia('(max-width: 980px)').matches) return;
      if (Date.now() < manualUntil) return;
      var r = fnxWrap.getBoundingClientRect(), vh = window.innerHeight || 1;
      var p = (vh * 0.72 - r.top) / Math.max(1, r.height + vh * 0.25);
      if (p < -0.05 || p > 1.1) return;
      var idx = Math.max(0, Math.min(items.length - 1, Math.floor(p * items.length)));
      if (idx !== cur) show(idx);
    }
    window.addEventListener('scroll', function () {
      if (!fnxTick) { fnxTick = true; requestAnimationFrame(fnxAuto); }
    }, { passive: true });
  })();

  /* ---------- S7 · proof row ---------- */
  (function () {
    var host = $('#proof-row'); if (!host) return;
    host.innerHTML = FM.PROOF.map(function (p) {
      return '<div class="proof-cell"><div class="pn">' + p.n + '</div><div class="pl">' + p.l + '</div></div>';
    }).join('');
  })();

  /* ---------- S7 · impact cards ---------- */
  (function () {
    var host = $('#impact-cards'); if (!host) return;
    host.innerHTML = FM.IMPACT_CARDS.map(function (c, i) {
      return '<div class="ic-card reveal" data-d="' + (i % 4) + '" style="--cc:' + c.c + '"><div class="ic-ico">' + ico(c.ic) + '</div>' +
        '<h4>' + c.t + '</h4><p>' + c.d + '</p></div>';
    }).join('');
  })();

  /* ---------- S7 · value bridge ---------- */
  (function () {
    var host = $('#vbridge-grid'); if (!host) return;
    host.innerHTML = FM.VALUE_BRIDGE.map(function (v) {
      return '<div class="vb-item"><div class="vb-t">' + ico(v.ic) + '<span>' + v.t + '</span></div><p>' + v.d + '</p></div>';
    }).join('');
  })();

  /* ---------- shared wheel geometry — SINGLE SOURCE OF TRUTH ----------
     %-of-square basis (the native wheel's). Consumed by BOTH the DOM wheel
     render below and the pflow canvas convergence, so they line up exactly. */
  FM.wheelGeometry = function () {
    var DEG = Math.PI / 180, rMod = 29.7, rStkX = 57, rStkY = 52.2;
    var mods = FM.MODULES.map(function (m, i) {
      var a = (-90 + i * (360 / FM.MODULES.length)) * DEG;
      return { id: m.id, color: m.color, x: 50 + rMod * Math.cos(a), y: 50 + rMod * Math.sin(a) };
    });
    /* 12 stakeholders, one every 30°, offset +15° so none sits dead-vertical —
       slightly ELLIPTICAL ring (wider than tall) so the pill labels clear the
       module ring at 3/9 o'clock and each other at 12/6 o'clock. */
    var stk = FM.WHEEL_STK.map(function (s, i) {
      var a = (-90 + i * (360 / FM.WHEEL_STK.length) + 15) * DEG;
      return { n: s.n, x: 50 + rStkX * Math.cos(a), y: 50 + rStkY * Math.sin(a) };
    });
    return { rMod: rMod, rStkX: rStkX, rStkY: rStkY, center: { x: 50, y: 50 }, mods: mods, stk: stk };
  };

  /* ---------- S4 · collaboration wheel ---------- */
  (function () {
    var stage = $('#cw-stage'); if (!stage) return;
    var G = FM.wheelGeometry();

    var ringLines = '<div class="cw-ring-line" style="width:' + (G.rMod * 2) + '%;height:' + (G.rMod * 2) + '%"></div>' +
                    '<div class="cw-ring-line" style="width:' + (G.rStkX * 2) + '%;height:' + (G.rStkY * 2) + '%"></div>';

    var spokes = '';
    var modHtml = FM.MODULES.map(function (m, i) {
      var x = G.mods[i].x, y = G.mods[i].y;
      spokes += '<line x1="50" y1="50" x2="' + x.toFixed(2) + '" y2="' + y.toFixed(2) + '"></line>';
      var soon = m.soon ? '<span class="cw-soon">Soon</span>' : '';
      return '<div class="cw-node" style="left:' + x.toFixed(2) + '%;top:' + y.toFixed(2) + '%;--d:' + (0.18 + i * 0.07).toFixed(2) + 's">' +
        '<div class="cw-mod" style="--cc:' + m.color + '"><div class="cw-chip">' + ico(m.icon) + '</div>' +
        '<span class="cw-name">' + m.id + soon + '</span></div></div>';
    }).join('');

    var stkHtml = FM.WHEEL_STK.map(function (s, i) {
      var x = G.stk[i].x, y = G.stk[i].y;
      return '<div class="cw-node cw-node-stk" style="left:' + x.toFixed(2) + '%;top:' + y.toFixed(2) + '%;--d:' + (0.62 + i * 0.045).toFixed(2) + 's">' +
        '<div class="cw-stk"><span class="cw-stk-ico">' + ico(s.i) + '</span><span class="cw-stk-name">' + s.n + '</span></div></div>';
    }).join('');

    stage.innerHTML =
      '<div class="cw-rings">' + ringLines + '</div>' +
      '<svg class="cw-spokes" viewBox="0 0 100 100" preserveAspectRatio="none">' + spokes + '</svg>' +
      '<div class="cw-hub"><img src="/assets/logos/frontm/frontm-mark.png" alt="FrontM"></div>' +
      modHtml + stkHtml;

    /* narrow viewports: the radial pills become a wrapped legend BELOW the wheel
       (CSS swaps visibility) so labels can never collide or overlap nodes */
    stage.insertAdjacentHTML('afterend',
      '<div class="cw-legend">' + FM.WHEEL_STK.map(function (s) {
        return '<span class="cw-stk"><span class="cw-stk-ico">' + ico(s.i) + '</span><span class="cw-stk-name">' + s.n + '</span></span>';
      }).join('') + '</div>');

    /* ---- HUB GRADIENT — hover-gated, eased both ways (idle = STATIC) ----
       The darker-brand colour disc behind the mark does NOT drift on its own.
       On hover its rotation + glow EASE IN; on leave the spin slows to rest and
       the glow settles back — no animation snap. JS drives custom props on
       .cw-hub (read by ::before). Reduced-motion: never runs (stays static). */
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches){
      var hubEl = stage.querySelector('.cw-hub');
      if (hubEl){
        var hbHover = false, hbInt = 0, hbSpin = 0, hbRaf = 0, hbLast = 0;
        var hbStep = function (now){
          var dt = hbLast ? Math.min(50, now - hbLast) : 16; hbLast = now;
          var base = hbHover ? 0.045 : 0.12;                       // ease-in quicker, settle-out gentler
          hbInt += ((hbHover ? 1 : 0) - hbInt) * (1 - Math.pow(base, dt / 1000));
          hbSpin = (hbSpin + (dt / 1000) * 26 * hbInt) % 360;      // slow base rotation; the well-morph below leads
          var breath = 0.06 * hbInt * Math.sin(now * 0.0016);      // gentle live pulse only while alive
          // FLUIDIC: the four colour wells drift on un-synced sine tracks while hovered
          // (amplitude scales with hbInt → eases in on hover, settles to static on leave)
          var ft = now * 0.001, famp = 11 * hbInt;
          hubEl.style.setProperty('--w1x', (Math.sin(ft * 0.70) * famp).toFixed(2) + '%');
          hubEl.style.setProperty('--w1y', (Math.cos(ft * 0.90 + 1.1) * famp).toFixed(2) + '%');
          hubEl.style.setProperty('--w2x', (Math.sin(ft * 0.85 + 2.0) * famp).toFixed(2) + '%');
          hubEl.style.setProperty('--w2y', (Math.cos(ft * 0.60 + 0.5) * famp).toFixed(2) + '%');
          hubEl.style.setProperty('--w3x', (Math.cos(ft * 0.75 + 3.1) * famp).toFixed(2) + '%');
          hubEl.style.setProperty('--w3y', (Math.sin(ft * 0.95 + 1.7) * famp).toFixed(2) + '%');
          hubEl.style.setProperty('--w4x', (Math.cos(ft * 0.65 + 4.2) * famp).toFixed(2) + '%');
          hubEl.style.setProperty('--w4y', (Math.sin(ft * 0.80 + 2.6) * famp).toFixed(2) + '%');
          hubEl.style.setProperty('--hub-spin', hbSpin.toFixed(2) + 'deg');
          hubEl.style.setProperty('--hub-scale', (1 + 0.06 * hbInt).toFixed(4));
          hubEl.style.setProperty('--hub-sat', (1 + 0.34 * hbInt).toFixed(3));
          hubEl.style.setProperty('--hub-bri', (0.97 + 0.22 * hbInt + breath).toFixed(3));
          hubEl.style.setProperty('--hub-op', (0.8 + 0.2 * hbInt).toFixed(3));
          if (hbHover || hbInt > 0.003) hbRaf = requestAnimationFrame(hbStep);
          else { hbRaf = 0; hbLast = 0; }                          // fully settled → stop the loop
        };
        var hbWake = function (){ if (!hbRaf){ hbLast = 0; hbRaf = requestAnimationFrame(hbStep); } };
        hubEl.addEventListener('pointerenter', function (){ hbHover = true; hbWake(); });
        hubEl.addEventListener('pointerleave', function (){ hbHover = false; hbWake(); });
      }
    }

    /* ---- spoke highlight: hovering a MODULE lights its hub→module spoke in the
       module's own brand colour (the "connected line brightens" cue on the static
       spokes; the canvas links already brighten). Module nodes are the first
       G.mods.length .cw-node elements, in the same order as the <line> spokes. ---- */
    (function (){
      var spokeLines = [].slice.call(stage.querySelectorAll('.cw-spokes line'));
      [].slice.call(stage.querySelectorAll('.cw-node')).forEach(function (n, j){
        if (j >= G.mods.length) return;
        var ln = spokeLines[j]; if (!ln) return;
        var col = G.mods[j].color;
        n.addEventListener('pointerenter', function (){ ln.style.stroke = col; ln.style.strokeWidth = '0.5'; ln.style.opacity = '0.9'; });
        n.addEventListener('pointerleave', function (){ ln.style.stroke = ''; ln.style.strokeWidth = ''; ln.style.opacity = ''; });
      });
    })();

    /* ---- node click-through: inner MODULE pills → Solutions ▸ By Module
       (that page isn't built yet — link held in place per spec, so it 404s for
       now); outer STAKEHOLDER pills → Solutions ▸ By Department. ---- */
    (function (){
      var MOD_HREF = 'solutions-by-module.html', STK_HREF = 'solutions-by-department.html';
      [].slice.call(stage.querySelectorAll('.cw-node')).forEach(function (n, j){
        var href = j < G.mods.length ? MOD_HREF : STK_HREF;
        n.style.cursor = 'pointer';
        n.setAttribute('role', 'link'); n.setAttribute('tabindex', '0');
        var go = function (){ window.location.href = href; };
        n.addEventListener('click', go);
        n.addEventListener('keydown', function (e){ if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); go(); } });
      });
    })();

    /* ---- living connectors: a canvas layered BEHIND the pills (so their
       backdrop-blur always has moving light to frost) keeps re-linking
       hub ⇄ modules ⇄ stakeholders. ≥5 links alive at once; each fades in,
       fires a light pulse along itself, then fades out. Reduced-motion opts
       out (the thin static spokes remain). ---- */
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches){
      var fcv = document.createElement('canvas');
      fcv.className = 'cw-flow'; fcv.setAttribute('aria-hidden', 'true');
      stage.insertBefore(fcv, stage.firstChild);
      var fx = fcv.getContext('2d');
      var FDPR = Math.min(2, window.devicePixelRatio || 1), FW = 0, FH = 0;
      /* each point carries a stable base (bx,by) plus a small, continuous drift so the
         constellation endpoints breathe; the hub (index 0) stays anchored under the mark */
      var TAU = Math.PI * 2;
      var mkP = function (x, y, isHub){
        return { x: x, y: y, bx: x, by: y,
          amp: isHub ? 0 : 0.6 + Math.random() * 0.55,       // % of stage — subtle (turned up a notch for a livelier idle)
          sp: 0.16 + Math.random() * 0.22, sp2: 0.16 + Math.random() * 0.22,
          ph: Math.random() * TAU };
      };
      var P = [ mkP(50, 50, true) ];             // 0 = hub (anchored)
      var MOD0 = 1, MODN = G.mods.length;
      G.mods.forEach(function (m){ P.push(mkP(m.x, m.y)); });
      var STK0 = P.length, STKN = G.stk.length;
      G.stk.forEach(function (s){ P.push(mkP(s.x, s.y)); });
      /* which node the cursor is over (P index), or -1. DOM .cw-node order matches
         P[1..] exactly (modules then stakeholders), so pidx = domIndex + 1. */
      var hoverIdx = -1;
      [].slice.call(stage.querySelectorAll('.cw-node')).forEach(function (n, j){
        var pidx = j + 1;
        n.addEventListener('pointerenter', function (){ hoverIdx = pidx; });
        n.addEventListener('pointerleave', function (){ if (hoverIdx === pidx) hoverIdx = -1; });
      });
      var fresize = function (){
        FW = stage.clientWidth; FH = stage.clientHeight;
        fcv.width = FW * FDPR; fcv.height = FH * FDPR;
        fx.setTransform(FDPR, 0, 0, FDPR, 0, 0);
      };
      fresize();
      if (window.ResizeObserver) new ResizeObserver(fresize).observe(stage);
      var FCOL = ['#01B3F6', '#1FE6D4', '#9A86FF', '#18C95C', '#4F6BFF'];
      var ri = function (n){ return (Math.random() * n) | 0; };
      var pickPair = function (){
        // when a node is hovered, most new links cluster around it — the local network
        // gets visibly busier and 'reaches' toward whatever the cursor is on
        if (hoverIdx >= 0 && Math.random() < 0.62){
          var ha = hoverIdx, hb;
          if (Math.random() < 0.4) hb = 0;                              // hovered ↔ hub
          else { hb = 1 + ri(P.length - 1); if (hb === ha) hb = 1 + (hb % (P.length - 1)); }
          return [ha, hb];
        }
        var a, b, r = Math.random();
        if (r < 0.40){ a = 0; b = MOD0 + ri(MODN); }                       // hub → module
        else if (r < 0.74){ a = MOD0 + ri(MODN); b = STK0 + ri(STKN); }    // module → stakeholder
        else if (r < 0.88){ a = 0; b = STK0 + ri(STKN); }                  // hub → stakeholder
        else { a = MOD0 + ri(MODN); b = MOD0 + ri(MODN); if (a === b) b = MOD0 + ((b - MOD0 + 1) % MODN); } // module → module
        return [a, b];
      };
      var links = [], fraf = 0;
      var spawn = function (now){
        var pr = pickPair();
        var fast = (hoverIdx >= 0 && (pr[0] === hoverIdx || pr[1] === hoverIdx));
        links.push({ a: pr[0], b: pr[1], born: now,
          dur: fast ? (820 + Math.random() * 900) : (1700 + Math.random() * 1700),
          col: FCOL[ri(FCOL.length)] });
      };
      var rgba = function (hex, al){
        var n = parseInt(hex.slice(1), 16);
        return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + al + ')';
      };
      var live = [];
      var fframe = function (now){
        fx.clearRect(0, 0, FW, FH);
        if (stage.classList.contains('in')){
          var ts = now / 1000;
          for (var k = 0; k < P.length; k++){
            var pt = P[k];
            live[k] = pt.amp
              ? { x: pt.bx + Math.sin(ts * pt.sp + pt.ph) * pt.amp, y: pt.by + Math.cos(ts * pt.sp2 + pt.ph) * pt.amp }
              : { x: pt.bx, y: pt.by };
          }
          var target = hoverIdx >= 0 ? 11 : 7;      // idle stays visibly alive; hover = a busier local network
          while (links.length < target) spawn(now - Math.random() * 600);
          for (var i = links.length - 1; i >= 0; i--){
            var L = links[i], t = (now - L.born) / L.dur;
            if (t >= 1){ links.splice(i, 1); continue; }
            var a = live[L.a], b = live[L.b];
            var ax = a.x / 100 * FW, ay = a.y / 100 * FH, bx = b.x / 100 * FW, by = b.y / 100 * FH;
            var hot = (hoverIdx >= 0 && (L.a === hoverIdx || L.b === hoverIdx)) ? 1.7 : 1; // related links brighten
            var env = Math.sin(Math.PI * t);            // 0→1→0 fade envelope
            fx.lineWidth = 1.1 * hot; fx.strokeStyle = rgba(L.col, Math.min(0.55, 0.23 * env * hot));
            fx.beginPath(); fx.moveTo(ax, ay); fx.lineTo(bx, by); fx.stroke();
            var pp = t < 0.55 ? t / 0.55 : 1;           // pulse runs, then rests at the far node
            var px = ax + (bx - ax) * pp, py = ay + (by - ay) * pp;
            var rad = 9 * hot;
            var g = fx.createRadialGradient(px, py, 0, px, py, rad);
            g.addColorStop(0, rgba(L.col, Math.min(1, 0.85 * env * hot))); g.addColorStop(1, rgba(L.col, 0));
            fx.fillStyle = g; fx.beginPath(); fx.arc(px, py, rad, 0, 6.2832); fx.fill();
            fx.fillStyle = rgba(L.col, env); fx.beginPath(); fx.arc(px, py, 1.8, 0, 6.2832); fx.fill();
          }
        } else if (links.length){ links.length = 0; }
        fraf = requestAnimationFrame(fframe);
      };
      fraf = requestAnimationFrame(fframe);
    }

    /* ---- subtle pointer reactivity ----
       The LIVE wheel tilts a few degrees toward the cursor; the two rings
       parallax at different depths (outer ring travels further) and the hub
       counter-shifts. Fine pointers only; reduced-motion opts out; the tilt
       waits for the entrance bloom to finish so it never fights it. */
    if (matchMedia('(pointer: fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches){
      var tNodes = [].slice.call(stage.querySelectorAll('.cw-node'));
      var tHub = stage.querySelector('.cw-hub');
      var tX = 0, tY = 0, cX = 0, cY = 0, tRaf = 0, tOn = false;
      var inAt = stage.classList.contains('in') ? performance.now() : 0;
      /* hover stability: while a node is hovered, collapse the parallax + ease the
         tilt down so the hovered target holds rock-still under the cursor (the live
         tilt was sliding nodes out from under the pointer — "hover not working"). */
      var hoverCount = 0, hoverDamp = 0;
      tNodes.forEach(function (n){
        n.addEventListener('pointerenter', function (){ hoverCount++; if (!tRaf) tRaf = requestAnimationFrame(tilt); });
        n.addEventListener('pointerleave', function (){ hoverCount = Math.max(0, hoverCount - 1); if (!tRaf) tRaf = requestAnimationFrame(tilt); });
      });
      var clearTilt = function (){
        if (!tOn) return;
        tOn = false;
        stage.style.transform = '';
        tNodes.forEach(function (n){ n.style.transform = ''; n.style.transition = ''; });
        if (tHub){ tHub.style.transform = ''; tHub.style.transition = ''; }
      };
      new MutationObserver(function (){
        if (stage.classList.contains('in')){ if (!inAt) inAt = performance.now(); }
        else { inAt = 0; clearTilt(); }
      }).observe(stage, { attributes: true, attributeFilter: ['class'] });
      var tilt = function (){
        tRaf = 0;
        if (!inAt || performance.now() - inAt < 1600){ clearTilt(); return; }
        cX += (tX - cX) * 0.07; cY += (tY - cY) * 0.07;
        var hTarget = hoverCount > 0 ? 1 : 0;
        hoverDamp += (hTarget - hoverDamp) * 0.12;
        var hk = 1 - hoverDamp * 0.82;            // hovered → parallax/tilt collapse so the target is stable
        if (!tOn){
          tOn = true;
          tNodes.forEach(function (n){ n.style.transition = 'transform .25s cubic-bezier(.22,.6,.36,1)'; });
          if (tHub) tHub.style.transition = 'transform .25s cubic-bezier(.22,.6,.36,1)';
        }
        stage.style.transform = 'perspective(1100px) rotateX(' + (-cY * 3.2 * hk).toFixed(2) + 'deg) rotateY(' + (cX * 3.2 * hk).toFixed(2) + 'deg)';
        for (var ti = 0; ti < tNodes.length; ti++){
          var dp = tNodes[ti].classList.contains('cw-node-stk') ? 10 : 6;
          tNodes[ti].style.transform = 'translate(calc(-50% + ' + (cX * dp * hk).toFixed(1) + 'px), calc(-50% + ' + (cY * dp * hk).toFixed(1) + 'px))';
        }
        if (tHub) tHub.style.transform = 'translate(calc(-50% + ' + (-cX * 3 * hk).toFixed(1) + 'px), calc(-50% + ' + (-cY * 3 * hk).toFixed(1) + 'px))';
        if (Math.abs(tX - cX) + Math.abs(tY - cY) > 0.002 || Math.abs(hTarget - hoverDamp) > 0.01) tRaf = requestAnimationFrame(tilt);
      };
      window.addEventListener('pointermove', function (e){
        var r = stage.getBoundingClientRect();
        if (!r.width) return;
        var nx = ((e.clientX - r.left) / r.width) * 2 - 1;
        var ny = ((e.clientY - r.top) / r.height) * 2 - 1;
        if (nx < -1.5 || nx > 1.5 || ny < -1.5 || ny > 1.5){ tX = 0; tY = 0; }
        else { tX = Math.max(-1, Math.min(1, nx)); tY = Math.max(-1, Math.min(1, ny)); }
        if (!tRaf) tRaf = requestAnimationFrame(tilt);
      }, { passive: true });
    }
  })();

  /* ---------- placeholder route CTAs (no live destinations yet) ---------- */
  $$('[data-route]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      /* TODO(routing): wire to /pricing, /frontm-ai, /marketplace once those pages exist */
      console.log('[FrontM TODO] route not built yet:', a.getAttribute('data-route'));
    });
  });
})();
