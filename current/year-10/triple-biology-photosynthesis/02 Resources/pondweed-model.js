/* Pondweed lab (Lesson 02 · Pearson 4XBI1 2.20, 2.23 oxygen evolution). A simulated investigation, not an answer generator.
   Pupils choose what to investigate (light intensity, CO₂ concentration as NaHCO₃, or temperature), commit a prediction,
   then run 5-minute collections (simulated time 60× faster: 5 s). Each run at the same conditions is repeat 1 → 2 → 3, then
   wraps to 1. The model shows MEASUREMENTS ONLY: no means, graphs, fitted curves or conclusions. Pupils record, calculate and
   plot in their books or on the results sheet.
   Data (the lesson’s simulated dataset, deterministic on every device):
     V(I, C, T) = 2.5 × NRH(0.075·I, Pmax(C)·Tf(T)), NRH(a, p) = ((a+p) − √((a+p)² − 4·0.9·a·p)) / (2·0.9);
     Pmax: 0.1 % → 2.0 · 0.5 % → 3.6 · 1.0 % → 5.0; Tf: 10 → 0.30 · 15 → 0.45 · 20 → 0.62 · 25 → 0.82 · 30 → 1.00 · 35 → 0.88 ·
     40 → 0.50 · 45 → 0.15 · 50 → 0; each repeat × (1 + e), e = an integer hash of (I, C×10, T, repeat) mapped to −4…+4 %;
     planned anomaly (never announced): I 60 %, C 0.5 %, T 25 °C, repeat 2 × 0.55 (a leaking bung). Rounded to 0.1 cm³.
   State: {investigate, I, C, T, prediction, running, repeat, results, showFixed, t, pending, last}.
   The run clock lives in the mounted instance, so runs and the readout work without WebGL.
   Original Three.js geometry (r160, global THREE). No network calls, no storage. */
