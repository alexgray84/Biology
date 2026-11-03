/* Lesson 05 · How do we know what a plant needs? Original schematic SVG diagrams (no third-party images or photos).
   BioDiagrams.render(name, state) returns an inline SVG string. Shapes, sizes and colours are schematic.
   Locked series colours: light #d8b23a · CO₂ #6b7280 · O₂ #24748d · water #3d7cc9 · glucose/starch #bd8126 · chlorophyll #56834b.
   Iodine colours: blue-black #1f2540 (starch present) · orange-brown #c7742c (no starch). An ethanol-treated leaf is pale cream.
   Every iodine-stained leaf is labelled "Results from a starch test": the evidence in this lesson is secondary (no live test).
   Step-aware figures read state.step:
     starchSteps     0 cards A–F shuffled (sort) · 1 destarch · 2 boil · 3 ethanol · 4 rinse · 5 tile + iodine
     foilLeaf        0 set-up (result hidden) · 1 result · 2 claim · 3 support (weak v strong) · 4 question
     guidedEvidence  0–1 variegated leaf (before and results) · 2–3 soda-lime bag v control (set-up and results)
     mineralPlants   0 set-up · 1 no magnesium · 2 no nitrate · 3 non-example: two differences
   With no step (reading and question pages) every part is shown and nothing is highlighted. */
