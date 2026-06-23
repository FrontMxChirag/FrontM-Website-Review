/* ============================================================
   FrontM — Blogs page render (blogs.html)
   Single source: FM.RESOURCES (fm-data.js), filtered to type=='blog'.
   News entries are retained in the array but never rendered here.
   No filter chips — this is the Blogs page, not a hub; each card carries
   its own category label. A featured blog (featured==true) is promoted to
   the hero card. Any «TODO»/empty value is treated as MISSING (typed
   fallback tile, no broken <img>, non-navigating link). British spelling,
   Title Case, no trailing full stops.
   ============================================================ */
(function () {
  var FM = window.FM;
  if (!FM || !FM.RESOURCES) return;
  var grid = document.getElementById('res-grid');
  if (!grid) return;

  var featHost = document.getElementById('res-featured');
  var emptyEl  = document.getElementById('res-empty');

  var TYPES = FM.RES_TYPES || {};
  var BLOGS = FM.RESOURCES.filter(function (i) { return i.type === 'blog'; });

  var todo = function (v) { return !v || (typeof v === 'string' && /TODO/i.test(v)); };
  var esc  = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); };
  var ARROW = '<svg viewBox="0 0 24 24" width="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"></path></svg>';

  function dateVal(d) { if (todo(d)) return -1; var t = Date.parse(d); return isNaN(t) ? -1 : t; }
  function dateLabel(d) {
    var t = Date.parse(d); if (isNaN(t)) return '';
    var dt = new Date(t), mn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return dt.getUTCDate() + ' ' + mn[dt.getUTCMonth()] + ' ' + dt.getUTCFullYear();
  }

  function media(item, meta) {
    if (!todo(item.image)) {
      return '<div class="rc-media" style="background-image:url(\'' + esc(item.image) + '\')"></div>';
    }
    var slug = todo(item.slug) ? '' : '<span class="ph-slug">' + esc(item.slug) + '</span>';
    return '<div class="rc-media rc-media-ph"><span class="ph-type">' + meta.label + '</span>' + slug + '</div>';
  }

  function card(item, featured) {
    var meta = TYPES[item.type] || { label: item.type, c: '#9A86FF' };
    var hasUrl = !todo(item.url);
    var tag = hasUrl ? 'a' : 'article';
    var href = hasUrl ? ' href="' + esc(item.url) + '" target="_blank" rel="noopener"' : '';
    var draft = todo(item.title) || todo(item.dek) || todo(item.date) || !hasUrl;

    var metaBits = ['<span class="rc-type">' + meta.label + '</span>'];
    if (!todo(item.cat))  metaBits.push('<span class="rc-dim">' + esc(item.cat) + '</span>');
    if (!todo(item.date)) metaBits.push('<span class="rc-dim">' + dateLabel(item.date) + '</span>');
    if (draft) metaBits.push('<span class="rc-draft">Draft</span>');

    var title = todo(item.title)
      ? '<h3 class="is-untitled">Awaiting title</h3>'
      : '<h3>' + esc(item.title) + '</h3>';
    var dek = todo(item.dek) ? '' : '<p class="rc-dek">' + esc(item.dek) + '</p>';
    var author = todo(item.author) ? 'FrontM Team' : esc(item.author);
    var foot = hasUrl
      ? '<span class="rc-author">' + author + '</span><span class="rc-link">Read article ' + ARROW + '</span>'
      : '<span class="rc-author">' + author + '</span><span class="rc-pending">Link pending</span>';

    var flag = featured ? '<span class="rc-flag">Featured</span>' : '';
    var cls = 'res-card' + (featured ? ' is-featured' : '');

    return '<' + tag + ' class="' + cls + '"' + href + ' style="--cc:' + meta.c + '">' +
      media(item, meta) +
      '<div class="rc-body">' + flag +
        '<div class="rc-meta">' + metaBits.join('') + '</div>' +
        title + dek +
        '<div class="rc-foot">' + foot + '</div>' +
      '</div>' +
    '</' + tag + '>';
  }

  // sort newest first; undated (TODO) last, stable by id
  var list = BLOGS.slice().sort(function (a, b) {
    var dv = dateVal(b.date) - dateVal(a.date);
    return dv !== 0 ? dv : (a.id - b.id);
  });

  if (!list.length) {
    grid.innerHTML = '';
    if (featHost) featHost.innerHTML = '';
    if (emptyEl) { emptyEl.hidden = false; emptyEl.textContent = 'No blogs here yet — new posts land here as they publish.'; }
    return;
  }
  if (emptyEl) emptyEl.hidden = true;

  // promote a featured blog to the hero card; the rest fall into the grid
  var feat = list.filter(function (i) { return i.featured && !todo(i.title); })[0] || null;
  if (featHost) featHost.innerHTML = feat ? card(feat, true) : '';
  var rest = feat ? list.filter(function (i) { return i !== feat; }) : list;
  grid.innerHTML = rest.map(function (i) { return card(i, false); }).join('');
})();
