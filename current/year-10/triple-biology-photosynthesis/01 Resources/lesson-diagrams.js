/* Lesson 01 · Photosynthesis and its equations — original schematic SVG diagrams (Edu OS, October 2026).
   Drawn from scratch for this lesson; no third-party artwork. Shapes, sizes and colours are schematic.
   Locked series colours: light #d8b23a · CO2 #6b7280 · O2 #24748d · water #3d7cc9 · glucose/starch #bd8126 ·
   chloroplast/chlorophyll #56834b. Atoms: C #3a3f4a · O #ad5c63 · H #e8e4da.
   API: BioDiagrams.render(name, state) → SVG string. state.step highlights balance/examModel;
   state.stage and state.highlight drive atomsFallback (the static version of the 3D atom model). */
window.BioDiagrams = (() => {
  const navy = '#182944', rose = '#ad5c63', roseInk = '#8f3f47', goldInk = '#7d5210', muted = '#4a5566';
  const C = { light: '#d8b23a', co2: '#6b7280', o2: '#24748d', water: '#3d7cc9', glucose: '#bd8126', chloro: '#56834b' };
  const ATOM = { C: '#3a3f4a', O: '#ad5c63', H: '#e8e4da' };
  const card = '#fffdf8', tint = '#f6e8c9', okInk = '#2f6b3a';
  let uid = 0;

  /* ---------- primitives ---------- */
  const T = (x, y, s, o = {}) => `<text x="${x}" y="${y}" class="${o.cls || 'diagram-small'}" text-anchor="${o.a || 'middle'}"${o.style ? ` style="${o.style}"` : ''}>${s}</text>`;
  const L = (x, y, s, o = {}) => T(x, y, s, { cls: 'diagram-label', ...o });
  const B = 'font-weight:700';
  const arrow = (x1, y1, x2, y2, mk, col = navy, w = 3, dash = '') => `<path d="M${x1} ${y1} L${x2} ${y2}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ''} marker-end="url(#${mk}-${col.slice(1)})"/>`;
  const panel = (x, y, w, h, on = false, rx = 12) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${on ? tint : card}" stroke="${on ? C.glucose : navy}" stroke-opacity="${on ? 1 : 0.24}" stroke-width="${on ? 3.5 : 1.5}"/>`;
  /* Formula with subscripts: parts = [[text, sub], …]; a part with no sub is plain text. */
  const F = (x, y, parts, o = {}) => {
    let low = false;
    const spans = parts.map(([t, sub, col]) => {
      let out = `<tspan${low ? ' dy="-5"' : ''}${col ? ` style="fill:${col}"` : ''}>${t}</tspan>`; low = false;
      if (sub) { out += `<tspan dy="5" style="font-size:16px${col ? `;fill:${col}` : ''}">${sub}</tspan>`; low = true; }
      return out;
    }).join('');
    return `<text x="${x}" y="${y}" class="${o.cls || 'diagram-label'}" text-anchor="${o.a || 'middle'}"${o.style ? ` style="${o.style}"` : ''}>${spans}</text>`;
  };
  const atom = (x, y, el, r, op = 1) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="${ATOM[el]}" stroke="${navy}" stroke-width="1.4"${op < 1 ? ` opacity="${op}"` : ''}/>`;
  const bond = (a, b, op = 1, w = 2.5) => `<path d="M${a[0].toFixed(1)} ${a[1].toFixed(1)} L${b[0].toFixed(1)} ${b[1].toFixed(1)}" stroke="#9a927f" stroke-width="${w}" stroke-linecap="round"${op < 1 ? ` opacity="${op}"` : ''}/>`;

  /* Glucose (ring form) in model units: 5 C + 1 O ring, with H and OH groups. Exactly C6H12O6 (24 atoms).
     Same layout as the 3D model. y is up. */
  const pol = (o, ang, r) => [o[0] + r * Math.cos(ang * Math.PI / 180), o[1] + r * Math.sin(ang * Math.PI / 180)];
  function glucoseAtoms() {
    const ring = { O5: 30, C1: -30, C2: -90, C3: -150, C4: 150, C5: 90 };
    const P = {}; Object.entries(ring).forEach(([k, a]) => { P[k] = pol([0, 0], a, 0.72); });
    const atoms = [], bonds = [];
    const add = (id, el, p) => { atoms.push({ id, el, p }); return id; };
    ['O5', 'C1', 'C2', 'C3', 'C4', 'C5'].forEach(k => add(k, k[0], P[k]));
    [['O5', 'C1'], ['C1', 'C2'], ['C2', 'C3'], ['C3', 'C4'], ['C4', 'C5'], ['C5', 'O5']].forEach(b => bonds.push(b));
    ['C1', 'C2', 'C3', 'C4'].forEach((k, i) => {
      const a = ring[k], o = pol(P[k], a + 25, 0.62), h = pol(o, a + 25, 0.42), hc = pol(P[k], a - 35, 0.5);
      add('O' + (i + 1), 'O', o); add('HO' + (i + 1), 'H', h); add('H' + (i + 1), 'H', hc);
      bonds.push([k, 'O' + (i + 1)], ['O' + (i + 1), 'HO' + (i + 1)], [k, 'H' + (i + 1)]);
    });
    const c6 = pol(P.C5, 135, 0.75), o6 = pol(c6, 185, 0.62);
    add('H5', 'H', pol(P.C5, 55, 0.5)); add('C6', 'C', c6); add('O6', 'O', o6); add('HO6', 'H', pol(o6, 150, 0.42));
    add('H6a', 'H', pol(c6, 60, 0.48)); add('H6b', 'H', pol(c6, 120, 0.48));
    bonds.push(['C5', 'H5'], ['C5', 'C6'], ['C6', 'O6'], ['O6', 'HO6'], ['C6', 'H6a'], ['C6', 'H6b']);
    return { atoms, bonds };
  }
  function glucoseSVG(cx, cy, s, hi) {
    const g = glucoseAtoms(), by = Object.fromEntries(g.atoms.map(a => [a.id, a]));
    const xy = p => [cx + p[0] * s, cy - p[1] * s];
    const op = el => (hi && hi !== 'none' && hi !== el ? 0.18 : 1);
    let o = g.bonds.map(([a, b]) => bond(xy(by[a].p), xy(by[b].p), hi && hi !== 'none' ? 0.35 : 1)).join('');
    o += g.atoms.map(a => atom(...xy(a.p), a.el, a.el === 'H' ? s * 0.13 : s * 0.19, op(a.el))).join('');
    return o;
  }
  const co2SVG = (x, y, r, hi) => { const op = el => (hi && hi !== 'none' && hi !== el ? 0.18 : 1); const d = r * 2; return bond([x - d, y - 2.5], [x + d, y - 2.5], 1, 2) + bond([x - d, y + 2.5], [x + d, y + 2.5], 1, 2) + atom(x - d, y, 'O', r, op('O')) + atom(x + d, y, 'O', r, op('O')) + atom(x, y, 'C', r, op('C')); };
  const h2oSVG = (x, y, r, hi) => { const op = el => (hi && hi !== 'none' && hi !== el ? 0.18 : 1); const h1 = [x - r * 1.45, y + r * 1.1], h2 = [x + r * 1.45, y + r * 1.1]; return bond([x, y], h1, 1, 2) + bond([x, y], h2, 1, 2) + atom(...h1, 'H', r * 0.68, op('H')) + atom(...h2, 'H', r * 0.68, op('H')) + atom(x, y, 'O', r, op('O')); };
  const o2SVG = (x, y, r, hi) => { const op = el => (hi && hi !== 'none' && hi !== el ? 0.18 : 1); return bond([x - r, y - 2.5], [x + r, y - 2.5], 1, 2) + bond([x - r, y + 2.5], [x + r, y + 2.5], 1, 2) + atom(x - r, y, 'O', r, op('O')) + atom(x + r, y, 'O', r, op('O')); };
  const drop = (x, y, s = 1) => `<path d="M${x} ${y - 9 * s} C${x + 6 * s} ${y - 1 * s} ${x + 6 * s} ${y + 6 * s} ${x} ${y + 6 * s} C${x - 6 * s} ${y + 6 * s} ${x - 6 * s} ${y - 1 * s} ${x} ${y - 9 * s} Z" fill="${C.water}"/>`;

  /* Clay pot with soil; x = centre, y = rim. */
  function pot(x, y, w, h) {
    const b = w * 0.36;
    return `<path d="M${x - w / 2} ${y} L${x + w / 2} ${y} L${x + b} ${y + h} L${x - b} ${y + h} Z" fill="#c07a4f" stroke="${navy}" stroke-width="2.5" stroke-linejoin="round"/>` +
      `<rect x="${x - w / 2 - 6}" y="${y - 8}" width="${w + 12}" height="14" rx="3" fill="#b06a41" stroke="${navy}" stroke-width="2.5"/>` +
      `<ellipse cx="${x}" cy="${y - 8}" rx="${w / 2}" ry="7" fill="#6e5136" stroke="${navy}" stroke-width="1.5"/>`;
  }
  const leaf = (x, y, rx, ry, rot, col = C.chloro) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" transform="rotate(${rot} ${x} ${y})" fill="${col}" stroke="#3d5e35" stroke-width="1.5"/>`;

  /* ---------- figures ---------- */
  const figures = {
    willow: {
      vb: [640, 340],
      label: () => 'Van Helmont’s willow experiment, published 1648, historical data rounded. Left: a willow sapling planted in a pot of weighed dry soil. Right, after 5 years with only rainwater added: the tree has gained about 74 kilograms, but the dry soil has lost only about 0.06 kilograms.',
      draw: (s, mk) => {
        let o = '';
        o += L(150, 32, 'Start', { style: B }) + L(470, 32, 'After 5 years', { style: B });
        // left: sapling
        o += pot(150, 204, 150, 64);
        o += `<path d="M150 196 C149 178 151 165 150 150" stroke="#6b4a2b" stroke-width="5" fill="none" stroke-linecap="round"/>`;
        o += leaf(140, 152, 12, 5, -35) + leaf(161, 146, 12, 5, 30) + leaf(146, 166, 11, 4.5, -20) + leaf(158, 176, 11, 4.5, 25) + leaf(150, 140, 10, 4, -80);
        o += T(150, 120, 'willow sapling');
        o += T(150, 300, 'dry soil weighed', { style: B });
        // middle arrow
        o += arrow(258, 170, 330, 170, mk) + T(294, 156, '5 years');
        // right: grown tree in the same pot
        o += pot(470, 204, 150, 64);
        o += `<path d="M470 198 C467 172 473 150 470 112 M470 140 C482 128 496 122 512 112 M470 132 C458 122 444 116 428 108" stroke="#6b4a2b" stroke-width="9" fill="none" stroke-linecap="round"/>`;
        [[470, 88, 60, 34], [422, 102, 38, 24], [520, 100, 40, 24], [446, 70, 34, 20], [498, 68, 36, 20]].forEach(([x, y, rx, ry]) => { o += `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${C.chloro}" fill-opacity=".92" stroke="#3d5e35" stroke-width="1.5"/>`; });
        o += `<rect x="404" y="70" width="132" height="34" rx="8" fill="${card}" stroke="${navy}" stroke-width="2"/>` + L(470, 95, 'tree +74 kg', { style: `${B};fill:${goldInk}` });
        // rain
        [[572, 112], [592, 136], [574, 160], [600, 184]].forEach(([x, y]) => { o += drop(x, y, 1.1); });
        o += T(596, 222, 'only', { style: `fill:${C.water};${B}` }) + T(596, 242, 'rainwater', { style: `fill:${C.water};${B}` });
        o += T(470, 300, 'dry soil: −0.06 kg', { style: `${B};fill:${roseInk}` });
        o += T(320, 330, 'Historical data, rounded (van Helmont, published 1648)', { style: `fill:${muted}` });
        return o;
      }
    },

    atomsFallback: {
      vb: [640, 340],
      label: s => {
        const st = s.stage || 'reactants';
        const where = st === 'reactants' ? 'The reactant side is highlighted.' : st === 'light' ? 'The arrow is highlighted: light energy is absorbed by chlorophyll and the atoms rearrange.' : 'The product side is highlighted: chemical energy is stored in glucose.';
        return `Photosynthesis atom model, static version. Left: six carbon dioxide molecules and six water molecules. Arrow labelled light above and chlorophyll below. Right: one glucose molecule, C6H12O6, as a ring of five carbons and one oxygen with H and OH groups, and six oxygen molecules. Atom counts: carbon 6 and 6, hydrogen 12 and 12, oxygen 18 and 18. ${where}${s.highlight && s.highlight !== 'none' ? ` Only ${({ C: 'carbon', H: 'hydrogen', O: 'oxygen' })[s.highlight]} atoms are shown at full strength.` : ''}`;
      },
      draw: (s, mk) => {
        const st = s.stage || 'reactants', hi = s.highlight || 'none';
        let o = panel(12, 40, 236, 222, st === 'reactants') + panel(372, 40, 256, 222, st === 'products');
        if (st === 'light') o += `<rect x="252" y="96" width="116" height="110" rx="12" fill="${C.light}" fill-opacity=".22" stroke="${C.light}" stroke-width="3"/>`;
        [100, 150, 200].forEach(y => { [52, 116].forEach(x => { o += co2SVG(x, y, 8, hi); }); [174, 220].forEach(x => { o += h2oSVG(x, y - 4, 8, hi); }); });
        o += F(84, 248, [['6CO', '2']], { style: `fill:${C.co2}` }) + F(198, 248, [['6H', '2'], ['O']], { style: `fill:${C.water}` });
        o += L(140, 30, 'Reactants', { style: B }) + L(500, 30, 'Products', { style: B });
        o += arrow(262, 152, 358, 152, mk, navy, 4) + T(310, 136, 'light', { style: `${B};fill:${goldInk}` }) + T(310, 178, 'chlorophyll', { style: `${B};fill:#3d5e35` });
        o += glucoseSVG(458, 146, 38, hi);
        [[566, 104], [566, 152], [566, 200], [608, 104], [608, 152], [608, 200]].forEach(([x, y]) => { o += o2SVG(x, y, 8, hi); });
        o += F(458, 248, [['C', '6'], ['H', '12'], ['O', '6']], { style: `fill:${goldInk}` }) + F(587, 248, [['6O', '2']], { style: `fill:${C.o2}` });
        const rowOn = el => (hi === el ? `${B};fill:${navy}` : hi === 'none' ? B : `fill:${muted}`);
        o += `<rect x="40" y="276" width="560" height="56" rx="10" fill="${card}" stroke="${navy}" stroke-opacity=".3"/>`;
        o += T(130, 310, 'Carbon 6 → 6', { style: rowOn('C') }) + T(320, 310, 'Hydrogen 12 → 12', { style: rowOn('H') }) + T(510, 310, 'Oxygen 18 → 18', { style: rowOn('O') });
        return o;
      }
    },

    balance: {
      vb: [640, 340],
      label: s => {
        const k = s.step || 0;
        return ['Step 1 of 5: the word equation, carbon dioxide plus water gives glucose plus oxygen, with light above the arrow and chlorophyll below. The atom table is empty.',
          'Step 2 of 5: formulae, CO2 plus H2O gives C6H12O6 plus O2, not yet balanced. The atom table shows question marks.',
          'Step 3 of 5: atom count of the unbalanced formulae. Reactants: carbon 1, hydrogen 2, oxygen 3. Products: carbon 6, hydrogen 12, oxygen 8. Not balanced.',
          'Step 4 of 5: balanced equation 6CO2 plus 6H2O gives C6H12O6 plus 6O2. Carbon 6 equals 6, hydrogen 12 equals 12, oxygen 18 equals 18.',
          'Step 5 of 5: your turn. To make two glucose molecules, how many carbon dioxide and water molecules are used and how many oxygen molecules are released? The numbers are left blank.'][Math.min(k, 4)];
      },
      draw: (s, mk) => {
        const k = Math.min(s.step || 0, 4);
        let o = panel(16, 8, 608, 82, k <= 1 || k === 3);
        if (k === 0) {
          o += L(320, 62, 'carbon dioxide + water → glucose + oxygen');
          o += T(334, 34, 'light', { style: `${B};fill:${goldInk}` }) + T(334, 84, 'chlorophyll', { style: `${B};fill:#3d5e35` });
        } else if (k <= 2) {
          o += F(320, 60, [['CO', '2'], [' + H', '2'], ['O → C', '6'], ['H', '12'], ['O', '6'], [' + O', '2']]);
        } else {
          const g = goldInk;
          o += F(320, 60, [['6', '', g], ['CO', '2'], [' + '], ['6', '', g], ['H', '2'], ['O → C', '6'], ['H', '12'], ['O', '6'], [' + '], ['6', '', g], ['O', '2']]);
        }
        // atom table
        const on = k === 2 || k === 3;
        o += panel(110, 104, 420, 168, on);
        const xs = [170, 290, 410, 492];
        o += T(xs[0], 134, 'Atom', { style: B }) + T(xs[1], 134, 'Reactants', { style: B }) + T(xs[2], 134, 'Products', { style: B }) + T(xs[3], 134, 'Equal?', { style: B });
        o += `<path d="M126 146 H514" stroke="${navy}" stroke-opacity=".35" stroke-width="1.5"/>`;
        const rows = [['C', 'Carbon'], ['H', 'Hydrogen'], ['O', 'Oxygen']];
        const vals = k === 0 ? [['–', '–'], ['–', '–'], ['–', '–']] : k === 1 ? [['?', '?'], ['?', '?'], ['?', '?']] : k === 2 ? [['1', '6'], ['2', '12'], ['3', '8']] : [['6', '6'], ['12', '12'], ['18', '18']];
        rows.forEach(([el, name], i) => {
          const y = 176 + i * 36, [l, r] = vals[i];
          o += `<circle cx="${xs[0] - 46}" cy="${y - 6}" r="9" fill="${ATOM[el]}" stroke="${navy}" stroke-width="1.4"/>` + T(xs[0] + 12, y, name);
          o += L(xs[1], y + 2, l) + L(xs[2], y + 2, r);
          if (k >= 2) o += T(xs[3], y, l === r ? 'yes' : 'no', { style: `${B};fill:${l === r ? okInk : roseInk}` });
        });
        const tips = ['Light and chlorophyll are conditions: they go by the arrow.', 'Never change a formula. Add numbers in front instead.', 'Unequal counts: atoms cannot appear or vanish.', 'C 6 = 6 · H 12 = 12 · O 18 = 18. Balanced.'];
        if (k < 4) o += T(320, 312, tips[k], { style: k === 3 ? `${B};fill:${okInk}` : '' });
        else {
          o += panel(40, 284, 560, 50, true);
          o += F(320, 317, [['? CO', '2'], [' + ? H', '2'], ['O → 2 C', '6'], ['H', '12'], ['O', '6'], [' + ? O', '2']], { cls: 'diagram-small', style: B });
        }
        return o;
      }
    },

    chloroplastFlow: {
      vb: [640, 340],
      label: () => 'Series diagram: a palisade mesophyll cell with many chloroplasts; one chloroplast is enlarged. Light energy, in yellow, arrives from above and is absorbed by chlorophyll. Carbon dioxide, grey, diffuses in. Water, blue, arrives from the roots. Glucose, gold, is made and can be stored as starch. Oxygen, teal, diffuses out. Schematic, not to scale.',
      draw: (s, mk) => {
        let o = '';
        // palisade cell
        o += `<rect x="36" y="44" width="126" height="250" rx="22" fill="#eef3e4" stroke="#3d5e35" stroke-width="4"/>`;
        o += `<rect x="58" y="70" width="82" height="196" rx="16" fill="#dbe9f1" stroke="${navy}" stroke-opacity=".35" stroke-width="1.5"/>`;
        o += `<ellipse cx="99" cy="250" rx="13" ry="10" fill="#c9b8d6" stroke="${navy}" stroke-width="1.5"/>`;
        [[48, 70], [48, 112], [48, 156], [48, 200], [48, 244], [150, 92], [150, 138], [150, 184], [150, 228], [99, 58]].forEach(([x, y], i) => {
          o += `<ellipse cx="${x}" cy="${y}" rx="${i === 9 ? 13 : 7}" ry="${i === 9 ? 7 : 13}" fill="${C.chloro}" stroke="#3d5e35" stroke-width="${i === 5 ? 3 : 1.2}"/>`;
        });
        o += T(99, 318, 'palisade cell', { style: B });
        // zoom lines from chloroplast at (150,92)
        o += `<path d="M157 82 L345 124 M157 102 L305 150" stroke="${navy}" stroke-opacity=".45" stroke-width="1.5" stroke-dasharray="5 5"/>`;
        // enlarged chloroplast
        o += `<ellipse cx="420" cy="186" rx="130" ry="76" fill="#a9c79a" stroke="#3d5e35" stroke-width="4"/>`;
        [[338, 186], [372, 146], [468, 146], [502, 186], [372, 228], [468, 228]].forEach(([x, y]) => { for (let k = 0; k < 4; k++) o += `<rect x="${x - 15}" y="${y - 12 + k * 6}" width="30" height="5" rx="2" fill="${C.chloro}" stroke="#2f4a29" stroke-width=".8"/>`; });
        o += `<rect x="362" y="166" width="116" height="50" rx="8" fill="${card}" fill-opacity=".92"/>` + T(420, 186, 'chlorophyll', { style: `${B};fill:#2f4a29` }) + T(420, 207, 'absorbs light', { style: 'fill:#2f4a29' });
        o += T(262, 90, 'chloroplast', { style: B });
        // light in (gold, from above)
        o += arrow(372, 18, 384, 104, mk, C.light, 5) + arrow(420, 14, 420, 102, mk, C.light, 5) + arrow(468, 18, 456, 104, mk, C.light, 5);
        o += T(300, 30, 'light energy', { style: `${B};fill:${goldInk}` });
        // CO2 in (grey, from the left)
        o += arrow(196, 170, 282, 170, mk, C.co2, 4) + T(236, 158, 'CO₂ in', { style: `${B};fill:${C.co2}` }) + T(236, 194, 'diffusion', { style: `fill:${C.co2}` });
        // water in (blue, from below)
        o += arrow(420, 334, 420, 270, mk, C.water, 4) + T(340, 306, 'water', { style: `${B};fill:${C.water}` }) + T(340, 326, 'from roots', { style: `fill:${C.water}` });
        // glucose out (gold, right)
        o += arrow(552, 186, 616, 186, mk, C.glucose, 5) + T(590, 172, 'glucose', { style: `${B};fill:${goldInk}` }) + T(594, 212, '→ starch', { style: `fill:${goldInk}` });
        // O2 out (teal, up right)
        o += arrow(512, 124, 566, 62, mk, C.o2, 4) + T(584, 52, 'O₂ out', { style: `${B};fill:${C.o2}` });
        return o;
      }
    },

    examModel: {
      vb: [640, 340],
      label: s => {
        const k = s.step || 0;
        return `Writing frame for an explain question worth 3 marks, step ${Math.min(k, 4) + 1} of 5. ${['The command word explain means give reasons; three marks means three linked points.', 'Line 1 is written: in the light the seedling photosynthesises and takes in carbon dioxide. One mark.', 'Line 2 is written: light energy is used to make glucose from carbon dioxide and water. One mark.', 'A rejected line is shown: it gets its food from the soil. Rejected because soil supplies water and a tiny mass of mineral ions, not food; the plant makes its own food by photosynthesis.', 'Line 3 is written: glucose is converted into starch and cellulose, which build new cells, so dry mass increases. One mark.'][Math.min(k, 4)]}`;
      },
      draw: (s) => {
        const k = Math.min(s.step || 0, 4);
        let o = panel(16, 6, 608, 44, k === 0, 10) + T(320, 35, '<tspan style="font-weight:700">Explain</tspan> = give reasons · 3 marks = 3 linked points', { style: '' });
        const lines = [
          { y: 62, n: '1', show: 1, a: 'In the light, the seedling photosynthesises', b: 'and takes in CO₂ from the air.', mark: '[1]' },
          { y: 130, n: '2', show: 2, a: 'Light energy is used to make glucose', b: 'from carbon dioxide and water.', mark: '[1]' },
          { y: 198, n: '✗', show: 3, a: 'Rejected: “It gets its food from the soil.”', b: 'Soil gives water and mineral ions, not food; plants make food.', mark: '0', bad: true },
          { y: 266, n: '3', show: 4, a: 'Glucose → starch and cellulose → new cells,', b: 'so the dry mass increases.', mark: '[1]' }
        ];
        lines.forEach(l => {
          const on = k === l.show, seen = k >= l.show;
          o += `<rect x="16" y="${l.y}" width="608" height="60" rx="10" fill="${on ? (l.bad ? '#fbf0ef' : tint) : card}" stroke="${on ? (l.bad ? rose : '#bd8126') : navy}" stroke-opacity="${on ? 1 : 0.24}" stroke-width="${on ? 3.5 : 1.5}"${l.bad ? ' stroke-dasharray="7 5"' : ''}/>`;
          o += T(42, l.y + 37, l.n === '✗' ? '×' : l.n, { style: `${B};font-size:22px;fill:${l.bad ? roseInk : goldInk}` });
          if (seen) {
            o += T(70, l.y + 25, l.a, { a: 'start', style: l.bad ? `fill:${roseInk};${B}` : '' }) + T(70, l.y + 48, l.b, { a: 'start', style: l.bad ? `fill:${roseInk}` : '' });
            o += T(l.bad ? 612 : 596, l.y + 37, l.mark, { a: 'end', style: `${B};fill:${l.bad ? roseInk : goldInk}` });
          } else o += T(70, l.y + 37, l.bad ? 'A weak line to avoid…' : 'Line ' + l.n + ' …', { a: 'start', style: `fill:${muted}` });
        });
        return o;
      }
    }
  };

  function render(name, state) {
    const f = figures[name];
    if (!f) return '';
    const s = state || {};
    const mk = `bio-arrow-${name}-${uid++}`;
    const label = String(f.label(s)).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const cols = [navy, C.light, C.co2, C.o2, C.water, C.glucose];
    const markers = cols.map(col => `<marker id="${mk}-${col.slice(1)}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="${col}"/></marker>`).join('');
    return `<svg viewBox="0 0 ${f.vb[0]} ${f.vb[1]}" role="img" aria-label="${label}"><defs>${markers}</defs>${f.draw(s, mk)}</svg>`;
  }
  return { render, names: Object.keys(figures), glucoseAtoms };
})();
