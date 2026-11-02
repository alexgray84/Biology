/* Original closed erythrocyte surface, connected neuron and phagocyte cutaways. */
(() => {
  'use strict';
  const U = window.COVER_CELL_UTILS, B = window.COVER_CELL_BUILDERS;
  B.rbc = T => {
    const object = new T.Group(), vertices = [], colours = [], indices = [], rings = 64, sides = 96;
    const base = new T.Color('#ac3046'), bright = new T.Color('#d46a73');
    for (let i = 0; i <= rings; i++) {
      const a = i / rings * Math.PI, r = Math.sin(a), r2 = r * r;
      // Continuous Evans–Fung type profile: both depressions remain closed membrane.
      const z = Math.cos(a) * (0.207 + 2.003 * r2 - 1.123 * r2 * r2) * 0.62;
      for (let j = 0; j <= sides; j++) {
        const p = j / sides * Math.PI * 2;
        const ripple = 1 + 0.006 * Math.sin(p * 5) * r2 + 0.003 * Math.sin(p * 13 + a * 8);
        vertices.push(1.43 * r * Math.cos(p) * ripple, 1.43 * r * Math.sin(p) * ripple, z);
        const c = base.clone().lerp(bright, Math.max(0, 0.4 * (1 - r2) + 0.03 * Math.sin(p * 7 + a * 17)));
        colours.push(c.r, c.g, c.b);
        if (i < rings && j < sides) { const q = i * (sides + 1) + j, k = q + sides + 1; indices.push(q, k, q + 1, q + 1, k, k + 1); }
      }
    }
    const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(vertices, 3));
    g.setAttribute('color', new T.Float32BufferAttribute(colours, 3)); g.setIndex(indices); g.computeVertexNormals();
    U.mesh(T, g, U.material(T, '#f2d2d3', { vertexColors: true, roughness: 0.46 }), object);
    return { object, labels: [U.label(T, 'Thin centre, not a hole', [0, 0.1, 0.13], 'left'), U.label(T, 'Flexible cell membrane', [1.2, -0.66, 0.16], 'right'), U.label(T, 'No nucleus', [-0.65, -0.45, 0.36], 'left')],
      caption: 'Mature human red blood cell. A closed biconcave disc with a thin centre; there is no hole and no nucleus. Original 3D teaching model, not to scale.',
      camera: { position: [0, 3.3, 6.8], target: [0, 0, 0] }, viewRadius: 1.8 };
  };

  B.nerve = T => {
    const object = new T.Group(), membrane = U.material(T, '#b99daf', { roughness: 0.59 });
    const sheath = U.material(T, '#ded2ae', { roughness: 0.72 });
    const nuclear = U.material(T, '#6d517d', { roughness: 0.64 });
    U.cutawayShell(T, object, membrane, [-1.67, 0, 0], [0.56, 0.49, 0.38], 0.8, 0.032);
    U.ellipsoid(T, object, nuclear, [-1.68, -0.015, 0.07], [0.23, 0.215, 0.18], 0.04);
    U.ellipsoid(T, object, U.material(T, '#92729d'), [-1.72, 0.035, 0.221], [0.06, 0.065, 0.032], 0.018);
    const branches = [
      [[[-1.98,0.20,-0.02],[-2.25,0.51,-0.05],[-2.41,0.83,0.03],[-2.57,1.11,0.08]],.105,.02],
      [[[-2.28,0.58,-0.03],[-2.65,0.62,0.05],[-2.94,0.8,0.08]],.052,.012],
      [[[-2.42,0.85,0.02],[-2.29,1.11,-0.05],[-2.36,1.34,-0.1]],.035,.011],
      [[[-2.67,0.64,0.05],[-2.83,0.46,0.12],[-3.03,0.44,0.13]],.027,.009],
      [[[-1.77,0.39,-0.01],[-1.86,0.77,-0.07],[-1.73,1.09,-0.04],[-1.79,1.30,-0.08]],.087,.014],
      [[[-1.85,0.78,-0.07],[-2.02,1.01,0.01],[-2.12,1.2,0.06]],.037,.011],
      [[[-2.08,-0.05,0],[-2.45,-0.02,0.03],[-2.69,0.1,0.13],[-2.98,0.02,0.17]],.10,.016],
      [[[-2.5,0,0.06],[-2.64,-0.24,0.11],[-2.92,-0.33,0.13]],.044,.011],
      [[[-1.99,-0.25,0],[-2.23,-0.50,0.03],[-2.37,-0.88,0],[-2.62,-1.16,0.05]],.099,.015],
      [[[-2.29,-0.68,0.02],[-2.62,-0.71,-0.05],[-2.84,-0.87,-0.04]],.04,.01],
      [[[-2.38,-0.89,0],[-2.24,-1.16,0.03],[-2.31,-1.38,0.06]],.034,.01],
      [[[-1.63,-0.39,-0.04],[-1.65,-0.75,-0.1],[-1.48,-1.05,-0.08]],.085,.013],
      [[[-1.66,-0.73,-0.10],[-1.87,-0.94,-0.11],[-1.97,-1.18,-0.05]],.035,.01],
      // Axon remains one continuous extension beneath the insulating sheath.
      [[[-1.22,-0.06,0],[-0.91,-0.1,0],[-0.5,-0.08,-0.025],[0.2,-0.06,0.015],[0.85,-0.03,0],[1.58,-0.1,-0.03],[1.94,-0.04,0]],.069,.041],
      [[[1.88,-0.04,0],[2.13,0.22,0.02],[2.29,0.54,0.04],[2.60,0.74,0.08]],.045,.015],
      [[[2.26,0.49,0.03],[2.16,0.83,-0.02],[2.33,1.05,-0.03]],.028,.012],
      [[[2.48,0.66,0.06],[2.76,0.62,0.06],[2.95,0.76,0.03]],.02,.01],
      [[[1.90,-0.05,0],[2.24,-0.09,0.04],[2.49,0.11,0.08],[2.80,0.06,0.10]],.043,.014],
      [[[2.43,0.07,0.07],[2.65,0.30,0.1],[2.89,0.29,0.12]],.023,.01],
      [[[1.88,-0.06,0],[2.11,-0.34,0.02],[2.31,-0.65,0.07],[2.60,-0.79,0.10]],.046,.014],
      [[[2.24,-0.54,0.05],[2.18,-0.87,0],[2.30,-1.04,0.04]],.027,.01],
      [[[2.45,-0.74,0.09],[2.77,-0.63,0.04],[2.93,-0.76,0.05]],.021,.009]
    ];
    U.mesh(T, U.merge(T, branches.map(([p, a, b]) => U.tubeGeometry(T, p, a, b, p.length > 5 ? 72 : 26, 9))), membrane, object);
    const sleeves = [];
    for (let i = 0; i < 6; i++) {
      const x = -0.80 + i * 0.42;
      sleeves.push(U.tubeGeometry(T, [[x,-0.08,0],[x+.11,-0.075,0],[x+.30,-0.065,0]], .112, .105, 10, 14));
    }
    U.mesh(T, U.merge(T, sleeves), sheath, object);
    const ends = [[2.6,.74,.08],[2.33,1.05,-.03],[2.95,.76,.03],[2.80,.06,.10],[2.89,.29,.12],[2.60,-.79,.10],[2.30,-1.04,.04],[2.93,-.76,.05]];
    U.instances(T, new T.SphereGeometry(1, 10, 7), membrane, ends.map(p => ({ position:p, scale:[.034,.027,.027] })), object);
    return { object, labels: [U.label(T, 'Nucleus in cell body', [-1.68,0.01,.25], 'left'), U.label(T, 'Long, continuous axon', [.33,-.07,.10], 'left'), U.label(T, 'Branched axon endings', [2.46,.56,.08], 'right')],
      caption: 'One motor nerve cell, with branched dendrites at its cell body and branched endings at the far end of one axon. The cell body is cut away to reveal its nucleus; ivory segments show an insulating sheath. Lengths are greatly compressed.',
      camera: { position:[0,.3,8.9], target:[0,0,0] }, viewRadius:3.25 };
  };

  B.phagocyte = (T, stateIndex = 0) => {
    const enclosed = stateIndex === 1, object = new T.Group();
    const membrane = U.material(T, '#c4b1c8', { roughness:.67 });
    const nuclear = U.material(T, '#795582', { roughness:.75 });
    const granule = U.material(T, '#b49a9f', { roughness:.8 });
    const c = enclosed ? [0,0,0] : [-.42,0,0];
    U.cutawayShell(T, object, membrane, c, [1.18,1.12,.92], 0.86, .043);
    const lobePositions = [[c[0]-.43,-.19,.23],[c[0]-.2,-.5,.18],[c[0]+.12,-.36,.21]];
    lobePositions.forEach((p,i) => U.ellipsoid(T, object, nuclear,p,[.27,.23,.20],.075));
    U.tube(T,object,nuclear,[lobePositions[0],[c[0]-.42,-.45,.18],lobePositions[1],[c[0]+.01,-.48,.19],lobePositions[2]],.07,.055,36,9);
    const rnd=U.random(92), grains=[];
    for (let i=0;i<90;i++) {
      const x=(rnd()*2-1)*.98,y=(rnd()*2-1)*.93;
      if(x*x/(.98*.98)+y*y/(.93*.93)>.94 || (x<.3&&y<.06&&y>-.77)) continue;
      const z=.25+rnd()*.09, s=.018+rnd()*.015;
      grains.push({position:[c[0]+x,y,z],scale:[s,s*.85,s]});
    }
    U.instances(T,new T.SphereGeometry(1,8,6),granule,grains,object);
    const bp=enclosed ? [.43,.43,.42] : [1.19,.35,.31];
    const bacterium=U.material(T,'#b38745',{roughness:.68});
    const rod = new T.CapsuleGeometry(.095,.29,7,14); rod.rotateZ(-.55);
    const bm=U.mesh(T,rod,bacterium,object);bm.position.set(...bp);
    // Fine surface ridges distinguish the bacterium from nuclear material.
    const bmarks=[];
    for(let j=0;j<5;j++) {
      const y=(j-2)*.052, x=-y*Math.tan(-.55);
      bmarks.push(U.tubeGeometry(T,[[bp[0]+x-.05,bp[1]+y-.02,bp[2]+.087],[bp[0]+x+.06,bp[1]+y+.04,bp[2]+.087]],.009,.009,3,5));
    }
    U.mesh(T,U.merge(T,bmarks),U.material(T,'#76572f'),object);
    if(enclosed) {
      const phagosomeMat=U.material(T,'#b7a6a7',{transparent:true,opacity:.18,roughness:.45,depthWrite:false});
      U.ellipsoid(T,object,phagosomeMat,bp,[.37,.34,.23],0);
      const ring=[];for(let j=0;j<=64;j++){const a=j/64*Math.PI*2;ring.push([bp[0]+.36*Math.cos(a),bp[1]+.33*Math.sin(a),bp[2]+.05]);}
      U.tube(T,object,membrane,ring,.018,.018,64,6);
    } else {
      U.tube(T,object,membrane,[[.30,.75,.1],[.69,.95,.12],[1.09,.87,.19],[1.40,.66,.26]],.23,.09,40,14);
      U.tube(T,object,membrane,[[.29,-.64,.03],[.66,-.53,.11],[1.05,-.32,.20],[1.39,.02,.27]],.25,.09,40,14);
      U.ellipsoid(T,object,membrane,[1.4,.66,.26],[.095,.095,.095],.02);
      U.ellipsoid(T,object,membrane,[1.39,.02,.27],[.095,.095,.095],.02);
    }
    return {object,states:['Surrounding','Enclosed'],labels:[U.label(T,enclosed?'Bacterium in a vesicle':'Bacterium being surrounded',bp,'right'),U.label(T,'Lobed nucleus',[c[0]-.26,-.46,.36],'left'),U.label(T,'Flexible cell membrane',enclosed?[-.86,.65,.5]:[.91,.9,.19],'left')],
      caption:enclosed?'Phagocyte cutaway: the bacterium is enclosed in a membrane-bound vesicle (phagosome), separate from the lobed nucleus. Internal structures are enlarged for teaching.':'Phagocyte cutaway: extensions of its flexible membrane surround a bacterium. The opening has not yet closed. The lobed nucleus remains separate. These are two illustrative stages, not a film.',
      camera:{position:[0,.25,6.8],target:[0,0,0]},viewRadius:2.05};
  };
})();
