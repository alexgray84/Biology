/* Original explanatory schematics. Not photographs or microscope evidence. */
(() => {
  const navy = '#182944', gold = '#b08a36', pale = '#e9dfc6';
  const shell = (label, body, width = 560, height = 260) => `<svg class="cell-diagram" viewBox="0 0 ${width} ${height}" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="${navy}" stroke-width="3" stroke-linejoin="round">${body}</g></svg>`;
  const text = (x, y, label, extra = '') => `<text x="${x}" y="${y}" stroke="none" ${extra}>${label}</text>`;
  const nucleus = (x,y) => `<ellipse cx="${x}" cy="${y}" rx="22" ry="17" fill="${navy}"/>`;
  const mito = (x,y) => `<g transform="translate(${x} ${y})"><ellipse rx="18" ry="9" fill="${gold}"/><path d="M-11 0l5-4 5 7 5-7 6 4" stroke-width="1.5"/></g>`;
  window.COVER_DIAGRAMS = {
    rbc: shell('A mature human red blood cell, face and side views. No nucleus. Flexible disc, thin centre, not a hole.', `
      <ellipse cx="140" cy="118" rx="82" ry="72" fill="${gold}"/><ellipse cx="140" cy="118" rx="38" ry="29" fill="${pale}" stroke-width="1.5"/>
      <path d="M310 125C325 85 350 89 374 111C392 124 415 124 434 111C459 89 481 85 497 125C481 165 459 160 434 140C415 127 392 127 374 140C350 160 325 165 310 125Z" fill="${gold}"/>
      <path d="M146 80L173 28H260M404 119L410 54H528M68 147L38 202H190"/>
      ${text(176,23,'No nucleus')}${text(391,42,'Thin centre')}${text(45,225,'Flexible membrane')}${text(112,244,'Face view')}${text(360,214,'Side view')}`),
    nerve: shell('One nerve cell: a cell body containing a nucleus, one long connected axon and branched endings.', `
      <path d="M96 72L76 35M94 88L34 79M85 111L32 130M98 133L72 179M120 135L131 176M119 63L142 29"/>
      <path d="M98 65C78 69 76 119 92 137C108 151 144 141 148 122L424 122L456 155L474 151L446 114L485 75L474 63L430 105L148 105C146 73 121 54 98 65Z" fill="${pale}"/>
      ${nucleus(114,103)}<path d="M116 100L186 42H250M280 113L283 196H340M461 83L492 30H548"/>
      ${text(178,30,'Nucleus')}${text(245,222,'Long axon')}${text(391,22,'Branched endings')}`),
    phagocyte: shell('Two simplified stages of a phagocyte: flexible membrane surrounds a bacterium, then encloses it inside the cell away from its nucleus.', `
      <path d="M210 64C194 32 163 30 146 57C126 22 73 32 46 66C15 101 33 160 70 187C101 211 164 206 190 171C203 156 209 142 210 128L172 118L158 91Z" fill="${pale}"/>
      ${nucleus(95,144)}<rect x="177" y="81" width="29" height="14" rx="7" fill="${gold}" transform="rotate(-25 191 88)"/>
      <ellipse cx="414" cy="122" rx="97" ry="82" fill="${pale}"/>${nucleus(381,151)}<circle cx="447" cy="94" r="25" stroke-width="1.5"/><rect x="431" y="87" width="31" height="14" rx="7" fill="${gold}"/>
      <path d="M236 120H289M279 110L289 120L279 130M191 80L233 28H309M67 65L61 25M380 154L338 230M447 68L466 23"/>
      ${text(163,20,'Bacterium')}${text(10,240,'1 · Surrounding')}${text(358,240,'2 · Enclosed')}${text(341,256,'Nucleus')}${text(7,17,'Flexible membrane')}`,560,270),
    muscle: shell('A simplified muscle cell before contraction and the same cell shorter during contraction; mitochondria are labelled.', `
      <rect x="30" y="74" width="227" height="84" rx="42" fill="${pale}"/><rect x="339" y="63" width="160" height="106" rx="53" fill="${pale}"/>
      ${mito(87,100)}${mito(132,132)}${mito(185,101)}${mito(373,101)}${mito(417,138)}${mito(457,100)}
      <path d="M284 119H315M305 109L315 119L305 129M185 90L213 28H306"/>
      ${text(197,22,'Mitochondria')}${text(66,213,'Before contraction')}${text(342,213,'Contracted: shorter')}`),
    intestine: shell('One human intestinal lining cell with many tiny folds facing digested food, a cell membrane, nucleus and mitochondria. These folds belong to one cell, not whole villi.', `
      <path d="M145 96L145 64Q152 50 159 64L159 96L172 96L172 64Q179 50 186 64L186 96L199 96L199 64Q206 50 213 64L213 96L226 96L226 64Q233 50 240 64L240 96L253 96L253 64Q260 50 267 64L267 96L280 96L280 64Q287 50 294 64L294 96L305 96L305 235L145 235Z" fill="${pale}"/>
      ${nucleus(224,184)}${mito(176,137)}${mito(274,207)}<path d="M286 61L346 54H444M305 130L360 122H507M243 184L354 180H437M274 207L348 230H506"/>
      ${text(157,28,'Digested food')}${text(350,48,'Tiny folds')}${text(362,116,'Cell membrane')}${text(357,174,'Nucleus')}${text(353,252,'Mitochondria')}`,560,275)
  };
})();
