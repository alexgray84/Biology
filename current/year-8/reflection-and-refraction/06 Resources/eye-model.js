/* Edu OS eye teaching model. Local Three.js r149; no network or pupil data. */
(() => {
'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const parts=[
 {id:'cornea',name:'Cornea',job:'The clear curved front refracts incoming light and provides much of the eye’s focusing.',pos:[-1.91,.18,0],side:0,row:1},
 {id:'iris',name:'Iris',job:'The iris controls pupil size. In bright light its circular muscles contract and radial muscles relax. In dim light the radial muscles contract and circular muscles relax.',pos:[-1.36,.67,0],side:0,row:0},
 {id:'pupil',name:'Pupil',job:'The opening in the iris through which light passes. It is a hole, not a black tissue.',pos:[-1.37,0,0],side:0,row:2},
 {id:'lens',name:'Lens',job:'The transparent lens sits behind the iris and helps focus light onto the retina.',pos:[-1.04,.28,0],side:1,row:1},
 {id:'retina',name:'Retina',job:'The light-sensitive lining at the back detects light and converts it into electrical signals.',pos:[1.56,.05,0],side:1,row:2},
 {id:'nerve',name:'Optic nerve',job:'The optic nerve carries electrical signals from the retina towards the brain. It does not carry light.',pos:[1.94,-.83,0],side:1,row:3},
 {id:'ciliary',name:'Ciliary muscle',job:'This ring of muscle changes tension in the suspensory ligaments. For near focus it contracts, letting the lens become thicker. It does not control pupil size.',pos:[-.99,1.10,0],side:1,row:0},
 {id:'ligaments',name:'Suspensory ligaments',job:'Also called zonular fibres. They connect the ciliary body to the lens. Taut fibres pull the lens flatter; reduced tension lets it become thicker.',pos:[-1.01,-.86,0],side:0,row:3}
];
let view='section', light='normal', labels=true, fallback=false, turn=0, pitch=0, distance=6.8, focus='rest', ciliary, ligaments, renderer,scene,camera,iris,cutMaterials=[],objects={},paths,signals;
const stage=$('.stage'), canvas=$('#eye'), leaders=$('#leaders');
parts.forEach(p=>{const b=document.createElement('button');b.className='part';b.dataset.part=p.id;b.innerHTML=p.name;b.addEventListener('click',()=>select(p));$('#labels-box').append(b);const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=p.name;dd.textContent=p.job;$('#structure-list').append(dt,dd)});
function select(p){$('#part-title').textContent=p.name;$('#part-description').textContent=p.job;$$('.part').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.part===p.id)));}
function staticView(on){fallback=on;$$('[data-view],[data-light],#labels,#left,#right,#up,#down,#zoom-in,#zoom-out,#reset,[data-focus]').forEach(b=>b.disabled=on);$('#light-status').hidden=on;$('#static').hidden=!on;canvas.hidden=on;leaders.hidden=on;$('#labels-box').hidden=on;$('#fallback').setAttribute('aria-pressed',String(on));$('#fallback').textContent=on?'Return to 3D':'Static view';$('#view-caption').hidden=on;$('#legend').hidden=on||view!=='path';if(on){$('details').open=true;}update()}
function irisGeometry(radius){const s=new THREE.Shape();s.absarc(0,0,.94,0,Math.PI*2,false);const hole=new THREE.Path();hole.absarc(0,0,radius,0,Math.PI*2,true);s.holes.push(hole);const g=new THREE.ExtrudeGeometry(s,{depth:.045,bevelEnabled:false,curveSegments:64});g.translate(0,0,-.0225);g.userData.radius=radius;return g}
function buildFocus(){
 if(!scene)return;
 if(ciliary){scene.remove(ciliary);ciliary.geometry.dispose();}
 if(ligaments){scene.remove(ligaments);ligaments.children.forEach(m=>m.geometry.dispose());}
 const T=THREE,near=focus==='near',far=focus==='far';
 const r=near?1.0:far?1.16:1.10,ly=near?.66:far?.77:.71,lx=near?.34:far?.19:.26;
 objects.lens.scale.set(lx,ly,ly);
 const cm=window.focusMuscleMaterial,zm=window.focusLigamentMaterial;
 ciliary=new T.Mesh(new T.TorusGeometry(r,.10,16,96),cm);ciliary.rotation.y=Math.PI/2;ciliary.position.x=-1.01;scene.add(ciliary);
 ligaments=new T.Group();
 for(let i=0;i<40;i++){const a=i*Math.PI*2/40;const start=new T.Vector3(-1.01,ly*Math.cos(a),ly*Math.sin(a));const end=new T.Vector3(-1.01,(r-.10)*Math.cos(a),(r-.10)*Math.sin(a));const mid=start.clone().lerp(end,.5);mid.x+=near?.045:0;const curve=new T.QuadraticBezierCurve3(start,mid,end);ligaments.add(new T.Mesh(new T.TubeGeometry(curve,8,.009,6,false),zm));}
 scene.add(ligaments);parts.find(p=>p.id==='ciliary').pos=[-1.01,r,0];parts.find(p=>p.id==='ligaments').pos=[-1.01,-(ly+r-.10)/2,0];
}
function init(){
 if(!window.THREE)throw Error('Three.js unavailable');
 const T=THREE;renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.localClippingEnabled=true;renderer.outputEncoding=T.sRGBEncoding;
 scene=new T.Scene();camera=new T.PerspectiveCamera(36,1,.1,100);scene.add(new T.HemisphereLight(0xffffff,0x86786a,.85));const lamp=new T.DirectionalLight(0xffffff,.7);lamp.position.set(-4,5,7);scene.add(lamp);
 const clip=new T.Plane(new T.Vector3(0,0,-1),0);
 function material(color,transparent=false,opacity=1){const m=new T.MeshPhongMaterial({color,side:T.DoubleSide,transparent,opacity,shininess:18,clippingPlanes:[clip]});cutMaterials.push(m);return m}
 function mesh(id,geo,mat,x=0,y=0,z=0){const m=new T.Mesh(geo,mat);m.position.set(x,y,z);scene.add(m);objects[id]=m;return m}
 // Lathe profiles around X. The anterior is open for the corneal dome.
 function shell(radius,minX){const a=[];const theta0=Math.acos(minX/radius);for(let i=0;i<=96;i++){const t=theta0*(1-i/96);a.push(new T.Vector2(radius*Math.sin(t),radius*Math.cos(t)))}const g=new T.LatheGeometry(a,96);g.rotateZ(-Math.PI/2);return g}
 mesh('sclera',shell(1.65,-1.35),material(0xeae3d2));mesh('retina',shell(1.57,-1.32),material(0xdb8963));
 const corneaProfile=[];for(let i=0;i<=48;i++){const t=i/48*Math.PI/2;corneaProfile.push(new T.Vector2(.95*Math.sin(t),-1.35-.63*Math.cos(t)))}const cg=new T.LatheGeometry(corneaProfile,96);cg.rotateZ(-Math.PI/2);mesh('cornea',cg,material(0x73b7c2,true,.42));
 iris=mesh('iris',irisGeometry(.30),material(0x3a797a),-1.345);iris.rotation.y=Math.PI/2;
 const lens=mesh('lens',new T.SphereGeometry(1,64,48),material(0x64aeb9,true,.86),-1.01);lens.scale.set(.26,.71,.71);
 window.focusMuscleMaterial=material(0x985a66);window.focusLigamentMaterial=material(0x785126);buildFocus();
 const nerveCurve=new T.CatmullRomCurve3([new T.Vector3(1.43,-.55,-.04),new T.Vector3(1.75,-.7,-.04),new T.Vector3(2.2,-.98,-.04)]);mesh('nerve',new T.TubeGeometry(nerveCurve,32,.16,24,false),new T.MeshPhongMaterial({color:0xe1b684}));
 paths=new T.Group();signals=new T.Group();scene.add(paths,signals);
 function line(points,color,dashed,group){const g=new T.BufferGeometry().setFromPoints(points.map(a=>new T.Vector3(...a)));const m=dashed?new T.LineDashedMaterial({color,dashSize:.10,gapSize:.065,depthTest:false}):new T.LineBasicMaterial({color,depthTest:false});const l=new T.Line(g,m);l.renderOrder=8;l.computeLineDistances();group.add(l);if(!dashed){for(let i=1;i<points.length;i++){const curve=new T.LineCurve3(new T.Vector3(...points[i-1]),new T.Vector3(...points[i]));const tube=new T.Mesh(new T.TubeGeometry(curve,1,.009,6,false),new T.MeshBasicMaterial({color,depthTest:false}));tube.renderOrder=9;group.add(tube)}}}
 // Representative rays from one distant point, simplified through two refracting structures.
 [-1,1].forEach(s=>{line([[-3.1,s*.27,.018],[-1.954,s*.27,.018],[-1.345,s*.11,.018],[-1.245,s*.084,.018],[-.753,s*.063,.018],[1.57,0,.018]],0x986020,false,paths);const arrow=new T.ArrowHelper(new T.Vector3(1,0,0),new T.Vector3(-2.9,s*.27,.018),.38,0x986020,.10,.055);paths.add(arrow)});
 line([[1.57,0,.022],[1.5,-.34,.022],[1.44,-.55,.022],[1.75,-.7,.15],[2.2,-.98,.15],[2.65,-1.16,.15]],0x74568d,true,signals);const arrow=new T.ArrowHelper(new T.Vector3(1,-.4,0).normalize(),new T.Vector3(2.35,-1.04,.15),.32,0x74568d,.10,.06);signals.add(arrow);
 function setClipping(){cutMaterials.forEach(m=>{m.clippingPlanes=view==='front'?[]:[clip];m.needsUpdate=true})}
 window.eyeQA=()=>({view,light,focus,yaw:turn,pitch,distance,pupilRadius:iris.geometry.userData.radius,lensScale:objects.lens.scale.toArray(),eyeRadius:1.65,clipped:view!=='front',pathVisible:paths.visible,fallback,threeRevision:T.REVISION});
 window.eyeClip=setClipping;setClipping();
}
function update(){
 $$('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===view)));
 $$('[data-light]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.light===light)));
 $('#light-status').textContent={dim:'Dim: radial iris muscles contract; circular muscles relax. The pupil widens.',normal:'Normal light: a medium pupil opening. Iris muscles control the pupil.',bright:'Bright: circular iris muscles contract; radial muscles relax. The pupil narrows.'}[light];
 $('#view-caption').textContent=view==='front'?'Exterior · looking directly at the front':view==='path'?'Schematic paths · side view locked for clarity':'Cutaway · front at left · rear at right';
 $('#legend').hidden=view!=='path'||fallback;$('#labels').setAttribute('aria-pressed',String(labels));$('#labels').textContent='Labels: '+(labels?'on':'off');
 $$('#left,#right,#up,#down,#zoom-in,#zoom-out').forEach(b=>b.disabled=view==='path'||fallback);$$('[data-focus]').forEach(b=>{b.disabled=view==='path'||fallback;b.setAttribute('aria-pressed',String(b.dataset.focus===focus))});$('#focus-status').textContent=focus==='near'?'Near focus: ciliary muscle contracts → ligaments slacken → lens thickens.':focus==='far'?'Distant focus: ciliary muscle relaxes → ligaments tighten → lens flattens.':'Lens shape is controlled by the ciliary muscle and suspensory ligaments.';
 if(iris){iris.geometry.dispose();iris.geometry=irisGeometry({dim:.46,normal:.30,bright:.16}[light]);paths.visible=signals.visible=view==='path';objects.retina.material.color.setHex(view==='front'?0x0b1317:0xdb8963);objects.lens.material.opacity=view==='front'?.06:.86;objects.cornea.material.opacity=view==='front'?.14:.42;window.eyeClip()}
 draw();
}
function draw(){if(!renderer||fallback)return;const w=stage.clientWidth,h=stage.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;const d=w<650?distance*1.4:distance;camera.position.set(d*Math.sin(turn)*Math.cos(pitch),d*Math.sin(pitch),d*Math.cos(turn)*Math.cos(pitch));canvas.dataset.orientation=turn.toFixed(2)+','+pitch.toFixed(2);canvas.dataset.focus=focus;camera.lookAt(0,0,0);camera.updateProjectionMatrix();renderer.render(scene,camera);leaders.setAttribute('viewBox',`0 0 ${w} ${h}`);leaders.innerHTML='';
 parts.forEach(p=>{const b=$(`[data-part="${p.id}"]`);const visible=labels&&(view!=='front'||['cornea','iris','pupil'].includes(p.id));b.hidden=!visible;if(!visible)return;const left=p.side===0?14:w-b.offsetWidth-14,top=22+p.row*(h-120)/3;b.style.left=p.side===0?'14px':'auto';b.style.right=p.side===1?'14px':'auto';b.style.top=top+'px';let xyz=p.pos;if(view==='front')xyz=p.id==='iris'?[-1.35,.65,0]:p.id==='cornea'?[-1.63,.85,0]:[-1.36,0,0];const v=new THREE.Vector3(...xyz).project(camera),x=(v.x+1)*w/2,y=(1-v.y)*h/2,ax=p.side===0?14+b.offsetWidth:w-14-b.offsetWidth,ay=top+b.offsetHeight/2;const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d',`M${ax},${ay} L${ax+(p.side===0?16:-16)},${ay} L${x},${y}`);const dot=document.createElementNS('http://www.w3.org/2000/svg','circle');dot.setAttribute('cx',x);dot.setAttribute('cy',y);dot.setAttribute('r',3);leaders.append(path,dot)});
}
$$('[data-view]').forEach(b=>b.addEventListener('click',()=>{view=b.dataset.view;turn=view==='front'?-Math.PI/2:0;pitch=0;if(view==='path'){focus='rest';buildFocus()}update()}));$$('[data-light]').forEach(b=>b.addEventListener('click',()=>{light=b.dataset.light;update();$('#part-title').textContent='Pupil response';$('#part-description').textContent=$('#light-status').textContent}));$('#labels').onclick=()=>{labels=!labels;update()};$('#fallback').onclick=()=>staticView(!fallback);function rotate(dx,dy){if(view==='path'||fallback)return;turn+=dx;pitch=Math.max(-1.35,Math.min(1.35,pitch+dy));draw()}
$('#left').onclick=()=>rotate(-.35,0);$('#right').onclick=()=>rotate(.35,0);$('#up').onclick=()=>rotate(0,.25);$('#down').onclick=()=>rotate(0,-.25);
$('#zoom-in').onclick=()=>{distance=Math.max(4.8,distance-.5);draw()};$('#zoom-out').onclick=()=>{distance=Math.min(11,distance+.5);draw()};
$('#reset').onclick=()=>{turn=view==='front'?-Math.PI/2:0;pitch=0;distance=6.8;update()};
$$('[data-focus]').forEach(b=>b.onclick=()=>{focus=b.dataset.focus;buildFocus();update();$('#part-title').textContent='Lens focus';$('#part-description').textContent=$('#focus-status').textContent});
let drag=null;canvas.addEventListener('pointerdown',e=>{if(view==='path'||fallback)return;canvas.focus();drag={x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId)});
canvas.addEventListener('pointermove',e=>{if(!drag)return;rotate(-(e.clientX-drag.x)*.009,(e.clientY-drag.y)*.009);drag={x:e.clientX,y:e.clientY}});
canvas.addEventListener('pointerup',()=>drag=null);canvas.addEventListener('pointercancel',()=>drag=null);
canvas.addEventListener('wheel',e=>{if(view==='path'||fallback)return;e.preventDefault();distance=Math.max(4.8,Math.min(11,distance+e.deltaY*.008));draw()},{passive:false});
canvas.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','-'].includes(e.key)){e.preventDefault();e.stopPropagation();if(e.key==='ArrowLeft')rotate(-.25,0);if(e.key==='ArrowRight')rotate(.25,0);if(e.key==='ArrowUp')rotate(0,.2);if(e.key==='ArrowDown')rotate(0,-.2);if(e.key==='+')$('#zoom-in').click();if(e.key==='-')$('#zoom-out').click()}});
window.addEventListener('resize',draw);
try{init();update();if(new URLSearchParams(location.search).has('static'))staticView(true)}catch(e){staticView(true);$('#fallback').disabled=true;$('#fallback').textContent='Static view available';$('#part-description').textContent='The 3D view is unavailable here. Use this section and the structure list to trace the route of light.'}
})();
