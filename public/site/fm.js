/* ============================================================
   FrontM, render + interactions
   ============================================================ */
(function () {
  var FM = window.FM, ico = FM.ico;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };

  /* ---------- NAV (data-driven mega-menus) ---------- */
  (function () {
    var center = $('#nav-center'), drawer = $('#drawer-body');
    if (!center) return;
    var page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    FM.NAV.forEach(function (item) {
      var hasMenu = !!(item.menu && item.menu.items && item.menu.items.length);
      var href = item.href || null;
      var isActive = !!(href && href.toLowerCase().split('#')[0] === page);

      var wrap = document.createElement('div');
      wrap.className = 'nav-item' + (hasMenu ? ' has-dd' : '');

      // top-level: a real link, a dropdown trigger, or an inert placeholder label
      if (hasMenu) {
        wrap.innerHTML = '<button type="button" class="nav-link nav-trigger" aria-haspopup="true" aria-expanded="false">' + item.label +
          '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></button>';
      } else if (href) {
        wrap.innerHTML = '<a href="' + href + '" class="nav-link' + (isActive ? ' active' : '') + '"' +
          (isActive ? ' aria-current="page"' : '') + '>' + item.label + '</a>';
      } else if (item.interstitial) {
        // external hand-off (e.g. Community → onship.com): clickable, opens an interstitial
        wrap.innerHTML = '<button type="button" class="nav-link" data-interstitial="' + item.interstitial.url + '">' + item.label + '</button>';
      } else {
        // no destination yet — inert: no link, no dropdown, no hover reaction
        wrap.innerHTML = '<span class="nav-link nav-inert" aria-disabled="true">' + item.label + '</span>';
      }

      // dropdown panel (Company only) — simple stacked links, not a mega grid
      if (hasMenu) {
        var links = item.menu.items.map(function (it) {
          if (!it[1]) { /* no destination yet — inert item, not a broken '#' link */
            return '<span class="dd-link dd-soon" aria-disabled="true">' + it[0] + '<em>Soon</em></span>';
          }
          var act = it[1].toLowerCase().split('#')[0] === page ? ' active' : '';
          return '<a href="' + it[1] + '" class="dd-link' + act + '">' + it[0] + '</a>';
        }).join('');
        wrap.innerHTML += '<div class="nav-dd" role="menu"><div class="nav-dd-inner">' + links + '</div></div>';
      }

      center.appendChild(wrap);

      // hover-intent grace + click toggle (dropdown items only)
      if (hasMenu) {
        var closeTimer = null;
        var trigger = wrap.querySelector('.nav-trigger');
        wrap.addEventListener('mouseenter', function () {
          clearTimeout(closeTimer);
          $$('.nav-item.mega-open', center).forEach(function (o) { if (o !== wrap) o.classList.remove('mega-open'); });
          wrap.classList.add('mega-open');
          trigger.setAttribute('aria-expanded', 'true');
        });
        wrap.addEventListener('mouseleave', function () {
          clearTimeout(closeTimer);
          closeTimer = setTimeout(function () {
            wrap.classList.remove('mega-open');
            trigger.setAttribute('aria-expanded', 'false');
          }, 350);
        });
        trigger.addEventListener('click', function (e) {
          e.preventDefault();
          var open = wrap.classList.toggle('mega-open');
          trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
      }

      // drawer (mobile)
      if (drawer) {
        if (hasMenu) {
          var det = document.createElement('details');
          var subs = item.menu.items.map(function (it) { return it[1] ? '<a href="' + it[1] + '">' + it[0] + '</a>' : '<span class="drawer-soon" aria-disabled="true">' + it[0] + '<em>Soon</em></span>'; }).join('');
          det.innerHTML = '<summary>' + item.label + '<svg class="chev" viewBox="0 0 24 24" width="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></summary><div class="sub">' + subs + '</div>';
          drawer.appendChild(det);
        } else if (href) {
          var a = document.createElement('a');
          a.className = 'drawer-link' + (isActive ? ' active' : '');
          a.href = href; a.textContent = item.label;
          drawer.appendChild(a);
        } else if (item.interstitial) {
          var ib = document.createElement('button');
          ib.type = 'button';
          ib.className = 'drawer-link';
          ib.style.textAlign = 'left';
          ib.setAttribute('data-interstitial', item.interstitial.url);
          ib.textContent = item.label;
          drawer.appendChild(ib);
        } else {
          var s = document.createElement('span');
          s.className = 'drawer-link inert';
          s.textContent = item.label;
          drawer.appendChild(s);
        }
      }
    });
  })();

  /* ---------- external hand-off interstitial (Community → onship.com) ---------- */
  (function () {
    var triggers = $$('[data-interstitial]');
    if (!triggers.length) return;

    function cfgFor(url) {
      var m = (FM.NAV || []).filter(function (n) { return n.interstitial && n.interstitial.url === url; })[0];
      return m ? m.interstitial : { url: url, host: url.replace(/^https?:\/\//, ''), logo: '' };
    }

    var scrim = document.createElement('div');
    scrim.className = 'modal-scrim';
    scrim.id = 'onship-interstitial';
    scrim.innerHTML =
      '<div class="modal ois-modal" role="dialog" aria-modal="true" aria-label="Leaving FrontM">' +
        '<button class="modal-close" type="button" data-ois-back aria-label="Close"><svg viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
        '<img class="ois-logo" alt="onship" decoding="async">' +
        '<div class="eyebrow ois-eye"><span class="dot"></span> Leaving FrontM</div>' +
        '<h3>You\u2019ll be taken to <span class="ois-host"></span></h3>' +
        '<p class="ois-copy muted">The FrontM community lives on a dedicated site. Continue to onship, or stay here on FrontM.</p>' +
        '<div class="ois-cta">' +
          '<a class="btn btn-primary btn-pill" data-ois-go target="_blank" rel="noopener">Proceed</a>' +
          '<button class="btn btn-ghost btn-pill" type="button" data-ois-back>Go back</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(scrim);

    var logo = scrim.querySelector('.ois-logo');
    var hostEl = scrim.querySelector('.ois-host');
    var go = scrim.querySelector('[data-ois-go]');

    function open(url) {
      var c = cfgFor(url);
      if (c.logo) { logo.src = c.logo; logo.style.display = ''; } else { logo.style.display = 'none'; }
      hostEl.textContent = c.host || url;
      go.href = c.url;
      scrim.classList.add('open');
      document.body.style.overflow = 'hidden';
      setTimeout(function () { go.focus(); }, 60);
    }
    function close() { scrim.classList.remove('open'); document.body.style.overflow = ''; }

    triggers.forEach(function (t) {
      t.addEventListener('click', function (e) { e.preventDefault(); open(t.getAttribute('data-interstitial')); });
    });
    scrim.addEventListener('click', function (e) {
      if (e.target === scrim || e.target.closest('[data-ois-back]')) { e.preventDefault(); close(); }
    });
    go.addEventListener('click', close); // let the link navigate, then reset state
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && scrim.classList.contains('open')) close(); });
  })();

  /* ---------- nav scroll state + drawer ---------- */
  var nav = $('.nav');
  function onScrollNav() { if (nav) nav.classList.toggle('scrolled', window.scrollY > 30); }
  window.addEventListener('scroll', onScrollNav, { passive: true }); onScrollNav();
  var drawerEl = $('#drawer'), toggle = $('#nav-toggle');
  if (toggle) toggle.addEventListener('click', function () { drawerEl.classList.toggle('open'); });

  /* ---------- partner marquee ---------- */
  (function () {
    var track = $('#marquee-track'); if (!track) return;
    var base = '/assets/logos/companies/';
    var html = FM.PARTNERS.map(function (p) {
      /* p.h caps were tuned for the old 58px pill row — scale x1.7 for the 100px-tall landscape dark-glass tiles */
      var hs = p.h ? ' style="max-height:' + Math.round(p.h * 1.7) + 'px"' : '';
      return '<span class="logo' + (p.inv === false ? ' logo-native' : '') + '" title="' + p.n + '"><img src="' + base + p.f + '" alt="' + p.n + '"' + hs + ' decoding="async"></span>';
    }).join('');
    track.innerHTML = html + html; // duplicate for seamless loop

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
  })();

  /* ---------- pillars ---------- */
  (function () {
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
  })();

  /* ---------- pathways ---------- */
  (function () {
    var host = $('#pathways'); if (!host) return;
    host.innerHTML = FM.PATHWAYS.map(function (p) {
      return '<div class="pathway reveal"><div class="pw-ico">' + ico(p.icon) + '</div>' +
        '<h4>' + p.t + '</h4><p>' + p.d + '</p>' +
        '<span class="pw-link">See how it works <svg viewBox="0 0 24 24" width="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></div>';
    }).join('');
  })();

  /* ---------- module explorer ---------- */
  (function () {
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
  })();

  /* ---------- homepage blogs carousel (featured blogs; manual prev/next + swipe) ---------- */
  (function () {
    var row = $('#blogs-row'); if (!row) return;
    var todo = function (v) { return !v || (typeof v === 'string' && /TODO/i.test(v)); };
    var types = FM.RES_TYPES || {};
    var arrow = '<svg viewBox="0 0 24 24" width="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

    /* Blogs only. News entries are parked in FM.RESOURCES but never shown here.
       Source = featured blogs; INTERIM fallback to all blogs while featured flags are
       unset, so the section never goes empty/broken. Switches to featured-only once
       real blogs + flags land — purely a data change. */
    var blogs = (FM.RESOURCES || []).filter(function (b) { return b.type === 'blog' && !todo(b.title); });
    var featured = blogs.filter(function (b) { return b.featured; });
    var show = featured.length ? featured : blogs;

    var section = row.closest('section');
    if (!show.length) { if (section) section.style.display = 'none'; return; }   // hard guard: never render an empty section

    row.innerHTML = show.map(function (b) {
      var ty = types[b.type] || { label: b.type, c: '#9A86FF' };
      var media = !todo(b.image)
        ? '<div class="bc-media" style="background-image:url(\'' + b.image + '\')"></div>'
        : '<div class="bc-media bc-media-ph"><span>' + ty.label + '</span></div>';
      var cat = todo(b.cat) ? ty.label : b.cat;
      var dek = todo(b.dek) ? '<p class="bc-pending">Summary coming soon</p>' : '<p>' + b.dek + '</p>';
      var link = !todo(b.url)
        ? '<a class="bc-link" href="' + b.url + '" target="_blank" rel="noopener">Read article ' + arrow + '</a>'
        : '<a class="bc-link" href="blogs.html">View in Blogs ' + arrow + '</a>';
      return '<article class="blog-card" style="--cc:' + ty.c + '">' + media +
        '<div class="bc-body"><div class="bc-cat">' + cat + '</div>' +
        '<h4>' + b.title + '</h4>' + dek + link + '</div></article>';
    }).join('');

    var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    var navWrap = $('.blogs-nav');
    function step() { var c = row.querySelector('.blog-card'); return c ? c.getBoundingClientRect().width + 20 : 340; }
    function atEnds() {
      var max = row.scrollWidth - row.clientWidth - 2;
      return { start: row.scrollLeft <= 2, end: row.scrollLeft >= max, scrollable: max > 4 };
    }
    function syncArrows() {
      var e = atEnds();
      $$('[data-blog]').forEach(function (b) {
        var prev = (+b.dataset.blog) < 0;
        var off = prev ? e.start : e.end;
        b.disabled = off; b.style.opacity = off ? '0.32' : ''; b.style.pointerEvents = off ? 'none' : '';
      });
      // hide the prev/next cluster entirely when there's nothing to scroll (e.g. a single blog)
      $$('[data-blog]').forEach(function (b) { b.style.display = e.scrollable ? '' : 'none'; });
    }
    $$('[data-blog]').forEach(function (b) {
      b.addEventListener('click', function () {
        row.scrollBy({ left: step() * (+b.dataset.blog), behavior: reduced ? 'auto' : 'smooth' });
      });
    });
    row.addEventListener('scroll', syncArrows, { passive: true });
    window.addEventListener('resize', syncArrows, { passive: true });
    requestAnimationFrame(syncArrows);
  })();

  /* ---------- testimonials (homepage carousel — INTERIM placeholder quotes) ---------- */
  (function () {
    var track = $('#t-track2'), dotsHost = $('#t-dots'); if (!track) return;
    var DATA = FM.HOME_TESTIMONIALS || [];
    track.innerHTML = DATA.map(function (t, i) {
      return '<div class="t-quote' + (i === 0 ? ' active' : '') + '"><div class="mark">\u201C</div>' +
        '<blockquote>' + t.q + '</blockquote>' +
        '<div class="who"><b>' + t.who.split(',')[0] + '</b>, ' + t.who.split(',').slice(1).join(',').trim() + '</div>' +
        '<div class="metric">' + t.m + '</div></div>';
    }).join('');
    dotsHost.innerHTML = DATA.map(function (t, i) { return '<button class="' + (i === 0 ? 'on' : '') + '" data-k="' + i + '"></button>'; }).join('');
    var quotes = $$('.t-quote', track), dots = $$('button', dotsHost), idx = 0, timer = null;
    function go(n) { idx = (n + quotes.length) % quotes.length; quotes.forEach(function (q, k) { q.classList.toggle('active', k === idx); }); dots.forEach(function (d, k) { d.classList.toggle('on', k === idx); }); }
    function restart() { clearInterval(timer); timer = setInterval(function () { go(idx + 1); }, 5000); }
    dots.forEach(function (d, k) { d.addEventListener('click', function () { go(k); restart(); }); });
    $('#t-prev').addEventListener('click', function () { go(idx - 1); restart(); });
    $('#t-next').addEventListener('click', function () { go(idx + 1); restart(); });
    restart();
  })();

  /* ---------- partners & investors band (Batch B scaffold) ----------
     Renders FROM FM.TESTIMONIALS (type partner|investor). CONDITIONAL: stays hidden while there
     are no real entries, so an empty band never ships. Every card is tagged Partner/Investor and
     labelled role · company so it can never read as a customer endorsement. Missing photo →
     monogram (a quote is never blocked on a photo). Punit Oza is guarded out. Static grid — no
     carousel/auto-advance, so reduced-motion needs nothing special. */
  (function () {
    var sec = $('#partners-investors'); if (!sec) return;
    var grid = $('#pi-grid', sec); if (!grid) return;
    var todo = function (v) { return !v || (typeof v === 'string' && /TODO/i.test(v)); };
    /* Backstop only — the real control is simply never adding an Oza entry. Keyed on ATTRIBUTION
       (name/company), NOT the quote body, so a partner who merely mentions Oza isn't dropped.
       Scoped to this band only — it does not touch Oza's "One Year With FrontM" blog. */
    var isOza = function (t) { return /\boza\b/i.test([t.name, t.company].join(' ')); };
    var list = (FM.TESTIMONIALS || []).filter(function (t) {
      return (t.type === 'partner' || t.type === 'investor') && !isOza(t) && !todo(t.quote);
    });
    if (!list.length) { sec.hidden = true; sec.style.display = 'none'; return; }  // empty band must not ship
    sec.hidden = false;

    function monogram(t) {
      var src = (!todo(t.name) ? t.name : t.company) || '';
      var p = src.trim().split(/\s+/);
      var ini = ((p[0] || '')[0] || '') + ((p[1] || '')[0] || '');
      return '<span class="pi-mono" aria-hidden="true">' + (ini.toUpperCase() || '\u2022') + '</span>';
    }
    grid.innerHTML = list.map(function (t) {
      var pic = !todo(t.photo)
        ? '<img class="pi-photo" src="' + t.photo + '" alt="' + (t.name || t.company || '') + '" loading="lazy" decoding="async">'
        : monogram(t);
      var name = todo(t.name) ? '' : '<b>' + t.name + '</b>';
      var rc = [todo(t.role) ? '' : t.role, todo(t.company) ? '' : t.company].filter(Boolean).join(' \u00B7 ');
      var logo = !todo(t.logo) ? '<img class="pi-logo" src="' + t.logo + '" alt="' + (t.company || '') + '" loading="lazy" decoding="async">' : '';
      var tag = t.type === 'investor' ? 'Investor' : 'Partner';
      return '<figure class="pi-card reveal"><div class="pi-tag">' + tag + '</div>' +
        '<blockquote>' + t.quote + '</blockquote>' +
        '<figcaption><span class="pi-id">' + pic +
          '<span class="pi-meta">' + name + '<span class="pi-rc">' + rc + '</span></span></span>' + logo +
        '</figcaption></figure>';
    }).join('');
  })();

  /* ---------- narrative rail + paragraph reveal ---------- */
  (function () {
    var sec = $('#narrative'); if (!sec) return;
    var fill = $('.nrail .fill', sec), paras = $$('.narrative-body p', sec);
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
  })();

  /* ---------- platform diagram scroll-scrub + parallax ---------- */
  (function () {
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
  })();

  /* ---------- reveal observer (with self-healing visibility failsafe) ---------- */
  (function () {
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
  })();

  /* ---------- demo modal ---------- */
  (function () {
    var scrim = $('#demo-modal'); if (!scrim) return;
    var state = { day: null, time: null };
    var mEye = scrim.querySelector('.modal > .eyebrow');
    var mTitle = scrim.querySelector('.modal > h3');
    var defEye = mEye ? mEye.textContent : '';
    var defTitle = mTitle ? mTitle.textContent : '';
    function open(fn) {
      if (mEye && mTitle) {
        if (fn === 'value-assessment') { mEye.textContent = 'Value Assessment'; mTitle.textContent = 'Scope the measurable value for your fleet in 20 minutes.'; }
        else { mEye.textContent = defEye; mTitle.textContent = defTitle; }
      }
      scrim.classList.add('open'); document.body.style.overflow = 'hidden'; gotoStep(1);
    }
    function close() { scrim.classList.remove('open'); document.body.style.overflow = ''; }
    $$('[data-open-demo]').forEach(function (b) { b.addEventListener('click', function (e) { e.preventDefault(); open(b.getAttribute('data-demo-fn') || ''); }); });
    $('#modal-close').addEventListener('click', close);
    scrim.addEventListener('click', function (e) { if (e.target === scrim) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

    // build day chips (next 5 business days)
    var dayHost = $('#demo-days'), d = new Date(), added = 0, chips = [];
    var dn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], mn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    while (added < 5) {
      d.setDate(d.getDate() + 1);
      if (d.getDay() !== 0 && d.getDay() !== 6) { chips.push('<button class="chip" data-day="' + dn[d.getDay()] + ' ' + d.getDate() + ' ' + mn[d.getMonth()] + '">' + dn[d.getDay()] + ' ' + d.getDate() + ' ' + mn[d.getMonth()] + '</button>'); added++; }
    }
    dayHost.innerHTML = chips.join('');

    function gotoStep(n) {
      $$('.modal-steps .st').forEach(function (s, i) { s.classList.toggle('active', i === n - 1); s.classList.toggle('done', i < n - 1); });
      $$('.modal-pane').forEach(function (p) { p.classList.toggle('show', +p.dataset.step === n); });
    }
    dayHost.addEventListener('click', function (e) { var c = e.target.closest('.chip'); if (!c) return; $$('.chip', dayHost).forEach(function (x) { x.classList.remove('sel'); }); c.classList.add('sel'); state.day = c.dataset.day; setTimeout(function () { gotoStep(2); }, 220); });
    $('#demo-times').addEventListener('click', function (e) { var c = e.target.closest('.chip'); if (!c) return; $$('#demo-times .chip').forEach(function (x) { x.classList.remove('sel'); }); c.classList.add('sel'); state.time = c.dataset.time; setTimeout(function () { gotoStep(3); }, 220); });
    $('#demo-form').addEventListener('submit', function (e) { e.preventDefault(); $$('.modal-pane').forEach(function (p) { p.classList.remove('show'); }); $('#demo-success').classList.add('show'); $$('.modal-steps .st').forEach(function (s) { s.classList.add('done'); s.classList.remove('active'); }); });
  })();

})();
