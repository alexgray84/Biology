/* Answer-free pupil view. The teacher gives classroom directions. */
(() => {
  const lesson = window.CellDevice;
  const get = id => document.getElementById(id);
  const work = new Set();
  const gatedTasks = ['R1', 'C1', 'D1', 'PEER1', 'S2', 'REV1', 'F1'];
  const screen = get('screen');
  let index = 0;
  let task = 'BRIEF';
  let active = false;
  let large = false;
  let imagePair;

  function speak(element) {
    if (!element || !window.speechSynthesis) return;
    const words = [element.innerText, ...Array.from(element.querySelectorAll('img'), image => image.alt)].join(' ');
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(words));
  }

  function button(id, label, action) {
    const control = document.createElement('button');
    control.type = 'button';
    control.className = 'studio-button';
    control.id = id;
    control.textContent = label;
    control.addEventListener('click', action);
    return control;
  }

  function showTask(id, focus = true) {
    active = false;
    task = id;
    window.speechSynthesis?.cancel();
    render(focus);
  }

  function setStage(next, focus = true) {
    if (active || next < 0 || next >= lesson.stages.length) return;
    index = next;
    showTask(lesson.stages[index].entry, focus);
  }

  function advance() {
    if (active || !get('task-' + task)) return;
    work.add(task);
    if (task === 'TEACH') showTask('H1');
    else if (task === 'H1') {
      if (work.has('R1')) setStage(index + 1);
      else showTask('R1');
    }
    else if (task === 'PEER1' || task === 'S2') showTask('REV1');
    else setStage(index + 1);
  }

  function addHelp() {
    if (!['C1', 'D1'].includes(task)) return;
    const template = get('station-support-template');
    if (!template) return;
    const direction = template.content.querySelector('.sc-strip').cloneNode(true);
    direction.classList.add('studio-guided');
    direction.id = 'device-image-direction';
    direction.firstElementChild.textContent = lesson.imageHelp;
    const details = document.createElement('details');
    details.className = 'studio-help device-help';
    const summary = document.createElement('summary');
    summary.id = 'device-image-help';
    summary.textContent = 'Image help · use the pair your teacher gives you';
    const options = document.createElement('div');
    options.className = 'studio-access device-links';
    options.setAttribute('role', 'group');
    options.setAttribute('aria-label', 'Use the photo pair your teacher gives you');
    const card = document.createElement('div');
    const select = (id, focus) => {
      imagePair = id;
      const copy = template.content.cloneNode(true);
      copy.querySelector('.sc-strip').remove();
      const selected = copy.querySelector('template[data-image-pair="' + id + '"]');
      copy.querySelector('[data-image-pair-view]').append(selected.content.cloneNode(true));
      card.replaceChildren(copy);
      for (const control of options.children) {
        control.setAttribute('aria-pressed', String(control.id === 'device-image-pair-' + id));
      }
      if (focus) {
        window.speechSynthesis?.cancel();
        card.querySelector('.sc-key a').focus({ preventScroll: true });
      }
    };
    for (const pair of lesson.imageHelpPairs) {
      const control = button('device-image-pair-' + pair.id, pair.label, () => select(pair.id, true));
      control.setAttribute('aria-pressed', 'false');
      options.append(control);
    }
    if (imagePair) select(imagePair, false);
    details.append(summary, options, card);
    details.addEventListener('click', event => {
      if (event.target.closest('.sc-key a')) {
        event.preventDefault();
        get('card-S').focus({ preventScroll: true });
        return;
      }
      const read = event.target.closest('[data-say]');
      if (read) speak(card);
      if (event.target.closest('[data-close-card]')) details.open = false;
    });
    screen.append(direction, details);
  }

  function render(focus = false) {
    const stage = lesson.stages[index];
    const item = lesson.tasks[task];
    const protectedTask = ['R1', 'F1'].includes(task);
    const prior = (task === 'C1' && !work.has('R1')) ? 'see'
      : (task === 'D1' && !work.has('C1')) ? 'choose'
      : (['PEER1', 'S2', 'REV1'].includes(task) && !work.has('D1')) ? 'sketch'
      : (task === 'F1' && !work.has('REV1')) ? 'improve' : null;
    const waiting = protectedTask && !active;
    screen.replaceChildren();
    document.body.dataset.activity = stage.id;
    document.body.dataset.studioLarge = String(large);
    document.body.dataset.deviceProtected = String(active);
    const header = document.createElement('header');
    header.className = 'studio-head';
    const heading = document.createElement('h1');
    heading.className = 'screen-heading';
    heading.tabIndex = -1;
    heading.textContent = task === 'BRIEF' ? lesson.title : stage.title;
    const headings = document.createElement('div');
    headings.append(heading);
    if (stage.entry !== task) {
      const subheading = document.createElement('h2');
      subheading.className = 'studio-subtitle';
      subheading.textContent = item.title;
      headings.append(subheading);
    }
    header.append(headings);
    const access = document.createElement('div');
    access.className = 'studio-access';
    const larger = get('device-access').content.firstElementChild.cloneNode(true);
    larger.addEventListener('click', () => {
      large = !large;
      document.body.dataset.studioLarge = String(large);
      larger.setAttribute('aria-pressed', String(large));
    });
    larger.setAttribute('aria-pressed', String(large));
    access.append(larger, button('device-read', 'Read aloud', () => speak(screen)));
    header.append(access);
    screen.append(header);
    if (prior || waiting) {
      const hold = document.createElement('div');
      hold.className = 'studio-hold';
      const instruction = document.createElement('p');
      instruction.id = 'device-direction';
      instruction.textContent = prior ? 'Use the earlier activity with your teacher first.' : 'Wait until your teacher says to start.';
      hold.append(instruction);
      if (prior) hold.append(button('device-earlier', 'Go to the earlier activity', () =>
        setStage(lesson.stages.findIndex(stage => stage.id === prior))));
      else hold.append(button('device-open-check', 'Open the question when asked', () => {
        active = true;
        render(true);
      }));
      screen.append(hold);
    } else {
      screen.insertAdjacentHTML('beforeend', item.html);
      if (task === 'BRIEF') screen.querySelector('.studio-directions').insertAdjacentHTML('beforeend', lesson.opening);
      if (task === 'C1') {
        const sources = document.createElement('a');
        sources.className = 'studio-button';
        sources.href = 'visuals/sources.html';
        sources.target = '_blank';
        sources.rel = 'noopener';
        sources.textContent = 'Image credits';
        const links = document.createElement('p');
        links.className = 'studio-access studio-link';
        links.append(sources);
        screen.append(links);
      }
      if (task === 'H1') {
        const direction = document.createElement('p');
        direction.className = 'studio-guided';
        direction.id = 'device-hinge-direction';
        direction.textContent = lesson.hingeFeedback;
        screen.append(direction);
      }
      if (task === 'PEER1') {
        screen.append(button('device-S2', 'Help with your first sketch', () => {
          work.add('PEER1');
          showTask('S2');
        }));
      }
      if (task === 'S2') {
        const help = document.createElement('div');
        help.className = 'studio-task device-links';
        for (const [key, row] of Object.entries(lesson.improveHelp)) {
          const details = document.createElement('details');
          const summary = document.createElement('summary');
          summary.textContent = key === 'Y' ? 'Link a part to its job' : 'Name a real test';
          const support = document.createElement('p');
          support.textContent = row;
          details.id = 'device-help-' + key;
          details.append(summary, support);
          help.append(details);
        }
        screen.append(help);
      }
      addHelp();
      if (task === 'R1') screen.append(button('device-close-check', 'Continue when your teacher says', () => {
        active = false;
        work.add('R1');
        setStage(index + 1);
      }));
    }
    // Keep empty landmarks for stages whose question is not on this screen.
    for (const id of gatedTasks) {
      if (get('prompt-' + id)) continue;
      const landmark = document.createElement('span');
      landmark.hidden = true;
      landmark.id = 'prompt-' + id;
      screen.append(landmark);
    }
    get('phase-position').textContent = 'Screen ' + (index + 1) + ' of ' + lesson.stages.length;
    get('phase-name').textContent = stage.title;
    get('previous-screen').disabled = index === 0 || active;
    get('next-screen').disabled = index === lesson.stages.length - 1 || waiting || active || Boolean(prior);
    try { history.replaceState(null, '', '#' + stage.id); } catch (_) {}
    if (focus) heading.focus({ preventScroll: true });
  }

  get('previous-screen').addEventListener('click', () => setStage(index - 1));
  get('next-screen').addEventListener('click', advance);
  window.addEventListener('hashchange', () => {
    if (active) {
      history.replaceState(null, '', '#' + lesson.stages[index].id);
      return;
    }
    const selected = lesson.stages.findIndex(stage => '#' + stage.id === location.hash);
    if (selected >= 0) setStage(selected);
  });
  const startingIndex = lesson.stages.findIndex(stage => '#' + stage.id === location.hash);
  setStage(startingIndex < 0 ? 0 : startingIndex, false);
})();
