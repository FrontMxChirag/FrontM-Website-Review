// FrontM, shared interactions for all directions
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- reveal on scroll (rect-based; robust in preview/screenshot environments) ----
  var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  function checkReveal() {
    var vh = window.innerHeight || document.documentElement.clientHeight;
    for (var i = reveals.length - 1; i >= 0; i--) {
      var el = reveals[i];
      var r = el.getBoundingClientRect();
      if (r.top < vh * 0.92 && r.bottom > 0) {
        el.classList.add('in');
        reveals.splice(i, 1);
      }
    }
  }
  // safety net: if a frozen/throttled timeline never advances the entrance
  // animation, neutralize it and force the visible end-state so content is
  // never stranded at its hidden start frame.
  function revealAll() {
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('in');
      el.style.animation = 'none';
      el.style.transition = 'none';
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }

  // ---- nav scrolled state + sticky CTA ----
  var nav = document.querySelector('.nav');
  var sticky = document.querySelector('.sticky-cta');
  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop || 0;
    if (nav) nav.classList.toggle('scrolled', y > 24);
    if (sticky) sticky.classList.toggle('show', y > 720);
    checkReveal();
  }

  onScroll();
  checkReveal();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', checkReveal, { passive: true });
  window.addEventListener('load', checkReveal);
  // settle passes (covers async layout/fonts and flaky observers)
  setTimeout(checkReveal, 150);
  setTimeout(checkReveal, 600);
  setTimeout(revealAll, 1600);

  // ---- subtle pointer-reactive glow ----
  var reactive = document.querySelector('[data-reactive]');
  if (reactive && !reduce) {
    var rx = 50, ry = 50, tx = 50, ty = 50, raf = null;
    window.addEventListener('pointermove', function (ev) {
      tx = (ev.clientX / window.innerWidth) * 100;
      ty = (ev.clientY / window.innerHeight) * 100;
      if (!raf) raf = requestAnimationFrame(loop);
    }, { passive: true });
    function loop() {
      rx += (tx - rx) * 0.06; ry += (ty - ry) * 0.06;
      reactive.style.setProperty('--mx', rx.toFixed(2) + '%');
      reactive.style.setProperty('--my', ry.toFixed(2) + '%');
      if (Math.abs(tx - rx) > 0.1 || Math.abs(ty - ry) > 0.1) { raf = requestAnimationFrame(loop); }
      else { raf = null; }
    }
  }
})();
