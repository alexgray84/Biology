/* Lesson 2 · Enzymes, temperature and pH · Year 10 Triple Biology (Pearson 4XBI1 2.10–2.14B, 2.29 introduced).
   Pupil-facing content only. Synthetic/illustrative data. Every widget prompt carries its own review as the third element. */
(() => {
  const m=(heading,text)=>({heading,text});
  const c=(heading,items)=>({heading,items});
  const A=(models,criteria,marks=null)=>({models,criteria,marks});
  const S=(heading,text,items)=>A([m(heading,text)],[c('What a successful response includes',items)]);
  const K=(heading,text,items)=>A([m(heading,text)],[c('Success criteria',items)]); /* same as S with a one-line heading so drawer pages fit */
  const p=(id,family,type,title,topic,extra={})=>({id,family,type,title,topic,...extra});

  const support={
    catalyst:{
      start:[
        ['Pre-teach: catalyst','A catalyst speeds up a reaction and is not used up. Say it to a partner: “A catalyst ___ a reaction and is not ___.” Then write it in your book.',K('Catalyst stem','A catalyst speeds up a reaction and is not used up or permanently changed.',['Speeds up the reaction.','Not used up.'])],
        ['Enzyme stem','Use the diagram. Point to the enzyme. Complete: “An enzyme is a biological catalyst. It is a ___ made by ___.”',K('Enzyme stem completed','An enzyme is a biological catalyst. It is a protein made by cells.',['Names protein.','Names cells.'])]
      ],
      understand:[
        ['Break down or build up?','Sort these: starch → maltose; glucose → glycogen; protein → amino acids; glucose → starch. Write B (breakdown) or U (build-up) beside each.',K('Sorted reactions','Breakdown: starch → maltose; protein → amino acids. Build-up: glucose → glycogen; glucose → starch.',['Two breakdowns correct.','Two build-ups correct.'])],
        ['Define an enzyme unaided','Close this panel. Write a definition of an enzyme that uses three terms: catalyst, protein, metabolic reactions. Check it against the screen.',K('Full definition','Enzymes are proteins that act as biological catalysts. They speed up metabolic reactions without being used up.',['Protein; biological catalyst.','Metabolic reactions.','Not used up.'])]
      ],
      hot:[
        ['Why not just run hotter?','Heat speeds up reactions. Explain why the body uses enzymes rather than a much higher body temperature to make its reactions fast enough.',K('Enzymes avoid harmful heat','Much higher temperatures would denature the body’s proteins and damage cells. Enzymes make reactions fast enough at about 37 °C.',['Heat denatures proteins.','Enzymes work at 37 °C.'])],
        ['Catalyst or reactant?','Glucose is used up when glycogen forms; the enzyme is not. Use this to explain the difference between a substrate and a catalyst.',K('Substrate versus catalyst','The substrate, glucose, becomes the product, glycogen, so it is used up. The enzyme is unchanged and reused: a catalyst.',['Substrate becomes product.','Enzyme unchanged, reused.'])]
      ]
    },
    activeSite:{
      start:[
        ['Four stages, four words','Match each model step to one word: approach · complex · products · reused. Write the four words in a row with arrows between them.',K('Four-stage strip','Approach → enzyme–substrate complex → products released → enzyme reused.',['Four stages in order.','Arrows between them.'])],
        ['Lock-and-key stem','Complete: “The substrate fits the ___ like a key fits a ___. Their shapes are ___.”',K('Lock and key completed','The substrate fits the active site like a key fits a lock. Their shapes are complementary.',['Active site = lock.','Uses “complementary”.'])]
      ],
      understand:[
        ['Complementary, not identical','“Complementary” means two shapes fit together, like a jigsaw piece and its gap. Explain why “the same shape” is the wrong phrase.',K('Why complementary','The shapes fit together, like a piece and its gap. Two identical shapes could not slot into each other.',['Explains fit, not sameness.'])],
        ['Draw the complex unaided','Close the panel. Without the model, draw an enzyme–substrate complex. Label: enzyme, active site, substrate.',K('Labelled complex','The substrate sits inside the active site, a pocket in the enzyme. All three parts are labelled.',['Substrate inside the pocket.','Three correct labels.'])]
      ],
      hot:[
        ['Why reuse matters','One enzyme molecule can catalyse thousands of reactions each second. Use the model to explain how, and why cells need only small amounts of each enzyme.',K('Reuse explains small amounts','Products leave; the active site is unchanged and binds another substrate. Each enzyme works again and again, so little is needed.',['Active site free again.','Reused, so small amounts.'])],
        ['Limit of the lock and key','The model shows a rigid lock and key moving in a straight line. Suggest two ways real molecules differ from this model.',K('Models simplify','A real enzyme can flex slightly as the substrate binds. Real molecules move randomly and meet by collision.',['One shape simplification.','One movement simplification.'])]
      ]
    },
    specificity:{
      start:[
        ['Try both shapes','Press Complementary, then Try it. Press Different shape, then Try it. Each time say: “It fits” or “It does not fit.”',K('What the model showed','The complementary substrate fits and forms a complex. The different substrate does not fit, so there is no reaction.',['Complementary fits.','Different: no reaction.'])],
        ['Specificity stem','Complete: “An enzyme is specific because only a substrate with a ___ shape can bind to its ___.”',K('Specificity stem completed','An enzyme is specific because only a substrate with a complementary shape can bind to its active site.',['Complementary.','Active site.'])]
      ],
      understand:[
        ['One enzyme, one substrate','Amylase breaks down starch but not protein. Use “active site” and “complementary” to explain why.',K('Amylase is specific','Amylase’s active site is complementary to starch, so starch binds. Protein has a different shape, so it cannot bind.',['Starch complementary.','Protein cannot bind.'])],
        ['Explain the bounce unaided','Close this panel. Write two sentences: why the different substrate bounced off, and what this means for the reaction.',K('Specificity unaided','Its shape is not complementary to the active site, so it cannot bind. No complex forms, so it is not broken down.',['Not complementary.','No complex, no reaction.'])]
      ],
      hot:[
        ['Why so many enzymes?','A cell carries out thousands of different reactions. Use specificity to explain why it must make thousands of different enzymes.',K('Specificity needs many enzymes','Each active site fits one substrate, so each enzyme catalyses one reaction. Every different reaction needs its own enzyme.',['One shape, one substrate.','One enzyme per reaction.'])],
        ['Sequence decides shape','Link Monday to today. Explain how the order of amino acids decides which substrate fits an enzyme.',K('Sequence → shape → fit','Amino-acid order decides how the chain folds. Folding makes the active-site shape. Only a complementary substrate fits.',['Order → folding.','Folding → active site.','Shape → fit.'])]
      ]
    },
    digestive:{
      start:[
        ['Name clue: -ase','Many enzyme names start with the substrate and end in -ase: amyl-ase (amylum = starch), malt-ase, lip-ase. Use this clue to fill the substrate column.',K('Using the name clue','Amylase → starch; maltase → maltose; lipase → lipids; protease → protein.',['Four substrates matched.'])],
        ['Use Monday’s building blocks','Monday: starch is made of glucose, protein of amino acids, a lipid of fatty acids and glycerol. Digestion breaks bonds between these units. Fill the products column.',K('Products from building blocks','Starch → maltose → glucose; protein → amino acids; lipids → fatty acids and glycerol.',['Maltose from amylase.','Lipase: two products.'])]
      ],
      understand:[
        ['Two steps to glucose','Starch is not digested to glucose in one step. Write the two-step chain with the enzyme name above each arrow.',K('Starch → glucose chain','Starch —amylase→ maltose —maltase→ glucose.',['Amylase, then maltase.','Maltose in the middle.'])],
        ['Cover and recall','Cover the table. Write the four enzymes and, for each, substrate → product(s). Uncover and correct in green.',K('Four digestive reactions','Amylase: starch → maltose. Maltase: maltose → glucose. Protease: protein → amino acids. Lipase: lipids → fatty acids + glycerol.',['Four substrates.','Four sets of products.'])]
      ],
      hot:[
        ['Why digest at all?','Explain why starch and protein must be digested before the body can absorb them. Use the word “soluble”.',K('Digest to absorb','Starch and protein are large and insoluble, so cannot be absorbed. Digestion makes small, soluble molecules that can.',['Large, insoluble: not absorbed.','Small, soluble: absorbed.'])],
        ['Prove amylase worked','Design a check that amylase has digested starch. Which two food tests would you use, and what results would you expect?',K('Evidence of digestion','Iodine stays orange-brown: starch gone. Heated Benedict’s turns green to brick-red: maltose, a reducing sugar, is present.',['Iodine: no starch.','Benedict’s: sugar appears.'])]
      ]
    },
    tempModel:{
      start:[
        ['Watch the movement line','Press 10 °C, then 37 °C. Read the readout each time. Complete: “Warmer molecules move ___, so they collide ___ often.”',K('Warmer means more collisions','Warmer molecules move faster, so they collide more often. More complexes form each second.',['Faster.','More often.'])],
        ['Pre-teach: denatured','Denatured means the active site has changed shape permanently, so the substrate no longer fits. Raise the temperature slowly. Where does the readout first say the active site is changing shape?',K('Where shape change starts','Just above the optimum, at about 45 °C in this model. When fully changed, the enzyme is denatured.',['Above the optimum.','Denatured = shape changed.'])]
      ],
      understand:[
        ['Slow is not broken','At 10 °C the rate is low. Is the enzyme denatured? Warm it to 37 °C and check. Write one sentence for each temperature.',K('Cold slows; heat denatures','At 10 °C there are fewer collisions, so it is slow, not denatured. At 37 °C the rate rises again.',['Cold: not denatured.','Rate returns on warming.'])],
        ['The cool-back test alone','Close this panel. Set 65 °C, then cool to 37 °C. Explain the result using “bonds”, “active site” and “permanent”.',K('Denaturation is permanent','At 65 °C bonds broke and the active site changed shape. Cooling does not restore it, so the rate stays near zero.',['Bonds; active site.','Permanent.'])]
      ],
      hot:[
        ['Not all at once','Grade 8–9: between 45 °C and 60 °C the rate falls gradually, not instantly. Explain why, thinking about millions of enzyme molecules.',K('A growing proportion denatures','Above the optimum, an increasing proportion of enzyme molecules is denatured. Fewer active sites work, so the rate falls progressively.',['Many molecules.','Proportion denatured rises.'])],
        ['A heat-loving enzyme','Bacteria in hot springs live at about 80 °C. Predict the shape of their enzyme’s rate–temperature graph. Explain your prediction.',K('A different optimum','Same shape, but peaking near 80 °C. Its bonds hold the active-site shape until a higher temperature.',['Optimum near 80 °C.','Shape stable when hot.'])]
      ]
    },
    tempGraph:{
      start:[
        ['Three regions, three words','Write three labels on your sketch: “rising”, “optimum”, “falling”. Under each, write one cause word: collisions · fastest · denatured.',K('Labelled regions','Rising: collisions. Optimum: fastest, about 40 °C. Falling: denatured.',['Three labels.','A cause for each.'])],
        ['Describe before you explain','A “describe” answer says what the line does, with numbers. Complete: “The rate increases up to ___ °C, then ___.”',K('Graph description','The rate increases up to about 40 °C, then decreases to zero by about 60 °C.',['Quotes 40 °C.','Rise, then fall.'])]
      ],
      understand:[
        ['Chain for the rising part','Use this chain: more kinetic energy → faster movement → more frequent collisions → more enzyme–substrate complexes per second → higher rate. Write it as two sentences.',K('Rising part explained','Molecules gain kinetic energy and move faster. They collide more often, so more complexes form per second.',['Kinetic energy.','Collisions → complexes.'])],
        ['The falling part unaided','Close this panel. Explain why the rate falls above the optimum in three linked steps.',K('Falling part explained','Bonds break and the active site changes shape. The substrate no longer fits, so fewer complexes form: denatured.',['Shape changes.','No fit; fewer complexes.'])]
      ],
      hot:[
        ['Optimum is not a limit','A pupil writes: “The optimum is the highest temperature an enzyme can survive.” Use the graph to explain two errors.',K('Optimum means fastest','The optimum is the fastest rate, not a limit: the enzyme still works above it. Enzymes are not alive, so “survive” is wrong.',['Optimum = fastest.','Not alive.'])],
        ['Why is the curve lopsided?','The graph rises gradually but falls steeply. Explain why the two sides have different causes and shapes.',K('Two different causes','The rise comes from gradually more collisions. The fall comes from denaturation, which soon outweighs the extra collisions.',['Rise: collisions.','Fall: denaturation.'])]
      ]
    },
    ph:{
      start:[
        ['One curve at a time','Cover two curves with your hand. For amylase, find the peak and read its pH. Repeat for pepsin, then trypsin.',K('Three optima','Pepsin about pH 2; amylase about pH 7; trypsin about pH 8.',['Three optima.'])],
        ['pH sentence stem','Complete: “Away from its optimum pH, the enzyme’s ___ changes shape, so the ___ fits less well and the rate ___.”',K('pH stem completed','Away from its optimum pH, the enzyme’s active site changes shape, so the substrate fits less well and the rate falls.',['Active site.','Substrate; falls.'])]
      ],
      understand:[
        ['What a buffer does','A buffer solution keeps the pH constant. Explain why a pH investigation fails if the pH drifts during the reaction.',K('Why use buffers','If the pH drifted, the rate would change for another reason. You could not link the rate to the chosen pH.',['pH must stay fixed.','Otherwise not fair.'])],
        ['Explain pepsin unaided','Close this panel. Explain why pepsin works fast at pH 2 but hardly at all at pH 7.',K('Pepsin and pH','pH 2 is pepsin’s optimum. At pH 7 its active site changes shape, protein no longer fits, so few complexes form.',['Optimum pH 2.','Shape changes at pH 7.'])]
      ],
      hot:[
        ['Match enzyme to place','The stomach is strongly acidic; the small intestine is slightly alkaline. Explain why pepsin and trypsin suit different parts of the gut.',K('Optima match conditions','Pepsin (about pH 2) suits the acidic stomach. Trypsin (about pH 8) suits the alkaline small intestine.',['Pepsin: stomach.','Trypsin: intestine.'])],
        ['Cold versus pH','Compare slowing by low temperature with slowing by a small pH change. Explain which cause changes the active site.',K('Two causes of slowing','Cold means fewer collisions; the shape is unchanged. pH changes the active-site shape. Extreme pH denatures permanently.',['Cold: shape unchanged.','pH: shape changes.'])]
      ]
    },
    phModel:{
      start:[
        ['Watch one number','Choose Amylase. Move the slider one step at a time from pH 5 to 9. Write the pH where the rate reads highest.',K('Amylase optimum','Amylase is fastest at about pH 7. The rate falls either side.',['About pH 7.'])],
        ['Compare two enzymes','Choose Pepsin; try pH 1–5. Complete: “Pepsin’s optimum is pH ___; amylase’s is pH ___.”',K('Two optima compared','Pepsin’s optimum is about pH 2; amylase’s is about pH 7.',['Pepsin 2.','Amylase 7.'])]
      ],
      understand:[
        ['Extreme pH is different','Set a pH far from the optimum, then return to the optimum. What does the readout say? Explain why.',K('Extreme pH denatures','The enzyme is denatured. Returning to the optimum does not restore it: the change is permanent.',['Denatured.','No recovery.'])],
        ['Predict trypsin first','Close this panel. Predict trypsin’s rate at pH 8, then at pH 2. Test in the model, then explain.',K('Trypsin prediction','Fastest near pH 8. At pH 2 its active site changes shape and it is denatured: rate near zero.',['Fast at pH 8.','Near zero at pH 2.'])]
      ],
      hot:[
        ['Pepsin moves on','Food passes from the stomach into the small intestine, at about pH 8. Pepsin stops working. Use the model to explain why.',K('Pepsin in the intestine','pH 8 is far from pepsin’s optimum of about pH 2. Its active site changes shape, so protein no longer fits.',['Far from optimum.','Protein no longer fits.'])],
        ['Evaluate the pH steps','The model gives one optimum value. Explain why a real investigation might only locate the optimum between two tested pH values.',K('Resolution of pH steps','Real tests use steps such as 1 pH unit. The optimum may lie between two values. Smaller steps near the peak help.',['Steps limit resolution.','Smaller steps near peak.'])]
      ]
    },
    method:{
      start:[
        ['Kit check first','Point to each item on the diagram: water bath, tubes, thermometer, spotting tile, iodine, pipette, stopwatch. Say what each one is for.',K('Kit and purpose','Bath and thermometer: set and check temperature. Tile and iodine: starch test. Pipette: drops. Stopwatch: time.',['Every item named.','A purpose for each.'])],
        ['End-point in one sentence','Complete: “The end-point is the first well where the iodine stays ___, because all the ___ has been broken down.”',K('End-point completed','The end-point is the first well where the iodine stays orange-brown, because all the starch has been broken down.',['Orange-brown.','Starch gone.'])]
      ],
      understand:[
        ['Why wait five minutes?','Explain why the starch and amylase sit in separate tubes in the water bath before they are mixed.',K('Pre-warming both solutions','Both reach the chosen temperature first, so the reaction happens at that temperature from the start.',['Reach set temperature.','Before mixing.'])],
        ['Order the steps alone','Close this panel. Write the six steps in order from memory. Then check against the model.',K('Six steps in order','Iodine in wells → warm tubes separately → mix, start timer → sample every 30 s → stays orange-brown → repeat; mean.',['Correct order.'])]
      ],
      hot:[
        ['Design the control','Describe a control for this practical. Explain exactly what it shows.',K('Boiled-amylase control','Use boiled amylase or water. Iodine stays blue-black, so active amylase causes the starch breakdown.',['Boiled amylase or water.','Shows amylase is needed.'])],
        ['Spot the flaw','A student mixes starch and amylase first, then puts the tube in a 60 °C water bath. Explain how this affects the 60 °C result.',K('No pre-warming','Some starch is digested before the amylase reaches 60 °C and is denatured. Activity at 60 °C is overestimated.',['Reaction starts too cool.','Overestimates activity.'])]
      ]
    },
    virtual:{
      start:[
        ['Run one temperature first','Press 40 °C, then Start. Watch the wells fill. Write the time of the first well that stays orange-brown.',K('40 °C end-point','The first well that stays orange-brown is at 90 s.',['90 s.'])],
        ['Rate on a calculator','Rate = 1 ÷ time. Type 1 ÷ 90 =. Round to 2 significant figures and write the unit s⁻¹.',K('Rate at 40 °C','1 ÷ 90 = 0.0111… = 0.011 s⁻¹.',['0.011.','s⁻¹.'])]
      ],
      understand:[
        ['Build the results table','Copy the headings: Temperature / °C · End-point time / s · Rate / s⁻¹. Add rows for 20, 40 and 60 °C and fill them from the model.',K('Completed table','20 °C: 240 s, 0.0042 s⁻¹. 40 °C: 90 s, 0.011 s⁻¹. 60 °C: no end-point, rate about 0.',['Units in headings.','Three correct rows.'])],
        ['The 60 °C row alone','Close this panel. Explain why the iodine never stays orange-brown at 60 °C.',K('60 °C explained','Amylase is denatured: its active site has changed shape, so starch cannot bind. Starch remains: blue-black.',['Denatured.','Starch remains.'])]
      ],
      hot:[
        ['Is 40 °C the optimum?','Your fastest rate was at 40 °C. Explain why you cannot yet say the optimum is exactly 40 °C. What would you do next?',K('Narrow the optimum','Only 10 °C steps were tested; the optimum could be anywhere from 30 to 50 °C. Test 2 °C steps near 40 °C.',['Could lie between values.','Smaller steps; repeats.'])],
        ['Run the control','Switch on Boiled amylase and run it. Explain what this control proves.',K('What the control proves','No end-point: starch remains. So active amylase, not time or iodine, breaks down the starch.',['No end-point.','Enzyme causes breakdown.'])]
      ]
    },
    rate:{
      start:[
        ['One calculation at a time','Do 40 °C first: 1 ÷ 90. Write the full calculator answer, then round it to 2 significant figures.',K('40 °C rate','1 ÷ 90 = 0.01111… → 0.011 s⁻¹.',['0.011.','s⁻¹.'])],
        ['Picture the gap','Draw a line from 0 to 90 s with a mark every 30 s. The 60 s well was dark brown (starch); the 90 s well orange-brown. Shade where the true end-point could be.',K('Where the end-point lies','Anywhere between 60 s and 90 s: the shaded 30 s gap.',['Shades 60–90 s.'])]
      ],
      understand:[
        ['Significant figures check','Round 0.004166… to 2 significant figures. The first two non-zero digits are 4 and 1; the next digit is 6, so round up.',K('20 °C rate rounded','0.004166… → 0.0042 s⁻¹.',['0.0042.','s⁻¹.'])],
        ['Precision without the picture','Close this panel. Explain in two sentences why 90 s is not a precise end-point time.',K('Why 90 s is not precise','Iodine was tested only every 30 s, so starch could have run out up to 30 s earlier. The time is known only to 30 s.',['Up to 30 s earlier.','Known to 30 s.'])]
      ],
      hot:[
        ['Which time is less certain?','Compare a 30 s uncertainty on the 90 s result and on the 240 s result. Which rate is less trustworthy? Why?',K('Relative uncertainty','30 s is a third of 90 s but an eighth of 240 s. The 40 °C rate is less certain.',['30/90 vs 30/240.','40 °C less certain.'])],
        ['Improve the precision','Suggest two changes that would measure the end-point more precisely. Explain how each helps.',K('Improving precision','Sample every 10 s, so the time is known to 10 s. Or use a colorimeter to track colour continuously.',['Shorter interval.','Colorimeter.'])]
      ]
    },
    plan:{
      start:[
        ['Seven letters, seven lines','Write C, O, R, M, M, S, S down your margin. As each step appears, write only its key words beside the letter.',K('CORMMSS key words','pH 4–9 buffers · same stock · three repeats · time to end-point · drop every 30 s · 37 °C · same volumes.',['All seven letters.'])],
        ['Because-stem for controls','For each S, complete: “Keep ___ the same because it also affects ___.”',K('Controls with reasons','Keep temperature the same because it also affects the rate. Keep starch and amylase volumes the same for the same reason.',['Two controls.','Each affects rate.'])]
      ],
      understand:[
        ['Name each variable type','Label C as the independent variable, the first M as the dependent variable, and each S as a control variable. Write the variable beside each label.',K('Variable types','Independent: pH. Dependent: time for starch to go. Control: temperature; starch and amylase volumes.',['Independent, dependent.','Two controls.'])],
        ['Plan temperature alone','Close this panel. Write a CORMMSS outline to investigate the effect of temperature on amylase.',K('Temperature outline','10–60 °C · same stock · three repeats · time to end-point · every 30 s · pH buffer · same volumes.',['Temperature changed.','pH now controlled.'])]
      ],
      hot:[
        ['Why a buffer, not acid?','A student sets the pH by adding a few drops of acid instead of a buffer. Evaluate this method.',K('Buffer beats acid','Drops of acid give an uncontrolled pH that may drift. A buffer holds each pH constant, so rate links to pH.',['Acid: pH drifts.','Buffer: pH constant.'])],
        ['Choose the pH values','You do not know an enzyme’s optimum. Explain how you would choose which pH values to test.',K('Range, then interval','First a wide range, pH 2–12 in steps of 2, to find the peak. Then smaller steps around the peak.',['Wide range first.','Smaller steps later.'])]
      ]
    },
    data:{
      start:[
        ['Spot the odd one out','Read along the 40 °C row. Which trial is very different from the other two? Circle it in your book.',K('Anomaly identified','Trial 2, 300 s. The others are 60 s and 120 s.',['300 s.'])],
        ['Mean in two steps','Add the two remaining times, then divide by 2. Write: (60 + 120) ÷ 2 = ___ s.',K('Mean without the anomaly','(60 + 120) ÷ 2 = 90 s.',['90 s.'])]
      ],
      understand:[
        ['Rate from your mean','Use your mean: rate = 1 ÷ mean time. Give 2 significant figures and the unit.',K('Rate from the mean','1 ÷ 90 = 0.011 s⁻¹.',['0.011 s⁻¹.'])],
        ['Explain 60 °C alone','Close this panel. Write three linked points to explain why no end-point was reached at 60 °C.',K('60 °C in three points','Amylase is denatured. Its active site changed shape, so starch no longer fits. Starch remains: blue-black.',['Denatured.','No fit.','Starch remains.'])]
      ],
      hot:[
        ['Explain the anomaly','Suggest two specific reasons why trial 2 at 40 °C took 300 s.',K('Possible causes','The end-point was misjudged; the bath cooled; the tubes were not pre-warmed; or less amylase was added.',['Two specific causes.'])],
        ['Is 50 °C really slower?','The 50 °C trials range from 150 s to 210 s. Evaluate how confident you can be that the rate at 50 °C is lower than at 40 °C.',K('Confidence in the trend','All 50 °C times are longer than the valid 40 °C times; the ranges do not overlap. More repeats would help.',['Compares ranges.','More repeats.'])]
      ]
    }
  };

  window.LESSON={
    number:2,unit:'Biological molecules',unitLesson:2,spec:'Pearson 4XBI1',
    title:'Enzymes, temperature and pH',
    question:'How does a protein’s shape control the speed of a reaction?',
    path:['Explain how enzymes work','Explain temperature and pH','Plan a fair investigation'],
    outcomes:[
      ['Explain how enzymes act as biological catalysts using active site, specificity and enzyme–substrate complex, including digestive enzymes.','2.10 · 2.29 introduced'],
      ['Explain how temperature and pH affect enzyme activity, including denaturation, and interpret graphs.','2.11, 2.13'],
      ['Plan an enzyme investigation, calculate rate and evaluate the method.','2.12, 2.14B · practical (Core Practical 2)']
    ],
    vocabulary:[
      ['Catalyst','Speeds up a reaction without being used up or permanently changed.'],
      ['Enzyme','A protein made by cells that acts as a biological catalyst.'],
      ['Metabolic reaction','A chemical reaction in an organism: breakdown (digestion) or build-up (glucose → glycogen).'],
      ['Substrate','The molecule an enzyme acts on, for example starch for amylase.'],
      ['Active site','The region of an enzyme with a specific shape, complementary to its substrate.'],
      ['Complementary','Shapes that fit together, like a key and its lock. Not the same shape.'],
      ['Enzyme–substrate complex','Forms when the substrate binds in the active site.'],
      ['Specific','Only a substrate with a complementary shape fits the active site.'],
      ['Optimum','The temperature or pH at which an enzyme works fastest.'],
      ['Kinetic energy','Energy of movement. Warmer molecules move faster and collide more often.'],
      ['Denatured','Bonds holding the shape break; the active site changes shape. Permanent. Never “killed”.'],
      ['Buffer solution','Keeps the pH constant during an investigation.'],
      ['Amylase · maltase','Amylase: starch → maltose. Maltase: maltose → glucose.'],
      ['Protease · lipase','Protease: protein → amino acids. Lipase: lipids → fatty acids and glycerol.'],
      ['End-point','The first sample where iodine stays orange-brown: all the starch is gone.'],
      ['Rate','How fast a reaction happens. Here rate = 1 ÷ time, unit s⁻¹.'],
      ['Precision','How finely a value is measured. Sampling every 30 s gives times only to 30 s.']
    ],
    resourcePages:[
      {heading:'Ready to learn',text:'Write everything in your book.',items:['Book, pen, sharp pencil, ruler','Calculator for rate = 1 ÷ time','Mini-whiteboard, if available']},
      {heading:'Practical kit',text:'Core Practical 2, per group. Eye protection on.',items:['Spotting tile, iodine, pipettes','Starch and amylase solutions','Water bath, thermometer, stopwatch']},
      {heading:'Investigation planner',text:'CORMMSS planner, results table, rate column and graph grid.',href:'02%20Resources/Enzyme%20investigation%20planner.html',linkLabel:'Open the planner'},
      {heading:'Exam-style questions',text:'The lesson’s exam questions plus homework practice.',href:'02%20Resources/Exam-style%20questions.html',linkLabel:'Open the question sheet'},
      {heading:'Enzymes reading',text:'Revisit the teaching input after the lesson.',href:'02%20Resources/Enzymes%20reading.html',linkLabel:'Open the reading'}
    ],
    modelPages:[
      {heading:'Lock and key',text:'Binding, complex, products, reuse.',action:{id:'active-site',label:'Open the active-site model'}},
      {heading:'Specificity',text:'Test two different substrates.',action:{id:'specificity',label:'Open the specificity model'}},
      {heading:'Temperature',text:'Heat it, then cool it back.',action:{id:'temperature-model',label:'Open the temperature model'}},
      {heading:'pH',text:'Find three optimum pH values.',action:{id:'ph-model',label:'Open the pH model'}},
      {heading:'Virtual spotting tile',text:'Run the amylase practical.',action:{id:'virtual-investigation',label:'Open the investigation'}}
    ],
    checkPages:[
      {heading:'Specificity check',text:'Why can’t a protease digest starch?',action:{id:'specificity-hinge',label:'Open the hinge'}},
      {heading:'Graph check',text:'Why does the rate fall above the optimum?',action:{id:'graph-hinge',label:'Open the hinge'}},
      {heading:'Calculate the rate',text:'Rate = 1 ÷ time and precision.',action:{id:'rate-calc',label:'Open the calculation'}},
      {heading:'Independent plan',text:'Protease and temperature [6].',action:{id:'plan-independent',label:'Open the exam question'}},
      {heading:'Analyse the repeats',text:'Anomaly, mean, rate, 60 °C [6].',action:{id:'data-analysis',label:'Open the data analysis'}},
      {heading:'Exit check',text:'Three quick answers [5].',action:{id:'exit',label:'Open the exit check'}}
    ],
    ai:{
      catalysis:{
        prompt:'In your own words, explain why one enzyme molecule can be used again and again.',
        claim:'Enzymes get used up in reactions.',
        checks:['Is the enzyme changed afterwards?','Use active-site model stage 4.','Rewrite the claim correctly.'],
        answer:K('Not used up','Wrong: an enzyme is a catalyst. It is unchanged when products leave, so it binds another substrate. Evidence: stage 4 of the model.',['Rejects “used up”.','Unchanged and reused.','Names the evidence.'])
      },
      temperature:{
        prompt:'Explain why the rate of an enzyme-controlled reaction falls above the optimum temperature.',
        claim:'Cooling revives killed enzymes.',
        checks:['Are enzymes alive?','Test cool-back in the model.','Rewrite with “denatured”.'],
        answer:K('Two errors','Enzymes are not alive. Heat changes the active-site shape: denatured. The model showed cooling does not restore the rate: it is permanent.',['Rejects “killed” and “revives”.','Active site changes shape.','Cool-back as evidence.'])
      },
      ph:{
        prompt:'Explain why pepsin works well in the stomach.',
        claim:'Every enzyme works best at pH 7.',
        checks:['Compare the three optima.','Find a counterexample.','Rewrite the claim.'],
        answer:K('Optima differ','False. Pepsin’s optimum is about pH 2 and trypsin’s about pH 8. Each enzyme has its own optimum. Evidence: the pH graph.',['Rejects the claim.','Pepsin or trypsin example.','Names the graph.'])
      },
      investigation:{
        prompt:'Explain what repeating each temperature three times does in the amylase investigation.',
        claim:'Repeats make 30 s sampling accurate.',
        checks:['What do repeats improve?','Does a mean remove the gap?','Suggest a better fix.'],
        answer:K('Repeats do not fix it','Repeats show repeatability and anomalies. Every repeat still has the 30 s gap. Sample every 10 s or use a colorimeter.',['Rejects “accurate”.','Gap in every repeat.','Better interval or colorimeter.'])
      }
    },
    uae:{
      label:'Food security',
      pages:[
        {heading:'Food Security Strategy 2051',text:'The UAE aims for safe, nutritious food all year round, with policies that reduce food waste.',source:'https://u.ae/en/about-the-uae/strategies-initiatives-and-awards/strategies-plans-and-visions/environment-and-energy/national-food-security-strategy-2051',sourceLabel:'Read the strategy on u.ae',note:'Official UAE Government source · checked 27 Sep 2026'},
        {heading:'Why refrigerate in Dubai?',text:'A shop keeps fresh milk at 4 °C, not in a 35 °C summer storeroom. Use enzyme science to explain why the milk stays fresh for longer.',note:'Hypothetical classroom scenario',answer:A([m('Cold slows spoilage','Spoilage is enzyme-controlled, in bacteria and the milk. At 4 °C fewer collisions mean fewer complexes, so spoilage is slower.'),m('Keep it cold','Cold does not denature enzymes. If the milk warms, activity returns, so it must stay cold.')],[c('Success criteria',['Spoilage uses enzymes.','Cold: fewer collisions.','Not denatured.'])])},
        {heading:'Blanch, then freeze',text:'A UAE farm briefly heats vegetables to about 90 °C (blanching) before freezing them. Explain why this reduces waste more than freezing alone.',note:'Hypothetical classroom scenario',answer:A([m('Heat denatures','Blanching denatures the vegetables’ own enzymes: their active sites change shape permanently.'),m('Cold only slows','Freezing alone only slows the enzymes; they work again after thawing. Blanched food keeps its quality longer, so less is wasted.')],[c('Success criteria',['Blanching: permanent.','Freezing: slows only.','Less waste.'])])},
        {heading:'Test an advert',text:'A freezer advert says: “Freezing kills the enzymes in food, so thawed food keeps forever.” Evaluate the claim.',note:'Hypothetical classroom scenario',answer:A([m('Two errors','Enzymes are not alive, so not killed. Freezing only slows them; after thawing they work again.'),m('Judgement','False. Thawed food spoils like fresh food, so keep it cold and use it quickly.')],[c('Success criteria',['Rejects “kills”.','Freezing only slows.','Clear judgement.'])])}
      ]
    },
    phases:[
      p('title','Title','title','Enzymes, temperature and pH','catalysis'),
      p('outcomes','Learning outcome','outcome','What will you be able to do?','catalysis',{nav:'Learning outcomes',mins:1}),
      p('do-now','Do now','content','Retrieve Monday, predict today','catalysis',{nav:'Do now',mins:4,lead:'From memory. No notes.',items:['<strong>1</strong> Proteins are made from which smaller units?','<strong>2</strong> Starch test: which reagent? What is the positive colour?','<strong>3</strong> Which of Monday’s food tests needs heating?','<strong>4 Predict:</strong> amylase + starch at 37 °C or at 80 °C. Where does the starch disappear faster? Why?'],doThis:['Write 1–4 in your book.','Mark in green when answers are shown.']}),
      p('catalyst','Input','content','Enzymes are biological catalysts','catalysis',{nav:'Catalysts and enzymes',mins:2,diagram:'catalyst',secondaryDiagram:true,support:support.catalyst,items:['A <strong>catalyst</strong> speeds up a reaction without being used up or permanently changed.','<strong>Enzymes</strong> are biological catalysts: proteins made by cells.','They speed up <strong>metabolic reactions</strong>: breaking down (starch → maltose) and building up (glucose → glycogen).'],doThis:['Copy the enzyme definition.','Add a breakdown and a build-up example.']}),
      p('active-site','Input','model3d','The active site: lock and key','catalysis',{nav:'Active site and complex',mins:4,model:'enzyme',fallback:'enzymeFallback',modelState:{mode:'bind'},support:support.activeSite,caption:'Schematic lock-and-key model. Drag to rotate.',steps:['The <strong>substrate</strong> approaches the <strong>active site</strong>.','An <strong>enzyme–substrate complex</strong> forms.','The <strong>products</strong> form and are released.','The enzyme is <strong>unchanged</strong>, so it is reused.'],stepStates:[{stage:0},{stage:1},{stage:2},{stage:3}],doThis:['Say each stage aloud.','Draw the four stages in your book.']}),
      p('specificity','Input','model3d','Each enzyme is specific','catalysis',{nav:'Specificity',mins:2,model:'enzyme',fallback:'specificity',modelState:{mode:'specific',substrate:'match'},support:support.specificity,caption:'Gold: complementary shape. Rose: different shape.',doThis:['Try both substrates in the model.','Explain the difference in one sentence.']}),
      p('digestive','Input','table','Digestive enzymes: substrate → products','catalysis',{nav:'Digestive enzymes',mins:3,support:support.digestive,reveal:true,columns:['Enzyme','Substrate','Product(s)','Link to Monday'],rows:[['Amylase','Starch','Maltose','Iodine test: starch'],['Maltase','Maltose','Glucose','Benedict’s: reducing sugars'],['Protease','Protein','Amino acids','Biuret: protein'],['Lipase','Lipids','Fatty acids + glycerol','Emulsion test: lipid']],doThis:['Copy the headings; fill each row as it appears.','Circle the two enzymes that turn starch into glucose.']}),
      p('specificity-hinge','Assess','hinge','Why can’t a protease digest starch?','catalysis',{nav:'Hinge: specificity',mins:2,secure:true,options:['Starch is too large for any enzyme to digest.','Its active site is not complementary to starch, so no complex forms.','Starch denatures the protease.','The protease is used up digesting protein.'],correct:1,task:'Choose a letter. Explain why each other option is wrong.'}),
      p('temperature-model','Input','model3d','What does temperature do?','temperature',{nav:'Temperature model',mins:4,model:'enzyme',fallback:'tempGraph',modelState:{mode:'temperature',temp:37},support:support.tempModel,caption:'Schematic model. Speeds are illustrative.',steps:['<strong>10 °C</strong>: slow, not denatured.','<strong>37 °C</strong>: more <strong>kinetic energy</strong>, more collisions.','<strong>65 °C</strong>: active site changed: <strong>denatured</strong>.'],stepStates:[{temp:10,maxDeform:0,denatured:false},{temp:37,maxDeform:0,denatured:false},{temp:65,maxDeform:1,denatured:true}],ladder:[['Secure','Names the optimum and denaturation.'],['Strong','Collisions below; active-site shape change above.'],['Grade 8–9','Explains a progressive, permanent fall.']],doThis:['Predict the rate before each step.','After step 3, slide back to 37 °C.']}),
      p('temp-graph','Input','model','Read the temperature graph','temperature',{nav:'Temperature graph',mins:3,diagram:'tempGraph',support:support.tempGraph,caption:'Illustrative data (amylase).',steps:['<strong>Rising:</strong> more kinetic energy → more collisions → more complexes per second.','<strong>Peak:</strong> the <strong>optimum</strong>, about 40 °C here, gives the highest rate.','<strong>Falling:</strong> active sites change shape; more molecules are <strong>denatured</strong>. Permanent.'],ladder:[['Secure','Describe: rise, 40 °C peak, fall.'],['Strong','Explain: collisions; active site shape.'],['Grade 8–9','Quote data; progressive, permanent fall.']],doThis:['Sketch and label the three regions.']}),
      p('ph','Input','content','Each enzyme has an optimum pH','ph',{nav:'pH and enzymes',mins:3,diagram:'phGraph',secondaryDiagram:true,caption:'Schematic curves. Optima are approximate.',support:support.ph,items:['The <strong>optimum pH</strong> is where an enzyme works fastest.','Away from it, the <strong>active site changes shape</strong>: fewer complexes form. Extreme pH <strong>denatures</strong> it.','Pepsin ≈ pH 2 · amylase ≈ pH 7 · trypsin ≈ pH 8. <strong>Buffers</strong> keep pH constant.'],doThis:['Label each optimum on a sketch.']}),
      p('ph-model','Input','model3d','Find the optimum pH','ph',{nav:'pH model',mins:2,optional:true,model:'enzyme',fallback:'phGraph',modelState:{mode:'ph',enzyme:'amylase',ph:7},support:support.phModel,caption:'Schematic model. Optima are approximate.',doThis:['Find each enzyme’s fastest pH.','Explain why pepsin suits the stomach.']}),
      p('graph-hinge','Assess','hinge','Why does the rate fall above the optimum?','temperature',{nav:'Hinge: the falling curve',mins:2,secure:true,lead:'Amylase: 40 °C → 60 °C. The rate falls to almost zero.',options:['The amylase is killed by the heat.','The molecules move too fast to collide.','Bonds break, so the active site changes shape and starch no longer fits.','The starch is denatured.'],correct:2,task:'Choose a letter. Name the error in each wrong option.'}),
      p('method-model','Input','model','Core Practical 2: the method','investigation',{nav:'Core practical method',mins:3,diagram:'cpSetup',support:support.method,caption:'Schematic set-up. Not to scale.',steps:['Wear eye protection. Put one drop of <strong>iodine</strong> in each well of a spotting tile.','Warm 2 cm³ starch and 2 cm³ amylase in <strong>separate tubes</strong>, 5 minutes. Avoid skin contact.','Mix them and start the stopwatch at once.','Every 30 s, drop some mixture into a fresh iodine well.','<strong>End-point:</strong> the first well that stays orange-brown: no starch left.','Repeat at 10–60 °C, three times each. Rate = 1 ÷ mean time.'],safety:'Wear eye protection. Iodine is an irritant. Avoid skin contact with amylase (allergen). Take care with hot water.',doThis:['Number steps 1–6 in your book.']}),
      p('virtual-investigation','Thinking','model3d','Run the investigation','investigation',{nav:'Virtual investigation',mins:4,model:'spotTile',fallback:'spotTileFallback',support:support.virtual,caption:'Each well = one 30 s sample. Illustrative data.',doThis:['Run 20, 40, 60 °C; record end-points.','Calculate rate = 1 ÷ time for each.']}),
      p('rate-calc','Assess','content','Calculate and judge the rate [4]','investigation',{nav:'Rate calculation',label:'Original exam-style question · 4 marks',mins:2,support:support.rate,text:'Amylase end-points: <strong>90 s</strong> at 40 °C; <strong>240 s</strong> at 20 °C. Sampled every 30 s.',items:['<strong>(a)</strong> Calculate both rates (rate = 1 ÷ time), to 2 s.f., with units. <strong>[2]</strong>','<strong>(b)</strong> Explain how 30 s sampling limits the <strong>precision</strong> of the 40 °C time. <strong>[2]</strong>'],doThis:['Show your working in your book.']}),
      p('plan-model','Input','model','Describe a pH investigation [6]','investigation',{nav:'Model a CORMMSS plan',label:'Worked example · 6 marks',mins:3,diagram:'cormmss',support:support.plan,caption:'Planning checklist, not a mark scheme.',steps:['<strong>C</strong>hange: pH 4–9 in steps of 1, using buffer solutions (1 cm³ added to the starch).','<strong>O</strong>rganism: amylase from one stock, so the enzyme is identical.','<strong>R</strong>epeat: three times at each pH; calculate a mean; spot anomalies.','<strong>M</strong>easure: time until the iodine stays orange-brown. Rate = 1 ÷ time.','<strong>M</strong>easure how: every 30 s, a drop into fresh iodine.','<strong>S</strong>ame: 37 °C water bath, because temperature also changes the rate.','<strong>S</strong>ame: 2 cm³ starch and amylase, same concentrations, because these change the rate.'],doThis:['Write one line per letter in your book.']}),
      p('plan-independent','Assess','content','Plan: temperature and protease [6]','investigation',{nav:'Independent exam question',label:'Original exam-style question · 6 marks',mins:6,secure:true,timer:6,lead:'Six minutes · work alone',text:'A cloudy suspension of casein (a milk protein) goes <strong>clear</strong> when a protease digests it.',items:['<strong>Describe</strong> how you could investigate the effect of <strong>temperature</strong> on this protease’s activity. <strong>[6]</strong>'],doThis:['Plan with CORMMSS in your margin.','Write full sentences. Stop at the timer.']}),
      p('data-analysis','Assess','table','Analyse the repeats [6]','investigation',{nav:'Data analysis',label:'Original exam-style question · 6 marks',mins:4,optional:true,support:support.data,lead:'Illustrative data · 30 s sampling · >600: no end-point by 600 s',columns:['Temp. / °C','Trial 1 / s','Trial 2 / s','Trial 3 / s','Mean / s'],rows:[['10','450','420','480','450'],['20','240','270','210','240'],['30','150','150','150','150'],['40','60','300','120','?'],['50','180','150','210','180'],['60','>600','>600','>600','—']],doThis:['(a) 40 °C mean, excluding the anomaly [2]','(b) Rate at 40 °C [1] · (c) Explain 60 °C [3]']}),
      p('exit','Assess','content','Exit: three quick answers','investigation',{nav:'Exit check',label:'Exit check · 5 marks',mins:2,secure:true,items:['<strong>1</strong> Define <strong>active site</strong>. <strong>[1]</strong>','<strong>2</strong> Boiled amylase is cooled to 37 °C. Why does it still not digest starch? <strong>[2]</strong>','<strong>3</strong> Why does pepsin work in the stomach but not in the small intestine? <strong>[2]</strong>'],doThis:['Answer in your book, without notes.']})
    ]
  };
})();
