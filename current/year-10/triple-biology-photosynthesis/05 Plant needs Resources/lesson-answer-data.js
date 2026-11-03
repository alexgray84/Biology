/* Lesson 5 · How do we know what a plant needs?: main-screen model answers and original classroom mark schemes.
   Hidden until the pupil opens “Model answer & mark scheme”. All questions are original; marks are classroom allocations,
   not a Pearson mark scheme. Starch-test results are secondary data (schematic diagrams); the hydroponics data are illustrative
   (hypothetical scenario). Pages are kept short so the non-scrolling drawer never clips at 1280×720. */
window.LessonAnswerData=(()=>{
  const m=(heading,text)=>({heading,text});
  const c=(heading,items)=>({heading,items});
  const A=(models,criteria,marks=null)=>({models,criteria,marks});
  const S=(heading,text,items)=>A([m(heading,text)],[c('Success criteria',items)]);

  const examModels=[
    m('(a) and (b)','(a) The nutrient solution: which ion is missing. (b) Any two: light intensity; temperature; volume of solution; type, age or size of seedlings; time (4 weeks).'),
    m('(c) No magnesium','Magnesium ions are needed to make chlorophyll, so the leaves are yellow. Less light is absorbed, so less photosynthesis. Less glucose for growth: 1.1 g, not 2.4 g.'),
    m('(d) No nitrate','Nitrate ions are needed to make amino acids. Amino acids make proteins. Without proteins, fewer new cells are made, so the lowest dry mass: 0.6 g.')
  ];
  const examScheme=[
    c('(a) · 1 mark · (b) · 2 marks',['(a) the nutrient solution / which ion is missing [1]','(b) any two controls [1] [1]','Reject “the lettuce” or “the amount of growth”.']),
    c('(c) · 3 marks',['Mg needed to make chlorophyll [1]','less light absorbed / less photosynthesis [1]','less glucose, so less growth or lower mass; may quote 1.1 v 2.4 g [1]']),
    c('(d) · 3 marks',['nitrate needed to make amino acids [1]','amino acids → proteins [1]','proteins for growth / new cells, so lowest mass [1]']),
    c('Do not accept',['“Magnesium makes proteins.”','“Nitrate gives the plant energy.”','“The plant has no food” with no chain.'])
  ];

  const main={
    outcomes:S('What success looks like','Describe the starch test and why each step is done; use starch-test results to show light, CO₂ and chlorophyll are needed; explain why plants need magnesium and nitrate.',['Name the step and its reason.','Claim + evidence + the one difference.']),

    'do-now':A([
      m('Answers 1–2','1 Takes in CO₂: in bright light photosynthesis is faster than respiration. 2 Through the stomata, then it diffuses through the air spaces.'),
      m('Answers 3–4','3 Any two: starch, cellulose, sucrose, amino acids / proteins, oils (or glucose is used in respiration). 4 Oxygen; volume collected in a gas syringe in 5 minutes.')
    ],[
      c('Mark scheme · 8 marks',['1 Takes in [1]; photosynthesis faster than respiration [1]','2 Stomata [1]; diffuses through air spaces [1]','3 Two products [1] [1]','4 Oxygen [1]; gas syringe, volume in a set time [1]']),
      c('Notes',['1: reject “plants don’t respire in the light”.','2: reject “through the cuticle”.','4: counting bubbles: accept, but less accurate.'])
    ],8),

    'starch-test':A([
      m('The order','C → B → E → D → F → A. Destarch; boil in water; warm in ethanol in a hot water bath; rinse in warm water; spread on a white tile; add iodine.'),
      m('Why · C, B, E','C: uses up old starch, so any starch found was made in the experiment. B: kills the cells and stops reactions. E: removes chlorophyll so the colour shows.'),
      m('Why · D, F, A','D: softens the brittle leaf. F: a white tile makes the colour easy to see. A: blue-black = starch; orange-brown = no starch.'),
      m('Safety','Ethanol is highly flammable: warm it in a hot water bath (water from a kettle), never over a flame. Hot water can scald. Iodine stains.')
    ],[
      c('Success criteria',['Order C B E D F A.','A reason for each step.','No flames near ethanol.']),
      c('Do not accept',['“Boil the leaf in ethanol over a Bunsen.”','“Ethanol kills the cells” (boiling water does).','“Iodine turns black if glucose is present.”'])
    ]),

    'foil-model':A([
      m('Claim','Light is needed for photosynthesis (to make starch).'),
      m('Support','Strong: only the part under the foil had no starch (orange-brown); the rest was blue-black. Same leaf and plant, so the only difference was light.'),
      m('Question','Did the foil kill the leaf? Reject it: foil only blocks light. Check: remove the foil, give 24 hours of light and retest. Starch appears in the strip.'),
      m('Why the weak support is weak','“The strip looks different” does not say what the colours mean or what was different for that part of the leaf.')
    ],[c('Success criteria',['Claim: light needed.','Support: covered = no starch; only light differs.','Question tested, not just stated.'])]),

    'guided-evidence':A([
      m('Variegated leaf','Claim: chlorophyll is needed for photosynthesis. Support: only the green parts, which have chlorophyll, made starch (blue-black); the white edge did not. Same leaf, same light.'),
      m('Variegated · question','What else differs between green and white cells? White cells have no chloroplasts with chlorophyll; the light and CO₂ were the same.'),
      m('Soda-lime leaf','Claim: carbon dioxide is needed for photosynthesis. Support: the leaf with soda lime (no CO₂) had no starch; the control leaf had starch.'),
      m('Soda lime · question','Was CO₂ the only difference? Both leaves were bagged, on the same plant, in the same light. Soda lime may also dry the air a little.')
    ],[
      c('Success criteria',['Variegated: chlorophyll needed.','Soda lime: CO₂ needed, compared with the control.','Each claim has evidence and the one difference.']),
      c('Do not accept',['Variegated leaf “shows light is needed”.','Soda lime “gives the leaf oxygen”.'])
    ]),

    hinge:A([
      m('A · chlorophyll is needed','The whole leaf had the same light and CO₂. Only the green parts have chlorophyll, and only they made starch.'),
      m('Next move','Chose B? Ask: did the white parts get less light? Chose C? White parts are living cells with no chlorophyll. Chose D? Ethanol removed the green before iodine.')
    ],[c('What each wrong choice reveals',['B: confuses the variable tested; light was the same.','C: irrelevant; white parts are living cells.','D: staining artefact; chlorophyll was removed first.'])]),

    recheck:A([
      m('1 · Prediction','The window turns blue-black (starch); the rest of the leaf stays orange-brown (no starch).'),
      m('2 · What it shows','Light is needed for photosynthesis: only the part that got light made starch.')
    ],[c('Mark scheme · 2 marks',['1 Window blue-black and rest orange-brown [1]','2 Light is needed (to make starch / for photosynthesis) [1]'])],2),

    minerals:A([
      m('No magnesium','Magnesium ions are needed to make chlorophyll. Less chlorophyll → yellow leaves → less light absorbed → less photosynthesis → less glucose → less growth.'),
      m('No nitrate','Nitrate ions are needed to make amino acids, which are joined to make proteins. Without proteins the plant makes fewer new cells, so growth is poor.'),
      m('The non-example','Sunny window v dark cupboard: the ion and the light both differ, so you cannot tell which caused the yellow leaves. Change one thing only.')
    ],[
      c('Success criteria',['Mg → chlorophyll → less photosynthesis.','Nitrate → amino acids → proteins → growth.','Fair test: one difference only.']),
      c('Do not accept',['“Magnesium makes proteins.”','“The plant eats the minerals for energy.”'])
    ]),

    'exam-independent':A(examModels,examScheme,9),

    improve:A(examModels,[...examScheme.slice(0,3),c('Improve in green',['Check each answer has the full chain: ion → substance → photosynthesis or growth.','Add the data: 2.4, 1.1 and 0.6 g.','(c) Add “less light absorbed”, if missing.'])],9),

    exit:A([
      m('Model answer','Magnesium ions are needed to make chlorophyll. With less chlorophyll, less light is absorbed, so less photosynthesis happens. Less glucose is made for respiration and for building new cells, so it grows less.')
    ],[
      c('Mark scheme · 3 marks',['Mg needed to make chlorophyll [1]','less light absorbed / less photosynthesis [1]','less glucose for growth / new cells [1]']),
      c('Do not accept',['“Magnesium is needed for proteins.”','“It has no energy”, with no chain.'])
    ],3)
  };
  return {main};
})();
