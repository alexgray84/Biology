/* Virtual spotting-tile investigation (Lesson 02 · Pearson 4XBI1 2.12 · Core Practical 2).
   Amylase breaks down starch in a water bath. Every 30 s of simulated time one drop of the starch–amylase mixture goes
   into a fresh well of orange-brown iodine: blue-black while starch remains, dark brown for the last sample before the
   end-point, then the iodine STAYS orange-brown (end-point: no starch left). Simulated time runs at 15× real time.
   End-points are the illustrative dataset in BUILD-SPEC §4 (10 °C 450 s · 20 °C 240 s · 30 °C 150 s · 40 °C 90 s ·
   50 °C 180 s · 60 °C and boiled amylase: no end-point by 600 s).
   State: {temp, boiled, running, t, samples, endpoint, results}. Commands: run (Start / Pause / Resume / New run), reset.
   The simulation clock runs inside the mounted instance even when WebGL is unavailable (the readout stays true).
   Original Three.js geometry (r160, global THREE). No network calls, no storage. */
window.LessonModels = window.LessonModels || {};
window.LessonModels.spotTile = (() => {
  const reduce = () => !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* ---------- science data and pure state logic (drives readout, visuals and answers) ---------- */
  const TEMPS = [10, 20, 30, 40, 50, 60];
  const END = { 10: 450, 20: 240, 30: 150, 40: 90, 50: 180, 60: null }; // illustrative end-point times / s
  const SAMPLE = 30, WELLS = 20, COLS = 5, ROWS = 4, SPEED = 15;
  const HEX = {
    iodine: '#b8651f', blueBlack: '#1d2140', darkBrown: '#57311b', navy: '#182944', teal: '#24748d', gold: '#bd8126',
    rose: '#ad5c63', green: '#56834b', water: '#dfeef3', paper: '#faf7ee', mixture: '#ebe3c9'
  };
  const num = v => (typeof v === 'number' && isFinite(v) ? v : 0);
  const tempOf = s => (TEMPS.includes(s.temp) ? s.temp : TEMPS.reduce((a, b) => (Math.abs(b - num(s.temp)) < Math.abs(a - num(s.temp)) ? b : a), 40));
  const endpointFor = s => (s.boiled ? null : END[tempOf(s)]);
  const hasEnd = s => typeof s.endpoint === 'number';
  const finished = s => hasEnd(s) || num(s.samples) >= WELLS;
  const status = s => (s.running ? 'running' : finished(s) ? 'done' : num(s.samples) > 0 || num(s.t) > 0 ? 'paused' : 'ready');
  const runKey = s => (s.boiled ? 'boiled' : String(tempOf(s)));
  const mmss = t => { const x = Math.max(0, Math.floor(num(t))); return `${String(Math.floor(x / 60)).padStart(2, '0')}:${String(x % 60).padStart(2, '0')}`; };
  const rate = e => (1 / e).toPrecision(2); // 2 significant figures, e.g. 1 ÷ 90 = 0.011
  // What each well shows: 'unused' (plain iodine), 'starch' (blue-black), 'transition' (dark brown), 'end' (stays orange-brown).
  function wellKind(s, i) {
    if (i >= num(s.samples)) return 'unused';
    const at = SAMPLE * (i + 1), E = endpointFor(s);
    if (E !== null && at === E) return 'end';
    if (E !== null && at === E - SAMPLE) return 'transition';
    return 'starch';
  }
  function clearRun(s) { s.running = false; s.t = 0; s.samples = 0; s.endpoint = null; }
  function ensure(s) { if (!s.results || typeof s.results !== 'object') s.results = {}; s.temp = tempOf(s); }
  // Advance the simulated clock by dt real seconds. Mutates state; refreshes the panel at every sample.
  function advance(s, dt, ctx) {
    if (!s.running) return;
    ensure(s);
    const E = endpointFor(s);
    let t = num(s.t) + dt * SPEED, sampled = false, done = false;
    while (num(s.samples) < WELLS && t >= SAMPLE * (num(s.samples) + 1)) {
      s.samples = num(s.samples) + 1; sampled = true;
      const at = SAMPLE * s.samples;
      if (E !== null && at >= E) { s.endpoint = at; done = true; t = at; break; }
      if (s.samples >= WELLS) { done = true; t = at; break; }
    }
    s.t = t;
    if (done) {
      s.running = false;
      s.results[runKey(s)] = hasEnd(s) ? s.endpoint : null;
      if (ctx && ctx.announce) ctx.announce(hasEnd(s) ? `End-point at ${s.endpoint} seconds. Rate ${rate(s.endpoint)} per second.` : 'No end-point by 600 seconds. Starch is still present.');
    }
    if (sampled && ctx && ctx.refresh) ctx.refresh();
  }

  /* ---------- controls and readout ---------- */
  const btn = (label, value, pressed, extra = '') => `<button type="button" data-action="model" data-value="${value}" aria-pressed="${pressed}"${extra}>${label}</button>`;
  const cmd = (label, value, primary = false, aria = '') => `<button type="button" data-action="model-cmd" data-value="${value}"${primary ? ' class="is-primary"' : ''}${aria ? ` aria-label="${aria}"` : ''}>${label}</button>`;
  function controls(p, s) {
    const st = status(s), T = tempOf(s);
    const runLabel = st === 'running' ? 'Pause' : st === 'paused' ? 'Resume' : st === 'done' ? 'New run' : 'Start';
    return `<div class="control-group" role="group" aria-label="Water bath temperature in degrees Celsius"><span class="control-label" style="flex-basis:100%">Water bath temperature / °C</span>${TEMPS.map(t => btn(String(t), `temp=${t}`, T === t, ` aria-label="${t} °C" style="flex:1 1 0;min-width:0;padding-left:4px;padding-right:4px"`)).join('')}</div>` +
      `<div class="control-group">${btn('Boiled amylase', `boiled=${!s.boiled}`, !!s.boiled, ' aria-label="Boiled amylase (control)"')}${cmd(runLabel, 'run', true)}${cmd('Reset', 'reset', false, 'Reset: clear the tile and all runs')}</div>`;
  }
  function resultsLine(s) {
    const r = s.results || {};
    const keys = TEMPS.map(String).filter(k => k in r).concat('boiled' in r ? ['boiled'] : []);
    if (!keys.length) return '';
    const txt = keys.map(k => `${k === 'boiled' ? 'boiled' : `${k} °C`} ${r[k] === null ? 'none' : r[k]}`).join(' · ');
    return `<p><span class="readout-key">Runs · end-point / s</span><span class="readout-value" style="font-size:.84em">${txt}</span></p>`;
  }
  function readout(p, s) {
    const st = status(s), T = tempOf(s), n = num(s.samples);
    const k1 = `${T} °C · ${s.boiled ? 'boiled amylase' : 'amylase'}${st === 'paused' ? ' · paused' : ''}`;
    const ns = `${n} ${n === 1 ? 'sample' : 'samples'}`;
    const v1 = st === 'running' ? (n ? `${ns} · last at ${mmss(n * SAMPLE)}` : 'Running · first drop at 00:30') : `Time ${mmss(s.t)} · ${ns}`;
    let k2 = 'End-point', v2;
    if (st === 'ready') { k2 = 'Spotting tile'; v2 = '20 wells of orange-brown iodine. Press Start.'; }
    else if (hasEnd(s)) { k2 = 'End-point: stays orange-brown'; v2 = `${s.endpoint} s · rate = 1 ÷ ${s.endpoint} = ${rate(s.endpoint)} s⁻¹`; }
    else if (n >= WELLS) v2 = 'None by 600 s: blue-black, starch remains';
    else if (n === 0) v2 = 'Not yet: first drop at 30 s';
    else v2 = wellKind(s, n - 1) === 'transition' ? 'Not yet: dark brown, little starch left' : 'Not yet: blue-black, starch present';
    return `<p><span class="readout-key">${k1}</span><span class="readout-value">${v1}</span></p><p><span class="readout-key">${k2}</span><span class="readout-value">${v2}</span></p>${resultsLine(s)}`;
  }

  /* ---------- 3D view (optional: the simulation runs without it) ---------- */
  const PITCH = 0.66, HOLE_R = 0.25, BEV = 0.04, TT = 0.2, TW = COLS * PITCH + 0.62, TD = ROWS * PITCH + 0.62;
  const TX = 0.95, BX = -2.45, BZ = -0.15; // tile centre x; beaker centre x/z
  const TOP = TT + 2 * BEV, RIM = TT + BEV; // tile top surface; rim of each bowl
  const BOWL_A = HOLE_R - BEV, BOWL_H = 0.12, BOWL_R = (BOWL_A * BOWL_A + BOWL_H * BOWL_H) / (2 * BOWL_H);
  const wellXZ = i => [TX + ((i % COLS) - (COLS - 1) / 2) * PITCH, (Math.floor(i / COLS) - (ROWS - 1) / 2) * PITCH];
  const bowlRadiusAt = depth => Math.sqrt(Math.max(0, BOWL_R * BOWL_R - Math.pow(BOWL_R - BOWL_H + depth, 2)));
  const easeIO = k => (k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2);

  function drawLabel(canvas, text, style, swatch) {
    const g = canvas.getContext('2d');
    const big = style === 'major' || style === 'gold' || style === 'clock';
    const fpx = big ? 44 : 38, pad = big ? 22 : 18, font = `${style === 'minor' || style === 'key' ? 600 : 700} ${fpx}px Montserrat, "Segoe UI", system-ui, sans-serif`;
    g.font = font;
    const icon = style === 'clock' ? fpx * 1.05 : swatch ? fpx * 0.95 : 0;
    const w = Math.ceil(g.measureText(text).width + pad * 2 + icon), h = Math.ceil(fpx * 1.62);
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; } else g.clearRect(0, 0, w, h);
    const bg = style === 'gold' || style === 'clock' ? HEX.navy : style === 'minor' || style === 'key' ? 'rgba(250,247,238,0.93)' : 'rgba(250,247,238,0.96)';
    const line = style === 'gold' ? HEX.gold : style === 'clock' ? HEX.navy : style === 'minor' || style === 'key' ? '#9a8f7a' : HEX.navy;
    const lw = style === 'gold' ? 6 : big ? 4 : 3;
    g.fillStyle = bg; g.strokeStyle = line; g.lineWidth = lw;
    g.beginPath(); if (g.roundRect) g.roundRect(lw / 2, lw / 2, w - lw, h - lw, h * 0.26); else g.rect(lw / 2, lw / 2, w - lw, h - lw); g.fill(); g.stroke();
    const ink = style === 'gold' || style === 'clock' ? '#fbf5e6' : HEX.navy;
    if (style === 'clock') { // small stopwatch glyph
      const cx = pad + fpx * 0.42, cy = h / 2 + 3, r = fpx * 0.36;
      g.strokeStyle = ink; g.lineWidth = 4; g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2); g.stroke();
      g.beginPath(); g.moveTo(cx, cy - r); g.lineTo(cx, cy - r - 6); g.moveTo(cx - 6, cy - r - 7); g.lineTo(cx + 6, cy - r - 7); g.stroke();
      g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + r * 0.55, cy - r * 0.55); g.stroke();
    }
    if (swatch) { const cx = pad + fpx * 0.36, cy = h / 2; g.fillStyle = swatch; g.strokeStyle = '#6f6656'; g.lineWidth = 3; g.beginPath(); g.arc(cx, cy, fpx * 0.34, 0, Math.PI * 2); g.fill(); g.stroke(); }
    g.font = font; g.fillStyle = ink; g.textBaseline = 'middle';
    g.fillText(text, pad + icon, h / 2 + 2);
    return w / h;
  }

  function buildView(host, T) {
    // Create the context ourselves so an unavailable GPU fails quietly (fallback SVG + readout remain).
    const cv = document.createElement('canvas'), attrs = { antialias: true, alpha: true, powerPreference: 'low-power', premultipliedAlpha: true };
    let gl = null;
    try { gl = cv.getContext('webgl2', attrs) || cv.getContext('webgl', attrs); } catch (_) { gl = null; }
    if (!gl) return null;
    let renderer;
    try { renderer = new T.WebGLRenderer({ canvas: cv, context: gl, antialias: true, alpha: true }); } catch (_) { return null; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = T.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0); renderer.autoClear = false;
    const canvas = renderer.domElement;
    canvas.tabIndex = 0; canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', 'Virtual amylase investigation: a spotting tile with 20 wells of iodine beside a water bath with a thermometer and the starch–amylase tube. Drag or use arrow keys to turn the bench. The readout describes the current results.');
    host.appendChild(canvas); host.classList.add('is-live');

    const geos = [], mats = [], texs = [], labels = [];
    const G = g => { geos.push(g); return g; }, M = m => { mats.push(m); return m; };
    const col = h => new T.Color(h);
    const scene = new T.Scene();
    const camera = new T.PerspectiveCamera(30, 1, 0.1, 200);
    scene.add(new T.HemisphereLight(0xffffff, 0xcdbfa4, 1.75));
    const keyL = new T.DirectionalLight(0xffffff, 2.2); keyL.position.set(-3.5, 7, 5); scene.add(keyL);
    const fillL = new T.DirectionalLight(0xfff1dc, 0.55); fillL.position.set(5, 3, -3); scene.add(fillL);

    /* soft contact shadows (canvas textures; no shadow maps, cheap on school laptops) */
    function shadowTexture(round) {
      const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d');
      if (round) { const gr = g.createRadialGradient(128, 128, 8, 128, 128, 126); gr.addColorStop(0, 'rgba(52,40,22,0.40)'); gr.addColorStop(0.5, 'rgba(52,40,22,0.20)'); gr.addColorStop(1, 'rgba(52,40,22,0)'); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); }
      else { g.shadowColor = 'rgba(52,40,22,0.46)'; g.shadowBlur = 22; g.shadowOffsetX = 1000; g.fillStyle = '#000'; g.beginPath(); if (g.roundRect) g.roundRect(40 - 1000, 40, 176, 176, 20); else g.rect(40 - 1000, 40, 176, 176); g.fill(); }
      const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; texs.push(t); return t;
    }
    const shadowGeo = G(new T.PlaneGeometry(1, 1)); shadowGeo.rotateX(-Math.PI / 2);
    const tileShadow = new T.Mesh(shadowGeo, M(new T.MeshBasicMaterial({ map: shadowTexture(false), transparent: true, depthWrite: false })));
    tileShadow.scale.set(TW * 256 / 176, 1, TD * 256 / 176); tileShadow.position.set(TX + 0.1, 0.002, 0.12); scene.add(tileShadow);
    const roundShadowMat = M(new T.MeshBasicMaterial({ map: shadowTexture(true), transparent: true, depthWrite: false }));
    const beakerShadow = new T.Mesh(shadowGeo, roundShadowMat); beakerShadow.scale.set(2.3, 1, 2.3); beakerShadow.position.set(BX + 0.12, 0.002, BZ + 0.1); scene.add(beakerShadow);

    /* ceramic spotting tile with 20 real wells (extruded shape with holes + a glazed bowl under each hole) */
    const shape = new T.Shape(); {
      const w = TW, d = TD, r = 0.26, x = -w / 2, y = -d / 2;
      shape.moveTo(x + r, y); shape.lineTo(x + w - r, y); shape.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false);
      shape.lineTo(x + w, y + d - r); shape.absarc(x + w - r, y + d - r, r, 0, Math.PI / 2, false);
      shape.lineTo(x + r, y + d); shape.absarc(x + r, y + d - r, r, Math.PI / 2, Math.PI, false);
      shape.lineTo(x, y + r); shape.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);
    }
    for (let i = 0; i < WELLS; i++) { const [x, z] = wellXZ(i); const hole = new T.Path(); hole.absarc(x - TX, -z, HOLE_R, 0, Math.PI * 2, true); shape.holes.push(hole); }
    const tileGeo = G(new T.ExtrudeGeometry(shape, { depth: TT, bevelEnabled: true, bevelThickness: BEV, bevelSize: BEV, bevelSegments: 3, curveSegments: 24 }));
    tileGeo.rotateX(-Math.PI / 2); tileGeo.translate(0, BEV, 0);
    const ceramic = M(new T.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3, metalness: 0 }));
    const tile = new T.Mesh(tileGeo, ceramic); tile.position.x = TX; scene.add(tile);
    const bowlPts = []; const phiMax = Math.asin(Math.min(1, BOWL_A / BOWL_R));
    for (let k = 0; k <= 10; k++) { const ph = phiMax * k / 10; bowlPts.push(new T.Vector2(Math.max(0.0001, BOWL_R * Math.sin(ph)), (BOWL_R - BOWL_H) - BOWL_R * Math.cos(ph))); }
    const bowlGeo = G(new T.LatheGeometry(bowlPts, 32));
    const bowlMat = M(new T.MeshStandardMaterial({ color: 0xf1efe9, roughness: 0.34, side: T.DoubleSide }));
    const liqGeo = G(new T.SphereGeometry(1, 28, 12));
    const LIQ_DEPTH = 0.045, LIQ_R = bowlRadiusAt(LIQ_DEPTH) * 0.98;
    const wells = [];
    for (let i = 0; i < WELLS; i++) {
      const [x, z] = wellXZ(i);
      const bowl = new T.Mesh(bowlGeo, bowlMat); bowl.position.set(x, RIM, z); scene.add(bowl);
      const mat = M(new T.MeshStandardMaterial({ color: col(HEX.iodine), roughness: 0.18, metalness: 0, emissive: col(HEX.iodine), emissiveIntensity: 0.12 }));
      const liq = new T.Mesh(liqGeo, mat); liq.position.set(x, RIM - LIQ_DEPTH - 0.012, z); liq.scale.set(LIQ_R, 0.042, LIQ_R); scene.add(liq);
      wells.push({ liq, mat, kind: null, tween: null, x, z });
    }
    const ringGeo = G(new T.TorusGeometry(HOLE_R + 0.07, 0.03, 10, 48)); ringGeo.rotateX(Math.PI / 2);
    const ring = new T.Mesh(ringGeo, M(new T.MeshStandardMaterial({ color: col(HEX.gold), roughness: 0.35, metalness: 0.2, emissive: col(HEX.gold), emissiveIntensity: 0.25 })));
    ring.visible = false; scene.add(ring);

    /* water bath: glass beaker, water, starch–amylase tube, thermometer */
    const glass = M(new T.MeshStandardMaterial({ color: 0xdcecf1, roughness: 0.06, transparent: true, opacity: 0.26, side: T.DoubleSide, depthWrite: false }));
    const glassRimMat = M(new T.MeshStandardMaterial({ color: 0xb3ccd4, roughness: 0.1, transparent: true, opacity: 0.8 }));
    const BH = 1.25, BR = 0.8;
    const beaker = new T.Mesh(G(new T.CylinderGeometry(BR, BR * 0.96, BH, 48, 1, true)), glass); beaker.position.set(BX, BH / 2, BZ); beaker.renderOrder = 3; scene.add(beaker);
    const beakerBase = new T.Mesh(G(new T.CircleGeometry(BR * 0.96, 48)), glass); beakerBase.rotation.x = -Math.PI / 2; beakerBase.position.set(BX, 0.01, BZ); scene.add(beakerBase);
    const beakerRim = new T.Mesh(G(new T.TorusGeometry(BR, 0.02, 8, 64)), glassRimMat); beakerRim.rotation.x = Math.PI / 2; beakerRim.position.set(BX, BH, BZ); scene.add(beakerRim);
    const waterMat = M(new T.MeshStandardMaterial({ color: 0x8cc7d8, roughness: 0.12, transparent: true, opacity: 0.4, depthWrite: false }));
    const WH = 0.9;
    const water = new T.Mesh(G(new T.CylinderGeometry(BR * 0.975, BR * 0.94, WH, 48)), waterMat); water.position.set(BX, WH / 2 + 0.02, BZ); water.renderOrder = 2; scene.add(water);
    // test tube with the starch–amylase mixture
    const TUBE_X = BX + 0.3, TUBE_Z = BZ + 0.05, TUBE_R = 0.14, TUBE_B = 0.16, TUBE_L = 1.3;
    const tubeGlass = new T.Mesh(G(new T.CylinderGeometry(TUBE_R, TUBE_R, TUBE_L, 24, 1, true)), glass); tubeGlass.position.set(TUBE_X, TUBE_B + TUBE_L / 2, TUBE_Z); tubeGlass.renderOrder = 4; scene.add(tubeGlass);
    const tubeBottom = new T.Mesh(G(new T.SphereGeometry(TUBE_R, 24, 10, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2)), glass); tubeBottom.position.set(TUBE_X, TUBE_B, TUBE_Z); scene.add(tubeBottom);
    const tubeRim = new T.Mesh(G(new T.TorusGeometry(TUBE_R, 0.014, 6, 32)), glassRimMat); tubeRim.rotation.x = Math.PI / 2; tubeRim.position.set(TUBE_X, TUBE_B + TUBE_L, TUBE_Z); scene.add(tubeRim);
    const mixMat = M(new T.MeshStandardMaterial({ color: col(HEX.mixture), roughness: 0.45, transparent: true, opacity: 0.94 }));
    const MIX_H = 0.72;
    const mix = new T.Mesh(G(new T.CylinderGeometry(TUBE_R * 0.86, TUBE_R * 0.86, MIX_H, 24)), mixMat); mix.position.set(TUBE_X, TUBE_B + MIX_H / 2, TUBE_Z); scene.add(mix);
    const mixBottom = new T.Mesh(G(new T.SphereGeometry(TUBE_R * 0.86, 20, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2)), mixMat); mixBottom.position.set(TUBE_X, TUBE_B, TUBE_Z); scene.add(mixBottom);
    // thermometer (red-dye column rises with temperature)
    const thermo = new T.Group(); thermo.position.set(BX - 0.38, 0.12, BZ - 0.22); thermo.rotation.z = 0.1; scene.add(thermo);
    const TH_L = 1.75;
    const thGlass = new T.Mesh(G(new T.CylinderGeometry(0.055, 0.055, TH_L, 20)), M(new T.MeshStandardMaterial({ color: 0xf4f8f9, roughness: 0.1, transparent: true, opacity: 0.55, depthWrite: false })));
    thGlass.position.y = TH_L / 2; thGlass.renderOrder = 5; thermo.add(thGlass);
    const redMat = M(new T.MeshStandardMaterial({ color: col(HEX.rose), roughness: 0.3, emissive: col(HEX.rose), emissiveIntensity: 0.25 }));
    const thBulb = new T.Mesh(G(new T.SphereGeometry(0.085, 20, 12)), redMat); thermo.add(thBulb);
    const colGeo = G(new T.CylinderGeometry(0.026, 0.026, 1, 12)); colGeo.translate(0, 0.5, 0);
    const thCol = new T.Mesh(colGeo, redMat); thermo.add(thCol);
    const tickMat = M(new T.MeshBasicMaterial({ color: col(HEX.navy) }));
    const tickGeo = G(new T.BoxGeometry(0.07, 0.012, 0.012));
    const colFor = t => 0.1 + (t / 70) * (TH_L - 0.2);
    const TH_TOP = 0.12 + TH_L;
    [0, 20, 40, 60].forEach(t => { const tk = new T.Mesh(tickGeo, tickMat); tk.position.set(0.04, colFor(t), 0.045); thermo.add(tk); });

    /* pipette and falling drop */
    const pip = new T.Group(); scene.add(pip);
    const stemGeo = G(new T.CylinderGeometry(0.034, 0.012, 0.8, 16)); stemGeo.translate(0, 0.4, 0);
    const stem = new T.Mesh(stemGeo, M(new T.MeshStandardMaterial({ color: 0xe8f1f4, roughness: 0.1, transparent: true, opacity: 0.8 }))); pip.add(stem);
    const bulb = new T.Mesh(G(new T.SphereGeometry(1, 20, 14)), M(new T.MeshStandardMaterial({ color: col(HEX.navy), roughness: 0.5 }))); bulb.scale.set(0.1, 0.17, 0.1); bulb.position.y = 0.93; pip.add(bulb);
    const drop = new T.Mesh(G(new T.SphereGeometry(0.05, 14, 10)), M(new T.MeshStandardMaterial({ color: col(HEX.mixture), roughness: 0.2, emissive: col(HEX.mixture), emissiveIntensity: 0.2 }))); drop.visible = false; scene.add(drop);
    const HOME = new T.Vector3(TUBE_X, TUBE_B + 0.42, TUBE_Z), TUBE_HIGH = new T.Vector3(TUBE_X, TUBE_B + TUBE_L + 0.12, TUBE_Z), TUBE_LOW = new T.Vector3(TUBE_X, TUBE_B + 0.34, TUBE_Z);
    const TIP_H = TOP + 0.62;
    const wellHigh = i => { const [x, z] = wellXZ(i); return new T.Vector3(x, TIP_H, z); };

    /* labels: canvas-texture sprites sized in screen pixels. World labels sit on the bench; HUD labels (stopwatch,
       colour key) sit in a screen-space overlay so they never collide with the apparatus. */
    const hud = new T.Scene(), hudCam = new T.OrthographicCamera(0, 1, 1, 0, -10, 10);
    function makeLabel(text, style, opt = {}) {
      const c = document.createElement('canvas');
      const mat = M(new T.SpriteMaterial({ transparent: true, depthTest: false, depthWrite: false }));
      const sprite = new T.Sprite(mat); sprite.renderOrder = 20;
      if (opt.center) sprite.center.set(opt.center[0], opt.center[1]);
      const L = { sprite, style, minor: style === 'minor' || style === 'key', hud: !!opt.hud, text: null, tex: null, aspect: 1, swatch: opt.swatch };
      L.set = t => {
        if (t === L.text) return false; L.text = t;
        const ow = c.width, oh = c.height; L.aspect = drawLabel(c, t, style, L.swatch);
        if (!L.tex || c.width !== ow || c.height !== oh) { if (L.tex) L.tex.dispose(); L.tex = new T.CanvasTexture(c); L.tex.colorSpace = T.SRGBColorSpace; mat.map = L.tex; mat.needsUpdate = true; }
        else L.tex.needsUpdate = true;
        scale(L); return true;
      };
      L.redraw = () => { const t = L.text; L.text = null; L.set(t); };
      labels.push(L); (L.hud ? hud : scene).add(sprite); L.set(text); return L;
    }
    let worldPerPx = 0.01, small = false;
    const pxOf = L => (L.minor ? (small ? 14 : 16) : small ? 16 : 20);
    function scale(L) { const h = pxOf(L) * (L.hud ? 1 : worldPerPx); L.sprite.scale.set(h * L.aspect, h, 1); }
    const bathLabel = makeLabel('Water bath 40 °C', 'major', { center: [0.5, 0] }); bathLabel.sprite.position.set(BX - 0.3, TH_TOP + 0.1, BZ - 0.1);
    const tubeLabel = makeLabel('tube: starch + amylase', 'minor', { center: [0.5, 1] }); tubeLabel.sprite.position.set(BX + 0.05, -0.02, BZ + BR + 0.22);
    const endLabel = makeLabel('End-point 90 s', 'gold', { center: [0.5, 1], hud: true }); endLabel.sprite.visible = false;
    const noneLabel = makeLabel('No end-point by 600 s', 'major', { center: [0.5, 1], hud: true }); noneLabel.sprite.visible = false;
    const rowLabels = [];
    for (let r = 0; r < ROWS; r++) { const L = makeLabel(`${(r * COLS + 1) * SAMPLE}–${(r + 1) * COLS * SAMPLE} s`, 'minor', { center: [0, 0.5] }); L.sprite.position.set(TX + TW / 2 + 0.1, TOP, wellXZ(r * COLS)[1]); rowLabels.push(L); }
    const clockLabel = makeLabel('00:00', 'clock', { center: [1, 1], hud: true });
    const keyA = makeLabel('blue-black: starch present', 'key', { swatch: HEX.blueBlack, center: [0, 0], hud: true });
    const keyB = makeLabel('orange-brown: no starch left', 'key', { swatch: HEX.iodine, center: [0, 0], hud: true });
    function layoutHud() {
      hudCam.left = 0; hudCam.right = W; hudCam.top = H; hudCam.bottom = 0; hudCam.updateProjectionMatrix();
      clockLabel.sprite.position.set(W - 8, H - 8, 0);
      tmpV.set(TX, TOP, -TD / 2).project(camera);
      const hw = Math.max(endLabel.sprite.scale.x, noneLabel.sprite.scale.x) / 2, cx = Math.min(W - clockLabel.sprite.scale.x - 16 - hw, Math.max(hw + 6, (tmpV.x + 1) / 2 * W));
      endLabel.sprite.position.set(cx, H - 8, 0); noneLabel.sprite.position.set(cx, H - 8, 0);
      const wa = keyA.sprite.scale.x, wb = keyB.sprite.scale.x, gap = 12, x0 = Math.max(6, (W - wa - wb - gap) / 2);
      keyA.sprite.position.set(x0, 6, 0); keyB.sprite.position.set(x0 + wa + gap, 6, 0);
    }

    /* camera: gentle clamped orbit; an iterative screen-space fit keeps apparatus + labels inside the host */
    let yaw = 0, pitch = 0.9, W = 1, H = 1;
    const target = new T.Vector3(), tmpV = new T.Vector3();
    const P = (x, y, z, L) => ({ p: new T.Vector3(x, y, z), L });
    const PIP_TOP = 1.12;
    const basePts = [];
    for (const x of [TX - TW / 2, TX + TW / 2]) for (const y of [0, TOP]) for (const z of [-TD / 2, TD / 2]) basePts.push(P(x, y, z));
    for (const y of [0, BH]) { basePts.push(P(BX - BR, y, BZ), P(BX + BR, y, BZ), P(BX, y, BZ - BR), P(BX, y, BZ + BR)); }
    basePts.push(P(TUBE_HIGH.x, TUBE_HIGH.y + PIP_TOP, TUBE_HIGH.z), P(HOME.x, HOME.y + PIP_TOP, HOME.z));
    function fitPoints() {
      const pts = basePts.concat([P(bathLabel.sprite.position.x, bathLabel.sprite.position.y, bathLabel.sprite.position.z, bathLabel)]);
      const [x0, z0] = wellXZ(0), [x4] = wellXZ(COLS - 1);
      for (const x of [x0, x4]) { // pipette above the back row, and at the top of its arc from the tube
        pts.push(P(x, TIP_H + PIP_TOP + 0.03, z0));
        pts.push(P((TUBE_HIGH.x + x) / 2, (TUBE_HIGH.y + TIP_H) / 2 + 0.36 + PIP_TOP, (TUBE_HIGH.z + z0) / 2));
      }
      if (!small) { pts.push(P(tubeLabel.sprite.position.x, tubeLabel.sprite.position.y, tubeLabel.sprite.position.z, tubeLabel)); rowLabels.forEach(L => pts.push(P(L.sprite.position.x, L.sprite.position.y, L.sprite.position.z, L))); }
      return pts;
    }
    function fit() {
      const aspect = W / H; camera.aspect = aspect; camera.updateProjectionMatrix();
      const back = new T.Vector3(Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), Math.cos(yaw) * Math.cos(pitch));
      const right = new T.Vector3(0, 1, 0).cross(back).normalize(), up = back.clone().cross(right);
      const tanV = Math.tan(T.MathUtils.degToRad(camera.fov / 2));
      const pts = fitPoints();
      const padL = 6, padR = 6, padT = small ? 6 : 8, padB = small ? 6 : 34; // bottom band holds the colour key
      target.set(-0.4, 0.9, 0); let d = 14;
      for (let it = 0; it < 8; it++) {
        camera.position.copy(target).addScaledVector(back, d); camera.up.set(0, 1, 0); camera.lookAt(target); camera.updateMatrixWorld();
        let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
        for (const q of pts) {
          tmpV.copy(q.p).project(camera);
          const sx = (tmpV.x + 1) / 2 * W, sy = (1 - tmpV.y) / 2 * H;
          let l = 0, r = 0, t = 0, b = 0;
          if (q.L) { const h = pxOf(q.L), w = h * q.L.aspect, c = q.L.sprite.center; l = c.x * w; r = (1 - c.x) * w; t = (1 - c.y) * h; b = c.y * h; }
          x0 = Math.min(x0, sx - l); x1 = Math.max(x1, sx + r); y0 = Math.min(y0, sy - t); y1 = Math.max(y1, sy + b);
        }
        const wpp = (2 * d * tanV) / H;
        const cx = (x0 + x1) / 2 - (padL + W - padR) / 2, cy = (y0 + y1) / 2 - (padT + H - padB) / 2;
        target.addScaledVector(right, cx * wpp).addScaledVector(up, -cy * wpp);
        const k = Math.max((x1 - x0) / (W - padL - padR), (y1 - y0) / (H - padT - padB));
        d *= it < 7 ? k : Math.max(1, k);
      }
      camera.position.copy(target).addScaledVector(back, d); camera.lookAt(target); camera.updateMatrixWorld();
      worldPerPx = (2 * d * tanV) / H;
      labels.forEach(scale); layoutHud();
    }
    function resize() {
      const r = host.getBoundingClientRect(); if (!r.width || !r.height) return;
      W = r.width; H = r.height; small = H < 215 || W < 340;
      renderer.setSize(W, H, false);
      rowLabels.forEach(L => { L.sprite.visible = !small; }); keyA.sprite.visible = keyB.sprite.visible = !small; tubeLabel.sprite.visible = !small;
      fit(); dirty = true; draw();
    }
    /* per-frame sync (pure function of state + short colour tweens) */
    const kindColour = k => (k === 'starch' ? HEX.blueBlack : k === 'transition' ? HEX.darkBrown : HEX.iodine);
    let dirty = true, thermoNow = null, thermoTween = null, ringTween = null, lastClock = '', lastTemp = null, lastBoiled = null;
    const tmpC = new T.Color();
    function setWell(w, k) { const h = kindColour(k); w.mat.color.set(h); w.mat.emissive.set(h); const full = k !== 'unused'; w.liq.scale.set(LIQ_R * (full ? 1.05 : 1), full ? 0.05 : 0.042, LIQ_R * (full ? 1.05 : 1)); w.liq.position.y = RIM - LIQ_DEPTH - (full ? 0.004 : 0.012); }
    function pipettePose(s, out) {
      const n = num(s.samples), st = status(s);
      if (reduce() || st === 'ready' || st === 'done' || n >= WELLS) { out.copy(HOME); return -1; }
      const ph = (((num(s.t) % SAMPLE) + SAMPLE) % SAMPLE) / SAMPLE;
      const prev = n === 0 ? HOME : wellHigh(n - 1), tgt = wellHigh(n);
      const arc = (a, b, k, hgt) => { out.copy(a).lerp(b, k); out.y += Math.sin(k * Math.PI) * hgt; };
      if (ph < 0.25) arc(prev, TUBE_HIGH, easeIO(ph / 0.25), 0.25);
      else if (ph < 0.45) { out.copy(TUBE_HIGH).lerp(TUBE_LOW, Math.sin(((ph - 0.25) / 0.2) * Math.PI)); }
      else if (ph < 0.8) arc(TUBE_HIGH, tgt, easeIO((ph - 0.45) / 0.35), 0.35);
      else out.copy(tgt);
      return ph;
    }
    const pose = new T.Vector3();
    function frame(s, now) {
      ensure(s);
      let animating = false;
      const Tn = tempOf(s);
      if (Tn !== lastTemp || !!s.boiled !== lastBoiled) {
        bathLabel.set(`Water bath ${Tn} °C`); tubeLabel.set(s.boiled ? 'tube: starch + boiled amylase' : 'tube: starch + amylase');
        const to = colFor(Tn);
        if (thermoNow === null || reduce()) { thermoNow = to; thermoTween = null; } else thermoTween = { from: thermoNow, to, t0: now, dur: 700 };
        lastTemp = Tn; lastBoiled = !!s.boiled; dirty = true;
      }
      if (thermoTween) { const k = Math.min(1, (now - thermoTween.t0) / thermoTween.dur); thermoNow = thermoTween.from + (thermoTween.to - thermoTween.from) * easeIO(k); if (k >= 1) thermoTween = null; else animating = true; dirty = true; }
      thCol.scale.y = thermoNow;
      // wells
      for (let i = 0; i < WELLS; i++) {
        const w = wells[i], k = wellKind(s, i);
        if (k !== w.kind) {
          if (w.kind === null || k === 'unused' || reduce()) { setWell(w, k); w.tween = null; }
          else { w.tween = { from: w.mat.color.clone(), to: col(kindColour(k)), t0: now, dur: 420 }; setWell(w, k); w.mat.color.copy(w.tween.from); w.mat.emissive.copy(w.tween.from); }
          w.kind = k; dirty = true;
        }
        if (w.tween) {
          const q = Math.min(1, (now - w.tween.t0) / w.tween.dur);
          tmpC.copy(w.tween.from).lerp(w.tween.to, easeIO(q)); w.mat.color.copy(tmpC); w.mat.emissive.copy(tmpC);
          const pulse = 1 + 0.12 * Math.sin(q * Math.PI); w.liq.scale.x = w.liq.scale.z = LIQ_R * 1.05 * pulse;
          if (q >= 1) w.tween = null; else animating = true; dirty = true;
        }
      }
      // end-point ring + label
      const endIdx = hasEnd(s) ? Math.round(s.endpoint / SAMPLE) - 1 : -1;
      if (endIdx >= 0 && endIdx < WELLS) {
        const [x, z] = wellXZ(endIdx);
        if (!ring.visible) { ring.visible = true; ringTween = reduce() ? null : { t0: now, dur: 450 }; ring.scale.setScalar(1); }
        ring.position.set(x, TOP + 0.005, z);
        if (endLabel.set(`End-point ${s.endpoint} s`)) layoutHud(); endLabel.sprite.visible = true; dirty = true;
      } else if (ring.visible || endLabel.sprite.visible) { ring.visible = false; endLabel.sprite.visible = false; ringTween = null; dirty = true; }
      if (ringTween) { const k = Math.min(1, (now - ringTween.t0) / ringTween.dur); ring.scale.setScalar(0.6 + 0.4 * easeIO(k)); if (k >= 1) ringTween = null; else animating = true; dirty = true; }
      const none = finished(s) && !hasEnd(s);
      if (noneLabel.sprite.visible !== none) { noneLabel.sprite.visible = none; dirty = true; }
      // pipette + drop
      const ph = pipettePose(s, pose);
      if (!pip.position.equals(pose)) { pip.position.copy(pose); dirty = true; }
      const showDrop = ph >= 0.8 && ph < 0.97;
      if (showDrop) { const k = (ph - 0.8) / 0.17; const w = wells[Math.min(WELLS - 1, num(s.samples))]; drop.position.set(w.x, pose.y - 0.03 - (pose.y - 0.03 - (RIM - 0.02)) * k * k, w.z); dirty = true; }
      if (drop.visible !== showDrop) { drop.visible = showDrop; dirty = true; }
      // stopwatch
      const clockText = `${mmss(s.t)}${status(s) === 'paused' ? ' paused' : ''}`;
      if (clockText !== lastClock) { clockLabel.set(clockText); lastClock = clockText; dirty = true; }
      if (dirty) draw();
      return animating;
    }
    function draw() { dirty = false; renderer.clear(); renderer.render(scene, camera); renderer.clearDepth(); renderer.render(hud, hudCam); }

    /* pointer + keyboard rotation (clamped so the tile always stays readable) */
    let drag = null;
    const clampView = () => { yaw = Math.max(-0.6, Math.min(0.6, yaw)); pitch = Math.max(0.5, Math.min(1.25, pitch)); fit(); draw(); };
    const onDown = e => { drag = [e.clientX, e.clientY]; try { canvas.setPointerCapture(e.pointerId); } catch (_) {} };
    const onMove = e => { if (!drag) return; yaw -= (e.clientX - drag[0]) * 0.006; pitch += (e.clientY - drag[1]) * 0.005; drag = [e.clientX, e.clientY]; clampView(); };
    const onUp = () => { drag = null; };
    const onKey = e => {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) return;
      e.preventDefault(); e.stopPropagation();
      if (e.key === 'ArrowLeft') yaw += 0.1; if (e.key === 'ArrowRight') yaw -= 0.1; if (e.key === 'ArrowUp') pitch += 0.08; if (e.key === 'ArrowDown') pitch -= 0.08;
      clampView();
    };
    canvas.addEventListener('pointerdown', onDown); canvas.addEventListener('pointermove', onMove); canvas.addEventListener('pointerup', onUp); canvas.addEventListener('pointercancel', onUp); canvas.addEventListener('keydown', onKey);
    const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(resize) : null; if (observer) observer.observe(host);
    let fontsAlive = true;
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (!fontsAlive) return; labels.forEach(L => L.redraw()); fit(); draw(); }).catch(() => {});
    resize();

    return {
      frame,
      dispose() {
        fontsAlive = false;
        if (observer) observer.disconnect();
        canvas.removeEventListener('pointerdown', onDown); canvas.removeEventListener('pointermove', onMove); canvas.removeEventListener('pointerup', onUp); canvas.removeEventListener('pointercancel', onUp); canvas.removeEventListener('keydown', onKey);
        labels.forEach(L => { if (L.tex) L.tex.dispose(); });
        texs.forEach(t => t.dispose()); geos.forEach(g => g.dispose()); mats.forEach(m => m.dispose());
        renderer.dispose(); try { renderer.forceContextLoss(); } catch (_) {}
        canvas.remove(); host.classList.remove('is-live');
      }
    };
  }

  return {
    caption: 'Each well is one 30 s sample into iodine. Illustrative data; simulated time runs 15× faster. Drag or use arrow keys to turn the bench.',
    defaults: { temp: 40, boiled: false, running: false, t: 0, samples: 0, endpoint: null, results: {} },
    controls,
    readout,
    onChange(key, s) { ensure(s); if (key === 'temp' || key === 'boiled') clearRun(s); },
    command(c, s) {
      ensure(s);
      if (c === 'run') { if (s.running) s.running = false; else { if (finished(s)) clearRun(s); s.running = true; } }
      if (c === 'reset') { clearRun(s); s.results = {}; }
    },
    mount(host, state, phase, ctx) {
      let s = state; ensure(s);
      let view = null;
      const T = window.THREE;
      if (T && T.WebGLRenderer) { try { view = buildView(host, T); } catch (err) { view = null; if (window.console) console.warn('spotTile: 3D view unavailable', err); host.querySelector('canvas') && host.querySelector('canvas').remove(); host.classList.remove('is-live'); } }
      // The simulation clock lives here so it works with or without WebGL.
      let raf = 0, last = 0, visible = !document.hidden, disposed = false;
      function tick(now) {
        raf = 0; if (disposed) return;
        const dt = last ? Math.min(1, Math.max(0, (now - last) / 1000)) : 0; last = now;
        if (s.running) advance(s, dt, ctx);
        const animating = view ? view.frame(s, now) : false;
        if ((s.running || animating) && visible) raf = requestAnimationFrame(tick); else last = 0;
      }
      function kick() { if (!raf && visible && !disposed) raf = requestAnimationFrame(tick); }
      if (view) view.frame(s, performance.now());
      kick();
      return {
        update(ns) { if (ns && typeof ns === 'object') s = ns; ensure(s); kick(); },
        command() { last = 0; kick(); },
        visibility(v) { visible = !!v; if (!visible) { cancelAnimationFrame(raf); raf = 0; last = 0; } else kick(); },
        dispose() { disposed = true; cancelAnimationFrame(raf); raf = 0; if (view) { try { view.dispose(); } catch (_) {} view = null; } }
      };
    }
  };
})();
