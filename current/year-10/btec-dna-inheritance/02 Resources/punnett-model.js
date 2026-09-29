/* Lesson 02 · Alleles and Punnett squares — local Three.js (r160, global THREE) monohybrid-cross model.
   Original geometry (no downloaded assets, no network, no storage).
   State: cross 'Yy-Yy' | 'Yy-yy' | 'YY-yy' (pea seed colour: Y yellow, dominant; y green, recessive)
                | 'Ff-Ff' (F unaffected, dominant; f cystic fibrosis, recessive)
          filled (Punnett square completed) · bred, dom, rec (running tally of randomly bred offspring).
   Commands: fill (toggle), breed (20 offspring, each taking one allele at random from each parent), resetTally.
   Every number in the readout is computed from state here, so the screen stays true when WebGL is unavailable. */
window.LessonModels = window.LessonModels || {};
window.LessonModels.punnett = (() => {
  const reduce = () => !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const mix = (a, b, t) => a + (b - a) * t;
  const ease = k => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
  const back = k => { const c = 1.6, u = k - 1; return k <= 0 ? 0 : 1 + (c + 1) * u * u * u + c * u * u; };
  const num = (v, d = 0) => (Number.isFinite(+v) ? +v : d);

  /* ---------- genetics (no WebGL needed) ---------- */
  const CROSSES = {
    'Yy-Yy': { p1: ['Y', 'y'], p2: ['Y', 'y'], D: 'Y', r: 'y', button: 'Yy × Yy', name: 'Yy × Yy', key: 'Y yellow, dominant; y green' },
    'Yy-yy': { p1: ['Y', 'y'], p2: ['y', 'y'], D: 'Y', r: 'y', button: 'Yy × yy', name: 'Yy × yy', key: 'Y yellow, dominant; y green' },
    'YY-yy': { p1: ['Y', 'Y'], p2: ['y', 'y'], D: 'Y', r: 'y', button: 'YY × yy', name: 'YY × yy', key: 'Y yellow, dominant; y green' },
    'Ff-Ff': { p1: ['F', 'f'], p2: ['F', 'f'], D: 'F', r: 'f', button: 'Ff × Ff (CF)', name: 'Ff × Ff', key: 'f causes cystic fibrosis, recessive', cf: true }
  };
  const ORDER = ['Yy-Yy', 'Yy-yy', 'YY-yy', 'Ff-Ff'];
  const crossOf = s => CROSSES[s.cross] || CROSSES['Yy-Yy'];
  const upper = a => a === a.toUpperCase();
  const geno = (a, b) => (upper(a) || !upper(b) ? a + b : b + a); // dominant allele written first
  const dominant = g => upper(g[0]);
  // The four equally likely gamete combinations: row i = parent 2 allele, column j = parent 1 allele.
  const cells = cr => [0, 1].flatMap(i => [0, 1].map(j => ({ i, j, a2: cr.p2[i], a1: cr.p1[j], g: geno(cr.p2[i], cr.p1[j]) })));
  const pheno = (cr, g) => (cr.cf ? (g === cr.D + cr.D ? 'unaffected' : dominant(g) ? 'carrier' : 'has CF') : dominant(g) ? 'yellow' : 'green');
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  const fixed = cr => { const cs = cells(cr); return cs.every(x => dominant(x.g) === dominant(cs[0].g)); };

  function genoText(cr) {
    const n = {}; cells(cr).forEach(x => { n[x.g] = (n[x.g] || 0) + 1; });
    return [cr.D + cr.D, cr.D + cr.r, cr.r + cr.r].filter(g => n[g]).map(g => `${n[g]} ${g}`).join(' : ');
  }
  function phenoText(cr) {
    const cs = cells(cr), nd = cs.filter(x => dominant(x.g)).length, nr = cs.length - nd;
    if (cr.cf) {
      const car = cs.filter(x => x.g === cr.D + cr.r).length;
      return `${nd} unaffected${car ? ` (${car} of them carrier${car > 1 ? 's' : ''})` : ''} : ${nr} with CF · ${Math.round(100 * nr / cs.length)}% chance of CF`;
    }
    const pct = Math.round(100 * nd / cs.length);
    if (!nr) return `All ${nd} yellow (${pct}% yellow)`;
    if (!nd) return `All ${nr} green (0% yellow)`;
    const k = gcd(nd, nr);
    return `${nd} yellow : ${nr} green${k > 1 ? `, a ${nd / k} : ${nr / k} ratio` : ''} (${pct}% yellow)`;
  }
  function bredText(cr, s) {
    const n = num(s.bred), d = num(s.dom), r = num(s.rec);
    return cr.cf ? `${n} offspring: ${d} unaffected, ${r} with CF` : `${n} offspring: ${d} yellow, ${r} green`;
  }
  // Up to five rows, so keys sit inline and values are a little smaller than the frame default (fits 1280×720 with a drawer).
  const row = (k, v) => `<p style="margin:0 0 4px"><span class="readout-key" style="display:inline;margin:0 .55em 0 0">${k}</span><span class="readout-value" style="font-size:.98em;line-height:1.16">${v}</span></p>`;
  function readout(p, s) {
    const cr = crossOf(s);
    let h = row('Cross', `${cr.name} (${cr.key})`);
    h += s.filled ? row('Genotypes', genoText(cr)) + row('Phenotypes', phenoText(cr)) : row('Genotypes', 'Press Fill to predict');
    if (num(s.bred) > 0) {
      const g = cells(cr)[0].g;
      h += row('Bred so far', bredText(cr, s)) + (fixed(cr)
        ? row('Why exact?', `Every square is ${g}, so every offspring is ${pheno(cr, g)}: chance cannot change that.`)
        : row('Why not exact?', 'Each offspring is a separate chance event.'));
    }
    return h;
  }

  // The last cross each state's controls showed (so pressing the cross already chosen keeps the square and tally),
  // and each state's latest bred batch (for the tray). Kept beside the state, never stored or sent anywhere.
  const LAST = new WeakMap(), BATCH = new WeakMap();
  let SEQ = 0;
  const batchFor = s => { const b = BATCH.get(s); return b && b.cross === s.cross && num(s.bred) > 0 ? b : null; };

  const btn = (label, value, pressed, cmd = false, cls = '', disabled = false) => `<button type="button"${cls ? ` class="${cls}"` : ''} data-action="${cmd ? 'model-cmd' : 'model'}" data-value="${value}"${pressed === undefined ? '' : ` aria-pressed="${pressed}"`}${disabled ? ' disabled' : ''}>${label}</button>`;
  function controls(p, s) {
    LAST.set(s, s.cross);
    const cur = CROSSES[s.cross] ? s.cross : 'Yy-Yy';
    const tools = s.tools || 'all', sq = tools !== 'breed', br = tools !== 'square';
    return ((sq ? `<div class="control-group"><span class="control-label">Cross</span>${ORDER.map(k => btn(CROSSES[k].button, `cross=${k}`, cur === k)).join('')}${btn(s.filled ? 'Empty' : 'Fill', 'fill', undefined, true, s.filled ? '' : 'is-primary')}</div>` : '')
      + `<div class="control-group">`
      + `${br ? btn('Breed 20 offspring', 'breed', undefined, true, s.filled ? 'is-primary' : '') : ''}${br && num(s.bred) > 0 ? btn('Reset the count', 'resetTally', undefined, true) : ''}</div>`)
      .replace(/<button /g, '<button style="padding:5px 7px" ');
  }
  function resetCross(s) { s.filled = false; s.bred = 0; s.dom = 0; s.rec = 0; BATCH.delete(s); }
  function onChange(key, s) {
    if (key !== 'cross') return;
    if (LAST.get(s) !== s.cross) resetCross(s);
    LAST.set(s, s.cross);
  }
  function command(cmd, s) {
    if (cmd === 'fill') s.filled = !s.filled;
    else if (cmd === 'breed') {
      const cr = crossOf(s), list = [];
      let d = 0;
      for (let k = 0; k < 20; k++) { // one allele at random from each parent, independently for every offspring
        const g = geno(cr.p2[Math.random() < 0.5 ? 0 : 1], cr.p1[Math.random() < 0.5 ? 0 : 1]);
        list.push(g); if (dominant(g)) d++;
      }
      s.bred = num(s.bred) + 20; s.dom = num(s.dom) + d; s.rec = num(s.rec) + 20 - d;
      BATCH.set(s, { id: ++SEQ, cross: s.cross, list });
    } else if (cmd === 'resetTally') { s.bred = 0; s.dom = 0; s.rec = 0; BATCH.delete(s); }
  }
  function ariaText(s, tray = true) {
    const cr = crossOf(s), b = tray ? batchFor(s) : null;
    let t = `Punnett square model for the cross ${cr.name}. Parent 1 gametes: ${cr.p1.join(' and ')}. Parent 2 gametes: ${cr.p2.join(' and ')}. `;
    t += s.filled ? `The four squares show ${cells(cr).map(x => `${x.g}, ${pheno(cr, x.g)}`).join('; ')}. ` : 'The squares are empty. ';
    if (b) { const nd = b.list.filter(dominant).length; t += `Tray: the latest 20 offspring, ${nd} ${cr.cf ? 'unaffected' : 'yellow'} and ${b.list.length - nd} ${cr.cf ? 'with cystic fibrosis' : 'green'}. `; }
    return t + 'Drag or use arrow keys to tilt.';
  }

  /* ---------- layout (world units; grid centred on the origin) ---------- */
  const TILE = 1.3, GAP = 0.07, P = TILE + GAP, HALF = P + GAP / 2, TOKEN_R = 0.25;
  const COLX = [-P / 2, P / 2], ROWY = [P / 2, -P / 2];
  const P1Y = HALF + 0.14 + TOKEN_R, P2X = -P1Y;
  const GENO = { x: -0.27, y: 0.13 }, OBJ = { x: 0.3, y: 0.13 }, WORD = { x: 0, y: -0.38 };
  const TRAY_W = 2.8, TRAY_X0 = HALF + 0.38, TRAY_CX = TRAY_X0 + TRAY_W / 2;
  const SLOT = k => ({ x: TRAY_CX + ((k % 5) - 2) * 0.5, y: 0.66 - Math.floor(k / 5) * 0.56 });
  const ALLELE = { Y: '#e2b93b', y: '#6f9a3e', F: '#182944', f: '#ad5c63' };
  const WORD_INK = { yellow: '#7a5a0e', green: '#3d6629', unaffected: '#182944', carrier: '#1b5b6e', 'has CF': '#8c3d46' };
  const SANS = 'Montserrat, "Segoe UI", system-ui, sans-serif', SERIF = 'Georgia, "Times New Roman", serif';
  const STY = {
    box: { box: true, bg: 'rgba(252,249,241,0.96)', border: '#182944', ink: '#182944', family: SANS, weight: 700 },
    tray: { box: true, bg: 'rgba(252,249,241,0.96)', border: '#bd8126', ink: '#182944', family: SANS, weight: 700 },
    geno: { ink: '#182944', family: SERIF, weight: 700 },
    word: { ink: '#182944', family: SANS, weight: 700 },
    letterDark: { ink: '#182944', stroke: 'rgba(252,249,241,0.92)', family: SERIF, weight: 700 },
    letterLight: { ink: '#fcf9f1', stroke: 'rgba(24,41,68,0.85)', family: SERIF, weight: 700 }
  };

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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = T.SRGBColorSpace; renderer.setClearColor(0x000000, 0);
    const canvas = renderer.domElement; host.appendChild(canvas); host.classList.add('is-live');
    canvas.tabIndex = 0; canvas.setAttribute('role', 'img');

    const scene = new T.Scene(), camera = new T.PerspectiveCamera(30, 1, 0.1, 100);
    scene.add(new T.HemisphereLight(0xfffaf0, 0x8f8672, 1.6));
    const key = new T.DirectionalLight(0xfff4e2, 1.9); key.position.set(-3, 5, 7); scene.add(key);
    const fillLight = new T.DirectionalLight(0xdfeefe, 0.55); fillLight.position.set(5, -1, 4); scene.add(fillLight);
    const rig = new T.Group(), world = new T.Group(); rig.add(world); scene.add(rig);
    const BASE_X = -0.1, BASE_Y = -0.07;
    let tiltX = clamp(num(state.rx), -0.3, 0.3), tiltY = clamp(num(state.ry), -0.5, 0.5);
    const setTilt = () => rig.rotation.set(BASE_X + tiltX, BASE_Y + tiltY, 0);
    setTilt();

    /* materials and shared geometries */
    const std = (color, extra = {}) => new T.MeshStandardMaterial({ color, roughness: 0.55, metalness: 0.02, ...extra });
    const M = {
      plate: std('#182944', { roughness: 0.6 }), tile: std('#fbf6ea', { roughness: 0.9 }),
      rim: std('#182944', { roughness: 0.6 }), bed: std('#efe5cf', { roughness: 0.9 }),
      Y: std(ALLELE.Y, { roughness: 0.42 }), y: std(ALLELE.y, { roughness: 0.42 }), F: std(ALLELE.F, { roughness: 0.42 }), f: std(ALLELE.f, { roughness: 0.42 }),
      unaffected: std('#182944'), carrier: std('#24748d'), cf: std('#ad5c63'), badge: std('#bd8126', { roughness: 0.35, metalness: 0.1 })
    };
    function plateGeo(w, h, r, depth) {
      const s = new T.Shape(), x = -w / 2, y = -h / 2;
      s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r);
      s.quadraticCurveTo(x + w, y + h, x + w - r, y + h); s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
      s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
      const g = new T.ExtrudeGeometry(s, { depth, bevelEnabled: false, curveSegments: 6 }); g.translate(0, 0, -depth / 2); return g;
    }
    const G = {
      plate: plateGeo(2 * HALF, 2 * HALF, 0.12, 0.06), tile: plateGeo(TILE, TILE, 0.07, 0.1),
      rim: plateGeo(TRAY_W + 0.08, 2 * HALF + 0.08, 0.16, 0.05), bed: plateGeo(TRAY_W, 2 * HALF, 0.13, 0.08),
      disc: new T.CylinderGeometry(TOKEN_R, TOKEN_R, 0.1, 48).rotateX(Math.PI / 2),
      pea: new T.SphereGeometry(0.2, 32, 20), body: new T.CapsuleGeometry(0.085, 0.16, 6, 16),
      head: new T.SphereGeometry(0.082, 24, 16), badge: new T.SphereGeometry(0.05, 16, 12)
    };

    /* text sprites (canvas textures, cached per text and style; sized in world units with a pixel minimum) */
    let W = 1, H = 1, unit = 0.015;
    const texCache = new Map(), labels = [];
    function textMat(text, style, ink) {
      const k = `${style}|${ink || ''}|${text}`; let e = texCache.get(k); if (e) return e;
      const o = STY[style] || STY.box, S = 2, fs = 40 * S, lines = String(text).split('\n');
      const font = `${o.weight || 700} ${fs}px ${o.family || SANS}`;
      const c = document.createElement('canvas'), g = c.getContext('2d'); g.font = font;
      const padX = (o.box ? 0.55 : 0.22) * fs, padY = (o.box ? 0.3 : 0.1) * fs, lh = fs * 1.2;
      const tw = Math.max(...lines.map(l => g.measureText(l).width));
      const w = Math.ceil(tw + 2 * padX), h = Math.ceil(lh * lines.length + 2 * padY);
      c.width = w; c.height = h; g.font = font; g.textAlign = 'center'; g.textBaseline = 'middle';
      if (o.box) {
        g.fillStyle = o.bg; g.strokeStyle = o.border; g.lineWidth = 3 * S; g.beginPath();
        if (g.roundRect) g.roundRect(1.5 * S, 1.5 * S, w - 3 * S, h - 3 * S, 12 * S); else g.rect(1.5 * S, 1.5 * S, w - 3 * S, h - 3 * S);
        g.fill(); g.stroke();
      }
      lines.forEach((l, n) => {
        const y = padY + lh * (n + 0.5) + 0.04 * fs;
        if (o.stroke) { g.lineJoin = 'round'; g.lineWidth = 0.16 * fs; g.strokeStyle = o.stroke; g.strokeText(l, w / 2, y); }
        g.fillStyle = ink || o.ink; g.fillText(l, w / 2, y);
      });
      const tex = new T.CanvasTexture(c); tex.colorSpace = T.SRGBColorSpace; tex.anisotropy = 4;
      e = { mat: new T.SpriteMaterial({ map: tex, transparent: true, depthTest: false, depthWrite: false }), aspect: w / h, emFrac: fs / h };
      texCache.set(k, e); return e;
    }
    function makeLabel(parent, text, style, ink, em, minPx, maxW = Infinity) {
      const e = textMat(text, style, ink), sprite = new T.Sprite(e.mat); sprite.renderOrder = 10; parent.add(sprite);
      const L = {
        sprite, e, em, minPx, maxW, pop: 1,
        set(t, st, ik) { const n = textMat(t, st, ik); if (n !== L.e) { L.e = n; sprite.material = n.mat; } L.size(); },
        h() { let hh = Math.max(L.em, L.minPx * unit) / L.e.emFrac; if (hh * L.e.aspect > L.maxW) hh = L.maxW / L.e.aspect; return hh; },
        width() { return L.h() * L.e.aspect; },
        size() { const hh = L.h() * L.pop; sprite.scale.set(Math.max(1e-4, hh * L.e.aspect), Math.max(1e-4, hh), 1); }
      };
      labels.push(L); L.size(); return L;
    }

    /* scene: navy plate with four cream tiles, gamete tokens, cell contents, offspring tray */
    const plate = new T.Mesh(G.plate, M.plate); plate.position.z = -0.03; world.add(plate);
    function makeToken(parent) {
      const g = new T.Group(); parent.add(g);
      const disc = new T.Mesh(G.disc, M.Y); g.add(disc);
      const L = makeLabel(g, 'Y', 'letterDark', null, 0.3, 13); L.sprite.position.z = 0.08;
      return { g, disc, L, set(a) { disc.material = M[a] || M.Y; L.set(a, a === 'F' || a === 'f' ? 'letterLight' : 'letterDark'); } };
    }
    function makeFigure(parent, scale) {
      const g = new T.Group(); g.scale.setScalar(scale); parent.add(g);
      const body = new T.Mesh(G.body, M.unaffected), head = new T.Mesh(G.head, M.unaffected), badge = new T.Mesh(G.badge, M.badge);
      body.position.y = -0.09; head.position.y = 0.172; badge.position.set(0.03, -0.04, 0.075); badge.visible = false; g.add(body, head, badge);
      return { g, base: scale, set(kind) { const m = kind === 'carrier' ? M.carrier : kind === 'has CF' ? M.cf : M.unaffected; body.material = m; head.material = m; badge.visible = kind === 'carrier'; } };
    }
    const p1Tokens = [0, 1].map(j => { const t = makeToken(world); t.g.position.set(COLX[j], P1Y, 0.1); return t; });
    const p2Tokens = [0, 1].map(i => { const t = makeToken(world); t.g.position.set(P2X, ROWY[i], 0.1); return t; });
    const copies = Array.from({ length: 8 }, () => { const t = makeToken(world); t.g.visible = false; return t; });
    const lP1 = makeLabel(world, 'Parent 1 gametes', 'box', null, 0.23, 12);
    let narrow = false; // narrow host (drawer open, phone): no tray, parent 1 label above its gametes
    const NO_TRAY = (state && state.tools) === 'square'; // the Punnett-square screen has no breeding tray
    function placeP1() {
      if (narrow) { lP1.sprite.center.set(0.5, 0); lP1.sprite.position.set(0, P1Y + TOKEN_R + 0.08, 0.1); }
      else { lP1.sprite.center.set(0, 0.5); lP1.sprite.position.set(COLX[1] + TOKEN_R + 0.14, P1Y, 0.1); }
    }
    placeP1();
    const lP2 = makeLabel(world, 'Parent 2\ngametes', 'box', null, 0.23, 12);
    lP2.sprite.center.set(1, 0.5); lP2.sprite.position.set(P2X - TOKEN_R - 0.14, 0, 0.1);
    const cellsG = [0, 1].flatMap(i => [0, 1].map(j => {
      const g = new T.Group(); g.position.set(COLX[j], ROWY[i], 0); world.add(g);
      const tile = new T.Mesh(G.tile, M.tile); tile.position.z = 0.02; g.add(tile);
      const content = new T.Group(); content.position.z = 0.09; content.visible = false; g.add(content);
      const pea = new T.Mesh(G.pea, M.Y); pea.position.set(OBJ.x, OBJ.y, 0.12); content.add(pea);
      const fig = makeFigure(content, 1.1); fig.g.position.set(OBJ.x, OBJ.y, 0.1);
      const gl = makeLabel(content, 'Yy', 'geno', null, 0.34, 13); gl.sprite.position.set(GENO.x, GENO.y, 0.2);
      const wl = makeLabel(content, 'yellow', 'word', WORD_INK.yellow, 0.22, 11, TILE - 0.1); wl.sprite.position.set(WORD.x, WORD.y, 0.2);
      return { i, j, g, content, pea, fig, gl, wl };
    }));
    const trayG = new T.Group(); world.add(trayG);
    const rim = new T.Mesh(G.rim, M.rim); rim.position.set(TRAY_CX, 0, -0.03); trayG.add(rim);
    const bed = new T.Mesh(G.bed, M.bed); bed.position.set(TRAY_CX, 0, 0.02); trayG.add(bed);
    const lTray = makeLabel(trayG, 'Latest 20 offspring', 'tray', null, 0.21, 11, TRAY_W - 0.12); lTray.sprite.position.set(TRAY_CX, HALF - 0.25, 0.12);
    const slots = Array.from({ length: 20 }, (_, k) => {
      const g = new T.Group(), p = SLOT(k); g.position.set(p.x, p.y, 0.2); g.visible = false; trayG.add(g);
      const pea = new T.Mesh(G.pea, M.Y); pea.scale.setScalar(0.8); g.add(pea);
      const fig = makeFigure(g, 0.78); fig.g.position.y = -0.01;
      return { g, pea, fig };
    });

    /* animation: tweens only, one rAF loop that stops when idle or hidden */
    let raf = 0, visible = true, drag = null, disposed = false;
    const tweens = [];
    const draw = () => { if (!disposed) renderer.render(scene, camera); };
    function frame(now) {
      raf = 0;
      for (let i = tweens.length - 1; i >= 0; i--) {
        const tw = tweens[i], k = clamp((now - tw.t0) / tw.dur, 0, 1);
        tw.fn(tw.ease ? ease(k) : k);
        if (k >= 1) { tweens.splice(i, 1); tw.done && tw.done(); }
      }
      draw();
      if (!raf && visible && tweens.length) raf = requestAnimationFrame(frame);
    }
    function kick() { if (!raf && visible && tweens.length) raf = requestAnimationFrame(frame); }
    const stopTag = tag => { for (let i = tweens.length - 1; i >= 0; i--) if (tweens[i].tag === tag) tweens.splice(i, 1); };
    function tween(dur, fn, done, easeOn, tag) {
      if (tag) stopTag(tag);
      if (reduce() || dur <= 0) { fn(1); if (done) done(); return; }
      tweens.push({ t0: performance.now(), dur, fn, done, ease: easeOn, tag }); kick();
    }

    /* cells */
    function setPop(cg, k) {
      cg.gl.pop = k; cg.wl.pop = k; cg.gl.size(); cg.wl.size();
      const s = Math.max(1e-3, k); cg.pea.scale.setScalar(s); cg.fig.g.scale.setScalar(cg.fig.base * s);
    }
    function showCells(on) { cellsG.forEach(cg => { cg.content.visible = on; setPop(cg, 1); }); copies.forEach(c => { c.g.visible = false; }); }
    function setCross(cr) {
      stopTag('fill'); stopTag('pop'); stopTag('tray');
      p1Tokens.forEach((t, j) => t.set(cr.p1[j])); p2Tokens.forEach((t, i) => t.set(cr.p2[i]));
      cells(cr).forEach((x, c) => {
        const cg = cellsG[c], ph = pheno(cr, x.g);
        cg.gl.set(x.g, 'geno'); cg.wl.set(ph, 'word', WORD_INK[ph]);
        cg.pea.visible = !cr.cf; cg.fig.g.visible = !!cr.cf;
        if (cr.cf) cg.fig.set(ph); else cg.pea.material = dominant(x.g) ? M.Y : M.y;
      });
      showCells(false);
    }
    const cellTarget = (x, left) => new T.Vector3(COLX[x.j] + GENO.x + (left ? -0.13 : 0.13), ROWY[x.i] + GENO.y, 0.34);
    function playFill(cr) {
      // a copy of each gamete token slides into every square in its column (parent 1) or row (parent 2), then the
      // genotype and phenotype appear; ~0.9 s of sliding
      showCells(false);
      const moves = [];
      cells(cr).forEach((x, c) => {
        const p2Left = upper(x.a2) || !upper(x.a1);
        const a = copies[2 * c], b = copies[2 * c + 1];
        a.set(x.a1); b.set(x.a2);
        moves.push({ t: a, from: new T.Vector3(COLX[x.j], P1Y, 0.14), to: cellTarget(x, !p2Left), delay: 0.12 * x.i, dur: 0.46 });
        moves.push({ t: b, from: new T.Vector3(P2X, ROWY[x.i], 0.14), to: cellTarget(x, p2Left), delay: 0.3 + 0.12 * x.j, dur: 0.46 });
      });
      const total = 0.9, tmp = new T.Vector3();
      tween(total * 1000, k => {
        const now = k * total;
        for (const m of moves) {
          const u = clamp((now - m.delay) / m.dur, 0, 1), e = ease(u);
          m.t.g.visible = true;
          tmp.lerpVectors(m.from, m.to, e); tmp.z += 0.28 * Math.sin(Math.PI * u);
          m.t.g.position.copy(tmp); m.t.g.scale.setScalar(mix(1, 0.6, e));
        }
      }, () => {
        copies.forEach(c => { c.g.visible = false; c.g.scale.setScalar(1); });
        cellsG.forEach(cg => { cg.content.visible = true; setPop(cg, 0); });
        tween(260, k => cellsG.forEach(cg => setPop(cg, back(k))), () => cellsG.forEach(cg => setPop(cg, 1)), false, 'pop');
      }, false, 'fill');
    }

    /* tray */
    function setTray(list, cr) {
      slots.forEach((sl, n) => {
        const g = list[n]; sl.g.visible = !!g; sl.g.scale.setScalar(1);
        if (!g) return;
        sl.pea.visible = !cr.cf; sl.fig.g.visible = !!cr.cf;
        if (cr.cf) sl.fig.set(pheno(cr, g)); else sl.pea.material = dominant(g) ? M.Y : M.y;
      });
    }
    function playTray(list, cr) {
      setTray(list, cr);
      const step = 40, pop = 180, total = step * (list.length - 1) + pop;
      slots.forEach(sl => { sl.g.scale.setScalar(1e-3); });
      tween(total, k => {
        const t = k * total;
        slots.forEach((sl, n) => { if (n < list.length) sl.g.scale.setScalar(Math.max(1e-3, back(clamp((t - n * step) / pop, 0, 1)))); });
      }, () => slots.forEach(sl => sl.g.scale.setScalar(1)), false, 'tray');
    }

    /* framing: fit the whole stage (labels, tokens, grid and tray) to the host */
    function frameBox() {
      const x0 = Math.min(P2X - TOKEN_R, lP2.sprite.position.x - lP2.width()), y0 = -HALF - 0.04;
      if (narrow) return { x0, x1: Math.max(HALF + 0.04, lP1.width() / 2), y0, y1: lP1.sprite.position.y + lP1.h() };
      return {
        x0, y0,
        x1: Math.max(TRAY_X0 + TRAY_W + 0.04, lP1.sprite.position.x + lP1.width(), TRAY_CX + lTray.width() / 2),
        y1: Math.max(P1Y + TOKEN_R, P1Y + lP1.h() / 2)
      };
    }
    function resize() {
      const r = host.getBoundingClientRect(); if (!r.width || !r.height) return;
      W = r.width; H = r.height; renderer.setSize(W, H, false); camera.aspect = W / H;
      const wasNarrow = narrow; narrow = W < 420 || NO_TRAY; trayG.visible = !narrow; placeP1();
      if (wasNarrow !== narrow && lastState) canvas.setAttribute('aria-label', ariaText(lastState, !narrow));
      const t = Math.tan(T.MathUtils.degToRad(camera.fov / 2));
      let d = 8, b = frameBox();
      for (let it = 0; it < 3; it++) { // label sizes depend on the pixel scale, which depends on the framing
        labels.forEach(L => L.size()); b = frameBox();
        const hw = (b.x1 - b.x0) / 2 * 1.05 + 0.06, hh = (b.y1 - b.y0) / 2 * 1.06 + 0.06;
        d = Math.max(hh / t, hw / (t * camera.aspect)); unit = 2 * d * t / H;
      }
      labels.forEach(L => L.size());
      world.position.set(-(b.x0 + b.x1) / 2, -(b.y0 + b.y1) / 2, 0);
      const el = 0.05; camera.position.set(0, d * Math.sin(el), d * Math.cos(el)); camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
      draw();
    }

    /* apply state */
    let shownCross = null, shownFilled = null, shownBatch = -1, lastState = null;
    function apply(s, animate) {
      lastState = s;
      const cr = crossOf(s), cross = CROSSES[s.cross] ? s.cross : 'Yy-Yy';
      if (cross !== shownCross) { setCross(cr); shownCross = cross; shownFilled = null; shownBatch = -1; }
      const filled = !!s.filled;
      if (filled !== shownFilled) {
        stopTag('fill'); stopTag('pop');
        if (filled && animate && !reduce()) playFill(cr); else showCells(filled);
        shownFilled = filled;
      }
      const b = batchFor(s), id = b ? b.id : 0;
      if (id !== shownBatch) {
        stopTag('tray');
        if (b && animate && !reduce()) playTray(b.list, cr); else setTray(b ? b.list : [], cr);
        shownBatch = id;
      }
      canvas.setAttribute('aria-label', ariaText(s, !narrow));
      draw(); kick();
    }

    /* tilt (pointer + arrow keys; a small range keeps the square readable) */
    const rot = (dx, dy) => { tiltY = clamp(tiltY + dx, -0.5, 0.5); tiltX = clamp(tiltX + dy, -0.3, 0.3); state.rx = tiltX; state.ry = tiltY; setTilt(); if (!raf) draw(); };
    const onDown = e => { drag = [e.clientX, e.clientY]; try { canvas.setPointerCapture(e.pointerId); } catch (_) {} };
    const onMove = e => { if (!drag) return; rot((e.clientX - drag[0]) * 0.006, (e.clientY - drag[1]) * 0.006); drag = [e.clientX, e.clientY]; };
    const onUp = () => { drag = null; };
    const onKey = e => {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) return;
      e.preventDefault(); e.stopPropagation();
      rot(e.key === 'ArrowLeft' ? -0.1 : e.key === 'ArrowRight' ? 0.1 : 0, e.key === 'ArrowUp' ? -0.08 : e.key === 'ArrowDown' ? 0.08 : 0);
    };
    canvas.addEventListener('pointerdown', onDown); canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp); canvas.addEventListener('pointercancel', onUp); canvas.addEventListener('keydown', onKey);
    const observer = new ResizeObserver(resize); observer.observe(host);
    resize(); apply(state, false);

    return {
      update: s => apply(s, true),
      command: () => {}, // state changes arrive through update(); fill and breed animate from there
      visibility: v => { visible = v; if (v) kick(); else if (raf) { cancelAnimationFrame(raf); raf = 0; } },
      dispose() {
        disposed = true; if (raf) cancelAnimationFrame(raf); raf = 0; tweens.length = 0; visible = false;
        observer.disconnect();
        canvas.removeEventListener('pointerdown', onDown); canvas.removeEventListener('pointermove', onMove);
        canvas.removeEventListener('pointerup', onUp); canvas.removeEventListener('pointercancel', onUp); canvas.removeEventListener('keydown', onKey);
        const seen = new Set(), free = o => { if (o && !seen.has(o)) { seen.add(o); o.dispose(); } };
        scene.traverse(o => { free(o.geometry); if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => { free(m.map); free(m); }); });
        texCache.forEach(e => { free(e.mat.map); free(e.mat); }); texCache.clear();
        Object.values(G).forEach(free); Object.values(M).forEach(free);
        renderer.dispose(); try { renderer.forceContextLoss(); } catch (_) {}
        canvas.remove(); host.classList.remove('is-live');
      }
    };
  }

  return {
    caption: 'Original 3D model. Each square shows one equally likely combination of gametes.',
    defaults: { cross: 'Yy-Yy', filled: false, bred: 0, dom: 0, rec: 0 },
    controls, readout, onChange, command, mount
  };
})();
