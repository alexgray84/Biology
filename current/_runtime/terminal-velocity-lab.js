/**
 * Edu OS terminal-velocity laboratory.
 * Three.js r149 is bundled locally beside this module. The model is qualitative:
 * arrow length communicates relative force size and the moving sky communicates speed.
 */
const THREE = window.THREE;

const STAGES = [
  {
    short: 'Leaves aircraft',
    name: 'Just after the jump',
    motion: 'Accelerating downwards',
    compare: 'Weight is greater than drag',
    reason: 'The parachutist is moving slowly, so drag is small. The resultant force is downwards.',
    weight: 1, drag: 0.14, speed: 0.2, canopy: 0
  },
  {
    short: 'Speeds up',
    name: 'Speed increasing',
    motion: 'Accelerating downwards',
    compare: 'Weight is greater than drag',
    reason: 'As speed increases, drag increases. Weight is still larger, so the parachutist continues to accelerate downwards.',
    weight: 1, drag: 0.52, speed: 0.62, canopy: 0
  },
  {
    short: 'First terminal velocity',
    name: 'First terminal velocity',
    motion: 'Constant velocity downwards',
    compare: 'Weight equals drag',
    reason: 'The forces are balanced, so the resultant force is zero. The parachutist keeps moving downwards at constant velocity.',
    weight: 1, drag: 1, speed: 1, canopy: 0
  },
  {
    short: 'Parachute opens',
    name: 'Parachute opens',
    motion: 'Still falling, but slowing',
    compare: 'Drag is greater than weight',
    reason: 'Opening the parachute suddenly increases area and drag. The resultant force is upwards, opposing the downward motion.',
    weight: 1, drag: 1.72, speed: 0.9, canopy: 1
  },
  {
    short: 'Slows down',
    name: 'Speed decreasing',
    motion: 'Still falling, but slowing',
    compare: 'Drag is greater than weight',
    reason: 'As the parachutist slows, drag decreases. It is still larger than weight, so the downward speed continues to decrease.',
    weight: 1, drag: 1.3, speed: 0.5, canopy: 1
  },
  {
    short: 'New terminal velocity',
    name: 'Lower terminal velocity',
    motion: 'Constant velocity downwards',
    compare: 'Weight equals drag',
    reason: 'Drag has fallen until it equals weight again. The resultant force is zero, so the parachutist falls at a new, lower constant velocity.',
    weight: 1, drag: 1, speed: 0.2, canopy: 1
  }
];

let activeCleanup = null;
const esc = value => String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[character]));

function staticDiagram(stage, inquiryMode) {
  const weight = Math.round(stage.weight * 72);
  const drag = Math.round(stage.drag * 72);
  const resultant = Math.round(Math.abs(stage.weight - stage.drag) * 72);
  const direction = stage.weight > stage.drag ? 'downwards' : stage.drag > stage.weight ? 'upwards' : 'zero';
  const evidence = inquiryMode
    ? `<strong>Force-arrow evidence</strong><span>Downward speed marker: ${Math.max(1, Math.round(stage.speed * 5))} of 5</span><span>Use the two arrow lengths to decide the resultant.</span>`
    : `<strong>${esc(stage.compare)}</strong><span>Resultant force: ${resultant ? `${direction} (relative size ${resultant})` : 'zero'}</span><span>Motion: ${esc(stage.motion)}</span>`;
  return `<div class="terminal-simple-diagram" aria-hidden="true">
    <div class="simple-arrow drag" style="height:${Math.max(14, drag)}px"><span>drag</span></div>
    <div class="simple-person"><span></span><i></i></div>
    <div class="simple-arrow weight" style="height:${Math.max(14, weight)}px"><span>weight</span></div>
  </div>
  <div class="terminal-simple-copy">${evidence}</div>`;
}

