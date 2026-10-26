/* Year 7 cells: local Three.js (r160, global THREE) schematic cell models.
   Original geometry. No sound, no network calls, no pupil data. Renders on demand; animates only while
   cilia beat (and never when prefers-reduced-motion is set).
   State: {cell, highlight, labels, beating} (+ rx/ry rotation memory).
   cell: animal | plant | storage | roothair | palisade | ciliated
   Science conventions (locked for the Y7 cells unit):
   - plant cells: the cell wall is OUTSIDE a separate cell membrane; both are always drawn.
   - mitochondria appear in plant and animal cells.
   - not every plant cell has chloroplasts (storage and root hair cells have none).
   - shapes, sizes, numbers and colours are schematic, not to scale. */
window.LessonModels = window.LessonModels || {};
window.LessonModels.cell = (() => {
  const INFO = {
    membrane: ['Cell membrane', 'Controls what enters and leaves the cell.', 'Plant and animal cells'],
    cytoplasm: ['Cytoplasm', 'Where many chemical reactions happen.', 'Plant and animal cells'],
    nucleus: ['Nucleus', 'Contains genetic information and controls the cell’s activities.', 'Plant and animal cells'],
    mitochondria: ['Mitochondria', 'Where aerobic respiration releases usable energy.', 'Plant and animal cells'],
    wall: ['Cell wall', 'Supports and strengthens the cell. It is outside the membrane.', 'Plant cells only'],
    vacuole: ['Large permanent vacuole', 'Holds cell sap and keeps the cell firm.', 'Plant cells only'],
    chloroplasts: ['Chloroplasts', 'Contain chlorophyll, which absorbs light for photosynthesis.', 'Some plant cells, not all'],
    projection: ['Root hair (projection)', 'A long, thin extension: a bigger surface area touching soil water, so more water is absorbed.', 'Root hair cells'],
    cilia: ['Cilia', 'Tiny hairs that beat together to sweep mucus along.', 'Ciliated cells in the airways'],
    mucus: ['Mucus', 'A sticky layer that traps dust and microbes.', 'Made in the airways'],
  };
  const CELLS = {
    animal: { title: 'Animal cell', parts: ['membrane', 'cytoplasm', 'nucleus', 'mitochondria'] },
    plant: { title: 'Plant cell from a leaf', parts: ['wall', 'membrane', 'cytoplasm', 'nucleus', 'vacuole', 'chloroplasts', 'mitochondria'] },
    storage: { title: 'Plant cell with no chloroplasts (root or onion)', parts: ['wall', 'membrane', 'cytoplasm', 'nucleus', 'vacuole', 'mitochondria'] },
    roothair: { title: 'Root hair cell', parts: ['projection', 'wall', 'membrane', 'cytoplasm', 'nucleus', 'vacuole', 'mitochondria'] },
    palisade: { title: 'Palisade cell', parts: ['chloroplasts', 'wall', 'membrane', 'cytoplasm', 'nucleus', 'vacuole', 'mitochondria'] },
    ciliated: { title: 'Ciliated cell', parts: ['cilia', 'mucus', 'membrane', 'cytoplasm', 'nucleus', 'mitochondria'] },
  };
  const SHORT = { animal: 'Animal', plant: 'Leaf cell', storage: 'Root cell', roothair: 'Root hair', palisade: 'Palisade', ciliated: 'Ciliated' };
  const COL = { wall: 0x8fae4f, membrane: 0xd2667c, cytoplasm: 0xf4e3d4, nucleus: 0x7d62ad, nucleolus: 0x4d3a78, mito: 0xe08a3c,
    vacuole: 0x8fbfe6, chloro: 0x3f8f3a, soil: 0xa0703f, water: 0x5aa0d8, cilia: 0xcf8a96, mucus: 0xc8cf72, speck: 0x3b3b3b, light: 0xe0b43a };
  const cellOf = s => (s && CELLS[s.cell] ? s.cell : 'animal');
  const hiOf = s => (s && s.highlight && INFO[s.highlight] && CELLS[cellOf(s)].parts.includes(s.highlight) ? s.highlight : 'none');
  const reduce = () => !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const btn = (label, value, pressed, cls = '') => `<button type="button"${cls ? ` class="${cls}"` : ''} data-action="model" data-value="${value}"${pressed === undefined ? '' : ` aria-pressed="${pressed}"`}>${label}</button>`;

  function readout(p, s) {
    const c = cellOf(s), h = hiOf(s);
    const title = (p && p.cellTitle) || CELLS[c].title;
    if (h === 'none') return `<p><span class="readout-key">${title}</span><span class="readout-value" style="font-size:.9em">Choose a structure to see its job.</span></p>`;
    const [name, job, where] = INFO[h];
    return `<p><span class="readout-key">${name} · ${where}</span><span class="readout-value" style="font-size:.95em">${job}</span></p>`;
  }
  function controls(p, s) {
    const c = cellOf(s), h = hiOf(s);
    const choice = (p && p.cellChoice) || [];
    const cells = choice.length > 1 ? `<div class="control-group" role="group" aria-label="Choose a cell">${choice.map(k => btn(SHORT[k], 'cell=' + k, c === k)).join('')}</div>` : '';
    const opt = (v, label) => `<option value="${v}"${h === v ? ' selected' : ''}>${label}</option>`;
    const parts = `<label class="control-label" for="cell-highlight">Highlight</label><select id="cell-highlight" class="cell-select" data-model-key="highlight">${opt('none', 'All structures')}${CELLS[c].parts.map(k => opt(k, INFO[k][0].replace(' (projection)', ''))).join('')}</select>`;
    const extra = `<div class="control-group" role="group" aria-label="View">${parts}${btn(s.labels === false ? 'Show labels' : 'Hide labels', 'labels=' + (s.labels === false), undefined, 'is-primary')}${c === 'ciliated' ? btn(s.beating === false ? 'Start cilia' : 'Stop cilia', 'beating=' + (s.beating === false)) : ''}</div>`;
    return cells + extra;
  }
  function onChange(k, s) { if (k === 'cell') s.highlight = 'none'; }

  /* ---------- deterministic randomness so every pupil sees the same cell ---------- */
  function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)); renderer.outputColorSpace = T.SRGBColorSpace; renderer.setClearColor(0x000000, 0);
    renderer.sortObjects = true;
    const canvas = renderer.domElement; canvas.tabIndex = 0; canvas.setAttribute('role', 'img');
    host.appendChild(canvas); host.classList.add('is-live');

    const scene = new T.Scene(), camera = new T.PerspectiveCamera(30, 2, 0.1, 200);
    const tanH = Math.tan(T.MathUtils.degToRad(camera.fov / 2));
    scene.add(new T.HemisphereLight(0xfffaf0, 0x8d8272, 1.6));
    const key = new T.DirectionalLight(0xfff3e2, 2.2); key.position.set(-4, 7, 11); scene.add(key);
    const fill = new T.DirectionalLight(0xe4ecff, 0.8); fill.position.set(7, -3, 6); scene.add(fill);
    const world = new T.Group(); scene.add(world);

    let built = null, W = 1, H = 1, disposed = false, raf = 0, visible = true, clock = 0, lastT = 0;
    const own = new Set(); const keep = x => { own.add(x); return x; };

    /* ---------- geometry helpers ---------- */
    function roundedBox(w, h, d, r, seg = 10) {
      const g = new T.BoxGeometry(w, h, d, seg, seg, seg), p = g.attributes.position, v = new T.Vector3(), inner = new T.Vector3();
      const hx = w / 2 - r, hy = h / 2 - r, hz = d / 2 - r;
      for (let i = 0; i < p.count; i++) {
        v.fromBufferAttribute(p, i);
        inner.set(Math.max(-hx, Math.min(hx, v.x)), Math.max(-hy, Math.min(hy, v.y)), Math.max(-hz, Math.min(hz, v.z)));
        v.sub(inner); if (v.lengthSq() > 0) v.normalize().multiplyScalar(r); v.add(inner); p.setXYZ(i, v.x, v.y, v.z);
      }
      g.computeVertexNormals(); return g;
    }
    function blob(r, seed) {
      const g = new T.SphereGeometry(r, 72, 54), p = g.attributes.position, v = new T.Vector3();
      for (let i = 0; i < p.count; i++) {
        v.fromBufferAttribute(p, i); const n = v.clone().normalize();
        const k = 1 + 0.07 * Math.sin(3 * n.x + seed) * Math.cos(2 * n.y) + 0.05 * Math.sin(4 * n.z + 2 * n.x + seed);
        v.multiplyScalar(k); p.setXYZ(i, v.x, v.y, v.z);
      }
      g.computeVertexNormals(); return g;
    }
    const mat = (color, o = {}) => new T.MeshStandardMaterial({ color, roughness: o.rough ?? 0.45, metalness: 0.02, transparent: true, opacity: o.opacity ?? 1,
      side: o.side ?? T.FrontSide, depthWrite: o.depthWrite ?? (o.opacity === undefined || o.opacity >= 0.99), emissive: new T.Color(color), emissiveIntensity: 0 });

    function addPart(B, part, mesh, base) {
      mesh.userData.part = part; mesh.userData.base = base ?? mesh.material.opacity; B.group.add(mesh);
      (B.parts[part] = B.parts[part] || []).push(mesh); return mesh;
    }
    function shell(B, part, geo, color, opacity, scale = [1, 1, 1], order = 0) {
      const back = new T.Mesh(geo, mat(color, { opacity: Math.min(1, opacity * 1.4), side: T.BackSide, depthWrite: false }));
      const front = new T.Mesh(geo, mat(color, { opacity, depthWrite: false }));
      [back, front].forEach((m, i) => { m.scale.set(...scale); m.renderOrder = order + i; addPart(B, part, m); });
      return front;
    }
    function mitochondrion(B, pos, rot, rnd, s = 1) {
      const m = new T.Mesh(B.geo.capsule, mat(COL.mito, { rough: 0.5 })); m.position.copy(pos); m.rotation.set(rot.x, rot.y, rot.z); m.scale.setScalar(s); m.renderOrder = 5;
      addPart(B, 'mitochondria', m);
      const ridge = new T.Mesh(B.geo.cristae, mat(0xb0631f, { rough: 0.6 })); ridge.position.copy(pos); ridge.rotation.set(rot.x, rot.y, rot.z); ridge.scale.setScalar(s); ridge.renderOrder = 6;
      addPart(B, 'mitochondria', ridge);
    }
    function chloroplast(B, pos, rnd, s = 1) {
      const c = new T.Mesh(B.geo.lens, mat(COL.chloro, { rough: 0.55 })); c.position.copy(pos);
      c.rotation.set(rnd() * Math.PI, rnd() * Math.PI, rnd() * Math.PI); c.scale.multiplyScalar(s); c.renderOrder = 5;
      addPart(B, 'chloroplasts', c);
    }
    function granules(B, count, inside, rnd) {
      const pts = []; let guard = 0;
      while (pts.length < count * 3 && guard++ < count * 40) { const v = new T.Vector3((rnd() - .5) * 4, (rnd() - .5) * 5, (rnd() - .5) * 3); if (inside(v)) pts.push(v.x, v.y, v.z); }
      const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(pts, 3));
      const m = new T.Points(g, new T.PointsMaterial({ color: 0xc9a68e, size: 0.035, transparent: true, opacity: 0.9, depthWrite: false }));
      m.renderOrder = 3; addPart(B, 'cytoplasm', m);
    }
    function nucleus(B, pos, r) {
      const n = new T.Mesh(B.geo.sphere, mat(COL.nucleus, { rough: 0.35 })); n.position.copy(pos); n.scale.setScalar(r); n.renderOrder = 5; addPart(B, 'nucleus', n);
      const nl = new T.Mesh(B.geo.sphere, mat(COL.nucleolus)); nl.position.copy(pos).add(new T.Vector3(r * 0.25, r * 0.15, r * 0.55)); nl.scale.setScalar(r * 0.35); nl.renderOrder = 6; addPart(B, 'nucleus', nl);
    }
    const inBox = (v, hx, hy, hz, cx = 0, cy = 0, cz = 0) => Math.abs(v.x - cx) < hx && Math.abs(v.y - cy) < hy && Math.abs(v.z - cz) < hz;

    /* ---------- one builder per cell type ---------- */
    function plantBody(B, rnd, o) {
      const { w, h, d, vac, vacOff, nuc, chloro, mitos } = o;
      shell(B, 'wall', keep(roundedBox(w, h, d, 0.22)), COL.wall, 0.22, [1, 1, 1], 1);
      shell(B, 'membrane', keep(roundedBox(w - 0.2, h - 0.2, d - 0.2, 0.16)), COL.membrane, 0.26, [1, 1, 1], 3);
      const cyto = new T.Mesh(keep(roundedBox(w - 0.22, h - 0.22, d - 0.22, 0.15)), mat(COL.cytoplasm, { opacity: 0.12, depthWrite: false })); cyto.renderOrder = 2; addPart(B, 'cytoplasm', cyto);
      const v = shell(B, 'vacuole', keep(roundedBox(vac[0], vac[1], vac[2], 0.3)), COL.vacuole, 0.32, [1, 1, 1], 4); B.parts.vacuole.forEach(m => m.position.set(...vacOff));
      const mx = (w - 0.2) / 2, my = (h - 0.2) / 2, mz = (d - 0.2) / 2;
      const inCyto = q => inBox(q, mx - 0.12, my - 0.12, mz - 0.12) && !inBox(q, vac[0] / 2 + 0.08, vac[1] / 2 + 0.08, vac[2] / 2 + 0.08, ...vacOff);
      granules(B, 220, inCyto, rnd);
      nucleus(B, new T.Vector3(...nuc), 0.28);
      const place = (n, fn, minGap) => { const got = []; let guard = 0; while (got.length < n && guard++ < 4000) { const q = new T.Vector3((rnd() - .5) * 2 * (mx - 0.14), (rnd() - .5) * 2 * (my - 0.14), (rnd() - .5) * 2 * (mz - 0.14)); if (!inCyto(q)) continue; if (q.distanceTo(new T.Vector3(...nuc)) < 0.42) continue; if (got.some(g => g.distanceTo(q) < minGap)) continue; got.push(q); fn(q); } };
      if (chloro) place(chloro, q => chloroplast(B, q, rnd, 1), 0.2);
      place(mitos, q => mitochondrion(B, q, new T.Euler(rnd() * 3, rnd() * 3, rnd() * 3), rnd, 0.9), 0.3);
      return { mx, my, mz };
    }
    function build(cell) {
      const B = { group: new T.Group(), parts: {}, anchors: {}, geo: {}, extras: {} };
      B.geo.sphere = keep(new T.SphereGeometry(1, 32, 24));
      B.geo.capsule = keep(new T.CapsuleGeometry(0.075, 0.2, 6, 14));
      B.geo.cristae = keep(new T.TorusGeometry(0.06, 0.012, 6, 18));
      B.geo.lens = keep(new T.SphereGeometry(1, 20, 14)); B.geo.lens.scale(0.13, 0.065, 0.1);
      const rnd = rng({ animal: 11, plant: 23, storage: 37, roothair: 41, palisade: 53, ciliated: 67 }[cell]);
      const A = (k, x, y, z) => { B.anchors[k] = new T.Vector3(x, y, z); };
      if (cell === 'animal') {
        shell(B, 'membrane', keep(blob(1.45, 0.7)), COL.membrane, 0.24, [1.25, 0.88, 1], 1);
        const cy = new T.Mesh(keep(blob(1.4, 0.7)), mat(COL.cytoplasm, { opacity: 0.16, depthWrite: false })); cy.scale.set(1.24, 0.86, 0.98); cy.renderOrder = 2; addPart(B, 'cytoplasm', cy);
        granules(B, 260, q => (q.x / 1.6) ** 2 + (q.y / 1.1) ** 2 + (q.z / 1.25) ** 2 < 1, rnd);
        nucleus(B, new T.Vector3(-0.25, 0.05, 0.1), 0.42);
        [[0.85, 0.42, 0.2], [0.95, -0.35, -0.2], [-1.05, -0.4, 0.15], [0.2, -0.65, 0.35], [0.45, 0.6, -0.4], [-0.9, 0.45, -0.3]].forEach(([x, y, z]) =>
          mitochondrion(B, new T.Vector3(x, y, z), new T.Euler(rnd() * 3, rnd() * 3, rnd() * 3), rnd, 1.25));
        A('membrane', 1.62, 0.55, 0.3); A('cytoplasm', 0.55, -0.15, 0.5); A('nucleus', -0.25, 0.4, 0.4); A('mitochondria', 0.85, 0.42, 0.2);
      } else if (cell === 'plant' || cell === 'storage') {
        const plant = cell === 'plant';
        plantBody(B, rnd, { w: 3.0, h: 2.0, d: 1.7, vac: plant ? [1.75, 1.05, 0.95] : [2.0, 1.25, 1.1], vacOff: [0.35, 0, 0], nuc: [-1.05, 0.35, 0.25], chloro: plant ? 26 : 0, mitos: plant ? 5 : 7 });
        A('wall', 1.5, 0.75, 0.3); A('membrane', 1.38, -0.55, 0.62); A('cytoplasm', -1.05, -0.55, 0.55); A('nucleus', -1.05, 0.62, 0.25); A('vacuole', 0.35, 0.1, 0.48);
        if (plant) { const c = B.parts.chloroplasts[0].position; A('chloroplasts', c.x, c.y, c.z); }
        const m = B.parts.mitochondria[0].position; A('mitochondria', m.x, m.y, m.z);
      } else if (cell === 'palisade') {
        plantBody(B, rnd, { w: 1.25, h: 3.0, d: 1.2, vac: [0.55, 2.1, 0.5], vacOff: [0.08, -0.05, 0], nuc: [-0.25, -1.05, 0.15], chloro: 48, mitos: 4 });
        const lightMat = mat(COL.light, { rough: 0.3 }); lightMat.emissiveIntensity = 0.5;
        [-0.4, 0, 0.4].forEach((x, i) => {
          const shaft = new T.Mesh(keep(new T.CylinderGeometry(0.03, 0.03, 0.8, 8)), lightMat); shaft.position.set(x, 2.2, 0.2 * (i - 1)); B.group.add(shaft);
          const head = new T.Mesh(keep(new T.ConeGeometry(0.09, 0.22, 14)), lightMat); head.position.set(x, 1.7, 0.2 * (i - 1)); head.rotation.z = Math.PI; B.group.add(head);
        });
        B.extras.light = new T.Vector3(0.4, 2.45, 0);
        const c = B.parts.chloroplasts.reduce((a, m) => (m.position.y > a.y ? m.position : a), new T.Vector3(0, -9, 0));
        A('chloroplasts', c.x, c.y, c.z); A('wall', 0.62, 0.9, 0.3); A('membrane', 0.52, -0.6, 0.55); A('vacuole', 0.08, 0.4, 0.25); A('nucleus', -0.25, -0.85, 0.3);
        A('cytoplasm', -0.4, -1.3, 0.45); const m = B.parts.mitochondria[0].position; A('mitochondria', m.x, m.y, m.z);
      } else if (cell === 'roothair') {
        const body = plantBody(B, rnd, { w: 1.7, h: 1.6, d: 1.4, vac: [0.9, 0.8, 0.7], vacOff: [0.1, 0.05, 0], nuc: [-0.45, 0.35, 0.2], chloro: 0, mitos: 4 });
        const len = 3.2, x0 = 0.85 + len / 2 - 0.1;
        const tube = (r, color, opacity, part, order) => {
          const g = keep(new T.CapsuleGeometry(r, len, 8, 28)); g.rotateZ(Math.PI / 2);
          const back = new T.Mesh(g, mat(color, { opacity: opacity * 1.4, side: T.BackSide, depthWrite: false })), front = new T.Mesh(g, mat(color, { opacity, depthWrite: false }));
          [back, front].forEach((m, i) => { m.position.set(x0, -0.45, 0); m.renderOrder = order + i; addPart(B, part, m); });
        };
        tube(0.24, COL.wall, 0.2, 'projection', 1); tube(0.18, COL.membrane, 0.24, 'projection', 3);
        // soil particles with a film of water around them, touching the projection
        const soilGeo = keep(new T.DodecahedronGeometry(1, 0)), soilMat = mat(COL.soil, { rough: 0.95 }), waterMat = mat(COL.water, { opacity: 0.28, depthWrite: false });
        [[1.6, 0.2, 0.2, 0.32], [2.5, -1.1, -0.1, 0.36], [3.4, 0.15, -0.25, 0.3], [4.1, -1.05, 0.25, 0.28], [1.4, -1.2, 0.45, 0.24], [3.0, -0.45, 0.75, 0.26]].forEach(([x, y, z, r]) => {
          const s = new T.Mesh(soilGeo, soilMat); s.position.set(x, y, z); s.scale.setScalar(r); s.rotation.set(x, y, z); B.group.add(s);
          const w = new T.Mesh(B.geo.sphere, waterMat); w.position.set(x, y, z); w.scale.setScalar(r * 1.35); w.renderOrder = 8; B.group.add(w);
        });
        B.extras.soil = new T.Vector3(2.5, -1.1, -0.1); B.extras.water = new T.Vector3(3.4, 0.5, -0.25);
        A('projection', 2.6, -0.45, 0.2); A('wall', -0.85, 0.6, 0.35); A('membrane', -0.75, -0.62, 0.55); A('vacuole', 0.1, 0.1, 0.36);
        A('nucleus', -0.45, 0.55, 0.25); A('cytoplasm', -0.55, -0.35, 0.5); const m = B.parts.mitochondria[0].position; A('mitochondria', m.x, m.y, m.z);
      } else if (cell === 'ciliated') {
        const w = 2.2, h = 2.4, d = 1.5;
        shell(B, 'membrane', keep(roundedBox(w, h, d, 0.3)), COL.membrane, 0.24, [1, 1, 1], 1);
        const cy = new T.Mesh(keep(roundedBox(w - 0.04, h - 0.04, d - 0.04, 0.28)), mat(COL.cytoplasm, { opacity: 0.14, depthWrite: false })); cy.renderOrder = 2; addPart(B, 'cytoplasm', cy);
        granules(B, 200, q => inBox(q, w / 2 - 0.1, h / 2 - 0.1, d / 2 - 0.1), rnd);
        nucleus(B, new T.Vector3(0, -0.55, 0.1), 0.42);
        for (let i = 0; i < 9; i++) mitochondrion(B, new T.Vector3((i % 3 - 1) * 0.6 + (rnd() - .5) * 0.15, 0.55 + Math.floor(i / 3) * 0.18, ((i % 3) - 1) * 0.3), new T.Euler(0, rnd() * 3, Math.PI / 2), rnd, 1);
        // cilia: hinged at the top surface, so a rotation sweeps them like oars
        const ciliaGeo = keep(new T.CylinderGeometry(0.016, 0.022, 0.55, 6)); ciliaGeo.translate(0, 0.275, 0);
        const ciliaMat = mat(COL.cilia, { rough: 0.5 }); B.cilia = [];
        for (let i = 0; i < 11; i++) for (let j = 0; j < 6; j++) {
          const c = new T.Mesh(ciliaGeo, ciliaMat); c.position.set(-w / 2 + 0.2 + i * (w - 0.4) / 10, h / 2 - 0.02, -d / 2 + 0.2 + j * (d - 0.4) / 5); c.renderOrder = 6;
          addPart(B, 'cilia', c); B.cilia.push(c);
        }
        const mucus = new T.Mesh(keep(roundedBox(w + 1.6, 0.22, d + 0.2, 0.1)), mat(COL.mucus, { opacity: 0.45, depthWrite: false })); mucus.position.set(0, h / 2 + 0.68, 0); mucus.renderOrder = 9; addPart(B, 'mucus', mucus);
        B.specks = Array.from({ length: 10 }, (_, k) => { const s = new T.Mesh(B.geo.sphere, mat(COL.speck)); s.scale.setScalar(0.05 + rnd() * 0.04); s.position.set(-(w + 1.6) / 2 + k * (w + 1.6) / 10, h / 2 + 0.68 + (rnd() - .5) * 0.1, (rnd() - .5) * (d - 0.2)); s.renderOrder = 10; addPart(B, 'mucus', s); return s; });
        B.mucusSpan = (w + 1.6) / 2;
        B.extras.away = new T.Vector3(1.9, h / 2 + 1.25, 0);
        A('cilia', 0.75, h / 2 + 0.3, 0.6); A('mucus', -1.3, h / 2 + 0.75, 0.6); A('membrane', 1.12, -0.6, 0.5); A('nucleus', 0, -0.4, 0.45); A('cytoplasm', -0.7, -0.9, 0.55);
        const m = B.parts.mitochondria[2].position; A('mitochondria', m.x, m.y, m.z);
      }
      // labels
      B.labels = {};
      const only = phase && phase.labelParts; // a screen may label only the structures it is teaching
      CELLS[cell].parts.forEach(k => { if (B.anchors[k] && (!only || only.includes(k))) B.labels[k] = makeLabel(B, INFO[k][0].replace(' (projection)', ''), B.anchors[k]); });
      if (B.extras.light) B.labels.light = makeLabel(B, 'light', B.extras.light, { box: false, ink: '#7d5210', noLine: true });
      if (B.extras.soil) B.labels.soil = makeLabel(B, 'soil particle', B.extras.soil, { box: false, ink: '#5b4128' });
      if (B.extras.water) B.labels.water = makeLabel(B, 'soil water', B.extras.water, { box: false, ink: '#1f5e93', noLine: true });
      if (B.extras.away) B.labels.away = makeLabel(B, 'mucus moves this way →', B.extras.away, { box: false, ink: '#4f5317', noLine: true });
      return B;
    }

    /* ---------- labels: canvas sprites at constant on-screen size, with a leader line ---------- */
    function makeLabel(B, text, anchor, o = {}) {
      const c = document.createElement('canvas'), g = c.getContext('2d'), fs = 44, pad = 20;
      const font = `700 ${fs}px Montserrat, "Segoe UI", system-ui, sans-serif`;
      g.font = font; const w = Math.ceil(g.measureText(text).width) + pad * 2, h = Math.round(fs * 1.55);
      c.width = w; c.height = h; g.font = font;
      if (o.box !== false) { g.beginPath(); if (g.roundRect) g.roundRect(2, 2, w - 4, h - 4, 16); else g.rect(2, 2, w - 4, h - 4); g.fillStyle = 'rgba(252,250,244,0.95)'; g.fill(); g.lineWidth = 3; g.strokeStyle = '#182944'; g.stroke(); }
      g.fillStyle = o.ink || '#182944'; g.textBaseline = 'middle'; g.fillText(text, pad, h / 2 + 2);
      const tex = keep(new T.CanvasTexture(c)); tex.colorSpace = T.SRGBColorSpace; tex.minFilter = T.LinearFilter; tex.generateMipmaps = false;
      const sm = keep(new T.SpriteMaterial({ map: tex, depthTest: false, depthWrite: false, transparent: true }));
      const sp = new T.Sprite(sm); sp.renderOrder = 30; scene.add(sp);
      let line = null;
      if (!o.noLine) {
        const lg = keep(new T.BufferGeometry().setFromPoints([new T.Vector3(), new T.Vector3()]));
        line = new T.Line(lg, keep(new T.LineBasicMaterial({ color: 0x182944, depthTest: false, transparent: true })));
        line.renderOrder = 29; scene.add(line);
      }
      const dot = o.noLine ? null : new T.Mesh(B.geo.sphere, keep(new T.MeshBasicMaterial({ color: 0x182944, depthTest: false })));
      if (dot) { dot.renderOrder = 29; scene.add(dot); }
      return { sp, line, dot, anchor, aspect: w / h, noLine: !!o.noLine };
    }
    function placeLabels() {
      if (!built) return;
      const dist = camera.position.length(), unit = (2 * dist * tanH) / H; // world units per pixel at the origin
      const zOrigin = new T.Vector3(0, 0, 0).project(camera).z; // labels sit at the cell's depth, so their size is predictable
      const center = built.center, ex = built.radius;
      const names = Object.keys(built.labels);
      // anchors in world space; labels pushed outwards on screen, left or right of the cell
      built.group.updateMatrixWorld(true);
      const proj = names.map(k => { const a = built.labels[k].anchor.clone(); built.group.localToWorld(a); return { k, a, s: a.clone().project(camera) }; });
      const right = proj.filter(p => p.s.x >= 0).sort((a, b) => b.s.y - a.s.y), left = proj.filter(p => p.s.x < 0).sort((a, b) => b.s.y - a.s.y);
      const lay = (list, side) => {
        const n = list.length; if (!n) return;
        // two or fewer labels sit level with their anchors; more are spread over the full height so they never overlap
        const spread = n >= 3, gap = (vertical ? 15 : 19) * 1.55 * 1.25 * 2 / H; // minimum label spacing in NDC
        let top = Math.min(0.8, Math.max(...list.map(p => p.s.y)) + 0.1), bottom = Math.max(-0.85, Math.min(...list.map(p => p.s.y)) - 0.1);
        if (spread && (top - bottom) / (n - 1) < gap) { const mid = (top + bottom) / 2, half = Math.min(0.84, gap * (n - 1) / 2); top = Math.min(0.84, mid + half); bottom = Math.max(-0.84, top - 2 * half); }
        list.forEach((p, i) => {
          const L = built.labels[p.k];
          const ys = n === 1 ? p.s.y : top - (top - bottom) * (i / (n - 1));
          const pxW = (L.px || (vertical ? 15 : 19)) * 1.55 * L.aspect; // label width in pixels
          const xs = L.noLine ? Math.max(-0.97 + pxW / W, Math.min(0.97 - pxW / W, p.s.x)) : side * (0.97 - pxW / W); // keep the whole label inside the view
          const pos = new T.Vector3(xs, Math.max(-0.88, Math.min(0.88, ys)), zOrigin).unproject(camera);
          const px = L.px || (vertical ? 15 : 19); const hgt = px * 1.55 * unit, wid = hgt * L.aspect;
          // keep the label box inside the frame on its side
          const sx = new T.Vector3(); sx.copy(pos);
          L.sp.scale.set(wid, hgt, 1);
          const shift = side * wid / 2 * (L.noLine ? 0 : 1);
          L.sp.position.copy(pos).add(new T.Vector3(shift * 0.0, 0, 0));
          if (![pos.x, pos.y, pos.z, wid, hgt, p.a.x, p.a.y, p.a.z].every(Number.isFinite)) return;
          if (!L.noLine) {
            const edge = pos.clone().add(new T.Vector3(-side * wid / 2, 0, 0));
            L.sp.position.copy(pos);
            L.line.geometry.setFromPoints([p.a, edge]); L.line.geometry.computeBoundingSphere();
            L.dot.position.copy(p.a); L.dot.scale.setScalar(3.2 * unit);
          }
        });
      };
      lay(right, 1); lay(left, -1);
    }
    let vertical = false;
    function fit() {
      if (!built) return;
      // measure the cell in its own frame (no world rotation), then size it for any turn about the vertical axis
      const rot = world.rotation.clone(); world.rotation.set(0, 0, 0); world.updateMatrixWorld(true);
      built.group.position.set(0, 0, 0); built.group.updateMatrixWorld(true);
      const box = new T.Box3().setFromObject(built.group), c = box.getCenter(new T.Vector3()), half = box.getSize(new T.Vector3()).multiplyScalar(0.5);
      built.group.position.sub(c); world.rotation.copy(rot); world.updateMatrixWorld(true);
      built.center = new T.Vector3(); built.radius = half.length();
      if (W < 2 || H < 2) return;
      const aspect = W / H, rH = Math.hypot(half.x, half.z), rV = half.y + 0.3 * half.z;
      const share = vertical ? 0.62 : 0.5; // share of the half-width the cell may use; labels take the rest
      const dist = Math.max(rV / (0.88 * tanH), rH / (share * tanH * aspect));
      camera.position.set(0, 0, dist); camera.near = dist / 20; camera.far = dist * 6; camera.updateProjectionMatrix();
    }
    function applyLook(s) {
      if (!built) return;
      const h = hiOf(s), showLabels = s.labels !== false;
      Object.entries(built.parts).forEach(([part, meshes]) => meshes.forEach(m => {
        const on = h === 'none' || h === part;
        const mtl = m.material; if (!mtl) return;
        if (mtl.opacity !== undefined) mtl.opacity = on ? m.userData.base : Math.min(m.userData.base, 0.08);
        if (mtl.emissiveIntensity !== undefined) mtl.emissiveIntensity = h === part ? 0.35 : 0;
      }));
      Object.entries(built.labels).forEach(([k, L]) => {
        const isPart = !!INFO[k];
        const vis = isPart ? (showLabels ? (h === 'none' || h === k) : h === k) : showLabels;
        L.sp.visible = vis; if (L.line) L.line.visible = vis; if (L.dot) L.dot.visible = vis;
      });
    }
    function describe(s) {
      const c = cellOf(s), h = hiOf(s);
      canvas.setAttribute('aria-label', `${(phase && phase.cellTitle) || CELLS[c].title}, schematic 3D model with ${CELLS[c].parts.map(k => INFO[k][0]).join(', ')}.${h !== 'none' ? ' Highlighted: ' + INFO[h][0] + '. ' + INFO[h][1] : ''} Drag or use arrow keys to rotate.`);
    }
    function clearBuilt() {
      if (!built) return;
      Object.values(built.labels).forEach(L => { scene.remove(L.sp); if (L.line) scene.remove(L.line); if (L.dot) scene.remove(L.dot); });
      world.remove(built.group);
      built.group.traverse(o => { if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => own.add(m)); if (o.geometry) own.add(o.geometry); });
      built = null;
    }
    let currentCell = null;
    function ensure(s) {
      const c = cellOf(s); if (c === currentCell && built) return;
      clearBuilt(); currentCell = c; built = build(c); world.add(built.group); fit();
    }
    function draw() { if (disposed || !built || W < 2 || H < 2 || !isFinite(camera.position.z)) return; placeLabels(); renderer.render(scene, camera); }
    function animating() { return currentCell === 'ciliated' && state.beating !== false && !reduce() && visible; }
    function frame(now) {
      raf = 0; if (disposed) return;
      const dt = lastT ? Math.min(0.05, (now - lastT) / 1000) : 0; lastT = now; clock += dt;
      if (built && built.cilia) {
        built.cilia.forEach(c => { c.rotation.z = -0.55 * Math.sin(clock * 6 - c.position.x * 2.6); });
        built.specks.forEach(s => { s.position.x += dt * 0.45; if (s.position.x > built.mucusSpan) s.position.x -= 2 * built.mucusSpan; });
      }
      draw();
      if (animating()) raf = requestAnimationFrame(frame); else lastT = 0;
    }
    const kick = () => { if (!raf && animating()) { lastT = 0; raf = requestAnimationFrame(frame); } };
    function stillCilia() { if (built && built.cilia) built.cilia.forEach(c => { c.rotation.z = currentCell === 'ciliated' && state.beating === false ? 0.0 : -0.35; }); }

    function resize() {
      const r = host.getBoundingClientRect(); if (r.width < 2 || r.height < 2) return;
      W = r.width; H = r.height; renderer.setSize(W, H, false); camera.aspect = W / H;
      vertical = W / H < 1.2; if (built) fit();
      camera.updateProjectionMatrix(); draw();
    }

    /* ---------- pointer and keyboard rotation ---------- */
    let last = null;
    const clampX = x => Math.max(-0.9, Math.min(0.9, x));
    const rotated = () => { state.rx = world.rotation.x; state.ry = world.rotation.y; draw(); };
    const onDown = e => { if (e.button !== undefined && e.button !== 0) return; last = [e.clientX, e.clientY]; try { canvas.setPointerCapture(e.pointerId); } catch (_) { /* ignore */ } };
    const onMove = e => { if (!last) return; world.rotation.y += (e.clientX - last[0]) * 0.008; world.rotation.x = clampX(world.rotation.x + (e.clientY - last[1]) * 0.008); last = [e.clientX, e.clientY]; rotated(); };
    const onUp = () => { last = null; };
    const onKey = e => {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) return;
      e.preventDefault(); e.stopPropagation();
      world.rotation.y += e.key === 'ArrowLeft' ? -0.15 : e.key === 'ArrowRight' ? 0.15 : 0;
      world.rotation.x = clampX(world.rotation.x + (e.key === 'ArrowUp' ? -0.12 : e.key === 'ArrowDown' ? 0.12 : 0));
      rotated();
    };
    canvas.addEventListener('pointerdown', onDown); canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp); canvas.addEventListener('pointercancel', onUp); canvas.addEventListener('keydown', onKey);

    world.rotation.set(typeof state.rx === 'number' ? state.rx : 0.32, typeof state.ry === 'number' ? state.ry : -0.42, 0);
    const observer = new ResizeObserver(resize); observer.observe(host);
    { const r = host.getBoundingClientRect(); W = r.width || 560; H = r.height || 320; vertical = W / H < 1.2; renderer.setSize(W, H, false); camera.aspect = W / H; camera.updateProjectionMatrix(); }
    host.__cellDebug = { camera, world, get built() { return built; }, size: () => [W, H], snap: () => { draw(); return canvas.toDataURL('image/png'); } };
    ensure(state); applyLook(state); describe(state); stillCilia(); draw(); kick();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (!disposed) draw(); }).catch(() => {});

    return {
      update(s) { if (disposed) return; ensure(s); applyLook(s); describe(s); stillCilia(); draw(); kick(); },
      command() {},
      visibility(v) { visible = !!v; if (!visible) { cancelAnimationFrame(raf); raf = 0; } else { draw(); kick(); } },
      dispose() {
        disposed = true; cancelAnimationFrame(raf); raf = 0; observer.disconnect();
        canvas.removeEventListener('pointerdown', onDown); canvas.removeEventListener('pointermove', onMove);
        canvas.removeEventListener('pointerup', onUp); canvas.removeEventListener('pointercancel', onUp); canvas.removeEventListener('keydown', onKey);
        clearBuilt();
        scene.traverse(o => { if (o.geometry) own.add(o.geometry); if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => { own.add(m); if (m.map) own.add(m.map); }); });
        own.forEach(x => { try { x.dispose(); } catch (_) { /* ignore */ } }); own.clear();
        try { renderer.dispose(); renderer.forceContextLoss(); } catch (_) { /* ignore */ }
        canvas.remove(); host.classList.remove('is-live');
      }
    };
  }

  function audit() { return { cells: Object.keys(CELLS), info: INFO }; }
  return {
    caption: 'Schematic 3D model, not to scale. Drag or use arrow keys to rotate.',
    defaults: { cell: 'animal', highlight: 'none', labels: true, beating: true },
    controls, readout, onChange, mount, audit, INFO, CELLS
  };
})();
