/* Pupil-only view. Start signals and readiness decisions come from the teacher. */
(() => {
  const lesson = window.EarthLesson, ui = window.EarthUI, get = ui.get;
  const screen = get('screen'), next = get('next-screen'), previous = get('previous-screen');
  const work = new Set();
  let index = 0, task = lesson.stages[0].taskIds[0], large = false;
  let active = false, finished = false, offeredHelp = false, help = '';

  function showStage(stage) {
    if (stage < 0 || stage >= lesson.stages.length || active || finished) return;
    index = stage;
    showTask(lesson.stages[stage].taskIds[0]);
  }

  function showTask(id) {
    task = id;
    offeredHelp = false;
    help = '';
    window.speechSynthesis?.cancel();
    draw(true);
  }

  function advance() {
    work.add(task);
    if (task === 'H1' && !work.has('R1')) showTask('R1');
    else if (task === 'P1') showTask('D1');
    else if (task === 'V1' && work.has('D1-attempt')) showTask('VD1');
    else showStage(index + 1);
  }

  function draw(focus = false) {
    const stage = lesson.stages[index];
    const item = lesson.tasks[task], protectedTask = item.protected;
    const guard = task === 'P1' && !work.has('R1') || task === 'V1' && !work.has('P1') ||
      task === 'D1' && !work.has('P1') || task === 'F1' && !work.has('V1');
    const reached = finished && task === 'F1';
    const wait = protectedTask && !active && !work.has(task);
    const held = reached ? ui.holdings('Hand in the final check as your teacher directs.') : guard
      ? ui.holdings('Complete the previous activity with your teacher first.') : wait
      ? ui.holdings(task === 'F1' ? 'Close your earlier work. Keep your usual access arrangements. Wait for your teacher to start the final check.'
        : 'Put the earlier diagram and help away. Wait for your teacher to start the individual check.',
        ui.button('earth-begin', 'My teacher has said to begin'))
      : '';
    const practice = task === 'D1' ? '<p class="earth-route">If your teacher assigns the challenge, answer it after the core question. Otherwise move to Improve your answer.</p>' : task === 'P1' ? '<p id="device-route" class="earth-route">Show your individual check to your teacher. Use the direction they give you for practice.</p>' : '';
    const buttons = active ? ui.button('earth-finish', task === 'F1' ? 'I handed in my final check' : 'Show your answer to your teacher') :
      task === 'P1' ? ui.button('earth-attempt', 'I finished my first attempt') :
      task === 'H1' ? ui.button('earth-attempt', 'I have shown my first answer') :
      task === 'D1' ? ui.button('earth-depth-attempt', 'I attempted the depth question') : '';
    const helpOptions = !active && task === 'H1' && offeredHelp && lesson.supportCodes.length
      ? '<div class="earth-help-options"><p>After your attempt, use the card your teacher gives you.</p>' +
        lesson.supportCodes.map(code => ui.button('earth-help-' + code, 'Card ' + code)).join('') + '</div>' : '';
    const controls = buttons || helpOptions ? '<div class="earth-inline-controls">' + buttons + helpOptions + '</div>' : '';
    const title = task === 'DO1' ? 'The structure of Earth' : task === stage.taskIds[0] ? stage.title : item.title;
    const timing = `<p class="earth-time">${stage.startMinute}–${stage.endMinute} min</p>`;
    screen.innerHTML = ui.header(title, large, timing) + (held ||
      practice + item.html + controls + (help ? '<div class="earth-support" id="earth-support"></div>' : ''))
      + ui.inactive(lesson.tasks, held ? null : task);
    document.body.dataset.earthTask = task;
    document.body.dataset.earthLarge = String(large);
    document.body.dataset.earthProtected = String(active || reached);
    if (!held) {
      ui.decor(task);
      ui.support(get('earth-support'), help);
    }
    get('phase-position').textContent = 'Screen ' + (index + 1) + ' of ' + lesson.stages.length;
    get('phase-name').textContent = stage.title;
    previous.disabled = index === 0 || active || finished;
    next.disabled = active || Boolean(held) || task === 'F1' || ['P1', 'H1'].includes(task) && !offeredHelp;
    if (focus) {
      screen.querySelector('.screen-heading').focus({preventScroll: true});
      screen.scrollTop = 0;
    }
  }

  screen.addEventListener('click', event => {
    if (event.target.closest('[data-close-card]')) help = '';
    if (ui.accessEvent(event, () => {
      large = !large;
      document.body.dataset.earthLarge = String(large);
      get('larger-text').setAttribute('aria-pressed', String(large));
    })) return;
    const control = event.target.closest('button')?.id;
    if (control === 'earth-begin') {
      active = true;
      help = '';
    } else if (control === 'earth-finish') {
      if (task === 'F1') finished = true;
      active = false;
      work.add(task);
    } else if (control === 'earth-depth-attempt') {
      work.add('D1-attempt');
    } else if (control === 'earth-attempt') {
      work.add(task);
      offeredHelp = true;
    } else if (control?.startsWith('earth-help-')) {
      help = control.slice(11);
    } else return;
    window.speechSynthesis?.cancel();
    draw(true);
  });
  previous.addEventListener('click', () => showStage(index - 1));
  next.addEventListener('click', advance);
  draw();
})();
