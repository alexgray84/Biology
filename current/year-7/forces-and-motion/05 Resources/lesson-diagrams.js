window.BioDiagrams={render(name,state={}){
 const steady=name==='steady';
 const step=state.step||0,revealed=!steady||step>=2;
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 320" role="img" aria-label="${steady?(step===0?'A block moving steadily right; forces not yet revealed':step===1?'A block moving steadily right with 2 N pull right; predict friction':'A block moving steadily right with equal 2 N pull right and friction left'):'A block sliding right on a surface, with friction left'}">
 <defs><marker id="friction-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0L6 3L0 6Z" fill="#944832"/></marker><marker id="pull-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0L6 3L0 6Z" fill="#254d78"/></marker></defs>
 <rect x="35" y="231" width="490" height="30" rx="2" fill="#cfbea4" stroke="#152c46"/>
 <rect x="205" y="124" width="150" height="106" rx="4" fill="#e1c07e" stroke="#152c46" stroke-width="2"/>
 <text x="280" y="187" text-anchor="middle" font-family="Arial" font-size="27" fill="#152c46">Block</text>
 <path d="M235 224h90" stroke="#152c46" stroke-width="5"/>
 <path d="M255 72H355" stroke="#a08542" stroke-width="3" marker-end="url(#pull-arrow)"/>
 <text x="280" y="44" text-anchor="middle" font-family="Arial" font-size="23" fill="#152c46">${steady?'Steady motion right':'Sliding right'}</text>
 ${revealed?'<path d="M205 175H72" stroke="#944832" stroke-width="6" marker-end="url(#friction-arrow)"/>':''}
 ${revealed?'<text x="107" y="140" text-anchor="middle" font-family="Arial" font-size="23" fill="#944832">Friction'+(steady?' 2 N':'')+'</text>':step===1?'<text x="107" y="175" text-anchor="middle" font-family="Arial" font-size="30" fill="#944832">?</text>':''}
 ${steady&&step>=1?'<path d="M355 175H488" stroke="#254d78" stroke-width="6" marker-end="url(#pull-arrow)"/><text x="439" y="140" text-anchor="middle" font-family="Arial" font-size="23" fill="#254d78">Pull 2 N</text>':''}
 <text x="280" y="295" text-anchor="middle" font-family="Arial" font-size="23" fill="#152c46">${steady?(revealed?'Equal opposing forces → 0 N resultant':'Predict the forces before revealing'):'Contact between block and surface'}</text>
 </svg>`;
}};
