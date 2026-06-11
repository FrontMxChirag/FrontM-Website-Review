/* ============================================================
   FrontM Homepage v2 — 7-June rebuild: render new sections.
   Loads BEFORE fm.js so the reveal observer + demo-modal wiring
   in fm.js pick up the nodes rendered here.
   ============================================================ */
(function () {
  var FM = window.FM, ico = FM.ico;
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

  /* ---------- S6 · function accordions ---------- */
  (function () {
    var host = $('#fn-list'); if (!host) return;
    host.innerHTML = FM.FUNCTIONS.map(function (f, fi) {
      var helps = f.x.helps.map(function (h) {
        return '<li>' + ico(FM.I.check) + '<span><b>' + h[0] + '</b><span class="l">' + h[1] + '</span></span></li>';
      }).join('');
      var chips = f.x.uses.map(function (u) { return '<span>' + u + '</span>'; }).join('');
      var next = f.x.next.map(function (n) { return '<div class="nx"><b>Best fit:</b><span>' + n + '</span></div>'; }).join('');
      return '<article class="fn-card reveal" data-d="' + (fi % 3) + '" data-fn="' + f.id + '">' +
        '<div class="fn-head" role="button" tabindex="0" aria-expanded="false">' +
          '<div class="fn-ico">' + ico(f.icon) + '</div>' +
          '<div class="fn-htext"><h3>' + f.title + '</h3><div class="fn-tag">' + f.tag + '</div></div>' +
          '<div class="fn-chev"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></div>' +
        '</div>' +
        '<div class="fn-impact"><b>Impact:</b> ' + f.impact + '</div>' +
        '<div class="fn-panel"><div class="fn-panel-inner"><div class="fn-body">' +
          '<h4>' + f.x.h + '</h4><p>' + f.x.p + '</p>' +
          '<span class="fn-helps-label">FrontM helps ' + f.hl + ':</span>' +
          '<ul class="fn-helps">' + helps + '</ul>' +
          '<span class="fn-uses-label">Common use cases</span><div class="fn-chips">' + chips + '</div>' +
          '<span class="fn-next-label">Recommended next step</span><div class="fn-next">' + next + '</div>' +
        '</div></div></div>' +
        '<div class="fn-cta">' + platBtn('Explore Platform Plans', 'pricing', true) + demoBtn(f.demo, f.id) + '</div>' +
      '</article>';
    }).join('');

    function toggle(card) {
      var open = card.classList.toggle('open');
      var head = $('.fn-head', card); if (head) head.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    $$('.fn-head', host).forEach(function (head) {
      head.addEventListener('click', function () { toggle(head.closest('.fn-card')); });
      head.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(head.closest('.fn-card')); }
      });
    });
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
      return '<div class="cw-node" style="left:' + x.toFixed(2) + '%;top:' + y.toFixed(2) + '%">' +
        '<div class="cw-mod" style="--cc:' + m.color + '"><div class="cw-chip">' + ico(m.icon) + '</div>' +
        '<span class="cw-name">' + m.id + soon + '</span></div></div>';
    }).join('');

    var stkHtml = FM.WHEEL_STK.map(function (s, i) {
      var x = G.stk[i].x, y = G.stk[i].y;
      return '<div class="cw-node cw-node-stk" style="left:' + x.toFixed(2) + '%;top:' + y.toFixed(2) + '%">' +
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
