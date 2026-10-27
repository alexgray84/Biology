/* Original scientific schematics for Leaf adaptations, 27 October 2026.
   A typical terrestrial broad leaf is an example, not a universal leaf design.
   BioDiagrams.render(name,state) returns accessible inline SVG. No answers are
   drawn on leaf-outline or leaf-transfer; gas routes require an explicit state. */
window.BioDiagrams = (() => {
  'use strict';
  const C = { ink:'#182944', green:'#56834b', pale:'#e6edce', cell:'#c5d6a3', wall:'#62734d', paper:'#fbf8f0', light:'#d8b23a', co2:'#6b7280', o2:'#24748d', water:'#3d7cc9' };
  let serial = 0;
  const esc = v => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const text = (x,y,value,anchor='start',size=32) => `<text x="${x}" y="${y}" text-anchor="${anchor}" fill="${C.ink}" font-family="system-ui,sans-serif" font-size="${size}" font-weight="650" style="font-size:${size}px">${esc(value)}</text>`;
  const line = d => `<path d="${d}" fill="none" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/>`;
  const label = (x,y,value,d,anchor='start') => line(d) + text(x,y,value,anchor);
  function svg(title,desc,body,height=700) {
    const id = `leaf-figure-${++serial}`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 ${height}" role="img" aria-labelledby="${id}-title ${id}-desc" class="leaf-science-diagram"><title id="${id}-title">${esc(title)}</title><desc id="${id}-desc">${esc(desc)}</desc>${body}</svg>`;
  }
  function tissue(options={}) {
    const { labels=true, focus='all', route=false, light=false, thick=false }=options;
    const floor=thick?610:540, base=floor+44, spaceY=thick?440:410;
    let b=`<rect x="292" y="166" width="416" height="12" rx="6" fill="#d9c88a" stroke="${C.wall}" stroke-width="2"/>`;
    for(let i=0;i<8;i++) b+=`<rect x="${292+i*52}" y="178" width="52" height="48" rx="11" fill="#eef0dc" fill-opacity=".8" stroke="${C.wall}" stroke-width="2.5"/>`;
    for(let i=0;i<7;i++) {
      const x=300+i*58;
      b+=`<rect x="${x}" y="235" width="49" height="123" rx="23" fill="${i%2?'#b9ce91':'#c7d9a4'}" stroke="${C.wall}" stroke-width="2.5"/>`;
      for(let j=0;j<4;j++) b+=`<ellipse cx="${x+11+(j%2)*25}" cy="${254+j*27}" rx="6" ry="10" fill="${C.green}"/>`;
    }
    const rows=thick?3:2;
    for(let r=0;r<rows;r++) for(let i=0;i<4;i++) {
      const x=310+i*104+(r%2?32:0), y=390+r*(thick?73:67);
      if(x>690)continue;
      b+=`<path d="M${x-25} ${y-20} Q${x-6} ${y-41} ${x+16} ${y-24} Q${x+45} ${y-24} ${x+35} ${y+4} Q${x+42} ${y+29} ${x+11} ${y+27} Q${x-22} ${y+43} ${x-31} ${y+17} Q${x-48} ${y} ${x-25} ${y-20}Z" fill="${C.cell}" stroke="${C.wall}" stroke-width="2.5"/>`;
      b+=`<ellipse cx="${x-13}" cy="${y-9}" rx="7" ry="4.5" fill="${C.green}"/><ellipse cx="${x+18}" cy="${y+15}" rx="7" ry="4.5" fill="${C.green}"/>`;
    }
    b+=`<ellipse cx="625" cy="405" rx="48" ry="30" fill="#e4e3c4" stroke="${C.wall}" stroke-width="3"/>`;
    [603,625,647].forEach(x=>{b+=`<circle cx="${x}" cy="395" r="8" fill="#dbe7f6" stroke="${C.water}" stroke-width="3"/><circle cx="${x}" cy="416" r="7" fill="#d8b23a" stroke="#957327" stroke-width="2"/>`;});
    for(let i=0;i<8;i++) {
      if(i===5)continue;
      b+=`<rect x="${292+i*52}" y="${floor}" width="52" height="44" rx="11" fill="#e1e8c9" stroke="${C.wall}" stroke-width="2.5"/>`;
    }
    b+=`<ellipse cx="557" cy="${floor+23}" rx="13" ry="26" fill="#93b471" stroke="${C.wall}" stroke-width="3"/><ellipse cx="593" cy="${floor+23}" rx="13" ry="26" fill="#93b471" stroke="${C.wall}" stroke-width="3"/>`;
    b+=`<path d="M292 226V${floor}M708 226V${floor}" fill="none" stroke="#9ba688" stroke-width="2" stroke-dasharray="5 7"/>`;
    if(light) {
      b+=`<defs><marker id="light-${serial}" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z" fill="${C.light}"/></marker></defs>`;
      [410,500,590].forEach(x=>{b+=`<path d="M${x} 55V149" fill="none" stroke="${C.light}" stroke-width="6" marker-end="url(#light-${serial})"/>`;});
      b+=text(500,43,'Light','middle');
    }
    if(labels) {
      if(focus==='light'||focus==='all') {
        b+=label(18,187,'Upper','M300 202H220')+text(18,225,'epidermis');
        b+=label(18,290,'Palisade cells','M310 280H270');
        b+=label(985,152,'Waxy cuticle','M702 170H735L735 148','end');
        b+=label(985,335,'Chloroplasts','M664 305H735L735 328','end');
        if(focus==='light')b+=label(985,540,'Vein: xylem','M667 400H735V528H735','end')+text(985,580,'and phloem','end',34);
      }
      if(focus==='gas'||focus==='all') {
        b+=label(18,spaceY+18,'Spongy cells',`M303 ${spaceY+5}H270`);
        b+=label(985,spaceY+51,'Air spaces',`M488 ${spaceY+27}H755L776 ${spaceY+45}`,'end');
        b+=label(18,floor+28,'Lower',`M304 ${floor+22}H220`)+text(18,floor+66,'epidermis');
        b+=label(985,base+70,'Open pore',`M575 ${floor+24}V${base+61}H772`,'end');
      }
    }
    if(route) {
      const gas=options.gas==='o2'?C.o2:C.co2, out=options.direction==='out';
      const pts=out?`M475 323L480 390L550 440L575 ${floor-10}V${base+65}`:`M575 ${base+65}V${floor-10}L550 440L480 390L475 323`;
      b+=`<defs><marker id="gas-${serial}" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z" fill="${gas}"/></marker></defs><path d="${pts}" fill="none" stroke="#fff" stroke-width="13"/><path d="${pts}" fill="none" stroke="${gas}" stroke-width="7" stroke-linejoin="round" marker-end="url(#gas-${serial})"/>`;
    }
    return b;
  }
  function section(s={}) {
    if(s.view==='stoma')return stomata(s);
    if(s.view==='whole')return wholeLeaf(s);
    const focus=s.focus||(s.step===0?'light':s.step===1?'gas':'all');
    return svg('Typical broad-leaf cross-section', 'Schematic slice: a cuticle and upper epidermis cover tall palisade cells containing chloroplasts. Irregular spongy cells have connected air spaces. A vein contains blue xylem above gold phloem. The lower epidermis contains a pore bordered by guard cells. Layout varies between species.',tissue({...s,focus,light:s.light===true||(focus==='light'&&s.labels!==false)}),s.thick?800:700);
  }
  function stomata(s={}) {
    let b=`<rect x="140" y="80" width="720" height="480" rx="52" fill="#e6edce" stroke="${C.wall}" stroke-width="3"/>`;
    ['M150 230Q260 205 280 110','M150 400Q255 360 320 545','M850 230Q740 205 720 110','M850 400Q745 360 680 545','M310 80Q370 150 350 220','M690 80Q630 150 650 220','M350 425Q370 510 310 560','M650 425Q630 510 690 560'].forEach(d=>{b+=line(d);});
    b+=`<ellipse cx="500" cy="320" rx="45" ry="122" fill="#fcfcf5" stroke="${C.wall}" stroke-width="3"/>`;
    b+=`<path d="M462 170C305 145 294 476 462 472C395 410 395 231 462 170Z" fill="#a8c78b" stroke="${C.wall}" stroke-width="5"/><path d="M538 170C695 145 706 476 538 472C605 410 605 231 538 170Z" fill="#a8c78b" stroke="${C.wall}" stroke-width="5"/>`;
    [[390,220],[365,290],[370,370],[399,435],[610,220],[635,290],[630,370],[601,435]].forEach(([x,y])=>{b+=`<ellipse cx="${x}" cy="${y}" rx="13" ry="8" fill="${C.green}" transform="rotate(24 ${x} ${y})"/>`;});
    if(s.labels!==false) b+=label(24,124,'Guard cell','M244 116H300L365 212')+label(978,133,'Stoma: the pore','M705 126H665L510 276','end')+label(500,638,'Chloroplasts','M500 596V574L605 436','middle');
    return svg('A stoma and its guard cells, surface view','A pore lies between two guard cells. Guard cells regulate the opening; they do not pump gases. The example is viewed from the lower surface of a typical terrestrial broad leaf.',b,700);
  }
  function wholeLeaf(s={}) {
    let b=`<path d="M500 62C727 195 776 400 500 594C224 400 273 195 500 62Z" fill="#a9c68c" stroke="${C.wall}" stroke-width="4"/><path d="M500 62V652" stroke="#779656" stroke-width="7" fill="none"/>`;
    [[155,82],[217,115],[280,141],[343,146],[406,128],[465,96],[519,57]].forEach(([y,w])=>{
      b+=`<path d="M500 ${y+57}Q${500-w*.5} ${y+33} ${500-w} ${y}M500 ${y+57}Q${500+w*.5} ${y+33} ${500+w} ${y}" fill="none" stroke="#718d50" stroke-width="3"/>`;
    });
    if(s.labels!==false)b+=label(20,220,'Broad lamina','M270 211H318L355 238')+label(980,345,'Branching','M770 361H684L569 330','end')+text(980,383,'veins','end')+label(980,626,'Petiole','M768 618H547L503 622','end');
    return svg('Typical terrestrial broad leaf, whole view','A broad curved lamina has a central midrib and branching veins, joined to a petiole. This whole-leaf example shows the surface, not the internal tissue. Use the section view to inspect epidermis and mesophyll.',b,700);
  }
  function routeScaffold() {
    let b=text(500,63,'Complete the pathway','middle',38);
    const rows=[['Outside air',120],['Open stomatal pore',245],['',370],['',495]];
    rows.forEach(([v,y],i)=>{b+=`<rect x="180" y="${y}" width="640" height="85" rx="14" fill="${i<2?'#e7eccc':'#fff'}" stroke="${C.ink}" stroke-width="3"${i>1?' stroke-dasharray="10 8"':''}/>`+text(500,y+53,v||'________________','middle',34);if(i<3)b+=`<path d="M500 ${y+88}V${y+117}M489 ${y+106}L500 ${y+117}L511 ${y+106}" fill="none" stroke="${C.co2}" stroke-width="5"/>`;});
    return svg('Partial gas-route scaffold','The first two boxes provide outside air and open stomatal pore. Complete the two remaining boxes and explain the cause of net movement.',b,620);
  }
  function transfer() {
    const body=text(45,87,'A','start',50)+`<g transform="translate(105,-57) scale(.84,.61)">${tissue({labels:false})}</g>`+text(45,430,'B','start',50)+`<g transform="translate(105,277) scale(.84,.61)">${tissue({labels:false,thick:true})}</g>`;
    return svg('Two unlabelled leaf sections for a fresh check','A and B have the same surface area and number of open pores. B has a longer path through its tissue. No labels, route arrows or concentration answer are supplied.',body,750);
  }
  function floating(s={}) {
    let b=`<rect x="65" y="380" width="870" height="190" fill="#dbe7f6"/><path d="M65 380Q100 365 135 380T205 380T275 380T345 380T415 380T485 380T555 380T625 380T695 380T765 380T835 380T935 380" fill="none" stroke="${C.water}" stroke-width="4"/>`;
    b+=`<rect x="255" y="270" width="490" height="180" rx="32" fill="${C.pale}" stroke="${C.wall}" stroke-width="4"/>`;
    for(let i=0;i<7;i++)b+=`<rect x="${273+i*65}" y="293" width="48" height="69" rx="21" fill="${C.cell}" stroke="${C.wall}" stroke-width="2"/><ellipse cx="${285+i*65}" cy="310" rx="6" ry="10" fill="${C.green}"/><ellipse cx="${307+i*65}" cy="339" rx="6" ry="10" fill="${C.green}"/>`;
    [[320,405],[445,410],[580,406],[675,409]].forEach(([x,y])=>{b+=`<ellipse cx="${x}" cy="${y}" rx="27" ry="18" fill="${C.cell}" stroke="${C.wall}" stroke-width="2"/>`;});
    b+=`<path d="M255 275H410M450 275H745" stroke="${C.wall}" stroke-width="6"/><ellipse cx="409" cy="277" rx="11" ry="17" fill="${C.green}"/><ellipse cx="451" cy="277" rx="11" ry="17" fill="${C.green}"/>`;
    if(s.labels!==false)b+=text(75,145,'Air')+text(75,525,'Water')+label(980,218,'Upper pore','M754 211H680L431 268','end')+text(500,633,'Water slows gas diffusion','middle',36);
    return svg('A supplied floating-leaf design','The upper surface is in air; the lower surface is submerged. Tall chloroplast-rich cells lie near the illuminated upper surface. The design has an upper pore connecting air with internal spaces. Gas diffusion is much slower through water than air.',b,700);
  }
  const figures={
    'leaf-section':section,
    'stomata':stomata,
    'route-scaffold':routeScaffold,
    'leaf-outline':s=>svg('Unlabelled leaf response outline','A pre-drawn typical leaf section with no answer labels, gas arrows or light arrows. Add your own labels and explanations.',tissue({...s,labels:false,route:false,light:false})),
    'leaf-transfer':transfer,
    'floating-leaf':floating
  };
  return {render(name,state={}) {return figures[name]?figures[name](state):'';}};
})();

