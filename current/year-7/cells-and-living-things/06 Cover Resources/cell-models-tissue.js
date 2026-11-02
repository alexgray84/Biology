/* Original skeletal muscle fibre and single intestinal epithelial-cell cutaways. */
(() => {
  'use strict';
  const U = window.COVER_CELL_UTILS, B = window.COVER_CELL_BUILDERS;
  B.muscle = (T, stateIndex = 0) => {
    const object = new T.Group(), contracted = stateIndex === 1;
    const stretchX = contracted ? .75 : 1, stretchR = contracted ? Math.sqrt(1 / .75) : 1;
    const fibre = new T.Group(); object.add(fibre); fibre.scale.set(stretchX, stretchR, stretchR);
    const length = 5.10, radius=.48, positions=[], colours=[], indices=[], nx=180,np=48;
    const light=new T.Color('#c78e80'), dark=new T.Color('#ae6d67');
    for(let i=0;i<=nx;i++) {
      const x=-length/2+i/nx*length, phase=(i/nx*26)%1;
      const stripe=phase<.18?.46:phase<.27?.20:.025;
      for(let j=0;j<=np;j++) {
        const p=1.04+j/np*(Math.PI*2-2.08), r=radius*(1+.009*Math.sin(x*12+p*6));
        positions.push(x,r*Math.sin(p),r*Math.cos(p));
        const c=light.clone().lerp(dark,stripe);colours.push(c.r,c.g,c.b);
        if(i<nx&&j<np){const q=i*(np+1)+j,k=q+np+1;indices.push(q,k,q+1,q+1,k,k+1);}
      }
    }
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setAttribute('color',new T.Float32BufferAttribute(colours,3));g.setIndex(indices);g.computeVertexNormals();
    U.mesh(T,g,U.material(T,'#ecd3cc',{vertexColors:true,side:T.DoubleSide,roughness:.66}),fibre);
    const edge=U.material(T,'#b87970',{roughness:.72});
    // The anterior sector has been removed, exposing longitudinal myofibrils.
    [1.04,Math.PI*2-1.04].forEach(p=>U.tube(T,fibre,edge,[[-length/2,radius*Math.sin(p),radius*Math.cos(p)],[0,radius*Math.sin(p),radius*Math.cos(p)],[length/2,radius*Math.sin(p),radius*Math.cos(p)]],.014,.014,36,6));
    const fibrils=[], fibreMat=U.material(T,'#c58a7a',{roughness:.68});
    const cross=[[-.27,-.10],[-.11,-.22],[.08,-.23],[.25,-.10],[-.21,.06],[-.05,-.03],[.11,.01],[.25,.08],[-.08,.17],[.09,.18]];
    cross.forEach(([y,z],j)=>{
      const fg=new T.CylinderGeometry(.072,.073,length-.04,10,65,false);fg.rotateZ(Math.PI/2);fg.translate(0,y,z);fibrils.push(fg);
    });
    U.mesh(T,U.merge(T,fibrils),fibreMat,fibre);
    // Narrow aligned bands continue across the exposed fibrils, as in striated muscle.
    const bands=[];
    for(let i=0;i<25;i++) {
      const x=-2.4+i*.196;
      cross.forEach(([y,z])=>{
        const band=new T.CylinderGeometry(.074,.074,.018,10,1,false);band.rotateZ(Math.PI/2);band.translate(x,y,z);bands.push(band);
      });
    }
    U.mesh(T,U.merge(T,bands),U.material(T,'#a96d66',{roughness:.75}),fibre);
    const mt=[];
    for(let i=0;i<8;i++) mt.push({position:[-2.12+i*.58,(i%2?.31:-.29),.27],angle:i%2?.06:-.08,size:.8+(i%3)*.12});
    U.mitochondria(T,fibre,mt,.68);
    // Skeletal muscle fibres contain several nuclei at their periphery.
    const nmat=U.material(T,'#775e7c',{roughness:.72});
    [[-1.86,.34,.14],[.42,-.35,.13],[1.86,.33,.15]].forEach(p=>U.ellipsoid(T,fibre,nmat,p,[.24,.09,.07],.035));
    // Circular end faces make the cylindrical fibre clear without introducing branches.
    const capMat=U.material(T,'#bb8176',{roughness:.8,side:T.DoubleSide});
    [-1,1].forEach(sign=>{
      const cap=new T.CircleGeometry(radius,48);cap.rotateY(sign*Math.PI/2);cap.translate(sign*length/2,0,0);U.mesh(T,cap,capMat,fibre);
    });
    const label=(text,p,side)=>U.label(T,text,[p[0]*stretchX,p[1]*stretchR,p[2]*stretchR],side);
    return {object,states:['Relaxed','Contracted'],labels:[label('Mitochondria in cutaway',[-.97,-.29,.34],'left'),label('Fine transverse striations',[1.33,.39,-.18],'right'),label('Several peripheral nuclei',[.42,-.35,.18],'right')],
      caption:contracted?'The same skeletal muscle fibre shown shorter and thicker during contraction. A removed section of membrane reveals many mitochondria and parallel myofibrils; several nuclei lie at the edge. Contraction is illustrative, not to scale.':'One long, unbranched skeletal muscle fibre. A removed section of membrane reveals many mitochondria and parallel myofibrils; several nuclei lie at the edge. Striations are simplified. Original 3D teaching model, not to scale.',
      camera:{position:[0,.55,8.3],target:[0,0,0]},viewRadius:2.95};
  };

  B.intestine = T => {
    const object=new T.Group(), membrane=U.material(T,'#d5b398',{roughness:.72,side:T.DoubleSide});
    const positions=[],indices=[],rows=48,around=64;
    // Columnar, gently tapered outline. The anterior membrane is cut away.
    for(let i=0;i<=rows;i++) {
      const y=-1.22+i/rows*2.52, t=i/rows, width=.59+.13*t+.025*Math.sin(t*Math.PI);
      for(let j=0;j<=around;j++) {
        const p=.95+j/around*(Math.PI*2-1.9), c=Math.cos(p),s=Math.sin(p);
        const x=Math.sign(s)*Math.pow(Math.abs(s),.46)*width;
        const z=Math.sign(c)*Math.pow(Math.abs(c),.46)*(.44+.045*t);
        positions.push(x,y,z);
        if(i<rows&&j<around){const q=i*(around+1)+j,k=q+around+1;indices.push(q,q+1,k,q+1,k+1,k);}
      }
    }
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setIndex(indices);g.computeVertexNormals();U.mesh(T,g,membrane,object);
    // Pale back of the exposed cytoplasm, inset behind all revealed organelles.
    U.ellipsoid(T,object,U.material(T,'#d9bea8',{roughness:.86}),[0,.02,-.31],[.59,1.25,.13],.012);
    const apical=new T.BoxGeometry(1.43,.105,.92,5,1,4);apical.translate(0,1.26,0);U.mesh(T,apical,membrane,object);
    const basal=new T.SphereGeometry(1,40,16);basal.scale(.59,.12,.44);basal.translate(0,-1.20,0);U.mesh(T,basal,membrane,object);
    // Many short, densely packed projections form one cell's brush border.
    const rnd=U.random(234), microvilli=[];
    for(let ix=0;ix<15;ix++)for(let iz=0;iz<10;iz++) {
      const x=-.665+ix*.095+(rnd()-.5)*.018,z=-.405+iz*.09+(rnd()-.5)*.013;
      const h=.245+rnd()*.075;
      microvilli.push({position:[x,1.325+h/2,z],scale:[.023,h/.24,.023],rotation:[(rnd()-.5)*.1,0,(rnd()-.5)*.1]});
    }
    U.instances(T,new T.CapsuleGeometry(1,8.6,3,7),U.material(T,'#d0a17f',{roughness:.69}),microvilli.map(e=>({...e,scale:[e.scale[0],(e.scale[1]*.24)/10.6,e.scale[2]]})),object);
    const nuclear=U.material(T,'#89758e',{roughness:.70});
    U.ellipsoid(T,object,nuclear,[0,-.56,.06],[.32,.40,.235],.025);
    U.ellipsoid(T,object,U.material(T,'#68516f',{roughness:.72}),[.06,-.53,.275],[.075,.083,.036],.025);
    U.mitochondria(T,object,[
      {position:[-.36,-.18,.16],angle:1.1,size:.92},{position:[.36,-.15,.16],angle:1.3,size:.95},
      {position:[-.32,.48,.17],angle:.95,size:.88},{position:[.34,.64,.18],angle:1.2,size:.93},
      {position:[-.28,-.94,.15],angle:.35,size:.84},{position:[.29,-.93,.15],angle:2.0,size:.8},
      {position:[-.06,.82,.16],angle:.25,size:.82},{position:[.03,.25,.16],angle:-.2,size:.85}
    ],.73);
    const granules=[],random=U.random(8);
    for(let i=0;i<65;i++){
      const x=(random()-.5)*1.0,y=-1.0+random()*2.13;
      if(Math.abs(x)<.35&&y<-.10&&y>-.99)continue;
      const s=.012+random()*.008;granules.push({position:[x,y,.02+random()*.05],scale:[s,s,s]});
    }
    U.instances(T,new T.SphereGeometry(1,7,5),U.material(T,'#b39c88',{roughness:.85}),granules,object);
    return {object,labels:[U.label(T,'Dense, short microvilli',[.33,1.58,.26],'right'),U.label(T,'Nucleus',[0,-.56,.29],'left'),U.label(T,'Mitochondria',[.35,.62,.24],'right')],
      caption:'One intestinal lining cell, with its front membrane cut away to reveal the nucleus and mitochondria. Dense short microvilli on its food-facing surface increase area for absorption. These belong to one cell; this is not a whole villus. Original model, not to scale.',
      camera:{position:[0,.16,7.35],target:[0,.15,0]},viewRadius:2.0};
  };
})();
