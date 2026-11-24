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
/* Local Arcadia extensions for the linked lesson. Pupil work stays on paper. */
const station = window.StationSettings;
const stationComplete = id => Boolean(states[id]?.written || states[id]?.collected);
const stationTask = () => document.getElementById('task-' + phase().id);
const stationReviewAllowed = p => p.stationTask
  && (p.protected ? Boolean(state().collected) : Boolean(state().written));
const stationProtected = () => phase().protected && state().begun
  && !state().collected && !state().guidedExit;
const stationButton = (text, action, id, value = '', attrs = '') =>
  button(esc(text), action, value, `id="${id}" class="station-control" ${attrs}`);

function stationBlocked(p) {
  if (!p.stationTask) return null;
  const message = (title, body, action = '') =>
    `<h1 class="screen-heading" tabindex="-1">${esc(title)}</h1><p class="station-locked">${esc(body)}</p>${action}`;
  const pending = p.gates.find(id => !stationComplete(id));
  if (pending && !(p.id === station.independent && states[station.readiness]?.guidedExit)) {
    return message(p.nav, 'Complete the earlier work with your teacher before starting this task.',
      stationButton('Open the earlier task', 'go', 'open-earlier-task', pending));
  }
  if (p.id === station.readiness && !states[station.hinge]?.feedbackDone) {
    return message(p.nav, 'Show your first answer. Use the correction your teacher chooses before starting the new check.',
      stationButton('Return to the first answer', 'go', 'open-earlier-task', station.hinge));
  }
  if (p.id === station.independent && !states[station.readiness]?.release) {
    return message(p.nav, 'Your teacher will tell you whether to continue with help.',
      stationButton('Open the readiness check', 'go', 'open-earlier-task', station.readiness));
  }
  if (p.id === station.readiness && state().release === 'guided') {
    return message(p.nav, state().collected
      ? 'Your teacher checked your answer and asked you to continue with help.'
      : 'Continue with your teacher’s help. Your check is still pending.',
      stationButton('Continue with help', 'go', 'continue-guided', station.independent));
  }
  if (p.shortCheck && state().guidedExit) {
    return message(p.nav, 'Your teacher will check these answers later. Keep your written work for them.',
      stationButton('Open the final question', 'go', 'open-final', station.final));
  }
  if (p.protected && !state().begun) {
    return message(p.nav, 'Put away the examples and help. Keep your usual access arrangements and use a fresh space.',
      stationButton('Begin on your own', 'station-begin', 'station-begin'));
  }
  return null;
}

function stationStopSpeech() {
  window.speechSynthesis?.cancel();
}

function stationSpeak(elements) {
  if (!window.speechSynthesis) return;
  const readable = elements.filter(el => el && el.getClientRects().length && !el.closest('[hidden]'));
  const text = readable.map(el => [el.innerText.trim(), ...Array.from(el.querySelectorAll('img'),
    image => image.alt)].filter(Boolean).join(' ')).join(' ');
  if (text) {
    stationStopSpeech();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
  }
}

function stationMark(id, wording) {
  return `<label class="station-tick"><input type="checkbox" id="${id}" ${state()[id] ? 'checked' : ''}> ${esc(wording)}</label>`;
}

