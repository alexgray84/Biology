/* Three.js r149 procedural exhibit illustration. Scientific proportions and colours are simplified. */
(() => {
  const canvas = document.getElementById('museum-scene');
  const fallback = document.getElementById('scene-fallback');
  const toggle = document.getElementById('motion-toggle');
  if (!canvas || !window.THREE) return;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'low-power' });
  } catch (_) {
    return;
  }
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.9;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#234353');
  const camera = new THREE.OrthographicCamera(-5.8, 5.8, 3.9, -3.9, 0.1, 80);
  camera.position.set(8, 5.2, 10);
  camera.lookAt(0, 1.4, 0);
  scene.add(new THREE.HemisphereLight(0xd7e9e5, 0x122d3a, 0.9));
  const key = new THREE.DirectionalLight(0xffe6b5, 1.25);
  key.position.set(-4, 8, 6);
  scene.add(key);

  const material = (colour, metalness = 0) => new THREE.MeshStandardMaterial({ color: colour, roughness: 0.72, metalness });
  const ink = material('#183746');
  const wall = material('#668d94');
  const floor = material('#4c7377');
  const cream = material('#f8f0d6');
  const gold = material('#efc060', 0.08);
  const coral = material('#d4765b');
  const teal = material('#58b8b4');
  const navy = material('#285266');

  const box = (w, h, d, x, y, z, mat, parent = scene) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    mesh.position.set(x, y, z);
    parent.add(mesh);
    return mesh;
  };
  const sphere = (r, x, y, z, mat, parent = scene, segments = 16) => {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, segments, 12), mat);
    mesh.position.set(x, y, z);
    parent.add(mesh);
    return mesh;
  };
  const rod = (a, b, radius, mat, parent = scene) => {
    const start = new THREE.Vector3(...a);
    const end = new THREE.Vector3(...b);
    const length = start.distanceTo(end);
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, length, 9), mat);
    mesh.position.copy(start).add(end).multiplyScalar(0.5);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), end.sub(start).normalize());
    parent.add(mesh);
    return mesh;
  };

  // A small gallery: architectural surfaces, two wall exhibits and a central display.
  box(12.6, 0.16, 8.6, 0, -0.12, 0, floor);
  box(12.6, 6.8, 0.16, 0, 3.3, -3.6, wall);
  box(0.16, 6.8, 8.6, -6.2, 3.3, 0, navy);
  box(0.16, 6.8, 8.6, 6.2, 3.3, 0, navy);
  box(2.2, 2.35, 0.12, -3.55, 3.0, -3.38, ink);
  box(1.94, 2.08, 0.13, -3.55, 3.0, -3.27, cream);
  box(2.2, 2.35, 0.12, 3.55, 3.0, -3.38, ink);
  box(1.94, 2.08, 0.13, 3.55, 3.0, -3.27, cream);
  // Stylised cell image at left; informational artwork, not a micrograph.
  sphere(0.43, -3.7, 3.0, -3.14, teal);
  sphere(0.16, -3.61, 3.02, -2.73, coral);
  sphere(0.3, -4.28, 3.55, -3.13, teal);
  sphere(0.11, -4.22, 3.56, -2.82, coral);
  sphere(0.3, -2.92, 2.46, -3.13, teal);
  sphere(0.11, -2.86, 2.47, -2.82, coral);
  // A simplified chromosome motif in the other wall frame.
  rod([3.12, 2.25, -3.08], [3.9, 3.85, -3.08], 0.13, coral);
  rod([3.9, 2.25, -3.08], [3.12, 3.85, -3.08], 0.13, teal);
  sphere(0.16, 3.51, 3.03, -3.08, gold);

  box(2.5, 0.18, 2.1, 0, 0.18, -0.6, ink);
  box(1.78, 1.1, 1.58, 0, 0.81, -0.6, cream);
  box(2.08, 0.14, 1.88, 0, 1.42, -0.6, gold);

  const helix = new THREE.Group();
  helix.position.set(0, 1.56, -0.6);
  const strandA = [];
  const strandB = [];
  const turns = 2.3;
  for (let i = 0; i <= 80; i++) {
    const t = i / 80;
    const angle = turns * Math.PI * 2 * t;
    const y = t * 3.3;
    strandA.push(new THREE.Vector3(Math.cos(angle) * 0.63, y, Math.sin(angle) * 0.63));
    strandB.push(new THREE.Vector3(-Math.cos(angle) * 0.63, y, -Math.sin(angle) * 0.63));
  }
  helix.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(strandA), 180, 0.075, 8, false), gold));
  helix.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(strandB), 180, 0.075, 8, false), coral));
  for (let i = 0; i <= 16; i++) {
    const t = i / 16;
    const angle = turns * Math.PI * 2 * t;
    const y = t * 3.3;
    const a = [Math.cos(angle) * 0.63, y, Math.sin(angle) * 0.63];
    const b = [-a[0], y, -a[2]];
    rod(a, b, 0.046, i % 2 ? teal : cream, helix);
    sphere(0.09, ...a, gold, helix, 10);
    sphere(0.09, ...b, coral, helix, 10);
  }
  scene.add(helix);

  // Visitors are intentionally low-poly silhouettes: people encountering the exhibit.
  const visitor = (x, z, coat, height = 1) => {
    const group = new THREE.Group();
    group.position.set(x, 0, z);
    group.scale.setScalar(height);
    sphere(0.24, 0, 1.81, 0, cream, group);
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.34, 0.96, 9), coat);
    body.position.y = 1.1;
    group.add(body);
    rod([-0.12, 0.7, 0], [-0.18, 0.05, 0.04], 0.073, ink, group);
    rod([0.12, 0.7, 0], [0.19, 0.05, 0.04], 0.073, ink, group);
    rod([-0.24, 1.38, 0], [-0.47, 0.91, -0.14], 0.065, cream, group);
    rod([0.24, 1.38, 0], [0.43, 0.92, -0.2], 0.065, cream, group);
    scene.add(group);
  };
  visitor(-2.7, 2.1, coral, 1.1);
  visitor(2.75, 1.4, teal, 0.88);

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const aspect = rect.width / rect.height;
    const extent = 3.8;
    camera.left = -extent * aspect;
    camera.right = extent * aspect;
    camera.top = extent;
    camera.bottom = -extent;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(rect.width, rect.height, false);
  };
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  resize();
  fallback.hidden = true;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reduced.matches;
  toggle.hidden = false;
  toggle.textContent = paused ? 'Play motion' : 'Pause motion';
  toggle.setAttribute('aria-pressed', String(paused));
  toggle.addEventListener('click', () => {
    paused = !paused;
    toggle.textContent = paused ? 'Play motion' : 'Pause motion';
    toggle.setAttribute('aria-pressed', String(paused));
  });
  let previous = 0;
  const frame = (time) => {
    if (!paused && !document.hidden) {
      helix.rotation.y += Math.min((time - previous) / 1000, 0.05) * 0.16;
    }
    previous = time;
    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
})();
