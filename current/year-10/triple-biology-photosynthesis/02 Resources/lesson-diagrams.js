/* Lesson 02 · Limiting factors of photosynthesis: original schematic SVG diagrams (no third-party images).
   BioDiagrams.render(name, state) returns an inline SVG string. Shapes, sizes and colours are schematic.
   Locked series colours: light #d8b23a · CO₂ #6b7280 · O₂ #24748d · water #3d7cc9 · glucose #bd8126 · chlorophyll #56834b.
   Graph values are the means of the lesson's SIMULATED pondweed dataset and say so on the figure.
   Step-aware figures read state.step:
     pondweedSetup  0 boiling tube, pondweed, NaHCO₃ · 1 water bath + thermometer · 2 LED lamp, acclimatise · 3 gas syringe + stopwatch · 4 CORMMSS on the apparatus
     limitingGraph  0 rising section · 1 plateau · 2 predict the 1.0 % CO₂ curve · 3 three CO₂ curves with point X
     graphModel     0 describe with data · 1 explain the rise · 2 explain the plateau · 3 name the limiting factor · 4 rejected line
   With no step (reading pages) every part is shown and nothing is highlighted.
   pondweedFallback and tempCurve read the model state (I, C, T, last run) and never draw a results graph,
   so the no-WebGL view gives measurements only. tempCurve draws the simulated means only when state.showData is true
   (used on the reading page, never in the lesson). */
