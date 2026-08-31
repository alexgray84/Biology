(() => {
  const slides = [...document.querySelectorAll('.slide')];
  const progress = document.querySelector('.progress-value');
  const label = document.querySelector('[data-nav-label]');
  const index = document.querySelector('[data-nav-index]');
  const nextLabel = document.querySelector('[data-next-label]');
  const previous = document.querySelector('[data-prev]');
  const next = document.querySelector('[data-next]');
  const workspace = document.querySelector('.workspace');
  const drawer = document.querySelector('.student-drawer');
  const drawerBody = document.querySelector('.drawer-body');
  let current = 0;

  const support = JSON.parse(document.querySelector('#support-data')?.textContent || '{}');
  const supportLabels = { start: 'Get started', build: 'Build understanding', further: 'Go further' };

  function show(position, focus = true) {
    current = Math.max(0, Math.min(slides.length - 1, position));
    slides.forEach((slide, slideIndex) => slide.classList.toggle('active', slideIndex === current));
    progress.style.width = `${((current + 1) / slides.length) * 100}%`;
    const currentLabel = slides[current].dataset.label || slides[current].getAttribute('aria-label') || `Screen ${current + 1}`;
    label.textContent = currentLabel;
    index.textContent = `${current + 1} / ${slides.length}`;
    nextLabel.textContent = current < slides.length - 1 ? (slides[current + 1].dataset.label || 'Next phase') : 'Lesson complete';
    previous.disabled = current === 0;
    next.disabled = current === slides.length - 1;
    if (focus) requestAnimationFrame(() => slides[current].querySelector('h1, h2')?.focus({ preventScroll: true }));
  }

  function renderSupport(key) {
    document.querySelectorAll('.support-tab').forEach(tab => tab.setAttribute('aria-selected', String(tab.dataset.supportTab === key)));
    const items = support[key] || [];
    drawerBody.innerHTML = `<section class="support-section"><h3>${supportLabels[key]}</h3><ul>${items.map(item => `<li>${item}</li>`).join('')}</ul></section>`;
  }

  function setDrawer(open) {
    drawer.hidden = !open;
    workspace.classList.toggle('drawer-open', open);
    document.querySelector('[data-support]').setAttribute('aria-pressed', String(open));
    if (open) renderSupport(document.querySelector('.support-tab[aria-selected="true"]')?.dataset.supportTab || 'start');
  }

  previous.addEventListener('click', () => show(current - 1));
  next.addEventListener('click', () => show(current + 1));
  document.querySelector('[data-print]').addEventListener('click', () => window.print());
  document.querySelector('[data-present]').addEventListener('click', async () => {
    const entering = !document.body.classList.contains('present');
    setDrawer(false);
    document.body.classList.toggle('present', entering);
    document.querySelector('[data-present]').textContent = entering ? 'Exit present' : 'Present';
    if (entering && !document.fullscreenElement) {
      try { await document.documentElement.requestFullscreen(); } catch (_) {}
    } else if (!entering && document.fullscreenElement) {
      try { await document.exitFullscreen(); } catch (_) {}
    }
  });
  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement && document.body.classList.contains('present')) {
      document.body.classList.remove('present');
      document.querySelector('[data-present]').textContent = 'Present';
    }
  });
  document.querySelector('[data-support]').addEventListener('click', () => setDrawer(drawer.hidden));
  document.querySelector('.drawer-close').addEventListener('click', () => setDrawer(false));
  document.querySelectorAll('.support-tab').forEach(tab => tab.addEventListener('click', () => renderSupport(tab.dataset.supportTab)));

  document.querySelectorAll('[data-reveal-group]').forEach(button => button.addEventListener('click', () => {
    const group = button.dataset.revealGroup;
    const nextHidden = document.querySelector(`[data-reveal-item="${group}"][hidden]`);
    if (nextHidden) nextHidden.hidden = false;
    if (!document.querySelector(`[data-reveal-item="${group}"][hidden]`)) button.disabled = true;
  }));

  document.querySelectorAll('[data-answer]').forEach(button => button.addEventListener('click', () => {
    const group = button.closest('[data-hinge]');
    group.querySelectorAll('[data-answer]').forEach(item => {
      item.setAttribute('aria-pressed', 'false');
      item.classList.remove('correct', 'wrong');
    });
    button.setAttribute('aria-pressed', 'true');
    const correct = button.dataset.correct === 'true';
    button.classList.add(correct ? 'correct' : 'wrong');
    group.querySelector('.hinge-feedback').textContent = button.dataset.feedback;
  }));

  document.querySelectorAll('[data-timer]').forEach(timer => {
    let seconds = Number(timer.dataset.timer || 180);
    let timerId = null;
    const display = timer.querySelector('[data-timer-display]');
    const toggle = timer.querySelector('[data-timer-toggle]');
    const update = () => { display.textContent = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`; };
    toggle?.addEventListener('click', () => {
      if (timerId) { clearInterval(timerId); timerId = null; toggle.textContent = 'Start'; return; }
      toggle.textContent = 'Pause';
      timerId = setInterval(() => {
        seconds = Math.max(0, seconds - 1); update();
        if (seconds === 0) { clearInterval(timerId); timerId = null; toggle.textContent = 'Finished'; }
      }, 1000);
    });
    timer.querySelector('[data-timer-reset]')?.addEventListener('click', () => { clearInterval(timerId); timerId = null; seconds = Number(timer.dataset.timer || 180); toggle.textContent = 'Start'; update(); });
    update();
  });

  document.addEventListener('keydown', event => {
    if (event.target.closest('button, a')) return;
    if (['ArrowRight', 'PageDown', ' '].includes(event.key)) { event.preventDefault(); show(current + 1); }
    if (['ArrowLeft', 'PageUp'].includes(event.key)) { event.preventDefault(); show(current - 1); }
    if (event.key.toLowerCase() === 's') setDrawer(drawer.hidden);
  });

  show(0, false);
})();
