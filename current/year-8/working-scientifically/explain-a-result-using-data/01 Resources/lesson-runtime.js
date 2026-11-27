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
/* Lesson-specific workflow inside the local Arcadia frame. The flags track UI steps only. */
const skills = window.SkillsLesson;
const skillReviews = window.SkillsReviews;
const isHandset = document.body.dataset.device === 'true';
const protectedIds = new Set(['R1', 'R2', 'F1']);
const corrections = ['CQ', 'CD', 'CS', 'CY'];
const supports = ['SQ', 'SD', 'SS', 'SY'];
const chosenCorrections = new Set();
const chosenSupport = new Set();
let correctionsClosed = false;
let readiness = '';
let examMode = '';
let largeText = false;
let depthStarted = false;

const completed = id => Boolean(states[id]?.attempt);
const taskState = id => states[id] ?? (states[id] = {});
const skillButton = (id, label, operation, value = '', attributes = '') =>
  `<button type="button" class="skill-button" id="${id}" data-skill="${operation}" data-skill-value="${value}" ${attributes}>${esc(label)}</button>`;
const jump = (id, label) => skillButton('go-' + id, label, 'go', id);
const lock = (id, label, target, link) =>
  `<p id="wait-${id}" class="skill-notice">${esc(label)}</p>${jump(target, link)}`;

function skillsHead(title, range, id) {
  const larger = $('skills-access-template').innerHTML.replace('aria-pressed="false"', `aria-pressed="${largeText}"`);
  const layout = corrections.includes(id) ? ' skill-compact-phase' : id === 'start' ? ' skill-title-phase' : '';
  return `<header class="skill-head${layout}"><div class="skill-phase-heading"><h1 id="phase-title" class="screen-heading" tabindex="-1">${esc(title)}</h1><span class="skill-range">${esc(range)}</span></div>
    <div class="skill-tools">${larger}${skillButton('read-aloud', 'Read aloud', 'read', `task-${id}`)}</div></header>`;
}

function canShow(id) {
  if (id === 'R1') return completed('H1') && correctionsClosed;
  if (corrections.includes(id)) return completed('H1') && chosenCorrections.has(id);
  if (id === 'E1') return Boolean(readiness && examMode);
  if (id === 'X1') return completed('E1') && depthStarted;
  if (id === 'V1') return completed('E1') && Boolean(states.E1?.feedbackSeen);
  if (supports.includes(id)) return completed('E1') && chosenSupport.has(id);
  if (id === 'F1') return Boolean(states.R2?.collected);
  return skills.tasks[id].requires.every(completed);
}

function helpLinks(ids, prefix = 'go-') {
  return `<nav class="skill-choices" aria-label="Choose help">${ids.map(id =>
    skillButton(prefix + id, `Card ${id[1]} · ${skills.cardMeanings[id[1]]}`, 'go', id)).join('')}</nav>`;
}

function skillTaskActions(id, s) {
  if (activeWidget === 'answers') return '';
  let follow = '';
  if (id === 'D1' && s.attempt) follow = jump('OUTCOME', 'What you will learn');
  if (id === 'M1' && s.attempt) follow = jump('M2', 'Trace the energy transfer');
  if (id === 'M2' && s.attempt) follow = jump('G1', 'Try the guided comparison');
  if (id === 'G1' && s.attempt) follow = jump('H1', 'Show your choice');
  if (id === 'H1' && s.attempt) {
    const allChosenDone = [...chosenCorrections].every(completed);
    const correctionGroup = `<details class="skill-help" id="guided-help"><summary>Choose the help your teacher gives you</summary>${helpLinks(corrections)}</details>`;
    follow = correctionsClosed ? jump('R1', 'Go to the new readiness check') : correctionGroup +
      skillButton('confirm-corrections', 'My teacher says I am ready to try a new check', 'finish-corrections', '', allChosenDone ? '' : 'disabled');
  }
  if (corrections.includes(id) && s.attempt) follow = jump('H1', 'Return to the choice');
  if (id === 'E1' && s.attempt) {
    const choice = `<details class="skill-help" id="exam-help"><summary>Use a support card</summary>${helpLinks(supports)}</details>`;
    follow = choice + jump('V1', 'Review and improve my answer') + `<span class="skill-depth">${jump('X1', 'Try a deeper question')}</span>`;
  }
  if (id === 'X1') follow = jump('E1', 'Return to the bottle question');
  if (id === 'V1' && s.attempt) follow = jump('R2', 'Close help and go to the new check');
  return `<div class="skill-actions">${skillButton('attempt-' + id, s.attempt ? 'Attempt recorded' : id === 'V1' ? 'Revision done' : 'Attempt done', 'attempt', id, `aria-pressed="${Boolean(s.attempt)}" ${s.attempt ? 'disabled' : ''}`)}${follow}</div>`;
}