window.LessonModels = window.LessonModels || {};
window.LessonModels.pondweed = (() => {
  const reduce = () => !!(typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* ---------- the simulated dataset ---------- */
  const LIGHTS = [0, 20, 40, 60, 80, 100], CO2S = [0.1, 0.5, 1.0], TEMPS = [10, 15, 20, 25, 30, 35, 40, 45, 50];
  const PMAX = { 1: 2.0, 5: 3.6, 10: 5.0 };                       // keyed by C × 10
  const TF = { 10: 0.30, 15: 0.45, 20: 0.62, 25: 0.82, 30: 1.00, 35: 0.88, 40: 0.50, 45: 0.15, 50: 0.00 };
  const THETA = 0.9, SEED = Math.imul(131, 2654435761) >>> 0;
  const nrh = (a, p) => { if (!(a > 0) || !(p > 0)) return 0; const s = a + p; return (s - Math.sqrt(s * s - 4 * THETA * a * p)) / (2 * THETA); };
  const c10 = C => Math.round(Number(C) * 10);
  const trueVolume = (I, C, T) => 2.5 * nrh(0.075 * I, (PMAX[c10(C)] || 0) * (TF[T] === undefined ? 0 : TF[T]));
  /* deterministic repeat variation: FNV-1a style integer hash of (I, C×10, T, repeat) → whole-number percentage in [−4, +4] */
  function wobble(I, C, T, r) {
    let h = SEED;
    for (const v of [I, c10(C), T, r]) { h = (h ^ v) >>> 0; h = Math.imul(h, 16777619) >>> 0; }
    h = (h ^ (h >>> 13)) >>> 0; h = Math.imul(h, 0x5bd1e995) >>> 0; h = (h ^ (h >>> 15)) >>> 0;
    return (h % 9) - 4;
  }
  const isAnomaly = (I, C, T, r) => I === 60 && c10(C) === 5 && T === 25 && r === 2;
  function volume(I, C, T, r) {
    let v = trueVolume(I, C, T) * (1 + wobble(I, C, T, r) / 100);
    if (isAnomaly(I, C, T, r)) v *= 0.55;
    return Math.round(v * 10) / 10;
  }

  /* ---------- state logic ---------- */
  const INV = {
    light: { key: 'I', values: LIGHTS, label: 'Light intensity / %', short: 'Light', word: 'the light intensity', unit: '%' },
    co2: { key: 'C', values: CO2S, label: 'NaHCO₃ (CO₂ supply) / %', short: 'CO₂', word: 'the CO₂ concentration', unit: '%' },
    temperature: { key: 'T', values: TEMPS, label: 'Water-bath temperature / °C', short: 'Temp.', word: 'the temperature', unit: '°C' }
  };
  const PRED = [['steady', 'Rises steadily'], ['plateau', 'Rises then levels off'], ['peak', 'Rises then falls'], ['same', 'Stays the same']];
  const predLabel = k => (PRED.find(p => p[0] === k) || [null, null])[1];
  const RUN_S = 300, SPEED = 60;
  const num = v => (typeof v === 'number' && isFinite(v) ? v : 0);
  const snap = (v, list) => list.reduce((a, b) => (Math.abs(b - num(v)) < Math.abs(a - num(v)) ? b : a), list[0]);
  const fmtC = C => Number(C).toFixed(1);
  const fmt = (k, v) => (k === 'I' ? `${v} %` : k === 'C' ? `${fmtC(v)} %` : `${v} °C`);
  const keyOf = s => `${s.I}|${c10(s.C)}|${s.T}`;
  function ensure(s) {
    if (!INV[s.investigate]) s.investigate = 'light';
    s.I = snap(s.I === undefined ? 60 : s.I, LIGHTS); s.C = snap(s.C === undefined ? 0.5 : s.C, CO2S); s.T = snap(s.T === undefined ? 25 : s.T, TEMPS);
    if (!s.repeat || typeof s.repeat !== 'object') s.repeat = {};
    if (!Array.isArray(s.results)) s.results = [];
    if (!PRED.some(p => p[0] === s.prediction)) s.prediction = null;
    s.t = num(s.t);
  }
  const nextRepeat = s => ((s.repeat[keyOf(s)] || 0) % 3) + 1;
  const sameCond = (r, s) => !!r && r.I === s.I && c10(r.C) === c10(s.C) && r.T === s.T;
  function start(s) {
    ensure(s);
    if (s.running || !s.prediction) return false;
    const repeat = nextRepeat(s);
    s.pending = { inv: s.investigate, I: s.I, C: s.C, T: s.T, repeat, V: volume(s.I, s.C, s.T, repeat) };
    s.running = true; s.t = 0;
    return true;
  }
  function finish(s, ctx) {
    const r = s.pending; if (!r) { s.running = false; return; }
    s.results.push(r); s.repeat[`${r.I}|${c10(r.C)}|${r.T}`] = r.repeat; s.last = r;
    s.pending = null; s.running = false; s.t = RUN_S;
    if (ctx && ctx.announce) ctx.announce(`Repeat ${r.repeat}: ${r.V.toFixed(1)} cubic centimetres of gas collected in 5 minutes. Simulated data.${r.repeat === 3 ? ' Three repeats done.' : ''}`);
  }
  function advance(s, dt, ctx) {
    if (!s.running) return;
    const before = Math.floor(num(s.t) / 60);
    s.t = num(s.t) + dt * SPEED;
    if (s.t >= RUN_S) { finish(s, ctx); if (ctx && ctx.refresh) ctx.refresh(); return; }
    if (Math.floor(s.t / 60) !== before && ctx && ctx.refresh) ctx.refresh();
  }
  function clearAll(s) { s.results = []; s.repeat = {}; s.last = null; s.pending = null; s.running = false; s.t = 0; }

  /* ---------- controls and readout (pure HTML; work without WebGL) ---------- */
  const STYLE_ID = 'pondweed-model-style';
  if (typeof document !== 'undefined' && document.head && !document.getElementById(STYLE_ID)) {
    const st = document.createElement('style'); st.id = STYLE_ID;
    st.textContent = `
.pw-row{flex-wrap:nowrap!important}
.pw-row .control-label{flex:0 0 auto}
.pw-fill button{flex:1 1 0;min-width:0;padding-left:3px!important;padding-right:3px!important}
.pw-vals{flex-wrap:wrap!important}
.pw-vals .control-label{flex-basis:100%}
.pw-vals button{flex:1 1 0;min-width:0;padding-left:2px!important;padding-right:2px!important}
.pw-pred{display:grid!important;grid-template-columns:1fr 1fr;gap:6px!important}
.pw-pred .pw-q{grid-column:1/-1;text-transform:none!important;letter-spacing:0!important;font-size:.62em!important;color:#182944!important;line-height:1.25;margin:0!important}
.pw-pred button{line-height:1.15}
.pw-actions button.is-primary{flex:1.6 1 0}
.pw-actions button[disabled]{opacity:.55;cursor:not-allowed}
.model-readout .pw-sub{font-size:.82em}
.model-readout .pw-list{font:600 .68em/1.35 var(--sans,system-ui);color:#182944}
.workspace.has-drawer .model-readout p{margin-bottom:5px}
.workspace.has-drawer .pw-pred .pw-q{font-size:.6em!important}
.workspace.has-drawer #model-controls button{padding:6px 5px!important;min-height:42px}
.workspace.has-drawer .model-panel .bio-controls{margin-top:6px;gap:5px}
.workspace.has-drawer .pw-actions{flex-wrap:wrap!important}
.workspace.has-drawer .pw-actions button.is-primary{flex:1 1 100%}
.workspace.has-drawer .screen-model3d .model-col .do-this{grid-template-columns:1fr;gap:2px}
@media (min-width:761px){.workspace:not(.has-drawer) .model-view[data-model="pondweed"]{height:31vh}}`;
    document.head.appendChild(st);
  }
  const attr = s => (s.running ? ' disabled' : '');
  const btn = (label, value, pressed, extra = '') => `<button type="button" data-action="model" data-value="${value}" aria-pressed="${pressed}"${extra}>${label}</button>`;
  const cmd = (label, value, extra = '') => `<button type="button" data-action="model-cmd" data-value="${value}"${extra}>${label}</button>`;
  function controls(p, s) {
    ensure(s);
    const inv = INV[s.investigate], dis = attr(s);
    let h = `<div class="control-group pw-row pw-fill" role="group" aria-label="Choose what to investigate"><span class="control-label">Investigate</span>${Object.entries(INV).map(([k, v]) => btn(v.short, `investigate=${k}`, s.investigate === k, dis)).join('')}</div>`;
    if (!s.prediction) h += `<div class="control-group pw-pred" role="group" aria-label="Your prediction"><p class="control-label pw-q">Before you run: what will happen to the volume of gas as you increase ${inv.word}?</p>${PRED.map(([k, l]) => btn(l, `prediction=${k}`, false, dis)).join('')}</div>`;
    else h += `<div class="control-group pw-vals" role="group" aria-label="${inv.label}"><span class="control-label">${inv.label}</span>${inv.values.map(v => btn(inv.key === 'C' ? fmtC(v) : String(v), `${inv.key}=${v}`, s[inv.key] === v, `${dis} aria-label="${fmt(inv.key, v)}"`)).join('')}</div>`;
    const runLabel = s.running ? 'Running…' : 'Run 5 minutes';
    h += `<div class="control-group pw-row pw-fill pw-actions">${cmd(runLabel, 'run', ` class="is-primary"${s.running || !s.prediction ? ' disabled' : ''}${!s.prediction ? ' title="Choose a prediction first"' : ''}`)}${cmd('Clear results', 'reset', `${dis} aria-label="Clear results: remove all runs so far"`)}${cmd(s.showFixed ? 'Hide fixed' : 'Fixed conditions', 'fixed', `${dis} aria-expanded="${!!s.showFixed}" aria-label="Change fixed conditions"`)}</div>`;
    if (s.showFixed) {
      const others = ['I', 'C', 'T'].filter(k => k !== inv.key);
      h += `<div class="control-group pw-row pw-fill" role="group" aria-label="Fixed conditions"><span class="control-label">Fixed</span>${others.map(k => cmd(`${k === 'I' ? 'Light' : k === 'C' ? 'NaHCO₃' : 'Temp.'} ${fmt(k, s[k])} ▸`, `cycle${k}`, `${dis} aria-label="Change the fixed ${k === 'I' ? 'light intensity' : k === 'C' ? 'NaHCO₃ concentration' : 'temperature'}; now ${fmt(k, s[k])}"`)).join('')}</div>`;
    }
    return h;
  }
  function readout(p, s) {
    ensure(s);
    const inv = INV[s.investigate];
    const cond = `Light ${s.I} % · NaHCO₃ ${fmtC(s.C)} % · ${s.T} °C`;
    let key, val;
    if (s.running && s.pending) { key = `Repeat ${s.pending.repeat} · ${cond}`; val = `Running: ${Math.min(5, Math.floor(num(s.t) / 60))} of 5 min (simulated)`; }
    else if (sameCond(s.last, s)) { key = `Repeat ${s.last.repeat} · ${cond}`; val = `Gas collected: ${s.last.V.toFixed(1)} cm³ in 5 min (simulated data)${s.last.repeat === 3 ? ' · 3 repeats done' : ''}`; }
    else if (!s.prediction) { key = cond; val = 'Choose a prediction first'; }
    else { key = `Next: repeat ${nextRepeat(s)} · ${cond}`; val = 'Choose a value, then press Run'; }
    let h = `<p><span class="readout-key">${key}</span><span class="readout-value">${val}</span></p>`;
    if (s.prediction) h += `<p><span class="readout-key">Your prediction</span><span class="readout-value pw-sub">${predLabel(s.prediction)}</span></p>`;
    const others = ['I', 'C', 'T'].filter(k => k !== inv.key);
    const mine = s.results.filter(r => r.inv === s.investigate && others.every(k => (k === 'C' ? c10(r.C) === c10(s.C) : r[k] === s[k]))).slice(-6);
    if (mine.length) h += `<p><span class="readout-key">Results so far · ${inv.short.toLowerCase()} → cm³ (last ${mine.length})</span><span class="pw-list">${mine.map(r => `${fmt(inv.key, r[inv.key])}: ${r.V.toFixed(1)}`).join(' · ')}</span></p>`;
    return h;
  }

  /* ---------- 3D view (optional: the simulation runs without it) ---------- */
  const HEX = { navy: '#182944', light: '#d8b23a', co2: '#6b7280', o2: '#24748d', water: '#3d7cc9', chloro: '#56834b', gold: '#bd8126', rose: '#ad5c63', rubber: '#3a3f4a', paper: '#faf7ee', bench: '#e7dcc4' };
  const easeIO = k => (k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2);
  const BX = 0, BR = 0.95, BH = 1.7;           // water bath
  const TX = -0.2, TR = 0.2, TB = 0.14, TL = 2.2, SOL = 2.2; // boiling tube (bottom, length, solution surface)
  const SX0 = 1.8, SX1 = 3.5, SY = 2.0, SR = 0.16, S0 = 1.9, SPC = 0.125; // gas syringe: scale 0–12 cm³ from S0, 0.125 per cm³
  const LX = -3.1;                               // lamp
  const CUT = 1.6;                              // cut end of the stem

  function drawLabel(canvas, text, style) {
    const g = canvas.getContext('2d');
    const big = style !== 'minor', fpx = big ? 42 : 36, pad = big ? 22 : 18;
    const font = `${big ? 700 : 600} ${fpx}px Montserrat, "Segoe UI", system-ui, sans-serif`;
    g.font = font;
    const w = Math.ceil(g.measureText(text).width + pad * 2), h = Math.ceil(fpx * 1.62);
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; } else g.clearRect(0, 0, w, h);
    const dark = style === 'clock' || style === 'gold';
    g.fillStyle = dark ? HEX.navy : 'rgba(250,247,238,0.95)'; g.strokeStyle = style === 'gold' ? HEX.gold : style === 'minor' ? '#9a8f7a' : HEX.navy; g.lineWidth = style === 'gold' ? 6 : 4;
    g.beginPath(); if (g.roundRect) g.roundRect(3, 3, w - 6, h - 6, h * 0.26); else g.rect(3, 3, w - 6, h - 6); g.fill(); g.stroke();
    g.font = font; g.fillStyle = dark ? '#fbf5e6' : HEX.navy; g.textBaseline = 'middle'; g.fillText(text, pad, h / 2 + 2);
    return w / h;
  }

  function buildView(host, T) {
    const cv = document.createElement('canvas'), attrs = { antialias: true, alpha: true, powerPreference: 'low-power', premultipliedAlpha: true };
    let gl = null;
    try { gl = cv.getContext('webgl2', attrs) || cv.getContext('webgl', attrs); } catch (_) { gl = null; }
    if (!gl) return null;
    let renderer;
    try { renderer = new T.WebGLRenderer({ canvas: cv, context: gl, antialias: true, alpha: true }); } catch (_) { return null; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = T.SRGBColorSpace; renderer.setClearColor(0x000000, 0); renderer.autoClear = false;
    const canvas = renderer.domElement;
    canvas.tabIndex = 0; canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', 'Simulated pondweed investigation: an LED lamp shines on a boiling tube of pondweed in sodium hydrogencarbonate solution, standing in a water bath with a thermometer. Gas from the cut stem passes into a gas syringe. Drag or use arrow keys to turn the bench. The readout gives each measurement.');
    host.appendChild(canvas); host.classList.add('is-live');

    const geos = [], mats = [], texs = [], labels = [];
    const G = g => { geos.push(g); return g; }, M = m => { mats.push(m); return m; };
    const col = h => new T.Color(h);
    const scene = new T.Scene(), camera = new T.PerspectiveCamera(30, 1, 0.1, 200);
    scene.add(new T.HemisphereLight(0xffffff, 0xcdbfa4, 1.7));
    const keyL = new T.DirectionalLight(0xffffff, 2.0); keyL.position.set(-2, 7, 6); scene.add(keyL);
    const fillL = new T.DirectionalLight(0xfff1dc, 0.5); fillL.position.set(5, 3, -3); scene.add(fillL);
    const lampLight = new T.PointLight(col(HEX.light), 0, 6, 1.5); lampLight.position.set(LX + 0.9, 1.25, 0); scene.add(lampLight);

    /* bench */
    const bench = new T.Mesh(G(new T.BoxGeometry(8.8, 0.12, 2.8)), M(new T.MeshStandardMaterial({ color: col(HEX.bench), roughness: 0.85 })));
    bench.position.set(0.3, -0.06, 0); scene.add(bench);

    /* LED lamp: base, pole, head facing the tube, emissive LED face and a soft beam */
    const navyMat = M(new T.MeshStandardMaterial({ color: col(HEX.navy), roughness: 0.55, metalness: 0.15 }));
    const lampBase = new T.Mesh(G(new T.CylinderGeometry(0.42, 0.48, 0.1, 32)), navyMat); lampBase.position.set(LX, 0.05, 0); scene.add(lampBase);
    const pole = new T.Mesh(G(new T.CylinderGeometry(0.05, 0.05, 1.15, 16)), navyMat); pole.position.set(LX, 0.65, 0); scene.add(pole);
    const headGeo = G(new T.CylinderGeometry(0.3, 0.24, 0.55, 32)); headGeo.rotateZ(-Math.PI / 2);
    const head = new T.Mesh(headGeo, navyMat); head.position.set(LX + 0.2, 1.25, 0); scene.add(head);
    const faceMat = M(new T.MeshStandardMaterial({ color: col(HEX.light), emissive: col(HEX.light), emissiveIntensity: 1, roughness: 0.3 }));
    const faceGeo = G(new T.CircleGeometry(0.27, 32)); faceGeo.rotateY(Math.PI / 2);
    const face = new T.Mesh(faceGeo, faceMat); face.position.set(LX + 0.48, 1.25, 0); scene.add(face);
    const beamLen = (TX - TR) - (LX + 0.5);
    const beamGeo = G(new T.CylinderGeometry(0.27, 0.5, beamLen, 32, 1, true)); beamGeo.rotateZ(Math.PI / 2);
    const beamMat = M(new T.MeshBasicMaterial({ color: col(HEX.light), transparent: true, opacity: 0.2, depthWrite: false, side: T.DoubleSide, blending: T.AdditiveBlending }));
    const beam = new T.Mesh(beamGeo, beamMat); beam.position.set(LX + 0.5 + beamLen / 2, 1.2, 0); scene.add(beam);

    /* water bath */
    const glass = M(new T.MeshStandardMaterial({ color: 0xdcecf1, roughness: 0.06, transparent: true, opacity: 0.24, side: T.DoubleSide, depthWrite: false }));
    const rimMat = M(new T.MeshStandardMaterial({ color: 0xb3ccd4, roughness: 0.1, transparent: true, opacity: 0.8 }));
    const beaker = new T.Mesh(G(new T.CylinderGeometry(BR, BR * 0.97, BH, 48, 1, true)), glass); beaker.position.set(BX, BH / 2, 0); beaker.renderOrder = 3; scene.add(beaker);
    const bBase = new T.Mesh(G(new T.CircleGeometry(BR * 0.97, 48)), glass); bBase.rotation.x = -Math.PI / 2; bBase.position.set(BX, 0.01, 0); scene.add(bBase);
    const bRim = new T.Mesh(G(new T.TorusGeometry(BR, 0.02, 8, 64)), rimMat); bRim.rotation.x = Math.PI / 2; bRim.position.set(BX, BH, 0); scene.add(bRim);
    const WH = 1.3;
    const water = new T.Mesh(G(new T.CylinderGeometry(BR * 0.975, BR * 0.95, WH, 48)), M(new T.MeshStandardMaterial({ color: col(HEX.water), roughness: 0.12, transparent: true, opacity: 0.2, depthWrite: false })));
    water.position.set(BX, WH / 2 + 0.02, 0); water.renderOrder = 2; scene.add(water);

    /* boiling tube, NaHCO₃ solution (grey tint grows with CO₂ supply), bung and delivery tube */
    const tGlass = new T.Mesh(G(new T.CylinderGeometry(TR, TR, TL, 28, 1, true)), glass); tGlass.position.set(TX, TB + TL / 2, 0); tGlass.renderOrder = 4; scene.add(tGlass);
    const tBottom = new T.Mesh(G(new T.SphereGeometry(TR, 24, 10, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2)), glass); tBottom.position.set(TX, TB, 0); scene.add(tBottom);
    const solMat = M(new T.MeshStandardMaterial({ color: col(HEX.water), roughness: 0.2, transparent: true, opacity: 0.3, depthWrite: false }));
    const sol = new T.Mesh(G(new T.CylinderGeometry(TR * 0.9, TR * 0.9, SOL - TB, 28)), solMat); sol.position.set(TX, TB + (SOL - TB) / 2, 0); sol.renderOrder = 1; scene.add(sol);
    const solB = new T.Mesh(G(new T.SphereGeometry(TR * 0.9, 20, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2)), solMat); solB.position.set(TX, TB, 0); scene.add(solB);
    const rubber = M(new T.MeshStandardMaterial({ color: col(HEX.rubber), roughness: 0.8 }));
    const bung = new T.Mesh(G(new T.CylinderGeometry(TR * 1.12, TR * 0.95, 0.2, 24)), rubber); bung.position.set(TX, TB + TL + 0.04, 0); scene.add(bung);
    const path = new T.CatmullRomCurve3([new T.Vector3(TX, TB + TL + 0.1, 0), new T.Vector3(TX, 2.75, 0), new T.Vector3(TX + 0.25, 2.95, 0), new T.Vector3(1.3, 2.95, 0), new T.Vector3(1.6, 2.7, 0), new T.Vector3(1.62, SY + 0.05, 0), new T.Vector3(SX0 - 0.02, SY, 0)], false, 'catmullrom', 0.2);
    const tubeMat = M(new T.MeshStandardMaterial({ color: 0xe9f1f3, roughness: 0.15, transparent: true, opacity: 0.85 }));
    scene.add(new T.Mesh(G(new T.TubeGeometry(path, 64, 0.035, 10, false)), tubeMat));

    /* gas syringe on a clamp stand: barrel, scale ticks, gas column (O₂ teal) and plunger */
    const sxGeo = G(new T.CylinderGeometry(SR, SR, SX1 - SX0, 28, 1, true)); sxGeo.rotateZ(Math.PI / 2);
    const barrel = new T.Mesh(sxGeo, glass); barrel.position.set((SX0 + SX1) / 2, SY, 0); barrel.renderOrder = 4; scene.add(barrel);
    const capGeo = G(new T.CircleGeometry(SR, 28)); capGeo.rotateY(Math.PI / 2);
    const cap = new T.Mesh(capGeo, glass); cap.position.set(SX0, SY, 0); scene.add(cap);
    const tickMat = M(new T.MeshBasicMaterial({ color: col(HEX.navy) }));
    for (let v = 0; v <= 12; v++) { const tk = new T.Mesh(G(new T.BoxGeometry(0.012, v % 5 ? 0.07 : 0.13, 0.01)), tickMat); tk.position.set(S0 + v * SPC, SY - SR + 0.04, SR + 0.005); scene.add(tk); }
    const gasGeo = G(new T.CylinderGeometry(SR * 0.9, SR * 0.9, 1, 24)); gasGeo.rotateZ(Math.PI / 2); gasGeo.translate(0.5, 0, 0);
    const gas = new T.Mesh(gasGeo, M(new T.MeshStandardMaterial({ color: col(HEX.o2), transparent: true, opacity: 0.6, depthWrite: false, roughness: 0.3 })));
    gas.renderOrder = 6;
    gas.position.set(SX0, SY, 0); scene.add(gas);
    const plunger = new T.Group(); scene.add(plunger);
    const pHeadGeo = G(new T.CylinderGeometry(SR * 0.94, SR * 0.94, 0.06, 24)); pHeadGeo.rotateZ(Math.PI / 2);
    plunger.add(new T.Mesh(pHeadGeo, rubber));
    const rodGeo = G(new T.CylinderGeometry(0.03, 0.03, 1.0, 12)); rodGeo.rotateZ(Math.PI / 2); rodGeo.translate(0.5, 0, 0);
    plunger.add(new T.Mesh(rodGeo, navyMat));
    const handle = new T.Mesh(G(new T.BoxGeometry(0.05, 0.3, 0.3)), navyMat); handle.position.x = 1.0; plunger.add(handle);
    const stand = new T.Mesh(G(new T.CylinderGeometry(0.035, 0.035, SY + 0.25, 12)), navyMat); stand.position.set(2.55, (SY + 0.25) / 2, -0.35); scene.add(stand);
    const standBase = new T.Mesh(G(new T.BoxGeometry(0.7, 0.06, 0.5)), navyMat); standBase.position.set(2.55, 0.03, -0.35); scene.add(standBase);
    const clamp = new T.Mesh(G(new T.BoxGeometry(0.08, 0.08, 0.36)), navyMat); clamp.position.set(2.55, SY, -0.18); scene.add(clamp);

    /* thermometer in the water bath (red column follows temperature, 0–60 °C) */
    const thermo = new T.Group(); thermo.position.set(BX + 0.58, 0.12, 0.18); thermo.rotation.z = -0.08; scene.add(thermo);
    const TH_L = 1.85;
    const thGlass = new T.Mesh(G(new T.CylinderGeometry(0.06, 0.06, TH_L, 16)), M(new T.MeshStandardMaterial({ color: 0xf4f8f9, roughness: 0.1, transparent: true, opacity: 0.7, depthWrite: false })));
    thGlass.position.y = TH_L / 2; thGlass.renderOrder = 5; thermo.add(thGlass);
    const redMat = M(new T.MeshStandardMaterial({ color: col(HEX.rose), roughness: 0.3, emissive: col(HEX.rose), emissiveIntensity: 0.25 }));
    thermo.add(new T.Mesh(G(new T.SphereGeometry(0.08, 18, 12)), redMat));
    const colGeo = G(new T.CylinderGeometry(0.036, 0.036, 1, 10)); colGeo.translate(0, 0.5, 0);
    const thCol = new T.Mesh(colGeo, redMat); thCol.renderOrder = 6; thermo.add(thCol);
    const colFor = t => 0.1 + (Math.max(0, Math.min(60, t)) / 60) * (TH_L - 0.25);

    /* pondweed (Elodea-like): weighted stem, whorls of three leaves, cut end up */
    const weed = new T.Group(); scene.add(weed);
    const green = M(new T.MeshStandardMaterial({ color: col(HEX.chloro), roughness: 0.6 }));
    const leafMat = M(new T.MeshStandardMaterial({ color: 0x6a9a58, roughness: 0.55, side: T.DoubleSide }));
    const stemPts = [new T.Vector3(TX + 0.02, 0.32, 0.02), new T.Vector3(TX - 0.05, 0.7, 0), new T.Vector3(TX + 0.04, 1.1, -0.03), new T.Vector3(TX - 0.03, 1.33, 0.02), new T.Vector3(TX, CUT, 0)];
    const stemCurve = new T.CatmullRomCurve3(stemPts);
    weed.add(new T.Mesh(G(new T.TubeGeometry(stemCurve, 40, 0.03, 8, false)), green));
    const leafGeo = G(new T.SphereGeometry(1, 12, 8)); leafGeo.scale(0.085, 0.022, 0.034); leafGeo.translate(0.08, 0, 0);
    for (let k = 0; k < 11; k++) {
      const u = 0.06 + k * 0.085, pnt = stemCurve.getPointAt(u);
      for (let j = 0; j < 3; j++) {
        const leaf = new T.Mesh(leafGeo, leafMat); leaf.position.copy(pnt);
        leaf.rotation.set(0, j * 2.094 + k * 0.6, 0.75); leaf.rotation.order = 'YZX'; weed.add(leaf);
      }
    }
    const weight = new T.Mesh(G(new T.CylinderGeometry(0.06, 0.06, 0.12, 12)), M(new T.MeshStandardMaterial({ color: 0x8a8f99, metalness: 0.6, roughness: 0.4 }))); weight.position.set(TX + 0.02, 0.28, 0.02); weed.add(weight);
    const cutEnd = new T.Mesh(G(new T.CylinderGeometry(0.03, 0.03, 0.02, 10)), M(new T.MeshStandardMaterial({ color: 0x2f4a2a }))); cutEnd.position.set(TX, CUT, 0); weed.add(cutEnd);

    /* bubbles (pooled): emitted from the cut stem during a run, at a rate proportional to the volume */
    const bubbleGeo = G(new T.SphereGeometry(0.045, 12, 8));
    const bubbleMat = M(new T.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.55, transparent: true, opacity: 0.95, roughness: 0.1, depthTest: false }));
    const bubbles = [];
    for (let i = 0; i < 40; i++) { const b = new T.Mesh(bubbleGeo, bubbleMat); b.visible = false; b.renderOrder = 8; scene.add(b); bubbles.push({ m: b, alive: false, y: 0, x: 0, z: 0, v: 0 }); }

    /* labels: canvas sprites sized in screen pixels; HUD labels in a screen-space overlay */
    const hud = new T.Scene(), hudCam = new T.OrthographicCamera(0, 1, 1, 0, -10, 10);
    function makeLabel(text, style, opt = {}) {
      const c = document.createElement('canvas');
      const mat = M(new T.SpriteMaterial({ transparent: true, depthTest: false, depthWrite: false }));
      const sprite = new T.Sprite(mat); sprite.renderOrder = 20;
      if (opt.center) sprite.center.set(opt.center[0], opt.center[1]);
      const L = { sprite, style, minor: style === 'minor', hud: !!opt.hud, text: null, tex: null, aspect: 1 };
      L.set = t => {
        if (t === L.text) return false; L.text = t;
        const ow = c.width, oh = c.height; L.aspect = drawLabel(c, t, style);
        if (!L.tex || c.width !== ow || c.height !== oh) { if (L.tex) L.tex.dispose(); L.tex = new T.CanvasTexture(c); L.tex.colorSpace = T.SRGBColorSpace; mat.map = L.tex; mat.needsUpdate = true; }
        else L.tex.needsUpdate = true;
        scaleL(L); return true;
      };
      L.redraw = () => { const t = L.text; L.text = null; L.set(t); };
      labels.push(L); (L.hud ? hud : scene).add(sprite); L.set(text); return L;
    }
    let worldPerPx = 0.01, small = false, W = 1, H = 1;
    const pxOf = L => (L.minor ? (small ? 13 : 15) : small ? 15 : 18);
    function scaleL(L) { const h = pxOf(L) * (L.hud ? 1 : worldPerPx); L.sprite.scale.set(h * L.aspect, h, 1); }
    const lampLabel = makeLabel('LED lamp 60 %', 'major', { center: [0.5, 0] }); lampLabel.sprite.position.set(LX + 0.1, 1.7, 0);
    const bathLabel = makeLabel('Water bath 25 °C', 'major', { center: [0.5, 1] }); bathLabel.sprite.position.set(BX, -0.05, BR + 0.15);
    const solLabel = makeLabel('NaHCO₃ 0.5 %', 'minor', { center: [1, 0.5] }); solLabel.sprite.position.set(BX - BR - 0.08, 0.5, 0);
    const syrLabel = makeLabel('Gas syringe / cm³', 'major', { center: [0.5, 0] }); syrLabel.sprite.position.set((SX0 + SX1) / 2 + 0.2, SY + 0.3, 0);
    const weedLabel = makeLabel('pondweed', 'minor', { center: [0, 0.5] }); weedLabel.sprite.position.set(BX + BR + 0.1, 1.05, 0);
    const clockLabel = makeLabel('0:00 / 5:00', 'clock', { center: [1, 1], hud: true });
    const simLabel = makeLabel('Simulated data', 'minor', { center: [0, 1], hud: true });
    const resLabel = makeLabel('Repeat 1: 0.0 cm³', 'gold', { center: [0.5, 1], hud: true }); resLabel.sprite.visible = false;
    function layoutHud() {
      hudCam.left = 0; hudCam.right = W; hudCam.top = H; hudCam.bottom = 0; hudCam.updateProjectionMatrix();
      clockLabel.sprite.position.set(W - 8, H - 8, 0); simLabel.sprite.position.set(8, H - 8, 0);
      resLabel.sprite.position.set(W / 2, H - 8 - (small ? pxOf(clockLabel) + 6 : 0), 0);
    }

    /* camera: clamped orbit with an iterative screen-space fit (apparatus + labels stay inside the host) */
    let yaw = -0.12, pitch = 0.36;
    const target = new T.Vector3(), tmpV = new T.Vector3();
    const P = (x, y, z, L) => ({ p: new T.Vector3(x, y, z), L });
    const basePts = [];
    for (const x of [LX - 0.5, 4.6]) for (const y of [0, 3.0]) for (const z of [-0.6, 0.6]) basePts.push(P(x, y, z));
    basePts.push(P(BX, 0, BR), P(BX, BH, BR), P(BX - BR, 0, 0), P(BX + BR, 0, 0));
    function fitPoints() {
      const pts = basePts.concat([lampLabel, syrLabel, bathLabel].map(L => P(L.sprite.position.x, L.sprite.position.y, L.sprite.position.z, L)));
      if (!small) [solLabel, weedLabel].forEach(L => pts.push(P(L.sprite.position.x, L.sprite.position.y, L.sprite.position.z, L)));
      return pts;
    }
    function fit() {
      camera.aspect = W / H; camera.updateProjectionMatrix();
      const back = new T.Vector3(Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), Math.cos(yaw) * Math.cos(pitch));
      const right = new T.Vector3(0, 1, 0).cross(back).normalize(), up = back.clone().cross(right);
      const tanV = Math.tan(T.MathUtils.degToRad(camera.fov / 2));
      const pts = fitPoints();
      const padL = 6, padR = 6, padT = small ? 30 : 40, padB = 6;
      target.set(0.6, 1.3, 0); let d = 16;
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
      labels.forEach(scaleL); layoutHud();
    }
    function resize() {
      const r = host.getBoundingClientRect(); if (!r.width || !r.height) return;
      W = r.width; H = r.height; small = H < 230 || W < 360;
      renderer.setSize(W, H, false);
      solLabel.sprite.visible = weedLabel.sprite.visible = !small;
      fit(); draw();
    }

    /* per-frame sync: a pure function of state plus bubbles and short tweens */
    let shownV = 0, vTween = null, lastKey = '', thermoNow = null, thermoTween = null, emitAcc = 0, lastNow = 0, lastClock = '';
    function setLamp(I) {
      const k = Math.max(0, Math.min(1, I / 100));
      faceMat.color.set(k > 0 ? HEX.light : '#cfc9b8'); faceMat.emissive.set(HEX.light); faceMat.emissiveIntensity = k > 0 ? 0.15 + 1.6 * k : 0;
      beamMat.opacity = 0.32 * k; beam.visible = k > 0; lampLight.intensity = 2.2 * k;
    }
    function frame(s, now) {
      ensure(s);
      let animating = false;
      const dt = lastNow ? Math.min(0.1, Math.max(0, (now - lastNow) / 1000)) : 0; lastNow = now;
      const key = `${s.I}|${c10(s.C)}|${s.T}`;
      if (key !== lastKey) {
        setLamp(s.I);
        lampLabel.set(`LED lamp ${s.I} %`); bathLabel.set(`Water bath ${s.T} °C`); solLabel.set(`NaHCO₃ ${fmtC(s.C)} %`);
        const k = c10(s.C) / 10; solMat.color.set(HEX.water).lerp(col(HEX.co2), Math.min(1, 0.25 + 0.75 * k)); solMat.opacity = 0.22 + 0.3 * k;
        const to = colFor(s.T);
        if (thermoNow === null || reduce()) { thermoNow = to; thermoTween = null; } else thermoTween = { from: thermoNow, to, t0: now, dur: 600 };
        lastKey = key;
      }
      if (thermoTween) { const q = Math.min(1, (now - thermoTween.t0) / thermoTween.dur); thermoNow = thermoTween.from + (thermoTween.to - thermoTween.from) * easeIO(q); if (q >= 1) thermoTween = null; else animating = true; }
      thCol.scale.y = thermoNow;
      /* gas volume in the syringe */
      let targetV = 0;
      if (s.running && s.pending) targetV = s.pending.V * Math.min(1, num(s.t) / RUN_S);
      else if (sameCond(s.last, s)) targetV = s.last.V;
      if (s.running || reduce()) { shownV = targetV; vTween = null; }
      else if (Math.abs(targetV - shownV) > 0.001) { if (!vTween || vTween.to !== targetV) vTween = { from: shownV, to: targetV, t0: now, dur: 450 }; const q = Math.min(1, (now - vTween.t0) / vTween.dur); shownV = vTween.from + (vTween.to - vTween.from) * easeIO(q); if (q >= 1) { shownV = targetV; vTween = null; } else animating = true; }
      const gx = Math.max(0.001, (S0 - SX0) + Math.min(12, shownV) * SPC);
      gas.scale.x = gx; gas.visible = shownV > 0.01; plunger.position.set(SX0 + gx, SY, 0);
      /* bubbles: rate ∝ the run's volume; none with reduced motion */
      const emitting = s.running && s.pending && s.pending.V > 0 && !reduce();
      if (emitting) { emitAcc += dt * s.pending.V * 2.2; while (emitAcc >= 1) { emitAcc -= 1; const b = bubbles.find(x => !x.alive); if (!b) break; b.alive = true; b.x = TX + (Math.random() - 0.5) * 0.03; b.z = (Math.random() - 0.5) * 0.03; b.y = CUT + 0.03; b.v = 0.45 + Math.random() * 0.25; b.m.visible = true; b.m.scale.setScalar(0.7 + Math.random() * 0.6); } }
      else emitAcc = 0;
      for (const b of bubbles) {
        if (!b.alive) continue;
        b.y += b.v * dt; b.x += Math.sin(now / 160 + b.v * 9) * 0.0008;
        if (b.y > SOL - 0.02) { b.alive = false; b.m.visible = false; continue; }
        b.m.position.set(b.x, b.y, b.z); animating = true;
      }
      /* HUD: simulated clock and the last measurement for these conditions */
      const shownT = s.running ? num(s.t) : sameCond(s.last, s) ? RUN_S : 0;
      const clock = `${Math.floor(shownT / 60)}:${String(Math.floor(shownT % 60)).padStart(2, '0')} / 5:00 simulated`;
      if (clock !== lastClock) { clockLabel.set(clock); lastClock = clock; }
      const showRes = !s.running && sameCond(s.last, s);
      if (showRes && resLabel.set(`Repeat ${s.last.repeat}: ${s.last.V.toFixed(1)} cm³`)) layoutHud();
      resLabel.sprite.visible = showRes;
      draw();
      return animating || !!s.running;
    }
    function draw() { renderer.clear(); renderer.render(scene, camera); renderer.clearDepth(); renderer.render(hud, hudCam); }

    /* pointer + keyboard rotation (clamped so the apparatus stays readable) */
    let drag = null;
    const clampView = () => { yaw = Math.max(-0.7, Math.min(0.7, yaw)); pitch = Math.max(0.05, Math.min(0.9, pitch)); fit(); draw(); };
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
    let alive = true;
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (!alive) return; labels.forEach(L => L.redraw()); fit(); draw(); }).catch(() => {});
    resize();
    return {
      frame,
      dispose() {
        alive = false; if (observer) observer.disconnect();
        canvas.removeEventListener('pointerdown', onDown); canvas.removeEventListener('pointermove', onMove); canvas.removeEventListener('pointerup', onUp); canvas.removeEventListener('pointercancel', onUp); canvas.removeEventListener('keydown', onKey);
        labels.forEach(L => { if (L.tex) L.tex.dispose(); });
        texs.forEach(t => t.dispose()); geos.forEach(g => g.dispose()); mats.forEach(m => m.dispose());
        renderer.dispose(); try { renderer.forceContextLoss(); } catch (_) {}
        canvas.remove(); host.classList.remove('is-live');
      }
    };
  }

  return {
    caption: 'Simulated data: every reading comes from a model, not a real plant. Simulated time runs 60× faster. Drag or use arrow keys to turn the bench.',
    defaults: { investigate: 'light', I: 60, C: 0.5, T: 25, prediction: null, running: false, repeat: {}, results: [], showFixed: false, t: 0, pending: null, last: null },
    controls,
    readout,
    data: { volume, trueVolume, wobble, LIGHTS, CO2S, TEMPS },
    onChange(key, s) {
      ensure(s);
      if (key === 'investigate') { s.prediction = null; s.showFixed = false; }
    },
    command(c, s) {
      ensure(s);
      if (c === 'run') { if (start(s) && reduce()) finish(s); }
      if (c === 'reset') clearAll(s);
      if (c === 'fixed') s.showFixed = !s.showFixed;
      if (c === 'cycleI' || c === 'cycleC' || c === 'cycleT') {
        if (s.running) return;
        const k = c.slice(5), list = k === 'I' ? LIGHTS : k === 'C' ? CO2S : TEMPS;
        s[k] = list[(list.findIndex(v => (k === 'C' ? c10(v) === c10(s[k]) : v === s[k])) + 1) % list.length];
      }
    },
    mount(host, state, phase, ctx) {
      let s = state; ensure(s);
      let view = null;
      const T = window.THREE;
      if (T && T.WebGLRenderer) { try { view = buildView(host, T); } catch (err) { view = null; if (window.console) console.warn('pondweed: 3D view unavailable', err); const c = host.querySelector('canvas'); if (c) c.remove(); host.classList.remove('is-live'); } }
      /* the run clock lives here, so it works with or without WebGL */
      let raf = 0, last = 0, visible = !document.hidden, disposed = false;
      function tick(now) {
        raf = 0; if (disposed) return;
        const dt = last ? Math.min(0.5, Math.max(0, (now - last) / 1000)) : 0; last = now;
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
