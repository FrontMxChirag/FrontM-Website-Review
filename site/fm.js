/* ============================================================
   FrontM, render + interactions
   Hardened (WS1.6): window.FM guard, per-block error isolation,
   reveal + modal wired FIRST so one failure can't blank the page
   or kill the demo path.
   ============================================================ */
(function () {
  var FM = window.FM;
  if (!FM) { if (window.console) console.error('[fm] window.FM missing — fm-data.js failed to load; aborting render'); return; }
  var ico = FM.ico;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  function safe(name, fn) { try { fn(); } catch (err) { if (window.console) console.error('[fm] init "' + name + '" failed:', err); } }

  /* ---------- reveal observer FIRST (with self-healing visibility failsafe) ---------- */
  safe('reveal', function () {
    // Add .in for the entrance animation; then if the element hasn't actually become visible within
    // ~1.1s (transition starved on a slow device, or the iframe/tab isn't compositing), force the
    // end-state inline. Healthy hardware completes the .8s transition first, so the animation is kept.
    function show(el) {
      if (!el || el.classList.contains('in')) return;
      el.classList.add('in');
      setTimeout(function () {
        if (parseFloat(getComputedStyle(el).opacity) < 0.05) {
          el.style.transition = 'none'; el.style.opacity = '1'; el.style.transform = 'none';
        }
      }, 1100);
    }
    function near(el) { var r = el.getBoundingClientRect(); return r.top < window.innerHeight * 0.95; } // on-screen or scrolled past

    var io = ('IntersectionObserver' in window) ? new IntersectionObserver(function (ents) {
      ents.forEach(function (e) { if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }) : null;

    var els = $$('.reveal');
    // reveal anything already in view immediately, so above-the-fold content (hero) never waits on the async observer
    els.forEach(function (el) { if (near(el)) show(el); });
    if (io) els.forEach(function (el) { if (!el.classList.contains('in')) io.observe(el); });
    else els.forEach(show);

    // Failsafe sweeps — must NOT depend on requestAnimationFrame (rAF gets starved by the canvas loops,
    // which is exactly when the observer can stall). Time-throttled scroll handler + timer sweeps.
    function sweep() { els.forEach(function (el) { if (!el.classList.contains('in') && near(el)) show(el); }); }
    var last = 0;
    window.addEventListener('scroll', function () {
      var t = Date.now(); if (t - last < 120) return; last = t; sweep();
    }, { passive: true });
    [400, 1200, 2500].forEach(function (t) { setTimeout(sweep, t); });
  });

  /* ---------- demo modal SECOND (the conversion path must survive anything below) ---------- */
  safe('demo-modal', function () {
    var scrim = $('#demo-modal'); if (!scrim) return;
    var modal = $('.modal', scrim);
    var state = { day: null, time: null };
    var lastFocus = null;
    var FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

    function open() {
      lastFocus = document.activeElement;
      scrim.classList.add('open');
      document.body.style.overflow = 'hidden';
      gotoStep(1);
      // focus must wait for the scrim's visibility transition to begin —
      // a synchronous .focus() lands while computed visibility is still 'hidden' and silently fails
      setTimeout(function () {
        var first = modal ? modal.querySelector(FOCUSABLE) : null;
        if (first && scrim.classList.contains('open')) first.focus();
      }, 80);
    }
    function close() {
      scrim.classList.remove('open');
      document.body.style.overflow = '';
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    $$('[data-open-demo]').forEach(function (b) { b.addEventListener('click', function (e) { e.preventDefault(); open(); }); });
    var closeBtn = $('#modal-close'); if (closeBtn) closeBtn.addEventListener('click', close);
    scrim.addEventListener('click', function (e) { if (e.target === scrim) close(); });
    document.addEventListener('keydown', function (e) {
      if (!scrim.classList.contains('open')) return;
      if (e.key === 'Escape') { close(); return; }
      // focus trap: keep Tab inside the dialog
      if (e.key === 'Tab' && modal) {
        var f = $$(FOCUSABLE, modal).filter(function (el) { return el.offsetParent !== null; });
        if (!f.length) return;
        var first = f[0], lastEl = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); lastEl.focus(); }
        else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); first.focus(); }
      }
    });

    // build day chips (next 5 business days)
    var dayHost = $('#demo-days'), d = new Date(), added = 0, chips = [];
    var dn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], mn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    while (added < 5) {
      d.setDate(d.getDate() + 1);
      if (d.getDay() !== 0 && d.getDay() !== 6) { chips.push('<button class="chip" data-day="' + dn[d.getDay()] + ' ' + d.getDate() + ' ' + mn[d.getMonth()] + '">' + dn[d.getDay()] + ' ' + d.getDate() + ' ' + mn[d.getMonth()] + '</button>'); added++; }
    }
    if (dayHost) dayHost.innerHTML = chips.join('');

    function gotoStep(n) {
      $$('.modal-steps .st').forEach(function (s, i) { s.classList.toggle('active', i === n - 1); s.classList.toggle('done', i < n - 1); });
      $$('.modal-pane').forEach(function (p) { p.classList.toggle('show', +p.dataset.step === n); });
    }
    // back buttons (panes 2-3) — a mis-tap is no longer a dead end
    $$('[data-back]').forEach(function (b) { b.addEventListener('click', function () { gotoStep(+b.dataset.back); }); });
    if (dayHost) dayHost.addEventListener('click', function (e) { var c = e.target.closest('.chip'); if (!c) return; $$('.chip', dayHost).forEach(function (x) { x.classList.remove('sel'); }); c.classList.add('sel'); state.day = c.dataset.day; setTimeout(function () { gotoStep(2); }, 220); });
    var times = $('#demo-times'); if (times) times.addEventListener('click', function (e) { var c = e.target.closest('.chip'); if (!c) return; $$('#demo-times .chip').forEach(function (x) { x.classList.remove('sel'); }); c.classList.add('sel'); state.time = c.dataset.time; setTimeout(function () { gotoStep(3); }, 220); });
    var form = $('#demo-form'); if (form) form.addEventListener('submit', function (e) { e.preventDefault(); $$('.modal-pane').forEach(function (p) { p.classList.remove('show'); }); $('#demo-success').classList.add('show'); $$('.modal-steps .st').forEach(function (s) { s.classList.add('done'); s.classList.remove('active'); }); });
  });

  /* ---------- NAV (data-driven mega-menus) ---------- */
  safe('nav', function () {
    var center = $('#nav-center'), drawer = $('#drawer-body');
    if (!center) return;
    FM.NAV.forEach(function (item) {
      var wrap = document.createElement('div'); wrap.className = 'nav-item';
      var hasMenu = !!item.menu;
      wrap.innerHTML = '<a href="#" class="nav-link">' + item.label +
        (hasMenu ? '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>' : '') + '</a>';
      if (hasMenu) {
        var m = item.menu;
        var rows = m.grid.map(function (g) {
          var color = g[2] || '#9A86FF';
          var soon = g[3] ? '<span class="soon">' + g[3] + '</span>' : '';
          var desc = g[1] ? '<div class="md">' + g[1] + '</div>' : '';
          return '<a href="#" class="mega-link"><span class="mdot" style="background:' + color + '"></span>' +
            '<span><span class="mt">' + g[0] + soon + '</span>' + desc + '</span></a>';
        }).join('');
        var cta = m.cta ? '<div class="mega-cta"><span>' + (m.cta[0] || '') + '</span><a href="#">' + m.cta[1] + ' →</a></div>' : '';
        wrap.innerHTML += '<div class="mega"><div class="mega-title">' + m.title + '</div>' +
          '<div class="mega-grid' + (m.one ? ' one' : '') + '">' + rows + '</div>' + cta + '</div>';
      }
      center.appendChild(wrap);

      // drawer accordion
      if (drawer) {
        var det = document.createElement('details');
        var subs = hasMenu ? item.menu.grid.map(function (g) { return '<a href="#">' + g[0] + '</a>'; }).join('') : '';
        det.innerHTML = '<summary>' + item.label + '<svg class="chev" viewBox="0 0 24 24" width="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></summary><div class="sub">' + subs + '</div>';
        drawer.appendChild(det);
      }
    });
  });

  /* ---------- nav scroll state + drawer ---------- */
  safe('nav-chrome', function () {
    var nav = $('.nav');
    function onScrollNav() { if (nav) nav.classList.toggle('scrolled', window.scrollY > 30); }
    window.addEventListener('scroll', onScrollNav, { passive: true }); onScrollNav();
    var drawerEl = $('#drawer'), toggle = $('#nav-toggle');
    if (toggle && drawerEl) toggle.addEventListener('click', function () { drawerEl.classList.toggle('open'); });
  });

  /* ---------- partner marquee ---------- */
  safe('marquee', function () {
    var track = $('#marquee-track'); if (!track) return;
    var base = 'assets/logos/companies/';
    var html = FM.PARTNERS.map(function (p) {
      /* p.h caps were tuned for the old 58px pill row — scale x2.2 for the 134px-tall dark-glass tiles */
      var hs = p.h ? ' style="max-height:' + Math.round(p.h * 2.2) + 'px"' : '';
      return '<span class="logo' + (p.inv === false ? ' logo-native' : '') + '" title="' + p.n + '"><img src="' + base + p.f + '" alt="' + p.n + '"' + hs + ' decoding="async"></span>';
    }).join('');
    track.innerHTML = html + html; // duplicate for seamless loop
    // a 404'd logo file removes its pill instead of showing a broken-image glyph
    $$('img', track).forEach(function (im) {
      im.addEventListener('error', function () { var l = im.closest('.logo'); if (l && l.parentNode) l.parentNode.removeChild(l); });
    });

    /* centre spotlight: each logo brightens (colour + lift) as it passes the middle */
    var mq = track.closest('.marquee');
    if (mq && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      var logos = [].slice.call(track.children);
      var spotOn = false, spotRaf = 0;
      var spot = function () {
        if (!spotOn) { spotRaf = 0; return; }
        var r = mq.getBoundingClientRect();
        var mid = r.left + r.width / 2, half = r.width * 0.4;
        for (var i = 0; i < logos.length; i++) {
          var lr = logos[i].getBoundingClientRect();
          if (lr.right < r.left || lr.left > r.right) { logos[i].style.setProperty('--w', '0'); continue; }
          var d = Math.abs((lr.left + lr.right) / 2 - mid) / half;
          /* plateau: anything within the inner 24% of the spotlight is FULLY lit */
          d = d <= 0.24 ? 0 : (d - 0.24) / 0.76;
          var w = d >= 1 ? 0 : 1 - d * d * (3 - 2 * d);   // smooth falloff
          logos[i].style.setProperty('--w', w.toFixed(3));
        }
        spotRaf = requestAnimationFrame(spot);
      };
      new IntersectionObserver(function (en) {
        spotOn = en[en.length - 1].isIntersecting;
        if (spotOn && !spotRaf) spotRaf = requestAnimationFrame(spot);
      }).observe(mq);
    }
  });

  /* ---------- pillars ---------- */
  safe('pillars', function () {
    var host = $('#pillars'); if (!host) return;
    host.innerHTML = FM.PILLARS.map(function (p) {
      var checks = p.checks.map(function (c) { return '<li>' + ico(FM.I.check) + '<span>' + c + '</span></li>'; }).join('');
      return '<div class="pillar" tabindex="0" style="--cc:' + p.color + '"><div class="pillar-inner">' +
        '<div class="pillar-face"><div class="pillar-ico">' + ico(p.icon) + '</div>' +
        '<h3>' + p.name + '</h3><p class="pbody">' + p.body + '</p>' +
        '<div class="hint">Hover for more <svg viewBox="0 0 24 24" width="13" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></div></div>' +
        '<div class="pillar-face pillar-back"><div class="wm">' + ico(p.icon) + '</div><ul>' + checks + '</ul></div>' +
        '</div></div>';
    }).join('');
  });

  /* ---------- pathways ---------- */
  safe('pathways', function () {
    var host = $('#pathways'); if (!host) return;
    host.innerHTML = FM.PATHWAYS.map(function (p) {
      return '<div class="pathway reveal"><div class="pw-ico">' + ico(p.icon) + '</div>' +
        '<h4>' + p.t + '</h4><p>' + p.d + '</p>' +
        '<span class="pw-link">See how it works <svg viewBox="0 0 24 24" width="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></div>';
    }).join('');
  });

  /* ---------- module explorer ---------- */
  safe('module-explorer', function () {
    var list = $('#mod-list'), detail = $('#mod-detail'); if (!list) return;
    var carTimer = null, slideIdx = 0;
    list.innerHTML = FM.MODULES.map(function (m, i) {
      var soon = m.soon ? '<span class="soon">Soon</span>' : '';
      return '<button class="mod-item' + (i === 0 ? ' active' : '') + '" data-i="' + i + '" style="--cc:' + m.color + '">' +
        '<span class="mi-ico">' + ico(m.icon) + '</span><span><span class="mi-name">' + m.id + soon + '</span>' +
        '<span class="mi-tag">' + m.tag + '</span></span></button>';
    }).join('');

    function renderDetail(i) {
      var m = FM.MODULES[i]; slideIdx = 0;
      var soon = m.soon ? '<span class="soon">Coming Soon</span>' : '';
      detail.style.setProperty('--cc', m.color);
      detail.innerHTML = '<div class="md-tag tag" style="background:color-mix(in oklch,' + m.color + ' 16%,transparent);color:' + m.color + '"><span class="dot" style="background:' + m.color + '"></span>' + m.id + '</div>' + soon +
        '<h3>' + m.id + '</h3><div class="md-line">' + m.tag + '</div><p class="md-body">' + m.body + '</p>' +
        '<div class="md-carousel">' + m.slides.map(function (s, k) {
          return '<div class="md-slide' + (k === 0 ? ' show' : '') + '"><div class="ms-k">' + s[0] + '</div><div class="ms-v">' + s[1] + '</div></div>';
        }).join('') +
        '<div class="md-dots">' + m.slides.map(function (s, k) { return '<button class="' + (k === 0 ? 'on' : '') + '" data-k="' + k + '"></button>'; }).join('') + '</div></div>';
      setupCarousel();
    }
    function setupCarousel() {
      clearInterval(carTimer);
      var slides = $$('.md-slide', detail), dots = $$('.md-dots button', detail);
      function go(k) { slideIdx = k % slides.length; slides.forEach(function (s, n) { s.classList.toggle('show', n === slideIdx); }); dots.forEach(function (d, n) { d.classList.toggle('on', n === slideIdx); }); }
      dots.forEach(function (d, k) { d.addEventListener('click', function () { go(k); }); });
      carTimer = setInterval(function () { go(slideIdx + 1); }, 3200);
    }
    list.addEventListener('click', function (e) {
      var btn = e.target.closest('.mod-item'); if (!btn) return;
      $$('.mod-item', list).forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      renderDetail(+btn.dataset.i);
    });
    renderDetail(0);
  });

  /* ---------- blogs: looping card rail (touch scroll + edge-hover autoscroll) ---------- */
  safe('blogs', function () {
    var row = $('#blogs-row'); if (!row) return;
    var html = FM.BLOGS.map(function (b) {
      return '<article class="blog-card" style="--cc:' + b.c + '"><div class="bc-cat">' + b.cat + '</div>' +
        '<h4>' + b.t + '</h4><p>' + b.x + '</p>' +
        '<span class="bc-link">Read article <svg viewBox="0 0 24 24" width="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></article>';
    }).join('');
    row.innerHTML = html + html;   // duplicate for a seamless loop
    var half = 0;
    function measure(){ half = row.scrollWidth / 2; }
    function jump(x){ row.scrollTo({ left: x, behavior: 'instant' }); }
    function wrap(){
      if (!half) return;
      if (row.scrollLeft >= half) jump(row.scrollLeft - half);
      else if (row.scrollLeft <= 0) jump(row.scrollLeft + half);
    }
    measure();
    requestAnimationFrame(function (){ measure(); if (row.scrollLeft <= 0) jump(1); });
    window.addEventListener('resize', measure, { passive: true });
    row.addEventListener('scroll', wrap, { passive: true });
    $$('[data-blog]').forEach(function (b) {
      b.addEventListener('click', function () {
        var card = row.querySelector('.blog-card');
        var step = card ? card.getBoundingClientRect().width + 20 : 340;
        row.scrollBy({ left: step * (+b.dataset.blog), behavior: 'smooth' });
      });
    });
    /* edge-hover autoscroll: park the pointer near either side of the section
       and the rail glides that way (fine pointers only — touch just swipes) */
    var zone = row.closest('section') || row.parentElement;
    if (zone && matchMedia('(hover: hover) and (pointer: fine)').matches){
      var dir = 0, autoRaf = 0;
      var autoStep = function (){
        if (!dir){ autoRaf = 0; return; }
        jump(row.scrollLeft + dir * 4);
        wrap();
        autoRaf = requestAnimationFrame(autoStep);
      };
      zone.addEventListener('pointermove', function (e) {
        var r = zone.getBoundingClientRect();
        var nx = (e.clientX - r.left) / r.width;
        dir = nx < 0.07 ? -1 : nx > 0.93 ? 1 : 0;
        if (dir && !autoRaf) autoRaf = requestAnimationFrame(autoStep);
      }, { passive: true });
      zone.addEventListener('pointerleave', function () { dir = 0; }, { passive: true });
    }
  });

  /* ---------- testimonials ---------- */
  safe('testimonials', function () {
    var track = $('#t-track2'), dotsHost = $('#t-dots'); if (!track || !dotsHost) return;
    track.innerHTML = FM.TESTIMONIALS.map(function (t, i) {
      return '<div class="t-quote' + (i === 0 ? ' active' : '') + '"><div class="mark">“</div>' +
        '<blockquote>' + t.q + '</blockquote>' +
        '<div class="who"><b>' + t.who.split(',')[0] + '</b>, ' + t.who.split(',').slice(1).join(',').trim() + '</div>' +
        '<div class="metric">' + t.m + '</div></div>';
    }).join('');
    dotsHost.innerHTML = FM.TESTIMONIALS.map(function (t, i) { return '<button class="' + (i === 0 ? 'on' : '') + '" data-k="' + i + '"></button>'; }).join('');
    var quotes = $$('.t-quote', track), dots = $$('button', dotsHost), idx = 0, timer = null;
    function go(n) { idx = (n + quotes.length) % quotes.length; quotes.forEach(function (q, k) { q.classList.toggle('active', k === idx); }); dots.forEach(function (d, k) { d.classList.toggle('on', k === idx); }); }
    function restart() { clearInterval(timer); timer = setInterval(function () { go(idx + 1); }, 5000); }
    dots.forEach(function (d, k) { d.addEventListener('click', function () { go(k); restart(); }); });
    var prev = $('#t-prev'), next = $('#t-next');
    if (prev) prev.addEventListener('click', function () { go(idx - 1); restart(); });
    if (next) next.addEventListener('click', function () { go(idx + 1); restart(); });
    restart();
  });

  /* ---------- narrative rail + paragraph reveal ---------- */
  safe('narrative', function () {
    var sec = $('#narrative'); if (!sec) return;
    var fill = $('.nrail .fill', sec), paras = $$('.narrative-body p', sec);
    if (!fill) return;
    function upd() {
      var r = sec.getBoundingClientRect(), vh = window.innerHeight;
      var prog = Math.max(0, Math.min(1, (vh * 0.7 - r.top) / (r.height * 0.7)));
      fill.style.height = (prog * 100) + '%';
      paras.forEach(function (p, i) {
        var pr = p.getBoundingClientRect();
        p.classList.toggle('lit', pr.top < vh * 0.66 && pr.bottom > vh * 0.2);
      });
    }
    window.addEventListener('scroll', upd, { passive: true }); window.addEventListener('resize', upd); upd();
  });

  /* ---------- platform diagram scroll-scrub + parallax ---------- */
  safe('platform-diagram', function () {
    var sec = $('#platform'); if (!sec || sec.querySelector('.pf-stage')) return;
    var cards = $$('.pf-card', sec);
    var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    var prog = 0, mtx = 0, mty = 0, mcx = 0, mcy = 0, raf = null;
    var SPREAD = [-1, 0, 1];                 // layered depth per card
    function scrollProg() {
      var r = sec.getBoundingClientRect(), vh = window.innerHeight;
      prog = Math.max(0, Math.min(1, (vh * 0.92 - r.top) / (vh * 1.15)));
    }
    function apply() {
      cards.forEach(function (c, i) {
        var sep = prog, depth = SPREAD[i];
        var baseY = depth * 172 * sep;          // separate vertically
        var stackY = depth * 9 * (1 - sep);     // stacked slab offset
        var rotX = (1 - sep) * 15;              // slab flattens out
        var rise = (1 - sep) * 44;              // rise into place
        var rotY = mcx * 7 * (0.4 + 0.6 * sep); // cursor sway, depth-scaled
        var ppx = mcx * (12 + depth * 7);
        var ppy = mcy * (7 + depth * 5);
        var sc = 0.93 + sep * 0.07;
        c.style.transform = 'translate(-50%,-50%) translate(' + ppx.toFixed(1) + 'px,' + (baseY + stackY + rise + ppy).toFixed(1) + 'px) perspective(1400px) rotateX(' + rotX.toFixed(2) + 'deg) rotateY(' + rotY.toFixed(2) + 'deg) scale(' + sc.toFixed(3) + ')';
        c.style.opacity = Math.min(1, 0.25 + sep * 1.35);
        c.style.zIndex = 10 - i;
      });
    }
    function loop() {
      mcx += (mtx - mcx) * 0.07; mcy += (mty - mcy) * 0.07;
      apply();
      if (Math.abs(mtx - mcx) > 0.002 || Math.abs(mty - mcy) > 0.002) raf = requestAnimationFrame(loop); else raf = null;
    }
    function onScroll() { scrollProg(); apply(); }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    if (!reduced) sec.addEventListener('pointermove', function (e) {
      var r = sec.getBoundingClientRect();
      mtx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      mty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      if (!raf) raf = requestAnimationFrame(loop);
    }, { passive: true });
    scrollProg(); apply();
  });

})();
