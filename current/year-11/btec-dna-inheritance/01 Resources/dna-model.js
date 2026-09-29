/* Lesson 01 · "dna" — local Three.js (r160, global THREE) model for "DNA, genes and chromosomes" (BTEC Unit 1 A2).
   Original geometry, not to scale. No autoplay, no network calls, no storage of pupil data.
   Renders on demand; requestAnimationFrame runs only for tweens and the gentle mutation pulse.
   State: {view:'zoom'|'helix', level:0-3, partners, gene, mutated} (+ rx/ry rotation memory).
   Zoom view: buttons set level (0 cell, 1 nucleus, 2 chromosome, 3 DNA).
   Helix view commands: 'partners' (show/hide strand 2), 'gene' (show/hide the gene band), 'mutate' (change pair 4 G–C → A–T). */
window.LessonModels = window.LessonModels || {};
window.LessonModels.dna = (() => {
  const reduce = () => !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const btn = (label, value, pressed, cmd = false, cls = '') => `<button type="button"${cls ? ` class="${cls}"` : ''} data-action="${cmd ? 'model-cmd' : 'model'}" data-value="${value}"${pressed === undefined ? '' : ` aria-pressed="${pressed}"`}>${label}</button>`;
  const row = (k, v) => `<p><span class="readout-key">${k}</span><span class="readout-value">${v}</span></p>`;
  const S1 = ['A', 'T', 'T', 'G', 'C', 'A', 'G', 'C', 'T', 'A'];
  const PAIR = { A: 'T', T: 'A', C: 'G', G: 'C' };
  const HEX = { A: 0xbd8126, T: 0xad5c63, C: 0x24748d, G: 0x56834b };
  const RING = { A: '#bd8126', T: '#ad5c63', C: '#24748d', G: '#56834b', '?': '#a39e90' };
  const MUT = 3; // base pair 4
  const LEVELS = ['Cell', 'Nucleus', 'Chromosome', 'DNA'];
  const ZOOM = [
    'DNA is inside the nucleus.',
    'A human body cell has 46 chromosomes in 23 pairs (7 shown).',
    'One long DNA molecule, tightly coiled.',
    'Two strands twisted into a double helix, joined by base pairs.'
  ];
  const ZOOM_DESC = [
    'an animal cell: a pale, see-through cell with a dark blue nucleus inside, labelled cell and nucleus',
    'the inside of the nucleus: a see-through nucleus holding seven X-shaped chromosomes in different colours, labelled chromosomes',
    'one large X-shaped chromosome, two sister chromatids joined at the centromere, with a thin coiled DNA thread unwinding from the tip of one arm, labelled chromosome and DNA coiled up',
    'a short section of DNA: two strands twisted into a double helix, joined by 12 coloured base pairs, labelled double helix and base pair'
  ];
  const view = s => (s && s.view === 'helix' ? 'helix' : 'zoom');
  const lvl = s => Math.max(0, Math.min(3, Math.round(Number(s && s.level) || 0)));
  const flags = s => ({ partners: !!(s.partners || s.mutated), gene: !!s.gene, mutated: !!s.mutated });
  const strand1 = m => S1.map((b, i) => (m && i === MUT ? 'A' : b));
  const strand2 = m => strand1(m).map(b => PAIR[b]);

  function readout(p, s) {
    if (view(s) === 'zoom') { const L = lvl(s); return row(LEVELS[L], ZOOM[L]); }
    const f = flags(s), seq = arr => arr.map((x, i) => (f.mutated && i === MUT ? `<strong>${x}</strong>` : x)).join(' ');
    return row('Strand 1', seq(strand1(f.mutated))) +
      row('Strand 2', f.partners ? seq(strand2(f.mutated)) : '? ? ? ? ? ? ? ? ? ?') +
      (f.gene || f.mutated ? '' : row('Rule', 'A pairs with T; C pairs with G')) +
      (f.gene ? row('Gene', 'a section of DNA: instructions for one characteristic') : '') +
      (f.mutated ? row('Mutation', 'pair 4 changed from G–C to A–T') + row('Real examples', 'harmful: cystic fibrosis · beneficial: digesting milk as an adult') : '');
  }
  function controls(p, s) {
    if (view(s) === 'zoom') {
      const L = lvl(s);
      return `<div class="control-group"><span class="control-label">Zoom</span>${LEVELS.map((n, i) => btn(n, 'level=' + i, L === i)).join('')}</div>`;
    }
    const f = flags(s), tools = s.tools || 'all', show = t => tools === 'all' || tools === t;
    return `<div class="control-group"><span class="control-label">Explore</span>` +
      (show('partners') ? btn(f.partners ? 'Hide partner bases' : 'Show partner bases', 'partners', undefined, true, f.partners ? '' : 'is-primary') : '') +
      (show('gene') ? btn(f.gene ? 'Hide the gene' : 'Show the gene', 'gene', undefined, true, f.gene ? '' : 'is-primary') : '') +
      (show('mutate') ? btn(f.mutated ? 'Undo the change' : 'Change one base', 'mutate', undefined, true, f.mutated ? '' : 'is-primary') : '') + '</div>';
  }
  function command(cmd, s) {
    const f = flags(s);
    if (cmd === 'partners') { s.partners = !f.partners; if (!s.partners) s.mutated = false; }
    if (cmd === 'gene') s.gene = !s.gene;
    if (cmd === 'mutate') { s.mutated = !s.mutated; if (s.mutated) s.partners = true; }
  }

  function mount(host, state, phase, ctx) {
    const T = window.THREE; if (!T || !host) return null;
    // Probe first so a machine without WebGL keeps the fallback quietly (no renderer error in the console).
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

    const bin = new Set(), keep = x => { bin.add(x); return x; };
    const V = (x, y, z) => new T.Vector3(x, y, z);
    const scene = new T.Scene(), camera = new T.PerspectiveCamera(30, 2, 0.1, 200);
    const tanH = Math.tan(T.MathUtils.degToRad(camera.fov / 2));
    scene.add(new T.HemisphereLight(0xfffaf0, 0x8d8272, 1.6));
    const key = new T.DirectionalLight(0xfff3e2, 2.4); key.position.set(-4, 6, 10); scene.add(key);
    const fill = new T.DirectionalLight(0xe4ecff, 0.8); fill.position.set(6, -3, 6); scene.add(fill);
    const world = new T.Group(), overlay = new T.Group(); scene.add(world, overlay); // world rotates; overlay (labels) faces the camera
    const std = (color, extra = {}) => keep(new T.MeshStandardMaterial({ color, roughness: 0.45, metalness: 0.03, transparent: true, ...extra }));
    const sphereGeo = keep(new T.SphereGeometry(1, 44, 30)), capGeo = keep(new T.SphereGeometry(1, 18, 12));
    const nodeGeo = keep(new T.SphereGeometry(0.12, 18, 12)), rungGeo = keep(new T.BoxGeometry(1, 0.22, 0.1));
    const tA = V(0, 0, 0), tB = V(0, 0, 0), tC = V(0, 0, 0);
    const DIRS = [];
    for (let x = -1; x <= 1; x++) for (let y = -1; y <= 1; y++) for (let z = -1; z <= 1; z++) if (x || y || z) DIRS.push(V(x, y, z).normalize());
    const TW = Math.PI * 2 / 10; // 10 base pairs per turn

    /* ---------- labels: canvas-texture sprites redrawn at their on-screen pixel size ---------- */
    const labels = [];
    function makeLabel(kind, text, colour) {
      const c = document.createElement('canvas');
      const tex = keep(new T.CanvasTexture(c)); tex.colorSpace = T.SRGBColorSpace; tex.minFilter = T.LinearFilter; tex.generateMipmaps = false;
      const sprite = new T.Sprite(keep(new T.SpriteMaterial({ map: tex, depthTest: false, depthWrite: false, transparent: true })));
      sprite.renderOrder = kind === 'tag' ? 30 : 25; sprite.visible = false;
      const lab = { kind, text, colour, sprite, tex, canvas: c, w: 1, h: 1, px: 0 };
      labels.push(lab); return lab;
    }
    function drawLabel(lab, px) {
      const g = lab.canvas.getContext('2d');
      if (lab.kind === 'tag') {
        const lines = lab.text.split('\n'), lh = Math.round(px * dpr), fs = Math.round(lh * 0.6), pad = Math.round(fs * 0.62), gap = Math.round(fs * 1.18);
        const font = `650 ${fs}px Montserrat, "Segoe UI", system-ui, sans-serif`;
        g.font = font;
        const w = Math.ceil(Math.max(...lines.map(t => g.measureText(t).width))) + pad * 2, h = lh + (lines.length - 1) * gap;
        lab.canvas.width = w; lab.canvas.height = h; g.clearRect(0, 0, w, h);
        const lw = 1.5 * dpr; g.beginPath();
        if (g.roundRect) g.roundRect(lw / 2, lw / 2, w - lw, h - lw, lh * 0.3); else g.rect(lw / 2, lw / 2, w - lw, h - lw);
        g.fillStyle = 'rgba(250,247,238,0.95)'; g.fill(); g.lineWidth = lw; g.strokeStyle = '#182944'; g.stroke();
        g.font = font; g.fillStyle = '#182944'; g.textBaseline = 'middle';
        lines.forEach((t, i) => g.fillText(t, pad, lh / 2 + i * gap + dpr));
        lab.w = w / dpr; lab.h = h / dpr;
      } else {
        const d = Math.round(px * dpr), lw = Math.max(2, Math.round(d * 0.13));
        lab.canvas.width = d; lab.canvas.height = d; g.clearRect(0, 0, d, d);
        g.beginPath(); g.arc(d / 2, d / 2, d / 2 - lw / 2 - 0.5, 0, Math.PI * 2);
        g.fillStyle = '#fbf8f0'; g.fill(); g.lineWidth = lw; g.strokeStyle = lab.colour; g.stroke();
        g.fillStyle = lab.text === '?' ? '#6b665a' : '#182944'; g.font = `800 ${Math.round(d * 0.56)}px Montserrat, "Segoe UI", system-ui, sans-serif`;
        g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(lab.text, d / 2, d / 2 + d * 0.035);
        lab.w = lab.h = d / dpr;
      }
      lab.px = px; lab.tex.dispose(); lab.tex.needsUpdate = true;
    }

    /* ---------- layers (one per zoom level, one for the helix view) ---------- */
    const layers = {}, tags = [];
    const newLayer = name => { const L = { name, root: new T.Group(), mats: [], tags: [], hull: [], f: 1, tf: 1, extra: null }; L.root.visible = false; world.add(L.root); layers[name] = L; return L; };
    const collect = L => { const seen = new Set(); L.root.traverse(o => { if (o.material && !o.userData.own && !seen.has(o.material)) { seen.add(o.material); L.mats.push([o.material, o.material.opacity]); } }); };
    function setFade(L, f, sc, tf) { L.f = f; L.tf = tf; L.root.visible = f > 0.01; L.root.scale.setScalar(sc); L.mats.forEach(([m, b]) => { m.opacity = b * f; }); }
    // Pointer labels: anchor is in layer coordinates; ox/oy are screen-aligned gaps to the label's near edge.
    function addTag(L, text, anchor, ox, oy, lx = 0, ly = 0) {
      const lab = makeLabel('tag', text); overlay.add(lab.sprite);
      const geo = keep(new T.BufferGeometry()); geo.setAttribute('position', new T.BufferAttribute(new Float32Array(6), 3));
      const line = new T.Line(geo, keep(new T.LineBasicMaterial({ color: 0x182944, transparent: true, opacity: 0.85, depthTest: false })));
      line.renderOrder = 29; line.visible = false; overlay.add(line);
      const tg = { L, lab, anchor, ox, oy, lx, ly, line, alpha: 1 }; L.tags.push(tg); tags.push(tg); return tg;
    }
    const tagCentre = (tg, base, u, out) => {
      out.copy(base); out.x += tg.ox; out.y += tg.oy;
      if (tg.ox) out.x += Math.sign(tg.ox) * tg.lab.w * u / 2; else out.y += Math.sign(tg.oy) * tg.lab.h * u / 2;
      return out;
    };

    function chromosome(color, lens = [0.72, 1.05]) {
      const g = new T.Group(), mat = std(color, { roughness: 0.55 }), dark = std(0x182944, { roughness: 0.6 }), pts = [];
      [-1, 1].forEach(sd => { // two sister chromatids, bowed together at the centromere: )(
        const c = [V(sd * 0.42, lens[0], 0), V(sd * 0.15, 0.2, 0), V(sd * 0.1, 0, 0), V(sd * 0.15, -0.2, 0), V(sd * 0.46, -lens[1], 0)];
        const curve = new T.CatmullRomCurve3(c);
        g.add(new T.Mesh(keep(new T.TubeGeometry(curve, 48, 0.17, 14, false)), mat));
        [c[0], c[4]].forEach(p => { const cap = new T.Mesh(capGeo, mat); cap.position.copy(p); cap.scale.setScalar(0.17); g.add(cap); });
        pts.push(...curve.getPoints(10));
      });
      const cen = new T.Mesh(capGeo, dark); cen.scale.set(0.27, 0.11, 0.2); g.add(cen);
      return { g, pts };
    }

    // Right-handed double helix. axis 'y': vertical, pair 0 at the top; axis 'x': horizontal.
    function buildHelix(L, n, R, rise, theta0, axis, seq, backCols, tw = TW) {
      const P = (i, s, r = R) => {
        const a = (i - (n - 1) / 2) * rise, t = theta0 + i * tw + (s ? Math.PI : 0);
        return axis === 'y' ? V(r * Math.cos(t), -a, r * Math.sin(t)) : V(a, r * Math.cos(t), r * Math.sin(t));
      };
      const AX = axis === 'y' ? V(0, 1, 0) : V(1, 0, 0), rungs = [[], []];
      [0, 1].forEach(s => {
        const pts = []; for (let f = -0.45; f <= n - 0.55 + 1e-6; f += 0.05) pts.push(P(f, s));
        const mat = std(backCols[s], { roughness: 0.4 });
        L.root.add(new T.Mesh(keep(new T.TubeGeometry(new T.CatmullRomCurve3(pts), pts.length * 2, 0.075, 10, false)), mat));
        pts.forEach((p, j) => { if (j % 4 === 0) L.hull.push([p, 0.14]); });
        for (let i = 0; i < n; i++) {
          const node = new T.Mesh(nodeGeo, mat); node.position.copy(P(i, s)); L.root.add(node);
          const base = s ? PAIR[seq[i]] : seq[i], rm = std(HEX[base], { roughness: 0.5 });
          const outer = P(i, s, R - 0.02), inner = P(i, s, 0.035), m = new T.Mesh(rungGeo, rm);
          const x = tC.copy(inner).sub(outer), len = x.length(); x.normalize();
          const z = V(0, 0, 0).crossVectors(x, AX).normalize(), y = V(0, 0, 0).crossVectors(z, x);
          m.quaternion.setFromRotationMatrix(new T.Matrix4().makeBasis(x, y, z));
          m.position.copy(outer).add(inner).multiplyScalar(0.5); m.scale.set(len, 1, 1); L.root.add(m);
          rungs[s].push(rm);
        }
      });
      return { P, rungs };
    }

    const ROT = [[0.12, -0.25], [0.1, 0.3], [0.06, -0.3], [0.1, -0.42]], HROT = [0.12, -0.35];
    function buildZoom() {
      if (layers.z0) return;
      // Level 0 · animal cell with its nucleus.
      let L = newLayer('z0');
      const cr = [2.3, 1.72, 1.9];
      const cell = new T.Mesh(sphereGeo, std(0xf0d4c9, { opacity: 0.36, depthWrite: false, roughness: 0.6 })); cell.scale.set(...cr); cell.renderOrder = 5; L.root.add(cell);
      const nuc = new T.Mesh(sphereGeo, std(0x182944, { roughness: 0.35 })); nuc.scale.setScalar(0.72); nuc.position.set(0.25, 0.08, 0.1); L.root.add(nuc);
      const mito = std(0xd8b27a, { roughness: 0.6, opacity: 0.85 });
      [[-1.3, -0.6, 0.4, 0.5], [-0.9, 0.85, -0.5, -0.8], [1.35, -0.75, 0.3, 1.1], [1.4, 0.8, -0.4, 0.2], [-1.65, 0.15, -0.3, 1.4]].forEach(([x, y, z, r]) => {
        const m = new T.Mesh(capGeo, mito); m.scale.set(0.3, 0.12, 0.13); m.position.set(x, y, z); m.rotation.set(0.3, 0.4, r); L.root.add(m);
      });
      DIRS.forEach(d => L.hull.push([V(d.x * cr[0], d.y * cr[1], d.z * cr[2]), 0.12]));
      const cd = V(-0.55, 0.8, 0.25).normalize();
      addTag(L, 'cell', V(cd.x * cr[0], cd.y * cr[1], cd.z * cr[2]), -0.25, 0.3);
      addTag(L, 'nucleus', V(0.97, 0.08, 0.1), 1.45, 0.35);
      collect(L);

      // Level 1 · inside the nucleus: seven X-shaped chromosomes.
      L = newLayer('z1');
      const shell = new T.Mesh(sphereGeo, std(0x9fb2c9, { opacity: 0.3, depthWrite: false, roughness: 0.5 })); shell.scale.setScalar(2); shell.renderOrder = 5; L.root.add(shell);
      [[0, 0, 0.3, 0.15, 0x24748d, 0.6], [-1.0, 0.72, -0.2, 0.7, 0xbd8126, 0.48], [0.98, 0.78, 0.1, -0.55, 0x56834b, 0.46], [-1.1, -0.58, 0.3, -0.4, 0xad5c63, 0.5],
        [0.95, -0.72, -0.3, 0.9, 0x3f6690, 0.48], [-0.12, 1.22, 0.35, 1.45, 0x56834b, 0.38], [0.18, -1.25, 0.2, -1.2, 0xbd8126, 0.4]].forEach(([x, y, z, rz, c, s], i) => {
        const { g } = chromosome(c, i % 2 ? [0.6, 0.95] : [0.72, 1.05]);
        g.position.set(x, y, z); g.rotation.set(0.25 * Math.sin(i * 2.1), 0.35 * Math.cos(i * 1.3), rz); g.scale.setScalar(s); L.root.add(g);
      });
      DIRS.forEach(d => L.hull.push([d.clone().multiplyScalar(2), 0.08]));
      addTag(L, 'chromosomes', V(1.12, 0.95, 0.1), 1.1, 0.45);
      collect(L);

      // Level 2 · one chromosome; a coiled DNA thread unwinds from the tip of one arm.
      L = newLayer('z2');
      const big = chromosome(0x24748d); big.g.position.set(-0.8, 0.02, 0); big.g.scale.setScalar(1.45); L.root.add(big.g); big.g.updateMatrix();
      big.pts.forEach(p => L.hull.push([p.clone().applyMatrix4(big.g.matrix), 0.26]));
      const tip = V(0.42, 0.72, 0).applyMatrix4(big.g.matrix), coil = [];
      const B = t => V(tip.x + 2.75 * t, tip.y + 0.32 * Math.sin(Math.PI * 1.15 * t) - 0.85 * t, 0);
      for (let k = 0; k <= 360; k++) {
        const t = k / 360, b = B(t), d = B(Math.min(1, t + 0.002)).sub(B(Math.max(0, t - 0.002))).normalize();
        const r = 0.19 * Math.min(1, t * 10) * (1 - 0.7 * t), ph = Math.PI * 2 * 8 * Math.pow(t, 0.72);
        coil.push(b.add(V(-d.y, d.x, 0).multiplyScalar(r * Math.cos(ph))).add(V(0, 0, r * Math.sin(ph))));
      }
      L.root.add(new T.Mesh(keep(new T.TubeGeometry(new T.CatmullRomCurve3(coil), 720, 0.036, 8, false)), std(0x182944, { roughness: 0.4 })));
      coil.forEach((p, k) => { if (k % 24 === 0) L.hull.push([p, 0.06]); });
      addTag(L, 'chromosome', V(-1.52, -0.88, 0), -0.3, 0);
      addTag(L, 'DNA coiled up', coil[120].clone(), 0.2, 0.62);
      collect(L);

      // Level 3 · a double-helix section of 12 base pairs.
      L = newLayer('z3');
      const h3 = buildHelix(L, 12, 1, 0.34, Math.PI, 'x', 'GATCCGATTCGA'.split(''), [0x182944, 0x5b8a96]);
      addTag(L, 'double helix', h3.P(0, 1), 0, 0.42);
      addTag(L, 'base pair', h3.P(5, 0, 0), 0, -1.38, 0, -0.55);
      collect(L);
    }

    let hx = null;
    function buildHelixView() {
      if (layers.h) return;
      const L = newLayer('h'), R = 0.95, RISE = 0.46;
      const TWH = Math.PI / 10; // half a turn over 10 pairs, so strand 1 stays on the left in every row
      const h = buildHelix(L, 10, R, RISE, Math.PI - 4.5 * TWH, 'y', S1, [0x182944, 0x5b8a96], TWH); // centred facing the viewer
      hx = { h, anchors: [], letters: [] };
      for (let i = 0; i < 10; i++) {
        hx.anchors.push([h.P(i, 0, R * 0.5), h.P(i, 1, R * 0.5)]);
        const list = [], add = (side, text, id) => { const lab = makeLabel('letter', text, RING[text]); overlay.add(lab.sprite); list.push({ side, lab, id, alpha: 1 }); };
        add(0, S1[i], 'b'); add(1, '?', 'q'); add(1, PAIR[S1[i]], 'b');
        if (i === MUT) { add(0, 'A', 'm'); add(1, 'T', 'm'); }
        hx.letters.push(list);
      }
      // Gene: a translucent gold band around base pairs 3–8.
      const bandR = R + 0.24, top = 3 * RISE, bot = -3 * RISE;
      hx.bandMat = keep(new T.MeshStandardMaterial({ color: 0xbd8126, transparent: true, opacity: 0, depthWrite: false, side: T.DoubleSide, roughness: 0.6, emissive: 0x3a2206, emissiveIntensity: 0.25 }));
      hx.edgeMat = keep(new T.MeshStandardMaterial({ color: 0xbd8126, transparent: true, opacity: 0, roughness: 0.4 }));
      hx.band = new T.Mesh(keep(new T.CylinderGeometry(bandR, bandR, top - bot, 48, 1, true)), hx.bandMat); hx.band.renderOrder = 6;
      hx.edges = [top, bot].map(y => { const e = new T.Mesh(keep(new T.TorusGeometry(bandR, 0.03, 8, 64)), hx.edgeMat); e.rotation.x = Math.PI / 2; e.position.y = y; return e; });
      [hx.band, ...hx.edges].forEach(o => { o.userData.own = true; o.visible = false; L.root.add(o); });
      for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; [top, bot].forEach(y => L.hull.push([V(bandR * Math.cos(a), y, bandR * Math.sin(a)), 0.05])); }
      hx.geneTag = addTag(L, 'gene = a section\nof DNA', V(0, -0.92, 0), bandR + 0.34, 0, bandR + 0.02, 0); // both labels on the right: fits narrow hosts
      // Mutation: a highlight ring around base pair 4 (screen-facing).
      const rr = [R + 0.36, 0.3], rp = [];
      for (let k = 0; k < 72; k++) { const a = k / 72 * Math.PI * 2; rp.push(V(rr[0] * Math.cos(a), rr[1] * Math.sin(a), 0)); }
      hx.ring = new T.Mesh(keep(new T.TubeGeometry(new T.CatmullRomCurve3(rp, true), 144, 0.038, 8, true)), keep(new T.MeshBasicMaterial({ color: 0x182944, transparent: true, opacity: 0, depthTest: false, depthWrite: false })));
      hx.ring.renderOrder = 22; hx.ring.visible = false; overlay.add(hx.ring);
      hx.ringAnchor = V(0, (4.5 - MUT) * RISE, 0);
      hx.mutTag = addTag(L, 'one base changed\n= mutation', hx.ringAnchor.clone(), rr[0] + 0.3, 0, rr[0] + 0.03, 0);
      L.extra = (q, u, pts) => pts.push([hx.ringAnchor.clone().applyQuaternion(q), rr[0] + 0.05, rr[1] + 0.05]);
      collect(L);
    }

    const C3 = {}; Object.keys(HEX).forEach(k => { C3[k] = new T.Color(HEX[k]); });
    const GREY = new T.Color(0xc9c4b6), tmpCol = new T.Color();
    const hv = { p: 0, g: 0, m: 0 };
    function applyHelix() {
      if (!hx) return;
      const { p, g, m } = hv;
      for (let i = 0; i < 10; i++) {
        const m1 = hx.h.rungs[0][i], m2 = hx.h.rungs[1][i];
        if (i === MUT) { m1.color.lerpColors(C3.G, C3.A, m); tmpCol.lerpColors(C3.C, C3.T, m); } else tmpCol.copy(C3[PAIR[S1[i]]]);
        m2.color.lerpColors(GREY, tmpCol, p);
        hx.letters[i].forEach(e => {
          if (e.side === 0) e.alpha = e.id === 'm' ? m : (i === MUT ? 1 - m : 1);
          else e.alpha = e.id === 'q' ? 1 - p : e.id === 'm' ? p * m : (i === MUT ? p * (1 - m) : p);
        });
      }
      hx.bandMat.opacity = 0.2 * g; hx.edgeMat.opacity = 0.9 * g;
      hx.band.visible = g > 0.01; hx.edges.forEach(e => { e.visible = g > 0.01; });
      hx.geneTag.alpha = g; hx.mutTag.alpha = m;
    }

    /* ---------- sizing, camera fit, placement of screen-facing labels ---------- */
    let W = 1, H = 1, tagPx = 22, letPx = 20, curView = null, zCur = 0, S = state;
    const cam = { x: 0, y: 0, D: 9 };
    const wppAt = D => 2 * D * tanH / H;
    function setPx() {
      tagPx = Math.round(Math.min(26, Math.max(18, H * 0.085))); letPx = Math.round(Math.min(24, Math.max(15, H * 0.078)));
      labels.forEach(l => { const px = l.kind === 'tag' ? tagPx : letPx; if (Math.abs(l.px - px) > 0.5) drawLabel(l, px); });
    }
    function fitFor(L, rot) {
      const q = new T.Quaternion().setFromEuler(new T.Euler(rot[0], rot[1], 0));
      const aspect = W / H, top = 12, bottom = 12, side = 14, mx = (W - 2 * side) / W, my = (H - top - bottom) / H;
      let D = cam.D || 9, cx = 0, cy = 0;
      for (let it = 0; it < 4; it++) {
        const u = wppAt(D), pts = L.hull.map(([p, r]) => [p.clone().applyQuaternion(q), r, r]);
        L.tags.forEach(tg => pts.push([tagCentre(tg, tg.anchor.clone().applyQuaternion(q), u, V(0, 0, 0)), tg.lab.w * u / 2, tg.lab.h * u / 2]));
        if (L.extra) L.extra(q, u, pts);
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
      return { x: cx, y: cy, D };
    }
    const curLayer = () => (curView === 'helix' ? layers.h : layers['z' + zCur]);
    function place() {
      world.updateMatrixWorld(true);
      const u = wppAt(cam.D), k = z => Math.max(0.3, (cam.D - z) / cam.D);
      tags.forEach(tg => {
        const op = tg.alpha * tg.L.tf, vis = op > 0.02 && tg.L.root.visible;
        tg.lab.sprite.visible = tg.line.visible = vis; if (!vis) return;
        tg.L.root.localToWorld(tA.copy(tg.anchor));
        const kk = k(tA.z), c = tagCentre(tg, tA, u * kk, tB);
        tg.lab.sprite.position.copy(c); tg.lab.sprite.scale.set(tg.lab.w * u * kk, tg.lab.h * u * kk, 1); tg.lab.sprite.material.opacity = op;
        const ex = tg.ox ? c.x - Math.sign(tg.ox) * tg.lab.w * u * kk / 2 : c.x, ey = tg.ox ? c.y : c.y - Math.sign(tg.oy) * tg.lab.h * u * kk / 2;
        tg.line.geometry.attributes.position.array.set([tA.x + tg.lx, tA.y + tg.ly, tA.z, ex, ey, c.z]); tg.line.geometry.attributes.position.needsUpdate = true;
        tg.line.material.opacity = 0.85 * op;
      });
      if (!hx) return;
      const L = layers.h, on = L.root.visible && L.tf > 0.02;
      for (let i = 0; i < 10; i++) {
        // Letters sit on their own half-rung; where a rung points at the viewer the two letters are nudged apart.
        L.root.localToWorld(tA.copy(hx.anchors[i][0])); L.root.localToWorld(tB.copy(hx.anchors[i][1]));
        const need = letPx * u * 1.15, dx = tB.x - tA.x;
        if (Math.abs(dx) < need) { const sg = dx < -0.001 ? -1 : 1, mid = (tA.x + tB.x) / 2; tA.x = mid - sg * need / 2; tB.x = mid + sg * need / 2; }
        hx.letters[i].forEach(e => {
          const p = e.side ? tB : tA, kk = k(p.z), op = e.alpha * L.tf;
          e.lab.sprite.position.copy(p); e.lab.sprite.scale.set(e.lab.w * u * kk, e.lab.h * u * kk, 1);
          e.lab.sprite.material.opacity = op; e.lab.sprite.visible = on && op > 0.02;
        });
      }
      const pulse = pulsing() ? 0.5 + 0.5 * Math.sin(performance.now() / 1600 * Math.PI * 2) : 1;
      hx.ring.visible = on && hv.m > 0.02;
      L.root.localToWorld(hx.ring.position.copy(hx.ringAnchor));
      hx.ring.scale.setScalar(1 + 0.05 * (pulsing() ? pulse : 0));
      hx.ring.material.opacity = hv.m * (pulsing() ? 0.7 + 0.3 * pulse : 1);
    }

    /* ---------- tweens and on-demand rendering ---------- */
    let raf = 0, visible = true, disposed = false, refitTimer = 0;
    const tweens = new Map();
    const easeIO = p => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
    const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
    const lerp = (a, b, t) => a + (b - a) * t;
    const pulsing = () => curView === 'helix' && hv.m > 0.99 && visible && !disposed && !reduce();
    function tween(name, dur, set, done) {
      if (reduce() || dur <= 0 || !visible) { tweens.delete(name); set(1); done && done(); draw(); return; }
      tweens.set(name, { start: performance.now(), dur, set, done }); kick();
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
      if (tweens.size || pulsing()) kick();
    }
    function finishAll() { for (const [k, tw] of [...tweens]) { tweens.delete(k); tw.set(1); tw.done && tw.done(); } }
    function draw() {
      if (disposed) return;
      camera.position.set(cam.x, cam.y, cam.D); camera.lookAt(cam.x, cam.y, 0);
      place();
      renderer.render(scene, camera);
    }
    function refit(animate) {
      const L = curLayer(); if (!L) return;
      const t = fitFor(L, [world.rotation.x, world.rotation.y]);
      if (!animate) { Object.assign(cam, t); draw(); return; }
      const from = { ...cam };
      tween('refit', 320, u => { cam.x = lerp(from.x, t.x, u); cam.y = lerp(from.y, t.y, u); cam.D = lerp(from.D, t.D, u); });
    }

    /* ---------- state application ---------- */
    function goLevel(b) {
      finishAll();
      const a = zCur, A = layers['z' + a], Bl = layers['z' + b], dir = b > a ? 1 : -1, rot = ROT[b];
      zCur = b;
      const target = fitFor(Bl, rot), from = { ...cam }, r0 = [world.rotation.x, world.rotation.y];
      tween('zoom', 700, u => {
        setFade(A, 1 - smooth(0, 0.6, u), lerp(1, dir > 0 ? 2.8 : 0.35, u), 1 - smooth(0, 0.25, u));
        setFade(Bl, smooth(0.3, 1, u), lerp(dir > 0 ? 0.35 : 2.8, 1, u), smooth(0.7, 1, u));
        cam.x = lerp(from.x, target.x, u); cam.y = lerp(from.y, target.y, u); cam.D = lerp(from.D, target.D, u);
        world.rotation.set(lerp(r0[0], rot[0], u), lerp(r0[1], rot[1], u), 0);
      }, () => { setFade(A, 0, 1, 0); setFade(Bl, 1, 1, 1); S.rx = rot[0]; S.ry = rot[1]; });
    }
    function feature(name, on) {
      const to = on ? 1 : 0, from = hv[name];
      if (Math.abs(to - from) < 1e-3) return;
      tween('f-' + name, 450, u => { hv[name] = lerp(from, to, u); applyHelix(); });
    }
    function describe(s) {
      let d;
      if (view(s) === 'zoom') d = `Rotatable 3D model, zoom level ${lvl(s) + 1} of 4 (${LEVELS[lvl(s)].toLowerCase()}): ${ZOOM_DESC[lvl(s)]}.`;
      else {
        const f = flags(s);
        d = `Rotatable 3D model of a DNA double helix with 10 base pairs. Strand 1 reads ${strand1(f.mutated).join(' ')} from top to bottom. ` +
          (f.partners ? `Strand 2 reads ${strand2(f.mutated).join(' ')}: A pairs with T and C pairs with G.` : 'Strand 2 bases are hidden as question marks.') +
          (f.gene ? ' A gold band marks base pairs 3 to 8: a gene, one section of DNA.' : '') +
          (f.mutated ? ' Base pair 4 is circled: it changed from G–C to A–T, a mutation.' : '');
      }
      canvas.setAttribute('aria-label', d + ' Drag or use the arrow keys to rotate.');
    }
    function apply(s) {
      S = s;
      if (s.mutated && !s.partners) s.partners = true;
      const v = view(s), f = flags(s);
      if (v !== curView) {
        finishAll(); curView = v;
        if (v === 'zoom') buildZoom(); else buildHelixView();
        setPx();
        Object.values(layers).forEach(L => setFade(L, 0, 1, 0));
        const rot = v === 'zoom' ? ROT[lvl(s)] : HROT;
        world.rotation.set(typeof s.rx === 'number' ? s.rx : rot[0], typeof s.ry === 'number' ? s.ry : rot[1], 0);
        if (v === 'zoom') { zCur = lvl(s); setFade(layers['z' + zCur], 1, 1, 1); } else { setFade(layers.h, 1, 1, 1); hv.p = +f.partners; hv.g = +f.gene; hv.m = +f.mutated; applyHelix(); }
        refit(false);
      } else if (v === 'zoom') { if (lvl(s) !== zCur) goLevel(lvl(s)); } else { feature('p', f.partners); feature('g', f.gene); feature('m', f.mutated); }
      describe(s); draw();
      if (pulsing()) kick();
    }
    function resize() {
      const r = host.getBoundingClientRect(); if (!r.width || !r.height) return;
      W = r.width; H = r.height; renderer.setSize(W, H, false); camera.aspect = W / H; camera.updateProjectionMatrix();
      setPx(); if (tweens.size) finishAll(); refit(false);
    }

    /* ---------- pointer and keyboard rotation ---------- */
    let last = null;
    const clampX = x => Math.max(-1.2, Math.min(1.2, x));
    const rotated = () => { S.rx = world.rotation.x; S.ry = world.rotation.y; draw(); };
    const onDown = e => { if (e.button !== undefined && e.button !== 0) return; if (tweens.size) finishAll(); last = [e.clientX, e.clientY]; try { canvas.setPointerCapture(e.pointerId); } catch (_) { /* ignore */ } };
    const onMove = e => { if (!last) return; world.rotation.y += (e.clientX - last[0]) * 0.009; world.rotation.x = clampX(world.rotation.x + (e.clientY - last[1]) * 0.009); last = [e.clientX, e.clientY]; rotated(); };
    const onUp = () => { if (!last) return; last = null; refit(true); };
    const onKey = e => {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) return;
      e.preventDefault(); e.stopPropagation(); if (tweens.size) finishAll();
      world.rotation.y += e.key === 'ArrowLeft' ? -0.15 : e.key === 'ArrowRight' ? 0.15 : 0;
      world.rotation.x = clampX(world.rotation.x + (e.key === 'ArrowUp' ? -0.15 : e.key === 'ArrowDown' ? 0.15 : 0));
      rotated(); clearTimeout(refitTimer); refitTimer = setTimeout(() => refit(true), 260);
    };
    canvas.addEventListener('pointerdown', onDown); canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp); canvas.addEventListener('pointercancel', onUp); canvas.addEventListener('keydown', onKey);

    { const r = host.getBoundingClientRect(); W = r.width || 560; H = r.height || 260; renderer.setSize(W, H, false); camera.aspect = W / H; camera.updateProjectionMatrix(); }
    apply(state);
    const observer = new ResizeObserver(resize); observer.observe(host);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (disposed) return; labels.forEach(l => drawLabel(l, l.px || tagPx)); refit(false); }).catch(() => {});

    return {
      update: s => { if (!disposed) apply(s); },
      command: () => {},
      visibility: v => { visible = !!v; if (!visible) { cancelAnimationFrame(raf); raf = 0; finishAll(); } else { draw(); if (pulsing()) kick(); } },
      dispose() {
        disposed = true; cancelAnimationFrame(raf); raf = 0; clearTimeout(refitTimer); tweens.clear(); observer.disconnect();
        canvas.removeEventListener('pointerdown', onDown); canvas.removeEventListener('pointermove', onMove);
        canvas.removeEventListener('pointerup', onUp); canvas.removeEventListener('pointercancel', onUp); canvas.removeEventListener('keydown', onKey);
        scene.traverse(o => { if (o.geometry) bin.add(o.geometry); if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(mt => { bin.add(mt); if (mt.map) bin.add(mt.map); }); });
        bin.forEach(x => { try { x.dispose(); } catch (_) { /* ignore */ } }); bin.clear();
        labels.forEach(l => { l.canvas.width = l.canvas.height = 0; }); labels.length = 0; tags.length = 0;
        try { renderer.dispose(); renderer.forceContextLoss(); } catch (_) { /* ignore */ }
        canvas.remove(); host.classList.remove('is-live');
      }
    };
  }

  return {
    caption: 'Original 3D model: not to scale. Drag or use the arrow keys to rotate.',
    defaults: { view: 'zoom', level: 0, partners: false, gene: false, mutated: false },
    controls, readout, command, mount
  };
})();
