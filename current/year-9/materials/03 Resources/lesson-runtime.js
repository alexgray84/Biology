/* Arcadia local lesson controller. The authored screen list is the complete route. */
(() => {
 'use strict';
 const data=window.LESSON_DATA;
 const $=id=>document.getElementById(id);
 const el=Object.fromEntries(['app','workspace','screen','topic','tools','panel','panel-title','panel-body','panel-count','panel-prev','panel-next','previous','next','screen-select','screen-counter','close-panel'].map(id=>[id,$(id)]));
 const labels={resources:'Resources',assessments:'Assessments',adaptation:'Adaptation',hot:'HOT',ai:'AI literacy',uae:'UAE National Agenda'};
 const routes={blue:'Blue · Get started',green:'Green · Explain and apply',gold:'Gold · Go further'};
 const states=new Map();
 let index=Math.max(0,data.screens.findIndex(s=>s.id===location.hash.slice(1))),panelType=null,panelPage=0,widgetReview=false,widgetPage=0,origin=null,mounted=null;
 const current=()=>data.screens[index];
 const state=()=>{const id=current().id;if(!states.has(id))states.set(id,{stage:'green',page:0,step:0,model:{}});return states.get(id);};
 const active=()=>state().recheck&&current().recheck?current().recheck:state().secondary&&current().secondary?current().secondary:current().stages?.[state().stage]||current();
 const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const list=xs=>`<ul>${(xs||[]).map(x=>`<li>${x}</li>`).join('')}</ul>`;
 const reviewButton=(id,open=false)=>`<button type="button" class="reveal-control" id="${id}" aria-expanded="${open}" aria-controls="panel">Model answer &amp; mark scheme</button>`;
 const mainAnswers=()=>[...(active().answers||current().answers||[]),...(!(state().recheck||state().secondary)?((current().pages||[])[state().page]?.answers||[]):[])];
 function plain(html){const x=document.createElement('div');x.innerHTML=html||'';return x.textContent;}
 function reviews(answers){return answers.flatMap((a,i)=>[
  {title:answers.length>1?`Answer ${i+1}`:'Your explanation',html:`<p class="review-label">Model answer</p><div class="review-model">${a.model}</div>`,answer:a},
  {title:answers.length>1?`Answer ${i+1}`:'Your explanation',html:`<p class="review-label">${a.marks==null?'Success criteria · unmarked':`Mark scheme · ${a.marks} marks`}</p>${list(a.criteria)}`,answer:a}
 ]);}
 function normalize(value){return Array.isArray(value)?value:(value?.pages||[]);}
 function pages(type){
  if(type==='review')return reviews(mainAnswers());
  if(current().independent)return [];
  const local=normalize(current().widgets?.[type]);if(local.length)return local;
  if(type==='adaptation'&&current().stages?.blue){const a=current().stages.blue;return [{title:routes.blue,html:a.html,answers:a.answers||[]}];}
  if(type==='hot'&&current().stages?.gold){const a=current().stages.gold;return [{title:routes.gold,html:a.html,answers:a.answers||[]}];}
  return normalize(data.widgets?.[type]);
 }
 function closePanel(focus=true){
  const previous=origin;panelType=null;panelPage=0;widgetReview=false;widgetPage=0;
  el.panel.hidden=true;el.workspace.classList.remove('has-drawer');
  document.querySelectorAll('[data-widget],#main-review').forEach(b=>b.setAttribute('aria-expanded','false'));
  if(focus)(previous?.isConnected?previous:$('screen-title')).focus({preventScroll:true});
 }
 function renderPanel(focus=false){
  const all=pages(panelType);panelPage=Math.max(0,Math.min(panelPage,all.length-1));const p=all[panelPage];if(!p)return;
  el['panel-title'].textContent=panelType==='review'?'Model answer & mark scheme':labels[panelType];
  el.panel.dataset.type=panelType;
  let total=all.length,pos=panelPage;
  if(panelType==='review')el['panel-body'].innerHTML=`<h3>${esc(p.title)}</h3>${p.html}`;
  else if(widgetReview&&p.answers?.length){const rs=reviews(p.answers);widgetPage=Math.max(0,Math.min(widgetPage,rs.length-1));const r=rs[widgetPage];total=rs.length;pos=widgetPage;el['panel-body'].innerHTML=`<p class="review-question">${r.answer.question}</p>${r.html}${reviewButton('widget-review',true)}`;}
  else el['panel-body'].innerHTML=`<h3>${p.title}</h3>${p.html||''}${p.target?`<button class="widget-action" type="button" data-target="${esc(p.target)}">Open this task →</button>`:''}${p.answers?.length?reviewButton('widget-review'):''}`;
  el['panel-count'].textContent=`${pos+1} / ${total}`;el['panel-prev'].disabled=pos===0;el['panel-next'].disabled=pos===total-1;
  el['panel-body'].querySelector('[data-target]')?.addEventListener('click',e=>go(e.currentTarget.dataset.target));
  $('widget-review')?.addEventListener('click',()=>{widgetReview=!widgetReview;widgetPage=0;renderPanel();$('widget-review')?.focus({preventScroll:true});});
  if(focus)el['panel-title'].focus({preventScroll:true});
 }
 function openPanel(type,button,focus=true){
  if(panelType===type){closePanel();return;}if(!pages(type).length)return;
  panelType=type;panelPage=0;widgetReview=false;widgetPage=0;origin=button;el.panel.hidden=false;el.workspace.classList.add('has-drawer');
  document.querySelectorAll('[data-widget],#main-review').forEach(b=>b.setAttribute('aria-expanded',String(b.dataset.widget===type||(b.id==='main-review'&&type==='review'))));renderPanel(focus);
 }
 function render(focus=true){
  mounted?.dispose();mounted=null;closePanel(false);
  const s=current(),st=state(),a=active();
  el.app.dataset.family=s.family;el.app.dataset.screenId=s.id;el.app.dataset.stage=st.stage;el.app.dataset.layout=s.layout||s.layout_id||'';
  el.topic.textContent=`${data.year} · ${data.title}`;el.topic.hidden=s.family==='Title';
  const rail=s.stages&&!s.independent?`<div class="stage-rail" role="group" aria-label="Task progression">${Object.keys(s.stages).map(k=>`<button data-stage="${k}" aria-pressed="${k===st.stage}">${routes[k]}</button>`).join('')}</div>`:'';
  const contentPages=st.recheck||st.secondary||st.stage==='gold'?[]:s.pages||[],page=contentPages[st.page];
  const evidence=page?`<section class="evidence-page"><div class="evidence-heading"><strong>${page.title}</strong>${contentPages.length>1?`<span><button data-content-prev aria-label="Previous evidence">←</button> ${st.page+1}/${contentPages.length} <button data-content-next aria-label="Next evidence">→</button></span>`:''}</div><div>${page.html||''}</div></section>`:'';
  const step=s.steps?.[st.step-1];
  const steps=s.steps?`<section class="model-steps"><p class="decision-trail">${s.steps.map((x,i)=>`<span class="${i<st.step?'built':''}">${x.label.split(' · ')[1]||x.label}</span>`).join(' → ')}</p><div class="step-body">${step?`<p><strong>${step.label}</strong> ${step.body}</p>`:'<p class="blank-model">Start with the product’s requirement. Suggest the first link.</p>'}</div><button type="button" data-step-back ${st.step===0?'disabled':''}>← Previous link</button><button type="button" data-step ${st.step>=s.steps.length?'disabled':''}>Build next link →</button><button type="button" data-step-reset>Start again</button></section>`:'';
  const model=s.model?'<div class="model-column"><div data-model class="model-host"></div></div>':'';
  const criteria=a.criteria||s.criteria||[];
  el.screen.className='screen';
  el.screen.innerHTML=`<div class="screen-top"><p class="screen-kicker">${esc(s.assessment_label||s.kicker||s.family)}${s.minutes?` · ${s.minutes} min`:''}</p><h1 id="screen-title" class="screen-heading" tabindex="-1">${a.title||s.title}</h1></div>${rail}<div class="screen-content ${s.model?'has-model':''}"><div class="task-column">${a.html??s.html??''}${evidence}${steps}</div>${model}</div>${s.recheck?`<button class="subtask-control" data-recheck>${st.recheck?'← Return to first check':'Different check →'}</button>`:''}${s.secondary?`<button class="subtask-control" data-secondary>${st.secondary?'← Return to independent task':'After your review · Homework →'}</button>`:''}${criteria.length?`<section class="success-criteria"><p class="criteria-label">Success criteria</p>${list(criteria)}</section>`:''}${mainAnswers().length?reviewButton('main-review'):''}`;
  el.tools.innerHTML=s.family==='Learning outcome'?'<button type="button" class="tool-control" data-widget="resources" aria-expanded="false" aria-controls="panel">Resources</button>':['Input','Assess','Thinking'].includes(s.family)&&!s.independent?Object.entries(labels).map(([k,v])=>`<button type="button" class="tool-control" data-widget="${k}" aria-expanded="false" aria-controls="panel">${v}</button>`).join(''):'';
  el.previous.disabled=index===0;el.next.disabled=index===data.screens.length-1;el['screen-select'].value=s.id;el['screen-counter'].textContent=`${index+1} / ${data.screens.length} · ${s.family}`;
  $('main-review')?.addEventListener('click',e=>openPanel('review',e.currentTarget));
  el.screen.querySelectorAll('[data-stage]').forEach(b=>b.addEventListener('click',()=>{st.stage=b.dataset.stage;st.page=0;render(false);el.screen.querySelector(`[data-stage="${st.stage}"]`).focus();}));
  el.screen.querySelector('[data-content-prev]')?.addEventListener('click',()=>{st.page=(st.page-1+contentPages.length)%contentPages.length;render(false);el.screen.querySelector('[data-content-prev]')?.focus();});
  el.screen.querySelector('[data-content-next]')?.addEventListener('click',()=>{st.page=(st.page+1)%contentPages.length;render(false);el.screen.querySelector('[data-content-next]')?.focus();});
  el.screen.querySelector('[data-step]')?.addEventListener('click',()=>{st.step=Math.min(st.step+1,s.steps.length);render(false);el.screen.querySelector(st.step===s.steps.length?'[data-step-back]':'[data-step]')?.focus();});
  el.screen.querySelector('[data-step-back]')?.addEventListener('click',()=>{st.step=Math.max(0,st.step-1);render(false);el.screen.querySelector('[data-step]')?.focus();});
  el.screen.querySelector('[data-step-reset]')?.addEventListener('click',()=>{st.step=0;render(false);el.screen.querySelector('[data-step]')?.focus();});
  el.screen.querySelector('[data-recheck]')?.addEventListener('click',()=>{st.recheck=!st.recheck;render(false);el.screen.querySelector('[data-recheck]')?.focus();});
  el.screen.querySelector('[data-secondary]')?.addEventListener('click',()=>{st.secondary=!st.secondary;render(false);el.screen.querySelector('[data-secondary]')?.focus();});
  if(s.model&&window.MaterialModels)mounted=window.MaterialModels.mount(el.screen.querySelector('[data-model]'),{...s.model,state:st.model});
  if(focus)$('screen-title').focus({preventScroll:true});
  if(s.family==='Learning outcome')openPanel('resources',null,false);
 }
 function go(id){const next=data.screens.findIndex(s=>s.id===id);if(next<0)return;index=next;history.replaceState(null,'','#'+id);render();}
 function panelMove(delta){if(widgetReview&&panelType!=='review')widgetPage+=delta;else panelPage+=delta;renderPanel();}
 el.tools.addEventListener('click',e=>{const b=e.target.closest('[data-widget]');if(b)openPanel(b.dataset.widget,b);});
 el.previous.addEventListener('click',()=>index&&go(data.screens[index-1].id));el.next.addEventListener('click',()=>index<data.screens.length-1&&go(data.screens[index+1].id));
 el['screen-select'].addEventListener('change',e=>go(e.target.value));el['close-panel'].addEventListener('click',()=>closePanel());
 el['panel-prev'].addEventListener('click',()=>panelMove(-1));el['panel-next'].addEventListener('click',()=>panelMove(1));
 document.addEventListener('keydown',e=>{if(e.defaultPrevented||e.ctrlKey||e.metaKey||e.altKey)return;if(e.key==='Escape'&&panelType){e.preventDefault();closePanel();return;}if(e.target.closest('button,a,select,input,textarea,[contenteditable]'))return;if(e.key==='ArrowRight'&&index<data.screens.length-1){e.preventDefault();go(data.screens[index+1].id);}if(e.key==='ArrowLeft'&&index){e.preventDefault();go(data.screens[index-1].id);}});
 window.addEventListener('hashchange',()=>{if(data.screens.some(s=>s.id===location.hash.slice(1)))go(location.hash.slice(1));});
 el['screen-select'].innerHTML=data.screens.map((s,i)=>`<option value="${esc(s.id)}">${String(i+1).padStart(2,'0')} · ${s.title}</option>`).join('');
 render(false);
})();
