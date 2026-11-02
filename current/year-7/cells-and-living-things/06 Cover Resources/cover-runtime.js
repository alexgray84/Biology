/* Offline screen and adjacent-panel navigation. Authored content only; no network or pupil data. */
(() => {
  'use strict';
  const data = window.COVER_DATA;
  const byId = id => document.getElementById(id);
  const el = Object.fromEntries(['app','workspace','screen','topic','tools','panel','panel-title','panel-body','panel-nav','panel-count','panel-prev','panel-next','previous','next','screen-select','screen-counter','close-panel'].map(id => [id, byId(id)]));
  const widgetLabels = { resources:'Resources', assessments:'Assessments', adaptation:'Adaptation', hot:'HOT', ai:'AI literacy', uae:'UAE National Agenda' };
  const startId = decodeURIComponent(location.hash.slice(1));
  let index = Math.max(0, data.screens.findIndex(s => s.id === startId));
  let panelType = null, panelPage = 0, widgetReview = false, reviewPart = 0, returnFocus = null;
  const pagesByScreen = new Map();
  let cellViewer = null;
  const current = () => data.screens[index];
  const button = (text, attrs = '') => `<button type="button" class="reveal-control" ${attrs}>${text}</button>`;
  const points = items => items?.length ? `<ul>${items.map(t => `<li>${t}</li>`).join('')}</ul>` : '';
  function reviewHTML(answer, keepQuestion = true, part = 'model') {
    const heading = answer.marks == null ? 'Success criteria · unmarked' : `Mark scheme · ${answer.marks} mark${answer.marks === 1 ? '' : 's'}`;
    const content = part === 'model'
      ? `<p class="review-label">Model answer · ${answer.id || ''}</p><p class="review-model">${answer.model}</p>`
      : `<div class="review-criteria"><p class="review-label">${heading} · ${answer.id || ''}</p>${points(answer.criteria)}</div>`;
    return `${keepQuestion ? `<p class="review-question"><b>${answer.id || ''}</b> ${answer.question}</p>` : ''}${content}`;
  }
  function renderScreen(focus = true) {
    cellViewer?.dispose();
    cellViewer = null;
    const s = current();
    panelType = null; panelPage = 0; widgetReview = false;
    el.panel.hidden = true;
    el.workspace.classList.remove('has-drawer');
    el.app.dataset.family = s.family;
    el.app.dataset.screenId = s.id;
    el.topic.hidden = s.family === 'Title';
    el.screen.className = `screen screen-${s.family.toLowerCase().replaceAll(' ', '-')}`;
    const copy = `<div class="cover-copy">${s.html}</div>`;
    const content = s.diagram ? `<div class="diagram-layout">${copy}<figure class="cell-figure"><div class="cell-viewer" data-cell-viewer="${s.diagram}"><div class="cell-fallback">${window.COVER_DIAGRAMS[s.diagram] || ''}</div></div><figcaption class="diagram-caption">${s.caption || 'Explanatory 3D model, not a microscope image. Not to scale.'}</figcaption></figure></div>` : copy;
    el.screen.innerHTML = `<div class="${s.family === 'Title' ? 'title-layout' : 'cover-copy'}">
      <p class="screen-kicker">${s.kicker || s.family}${s.time ? ` · ${s.time}` : ''}</p>
      <h1 class="screen-heading" id="screen-title" tabindex="-1">${s.title}</h1>
      ${s.lead ? `<p class="screen-lead">${s.lead}</p>` : ''}${content}
      ${s.answers?.length ? button('Model answer &amp; mark scheme', 'id="main-review" aria-expanded="false" aria-controls="panel"') : ''}</div>`;
    el.tools.innerHTML = ['Input','Assess','Thinking'].includes(s.family)
      ? Object.entries(widgetLabels).map(([key,label]) => `<button type="button" class="tool-control" data-widget="${key}" aria-expanded="false" aria-controls="panel">${label}</button>`).join('') : '';
    el.previous.disabled = index === 0;
    el.next.disabled = index === data.screens.length - 1;
    el['screen-select'].value = s.id;
    el['screen-counter'].textContent = `${index + 1} / ${data.screens.length} · ${s.family}`;
    el.screen.querySelector('#main-review')?.addEventListener('click', event => togglePanel('review', event.currentTarget));
    if (s.diagram && window.COVER_CELL_VIEWER) cellViewer = window.COVER_CELL_VIEWER.mount(el.screen.querySelector('[data-cell-viewer]'), s.diagram);
    if (focus) byId('screen-title').focus({preventScroll:true});
    if (s.family === 'Learning outcome') openPanel('resources', null, false);
  }
  function widgetPages(type) {
    const s = current();
    if (type === 'review') return (s.answers || []).flatMap(answer => [{answer, part:'model'}, {answer, part:'criteria'}]);
    const local = s.widgets?.[type];
    return local || data.widgets[type] || [];
  }
  function renderPanel(focus = false) {
    const pages = widgetPages(panelType);
    panelPage = Math.max(0, Math.min(panelPage, pages.length - 1));
    const p = pages[panelPage];
    el['panel-title'].textContent = panelType === 'review' ? 'Model answer & mark scheme' : widgetLabels[panelType];
    el.panel.dataset.type = panelType;
    el.panel.dataset.page = String(panelPage + 1);
    if (panelType === 'review') {
      el['panel-body'].innerHTML = reviewHTML(p.answer, false, p.part);
    } else {
      const answer = p.answer;
      el['panel-body'].innerHTML = `${widgetReview && answer
        ? reviewHTML(answer, true, reviewPart === 0 ? 'model' : 'criteria')
        : `<h3>${p.title}</h3>${p.html || ''}${p.target ? `<button type="button" class="widget-action" data-target="${p.target}">${p.action || 'Open this task'} <span aria-hidden="true">→</span></button>` : ''}`}
        ${answer ? button('Model answer &amp; mark scheme', `id="widget-review" aria-expanded="${widgetReview}"`) : ''}`;
      el['panel-body'].querySelector('[data-target]')?.addEventListener('click', event => goToId(event.currentTarget.dataset.target));
      el['panel-body'].querySelector('#widget-review')?.addEventListener('click', () => { widgetReview = !widgetReview; reviewPart = 0; renderPanel(); byId('widget-review').focus({preventScroll:true}); });
    }
    const inWidgetReview = panelType !== 'review' && widgetReview;
    el['panel-count'].textContent = inWidgetReview
      ? `Review ${reviewPart + 1} / 2 · ${reviewPart ? 'Marking notes' : 'Model answer'}`
      : `${panelPage + 1} / ${pages.length}${panelType === 'review' ? ` · ${p.answer.id} · ${p.part === 'model' ? 'Model' : 'Marking'}` : ''}`;
    el['panel-prev'].disabled = inWidgetReview ? reviewPart === 0 : panelPage === 0;
    el['panel-next'].disabled = inWidgetReview ? reviewPart === 1 : panelPage === pages.length - 1;
    pagesByScreen.set(`${current().id}:${panelType}`, panelPage);
    if (focus) el['panel-title'].focus({preventScroll:true});
  }
  function openPanel(type, origin, focus = true) {
    if (!widgetPages(type).length) return;
    panelType = type;
    panelPage = pagesByScreen.get(`${current().id}:${type}`) || 0;
    widgetReview = false; reviewPart = 0;
    returnFocus = origin;
    el.panel.hidden = false;
    el.workspace.classList.add('has-drawer');
    document.querySelectorAll('[data-widget], #main-review').forEach(b => b.setAttribute('aria-expanded', String(b.dataset.widget === type || (b.id === 'main-review' && type === 'review'))));
    renderPanel(focus);
  }
  function closePanel(focus = true) {
    const origin = returnFocus;
    panelType = null; widgetReview = false;
    el.panel.hidden = true;
    el.workspace.classList.remove('has-drawer');
    document.querySelectorAll('[data-widget], #main-review').forEach(b => b.setAttribute('aria-expanded','false'));
    if (focus) (origin?.isConnected ? origin : byId('screen-title')).focus({preventScroll:true});
  }
  function togglePanel(type, origin) { panelType === type ? closePanel() : openPanel(type, origin); }
  function goToId(id) {
    const target = data.screens.findIndex(s => s.id === id);
    if (target < 0) return;
    index = target;
    history.replaceState(null, '', `#${id}`);
    renderScreen();
  }
  function movePanel(delta) {
    if (widgetReview && panelType !== 'review') {
      reviewPart = Math.max(0, Math.min(1, reviewPart + delta));
      renderPanel();
      return;
    }
    const next = panelPage + delta;
    if (!panelType || next < 0 || next >= widgetPages(panelType).length) return;
    panelPage = next;
    widgetReview = false;
    renderPanel();
  }
  el.tools.addEventListener('click', event => { const b = event.target.closest('[data-widget]'); if (b) togglePanel(b.dataset.widget, b); });
  el.previous.addEventListener('click', () => { if (index > 0) goToId(data.screens[index-1].id); });
  el.next.addEventListener('click', () => { if (index < data.screens.length-1) goToId(data.screens[index+1].id); });
  el['close-panel'].addEventListener('click', () => closePanel());
  el['panel-prev'].addEventListener('click', () => movePanel(-1));
  el['panel-next'].addEventListener('click', () => movePanel(1));
  el['screen-select'].addEventListener('change', event => goToId(event.target.value));
  document.addEventListener('keydown', event => {
    if (event.defaultPrevented) return;
    if (event.key === 'Escape' && panelType) { event.preventDefault(); closePanel(); return; }
    if (event.target.closest('button, a, select, input, textarea')) return;
    if (event.key === 'ArrowRight' && index < data.screens.length-1) { event.preventDefault(); goToId(data.screens[index+1].id); }
    if (event.key === 'ArrowLeft' && index > 0) { event.preventDefault(); goToId(data.screens[index-1].id); }
  });
  window.addEventListener('hashchange', () => { const id = decodeURIComponent(location.hash.slice(1)); if (data.screens.some(s => s.id === id)) goToId(id); });
  el['screen-select'].innerHTML = data.screens.map((s,i) => `<option value="${s.id}">${String(i+1).padStart(2,'0')} · ${s.nav || s.title}</option>`).join('');
  renderScreen(false);
})();
