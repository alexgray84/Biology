/* Original schematic diagrams for the Year 8 revision lesson. Inline SVG, no external assets.
   render(name, state) -> SVG string. state.step highlights model steps. All data are illustrative. */
window.BioDiagrams = (() => {
  const C = {navy: '#182944', teal: '#24748d', gold: '#bd8126', rose: '#ad5c63', green: '#56834b', grid: '#c7ccc7', paper: '#f9f5ec', sun: '#e8a823', soft: '#e7ecf3'};
  const W = 640, H = 360;
  const wrap = (label, body, id) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}"><defs><marker id="arr-${id}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="${C.navy}"/></marker></defs><rect width="${W}" height="${H}" fill="${C.paper}"/>${body}</svg>`;
  const t = (x, y, s, o = {}) => `<text x="${x}" y="${y}" font-size="${o.size || 22}" font-weight="${o.weight || 600}" fill="${o.fill || C.navy}" text-anchor="${o.anchor || 'middle'}" font-family="Montserrat, Arial, sans-serif">${s}</text>`;
  const step = s => (s && s.step) || 0;

  /* ---- seasons: step 0 tilt orbit, 1 sunlight angle, 2 day length, 3 distance ---- */
  function earth(cx, cy, note1, note2, tilt) {
    const a = 23.5 * Math.PI / 180, sx = Math.sin(a), cs = Math.cos(a);
    return `<circle cx="${cx}" cy="${cy}" r="27" fill="${C.teal}" stroke="${C.navy}" stroke-width="3"/>
      <path d="M${cx - 44 * sx} ${cy + 44 * cs}L${cx + 44 * sx} ${cy - 44 * cs}" stroke="${C.navy}" stroke-width="4" stroke-linecap="round"/>
      ${t(cx + 56 * sx + 8, cy - 46 * cs, 'N', {size: 20, anchor: 'start'})}
      ${t(cx, cy + 66, note1, {size: 20})}${t(cx, cy + 90, note2, {size: 20, weight: 500})}`;
  }
  function seasons(s) {
    const n = step(s);
    if (n === 1) {
      const beam = (gx, theta, bw, label1, label2, cx) => {
        const th = theta * Math.PI / 180, w = bw / Math.sin(th), L = 175, dx = -Math.cos(th) * L, dy = -Math.sin(th) * L, gy = 285;
        return `<polygon points="${gx},${gy} ${gx + w},${gy} ${gx + w + dx},${gy + dy} ${gx + dx},${gy + dy}" fill="${C.sun}" fill-opacity=".45" stroke="${C.gold}" stroke-width="2"/>
          <path d="M${gx} ${gy + 8}H${gx + w}" stroke="${C.rose}" stroke-width="6"/>
          ${t(cx, 322, label1, {size: 21})}${t(cx, 346, label2, {size: 19, weight: 500})}`;
      };
      return wrap('Two equal beams of sunlight on the ground. The high Sun beam covers a small area. The low Sun beam covers a larger area.',
        `<path d="M20 285H620" stroke="${C.navy}" stroke-width="4"/>
        ${t(320, 34, 'Same beam of sunlight', {size: 24})}
        ${beam(215, 70, 60, 'Summer: Sun high', 'small area, more energy per m²', 175)}
        ${beam(520, 25, 60, 'Winter: Sun low', 'large area, less energy per m²', 480)}`, 'se1');
    }
    if (n === 2) {
      const bar = (y, label, hrs, col) => `${t(24, y + 31, label, {size: 22, anchor: 'start'})}<rect x="150" y="${y}" width="${hrs * 31}" height="46" rx="6" fill="${col}"/>${t(150 + hrs * 31 - 10, y + 31, 'about ' + hrs + ' h', {size: 22, anchor: 'end', fill: '#fff'})}`;
      return wrap('Bar chart: about 13.6 hours of daylight in Dubai in June and about 10.4 hours in December.',
        `${t(320, 44, 'Daylight hours in Dubai (approximate)', {size: 24})}
        ${bar(100, 'June', 13.6, C.gold)}${bar(180, 'December', 10.4, C.teal)}
        ${t(320, 290, 'North tilted towards the Sun: longer days', {size: 21})}${t(320, 320, 'North tilted away: shorter days', {size: 21})}`, 'se2');
    }
    const cx = 320, cy = 160;
    const dist = n === 3 ? `<path d="M${cx - 30} ${cy}L108 ${cy}" stroke="${C.rose}" stroke-width="3" stroke-dasharray="8 6"/><path d="M${cx + 30} ${cy}L532 ${cy}" stroke="${C.rose}" stroke-width="3" stroke-dasharray="8 6"/>${t(210, cy - 14, 'same distance', {size: 20, fill: C.rose})}${t(430, cy - 14, 'same distance', {size: 20, fill: C.rose})}` : '';
    return wrap('Earth at opposite points of its orbit around the Sun. The axis tilts the same way at both. June: north tilted towards the Sun. December: north tilted away.',
      `<ellipse cx="${cx}" cy="${cy}" rx="250" ry="110" fill="none" stroke="${C.grid}" stroke-width="3" stroke-dasharray="10 8"/>
      <circle cx="${cx}" cy="${cy}" r="30" fill="${C.sun}" stroke="${C.gold}" stroke-width="3"/>${t(cx, cy + 56, 'Sun', {size: 20})}
      ${dist}
      ${earth(80, cy, 'June: north tilted', 'towards the Sun')}${earth(560, cy, 'December: north tilted', 'away from the Sun')}
      ${t(cx, 330, n === 3 ? 'Earth is closest to the Sun in early January: winter in the north' : 'The axis points the same way all year', {size: 20, weight: 500})}`, 'se0');
  }

  /* ---- weight: balance vs newton meter ---- */
  function balance() {
    const panel = (x, name, g, w) => `<rect x="${x}" y="46" width="270" height="296" rx="12" fill="#fff" stroke="${C.grid}" stroke-width="2"/>
      ${t(x + 135, 82, name, {size: 24})}${t(x + 135, 108, 'g = ' + g + ' N/kg', {size: 19, weight: 500})}
      <rect x="${x + 22}" y="130" width="90" height="148" rx="8" fill="${C.soft}" stroke="${C.navy}" stroke-width="3"/>
      <path d="M${x + 67} 130V140M${x + 67} 150V276" stroke="${C.navy}" stroke-width="3"/><rect x="${x + 55}" y="${130 + (w === '20 N' ? 72 : 22)}" width="24" height="10" fill="${C.rose}"/>
      ${t(x + 67, 306, 'Newton meter', {size: 17, weight: 500})}${t(x + 67, 326, w, {size: 21, fill: C.rose})}
      <rect x="${x + 150}" y="130" width="100" height="148" rx="8" fill="${C.soft}" stroke="${C.navy}" stroke-width="3"/>
      ${t(x + 200, 172, '2 kg', {size: 26})}${t(x + 200, 214, 'mass', {size: 17, weight: 500})}
      ${t(x + 200, 306, 'Balance', {size: 17, weight: 500})}${t(x + 200, 326, '2 kg', {size: 21, fill: C.teal})}`;
    return wrap('Same 2 kilogram object on Earth and the Moon. Balance reads 2 kilograms in both places. Newton meter reads 20 newtons on Earth and 3.2 newtons on the Moon.',
      panel(30, 'Earth', 10, '20 N') + panel(340, 'Moon', 1.6, '3.2 N'), 'bal');
  }

  /* ---- calculation card (weight and speed worked examples) ---- */
  function card(label, id, title, rows, n, total) {
    const y0 = 86, gap = 62;
    const body = rows.map((r, i) => {
      if (i > n) return '';
      const cur = i === n;
      return `<rect x="30" y="${y0 + i * gap - 30}" width="580" height="52" rx="8" fill="${cur ? '#fff' : 'none'}" stroke="${cur ? C.gold : C.grid}" stroke-width="${cur ? 3 : 1.5}"/>${t(46, y0 + i * gap + 5, r, {size: 22, anchor: 'start', fill: cur ? C.navy : '#4d5a6b'})}`;
    }).join('');
    return wrap(label, `${t(320, 40, title, {size: 24})}${body}${t(320, 346, 'Step ' + (n + 1) + ' of ' + total, {size: 18, weight: 500})}`, id);
  }
  const wcalc = s => card('Calculation card: 250 grams to 0.25 kilograms, W = m × g, 0.25 × 10 = 2.5 newtons, then your turn with 600 grams on the Moon.', 'wc', 'Weight of a 250 g object on Earth',
    ['250 g ÷ 1000 = 0.25 kg', 'W = m × g   (g = 10 N/kg)', 'W = 0.25 × 10 = 2.5 N', 'Your turn: 600 g on the Moon, g = 1.6 N/kg'], step(s), 4);
  const cart = s => card('Calculation card: 40 plus 60 is 100 metres, 10 plus 10 plus 20 is 40 seconds, 100 divided by 40 is 2.5 metres per second, then your turn.', 'ca', 'Cart journey: 40 m, stop, 60 m',
    ['Distance: 40 + 60 = 100 m', 'Time: 10 + 10 + 20 = 40 s (stop included)', 'Speed = 100 ÷ 40 = 2.5 m/s', 'Your turn: 0.36 km in 3 minutes'], step(s), 4);

  /* ---- journey strip ---- */
  function journey() {
    const x0 = 30, sc = 10.2; // 50 s -> 510 px
    const seg = (a, b, label, d, fill) => `<rect x="${x0 + a * sc}" y="130" width="${(b - a) * sc}" height="70" rx="6" fill="${fill}" stroke="${C.navy}" stroke-width="2"/>${t(x0 + (a + b) / 2 * sc, 160, label, {size: 21, fill: fill === C.soft ? C.navy : '#fff'})}${t(x0 + (a + b) / 2 * sc, 188, d, {size: 19, weight: 500, fill: fill === C.soft ? C.navy : '#fff'})}`;
    return wrap('A rover travels 60 metres in 20 seconds, stops for 10 seconds, then travels 40 metres in 20 seconds. Total 100 metres in 50 seconds, average speed 2 metres per second.',
      `${t(320, 54, 'Rover journey (time bar to scale)', {size: 24})}
      ${seg(0, 20, '60 m', '20 s', C.teal)}${seg(20, 30, 'stop', '10 s', C.soft)}${seg(30, 50, '40 m', '20 s', C.gold)}
      <path d="M${x0} 238H${x0 + 50 * sc}" stroke="${C.navy}" stroke-width="3" marker-start="url(#arr-jo)" marker-end="url(#arr-jo)"/>
      ${t(320, 272, 'Total time: 20 + 10 + 20 = 50 s', {size: 22})}
      ${t(320, 312, 'Total distance: 60 + 40 = 100 m', {size: 22})}
      ${t(320, 346, 'Average speed = 100 ÷ 50 = 2 m/s', {size: 22, fill: C.rose})}`, 'jo');
  }

  /* ---- distance-time graphs ---- */
  function axes(id, xmax, ymax, xs, ys) {
    const L = 96, R = 610, T = 36, B = 290;
    const X = v => L + (R - L) * v / xmax, Y = v => B - (B - T) * v / ymax;
    let g = '';
    xs.forEach(v => { g += `<path d="M${X(v)} ${T}V${B}" stroke="${C.grid}"/>${t(X(v), B + 28, v, {size: 20})}`; });
    ys.forEach(v => { g += `<path d="M${L} ${Y(v)}H${R}" stroke="${C.grid}"/>${t(L - 10, Y(v) + 7, v, {size: 20, anchor: 'end'})}`; });
    g += `<path d="M${L} ${T - 6}V${B}H${R + 8}" fill="none" stroke="${C.navy}" stroke-width="3"/>`;
    g += t((L + R) / 2, 350, 'Time (s)', {size: 22}) + `<text x="22" y="${(T + B) / 2}" font-size="22" font-weight="600" fill="${C.navy}" text-anchor="middle" font-family="Montserrat, Arial, sans-serif" transform="rotate(-90 22 ${(T + B) / 2})">Total distance (m)</text>`;
    return {g, X, Y};
  }
  function dtgraph() {
    const {g, X, Y} = axes('dg', 30, 60, [0, 10, 20, 30], [0, 20, 40, 60]);
    const pts = [[0, 0], [10, 20], [20, 20], [30, 60]];
    return wrap('Distance-time graph: rises from 0 to 20 metres in 10 seconds, flat from 10 to 20 seconds, then rises to 60 metres at 30 seconds.',
      `${g}<polyline points="${pts.map(p => X(p[0]) + ',' + Y(p[1])).join(' ')}" fill="none" stroke="${C.gold}" stroke-width="6" stroke-linejoin="round"/>
      ${pts.map(p => `<circle cx="${X(p[0])}" cy="${Y(p[1])}" r="6" fill="${C.navy}"/>`).join('')}
      ${t(X(5) - 26, Y(10) - 22, 'A', {size: 22, fill: C.rose})}${t(X(15), Y(20) - 14, 'B', {size: 22, fill: C.rose})}${t(X(25) - 26, Y(40) - 6, 'C', {size: 22, fill: C.rose})}`, 'dg');
  }
  function dtworked(s) {
    const n = step(s);
    const {g, X, Y} = axes('dw', 15, 40, [0, 5, 10, 15], [0, 10, 20, 30, 40]);
    const pts = [[0, 0], [5, 15], [10, 15], [15, 35]];
    let extra = '';
    if (n === 0) extra = t(X(7.5), Y(38), 'Points: (0, 0) (5, 15) (10, 15) (15, 35)', {size: 20, weight: 500});
    if (n === 1) extra = t(X(2.5) - 6, Y(7.5) + 36, 'moving', {size: 20, fill: C.rose}) + t(X(7.5), Y(15) - 14, 'stopped', {size: 20, fill: C.rose}) + t(X(12.5) - 40, Y(25) + 6, 'faster', {size: 20, fill: C.rose});
    if (n === 2) extra = `<path d="M${X(10)} ${Y(15)}H${X(15)}V${Y(35)}" fill="none" stroke="${C.rose}" stroke-width="4" stroke-dasharray="8 6"/>${t(X(12.5), Y(15) + 26, '5 s', {size: 20, fill: C.rose})}${t(X(15) + 12, Y(25) + 6, '20 m', {size: 20, fill: C.rose, anchor: 'start'})}`;
    if (n === 3) extra = `<path d="M${X(0)} ${Y(0)}L${X(15)} ${Y(35)}" stroke="${C.teal}" stroke-width="3" stroke-dasharray="10 7"/>${t(X(8) + 30, Y(8) + 4, 'whole journey', {size: 19, fill: C.teal, anchor: 'start'})}${t(X(2.5) - 6, Y(7.5) + 36, '0 to 5 s?', {size: 20, fill: C.rose})}`;
    return wrap('Distance-time graph through (0,0), (5,15), (10,15) and (15,35).',
      `${g}<polyline points="${pts.map(p => X(p[0]) + ',' + Y(p[1])).join(' ')}" fill="none" stroke="${C.gold}" stroke-width="6" stroke-linejoin="round"/>
      ${pts.map(p => `<circle cx="${X(p[0])}" cy="${Y(p[1])}" r="6" fill="${C.navy}"/>`).join('')}${extra}`, 'dw');
  }

  const map = {seasons, balance, wcalc, cart, journey, dtgraph, dtworked};
  return {render(name, state = {}) { const f = map[name]; return f ? f(state) : ''; }};
})();
