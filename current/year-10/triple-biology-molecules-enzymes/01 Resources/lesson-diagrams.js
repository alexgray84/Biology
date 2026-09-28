/* Lesson 01 · Biological molecules and food tests — original schematic SVG diagrams (Edu OS, 2026).
   Drawn from scratch for this lesson; no third-party artwork. Shapes, sizes and colours are schematic.
   Reagent colours follow the lesson's locked palette. Percentages marked “illustrative” are illustrative.
   API: BioDiagrams.render(name, state) → SVG string. state.step highlights testMethod panels;
   state.molecule / state.reagent highlight the matching row of the two model fallbacks. */
window.BioDiagrams = (() => {
  const navy = '#182944', teal = '#24748d', green = '#56834b', gold = '#bd8126', rose = '#ad5c63';
  const roseInk = '#8f3f47', goldInk = '#7d5210';
  const R = { iodine: '#b8651f', blueBlack: '#1d2140', benedict: '#2f6fd0', green: '#6f9a36', yellow: '#d8c036', orange: '#d9822b', brick: '#a33d1c', biuret: '#86aee6', purple: '#7a3f98', emulsion: '#f2f0ea', clear: '#dfeef3' };
  const card = '#fffdf8', tint = '#f6e8c9', extract = '#e6d3a6', glucoseFill = '#f1d9a6', water = '#cfe5ee';
  const beadColours = [navy, green, rose, gold, teal, R.purple];
  const beadOrder = [0, 3, 1, 4, 2, 5, 3, 0, 5, 1, 2, 4, 0, 5, 3, 1, 4, 2, 0, 3, 5, 1, 2, 4, 3];
  let uid = 0;

  /* ---------- primitives ---------- */
  const T = (x, y, s, o = {}) => `<text x="${x}" y="${y}" class="${o.cls || 'diagram-small'}" text-anchor="${o.a || 'middle'}"${o.style ? ` style="${o.style}"` : ''}>${s}</text>`;
  const L = (x, y, s, o = {}) => T(x, y, s, { cls: 'diagram-label', ...o });
  const B = 'font-weight:700';
  const arrow = (x1, y1, x2, y2, mk, w = 3) => `<path d="M${x1} ${y1} L${x2} ${y2}" fill="none" stroke="${navy}" stroke-width="${w}" stroke-linecap="round" marker-end="url(#${mk})"/>`;
  const panel = (x, y, w, h, on = false, rx = 12) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${on ? tint : card}" stroke="${on ? gold : navy}" stroke-opacity="${on ? 1 : 0.24}" stroke-width="${on ? 3.5 : 1.5}"/>`;
  const hexPts = (cx, cy, r) => Array.from({ length: 6 }, (_, i) => { const a = Math.PI / 3 * i; return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`; }).join(' ');
  const hex = (cx, cy, r, fill = glucoseFill, stroke = gold, sw = 2) => `<polygon points="${hexPts(cx, cy, r)}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"/>`;
  const bonds = (paths, w = 2.5) => paths.map(pts => `<polyline points="${pts.map(p => p.join(',')).join(' ')}" fill="none" stroke="${goldInk}" stroke-width="${w}" stroke-linejoin="round"/>`).join('');
  const bead = (cx, cy, r, i) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${beadColours[beadOrder[i % beadOrder.length]]}" stroke="${navy}" stroke-width="1.5"/>`;
  const beadChain = (pts, r) => `<polyline points="${pts.map(p => p.join(',')).join(' ')}" fill="none" stroke="${navy}" stroke-width="2.5" stroke-linejoin="round"/>` + pts.map((p, i) => bead(p[0], p[1], r, i)).join('');
  const zig = (x1, x2, y, amp = 5, step = 12, w = 5, col = green) => { let d = `M${x1} ${y}`, up = true; for (let x = x1 + step / 2; x < x2; x += step / 2) { d += ` L${x} ${y + (up ? -amp : amp)}`; up = !up; } d += ` L${x2} ${y}`; return `<path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`; };
  const glycerol = (x, y, w, h, gap = 3) => [0, 1, 2].map(i => `<rect x="${x}" y="${y + i * (h + gap)}" width="${w}" height="${h}" rx="3" fill="${teal}" stroke="${navy}" stroke-width="1.5"/>`).join('') + `<path d="M${x + w / 2} ${y + h} V${y + h + gap} M${x + w / 2} ${y + 2 * h + gap} V${y + 2 * h + 2 * gap}" stroke="${navy}" stroke-width="2"/>`;

  /* Test tube: x = centre, top = rim, bottom = lowest point, w = outer width. */
  function tube(x, top, bottom, w, liquid, level, o = {}) {
    const r = w / 2, lr = r - 2.5;
    const glass = `M${x - r} ${top} V${bottom - r} A${r} ${r} 0 0 0 ${x + r} ${bottom - r} V${top}`;
    const fillPath = (lvl, rad) => `M${x - rad} ${lvl} V${bottom - r} A${rad} ${rad} 0 0 0 ${x + rad} ${bottom - r} V${lvl} Z`;
    const stroke = o.stroke || navy;
    let s = `<path d="${glass}" fill="#ffffff" fill-opacity="${o.dark ? 0.05 : 0.6}"/>`;
    if (liquid) s += `<path d="${fillPath(level, lr)}" fill="${liquid}" fill-opacity="${o.opacity ?? 1}"/>` + (o.surface ? `<path d="M${x - lr} ${level} H${x + lr}" stroke="${o.surface}" stroke-width="2"/>` : '');
    if (o.ppt) {
      const low = bottom - 2.5, yTop = low - o.ppt, yc = bottom - r, col = o.pptCol || '#7a2a12';
      if (yTop >= yc) { const hw = Math.sqrt(Math.max(lr * lr - (yTop - yc) ** 2, 0)).toFixed(2); s += `<path d="M${x - hw} ${yTop} A${lr} ${lr} 0 0 0 ${x + +hw} ${yTop} Z" fill="${col}"/>`; }
      else s += `<path d="M${x - lr} ${yTop} V${yc} A${lr} ${lr} 0 0 0 ${x + lr} ${yc} V${yTop} Z" fill="${col}"/>`;
    }
    if (o.droplets) s += [[-4, 10], [3, 18], [-2, 27], [5, 34], [-5, 42]].filter(([, dy]) => level + dy < bottom - 4).map(([dx, dy]) => `<circle cx="${x + dx}" cy="${level + dy}" r="1.8" fill="#b9b4a6"/>`).join('');
    s += `<path d="M${x - r + 3.5} ${top + 6} V${bottom - r - 4}" stroke="#ffffff" stroke-opacity=".75" stroke-width="2" stroke-linecap="round"/>`;
    s += `<path d="${glass}" fill="none" stroke="${stroke}" stroke-width="2.5"/><path d="M${x - r - 3} ${top} H${x + r + 3}" stroke="${stroke}" stroke-width="3" stroke-linecap="round"/>`;
    return `<g>${s}</g>`;
  }

  /* Chemical formula with subscripts; parts = [[symbol, count, colour?], …]. */
  function formula(x, y, parts) {
    const spans = parts.map(([el, n, col], i) => `<tspan${i ? ' dy="-5"' : ''}${col ? ` style="fill:${col}"` : ''}>${el}</tspan><tspan dy="5" style="font-size:16px${col ? `;fill:${col}` : ''}">${n}</tspan>`).join('');
    return `<text x="${x}" y="${y}" class="diagram-label" text-anchor="middle">${spans}</text>`;
  }

  /* Element badge: C, H, O, N, S. */
  const EL = { C: [navy, navy, '#ffffff'], H: ['#ffffff', navy, navy], O: [rose, roseInk, '#ffffff'], N: [teal, navy, '#ffffff'], S: ['#f3dfb5', gold, navy] };
  function badge(x, y, el, r = 21, dashed = false) {
    const [fill, stroke, ink] = EL[el];
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="2.5"${dashed ? ' stroke-dasharray="5 4"' : ''}/>` + L(x, y + 8, el, { style: `fill:${ink}` });
  }

  /* Glycogen: a compact, highly branched tree of glucose units. Base grid: 16 px per unit along a chain, 18 px between chains. */
  const GLYCOGEN = [
    [[0, 0], [16, 0], [32, 0], [48, 0], [64, 0], [80, 0], [96, 0], [112, 0], [128, 0], [144, 0], [160, 0], [176, 0], [192, 0]],
    [[16, 0], [26, -18], [42, -18], [58, -18], [74, -18], [90, -18]],
    [[58, -18], [68, -36], [84, -36], [100, -36], [116, -36]],
    [[48, 0], [58, 18], [74, 18], [90, 18], [106, 18], [122, 18]],
    [[90, 18], [100, 36], [116, 36], [132, 36]],
    [[112, 0], [122, -18], [138, -18], [154, -18], [170, -18]],
    [[154, -18], [164, -36], [180, -36], [196, -36]],
    [[144, 0], [154, 18], [170, 18], [186, 18], [202, 18]]
  ];
  function glycogen(ox, oy, kx, ky, r) {
    const paths = GLYCOGEN.map(b => b.map(([x, y]) => [+(ox + x * kx).toFixed(1), +(oy + y * ky).toFixed(1)]));
    const seen = new Set(), units = [];
    paths.flat().forEach(p => { const key = p.join(','); if (!seen.has(key)) { seen.add(key); units.push(p); } });
    return bonds(paths, 2) + units.map(([x, y]) => hex(x, y, r, glucoseFill, gold, 1.6)).join('');
  }
  function starch(ox, oy, n, s, r, amp, branchAt) {
    const main = Array.from({ length: n }, (_, k) => [ox + k * s, +(oy + amp * Math.sin(k * 0.9)).toFixed(1)]);
    const [bx, by] = main[branchAt];
    const branch = [[bx, by], [+(bx + s * 0.55).toFixed(1), by + s * 0.85], [+(bx + s * 1.55).toFixed(1), by + s * 0.85]];
    return bonds([main, branch], 2) + [...main, ...branch.slice(1)].map(([x, y]) => hex(x, y, r, glucoseFill, gold, 1.6)).join('');
  }

  /* ---------- figures ---------- */
  const figures = {
    elements: {
      vb: [600, 340],
      label: () => 'Elements in biological molecules. Carbohydrates contain carbon, hydrogen and oxygen, with hydrogen to oxygen 2 to 1; in glucose, C6H12O6, oxygen is 25 percent of the atoms. Proteins contain carbon, hydrogen, oxygen and nitrogen, and many also contain sulfur; every amino acid contains nitrogen, which carbohydrates and lipids lack. Lipids contain carbon, hydrogen and oxygen but much less oxygen; in a fat such as C57H110O6, oxygen is about 3.5 percent of the atoms.',
      draw: () => {
        let o = '';
        const cols = [[100, 'Carbohydrates', 'sugars and starch'], [300, 'Proteins', 'amino-acid chains'], [500, 'Lipids', 'fats and oils']];
        const bar = (c, y, shares) => { let x = c - 75, s = ''; shares.forEach(([f, col]) => { const w = 150 * f; s += `<rect x="${x.toFixed(1)}" y="${y}" width="${w.toFixed(1)}" height="18" fill="${col}"/>`; x += w; }); return s + `<rect x="${c - 75}" y="${y}" width="150" height="18" fill="none" stroke="${navy}" stroke-width="1.5"/>`; };
        cols.forEach(([c, name, sub]) => { o += `<rect x="${c - 95}" y="8" width="190" height="324" rx="14" fill="${card}" stroke="${navy}" stroke-opacity=".24" stroke-width="1.5"/>` + L(c, 44, name) + T(c, 70, sub); });
        // badges
        o += badge(50, 114, 'C') + badge(100, 114, 'H') + badge(150, 114, 'O');
        o += badge(233, 114, 'C', 20) + badge(278, 114, 'H', 20) + badge(323, 114, 'O', 20) + badge(368, 114, 'N', 20);
        o += badge(450, 114, 'C') + badge(500, 114, 'H') + badge(550, 114, 'O');
        // second row
        o += T(100, 170, 'H : O = 2 : 1');
        o += badge(262, 164, 'S', 17, true) + T(287, 170, 'in many', { a: 'start' });
        o += T(500, 170, 'much less O', { style: `${B};fill:${roseInk}` });
        // examples
        o += T(100, 208, 'glucose') + formula(100, 240, [['C', '6'], ['H', '12'], ['O', '6', roseInk]]);
        o += bar(100, 256, [[0.25, navy], [0.5, '#e8ecf2'], [0.25, rose]]) + T(100, 300, 'O = 25% of atoms');
        o += T(300, 208, 'every amino acid') + L(300, 240, 'contains N', { style: 'fill:#1b5b6f' }) + T(300, 280, 'carbohydrates and') + T(300, 302, 'lipids have no N');
        o += T(500, 208, 'a fat, e.g.') + formula(500, 240, [['C', '57'], ['H', '110'], ['O', '6', roseInk]]);
        o += bar(500, 256, [[57 / 173, navy], [110 / 173, '#e8ecf2'], [6 / 173, rose]]) + T(500, 300, 'O ≈ 3.5% of atoms');
        return o;
      }
    },

    moleculesFallback: {
      vb: [680, 360],
      label: () => 'Large molecules are built from smaller units. Starch, a plant store with fewer branches, and glycogen, an animal store that is more highly branched, are both built from many glucose units. A protein is a chain of amino acids that folds into a specific shape. A lipid is one glycerol joined to three fatty acids, not a chain of one repeating unit.',
      draw: (s, mk) => {
        let o = L(340, 25, 'Large molecules are built from smaller units');
        const rows = [['starch', 'Starch', 'plant store', 'fewer branches'], ['glycogen', 'Glycogen', 'animal store', 'more branched'], ['protein', 'Protein', 'chain folds into', 'a specific shape'], ['lipid', 'Lipid', 'fats and oils', 'no repeating unit']];
        rows.forEach(([key, name, l2, l3], i) => {
          const y0 = 36 + i * 80, cy = y0 + 38, on = s && s.molecule === key;
          o += panel(6, y0, 668, 76, on, 10);
          if (key === 'starch' || key === 'glycogen') o += hex(95, cy - 10, 14, glucoseFill, gold, 2.5) + T(95, cy + 26, 'glucose');
          if (key === 'protein') o += beadChain([[69, cy - 10], [95, cy - 10], [121, cy - 10]], 10) + T(95, cy + 26, 'amino acids');
          if (key === 'lipid') o += glycerol(46, cy - 33, 14, 8, 2) + zig(76, 144, cy - 29, 3.5, 10, 4) + zig(76, 144, cy - 19, 3.5, 10, 4) + zig(76, 144, cy - 9, 3.5, 10, 4) + T(95, cy + 12, '1 glycerol +') + T(95, cy + 30, '3 fatty acids');
          o += arrow(188, cy - 4, 236, cy - 4, mk);
          if (key === 'starch') o += starch(271, cy - 6, 14, 15.2, 5.7, 3, 8);
          if (key === 'glycogen') o += glycogen(274, cy, 0.95, 0.86, 5.7);
          if (key === 'protein') {
            const pts = [];
            for (let k = 0; k < 9; k++) pts.push([262 + k * 15, cy - 24 + (k % 2 ? 4 : -4)]);
            pts.push([395, cy - 11]);
            for (let k = 0; k < 6; k++) pts.push([383 - k * 15, cy + 3]);
            pts.push([296, cy + 16]);
            for (let k = 0; k < 9; k++) pts.push([309 + k * 15, cy + 29]);
            o += beadChain(pts, 7);
          }
          if (key === 'lipid') o += glycerol(268, cy - 30, 20, 18) + [cy - 21, cy, cy + 21].map(y => `<path d="M288 ${y} H296" stroke="${navy}" stroke-width="2.5"/>` + zig(296, 470, y)).join('');
          o += L(504, cy - 10, name, { a: 'start' }) + T(504, cy + 14, l2, { a: 'start' }) + T(504, cy + 33, l3, { a: 'start' });
        });
        return o;
      }
    },

    carbs: {
      vb: [600, 340],
      label: () => 'Glucose is a simple sugar, one unit. Many glucose units join to make starch, the plant storage carbohydrate, made of long chains with few branches, and glycogen, the animal storage carbohydrate found in liver and muscle, which is highly branched.',
      draw: (s, mk) => {
        let o = L(100, 58, 'Glucose') + hex(100, 142, 44, glucoseFill, gold, 4) + T(100, 216, 'a simple sugar') + T(100, 238, '(one unit)');
        o += arrow(156, 122, 250, 84, mk) + arrow(156, 162, 250, 238, mk) + T(206, 150, 'many') + T(206, 171, 'join');
        o += L(268, 40, 'Starch', { a: 'start' }) + T(590, 40, 'plant storage', { a: 'end', style: B });
        o += starch(296, 86, 15, 19.2, 7.2, 4, 10) + T(430, 150, 'long chains, few branches');
        o += `<path d="M262 168 H590" stroke="${navy}" stroke-opacity=".25" stroke-width="1.5"/>`;
        o += L(268, 194, 'Glycogen', { a: 'start' }) + T(590, 194, 'animal storage', { a: 'end', style: B });
        o += glycogen(309, 258, 1.2, 1.2, 7.2) + T(430, 330, 'highly branched: liver, muscle');
        return o;
      }
    },

    proteinLipid: {
      vb: [660, 340],
      label: () => 'Left: a protein is a chain of amino acids joined in a specific order; the chain folds into a specific 3D shape, which gives the protein its function, for example as an enzyme. Right: a lipid (fat or oil) forms when one glycerol joins to three fatty acids, making a triglyceride; it is not a chain of repeating units.',
      draw: (s, mk) => {
        let o = `<path d="M330 16 V324" stroke="${navy}" stroke-opacity=".25" stroke-width="1.5"/>`;
        o += L(160, 36, 'Protein');
        o += beadChain(Array.from({ length: 9 }, (_, k) => [40 + k * 30, 80]), 12) + T(160, 120, 'amino acids in a specific order');
        o += arrow(160, 132, 160, 160, mk) + T(174, 152, 'folds', { a: 'start' });
        const fold = [[-45, -30], [-25, -30], [-5, -30], [15, -30], [35, -30], [50, -14], [35, 2], [15, 2], [-5, 2], [-25, 2], [-45, 2], [-58, 18], [-42, 34], [-22, 34], [-2, 34], [18, 34]].map(([x, y]) => [160 + x, 214 + y]);
        o += `<ellipse cx="156" cy="216" rx="86" ry="52" fill="${tint}" fill-opacity=".6" stroke="${gold}" stroke-width="2" stroke-dasharray="7 6"/>` + beadChain(fold, 10);
        o += T(160, 292, 'specific 3D shape', { style: B }) + T(160, 316, '→ its function, e.g. enzyme');
        o += L(495, 36, 'Lipid (fat or oil)');
        o += glycerol(372, 58, 22, 16, 2) + T(383, 134, 'glycerol');
        o += zig(432, 600, 64) + zig(432, 600, 84) + zig(432, 600, 104) + T(516, 134, '3 fatty acids');
        o += arrow(495, 146, 495, 174, mk) + T(509, 166, 'join', { a: 'start' });
        o += glycerol(402, 190, 22, 18) + [199, 220, 241].map(y => `<path d="M424 ${y} H434" stroke="${navy}" stroke-width="2.5"/>` + zig(434, 600, y)).join('');
        o += T(495, 284, 'lipid (triglyceride)', { style: B }) + T(495, 308, 'not a chain of repeating units');
        return o;
      }
    },

    /* Exam-model method flow. state.step: 0 Grind · 1 Decant · 2 Split · 3 Glucose (Benedict's) · 4 Starch (iodine) + control reminder.
       No state → every panel shown at full strength (for static copies). */
    testMethod: {
      vb: [700, 346],
      label: s => {
        const step = Number.isInteger(s && s.step) ? Math.min(Math.max(s.step, 0), 4) : null;
        const names = ['grind', 'decant', 'split', 'glucose test', 'starch test and control'];
        return `How to test a food such as cake for glucose and starch. 1 Grind the food with a little distilled water using a mortar and pestle. 2 Decant or filter off the liquid. 3 Put equal volumes into two test tubes. 4 Glucose: add Benedict’s solution and heat in a water bath at about 80 °C for 5 minutes; blue turns to brick-red if glucose is present. 5 Starch: add a few drops of iodine solution, no heating; orange-brown turns blue-black if starch is present. Control: distilled water instead of food gives no colour change.${step !== null ? ` Highlighted: step ${step + 1}, ${names[step]}.` : ''}`;
      },
      draw: (s, mk) => {
        const step = Number.isInteger(s && s.step) ? Math.min(Math.max(s.step, 0), 4) : null;
        const titles = ['Grind', 'Decant', 'Split', 'Glucose', 'Starch'];
        const caps = [['food with', 'distilled', 'water'], ['pour off', 'or filter', 'the liquid'], ['equal', 'volumes into', 'two tubes'], ['Benedict’s,', '80 °C, 5 min', 'blue →', ['brick-red', 1]], ['iodine,', 'no heating', 'orange-brown', ['→ blue-black', 1]]];
        let o = '';
        titles.forEach((title, i) => {
          const x0 = 8 + i * 137, cx = x0 + 66, on = step === i, future = step !== null && i > step;
          let g = panel(x0, 8, 132, 292, on);
          g += `<circle cx="${cx}" cy="34" r="17" fill="${on ? gold : navy}"/>` + L(cx, 42, String(i + 1), { style: 'fill:#ffffff' });
          g += L(cx, 78, title);
          if (i === 0) {
            g += `<g transform="rotate(32 ${cx + 16} 164)"><rect x="${cx + 6}" y="98" width="20" height="74" rx="10" fill="#dcd6c8" stroke="${navy}" stroke-width="2.5"/></g>`;
            g += `<path d="M${cx - 48} 160 H${cx + 48} Q${cx + 46} 206 ${cx} 206 Q${cx - 46} 206 ${cx - 48} 160 Z" fill="#e7e2d6" stroke="${navy}" stroke-width="2.5"/>`;
            g += `<ellipse cx="${cx}" cy="176" rx="38" ry="9" fill="${extract}"/>` + [[-22, 174], [-8, 178], [8, 173], [20, 179], [-14, 181]].map(([dx, y]) => `<circle cx="${cx + dx}" cy="${y}" r="4" fill="#b98a4e"/>`).join('');
            g += [[-26, 112], [-16, 132], [-30, 144]].map(([dx, y]) => `<path d="M${cx + dx} ${y - 8} Q${cx + dx + 5} ${y} ${cx + dx} ${y + 3} Q${cx + dx - 5} ${y} ${cx + dx} ${y - 8} Z" fill="#6fa6c6"/>`).join('');
          }
          if (i === 1) {
            g += tube(cx, 150, 206, 26, extract, 184);
            g += `<path d="M${cx - 36} 98 L${cx + 36} 98 L${cx + 6} 138 V166 H${cx - 6} V138 Z" fill="#ffffff" fill-opacity=".7" stroke="${navy}" stroke-width="2.5" stroke-linejoin="round"/>`;
            g += `<path d="M${cx - 29} 102 L${cx + 29} 102 L${cx} 134 Z" fill="#f7f5ee" stroke="#8d97aa" stroke-width="1.5"/>` + [[-10, 110], [2, 113], [11, 108], [-3, 120]].map(([dx, y]) => `<circle cx="${cx + dx}" cy="${y}" r="4" fill="#b98a4e"/>`).join('');
            g += `<ellipse cx="${cx}" cy="174" rx="3" ry="4.5" fill="${extract}" stroke="#b99a5c" stroke-width="1"/>`;
          }
          if (i === 2) {
            g += tube(cx - 22, 104, 206, 26, extract, 160) + tube(cx + 22, 104, 206, 26, extract, 160);
            g += `<path d="M${cx - 44} 160 H${cx + 44}" stroke="${gold}" stroke-width="2.5" stroke-dasharray="6 5"/>`;
          }
          if (i === 3) {
            const heated = step === null || step >= 3; /* stays Benedict's blue until this step is reached */
            g += `<rect x="${cx - 46}" y="146" width="92" height="58" fill="${water}"/>` + tube(cx - 12, 100, 198, 26, heated ? R.brick : R.benedict, 150, heated ? { ppt: 13 } : {});
            g += `<path d="M${cx - 46} 146 q8 -5 15 0 t15 0 t15 0 t15 0 t15 0 t16 0" fill="none" stroke="#6fa6c6" stroke-width="2"/>`;
            g += `<rect x="${cx + 21}" y="104" width="8" height="88" rx="4" fill="#ffffff" stroke="${navy}" stroke-width="2"/><rect x="${cx + 23.5}" y="124" width="3" height="66" fill="${rose}"/><circle cx="${cx + 25}" cy="194" r="7" fill="${rose}" stroke="${navy}" stroke-width="2"/>`;
            g += `<path d="M${cx - 48} 128 V206 H${cx + 48} V128" fill="none" stroke="${navy}" stroke-width="2.5" stroke-linejoin="round"/>`;
          }
          if (i === 4) {
            g += tube(cx, 146, 206, 26, R.blueBlack, 172);
            g += `<rect x="${cx - 4}" y="112" width="8" height="24" fill="#ffffff" fill-opacity=".8" stroke="${navy}" stroke-width="2"/><path d="M${cx - 9} 112 Q${cx - 9} 94 ${cx} 94 Q${cx + 9} 94 ${cx + 9} 112 Z" fill="#6b5a6e" stroke="${navy}" stroke-width="2"/>`;
            g += `<path d="M${cx} 138 Q${cx + 4} 144 ${cx} 147 Q${cx - 4} 144 ${cx} 138 Z" fill="${R.iodine}"/>`;
          }
          caps[i].forEach((c, k) => { const [txt, bold] = Array.isArray(c) ? c : [c, 0]; g += T(cx, 226 + k * 21, txt, bold ? { style: B } : {}); });
          o += `<g${future ? ' opacity=".4"' : ''}>${g}</g>`;
        });
        const ctl = step === 4;
        o += `<g${step !== null && step < 4 ? ' opacity=".4"' : ''}>${panel(8, 308, 680, 34, ctl, 10)}${T(348, 331, `<tspan style="${B}">Control:</tspan> distilled water instead of food → no colour change`)}</g>`;
        return o;
      }
    },

    foodTestsFallback: {
      vb: [700, 360],
      label: () => 'The four food tests compared with a distilled-water control. Starch: iodine solution, no heating; positive blue-black, control stays orange-brown. Glucose: Benedict’s solution in a hot water bath at about 80 °C; positive brick-red precipitate, with green to orange for less sugar; control stays blue. Protein: Biuret reagent, mix, no heating; positive purple (lilac); control stays blue. Fat: shake with ethanol then pour into water; positive cloudy white emulsion; control stays clear; no flames near ethanol.',
      draw: s => {
        let o = T(20, 24, 'Test', { a: 'start', style: B }) + T(276, 24, 'Control', { style: B }) + T(376, 24, 'Positive', { style: B }) + T(424, 24, 'What you see', { a: 'start', style: B });
        const rows = [
          ['iodine', 'Starch', ['iodine solution', 'no heating'], [R.iodine, 1], [R.blueBlack, 1], [['Positive: blue-black', 1], ['Control stays orange-brown']]],
          ['benedicts', 'Glucose', ['Benedict’s solution', 'water bath ~80 °C'], [R.benedict, 1], [R.brick, 1, 11], [['Positive: brick-red', 1], ['less sugar: green → orange'], ['Control stays blue']]],
          ['biuret', 'Protein', ['Biuret reagent', 'mix; no heating'], [R.biuret, 1], [R.purple, 1], [['Positive: purple (lilac)', 1], ['Control stays blue']]],
          ['ethanol', 'Fat (lipid)', ['shake with ethanol,', 'then pour into water'], [R.clear, 0.22], [R.emulsion, 1], [['Positive: cloudy white', 1], ['Control stays clear'], ['No flames near ethanol', 2]]]
        ];
        rows.forEach(([key, name, method, neg, pos, obs], i) => {
          const y0 = 34 + i * 81, cy = y0 + 38, on = s && s.reagent === key, dark = key === 'ethanol';
          o += panel(6, y0, 688, 77, on, 10);
          o += L(20, cy - 12, name, { a: 'start' }) + T(20, cy + 11, method[0], { a: 'start' }) + T(20, cy + 31, method[1], { a: 'start' });
          if (dark) o += `<rect x="238" y="${y0 + 5}" width="176" height="67" rx="8" fill="#34405a"/>`;
          const tOpts = dark ? { stroke: '#e9edf3', dark: true } : {};
          o += tube(276, cy - 30, cy + 32, 22, neg[0], cy - 4, { ...tOpts, opacity: neg[1], surface: dark ? '#dfeef3' : null });
          o += tube(376, cy - 30, cy + 32, 22, pos[0], cy - 4, { ...tOpts, opacity: pos[1], ppt: pos[2] });
          const ys = obs.length === 3 ? [cy - 12, cy + 9, cy + 30] : [cy - 4, cy + 18];
          obs.forEach(([txt, style], k) => { o += T(424, ys[k], txt, { a: 'start', style: style === 1 ? B : style === 2 ? `${B};fill:${roseInk}` : '' }); });
        });
        return o;
      }
    },

    benedictScale: {
      vb: [600, 340],
      label: () => 'Benedict’s test is semi-quantitative. After heating, the colour moves along the sequence blue, green, yellow, orange, brick-red as glucose concentration increases, shown for illustrative concentrations of 0, 0.1, 0.5, 1 and 2 percent; more precipitate forms at higher concentrations. To quantify, use a colorimeter or weigh the dried precipitate.',
      draw: (s, mk) => {
        let o = L(300, 32, 'Colour shows a rough amount of glucose');
        const set = [[R.benedict, 'blue', '0%', 0], [R.green, 'green', '0.1%', 4], [R.yellow, 'yellow', '0.5%', 7], [R.orange, 'orange', '1%', 12], [R.brick, 'brick-red', '2%', 20]];
        set.forEach(([col, name, pc, ppt], i) => {
          const x = 80 + i * 110;
          o += tube(x, 52, 190, 34, col, 102, ppt ? { ppt, pptCol: i < 3 ? '#b8762a' : '#7a2a12' } : {});
          o += T(x, 218, name, { style: B }) + T(x, 240, pc);
        });
        o += arrow(60, 260, 548, 260, mk) + T(300, 288, 'increasing glucose concentration (illustrative %)');
        o += T(300, 324, 'To quantify: colorimeter, or weigh the dried precipitate', { style: `fill:${goldInk};${B}` });
        return o;
      }
    },

    benedictResults: {
      vb: [600, 340],
      label: () => 'Four tubes after the Benedict’s test: tube A brick-red, tube B green, tube C blue, tube D orange. Equal volumes were used and all tubes were heated for 5 minutes at 80 °C.',
      draw: () => {
        let o = `<rect x="64" y="150" width="472" height="92" rx="6" fill="#eadcc0" stroke="${navy}" stroke-width="2"/>`;
        const set = [['A', R.brick, 'brick-red', 22], ['B', R.green, 'green', 5], ['C', R.benedict, 'blue', 0], ['D', R.orange, 'orange', 13]];
        set.forEach(([k, col, name, ppt], i) => {
          const x = 120 + i * 120;
          o += L(x, 42, k, { style: 'font-size:26px;font-weight:750' }) + tube(x, 58, 236, 40, col, 118, ppt ? { ppt, pptCol: i === 1 ? '#b8762a' : '#7a2a12' } : {});
        });
        o += `<rect x="56" y="176" width="488" height="20" rx="4" fill="#d6c092" stroke="${navy}" stroke-width="2"/>`;
        set.forEach(([, , name], i) => { o += T(120 + i * 120, 268, name, { style: B }); });
        o += T(300, 310, 'Equal volumes; all heated for 5 min at 80 °C');
        return o;
      }
    },

    stations: {
      vb: [700, 340],
      label: () => 'Plan of the three practical stations. Eye protection on throughout. Station A, pupil tests: iodine on a spotting tile and Biuret in test tubes; Biuret is corrosive, rinse any splashes. Station B, Benedict’s test in a water bath at about 80 °C for 5 minutes; start it first; hot water, use a test-tube holder. Station C, teacher demonstration of the ethanol emulsion test with ethanol and water; ethanol is highly flammable, no flames nearby.',
      draw: () => {
        let o = `<rect x="10" y="8" width="680" height="38" rx="10" fill="${navy}"/>`;
        o += `<g fill="none" stroke="#ffffff" stroke-width="2.5"><path d="M168 27 H150 M232 27 H250"/><ellipse cx="184" cy="27" rx="16" ry="11"/><ellipse cx="216" cy="27" rx="16" ry="11"/></g>`;
        o += L(270, 35, 'Eye protection on throughout', { a: 'start', style: 'fill:#ffffff' });
        const st = [['A', 'Pupil tests', 'iodine + Biuret', ['Biuret: corrosive', 'rinse any splashes']], ['B', 'Water bath', 'Benedict’s test', ['Hot water: use', 'a test-tube holder']], ['C', 'Teacher demo', 'ethanol emulsion', ['Ethanol: flammable', 'no flames nearby']]];
        st.forEach(([k, title, sub, safe], i) => {
          const x0 = 8 + i * 229, cx = x0 + 111;
          o += panel(x0, 56, 222, 278);
          o += `<circle cx="${x0 + 26}" cy="84" r="16" fill="${gold}"/>` + L(x0 + 26, 92, k, { style: 'fill:#ffffff' }) + L(x0 + 50, 92, title, { a: 'start' });
          o += T(cx, 120, sub);
          if (k === 'A') {
            o += `<rect x="${x0 + 18}" y="140" width="96" height="70" rx="8" fill="#ffffff" stroke="${navy}" stroke-width="2"/>`;
            [[0, 0, R.blueBlack], [1, 0, R.iodine], [2, 0, R.blueBlack], [0, 1, R.iodine], [1, 1, R.iodine], [2, 1, R.blueBlack]].forEach(([c, r, col]) => { o += `<circle cx="${x0 + 38 + c * 28}" cy="${162 + r * 28}" r="10" fill="${col}" stroke="${navy}" stroke-width="1.5"/>`; });
            o += `<rect x="${x0 + 132}" y="140" width="72" height="70" rx="8" fill="#e9dcc0" stroke="${navy}" stroke-width="2"/>`;
            [[0, 0, R.purple], [1, 0, R.biuret], [0, 1, R.biuret], [1, 1, R.purple]].forEach(([c, r, col]) => { o += `<circle cx="${x0 + 153 + c * 30}" cy="${161 + r * 28}" r="10" fill="${col}" stroke="${navy}" stroke-width="1.5"/>`; });
            o += T(x0 + 66, 238, 'iodine: tile') + T(x0 + 168, 238, 'Biuret');
          }
          if (k === 'B') {
            o += `<rect x="${x0 + 33}" y="138" width="156" height="78" rx="12" fill="${water}" stroke="${navy}" stroke-width="2.5"/>`;
            [R.benedict, R.green, R.orange, R.brick].forEach((col, j) => { o += `<circle cx="${x0 + 66 + j * 30}" cy="163" r="10" fill="${col}" stroke="${navy}" stroke-width="1.5"/>`; });
            o += T(cx, 204, '~80 °C, 5 min', { style: B });
            o += T(cx, 238, 'start it first', { style: `${B};fill:${goldInk}` });
          }
          if (k === 'C') {
            o += `<circle cx="${x0 + 44}" cy="172" r="20" fill="#f4f4ee" stroke="${navy}" stroke-width="2.5"/><circle cx="${x0 + 44}" cy="172" r="8" fill="#c7cbd3" stroke="${navy}" stroke-width="1.5"/>`;
            o += `<circle cx="${x0 + 116}" cy="172" r="24" fill="${water}" stroke="${navy}" stroke-width="2.5"/>`;
            o += `<rect x="${x0 + 158}" y="148" width="50" height="48" rx="6" fill="#e9dcc0" stroke="${navy}" stroke-width="2"/><circle cx="${x0 + 183}" cy="161" r="8" fill="${R.emulsion}" stroke="${navy}" stroke-width="1.5"/><circle cx="${x0 + 183}" cy="183" r="8" fill="${R.clear}" stroke="${navy}" stroke-width="1.5"/>`;
            o += T(x0 + 44, 222, 'ethanol') + T(x0 + 116, 222, 'water') + T(x0 + 183, 222, 'tubes');
          }
          o += T(cx, 290, safe[0], { style: `${B};fill:${roseInk}` }) + T(cx, 312, safe[1]);
        });
        return o;
      }
    }
  };

  function render(name, state) {
    const f = figures[name];
    if (!f) return '';
    const s = state || {};
    const mk = `bio-arrow-${name}${uid++ ? '-' + uid : ''}`;
    const label = String(f.label(s)).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    return `<svg viewBox="0 0 ${f.vb[0]} ${f.vb[1]}" role="img" aria-label="${label}"><defs><marker id="${mk}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="${navy}"/></marker></defs>${f.draw(s, mk)}</svg>`;
  }
  return { render, names: Object.keys(figures) };
})();
