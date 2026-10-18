/* Lesson 01 · Digestive-enzyme graphs (Year 10 Double Science, Biology) — original SVG diagrams (no third-party images).
   BioDiagrams.render(name, state) returns an inline SVG string. Shapes, sizes and colours are schematic; every graph
   uses illustrative data and says so on the figure. Reused from the Week 05 Triple lesson: enzymeFallback, phGraph, tempGraph.
   Step-aware figures read state.step (model screens):
     readGraph     0 axes and units · 1 value of one small square · 2 rule a line up from 30 °C, then across ·
                   3 write the value with its unit · 4 rate = 1 ÷ time at 40 °C
     explainFrame  0 describe · 1 rising region · 2 optimum region · 3 falling region · 4 rejected line
   With no step (resource pages) every part is shown and nothing is highlighted. */
window.BioDiagrams = (() => {
  const C = {
    navy: '#182944', teal: '#24748d', green: '#56834b', gold: '#bd8126', rose: '#ad5c63', purple: '#7a3f98',
    goldText: '#8a5a14', paper: '#fbf8f0', line: '#b9b09c', grid: '#d9d2c1', tealFill: '#d3e6eb', goldFill: '#f1c96f', roseFill: '#e8c0c3'
  };
  const r1 = v => Math.round(v * 10) / 10;
  const hasStep = s => s && Number.isInteger(s.step);

  /* ---------- primitives ---------- */
  function T(x, y, str, o = {}) {
    const cls = o.cls !== undefined ? o.cls : (o.small ? 'diagram-small' : 'diagram-label');
    const size = o.size || (cls === 'diagram-small' || o.small ? 17 : 22);
    const weight = o.weight || (cls === 'diagram-small' || o.small ? 500 : 650);
    const fill = o.fill || C.navy;
    const style = [];
    if (fill !== C.navy) style.push(`fill:${fill}`);
    if (cls && o.weight) style.push(`font-weight:${o.weight}`);
    if (cls && o.size) style.push(`font-size:${o.size}px`);
    if (o.opacity !== undefined) style.push(`opacity:${o.opacity}`);
    return `<text x="${r1(x)}" y="${r1(y)}"${cls ? ` class="${cls}"` : ''} text-anchor="${o.anchor || 'middle'}" font-size="${size}" font-weight="${weight}" fill="${fill}"${style.length ? ` style="${style.join(';')}"` : ''}${o.rotate ? ` transform="rotate(${o.rotate} ${r1(x)} ${r1(y)})"` : ''}>${str}</text>`;
  }
  const P = (d, o = {}) => `<path d="${d}" fill="${o.fill || 'none'}" stroke="${o.stroke || C.navy}" stroke-width="${o.w || 3}" stroke-linecap="round" stroke-linejoin="round"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}${o.marker ? ` marker-end="url(#${o.marker})"` : ''}${o.opacity !== undefined ? ` opacity="${o.opacity}"` : ''}/>`;
  const marker = (id, color) => `<marker id="${id}" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="4.6" markerHeight="4.6" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="${color}"/></marker>`;
  const arrow = (x1, y1, x2, y2, id, color = C.navy, w = 3, dash) => P(`M${r1(x1)} ${r1(y1)}L${r1(x2)} ${r1(y2)}`, { stroke: color, w, marker: id, dash });
  const badge = (x, y, num, on) => `<circle cx="${x}" cy="${y}" r="14" fill="${on ? C.navy : C.paper}" stroke="${on ? C.gold : C.navy}" stroke-width="${on ? 3.5 : 2}"/>` + T(x, y + 6, String(num), { cls: '', size: 17, weight: 750, fill: on ? '#ffffff' : C.navy });
  const tick = (x, y) => P(`M${x - 11} ${y}L${x - 3} ${y + 9}L${x + 13} ${y - 10}`, { stroke: C.green, w: 5 });
  const cross = (x, y, s = 10) => P(`M${x - s} ${y - s}L${x + s} ${y + s}M${x + s} ${y - s}L${x - s} ${y + s}`, { stroke: C.rose, w: 5 });
  const dot = (x, y, open) => open ? `<circle cx="${r1(x)}" cy="${r1(y)}" r="6.5" fill="#ffffff" stroke="${C.navy}" stroke-width="3"/>` : `<circle cx="${r1(x)}" cy="${r1(y)}" r="6.5" fill="${C.navy}" stroke="#ffffff" stroke-width="2"/>`;
  const hl = (x, y, w, h) => `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(h)}" rx="8" fill="${C.gold}" fill-opacity="0.14" stroke="${C.gold}" stroke-width="3"/>`;

  /* enzyme with a gold-rimmed active site; the substrate is complementary to it (origin = mouth of the active site) */
  const ENZ = 'M-92 12C-92-4-62-7-40-3L-26 0V16L0 36L26 16V0L40-3C62-7 92-4 94 12C101 52 90 98 44 108C14 114-18 114-50 107C-92 98-100 54-92 12Z';
  const ENZ_BENT = 'M-92 12C-92-4-62-7-40-3L-30 2Q-18 30 -4 18Q8 8 18 30L34 -1L40-3C62-7 92-4 94 12C101 52 90 98 44 108C14 114-18 114-50 107C-92 98-100 54-92 12Z';
  const enzyme = (x, y, s = 1, bent = false) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="${bent ? ENZ_BENT : ENZ}" fill="${C.tealFill}" stroke="${C.teal}" stroke-width="3.5" stroke-linejoin="round"/><path d="${bent ? 'M-30 2Q-18 30 -4 18Q8 8 18 30L34 -1' : 'M-26 0V16L0 36L26 16V0'}" fill="none" stroke="${bent ? C.rose : C.gold}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/></g>`;
  const HALF_L = 'M-23-16H0V33L-23 15Z', HALF_R = 'M0-16H23V15L0 33Z';
  const substrate = (x, y, s = 1, o = {}) => `<g transform="translate(${x} ${y}) scale(${s})"${o.opacity !== undefined ? ` opacity="${o.opacity}"` : ''}><path d="${HALF_L}" fill="${C.goldFill}" stroke="${C.gold}" stroke-width="3" stroke-linejoin="round"${o.dash ? ' stroke-dasharray="6 4"' : ''}/><path d="${HALF_R}" fill="${C.goldFill}" stroke="${C.gold}" stroke-width="3" stroke-linejoin="round"${o.dash ? ' stroke-dasharray="6 4"' : ''}/><path d="M0-16V33" stroke="${C.navy}" stroke-width="2.5"/></g>`;
  const product = (x, y, s, rot, side) => `<g transform="translate(${x} ${y}) scale(${s}) rotate(${rot})"><path d="${side < 0 ? HALF_L : HALF_R}" fill="${C.goldFill}" stroke="${C.gold}" stroke-width="3" stroke-linejoin="round"/></g>`;

  /* smooth monotone curve through the data points (Fritsch–Carlson): it passes through every point and never overshoots,
     so a peak in the data stays the peak of the curve and values read at data temperatures are the data values */
  function mono(pts, sx, sy) {
    const n = pts.length, d = [], m = new Array(n).fill(0);
    for (let i = 0; i < n - 1; i++) d.push((pts[i + 1][1] - pts[i][1]) / (pts[i + 1][0] - pts[i][0]));
    m[0] = d[0]; m[n - 1] = d[n - 2];
    for (let i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
    for (let i = 0; i < n - 1; i++) {
      if (d[i] === 0) { m[i] = 0; m[i + 1] = 0; continue; }
      const a = m[i] / d[i], b = m[i + 1] / d[i], h = a * a + b * b;
      if (h > 9) { const t = 3 / Math.sqrt(h); m[i] = t * a * d[i]; m[i + 1] = t * b * d[i]; }
    }
    const out = [];
    for (let i = 0; i < n - 1; i++) {
      const [x0, y0] = pts[i], [x1, y1] = pts[i + 1], hgt = x1 - x0, k = 24;
      for (let j = 0; j < k; j++) {
        const t = j / k, t2 = t * t, t3 = t2 * t;
        const y = (2 * t3 - 3 * t2 + 1) * y0 + (t3 - 2 * t2 + t) * hgt * m[i] + (-2 * t3 + 3 * t2) * y1 + (t3 - t2) * hgt * m[i + 1];
        out.push([x0 + t * hgt, Math.max(0, y)]);
      }
    }
    out.push(pts[n - 1]);
    return out.map(([x, y], i) => `${i ? 'L' : 'M'}${r1(sx(x))} ${r1(sy(y))}`).join('');
  }

  /* a gridded graph: minor lines = small squares, major lines labelled; scale numbers in gold so they stand out */
  function grid(g) {
    let b = '';
    const X = g.X, Y = g.Y, eps = 1e-9;
    for (let v = g.xmin; v <= g.xmax + eps; v += g.xMinor) b += P(`M${r1(X(v))} ${r1(Y(g.ymax))}V${r1(Y(g.ymin))}`, { stroke: C.grid, w: 1 });
    for (let v = g.ymin; v <= g.ymax + eps; v += g.yMinor) b += P(`M${r1(X(g.xmin))} ${r1(Y(v))}H${r1(X(g.xmax))}`, { stroke: C.grid, w: 1 });
    for (let v = g.xmin; v <= g.xmax + eps; v += g.xMajor) b += P(`M${r1(X(v))} ${r1(Y(g.ymax))}V${r1(Y(g.ymin) + 7)}`, { stroke: C.line, w: 1.6 }) + T(X(v), Y(g.ymin) + (g.fs ? 30 : 26), g.xFmt ? g.xFmt(v) : String(Math.round(v)), { small: true, weight: 600, size: g.fs });
    for (let v = g.ymin; v <= g.ymax + eps; v += g.yMajor) b += P(`M${r1(X(g.xmin) - 7)} ${r1(Y(v))}H${r1(X(g.xmax))}`, { stroke: C.line, w: 1.6 }) + T(X(g.xmin) - 12, Y(v) + (g.fs ? 7 : 6), g.yFmt ? g.yFmt(v) : String(Math.round(v * 1000) / 1000), { small: true, weight: 700, anchor: 'end', fill: g.goldScale === false ? C.navy : C.goldText, size: g.fs });
    b += P(`M${r1(X(g.xmin))} ${r1(Y(g.ymax))}V${r1(Y(g.ymin))}H${r1(X(g.xmax))}`, { w: 2.5 });
    return b;
  }
  const yFmt3 = v => (v < 1e-9 ? '0' : v.toFixed(3));

  /* ---------- the lesson datasets (illustrative) ---------- */
  const AMYLASE = [[10, .0022], [20, .0042], [30, .0067], [40, .011], [50, .0056], [60, 0]]; // rate = 1 ÷ end-point time
  const LIPASE = [[10, 2], [20, 4], [30, 7], [37, 9], [45, 5], [55, 1], [60, 0]];
  const TOOLKIT = [[0, .5], [10, 2], [20, 4], [30, 6.5], [40, 8], [50, 3], [60, 0]];

  const figures = {};

  /* ---------- amylase graph used to model reading (steps) and for the pupils' turn ---------- */
  const AG = { fs: 20, xmin: 0, xmax: 70, xMinor: 2, xMajor: 10, ymin: 0, ymax: .012, yMinor: .0005, yMajor: .002, X: t => 130 + t * 6, Y: r => 330 - r / .0005 * 12, yFmt: yFmt3 };
  function amylaseBase(step, opts = {}) {
    const X = AG.X, Y = AG.Y;
    let b = '';
    if (step === 1 || opts.scaleBand) b += `<rect x="${X(0)}" y="${Y(.004)}" width="${X(70) - X(0)}" height="${Y(.002) - Y(.004)}" fill="${C.gold}" opacity="0.16"/>`;
    b += grid(AG);
    b += T(340, 392, 'Temperature / °C', { small: true, weight: 700, size: 20 }) + T(30, 186, 'Rate / s⁻¹', { small: true, weight: 700, rotate: -90, size: 20 });
    if (step === 0) b += hl(254, 368, 172, 28) + hl(20, 136, 28, 100) + badge(440, 382, 1, true) + badge(34, 118, 1, true);
    b += P(mono(AMYLASE, X, Y), { stroke: C.navy, w: 4 });
    AMYLASE.forEach(([t, r]) => { b += dot(X(t), Y(r), t === 60); });
    b += T(146, 64, 'Amylase · illustrative data', { small: true, anchor: 'start', weight: 650, fill: C.goldText });
    b += T(566, 300, 'no end-point:', { small: true, anchor: 'start' }) + T(566, 322, 'rate ≈ 0', { small: true, anchor: 'start' });
    if (step === 1 || opts.scaleBand) {
      b += P(`M556 ${Y(.004)}H566V${Y(.002)}H556`, { stroke: C.gold, w: 3 });
      b += T(574, Y(.003) - 4, '4 squares', { small: true, anchor: 'start', weight: 700, fill: C.goldText }) + T(574, Y(.003) + 18, 'each 0.0005', { small: true, anchor: 'start', weight: 700, fill: C.goldText });
      if (step === 1) b += badge(578, 200, 2, true);
    }
    return b;
  }
  figures.readGraph = {
    w: 700, h: 400,
    label: 'Illustrative graph of amylase rate against temperature, with a grid. Across: temperature in °C, labelled every 10. Up: rate in per second, labelled every 0.002, with 4 small squares between labels, so one small square is 0.0005 per second. Points: 0.0022 at 10 °C, 0.0042 at 20 °C, 0.0067 at 30 °C, 0.011 at 40 °C, 0.0056 at 50 °C and about 0 at 60 °C. A ruled line from 30 °C meets the curve at about 0.0067 per second. At 40 °C, rate = 1 ÷ 90 = 0.011 per second.',
    draw(s) {
      const step = hasStep(s) ? s.step : null, X = AG.X, Y = AG.Y, id = 'bio-arrow-readGraph';
      let b = amylaseBase(step);
      if (step === null || step >= 2) {
        const yv = Y(.0067);
        b += arrow(X(30), Y(0) - 2, X(30), yv + 9, id, C.gold, 3.5, '8 6') + arrow(X(30) - 2, yv, X(0) + 10, yv, id, C.gold, 3.5, '8 6');
        if (step === 2) b += badge(X(30) + 22, 290, 3, true);
      }
      if (step === null || step >= 3) {
        b += `<rect x="${X(1)}" y="${Y(.0067) - 38}" width="${X(29) - X(1)}" height="30" rx="6" fill="#ffffff" stroke="${C.gold}" stroke-width="${step === 3 ? 3 : 1.5}"/>` + T(X(15), Y(.0067) - 17, 'about 0.0067 s⁻¹', { small: true, weight: 750 });
        if (step === 3) b += badge(X(0) + 20, Y(.0067) - 54, 4, true);
      }
      if (step === null || step === 4) {
        b += `<circle cx="${X(40)}" cy="${Y(.011)}" r="13" fill="none" stroke="${C.gold}" stroke-width="4"/>` + P(`M${X(40) + 14} ${Y(.011) - 4}L556 92`, { stroke: C.gold, w: 2.5 });
        b += T(566, 92, '40 °C: 90 s', { small: true, anchor: 'start', weight: 700 }) + T(566, 116, '1 ÷ 90', { small: true, anchor: 'start', weight: 700 }) + T(566, 140, '= 0.011 s⁻¹', { small: true, anchor: 'start', weight: 750, fill: C.goldText });
      }
      return { defs: marker(id, C.gold), body: b };
    }
  };
  figures.yourTurnGraph = {
    w: 700, h: 400, vb: '20 30 680 370',
    label: 'The same illustrative amylase graph, for your turn. Rate in per second against temperature in °C. The scale numbers are in gold and the band from 0.002 to 0.004 is highlighted: 4 small squares, each 0.0005 per second. No reading lines are drawn.',
    draw() { return { defs: '', body: amylaseBase(null, { scaleBand: true }) }; }
  };

  /* a small picture for the Your turn Get started page: no tick numbers, so it adds almost no words to the drawer page */
  figures.hint20 = {
    w: 420, h: 240,
    label: 'Hint for reading 20 °C on the illustrative amylase graph: a ruler line goes up from 20 °C to the curve, then across to the rate axis. It lands just above the gold 0.004 line. Each small square is 0.0005 per second.',
    draw() {
      const X = t => 40 + t * 5.2, Y = r => 214 - r / .0005 * 8, id = 'bio-arrow-hint20', yv = Y(.0042);
      let b = `<rect x="${X(0)}" y="${Y(.004)}" width="${X(70) - X(0)}" height="${Y(.002) - Y(.004)}" fill="${C.gold}" opacity="0.2"/>`;
      for (let v = 0; v <= 70; v += 2) b += P(`M${r1(X(v))} ${Y(.012)}V${Y(0)}`, { stroke: v % 10 ? C.grid : C.line, w: v % 10 ? 1 : 1.5 });
      for (let k = 0; k <= 24; k++) b += P(`M${X(0)} ${r1(Y(k * .0005))}H${X(70)}`, { stroke: k % 4 ? C.grid : C.line, w: k % 4 ? 1 : 1.5 });
      b += P(`M${X(0)} ${Y(.012)}V${Y(0)}H${X(70)}`, { w: 2.5 }) + P(mono(AMYLASE, X, Y), { stroke: C.navy, w: 3.5 });
      b += arrow(X(20), Y(0) - 2, X(20), yv + 8, id, C.gold, 4, '7 5') + arrow(X(20) - 2, yv, X(0) + 8, yv, id, C.gold, 4, '7 5');
      b += `<circle cx="${X(20)}" cy="${yv}" r="7" fill="none" stroke="${C.gold}" stroke-width="3"/>`;
      b += T(X(70) - 6, Y(.004) + 22, '0.004', { small: true, anchor: 'end', weight: 800, fill: C.goldText, size: 22 }) + T(X(20), Y(0) + 24, '20', { small: true, weight: 800, size: 22 });
      return { defs: marker(id, C.gold), body: b };
    }
  };

  /* ---------- describe-then-explain frame on a three-region graph ---------- */
  figures.explainFrame = {
    w: 760, h: 380,
    label: 'Writing frame for describing and explaining the illustrative amylase graph. The graph is split into three regions: rising, the optimum at about 40 °C, and falling. Line 1 describes: from 10 to 40 °C the rate rises from 0.0022 to 0.011 per second, then falls. Line 2 explains the rise: more kinetic energy, more collisions, more enzyme–substrate complexes. Line 3: the optimum, the highest rate, about 40 °C. Line 4 explains the fall: the active site changes shape, the substrate no longer fits, the enzyme is denatured, permanently. Line 5 is rejected and crossed out: the enzyme is killed. Enzymes are not alive.',
    draw(s) {
      const step = hasStep(s) ? s.step : null;
      const X = t => 70 + t * 3.3, Y = r => 300 - r / .012 * 220;
      const regions = [[0, 34, C.teal, 'rising'], [34, 46, C.gold, 'optimum'], [46, 66, C.rose, 'falling']];
      let b = '';
      regions.forEach(([a, z, col, name], i) => {
        const on = step === i + 1 || (step === 4 && i === 2);
        b += `<rect x="${r1(X(a))}" y="70" width="${r1(X(z) - X(a))}" height="230" fill="${col}" opacity="${on ? 0.22 : 0.07}"/>`;
        const ink = col === C.gold ? C.goldText : col, cx = X((a + z) / 2);
        if (i === 0) b += T(cx, 92, '1', { cls: '', size: 20, weight: 800, fill: ink }) + T(cx, 114, 'rising', { small: true, weight: 700, fill: ink });
        if (i === 1) b += T(cx, 56, '2 optimum', { small: true, weight: 800, fill: ink });
        if (i === 2) b += T(cx + 6, 92, '3', { cls: '', size: 20, weight: 800, fill: ink }) + T(X(52) + 2, 176, 'falling:', { small: true, anchor: 'start', weight: 700, fill: ink }) + T(X(52) + 2, 198, 'denatured', { small: true, anchor: 'start', weight: 700, fill: ink });
      });
      [0, 20, 40, 60].forEach(t => { b += P(`M${X(t)} 300V307`, { w: 2 }) + T(X(t), 326, String(t), { small: true }); });
      b += P('M70 66V300H306', { w: 2.5 }) + P(mono(AMYLASE, X, Y), { stroke: C.navy, w: 4 });
      AMYLASE.forEach(([t, r]) => { b += dot(X(t), Y(r), t === 60); });
      b += T(188, 354, 'Temperature / °C', { small: true, weight: 700 }) + T(40, 186, 'Rate / s⁻¹', { small: true, weight: 700, rotate: -90 });
      b += T(188, 26, 'Amylase · illustrative data', { small: true, weight: 650, fill: C.goldText });
      if (step === 0 || step === null) b += T(X(10) + 8, Y(.0022) - 14, '0.0022', { small: true, anchor: 'start', weight: 700 }) + T(X(40) - 12, Y(.011) + 6, '0.011', { small: true, anchor: 'end', weight: 700 });
      const lines = [
        ['1 Describe', '10 → 40 °C: rate rises', '0.0022 → 0.011 s⁻¹; then falls'],
        ['2 Rising', 'more kinetic energy, more', 'collisions, more complexes'],
        ['3 Optimum', 'highest rate: about 40 °C', 'human enzymes: 37–40 °C'],
        ['4 Falling', 'active site changes shape,', 'no fit: denatured (permanent)'],
        ['✗ Rejected', '“the enzyme is killed”', 'enzymes are not alive']
      ];
      lines.forEach(([h, a, c], i) => {
        const y = 12 + i * 72, on = step === i, shown = step === null || i <= step, bad = i === 4;
        if (!shown) { b += `<rect x="334" y="${y}" width="420" height="62" rx="10" fill="none" stroke="${C.line}" stroke-width="2" stroke-dasharray="6 6"/>`; return; }
        b += `<rect x="334" y="${y}" width="420" height="62" rx="10" fill="${on ? (bad ? '#f8ecec' : '#f6efdd') : C.paper}" stroke="${on ? (bad ? C.rose : C.gold) : C.navy}" stroke-width="${on ? 3.5 : 1.8}"/>`;
        b += T(346, y + 26, h, { small: true, weight: 800, anchor: 'start', fill: bad ? C.rose : C.goldText }) + T(470, y + 26, a, { small: true, anchor: 'start', weight: 600 }) + T(470, y + 50, c, { small: true, anchor: 'start', weight: 600 });
        if (bad) b += P(`M466 ${y + 20}H672`, { stroke: C.rose, w: 3 }) + cross(736, y + 31, 9);
        else if (step === null || i < step) b += tick(736, y + 31);
      });
      return { defs: '', body: b };
    }
  };

  /* ---------- the marked question: lipase (illustrative data) ---------- */
  const LG = { fs: 20, xmin: 0, xmax: 60, xMinor: 2, xMajor: 10, ymin: 0, ymax: 10, yMinor: 1, yMajor: 2, X: t => 96 + t * 9.8, Y: v => 316 - v * 27 };
  figures.lipaseGraph = {
    w: 700, h: 390,
    label: 'Illustrative graph of lipase activity against temperature, drawn as a smooth curve on a grid. Across: temperature in °C, labelled every 10, small squares every 2 °C. Up: rate in arbitrary units, labelled every 2, small squares every 1 unit. The points are 2 units at 10 °C, 4 at 20 °C, 7 at 30 °C, 9 at 37 °C, 5 at 45 °C, 1 at 55 °C and 0 at 60 °C.',
    draw() {
      const X = LG.X, Y = LG.Y;
      let b = grid(LG);
      b += P(mono(LIPASE, X, Y), { stroke: C.teal, w: 4.5 });
      LIPASE.forEach(([t, v]) => { b += dot(X(t), Y(v)); });
      b += T(684, 30, 'Lipase · illustrative data', { small: true, anchor: 'end', weight: 650, fill: C.goldText });
      b += T(390, 382, 'Temperature / °C', { small: true, weight: 700, size: 20 }) + T(22, 182, 'Rate of reaction', { small: true, weight: 700, rotate: -90 }) + T(44, 182, '/ arbitrary units', { small: true, rotate: -90 });
      return { defs: '', body: b };
    }
  };

  /* ---------- the toolkit's worked mini graph ---------- */
  const TG = { xmin: 0, xmax: 60, xMinor: 2, xMajor: 10, ymin: 0, ymax: 9, yMinor: .5, yMajor: 2, X: t => 96 + t * 7, Y: v => 296 - v * 28 };
  figures.toolkitGraph = {
    w: 560, h: 370,
    label: 'Worked example of reading a graph in 4 steps. Illustrative enzyme rate in arbitrary units against temperature in °C. Step 1: read both axis labels and units. Step 2: between the labelled lines 4 and 6 there are 4 small squares, so one square is (6 − 4) ÷ 4 = 0.5. Step 3: a line is ruled up from 30 °C to the curve, then across to the rate axis. Step 4: the value is 6.5 arbitrary units.',
    draw() {
      const X = TG.X, Y = TG.Y, id = 'bio-arrow-toolkitGraph';
      let b = `<rect x="${X(0)}" y="${Y(6)}" width="${X(60) - X(0)}" height="${Y(4) - Y(6)}" fill="${C.gold}" opacity="0.18"/>`;
      b += grid({ ...TG, yFmt: v => String(Math.round(v)) });
      b += P(mono(TOOLKIT, X, Y), { stroke: C.navy, w: 4 });
      const yv = Y(6.5);
      b += arrow(X(30), Y(0) - 2, X(30), yv + 9, id, C.gold, 3.5, '8 6') + arrow(X(30) - 2, yv, X(0) + 10, yv, id, C.gold, 3.5, '8 6');
      b += `<rect x="${X(2)}" y="${yv - 40}" width="${X(27) - X(2)}" height="30" rx="6" fill="#ffffff" stroke="${C.gold}" stroke-width="2.5"/>` + T(X(14.5), yv - 19, '= 6.5 arbitrary units', { small: true, weight: 750 });
      b += badge(X(0) - 2, yv - 56, 4, true) + badge(X(30) + 20, Y(0) - 26, 3, true);
      b += P(`M${X(60) + 6} ${Y(6)}H${X(60) + 14}V${Y(4)}H${X(60) + 6}`, { stroke: C.gold, w: 3 }) + badge(X(60) + 30, Y(5), 2, true);
      b += T(96, 26, '(6 − 4) ÷ 4 squares = 0.5 per square', { small: true, anchor: 'start', weight: 700, fill: C.goldText });
      b += T(306, 350, 'Temperature / °C', { small: true, weight: 700 }) + T(28, 170, 'Rate / arbitrary units', { small: true, weight: 700, rotate: -90 });
      b += badge(440, 344, 1, true) + badge(28, 52, 1, true);
      return { defs: marker(id, C.gold), body: b };
    }
  };

  /* ---------- the on-screen Graph toolkit, one part per step: 0 (a) read · 1 (b) rate · 2 (c) frames · 3 (d) key words ---------- */
  const kbd = (x, y, k) => `<rect x="${x}" y="${y}" width="46" height="46" rx="8" fill="#ffffff" stroke="${C.navy}" stroke-width="2.5"/><rect x="${x}" y="${y + 40}" width="46" height="6" rx="3" fill="${C.navy}"/>` + T(x + 23, y + 30, k, { cls: '', size: 22, weight: 800 });
  figures.toolkitCard = {
    w: 760, h: 380,
    label: 'Graph toolkit. Part a: read a graph in 4 steps: read both axis labels and units; work out one small square, the difference between two labelled lines divided by the number of squares; rule a line up to the curve then across; write the value with its unit. Part b: rate = 1 ÷ time, for example 1 ÷ 90 = 0.011 per second, keys 1, divide, 9, 0, equals, rounded to 2 significant figures. Part c: sentence frames to describe, explain the rising part, explain the falling part and state the optimum pH. Part d: key words with pictures: enzyme, substrate, active site, enzyme–substrate complex, optimum, denatured, rate.',
    draw(s) {
      const step = hasStep(s) ? s.step : 0;
      const tabs = ['(a) Read', '(b) Rate', '(c) Frames', '(d) Key words'];
      let b = '';
      tabs.forEach((t, i) => { const on = i === step; b += `<rect x="${8 + i * 188}" y="6" width="180" height="40" rx="10" fill="${on ? C.navy : C.paper}" stroke="${on ? C.gold : C.line}" stroke-width="${on ? 3 : 1.5}"/>` + T(98 + i * 188, 33, t, { small: true, weight: 750, fill: on ? '#ffffff' : C.navy }); });
      if (step === 0) {
        const f = figures.toolkitGraph.draw();
        b += `<defs>${f.defs}</defs><g transform="translate(0 60) scale(0.64)">${f.body}</g>`;
        [['Read both axis labels', 'and units.'], ['One small square =', '(difference) ÷ (squares)'], ['Rule up to the curve,', 'then across to the axis.'], ['Write the value', 'with its unit.']].forEach(([a, c2], i) => {
          const y = 62 + i * 78;
          b += `<rect x="378" y="${y}" width="374" height="68" rx="10" fill="${C.paper}" stroke="${C.navy}" stroke-width="1.8"/>` + badge(404, y + 34, i + 1, true) + T(430, y + 28, a, { small: true, anchor: 'start', weight: 700 }) + T(430, y + 52, c2, { small: true, anchor: 'start', weight: 600 });
        });
      } else if (step === 1) {
        b += T(30, 96, 'Worked: the end-point time was 90 s.', { anchor: 'start' });
        b += T(30, 150, 'Press', { small: true, anchor: 'start', weight: 700 }) + ['1', '÷', '9', '0', '='].map((k, i) => kbd(96 + i * 58, 118, k)).join('');
        b += T(410, 150, 'Screen: 0.011111…', { small: true, anchor: 'start', weight: 700 });
        b += T(30, 218, 'Round to 2 significant figures: 0.011', { anchor: 'start' }) + T(30, 256, 'Add the unit: 0.011 s⁻¹', { anchor: 'start', fill: C.goldText });
        b += `<rect x="24" y="284" width="716" height="78" rx="10" fill="#f6efdd" stroke="${C.gold}" stroke-width="2"/>` + T(42, 316, 'Tip: start at the first digit that is not 0. Keep 2 digits.', { small: true, anchor: 'start', weight: 700 }) + T(42, 344, 'If the next digit is 5 or more, round up: 0.0041666… → 0.0042', { small: true, anchor: 'start', weight: 600 });
      } else if (step === 2) {
        [['Describe', 'As the temperature increases from ___ to ___ °C,', 'the rate ___ from ___ to ___ .'],
         ['Rising', 'The molecules have more kinetic energy, so they', 'collide more often and form more complexes.'],
         ['Falling', 'Above the optimum, the active site changes shape.', 'The substrate no longer fits. It is denatured.'],
         ['pH', 'At pH ___ the active site has the right shape,', 'so this is the optimum pH.']].forEach(([h, a, c2], i) => {
          const y = 58 + i * 80;
          b += `<rect x="12" y="${y}" width="736" height="70" rx="10" fill="${C.paper}" stroke="${C.navy}" stroke-width="1.8"/>` + T(28, y + 42, h.toUpperCase(), { small: true, anchor: 'start', weight: 800, fill: C.goldText }) + T(150, y + 30, a, { small: true, anchor: 'start', weight: 600 }) + T(150, y + 56, c2, { small: true, anchor: 'start', weight: 600 });
        });
      } else {
        const kw = [['kwEnzyme', 'enzyme'], ['kwSubstrate', 'substrate'], ['kwActiveSite', 'active site'], ['kwComplex', 'enzyme–substrate', 'complex'], ['kwOptimum', 'optimum'], ['kwDenatured', 'denatured'], ['kwRate', 'rate']];
        kw.forEach(([n, a, c2], i) => {
          const col = i < 4 ? i : i - 4, row = i < 4 ? 0 : 1, x = (row ? 100 : 10) + col * 188, y = 58 + row * 162;
          b += `<rect x="${x}" y="${y}" width="178" height="152" rx="10" fill="${C.paper}" stroke="${C.navy}" stroke-width="1.5"/><g transform="translate(${x + 29} ${y + 6}) scale(0.75)">${figures[n].draw().body}</g>` + T(x + 89, y + 118, a, { small: true, weight: 750 }) + (c2 ? T(x + 89, y + 140, c2, { small: true, weight: 750 }) : '');
        });
      }
      return { defs: '', body: b };
    }
  };

  /* ---------- practice graphs (resource page; illustrative data) ---------- */
  function practice(cfg) {
    return {
      w: 700, h: 390, label: cfg.label,
      draw() {
        const g = cfg.g;
        let b = grid(g);
        b += P(mono(cfg.data, g.X, g.Y), { stroke: cfg.colour || C.teal, w: 4.5 });
        cfg.data.forEach(([x, v]) => { b += dot(g.X(x), g.Y(v)); });
        b += T(cfg.noteX || 600, 44, cfg.note, { small: true, anchor: 'end', weight: 650, fill: C.goldText });
        b += T(cfg.xlX || 360, 378, cfg.xl, { small: true, weight: 700 }) + T(30, 190, cfg.yl[0], { small: true, weight: 700, rotate: -90 }) + (cfg.yl[1] ? T(54, 190, cfg.yl[1], { small: true, rotate: -90 }) : '');
        return { defs: '', body: b };
      }
    };
  }
  figures.practiceTrypsin = practice({
    label: 'Illustrative graph of trypsin activity against pH. Across: pH from 4 to 12, labelled every 1. Up: relative rate in percent, labelled every 20, with 4 small squares between labels, so one square is 5 percent. Points: 5 % at pH 4, 20 % at pH 5, 50 % at pH 6, 85 % at pH 7, 100 % at pH 8, 80 % at pH 9, 40 % at pH 10, 10 % at pH 11 and 0 at pH 12.',
    g: { xmin: 4, xmax: 12, xMinor: .5, xMajor: 1, ymin: 0, ymax: 100, yMinor: 5, yMajor: 20, X: p => 120 + (p - 4) * 60, Y: v => 320 - v * 2.6 },
    data: [[4, 5], [5, 20], [6, 50], [7, 85], [8, 100], [9, 80], [10, 40], [11, 10], [12, 0]],
    note: 'Trypsin · illustrative data', noteX: 330, xl: 'pH', yl: ['Relative rate / %'], colour: C.gold
  });
  figures.practicePapain = practice({
    label: 'Illustrative graph of the activity of papain, a protease from papaya fruit used to soften meat, against temperature. Across: temperature in °C, labelled every 10. Up: rate in arbitrary units, labelled every 2, with 4 small squares between labels, so one square is 0.5 units. Points: 1.5 at 20 °C, 3 at 30 °C, 5 at 40 °C, 7 at 50 °C, 8 at 60 °C, 4 at 70 °C and 0.5 at 80 °C.',
    g: { xmin: 0, xmax: 80, xMinor: 2, xMajor: 10, ymin: 0, ymax: 9, yMinor: .5, yMajor: 2, X: t => 110 + t * 6.2, Y: v => 320 - v * 30 },
    data: [[20, 1.5], [30, 3], [40, 5], [50, 7], [60, 8], [70, 4], [80, .5]],
    note: 'Papain · illustrative data', noteX: 420, xl: 'Temperature / °C', yl: ['Rate of reaction', '/ arbitrary units']
  });
  figures.practiceFish = practice({
    label: 'Illustrative graph of the activity of a protease from a cold-water fish against temperature. Across: temperature in °C, labelled every 5, small squares every 1 °C. Up: rate in arbitrary units, labelled every 2, small squares every 1 unit. Points: 4 at 0 °C, 6 at 5 °C, 8 at 10 °C, 9 at 15 °C, 7 at 20 °C, 4 at 25 °C, 1 at 30 °C and 0 at 35 °C.',
    g: { xmin: 0, xmax: 40, xMinor: 1, xMajor: 5, ymin: 0, ymax: 10, yMinor: 1, yMajor: 2, X: t => 110 + t * 12, Y: v => 320 - v * 26 },
    data: [[0, 4], [5, 6], [10, 8], [15, 9], [20, 7], [25, 4], [30, 1], [35, 0]],
    note: 'Cold-water fish protease · illustrative data', xl: 'Temperature / °C', yl: ['Rate of reaction', '/ arbitrary units'], colour: C.purple
  });

  /* ---------- key-word pictures for the toolkit strip (no text inside; the label sits beside them) ---------- */
  const icon = (label, body, defs = '') => ({ w: 160, h: 120, label, draw: () => ({ defs, body }) });
  figures.kwEnzyme = icon('An enzyme: a large teal protein with a gold-rimmed gap, the active site.', enzyme(80, 42, .62));
  figures.kwSubstrate = icon('A substrate: the gold molecule the enzyme acts on.', substrate(80, 52, 1.25));
  figures.kwActiveSite = icon('The active site: the gold-rimmed gap in the enzyme, picked out with a gold ring.', enzyme(80, 42, .62) + `<circle cx="80" cy="54" r="26" fill="none" stroke="${C.gold}" stroke-width="3.5" stroke-dasharray="6 4"/>`);
  figures.kwComplex = icon('An enzyme–substrate complex: the substrate fitted into the active site.', enzyme(80, 52, .62) + substrate(80, 52, .62));
  figures.kwOptimum = icon('The optimum: the peak of a rate curve, with a gold dot at the highest rate and a dashed line down to the axis.',
    P('M18 16V104H146', { w: 2.5 }) + P(mono([[0, 0], [30, 50], [55, 90], [75, 30], [92, 0]], x => 18 + x * 1.3, y => 104 - y * .9), { stroke: C.navy, w: 4 }) + P('M89.5 23V104', { stroke: C.gold, w: 2.5, dash: '5 5' }) + `<circle cx="89.5" cy="23" r="8" fill="${C.gold}" stroke="${C.navy}" stroke-width="2"/>`);
  figures.kwDenatured = icon('Denatured: the enzyme’s active site has changed shape (rose outline), so the substrate no longer fits; a rose cross.',
    enzyme(66, 50, .62, true) + substrate(132, 40, .7) + cross(132, 92, 9));
  figures.kwRate = icon('Rate: how fast the reaction goes; a stopwatch, with rate = 1 ÷ time.',
    `<rect x="44" y="12" width="12" height="9" rx="2" fill="${C.navy}"/><circle cx="50" cy="62" r="38" fill="#ffffff" stroke="${C.navy}" stroke-width="3"/>` + P('M50 62L70 44', { stroke: C.rose, w: 3.5 }) + `<circle cx="50" cy="62" r="4" fill="${C.navy}"/>` + T(124, 58, '1 ÷', { cls: '', size: 22, weight: 800 }) + T(124, 84, 'time', { cls: '', size: 20, weight: 700 }));

  /* ---------- reused from the Week 05 Triple lesson (unchanged drawing code) ---------- */
  figures.enzymeFallback = {
    w: 700, h: 340,
    label: 'Lock-and-key model in four stages. 1: a substrate approaches the enzyme’s active site, which has a complementary shape. 2: the substrate binds in the active site, forming an enzyme–substrate complex. 3: the products are released. 4: the enzyme is unchanged and a new substrate approaches, so the enzyme is reused.',
    draw() {
      const id = 'bio-arrow-enzymeFallback', cx = [88, 263, 438, 613], E = 190, s = .78;
      let body = '';
      cx.forEach((x, i) => {
        body += badge(x, 28, i + 1, false);
        if (i < 3) body += arrow(x + 24, 28, cx[i + 1] - 24, 28, id, C.line, 2.5);
        if (i) body += P(`M${x - 87.5} 52V290`, { stroke: C.line, w: 1.5, dash: '4 6' });
        body += enzyme(x, E, s);
      });
      body += T(cx[0], 78, 'substrate', { small: true }) + substrate(cx[0], 112, s) + arrow(cx[0], 146, cx[0], 176, id) +
        T(cx[0], 241, 'active site', { small: true, weight: 650 }) + T(cx[0], 264, 'enzyme', { small: true });
      body += T(cx[1], 78, 'substrate binds', { small: true }) + substrate(cx[1], E, s) + T(cx[1], 241, 'reaction', { small: true }) + T(cx[1], 264, 'happens here', { small: true });
      body += T(cx[2], 78, 'products', { small: true }) + product(cx[2] - 34, 128, s, -24, -1) + product(cx[2] + 34, 128, s, 24, 1) +
        arrow(cx[2] - 8, 178, cx[2] - 30, 154, id, C.navy, 2.5) + arrow(cx[2] + 8, 178, cx[2] + 30, 154, id, C.navy, 2.5) +
        T(cx[2], 241, 'active site', { small: true }) + T(cx[2], 264, 'empty again', { small: true });
      body += T(cx[3], 78, 'new substrate', { small: true }) + substrate(cx[3], 112, s, { dash: true }) + arrow(cx[3], 146, cx[3], 176, id) +
        T(cx[3], 241, 'same shape:', { small: true }) + T(cx[3], 264, 'unchanged', { small: true });
      [['Substrate', 'approaches'], ['Enzyme–substrate', 'complex forms'], ['Products', 'released'], ['Enzyme', 'reused']].forEach(([a, b], i) => {
        body += T(cx[i], 306, a, { small: true, weight: 700 }) + T(cx[i], 328, b, { small: true, weight: 700 });
      });
      return { defs: marker(id, C.navy), body };
    }
  };

  figures.phGraph = {
    w: 700, h: 340,
    label: 'Illustrative graph of relative rate against pH for three enzymes. Pepsin has an optimum of about pH 2, salivary amylase about pH 7 and trypsin about pH 8. Each rate falls either side of the optimum.',
    draw() {
      const X = p => 92 + p * 40, Y = v => 284 - v / 100 * 176;
      const bell = opt => { const pts = []; for (let p = Math.max(0, opt - 4); p <= Math.min(14, opt + 4) + 1e-9; p += .1) { const d = (p - opt) / 4; pts.push(`${pts.length ? 'L' : 'M'}${r1(X(p))} ${r1(Y(100 * Math.cos(Math.PI / 2 * d) ** 2))}`); } return pts.join(''); };
      const enzymes = [
        { name: 'pepsin', opt: 2, colour: C.rose, text: C.rose, lx: 172, leader: null },
        { name: 'amylase', opt: 7, colour: C.teal, text: C.teal, lx: 300, leader: [336, 96, 364, 106] },
        { name: 'trypsin', opt: 8, colour: C.gold, text: C.goldText, lx: 486, leader: [450, 96, 420, 106] }
      ];
      let body = '';
      for (let p = 0; p <= 14; p++) body += P(`M${X(p)} 284V${p % 2 ? 289 : 291}`, { w: 2 }) + (p % 2 ? '' : T(X(p), 310, String(p), { small: true }));
      for (const v of [50, 100]) body += P(`M86 ${Y(v)}H92`, { w: 2 }) + T(80, Y(v) + 6, String(v), { small: true, anchor: 'end' });
      body += T(80, 290, '0', { small: true, anchor: 'end' });
      enzymes.forEach(e => { body += P(`M${X(e.opt)} ${Y(100)}V284`, { stroke: e.colour, w: 2, dash: '5 6', opacity: .8 }); });
      body += P('M92 96V284H660', { w: 2.5 });
      enzymes.forEach(e => { body += P(bell(e.opt), { stroke: e.colour, w: 4.5 }); });
      enzymes.forEach(e => {
        body += T(e.lx, 62, e.name, { small: true, weight: 750, fill: e.text }) + T(e.lx, 84, `≈ pH ${e.opt}`, { small: true, weight: 600, fill: e.text });
        if (e.leader) body += P(`M${e.leader[0]} ${e.leader[1]}L${e.leader[2]} ${e.leader[3]}`, { stroke: e.colour, w: 2.5 });
      });
      body += T(92, 334, 'acidic', { small: true, anchor: 'start' }) + T(376, 334, 'pH', { small: true, weight: 700 }) + T(660, 334, 'alkaline', { small: true, anchor: 'end' }) +
        T(24, 190, 'Relative rate / %', { small: true, weight: 700, rotate: -90 }) + T(46, 190, '(illustrative)', { small: true, rotate: -90 });
      return { defs: '', body };
    }
  };

  function render(name, state) {
    const f = figures[name];
    if (!f) return '';
    const s = state || {};
    const { defs, body } = f.draw(s);
    return `<svg viewBox="${f.vb || `0 0 ${f.w} ${f.h}`}" role="img" aria-label="${f.label}" font-family="Montserrat, system-ui, sans-serif" data-diagram="${name}">${defs ? `<defs>${defs}</defs>` : ''}${body}</svg>`;
  }
  /* rate on the drawn amylase curve at any temperature (the same monotone curve the figures draw); used by the graph
     reader model and the answer data so the readout, the review and the picture always agree */
  function amylaseRate(t) {
    const pts = AMYLASE, n = pts.length;
    if (t <= pts[0][0]) return pts[0][1];
    if (t >= pts[n - 1][0]) return pts[n - 1][1];
    const d = [], m = new Array(n).fill(0);
    for (let i = 0; i < n - 1; i++) d.push((pts[i + 1][1] - pts[i][1]) / (pts[i + 1][0] - pts[i][0]));
    m[0] = d[0]; m[n - 1] = d[n - 2];
    for (let i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
    for (let i = 0; i < n - 1; i++) {
      if (d[i] === 0) { m[i] = 0; m[i + 1] = 0; continue; }
      const a = m[i] / d[i], b = m[i + 1] / d[i], h = a * a + b * b;
      if (h > 9) { const k = 3 / Math.sqrt(h); m[i] = k * a * d[i]; m[i + 1] = k * b * d[i]; }
    }
    const i = pts.findIndex((p, k) => k < n - 1 && t >= p[0] && t <= pts[k + 1][0]);
    const [x0, y0] = pts[i], [x1, y1] = pts[i + 1], hgt = x1 - x0, u = (t - x0) / hgt, u2 = u * u, u3 = u2 * u;
    return Math.max(0, (2 * u3 - 3 * u2 + 1) * y0 + (u3 - 2 * u2 + u) * hgt * m[i] + (-2 * u3 + 3 * u2) * y1 + (u3 - u2) * hgt * m[i + 1]);
  }
  return { render, names: Object.keys(figures), amylaseRate, amylaseData: AMYLASE.map(r => r.slice()) };
})();
