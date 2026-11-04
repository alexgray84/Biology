/* Original procedural teaching models; Three.js r160 is pinned beside the lesson. */
window.MaterialModels = (() => {
  const C={navy:0x194e68,gold:0xb88a2c,teal:0x83b0aa,red:0x9c4540,paper:0xf6f2e6,concrete:0xc9c7bc};
  const names={polymer:'Polymer chains: compare separate chains and cross-linked chains',composite:'Cutaway fibre composite: fibres within a surrounding matrix',beam:'Simply supported reinforced-concrete beam under a central downward load'};
  const button=(action,label)=>`<button type="button" data-model-action="${action}">${label}</button>`;
  function mount(host, config={}) {
    const type=['polymer','composite','beam'].includes(config.type)?config.type:'polymer', mode=config.mode||'predict';
    const state=config.state||(config.state={});
    const start=Number(config.initialProgress),initialProgress=Number.isFinite(start)?Math.max(0,Math.min(1,start)):0;
    const defaults={progress:initialProgress,predicted:false,labels:config.labels!==false,exploded:false,rx:0,ry:0};
    for(const [key,value] of Object.entries(defaults))if(state[key]===undefined)state[key]=value;
    state.progress=Math.max(0,Math.min(1,Number(state.progress)||0));
    let renderer=null,world=null,raf=0,disposed=false,playing=false,lastPointer=null;
    const removers=[],media=matchMedia('(prefers-reduced-motion: reduce)');
    host.classList.add('material-model');host.dataset.modelType=type;host.dataset.modelMode=mode;host.dataset.modelVariant=config.variant||'default';host.dataset.modelRoleLabels=String(config.roleLabels!==false);
    const motion=type!=='composite'&&mode!=='static',controls=config.controls!==false;
    const actions=controls?`${motion&&mode==='predict'?button('predict','We have predicted'):''}${motion?button('play',type==='beam'?'Apply load':'Heat gently')+button('pause','Pause'):''}${type==='composite'&&mode!=='static'?button('explode','Separate the parts')+button('assemble','Bring together'):''}${button('labels','Labels')}${button('reset','Reset')}`:'';
    const legend=type==='polymer'?'<span><i class="mm-key"></i>Along-chain bonds</span><span><i class="mm-key dashed"></i>Weaker forces</span><span><i class="mm-key gold"></i>Cross-links</span>':type==='composite'?'<span><i class="mm-key"></i>Glass fibres</span>'+(config.variant==='fibres-only'?'':'<span><i class="mm-key matrix"></i>Polymer matrix</span>'):'<span><i class="mm-key gold"></i>Steel reinforcement</span><span>Deflection exaggerated</span>';
    host.innerHTML=`<div class="mm-view"><div class="mm-fallback-host"></div><div class="mm-label-layer"></div></div><div class="mm-legend">${legend}</div>${actions?`<div class="mm-controls" aria-label="${names[type]} controls">${actions}</div>`:''}<p class="mm-status" role="status" aria-live="polite"></p>`;
    const view=host.querySelector('.mm-view'),fallback=host.querySelector('.mm-fallback-host'),layer=host.querySelector('.mm-label-layer'),status=host.querySelector('.mm-status');
    const on=(node,event,fn,options)=>{node.addEventListener(event,fn,options);removers.push(()=>node.removeEventListener(event,fn,options));};
    const find=action=>host.querySelector(`[data-model-action="${action}"]`);
    const ready=()=>mode!=='predict'||state.predicted;
    function sync() {
      host.dataset.modelState=playing?'playing':state.progress>=1?'complete':state.progress>0?'paused':state.predicted?'predicted':'ready';
      host.dataset.modelProgress=state.progress.toFixed(3);host.dataset.modelPredicted=String(state.predicted);host.dataset.modelExploded=String(state.exploded);
      if(find('play'))find('play').disabled=!ready()||playing||state.progress>=1;
      if(find('pause'))find('pause').disabled=!playing;
      if(find('predict')){find('predict').disabled=state.predicted;find('predict').setAttribute('aria-pressed',String(state.predicted));}
      if(find('labels'))find('labels').setAttribute('aria-pressed',String(state.labels));
      if(find('explode'))find('explode').setAttribute('aria-pressed',String(state.exploded));
      if(find('assemble'))find('assemble').setAttribute('aria-pressed',String(!state.exploded));
      layer.hidden=!state.labels;host.querySelector('.mm-legend').hidden=!state.labels;
      if(type==='composite')status.textContent=config.variant==='fibres-only'?'Loose glass fibres. The surrounding matrix is absent.':state.exploded?'Parts separated to see them. Real fibres remain bound in the matrix.':'Schematic glass-fibre composite. Rotate to inspect its components.';
      else if(state.progress>=1)status.textContent=type==='beam'?'Top: compression. Bottom: tension. This illustrates the stated load case.':'Separate chains can slide. Cross-links restrict relative sliding; chains remain intact.';
      else if(playing)status.textContent=type==='beam'?'Observe the beam as the downward load is applied.':'Observe relative chain movement during suitable heating.';
      else if(state.progress>0)status.textContent='Paused. Describe what changed before continuing.';
      else status.textContent=type==='beam'?'Predict which region will be squashed and which will be stretched.':'Predict which arrangement can be reshaped by suitable heating.';
    }
    function draw(){if(disposed)return;world?.update(state);if(renderer)world.draw();else fallback.innerHTML=window.MaterialModelFallbacks?.render({...config,type},state)||'<p>Separate chains may slide on suitable heating; cross-links restrict relative sliding. A fibre composite combines fibres with a matrix. A supported beam loaded downward is compressed at the top and stretched at the bottom.</p>';sync();}
    function stop(){if(raf)cancelAnimationFrame(raf);raf=0;playing=false;}
    function reset(){stop();Object.assign(state,defaults);draw();}
    function play(){
      if(!ready()||playing||state.progress>=1||mode==='static')return;
      if(media.matches){state.progress=1;draw();return;}
      playing=true;const start=performance.now(),initial=state.progress,duration=(1-initial)*2400;
      const frame=now=>{if(disposed||!playing)return;state.progress=Math.min(1,initial+(now-start)/duration*(1-initial));if(state.progress>=1){playing=false;raf=0;}draw();if(playing)raf=requestAnimationFrame(frame);};
      sync();raf=requestAnimationFrame(frame);
    }
    on(host,'click',event=>{
      const b=event.target.closest('[data-model-action]');if(!b||!host.contains(b)||b.disabled)return;
      const a=b.dataset.modelAction;
      if(a==='predict'){state.predicted=true;draw();}if(a==='play')play();if(a==='pause'){stop();draw();}if(a==='reset')reset();
      if(a==='labels'){state.labels=!state.labels;draw();}if(a==='explode'||a==='assemble'){state.exploded=a==='explode';draw();}
    });
    function loseContext(event){event?.preventDefault();stop();world?.dispose();world=null;renderer?.dispose();renderer?.domElement.remove();renderer=null;layer.innerHTML='';host.dataset.modelRenderer='svg';draw();}
    try {
      if(!window.THREE)throw new Error('Three.js unavailable');
      renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});
      renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.setClearColor(0xf5f2e7,0);
      renderer.domElement.tabIndex=0;renderer.domElement.setAttribute('role','img');renderer.domElement.setAttribute('aria-label',(type==='composite'&&config.variant==='fibres-only'?'Loose glass fibres without a surrounding matrix':names[type])+'. Drag or use arrow keys to rotate. The effect is shown only using the controls.');
      view.insertBefore(renderer.domElement,fallback);world=createWorld(THREE,type,config,renderer,view,layer);
      host.dataset.modelRenderer='three';on(renderer.domElement,'webglcontextlost',loseContext);
      on(renderer.domElement,'pointerdown',e=>{lastPointer=[e.clientX,e.clientY];renderer?.domElement.setPointerCapture(e.pointerId);});
      on(renderer.domElement,'pointermove',e=>{if(!lastPointer)return;state.ry=Math.max(-.5,Math.min(.5,state.ry+(e.clientX-lastPointer[0])*.005));state.rx=Math.max(-.22,Math.min(.22,state.rx+(e.clientY-lastPointer[1])*.004));lastPointer=[e.clientX,e.clientY];draw();});
      on(renderer.domElement,'pointerup',()=>{lastPointer=null;});on(renderer.domElement,'pointercancel',()=>{lastPointer=null;});
      on(renderer.domElement,'keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();e.stopPropagation();state.ry=Math.max(-.5,Math.min(.5,state.ry+(e.key==='ArrowLeft'?-.08:e.key==='ArrowRight'?.08:0)));state.rx=Math.max(-.22,Math.min(.22,state.rx+(e.key==='ArrowUp'?-.06:e.key==='ArrowDown'?.06:0)));draw();});
    } catch(error) {if(renderer){renderer.dispose();renderer.domElement.remove();renderer=null;}host.dataset.modelRenderer='svg';}
    const observer=new ResizeObserver(()=>{host.classList.toggle('mm-compact',host.getBoundingClientRect().height<270);if(renderer){world.resize();draw();}});observer.observe(view);observer.observe(host);
    on(document,'visibilitychange',()=>{if(document.hidden&&playing){stop();draw();}});
    const reduced=()=>{if(media.matches&&playing){stop();state.progress=1;draw();}};on(media,'change',reduced);
    world?.resize();draw();
    return {reset,dispose(){if(disposed)return;disposed=true;stop();observer.disconnect();removers.forEach(fn=>fn());world?.dispose();renderer?.dispose();renderer?.domElement.remove();host.innerHTML='';host.classList.remove('material-model','mm-compact');}};
  }
  function createWorld(T,type,config,renderer,view,layer) {
    const scene=new T.Scene(),group=new T.Group(),labels=[],animated=[],disposables=[];scene.add(group);
    const camera=new T.OrthographicCamera(-5,5,2.2,-2.2,.1,60);camera.position.set(0,3.3,12);camera.lookAt(0,0,0);
    scene.add(new T.HemisphereLight(0xfffdf3,0x7f939b,2.3));const key=new T.DirectionalLight(0xffffff,3);key.position.set(-3,6,8);scene.add(key);const rim=new T.DirectionalLight(0xf9df9a,1.2);rim.position.set(5,2,-5);scene.add(rim);
    const mat=(color,extra={})=>new T.MeshStandardMaterial({color,roughness:.43,metalness:.08,...extra});
    const place=(geometry,material,parent=group)=>{const mesh=new T.Mesh(geometry,material);parent.add(mesh);return mesh;};
    const bar=(a,b,r,color,parent=group)=>{const av=new T.Vector3(...a),bv=new T.Vector3(...b),mesh=place(new T.CylinderGeometry(r,r,av.distanceTo(bv),9),mat(color),parent);mesh.position.copy(av).add(bv).multiplyScalar(.5);mesh.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),bv.sub(av).normalize());return mesh;};
    const label=(text,point,kind='',visible=()=>true)=>{const el=document.createElement('span');el.className='mm-label';el.textContent=text;el.dataset.kind=kind;layer.appendChild(el);labels.push({el,point:new T.Vector3(...point),visible});};
    const arrow=(from,dir,length,color,head=.16)=>{const a=new T.ArrowHelper(new T.Vector3(...dir),new T.Vector3(...from),length,color,head,head*.6);group.add(a);return a;};
    if(type==='polymer') {
      const controlled=config.variant==='controlled',compare=!['separate','crosslinked'].includes(config.variant),types=controlled?['separate','separate','crosslinked']:compare?['separate','crosslinked']:[config.variant];
      types.forEach((kind,index)=>{
        const offset=controlled?(index-1)*3.7:compare?(index===0?-2.5:2.5):0,scale=controlled?.9:compare?1:1.45,assembly=new T.Group();assembly.position.x=offset;if(controlled&&index===1)assembly.rotation.z=.12;group.add(assembly);
        const chains=[];
        for(let row=0;row<4;row++){
          const chain=new T.Group();assembly.add(chain);chains.push(chain);const points=[];
          for(let i=0;i<=36;i++){const x=(-1.72+i*3.44/36)*scale,y=.78-row*.5+Math.sin(i*.31+row*.65)*.1,z=Math.cos(i*.23+row)*.13;points.push(new T.Vector3(x,y,z));}
          place(new T.TubeGeometry(new T.CatmullRomCurve3(points),72,.047,8,false),mat(C.navy),chain);
          points.filter((_,i)=>i%3===0).forEach(p=>{const bead=place(new T.SphereGeometry(.078,12,9),mat(row%2?0x2f6a7a:0x194e68),chain);bead.position.copy(p);});
        }
        const links=[];
        for(let row=0;row<3;row++)for(let pos=0;pos<3;pos++){
          const i=6+pos*12,x=(-1.72+i*3.44/36)*scale,a=[x,.78-row*.5+Math.sin(i*.31+row*.65)*.1,Math.cos(i*.23+row)*.13],b=[x,.78-(row+1)*.5+Math.sin(i*.31+(row+1)*.65)*.1,Math.cos(i*.23+row+1)*.13];
          if(kind==='crosslinked')bar(a,b,.055,C.gold,assembly);
          else{const geometry=new T.BufferGeometry().setFromPoints([new T.Vector3(...a),new T.Vector3(...b)]),material=new T.LineDashedMaterial({color:0x7d909d,dashSize:.055,gapSize:.055,transparent:true,opacity:.7});const line=new T.Line(geometry,material);line.computeLineDistances();assembly.add(line);links.push({line,a,b,row});}
        }
        label(controlled?['A','B','C'][index]:config.variant==='fresh'?(index===0?'R':'S'):kind==='separate'?'Separate chains':'Cross-linked chains',[offset,1.38,0]);
        animated.push(s=>{const eased=s.progress*s.progress*(3-2*s.progress);chains.forEach((chain,r)=>{chain.position.x=kind==='separate'?[-.32,.3,-.19,.38][r]*eased:0;});assembly.position.y=kind==='crosslinked'?Math.sin(s.progress*Math.PI*8)*.012:0;links.forEach(({line,a,b,row})=>{line.material.opacity=.7*(1-eased*.8);line.geometry.attributes.position.setXYZ(0,a[0]+chains[row].position.x,a[1],a[2]);line.geometry.attributes.position.setXYZ(1,b[0]+chains[row+1].position.x,b[1],b[2]);line.geometry.attributes.position.needsUpdate=true;line.computeLineDistances();});});
      });
    } else if(type==='composite') {
      camera.position.set(0,3.7,12);camera.lookAt(0,0,0);group.rotation.y=.3;
      const shell=mat(C.teal,{transparent:true,opacity:.27,depthWrite:false,side:T.DoubleSide,metalness:0,roughness:.2});
      const upper=place(new T.BoxGeometry(5.4,.57,1.8),shell),lower=place(new T.BoxGeometry(5.4,.57,1.8),shell);upper.position.y=.285;lower.position.y=-.285;upper.renderOrder=3;lower.renderOrder=3;upper.visible=lower.visible=config.variant!=='fibres-only';
      [upper,lower].forEach(mesh=>{const edges=new T.LineSegments(new T.EdgesGeometry(mesh.geometry),new T.LineBasicMaterial({color:0x4b827d,transparent:true,opacity:.55}));mesh.add(edges);});
      for(let y=-1;y<=1;y++)for(let z=-1;z<=1;z++){
        const fibre=bar([-2.5,y*.3,z*.52],[2.5,y*.3,z*.52],.073,C.navy);const end=place(new T.SphereGeometry(.073,12,8),mat(0x427f8d));end.position.set(2.5,y*.3,z*.52);
        animated.push(s=>{fibre.position.y=y*.3*(s.exploded?1.45:1);end.position.y=fibre.position.y;});
      }
      label('Polymer matrix',[1.7,.93,0],'',()=>config.variant!=='fibres-only');label(config.variant==='fibres-only'?'Loose glass fibres':'Glass fibres',[-1.75,-.95,.7],'blue');
      animated.push(s=>{upper.position.y=.285+(s.exploded?1:0);lower.position.y=-.285-(s.exploded?1:0);labels[0].point.y=s.exploded?1.75:.93;});
    } else {
      camera.position.set(0,3.8,12);camera.lookAt(0,.1,0);
      const geometry=new T.BoxGeometry(6.2,.85,1.45,64,2,2),base=geometry.attributes.position.array.slice(),concrete=place(geometry,mat(C.concrete,{roughness:.87,metalness:0}));
      const edges=new T.LineSegments(new T.EdgesGeometry(geometry),new T.LineBasicMaterial({color:0x627078,transparent:true,opacity:.3}));concrete.add(edges); // Static edges are hidden on loading; the deformed solid remains authoritative.
      const sag=(x,p)=>Math.abs(x)>=2.7?0:-.43*p*Math.cos(x/2.7*Math.PI/2);
      const steel=[];
      for(const z of [-.46,.46])for(let i=0;i<24;i++){
        const x=-2.95+i*5.9/24,next=x+5.9/24,segment=bar([x,-.24,z],[next,-.24,z],.052,C.gold);steel.push({segment,x,next,z});
      }
      // The front concrete surface is translucent so the steel remains visible.
      concrete.material.transparent=true;concrete.material.opacity=.69;concrete.material.depthWrite=false;concrete.renderOrder=2;
      for(const x of [-2.7,2.7]){const support=place(new T.CylinderGeometry(0,.32,.57,3),mat(0x88979b));support.position.set(x,-.74,0);support.rotation.y=Math.PI/6;const foot=place(new T.BoxGeometry(.85,.1,1.9),mat(0xabb2ad));foot.position.set(x,-1.08,0);}
      const load=arrow([0,2.05,0],[0,-1,0],1.1,C.red,.21),compression=[arrow([-.9,.6,.9],[1,0,0],.62,C.red),arrow([.9,.6,.9],[-1,0,0],.62,C.red)],tension=[arrow([-.25,-.63,.9],[-1,0,0],.72,C.navy),arrow([.25,-.63,.9],[1,0,0],.72,C.navy)];
      label('Downward load',[0,2.02,0],'red',s=>s.progress>0);label('Compression',[-1.65,.97,.6],'red',s=>s.progress>0&&config.roleLabels!==false);label('Tension',[0,-1.08,.7],'blue',s=>s.progress>0&&config.roleLabels!==false);label('Supported',[-2.7,-1.28,0]);label('Supported',[2.7,-1.28,0]);
      animated.push(s=>{const positions=geometry.attributes.position;for(let i=0;i<positions.count;i++)positions.setY(i,base[i*3+1]+sag(base[i*3],s.progress));positions.needsUpdate=true;geometry.computeVertexNormals();edges.visible=s.progress===0;
        steel.forEach(({segment,x,next,z})=>{const a=new T.Vector3(x,-.24+sag(x,s.progress),z),b=new T.Vector3(next,-.24+sag(next,s.progress),z);segment.position.copy(a).add(b).multiplyScalar(.5);segment.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),b.sub(a).normalize());});
        load.visible=s.progress>0;load.position.y=1.7+sag(0,s.progress);compression.forEach(a=>{a.visible=s.progress>0&&config.roleLabels!==false;a.position.y=.6+sag(0,s.progress);});tension.forEach(a=>{a.visible=s.progress>0&&config.roleLabels!==false;a.position.y=-.63+sag(0,s.progress);});
      });
    }
    const initialRotation=group.rotation.clone();let current={progress:0,labels:true,rx:0,ry:0};
    function update(s){current=s;group.rotation.x=initialRotation.x+(s.rx||0);group.rotation.y=initialRotation.y+(s.ry||0);animated.forEach(fn=>fn(s));}
    function draw(){renderer.render(scene,camera);group.updateMatrixWorld();const bounds=view.getBoundingClientRect();labels.forEach(({el,point,visible})=>{el.hidden=!visible(current);const p=group.localToWorld(point.clone()).project(camera),halfWidth=el.offsetWidth/2+4,halfHeight=el.offsetHeight/2+4;el.style.left=`${Math.max(halfWidth,Math.min(bounds.width-halfWidth,(p.x*.5+.5)*bounds.width))}px`;el.style.top=`${Math.max(halfHeight,Math.min(bounds.height-halfHeight,(-p.y*.5+.5)*bounds.height))}px`;});}
    function resize(){const r=view.getBoundingClientRect();if(!r.width||!r.height)return;const aspect=r.width/r.height,baseHeight=type==='composite'?2.3:type==='beam'?2.15:1.85,minWidth=type==='polymer'?(config.variant==='controlled'?12.6:9.5):7,h=Math.max(baseHeight,minWidth/(2*aspect));camera.left=-h*aspect;camera.right=h*aspect;camera.top=h;camera.bottom=-h;camera.updateProjectionMatrix();renderer.setSize(r.width,r.height,false);}
    function dispose(){const geometries=new Set(),materials=new Set();scene.traverse(o=>{if(o.geometry)geometries.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:o.material?[o.material]:[])materials.add(m);});geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());disposables.forEach(fn=>fn());}
    return {update,draw,resize,dispose};
  }
  return {mount};
})();
