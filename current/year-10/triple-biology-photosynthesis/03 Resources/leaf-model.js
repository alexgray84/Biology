/* Original Three.js r160 leaf model. Naturalistic lighting and geometry serve a
   scientific schematic, not photographic anatomy. All rendering is on demand:
   no autoplay, continuous animation, network, storage or pupil data. */
window.LessonModels = window.LessonModels || {};
window.LessonModels.leaf = (() => {
  'use strict';
  const defaults={view:'section',focus:'all',labels:true,route:false};
  const home={section:[.12,-.13,1],whole:[-.20,-.12,1],stoma:[0,0,1]};
  function ensure(s,p={}) {
    if(!['section','whole','stoma'].includes(s.view))s.view='section';
    if(!['all','light','gas','stoma'].includes(s.focus))s.focus='all';
    if(typeof s.labels!=='boolean')s.labels=true;
    if(typeof s.route!=='boolean')s.route=false;
    if(p.allowRoute===false||p.routeReveal===false)s.route=false;
    const h=home[s.view];
    if(!Number.isFinite(s.rx))s.rx=h[0];if(!Number.isFinite(s.ry))s.ry=h[1];
    if(!Number.isFinite(s.zoom))s.zoom=1;s.zoom=Math.max(.7,Math.min(1.65,s.zoom));
    s.rx=Math.max(-1.1,Math.min(1.1,s.rx));
  }
  function describe(s={}) {
    const view=s.view||'section';
    if(view==='whole')return 'Whole broad leaf: a curved lamina and branching veins. The section view reveals the tissue beneath the surface. This is one typical terrestrial leaf design.';
    if(view==='stoma')return 'Surface view: a pore lies between two guard cells. Guard cells regulate its opening. Gases diffuse through the open pore; the cells do not pump them.';
    if(s.route)return 'Section with the revealed inward CO₂ route: outside air, open pore, air spaces and mesophyll. Net movement follows the stated concentration gradient. Arrows show a pathway, not a pump.';
    if(s.focus==='light')return 'Light view: transparent upper epidermis above chloroplast-rich palisade cells. Light arrows show incident direction. Veins deliver water in xylem and carry dissolved sugars away in phloem.';
    if(s.focus==='gas')return 'Gas view: connected air spaces between spongy cells; a pore through the lower epidermis bordered by guard cells. The route is hidden until you reveal it.';
    return 'Leaf section: upper epidermis, chloroplast-rich palisade cells, spongy cells with connected air spaces, and lower epidermis with an open pore. The tissue is enlarged schematically; proportions vary between leaves.';
  }
  const button=(label,value,pressed,key,setting)=>`<button type="button" data-action="model" data-value="${value}" data-key="${key}" data-setting="${setting}" aria-pressed="${pressed}">${label}</button>`;
  const cmd=(label,command)=>`<button type="button" data-action="model-cmd" data-command="${command}" data-value="${command}">${label}</button>`;
  function controls(p,s) {
    ensure(s,p);
    let h=`<div class="control-group leaf-view-controls" role="group" aria-label="Choose a view">${[['section','Section'],['whole','Whole leaf'],['stoma','Pore close-up']].map(([v,l])=>button(l,`view=${v}`,s.view===v,'view',v)).join('')}</div>`;
    if(s.view==='section') h+=`<div class="control-group" role="group" aria-label="Focus the section">${[['all','All tissues'],['light','Light'],['gas','Gas access']].map(([v,l])=>button(l,`focus=${v}`,s.focus===v,'focus',v)).join('')}</div>`;
    h+=`<details class="model-camera"><summary>Turn or enlarge the model</summary><div class="control-group" role="group" aria-label="Turn and enlarge the model">${cmd('Turn left','rotate-left')}${cmd('Turn right','rotate-right')}${cmd('Tilt up','tilt-up')}${cmd('Tilt down','tilt-down')}${cmd('Zoom in','zoom-in')}${cmd('Zoom out','zoom-out')}${cmd('Reset view','reset')}</div></details>`;
    if(s.view==='section'&&p.allowRoute!==false&&p.routeReveal!==false) h+=`<div class="control-group">${button(s.route?'Hide gas route':'Reveal gas route',`route=${!s.route}`,s.route,'route',!s.route)}</div>`;
    return h;
  }
  function command(c,s,p) {
    ensure(s,p);
    if(c==='rotate-left')s.ry-=.18;if(c==='rotate-right')s.ry+=.18;
    if(c==='tilt-up')s.rx-=.14;if(c==='tilt-down')s.rx+=.14;
    if(c==='zoom-in')s.zoom+=.12;if(c==='zoom-out')s.zoom-=.12;
    if(c==='reset'){s.rx=home[s.view][0];s.ry=home[s.view][1];s.zoom=1;}
    ensure(s,p);
  }
  function onChange(k,s,p) {
    ensure(s,p);if(k==='view'){s.rx=home[s.view][0];s.ry=home[s.view][1];s.zoom=1;}
    if(k==='focus'&&s.focus==='stoma')s.view='stoma';
  }
  function mount(host,state,phase={},ctx={}) {
    const T=window.THREE;if(!T)return null;ensure(state,phase);
    let renderer;
    try{renderer=new T.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});}catch(_){return null;}
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));renderer.outputColorSpace=T.SRGBColorSpace;
    renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.2;
    const canvas=renderer.domElement;canvas.tabIndex=0;canvas.setAttribute('role','img');
    canvas.setAttribute('aria-label','Scientific three-dimensional leaf model. Drag or use arrow keys to turn; plus and minus zoom. The adjacent text describes each view. A labelled static diagram is available.');
    canvas.style.touchAction='pan-y';host.appendChild(canvas);host.classList.add('is-live');
    const scene=new T.Scene(),camera=new T.PerspectiveCamera(32,1,.1,100),root=new T.Group();scene.add(root);
    scene.add(new T.HemisphereLight(0xfaf9ed,0x486449,2.1));
    const key=new T.DirectionalLight(0xfff3d2,3.2);key.position.set(-3,6,8);scene.add(key);
    const rim=new T.DirectionalLight(0xd3e9df,1.5);rim.position.set(5,1,-4);scene.add(rim);
    const geometries=new Set(),materials=new Set();
    const G=g=>{geometries.add(g);return g;};
    const M=(color,extra={})=>{const m=new T.MeshStandardMaterial({color,roughness:.56,metalness:0,...extra});materials.add(m);return m;};
    const walls=M(0x74875b),palisadeMat=M(0xaecb7c),spongyMat=M(0xc1d496),chloroMat=M(0x56834b),epidermisMat=M(0xd6e2b7,{roughness:.35}),cuticleMat=M(0xdcd8a0,{transparent:true,opacity:.65,roughness:.22});
    const surfaceMat=M(0x3c7739,{roughness:.46,side:T.DoubleSide}),veinMat=M(0x9cb56b,{roughness:.7}),guardMat=M(0x85b66e),lightMat=M(0xd8b23a,{emissive:0xd8b23a,emissiveIntensity:.25});
    const unitSphere=G(new T.SphereGeometry(1,20,14));
    function ellipsoid(parent,x,y,z,sx,sy,sz,material=spongyMat){const m=new T.Mesh(unitSphere,material);m.position.set(x,y,z);m.scale.set(sx,sy,sz);parent.add(m);return m;}
    function tube(parent,pts,r,mat){const curve=new T.CatmullRomCurve3(pts.map(p=>new T.Vector3(...p)));const m=new T.Mesh(G(new T.TubeGeometry(curve,Math.max(12,pts.length*6),r,7,false)),mat);parent.add(m);return m;}
    function chloroplasts(parent,x,y,z,rx,ry,count,seed=0){for(let i=0;i<count;i++){const a=(i/count)*Math.PI*2+seed;const cp=ellipsoid(parent,x+Math.cos(a)*rx,y+Math.sin(a)*ry,z+.12,.07,.105,.045,chloroMat);cp.rotation.z=a*.4;}}
    function cell(parent,x,y,z,sx,sy,sz,mat,seed){const wall=ellipsoid(parent,x,y,z,sx,sy,sz,walls);const inner=ellipsoid(parent,x,y,z+.014,sx*.958,sy*.97,sz,mat);if(mat!==epidermisMat)chloroplasts(parent,x,y,z+sz*.96,sx*.61,sy*.66,mat===palisadeMat?6:3,seed);return [wall,inner];}
    const section=new T.Group(),whole=new T.Group(),stoma=new T.Group(),rays=new T.Group(),route=new T.Group();root.add(section,whole,stoma);section.add(rays,route);
    /* Tissue front is the cut face: palisade cells are tall and close, while
       spongy cells are irregularly spaced, with visible connected empty space. */
    for(let layer=0;layer<2;layer++)for(let i=0;i<10;i++){
      const x=-2.32+i*.515,z=layer?-.28:.20;
      cell(section,x,1.29,z,.263,.19,.29,epidermisMat,i);
      if(i!==7)cell(section,x,-1.15,z,.263,.17,.29,epidermisMat,i);
    }
    const cut=new T.Mesh(G(new T.BoxGeometry(5.1,.045,1.12)),cuticleMat);cut.position.set(0,1.505,0);section.add(cut);
    for(let row=0;row<2;row++)for(let i=0;i<10;i++)cell(section,-2.32+i*.515,.67,row?-.28:.24,.239,.43,.25,palisadeMat,i*.4);
    for(let row=0;row<2;row++)for(let i=0;i<6;i++){
      const x=-2.15+i*.82+(row?.17:0),y=-.20-row*.49+(i%2)*.06,z=.28;
      const c=cell(section,x,y,z,.29+(i%3)*.025,.22+(i%2)*.05,.24,spongyMat,i);c.forEach(m=>m.rotation.z=(i%3-1)*.3);
      if(i%2===0)cell(section,x+.3,y-.12,-.3,.28,.22,.22,spongyMat,i);
    }
    const gx=-2.32+7*.515;
    const bundle=new T.Group();section.add(bundle);bundle.position.set(-.1,-.47,.56);
    ellipsoid(bundle,0,0,0,.46,.27,.16,M(0xd5d2a5));
    const xylem=M(0x3d7cc9),phloem=M(0xc6a139);
    for(let i=-1;i<=1;i++){ellipsoid(bundle,i*.18,.10,.16,.073,.078,.045,xylem);ellipsoid(bundle,i*.18,-.10,.16,.066,.068,.045,phloem);}
    ellipsoid(section,gx-.18,-1.14,.24,.105,.225,.29,guardMat);ellipsoid(section,gx+.18,-1.14,.24,.105,.225,.29,guardMat);
    for(const x of [-1.3,0,1.3]){const a=new T.ArrowHelper(new T.Vector3(0,-1,0),new T.Vector3(x,2.15,.1),.55,0xd8b23a,.16,.1);rays.add(a);a.line.geometry&&geometries.add(a.line.geometry);a.cone.geometry&&geometries.add(a.cone.geometry);materials.add(a.line.material);materials.add(a.cone.material);}
    const routeMat=M(0x6b7280,{emissive:0x6b7280,emissiveIntensity:.2});
    const routePoints=[[gx,-1.83,.59],[gx,-1.14,.59],[gx-.1,-.72,.59],[gx-.43,-.34,.59],[gx-.15,.11,.59],[gx-.15,.43,.59]];
    tube(route,routePoints,.035,routeMat);const arrowHead=new T.Mesh(G(new T.ConeGeometry(.105,.25,16)),routeMat);arrowHead.position.set(gx-.15,.53,.59);route.add(arrowHead);
    /* A gently folded whole lamina, with a petiole and branching venation. */
    const verts=[],uvs=[],indices=[],N=48,W=20;
    function leafPoint(t,u){const width=Math.pow(Math.sin(Math.PI*t),.85)*1.55;return new T.Vector3(u*width,(t-.5)*5.3,.14*Math.cos(u*Math.PI/2)+.10*Math.sin(t*Math.PI*2)+Math.abs(u)*.1);}
    for(let i=0;i<=N;i++)for(let j=0;j<=W;j++){const t=i/N,u=(j/W)*2-1,p=leafPoint(t,u);verts.push(p.x,p.y,p.z);uvs.push(j/W,t);if(i<N&&j<W){const a=i*(W+1)+j,b=a+W+1;indices.push(a,b,a+1,b,b+1,a+1);}}
    const leafGeo=G(new T.BufferGeometry());leafGeo.setAttribute('position',new T.Float32BufferAttribute(verts,3));leafGeo.setAttribute('uv',new T.Float32BufferAttribute(uvs,2));leafGeo.setIndex(indices);leafGeo.computeVertexNormals();whole.add(new T.Mesh(leafGeo,surfaceMat));
    tube(whole,[[0,-3.1,.1],[0,-2.6,.16],[0,-1.2,.16],[0,1.2,.13],[0,2.55,.17]],.035,veinMat);
    for(let i=1;i<8;i++){const t=.1+i*.09;for(const side of [-1,1]){const p0=leafPoint(t,0),p1=leafPoint(t+.07,side*.48),p2=leafPoint(Math.min(.97,t+.14),side*.93);[p0,p1,p2].forEach(p=>p.z+=.025);tube(whole,[[p0.x,p0.y,p0.z],[p1.x,p1.y,p1.z],[p2.x,p2.y,p2.z]],.014,veinMat);}}
    /* Surface view of the stomatal complex: kidney-shaped guard cells and an
       actual central opening, rather than a solid cell labelled as a pore. */
    const surface=new T.Mesh(G(new T.BoxGeometry(5.15,3.35,.11)),M(0xd0dfb4,{roughness:.75}));surface.position.z=-.24;stoma.add(surface);
    for(let row=0;row<3;row++)for(let i=0;i<5;i++){
      const x=-2.4+i*1.15+(row%2?.35:0),y=-1.4+row*1.3;
      if(Math.abs(x)<1.1&&Math.abs(y)<1.1)continue;
      const c=ellipsoid(stoma,x,y,-.15,.67,.67,.13,epidermisMat);c.rotation.z=(i-row)*.18;
    }
    const pore=new T.Mesh(G(new T.PlaneGeometry(.85,2.2)),M(0x40533f,{roughness:1}));pore.position.z=-.175;stoma.add(pore);
    function guard(side){const shape=new T.Shape();shape.moveTo(-.18,-1.18);shape.bezierCurveTo(-1.5,-1.15,-1.5,1.15,-.18,1.18);shape.bezierCurveTo(-.64,.57,-.64,-.57,-.18,-1.18);const geo=G(new T.ExtrudeGeometry(shape,{depth:.23,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.07,bevelThickness:.06,curveSegments:32}));const m=new T.Mesh(geo,guardMat);m.scale.x=side;stoma.add(m);for(let i=0;i<6;i++){const a=-1.1+i*.44,x=side*(-.77-.16*Math.cos(a)),y=.98*Math.sin(a);const cp=ellipsoid(stoma,x,y,.31,.075,.115,.052,chloroMat);cp.rotation.z=side*a*.5;}}
    guard(1);guard(-1);
    let disposed=false,visible=true,lost=false,last=null,lastView=state.view,raf=0;
    function draw(){if(!disposed&&!lost&&visible)renderer.render(scene,camera);}
    /* Fit the scientific subject, rather than using one distant camera for
       every canvas shape. The pore view deliberately frames the guard-cell
       pair: the surrounding epidermis is context and may extend off canvas.
       Use the visible meshes' cached bounds; the distant corner of one whole
       scene box would needlessly shrink these shallow anatomical models. */
    function frame(s){
      const subject=s.view==='whole'?whole:s.view==='stoma'?stoma:section,points=[],box=new T.Box3();root.updateMatrixWorld(true);
      subject.traverseVisible(object=>{
        const geometry=object.geometry;if(!geometry)return;
        if(s.view==='stoma'&&geometry.type!=='ExtrudeGeometry'&&object.material!==chloroMat)return;
        if(!geometry.boundingBox)geometry.computeBoundingBox();const b=geometry.boundingBox;if(!b)return;
        for(const x of [b.min.x,b.max.x])for(const y of [b.min.y,b.max.y])for(const z of [b.min.z,b.max.z]){
          const point=new T.Vector3(x,y,z).applyMatrix4(object.matrixWorld);points.push(point);box.expandByPoint(point);
        }
      });
      if(!points.length)return;
      const center=box.getCenter(new T.Vector3()),tan=Math.tan(T.MathUtils.degToRad(camera.fov/2)),fill=.88;let distance=.5;
      for(const point of points){const dz=point.z-center.z;distance=Math.max(distance,dz+Math.abs(point.y-center.y)/(tan*fill),dz+Math.abs(point.x-center.x)/(tan*camera.aspect*fill));}
      camera.position.set(center.x,center.y,center.z+distance);camera.lookAt(center);camera.zoom=s.zoom;camera.updateProjectionMatrix();
    }
    function resize(){if(disposed||lost)return;const r=host.getBoundingClientRect();if(!r.width||!r.height)return;renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;frame(state);draw();}
    function apply(s){ensure(s,phase);state=s;section.visible=s.view==='section';whole.visible=s.view==='whole';stoma.visible=s.view==='stoma';rays.visible=s.focus==='light';route.visible=!!s.route;root.rotation.set(s.rx,s.ry,0);root.scale.setScalar(s.view==='whole'?.88:1);frame(s);if(lastView!==s.view){lastView=s.view;if(ctx.announce)ctx.announce(describe(s));}draw();}
    function changed(){ensure(state,phase);apply(state);}
    const down=e=>{if(e.button!==0)return;last=[e.clientX,e.clientY];canvas.style.touchAction='none';try{canvas.setPointerCapture(e.pointerId);}catch(_){}};
    const move=e=>{if(!last)return;state.ry+=(e.clientX-last[0])*.008;state.rx+=(e.clientY-last[1])*.007;last=[e.clientX,e.clientY];changed();};
    const up=()=>{last=null;canvas.style.touchAction='pan-y';};
    const keydown=e=>{const commands={ArrowLeft:'rotate-left',ArrowRight:'rotate-right',ArrowUp:'tilt-up',ArrowDown:'tilt-down','+':'zoom-in','=':'zoom-in','-':'zoom-out',Home:'reset'};if(!commands[e.key])return;e.preventDefault();e.stopPropagation();command(commands[e.key],state,phase);changed();};
    const contextlost=e=>{e.preventDefault();lost=true;host.classList.remove('is-live');canvas.hidden=true;if(ctx.refresh)ctx.refresh();if(ctx.announce)ctx.announce('The 3D view is unavailable. Use the static labelled diagram and text description.');};
    const contextrestored=()=>{lost=false;canvas.hidden=false;host.classList.add('is-live');resize();apply(state);if(ctx.refresh)ctx.refresh();};
    canvas.addEventListener('pointerdown',down);canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerup',up);canvas.addEventListener('pointercancel',up);canvas.addEventListener('lostpointercapture',up);canvas.addEventListener('keydown',keydown);canvas.addEventListener('webglcontextlost',contextlost);canvas.addEventListener('webglcontextrestored',contextrestored);
    const observer=typeof ResizeObserver!=='undefined'?new ResizeObserver(resize):null;if(observer)observer.observe(host);else window.addEventListener('resize',resize);
    apply(state);resize();raf=requestAnimationFrame(resize);
    return {
      update:apply,
      command:()=>apply(state),
      visibility(v){visible=!!v;if(visible)resize();},
      dispose(){if(disposed)return;disposed=true;cancelAnimationFrame(raf);observer&&observer.disconnect();if(!observer)window.removeEventListener('resize',resize);canvas.removeEventListener('pointerdown',down);canvas.removeEventListener('pointermove',move);canvas.removeEventListener('pointerup',up);canvas.removeEventListener('pointercancel',up);canvas.removeEventListener('lostpointercapture',up);canvas.removeEventListener('keydown',keydown);canvas.removeEventListener('webglcontextlost',contextlost);canvas.removeEventListener('webglcontextrestored',contextrestored);geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());renderer.renderLists.dispose();renderer.dispose();canvas.remove();host.classList.remove('is-live');}
    };
  }
  return {caption:'Original 3D scientific schematic of a typical terrestrial broad leaf. Tissue proportions are enlarged; structures vary among species. Drag or use the turn buttons. No automatic movement.',defaults,controls,describe,readout:(p,s)=>`<p class="leaf-state-description">${describe(s)}</p>`,onChange,command,mount};
})();
