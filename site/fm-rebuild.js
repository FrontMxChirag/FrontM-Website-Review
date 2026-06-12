/* ============================================================
   FrontM Homepage v2 — 7-June rebuild: render new sections.
   Loads BEFORE fm.js so the reveal observer + demo-modal wiring
   in fm.js pick up the nodes rendered here.
   ============================================================ */
(function () {
  var FM = window.FM;
  if (!FM) { if (window.console) console.error('[fm-rebuild] window.FM missing — fm-data.js failed to load; aborting render'); return; }
  var ico = FM.ico;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };

  /* demo CTAs are primary until the /pricing page exists; platform-plan links are secondary */
  function platBtn(label, route, primary) {
    return '<a class="btn btn-secondary' + (primary ? ' btn-pill' : '') + '" href="#" data-route="' + route + '">' + label + '</a>';
  }
  function demoBtn(label, fn) {
    return '<button class="btn btn-primary" data-open-demo' + (fn ? ' data-demo-fn="' + fn + '"' : '') + '>' + label + '</button>';
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
      return '<div class="track-card reveal" data-d="' + i + '" style="--cc:' + t.color + '">' +
        '<div class="tk-num">0' + (i + 1) + '</div>' +
        '<div class="tk-ico">' + ico(t.ic) + '</div>' +
        '<h3>' + t.t + '</h3><p>' + t.d + '</p>' +
        '<div class="tk-cta"><a class="tk-link" href="#" data-route="' + t.route + '">' + t.cta +
        ' <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a></div></div>';
    }).join('');
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
    var DEG = Math.PI / 180, rMod = 33, rStkX = 47.5, rStkY = 43.5;
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
        '<div class="cw-stk">' + ico(s.i) + '<span>' + s.n + '</span></div></div>';
    }).join('');

    stage.innerHTML =
      '<div class="cw-rings">' + ringLines + '</div>' +
      '<svg class="cw-spokes" viewBox="0 0 100 100" preserveAspectRatio="none">' + spokes + '</svg>' +
      '<div class="cw-hub"><img src="assets/logos/frontm/frontm-mark.png" alt=""><span class="cw-hub-label">FrontM</span></div>' +
      modHtml + stkHtml;

    /* narrow viewports: the radial pills become a wrapped legend BELOW the wheel
       (CSS swaps visibility) so labels can never collide or overlap nodes */
    stage.insertAdjacentHTML('afterend',
      '<div class="cw-legend">' + FM.WHEEL_STK.map(function (s) {
        return '<span class="cw-stk">' + ico(s.i) + '<span>' + s.n + '</span></span>';
      }).join('') + '</div>');

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
        if (!tOn){
          tOn = true;
          tNodes.forEach(function (n){ n.style.transition = 'transform .25s cubic-bezier(.22,.6,.36,1)'; });
          if (tHub) tHub.style.transition = 'transform .25s cubic-bezier(.22,.6,.36,1)';
        }
        stage.style.transform = 'perspective(1100px) rotateX(' + (-cY * 3.2).toFixed(2) + 'deg) rotateY(' + (cX * 3.2).toFixed(2) + 'deg)';
        for (var ti = 0; ti < tNodes.length; ti++){
          var dp = tNodes[ti].classList.contains('cw-node-stk') ? 10 : 6;
          tNodes[ti].style.transform = 'translate(calc(-50% + ' + (cX * dp).toFixed(1) + 'px), calc(-50% + ' + (cY * dp).toFixed(1) + 'px))';
        }
        if (tHub) tHub.style.transform = 'translate(calc(-50% + ' + (-cX * 3).toFixed(1) + 'px), calc(-50% + ' + (-cY * 3).toFixed(1) + 'px))';
        if (Math.abs(tX - cX) + Math.abs(tY - cY) > 0.002) tRaf = requestAnimationFrame(tilt);
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
