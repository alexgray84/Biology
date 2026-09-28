/* Lesson 02 · Enzymes, temperature and pH — local Three.js (r160, global THREE) lock-and-key enzyme model.
   Original geometry built from signed-distance shapes (no downloaded assets, no network, no storage).
   Modes (state.mode):
     bind         stage 0 approach · 1 enzyme–substrate complex · 2 products released · 3 enzyme unchanged, reused
     specific     substrate 'match' (gold, complementary) | 'other' (rose, different shape); command 'try'
     temperature  temp 0–70 °C; deformation above 45 °C is permanent (maxDeform) until command 'reset'
     ph           enzyme amylase ≈7 | pepsin ≈2 | trypsin ≈8; pH 1–13; |pH − optimum| ≥ 4 denatures (permanent until 'reset')
   The readout and all derived state (maxDeform, denatured) are computed without WebGL, so the screen stays true
   when the fallback diagram is showing. */
window.LessonModels = window.LessonModels || {};
window.LessonModels.enzyme = (() => {
  const reduce = () => !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const mix = (a, b, t) => a + (b - a) * t;
  const ease = k => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
  const num = (v, d) => (Number.isFinite(+v) ? +v : d);

  /* ---------- science (no WebGL needed) ---------- */
  const OPT = { amylase: 7, pepsin: 2, trypsin: 8 };
  const NAME = { amylase: 'Amylase', pepsin: 'Pepsin', trypsin: 'Trypsin' };
  // Relative rate below the optimum, read from the illustrative amylase dataset (1/t normalised to 40 °C = 100 %).
  const CURVE = [[0, 6], [10, 20], [20, 38], [30, 61], [36, 86], [40, 100]];
  function fT(T) {
    if (T >= 40) return 100;
    if (T <= 0) return CURVE[0][1];
    for (let i = 1; i < CURVE.length; i++) {
      const [x1, y1] = CURVE[i], [x0, y0] = CURVE[i - 1];
      if (T <= x1) { const k = (T - x0) / (x1 - x0), s = k * k * (3 - 2 * k); return mix(y0, y1, mix(k, s, 0.35)); }
    }
    return 100;
  }
  function sync(s) {
    if (s.mode === 'temperature') {
      const T = clamp(num(s.temp, 37), 0, 70);
      let md = clamp(num(s.maxDeform, 0), 0, 1);
      if (T > 45) md = Math.max(md, clamp((T - 42) / 16, 0, 1));
      s.maxDeform = md; s.denatured = md >= 0.85;
    } else if (s.mode === 'ph') {
      const opt = OPT[s.enzyme] ?? 7, pH = clamp(num(s.ph, 7), 1, 13);
      if (Math.abs(pH - opt) >= 4) s.denatured = true;
      s.denatured = !!s.denatured;
    }
    return s;
  }
  // Everything the view and readout need, derived from state.
  function derive(s) {
    sync(s);
    if (s.mode === 'temperature') {
      const T = clamp(num(s.temp, 37), 0, 70), md = s.maxDeform;
      const rate = md >= 0.85 ? 0 : Math.round(fT(T) * (1 - md));
      return { T, rate, deform: md, status: md <= 0 ? 'ok' : md < 0.85 ? 'changing' : 'denatured', speed: 0.14 + 0.95 * T / 70 };
    }
    if (s.mode === 'ph') {
      const opt = OPT[s.enzyme] ?? 7, pH = clamp(num(s.ph, 7), 1, 13), d = clamp(Math.abs(pH - opt) / 4, 0, 1);
      const rate = s.denatured ? 0 : Math.max(0, Math.round(100 * Math.cos(Math.PI / 2 * d) ** 2));
      return { T: 37, pH, opt, rate, deform: s.denatured ? 1 : d, status: s.denatured ? 'denatured' : d === 0 ? 'ok' : 'changing', speed: 0.14 + 0.95 * 37 / 70 };
    }
    return { deform: 0, status: 'ok', rate: 0, speed: 0.5 };
  }
  const movement = T => (T < 20 ? 'molecules move slowly' : T < 36 ? 'molecules move faster' : 'molecules move fast');
  const BIND = [
    ['Substrate approaching', 'The active site has a specific shape, complementary to the substrate.'],
    ['Enzyme–substrate complex', 'The substrate fits into the active site.'],
    ['Products released', 'The substrate is broken into two products, which leave the active site.'],
    ['Enzyme unchanged', 'The same active site binds a new substrate molecule: the enzyme is reused.']
  ];
  const BIND_HUD = ['1 · Substrate approaches', '2 · Enzyme–substrate complex', '3 · Products released', '4 · Enzyme unchanged, reused'];
  const row = (k, v) => `<p><span class="readout-key">${k}</span><span class="readout-value">${v}</span></p>`;

  function readout(p, s) {
    const d = derive(s);
    if (s.mode === 'specific') {
      const match = s.substrate !== 'other';
      const result = !s.tried ? 'Predict first, then press Try it.'
        : match ? 'Fits the active site: an enzyme–substrate complex forms.'
          : 'Does not fit: not complementary, so no complex and no reaction.';
      return row('Substrate', match ? 'Complementary shape (gold)' : 'Different shape (rose)') + row('Result', result);
    }
    if (s.mode === 'temperature') {
      // movement line first (pupils complete "Warmer molecules move ___, so they collide ___ often"), then the active site
      // (kept to two short lines so the panel still fits at 1280×720 beside the step box)
      const text = d.status === 'ok'
        ? (d.T < 20 ? 'Molecules move slowly, so they collide less often. Not denatured.' : 'Molecules move faster, so they collide more often. Active site complementary.')
        : d.status === 'changing'
          ? (d.T > 45 ? 'Molecules move fast, but the active site is changing shape: fewer fit. Permanent.' : 'The active site stays changed: cooling does not restore it. Fewer fit.')
          : (d.T > 45 ? 'Molecules move fast, but the active site has changed shape permanently: denatured.' : 'Still denatured: cooling does not restore the active site. Press New enzyme.');
      return row(`${d.T} °C · relative rate ${d.rate} %`, text);
    }
    if (s.mode === 'ph') {
      const site = d.status === 'ok' ? 'Active site complementary: the substrate fits.' : d.status === 'changing' ? 'Active site changed shape: the substrate fits less well.' : 'Enzyme denatured: permanent, even back at the optimum. Press New enzyme for a fresh sample.';
      // (readout keys are upper-cased by the frame CSS, so "pH" stays in the value where its case is kept)
      return row(`${NAME[s.enzyme] || 'Amylase'} · relative rate ${d.rate} %`, `${s.note ? `${s.note} ` : ''}At pH ${d.pH} (optimum ≈ pH ${d.opt}). ${site}`);
    }
    const st = clamp(Math.round(num(s.stage, 0)), 0, 3);
    return row(`Stage ${st + 1} of 4 · ${BIND[st][0]}`, BIND[st][1]);
  }

  const btn = (label, value, pressed, cmd = false, cls = '', title = '') => `<button type="button"${cls ? ` class="${cls}"` : ''}${title ? ` title="${title}" aria-label="${title}"` : ''} data-action="${cmd ? 'model-cmd' : 'model'}" data-value="${value}"${pressed === undefined ? '' : ` aria-pressed="${pressed}"`}>${label}</button>`;
  function controls(p, s) {
    if (s.mode === 'specific') {
      const m = s.substrate !== 'other';
      return `<div class="control-group"><span class="control-label">Substrate</span>${btn('Complementary', 'substrate=match', m)}${btn('Different shape', 'substrate=other', !m)}</div><div class="control-group">${btn(s.tried ? 'Try it again' : 'Try it', 'try', undefined, true, 'is-primary')}</div>`;
    }
    if (s.mode === 'temperature') {
      const T = clamp(num(s.temp, 37), 0, 70);
      // one row (slider, value, quick temperatures, reset) so the panel fits at 1280×720; wraps in narrow views
      return `<div class="control-group"><input type="range" min="0" max="70" step="1" value="${T}" data-model-key="temp" aria-label="Temperature" aria-valuetext="${T} °C" style="min-width:80px"><output data-for="temp" style="min-width:3.4em">${T} °C</output>${[10, 37, 65].map(t => btn(`${t} °C`, `temp=${t}`, T === t)).join('')}${btn('New enzyme', 'reset', undefined, true, '', 'New enzyme (reset): a fresh, undenatured enzyme')}</div>`.replace(/<button /g, '<button style="padding:5px 10px" ');
    }
    if (s.mode === 'ph') {
      const pH = clamp(num(s.ph, 7), 1, 13);
      return `<div class="control-group"><span class="control-label">Enzyme</span>${['amylase', 'pepsin', 'trypsin'].map(e => btn(`${NAME[e]} ≈${OPT[e]}`, `enzyme=${e}`, s.enzyme === e)).join('')}</div><div class="control-group"><input type="range" min="1" max="13" step="1" value="${pH}" data-model-key="ph" aria-label="pH" aria-valuetext="pH ${pH}" style="min-width:80px"><output data-for="ph" style="min-width:3.4em">pH ${pH}</output>${btn('New enzyme', 'reset', undefined, true, '', 'New enzyme (reset): a fresh, undenatured enzyme')}</div>`.replace(/<button /g, '<button style="padding:5px 10px" ');
    }
    return `<div class="control-group">${btn('Replay animation', 'replay', undefined, true, 'is-primary')}</div>`;
  }
  // A fresh enzyme sample in pH mode. If the current pH would denature it at once, start it at the nearest pH it survives
  // (3 units from its optimum, on the same side), so pupils can still search for the optimum themselves.
  function freshPh(s) {
    s.denatured = false; s.note = '';
    const opt = OPT[s.enzyme] ?? 7, pH = clamp(num(s.ph, 7), 1, 13);
    if (Math.abs(pH - opt) >= 4) { s.ph = clamp(pH > opt ? opt + 3 : opt - 3, 1, 13); s.note = `Fresh ${(NAME[s.enzyme] || 'Amylase').toLowerCase()} starts at pH ${s.ph}, as pH ${pH} would denature it.`; }
  }
  function onChange(key, s) {
    if (key === 'substrate') s.tried = false;
    if (key === 'enzyme' && s.mode === 'ph') freshPh(s);
    if (key === 'ph') s.note = '';
    sync(s);
    // The engine does not re-render controls while a slider has focus, so keep its visible value current here.
    if (key === 'temp' || key === 'ph') {
      const o = document.querySelector(`#model-controls output[data-for="${key}"]`), r = document.querySelector(`#model-controls input[data-model-key="${key}"]`);
      const txt = key === 'temp' ? `${s.temp} °C` : `pH ${s.ph}`;
      if (o) o.textContent = txt; if (r) r.setAttribute('aria-valuetext', txt);
    }
  }
  function command(cmd, s) {
    if (cmd === 'try') s.tried = true;
    if (cmd === 'reset') { // a fresh enzyme; if the current conditions would denature it at once, start it somewhere safe
      s.maxDeform = 0; s.denatured = false;
      if (s.mode === 'temperature' && num(s.temp, 37) > 45) s.temp = 37;
      if (s.mode === 'ph') freshPh(s);
    }
    sync(s);
  }
  function ariaText(s) {
    const d = derive(s);
    if (s.mode === 'specific') return `Enzyme model: a ${s.substrate === 'other' ? 'rose substrate with a different shape' : 'gold substrate with a complementary shape'} ${s.tried ? (s.substrate === 'other' ? 'fails to fit the active site' : 'sits in the active site') : 'waits beside the active site'}. Drag or use arrow keys to rotate.`;
    if (s.mode === 'temperature') return `Enzyme model at ${d.T} °C: ${movement(d.T)}; active site ${d.status === 'ok' ? 'complementary' : d.status === 'changing' ? 'changing shape' : 'denatured'}; relative rate ${d.rate} %. Drag or use arrow keys to rotate.`;
    if (s.mode === 'ph') return `Enzyme model: ${NAME[s.enzyme] || 'Amylase'} at pH ${d.pH}, optimum about pH ${d.opt}; active site ${d.status === 'ok' ? 'complementary' : d.status === 'changing' ? 'changed shape' : 'denatured'}; relative rate ${d.rate} %. Drag or use arrow keys to rotate.`;
    const st = clamp(Math.round(num(s.stage, 0)), 0, 3);
    return `Lock-and-key enzyme model, stage ${st + 1} of 4: ${BIND[st][0]}. ${BIND[st][1]} Drag or use arrow keys to rotate.`;
  }

  /* ---------- geometry (signed-distance shapes, meshed radially; cached across mounts) ---------- */
  const len3 = (x, y, z) => Math.sqrt(x * x + y * y + z * z);
  const smin = (a, b, k) => { const h = clamp(0.5 + 0.5 * (b - a) / k, 0, 1); return mix(b, a, h) - k * h * (1 - h); };
  const smax = (a, b, k) => -smin(-a, -b, k);
  function poly(px, py, V) { // convex CCW polygon; exact inside, bound outside
    let d = -Infinity;
    for (let i = 0; i < V.length; i++) {
      const a = V[i], b = V[(i + 1) % V.length], ex = b[0] - a[0], ey = b[1] - a[1], L = Math.hypot(ex, ey);
      d = Math.max(d, ((px - a[0]) * ey - (py - a[1]) * ex) / L);
    }
    return d;
  }
  // Active-site cleft (enzyme frame; opens towards +x and runs through the full depth so the notch reads from the front).
  const POCKET = [[0.62, -0.17], [2.3, -0.62], [2.3, 0.62], [0.62, 0.17]];
  const cav = (x, y) => Math.min(poly(x, y, POCKET), Math.hypot(x - 0.62, y) - 0.1);
  function ellipsoid(x, y, z, a, b, c) { const k0 = len3(x / a, y / b, z / c), k1 = len3(x / (a * a), y / (b * b), z / (c * c)); return k0 * (k0 - 1) / Math.max(k1, 1e-6); }
  // Globular protein: a lobed body (smooth union of an ellipsoid and four domains) with gentle surface ripples.
  const LOBES = [[-0.62, 0.52, 0.22, 0.62], [-0.55, -0.5, -0.18, 0.64], [0.28, 0.66, -0.22, 0.56], [0.3, -0.64, 0.24, 0.56]];
  function enzymeSD(x, y, z) {
    let b = ellipsoid(x, y, z, 1.3, 1.02, 0.8);
    for (const [lx, ly, lz, r] of LOBES) b = smin(b, len3(x - lx, y - ly, z - lz) - r, 0.32);
    b += 0.035 * Math.sin(2.3 * x + 0.4) * Math.sin(1.9 * y + 1.1) * Math.sin(2.5 * z + 0.3) + 0.02 * Math.sin(4.1 * x - 1.7 * y + 0.7) * Math.cos(3.2 * z - 0.4);
    return smax(b, -cav(x, y), 0.07);
  }
  // Denaturation as a smooth warp of the folded shape (so any in-between amount is a valid, crease-free shape):
  // the cleft is squeezed and twisted and the surface becomes lumpier. Returns the fully denatured position.
  function denature(x, y, z) {
    const s = Math.pow(clamp((x + 0.1) / 0.75, 0, 1), 2), g = Math.exp(-(y * y) / 0.8);
    let nx = x, ny = y - 0.6 * y * s * g + 0.07 * s * g;
    const phi = 0.32 * s, cx = 1.05, c = Math.cos(phi), sn = Math.sin(phi), dx = nx - cx;
    nx = cx + dx * c - ny * sn; ny = dx * sn + ny * c;
    const r = len3(x, y, z) || 1, bump = 0.075 * Math.sin(3.1 * x + 1.2) * Math.sin(2.7 * y + 0.3) * Math.sin(2.2 * z + 0.5) + 0.04 * Math.sin(5.3 * y - 2.1 * z);
    return [nx + bump * x / r, ny + bump * y / r, z + bump * z / r - 0.08 * s * g * Math.sign(z)];
  }
  const roundBox = (q, r) => { let o = 0, m = -Infinity; for (const v of q) { const w = v + r; if (w > 0) o += w * w; m = Math.max(m, w); } return Math.sqrt(o) + Math.min(m, 0) - r; };
  // Substrate top half (enzyme frame, seated): the cleft shrunk by a small gap, cut just above y = 0, head to x = 1.42.
  const SUB_C = [1.08, 0.15, 0], SEAT_X = 1.05;
  const subHalfSD = (x, y, z) => roundBox([cav(x, y) + 0.032, Math.abs(z) - 0.26, x - 1.42, 0.007 - y], 0.04);
  // Different substrate: similar size, reversed wedge (wide leading face) — the wrong shape, not simply "too big".
  const OTHER = [[-0.28, -0.35], [0.3, -0.15], [0.3, 0.15], [-0.28, 0.35]];
  const otherSD = (x, y, z) => smin(roundBox([poly(x, y, OTHER), Math.abs(z) - 0.26], 0.06), len3(x - 0.3, y, z / 1.4) - 0.14, 0.07);

  // Naive surface nets: a smooth, evenly meshed isosurface of an SDF (no addons needed). Normals from the SDF gradient.
  function grad(sdf, x, y, z, out, o) {
    const e = 0.004;
    let gx = sdf(x + e, y, z) - sdf(x - e, y, z), gy = sdf(x, y + e, z) - sdf(x, y - e, z), gz = sdf(x, y, z + e) - sdf(x, y, z - e);
    const L = Math.hypot(gx, gy, gz) || 1; out[o] = gx / L; out[o + 1] = gy / L; out[o + 2] = gz / L;
    return L / (2 * e);
  }
  function surfaceNets(sdf, min, max, h) {
    const nx = Math.ceil((max[0] - min[0]) / h) + 1, ny = Math.ceil((max[1] - min[1]) / h) + 1, nz = Math.ceil((max[2] - min[2]) / h) + 1;
    const F = new Float32Array(nx * ny * nz), at = (i, j, k) => i + nx * (j + ny * k);
    for (let k = 0; k < nz; k++) for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) F[at(i, j, k)] = sdf(min[0] + i * h, min[1] + j * h, min[2] + k * h);
    const cx = nx - 1, cy = ny - 1, cz = nz - 1, cell = new Int32Array(cx * cy * cz).fill(-1), cAt = (i, j, k) => i + cx * (j + cy * k);
    const pos = [], idx = [];
    const E = [[0, 1], [2, 3], [4, 5], [6, 7], [0, 2], [1, 3], [4, 6], [5, 7], [0, 4], [1, 5], [2, 6], [3, 7]];
    const v = new Float32Array(8), cp = [[0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 0], [0, 0, 1], [1, 0, 1], [0, 1, 1], [1, 1, 1]];
    for (let k = 0; k < cz; k++) for (let j = 0; j < cy; j++) for (let i = 0; i < cx; i++) {
      let neg = 0;
      for (let c = 0; c < 8; c++) { v[c] = F[at(i + cp[c][0], j + cp[c][1], k + cp[c][2])]; if (v[c] < 0) neg++; }
      if (neg === 0 || neg === 8) continue;
      let sx = 0, sy = 0, sz = 0, n = 0;
      for (const [a, b] of E) {
        if ((v[a] < 0) === (v[b] < 0)) continue;
        const t = v[a] / (v[a] - v[b]);
        sx += cp[a][0] + (cp[b][0] - cp[a][0]) * t; sy += cp[a][1] + (cp[b][1] - cp[a][1]) * t; sz += cp[a][2] + (cp[b][2] - cp[a][2]) * t; n++;
      }
      cell[cAt(i, j, k)] = pos.length / 3;
      pos.push(min[0] + (i + sx / n) * h, min[1] + (j + sy / n) * h, min[2] + (k + sz / n) * h);
    }
    const quad = (a, b, c, d, flip) => { if (a < 0 || b < 0 || c < 0 || d < 0) return; if (flip) idx.push(a, d, c, a, c, b); else idx.push(a, b, c, a, c, d); };
    for (let k = 0; k < nz; k++) for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      const f0 = F[at(i, j, k)] < 0;
      if (i < cx && j > 0 && k > 0 && j < cy && k < cz && f0 !== (F[at(i + 1, j, k)] < 0))
        quad(cell[cAt(i, j - 1, k - 1)], cell[cAt(i, j, k - 1)], cell[cAt(i, j, k)], cell[cAt(i, j - 1, k)], !f0);
      if (j < cy && i > 0 && k > 0 && i < cx && k < cz && f0 !== (F[at(i, j + 1, k)] < 0))
        quad(cell[cAt(i - 1, j, k - 1)], cell[cAt(i - 1, j, k)], cell[cAt(i, j, k)], cell[cAt(i, j, k - 1)], !f0);
      if (k < cz && i > 0 && j > 0 && i < cx && j < cy && f0 !== (F[at(i, j, k + 1)] < 0))
        quad(cell[cAt(i - 1, j - 1, k)], cell[cAt(i, j - 1, k)], cell[cAt(i, j, k)], cell[cAt(i - 1, j, k)], !f0);
    }
    const P = new Float32Array(pos), N = new Float32Array(P.length);
    for (let q = 0; q < P.length; q += 3) { // one Newton step onto the surface, then the gradient normal
      const d = sdf(P[q], P[q + 1], P[q + 2]), g = grad(sdf, P[q], P[q + 1], P[q + 2], N, q), s = d / Math.max(g, 0.2);
      P[q] -= N[q] * s; P[q + 1] -= N[q + 1] * s; P[q + 2] -= N[q + 2] * s; grad(sdf, P[q], P[q + 1], P[q + 2], N, q);
    }
    return { pos: P, nrm: N, index: (P.length / 3 > 65535 ? Uint32Array : Uint16Array).from(idx) };
  }
  let CACHE = null;
  function cache(T) {
    if (CACHE) return CACHE;
    const nat = surfaceNets(enzymeSD, [-1.62, -1.4, -1.12], [1.62, 1.4, 1.12], 0.05);
    const dp = new Float32Array(nat.pos.length);
    for (let q = 0; q < dp.length; q += 3) { const w = denature(nat.pos[q], nat.pos[q + 1], nat.pos[q + 2]); dp[q] = w[0]; dp[q + 1] = w[1]; dp[q + 2] = w[2]; }
    const tg = new T.BufferGeometry(); tg.setAttribute('position', new T.BufferAttribute(dp, 3)); tg.setIndex(new T.BufferAttribute(nat.index, 1)); tg.computeVertexNormals();
    const den = { pos: dp, nrm: tg.attributes.normal.array.slice() }; tg.dispose();
    const n = nat.pos.length / 3, colN = new Float32Array(n * 3), colD = new Float32Array(n * 3);
    const body = new T.Color('#2a7b93'), deep = new T.Color('#1b4a66'), lining = new T.Color('#efc970'), dull = new T.Color('#b88a5a'), tmp = new T.Color();
    const paint = (P, out, cavity, lin) => {
      for (let i = 0; i < n; i++) {
        const x = P[3 * i], y = P[3 * i + 1], z = P[3 * i + 2];
        tmp.copy(body).lerp(deep, clamp(0.45 - 0.4 * y - 0.3 * z, 0, 1) * 0.6);
        const w = x > 0.4 ? 1 - clamp((cavity(x, y) + 0.01) / 0.16, 0, 1) : 0;
        if (w > 0) { tmp.lerp(lin, w); tmp.multiplyScalar(1 - 0.3 * w * clamp((1.3 - x) / 0.7, 0, 1)); }
        out[3 * i] = tmp.r; out[3 * i + 1] = tmp.g; out[3 * i + 2] = tmp.b;
      }
    };
    paint(nat.pos, colN, cav, lining); paint(nat.pos, colD, cav, dull);
    const half = surfaceNets(subHalfSD, [0.4, -0.03, -0.33], [1.5, 0.4, 0.33], 0.024);
    for (let q = 0; q < half.pos.length; q += 3) { half.pos[q] -= SUB_C[0]; half.pos[q + 1] -= SUB_C[1]; half.pos[q + 2] -= SUB_C[2]; }
    const other = surfaceNets(otherSD, [-0.42, -0.46, -0.33], [0.52, 0.46, 0.33], 0.024);
    CACHE = { nat, den, colN, colD, half, other };
    return CACHE;
  }
  function geometryFrom(T, data, copy = true) {
    const g = new T.BufferGeometry();
    g.setAttribute('position', new T.BufferAttribute(copy ? data.pos.slice() : data.pos, 3));
    g.setAttribute('normal', new T.BufferAttribute(copy ? data.nrm.slice() : data.nrm, 3));
    g.setIndex(new T.BufferAttribute(data.index, 1));
    g.computeBoundingSphere();
    return g;
  }

  /* ---------- labels (canvas-texture sprites) ---------- */
  const STYLE = {
    plain: ['rgba(252,249,241,0.95)', '#182944', '#182944'],
    accent: ['rgba(251,241,220,0.97)', '#bd8126', '#182944'],
    warn: ['rgba(249,232,232,0.97)', '#ad5c63', '#6f2530'],
    cool: ['rgba(228,240,246,0.97)', '#24748d', '#123a52'],
    good: ['rgba(232,242,228,0.97)', '#56834b', '#24401d']
  };
  function makeLabel(T, parent, hud = false) {
    const sprite = new T.Sprite(new T.SpriteMaterial({ transparent: true, depthTest: false, depthWrite: false }));
    sprite.renderOrder = 20; sprite.visible = false; parent.add(sprite);
    const L = { sprite, text: null, style: null, aspect: 1, px: 24, hud, hidden: false,
      set(text, style = 'plain') {
        if (text === L.text && style === L.style) return;
        L.text = text; L.style = style; sprite.visible = !!text && !L.hidden;
        if (!text) return;
        const fs = 44, pad = 22, font = `700 ${fs}px Montserrat, "Segoe UI", system-ui, sans-serif`;
        const c = document.createElement('canvas'), g = c.getContext('2d'); g.font = font;
        const w = Math.ceil(g.measureText(text).width) + pad * 2, h = Math.round(fs * 1.5);
        c.width = w; c.height = h; g.font = font;
        const [bg, border, ink] = STYLE[style] || STYLE.plain;
        g.fillStyle = bg; g.strokeStyle = border; g.lineWidth = 4;
        g.beginPath(); if (g.roundRect) g.roundRect(2, 2, w - 4, h - 4, 14); else g.rect(2, 2, w - 4, h - 4); g.fill(); g.stroke();
        g.fillStyle = ink; g.textBaseline = 'middle'; g.fillText(text, pad, h / 2 + 2);
        const tex = new T.CanvasTexture(c); tex.colorSpace = T.SRGBColorSpace; tex.anisotropy = 2;
        if (sprite.material.map) sprite.material.map.dispose();
        sprite.material.map = tex; sprite.material.needsUpdate = true;
        L.aspect = w / h; L.scale();
      },
      unit: 1,
      scale() { const hgt = L.px * L.unit; sprite.scale.set(hgt * L.aspect, hgt, 1); }
    };
    return L;
  }

  /* ---------- mount ---------- */
  // Probe WebGL once per page (quietly), so a machine without it simply keeps the fallback diagram.
  let GL_OK = null;
  function webglAvailable() {
    if (GL_OK !== null) return GL_OK;
    try {
      const c = document.createElement('canvas'), g = c.getContext('webgl2') || c.getContext('webgl');
      GL_OK = !!g; const lose = g && g.getExtension('WEBGL_lose_context'); if (lose) lose.loseContext();
    } catch (_) { GL_OK = false; }
    return GL_OK;
  }
  function mount(host, state, phase, ctx) {
    const T = window.THREE; if (!T || !webglAvailable()) return null;
    let renderer;
    try { renderer = new T.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' }); } catch (_) { return null; }
    if (!renderer.getContext()) { renderer.dispose(); return null; }
    let C;
    try { C = cache(T); } catch (err) { renderer.dispose(); return null; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = T.SRGBColorSpace; renderer.setClearColor(0x000000, 0); renderer.autoClear = false;
    const canvas = renderer.domElement; host.appendChild(canvas); host.classList.add('is-live');
    canvas.tabIndex = 0; canvas.setAttribute('role', 'img');

    const scene = new T.Scene(), camera = new T.PerspectiveCamera(30, 1, 0.1, 100);
    const hud = new T.Scene(), hudCam = new T.OrthographicCamera(0, 1, 1, 0, -10, 10); hudCam.position.z = 5;
    scene.add(new T.HemisphereLight(0xfffaf0, 0x8f8672, 1.55));
    const key = new T.DirectionalLight(0xfff4e2, 2.3); key.position.set(-3, 5, 6); scene.add(key);
    const fill = new T.DirectionalLight(0xdfeefe, 0.75); fill.position.set(5, 0.5, 3); scene.add(fill);
    const rim = new T.DirectionalLight(0xffffff, 1.3); rim.position.set(1, 3, -6); scene.add(rim);

    // soft contact shadow on the "page" below the model
    const sc = document.createElement('canvas'); sc.width = sc.height = 128;
    { const g = sc.getContext('2d'), gr = g.createRadialGradient(64, 64, 4, 64, 64, 62); gr.addColorStop(0, 'rgba(40,36,28,0.55)'); gr.addColorStop(0.55, 'rgba(40,36,28,0.2)'); gr.addColorStop(1, 'rgba(40,36,28,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); }
    const shadowTex = new T.CanvasTexture(sc);
    const shadow = new T.Mesh(new T.PlaneGeometry(1, 1), new T.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, opacity: 0.5 }));
    shadow.rotation.x = -Math.PI / 2; shadow.position.set(-0.55, -1.42, 0); shadow.scale.set(3.4, 1.7, 1); scene.add(shadow);

    const rig = new T.Group(); scene.add(rig);
    const simMode = state.mode === 'temperature' || state.mode === 'ph';
    rig.rotation.set(num(state.rx, 0.1), num(state.ry, simMode ? -0.2 : -0.34), 0);
    const E = new T.Vector3(-0.75, 0, 0), SEAT = new T.Vector3(E.x + SEAT_X, 0, 0);

    // enzyme (vertex colours: teal body, warm gold active-site lining)
    const eGeo = geometryFrom(T, C.nat);
    eGeo.setAttribute('color', new T.BufferAttribute(C.colN.slice(), 3));
    const eMat = new T.MeshStandardMaterial({ vertexColors: true, roughness: 0.46, metalness: 0.02 });
    const enzyme = new T.Mesh(eGeo, eMat); enzyme.position.copy(E); rig.add(enzyme);
    let shownDeform = -1;
    function setDeform(v) {
      v = clamp(v, 0, 1); if (Math.abs(v - shownDeform) < 1e-4) return; shownDeform = v;
      const P = eGeo.attributes.position.array, N = eGeo.attributes.normal.array, col = eGeo.attributes.color.array;
      const a = C.nat.pos, b = C.den.pos, na = C.nat.nrm, nb = C.den.nrm, ca = C.colN, cb = C.colD;
      for (let i = 0; i < P.length; i++) { P[i] = a[i] + (b[i] - a[i]) * v; N[i] = na[i] + (nb[i] - na[i]) * v; col[i] = ca[i] + (cb[i] - ca[i]) * v; }
      eGeo.attributes.position.needsUpdate = true; eGeo.attributes.normal.needsUpdate = true; eGeo.attributes.color.needsUpdate = true;
    }

    // substrates: two halves share one geometry; each substrate has its own material (for fading products)
    const halfGeo = geometryFrom(T, C.half, false);
    const otherGeo = geometryFrom(T, C.other, false);
    const HALF = new T.Vector3(SUB_C[0] - SEAT_X, SUB_C[1], 0); // half centre relative to the substrate origin (seat)
    function makeSub() {
      const mat = new T.MeshStandardMaterial({ color: '#c98a2b', roughness: 0.38, metalness: 0.02, transparent: true, opacity: 1 });
      const g = new T.Group(), top = new T.Mesh(halfGeo, mat), bot = new T.Mesh(halfGeo, mat);
      top.position.copy(HALF); bot.position.set(HALF.x, -HALF.y, 0); bot.rotation.x = Math.PI;
      g.add(top, bot); rig.add(g);
      return { g, top, bot, mat, pos: new T.Vector3(), vel: new T.Vector3(), phase: 'free', t: 0, spin: 0, from: new T.Vector3(), fromRot: 0, dir: 1 };
    }
    const subs = Array.from({ length: 5 }, makeSub);
    const otherMat = new T.MeshStandardMaterial({ color: '#ad5c63', roughness: 0.42, metalness: 0.02 });
    const other = new T.Mesh(otherGeo, otherMat); rig.add(other);
    function setSplit(sb, k, far = 0) { // k: 0 joined → 1 separated; far: 0 → 1 drifting away
      sb.top.position.set(HALF.x + 0.85 * k + 0.8 * far, HALF.y + 0.5 * k + 0.06 * far, 0.1 * k); sb.top.rotation.set(0, 0, 0.45 * k + 0.2 * far);
      sb.bot.position.set(HALF.x + 0.95 * k + 0.8 * far, -HALF.y - 0.52 * k - 0.06 * far, -0.1 * k); sb.bot.rotation.set(Math.PI, 0, -0.35 * k - 0.2 * far);
    }

    // labels
    const lEnzyme = makeLabel(T, rig), lSite = makeLabel(T, rig), lSub = makeLabel(T, rig);
    const hTitle = makeLabel(T, hud, true), hRate = makeLabel(T, hud, true);
    hTitle.sprite.center.set(0, 1); hRate.sprite.center.set(1, 0);
    const worldLabels = [lEnzyme, lSite, lSub], hudLabels = [hTitle, hRate];

    let W = 1, Hh = 1, raf = 0, visible = true, last = 0, mode = null, sim = false, drag = null;
    const tweens = [];
    const tmpV = new T.Vector3();
    function fitLabels() { // slide any 3D label that would be cut off back inside the view (via its sprite anchor)
      for (const L of worldLabels) {
        if (!L.sprite.visible) continue;
        L.sprite.getWorldPosition(tmpV).project(camera);
        const w = 2 * L.px * L.aspect / W, h = 2 * L.px / Hh, m = 12 / W;
        let cx = 0.5, cy = 0.5;
        if (tmpV.x + w / 2 > 1 - m) cx = 0.5 + (tmpV.x + w / 2 - (1 - m)) / w; else if (tmpV.x - w / 2 < -1 + m) cx = 0.5 - (-1 + m - (tmpV.x - w / 2)) / w;
        if (tmpV.y + h / 2 > 1 - 2 * m) cy = 0.5 + (tmpV.y + h / 2 - (1 - 2 * m)) / h; else if (tmpV.y - h / 2 < -1 + 2 * m) cy = 0.5 - (-1 + 2 * m - (tmpV.y - h / 2)) / h;
        L.sprite.center.set(clamp(cx, 0, 1), clamp(cy, 0, 1));
      }
    }
    const draw = () => { fitLabels(); renderer.clear(); renderer.render(scene, camera); renderer.clearDepth(); renderer.render(hud, hudCam); };
    const needsLoop = () => visible && (tweens.length > 0 || (sim && !reduce()));
    function frame(now) {
      raf = 0;
      const dt = Math.min(0.05, Math.max(0, (now - last) / 1000)); last = now;
      for (let i = tweens.length - 1; i >= 0; i--) {
        const tw = tweens[i], k = clamp((now - tw.t0) / tw.dur, 0, 1);
        tw.fn(tw.ease ? ease(k) : k);
        if (k >= 1) { tweens.splice(i, 1); tw.done && tw.done(); }
      }
      if (sim && !reduce()) simulate(dt, now / 1000);
      draw();
      if (needsLoop()) raf = requestAnimationFrame(frame);
    }
    function kick() { if (!raf && needsLoop()) { last = performance.now(); raf = requestAnimationFrame(frame); } }
    function tween(dur, fn, done, easeOn = true, tag) {
      if (tag) for (let i = tweens.length - 1; i >= 0; i--) if (tweens[i].tag === tag) tweens.splice(i, 1);
      if (reduce() || dur <= 0) { fn(1); done && done(); return; }
      tweens.push({ t0: performance.now(), dur, fn, done, ease: easeOn, tag }); kick();
    }
    const clearTweens = () => { tweens.length = 0; };

    /* ----- framing: fit the whole stage (x −2.25…3.05, y −1.5…1.6) to the host, labels sized in pixels ----- */
    const FRAMES = { still: { cx: 0.1, cy: 0.1, hw: 2.75, hh: 1.55 }, sim: { cx: 0.55, cy: 0.05, hw: 3.1, hh: 1.8, left: -2.35 } };
    let FRAME = FRAMES.still;
    function resize() {
      const r = host.getBoundingClientRect(); if (!r.width || !r.height) return;
      W = r.width; Hh = r.height;
      renderer.setSize(W, Hh, false); camera.aspect = W / Hh;
      const t = Math.tan(T.MathUtils.degToRad(camera.fov / 2)), d = Math.max(FRAME.hh / t, FRAME.hw / (t * camera.aspect));
      const vhw = d * t * camera.aspect, vhh = d * t;
      // simulation views keep the enzyme at the left and give the drifting substrates all the spare width
      const cx = sim ? Math.max(FRAME.cx, FRAME.left + vhw) : FRAME.cx;
      const el = 0.16; camera.position.set(cx, FRAME.cy + d * Math.sin(el), d * Math.cos(el)); camera.lookAt(cx, FRAME.cy - 0.05, 0);
      camera.updateProjectionMatrix();
      const unit = 2 * d * t / Hh; // world units per CSS pixel at the model
      const wpx = clamp(Hh * 0.105, 21, 29), hpx = clamp(Hh * 0.12, 23, 33);
      worldLabels.forEach(L => { L.unit = unit; L.px = wpx; L.scale(); });
      hudCam.right = W; hudCam.top = Hh; hudCam.updateProjectionMatrix();
      hudLabels.forEach(L => { L.unit = 1; L.px = hpx; L.scale(); });
      hTitle.sprite.position.set(10, Hh - 10, 0); hRate.sprite.position.set(W - 10, 10, 0);
      // drifting substrates use whatever width the host offers (wide projector view or narrow drawer view)
      BOX.x1 = Math.max(BOX.x0 + 0.6, Math.min(cx + vhw - 1.05, SEAT.x + 4.2)); // margin covers a tilted substrate's half-width
      BOX.y1 = Math.max(0.6, Math.min(1.25, vhh - 0.55)); BOX.y0 = -BOX.y1;
      lEnzyme.hidden = W < 360; lEnzyme.sprite.visible = !!lEnzyme.text && !lEnzyme.hidden;
      hTitle.hidden = mode === 'bind' && W < 360; hTitle.sprite.visible = !!hTitle.text && !hTitle.hidden; // the step box already names the stage
      if (mode) placeSite();
      draw();
    }

    /* ----- bind mode: pose vector tweened between stages ----- */
    const POSES = [
      { ax: 1.35, ay: 0.28, ar: 0.3, split: 0, far: 0, aop: 1, bx: 3.3, by: 0.5, br: 0.5, bop: 0 },
      { ax: 0, ay: 0, ar: 0, split: 0, far: 0, aop: 1, bx: 3.3, by: 0.5, br: 0.5, bop: 0 },
      { ax: 0, ay: 0, ar: 0, split: 1, far: 0, aop: 1, bx: 3.3, by: 0.5, br: 0.5, bop: 0 },
      { ax: 0, ay: 0, ar: 0, split: 1, far: 1, aop: 0, bx: 1.35, by: 0.28, br: 0.3, bop: 1 } // products gone: only the new substrate and its label
    ];
    const OFF = { ax: 3.2, ay: 0.55, ar: 0.6, split: 0, far: 0, aop: 0, bx: 3.3, by: 0.5, br: 0.5, bop: 0 };
    let pose = { ...POSES[0] }, stageShown = -1;
    function applyPose(q) {
      const A = subs[0], B = subs[1];
      A.g.position.set(SEAT.x + q.ax, q.ay, 0); A.g.rotation.set(0, 0, q.ar); setSplit(A, q.split, q.far); A.mat.opacity = q.aop; A.g.visible = q.aop > 0.01;
      B.g.position.set(SEAT.x + q.bx, q.by, 0); B.g.rotation.set(0, 0, q.br); setSplit(B, 0); B.mat.opacity = q.bop; B.g.visible = q.bop > 0.01;
      A.mat.depthWrite = q.aop > 0.95; B.mat.depthWrite = q.bop > 0.95;
      const st = stageShown;
      const dy = Hh < 210 ? 0.62 : -0.72; // below the substrate, or above it when the view is small
      if (st === 0) { lSub.set('Substrate', 'accent'); lSub.sprite.position.set(SEAT.x + q.ax + 0.35, q.ay + dy, 0.3); }
      else if (st === 2) { lSub.set('Products', 'accent'); lSub.sprite.position.set(SEAT.x + 1.25, 0.0, 0.3); }
      else if (st === 3) { lSub.set('New substrate', 'accent'); lSub.sprite.position.set(SEAT.x + q.bx + 0.35, q.by + dy, 0.3); }
      else lSub.set(null);
    }
    function goStage(st, from) {
      const target = POSES[st]; stageShown = st;
      hTitle.set(BIND_HUD[st], st === 1 ? 'accent' : 'plain');
      const start = from ? { ...from } : { ...pose };
      tween(1100, k => { for (const key of Object.keys(target)) pose[key] = mix(start[key], target[key], k); applyPose(pose); }, null, true, 'pose');
    }

    /* ----- specific mode ----- */
    let specShown = null;
    function specPose(s, animate) {
      const match = s.substrate !== 'other', A = subs[0];
      A.g.visible = match; other.visible = !match; setSplit(A, 0); A.mat.opacity = 1; A.mat.depthWrite = true;
      const restX = SEAT.x + 1.45, restY = 0.3, restR = 0.3;
      const small = W < 400, dy = Hh < 210 ? 0.62 : -0.74;
      // as the complementary substrate docks, its label slides right so it never covers the enzyme
      const place = (x, y, r) => { if (match) { A.g.position.set(x, y, 0); A.g.rotation.set(0, 0, r); lSub.sprite.position.set(x + 0.35 + 0.85 * clamp((restX - x) / (restX - SEAT.x), 0, 1), y + dy, 0.3); } else { other.position.set(x, y, 0); other.rotation.set(0, 0, r); lSub.sprite.position.set(x + 0.05, y + dy, 0.3); } };
      lSub.set(match ? (small ? 'Complementary' : 'Complementary substrate') : 'Different shape', match ? 'accent' : 'warn');
      if (!s.tried) { hTitle.set(small ? 'Will it fit?' : 'Will it fit? Predict, then Try it', 'plain'); tween(0, () => {}, null, true, 'spec'); place(restX, restY, restR); return; }
      const endMsg = () => hTitle.set(match ? (small ? 'Fits: complex forms' : 'Fits: enzyme–substrate complex') : (small ? 'Does not fit' : 'Does not fit: not complementary'), match ? 'good' : 'warn');
      if (!animate) { if (match) place(SEAT.x, 0, 0); else place(E.x + 1.58 + 0.45, 0.05, 0.12); endMsg(); return; }
      hTitle.set(small ? 'Trying…' : match ? 'Trying the complementary substrate…' : 'Trying the different shape…', 'plain');
      if (match) {
        tween(1200, k => place(mix(restX, SEAT.x, k), mix(restY, 0, k), mix(restR, 0, k)), endMsg, true, 'spec');
      } else {
        const cx = E.x + 1.58;
        tween(800, k => place(mix(restX, cx, k), mix(restY, 0.02, k), mix(restR, 0, k)), () => {
          tween(700, k => place(cx + 0.5 * Math.sin(k * Math.PI / 2) + 0.06 * Math.sin(k * 18) * (1 - k), 0.02 + 0.03 * k, 0.12 * k), endMsg, false, 'spec');
        }, true, 'spec');
      }
    }

    /* ----- temperature / pH: drifting substrates, binding events at the modelled rate ----- */
    let D = derive(state), evClock = 0, busy = null, active = [];
    const BOX = { x0: SEAT.x + 0.85, x1: SEAT.x + 2.55, y0: -1.12, y1: 1.12, z0: -0.45, z1: 0.45 };
    const rnd = (a, b) => a + Math.random() * (b - a);
    function spawn(sb, edge) {
      sb.phase = 'free'; sb.t = 0; setSplit(sb, 0); sb.mat.opacity = 1; sb.mat.depthWrite = true; sb.g.visible = true;
      sb.pos.set(edge ? BOX.x1 + 0.3 : rnd(BOX.x0 + 0.2, BOX.x1), rnd(BOX.y0, BOX.y1), rnd(BOX.z0, BOX.z1));
      const a = rnd(0, Math.PI * 2); sb.vel.set(Math.cos(a), Math.sin(a), rnd(-0.3, 0.3)).multiplyScalar(D.speed);
      sb.g.rotation.set(0, 0, rnd(-1.2, 1.2)); sb.spin = rnd(-1, 1);
      if (edge) { sb.phase = 'enter'; sb.mat.opacity = 0; sb.mat.depthWrite = false; }
      sb.g.position.copy(sb.pos);
    }
    function staticSim() { // reduced motion (or first frame): a readable still picture of the current state
      const ok = D.status !== 'denatured' && D.rate >= 15, seatOff = D.deform * 0.6;
      const bx = Math.min(BOX.x1, SEAT.x + 2.6), spots = [[bx, 0.75, 0.5], [bx + 0.15, -0.5, -0.6], [SEAT.x + 1.35, -0.95, 0.9], [SEAT.x + 1.4, 0.95, 0.2]];
      const A = subs[0]; setSplit(A, 0); A.mat.opacity = 1; A.g.visible = true; subs.forEach(sb => { if (!active.includes(sb)) sb.g.visible = false; });
      subs.forEach(sb => { sb.mat.depthWrite = true; });
      if (ok) { A.g.position.set(SEAT.x + seatOff, 0, 0); A.g.rotation.set(0, 0, 0); } else { A.g.position.set(SEAT.x + 1.45, 0.08, 0); A.g.rotation.set(0, 0, 0.15); }
      const P = subs[1]; P.g.visible = ok && D.rate >= 50; P.mat.opacity = 0.9; P.g.position.set(SEAT.x + 0.3, 0, 0); P.g.rotation.set(0, 0, 0); setSplit(P, 1, 0.55);
      for (let i = 2; i < active.length; i++) { const sp = spots[i - 2 + (ok ? 0 : 1)] || spots[0]; subs[i].g.visible = true; setSplit(subs[i], 0); subs[i].mat.opacity = 1; subs[i].g.position.set(sp[0], sp[1], 0); subs[i].g.rotation.set(0, 0, sp[2]); }
      if (!ok) { const P2 = subs[1]; P2.g.visible = true; setSplit(P2, 0); P2.mat.opacity = 1; P2.g.position.set(spots[0][0], spots[0][1], 0); P2.g.rotation.set(0, 0, spots[0][2]); }
    }
    function startEvent() {
      const free = active.filter(sb => sb.phase === 'free'); if (!free.length) return;
      free.sort((a, b) => a.pos.distanceTo(SEAT) - b.pos.distanceTo(SEAT));
      const sb = free[0]; busy = sb;
      sb.phase = D.status === 'denatured' ? 'attempt' : 'dock'; sb.t = 0; sb.from.copy(sb.pos); sb.fromRot = sb.g.rotation.z;
    }
    function simulate(dt, now) {
      const sp = D.speed, T0 = D.T || 37;
      // the enzyme vibrates more when hotter (tiny amplitude; purely illustrative)
      const amp = 0.018 * Math.pow(T0 / 70, 2);
      enzyme.position.set(E.x + amp * Math.sin(now * 37), amp * Math.sin(now * 29 + 1), 0); enzyme.rotation.z = amp * 0.6 * Math.sin(now * 23);
      const interval = D.status === 'denatured' ? 2.6 : D.rate >= 3 ? 1 / (0.85 * D.rate / 100) : Infinity;
      evClock += dt;
      if (!busy && evClock >= interval) { evClock = 0; startEvent(); }
      const seatX = SEAT.x + D.deform * 0.6;
      for (const sb of active) {
        sb.t += dt;
        if (sb.phase === 'free' || sb.phase === 'enter') {
          if (sb.phase === 'enter') { sb.mat.opacity = Math.min(1, sb.t / 0.5); if (sb.t >= 0.5) { sb.phase = 'free'; sb.mat.depthWrite = true; } }
          sb.vel.x += rnd(-1, 1) * sp * 3 * dt; sb.vel.y += rnd(-1, 1) * sp * 3 * dt; sb.vel.z += rnd(-1, 1) * sp * 1.5 * dt;
          const v = sb.vel.length(); if (v > sp) sb.vel.multiplyScalar(sp / v); if (v < sp * 0.5 && v > 0) sb.vel.multiplyScalar(sp * 0.5 / v);
          for (const o of active) if (o !== sb && (o.phase === 'free' || o.phase === 'enter')) { const dx = sb.pos.x - o.pos.x, dy = sb.pos.y - o.pos.y, dd = Math.hypot(dx, dy); if (dd < 0.95 && dd > 1e-3) { sb.vel.x += dx / dd * sp * 4 * dt; sb.vel.y += dy / dd * sp * 4 * dt; } }
          sb.pos.addScaledVector(sb.vel, dt);
          if (sb.pos.x < BOX.x0) { sb.pos.x = BOX.x0; sb.vel.x = Math.abs(sb.vel.x); } if (sb.pos.x > BOX.x1 && sb.phase === 'free') { sb.pos.x = BOX.x1; sb.vel.x = -Math.abs(sb.vel.x); }
          if (sb.pos.x > BOX.x1 + 0.4) sb.vel.x = -Math.abs(sb.vel.x);
          if (sb.pos.y < BOX.y0) { sb.pos.y = BOX.y0; sb.vel.y = Math.abs(sb.vel.y); } if (sb.pos.y > BOX.y1) { sb.pos.y = BOX.y1; sb.vel.y = -Math.abs(sb.vel.y); }
          if (sb.pos.z < BOX.z0) { sb.pos.z = BOX.z0; sb.vel.z = Math.abs(sb.vel.z); } if (sb.pos.z > BOX.z1) { sb.pos.z = BOX.z1; sb.vel.z = -Math.abs(sb.vel.z); }
          sb.g.position.copy(sb.pos); sb.g.rotation.z += sb.spin * sp * 1.4 * dt;
        } else if (sb.phase === 'dock' || sb.phase === 'attempt') {
          const dur = clamp(Math.hypot(sb.from.x - SEAT.x, sb.from.y) / (1.6 * sp + 0.4), 0.6, 2.4), k = ease(clamp(sb.t / dur, 0, 1));
          const tx = sb.phase === 'dock' ? seatX : SEAT.x + 1.15, cxp = SEAT.x + 1.15, u = 1 - k;
          sb.g.position.set(u * u * sb.from.x + 2 * u * k * cxp + k * k * tx, u * u * sb.from.y + 2 * u * k * 0.05, u * u * sb.from.z);
          sb.g.rotation.z = mix(sb.fromRot, 0, k);
          if (k >= 1) { sb.t = 0; sb.phase = sb.phase === 'dock' ? 'bound' : 'bounce'; sb.pos.copy(sb.g.position); }
        } else if (sb.phase === 'bound') {
          if (sb.t >= 0.45) { sb.phase = 'leave'; sb.t = 0; busy = null; evClock = Math.min(evClock, 0); }
        } else if (sb.phase === 'leave') {
          const k = clamp(sb.t / 1.4, 0, 1); setSplit(sb, Math.min(1, k * 1.6), k * 1.4); sb.mat.opacity = 1 - clamp((k - 0.35) / 0.65, 0, 1); sb.mat.depthWrite = false;
          if (k >= 1) spawn(sb, true);
        } else if (sb.phase === 'bounce') {
          const k = clamp(sb.t / 0.7, 0, 1);
          sb.g.position.x = sb.pos.x + 0.9 * Math.sin(k * Math.PI / 2); sb.g.position.y = sb.pos.y + 0.25 * k; sb.g.rotation.z = 0.5 * k;
          if (k >= 1) { sb.phase = 'free'; sb.pos.copy(sb.g.position); const a = rnd(-0.7, 0.7); sb.vel.set(Math.cos(a), Math.sin(a), 0).multiplyScalar(sp); busy = null; }
        }
      }
    }

    /* ----- apply state ----- */
    function siteLabel() {
      if (D.status === 'ok') return ['Active site', 'accent'];
      if (D.status === 'changing') return ['Active site changing shape', 'warn'];
      return ['Denatured: permanent', 'warn'];
    }
    // The active-site label sits above the cleft, or below it in small (drawer-open) views,
    // where the top-left corner is taken by the status label.
    function placeSite() { if (Hh < 210) lSite.sprite.position.set(E.x + 1.35, -1.02, 0.4); else lSite.sprite.position.set(E.x + 1.2, 0.98, 0.2); }
    function layout(s) { // (re)build the scene for a mode; instant, no tweens
      clearTweens(); mode = s.mode; sim = mode === 'temperature' || mode === 'ph';
      enzyme.position.copy(E); enzyme.rotation.set(0, 0, 0);
      subs.forEach(sb => { sb.g.visible = false; sb.phase = 'free'; }); other.visible = false; busy = null; evClock = 0;
      lEnzyme.sprite.position.set(E.x - 0.6, -1.3, 0.4);
      placeSite();
      hRate.set(null);
      FRAME = sim ? FRAMES.sim : FRAMES.still; resize();
      active = sim ? subs.slice(0, BOX.x1 - BOX.x0 > 2.8 ? 4 : 3) : [];
      if (mode === 'bind') { stageShown = -1; }
      if (mode === 'specific') { specShown = null; }
      if (sim) { D = derive(s); active.forEach(sb => spawn(sb, false)); if (reduce()) staticSim(); }
    }
    function apply(s, animate) {
      D = derive(s);
      if (s.mode !== mode) { layout(s); animate = false; }
      canvas.setAttribute('aria-label', ariaText(s));
      if (mode === 'bind') {
        lEnzyme.set('Enzyme', 'cool'); lSite.set('Active site', 'accent'); setDeform(0);
        const st = clamp(Math.round(num(s.stage, 0)), 0, 3);
        if (st !== stageShown) {
          if (!animate) { stageShown = st; pose = { ...POSES[st] }; hTitle.set(BIND_HUD[st], st === 1 ? 'accent' : 'plain'); applyPose(pose); }
          else goStage(st);
        }
      } else if (mode === 'specific') {
        lEnzyme.set('Enzyme', 'cool'); lSite.set('Active site', 'accent'); setDeform(0);
        const sig = `${s.substrate}|${!!s.tried}`;
        if (sig !== specShown) { specPose(s, animate && !!s.tried); specShown = sig; }
      } else {
        lEnzyme.set(mode === 'ph' ? (NAME[s.enzyme] || 'Amylase') : 'Enzyme', 'cool');
        const [txt, sty] = siteLabel(); lSite.set(txt, sty);
        const small = W < 400, cond = mode === 'ph' ? `pH ${D.pH}` : `${D.T} °C`;
        hTitle.set(small ? `${cond} · rate ${D.rate} %` : mode === 'ph' ? `${cond} · optimum ≈ ${D.opt}` : cond, mode === 'ph' ? (D.status === 'ok' ? 'good' : D.status === 'denatured' ? 'warn' : 'plain') : D.T > 45 ? 'warn' : D.T < 20 ? 'cool' : 'plain');
        hRate.set(small ? null : `Rate ${D.rate} %`, D.rate >= 80 ? 'good' : D.rate <= 10 ? 'warn' : 'plain');
        const target = D.deform, from = shownDeform < 0 ? target : shownDeform;
        if (!animate || Math.abs(target - from) < 1e-3) setDeform(target);
        else tween(650, k => setDeform(mix(from, target, k)), null, true, 'deform');
        if (reduce()) staticSim();
      }
      draw(); kick();
    }
    function command(cmd, s) {
      if (mode === 'bind' && cmd === 'replay') {
        const st = clamp(Math.round(num(s.stage, 0)), 0, 3), from = st === 0 ? OFF : POSES[st - 1];
        pose = { ...from }; applyPose(pose); stageShown = st; goStage(st, from); draw();
      }
      if (mode === 'specific' && cmd === 'try') { specShown = null; } // replays the try animation in the following update()
      if (sim && cmd === 'reset') { evClock = 0; }
    }

    /* ----- rotation (pointer + arrow keys) ----- */
    const rot = (dx, dy) => { rig.rotation.y = clamp(rig.rotation.y + dx, -1.4, 1.4); rig.rotation.x = clamp(rig.rotation.x + dy, -0.9, 0.9); state.rx = rig.rotation.x; state.ry = rig.rotation.y; if (!raf) draw(); };
    const onDown = e => { drag = [e.clientX, e.clientY]; try { canvas.setPointerCapture(e.pointerId); } catch (_) {} };
    const onMove = e => { if (!drag) return; rot((e.clientX - drag[0]) * 0.008, (e.clientY - drag[1]) * 0.008); drag = [e.clientX, e.clientY]; };
    const onUp = () => { drag = null; };
    const onKey = e => {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) return;
      e.preventDefault(); e.stopPropagation();
      rot(e.key === 'ArrowLeft' ? -0.15 : e.key === 'ArrowRight' ? 0.15 : 0, e.key === 'ArrowUp' ? -0.12 : e.key === 'ArrowDown' ? 0.12 : 0);
    };
    canvas.addEventListener('pointerdown', onDown); canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp); canvas.addEventListener('pointercancel', onUp); canvas.addEventListener('keydown', onKey);
    const observer = new ResizeObserver(resize); observer.observe(host);
    resize(); apply(state, false);

    return {
      update: s => apply(s, true),
      command: (cmd, s) => command(cmd, s),
      visibility: v => { visible = v; if (v) { last = performance.now(); kick(); } else if (raf) { cancelAnimationFrame(raf); raf = 0; } },
      dispose() {
        if (raf) cancelAnimationFrame(raf); raf = 0; tweens.length = 0; visible = false;
        observer.disconnect();
        canvas.removeEventListener('pointerdown', onDown); canvas.removeEventListener('pointermove', onMove);
        canvas.removeEventListener('pointerup', onUp); canvas.removeEventListener('pointercancel', onUp); canvas.removeEventListener('keydown', onKey);
        const seen = new Set();
        const free = o => { if (o && !seen.has(o)) { seen.add(o); o.dispose(); } };
        [scene, hud].forEach(root => root.traverse(o => { free(o.geometry); if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => { free(m.map); free(m); }); }));
        renderer.dispose(); try { renderer.forceContextLoss(); } catch (_) {}
        canvas.remove(); host.classList.remove('is-live');
      }
    };
  }

  return {
    caption: 'Schematic lock-and-key model. Shapes and speeds are illustrative. Drag or use arrow keys to rotate.',
    defaults: { mode: 'bind', stage: 0, substrate: 'match', tried: false, temp: 37, ph: 7, enzyme: 'amylase', maxDeform: 0, denatured: false, note: '' },
    controls, readout, onChange, command, mount
  };
})();