function stationDisplayControls() {
  const p = phase(), s = state();
  const task = stationTask();
  const review = document.querySelector('[data-action="answers"]');
  const reviewing = activeWidget === 'answers';
  const guiding = activeWidget === 'adaptation' && p.supportCards?.includes('S3');
  document.body.dataset.stationPhase = p.id;
  document.body.dataset.stationReview = String(reviewing);
  document.body.dataset.stationLarge = String(Boolean(s.large));
  $('station-review-evidence')?.remove();
  $('station-review-context')?.remove();
  $('student-tools').hidden = p.stationTask && (!task || p.protected || reviewing || guiding);
  $('student-tools').querySelectorAll('[data-value="ai"], [data-value="uae"]').forEach(control => {
    control.disabled = true;
  });
  if (!p.stationTask) {
    review?.closest('.review-access-row')?.remove();
    return;
  }
  if (review) {
    review.hidden = !task;
    review.disabled = !stationReviewAllowed(p);
  }
  if (!task) return;
  const controls = document.createElement('div');
  controls.className = 'station-actions';
  controls.append($('station-access-template').content.cloneNode(true));
  controls.firstElementChild.setAttribute('aria-pressed', String(Boolean(s.large)));
  controls.innerHTML += reviewing
    ? stationButton('Read review aloud', 'station-read-review', 'read-review-aloud')
    : stationButton('Read aloud', 'station-read', 'read-aloud');
  if (p.protected) {
    const label = p.id === station.final
      ? (reviewing ? 'Work collected' : 'My teacher has collected my work.')
      : (reviewing ? 'Teacher checked' : 'My teacher has checked my work.');
    controls.innerHTML += stationMark('collected', label);
  } else if (!reviewing) {
    controls.innerHTML += stationMark('written', p.acknowledgement || 'I have written or shown my first answer.');
  }
  (task.closest('.bio-copy') || task).before(controls);
  if (p.protected) {
    $('previous-screen').disabled = !s.collected || p.id === station.final;
    $('next-screen').disabled = p.id === station.final
      || (p.id === station.readiness ? !s.release : !s.collected);
  }
  if (p.id === station.hinge) $('next-screen').disabled = !s.feedbackDone;
  if (p.correction) $('next-screen').disabled = true;
  if (reviewing) return;

  if (p.id === station.hinge && s.written) {
    const corrections = station.corrections.map(({ id, label }) =>
      stationButton(label, 'go', 'choose-' + id, id)).join('');
    task.insertAdjacentHTML('beforeend', `<div class="station-links" id="hinge-feedback">${corrections}</div>`);
    controls.insertAdjacentHTML('beforeend', stationMark('feedbackDone', 'My teacher says I can try the new question.'));
  }
  if (p.correction) controls.insertAdjacentHTML('beforeend',
    stationButton('Return to the check decision', 'go', 'return-to-hinge', station.hinge));
  if (p.supportPhase && p.supportCards?.length) controls.insertAdjacentHTML('beforeend',
    stationButton('Open the support card', 'widget', 'support-card', 'adaptation'));

  if (p.id === station.readiness) {
    let paths = stationButton(s.collected ? 'Continue with my teacher’s help' : 'Continue with help before a teacher check',
      'station-guided', 'guided-route');
    if (s.collected) paths = stationButton('My teacher says I am ready', 'station-ready', 'ready-route') + paths;
    controls.insertAdjacentHTML('beforeend', `<div class="station-links" id="readiness-options">${paths}</div>`);
  }
  if (p.guidedStatus && states[station.readiness]?.release === 'guided') {
    task.insertAdjacentHTML('afterbegin', '<p class="station-status">Work with the help your teacher chooses. Write “with help” beside your work.</p>');
    if (p.supportCards?.length && !guiding) controls.insertAdjacentHTML('beforeend',
      stationButton('Open the help my teacher chooses', 'widget', 'guided-help', 'adaptation'));
  }
  if (p.shortCheck && !s.collected && !s.guidedExit) controls.insertAdjacentHTML('beforeend',
    stationButton('I wrote both fields. Continue before my teacher checks them', 'station-short-exit', 'progress-unchecked'));
  if (p.modelLinks && (!p.modelAfterAttempt || s.written)) {
    const links = p.modelLinks.map(({ label, path, newTab }) =>
      `<a class="station-control" href="${esc(path)}"${newTab ? ' target="_blank" rel="noopener"' : ''}>${esc(label)}</a>`
    ).join('');
    task.insertAdjacentHTML('beforeend', `<p class="station-links">${links}</p>`);
  }
}

