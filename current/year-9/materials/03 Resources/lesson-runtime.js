/* Arcadia lesson navigation and adjacent review panels. Local authored content only. */
(() => {
  'use strict';
  const data = window.LESSON_DATA;
  const embeddedDiagrams = new Set(['spaghetti','rs','blanknetwork','blankseparate']);
  data.screens = data.screens.flatMap(s => {
    if(!s.diagram || embeddedDiagrams.has(s.diagram))return [s];
    const visual={id:`${s.id}-visual`,family:'Input',title:'Schematic representation',kicker:s.title,nav:`${s.title} · diagram`,html:'',diagram:s.diagram,criteria:[],visualOnly:true,optional:s.optional,independent:s.independent};
    const resources=[{title:'Current representation',html:`<figure class="panel-figure">${window.LESSON_DIAGRAMS?.[s.diagram] || ''}</figure><p class="source">Original schematic · not to scale.</p>`},...(s.widgets?.resources || data.widgets?.resources || [])];
    return [visual,{...s,diagram:null,widgets:{...s.widgets,resources}}];
  });
  for(const key of ['spaghetti','rs']) {
    if(!window.LESSON_DIAGRAMS?.[key])continue;
    const holder=document.createElement('div');holder.innerHTML=window.LESSON_DIAGRAMS[key];
    const svg=holder.querySelector('svg');svg.setAttribute('viewBox','0 0 720 330');
    holder.querySelectorAll('path').forEach(path=>path.setAttribute('transform','translate(0 40)'));
    holder.querySelectorAll('text').forEach(t=>{if(/Analogy:|Equal-length/.test(t.textContent))t.remove();else {t.setAttribute('style','font-size:88px');t.setAttribute('y','86');}});
    window.LESSON_DIAGRAMS[key]=holder.innerHTML;
  }
  const ids = ['app','workspace','screen','topic','tools','panel','panel-title','panel-body','panel-count','panel-prev','panel-next','previous','next','screen-select','screen-counter','close-panel'];
  const el = Object.fromEntries(ids.map(id => [id,document.getElementById(id)]));
  const labels = {resources:'Resources',assessments:'Assessments',adaptation:'Adaptation',hot:'HOT',ai:'AI literacy',uae:'UAE National Agenda'};
  const stageLabels = {blue:'Blue · Get started',green:'Green · Explain and apply',gold:'Gold · Go further'};
  const stages = new Map();
  let index = Math.max(0,data.screens.findIndex(s => s.id === decodeURIComponent(location.hash.slice(1))));
  let panelType = null, panelPage = 0, returnFocus = null, widgetReview = false, widgetPart = 0;
  const current = () => data.screens[index];
  const stageKey = () => current().independent ? null : (stages.get(current().id) || (current().stages?.green ? 'green' : Object.keys(current().stages || {})[0]));
  const active = () => current().stages?.[stageKey()] || {};
  const answers = () => active().answers || current().answers || [];
  const escape = value => String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const list = items => `<ul>${(items || []).map(x=>`<li>${x}</li>`).join('')}</ul>`;
  const reviewButton = (id,expanded=false) => `<button type="button" class="reveal-control" id="${id}" aria-expanded="${expanded}" aria-controls="panel">Model answer &amp; mark scheme</button>`;
  function plain(html) { const node=document.createElement('div');node.innerHTML=html || '';return node.textContent.trim(); }
  function chunks(html,limit=30) {
    const words=plain(html).split(/\s+/).filter(Boolean), result=[];
    for(let i=0;i<words.length;i+=limit) result.push(escape(words.slice(i,i+limit).join(' ')));
    return result.length ? result : ['No additional model wording is required.'];
  }
  function reviewPages(answer,limit=30) {
    return [
      ...chunks(answer.model,limit).map(html=>({answer,kind:'Model answer',html:`<p class="review-model">${html}</p>`})),
      ...(answer.criteria || []).flatMap(c=>chunks(c,limit).map(html=>({answer,kind:answer.marks == null ? 'Success criteria · unmarked' : `Mark scheme · ${answer.marks} marks`,html:`<p class="review-model">${html}</p>`})))
    ];
  }
  function resetPanel() {
    panelType=null;panelPage=0;widgetReview=false;widgetPart=0;
    el.panel.hidden=true;el.workspace.classList.remove('has-drawer');
  }
  function renderScreen(focus=true) {
    resetPanel();
    const s=current(),a=active(),criteria=a.criteria || s.criteria || [];
    el.app.dataset.family=s.family;el.app.dataset.screenId=s.id;el.app.dataset.stage=stageKey() || '';el.app.dataset.visual=s.visualOnly ? 'true' : 'false';
    el.topic.textContent=`${data.year || 'Year 9'} · ${data.title}`;
    el.topic.hidden=s.family==='Title';
    el.screen.className=`screen ${s.family==='Title' ? 'screen-title' : ''}`;
    const rail=s.stages && !s.independent ? `<div class="stage-rail" role="group" aria-label="Task progression">${Object.keys(s.stages).map(k=>`<button type="button" data-stage="${k}" aria-pressed="${k===stageKey()}">${stageLabels[k]}</button>`).join('')}</div>` : '';
    const diagram=s.diagram && window.LESSON_DIAGRAMS?.[s.diagram] ? `<figure class="teaching-figure ${embeddedDiagrams.has(s.diagram) ? 'compact-figure' : ''}">${window.LESSON_DIAGRAMS[s.diagram]}</figure>` : '';
    el.screen.innerHTML=`<p class="screen-kicker">${escape(s.kicker || s.family)}${s.taskId ? ` · ${escape(s.taskId)}` : ''}${s.time ? ` · ${escape(s.time)}` : ''}</p><h1 class="screen-heading" id="screen-title" tabindex="-1">${s.title}</h1>${rail}<div class="screen-content ${s.taskId ? 'task-content' : ''}">${a.html ?? s.html ?? ''}${diagram}</div>${criteria.length ? `<section class="success-criteria" aria-label="Success criteria"><p class="criteria-label">Success criteria</p>${list(criteria)}</section>` : ''}${answers().length ? reviewButton('main-review') : ''}`;
    el.tools.innerHTML=['Input','Assess','Thinking'].includes(s.family) ? Object.entries(labels).map(([key,label])=>`<button type="button" class="tool-control" data-widget="${key}" aria-expanded="false" aria-controls="panel">${label}</button>`).join('') : '';
    el.previous.disabled=nextIndex(-1)<0;el.next.disabled=nextIndex(1)<0;
    el['screen-select'].value=s.id;el['screen-counter'].textContent=`${index+1} / ${data.screens.length} · ${s.family}`;
    el.screen.querySelector('#main-review')?.addEventListener('click',e=>togglePanel('review',e.currentTarget));
    el.screen.querySelectorAll('[data-stage]').forEach(b=>b.addEventListener('click',()=>{
      const key=b.dataset.stage;stages.set(s.id,key);renderScreen(false);
      el.screen.querySelector(`[data-stage="${key}"]`).focus({preventScroll:true});
    }));
    if(focus) document.getElementById('screen-title').focus({preventScroll:true});
    if(s.family==='Learning outcome') openPanel('resources',null,false);
  }
  function stageWidget(key) {
    const stage=current().stages?.[key];
    if(!stage) return null;
    const visible=active().criteria || current().criteria || [];
    const extra=(stage.criteria || current().criteria || []).filter(c=>!visible.includes(c));
    return [{title:stageLabels[key],html:`${stage.html}${extra.length ? list(extra) : ''}`,answers:stage.answers || current().answers || []}];
  }
  function pages(type) {
    if(type==='review') return answers().flatMap(a=>reviewPages(a));
    if(current().independent) return [{title:'Your own explanation',html:'<p>Use the question and success criteria. Complete your own response before opening its review.</p>'}];
    const local=current().widgets?.[type];
    if(local?.length) return local;
    if(type==='adaptation' && current().stages?.blue) return stageWidget('blue');
    if(type==='hot' && current().stages?.gold) return stageWidget('gold');
    return data.widgets?.[type] || [{title:labels[type],html:'<p>Use the current task and its visible success criteria.</p>'}];
  }
  function renderPanel(focus=false) {
    const all=pages(panelType);panelPage=Math.max(0,Math.min(panelPage,all.length-1));
    const p=all[panelPage];
    el['panel-title'].textContent=panelType==='review' ? 'Model answer & mark scheme' : labels[panelType];
    el.panel.dataset.type=panelType;el.panel.dataset.page=String(panelPage+1);
    let total=all.length,position=panelPage;
    const widgetAnswers=p.answers || (p.answer ? [p.answer] : []);
    if(panelType==='review') {
      el['panel-body'].innerHTML=`<p class="review-label">${escape(p.answer.id || current().taskId || '')} · ${escape(p.kind)}</p>${p.html}`;
    } else if(widgetReview && widgetAnswers.length) {
      const parts=widgetAnswers.flatMap(answer=>reviewPages(answer,22));widgetPart=Math.max(0,Math.min(widgetPart,parts.length-1));
      const r=parts[widgetPart];total=parts.length;position=widgetPart;
      el['panel-body'].innerHTML=`<p class="review-question">${r.answer.question || p.title}</p><p class="review-label">${escape(r.kind)}</p>${r.html}${reviewButton('widget-review',true)}`;
    } else {
      el['panel-body'].innerHTML=`<h3>${p.title}</h3>${p.html || ''}${p.target ? `<button type="button" class="widget-action" data-target="${escape(p.target)}">${p.action || 'Open this task'} →</button>` : ''}${widgetAnswers.length ? reviewButton('widget-review') : ''}`;
    }
    el['panel-count'].textContent=`${position+1} / ${total}`;
    el['panel-prev'].disabled=position===0;el['panel-next'].disabled=position===total-1;
    el['panel-body'].querySelector('[data-target]')?.addEventListener('click',e=>goToId(e.currentTarget.dataset.target));
    el['panel-body'].querySelector('#widget-review')?.addEventListener('click',()=>{widgetReview=!widgetReview;widgetPart=0;renderPanel();document.getElementById('widget-review').focus({preventScroll:true});});
    if(focus) el['panel-title'].focus({preventScroll:true});
  }
  function openPanel(type,origin,focus=true) {
    if(!pages(type).length) return;
    panelType=type;panelPage=0;widgetReview=false;widgetPart=0;returnFocus=origin;
    el.panel.hidden=false;el.workspace.classList.add('has-drawer');
    document.querySelectorAll('[data-widget],#main-review').forEach(b=>b.setAttribute('aria-expanded',String(b.dataset.widget===type || (b.id==='main-review' && type==='review'))));
    renderPanel(focus);
  }
  function closePanel(focus=true) {
    const origin=returnFocus;resetPanel();
    document.querySelectorAll('[data-widget],#main-review').forEach(b=>b.setAttribute('aria-expanded','false'));
    if(focus) (origin?.isConnected ? origin : document.getElementById('screen-title')).focus({preventScroll:true});
  }
  function togglePanel(type,origin) { panelType===type ? closePanel() : openPanel(type,origin); }
  function nextIndex(direction) {
    for(let i=index+direction;i>=0 && i<data.screens.length;i+=direction) {
      if(current().optional || !data.screens[i].optional)return i;
    }
    return -1;
  }
  function goToId(id) {
    const next=data.screens.findIndex(s=>s.id===id);if(next<0)return;
    index=next;history.replaceState(null,'',`#${id}`);renderScreen();
  }
  function movePanel(delta) {
    if(!panelType)return;
    if(widgetReview && panelType!=='review') widgetPart+=delta;else panelPage+=delta;
    renderPanel();
  }
  el.tools.addEventListener('click',e=>{const b=e.target.closest('[data-widget]');if(b)togglePanel(b.dataset.widget,b);});
  el.previous.addEventListener('click',()=>{const next=nextIndex(-1);if(next>=0)goToId(data.screens[next].id);});
  el.next.addEventListener('click',()=>{const next=nextIndex(1);if(next>=0)goToId(data.screens[next].id);});
  el['close-panel'].addEventListener('click',()=>closePanel());
  el['panel-prev'].addEventListener('click',()=>movePanel(-1));el['panel-next'].addEventListener('click',()=>movePanel(1));
  el['screen-select'].addEventListener('change',e=>goToId(e.target.value));
  document.addEventListener('keydown',e=>{
    if(e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey)return;
    if(e.key==='Escape' && panelType){e.preventDefault();closePanel();return;}
    if(e.target.closest('select,input,textarea,button,a,[contenteditable="true"]'))return;
    if(e.key==='ArrowRight' && nextIndex(1)>=0){e.preventDefault();goToId(data.screens[nextIndex(1)].id);}
    if(e.key==='ArrowLeft' && nextIndex(-1)>=0){e.preventDefault();goToId(data.screens[nextIndex(-1)].id);}
  });
  window.addEventListener('hashchange',()=>{const id=decodeURIComponent(location.hash.slice(1));if(data.screens.some(s=>s.id===id))goToId(id);});
  el['screen-select'].innerHTML=data.screens.map((s,i)=>`<option value="${escape(s.id)}">${String(i+1).padStart(2,'0')} · ${s.optional ? 'Optional · ' : ''}${escape(s.nav || s.title)}</option>`).join('');
  renderScreen(false);
})();
