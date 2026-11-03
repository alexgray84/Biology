/* Arcadia biology lesson renderer, extended for local Three.js models, reveal tables, timers and explicit pupil steps.
   Screen IDs are explicit; pupil answers stay in books. No responses are stored or transmitted. */
(() => {
  const lesson=window.LESSON;
  const Models=window.LessonModels||{};
  const $=id=>document.getElementById(id);
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const states={}, widgetStates={};
  let index=0, activeWidget=null, instance=null, answerContext=null;
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
  const figure=(name,caption,secondary=false)=>`<figure class="bio-figure${secondary?' is-secondary':''}">${BioDiagrams.render(name,state())}<figcaption>${caption||'Schematic model. Colours and sizes are illustrative.'}</figcaption></figure>`;
  const doThis=p=>p.doThis&&p.doThis.length?`<div class="do-this"><span class="do-this-label">Do this</span><ol>${p.doThis.map(x=>`<li>${x}</li>`).join('')}</ol></div>`:'';
  const ladder=p=>p.ladder&&p.ladder.length?`<ol class="ladder" aria-label="Build your answer in layers">${p.ladder.map(([k,t])=>`<li><b>${k}</b><span>${t}</span></li>`).join('')}</ol>`:'';
  const safety=p=>p.safety?`<p class="safety-note"><b>Safety</b> ${p.safety}</p>`:'';
  const task=p=>`${p.task?`<p class="bio-task">${p.task}</p>`:''}${doThis(p)}`;

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
      if(remaining===0){deadline=null;$('status').textContent='Time is up. Put your pen down.';}
    }
    if($('exam-clock')){
      $('exam-clock').textContent=`${Math.floor(remaining/60).toString().padStart(2,'0')}:${(remaining%60).toString().padStart(2,'0')}`;
      const message=remaining===0?'Time is up. Pens down.':deadline!==null?'Work on the task.':remaining===duration?'Ready to start.':'Timer paused.';
      if($('timer-status')&&$('timer-status').textContent!==message)$('timer-status').textContent=message;
    }
  }
  const withTimer=(p,body)=>p.timer?`<div class="timer-layout"><div class="timer-main">${body}</div>${timerPanel(p)}</div>`:body;

  /* ---------- 3D model panel ---------- */
  const stepBox=(p,s)=>`<div class="bio-step" id="model-step"><span class="step-number">STEP ${s.step+1} OF ${p.steps.length}</span><p>${p.steps[s.step]}</p></div>`;
  const stepControls=(p,s)=>`<div class="bio-controls step-controls">${button('← Back','step',-1,s.step===0?'disabled':'')}${button('Next step →','step',1,s.step===p.steps.length-1?'disabled':'')}</div>`;
  function modelSteps(p,s){return p.steps?stepBox(p,s)+stepControls(p,s):'';}
  function modelReadout(p,s){const M=Models[p.model];return M&&M.readout?M.readout(p,s):'';}
  function modelControls(p,s){const M=Models[p.model];return M&&M.controls?M.controls(p,s):'';}
  function refreshModelPanel(keepFocus=true){
    const p=phase(),s=state();
    if(p.type!=='model3d')return;
    const active=document.activeElement, key=active&&active.closest('#model-controls')?(active.dataset.value!==undefined?`[data-action="${active.dataset.action}"][data-value="${CSS.escape(active.dataset.value)}"]`:active.dataset.modelKey?`[data-model-key="${active.dataset.modelKey}"]`:null):null;
    const fb=document.querySelector('#model-view:not(.is-live) .model-fallback');if(fb&&p.fallback)fb.innerHTML=BioDiagrams.render(p.fallback,s);
    if($('model-readout'))$('model-readout').innerHTML=modelReadout(p,s);
    if($('model-controls')&&!(active&&active.matches&&active.matches('input[type="range"]')&&active.closest('#model-controls')))$('model-controls').innerHTML=modelControls(p,s);
    if(keepFocus&&key)document.querySelector('#model-controls '+key)?.focus({preventScroll:true});
  }
  function parseValue(v){if(v==='true')return true;if(v==='false')return false;if(/^-?\d+(\.\d+)?$/.test(v))return Number(v);return v;}

  function content(p) {
    const s=state();
    if(p.type==='title')return `<div class="title-layout"><p class="screen-kicker">Year 10 Triple Biology · ${esc(lesson.unit)} · Lesson ${lesson.unitLesson}</p><h1 class="screen-heading" tabindex="-1">${lesson.title}</h1><p class="title-question">${lesson.question}</p><div class="title-path">${lesson.path.map(x=>`<span>${x}</span>`).join('')}</div></div>`;
    const meta=[p.mins?`<span class="meta-time">⏱ ${p.mins} min</span>`:'',p.optional?`<span class="meta-optional">If time</span>`:''].join('');
    const heading=`<p class="bio-eyebrow">${p.label||p.family}${meta}</p><h1 class="screen-heading" tabindex="-1">${p.title}</h1>${p.lead?`<p class="screen-lead">${p.lead}</p>`:''}`;
    if(p.type==='outcome')return `${heading}<ol class="outcome-list">${lesson.outcomes.map(o=>`<li><div><strong>${o[0]}</strong><span class="spec-ref">${esc(lesson.spec||'Pearson 4BI1')} · ${o[1]}</span></div></li>`).join('')}</ol>`;
    if(p.type==='model3d'){
      const M=Models[p.model]||{};
      return `${heading}<div class="bio-layout model3d-layout"><div class="model-col"><figure class="bio-figure"><div class="model-view" id="model-view" data-model="${esc(p.model)}"><div class="model-fallback">${p.fallback?BioDiagrams.render(p.fallback,s):''}</div></div><figcaption>${p.caption||M.caption||'Interactive schematic model. Drag or use arrow keys to rotate. Colours and sizes are illustrative.'}</figcaption></figure>${task(p)}</div><div class="bio-copy model-panel">${modelSteps(p,s)}<div class="model-readout" id="model-readout" aria-live="polite">${modelReadout(p,s)}</div><div class="bio-controls model-controls" id="model-controls">${modelControls(p,s)}</div></div></div>`;
    }
    if(p.type==='model')return `${heading}<div class="bio-layout">${figure(p.diagram,p.caption,p.secondaryDiagram)}<div><div class="bio-step"><span class="step-number">STEP ${s.step+1} OF ${p.steps.length}</span><p>${p.steps[s.step]}</p></div><div class="bio-controls">${button('← Back','step',-1,s.step===0?'disabled':'')}${button('Next step →','step',1,s.step===p.steps.length-1?'disabled':'')}</div>${ladder(p)}${safety(p)}</div></div>${task(p)}`;
    if(p.type==='hinge')return `${heading}<div class="answer-grid">${p.options.map((opt,i)=>button(`<span class="answer-letter">${'ABCD'[i]}</span><span>${opt}</span>`,'choice',i,`class="answer-option" aria-pressed="${s.choice===i}"`)).join('')}</div><p class="bio-task">${p.task||'Choose one answer. Give the evidence that supports it.'}</p>${s.choice!==undefined?`<p class="exam-note">Selected: ${'ABCD'[s.choice]}. Explain your reasoning in your book or aloud.</p>`:''}`;
    if(p.type==='cases')return `${heading}${withTimer(p,`<div class="bio-cases">${p.cases.map(c=>`<div class="bio-case"><b>${c[0]}</b><p>${c[1]}</p></div>`).join('')}</div>${safety(p)}${task(p)}`)}`;
    if(p.type==='table'){
      const shown=p.reveal?s.step:p.rows.length;
      const rows=p.rows.map((r,i)=>`<tr${i<shown?'':' class="is-hidden-row"'}>${r.map((cell,j)=>j===0?`<th scope="row">${cell}</th>`:`<td>${i<shown?cell:'<span class="blank-cell" aria-label="Not yet revealed">…</span>'}</td>`).join('')}</tr>`).join('');
      const controls=p.reveal?`<div class="bio-controls">${button('← Hide row','reveal',-1,shown===0?'disabled':'')}${button('Reveal next row →','reveal',1,shown===p.rows.length?'disabled':'')}${button('Reveal all','reveal','all',shown===p.rows.length?'disabled':'')}</div>`:'';
      return `${heading}${withTimer(p,`<div class="table-wrap"><table class="science-table"><thead><tr>${p.columns.map(c=>`<th scope="col">${c}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div>${controls}${safety(p)}${task(p)}`)}`;
    }
    if(p.type==='quote')return `${heading}<blockquote class="bio-quote">${p.quote}</blockquote>${list(p.items)}${p.credit?`<p class="routine-credit">${p.credit}</p>`:''}${task(p)}`;
    const copy=`<div class="bio-copy">${p.text?`<p>${p.text}</p>`:''}${p.items?list(p.items):''}${p.formula?`<div class="bio-formula">${p.formula.map(x=>`<span>${x}</span>`).join('')}</div>`:''}${ladder(p)}${safety(p)}</div>`;
    return `${heading}${withTimer(p,`${p.diagram?`<div class="bio-layout">${copy}${figure(p.diagram,p.caption,p.secondaryDiagram)}</div>`:copy}${task(p)}`)}`;
  }

  function mountModel(){
    const p=phase();
    if(p.type!=='model3d')return;
    const M=Models[p.model];
    if(!M||!M.mount||!$('model-view'))return;
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
    document.querySelector('.topic').hidden=p.family==='Title';
    $('screen').className='screen '+(p.type==='title'?'':'bio-screen')+(p.type==='model3d'?' screen-model3d':'')+(p.type==='table'?' screen-table':'')+(p.type==='model'?' screen-steps':'');
    const review=LessonAnswers.has(p,lesson)?`<div class="review-access-row">${button('Model answer &amp; mark scheme','answers','',`class="review-access" aria-expanded="${activeWidget==='answers'&&!answerContext}" aria-controls="student-drawer"`)}</div>`:'';
    $('screen').innerHTML=review+content(p);
    $('phase-position').textContent=`Screen ${index+1} of ${lesson.phases.length}`;
    $('phase-name').textContent=p.nav||p.title||lesson.title;
    $('next-context').innerHTML=`${index<lesson.phases.length-1?`Next: <strong>${esc(lesson.phases[index+1].nav||lesson.phases[index+1].title)}</strong>`:'Lesson complete'} ${button('⛶','fullscreen','',`class="nav-fullscreen" aria-label="Toggle fullscreen"`)}`;
    $('previous-screen').disabled=index===0;$('next-screen').disabled=index===lesson.phases.length-1;
    const widgets=p.secure?[]:p.family==='Learning outcome'?[names[0]]:['Input','Assess','Thinking'].includes(p.family)?names:[];
    if(activeWidget!=='answers'&&!widgets.some(w=>w[0]===activeWidget))activeWidget=null;
    $('student-tools').innerHTML=widgets.map(([id,label])=>button(label,'widget',id,`class="tool-control" aria-expanded="${id===activeWidget}" aria-controls="student-drawer"`)).join('');
    renderPanel();
    mountModel();
    if(p.timer)tick();
    try{history.replaceState(null,'','#'+p.id);}catch(_){}
    if(focusHeading)$('screen').querySelector('h1')?.focus({preventScroll:true});
  }
  function go(id) {
    const target=typeof id==='number'?id:lesson.phases.findIndex(p=>p.id===id);
    if(target<0||target>=lesson.phases.length)return;
    index=target;answerContext=null;activeWidget=phase().type==='outcome'?'resources':null;render(true);
  }
  function panelKey(){return phase().id+':'+activeWidget+(activeWidget==='answers'&&answerContext?':'+answerContext.widget+':'+answerContext.tab+':'+answerContext.page:'');}
  function focusTrigger(id){document.querySelector(id==='answers'?'[data-action="answers"]':`[data-action="widget"][data-value="${id}"]`)?.focus({preventScroll:true});}
  function renderPanel(focus=false) {
    const drawer=$('student-drawer');
    $('lesson-main').classList.toggle('has-drawer',Boolean(activeWidget));
    drawer.hidden=!activeWidget;
    if(!activeWidget){drawer.innerHTML='';return;}
    const panel=activeWidget==='answers'?LessonAnswers.panel(phase(),lesson,state(),answerContext):LessonWidgets.panel(activeWidget,phase(),lesson);
    const key=panelKey();
    const w=widgetStates[key]??(widgetStates[key]={tab:0,page:0});
    const tab=panel.tabs[w.tab]||panel.tabs[0];
    w.page=Math.min(w.page,tab.pages.length-1);const page=tab.pages[w.page];
    drawer.innerHTML=`<header class="drawer-head"><div><h2 id="drawer-title" tabindex="-1">${panel.title}</h2><p>${panel.subtitle}</p>${activeWidget==='answers'&&answerContext?button('← Return to task','answer-back','',`class="review-return"`):''}</div>${button('×','close','',`class="icon-control" aria-label="Close ${panel.title}"`)}</header><div class="drawer-tabs" role="tablist" aria-label="${panel.title} sections">${panel.tabs.map((t,i)=>button(t.label,'tab',i,`class="support-tab" role="tab" id="widget-tab-${i}" aria-selected="${i===w.tab}" aria-controls="widget-page" tabindex="${i===w.tab?0:-1}"`)).join('')}</div><div class="drawer-body" role="tabpanel" id="widget-page" aria-labelledby="widget-tab-${w.tab}"><article class="widget-page">${page.note?`<p class="widget-note">${page.note}</p>`:''}<h3>${page.heading}</h3>${page.quote?`<blockquote>${page.quote}</blockquote>`:''}${page.text?`<p>${page.text}</p>`:''}${page.items?`<ul>${page.items.map(x=>`<li>${x}</li>`).join('')}</ul>`:''}${page.source?`<a class="widget-source" target="_blank" rel="noopener" href="${esc(page.source)}">${page.sourceLabel||'Read the source'} ↗</a>`:''}${page.action?button(page.action.label+' →','go',page.action.id,'class="widget-action"'):''}${page.href?`<a class="widget-action" href="${esc(page.href)}" target="_blank" rel="noopener">${page.linkLabel||'Open resource'} ↗</a>`:''}${activeWidget!=='answers'&&LessonAnswers.widget(activeWidget,phase(),lesson,w.tab,w.page)?button('Model answer &amp; mark scheme','widget-answer','',`class="widget-action review-widget" aria-controls="student-drawer"`):''}</article></div><nav class="widget-pagination" aria-label="Widget pages">${button('←','page',-1,`aria-label="Previous widget page" ${w.page===0?'disabled':''}`)}<span>${w.page+1} / ${tab.pages.length}</span>${button('→','page',1,`aria-label="Next widget page" ${w.page===tab.pages.length-1?'disabled':''}`)}</nav>`;
    if(focus)$('drawer-title').focus({preventScroll:true});
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
    if(a==='widget'){answerContext=null;activeWidget=activeWidget===v?null:v;render();if(activeWidget)$('drawer-title').focus({preventScroll:true});else document.querySelector(`[data-action="widget"][data-value="${v}"]`)?.focus();}
    if(a==='close'){const old=activeWidget;activeWidget=null;answerContext=null;render();focusTrigger(old);}
    if(a==='tab'||a==='page'){const w=widgetStates[panelKey()];if(a==='tab'){w.tab=Number(v);w.page=0;}else w.page+=Number(v);renderPanel();if(a==='tab')document.getElementById('widget-tab-'+w.tab)?.focus();else {$('widget-page').tabIndex=-1;$('widget-page').focus({preventScroll:true});}}
    if(a==='answers'){const closing=activeWidget==='answers'&&!answerContext;answerContext=null;activeWidget=closing?null:'answers';render();if(closing)focusTrigger('answers');else $('drawer-title').focus({preventScroll:true});}
    if(a==='widget-answer'){const w=widgetStates[panelKey()];answerContext={widget:activeWidget,tab:w.tab,page:w.page};activeWidget='answers';render();$('drawer-title').focus({preventScroll:true});}
    if(a==='answer-back'&&answerContext){activeWidget=answerContext.widget;answerContext=null;render();document.querySelector('[data-action="widget-answer"]')?.focus({preventScroll:true});}
    if(a==='go')go(v);
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
    if(e.key==='Escape'&&activeWidget){e.preventDefault();const old=activeWidget;activeWidget=null;answerContext=null;render();focusTrigger(old);return;}
    if(e.target.closest('[role="tablist"]')&&['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();const w=widgetStates[panelKey()];const tabs=(activeWidget==='answers'?LessonAnswers.panel(phase(),lesson,state(),answerContext):LessonWidgets.panel(activeWidget,phase(),lesson)).tabs;w.tab=(w.tab+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;w.page=0;renderPanel();document.getElementById('widget-tab-'+w.tab)?.focus();return;}
    if(e.target.closest('button,a,canvas,input,select,textarea'))return;
    if(e.key==='ArrowRight'){e.preventDefault();go(index+1);}if(e.key==='ArrowLeft'){e.preventDefault();go(index-1);}
  });
  window.addEventListener('hashchange',()=>{const id=location.hash.slice(1);if(id&&id!==phase().id&&lesson.phases.some(p=>p.id===id))go(id);});
  window.LessonDebug={go,state:()=>state(),phase:()=>phase(),index:()=>index};
  if(phase().type==='outcome')activeWidget='resources';
  render();
})();
