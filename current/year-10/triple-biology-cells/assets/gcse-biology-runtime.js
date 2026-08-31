(() => {
  const slides = [...document.querySelectorAll(".slide")];
  const stage = document.querySelector(".lesson-stage");
  const workspace = document.querySelector(".workspace");
  const drawer = document.querySelector(".student-drawer");
  const progress = document.querySelector(".progress-value");
  const position = document.querySelector("[data-position]");
  const phase = document.querySelector("[data-phase-name]");
  const nextLabel = document.querySelector("[data-next-label]");
  const previous = document.querySelector("[data-prev]");
  const next = document.querySelector("[data-next]");
  const status = document.querySelector("#lesson-status");
  let current = 0;
  let drawerName = null;

  const announce = message => {
    status.textContent = "";
    requestAnimationFrame(() => { status.textContent = message; });
  };

  const getTitle = slide => slide.dataset.nav || slide.querySelector("h1")?.textContent || "Lesson screen";

  function show(index, focus = false) {
    current = Math.max(0, Math.min(slides.length - 1, index));
    slides.forEach((slide, i) => slide.classList.toggle("active", i === current));
    progress.style.width = `${((current + 1) / slides.length) * 100}%`;
    position.textContent = `Screen ${current + 1} of ${slides.length}`;
    phase.textContent = getTitle(slides[current]);
    nextLabel.textContent = current < slides.length - 1 ? `Next: ${getTitle(slides[current + 1])}` : "Lesson complete";
    previous.disabled = current === 0;
    next.disabled = current === slides.length - 1;
    if (drawerName === "support") renderDrawer("support");
    if (focus) requestAnimationFrame(() => slides[current].querySelector("h1")?.focus({ preventScroll: true }));
    announce(`${getTitle(slides[current])}. Screen ${current + 1} of ${slides.length}.`);
  }

  function drawerContent(name) {
    if (name === "guide") return document.querySelector("#lesson-guide")?.innerHTML || "";
    if (name === "resources") return document.querySelector("#lesson-resources")?.innerHTML || "";
    return slides[current].querySelector("template[data-support]")?.innerHTML || `<div class="support-columns"><section class="support-section"><h3>Get started</h3><p>Read the task once. Underline the scientific noun and the command word.</p></section><section class="support-section"><h3>Build understanding</h3><p>Use the lesson model, then return to the same question.</p></section><section class="support-section"><h3>Go further</h3><p>Test the model with a new cell or explain its limitation.</p></section></div>`;
  }

  function drawerTitle(name) {
    return name === "guide" ? ["Lesson guide", "Specification, vocabulary and lesson journey."] : name === "resources" ? ["Lesson resources", "Textbook pages and printable evidence."] : ["Choose your support", "Use what helps, then return to the same destination."];
  }

  function renderDrawer(name) {
    drawerName = name;
    if (!name) {
      drawer.hidden = true;
      workspace.classList.remove("drawer-open");
      document.querySelectorAll("[data-drawer]").forEach(button => button.setAttribute("aria-pressed", "false"));
      return;
    }
    const [title, subtitle] = drawerTitle(name);
    drawer.innerHTML = `<div class="drawer-head"><div><h2 id="drawer-heading" tabindex="-1">${title}</h2><p>${subtitle}</p></div><button class="drawer-close" type="button" aria-label="Close panel">×</button></div><div class="drawer-body">${drawerContent(name)}</div>`;
    drawer.hidden = false;
    workspace.classList.add("drawer-open");
    document.querySelectorAll("[data-drawer]").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.drawer === name)));
    drawer.querySelector(".drawer-close").addEventListener("click", () => renderDrawer(null));
    requestAnimationFrame(() => drawer.querySelector("#drawer-heading")?.focus({ preventScroll: true }));
  }

  document.querySelectorAll("[data-drawer]").forEach(button => button.addEventListener("click", () => renderDrawer(drawerName === button.dataset.drawer ? null : button.dataset.drawer)));
  previous.addEventListener("click", () => show(current - 1, true));
  next.addEventListener("click", () => show(current + 1, true));

  document.querySelector("[data-present]")?.addEventListener("click", () => {
    document.body.classList.toggle("present");
    renderDrawer(null);
    announce(document.body.classList.contains("present") ? "Present view enabled." : "Student view enabled.");
  });

  document.querySelector("[data-fullscreen]")?.addEventListener("click", async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch (_) { announce("Fullscreen is unavailable. Present view still works."); }
  });

  document.querySelectorAll(".answer-button").forEach(button => button.addEventListener("click", () => {
    const grid = button.closest(".answer-grid");
    grid.querySelectorAll(".answer-button").forEach(item => { item.classList.remove("correct", "wrong"); item.setAttribute("aria-pressed", "false"); });
    button.setAttribute("aria-pressed", "true");
    const correct = button.dataset.correct === "true";
    button.classList.add(correct ? "correct" : "wrong");
    const feedback = button.closest(".hinge-layout").querySelector(".hinge-feedback");
    feedback.textContent = button.dataset.feedback || (correct ? "Correct." : "Not yet. Return to the model.");
    announce(feedback.textContent);
  }));

  document.querySelectorAll("[data-reveal-group]").forEach(button => button.addEventListener("click", () => {
    const selector = button.dataset.revealGroup;
    const items = [...button.closest(".slide").querySelectorAll(`[data-reveal="${selector}"]`)];
    const nextHidden = items.find(item => item.hidden);
    if (nextHidden) nextHidden.hidden = false;
    if (!items.some(item => item.hidden)) { button.disabled = true; button.textContent = "Model complete"; }
    announce(nextHidden ? "Next model step revealed." : "Model complete.");
  }));

  document.querySelectorAll("[data-routine-next]").forEach(button => button.addEventListener("click", () => {
    const items = [...button.closest(".slide").querySelectorAll(".routine-step")];
    const nextHidden = items.find(item => item.hidden);
    if (nextHidden) nextHidden.hidden = false;
    const remaining = items.find(item => item.hidden);
    if (remaining) button.textContent = `Reveal ${remaining.querySelector("strong")?.textContent || "next"}`;
    else { button.disabled = true; button.textContent = "Routine complete"; }
    announce(nextHidden ? `${nextHidden.querySelector("strong")?.textContent || "Next"} step revealed.` : "Routine complete.");
  }));

  document.querySelectorAll("[data-timer]").forEach(button => {
    let remaining = Number(button.dataset.timer || 180);
    let timerId = null;
    const output = button.parentElement.querySelector("[data-timer-output]");
    const renderTime = () => { output.textContent = `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, "0")}`; };
    renderTime();
    button.addEventListener("click", () => {
      if (timerId) { clearInterval(timerId); timerId = null; button.textContent = "Continue timer"; return; }
      button.textContent = "Pause timer";
      timerId = setInterval(() => {
        remaining -= 1; renderTime();
        if (remaining <= 0) { clearInterval(timerId); timerId = null; button.textContent = "Time complete"; button.disabled = true; announce("Time is complete."); }
      }, 1000);
    });
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && drawerName) { renderDrawer(null); return; }
    if (event.target.closest("button, a")) return;
    if (event.key === "ArrowRight" || event.key === "PageDown") show(current + 1, true);
    if (event.key === "ArrowLeft" || event.key === "PageUp") show(current - 1, true);
  });

  show(0);
})();