function protectedActions(id, s) {
  const checkedLabel = id === 'R1' ? 'My teacher checked my whole response' : id === 'R2' ? 'My teacher says the cup check is finished' : 'My teacher has collected my response';
  let choice = '';
  if (id === 'R1') {
    if (!s.ended) {
      choice = `<div class="skill-tools">${skillButton('ready-R1', 'Ready to work independently', 'readiness', 'ready', s.collected ? '' : 'hidden disabled')}
        ${skillButton('not-ready-R1', 'Keep using help', 'readiness', 'not-ready', s.collected ? '' : 'hidden disabled')}
        ${skillButton('unchecked-R1', 'Unchecked · continue with teacher', 'readiness', 'unchecked', s.collected ? 'hidden disabled' : '')}</div>`;
    } else {
      choice = `<p class="skill-notice" id="readiness-status">${readiness === 'ready' ? 'Checked and ready' : readiness === 'not-ready' ? 'Checked. Work with your teacher.' : 'Unchecked. Work with your teacher.'}</p>${jump('E1', 'Go to the bottle question')}`;
    }
  }
  if (id === 'R2' && s.collected) choice = jump('F1', 'Go to the final fresh check');
  if (id === 'F1' && s.collected) choice = jump('END', 'Finish the lesson');
  return `<div class="skill-actions"><label class="skill-checkbox"><input type="checkbox" id="collected-${id}" data-skill-collection="${id}" ${s.collected ? 'checked' : ''} ${id === 'R1' && s.ended && !s.collected ? 'disabled' : ''}> ${checkedLabel}</label>${activeWidget === 'answers' ? '' : choice}</div>`;
}

