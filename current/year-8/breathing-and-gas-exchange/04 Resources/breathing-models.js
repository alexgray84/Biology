/* Year 8 breathing and gas exchange: local Three.js (r160, global THREE) schematic models. Original geometry.
   No network, no storage. Animation stops with prefers-reduced-motion (end states instead).
   thorax    State {breath: 0 (out) … 1 (in), target, highlight, labels, route}. Airway: trachea → bronchi → bronchioles → alveoli.
             Inhale: diaphragm contracts and flattens; external intercostals contract, ribs up/out; volume ↑; pressure inside < outside; air in.
             Quiet exhale: muscles relax, diaphragm domes, ribs down/in, elastic recoil; volume ↓; pressure inside > outside; air out.
   alveolus  Classroom particle model of one alveolus and its capillary. O2 and CO2 each diffuse net from higher to lower
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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)); renderer.outputColorSpace = T.SRGBColorSpace; renderer.setClearColor(0, 0);
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
  const alveolus = {
    caption: 'Classroom particle model: relative counts, not measurements. Drag to turn.',
    defaults: { wall: 'thin', flow: 'normal', show: 'both', running: true },
    readout(p, s) {
      const r = s._r || { o2a: 0, o2b: 0, c2a: 0, c2b: 0, moved: 0 };
      return `<p><span class="readout-key">Wall ${s.wall === 'thick' ? 'thick' : 'thin'} · blood flow ${s.flow === 'slow' ? 'slow' : 'normal'}</span><span class="readout-value" style="font-size:.85em">O₂ air ${r.o2a} → blood ${r.o2b} · CO₂ blood ${r.c2b} → air ${r.c2a} · O₂ into blood (last 10 s): <b>${r.moved}</b></span></p>`;
    },
    controls(p, s) {
      return `<div class="control-group" role="group" aria-label="Conditions">${btn('Thin wall', 'wall=thin', s.wall !== 'thick')}${btn('Thick wall', 'wall=thick', s.wall === 'thick')}${btn('Normal flow', 'flow=normal', s.flow !== 'slow')}${btn('Slow flow', 'flow=slow', s.flow === 'slow')}</div>`
        + `<div class="control-group" role="group" aria-label="Show">${btn('O₂', 'show=o2', s.show === 'o2')}${btn('CO₂', 'show=co2', s.show === 'co2')}${btn('Both', 'show=both', s.show === 'both')}${btn(s.running === false ? 'Run' : 'Pause', 'running=' + (s.running === false), undefined, 'is-primary')}</div>`;
    },
    mount(host, state, phase, ctx) {
      const S = stage(host); if (!S) return null; const { T, world, camera, keep } = S;
      const R = 1.5, RING = 1.62, TUBE = 0.32;
      const alv = new T.Mesh(keep(new T.SphereGeometry(R, 40, 30)), keep(std(T, 0xf3b9c4, { opacity: 0.22, side: T.DoubleSide }))); world.add(alv);
      const wallMesh = new T.Mesh(keep(new T.SphereGeometry(R, 40, 30)), keep(std(T, 0xc76a8a, { opacity: 0.35, side: T.BackSide }))); world.add(wallMesh);
      const neck = new T.Mesh(keep(new T.CylinderGeometry(0.32, 0.42, 1.3, 20, 1, true)), keep(std(T, 0xe9d7b8, { opacity: 0.6, side: T.DoubleSide }))); neck.position.y = R + 0.45; world.add(neck);
      // capillary: torus with blue (arriving) → red (leaving) vertex colours
      const capGeo = keep(new T.TorusGeometry(RING, TUBE, 18, 120)); const cols = []; const pa = capGeo.attributes.position, v = new T.Vector3();
      for (let i = 0; i < pa.count; i++) { v.fromBufferAttribute(pa, i); let a = Math.atan2(v.y, v.x); if (a < 0) a += 2 * Math.PI; const t = a / (2 * Math.PI); const c = new T.Color(0x3b5bbf).lerp(new T.Color(0xc0392b), t); cols.push(c.r, c.g, c.b); }
      capGeo.setAttribute('color', new T.Float32BufferAttribute(cols, 3));
      const cap = new T.Mesh(capGeo, keep(new T.MeshStandardMaterial({ vertexColors: true, transparent: true, opacity: 0.55, depthWrite: false, roughness: 0.5 }))); cap.rotation.x = Math.PI / 2; world.add(cap);
      const L = (t, pos, o) => { const sp = S.label(t, o); sp.position.copy(pos); world.add(sp); return sp; };
      L('alveolus (air)', new T.Vector3(-0.2, 0.55, 0.2), { px: 15 }); L('capillary (blood)', new T.Vector3(1.75, -0.95, 0.6), { px: 15 });
      L('blood arrives', new T.Vector3(1.95, 0.25, 0.9), { px: 13, box: false, ink: '#3b5bbf' }); L('blood leaves', new T.Vector3(1.95, 0.25, -0.9), { px: 13, box: false, ink: '#c0392b' });
      L('air from bronchiole', new T.Vector3(0.95, R + 1.0, 0), { px: 13, box: false });
      const thick = S.label('', { px: 13, box: false }); thick.position.set(-1.9, -0.5, 0.6); world.add(thick);
      // particles
      const o2Mat = keep(std(T, 0x2d6cdf)); o2Mat.emissiveIntensity = 0.35; const c2Mat = keep(std(T, 0x6b6f78));
      const pg = keep(new T.SphereGeometry(0.075, 10, 8));
      let seed = 7; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
      const P = [];
      const make = (gas, where) => { const m = new T.Mesh(pg, gas === 'o2' ? o2Mat : c2Mat); world.add(m); const p = { gas, where, m, ang: rnd() * Math.PI * 2, move: 0, from: new T.Vector3(), to: new T.Vector3() }; place(p, true); P.push(p); return p; };
      function airPos() { let q; do { q = new T.Vector3((rnd() - .5) * 2, (rnd() - .5) * 2, (rnd() - .5) * 2).multiplyScalar(R * 0.85); } while (q.length() > R * 0.85); return q; }
      function bloodPos(a) { const j = (rnd() - .5) * TUBE * 0.9; return new T.Vector3((RING + j) * Math.cos(a), (rnd() - .5) * TUBE * 0.9, (RING + j) * Math.sin(a)); }
      function place(p, snap) { const to = p.where === 'air' ? airPos() : bloodPos(p.ang); if (snap) { p.m.position.copy(to); p.move = 0; } else { p.from.copy(p.m.position); p.to.copy(to); p.move = 1; } }
      for (let i = 0; i < 26; i++) make('o2', 'air'); for (let i = 0; i < 6; i++) make('o2', 'blood');
      for (let i = 0; i < 4; i++) make('co2', 'air'); for (let i = 0; i < 20; i++) make('co2', 'blood');
      let raf = 0, lastT = 0, disposed = false, acc = 0; const movedLog = [];
      const count = (g, w) => P.filter(p => p.gas === g && p.where === w).length;
      function tick() { // one model step (0.2 s)
        const k = state.wall === 'thick' ? 0.006 : 0.06, flow = state.flow === 'slow' ? 0.12 : 0.6;
        const o2a = count('o2', 'air') - P.filter(p => p.hidden).length, o2b = count('o2', 'blood'), c2a = count('co2', 'air'), c2b = count('co2', 'blood');
        // diffusion: net movement down each gradient (more particles on one side → more crossings that way)
        const cross = (g, fromW, toW, nFrom, nTo) => { const exp = Math.max(0, (nFrom - nTo) * k), net = Math.floor(exp) + (rnd() < exp % 1 ? 1 : 0); let moved = 0; for (const p of P) { if (moved >= net) break; if (p.gas === g && p.where === fromW && p.move === 0 && !p.hidden) { p.where = toW; if (toW === 'blood') p.ang = rnd() * Math.PI * 0.2; place(p, false); moved++; } } return moved; };
        const m1 = cross('o2', 'air', 'blood', o2a, o2b); cross('co2', 'blood', 'air', c2b, c2a);
        movedLog.push(m1); if (movedLog.length > 50) movedLog.shift();
        // blood flow: blood particles travel round; at the far end they leave and fresh blood (low O2, high CO2) arrives
        P.forEach(p => { if (p.where !== 'blood') return; p.ang += flow * 0.2 * 0.9; if (p.ang > Math.PI * 1.95) { if (p.gas === 'o2') { p.where = 'air'; p.m.visible = false; p.hidden = true; } p.ang = 0.05; } if (p.move === 0) p.m.position.copy(bloodPos(p.ang)); });
        // ventilation keeps alveolar air O2-rich and removes CO2; returning O2 particles reappear as fresh air
        P.forEach(p => { if (p.hidden && rnd() < 0.5) { p.hidden = false; p.m.visible = true; place(p, true); } });
        P.filter(p => p.gas === 'co2' && p.where === 'air').forEach(p => { if (rnd() < 0.06) { p.where = 'blood'; p.ang = 0.05; place(p, true); } });
        state._r = { o2a: count('o2', 'air') - P.filter(p => p.hidden).length, o2b: count('o2', 'blood'), c2a: count('co2', 'air'), c2b: count('co2', 'blood'), moved: movedLog.reduce((a, b) => a + b, 0) };
      }
      function vis() { P.forEach(p => { if (p.hidden) return; p.m.visible = state.show === 'both' || state.show === p.gas; }); thick.visible = state.wall === 'thick'; const t2 = S.label(state.wall === 'thick' ? 'thicker barrier: longer diffusion distance' : '', { px: 13, box: false, ink: '#7a2232' }); thick.material = t2.material; thick.userData = t2.userData; wallMesh.material.opacity = state.wall === 'thick' ? 0.75 : 0.35; S.scaleLabels(world); }
      function fit() { if (!S.size()) return; const t = Math.tan(T.MathUtils.degToRad(camera.fov / 2)); const d = Math.max(2.6 / (0.9 * t), 2.9 / (0.9 * t * camera.aspect)); camera.position.set(0, 1.2, d); camera.lookAt(0, 0.2, 0); S.scaleLabels(world); }
      const animating = () => state.running !== false && !reduce();
      function frame(now) {
        raf = 0; if (disposed) return; const dt = lastT ? Math.min(0.05, (now - lastT) / 1000) : 0; lastT = now; acc += dt;
        while (acc > 0.2) { acc -= 0.2; tick(); }
        P.forEach(p => { if (p.move > 0) { p.move = Math.max(0, p.move - dt * 2.5); p.m.position.lerpVectors(p.to, p.from, p.move); } else if (p.where === 'air' && !p.hidden) { p.m.position.add(new T.Vector3((rnd() - .5) * dt * .4, (rnd() - .5) * dt * .4, (rnd() - .5) * dt * .4)); if (p.m.position.length() > R * 0.88) p.m.position.multiplyScalar(0.97); } });
        if (ctx && ctx.refresh && Math.floor(now / 1000) !== Math.floor((now - dt * 1000) / 1000)) ctx.refresh();
        S.render(); if (animating()) raf = requestAnimationFrame(frame); else lastT = 0;
      }
      const kick = () => { if (!raf && animating()) raf = requestAnimationFrame(frame); };
      S.onRotate = () => { state.rx = world.rotation.x; state.ry = world.rotation.y; S.render(); };
      world.rotation.set(typeof state.rx === 'number' ? state.rx : 0.25, typeof state.ry === 'number' ? state.ry : 0, 0);
      const ro = new ResizeObserver(() => { fit(); S.render(); }); ro.observe(host);
      if (reduce()) for (let i = 0; i < 40; i++) tick();
      fit(); vis(); tick(); S.render(); kick();
      S.canvas.setAttribute('aria-label', 'One alveolus wrapped by a capillary. Blue oxygen particles move net from alveolar air into blood; grey carbon dioxide particles move net from blood into alveolar air.');
      return { update(s) { if (disposed) return; vis(); S.render(); kick(); }, visibility(v) { if (!v) { cancelAnimationFrame(raf); raf = 0; } else { S.render(); kick(); } }, dispose() { disposed = true; cancelAnimationFrame(raf); ro.disconnect(); S.dispose(); } };
    }
  };

  window.LessonModels.thorax = thorax;
  window.LessonModels.alveolus = alveolus;
})();
