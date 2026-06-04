/* ============================================================
   FrontM scroll-horizon
   A single glowing curved horizon line, fixed to the viewport,
   that rises from the bottom of the screen to the top as the
   page is scrolled. Self-contained: injects its own styles and
   element. Drop into ANY page with one line, just before </body>:

     <script src="site/scroll-horizon.js"></script>
     (adjust the relative path per page, e.g. ../site/...)

   Optional knobs via data-attrs on the <script> tag:
     data-color    accent of the crest      (default #1FE6D4)
     data-glow     glow / bloom colour       (default #01B3F6)
     data-opacity  max opacity 0..1          (default 0.5)
     data-z        z-index                   (default 3)

   Any section that should NOT show the line (because it has its
   own horizon, e.g. the signature transition) gets the attribute
   data-no-horizon, and the line fades out while that section
   dominates the viewport.
   ============================================================ */
(function () {
  if (window.__fmScrollHorizon) return;
  window.__fmScrollHorizon = true;

  var s = document.currentScript || (function () {
    var all = document.getElementsByTagName('script');
    return all[all.length - 1];
  })();
  var d = (s && s.dataset) || {};
  var COLOR = d.color || '#1FE6D4';
  var GLOW = d.glow || '#01B3F6';
  var MAXOP = d.opacity != null ? parseFloat(d.opacity) : 0.5;
  var ZIDX = d.z != null ? d.z : 3;

  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- styles ----
  var css = '' +
    '.fm-horizon{position:fixed;left:50%;top:0;width:260vw;height:100vh;' +
      'transform:translate(-50%,100vh);border-radius:50% 50% 0 0;' +
      'pointer-events:none;z-index:' + ZIDX + ';mix-blend-mode:screen;' +
      'opacity:0;will-change:transform,opacity;' +
      'border-top:1px solid color-mix(in oklch,' + COLOR + ' 58%,transparent);' +
      'box-shadow:0 -16px 70px -28px color-mix(in oklch,' + GLOW + ' 55%,transparent);' +
      'background:radial-gradient(120% 56% at 50% 0%,color-mix(in oklch,' + GLOW + ' 9%,transparent),transparent 58%);}' +
    '.fm-horizon::before{content:"";position:absolute;left:50%;top:-1px;transform:translateX(-50%);' +
      'width:min(640px,52vw);height:1px;border-radius:1px;' +
      'background:radial-gradient(50% 50% at 50% 50%,' + COLOR + ',transparent 80%);' +
      'box-shadow:0 0 16px 1px color-mix(in oklch,' + COLOR + ' 50%,transparent);opacity:.9;}' +
    '@media(prefers-reduced-motion:reduce){.fm-horizon{transition:none;}}';
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  // ---- element ----
  var el = document.createElement('div');
  el.className = 'fm-horizon';
  el.setAttribute('aria-hidden', 'true');
  var mount = function () { (document.body || document.documentElement).appendChild(el); };
  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);

  // ---- scroll → position ----
  var curY = null, curOp = 0;       // smoothed
  var tgtY = 0, tgtOp = 0;

  function compute() {
    var doc = document.documentElement;
    var max = (doc.scrollHeight - window.innerHeight);
    var p = max > 0 ? Math.min(1, Math.max(0, (window.scrollY || doc.scrollTop) / max)) : 0;
    var vh = window.innerHeight;
    // bottom (100vh) at p=0  ->  just past the top (-6vh) at p=1
    tgtY = (1 - p) * vh - p * (vh * 0.06);

    // suppress while a [data-no-horizon] section dominates the viewport centre
    var suppress = 0;
    var blocks = document.querySelectorAll('[data-no-horizon]');
    var midY = vh * 0.5;
    for (var i = 0; i < blocks.length; i++) {
      var r = blocks[i].getBoundingClientRect();
      if (r.top < midY && r.bottom > midY) {
        // how centred the block is → stronger fade near the middle
        var coverage = Math.min(1, (Math.min(r.bottom, vh) - Math.max(r.top, 0)) / vh);
        suppress = Math.max(suppress, coverage);
      }
    }
    tgtOp = MAXOP * (1 - suppress);
  }

  function frame() {
    if (curY === null) curY = tgtY;
    if (reduced) { curY = tgtY; curOp = tgtOp; }
    else {
      curY += (tgtY - curY) * 0.12;
      curOp += (tgtOp - curOp) * 0.12;
    }
    el.style.transform = 'translate(-50%,' + curY.toFixed(1) + 'px)';
    el.style.opacity = curOp.toFixed(3);
    requestAnimationFrame(frame);
  }

  compute();
  window.addEventListener('scroll', compute, { passive: true });
  window.addEventListener('resize', compute, { passive: true });
  requestAnimationFrame(frame);
})();