function stationDrawDrawer(drawer, focus) {
  const p = phase(), s = state();
  if (!p.stationTask) return false;
  if (activeWidget === 'answers') {
    if (!stationReviewAllowed(p)) {
      activeWidget = null;
      drawer.hidden = true;
      $('lesson-main').classList.remove('has-drawer');
      return true;
    }
    const data = window.StationReviews[p.id];
    const active = s.reviewPart || 0;
    const page = data.parts[active];
    const pagination = data.parts.length < 2 ? '' :
      `<nav class="station-review-parts" aria-label="Review parts">${data.parts.map((_, index) =>
        stationButton(String(index + 1), 'station-part', 'review-part-' + index, String(index),
          `aria-label="Review part ${index + 1}" aria-pressed="${index === active}"`)).join('')}</nav>`;
    const standards = page.criteria.length ? `<h3>${data.marks == null ? 'Success criteria' : 'Mark scheme · ' + data.marks + ' marks'}</h3><ul id="exact-criteria">${page.criteria.map(item => `<li>${esc(item)}</li>`).join('')}</ul>` : '';
    drawer.innerHTML = `<header class="drawer-head"><h2 id="drawer-title" tabindex="-1">Model answer</h2>${button('×', 'close', '', 'class="icon-control" aria-label="Close review"')}</header>${pagination}<div id="exact-review" class="exact-review"><p id="exact-model">${esc(page.answer)}</p>${standards}</div>`;
    const records = stationTask()?.querySelector('.with-records .station-evidence');
    if (records && matchMedia('(min-width: 761px)').matches) {
      const table = records.querySelector('.station-table');
      const strip = document.createElement('div');
      strip.id = 'station-review-evidence';
      strip.className = 'station-task';
      strip.append(table);
      const context = document.createElement('div');
      context.id = 'station-review-context';
      context.className = 'station-task';
      context.append(records);
      $('lesson-main').append(context, strip);
    } else if (p.id === 'TEACH' && matchMedia('(min-width: 761px)').matches) {
      const photos = stationTask()?.querySelector('.station-photos');
      if (photos) {
        const media = document.createElement('div');
        media.id = 'station-review-media';
        media.className = 'station-task';
        media.append(photos);
        drawer.append(media);
      }
    }
    if (focus) $('drawer-title').focus({ preventScroll: true });
    return true;
  }
  if (activeWidget === 'adaptation' && p.supportCards?.length && (p.correction || p.supportPhase || s.written
    || states[station.readiness]?.release === 'guided')) {
    drawer.innerHTML = `<header class="drawer-head"><h2 id="drawer-title" tabindex="-1">Support</h2>${button('×', 'close', '', 'class="icon-control" aria-label="Close support"')}</header><div class="drawer-body station-support"></div>`;
    const content = $('station-support-template').content.cloneNode(true);
    drawer.querySelector('.station-support').append(content);
    const selected = s.cardChoice || (p.supportCards.length === 1 ? p.supportCards[0] : null);
    drawer.querySelectorAll('[data-code]').forEach(item => {
      item.hidden = !p.supportCards.includes(item.dataset.code)
        || item.dataset.sc === 'card' && item.dataset.code !== selected;
    });
    const read = drawer.querySelectorAll('[data-say]:not([hidden])');
    read.forEach(control => control.classList.add('station-control'));
    if (selected) drawer.querySelector('.sc-key').hidden = true;
    if (s.cardChoice && p.supportCards.length > 1) {
      drawer.querySelector('.station-support').insertAdjacentHTML('beforeend',
        stationButton('Choose another card', 'station-reselect', 'choose-another-card'));
    }
    drawer.querySelectorAll('[data-close-card]').forEach(control => {
      control.classList.add('station-control');
      control.textContent = p.supportCloseLabel || 'Close the card';
    });
    const table = stationTask()?.querySelector('.station-table');
    if (table && p.supportCards.includes('S3')) {
      table.hidden = true;
    } else if (table && matchMedia('(min-width: 761px)').matches) {
      const strip = document.createElement('div');
      strip.id = 'station-review-evidence';
      strip.className = 'station-task';
      strip.append(table);
      $('lesson-main').append(strip);
    }
    if (focus) $('drawer-title').focus({ preventScroll: true });
    return true;
  }
  if (activeWidget === 'adaptation' && p.optionalSupport && s.written) {
    drawer.innerHTML = `<header class="drawer-head"><h2 id="drawer-title" tabindex="-1">Improve your paper design</h2>${button('×', 'close', '', 'class="icon-control" aria-label="Close support"')}</header><div class="drawer-body">${stationButton('Open help for your first design', 'go', 'open-support', p.optionalSupport)}</div>`;
    if (focus) $('drawer-title').focus({ preventScroll: true });
    return true;
  }
  return false;
}

