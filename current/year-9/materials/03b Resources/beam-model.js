/* Year 9 composites: local Three.js (r160, global THREE) reinforced-concrete beam.
   Original geometry. No sound, network calls or pupil data. Renders on demand only.
   State: {view:'whole'|'inside', steel:bool, load:0-100, forces:bool, rx, ry}.
   Science conventions (Year 9 Materials L3):
   - beam rests on two supports with a downward load at mid-span, so the top is squeezed and the bottom is pulled;
   - plain and reinforced beams first crack at the same load, because cracking depends on the concrete;
   - after cracking, steel carries the pull in a reinforced beam; a plain beam fails soon after;
   - blue inward arrows = compression; orange outward arrows = tension;
   - load values, crack points and bending are illustrative and exaggerated, and thin hoops and top bars are omitted. */
window.LessonModels = window.LessonModels || {};
window.LessonModels.beam = (() => {
  const L = 8, H = 1.05, D = 0.8, CRACK = 30, FAIL = 33;
  const defaults = { view: 'whole', steel: true, load: 0, forces: false, names: true, rx: 0.14, ry: -0.42 };
  const btn = (label, value, pressed) => `<button type="button" data-action="model" data-value="${value}" aria-pressed="${pressed}">${label}</button>`;
  const stage = s => {
    if (s.load < CRACK) return 'none';
    if (s.steel) return 'held';
    return s.load >= FAIL ? 'failed' : 'cracking';
  };
  const MESSAGE = {
    none: 'No visible cracks.',
    held: 'Small cracks on the pulled side. The steel carries the pull.',
    cracking: 'A crack grows up from the pulled side. There is no steel to carry the pull.',
    failed: 'The crack ran up through the beam. It failed suddenly, because concrete is brittle.',
  };
  function readout(p, s) {
    if (s.names === false) return `<p><span class="readout-key">Beam · load 0</span><span class="readout-value" style="font-size:.86em">What is inside it?</span></p>`;
    return `<p><span class="readout-key">${s.steel ? 'Reinforced concrete' : 'Plain concrete'} · load ${Math.round(s.load)}</span><span class="readout-value" style="font-size:.86em">${MESSAGE[stage(s)]}</span></p>`;
  }
  function controls(p, s) {
    if (s.names === false) return '';
    return `<div class="control-group" role="group" aria-label="View">${btn('Whole', 'view=whole', s.view === 'whole')}${btn('See inside', 'view=inside', s.view === 'inside')}</div>`
      + `<div class="control-group" role="group" aria-label="Beam">${btn('With steel', 'steel=true', !!s.steel)}${btn('No steel', 'steel=false', !s.steel)}${btn(s.forces ? 'Hide forces' : 'Show forces', 'forces=' + !s.forces, !!s.forces)}</div>`
      + `<label class="control-label" for="beam-load">Load in the middle</label><input id="beam-load" type="range" min="0" max="100" step="1" value="${s.load}" data-model-key="load">`;
  }
  function deflection(x, s) {
    const k = stage(s) === 'failed';
    if (k) return -0.72 * (1 - Math.abs(2 * x / L));
    const u = 1 - Math.pow(2 * x / L, 2);
    let d = 0.012 * Math.min(s.load, CRACK);
    if (s.load > CRACK) d += (s.load - CRACK) * (s.steel ? 0.003 : 0.06);
    return -d * u;
  }
  function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function concreteTexture(T) {
    const c = document.createElement('canvas'); c.width = 1024; c.height = 256;
    const g = c.getContext('2d'), r = rng(84);
    g.fillStyle = '#b9b4a9'; g.fillRect(0, 0, 1024, 256);
    for (let i = 0; i < 2600; i += 1) {
      const v = 130 + Math.floor(r() * 90), R = 1 + r() * 5;
      g.fillStyle = `rgba(${v},${v - 4},${v - 12},${0.35 + r() * 0.45})`;
      g.beginPath(); g.ellipse(r() * 1024, r() * 256, R, R * (0.6 + r() * 0.4), r() * 3, 0, 7); g.fill();
    }
    const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.wrapS = t.wrapT = T.RepeatWrapping; return t;
  }
  function mount(host, state, phase, ctx) {
    const T = window.THREE; if (!T || !host) return null;
    try {
      const probe = document.createElement('canvas'), gl = probe.getContext('webgl2') || probe.getContext('webgl');
      if (!gl) return null;
    } catch (_) { return null; }
    let renderer;
    try { renderer = new T.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' }); } catch (_) { return null; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = T.SRGBColorSpace;
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = T.PCFSoftShadowMap;
    const canvas = renderer.domElement; canvas.tabIndex = 0; canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', 'Three-dimensional reinforced-concrete beam on two supports. Drag or use arrow keys to rotate.');
    host.style.position = 'relative';
    host.appendChild(canvas); host.classList.add('is-live');
    const layer = document.createElement('div'); layer.className = 'beam-labels'; layer.setAttribute('aria-hidden', 'true'); host.appendChild(layer);

    const scene = new T.Scene(), camera = new T.PerspectiveCamera(26, 2, 0.1, 100);
    camera.position.set(0, 1.1, 12); camera.lookAt(0, 0.1, 0);
    scene.add(new T.HemisphereLight(0xfff6e6, 0x8c8577, 1.25));
    const sun = new T.DirectionalLight(0xffffff, 2.1); sun.position.set(-5, 9, 7); sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024); Object.assign(sun.shadow.camera, { left: -8, right: 8, top: 6, bottom: -6 });
    scene.add(sun);
    const group = new T.Group(); scene.add(group);
    const own = [];
    const keep = x => { own.push(x); return x; };

    const floor = new T.Mesh(keep(new T.PlaneGeometry(26, 12)), keep(new T.ShadowMaterial({ opacity: 0.2 })));
    floor.rotation.x = -Math.PI / 2; floor.position.y = -1.42; floor.receiveShadow = true; group.add(floor);

    const tex = keep(concreteTexture(T));
    const concreteGeo = keep(new T.BoxGeometry(L, H, D, 96, 10, 6));
    const concreteBase = concreteGeo.attributes.position.array.slice();
    const concreteMat = keep(new T.MeshStandardMaterial({ map: tex, roughness: 0.96, metalness: 0, bumpMap: tex, bumpScale: 0.6 }));
    const concrete = new T.Mesh(concreteGeo, concreteMat); concrete.castShadow = true; group.add(concrete);

    const supportMat = keep(new T.MeshStandardMaterial({ color: 0x77828f, roughness: 0.8 }));
    [-1, 1].forEach(side => {
      const m = new T.Mesh(keep(new T.BoxGeometry(0.8, 0.9, 1.2)), supportMat);
      m.position.set(side * (L / 2 - 0.5), -H / 2 - 0.45, 0); m.castShadow = true; group.add(m);
    });

    const steelMat = keep(new T.MeshStandardMaterial({ color: 0x4d5560, roughness: 0.42, metalness: 0.92 }));
    const barGeo = keep(new T.CylinderGeometry(0.07, 0.07, L - 0.25, 12, 96));
    barGeo.rotateZ(Math.PI / 2);
    const barBase = barGeo.attributes.position.array.slice();
    const bars = [], ribs = [];
    const ribGeo = keep(new T.TorusGeometry(0.075, 0.016, 6, 14));
    [-0.24, 0, 0.24].forEach(z => {
      const bar = new T.Mesh(barGeo, steelMat); bar.position.set(0, -H / 2 + 0.2, z); group.add(bar); bars.push(bar);
      for (let x = -L / 2 + 0.3; x < L / 2 - 0.2; x += 0.36) {
        const rib = new T.Mesh(ribGeo, steelMat); rib.rotation.y = Math.PI / 2; rib.userData = { x, z }; group.add(rib); ribs.push(rib);
      }
    });

    const loadMat = keep(new T.MeshStandardMaterial({ color: 0x21345b, roughness: 0.55, metalness: 0.2 }));
    const loadBlock = new T.Mesh(keep(new T.BoxGeometry(1.2, 1, 1)), loadMat); loadBlock.castShadow = true; group.add(loadBlock);

    const crackMat = keep(new T.MeshBasicMaterial({ color: 0x20242b }));
    const crackGeo = keep(new T.BoxGeometry(1, 1, 0.012));
    const cracks = [0, -0.5, 0.5, -1.05, 1.05].map(x => {
      const front = new T.Mesh(crackGeo, crackMat), back = new T.Mesh(crackGeo, crackMat);
      group.add(front, back); return { x, front, back };
    });

    const blue = keep(new T.MeshBasicMaterial({ color: 0x2f6fb3 })), orange = keep(new T.MeshBasicMaterial({ color: 0xc2571a }));
    const shaftGeo = keep(new T.CylinderGeometry(0.055, 0.055, 1, 12)), headGeo = keep(new T.ConeGeometry(0.17, 0.32, 16));
    function arrow(mat) {
      const g = new T.Group(), s = new T.Mesh(shaftGeo, mat), h = new T.Mesh(headGeo, mat);
      s.scale.y = 0.95; s.position.y = -0.14; h.position.y = 0.5; g.add(s, h); group.add(g); return g;
    }
    const forceArrows = [
      { g: arrow(blue), x: -2.2, y: H / 2 + 0.3, dir: -Math.PI / 2 }, { g: arrow(blue), x: 2.2, y: H / 2 + 0.3, dir: Math.PI / 2 },
      { g: arrow(orange), x: -2.2, y: -H / 2 - 0.3, dir: Math.PI / 2 }, { g: arrow(orange), x: 2.2, y: -H / 2 - 0.3, dir: -Math.PI / 2 },
    ];

    const makeLabel = (text, cls) => { const d = document.createElement('span'); d.className = 'beam-label ' + cls; d.textContent = text; layer.appendChild(d); return d; };
    const labels = {
      concrete: makeLabel('Concrete', 'is-material'), steel: makeLabel('Steel bars', 'is-material'),
      top: makeLabel('Squeezed: compression', 'is-compression'), bottom: makeLabel('Pulled: tension', 'is-tension'), load: makeLabel('Load', 'is-material'),
    };
    let current = Object.assign({}, defaults, state);
    function place(label, x, y, z) {
      const v = new T.Vector3(x, y, z); group.localToWorld(v); v.project(camera);
      label.style.left = ((v.x + 1) / 2 * 100) + '%'; label.style.top = ((1 - v.y) / 2 * 100) + '%';
    }
    function deform(geo, base, s, offsetY) {
      const a = geo.attributes.position.array;
      for (let i = 0; i < a.length; i += 3) { a[i] = base[i]; a[i + 2] = base[i + 2]; a[i + 1] = base[i + 1] + deflection(base[i], s) + (offsetY || 0); }
      geo.attributes.position.needsUpdate = true; geo.computeVertexNormals();
    }
    function draw() { renderer.render(scene, camera); }
    function size() {
      const w = host.clientWidth || 640, h = host.clientHeight || 340;
      renderer.setSize(w, h, false); canvas.style.width = '100%'; canvas.style.height = '100%';
      camera.aspect = w / h; camera.position.z = Math.max(11.2, 22.5 / camera.aspect); camera.lookAt(0, 0.1, 0); camera.updateProjectionMatrix(); draw();
    }
    function update(s) {
      current = Object.assign({}, defaults, s);
      group.rotation.x = current.rx; group.rotation.y = current.ry;
      group.updateMatrixWorld(true);
      deform(concreteGeo, concreteBase, current);
      const inside = current.view === 'inside';
      concreteMat.transparent = inside; concreteMat.opacity = inside ? 0.3 : 1; concreteMat.depthWrite = !inside; concreteMat.needsUpdate = true;
      const showSteel = !!current.steel;
      deform(barGeo, barBase, current);
      bars.forEach(b => { b.visible = showSteel && inside; });
      ribs.forEach(r => { r.visible = showSteel && inside; r.position.set(r.userData.x, -H / 2 + 0.2 + deflection(r.userData.x, current), r.userData.z); });
      const size3 = 0.5 + current.load / 100 * 0.9;
      loadBlock.visible = current.load > 0;
      loadBlock.scale.y = size3;
      loadBlock.position.set(0, H / 2 + size3 / 2 + deflection(0, current), 0);
      const st = stage(current);
      cracks.forEach((c, i) => {
        let h = 0, w = 0.03;
        if (st === 'held') { h = Math.min(H * 0.62, H * (0.16 + (current.load - CRACK) * 0.007)) * (i === 0 ? 1 : i < 3 ? 0.8 : 0.55); }
        if (st === 'cracking' && i === 0) { h = H * (0.45 + (current.load - CRACK) / (FAIL - CRACK) * 0.5); w = 0.05; }
        if (st === 'failed' && i === 0) { h = H; w = 0.12; }
        [c.front, c.back].forEach((m, side) => {
          m.visible = h > 0;
          m.scale.set(w, Math.max(h, 0.001), 1);
          m.position.set(c.x, -H / 2 + h / 2 + deflection(c.x, current), (side ? -1 : 1) * (D / 2 + 0.008));
        });
      });
      const f = !!current.forces && current.load > 0;
      forceArrows.forEach(a => {
        a.g.visible = f && st !== 'failed'; a.g.rotation.z = a.dir;
        a.g.position.set(a.x, a.y + deflection(a.x, current), D / 2 * 0.2);
      });
      labels.concrete.hidden = current.names === false; place(labels.concrete, -3.2, H / 2 - 0.3 + deflection(-3.2, current), D / 2);
      labels.steel.hidden = !(showSteel && inside); place(labels.steel, 2.9, -H / 2 + 0.2 + deflection(2.9, current), D / 2);
      labels.top.hidden = !f || st === 'failed'; place(labels.top, 0, H / 2 + 1.25 + deflection(0, current) + current.load / 100 * 0.9, 0);
      labels.bottom.hidden = !f || st === 'failed'; place(labels.bottom, 0, -H / 2 - 0.42 + deflection(0, current), 0);
      labels.load.hidden = current.load === 0 || f; place(labels.load, 0, H / 2 + size3 + 0.3 + deflection(0, current), 0);
      draw();
    }
    let drag = null;
    const down = e => { drag = { x: e.clientX, y: e.clientY, rx: current.rx, ry: current.ry }; canvas.setPointerCapture(e.pointerId); };
    const move = e => {
      if (!drag) return;
      state.ry = Math.max(-1.1, Math.min(1.1, drag.ry + (e.clientX - drag.x) * 0.008));
      state.rx = Math.max(-0.1, Math.min(0.6, drag.rx + (e.clientY - drag.y) * 0.005));
      update(state);
    };
    const up = () => { drag = null; };
    const key = e => {
      const d = { ArrowLeft: [0, -0.08], ArrowRight: [0, 0.08], ArrowUp: [-0.05, 0], ArrowDown: [0.05, 0] }[e.key];
      if (!d) return; e.preventDefault(); e.stopPropagation();
      state.rx = Math.max(-0.1, Math.min(0.6, (state.rx ?? defaults.rx) + d[0])); state.ry = Math.max(-1.1, Math.min(1.1, (state.ry ?? defaults.ry) + d[1])); update(state);
    };
    canvas.addEventListener('pointerdown', down); canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up); canvas.addEventListener('keydown', key);
    const observer = new ResizeObserver(size); observer.observe(host);
    size(); update(state);
    return {
      update,
      dispose() {
        observer.disconnect();
        canvas.removeEventListener('pointerdown', down); canvas.removeEventListener('pointermove', move);
        canvas.removeEventListener('pointerup', up); canvas.removeEventListener('pointercancel', up); canvas.removeEventListener('keydown', key);
        own.forEach(x => { try { x.dispose(); } catch (_) { /* ignore */ } });
        try { renderer.dispose(); renderer.forceContextLoss(); } catch (_) { /* ignore */ }
        canvas.remove(); layer.remove(); host.classList.remove('is-live');
      },
    };
  }
  return { defaults, readout, controls, mount, caption: 'Interactive schematic. Drag to rotate. Load values and bending are illustrative and exaggerated. Thin hoops and top bars are left out. Any beam can fail if overloaded.' };
})();
