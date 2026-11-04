/* Original SVG alternatives for the procedural Three.js teaching models. */
window.MaterialModelFallbacks = (() => {
  const esc = text => String(text).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function polymer(config, state) {
    const controlled=config.variant==='controlled',compare = !['separate','crosslinked'].includes(config.variant), types = controlled?['separate','separate','crosslinked']:compare ? ['separate','crosslinked'] : [config.variant];
    return types.map((type, index) => {
      const cx = controlled?125+index*245:compare ? 190 + index * 360 : 370, width = controlled?90:compare ? 125 : 210;
      const rows = [87,117,147,177];
      let body = rows.map((y,r) => {
        const dx = type === 'separate' ? [-18,15,-9,20][r] * state.progress : 0;
        const path = `M ${cx-width+dx} ${y} C ${cx-width/2+dx} ${y-17}, ${cx+width/2+dx} ${y+17}, ${cx+width+dx} ${y}`;
        return `<path d="${path}" fill="none" stroke="#194e68" stroke-width="7" stroke-linecap="round"/>`;
      }).join('');
      for(let r=0;r<3;r++) for(let k=-1;k<=1;k++) body += `<line x1="${cx+k*width*.65}" x2="${cx+k*width*.65}" y1="${rows[r]+4}" y2="${rows[r+1]-4}" stroke="${type==='separate'?'#778e9d':'#b88a2c'}" stroke-width="${type==='separate'?2:6}" ${type==='separate'?'stroke-dasharray="3 5"':''}/>`;
      return `<g><g ${controlled&&index===1?`transform="rotate(7 ${cx} 132)"`:''}>${body}</g><text x="${cx}" y="36" text-anchor="middle">${controlled?['A','B','C'][index]:config.variant==='fresh'?(index===0?'R':'S'):type==='separate'?'Separate chains':'Cross-linked chains'}</text>${state.labels&&!controlled?`<text x="${cx}" y="225" text-anchor="middle" class="small">${type==='separate'?'Dashed: weaker forces between':'Gold: strong cross-links between'}</text>`:''}</g>`;
    }).join('');
  }
  function composite(config,state) {
    const offset = state.exploded ? 37 : 0;
    const fibresOnly=config.variant==='fibres-only';
    return `<g>${fibresOnly?'':`<path d="M 150 ${92-offset} L 505 ${92-offset} L 565 ${60-offset} L 210 ${60-offset} Z" fill="#9dbab7" opacity=".55" stroke="#366a6a"/><path d="M 150 ${92-offset} L 505 ${92-offset} L 505 ${113-offset} L 150 ${113-offset} Z" fill="#93b5b2" opacity=".55" stroke="#366a6a"/>`}${[0,1,2,3,4,5].map(i=>`<path d="M ${165+i*4} ${125+i*8} L ${510+i*4} ${125+i*8}" stroke="#194e68" stroke-width="7" stroke-linecap="round"/>`).join('')}${fibresOnly?'':`<path d="M 150 ${184+offset} L 505 ${184+offset} L 565 ${152+offset} L 210 ${152+offset} Z" fill="#9dbab7" opacity=".6" stroke="#366a6a"/>`}${state.labels?`<text x="340" y="23" text-anchor="middle">${fibresOnly?'Loose glass fibres · no surrounding matrix':'Fibres within a surrounding matrix'}</text><text x="135" y="126" text-anchor="end" class="small">Fibres</text>${fibresOnly?'':'<text x="590" y="100" class="small">Matrix</text>'}`:''}</g>`;
  }
  function beam(config,state) {
    const drop = Math.round(state.progress*28), y=95;
    return `<g><path d="M 160 162 L 138 200 L 182 200 Z M 560 162 L 538 200 L 582 200 Z" fill="#b7b5ac" stroke="#59636a"/><path d="M 120 ${y} Q 360 ${y+drop*2} 600 ${y} L 600 ${y+62} Q 360 ${y+62+drop*2} 120 ${y+62} Z" fill="#d9d7ce" stroke="#56646d" stroke-width="2"/><path d="M 130 ${y+48} Q 360 ${y+48+drop*2} 590 ${y+48}" fill="none" stroke="#b88a2c" stroke-width="7"/>${state.progress>0?`<path d="M 360 20 L 360 ${y+drop-9} m -9 -13 l 9 13 l 9 -13" fill="none" stroke="#9c4540" stroke-width="6"/>`:''}${state.labels?`<text x="360" y="240" text-anchor="middle" class="small">Both ends supported · central downward load</text>${state.progress>0?'<text x="390" y="35" class="small">Downward load</text>':''}${state.progress>0&&config.roleLabels!==false?'<text x="360" y="76" text-anchor="middle" class="small">Top: compression</text><text x="360" y="207" text-anchor="middle" class="small">Bottom: tension · steel bars</text>':''}`:''}</g>`;
  }
  function render(config,state) {
    const names = {polymer:'Schematic polymer chains',composite:'Schematic fibre and matrix cutaway',beam:'Schematic simply supported reinforced-concrete beam'};
    const content = ({polymer,composite,beam}[config.type]||polymer)(config,state);
    return `<svg class="mm-fallback" viewBox="0 0 740 260" role="img" aria-label="${esc(config.type==='composite'&&config.variant==='fibres-only'?'Loose glass fibres without a surrounding matrix':names[config.type]||names.polymer)}"><style>text{font:600 20px system-ui,sans-serif;fill:#142c3d}.small{font-size:17px;font-weight:500}</style>${content}</svg>`;
  }
  return {render};
})();