function skillsTask(p) {
  const id = p.id;
  const s = taskState(id);
  const task = skills.tasks[id];
  if (!canShow(id)) {
    if (id === 'R1') return lock(id, 'Show your choice and follow your teacher’s next step.', 'H1', 'Return to the choice');
    if (id === 'E1' && readiness) {
      const readyAction = readiness === 'ready' ? skillButton('independent-route', 'Work on the question on my own', 'exam-route', 'independent') : '';
      const guidedLabel = readiness === 'unchecked' ? 'Unchecked. Start with my teacher.' : 'Start with my teacher.';
      return `<p class="skill-notice" id="wait-E1">Choose the next step your teacher gave you.</p><div class="skill-actions">${readyAction}${skillButton('guided-route', guidedLabel, 'exam-route', 'guided')}</div>`;
    }
    if (id === 'E1') return lock(id, 'Show your readiness answer and find out what to do next.', 'R1', 'Go to the readiness check');
    if (id === 'X1' && completed('E1')) return `<p id="wait-X1" class="skill-notice">If there is time, talk through this extra question with your teacher.</p>${skillButton('begin-depth', 'Work through it with my teacher', 'begin-depth')}${jump('E1', 'Return to the bottle question')}`;
    if (id === 'V1') return lock(id, 'Read the feedback on your bottle answer before improving it.', 'E1', 'Return to the bottle question');
    if (id === 'F1') return lock(id, 'Finish the cup check before the final check.', 'R2', 'Return to the cup question');
    if (corrections.includes(id)) return lock(id, 'Show your choice and use the card your teacher gives you.', 'H1', 'Return to the choice');
    if (supports.includes(id)) return lock(id, 'Try the bottle question and choose a card for the part you found difficult.', 'E1', 'Return to the bottle question');
    const target = task.requires.find(dependency => !completed(dependency)) ?? 'D1';
    return lock(id, 'Finish the earlier task before opening this one.', target, 'Return to the earlier task');
  }
  if (protectedIds.has(id) && !s.begun) {
    return `<p class="skill-notice" id="wait-${id}">Close earlier answers, notes and support cards. Keep the access tools you usually use.</p>
      ${skillButton('begin-' + id, id === 'F1' ? 'Begin fresh check' : 'Begin new check', 'begin', id)}`;
  }
  const route = id === 'E1' ? `<p class="skill-route" id="exam-mode">${examMode === 'guided' ? (readiness === 'unchecked' ? 'Unchecked · teacher-guided work' : 'Teacher-guided work') : 'Independent work'}</p>`
    : id === 'X1' ? '<p class="skill-route" id="depth-mode">With your teacher</p>' : '';
  const marks = id === 'E1' ? '<p class="skill-mark">Original question · 3 marks</p>' : '';
  const assistance = supports.includes(id) && activeWidget !== 'answers' ? `<aside class="skill-card" id="active-card"></aside>` : '';
  const review = skillButton('open-' + id, 'Model answer & mark scheme', 'review', id,
    `aria-controls="student-drawer" aria-expanded="${activeWidget === 'answers'}" ${canReview(id) ? '' : 'disabled'}`);
  const actions = protectedIds.has(id) ? protectedActions(id, s) : skillTaskActions(id, s);
  const controls = `<div class="skill-workflow">${actions}<div class="skill-review-control">${review}</div></div>`;
  const question = `<div class="skill-activity">${route}${marks}${task.html}${controls}</div>`;
  return assistance ? `<div class="skill-support-grid">${question}${assistance}</div>` : question;
}

function skillsContent(p) {
  const start = p.id === 'start';
  const outcome = p.id === 'OUTCOME';
  const end = p.id === 'END';
  const range = start ? 'Year 8 Science · Skills' : skills.times[p.id] ?? 'Year 8 Science · Skills';
  const header = skillsHead(p.title, range, p.id);
  if (start) return header + `<section class="skill-intro" id="task-start"><p>Use results to say what changed and why.</p><p class="skill-caption">Write on your whiteboard or in your book. The screen keeps the questions.</p></section>${jump('D1', 'Start with a whiteboard')}${isHandset ? '' : '<p class="skill-caption"><a href="device.html">Open pupil view</a></p>'}`;
  if (outcome) {
    if (!completed('D1')) return header + lock(p.id, 'Try the whiteboard question first.', 'D1', 'Return to the first question');
    return header + `<section id="task-OUTCOME" class="skill-intro"><ol><li>Say which case changed more or less.</li><li>Use paired measurements with units.</li><li>Explain the result using a science idea.</li></ol></section><details class="skill-help" id="support-routine"><summary>How to use a support card</summary><div class="skill-card" id="skills-explainer"></div></details>${jump('M1', 'Compare two answers')}`;
  }
  if (end) {
    if (!states.F1?.collected) return header + lock('END', 'Show your final response to your teacher.', 'F1', 'Go to the fresh check');
    return header + '<p class="skill-notice" id="task-END">Keep your original and improved answers together in your book.</p>';
  }
  return header + skillsTask(p);
}

