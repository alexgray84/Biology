/* Arcadia lesson navigation, progressive models and adjacent review. */
(() => {
  'use strict';

  const lesson = window.LESSON_DATA;
  const labels = {
    resources: 'Resources', assessments: 'Assessments', adaptation: 'Adaptation',
    hot: 'HOT', ai: 'AI literacy', uae: 'UAE National Agenda',
  };
  const widgetFamilies = ['Input', 'Assess', 'Thinking'];
  const ids = [
    'app', 'workspace', 'topic', 'screen', 'tools', 'panel', 'panel-title',
    'panel-body', 'panel-navigation', 'panel-prev', 'panel-next', 'panel-count',
    'close-panel', 'previous', 'next', 'screen-select', 'screen-counter',
  ];
  const el = Object.fromEntries(ids.map(id => [id, document.getElementById(id)]));
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[char]));
  const screenIndex = id => lesson.screens.findIndex(screen => screen.id === id);
  const current = () => lesson.screens[index];
  const modelSteps = new Map();
  let index = Math.max(0, screenIndex(location.hash.slice(1)));
  let panel = null;
  let page = 0;
  let hotReview = false;
  let returnFocus = null;

  function reviewButton(id, pressed = false) {
    return '<button type="button" class="reveal-control" id="' + id +
      '" aria-controls="panel" aria-expanded="' + pressed + '">Model answer &amp; mark scheme</button>';
  }

  function modelMarkup(screen) {
    if (!screen.steps.length) return '';
    const revealed = modelSteps.get(screen.id) ?? 0;
    return `
      <section class="worked-model" aria-label="Worked model">
        <div class="model-content" aria-live="polite">${revealed ? `
          <p class="model-label">Worked step ${revealed} of ${screen.steps.length}</p>
          <p>${escape(screen.steps[revealed - 1])}</p>
        ` : ''}</div>
        <div class="model-controls">
          ${revealed > 1 ? '<button type="button" class="control" data-step="-1">Previous worked step</button>' : ''}
          <button type="button" class="control primary" data-step="1"
            ${revealed === screen.steps.length ? 'disabled' : ''}>
            ${revealed ? 'Next worked step' : 'Show worked step'}
          </button>
        </div>
      </section>`;
  }

  function renderScreen(shouldFocus) {
    const screen = current();
    el.app.dataset.family = screen.family;
    el.app.dataset.screen = screen.id;
    el.topic.textContent = 'Year 10 Biology · ' + lesson.title;
    el.topic.hidden = screen.family === 'Title';
    el.screen.innerHTML = `
      <p class="screen-kicker">${escape([screen.kicker || screen.family, screen.time].filter(Boolean).join(' · '))}</p>
      <h1 class="screen-heading" id="screen-title" tabindex="-1">${escape(screen.title)}</h1>
      <div class="screen-content">${screen.html}</div>
      ${modelMarkup(screen)}
      ${screen.task ? reviewButton('main-review') : ''}
    `;
    el.tools.innerHTML = widgetFamilies.includes(screen.family) ?
      Object.entries(labels).map(([key, label]) =>
        `<button class="tool-control" type="button" data-widget="${key}" aria-controls="panel" aria-expanded="false">${label}</button>`
      ).join('') : '';
    el.previous.disabled = index === 0;
    el.next.disabled = index === lesson.screens.length - 1;
    el['screen-select'].value = screen.id;
    el['screen-counter'].textContent = `${index + 1} / ${lesson.screens.length} · ${screen.family}`;

    if (shouldFocus) document.getElementById('screen-title').focus({ preventScroll: true });
    if (screen.family === 'Learning outcome') openPanel('resources', null, false);
  }

  function reviewPages(parts) {
    return parts.flatMap((part, index) => {
      const letter = part.prompt.match(/^\(([a-z])\)/)?.[1] || String.fromCharCode(97 + index);
      const prefix = parts.length > 1 ? `Part ${letter} · ` : '';
      const markLabel = part.marks == null ? 'Success criteria · unmarked' :
        `Mark scheme · ${part.marks} ${part.marks === 1 ? 'mark' : 'marks'}`;
      const markPages = [];
      for (let first = 0; first < part.points.length; first += 2) {
        const points = part.points.slice(first, first + 2);
        markPages.push('<ul class="mark-points">' + points.map(point =>
          `<li>${part.marks == null ? '' : '<strong>1 mark</strong> · '}${escape(point)}</li>`
        ).join('') + '</ul>');
      }
      return [
        { label: prefix + 'Model answer', html: `<p>${escape(part.model)}</p>` },
        ...markPages.map(html => ({ label: prefix + markLabel, html })),
        ...(part.notes ? [{ label: prefix + 'Marking guidance', html: `<p>${escape(part.notes)}</p>` }] : []),
      ];
    });
  }

  function widgetPages() {
    if (panel === 'review') return reviewPages(current().task.parts);
    if (panel === 'hot' && hotReview) return reviewPages([lesson.hot]);
    return lesson.widgets[panel];
  }

  function syncButtons() {
    const main = document.getElementById('main-review');
    if (main) main.setAttribute('aria-expanded', String(panel === 'review'));
    el.tools.querySelectorAll('[data-widget]').forEach(button => {
      button.setAttribute('aria-expanded', String(panel === button.dataset.widget));
    });
  }

  function renderPanel() {
    const pages = widgetPages();
    const content = pages[page];
    const review = panel === 'review' || hotReview;
    const hotQuestion = hotReview ?
      `<p class="widget-question">${escape(lesson.hot.prompt)} (${lesson.hot.marks})</p>` : '';
    const target = content.target ? `<button class="widget-action" type="button" data-target="${escape(content.target)}">Open task →</button>` : '';
    el['panel-title'].textContent = panel === 'review' ? 'Model answer & mark scheme' : labels[panel];
    el['panel-body'].innerHTML = `
      ${hotQuestion}
      ${review ? `<p class="review-label">${escape(content.label)}</p>` : `<h3>${escape(content.title)}</h3>`}
      ${content.html}
      ${target}
      ${panel === 'hot' ? reviewButton('hot-review', hotReview) : ''}
    `;
    el['panel-navigation'].hidden = pages.length === 1;
    el['panel-prev'].disabled = page === 0;
    el['panel-next'].disabled = page === pages.length - 1;
    el['panel-count'].textContent = `${page + 1} / ${pages.length}`;
  }

  function openPanel(type, opener, shouldFocus = true) {
    panel = type;
    page = 0;
    hotReview = false;
    returnFocus = opener;
    el.panel.hidden = false;
    el.workspace.classList.add('has-drawer');
    syncButtons();
    renderPanel();
    if (shouldFocus) el['panel-title'].focus({ preventScroll: true });
  }

  function closePanel(shouldFocus = true) {
    panel = null;
    el.panel.hidden = true;
    el['panel-body'].replaceChildren();
    el.workspace.classList.remove('has-drawer');
    syncButtons();
    if (shouldFocus) (returnFocus?.isConnected ? returnFocus :
      document.getElementById('screen-title')).focus({ preventScroll: true });
  }

  function togglePanel(type, button) {
    if (panel === type) closePanel();
    else openPanel(type, button);
  }

  function goTo(destination) {
    if (destination < 0 || destination >= lesson.screens.length) return;
    closePanel(false);
    index = destination;
    history.replaceState(null, '', '#' + current().id);
    renderScreen(true);
  }

  function movePanel(direction, button) {
    if (!panel) return;
    const pages = widgetPages();
    page = Math.max(0, Math.min(pages.length - 1, page + direction));
    renderPanel();
    if (button.disabled) el['panel-body'].focus({ preventScroll: true });
  }

  el.screen.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    if (button.id === 'main-review') togglePanel('review', button);
    if (!button.dataset.step) return;

    const screen = current();
    const step = (modelSteps.get(screen.id) ?? 0) + Number(button.dataset.step);
    modelSteps.set(screen.id, step);
    const currentModel = el.screen.querySelector('.worked-model');
    currentModel.outerHTML = modelMarkup(screen);
    const controls = el.screen.querySelector('.model-controls');
    const nextButton = controls.querySelector('[data-step="1"]:enabled');
    (nextButton || controls.querySelector('[data-step="-1"]'))?.focus({ preventScroll: true });
  });

  el.tools.addEventListener('click', event => {
    const button = event.target.closest('[data-widget]');
    if (button) togglePanel(button.dataset.widget, button);
  });

  el['panel-body'].addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    if (button.dataset.target) goTo(screenIndex(button.dataset.target));
    if (button.id !== 'hot-review') return;
    hotReview = !hotReview;
    page = 0;
    renderPanel();
    document.getElementById('hot-review').focus({ preventScroll: true });
  });

  el['close-panel'].addEventListener('click', () => closePanel());
  el['panel-prev'].addEventListener('click', event => movePanel(-1, event.currentTarget));
  el['panel-next'].addEventListener('click', event => movePanel(1, event.currentTarget));
  el.previous.addEventListener('click', () => goTo(index - 1));
  el.next.addEventListener('click', () => goTo(index + 1));
  el['screen-select'].addEventListener('change', event => goTo(screenIndex(event.target.value)));
  window.addEventListener('hashchange', () => goTo(screenIndex(location.hash.slice(1))));

  document.addEventListener('keydown', event => {
    if (event.defaultPrevented || event.altKey || event.metaKey || event.ctrlKey) return;
    if (event.key === 'Escape' && panel) {
      event.preventDefault();
      closePanel();
      return;
    }
    if (event.target.closest('button, a, select, input, textarea') || panel) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      goTo(index + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });

  el['screen-select'].innerHTML = lesson.screens.map((screen, index) =>
    `<option value="${screen.id}">${index + 1}. ${escape(screen.title)}</option>`
  ).join('');
  renderScreen(false);
})();
