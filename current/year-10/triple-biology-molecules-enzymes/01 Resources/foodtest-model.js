/* Food tests model (Lesson 01 · Pearson 4XBI1 2.9, Core Practical 1).
   A rack of five test tubes. Pupils predict, add a reagent, heat (Benedict's only) and compare with the water control.
   State: {set:'known'|'mystery'|'series', reagent:'iodine'|'benedicts'|'biuret'|'ethanol', ran:false, heated:false}
   Commands: run (Add reagent) · heat (Heat in water bath, Benedict's only, after run) · reset.
   Original Three.js geometry (r160, global THREE). No network calls, no storage. Colours follow the locked conventions. */
window.LessonModels = window.LessonModels || {};
window.LessonModels.foodtests = (() => {
  const reduce = () => !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* ---------- science data (pure; drives readout, answers and visuals) ---------- */
  const SETS = {
    known: {
      title: 'Known samples',
      tubes: [
        { name: 'Glucose', sub: 'solution', full: 'glucose solution', has: ['glucose'], look: 'clear' },
        { name: 'Starch', sub: 'suspension', full: 'starch suspension', has: ['starch'], look: 'cloudy' },
        { name: 'Egg white', sub: '(protein)', full: 'egg-white (protein) solution', has: ['protein'], look: 'faint' },
        { name: 'Oil', sub: 'vegetable', full: 'vegetable oil', has: ['lipid'], look: 'oil' },
        { name: 'Water', sub: 'control', full: 'distilled water (control)', has: [], look: 'clear', control: true }
      ]
    },
    mystery: {
      title: 'Mystery samples',
      tubes: [
        { name: 'Sample X', short: 'X', full: 'sample X', has: ['starch', 'glucose'], look: 'unknown' },
        { name: 'Sample Y', short: 'Y', full: 'sample Y', has: ['protein'], look: 'unknown' },
        { name: 'Sample Z', short: 'Z', full: 'sample Z', has: ['lipid', 'protein'], look: 'unknown' },
        { name: 'Sample W', short: 'W', full: 'sample W', has: [], look: 'unknown' },
        { name: 'Water', sub: 'control', full: 'distilled water (control)', has: [], look: 'clear', control: true }
      ]
    },
    series: {
      title: 'Glucose series',
      tubes: [
        { name: '0 %', sub: 'glucose', full: '0 % glucose', has: [], look: 'clear', level: 0, control: true },
        { name: '0.1 %', sub: 'glucose', full: '0.1 % glucose', has: ['glucose'], look: 'clear', level: 1 },
        { name: '0.5 %', sub: 'glucose', full: '0.5 % glucose', has: ['glucose'], look: 'clear', level: 2 },
        { name: '1 %', sub: 'glucose', full: '1 % glucose', has: ['glucose'], look: 'clear', level: 3 },
        { name: '2 %', sub: 'glucose', full: '2 % glucose', has: ['glucose'], look: 'clear', level: 4 }
      ]
    }
  };
  const REAGENTS = {
    iodine: { label: 'Iodine', short: 'iodine', full: 'iodine solution', colour: 'orangebrown' },
    benedicts: { label: 'Benedict’s', short: 'Benedict’s', full: 'Benedict’s solution', colour: 'blue' },
    biuret: { label: 'Biuret', short: 'Biuret', full: 'Biuret reagent', colour: 'paleblue' },
    ethanol: { label: 'Ethanol', short: 'ethanol emulsion', full: 'ethanol emulsion test', colour: 'clear' }
  };
  // Liquid colours (§4 reagent colours) with opacity and a short colour name for chips/readout.
  const COL = {
    clear: { hex: '#dfeef3', op: 0.34, name: 'clear' },
    cloudy: { hex: '#ebe6d8', op: 0.86, name: 'cloudy white' },
    faint: { hex: '#ece7d4', op: 0.52, name: 'colourless' },
    oil: { hex: '#e4c455', op: 0.84, name: 'pale yellow' },
    unknown: { hex: '#cfcdc8', op: 0.7, name: 'grey' },
    orangebrown: { hex: '#b8651f', op: 0.97, name: 'orange-brown' },
    blueblack: { hex: '#1d2140', op: 0.98, name: 'blue-black' },
    blue: { hex: '#2f6fd0', op: 0.97, name: 'blue' },
    green: { hex: '#6f9a36', op: 0.97, name: 'green' },
    yellow: { hex: '#d8c036', op: 0.97, name: 'yellow' },
    orange: { hex: '#d9822b', op: 0.97, name: 'orange' },
    brickred: { hex: '#a33d1c', op: 0.97, name: 'brick-red' },
    paleblue: { hex: '#86aee6', op: 0.94, name: 'blue' },
    purple: { hex: '#7a3f98', op: 0.97, name: 'purple' },
    emulsion: { hex: '#f2f0ea', op: 1, name: 'cloudy white' }
  };
  const BENEDICT_SEQ = ['blue', 'green', 'yellow', 'orange', 'brickred'];

  const tubesOf = s => (SETS[s.set] || SETS.known).tubes;
  // Colour index along the Benedict's sequence after heating (0 = stays blue).
  const benIdx = (s, t) => s.set === 'series' ? (t.level || 0) : t.has.includes('glucose') ? 4 : 0;
  function resultKey(s, t) {
    if (!s.ran) return t.look;
    if (s.reagent === 'iodine') return t.has.includes('starch') ? 'blueblack' : 'orangebrown';
    if (s.reagent === 'benedicts') return s.heated ? BENEDICT_SEQ[benIdx(s, t)] : 'blue';
    if (s.reagent === 'biuret') return t.has.includes('protein') ? 'purple' : 'paleblue';
    return t.has.includes('lipid') ? 'emulsion' : 'clear';
  }
  const negativeKey = s => ({ iodine: 'orangebrown', benedicts: 'blue', biuret: 'paleblue', ethanol: 'clear' })[s.reagent];
  const isPositive = (s, k) => k !== negativeKey(s);
  const describe = (s, k) => s.reagent === 'benedicts' && s.heated && k !== 'blue' ? `${COL[k].name} precipitate` : s.reagent === 'ethanol' && k === 'emulsion' ? 'cloudy white emulsion' : COL[k].name;
  const listNames = names => names.length < 2 ? names.join('') : names.slice(0, -1).join(', ') + ' and ' + names[names.length - 1];

  function observations(s) {
    const tubes = tubesOf(s);
    if (!s.ran) {
      if (s.set === 'known') return 'Starch: cloudy white · oil: pale yellow · glucose, egg white and water: colourless.';
      if (s.set === 'mystery') return 'X, Y, Z and W: unlabelled samples, shown grey · water control: clear.';
      return 'Five glucose solutions, 0 % to 2 %: all colourless.';
    }
    if (s.reagent === 'benedicts' && !s.heated) return 'All tubes: blue.';
    if (s.set === 'series') return tubes.map(t => `${t.name} ${describe(s, resultKey(s, t)).replace(' precipitate', '')}`).join(' · ') + '.';
    const pos = tubes.filter(t => isPositive(s, resultKey(s, t)));
    const neg = describe(s, negativeKey(s));
    if (!pos.length) return `All tubes, including the water control: ${neg}.`;
    const groups = {};
    pos.forEach(t => { const d = describe(s, resultKey(s, t)); (groups[d] = groups[d] || []).push(t.name); });
    const posText = Object.entries(groups).map(([d, n]) => `${listNames(n)}: ${d}`).join(' · ');
    return `${posText} · all others, including the water control: ${neg}.`;
  }
  function readout(p, s) {
    const set = SETS[s.set] || SETS.known, r = REAGENTS[s.reagent] || REAGENTS.iodine;
    const row = (k, v) => `<p><span class="readout-key">${k}</span><span class="readout-value">${v}</span></p>`;
    let note = null;
    if (s.reagent === 'ethanol') note = ['Safety', 'No flames — ethanol is highly flammable.'];
    else if (s.reagent === 'benedicts' && !s.heated) note = ['Next', s.ran ? 'No change yet — Benedict’s needs heating.' : 'Benedict’s needs heating after it is added.'];
    const head = s.reagent === 'ethanol' && s.ran ? 'Shaken with ethanol, poured into water' : `${set.title} · ${s.reagent === 'ethanol' ? 'ethanol emulsion test' : r.short}${s.reagent === 'benedicts' && s.heated ? ', after heating' : ''}`;
    return row(head, observations(s)) + (note ? row(...note) : '');
  }

  /* ---------- controls ---------- */
  const btn = (label, value, pressed, extra = '') => `<button type="button" data-action="model" data-value="${value}" aria-pressed="${pressed}"${extra}>${label}</button>`;
  const cmd = (label, value, disabled, primary) => `<button type="button" data-action="model-cmd" data-value="${value}"${primary ? ' class="is-primary"' : ''}${disabled ? ' disabled' : ''}>${label}</button>`;
  function controls(p, s) {
    const series = s.set === 'series';
    // On a stepped screen the steps choose the samples and reagent, so only the action buttons are shown.
    if (p && p.steps && p.steps.length) return `<div class="control-group">${cmd('Add reagent', 'run', s.ran, true)}${s.reagent === 'benedicts' ? cmd('Heat in water bath', 'heat', !(s.ran && !s.heated)) : ''}${cmd('Reset', 'reset', !s.ran)}</div>`;
    return `<div class="control-group" role="group" aria-label="Samples">${btn('Known', 'set=known', s.set === 'known')}${btn('Mystery', 'set=mystery', s.set === 'mystery')}${btn('Series', 'set=series', series, ' title="Glucose series, 0 % to 2 %"')}</div>`
      + `<div class="control-group"><span class="control-label">Reagent</span>${Object.entries(REAGENTS).map(([k, r]) => btn(r.label, `reagent=${k}`, s.reagent === k, series && k !== 'benedicts' ? ' disabled title="The glucose series uses Benedict’s only"' : '')).join('')}</div>`
      + `<div class="control-group">${cmd('Add reagent', 'run', s.ran, true)}${s.reagent === 'benedicts' ? cmd('Heat in water bath', 'heat', !(s.ran && !s.heated)) : ''}${cmd('Reset', 'reset', !s.ran)}</div>`;
  }
  function onChange(key, s) {
    if (key === 'set' || key === 'reagent') { s.ran = false; s.heated = false; }
    if (s.set === 'series') s.reagent = 'benedicts';
    if (!REAGENTS[s.reagent]) s.reagent = 'iodine';
    if (!SETS[s.set]) s.set = 'known';
  }
  function command(c, s) {
    if (c === 'run') { s.ran = true; s.heated = false; }
    if (c === 'heat' && s.ran && s.reagent === 'benedicts') s.heated = true;
    if (c === 'reset') { s.ran = false; s.heated = false; }
  }

  /* ---------- 3D ---------- */
  function mount(host, state, phase, ctx) {
    const T = window.THREE; if (!T) return null;
    let renderer;
    try { renderer = new T.WebGLRenderer({ antialias: true, alpha: true }); } catch (_) { return null; }
    if (!renderer.getContext()) { renderer.dispose(); return null; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = T.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = T.PCFSoftShadowMap;
    const canvas = renderer.domElement; host.appendChild(canvas); host.classList.add('is-live');
    canvas.tabIndex = 0; canvas.setAttribute('role', 'img');

    const disposables = new Set(); const track = o => { disposables.add(o); return o; };
    const scene = new T.Scene();
    const camera = new T.PerspectiveCamera(24, 1, 0.1, 200);
    scene.add(new T.HemisphereLight(0xfffdf6, 0xcbbf9f, 1.55));
    const key = new T.DirectionalLight(0xffffff, 1.5); key.position.set(3, 7, 8);
    key.castShadow = true; key.shadow.mapSize.set(1024, 1024); key.shadow.radius = 6; key.shadow.bias = -0.0008;
    Object.assign(key.shadow.camera, { left: -5, right: 5, top: 3, bottom: -3, near: 2, far: 22 });
    scene.add(key);
    const fill = new T.DirectionalLight(0xfff4e0, 0.6); fill.position.set(-6, 2, 5); scene.add(fill);

    const root = new T.Group(); scene.add(root);
    root.rotation.set(state.rx ?? 0, state.ry ?? -0.06, 0);

    /* layout constants (world units) */
    const N = 5, GAP = 1.6, R = 0.23, BOTTOM = -0.85, TOP = 0.9, RI = 0.196, YC = BOTTOM + R, LOW = YC - RI;
    const xs = [...Array(N)].map((_, i) => (i - (N - 1) / 2) * GAP);
    const SAMPLE_TOP = LOW + 0.5, BOARD_Y = 0.32;
    const rackW = xs[N - 1] - xs[0] + 1.2;
    const LABEL_TOP = BOTTOM - 0.2, Y_TOP = TOP + 0.62, HALF_W = rackW / 2 + 0.3;
    const RISE = { iodine: 0.08, benedicts: 0.44, biuret: 0.44, ethanol: 0.44 };

    /* materials (shared) */
    const M = (o, Kind = T.MeshStandardMaterial) => track(new Kind(o));
    const woodMat = M({ color: 0xcaa06a, roughness: 0.7 });
    const woodDark = M({ color: 0xae8249, roughness: 0.75 });
    // Glass: nearly clear in the middle, darker at the silhouette (fresnel-style edge) so every tube reads on paper.
    const glassMat = track(new T.ShaderMaterial({
      transparent: true, depthWrite: false,
      uniforms: { edge: { value: new T.Vector3(0.094, 0.161, 0.267) }, base: { value: 0.05 } },
      vertexShader: 'varying vec3 vN; varying vec3 vV; void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.0); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }',
      fragmentShader: 'uniform vec3 edge; uniform float base; varying vec3 vN; varying vec3 vV; void main(){ float r = 1.0 - abs(dot(normalize(vN), normalize(vV))); float a = base + pow(r, 2.4) * 0.9; vec3 c = mix(vec3(1.0), edge, smoothstep(0.25, 0.9, r)); gl_FragColor = vec4(c, clamp(a, 0.0, 0.95)); }'
    }));
    const shineMat = M({ color: 0xffffff, transparent: true, opacity: 0.6, depthWrite: false }, T.MeshBasicMaterial);
    const boardMat = M({ color: 0xffffff, roughness: 0.95, emissive: 0xffffff, emissiveIntensity: 0.18 });
    const tankMat = M({ color: 0xe8f3f7, roughness: 0.1, transparent: true, opacity: 0, depthWrite: false, side: T.DoubleSide });
    const bathWaterMat = M({ color: 0x8fc3d6, roughness: 0.2, transparent: true, opacity: 0, depthWrite: false });
    const dropMat = M({ color: 0xb8651f, roughness: 0.2, transparent: true, opacity: 0.95 });
    const bulbMat = M({ color: 0xad5c63, roughness: 0.55 });

    /* geometries (shared) */
    const G = g => track(g);
    const prof = [];
    for (let a = 0; a <= 12; a++) { const t = a / 12 * Math.PI / 2; prof.push(new T.Vector2(Math.max(0.001, R * Math.sin(t)), YC - R * Math.cos(t))); }
    prof.push(new T.Vector2(R, TOP), new T.Vector2(R + 0.03, TOP + 0.015), new T.Vector2(R + 0.03, TOP + 0.05), new T.Vector2(R - 0.01, TOP + 0.05));
    const tubeGeo = G(new T.LatheGeometry(prof, 36));
    const liqBottomGeo = G(new T.SphereGeometry(RI, 28, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2));
    const liqCylGeo = G(new T.CylinderGeometry(RI, RI, 1, 28, 1, false)); liqCylGeo.translate(0, 0.5, 0);
    const precipGeo = G(new T.SphereGeometry(RI * 0.985, 24, 10, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2));
    const shineGeo = G(new T.PlaneGeometry(0.04, TOP - YC - 0.12));
    const dropGeo = G(new T.SphereGeometry(0.045, 12, 8));

    /* dark card behind the rack for the emulsion test (a cloudy white emulsion shows best against a dark background) */
    const board = new T.Mesh(G(new T.BoxGeometry(rackW + 0.2, TOP - BOTTOM + 0.5, 0.05)), boardMat);
    board.position.set(0, (TOP + BOTTOM) / 2 + 0.1, -0.7); board.receiveShadow = true; root.add(board);

    /* rack */
    const base = new T.Mesh(G(new T.BoxGeometry(rackW, 0.14, 0.95)), woodMat); base.position.set(0, BOTTOM - 0.07, 0); base.receiveShadow = true; base.castShadow = true;
    const upper = new T.Mesh(G(new T.BoxGeometry(rackW, 0.11, 0.7)), woodMat); upper.position.set(0, BOARD_Y, 0); upper.castShadow = true; upper.receiveShadow = true;
    const legGeo = G(new T.BoxGeometry(0.14, BOARD_Y - BOTTOM, 0.7));
    root.add(base, upper);
    [-1, 1].forEach(sd => { const leg = new T.Mesh(legGeo, woodDark); leg.position.set(sd * (rackW / 2 - 0.07), (BOARD_Y + BOTTOM) / 2, 0); leg.castShadow = true; leg.receiveShadow = true; root.add(leg); });

    /* tubes */
    const tubes = xs.map(x => {
      const g = new T.Group(); g.position.x = x; root.add(g);
      const liqMat = M({ color: 0xdfeef3, roughness: 0.45, transparent: true, opacity: 0.34 });
      const precipMat = M({ color: 0xa33d1c, roughness: 0.9 });
      const bottom = new T.Mesh(liqBottomGeo, liqMat); bottom.position.y = YC; bottom.renderOrder = 1;
      const cyl = new T.Mesh(liqCylGeo, liqMat); cyl.position.y = YC; cyl.renderOrder = 1;
      const precip = new T.Mesh(precipGeo, precipMat); precip.position.y = YC + 0.002; precip.renderOrder = 2; precip.visible = false;
      bottom.castShadow = cyl.castShadow = true;
      const glass = new T.Mesh(tubeGeo, glassMat); glass.renderOrder = 4;
      const shine = new T.Mesh(shineGeo, shineMat); shine.position.set(-R * 0.48, (TOP + YC) / 2 + 0.04, R * 0.87); shine.renderOrder = 5;
      const drop = new T.Mesh(dropGeo, dropMat); drop.visible = false; drop.renderOrder = 3;
      g.add(bottom, cyl, precip, glass, shine, drop);
      return { g, liqMat, precipMat, cyl, precip, drop, top: SAMPLE_TOP };
    });

    /* dropper (appears during "Add reagent") */
    const dropper = new T.Group(); dropper.visible = false; root.add(dropper);
    const dGlass = M({ color: 0xffffff, roughness: 0.1, transparent: true, opacity: 0.4, depthWrite: false });
    const dLiquidMat = M({ color: 0xb8651f, roughness: 0.3, transparent: true, opacity: 0.9 });
    const tip = new T.Mesh(G(new T.CylinderGeometry(0.045, 0.014, 0.12, 16)), dGlass); tip.position.y = 0.06;
    const barrel = new T.Mesh(G(new T.CylinderGeometry(0.045, 0.045, 0.28, 16)), dGlass); barrel.position.y = 0.26;
    const dLiq = new T.Mesh(G(new T.CylinderGeometry(0.034, 0.026, 0.22, 12)), dLiquidMat); dLiq.position.y = 0.2;
    const bulb = new T.Mesh(G(new T.SphereGeometry(0.075, 18, 12)), bulbMat); bulb.scale.set(1, 1.4, 1); bulb.position.y = 0.48;
    dropper.add(tip, barrel, dLiq, bulb);
    const DROP_TIP = TOP + 0.1;

    /* water bath (rises around the rack for Benedict's) */
    const bath = new T.Group(); bath.visible = false; root.add(bath);
    const tankW = rackW + 0.3, tankH = 1.3, tankD = 1.3;
    const tank = new T.Mesh(G(new T.BoxGeometry(tankW, tankH, tankD)), tankMat); tank.position.y = BOTTOM - 0.16 + tankH / 2; tank.renderOrder = 6;
    const bathWater = new T.Mesh(G(new T.BoxGeometry(tankW - 0.06, 1.0, tankD - 0.06)), bathWaterMat); bathWater.position.y = BOTTOM - 0.15 + 0.5; bathWater.renderOrder = 7;
    bath.add(tank, bathWater);

    /* ---------- canvas-texture sprite labels ---------- */
    // Base sizes in CSS px at scale 1; canvases are drawn at 2x for crisp text.
    const SC = 2, F_NAME = 15, F_SUB = 11.5, F_RES = 12.5;
    const labelCache = new Map();
    function labelTex(rows, opts = {}) {
      const k = JSON.stringify([rows, opts]);
      if (labelCache.has(k)) return labelCache.get(k);
      const c = document.createElement('canvas'), g = c.getContext('2d');
      const padX = 8 * SC, padY = 5 * SC, sw = 11 * SC, gapS = 5 * SC;
      const specs = rows.map(r => ({ ...r, font: `${r.bold ? 700 : 600} ${r.size * SC}px Montserrat, system-ui, sans-serif`, lh: r.size * SC * 1.22 }));
      specs.forEach(r => { g.font = r.font; r.w = g.measureText(r.text).width + (r.swatch ? sw + gapS : 0); });
      const w = Math.ceil(Math.max(...specs.map(r => r.w)) + padX * 2), h = Math.ceil(specs.reduce((a, r) => a + r.lh, 0) + padY * 2);
      c.width = w; c.height = h;
      g.fillStyle = opts.bg || 'rgba(251,249,243,0.96)'; g.strokeStyle = opts.border || '#182944'; g.lineWidth = (opts.border ? 2.5 : 1.5) * SC;
      g.beginPath(); g.roundRect ? g.roundRect(SC, SC, w - 2 * SC, h - 2 * SC, 7 * SC) : g.rect(SC, SC, w - 2 * SC, h - 2 * SC); g.fill(); g.stroke();
      let y = padY; g.textBaseline = 'middle';
      specs.forEach(r => {
        const x0 = (w - r.w) / 2, cy = y + r.lh / 2 + SC * 0.5;
        if (r.swatch) { g.fillStyle = r.swatch; g.strokeStyle = '#182944'; g.lineWidth = 1.2 * SC; g.beginPath(); g.arc(x0 + sw / 2, cy, sw / 2, 0, Math.PI * 2); g.fill(); g.stroke(); }
        g.font = r.font; g.fillStyle = r.colour || '#182944'; g.textAlign = 'left'; g.fillText(r.text, x0 + (r.swatch ? sw + gapS : 0), cy);
        y += r.lh;
      });
      const tex = new T.CanvasTexture(c); tex.colorSpace = T.SRGBColorSpace; tex.anisotropy = 4;
      const mat = new T.SpriteMaterial({ map: tex, depthTest: false, depthWrite: false, transparent: true });
      const entry = { tex, mat, w: w / SC, h: h / SC, main: rows[0].size }; // natural CSS-px size at scale 1
      labelCache.set(k, entry); return entry;
    }
    const blankMat = track(new T.SpriteMaterial({ transparent: true, opacity: 0, depthTest: false }));
    const makeSprite = () => { const sp = new T.Sprite(blankMat); sp.renderOrder = 20; root.add(sp); return sp; };
    const nameSprites = xs.map(() => { const sp = makeSprite(); sp.center.set(0.5, 1); return sp; });
    const bathSprite = makeSprite(); bathSprite.visible = false;
    const reagentSprite = makeSprite(); reagentSprite.visible = false; reagentSprite.center.set(0, 0.5);
    function setSprite(sp, entry) { sp.material = entry.mat; sp.userData.entry = entry; }

    /* ---------- colour helpers ---------- */
    const cTmp = new T.Color(), cA = new T.Color(), cB = new T.Color();
    function paint(tb, k1, k2 = k1, f = 0) {
      cA.set(COL[k1].hex); cB.set(COL[k2].hex); cTmp.copy(cA).lerp(cB, f);
      const op = COL[k1].op + (COL[k2].op - COL[k1].op) * f;
      tb.liqMat.color.copy(cTmp); tb.liqMat.emissive.copy(cTmp).multiplyScalar(0.1);
      tb.liqMat.opacity = op; tb.liqMat.depthWrite = op > 0.8;
    }
    function paintSeq(tb, pos) { const i = Math.min(3, Math.floor(pos)); paint(tb, BENEDICT_SEQ[i], BENEDICT_SEQ[Math.min(4, i + 1)], Math.min(1, pos - i)); }
    function level(tb, top) { tb.top = top; tb.cyl.scale.y = Math.max(0.001, top - YC); }
    function precipitate(tb, k, grow = 1) {
      const idx = BENEDICT_SEQ.indexOf(k);
      tb.precip.visible = idx > 0 && grow > 0.01;
      if (!tb.precip.visible) return;
      tb.precipMat.color.set(COL[k].hex).multiplyScalar(0.55);
      tb.precip.scale.set(1, Math.max(0.02, (0.3 + 0.14 * idx) * grow), 1); // more glucose → more precipitate
    }
    const ease = t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    const seg = (t, a, b) => Math.max(0, Math.min(1, (t - a) / (b - a)));

    /* ---------- layout: fit the rack to the host and keep labels legible ---------- */
    let W = 1, H = 1;
    function fit() {
      const c = H < 220 || W < 430; // small host (e.g. drawer open): one-line labels, results shown as a colour dot
      if (c !== compact) { compact = c; if (lastLabels) setLabels(...lastLabels); }
      const tn = Math.tan(T.MathUtils.degToRad(camera.fov / 2));
      const entries = nameSprites.map(sp => sp.userData.entry).filter(Boolean);
      const natW = Math.max(1, ...entries.map(e => e.w)), natH = Math.max(1, ...entries.map(e => e.h));
      let ppu = W / (2 * HALF_W), f = 1, stag = false;
      for (let it = 0; it < 4; it++) {
        f = Math.min(1.15, (GAP * ppu * 0.97) / natW);            // shrink labels to fit between tubes
        stag = f * (entries.length ? entries[0].main : F_NAME) < 10.5; // too small: stagger into two rows instead
        if (stag) f = Math.min(1, Math.max(0.72, (2 * GAP * ppu * 0.95) / natW));
        const labelPx = natH * f * (stag ? 2.05 : 1) + 18;
        const edgeW = Math.max(entries[0] ? entries[0].w : 0, entries[N - 1] ? entries[N - 1].w : 0) * f;
        ppu = Math.min(W / (2 * HALF_W), (W - edgeW - 16) / (2 * xs[N - 1]), (H - labelPx - 10) / (Y_TOP - LABEL_TOP));
      }
      const yBottom = LABEL_TOP - (natH * f * (stag ? 2.05 : 1) + 18) / ppu, yTop = Y_TOP + 4 / ppu;
      const dist = H / (2 * ppu * tn), cy = (yTop + yBottom) / 2;
      camera.position.set(0, cy + dist * 0.1, dist); camera.lookAt(0, cy, 0);
      camera.updateProjectionMatrix();
      nameSprites.forEach((sp, i) => {
        const e = sp.userData.entry; if (!e) return;
        sp.scale.set(e.w * f / ppu, e.h * f / ppu, 1);
        sp.position.set(xs[i], LABEL_TOP - (stag && i % 2 ? natH * f * 1.05 / ppu : 0), 0.3);
      });
      const lf = Math.max(0.8, Math.min(1, f));
      [bathSprite, reagentSprite].forEach(sp => { const e = sp.userData.entry; if (e) sp.scale.set(e.w * lf / ppu, e.h * lf / ppu, 1); });
      bathSprite.position.set(0, TOP + 0.36, 0.7);
    }

    /* ---------- state → visuals ---------- */
    let shown = null, anim = null, raf = 0, visible = true, disposed = false, st = state;
    const keyOf = s => `${s.set}|${s.reagent}|${!!s.ran}|${!!s.heated}`;
    let compact = false, lastLabels = null;
    function setLabels(s, withResults) {
      lastLabels = [s, withResults];
      tubesOf(s).forEach((t, i) => {
        if (compact) {
          const rows = [{ text: t.short || t.name, size: 13, bold: true, swatch: withResults ? COL[resultKey(s, t)].hex : undefined }];
          setSprite(nameSprites[i], labelTex(rows, t.control ? { border: '#24748d' } : {}));
          return;
        }
        const rows = [{ text: t.name, size: F_NAME, bold: true }];
        rows.push({ text: t.sub || (s.set === 'mystery' ? 'unknown' : ''), size: F_SUB, colour: '#4d5566' });
        if (withResults) { const k = resultKey(s, t); rows.push({ text: COL[k].name, size: F_RES, swatch: COL[k].hex }); }
        setSprite(nameSprites[i], labelTex(rows, t.control ? { border: '#24748d' } : {}));
      });
    }
    function ariaText(s) {
      const set = SETS[s.set] || SETS.known;
      return `3D model: a rack of five test tubes — ${set.tubes.map(t => t.full).join(', ')}. Reagent: ${REAGENTS[s.reagent].full}. ${s.ran ? 'Observations' : 'Before testing'}: ${observations(s)} Drag or use the arrow keys to turn the rack.`;
    }
    function backdrop(dark) { // emulsions are easier to see against a dark background
      board.visible = dark; boardMat.color.set(0x182944); boardMat.emissive.set(0x000000);
      glassMat.uniforms.edge.value.set(...(dark ? [0.82, 0.86, 0.9] : [0.094, 0.161, 0.267]));
    }
    function snap(s) {
      st = s;
      tubesOf(s).forEach((t, i) => {
        const tb = tubes[i], k = resultKey(s, t);
        paint(tb, k); level(tb, SAMPLE_TOP + (s.ran ? RISE[s.reagent] : 0));
        precipitate(tb, s.reagent === 'benedicts' && s.heated ? k : 'blue');
        tb.drop.visible = false; tb.g.rotation.z = 0;
      });
      dropper.visible = false; reagentSprite.visible = false;
      bath.visible = false; bathSprite.visible = false;
      setLabels(s, s.ran);
      backdrop(s.reagent === 'ethanol');
      canvas.setAttribute('aria-label', ariaText(s));
      shown = keyOf(s); fit(); draw();
    }
    const draw = () => { if (!disposed) renderer.render(scene, camera); };

    /* ---------- animations (each ends by snapping to the true state) ---------- */
    function frame(now) {
      raf = 0; if (!anim || disposed) return;
      const t = now - anim.start;
      if (t >= anim.dur) { anim = null; snap(st); return; }
      anim.step(t); draw(); raf = requestAnimationFrame(frame);
    }
    function stop() { if (raf) cancelAnimationFrame(raf); raf = 0; anim = null; }
    function finish() { const had = !!anim; stop(); if (had) snap(st); }
    function play(a, s) {
      st = s;
      if (reduce() || !visible) { stop(); snap(s); return; }
      anim = { ...a, start: performance.now(), key: keyOf(s) };
      canvas.setAttribute('aria-label', ariaText(s));
      anim.step(0); draw(); raf = requestAnimationFrame(frame);
    }
    function runAnim(s) {
      const r = REAGENTS[s.reagent], set = tubesOf(s), rise = RISE[s.reagent];
      const pre = set.map(t => t.look), res = set.map(t => resultKey(s, t));
      const rk = r.colour, eth = s.reagent === 'ethanol';
      dropMat.color.set(COL[rk].hex); dropMat.opacity = rk === 'clear' ? 0.6 : 0.95;
      dLiquidMat.color.set(COL[rk].hex); dLiquidMat.opacity = rk === 'clear' ? 0.5 : 0.9;
      setSprite(reagentSprite, labelTex([{ text: r.label, size: 13, bold: true }])); fit();
      const PER = 290, T0 = 200, arrive = i => T0 + i * PER, FALL = 220;
      const dropsEnd = arrive(N - 1) + FALL + 260;
      const shakeA = dropsEnd, shakeB = dropsEnd + 520;
      const dur = eth ? shakeB + 620 : s.reagent === 'benedicts' ? dropsEnd + 120 : dropsEnd + 480;
      return {
        dur,
        step(t) {
          dropper.visible = t < dropsEnd - 120; reagentSprite.visible = dropper.visible;
          const u = Math.max(0, Math.min(N - 1, (t - T0 + PER * 0.5) / PER)), i0 = Math.floor(u), fr = ease(u - i0);
          const x = u >= N - 1 ? xs[N - 1] : xs[i0] + (xs[i0 + 1] - xs[i0]) * fr;
          const lift = t < T0 ? (1 - t / T0) * 0.4 : 0;
          dropper.position.set(x, DROP_TIP + lift, 0.02);
          reagentSprite.position.set(x + 0.14, DROP_TIP + 0.5 + lift, 0.3);
          bulb.scale.set(1, 1.4 - 0.22 * Math.max(0, Math.sin(((t - T0) / PER) * Math.PI * 2)), 1);
          set.forEach((_, i) => {
            const tb = tubes[i], a = arrive(i), d = seg(t, a, a + FALL);
            tb.drop.visible = t >= a && t < a + FALL;
            if (tb.drop.visible) tb.drop.position.set(0, DROP_TIP - (DROP_TIP - tb.top) * d * d, 0);
            const mix = seg(t, a + FALL, a + FALL + 260);
            level(tb, SAMPLE_TOP + rise * ease(mix));
            if (eth) {
              // shaken with ethanol, then poured into water: the cloudy/clear result appears after the shake
              tb.g.rotation.z = t > shakeA && t < shakeB ? Math.sin((t - shakeA) / 42) * 0.09 * (1 - seg(t, shakeA, shakeB)) : 0;
              paint(tb, pre[i], res[i], ease(seg(t, shakeB, shakeB + 500)));
            } else if (mix < 1) paint(tb, pre[i], rk, ease(mix));
            else paint(tb, rk, res[i], ease(seg(t, a + FALL + 260, a + FALL + 680)));
          });
        }
      };
    }
    function heatAnim(s) {
      const set = tubesOf(s), idx = set.map(t => benIdx(s, t));
      setSprite(bathSprite, labelTex([{ text: 'Water bath ≈ 80 °C', size: 13, bold: true, swatch: '#8fc3d6' }])); fit();
      const UP = 600, C0 = 650, C1 = 1750, D0 = 1850, D1 = 2350;
      return {
        dur: D1 + 30,
        step(t) {
          const up = ease(seg(t, 0, UP)), down = ease(seg(t, D0, D1)), vis = up * (1 - down);
          bath.visible = vis > 0.01; bathSprite.visible = t < D0 + 150;
          bath.position.y = -1.5 * (1 - up) - 1.5 * down;
          tankMat.opacity = 0.22 * vis; bathWaterMat.opacity = 0.3 * vis;
          const k = ease(seg(t, C0, C1));
          set.forEach((_, i) => { paintSeq(tubes[i], idx[i] * k); precipitate(tubes[i], BENEDICT_SEQ[idx[i]], seg(t, C0 + 500, C1)); });
        }
      };
    }

    /* ---------- public update path ---------- */
    function sync(s) {
      st = s;
      const k = keyOf(s);
      if (anim && anim.key === k) return;
      const prev = shown ? shown.split('|') : null;
      const sameTest = prev && prev[0] === s.set && prev[1] === s.reagent;
      if (sameTest && s.ran && !s.heated && (prev[2] === 'false' || anim)) { stop(); snap({ ...s, ran: false, heated: false }); st = s; play(runAnim(s), s); return; }
      if (sameTest && prev[2] === 'true' && prev[3] === 'false' && s.ran && s.heated) { finish(); play(heatAnim(s), s); return; }
      stop(); snap(s);
    }

    /* ---------- resize and rotation ---------- */
    function resize() {
      const r = host.getBoundingClientRect(); if (!r.width || !r.height) return;
      W = r.width; H = r.height;
      renderer.setSize(W, H, false); camera.aspect = W / H; fit(); draw();
    }
    let last = null;
    const clampRot = () => { root.rotation.y = Math.max(-0.8, Math.min(0.8, root.rotation.y)); root.rotation.x = Math.max(-0.12, Math.min(0.4, root.rotation.x)); st.rx = root.rotation.x; st.ry = root.rotation.y; };
    const onDown = e => { last = [e.clientX, e.clientY]; try { canvas.setPointerCapture(e.pointerId); } catch (_) {} };
    const onMove = e => { if (!last) return; root.rotation.y += (e.clientX - last[0]) * 0.008; root.rotation.x += (e.clientY - last[1]) * 0.006; last = [e.clientX, e.clientY]; clampRot(); if (!anim) draw(); };
    const onUp = () => { last = null; };
    const onKey = e => {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) return;
      e.preventDefault(); e.stopPropagation();
      root.rotation.y += e.key === 'ArrowLeft' ? -0.12 : e.key === 'ArrowRight' ? 0.12 : 0;
      root.rotation.x += e.key === 'ArrowUp' ? -0.08 : e.key === 'ArrowDown' ? 0.08 : 0;
      clampRot(); if (!anim) draw();
    };
    const onLost = e => e.preventDefault();
    canvas.addEventListener('pointerdown', onDown); canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp); canvas.addEventListener('pointercancel', onUp);
    canvas.addEventListener('keydown', onKey); canvas.addEventListener('webglcontextlost', onLost);
    const observer = new ResizeObserver(resize); observer.observe(host);

    snap(state); resize();
    // Redraw labels once web fonts are ready (canvas text uses whichever font is loaded at draw time).
    if (document.fonts && document.fonts.status !== 'loaded') document.fonts.ready.then(() => {
      if (disposed) return;
      const old = [...labelCache.values()]; labelCache.clear();
      if (anim) finish(); else snap(st);
      old.forEach(e => { e.tex.dispose(); e.mat.dispose(); });
    }).catch(() => {});

    return {
      update: s => sync(s),
      command: (c, s) => { st = s; if (c === 'reset') stop(); },
      visibility: v => { visible = v; if (!v) finish(); else draw(); },
      dispose() {
        disposed = true; stop();
        observer.disconnect();
        canvas.removeEventListener('pointerdown', onDown); canvas.removeEventListener('pointermove', onMove);
        canvas.removeEventListener('pointerup', onUp); canvas.removeEventListener('pointercancel', onUp);
        canvas.removeEventListener('keydown', onKey); canvas.removeEventListener('webglcontextlost', onLost);
        labelCache.forEach(e => { e.tex.dispose(); e.mat.dispose(); }); labelCache.clear();
        disposables.forEach(d => d.dispose && d.dispose()); disposables.clear();
        renderer.dispose(); try { renderer.forceContextLoss(); } catch (_) {}
        canvas.remove(); host.classList.remove('is-live');
      }
    };
  }
  return {
    caption: 'Schematic test-tube rack. Drag or use arrow keys to turn it.',
    defaults: { set: 'known', reagent: 'iodine', ran: false, heated: false },
    controls, readout, onChange, command, mount,
    // exposed for answer authors / tests (pure functions, no DOM)
    observations, resultKey: (s, i) => resultKey(s, tubesOf(s)[i])
  };
})();