function skillsFrame() {
  const id = phase().id;
  const body = document.body;
  body.dataset.skillsLarge = String(largeText);
  body.dataset.readiness = readiness || 'pending';
  body.dataset.route = examMode || 'pending';
  body.dataset.activeCheck = String(isProtectedAttempt());
  body.dataset.skillsReview = String(activeWidget === 'answers');
  if (body.dataset.skillsTask !== id) $('screen').scrollTop = 0;
  body.dataset.skillsTask = id;
  $('student-tools').hidden = isProtectedAttempt();
  $('previous-screen').disabled = isProtectedAttempt() || id === 'start';
  const next = skillNext(id);
  $('next-screen').disabled = isProtectedAttempt() || !next;
  const nextPhase = lesson.phases.find(item => item.id === next);
  $('next-context').innerHTML = `${nextPhase ? `Next: <strong>${esc(nextPhase.title)}</strong>` : id === 'END' ? 'Lesson complete' : ''} ${button('⛶', 'fullscreen', '', 'class="nav-fullscreen" aria-label="Toggle fullscreen"')}`;
  const template = $('skills-support-template');
  const explainerHost = $('skills-explainer');
  if (explainerHost) {
    const explainer = template.content.querySelector('[data-sc="explainer"]').cloneNode(true);
    const body = explainer.querySelector('#sc-explainer-body');
    const [introduction, timing, how, steps, fairness, record] = body.children;
    const context = document.createElement('div');
    const instructions = document.createElement('div');
    const footer = document.createElement('div');
    footer.className = 'skill-explainer-footer';
    context.append(introduction, timing);
    instructions.append(how, steps);
    footer.append(fairness, record);
    body.replaceChildren(context, instructions, footer);
    explainerHost.append(explainer);
  }
  const host = $('active-card');
  if (!host) return;
  const clone = template.content.cloneNode(true);
  clone.querySelector('[data-sc="explainer"]').remove();
  const code = id[1];
  for (const card of clone.querySelectorAll('[data-sc="card"], .sc-key li')) if (card.dataset.code !== code) card.remove();
  const card = clone.querySelector('[data-sc="card"]');
  const guide = document.createElement('details');
  guide.id = 'skill-card-guide';
  guide.className = 'skill-card-guide';
  const guideLabel = document.createElement('summary');
  guideLabel.textContent = 'Card routine';
  const guideCopy = document.createElement('div');
  guideCopy.className = 'skill-guide-copy';
  const chooseCard = document.createElement('div');
  const finishCard = document.createElement('div');
  const note = card.querySelector('[data-part="not-answer"]');
  const recheck = card.querySelector('[data-part="recheck"]');
  const fades = card.querySelector('[data-part="fades"]');
  chooseCard.append(clone.querySelector('[data-sc="reminder-strip"]'), clone.querySelector('[data-sc="key"]'), note);
  finishCard.append(recheck, fades);
  guideCopy.append(chooseCard, finishCard);
  guide.append(guideLabel, guideCopy);
  card.append(guide);
  clone.querySelector('[data-retry-read]')?.remove();
  clone.querySelector('[data-retry-finish]')?.remove();
  const close = clone.querySelector('[data-close-card]');
  close.id = 'close-card';
  close.textContent = states.R2?.collected ? 'Return to my finished check' : completed('V1') ? 'Close card for the new check'
    : states.E1?.feedbackSeen ? 'Close card and revise' : 'Back to the bottle answer';
  if (states.R2?.collected) recheck.hidden = true;
  card.querySelector('[data-say]').textContent = 'Read help aloud';
  host.append(clone);
}

function isProtectedAttempt() {
  const id = phase().id;
  return protectedIds.has(id) && states[id]?.begun && (id === 'R1' ? !states[id].ended : !states[id].collected);
}

function canReview(id) {
  if (protectedIds.has(id)) return Boolean(states[id]?.collected);
  return completed(id) && (id !== 'G1' || completed('H1'));
}

