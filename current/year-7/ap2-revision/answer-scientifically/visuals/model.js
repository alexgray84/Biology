/* Local Three.js r149 model with a static image fallback. */
(() => {
  "use strict";

  const t = window.THREE;
  const type = document.body.dataset.model;
  const sceneHost = document.querySelector("[data-scene]");
  const prediction = document.querySelector("[data-prediction]");
  const result = document.querySelector("[data-result]");
  const reset = document.querySelector("[data-reset]");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

  function setup() {
    if (!t) return null;
    let renderer;
    try {
      renderer = new t.WebGLRenderer({ antialias: true, alpha: false });
    } catch {
      return null;
    }
    renderer.setPixelRatio(Math.min(2, devicePixelRatio));
    renderer.outputEncoding = t.sRGBEncoding;
    renderer.toneMapping = t.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.94;
    renderer.physicallyCorrectLights = true;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = t.PCFSoftShadowMap;
    renderer.domElement.setAttribute("aria-hidden", "true");
    sceneHost.append(renderer.domElement);
    sceneHost.dataset.webgl = "working";
    renderer.domElement.addEventListener("webglcontextlost", event => {
      event.preventDefault();
      renderer.domElement.hidden = true;
      sceneHost.dataset.webgl = "fallback";
    });

    const scene = new t.Scene();
    scene.background = new t.Color(0xc2c7c6);
    scene.fog = new t.Fog(0xc2c7c6, 19, 35);
    const camera = new t.PerspectiveCamera(33, 1, 0.1, 80);
    const light = new t.DirectionalLight(0xffefda, 2.25);
    light.position.set(-4, 8, 5);
    light.castShadow = true;
    light.shadow.mapSize.set(1024, 1024);
    light.shadow.camera.left = -7;
    light.shadow.camera.right = 7;
    light.shadow.camera.top = 7;
    light.shadow.camera.bottom = -7;
    light.shadow.bias = -0.0004;
    light.shadow.normalBias = 0.015;
    scene.add(light, new t.HemisphereLight(0xf4f8ff, 0xc9c0aa, 1.95));
    const fill = new t.DirectionalLight(0xe7f5ff, 1.15);
    fill.position.set(4, 3, -5);
    scene.add(fill);
    const floor = mesh(scene, new t.PlaneGeometry(100, 100), material(0xb4b3a6, 0.91), 0, 0, 0);
    floor.rotation.x = -Math.PI / 2;
    floor.castShadow = false;

    function draw() {
      if (sceneHost.dataset.webgl !== "working") return;
      renderer.render(scene, camera);
    }

    const resize = () => {
      const width = sceneHost.clientWidth;
      const height = sceneHost.clientHeight;
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      draw();
    };
    new ResizeObserver(resize).observe(sceneHost);
    return { scene, camera, draw, resize };
  }

  function material(color, roughness = 0.48, metalness = 0) {
    return new t.MeshStandardMaterial({ color, roughness, metalness });
  }

  function mesh(parent, geometry, finish, x, y, z) {
    const part = new t.Mesh(geometry, finish);
    part.position.set(x, y, z);
    part.castShadow = true;
    part.receiveShadow = true;
    parent.add(part);
    return part;
  }

  function roundedBox(parent, w, h, d, bevel, finish, x, y, z) {
    const outline = new t.Shape();
    const left = -w / 2 + bevel;
    const right = w / 2 - bevel;
    const bottom = -h / 2 + bevel;
    const top = h / 2 - bevel;
    outline.moveTo(left, bottom);
    outline.lineTo(right, bottom);
    outline.lineTo(right, top);
    outline.lineTo(left, top);
    outline.closePath();
    const g = new t.ExtrudeGeometry(outline, {
      depth: d - 2 * bevel, bevelThickness: bevel, bevelSize: bevel,
      bevelSegments: 3, steps: 1,
    });
    g.translate(0, 0, -d / 2 + bevel);
    return mesh(parent, g, finish, x, y, z);
  }

  function cylinder(parent, top, bottom, length, finish, x, y, z) {
    return mesh(parent, new t.CylinderGeometry(top, bottom, length, 36), finish, x, y, z);
  }

  function rod(parent, start, end, radius, finish) {
    const a = new t.Vector3(...start);
    const b = new t.Vector3(...end);
    const middle = a.clone().lerp(b, 0.5);
    const part = cylinder(parent, radius, radius, a.distanceTo(b), finish, ...middle.toArray());
    part.quaternion.setFromUnitVectors(new t.Vector3(0, 1, 0), b.sub(a).normalize());
    return part;
  }

  function makeMicroscope(view) {
    const { scene, camera } = view;
    camera.position.set(6.2, 4.65, 7.65);
    camera.lookAt(0, 2.05, 0);
    const enamel = material(0xe3ded1, 0.36);
    const dark = material(0x243844, 0.43);
    const rubber = material(0x19252a, 0.83);
    const chrome = material(0xb8bdc1, 0.26, 0.68);
    const metal = material(0x485d64, 0.37, 0.42);
    const glass = new t.MeshStandardMaterial({ color: 0x92c5b3, transparent: true, opacity: 0.72, roughness: 0.2 });
    const lamp = new t.MeshStandardMaterial({ color: 0xf9cf79, emissive: 0xfdb45c, emissiveIntensity: 0.32, roughness: .48 });
    const model = new t.Group();
    scene.add(model);
    roundedBox(model, 2.9, 0.31, 1.92, 0.10, dark, 0, 0.21, 0);
    roundedBox(model, 2.79, 0.29, 1.82, 0.10, enamel, 0, 0.48, 0);
    const arm = new t.Shape();
    arm.moveTo(-1.17, .54);
    arm.bezierCurveTo(-1.63, 1.76, -1.38, 3.06, -.65, 3.44);
    arm.quadraticCurveTo(-.38, 3.58, .21, 3.56);
    arm.lineTo(.36, 3.02);
    arm.quadraticCurveTo(-.38, 3.06, -.61, 2.68);
    arm.quadraticCurveTo(-.98, 1.97, -.63, .54);
    arm.closePath();
    const armGeo = new t.ExtrudeGeometry(arm, {
      depth: .49, bevelEnabled: true, bevelThickness: .075, bevelSize: .07, bevelSegments: 6, curveSegments: 24,
    });
    armGeo.translate(0, 0, -.245);
    mesh(model, armGeo, enamel, 0, 0, 0);
    cylinder(model, 0.38, 0.47, 0.16, dark, .17, .69, 0);
    cylinder(model, .26, .26, .045, lamp, .17, .79, 0);
    cylinder(model, .23, .33, .22, metal, .17, 1.36, 0);
    roundedBox(model, 1.96, .14, 1.47, .04, rubber, .16, 1.62, 0);
    cylinder(model, .16, .16, .017, lamp, .17, 1.696, 0);
    roundedBox(model, 1.27, .039, .52, .016, glass, .22, 1.73, 0);
    roundedBox(model, .36, .016, .35, .006, material(0xc7aa68, .46), .19, 1.757, 0);
    for (const side of [-1, 1]) {
      const clip = roundedBox(model, .4, .045, .09, .02, chrome, .06, 1.79, side * .39);
      clip.rotation.y = side * .24;
      rod(model, [-.87, 1.94, side * .23], [-.87, 1.94, side * .48], .26, rubber);
      rod(model, [-.87, 1.94, side * .48], [-.87, 1.94, side * .55], .14, metal);
    }
    roundedBox(model, .95, .37, .74, .10, enamel, .09, 3.27, 0);
    rod(model, [.14, 3.36, 0], [.77, 4.03, 0], .22, enamel);
    rod(model, [.69, 3.94, 0], [.91, 4.17, 0], .206, dark);
    rod(model, [.91, 4.17, 0], [.97, 4.24, 0], .16, metal);
    const turret = new t.Group();
    // The selected lens rotates into the optical path over the slide.
    turret.position.set(.16, 2.93, -.28);
    model.add(turret);
    cylinder(turret, .40, .46, .15, dark, 0, 0, 0);
    const objectives = [
      { value: 4, angle: 0, ring: 0xac463c, length: .39 },
      { value: 10, angle: 2 * Math.PI / 3, ring: 0xd5a32d, length: .46 },
      { value: 40, angle: 4 * Math.PI / 3, ring: 0x3f718b, length: .57 },
    ];
    for (const objective of objectives) {
      const x = Math.sin(objective.angle) * .28;
      const z = Math.cos(objective.angle) * .28;
      const l = objective.length;
      const body = new t.Group();
      body.position.set(x, -.08, z);
      turret.add(body);
      cylinder(body, .128, .095, l, chrome, 0, -l / 2, 0);
      cylinder(body, .119, .112, .065, material(objective.ring), 0, -.13, 0);
      cylinder(body, .094, .085, .066, dark, 0, -l, 0);
    }
    return value => {
      const setting = objectives.find(objective => objective.value === value);
      turret.rotation.y = setting ? -setting.angle : 0;
      view.draw();
    };
  }

  function grainTexture(style) {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 256;
    const ctx = canvas.getContext("2d");
    const wood = style === "wood";
    ctx.fillStyle = wood ? "#ae7648" : "#484a43";
    ctx.fillRect(0, 0, 256, 256);
    let seed = 31;
    const sample = () => {
      seed = (Math.imul(1664525, seed) + 1013904223) >>> 0;
      return seed / 4294967296;
    };
    for (let i = 0; i < (wood ? 280 : 6700); i += 1) {
      const x = sample() * 256;
      const y = sample() * 256;
      ctx.fillStyle = sample() > .48 ? "rgba(248,222,181,.11)" : "rgba(30,30,25,.19)";
      ctx.fillRect(x, y, wood ? 28 + sample() * 128 : 1 + sample() * 2, wood ? 1.2 : 1 + sample());
    }
    const tex = new t.CanvasTexture(canvas);
    tex.encoding = t.sRGBEncoding;
    return tex;
  }

  function makeFriction(view) {
    const { scene, camera } = view;
    camera.fov = 25;
    camera.position.set(6.6, 5.5, 9.3);
    camera.lookAt(.15, .79, 0);
    const gunmetal = material(0x38494b, .43, .32);
    const cable = material(0x313f42, .68);
    const chrome = material(0xc3cbd1, .22, .55);
    const wood = new t.MeshStandardMaterial({ map: grainTexture("wood"), roughness: .68 });
    const rubber = new t.MeshStandardMaterial({ map: grainTexture("rubber"), roughness: .94 });
    const board = material(0xa5c6c2, .39);
    roundedBox(scene, 7.9, .28, 2.1, .07, gunmetal, 0, .15, 0);
    const surface = roundedBox(scene, 7.88, .08, 2.08, .032, board, 0, .33, 0);
    const cart = new t.Group();
    scene.add(cart);
    roundedBox(cart, 1.22, .71, .94, .055, wood, -.92, .735, 0);
    const hook = mesh(cart, new t.TorusGeometry(.093, .023, 12, 28), chrome, -.265, .69, 0);
    hook.rotation.y = Math.PI / 2;
    rod(cart, [-.22, .69, 0], [.43, .69, 0], .018, cable);
    const housing = new t.MeshStandardMaterial({ color: 0xbfd7dd, transparent: true, opacity: .27, roughness: .17 });
    const shell = cylinder(cart, .17, .17, 1.44, housing, 1.15, .69, 0);
    shell.rotation.z = -Math.PI / 2;
    shell.castShadow = false;
    const scale = roundedBox(cart, 1.31, .058, .18, .022, material(0xfdf6df, .55), 1.15, .74, .09);
    scale.castShadow = false;
    for (let index = 0; index < 11; index += 1) {
      const height = index % 5 === 0 ? .07 : .045;
      roundedBox(cart, .012, height, .007, .002, gunmetal, .55 + index * .12, .757, .186);
    }
    const cursor = roundedBox(cart, .035, .115, .018, .007, material(0xa74c43), .55, .757, .194);
    const winding = [];
    for (let i = 0; i <= 240; i += 1) {
      const ratio = i / 240;
      const angle = ratio * 20 * Math.PI;
      winding.push(new t.Vector3(.55 + ratio * 1.2, .69 + .081 * Math.sin(angle), .081 * Math.cos(angle)));
    }
    mesh(cart, new t.TubeGeometry(new t.CatmullRomCurve3(winding), 180, .014, 6, false), chrome, 0, 0, 0);
    for (const x of [.41, 1.89]) {
      const cap = cylinder(cart, .174, .174, .08, gunmetal, x, .69, 0);
      cap.rotation.z = Math.PI / 2;
    }
    rod(cart, [1.9, .69, 0], [2.28, .69, 0], .024, cable);
    return (surfaceType, fraction, reading = 0) => {
      surface.material = surfaceType === "rubber" ? rubber : board;
      cart.position.x = -1.35 + fraction * 2.65;
      cursor.position.x = .55 + reading / 5 * 1.2;
      view.draw();
    };
  }

  function mountMicroscope(view) {
    const changeObjective = view ? makeMicroscope(view) : () => {};
    const buttons = [...document.querySelectorAll("[data-objective]")];
    const field = document.querySelector("[data-field]");
    const photo = document.querySelector("[data-field-photo]");
    const state = value => {
      field.hidden = value === 0;
      changeObjective(value);
      for (const button of buttons) {
        button.setAttribute("aria-pressed", String(Number(button.dataset.objective) === value));
        button.disabled = !prediction.checked;
      }
      if (value === 0) {
        result.textContent = "Choose an objective after you record your prediction.";
        return;
      }
      const fields = {
        4: ["onion.jpg", "An illustrative wide view of the onion slide."],
        10: ["onion-field-mid.jpg", "An illustrative intermediate view of the same onion slide."],
        40: ["onion-field-tight.jpg", "An illustrative narrow view of the same onion slide."],
      };
      [photo.src, photo.alt] = fields[value];
      result.textContent = value + "× objective selected. Compare how much of the slide you can see.";
    };
    prediction.addEventListener("change", () => state(0));
    for (const button of buttons) button.addEventListener("click", () => state(Number(button.dataset.objective)));
    reset.addEventListener("click", () => { prediction.checked = false; state(0); });
    state(0);
  }

  function mountFriction(view) {
    const moveBlock = view ? makeFriction(view) : () => {};
    const run = document.querySelector("[data-run]");
    const choices = [...document.querySelectorAll("[name=surface]")];
    const still = document.querySelector("[data-still]");
    let animation = 0;
    const selected = () => choices.find(choice => choice.checked).value;
    const resetTrial = () => {
      cancelAnimationFrame(animation);
      animation = 0;
      run.disabled = !prediction.checked;
      choices.forEach(choice => { choice.disabled = false; });
      if (still) still.src = selected() === "rubber" ? "friction-rubber-still.png" : "friction-still.png";
      moveBlock(selected(), 0);
      result.textContent = prediction.checked ? "Ready to test the selected surface." : "Record your prediction before testing.";
    };
    const showReading = (surface, force) => {
      const label = surface === "rubber" ? "Rubber mat" : "Smooth plastic";
      result.textContent = label + " · pulling force " + force.toFixed(1) + " N";
      run.disabled = false;
      choices.forEach(choice => { choice.disabled = false; });
    };
    run.addEventListener("click", () => {
      const surface = selected();
      const force = surface === "rubber" ? 3.6 : 1.2;
      const begin = performance.now();
      run.disabled = true;
      choices.forEach(choice => { choice.disabled = true; });
      result.textContent = "Pulling the block at constant speed…";
      const frame = now => {
        const fraction = reducedMotion.matches || sceneHost.dataset.webgl !== "working"
          ? 1 : Math.min(1, (now - begin) / 1900);
        moveBlock(surface, fraction, force);
        if (fraction < 1) animation = requestAnimationFrame(frame);
        else showReading(surface, force);
      };
      animation = requestAnimationFrame(frame);
    });
    choices.forEach(choice => { choice.addEventListener("change", resetTrial); });
    prediction.addEventListener("change", resetTrial);
    reset.addEventListener("click", () => { prediction.checked = false; resetTrial(); });
    resetTrial();
  }

  let view;
  try {
    view = setup();
    if (type === "microscope") mountMicroscope(view);
    else mountFriction(view);
    view?.resize();
  } catch {
    sceneHost.dataset.webgl = "fallback";
    sceneHost.querySelector("canvas")?.remove();
    if (type === "microscope") mountMicroscope(null);
    else mountFriction(null);
  }
})();
