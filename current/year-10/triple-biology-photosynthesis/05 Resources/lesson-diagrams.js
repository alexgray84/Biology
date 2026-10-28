/* Original scientific schematics for L5 "A plan that convinces a sceptic", built 28 October 2026.
   Locked conventions: CO2 grey, O2 teal, light yellow. Leaf green.
   Hydrogencarbonate indicator: yellow = more CO2, orange-red = about air level,
   purple = less CO2. Every swatch carries a word label as well as a colour. CO2 change only: not an O2 test.
   The two coded examples are written for this lesson: never a pupil's answer.
   The flawed method is drawn from its written description: a pupil's method, not yours.
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

  /* ---------- A coded book line (two examples written for this lesson; never a pupil's answer) ---------- */
  // Teacher's code in red in the margin, always with its words; the revision in a different (green) pen. Drawn 2:1 for the step slot.
  const PEN='#2c7a3a', RED='#a3261b';
  function codedLine(s={}){
    const step=s.step||0, ex2=step>=2, revised=step===1||step===3;
    const W=1500,H=740,M=290,x0=M+24;
    let b=`<rect x="10" y="10" width="${W-20}" height="${H-20}" rx="14" fill="#fffdf6" stroke="${C.glass}" stroke-width="4"/>`;
    for(let y=118;y<H-30;y+=96)b+=`<path d="M20 ${y}H${W-20}" stroke="#c9d6e3" stroke-width="3"/>`;
    b+=`<path d="M${M} 20V${H-20}" stroke="#d98a80" stroke-width="4"/>`;
    b+=T(x0,88,ex2?'Example 2 · written for this lesson':'Example 1 · written for this lesson',{size:40,weight:600,fill:C.soft});
    b+=T(x0,190,ex2?'“This proves the leaf photosynthesised.”':'“At 3.3 nothing is happening.”',{size:ex2?40:48,weight:650});
    b+=`<circle cx="${M/2}" cy="172" r="60" fill="none" stroke="${RED}" stroke-width="8"/>`+T(M/2,198,ex2?'J':'R',{anchor:'middle',size:60,weight:800,fill:RED});
    (ex2?['Judge','the claim']:['Both','rates']).forEach((w,i)=>{b+=T(M/2,290+i*52,w,{anchor:'middle',size:36,weight:700,fill:RED});});
    if(revised){
      b+=`<rect x="${W-400}" y="218" width="370" height="70" rx="10" fill="#eaf4ec" stroke="${PEN}" stroke-width="3"/>`+T(W-215,268,'different pen',{anchor:'middle',size:36,weight:700,fill:PEN});
      const lines=ex2?['Rung: supports at most, not proves.','CO₂ fell overall, so P > R. But with','no control, the indicator may have','changed by itself. Add a control.']:['P = R at 3.3','Photosynthesis is as fast as','respiration, so no net CO₂ exchange.','Both processes continue.'];
      lines.forEach((t,i)=>{b+=T(x0,374+i*96,t,{size:44,weight:650,fill:PEN});});
    }else{
      b+=T(x0,374,ex2?'Next: pick a rung, use the control,':'Next: write P __ R with >, < or =,',{size:42,weight:500,fill:C.soft})+T(x0,470,ex2?'then one way to make it stronger.':'then rewrite with both rates.',{size:42,weight:500,fill:C.soft});
    }
    const code=ex2?'J, judge the claim':'R, both rates';
    const desc=`A page from an exercise book. ${ex2?'Example 2':'Example 1'}, written for this lesson and not taken from a pupil's work: the answer reads "${ex2?'This proves the leaf photosynthesised.':'At 3.3 nothing is happening.'}" The teacher's code is circled in red in the margin: ${code}. `+(revised?`Below, in a different pen (green): ${(ex2?'Rung: supports at most, not proves. CO₂ fell overall, so photosynthesis was faster than respiration. But with no control, the indicator may have changed by itself. Add a control.':'P equals R at 3.3. Photosynthesis is as fast as respiration, so there is no net CO₂ exchange. Both processes continue.')}`:'The board activity for this code comes next.');
    return svg('A coded answer and its revision',desc,b,W,H);
  }

  /* ---------- The flawed method, drawn as described (a pupil's method, not yours). 2:1 for the side slot ---------- */
  function openTube(cx,{top=300,bottom=700,leaf=true,liquid=C.orange}={}){
    const w=112,x=cx-w/2;
    let t=`<path d="M${x} ${top}V${bottom-56}A56 56 0 0 0 ${x+w} ${bottom-56}V${top}" fill="#f4f7fa" stroke="${C.glass}" stroke-width="6"/>`;
    t+=`<path d="M${x+5} ${bottom-200}V${bottom-56}A51 51 0 0 0 ${x+w-5} ${bottom-56}V${bottom-200}Z" fill="${liquid}"/>`;
    if(leaf)t+=`<path d="M${cx-38} ${bottom-182}C${cx-14} ${bottom-234} ${cx+18} ${bottom-234} ${cx+40} ${bottom-186}C${cx+16} ${bottom-168} ${cx-16} ${bottom-164} ${cx-38} ${bottom-182}Z" fill="${C.leaf}" stroke="${C.leafDark}" stroke-width="4"/>`;
    return t;
  }
  function flawedMethod(){
    const W=1640,H=900;
    let b=`<defs>${marker('fm-d-'+serial,C.ink)}</defs>`;const head=`url(#fm-d-${serial})`;
    b+=`<path d="M70 420H250V680Q250 710 220 710H100Q70 710 70 680Z" fill="${C.orange}" stroke="${C.glass}" stroke-width="6"/><rect x="120" y="350" width="80" height="72" fill="#f4f7fa" stroke="${C.glass}" stroke-width="6"/><rect x="108" y="322" width="104" height="36" rx="6" fill="${C.bung}"/>`;
    b+=T(160,190,'indicator,',{anchor:'middle',size:44})+T(160,248,'from the',{anchor:'middle',size:44})+T(160,306,'bottle',{anchor:'middle',size:44});
    const xs=[560,900,1240];
    b+=openTube(xs[0])+openTube(xs[1])+openTube(xs[2]);
    b+=`<path d="M${xs[0]-110} 120H${xs[0]+110}L${xs[0]+70} 40H${xs[0]-70}Z" fill="#59616b" stroke="${C.ink}" stroke-width="5"/><circle cx="${xs[0]}" cy="160" r="34" fill="#fff6cf" stroke="${C.lightLine}" stroke-width="5"/><path d="M${xs[0]-18} 166q9-22 18 0t18 0" fill="none" stroke="#c2410c" stroke-width="5"/>`;
    for(const dx of [-60,0,60])b+=`<path d="M${xs[0]+dx*0.6} 204L${xs[0]+dx} 268" stroke="${C.light}" stroke-width="8" stroke-linecap="round"/>`;
    b+=`<path d="M${xs[0]+140} 166V296" stroke="${C.ink}" stroke-width="5" marker-end="${head}"/><path d="M${xs[0]+140} 296V166" stroke="${C.ink}" stroke-width="5" marker-end="${head}"/>`+T(xs[0]+164,250,'10 cm',{size:44});
    b+=`<path d="M${xs[1]-80} 300Q${xs[1]-50} 280 ${xs[1]-20} 300T${xs[1]+40} 300T${xs[1]+80} 300V710H${xs[1]-80}Z" fill="#ffffff" fill-opacity=".72" stroke="#9aa3ad" stroke-width="4" stroke-dasharray="14 10"/>`;
    b+=`<path d="M${xs[2]-74} 290H${xs[2]+74}V716H${xs[2]-74}Z" fill="#c3c8ce" stroke="#7d858f" stroke-width="5"/>`;
    for(let y=330;y<700;y+=70)b+=`<path d="M${xs[2]-60} ${y}l30 22l26-18l30 20l34-16" fill="none" stroke="#8f98a2" stroke-width="4"/>`;
    b+=T(xs[0],776,'lamp',{anchor:'middle',size:44})+T(xs[1],776,'tissue',{anchor:'middle',size:44})+T(xs[2],776,'foil',{anchor:'middle',size:44});
    b+=`<circle cx="1440" cy="380" r="40" fill="#fff" stroke="${C.ink}" stroke-width="5"/><path d="M1440 380V352M1440 380L1460 390" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/>`+T(1440,476,'10 min',{anchor:'middle',size:44});
    b+=`<path d="M1400 600Q1440 562 1480 600Q1440 638 1400 600Z" fill="#fff" stroke="${C.ink}" stroke-width="5"/><circle cx="1440" cy="600" r="13" fill="${C.ink}"/>`+T(1440,696,'by eye',{anchor:'middle',size:44});
    b+=T(900,866,'a leaf in each tube',{anchor:'middle',size:42,weight:600,fill:C.soft});
    return svg('A pupil’s method, drawn as described','Drawn from the written method, not from your practical. A bottle of hydrogencarbonate indicator, used straight from the bottle. Three open tubes of orange-red indicator, each with a leaf in the tube. Tube 1 is 10 cm below a desk lamp with a filament bulb. Tube 2 is covered with tissue. Tube 3 is wrapped in foil. A clock shows 10 minutes, and an eye shows the colours are judged by eye.',b,W,H);
  }

  /* ---------- The model set-up: one focused panel per live-model step (2:1 for the step slot) ---------- */
  function sealedTube(cx,{top=0,h=520,w=120,discs=true,liquid=C.orange,bung=true}={}){
    const x=cx-w/2,bottom=top+h;
    let t=`<path d="M${x} ${top}V${bottom-w/2}A${w/2} ${w/2} 0 0 0 ${x+w} ${bottom-w/2}V${top}" fill="#f4f7fa" stroke="${C.glass}" stroke-width="6"/>`;
    t+=`<path d="M${x+5} ${bottom-h*0.34}V${bottom-w/2}A${w/2-5} ${w/2-5} 0 0 0 ${x+w-5} ${bottom-w/2}V${bottom-h*0.34}Z" fill="${liquid}"/>`;
    const gy=bottom-h*0.48;
    t+=`<path d="M${x+6} ${gy}H${x+w-6}" stroke="#7c6a55" stroke-width="7" stroke-dasharray="9 6"/>`;
    if(discs)for(let i=0;i<5;i++)t+=`<ellipse cx="${x+16+i*(w-32)/4}" cy="${gy-12}" rx="${w/12}" ry="9" fill="${C.leaf}" stroke="${C.leafDark}" stroke-width="3"/>`;
    if(bung)t+=`<rect x="${x-10}" y="${top-40}" width="${w+20}" height="52" rx="8" fill="${C.bung}"/>`;
    return {svg:t,gy,bottom};
  }
  function modelSetup(s={}){
    const seq=s.sequence, step=Math.min(3,seq?seq[Math.min(s.step||0,seq.length-1)]:(s.step||0)), W=1600, H=820;
    let b=T(20,64,['Step 1 · same stock, equilibrated','Step 2 · one tube, sealed','Step 3 · first draft','Step 3 · rewritten: how and why'][step],{size:44});
    const lab=(x,y,words,o={})=>words.map((w,i)=>T(x,y+i*58,w,{size:44,weight:600,...o})).join('');
    if(step===0){
      b+=`<path d="M120 300H380V700Q380 730 350 730H150Q120 730 120 700Z" fill="${C.orange}" stroke="${C.glass}" stroke-width="6"/><rect x="200" y="206" width="100" height="96" fill="#f4f7fa" stroke="${C.glass}" stroke-width="6"/>`;
      b+=`<path d="M250 140V690" stroke="${C.ink}" stroke-width="7"/><rect x="190" y="110" width="120" height="44" rx="8" fill="#9aa3ad" stroke="${C.ink}" stroke-width="4"/>`;
      for(const [x,y,r] of [[238,660,14],[264,600,11],[242,540,13],[266,480,10],[240,420,12],[262,360,10]])b+=`<circle cx="${x}" cy="${y}" r="${r}" fill="#ffffff" fill-opacity=".85" stroke="${C.co2}" stroke-width="3"/>`;
      b+=lab(340,148,['room air'],{fill:C.soft})+lab(430,420,['bubbled until','steady orange-red']);
      const xs=[1000,1120,1240,1360,1480];
      xs.forEach(x=>{const t=sealedTube(x,{top:400,h:320,w:84,discs:false,bung:false});b+=t.svg;});
      b+=lab(930,300,['10 cm³ into each','of 15 tubes'])+T(1240,800,'every tube starts the same',{anchor:'middle',size:42,weight:600,fill:C.soft});
    }else if(step===1){
      const t=sealedTube(420,{top:150,h:620,w:170});b+=t.svg;
      const lead=(y,ty)=>`<path d="M640 ${y-14}H560L520 ${ty}" fill="none" stroke="${C.soft}" stroke-width="4"/>`;
      b+=lead(150,140)+lab(660,150,['bung: sealed, so the gas','exchanged stays in the tube']);
      b+=lead(t.gy-90,t.gy-12)+lab(660,t.gy-90,['5 leaf discs, one plant,','one cork borer']);
      b+=lead(t.gy+40,t.gy)+lab(660,t.gy+40,['gauze: discs above the','indicator, not in it']);
      b+=lead(t.bottom-90,t.bottom-90)+lab(660,t.bottom-90,['10 cm³ equilibrated','indicator']);
    }else{
      const y0=150;
      b+=`<rect x="40" y="${y0+60}" width="80" height="380" rx="10" fill="${C.light}" stroke="${C.lightLine}" stroke-width="5"/>`+T(80,y0+520,'LED',{anchor:'middle',size:44});
      const rayEnd=step===3?340:780;
      for(const dy of [130,250,370])b+=`<path d="M134 ${y0+dy}H${rayEnd}" stroke="${C.light}" stroke-width="9" stroke-dasharray="24 14"/>`;
      if(step===3){
        b+=`<rect x="360" y="${y0+80}" width="170" height="360" rx="8" fill="#e6eef0" stroke="${C.glass}" stroke-width="6"/><path d="M366 ${y0+126}H524" stroke="#9fb2b8" stroke-width="4"/>`+T(445,y0+520,'water tank',{anchor:'middle',size:42,weight:600});
        for(const dy of [130,250,370])b+=`<path d="M550 ${y0+dy}H780" stroke="${C.light}" stroke-width="9" stroke-dasharray="24 14"/>`;
      }
      const t=sealedTube(860,{top:y0+110,h:360,w:110});b+=t.svg+T(860,y0+580,'leaf tube',{anchor:'middle',size:42,weight:600});
      if(step===3){
        b+=`<path d="M990 ${y0+110}V${y0+420}A44 44 0 0 0 1078 ${y0+420}V${y0+110}" fill="#eef3f5" stroke="${C.glass}" stroke-width="6"/><rect x="1022" y="${y0+50}" width="24" height="390" rx="12" fill="#fff" stroke="${C.ink}" stroke-width="4"/><circle cx="1034" cy="${y0+440}" r="22" fill="#b23a2a"/><rect x="1028" y="${y0+250}" width="12" height="190" fill="#b23a2a"/>`;
        b+=T(1034,y0+640,'thermometer',{anchor:'middle',size:42,weight:600});
        b+=lab(1140,y0+150,['most heat','absorbed by','the water;','temperature','checked'],{size:42});
      }else{
        b+=`<rect x="1010" y="${y0+90}" width="580" height="400" rx="12" fill="#fbeee9" stroke="${RED}" stroke-width="4"/>`+lab(1040,y0+160,['Draft: “Keep the','temperature','the same.”'])+lab(1040,y0+378,['Not an action.','No why.'],{weight:700,fill:RED});
      }
    }
    const desc=['Step 1: a stock bottle of hydrogencarbonate indicator with room air bubbled through it from a tube until it is a steady orange-red; 10 cubic centimetres then goes into each of 15 tubes, so every tube starts at the same carbon dioxide level.','Step 2: one boiling tube, sealed with a bung so the gas exchanged stays in the tube. Five leaf discs from one plant, cut with one cork borer, sit on a gauze platform above 10 cubic centimetres of equilibrated indicator, not in it.','Step 3, first draft: an LED shines on the leaf tube. The draft step reads "Keep the temperature the same", marked: not an action, no why.','Step 3, rewritten: an LED shines through a glass tank of water before reaching the leaf tube, so most of the heat is absorbed by the water. A thermometer stands in a water-filled tube beside the leaf tube to check the temperature.'][step];
    return svg('Model set-up, step '+(step+1),desc,b,W,H);
  }

  /* ---------- The code board: all six codes visible together, each letter with its words ---------- */
  // state.cells = [[letter, words, plain text], ...] (from the lesson data, so the board and the device page agree)
  function wrapText(text,max){const out=[];let line='';for(const w of String(text).split(/ +/)){if(!w)continue;if((line+' '+w).trim().length>max&&line){out.push(line);line=w;}else line=(line+' '+w).trim();}if(line)out.push(line);return out;}
  function codeBoard(s={}){
    const cells=s.cells||[],cols=3,cw=800,rows=Math.ceil(cells.length/cols),maxH=s.maxH||580;
    // Largest text that keeps the board within its slot shape (all six codes always visible together).
    const layout=fs=>{const lh=Math.round(fs*1.25*1.18),max=Math.floor((cw-64)/(fs*1.25*0.54)),wrapped=cells.map(c=>wrapText(c[2],max)),lines=Math.max(1,...wrapped.map(w=>w.length)),ch=104+lines*lh+22;return {fs,lh,wrapped,ch,H:rows*ch};};
    let L=layout(28);for(let f=48;f>=28;f--){const t=layout(f);if(t.H<=maxH){L=t;break;}}
    const {fs,lh,wrapped,ch}=L;
    let b='';
    cells.forEach(([k,words],i)=>{
      const x=(i%cols)*cw,y=Math.floor(i/cols)*ch;
      b+=`<rect x="${x+8}" y="${y+8}" width="${cw-16}" height="${ch-16}" rx="16" fill="#fffdf6" stroke="${C.grid}" stroke-width="4"/>`;
      b+=`<circle cx="${x+66}" cy="${y+62}" r="38" fill="#fff" stroke="#a3261b" stroke-width="7"/>`+T(x+66,y+82,k,{anchor:'middle',size:44,weight:800,fill:'#a3261b'})+T(x+120,y+80,words,{size:42,weight:750,fill:'#7d1d14'});
      wrapped[i].forEach((t,j)=>{b+=T(x+30,y+104+(j+1)*lh-14,t,{size:fs,weight:500});});
    });
    const desc=cells.map(([k,words,text])=>`${k}, ${words}: ${text}`).join(' ');
    return svg(s.title||'Code board',`Six codes, each letter with its words. ${desc}`,b,cols*cw,rows*ch);
  }
  const figures={
    'indicator-strip':strip,
    'indicator-list':stripList,
    'co2-budget-blank':budgetCard,
    'region-strip':regionStrip,
    'coded-line':codedLine,
    'method-flawed':flawedMethod,
    'method-model':modelSetup,
    'code-board':codeBoard
  };
  return {render(name,state={}){return figures[name]?figures[name](state):'';},names:Object.keys(figures)};
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
