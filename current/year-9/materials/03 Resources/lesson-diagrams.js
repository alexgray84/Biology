/* Original schematic SVGs. Not scale drawings or structural design instructions. */
(() => {
  'use strict';
  const navy='#17284b', gold='#98700c', blue='#215d88', paper='#fffdf5';
  const text=(x,y,s,extra='')=>`<text x="${x}" y="${y}" ${extra}>${s}</text>`;
  const svg=(name,body,h=520)=>`<svg class="material-svg" viewBox="0 0 720 ${h}" role="img" aria-label="${name}" xmlns="http://www.w3.org/2000/svg"><title>${name}</title><defs><marker id="arrow-${name.replace(/\W/g,'')}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="${navy}"/></marker></defs><g fill="${navy}" stroke="none" font-family="Arial,sans-serif" font-size="48" text-anchor="middle">${body}</g></svg>`;
  const line=(x1,y1,x2,y2,colour=navy,width=7,extra='')=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${colour}" stroke-width="${width}" ${extra}/>`;
  const rect=(x,y,w,h,fill,extra='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" stroke="${navy}" stroke-width="5" ${extra}/>`;
  const fibres = (name,colour,first) => svg(name,
    text(360,58,first)+
    rect(85,130,550,230,'#efe5cb','rx="20"')+
    [172,226,280,334].map(y=>line(110,y,610,y,colour,18)).join('')+
    line(360,78,360,158,gold,5)+
    text(360,440,'Polymer matrix')+
    line(560,390,560,350,gold,5));
  const beam = svg('Simply supported beam under central downward load',
    text(360,53,'Central load')+
    line(360,72,360,215,navy,9)+`<path d="M340 195L360 230L380 195" fill="none" stroke="${navy}" stroke-width="9"/>`+
    `<path d="M90 200Q360 260 630 200L630 310Q360 370 90 310Z" fill="#e3e5e6" stroke="${navy}" stroke-width="5"/>`+
    `<path d="M115 294Q360 348 605 294" fill="none" stroke="${blue}" stroke-width="12"/>`+
    `<path d="M90 312L55 365L125 365Z M630 312L595 365L665 365Z" fill="#d6dbe4" stroke="${navy}" stroke-width="5"/>`+
    text(360,282,'Top: compression')+
    text(360,425,'Bottom: tension')+
    text(360,489,'Steel near bottom')+
    text(95,535,'Support')+text(620,535,'Support'),565);
  const canopy=svg('Hypothetical canopy beam supported at both ends with central downward load',
    text(360,65,'Downward load')+line(360,90,360,190)+`<path d="M341 165L360 201L379 165" fill="none" stroke="${navy}" stroke-width="8"/>`+
    `<path d="M85 213Q360 270 635 213L635 275Q360 332 85 275Z" fill="#e8e2d5" stroke="${navy}" stroke-width="5"/>`+
    rect(85,279,45,145,'#c5cedc')+rect(590,279,45,145,'#c5cedc')+
    text(360,470,'Supported at both ends'));
  const forces=svg('Compression squashes and tension stretches',
    text(360,60,'Compression')+rect(230,100,260,100,'#e7d6a5')+
    line(80,150,210,150)+`<path d="M182 130L216 150L182 170" fill="none" stroke="${navy}" stroke-width="8"/>`+
    line(640,150,510,150)+`<path d="M538 130L504 150L538 170" fill="none" stroke="${navy}" stroke-width="8"/>`+
    text(360,257,'Tension')+rect(200,300,320,100,'#cddce8')+
    line(190,350,55,350)+`<path d="M83 330L49 350L83 370" fill="none" stroke="${navy}" stroke-width="8"/>`+
    line(530,350,665,350)+`<path d="M637 330L671 350L637 370" fill="none" stroke="${navy}" stroke-width="8"/>`+
    text(360,473,'Squash / stretch'));
  const models=svg('Card only, straw only and joined card-straw beam comparison',
    text(360,57,'Card only')+rect(100,88,520,30,'#e1cf98')+
    text(360,195,'Straws only')+[0,1,2].map(i=>line(110,231+i*17,610,231+i*17,blue,12)).join('')+
    text(360,365,'Joined')+rect(100,395,520,30,'#e1cf98')+
    [0,1,2].map(i=>line(110,438+i*16,610,438+i*16,blue,12)).join('')+
    [180,360,540].map(x=>`<rect x="${x}" y="388" width="24" height="100" fill="#b8a16c" fill-opacity=".5" stroke="${navy}" stroke-width="3"/>`).join(''),525);
  const plywood=svg('Plywood bonded layers with crossing grain directions',
    text(360,58,'Crossing wood layers')+
    [0,1,2].map((i)=>rect(100,110+i*85,520,65,i%2?'#d8b984':'#eccea1')+(i%2?[190,290,390,490,590].map(x=>line(x,120+i*85,x,166+i*85,gold,4)).join(''):[128,148].map(y=>line(120,y+i*85,600,y+i*85,gold,4)).join(''))).join('')+
    text(360,459,'Adhesive bonds layers'));
  const wood=svg('Wood has cellulose-rich reinforcement within a binding matrix',
    text(360,55,'Cellulose-rich')+text(360,112,'reinforcement')+
    rect(100,165,520,190,'#e4cda3','rx="18"')+
    [150,240,330,420,510,590].map(x=>`<path d="M${x} 185Q${x-30} 255 ${x} 333" fill="none" stroke="${blue}" stroke-width="17"/>`).join('')+
    text(360,442,'Matrix binds/supports'));
  const mudbrick=svg('Plant fibres within an earth body in a mudbrick',
    text(360,62,'Plant fibres')+rect(100,120,520,250,'#cdaa7c','rx="10"')+
    [[150,160,245,203],[330,155,390,220],[490,180,565,150],[150,300,235,263],[300,285,385,335],[450,280,565,310]].map(a=>line(...a,'#78633d',10)).join('')+
    text(360,448,'Earth forms body'));
  const concreteRoles=svg('Complementary roles of concrete and steel',
    rect(65,90,590,120,'#e6e6e3','rx="12"')+text(360,142,'Concrete')+text(360,195,'Compression')+
    rect(65,285,590,120,'#dae4ed','rx="12"')+text(360,338,'Steel')+text(360,391,'Tension'));
  const burj=svg('Original schematic of a tapering tower for the Burj Khalifa context',
    `<path d="M285 420L285 320L310 320L310 230L334 230L334 145L350 145L350 80L360 20L370 80L370 170L390 170L390 275L415 275L415 420Z" fill="#ccd6df" stroke="${navy}" stroke-width="6"/>`+
    [190,240,290,340,390].map(y=>line(330,y,380,y,'#718298',4)).join('')+
    line(170,423,550,423,navy,5)+text(360,491,'Original schematic'));
  window.LESSON_DIAGRAMS = {burj,canopy,fibreglass:fibres('Fibreglass schematic','#b6902c','Glass fibres'),cfrp:fibres('CFRP schematic',navy,'Carbon fibres'),forces,beam,'concrete-roles':concreteRoles,plywood,wood,mudbrick,'beam-models':models};
})();
