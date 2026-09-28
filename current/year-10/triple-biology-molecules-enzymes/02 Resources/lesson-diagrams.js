/* Lesson 02 · Enzymes, temperature and pH — original schematic SVG diagrams (no third-party images).
   BioDiagrams.render(name, state) returns an inline SVG string. Shapes, sizes and colours are schematic.
   Graphs use the lesson's illustrative amylase dataset (BUILD-SPEC §4) and say so on the figure.
   Step-aware figures read state.step (the lesson's model screens):
     tempGraph  0 rising (more collisions) · 1 optimum · 2 falling (denaturation)
     cpSetup    0 iodine in the spotting tile · 1 tubes in the water bath for 5 min · 2 mix and start the stopwatch ·
                3 one drop every 30 s · 4 end-point (iodine stays orange-brown) · 5 repeat ×3 at each temperature, rate = 1 ÷ time
     cormmss    0 C · 1 O · 2 R · 3 M (what) · 4 M (how) · 5 S · 6 S
   With no step (for example a reading page) every part is shown and nothing is highlighted. */
window.BioDiagrams = (() => {
  const C = {
    navy: '#182944', teal: '#24748d', green: '#56834b', gold: '#bd8126', rose: '#ad5c63', purple: '#7a3f98',
    goldText: '#8a5a14', paper: '#fbf8f0', line: '#b9b09c', tealFill: '#d3e6eb', goldFill: '#f1c96f', roseFill: '#e8c0c3',
    iodine: '#b8651f', blueBlack: '#1d2140', darkBrown: '#5b3a1e', water: '#dfeef3', tile: '#ffffff'
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
  const arrow = (x1, y1, x2, y2, id, color = C.navy, w = 3) => P(`M${r1(x1)} ${r1(y1)}L${r1(x2)} ${r1(y2)}`, { stroke: color, w, marker: id });
  const badge = (x, y, num, on) => `<circle cx="${x}" cy="${y}" r="14" fill="${on ? C.navy : C.paper}" stroke="${on ? C.gold : C.navy}" stroke-width="${on ? 3.5 : 2}"/>` + T(x, y + 6, String(num), { cls: '', size: 17, weight: 750, fill: on ? '#ffffff' : C.navy });
  const tick = (x, y) => P(`M${x - 11} ${y}L${x - 3} ${y + 9}L${x + 13} ${y - 10}`, { stroke: C.green, w: 5 });
  const cross = (x, y) => P(`M${x - 10} ${y - 10}L${x + 10} ${y + 10}M${x + 10} ${y - 10}L${x - 10} ${y + 10}`, { stroke: C.rose, w: 5 });

  /* glucose ring (hexagon), chains and other building blocks — same visual language as Lesson 1 */
  const hex = (x, y, r = 11) => `<polygon points="${[[0, -r], [.866 * r, -r / 2], [.866 * r, r / 2], [0, r], [-.866 * r, r / 2], [-.866 * r, -r / 2]].map(([a, b]) => `${r1(x + a)},${r1(y + b)}`).join(' ')}" fill="${C.goldFill}" stroke="${C.gold}" stroke-width="2.5" stroke-linejoin="round"/>`;
  const bond = (x1, y1, x2, y2) => P(`M${r1(x1)} ${r1(y1)}L${r1(x2)} ${r1(y2)}`, { w: 3 });
  const hexChain = (pts, links) => (links || pts.slice(1).map((_, i) => [i, i + 1])).map(([a, b]) => bond(...pts[a], ...pts[b])).join('') + pts.map(([x, y]) => hex(x, y)).join('');
  const aaColours = [C.teal, C.rose, C.green, C.gold, C.purple, '#5b86c4', C.teal];
  const bead = (x, y, i) => `<circle cx="${r1(x)}" cy="${r1(y)}" r="10" fill="${aaColours[i % aaColours.length]}" stroke="${C.navy}" stroke-width="2"/>`;
  const glycerol = (x, y) => [-18, 0, 18].map(dy => `<rect x="${x - 8}" y="${y + dy - 8}" width="16" height="16" rx="3" fill="#8fbccb" stroke="${C.teal}" stroke-width="2.5"/>`).join('') + P(`M${x} ${y - 10}V${y - 8}M${x} ${y + 8}V${y + 10}`, { stroke: C.teal, w: 2.5 });
  const fattyAcid = (x, y, len = 100) => { let d = `M${x} ${y}`; for (let i = 1, k = Math.round(len / 12); i <= k; i++) d += `L${x + i * 12} ${y + (i % 2 ? -6 : 6)}`; return P(d, { stroke: C.green, w: 5 }); };

  /* enzyme with a gold-rimmed active site; the substrate is complementary to it (origin = mouth of the active site) */
  const ENZ = 'M-92 12C-92-4-62-7-40-3L-26 0V16L0 36L26 16V0L40-3C62-7 92-4 94 12C101 52 90 98 44 108C14 114-18 114-50 107C-92 98-100 54-92 12Z';
  const enzyme = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="${ENZ}" fill="${C.tealFill}" stroke="${C.teal}" stroke-width="3.5" stroke-linejoin="round"/><path d="M-26 0V16L0 36L26 16V0" fill="none" stroke="${C.gold}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/></g>`;
  const HALF_L = 'M-23-16H0V33L-23 15Z', HALF_R = 'M0-16H23V15L0 33Z';
  const substrate = (x, y, s = 1, o = {}) => `<g transform="translate(${x} ${y}) scale(${s})"${o.opacity !== undefined ? ` opacity="${o.opacity}"` : ''}><path d="${HALF_L}" fill="${C.goldFill}" stroke="${C.gold}" stroke-width="3" stroke-linejoin="round"${o.dash ? ' stroke-dasharray="6 4"' : ''}/><path d="${HALF_R}" fill="${C.goldFill}" stroke="${C.gold}" stroke-width="3" stroke-linejoin="round"${o.dash ? ' stroke-dasharray="6 4"' : ''}/><path d="M0-16V33" stroke="${C.navy}" stroke-width="2.5"/></g>`;
  const product = (x, y, s, rot, side) => `<g transform="translate(${x} ${y}) scale(${s}) rotate(${rot})"><path d="${side < 0 ? HALF_L : HALF_R}" fill="${C.goldFill}" stroke="${C.gold}" stroke-width="3" stroke-linejoin="round"/></g>`;

  /* smooth curve through points (Catmull–Rom sampled, never below zero) */
  function curve(points, sx, sy, step = .5) {
    const pts = points, out = [];
    const at = (i) => pts[Math.max(0, Math.min(pts.length - 1, i))];
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

  /* ---------- figures ---------- */
  const figures = {};

  figures.catalyst = {
    w: 700, h: 340,
    label: 'Enzymes are biological catalysts. Left: amylase breaks a starch chain of six glucose units down into three maltose molecules. Right: an enzyme builds six glucose molecules up into branched glycogen. The enzyme speeds up each reaction and is not used up.',
    draw() {
      const id = 'bio-arrow-catalyst';
      const starch = [0, 1, 2, 3, 4, 5].map(i => [110 + i * 26, 88]);
      const maltose = [[0, 1], [2, 3], [4, 5]].flatMap(([a, b], k) => [[97 + k * 58, 228], [123 + k * 58, 228]]);
      const glucose = [0, 1, 2, 3, 4, 5].map(i => [450 + i * 30, 88 + (i % 2 ? -5 : 5)]);
      const glycogen = [[486, 216], [512, 216], [538, 216], [564, 216], [499, 238], [486, 260]];
      return {
        defs: marker(id, C.navy),
        body: P('M350 22V282', { stroke: C.line, w: 2 }) +
          T(175, 34, 'Breaking down') + T(175, 58, 'e.g. digestion', { small: true }) +
          hexChain(starch) + T(175, 126, 'starch', { small: true }) +
          arrow(175, 138, 175, 196, id) + enzyme(234, 150, .36) + T(272, 176, 'amylase', { small: true, anchor: 'start', weight: 650, fill: C.teal }) +
          maltose.reduce((s, _, i) => i % 2 ? s : s + hexChain([maltose[i], maltose[i + 1]]), '') + T(175, 266, 'maltose', { small: true }) +
          T(525, 34, 'Building up') + T(525, 58, 'e.g. storage in liver and muscle', { small: true }) +
          glucose.map(([x, y]) => hex(x, y)).join('') + T(525, 126, 'glucose', { small: true }) +
          arrow(525, 138, 525, 196, id) + enzyme(584, 150, .36) + T(622, 176, 'enzyme', { small: true, anchor: 'start', weight: 650, fill: C.teal }) +
          hexChain(glycogen, [[0, 1], [1, 2], [2, 3], [1, 4], [4, 5]]) + T(600, 266, 'glycogen', { small: true }) +
          T(350, 318, 'The enzyme speeds up each reaction. It is not used up, so it is reused.', { small: true, weight: 600 })
      };
    }
  };

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

  figures.specificity = {
    w: 700, h: 340,
    label: 'Enzyme specificity. Left: a substrate with a complementary shape fits the active site and forms an enzyme–substrate complex. Right: a differently shaped molecule does not fit the active site, so no complex forms and there is no reaction.',
    draw() {
      const E = 172, s = .92;
      return {
        defs: '',
        body: P('M350 22V290', { stroke: C.line, w: 2 }) +
          T(158, 38, 'Complementary shape') + tick(322, 30) +
          enzyme(175, E, s) + substrate(175, E, s) +
          T(188, 124, 'substrate', { small: true, anchor: 'start' }) + P('M198 130L186 154', { stroke: C.navy, w: 2 }) +
          T(160, 124, 'active site', { small: true, anchor: 'end', weight: 650 }) + P('M148 130L154 170', { stroke: C.gold, w: 2.5 }) +
          T(175, 254, 'enzyme', { small: true }) +
          T(175, 306, 'Fits the active site →', { small: true, weight: 650 }) + T(175, 328, 'enzyme–substrate complex', { small: true, weight: 650 }) +
          T(505, 38, 'Different shape') + cross(626, 30) +
          enzyme(525, E, s) +
          `<circle cx="525" cy="${E - 22}" r="32" fill="${C.roseFill}" stroke="${C.rose}" stroke-width="3"/>` +
          T(570, 118, 'does not fit', { small: true, anchor: 'start' }) + P('M574 124L552 136', { stroke: C.navy, w: 2 }) +
          T(525, 254, 'enzyme', { small: true }) +
          T(525, 306, 'Not complementary →', { small: true, weight: 650 }) + T(525, 328, 'no complex, no reaction', { small: true, weight: 650 })
      };
    }
  };

  figures.digestion = {
    w: 700, h: 340,
    label: 'Digestive enzymes. Amylase breaks starch down to maltose, and maltase breaks maltose down to glucose. Protease breaks proteins down to amino acids. Lipase breaks a lipid down to glycerol and three fatty acids.',
    draw() {
      const id = 'bio-arrow-digestion', en = (x, y, name) => T(x, y, name, { small: true, weight: 700, fill: C.teal });
      const starch = [0, 1, 2, 3, 4, 5].map(i => [30 + i * 26, 72]);
      let maltose = '';
      [276, 334, 392].forEach(p => { maltose += hexChain([[p, 72], [p + 26, 72]]); });
      let glucose = '';
      [0, 1, 2, 3, 4, 5].forEach(i => { glucose += hex(528 + i * 28, 72); });
      const protein = [0, 1, 2, 3, 4, 5, 6].map(i => [30 + i * 22, 170 + (i % 2 ? -5 : 5)]);
      let proteinChain = protein.slice(1).map((p, i) => bond(...protein[i], ...p)).join('') + protein.map(([x, y], i) => bead(x, y, i)).join('');
      let aminoAcids = protein.map((_, i) => bead(278 + i * 32, 170, i)).join('');
      const lipid = glycerol(34, 270) + [252, 270, 288].map(y => P(`M42 ${y}H52`, { stroke: C.navy, w: 3 }) + fattyAcid(52, y, 108)).join('');
      const lipidProducts = glycerol(282, 270) + T(318, 278, '+') + [252, 270, 288].map(y => fattyAcid(346, y, 108)).join('');
      return {
        defs: marker(id, C.navy),
        body: P('M14 126H686M14 222H686', { stroke: C.line, w: 1.5, dash: '4 6' }) +
          hexChain(starch) + arrow(184, 72, 250, 72, id) + en(217, 56, 'amylase') + maltose + arrow(440, 72, 506, 72, id) + en(473, 56, 'maltase') + glucose +
          T(95, 108, 'starch', { small: true }) + T(351, 108, 'maltose', { small: true }) + T(598, 108, 'glucose', { small: true }) +
          proteinChain + arrow(184, 170, 250, 170, id) + en(217, 154, 'protease') + aminoAcids +
          T(96, 206, 'protein', { small: true }) + T(374, 206, 'amino acids', { small: true }) +
          lipid + arrow(184, 270, 250, 270, id) + en(217, 254, 'lipase') + lipidProducts +
          T(95, 324, 'lipid', { small: true }) + T(282, 324, 'glycerol', { small: true }) + T(400, 324, '3 fatty acids', { small: true })
      };
    }
  };

  /* rate against temperature — shape follows the illustrative amylase dataset (optimum ≈ 40 °C) */
  const TEMP_CURVE = [[0, .0009], [10, .0022], [20, .0042], [30, .0067], [36, .0095], [40, .011], [44, .0100], [50, .0056], [55, .0024], [60, .0006], [65, 0], [70, 0]];
  figures.tempGraph = {
    w: 700, h: 340,
    label: 'Illustrative graph of rate of reaction against temperature for an enzyme. The rate rises from 0 to about 40 °C because molecules collide more often, peaks at the optimum of about 40 °C, then falls steeply to zero by about 60 °C as the active site changes shape and the enzyme is denatured.',
    draw(s) {
      const X = t => 92 + t * 8, Y = r => 284 - r / .012 * 220, step = hasStep(s) ? s.step : null;
      const regions = [
        { from: 0, to: 35, colour: C.teal, text: C.teal, lines: ['Rising:', 'more collisions'], x: 190, y: 118 },
        { from: 35, to: 45, colour: C.gold, text: C.goldText, lines: ['Optimum ≈ 40 °C'], x: 412, y: 54 },
        { from: 45, to: 65, colour: C.rose, text: C.rose, lines: ['Falling: active site', 'changes shape —', 'denatured'], x: 580, y: 110 }
      ];
      let body = '';
      regions.forEach((r, i) => { if (step === i) body += `<rect x="${X(r.from)}" y="64" width="${X(r.to) - X(r.from)}" height="220" fill="${r.colour}" opacity="0.16"/>`; });
      for (let t = 0; t <= 70; t += 10) body += P(`M${X(t)} 284V291`, { w: 2 }) + T(X(t), 310, String(t), { small: true });
      if (step === 1 || step === null) body += P(`M${X(40)} ${r1(Y(.011))}V284`, { stroke: C.gold, w: 2.5, dash: '6 6' });
      body += P('M92 60V284H660', { w: 2.5 });
      body += P(curve(TEMP_CURVE, X, Y), { stroke: C.navy, w: 4.5 });
      if (step !== null) {
        const r = regions[step];
        if (r) body += `<clipPath id="bio-clip-tempGraph-${step}"><rect x="${X(r.from)}" y="40" width="${X(r.to) - X(r.from)}" height="250"/></clipPath><g clip-path="url(#bio-clip-tempGraph-${step})">${P(curve(TEMP_CURVE, X, Y), { stroke: r.colour, w: 7 })}</g>`;
      }
      regions.forEach((r, i) => {
        const on = step === null || step === i;
        r.lines.forEach((line, k) => { body += T(r.x, r.y + k * 22, line, { small: true, weight: k === 0 ? 750 : 600, fill: r.text, opacity: on ? 1 : .7 }); });
      });
      body += T(376, 334, 'Temperature / °C', { small: true, weight: 700 }) +
        T(34, 172, 'Rate of reaction / s⁻¹', { small: true, weight: 700, rotate: -90 }) + T(56, 172, '(illustrative)', { small: true, rotate: -90 });
      return { defs: '', body };
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

  /* Core Practical set-up; the current step is outlined in gold and its number badge is filled */
  figures.cpSetup = {
    w: 700, h: 340,
    label: 'Set-up for the amylase and starch investigation. 1: a spotting tile with a drop of iodine solution in each well. 2: tubes of starch and amylase solution warm for 5 minutes in a water bath with a thermometer. 3: the solutions are mixed and a stopwatch is started. 4: every 30 seconds a pipette transfers one drop of the mixture to a fresh iodine well. 5: the end-point is the first well where the iodine stays orange-brown. 6: repeat three times at each temperature and calculate rate as 1 divided by time.',
    draw(s) {
      const id = 'bio-arrow-cpSetup', idGold = 'bio-arrow-cpSetup-gold', step = hasStep(s) ? s.step : null;
      const on = i => step === i, show = i => step === null || step >= i;
      const glow = (x, y, w, h, i) => on(i) ? `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="${C.gold}" fill-opacity="0.12" stroke="${C.gold}" stroke-width="3.5"/>` : '';
      const wells = [];
      for (let r = 0; r < 2; r++) for (let c = 0; c < 5; c++) wells.push([466 + c * 48, 240 + r * 42]);
      const colours = wells.map(() => C.iodine);
      if (step === 3) colours[0] = C.blueBlack;
      if (step === null || step >= 4) { colours[0] = C.blueBlack; colours[1] = C.darkBrown; }
      let body = '';
      /* highlights sit behind the drawing */
      body += glow(8, 16, 272, 322, 1) + glow(404, 204, 292, 112, 0) + glow(284, 14, 118, 152, 2) + glow(418, 66, 108, 150, 3) + glow(528, 126, 168, 78, 4) + glow(418, 10, 278, 58, 5);
      /* water bath, tubes, thermometer */
      body += `<path d="M22 124V292Q22 304 34 304H246Q258 304 258 292V124" fill="none" stroke="${C.navy}" stroke-width="3"/>` +
        `<path d="M24 154H256V292Q256 302 246 302H34Q24 302 24 292Z" fill="${C.water}" opacity="0.95"/>` + P('M24 154H256', { stroke: C.teal, w: 2 });
      const tube = (x, liquid) => `<path d="M${x - 15} 70V246A15 15 0 0 0 ${x + 15} 246V70" fill="#ffffff" fill-opacity="0.55" stroke="${C.navy}" stroke-width="2.5"/><path d="M${x - 13} 210V246A13 13 0 0 0 ${x + 13} 246V210Z" fill="${liquid}"/>` + P(`M${x - 19} 70H${x + 19}`, { w: 2.5 });
      body += tube(80, '#eef0ee') + tube(160, '#f5ecd2');
      body += `<rect x="216" y="56" width="14" height="226" rx="7" fill="#ffffff" stroke="${C.navy}" stroke-width="2.5"/><circle cx="223" cy="282" r="12" fill="${C.rose}" stroke="${C.navy}" stroke-width="2.5"/><rect x="220" y="150" width="6" height="128" fill="${C.rose}"/>` +
        [80, 110, 140, 170, 200].map(y => P(`M216 ${y}H223`, { w: 1.5 })).join('');
      body += T(80, 290, 'starch', { small: true }) + T(160, 290, 'amylase', { small: true }) + T(214, 40, 'thermometer', { small: true }) +
        T(140, 332, 'water bath, e.g. 40 °C', { small: true, weight: 650 });
      if (show(2)) body += P('M158 62Q124 30 88 58', { stroke: on(2) ? C.gold : C.navy, w: 3, marker: on(2) ? idGold : id }) + T(123, 30, 'mix', { small: true, weight: 700 });
      /* stopwatch */
      body += `<rect x="328" y="30" width="14" height="10" rx="2" fill="${C.navy}"/><circle cx="335" cy="88" r="40" fill="#ffffff" stroke="${C.navy}" stroke-width="3"/>` +
        [0, 90, 180, 270].map(a => { const q = a * Math.PI / 180; return P(`M${r1(335 + 32 * Math.sin(q))} ${r1(88 - 32 * Math.cos(q))}L${r1(335 + 38 * Math.sin(q))} ${r1(88 - 38 * Math.cos(q))}`, { w: 2.5 }); }).join('') +
        P('M335 88L356 70', { stroke: C.rose, w: 3.5 }) + `<circle cx="335" cy="88" r="4" fill="${C.navy}"/>` + T(335, 154, 'stopwatch', { small: true });
      /* spotting tile with iodine */
      body += `<rect x="440" y="214" width="250" height="94" rx="12" fill="${C.tile}" stroke="${C.navy}" stroke-width="2.5"/>` +
        wells.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="15" fill="${colours[i]}" stroke="#8f8676" stroke-width="2"/>`).join('') +
        T(565, 332, 'spotting tile + iodine', { small: true, weight: 650 });
      /* pipette carrying one drop of the mixture every 30 s */
      body += `<rect x="457" y="96" width="18" height="30" rx="8" fill="${C.rose}" stroke="${C.navy}" stroke-width="2"/><path d="M460 126H472V176L466 200L460 176Z" fill="#ffffff" stroke="${C.navy}" stroke-width="2.5" stroke-linejoin="round"/><circle cx="466" cy="209" r="4" fill="${C.navy}" opacity="0.7"/>` +
        T(466, 86, 'pipette', { small: true });
      body += P('M262 176Q360 228 452 152', { stroke: on(3) ? C.gold : C.navy, w: 3, dash: '8 7', marker: on(3) ? idGold : id }) +
        T(350, 236, 'one drop', { small: true, weight: on(3) ? 750 : 600 }) + T(350, 258, 'every 30 s', { small: true, weight: on(3) ? 750 : 600 });
      /* end-point */
      if (show(4)) body += `<circle cx="${wells[2][0]}" cy="${wells[2][1]}" r="20" fill="none" stroke="${C.gold}" stroke-width="${on(4) ? 5.5 : 4}"/>` + P(`M610 198L${wells[2][0] + 14} 225`, { stroke: C.gold, w: 2.5 }) +
        T(690, 148, 'end-point:', { small: true, anchor: 'end', weight: 700 }) + T(690, 170, 'iodine stays', { small: true, anchor: 'end', weight: 700 }) + T(690, 192, 'orange-brown', { small: true, anchor: 'end', weight: 700 });
      /* repeat and calculate */
      if (show(5)) body += T(686, 34, 'Repeat ×3 at 10–60 °C', { small: true, anchor: 'end', weight: 700 }) + T(686, 58, 'rate = 1 ÷ time (s⁻¹)', { small: true, anchor: 'end', weight: 600 });
      /* numbered steps */
      body += badge(424, 250, 1, on(0)) + badge(22, 124, 2, on(1)) + badge(384, 46, 3, on(2)) + badge(494, 110, 4, on(3)) + badge(546, 150, 5, on(4));
      if (show(5)) body += badge(436, 39, 6, on(5));
      return { defs: marker(id, C.navy) + marker(idGold, C.gold), body };
    }
  };

  /* static stand-in for the spotting-tile simulation: three temperatures, illustrative end-points */
  figures.spotTileFallback = {
    w: 700, h: 340,
    label: 'Illustrative iodine spotting-tile results, one drop of amylase and starch mixture every 30 seconds. At 20 °C the iodine stays blue-black until the end-point at 240 seconds, rate 0.0042 per second. At 40 °C the end-point is 90 seconds, rate 0.011 per second. At 60 °C the iodine is still blue-black at 600 seconds: no end-point, because the amylase is denatured.',
    draw() {
      const rows = [
        { label: '20 °C', end: 240, lines: ['End-point 240 s', 'rate = 0.0042 s⁻¹'] },
        { label: '40 °C', end: 90, lines: ['End-point 90 s', 'rate = 0.011 s⁻¹'] },
        { label: '60 °C', end: null, lines: ['No end-point by 600 s', 'starch still present'] }
      ];
      const x0 = 118, dx = 34, ys = [92, 164, 236];
      let body = T(350, 32, 'One drop into iodine every 30 s (illustrative data)');
      rows.forEach((row, i) => {
        const y = ys[i];
        body += T(18, y + 8, row.label, { anchor: 'start' });
        body += `<rect x="${x0 - 22}" y="${y - 24}" width="${dx * 9 + 44}" height="48" rx="10" fill="${C.tile}" stroke="${C.navy}" stroke-width="2"/>`;
        for (let k = 0; k < 10; k++) {
          const t = (k + 1) * 30, x = x0 + k * dx;
          let fill = C.blueBlack, stroke = '#8f8676', empty = false;
          if (row.end !== null) {
            if (t === row.end) fill = C.iodine; else if (t === row.end - 30) fill = C.darkBrown; else if (t > row.end) empty = true;
          }
          body += empty ? `<circle cx="${x}" cy="${y}" r="13" fill="none" stroke="#c9c1ae" stroke-width="2" stroke-dasharray="4 4"/>` : `<circle cx="${x}" cy="${y}" r="13" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`;
          if (row.end !== null && t === row.end) body += `<circle cx="${x}" cy="${y}" r="18.5" fill="none" stroke="${C.gold}" stroke-width="3.5"/>`;
        }
        if (row.end === null) body += T(x0 + 9 * dx + 34, y + 7, '…', { anchor: 'middle' });
        body += T(486, y - 3, row.lines[0], { small: true, anchor: 'start', weight: 700 }) + T(486, y + 19, row.lines[1], { small: true, anchor: 'start' });
      });
      [0, 3, 6, 9].forEach(k => { body += T(x0 + k * dx, 282, String((k + 1) * 30), { small: true }); });
      body += T(18, 282, 'Time / s', { small: true, anchor: 'start', weight: 650 });
      body += `<circle cx="34" cy="318" r="11" fill="${C.blueBlack}" stroke="#8f8676" stroke-width="2"/>` + T(54, 324, 'blue-black: starch present', { small: true, anchor: 'start' }) +
        `<circle cx="352" cy="318" r="11" fill="${C.iodine}" stroke="#8f8676" stroke-width="2"/><circle cx="352" cy="318" r="15.5" fill="none" stroke="${C.gold}" stroke-width="3"/>` + T(376, 324, 'stays orange-brown: end-point', { small: true, anchor: 'start' });
      return { defs: '', body };
    }
  };

  figures.cormmss = {
    w: 700, h: 340,
    label: 'CORMMSS planning checklist: C, change the independent variable and its values; O, the same organism or enzyme source; R, repeat at least three times and calculate a mean; M, what you measure, the dependent variable; M, how and when you measure it; S and S, two control variables and how each is kept the same.',
    draw(s) {
      const step = hasStep(s) ? s.step : null;
      const tiles = [
        ['C', '', 'Change', ['the IV', '+ values']], ['O', '', 'Organism', ['same', 'source']], ['R', '', 'Repeat', ['×3, then', 'a mean']],
        ['M', '1', 'Measure', ['what', '(the DV)']], ['M', '2', 'Measure', ['how and', 'when']], ['S', '1', 'Same', ['control 1', '+ how']], ['S', '2', 'Same', ['control 2', '+ how']]
      ];
      let body = T(350, 34, 'CORMMSS: a planning checklist');
      tiles.forEach(([letter, sub, word, hint], i) => {
        const x = 5 + i * 99, cx = x + 47.5, on = step === i, done = step !== null && i < step;
        const ink = on ? '#ffffff' : C.navy;
        body += `<rect x="${x}" y="58" width="95" height="236" rx="12" fill="${on ? C.navy : C.paper}" stroke="${on ? C.gold : C.navy}" stroke-width="${on ? 4 : 2}"/>`;
        if (done) body += tick(x + 78, 76);
        body += T(cx - (sub ? 8 : 0), 132, letter, { cls: '', size: 52, weight: 800, fill: on ? C.goldFill : C.navy }) + (sub ? T(cx + 27, 132, sub, { cls: '', size: 22, weight: 750, fill: on ? C.goldFill : C.navy }) : '');
        body += T(cx, 178, word, { small: true, weight: 750, fill: ink });
        body += P(`M${x + 18} 194H${x + 77}`, { stroke: on ? C.gold : C.line, w: 2 });
        hint.forEach((h, k) => { body += T(cx, 226 + k * 24, h, { small: true, weight: 600, fill: ink }); });
      });
      body += T(350, 326, 'IV = independent variable · DV = dependent variable', { small: true });
      return { defs: '', body };
    }
  };

  /* the illustrative dataset plotted: rate = 1 ÷ end-point time */
  const RESULTS = [[10, .0022], [20, .0042], [30, .0067], [40, .011], [50, .0056], [60, 0]];
  figures.resultsGraph = {
    w: 700, h: 340,
    label: 'Illustrative results for amylase: rate of reaction, calculated as 1 divided by end-point time, plotted against temperature. Rates are 0.0022 per second at 10 °C, 0.0042 at 20 °C, 0.0067 at 30 °C, 0.011 at 40 °C, 0.0056 at 50 °C and about zero at 60 °C, where there was no end-point. A smooth curve peaks at about 40 °C.',
    draw() {
      const X = t => 106 + t * 8, Y = r => 284 - r / .012 * 228;
      let body = '';
      for (let t = 0; t <= 70; t += 10) body += P(`M${X(t)} 284V291`, { w: 2 }) + T(X(t), 310, String(t), { small: true });
      for (let k = 0; k <= 6; k++) { const v = k * .002; body += P(`M100 ${r1(Y(v))}H106`, { w: 2 }) + (k ? P(`M106 ${r1(Y(v))}H666`, { stroke: C.line, w: 1, opacity: .45 }) : '') + T(94, Y(v) + 6, k ? v.toFixed(3) : '0', { small: true, anchor: 'end' }); }
      body += P('M106 50V284H666', { w: 2.5 });
      body += P(curve(RESULTS, X, Y), { stroke: C.teal, w: 4 });
      RESULTS.forEach(([t, r]) => { body += t === 60 ? `<circle cx="${X(t)}" cy="${Y(r)}" r="7" fill="#ffffff" stroke="${C.navy}" stroke-width="3"/>` : `<circle cx="${X(t)}" cy="${r1(Y(r))}" r="7" fill="${C.navy}" stroke="#ffffff" stroke-width="2"/>`; });
      body += T(122, 70, 'Illustrative data: amylase,', { small: true, anchor: 'start', weight: 650 }) + T(122, 92, 'iodine test every 30 s', { small: true, anchor: 'start' }) +
        T(690, 232, '60 °C: no end-point', { small: true, anchor: 'end', weight: 650 }) + T(690, 254, 'so rate ≈ 0', { small: true, anchor: 'end' });
      body += T(386, 334, 'Temperature / °C', { small: true, weight: 700 }) + T(24, 167, 'Rate of reaction / s⁻¹', { small: true, weight: 700, rotate: -90 });
      return { defs: '', body };
    }
  };

  function render(name, state) {
    const f = figures[name];
    if (!f) return '';
    const s = state || {};
    const { defs, body } = f.draw(s);
    return `<svg viewBox="0 0 ${f.w} ${f.h}" role="img" aria-label="${f.label}" font-family="Montserrat, system-ui, sans-serif" data-diagram="${name}">${defs ? `<defs>${defs}</defs>` : ''}${body}</svg>`;
  }
  return { render, names: Object.keys(figures) };
})();
