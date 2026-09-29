/* Original inline SVG diagrams for Lesson 1 · DNA, genes and chromosomes. Fallbacks for the 3D model and printable figures. */
(() => {
  const COL = { A: '#bd8126', T: '#ad5c63', C: '#24748d', G: '#56834b' };
  const PAIR = { A: 'T', T: 'A', C: 'G', G: 'C' };

  function zoom(state) {
    const step = Math.max(0, Math.min(3, (state && state.step) || 0));
    const panel = (i, x) => `<rect x="${x}" y="40" width="132" height="230" rx="16" fill="${i === step ? '#fbf1dc' : '#f7f4ec'}" stroke="${i === step ? '#bd8126' : '#d9d3c4'}" stroke-width="${i === step ? 4 : 2}"/>`;
    const arrow = x => `<line x1="${x}" y1="155" x2="${x + 14}" y2="155" stroke="#182944" stroke-width="3" marker-end="url(#bio-arrow-zoom)"/>`;
    const x1 = (cx, cy, s, col) => `<g stroke="${col}" stroke-width="${7 * s}" stroke-linecap="round"><line x1="${cx - 12 * s}" y1="${cy - 22 * s}" x2="${cx + 12 * s}" y2="${cy + 22 * s}"/><line x1="${cx + 12 * s}" y1="${cy - 22 * s}" x2="${cx - 12 * s}" y2="${cy + 22 * s}"/></g>`;
    let ladder = '';
    for (let i = 0; i < 7; i++) {
      const y = 92 + i * 20, sw = Math.sin(i * 0.9) * 22;
      ladder += `<line x1="${521 - sw}" y1="${y}" x2="${521 + sw}" y2="${y}" stroke="${['#bd8126', '#24748d', '#56834b', '#ad5c63'][i % 4]}" stroke-width="6" stroke-linecap="round"/>`;
    }
    const strand = sign => { let d = ''; for (let i = 0; i <= 12; i++) { const y = 86 + i * 11.5, xx = 521 + sign * Math.sin((y - 92) / 20 * 0.9) * 22; d += (i ? 'L' : 'M') + xx.toFixed(1) + ' ' + y.toFixed(1); } return `<path d="${d}" fill="none" stroke="${sign > 0 ? '#182944' : '#5b6f86'}" stroke-width="5" stroke-linecap="round"/>`; };
    return `<svg viewBox="0 0 600 340" role="img" aria-label="Zoom from cell to DNA in four panels: a cell with a nucleus; the nucleus with chromosomes; one X-shaped chromosome; a short section of DNA as a double helix with coloured base pairs.">
<defs><marker id="bio-arrow-zoom" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#182944"/></marker></defs>
${panel(0, 10)}${panel(1, 158)}${panel(2, 306)}${panel(3, 454)}${arrow(143)}${arrow(291)}${arrow(439)}
<circle cx="76" cy="150" r="52" fill="#f3e2d6" stroke="#ad5c63" stroke-width="3"/><circle cx="84" cy="146" r="20" fill="#182944"/>
<circle cx="224" cy="150" r="54" fill="#e3e8ee" stroke="#182944" stroke-width="3"/>${x1(205, 132, 0.55, '#24748d')}${x1(244, 138, 0.55, '#56834b')}${x1(214, 172, 0.55, '#bd8126')}${x1(246, 176, 0.55, '#ad5c63')}
${x1(372, 150, 1.8, '#24748d')}<path d="M394 108 q10 -6 4 -14 q-8 -8 4 -14" fill="none" stroke="#182944" stroke-width="3"/>
${ladder}${strand(1)}${strand(-1)}
<text class="diagram-small" x="76" y="252" text-anchor="middle">Cell</text><text class="diagram-small" x="224" y="252" text-anchor="middle">Nucleus</text><text class="diagram-small" x="372" y="252" text-anchor="middle">Chromosome</text><text class="diagram-small" x="521" y="252" text-anchor="middle">DNA</text>
<text class="diagram-small" x="300" y="310" text-anchor="middle">Largest → smallest · not to scale</text></svg>`;
  }

  function ladder(state) {
    const seq = (state && state.mutated) ? 'ATTACAGC' : 'ATTGCAGC';
    let rungs = '';
    [...seq].forEach((b, i) => {
      const x = 92 + i * 60, q = PAIR[b], hi = state && state.mutated && i === 3;
      rungs += `<line x1="${x}" y1="112" x2="${x}" y2="180" stroke="${COL[b]}" stroke-width="16"/><line x1="${x}" y1="180" x2="${x}" y2="248" stroke="${COL[q]}" stroke-width="16"/>`;
      rungs += `<circle cx="${x}" cy="146" r="17" fill="${COL[b]}"/><text class="diagram-small" x="${x}" y="152" text-anchor="middle" fill="#fff" font-weight="700">${b}</text>`;
      rungs += `<circle cx="${x}" cy="214" r="17" fill="${COL[q]}"/><text class="diagram-small" x="${x}" y="220" text-anchor="middle" fill="#fff" font-weight="700">${q}</text>`;
      if (hi) rungs += `<rect x="${x - 26}" y="100" width="52" height="160" rx="12" fill="none" stroke="#bd8126" stroke-width="4" stroke-dasharray="8 6"/>`;
    });
    return `<svg viewBox="0 0 600 340" role="img" aria-label="DNA shown untwisted as a ladder: strand 1 reads A T T G C A G C, strand 2 reads T A A C G T C G. A always pairs with T and C with G.">
<defs><marker id="bio-arrow-ladder" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#182944"/></marker></defs>
<line x1="62" y1="112" x2="542" y2="112" stroke="#182944" stroke-width="8" stroke-linecap="round"/><line x1="62" y1="248" x2="542" y2="248" stroke="#5b6f86" stroke-width="8" stroke-linecap="round"/>
${rungs}
<text class="diagram-small" x="62" y="92">Strand 1</text><text class="diagram-small" x="62" y="282">Strand 2</text>
<text class="diagram-small" x="440" y="300">base pair</text><line x1="470" y1="284" x2="455" y2="262" stroke="#182944" stroke-width="2.5" marker-end="url(#bio-arrow-ladder)"/>
<text class="diagram-small" x="300" y="330" text-anchor="middle">Shown untwisted: real DNA is a double helix. A–T and C–G.</text></svg>`;
  }

  const DIAGRAMS = { 'dna-zoom': zoom, 'dna-ladder': ladder };
  window.BioDiagrams = { render(name, state) { const f = DIAGRAMS[name]; return f ? f(state || {}) : ''; } };
})();