window.BioDiagrams = (() => {
  const C = {
    navy: '#182944', teal: '#24748d', green: '#56834b', gold: '#bd8126', rose: '#ad5c63',
    light: '#d8b23a', co2: '#6b7280', o2: '#24748d', water: '#3d7cc9', glucose: '#bd8126', chloro: '#56834b',
    goldText: '#8a5a14', paper: '#fbf8f0', line: '#b9b09c', waterFill: '#dbe7f6',
    starch: '#1f2540', noStarch: '#c7742c', brownText: '#8a4a12', bleached: '#efe5c2', white: '#f6f3e6', foil: '#b9bec7', yellow: '#d6bf3c', paleGreen: '#7fa463'
  };
  const r1 = v => Math.round(v * 10) / 10;
  const hasStep = s => s && Number.isInteger(s.step);
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

  function T(x, y, str, o = {}) {
    const cls = o.cls !== undefined ? o.cls : (o.small ? 'diagram-small' : 'diagram-label');
    const size = o.size || (cls === 'diagram-small' || o.small ? 17 : 22);
    const weight = o.weight || (cls === 'diagram-small' || o.small ? 500 : 650);
    const fill = o.fill || C.navy;
    const style = [];
    if (fill !== C.navy) style.push(`fill:${fill}`);
    if (cls && o.weight) style.push(`font-weight:${o.weight}`);
    if (cls && o.size) style.push(`font-size:${o.size}px`);
    return `<text x="${r1(x)}" y="${r1(y)}"${cls ? ` class="${cls}"` : ''} text-anchor="${o.anchor || 'middle'}" font-size="${size}" font-weight="${weight}" fill="${fill}"${style.length ? ` style="${style.join(';')}"` : ''}>${str}</text>`;
  }
  const P = (d, o = {}) => `<path d="${d}" fill="${o.fill || 'none'}" stroke="${o.stroke || C.navy}" stroke-width="${o.w || 3}" stroke-linecap="round" stroke-linejoin="round"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}${o.marker ? ` marker-end="url(#${o.marker})"` : ''}${o.opacity !== undefined ? ` opacity="${o.opacity}"` : ''}/>`;
  const marker = (id, color) => `<marker id="${id}" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="4.6" markerHeight="4.6" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="${color}"/></marker>`;
  const badge = (x, y, num, on) => `<circle cx="${x}" cy="${y}" r="14" fill="${on ? C.navy : C.paper}" stroke="${on ? C.gold : C.navy}" stroke-width="${on ? 3.5 : 2}"/>` + T(x, y + 6, String(num), { cls: '', size: 17, weight: 750, fill: on ? '#ffffff' : C.navy });
  const letter = (x, y, ch) => `<rect x="${x - 15}" y="${y - 15}" width="30" height="30" rx="6" fill="${C.navy}" stroke="${C.gold}" stroke-width="2.5"/>` + T(x, y + 7, ch, { cls: '', size: 19, weight: 800, fill: '#f1c96f' });

  /* a horizontal leaf, stalk on the left: x0 = left tip, w = length, h = width */
  const leafD = (x0, cy, w, h) => `M${r1(x0)} ${r1(cy)}C${r1(x0 + w * .22)} ${r1(cy - h * .78)} ${r1(x0 + w * .72)} ${r1(cy - h * .7)} ${r1(x0 + w)} ${r1(cy)}C${r1(x0 + w * .72)} ${r1(cy + h * .7)} ${r1(x0 + w * .22)} ${r1(cy + h * .78)} ${r1(x0)} ${r1(cy)}Z`;
  const leaf = (x0, cy, w, h, fill, o = {}) => P(`M${x0 - 34} ${cy + 6}L${x0} ${cy}`, { stroke: o.stalk || C.green, w: 5 }) + `<path d="${leafD(x0, cy, w, h)}" fill="${fill}" stroke="${o.stroke || C.navy}" stroke-width="2.5"/>` + (o.vein === false ? '' : P(`M${x0 + 6} ${cy}L${x0 + w - 12} ${cy}`, { stroke: o.veinColor || 'rgba(255,255,255,.45)', w: 2 }));
  const clipLeaf = (id, x0, cy, w, h) => `<clipPath id="${id}"><path d="${leafD(x0, cy, w, h)}"/></clipPath>`;
  const swatch = (x, y, col, label) => `<rect x="${x}" y="${y - 15}" width="26" height="20" rx="4" fill="${col}" stroke="${C.navy}" stroke-width="1.5"/>` + T(x + 34, y, label, { small: true, anchor: 'start', weight: 650 });
  const resultsTag = (x, y, anchor = 'start') => T(x, y, 'Results from a starch test', { small: true, weight: 750, anchor, fill: C.goldText });

  const figures = {};

  /* ---------- starch test: card sort, then the method in order ---------- */
  function icon(kind, x, y) { // a picture in a 78 × 96 box, top-left (x, y)
    const cx = x + 39;
    if (kind === 'dark') return `<rect x="${x + 6}" y="${y + 8}" width="66" height="80" rx="6" fill="#2b2f3a"/>` + `<rect x="${cx - 12}" y="${y + 62}" width="24" height="20" fill="#8a5a3a"/>` + P(`M${cx} ${y + 62}V${y + 36}`, { stroke: C.paleGreen, w: 3 }) + `<ellipse cx="${cx - 10}" cy="${y + 40}" rx="10" ry="5" fill="${C.paleGreen}"/><ellipse cx="${cx + 10}" cy="${y + 46}" rx="10" ry="5" fill="${C.paleGreen}"/>` + T(cx, y + 26, '48 h', { cls: '', size: 14, weight: 750, fill: '#f1c96f' });
    if (kind === 'boil') return `<path d="M${x + 12} ${y + 28}V${y + 86}H${x + 66}V${y + 28}" fill="${C.waterFill}" stroke="${C.navy}" stroke-width="2.5"/>` + `<path d="${leafD(x + 22, y + 66, 34, 14)}" fill="${C.green}" stroke="${C.navy}" stroke-width="1.5"/>` + [[24, 48], [42, 42], [56, 52], [32, 80]].map(([a, b]) => `<circle cx="${x + a}" cy="${y + b}" r="3.5" fill="none" stroke="${C.water}" stroke-width="2"/>`).join('') + T(cx, y + 18, '100 °C', { cls: '', size: 14, weight: 750, fill: C.rose });
    if (kind === 'ethanol') return `<path d="M${x + 6} ${y + 30}V${y + 88}H${x + 72}V${y + 30}" fill="${C.waterFill}" stroke="${C.navy}" stroke-width="2.5"/>` + `<path d="M${cx + 6} ${y + 8}V${y + 74}A9 9 0 0 0 ${cx + 24} ${y + 74}V${y + 8}" fill="#e6efd9" stroke="${C.navy}" stroke-width="2"/>` + `<rect x="${cx + 9}" y="${y + 40}" width="12" height="40" fill="${C.green}" opacity=".55"/>` + T(x + 24, y + 48, 'hot', { cls: '', size: 12, weight: 700, fill: C.water }) + T(x + 24, y + 62, 'water', { cls: '', size: 12, weight: 700, fill: C.water });
    if (kind === 'rinse') return `<path d="M${x + 12} ${y + 34}V${y + 86}H${x + 66}V${y + 34}" fill="${C.waterFill}" stroke="${C.navy}" stroke-width="2.5"/>` + `<path d="${leafD(x + 22, y + 64, 34, 14)}" fill="${C.bleached}" stroke="${C.navy}" stroke-width="1.5"/>` + T(cx, y + 24, 'warm', { cls: '', size: 14, weight: 750, fill: C.water });
    if (kind === 'tile') return `<rect x="${x + 4}" y="${y + 40}" width="70" height="46" rx="4" fill="#ffffff" stroke="${C.navy}" stroke-width="2.5"/>` + `<path d="${leafD(x + 14, y + 63, 50, 18)}" fill="${C.bleached}" stroke="${C.navy}" stroke-width="1.5"/>`;
    if (kind === 'iodine') return `<rect x="${x + 4}" y="${y + 56}" width="70" height="34" rx="4" fill="#ffffff" stroke="${C.navy}" stroke-width="2.5"/>` + `<path d="${leafD(x + 14, y + 73, 50, 16)}" fill="${C.starch}" stroke="${C.navy}" stroke-width="1.5"/>` + `<rect x="${cx - 5}" y="${y + 6}" width="10" height="30" rx="3" fill="#ffffff" stroke="${C.navy}" stroke-width="2"/><rect x="${cx - 8}" y="${y + 2}" width="16" height="10" rx="3" fill="${C.navy}"/><circle cx="${cx}" cy="${y + 46}" r="4" fill="${C.noStarch}"/>`;
    return '';
  }
  const CARDS = {
    A: { icon: 'iodine', what: ['Add drops of', 'iodine solution'], why: ['blue-black means', 'starch is there'] },
    B: { icon: 'boil', what: ['Boil the leaf in', 'water, 1 minute'], why: ['kills the cells;', 'stops reactions'] },
    C: { icon: 'dark', what: ['Plant in the dark', 'for about 48 h'], why: ['uses up the', 'starch it had'] },
    D: { icon: 'rinse', what: ['Rinse the leaf', 'in warm water'], why: ['softens the', 'brittle leaf'] },
    E: { icon: 'ethanol', what: ['Warm in ethanol', 'in a hot water bath'], why: ['removes the', 'chlorophyll'] },
    F: { icon: 'tile', what: ['Spread the leaf', 'on a white tile'], why: ['colour is easy', 'to see'] }
  };
  const ORDER = ['C', 'B', 'E', 'D', 'F', 'A'];
  figures.starchSteps = {
    w: 760, h: 420,
    label: s => hasStep(s) && s.step === 0
      ? 'Six shuffled picture cards for the starch test, lettered A to F: A add drops of iodine solution; B boil the leaf in water for 1 minute; C keep the plant in the dark for about 48 hours; D rinse the leaf in warm water; E warm it in ethanol in a hot water bath; F spread the leaf on a white tile.'
      : 'The starch test in order. 1, C: keep the plant in the dark for about 48 hours to use up its starch. 2, B: boil the leaf in water for about a minute to kill the cells and stop reactions. 3, E: warm it in ethanol in a hot water bath, no flames, to remove chlorophyll. 4, D: rinse in warm water to soften it. 5, F: spread it on a white tile. 6, A: add iodine solution; blue-black means starch, orange-brown means no starch.',
    draw(s) {
      const step = hasStep(s) ? s.step : null;
      const sorting = step === 0;
      const shown = step === null ? 6 : [0, 1, 2, 3, 4, 6][Math.min(step, 5)];
      const seq = sorting ? ['A', 'B', 'C', 'D', 'E', 'F'] : ORDER;
      let b = T(380, 28, sorting ? 'Sort the cards: what is the order?' : 'The starch test, in order', { weight: 750 });
      seq.forEach((k, i) => {
        const x = 8 + (i % 3) * 250, y = 44 + Math.floor(i / 3) * 150, card = CARDS[k];
        const open = sorting || i < shown, on = !sorting && step !== null && (i === shown - 1 || (step === 5 && i >= 4));
        if (!open) {
          b += `<rect x="${x}" y="${y}" width="242" height="140" rx="12" fill="none" stroke="${C.line}" stroke-width="2" stroke-dasharray="7 7"/>` + badge(x + 24, y + 24, i + 1, false) + T(x + 121, y + 84, '?', { cls: '', size: 34, weight: 700, fill: C.line });
          return;
        }
        b += `<rect x="${x}" y="${y}" width="242" height="140" rx="12" fill="${on ? '#f6efdd' : C.paper}" stroke="${on ? C.gold : C.navy}" stroke-width="${on ? 3.5 : 2}"/>`;
        b += icon(card.icon, x + 6, y + 38);
        b += letter(x + 24, y + 24, k) + (sorting ? '' : badge(x + 218, y + 24, i + 1, on));
        card.what.forEach((t, j) => { b += T(x + 92, y + 52 + j * 22, t, { cls: '', size: 16, weight: 700, anchor: 'start' }); });
        if (!sorting) card.why.forEach((t, j) => { b += T(x + 92, y + 104 + j * 21, t, { cls: '', size: 15.5, weight: 650, anchor: 'start', fill: /flames/.test(t) ? C.rose : C.goldText }); });
      });
      b += `<rect x="8" y="350" width="744" height="62" rx="10" fill="${C.paper}" stroke="${C.line}" stroke-width="1.5"/>`;
      b += swatch(26, 388, C.starch, 'blue-black: starch') + swatch(232, 388, C.noStarch, 'orange-brown: no starch');
      b += T(744, 378, 'Ethanol is highly flammable:', { small: true, weight: 750, anchor: 'end', fill: C.rose }) + T(744, 401, 'hot water bath, no flames', { small: true, weight: 650, anchor: 'end', fill: C.rose });
      return { defs: '', body: b };
    }
  };

  /* ---------- foil-strip leaf: set-up, result, claim–support–question ---------- */
  figures.foilLeaf = {
    w: 760, h: 430,
    label: s => {
      const step = hasStep(s) ? s.step : null;
      const at = n => step === null || step >= n;
      return 'A destarched leaf with a strip of aluminium foil across the middle, on both sides, left in bright light for 24 hours.' + (at(1) ? ' Results from a starch test: the part that was under the foil is orange-brown, so it has no starch; the rest of the leaf is blue-black, so it has starch.' : ' The result is hidden.') + (at(2) ? ' Claim: light is needed for photosynthesis.' : '') + (at(3) ? ' Weak support: the strip looks different. Strong support: only the covered part has no starch; same leaf, so only light differs.' : '') + (at(4) ? ' Question: did the foil kill the leaf? Rejected: foil only blocks light; remove the foil, give 24 hours of light and retest, and starch appears.' : '');
    },
    draw(s) {
      const step = hasStep(s) ? s.step : null;
      const at = n => step === null || step >= n;
      const defs = clipLeaf('foil-a', 70, 120, 250, 116) + clipLeaf('foil-b', 470, 120, 250, 116) + marker('foil-arr', C.navy);
      let b = T(195, 30, 'Before: foil strip, 24 h light', { small: true, weight: 750 });
      b += leaf(70, 120, 250, 116, C.green);
      b += `<g clip-path="url(#foil-a)"><rect x="168" y="40" width="58" height="160" fill="${C.foil}"/>` + [182, 198, 214].map(x => P(`M${x} 50L${x - 10} 190`, { stroke: '#ffffff', w: 2, opacity: .7 })).join('') + `</g>`;
      b += `<path d="${leafD(70, 120, 250, 116)}" fill="none" stroke="${C.navy}" stroke-width="2.5"/>`;
      b += T(197, 214, 'foil, both sides', { small: true, weight: 650 });
      b += P('M352 120H420', { w: 3, marker: 'foil-arr' }) + T(386, 104, 'starch', { small: true, weight: 650 }) + T(386, 146, 'test', { small: true, weight: 650 });
      if (at(1)) {
        b += resultsTag(595, 30, 'middle');
        b += leaf(470, 120, 250, 116, C.starch, { stalk: C.bleached, veinColor: 'rgba(255,255,255,.25)' });
        b += `<g clip-path="url(#foil-b)"><rect x="568" y="40" width="58" height="160" fill="${C.noStarch}"/></g><path d="${leafD(470, 120, 250, 116)}" fill="none" stroke="${C.navy}" stroke-width="2.5"/>`;
        b += T(521, 126, 'blue-black', { cls: '', size: 15, weight: 700, fill: '#ffffff' }) + T(670, 126, 'blue-black', { cls: '', size: 15, weight: 700, fill: '#ffffff' }) + T(597, 214, 'orange-brown under the foil', { small: true, weight: 700, fill: C.brownText });
      } else {
        b += `<path d="${leafD(470, 120, 250, 116)}" fill="none" stroke="${C.line}" stroke-width="2.5" stroke-dasharray="8 7"/>` + T(595, 134, '?', { cls: '', size: 44, weight: 700, fill: C.line });
      }
      const cols = [
        ['Claim', 2, [['Light is needed for'], ['photosynthesis'], ['(to make starch).']]],
        ['Support', 3, [['✗ weak: “the strip', C.rose], ['looks different”', C.rose], ['✓ strong: only the', C.green], ['covered part has no'], ['starch. Same leaf:'], ['only light differs.']]],
        ['Question', 4, [['“The foil killed the', C.rose], ['leaf”? Reject it:', C.rose], ['foil only blocks light.'], ['Check: remove the foil,'], ['24 h light, retest:'], ['starch appears.']]]
      ];
      cols.forEach(([head, n, lines], i) => {
        const x = 8 + i * 250, on = step === n, open = at(n);
        b += `<rect x="${x}" y="236" width="242" height="186" rx="12" fill="${on ? '#f6efdd' : C.paper}" stroke="${on ? C.gold : open ? C.navy : C.line}" stroke-width="${on ? 3.5 : 2}"${open ? '' : ' stroke-dasharray="7 7"'}/>`;
        b += T(x + 121, 266, head, { weight: 750, fill: open ? C.navy : C.line });
        if (open) lines.forEach(([t, col], j) => { b += T(x + 14, 296 + j * 21, t, { cls: '', size: 15.5, weight: 650, anchor: 'start', fill: col || C.navy }); });
      });
      return { defs, body: b };
    }
  };

  /* ---------- variegated leaf (before and results) ---------- */
  function variegated(id) {
    const defs = marker(id + '-arr', C.navy);
    let b = T(190, 40, 'Before: variegated leaf', { small: true, weight: 750 }) + resultsTag(580, 40, 'middle');
    b += leaf(60, 150, 260, 130, C.white, { vein: false });
    b += `<path d="${leafD(92, 150, 196, 78)}" fill="${C.green}" stroke="none"/>`;
    b += leaf(450, 150, 260, 130, C.noStarch, { vein: false, stalk: C.bleached });
    b += `<path d="${leafD(482, 150, 196, 78)}" fill="${C.starch}" stroke="none"/>`;
    b += P('M352 150H412', { w: 3, marker: id + '-arr' }) + T(382, 134, 'starch', { small: true, weight: 650 }) + T(382, 178, 'test', { small: true, weight: 650 });
    b += P('M230 160L240 262', { w: 1.8 }) + T(240, 284, 'green: chlorophyll', { small: true, weight: 700, fill: C.green });
    b += P('M150 208L140 290', { w: 1.8 }) + T(60, 312, 'white edge: no chlorophyll', { small: true, weight: 700, anchor: 'start' });
    b += P('M620 160L630 262', { w: 1.8 }) + T(630, 284, 'blue-black: starch', { small: true, weight: 700 });
    b += P('M540 208L530 290', { w: 1.8 }) + T(452, 312, 'orange-brown: no starch', { small: true, weight: 700, anchor: 'start', fill: C.brownText });
    b += T(380, 370, 'Same leaf, same light for 24 hours. Only chlorophyll differs between the parts.', { small: true, weight: 650 });
    return { defs, body: b };
  }
  /* ---------- soda-lime bag v control (set-up and results) ---------- */
  function sodaLime(id) {
    const defs = marker(id + '-arr', C.navy);
    let b = '';
    [[190, true], [570, false]].forEach(([cx, soda]) => {
      b += T(cx, 26, soda ? 'Bag with soda lime' : 'Bag without soda lime', { small: true, weight: 750 }) + T(cx, 48, soda ? '(no CO₂ for the leaf)' : '(the control)', { small: true, weight: 650, fill: soda ? C.co2 : C.green });
      b += P(`M${cx - 160} 216H${cx - 62}`, { stroke: C.green, w: 5 }) + T(cx - 150, 204, 'stem', { small: true, anchor: 'start' });
      b += `<path d="M${cx - 66} 200Q${cx - 80} 66 ${cx + 30} 66Q${cx + 150} 66 ${cx + 136} 200Q${cx + 130} 236 ${cx + 30} 236Q${cx - 54} 236 ${cx - 66} 200Z" fill="#ffffff" fill-opacity=".35" stroke="${C.navy}" stroke-width="2" stroke-dasharray="7 5"/>`;
      b += P(`M${cx - 62} 216Q${cx - 66} 170 ${cx - 56} 140`, { stroke: C.green, w: 4 }) + `<path d="${leafD(cx - 56, 140, 150, 64)}" fill="${C.green}" stroke="${C.navy}" stroke-width="2"/>`;
      if (soda) b += `<ellipse cx="${cx + 66}" cy="212" rx="40" ry="12" fill="#e9e4d6" stroke="${C.navy}" stroke-width="2"/>` + [[-22, -2], [-8, -5], [6, -1], [20, -4], [-14, 4], [12, 4]].map(([dx, dy]) => `<circle cx="${cx + 66 + dx}" cy="${208 + dy}" r="4" fill="#ffffff" stroke="${C.co2}" stroke-width="1.5"/>`).join('') + T(cx + 40, 260, 'soda lime absorbs CO₂', { small: true, weight: 650, fill: C.co2 });
      else b += T(cx + 40, 260, 'air with CO₂', { small: true, weight: 650, fill: C.co2 });
      b += P(`M${cx} 270V296`, { w: 3, marker: id + '-arr' });
      b += `<path d="${leafD(cx - 80, 336, 140, 56)}" fill="${soda ? C.noStarch : C.starch}" stroke="${C.navy}" stroke-width="2"/>`;
      b += T(cx + 72, 330, soda ? 'orange-brown:' : 'blue-black:', { small: true, weight: 750, anchor: 'start', fill: soda ? C.brownText : C.navy }) + T(cx + 72, 352, soda ? 'no starch' : 'starch', { small: true, weight: 650, anchor: 'start' });
    });
    b += resultsTag(10, 392) + T(750, 392, 'Same plant, same light, 24 hours', { small: true, weight: 650, anchor: 'end' });
    return { defs, body: b };
  }
  figures.variegated = { w: 760, h: 400, label: 'A variegated leaf with a green centre and a white edge, before and after the starch test. Results from a starch test: the green part, which has chlorophyll, is blue-black, so it has starch; the white edge, with no chlorophyll, is orange-brown, so it has no starch. Same leaf, same light.', draw: () => variegated('vg') };
  figures.sodaLime = { w: 760, h: 400, label: 'Two leaves on the same destarched plant, each sealed in a clear bag, 24 hours in light. One bag holds a dish of soda lime, which absorbs carbon dioxide; the other has none and is the control. Results from a starch test: the leaf with soda lime is orange-brown, no starch; the control leaf is blue-black, starch.', draw: () => sodaLime('sl') };
  figures.guidedEvidence = {
    w: 760, h: 400,
    label: s => (hasStep(s) && s.step >= 2 ? figures.sodaLime.label : figures.variegated.label),
    draw: s => (hasStep(s) && s.step >= 2 ? sodaLime('ge-s') : variegated('ge-v'))
  };

  /* ---------- foil window leaf (recheck: set-up only) ---------- */
  figures.windowLeaf = {
    w: 760, h: 300,
    label: 'A destarched leaf covered on both sides with aluminium foil, except for a square window cut in the middle. The plant is left in bright light for 24 hours, then the leaf is tested for starch. The result is not shown.',
    draw() {
      const defs = clipLeaf('win-a', 70, 150, 330, 150) + marker('win-arr', C.navy);
      let b = leaf(70, 150, 330, 150, C.green);
      b += `<g clip-path="url(#win-a)"><path d="M40 40H420V260H40ZM200 112V188H272V112Z" fill="${C.foil}" fill-rule="evenodd"/>` + [110, 140, 320, 350].map(x => P(`M${x} 70L${x - 14} 230`, { stroke: '#ffffff', w: 2, opacity: .6 })).join('') + `</g>`;
      b += `<path d="${leafD(70, 150, 330, 150)}" fill="none" stroke="${C.navy}" stroke-width="2.5"/><rect x="200" y="112" width="72" height="76" fill="none" stroke="${C.navy}" stroke-width="2" stroke-dasharray="5 4"/>`;
      b += T(236, 34, 'window: light gets in', { small: true, weight: 700 }) + P('M236 42V108', { w: 1.8 }) + T(140, 288, 'foil on both sides', { small: true, weight: 700 }) + P('M140 270L150 206', { w: 1.8 });
      b += P('M440 150H520', { w: 3, marker: 'win-arr' }) + T(480, 134, '24 h light', { small: true, weight: 650 }) + T(480, 178, 'starch test', { small: true, weight: 650 });
      b += `<rect x="548" y="70" width="190" height="160" rx="12" fill="none" stroke="${C.line}" stroke-width="2.5" stroke-dasharray="8 7"/>` + T(643, 168, '?', { cls: '', size: 52, weight: 700, fill: C.line });
      return { defs, body: b };
    }
  };

  /* ---------- mineral ions: seedlings in nutrient solutions ---------- */
  function plant(cx, base, height, leafCol, leafLen, pairs) {
    let b = P(`M${cx} ${base}V${base - height}`, { stroke: C.green, w: 5 });
    for (let k = 0; k < pairs; k++) {
      const y = base - height * (k + 1) / (pairs + .3), len = leafLen * (1 - k * .08);
      b += `<ellipse cx="${r1(cx - len * .55)}" cy="${r1(y)}" rx="${r1(len * .55)}" ry="${r1(len * .22)}" fill="${leafCol}" stroke="${C.navy}" stroke-width="1.5" transform="rotate(-18 ${r1(cx - len * .55)} ${r1(y)})"/>`;
      b += `<ellipse cx="${r1(cx + len * .55)}" cy="${r1(y - 8)}" rx="${r1(len * .55)}" ry="${r1(len * .22)}" fill="${leafCol}" stroke="${C.navy}" stroke-width="1.5" transform="rotate(18 ${r1(cx + len * .55)} ${r1(y - 8)})"/>`;
    }
    return b;
  }
  function jar(cx, label, sub, on) {
    let b = on ? `<rect x="${cx - 118}" y="40" width="236" height="378" rx="14" fill="${C.gold}" fill-opacity=".1" stroke="${C.gold}" stroke-width="3.5"/>` : '';
    b += `<path d="M${cx - 62} 270V352Q${cx - 62} 366 ${cx - 48} 366H${cx + 48}Q${cx + 62} 366 ${cx + 62} 352V270" fill="none" stroke="${C.navy}" stroke-width="3"/>`;
    b += `<path d="M${cx - 60} 288H${cx + 60}V352Q${cx + 60} 364 ${cx + 48} 364H${cx - 48}Q${cx - 60} 364 ${cx - 60} 352Z" fill="${C.waterFill}"/>` + `<rect x="${cx - 70}" y="262" width="140" height="14" rx="4" fill="#d9cfb7" stroke="${C.navy}" stroke-width="2"/>`;
    b += [[-24, 330], [0, 342], [22, 324]].map(([dx, y]) => P(`M${cx} 276Q${cx + dx * .5} ${y - 20} ${cx + dx} ${y}`, { stroke: '#c9b48a', w: 2 })).join('');
    if (label) b += T(cx, 390, label, { small: true, weight: 750 });
    if (sub) b += T(cx, 407, sub, { cls: '', size: 15, weight: 650, fill: C.goldText });
    return b;
  }
  figures.mineralPlants = {
    w: 760, h: 420,
    label: s => {
      const step = hasStep(s) ? s.step : null;
      if (step === 0) return 'Three identical seedlings in jars of nutrient solution: complete; no magnesium; no nitrate. Same light, temperature, volume and time.';
      if (step === 3) return 'Not a fair test: a plant in complete solution on a sunny window next to a plant with no magnesium in a dark cupboard. Two things differ, so no conclusion can be drawn.';
      return 'Illustrative results after four weeks: complete solution, a tall plant with large green leaves; no magnesium, a shorter plant with yellow leaves; no nitrate, a very small plant with few, small leaves.';
    },
    draw(s) {
      const step = hasStep(s) ? s.step : null;
      let b = '';
      if (step === 3) {
        b += `<rect x="40" y="44" width="300" height="340" rx="12" fill="#fff8de" stroke="${C.light}" stroke-width="2"/>` + `<circle cx="300" cy="88" r="22" fill="${C.light}"/>` + [0, 45, 90, 135, 180, 225, 270, 315].map(a => { const r = a * Math.PI / 180; return P(`M${r1(300 + 30 * Math.cos(r))} ${r1(88 + 30 * Math.sin(r))}L${r1(300 + 40 * Math.cos(r))} ${r1(88 + 40 * Math.sin(r))}`, { stroke: C.light, w: 3 }); }).join('');
        b += `<rect x="420" y="44" width="300" height="340" rx="12" fill="#2b2f3a"/>`;
        b += jar(190, '', '', false) + plant(190, 262, 170, C.green, 62, 4) + jar(570, '', '', false) + plant(570, 262, 90, C.yellow, 44, 3);
        b += T(190, 32, 'Complete · sunny window', { small: true, weight: 750 }) + T(570, 32, 'No magnesium · dark cupboard', { small: true, weight: 750 });
        b += `<rect x="130" y="390" width="500" height="28" rx="8" fill="#f8ecec" stroke="${C.rose}" stroke-width="2"/>` + T(380, 410, 'Two things differ: the ion AND the light. No conclusion.', { cls: '', size: 16, weight: 750, fill: C.rose });
        return { defs: '', body: b };
      }
      const grown = step === null || step >= 1;
      const P3 = grown
        ? [[130, 'Complete', 'tall, green', 190, C.green, 64, 4], [380, 'No magnesium', 'yellow leaves', 120, C.yellow, 48, 3], [630, 'No nitrate', 'small, few leaves', 62, C.green, 28, 2]]
        : [[130, 'Complete', '', 60, C.green, 30, 2], [380, 'No magnesium', '', 60, C.green, 30, 2], [630, 'No nitrate', '', 60, C.green, 30, 2]];
      P3.forEach(([cx, label, sub, h, col, len, pairs], i) => { b += jar(cx, label, grown ? sub : '', (step === 1 && i === 1) || (step === 2 && i === 2)) + plant(cx, 262, h, col, len, pairs); });
      b += T(380, 28, grown ? 'After 4 weeks (illustrative)' : 'Start: identical seedlings · same light, temperature, volume', { small: true, weight: 750 });
      return { defs: '', body: b };
    }
  };

  /* ---------- hydroponics exam data (hypothetical scenario, illustrative data) ---------- */
  figures.hydroponicsData = {
    w: 540, h: 268,
    label: 'Hypothetical scenario, illustrative data. Lettuce seedlings grown for 4 weeks in three nutrient solutions, 10 seedlings each. Complete solution: green leaves, mean dry mass 2.4 g. No magnesium: yellow leaves, mean dry mass 1.1 g. No nitrate: green leaves, few and small, mean dry mass 0.6 g.',
    draw() {
      const cols = [6, 166, 336], rows = [['Solution', 'Leaf colour', 'Mean dry mass / g'], ['Complete', 'green', '2.4'], ['No magnesium', 'yellow', '1.1'], ['No nitrate', 'green, few, small', '0.6']];
      let b = '';
      rows.forEach((r, i) => {
        const y = 6 + i * 54, head = i === 0;
        b += `<rect x="6" y="${y}" width="528" height="54" fill="${head ? C.navy : i % 2 ? C.paper : '#ffffff'}" stroke="${C.line}" stroke-width="1.5"/>`;
        r.forEach((t, j) => { b += T(cols[j] + 12, y + 35, t, { small: true, size: 18, weight: head ? 750 : 650, anchor: 'start', fill: head ? '#ffffff' : C.navy }); });
        if (i === 2) b += `<rect x="${cols[1] + 80}" y="${y + 17}" width="22" height="22" rx="4" fill="${C.yellow}" stroke="${C.navy}" stroke-width="1.5"/>`;
      });
      [166, 336].forEach(x => { b += P(`M${x} 6V222`, { stroke: C.line, w: 1.5 }); });
      b += T(6, 254, 'Hypothetical scenario · illustrative data · 10 per solution', { small: true, size: 16, weight: 650, anchor: 'start', fill: C.goldText });
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
  return { render, names: Object.keys(figures) };
})();
