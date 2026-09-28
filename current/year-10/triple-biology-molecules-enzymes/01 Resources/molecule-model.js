/* Lesson 01 · "molecules" — local Three.js (r160, global THREE) model of starch, glycogen, protein and lipid.
   Original geometry. No autoplay, no network calls, no storage of pupil data. Render on demand; tweens only.
   State: {molecule:'starch'|'glycogen'|'protein'|'lipid', split:false, elements:false} (+ rx/ry rotation memory).
   Commands: 'split' (button 'Break apart' / 'Rebuild'), 'elements' ('Show elements' / 'Hide elements'). */
window.LessonModels = window.LessonModels || {};
window.LessonModels.molecules = (() => {
  const MOLS = ['starch', 'glycogen', 'protein', 'lipid'];
  const pick = s => (s && MOLS.includes(s.molecule) ? s.molecule : 'starch');
  const reduce = () => !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const btn = (label, value, pressed, cmd = false, cls = '') => `<button type="button"${cls ? ` class="${cls}"` : ''} data-action="${cmd ? 'model-cmd' : 'model'}" data-value="${value}"${pressed === undefined ? '' : ` aria-pressed="${pressed}"`}>${label}</button>`;
  const row = (k, v) => `<p><span class="readout-key">${k}</span><span class="readout-value">${v}</span></p>`;

  /* Locked wording (build spec §4). One key line (name · elements) + one value line (built from · job): short enough
     to sit beside step text and controls at 1280×720, and true to the current model state. */
  const INFO = {
    starch: {
      title: 'Starch', key: 'Starch · carbohydrate · C, H, O',
      value: 'Many glucose units in a chain — the plant energy store.',
      splitTitle: 'Starch · building blocks',
      pieces: '14 identical glucose units (real starch has thousands). Digestion breaks the bonds between them.',
      desc: 'starch: a gently coiled chain of gold hexagonal glucose rings with one short branch',
      splitDesc: 'starch separated into 14 identical gold glucose rings, labelled glucose'
    },
    glycogen: {
      title: 'Glycogen', key: 'Glycogen · carbohydrate · C, H, O',
      value: 'Many glucose units, highly branched — animal energy store.',
      splitTitle: 'Glycogen · building blocks',
      pieces: '30 glucose units — the same unit as starch, branched differently. Digestion breaks these bonds.',
      desc: 'glycogen: a compact, highly branched cluster of gold hexagonal glucose rings, with a branch every few units',
      splitDesc: 'glycogen separated into 30 identical gold glucose rings, labelled glucose'
    },
    protein: {
      title: 'Protein', key: 'Protein · C, H, O, N (often S)',
      value: 'Amino acids in a specific order, folded into a specific shape — growth and repair.',
      splitTitle: 'Protein · building blocks',
      pieces: '24 amino acids (colour = kind); their order decides the fold. Digestion breaks these bonds.',
      desc: 'protein: a chain of coloured beads, one colour per kind of amino acid, folded into a compact shape with a coiled section',
      splitDesc: 'protein separated into 24 coloured amino-acid beads laid out in their original order'
    },
    lipid: {
      title: 'Lipid (triglyceride)', key: 'Lipid · C, H, O (far less O)',
      value: 'Glycerol + 3 fatty acids — about twice carbohydrate’s energy per gram.',
      splitTitle: 'Lipid · building blocks',
      pieces: '1 glycerol + 3 fatty acids — not one repeating unit. Digestion breaks these bonds.',
      desc: 'lipid: a teal glycerol backbone of three linked blocks with three green zig-zag fatty-acid tails, like the letter E',
      splitDesc: 'lipid separated into one teal glycerol and three green fatty acids'
    }
  };
  const ELEMENTS = { starch: ['C', 'H', 'O'], glycogen: ['C', 'H', 'O'], protein: ['C', 'H', 'O', 'N'], lipid: ['C', 'H', 'O'] };
  const EL_NOTE = { protein: '(+ S in many)', lipid: '(much less O)' };

  function readout(p, s) {
    const I = INFO[pick(s)];
    return s.split ? row(I.splitTitle, I.pieces) : row(I.key, I.value);
  }
  function controls(p, s) {
    const m = pick(s);
    return `<div class="control-group"><span class="control-label">Molecule</span>${MOLS.map(k => btn(k[0].toUpperCase() + k.slice(1), 'molecule=' + k, m === k)).join('')}</div>` +
      `<div class="control-group">${btn(s.split ? 'Rebuild' : 'Break apart', 'split', !!s.split, true, 'is-primary')}${btn(s.elements ? 'Hide elements' : 'Show elements', 'elements', !!s.elements, true)}</div>`;
  }
  function command(cmd, s) {
    if (cmd === 'split') s.split = !s.split;
    if (cmd === 'elements') s.elements = !s.elements;
  }

  /* ---------- geometry layouts (group-local coordinates) ---------- */
  function layouts(T) {
    const V = (x, y, z) => new T.Vector3(x, y, z);
    const Z = V(0, 0, 1), Y = V(0, 1, 0);
    const rows = (n, per, dx, dy, y0 = 0) => {
      const out = [], nr = Math.ceil(n / per);
      for (let i = 0; i < n; i++) {
        const r = Math.floor(i / per), c = i % per, inRow = Math.min(per, n - r * per);
        out.push(V((c - (inRow - 1) / 2) * dx, y0 + ((nr - 1) / 2 - r) * dy, 0));
      }
      return out;
    };
    // Starch: 11-unit gentle helix (about 6 glucose per turn) + one 3-unit branch = 14 glucose units.
    const starch = { home: [], links: [], ori: [] };
    for (let i = 0; i < 11; i++) {
      const a = i * Math.PI / 3;
      starch.home.push(V((i - 5) * 0.66, 0.32 * Math.sin(a) + 0.35, 0.32 * Math.cos(a)));
      starch.ori.push([0.45 * Math.sin(a), 0.35 * Math.cos(a), 0]);
      if (i) starch.links.push([i - 1, i]);
    }
    const bdir = V(0.5, -0.86, 0.12).normalize();
    for (let k = 1; k <= 3; k++) {
      starch.home.push(starch.home[7].clone().addScaledVector(bdir, 0.66 * k));
      starch.ori.push([0.3 * k, -0.4, 0.2]);
      starch.links.push([k === 1 ? 7 : 10 + k - 1, 10 + k]);
    }
    starch.apart = rows(14, 7, 0.92, 1.0, -0.15);
    starch.tags = [{ text: 'glucose unit', at: 1, off: V(-0.35, 0.5, 0.2), axis: 'y' }, { text: 'branch', at: 13, off: V(0.45, 0.02, 0.2), axis: 'x' }];
    starch.splitTags = [{ text: 'glucose × 14', pos: V(0, 0.7, 0), dir: 1 }];

    // Glycogen: three arms from a centre unit; a branch roughly every three units = 30 compact, highly branched units.
    const gly = { home: [V(0, 0, 0)], links: [], ori: [[0, 0, 0]] };
    const chain = (from, dir, n, bend, dz = 0) => {
      let prev = from; const d = dir.clone(); const idx = [];
      for (let k = 0; k < n; k++) {
        d.applyAxisAngle(Z, bend).normalize();
        const i = gly.home.length;
        gly.home.push(gly.home[prev].clone().addScaledVector(d, 0.62).add(V(0, 0, dz)));
        gly.ori.push([0.3 * Math.sin(i * 1.7), 0.34 * Math.cos(i * 2.3), i * 0.37]);
        gly.links.push([prev, i]); prev = i; idx.push(i);
      }
      return { end: prev, dir: d, idx };
    };
    let tagBranch = 0, tagLeaf = 0;
    [0.35, 1.92, 3.49, 5.06].forEach((ang, a) => {
      const c0 = chain(0, V(Math.cos(ang), Math.sin(ang), 0), 2, 0, a % 2 ? -0.1 : 0.1);
      if (a === 0) tagBranch = c0.end;
      [1, -1].forEach((sg, j) => {
        const c1 = chain(c0.end, c0.dir.clone().applyAxisAngle(Z, sg * 0.8), 2, sg * 0.1, sg * 0.12);
        if (j === 0 || a === 2) chain(c1.idx[0], c1.dir.clone().applyAxisAngle(Z, -sg * 0.9), 1, 0, 0.25);
        if (a === 2 && j === 1) tagLeaf = c1.end;
      });
    });
    const gx = gly.home.map(q => q.x), gx0 = Math.min(...gx), gx1 = Math.max(...gx), gy = gly.home.map(q => q.y), gy0 = Math.min(...gy), gy1 = Math.max(...gy);
    gly.apart = rows(gly.home.length, 10, 0.84, 0.92, -0.2);
    gly.tags = [
      // Wide host: labels beside the cluster. Narrow host (drawer open): labels above and below instead.
      { text: 'branch point', at: tagBranch, off: V(gx1 - gly.home[tagBranch].x + 0.3, 0.45, 0.3), axis: 'x', nOff: V(0.4, gy1 - gly.home[tagBranch].y + 0.4, 0.3), nAxis: 'y' },
      { text: 'glucose unit', at: tagLeaf, off: V(gx0 - gly.home[tagLeaf].x - 0.3, -0.3, 0.3), axis: 'x', nOff: V(0.2, gy0 - gly.home[tagLeaf].y - 0.4, 0.3), nAxis: 'y' }
    ];
    gly.splitTags = [{ text: 'glucose × 30', pos: V(0, 1.05, 0), dir: 1 }];

    // Protein: 24 amino acids — a coiled (helix) section, a turn, two antiparallel strands.
    const prot = { home: [], links: [] };
    for (let i = 0; i < 10; i++) { const a = i * 100 * Math.PI / 180; prot.home.push(V(-1.2 + 0.42 * Math.cos(a), -1.25 + i * 0.28, 0.42 * Math.sin(a))); }
    prot.home.push(V(-0.55, 1.72, 0.1), V(0.05, 1.5, 0.35));
    [1.0, 0.38, -0.24, -0.86, -1.48].forEach((y, k) => prot.home.push(V(0.45, y, k % 2 ? -0.1 : 0.15)));
    prot.home.push(V(0.95, -1.95, 0.2), V(1.55, -1.72, 0));
    [-1.1, -0.48, 0.14, 0.76, 1.38].forEach((y, k) => prot.home.push(V(1.3, y, k % 2 ? 0.15 : -0.1)));
    for (let i = 1; i < 24; i++) prot.links.push([i - 1, i]);
    prot.home.forEach(p => { p.y += 0.12; });
    prot.seq = [0, 3, 1, 5, 2, 4, 6, 2, 5, 1, 3, 0, 4, 6, 1, 2, 5, 0, 3, 4, 6, 2, 1, 5];
    prot.apart = rows(24, 8, 0.74, 0.86, -0.2);
    prot.tags = [{ text: 'amino acid', at: 21, off: V(0.45, 0.3, 0.3), axis: 'x' }, { text: 'folded chain', at: 4, off: V(-0.6, -0.9, 0.3), axis: 'x' }];
    prot.splitTags = [{ text: 'amino acids × 24', pos: V(0, 0.95, 0), dir: 1 }];

    // Lipid: glycerol (three linked blocks) + three zig-zag fatty acids = an E shape.
    const lip = {
      glyHome: V(-2.05, 0, 0), glyApart: V(-2.75, 0, 0), blocks: [0.9, 0, -0.9],
      faHome: [V(-1.45, 0.9, 0), V(-1.45, 0, 0), V(-1.45, -0.9, 0)], faApart: [V(-1.05, 1.3, 0), V(-1.05, 0, 0), V(-1.05, -1.3, 0)],
      faLen: [13, 14, 12]
    };
    lip.tags = [{ text: 'glycerol', unit: 0, local: V(0, 0.9, 0), off: V(-0.2, 0.55, 0.2), axis: 'y', gap: 0.28 }, { text: 'fatty acid', unit: 1, local: V(2.03, 0.13, 0), off: V(0.9, 0.5, 0.2), axis: 'y', gap: 0.1 }];
    lip.splitTags = [{ text: 'glycerol', pos: V(-2.75, -1.2, 0), dir: -1 }, { text: 'fatty acid × 3', pos: V(0.75, 1.55, 0), dir: 1 }];
    return { starch, glycogen: gly, protein: prot, lipid: lip, Y };
  }

  /* ---------- mount ---------- */
  function mount(host, state, phase, ctx) {
    const T = window.THREE; if (!T || !host) return null;
    // Probe first so a machine without WebGL gets the SVG fallback quietly (no renderer error in the console).
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
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = T.VSMShadowMap; renderer.autoClear = false;
    const canvas = renderer.domElement; canvas.tabIndex = 0; canvas.setAttribute('role', 'img');
    host.appendChild(canvas); host.classList.add('is-live');

    const bin = new Set(); const keep = x => { bin.add(x); return x; };
    const L = layouts(T);
    const scene = new T.Scene(), camera = new T.PerspectiveCamera(30, 2, 0.1, 200);
    const hud = new T.Scene(), hudCam = new T.OrthographicCamera(0, 100, 100, 0, -10, 10);
    const tanH = Math.tan(T.MathUtils.degToRad(camera.fov / 2));

    // Lighting: warm sky, soft ground bounce, key light with soft shadow on the paper, cool fill and rim.
    scene.add(new T.HemisphereLight(0xfffaf0, 0x8d8272, 1.55));
    const key = new T.DirectionalLight(0xfff3e2, 2.5); key.position.set(-4, 7, 11); key.castShadow = true;
    key.shadow.mapSize.set(768, 768); Object.assign(key.shadow.camera, { left: -9, right: 9, top: 9, bottom: -9, near: 0.5, far: 60 });
    key.shadow.bias = -0.0005; key.shadow.radius = 9; key.shadow.blurSamples = 12; key.shadow.camera.updateProjectionMatrix();
    scene.add(key, key.target);
    const fill = new T.DirectionalLight(0xe4ecff, 0.75); fill.position.set(7, -3, 6); scene.add(fill);
    const rim = new T.DirectionalLight(0xffffff, 0.9); rim.position.set(1, 5, -9); scene.add(rim);
    const backdrop = new T.Mesh(keep(new T.PlaneGeometry(90, 90)), keep(new T.ShadowMaterial({ color: 0x3b2f1c, opacity: 0.13 })));
    backdrop.receiveShadow = true; scene.add(backdrop);

    const world = new T.Group(); scene.add(world);

    // Shared geometries and materials.
    const ringGeo = keep(new T.CylinderGeometry(0.3, 0.3, 0.14, 6)); ringGeo.rotateX(Math.PI / 2);
    const bondGeo = keep(new T.CylinderGeometry(0.055, 0.055, 1, 10));
    const beadGeo = keep(new T.SphereGeometry(0.235, 26, 18));
    const blockGeo = keep(new T.BoxGeometry(0.5, 0.5, 0.5));
    const std = (color, extra = {}) => keep(new T.MeshStandardMaterial({ color, roughness: 0.42, metalness: 0.04, ...extra }));
    const ringMats = [std(0x9b6719, { roughness: 0.5 }), std(0xcf9233, { emissive: 0x3a2206, emissiveIntensity: 0.18 }), std(0xcf9233, { emissive: 0x3a2206, emissiveIntensity: 0.18 })];
    const beadMats = [0x24748d, 0x56834b, 0xad5c63, 0x7a3f98, 0x3f6fb0, 0xd9822b, 0x5d6b7c].map(c => std(c, { roughness: 0.36 }));
    const glyMat = std(0x24748d, { roughness: 0.38 }), faMat = std(0x56834b, { roughness: 0.4 });
    const bondMat = color => std(color, { roughness: 0.55, transparent: true, opacity: 1 });

    /* ---------- labels: canvas-texture sprites redrawn at the on-screen pixel size (crisp on projectors) ---------- */
    const labels = [];
    function makeLabel(kind, text, extra = {}) {
      const c = document.createElement('canvas');
      const tex = keep(new T.CanvasTexture(c)); tex.colorSpace = T.SRGBColorSpace; tex.minFilter = T.LinearFilter; tex.generateMipmaps = false;
      const mat = keep(new T.SpriteMaterial({ map: tex, depthTest: false, depthWrite: false, transparent: true }));
      const sprite = new T.Sprite(mat); sprite.renderOrder = 20;
      const lab = { kind, text, sprite, tex, canvas: c, w: 1, h: 1, px: 0, ...extra };
      labels.push(lab); return lab;
    }
    function drawLabel(lab, px) {
      const g = lab.canvas.getContext('2d'); const h = Math.max(8, Math.round(px * dpr)); const fs = Math.round(h * (lab.kind === 'title' ? 0.56 : 0.58));
      const font = `${lab.kind === 'title' ? 700 : 650} ${fs}px Montserrat, "Segoe UI", system-ui, sans-serif`;
      g.font = font; const pad = Math.round(fs * 0.62);
      let w;
      if (lab.kind === 'badge') {
        const els = lab.els || [], d = Math.round(h * 0.74), gap = Math.round(h * 0.16);
        g.font = `600 ${Math.round(fs * 0.86)}px Montserrat, "Segoe UI", system-ui, sans-serif`;
        const noteW = lab.note ? Math.ceil(g.measureText(lab.note).width) + gap : 0;
        g.font = font; const headW = Math.ceil(g.measureText('Elements').width);
        w = pad + headW + gap * 2 + els.length * (d + gap) + noteW + pad - gap;
        lab.canvas.width = w; lab.canvas.height = h;
        g.clearRect(0, 0, w, h); roundBox(g, w, h, 'rgba(250,247,238,0.95)', '#182944');
        g.font = font; g.fillStyle = '#182944'; g.textBaseline = 'middle'; g.fillText('Elements', pad, h / 2 + dpr);
        const colours = { C: ['#2b2f36', '#ffffff'], H: ['#ffffff', '#182944'], O: ['#c23b2b', '#ffffff'], N: ['#2f5fb0', '#ffffff'] };
        let x = pad + headW + gap * 2;
        els.forEach(e => {
          const [bg, fg] = colours[e] || ['#888', '#fff'];
          g.beginPath(); g.arc(x + d / 2, h / 2, d / 2 - dpr, 0, Math.PI * 2); g.fillStyle = bg; g.fill(); g.lineWidth = 1.5 * dpr; g.strokeStyle = '#182944'; g.stroke();
          g.fillStyle = fg; g.font = `800 ${Math.round(d * 0.6)}px Montserrat, "Segoe UI", system-ui, sans-serif`; g.textAlign = 'center'; g.fillText(e, x + d / 2, h / 2 + dpr); g.textAlign = 'left';
          x += d + gap;
        });
        if (lab.note) { g.font = `600 ${Math.round(fs * 0.86)}px Montserrat, "Segoe UI", system-ui, sans-serif`; g.fillStyle = '#182944'; g.fillText(lab.note, x, h / 2 + dpr); }
      } else {
        w = Math.ceil(g.measureText(lab.text).width) + pad * 2;
        lab.canvas.width = w; lab.canvas.height = h;
        g.clearRect(0, 0, w, h);
        if (lab.kind === 'title') roundBox(g, w, h, '#182944', '#182944'); else roundBox(g, w, h, 'rgba(250,247,238,0.95)', '#182944');
        g.font = font; g.fillStyle = lab.kind === 'title' ? '#faf7ee' : '#182944'; g.textBaseline = 'middle'; g.fillText(lab.text, pad, h / 2 + dpr);
      }
      lab.w = w / dpr; lab.h = h / dpr; lab.px = px;
      lab.tex.dispose(); lab.tex.needsUpdate = true;
    }
    function roundBox(g, w, h, fill, stroke) {
      const lw = 1.5 * dpr, r = h * 0.3; g.beginPath();
      if (g.roundRect) g.roundRect(lw / 2, lw / 2, w - lw, h - lw, r); else g.rect(lw / 2, lw / 2, w - lw, h - lw);
      g.fillStyle = fill; g.fill(); g.lineWidth = lw; g.strokeStyle = stroke; g.stroke();
    }

    /* ---------- molecules (built lazily, cached until dispose) ---------- */
    const mols = {};
    const lineMat = () => keep(new T.LineBasicMaterial({ color: 0x182944, transparent: true, opacity: 0.85, depthTest: false }));
    function addBond(mol, ua, oa, ub, ob, mat) {
      const mesh = new T.Mesh(bondGeo, mat); mesh.castShadow = true; mol.root.add(mesh);
      mol.bonds.push({ mesh, ua, oa: oa || new T.Vector3(), ub, ob: ob || new T.Vector3() });
    }
    function addTag(mol, text, unitIdx, local, off, axis, gap = 0.32, nOff = null, nAxis = null) {
      const lab = makeLabel('tag', text); mol.root.add(lab.sprite);
      const geo = keep(new T.BufferGeometry()); geo.setAttribute('position', new T.BufferAttribute(new Float32Array(6), 3));
      const line = new T.Line(geo, lineMat()); line.renderOrder = 19; mol.root.add(line);
      mol.tags.push({ lab, unitIdx, local: local || new T.Vector3(), off, axis, nOff, nAxis, line, gap });
    }
    function addSplitTag(mol, text, pos, dir) { const lab = makeLabel('tag', text); lab.sprite.position.copy(pos); mol.root.add(lab.sprite); mol.splitTags.push({ lab, pos, dir }); }
    // Split labels sit just outside the row edge, however large the label is on screen (narrow hosts).
    const splitTagPos = (tg, wpp, out) => out.copy(tg.pos).setY(tg.pos.y + tg.dir * (tg.lab.h * wpp / 2 + 0.12));
    // Pointer labels: 'off' is the gap to the label's near edge, so larger on-screen labels move outwards, not onto the molecule.
    const tagPos = (tg, base, wpp, out) => {
      const nar = tg.nOff && W / H < 2, off = nar ? tg.nOff : tg.off, axis = nar ? tg.nAxis : tg.axis;
      out.copy(base).add(tg.local).add(off);
      if (axis === 'x') out.x += Math.sign(off.x) * (tg.lab.w * wpp / 2); else out.y += Math.sign(off.y) * (tg.lab.h * wpp / 2);
      return out;
    };
    function layoutTags(mol, wpp) {
      mol.tags.forEach(tg => {
        const u = mol.units[tg.unitIdx].obj.position, target = tmpA.copy(u).add(tg.local);
        const at = tagPos(tg, u, wpp, tmpB);
        tg.lab.sprite.position.copy(at);
        const dir = tmpC.copy(at).sub(target); const len = dir.length(); dir.normalize();
        const start = target.addScaledVector(dir, Math.min(tg.gap, len * 0.4));
        tg.line.geometry.attributes.position.array.set([start.x, start.y, start.z, at.x, at.y, at.z]); tg.line.geometry.attributes.position.needsUpdate = true;
      });
    }
    function build(name) {
      if (mols[name]) return mols[name];
      const root = new T.Group(); root.visible = false; world.add(root);
      const mol = { name, root, units: [], bonds: [], tags: [], splitTags: [], t: 0, scale: 1 };
      const Lm = L[name];
      if (name === 'starch' || name === 'glycogen') {
        const bm = bondMat(0x7c5a2c);
        Lm.home.forEach((h, i) => {
          const mesh = new T.Mesh(ringGeo, ringMats); mesh.castShadow = true; mesh.receiveShadow = true; root.add(mesh);
          const q = new T.Quaternion().setFromEuler(new T.Euler(...Lm.ori[i]));
          mol.units.push({ obj: mesh, home: h, apart: Lm.apart[i], hq: q, aq: new T.Quaternion().setFromEuler(new T.Euler(0.15, 0, 0)), r: 0.34 });
        });
        Lm.links.forEach(([a, b]) => addBond(mol, a, null, b, null, bm));
        Lm.tags.forEach(t => addTag(mol, t.text, t.at, null, t.off, t.axis, undefined, t.nOff, t.nAxis));
      } else if (name === 'protein') {
        const bm = bondMat(0x4b5566);
        Lm.home.forEach((h, i) => {
          const mesh = new T.Mesh(beadGeo, beadMats[Lm.seq[i]]); mesh.castShadow = true; mesh.receiveShadow = true; root.add(mesh);
          mol.units.push({ obj: mesh, home: h, apart: Lm.apart[i], r: 0.26 });
        });
        Lm.links.forEach(([a, b]) => addBond(mol, a, null, b, null, bm));
        Lm.tags.forEach(t => addTag(mol, t.text, t.at, null, t.off, t.axis, undefined, t.nOff, t.nAxis));
      } else {
        const bm = bondMat(0x182944);
        const gly = new T.Group(); root.add(gly);
        Lm.blocks.forEach(y => { const b = new T.Mesh(blockGeo, glyMat); b.position.set(0, y, 0); b.castShadow = true; b.receiveShadow = true; gly.add(b); });
        [[0.9, 0], [0, -0.9]].forEach(([a, b]) => { const m = new T.Mesh(bondGeo, glyMat); m.position.set(0, (a + b) / 2, 0); m.scale.set(1.5, 0.9, 1.5); m.castShadow = true; gly.add(m); });
        mol.units.push({ obj: gly, home: Lm.glyHome, apart: Lm.glyApart, r: 0.3, ext: [0.3, 1.2] });
        Lm.faHome.forEach((h, i) => {
          const n = Lm.faLen[i], pts = [];
          for (let k = 0; k < n; k++) pts.push(new T.Vector3(k * 0.29, (k % 2 ? 0.13 : -0.13) + (k === 0 ? 0.13 : 0), 0));
          const geo = keep(new T.TubeGeometry(new T.CatmullRomCurve3(pts, false, 'catmullrom', 0.1), n * 8, 0.085, 10, false));
          const tube = new T.Mesh(geo, faMat); tube.castShadow = true; tube.receiveShadow = true;
          const cap = new T.Mesh(beadGeo, faMat); cap.scale.setScalar(0.5); cap.position.copy(pts[n - 1]); cap.castShadow = true;
          const g = new T.Group(); g.add(tube, cap); root.add(g);
          mol.units.push({ obj: g, home: h, apart: Lm.faApart[i], r: 0.2, span: (n - 1) * 0.29 });
          addBond(mol, 0, new T.Vector3(0, Lm.blocks[i], 0), i + 1, new T.Vector3(0, 0, 0), bm);
        });
        Lm.tags.forEach(t => addTag(mol, t.text, t.unit, t.local, t.off, t.axis, t.gap));
      }
      Lm.splitTags.forEach(t => addSplitTag(mol, t.text, t.pos, t.dir));
      mols[name] = mol; sizeLabels(); setPose(mol, 0); return mol;
    }

    const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
    const tmpA = new T.Vector3(), tmpB = new T.Vector3(), tmpC = new T.Vector3(), UP = new T.Vector3(0, 1, 0);
    function unitPos(u, t, out) { return out.copy(u.home).lerp(u.apart, t); }
    function setPose(mol, t) {
      mol.t = t;
      mol.units.forEach((u, i) => {
        // Slight stagger so the units peel apart rather than moving as one block.
        const k = mol.units.length > 1 ? i / (mol.units.length - 1) : 0;
        const e = smooth(0.12 * k, 0.88 + 0.12 * k, t);
        unitPos(u, e, u.obj.position);
        if (u.hq) u.obj.quaternion.copy(u.hq).slerp(u.aq, e);
      });
      const bo = 1 - smooth(0, 0.28, t);
      mol.bonds.forEach(b => {
        const A = tmpA.copy(mol.units[b.ua].obj.position).add(b.oa), B = tmpB.copy(mol.units[b.ub].obj.position).add(b.ob);
        const len = A.distanceTo(B);
        b.mesh.position.copy(A).add(B).multiplyScalar(0.5);
        b.mesh.scale.set(1, Math.max(0.001, len), 1);
        b.mesh.quaternion.setFromUnitVectors(UP, B.sub(A).normalize());
        b.mesh.visible = bo > 0.02; b.mesh.material.opacity = bo;
      });
      const to = 1 - smooth(0, 0.3, t), so = smooth(0.7, 1, t);
      mol.tags.forEach(tg => {
        tg.lab.sprite.material.opacity = to; tg.line.material.opacity = 0.85 * to; tg.lab.sprite.visible = tg.line.visible = to > 0.02;
      });
      mol.splitTags.forEach(tg => { tg.lab.sprite.material.opacity = so; tg.lab.sprite.visible = so > 0.02; });
    }

    /* ---------- HUD (screen-space title and element badges) ---------- */
    const titleLab = makeLabel('title', ''); titleLab.sprite.center.set(0, 1); hud.add(titleLab.sprite);
    const badges = {};
    MOLS.forEach(m => { const b = makeLabel('badge', '', { els: ELEMENTS[m], note: EL_NOTE[m] }); b.sprite.center.set(1, 1); b.sprite.visible = false; hud.add(b.sprite); badges[m] = b; });

    /* ---------- sizing, camera fit ---------- */
    let W = 1, H = 1, tagPx = 24, badgeOp = 0;
    const cam = { x: 0, y: 0, D: 14 };
    function sizeLabels() {
      labels.forEach(l => { const px = l.kind === 'title' ? tagPx + 2 : l.kind === 'badge' ? tagPx + 4 : tagPx; if (Math.abs(l.px - px) > 0.5) drawLabel(l, px); });
    }
    function hudTwoRows() { const b = cur && badges[cur]; return !!(b && curEl && titleLab.w + b.w + 34 > W); }
    function worldPerPx(D) { return 2 * D * tanH / H; }
    function placeTags() {
      const wpp = worldPerPx(cam.D);
      Object.values(mols).forEach(m => { m.splitTags.forEach(tg => splitTagPos(tg, wpp, tg.lab.sprite.position)); layoutTags(m, wpp); });
      world.updateMatrixWorld(true);
      labels.forEach(l => {
        if (l.kind !== 'tag') return;
        // Constant on-screen size whatever the label's depth after rotation.
        const k = l.sprite.parent ? Math.max(0.2, (cam.D - l.sprite.getWorldPosition(tmpC).z) / cam.D) : 1;
        l.sprite.scale.set(l.w * wpp * k, l.h * wpp * k, 1);
      });
      const m = 10, two = hudTwoRows();
      titleLab.sprite.position.set(m, H - m, 0); titleLab.sprite.scale.set(titleLab.w, titleLab.h, 1);
      Object.values(badges).forEach(b => {
        // Narrow host (side drawer open): the badge drops to a second row instead of overlapping the title.
        if (two) { b.sprite.center.set(0, 1); b.sprite.position.set(m, H - m - titleLab.h - 6, 0); } else { b.sprite.center.set(1, 1); b.sprite.position.set(W - m, H - m, 0); }
        b.sprite.scale.set(b.w, b.h, 1);
      });
    }
    const ROT = { starch: [0.22, -0.22], glycogen: [0.3, -0.35], protein: [0.18, -0.5], lipid: [0.2, -0.38] }, SPLIT_ROT = [0.08, 0];
    const rotFor = (m, split) => (split ? SPLIT_ROT : ROT[m]);
    function fitTarget(mol, split, rot) {
      const q = new T.Quaternion().setFromEuler(new T.Euler(rot[0], rot[1], 0));
      const aspect = W / H, top = (hudTwoRows() ? 2 * tagPx + 30 : tagPx + 18), side = 14, bottom = 10;
      const mx = (W - 2 * side) / W, my = (H - top - bottom) / H;
      let D = cam.D || 14, cx = 0, cy = 0;
      for (let it = 0; it < 3; it++) {
        const wpp = worldPerPx(D), pts = [];
        mol.units.forEach(u => {
          const p = (split ? u.apart : u.home).clone();
          if (u.span) { pts.push([p.clone().applyQuaternion(q), 0.25, 0.25]); pts.push([p.clone().add(new T.Vector3(u.span, 0, 0)).applyQuaternion(q), 0.25, 0.25]); }
          else if (u.ext) pts.push([p.applyQuaternion(q), u.ext[0], u.ext[1]]);
          else pts.push([p.applyQuaternion(q), u.r, u.r]);
        });
        if (split) mol.splitTags.forEach(tg => pts.push([splitTagPos(tg, wpp, new T.Vector3()).applyQuaternion(q), tg.lab.w * wpp / 2, tg.lab.h * wpp / 2]));
        else mol.tags.forEach(tg => pts.push([tagPos(tg, mol.units[tg.unitIdx].home, wpp, new T.Vector3()).applyQuaternion(q), tg.lab.w * wpp / 2, tg.lab.h * wpp / 2]));
        let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
        pts.forEach(([p, ex, ey]) => { x0 = Math.min(x0, p.x - ex); x1 = Math.max(x1, p.x + ex); y0 = Math.min(y0, p.y - ey); y1 = Math.max(y1, p.y + ey); });
        cx = (x0 + x1) / 2; cy = (y0 + y1) / 2;
        let need = 1;
        pts.forEach(([p, ex, ey]) => {
          const z = p.z + Math.max(ex, ey) * 0.5;
          need = Math.max(need, z + (Math.abs(p.x - cx) + ex) / (tanH * aspect * mx), z + (Math.abs(p.y - cy) + ey) / (tanH * my));
        });
        D = need;
      }
      const wpp = worldPerPx(D);
      return { x: cx, y: cy + ((top - bottom) / 2) * wpp, D };
    }
    function applyCam() {
      camera.position.set(cam.x, cam.y, cam.D); camera.lookAt(cam.x, cam.y, 0);
      key.position.set(cam.x - 2.5, cam.y + 4.5, 14); key.target.position.set(cam.x, cam.y, 0);
      placeTags();
    }

    /* ---------- tweens and on-demand rendering ---------- */
    let raf = 0, visible = true, disposed = false, refitTimer = 0;
    const tweens = new Map();
    const easeIO = p => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
    function tween(keyName, dur, set, done) {
      if (reduce() || dur <= 0 || !visible) { set(1); tweens.delete(keyName); done && done(); draw(); return; }
      tweens.set(keyName, { start: performance.now(), dur, set, done }); kick();
    }
    function kick() { if (!raf && visible && !disposed) raf = requestAnimationFrame(frame); }
    function frame(now) {
      raf = 0; if (disposed) return;
      for (const [k, tw] of [...tweens]) {
        const p = Math.min(1, Math.max(0, (now - tw.start) / tw.dur));
        tw.set(easeIO(p));
        if (p >= 1) { tweens.delete(k); tw.done && tw.done(); }
      }
      draw();
      if (tweens.size) kick();
    }
    function finishAll() { for (const [k, tw] of [...tweens]) { tw.set(1); tweens.delete(k); tw.done && tw.done(); } }
    function draw() {
      if (disposed) return;
      applyCam();
      // Keep the shadow-catching paper just behind the visible molecule so the drop shadow stays soft and close.
      world.updateMatrixWorld(true);
      let zMin = Infinity;
      Object.values(mols).forEach(m => { if (!m.root.visible) return; m.units.forEach(u => { u.obj.getWorldPosition(tmpA); zMin = Math.min(zMin, tmpA.z - 0.4 * m.scale); }); });
      backdrop.position.set(cam.x, cam.y, isFinite(zMin) ? zMin - 0.15 : -2);
      renderer.clear(); renderer.render(scene, camera); renderer.clearDepth(); renderer.render(hud, hudCam);
    }

    /* ---------- state application ---------- */
    let cur = null, curSplit = false, curEl = false, hudRowsCache = false;
    function viewTween(target, rot, dur) {
      const from = { ...cam }, r0 = [world.rotation.x, world.rotation.y];
      tween('view', dur, u => {
        cam.x = from.x + (target.x - from.x) * u; cam.y = from.y + (target.y - from.y) * u; cam.D = from.D + (target.D - from.D) * u;
        world.rotation.set(r0[0] + (rot[0] - r0[0]) * u, r0[1] + (rot[1] - r0[1]) * u, 0);
      }, () => { state.rx = world.rotation.x; state.ry = world.rotation.y; });
    }
    function setTitle(m, split) {
      const t = split ? INFO[m].splitTitle : INFO[m].title;
      if (titleLab.text !== t) { titleLab.text = t; drawLabel(titleLab, tagPx + 2); }
    }
    function setBadges(op) { badgeOp = op; MOLS.forEach(m => { const b = badges[m]; b.sprite.visible = m === cur && op > 0.02; b.sprite.material.opacity = op; }); }
    function describe(s) {
      const m = pick(s), I = INFO[m];
      canvas.setAttribute('aria-label', `Rotatable 3D model of ${s.split ? I.splitDesc : I.desc}.${s.elements ? ` Element badges: ${ELEMENTS[m].join(', ')}${m === 'protein' ? ', and sulfur in many' : ''}.` : ''} Drag or use arrow keys to rotate.`);
    }
    function apply(s) {
      const m = pick(s), split = !!s.split, el = !!s.elements;
      const elChanged = el !== curEl; curEl = el;
      setTitle(m, split); // title width and element state are known before any camera fit
      if (m !== cur) {
        const old = cur ? mols[cur] : null, mol = build(m);
        tweens.delete('out-' + m);
        setPose(mol, split ? 1 : 0); mol.root.visible = true;
        cur = m; curSplit = split;
        if (old && old !== mol) {
          const s0 = old.scale;
          tween('out-' + old.name, 240, u => { old.scale = s0 * (1 - u) + 0.001; old.root.scale.setScalar(old.scale); }, () => { old.root.visible = false; old.scale = 1; old.root.scale.setScalar(1); });
        }
        mol.scale = 0.001; mol.root.scale.setScalar(0.001);
        tween('in-' + m, 520, u => { mol.scale = 0.001 + 0.999 * u; mol.root.scale.setScalar(mol.scale); });
        const rot = rotFor(m, split);
        viewTween(fitTarget(mol, split, rot), rot, 520);
      } else if (split !== curSplit) {
        curSplit = split;
        const mol = mols[m], t0 = mol.t, t1 = split ? 1 : 0;
        tween('split', 820 * Math.max(0.3, Math.abs(t1 - t0)), u => setPose(mol, t0 + (t1 - t0) * u));
        const rot = rotFor(m, split);
        viewTween(fitTarget(mol, split, rot), rot, 820);
      } else if (hudTwoRows() !== hudRowsCache) refit(true);
      hudRowsCache = hudTwoRows();
      if (elChanged) { const o0 = badgeOp, o1 = el ? 1 : 0; tween('badge', 260, u => setBadges(o0 + (o1 - o0) * u)); } else setBadges(badgeOp);
      describe(s);
      draw();
    }

    function refit(animate) {
      if (!cur) return;
      const t = fitTarget(mols[cur], curSplit, [world.rotation.x, world.rotation.y]);
      if (!animate) { Object.assign(cam, t); draw(); return; }
      const from = { ...cam };
      tween('refit', 320, u => { cam.x = from.x + (t.x - from.x) * u; cam.y = from.y + (t.y - from.y) * u; cam.D = from.D + (t.D - from.D) * u; });
    }
    function resize() {
      const r = host.getBoundingClientRect(); if (!r.width || !r.height) return;
      W = r.width; H = r.height; renderer.setSize(W, H, false);
      camera.aspect = W / H; camera.updateProjectionMatrix();
      hudCam.left = 0; hudCam.right = W; hudCam.top = H; hudCam.bottom = 0; hudCam.updateProjectionMatrix();
      tagPx = Math.round(Math.min(28, Math.max(20, H * 0.092)));
      sizeLabels();
      if (tweens.has('view')) finishAll();
      if (cur) Object.assign(cam, fitTarget(mols[cur], curSplit, [world.rotation.x, world.rotation.y]));
      draw();
    }

    /* ---------- pointer and keyboard rotation ---------- */
    let last = null;
    const clampX = x => Math.max(-1.2, Math.min(1.2, x));
    const rotated = () => { state.rx = world.rotation.x; state.ry = world.rotation.y; draw(); };
    const onDown = e => { if (e.button !== undefined && e.button !== 0) return; tweens.delete('view'); last = [e.clientX, e.clientY]; try { canvas.setPointerCapture(e.pointerId); } catch (_) { /* ignore */ } };
    const onMove = e => { if (!last) return; world.rotation.y += (e.clientX - last[0]) * 0.009; world.rotation.x = clampX(world.rotation.x + (e.clientY - last[1]) * 0.009); last = [e.clientX, e.clientY]; rotated(); };
    const onUp = () => { if (!last) return; last = null; refit(true); };
    const onKey = e => {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) return;
      e.preventDefault(); e.stopPropagation(); tweens.delete('view');
      world.rotation.y += e.key === 'ArrowLeft' ? -0.15 : e.key === 'ArrowRight' ? 0.15 : 0;
      world.rotation.x = clampX(world.rotation.x + (e.key === 'ArrowUp' ? -0.15 : e.key === 'ArrowDown' ? 0.15 : 0));
      rotated(); clearTimeout(refitTimer); refitTimer = setTimeout(() => refit(true), 260);
    };
    canvas.addEventListener('pointerdown', onDown); canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp); canvas.addEventListener('pointercancel', onUp); canvas.addEventListener('keydown', onKey);

    // Initial state: restore any earlier rotation on this screen, otherwise the default view.
    const m0 = pick(state), r0 = rotFor(m0, !!state.split);
    world.rotation.set(typeof state.rx === 'number' ? state.rx : r0[0], typeof state.ry === 'number' ? state.ry : r0[1], 0);
    const observer = new ResizeObserver(resize); observer.observe(host);
    { const r = host.getBoundingClientRect(); W = r.width || 560; H = r.height || 260; renderer.setSize(W, H, false); camera.aspect = W / H; camera.updateProjectionMatrix(); hudCam.right = W; hudCam.top = H; hudCam.updateProjectionMatrix(); tagPx = Math.round(Math.min(28, Math.max(20, H * 0.092))); }
    {
      const mol = build(m0); cur = m0; curSplit = !!state.split; curEl = !!state.elements;
      setPose(mol, curSplit ? 1 : 0); mol.root.visible = true; setTitle(m0, curSplit);
      sizeLabels(); Object.assign(cam, fitTarget(mol, curSplit, [world.rotation.x, world.rotation.y]));
      setBadges(curEl ? 1 : 0); hudRowsCache = hudTwoRows(); describe(state); draw();
    }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (disposed) return; labels.forEach(l => drawLabel(l, l.px || tagPx)); refit(false); }).catch(() => {});

    return {
      update: s => { if (!disposed) apply(s); },
      command: () => {},
      visibility: v => { visible = !!v; if (!visible) { cancelAnimationFrame(raf); raf = 0; finishAll(); } else draw(); },
      dispose() {
        disposed = true; cancelAnimationFrame(raf); raf = 0; clearTimeout(refitTimer); tweens.clear(); observer.disconnect();
        canvas.removeEventListener('pointerdown', onDown); canvas.removeEventListener('pointermove', onMove);
        canvas.removeEventListener('pointerup', onUp); canvas.removeEventListener('pointercancel', onUp); canvas.removeEventListener('keydown', onKey);
        scene.traverse(o => { if (o.geometry) bin.add(o.geometry); if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(mt => bin.add(mt)); });
        hud.traverse(o => { if (o.material) bin.add(o.material); });
        bin.forEach(x => { try { x.dispose(); } catch (_) { /* ignore */ } }); bin.clear();
        labels.forEach(l => { l.canvas.width = l.canvas.height = 0; }); labels.length = 0;
        try { renderer.dispose(); renderer.forceContextLoss(); } catch (_) { /* ignore */ }
        canvas.remove(); host.classList.remove('is-live');
      }
    };
  }

  return {
    caption: 'Simplified: real molecules have far more units. Drag or use arrow keys to rotate.',
    defaults: { molecule: 'starch', split: false, elements: false },
    controls, readout, command, mount
  };
})();
