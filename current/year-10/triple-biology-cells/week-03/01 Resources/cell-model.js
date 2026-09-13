/* Local Three.js cutaway. No autoplay, remote calls or response storage. */
window.CellModel = (() => {
  function mount(host, state) {
    if (!window.THREE) return null;
    const T=window.THREE;
    let renderer;
    try { renderer=new T.WebGLRenderer({antialias:true,alpha:true}); } catch (_) { return null; }
    const scene=new T.Scene(), camera=new T.PerspectiveCamera(35,1,.1,100);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
    renderer.outputColorSpace=T.SRGBColorSpace;
    host.appendChild(renderer.domElement); host.classList.add('is-live');
    renderer.domElement.tabIndex=0;
    renderer.domElement.setAttribute('role','img');
    renderer.domElement.setAttribute('aria-label','Rotatable cutaway animal cell. Purple nucleus, blue membrane, rose ribosomes and orange mitochondria. Drag or use arrow keys to rotate.');
    scene.add(new T.HemisphereLight(0xffffff,0xb4b1a4,2.6));
    const light=new T.DirectionalLight(0xffffff,3); light.position.set(3,5,6); scene.add(light);
    const group=new T.Group(); scene.add(group);
    camera.position.set(0,.3,8); camera.lookAt(0,0,0);
    const tracked=[];
    function mesh(geometry,color,name,position,scale) {
      const material=new T.MeshStandardMaterial({color,roughness:.47,metalness:.04});
      const obj=new T.Mesh(geometry,material); obj.position.set(...position);
      if(scale)obj.scale.set(...scale); group.add(obj); tracked.push({obj,name,color}); return obj;
    }
    // An open, translucent membrane lets the organelles remain visible.
    const shell=mesh(new T.SphereGeometry(2.1,56,36,Math.PI*.15,Math.PI*1.45),0x8db4bd,'membrane',[0,0,0],[1.18,.85,.8]);
    shell.material.transparent=true; shell.material.opacity=.25; shell.material.side=T.DoubleSide; shell.material.depthWrite=false;
    mesh(new T.SphereGeometry(.67,36,24),0xa99ac5,'nucleus',[-.55,.14,.3]);
    mesh(new T.SphereGeometry(.19,20,16),0x76668e,'nucleus',[-.4,.23,.88]);
    [[.84,.67,.48],[.97,-.71,.37],[-1.22,-.66,.35]].forEach((pos,i)=>{
      const m=mesh(new T.SphereGeometry(.34,28,20),0xd99355,'mitochondria',pos,[1.65,.7,.85]); m.rotation.z=i*.8-.4;
      const points=[];
      for(let j=0;j<9;j++) points.push(new T.Vector3(-.36+j*.085, j%2?.11:-.1,.245));
      const curve=new T.CatmullRomCurve3(points);
      const fold=new T.Mesh(new T.TubeGeometry(curve,40,.019,7,false),new T.MeshStandardMaterial({color:0x965121}));
      fold.position.copy(m.position); fold.rotation.z=m.rotation.z; group.add(fold);
    });
    [[-1.3,.55,.55],[.18,.87,.6],[.39,-.88,.6],[1.53,.18,.22],[-.91,-.31,.9],[.51,.13,.91],[-.11,-.58,.89],[-1.55,.08,.35],[.51,.55,.7]].forEach(p=>mesh(new T.SphereGeometry(.065,12,10),0xb45c70,'ribosomes',p));
    group.rotation.set(state.rx||0,state.ry||0,0);
    function draw(){renderer.render(scene,camera);}
    function resize(){const rect=host.getBoundingClientRect();if(!rect.width||!rect.height)return;renderer.setSize(rect.width,rect.height,false);camera.aspect=rect.width/rect.height;camera.updateProjectionMatrix();draw();}
    function focus(name){tracked.forEach(({obj,name:n,color})=>{obj.material.color.setHex(color);obj.material.emissive.setHex(n===name?0x302513:0);obj.material.emissiveIntensity=n===name?.3:0;});draw();}
    let last=null;
    const canvas=renderer.domElement;
    canvas.addEventListener('pointerdown',e=>{last=[e.clientX,e.clientY];canvas.setPointerCapture(e.pointerId);});
    canvas.addEventListener('pointermove',e=>{if(!last)return;group.rotation.y+=(e.clientX-last[0])*.009;group.rotation.x+=(e.clientY-last[1])*.009;state.rx=group.rotation.x;state.ry=group.rotation.y;last=[e.clientX,e.clientY];draw();});
    canvas.addEventListener('pointerup',()=>{last=null;});
    canvas.addEventListener('pointercancel',()=>{last=null;});
    canvas.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.stopPropagation();e.preventDefault();group.rotation.y+=e.key==='ArrowLeft'?-.15:e.key==='ArrowRight'?.15:0;group.rotation.x+=e.key==='ArrowUp'?-.15:e.key==='ArrowDown'?.15:0;state.rx=group.rotation.x;state.ry=group.rotation.y;draw();});
    const observer=new ResizeObserver(resize);observer.observe(host);resize();focus(state.focus||'nucleus');
    return {focus,dispose(){observer.disconnect();scene.traverse(o=>{o.geometry?.dispose();if(o.material) o.material.dispose();});renderer.dispose();canvas.remove();host.classList.remove('is-live');}};
  }
  return {mount};
})();
