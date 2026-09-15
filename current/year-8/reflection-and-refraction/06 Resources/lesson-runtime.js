/* Arcadia biology lesson renderer. Screen IDs are explicit; pupil answers stay in books. */
(() => {
  const lesson=window.LESSON;
  const $=id=>document.getElementById(id);
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const states={}, widgetStates={};
  let index=0, activeWidget=null, cell=null, answerContext=null;
  const initial=location.hash.slice(1);
  if(lesson.phases.some(p=>p.id===initial)) index=lesson.phases.findIndex(p=>p.id===initial);
  const state=()=>states[phase().id]??(states[phase().id]={step:0,focus:'nucleus',scenario:0,showNet:false});
  const phase=()=>lesson.phases[index];
  const names=[['resources','Resources'],['assessments','Assessments'],['adaptation','Adaptation'],['hot','HOT'],['ai','AI literacy'],['uae','UAE National Agenda']];
  const button=(label,action,value,attrs='')=>`<button type="button" data-action="${action}" data-value="${esc(value)}" ${attrs}>${label}</button>`;
  const list=items=>`<ul class="bio-list">${items.map(s=>`<li>${s}</li>`).join('')}</ul>`;
  const figure=(name,caption,secondary=false)=>`<figure class="bio-figure${secondary?' is-secondary':''}">${BioDiagrams.render(name,state())}<figcaption>${caption||'Schematic model. Colours and sizes are illustrative.'}</figcaption></figure>`;
  function content(p) {
    const s=state();
    if(p.type==='title')return `<div class="title-layout"><p class="screen-kicker">Year 8 Science · ${esc(lesson.unit)} · Lesson ${lesson.unitLesson}</p><h1 class="screen-heading" tabindex="-1">${lesson.title}</h1><p class="title-question">${lesson.question}</p><div class="title-path">${lesson.path.map(x=>`<span>${x}</span>`).join('')}</div></div>`;
    const heading=`<p class="bio-eyebrow">${p.label||p.family}</p><h1 class="screen-heading" tabindex="-1">${p.title}</h1>${p.lead?`<p class="screen-lead">${p.lead}</p>`:''}`;
    if(p.type==='outcome')return `${heading}<ol class="outcome-list">${lesson.outcomes.map(o=>`<li><div><strong>${o[0]}</strong><span class="spec-ref">Year 8 curriculum · ${o[1]}</span></div></li>`).join('')}</ol>`;
    if(p.type==='exam')return `${heading}<div class="exam-layout"><div><ul class="bio-list"><li>Work independently on the yellow sheet provided.</li><li>Follow the instructions on your paper.</li><li>Check your answers if you finish early.</li></ul><p class="bio-task">Use clear scientific words. Stop when directed.</p></div><div class="exam-timer"><p class="bio-eyebrow">Time remaining</p><output id="exam-clock" aria-label="Time remaining" aria-live="off"></output><form id="timer-settings" class="timer-settings"><label for="timer-minutes">Minutes</label><div class="bio-controls"><input id="timer-minutes" name="minutes" type="number" min="1" max="180" step="1" value="${duration/60}" required><button type="submit">Set time</button></div></form><div class="bio-controls">${button('Start','timer','start')}${button('Pause','timer','pause')}${button('Reset','timer','reset')}${button('+1 min','timer','add')}</div><p class="exam-note" id="timer-status" role="status">Ready to start.</p></div></div>`;
    if(p.type==='structures') {
      const entries=lesson.structures, selected=entries.find(e=>e.id===s.focus)||entries[0];
      return `${heading}<div class="bio-layout"><figure class="bio-figure"><div class="cell-view" id="cell-view"><div class="cell-fallback">${BioDiagrams.render('structures')}</div></div><figcaption>Cutaway animal cell · drag or focus the model and use arrow keys to rotate. Colours and sizes are illustrative.</figcaption></figure><div class="bio-copy"><p class="structure-name"><span class="focus-swatch" style="background:${selected.color}"></span>${selected.name}</p><p>${selected.text}</p><div class="bio-controls" aria-label="Explore cell structures">${entries.map(e=>button(esc(e.name),'structure',e.id,`aria-pressed="${e.id===s.focus}"`)).join('')}</div></div></div><p class="bio-task">${p.task}</p>`;
    }
    if(p.type==='eye')return `${heading}<iframe class="eye-embed" title="Rotatable labelled eye" src="06 Resources/eye-model.html?embed"></iframe><p class="bio-task">${p.task}</p>`;
    if(p.type==='table')return `${heading}<table class="science-table">${p.rows.map((r,i)=>`<tr>${r.map(c=>i===0?`<th>${c}</th>`:`<td>${c}</td>`).join('')}</tr>`).join('')}</table>${p.items?list(p.items):''}<p class="bio-task">${p.task||''}</p>`;
    if(p.type==='model')return `${heading}<div class="bio-layout">${p.diagram?figure(p.diagram,p.caption):''}<div><div class="bio-step"><span class="step-number">STEP ${s.step+1} OF ${p.steps.length}</span><p>${p.steps[s.step]}</p></div><div class="bio-controls">${button('← Back','step',-1,s.step===0?'disabled':'')}${button('Next step →','step',1,s.step===p.steps.length-1?'disabled':'')}</div></div></div>${p.task?`<p class="bio-task">${p.task}</p>`:''}`;
    if(p.type==='osmosis')return `${heading}<div class="bio-layout">${figure('osmosis','Water = blue circles; sucrose = gold squares. Counts illustrate particles; they do not measure concentration.')}<div class="bio-copy"><p>Inside stays at <strong>5% sucrose</strong>. Change the solution outside.</p><div class="bio-controls" aria-label="Concentration outside">${[0,15,5].map(v=>button(v+'% sucrose','scenario',v,`aria-pressed="${s.scenario===v}"`)).join('')}</div><p class="bio-task">Predict the net movement. Explain your choice before showing it.</p><div class="bio-controls">${button(s.showNet?'Hide net direction':'Show net direction','net','')}</div></div></div>`;
    if(p.type==='hinge')return `${heading}<div class="answer-grid">${p.options.map((opt,i)=>button(`<span class="answer-letter">${'ABCD'[i]}</span><span>${opt}</span>`,'choice',i,`class="answer-option" aria-pressed="${s.choice===i}"`)).join('')}</div><p class="bio-task">${p.task||'Choose one answer. Give the evidence that supports it.'}</p>${s.choice!==undefined?`<p class="exam-note">Selected: ${'ABCD'[s.choice]}. Explain your reasoning in your book or aloud.</p>`:''}`;
    if(p.type==='cases')return `${heading}<div class="bio-cases">${p.cases.map(c=>`<div class="bio-case"><b>${c[0]}</b><p>${c[1]}</p></div>`).join('')}</div>${p.task?`<p class="bio-task">${p.task}</p>`:''}`;
    if(p.type==='quote')return `${heading}<blockquote class="bio-quote">${p.quote}</blockquote>${list(p.items)}${p.credit?`<p class="routine-credit">${p.credit}</p>`:''}`;
    const copy=`<div class="bio-copy">${p.text?`<p>${p.text}</p>`:''}${p.items?list(p.items):''}${p.formula?`<div class="bio-formula">${p.formula.map(x=>`<span>${x}</span>`).join('')}</div>`:''}</div>`;
    return `${heading}${p.diagram?`<div class="bio-layout">${copy}${figure(p.diagram,p.caption,p.secondaryDiagram)}</div>`:copy}${p.task?`<p class="bio-task">${p.task}</p>`:''}`;
  }
  function render(focusHeading=false) {
    cell?.dispose();cell=null;
    const p=phase();
    $('app').dataset.family=p.family;
    document.querySelector('.topic').hidden=p.family==='Title';
    $('screen').className='screen '+(p.type==='title'?'':'bio-screen');
    const review=LessonAnswers.has(p,lesson)?`<div class="review-access-row">${button('Model answer &amp; mark scheme','answers','',`class="review-access" aria-expanded="${activeWidget==='answers'&&!answerContext}" aria-controls="student-drawer"`)}</div>`:'';
    const keepEye=p.type==='eye'&&$('screen').querySelector('.eye-embed');
    if(keepEye){$('screen').querySelector('.review-access-row').outerHTML=review;}else $('screen').innerHTML=review+content(p)+(p.resources?.length?`<div class="resource-links">${p.resources.map(r=>`<a href="${esc(r.href)}" target="_blank" rel="noopener">${r.label} ↗</a>`).join('')}</div>`:'');
    $('phase-position').textContent=`Screen ${index+1} of ${lesson.phases.length}`;
    $('phase-name').textContent=p.nav||p.title||lesson.title;
    $('next-context').innerHTML=`${index<lesson.phases.length-1?`Next: <strong>${esc(lesson.phases[index+1].nav||lesson.phases[index+1].title)}</strong>`:'Lesson complete'} ${button('⛶','fullscreen','',`class="nav-fullscreen" aria-label="Toggle fullscreen"`)}`;
    $('previous-screen').disabled=index===0;$('next-screen').disabled=index===lesson.phases.length-1;
    const widgets=p.secure?[]:p.family==='Learning outcome'?[names[0]]:['Input','Assess','Thinking'].includes(p.family)?names:[];
    if(activeWidget!=='answers'&&!widgets.some(w=>w[0]===activeWidget))activeWidget=null;
    $('student-tools').innerHTML=widgets.map(([id,label])=>button(label,'widget',id,`class="tool-control" aria-expanded="${id===activeWidget}" aria-controls="student-drawer"`)).join('');
    renderPanel();
    if(p.type==='structures')cell=CellModel.mount($('cell-view'),state());
    if(p.type==='exam')tick();
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
  let duration=22*60, remaining=duration, deadline=null;
  function tick(){
    if(deadline!==null){
      remaining=Math.max(0,Math.ceil((deadline-Date.now())/1000));
      if(remaining===0){deadline=null;$('status').textContent='Assessment time has ended. Put your pen down.';}
    }
    if($('exam-clock')){
      $('exam-clock').textContent=`${Math.floor(remaining/60).toString().padStart(2,'0')}:${(remaining%60).toString().padStart(2,'0')}`;
      const message=remaining===0?'Time is up. Put your pen down.':deadline!==null?'Work independently.':remaining===duration?'Ready to start.':'Timer paused.';
      if($('timer-status').textContent!==message)$('timer-status').textContent=message;
    }
  }
  document.addEventListener('submit',e=>{
    if(e.target.id!=='timer-settings')return;
    e.preventDefault();
    const input=$('timer-minutes');
    if(!input.reportValidity())return;
    duration=Number(input.value)*60;remaining=duration;deadline=null;
    $('status').textContent=`Timer set to ${input.value} minutes. Press Start when ready.`;
    tick();
  });
  setInterval(tick,500);
  $('previous-screen').addEventListener('click',()=>go(index-1));
  $('next-screen').addEventListener('click',()=>go(index+1));
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
    if(a==='step'){s.step=Math.max(0,Math.min(phase().steps.length-1,s.step+Number(v)));render();$('screen').querySelector('.bio-step').setAttribute('tabindex','-1');$('screen').querySelector('.bio-step').focus({preventScroll:true});}
    if(a==='structure'){s.focus=v;render();document.querySelector(`[data-action="structure"][data-value="${v}"]`)?.focus();}
    if(a==='scenario'){s.scenario=Number(v);s.showNet=false;render();document.querySelector(`[data-action="scenario"][data-value="${v}"]`)?.focus();}
    if(a==='net'){s.showNet=!s.showNet;render();document.querySelector('[data-action="net"]')?.focus();}
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
  if(phase().type==='outcome')activeWidget='resources';
  render();
})();
