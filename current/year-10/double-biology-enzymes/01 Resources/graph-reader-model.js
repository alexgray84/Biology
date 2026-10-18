/* Lesson 01 · Digestive-enzyme graphs — interactive graph reader (LessonModels.graphReader).
   An original 2D canvas drawing of the illustrative amylase rate–temperature graph (no Three.js needed: a flat graph is
   clearer than 3D here). Pupils drag or tap along the graph, use the slider, or press ← / →: a ruled line goes up from the
   chosen temperature to the curve and across to the rate axis, the gold band shows one labelled interval (4 small squares,
   each 0.0005 s⁻¹) and the readout states the value with its unit. The curve values come from BioDiagrams.amylaseRate, the
   same curve the static figures draw. No network, no storage, no animation loop (it redraws only on change).
   State: temp (10–60 °C, whole degrees) · guide 0 axes · 1 one small square · 2 ruled lines · 3 value with unit · 4 rate = 1 ÷ time
   touched (true once the pupil moves the reader: lines and value then always show). */
window.LessonModels = window.LessonModels || {};
window.LessonModels.graphReader = (() => {
  const C = { navy: '#182944', gold: '#bd8126', goldText: '#8a5a14', grid: '#d9d2c1', line: '#b9b09c', paper: '#fbf8f0', rose: '#ad5c63', band: 'rgba(189,129,38,0.16)' };
  const TIMES = { 10: 450, 20: 240, 30: 150, 40: 90, 50: 180 };   // illustrative end-point times (s)
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const num = (v, d) => (Number.isFinite(+v) ? +v : d);
  const rateAt = t => (window.BioDiagrams && BioDiagrams.amylaseRate ? BioDiagrams.amylaseRate(t) : 0);
  const sf2 = v => (v < 0.00005 ? '0' : v.toPrecision(2));
  const tempOf = s => Math.round(clamp(num(s.temp, 30), 10, 60));
  const showLines = s => s.touched || num(s.guide, 0) >= 2;
  const showValue = s => s.touched || num(s.guide, 0) >= 3;
  const valueText = t => (t >= 60 ? 'about 0 (no end-point)' : `about ${sf2(rateAt(t))} s⁻¹`);

  const row = (k, v) => `<p><span class="readout-key">${k}</span><span class="readout-value">${v}</span></p>`;
  function readout(p, s) {
    const t = tempOf(s), g = num(s.guide, 0);
    if (!s.touched && g === 0) return row('Step 1 · axes', 'Across: temperature / °C. Up: rate / s⁻¹.');
    if (!s.touched && g === 1) return row('Step 2 · one small square', '(0.004 − 0.002) ÷ 4 = 0.0005 s⁻¹');
    if (!s.touched && g === 2) return row(`Reading at ${t} °C`, 'Up to the curve, then across to the rate axis.');
    const calc = TIMES[t] && (g === 4 || s.touched) ? ` End-point ${TIMES[t]} s: 1 ÷ ${TIMES[t]} = ${sf2(1 / TIMES[t])} s⁻¹.` : '';
    return row(`Reading at ${t} °C`, `Rate ${valueText(t)}.${calc}`);
  }
  function controls(p, s) {
    const t = tempOf(s);
    return `<div class="control-group"><input type="range" min="10" max="60" step="1" value="${t}" data-model-key="temp" aria-label="Temperature to read" aria-valuetext="${t} °C" style="min-width:160px;height:48px"><output data-for="temp" style="min-width:3.4em">${t} °C</output></div>`;
  }
  function onChange(key, s) {
    if (key === 'temp') {
      s.temp = tempOf(s); s.touched = true;
      const o = document.querySelector('#model-controls output[data-for="temp"]'), r = document.querySelector('#model-controls input[data-model-key="temp"]');
      if (o) o.textContent = `${s.temp} °C`; if (r) r.setAttribute('aria-valuetext', `${s.temp} °C`);
    }
  }
  const aria = s => { const t = tempOf(s); return `Graph of amylase rate against temperature, illustrative data. ${showLines(s) ? `A ruled line goes up from ${t} °C to the curve and across: the rate is ${valueText(t)}.` : 'One small square is 0.0005 per second.'} Drag, tap or use the left and right arrow keys to choose a temperature.`; };

  function mount(host, state, phase, ctx) {
    const canvas = document.createElement('canvas'), g = canvas.getContext && canvas.getContext('2d');
    if (!g) return null;
    host.appendChild(canvas); host.classList.add('is-live');
    canvas.tabIndex = 0; canvas.setAttribute('role', 'img');
    let W = 0, H = 0, box = null, dragging = false;
    function layout() {
      const r = host.getBoundingClientRect(); if (!r.width || !r.height) return false;
      W = r.width; H = r.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); g.setTransform(dpr, 0, 0, dpr, 0, 0);
      const fs = W < 480 ? 13 : 15;
      box = { fs, x0: fs * 4.6, x1: W - 14, y0: H - fs * 3.2, y1: fs * 1.6 };
      return true;
    }
    const X = t => box.x0 + (t / 70) * (box.x1 - box.x0), Y = r => box.y0 - (r / 0.012) * (box.y0 - box.y1);
    const T = x => clamp(Math.round(((x - box.x0) / (box.x1 - box.x0)) * 70), 10, 60);
    function text(str, x, y, o = {}) { g.font = `${o.weight || 600} ${o.size || box.fs}px Montserrat, system-ui, sans-serif`; g.fillStyle = o.fill || C.navy; g.textAlign = o.align || 'center'; g.textBaseline = o.base || 'alphabetic'; g.fillText(str, x, y); return g.measureText(str).width; }
    function line(x1, y1, x2, y2, col, w, dash) { g.beginPath(); g.setLineDash(dash || []); g.strokeStyle = col; g.lineWidth = w; g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke(); g.setLineDash([]); }
    function head(x, y, dir) { g.beginPath(); g.fillStyle = C.gold; const s = 7; if (dir === 'up') { g.moveTo(x, y); g.lineTo(x - s, y + s * 1.6); g.lineTo(x + s, y + s * 1.6); } else { g.moveTo(x, y); g.lineTo(x + s * 1.6, y - s); g.lineTo(x + s * 1.6, y + s); } g.fill(); }
    function pill(str, x, y, o = {}) { g.font = `750 ${box.fs}px Montserrat, system-ui, sans-serif`; const w = g.measureText(str).width + 16, h = box.fs + 12, left = o.align === 'right' ? x - w : x; g.fillStyle = '#ffffff'; g.strokeStyle = C.gold; g.lineWidth = 2; g.beginPath(); g.roundRect ? g.roundRect(left, y - h + 4, w, h, 6) : g.rect(left, y - h + 4, w, h); g.fill(); g.stroke(); text(str, left + 8, y - 2, { align: 'left', weight: 750 }); }
    function draw() {
      if (!box && !layout()) return;
      const s = state, t = tempOf(s), gd = num(s.guide, 0);
      g.clearRect(0, 0, W, H);
      // highlighted interval (always on: the scale numbers stand out; strongest at the "one small square" step)
      g.fillStyle = gd === 1 && !s.touched ? 'rgba(189,129,38,0.28)' : C.band; g.fillRect(X(0), Y(0.004), X(70) - X(0), Y(0.002) - Y(0.004));
      for (let v = 0; v <= 70; v += 2) line(X(v), Y(0), X(v), Y(0.012), v % 10 ? C.grid : C.line, v % 10 ? 1 : 1.5);
      for (let k = 0; k <= 24; k++) line(X(0), Y(k * 0.0005), X(70), Y(k * 0.0005), k % 4 ? C.grid : C.line, k % 4 ? 1 : 1.5);
      line(X(0), Y(0.012), X(0), Y(0), C.navy, 2.5); line(X(0), Y(0), X(70), Y(0), C.navy, 2.5);
      for (let v = 0; v <= 70; v += 10) text(String(v), X(v), Y(0) + box.fs + 6, { weight: 600 });
      for (let k = 0; k <= 6; k++) text(k ? (k * 0.002).toFixed(3) : '0', X(0) - 6, Y(k * 0.002) + box.fs * 0.35, { align: 'right', weight: 700, fill: C.goldText });
      const xt = 'Temperature / °C', yt = 'Rate / s⁻¹';
      if (gd === 0 && !s.touched) { g.fillStyle = 'rgba(189,129,38,0.22)'; g.fillRect((X(0) + X(70)) / 2 - 80, H - box.fs * 1.6 - 2, 160, box.fs + 8); g.fillRect(0, (Y(0) + Y(0.012)) / 2 - 46, box.fs + 8, 92); }
      text(xt, (X(0) + X(70)) / 2, H - 8, { weight: 700 });
      g.save(); g.translate(box.fs * 0.9, (Y(0) + Y(0.012)) / 2); g.rotate(-Math.PI / 2); text(yt, 0, 4, { weight: 700 }); g.restore();
      text(W < 560 ? 'Illustrative data' : 'Amylase · illustrative data', X(70) - 4, Y(0.012) + box.fs + 4, { align: 'right', weight: 650, fill: C.goldText });
      // the curve and points
      g.beginPath(); g.strokeStyle = C.navy; g.lineWidth = 3.5; g.lineJoin = 'round';
      for (let v = 10; v <= 60.001; v += 0.25) { const px = X(v), py = Y(rateAt(v)); v === 10 ? g.moveTo(px, py) : g.lineTo(px, py); } g.stroke();
      [[10, .0022], [20, .0042], [30, .0067], [40, .011], [50, .0056], [60, 0]].forEach(([v, r]) => { g.beginPath(); g.arc(X(v), Y(r), 5, 0, Math.PI * 2); g.fillStyle = v === 60 ? '#ffffff' : C.navy; g.fill(); g.strokeStyle = v === 60 ? C.navy : '#ffffff'; g.lineWidth = 2; g.stroke(); });
      if (gd === 1 && !s.touched) pill('4 squares · each 0.0005', X(70) - 4, Y(0.004) - 6, { align: 'right' });
      // ruled reading lines
      if (showLines(s)) {
        const r = rateAt(t), px = X(t), py = Y(r);
        line(px, Y(0), px, py + 10, C.gold, 3, [8, 6]); head(px, py + 2, 'up');
        line(px - 2, py, X(0) + 12, py, C.gold, 3, [8, 6]); head(X(0) + 2, py, 'left');
        g.beginPath(); g.arc(px, py, 7, 0, Math.PI * 2); g.strokeStyle = C.gold; g.lineWidth = 3; g.stroke();
        if (showValue(s)) pill(valueText(t), X(1), Math.max(py - 8, Y(0.012) + box.fs * 2.8));
      }
      // the drag handle on the temperature axis (large touch target)
      g.beginPath(); g.arc(X(t), Y(0), 11, 0, Math.PI * 2); g.fillStyle = C.gold; g.fill(); g.strokeStyle = C.navy; g.lineWidth = 2.5; g.stroke();
      canvas.setAttribute('aria-label', aria(s));
    }
    function setFromX(clientX) {
      const r = canvas.getBoundingClientRect(), t = T(clientX - r.left);
      if (t === tempOf(state) && state.touched) return;
      state.temp = t; state.touched = true; draw(); ctx.refresh();
    }
    const onDown = e => { dragging = true; try { canvas.setPointerCapture(e.pointerId); } catch (_) {} setFromX(e.clientX); };
    const onMove = e => { if (dragging) setFromX(e.clientX); };
    const onUp = () => { dragging = false; };
    const onKey = e => {
      if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
      e.preventDefault(); e.stopPropagation();
      state.temp = clamp(tempOf(state) + (e.key === 'ArrowRight' ? 1 : -1), 10, 60); state.touched = true; draw(); ctx.refresh();
      ctx.announce(`${state.temp} °C: rate ${valueText(state.temp)}`);
    };
    canvas.addEventListener('pointerdown', onDown); canvas.addEventListener('pointermove', onMove); canvas.addEventListener('pointerup', onUp); canvas.addEventListener('pointercancel', onUp); canvas.addEventListener('keydown', onKey);
    const observer = new ResizeObserver(() => { if (layout()) draw(); }); observer.observe(host);
    layout(); draw();
    return {
      update: s => { state = s; draw(); },
      command: () => draw(),
      visibility: () => {},
      dispose() {
        observer.disconnect();
        canvas.removeEventListener('pointerdown', onDown); canvas.removeEventListener('pointermove', onMove); canvas.removeEventListener('pointerup', onUp); canvas.removeEventListener('pointercancel', onUp); canvas.removeEventListener('keydown', onKey);
        canvas.remove(); host.classList.remove('is-live');
      }
    };
  }
  return {
    caption: 'Illustrative data: amylase. Drag or tap the graph, or use the slider.',
    defaults: { temp: 30, guide: 0, touched: false },
    controls, readout, onChange, mount
  };
})();
