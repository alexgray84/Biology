/* Edu OS lesson runtime. Renders `lesson` (inlined by Planner/scripts/render-lesson.mjs) as one-screen phases
   with Student and Present modes, a support drawer, keyboard navigation and teacher-controlled reveals.
   Pupils answer in books; the only interaction is navigation and reveal. */
(() => {
  const stage = document.querySelector('.stage');
  const drawer = document.querySelector('.drawer');
  const main = document.querySelector('.main');
  const modeButton = document.querySelector('.mode');
  const supportButton = document.querySelector('.support-toggle');
  let index = 0;
  let activeTab = 'start';
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[c]));
  const letters = 'ABCDEF';

  const list = items => items?.length ? `<ul class="list">${items.map((item, i) => `<li><span class="n">${String(i + 1).padStart(2, '0')}</span><span>${item}</span></li>`).join('')}</ul>` : '';
  const tasks = items => items?.length ? `<div class="tasks">${items.map(item => `<div>${item}</div>`).join('')}</div>` : '';
  const criteria = items => items?.length ? `<aside class="criteria"><h2>Success criteria</h2>${items.map(item => `<p>✓ ${item}</p>`).join('')}</aside>` : '';
  const table = rows => rows?.length ? `<table class="evidence"><thead><tr>${rows[0].map(cell => `<th>${cell}</th>`).join('')}</tr></thead><tbody>${rows.slice(1).map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody></table>` : '';
  const flow = nodes => nodes?.length ? `<div class="diagram"><div class="flow">${nodes.map((node, i) => `${i ? '<span class="arrow">→</span>' : ''}<div class="node">${node}</div>`).join('')}</div></div>` : '';
  const model = m => {
    if (!m) return '';
    const side = which => `<div class="model-labels ${which}">${m.labels.filter(l => (l.side || 'right') === which).sort((a, b) => a.y - b.y).map((l, i) => `<div class="model-label" data-label="${which}-${i}" data-x="${l.x}" data-y="${l.y}">${l.text}${l.note ? `<small>${l.note}</small>` : ''}</div>`).join('')}</div>`;
    const titles = (m.panels || []).map((t, i) => `<span class="panel-title ${i ? 'right' : 'left'}">${esc(t)}</span>`).join('');
    const has = which => m.labels.some(l => (l.side || 'right') === which);
    const cls = `model${has('left') ? '' : ' no-left'}${has('right') ? '' : ' no-right'}`;
    return `<div class="${cls}" data-model>${has('left') ? side('left') : ''}<div class="model-figure">${titles}${m.figure}</div>${has('right') ? side('right') : ''}<svg class="model-leaders" aria-hidden="true"></svg></div>${m.caption ? `<p class="model-caption">${esc(m.caption)}</p>` : ''}`;
  };
  const figure = phase => phase.model ? model(phase.model) : phase.image ? `<figure class="figure"><img src="${esc(phase.image)}" alt="${esc(phase.imageAlt || '')}"><figcaption>${esc(phase.imageCaption || '')}</figcaption></figure>` : phase.svg ? `<figure class="figure">${phase.svg}${phase.imageCaption ? `<figcaption>${esc(phase.imageCaption)}</figcaption>` : ''}</figure>` : '';
  const steps = items => items?.length ? `<div class="steps">${items.map((step, i) => `<div class="step ${step.weak ? 'weak' : ''}"><span class="n">${i + 1}</span><span>${step.text ?? step}</span></div>`).join('')}</div>` : '';
  const reveal = (id, label, title, body) => `<button class="reveal" data-reveal="${id}" aria-expanded="false" aria-controls="${id}">${esc(label)}</button>`
    + `<div class="revealed" id="${id}" hidden>${title ? `<h2>${esc(title)}</h2>` : ''}${body}</div>`;

  function choices(phase) {
    if (!phase.choices?.length) return '';
    const grid = `<div class="choices">${phase.choices.map((choice, i) => `<div class="choice" data-choice="${i}"><span class="n">${letters[i]}</span><span>${choice}</span></div>`).join('')}</div>`;
    const bar = [];
    if (phase.answer !== undefined) bar.push(reveal(`answer-${index}`, 'Reveal', `Answer: ${letters[phase.answer]}`, `<p>${phase.feedback || ''}</p>`));
    if (phase.recheck) bar.push(reveal(`recheck-${index}`, 'Recheck', 'Recheck on whiteboards', `<p>${phase.recheck}</p>`));
    return `${grid}${bar.length ? `<div class="reveal-bar">${bar.join('')}</div>` : ''}`;
  }

  function reveals(phase) {
    return (phase.reveals || []).map((item, i) => reveal(`reveal-${index}-${i}`, item.label, item.title, item.body)).join('');
  }

  function feedback(phase) {
    if (!phase.review) return '';
    return `<div class="feedback-bar"><span>Review and improve</span>${reveal(`feedback-${index}`, phase.review.label, phase.review.title, phase.review.body)}</div>`;
  }

  function resources(phase) {
    if (!phase.resources?.length) return '';
    return `<div class="resource-bar">${phase.resources.map(item => `<a class="resource-button" href="${esc(item.href)}" target="_blank" rel="noopener"><span>${esc(item.label)}</span><small>${esc(item.kind)}</small></a>`).join('')}</div>`;
  }

  function header(phase) {
    const badge = phase.assessment ? `<span class="assessment-badge">${esc(phase.assessment.label)}</span>` : '';
    return `<div class="label">${esc(phase.label)}${badge}</div><h1 tabindex="-1">${phase.title}</h1>${phase.lead ? `<p class="lead">${phase.lead}</p>` : ''}`;
  }

  function screen(phase) {
    // A table and worked steps may share a screen (the readings and the decisions made on them); nothing is dropped.
    const graphic = figure(phase) || flow(phase.visual) || ((phase.table || phase.steps) ? `${table(phase.table)}${steps(phase.steps)}` : '');
    // Points are never dropped: they share the aside when there is no graphic, otherwise they sit in the text column.
    const text = `<div class="text">${header(phase)}${phase.claim ? `<div class="claim">${phase.claim}</div>` : ''}${phase.callout ? `<p class="callout">${phase.callout}</p>` : ''}${graphic ? list(phase.points) : ''}${choices(phase)}${tasks(phase.tasks)}${resources(phase)}${reveals(phase)}${feedback(phase)}${phase.assessment?.detail ? `<p class="product">${esc(phase.assessment.detail)}</p>` : phase.product ? `<p class="product">${esc(phase.product)}</p>` : ''}</div>`;
    const visual = graphic || list(phase.points);
    const aside = `<div class="aside">${visual}${criteria(phase.criteria)}</div>`;
    const family = {
      'retrieval-sheet': 'stacked', 'full-question': 'single', 'quiet-exit': 'single', 'task-and-criteria': 'two',
      'image-led-decision': 'visual-left', 'visual-first-explanation': 'visual-left', 'model-stage': 'visual-left', 'observation-theatre': 'visual-left theatre',
      'evidence-workbench': 'stacked', 'worked-model': 'two', 'split-explanation': 'two', 'diagnostic-decision': 'stacked', 'context-brief': 'visual-left', 'claim-verification': 'two'
    }[phase.layout] || 'two';
    const single = family === 'single' || (family === 'stacked' && !visual && !phase.criteria);
    // A single-column screen has no aside, so its points render in the text column rather than being dropped.
    return `<article class="screen" data-layout="${esc(phase.layout)}"><div class="layout ${single ? 'single' : family}">${text}${single ? `${graphic ? '' : list(phase.points)}${criteria(phase.criteria)}` : aside}</div></article>`;
  }

  // Protected screens (hinge, teacher-marked evidence) carry support:false so the lesson-level drawer cannot fall through.
  const supportFor = () => { const phase = lesson.phases[index]; return phase.support === false ? null : (phase.support || lesson.support); };
  function support() {
    const routes = supportFor();
    if (!routes) return '<h2>Support</h2><p class="support">No extra support on this screen.</p>';
    const tab = routes[activeTab] || routes.start;
    return `<h2>Support</h2><div class="tabs">${Object.entries(routes).map(([key, value]) => `<button class="tab ${key === activeTab ? 'active' : ''}" data-tab="${key}">${esc(value.title)}</button>`).join('')}</div><div class="support">${tab.heading ? `<h3>${esc(tab.heading)}</h3>` : ''}${tab.body}</div>`;
  }

  function render() {
    const phase = lesson.phases[index];
    stage.innerHTML = screen(phase);
    document.querySelector('.progress span').style.width = `${((index + 1) / lesson.phases.length) * 100}%`;
    document.querySelector('.navtext').innerHTML = `<small>${index + 1} of ${lesson.phases.length} · ${esc(phase.label)}</small><strong>${esc(phase.title)}</strong>`;
    document.querySelector('.prev').disabled = index === 0;
    document.querySelector('.next').disabled = index === lesson.phases.length - 1;
    if (drawer && !drawer.hidden) drawer.innerHTML = support();
    stage.querySelector('h1')?.focus({ preventScroll: true });
    fit();
    stage.querySelectorAll('[data-reveal]').forEach(button => button.addEventListener('click', () => {
      const target = document.getElementById(button.dataset.reveal);
      const open = target.hidden;
      target.hidden = !open;
      button.setAttribute('aria-expanded', String(open));
      if (button.dataset.reveal.startsWith('answer-') && open) stage.querySelectorAll('.choice')[phase.answer]?.classList.add('correct');
      requestAnimationFrame(fit);
    }));
  }

  // Leader lines: from each label's inner edge to its anchor (x, y as % of the figure's svg box).
  function leaders() {
    const wrap = stage.querySelector('[data-model]');
    if (!wrap) return;
    const overlay = wrap.querySelector('.model-leaders');
    const svg = wrap.querySelector('.model-figure svg:not(.model-leaders)');
    if (!svg) return;
    const box = wrap.getBoundingClientRect();
    // Anchors are % of the drawn viewBox area, which is letterboxed inside the svg element (preserveAspectRatio meet).
    const rect = svg.getBoundingClientRect();
    const [, , vw, vh] = (svg.getAttribute('viewBox') || `0 0 ${rect.width} ${rect.height}`).split(/\s+|,/).map(Number);
    const scale = Math.min(rect.width / vw, rect.height / vh);
    const fig = { left: rect.left + (rect.width - vw * scale) / 2, top: rect.top + (rect.height - vh * scale) / 2, width: vw * scale, height: vh * scale };
    // Place labels level with their anchors, then push apart so none overlap (top-down sweep, then clamp to the column).
    for (const column of wrap.querySelectorAll('.model-labels')) {
      const colRect = column.getBoundingClientRect();
      const labels = [...column.querySelectorAll('.model-label')].map(label => ({ label, h: label.offsetHeight, want: fig.top + fig.height * Number(label.dataset.y) / 100 - colRect.top - label.offsetHeight / 2 })).sort((p, q) => p.want - q.want);
      const gap = 6;
      let cursor = 0;
      for (const item of labels) { item.top = Math.max(item.want, cursor); cursor = item.top + item.h + gap; }
      const overflow = cursor - gap - colRect.height;
      if (overflow > 0) { let floor = colRect.height; for (const item of [...labels].reverse()) { item.top = Math.min(item.top, floor - item.h); floor = item.top - gap; } }
      for (const item of labels) item.label.style.top = `${Math.max(0, item.top)}px`;
    }
    overlay.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);
    overlay.innerHTML = [...wrap.querySelectorAll('.model-label')].map(label => {
      const r = label.getBoundingClientRect();
      const left = label.dataset.label.startsWith('left');
      const x1 = (left ? r.right : r.left) - box.left;
      const y1 = r.top + r.height / 2 - box.top;
      const x2 = fig.left + fig.width * Number(label.dataset.x) / 100 - box.left;
      const y2 = fig.top + fig.height * Number(label.dataset.y) / 100 - box.top;
      return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"></line><circle cx="${x2}" cy="${y2}" r="4"></circle>`;
    }).join('');
  }

  // One screen, no scrolling. If a screen still overflows the stage, step the zoom down and say so in the console
  // so the QA screenshot review can see which screen is too dense. Density is a design fault; this only keeps the class moving.
  function fit() {
    const screen = stage.querySelector('.screen');
    if (!screen) return;
    screen.style.zoom = '';
    let zoom = 1;
    // .screen is exactly the stage height with overflow hidden, so measure content against its box, not the stage's.
    const overflows = () => [screen, ...screen.querySelectorAll('.layout, .text, .aside, .model-labels')].some(el => el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1);
    while (overflows() && zoom > 0.7) {
      zoom = Math.round((zoom - 0.05) * 100) / 100;
      screen.style.zoom = zoom;
    }
    if (zoom < 1) console.warn(`Edu OS runtime: screen ${index + 1} ("${lesson.phases[index].title}") is too dense; zoomed to ${zoom}. Reduce the content in the design.`);
    leaders();
  }
  window.addEventListener('resize', fit);

  document.querySelector('.prev').addEventListener('click', () => { if (index) { index -= 1; render(); } });
  document.querySelector('.next').addEventListener('click', () => { if (index < lesson.phases.length - 1) { index += 1; render(); } });
  modeButton.addEventListener('click', () => {
    const present = document.body.classList.toggle('present');
    modeButton.textContent = present ? 'Student view' : 'Present';
    if (present && document.fullscreenEnabled && !document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {});
    if (!present && document.fullscreenElement) document.exitFullscreen().catch(() => {});
  });
  if (supportButton) {
    if (!lesson.support && !lesson.phases.some(phase => phase.support)) supportButton.hidden = true;
    supportButton.addEventListener('click', () => {
      drawer.hidden = !drawer.hidden;
      main.classList.toggle('drawer-open', !drawer.hidden);
      if (!drawer.hidden) drawer.innerHTML = support();
    });
    drawer.addEventListener('click', event => {
      const tab = event.target.closest('[data-tab]');
      if (tab) { activeTab = tab.dataset.tab; drawer.innerHTML = support(); }
    });
  }
  document.addEventListener('keydown', event => {
    if (event.target.matches('button, input, textarea')) return;
    if ((event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === ' ') && index < lesson.phases.length - 1) { event.preventDefault(); index += 1; render(); }
    if ((event.key === 'ArrowLeft' || event.key === 'PageUp') && index) { event.preventDefault(); index -= 1; render(); }
    if (event.key === 'p' || event.key === 'P') modeButton.click();
  });
  render();
})();
