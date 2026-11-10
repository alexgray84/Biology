/* Procedural flower for the Y7 dissection sheet. Three.js r160 local adaptation; anatomy retained.
   Flower axis = +y. Cut plane = z 0; the half-flower keeps z <= 0.
   Conventions: 5 sepals, 5 petals, 10 stamens, 1 carpel on a receptacle (superior ovary);
   ovules sit inside the ovary; flower A is generic, not a named species. */
(function () {
  const T = THREE, V3 = T.Vector3;
  const KEEP_BACK = new T.Plane(new V3(0, 0, -1), 0);
  const sRGB = T.SRGBColorSpace;
  const rad = d => d * Math.PI / 180;

  const A = {
    n: 5, sepalPhase: 36, petalL: 3.5, petalW: 1.15, spread: 1,
    petal: ['#f7d65a', '#d83a78', '#9c1f57'],
    sepal: '#3d7a35', filament: '#a3b04f', anther: '#a9560c', pollen: '#e9a60f',
    ovary: '#79a847', style: '#93b552', stigma: '#c4b52c', tissue: '#cfe0a0', edge: '#2f4a1d',
    ovule: '#efd98c', receptacle: '#689840', nectary: '#e39a1f',
    stamens: 10, stamenTop: 2.5, stamenR: 1.75, styleTop: 3.2, ovaryH: 1.0,
  };
  const B = Object.assign({}, A, {
    n: 4, sepalPhase: 45, petalL: 3.7, petalW: 1.0, spread: .56,
    petal: ['#fff0b0', '#f0a51f', '#b9640a'],
    stamens: 4, stamenTop: 3.25, stamenR: 1.05, styleTop: 2.15, ovaryH: 1.25,
  });

  function std(color, o) {
    return new T.MeshStandardMaterial(Object.assign({ color, roughness: .62, metalness: 0, side: T.DoubleSide }, o || {}));
  }
  function clip(m) { m.clippingPlanes = [KEEP_BACK]; m.clipShadows = true; return m; }
  function shadow(m) { m.castShadow = true; m.receiveShadow = true; return m; }

  function smooth(pts, n) {
    return new T.SplineCurve(pts.map(p => new T.Vector2(p[0], p[1]))).getPoints(n || 60).map(p => new T.Vector2(Math.max(p.x, 0), p.y));
  }

  function bladeTexture(cols, veins, base) {
    const c = document.createElement('canvas'); c.width = 768; c.height = 1280;
    const g = c.getContext('2d');
    const gr = g.createLinearGradient(0, c.height, 0, 0);
    if (base) { gr.addColorStop(0, cols[0]); gr.addColorStop(.2, cols[0]); gr.addColorStop(.42, cols[1]); gr.addColorStop(1, cols[1]); }
    else { gr.addColorStop(0, cols[1]); gr.addColorStop(1, cols[0]); }
    g.fillStyle = gr; g.fillRect(0, 0, c.width, c.height);
    g.strokeStyle = cols[2]; g.lineCap = 'round';
    for (let i = -veins; i <= veins; i++) {
      const f = i / veins;
      g.globalAlpha = i === 0 ? .62 : .3 + .14 * Math.abs(Math.sin(i * 2.3));
      g.lineWidth = i === 0 ? 7 : 3;
      g.beginPath(); g.moveTo(c.width / 2 + f * 34, c.height);
      g.bezierCurveTo(c.width / 2 + f * 170, c.height * .68, c.width / 2 + f * 340, c.height * .34, c.width / 2 + f * 355, c.height * .02);
      g.stroke();
    }
    g.globalAlpha = 1;
    const t = new T.CanvasTexture(c); t.colorSpace = sRGB; t.anisotropy = 8; return t;
  }

  /* A blade (petal or sepal) as a function of (t along, v across). */
  function bladeGeometry(fn) {
    const nu = 64, nv = 32, pos = [], uv = [], idx = [];
    for (let i = 0; i <= nu; i++) for (let j = 0; j <= nv; j++) {
      const t = i / nu, v = j / nv * 2 - 1, p = fn(t, v);
      pos.push(p.x, p.y, p.z); uv.push((v + 1) / 2, t);
    }
    for (let i = 0; i < nu; i++) for (let j = 0; j < nv; j++) {
      const a = i * (nv + 1) + j, b = a + 1, c = a + nv + 1, d = c + 1;
      idx.push(a, c, b, b, c, d);
    }
    const g = new T.BufferGeometry();
    g.setAttribute('position', new T.Float32BufferAttribute(pos, 3));
    g.setAttribute('uv', new T.Float32BufferAttribute(uv, 2));
    g.setIndex(idx); g.computeVertexNormals(); return g;
  }
  const radial = th => new V3(Math.cos(rad(th)), 0, Math.sin(rad(th)));
  const around = th => new V3(-Math.sin(rad(th)), 0, Math.cos(rad(th)));

  function petalPoint(cfg, th, t, v) {
    const s = cfg.spread;
    const r = .98 + cfg.petalL * s * (Math.pow(t, 1.25) * .78 - .02 * Math.sin(t * 3.14));
    const y = .02 + cfg.petalL * (.72 * Math.sin(t * 1.5) * (s > .8 ? 1 : 1.2) - (s > .8 ? .17 * t * t * t : 0));
    const w = cfg.petalW * Math.pow(Math.sin(Math.PI * Math.pow(t, .72)), .62) * (1 + .1 * t);
    const lift = (.34 * Math.abs(v) * Math.abs(v) + .05 * Math.sin(v * 8 + t * 5) * t) * w;
    return radial(th).multiplyScalar(r + lift * .2).addScaledVector(around(th), w * v).add(new V3(0, y + lift, 0));
  }
  function sepalPoint(cfg, th, t, v) {
    const r = 1.08 + (cfg.spread > .8 ? 2.15 : .95) * Math.pow(t, 1.1);
    const y = -.1 + (cfg.spread > .8 ? .62 : 1.05) * Math.sin(t * 1.35);
    const w = .54 * Math.pow(Math.sin(Math.PI * Math.pow(t, .62)), .7);
    return radial(th).multiplyScalar(r).addScaledVector(around(th), w * v).add(new V3(0, y + .26 * v * v * w, 0));
  }
  function stamenCurve(cfg, th) {
    const P = (r, y) => radial(th).multiplyScalar(r).add(new V3(0, y, 0));
    return new T.CatmullRomCurve3([P(.82, 0), P(.98, cfg.stamenTop * .36), P(1 + (cfg.stamenR - 1) * .72, cfg.stamenTop * .76), P(cfg.stamenR, cfg.stamenTop)]);
  }

  function sprinkle(group, geo, mat, list) {
    const m = new T.InstancedMesh(geo, mat, list.length), o = new T.Object3D();
    list.forEach((p, i) => { o.position.copy(p); o.updateMatrix(); m.setMatrixAt(i, o.matrix); });
    m.castShadow = true; group.add(m); return m;
  }

  function buildStamen(cfg, th, cut, seed) {
    const g = new T.Group(), curve = stamenCurve(cfg, th);
    const fm = std(cfg.filament, { roughness: .55 }); if (cut) clip(fm);
    g.add(shadow(new T.Mesh(new T.TubeGeometry(curve, 40, .05, 12), fm)));
    const tip = curve.getPoint(1), dir = curve.getTangent(1).normalize();
    const zAxis = radial(th).clone().multiplyScalar(-1).addScaledVector(dir, dir.dot(radial(th))).normalize();
    const xAxis = new V3().crossVectors(dir, zAxis).normalize();
    const anther = new T.Group();
    anther.matrixAutoUpdate = true;
    const q = new T.Quaternion().setFromRotationMatrix(new T.Matrix4().makeBasis(xAxis, dir, zAxis));
    anther.quaternion.copy(q); anther.position.copy(tip);
    const am = std(cfg.anther, { roughness: .78 }); if (cut) clip(am);
    const lobe = new T.SphereGeometry(1, 28, 20);
    [-1, 1].forEach(s => { const m = shadow(new T.Mesh(lobe, am)); m.scale.set(.115, .33, .135); m.position.set(s * .105, .1, 0); anther.add(m); });
    const pts = []; let h = seed * 9301 + 49297;
    const rnd = () => (h = (h * 9301 + 49297) % 233280) / 233280;
    for (let i = 0; i < 46; i++) {
      const a = rnd() * 6.283, yy = -.2 + rnd() * .6, s = rnd() > .5 ? 1 : -1;
      const rr = Math.sqrt(Math.max(0, 1 - Math.pow((yy - .1) / .33, 2)));
      pts.push(new V3(s * .105 + Math.cos(a) * .118 * rr, yy, Math.sin(a) * .138 * rr));
    }
    const pm = std(cfg.pollen, { roughness: .9 }); if (cut) clip(pm);
    sprinkle(anther, new T.SphereGeometry(.021, 10, 8), pm, pts);
    g.add(anther);
    return g;
  }

  function lathe(profile, mat, whole) {
    const g = whole ? new T.LatheGeometry(profile, 96) : new T.LatheGeometry(profile, 64, Math.PI / 2, Math.PI);
    return shadow(new T.Mesh(g, mat));
  }
  function capShape(profile, holes) {
    const s = new T.Shape();
    profile.forEach((p, i) => i ? s.lineTo(p.x, p.y) : s.moveTo(p.x, p.y));
    profile.slice().reverse().forEach(p => s.lineTo(-p.x, p.y));
    (holes || []).forEach(h => {
      const path = new T.Path(); h.forEach((p, i) => i ? path.lineTo(p.x, p.y) : path.moveTo(p.x, p.y)); s.holes.push(path);
    });
    return s;
  }
  function outline(pts, cfg, group, closed) {
    const c = new T.CatmullRomCurve3(pts.map(p => new V3(p.x, p.y, .004)), !!closed, 'catmullrom', .02);
    group.add(new T.Mesh(new T.TubeGeometry(c, Math.max(80, pts.length * 3), .024, 8, !!closed), new T.MeshBasicMaterial({ color: cfg.edge })));
  }
  function cap(profile, holes, color, cfg, group) {
    const m = new T.Mesh(new T.ShapeGeometry(capShape(profile, holes), 24), new T.MeshBasicMaterial({ color, side: T.DoubleSide }));
    group.add(m);
    outline(profile.slice(), cfg, group);
    outline(profile.map(p => new T.Vector2(-p.x, p.y)), cfg, group);
    (holes || []).forEach(h => outline(h, cfg, group, true));
  }

  function carpelParts(cfg) {
    const H = cfg.ovaryH, top = cfg.styleTop;
    const ovary = smooth([[0, 0], [.38, .02], [.6, .3 * H], [.66, .68 * H], [.52, 1.12 * H], [.26, 1.46 * H], [.1, 1.68 * H]], 70);
    const style = smooth([[.1, 1.68 * H], [.085, (1.68 * H + top) / 2], [.1, top - .05], [.14, top]], 30);
    const stigma = smooth([[.14, top], [.33, top + .08], [.37, top + .24], [.24, top + .4], [0, top + .44]], 36);
    const cav = smooth([[.09, .16 * H], [.3, .17 * H], [.48, .38 * H], [.5, .7 * H], [.38, 1.08 * H], [.2, 1.34 * H], [.09, 1.42 * H]], 50);
    return { ovary, style, stigma, cav };
  }

  function buildCarpel(cfg, cut) {
    const g = new T.Group(), p = carpelParts(cfg);
    g.add(lathe(p.ovary, std(cfg.ovary, { roughness: .5 }), !cut));
    g.add(lathe(p.style, std(cfg.style, { roughness: .5 }), !cut));
    g.add(lathe(p.stigma, std(cfg.stigma, { roughness: .88 }), !cut));
    if (cut) {
      const right = p.cav, left = right.map(q => new T.Vector2(-q.x, q.y));
      const cavMat = std('#c3d59a', { roughness: .8 });
      const inner = new T.LatheGeometry(right.concat([right[0]]), 64, Math.PI / 2, Math.PI);
      g.add(shadow(new T.Mesh(inner, cavMat)));
      cap(p.ovary, [right, left.slice().reverse()], cfg.tissue, cfg, g);
      cap(p.style, null, cfg.tissue, cfg, g);
      cap(p.stigma, null, '#e6d873', cfg, g);
    }
    const papPts = [], polPts = [], top = cfg.styleTop;
    for (let i = 0; i < 620; i++) {
      const f = i / 620, y = top + .06 + f * .38, phi = i * 2.39996;
      const r = .37 * Math.sqrt(Math.max(0, 1 - Math.pow((y - top - .22) / .23, 2)));
      if (cut && Math.sin(phi) > -.04) continue;
      const q = new V3(Math.cos(phi) * r, y, Math.sin(phi) * r);
      if (i % 11 === 0) polPts.push(q.clone().multiplyScalar(1.015)); else papPts.push(q);
    }
    sprinkle(g, new T.SphereGeometry(.03, 8, 6), std(cfg.stigma, { roughness: .85 }), papPts);
    sprinkle(g, new T.SphereGeometry(.04, 10, 8), std(cfg.pollen, { roughness: .9 }), polPts);
    return g;
  }

  /* Ovules: egg-shaped, on short stalks from the central placenta. */
  function ovulePlaces(cfg) {
    const H = cfg.ovaryH, out = [];
    [.42, .72, 1.0].forEach((h, i) => { const r = i === 2 ? .17 : .27; [1, -1].forEach(s => out.push(new V3(s * r, h * H, -.02))); });
    [.56, .88].forEach(h => [1, -1].forEach(s => out.push(new V3(s * .19, h * H, -.3))));
    return out;
  }
  function buildOvules(cfg) {
    const g = new T.Group(), sg = new T.SphereGeometry(1, 28, 20), m = std(cfg.ovule, { roughness: .42 }), fm = std('#a9bf6c');
    ovulePlaces(cfg).forEach(p => {
      const o = shadow(new T.Mesh(sg, m)); o.scale.set(.1, .135, .1); o.position.copy(p); o.rotation.z = p.x > 0 ? -.5 : .5; g.add(o);
      const a = new V3(Math.sign(p.x) * .07, p.y - .06, p.z);
      g.add(new T.Mesh(new T.TubeGeometry(new T.LineCurve3(a, p), 4, .016, 6), fm));
    });
    return g;
  }

  function buildBase(cfg, cut) {
    const g = new T.Group();
    const prof = smooth([[.17, -1.95], [.18, -1.1], [.27, -.62], [.62, -.33], [1.08, -.18], [1.2, -.04], [1.02, .02]], 70);
    prof.unshift(new T.Vector2(0, -1.95)); prof.push(new T.Vector2(0, .02));
    g.add(lathe(prof, std(cfg.receptacle, { roughness: .55 }), !cut));
    if (cut) {
      cap(prof, null, cfg.tissue, cfg, g);
      [1, -1].forEach(s => {
        const c = new T.CatmullRomCurve3([new V3(s * .08, -1.92, .006), new V3(s * .09, -1.05, .006), new V3(s * .2, -.5, .006), new V3(s * .62, -.14, .006)]);
        g.add(new T.Mesh(new T.TubeGeometry(c, 40, .014, 6), new T.MeshBasicMaterial({ color: '#8fae55' })));
      });
    }
    const nec = smooth([[.56, .0], [.62, .13], [.72, .15], [.8, .03]], 18);
    const nm = std(cfg.nectary, { roughness: .35 });
    g.add(lathe(nec, nm, !cut));
    if (cut) [1, -1].forEach(s => {
      const sh = new T.Shape(); nec.forEach((p, i) => i ? sh.lineTo(s * p.x, p.y) : sh.moveTo(s * p.x, p.y));
      g.add(new T.Mesh(new T.ShapeGeometry(sh), nm));
    });
    return g;
  }

  function buildWhorl(cfg, kind, cut) {
    const g = new T.Group();
    if (kind === 'petals') {
      const map = bladeTexture(cfg.petal, 10, true);
      for (let k = 0; k < cfg.n; k++) {
        const th = -90 + k * 360 / cfg.n; if (cut && Math.sin(rad(th)) > .5) continue; const m = std('#ffffff', { map, roughness: .52 }); if (cut) clip(m);
        const pm = shadow(new T.Mesh(bladeGeometry((t, v) => petalPoint(cfg, th, t, v)), m)); pm.receiveShadow = false; g.add(pm);
      }
    }
    if (kind === 'sepals') {
      const map = bladeTexture(['#6ea24a', cfg.sepal, '#245226'], 4, false);
      for (let k = 0; k < cfg.n; k++) {
        const th = -90 + cfg.sepalPhase + k * 360 / cfg.n; if (cut && Math.sin(rad(th)) > 0) continue; const m = std('#ffffff', { map, roughness: .6 }); if (cut) clip(m);
        g.add(shadow(new T.Mesh(bladeGeometry((t, v) => sepalPoint(cfg, th, t, v)), m)));
      }
    }
    if (kind === 'stamens') {
      const step = 360 / cfg.stamens, off = cfg.stamens === 4 ? 45 : 0;
      for (let k = 0; k < cfg.stamens; k++) g.add(buildStamen(cfg, -90 + off + k * step, cut, k + 1));
    }
    return g;
  }

  function lit(scene, key, target) {
    scene.background = new T.Color('#ffffff');
    scene.add(new T.HemisphereLight('#ffffff', '#c9c2b0', .46));
    const d = new T.DirectionalLight('#fff4e2', .72);
    d.position.copy(key || new V3(-5, 9, 11)); if (target) { d.position.add(target); d.target.position.copy(target); scene.add(d.target); } d.castShadow = true;
    d.shadow.mapSize.set(4096, 4096); d.shadow.bias = -.0004; d.shadow.normalBias = .018; d.shadow.radius = 7;
    Object.assign(d.shadow.camera, { left: -26, right: 26, top: 26, bottom: -26, near: 1, far: 90 });
    scene.add(d);
    const r = new T.DirectionalLight('#dfe9ff', .16); r.position.set(9, 2, 6); scene.add(r);
  }

  function half(cfg) {
    const s = new T.Scene(); lit(s);
    ['sepals', 'petals', 'stamens'].forEach(k => s.add(buildWhorl(cfg, k, true)));
    s.add(buildBase(cfg, true)); s.add(buildCarpel(cfg, true)); s.add(buildOvules(cfg));
    return s;
  }

  const EXPLODE = { base: 0, sepals: 3.9, petals: 9.3, stamens: 14.9, carpel: 18.9 };
  function exploded(cfg) {
    const s = new T.Scene(); lit(s, new V3(9, 9, 12), new V3(10, 0, 0));
    const c = new T.Group(); c.rotation.z = -Math.PI / 2; s.add(c);
    const add = (o, y) => { o.position.y = y; c.add(o); };
    add(buildBase(cfg, false), EXPLODE.base); add(buildWhorl(cfg, 'sepals', false), EXPLODE.sepals);
    add(buildWhorl(cfg, 'petals', false), EXPLODE.petals); add(buildWhorl(cfg, 'stamens', false), EXPLODE.stamens);
    add(buildCarpel(cfg, false), EXPLODE.carpel);
    // dashed-looking central axis, drawn as small beads so it survives printing
    const bead = new T.CylinderGeometry(.022, .022, .2, 8), bm = new T.MeshBasicMaterial({ color: '#21345B' });
    for (let y = .4; y < EXPLODE.carpel - .1; y += .46) { const b = new T.Mesh(bead, bm); b.position.y = y; c.add(b); }
    return s;
  }
  function whole(cfg) {
    const s = new T.Scene(); lit(s, new V3(9, 9, 12));
    const c = new T.Group(); c.rotation.z = -Math.PI / 2; s.add(c);
    ['sepals', 'petals', 'stamens'].forEach(k => c.add(buildWhorl(cfg, k, false)));
    c.add(buildBase(cfg, false)); c.add(buildCarpel(cfg, false));
    return s;
  }

  /* Anchor points for leader lines, in world coordinates. */
  function halfAnchors(cfg) {
    const c0 = stamenCurve(cfg, cfg === A ? -162 : -135), c1 = stamenCurve(cfg, cfg === A ? -18 : -45);
    const ov = ovulePlaces(cfg);
    return {
      stigma: new V3(.2, cfg.styleTop + .24, 0), style: new V3(.06, cfg.styleTop - (cfg === A ? .14 : .3), 0),
      ovary: new V3(.58, .68 * cfg.ovaryH, 0), ovule: ov[0].clone(),
      anther: c0.getPoint(1).clone().add(new V3(-.02, .12, 0)), filament: c0.getPoint(.55),
      antherR: c1.getPoint(1).clone().add(new V3(0, .12, 0)), filamentR: c1.getPoint(.55),
      petal: petalPoint(cfg, -162, .68, -.1), petalR: petalPoint(cfg, -18, .68, .1),
      sepal: sepalPoint(cfg, -126, .86, 0), sepalR: sepalPoint(cfg, -54, .86, 0),
      nectary: new V3(-.68, .1, 0), receptacle: new V3(-.72, -.2, 0), stalk: new V3(.12, -1.5, 0),
    };
  }
  const explodedAnchors = () => {
    const at = y => new V3(y, 0, 0), E = EXPLODE;
    return { base: at(E.base - .6), sepals: at(E.sepals + .55), petals: at(E.petals + 1.15), stamens: at(E.stamens + 1.2), carpel: at(E.carpel + 1.7),
      p1: at((E.base + E.sepals) / 2 - .35), p2: at((E.sepals + E.petals) / 2 + .35), p3: at((E.petals + E.stamens) / 2 + 1.9), p4: at((E.stamens + E.carpel) / 2 + .9), end: at(E.carpel + 3.9) };
  };

  function project(points, cam) {
    const o = {};
    Object.keys(points).forEach(k => { const p = points[k].clone().project(cam); o[k] = [(p.x + 1) / 2, (1 - p.y) / 2]; });
    return o;
  }

  window.FlowerGeometry = function () { return {scene: half(A), anchors: halfAnchors(A)}; };
  window.FlowerRender = function (job) {
    const r = new T.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    r.outputColorSpace = sRGB; r.shadowMap.enabled = true; r.shadowMap.type = T.PCFSoftShadowMap;
    r.localClippingEnabled = true; r.toneMapping = T.NoToneMapping; r.setPixelRatio(1);
    r.setSize(job.w, job.h);
    const cfg = job.flower === 'B' ? B : A;
    const scene = job.kind === 'half' ? half(cfg) : job.kind === 'exploded' ? exploded(cfg) : whole(cfg);
    const cam = new T.PerspectiveCamera(job.fov, job.w / job.h, .1, 200);
    cam.position.set(...job.pos); cam.lookAt(...job.look); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
    r.render(scene, cam);
    const anchors = job.kind === 'half' ? halfAnchors(cfg) : job.kind === 'exploded' ? explodedAnchors() : {};
    const png = r.domElement.toDataURL('image/png');
    const a = project(anchors, cam);
    r.dispose();
    return { png, anchors: a };
  };
})();