document.addEventListener('change', event => {
  const { id, checked } = event.target;
  if (!['written', 'collected', 'feedbackDone'].includes(id)) return;
  state()[id] = checked;
  if (!checked) {
    if (id === 'written' || id === 'collected') activeWidget = null;
    if (phase().id === station.readiness) state().release = null;
    if (phase().id === station.hinge && id === 'written') state().feedbackDone = false;
  }
  render();
  $(id)?.focus({ preventScroll: true });
});

document.addEventListener('click', event => {
  const key = event.target.closest('.station-support .sc-key li[data-code] a');
  if (key) {
    event.preventDefault();
    const code = key.closest('li').dataset.code;
    state().cardChoice = code;
    renderPanel();
    const heading = $('card-' + code)?.querySelector('h2');
    if (heading) { heading.tabIndex = -1; heading.focus(); }
    return;
  }
  const control = event.target.closest('button');
  if (!control || control.disabled) return;
  const { action } = control.dataset;
  const s = state();
  if (action === 'station-larger') {
    s.large = !s.large;
    document.body.dataset.stationLarge = String(s.large);
    control.setAttribute('aria-pressed', String(s.large));
  } else if (action === 'station-read') {
    stationSpeak([stationTask()]);
  } else if (action === 'station-read-review') {
    stationSpeak([stationTask(), $('station-review-context'), $('station-review-evidence'), $('station-review-media'), $('exact-review')]);
  } else if (action === 'station-part') {
    s.reviewPart = Number(control.dataset.value);
    renderPanel();
    $(control.id)?.focus({ preventScroll: true });
  } else if (action === 'station-begin') {
    s.begun = true;
    activeWidget = null;
    stationStopSpeech();
    render(true);
  } else if (action === 'station-ready' && s.collected) {
    s.release = 'ready';
    go(station.independent);
  } else if (action === 'station-guided') {
    s.release = 'guided';
    s.guidedExit = !s.collected;
    go(station.independent);
  } else if (action === 'station-short-exit') {
    s.written = true;
    s.guidedExit = true;
    go(station.final);
  } else if (action === 'station-reselect') {
    s.cardChoice = null;
    renderPanel();
    document.querySelector('.station-support .sc-key a')?.focus();
  } else if (control.dataset.say) {
    stationSpeak([$(control.dataset.say)]);
  } else if (control.dataset.closeCard) {
    activeWidget = null;
    stationStopSpeech();
    if (phase().supportCloseTask) go(phase().supportCloseTask);
    else render();
  }
});

  const list=items=>`<ul class="bio-list">${items.map(s=>`<li>${s}</li>`).join('')}</ul>`;
  const figure=(name,caption,secondary=false)=>`<figure class="bio-figure${secondary?' is-secondary':''}">${BioDiagrams.render(name,state())}<figcaption>${caption||'Schematic model. Colours and sizes are illustrative.'}</figcaption></figure>`;
  const doThis=p=>p.doThis&&p.doThis.length?`<div class="do-this"><span class="do-this-label">Do this</span><ol>${p.doThis.map(x=>`<li>${x}</li>`).join('')}</ol></div>`:'';
  const ladder=p=>p.ladder&&p.ladder.length?`<ol class="ladder" aria-label="Build your answer in layers">${p.ladder.map(([k,t])=>`<li><b>${k}</b><span>${t}</span></li>`).join('')}</ol>`:'';
  const safety=p=>p.safety?`<p class="safety-note"><b>Safety</b> ${p.safety}</p>`:'';

  /* Pinned success criteria: a tickable bar at the top of task screens (phase.sc lists the codes).
     Ticks are shared across the lesson so pupils can show progress; nothing is stored or sent. */
  const scTicks={};
  const scBar=p=>p.sc&&p.sc.length&&lesson.sc?`<div class="sc-bar" role="group" aria-label="Success criteria for this task"><span class="sc-bar__label">Success criteria</span>${p.sc.map(k=>{const c=lesson.sc[k];return c?`<button type="button" class="sc-chip" data-action="sc" data-value="${k}" aria-pressed="${!!scTicks[k]}"><span class="sc-box" aria-hidden="true">${scTicks[k]?'✓':''}</span><b>${c[0]}</b><span>${c[1]}</span></button>`:'';}).join('')}</div>`:'';
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
    if($('model-readout'))$('model-readout').innerHTML=modelReadout(p,s);
    if($('model-controls')&&!(active&&active.matches&&active.matches('input[type="range"]')&&active.closest('#model-controls')))$('model-controls').innerHTML=modelControls(p,s);
    if(keepFocus&&key)document.querySelector('#model-controls '+key)?.focus({preventScroll:true});
  }
  function parseValue(v){if(v==='true')return true;if(v==='false')return false;if(/^-?\d+(\.\d+)?$/.test(v))return Number(v);return v;}

  function content(p) {
    const blocked = stationBlocked(p);
    if (blocked) return blocked;
    const s=state();
    if(p.type==='title')return `<div class="title-layout"><p class="screen-kicker">Year 7 Science · ${esc(lesson.unit)}${lesson.unitLesson ? ` · Lesson ${lesson.unitLesson}` : ""}</p><h1 class="screen-heading" tabindex="-1">${lesson.title}</h1><p class="title-question">${lesson.question}</p><div class="title-path">${lesson.path.map(x=>`<span>${x}</span>`).join('')}</div></div>`;
    const meta=[p.mins?`<span class="meta-time">⏱ ${p.mins} min</span>`:'',p.optional?`<span class="meta-optional">If time</span>`:''].join('');
    const heading=`<p class="bio-eyebrow">${p.label||p.family}${meta}</p><h1 class="screen-heading" tabindex="-1">${p.title}</h1>${p.lead?`<p class="screen-lead">${p.lead}</p>`:''}`;
    if(p.type==='outcome')return `${heading}<ol class="outcome-list">${lesson.outcomes.map(o=>`<li><div><strong>${o[0]}</strong><span class="spec-ref">${esc(lesson.spec||'Pearson 4BI1')} · ${o[1]}</span></div></li>`).join('')}</ol>`;
    if(p.type==='model3d'){
      const M=Models[p.model]||{};
      return `${heading}<div class="bio-layout model3d-layout"><div class="model-col"><figure class="bio-figure"><div class="model-view" id="model-view" data-model="${esc(p.model)}"><div class="model-fallback">${p.fallback?BioDiagrams.render(p.fallback,s):''}</div></div><figcaption>${p.caption||M.caption||'Interactive schematic model. Drag or use arrow keys to rotate. Colours and sizes are illustrative.'}</figcaption></figure>${task(p)}</div><div class="bio-copy model-panel">${modelSteps(p,s)}<div class="model-readout" id="model-readout" aria-live="polite">${modelReadout(p,s)}</div><div class="bio-controls model-controls" id="model-controls">${modelControls(p,s)}</div></div></div>`;
    }
    if(p.type==='model')return `${heading}<div class="bio-layout">${figure(p.diagram,p.caption)}<div><div class="bio-step"><span class="step-number">STEP ${s.step+1} OF ${p.steps.length}</span><p>${p.steps[s.step]}</p></div><div class="bio-controls">${button('← Back','step',-1,s.step===0?'disabled':'')}${button('Next step →','step',1,s.step===p.steps.length-1?'disabled':'')}</div>${ladder(p)}</div></div>${task(p)}`;
    if(p.type==='hinge')return `${heading}<div class="answer-grid">${p.options.map((opt,i)=>button(`<span class="answer-letter">${'ABCD'[i]}</span><span>${opt}</span>`,'choice',i,`class="answer-option" aria-pressed="${s.choice===i}"`)).join('')}</div><p class="bio-task">${p.task||'Choose one answer. Give the evidence that supports it.'}</p>${s.choice!==undefined?`<p class="exam-note">Selected: ${'ABCD'[s.choice]}. Explain your reasoning in your book or aloud.</p>`:''}`;
    if(p.type==='cases')return `${heading}${withTimer(p,`<div class="bio-cases">${p.cases.map(c=>`<div class="bio-case"><b>${c[0]}</b><p>${c[1]}</p></div>`).join('')}</div>${safety(p)}${task(p)}`)}`;
    if(p.type==='table'){
      const shown=p.reveal?s.step:p.rows.length;
      const rows=p.rows.map((r,i)=>`<tr${i<shown?'':' class="is-hidden-row"'}>${r.map((cell,j)=>j===0?`<th scope="row">${cell}</th>`:`<td>${i<shown?cell:'<span class="blank-cell" aria-label="Not yet revealed">…</span>'}</td>`).join('')}</tr>`).join('');
      const controls=p.reveal?`<div class="bio-controls">${button('← Hide row','reveal',-1,shown===0?'disabled':'')}${button('Reveal next row →','reveal',1,shown===p.rows.length?'disabled':'')}${button('Reveal all','reveal','all',shown===p.rows.length?'disabled':'')}</div>`:'';
      return `${heading}${withTimer(p,`<div class="table-wrap"><table class="science-table"><thead><tr>${p.columns.map(c=>`<th scope="col">${c}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div>${controls}${safety(p)}${task(p)}`)}`;
    }
    if(p.type==='quote')return `${heading}<blockquote class="bio-quote">${p.quote}</blockquote>${list(p.items)}${p.credit?`<p class="routine-credit">${p.credit}</p>`:''}${task(p)}`;
    const copy=`<div class="bio-copy">${p.text?`<p>${p.text}</p>`:''}${p.html||''}${p.items?list(p.items):''}${p.formula?`<div class="bio-formula">${p.formula.map(x=>`<span>${x}</span>`).join('')}</div>`:''}${ladder(p)}${safety(p)}</div>`;
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
    $('screen').className='screen '+(p.type==='title'?'':'bio-screen')+(p.type==='model3d'?' screen-model3d':'')+(p.type==='table'?' screen-table':'');
    const review=LessonAnswers.has(p,lesson)?`<div class="review-access-row">${button('Model answer &amp; mark scheme','answers','',`class="review-access" aria-expanded="${activeWidget==='answers'&&!answerContext}" aria-controls="student-drawer"`)}</div>`:'';
    $('screen').innerHTML=review+scBar(p)+content(p)+(p.resources?.length?`<div class="resource-links">${p.resources.map(r=>`<a href="${esc(r.href)}" target="_blank" rel="noopener">${esc(r.label)} ↗</a>`).join('')}</div>`:'');
    $('phase-position').textContent=`Screen ${index+1} of ${lesson.phases.length}`;
    $('phase-name').textContent=p.nav||p.title||lesson.title;
    $('next-context').innerHTML=`${index<lesson.phases.length-1?`Next: <strong>${esc(lesson.phases[index+1].nav||lesson.phases[index+1].title)}</strong>`:'Lesson complete'} ${button('⛶','fullscreen','',`class="nav-fullscreen" aria-label="Toggle fullscreen"`)}`;
    $('previous-screen').disabled=index===0;$('next-screen').disabled=index===lesson.phases.length-1;
    const widgets=p.secure?[]:p.family==='Learning outcome'?[names[0]]:['Input','Assess','Thinking'].includes(p.family)?names:[];
    if(activeWidget!=='answers'&&!widgets.some(w=>w[0]===activeWidget))activeWidget=null;
    $('student-tools').innerHTML=widgets.map(([id,label])=>button(label,'widget',id,`class="tool-control" aria-expanded="${id===activeWidget}" aria-controls="student-drawer"`)).join('');
    stationDisplayControls();
    renderPanel();
    mountModel();
    if(p.timer)tick();
    try{history.replaceState(null,'','#'+p.id);}catch(_){}
    if(focusHeading)$('screen').querySelector('h1')?.focus({preventScroll:true});
  }
  function go(id) {
    if (stationProtected()) {
      try { history.replaceState(null, '', '#' + phase().id); } catch (_) {}
      return;
    }
    stationStopSpeech();
    if (typeof id === 'number' && id === index + 1 && phase().stationTask) {
      if (phase().id === station.hinge) {
        if (!state().written || !state().feedbackDone) return;
        id = station.readiness;
      } else if (phase().nextTask) id = phase().nextTask;
    }
    if (typeof id === 'number' && id === index - 1 && phase().previousTask) {
      id = phase().previousTask;
    }
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
    if (stationDrawDrawer(drawer, focus)) return;
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
    if(a==='sc'){scTicks[v]=!scTicks[v];b.setAttribute('aria-pressed',String(scTicks[v]));b.querySelector('.sc-box').textContent=scTicks[v]?'✓':'';}
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
