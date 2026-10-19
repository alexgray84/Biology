(function () {
  'use strict';
  const D = window.AtomDiagrams;
  const $ = id => document.getElementById(id);
  const cases = {
    neutral: [{p:7,n:8,e:7},{p:8,n:8,e:8},{p:5,n:6,e:5},{p:1,n:0,e:1}],
    counts: [{p:11,n:12,e:11},{p:10,n:12,e:10},{p:5,n:6,e:5},{p:1,n:0,e:1}],
    isotopes: [{p:6,n:6,e:6,rightN:7},{p:8,n:8,e:8,rightN:10},{p:7,n:7,e:7,rightN:8},{p:1,n:0,e:1,rightN:1}]
  };
  const initial = new URLSearchParams(location.search).get('mode');
  let mode = Object.hasOwn(cases, initial) ? initial : 'neutral';
  let index = 0, committed = false, tested = false, prediction = {}, rightN = 7;
  function current() { return D.atom(cases[mode][index]); }
  function field(name, label, max = 40) { return `<label>${label}<input id="prediction-${name}" name="${name}" type="number" inputmode="numeric" min="0" max="${max}" step="1" required autocomplete="off"></label>`; }
  function start({fresh = false, focus = false} = {}) {
    committed = false; tested = false; prediction = {};
    const a = current(), c = cases[mode][index];
    rightN = c.rightN;
    document.querySelectorAll('[data-mode]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.mode === mode)));
    $('case-number').textContent = `${fresh ? 'Fresh unaided challenge' : 'Challenge'} ${index + 1} of ${cases[mode].length}`;
    $('challenge-title').textContent = {neutral:'Why is this atom neutral?',counts:'Find the particle counts.',isotopes:'What makes these the same element?'}[mode];
    if (mode === 'neutral') {
      $('task').textContent = `A neutral ${a.name.toLowerCase()} atom has ${a.p} protons and ${a.n} neutrons. In your book, predict its electron number and explain which charges must balance. Enter your prediction below.`;
      $('prediction-fields').innerHTML = field('e','Electrons',13);
      $('hint-text').textContent = 'Protons have positive charge. Electrons have negative charge. Neutrons have no charge. Which two counts must match for the total charge to be zero?';
    } else if (mode === 'counts') {
      $('task').textContent = `This neutral atom has atomic number ${a.Z} and mass number ${a.A}. Work out the proton, neutron and electron counts in your book. Show the calculation for neutrons, then enter your prediction.`;
      $('prediction-fields').innerHTML = field('p','Protons',13) + field('n','Neutrons',40) + field('e','Electrons',13);
      $('hint-text').textContent = 'Atomic number = proton count. Mass number = protons + neutrons. For a neutral atom, electron count = proton count. Start with the count you can read directly.';
    } else {
      $('task').textContent = `Model A has ${a.p} protons, ${a.n} neutrons and ${a.e} electrons. Model B has ${a.p} protons, ${c.rightN} neutrons and ${a.e} electrons. Predict whether they are the same element and find Model B’s mass number. Explain your decision in your book.`;
      $('prediction-fields').innerHTML = '<label>Element identity<select id="prediction-same" name="same" required><option value="">Choose a prediction</option><option value="yes">Same element</option><option value="no">Different elements</option></select></label>' + field('A','Model B mass number',40);
      $('hint-text').textContent = 'Proton number determines the element. Mass number counts protons and neutrons together. Compare what stays the same before focusing on what changes.';
    }
    $('hint').open = false;
    $('commit').disabled = false;
    $('commit').textContent = 'Commit prediction';
    ['test-model','review-button','feedback','review','models','explore','model-note','transfer'].forEach(id => { $(id).hidden = true; });
    $('review-button').setAttribute('aria-expanded','false');
    $('review-button').textContent = 'Model answer & mark scheme';
    $('feedback').innerHTML = ''; $('review-content').innerHTML = ''; $('models').innerHTML = ''; $('explore').innerHTML = '';
    $('models').className = '';
    $('model-placeholder').hidden = false;
    if (focus) $('main').focus();
  }
  function commit(event) {
    event.preventDefault();
    if (!$('prediction-form').reportValidity() || committed) return;
    const values = new FormData($('prediction-form'));
    for (const [name,value] of values) prediction[name] = name === 'same' ? value : Number(value);
    if (Object.values(prediction).some(value => typeof value === 'number' && !Number.isInteger(value))) return;
    committed = true;
    $('prediction-form').querySelectorAll('input,select').forEach(field => {field.disabled = true;});
    $('commit').disabled = true; $('commit').textContent = 'Prediction committed';
    $('test-model').hidden = false; $('review-button').hidden = false;
    $('feedback').hidden = false;
    $('feedback').innerHTML = '<p>Your first prediction is locked. Select <strong>Test with the model</strong>, then compare the evidence with your reasoning.</p>';
    $('test-model').focus();
  }
  function writeFeedback() {
    const a = current();
    if (mode === 'isotopes') {
      const rightA = a.p + cases[mode][index].rightN;
      const identityCorrect = prediction.same === 'yes', massCorrect = prediction.A === rightA;
      $('feedback').innerHTML = `<p><strong>${identityCorrect && massCorrect ? 'Your prediction fits both pieces of evidence.' : 'Use the comparison to improve your explanation.'}</strong></p>${!identityCorrect ? '<p>The neutron count changed. Check which particle count defines the element.</p>' : ''}${!massCorrect ? '<p>Mass number counts two types of particle in the nucleus. Check that both are included.</p>' : ''}<p>Write what stayed constant and what changed. Then try a different pair without help.</p>`;
    } else {
      const result = D.feedback(a,prediction);
      $('feedback').innerHTML = `<p><strong>${result.correct ? 'Your prediction is consistent with the model.' : 'Compare your prediction with the model, then improve it.'}</strong></p>${result.messages.map(message=>`<p>${message}</p>`).join('')}<p>Explain the rule in your book. Use a fresh example to check that you can apply it independently.</p>`;
    }
  }
  function draw() {
    const a = current();
    if (mode === 'isotopes') {
      const b = D.atom({p:a.p,n:rightN,e:a.e});
      $('models').className = 'pair';
      $('models').innerHTML = D.render({...a,title:`Model A · ${a.name}-${a.A}`}) + D.render({...b,title:`Model B · ${b.name}-${b.A}`});
    } else $('models').innerHTML = D.render(a);
    if (!$('review').hidden) drawReview();
  }
  function test() {
    if (!committed) return;
    tested = true;
    $('model-placeholder').hidden = true; $('models').hidden = false; $('model-note').hidden = false; $('transfer').hidden = false;
    $('test-model').hidden = true;
    draw(); writeFeedback();
    if (mode === 'isotopes') {
      const a = current(), c = cases[mode][index];
      $('explore').hidden = false;
      $('explore').innerHTML = `<h3>Change one factor</h3><p>Protons and electrons stay fixed at ${a.p}. Predict the new mass number in your book before moving the neutron control.</p><label for="neutron-control">Model B neutrons: <output id="neutron-output">${rightN}</output><input id="neutron-control" type="range" min="${Math.max(0,a.n)}" max="${Math.max(a.n,c.rightN)+1}" step="1" value="${rightN}"></label><p id="isotope-result"></p><div class="comparison"><h3>Now test the boundary</h3><p>Carbon-14 has 6 protons and 8 neutrons. Nitrogen-14 has 7 protons and 7 neutrons. In your book, explain why equal mass numbers do not make them the same element. Open the review to check.</p></div>`;
      $('neutron-control').addEventListener('input', event => {rightN = Number(event.target.value); $('neutron-output').value = rightN; updateIsotopeResult(); draw();});
      updateIsotopeResult();
    }
  }
  function updateIsotopeResult() {
    const a = current(), b = D.atom({p:a.p,n:rightN,e:a.e}), c = D.compare(a,b);
    $('isotope-result').textContent = `Both models remain ${a.name.toLowerCase()}: both have ${a.p} protons. Model B mass number is ${b.A}. ${c.differentIsotopes ? 'The different neutron counts make these different isotopes.' : 'The models now show the same isotope.'}`;
  }
  function drawReview() {
    const a = current();
    if (mode === 'neutral') $('review-content').innerHTML = `<p><strong>${a.e} electrons.</strong> Each of the ${a.p} protons has positive charge. Each electron has an equal-sized negative charge. Equal numbers balance to give zero total charge. The ${a.n} neutrons carry no charge.</p><p><strong>Success criteria:</strong> correct electron count; connect neutrality to equal proton and electron counts; distinguish neutrons from charged particles.</p>`;
    else if (mode === 'counts') $('review-content').innerHTML = `<ul><li><strong>Protons = ${a.p}:</strong> atomic number counts protons. (1 mark)</li><li><strong>Neutrons = ${a.n}:</strong> mass number − atomic number = ${a.A} − ${a.Z}. (1 mark)</li><li><strong>Electrons = ${a.e}:</strong> this atom is neutral, so electrons equal protons. (1 mark)</li></ul><p><strong>Total: 3 marks.</strong> Original practice question. Accept equivalent correct working and explanations.</p>`;
    else {
      const originalB = D.atom({p:a.p,n:cases[mode][index].rightN,e:a.e}), b = D.atom({p:a.p,n:rightN,e:a.e});
      $('review-content').innerHTML = `<p><strong>Original prediction:</strong> the same element, ${a.name.toLowerCase()}, because both have ${a.p} protons. Model B’s original mass number was ${originalB.A} (${a.p} + ${originalB.n}).</p><p><strong>Current model:</strong> Model A has ${a.n} neutrons; Model B has ${b.n}. ${a.n === b.n ? 'They show the same isotope.' : 'They are different isotopes of the same element.'} Model B’s current mass number is ${b.A}.</p><p><strong>Boundary comparison:</strong> carbon-14 and nitrogen-14 are different elements because their proton numbers differ (6 and 7). Equal mass numbers tell us only that their totals of protons and neutrons match.</p><p><strong>Success criteria:</strong> use proton number for element identity; use neutron differences for different isotopes of that element; add protons and neutrons for mass number.</p>`;
    }
  }
  $('prediction-form').addEventListener('submit',commit);
  $('test-model').addEventListener('click',test);
  $('review-button').addEventListener('click',() => {
    if (!committed) return;
    const opening = $('review').hidden;
    $('review').hidden = !opening; $('review-button').setAttribute('aria-expanded',String(opening));
    $('review-button').textContent = opening ? 'Hide model answer & mark scheme' : 'Model answer & mark scheme';
    if (opening) drawReview();
  });
  $('reset').addEventListener('click',()=>start({focus:true}));
  $('next').addEventListener('click',()=>{index = (index+1)%cases[mode].length; start({fresh:true,focus:true});});
  document.querySelectorAll('[data-mode]').forEach(button => button.addEventListener('click',()=>{mode = button.dataset.mode; index = 0; start({focus:true});}));
  start();
}());
