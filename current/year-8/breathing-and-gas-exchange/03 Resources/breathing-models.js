/* Year 8 breathing and gas exchange: local Three.js (r160, global THREE) schematic models. Original geometry.
   No network, no storage. Animation stops with prefers-reduced-motion (end states instead).
   thorax    State {breath: 0 (out) … 1 (in), target, highlight, labels, route}. Airway: trachea → bronchi → bronchioles → alveoli.
             Inhale: diaphragm contracts and flattens; external intercostals contract, ribs up/out; volume ↑; pressure inside < outside; air in.
             Quiet exhale: muscles relax, diaphragm domes, ribs down/in, elastic recoil; volume ↓; pressure inside > outside; air out.
   alveolus  v2 (27 Oct): cut-open alveolus in a cluster, capillary network with red blood cells, O2/CO2 molecules. Classroom particle model of one alveolus and its capillary. O2 and CO2 each diffuse net from higher to lower
             concentration. Thicker barrier → slower transfer. Ventilation refreshes alveolar air; blood flow carries blood away.
             Counts are a relative model, not physiological measurements. */
window.LessonModels = window.LessonModels || {};
(() => {
  const reduce = () => !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const btn = (label, value, pressed, cls = '') => `<button type="button"${cls ? ` class="${cls}"` : ''} data-action="model" data-value="${value}"${pressed === undefined ? '' : ` aria-pressed="${pressed}"`}>${label}</button>`;

  function stage(host) {
    const T = window.THREE; if (!T || !host) return null;
    try { const c = document.createElement('canvas'), gl = c.getContext('webgl2') || c.getContext('webgl'); if (!gl) return null; const l = gl.getExtension('WEBGL_lose_context'); if (l) l.loseContext(); } catch (_) { return null; }
    let renderer; try { renderer = new T.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' }); if (!renderer.getContext()) throw 0; } catch (_) { return null; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)); renderer.outputColorSpace = T.SRGBColorSpace; renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.15; renderer.setClearColor(0, 0);
    const canvas = renderer.domElement; canvas.tabIndex = 0; canvas.setAttribute('role', 'img'); host.appendChild(canvas); host.classList.add('is-live');
    const scene = new T.Scene(), camera = new T.PerspectiveCamera(32, 2, 0.1, 200);
    scene.add(new T.HemisphereLight(0xfffaf0, 0x8d8272, 1.6));
    const key = new T.DirectionalLight(0xfff3e2, 2.2); key.position.set(-4, 7, 11); scene.add(key);
    const fill = new T.DirectionalLight(0xe4ecff, 0.8); fill.position.set(7, -3, 6); scene.add(fill);
    const world = new T.Group(); scene.add(world);
    const own = new Set(); const keep = x => { own.add(x); return x; };
    let W = 1, H = 1;
    const size = () => { const r = host.getBoundingClientRect(); if (r.width < 2 || r.height < 2) return false; W = r.width; H = r.height; renderer.setSize(W, H, false); camera.aspect = W / H; camera.updateProjectionMatrix(); return true; };
    size();
    function label(text, o = {}) {
      const c = document.createElement('canvas'), g = c.getContext('2d'), fs = 44, pad = 18;
      const font = `700 ${fs}px Montserrat, "Segoe UI", system-ui, sans-serif`; g.font = font;
      const w = Math.ceil(g.measureText(text).width) + pad * 2, h = Math.round(fs * 1.5); c.width = w; c.height = h; g.font = font;
      if (o.box !== false) { g.beginPath(); if (g.roundRect) g.roundRect(2, 2, w - 4, h - 4, 14); else g.rect(2, 2, w - 4, h - 4); g.fillStyle = o.bg || 'rgba(252,250,244,.95)'; g.fill(); g.lineWidth = 3; g.strokeStyle = o.stroke || '#182944'; g.stroke(); }
      g.fillStyle = o.ink || '#182944'; g.textBaseline = 'middle'; g.fillText(text, pad, h / 2 + 2);
      const tex = keep(new T.CanvasTexture(c)); tex.colorSpace = T.SRGBColorSpace; tex.minFilter = T.LinearFilter; tex.generateMipmaps = false;
      const sp = new T.Sprite(keep(new T.SpriteMaterial({ map: tex, depthTest: false, depthWrite: false, transparent: true }))); sp.renderOrder = 30;
      sp.userData.aspect = w / h; sp.userData.px = o.px || 16; return sp;
    }
    function scaleLabels(group) {
      const dist = camera.position.distanceTo(new T.Vector3()), unit = (2 * dist * Math.tan(T.MathUtils.degToRad(camera.fov / 2))) / H;
      group.traverse(o => { if (o.isSprite && o.userData.aspect) { const hh = o.userData.px * 1.5 * unit; o.scale.set(hh * o.userData.aspect, hh, 1); } });
    }
    function line(a, b) { const g = keep(new T.BufferGeometry().setFromPoints([a, b])); const l = new T.Line(g, keep(new T.LineBasicMaterial({ color: 0x182944, depthTest: false, transparent: true }))); l.renderOrder = 29; return l; }
    let last = null; const clampX = x => Math.max(-0.7, Math.min(0.7, x)), clampY = y => Math.max(-0.9, Math.min(0.9, y));
    const onDown = e => { if (e.button !== undefined && e.button !== 0) return; last = [e.clientX, e.clientY]; try { canvas.setPointerCapture(e.pointerId); } catch (_) { /* */ } };
    const onMove = e => { if (!last) return; world.rotation.y = clampY(world.rotation.y + (e.clientX - last[0]) * 0.008); world.rotation.x = clampX(world.rotation.x + (e.clientY - last[1]) * 0.008); last = [e.clientX, e.clientY]; api.onRotate(); };
    const onUp = () => { last = null; };
    const onKey = e => { if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) return; e.preventDefault(); e.stopPropagation(); world.rotation.y = clampY(world.rotation.y + (e.key === 'ArrowLeft' ? -0.15 : e.key === 'ArrowRight' ? 0.15 : 0)); world.rotation.x = clampX(world.rotation.x + (e.key === 'ArrowUp' ? -0.12 : e.key === 'ArrowDown' ? 0.12 : 0)); api.onRotate(); };
    canvas.addEventListener('pointerdown', onDown); canvas.addEventListener('pointermove', onMove); canvas.addEventListener('pointerup', onUp); canvas.addEventListener('pointercancel', onUp); canvas.addEventListener('keydown', onKey);
    const api = {
      T, scene, camera, world, keep, label, line, scaleLabels, canvas, size, get W() { return W; }, get H() { return H; }, onRotate() {},
      render() { if (W > 1 && H > 1) renderer.render(scene, camera); },
      dispose() {
        canvas.removeEventListener('pointerdown', onDown); canvas.removeEventListener('pointermove', onMove); canvas.removeEventListener('pointerup', onUp); canvas.removeEventListener('pointercancel', onUp); canvas.removeEventListener('keydown', onKey);
        scene.traverse(o => { if (o.geometry) own.add(o.geometry); if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => { own.add(m); if (m.map) own.add(m.map); }); });
        own.forEach(x => { try { x.dispose(); } catch (_) { /* */ } }); own.clear();
        try { renderer.dispose(); renderer.forceContextLoss(); } catch (_) { /* */ } canvas.remove(); host.classList.remove('is-live');
      }
    };
    return api;
  }
  const std = (T, color, o = {}) => new T.MeshStandardMaterial({ color, roughness: o.rough ?? 0.45, metalness: 0.02, transparent: o.opacity !== undefined, opacity: o.opacity ?? 1, depthWrite: o.opacity === undefined, side: o.side ?? T.FrontSide, emissive: new T.Color(color), emissiveIntensity: 0 });

  /* =============================== thorax =============================== */
  const PARTS = {
    trachea: ['Trachea', 'Airway: carries air towards the bronchi.'],
    bronchi: ['Bronchi', 'Two airways, one into each lung.'],
    bronchioles: ['Bronchioles', 'Smaller and smaller airways inside each lung.'],
    alveoli: ['Alveoli', 'Tiny air sacs: the gas-exchange surface, beside capillaries.'],
    lungs: ['Lungs', 'Organs that hold the airways and alveoli.'],
    ribs: ['Ribs', 'Bones that protect the lungs; they move up/out and down/in.'],
    intercostals: ['Intercostal muscles', 'Muscles between the ribs that move the ribs.'],
    diaphragm: ['Diaphragm', 'Sheet of muscle below the lungs. Not part of the air route.']
  };
  const breathOf = s => Math.max(0, Math.min(1, +s.breath || 0));
  const chain = b => b >= 0.5
    ? { phase: 'Breathing in', d: 'contracts, flattens', r: 'up and out (external intercostals contract)', v: 'increases', p: 'lower than outside', a: 'in' }
    : { phase: 'Breathing out (quiet)', d: 'relaxes, domes up', r: 'down and in (muscles relax)', v: 'decreases', p: 'higher than outside', a: 'out' };
  const thorax = {
    caption: 'Schematic model, not to scale. Drag to turn.',
    defaults: { breath: 0, target: 0, highlight: 'none', labels: true, mode: 'structures' },
    readout(p, s) {
      if ((p && p.mode || s.mode) === 'breathing') {
        if (s.reveal === false) return `<p><span class="readout-key">${chain(s.target ?? breathOf(s)).phase}</span><span class="readout-value" style="font-size:.9em">Predict each link, then press Show the chain.</span></p>`;
        const c = chain(s.target ?? breathOf(s));
        return `<p><span class="readout-key">${c.phase}</span><span class="readout-value" style="font-size:.85em">Diaphragm ${c.d} · ribs ${c.r} · volume <b>${c.v}</b> · pressure inside <b>${c.p}</b> · air <b>${c.a}</b></span></p>`;
      }
      const h = s.highlight; if (!PARTS[h]) return `<p><span class="readout-key">Breathing system</span><span class="readout-value" style="font-size:.9em">Choose a structure to see its job.</span></p>`;
      return `<p><span class="readout-key">${PARTS[h][0]}</span><span class="readout-value" style="font-size:.95em">${PARTS[h][1]}</span></p>`;
    },
    controls(p, s) {
      const mode = (p && p.mode) || s.mode;
      const opt = (v, l) => `<option value="${v}"${s.highlight === v ? ' selected' : ''}>${l}</option>`;
      const hl = `<label class="control-label" for="thx-h">Highlight</label><select id="thx-h" class="cell-select" data-model-key="highlight">${opt('none', 'All structures')}${Object.entries(PARTS).map(([k, v]) => opt(k, v[0])).join('')}</select>`;
      const breathing = mode === 'breathing' ? `${btn('Breathe in', 'target=1', s.target === 1)}${btn('Breathe out', 'target=0', s.target === 0)}${btn(s.reveal === false ? 'Show the chain' : 'Hide the chain', 'reveal=' + (s.reveal === false), undefined, 'is-primary')}` : `${btn('Trace the air', 'route=1', undefined, 'is-primary')}${btn(s.labels === false ? 'Show labels' : 'Hide labels', 'labels=' + (s.labels === false))}`;
      return `<div class="control-group" role="group" aria-label="Thorax">${mode === 'breathing' ? '' : hl}${breathing}</div>`;
    },
    onChange(k, s) { if (k === 'route') s.routeT = 0; },
    mount(host, state, phase, ctx) {
      const S = stage(host); if (!S) return null; const { T, world, camera, keep } = S;
      const parts = {}, partMat = {}; const add = (k, m) => { const key = k + ':' + m.material.uuid; if (!partMat[key]) { partMat[key] = keep(m.material.clone()); partMat[key].userData.base = m.material.opacity; } m.material = partMat[key]; (parts[k] = parts[k] || []).push(m); m.userData.part = k; world.add(m); return m; };
      const M = { airway: keep(std(T, 0xe9d7b8, { rough: 0.6 })), lung: keep(std(T, 0xf2a7a7, { opacity: 0.4, side: T.DoubleSide })), alv: keep(std(T, 0xc76a8a)), rib: keep(std(T, 0xe8dfcc, { rough: 0.5, opacity: 0.55 })), ic: keep(std(T, 0xb84a4a, { opacity: 0.16, side: T.DoubleSide })), dia: keep(std(T, 0xa8463f, { opacity: 0.85, side: T.DoubleSide })) };
      const tube = (a, b, r, mat, k) => { const d = new T.Vector3().subVectors(b, a), len = d.length(); const m = new T.Mesh(keep(new T.CylinderGeometry(r * 0.8, r, len, 14)), mat); m.position.copy(a).addScaledVector(d, 0.5); m.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), d.clone().normalize()); return add(k, m); };
      // airway tree
      const top = new T.Vector3(0, 2.6, 0), fork = new T.Vector3(0, 1.1, 0);
      tube(top, fork, 0.17, M.airway, 'trachea');
      const lungC = [new T.Vector3(-1.05, 0.15, 0), new T.Vector3(1.05, 0.15, 0)];
      const sacs = [];
      lungC.forEach((c, side) => {
        const sgn = side ? 1 : -1, b1 = new T.Vector3(sgn * 0.7, 0.75, 0);
        tube(fork, b1, 0.12, M.airway, 'bronchi');
        const lung = new T.Mesh(keep(new T.SphereGeometry(1, 36, 28)), M.lung); lung.position.copy(c); lung.scale.set(0.95, 1.45, 0.75); add('lungs', lung);
        const grow = (from, dir, depth) => {
          if (depth === 0) { const sac = new T.Mesh(keep(new T.SphereGeometry(0.075, 12, 10)), M.alv); sac.position.copy(from); add('alveoli', sac); sacs.push(sac); for (let k = 0; k < 3; k++) { const s2 = sac.clone(); s2.position.add(new T.Vector3((k - 1) * 0.07, -0.05 * k, 0.04)); add('alveoli', s2); } return; }
          const len = 0.42 * Math.pow(0.78, 3 - depth);
          [-0.55, 0.55].forEach(a => { const d = dir.clone().applyAxisAngle(new T.Vector3(0, 0, 1), a * (depth === 3 ? 0.6 : 1)).normalize(); const to = from.clone().addScaledVector(d, len); tube(from, to, 0.05 * depth / 3 + 0.015, M.airway, 'bronchioles'); grow(to, d, depth - 1); });
        };
        grow(b1, new T.Vector3(sgn * 0.45, -1, 0).normalize(), 3);
      });
      // ribs (front arcs) and intercostal bands
      const ribs = []; const ribGeo = keep(new T.TorusGeometry(1.95, 0.035, 8, 64, Math.PI * 0.95));
      for (let i = 0; i < 6; i++) { const r = new T.Mesh(ribGeo, M.rib); r.position.set(0, 1.55 - i * 0.42, 0); r.rotation.set(Math.PI / 2 + 0.25, 0, Math.PI * 0.025); r.scale.set(1, 0.62, 1); add('ribs', r); ribs.push(r); }
      const ics = []; for (let i = 0; i < 5; i++) { const b = new T.Mesh(keep(new T.CylinderGeometry(1.93, 1.93, 0.3, 48, 1, true, Math.PI * 1.03, Math.PI * 0.94)), M.ic); b.position.set(0, 1.34 - i * 0.42, 0); b.scale.set(1, 1, 0.62); add('intercostals', b); ics.push(b); }
      // diaphragm dome
      const dia = new T.Mesh(keep(new T.SphereGeometry(2.05, 40, 16, 0, Math.PI * 2, 0, Math.PI * 0.42)), M.dia); add('diaphragm', dia);
      // air particles for route tracing / airflow
      const airMat = keep(std(T, 0x2d6cdf)); airMat.emissiveIntensity = 0.4; const airs = Array.from({ length: 10 }, () => { const m = new T.Mesh(keep(new T.SphereGeometry(0.06, 10, 8)), airMat); m.visible = false; world.add(m); return m; });
      const routePts = [top, fork, new T.Vector3(-0.7, 0.75, 0)].concat((() => { let p = new T.Vector3(-0.7, 0.75, 0), d = new T.Vector3(-0.45, -1, 0).normalize(), out = []; for (let depth = 3; depth >= 1; depth--) { const len = 0.42 * Math.pow(0.78, 3 - depth); d = d.clone().applyAxisAngle(new T.Vector3(0, 0, 1), -0.55 * (depth === 3 ? 0.6 : 1)).normalize(); p = p.clone().addScaledVector(d, len); out.push(p); } return out; })());
      const curve = new T.CatmullRomCurve3(routePts);
      // labels
      const LBL = { trachea: [new T.Vector3(0.05, 2.2, 0), 1, 2.35], bronchi: [new T.Vector3(0.45, 0.88, 0), 1, 1.75], lungs: [new T.Vector3(1.6, 0.6, 0), 1, 1.15], ribs: [new T.Vector3(1.85, 0.2, 0.4), 1, 0.55], intercostals: [new T.Vector3(1.86, -0.05, 0.45), 1, -0.05], diaphragm: [new T.Vector3(1.2, -1.35, 0.3), 1, -1.6], bronchioles: [new T.Vector3(-0.95, 0.3, 0), -1, 0.75], alveoli: [sacs[0].position, -1, -0.45] };
      const labels = {};
      Object.entries(LBL).forEach(([k, [a, side, ly]]) => { const sp = S.label(PARTS[k][0], { px: 15 }); world.add(sp); const ln = S.line(new T.Vector3(), new T.Vector3()); world.add(ln); labels[k] = { sp, ln, a, side, ly }; });
      const airLbl = S.label('air in', { px: 16, box: false, ink: '#1d4fa8' }); world.add(airLbl);
      const pLbl = S.label('', { px: 15 }); world.add(pLbl);
      let raf = 0, lastT = 0, disposed = false, b = breathOf(state), clock = 0;
      const mode = () => (phase && phase.mode) || state.mode;
      function placeLabels() {
        Object.values(labels).forEach(L => { const x = L.side * 2.85; const pos = new T.Vector3(x, L.ly, 0.6); L.sp.position.copy(pos); L.ln.geometry.setFromPoints([L.a, new T.Vector3(x - L.side * 0.55, L.ly, 0.6)]); });
        S.scaleLabels(world);
      }
      function pose() {
        // inhale: diaphragm flattens and lowers, ribs rise and swing out, lungs grow
        const sy = 0.6 - 0.4 * b; dia.scale.set(0.95, sy, 0.7); dia.position.y = (-1.25 - 0.3 * b) - 2.05 * sy; // dome top sits just below the lungs and drops as it flattens
        ribs.forEach((r, i) => { r.rotation.x = Math.PI / 2 + 0.25 - 0.18 * b; r.scale.set(1 + 0.05 * b, 0.62 + 0.04 * b, 1); r.position.y = 1.55 - i * 0.42 + 0.08 * b * (i + 1) / 3; });
        ics.forEach((c, i) => { c.position.y = 1.34 - i * 0.42 + 0.08 * b * (i + 1) / 3; c.scale.set(1 + 0.05 * b, 1, 0.62 + 0.04 * b); });
        (parts.lungs || []).forEach(l => l.scale.set(0.95 + 0.07 * b, 1.45 + 0.2 * b, 0.75 + 0.05 * b));
      }
      function applyLook(s) {
        const h = s.highlight; const showL = s.labels !== false && mode() !== 'breathing';
        Object.entries(parts).forEach(([k, ms]) => ms.forEach(m => { const on = !PARTS[h] || h === k; const base = m.material.userData.base ?? 1; m.material.opacity = on ? base : 0.08; m.material.transparent = true; m.material.depthWrite = on && base >= 0.99; m.material.emissiveIntensity = h === k ? 0.35 : 0; }));
        Object.entries(labels).forEach(([k, L]) => { const v = showL ? (!PARTS[h] || h === k) : h === k; L.sp.visible = v; L.ln.visible = v; });
        const br = mode() === 'breathing'; const c = chain(s.target ?? b);
        airLbl.visible = br && s.reveal !== false; if (br) { const L2 = S.label(`air ${c.a}`, { px: 16, box: false, ink: '#1d4fa8' }); airLbl.material = L2.material; airLbl.userData = L2.userData; airLbl.position.set(0.55, 2.55, 0.3); }
        pLbl.visible = br && s.reveal !== false; if (br) { const L3 = S.label(`pressure inside ${c.p}`, { px: 15 }); pLbl.material = L3.material; pLbl.userData = L3.userData; pLbl.position.set(0, -2.35, 0.6); }
        S.scaleLabels(world);
      }
      function fit() { if (!S.size()) return; const t = Math.tan(T.MathUtils.degToRad(camera.fov / 2)); const d = Math.max(2.85 / (0.92 * t), 3.9 / (0.95 * t * camera.aspect)); camera.position.set(0, 0.0, d); camera.lookAt(0, 0.0, 0); placeLabels(); }
      const animating = () => !reduce() && (Math.abs((state.target ?? b) - b) > 0.002 || (state.routeT !== undefined && state.routeT < 1) || mode() === 'breathing');
      function frame(now) {
        raf = 0; if (disposed) return; const dt = lastT ? Math.min(0.05, (now - lastT) / 1000) : 0; lastT = now; clock += dt;
        const tgt = state.target ?? b; b += Math.sign(tgt - b) * Math.min(Math.abs(tgt - b), dt * 0.55); state.breath = b; pose();
        if (state.routeT !== undefined && state.routeT < 1) { state.routeT = Math.min(1, state.routeT + dt * 0.28); airs.forEach((a, i) => { const u = state.routeT - i * 0.035; a.visible = u > 0 && u < 1; if (a.visible) a.position.copy(curve.getPointAt(Math.min(1, u))); }); if (state.routeT >= 1) airs.forEach(a => { a.visible = false; }); }
        if (mode() === 'breathing' && state.reveal !== false) { const moving = Math.abs(tgt - b) > 0.01; airs.forEach((a, i) => { const u = ((clock * 0.45 + i / airs.length) % 1); a.visible = moving; if (moving) a.position.copy(curve.getPointAt(tgt >= 0.5 ? u * 0.35 : 0.35 - u * 0.35)); }); }
        S.render(); if (animating()) raf = requestAnimationFrame(frame); else lastT = 0;
      }
      const kick = () => { if (!raf && animating()) raf = requestAnimationFrame(frame); };
      S.onRotate = () => { state.rx = world.rotation.x; state.ry = world.rotation.y; S.render(); };
      world.rotation.set(typeof state.rx === 'number' ? state.rx : 0.08, typeof state.ry === 'number' ? state.ry : -0.25, 0);
      const ro = new ResizeObserver(() => { fit(); S.render(); }); ro.observe(host);
      function apply(s) { if (reduce()) { b = s.target ?? b; s.breath = b; if (s.routeT !== undefined) s.routeT = 1; } pose(); applyLook(s); S.canvas.setAttribute('aria-label', mode() === 'breathing' ? `Thorax, ${chain(s.target ?? b).phase}.` : 'Breathing system: trachea, bronchi, bronchioles, alveoli, lungs, ribs, intercostal muscles and diaphragm.'); S.render(); kick(); }
      fit(); apply(state);
      return { update(s) { if (!disposed) apply(s); }, visibility(v) { if (!v) { cancelAnimationFrame(raf); raf = 0; } else { S.render(); kick(); } }, dispose() { disposed = true; cancelAnimationFrame(raf); ro.disconnect(); S.dispose(); } };
    }
  };

  /* =============================== alveolus =============================== */
  // One alveolus, cut open to show inside, in a small cluster at the end of a bronchiole. A capillary network wraps it;
  // blood runs dark red (arriving, low O2) → bright red (leaving, O2-rich) with red blood cells. O2 = two blue atoms,
  // CO2 = grey–dark–grey. The diffusion/flow rules (tick) are unchanged from v1, so the readout counts match the lesson.
  // Not modelled on purpose: the moist lining (the AI fact-check relies on the model not showing it).
  const O2C = 0x2d6cdf, C2O = 0x9aa0a8, C2C = 0x2f3237, DARK = new (window.THREE ? window.THREE.Color : Object)(0x6e1423), BRIGHT = new (window.THREE ? window.THREE.Color : Object)(0xd8323b);
  const alveolus = {
    caption: 'Classroom model, not to scale: relative counts, not measurements. Drag to turn.',
    defaults: { wall: 'thin', flow: 'normal', show: 'both', running: true, view: 'close' },
    readout(p, s) {
      const r = s._r || { o2a: 0, o2b: 0, c2a: 0, c2b: 0, moved: 0 };
      const key = `<span style="white-space:nowrap"><b style="color:#2d6cdf">●●</b> O₂ · <b style="color:#9aa0a8">●</b><b style="color:#2f3237">●</b><b style="color:#9aa0a8">●</b> CO₂</span>`;
      return `<p><span class="readout-key">Wall ${s.wall === 'thick' ? 'thick' : 'thin'} · blood flow ${s.flow === 'slow' ? 'slow' : 'normal'} · ${key}</span><span class="readout-value" style="font-size:.85em">O₂ air ${r.o2a} → blood ${r.o2b} · CO₂ blood ${r.c2b} → air ${r.c2a} · O₂ into blood (last 10 s): <b>${r.moved}</b></span></p>`;
    },
    controls(p, s) {
      return `<div class="control-group" role="group" aria-label="Conditions">${btn('Thin wall', 'wall=thin', s.wall !== 'thick')}${btn('Thick wall', 'wall=thick', s.wall === 'thick')}${btn('Normal flow', 'flow=normal', s.flow !== 'slow')}${btn('Slow flow', 'flow=slow', s.flow === 'slow')}</div>`
        + `<div class="control-group" role="group" aria-label="Show">${btn('O₂', 'show=o2', s.show === 'o2')}${btn('CO₂', 'show=co2', s.show === 'co2')}${btn('Both', 'show=both', s.show === 'both')}${btn(s.view === 'cluster' ? 'Zoom in' : 'Zoom out', 'view=' + (s.view === 'cluster' ? 'close' : 'cluster'))}${btn(s.running === false ? 'Run' : 'Pause', 'running=' + (s.running === false), undefined, 'is-primary')}</div>`;
    },
    mount(host, state, phase, ctx) {
      const S = stage(host); if (!S) return null; const { T, world, camera, keep } = S;
      const R = 1.5, HOLE = 0.62, TUBE = 0.15;
      const wallW = () => (state.wall === 'thick' ? 0.24 : 0.035);
      const tissue = (color, o = {}) => keep(new T.MeshPhysicalMaterial({ color, roughness: o.rough ?? 0.55, sheen: 1, sheenRoughness: 0.45, sheenColor: new T.Color(o.sheen ?? 0xffd6dc), transparent: o.opacity !== undefined, opacity: o.opacity ?? 1, depthWrite: o.opacity === undefined, side: o.side ?? T.FrontSide, clearcoat: o.coat ?? 0.15, clearcoatRoughness: 0.5 }));
      // alveolus frame: the cut-open window faces the viewer
      const alvG = new T.Group(); alvG.rotation.set(Math.PI / 2 - 0.42, 0.35, 0); world.add(alvG);
      const shellGeo = keep(new T.SphereGeometry(R, 64, 40, 0, Math.PI * 2, HOLE, Math.PI - HOLE));
      const shell = new T.Mesh(shellGeo, tissue(0xf1b3be, { opacity: 0.5, side: T.DoubleSide })); alvG.add(shell);
      const inner = new T.Mesh(shellGeo, tissue(0xc7697f, { opacity: 0.55, side: T.BackSide })); alvG.add(inner);
      const rimMat = tissue(0xb5546c, { rough: 0.45 }); let rim = null;
      function buildRim() { if (rim) { alvG.remove(rim); rim.geometry.dispose(); } const w = wallW(); rim = new T.Mesh(new T.TorusGeometry(R * Math.sin(HOLE) - w / 2 + 0.02, w / 2 + 0.012, 14, 96), rimMat); rim.rotation.x = Math.PI / 2; rim.position.y = R * Math.cos(HOLE); alvG.add(rim); inner.scale.setScalar((R - w) / R); }
      // bronchiole and alveolar duct into the top
      const duct = new T.Mesh(keep(new T.CylinderGeometry(0.36, 0.48, 1.6, 28, 1, true)), tissue(0xe8d3b0, { rough: 0.6, opacity: 0.85, side: T.DoubleSide, sheen: 0xfff2dc }));
      duct.position.set(-0.35, R + 0.55, -0.35); duct.rotation.z = 0.25; world.add(duct);
      // neighbouring alveoli: the cluster that gives a large total surface area
      const nbMat = tissue(0xf0aab8, { opacity: 0.55 }); const capThin = tissue(0xa32a3a, { rough: 0.4, opacity: 0.55, sheen: 0xff9a9a });
      const nbs = []; let seed = 7; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
      for (let i = 0; i < 26; i++) {
        const a = i * 2.39996, ring = i < 9 ? 1 : i < 18 ? 1.6 : 2.2, r0 = 0.6 + rnd() * 0.3;
        const pos = new T.Vector3(Math.cos(a) * (R + 1.1) * ring, -0.2 + Math.sin(a) * 1.35 * ring, -2.3 - ring * 0.9 - rnd() * 0.6);
        const nb = new T.Mesh(keep(new T.SphereGeometry(r0, 28, 20)), nbMat); nb.position.copy(pos); world.add(nb); nbs.push(nb);
        for (let k = 0; k < 3; k++) { const c = new T.Mesh(keep(new T.TorusGeometry(r0 * 1.01, 0.018, 6, 48)), capThin); c.position.copy(pos); c.rotation.set(rnd() * 3, rnd() * 3, 0); world.add(c); }
      }
      // capillary network: one main vessel (blood path for the model) plus linking vessels
      const capR = () => R + wallW() + TUBE * 0.95;
      const sph = (r, th, ph) => new T.Vector3(r * Math.sin(th) * Math.cos(ph), r * Math.cos(th), r * Math.sin(th) * Math.sin(ph));
      const mainPts = t => sph(capR(), HOLE + 0.78 + 0.42 * Math.sin(t * Math.PI * 6), -0.4 + t * Math.PI * 1.9);
      let mainCurve = null, capMesh = null; const linkMeshes = [];
      const capMat = keep(new T.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.35, clearcoat: 0.4, sheen: 0.6, sheenColor: new T.Color(0xff9090), transparent: true, opacity: 0.88 }));
      const linkMat = tissue(0x9e2a3a, { rough: 0.4, opacity: 0.78, sheen: 0xff9a9a });
      function buildCaps() {
        if (capMesh) { alvG.remove(capMesh); capMesh.geometry.dispose(); } linkMeshes.forEach(m => { alvG.remove(m); m.geometry.dispose(); }); linkMeshes.length = 0;
        mainCurve = new T.CatmullRomCurve3(Array.from({ length: 90 }, (_, i) => mainPts(i / 89)));
        const g = new T.TubeGeometry(mainCurve, 360, TUBE, 14, false), n = g.attributes.position.count, cols = [];
        for (let i = 0; i < n; i++) { const t = Math.floor(i / 15) / 360; const c = DARK.clone().lerp(BRIGHT, Math.min(1, t * 1.15)); cols.push(c.r, c.g, c.b); }
        g.setAttribute('color', new T.Float32BufferAttribute(cols, 3)); capMesh = new T.Mesh(g, capMat); alvG.add(capMesh);
        const rr = capR() - 0.02;
        [[HOLE + 1.55, 0], [HOLE + 2.0, 0.6], [HOLE + 2.35, 1.3]].forEach(([th, off]) => { const c = new T.CatmullRomCurve3(Array.from({ length: 60 }, (_, i) => sph(rr, th + 0.12 * Math.sin(i * 0.5 + off), i / 59 * Math.PI * 2)), true); const m = new T.Mesh(new T.TubeGeometry(c, 160, TUBE * 0.6, 10, true), linkMat); alvG.add(m); linkMeshes.push(m); });
        for (let k = 0; k < 7; k++) { const ph = k * 0.9 + 0.2; const c = new T.CatmullRomCurve3(Array.from({ length: 20 }, (_, i) => sph(rr, HOLE + 0.5 + i / 19 * 1.95, ph + 0.2 * Math.sin(i * 0.6)))); const m = new T.Mesh(new T.TubeGeometry(c, 60, TUBE * 0.5, 8, false), linkMat); alvG.add(m); linkMeshes.push(m); }
      }
      // red blood cells (biconcave discs) carried along the main vessel
      const rbcGeo = keep(new T.LatheGeometry([[0, 0.028], [0.05, 0.034], [0.09, 0.05], [0.115, 0.04], [0.125, 0], [0.115, -0.04], [0.09, -0.05], [0.05, -0.034], [0, -0.028]].map(([x, y]) => new T.Vector2(x, y)), 24));
      const rbcs = Array.from({ length: 12 }, (_, i) => { const m = new T.Mesh(rbcGeo, keep(new T.MeshPhysicalMaterial({ color: 0x8a1c2a, roughness: 0.4, clearcoat: 0.5 }))); m.userData.t = i / 12; alvG.add(m); return m; });
      // molecules
      const atom = r => keep(new T.SphereGeometry(r, 14, 10));
      const aO = atom(0.062), aC = atom(0.058);
      const mO2 = keep(new T.MeshPhysicalMaterial({ color: O2C, roughness: 0.3, clearcoat: 0.6, emissive: new T.Color(O2C), emissiveIntensity: 0.18 }));
      const mCO = keep(new T.MeshPhysicalMaterial({ color: C2O, roughness: 0.35, clearcoat: 0.5 })), mCC = keep(new T.MeshPhysicalMaterial({ color: C2C, roughness: 0.35, clearcoat: 0.5 }));
      const molecule = gas => { const g = new T.Group(); if (gas === 'o2') { [-0.052, 0.052].forEach(x => { const a = new T.Mesh(aO, mO2); a.position.x = x; g.add(a); }); } else { [-0.1, 0.1].forEach(x => { const a = new T.Mesh(aO, mCO); a.position.x = x; g.add(a); }); g.add(new T.Mesh(aC, mCC)); } g.rotation.set(rnd() * 6, rnd() * 6, rnd() * 6); g.userData.spin = new T.Vector3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).multiplyScalar(1.4); return g; };
      // labels at the sides with leader lines (world space)
      const LBL = []; const mk = (text, side, ly, anchor, o = {}) => { const sp = S.label(text, { px: 14, ...o }); world.add(sp); const ln = S.line(new T.Vector3(), new T.Vector3()); world.add(ln); const L = { sp, ln, side, ly, anchor }; LBL.push(L); return L; };
      const wp = v => alvG.localToWorld(v.clone());
      const lAir = mk('alveolus (air inside)', -1, 0.35, () => wp(new T.Vector3(0, -0.35, 0)));
      const lBro = mk('bronchiole: air in and out', -1, 2.15, () => new T.Vector3(-0.45, R + 1.0, -0.35));
      const lWall = mk('wall: one cell thick', -1, -1.05, () => wp(new T.Vector3(-R * Math.sin(HOLE), R * Math.cos(HOLE), 0)));
      const lIn = mk('blood arrives: low O₂', 1, 1.55, () => wp(mainCurve.getPointAt(0.02)), { ink: '#6e1423' });
      const lOut = mk('blood leaves: O₂-rich', 1, -1.25, () => wp(mainCurve.getPointAt(0.97)), { ink: '#b3202c' });
      const lRbc = mk('red blood cell', 1, 0.15, () => wp(rbcs[3].position));
      const lMany = mk('hundreds of millions of alveoli → huge total surface area', 1, 2.3, () => nbs[9].position.clone(), { px: 15 }); lMany.side = 0;
      const COLX = 3.25;
      function placeLabels() {
        const cl = state.view === 'cluster'; world.updateMatrixWorld(true); S.scaleLabels(world);
        const room = S.W >= 520; // side labels need a wide canvas; hidden when a drawer narrows it
        LBL.forEach(L => { const show = L === lMany ? cl : (!cl && room); L.sp.visible = show; L.ln.visible = show && L !== lMany; if (!show) return; const a = L.anchor(); if (L === lMany) { L.sp.position.set(0, 3.6, 0.5); return; } const x = L.side * COLX; L.sp.position.set(x, L.ly, 0.9); L.end = new T.Vector3(x - L.side * (0.08 + L.sp.scale.x / 2), L.ly, 0.9); L.ln.geometry.setFromPoints([a, L.end]); });
        S.scaleLabels(world);
      }
      // particles and the unchanged model rules
      const P = [];
      function airPos() { let q; do { q = new T.Vector3((rnd() - .5) * 2, (rnd() - .5) * 2, (rnd() - .5) * 2).multiplyScalar(R * 0.8); } while (q.length() > (R - wallW()) * 0.82); return q; }
      function bloodPos(a) { const t = Math.min(0.999, Math.max(0, a / (Math.PI * 2))); const c = mainCurve.getPointAt(t); const j = new T.Vector3((rnd() - .5), (rnd() - .5), (rnd() - .5)).multiplyScalar(TUBE * 0.7); return c.add(j); }
      function place(p, snap) { const to = p.where === 'air' ? airPos() : bloodPos(p.ang); if (snap) { p.m.position.copy(to); p.move = 0; } else { p.from.copy(p.m.position); p.to.copy(to); p.move = 1; } }
      const make = (gas, where) => { const m = molecule(gas); alvG.add(m); const p = { gas, where, m, ang: rnd() * Math.PI * 2, move: 0, from: new T.Vector3(), to: new T.Vector3() }; place(p, true); P.push(p); return p; };
      buildRim(); buildCaps();
      for (let i = 0; i < 26; i++) make('o2', 'air'); for (let i = 0; i < 6; i++) make('o2', 'blood');
      for (let i = 0; i < 4; i++) make('co2', 'air'); for (let i = 0; i < 20; i++) make('co2', 'blood');
      let raf = 0, lastT = 0, disposed = false, acc = 0, zoom = state.view === 'cluster' ? 1 : 0, builtWall = state.wall; const movedLog = [];
      const count = (g, w) => P.filter(p => p.gas === g && p.where === w).length;
      function tick() { // one model step (0.2 s); rules as v1
        const k = state.wall === 'thick' ? 0.006 : 0.06, flow = state.flow === 'slow' ? 0.12 : 0.6;
        const o2a = count('o2', 'air') - P.filter(p => p.hidden).length, o2b = count('o2', 'blood'), c2a = count('co2', 'air'), c2b = count('co2', 'blood');
        const cross = (g, fromW, toW, nFrom, nTo) => { const exp = Math.max(0, (nFrom - nTo) * k), net = Math.floor(exp) + (rnd() < exp % 1 ? 1 : 0); let moved = 0; for (const p of P) { if (moved >= net) break; if (p.gas === g && p.where === fromW && p.move === 0 && !p.hidden) { p.where = toW; if (toW === 'blood') p.ang = rnd() * Math.PI * 0.2; place(p, false); moved++; } } return moved; };
        const m1 = cross('o2', 'air', 'blood', o2a, o2b); cross('co2', 'blood', 'air', c2b, c2a);
        movedLog.push(m1); if (movedLog.length > 50) movedLog.shift();
        P.forEach(p => { if (p.where !== 'blood') return; p.ang += flow * 0.2 * 0.9; if (p.ang > Math.PI * 1.95) { if (p.gas === 'o2') { p.where = 'air'; p.m.visible = false; p.hidden = true; } p.ang = 0.05; } if (p.move === 0) p.m.position.copy(bloodPos(p.ang)); });
        P.forEach(p => { if (p.hidden && rnd() < 0.5) { p.hidden = false; p.m.visible = true; place(p, true); } });
        P.filter(p => p.gas === 'co2' && p.where === 'air').forEach(p => { if (rnd() < 0.06) { p.where = 'blood'; p.ang = 0.05; place(p, true); } });
        state._r = { o2a: count('o2', 'air') - P.filter(p => p.hidden).length, o2b: count('o2', 'blood'), c2a: count('co2', 'air'), c2b: count('co2', 'blood'), moved: movedLog.reduce((a, b) => a + b, 0) };
      }
      function vis() {
        if (builtWall !== state.wall) { builtWall = state.wall; buildRim(); buildCaps(); P.forEach(p => place(p, true)); }
        P.forEach(p => { if (p.hidden) return; p.m.visible = state.show === 'both' || state.show === p.gas; });
        const L2 = S.label(state.wall === 'thick' ? 'thicker barrier: longer distance' : 'wall: one cell thick', { px: 14, ink: state.wall === 'thick' ? '#7a2232' : '#182944' }); lWall.sp.material = L2.material; lWall.sp.userData = L2.userData;
        placeLabels();
      }
      function placeCam() { const t = Math.tan(T.MathUtils.degToRad(camera.fov / 2)); const base = Math.max(2.55 / (0.92 * t), 4.25 / (0.96 * t * camera.aspect)); const e = zoom * zoom * (3 - 2 * zoom); const d = base * (1 + 0.85 * e); camera.position.set(0, 0.55 + 0.3 * e, d); camera.lookAt(0, 0.05 + 0.1 * e, -1.6 * e); }
      function fit() { if (!S.size()) return; placeCam(); placeLabels(); }
      const animating = () => !reduce() && (state.running !== false || Math.abs((state.view === 'cluster' ? 1 : 0) - zoom) > 0.001);
      function frame(now) {
        raf = 0; if (disposed) return; const dt = lastT ? Math.min(0.05, (now - lastT) / 1000) : 0; lastT = now;
        const zt = state.view === 'cluster' ? 1 : 0; if (zoom !== zt) { zoom += Math.sign(zt - zoom) * Math.min(Math.abs(zt - zoom), dt * 0.9); placeCam(); placeLabels(); }
        if (state.running !== false) {
          acc += dt; while (acc > 0.2) { acc -= 0.2; tick(); }
          const sp = state.flow === 'slow' ? 0.012 : 0.06;
          rbcs.forEach(m => { m.userData.t = (m.userData.t + dt * sp) % 1; const t = m.userData.t; m.position.copy(mainCurve.getPointAt(t)); m.lookAt(alvG.worldToLocal(new T.Vector3()).lerp(m.position, 2)); m.material.color.copy(DARK).lerp(BRIGHT, Math.min(1, t * 1.15)).multiplyScalar(0.85); });
          P.forEach(p => { p.m.rotation.x += p.m.userData.spin.x * dt; p.m.rotation.y += p.m.userData.spin.y * dt; if (p.move > 0) { p.move = Math.max(0, p.move - dt * 2.5); p.m.position.lerpVectors(p.to, p.from, p.move); } else if (p.where === 'air' && !p.hidden) { p.m.position.add(new T.Vector3((rnd() - .5) * dt * .4, (rnd() - .5) * dt * .4, (rnd() - .5) * dt * .4)); if (p.m.position.length() > (R - wallW()) * 0.84) p.m.position.multiplyScalar(0.97); } });
          if (ctx && ctx.refresh && Math.floor(now / 1000) !== Math.floor((now - dt * 1000) / 1000)) ctx.refresh();
          if (lRbc.ln.visible && lRbc.end) lRbc.ln.geometry.setFromPoints([wp(rbcs[3].position), lRbc.end]);
        }
        S.render(); if (animating()) raf = requestAnimationFrame(frame); else lastT = 0;
      }
      const kick = () => { if (!raf && animating()) raf = requestAnimationFrame(frame); };
      S.onRotate = () => { state.rx = world.rotation.x; state.ry = world.rotation.y; placeLabels(); S.render(); };
      world.rotation.set(typeof state.rx === 'number' ? state.rx : 0.12, typeof state.ry === 'number' ? state.ry : 0, 0);
      const ro = new ResizeObserver(() => { fit(); S.render(); }); ro.observe(host);
      rbcs.forEach(m => m.position.copy(mainCurve.getPointAt(m.userData.t)));
      if (reduce()) { for (let i = 0; i < 40; i++) tick(); zoom = state.view === 'cluster' ? 1 : 0; }
      world.updateMatrixWorld(true); fit(); vis(); tick(); S.render(); kick();
      S.canvas.setAttribute('aria-label', 'An alveolus cut open, in a cluster of alveoli, wrapped by capillaries with red blood cells. Blue two-atom oxygen molecules move net from alveolus air into the blood; grey three-atom carbon dioxide molecules move net from the blood into the air. Blood arrives dark red and leaves bright red.');
      return { update(s) { if (disposed) return; vis(); S.render(); kick(); }, visibility(v) { if (!v) { cancelAnimationFrame(raf); raf = 0; } else { S.render(); kick(); } }, dispose() { disposed = true; cancelAnimationFrame(raf); ro.disconnect(); S.dispose(); } };
    }
  };

  window.LessonModels.thorax = thorax;
  window.LessonModels.alveolus = alveolus;
})();
