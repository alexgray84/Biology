/* Lesson 1 · Digestive-enzyme graphs — main-screen model answers and original classroom mark schemes.
   Hidden until the pupil opens “Model answer & mark scheme”. All questions are original; all data are illustrative.
   Pages are short so the non-scrolling drawer never clips at 1280×720. */
window.LessonAnswerData=(()=>{
  const m=(heading,text)=>({heading,text});
  const c=(heading,items)=>({heading,items});
  const A=(models,criteria,marks=null)=>({models,criteria,marks});
  const S=(heading,text,items)=>A([m(heading,text)],[c('Success criteria',items)]);

  /* ph-pair: the review follows the enzyme chosen on the model */
  const phBase=A([
    m('Worked: pepsin','Pepsin’s rate is highest at about pH 2. At pH 2 its active site has the right shape, so pH 2 is its optimum pH.'),
    m('Your turn: trypsin','Trypsin’s optimum is about pH 8. At pH 2 its active site changes shape, the substrate no longer fits and the rate is about 0.')
  ],[c('Success criteria',['Prediction written before testing.','Trypsin optimum about pH 8.','pH 2: active site changed; rate about 0.'])]);
  phBase.stateKey='enzyme';
  const phVariant=(name,opt,where,extra)=>A([
    m(`${name} · about pH ${opt}`,`${name} works fastest near pH ${opt}, ${where}. There its active site has the right shape for its substrate.`),
    m('Away from the optimum','The active site changes shape. The substrate fits less well, so fewer complexes form and the rate falls.'),
    m(extra[0],extra[1])
  ],[c('Success criteria',[`Optimum about pH ${opt}.`,'Away from it: active site changes shape.','Far from it: denatured, permanent.'])]);
  phBase.variants={
    pepsin:phVariant('Pepsin','2','in the acidic stomach',['Worked example','“At pH 2 the active site has the right shape, so this is the optimum pH.” Now choose Trypsin.']),
    trypsin:phVariant('Trypsin','8','in the small intestine',['Trypsin at pH 2','pH 2 is far from pH 8. The active site has changed shape; the enzyme is denatured. Rate about 0.']),
    amylase:phVariant('Amylase','7','in the mouth',['Check the claim','Amylase’s optimum is about pH 7, but pepsin’s is about pH 2. Not all enzymes work best at pH 7.'])
  };

  /* read-graph: the review follows the graph reader's temperature (30 °C during the worked steps, 40 °C at step 5, then the pupil's choice). */
  const sf2=v=>v<0.00005?'0':v.toPrecision(2);
  const TIMES={10:450,20:240,30:150,40:90,50:180};
  const readWorked=[
    m('Steps 1–2','Axes: temperature / °C across; rate / s⁻¹ up. One small square: (0.004 − 0.002) ÷ 4 = 0.0005 s⁻¹.'),
    m('Steps 3–4','Rule up from 30 °C to the curve, then across. The rate is about 0.0067 s⁻¹.'),
    m('Rate = 1 ÷ time','At 40 °C: 1 ÷ 90 = 0.0111… = 0.011 s⁻¹, to 2 significant figures.')
  ];
  const readCriteria=[c('Success criteria',['Both axes and units named.','One square = 0.0005 s⁻¹.','Every value written with s⁻¹.'])];
  const readBase=A(readWorked,readCriteria);
  readBase.stateKey='temp';
  readBase.variants={};
  for(let t=10;t<=60;t++){
    const r=window.BioDiagrams.amylaseRate(t), val=t>=60?'about 0: there was no end-point':`about ${sf2(r)} s⁻¹`;
    const pages=[m(`Your reading at ${t} °C`,`Up from ${t} °C to the curve, then across to the rate axis: ${val}. Accept a reading within half a small square (0.00025 s⁻¹).`)];
    if(TIMES[t])pages.push(m(`Check with 1 ÷ time`,`The end-point at ${t} °C took ${TIMES[t]} s. 1 ÷ ${TIMES[t]} = ${sf2(1/TIMES[t])} s⁻¹, so the reading matches the calculation.`));
    pages.push(readWorked[2]);
    readBase.variants[t]=A(pages,readCriteria);
  }

  const main={
    welcome:S('How we work','Whiteboards up together on 3, 2, 1, show me. Try first, then use the support. Improve in green pen. Devices only for model screens, when asked.',['Whiteboard, pen, green pen ready.','Knows the four routines.']),

    toolkit:A([
      m('(a) and (b)','(a) Axes and units; one small square; rule up, then across; value with its unit. (b) 1 ÷ 90 = 0.011111… = 0.011 s⁻¹.'),
      m('(c) and (d)','(c) Describe with numbers, then explain the rising and falling parts. (d) Enzyme, substrate, active site, complex, optimum, denatured, rate.')
    ],[c('Success criteria',['Says the 4 steps in order.','Knows where the toolkit is.'])]),

    outcomes:S('What success looks like','Read values from an enzyme graph with units. Calculate rate = 1 ÷ time. Explain the rise and the fall. Explain how pH changes the active site.',['Values always have units.','Explain, do not just describe.']),

    'do-now':A([
      m('Answers 1–3','1 catalyst. 2 maltose. 3 amino acids.'),
      m('Answers 4–6','4 fatty acids and glycerol. 5 active site. 6 B: the active site has changed shape, for good.'),
      m('Missed 5 or 6?','Use the key-words strip on your Graph toolkit, part (d). The next screen teaches these words again.')
    ],[
      c('Mark scheme · 6 marks',['1 catalyst [1]','2 maltose [1]','3 amino acids [1]','4 fatty acids and glycerol, both [1]']),
      c('Mark scheme · continued',['5 active site [1]','6 B [1]','2: do not accept glucose.','6: reject A; enzymes are not alive.'])
    ],6),

    'key-words':A([
      m('Steps 1–2','The substrate moves to the active site, the gap in the enzyme. It fits, making an enzyme–substrate complex.'),
      m('Step 3','The products leave. The enzyme is not changed, so a new substrate can fit. It is used again.')
    ],[c('Success criteria',['Points to the active site.','Says enzyme, substrate, active site.','Says enzyme–substrate complex.'])]),

    'read-graph':readBase,

    'your-turn-read':A([
      m('(a) and (b)','(a) About 0.0042 s⁻¹. (b) About 40 °C: the temperature at the highest point.'),
      m('(c)','1 ÷ 240 = 0.0041666… = 0.0042 s⁻¹.')
    ],[
      c('Mark scheme · 3 marks',['(a) 0.0040 to 0.0045, with s⁻¹ [1]','(b) about 40 °C [1]','(c) 0.0042 s⁻¹ [1]']),
      c('If you got one wrong',['No unit: toolkit (a), step 4.','Wrong square value: toolkit (a), step 2.','Calculation: toolkit (b).'])
    ],3),

    'explain-model':A([
      m('Describe and optimum','As the temperature increases from 10 to 40 °C, the rate increases from 0.0022 to 0.011 s⁻¹, then falls. Optimum: about 40 °C.'),
      m('Rising','The molecules have more kinetic energy, so they collide more often and form more enzyme–substrate complexes.'),
      m('Falling','Above the optimum the active site changes shape. The substrate no longer fits. The enzyme is denatured. This is permanent.')
    ],[
      c('Success criteria',['Describe with two numbers and units.','Rising: kinetic energy, collisions, complexes.','Falling: active site shape, no fit, denatured.']),
      c('Do not write',['“The enzyme is killed” or “dies”.','“Fewer collisions” for the fall.','“The substrate is denatured.”'])
    ]),

    'graph-hinge':A([
      m('B · the active site changes shape','Above the optimum the active site changes shape. The substrate no longer fits, so fewer complexes form. The enzyme is denatured.'),
      m('Next move','Chose A, C or D? Go back to Explain the shape: regions 2 and 3, optimum and falling. Then use it in part (d) of the lipase question.')
    ],[c('What each wrong choice shows',['A: hotter molecules move faster, not slower.','C: enzymes are not alive; say denatured.','D: each temperature had a fresh tube with the same starch.','D: at 60 °C the starch was still there.'])]),

    'ph-pair':phBase,

    'marked-question':A([
      m('(a) and (b)','(a) About 37 °C. (b) 4 arbitrary units.'),
      m('(c)','It took 50 s. Rate = 1 ÷ 50 = 0.02 s⁻¹.'),
      m('(d)','Above 37 °C the active site changes shape. The substrate no longer fits, so fewer complexes form. The enzyme is denatured; the rate falls to 0 by 60 °C.')
    ],[
      c('(a) and (b) · 2 marks',['(a) 37 °C; accept 36 to 38 °C [1]','(b) 4 arbitrary units [1]; accept 4 a.u. or 4 AU','(b) reject 4 s⁻¹ or no unit.']),
      c('(c) · 2 marks',['1 ÷ 50 [1]','0.02 s⁻¹ [1]; accept 0.020, /s, per second','0.02 s⁻¹ with no working: 2 marks.','0.02 with no unit: 1 mark.']),
      c('(d) · 2 marks',['Active site changes shape; substrate no longer fits [1]','Or: active site changed shape; fewer complexes form [1]','Enzyme denatured [1]; “falls to 0” not required.']),
      c('(d) · do not accept',['“Fewer collisions.”','“The enzyme is killed.”','“The substrate is denatured.”'])
    ],6),

    'self-check':A([
      m('(a)–(c)','(a) About 37 °C. (b) 4 arbitrary units. (c) 1 ÷ 50 = 0.02 s⁻¹.'),
      m('(d)','Above 37 °C the active site changes shape. The substrate no longer fits. The enzyme is denatured, so the rate falls to 0.'),
      m('Green-pen fix','Before: “It gets too hot.” After: “Above 37 °C the active site changes shape, so the substrate no longer fits.”')
    ],[
      c('Mark scheme · 6 marks',['(a) 37 °C [1] · (b) 4 arbitrary units [1]','(c) 1 ÷ 50 [1] · 0.02 s⁻¹ [1]','(d) active site shape; no fit [1]','(d) enzyme denatured [1]']),
      c('Your fix',['One line rewritten in green.','Adds a unit or a key word.'])
    ],6),

    exit:A([
      m('1 · Pepsin in pH 8','pH 8 is far from pepsin’s optimum, about pH 2. Its active site changes shape, so the substrate no longer fits. It is denatured.'),
      m('2 and 3','2: 5 arbitrary units. 3: about 40 °C. At the optimum the rate is fastest, so the end-point time is shortest.')
    ],[
      c('Mark scheme · 4 marks',['1 far from optimum pH 2 [1]','1 denatured, or active site changes shape so substrate no longer fits [1]','2 5 arbitrary units, with unit [1]','3 about 40 °C; accept 37–40 °C [1]']),
      c('Do not accept',['1: “pepsin is killed”.','2: a value with no unit.'])
    ],4)
  };
  return {main};
})();
