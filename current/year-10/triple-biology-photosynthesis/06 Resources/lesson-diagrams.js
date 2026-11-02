/* Original scientific schematics for "What does a plant need, and how do we know?" (Year 10 Triple Biology),
   built 29 October 2026 from the confirmed evidence-lesson design.
   Locked conventions: CO2 grey (drawn as O=C=O, so shape as well as colour), O2 teal, light yellow, leaf green.
   Iodine: blue-black = starch, orange-brown = no starch; every swatch carries its words.
   All leaf and tray results are labelled illustrative. Nothing here is a measured result.
   BioDiagrams.render(name,state) returns accessible inline SVG. state.print = true gives the black-and-white
   palette used on the printed handout (word labels carry every meaning, so it photocopies). */
window.BioDiagrams = (() => {
  'use strict';
  const COLOUR = { ink:'#182944', soft:'#475566', leaf:'#4f8a3c', leafDark:'#2f5f25', vein:'#cfe3b8', glass:'#6f7d8c', water:'#e4eff1',
    co2:'#5f6670', co2Light:'#9aa1a9', o2:'#1f8a84', light:'#f2b705', lightLine:'#b98700', orangeBrown:'#c2702a', blueBlack:'#1f2440',
    white:'#f6f2e4', foil:'#c3c9cf', foilLine:'#7c858e', yellowLeaf:'#d8c24a', paleLeaf:'#a9c58f', paper:'#fbf8f0', red:'#b23a2a',
    metal:'#9aa3ad', tile:'#ffffff', flame:'#e58e2a', ethanol:'#f3f0d6', highlight:'#96671c' };
  const MONO = { ink:'#111111', soft:'#333333', leaf:'#9c9c9c', leafDark:'#222222', vein:'#e2e2e2', glass:'#3a3a3a', water:'#f1f1f1',
    co2:'#3c3c3c', co2Light:'#9a9a9a', o2:'#1a1a1a', light:'#d0d0d0', lightLine:'#444444', orangeBrown:'#d9d9d9', blueBlack:'#262626',
    white:'#ffffff', foil:'#c4c4c4', foilLine:'#2a2a2a', yellowLeaf:'#ececec', paleLeaf:'#c9c9c9', paper:'#ffffff', red:'#2a2a2a',
    metal:'#9a9a9a', tile:'#ffffff', flame:'#8a8a8a', ethanol:'#f6f6f6', highlight:'#111111' };
  let C = COLOUR, serial = 0, LS = 1;
  const esc = v => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const F = 1.25; // label scale, as in the unit's earlier diagrams
  const T = (x,y,value,{anchor='start',size=46,weight=600,fill=C.ink,italic=false}={}) => { const z=Math.round(size*F*LS); return `<text x="${x}" y="${y}" text-anchor="${anchor}" fill="${fill}" font-family="Montserrat,system-ui,sans-serif" font-size="${z}" font-weight="${weight}"${italic?' font-style="italic"':''} style="font-size:${z}px">${esc(value)}</text>`; };
  const lines = (x,y,words,o={}) => `<g data-label>${words.map((w,i)=>T(x,y+i*Math.round((o.size||46)*F*LS*1.12),w,o)).join('')}</g>`;
  function svg(title,desc,body,w,h,cls=''){
    const id=`ev-figure-${++serial}`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="${id}-title ${id}-desc" class="gas-science-diagram${cls?' '+cls:''}"><title id="${id}-title">${esc(title)}</title><desc id="${id}-desc">${esc(desc)}</desc>${body}</svg>`;
  }
  // A leader line; target names the data-part its end dot must land on (checked in the browser by the label probe).
  const lead = (x1,y1,x2,y2,target='') => `<g data-lead${target?` data-target="${target}"`:''}><path d="M${x1} ${y1}L${x2} ${y2}" stroke="${C.soft}" stroke-width="4" fill="none"/><circle cx="${x2}" cy="${y2}" r="7" fill="${C.soft}"/></g>`;
  const arrowHead = (id,fill) => `<marker id="${id}" markerWidth="4" markerHeight="4" refX="2.4" refY="2" orient="auto" markerUnits="strokeWidth"><path d="M0 0L4 2L0 4Z" fill="${fill}"/></marker>`;
  const foilPattern = id => `<pattern id="${id}" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="18" height="18" fill="${C.foil}"/><path d="M0 0V18" stroke="${C.foilLine}" stroke-width="4"/></pattern>`;
  // CO2 by shape as well as colour: O=C=O, three linked circles
  const co2 = (x,y,r=16) => `<g aria-hidden="true"><path d="M${x-2.2*r} ${y}H${x+2.2*r}" stroke="${C.co2}" stroke-width="${r*0.5}"/><circle cx="${x-2.1*r}" cy="${y}" r="${r}" fill="${C.co2Light}" stroke="${C.co2}" stroke-width="4"/><circle cx="${x}" cy="${y}" r="${r*1.05}" fill="${C.co2}" stroke="${C.co2}" stroke-width="4"/><circle cx="${x+2.1*r}" cy="${y}" r="${r}" fill="${C.co2Light}" stroke="${C.co2}" stroke-width="4"/></g>`;
  const leafD = (cx,cy,w,h) => `M${cx-w/2} ${cy}C${cx-w/4} ${cy-h*0.78} ${cx+w/4} ${cy-h*0.72} ${cx+w/2} ${cy}C${cx+w/4} ${cy+h*0.72} ${cx-w/4} ${cy+h*0.78} ${cx-w/2} ${cy}Z`;
  /* One leaf. o.edge (variegated edge colour) / o.centre; o.band = {fill,width} foil or result band, clipped to the leaf */
  function leaf(cx,cy,w,h,o={}){
    const id=`leaf-clip-${++serial}`;
    let b=`<defs><clipPath id="${id}"><path d="${leafD(cx,cy,w,h)}"/></clipPath>${o.band&&o.band.foil?foilPattern(id+'-foil'):''}</defs>`;
    b+=`<path d="${leafD(cx,cy,w,h)}" fill="${o.edge||o.centre||C.leaf}"/>`;
    if(o.edge)b+=`<path d="${leafD(cx,cy,w*0.66,h*0.58)}" fill="${o.centre||C.leaf}"/>`;
    if(o.inner)b+=`<path d="${leafD(cx,cy,w*0.66,h*0.58)}" fill="none" stroke="${C.leafDark}" stroke-width="3" stroke-dasharray="10 8"/>`;
    if(o.band){const bw=o.band.width||w*0.22;b+=`<rect x="${cx-bw/2}" y="${cy-h}" width="${bw}" height="${2*h}" fill="${o.band.foil?`url(#${id}-foil)`:o.band.fill}" clip-path="url(#${id})"/>`;
      if(o.band.foil)b+=`<path d="M${cx-bw/2} ${cy-h*0.66}V${cy+h*0.66}M${cx+bw/2} ${cy-h*0.66}V${cy+h*0.66}" stroke="${C.foilLine}" stroke-width="4" clip-path="url(#${id})"/>`;}
    b+=`<path d="M${cx-w/2+10} ${cy}H${cx+w/2-16}" stroke="${o.midrib||C.vein}" stroke-width="5" opacity=".9"/>`;
    b+=`<path d="${leafD(cx,cy,w,h)}" fill="none" stroke="${C.leafDark}" stroke-width="5"/>`;
    b+=`<path d="M${cx-w/2} ${cy}h-70" stroke="${C.leafDark}" stroke-width="9" stroke-linecap="round"/>`;
    return b;
  }
  const swatch = (x,y,fill,words,size=40) => `<rect x="${x}" y="${y-44}" width="62" height="54" rx="8" fill="${fill}" stroke="${C.ink}" stroke-width="4"/>`+T(x+80,y,words,{size});
  const illustrative = (x,y,anchor='start',size=38) => T(x,y,'Illustrative result, not real data',{anchor,size,weight:500,fill:C.soft,italic:true});

  /* ---------- 1 · Pondweed set-up: LED → heat shield → tube; thermometer; metre rule ---------- */
  function pondweed(s={}){
    const W=1900,H=960,face=300,cm=34,tubeX=face+10*cm; // tube drawn at 10 cm
    const ah='pw-ah-'+(++serial);
    let b=`<defs>${arrowHead(ah,C.soft)}</defs>`;
    // bench and metre rule
    b+=`<path d="M40 712H1880" stroke="${C.ink}" stroke-width="6"/>`;
    b+=`<rect x="${face}" y="722" width="${42*cm}" height="54" rx="6" fill="${C.paper}" stroke="${C.ink}" stroke-width="4"/>`;
    for(let d=0;d<=42;d++){const x=face+d*cm,major=[0,10,20,40].includes(d);b+=`<path d="M${x} 722V${722+(major?54:d%5===0?30:16)}" stroke="${C.ink}" stroke-width="${major?7:3}"/>`;}
    for(const d of [0,10,20,40])b+=T(face+d*cm,846,d?d+' cm':'0',{anchor:'middle',size:44,weight:700});
    b+=T(face,920,'metre rule: lamp face to tube centre',{size:42,weight:600,fill:C.soft});
    // LED lamp
    b+=`<rect x="70" y="672" width="230" height="40" rx="10" fill="${C.metal}" stroke="${C.ink}" stroke-width="4"/><path d="M150 672V470H205" fill="none" stroke="${C.ink}" stroke-width="14" stroke-linecap="round"/>`;
    b+=`<rect x="200" y="400" width="96" height="170" rx="14" fill="${C.metal}" stroke="${C.ink}" stroke-width="5"/><rect x="284" y="412" width="16" height="146" rx="4" fill="${C.light}" stroke="${C.lightLine}" stroke-width="3"/>`;
    b+=T(60,360,'LED lamp',{size:46,weight:700});
    // light rays: lamp → shield → tube
    for(const y of [440,486,532]){b+=`<path d="M308 ${y}H${tubeX-160}" stroke="${C.light}" stroke-width="9" stroke-dasharray="22 12"/>`;}
    b+=T(318,620,'light',{size:42,weight:700,fill:C.lightLine});
    // heat shield: beaker of water touching the tube
    const sx0=tubeX-158,sx1=tubeX-42;
    b+=`<g data-part="shield"><path d="M${sx0} 330V700H${sx1}V330" fill="none" stroke="${C.glass}" stroke-width="6"/><rect x="${sx0+3}" y="372" width="${sx1-sx0-6}" height="325" fill="${C.water}"/><path d="M${sx0+3} 372H${sx1-3}" stroke="${C.glass}" stroke-width="3"/></g>`;
    for(const y of [440,486,532])b+=`<path d="M${sx0+6} ${y}H${tubeX+8}" stroke="${C.light}" stroke-width="7" stroke-dasharray="14 10" opacity=".7"/>`;
    b+=lines(40,120,['heat shield:','beaker of water'],{size:44,weight:700})+lead(560,160,sx0+30,410,'shield');
    // boiling tube with pondweed
    const t0=tubeX-40,t1=tubeX+40,top=230,bot=690;
    b+=`<path data-part="solution" d="M${t0} ${top}V${bot-40}A40 40 0 0 0 ${t1} ${bot-40}V${top}" fill="${C.water}" stroke="${C.glass}" stroke-width="6"/><path d="M${t0+3} 290H${t1-3}" stroke="${C.glass}" stroke-width="3"/>`;
    // sprig: cut end at the top, leaves in whorls, paperclip near the base
    b+=`<g data-part="sprig"><path d="M${tubeX} 352V640" stroke="${C.leafDark}" stroke-width="8"/>`;
    for(const y of [400,450,500,550,600]){for(const sg of [-1,1])b+=`<path d="M${tubeX} ${y}q${sg*20} 6 ${sg*32} 30" stroke="${C.leaf}" stroke-width="7" fill="none" stroke-linecap="round"/>`;}
    b+=`<path d="M${tubeX-12} 346L${tubeX+12} 358" stroke="${C.leafDark}" stroke-width="6"/></g>`;
    b+=`<g data-part="paperclip"><rect x="${tubeX-16}" y="608" width="32" height="56" rx="14" fill="none" stroke="${C.metal}" stroke-width="6"/><rect x="${tubeX-8}" y="616" width="16" height="36" rx="8" fill="none" stroke="${C.metal}" stroke-width="5"/></g>`;
    b+=`<g data-part="bubbles">`;for(const [x,y,r] of [[tubeX+2,330,9],[tubeX-6,310,8],[tubeX+5,298,7]])b+=`<circle cx="${x}" cy="${y}" r="${r}" fill="#ffffff" stroke="${C.o2}" stroke-width="4"/>`;b+=`</g>`;
    // thermometer
    b+=`<g data-part="thermometer"><rect x="${tubeX+20}" y="150" width="14" height="430" rx="7" fill="#ffffff" stroke="${C.ink}" stroke-width="3"/><circle cx="${tubeX+27}" cy="586" r="13" fill="${C.red}"/><rect x="${tubeX+24}" y="430" width="7" height="150" fill="${C.red}"/></g>`;
    // labels on the right
    const lx=800;
    b+=T(lx,182,'thermometer',{size:44,weight:700})+lead(lx-14,170,tubeX+27,190,'thermometer');
    b+=T(lx,290,'gas bubbles, mostly O₂',{size:44,weight:700,fill:C.o2})+lead(lx-14,278,tubeX+2,330,'bubbles');
    b+=T(lx,398,'pondweed, cut end up',{size:44,weight:700})+lead(lx-14,386,tubeX,356,'sprig');
    b+=T(lx,506,'paperclip holds it down',{size:44,weight:700})+lead(lx-14,494,tubeX+16,632,'paperclip');
    b+=lines(lx,600,['1 % sodium hydrogencarbonate','solution: supplies CO₂'],{size:44,weight:700})+lead(lx-14,588,tubeX+24,668,'solution');
        const desc='Side view. An LED desk lamp on the left shines light to the right. Between the lamp and a boiling tube stands a heat shield: a beaker of water touching the side of the tube. The tube holds 1 per cent sodium hydrogencarbonate solution, which supplies carbon dioxide, and a sprig of pondweed with its cut end at the top, held down by a paperclip. Gas bubbles, mostly oxygen, rise from the cut end. A thermometer stands in the tube. A metre rule on the bench measures from the lamp face to the centre of the tube, with marks at 0, 10, 20 and 40 centimetres; the tube is shown at 10 centimetres.';
    return svg('Pondweed set-up with a heat shield',desc,b,W,H);
  }

  /* ---------- 2 · Starch-test steps (four icons) ---------- */
  function starchSteps(s={}){
    // One row of four panels: action, icon, and its reason. The first reason is given; the rest are blank lines
    // (handout box B1 uses the same strip). s.blank=false is never used: reasons are written by pupils.
    const W=1880,H=s.print?720:610,pw=470;const ah='st-ah-'+(++serial);
    let b=`<defs>${arrowHead(ah,C.soft)}</defs>`;
    const names=[['1 · Boil in water','about 1 minute'],['2 · Ethanol in a','hot water bath'],['3 · Rinse in','warm water'],['4 · Add iodine','solution']];
    const smallLeaf=(cx,cy,w=150,h=80,fill=C.leaf)=>`<path d="${leafD(cx,cy,w,h)}" fill="${fill}" stroke="${C.leafDark}" stroke-width="4"/>`;
    const beaker=(x,y,w,h,fill)=>`<path d="M${x} ${y}V${y+h}H${x+w}V${y}" fill="none" stroke="${C.glass}" stroke-width="6"/><rect data-bg x="${x+3}" y="${y+30}" width="${w-6}" height="${h-33}" fill="${fill}"/>`;
    const sz=s.print?34:36;
    names.forEach(([a,bb],i)=>{
      const x=i*pw+10,cx=x+(pw-30)/2;
      b+=`<rect data-bg x="${x}" y="10" width="${pw-30}" height="${H-20}" rx="18" fill="${C.paper}" stroke="${C.ink}" stroke-width="4"/>`;
      b+=`<g data-label>${T(x+22,72,a,{size:sz+2,weight:750})+T(x+22,124,bb,{size:sz,weight:600,fill:C.soft})}</g>`;
      const y0=150;
      if(i===0){b+=beaker(cx-110,y0+20,220,190,C.water)+smallLeaf(cx,y0+150,140,64);for(const [dx,dy] of [[-55,y0+90],[45,y0+104],[-5,y0+70]])b+=`<circle cx="${cx+dx}" cy="${dy}" r="10" fill="#fff" stroke="${C.glass}" stroke-width="3"/>`;
        b+=`<rect x="${cx-140}" y="${y0+214}" width="280" height="30" rx="6" fill="${C.metal}" stroke="${C.ink}" stroke-width="4"/>`;}
      if(i===1){b+=beaker(cx-160,y0+30,200,200,C.water)+`<path data-part="ethanol" d="M${cx-60} ${y0}V${y0+190}A28 28 0 0 0 ${cx-4} ${y0+190}V${y0}" fill="${C.ethanol}" stroke="${C.glass}" stroke-width="5"/>`+smallLeaf(cx-32,y0+140,50,80,C.leaf);
        b+=T(cx+60,y0+84,'ethanol',{size:28,weight:700})+lead(cx+56,y0+74,cx-32,y0+60,'ethanol');
        /* round 5: no flame icon or label here; the safety reason is shown with the B1 answers, after the fill */}
      if(i===2){b+=beaker(cx-110,y0+30,220,200,C.water)+smallLeaf(cx,y0+170,140,64,C.paleLeaf);}
      if(i===3){b+=`<rect x="${cx-160}" y="${y0+170}" width="320" height="70" rx="8" fill="${C.tile}" stroke="${C.ink}" stroke-width="4"/>`+smallLeaf(cx,y0+188,200,64,C.white);
        b+=`<rect x="${cx-12}" y="${y0}" width="24" height="96" rx="8" fill="${C.ethanol}" stroke="${C.ink}" stroke-width="3"/><path d="M${cx-24} ${y0}h48" stroke="${C.ink}" stroke-width="14" stroke-linecap="round"/><circle cx="${cx}" cy="${y0+128}" r="12" fill="${C.orangeBrown}" stroke="${C.ink}" stroke-width="3"/>`;}
      const ry=y0+310;
      if(i===0)b+=lines(x+22,ry,['because it kills','the cells and','denatures enzymes'],{size:s.print?sz:32,weight:600});
      else{b+=T(x+22,ry,'because …',{size:sz,weight:600});if(s.print)for(let k=0;k<2;k++)b+=`<path d="M${x+22} ${ry+70+k*66}H${x+pw-52}" stroke="${C.soft}" stroke-width="3"/>`;}
      if(i<3)b+=`<path d="M${x+pw-46} ${y0+120}h34" stroke="${C.soft}" stroke-width="10" marker-end="url(#${ah})"/>`;
    });
    const desc='Four steps in a row, each with its reason. 1: boil the leaf in water for about 1 minute on a heat source, because it kills the cells and denatures the enzymes. 2: put the leaf in a boiling tube of ethanol standing in a beaker of hot water; the reason is left blank. 3: rinse the leaf in warm water; reason blank. 4: lay the leaf on a white tile and add drops of iodine solution from a dropper; reason blank.';
    return svg('The starch test in four steps, with reasons',desc,b,W,H);
  }

  /* ---------- 3 · Foil-strip leaf (model), 4 · variegated leaf, 5 · soda-lime bags ---------- */
  const legend = (x,y,size=38) => swatch(x,y,C.blueBlack,'blue-black: starch',size)+swatch(x+560,y,C.orangeBrown,'orange-brown: no starch',size);
  function foilLeaf(s={}){
    const step=s.step||0,W=1640,H=s.compact?720:820;
    let b='';
    const single=!s.print&&!s.compact;
    if(single){
      const W1=1200,H1=step===0?760:840;let g='';
      if(step===0){g+=T(40,64,'Set-up: destarched leaf',{size:44,weight:700});g+=leaf(520,420,640,380,{band:{foil:true,width:150}});
        g+=T(300,150,'foil strip, both sides',{size:42,weight:700})+lead(520,172,520,300)+T(40,724,'uncovered green',{size:42,weight:700})+lead(250,664,300,450);}
      else{g+=T(40,64,'After the starch test',{size:44,weight:700});g+=leaf(520,360,640,380,{centre:C.blueBlack,band:{fill:C.orangeBrown,width:150},midrib:C.co2Light});
        g+=lines(780,130,['covered strip:','orange-brown'],{size:42,weight:700})+lead(768,150,570,250)+lines(40,690,['uncovered green:','blue-black'],{size:42,weight:700})+lead(250,630,320,430);
        if(step>=2)g+=`<path d="M${330} 330V575M${520} 575V430M330 575H520" fill="none" stroke="${C.highlight}" stroke-width="9"/>`+T(580,640,'compare these two',{size:42,weight:700,fill:C.highlight});
        g+=illustrative(40,H1+24,'start',44);}
      return svg(step===0?'Foil-strip leaf: set-up':'Foil-strip leaf: starch-test result',step===0?'A destarched green leaf with a strip of foil across its middle, covering both sides, to be left in light for a day. Predict which part will turn blue-black.':'After the starch test, an illustrative result: the uncovered green parts are blue-black (starch) and the covered strip is orange-brown (no starch). The fair comparison is the covered strip against the uncovered green part: only light differs.',g,W1,H1+50);
    }
    if(!s.compact){
      b+=T(40,64,'Set-up (destarched)',{size:38,weight:700})+T(120,640,'then in light for a day',{size:34,weight:600,fill:C.soft});
      b+=leaf(400,350,560,330,{band:{foil:true,width:130}});
      b+=lines(270,170,['foil strip, both sides'],{size:38,weight:700})+lead(400,186,400,226);
      b+=T(40,580,'uncovered green',{size:38,weight:700})+lead(230,540,250,380);
    }
    const rx=s.compact?560:1220,ry=s.compact?320:350;
    b+=T(s.compact?40:880,64,s.compact?'Foil strip: after the starch test':'After the starch test',{size:38,weight:700});
    if(step>=1||s.compact){
      b+=leaf(rx,ry,560,330,{centre:C.blueBlack,band:{fill:C.orangeBrown,width:130},midrib:C.co2Light});
      b+=lines(rx+60,ry-200,['covered strip'],{size:38,weight:700})+lead(rx+60,ry-186,rx,ry-110);
      if(step>=2||s.compact){b+=`<path d="M${rx-190} ${ry+70}V${ry+225}H${rx}V${ry+150}" fill="none" stroke="${C.highlight}" stroke-width="8"/>`+T(rx-280,ry+290,'compare: uncovered vs covered green',{size:36,weight:700,fill:C.highlight});}
    }else{
      b+=`<path d="${leafD(rx,ry,560,330)}" fill="none" stroke="${C.soft}" stroke-width="5" stroke-dasharray="18 12"/>`+T(rx,ry+30,'?',{anchor:'middle',size:90,weight:700,fill:C.soft})+T(rx,ry+220,'Predict first',{anchor:'middle',size:38,weight:600,fill:C.soft});
    }
    if(step>=1||s.compact){b+=legend(s.compact?40:760,H+40,36);b+=illustrative(s.compact?40:760,H-20,'start',32);}
    const desc='Left: a destarched green leaf with a strip of foil across its middle, covering both sides, left in light for a day. Right: the same leaf after the starch test, an illustrative result: the uncovered green parts are blue-black (starch) and the covered strip is orange-brown (no starch). The fair comparison is the covered strip against the uncovered green part: only light differs.';
    return svg('Foil-strip leaf: set-up and starch-test result',step===0&&!s.compact?'Left: a destarched green leaf with a foil strip across its middle, covering both sides, left in light for a day. Right: the result is hidden until you have predicted.':desc,b,W,H);
  }
  function variegated(s={}){
    if(!s.print&&!s.compact)s={...s,compact:true,screen:true};
    const W=s.screen?1180:1640,H=s.compact?700:820;let b='';
    if(!s.compact){
      b+=T(40,64,'Set-up (in light)',{size:38,weight:700});
      b+=leaf(400,350,560,330,{edge:C.white,centre:C.leaf});
      b+=T(70,630,'white edge: no chlorophyll',{size:36,weight:700})+lead(200,596,190,420);
      b+=T(300,170,'green centre',{size:36,weight:700})+lead(420,186,420,300);
    }
    const rx=s.compact?560:1220,ry=s.compact?320:350;
    b+=T(s.compact?40:880,64,s.screen?'After the starch test':s.compact?'Variegated leaf: after the starch test':'After the starch test',{size:s.screen?44:38,weight:700});
    b+=leaf(rx,ry,560,330,{edge:C.orangeBrown,centre:C.blueBlack,midrib:C.co2Light});
    const ls=s.screen?42:36;if(s.screen){b+=lines(rx+300,ry-190,['was green:','blue-black'],{size:ls,weight:700})+lead(rx+290,ry-170,rx+40,ry-30);b+=lines(rx+110,ry+215,['was white:','orange-brown'],{size:ls,weight:700})+lead(rx+190,ry+180,rx+200,ry+90);}
    else{b+=T(rx-60,ry-200,'was green',{size:ls,weight:700})+lead(rx,ry-186,rx+20,ry-50);
    b+=T(rx+130,ry+222,'was white',{size:ls,weight:700})+lead(rx+190,ry+180,rx+200,ry+90);}
    b+=(s.screen?'':legend(s.compact?40:760,H+20,36))+illustrative(s.compact?40:760,s.screen?H+40:H-40,'start',s.screen?40:32);
    return svg('Variegated leaf: set-up and starch-test result','Left: a variegated leaf with a green centre and a white edge, which has no chlorophyll, left in light. Right: after the starch test, an illustrative result: the part that was green is blue-black (starch) and the part that was white is orange-brown (no starch). Both parts had light and carbon dioxide; they differ only in chlorophyll.',b,W,H);
  }
  function sodaLime(s={}){
    const W=1640,H=s.compact?900:990;let b='';
    const bag=(cx,top,absorb)=>{
      let g=`<rect data-bg x="${cx-250}" y="${top}" width="500" height="360" rx="60" fill="#ffffff" fill-opacity=".35" stroke="${C.glass}" stroke-width="6" stroke-dasharray="20 10"/>`;
      g+=`<path d="${leafD(cx+20,top+150,300,170)}" fill="${C.leaf}" stroke="${C.leafDark}" stroke-width="5"/>`;
      g+=`<path d="M${cx-130} ${top+150}L${cx-200} ${top+360}V${top+420}" stroke="${C.leafDark}" stroke-width="10" fill="none"/>`;
      g+=`<path d="M${cx-230} ${top+340}h120" stroke="${C.ink}" stroke-width="12" stroke-linecap="round"/>`; // the seal at the stalk
      if(absorb){g+=`<rect x="${cx+40}" y="${top+250}" width="170" height="70" rx="10" fill="${C.paper}" stroke="${C.ink}" stroke-width="4"/>`;for(let i=0;i<9;i++)g+=`<circle cx="${cx+62+i*16}" cy="${top+276+(i%2)*20}" r="9" fill="${C.metal}"/>`;}
      else{g+=co2(cx+150,top+300,14)+co2(cx+150,top+56,14)+T(cx+92,top+316,'CO₂',{anchor:'end',size:38,weight:700,fill:C.co2});}
      return g;
    };
    b+=T(40,60,s.compact?'Soda lime: after the starch test':'One destarched plant, two sealed clear bags, in light for a day',{size:38,weight:700});
    b+=lines(190,150,['bag 1: soda lime'],{size:36,weight:700})+lines(990,150,['bag 2: no soda lime (control)'],{size:36,weight:700});
    b+=bag(420,190,true)+bag(1220,190,false);
    b+=`<path d="M220 610V670H1020V610M620 670V720" stroke="${C.leafDark}" stroke-width="12" fill="none"/>`+T(660,748,'same plant',{size:38,weight:600,fill:C.soft});
    const ry=s.compact?830:870;
    b+=swatch(170,ry,C.orangeBrown,'leaf: orange-brown',36)+swatch(970,ry,C.blueBlack,'leaf: blue-black',36);
    b+=T(170,ry+80,'soda lime absorbs CO₂',{size:38,weight:600,fill:C.soft})+illustrative(970,ry+80,'start',38);
    return svg('Soda-lime bags: set-up and starch-test result','One destarched plant with two leaves, each sealed in a clear plastic bag, left in light for a day. The left bag holds a dish of soda lime, which absorbs carbon dioxide. The right bag has no soda lime and contains carbon dioxide from the air; it is the control. Illustrative result: the soda-lime leaf stays orange-brown (no starch); the control leaf turns blue-black (starch).',b,W,H);
  }
  /* ---------- 5b · CO2 recheck: two variegated leaves, soda-lime bag vs control bag; no result shown ---------- */
  function co2Recheck(s={}){
    const W=1960,H=760;let b='';
    const bag=(cx,top,absorb)=>{
      let g=`<rect data-bg x="${cx-260}" y="${top}" width="520" height="380" rx="60" fill="#ffffff" fill-opacity=".35" stroke="${C.glass}" stroke-width="6" stroke-dasharray="20 10"/>`;
      g+=`<g data-part="leaf-${absorb?'soda':'control'}">${leaf(cx+30,top+170,360,220,{edge:C.white,centre:C.leaf})}</g>`;
      g+=`<path d="M${cx-220} ${top+170}L${cx-210} ${top+380}V${top+440}" stroke="${C.leafDark}" stroke-width="10" fill="none"/>`;
      if(absorb){g+=`<rect x="${cx+40}" y="${top+300}" width="180" height="60" rx="10" fill="${C.paper}" stroke="${C.ink}" stroke-width="4"/>`;for(let i=0;i<9;i++)g+=`<circle cx="${cx+62+i*17}" cy="${top+320+(i%2)*20}" r="9" fill="${C.metal}"/>`;}
      return g;
    };
    const top=150;
    b+=lines(190,top-40,['bag 1: soda lime'],{size:40,weight:700})+lines(990,top-40,['bag 2: no soda lime (control)'],{size:40,weight:700});
    b+=bag(420,top,true)+bag(1220,top,false);
    b+=`<path d="M210 ${top+440}V${top+480}H1010V${top+440}M610 ${top+480}V${top+530}" stroke="${C.leafDark}" stroke-width="12" fill="none"/>`+T(640,top+580,'same plant · in light for a day',{size:38,weight:600,fill:C.soft});
    b+=lines(1520,top+90,['green centre'],{size:40,weight:700})+lead(1508,top+80,1250,top+170,'leaf-control');
    b+=lines(1520,top+300,['white edge'],{size:40,weight:700})+lead(1508,top+290,1385,top+190,'leaf-control');
    return svg('CO₂ recheck: two variegated leaves in bags','One destarched plant with two variegated leaves (green centre, white edge), each sealed in a clear bag and left in light for a day. Bag 1 holds soda lime, which absorbs carbon dioxide. Bag 2 has no soda lime and is the control. No result is shown.',b,W,H);
  }
  /* ---------- 6 · Quick-check leaf: variegated + foil, four regions named in words; no result shown ---------- */
  function hingeLeaf(s={}){
    const W=1500,H=s.compact?640:720,cx=760,cy=340;let b='';
    b+=leaf(cx,cy,720,400,{edge:C.white,centre:C.leaf,band:{foil:true,width:170}});
    const L=(x,y,words,tx,ty,anchor='start')=>lines(x,y,words,{size:38,weight:700,anchor})+lead(anchor==='end'?x+12:x-12,y+14,tx,ty);
    b+=L(330,140,['white,','uncovered'],600,190,'end');
    b+=L(330,470,['green,','uncovered'],590,370,'end');
    b+=L(1180,90,['white,','covered'],cx+30,160);
    b+=L(1180,480,['green,','covered'],cx+30,380);
    b+=T(cx,H-30,'foil strip across both sides · left in light for a day',{anchor:'middle',size:34,weight:600,fill:C.soft});
    return svg('Variegated leaf with a foil strip, four regions','A destarched variegated leaf with a green centre and a white edge. A strip of foil covers its middle on both sides, so there are four regions: green uncovered, green covered, white uncovered and white covered. The leaf was left in light for a day. No result is shown.',b,W,H);
  }
  /* ---------- 7 · Mineral trays (illustrative): complete, no magnesium, no nitrate ---------- */
  function trays(s={}){
    const W=1860,H=900,step=s.step??-1;const ah='tr-ah-'+(++serial);
    let b=`<defs>${arrowHead(ah,C.soft)}</defs>`;
    const plant=(cx,base,{height,leafFill,veins,lower,leafW,olderOnly})=>{
      let g=`<path d="M${cx} ${base}V${base-height}" stroke="${C.leafDark}" stroke-width="9"/>`;
      const n=4;for(let i=0;i<n;i++){const y=base-height*(0.2+0.2*i),sg=i%2?1:-1,old=!olderOnly||i<2,fill=olderOnly?(i<2?C.yellowLeaf:C.leaf):(i===0&&lower?lower:leafFill);const lx=cx+sg*leafW*0.55;
        g+=`<path d="${leafD(lx,y,leafW,leafW*0.5)}" fill="${fill}" stroke="${C.leafDark}" stroke-width="4"/>`;
        if(veins&&old){g+=`<path d="M${lx-leafW*0.42} ${y}H${lx+leafW*0.42}M${lx-leafW*0.15} ${y}l${leafW*0.12} ${-leafW*0.16}M${lx-leafW*0.15} ${y}l${leafW*0.12} ${leafW*0.16}M${lx+leafW*0.12} ${y}l${leafW*0.12} ${-leafW*0.14}M${lx+leafW*0.12} ${y}l${leafW*0.12} ${leafW*0.14}" stroke="${C.leaf}" stroke-width="7"/>`;}}
      g+=`<path d="M${cx} ${base}l-40 90M${cx} ${base}l0 100M${cx} ${base}l40 90" stroke="${C.soft}" stroke-width="5" fill="none"/>`;
      return g;
    };
    const cols=[{x:320,name:['complete','solution'],p:{height:430,leafFill:C.leaf,leafW:180},sym:['dark green','leaves']},
      {x:930,name:['no','magnesium'],p:{height:360,leafFill:C.yellowLeaf,veins:true,leafW:170,olderOnly:true},sym:['older leaves','yellow between','the veins']},
      {x:1540,name:['no','nitrate'],p:{height:230,leafFill:C.paleLeaf,lower:C.yellowLeaf,leafW:120},sym:['small plant;','pale older leaves']}];
    cols.forEach((c,i)=>{
      const on=step===1&&i===1||step===2&&i===2;
      b+=`<rect data-bg x="${c.x-270}" y="20" width="540" height="${H+95}" rx="20" fill="${on?C.paper:'none'}" stroke="${on?C.highlight:C.ink}" stroke-width="${on?10:3}"/>`;
      b+=lines(c.x,86,c.name,{anchor:'middle',size:40,weight:750});
      b+=`<rect x="${c.x-220}" y="640" width="440" height="140" rx="10" fill="${C.water}" stroke="${step===0?C.highlight:C.glass}" stroke-width="${step===0?10:5}"/><path d="M${c.x-220} 662H${c.x+220}" stroke="${C.glass}" stroke-width="3"/>`;
      b+=plant(c.x,640,c.p);
      b+=lines(c.x,866,c.sym,{anchor:'middle',size:36,weight:650,fill:C.soft});
    });
    return svg('Seedlings in three nutrient solutions (illustrative)',(step===0?'The roots take up mineral ions from the water (the water is outlined). ':'')+'Three trays of seedlings, illustrative and not real results. Complete solution: a tall plant with dark green leaves. No magnesium: a shorter plant whose older, lower leaves are yellow between green veins; its upper leaves are still green. No nitrate: a small plant with pale leaves; the oldest, lowest leaf is yellow. Each plant has roots in the nutrient solution, which supplies mineral ions dissolved in water.',b,W,H+130);
  }

  /* ---------- Print variants for the handout columns: one leaf, few large labels (9 pt or more at 55 mm) ---------- */
  function printLeaf(kind){
    const W=1120,H=640,cx=600,cy=300;let b='';const z=54;
    if(kind==='foil'){b+=leaf(cx,cy,820,430,{centre:C.blueBlack,band:{fill:C.orangeBrown,width:190},midrib:C.co2Light});
      b+=T(cx,48,'covered: orange-brown',{anchor:'middle',size:z,weight:750})+lead(cx,70,cx,150);
      b+=T(cx,H-10,'uncovered: blue-black',{anchor:'middle',size:z,weight:750})+lead(cx-230,H-80,cx-230,cy+60);}
    else{b+=leaf(cx,cy,820,430,{edge:C.orangeBrown,centre:C.blueBlack,midrib:C.co2Light});
      b+=T(cx,48,'white part: orange-brown',{anchor:'middle',size:z,weight:750})+lead(cx+250,70,cx+250,cy-80);
      b+=T(cx,H-10,'green part: blue-black',{anchor:'middle',size:z,weight:750})+lead(cx,H-80,cx,cy+40);}
    return svg(kind==='foil'?'Foil-strip leaf after the starch test':'Variegated leaf after the starch test',kind==='foil'?'Illustrative result: the covered strip is orange-brown (no starch); the uncovered green parts are blue-black (starch).':'Illustrative result: the part that was white is orange-brown (no starch); the part that was green is blue-black (starch).',b,W,H);
  }
  function printSoda(){
    const W=1200,H=700;let b='';const z=54;
    const bag=(cx,absorb)=>{let g=`<rect data-bg x="${cx-250}" y="90" width="500" height="380" rx="60" fill="#ffffff" stroke="${C.glass}" stroke-width="6" stroke-dasharray="20 10"/><path d="${leafD(cx+10,250,330,190)}" fill="${C.leaf}" stroke="${C.leafDark}" stroke-width="5"/><path d="M${cx-155} 250L${cx-200} 470V540" stroke="${C.leafDark}" stroke-width="12" fill="none"/>`;
      if(absorb){g+=`<rect x="${cx+40}" y="360" width="170" height="80" rx="10" fill="${C.paper}" stroke="${C.ink}" stroke-width="5"/>`;for(let i=0;i<8;i++)g+=`<circle cx="${cx+64+i*17}" cy="${388+(i%2)*24}" r="10" fill="${C.metal}"/>`;}else g+=co2(cx+120,400,16);
      return g;};
    b+=T(300,62,'soda lime',{anchor:'middle',size:z,weight:750})+T(900,62,'no soda lime',{anchor:'middle',size:z,weight:750});
    b+=bag(300,true)+bag(900,false)+`<path d="M100 540H700M600 540V600" stroke="${C.leafDark}" stroke-width="12" fill="none"/>`;
    b+=T(300,660,'orange-brown',{anchor:'middle',size:z,weight:750})+T(900,660,'blue-black',{anchor:'middle',size:z,weight:750});
    return svg('Soda-lime bags after the starch test','Two leaves on one destarched plant, each sealed in a clear bag. The left bag holds soda lime, which absorbs carbon dioxide; its leaf stays orange-brown. The right bag has no soda lime; its leaf turns blue-black. Illustrative result.',b,W,H);
  }
  function printHinge(){
    // A larger leaf; covered labels sit above and below the foil band, so their leaders run only through covered regions.
    const W=1300,H=890,cx=760,cy=430;let b='';const z=72;
    b+=leaf(cx,cy,860,500,{edge:C.white,centre:C.leaf,band:{foil:true,width:190}});
    const Lb=(x,y,words,tx,ty)=>lines(x,y,words,{size:z,weight:750,anchor:'end'})+lead(x+14,y+16,tx,ty);
    b+=Lb(300,230,['white,','uncovered'],480,300);
    b+=Lb(300,620,['green,','uncovered'],560,460);
    b+=lines(cx,62,['white, covered'],{size:z,weight:750,anchor:'middle'})+lead(cx,92,cx,195);
    b+=lines(cx,H-12,['green, covered'],{size:z,weight:750,anchor:'middle'})+lead(cx,H-100,cx,480);
    return svg('Variegated leaf with a foil strip, four regions','A destarched variegated leaf with a green centre and a white edge. A strip of foil covers its middle on both sides, giving four regions: green uncovered, green covered, white uncovered and white covered. No result is shown.',b,W,H);
  }
  function printStarch(){
    const W=1880,H=470,pw=470;let b='';const ah='sp-ah-'+(++serial);b+=`<defs>${arrowHead(ah,C.soft)}</defs>`;
    const names=[['1 · Boil','1 min'],['2 · Ethanol','water bath'],['3 · Rinse','warm water'],['4 · Iodine','white tile']];
    const beaker=(x,y,w,h,fill)=>`<path d="M${x} ${y}V${y+h}H${x+w}V${y}" fill="none" stroke="${C.glass}" stroke-width="7"/><rect data-bg x="${x+3}" y="${y+26}" width="${w-6}" height="${h-29}" fill="${fill}"/>`;
    const sl=(cx,cy,w,h,fill)=>`<path d="${leafD(cx,cy,w,h)}" fill="${fill}" stroke="${C.leafDark}" stroke-width="5"/>`;
    names.forEach(([a,c2],i)=>{const x=i*pw+10,cx=x+(pw-30)/2;
      b+=`<rect data-bg x="${x}" y="10" width="${pw-30}" height="${H-20}" rx="18" fill="#fff" stroke="${C.ink}" stroke-width="5"/>`+`<g data-label>${T(x+24,86,a,{size:52,weight:800})+T(x+24,156,c2,{size:48,weight:600})}</g>`;
      const y0=190;
      if(i===0)b+=beaker(cx-110,y0,220,190,C.water)+sl(cx,y0+120,140,60,C.leaf)+`<rect x="${cx-140}" y="${y0+200}" width="280" height="28" rx="6" fill="${C.metal}" stroke="${C.ink}" stroke-width="4"/>`;
      if(i===1)b+=beaker(cx-150,y0+10,220,200,C.water)+`<path d="M${cx-64} ${y0-20}V${y0+170}A26 26 0 0 0 ${cx-12} ${y0+170}V${y0-20}" fill="${C.ethanol}" stroke="${C.glass}" stroke-width="5"/>`+sl(cx-38,y0+120,46,76,C.leaf)+`<path d="M${cx+150} ${y0+200}c-26-20-20-44 0-64c20 20 26 44 0 64z" fill="${C.flame}" stroke="${C.ink}" stroke-width="3"/><path d="M${cx+112} ${y0+138}L${cx+188} ${y0+202}M${cx+188} ${y0+138}L${cx+112} ${y0+202}" stroke="${C.red}" stroke-width="9"/>`;
      if(i===2)b+=beaker(cx-110,y0+10,220,200,C.water)+sl(cx,y0+140,140,60,C.paleLeaf);
      if(i===3)b+=`<rect x="${cx-160}" y="${y0+150}" width="320" height="64" rx="8" fill="#fff" stroke="${C.ink}" stroke-width="5"/>`+sl(cx,y0+166,200,60,C.white)+`<rect x="${cx-12}" y="${y0-10}" width="24" height="96" rx="8" fill="${C.ethanol}" stroke="${C.ink}" stroke-width="4"/><path d="M${cx-24} ${y0-10}h48" stroke="${C.ink}" stroke-width="14" stroke-linecap="round"/><circle cx="${cx}" cy="${y0+116}" r="12" fill="${C.orangeBrown}" stroke="${C.ink}" stroke-width="3"/>`;
      if(i<3)b+=`<path d="M${x+pw-46} ${y0+100}h34" stroke="${C.soft}" stroke-width="10" marker-end="url(#${ah})"/>`;});
    return svg('The starch test in four steps','Four steps: 1, boil the leaf in water for about 1 minute; 2, warm it in a tube of ethanol standing in a hot water bath, with a crossed-out flame meaning no flame; 3, rinse it in warm water; 4, add iodine solution to the leaf on a white tile.',b,W,H);
  }
  const LABEL_SCALE = { 'soda-lime':1.25, 'mineral-trays':1.3, 'hinge-leaf':1.1 };
  const pc=(full,print)=>s=>s.print&&s.compact?print(s):full(s);
  const figures = { 'pondweed-setup':pondweed, 'starch-steps':pc(starchSteps,printStarch), 'foil-leaf':pc(foilLeaf,()=>printLeaf('foil')), 'variegated-leaf':pc(variegated,()=>printLeaf('variegated')),
    'soda-lime':pc(sodaLime,printSoda), 'co2-recheck':co2Recheck, 'hinge-leaf':pc(hingeLeaf,printHinge), 'mineral-trays':trays };
  return {
    render(name,state={}){ if(!figures[name])return ''; C=state.print?MONO:COLOUR; LS=state.print?1:(LABEL_SCALE[name]||1); try{ return figures[name](state); } finally { C=COLOUR; LS=1; } },
    names:Object.keys(figures), palette:COLOUR, mono:MONO
  };
})();

/* Crop each diagram to its drawn and labelled content so labels are as large as the slot allows. */
window.LeafDiagramAccess=(()=>{
  function crop(svg){let b;try{b=svg.getBBox();}catch(_){return;}if(!b.width||!b.height)return;const pad=18;svg.setAttribute('viewBox',[b.x-pad,b.y-pad,b.width+2*pad,b.height+2*pad].join(' '));}
  function prepare(host){if(!host)return;for(const svg of host.querySelectorAll('svg.gas-science-diagram:not([data-cropped])')){svg.setAttribute('data-cropped','');crop(svg);}}
  function recrop(host){if(!host)return;for(const svg of host.querySelectorAll('svg.gas-science-diagram'))crop(svg);}
  return {prepare,recrop};
})();
