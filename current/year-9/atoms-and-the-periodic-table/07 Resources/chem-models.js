/* Year 9 chemistry: local Three.js (r160, global THREE) schematic models. Original geometry; no network, no storage.
   shellAtom  first-20 shell model. State {z, mass, labels, reveal, spin}. Electrons fill 2, 8, 8, 2.
              Period = occupied shells; group = outer electrons (Group 0 when the outer shell is full: He, Ne, Ar).
              Shells are energy levels, drawn as rings: not paths or to scale.
   alkali     lithium, sodium and potassium on water. State {metal, running}. Animation of the standard teacher-
              demonstration observations (RSC): Li floats, steady fizzing, gentle movement; Na floats, more vigorous
              fizzing, rapid movement, melts into a ball; K very rapid, lilac flame. Not a recording and not class data.
   Animation stops with prefers-reduced-motion (static end views instead). */
window.LessonModels = window.LessonModels || {};
(() => {
  const reduce = () => !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const btn = (label, value, pressed, cls = '') => `<button type="button"${cls ? ` class="${cls}"` : ''} data-action="model" data-value="${value}"${pressed === undefined ? '' : ` aria-pressed="${pressed}"`}>${label}</button>`;
  const NAMES = ['', 'Hydrogen', 'Helium', 'Lithium', 'Beryllium', 'Boron', 'Carbon', 'Nitrogen', 'Oxygen', 'Fluorine', 'Neon', 'Sodium', 'Magnesium', 'Aluminium', 'Silicon', 'Phosphorus', 'Sulfur', 'Chlorine', 'Argon', 'Potassium', 'Calcium'];
  const SYM = ['', 'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca'];
  const MASS = [0, 1, 4, 7, 9, 11, 12, 14, 16, 19, 20, 23, 24, 27, 28, 31, 32, 35, 40, 39, 40];
  const ISO = { 1: [1, 2, 3], 3: [6, 7], 5: [10, 11], 6: [12, 13, 14], 8: [16, 17, 18], 10: [20, 22], 12: [24, 25, 26], 17: [35, 37], 20: [40, 42] };
  const CAP = [2, 8, 8, 2];
  const config = z => { const out = []; let left = z; for (const c of CAP) { if (left <= 0) break; out.push(Math.min(c, left)); left -= c; } return out; };
  const groupOf = z => { const c = config(z), o = c[c.length - 1]; if (z === 2 || z === 10 || z === 18) return 'Group 0 (18)'; if (o <= 2) return `Group ${o}`; return `Group ${o} (${o + 10} in 1–18 numbering)`; };
  const zOf = s => Math.max(1, Math.min(20, Math.round(+s.z || 11)));
  const massOf = s => { const z = zOf(s), m = Math.round(+s.mass || 0); return m >= z ? m : MASS[z]; };

  /* ---------- shared rendering helpers ---------- */
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
      sp.userData.aspect = w / h; sp.userData.px = o.px || 18; return sp;
    }
    function scaleLabels(group) { // constant on-screen size
      const dist = camera.position.length(), unit = (2 * dist * Math.tan(T.MathUtils.degToRad(camera.fov / 2))) / H;
      group.traverse(o => { if (o.isSprite && o.userData.aspect) { const hh = o.userData.px * 1.5 * unit; o.scale.set(hh * o.userData.aspect, hh, 1); } });
    }
    let last = null; const clampX = x => Math.max(-0.9, Math.min(0.9, x));
    const onDown = e => { if (e.button !== undefined && e.button !== 0) return; last = [e.clientX, e.clientY]; try { canvas.setPointerCapture(e.pointerId); } catch (_) { /* */ } };
    const onMove = e => { if (!last) return; world.rotation.y += (e.clientX - last[0]) * 0.008; world.rotation.x = clampX(world.rotation.x + (e.clientY - last[1]) * 0.008); last = [e.clientX, e.clientY]; api.onRotate(); };
    const onUp = () => { last = null; };
    const onKey = e => { if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) return; e.preventDefault(); e.stopPropagation(); world.rotation.y += e.key === 'ArrowLeft' ? -0.15 : e.key === 'ArrowRight' ? 0.15 : 0; world.rotation.x = clampX(world.rotation.x + (e.key === 'ArrowUp' ? -0.12 : e.key === 'ArrowDown' ? 0.12 : 0)); api.onRotate(); };
    canvas.addEventListener('pointerdown', onDown); canvas.addEventListener('pointermove', onMove); canvas.addEventListener('pointerup', onUp); canvas.addEventListener('pointercancel', onUp); canvas.addEventListener('keydown', onKey);
    const api = {
      T, renderer, scene, camera, world, keep, label, scaleLabels, canvas, size, get W() { return W; }, get H() { return H; }, onRotate() {},
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
  const std = (T, color, o = {}) => new T.MeshStandardMaterial({ color, roughness: o.rough ?? 0.4, metalness: o.metal ?? 0.02, transparent: o.opacity !== undefined, opacity: o.opacity ?? 1, depthWrite: o.opacity === undefined, emissive: new T.Color(o.emissive ?? 0x000000), emissiveIntensity: o.ei ?? 0 });

  /* =============================== shellAtom =============================== */
  const shellAtom = {
    caption: 'Shell model: shells are energy levels, drawn as rings. Not to scale. Drag to rotate.',
    defaults: { z: 11, mass: 0, labels: true, reveal: true, spin: true },
    readout(p, s) {
      const z = zOf(s), c = config(z), m = massOf(s), n = m - z;
      const head = `${NAMES[z]} (${SYM[z]}) · atomic number ${z}${p && p.showMass ? ` · mass number ${m}` : ''}`;
      if (s.reveal === false) return `<p><span class="readout-key">${head}</span><span class="readout-value" style="font-size:.9em">Work it out, then press <b>Show answers</b>.</span></p>`;
      const nuc = p && p.showMass ? ` · nucleus: ${z} p, ${n} n` : '';
      return `<p><span class="readout-key">${head}${nuc}</span><span class="readout-value" style="font-size:.95em">${z} electrons → <b>${c.join(',')}</b> · ${c.length} shells → <b>period ${c.length}</b> · ${c[c.length - 1]} outer → <b>${groupOf(z)}</b></span></p>`;
    },
    controls(p, s) {
      const z = zOf(s), opt = (v, l, sel) => `<option value="${v}"${sel ? ' selected' : ''}>${l}</option>`;
      const list = (p && p.elements) || Array.from({ length: 20 }, (_, i) => i + 1);
      const el = `<label class="control-label" for="atom-z">Element</label><select id="atom-z" class="cell-select" data-model-key="z">${list.map(k => opt(k, `${k} · ${NAMES[k]}`, k === z)).join('')}</select>`;
      const iso = p && p.showMass && ISO[z] ? `<label class="control-label" for="atom-m">Mass</label><select id="atom-m" class="cell-select" data-model-key="mass">${ISO[z].map(m => opt(m, `${SYM[z]}-${m}`, m === massOf(s))).join('')}</select>` : '';
      return `<div class="control-group" role="group" aria-label="Atom">${el}${iso}${btn(s.reveal === false ? 'Show answers' : 'Hide answers', 'reveal=' + (s.reveal === false), undefined, 'is-primary')}${btn(s.spin === false ? 'Spin' : 'Pause', 'spin=' + (s.spin === false))}</div>`;
    },
    onChange(k, s) { if (k === 'z') s.mass = 0; },
    mount(host, state, phase) {
      const S = stage(host); if (!S) return null; const { T, world, camera, keep } = S;
      const R = [1.25, 2.05, 2.85, 3.6];
      const geo = { s: keep(new T.SphereGeometry(1, 24, 18)), ring: R.map(r => keep(new T.TorusGeometry(r, 0.018, 8, 140))) };
      const mats = { p: keep(std(T, 0xc0485a)), n: keep(std(T, 0x9aa1ab)), e: keep(std(T, 0x2d6cdf, { emissive: 0x2d6cdf, ei: 0.25 })), ring: keep(std(T, 0x182944, { opacity: 0.55 })), outer: keep(std(T, 0xd8a22a, { emissive: 0xd8a22a, ei: 0.4 })) };
      let atom = null, electrons = [], raf = 0, lastT = 0, disposed = false, built = '';
      function build(s) {
        const z = zOf(s), m = massOf(s), key = z + ':' + m + ':' + (s.reveal !== false) + ':' + (s.labels !== false); if (key === built) return; built = key;
        if (atom) world.remove(atom); atom = new T.Group(); world.add(atom); electrons = [];
        // nucleus: protons and neutrons packed on a small fibonacci ball
        const total = m, rN = 0.16 * Math.cbrt(total) + 0.1, golden = Math.PI * (3 - Math.sqrt(5));
        for (let i = 0; i < total; i++) {
          const y = total === 1 ? 0 : 1 - (i / (total - 1)) * 2, r = Math.sqrt(1 - y * y), th = golden * i, depth = 0.55 + 0.45 * ((i * 7) % 5) / 4;
          const b = new T.Mesh(geo.s, i < z ? mats.p : mats.n); b.scale.setScalar(0.11); b.position.set(Math.cos(th) * r * rN * depth, y * rN * depth, Math.sin(th) * r * rN * depth); atom.add(b);
        }
        const c = config(z);
        c.forEach((count, k) => {
          const ring = new T.Mesh(geo.ring[k], k === c.length - 1 ? mats.outer : mats.ring); atom.add(ring);
          for (let j = 0; j < count; j++) { const e = new T.Mesh(geo.s, mats.e); e.scale.setScalar(0.12); e.userData = { r: R[k], a: (j / count) * Math.PI * 2 + k * 0.4, w: 0.55 / (k + 1) }; atom.add(e); electrons.push(e); }
          if (s.labels !== false && s.reveal !== false) { const L = S.label(`shell ${k + 1}: ${count}`, { px: 15 }); L.position.set(0.55, R[k] + 0.02, 0.05); atom.add(L); }
        });
        if (s.labels !== false) { const L = S.label(s.reveal === false || !(phase && phase.showMass) ? 'nucleus' : `nucleus: ${z} p, ${m - z} n`, { px: 15 }); L.position.set(-0.95, -0.42, 0.05); atom.add(L); }
        place(); S.scaleLabels(atom);
      }
      function place() { electrons.forEach(e => { const u = e.userData; e.position.set(u.r * Math.cos(u.a), u.r * Math.sin(u.a), 0); }); }
      function fit() { if (!S.size()) return; const need = R[config(zOf(state)).length - 1] + 0.3; const t = Math.tan(T.MathUtils.degToRad(camera.fov / 2)); const d = Math.max(need / (0.97 * t), need / (0.97 * t * camera.aspect)); camera.position.set(0, 0, d); camera.updateProjectionMatrix(); if (atom) S.scaleLabels(atom); }
      const animating = () => state.spin !== false && !reduce();
      function frame(now) { raf = 0; if (disposed) return; const dt = lastT ? Math.min(0.05, (now - lastT) / 1000) : 0; lastT = now; electrons.forEach(e => { e.userData.a += dt * e.userData.w; }); place(); S.render(); if (animating()) raf = requestAnimationFrame(frame); else lastT = 0; }
      const kick = () => { if (!raf && animating()) raf = requestAnimationFrame(frame); };
      const describe = s => S.canvas.setAttribute('aria-label', `Shell model of ${NAMES[zOf(s)]}${s.reveal === false ? '' : ': ' + config(zOf(s)).join(',')}. Drag or use arrow keys to rotate.`);
      S.onRotate = () => { state.rx = world.rotation.x; state.ry = world.rotation.y; S.render(); };
      world.rotation.set(typeof state.rx === 'number' ? state.rx : -0.35, typeof state.ry === 'number' ? state.ry : 0.25, 0);
      const ro = new ResizeObserver(() => { fit(); S.render(); }); ro.observe(host);
      build(state); fit(); describe(state); S.render(); kick();
      return {
        update(s) { if (disposed) return; build(s); fit(); describe(s); S.render(); kick(); },
        visibility(v) { if (!v) { cancelAnimationFrame(raf); raf = 0; } else { S.render(); kick(); } },
        dispose() { disposed = true; cancelAnimationFrame(raf); ro.disconnect(); S.dispose(); }
      };
    }
  };

  /* =============================== alkali =============================== */
  const OBS = {
    li: { name: 'Lithium', obs: 'Floats · steady fizzing · moves gently', speed: 0.35, fizz: 7, melt: false, flame: false, life: 26 },
    na: { name: 'Sodium', obs: 'Floats · more vigorous fizzing · moves rapidly · melts into a ball', speed: 1.1, fizz: 18, melt: true, flame: false, life: 14 },
    k: { name: 'Potassium', obs: 'Very rapid reaction · lilac flame', speed: 2.1, fizz: 34, melt: true, flame: true, life: 7 }
  };
  const metalOf = s => (OBS[s.metal] ? s.metal : 'li');
  const alkali = {
    caption: 'Animation of standard teacher-demonstration observations. Not a recording or class data. Drag to rotate.',
    defaults: { metal: 'li', running: false, t: 0 },
    readout(p, s) { const m = OBS[metalOf(s)]; return `<p><span class="readout-key">${m.name} + water</span><span class="readout-value" style="font-size:.95em">${s.t > 0 || s.running ? m.obs : 'Predict first, then press Drop in.'}</span></p>`; },
    controls(p, s) { const m = metalOf(s); return `<div class="control-group" role="group" aria-label="Metal">${['li', 'na', 'k'].map(k => btn(OBS[k].name, 'metal=' + k, m === k)).join('')}${btn(s.running ? 'Running…' : 'Drop in', 'running=true', undefined, 'is-primary')}</div>`; },
    onChange(k, s) { if (k === 'metal') { s.running = false; s.t = 0; } if (k === 'running') s.t = 0; },
    mount(host, state, phase, ctx) {
      const S = stage(host); if (!S) return null; const { T, world, camera, keep } = S;
      // trough of water
      const trough = new T.Mesh(keep(new T.BoxGeometry(6, 1.6, 3.4)), keep(std(T, 0xbfd8ea, { opacity: 0.28 }))); trough.position.y = -0.8; world.add(trough);
      const water = new T.Mesh(keep(new T.BoxGeometry(5.9, 0.02, 3.3)), keep(std(T, 0x5aa0d8, { opacity: 0.55 }))); world.add(water);
      const edge = new T.LineSegments(keep(new T.EdgesGeometry(trough.geometry)), keep(new T.LineBasicMaterial({ color: 0x182944, transparent: true, opacity: 0.5 }))); edge.position.copy(trough.position); world.add(edge);
      const shield = new T.Mesh(keep(new T.PlaneGeometry(6.6, 2.6)), keep(std(T, 0xe8f2fa, { opacity: 0.18 }))); shield.position.set(0, 0.2, 2.1); world.add(shield);
      const shieldLabel = S.label('safety screen', { box: false, px: 14, ink: '#3a5a78' }); shieldLabel.position.set(-2.4, 1.35, 2.1); world.add(shieldLabel);
      const metalMat = keep(std(T, 0xc9ccd2, { metal: 0.6, rough: 0.3 }));
      const cube = keep(new T.BoxGeometry(0.6, 0.3, 0.45)), ball = keep(new T.SphereGeometry(0.28, 24, 18));
      const piece = new T.Mesh(cube, metalMat); world.add(piece);
      const bubbleGeo = keep(new T.SphereGeometry(1, 10, 8)), bubbleMat = keep(std(T, 0xffffff, { opacity: 0.6 }));
      const bubbles = Array.from({ length: 40 }, () => { const b = new T.Mesh(bubbleGeo, bubbleMat); b.visible = false; world.add(b); return { b, life: 0 }; });
      const flameTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d'); const gr = g.createRadialGradient(64, 80, 4, 64, 64, 60); gr.addColorStop(0, 'rgba(236,210,255,1)'); gr.addColorStop(0.5, 'rgba(178,120,230,.8)'); gr.addColorStop(1, 'rgba(150,90,220,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); const t = keep(new T.CanvasTexture(c)); t.colorSpace = T.SRGBColorSpace; return t; })();
      const flame = new T.Sprite(keep(new T.SpriteMaterial({ map: flameTex, transparent: true, depthWrite: false }))); flame.visible = false; world.add(flame);
      let tagSprite = null;
      let raf = 0, lastT = 0, disposed = false, angle = 0, seed = 1;
      const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
      function setTag(text) { if (tagSprite) world.remove(tagSprite); tagSprite = S.label(text, { px: 16 }); tagSprite.position.set(0, 1.55, 0); world.add(tagSprite); S.scaleLabels(world); }
      function pose(s) {
        const m = OBS[metalOf(s)], t = +s.t || 0, frac = Math.min(1, t / m.life), shrink = 1 - 0.85 * frac;
        const ball_ = m.melt && t > 0.6;
        piece.geometry = ball_ ? ball : cube;
        piece.visible = !(s.running === false && t >= m.life) && t < m.life;
        piece.scale.setScalar(Math.max(0.15, shrink) * (s.t > 0 || s.running ? 1 : 1));
        const r = 1.3; piece.position.set(r * Math.cos(angle) * (s.running || t > 0 ? 1 : 0), 0.08, 0.8 * Math.sin(angle) * (s.running || t > 0 ? 1 : 0));
        if (!(s.running || t > 0)) piece.position.set(0, 0.75, 0); // held above the water
        flame.visible = m.flame && piece.visible && t > 0.3;
        if (flame.visible) { const f = 0.75 + 0.25 * Math.sin(t * 25); flame.position.copy(piece.position).add(new T.Vector3(0, 0.45, 0)); flame.scale.set(1.3 * f, 1.9 * f, 1); }
      }
      function step(dt) {
        const m = OBS[metalOf(state)];
        if (state.running) {
          state.t = (+state.t || 0) + dt; angle += dt * m.speed;
          if (state.t >= m.life) { state.running = false; state.t = m.life; if (ctx && ctx.refresh) ctx.refresh(); }
          let spawn = dt * m.fizz;
          bubbles.forEach(o => { if (!o.b.visible && spawn > rnd() && piece.visible) { spawn -= 1; o.b.visible = true; o.life = 0; o.b.position.copy(piece.position).add(new T.Vector3((rnd() - .5) * .3, -0.05, (rnd() - .5) * .3)); o.b.scale.setScalar(0.05 + rnd() * 0.06); } });
        }
        bubbles.forEach(o => { if (!o.b.visible) return; o.life += dt; o.b.position.y += dt * 0.9; o.b.position.x += (rnd() - .5) * dt * .3; if (o.life > 0.7) o.b.visible = false; });
        pose(state);
      }
      function fit() { if (!S.size()) return; const t = Math.tan(T.MathUtils.degToRad(camera.fov / 2)); const need = 2.7; const d = Math.max(1.6 / (0.9 * t), need / (0.95 * t * camera.aspect)); camera.position.set(0, 1.1, d); camera.lookAt(0, 0.05, 0); S.scaleLabels(world); }
      const animating = () => (state.running || bubbles.some(o => o.b.visible)) && !reduce();
      function frame(now) { raf = 0; if (disposed) return; const dt = lastT ? Math.min(0.05, (now - lastT) / 1000) : 0; lastT = now; step(dt); S.render(); if (animating()) raf = requestAnimationFrame(frame); else lastT = 0; }
      const kick = () => { if (!raf && animating()) raf = requestAnimationFrame(frame); };
      function apply(s) {
        const m = OBS[metalOf(s)];
        if (reduce() && s.running) { s.running = false; s.t = m.life * 0.5; } // static mid-reaction view
        setTag(m.name);
        pose(s); S.render(); kick();
        S.canvas.setAttribute('aria-label', `${m.name} added to water behind a safety screen. ${s.t > 0 || s.running ? m.obs : 'Not yet added.'}`);
      }
      S.onRotate = () => { state.rx = world.rotation.x; state.ry = world.rotation.y; S.render(); };
      world.rotation.set(typeof state.rx === 'number' ? state.rx : 0.05, typeof state.ry === 'number' ? state.ry : -0.2, 0);
      const ro = new ResizeObserver(() => { fit(); S.render(); }); ro.observe(host);
      fit(); apply(state);
      return {
        update(s) { if (disposed) return; apply(s); },
        visibility(v) { if (!v) { cancelAnimationFrame(raf); raf = 0; } else { S.render(); kick(); } },
        dispose() { disposed = true; cancelAnimationFrame(raf); ro.disconnect(); S.dispose(); }
      };
    }
  };

  window.LessonModels.shellAtom = shellAtom;
  window.LessonModels.alkali = alkali;
  window.ChemData = { config, groupOf, NAMES, SYM, MASS };
})();