/* Fixed teaching canvases use large reference numbers and a readable label key.
   The drawing and leader endpoints are retained; original resource documents
   keep their full labels unless this progressive enhancement is requested. */
window.LeafDiagramAccess=(()=>{
  let serial=0;
  function prepare(host){
    if(!host)return;
    for(const svg of host.querySelectorAll('svg.leaf-science-diagram:not([data-label-key-ready])')){
      svg.setAttribute('data-label-key-ready','');
      const figure=svg.closest('figure')||svg.parentElement;
      const owner=figure.dataset.labelKeyOwner||(figure.dataset.labelKeyOwner='leaf-key-'+(++serial));
      document.querySelectorAll('[data-label-key-for="'+owner+'"]').forEach(e=>e.remove());
      const title=svg.querySelector('title')?.textContent||'';
      const texts=[...svg.querySelectorAll('text')];
      if(/Partial gas-route/i.test(title)){
        const route=document.createElement('ol');route.className='diagram-route';route.setAttribute('aria-label','Partial gas pathway');
        for(const value of ['Outside air','Open stomatal pore','Complete this step','Complete this step']){const li=document.createElement('li');li.textContent=value;if(value.startsWith('Complete'))li.className='route-blank';route.append(li);}
        svg.replaceWith(route);continue;
      }
      const entries=[];
      for(let i=0;i<texts.length;i++){
        const node=texts[i];let value=node.textContent.replace(/\s+/g,' ').trim();if(!value)continue;
        const next=texts[i+1];
        if(next&&((/^(Upper|Lower)$/.test(value)&&next.textContent.trim()==='epidermis')||(value==='Branching'&&next.textContent.trim()==='veins')||(value==='Vein: xylem'&&next.textContent.trim()==='and phloem'))){value+=' '+next.textContent.trim();next.remove();i++;}
        const ox=Number(node.getAttribute('x')),oy=Number(node.getAttribute('y')),leader=node.previousElementSibling;
        if(!/^[AB]$/.test(value)){entries.push(value);node.textContent=String(entries.length);node.setAttribute('aria-label',entries.length+': '+value);}
        node.style.setProperty('font-size','64px','important');node.style.fontWeight='700';
        if(leader?.tagName.toLowerCase()==='path'&&leader.getAttribute('stroke-width')==='3'){
          const ends=[leader.getPointAtLength(0),leader.getPointAtLength(leader.getTotalLength())];
          const end=ends.sort((a,b)=>Math.hypot(a.x-ox,a.y-oy)-Math.hypot(b.x-ox,b.y-oy))[0],anchor=node.getAttribute('text-anchor');
          node.setAttribute('x',String(anchor==='end'?end.x+86:anchor==='start'?end.x-86:end.x));
          node.setAttribute('y',String(anchor==='middle'?end.y+(oy>end.y?70:-12):end.y+18));
        }
        if(value==='Light'){node.setAttribute('x','300');node.setAttribute('y','90');}
        const box=node.getBBox(),v=svg.viewBox.baseVal;
        const dy=box.y<v.y+8?v.y+8-box.y:box.y+box.height>v.y+v.height-8?v.y+v.height-8-box.y-box.height:0;
        if(dy)node.setAttribute('y',String(Number(node.getAttribute('y')||0)+dy));
      }
      if(!entries.length)continue;
      const key=document.createElement('ol');key.className='diagram-key';key.dataset.labelKeyFor=owner;key.setAttribute('aria-label','Diagram label key');
      entries.forEach((label,i)=>{const li=document.createElement('li'),n=document.createElement('b'),name=document.createElement('span');n.textContent=String(i+1);n.setAttribute('aria-hidden','true');name.textContent=label;li.append(n,name);key.append(li);});
      figure.after(key);
    }
    for(const figure of host.querySelectorAll('figure[data-label-key-owner]')){
      const key=document.querySelector('[data-label-key-for="'+figure.dataset.labelKeyOwner+'"]');
      if(key)key.hidden=Boolean(figure.querySelector('.model-view.is-live'));
    }
  }
  return {prepare};
})();
