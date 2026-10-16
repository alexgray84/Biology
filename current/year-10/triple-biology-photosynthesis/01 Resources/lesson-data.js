/* Lesson 1 · Photosynthesis and its equations (Year 10 Triple Biology · Pearson 4XBI1 2.18, 2.19).
   Pupil-facing content only. All questions are original. Synthetic/anonymous: no pupil data.
   AP1 content is not known to this build: the AP1 screen is a generic, teacher-run feedback routine. */
(() => {
  const m=(heading,text)=>({heading,text});
  const c=(heading,items)=>({heading,items});
  const A=(models,criteria,marks=null)=>({models,criteria,marks});
  const S=(heading,text,items)=>A([m(heading,text)],[c('Success criteria',items)]);
  const p=(id,family,type,title,topic,extra={})=>({id,family,type,title,topic,...extra});

  window.LESSON={
    number:1,unit:'Photosynthesis and plant gas exchange',unitLesson:1,spec:'Pearson 4XBI1',
    title:'Photosynthesis and its equations',
    question:'Where does a plant’s food, and its mass, come from?',
    path:['Fix one AP1 answer','Build the equation','Explain the evidence'],
    outcomes:[
      ['Explain photosynthesis as the conversion of light energy to chemical energy in glucose, made from carbon dioxide and water, and explain why it matters.','2.18'],
      ['Write the word equation and the balanced symbol equation for photosynthesis.','2.19'],
      ['Use the equation to explain evidence about plant mass and starch.','2.18, 2.19 · application']
    ],
    vocabulary:[
      ['Photosynthesis','Plants use light energy to make glucose from carbon dioxide and water. Oxygen is released.'],
      ['Chloroplast','The organelle where photosynthesis happens. Most are in palisade mesophyll cells.'],
      ['Chlorophyll','The green pigment in chloroplasts. It absorbs light energy, mostly red and blue light. It is not used up.'],
      ['Palisade mesophyll','The layer of tall leaf cells near the upper surface, packed with chloroplasts.'],
      ['Energy transfer','Light energy is transferred to chemical energy stored in glucose. Energy is never made.'],
      ['Reactant','A substance used up in a reaction: carbon dioxide and water.'],
      ['Product','A substance made in a reaction: glucose and oxygen.'],
      ['Balanced equation','The same number of each kind of atom on both sides of the arrow.'],
      ['Glucose','C₆H₁₂O₆, a simple sugar. Its atoms come from carbon dioxide and water.'],
      ['Starch','An insoluble store made from many glucose units. Iodine turns blue-black with starch.'],
      ['Cellulose','Made from glucose. It builds plant cell walls.'],
      ['Sucrose','A soluble sugar made from glucose, used to transport sugar around the plant.'],
      ['Destarch','Keep a plant in the dark for about 48 hours so it uses up the starch in its leaves.'],
      ['Producer','An organism that makes its own food by photosynthesis. It starts food chains.'],
      ['Diffusion','Net movement of particles from a higher to a lower concentration. CO₂ enters leaves by diffusion.']
    ],
    resourcePages:[
      {heading:'Ready to learn',text:'Have these ready now.',items:['Book, pen and green pen','Your marked AP1 paper','Your device, for the atom model']},
      {heading:'Photosynthesis reading',text:'The lesson’s teaching input, diagrams and check questions.',href:'01%20Resources/Photosynthesis%20reading.html',linkLabel:'Open the reading'},
      {heading:'Exam-style questions',text:'All the lesson’s exam questions, plus homework, with answers.',href:'01%20Resources/Exam-style%20questions.html',linkLabel:'Open the question sheet'}
    ],
    modelPages:[
      {heading:'Follow every atom',text:'Watch 6 CO₂ and 6 H₂O become glucose and O₂.',action:{id:'equation-model',label:'Open the atom model'}},
      {heading:'Balance the equation',text:'Word equation to balanced symbol equation, step by step.',action:{id:'balance',label:'Open the worked example'}},
      {heading:'Inside the chloroplast',text:'The series diagram: what goes in and what comes out.',action:{id:'chloroplast',label:'Open the diagram'}},
      {heading:'A modelled 3-mark answer',text:'One creditworthy line at a time.',action:{id:'exam-model',label:'Open the worked answer'}}
    ],
    checkPages:[
      {heading:'Where did the mass come from?',text:'Explain van Helmont’s willow.',action:{id:'willow',label:'Open the willow task'}},
      {heading:'Energy, not atoms',text:'Four-option hinge.',action:{id:'photo-hinge',label:'Open the hinge'}},
      {heading:'Equations and the dark plant',text:'Independent question. 7 marks.',action:{id:'exam-independent',label:'Open the question'}},
      {heading:'Show what you know',text:'Three exit questions. 4 marks.',action:{id:'exit',label:'Open the exit check'}}
    ],
    ai:{
      process:{
        prompt:'An AI tool says plants make energy from sunlight and keep it as light inside glucose. First, write one sentence: what happens to energy in photosynthesis?',
        claim:'Plants make energy, stored as light.',
        checks:['Is energy made, or transferred?','In what form is it stored?','Rewrite the claim accurately'],
        answer:A([
          m('Two errors','Energy is never made: light energy is transferred. It is stored as chemical energy in glucose, not as light. Evidence: the atom model shows light adds no atoms to glucose.')
        ],[c('A strong check',['“Transferred”, not “made”','Stored as chemical energy','Names the atom model as evidence'])])
      },
      equation:{
        prompt:'An AI tool confidently calls the next equation “the balanced symbol equation”. First, write the balanced equation from memory.',
        claim:'CO₂ + H₂O → C₆H₁₂O₆ + O₂',
        checks:['Count C on each side','Count H and O on each side','Fix it with numbers in front'],
        answer:A([
          m('Not balanced','Left: C 1, H 2, O 3. Right: C 6, H 12, O 8. Correct: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂, with C 6, H 12, O 18 on each side.')
        ],[c('A strong check',['Counts atoms on both sides','Adds 6, 6 and 6','Formulae left unchanged'])])
      },
      evidence:{
        prompt:'An AI tool says a tree’s mass comes from the soil, because roots absorb nutrients. First, explain where most of a tree’s dry mass comes from.',
        claim:'Tree mass comes from soil nutrients.',
        checks:['What did the soil’s mass do?','What mass do mineral ions add?','Where do glucose’s atoms come from?'],
        answer:A([
          m('The soil barely changed','Van Helmont’s soil lost about 0.06 kg while the tree gained about 74 kg. Mineral ions are a tiny mass. Most dry mass comes from CO₂ in the air, its atoms built into glucose.')
        ],[c('A strong check',['Uses the 0.06 kg evidence','Mineral ions are a tiny mass','Mass from CO₂ in the air'])])
      }
    },
    uae:{
      label:'Mangroves and carbon',
      pages:[
        {heading:'Growing more mangroves',text:'Abu Dhabi’s Climate Change Strategy expands mangrove areas using traditional methods and drones. National target: plant 100 million mangrove trees by 2030.',source:'https://mediaoffice.ae/en/news/2025/november/25-11/dubai-environment-and-climate-change-authority',sourceLabel:'Read the Dubai Media Office page',note:'Official UAE government source · checked 16 Oct 2026'},
        {heading:'Where does the carbon go?',text:'Use the photosynthesis equation to explain how planting mangroves removes CO₂ from the air, and where the carbon is stored.',answer:A([
          m('Into glucose','Mangroves absorb CO₂ for photosynthesis. Light energy is used to build the carbon atoms from CO₂ into glucose.'),
          m('Then into biomass','Glucose is turned into starch, cellulose and other molecules in new leaves, roots and wood. Respiration returns some CO₂, so storage depends on growth.')
        ],[c('Success criteria',['CO₂ absorbed for photosynthesis','Carbon built into glucose']),c('Success criteria · continued',['Stored as starch, cellulose or biomass','Respiration returns some CO₂'])])},
        {heading:'Day and night',note:'Hypothetical classroom scenario',text:'A pupil says: “Mangroves remove CO₂ all day and all night.” Evaluate this using photosynthesis and respiration.',answer:A([
          m('Not at night','Photosynthesis needs light, so it stops at night. The mangrove still respires day and night, releasing CO₂.'),
          m('Net effect','Over a whole day, a growing mangrove takes in more CO₂ than it releases, so it stores carbon overall.')
        ],[c('Success criteria',['Photosynthesis needs light','Respiration all the time','Net storage only while growing'])])}
      ]
    },

    phases:[
      p('title','Title','title','Photosynthesis and its equations','process'),
      p('outcomes','Learning outcome','outcome','What will you be able to do?','process',{nav:'Learning outcomes',mins:1}),
      p('do-now','Do now','content','Start from memory','process',{nav:'Do now',mins:4,items:[
        'What do <strong>chloroplasts</strong> do? [1]',
        'Define <strong>diffusion</strong>. [2]',
        'What does an <strong>enzyme</strong> do to the rate of a reaction? [1]',
        '<strong>Diagnostic:</strong> most of the solid material (dry mass) in a large tree came from: A soil · B water · C air · D sunlight. Write your letter and how sure you are (1–5).'
      ],doThis:['Write answers 1–4 in your book.','For question 4, write a letter and a number from 1 to 5.']}),

      /* ---------- Fix one AP1 answer ---------- */
      p('ap1-feedback','Thinking','cases','AP1: fix one answer','process',{nav:'AP1 feedback',mins:5,timer:5,aiTopic:'process',
        cases:[
          ['1','<strong>Find it:</strong> the question where you lost most marks.'],
          ['2','<strong>Read it:</strong> the model answer on the board.'],
          ['3','<strong>Fix it:</strong> rewrite your weakest sentence in <strong>green</strong>.'],
          ['4','<strong>Check it:</strong> underline the key word you added.']
        ],
        doThis:['Do steps 1–4 in order, on your AP1 paper.'],
      support:{
        start:[
          ['Find the command word','Circle the first word of your question: state, describe, explain or calculate. Write what it asks you to do in four words or fewer.',S('Command words','State: give a fact. Describe: say what happens. Explain: give reasons, using “because”. Calculate: show working and units.',['Command word circled','Its meaning written'])],
          ['One sentence only','Copy the key word from the model answer above your weakest sentence. Rewrite only that sentence, using the key word.',S('A focused fix','One sentence is rewritten in green pen and now contains the model answer’s key word.',['One sentence chosen','Key word used correctly'])]
        ],
        understand:[
          ['Match the marking point','Tick each part of the model answer that earned a mark. Find the tick your answer was missing.',S('The missing point','The missing marking point is found and named, so the rewrite targets it.',['Ticks on the model answer','Missing point named'])],
          ['Fix a second answer alone','Close this panel. Choose a different lost mark. Rewrite it in green pen before you look at the model answer, then check.',S('Independent fix','A second answer is improved without help, then checked against the model answer.',['Written before checking','Checked and corrected'])]
        ],
        hot:[
          ['The examiner’s reason','Beside your fix, write the examiner’s reason for the mark in one sentence. Start: “The mark is for…”.',S('Reason for the mark','The sentence names the exact idea or term the examiner credits, not just “more detail”.',['Starts “The mark is for…”','Names a specific idea'])],
          ['Which mistake repeats?','Look across your AP1 errors. Name the kind of mistake most likely to cost you marks in AP2, and one habit to stop it.',S('A pattern and a habit','For example: “I describe when asked to explain. Habit: write ‘because’ in every explain answer.”',['Names a pattern','Gives a specific habit'])]
        ]
      }}),

      /* ---------- Build the equation ---------- */
      p('willow','Input','content','Where did 74 kg come from?','evidence',{nav:'Van Helmont’s willow',mins:3,diagram:'willow',secondaryDiagram:true,caption:'Van Helmont’s willow experiment. Schematic.',
        text:'Van Helmont (published 1648) grew a willow in soil for 5 years, adding only rainwater. The tree gained about <strong>74 kg</strong> (fresh mass). The dry soil lost only about <strong>0.06 kg</strong>.',
        items:['<strong>Explain:</strong> where did the tree’s mass come from? [3]'],
        ladder:[['Secure','Not from the soil.'],['Strong','From substances taken in.'],['Grade 8–9','Carbon from CO₂ in the air.']],
        doThis:['Write two sentences in your book. Use both numbers.'],
      support:{
        start:[
          ['Compare the two numbers','Write 74 kg and 0.06 kg one above the other. Circle the bigger change. Complete: “The soil cannot explain the mass because ___.”',S('Tiny soil loss','The soil cannot explain the mass because it lost only about 0.06 kg, while the tree gained about 74 kg.',['Both numbers used','Soil ruled out'])],
          ['What else went in?','List everything the tree could take in during the 5 years. Use the diagram: soil, rainwater and one thing you cannot see.',S('Three inputs','Mineral ions from the soil, water, and carbon dioxide from the air.',['Water listed','Carbon dioxide from the air'])]
        ],
        understand:[
          ['Van Helmont’s conclusion','Van Helmont concluded the mass came from water. Which input did he not know about?',S('He missed the air','He did not know that plants take in carbon dioxide from the air.',['Names carbon dioxide','From the air'])],
          ['Explain it unaided','Close this panel. In two sentences, explain where most of the tree’s dry mass came from. Then check.',S('Independent','Not from the soil: it lost only 0.06 kg. Most dry mass came from CO₂ from the air, with water also contributing.',['Soil ruled out with evidence','CO₂ from the air'])]
        ],
        hot:[
          ['Fresh mass or dry mass?','Van Helmont weighed the living tree. Suggest why its fresh mass overstates the mass built from CO₂.',S('Water inside','Much of a living tree’s mass is water held in its cells. Dry mass, after the water is removed, shows the material built from CO₂ and water.',['Fresh mass includes water','Dry mass removes it'])],
          ['Judge the method','Give one weakness in van Helmont’s method and say how it affects his conclusion.',S('One weakness','One tree, so no repeats; or soil could be lost or gained. The result is suggestive, not conclusive. He did not measure gases at all.',['A valid weakness','Its effect on the conclusion'])]
        ]
      }}),

      p('equation-model','Input','model3d','Follow every atom','equation',{nav:'Atom model · 2.19',mins:6,model:'atoms',fallback:'atomsFallback',
        steps:[
          'Six CO₂ and six H₂O. <strong>Count</strong> every atom.',
          'Chlorophyll absorbs <strong>light energy</strong>. Atoms rearrange.',
          'One <strong>glucose</strong> and six O₂. Count again.'
        ],
        stepStates:[{stage:'reactants'},{stage:'light'},{stage:'products'}],
        doThis:['Count C, H and O on each side in your book.'],
      support:{
        start:[
          ['Count one element','Press Carbon. Count the dark atoms. Write “C: __ before, __ after”. Then do the same for hydrogen.',S('Carbon and hydrogen','C: 6 before, 6 after. H: 12 before, 12 after.',['Both counts for C','Both counts for H'])],
          ['A counting table','Draw three rows: C, H, O. Add two columns: reactants, products. Fill one box at a time.',S('The table','C 6 and 6. H 12 and 12. O 18 and 18.',['Three rows','Six numbers'])]
        ],
        understand:[
          ['Where does oxygen go?','Press Oxygen at the Products stage. How many oxygen atoms are in glucose, and how many in the O₂ molecules?',S('Split 6 and 12','6 oxygen atoms are in glucose and 12 are in the six O₂ molecules: 18 in total.',['6 in glucose','12 in O₂'])],
          ['Count without the model','Close this panel. From 6CO₂ + 6H₂O, work out the atom totals without the model. Then check.',S('By calculation','C: 6 × 1 = 6. H: 6 × 2 = 12. O: 6 × 2 + 6 × 1 = 18.',['Uses multiplication','Totals 6, 12, 18'])]
        ],
        hot:[
          ['What does light add?','The atom counts are equal on both sides. So what does light add to the reaction? Explain.',S('Energy only','Light adds energy, not atoms. The energy is transferred to chemical energy stored in glucose.',['Energy, not atoms','Stored in glucose'])],
          ['Why is it never “light → glucose”?','Use the atom counts to explain why “glucose is made from light” is wrong.',S('Atoms are conserved','Every atom in glucose came from CO₂ or H₂O. Light has no atoms, so it cannot become glucose; it supplies energy.',['All atoms from CO₂ and H₂O','Light supplies energy'])]
        ]
      }}),

      p('balance','Input','model','Balance the equation','equation',{nav:'Balance it · 2.19',mins:5,diagram:'balance',secondaryDiagram:true,caption:'Count each kind of atom on both sides.',
        steps:[
          'Word equation: carbon dioxide + water → glucose + oxygen. <strong>Light</strong> and <strong>chlorophyll</strong> go by the arrow: conditions, not reactants.',
          'Formulae: CO₂ + H₂O → C₆H₁₂O₆ + O₂. Not yet balanced.',
          'Count atoms. Left: C 1, H 2, O 3. Right: C 6, H 12, O 8.',
          'Balance with numbers in front: <strong>6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂</strong>.',
          '<strong>Your turn:</strong> to make 2 glucose, how many CO₂ and H₂O are used, and how many O₂ are released? [3]'
        ],
        doThis:['Copy both equations into your book.','Answer the your-turn question.'],
      support:{
        start:[
          ['Draw the arrow first','Write the arrow. Write “light” above it and “chlorophyll” below it. Then add the reactants on the left and products on the right.',S('Word equation','carbon dioxide + water → glucose + oxygen, with light above the arrow and chlorophyll below.',['Conditions by the arrow','Two reactants, two products'])],
          ['Count with tally marks','Under each formula, draw a tally for each C, H and O. Compare the tallies on each side.',S('Tallies','Left: C 1, H 2, O 3. Right: C 6, H 12, O 8. They do not match yet.',['Tallies for both sides','Mismatch spotted'])]
        ],
        understand:[
          ['Carbon first','Glucose has 6 C. How many CO₂ are needed? Then balance H with water, and O last with O₂.',S('Order of balancing','6 CO₂ for 6 C. 6 H₂O for 12 H. Then 18 O on the left needs 6 O₂ on the right.',['Carbon first','Oxygen last'])],
          ['Balance it unaided','Close this panel. Write the balanced symbol equation from memory. Count every atom to check it.',S('Balanced','6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂. C 6 = 6; H 12 = 12; O 18 = 18.',['Correct formulae','All three counts equal'])]
        ],
        hot:[
          ['Why not change the formula?','A pupil “balances” by writing H₂O₆. Explain why this is wrong.',S('A different substance','H₂O₆ is not water. Changing a formula changes the substance. Only the numbers in front can change.',['Formula sets the substance','Change coefficients only'])],
          ['Three glucose molecules','A leaf makes 3 glucose molecules. How many CO₂ does it absorb? How many O₂ does it release?',S('Scale by 3','18 CO₂ and 18 H₂O are used; 18 O₂ are released.',['18 CO₂','18 O₂'])]
        ]
      }}),

      p('chloroplast','Input','content','Inside the chloroplast','process',{nav:'Energy transfer · 2.18',mins:3,diagram:'chloroplastFlow',secondaryDiagram:true,caption:'Series diagram: a palisade cell and one chloroplast. Schematic.',
        items:[
          '<strong>Chlorophyll</strong> in chloroplasts absorbs light.',
          'Light energy is <strong>transferred</strong> to chemical energy in glucose.',
          '<strong>Why it matters:</strong> it feeds food chains, releases O₂ and removes CO₂.'
        ],
        ladder:[['Secure','Names inputs and outputs.'],['Strong','Light → chemical energy.'],['Grade 8–9','Links to food chains and air.']],
        doThis:['Draw the chloroplast with five labelled, coloured arrows.'],
      support:{
        start:[
          ['In and out','Make two lists. In: light, carbon dioxide, water. Out: glucose, oxygen. Then draw one arrow for each.',S('Five arrows','In: light energy, CO₂, water. Out: glucose and O₂.',['Three in','Two out'])],
          ['Sentence stem','Complete: “Chlorophyll absorbs ___ energy. It is transferred to ___ energy stored in ___.”',S('Completed','Chlorophyll absorbs light energy. It is transferred to chemical energy stored in glucose.',['Light','Chemical, in glucose'])]
        ],
        understand:[
          ['Why green?','Leaves look green. Use what chlorophyll absorbs to explain why.',S('Green is reflected','Chlorophyll absorbs mostly red and blue light. Green light is mainly reflected, so leaves look green.',['Absorbs red and blue','Reflects green'])],
          ['Why it matters, unaided','Close this panel. Explain why photosynthesis matters for animals, in two sentences. Then check.',S('Why it matters','Photosynthesis makes the glucose that starts food chains, so energy passes to animals. It also releases the oxygen they need.',['Food chains','Oxygen released'])]
        ],
        hot:[
          ['Is chlorophyll used up?','A pupil says chlorophyll is used up in photosynthesis. Use the equation to argue against this.',S('Not a reactant','Chlorophyll is written by the arrow, not as a reactant. It absorbs light and can be used again.',['By the arrow, not a reactant','Reused'])],
          ['Plants as producers','Explain why almost all the energy in a lion’s muscles first entered the food chain as light.',S('Energy route','Plants transfer light energy to chemical energy in glucose. Herbivores eat plants and the lion eats herbivores, so energy passes along the chain.',['Light → glucose in plants','Passed along the chain'])]
        ]
      }}),

      p('glucose-uses','Input','table','What the plant does with glucose','process',{nav:'Uses of glucose',mins:3,reveal:true,columns:['Use','Why the plant needs it','Coming up'],rows:[
        ['Respiration','Releases energy for growth and other cell processes','Respiration topic'],
        ['Starch (storage)','Insoluble, so it does not affect osmosis','L5 starch test'],
        ['Sucrose (transport)','Soluble sugar carried around the plant','Transport in plants'],
        ['Cellulose','Builds cell walls for new cells','Recap: cells unit'],
        ['Amino acids → proteins','Glucose plus nitrate ions from the soil','L5 mineral ions'],
        ['Oils','Energy store in seeds','Recap: lipids']
      ],doThis:['Copy the three headings.','Fill each row as it appears.'],
      support:{
        start:[
          ['Store, build or use?','Sort the six uses into three groups: store it, build with it, use it for energy. Write one word beside each row.',S('Three groups','Store: starch, oils. Build: cellulose, proteins. Use: respiration. Sucrose moves sugar around.',['Starch and oils stored','Respiration uses it'])],
          ['One row in your words','Choose the starch row. Complete: “Glucose is stored as ___ because it is ___.”',S('Starch','Glucose is stored as starch because it is insoluble.',['Starch','Insoluble'])]
        ],
        understand:[
          ['The extra ingredient','Which use needs something from the soil as well as glucose? Name it.',S('Nitrate ions','Making amino acids, and so proteins, needs nitrate ions from the soil.',['Amino acids or proteins','Nitrate ions'])],
          ['Table from memory','Close this panel and cover the table. Write four uses of glucose. Then check.',S('Recalled','Any four: respiration, starch, sucrose, cellulose, amino acids and proteins, oils.',['Four correct uses'])]
        ],
        hot:[
          ['Why not store glucose?','Glucose is soluble. Explain why storing it as glucose would upset water movement in a cell.',S('Osmosis','Dissolved glucose makes the cell contents more concentrated, so water would enter by osmosis. Insoluble starch does not affect osmosis.',['Glucose soluble','Water enters by osmosis'])],
          ['Mass from sugar','Explain how glucose made in a leaf becomes part of a new root cell.',S('Transport and build','Glucose is converted to sucrose and transported to the root. There it is used to make cellulose for new cell walls.',['Sucrose for transport','Cellulose built in the root'])]
        ]
      }}),

      p('photo-hinge','Assess','hinge','Which statement is correct?','process',{nav:'Photosynthesis hinge',mins:3,secure:true,options:[
        'Light is turned into glucose.',
        'Light energy is transferred to chemical energy in glucose made from CO₂ and water.',
        'The plant absorbs ready-made food from the soil.',
        'Chlorophyll is used up to make glucose.'
      ],correct:1,task:'Hold up A, B, C or D. Then explain one wrong option.'}),

      /* ---------- Explain the evidence ---------- */
      p('exam-model','Input','model','<strong>Explain</strong> why a seedling’s dry mass increases in the light [3]','evidence',{nav:'Modelled 3-mark answer',mins:4,label:'Original exam-style question · 3 marks',diagram:'examModel',secondaryDiagram:true,caption:'Writing frame. Schematic.',
        steps:[
          'Read the command. <strong>Explain</strong> means give reasons. 3 marks means three linked points.',
          '“In the light, the seedling photosynthesises and takes in CO₂ from the air.” [1]',
          '“Light energy is used to make glucose from carbon dioxide and water.” [1]',
          'Rejected: “It gets its food from the soil.” Soil supplies water and a tiny mass of mineral ions, not food; the plant makes its own food by photosynthesis.',
          '“Glucose is converted to starch and cellulose, which build new cells, so the dry mass increases.” [1]'
        ],
        doThis:['Copy each creditworthy line and tick each mark.'],
      support:{
        start:[
          ['Three boxes, one chain','Draw three boxes joined by arrows: Takes in → Makes → Builds. Write two or three words in each before you write sentences.',S('A chain plan','Takes in CO₂ → makes glucose with light energy → builds starch and cellulose in new cells.',['Three linked boxes','Ends with new cells'])],
          ['Start each line with the plant','Begin each sentence with “The seedling…” and one verb: takes in, makes, converts.',S('Three sentences','The seedling takes in CO₂. The seedling makes glucose using light energy. The seedling converts glucose into cellulose for new cells.',['Plant as subject','One verb each'])]
        ],
        understand:[
          ['Why is the soil line rejected?','Explain in one sentence why “it gets its food from the soil” earns no mark.',S('Soil is not food','Soil supplies water and a tiny mass of mineral ions, not food; the plant makes its own food by photosynthesis.',['Mineral ions only','Plant makes food'])],
          ['Write it unaided','Close this panel and cover the screen. Write the 3-mark answer from memory. Then tick against the steps.',S('Independent','Takes in CO₂ in the light; light energy makes glucose from CO₂ and water; glucose becomes starch and cellulose, increasing dry mass.',['Three linked points','No soil-food idea'])]
        ],
        hot:[
          ['Why dry mass?','Why does the question say dry mass, not fresh mass?',S('Water varies','Fresh mass changes with how much water the seedling holds. Dry mass measures only the new material made.',['Water content varies','Dry mass shows new material'])],
          ['In the dark','Predict what happens to the seedling’s dry mass in the dark for a week. Explain.',S('It falls','No light, so no photosynthesis and no new glucose. Respiration still uses up stored sugars, so dry mass falls.',['No photosynthesis','Respiration uses stores'])]
        ]
      }}),

      p('exam-independent','Assess','content','Equations and the dark plant [7]','evidence',{nav:'Independent 7-mark question',mins:8,timer:6,secure:true,label:'Original exam-style question · 7 marks',
        items:[
          '(a) Write the <strong>word equation</strong>. [2]',
          '(b) Write the <strong>balanced symbol equation</strong>. [2]',
          '(c) A geranium was kept in the dark for 48 hours, then a leaf was tested with iodine. <strong>Predict</strong> the colour of the iodine and <strong>explain</strong> your prediction. [3]'
        ],
        doThis:['Work alone in silence until the timer ends. Then open the mark scheme, tick in green and rewrite one lost mark.']}),

      p('exit','Assess','content','Exit: three quick checks','evidence',{nav:'Exit check',mins:3,secure:true,items:[
        'In bright light a leaf takes in CO₂. Where do the carbon atoms end up? [2]',
        'What does light provide in photosynthesis: energy or atoms? [1]',
        'Name one use of glucose that also needs nitrate ions. [1]'
      ],doThis:['Answer 1–3 in your book, on your own.']})
    ]
  };
})();
