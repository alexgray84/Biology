/**
 * Distance–time modelling aid for Year 9.
 * Three.js renders the physical start/finish set-up. The graph is a flat SVG so
 * perspective cannot distort coordinates or gradient. Only start and finish
 * are measured: connecting lines are explicitly average-speed models.
 */
(() => {
  const sample = { distance: 2, times: [3.6, 2.7, 2.1], own: false };
  const names = ['Low', 'Medium', 'High'];
  const colours = ['#168b9c', '#c17a1c', '#8b56b4'];
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[c]));
  let activeCleanup = null;
  let data = window.eduGraphData || structuredClone(sample);

  function graphSvg(step, selected, allLines = true) {
    const w = 800, h = 530, x0 = 90, y0 = 470, right = 758, top = 52;
    const rawTime = Math.max(4, ...data.times);
    const rawDistance = Math.max(2.5, data.distance + .1);
    const timeStep = rawTime <= 5 ? .5 : rawTime <= 12 ? 1 : 2;
    const distanceStep = rawDistance <= 5 ? .5 : rawDistance <= 12 ? 1 : 2;
    const maxTime = Math.ceil(rawTime / timeStep) * timeStep;
    const maxDistance = Math.ceil(rawDistance / distanceStep) * distanceStep;
    const px = time => x0 + (time / maxTime) * (right - x0);
    const py = distance => y0 - (distance / maxDistance) * (y0 - top);
    const timeTicks = Math.round(maxTime / timeStep);
    const distanceTicks = Math.round(maxDistance / distanceStep);
    const minor = Array.from({ length: timeTicks * 5 + 1 }, (_, i) => `<line x1="${px(i * timeStep / 5)}" y1="${top}" x2="${px(i * timeStep / 5)}" y2="${y0}" stroke="#edf1f2"/>`).join('')
      + Array.from({ length: distanceTicks * 5 + 1 }, (_, i) => `<line x1="${x0}" y1="${py(i * distanceStep / 5)}" x2="${right}" y2="${py(i * distanceStep / 5)}" stroke="#edf1f2"/>`).join('');
    const gridX = Array.from({ length: timeTicks + 1 }, (_, i) => {
      const value = i * timeStep, x = px(value);
      return `<line x1="${x}" y1="${top}" x2="${x}" y2="${y0}" class="graph-grid-line"/><text x="${x}" y="${y0 + 21}" text-anchor="middle">${value.toFixed(1)}</text>`;
    }).join('');
    const gridY = Array.from({ length: distanceTicks + 1 }, (_, i) => {
      const value = i * distanceStep, y = py(value);
      return `<line x1="${x0}" y1="${y}" x2="${right}" y2="${y}" class="graph-grid-line"/><text x="${x0 - 11}" y="${y + 6}" text-anchor="end">${value.toFixed(1)}</text>`;
    }).join('');
    const plotted = data.times.map((time, i) => {
      if (step === 1 || ((step === 2 || (step === 3 && !allLines)) && i !== selected)) return '';
      const x = px(time), y = py(data.distance), c = colours[i];
      const line = step >= 3 ? `<line x1="${x0}" y1="${y0}" x2="${x}" y2="${y}" stroke="${c}" stroke-width="3.5" stroke-linecap="round"/>` : '';
      const guides = step === 2 ? `<path d="M${x} ${y0}V${y}H${x0}" fill="none" stroke="${c}" stroke-width="2" stroke-dasharray="6 5"/>` : '';
      return `${guides}${line}<path d="M${x-6} ${y-6}L${x+6} ${y+6}M${x-6} ${y+6}L${x+6} ${y-6}" stroke="${c}" stroke-width="3"/><text x="${Math.min(right - 40, x + 9)}" y="${y - 8}" fill="${c}" class="graph-point-label">${names[i]}</text>`;
    }).join('');
    const ordinate = esc(data.distance.toFixed(1));
    return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Distance–time graph. Horizontal axis elapsed time in seconds, vertical axis distance from measured start in metres. ${step >= 2 ? `${names[selected]} finish at ${data.times[selected].toFixed(1)} seconds and ${ordinate} metres.` : 'Axes and regular scales visible; choose show finish point to plot.'} Connecting lines, when shown, are average-speed models.">
      <rect width="${w}" height="${h}" fill="#fffdf8" rx="10"/>
      ${minor}${gridX}${gridY}
      <line x1="${x0}" y1="${y0}" x2="${right}" y2="${y0}" class="graph-axis"/>
      <line x1="${x0}" y1="${y0}" x2="${x0}" y2="${top}" class="graph-axis"/>
      <circle cx="${x0}" cy="${y0}" r="5" fill="#14263d"/>
      ${plotted}
      <text x="${(x0 + right) / 2}" y="${h - 5}" text-anchor="middle" class="graph-axis-label">Elapsed time / s</text>
      <text transform="translate(17 ${(top + y0) / 2}) rotate(-90)" text-anchor="middle" class="graph-axis-label">Distance from start / m</text>
    </svg>`;
  }

  function mount(host) {
    let config = {};
    try { config = JSON.parse(decodeURIComponent(host.dataset.config || '%7B%7D')); } catch { /* use safe defaults */ }
    host.innerHTML = `<div class="graph-lab-card">
      <div class="graph-lab-top">
        <div class="graph-track"><canvas aria-label="Three-dimensional schematic of the ramp and measured start-to-finish track"></canvas><span class="graph-track-start">START</span><span class="graph-track-finish">FINISH</span></div>
        <div class="graph-simple-track" hidden role="img" aria-label="Simple view: ramp, then measured start and finish marks on a straight track">Ramp → <strong>START</strong> ━━━━━━━━━ <strong>FINISH</strong></div>
        <p>One measured distance.<br>One mean finish time per run.</p>
      </div>
      <div class="graph-plot">${graphSvg(1, 0)}</div>
      <div class="graph-lab-controls" role="group" aria-label="Graph model controls">
        <div class="graph-condition" role="group" aria-label="Release height">${names.map((name, i) => `<button type="button" data-condition="${i}" aria-pressed="false">${name}</button>`).join('')}</div>
        <div class="graph-steps" role="group" aria-label="Build the graph"><button type="button" data-step="1">1 Axes</button><button type="button" data-step="2">2 Finish point</button><button type="button" data-step="3">3 Model lines</button></div>
        <div class="graph-options"><button type="button" data-simple aria-pressed="false">Simple view</button>${config.allow_measurement_entry ? '<button type="button" data-edit aria-expanded="false">Use my data</button>' : ''}</div>
      </div>
      <form class="graph-data-form" hidden>
        <label>Fixed distance / m <input name="distance" type="number" min="0.1" max="20" step="0.1" required></label>
        ${names.map((name, i) => `<label>${name} mean time / s <input name="time${i}" type="number" min="0.1" max="30" step="0.1" required></label>`).join('')}
        <button type="submit">Apply to model</button><button type="button" data-reset>Teacher-prepared data</button>
        <span class="graph-data-error" role="alert"></span>
      </form>
      <p class="graph-data-summary" aria-label="All mean finish times"></p>
      <p class="graph-readout" aria-live="polite"></p>
      <p class="graph-caption">${esc(config.caption || 'Two measured points per run; lines show average-speed models, not observed motion at every instant.')}</p>
    </div>`;
    const plot = host.querySelector('.graph-plot');
    const readout = host.querySelector('.graph-readout');
    const summary = host.querySelector('.graph-data-summary');
    const form = host.querySelector('form');
    const track = host.querySelector('.graph-track');
    const simpleTrack = host.querySelector('.graph-simple-track');
    const editButton = host.querySelector('[data-edit]');
    const simpleButton = host.querySelector('[data-simple]');
    let selected = Math.max(0, Math.min(2, Number(config.initial_stage || 1) - 1));
    let step = config.inquiry_mode ? 1 : 3;
    let simple = false;
    let renderer, observer;

    const draw = () => {
      plot.innerHTML = graphSvg(step, selected, Boolean(config.allow_stage_choice));
      host.querySelectorAll('[data-condition]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.condition) === selected)));
      host.querySelectorAll('[data-step]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.step) === step)));
      const source = data.own ? 'Your entered values' : 'Teacher-prepared practice data';
      summary.textContent = source;
      readout.textContent = `${names[selected]}: ${data.times[selected].toFixed(1)} s, ${data.distance.toFixed(1)} m${step === 3 ? ` · average speed ${(data.distance / data.times[selected]).toFixed(2)} m/s` : ''}`;
      window.eduGraphData = structuredClone(data);
    };
    host.querySelectorAll('[data-condition]').forEach(button => button.addEventListener('click', () => { selected = Number(button.dataset.condition); draw(); }));
    if (!config.allow_stage_choice) host.querySelector('.graph-condition').hidden = true;
    host.querySelectorAll('[data-step]').forEach(button => button.addEventListener('click', () => { step = Number(button.dataset.step); draw(); }));
    simpleButton.addEventListener('click', () => {
      simple = !simple; track.hidden = simple; simpleTrack.hidden = !simple;
      simpleButton.setAttribute('aria-pressed', String(simple));
    });
    if (editButton) editButton.addEventListener('click', () => {
      form.hidden = !form.hidden;
      editButton.setAttribute('aria-expanded', String(!form.hidden));
      form.elements.distance.value = data.distance;
      data.times.forEach((time, i) => { form.elements[`time${i}`].value = time; });
    });
    form.addEventListener('submit', event => {
      event.preventDefault();
      const distance = Number(form.elements.distance.value);
      const times = names.map((_, i) => Number(form.elements[`time${i}`].value));
      if (!(distance > 0 && distance <= 20 && times.every(time => time > 0 && time <= 30))) {
        host.querySelector('.graph-data-error').textContent = 'Enter a positive measured distance and three positive mean times.';
        return;
      }
      host.querySelector('.graph-data-error').textContent = '';
      data = { distance, times, own: true };
      draw();
    });
    host.querySelector('[data-reset]').addEventListener('click', () => { data = structuredClone(sample); draw(); });

    if (window.THREE) {
      try {
        const THREE = window.THREE;
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xe7f2f4);
        const camera = new THREE.OrthographicCamera(-4.6, 4.6, 1.8, -1.8, .1, 100);
        camera.position.set(5, 5, 8); camera.lookAt(0, 0, 0);
        const addBox = (x, y, z, sx, sy, sz, colour) => {
          const object = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), new THREE.MeshLambertMaterial({ color: colour }));
          object.position.set(x, y, z); scene.add(object); return object;
        };
        addBox(0, -.12, 0, 8.2, .18, 1.2, 0xa9bcc1);
        addBox(-2.3, .03, 0, .08, .28, 1.45, 0xb78324);
        addBox(2.3, .03, 0, .08, .28, 1.45, 0xb78324);
        const ramp = addBox(-3.2, .35, 0, 1.8, .14, 1.2, 0x536d7c);
        ramp.rotation.z = -.35;
        addBox(-.4, .25, 0, .85, .26, .5, 0x1b5972);
        for (const x of [-.7, -.1]) for (const z of [-.32, .32]) {
          const wheel = new THREE.Mesh(new THREE.CylinderGeometry(.13, .13, .08, 16), new THREE.MeshLambertMaterial({ color: 0x263644 }));
          wheel.rotation.x = Math.PI / 2; wheel.position.set(x, .02, z); scene.add(wheel);
        }
        scene.add(new THREE.HemisphereLight(0xffffff, 0x718991, 1.4));
        const light = new THREE.DirectionalLight(0xffffff, .6); light.position.set(-3, 7, 5); scene.add(light);
        renderer = new THREE.WebGLRenderer({ canvas: track.querySelector('canvas'), antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
        const resize = () => {
          const width = Math.max(250, track.clientWidth), height = Math.max(100, track.clientHeight);
          renderer.setSize(width, height, false);
          camera.left = -4.6; camera.right = 4.6; camera.top = 4.6 * height / width; camera.bottom = -camera.top;
          camera.updateProjectionMatrix(); renderer.render(scene, camera);
        };
        observer = new ResizeObserver(resize); observer.observe(track); resize();
      } catch {
        track.hidden = true; simpleTrack.hidden = false; simpleButton.hidden = true;
        simple = true;
      }
    } else { track.hidden = true; simpleTrack.hidden = false; simpleButton.hidden = true; simple = true; }
    draw();
    return () => { observer?.disconnect(); renderer?.dispose(); };
  }

  function mountCurrent() {
    activeCleanup?.(); activeCleanup = null;
    const host = document.querySelector('[data-graph-lab]');
    if (host) activeCleanup = mount(host);
  }
  window.addEventListener('edu:screen-rendered', () => requestAnimationFrame(mountCurrent));
  mountCurrent();
})();
