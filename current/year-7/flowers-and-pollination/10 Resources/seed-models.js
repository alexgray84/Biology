/* Original teaching geometry. Qualitative structures, never measured flight data. */
(function () {
  'use strict';
  var params = new URLSearchParams(location.search), kind = params.get('specimen') || 'burr';
  var view = params.get('view') || 'observe', isTask = view === 'task';
  var stage = document.getElementById('model-stage'), canvas = document.getElementById('model-canvas');
  var labelsBox = document.getElementById('labels'), lines = document.getElementById('label-lines');
  var status = document.getElementById('model-status'), root, scene, camera, renderer, baseY = 0, yaw = 0;
  var labelSpecs = [], labelNodes = [], hooks, podHalves = [], changed = false, active = true;
  var T = window.THREE, V;
  var titles = {flower:'Inside a flower',wing:'A winged fruit',burr:'A hooked fruit',fruit:'Inside a fleshy fruit',water:'A fruit cut open',waterFresh:'Fruit X: cut open',pod:'Seeds inside a fruit'};
  if (!titles[kind]) kind = 'burr';
  document.body.dataset.specimen=kind;
  document.getElementById('model-title').textContent = titles[kind];
  function fallback(error) {
    active=false;canvas.hidden = true;
    var box = document.getElementById('fallback'), img = document.getElementById('fallback-image');
    var data=window.StaticSpecimens||{},current;
    function drawStatic(){
      if(!current)return;
      var w=stage.clientWidth,h=stage.clientHeight,ir=img.getBoundingClientRect(),sr=stage.getBoundingClientRect();
      var scale=Math.min(ir.width/current.width,ir.height/current.height),iw=current.width*scale,ih=current.height*scale;
      var left=ir.left-sr.left+(ir.width-iw)/2,top=ir.top-sr.top+(ir.height-ih)/2;
      lines.setAttribute('viewBox','0 0 '+w+' '+h);
      labelNodes.forEach(function(n){
        var r=n.el.getBoundingClientRect(),x=n.spec.side==='L'?r.right-sr.left:r.left-sr.left,y=n.spec.slot*h;
        var px=left+n.spec.x*iw,py=top+n.spec.y*ih;
        n.line.setAttribute('x1',px);n.line.setAttribute('y1',py);n.line.setAttribute('x2',x);n.line.setAttribute('y2',y);
        n.dot.setAttribute('cx',px);n.dot.setAttribute('cy',py);
      });
    }
    function showStatic(key){
      current=data[key];
      if(!current)return;
      img.hidden=false;img.alt=current.alt;img.onload=drawStatic;img.src=current.src;
      labelSpecs=current.labels;buildLabels();labelsBox.hidden=false;lines.hidden=false;
      labelsBox.style.zIndex='3';lines.style.zIndex='2';box.style.zIndex='1';
      drawStatic();if(document.fonts)document.fonts.ready.then(drawStatic);
    }
    showStatic(kind+(changed?(kind==='burr'?'-no-hooks':kind==='pod'?'-open':''):''));
    document.getElementById('fallback-text').textContent='A still picture of the same plant part.';
    box.hidden = false; document.querySelectorAll('.model-controls button').forEach(function(b){ b.disabled = true; });
    ['rotate-left','rotate-right','reset-view'].forEach(function(id){document.getElementById(id).hidden=true;});
    var pred=document.getElementById('prediction'),change=document.getElementById('change-feature'),op=document.getElementById('open-pod');
    if(kind==='burr'&&params.get('test')==='hooks'){
      pred.hidden=false;pred.disabled=false;change.hidden=false;change.disabled=true;
      pred.onclick=function(){change.disabled=false;pred.setAttribute('aria-pressed','true');status.textContent='Remove the hooks. Compare the fruit with your prediction.';};
      change.onclick=function(){changed=!changed;showStatic(changed?'burr-no-hooks':'burr');change.textContent=changed?'Restore hooks':'Remove hooks';change.setAttribute('aria-pressed',String(changed));status.textContent=changed?'Hooks removed. How might this change movement? What can this picture not tell you?':'Hooks restored. Compare the fruit with your prediction.';};
    }
    if(kind==='pod'){
      op.hidden=false;op.disabled=false;op.onclick=function(){changed=!changed;showStatic(changed?'pod-open':'pod');op.textContent=changed?'Close fruit':'Open fruit';op.setAttribute('aria-pressed',String(changed));status.textContent='Compare the fruit wall and seeds. The pictures do not show how far seeds travel.';};
    }
    new ResizeObserver(drawStatic).observe(stage);window.renderModel=drawStatic;
    status.textContent = 'Use this still picture to answer in your book.';
    window.ModelReady = {kind:kind, fallback:true, reason:String(error && error.message || error)};
  }
  if (!T) { fallback('Three.js unavailable'); return; }
  V = T.Vector3;
  function mat(c, extra) { return new T.MeshStandardMaterial(Object.assign({color:c,roughness:.7,metalness:0,side:T.DoubleSide},extra || {})); }
  function mesh(g,m,p,s) { var o=new T.Mesh(g,m); if(p)o.position.set.apply(o.position,p);if(s)o.scale.set.apply(o.scale,s);o.castShadow=true;o.receiveShadow=true;return o; }
  function ellipsoid(c,p,s,extra) { return mesh(new T.SphereGeometry(1,48,32),mat(c,extra),p,s); }
  function tube(points,r,c) { return mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points.map(function(p){return new V(p[0],p[1],p[2]);})),40,r,8,false),mat(c)); }
  function mark(name,point,side,slot,letter) { labelSpecs.push({name:name,point:new V(point[0],point[1],point[2]),side:side,slot:slot,letter:letter}); }
  function berry() {
    var g=new T.Group(), cut=new T.Plane(new V(0,0,-1),0);
    g.add(ellipsoid('#a63a29',[0,0,0],[1.5,1.65,1.18],{roughness:.34,clippingPlanes:[cut]}));
    var tissue=mesh(new T.CircleGeometry(1,80),mat('#df9670'),[0,0,.012],[1.48,1.63,1]);g.add(tissue);
    var rim=mesh(new T.RingGeometry(.96,1,80),mat('#9d392c'),[0,0,.028],[1.5,1.65,1]);g.add(rim);
    [[-.65,-.3,.12],[.6,-.35,.12],[.36,.55,.12],[-.4,.62,.12]].forEach(function(p,i){
      var s=ellipsoid('#55331c',p,[.22,.32,.13],{roughness:.35});s.rotation.z=(i-1.5)*.35;g.add(s);
      g.add(ellipsoid('#f1c79b',[p[0]-.04,p[1]+.04,p[2]+.11],[.045,.1,.02]));
    });
    g.add(tube([[0,1.5,-.1],[.1,1.9,-.1],[.4,2,-.05]],.08,'#597440'));
    mark('Fleshy fruit wall',[-1.03,.5,.02],'L',.3);mark('Seeds inside',[.6,-.35,.25],'R',.67);
    return g;
  }
  function hooked() {
    var g=new T.Group();g.add(ellipsoid('#987446',[0,0,0],[1,1.28,.88],{roughness:.95}));
    for(var j=0;j<11;j++){
      var q=j/10*Math.PI*2;g.add(tube([[-.8*Math.cos(q),-.7,.65*Math.sin(q)],[-1.0*Math.cos(q),0,.87*Math.sin(q)],[-.5*Math.cos(q),1,.5*Math.sin(q)]],.018,'#695333'));
    }
    hooks=new T.Group();g.add(hooks);
    for(var i=0;i<76;i++){
      var y=1-2*(i+.5)/76, r=Math.sqrt(1-y*y), a=i*2.3999632297;
      var normal=new V(r*Math.cos(a),y,r*Math.sin(a));
      var start=new V(normal.x*.99,normal.y*1.27,normal.z*.88);
      var tangent=new V(-normal.z,.15,normal.x).normalize();
      var p0=start, p1=start.clone().addScaledVector(normal,.30),p2=start.clone().addScaledVector(normal,.52).addScaledVector(tangent,.10);
      var p3=start.clone().addScaledVector(normal,.47).addScaledVector(tangent,.27),p4=start.clone().addScaledVector(normal,.30).addScaledVector(tangent,.30);
      var h=mesh(new T.TubeGeometry(new T.CatmullRomCurve3([p0,p1,p2,p3,p4]),18,.022,5,false),mat(i%3 ? '#b3945a' : '#745429'));hooks.add(h);
    }
    mark('Curved hooks',[-1.24,.6,.55],'L',.3);mark('Fruit around seeds',[.65,-.4,.68],'R',.7);
    return g;
  }
  function winged() {
    var g=new T.Group(), shape=new T.Shape();
    shape.moveTo(-1.1,-.45);shape.bezierCurveTo(-.5,.18,.8,1.58,2.75,1.34);
    shape.bezierCurveTo(3.1,1.25,2.8,.56,2.14,.16);shape.bezierCurveTo(.95,-.64,-.35,-.9,-1.1,-.45);
    var wing=mesh(new T.ExtrudeGeometry(shape,{depth:.035,bevelEnabled:true,bevelThickness:.018,bevelSize:.022,bevelSegments:2,steps:1}),mat('#c3a16d',{roughness:.86,transparent:true,opacity:.92}));
    g.add(wing);g.add(ellipsoid('#805630',[-.89,-.52,.08],[.5,.57,.28],{roughness:.72}));
    for(var i=0;i<8;i++){var t=i/7;g.add(tube([[-.65,-.4,.07],[.4,.02+t*.58,.075],[1.5,.18+t*.88,.075],[2.5,.63+t*.5,.075]],.012,'#96784a'));}
    g.rotation.z=-.17;
    mark('Thin wing',[1.7,.65,.08],'R',.27);mark('Fruit containing a seed',[-.88,-.52,.3],'L',.73);
    return g;
  }
  function buoyant() {
    var g=new T.Group(), cut=new T.Plane(new V(0,0,-1),0);
    g.add(ellipsoid('#92633d',[0,0,0],[1.55,1.8,1.1],{clippingPlanes:[cut],roughness:.93}));
    g.add(mesh(new T.CircleGeometry(1,80),mat('#e3cf9d'),[0,0,.015],[1.48,1.73,1]));
    g.add(mesh(new T.RingGeometry(.91,1,80),mat('#825332'),[0,0,.028],[1.55,1.8,1]));
    for(var i=0;i<19;i++){
      var a=i/19*Math.PI*2,r=1.12+(i%3)*.05;
      var hole=ellipsoid('#b69b68',[Math.cos(a)*r,Math.sin(a)*r*1.12,.04],[.11,.17,.025]);hole.rotation.z=a;g.add(hole);
      var air=ellipsoid('#fbf7e8',[Math.cos(a)*r,Math.sin(a)*r*1.12,.065],[.073,.132,.023]);air.rotation.z=a;g.add(air);
    }
    g.add(ellipsoid('#b87947',[0,-.03,.08],[.66,.96,.16]));
    g.add(ellipsoid('#deb87d',[-.05,.02,.20],[.53,.82,.075]));
    mark('Air-filled tissue',[-.98,1.02,.08],'L',.22);mark('Outer coat',[1.47,.5,.03],'R',.37);mark('Seed',[.36,-.27,.29],'R',.73);
    return g;
  }
  function pod() {
    var g=new T.Group(), shape=new T.Shape();
    shape.moveTo(-2.15,0);shape.bezierCurveTo(-1.5,.72,1.45,.72,2.15,0);shape.bezierCurveTo(1.4,-.64,-1.5,-.64,-2.15,0);
    [-1,1].forEach(function(side){
      var h=new T.Group(), wall=mesh(new T.ExtrudeGeometry(shape,{depth:.10,bevelEnabled:true,bevelThickness:.05,bevelSize:.04,bevelSegments:3}),mat('#6f8742'));
      h.add(wall);h.add(mesh(new T.ShapeGeometry(shape),mat('#c2c88b'),[0,0,.14]));
      h.userData.side=side;h.position.z=side*.09;h.rotation.x=side===1 ? Math.PI : 0;podHalves.push(h);g.add(h);
    });
    for(var i=0;i<6;i++){g.add(ellipsoid('#758c45',[-1.48+i*.59,0,0],[.27,.29,.27],{roughness:.47}));}
    g.add(tube([[-2.13,0,0],[-2.48,.1,0],[-2.65,.4,0]],.07,'#60753a'));
    mark('Fruit wall',[-1,.4,.25],'L',.26);mark('Seeds',[.86,0,.1],'R',.73);
    return g;
  }
  function freshFruit() {
    var g=new T.Group(), outline=new T.Shape();
    outline.moveTo(-2.3,-.25);outline.bezierCurveTo(-2.2,.72,-.72,1.27,1.25,.88);
    outline.bezierCurveTo(2.08,.72,2.48,.16,2.2,-.44);outline.bezierCurveTo(1.7,-1.12,-.4,-1.07,-2.3,-.25);
    g.add(mesh(new T.ExtrudeGeometry(outline,{depth:.3,bevelEnabled:true,bevelThickness:.055,bevelSize:.055,bevelSegments:3}),mat('#946b39')));
    var tissue=mesh(new T.ShapeGeometry(outline),mat('#ead6a6'),[0,0,.37],[.94,.89,1]);g.add(tissue);
    [[-1.4,.2,.43],[-.55,.52,.43],[.4,.56,.43],[1.25,.36,.43]].forEach(function(p,i){
      g.add(ellipsoid('#b69b68',p,[.34,.25,.05]));g.add(ellipsoid('#fff8e7',[p[0],p[1],.48],[.28,.20,.035]));
    });
    var seed=ellipsoid('#a46537',[.12,-.39,.46],[.72,.34,.11]);seed.rotation.z=-.12;g.add(seed);
    var end=ellipsoid('#dcac6b',[.10,-.37,.565],[.56,.23,.035]);end.rotation.z=-.12;g.add(end);
    mark('Air-filled tissue',[-.55,.52,.51],'L',.23);mark('Outer coat',[2.22,.02,.33],'R',.42);mark('Seed',[.34,-.38,.60],'R',.77);
    return g;
  }
  function buildLabels(){
    labelsBox.replaceChildren();lines.replaceChildren();labelNodes=[];
    labelSpecs.forEach(function(s,i){
      var el=document.createElement('span'), showLetter=kind==='flower' && view!=='review';
      el.className='part-label '+(s.side==='L'?'left':'right')+(showLetter?' letter':'');
      el.textContent=showLetter ? s.letter : s.name;el.style.top=(s.slot*100)+'%';labelsBox.appendChild(el);
      var line=document.createElementNS('http://www.w3.org/2000/svg','line'),dot=document.createElementNS('http://www.w3.org/2000/svg','circle');dot.setAttribute('r','3');
      lines.appendChild(line);lines.appendChild(dot);labelNodes.push({spec:s,el:el,line:line,dot:dot});
    });
  }
  function render(){
    if(!renderer || !active)return;
    var w=stage.clientWidth,h=stage.clientHeight;if(w<2||h<2)return;
    var aspect=w/h,half=kind==='flower' ? Math.max(3.65,4.8/aspect) : Math.max(2.65,3.55/aspect);
    camera.left=-half*aspect;camera.right=half*aspect;camera.top=half+baseY;camera.bottom=-half+baseY;
    camera.updateProjectionMatrix();renderer.setSize(w,h,false);root.rotation.y=yaw;root.updateMatrixWorld(true);scene.updateMatrixWorld(true);
    renderer.render(scene,camera);lines.setAttribute('viewBox','0 0 '+w+' '+h);
    labelNodes.forEach(function(n){
      var show=!(kind==='pod' && n.spec.name==='Seeds' && !changed)&&!(kind==='burr'&&n.spec.name==='Curved hooks'&&changed);
      [n.el,n.line,n.dot].forEach(function(o){o.style.display=show?'':'none';});
      if(!show)return;
      var p=root.localToWorld(n.spec.point.clone()).project(camera);
      var px=(p.x*.5+.5)*w,py=(-p.y*.5+.5)*h, rect=n.el.getBoundingClientRect(),sr=stage.getBoundingClientRect();
      var x=n.spec.side==='L'?rect.right-sr.left:rect.left-sr.left,y=n.spec.slot*h;
      n.line.setAttribute('x1',px);n.line.setAttribute('y1',py);n.line.setAttribute('x2',x);n.line.setAttribute('y2',y);
      n.dot.setAttribute('cx',px);n.dot.setAttribute('cy',py);
    });
  }
  try {
    renderer=new T.WebGLRenderer({canvas:canvas,antialias:true,alpha:false,preserveDrawingBuffer:true});
    renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.7));renderer.outputColorSpace=T.SRGBColorSpace;
    renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;renderer.localClippingEnabled=true;
    scene=new T.Scene();scene.background=new T.Color('#fcfaf5');
    camera=new T.OrthographicCamera(-5,5,4,-4,.1,100);camera.position.set(.55,.55,18);camera.lookAt(0,.5,0);
    root=new T.Group();scene.add(root);
    if(kind==='flower'){
      var flower=window.FlowerGeometry();flower.scene.children.slice().forEach(function(o){if(!o.isLight)root.add(o);});
      baseY=.72;
      [['A','petal','Petal','L',.39],['B','sepal','Sepal','L',.79],['C','anther','Anther','L',.17],['D','filament','Filament','L',.60],['E','stigma','Stigma','R',.12],['F','style','Style','R',.32],['G','ovary','Ovary','R',.62],['H','ovule','Ovule','R',.83]].forEach(function(a){mark(a[2],flower.anchors[a[1]].toArray(),a[3],a[4],a[0]);});
    } else {root.add(({wing:winged,burr:hooked,fruit:berry,water:buoyant,waterFresh:freshFruit,pod:pod})[kind]());}
    scene.add(new T.HemisphereLight('#fff7e6','#b7b3a4',2.15));
    var key=new T.DirectionalLight('#fff3dc',3.6);key.position.set(-4,6,9);scene.add(key);
    var fill=new T.DirectionalLight('#dce8ff',1.25);fill.position.set(6,1,4);scene.add(fill);
    buildLabels();new ResizeObserver(render).observe(stage);
    canvas.addEventListener('webglcontextlost',function(e){e.preventDefault();fallback('Graphics context unavailable');});
    document.getElementById('rotate-left').onclick=function(){yaw=Math.max(-.7,yaw-.14);render();};
    document.getElementById('rotate-right').onclick=function(){yaw=Math.min(.7,yaw+.14);render();};
    document.getElementById('reset-view').onclick=function(){yaw=0;render();status.textContent='You are back at the starting view.';};
    var pred=document.getElementById('prediction'),change=document.getElementById('change-feature'),op=document.getElementById('open-pod');
    if(kind==='burr' && params.get('test')==='hooks'){
      pred.hidden=false;change.hidden=false;status.textContent='Predict in your book: how might removing the hooks affect movement?';
      pred.onclick=function(){change.disabled=false;pred.setAttribute('aria-pressed','true');status.textContent='Remove the hooks. Compare the fruit with your prediction.';};
      change.onclick=function(){changed=!changed;hooks.visible=!changed;change.textContent=changed?'Restore hooks':'Remove hooks';change.setAttribute('aria-pressed',String(changed));status.textContent=changed?'Hooks removed. How might this change movement? What can this model not tell you?':'Hooks restored. Compare the fruit with your prediction.';render();};
    }
    if(kind==='pod'){
      op.hidden=false;
      op.onclick=function(){changed=!changed;podHalves.forEach(function(o){var s=o.userData.side;o.position.y=changed?s*.65:0;o.position.z=changed?s*.4:s*.09;o.rotation.x=(s===1?Math.PI:0)+(changed?s*.45:0);});op.textContent=changed?'Close fruit':'Open fruit';op.setAttribute('aria-pressed',String(changed));status.textContent=changed?'Look at the fruit wall and seeds. This model does not show how far seeds travel.':'Fruit closed. Predict what happens when the ripe fruit wall splits.';render();};
    }
    if(kind==='water'||kind==='waterFresh')status.textContent='Use the labelled parts to explain how the fruit might move.';
    if(kind==='flower')status.textContent=view==='review'?'Match each name to its part. Check your corrections.':'Write the names for A–H in your book. Mark any you are unsure about.';
    render();if(document.fonts)document.fonts.ready.then(render);
    window.ModelReady={kind:kind,fallback:false,view:view,labels:labelNodes.map(function(n){return n.el.textContent;})};
    window.renderModel=render;
    window.ModelSnapshot=function(){return {width:stage.clientWidth,height:stage.clientHeight,labels:labelNodes.filter(function(n){return getComputedStyle(n.el).display!=='none';}).map(function(n){return {name:n.spec.name,side:n.spec.side,slot:n.spec.slot,letter:n.spec.letter,x:Number(n.line.getAttribute('x1'))/stage.clientWidth,y:Number(n.line.getAttribute('y1'))/stage.clientHeight};})};};
    document.addEventListener('visibilitychange',function(){active=!document.hidden;if(active)render();});
  } catch(e) {fallback(e);}
})();
