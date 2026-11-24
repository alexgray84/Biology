/* Shared learner presentation and access controls. It stores no pupil work. */
(() => {
  const get = id => document.getElementById(id);
  const escape = value => String(value).replace(/[&<>"']/g, letter => (
    {'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[letter]
  ));
  const button = (id, label, extra = '') =>
    `<button class="earth-button" type="button" id="${id}" ${extra}>${escape(label)}</button>`;
  const header = (title, large, context = '', extras = '') => `
    <header class="earth-head"><div>${context}<h1 class="screen-heading" tabindex="-1">${escape(title)}</h1></div>
      <div class="earth-access">
        ${get('earth-access-template').innerHTML.replace('aria-pressed="false"', `aria-pressed="${large}"`)}
        ${button('earth-read', 'Read aloud')}
        ${extras}
      </div>
    </header>`;
  const holdings = (message, controls = '') =>
    `<div class="earth-hold" id="earth-hold"><p>${escape(message)}</p>${controls}</div>`;
  const speak = element => {
    if (!element || !window.speechSynthesis) return;
    const content = [element.innerText.trim(), ...Array.from(element.querySelectorAll('img'), image => image.alt)]
      .filter(Boolean).join(' ');
    if (content) {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(content));
    }
  };
  const inactive = (items, active) => Object.keys(items).filter(id => id !== active)
    .map(id => `<p id="prompt-${id}" hidden></p>`).join('');
  const decor = task => {
    if (task !== 'GO1') return;
    const explainer = get('earth-support-explainer');
    if (!explainer) return;
    const section = document.createElement('section');
    section.className = 'earth-help-explainer';
    section.append(explainer.content.cloneNode(true));
    get('task-GO1').append(section);
  };
  const support = (mount, code) => {
    if (!mount) return;
    const template = get('station-support-template');
    if (!template) return;
    const copy = template.content.cloneNode(true);
    const cards = copy.querySelectorAll('[data-sc="card"]');
    for (const card of cards) {
      if (card.dataset.code !== code) card.remove();
      else card.tabIndex = -1;
    }
    const links = copy.querySelectorAll('#sc-key-list li');
    for (const link of links) if (link.dataset.code !== code) link.remove();
    const card = copy.querySelector('[data-sc="card"]');
    if (!card) return;
    mount.append(copy);
    const retry = card.querySelector('[data-part="recheck"]');
    retry.id = 'help-recheck-' + code;
    const after = document.createElement('div');
    after.className = 'earth-support-after';
    retry.before(after);
    after.append(retry, card.querySelector('[data-part="fades"]'));
  };
  const accessEvent = (event, changeSize) => {
    const hit = event.target.closest('button');
    if (hit?.id === 'larger-text') {
      changeSize();
      return true;
    }
    if (hit?.id === 'earth-read') {
      const target = get('earth-hold') || get('earth-review-panel') || get('screen');
      speak(target);
      return true;
    }
    if (hit?.matches('[data-say]')) {
      const card = hit.closest('[data-sc="card"]');
      speak(card || get(hit.dataset.say));
      return true;
    }
    if (event.target.closest('.earth-support .sc-key a')) {
      event.preventDefault();
      event.target.closest('.earth-support').querySelector('[data-sc="card"]')?.focus();
      return true;
    }
    if (hit?.matches('[data-close-card]')) {
      hit.closest('.earth-support')?.remove();
      window.speechSynthesis?.cancel();
      return true;
    }
    return false;
  };

  window.EarthUI = {get, escape, button, header, holdings, speak, inactive, decor, support, accessEvent};
})();
