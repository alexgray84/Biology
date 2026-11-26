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
/* Rock lesson interaction inside the existing Arcadia projector and device frame. */
const rock = window.RockLesson;
const rockReviews = window.RockReviews;
const rockDevice = document.body.dataset.device === 'true';
const rockProgress = new Set(['start']);
const rockWork = new Map();
let rockRoute = '';
let rockCorrection = '';
let rockCard = '';
let rockLarge = false;
let rockReview = 0;
let rockDecisionOpen = false;
let rockView = '';
let rockExamProjected = false;

const rockEsc = value => String(value).replace(/[&<>"']/g, letter => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[letter]));
const rockBtn = (id, label, attributes = '') => `<button class="rock-button" type="button" id="rock-${id}" ${attributes}>${rockEsc(label)}</button>`;
const rockId = () => phase().id === 'H1' && rockCorrection ? rockCorrection : phase().id;
const rockState = id => {
  if (!rockWork.has(id)) rockWork.set(id, {begun:false, ended:false, attempted:false, read:false, pairedVerified:false, returned:false, reviewOpened:false, assisted:false, revisionChecked:false});
  return rockWork.get(id);
};
const rockProtected = id => id === rock.readyTask || id === 'F1';
const rockReadiness = () => rockState(rock.readyTask);
const rockCanCheckLate = () => ['unchecked','checked-pending'].includes(rockRoute) && !rockState('E1').assisted && !rockState('E1').attempted;
const rockCanReleaseOriginal = () => !rockRoute && rockReadiness().read && rockReadiness().pairedVerified && !rockState('E1').assisted;
const rockCanConfirmPair = id => rockReadiness().read && !rockReadiness().pairedVerified && !rockState('E1').assisted &&
  (id === rock.readyTask && !rockRoute || id === 'E1' && rockRoute === 'checked-pending' && rockCanCheckLate());
const rockClosedRoute = () => rockReadiness().read ? 'checked-closed' : 'unchecked-closed';
const rockExamActive = id => id === 'E1' && rockRoute === 'ready' && rockReached(id) && !rockState(id).attempted;
const rockExamPending = id => id === 'E1' && (rockCanCheckLate() || !rockDevice && !rockExamProjected);
const rockRecallActive = id => id === 'M2R' && rockReached(id) && !rockState(id).attempted;
const rockActive = id => rockExamActive(id) || rockRecallActive(id) || rockProtected(id) && rockState(id).begun && !rockState(id).ended;
const rockReached = id => rockProgress.has(id);
const rockReviewAllowed = id => rockProtected(id) ? rockState(id).read : rockState(id).attempted;
const rockCloseHelp = () => {rockCard = ''; window.speechSynthesis?.cancel();};

function rockRecordContentHelp() {
  const original = rockState('E1');
  if (!rockReadiness().ended || original.attempted) return;
  original.assisted = true;
  if (['unchecked','checked-pending','ready'].includes(rockRoute)) rockRoute = rockClosedRoute();
}

function rockNavigate(destination) {
  if ($('rock-photo-zoom')?.open) return true;
  const targetIndex = typeof destination === 'number' ? destination : lesson.phases.findIndex(item => item.id === destination);
  const target = lesson.phases[targetIndex]?.id;
  if (!target) return true;
  const current = rockId();
  if (rockActive(current) || current === 'F1' && rockState(current).begun) return true;
  if (rockCorrection && targetIndex > index && !rockState(current).attempted) return true;
  if (targetIndex === index + 1 && rockMayAdvance(current)) rockProgress.add(target);
  if (!rockReached(target)) return true;
  if (target === 'M1' || target === 'M2') rockRecordContentHelp();
  rockCorrection = '';
  rockView = '';
  rockDecisionOpen = false;
  rockCloseHelp();
  return false;
}

function rockMayAdvance(id) {
  if (!rockReached(phase().id)) return false;
  if (id === 'M2R') return rockState(id).returned;
  if (id === rock.readyTask) return Boolean(rockRoute);
  if (id === 'E1') return rockState(id).attempted && rockState(id).returned;
  if (id === 'G1' || id === 'G1V') return rockState(id).attempted && (rockDevice ? rockState(id).returned : rockState(id).reviewOpened);
  if (id === 'V1' || id === 'H1' || rock.cardKeys[id]) return rockState(id).attempted;
  return true;
}

function rockToolbar(id, protectedActive) {
  const status = rockState(id);
  const isCheck = id === rock.readyTask;
  const menu = [];
  if (!rockDevice && rock.tasks[id] && !rockProtected(id) && id !== 'M2R' && !rockExamPending(id)) {
    const label = id === 'V1' ? 'Confirm written repairs checked' : 'Record completed attempt';
    menu.push(rockBtn('mark', status.attempted ? 'Attempt recorded' : label, `aria-pressed="${status.attempted}"`));
  }
  if (!rockProtected(id) && status.attempted && rockReviews) {
    menu.push(rockBtn('review-open', 'Model answer & mark scheme'));
    rockReviews[id].slice(1).forEach((_, index) => menu.push(rockBtn('review-part-' + (index + 1), 'Review part ' + (index + 2))));
  }
  if (id === 'E1' && status.attempted && (rockDevice || status.reviewOpened)) {
    menu.push(rockBtn('returned', status.returned ? 'Feedback recorded' : 'Feedback has been given', `aria-pressed="${status.returned}"`));
  }
  if (id === 'H1' && status.attempted || rock.cardKeys[id]) {
    Object.entries(rock.corrections).forEach(([choice, task]) => {
      if (task !== id) {
        const label = rockReadiness().ended ? 'Reopen card ' + rock.cardKeys[task] : choice === 'names' ? 'Revisit the three names' : 'Revisit option ' + choice;
        menu.push(rockBtn('correction-' + task, label));
      }
    });
    if (!rockDevice && id === 'H1' && !rockReadiness().ended) menu.push(rockBtn('no-correction', 'Go to the new check'));
  }
  if (rockCanConfirmPair(id)) {
    menu.push('<p class="rock-pair-evidence" id="rock-pair-evidence">Check that the original H1 was correct or its matched repair was verified before R1. The unchanged, unaided R1 must meet every criterion.</p>');
    menu.push(rockBtn('verify-pair', rockDevice ? 'My teacher verified both checks' : 'Confirm both checks', 'aria-describedby="rock-pair-evidence"'));
  } else if (rockReadiness().pairedVerified && (isCheck && !rockRoute || id === 'E1' && rockRoute === 'checked-pending')) {
    menu.push('<p class="rock-pair-evidence" id="rock-pair-verified" role="status">H1 and R1 verified.</p>');
  }
  if (isCheck && status.ended) {
    menu.push(rockBtn('unchecked', 'Continue with support · unchecked', status.read || rockRoute ? 'disabled' : ''));
    menu.push(rockBtn('not-ready', 'Continue with support · checked', (!rockRoute || rockCanCheckLate()) && status.read ? '' : 'disabled'));
    menu.push(rockBtn('ready', 'Continue independently · both verified', rockCanReleaseOriginal() ? '' : 'disabled'));
    if (rockRoute && rockRoute !== 'ready') {
      for (const code of rock.cardCodes) menu.push(rockBtn('help-' + code, 'Use card ' + code));
    }
  }
  if (id === 'E1' && rockRoute && rockRoute !== 'ready') {
    if (!rockExamPending(id)) {
      for (const code of rock.cardCodes) menu.push(rockBtn('help-' + code, 'Use card ' + code));
    }
    if (rockCanCheckLate() && rockRoute === 'unchecked') {
      menu.push(rockBtn('late-read', rockDevice ? 'My teacher checked the same answer' : 'Confirm the original, unchanged answer has been checked'));
    }
    if (rockCanCheckLate() && rockRoute === 'checked-pending') {
      menu.push(rockBtn('late-not-ready', 'Continue with guidance · checked'));
      menu.push(rockBtn('late-ready', rockDevice ? 'My teacher cleared me to write on my own' : 'Release pupil with both checks verified',
        rockReadiness().pairedVerified ? '' : 'disabled'));
    }
    if (rockCanCheckLate()) menu.push(rockBtn('late-close', 'Close late checks · continue with guidance'));
  }
  if (!menu.length || protectedActive) return '';
  if (rockDevice) return `<div class="rock-inline" aria-label="Lesson controls">${menu.join('')}</div>`;
  return `<details class="rock-decisions" ${rockDecisionOpen ? 'open' : ''}><summary id="rock-controls">Teacher controls</summary><div>${menu.join('')}</div></details>`;
}

function rockHeader(title, context, toolbar = '') {
  return `<header class="rock-head"><div><p class="rock-time">${rockEsc(context)}</p><h1 class="screen-heading" tabindex="-1">${rockEsc(title)}</h1></div><div class="rock-access">${rockBtn('larger', 'Larger text', `aria-pressed="${rockLarge}"`)}${rockBtn('read', 'Read aloud')}${toolbar}</div></header>`;
}

function rockHold(id) {
  const status = rockState(id);
  if (!rockReached(phase().id)) return `<div class="rock-hold" id="rock-hold"><p>Complete the earlier tasks with your teacher before starting this screen.</p>${rockBtn('restart', 'Return to start')}</div>`;
  if (id === 'E1' && !rockRoute) return '<p class="rock-hold" id="rock-hold">Complete the new check and wait for your teacher’s direction.</p>';
  if (id === 'V1' && !rockState('E1').returned) return '<p class="rock-hold" id="rock-hold">Keep your original answer. Wait for feedback before improving it.</p>';
  if (!rockProtected(id) || status.begun) return '';
  const message = id === 'F1' ? 'Close earlier work and help. Keep your usual access arrangements and get ready to write on your own.' : 'Close any help and put the previous answer away. Write your new answer on your own.';
  return `<div class="rock-hold" id="rock-hold"><p>${message}</p>${rockBtn('begin', id === 'F1' ? 'Begin the final check' : 'Begin the new check')}</div>`;
}

function rockContent(p) {
  const id = rockId();
  if (id === 'start') {
    return rockHeader('Rock types and how they form', 'Year 8 Science · Earth · Lesson 2') +
      '<p class="rock-intro" id="rock-question">How can the same starting rock have different futures?</p>' +
      (rockDevice ? '' : '<p class="rock-links"><a href="device.html">Open pupil view</a></p>');
  }
  if (id === 'OUTCOME') {
    return rockHeader(p.title, 'Year 8 Rock Cycle · Scheme of Work Lesson 2') + '<ul class="rock-outcomes">' +
      rock.outcomes.map(outcome => `<li>${rockEsc(outcome)}</li>`).join('') + '</ul>';
  }
  const task = rock.tasks[id], state = rockState(id);
  let taskHtml = task.html;
  const finishedCheck = id === rock.readyTask && state.ended && activeWidget !== 'answers';
  if (finishedCheck) {
    taskHtml = '<p class="rock-hold" id="rock-check-ended" role="status">Check finished. Keep your original response.</p>';
  }
  const context = rock.times[p.id] + (id === 'E1' ? ' · Original exam-style practice' : '') + (task.marks ? ' · ' + task.marks + ' marks' : '');
  const held = rockHold(id);
  const teacherTools = held || activeWidget ? '' : rockToolbar(id, rockActive(id));
  const waitingForExam = rockExamPending(id);
  let details = '';
  if (waitingForExam) {
    const late = rockCanCheckLate();
    const waiting = late ? 'Keep your original H1 and R1 responses. Wait for your teacher or start guided work.' :
      'Follow your teacher’s directions. The question will appear here when the late checks have finished.';
    const action = late ? rockBtn('start-guided', 'Start guided work') :
      rockBtn('project-exam', 'Confirm late checks are closed and project the question');
    taskHtml = `<p id="rock-exam-wait" class="rock-hold" data-route="${rockRoute}" role="status">${waiting}</p><div class="rock-inline rock-lower">${action}</div>`;
  } else if (id === 'E1') {
    const direction = rockRoute === 'ready'
      ? 'Work on your own when your teacher has checked your answer and given you permission to start.'
      : 'Use the support your teacher gives you for this question.';
    details = `<p id="rock-route" class="rock-route" data-route="${rockRoute}">${direction}</p>`;
  }
  if (id === 'M2R' && !held && !activeWidget) {
    if (rockRecallActive(id)) {
      details += '<div class="rock-inline rock-lower">' + rockBtn('submit-recall', rockDevice ? 'I wrote my three terms' : 'Record the written recall') + '</div>';
    } else if (!state.returned && (rockDevice || state.reviewOpened)) {
      details += '<p class="rock-given">Compare with your teacher’s model. Keep the terms that fit. Correct any that do not.</p><div class="rock-inline rock-lower">' +
        rockBtn('correct-recall', rockDevice ? 'I checked and corrected my terms' : 'Confirm pupils checked and corrected their terms') + '</div>';
    }
  }
  if (rockExamActive(id) && !held && !waitingForExam) {
    details += `<div class="rock-inline rock-lower">${rockBtn('submit-exam', rockDevice ? 'I have submitted my original answer' : 'Confirm original answers submitted')}</div>`;
  } else if (rockDevice && !held && !waitingForExam && (['G1','G1V','H1','E1','V1'].includes(id) || rock.cardKeys[id])) {
    const labels = {G1:'I finished my first table',G1V:'I revised the observation and evidence', H1:'I have shown my answer', E1:'I finished my first attempt', V1:'My teacher checked my written repairs'};
    details += `<div class="rock-inline rock-lower">${rockBtn('mark', state.attempted ? 'Attempt recorded' : labels[id] || 'I made the correction', `aria-pressed="${state.attempted}"`)}${['G1','G1V'].includes(id) && state.attempted && !state.returned ? rockBtn('photo-review-seen',id === 'G1' ? 'My teacher has shown the photo review' : 'I checked my revision against the model') : ''}</div>`;
  }
  if (rockProtected(id) && !held && !activeWidget) {
    let checkControls = '';
    if (!state.ended && (rockDevice || id !== 'F1')) {
      checkControls += rockBtn('finish-unchecked', id === 'F1' ? 'I finished my answer' : (rockDevice ? 'I finished · waiting for a check' : 'End the check · answers unchecked'));
    }
    if (!state.read && (!rockDevice || state.ended && id !== 'F1')) {
      checkControls += rockBtn('confirm-read', rockDevice ? 'My teacher has checked my answer' : id === 'F1' ? 'Confirm work collected' : 'Confirm individual answers checked');
    }
    if (!rockDevice) {
      const attrs = state.read ? '' : 'disabled';
      checkControls += rockBtn('review-open', 'Model answer & mark scheme', attrs);
      rockReviews[id].slice(1).forEach((_, index) => {checkControls += rockBtn('review-part-' + (index + 1), 'Review part ' + (index + 2), attrs);});
    } else if (id === 'F1' && state.ended) {
      checkControls += '<p>Hand in your work as your teacher directs.</p>';
    }
    details += `<div class="rock-inline rock-lower">${checkControls}</div>`;
  }
  if (id === 'V1' && !held) {
    details += '<section class="rock-mark-points" id="rock-mark-points"><h2>Four mark points from your first answer</h2><ol>' + rock.markPoints.map(criterion => `<li>${rockEsc(criterion)}</li>`).join('') + '</ol>' + rockBtn('read-mark-points', 'Read mark points aloud') + '</section>';
    if (!state.revisionChecked && !state.attempted) details += '<div class="rock-inline rock-lower">' + rockBtn('revision-unverified', rockDevice ? 'I wrote the repairs · still need a check' : 'Continue after written repairs · unchecked') + '</div>';
  }
  if (id === 'F1' && !held && !rockState('V1').revisionChecked) {
    details += '<p class="rock-given" id="rock-final-diagnostic">Your teacher will use this check to see what you still need to practise.</p>';
  }
  if (id === 'G1' || id === 'G1V') {
    const photoTools = id === 'G1' || activeWidget === 'answers' || rockDevice
      ? '<nav class="rock-photo-tools" aria-label="Enlarge a specimen">' + ['A','B','C'].map(letter => rockBtn('zoom-' + letter, 'Enlarge ' + letter, 'aria-haspopup="dialog"')).join('') + '</nav>'
      : '';
    taskHtml = taskHtml.replace('<!-- photo tools -->', photoTools);
  }
  if (id === 'M1' && !held && !activeWidget) {
    const selected = rock.mechanisms.find(view => view.id === rockView);
    const choices = [{id:'summary', title:'Three routes'}, ...rock.mechanisms];
    let views = '<nav class="rock-inline rock-mechanisms" aria-label="Formation teaching diagrams">' + choices.map(view =>
      rockBtn('view-' + view.id, view.title, `aria-pressed="${(rockView || 'summary') === view.id}"`)).join('') + '</nav>';
    if (selected) views += rockMechanism(selected);
    taskHtml = taskHtml.replace('<!-- mechanism views -->', views);
  }
  if (task.scaffold && activeWidget === 'answers') details += `<p class="rock-given" id="rock-review-scaffold">${rockEsc(task.scaffold)}</p>`;
  const help = '<aside class="rock-support" id="rock-support"' + (!held && !activeWidget && !waitingForExam && rockCard ? '' : ' hidden') + '></aside>';
  const credits = id === 'G1' && activeWidget === 'answers' ? '<p class="rock-links"><a href="assets/Photo%20credits.md" target="_blank" rel="noopener">Photo credits</a></p>' : '<p class="rock-links" hidden></p>';
  return rockHeader(finishedCheck ? 'Readiness check' : task.title, context, teacherTools) + (held || (taskHtml + details + help + credits));
}


function rockMechanism(view) {
  let visual = `<img id="rock-model-diagram" src="assets/${rockEsc(view.asset)}" alt="${rockEsc(view.alt)}">`;
  if (rockDevice) {
    visual = '<div class="rock-mechanism-panels">' + view.mobilePanels.map((panel, index) => {
      const transition = index === 1 && view.mobileTransition
        ? `<p class="rock-mechanism-label rock-mechanism-transition" id="rock-mobile-transition">${rockEsc(view.mobileTransition)}</p>` : '';
      return `${transition}<section class="rock-mechanism-panel"><p class="rock-mechanism-label" id="rock-${panel.id}-label"><strong>${rockEsc(panel.label)}</strong><span>${rockEsc(panel.detail)}</span></p><img id="rock-${panel.id}" src="assets/${rockEsc(panel.asset)}" alt="${rockEsc(panel.alt)}"></section>`;
    }).join('') + '</div>';
    if (view.mobileScale) visual += `<p class="rock-mechanism-label" id="rock-mobile-scale">${rockEsc(view.mobileScale)}</p>`;
  }
  return `<figure class="rock-diagram rock-mechanism" id="rock-mechanism-${view.id}">${visual}<figcaption id="rock-mechanism-caption"><strong>Teaching diagram</strong> ${rockEsc(view.caption)}</figcaption></figure>`;
}

function rockFrame() {
  const id = rockId();
  const ready = rockActive(id);
  document.body.dataset.rockLarge = String(rockLarge);
  if (document.body.dataset.rockTask !== id) $('screen').scrollTop = 0;
  document.body.dataset.rockTask = id;
  document.body.dataset.rockActive = String(ready);
  document.body.dataset.rockReview = String(activeWidget === 'answers');
  document.body.dataset.rockReference = String(Boolean(rockCard) && rockReadiness().ended);
  if (id === rock.readyTask && rockState(id).ended && activeWidget !== 'answers') $('phase-name').textContent = 'Readiness check';
  const previous = $('previous-screen'), next = $('next-screen');
  previous.disabled = index === 0 || ready || id === 'F1' && rockState(id).begun;
  next.disabled = index === lesson.phases.length - 1 || ready || !rockMayAdvance(id);
  $('student-tools').hidden = true;
  if ($('rock-formation-summary')) $('rock-formation-summary').hidden = Boolean(rockView && !activeWidget);
  if (activeWidget) return;
  const support = $('rock-support');
  if (!support || support.hidden) return;
  if (id === 'E1') {
    const card = rock.examHelp[rockCard];
    const body = rockEsc(card.content).replace(/_{3,}/g, '<span class="blank"><span class="vh">blank</span></span>');
    support.innerHTML = `<section id="card-${rockEsc(rockCard)}"><h2>${rockEsc(card.title)}</h2><p id="rock-exam-help-text" class="rock-exam-help" data-part="support">${body}</p><div class="rock-inline"><button type="button" data-say="rock-exam-help-text">Read this help aloud</button><button type="button" data-close-card>Close help</button></div></section>`;
    return;
  }
  const clone = $('rock-support-template').content.cloneNode(true);
  for (const card of clone.querySelectorAll('[data-sc="card"]')) {
    if (card.dataset.code !== rockCard) card.remove();
  }
  for (const key of clone.querySelectorAll('#sc-key-list li')) {
    if (key.dataset.code !== rockCard) key.remove();
  }
  if (rockReadiness().ended) {
    const check = clone.querySelector('[data-part="recheck"]');
    check.innerHTML = '<p>Your new check has finished. Use this card as a reference.</p>';
    if (rock.cardReferences[rockCard]) check.querySelector('p').textContent = 'Your new check has finished. ' + rock.cardReferences[rockCard];
    clone.querySelector('[data-sc="reminder-strip"] p').textContent = 'Use the card your teacher gives you. Record the help you used in your book.';
    clone.querySelector('[data-close-card]').textContent = 'Close help';
    clone.querySelector('[data-retry-read]').remove();
    clone.querySelector('[data-retry-finish]').remove();
  }
  support.append(clone);
}

function rockDrawer(drawer, focus) {
  if (!rockReviews || activeWidget !== 'answers') return false;
  const id = rockId(), parts = rockReviews[id], task = rock.tasks[id];
  if (!rockReviewAllowed(id)) {
    drawer.hidden = true;
    activeWidget = null;
    return true;
  }
  const part = parts[rockReview];
  const pages = parts.length > 1 ? '<nav class="rock-inline" aria-label="Review parts">' +
    parts.map((_, index) => rockBtn('part-' + index, 'Part ' + (index + 1), `aria-pressed="${index === rockReview}"`)).join('') + '</nav>' : '';
  const canClear = rockProtected(id) && (id !== rock.readyTask || !rockRoute);
  drawer.innerHTML = `<header class="drawer-head"><h2 id="drawer-title" tabindex="-1">Model answer &amp; mark scheme</h2>${rockBtn('review-close', 'Close')}</header>${pages}<div class="rock-review-panel" id="rock-review-panel"><p id="rock-model">${rockEsc(part.model)}</p><h3>${task.marks ? 'Mark points' : 'Success criteria'}</h3><ul id="rock-criteria">${part.criteria.map(line => `<li>${rockEsc(line)}</li>`).join('')}</ul>${canClear ? rockBtn('clear-read', 'Close and clear confirmation') : ''}</div>`;
  if (focus) $('drawer-title').focus({preventScroll:true});
  return true;
}

function rockRead(element) {
  if (!element || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const text = [element.innerText, ...Array.from(element.querySelectorAll('img')).filter(image => image.getClientRects().length).map(image => image.alt)].join(' ').trim();
  if (text) window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
}

function rockZoom(letter, opener) {
  const photo = $('visual-PHOTO-' + letter);
  const note = $('given-PHOTO-' + letter);
  if (!photo || !note) return;
  const dialog = document.createElement('dialog');
  dialog.className = 'rock-photo-zoom';
  dialog.id = 'rock-photo-zoom';
  dialog.setAttribute('aria-labelledby', 'rock-zoom-title');
  dialog.innerHTML = `<header><h2 id="rock-zoom-title">Specimen ${rockEsc(letter)}</h2><div class="rock-inline">${rockBtn('zoom-larger', 'Larger text', `aria-pressed="${rockLarge}"`)}${rockBtn('zoom-close', 'Back to all photos', 'autofocus')}</div></header><figure><img id="rock-zoom-photo" src="${rockEsc(photo.getAttribute('src'))}" alt="${rockEsc(photo.alt)}"><figcaption id="rock-zoom-note">${rockEsc(note.textContent)}</figcaption></figure>`;
  dialog.addEventListener('close', () => {
    dialog.remove();
    $('rock-larger').hidden = false;
    opener.focus({preventScroll:true});
  }, {once:true});
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    event.stopPropagation();
    dialog.close();
  });
  document.body.append(dialog);
  $('rock-larger').hidden = true;
  dialog.showModal();
}

document.addEventListener('click', event => {
  const key = event.target.closest('#rock-support .sc-key a');
  if (key) {
    event.preventDefault();
    const card = $('rock-support').querySelector('[data-sc="card"]');
    card.tabIndex = -1;
    card.focus({preventScroll:true});
    return;
  }
  const button = event.target.closest('button');
  const id = rockId();
  if (button?.matches('#rock-support [data-say]')) {
    rockRead($(button.dataset.say));
    return;
  }
  if (button?.matches('#rock-support [data-close-card]')) {
    rockCloseHelp();
    render(false);
    $('screen').querySelector('h1')?.focus();
    return;
  }
  if (!button || button.disabled || !button.id.startsWith('rock-')) return;
  const action = button.id.slice(5), status = rockState(id);
  if (action === 'zoom-close') {
    $('rock-photo-zoom').close();
    return;
  }
  if (action === 'larger' || action === 'zoom-larger') {
    rockLarge = !rockLarge;
    document.body.dataset.rockLarge = String(rockLarge);
    $('rock-larger').setAttribute('aria-pressed', String(rockLarge));
    button.setAttribute('aria-pressed', String(rockLarge));
    return;
  }
  if (action.startsWith('zoom-')) {
    rockZoom(action.slice(5), button);
    return;
  }
  rockDecisionOpen = Boolean(button.closest('details')?.open);
  if (action === 'read-mark-points') {
    rockRead($('rock-mark-points'));
    return;
  }
  if (action === 'read') {
    rockRead($('rock-review-panel') || (id === 'M1' && rockView ? $('rock-mechanism-' + rockView) : null) || $('task-' + id) || $('rock-exam-wait') || $('rock-check-ended') || $('rock-hold') || $('screen'));
    return;
  }
  if (action === 'restart') {
    go(0);
    return;
  }
  if (action === 'begin') {
    status.begun = true;
    rockCloseHelp();
  } else if (action === 'finish-unchecked') {
    status.ended = true;
  } else if (action === 'confirm-read') {
    status.ended = true;
    status.read = true;
  } else if (action === 'verify-pair' && rockCanConfirmPair(id)) {
    rockReadiness().pairedVerified = true;
  } else if (action === 'submit-recall' && rockRecallActive(id)) {
    status.attempted = true;
  } else if (action === 'correct-recall' && id === 'M2R' && status.attempted && (rockDevice || status.reviewOpened)) {
    status.returned = true;
  } else if (action === 'start-guided' && id === 'E1' && rockCanCheckLate()) {
    rockRoute = rockClosedRoute();
  } else if (action === 'project-exam' && id === 'E1' && !rockDevice && rockRoute && !rockCanCheckLate()) {
    rockExamProjected = true;
  } else if (action === 'submit-exam' && rockExamActive(id) && !rockExamPending(id)) {
    status.attempted = true;
  } else if (action === 'mark') {
    status.attempted = true;
    if (id === 'E1' && rockRoute !== 'ready') status.assisted = true;
    if (id === 'V1') status.revisionChecked = true;
  } else if (action === 'revision-unverified' && id === 'V1') {
    status.attempted = true;
  } else if (action === 'photo-review-seen' && ['G1','G1V'].includes(id) && status.attempted) {
    status.returned = true;
  } else if (action.startsWith('late-') && id === 'E1' && rockCanCheckLate()) {
    if (action === 'late-read' && rockRoute === 'unchecked') {
      rockReadiness().read = true;
      rockRoute = 'checked-pending';
    } else if (action === 'late-close') {
      rockRoute = rockClosedRoute();
    } else if (rockRoute === 'checked-pending' && (action === 'late-not-ready' || action === 'late-ready' && rockReadiness().pairedVerified)) {
      rockRoute = action === 'late-ready' ? 'ready' : 'not-ready';
      rockCloseHelp();
    }
  } else if (action === 'returned') {
    if (status.attempted && (rockDevice || status.reviewOpened)) status.returned = true;
  } else if (action === 'ready' || action === 'not-ready' || action === 'unchecked') {
    if (id !== rock.readyTask || !status.ended) return;
    if (action === 'ready' && !rockCanReleaseOriginal()) return;
    if (action === 'unchecked' && (status.read || rockRoute)) return;
    if (action === 'not-ready' && (!status.read || rockRoute && !rockCanCheckLate())) return;
    rockRoute = action === 'unchecked' && rockState('E1').assisted ? rockClosedRoute() : action;
  } else if (action.startsWith('view-') && id === 'M1') {
    rockView = action === 'view-summary' ? '' : action.slice(5);
  } else if (action === 'review-open' || action.startsWith('review-part-')) {
    if (!rockReviewAllowed(id)) return;
    rockRecordContentHelp();
    rockView = '';
    status.reviewOpened = true;
    activeWidget = 'answers';
    rockReview = action === 'review-open' ? 0 : Number(action.slice(12));
    rockCloseHelp();
  } else if (action === 'review-close' || action === 'clear-read') {
    if (action === 'clear-read') {
      if (id === rock.readyTask && rockRoute) return;
      status.read = false;
      status.pairedVerified = false;
    }
    activeWidget = null;
  } else if (action === 'no-correction') {
    go(index + 1);
    return;
  } else if (action.startsWith('part-')) {
    rockReview = Number(action.slice(5));
  } else if (action.startsWith('correction-') && rockState('H1').attempted) {
    const task = action.slice(11);
    if (rockReadiness().ended) rockRecordContentHelp();
    else rockCorrection = task;
    rockDecisionOpen = false;
    rockCard = rock.cardKeys[task] || '';
    activeWidget = null;
  } else if (action.startsWith('help-')) {
    rockRecordContentHelp();
    rockDecisionOpen = false;
    rockCard = action.slice(5);
  } else {
    return;
  }
  render(false);
  const replacement = $(button.id);
  if (replacement?.offsetParent) replacement.focus({preventScroll:true});
  else if (activeWidget) $('drawer-title')?.focus({preventScroll:true});
  else $('screen').querySelector('h1')?.focus({preventScroll:true});
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
    return rockContent(p);

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
    rockFrame();
    renderPanel();
    mountModel();
    if(p.timer)tick();
    try{history.replaceState(null,'','#'+p.id);}catch(_){}
    if(focusHeading)$('screen').querySelector('h1')?.focus({preventScroll:true});
  }
  function go(id) {
    if (rockNavigate(id)) return;
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
    if (rockDrawer(drawer, focus)) return;
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
