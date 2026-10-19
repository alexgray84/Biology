/* Original Edu OS schematic atom diagrams. No third-party code or assets. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.AtomDiagrams = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const elements = Object.freeze(['', 'Hydrogen', 'Helium', 'Lithium', 'Beryllium', 'Boron', 'Carbon', 'Nitrogen', 'Oxygen', 'Fluorine', 'Neon', 'Sodium', 'Magnesium', 'Aluminium']);
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));

  function atom(input) {
    const values = Object.fromEntries(['p', 'n', 'e'].map(key => [key, input[key]]));
    for (const [key, value] of Object.entries(values)) {
      if (!Number.isInteger(value)) throw new TypeError(`${key} must be an integer.`);
    }
    if (values.p < 1 || values.p > 13) throw new RangeError('This diagram supports 1–13 protons.');
    if (values.n < 0 || values.n > 20) throw new RangeError('This diagram supports 0–20 neutrons.');
    if (values.e < 0 || values.e > 13) throw new RangeError('This diagram supports 0–13 electrons.');
    return Object.freeze({...values, name: elements[values.p], Z: values.p, A: values.p + values.n, charge: values.p - values.e, neutral: values.p === values.e});
  }

  function countsFromNumbers(Z, A) {
    if (!Number.isInteger(Z) || !Number.isInteger(A)) throw new TypeError('Atomic and mass numbers must be integers.');
    if (A < Z) throw new RangeError('Mass number cannot be less than atomic number.');
    return atom({p: Z, n: A - Z, e: Z});
  }

  function compare(first, second) {
    const a = atom(first), b = atom(second);
    return Object.freeze({sameElement: a.p === b.p, differentIsotopes: a.p === b.p && a.n !== b.n, sameMassNumber: a.A === b.A});
  }

  function positions(count, radius, cx = 225, cy = 246) {
    if (!Number.isInteger(count) || count < 0 || count > 33) throw new RangeError('Particle count out of range.');
    if (!count) return [];
    if (count === 1) return [{x:cx, y:cy}];
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    return Array.from({length:count}, (_, i) => {
      const r = radius * Math.sqrt((i + 0.5) / count);
      const angle = i * goldenAngle;
      return {x:cx + Math.cos(angle) * r, y:cy + Math.sin(angle) * r};
    });
  }

  function nucleusLayout(count) {
    if (!Number.isInteger(count) || count < 1 || count > 33) throw new RangeError('Nucleus count out of range.');
    const radius = count <= 4 ? 25 : count <= 14 ? 19 : 13.5;
    const step = radius * 2 + 3, candidates = [];
    for (let row = -4; row <= 4; row++) for (let col = -4; col <= 4; col++) {
      const x = (col + (Math.abs(row) % 2) / 2) * step, y = row * step * Math.sqrt(3) / 2;
      candidates.push({x,y,d:x*x+y*y});
    }
    candidates.sort((a,b)=>a.d-b.d || a.y-b.y || a.x-b.x);
    return {radius, points:candidates.slice(0,count).map(point=>({x:225+point.x,y:246+point.y}))};
  }

  function render(input) {
    const a = atom(input), labelled = input.labelled !== false;
    const title = input.title || `${a.name}-${a.A}`;
    const description = `${title}: ${a.p} protons and ${a.n} neutrons in the nucleus; ${a.e} electrons outside the nucleus. ${a.neutral ? 'Neutral: equal numbers of protons and electrons.' : `Charge is ${a.charge > 0 ? '+' : ''}${a.charge}.`} Schematic, not to scale. Positions do not represent electron shells or paths.`;
    const nucleus = nucleusLayout(a.A), nuclearPositions = nucleus.points, r = nucleus.radius;
    // Alternate the two nucleon types where possible. Their placement has no nuclear-structure meaning.
    const types = [];
    let protons = a.p, neutrons = a.n;
    while (protons || neutrons) { if (protons) {types.push('p'); protons--;} if (neutrons) {types.push('n'); neutrons--;} }
    const particles = nuclearPositions.map((point, i) => `<g data-particle="${types[i]}"><circle cx="${point.x.toFixed(2)}" cy="${point.y.toFixed(2)}" r="${r}" fill="${types[i] === 'p' ? '#b55a3c' : '#49667c'}" stroke="#fffaf0" stroke-width="2"/><text x="${point.x.toFixed(2)}" y="${(point.y + r * .31).toFixed(2)}" fill="#fffaf0" text-anchor="middle" font-size="${r * 1.03}" font-weight="700">${types[i] === 'p' ? 'p+' : 'n0'}</text></g>`).join('');
    const electrons = Array.from({length:a.e}, (_, i) => {
      const angle = -Math.PI / 2 + i * Math.PI * 2 / a.e;
      const x = 225 + Math.cos(angle) * 174, y = 246 + Math.sin(angle) * 174;
      return `<g data-particle="e"><circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="20" fill="#157978" stroke="#fffaf0" stroke-width="2"/><text x="${x.toFixed(2)}" y="${(y + 7).toFixed(2)}" text-anchor="middle" font-size="23" font-weight="700" fill="#fffaf0">e−</text></g>`;
    }).join('');
    if (input.compact === true) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 500" role="img" aria-label="${escape(description)}" style="font-family:Arial,Helvetica,sans-serif;max-width:100%;height:auto"><title>${escape(title)}</title><desc>${escape(description)}</desc><rect width="450" height="500" fill="#fbf7ed"/><text x="18" y="38" fill="#10283f" font-size="30" font-weight="700">${escape(title)}</text><g transform="translate(225 223) scale(.74) translate(-225 -246)"><circle cx="225" cy="246" r="199" fill="#ecf2f0"/><circle cx="225" cy="246" r="111" fill="#e6dfd0" stroke="#596d7b" stroke-width="2"/>${particles}${electrons}</g><g fill="#10283f" font-size="34" font-weight="700"><text x="20" y="405">p+ ${a.p}</text><text x="165" y="405">n0 ${a.n}</text><text x="305" y="405">e− ${a.e}</text></g><text x="18" y="438" fill="#435a6b" font-size="20">p+ proton · n0 neutron · e− electron</text><text x="18" y="466" fill="#435a6b" font-size="22">Schematic • not to scale</text><text x="18" y="491" fill="#435a6b" font-size="20">Positions do not show electron shells</text></svg>`;
    }
    const labels = labelled ? `<g fill="#10283f" font-size="29"><text x="492" y="132">Protons (+): ${a.p}</text><text x="492" y="183">Neutrons (0): ${a.n}</text><text x="492" y="234">Electrons (−): ${a.e}</text><text x="492" y="323" font-size="26">Nucleus: protons + neutrons</text><text x="492" y="370" font-size="26">Electrons: outside nucleus</text></g><g stroke="#647889" stroke-width="2" fill="none"><path d="M 315 270 L 470 314"/><path d="M 399 246 L 460 363 L 479 363"/></g>` : '';
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 500" role="img" aria-label="${escape(description)}" style="font-family:Arial,Helvetica,sans-serif;max-width:100%;height:auto"><title>${escape(title)}</title><desc>${escape(description)}</desc><rect width="900" height="500" fill="#fbf7ed"/><text x="24" y="39" fill="#10283f" font-size="30" font-weight="700">${escape(title)}</text><circle cx="225" cy="246" r="199" fill="#ecf2f0"/><circle cx="225" cy="246" r="111" fill="#e6dfd0" stroke="#596d7b" stroke-width="2"/>${particles}${electrons}${labels}<text x="24" y="482" fill="#435a6b" font-size="25">Schematic • not to scale • positions do not show electron shells</text></svg>`;
  }

  function feedback(input, prediction) {
    const a = atom(input), mistakes = [];
    for (const key of ['p', 'n', 'e']) {
      if (prediction[key] === undefined) continue;
      if (prediction[key] === a[key]) continue;
      if (key === 'p') mistakes.push('Atomic number counts protons. Mass number counts protons and neutrons together.');
      else if (key === 'n') {
        if (prediction.n === a.A + a.Z) mistakes.push('You added the two numbers. Mass number already includes the protons: subtract the proton number to leave the neutrons.');
        else if (prediction.n === a.A) mistakes.push('Mass number includes both protons and neutrons. Remove the proton count to find the neutron count.');
        else mistakes.push('Use the part–whole relationship: protons + neutrons = mass number.');
      } else if (prediction.e === a.n && a.n !== a.p) mistakes.push('Neutrons have no charge. Match electrons to the positively charged protons for a neutral atom.');
      else mistakes.push('For a neutral atom, positive and negative charges balance: electrons match protons.');
    }
    return {correct:mistakes.length === 0, messages:[...new Set(mistakes)]};
  }
  return Object.freeze({atom, countsFromNumbers, compare, positions, nucleusLayout, render, feedback, elements});
}));
