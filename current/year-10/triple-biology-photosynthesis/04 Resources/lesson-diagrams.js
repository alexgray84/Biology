/* Original scientific schematics for L4 "Two rates, one net", rebuilt 28 October 2026.
   Locked conventions: CO2 grey, O2 teal, light yellow. Leaf green.
   Hydrogencarbonate indicator: yellow = more CO2, orange-red = about air level,
   purple = less CO2. Every swatch carries a word label as well as a colour.
   All rates are illustrative arbitrary units (a.u.), never measured data.
   Net CO2 uptake = rate of photosynthesis - rate of respiration.
   BioDiagrams.render(name,state) returns accessible inline SVG. */
window.BioDiagrams = (() => {
  'use strict';
  const C = { ink:'#182944', soft:'#475566', leaf:'#4f8a3c', leafDark:'#2f5f25', glass:'#6f7d8c', co2:'#5f6670', o2:'#1f8a84', light:'#f2b705', lightLine:'#b98700',
    yellow:'#eccb3c', amber:'#e58e2a', orange:'#d9542b', magenta:'#a8376f', purple:'#7d3c98', paper:'#fbf8f0', bung:'#3b3f46', grid:'#d9dde2', mito:'#c9773a', mitoDark:'#8a4b1e', curve:'#182944' };
  let serial = 0;
  const esc = v => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const F = 1.25; // label scale: keeps every label at or above 16 px at 390-1920 px
  const T = (x,y,value,{anchor='start',size=48,weight=650,fill=C.ink}={}) => { const z=Math.round(size*F); return `<text x="${x}" y="${y}" text-anchor="${anchor}" fill="${fill}" font-family="Montserrat,system-ui,sans-serif" font-size="${z}" font-weight="${weight}" style="font-size:${z}px">${esc(value)}</text>`; };
  function svg(title,desc,body,w,h){
    const id=`gas-figure-${++serial}`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="${id}-title ${id}-desc" class="gas-science-diagram"><title id="${id}-title">${esc(title)}</title><desc id="${id}-desc">${esc(desc)}</desc>${body}</svg>`;
  }
  const marker = (id,fill) => `<marker id="${id}" markerWidth="4" markerHeight="4" refX="2.4" refY="2" orient="auto" markerUnits="strokeWidth"><path d="M0 0L4 2L0 4Z" fill="${fill}"/></marker>`;
  const leafShape = (cx,cy,w,h) => `<path d="M${cx-w/2} ${cy}C${cx-w/4} ${cy-h*0.75} ${cx+w/4} ${cy-h*0.7} ${cx+w/2} ${cy}C${cx+w/4} ${cy+h*0.7} ${cx-w/4} ${cy+h*0.75} ${cx-w/2} ${cy}Z" fill="${C.leaf}" stroke="${C.leafDark}" stroke-width="5"/><path d="M${cx-w/2+8} ${cy}H${cx+w/2-12}" stroke="#cfe3b8" stroke-width="5"/>`;
  function sun(x,y,level){
    if(level==='dark')return `<circle cx="${x}" cy="${y}" r="32" fill="${C.ink}" stroke="${C.ink}" stroke-width="4"/>`;
    const rays=level==='bright'?12:level==='dim'?6:0, r=level==='bright'?36:26;
    let b='';
    for(let i=0;i<rays;i++){const a=i*2*Math.PI/rays;b+=`<path d="M${x+Math.cos(a)*(r+8)} ${y+Math.sin(a)*(r+8)}L${x+Math.cos(a)*(r+(level==='bright'?34:20))} ${y+Math.sin(a)*(r+(level==='bright'?34:20))}" stroke="${C.light}" stroke-width="8" stroke-linecap="round"/>`;}
    return b+`<circle cx="${x}" cy="${y}" r="${r}" fill="${C.light}" stroke="${C.lightLine}" stroke-width="4"/>`;
  }

  /* ---------- Tubes after one hour (illustrative set) ---------- */
  function tube(cx,{liquid=C.orange,leaf=true}={}){
    const top=150,bottom=560,w=112,x=cx-w/2;
    let b=`<path d="M${x} ${top}V${bottom-56}A56 56 0 0 0 ${x+w} ${bottom-56}V${top}" fill="#f4f7fa" stroke="${C.glass}" stroke-width="6"/>`;
    b+=`<path d="M${x+5} 430V${bottom-56}A51 51 0 0 0 ${x+w-5} ${bottom-56}V430Z" fill="${liquid}" stroke="none"/>`;
    b+=`<path d="M${x+6} 360H${x+w-6}" stroke="#7c6a55" stroke-width="7" stroke-dasharray="9 6"/>`;
    if(leaf)b+=`<path d="M${cx-40} 346C${cx-18} 314 ${cx+22} 314 ${cx+42} 346C${cx+18} 360 ${cx-20} 360 ${cx-40} 346Z" fill="${C.leaf}" stroke="${C.leafDark}" stroke-width="4"/>`;
    b+=`<rect x="${x-10}" y="${top-38}" width="${w+20}" height="52" rx="8" fill="${C.bung}"/>`;
    return b;
  }
  function results(){
    const xs=[200,500,800,1100];
    const spec=[['Bright',C.purple,['purple'],true],['Dim',C.orange,['orange-','red'],true],['Dark',C.yellow,['yellow'],true],['No leaf',C.orange,['orange-','red'],false]];
    let b='';
    spec.forEach(([name,fill,words,leaf],i)=>{
      b+=tube(xs[i],{liquid:fill,leaf});
      b+=T(xs[i],650,name,{anchor:'middle',size:50});
      words.forEach((w,k)=>{b+=T(xs[i],722+k*62,w,{anchor:'middle',size:46,weight:700});});
      b+=T(xs[i],874,'CO₂: ____',{anchor:'middle',size:46,weight:500,fill:C.co2});
    });
    b+=T(650,70,'Illustrative: not your results',{anchor:'middle',size:46,fill:'#8a2d12'});
    return svg('Illustrative indicator tubes after one hour','Illustrative results, not your results. Four sealed tubes after one hour in the same light, wraps removed for reading. Bright tube with a leaf: purple. Dim tube with a leaf: orange-red. Dark tube with a leaf: yellow. No-leaf control: orange-red. Under each tube is a blank line for the carbon dioxide change.',b,1300,900);
  }

  /* ---------- Indicator colour strip, word labels on every swatch ---------- */
  // Vertical: one swatch per row, more CO2 at the top. Readable in a half-width slot and in drawers.
  const SWATCH=[[C.yellow,'Yellow','much more CO₂'],[C.amber,'Orange','a little more CO₂'],[C.orange,'Orange-red','about air level'],[C.magenta,'Red-purple','a little less CO₂'],[C.purple,'Purple','much less CO₂']];
  function strip(s={}){
    let b=`<defs>${marker('strip-u-'+serial,C.co2)}${marker('strip-d-'+serial,C.co2)}</defs>`;
    const row=136,y0=70,sx=150;
    SWATCH.forEach(([fill,name,meaning],i)=>{
      const y=y0+i*row;
      b+=`<rect x="${sx}" y="${y}" width="170" height="${row-14}" rx="14" fill="${fill}" stroke="${C.ink}" stroke-width="4"/>`;
      const big=true;b+=T(sx+200,y+46,name,{size:big?50:44})+T(sx+200,y+106,meaning,{size:big?50:46,weight:500,fill:C.soft});
    });
    const top=y0+10,bot=y0+5*row-24;
    b+=`<path d="M70 ${(top+bot)/2-20}V${top+16}" stroke="${C.co2}" stroke-width="12" marker-end="url(#strip-u-${serial})"/><path d="M70 ${(top+bot)/2+20}V${bot-16}" stroke="${C.co2}" stroke-width="12" marker-end="url(#strip-d-${serial})"/>`;
    b+=T(20,y0-24,'more CO₂',{size:50,fill:C.co2})+T(20,bot+80,'less CO₂',{size:50,fill:C.co2});
    if(s.bracket!==false){
      const a=y0+row+6,z=y0+3*row-20,x=960;
      b+=`<path d="M${x} ${a}H${x+30}V${z}H${x}" fill="none" stroke="${C.ink}" stroke-width="5"/>`;
      b+=T(x+56,(a+z)/2-6,'hard to tell',{size:50})+T(x+56,(a+z)/2+60,'apart by eye',{size:50});
    }
    b+=T(20,bot+164,'CO₂ change only.',{size:50})+T(20,bot+234,'Not an O₂ test.',{size:50});
    return svg('Hydrogencarbonate indicator colour strip','Five labelled swatches from more to less carbon dioxide than air, top to bottom: yellow, much more carbon dioxide; orange, a little more; orange-red, about the air level; red-purple, a little less; purple, much less carbon dioxide.'+(s.bracket!==false?' Orange and orange-red are bracketed as hard to tell apart by eye.':'')+' The indicator shows carbon dioxide change only; it is not a test for oxygen.',b,s.bracket===false?1040:1520,y0+5*row+290);
  }
  const stripList=()=>strip({bracket:false});

  /* ---------- One leaf cell, two processes ---------- */
  function twoProcesses(){
    const small=(id,fill)=>`<marker id="${id}" markerWidth="2.6" markerHeight="2.6" refX="1.6" refY="1.3" orient="auto" markerUnits="strokeWidth" viewBox="0 0 4 4"><path d="M0 0L4 2L0 4Z" fill="${fill}"/></marker>`;
    let b=`<defs>${marker('tp-g-'+serial,C.co2)}${marker('tp-t-'+serial,C.o2)}${small('tp-G-'+serial,C.co2)}${small('tp-T-'+serial,C.o2)}</defs>`;
    const g=`url(#tp-g-${serial})`,t=`url(#tp-t-${serial})`,G=`url(#tp-G-${serial})`,Tt=`url(#tp-T-${serial})`;
    const cx1=420,cx2=900,cy=470;
    b+=`<rect x="200" y="250" width="920" height="470" rx="40" fill="#eef6e6" stroke="${C.leafDark}" stroke-width="10"/><rect x="218" y="268" width="884" height="434" rx="30" fill="none" stroke="#8fb37a" stroke-width="4"/>`;
    b+=`<ellipse cx="${cx1}" cy="${cy}" rx="140" ry="70" fill="${C.leaf}" stroke="${C.leafDark}" stroke-width="5"/>`;
    for(let i=0;i<4;i++)b+=`<rect x="${cx1-92+i*50}" y="${cy-20}" width="34" height="40" rx="5" fill="#2f6b22" stroke="#cfe3b8" stroke-width="2"/>`;
    b+=`<ellipse cx="${cx2}" cy="${cy}" rx="125" ry="62" fill="${C.mito}" stroke="${C.mitoDark}" stroke-width="5"/><path d="M${cx2-90} ${cy}c20-40 40 40 60 0s40 40 60 0 40 40 60 0" fill="none" stroke="${C.mitoDark}" stroke-width="5"/>`;
    b+=`<path d="M${cx2-130} ${cy}H${cx1+150}" stroke="${C.co2}" stroke-width="12" marker-end="${g}"/>`;
    b+=T((cx1+cx2)/2,cy+126,'respired CO₂ used',{anchor:'middle',size:40,weight:600,fill:C.co2})+T((cx1+cx2)/2,cy+178,'in photosynthesis',{anchor:'middle',size:40,weight:600,fill:C.co2});
    b+=T(cx1,335,'chloroplast',{anchor:'middle',size:40,weight:600});
    b+=T(cx2,335,'mitochondrion',{anchor:'middle',size:40,weight:600});
    b+=T(cx1,110,'Photosynthesis',{anchor:'middle',size:44,fill:C.leafDark})+T(cx1,176,'only in light',{anchor:'middle',size:42,weight:500,fill:C.soft});
    b+=T(cx2,110,'Respiration',{anchor:'middle',size:44,fill:C.mitoDark})+T(cx2,176,'all the time',{anchor:'middle',size:42,weight:500,fill:C.soft});
    // light reaches the chloroplast from the top-left
    b+=sun(70,300,'bright');
    b+=`<path d="M116 334L${cx1-130} ${cy-30}" stroke="${C.light}" stroke-width="10" stroke-dasharray="20 12"/>`;
    // photosynthesis: CO2 in from the left, O2 out below
    b+=`<path d="M-60 ${cy+40}H${cx1-160}" stroke="${C.co2}" stroke-width="28" marker-end="${G}"/>`+T(-60,cy+112,'CO₂ in',{size:42,fill:C.co2});
    b+=`<path d="M${cx1-70} ${cy+64}V850" stroke="${C.o2}" stroke-width="28" marker-end="${Tt}"/>`+T(cx1-40,860,'O₂ out',{size:42,fill:C.o2});
    // respiration: O2 in from the right, CO2 out below
    b+=`<path d="M1300 ${cy}H${cx2+132}" stroke="${C.o2}" stroke-width="9" marker-end="${t}"/>`+T(1300,cy-30,'O₂ in',{anchor:'end',size:42,fill:C.o2});
    b+=`<path d="M${cx2+70} ${cy+52}V860" stroke="${C.co2}" stroke-width="9" marker-end="${g}"/>`+T(cx2+100,860,'CO₂ out',{size:42,fill:C.co2});
    return svg('One leaf cell in light: photosynthesis and respiration at the same time','A leaf cell in light. On the left, a chloroplast receives light: carbon dioxide (grey) goes in and oxygen (teal) comes out, labelled photosynthesis, only in light. On the right, a mitochondrion: oxygen (teal) goes in and carbon dioxide (grey) comes out, labelled respiration, all the time. Both processes happen in the same cell at the same time. In light, the photosynthesis arrows (carbon dioxide in, oxygen out) are thicker than the respiration arrows, because photosynthesis is faster.',b,1320,900);
  }

  /* ---------- Two-rate CO2 budget (worked example: R = 4 a.u. per hour) ---------- */
  const SETTINGS = {
    dark:{light:'dark',word:'Dark',P:0,R:4,l1:'Net uptake = 0 − 4 = −4',l2:'Negative: CO₂ released · yellow'},
    dim:{light:'dim',word:'Dim',P:2,R:4,l1:'Net uptake = 2 − 4 = −2',l2:'Still negative: CO₂ released · towards yellow'},
    'dusk-q':{light:'dim',word:'Dusk',P:3,R:4,l1:'Net uptake = 3 − 4 = ?',l2:'Your turn: what does the sign mean?'},
    'bright-q':{light:'bright',word:'Bright',P:10,R:4,l1:'Net uptake = 10 − 4 = ?',l2:'What does it mean? Tube colour?'},
    bright:{light:'bright',word:'Bright',P:10,R:4,l1:'Net uptake = 10 − 4 = +6',l2:'Positive: CO₂ taken in · purple'},
    blank:{light:'blank',word:'',P:null,R:null,l1:'Net uptake = ___ − ___ = ___',l2:'+ means taken in · − means released'}
  };
  function budget(s={}){
    const seq=s.sequence, key=seq?seq[Math.min(s.step||0,seq.length-1)]:(s.setting||'bright');
    const S=SETTINGS[key]||SETTINGS.bright, u=46, x0=330;
    let b=`<defs>${marker('co2-head-'+serial,C.co2)}</defs>`;
    const head=`url(#co2-head-${serial})`;
    if(S.light==='blank')b+=sun(70,70,'dim')+T(160,92,'Light: ______',{size:46});
    else b+=sun(70,70,S.light)+T(160,92,'Light: '+S.word,{size:50});
    b+=leafShape(165,440,250,190);
    b+=T(165,585,'leaf',{anchor:'middle',size:44,fill:C.leafDark});
    const arrow=(y,len,dir)=>{
      if(len===0)return T(x0+10,y+16,'0: no light, no arrow',{size:44,fill:C.co2});
      const L=len===null?260:len*u;
      const d=dir==='in'?`M${x0+L} ${y}H${x0+6}`:`M${x0} ${y}H${x0+L-6}`;
      return `<path d="${d}" fill="none" stroke="${C.co2}" stroke-width="24" ${len===null?'stroke-dasharray="26 18" stroke-opacity=".55"':''} marker-end="${head}"/>`+
        T(x0+L+40,y+16,len===null?'___':len+' a.u.',{size:44,fill:C.co2});
    };
    b+=T(x0,200,'Photosynthesis (P): CO₂ used',{size:44})+T(x0,258,'needs light',{size:40,weight:500,fill:C.soft});
    b+=arrow(316,S.P,'in');
    b+=T(x0,420,'Respiration (R): CO₂ released',{size:44})+T(x0,478,'every light level, the same rate',{size:40,weight:500,fill:C.soft});
    b+=arrow(536,S.R,'out');
    b+=`<rect x="${x0-14}" y="600" width="1130" height="170" rx="14" fill="${C.paper}" stroke="${C.ink}" stroke-width="4"/>`+T(x0+10,668,S.l1,{size:46})+T(x0+10,740,S.l2,{size:40,weight:500});
    const words=S.P===null?'Blank budget: draw the two arrow lengths, then write net uptake = photosynthesis rate minus respiration rate, with its sign.':`Light: ${S.word}. Photosynthesis uses ${S.P} a.u. of CO₂ per hour; respiration releases ${S.R} a.u. per hour. ${S.l1.replace('?','unknown')}. ${S.l2}.`;
    return svg('Two-rate CO₂ budget for one leaf',words+' Grey arrows show CO₂. Arrow length shows rate in illustrative arbitrary units.',b,1480,790);
  }

  // Compact blank budget for the support card (phones and drawers): two arrows into and out of one leaf.
  function budgetCard(){
    // Same convention as the worked example: leaf on the left; P points in towards the leaf, R points out.
    let b=`<defs>${marker('card-head-'+serial,C.co2)}</defs>`;const head=`url(#card-head-${serial})`;
    b+=sun(50,60,'dim')+T(110,82,'Light: ______',{size:40});
    b+=leafShape(95,335,160,130)+T(95,450,'leaf',{anchor:'middle',size:38,fill:C.leafDark});
    b+=T(200,170,'Photosynthesis (P): CO₂ used',{size:38});
    b+=`<path d="M640 230H200" stroke="${C.co2}" stroke-width="22" stroke-dasharray="26 18" stroke-opacity=".6" marker-end="${head}"/>`+T(670,244,'rate: ___',{size:38,fill:C.co2});
    b+=T(200,380,'Respiration (R): CO₂ released',{size:38});
    b+=`<path d="M190 440H600" stroke="${C.co2}" stroke-width="22" stroke-dasharray="26 18" stroke-opacity=".6" marker-end="${head}"/>`+T(670,454,'rate: ___',{size:38,fill:C.co2});
    b+=`<rect x="10" y="530" width="960" height="160" rx="14" fill="${C.paper}" stroke="${C.ink}" stroke-width="4"/>`+T(30,594,'Net uptake = ___ − ___ = ___',{size:40})+T(30,660,'+ taken in · − released',{size:38,weight:500});
    return svg('Blank two-rate budget card','Blank budget, drawn like the worked example: a leaf on the left. The photosynthesis arrow points in towards the leaf (carbon dioxide used) and the respiration arrow points out of it (carbon dioxide released), each with a blank rate. Below: net uptake equals photosynthesis rate minus respiration rate, with blanks. A plus answer means taken in; a minus answer means released.',b,990,710);
  }

  /* ---------- Net CO2 uptake graphs ---------- */
  // Monotone cubic (Fritsch-Carlson): passes through every point and never overshoots a plateau.
  function monotonePath(pts){
    const n=pts.length,dx=[],m=[],t=[];
    for(let i=0;i<n-1;i++){dx[i]=pts[i+1][0]-pts[i][0];m[i]=(pts[i+1][1]-pts[i][1])/dx[i];}
    t[0]=m[0];t[n-1]=m[n-2];
    for(let i=1;i<n-1;i++)t[i]=m[i-1]*m[i]<=0?0:(m[i-1]+m[i])/2;
    for(let i=0;i<n-1;i++){if(m[i]===0){t[i]=0;t[i+1]=0;continue;}const a=t[i]/m[i],c=t[i+1]/m[i],h=a*a+c*c;if(h>9){const k=3/Math.sqrt(h);t[i]=k*a*m[i];t[i+1]=k*c*m[i];}}
    let d=`M${pts[0][0]} ${pts[0][1]}`;
    for(let i=0;i<n-1;i++){const h=dx[i]/3;d+=`C${pts[i][0]+h} ${pts[i][1]+t[i]*h} ${pts[i+1][0]-h} ${pts[i+1][1]-t[i+1]*h} ${pts[i+1][0]} ${pts[i+1][1]}`;}
    return d;
  }
  const GRAPHS={
    worked:{xs:[0,2,10,14],ys:[-4,-2,6,6],curve:[[0,-4],[2,-2],[4,0],[6,2],[8,4],[10,6],[14,6]],xMax:14,xLabelStep:2,xMinor:1,yMin:-4,yMax:8,yLabelStep:2,yMinor:1,title:'One leaf: net CO₂ uptake (illustrative)'},
    recheck:{xs:[0,1,2,3,4],ys:[-2,0,2,3,3],xMax:4,xLabelStep:1,xMinor:1,yMin:-3,yMax:4,yLabelStep:1,yMinor:1,title:'A different leaf: net CO₂ uptake (illustrative)'},
    sunflower:{xs:[0,2,4,6,8,10,12],ys:[-5,-2,1,4,6,7,7],xMax:12,xLabelStep:2,xMinor:1,yMin:-6,yMax:8,yLabelStep:2,yMinor:1,title:'Sunflower leaf at 20 °C (illustrative)'}
  };
  function graph(name,s={}){
    const G=GRAPHS[name],L=200,R=1300,Tp=60,B=580;
    const X=x=>L+(R-L)*x/G.xMax, Y=y=>B-(B-Tp)*(y-G.yMin)/(G.yMax-G.yMin);
    const step=s.step??2, showPoints=step>=1, showCurve=step>=2, regions=Boolean(s.regions)&&step>=2;
    let b='';
    for(let x=0;x<=G.xMax;x+=G.xMinor)b+=`<path d="M${X(x)} ${Tp}V${B}" stroke="${C.grid}" stroke-width="2"/>`;
    for(let y=G.yMin;y<=G.yMax;y+=G.yMinor)b+=`<path d="M${L} ${Y(y)}H${R}" stroke="${C.grid}" stroke-width="2"/>`;
    b+=`<path d="M${L} ${Tp}V${B}H${R}" fill="none" stroke="${C.ink}" stroke-width="4"/>`;
    b+=`<path d="M${L} ${Y(0)}H${R}" stroke="${C.ink}" stroke-width="6"/>`;
    for(let x=0;x<=G.xMax;x+=G.xLabelStep)b+=T(X(x),B+58,String(x),{anchor:'middle',size:40,weight:500});
    for(let y=G.yMin;y<=G.yMax;y+=G.yLabelStep)b+=T(L-20,Y(y)+16,y>0?'+'+y:y<0?'−'+Math.abs(y):'0',{anchor:'end',size:40,weight:500});
    b+=T((L+R)/2,B+132,'Light intensity (a.u.)',{anchor:'middle',size:42});
    b+=`<g transform="translate(10 ${(Tp+B)/2}) rotate(-90)">${T(0,0,'Net CO₂ uptake',{anchor:'middle',size:42})}${T(0,58,'(a.u. per hour)',{anchor:'middle',size:38,weight:500})}</g>`;
    const pts=G.xs.map((x,i)=>[X(x),Y(G.ys[i])]);
    const cpts=G.curve?G.curve.map(([x,y])=>[X(x),Y(y)]):pts;
    if(showCurve)b+=`<path d="${monotonePath(cpts)}" fill="none" stroke="${C.curve}" stroke-width="8" stroke-linecap="round"/>`;
    if(showPoints)pts.forEach(([x,y])=>{b+=`<path d="M${x-16} ${y-16}L${x+16} ${y+16}M${x+16} ${y-16}L${x-16} ${y+16}" stroke="#8a2d12" stroke-width="7" stroke-linecap="round"/>`;});
    if(regions){
      // label text at (x,y); leader from (lx,ly), a point clear of the text, to the curve at (tx,ty)
      const lab=(x,y,word,lx,ly,tx,ty)=>`<path d="M${lx} ${ly}L${tx} ${ty}" stroke="${C.soft}" stroke-width="4"/>`+T(x,y,word,{size:42});
      b+=lab(X(4.8),Y(-3.1),'below zero',X(4.7),Y(-2.9),X(1),Y(-3));
      b+=lab(X(4.8),Y(-1.3),'zero',X(4.7),Y(-1.0),X(4.05),Y(-0.1));
      b+=lab(X(8),Y(0.6),'rising',X(7.9),Y(1.0),X(7),Y(2.6));
      b+=lab(X(10.2),Y(3.4),'plateau',X(12),Y(4.4),X(12),Y(5.85));
    }
    const vals=G.xs.map((x,i)=>`light ${x}: ${G.ys[i]>0?'+':''}${G.ys[i]}`).join('; ');
    const desc=`Graph of net carbon dioxide uptake against light intensity, both in arbitrary units. The thick line is zero net uptake. ${showPoints?'Points: '+vals+'.':'Axes only, no points plotted yet.'} ${showCurve?'The curve starts below zero, crosses zero, rises, then levels off (plateau).':''} ${regions?'Regions labelled: below zero, zero, rising, plateau.':''}`;
    return svg(G.title,desc,b,1340,760);
  }

  /* ---------- Graph-region strip (support): four regions with blank comparison boxes ---------- */
  function regionStrip(){
    let b='';
    const names=['Below zero','Zero','Rising','Plateau'];
    names.forEach((name,i)=>{
      const x=20+(i%2)*440,y=20+Math.floor(i/2)*380;
      b+=`<rect x="${x}" y="${y}" width="420" height="356" rx="16" fill="${C.paper}" stroke="${C.ink}" stroke-width="4"/>`;
      b+=T(x+24,y+62,name,{size:42});
      // mini sketch: axes, dashed zero line at sy+45, the feature in red
      const sx=x+272,sy=y+80,z=sy+45,red=`stroke="#8a2d12" stroke-width="8" stroke-linecap="round"`;
      b+=`<path d="M${sx} ${sy}V${sy+90}H${sx+128}" fill="none" stroke="${C.soft}" stroke-width="3"/><path d="M${sx} ${z}H${sx+128}" stroke="${C.ink}" stroke-width="4" stroke-dasharray="8 6"/>`;
      if(i===0)b+=`<path d="M${sx+12} ${sy+86}L${sx+70} ${sy+62}" ${red}/>`;                       // entirely below the zero line
      if(i===1)b+=`<path d="M${sx+12} ${sy+80}L${sx+118} ${sy+10}" stroke="${C.soft}" stroke-width="4"/><circle cx="${sx+65}" cy="${z}" r="11" fill="#8a2d12"/>`; // a single crossing point
      if(i===2)b+=`<path d="M${sx+12} ${sy+84}L${sx+100} ${sy+12}" ${red}/>`;                      // the whole sloped part, from below zero up
      if(i===3)b+=`<path d="M${sx+12} ${sy+84}L${sx+60} ${sy+14}" stroke="${C.soft}" stroke-width="4"/><path d="M${sx+60} ${sy+14}H${sx+124}" ${red}/>`;
      if(i<2){b+=T(x+24,y+196,'P',{size:44})+`<rect x="${x+84}" y="${y+146}" width="80" height="66" rx="8" fill="#fff" stroke="${C.ink}" stroke-width="4"/>`+T(x+190,y+196,'R',{size:44});b+=T(x+24,y+266,'so net:',{size:40,weight:600,fill:C.soft});}
      else{b+=T(x+24,y+232,i===2?'P rises':'P levels off',{size:40,weight:600});b+=T(x+24,y+290,'limited by:',{size:40,weight:600,fill:C.soft});}
      b+=`<path d="M${x+24} ${y+332}H${x+396}" stroke="${C.ink}" stroke-width="3"/>`;
    });
    return svg('Graph-region strip','Four boxes for the features of a net carbon dioxide uptake graph. Below zero: a line segment entirely under the zero line, with a blank box between P and R and a line for the net result. Zero: a dot where the line crosses zero, with a blank box between P and R. Rising: the whole sloped part from below zero upwards, with a line for what limits photosynthesis. Plateau: the flat top, with a line for what limits photosynthesis.',b,900,780);
  }

  const figures={
    'tubes-illustrative':results,
    'indicator-strip':strip,
    'indicator-list':stripList,
    'two-processes':twoProcesses,
    'co2-budget':budget,
    'co2-budget-blank':budgetCard,
    'net-graph-worked':s=>graph('worked',{...s,step:2,regions:true}),
    'net-graph-sunflower':s=>graph('sunflower',{step:2}),
    'net-graph-recheck':s=>graph('recheck',{step:2}),
    'region-strip':regionStrip
  };
  return {render(name,state={}){return figures[name]?figures[name](state):'';},names:Object.keys(figures),graphs:GRAPHS};
})();

/* Crop each prepared diagram to its drawn and labelled content so labels are
   as large as the slot allows. The runtime calls prepare/recrop if present. */
window.LeafDiagramAccess=(()=>{
  function crop(svg){
    let b;try{b=svg.getBBox();}catch(_){return;}
    if(!b.width||!b.height)return;
    const pad=18;svg.setAttribute('viewBox',[b.x-pad,b.y-pad,b.width+2*pad,b.height+2*pad].join(' '));
  }
  function prepare(host){if(!host)return;for(const svg of host.querySelectorAll('svg.gas-science-diagram:not([data-cropped])')){svg.setAttribute('data-cropped','');crop(svg);}}
  function recrop(host){if(!host)return;for(const svg of host.querySelectorAll('svg.gas-science-diagram'))crop(svg);}
  return {prepare,recrop};
})();
