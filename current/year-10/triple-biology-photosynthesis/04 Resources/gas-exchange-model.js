/* Gas exchange lab (Year 10 Triple Biology L4 · net carbon-dioxide exchange in a sealed tube).
   A leaf rests on a gauze platform above hydrogencarbonate indicator in a sealed boiling tube.
   The model keeps the two processes SEPARATE and shows them separately:
     respiration releases CO2 in every leaf tube, in light and dark: R = n × R_LEAF
     photosynthesis uses CO2 only in light:                         P = n × P_MAX × I/(I + K_LIGHT) × C/(C + K_CO2)
     tube CO2 changes by the difference:                             dC/dt = R − P   (control: n = 0, so dC/dt = 0)
   C is the tube CO2 level in illustrative ppm (atmospheric start = 400). I is light reaching the leaf, % of the bright LED.
   Integrated with fixed-step RK4 (0.05 simulated min), so every value is deterministic and re-measurable.
   The model never writes a conclusion. It is an illustrative model, not a calibration of a real indicator.
   Original Three.js geometry (r160, global THREE). No network calls, no storage. */
(() => {
  'use strict';

  /* ---------------- pure model ---------------- */
  const PARAMS = Object.freeze({
    C0: 400,            // starting tube CO2, illustrative ppm (about atmospheric)
    R_LEAF: 12,         // respiration CO2 release per leaf, ppm per simulated minute (constant temperature)
    P_MAX: 48,          // maximum photosynthesis CO2 use per leaf, ppm per minute
    K_LIGHT: 30,        // light level (% of bright) giving half of P_MAX's light factor
    K_CO2: 250,         // CO2 level giving half of the CO2 factor (CO2 becomes limiting as it is used up)
    DT: 0.05,           // integration step, simulated minutes
    T_END: 60,          // run length, simulated minutes
    BRIGHT: 100,        // LED about 10 cm away = 100 %
    DIM_LEVELS: Object.freeze({ 1: 28, 2: 20, 3: 13 }), // muslin layers → % of bright light transmitted (illustrative)
    DIM_DEFAULT: 2
  });

  const respirationRate = leaves => (leaves > 0 ? leaves * PARAMS.R_LEAF : 0);
  function photosynthesisRate(I, C, leaves) {
    if (!(leaves > 0) || !(I > 0) || !(C > 0)) return 0;
    return leaves * PARAMS.P_MAX * (I / (I + PARAMS.K_LIGHT)) * (C / (C + PARAMS.K_CO2));
  }
  /* a condition: { leaves, light: [[fromMinute, I], ...] }. The no-leaf control has leaves = 0, so its CO2 never changes. */
  function lightAt(cond, t) {
    let I = 0;
    for (const [from, v] of cond.light) if (t >= from - 1e-9) I = v;
    return I;
  }
  const netRate = (cond, t, C) => respirationRate(cond.leaves) - photosynthesisRate(lightAt(cond, t), C, cond.leaves);

  const cache = new Map();
  const condKey = c => `${c.leaves}|${c.light.map(p => p.join(':')).join(',')}`;
  function trajectory(cond) {
    const k = condKey(cond);
    if (cache.has(k)) return cache.get(k);
    const n = Math.round(PARAMS.T_END / PARAMS.DT), h = PARAMS.DT, out = new Float64Array(n + 1);
    let C = PARAMS.C0; out[0] = C;
    for (let i = 0; i < n; i++) {
      const t = i * h;
      /* RK4; light is evaluated at the step start so a switch at t = 30 applies from that step */
      const f = (tt, cc) => netRate(cond, t + 1e-9, cc);
      const k1 = f(t, C), k2 = f(t + h / 2, C + h * k1 / 2), k3 = f(t + h / 2, C + h * k2 / 2), k4 = f(t + h, C + h * k3);
      C = Math.max(1, C + (h / 6) * (k1 + 2 * k2 + 2 * k3 + k4));
      out[i + 1] = C;
    }
    cache.set(k, out);
    return out;
  }
  function co2At(cond, t) {
    const tr = trajectory(cond), x = Math.max(0, Math.min(PARAMS.T_END, Number(t) || 0)) / PARAMS.DT;
    const i = Math.floor(x), f = x - i;
    return i >= tr.length - 1 ? tr[tr.length - 1] : tr[i] * (1 - f) + tr[i + 1] * f;
  }
  function ratesAt(cond, t) {
    const C = co2At(cond, t), I = lightAt(cond, t);
    return { C, I, respiration: respirationRate(cond.leaves), photosynthesis: photosynthesisRate(I, C, cond.leaves) };
  }

  /* ---------------- indicator colour: OKLab interpolation on log CO2 ---------------- */
  const STOPS = [[120, '#4b2a7f'], [220, '#7a2d86'], [320, '#b03a6e'], [400, '#d4482e'], [520, '#e2772a'], [700, '#e8a52d'], [1000, '#e9cd3c']];
  const s2l = c => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  const l2s = c => (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055);
  function hexToOklab(hex) {
    const r = s2l(parseInt(hex.slice(1, 3), 16) / 255), g = s2l(parseInt(hex.slice(3, 5), 16) / 255), b = s2l(parseInt(hex.slice(5, 7), 16) / 255);
    const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b), m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b), s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
    return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s];
  }
  function oklabToHex([L, A, B]) {
    const l = Math.pow(L + 0.3963377774 * A + 0.2158037573 * B, 3), m = Math.pow(L - 0.1055613458 * A - 0.0638541728 * B, 3), s = Math.pow(L - 0.0894841775 * A - 1.291485548 * B, 3);
    const rgb = [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s];
    return '#' + rgb.map(v => Math.round(Math.max(0, Math.min(1, l2s(v))) * 255).toString(16).padStart(2, '0')).join('');
  }
  const LAB = STOPS.map(([c, h]) => [Math.log(c), hexToOklab(h)]);
  function indicatorColour(C) {
    const x = Math.log(Math.max(STOPS[0][0], Math.min(STOPS[STOPS.length - 1][0], C)));
    for (let i = 0; i < LAB.length - 1; i++) {
      const [x0, a] = LAB[i], [x1, b] = LAB[i + 1];
      if (x <= x1) { const f = (x - x0) / (x1 - x0); return oklabToHex([0, 1, 2].map(j => a[j] + (b[j] - a[j]) * f)); }
    }
    return STOPS[STOPS.length - 1][1];
  }
  const BANDS = [[270, 'purple', 'CO₂ reduced'], [360, 'red-purple', 'CO₂ slightly reduced'], [460, 'orange-red', 'CO₂ about atmospheric'], [650, 'orange', 'CO₂ slightly raised'], [Infinity, 'yellow', 'CO₂ raised']];
  function indicatorBand(C) { const b = BANDS.find(([max]) => C < max); return { name: b[1], meaning: b[2] }; }

  /* ---------------- the lab's tubes and transfer scenarios ---------------- */
  const B = PARAMS.BRIGHT;
  function baseTubes(dimLayers) {
    const L = PARAMS.DIM_LEVELS[dimLayers] ? dimLayers : PARAMS.DIM_DEFAULT, dimI = PARAMS.DIM_LEVELS[L];
    return [
      { id: 'bright', key: 'bright', letter: '1', name: 'Bright', wrap: null, setup: 'Leaf, LED about 10 cm away', cond: { leaves: 1, light: [[0, B]] } },
      { id: 'dim', key: `dim-${L}`, letter: '2', name: 'Dim', wrap: 'muslin', layers: L, setup: `Leaf, ${L} layer${L > 1 ? 's' : ''} of muslin (${dimI} % of the bright light)`, cond: { leaves: 1, light: [[0, dimI]] } },
      { id: 'dark', key: 'dark', letter: '3', name: 'Dark', wrap: 'foil', setup: 'Leaf, tube wrapped in foil', cond: { leaves: 1, light: [[0, 0]] } },
      { id: 'control', key: 'control', letter: '4', name: 'Control', wrap: null, setup: 'No leaf, same light position', cond: { leaves: 0, light: [[0, B]] } }
    ];
  }
  const TRANSFER = [
    { id: 'bright-dark', name: 'Bright, then dark', wrap: 'foil-late', setup: 'One leaf. Bright for 30 min, then wrapped in foil for 30 min', cond: { leaves: 1, light: [[0, B], [30, 0]] } },
    { id: 'dark-bright', name: 'Dark, then bright', wrap: 'foil-early', setup: 'One leaf. In foil for 30 min, then unwrapped in bright light for 30 min', cond: { leaves: 1, light: [[0, 0], [30, B]] } },
    { id: 'two-bright', name: 'Two leaves, bright', wrap: null, leaves: 2, setup: 'Two equal leaves in one tube, LED about 10 cm away', cond: { leaves: 2, light: [[0, B]] } },
    { id: 'two-dark', name: 'Two leaves, dark', wrap: 'foil', leaves: 2, setup: 'Two equal leaves in one tube, wrapped in foil', cond: { leaves: 2, light: [[0, 0]] } }
  ];
  const transferTube = id => { const s = TRANSFER.find(x => x.id === id); return s ? Object.assign({ key: `x-${s.id}`, letter: '5', transfer: true }, s) : null; };
  const wrapAt = (tube, t) => (tube.wrap === 'foil-late' ? (t >= 30 ? 'foil' : null) : tube.wrap === 'foil-early' ? (t < 30 ? 'foil' : null) : tube.wrap);

  const Model = Object.freeze({ PARAMS, respirationRate, photosynthesisRate, lightAt, netRate, co2At, ratesAt, trajectory, indicatorColour, indicatorBand, BANDS, STOPS, baseTubes, TRANSFER, transferTube, wrapAt });

  /* ---------------- fallback 2D view (SVG from the same state) ---------------- */
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  function fallbackSVG(tubes, t, revealed) {
    const w = 120, W = tubes.length * w + 20;
    let g = `<svg viewBox="0 0 ${W} 300" role="img" aria-label="Diagram of the tubes at ${Math.round(t)} simulated minutes" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,sans-serif">`;
    g += `<rect x="0" y="0" width="${W}" height="300" fill="#fbf8f0"/><rect x="10" y="22" width="${W - 20}" height="16" rx="5" fill="#2b2f36"/><rect x="16" y="26" width="${W - 32}" height="8" rx="3" fill="#f3dc6b"/><text x="${W / 2}" y="16" font-size="12" text-anchor="middle" fill="#182944">LED lamp about 10 cm away (light yellow)</text>`;
    tubes.forEach((tb, i) => {
      const cx = 10 + w * i + w / 2, show = revealed(tb), C = co2At(tb.cond, t), col = show ? indicatorColour(C) : '#d4482e', band = indicatorBand(C), wrap = wrapAt(tb, t);
      g += `<g><rect x="${cx - 18}" y="70" width="36" height="150" rx="4" fill="#eef5f7" stroke="#7e98a1" stroke-width="2"/><path d="M${cx - 18} 210 h36 v10 a18 18 0 0 1 -36 0 z" fill="${col}" stroke="#7e98a1" stroke-width="2"/><rect x="${cx - 17}" y="180" width="34" height="32" fill="${col}"/>`;
      g += `<line x1="${cx - 16}" y1="160" x2="${cx + 16}" y2="160" stroke="#666" stroke-width="3" stroke-dasharray="2 2"/>`;
      if (tb.cond.leaves > 0) g += `<ellipse cx="${cx}" cy="154" rx="14" ry="5" fill="#4f8a3c"/>` + (tb.cond.leaves > 1 ? `<ellipse cx="${cx + 2}" cy="147" rx="12" ry="4" fill="#5f9a48"/>` : '');
      g += `<rect x="${cx - 21}" y="56" width="42" height="18" rx="3" fill="#7b3b2c"/>`;
      if (wrap === 'foil') g += `<rect x="${cx - 22}" y="76" width="10" height="150" fill="#b9bec4" opacity=".95"/><rect x="${cx + 12}" y="76" width="10" height="150" fill="#b9bec4" opacity=".95"/>`;
      if (wrap === 'muslin') g += `<rect x="${cx - 22}" y="76" width="44" height="150" fill="#f4efe2" opacity="${0.25 + 0.12 * tb.layers}" stroke="#c9bfa7"/>`;
      g += `<text x="${cx}" y="250" font-size="14" font-weight="700" text-anchor="middle" fill="#182944">${esc(tb.letter)} ${esc(tb.name)}</text>`;
      g += `<text x="${cx}" y="270" font-size="12" text-anchor="middle" fill="#4b5667">${show ? esc(band.name) : 'predict first'}</text>`;
      if (wrap) g += `<text x="${cx}" y="288" font-size="11" text-anchor="middle" fill="#4b5667">${wrap === 'foil' ? 'foil cut away' : 'muslin'}</text>`;
      g += `</g>`;
    });
    return g + '</svg>';
  }

  /* ---------------- 3D view ---------------- */
  const HEX = { navy: '#182944', light: '#f3dc6b', co2: '#6b7280', o2: '#24748d', leaf: '#4f8a3c', rubber: '#6e3326', bench: '#d9cdb3', steel: '#8d949c' };
  const TR = 0.2, TB = 0.32, TL = 2.35, LIQ = 0.95, GAUZE = 1.32, SP = 1.05; // tube radius, base centre, length, liquid top, gauze height, spacing

  function canvasTex(T, w, h, paint) { const c = document.createElement('canvas'); c.width = w; c.height = h; paint(c.getContext('2d'), w, h); const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; return t; }
  function drawLabel(canvas, text, style) {
    const g = canvas.getContext('2d'), fpx = style === 'minor' ? 34 : 40, pad = 18, font = `${style === 'minor' ? 600 : 700} ${fpx}px system-ui, -apple-system, "Segoe UI", sans-serif`;
    g.font = font; const w = Math.ceil(g.measureText(text).width + pad * 2), h = Math.ceil(fpx * 1.6);
    canvas.width = w; canvas.height = h; g.font = font;
    const dark = style === 'clock';
    g.fillStyle = dark ? HEX.navy : 'rgba(250,247,238,0.94)'; g.strokeStyle = style === 'minor' ? '#9a8f7a' : HEX.navy; g.lineWidth = 4;
    g.beginPath(); if (g.roundRect) g.roundRect(3, 3, w - 6, h - 6, h * 0.25); else g.rect(3, 3, w - 6, h - 6); g.fill(); g.stroke();
    g.fillStyle = dark ? '#fbf5e6' : HEX.navy; g.textBaseline = 'middle'; g.fillText(text, pad, h / 2 + 2);
    return w / h;
  }

  function buildView(host, T) {
    const cv = document.createElement('canvas'), attrs = { antialias: true, alpha: true, powerPreference: 'low-power' };
    let gl = null; try { gl = cv.getContext('webgl2', attrs) || cv.getContext('webgl', attrs); } catch (_) { gl = null; }
    if (!gl) return null;
    let renderer; try { renderer = new T.WebGLRenderer({ canvas: cv, context: gl, antialias: true, alpha: true }); } catch (_) { return null; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)); renderer.outputColorSpace = T.SRGBColorSpace; renderer.setClearColor(0x000000, 0); renderer.autoClear = false;
    const canvas = renderer.domElement; canvas.tabIndex = 0; canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', 'Simulated sealed boiling tubes in a rack in front of an LED lamp. Each leaf rests on a gauze platform above hydrogencarbonate indicator. Drag or use the arrow keys to turn the rack. The panel beside the view gives every tube’s state in words.');
    host.appendChild(canvas); host.classList.add('is-live');

    const disposables = [];
    const D = x => { disposables.push(x); return x; };
    const col = h => new T.Color(h);
    const scene = new T.Scene(), camera = new T.PerspectiveCamera(32, 1, 0.1, 100);

    /* simple studio environment for glass/foil reflections (core PMREM, no external HDR) */
    const envScene = new T.Scene(); envScene.background = col('#c9c3b5');
    const envBox = (w, h, x, y, z, c) => { const m = new T.Mesh(D(new T.PlaneGeometry(w, h)), D(new T.MeshBasicMaterial({ color: c, side: T.DoubleSide }))); m.position.set(x, y, z); m.lookAt(0, 0, 0); envScene.add(m); };
    envBox(8, 3, 0, 6, 2, 0xffffff); envBox(3, 6, -6, 2, 0, 0xfff6e0); envBox(3, 6, 6, 2, 1, 0xe8f0ff); envBox(10, 4, 0, -3, -4, 0x6b5f4c);
    const pmrem = new T.PMREMGenerator(renderer); const envRT = pmrem.fromScene(envScene, 0.04); scene.environment = envRT.texture; pmrem.dispose();

    scene.add(new T.HemisphereLight(0xffffff, 0xb8a98c, 1.1));
    const key = new T.DirectionalLight(0xffffff, 1.6); key.position.set(3, 6, 6); scene.add(key);
    const lampLight = new T.DirectionalLight(col(HEX.light), 1.2); lampLight.position.set(0, 1.6, -3); scene.add(lampLight);

    /* bench with a laminate texture */
    const benchTex = D(canvasTex(T, 512, 256, (g, w, h) => { g.fillStyle = '#d9cdb3'; g.fillRect(0, 0, w, h); for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(${120 + Math.random() * 40},${100 + Math.random() * 30},70,${Math.random() * 0.07})`; g.fillRect(Math.random() * w, Math.random() * h, 30 + Math.random() * 80, 1 + Math.random() * 2); } }));
    const bench = new T.Mesh(D(new T.BoxGeometry(9, 0.12, 4.2)), D(new T.MeshStandardMaterial({ map: benchTex, roughness: 0.75 }))); bench.position.set(0.5, -0.06, -0.5); scene.add(bench);

    /* LED panel lamp behind the rack, facing the tubes */
    const housing = D(new T.MeshStandardMaterial({ color: 0x2b2f36, roughness: 0.45, metalness: 0.4 }));
    const lamp = new T.Group(); lamp.position.set(0.5, 0, -1.4); scene.add(lamp);
    const head = new T.Mesh(D(new T.BoxGeometry(5.4, 0.62, 0.18)), housing); head.position.y = 1.25; lamp.add(head);
    const ledMat = D(new T.MeshStandardMaterial({ color: col('#fff6c8'), emissive: col(HEX.light), emissiveIntensity: 1.8, roughness: 0.3 }));
    const led = new T.Mesh(D(new T.PlaneGeometry(5.2, 0.46)), ledMat); led.position.set(0, 1.25, 0.095); lamp.add(led);
    for (const x of [-2.4, 2.4]) { const leg = new T.Mesh(D(new T.CylinderGeometry(0.04, 0.04, 1.0, 12)), housing); leg.position.set(x, 0.5, 0); lamp.add(leg); const foot = new T.Mesh(D(new T.BoxGeometry(0.5, 0.05, 0.5)), housing); foot.position.set(x, 0.025, 0); lamp.add(foot); }
    const beamMat = D(new T.MeshBasicMaterial({ color: col(HEX.light), transparent: true, opacity: 0.13, depthWrite: false, side: T.DoubleSide, blending: T.AdditiveBlending }));
    const beam = new T.Mesh(D(new T.PlaneGeometry(5.2, 1.5)), beamMat); beam.rotation.x = -Math.PI / 2; beam.position.set(0.5, 1.25, -0.7); scene.add(beam);

    /* rack: white plastic top plate with holes, uprights and base */
    const rackMat = D(new T.MeshStandardMaterial({ color: 0xf2f0ea, roughness: 0.5 }));
    const rack = new T.Group(); scene.add(rack);
    const rackTop = new T.Mesh(D(new T.BoxGeometry(5.6, 0.08, 0.7)), rackMat); rackTop.position.set(0.5, 1.75, 0); rack.add(rackTop);
    const rackBase = new T.Mesh(D(new T.BoxGeometry(5.6, 0.06, 0.7)), rackMat); rackBase.position.set(0.5, 0.03, 0); rack.add(rackBase);
    for (const x of [-2.25, 3.25]) { const up = new T.Mesh(D(new T.BoxGeometry(0.08, 1.75, 0.7)), rackMat); up.position.set(x, 0.875, 0); rack.add(up); }

    /* shared materials */
    const glassMat = D(new T.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.04, metalness: 0, transmission: 1, thickness: 0.06, ior: 1.5, clearcoat: 1, clearcoatRoughness: 0.03, envMapIntensity: 1.2, side: T.DoubleSide, transparent: true, opacity: 1 }));
    const rimMat = D(new T.MeshPhysicalMaterial({ color: 0xdfeff2, roughness: 0.05, transmission: 0.6, thickness: 0.1, transparent: true }));
    const rubberMat = D(new T.MeshStandardMaterial({ color: col(HEX.rubber), roughness: 0.92 }));
    const steelMat = D(new T.MeshStandardMaterial({ color: col(HEX.steel), roughness: 0.35, metalness: 0.9 }));
    const leafTex = D(canvasTex(T, 256, 128, (g, w, h) => {
      const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#5f9c47'); gr.addColorStop(1, '#3f7431'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
      g.strokeStyle = 'rgba(220,240,190,.7)'; g.lineWidth = 4; g.beginPath(); g.moveTo(0, h / 2); g.lineTo(w, h / 2); g.stroke(); g.lineWidth = 2;
      for (let i = 1; i < 8; i++) { const x = (w * i) / 8; g.beginPath(); g.moveTo(x, h / 2); g.lineTo(x + 26, 6); g.moveTo(x, h / 2); g.lineTo(x + 26, h - 6); g.stroke(); }
    }));
    leafTex.repeat.set(1 / 0.32, 1 / 0.16); leafTex.offset.set(0.5, 0.5);
    const leafMat = D(new T.MeshStandardMaterial({ map: leafTex, roughness: 0.55, side: T.DoubleSide }));
    const foilTex = D(canvasTex(T, 256, 256, (g, w, h) => { g.fillStyle = '#808080'; g.fillRect(0, 0, w, h); for (let i = 0; i < 260; i++) { const v = 90 + Math.random() * 90; g.fillStyle = `rgb(${v},${v},${v})`; g.beginPath(); const x = Math.random() * w, y = Math.random() * h; g.moveTo(x, y); g.lineTo(x + Math.random() * 50 - 25, y + Math.random() * 50 - 25); g.lineTo(x + Math.random() * 50 - 25, y + Math.random() * 50 - 25); g.fill(); } }));
    foilTex.colorSpace = T.NoColorSpace; foilTex.wrapS = foilTex.wrapT = T.RepeatWrapping;
    const foilMat = D(new T.MeshStandardMaterial({ color: 0xd8dce0, metalness: 1, roughness: 0.32, bumpMap: foilTex, bumpScale: 0.6, side: T.DoubleSide }));
    const weaveTex = D(canvasTex(T, 128, 128, (g, w, h) => { g.clearRect(0, 0, w, h); g.fillStyle = 'rgba(255,255,255,1)'; for (let i = 0; i < w; i += 6) { g.fillRect(i, 0, 2, h); g.fillRect(0, i, w, 2); } }));
    weaveTex.wrapS = weaveTex.wrapT = T.RepeatWrapping; weaveTex.repeat.set(4, 8);

    /* geometry shared by tubes */
    const tubeGeo = D(new T.CylinderGeometry(TR, TR, TL, 40, 1, true));
    const bottomGeo = D(new T.SphereGeometry(TR, 32, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2));
    const lipGeo = D(new T.TorusGeometry(TR + 0.012, 0.018, 8, 40));
    const RL = TR * 0.9;
    const liqPts = [];
    for (let i = 0; i <= 10; i++) { const a = -Math.PI / 2 + (i / 10) * (Math.PI / 2); liqPts.push(new T.Vector2(Math.max(0.0001, RL * Math.cos(a)), TB + RL * Math.sin(a))); }
    liqPts.push(new T.Vector2(RL, LIQ + 0.045));                      // liquid creeps up the glass: concave meniscus
    for (let i = 1; i <= 10; i++) { const r = RL * (1 - i / 10); liqPts.push(new T.Vector2(Math.max(0.0001, r), LIQ + 0.045 * Math.pow(r / RL, 3))); }
    const liquidGeo = D(new T.LatheGeometry(liqPts, 40));
    const bungGeo = D(new T.CylinderGeometry(TR * 1.18, TR * 0.98, 0.3, 32));
    const foilGeo = D(new T.CylinderGeometry(TR + 0.03, TR + 0.03, TL + 0.1, 40, 1, true, Math.PI * 0.32, Math.PI * 1.36)); // cut-away window faces the viewer
    const muslinGeo = D(new T.CylinderGeometry(TR + 0.03, TR + 0.03, TL - 0.1, 40, 1, true));
    const leafShape = new T.Shape(); leafShape.moveTo(-0.16, 0); leafShape.bezierCurveTo(-0.08, 0.1, 0.08, 0.09, 0.16, 0); leafShape.bezierCurveTo(0.08, -0.09, -0.08, -0.1, -0.16, 0);
    const leafGeo = D(new T.ShapeGeometry(leafShape, 16));
    const gauzeGroupTemplate = () => {
      const g = new T.Group(), r = TR * 0.86;
      const rim = new T.Mesh(D(new T.TorusGeometry(r, 0.008, 6, 32)), steelMat); rim.rotation.x = Math.PI / 2; g.add(rim);
      for (let i = -5; i <= 5; i++) {
        const x = (i / 6) * r, len = 2 * Math.sqrt(Math.max(0, r * r - x * x)); if (len < 0.02) continue;
        const wGeo = D(new T.CylinderGeometry(0.004, 0.004, len, 4));
        const a = new T.Mesh(wGeo, steelMat); a.rotation.x = Math.PI / 2; a.position.x = x; g.add(a);
        const b = new T.Mesh(wGeo, steelMat); b.rotation.z = Math.PI / 2; b.position.z = x; g.add(b);
      }
      const legGeo = D(new T.CylinderGeometry(0.006, 0.006, GAUZE - LIQ - 0.02, 4));
      for (const a of [0.4, 2.5, 4.6]) { const l = new T.Mesh(legGeo, steelMat); l.position.set(Math.cos(a) * r * 0.95, -(GAUZE - LIQ) / 2, Math.sin(a) * r * 0.95); g.add(l); }
      return g;
    };

    /* labels: canvas sprites sized in screen pixels */
    const labels = [];
    let worldPerPx = 0.01, W = 1, H = 1, small = false;
    function makeLabel(text, style, center) {
      const c = document.createElement('canvas'), mat = D(new T.SpriteMaterial({ transparent: true, depthTest: false, depthWrite: false }));
      const sprite = new T.Sprite(mat); sprite.renderOrder = 30; if (center) sprite.center.set(center[0], center[1]);
      const L = { sprite, style, text: null, tex: null, aspect: 1 };
      L.set = t => { if (t === L.text) return; L.text = t; L.aspect = drawLabel(c, t, style); if (L.tex) L.tex.dispose(); L.tex = new T.CanvasTexture(c); L.tex.colorSpace = T.SRGBColorSpace; mat.map = L.tex; mat.needsUpdate = true; scaleL(L); };
      labels.push(L); scene.add(sprite); L.set(text); return L;
    }
    const pxOf = L => (L.style === 'minor' ? (small ? 12 : 15) : small ? 13 : 17);
    const scaleL = L => { const h = pxOf(L) * worldPerPx; L.sprite.scale.set(h * L.aspect, h, 1); };

    /* the tube slots (A–E) */
    const slots = [];
    function makeSlot(i) {
      const g = new T.Group(); g.position.set(-1.5 + i * SP, 0, 0); scene.add(g);
      const glass = new T.Mesh(tubeGeo, glassMat); glass.position.y = TB + TL / 2; glass.renderOrder = 5; g.add(glass);
      const bottom = new T.Mesh(bottomGeo, glassMat); bottom.position.y = TB; bottom.renderOrder = 5; g.add(bottom);
      const lip = new T.Mesh(lipGeo, rimMat); lip.rotation.x = Math.PI / 2; lip.position.y = TB + TL; g.add(lip);
      const liqMat = D(new T.MeshPhysicalMaterial({ color: col('#d4482e'), roughness: 0.12, clearcoat: 0.6, emissive: col('#d4482e'), emissiveIntensity: 0.22 }));
      const liquid = new T.Mesh(liquidGeo, liqMat); g.add(liquid);
      const gauze = gauzeGroupTemplate(); gauze.position.y = GAUZE; g.add(gauze);
      const leaves = [0, 1].map(k => { const m = new T.Mesh(leafGeo, leafMat); m.rotation.set(-Math.PI / 2 + 0.55, k ? 0.5 : -0.2, k ? 0.5 : 0.15); m.scale.setScalar(1.05); m.position.set(k ? 0.015 : -0.01, GAUZE + 0.06 + k * 0.05, k ? -0.03 : 0.0); g.add(m); return m; });
      const bung = new T.Mesh(bungGeo, rubberMat); bung.position.y = TB + TL + 0.08; g.add(bung);
      const foil = new T.Mesh(foilGeo, foilMat); foil.position.y = TB + TL / 2 - 0.05; g.add(foil);
      const muslinMat = D(new T.MeshStandardMaterial({ color: 0xf6f0de, alphaMap: weaveTex, transparent: true, opacity: 0.6, roughness: 1, side: T.DoubleSide, depthWrite: false }));
      const muslin = new T.Mesh(muslinGeo, muslinMat); muslin.position.y = TB + TL / 2; muslin.renderOrder = 7; g.add(muslin);
      const name = makeLabel('A Dark', 'major', [0.5, 1]); name.sprite.position.set(-1.5 + i * SP, -0.12, 0.45);
      const state = makeLabel('predict first', 'minor', [0.5, 0]); state.sprite.position.set(-1.5 + i * SP, TB + TL + 0.32, 0);
      const slot = { g, liqMat, leaves, foil, muslin, muslinMat, name, state, i };
      slots.push(slot); return slot;
    }
    for (let i = 0; i < 5; i++) makeSlot(i);
    const lampLabel = makeLabel('LED lamp behind every tube · about 10 cm', 'minor', [0.5, 0]); lampLabel.sprite.position.set(0.6, 1.62, -1.4); /* L4 copy: label centred over the panel at tube C, not beside tube A; lamp geometry and model rules unchanged */
    const clockLabel = makeLabel('0 min', 'clock', [0.5, 0]); clockLabel.sprite.position.set(0.5, 3.35, 0);

    /* camera fit */
    let yaw = 0, pitch = 0.2, nSlots = 4;
    const target = new T.Vector3(), tmp = new T.Vector3();
    function fit() {
      camera.aspect = W / H; camera.updateProjectionMatrix();
      const x0 = -2.3, x1 = Math.max(3.3, -1.5 + (nSlots - 1) * SP + 0.55);
      const pts = [];
      for (const x of [x0, x1]) for (const y of [-0.45, 3.7]) for (const z of [-0.5, 0.5]) pts.push(new T.Vector3(x, y, z));
      const back = new T.Vector3(Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), Math.cos(yaw) * Math.cos(pitch));
      target.set((x0 + x1) / 2, 1.6, 0); let d = 12;
      const tanV = Math.tan(T.MathUtils.degToRad(camera.fov / 2));
      for (let it = 0; it < 6; it++) {
        camera.position.copy(target).addScaledVector(back, d); camera.lookAt(target); camera.updateMatrixWorld();
        let mx = 0, my = 0;
        for (const p of pts) { tmp.copy(p).project(camera); mx = Math.max(mx, Math.abs(tmp.x)); my = Math.max(my, Math.abs(tmp.y)); }
        d *= Math.max(mx, my) / 0.94;
      }
      camera.position.copy(target).addScaledVector(back, d); camera.lookAt(target); camera.updateMatrixWorld();
      worldPerPx = (2 * d * tanV) / H; labels.forEach(scaleL);
    }
    function resize() { const r = host.getBoundingClientRect(); if (!r.width || !r.height) return; W = r.width; H = r.height; small = W < 520; renderer.setSize(W, H, false); fit(); draw(); }

    function sync(tubes, t, revealed) {
      nSlots = tubes.length;
      slots.forEach((sl, i) => {
        const tb = tubes[i]; sl.g.visible = !!tb; sl.name.sprite.visible = sl.state.sprite.visible = !!tb;
        if (!tb) return;
        const show = revealed(tb), C = co2At(tb.cond, t), hex = show ? indicatorColour(C) : '#d4482e';
        sl.liqMat.color.set(hex); sl.liqMat.emissive.set(hex);
        sl.leaves[0].visible = tb.cond.leaves >= 1; sl.leaves[1].visible = tb.cond.leaves >= 2;
        const wrap = wrapAt(tb, t);
        sl.foil.visible = wrap === 'foil'; sl.muslin.visible = wrap === 'muslin';
        if (wrap === 'muslin') sl.muslinMat.opacity = 0.35 + 0.15 * (tb.layers || 1);
        sl.name.set(`${tb.letter} ${small ? tb.name.split(',')[0].split(' ')[0] : tb.name}`);
        sl.state.set(show ? indicatorBand(C).name : 'predict first');
      });
      const anyBright = tubes.some(tb => lightAt(tb.cond, t) > 0);
      ledMat.emissiveIntensity = anyBright ? 1.8 : 0.5; beam.visible = anyBright;
      clockLabel.set(`${Math.floor(t)} of 60 min (simulated)`);
      fit(); draw();
    }
    function draw() { renderer.clear(); renderer.render(scene, camera); }

    let drag = null;
    const clampView = () => { yaw = Math.max(-0.6, Math.min(0.6, yaw)); pitch = Math.max(0.02, Math.min(0.8, pitch)); fit(); draw(); };
    const onDown = e => { drag = [e.clientX, e.clientY]; try { canvas.setPointerCapture(e.pointerId); } catch (_) {} };
    const onMove = e => { if (!drag) return; yaw -= (e.clientX - drag[0]) * 0.006; pitch += (e.clientY - drag[1]) * 0.005; drag = [e.clientX, e.clientY]; clampView(); };
    const onUp = () => { drag = null; };
    const onKey = e => { const k = e.key; if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(k)) return; e.preventDefault(); if (k === 'ArrowLeft') yaw += 0.1; if (k === 'ArrowRight') yaw -= 0.1; if (k === 'ArrowUp') pitch += 0.08; if (k === 'ArrowDown') pitch -= 0.08; clampView(); };
    canvas.addEventListener('pointerdown', onDown); canvas.addEventListener('pointermove', onMove); canvas.addEventListener('pointerup', onUp); canvas.addEventListener('pointercancel', onUp); canvas.addEventListener('keydown', onKey);
    const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(resize) : null; if (ro) ro.observe(host);
    resize();
    return {
      sync,
      dispose() {
        if (ro) ro.disconnect();
        labels.forEach(L => L.tex && L.tex.dispose()); disposables.forEach(x => x && x.dispose && x.dispose()); envRT.dispose();
        renderer.dispose(); try { renderer.forceContextLoss(); } catch (_) {}
        canvas.remove(); host.classList.remove('is-live');
      }
    };
  }

  function mountView(host) {
    const T = window.THREE;
    if (!T || !T.WebGLRenderer) return null;
    try { return buildView(host, T); } catch (err) { if (window.console) console.warn('Gas exchange lab: 3D view unavailable', err); const c = host.querySelector('canvas'); if (c) c.remove(); host.classList.remove('is-live'); return null; }
  }

  window.GasExchangeModel = Model;                          // QA hooks: pure rate functions, colour scale, scenarios
  window.GasExchangeView = Object.freeze({ mountView, fallbackSVG });
})();
