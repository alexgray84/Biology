/* Lesson 2 · Limiting factors of photosynthesis: main-screen model answers and original classroom mark schemes.
   Hidden until the pupil opens “Model answer & mark scheme”. All questions are original. Pondweed numbers are the
   SIMULATED default dataset (the lesson’s simulated dataset); the greenhouse data are illustrative (hypothetical scenario).
   Pages are kept short so the non-scrolling drawer never clips at 1280×720. */
window.LessonAnswerData=(()=>{
  const m=(heading,text)=>({heading,text});
  const c=(heading,items)=>({heading,items});
  const A=(models,criteria,marks=null)=>({models,criteria,marks});
  const S=(heading,text,items)=>A([m(heading,text)],[c('Success criteria',items)]);
  const rejects=c('Do not accept',['“The enzymes are killed” or “die”.','“The plant gets tired.”','“The plant has reached its maximum.”']);

  const main={
    outcomes:S('What success looks like','Explain how light, CO₂ and temperature change the rate; describe the pondweed method and its controls; name the limiting factor on each part of a graph, with evidence.',['Explain, do not just describe.','Quote values with units.']),

    'do-now':A([
      m('Answers 1–2','1 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂, with light above the arrow. 2 The temperature at which the enzyme works fastest.'),
      m('Answers 3–4','3 The rate rises to a peak (the optimum), then falls steeply as the enzyme denatures. 4 Carbon dioxide, taken in by diffusion.')
    ],[
      c('Mark scheme · 6 marks',['1 Correct formulae [1]; balanced [1]','2 Fastest rate [1]','3 Rise to labelled peak [1]; steeper fall [1]','4 Carbon dioxide [1]']),
      c('Notes',['1: reject CO2 without subscripts.','2: reject “highest temperature it survives”.','4: reject “oxygen”.'])
    ],6),

    predict:A([
      m('What a good prediction has','Labelled axes, a clear line shape and a reason that links light to the energy needed for photosynthesis.'),
      m('No answer yet','Any shape is acceptable now. You test it in the pondweed lab and compare your sketch afterwards.')
    ],[c('Success criteria',['Axes labelled.','Shape drawn and named.','Reason links light and energy.'])]),

    'method-model':A([
      m('Steps 1–3','Pondweed, cut end up, in NaHCO₃ solution. Tube in a 25 °C water bath. LED lamp at a fixed distance; acclimatise for 5 minutes.'),
      m('Steps 4–5','Collect the gas in a gas syringe for 5 minutes. Repeat three times; mean. IV: light intensity. DV: gas volume. CVs: temperature, NaHCO₃.')
    ],[c('Success criteria',['Steps in order.','IV and DV named.','Two controls and how.','Safety: hot lamp; electrics; hands.'])]),

    collect:A([
      m('Results · simulated data','0 %: 0.0, 0.0, 0.0 → mean 0.0. 20 %: 3.5, 3.6, 3.3 → 3.5. 40 %: 5.7, 5.8, 5.5 → 5.7 cm³.'),
      m('Results continued','60 %: 6.2, 3.7, 6.8 → 6.5. 80 %: 6.5, 6.9, 7.0 → 6.8. 100 %: 6.7, 7.0, 7.2 → 7.0 cm³.'),
      m('The anomaly','60 %, repeat 2: 3.7 cm³, far below 6.2 and 6.8. Mean = (6.2 + 6.8) ÷ 2 = 6.5 cm³. Including it gives 5.6 cm³: too low.'),
      m('What it shows','The volume rises steeply up to 40 % light, then levels off near 7 cm³. Compare this with your prediction.')
    ],[
      c('Success criteria',['Three repeats at each brightness.','Headings with units: / % and / cm³.','Means to 1 decimal place.','Anomaly found and left out.']),
      c('Do not accept',['A mean of 5.6 cm³ at 60 %.','Means with no units.'])
    ]),

    interpret:A([
      m('Rising section','From 0 to 40 % light the volume rises steeply: light is the limiting factor, so more light energy gives faster photosynthesis.'),
      m('Plateau','From about 60 % light more light makes little difference. Another factor is limiting.'),
      m('The CO₂ test','With 1.0 % NaHCO₃ the volume rose to 9.2 cm³ at 100 % light. So CO₂ concentration was limiting on the 0.5 % plateau.'),
      m('Limiting factor','The factor in shortest supply, which stops the rate going higher. Raising it raises the rate; raising other factors does not.')
    ],[c('Success criteria',['Rising: light limiting.','Plateau: another factor.','CO₂ evidence quoted.','Definition: shortest supply.'])]),

    temperature:A([
      m('Simulated means · 10–30 °C','10 °C 2.7 · 15 °C 4.0 · 20 °C 5.3 · 25 °C 7.0 · 30 °C 8.4 cm³. Light 100 %, NaHCO₃ 0.5 %.'),
      m('Simulated means · 35–50 °C','35 °C 7.6 · 40 °C 4.4 · 45 °C 1.4 · 50 °C 0.0 cm³. The peak is near 30 °C, the simulated optimum.'),
      m('Explain the rise','Photosynthesis is controlled by enzymes. Warmer molecules have more kinetic energy and collide more often, so more enzyme–substrate complexes form.'),
      m('Explain the fall','Above about 30 °C enzymes denature: the active site changes shape, the substrate no longer fits and fewer complexes form.')
    ],[
      c('Success criteria',['Peak near 30 °C (simulated).','Rise: collisions, complexes.','Fall: denature, active site.']),
      rejects
    ]),

    'limiting-hinge':A([
      m('B · CO₂ concentration','At 80 % light the 1.0 % curve is far higher than the 0.1 % curve. More CO₂ raises the rate at X, so CO₂ is in shortest supply.'),
      m('About C','Temperature was 25 °C for both curves, so this graph gives no evidence about it; only CO₂ changed, and raising it raised the rate.'),
      m('Next move','If you chose A, C or D, run 80 % light at 0.1 % and then 1.0 % NaHCO₃ in the lab. Compare the volumes.')
    ],[c('What each wrong choice reveals',['A: thinks the x-axis factor always limits.','C: temperature was 25 °C for both curves.','D: a plateau is not a maximum.'])]),

    'graph-model':A([
      m('Lines 1–2','The volume rises to 5.7 cm³ at 40 % light, then levels off at about 7.0 cm³. The rise: light is limiting.'),
      m('Lines 3–4','On the plateau more light makes little difference, so another factor limits: CO₂ concentration, because more CO₂ raised the plateau.'),
      m('The rejected line','“The plant gets tired” names no factor and uses no evidence. Plants do not tire; a factor is in short supply.')
    ],[c('Success criteria',['Describe: two values with units.','Explain the rise and the plateau.','Name the factor with evidence.'])]),

    'graph-independent':A([
      m('(a) Describe','Both rise steeply and match at low light. 400 ppm levels off at about 10 units from 40 %; 1000 ppm rises higher, to about 18 units.'),
      m('(b) Explain 400 ppm','Rising part: light is limiting, so more light gives a faster rate. Plateau: another factor is limiting, so more light makes no difference.'),
      m('(c) Limiting factor','CO₂ concentration: at 1000 ppm the rate is higher at the same light intensity and temperature.')
    ],[
      c('(a) · 2 marks',['Both rise; 400 ppm levels off sooner [1]','Two values with units [1]','e.g. about 10 and 18 arbitrary units.']),
      c('(b) · 2 marks',['Rise: light limiting [1]','Plateau: another factor limiting [1]']),
      c('(c) · 1 mark',['CO₂ concentration [1]','Reject “the plant is at its maximum”.','Reject temperature: same in both.']),
      c('Improve in green',['(a) Add a second value with units if you gave one.','(b) Name the limiting factor for each section.','(c) Evidence: 1000 ppm higher at same light, temperature.'])
    ],5),

    exit:A([
      m('1 · Above 30 °C','Enzymes denature: the active site changes shape, so the substrate no longer fits and fewer enzyme–substrate complexes form.'),
      m('2 · Lamp too close','The lamp heats the water, so temperature is no longer controlled. The volume would then change with temperature as well as light.')
    ],[
      c('Mark scheme · 4 marks',['1 Enzymes denature [1]','1 Active site changes shape; no fit [1]','2 Lamp heats the water [1]','2 Temperature not controlled [1]']),
      c('Do not accept',['“The enzymes are killed.”','“Too much light burns the plant.”'])
    ],4)
  };
  return {main};
})();
