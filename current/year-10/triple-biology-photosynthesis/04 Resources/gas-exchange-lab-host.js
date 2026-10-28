/* Host for Gas exchange lab.html. Owns the page state, the predict-first gates, the clock and the panel.
   Predictions, reasons and the explanation stay in this page's memory only: nothing is stored or transmitted.
   The page never writes a conclusion: it shows each tube's colour (with a text label), the illustrative CO2 level
   and the two process rates as separate bars. Pupils compare them. */
(() => {
  'use strict';
  const M = window.GasExchangeModel, V = window.GasExchangeView;
  if (!M || !V) return;
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const CHOICES = [['yellow', 'Yellow (CO₂ raised)'], ['orange-red', 'Orange-red (about the same)'], ['purple', 'Purple (CO₂ reduced)']];
  const SPEEDS = [1, 2, 5];
  const MIN_REASON = 8;

  const S = { t: 0, playing: false, speed: 2, dimLayers: M.PARAMS.DIM_DEFAULT, preds: {}, drafts: {}, reached60: false, transferId: null, explain: '', lastTick: 0 };

  const tubes = () => { const b = M.baseTubes(S.dimLayers); const x = S.transferId ? M.transferTube(S.transferId) : null; return x ? b.concat([x]) : b; };
  const revealed = tb => !!S.preds[tb.key];
  const allPredicted = () => tubes().every(revealed);
  const baseDone = () => M.baseTubes(S.dimLayers).every(revealed);
  const transferOpen = () => baseDone() && S.reached60;
  const fmt = (v, d = 1) => Number(v).toFixed(d);
  const announce = msg => { $('status').textContent = ''; setTimeout(() => { $('status').textContent = msg; }, 30); };

  /* ---------- rendering ---------- */
  function predForm(tb) {
    const d = S.drafts[tb.key] || {};
    const name = `pred-${tb.key}`;
    return `<fieldset class="pred" aria-describedby="${name}-help"><legend>Predict tube ${esc(tb.letter)} at 60 min</legend>
      <div class="choices">${CHOICES.map(([v, l]) => `<label class="choice"><input type="radio" name="${name}" value="${v}" data-draft="${esc(tb.key)}" data-field="colour"${d.colour === v ? ' checked' : ''}><span class="sw sw-${v}" aria-hidden="true"></span>${l}</label>`).join('')}</div>
      <label class="reason-label" for="${name}-reason">Because… (your reason)</label>
      <input id="${name}-reason" class="reason" type="text" autocomplete="off" maxlength="240" data-draft="${esc(tb.key)}" data-field="reason" value="${esc(d.reason || '')}">
      <p class="help" id="${name}-help">Choose a colour and write a reason (at least ${MIN_REASON} characters). The result stays hidden until you save.</p>
      <button type="button" class="is-primary" data-cmd="save" data-key="${esc(tb.key)}">Save prediction for ${esc(tb.letter)}</button></fieldset>`;
  }
  function card(tb) {
    const p = S.preds[tb.key];
    let h = `<article class="tube-card${tb.transfer ? ' is-transfer' : ''}" aria-labelledby="h-${tb.key}"><h3 id="h-${tb.key}"><span class="letter">${esc(tb.letter)}</span> ${esc(tb.name)}</h3><p class="setup">${esc(tb.setup)}</p>`;
    if (tb.id === 'dim') {
      h += `<div class="seg" role="group" aria-label="Muslin layers on tube B"><span class="seg-label">Muslin</span>${Object.keys(M.PARAMS.DIM_LEVELS).map(L => `<button type="button" data-cmd="dim" data-value="${L}" aria-pressed="${Number(L) === S.dimLayers}"${S.playing ? ' disabled' : ''}>${L} layer${L > 1 ? 's' : ''}</button>`).join('')}</div>`;
    }
    if (!p) return h + predForm(tb) + '</article>';
    h += `<p class="mine"><b>Your prediction:</b> ${esc((CHOICES.find(c => c[0] === p.colour) || [0, ''])[1])}. <span class="why">“${esc(p.reason)}”</span></p>`;
    h += `<div class="result" data-live="${esc(tb.key)}"></div>`;
    return h + '</article>';
  }
  function liveResult(tb) {
    const r = M.ratesAt(tb.cond, S.t), band = M.indicatorBand(r.C), hex = M.indicatorColour(r.C);
    const max = 50, pct = v => Math.min(100, (v / max) * 100);
    return `<div class="obs"><span class="swatch" style="background:${hex}" aria-hidden="true"></span><span><b>Indicator now: ${band.name}</b> <span class="meaning">(${band.meaning})</span><br><span class="co2">Tube CO₂: ${fmt(r.C, 0)} illustrative ppm · start 400 · light ${fmt(r.I, 0)} %</span></span></div>
      <div class="bars" role="group" aria-label="Process rates in tube ${esc(tb.letter)} at ${Math.floor(S.t)} minutes">
        <div class="bar-row"><span class="bar-name">Respiration <small>releases CO₂ ↑</small></span><span class="bar-track"><span class="bar bar-r" style="width:${pct(r.respiration)}%"></span></span><span class="bar-val">${fmt(r.respiration)}</span></div>
        <div class="bar-row"><span class="bar-name">Photosynthesis <small>uses CO₂ ↓</small></span><span class="bar-track"><span class="bar bar-p" style="width:${pct(r.photosynthesis)}%"></span></span><span class="bar-val">${fmt(r.photosynthesis)}</span></div>
        <p class="bar-unit">Rates in illustrative ppm of CO₂ per simulated minute, at ${Math.floor(S.t)} min.</p>
      </div>`;
  }
  function clockHTML() {
    const can = allPredicted(), done = S.t >= M.PARAMS.T_END - 1e-9;
    const waiting = tubes().filter(tb => !revealed(tb)).map(tb => tb.letter).join(', ');
    return `<div class="clock-row"><span class="clock" id="clock-text">${Math.floor(S.t)} of 60 min</span><span class="sim-tag">simulated time</span></div>
      <div class="seg" role="group" aria-label="Clock controls">
        <button type="button" class="is-primary" data-cmd="play"${!can || done ? ' disabled' : ''} aria-describedby="gate-note">${S.playing ? 'Pause' : S.t > 0 ? 'Resume' : 'Start'}</button>
        <button type="button" data-cmd="step"${!can || done || S.playing ? ' disabled' : ''}>+5 min</button>
        <button type="button" data-cmd="reset"${S.t === 0 && !S.playing ? ' disabled' : ''}>Reset to 0 min</button>
      </div>
      <div class="seg" role="group" aria-label="Speed"><span class="seg-label">Speed</span>${SPEEDS.map(v => `<button type="button" data-cmd="speed" data-value="${v}" aria-pressed="${S.speed === v}">${v} min/s</button>`).join('')}</div>
      <p class="gate" id="gate-note">${can ? (done ? '60 minutes reached. Reset to watch again.' : 'Predictions saved. You can run the clock.') : `The clock is locked until you predict tube${waiting.length > 1 ? 's' : ''} ${waiting}.`}</p>`;
  }
  function transferHTML() {
    if (!transferOpen()) return `<p class="locked">Locked: predict and observe all four tubes to 60 minutes first.</p>`;
    const list = M.TRANSFER;
    let h = `<p>Choose a new condition. Predict its colour at 60 minutes before it appears on the rack as tube 5.</p><div class="seg wrap" role="group" aria-label="New condition">${list.map(x => `<button type="button" data-cmd="transfer" data-value="${x.id}" aria-pressed="${S.transferId === x.id}"${S.playing ? ' disabled' : ''}>${esc(x.name)}</button>`).join('')}</div>`;
    if (S.transferId) h += `<p class="note">Changing the set-up resets the clock to 0 min.</p>`;
    return h;
  }
  function render() {
    const active = document.activeElement, focusKey = active && active.dataset ? (active.id || (active.dataset.cmd ? `${active.dataset.cmd}|${active.dataset.value || active.dataset.key || ''}` : '')) : '';
    $('clock').innerHTML = clockHTML();
    $('cards').innerHTML = tubes().map(card).join('');
    $('transfer').innerHTML = transferHTML();
    $('explain-box').hidden = !S.reached60;
    updateLive();
    if (focusKey) {
      let el = document.getElementById(focusKey);
      if (!el) { const [c, v] = focusKey.split('|'); el = document.querySelector(`[data-cmd="${c}"]${v ? `[data-value="${CSS.escape(v)}"],[data-cmd="${c}"][data-key="${CSS.escape(v)}"]` : ''}`); }
      if (el && !el.disabled) el.focus({ preventScroll: true });
      else if (el && el.disabled) $('clock').querySelector('button:not([disabled])')?.focus({ preventScroll: true });
    }
  }
  function updateLive() {
    const ct = $('clock-text'); if (ct) ct.textContent = `${Math.floor(S.t)} of 60 min`;
    tubes().forEach(tb => { const el = document.querySelector(`[data-live="${CSS.escape(tb.key)}"]`); if (el) el.innerHTML = liveResult(tb); });
    if (view) view.sync(tubes(), S.t, revealed);
    else $('fallback').innerHTML = V.fallbackSVG(tubes(), S.t, revealed);
  }
  function stateSentence() {
    const parts = tubes().filter(revealed).map(tb => { const C = M.co2At(tb.cond, S.t); return `tube ${tb.letter} ${tb.name.toLowerCase()}: ${M.indicatorBand(C).name}`; });
    return `${Math.floor(S.t)} minutes. ${parts.join('; ')}.`;
  }

  /* ---------- clock ---------- */
  let raf = 0;
  function loop(now) {
    raf = 0; if (!S.playing) return;
    const dt = S.lastTick ? Math.min(0.25, (now - S.lastTick) / 1000) : 0; S.lastTick = now;
    const before = Math.floor(S.t / 10);
    S.t = Math.min(M.PARAMS.T_END, S.t + dt * S.speed);
    if (S.t >= M.PARAMS.T_END) { S.t = M.PARAMS.T_END; S.playing = false; finishRun(); return; }
    if (Math.floor(S.t / 10) !== before) announce(stateSentence());
    updateLive();
    raf = requestAnimationFrame(loop);
  }
  function finishRun() {
    const first = !S.reached60; S.reached60 = true; render();
    announce(`${stateSentence()} Sixty minutes reached. Compare each tube with your prediction.${first ? ' The explain-it prompt and new condition are now open.' : ''}`);
  }
  function setPlaying(on) {
    S.playing = on && allPredicted() && S.t < M.PARAMS.T_END;
    S.lastTick = 0; cancelAnimationFrame(raf); raf = 0;
    if (S.playing) raf = requestAnimationFrame(loop);
  }
  function resetClock() { setPlaying(false); S.t = 0; }

  /* ---------- events ---------- */
  document.addEventListener('input', e => {
    const el = e.target; if (!el.dataset || !el.dataset.draft) { if (el.id === 'explain') S.explain = el.value; return; }
    const k = el.dataset.draft; S.drafts[k] = S.drafts[k] || {}; S.drafts[k][el.dataset.field] = el.value;
  });
  document.addEventListener('change', e => { const el = e.target; if (el.dataset && el.dataset.draft && el.type === 'radio') { const k = el.dataset.draft; S.drafts[k] = S.drafts[k] || {}; S.drafts[k].colour = el.value; } });
  document.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.classList && e.target.classList.contains('reason')) { e.preventDefault(); const b = e.target.closest('fieldset').querySelector('[data-cmd="save"]'); if (b) b.click(); } });
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-cmd]'); if (!b || b.disabled) return;
    const c = b.dataset.cmd, v = b.dataset.value;
    if (c === 'save') {
      const k = b.dataset.key, d = S.drafts[k] || {}, tb = tubes().find(x => x.key === k);
      if (!d.colour || !d.reason || d.reason.trim().length < MIN_REASON) {
        const fs = b.closest('fieldset'), help = fs.querySelector('.help');
        help.textContent = !d.colour ? 'Choose a colour first.' : `Add a reason of at least ${MIN_REASON} characters: why do you expect that colour?`;
        help.classList.add('is-error'); announce(help.textContent);
        (d.colour ? fs.querySelector('.reason') : fs.querySelector('input[type=radio]')).focus();
        return;
      }
      S.preds[k] = { colour: d.colour, reason: d.reason.trim() };
      render();
      const next = document.querySelector('.pred input[type=radio]');
      announce(`Prediction saved for tube ${tb.letter}. ${allPredicted() ? 'All predictions saved: the clock is unlocked.' : ''}`);
      if (next) next.focus({ preventScroll: true }); else { const p = document.querySelector('[data-cmd="play"]:not([disabled])'); if (p) p.focus({ preventScroll: true }); }
      return;
    }
    if (c === 'play') { setPlaying(!S.playing); announce(S.playing ? `Clock running at ${S.speed} simulated minutes per second.` : `Paused. ${stateSentence()}`); }
    else if (c === 'step') { S.t = Math.min(M.PARAMS.T_END, S.t + 5); if (S.t >= M.PARAMS.T_END) { finishRun(); return; } announce(stateSentence()); }
    else if (c === 'reset') { resetClock(); announce('Clock reset to 0 minutes.'); }
    else if (c === 'speed') { S.speed = Number(v); S.lastTick = 0; announce(`Speed ${v} simulated minutes per second.`); }
    else if (c === 'dim') { if (Number(v) !== S.dimLayers) { S.dimLayers = Number(v); resetClock(); const tb = M.baseTubes(S.dimLayers)[1]; announce(`Tube B now has ${v} muslin layer${v > 1 ? 's' : ''}. Clock reset. ${revealed(tb) ? '' : 'Predict tube B for this set-up before the clock unlocks.'}`); } }
    else if (c === 'transfer') { S.transferId = v; resetClock(); const tb = M.transferTube(v); announce(`New condition: ${tb.name}. Clock reset. ${revealed(tb) ? '' : 'Predict tube E before the clock unlocks.'}`); }
    else return;
    render();
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden && S.playing) { setPlaying(false); render(); } });

  /* ---------- mount ---------- */
  let view = null;
  try { view = V.mountView($('model-view')); } catch (err) { view = null; if (window.console) console.error(err); }
  $('webgl-note').hidden = !!view;
  if (!view) $('model-view').classList.add('is-fallback');
  window.addEventListener('pagehide', () => { try { view && view.dispose(); } catch (_) {} });
  render();

  /* QA hook: read-only snapshot of the page state (no pupil text leaves the page) */
  window.GasExchangeLab = Object.freeze({
    state: () => ({ t: S.t, playing: S.playing, speed: S.speed, dimLayers: S.dimLayers, reached60: S.reached60, transferId: S.transferId, predicted: Object.keys(S.preds), webgl: !!view }),
    tubes: () => tubes().map(tb => { const C = M.co2At(tb.cond, S.t); return { key: tb.key, revealed: revealed(tb), co2: C, colour: M.indicatorColour(C), band: M.indicatorBand(C).name }; })
  });
})();
