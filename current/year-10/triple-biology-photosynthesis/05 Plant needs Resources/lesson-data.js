/* Lesson 5 · How do we know what a plant needs? · Year 10 Triple Biology (Pearson 4XBI1 2.22; 2.23 starch and the requirements of
   light, CO₂ and chlorophyll; 2.23 oxygen evolution retrieved from Lesson 2).
   Pupil-facing content only. The starch-test evidence is SECONDARY DATA: every iodine-stained leaf is an original schematic diagram
   labelled "Results from a starch test" (no live test or demonstration in this lesson). Mineral-ion plants and the hydroponics data are
   illustrative data in a hypothetical scenario. Every widget prompt carries its own review as the third element. */
(() => {
  const m=(heading,text)=>({heading,text});
  const c=(heading,items)=>({heading,items});
  const A=(models,criteria,marks=null)=>({models,criteria,marks});
  const K=(heading,text,items)=>A([m(heading,text)],[c('Success criteria',items)]);
  const p=(id,family,type,title,topic,extra={})=>({id,family,type,title,topic,...extra});

  const support={
    starch:{
      start:[
        ['Two piles first','Sort the cards into two piles: before the leaf is picked, and after. Then put each pile in order.',K('Two piles','Before: C, the plant in the dark. After: B boil, E ethanol, D rinse, F tile, A iodine.',['C is first.','A is last.'])],
        ['Why-word bank','Match each card to one reason: uses up old starch · kills the cells · removes chlorophyll · softens the leaf · shows starch.',K('Matched','C uses up old starch. B kills the cells. E removes chlorophyll. D softens the leaf. A shows starch.',['Five matches.','One reason per card.'])]
      ],
      understand:[
        ['Why a water bath?','Explain why the ethanol is warmed in a beaker of hot water and never over a Bunsen flame.',K('Highly flammable','Ethanol is highly flammable, so a flame could set it alight. Hot water from a kettle warms it with no flame.',['Highly flammable.','No naked flame.'])],
        ['Skip a step','Close this panel. A pupil skips the ethanol step. Predict what they see after adding iodine, and explain why.',K('Green hides the colour','The leaf is still green, so the iodine colour is hard to see. The chlorophyll was not removed.',['Colour hard to see.','Chlorophyll still there.'])]
      ],
      hot:[
        ['Why boil first?','Boiling denatures the enzymes in the leaf. Suggest why it matters that reactions stop before the leaf is tested.',K('Starch stays as it was','Enzymes could keep breaking starch down. Stopping them keeps the starch as it was when the leaf was picked.',['Enzymes stop.','Starch amount fixed.'])],
        ['Is 48 hours enough?','How could you check that a plant really has been destarched before an experiment starts?',K('Test a leaf first','Test one leaf at the start. It should stay orange-brown. If it turns blue-black, keep the plant in the dark for longer.',['Test a leaf first.','Orange-brown = destarched.'])]
      ]
    },
    foil:{
      start:[
        ['Find the difference','Look at the two parts of the leaf. Write the one thing that was different for them during the 24 hours.',K('Only light','The covered strip got no light. The rest of the leaf got light. Everything else was the same.',['Light.','Everything else the same.'])],
        ['Colour code','Write what each colour means. Blue-black = ___. Orange-brown = ___.',K('Key','Blue-black = starch is there. Orange-brown = no starch (the colour of the iodine).',['Blue-black: starch.','Orange-brown: none.'])]
      ],
      understand:[
        ['Weak or strong?','Which is the strongest support? “The strip looks different.” · “Only the part without light has no starch.” · “It is the same plant.”',K('Strongest support','“Only the part without light has no starch.” It names the evidence and the one difference.',['Picks the second.','Says why.'])],
        ['Claim from memory','Close this panel. Write the claim and the strong support for the foil-strip leaf.',K('Claim and support','Claim: light is needed for photosynthesis. Support: only the covered strip had no starch; light was the only difference.',['Light needed.','Covered part: no starch.'])]
      ],
      hot:[
        ['No destarching?','Explain why the foil-strip result would mean nothing if the plant had not been destarched first.',K('Old starch','Starch made before the foil went on would still be there. The strip could be blue-black without light, so you could not tell.',['Old starch.','Cannot tell.'])],
        ['Starch, not glucose','Grade 8–9: the test finds starch, not photosynthesis. Explain why new starch is still good evidence of photosynthesis.',K('Glucose becomes starch','Glucose made by photosynthesis is turned into starch for storage. In a destarched leaf, new starch means new glucose was made.',['Glucose → starch.','Destarched, so new.'])]
      ]
    },
    guided:{
      start:[
        ['Green v white','Point to the green parts and the white parts. Which part has chlorophyll? Which part turned blue-black?',K('Match them','The green part has chlorophyll. The green part turned blue-black. The white edge stayed orange-brown.',['Green = chlorophyll.','Green = blue-black.'])],
        ['What soda lime does','Soda lime absorbs carbon dioxide. Which leaf has no CO₂? Which leaf is the control?',K('Two bags','The leaf in the bag with soda lime has no CO₂. The leaf in the bag without soda lime is the control.',['Soda-lime bag: no CO₂.','Other bag: control.'])]
      ],
      understand:[
        ['Fill the frame','Complete: Claim: ___ is needed for photosynthesis. Support: only the ___ parts made starch; same leaf, same light.',K('Frame filled','Claim: chlorophyll is needed for photosynthesis. Support: only the green parts, which have chlorophyll, made starch.',['Chlorophyll.','Green parts only.'])],
        ['Soda lime alone','Close this panel. Write a claim and support for the soda-lime leaf.',K('CO₂ needed','Claim: carbon dioxide is needed. Support: the leaf with soda lime had no starch; the control leaf had starch.',['CO₂ needed.','Compares with the control.'])]
      ],
      hot:[
        ['Why a control bag?','Explain why the second leaf is sealed in a bag without soda lime, not just left in the open air.',K('Only one difference','A bag could change the leaf’s temperature or humidity. With a bag on both leaves, the only difference is CO₂.',['Bag on both.','Only CO₂ differs.'])],
        ['Soda lime and water','Grade 8–9: soda lime also absorbs some water vapour. Explain how this could weaken the conclusion.',K('Two differences?','The air in the bag is also drier, so two things may differ. The leaf still gets water from the roots, so the effect is small.',['Air drier too.','Water still from roots.'])]
      ]
    },
    minerals:{
      start:[
        ['Ion to job','Match each ion to its job. Magnesium · nitrate → chlorophyll · amino acids.',K('Matched','Magnesium → chlorophyll. Nitrate → amino acids, then proteins.',['Mg: chlorophyll.','Nitrate: amino acids.'])],
        ['Chain stem','Complete: no magnesium → less ___ → less light ___ → less photosynthesis → less ___ → less growth.',K('Chain','No magnesium → less chlorophyll → less light absorbed → less photosynthesis → less glucose → less growth.',['Chlorophyll.','Absorbed.','Glucose.'])]
      ],
      understand:[
        ['Why yellow?','Explain why the leaves look yellow when a plant has no magnesium.',K('Less green pigment','Without magnesium the plant cannot make enough chlorophyll, the green pigment. So the leaves look yellow.',['Less chlorophyll.','Chlorophyll is green.'])],
        ['Nitrate chain alone','Close this panel. Write the chain for a plant with no nitrate, from the ion to its growth.',K('Nitrate chain','No nitrate → cannot make amino acids → cannot make proteins → fewer new cells → poor growth.',['Amino acids.','Proteins.','Growth.'])]
      ],
      hot:[
        ['Fix the unfair test','The sunny window v dark cupboard test is not fair. Redesign it so it tests only magnesium.',K('One difference','Put both plants in the same place, with the same light, temperature and time. Only the solution differs: complete v no magnesium.',['Same place.','Only Mg differs.'])],
        ['Glucose plus nitrate','Grade 8–9: plants make amino acids from glucose and nitrate. Explain why a plant with no magnesium may also make less protein.',K('A linked shortage','Less chlorophyll means less photosynthesis, so less glucose. Less glucose can be combined with nitrate, so fewer amino acids and proteins are made.',['Less glucose.','Fewer amino acids.'])]
      ]
    }
  };

  window.LESSON={
    number:5,unit:'Photosynthesis and plant gas exchange',unitLesson:5,spec:'Pearson 4XBI1',
    title:'How do we know what a plant needs?',
    question:'How do we know what a plant needs?',
    path:['Read the starch test','Reason from the evidence','Explain the mineral ions'],
    outcomes:[
      ['Describe the starch test and explain why each step is done.','2.23 · practical (production of starch)'],
      ['Use starch-test results to show that light, carbon dioxide and chlorophyll are needed for photosynthesis.','2.23 · practical (requirements)'],
      ['Explain why plants need magnesium ions and nitrate ions for growth.','2.22']
    ],
    vocabulary:[
      ['Destarch','Keep a plant in the dark for about 48 hours so it uses up its starch.'],
      ['Starch test','Boil the leaf, warm it in ethanol, rinse it, then add iodine solution.'],
      ['Iodine solution','Orange-brown. Turns blue-black when starch is there.'],
      ['Ethanol','Removes chlorophyll from the leaf. Highly flammable: heat in a hot water bath, never with a flame.'],
      ['Variegated leaf','A leaf with green parts (chlorophyll) and white parts (no chlorophyll).'],
      ['Soda lime','A solid that absorbs carbon dioxide from the air.'],
      ['Control','The same set-up without the change, so you can compare.'],
      ['Claim','What you think the evidence shows.'],
      ['Support','The evidence that backs up the claim.'],
      ['Mineral ion','A dissolved ion a plant takes in from the soil or water, e.g. magnesium, nitrate.'],
      ['Magnesium ion','Needed to make chlorophyll.'],
      ['Nitrate ion','Needed to make amino acids, and so proteins.'],
      ['Hydroponics','Growing plants with their roots in a nutrient solution, without soil.'],
      ['Illustrative data','Numbers made up to show a typical pattern, not measured.']
    ],
    resourcePages:[
      {heading:'Ready to learn',text:'Write everything in your book. Use a green pen to improve your work.',items:['Book, pen, green pen','Mini whiteboard and pen','ABCD cards or fingers for the hinge']},
      {heading:'Exam-style questions',text:'The lesson’s exam question, the starch test in full and homework practice.',href:'05%20Plant%20needs%20Resources/Exam-style%20questions.html',linkLabel:'Open the question sheet'}
    ],
    modelPages:[
      {heading:'The starch test',text:'Sort the cards, then each step and why.',action:{id:'starch-test',label:'Open the starch test'}},
      {heading:'Foil-strip leaf',text:'Claim, support, question.',action:{id:'foil-model',label:'Open the worked example'}},
      {heading:'Variegated and soda-lime leaves',text:'Your turn with the evidence.',action:{id:'guided-evidence',label:'Open the evidence'}},
      {heading:'Magnesium and nitrate',text:'Plants grown without one ion.',action:{id:'minerals',label:'Open the mineral ions'}}
    ],
    checkPages:[
      {heading:'Hinge',text:'What does the variegated leaf show?',action:{id:'hinge',label:'Open the hinge'}},
      {heading:'Exam question',text:'A UAE hydroponic farm [9].',action:{id:'exam-independent',label:'Open the exam question'}},
      {heading:'Exit ticket',text:'Why does a plant lacking magnesium grow less? [3]',action:{id:'exit',label:'Open the exit ticket'}}
    ],
    ai:{
      starch:{
        prompt:'Explain why the leaf is warmed in ethanol during the starch test.',
        claim:'Iodine stains chlorophyll blue-black.',
        checks:['Which step removes chlorophyll?','What does blue-black show?','Rewrite the claim correctly.'],
        answer:K('Iodine shows starch','False. Ethanol removes the chlorophyll before iodine is added. Iodine turns blue-black with starch and stays orange-brown without it.',['Rejects the claim.','Ethanol removes chlorophyll.','Blue-black = starch.'])
      },
      evidence:{
        prompt:'Explain what the variegated leaf shows.',
        claim:'The variegated leaf proves light is needed.',
        checks:['What differs: green v white?','Did the light differ?','Rewrite the claim.'],
        answer:K('It tests chlorophyll','False. Light was the same on the whole leaf. Only the green parts, with chlorophyll, made starch.',['Rejects the claim.','Light was the same.','Chlorophyll needed.'])
      },
      minerals:{
        prompt:'Explain why plants need magnesium ions.',
        claim:'Magnesium makes proteins, so plants grow.',
        checks:['What is magnesium needed to make?','Which ion is needed for amino acids?','Rewrite the claim correctly.'],
        answer:K('Ions mixed up','False. Magnesium is needed to make chlorophyll. Nitrate is needed to make amino acids, which make proteins.',['Rejects the claim.','Mg: chlorophyll.','Nitrate: amino acids.'])
      }
    },
    uae:{
      label:'Hydroponic farming',
      pages:[
        {heading:'Food Security Strategy 2051',text:'Its aims include leading the Global Food Security Index by 2051, enhancing local production and using modern technologies for sustainable food production.',source:'https://u.ae/en/about-the-uae/strategies-initiatives-and-awards/strategies-plans-and-visions/environment-and-energy/national-food-security-strategy-2051',sourceLabel:'Read the strategy on u.ae',note:'Official UAE Government source · checked 3 Nov 2026'},
        {heading:'Mix the solution',text:'A Dubai farm grows lettuce in water, with no soil. Explain why the grower must add magnesium and nitrate ions to the water.',note:'Hypothetical scenario',answer:A([m('Magnesium','Needed to make chlorophyll. Without it the leaves turn yellow, less light is absorbed and photosynthesis falls.'),m('Nitrate','Needed to make amino acids, then proteins, so without it growth is poor. With no soil, the water is the only supply.')],[c('Success criteria',['Mg: chlorophyll.','Nitrate: amino acids.','No soil to supply them.'])])},
        {heading:'One yellow tank',text:'One tank of lettuce has yellow leaves; the others are green. Light and temperature are the same. Suggest which ion is short, and how to check.',note:'Hypothetical scenario',answer:A([m('Magnesium','Yellow leaves suggest too little chlorophyll, so magnesium ions are probably short.'),m('Check fairly','Split the plants: add magnesium to one group only, keep everything else the same, and compare leaf colour and growth.')],[c('Success criteria',['Names magnesium.','Links to chlorophyll.','One change only.'])])},
        {heading:'Starch at sunset',text:'At the end of a sunny day the grower tests a leaf from a complete tank and a no-magnesium tank for starch. Predict which has less starch. Explain.',note:'Hypothetical scenario',answer:A([m('No-magnesium leaf','Less chlorophyll, so less light is absorbed and less photosynthesis happens.'),m('Less to store','Less glucose is made, so less is turned into starch. The iodine colour is less blue-black.')],[c('Success criteria',['No-Mg leaf has less.','Less photosynthesis.','Less glucose → starch.'])])}
      ]
    },
    phases:[
      p('title','Title','title','How do we know what a plant needs?','starch'),
      p('outcomes','Learning outcome','outcome','What will you be able to do?','starch',{nav:'Learning outcomes',mins:1}),
      p('do-now','Do now','content','Retrieve Lessons 1–4','starch',{nav:'Do now',mins:4,lead:'From memory. No notes.',items:['<strong>1</strong> In bright light, does a leaf take in or give out CO₂ overall? Why?','<strong>2</strong> How does CO₂ get from the air to a palisade cell?','<strong>3</strong> Name two things a plant makes from glucose.','<strong>4</strong> Pondweed lab: which gas did the plant give off, and how did we measure it?'],doThis:['Write 1–4 in your book.','Mark in green when answers are shown.']}),
      p('starch-test','Thinking','model','How do we test a leaf for starch?','starch',{nav:'Starch test',mins:4,diagram:'starchSteps',caption:'Schematic step-by-step diagrams. Not to scale.',support:support.starch,steps:['<strong>Sort:</strong> write cards A–F in order. Add “because” for each.','<strong>C · Destarch:</strong> plant in the dark about 48 hours. It uses up its starch, so any starch later is new.','<strong>B · Boil the leaf in water</strong> about 1 minute. This kills the cells and stops reactions.','<strong>E · Warm in ethanol</strong> in a hot water bath. Removes chlorophyll. <strong>No flames:</strong> ethanol is highly flammable.','<strong>D · Rinse in warm water:</strong> softens the brittle leaf.','<strong>F, A · White tile, then iodine.</strong> Blue-black = starch. Orange-brown = no starch.'],doThis:['Write the order and one “because” each. Correct in green.']}),
      p('foil-model','Input','model','What does the foil-strip leaf show?','evidence',{nav:'Worked example: foil leaf',mins:5,label:'Worked example · claim, support, question',diagram:'foilLeaf',caption:'Results from a starch test: schematic diagram, not a photograph.',support:support.foil,steps:['<strong>Set-up:</strong> destarched plant. Foil strip across one leaf, both sides. 24 hours in bright light.','<strong>Result:</strong> the covered strip is orange-brown. The rest is blue-black.','<strong>Claim:</strong> light is needed for photosynthesis.','<strong>Support:</strong> weak v strong. Strong names the evidence and the one difference: light.','<strong>Question:</strong> “the foil killed the leaf”? Reject it: retest after 24 h without foil.'],doThis:['Draw three columns: Claim · Support · Question. Copy the model.','Write why the weak support is weak.']}),
      p('guided-evidence','Thinking','model','Your turn: two more leaves','evidence',{nav:'Your turn: evidence',mins:8,diagram:'guidedEvidence',caption:'Results from a starch test: schematic diagrams, not photographs.',support:support.guided,steps:['<strong>Variegated leaf:</strong> only the green parts have chlorophyll. Look at the results.','<strong>Frame:</strong> Claim: ___ is needed. Support: only the ___ parts made starch; same leaf, same light. Question: what else differs?','<strong>Soda-lime bag:</strong> soda lime absorbs CO₂. The second bag has none: it is the control.','<strong>No frame now:</strong> write your own Claim, Support and Question.'],doThis:['Variegated: fill the frame in your book.','Soda lime: Claim, Support, Question, with no frame.']}),
      p('hinge','Assess','hinge','What does the variegated leaf show?','evidence',{nav:'Hinge: variegated leaf',mins:2,secure:true,lead:'A variegated leaf was left in bright light, then tested for starch. Only the green parts turned blue-black.',options:['Chlorophyll is needed for photosynthesis','Light is needed for photosynthesis','The white parts have no cells','The green parts absorb iodine better'],correct:0,task:'Hold up one letter. Then write one sentence of evidence for it.'}),
      p('recheck','Assess','content','Recheck: a leaf with a foil window','evidence',{nav:'Recheck',label:'Recheck · 2 marks',mins:1,secure:true,diagram:'windowLeaf',secondaryDiagram:true,caption:'Schematic set-up. The result is not shown.',items:['A destarched leaf is covered in foil except a square window. 24 h in bright light, then the starch test.','<strong>1</strong> Predict the colour of the window and the rest. <strong>[1]</strong>','<strong>2</strong> What does this show? <strong>[1]</strong>'],doThis:['Answer on your whiteboard. No notes.']}),
      p('minerals','Thinking','model','Why magnesium and nitrate?','minerals',{nav:'Mineral ions',mins:5,diagram:'mineralPlants',caption:'Illustrative data. Schematic plants, not to scale.',support:support.minerals,steps:['<strong>Set-up:</strong> seedlings in three solutions. Everything else the same: light, temperature, volume, time.','<strong>No magnesium:</strong> yellow leaves, less growth. Mg is needed for <strong>chlorophyll</strong>, so less light is absorbed: less photosynthesis.','<strong>No nitrate:</strong> poor growth. Nitrate is needed for <strong>amino acids</strong>, then proteins, for new cells.','<strong>Not a fair test:</strong> sunny window v dark cupboard. Two things differ, so no conclusion.'],doThis:['Write for each ion: ion → makes → so without it… Step 4: why is it unfair?']}),
      p('exam-independent','Assess','content','A UAE hydroponic farm [9]','minerals',{nav:'Independent exam question',label:'Original exam-style question · 9 marks',mins:10,secure:true,timer:9,diagram:'hydroponicsData',secondaryDiagram:true,caption:'A grower’s lettuce seedlings, three nutrient solutions, 4 weeks.',items:['<strong>(a)</strong> Give the independent variable. <strong>[1]</strong>','<strong>(b)</strong> Give two variables to keep the same. <strong>[2]</strong>','<strong>(c)</strong> <strong>Explain</strong> the results with no magnesium. <strong>[3]</strong>','<strong>(d)</strong> <strong>Explain</strong> the results with no nitrate. <strong>[3]</strong>'],doThis:['Work alone for 9 minutes, in full sentences.']}),
      p('improve','Assess','content','Mark it, then improve it in green','minerals',{nav:'Self-mark and improve',label:'Self-mark · green pen',mins:4,secure:true,items:['Open the mark scheme. Tick each point you made.','Write your mark out of 9.','Find one missing link in (c) or (d): ion → substance → photosynthesis or growth.','Rewrite that answer in green pen.'],doThis:['Improve one answer in green pen.']}),
      p('exit','Assess','content','Exit: one question, no notes','minerals',{nav:'Exit ticket',label:'Exit ticket · 3 marks',mins:3,secure:true,items:['A plant is grown in a solution with no magnesium ions. <strong>Explain</strong> why it grows less than a plant given magnesium. <strong>[3]</strong>'],doThis:['Answer alone, without notes, on your exit slip or in your book.']})
    ]
  };
})();
