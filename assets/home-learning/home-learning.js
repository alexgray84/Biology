/* Home learning pages · week tabs and copy deterrent.
   The deterrent stops casual select / copy / drag / print. It cannot stop a
   screenshot or a photo, so the tasks themselves are designed to be checked
   by a different, unaided question in class. No pupil data are collected. */
(() => {
  'use strict';
  const root = document.documentElement;
  root.classList.add('hl-guard');

  /* ---- Week tabs (newest week first) ---- */
  const tabs = Array.from(document.querySelectorAll('[role="tab"][data-week]'));
  const panels = Array.from(document.querySelectorAll('.week[data-week]'));
  function show(id, focus) {
    tabs.forEach(t => {
      const on = t.dataset.week === id;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      if (on && focus) t.focus();
    });
    panels.forEach(p => { p.hidden = p.dataset.week !== id; });
  }
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => { show(t.dataset.week, false); history.replaceState(null, '', '#' + t.dataset.week); });
    t.addEventListener('keydown', e => {
      let j = null;
      if (e.key === 'ArrowRight') j = (i + 1) % tabs.length;
      if (e.key === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
      if (e.key === 'Home') j = 0;
      if (e.key === 'End') j = tabs.length - 1;
      if (j !== null) { e.preventDefault(); show(tabs[j].dataset.week, true); }
    });
  });
  if (tabs.length) {
    const wanted = location.hash.slice(1);
    show(tabs.some(t => t.dataset.week === wanted) ? wanted : tabs[0].dataset.week, false);
  }

  /* ---- Copy deterrent ---- */
  const MSG = 'Copying is turned off on home learning pages. Write your answers in your own words in your exercise book.';
  let toast, timer;
  function notify() {
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'hl-toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }
    toast.textContent = MSG;
    toast.classList.add('show');
    clearTimeout(timer);
    timer = setTimeout(() => toast.classList.remove('show'), 2600);
  }
  function clearSelection() {
    const s = window.getSelection && window.getSelection();
    if (s && s.rangeCount && !s.isCollapsed) s.removeAllRanges();
  }
  function onClip(e) {
    e.preventDefault();
    try { e.clipboardData && e.clipboardData.setData('text/plain', MSG); } catch (_) { /* ignore */ }
    clearSelection();
    notify();
  }
  document.addEventListener('copy', onClip, true);
  document.addEventListener('cut', onClip, true);
  document.addEventListener('paste', e => e.preventDefault(), true);
  document.addEventListener('contextmenu', e => { e.preventDefault(); notify(); }, true);
  document.addEventListener('selectstart', e => e.preventDefault(), true);
  document.addEventListener('dragstart', e => e.preventDefault(), true);
  document.addEventListener('selectionchange', clearSelection);
  document.addEventListener('keydown', e => {
    if (!(e.ctrlKey || e.metaKey)) return;
    const k = (e.key || '').toLowerCase();
    if (['c', 'x', 'a', 's', 'p'].includes(k)) { e.preventDefault(); clearSelection(); notify(); }
  }, true);
  window.addEventListener('beforeprint', notify);
})();
