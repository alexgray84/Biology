/* Arcadia biology lesson renderer, extended for local Three.js models, reveal tables, timers and explicit pupil steps.
   Screen IDs are explicit; pupil answers stay in books. No responses are stored or transmitted. */
(() => {
  const lesson=window.LESSON;
  const Models=window.LessonModels||{};
  const $=id=>document.getElementById(id);
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const states={}, widgetStates={};
  let index=0, activeWidget=null, instance=null, answerContext=null;
  const access={diagram:false};
  const initial=location.hash.slice(1);
  if(lesson.phases.some(p=>p.id===initial)) index=lesson.phases.findIndex(p=>p.id===initial);
  const phase=()=>lesson.phases[index];
  const clone=o=>JSON.parse(JSON.stringify(o||{}));
  function initialState(p){
    const s={step:0};
    const M=p.model&&Models[p.model];
    if(M&&M.defaults)Object.assign(s,clone(M.defaults));
    if(p.modelState)Object.assign(s,clone(p.modelState));
    if(p.stepStates&&p.stepStates[0])Object.assign(s,clone(p.stepStates[0]));
    return s;
  }
  const state=()=>states[phase().id]??(states[phase().id]=initialState(phase()));
  const names=[['resources','Resources'],['assessments','Assessments'],['adaptation','Adaptation'],['hot','HOT'],['ai','AI literacy'],['uae','UAE National Agenda']];
  const button=(label,action,value,attrs='')=>`<button type="button" data-action="${action}" data-value="${esc(value)}" ${attrs}>${label}</button>`;
  const list=items=>`<ul class="bio-list">${items.map(s=>`<li>${s}</li>`).join('')}</ul>`;
  const figure=(name,caption,secondary=false)=>`<figure tabindex="0" aria-label="Scientific diagram" class="bio-figure${secondary?' is-secondary':''}">${BioDiagrams.render(name,state())}<figcaption>${caption||'Schematic model. Colours and sizes are illustrative.'}</figcaption></figure>`;
  const doThis=p=>p.doThis&&p.doThis.length?`<div class="do-this"><span class="do-this-label">Do this</span><ol>${p.doThis.map(x=>`<li>${x}</li>`).join('')}</ol></div>`:'';
  const ladder=p=>p.ladder&&p.ladder.length?`<ol class="ladder" aria-label="Build your answer in layers">${p.ladder.map(([k,t])=>`<li><b>${k}</b><span>${t}</span></li>`).join('')}</ol>`:'';
  const safety=p=>p.safety?`<p class="safety-note"><b>Safety</b> ${p.safety}</p>`:'';
  const task=p=>`${p.task?`<p class="bio-task">${p.task}</p>`:''}${doThis(p)}${(p.resources||[]).length?`<div class="task-resources">${p.resources.map(r=>`<a href="${esc(r.href)}" target="_blank" rel="noopener">${esc(r.label)} <span aria-hidden="true">↗</span></a>`).join('')}</div>`:''}`;
  const criteria=p=>p.criteria?.length?`<section class="visible-criteria" aria-label="Success criteria"><h2>What success looks like</h2><ul>${p.criteria.map(c=>`<li>${c}</li>`).join('')}</ul></section>`:'';

  /* ---------- one-screen component paging ----------
     Keep every authored node and its state. Content that does not fit the actual
     available canvas is presented as numbered parts, never scaled or scrolled. */
  const componentPages={main:{key:null,index:0,pages:[],units:[],containers:[]},drawer:{key:null,index:0,pages:[],units:[],containers:[]}};
  let fitQueued=false,fitRunning=false;
  const fitContainer='.bio-layout,.timer-layout,.timer-main,.bio-copy,.model-col,.model-panel,.visible-criteria,.bio-list,.outcome-list,.do-this,.answer-grid,.bio-cases,.model-readout,.model-controls,.concentration-pair,.support-word-map,.causal-strip,.table-wrap,.control-group,.bio-step,.mini-timer,.diagram-key';
  function fitUnits(host){
    const units=[],containers=[];
    const add=nodes=>{const a=(Array.isArray(nodes)?nodes:[nodes]).filter(Boolean);if(a.length)units.push(a);};
    function walk(node){
      if(node.hidden||node.hasAttribute('data-fit-persistent')||getComputedStyle(node).display==='none')return;
      if(node.hasAttribute('data-fit-split')){containers.push(node);const tokens=[...node.querySelectorAll('[data-fit-token]')];for(let i=0;i<tokens.length;i+=8)add(tokens.slice(i,i+8));return;}
      if(node.matches('details')){if(!node.open){add(node);return;}containers.push(node);[...node.children].filter(c=>!c.matches('summary')).forEach(walk);return;}
      if(node.matches('h1.screen-heading,.bio-eyebrow,h3')&&node.parentElement===host)return;
      if(node.matches('.widget-page')){containers.push(node);[...node.children].forEach(c=>{if(!c.matches('h3'))walk(c);});return;}
      if(node.matches('table')){containers.push(node);const rows=[...node.querySelectorAll('tbody>tr')];if(rows.length)rows.forEach(add);else add(node);return;}
      if(node.matches('dl')){containers.push(node);const children=[...node.children];for(let i=0;i<children.length;i++){if(children[i].tagName==='DT')add([children[i],children[i+1]?.tagName==='DD'?children[++i]:null]);else add(children[i]);}return;}
      const narrowModelCopy=innerWidth<=360&&phase().type==='model'&&node.tagName==='DIV'&&node.parentElement?.classList.contains('bio-layout');
      if(node.matches(fitContainer)||node.matches('ul,ol')||narrowModelCopy){
        containers.push(node);const children=[...node.children];
        if(!children.length){add(node);return;}
        children.forEach(c=>{if(!c.matches('.do-this-label,.step-number')&&!(node.matches('.visible-criteria')&&c.matches('h2')))walk(c);});return;
      }
      add(node);
    }
    [...host.children].forEach(walk);return {units,containers};
  }
  function showFitUnits(record,indices){
    const selected=new Set(indices);
    record.units.forEach((nodes,i)=>nodes.forEach(n=>n.toggleAttribute('data-fit-hidden',!selected.has(i))));
    [...record.containers].reverse().forEach(n=>{
      const descendants=record.units.map((nodes,i)=>nodes.some(u=>n===u||n.contains(u))?i:-1).filter(i=>i>=0);
      n.toggleAttribute('data-fit-hidden',descendants.length>0&&!descendants.some(i=>selected.has(i))&&!n.querySelector('[data-fit-persistent]'));
    });
  }
  function boundsFit(host){
    const r=host.getBoundingClientRect();
    const descendants=[...host.querySelectorAll('*')].filter(n=>!n.closest('[data-fit-hidden]')&&!n.hidden&&n.getClientRects().length&&getComputedStyle(n).display!=='none');
    const edge=descendants.reduce((b,n)=>{if(n.closest('svg')||n.matches('svg,canvas,option'))return b;const x=n.getBoundingClientRect();return {right:Math.max(b.right,x.right),bottom:Math.max(b.bottom,x.bottom)};},{right:r.left,bottom:r.top});
    return {fits:host.scrollHeight<=host.clientHeight+2&&host.scrollWidth<=host.clientWidth+2&&edge.bottom<=r.bottom-20&&edge.right<=r.right+2,height:host.clientHeight,width:host.clientWidth,scrollHeight:host.scrollHeight,scrollWidth:host.scrollWidth,bottom:edge.bottom-r.top,right:edge.right-r.left};
  }
  function pagerMarkup(id,record){return `${button('← Previous part','component-page',id+':-1',`aria-label="Previous part of this ${id==='main'?'screen':'resource page'}" ${record.index===0?'disabled':''}`)}<span role="status">Part ${record.index+1} of ${record.pages.length}</span>${button('Next part →','component-page',id+':1',`aria-label="Next part of this ${id==='main'?'screen':'resource page'}" ${record.index===record.pages.length-1?'disabled':''}`)}`;}
  function splitLongUnit(nodes){
    if(nodes.length!==1)return false;const node=nodes[0];
    if(!node.matches('p,li,blockquote')||node.hasAttribute('data-fit-split')||node.querySelector('button,input,textarea,select'))return false;
    const walker=document.createTreeWalker(node,NodeFilter.SHOW_TEXT),texts=[];let text;while(text=walker.nextNode())if(text.textContent.trim())texts.push(text);
    if(texts.reduce((n,t)=>n+t.textContent.trim().split(/\s+/).length,0)<12)return false;
    texts.forEach(t=>{const fragment=document.createDocumentFragment();for(const word of t.textContent.match(/\S+\s*|\s+/g)||[]){const span=document.createElement('span');span.setAttribute('data-fit-token','');span.textContent=word;fragment.append(span);}t.replaceWith(fragment);});
    node.setAttribute('data-fit-split','');return true;
  }
  function fitOne(id,host,nav,key,repair=true){
    if(!host||!nav||host.closest('[hidden]'))return;
    const record=componentPages[id];
    host.querySelectorAll('[data-fit-guard]').forEach(n=>n.remove());
    if(record.key!==key){record.key=key;record.index=0;}
    host.querySelectorAll('[data-fit-hidden]').forEach(n=>n.removeAttribute('data-fit-hidden'));
    nav.hidden=false;nav.style.visibility='hidden';nav.setAttribute('aria-hidden','true');nav.innerHTML=pagerMarkup(id,{index:0,pages:[[]]});
    const data=fitUnits(host);record.host=host;record.nav=nav;record.units=data.units;record.containers=data.containers;
    record.oversize=[];
    const all=record.units.map((_,i)=>i);
    host.setAttribute('data-component-paged','');
    nav.style.visibility='visible';nav.removeAttribute('aria-hidden');
    // Reserve exactly the same control row used by the final page while measuring.
    nav.innerHTML=pagerMarkup(id,{index:0,pages:[[],[]]});
    const pages=[];let page=[];
    for(const i of all){
      showFitUnits(record,[...page,i]);
      if(page.length&&!boundsFit(host).fits){pages.push(page);page=[i];showFitUnits(record,page);}else page.push(i);
      if(page.length===1&&!boundsFit(host).fits)record.oversize.push(i);
    }
    if(page.length)pages.push(page);
    if(repair&&record.oversize.map(i=>splitLongUnit(record.units[i])).some(Boolean)){fitOne(id,host,nav,key,false);return;}
    record.pages=pages.length?pages:[[]];record.index=Math.min(record.index,record.pages.length-1);
    showFitUnits(record,record.pages[record.index]);
    nav.innerHTML=pagerMarkup(id,record);nav.style.visibility=record.pages.length>1?'visible':'hidden';nav.toggleAttribute('aria-hidden',record.pages.length===1);if(record.pages.length===1)nav.setAttribute('aria-hidden','true');record.bounds=boundsFit(host);
  }
  function runFit(){
    fitQueued=false;if(fitRunning)return;fitRunning=true;
    try{
      fitOne('main',$('screen-content'),$('screen-components'),phase().id);
      fitOne('drawer',$('widget-page'),$('drawer-components'),activeWidget?panelKey()+':'+widgetStates[panelKey()]?.tab+':'+widgetStates[panelKey()]?.page:'closed');
      watchFitHosts();
      const verify=()=>{if(Object.values(componentPages).some(r=>r.host?.isConnected&&!r.host.closest('[hidden]')&&!r.oversize?.length&&!boundsFit(r.host).fits))scheduleFit();};
      requestAnimationFrame(verify);setTimeout(verify,80);
    }finally{fitRunning=false;}
  }
  function scheduleFit(){if(fitQueued)return;fitQueued=true;const flush=()=>{if(fitQueued)runFit();};requestAnimationFrame(()=>requestAnimationFrame(flush));setTimeout(flush,50);}
  function turnComponent(value){
    const [id,delta]=value.split(':'),record=componentPages[id];if(!record?.host||!record.pages.length)return;
    record.index=Math.max(0,Math.min(record.pages.length-1,record.index+Number(delta)));
    showFitUnits(record,record.pages[record.index]);record.nav.innerHTML=pagerMarkup(id,record);record.bounds=boundsFit(record.host);
    record.host.tabIndex=-1;record.host.focus({preventScroll:true});
    $('status').textContent=`Part ${record.index+1} of ${record.pages.length}. All parts belong to this ${id==='main'?'screen':'resource page'}.`;
  }
  function fitDebug(){return Object.fromEntries(Object.entries(componentPages).map(([id,r])=>[id,{key:r.key,page:r.index+1,pages:r.pages.length,units:r.units.length,coverageComplete:new Set(r.pages.flat()).size===r.units.length,missingUnits:r.units.map((_,i)=>i).filter(i=>!r.pages.flat().includes(i)),oversize:r.oversize||[],bounds:r.host?.isConnected?boundsFit(r.host):null}]));}
  window.addEventListener('resize',scheduleFit);
  document.fonts?.ready.then(scheduleFit);
  document.fonts?.addEventListener('loadingdone',scheduleFit);
  document.addEventListener('toggle',e=>{if(e.target.matches('details'))scheduleFit();},true);
  const fitObserver=new ResizeObserver(scheduleFit);
  let watchedFitHosts=[];
  function watchFitHosts(){const hosts=[$('screen-content'),$('widget-page')].filter(Boolean);if(hosts.length===watchedFitHosts.length&&hosts.every((n,i)=>n===watchedFitHosts[i]))return;watchedFitHosts.forEach(n=>fitObserver.unobserve(n));watchedFitHosts=hosts;hosts.forEach(n=>fitObserver.observe(n));}
  if($('lesson-main'))fitObserver.observe($('lesson-main'));

  /* ---------- timer (one lesson clock, set per screen) ---------- */
  let duration=5*60, remaining=duration, deadline=null, timerPhase=null;
  function timerPanel(p){
    if(!p.timer)return '';
    return `<aside class="mini-timer" aria-label="Task timer"><p class="bio-eyebrow">Time remaining</p><output id="exam-clock" aria-label="Time remaining" aria-live="off"></output><div class="bio-controls">${button('Start','timer','start')}${button('Pause','timer','pause')}${button('Reset','timer','reset')}${button('+1 min','timer','add')}</div><p class="exam-note" id="timer-status" role="status">Ready to start.</p></aside>`;
  }
  function prepareTimer(p){
    if(!p.timer||timerPhase===p.id)return;
    if(deadline!==null)return; /* never interrupt a running clock */
    timerPhase=p.id;duration=Math.round(p.timer*60);remaining=duration;
  }
  function tick(){
    if(deadline!==null){
      remaining=Math.max(0,Math.ceil((deadline-Date.now())/1000));
      if(remaining===0){deadline=null;$('status').textContent='The timer has finished. Continue as directed by your teacher.';}
    }
    if($('exam-clock')){
      $('exam-clock').textContent=`${Math.floor(remaining/60).toString().padStart(2,'0')}:${(remaining%60).toString().padStart(2,'0')}`;
      const message=remaining===0?'Timer finished. Follow your teacher’s direction.':deadline!==null?'Work on the task.':remaining===duration?'Ready to start.':'Timer paused.';
      if($('timer-status')&&$('timer-status').textContent!==message)$('timer-status').textContent=message;
    }
  }
  const withTimer=(p,body)=>p.timer?`<div class="timer-layout"><div class="timer-main">${body}</div>${timerPanel(p)}</div>`:body;

  /* ---------- 3D model panel ---------- */
  const stepBox=(p,s)=>`<div class="bio-step" id="model-step"><span class="step-number">STEP ${s.step+1} OF ${p.steps.length}</span><p>${p.steps[s.step]}</p></div>`;
  const stepControls=(p,s)=>`<div class="bio-controls step-controls">${button('← Back','step',-1,s.step===0?'disabled':'')}${button('Next step →','step',1,s.step===p.steps.length-1?'disabled':'')}</div>`;
  function modelSteps(p,s){return p.steps?stepBox(p,s)+stepControls(p,s):'';}
  function modelReadout(p,s){const M=Models[p.model];return M&&M.readout?M.readout(p,s):'';}
  function modelControls(p,s){const M=Models[p.model];return `${button(access.diagram?'Use 3D model':'Use 2D diagram','diagram','',`aria-pressed="${access.diagram}"`)}${M&&M.controls?M.controls(p,s):''}`;}
  function modelCaption(p,s){return s.view==='stoma'?'Pore and guard cells, surface view. Schematic.':s.view==='whole'?'Whole leaf: lamina and veins. Schematic.':p.caption;}
  function refreshModelPanel(keepFocus=true){
    const p=phase(),s=state();
    if(p.type!=='model3d')return;
    const cameraOpen=Boolean($('model-controls')?.querySelector('.model-camera')?.open);
    const active=document.activeElement, key=active&&active.closest('#model-controls')?(active.dataset.value!==undefined?`[data-action="${active.dataset.action}"][data-value="${CSS.escape(active.dataset.value)}"]`:active.dataset.modelKey?`[data-model-key="${active.dataset.modelKey}"]`:null):null;
    const fb=document.querySelector('#model-view:not(.is-live) .model-fallback');if(fb&&p.fallback)fb.innerHTML=BioDiagrams.render(p.fallback,s);
    if($('model-readout'))$('model-readout').innerHTML=modelReadout(p,s);
    if($('model-controls')&&!(active&&active.matches&&active.matches('input[type="range"]')&&active.closest('#model-controls')))$('model-controls').innerHTML=modelControls(p,s);
    if($('model-controls')?.querySelector('.model-camera'))$('model-controls').querySelector('.model-camera').open=cameraOpen;
    const camera=$('model-controls')?.querySelector('.model-camera');if(camera)camera.hidden=!document.querySelector('#model-view.is-live canvas');
    if($('model-caption'))$('model-caption').textContent=modelCaption(p,s);
    window.LeafDiagramAccess?.prepare($('screen-content'));
    if(keepFocus&&key)document.querySelector('#model-controls '+key)?.focus({preventScroll:true});
    runFit();document.fonts?.ready.then(runFit);
  }
  function parseValue(v){if(v==='true')return true;if(v==='false')return false;if(/^-?\d+(\.\d+)?$/.test(v))return Number(v);return v;}

  function content(p) {
    const s=state();
    if(p.type==='title')return `<div class="title-layout"><p class="screen-kicker">Year 10 Triple Biology · ${esc(lesson.unit)} · Lesson ${lesson.unitLesson}</p><h1 class="screen-heading" tabindex="-1">${lesson.title}</h1><p class="title-question">${lesson.question}</p><div class="title-path">${lesson.path.map(x=>`<span>${x}</span>`).join('')}</div></div>`;
    const meta=[p.mins?`<span class="meta-time">⏱ ${p.mins} min</span>`:'',p.optional?`<span class="meta-optional">If time</span>`:''].join('');
    const heading=`<p class="bio-eyebrow">${p.label||p.family}${meta}</p><h1 class="screen-heading" tabindex="-1">${p.title}</h1>${p.lead?`<p class="screen-lead">${p.lead}</p>`:''}${criteria(p)}`;
    if(p.type==='outcome')return `${heading}<ol class="outcome-list">${lesson.outcomes.map(o=>`<li><div><strong>${o[0]}</strong><span class="spec-ref">${esc(lesson.spec||'Pearson 4XBI1')} · ${o[1]}</span></div></li>`).join('')}</ol>${lesson.specificationPoints?`<details class="specification-detail"><summary>Specification points: ${lesson.specificationPoints.map(x=>esc(x.code)).join(' · ')}</summary><ul>${lesson.specificationPoints.map(x=>`<li><b>${esc(x.code)}</b> ${esc(x.text)}</li>`).join('')}</ul></details>`:''}${task(p)}`;
    if(p.type==='model3d'){
      const M=Models[p.model]||{};
      return `${heading}<div class="bio-layout model3d-layout"><div class="model-col"><figure class="bio-figure" data-fit-persistent><div class="model-view" id="model-view" data-model="${esc(p.model)}"><div class="model-fallback" tabindex="0" role="region" aria-label="Static scientific diagram">${p.fallback?BioDiagrams.render(p.fallback,s):''}</div></div><figcaption id="model-caption">${modelCaption(p,s)||M.caption||'Interactive schematic model. Drag or use arrow keys to rotate. Colours and sizes are illustrative.'}</figcaption></figure>${task(p)}</div><div class="bio-copy model-panel">${modelSteps(p,s)}<div class="model-readout" id="model-readout" aria-live="polite">${modelReadout(p,s)}</div><div class="bio-controls model-controls" id="model-controls">${modelControls(p,s)}</div></div></div>`;
    }
    if(p.type==='model')return `${heading}<div class="bio-layout">${figure(p.diagram,p.caption,p.secondaryDiagram)}<div><div class="bio-step"><span class="step-number">STEP ${s.step+1} OF ${p.steps.length}</span><p>${p.steps[s.step]}</p></div><div class="bio-controls">${button('← Back','step',-1,s.step===0?'disabled':'')}${button('Next step →','step',1,s.step===p.steps.length-1?'disabled':'')}</div>${ladder(p)}${safety(p)}${task(p)}</div></div>`;
    if(p.type==='hinge')return `${heading}<div class="answer-grid">${p.options.map((opt,i)=>button(`<span class="answer-letter">${'ABCD'[i]}</span><span>${opt}</span>`,'choice',i,`class="answer-option" aria-pressed="${s.choice===i}"`)).join('')}</div><p class="bio-task">${p.task||'Choose one answer. Give the evidence that supports it.'}</p>${s.choice!==undefined?`<p class="exam-note">Selected: ${'ABCD'[s.choice]}. Explain your reasoning in your book or aloud.</p>`:''}`;
    if(p.type==='cases')return `${heading}${withTimer(p,`<div class="bio-cases">${p.cases.map(c=>`<div class="bio-case"><b>${c[0]}</b><p>${c[1]}</p></div>`).join('')}</div>${safety(p)}${task(p)}`)}`;
    if(p.type==='table'){
      const shown=p.reveal?s.step:p.rows.length;
      const rows=p.rows.map((r,i)=>`<tr${i<shown?'':' class="is-hidden-row"'}>${r.map((cell,j)=>j===0?`<th scope="row">${cell}</th>`:`<td>${i<shown?cell:'<span class="blank-cell" aria-label="Not yet revealed">…</span>'}</td>`).join('')}</tr>`).join('');
      const controls=p.reveal?`<div class="bio-controls">${button('← Hide row','reveal',-1,shown===0?'disabled':'')}${button('Reveal next row →','reveal',1,shown===p.rows.length?'disabled':'')}${button('Reveal all','reveal','all',shown===p.rows.length?'disabled':'')}</div>`:'';
      return `${heading}${withTimer(p,`<div class="table-wrap"><table class="science-table"><thead><tr>${p.columns.map(c=>`<th scope="col">${c}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div>${controls}${safety(p)}${task(p)}`)}`;
    }
    if(p.type==='quote')return `${heading}<blockquote class="bio-quote">${p.quote}</blockquote>${list(p.items)}${p.credit?`<p class="routine-credit">${p.credit}</p>`:''}${task(p)}`;
    const copy=`<div class="bio-copy">${p.text?`<p>${p.text}</p>`:''}${p.items?list(p.items):''}${p.formula?`<div class="bio-formula">${p.formula.map(x=>`<span>${x}</span>`).join('')}</div>`:''}${ladder(p)}${safety(p)}${task(p)}</div>`;
    return `${heading}${withTimer(p,p.diagram?`<div class="bio-layout">${copy}${figure(p.diagram,p.caption,p.secondaryDiagram)}</div>`:copy)}`;
  }

  function mountModel(){
    const p=phase();
    if(p.type!=='model3d')return;
    const M=Models[p.model];
    if(access.diagram||!M||!M.mount||!$('model-view'))return;
    try{
      instance=M.mount($('model-view'),state(),p,{refresh:()=>refreshModelPanel(true),announce:m=>{$('status').textContent=m;}});
    }catch(err){instance=null;if(window.console)console.error(err);}
  }
  function disposeModel(){try{instance&&instance.dispose&&instance.dispose();}catch(_){}instance=null;}

  function render(focusHeading=false) {
    disposeModel();
    const p=phase();
    prepareTimer(p);
    $('app').dataset.family=p.family;
    $('app').dataset.phase=p.id;
    document.querySelector('.topic').hidden=p.family==='Title';
    $('screen').className='screen '+(p.type==='title'?'':'bio-screen')+(p.type==='model3d'?' screen-model3d':'')+(p.type==='table'?' screen-table':'')+(p.type==='model'?' screen-steps':'');
    const review=LessonAnswers.has(p,lesson)?`<div class="review-access-row">${p.secure&&!state().reviewReady?button('Finish attempt, then review','finish-attempt','',`class="review-access"`):button('Model answer &amp; mark scheme','answers','',`class="review-access" aria-expanded="${activeWidget==='answers'&&!answerContext}" aria-controls="student-drawer"`)}</div>`:'';
    $('screen').innerHTML=review+`<div class="fit-content" id="screen-content">${content(p)}</div><nav class="component-pagination" id="screen-components" aria-label="Parts of this screen" hidden></nav>`;
    $('phase-position').textContent=`Screen ${index+1} of ${lesson.phases.length}`;
    $('phase-name').textContent=p.nav||p.title||lesson.title;
    $('next-context').innerHTML=`${index<lesson.phases.length-1?`Next: <strong>${esc(lesson.phases[index+1].nav||lesson.phases[index+1].title)}</strong>`:'Lesson complete'} ${button('⛶','fullscreen','',`class="nav-fullscreen" aria-label="Toggle fullscreen"`)}`;
    $('previous-screen').disabled=index===0;$('next-screen').disabled=index===lesson.phases.length-1;
    const widgets=p.secure?[]:p.family==='Learning outcome'?[names[0]]:['Input','Assess','Thinking'].includes(p.family)?names:[];
    if(activeWidget!=='answers'&&!widgets.some(w=>w[0]===activeWidget))activeWidget=null;
    $('student-tools').innerHTML=widgets.map(([id,label])=>button(label,'widget',id,`class="tool-control" aria-expanded="${id===activeWidget}" aria-controls="student-drawer"`)).join('');
    renderPanel();
    mountModel();
    if(p.type==='model3d')refreshModelPanel(false);
    window.LeafDiagramAccess?.prepare($('screen-content'));
    if(p.timer)tick();
    try{history.replaceState(null,'','#'+p.id);}catch(_){}
    if(focusHeading)$('screen').querySelector('h1')?.focus({preventScroll:true});
    runFit();document.fonts?.ready.then(runFit);
  }
  function go(id) {
    const target=typeof id==='number'?id:lesson.phases.findIndex(p=>p.id===id);
    if(target<0||target>=lesson.phases.length)return;
    index=target;answerContext=null;activeWidget=null;render(true);window.scrollTo({top:0,behavior:'instant'});
  }
  function panelKey(){return phase().id+':'+activeWidget+(activeWidget==='answers'&&answerContext?':'+answerContext.widget+':'+answerContext.tab+':'+answerContext.page:'');}
  function focusTrigger(id){document.querySelector(id==='answers'?'[data-action="answers"]':`[data-action="widget"][data-value="${id}"]`)?.focus();}
  function renderPanel(focus=false) {
    const drawer=$('student-drawer');
    $('lesson-main').classList.toggle('has-drawer',Boolean(activeWidget));
    document.querySelectorAll('[data-action="widget"]').forEach(b=>b.setAttribute('aria-expanded',String(b.dataset.value===activeWidget)));
    document.querySelector('[data-action="answers"]')?.setAttribute('aria-expanded',String(activeWidget==='answers'&&!answerContext));
    drawer.hidden=!activeWidget;
    if(!activeWidget){drawer.innerHTML='';runFit();document.fonts?.ready.then(runFit);return;}
    const panel=activeWidget==='answers'?LessonAnswers.panel(phase(),lesson,state(),answerContext):LessonWidgets.panel(activeWidget,phase(),lesson);
    const key=panelKey();
    const w=widgetStates[key]??(widgetStates[key]={tab:0,page:0});
    const tab=panel.tabs[w.tab]||panel.tabs[0];
    w.page=Math.min(w.page,tab.pages.length-1);const page=tab.pages[w.page];
    drawer.innerHTML=`<header class="drawer-head"><div><h2 id="drawer-title" tabindex="-1">${panel.title}</h2><p>${panel.subtitle}</p>${activeWidget==='answers'&&answerContext?button('← Return to task','answer-back','',`class="review-return"`):''}</div>${button('×','close','',`class="icon-control" aria-label="Close ${panel.title}"`)}</header><div class="drawer-tabs" role="tablist" aria-label="${panel.title} sections">${panel.tabs.map((t,i)=>button(t.label,'tab',i,`class="support-tab" role="tab" id="widget-tab-${i}" aria-selected="${i===w.tab}" aria-controls="widget-page" tabindex="${i===w.tab?0:-1}"`)).join('')}</div><div class="drawer-body" role="tabpanel" id="widget-page" aria-labelledby="widget-tab-${w.tab}"><article class="widget-page">${page.note?`<p class="widget-note">${page.note}</p>`:''}<h3>${page.heading}</h3>${page.quote?`<blockquote>${page.quote}</blockquote>`:''}${page.text?`<p>${page.text}</p>`:''}${page.diagram?`<figure class="widget-diagram" tabindex="0" aria-label="Support scientific diagram">${BioDiagrams.render(page.diagram,page.diagramState||{})}</figure>`:''}${page.html||''}${page.items?`<ul>${page.items.map(x=>`<li>${x}</li>`).join('')}</ul>`:''}${page.source?`<a class="widget-source" target="_blank" rel="noopener" href="${esc(page.source)}">${page.sourceLabel||'Read the source'} ↗</a>`:''}${page.action?button(page.action.label+' →','go',page.action.id,'class="widget-action"'):''}${page.href?`<a class="widget-action" href="${esc(page.href)}" target="_blank" rel="noopener">${page.linkLabel||'Open resource'} ↗</a>`:''}${activeWidget!=='answers'&&LessonAnswers.widget(activeWidget,phase(),lesson,w.tab,w.page)?button('Model answer &amp; mark scheme','widget-answer','',`class="widget-action review-widget" aria-controls="student-drawer"`):''}</article></div><nav class="widget-pagination" aria-label="Widget pages"><div class="widget-page-navigation">${button('←','page',-1,`aria-label="Previous widget page" ${w.page===0?'disabled':''}`)}<span>${w.page+1} / ${tab.pages.length}</span>${button('→','page',1,`aria-label="Next widget page" ${w.page===tab.pages.length-1?'disabled':''}`)}</div><div class="component-pagination" id="drawer-components" aria-label="Parts of this resource page" hidden></div></nav>`;
    window.LeafDiagramAccess?.prepare(drawer);
    if(focus)$('drawer-title').focus();
    runFit();document.fonts?.ready.then(runFit);
  }
  document.addEventListener('submit',e=>{e.preventDefault();});
  setInterval(tick,500);
  document.addEventListener('visibilitychange',()=>{if(instance&&instance.visibility)instance.visibility(!document.hidden);});
  $('previous-screen').addEventListener('click',()=>go(index-1));
  $('next-screen').addEventListener('click',()=>go(index+1));
  document.addEventListener('input',e=>{
    const el=e.target.closest('[data-model-key]');if(!el)return;
    const s=state();s[el.dataset.modelKey]=parseValue(el.value);
    const M=Models[phase().model];if(M&&M.onChange)M.onChange(el.dataset.modelKey,s,phase());
    if(instance&&instance.update)instance.update(s);
    refreshModelPanel(true);
  });
  document.addEventListener('click',async e=>{
    const b=e.target.closest('[data-action]');if(!b||b.disabled)return;
    const a=b.dataset.action,v=b.dataset.value,s=state();
    if(a==='component-page'){turnComponent(v);return;}
    if(a==='diagram'){access.diagram=!access.diagram;disposeModel();const view=$('model-view');if(view){view.classList.remove('is-live');view.querySelector('canvas')?.remove();}mountModel();refreshModelPanel(false);scheduleFit();return;}
    if(a==='widget'){answerContext=null;activeWidget=activeWidget===v?null:v;renderPanel(Boolean(activeWidget));if(!activeWidget)document.querySelector(`[data-action="widget"][data-value="${v}"]`)?.focus();}
    if(a==='close'){const old=activeWidget;activeWidget=null;answerContext=null;renderPanel();focusTrigger(old);}
    if(a==='tab'||a==='page'){const w=widgetStates[panelKey()];if(a==='tab'){w.tab=Number(v);w.page=0;}else w.page+=Number(v);renderPanel();if(a==='tab')document.getElementById('widget-tab-'+w.tab)?.focus();else {$('widget-page').tabIndex=-1;$('widget-page').focus();}}
    if(a==='answers'){const closing=activeWidget==='answers'&&!answerContext;answerContext=null;activeWidget=closing?null:'answers';renderPanel(!closing);if(closing)focusTrigger('answers');}
    if(a==='widget-answer'){const w=widgetStates[panelKey()];answerContext={widget:activeWidget,tab:w.tab,page:w.page};activeWidget='answers';renderPanel(true);}
    if(a==='answer-back'&&answerContext){activeWidget=answerContext.widget;answerContext=null;renderPanel();document.querySelector('[data-action="widget-answer"]')?.focus();}
    if(a==='go')go(v);
    if(a==='finish-attempt'){s.reviewReady=true;render();focusTrigger('answers');$('status').textContent='Your attempt is complete. Open the review when directed. Access tools remain available.';}
    if(a==='step'){
      const p=phase();s.step=Math.max(0,Math.min(p.steps.length-1,s.step+Number(v)));
      if(p.type==='model3d'){
        if(p.stepStates&&p.stepStates[s.step])Object.assign(s,clone(p.stepStates[s.step]));
        if(instance&&instance.update)instance.update(s);
        const stepHost=$('model-step');if(stepHost)stepHost.outerHTML=stepBox(p,s);
        const ctr=document.querySelector('.step-controls');if(ctr)ctr.outerHTML=stepControls(p,s);
        refreshModelPanel(false);
        if(activeWidget==='answers')renderPanel();
        $('model-step')?.setAttribute('tabindex','-1');$('model-step')?.focus({preventScroll:true});
      } else {render();const st=$('screen').querySelector('.bio-step');if(st){st.setAttribute('tabindex','-1');st.focus({preventScroll:true});}}
    }
    if(a==='reveal'){const p=phase();s.step=v==='all'?p.rows.length:Math.max(0,Math.min(p.rows.length,s.step+Number(v)));render();document.querySelector(`[data-action="reveal"][data-value="${v}"]:not([disabled])`)?.focus()||document.querySelector('[data-action="reveal"]:not([disabled])')?.focus();}
    if(a==='model'||a==='model-cmd'){
      const p=phase(),M=Models[p.model];
      if(a==='model'){const i=v.indexOf('=');const k=v.slice(0,i),val=parseValue(v.slice(i+1));s[k]=val;if(M&&M.onChange)M.onChange(k,s,p);}
      else{if(M&&M.command)M.command(v,s,p);if(instance&&instance.command)instance.command(v,s);}
      if(instance&&instance.update)instance.update(s);
      refreshModelPanel(true);
      if(activeWidget==='answers')renderPanel();
    }
    if(a==='choice'){s.choice=Number(v);render();document.querySelector(`[data-action="choice"][data-value="${v}"]`)?.focus();}
    if(a==='timer'){
      tick();
      if(v==='start'&&deadline===null&&remaining>0)deadline=Date.now()+remaining*1000;
      if(v==='pause')deadline=null;
      if(v==='reset'){deadline=null;remaining=duration;}
      if(v==='add'){remaining+=60;if(deadline!==null)deadline+=60000;}
      tick();
    }
    if(a==='fullscreen'){try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch(_){$('status').textContent='Fullscreen is unavailable in this viewer. Open the HTML in your browser.';}}
  });
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'&&activeWidget){e.preventDefault();const old=activeWidget;activeWidget=null;answerContext=null;renderPanel();focusTrigger(old);return;}
    if(e.target.closest('[role="tablist"]')&&['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();const w=widgetStates[panelKey()];const tabs=(activeWidget==='answers'?LessonAnswers.panel(phase(),lesson,state(),answerContext):LessonWidgets.panel(activeWidget,phase(),lesson)).tabs;const focused=Number(e.target.closest('[role="tab"]')?.dataset.value??w.tab);w.tab=(focused+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;w.page=0;renderPanel();document.getElementById('widget-tab-'+w.tab)?.focus();return;}
    /* Arrow keys belong to the focused control/reading region, never global lesson navigation. */
  });
  window.addEventListener('hashchange',()=>{const id=location.hash.slice(1);if(id&&id!==phase().id&&lesson.phases.some(p=>p.id===id))go(id);});
  window.LessonDebug={go,state:()=>state(),phase:()=>phase(),index:()=>index,fit:()=>fitDebug(),refit:()=>scheduleFit()};
  render();
})();
