/* Home learning pages · one-screen engine and copy deterrent.
   Each week is a <template data-week> holding <section data-step> elements.
   A step holds .blk content blocks (and optional .help panels). The engine
   splits each step into pages that fit the current screen, so pupils move
   with Next / Back and never scroll.
   The copy deterrent stops casual select / copy / drag / print. It cannot stop
   a screenshot or a photo, so the tasks are checked by a different, unaided
   question in class. No pupil data are collected; position is remembered in
   this browser tab only. */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const root = document.documentElement;
  root.classList.add('hl-guard');

  const weeks = Array.from(document.querySelectorAll('template[data-week]')).map(t => {
    const frag = t.content;
    return {
      id: t.dataset.week,
      label: t.dataset.label,
      steps: Array.from(frag.querySelectorAll('section[data-step]')).map(sec => ({
        n: sec.dataset.n || '',
        short: sec.dataset.short || '',
        title: sec.dataset.title || '',
        kicker: sec.dataset.kicker || '',
        gate: sec.dataset.gate || '',
        blocks: Array.from(sec.children).filter(el => el.classList.contains('blk')),
        helps: Array.from(sec.children).filter(el => el.classList.contains('help'))
      }))
    };
  });
  if (!weeks.length) return;

  const picker = $('.weekpick');
  const nav = $('.stepnav');
  const card = $('.card');
  const body = $('.card__body');
  const num = $('.card__num');
  const kicker = $('.card__kicker');
  const title = $('.card__title');
  const head = $('.card__head');
  let helpBtns = [];
  const overlay = $('.overlay');
  const oTitle = $('.overlay__head h3');
  const oBody = $('.overlay__body');
  const oClose = $('.overlay__close');
  const gate = $('.gate');
  const prev = $('[data-go="prev"]');
  const next = $('[data-go="next"]');
  const posn = $('.posn span');
  const dots = $('.dots');
  const live = $('#hl-live');

  const meas = document.createElement('div');
  meas.className = 'measure';
  meas.setAttribute('aria-hidden', 'true');
  card.appendChild(meas);

  const store = {
    get(k) { try { return sessionStorage.getItem(k); } catch (_) { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, v); } catch (_) { /* ignore */ } }
  };

  let wk = weeks[0], si = 0, pi = 0, pages = [], seen = new Set();

  weeks.forEach(w => {
    const o = document.createElement('option');
    o.value = w.id; o.textContent = w.label;
    picker.appendChild(o);
  });
  picker.addEventListener('change', () => loadWeek(picker.value, 0, 0));

  function loadWeek(id, s, p) {
    wk = weeks.find(w => w.id === id) || weeks[0];
    picker.value = wk.id;
    seen = new Set();
    nav.innerHTML = '';
    wk.steps.forEach((st, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'stepbtn';
      b.innerHTML = `<span class="n" aria-hidden="true">${st.n || '•'}</span><span class="lbl">${st.short}</span>`;
      b.setAttribute('aria-label', (st.n ? 'Step ' + st.n + ': ' : '') + st.title);
      b.addEventListener('click', () => goStep(i, 0));
      nav.appendChild(b);
    });
    goStep(s, p, true);
  }

  function box(el) {
    const cs = getComputedStyle(el);
    const w = el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const h = el.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    meas.style.width = w + 'px';
    meas.style.height = h + 'px';
    card.style.setProperty('--fig-max', Math.max(120, Math.round(h - 64)) + 'px');
    return h;
  }

  /* A page may take up to 8 % more than fits; fit() then shrinks its text slightly. */
  const SQUEEZE = 1.08;

  function paginate(blocks, el = body) {
    const h = box(el);
    const out = [];
    let cur = [];
    meas.innerHTML = '';
    for (const b of blocks) {
      const c = b.cloneNode(true);
      meas.appendChild(c);
      const hasFig = c.classList.contains('figblk') || cur.some(x => x.classList.contains('figblk'));
      if (meas.scrollHeight > h * (hasFig ? 1 : SQUEEZE) + 1 && cur.length) {
        meas.removeChild(c);
        out.push(cur);
        cur = [];
        meas.innerHTML = '';
        meas.appendChild(c);
      }
      cur.push(b);
    }
    if (cur.length) out.push(cur);
    meas.innerHTML = '';
    return out.length ? out : [[]];
  }

  /* Shrink text and figures together until the page fits (never below 70 %). */
  function fit(el) {
    let s = 1;
    el.style.fontSize = '';
    el.style.removeProperty('--fig-max');
    const fig = parseFloat(getComputedStyle(el).getPropertyValue('--fig-max')) || 320;
    while (el.scrollHeight > el.clientHeight + 1 && s > 0.7) {
      s -= 0.04;
      el.style.fontSize = s + 'em';
      el.style.setProperty('--fig-max', Math.round(fig * s) + 'px');
    }
  }

  function goStep(i, p, quiet) {
    si = Math.max(0, Math.min(wk.steps.length - 1, i));
    const st = wk.steps[si];
    closeOverlay();
    pages = paginate(st.blocks);
    pi = p === 'last' ? pages.length - 1 : Math.max(0, Math.min(pages.length - 1, p || 0));
    seen.add(si);
    Array.from(nav.children).forEach((b, k) => {
      if (k === si) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
      b.classList.toggle('seen', seen.has(k) && k !== si);
    });
    num.textContent = st.n || '•';
    kicker.textContent = st.kicker;
    title.textContent = st.title;
    helpBtns.forEach(b => b.remove());
    helpBtns = st.helps.map(h => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'helpbtn';
      b.textContent = h.dataset.label || 'Help';
      b.addEventListener('click', () => {
        lastHelp = b;
        openOverlay(h.dataset.title || h.dataset.label || 'Help', Array.from(h.childNodes).map(n => n.cloneNode(true)));
      });
      head.appendChild(b);
      return b;
    });
    render(quiet);
    if (st.gate && !store.get('hl-gate:' + location.pathname + ':' + wk.id + ':' + si)) showGate(st.gate);
  }

  function render(quiet) {
    body.innerHTML = '';
    (pages[pi] || []).forEach(b => body.appendChild(b.cloneNode(true)));
    fit(body);
    const last = si === wk.steps.length - 1 && pi === pages.length - 1;
    prev.disabled = si === 0 && pi === 0;
    next.disabled = last;
    next.textContent = pi < pages.length - 1 ? 'Next' : (last ? 'Done' : 'Next step');
    posn.textContent = (wk.steps[si].n ? 'Step ' + wk.steps[si].n : wk.steps[si].short) + ' · page ' + (pi + 1) + ' of ' + pages.length;
    dots.innerHTML = pages.map((_, k) => `<i class="${k === pi ? 'on' : ''}"></i>`).join('');
    store.set('hl-pos:' + location.pathname, [wk.id, si, pi].join('|'));
    if (!quiet && live) live.textContent = title.textContent + '. ' + posn.textContent + '.';
  }

  function go(d) {
    if (d > 0) {
      if (pi < pages.length - 1) { pi++; render(); }
      else if (si < wk.steps.length - 1) goStep(si + 1, 0);
    } else {
      if (pi > 0) { pi--; render(); }
      else if (si > 0) goStep(si - 1, 'last');
    }
  }
  prev.addEventListener('click', () => go(-1));
  next.addEventListener('click', () => go(1));
  document.addEventListener('keydown', e => {
    if (e.target.closest('select') || e.ctrlKey || e.metaKey || e.altKey) return;
    if (!overlay.hidden && e.key === 'Escape') { closeOverlay(); if (lastHelp) lastHelp.focus(); return; }
    if (!overlay.hidden || !gate.hidden) return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); go(1); }
    if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); go(-1); }
  });

  /* Help panels (word bank, frames) open over the page, after a first attempt */
  let oPages = [], oi = 0;
  const oPrev = $('.overlay__prev'), oNext = $('.overlay__next'), oPos = $('.overlay__pos');
  function openOverlay(heading, nodes) {
    gate.hidden = true;
    oTitle.textContent = heading;
    overlay.hidden = false;
    const blocks = nodes.filter(n => n.nodeType === 1);
    [oPrev, oNext, oPos].forEach(e => { e.hidden = false; });
    oPages = paginate(blocks, oBody);
    oi = 0;
    renderOverlay();
    oClose.focus();
  }
  function renderOverlay() {
    oBody.innerHTML = '';
    (oPages[oi] || []).forEach(n => oBody.appendChild(n.cloneNode(true)));
    const many = oPages.length > 1;
    [oPrev, oNext, oPos].forEach(e => { e.hidden = !many; });
    fit(oBody);
    oPrev.disabled = oi === 0;
    oNext.disabled = oi === oPages.length - 1;
    oPos.textContent = (oi + 1) + ' of ' + oPages.length;
  }
  oPrev.addEventListener('click', () => { if (oi > 0) { oi--; renderOverlay(); } });
  oNext.addEventListener('click', () => { if (oi < oPages.length - 1) { oi++; renderOverlay(); } });
  function closeOverlay() { overlay.hidden = true; gate.hidden = true; oBody.innerHTML = ''; }
  let lastHelp = null;
  oClose.addEventListener('click', () => { closeOverlay(); if (lastHelp) lastHelp.focus(); });

  /* Step 2 check: pupils confirm they recalled from memory before seeing the key knowledge */
  function showGate(text) {
    overlay.hidden = true;
    $('.gate__q', gate).textContent = text;
    gate.hidden = false;
    next.disabled = true;
    $('.gate [data-gate="yes"]').focus();
  }
  $('.gate [data-gate="yes"]').addEventListener('click', () => {
    store.set('hl-gate:' + location.pathname + ':' + wk.id + ':' + si, '1');
    gate.hidden = true;
    render(true);
    next.focus();
  });
  $('.gate [data-gate="no"]').addEventListener('click', () => { gate.hidden = true; goStep(si - 1, 0); });

  let t;
  window.addEventListener('resize', () => {
    clearTimeout(t);
    t = setTimeout(() => {
      const first = (pages[pi] || [])[0];
      pages = paginate(wk.steps[si].blocks);
      const k = pages.findIndex(pg => pg.includes(first));
      pi = k >= 0 ? k : Math.min(pi, pages.length - 1);
      render(true);
      if (!overlay.hidden) { [oPrev, oNext, oPos].forEach(e => { e.hidden = false; }); oPages = paginate(oPages.flat(), oBody); oi = Math.min(oi, oPages.length - 1); renderOverlay(); }
    }, 120);
  });

  const saved = (store.get('hl-pos:' + location.pathname) || '').split('|');
  const fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  loadWeek(saved[0] || weeks[0].id, +saved[1] || 0, +saved[2] || 0);
  fontsReady.then(() => {
    pages = paginate(wk.steps[si].blocks);
    pi = Math.min(pi, pages.length - 1);
    render(true);
  });

  /* ---- Copy deterrent ---- */
  const MSG = 'Copying is turned off on home learning pages. Write your answers in your own words in your exercise book.';
  let toast, timer;
  function notify() {
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'hl-toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }
    toast.textContent = MSG;
    toast.classList.add('show');
    clearTimeout(timer);
    timer = setTimeout(() => toast.classList.remove('show'), 2600);
  }
  function clearSelection() {
    const s = window.getSelection && window.getSelection();
    if (s && s.rangeCount && !s.isCollapsed) s.removeAllRanges();
  }
  function onClip(e) {
    e.preventDefault();
    try { e.clipboardData && e.clipboardData.setData('text/plain', MSG); } catch (_) { /* ignore */ }
    clearSelection();
    notify();
  }
  document.addEventListener('copy', onClip, true);
  document.addEventListener('cut', onClip, true);
  document.addEventListener('paste', e => e.preventDefault(), true);
  document.addEventListener('contextmenu', e => { e.preventDefault(); notify(); }, true);
  document.addEventListener('selectstart', e => e.preventDefault(), true);
  document.addEventListener('dragstart', e => e.preventDefault(), true);
  document.addEventListener('selectionchange', clearSelection);
  document.addEventListener('keydown', e => {
    if (!(e.ctrlKey || e.metaKey)) return;
    const k = (e.key || '').toLowerCase();
    if (['c', 'x', 'a', 's', 'p'].includes(k)) { e.preventDefault(); clearSelection(); notify(); }
  }, true);
  window.addEventListener('beforeprint', notify);
})();
