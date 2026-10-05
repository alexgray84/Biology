window.BioDiagrams={render(name,state={}){const f=D[name];return f?f(state):'';}};
const N='#182944',G='#a08542',R='#944832',B='#254d78',GR='#2e6b4a';
const svg=(label,body,vb='0 0 560 320')=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" role="img" aria-label="${label}">${body}</svg>`;
const T=(x,y,t,c=N,a='middle',s=21)=>`<text x="${x}" y="${y}" text-anchor="${a}" font-size="${s}" font-weight="650" fill="${c}">${t}</text>`;
const defs=`<defs><marker id="ah" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0L6 3L0 6Z" fill="${N}"/></marker></defs>`;
const arrow=(x1,y1,x2,y2,c=N)=>`<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${c}" stroke-width="3" marker-end="url(#ah)"/>`;
const mito=(x,y,rot=0,s=1)=>`<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><ellipse rx="26" ry="13" fill="#e8c46a" stroke="${N}" stroke-width="2.5"/><path d="M-16 -3q4 8 8 0t8 0t8 0M-16 5q4-8 8 0t8 0t8 0" fill="none" stroke="${R}" stroke-width="2"/></g>`;
const D={
cell(s){return svg('An animal cell and a plant cell, each with mitochondria',defs+
 `<ellipse cx="150" cy="170" rx="125" ry="105" fill="#f3e6c8" stroke="${N}" stroke-width="3"/><circle cx="130" cy="150" r="30" fill="#dccb9f" stroke="${N}" stroke-width="2.5"/>`+mito(185,205,20)+mito(95,215,-25)+mito(205,130,60)+mito(75,125,10)+
 `<rect x="300" y="60" width="240" height="220" rx="22" fill="#f3e6c8" stroke="${N}" stroke-width="3.5"/><rect x="326" y="86" width="140" height="120" rx="30" fill="#e5eff7" stroke="${N}" stroke-width="2"/><ellipse cx="500" cy="115" rx="20" ry="12" fill="#8fbf9f" stroke="${GR}" stroke-width="2.5"/><ellipse cx="500" cy="240" rx="20" ry="12" fill="#8fbf9f" stroke="${GR}" stroke-width="2.5"/><ellipse cx="340" cy="245" rx="20" ry="12" fill="#8fbf9f" stroke="${GR}" stroke-width="2.5"/>`+mito(430,245,10,.9)+mito(500,175,80,.9)+
 T(150,40,'Animal cell')+T(420,40,'Plant cell')+T(150,306,'Mitochondria (gold)',G,'middle',20)+T(420,306,'Chloroplasts (green) too',GR,'middle',20));},
atp(s){const box=(x,y,w,h,t,t2,fill,fs=24)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="${fill}" stroke="${N}" stroke-width="2.5"/>`+T(x+w/2,y+h/2+(t2?-4:8),t,N,'middle',fs)+(t2?T(x+w/2,y+h/2+22,t2,N,'middle',19):'');
 return svg('Respiration transfers energy from glucose to ATP, which powers muscle contraction, active transport, growth and cell division',defs+
 box(10,20,150,90,'Glucose','+ oxygen','#f3e6c8')+arrow(162,65,198,65)+box(200,20,190,90,'Respiration','mostly in mitochondria','#e8c46a',24)+arrow(392,65,428,65)+box(430,20,120,90,'ATP','','#bcd0e4',28)+
 `<path d="M490 112V160M490 160H70M490 160H210M490 160H350M490 160H490" stroke="${N}" stroke-width="3" fill="none"/>`+arrow(70,160,70,200)+arrow(210,160,210,200)+arrow(350,160,350,200)+arrow(490,160,490,200)+
 box(10,204,120,84,'Muscle','contraction','#fff',20)+box(150,204,120,84,'Active','transport','#fff',20)+box(290,204,120,84,'Growth','','#fff',20)+box(430,204,120,84,'Cell','division','#fff',20)+
 T(280,312,'Energy is transferred from glucose to ATP, not made',R,'middle',18));},
limewater(s){const k=s.step||0;
 const tube=(x,cloudy,bub)=>`<path d="M${x-45} 60V250q0 40 45 40t45-40V60" fill="#fff" stroke="${N}" stroke-width="3.5"/><path d="M${x-43} 150V250q0 38 43 38t43-38V150Z" fill="${cloudy?'#e3dccb':'#e4f1f7'}" fill-opacity="${cloudy?.97:.85}"/>`+(bub?`<circle cx="${x-8}" cy="215" r="6" fill="none" stroke="${N}" stroke-width="2"/><circle cx="${x+10}" cy="185" r="5" fill="none" stroke="${N}" stroke-width="2"/><circle cx="${x-2}" cy="165" r="4" fill="none" stroke="${N}" stroke-width="2"/>`:'');
 const straw=x=>`<path d="M${x+36} 62L${x+8} 262" stroke="${B}" stroke-width="9" stroke-linecap="round" opacity=".85"/>`;
 return svg('Limewater in a boiling tube: clear before, cloudy after carbon dioxide is bubbled through',defs+tube(120,false,false)+T(120,24,'Clear',N,'middle',22)+T(120,318,'Before',N,'middle',19)+
 arrow(190,170,330,170)+T(262,150,'CO₂ from',R,'middle',19)+T(262,200,'your breath',R,'middle',19)+tube(400,true,true)+straw(400)+T(400,24,'Cloudy',N,'middle',22)+T(400,318,'After',N,'middle',19),'0 0 560 330');}
};
