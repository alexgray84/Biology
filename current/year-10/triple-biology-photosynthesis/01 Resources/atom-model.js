/* Lesson 01 · "atoms" — local Three.js (r160, global THREE) ball-and-stick model of photosynthesis.
   Original geometry. No sound, no network calls, no storage of pupil data. Renders on demand; animates only
   while atoms move or light arrives. Respects prefers-reduced-motion (jumps to end states).
   State: {stage:'reactants'|'light'|'products', highlight:'none'|'C'|'H'|'O'} (+ rx/ry rotation memory).
   Command: 'replay' (reactants → light → products).
   Atom bookkeeping: 6 CO2 + 6 H2O = 36 atoms; 1 glucose (C6H12O6, 24 atoms) + 6 O2 (12 atoms).
   Every atom keeps its identity: 6 C → glucose; 12 H → glucose; 6 of the 18 O → glucose; 12 O → 6 O2.
   The mapping tracks atom numbers only; it is not the real reaction pathway (the O2 comes from water in reality). */
window.LessonModels = window.LessonModels || {};
window.LessonModels.atoms = (() => {
  const STAGES = ['reactants', 'light', 'products'];
  const stageOf = s => (s && STAGES.includes(s.stage) ? s.stage : 'reactants');
  const hiOf = s => (s && ['C', 'H', 'O'].includes(s.highlight) ? s.highlight : 'none');
  const reduce = () => !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const btn = (label, value, pressed, cmd = false, cls = '') => `<button type="button"${cls ? ` class="${cls}"` : ''} data-action="${cmd ? 'model-cmd' : 'model'}" data-value="${value}"${pressed === undefined ? '' : ` aria-pressed="${pressed}"`}>${label}</button>`;
  const row = (k, v) => `<p><span class="readout-key">${k}</span><span class="readout-value">${v}</span></p>`;
  const NAME = { C: 'Carbon', H: 'Hydrogen', O: 'Oxygen' };

  const STAGE_KEY = { reactants: 'Reactants · 6 CO₂ + 6 H₂O', light: 'Light energy in · atoms rearrange', products: 'Products · C₆H₁₂O₆ + 6 O₂' };
  const HI_TEXT = {
    none: 'Carbon 6 → 6 · Hydrogen 12 → 12 · Oxygen 18 → 18',
    C: 'Carbon: 6 in CO₂ → 6 in glucose',
    H: 'Hydrogen: 12 in H₂O → 12 in glucose',
    O: 'Oxygen: 18 → 6 in glucose + 12 in O₂'
  };
  function readout(p, s) {
    const st = stageOf(s);
    const msg = st === 'products' ? 'Chemical energy is stored in glucose.' : 'Light supplies energy, not atoms. The energy ends up stored in glucose.';
    return `<p><span class="readout-key">${STAGE_KEY[st]}</span><span class="readout-value" style="font-size:1.05em">${msg}</span></p>` +
      `<p style="font-size:.86em;font-weight:650;margin:0 0 4px">${HI_TEXT[hiOf(s)]}</p>`;
  }
  function controls(p, s) {
    // On a stepped lesson screen, Back / Next already move between the three stages, so the stage buttons are left out
    // there, and so is Replay (either would put the model out of step with the step text).
    const st = stageOf(s), hi = hiOf(s), stepped = !!(p && p.steps && p.steps.length);
    const stage = stepped ? '' : `<div class="control-group" role="group" aria-label="Stage">${btn('Reactants', 'stage=reactants', st === 'reactants')}${btn('Add light energy', 'stage=light', st === 'light')}${btn('Products', 'stage=products', st === 'products')}${btn('Replay', 'replay', undefined, true, 'is-primary')}</div>`;
    return stage + `<div class="control-group" role="group" aria-label="Highlight one element">${btn('Carbon', 'highlight=C', hi === 'C')}${btn('Hydrogen', 'highlight=H', hi === 'H')}${btn('Oxygen', 'highlight=O', hi === 'O')}${btn('All', 'highlight=none', hi === 'none')}</div>`;
  }
  function command(cmd, s) { if (cmd === 'replay') s.stage = 'products'; }

  /* ---------- atom layout (model units; y up) ---------- */
  const pol = (o, ang, r) => [o[0] + r * Math.cos(ang * Math.PI / 180), o[1] + r * Math.sin(ang * Math.PI / 180)];
  function glucose() {
    // Ring form: O5 + C1–C5 ring; OH and H on C1–C4; H and CH2OH (C6) on C5. Exactly C6H12O6.
    const ring = { O5: 30, C1: -30, C2: -90, C3: -150, C4: 150, C5: 90 };
    const P = {}; Object.entries(ring).forEach(([k, a]) => { P[k] = pol([0, 0], a, 0.72); });
    const atoms = [], bonds = [];
    const add = (id, el, p, z = 0) => atoms.push({ id, el, p: [p[0], p[1], z] });
    ['O5', 'C1', 'C2', 'C3', 'C4', 'C5'].forEach((k, i) => add(k, k[0], P[k], i % 2 ? 0.08 : -0.08));
    [['O5', 'C1'], ['C1', 'C2'], ['C2', 'C3'], ['C3', 'C4'], ['C4', 'C5'], ['C5', 'O5']].forEach(b => bonds.push(b));
    ['C1', 'C2', 'C3', 'C4'].forEach((k, i) => {
      const a = ring[k], o = pol(P[k], a + 25, 0.62), h = pol(o, a + 25, 0.42), hc = pol(P[k], a - 35, 0.5);
      const zs = i % 2 ? 1 : -1;
      add('O' + (i + 1), 'O', o, 0.22 * zs); add('HO' + (i + 1), 'H', h, 0.3 * zs); add('H' + (i + 1), 'H', hc, -0.32 * zs);
      bonds.push([k, 'O' + (i + 1)], ['O' + (i + 1), 'HO' + (i + 1)], [k, 'H' + (i + 1)]);
    });
    const c6 = pol(P.C5, 135, 0.75), o6 = pol(c6, 185, 0.62);
    add('H5', 'H', pol(P.C5, 55, 0.5), -0.3); add('C6', 'C', c6, 0.18); add('O6', 'O', o6, 0.32); add('HO6', 'H', pol(o6, 150, 0.42), 0.4);
    add('H6a', 'H', pol(c6, 60, 0.48), -0.12); add('H6b', 'H', pol(c6, 120, 0.48), -0.2);
    bonds.push(['C5', 'H5'], ['C5', 'C6'], ['C6', 'O6'], ['O6', 'HO6'], ['C6', 'H6a'], ['C6', 'H6b']);
    return { atoms, bonds };
  }
  // Deterministic small jitter so the reactants look loosely arranged, identical on every device.
  const jit = (i, k) => { const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return (x - Math.floor(x)) - 0.5; };

  function buildLayout() {
    const atoms = []; // {el, R:[x,y,z] reactant-local, P:[x,y,z] product-local}
    const reactBonds = [], prodBonds = []; // [i, j, order]
    const g = glucose(), gi = Object.fromEntries(g.atoms.map((a, i) => [a.id, i]));
    const gC = ['C1', 'C2', 'C3', 'C4', 'C5', 'C6'], gO = ['O5', 'O1', 'O2', 'O3', 'O4', 'O6'];
    const gH = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6a', 'H6b', 'HO1', 'HO2', 'HO3', 'HO4', 'HO6'];
    const prodIndex = {}; // glucose id → model atom index
    const o2Pos = k => { const col = k < 3 ? 0 : 1, rowk = k % 3; return [[2.6 + col * 1.5 - 0.32, 1.1 - rowk * 1.1, 0], [2.6 + col * 1.5 + 0.32, 1.1 - rowk * 1.1, 0]]; };
    const gp = id => g.atoms[gi[id]].p;
    // 6 CO2: C → glucose carbon i; first O → glucose oxygen i; second O → O2 molecule i, atom a.
    for (let i = 0; i < 6; i++) {
      const cx = (i < 3 ? -2.6 : -0.65) + 0.16 * jit(i, 1), cy = 1.2 - (i % 3) * 1.2 + 0.14 * jit(i, 2), cz = 0.3 * jit(i, 3), tilt = 0.35 * jit(i, 4);
      const dx = 0.6 * Math.cos(tilt), dy = 0.6 * Math.sin(tilt);
      const c = atoms.push({ el: 'C', R: [cx, cy, cz], P: gp(gC[i]) }) - 1; prodIndex[gC[i]] = c;
      const oa = atoms.push({ el: 'O', R: [cx - dx, cy - dy, cz], P: gp(gO[i]) }) - 1; prodIndex[gO[i]] = oa;
      const ob = atoms.push({ el: 'O', R: [cx + dx, cy + dy, cz], P: o2Pos(i)[0] }) - 1;
      reactBonds.push([c, oa, 2], [c, ob, 2]);
      atoms[ob].o2 = i;
    }
    // 6 H2O: O → O2 molecule j, atom b; both H → glucose hydrogens 2j and 2j+1.
    for (let j = 0; j < 6; j++) {
      const ox = (j < 3 ? 1.0 : 2.1) + 0.14 * jit(j, 5), oy = 1.28 - (j % 3) * 1.2 + 0.12 * jit(j, 6), oz = 0.3 * jit(j, 7), rot = 0.6 * jit(j, 8);
      const o = atoms.push({ el: 'O', R: [ox, oy, oz], P: o2Pos(j)[1] }) - 1;
      [-1, 1].forEach((sg, k) => {
        const a = (-90 + sg * 52) * Math.PI / 180 + rot;
        const h = atoms.push({ el: 'H', R: [ox + 0.42 * Math.cos(a), oy + 0.42 * Math.sin(a), oz], P: gp(gH[2 * j + k]) }) - 1;
        prodIndex[gH[2 * j + k]] = h; reactBonds.push([o, h, 1]);
      });
      // O2 bond: the CO2 oxygen sent to molecule j + this water oxygen.
      const partner = atoms.findIndex(a => a.o2 === j);
      prodBonds.push([partner, o, 2]);
    }
    g.bonds.forEach(([a, b]) => prodBonds.push([prodIndex[a], prodIndex[b], 1]));
    return { atoms, reactBonds, prodBonds };
  }
  /* Exposed for checks: counts per side and the identity mapping. */
  function audit() {
    const L = buildLayout(), count = (f) => { const c = { C: 0, H: 0, O: 0 }; L.atoms.forEach(a => { if (f(a)) c[a.el]++; }); return c; };
    const inGlucose = a => a.P[0] < 2;
    return { total: L.atoms.length, reactants: count(() => true), glucose: count(inGlucose), oxygenMolecules: count(a => !inGlucose(a)), reactBonds: L.reactBonds.length, prodBonds: L.prodBonds.length };
  }

  /* ---------- mount ---------- */
  function mount(host, state, phase, ctx) {
    const T = window.THREE; if (!T || !host) return null;
    try {
      const probe = document.createElement('canvas'), gl = probe.getContext('webgl2') || probe.getContext('webgl');
      if (!gl) return null;
      const lose = gl.getExtension('WEBGL_lose_context'); if (lose) lose.loseContext();
    } catch (_) { return null; }
    let renderer;
    try {
      renderer = new T.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
      if (!renderer.getContext()) throw new Error('no context');
    } catch (_) { try { renderer && renderer.dispose(); } catch (e) { /* ignore */ } return null; }
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr); renderer.outputColorSpace = T.SRGBColorSpace; renderer.setClearColor(0x000000, 0);
    const canvas = renderer.domElement; canvas.tabIndex = 0; canvas.setAttribute('role', 'img');
    host.appendChild(canvas); host.classList.add('is-live');

    const bin = new Set(); const keep = x => { bin.add(x); return x; };
    const scene = new T.Scene(), camera = new T.PerspectiveCamera(30, 2, 0.1, 200);
    const tanH = Math.tan(T.MathUtils.degToRad(camera.fov / 2));
    scene.add(new T.HemisphereLight(0xfffaf0, 0x8d8272, 1.7));
    const key = new T.DirectionalLight(0xfff3e2, 2.3); key.position.set(-4, 7, 11); scene.add(key);
    const fill = new T.DirectionalLight(0xe4ecff, 0.7); fill.position.set(7, -3, 6); scene.add(fill);

    const world = new T.Group(); scene.add(world);
    const LAY = buildLayout();

    // Materials: one per element, so highlighting dims whole elements.
    const std = (color, extra = {}) => keep(new T.MeshStandardMaterial({ color, roughness: 0.4, metalness: 0.03, transparent: true, opacity: 1, ...extra }));
    const elMat = { C: std(0x3a3f4a), O: std(0xad5c63), H: std(0xe8e4da, { roughness: 0.5 }) };
    const R = { C: 0.25, O: 0.23, H: 0.15 };
    const sphere = keep(new T.SphereGeometry(1, 28, 20));
    const atomMeshes = LAY.atoms.map(a => { const m = new T.Mesh(sphere, elMat[a.el]); m.scale.setScalar(R[a.el]); world.add(m); return m; });
    const bondGeo = keep(new T.CylinderGeometry(0.045, 0.045, 1, 10));
    const reactMat = std(0xc2b9a5, { roughness: 0.6 }), prodMat = std(0xc2b9a5, { roughness: 0.6 });
    const mkBonds = (list, mat) => list.flatMap(([i, j, order]) => (order === 2 ? [-1, 1] : [0]).map(off => { const m = new T.Mesh(bondGeo, mat); world.add(m); return { i, j, off, m }; }));
    const rBonds = mkBonds(LAY.reactBonds, reactMat), pBonds = mkBonds(LAY.prodBonds, prodMat);

    // Chloroplast tint (behind everything) and the light: a soft gold glow plus falling photons.
    const softTex = (r, g, b) => { const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d'); const gr = x.createRadialGradient(64, 64, 4, 64, 64, 64); gr.addColorStop(0, `rgba(${r},${g},${b},1)`); gr.addColorStop(1, `rgba(${r},${g},${b},0)`); x.fillStyle = gr; x.fillRect(0, 0, 128, 128); const t = keep(new T.CanvasTexture(c)); t.colorSpace = T.SRGBColorSpace; return t; };
    const tintMat = keep(new T.MeshBasicMaterial({ color: 0x56834b, transparent: true, opacity: 0, depthWrite: false }));
    const tintMesh = new T.Mesh(keep(new T.CircleGeometry(1, 64)), tintMat); tintMesh.position.z = -1.4; tintMesh.renderOrder = -2; world.add(tintMesh);
    const glowMat = keep(new T.SpriteMaterial({ map: softTex(216, 178, 58), transparent: true, opacity: 0, depthWrite: false }));
    const glow = new T.Sprite(glowMat); glow.renderOrder = -1; world.add(glow);
    const sugarGlowMat = keep(new T.SpriteMaterial({ map: softTex(216, 178, 58), transparent: true, opacity: 0, depthWrite: false }));
    const sugarGlow = new T.Sprite(sugarGlowMat); sugarGlow.renderOrder = -1; world.add(sugarGlow);
    const photonMat = keep(new T.MeshBasicMaterial({ color: 0xd8b23a, transparent: true, opacity: 0 }));
    const rayMat = keep(new T.MeshBasicMaterial({ color: 0xd8b23a, transparent: true, opacity: 0, depthWrite: false }));
    const photonGeo = keep(new T.SphereGeometry(0.11, 14, 10)), rayGeo = keep(new T.CylinderGeometry(0.025, 0.025, 1, 6));
    const photons = Array.from({ length: 9 }, (_, k) => { const p = new T.Mesh(photonGeo, photonMat), r = new T.Mesh(rayGeo, rayMat); world.add(p, r); return { p, r, phase: k / 9, x: 0 }; });

    // Arrow between the two sides.
    const arrowMat = keep(new T.MeshStandardMaterial({ color: 0x182944, roughness: 0.5 }));
    const arrowGrp = new T.Group(); world.add(arrowGrp);
    const shaft = new T.Mesh(keep(new T.CylinderGeometry(0.05, 0.05, 1, 12)), arrowMat), head = new T.Mesh(keep(new T.ConeGeometry(0.15, 0.32, 18)), arrowMat);
    arrowGrp.add(shaft, head);

    /* ---------- labels (canvas sprites, constant on-screen size) ---------- */
    const labels = [];
    function makeLabel(text, o = {}) {
      const c = document.createElement('canvas'), g = c.getContext('2d'), fs = 44, pad = 22;
      const font = `${o.bold === false ? 600 : 700} ${fs}px Montserrat, "Segoe UI", system-ui, sans-serif`;
      g.font = font; const w = Math.ceil(g.measureText(text).width) + pad * 2, h = Math.round(fs * 1.55);
      c.width = w; c.height = h; g.font = font;
      if (o.box !== false) { g.beginPath(); if (g.roundRect) g.roundRect(2, 2, w - 4, h - 4, 18); else g.rect(2, 2, w - 4, h - 4); g.fillStyle = o.bg || 'rgba(250,247,238,0.94)'; g.fill(); g.lineWidth = 3; g.strokeStyle = o.stroke || '#182944'; g.stroke(); }
      g.fillStyle = o.ink || '#182944'; g.textBaseline = 'middle'; g.fillText(text, pad, h / 2 + 2);
      const tex = keep(new T.CanvasTexture(c)); tex.colorSpace = T.SRGBColorSpace; tex.minFilter = T.LinearFilter; tex.generateMipmaps = false;
      const mat = keep(new T.SpriteMaterial({ map: tex, depthTest: false, depthWrite: false, transparent: true }));
      const sp = new T.Sprite(mat); sp.renderOrder = 20; world.add(sp);
      const lab = { sp, mat, aspect: w / h, px: o.px || 22 }; labels.push(lab); return lab;
    }
    const labReact = makeLabel('6 CO₂ + 6 H₂O'), labProd = makeLabel('C₆H₁₂O₆ + 6 O₂');
    const labLight = makeLabel('light', { box: false, ink: '#7d5210', px: 20 }), labChl = makeLabel('chlorophyll', { box: false, ink: '#2f4a29', px: 20 });
    const labIn = makeLabel('light energy in', { bg: 'rgba(250,240,205,0.96)', stroke: '#bd8126', ink: '#5c3d0a' });
    const labStored = makeLabel('chemical energy stored in glucose', { bg: 'rgba(250,240,205,0.96)', stroke: '#bd8126', ink: '#5c3d0a', px: 19 });

    /* ---------- layout: side by side on wide screens, stacked on narrow (phones) ---------- */
    let W = 1, H = 1, vertical = false;
    const cur = { R: [], P: [], M: [] }; // world-local positions for reactant, product and mid (light) poses
    const boxes = {};
    function bbox(pts) { const b = [Infinity, -Infinity, Infinity, -Infinity]; pts.forEach(p => { b[0] = Math.min(b[0], p[0]); b[1] = Math.max(b[1], p[0]); b[2] = Math.min(b[2], p[1]); b[3] = Math.max(b[3], p[1]); }); return b; }
    function layout() {
      const rb = bbox(LAY.atoms.map(a => a.R)), pb = bbox(LAY.atoms.map(a => a.P));
      const rc = [(rb[0] + rb[1]) / 2, (rb[2] + rb[3]) / 2], pc = [(pb[0] + pb[1]) / 2, (pb[2] + pb[3]) / 2];
      const rw = rb[1] - rb[0], pw = pb[1] - pb[0], rh = rb[3] - rb[2], ph = pb[3] - pb[2];
      let ro, po; const gap = vertical ? 2.0 : 2.0;
      if (!vertical) { const total = rw + gap + pw; ro = [-total / 2 + rw / 2, 0]; po = [total / 2 - pw / 2, 0]; }
      else { ro = [0, 0]; po = [0, 0]; } // narrow screens: products form in the same place as the reactants
      cur.R = LAY.atoms.map(a => [a.R[0] - rc[0] + ro[0], a.R[1] - rc[1] + ro[1], a.R[2]]);
      cur.P = LAY.atoms.map(a => [a.P[0] - pc[0] + po[0], a.P[1] - pc[1] + po[1], a.P[2]]);
      // Light stage: bonds broken, every atom has started moving a quarter of the way towards its product position.
      cur.M = cur.R.map((r, i) => { const p = cur.P[i]; return [r[0] + (p[0] - r[0]) * (vertical ? 0.3 : 0.06) + 0.3 * jit(i, 9), r[1] + (p[1] - r[1]) * (vertical ? 0.3 : 0.06) + 0.3 * jit(i, 10), r[2] + 0.3 * jit(i, 11)]; });
      boxes.r = [ro[0] - rw / 2, ro[0] + rw / 2, ro[1] - rh / 2, ro[1] + rh / 2];
      boxes.p = [po[0] - pw / 2, po[0] + pw / 2, po[1] - ph / 2, po[1] + ph / 2];
      const all = [boxes.r[0], boxes.p[1], Math.min(boxes.r[2], boxes.p[2]), Math.max(boxes.r[3], boxes.p[3])];
      boxes.all = vertical ? [Math.min(boxes.r[0], boxes.p[0]), Math.max(boxes.r[1], boxes.p[1]), Math.min(boxes.r[2], boxes.p[2]), Math.max(boxes.r[3], boxes.p[3])] : all;
      arrowGrp.visible = !vertical; labLight.sp.visible = labChl.sp.visible = !vertical;
      // arrow
      const len = 1.15;
      if (!vertical) { const x0 = boxes.r[1] + (gap - len) / 2; arrowGrp.position.set(x0 + len / 2, 0, 0); arrowGrp.rotation.set(0, 0, -Math.PI / 2); }
      
      shaft.scale.set(1, len - 0.3, 1); shaft.position.set(0, -0.15, 0); head.position.set(0, len / 2 - 0.16 + 0.0, 0);
      // tint and glows
      const bx = boxes.all, cxA = (bx[0] + bx[1]) / 2, cyA = (bx[2] + bx[3]) / 2;
      tintMesh.position.set(cxA, cyA, -1.4); tintMesh.scale.set((bx[1] - bx[0]) / 2 + 0.9, (bx[3] - bx[2]) / 2 + 0.9, 1);
      glow.position.set((boxes.r[0] + boxes.r[1]) / 2, (boxes.r[2] + boxes.r[3]) / 2, -0.6); glow.scale.setScalar(Math.max(rw, rh) * 1.5);
      const gb = bbox(LAY.atoms.map((a, i) => (a.P[0] < 2 ? cur.P[i] : null)).filter(Boolean));
      const gpos = [(gb[0] + gb[1]) / 2, (gb[2] + gb[3]) / 2, Math.max(gb[1] - gb[0], gb[3] - gb[2])];
      sugarGlow.position.set(gpos[0], gpos[1], -0.7); sugarGlow.scale.setScalar(gpos[2] * 1.45);
      boxes.glucose = gpos;
      photons.forEach((ph, k) => { ph.x = bx[0] + 0.4 + (bx[1] - bx[0] - 0.8) * ((k + 0.5) / photons.length); });
    }

    /* ---------- camera fit (covers both sides at every stage, so the view never jumps) ---------- */
    const cam = { x: 0, y: 0, D: 14 };
    const worldPerPx = () => 2 * cam.D * tanH / H;
    const labRow = () => 22 * worldPerPx() + 0.3;
    function fit() {
      const b = boxes.all, aspect = W / H, rows = 1;
      cam.D = 14;
      for (let it = 0; it < 3; it++) {
        const lr = labRow(), top = b[3] + rows * lr, bottom = b[2] - rows * lr;
        const hw = (b[1] - b[0]) / 2 + 0.6, hh = (top - bottom) / 2 + 0.15;
        cam.x = (b[0] + b[1]) / 2; cam.y = (top + bottom) / 2;
        cam.D = Math.max(hh / tanH, hw / (tanH * aspect)) + 0.5;
      }
      camera.position.set(cam.x, cam.y, cam.D); camera.lookAt(cam.x, cam.y, 0);
    }
    function placeLabels() {
      const wpp = worldPerPx(), lr = labRow();
      labels.forEach(l => { const h = l.px * wpp; l.sp.scale.set(h * l.aspect, h, 1); });
      const cx = bx => (bx[0] + bx[1]) / 2, all = boxes.all;
      labReact.sp.position.set(cx(boxes.r), all[3] + lr / 2 + 0.05, 0.5);
      const a = arrowGrp.position, half = l => l.px * wpp * l.aspect / 2;
      if (!vertical) {
        labProd.sp.position.set(cx(boxes.p), all[3] + lr / 2 + 0.05, 0.5);
        labLight.sp.position.set(a.x, a.y + 0.3 + labLight.px * wpp * 0.6, 0.4); labChl.sp.position.set(a.x, a.y - 0.3 - labChl.px * wpp * 0.6, 0.4);
        labIn.sp.position.set(cx(boxes.r), all[2] - lr / 2 - 0.05, 0.6);
        labStored.sp.position.set(boxes.glucose[0], all[2] - lr / 2 - 0.05, 0.6);
      } else {
        labProd.sp.position.set(cx(boxes.p), all[3] + lr / 2 + 0.05, 0.5);
        labIn.sp.position.set(cx(boxes.r), all[2] - lr / 2 - 0.05, 0.6);
        labStored.sp.position.set(cx(boxes.p), all[2] - lr / 2 - 0.05, 0.6);
      }
    }

    /* ---------- pose: t in [0, 2]; 0 reactants, 1 light, 2 products ---------- */
    let t = 0, target = 0, tw = null, raf = 0, visible = true, disposed = false, clock = 0;
    const smooth = (a, b, x) => { const u = Math.min(1, Math.max(0, (x - a) / (b - a))); return u * u * (3 - 2 * u); };
    const lerp3 = (a, b, u) => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u];
    const tmpA = new T.Vector3(), tmpB = new T.Vector3(), UP = new T.Vector3(0, 1, 0), Zax = new T.Vector3(0, 0, 1), perp = new T.Vector3();
    let hi = 'none';
    function setPose() {
      atomMeshes.forEach((m, i) => {
        // Small per-atom stagger so the rearrangement reads as many separate atoms moving.
        const k = (i % 9) / 9 * 0.12;
        const p = t <= 1 ? lerp3(cur.R[i], cur.M[i], smooth(k, 1 - 0.12 + k, t)) : lerp3(cur.M[i], cur.P[i], smooth(1 + k, 2 - 0.12 + k, t));
        m.position.set(p[0], p[1], p[2]);
      });
      const dim = hi === 'none' ? 1 : 0.35;
      const rOp = (1 - smooth(0.05, 0.6, t)) * dim, pOp = smooth(1.55, 1.95, t) * dim;
      const place = (b, op) => {
        b.m.visible = op > 0.02; if (!b.m.visible) return;
        tmpA.copy(atomMeshes[b.i].position); tmpB.copy(atomMeshes[b.j].position);
        const len = tmpA.distanceTo(tmpB);
        b.m.position.copy(tmpA).add(tmpB).multiplyScalar(0.5);
        const dir = tmpB.sub(tmpA).normalize();
        if (b.off) { perp.crossVectors(dir, Zax).normalize().multiplyScalar(0.075 * b.off); b.m.position.add(perp); }
        b.m.scale.set(b.off ? 0.75 : 1, Math.max(0.001, len), b.off ? 0.75 : 1);
        b.m.quaternion.setFromUnitVectors(UP, dir);
      };
      reactMat.opacity = rOp; prodMat.opacity = pOp;
      rBonds.forEach(b => place(b, rOp)); pBonds.forEach(b => place(b, pOp));
      const lightAmt = smooth(0.25, 0.95, t) * (1 - smooth(1.35, 1.9, t));
      tintMat.opacity = 0.13 * smooth(0.3, 1, t);
      glowMat.opacity = 0.55 * lightAmt; rayMat.opacity = 0.55 * lightAmt; photonMat.opacity = lightAmt;
      sugarGlowMat.opacity = 0.5 * smooth(1.6, 2, t);
      if (vertical) { const sw = smooth(1.2, 1.7, t); labReact.mat.opacity = 1 - sw; labProd.mat.opacity = sw; labReact.sp.visible = sw < 0.98; labProd.sp.visible = sw > 0.02; } else { labReact.mat.opacity = 1 - 0.55 * smooth(1.6, 2, t); labProd.mat.opacity = 0.45 + 0.55 * smooth(1.6, 2, t); labReact.sp.visible = labProd.sp.visible = true; }
      labIn.mat.opacity = lightAmt; labIn.sp.visible = lightAmt > 0.02;
      labStored.mat.opacity = smooth(1.7, 2, t); labStored.sp.visible = t > 1.7;
      placePhotons(lightAmt);
    }
    function placePhotons(amt) {
      const top = cam.y + cam.D * tanH + 0.2, bottom = (boxes.r[2] + boxes.r[3]) / 2 + (vertical ? 0.6 : 0), span = top - bottom;
      photons.forEach(ph => {
        ph.p.visible = ph.r.visible = amt > 0.02; if (!ph.p.visible) return;
        const u = reduce() ? (0.25 + 0.5 * ph.phase) : ((clock * 0.45 + ph.phase) % 1);
        const y = top - u * span;
        ph.p.position.set(ph.x, y, 0.9);
        const rl = Math.min(1.1, u * span); ph.r.position.set(ph.x, y + rl / 2, 0.9); ph.r.scale.set(1, Math.max(0.01, rl), 1);
      });
    }
    function applyHighlight(h) {
      hi = h;
      Object.entries(elMat).forEach(([el, m]) => { const on = h === 'none' || h === el; m.opacity = on ? 1 : 0.12; m.depthWrite = on; m.needsUpdate = true; });
    }
    const draw = () => { if (disposed) return; placeLabels(); setPose(); renderer.render(scene, camera); };
    const animating = () => !!tw || (!reduce() && t > 0.25 && t < 1.9);
    function frame(now) {
      raf = 0; if (disposed || !visible) return;
      clock = now / 1000;
      if (tw) { const u = Math.min(1, (now - tw.start) / tw.dur); const e = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2; t = tw.from + (tw.to - tw.from) * e; if (u >= 1) { t = tw.to; tw = null; } }
      draw();
      if (animating()) raf = requestAnimationFrame(frame);
    }
    const kick = () => { if (!raf && visible && !disposed) raf = requestAnimationFrame(frame); };
    function goTo(to, from = t) {
      target = to;
      if (reduce() || !visible) { tw = null; t = to; draw(); return; }
      tw = { from, to, start: performance.now(), dur: 900 + 1100 * Math.abs(to - from) }; t = from; kick();
    }
    const stageT = s => STAGES.indexOf(stageOf(s));
    function describe(s) {
      const st = stageOf(s);
      const what = st === 'reactants' ? 'six carbon dioxide molecules and six water molecules' : st === 'light' ? 'light energy arriving; bonds broken and atoms starting to rearrange inside a chloroplast' : 'one glucose molecule, C6H12O6, and six oxygen molecules; chemical energy is stored in glucose';
      canvas.setAttribute('aria-label', `Rotatable 3D ball-and-stick model of photosynthesis showing ${what}. Carbon dark grey, oxygen red, hydrogen white. Atom counts are equal on both sides: carbon 6, hydrogen 12, oxygen 18.${hiOf(s) !== 'none' ? ` ${NAME[hiOf(s)]} atoms highlighted.` : ''} Drag or use arrow keys to rotate.`);
    }

    function resize() {
      const r = host.getBoundingClientRect(); if (!r.width || !r.height) return;
      W = r.width; H = r.height; renderer.setSize(W, H, false); camera.aspect = W / H; camera.updateProjectionMatrix();
      const v = W / H < 1.35; if (v !== vertical || !cur.R.length) { vertical = v; layout(); }
      fit(); draw();
    }

    /* ---------- pointer (mouse, touch, pen) and keyboard rotation ---------- */
    let last = null;
    const clampY = y => Math.max(-0.9, Math.min(0.9, y)), clampX = x => Math.max(-0.6, Math.min(0.6, x));
    const rotated = () => { state.rx = world.rotation.x; state.ry = world.rotation.y; draw(); };
    const onDown = e => { if (e.button !== undefined && e.button !== 0) return; last = [e.clientX, e.clientY]; try { canvas.setPointerCapture(e.pointerId); } catch (_) { /* ignore */ } };
    const onMove = e => { if (!last) return; world.rotation.y = clampY(world.rotation.y + (e.clientX - last[0]) * 0.008); world.rotation.x = clampX(world.rotation.x + (e.clientY - last[1]) * 0.008); last = [e.clientX, e.clientY]; rotated(); };
    const onUp = () => { last = null; };
    const onKey = e => {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) return;
      e.preventDefault(); e.stopPropagation();
      world.rotation.y = clampY(world.rotation.y + (e.key === 'ArrowLeft' ? -0.12 : e.key === 'ArrowRight' ? 0.12 : 0));
      world.rotation.x = clampX(world.rotation.x + (e.key === 'ArrowUp' ? -0.12 : e.key === 'ArrowDown' ? 0.12 : 0));
      rotated();
    };
    canvas.addEventListener('pointerdown', onDown); canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp); canvas.addEventListener('pointercancel', onUp); canvas.addEventListener('keydown', onKey);

    world.rotation.set(typeof state.rx === 'number' ? state.rx : 0.08, typeof state.ry === 'number' ? state.ry : -0.12, 0);
    const observer = new ResizeObserver(resize); observer.observe(host);
    { const r = host.getBoundingClientRect(); W = r.width || 560; H = r.height || 260; vertical = W / H < 1.35; renderer.setSize(W, H, false); camera.aspect = W / H; camera.updateProjectionMatrix(); }
    layout(); fit();
    t = target = stageT(state); applyHighlight(hiOf(state)); describe(state); draw(); kick();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (!disposed) draw(); }).catch(() => {});

    return {
      update(s) {
        if (disposed) return;
        applyHighlight(hiOf(s)); describe(s);
        const to = stageT(s);
        if (to !== target) goTo(to); else draw();
      },
      command(cmd, s) { if (cmd === 'replay') { describe(s); goTo(2, 0); } },
      visibility(v) { visible = !!v; if (!visible) { cancelAnimationFrame(raf); raf = 0; if (tw) { t = tw.to; tw = null; } } else { draw(); kick(); } },
      dispose() {
        disposed = true; cancelAnimationFrame(raf); raf = 0; tw = null; observer.disconnect();
        canvas.removeEventListener('pointerdown', onDown); canvas.removeEventListener('pointermove', onMove);
        canvas.removeEventListener('pointerup', onUp); canvas.removeEventListener('pointercancel', onUp); canvas.removeEventListener('keydown', onKey);
        scene.traverse(o => { if (o.geometry) bin.add(o.geometry); if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(mt => { bin.add(mt); if (mt.map) bin.add(mt.map); }); });
        bin.forEach(x => { try { x.dispose(); } catch (_) { /* ignore */ } }); bin.clear();
        try { renderer.dispose(); renderer.forceContextLoss(); } catch (_) { /* ignore */ }
        canvas.remove(); host.classList.remove('is-live');
      }
    };
  }

  return {
    caption: 'Schematic: tracks atom numbers only. Drag or use arrow keys to rotate.',
    defaults: { stage: 'reactants', highlight: 'none' },
    controls, readout, command, mount, audit
  };
})();
