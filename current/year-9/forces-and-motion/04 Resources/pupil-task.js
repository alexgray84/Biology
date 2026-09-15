(() => {
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  const panels = [...document.querySelectorAll('[role="tabpanel"]')];
  function show(id, focus = false) {
    const target = panels.find(p => p.id === id) || panels[0];
    panels.forEach(p => { p.hidden = p !== target; });
    tabs.forEach(t => { const selected = t.getAttribute('aria-controls') === target.id; t.setAttribute('aria-selected', String(selected)); t.tabIndex = selected ? 0 : -1; if (focus && selected) t.focus(); });
  }
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => { const id = t.getAttribute('aria-controls'); history.replaceState(null, '', '#' + id); show(id); });
    t.addEventListener('keydown', e => { if (!['ArrowRight','ArrowLeft','Home','End'].includes(e.key)) return; e.preventDefault(); const next = e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : (i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length; const id = tabs[next].getAttribute('aria-controls'); history.replaceState(null, '', '#' + id); show(id, true); });
  });
  addEventListener('hashchange', () => show(location.hash.slice(1)));
  document.querySelector('[data-print]')?.addEventListener('click', () => print());
  show(location.hash.slice(1));
})();
