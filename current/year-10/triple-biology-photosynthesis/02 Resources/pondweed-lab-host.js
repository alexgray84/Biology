/* Host for the standalone Pondweed lab page. Gives LessonModels.pondweed the same contract as lesson-runtime.js:
   controls(phase, state) / readout(phase, state) rendered into the page; data-action="model" (key=value) and
   data-action="model-cmd" buttons; onChange / command on the module, then instance.update / instance.command;
   mount(host, state, phase, ctx) with ctx.refresh() and ctx.announce(msg); visibility on tab hide; fallback SVG
   re-rendered from the state when WebGL is unavailable. It also fills a raw results table (measurements only:
   no means, totals or graphs). Nothing is stored or transmitted. */
(() => {
  const $ = id => document.getElementById(id);
  const M = window.LessonModels && window.LessonModels.pondweed;
  if (!M) return;
  const clone = o => JSON.parse(JSON.stringify(o || {}));
  const presets = { light: { investigate: 'light' }, co2: { investigate: 'co2', I: 100 }, temperature: { investigate: 'temperature', I: 100 } };
  const hash = location.hash.slice(1);
  const phase = { id: 'pondweed-lab', model: 'pondweed', fallback: 'pondweedFallback', modelState: presets[hash] || presets.light };
  const state = Object.assign({ step: 0 }, clone(M.defaults), clone(phase.modelState));
  let instance = null;

  const parseValue = v => (v === 'true' ? true : v === 'false' ? false : /^-?\d+(\.\d+)?$/.test(v) ? Number(v) : v);
  const fmtC = v => Number(v).toFixed(1);
  const INV = {
    light: { key: 'I', values: [0, 20, 40, 60, 80, 100], head: 'Light intensity / %', show: v => String(v) },
    co2: { key: 'C', values: [0.1, 0.5, 1.0], head: 'NaHCO₃ concentration / %', show: fmtC },
    temperature: { key: 'T', values: [10, 15, 20, 25, 30, 35, 40, 45, 50], head: 'Water-bath temperature / °C', show: v => String(v) }
  };
  const same = (a, b) => Math.round(a * 10) === Math.round(b * 10);

  function table() {
    const inv = INV[state.investigate] || INV.light;
    const others = ['I', 'C', 'T'].filter(k => k !== inv.key);
    const rows = inv.values.map(v => {
      const runs = (state.results || []).filter(r => r.inv === state.investigate && same(r[inv.key], v) && others.every(k => same(r[k], state[k])));
      const cell = n => { const hit = runs.filter(r => r.repeat === n).pop(); return hit ? hit.V.toFixed(1) : ''; };
      return `<tr><th scope="row">${inv.show(v)}</th><td>${cell(1)}</td><td>${cell(2)}</td><td>${cell(3)}</td><td class="calc" aria-label="Calculate the mean in your book"></td></tr>`;
    }).join('');
    const fixed = others.map(k => (k === 'I' ? `light ${state.I} %` : k === 'C' ? `NaHCO₃ ${fmtC(state.C)} %` : `${state.T} °C`)).join(' · ');
    $('results-fixed').textContent = `Fixed conditions: ${fixed}. Simulated data.`;
    $('results-table').innerHTML = `<thead><tr><th scope="col" rowspan="2">${inv.head}</th><th scope="colgroup" colspan="3">Volume of gas collected in 5 min / cm³</th><th scope="col" rowspan="2">Mean / cm³<br><span class="you">you calculate</span></th></tr><tr><th scope="col">Repeat 1</th><th scope="col">Repeat 2</th><th scope="col">Repeat 3</th></tr></thead><tbody>${rows}</tbody>`;
  }
  function refresh(keepFocus = true) {
    const active = document.activeElement;
    const key = active && active.closest && active.closest('#model-controls') && active.dataset.value !== undefined ? `[data-action="${active.dataset.action}"][data-value="${CSS.escape(active.dataset.value)}"]` : null;
    const fb = document.querySelector('#model-view:not(.is-live) .model-fallback');
    if (fb) fb.innerHTML = BioDiagrams.render(phase.fallback, state);
    $('model-readout').innerHTML = M.readout(phase, state);
    $('model-controls').innerHTML = M.controls(phase, state);
    table();
    if (keepFocus && key) { const el = document.querySelector('#model-controls ' + key); if (el && !el.disabled) el.focus({ preventScroll: true }); else if (el) $('model-readout').focus({ preventScroll: true }); }
  }
  const ctx = { refresh: () => refresh(true), announce: msg => { $('status').textContent = msg; } };

  document.addEventListener('click', e => {
    const b = e.target.closest('[data-action]'); if (!b || b.disabled) return;
    const a = b.dataset.action, v = b.dataset.value;
    if (a === 'model') { const i = v.indexOf('='); const k = v.slice(0, i), val = parseValue(v.slice(i + 1)); state[k] = val; if (M.onChange) M.onChange(k, state, phase); }
    else if (a === 'model-cmd') { if (M.command) M.command(v, state, phase); if (instance && instance.command) instance.command(v, state); }
    else return;
    if (instance && instance.update) instance.update(state);
    refresh(true);
  });
  document.addEventListener('visibilitychange', () => { if (instance && instance.visibility) instance.visibility(!document.hidden); });
  window.addEventListener('pagehide', () => { try { instance && instance.dispose && instance.dispose(); } catch (_) {} });

  $('model-view').querySelector('.model-fallback').innerHTML = BioDiagrams.render(phase.fallback, state);
  refresh(false);
  try { instance = M.mount($('model-view'), state, phase, ctx); } catch (err) { instance = null; if (window.console) console.error(err); }
  $('webgl-note').hidden = $('model-view').classList.contains('is-live');
  window.PondweedLab = { state: () => state };
})();