function mount(host) {
  let config = {};
  try { config = JSON.parse(decodeURIComponent(host.dataset.config || '%7B%7D')); } catch { config = {}; }
  host.innerHTML = `<div class="terminal-lab-card">
    <div class="terminal-view" data-lab-view>
      <canvas aria-label="Three-dimensional qualitative model of a parachutist falling through the air"></canvas>
      <div class="terminal-force-key" data-force-key hidden>
        <span class="force-chip weight">↓ Weight</span><span class="force-chip drag">↑ Drag</span><span class="force-chip result">Resultant</span>
      </div>
      <div class="terminal-stage-readout"><small data-stage-count></small><strong data-stage-name></strong><span data-motion></span></div>
    </div>
    <div class="terminal-simple" data-simple hidden role="img" aria-label="Simple force diagram"></div>
    <div class="terminal-stage-tabs" role="group" aria-label="Choose a stage of the fall"></div>
    <div class="terminal-variables" data-area-controls hidden role="group" aria-label="Compare parachute area">
      <span>Parachute area</span><button type="button" data-area="small">Smaller</button><button type="button" data-area="large">Larger</button>
    </div>
    <div class="terminal-controls" role="group" aria-label="Fall laboratory controls">
      <button type="button" data-action="previous" aria-label="Previous fall stage">← Earlier</button>
      <button type="button" data-action="play">Play</button>
      <button type="button" data-action="next" aria-label="Next fall stage">Later →</button>
      <button type="button" data-action="forces" aria-pressed="false">Show forces</button>
      <button type="button" data-action="explain" aria-expanded="false">Open explanation</button>
      <button type="button" data-action="simple" aria-pressed="false">Simple view</button>
    </div>
    <div class="terminal-explanation" data-explanation hidden><strong data-compare></strong><p data-reason></p></div>
    <p class="terminal-caption">${esc(config.caption || 'Qualitative model: arrow lengths compare forces; they are not measured values.')}</p>
    <p class="sr-only" aria-live="polite" data-live></p>
  </div>`;

  const canvas = host.querySelector('canvas');
  const view = host.querySelector('[data-lab-view]');
  const simple = host.querySelector('[data-simple]');
  const forceKey = host.querySelector('[data-force-key]');
  const explanation = host.querySelector('[data-explanation]');
  const playButton = host.querySelector('[data-action="play"]');
  const forceButton = host.querySelector('[data-action="forces"]');
  const explainButton = host.querySelector('[data-action="explain"]');
  const simpleButton = host.querySelector('[data-action="simple"]');
  const tabs = host.querySelector('.terminal-stage-tabs');
  const areaControls = host.querySelector('[data-area-controls]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let current = Math.min(5, Math.max(0, Number(config.initial_stage || 1) - 1));
  let playing = false;
  let showForces = Boolean(config.show_forces_initially);
  let simpleMode = false;
  let areaFactor = 1;
  let timer = 0;
  let animationFrame = 0;
  let renderer;
  let resizeObserver;

  tabs.innerHTML = STAGES.map((stage, index) => `<button type="button" data-stage="${index}" aria-label="${config.inquiry_mode ? `Evidence frame ${index + 1}` : `Stage ${index + 1}: ${esc(stage.short)}`}">${index + 1}</button>`).join('');
  if (config.allow_stage_choice === false) tabs.hidden = true;
  if (config.allow_area_choice) {
    areaControls.hidden = false;
    areaControls.querySelectorAll('button').forEach(button => {
      const selected = button.dataset.area === 'small';
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    areaFactor = 0.82;
  }
  if (config.allow_stage_choice === false) {
    for (const action of ['previous', 'play', 'next']) host.querySelector(`[data-action="${action}"]`).hidden = true;
  }

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xdceff5);
  scene.fog = new THREE.Fog(0xdceff5, 8, 18);
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0.3, 14.5);
  camera.lookAt(0, 0.2, 0);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x6e8794, 2.35));
  const sun = new THREE.DirectionalLight(0xfff3d2, 2.2);
  sun.position.set(4, 7, 5);
  scene.add(sun);

  const faller = new THREE.Group();
  const suit = new THREE.MeshStandardMaterial({ color: 0x17324d, roughness: 0.72 });
  const accent = new THREE.MeshStandardMaterial({ color: 0xf5b942, roughness: 0.65 });
  const skin = new THREE.MeshStandardMaterial({ color: 0xc98562, roughness: 0.8 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x101923, roughness: 0.8 });
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.42, 1.05, 5, 12), suit);
  torso.rotation.z = 0.08;
  faller.add(torso);
  const chest = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.42, 0.3), accent);
  chest.position.set(0, 0.25, 0.34);
  faller.add(chest);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.31, 20, 16), skin);
  head.position.y = 1.05;
  faller.add(head);
  const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.34, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), dark);
  helmet.position.y = 1.05;
  faller.add(helmet);
  const limb = (x, y, rotation, length) => {
    const mesh = new THREE.Mesh(new THREE.CapsuleGeometry(0.12, length, 4, 8), suit);
    mesh.position.set(x, y, 0);
    mesh.rotation.z = rotation;
    faller.add(mesh);
  };
  limb(-0.58, 0.22, -0.95, 0.7); limb(0.58, 0.22, 0.95, 0.7);
  limb(-0.3, -1.0, -0.34, 0.82); limb(0.3, -1.0, 0.34, 0.82);
  scene.add(faller);

  const parachute = new THREE.Group();
  const canopyMaterial = new THREE.MeshStandardMaterial({ color: 0xf05d4f, roughness: 0.62, side: THREE.DoubleSide });
  const canopy = new THREE.Mesh(new THREE.SphereGeometry(2.05, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2), canopyMaterial);
  canopy.scale.y = 0.72;
  canopy.position.y = 3.15;
  parachute.add(canopy);
  const cordMaterial = new THREE.LineBasicMaterial({ color: 0x33495d });
  const cordPoints = [-1.65, -0.82, 0.82, 1.65].flatMap(x => [new THREE.Vector3(x, 3.08, 0), new THREE.Vector3(x * 0.18, 0.75, 0)]);
  const cords = new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(cordPoints), cordMaterial);
  parachute.add(cords);
  scene.add(parachute);

  const cloudMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.8, roughness: 1 });
  const clouds = new THREE.Group();
  for (let index = 0; index < 8; index += 1) {
    const puff = new THREE.Mesh(new THREE.SphereGeometry(0.45 + (index % 3) * 0.16, 12, 9), cloudMaterial);
    puff.position.set((index % 2 ? 1 : -1) * (2.3 + (index % 3) * 0.45), -4.5 + index * 1.4, -1.5 - (index % 3));
    puff.scale.x = 1.7;
    clouds.add(puff);
  }
  scene.add(clouds);

  const arrows = new THREE.Group();
  const weightArrow = new THREE.ArrowHelper(new THREE.Vector3(0, -1, 0), new THREE.Vector3(-1.35, 0.35, 0.2), 2.2, 0xe04f45, 0.34, 0.22);
  const dragArrow = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(1.35, -0.7, 0.2), 2.2, 0x158b9f, 0.34, 0.22);
  const resultArrow = new THREE.ArrowHelper(new THREE.Vector3(0, -1, 0), new THREE.Vector3(0, 0.2, 0.5), 1.2, 0xd99518, 0.3, 0.2);
  arrows.add(weightArrow, dragArrow, resultArrow);
  scene.add(arrows);

  function setArrow(arrow, length, direction) {
    arrow.setDirection(new THREE.Vector3(0, direction, 0));
    arrow.setLength(Math.max(0.12, length), Math.min(0.34, length * 0.24), Math.min(0.22, length * 0.16));
  }

  function renderStage(announce = true) {
    const original = STAGES[current];
    const drag = original.canopy && config.allow_area_choice ? original.drag * areaFactor : original.drag;
    const difference = original.weight - drag;
    const stage = {
      ...original,
      drag,
      compare: difference > 0.05 ? 'Weight is greater than drag' : difference < -0.05 ? 'Drag is greater than weight' : 'Weight equals drag',
      motion: difference > 0.05 ? 'Accelerating downwards' : difference < -0.05 ? 'Still falling, but slowing' : 'Constant velocity downwards'
    };
    parachute.visible = stage.canopy > 0;
    parachute.scale.set(config.allow_area_choice ? (areaFactor === 0.82 ? 0.84 : 1.12) : 1, 1, config.allow_area_choice ? (areaFactor === 0.82 ? 0.84 : 1.12) : 1);
    faller.position.y = stage.canopy ? -0.45 : 0.1;
    faller.rotation.z = stage.canopy ? 0 : 0.08;
    setArrow(weightArrow, 2.05 * stage.weight, -1);
    setArrow(dragArrow, 2.05 * stage.drag, 1);
    resultArrow.visible = showForces && Math.abs(difference) > 0.05;
    setArrow(resultArrow, 1.85 * Math.abs(difference), difference > 0 ? -1 : 1);
    arrows.visible = showForces;
    forceKey.hidden = !showForces;
    host.querySelector('[data-stage-count]').textContent = config.inquiry_mode ? `Evidence frame ${current + 1} of 6` : `Stage ${current + 1} of 6`;
    host.querySelector('[data-stage-name]').textContent = config.inquiry_mode ? 'Observe before deciding' : stage.name;
    host.querySelector('[data-motion]').textContent = config.inquiry_mode ? 'Compare movement and force arrows' : stage.motion;
    host.querySelector('[data-compare]').textContent = stage.compare;
    host.querySelector('[data-reason]').textContent = stage.reason;
    simple.innerHTML = staticDiagram(stage, Boolean(config.inquiry_mode));
    simple.setAttribute('aria-label', config.inquiry_mode
      ? `Evidence frame ${current + 1}. Weight arrow relative length ${Math.round(stage.weight * 100)}. Drag arrow relative length ${Math.round(stage.drag * 100)}. Downward speed marker ${Math.max(1, Math.round(stage.speed * 5))} of 5.`
      : `${stage.name}. ${stage.compare}. ${stage.motion}.`);
    tabs.querySelectorAll('button').forEach((button, index) => {
      button.classList.toggle('active', index === current);
      button.setAttribute('aria-pressed', String(index === current));
    });
    if (announce) host.querySelector('[data-live]').textContent = config.inquiry_mode
      ? `Evidence frame ${current + 1}. Compare the visible motion and force arrows.`
      : `Stage ${current + 1}: ${stage.name}. ${stage.motion}.`;
  }

  function stop() {
    playing = false;
    window.clearInterval(timer);
    playButton.textContent = 'Play';
    playButton.setAttribute('aria-pressed', 'false');
  }

  function setStage(value) {
    current = (value + STAGES.length) % STAGES.length;
    renderStage();
  }

  function start() {
    if (reducedMotion) return;
    playing = true;
    playButton.textContent = 'Pause';
    playButton.setAttribute('aria-pressed', 'true');
    timer = window.setInterval(() => {
      if (current === STAGES.length - 1) { stop(); return; }
      setStage(current + 1);
    }, 1900);
  }

  host.addEventListener('click', event => {
    const areaButton = event.target.closest('[data-area]');
    if (areaButton) {
      areaFactor = areaButton.dataset.area === 'large' ? 1.18 : 0.82;
      areaControls.querySelectorAll('button').forEach(button => button.classList.toggle('active', button === areaButton));
      areaControls.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button === areaButton)));
      renderStage();
      return;
    }
    const stageButton = event.target.closest('[data-stage]');
    if (stageButton) { stop(); setStage(Number(stageButton.dataset.stage)); return; }
    const button = event.target.closest('[data-action]');
    if (!button) return;
    if (button.dataset.action === 'previous') { stop(); setStage(current - 1); }
    if (button.dataset.action === 'next') { stop(); setStage(current + 1); }
    if (button.dataset.action === 'play') playing ? stop() : start();
    if (button.dataset.action === 'forces') {
      showForces = !showForces;
      forceButton.setAttribute('aria-pressed', String(showForces));
      forceButton.textContent = showForces ? 'Hide forces' : 'Show forces';
      renderStage(false);
    }
    if (button.dataset.action === 'explain') {
      const open = explanation.hidden;
      explanation.hidden = !open;
      explainButton.setAttribute('aria-expanded', String(open));
      explainButton.textContent = open ? 'Close explanation' : 'Open explanation';
    }
    if (button.dataset.action === 'simple') {
      simpleMode = !simpleMode;
      view.hidden = simpleMode;
      simple.hidden = !simpleMode;
      simpleButton.setAttribute('aria-pressed', String(simpleMode));
      simpleButton.textContent = simpleMode ? '3D view' : 'Simple view';
    }
  });

  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'default' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
    renderer.outputEncoding = THREE.sRGBEncoding;
    const resize = () => {
      const width = Math.max(280, view.clientWidth);
      const height = Math.max(280, view.clientHeight);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(view);
    resize();
    let last = performance.now();
    const animate = now => {
      const delta = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!reducedMotion && !simpleMode) {
        const speed = STAGES[current].speed;
        clouds.children.forEach((cloud, index) => {
          cloud.position.y += delta * speed * 2.3;
          if (cloud.position.y > 5.5) cloud.position.y = -5.5 - index * 0.12;
        });
        faller.rotation.y = Math.sin(now * 0.00055) * 0.12;
      }
      renderer.render(scene, camera);
      animationFrame = requestAnimationFrame(animate);
    };
    animationFrame = requestAnimationFrame(animate);
  } catch (error) {
    simpleMode = true;
    view.hidden = true;
    simple.hidden = false;
    simpleButton.hidden = true;
    host.querySelector('[data-live]').textContent = 'The 3D view is unavailable. The equivalent simple force diagram is shown.';
  }

  forceButton.setAttribute('aria-pressed', String(showForces));
  forceButton.textContent = showForces ? 'Hide forces' : 'Show forces';
  if (reducedMotion) {
    playButton.disabled = true;
    playButton.textContent = 'Motion reduced';
  }
  renderStage(false);

  return () => {
    stop();
    cancelAnimationFrame(animationFrame);
    resizeObserver?.disconnect();
    renderer?.dispose();
  };
}

function mountCurrent() {
  activeCleanup?.();
  activeCleanup = null;
  const host = document.querySelector('[data-terminal-lab]');
  if (host) activeCleanup = mount(host);
}

window.addEventListener('edu:screen-rendered', () => requestAnimationFrame(mountCurrent));
mountCurrent();
