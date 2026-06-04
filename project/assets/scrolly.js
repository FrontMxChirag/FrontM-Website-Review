// FrontM, scroll-driven Problem → Solution sequence
// Scattered "fragmented" nodes converge into the FrontM mark and bloom into the
// module + stakeholder network as the card text changes problem -> solution.
(function () {
  var sec = document.getElementById('scrolly');
  if (!sec) return;
  var field = sec.querySelector('.node-field');
  var eco   = sec.querySelector('.eco');
  var mark  = sec.querySelector('.frontm-mark');
  var cardP = sec.querySelector('.card-problem');
  var cardS = sec.querySelector('.card-solution');

  var COLORS = ['#2ff0ea','#3f86ff','#36e08a','#ff9d4d','#a78bfa','#f06bd0','#ffd24d','#5eead4'];

  // deterministic pseudo-random so layout is stable across loads
  var seed = 9;
  function rnd(){ seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }

  function clamp(x){ return x < 0 ? 0 : x > 1 ? 1 : x; }
  function smooth(a,b,x){ var t = clamp((x-a)/(b-a)); return t*t*(3-2*t); }
  function lerp(a,b,t){ return a + (b-a)*t; }

  // ---- scattered dots ----
  var N = 24, dots = [];
  for (var i=0;i<N;i++){
    var d = document.createElement('span'); d.className = 'dot';
    var c = COLORS[i % COLORS.length];
    var sz = 6 + rnd()*9;
    d.style.cssText = 'width:'+sz+'px;height:'+sz+'px;background:'+c+';box-shadow:0 0 12px '+c+';';
    field.appendChild(d);
    // scatter across the stage, biased away from dead centre
    var sx = 6 + rnd()*88, sy = 10 + rnd()*80;
    var ga = rnd()*Math.PI*2, gr = rnd()*8;
    dots.push({ el:d, sx:sx, sy:sy, gx:50+Math.cos(ga)*gr, gy:50+Math.sin(ga)*gr });
  }

  // ---- ecosystem network ----
  var CATS = [['CONNECT','#3f86ff'],['ENGAGE','#36e08a'],['CARE','#2ff0ea'],['ENTERTAIN','#ff9d4d'],['INFORM','#ffd24d'],['TRAIN','#a78bfa'],['MAINTAIN','#f06bd0']];
  var STK  = ['Ship Owners','Ship Managers','Class Societies','Crew Manning','Ports & Authorities','Charterers','Insurers','Regulators','Engine OEMs','Service Providers','Brokers','Surveyors'];

  // line icons for each stakeholder in the outer ring
  function ico(p){ return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">'+p+'</svg>'; }
  var ICON_MAP = {
    'Ship Owners':       '<path d="M4 15h16l-2 5H6z"/><path d="M12 3v12"/><path d="M12 6l6 3-6 1z"/>',
    'Ship Managers':     '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4h6v3H9z"/><path d="M8.5 12l2 2 4-4"/>',
    'Class Societies':   '<path d="M12 3l7 3v5c0 4-3 7-7 9-4-2-7-5-7-9V6z"/><path d="M9 12l2 2 4-4"/>',
    'Crew Manning':      '<circle cx="9" cy="9" r="3"/><path d="M3.5 20c0-3 2.7-5 5.5-5s5.5 2 5.5 5"/><path d="M16 7a3 3 0 010 6"/><path d="M20.5 20c0-2.3-1.4-3.9-3.5-4.6"/>',
    'Ports & Authorities':'<circle cx="12" cy="4" r="2"/><path d="M12 6v14"/><path d="M9 9l3-3 3 3"/><path d="M8 11H5c0 5 3 8 7 8s7-3 7-8h-3"/>',
    'Charterers':        '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/><path d="M9 12h6M9 16h6"/>',
    'Insurers':          '<path d="M12 3v2"/><path d="M3 12a9 9 0 0118 0z"/><path d="M12 12v6a2 2 0 01-4 0"/>',
    'Regulators':        '<path d="M12 4v16"/><path d="M7 20h10"/><path d="M4 8h16"/><path d="M4 8l-2.2 5a3 3 0 006.4 0z"/><path d="M20 8l-2.2 5a3 3 0 006.4 0z"/>',
    'Engine OEMs':       '<circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.2 5.2l2 2M16.8 16.8l2 2M18.8 5.2l-2 2M7.2 16.8l-2 2"/>',
    'Service Providers': '<path d="M14.7 6.3a4 4 0 00-5.6 5.6L3 18v3h3l6.1-6.1a4 4 0 005.6-5.6l-2.9 2.9-2-2 2.9-2.9Z"/>',
    'Brokers':           '<path d="M4 18l5-5 3 3 7-7"/><path d="M15 9h5v5"/>',
    'Surveyors':         '<circle cx="11" cy="11" r="6"/><path d="M15.5 15.5L20 20"/><path d="M11 8.5v5M8.5 11h5"/>'
  };
  function ICONS(name){ return ico(ICON_MAP[name] || '<circle cx="12" cy="12" r="8"/>'); }

  function ring(list, radius, cls, startDeg){
    for (var i=0;i<list.length;i++){
      var ang = (startDeg + i/list.length*360) * Math.PI/180;
      var x = Math.cos(ang)*radius, y = Math.sin(ang)*radius;     // vmin
      var spoke = document.createElement('div'); spoke.className = 'spoke';
      spoke.style.width = radius + 'vmin';
      spoke.style.setProperty('--ang', (ang*180/Math.PI) + 'deg');
      eco.appendChild(spoke);
      var node = document.createElement('div'); node.className = cls;
      node.style.left = 'calc(50% + ' + x + 'vmin)';
      node.style.top  = 'calc(59% + ' + y + 'vmin)';
      if (cls === 'cat-node'){
        node.style.setProperty('--cc', list[i][1]);
        node.innerHTML = '<span class="d" style="background:'+list[i][1]+'"></span>' + list[i][0];
      } else {
        node.innerHTML = ICONS(list[i]) + '<span>' + list[i] + '</span>';
      }
      eco.appendChild(node);
    }
  }
  ring(CATS, 21, 'cat-node', -90);
  ring(STK, 35, 'stk-node', -90 + 15);

  // ---- scroll driver ----
  var ticking = false;
  function update(){
    ticking = false;
    var r = sec.getBoundingClientRect();
    var total = sec.offsetHeight - window.innerHeight;
    var p = total > 0 ? clamp(-r.top / total) : 0;

    var gather = smooth(0.04, 0.50, p);
    var dotFade = 1 - smooth(0.44, 0.60, p);
    for (var i=0;i<dots.length;i++){
      var dt = dots[i];
      var x = lerp(dt.sx, dt.gx, gather), y = lerp(dt.sy, dt.gy, gather);
      dt.el.style.left = x + '%'; dt.el.style.top = y + '%';
      dt.el.style.opacity = dotFade;
    }

    // mark forms in the centre
    var m = smooth(0.40, 0.60, p);
    mark.style.opacity = m;
    mark.style.transform = 'translate(-50%,-50%) scale(' + lerp(0.45,1,m) + ') rotate(' + lerp(-12,0,m) + 'deg)';

    // network blooms
    eco.style.setProperty('--g', smooth(0.54, 0.92, p).toFixed(3));

    // card crossfade: problem (centre) -> solution (top)
    var pf = 1 - smooth(0.30, 0.44, p);
    var sf = smooth(0.46, 0.60, p);
    cardP.style.opacity = pf; cardP.style.pointerEvents = pf > 0.5 ? 'auto':'none';
    cardP.style.transform = 'translate(-50%,-50%) translateY(' + lerp(0,-24,1-pf) + 'px)';
    cardS.style.opacity = sf; cardS.style.pointerEvents = sf > 0.5 ? 'auto':'none';
    cardS.style.transform = 'translate(-50%,0) translateY(' + lerp(24,0,sf) + 'px)';
  }
  function onScroll(){ if (!ticking){ ticking = true; requestAnimationFrame(update); } }

  window.addEventListener('scroll', onScroll, { passive:true });
  window.addEventListener('resize', onScroll, { passive:true });
  update();
  setTimeout(update, 200);
})();