const mainSequence = ['start','D1','OUTCOME','M1','M2','G1','H1','R1','E1','V1','R2','F1','END'];
function skillNext(id) {
  if (id === 'H1' && !correctionsClosed) return '';
  if (id === 'R1' && !states.R1?.ended) return '';
  if (id === 'E1' && !completed('E1')) return '';
  if (['D1','M1','M2','G1'].includes(id) && !completed(id)) return '';
  if (id === 'V1' && !completed('V1')) return '';
  if (['R2','F1'].includes(id) && !states[id]?.collected) return '';
  if (corrections.includes(id)) return completed(id) ? 'H1' : '';
  if (supports.includes(id)) return completed(id) ? 'V1' : '';
  if (id === 'X1') return 'E1';
  return mainSequence[mainSequence.indexOf(id) + 1];
}
function skillPrevious(id) {
  if (corrections.includes(id)) return 'H1';
  if (supports.includes(id) || id === 'X1') return 'E1';
  return mainSequence[mainSequence.indexOf(id) - 1];
}

function skillsDrawer(drawer, focus) {
  const id = phase().id;
  const data = skills.tasks[id];
  if (activeWidget === 'answers' && skillReviews[id]) {
    const review = skillReviews[id];
    drawer.innerHTML = `<header class="drawer-head"><h2 id="drawer-title" tabindex="-1">Model answer &amp; marks</h2><div class="skill-review-tools">
      ${skillButton('read-review', 'Read aloud', 'read', 'exact-review', 'aria-label="Read review aloud"')}${skillButton('close-review', 'Close', 'close-drawer')}</div></header><section id="exact-review" class="skill-review">
      <p id="exact-model">${esc(review.model)}</p><h3>${data.marks ? 'Mark points' : 'Success criteria'}</h3>
      <ul id="exact-criteria">${review.criteria.map(text => `<li>${esc(text)}</li>`).join('')}</ul></section>`;
    if (focus) skillsFocusDrawer();
    return true;
  }
  const heading = {resources:'Resources', assessments:'Assessments', adaptation:'Adaptation', hot:'Go further', ai:'AI literacy', uae:'UAE National Agenda'}[activeWidget];
  if (!heading) return false;
  const body = {
    resources: '<p>Record answers in your book or on your whiteboard.</p>' + (!isHandset ? '<a href="device.html">Open pupil view</a>' : ''),
    assessments: '<p>Show your readiness answer to your teacher before the original three-mark question.</p>' + (readiness ? skillButton('widget-go-E1', 'Open the original question', 'go', 'E1') : ''),
    adaptation: id === 'H1' && completed('H1') && !correctionsClosed ? helpLinks(corrections, 'widget-go-') : completed('E1') ? helpLinks(supports, 'widget-go-') : '<p>Make your own first attempt. Your teacher can help you choose a card once you have an answer to improve.</p>',
    hot: completed('E1') ? skillButton('widget-go-X1', 'Judge a change to the bottle test', 'go', 'X1') : '<p>Try the bottle comparison first.</p>',
    ai: '<p>Use your own reasoning in this skills lesson.</p>',
    uae: '<p>The bottle results model a pupil’s test outside a Dubai school.</p>',
  }[activeWidget];
  drawer.innerHTML = `<header class="drawer-head"><h2 id="drawer-title" tabindex="-1">${heading}</h2>${skillButton('close-widget', 'Close', 'close-drawer')}</header><div class="skill-review">${body}</div>`;
  if (focus) skillsFocusDrawer();
  return true;
}

function skillsFocusDrawer() {
  const heading = $('drawer-title');
  heading?.focus({preventScroll: true});
  if (isHandset) heading?.scrollIntoView({block: 'start', behavior: 'instant'});
}

function skillsFocusReviewOpener() {
  $('open-' + phase().id)?.focus({preventScroll: !isHandset});
}

