/* Pupil-safe, local Three.js r160 viewer. Rendering occurs only after an interaction. */
(() => {
  'use strict';
  const resourceURL = new URL('.', document.currentScript.src);
  const SVG = 'http://www.w3.org/2000/svg';
  const names = {rbc:'Mature human red blood cell', nerve:'Nerve cell', phagocyte:'Phagocyte', muscle:'Muscle cell', intestine:'Small-intestine lining cell'};
  const paper = '#f3ecdf', ink = '#26332f', leader = '#66736a';
  const initialAngle = {x:.05, y:.16};
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  function disposeObject(object) {
    const geometries = new Set(), materials = new Set(), textures = new Set();
    object?.traverse(child => {
      if (child.geometry) geometries.add(child.geometry);
      for (const material of (Array.isArray(child.material) ? child.material : [child.material])) {
        if (!material) continue;
        materials.add(material);
        for (const value of Object.values(material)) if (value?.isTexture) textures.add(value);
      }
    });
    geometries.forEach(value => value.dispose());
    materials.forEach(value => value.dispose());
    textures.forEach(value => value.dispose());
  }
  function wrap(text, max = 18) {
    const words = String(text).split(/\s+/), lines = [''];
    for (const word of words) {
      const last = lines.length - 1;
      if (lines[last] && `${lines[last]} ${word}`.length > max) lines.push(word);
      else lines[last] += `${lines[last] ? ' ' : ''}${word}`;
    }
    return lines;
  }
  function mount(host, kind) {
    let disposed = false, renderer = null, observer = null, frame = 0;
    let model = null, state = 0, stage = null, overlay = null;
    let width = 1, height = 1, yaw = initialAngle.y, pitch = initialAngle.x;
    let dragging = false, pointer = null;
    const events = new AbortController();
    const fallback = host.querySelector('.cell-fallback');
    const fallbackImage = new Image();
    fallbackImage.className = 'cell-still';
    fallbackImage.alt = `${names[kind]}. Explanatory 3D model, not a microscope image; not to scale.`;
    fallbackImage.addEventListener('load', () => {
      if (!disposed && fallback) fallback.replaceChildren(fallbackImage);
    }, {signal:events.signal});
    fallbackImage.src = new URL(`cell-stills/${kind}.png`, resourceURL).href;
    const reset = () => {
      yaw = initialAngle.y; pitch = initialAngle.x;
      if (model) model.object.rotation.set(pitch, yaw, 0);
      schedule();
    };
    const fail = () => {
      if (disposed) return;
      host.classList.remove('is-ready');
      host.classList.add('is-static');
      if (stage) stage.hidden = true;
      host.querySelector('.cell-viewer-controls')?.remove();
      host.querySelector('.cell-viewer-help')?.remove();
      const message = document.createElement('p');
      message.className = 'cell-static-note';
      message.textContent = 'Still model shown. The reading and tasks remain available.';
      if (!host.querySelector('.cell-static-note')) host.append(message);
    };
    const THREE = window.THREE;
    const builder = window.COVER_CELL_BUILDERS?.[kind];
    let scene, camera;
    try {
      if (!THREE || !builder) throw new Error('Model unavailable');
      scene = new THREE.Scene();
      scene.background = new THREE.Color(paper);
      camera = new THREE.PerspectiveCamera(38, 1, .05, 100);
      renderer = new THREE.WebGLRenderer({antialias:true, alpha:false, preserveDrawingBuffer:true, powerPreference:'low-power'});
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.12;
      const dome = new THREE.HemisphereLight(0xfff5df, 0x6c7775, 2.1);
      const key = new THREE.DirectionalLight(0xffebcd, 3.1);
      key.position.set(-3.5, 5, 6);
      const fill = new THREE.DirectionalLight(0xc8dfed, 1.25);
      fill.position.set(4, 1, 2);
      const rim = new THREE.DirectionalLight(0xfff5e8, 1.65);
      rim.position.set(1, 3, -5);
      scene.add(dome, key, fill, rim);
      stage = document.createElement('div');
      stage.className = 'cell-viewer-stage';
      renderer.domElement.className = 'cell-model-canvas';
      renderer.domElement.tabIndex = 0;
      renderer.domElement.setAttribute('role', 'img');
      renderer.domElement.setAttribute('aria-label', `${names[kind]}. Interactive explanatory 3D model. Drag to turn, or focus this model and use the arrow keys. Not a microscope image; not to scale.`);
      overlay = document.createElementNS(SVG, 'svg');
      overlay.classList.add('cell-model-labels');
      overlay.setAttribute('aria-hidden', 'true');
      stage.append(renderer.domElement, overlay);
      host.append(stage);
      const controls = document.createElement('div');
      controls.className = 'cell-viewer-controls';
      const resetButton = document.createElement('button');
      resetButton.type = 'button'; resetButton.textContent = 'Reset view';
      resetButton.addEventListener('click', reset, {signal:events.signal});
      const saveButton = document.createElement('button');
      saveButton.type = 'button'; saveButton.textContent = 'Save diagram';
      saveButton.addEventListener('click', saveDiagram, {signal:events.signal});
      controls.append(resetButton, saveButton);
      host.append(controls);
      const help = document.createElement('p');
      help.className = 'cell-viewer-help';
      help.textContent = 'Drag to turn · Arrow keys when focused';
      host.append(help);
      loadModel();
      if (model.states?.length) {
        const choices = document.createElement('div');
        choices.className = 'cell-stage-controls';
        choices.setAttribute('role', 'group');
        choices.setAttribute('aria-label', `${names[kind]} stages`);
        model.states.forEach((choice, i) => {
          const b = document.createElement('button');
          b.type = 'button'; b.textContent = typeof choice === 'string' ? choice : choice.label;
          b.setAttribute('aria-pressed', String(i === state));
          b.addEventListener('click', () => {
            if (i === state) return;
            state = i;
            loadModel();
            choices.querySelectorAll('button').forEach((item, j) => item.setAttribute('aria-pressed', String(j === state)));
          }, {signal:events.signal});
          choices.append(b);
        });
        controls.prepend(choices);
      }
      const canvas = renderer.domElement;
      canvas.addEventListener('pointerdown', event => {
        if (event.button !== 0) return;
        dragging = true; pointer = {x:event.clientX, y:event.clientY};
        canvas.setPointerCapture(event.pointerId);
        canvas.classList.add('is-dragging');
      }, {signal:events.signal});
      canvas.addEventListener('pointermove', event => {
        if (!dragging || !pointer) return;
        yaw += (event.clientX - pointer.x) * .008;
        pitch = clamp(pitch + (event.clientY - pointer.y) * .008, -1.05, 1.05);
        pointer = {x:event.clientX, y:event.clientY};
        model.object.rotation.set(pitch, yaw, 0);
        schedule();
      }, {signal:events.signal});
      const stopDrag = () => { dragging = false; pointer = null; canvas.classList.remove('is-dragging'); };
      canvas.addEventListener('pointerup', stopDrag, {signal:events.signal});
      canvas.addEventListener('pointercancel', stopDrag, {signal:events.signal});
      canvas.addEventListener('lostpointercapture', stopDrag, {signal:events.signal});
      canvas.addEventListener('keydown', event => {
        if (!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)) return;
        event.preventDefault(); event.stopPropagation();
        if (event.key === 'ArrowLeft') yaw -= .12;
        if (event.key === 'ArrowRight') yaw += .12;
        if (event.key === 'ArrowUp') pitch = clamp(pitch - .12, -1.05, 1.05);
        if (event.key === 'ArrowDown') pitch = clamp(pitch + .12, -1.05, 1.05);
        model.object.rotation.set(pitch, yaw, 0);
        schedule();
      }, {signal:events.signal});
      canvas.addEventListener('webglcontextlost', event => { event.preventDefault(); cancelAnimationFrame(frame); fail(); }, {signal:events.signal});
      observer = new ResizeObserver(resize);
      observer.observe(stage);
      host.classList.add('is-ready');
      resize();
    } catch {
      fail();
      cancelAnimationFrame(frame); frame = 0;
      observer?.disconnect();
      if (model) disposeObject(model.object);
      renderer?.dispose();
      renderer?.forceContextLoss();
      renderer = null;
    }
    function loadModel() {
      if (model) { scene.remove(model.object); disposeObject(model.object); }
      model = builder(THREE, state);
      model.object.rotation.set(pitch, yaw, 0);
      scene.add(model.object);
      const position = model.camera?.position || [0, .2, (model.viewRadius || 2.5) * 3];
      camera.position.fromArray(position);
      camera.lookAt(new THREE.Vector3(...(model.camera?.target || [0, 0, 0])));
      const accessible = host.querySelector('.cell-label-description') || document.createElement('p');
      accessible.className = 'cell-label-description';
      accessible.textContent = `Labelled features: ${(model.labels || []).map(label => label.text).join('; ')}.`;
      if (!accessible.isConnected) host.append(accessible);
      schedule();
    }
    function resize() {
      if (disposed || !renderer || !stage || stage.hidden) return;
      const size = stage.getBoundingClientRect();
      width = Math.max(1, Math.round(size.width)); height = Math.max(1, Math.round(size.height));
      renderer.setSize(width, height, false);
      camera.aspect = width / height; camera.updateProjectionMatrix();
      overlay.setAttribute('viewBox', `0 0 ${width} ${height}`);
      schedule();
    }
    function schedule() {
      if (disposed || frame || !renderer) return;
      frame = requestAnimationFrame(() => { frame = 0; if (!disposed && model) render(); });
    }
    function labelLayout(w, h, font, forExport = false) {
      model.object.updateMatrixWorld(true);
      const result = (model.labels || []).slice(0, 3).map(label => {
        const anchor = label.position.clone().applyMatrix4(model.object.matrixWorld).project(camera);
        return {text:label.text, lines:wrap(label.text, forExport ? 18 : 17), side:label.side || (anchor.x < 0 ? 'left' : 'right'), x:(anchor.x + 1) * w / 2, y:(1 - anchor.y) * h / 2};
      });
      const edge = forExport ? 44 : 10;
      const top = forExport ? 170 : font * 2;
      const bottom = h - (forExport ? 150 : font * 2);
      const gap = forExport ? font * 2.4 : font * 2.8;
      for (const side of ['left', 'right']) {
        const sideLabels = result.filter(item => item.side === side).sort((a,b) => a.y - b.y);
        sideLabels.forEach((item, i) => { item.labelY = clamp(item.y, top, bottom); if (i) item.labelY = Math.max(item.labelY, sideLabels[i-1].labelY + gap); });
        for (let i = sideLabels.length - 1; i >= 0; i--) {
          sideLabels[i].labelY = Math.min(sideLabels[i].labelY, i < sideLabels.length - 1 ? sideLabels[i+1].labelY - gap : bottom);
        }
        sideLabels.forEach(item => {
          item.textX = side === 'left' ? edge : w - edge;
          item.align = side === 'left' ? 'start' : 'end';
          const estimatedWidth = Math.max(...item.lines.map(line => line.length)) * font * .51;
          item.lineX = side === 'left' ? edge + estimatedWidth + font * .4 : w - edge - estimatedWidth - font * .4;
          item.elbowX = side === 'left' ? Math.max(item.lineX + font, item.x - font) : Math.min(item.lineX - font, item.x + font);
        });
      }
      return result;
    }
    function render() {
      renderer.render(scene, camera);
      const font = clamp(width / 31, 11, 14);
      overlay.replaceChildren();
      for (const label of labelLayout(width, height, font)) {
        const path = document.createElementNS(SVG, 'path');
        path.setAttribute('d', `M${label.lineX},${label.labelY} H${label.elbowX} L${label.x},${label.y}`);
        path.setAttribute('stroke', leader); path.setAttribute('stroke-width', '1'); path.setAttribute('fill', 'none');
        const dot = document.createElementNS(SVG, 'circle');
        dot.setAttribute('cx', label.x); dot.setAttribute('cy', label.y); dot.setAttribute('r', '2.3'); dot.setAttribute('fill', leader);
        const text = document.createElementNS(SVG, 'text');
        text.setAttribute('x', label.textX); text.setAttribute('y', label.labelY - (label.lines.length - 1) * font * .56);
        text.setAttribute('text-anchor', label.align); text.setAttribute('font-size', font); text.setAttribute('fill', ink);
        label.lines.forEach((line, i) => {
          const tspan = document.createElementNS(SVG, 'tspan');
          tspan.setAttribute('x', label.textX); tspan.setAttribute('dy', i ? font * 1.15 : '.32em'); tspan.textContent = line; text.append(tspan);
        });
        overlay.append(path, dot, text);
      }
    }
    function saveDiagram() {
      if (disposed || !renderer || !model || stage.hidden) return;
      const exportWidth = 1600, exportHeight = 1200;
      const canvas = document.createElement('canvas');
      canvas.width = exportWidth; canvas.height = exportHeight;
      const context = canvas.getContext('2d');
      const ratio = renderer.getPixelRatio();
      try {
        renderer.setPixelRatio(1); renderer.setSize(exportWidth, exportHeight, false);
        camera.aspect = exportWidth / exportHeight; camera.updateProjectionMatrix();
        renderer.render(scene, camera);
        context.fillStyle = paper; context.fillRect(0, 0, exportWidth, exportHeight);
        context.drawImage(renderer.domElement, 0, 0);
        const font = 60;
        context.lineWidth = 3; context.lineJoin = 'round';
        context.font = `600 ${font}px system-ui, sans-serif`;
        for (const label of labelLayout(exportWidth, exportHeight, font, true)) {
          context.strokeStyle = leader; context.beginPath(); context.moveTo(label.lineX, label.labelY); context.lineTo(label.elbowX, label.labelY); context.lineTo(label.x, label.y); context.stroke();
          context.fillStyle = leader; context.beginPath(); context.arc(label.x, label.y, 6, 0, Math.PI * 2); context.fill();
          context.textAlign = label.side === 'left' ? 'left' : 'right';
          const y = label.labelY - (label.lines.length - 1) * font * .56 + font * .32;
          label.lines.forEach((line, i) => {
            context.strokeStyle = paper; context.lineWidth = 12; context.strokeText(line, label.textX, y + i * font * 1.15);
            context.fillStyle = ink; context.fillText(line, label.textX, y + i * font * 1.15);
          });
          context.lineWidth = 3;
        }
        context.textAlign = 'left'; context.fillStyle = ink; context.font = '600 48px system-ui, sans-serif';
        const stateName = model.states?.[state];
        context.fillText(`${names[kind]}${stateName ? ` · ${typeof stateName === 'string' ? stateName : stateName.label}` : ''}`, 44, 76);
        context.font = '30px system-ui, sans-serif';
        context.fillText('Explanatory 3D model · not a microscope image · not to scale', 44, exportHeight - 42);
        canvas.toBlob(blob => {
          if (!blob || disposed) return;
          const url = URL.createObjectURL(blob), a = document.createElement('a');
          a.href = url; a.download = `${kind}-model.png`; a.click();
          setTimeout(() => URL.revokeObjectURL(url), 1500);
        }, 'image/png');
      } finally {
        renderer.setPixelRatio(ratio); renderer.setSize(width, height, false);
        camera.aspect = width / height; camera.updateProjectionMatrix(); render();
      }
    }
    return {dispose() {
      if (disposed) return;
      disposed = true; events.abort(); observer?.disconnect(); cancelAnimationFrame(frame);
      if (model) disposeObject(model.object);
      if (renderer) { renderer.dispose(); renderer.forceContextLoss(); }
      scene?.clear();
    }};
  }
  window.COVER_CELL_VIEWER = {mount};
})();
