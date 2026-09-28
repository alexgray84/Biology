/* Lesson 1 · on-demand pupil review. All questions are original; marks are local classroom allocations, not Pearson mark schemes. */
window.LessonAnswerData=(() => {
  const m=(heading,text)=>({heading,text});
  const c=(heading,items)=>({heading,items});
  const A=(models,criteria,marks=null)=>({models,criteria,marks});
  const S=(heading,text,items)=>A([m(heading,text)],[c('Success criteria',items)]);

  /* Molecule model: one review per molecule on show. */
  const molecule={
    starch:A([m('Starch','A large carbohydrate made from many glucose units joined in a chain. The plant storage carbohydrate. Elements: C, H, O.')],[c('2 marks',['Many glucose units [1]','Plant store; C, H, O [1]'])],2),
    glycogen:A([m('Glycogen','A large carbohydrate made from many glucose units, more highly branched than starch. The animal store, in liver and muscle.')],[c('2 marks',['Many glucose units [1]','Animal store / more branched [1]','Reject: amino acids'])],2),
    protein:A([m('Protein','A chain of amino acids (about 20 kinds) in a specific order, folded into a specific 3D shape. Elements: C, H, O, N, often S.')],[c('2 marks',['Amino acids [1]','Specific order or shape; or N [1]'])],2),
    lipid:A([m('Lipid','One glycerol joined to three fatty acids — not a chain of one repeating unit. Elements: C, H, O, with much less oxygen.')],[c('2 marks',['Glycerol and fatty acids [1]','Three fatty acids, one glycerol [1]','Reject: chain of glycerol'])],2)
  };

  /* Food-test model, known samples: one review per reagent. */
  const reagent={
    iodine:A([m('Iodine · known set','Starch suspension turns blue-black. Glucose, egg white, oil and the water control stay orange-brown.')],[c('Success criteria',['Starch: blue-black','Others match the control','No heating'])]),
    benedicts:A([m('Before heating','Every tube stays blue. Benedict’s must be heated first.'),m('After heating','Glucose solution forms a brick-red precipitate. The other tubes and the water control stay blue.')],[c('Success criteria',['No change before heating','Glucose: brick-red after heating','Starch stays blue'])]),
    biuret:A([m('Biuret · known set','Egg-white solution turns purple. Glucose, starch, oil and the water control stay blue.')],[c('Success criteria',['Egg white: blue → purple','Others match the control','No heating'])]),
    ethanol:A([m('Emulsion · known set','Vegetable oil gives a cloudy white emulsion. The other samples and the water control give no emulsion.')],[c('Success criteria',['Oil: cloudy white emulsion','Others: no emulsion','No flames near ethanol'])])
  };

  const main={
    outcomes:A([m('What success looks like','You can give the elements and building blocks of each group, carry out and interpret four food tests, and state each group’s main job.')],[c('Check at the exit',['Elements in each group','Reagent and positive result','One function per group'])]),

    'do-now':A([
      m('1 to 3','1. Proteins. 2. Plants: starch; animals: glycogen. 3. Cellulose.'),
      m('4 · prediction','Butter. It is mostly lipid, which releases about twice as much energy per gram as carbohydrate or protein.')
    ],[c('5 marks',['Proteins [1]; cellulose [1]','Starch [1]; glycogen [1]','Butter / lipid [1]']),c('Do not accept',['“Makes energy” — say releases'])],5),

    elements:A([m('Three lists','Carbohydrates: C, H, O. Proteins: C, H, O, N; many also S. Lipids: C, H, O, with much less oxygen than carbohydrates. N is circled.')],[c('Success criteria',['Three correct lists','Nitrogen circled','Lipid oxygen noted'])]),

    'build-model':{stateKey:'molecule',variants:molecule,...A([
      m('Carbohydrates','Starch and glycogen are made from many glucose units. Glycogen is more branched.'),
      m('Protein and lipid','Protein: amino acids in a specific order. Lipid: one glycerol and three fatty acids.')
    ],[c('Success criteria',['One line per molecule','Lipid: glycerol + fatty acids','Glycogen more branched'])])},

    carbohydrates:A([m('The drawing','Linked hexagons labelled glucose. A chain of glucose units is starch in plants; a highly branched chain is glycogen in animals (liver, muscle).')],[c('Success criteria',['Glucose hexagons','Starch: plants','Glycogen: animals, branched'])]),

    'proteins-lipids':A([
      m('Protein chain','Amino-acid order → specific 3D shape → function, e.g. an enzyme.'),
      m('Lipid sketch','An E-shape: one glycerol with three fatty acids, each labelled.')
    ],[c('Success criteria',['Order → shape → function','One glycerol, three fatty acids'])]),

    functions:A([
      m('Carbohydrate, protein','Carbohydrate: glucose; main energy source, released in respiration. Protein: amino acids; growth, repair and enzymes.'),
      m('Lipid','Glycerol and fatty acids; energy store, insulation, organ protection, cell membranes. Lipid releases most per gram: ≈37 vs ≈17 kJ/g.')
    ],[c('Success criteria',['Correct building blocks','One function each','Lipid most energy per gram'])]),

    'molecules-hinge':A([m('B is correct','Starch (plants) and glycogen (animals) are both made from many glucose units.')],[c('What wrong answers reveal',['A: glycogen is glucose, not protein','C: lipid is glycerol + 3 fatty acids','D: proteins also contain N'])]),

    'tests-table':A([
      m('Starch','Iodine, a few drops, no heating. Orange-brown → blue-black. Negative: stays orange-brown.'),
      m('Glucose','Equal volume of Benedict’s; water bath about 80 °C, 5 min. Blue → green → yellow → orange → brick-red precipitate. Negative: blue.'),
      m('Protein','Biuret reagent added to a liquid sample and mixed; no heating. Blue → purple. Negative: blue.'),
      m('Fat','Shake with ethanol, pour into water. Cloudy white emulsion. Negative: clear. No flames.')
    ],[c('Success criteria',['Four complete rows','Only Benedict’s is heated','Brick-red precipitate, not “red”'])]),

    'tests-model':{stateKey:'reagent',variants:reagent,...A([
      m('Known samples','Iodine: starch blue-black. Benedict’s, heated: glucose brick-red. Biuret: egg white purple. Ethanol: oil cloudy white.')
    ],[c('Success criteria',['Prediction written first','Positive tube + colour','Compared with water'])])},

    'benedict-scale':A([m('Colour order','Blue → green → yellow → orange → brick-red. The arrow “more glucose” points to brick-red.')],[c('Success criteria',['Five colours in order','Arrow to brick-red'])]),

    practical:A([
      m('Recording a result','“Sample 2 turned purple with Biuret, so it contains protein. The water control stayed blue.” Real foods vary: record what you see.')
    ],[c('Success criteria',['Every sample, every test','Before and after colours','Water control each time'])]),

    'results-interpret':A([
      m('X','Starch and glucose: iodine blue-black; Benedict’s orange.'),
      m('Y','Protein only: Biuret purple; other tests negative.'),
      m('Z','Protein and lipid: Biuret lilac; cloudy white emulsion.')
    ],[
      c('6 marks · X and Y',['X: starch and glucose [1]','X: blue-black and orange [1]','Y: protein [1]; purple [1]']),
      c('6 marks · Z',['Z: protein and lipid [1]','Z: lilac and cloudy [1]','Accept reducing sugar; fat'])
    ],6),

    'control-hinge':A([m('C is correct','Distilled water has no nutrient, so it shows a negative colour to compare with. A known glucose sample would be a positive control.')],[c('What wrong answers reveal',['A: controls do not speed reactions','B: the water tube has no food','D: no reagent here detects water'])]),

    'exam-model':A([
      m('Prepare','Grind the cake with distilled water in a mortar and pestle. Decant the liquid. Put equal volumes in two tubes.'),
      m('Test','Add an equal volume of Benedict’s; heat in a water bath at about 80 °C for 5 min: brick-red precipitate = glucose. Add iodine: blue-black = starch.')
    ],[
      c('Indicative content (1)',['Grind with water [1]; decant [1]','Benedict’s, equal volume [1]','Water bath 70–100 °C [1]']),
      c('Indicative content (2)',['Brick-red precipitate / sequence [1]','Iodine [1]; blue-black [1]','Maximum 6']),
      c('Do not accept',['Best: “brick-red”, not “red”','Biuret or ethanol tests'])
    ],6),

    'exam-independent':A([
      m('Glucose','Add an equal volume of Benedict’s. Heat in a water bath at about 80 °C for 5 minutes. A brick-red precipitate supports glucose.'),
      m('Protein','Add Biuret reagent to a fresh sample and mix; no heating. Purple supports protein.'),
      m('No fat','Shake a sample with ethanol, then pour into water. Staying clear supports “no fat”. Compare every test with a water control.')
    ],[
      c('6 marks · glucose',['Benedict’s, equal volume [1]','Water bath 70–100 °C [1]','Brick-red precipitate [1]']),
      c('6 marks · protein, fat',['Biuret reagent added [1]; purple [1]','Ethanol, then water [1]','Clear = no fat [1]']),
      c('Also credit',['Water control [1]','Max 6; max 5 if a claim untested','Best: “brick-red”, not “red”'])
    ],6),

    'semi-quant':A([
      m('(a) and (b)','(a) A, D, B, C. (b) The colour shows the relative amount of reducing sugar, so samples can be ranked, but it gives no actual concentration.'),
      m('(c)','Use a colorimeter; or filter, dry and weigh the precipitate; or time the first colour change.')
    ],[c('4 marks',['(a) A > D > B > C [1]','(b) ranks / relative amount [1]','(b) no actual value [1]']),c('4 marks (c)',['Colorimeter / weigh / time [1]'])],4),

    exit:A([
      m('1 and 2','1. Glycerol and fatty acids. 2. Benedict’s test. Ethanol is highly flammable.'),
      m('3','Starch is present. No reducing sugar, such as glucose, was detected.')
    ],[c('5 marks',['1. Glycerol and fatty acids [1]','2. Benedict’s [1]; flammable [1]','3. Starch [1]; no reducing sugar [1]'])],5)
  };
  return {main};
})();
