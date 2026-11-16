/* Arcadia Future Week: year-group band (Years 3–4, 5–6, 7–9 or 10–11; 'sec' when none is chosen).
   Years 7–9 and 10–11 share the secondary wording and differ only in which activities are listed.
   Loads after data.js and bands.js. Swaps in the band's wording; tasks, steps and minutes stay the same. */
(function () {
  var D = window.AFW, B = window.AFW_BANDS || {}, b = null;
  try { b = new URLSearchParams(location.search).get('band'); } catch (e) { b = null; }
  if (!b) { try { b = localStorage.getItem('afw-band'); } catch (e) { b = null; } }
  var SECONDARY = { y79: { label: 'Years 7–9', years: [7, 9] }, y1011: { label: 'Years 10–11', years: [10, 11] } };
  if (b !== 'y34' && b !== 'y56' && !SECONDARY[b]) { b = 'sec'; }
  if ((b === 'y34' || b === 'y56') && !B[b]) { b = 'sec'; }
  window.AFW_BAND = b;
  window.AFW_PRIMARY = b === 'y34' || b === 'y56';
  window.AFW_BAND_LABEL = b === 'sec' ? 'Years 7–11' : SECONDARY[b] ? SECONDARY[b].label : B[b].label;
  window.AFW_BAND_YEARS = SECONDARY[b] ? SECONDARY[b].years : null;

  /* activities a grown-up should lead for this age (reviewers' advice) */
  var LEAD = { y34: ['L50', 'T50', 'I50', 'F20', 'F50', 'B50'], y56: ['I50', 'F20', 'F50'] };
  var TEXT = ['title', 'blurb', 'from', 'drop', 'example', 'make', 'checklist', 'model', 'support', 'stretch', 'fewer', 'rules', 'group', 'kit', 'cards', 'cards2', 'cards3'];
  if (D && window.AFW_PRIMARY) {
    var X = B[b];
    Object.keys(X.acts).forEach(function (id) {
      var a = D.acts[id], o = X.acts[id]; if (!a) { return; }
      TEXT.forEach(function (k) { if (o[k] !== undefined) { a[k] = o[k]; } });
      a.steps = a.steps.map(function (s, i) { var n = o.steps[i] || s; return { m: s.m, who: s.who, t: n.t, d: n.d }; });
      a.years = X.years.slice();
      if (a.comp) { a.comp = X.label; }
      if (LEAD[b].indexOf(id) !== -1) { a.adultLed = true; }
      if (a.stretchAI) { delete a.stretchAI; }
      if (o.paragraph) { D.paragraph = { html: o.paragraph }; }
    });
    D.competition.routes.forEach(function (r) { r.band = X.label; });
  }

  window.afwSetBand = function (nb) {
    try { localStorage.setItem('afw-band', nb); } catch (e) { /* not stored */ }
    var u = new URL(location.href);
    if (nb === 'sec') { u.searchParams.delete('band'); } else { u.searchParams.set('band', nb); }
    location.href = u.pathname + u.search + (u.hash || '');
  };
  /* keep the band when moving between pages */
  window.afwLinks = function () {
    if (b === 'sec') { return; }
    document.querySelectorAll('a[href]').forEach(function (el) {
      var h = el.getAttribute('href');
      if (!/^(index|activity|enter|entry-slips)\.html/.test(h) || /[?&]band=/.test(h)) { return; }
      var hash = '', i = h.indexOf('#'); if (i !== -1) { hash = h.slice(i); h = h.slice(0, i); }
      el.setAttribute('href', h + (h.indexOf('?') === -1 ? '?' : '&') + 'band=' + b + hash);
    });
  };
})();