window.BioDiagrams = (() => {
  const C = {
    navy: '#182944', teal: '#24748d', green: '#56834b', gold: '#bd8126', rose: '#ad5c63',
    light: '#d8b23a', co2: '#6b7280', o2: '#24748d', water: '#3d7cc9', glucose: '#bd8126', chloro: '#56834b',
    goldText: '#8a5a14', paper: '#fbf8f0', line: '#b9b09c', waterFill: '#dbe7f6', glass: '#ffffff', rubber: '#3a3f4a'
  };
  const r1 = v => Math.round(v * 10) / 10;
  const hasStep = s => s && Number.isInteger(s.step);
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

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
  const badge = (x, y, num, on) => `<circle cx="${x}" cy="${y}" r="14" fill="${on ? C.navy : C.paper}" stroke="${on ? C.gold : C.navy}" stroke-width="${on ? 3.5 : 2}"/>` + T(x, y + 6, String(num), { cls: '', size: 17, weight: 750, fill: on ? '#ffffff' : C.navy });
  const letter = (x, y, ch) => `<rect x="${x - 15}" y="${y - 15}" width="30" height="30" rx="6" fill="${C.navy}" stroke="${C.gold}" stroke-width="2.5"/>` + T(x, y + 7, ch, { cls: '', size: 19, weight: 800, fill: '#f1c96f' });
  const tick = (x, y) => P(`M${x - 11} ${y}L${x - 3} ${y + 9}L${x + 13} ${y - 10}`, { stroke: C.green, w: 5 });
  const cross = (x, y) => P(`M${x - 10} ${y - 10}L${x + 10} ${y + 10}M${x + 10} ${y - 10}L${x - 10} ${y + 10}`, { stroke: C.rose, w: 5 });

  /* smooth curve through points (Catmull–Rom sampled, never below zero) */
  function curve(points, sx, sy, step = .5) {
    const pts = points, out = [];
    const at = i => pts[Math.max(0, Math.min(pts.length - 1, i))];
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
      const span = p2[0] - p1[0], n = Math.max(2, Math.round(span / step));
      for (let k = 0; k < n; k++) {
        const t = k / n, t2 = t * t, t3 = t2 * t;
        const m1 = (p2[1] - p0[1]) / (p2[0] - p0[0] || 1) * span, m2 = (p3[1] - p1[1]) / (p3[0] - p1[0] || 1) * span;
        const y = (2 * t3 - 3 * t2 + 1) * p1[1] + (t3 - 2 * t2 + t) * m1 + (-2 * t3 + 3 * t2) * p2[1] + (t3 - t2) * m2;
        out.push([p1[0] + t * span, Math.max(0, y)]);
      }
    }
    out.push(pts[pts.length - 1]);
    return out.map(([x, y], i) => `${i ? 'L' : 'M'}${r1(sx(x))} ${r1(sy(y))}`).join('');
  }
  /* axes with ticks; labels with units */
  function axes(o) {
    let b = '';
    o.xt.forEach(v => { b += P(`M${r1(o.X(v))} ${o.y0}V${o.y0 + 7}`, { w: 2 }) + T(o.X(v), o.y0 + 26, String(v), { small: true }); });
    o.yt.forEach(v => { b += P(`M${o.x0 - 7} ${r1(o.Y(v))}H${o.x0}`, { w: 2 }) + (v ? P(`M${o.x0} ${r1(o.Y(v))}H${o.x1}`, { stroke: C.line, w: 1, opacity: .45 }) : '') + T(o.x0 - 12, o.Y(v) + 6, String(v), { small: true, anchor: 'end' }); });
    b += P(`M${o.x0} ${o.yTop}V${o.y0}H${o.x1}`, { w: 2.5 });
    b += T((o.x0 + o.x1) / 2, o.y0 + 52, o.xl, { small: true, weight: 700 });
    o.yl.forEach((line, k) => { b += T(o.ylx + k * 20, (o.yTop + o.y0) / 2, line, { small: true, weight: k ? 500 : 700, rotate: -90 }); });
    return b;
  }

  /* ---------- the simulated dataset (means of three repeats; anomaly excluded) ---------- */
  const LIGHTS = [0, 20, 40, 60, 80, 100];
  const MEANS = {
    '0.1': [0, 2.9, 3.8, 3.8, 3.9, 4.0],
    '0.5': [0, 3.5, 5.7, 6.5, 6.8, 7.0],
    '1.0': [0, 3.6, 6.6, 8.4, 9.0, 9.2]
  };
  const TEMPS = [10, 15, 20, 25, 30, 35, 40, 45, 50];
  const TEMP_MEANS = [2.7, 4.0, 5.3, 7.0, 8.4, 7.6, 4.4, 1.4, 0.0]; // I 100 %, NaHCO₃ 0.5 %
  const series = key => LIGHTS.map((I, i) => [I, MEANS[key][i]]);

  /* ---------- the pondweed rig (shared by the set-up figure and the no-WebGL fallback) ---------- */
  function rig(o) {
    const { I = 60, C: conc = 0.5, T: temp = 25, V = 0, bubbles = true, hl = null, cormmss = false, labels = {} } = o;
    const on = i => hl === i;
    const glow = (x, y, w, h, i) => on(i) ? `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="${C.gold}" fill-opacity="0.12" stroke="${C.gold}" stroke-width="3.5"/>` : '';
    let b = glow(246, 34, 70, 270, 0) + glow(184, 50, 214, 268, 1) + glow(8, 84, 176, 234, 2) + glow(440, 10, 252, 130, 3) + glow(574, 186, 120, 128, 3);
    /* bench */
    b += P('M8 312H692', { stroke: C.line, w: 3 });
    /* LED lamp: base, pole, head; light rays scale with brightness */
    const lit = Math.max(0, Math.min(1, I / 100));
    b += `<rect x="22" y="300" width="72" height="12" rx="4" fill="${C.navy}"/>` + P('M52 300V132', { w: 6 }) +
      `<rect x="36" y="110" width="76" height="44" rx="10" fill="${C.navy}"/><rect x="110" y="114" width="10" height="36" rx="3" fill="${lit > 0 ? C.light : '#cfc9b8'}" stroke="${C.navy}" stroke-width="2"/>`;
    if (lit > 0) [116, 132, 148].forEach(y => { b += P(`M128 ${y}L${178} ${r1(y + (y - 132) * .5)}`, { stroke: C.light, w: 5, opacity: r1(.25 + .75 * lit) }); });
    b += T(76, 98, labels.lamp || 'LED lamp', { small: true, weight: 700 });
    /* water bath (open beaker) */
    b += `<path d="M196 120V296Q196 308 208 308H378Q390 308 390 296V120" fill="none" stroke="${C.navy}" stroke-width="3"/>` +
      `<path d="M198 150H388V296Q388 306 378 306H208Q198 306 198 296Z" fill="${C.waterFill}"/>` + P('M198 150H388', { stroke: C.water, w: 2 });
    b += T(293, 334, labels.bath || 'water bath', { small: true, weight: 650 });
    /* thermometer: column height follows temperature (0–60 °C) */
    const top = 268 - Math.max(0, Math.min(60, temp)) / 60 * 180;
    b += `<rect x="356" y="70" width="14" height="210" rx="7" fill="#ffffff" stroke="${C.navy}" stroke-width="2.5"/><circle cx="363" cy="284" r="12" fill="${C.rose}" stroke="${C.navy}" stroke-width="2.5"/><rect x="360" y="${r1(top)}" width="6" height="${r1(282 - top)}" fill="${C.rose}"/>` +
      [88, 118, 148, 178, 208, 238].map(y => P(`M356 ${y}H363`, { w: 1.5 })).join('');
    b += T(322, 60, labels.thermo || 'thermometer', { small: true, anchor: 'start' });
    /* boiling tube with sodium hydrogencarbonate solution, tinted grey by CO₂ supply */
    const tint = r1(.12 + .5 * Math.max(0, Math.min(1, conc)));
    b += `<path d="M260 60V280A20 20 0 0 0 300 280V60" fill="#ffffff" fill-opacity="0.6" stroke="${C.navy}" stroke-width="2.5"/>` +
      `<path d="M262 84V280A18 18 0 0 0 298 280V84Z" fill="${C.co2}" fill-opacity="${tint}"/>` + P('M262 84H298', { stroke: C.co2, w: 2 });
    /* pondweed: stem with whorls of three leaves, weighted at the bottom, cut end up */
    b += P('M280 286C276 250 286 210 278 170C274 146 282 124 280 108', { stroke: C.chloro, w: 4 });
    [272, 246, 220, 194, 168, 142].forEach((y, k) => {
      const x = 280 + (k % 2 ? 2 : -2);
      b += `<ellipse cx="${x - 9}" cy="${y - 4}" rx="9" ry="3.6" transform="rotate(-28 ${x - 9} ${y - 4})" fill="${C.chloro}"/><ellipse cx="${x + 9}" cy="${y - 4}" rx="9" ry="3.6" transform="rotate(28 ${x + 9} ${y - 4})" fill="${C.chloro}"/><ellipse cx="${x}" cy="${y - 8}" rx="3" ry="7" fill="#6f9a5e"/>`;
    });
    b += `<rect x="272" y="284" width="16" height="8" rx="2" fill="#8a8f99"/>` + P('M275 108H285', { stroke: '#2f4a2a', w: 3 });
    if (bubbles) [[281, 96, 4], [278, 90 - 6, 3.2], [283, 76, 3.6]].forEach(([x, y, r]) => { b += `<circle cx="${x}" cy="${y}" r="${r}" fill="#ffffff" stroke="${C.o2}" stroke-width="2"/>`; });
    /* bung, delivery tube and gas syringe (10 px per cm³) */
    b += `<rect x="256" y="46" width="48" height="16" rx="3" fill="${C.rubber}"/>` + P('M280 46V26H448Q460 26 460 38V78H476', { stroke: C.navy, w: 5 }) + P('M280 46V26H448Q460 26 460 38V78H476', { stroke: '#ffffff', w: 2 });
    const gx = v => 486 + Math.max(0, Math.min(12, v)) * 8.5;
    b += `<rect x="476" y="64" width="128" height="28" rx="4" fill="#ffffff" fill-opacity="0.7" stroke="${C.navy}" stroke-width="2.5"/>`;
    if (V > 0) b += `<rect x="486" y="67" width="${r1(gx(V) - 486)}" height="22" fill="${C.o2}" fill-opacity="0.22"/>`;
    b += `<rect x="${r1(gx(V))}" y="66" width="7" height="24" fill="${C.navy}"/>` + P(`M${r1(gx(V) + 7)} 78H${r1(gx(V) + 78)}`, { w: 4 }) + P(`M${r1(gx(V) + 78)} 66V90`, { w: 5 });
    for (let v = 0; v <= 12; v++) b += P(`M${r1(gx(v))} 92V${v % 5 ? 98 : 102}`, { w: 1.5 });
    b += T(gx(0), 120, '0', { small: true }) + T(gx(5), 120, '5', { small: true }) + T(gx(10), 120, '10', { small: true }) +
      T(560, 48, labels.syringe || 'gas syringe / cm³', { small: true, weight: 700 });
    /* stopwatch */
    b += `<rect x="627" y="202" width="14" height="10" rx="2" fill="${C.navy}"/><circle cx="634" cy="248" r="34" fill="#ffffff" stroke="${C.navy}" stroke-width="3"/>` +
      P('M634 248L652 232', { stroke: C.rose, w: 3.5 }) + `<circle cx="634" cy="248" r="4" fill="${C.navy}"/>` + T(634, 304, 'stopwatch', { small: true });
    /* side labels with leader lines */
    b += P('M298 120L420 170', { stroke: C.line, w: 2 }) + T(426, 176, labels.weed || 'pondweed, cut end up', { small: true, anchor: 'start', weight: 650 }) +
      P('M300 240L420 222', { stroke: C.line, w: 2 }) + T(426, 216, labels.sol || 'NaHCO₃ solution', { small: true, anchor: 'start', weight: 650 }) + T(426, 238, labels.sol2 || '(supplies CO₂)', { small: true, anchor: 'start' });
    if (bubbles) b += P('M288 82L420 140', { stroke: C.line, w: 2 }) + T(426, 146, 'bubbles of gas', { small: true, anchor: 'start', fill: C.o2, weight: 650 });
    if (cormmss) b += letter(140, 196, 'C') + letter(240, 196, 'O') + letter(684, 250, 'R') + letter(640, 112, 'M') + letter(338, 300, 'S') + letter(240, 250, 'S');
    return b;
  }

  /* ---------- figures ---------- */
  const figures = {};

  figures.predictAxes = {
    w: 700, h: 340,
    label: 'Blank axes for your prediction. The x-axis is light intensity as a percentage of maximum, from 0 to 100. The y-axis is the rate of photosynthesis. Sketch the line you predict and write one reason.',
    draw() {
      const X = I => 110 + I * 5.2, Y = v => 270 - v * 22;
      let b = axes({ x0: 110, x1: 640, y0: 270, yTop: 40, X, Y, xt: [0, 20, 40, 60, 80, 100], yt: [], xl: 'Light intensity / % of maximum', yl: ['Rate of photosynthesis'], ylx: 60 });
      b += `<rect x="360" y="70" width="270" height="92" rx="12" fill="${C.paper}" stroke="${C.gold}" stroke-width="2.5" stroke-dasharray="8 6"/>` +
        T(495, 102, 'Your prediction:', { small: true, weight: 750 }) + T(495, 126, 'sketch the line in your book', { small: true }) + T(495, 150, 'and write one reason', { small: true });
      b += `<circle cx="150" cy="78" r="16" fill="${C.light}" opacity="0.9"/>` + [0, 60, 120, 180, 240, 300].map(a => { const q = a * Math.PI / 180; return P(`M${r1(150 + 22 * Math.cos(q))} ${r1(78 + 22 * Math.sin(q))}L${r1(150 + 30 * Math.cos(q))} ${r1(78 + 30 * Math.sin(q))}`, { stroke: C.light, w: 3 }); }).join('') +
        T(190, 84, 'brighter →', { small: true, anchor: 'start', weight: 650 });
      return { defs: '', body: b };
    }
  };

  figures.pondweedSetup = {
    w: 700, h: 340,
    label: 'Pondweed investigation set-up. 1: a piece of pondweed, cut end up, in a boiling tube of sodium hydrogencarbonate solution, which supplies carbon dioxide. 2: the tube stands in a water bath with a thermometer to keep the temperature constant. 3: an LED lamp at a fixed distance; the pondweed acclimatises for 5 minutes at each brightness. 4: bubbles of gas from the cut stem pass through a bung and delivery tube into a gas syringe; the volume is read after 5 minutes, timed with a stopwatch. 5: CORMMSS letters mark what is changed, kept the same, repeated and measured.',
    draw(s) {
      const step = hasStep(s) ? s.step : null;
      let b = rig({ I: 60, C: 0.5, T: 25, V: 4.2, hl: step, cormmss: step === 4 || step === null && s && s.cormmss });
      b += badge(246, 34, 1, step === 0) + badge(214, 135, 2, step === 1) + badge(24, 210, 3, step === 2) + badge(452, 26, 4, step === 3);
      if (step === 4) b += T(430, 334, 'CORMMSS on the kit', { small: true, weight: 750, anchor: 'start', fill: C.goldText });
      return { defs: '', body: b };
    }
  };

  figures.pondweedFallback = {
    w: 700, h: 340,
    label: 'Static view of the pondweed lab: LED lamp, water bath with thermometer, boiling tube of pondweed in sodium hydrogencarbonate solution, and a gas syringe. The readout gives the conditions and each simulated measurement.',
    draw(s) {
      const st = s || {};
      const I = Number.isFinite(st.I) ? st.I : 60, Cc = Number.isFinite(st.C) ? st.C : 0.5, Tt = Number.isFinite(st.T) ? st.T : 25;
      const last = st.last, same = last && last.I === I && last.C === Cc && last.T === Tt;
      const V = st.running && st.pending ? st.pending.V * Math.min(1, (st.t || 0) / 300) : same && !st.running ? last.V : 0;
      let b = rig({ I, C: Cc, T: Tt, V, bubbles: !!st.running && V > 0, labels: { lamp: `LED lamp ${I} %`, thermo: `${Tt} °C`, sol: `NaHCO₃ ${Cc.toFixed(1)} %`, sol2: '(supplies CO₂)' } });
      b += T(12, 334, 'Simulated · see the readout', { small: true, weight: 650, anchor: 'start', fill: C.goldText });
      return { defs: '', body: b };
    }
  };

  /* simulated mean volumes against light intensity; three CO₂ concentrations at 25 °C */
  figures.limitingGraph = {
    w: 700, h: 360,
    label: s => {
      const base = 'Simulated data, means of three repeats, 25 °C. Volume of gas collected in 5 minutes against light intensity. With 0.5 % sodium hydrogencarbonate the volume rises from 0 to 5.7 cm³ at 40 % light, then levels off at about 7.0 cm³.';
      const step = hasStep(s) ? s.step : null;
      if (step === 0) return base + ' The rising section, 0 to 40 %, is highlighted: light is limiting.';
      if (step === 1) return base + ' The plateau, 60 to 100 %, is highlighted.';
      if (step === 2) return base + ' A box asks you to predict the 1.0 % curve, then test it in the lab.';
      if (step === null && s && s.single) return base;
      return base + ' With 1.0 % it rises higher, to 9.2 cm³. With 0.1 % it levels off at about 3.8 to 4.0 cm³ from 40 % light. Point X is on the 0.1 % plateau at 80 % light.';
    },
    draw(s) {
      const step = hasStep(s) ? s.step : null;
      const X = I => 100 + I * 5.4, Y = v => 286 - v * 23;
      const single = step === null && s && s.single, show = k => (step === null && !single) || step >= 3 || k === '0.5';
      let b = '';
      if (step === 0) b += `<rect x="${X(0)}" y="56" width="${X(40) - X(0)}" height="230" fill="${C.teal}" opacity="0.13"/>`;
      if (step === 1) b += `<rect x="${X(60)}" y="56" width="${X(100) - X(60)}" height="230" fill="${C.gold}" opacity="0.16"/>`;
      b += axes({ x0: 100, x1: 650, y0: 286, yTop: 50, X, Y, xt: [0, 20, 40, 60, 80, 100], yt: [0, 2, 4, 6, 8, 10], xl: 'Light intensity / % of maximum', yl: ['Volume of gas in 5 min / cm³', '(simulated data)'], ylx: 24 });
      const draw = (key, col, w) => { b += P(curve(series(key), X, Y), { stroke: col, w }); series(key).forEach(([I, v]) => { b += `<circle cx="${r1(X(I))}" cy="${r1(Y(v))}" r="6" fill="${col}" stroke="#ffffff" stroke-width="2"/>`; }); };
      if (show('1.0')) draw('1.0', C.teal, 4);
      draw('0.5', C.navy, 4.5);
      if (show('0.1')) draw('0.1', C.co2, 4);
      if ((step === null && !single) || step >= 3) b += T(X(4), 70, 'Curves: NaHCO₃ concentration, 25 °C', { small: true, weight: 650, anchor: 'start', fill: C.goldText });
      if (step === 0) b += T(X(20) + 6, Y(5.6), 'Rising:', { small: true, weight: 750, fill: C.teal, anchor: 'end' }) + T(X(20) + 6, Y(5.6) + 22, 'light is limiting', { small: true, weight: 650, fill: C.teal, anchor: 'end' });
      if (step === 1) b += T(X(80), Y(8.9), 'Plateau: more light,', { small: true, weight: 750, fill: C.goldText }) + T(X(80), Y(8.9) + 22, 'little change', { small: true, weight: 650, fill: C.goldText });
      if (step === 2) b += `<rect x="${X(52)}" y="${Y(9.6)}" width="250" height="56" rx="10" fill="${C.paper}" stroke="${C.teal}" stroke-width="2.5" stroke-dasharray="7 6"/>` + T(X(52) + 125, Y(9.6) + 24, '1.0 % NaHCO₃: predict,', { small: true, weight: 750, fill: C.teal }) + T(X(52) + 125, Y(9.6) + 46, 'then test in the lab', { small: true, weight: 650, fill: C.teal });
      b += T(X(100) - 4, Y(7.0) + 26, '0.5 %', { small: true, weight: 750, anchor: 'end' });
      if (show('1.0')) b += T(X(100) - 4, Y(9.2) - 12, '1.0 %', { small: true, weight: 750, anchor: 'end', fill: C.teal });
      if (show('0.1')) {
        b += T(X(50), Y(3.8) + 30, '0.1 %', { small: true, weight: 750, fill: C.co2 });
        b += `<circle cx="${X(80)}" cy="${r1(Y(3.9))}" r="12" fill="none" stroke="${C.gold}" stroke-width="4"/>` + T(X(80), Y(3.9) - 18, 'X', { cls: '', size: 22, weight: 800, fill: C.goldText });
      }
      return { defs: '', body: b };
    }
  };

  /* temperature: blank axes in the lesson (pupils plot their own means); simulated means only on reading pages */
  figures.tempCurve = {
    w: 700, h: 360,
    label: 'Axes for the temperature investigation: volume of gas collected in 5 minutes, in cubic centimetres, against water-bath temperature from 10 to 50 °C, at 100 % light and 0.5 % sodium hydrogencarbonate. Plot your own means in your book.',
    draw(s) {
      const st = s || {}, data = !!st.showData;
      const X = t => 100 + (t - 10) * 13.5, Y = v => 286 - v * 23;
      let b = axes({ x0: 100, x1: 650, y0: 286, yTop: 50, X, Y, xt: TEMPS, yt: [0, 2, 4, 6, 8, 10], xl: 'Water-bath temperature / °C', yl: ['Volume of gas in 5 min / cm³', '(simulated data)'], ylx: 24 });
      if (data) {
        const pts = TEMPS.map((t, i) => [t, TEMP_MEANS[i]]);
        b += P(curve(pts, X, Y), { stroke: C.navy, w: 4.5 });
        pts.forEach(([t, v]) => { b += `<circle cx="${r1(X(t))}" cy="${r1(Y(v))}" r="6" fill="${C.navy}" stroke="#ffffff" stroke-width="2"/>`; });
        b += T(X(30), Y(8.4) - 16, 'optimum ≈ 30 °C (simulated)', { small: true, weight: 700, fill: C.goldText }) +
          T(X(44) + 6, Y(5.6), 'enzymes', { small: true, weight: 650, fill: C.rose, anchor: 'start' }) + T(X(44) + 6, Y(5.6) + 22, 'denature', { small: true, weight: 650, fill: C.rose, anchor: 'start' });
      } else {
        const t = Number.isFinite(st.T) ? st.T : 25;
        b += `<rect x="392" y="62" width="256" height="70" rx="12" fill="${C.paper}" stroke="${C.gold}" stroke-width="2.5" stroke-dasharray="8 6"/>` +
          T(520, 92, 'Predict the shape first.', { small: true, weight: 750 }) + T(520, 116, 'Plot your means in your book.', { small: true });
        b += P(`M${r1(X(Math.max(10, Math.min(50, t))))} 286V186`, { stroke: C.rose, w: 3, dash: '6 6' }) + T(X(Math.max(10, Math.min(50, t))), 176, `now ${t} °C`, { small: true, weight: 700, fill: C.rose });
      }
      return { defs: '', body: b };
    }
  };

  /* describe-then-explain writing frame beside the 0.5 % curve */
  figures.graphModel = {
    w: 760, h: 360,
    label: 'Writing frame for a describe-and-explain answer about the simulated 0.5 % curve. Line 1 describes with data: the volume rises to 5.7 cm³ at 40 % light, then levels off at about 7.0 cm³. Line 2 explains the rise: light is limiting. Line 3 explains the plateau: another factor is limiting. Line 4 names it: carbon dioxide concentration or temperature. Line 5 is a rejected answer: the plant gets tired.',
    draw(s) {
      const step = hasStep(s) ? s.step : null;
      const X = I => 64 + I * 2.2, Y = v => 250 - v * 22;
      let b = axes({ x0: 64, x1: 290, y0: 250, yTop: 70, X, Y, xt: [0, 50, 100], yt: [0, 4, 8], xl: 'Light / %', yl: ['cm³ in 5 min'], ylx: 20 });
      if (step === 1) b += `<rect x="${X(0)}" y="70" width="${X(40) - X(0)}" height="180" fill="${C.teal}" opacity="0.13"/>`;
      if (step === 2 || step === 3) b += `<rect x="${X(60)}" y="70" width="${X(100) - X(60)}" height="180" fill="${C.gold}" opacity="0.16"/>`;
      b += P(curve(series('0.5'), X, Y), { stroke: C.navy, w: 4 });
      series('0.5').forEach(([I, v]) => { b += `<circle cx="${r1(X(I))}" cy="${r1(Y(v))}" r="5" fill="${C.navy}"/>`; });
      b += T(178, 40, 'Simulated means, 0.5 %', { small: true, weight: 650, fill: C.goldText });
      const lines = [
        ['1 Describe', 'rises to 5.7 cm³ at 40 %;', 'levels off near 7.0 cm³'],
        ['2 Rise', 'more light energy, faster:', 'light is limiting'],
        ['3 Plateau', 'more light, little change:', 'another factor limits'],
        ['4 Name it', 'CO₂ concentration', '(or temperature)'],
        ['✗ Rejected', '“the plant gets tired”:', 'no factor, no evidence']
      ];
      lines.forEach(([h, a, c], i) => {
        const y = 14 + i * 68, on = step === i, shown = step === null || i <= step, bad = i === 4;
        if (!shown) { b += `<rect x="318" y="${y}" width="432" height="60" rx="10" fill="none" stroke="${C.line}" stroke-width="2" stroke-dasharray="6 6"/>`; return; }
        b += `<rect x="318" y="${y}" width="432" height="60" rx="10" fill="${on ? (bad ? '#f8ecec' : '#f6efdd') : C.paper}" stroke="${on ? (bad ? C.rose : C.gold) : C.navy}" stroke-width="${on ? 3.5 : 1.8}"/>`;
        b += T(332, y + 25, h, { small: true, weight: 800, anchor: 'start', fill: bad ? C.rose : C.goldText }) + T(482, y + 25, a, { small: true, anchor: 'start', weight: 600 }) + T(482, y + 48, c, { small: true, anchor: 'start', weight: 600 });
        if (bad) b += cross(732, y + 30); else if (step !== null && i < step) b += tick(734, y + 30);
      });
      return { defs: '', body: b };
    }
  };

  /* UAE greenhouse: hypothetical scenario, illustrative data */
  const GH = { 400: [[0, 0], [10, 4], [20, 7.5], [30, 9.3], [40, 10], [60, 10.2], [80, 10.2], [100, 10.2]], 1000: [[0, 0], [10, 4.2], [20, 8], [30, 11.5], [40, 14.2], [60, 17], [80, 18], [100, 18.2]] };
  figures.greenhouseGraph = {
    w: 700, h: 360,
    label: 'Hypothetical scenario, illustrative data. Rate of photosynthesis of greenhouse tomato plants against light intensity at 25 °C. At 400 ppm carbon dioxide the rate rises to about 10 arbitrary units at 40 % of full sunlight and then levels off. At 1000 ppm it rises higher and levels off at about 18 units from about 80 %. At low light the two curves are the same.',
    draw() {
      const X = I => 100 + I * 5.4, Y = v => 286 - v * 11.5;
      let b = axes({ x0: 100, x1: 650, y0: 286, yTop: 50, X, Y, xt: [0, 20, 40, 60, 80, 100], yt: [0, 5, 10, 15, 20], xl: 'Light intensity / % of full sunlight', yl: ['Rate of photosynthesis', '/ arbitrary units'], ylx: 26 });
      b += P(curve(GH[1000], X, Y), { stroke: C.teal, w: 4.5 }) + P(curve(GH[400], X, Y), { stroke: C.co2, w: 4.5, dash: '12 7' });
      b += T(X(100) - 4, Y(18.2) - 12, '1000 ppm CO₂', { small: true, weight: 750, anchor: 'end', fill: C.teal }) + T(X(100) - 4, Y(10.2) - 12, '400 ppm CO₂', { small: true, weight: 750, anchor: 'end', fill: C.co2 });
      b += T(110, 34, 'Hypothetical scenario · illustrative data · 25 °C', { small: true, weight: 650, anchor: 'start', fill: C.goldText });
      return { defs: '', body: b };
    }
  };

  figures.cormmss = {
    w: 700, h: 340,
    label: 'CORMMSS planning checklist for the pondweed investigation: C, change light intensity from 0 to 100 percent; O, the same piece and length of pondweed; R, repeat three times and calculate a mean; M, measure the volume of gas; M, with a gas syringe after 5 minutes; S, the same temperature using a water bath; S, the same sodium hydrogencarbonate concentration and volume.',
    draw(s) {
      const step = hasStep(s) ? s.step : null;
      const tiles = [
        ['C', '', 'Change', ['light', '0–100 %']], ['O', '', 'Organism', ['same', 'pondweed']], ['R', '', 'Repeat', ['×3, then', 'a mean']],
        ['M', '1', 'Measure', ['volume', 'of gas']], ['M', '2', 'Measure', ['syringe,', '5 min']], ['S', '1', 'Same', ['temp:', 'water bath']], ['S', '2', 'Same', ['NaHCO₃', 'conc.']]
      ];
      let b = T(350, 34, 'CORMMSS: a planning checklist');
      tiles.forEach(([l, sub, word, hint], i) => {
        const x = 5 + i * 99, cx = x + 47.5, on = step === i, done = step !== null && i < step, ink = on ? '#ffffff' : C.navy;
        b += `<rect x="${x}" y="58" width="95" height="236" rx="12" fill="${on ? C.navy : C.paper}" stroke="${on ? C.gold : C.navy}" stroke-width="${on ? 4 : 2}"/>`;
        if (done) b += tick(x + 78, 76);
        b += T(cx - (sub ? 8 : 0), 132, l, { cls: '', size: 52, weight: 800, fill: on ? '#f1c96f' : C.navy }) + (sub ? T(cx + 27, 132, sub, { cls: '', size: 22, weight: 750, fill: on ? '#f1c96f' : C.navy }) : '');
        b += T(cx, 178, word, { small: true, weight: 750, fill: ink }) + P(`M${x + 18} 194H${x + 77}`, { stroke: on ? C.gold : C.line, w: 2 });
        hint.forEach((h, k) => { b += T(cx, 226 + k * 24, h, { small: true, weight: 600, fill: ink }); });
      });
      b += T(350, 326, 'A planning checklist, not a mark scheme', { small: true });
      return { defs: '', body: b };
    }
  };

  function render(name, state) {
    const f = figures[name];
    if (!f) return '';
    const { defs, body } = f.draw(state || {});
    const label = typeof f.label === 'function' ? f.label(state || {}) : f.label;
    return `<svg viewBox="0 0 ${f.w} ${f.h}" role="img" aria-label="${esc(label)}" font-family="Montserrat, system-ui, sans-serif" data-diagram="${name}">${defs ? `<defs>${defs}</defs>` : ''}${body}</svg>`;
  }
  return { render, names: Object.keys(figures), data: { LIGHTS, MEANS, TEMPS, TEMP_MEANS } };
})();
