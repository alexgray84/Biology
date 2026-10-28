/* Original scientific schematics for Net gas exchange, 28 October 2026.
   Locked conventions: CO2 grey, O2 teal, light yellow, water blue, glucose gold.
   Hydrogencarbonate indicator: yellow = more CO2, orange-red = about air level,
   purple = less CO2. Every swatch carries a word label as well as a colour.
   Rates are illustrative model units, never measured data.
   BioDiagrams.render(name,state) returns accessible inline SVG. */
window.BioDiagrams = (() => {
  'use strict';
  const C = { ink:'#182944', soft:'#475566', leaf:'#4f8a3c', leafDark:'#2f5f25', glass:'#6f7d8c', co2:'#5f6670', o2:'#1f8a84', light:'#f2b705', lightLine:'#b98700',
    yellow:'#eccb3c', orange:'#d9542b', purple:'#7d3c98', foil:'#aab1b9', paper:'#fbf8f0', bung:'#3b3f46' };
  let serial = 0;
  const esc = v => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const F = 1.25; // label scale: keeps every label at or above 16 px on 390-1366 px screens
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

  /* Two-rate CO2 budget. One leaf, two grey CO2 arrows, a net box.
     Arrow length = rate in model units (48 px per unit). */
  const SETTINGS = {
    dark:{light:'dark',lightWord:'Dark',P:0,R:3,net:'Net: CO₂ given out'},
    dim:{light:'dim',lightWord:'Dim',P:2,R:3,net:'Net: CO₂ given out'},
    'dim-other':{light:'dim',lightWord:'Dim · leaf 2',P:2,R:1,net:'Net: CO₂ taken in'},
    bright:{light:'bright',lightWord:'Bright',P:8,R:3,net:'Net: CO₂ taken in'},
    unknown:{light:'dim',lightWord:'Dim',P:null,R:3,net:'Net: depends on both rates'},
    predict:{light:'dim',lightWord:'Light: ?',P:null,R:null,net:'Net = ?  Predict first'},
    blank:{light:'slider',lightWord:'Dark → Bright',P:null,R:null,net:'Net = ?'}
  };
  function budget(s={}){
    const seq=s.sequence, key=seq?seq[Math.min(s.step||0,seq.length-1)]:(s.setting||'bright');
    const S=SETTINGS[key]||SETTINGS.bright, u=48, x0=300;
    let b=`<defs>${marker('co2-head-'+serial,C.co2)}</defs>`;
    const head=`url(#co2-head-${serial})`;
    if(S.light==='slider'){
      b+=sun(70,70,'dim')+`<rect x="130" y="58" width="300" height="24" rx="12" fill="#efe6c4" stroke="${C.lightLine}" stroke-width="3"/>`+T(460,88,'Dark → Bright',{size:46});
    }else b+=sun(70,70,S.light)+T(130,92,'Light: '+S.lightWord.replace('Light: ',''),{size:50});
    b+=leafShape(155,430,250,190);
    b+=T(155,575,'leaf',{anchor:'middle',size:46,fill:C.leafDark});
    const arrow=(y,len,dir,dashed)=>{
      if(len===0)return T(x0+10,y+16,'none: no light',{size:46,fill:C.co2});
      const L=len===null?300:Math.max(len*u,30);
      const d=dir==='in'?`M${x0+L} ${y}H${x0+6}`:`M${x0} ${y}H${x0+L-6}`;
      return `<path d="${d}" fill="none" stroke="${C.co2}" stroke-width="24" ${dashed?'stroke-dasharray="26 18" stroke-opacity=".55"':''} marker-end="${head}"/>`+
        (len===null?T(x0+L+56,y+16,'?',{size:56,fill:C.co2}):T(x0+L+56,y+16,len+(len===1?' unit':' units'),{size:46,fill:C.co2}));
    };
    b+=T(x0,200,'Photosynthesis: CO₂ in',{size:48})+T(x0,264,'needs light',{size:46,weight:500,fill:C.soft});
    b+=arrow(322,S.P,'in',S.P===null);
    b+=T(x0,420,'Respiration: CO₂ out',{size:48})+T(x0,484,'all living cells, light and dark',{size:46,weight:500,fill:C.soft});
    b+=arrow(542,S.R,'out',S.R===null);
    b+=`<rect x="${x0-10}" y="604" width="760" height="96" rx="14" fill="${C.paper}" stroke="${C.ink}" stroke-width="4"/>`+T(x0+10,670,S.net,{size:48});
    const words=S.P===null&&S.R===null?'Both rates are blank. Draw the arrow lengths and write the net result.':S.P===null?`Respiration releases ${S.R} model units of CO₂. The photosynthesis rate is not given, so the net result depends on both rates.`:`${S.lightWord} light. Photosynthesis uses ${S.P} and respiration releases ${S.R} model units of CO₂. ${S.net}.`;
    return svg('Two-rate CO₂ budget for one leaf',words+' Grey arrows show CO₂. Arrow length shows rate in illustrative model units.',b,1100,720);
  }

  /* Hydrogencarbonate indicator scale with word labels. */
  function scale(s={}){
    const sw=[[C.yellow,'Yellow','more CO₂'],[C.orange,'Orange-red','air level'],[C.purple,'Purple','less CO₂']];
    let b=`<defs>${marker('scale-l-'+serial,C.co2)}${marker('scale-r-'+serial,C.co2)}</defs>`;
    sw.forEach(([fill,name,meaning],i)=>{
      const x=20+i*330;
      b+=`<rect x="${x}" y="20" width="290" height="130" rx="18" fill="${fill}" stroke="${C.ink}" stroke-width="4"/>`;
      b+=T(x+145,222,name,{anchor:'middle',size:50});
      if(!s.strip)b+=T(x+145,292,meaning,{anchor:'middle',size:46,weight:500,fill:C.soft});
    });
    const y=s.strip?280:380;
    b+=`<path d="M490 ${y}H60" stroke="${C.co2}" stroke-width="12" marker-end="url(#scale-l-${serial})"/><path d="M510 ${y}H940" stroke="${C.co2}" stroke-width="12" marker-end="url(#scale-r-${serial})"/>`;
    b+=T(60,y+78,'more CO₂',{size:48,fill:C.co2})+T(940,y+78,'less CO₂',{anchor:'end',size:48,fill:C.co2});
    if(!s.strip){b+=T(500,y+160,'CO₂ change only.',{anchor:'middle',size:46});b+=T(500,y+226,'Not an O₂ test.',{anchor:'middle',size:46});}
    return svg('Hydrogencarbonate indicator colour scale','Three labelled swatches. Yellow means more carbon dioxide than air. Orange-red means about the air level. Purple means less carbon dioxide than air. The indicator shows carbon dioxide change only; it is not a test for oxygen.',b,1000,s.strip?360:520);
  }

  /* Boiling tube with bung, gauze and indicator. */
  function tube(cx,{liquid=C.orange,leaf=true,wrap=null,word=null}={}){
    const top=150,bottom=560,w=112,x=cx-w/2;
    let b=`<path d="M${x} ${top}V${bottom-56}A56 56 0 0 0 ${x+w} ${bottom-56}V${top}" fill="#f4f7fa" stroke="${C.glass}" stroke-width="6"/>`;
    b+=`<path d="M${x+5} 430V${bottom-56}A51 51 0 0 0 ${x+w-5} ${bottom-56}V430Z" fill="${liquid}" stroke="none"/>`;
    if(word)b+=T(cx,505,word,{anchor:'middle',size:30,weight:700,fill:liquid===C.yellow?C.ink:'#ffffff'});
    b+=`<path d="M${x+6} 360H${x+w-6}" stroke="#7c6a55" stroke-width="7" stroke-dasharray="9 6"/>`;
    if(leaf)b+=`<path d="M${cx-40} 346C${cx-18} 314 ${cx+22} 314 ${cx+42} 346C${cx+18} 360 ${cx-20} 360 ${cx-40} 346Z" fill="${C.leaf}" stroke="${C.leafDark}" stroke-width="4"/>`;
    b+=`<rect x="${x-10}" y="${top-38}" width="${w+20}" height="52" rx="8" fill="${C.bung}"/>`;
    if(wrap==='muslin'){b+=`<rect x="${x-8}" y="${top+14}" width="${w+16}" height="${bottom-top-14}" rx="20" fill="url(#muslin-${serial})" stroke="#c9bfa8" stroke-width="4" opacity=".92"/>`;}
    if(wrap==='foil'){b+=`<rect x="${x-10}" y="${top-40}" width="${w+20}" height="${bottom-top+40}" rx="20" fill="url(#foil-${serial})" stroke="#7d858e" stroke-width="4"/>`;}
    return b;
  }
  const tubeDefs = () => `<defs><pattern id="muslin-${serial}" width="16" height="16" patternUnits="userSpaceOnUse"><rect width="16" height="16" fill="#f7f1e2" fill-opacity=".72"/><path d="M0 0L16 16M16 0L0 16" stroke="#b8ac90" stroke-width="2"/></pattern><linearGradient id="foil-${serial}" x1="0" x2="1"><stop offset="0" stop-color="#8f979f"/><stop offset=".45" stop-color="#e3e7ea"/><stop offset="1" stop-color="#9aa2aa"/></linearGradient>${marker('ray-'+serial,C.light)}</defs>`;
  function lamp(xs){
    let b=`<rect x="${xs[0]-70}" y="0" width="${xs[xs.length-1]-xs[0]+140}" height="40" rx="12" fill="${C.light}" stroke="${C.lightLine}" stroke-width="4"/>`;
    xs.forEach(x=>{b+=`<path d="M${x} 48V96" stroke="${C.light}" stroke-width="9" marker-end="url(#ray-${serial})"/>`;});
    return b;
  }
  // Portrait tablets give the figure a tall, narrow slot: draw the same four tubes as a 2 x 2 grid.
  const portraitTablet=()=>typeof innerWidth==='number'&&innerWidth>=600&&innerWidth<1100&&innerHeight>innerWidth*1.1;
  function setupGrid(s){
    const names=s.blankNames?[['Tube 1',''],['Tube 2','muslin'],['Tube 3','foil'],['Tube 4','no leaf']]:[['Bright',''],['Dim','muslin'],['Dark','foil'],['No leaf','control']];
    const specs=[{},{wrap:'muslin'},{wrap:'foil'},{leaf:false}];
    let b=tubeDefs();
    for(let r=0;r<2;r++){
      const xs=[390,700];let g=lamp(xs);
      for(let k=0;k<2;k++){const i=r*2+k;g+=tube(xs[k],specs[i]);g+=T(xs[k],660,names[i][0],{anchor:'middle',size:58});if(names[i][1])g+=T(xs[k],740,names[i][1],{anchor:'middle',size:54,weight:500,fill:C.soft});}
      if(r===0){const lab=(tx,ty,word,y)=>`<path d="M252 ${y-16}L${tx} ${ty}" stroke="${C.ink}" stroke-width="3"/>`+T(240,y,word,{anchor:'end',size:62});g+=lab(312,138,'bung',160)+lab(345,380,'leaf',320)+lab(330,398,'gauze',425)+lab(340,500,'indicator',530);}
      b+=`<g transform="translate(0 ${r*860})">${g}</g>`;
    }
    b+=T(545,-34,'Same LED lamp distance',{anchor:'middle',size:54});
    return svg('Four sealed tubes for the hydrogencarbonate indicator investigation','Four boiling tubes with bungs, each the same distance from an LED lamp. Each has the same volume of orange-red indicator at the bottom and a gauze platform above it. Tubes 1 to 3 hold a leaf on the gauze, not touching the indicator. Tube 1 is uncovered (bright), tube 2 is wrapped in muslin (dim), tube 3 is wrapped in foil (dark). Tube 4 has no leaf and is the control in the light.',b,820,1640);
  }
  function setup(s={}){
    if(portraitTablet())return setupGrid(s);
    const xs=[390,650,910,1170];
    let b=tubeDefs()+lamp(xs);
    b+=tube(xs[0])+tube(xs[1],{wrap:'muslin'})+tube(xs[2],{wrap:'foil'})+tube(xs[3],{leaf:false});
    const lab=(tx,ty,word,y)=>`<path d="M252 ${y-16}L${tx} ${ty}" stroke="${C.ink}" stroke-width="3"/>`+T(240,y,word,{anchor:'end',size:62});
    b+=lab(312,138,'bung',160)+lab(345,380,'leaf',320)+lab(330,398,'gauze',425)+lab(340,500,'indicator',530);
    const names=s.blankNames?[['Tube 1',''],['Tube 2','muslin'],['Tube 3','foil'],['Tube 4','no leaf']]:[['Bright',''],['Dim','muslin'],['Dark','foil'],['No leaf','control']];
    names.forEach(([a,c],i)=>{b+=T(xs[i],660,a,{anchor:'middle',size:58});if(c)b+=T(xs[i],740,c,{anchor:'middle',size:54,weight:500,fill:C.soft});});
    b+=T(780,-34,'LED lamp, same distance for every tube',{anchor:'middle',size:54});
    return svg('Four sealed tubes for the hydrogencarbonate indicator investigation','Four boiling tubes with bungs under one LED lamp at the same distance. Each has the same volume of orange-red indicator at the bottom and a gauze platform above it. Tubes 1 to 3 hold a leaf on the gauze, not touching the indicator. Tube 1 is uncovered (bright), tube 2 is wrapped in muslin (dim), tube 3 is wrapped in foil (dark). Tube 4 has no leaf and is the control in the light.',b,1260,780);
  }
  function results(s={}){
    const xs=[390,690,990,1290];
    const blank=s.blank;
    const cols=blank?[C.paper,C.paper,C.paper,C.paper]:[C.purple,C.orange,C.yellow,C.orange];
    const words=blank?['?','?','?','?']:['purple','orange-red','yellow','orange-red'];
    let b=tubeDefs();
    xs.forEach((x,i)=>{b+=tube(x,{liquid:cols[i],leaf:i<3,word:null});});
    // Uncover the dark and dim tubes for reading: wraps removed after the time.
    const names=[['Bright',words[0]],['Dim',words[1]],['Dark',words[2]],['No leaf',words[3]]];
    names.forEach(([a,c],i)=>{b+=T(xs[i],650,a,{anchor:'middle',size:52});const parts=c==='orange-red'?['orange-','red']:[c];parts.forEach((w,k)=>{b+=T(xs[i],722+k*62,w,{anchor:'middle',size:48,weight:700,fill:blank?C.soft:C.ink});});});
    const banner=blank?'Record: own tubes · back-up set':'Illustrative: not observed in this lesson';
    b+=T(840,96,banner,{anchor:'middle',size:44,fill:blank?C.ink:'#8a2d12'});
    const desc=blank?'The same four tubes with blank colour labels for recording your own or back-up observations and their source.':'Illustrative results, not observed in this lesson, after about one hour with wraps removed for reading. Bright tube: purple, less carbon dioxide. Dim tube: orange-red, little net change in this example; a dim tube can differ. Dark tube: yellow, more carbon dioxide. No-leaf control: stayed orange-red.';
    return svg(blank?'Blank results tubes for recording':'Illustrative indicator results after about one hour',desc,b,1400,800);
  }
  function fresh(){
    const xs=[300,620];
    let b=tubeDefs()+lamp(xs);
    b+=tube(xs[0],{liquid:C.purple})+tube(xs[1],{liquid:C.purple,leaf:false});
    b+=T(xs[0],650,'Leaf',{anchor:'middle',size:52})+T(xs[0],722,'purple',{anchor:'middle',size:48,weight:700});
    b+=T(xs[1],650,'No leaf',{anchor:'middle',size:52})+T(xs[1],722,'purple',{anchor:'middle',size:48,weight:700});
    b+=T(460,-34,'Bright light, after 1 hour',{anchor:'middle',size:50});
    return svg('Fresh check: leaf tube and no-leaf control','Two sealed tubes in the same bright light after one hour. The leaf tube is purple. The no-leaf control tube is also purple.',b,920,760);
  }
  const figures={
    'co2-budget':budget,
    'co2-budget-blank':s=>budget({...s,setting:'blank',sequence:null}),
    'indicator-scale':scale,
    'indicator-strip':s=>scale({...s,strip:true}),
    'tube-setup':setup,
    'tube-setup-blank':s=>setup({...s,blankNames:true}),
    'results-illustrative':results,
    'results-blank':s=>results({...s,blank:true}),
    'fresh-tubes':fresh
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
