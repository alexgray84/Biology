window.BioDiagrams={render(name,state={}){const f=D[name];return f?f(state):'';}};
const N='#182944',G='#a08542',R='#944832',B='#254d78',GR='#2e6b4a';
const svg=(label,body,vb='0 0 560 320')=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" role="img" aria-label="${label}">${body}</svg>`;
const T=(x,y,t,c=N,a='middle',s=21)=>`<text x="${x}" y="${y}" text-anchor="${a}" font-size="${s}" font-weight="650" fill="${c}">${t}</text>`;
const defs=`<defs><marker id="ah" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0L6 3L0 6Z" fill="${N}"/></marker></defs>`;
const arrow=(x1,y1,x2,y2,c=N)=>`<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${c}" stroke-width="3" marker-end="url(#ah)"/>`;
/* chemical formula with subscripts: parts like ['C',6,'H',12] -> C6H12 with small sub numbers */
const F=(x,y,parts,size=26,anchor='start',coef=null,col=N)=>{let s=`<text x="${x}" y="${y}" text-anchor="${anchor}" font-size="${size}" font-weight="650" fill="${col}">`;if(coef!==null)s+=`<tspan fill="${G}" font-size="${size*1.15}">${coef}</tspan>`;parts.forEach(p=>{s+=typeof p==='number'?`<tspan dy="${size*.25}" font-size="${size*.65}">${p}</tspan><tspan dy="${-size*.25}">&#8203;</tspan>`:`<tspan>${p}</tspan>`;});return s+'</text>';};
const D={
balance(s){const k=s.step||0;
 const co=[[1,1,1,1],[1,1,6,1],[1,1,6,6],[1,6,6,6]][k];
 const left={C:6,H:12,O:6+2*co[1]},right={C:co[2],H:2*co[3],O:2*co[2]+co[3]};
 const eq=(y)=>F(14,y,['C',6,'H',12,'O',6],27,'start',co[0]===1?null:co[0])+T(150,y,'+',N,'start',27)+F(180,y,['O',2],27,'start',co[1]===1?null:co[1],k>=3?N:N)+T(262,y,'→',N,'start',27)+F(300,y,['CO',2],27,'start',co[2]===1?null:co[2])+T(400,y,'+',N,'start',27)+F(430,y,['H',2,'O'],27,'start',co[3]===1?null:co[3]);
 let b=eq(50)+'<rect x="40" y="90" width="480" height="190" rx="12" fill="#fff" stroke="'+N+'" stroke-width="2"/>'+T(120,124,'Atoms',N,'middle',20)+T(250,124,'Left',N,'middle',20)+T(350,124,'Right',N,'middle',20)+T(450,124,'Equal?',N,'middle',20);
 ['C','H','O'].forEach((e,i)=>{const y=168+i*45,ok=left[e]===right[e];b+=T(120,y,e,N,'middle',26)+T(250,y,left[e],N,'middle',26)+T(350,y,right[e],N,'middle',26)+T(450,y,ok?'✓':'✗',ok?GR:R,'middle',28);});
 b+=T(280,308,k===3?'Balanced: same atoms on both sides':'Not balanced yet',k===3?GR:R,'middle',22);
 return svg('Step '+(k+1)+' of 4 balancing aerobic respiration: atoms counted left and right',b);},
sprint(s){let b=defs+'<path d="M70 20V260H530" stroke="'+N+'" stroke-width="3" fill="none"/>'+T(300,300,'Time during a 20 second sprint',N,'middle',20)+`<text transform="translate(26 150) rotate(-90)" text-anchor="middle" font-size="20" font-weight="650" fill="${N}">Energy needed</text>`;
 b+=`<path d="M70 70H520" stroke="${R}" stroke-width="5" fill="none"/><path d="M70 240Q150 190 250 160T520 140" stroke="${B}" stroke-width="5" fill="none"/><path d="M70 70H520L520 140Q380 150 250 160Q150 190 70 240Z" fill="${G}" fill-opacity=".25"/>`;
 b+=T(300,52,'Energy demand of the sprint',R,'middle',20)+T(380,198,'Aerobic supply (oxygen is limited)',B,'middle',19)+T(300,112,'Gap: anaerobic respiration',N,'middle',21);
 return svg('A sprint: energy demand is higher than the energy that aerobic respiration can supply, so anaerobic respiration fills the gap',b);},
yeast(s){const bub=(x,y,r)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke="${N}" stroke-width="2.5"/>`;
 let b=`<rect x="20" y="120" width="170" height="120" rx="10" fill="#f3e6c8" stroke="${N}" stroke-width="3"/>`+bub(65,165,10)+bub(115,195,13)+bub(155,155,9)+bub(95,145,7)+bub(150,210,8)+T(105,272,'Bread dough',N,'middle',21)+T(105,100,'CO₂ makes it rise',R,'middle',19)+
 `<rect x="250" y="90" width="120" height="150" rx="16" fill="#e8c46a" stroke="${N}" stroke-width="3"/>`+bub(290,200,9)+bub(330,170,11)+bub(310,225,7)+bub(345,215,6)+T(310,272,'Fermenter',N,'middle',21)+T(300,70,'Sugar from crops',R,'middle',19)+
 `<path d="M370 150H420" stroke="${N}" stroke-width="4"/><path d="M420 150V130h60v110h-60V150" fill="#bcd0e4" stroke="${N}" stroke-width="3"/><rect x="480" y="125" width="30" height="12" fill="#bcd0e4" stroke="${N}" stroke-width="3"/>`+T(450,272,'Bioethanol fuel',N,'middle',21)+T(450,298,'blended into petrol',R,'middle',17);
 return svg('Yeast respire anaerobically: in dough the carbon dioxide makes bread rise; in a fermenter yeast turn sugar from crops into ethanol, which is blended into petrol as bioethanol fuel',b,'0 0 560 320');}
};
