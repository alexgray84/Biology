/* Original inline SVG diagrams for Lesson 2 · Alleles and Punnett squares. */
(() => {
  function allelePair(state) {
    const step = Math.max(0, Math.min(3, (state && state.step) || 0));
    const hl = on => on ? ' stroke="#bd8126" stroke-width="5"' : ' stroke="#182944" stroke-width="2.5"';
    const chrom = (x, col, allele, from) => `<rect x="${x}" y="50" width="54" height="230" rx="27" fill="${col}"${hl(step === 0)}/>
<rect x="${x - 4}" y="140" width="62" height="40" rx="6" fill="#fffdf8"${hl(step >= 1)}/>
<text class="diagram-label" x="${x + 27}" y="168" text-anchor="middle" fill="#182944">${allele}</text>
<text class="diagram-small" x="${x + 27}" y="310" text-anchor="middle">${from}</text>`;
    return `<svg viewBox="0 0 600 340" role="img" aria-label="A pair of chromosomes. The same gene sits at the same place on each. One chromosome carries the dominant yellow allele Y, the other the recessive green allele y.">
<defs><marker id="bio-arrow-allele" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#182944"/></marker></defs>
${chrom(120, '#cfe0e6', 'Y', 'from one parent')}${chrom(250, '#f3dfd9', 'y', 'from the other')}
<line x1="330" y1="160" x2="382" y2="160" stroke="#182944" stroke-width="2.5" marker-end="url(#bio-arrow-allele)"/>
<text class="diagram-small" x="392" y="152">same gene,</text><text class="diagram-small" x="392" y="174">two alleles</text>
<text class="diagram-small" x="392" y="226" fill="${step === 2 ? '#855710' : '#182944'}" font-weight="${step === 2 ? 700 : 500}">Y dominant: yellow</text>
<text class="diagram-small" x="392" y="252" fill="${step === 3 ? '#855710' : '#182944'}" font-weight="${step === 3 ? 700 : 500}">y recessive: green</text>
<text class="diagram-small" x="392" y="90">Genotype: Yy</text><text class="diagram-small" x="392" y="114">Phenotype: yellow</text></svg>`;
  }

  function punnettGrid(state) {
    const cross = (state && state.cross) || 'Yy-Yy';
    const [p1, p2] = cross.split('-');
    const g1 = [...p1], g2 = [...p2];
    const pea = gt => /[A-Z]/.test(gt) ? '#e2b93b' : '#6f9a3e';
    const order = (a, b) => (a === a.toUpperCase() || b !== b.toUpperCase()) ? a + b : b + a;
    let cells = '';
    g2.forEach((b, r) => g1.forEach((a, col) => {
      const gt = order(a, b), x = 210 + col * 110, y = 90 + r * 110;
      const cf = cross === 'Ff-Ff';
      const fill = cf ? (gt === 'ff' ? '#f6e1e3' : gt === 'Ff' ? '#e3eef2' : '#fffdf8') : '#fffdf8';
      cells += `<rect x="${x}" y="${y}" width="110" height="110" fill="${fill}" stroke="#182944" stroke-width="3"/>`;
      cells += `<text class="diagram-label" x="${x + 55}" y="${y + 50}" text-anchor="middle">${gt}</text>`;
      cells += cf ? `<text class="diagram-small" x="${x + 55}" y="${y + 84}" text-anchor="middle">${gt === 'ff' ? 'has CF' : gt === 'Ff' ? 'carrier' : 'unaffected'}</text>`
        : `<circle cx="${x + 55}" cy="${y + 80}" r="14" fill="${pea(gt)}" stroke="#182944" stroke-width="2"/>`;
    }));
    const head = g1.map((a, i) => `<text class="diagram-label" x="${265 + i * 110}" y="76" text-anchor="middle">${a}</text>`).join('')
      + g2.map((b, i) => `<text class="diagram-label" x="186" y="${153 + i * 110}" text-anchor="middle">${b}</text>`).join('');
    return `<svg viewBox="0 0 600 340" role="img" aria-label="Punnett square for the cross ${p1} × ${p2}, showing the four equally likely offspring genotypes.">
${head}${cells}
<text class="diagram-small" x="265" y="36" text-anchor="middle">Parent 1 gametes (${p1})</text>
<text class="diagram-small" x="100" y="200" text-anchor="middle">Parent 2</text><text class="diagram-small" x="100" y="222" text-anchor="middle">gametes (${p2})</text>
<text class="diagram-small" x="440" y="36" text-anchor="start">${cross === 'Ff-Ff' ? 'F unaffected · f cystic fibrosis' : 'Y yellow · y green'}</text></svg>`;
  }

  const DIAGRAMS = { 'allele-pair': allelePair, 'punnett-grid': punnettGrid };
  window.BioDiagrams = { render(name, state) { const f = DIAGRAMS[name]; return f ? f(state || {}) : ''; } };
})();