function skillsRead(node) {
  if (!node || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const message = new SpeechSynthesisUtterance(node.innerText);
  message.lang = 'en-GB';
  window.speechSynthesis.speak(message);
}

document.addEventListener('change', event => {
  const id = event.target.dataset.skillCollection;
  if (!id || id !== phase().id || !taskState(id).begun) return;
  taskState(id).collected = event.target.checked;
  taskState(id).attempt = event.target.checked;
  if (!event.target.checked) {
    activeWidget = null;
    if (id === 'R1') {
      taskState(id).ended = false;
      readiness = '';
      examMode = '';
    }
  }
  render();
  $('collected-' + id)?.focus({preventScroll: true});
});

document.addEventListener('click', event => {
  const key = event.target.closest('#active-card .sc-key a');
  if (key) {
    event.preventDefault();
    const card = $('active-card').querySelector('[data-sc="card"]');
    card.tabIndex = -1;
    card.focus();
    return;
  }
  const el = event.target.closest('button');
  if (!el || el.disabled) return;
  const id = phase().id;
  if (el.closest('#active-card,#skills-explainer') && el.dataset.say) return skillsRead($(el.dataset.say));
  if (el.id === 'close-card') return go(completed('V1') ? 'R2' : states.E1?.feedbackSeen ? 'V1' : 'E1');
  const value = el.dataset.skillValue;
  const action = el.dataset.skill;
  if (!action) return;
  if (action === 'go') {
    if (corrections.includes(value) && completed('H1') && !correctionsClosed) chosenCorrections.add(value);
    if (supports.includes(value) && completed('E1')) chosenSupport.add(value);
    return go(value);
  }
  if (action === 'read') return skillsRead(value === 'task-OUTCOME' && $('support-routine')?.open ? $('sc-explainer-body') : $(value) ?? $('screen'));
  if (action === 'large') {
    largeText = !largeText;
    document.body.dataset.skillsLarge = String(largeText);
    el.setAttribute('aria-pressed', String(largeText));
    return;
  }
  if (action === 'begin-depth') depthStarted = true;
  if (action === 'attempt') taskState(id).attempt = true;
  if (action === 'finish-corrections') correctionsClosed = true;
  if (action === 'begin') {
    window.speechSynthesis?.cancel();
    activeWidget = null;
    taskState(id).begun = true;
  }
  if (action === 'review') {
    if (!canReview(id)) return;
    activeWidget = activeWidget === 'answers' ? null : 'answers';
    if (activeWidget === 'answers' && id === 'E1') taskState(id).feedbackSeen = true;
    render();
    if (activeWidget) skillsFocusDrawer();
    else skillsFocusReviewOpener();
    return;
  }
  if (action === 'close-drawer') {
    const review = activeWidget === 'answers';
    activeWidget = null;
    render();
    if (review) skillsFocusReviewOpener();
    return;
  }
  if (action === 'readiness') {
    if (value !== 'unchecked' && !taskState('R1').collected) return;
    if (value === 'unchecked' && taskState('R1').collected) return;
    readiness = value;
    examMode = '';
    taskState('R1').ended = true;
    return go('E1');
  }
  if (action === 'exam-route') {
    if (!readiness || (value === 'independent' && readiness !== 'ready')) return;
    examMode = value;
  }
  render();
  $(el.id)?.focus({preventScroll: true});
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
    return skillsContent(p);

    const s=state();
    if(p.type==='title')return `<div class="title-layout"><p class="screen-kicker">Year 8 Science · ${esc(lesson.unit)} · Lesson ${lesson.unitLesson}</p><h1 class="screen-heading" tabindex="-1">${lesson.title}</h1><p class="title-question">${lesson.question}</p><div class="title-path">${lesson.path.map(x=>`<span>${x}</span>`).join('')}</div></div>`;
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
    $('screen').innerHTML=content(p)+(p.resources?.length?`<div class="resource-links">${p.resources.map(r=>`<a href="${esc(r.href)}" target="_blank" rel="noopener">${esc(r.label)} ↗</a>`).join('')}</div>`:'');
    $('phase-position').textContent=`Screen ${index+1} of ${lesson.phases.length}`;
    $('phase-name').textContent=p.nav||p.title||lesson.title;
    $('next-context').innerHTML=`${index<lesson.phases.length-1?`Next: <strong>${esc(lesson.phases[index+1].nav||lesson.phases[index+1].title)}</strong>`:'Lesson complete'} ${button('⛶','fullscreen','',`class="nav-fullscreen" aria-label="Toggle fullscreen"`)}`;
    $('previous-screen').disabled=index===0;$('next-screen').disabled=index===lesson.phases.length-1;
    const widgets=p.secure?[]:p.family==='Learning outcome'?[names[0]]:['Input','Assess','Thinking'].includes(p.family)?names:[];
    if(activeWidget!=='answers'&&!widgets.some(w=>w[0]===activeWidget))activeWidget=null;
    $('student-tools').innerHTML=widgets.map(([id,label])=>button(label,'widget',id,`class="tool-control" aria-expanded="${id===activeWidget}" aria-controls="student-drawer"`)).join('');
    skillsFrame();
    renderPanel();
    mountModel();
    if(p.timer)tick();
    try{history.replaceState(null,'','#'+p.id);}catch(_){}
    if(focusHeading)$('screen').querySelector('h1')?.focus({preventScroll:true});
  }
  function go(id) {
    if (isProtectedAttempt()) { history.replaceState(null, '', '#' + phase().id); return; }
    if (typeof id === 'number') id = id > index ? skillNext(phase().id) : skillPrevious(phase().id);
    if (!id) return;
    window.speechSynthesis?.cancel();
    const target=typeof id==='number'?id:lesson.phases.findIndex(p=>p.id===id);
    if(target<0||target>=lesson.phases.length)return;
    index=target;answerContext=null;activeWidget=phase().type==='outcome'?'resources':null;render(true);
  }
  function panelKey(){return phase().id+':'+activeWidget+(activeWidget==='answers'&&answerContext?':'+answerContext.widget+':'+answerContext.tab+':'+answerContext.page:'');}
  function focusTrigger(id){if(id==='answers')return skillsFocusReviewOpener();document.querySelector(id==='answers'?'[data-action="answers"]':`[data-action="widget"][data-value="${id}"]`)?.focus({preventScroll:true});}
  function renderPanel(focus=false) {
    const drawer=$('student-drawer');
    $('lesson-main').classList.toggle('has-drawer',Boolean(activeWidget));
    drawer.hidden=!activeWidget;
    if(!activeWidget){drawer.innerHTML='';return;}
    if (skillsDrawer(drawer, focus)) return;
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
    if(!document.body.dataset.skillsTask&&e.target.closest('[role="tablist"]')&&['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();const w=widgetStates[panelKey()];const tabs=(activeWidget==='answers'?LessonAnswers.panel(phase(),lesson,state(),answerContext):LessonWidgets.panel(activeWidget,phase(),lesson)).tabs;w.tab=(w.tab+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;w.page=0;renderPanel();document.getElementById('widget-tab-'+w.tab)?.focus();return;}
    if(e.target.closest('button,a,canvas,input,select,textarea') && !e.target.closest('#previous-screen,#next-screen'))return;
    if(e.key==='ArrowRight'){e.preventDefault();go(index+1);}if(e.key==='ArrowLeft'){e.preventDefault();go(index-1);}
  });
  window.addEventListener('hashchange',()=>{const id=location.hash.slice(1);if(id&&id!==phase().id&&lesson.phases.some(p=>p.id===id))go(id);});
  window.LessonDebug={go,state:()=>state(),phase:()=>phase(),index:()=>index};
  if(phase().type==='outcome')activeWidget='resources';
  render();
})();
