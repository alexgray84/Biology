/* Lesson 2 · Limiting factors of photosynthesis · Year 10 Triple Biology (Pearson 4XBI1 2.20; 2.23 oxygen evolution).
   Pupil-facing content only. Synthetic data: every pondweed number is SIMULATED (the lesson’s simulated dataset); the greenhouse graph is
   illustrative data in a hypothetical scenario. Every widget prompt carries its own review as the third element. */
(() => {
  const m=(heading,text)=>({heading,text});
  const c=(heading,items)=>({heading,items});
  const A=(models,criteria,marks=null)=>({models,criteria,marks});
  const K=(heading,text,items)=>A([m(heading,text)],[c('Success criteria',items)]);
  const p=(id,family,type,title,topic,extra={})=>({id,family,type,title,topic,...extra});

  const support={
    predict:{
      start:[
        ['Two ends of the line','Decide two points first. In darkness (0 % light), how much photosynthesis is there? In bright light, is it more or less? Mark both points on your axes, then join them.',K('Two anchor points','At 0 % light there is no photosynthesis, so the line starts at zero. In brighter light the rate is higher.',['Starts at zero.','Higher in bright light.'])],
        ['Because-stem','Complete: “I think the rate will ___ as the light gets brighter, because light supplies ___ for photosynthesis.”',K('Stem completed','I think the rate will increase as the light gets brighter, because light supplies energy for photosynthesis.',['A direction of change.','Light supplies energy.'])]
      ],
      understand:[
        ['Name your shape','Choose the phrase that matches your sketch: rises steadily · rises then levels off · rises then falls · stays the same. Write it under your graph.',K('Shape named','Any shape is acceptable before testing, if it is named and matches your sketch. You test it in the lab next.',['Shape named.','Matches the sketch.'])],
        ['Predict without help','Close this panel. Sketch a prediction for dim light only (0–20 %). Explain it in one sentence.',K('Dim light','The rate rises as light increases from 0 to 20 %, because light energy is in short supply.',['Rises in dim light.','Gives a reason.'])]
      ],
      hot:[
        ['Can it rise forever?','Suggest one reason why the rate might not keep rising in brighter and brighter light. Name something else photosynthesis needs.',K('Other needs','Photosynthesis also needs carbon dioxide, and enzymes at a suitable temperature. If one runs short, more light may not help.',['Names CO₂ or temperature.','Rate may stop rising.'])],
        ['Use the equation','Use the equation from Lesson 1. Which reactant could run short in a tube of pondweed? How would that change your sketch?',K('A reactant runs short','Carbon dioxide could run short. Then more light would not raise the rate, so the line would level off.',['Names CO₂.','Line levels off.'])]
      ]
    },
    method:{
      start:[
        ['Kit check','Point to each item on the diagram: lamp, water bath, thermometer, boiling tube, pondweed, gas syringe, stopwatch. Say what each one is for.',K('Kit and purpose','Lamp: light. Bath and thermometer: steady temperature. NaHCO₃: supplies CO₂. Syringe: collects gas. Stopwatch: times 5 minutes.',['Every item named.','A purpose for each.'])],
        ['Variable labels','Write IV, DV and CV in your margin. Sort these: light intensity · volume of gas in 5 minutes · temperature · NaHCO₃ concentration.',K('Variables sorted','IV: light intensity. DV: volume of gas in 5 minutes. CVs: temperature and NaHCO₃ concentration.',['IV and DV correct.','Two control variables.'])]
      ],
      understand:[
        ['Why wait 5 minutes?','Explain why the pondweed is left for 5 minutes at each new brightness before you collect any gas.',K('Acclimatise','The rate needs time to adjust to the new light. Otherwise gas made at the old brightness is collected too.',['Rate adjusts.','Fair comparison.'])],
        ['Syringe or bubbles?','Close this panel. Explain why measuring the volume of gas is better than counting bubbles.',K('Volume beats counting','Bubbles vary in size, so equal counts may not mean equal volumes. A gas syringe measures the volume directly.',['Bubble size varies.','Syringe measures volume.'])]
      ],
      hot:[
        ['Not all the oxygen','Grade 8–9: the gas collected underestimates the oxygen made in photosynthesis. Explain why, using respiration.',K('Respiration uses oxygen','The plant respires all the time and uses some of the oxygen it makes. So the collected volume underestimates the gross rate.',['Respiration uses O₂.','An underestimate.'])],
        ['Distance, not brightness','A class moves the lamp instead of changing its brightness. Light intensity ∝ 1 ÷ distance². Predict the intensity when the distance doubles.',K('Inverse square','Doubling the distance gives one quarter of the intensity: 1 ÷ 2² = ¼. A Go further point, not required by 4XBI1.',['One quarter.','Uses 1 ÷ distance².'])]
      ]
    },
    collect:{
      start:[
        ['One brightness first','Choose a prediction, then press 20 % and Run three times. Write the three volumes in one row of your table.',K('20 % row','20 %: 3.5, 3.6 and 3.3 cm³ (simulated data). Mean = 10.4 ÷ 3 = 3.5 cm³.',['Three values.','Mean 3.5 cm³.'])],
        ['Mean in two steps','For one row: add the three volumes, then divide by 3. Round to 1 decimal place. Try the 40 % row.',K('40 % mean','(5.7 + 5.8 + 5.5) ÷ 3 = 17.0 ÷ 3 = 5.67, so 5.7 cm³.',['Adds all three.','5.7 cm³.'])]
      ],
      understand:[
        ['Spot the odd one out','Read along the 60 % row. Which repeat is far from the other two? Circle it in your book.',K('Anomaly found','Repeat 2: 3.7 cm³. The other two repeats are 6.2 and 6.8 cm³.',['Repeat 2.','3.7 cm³.'])],
        ['The 60 % mean alone','Close this panel. Calculate the 60 % mean without the anomaly. Explain why you left it out.',K('Mean without the anomaly','(6.2 + 6.8) ÷ 2 = 6.5 cm³. Repeat 2 does not fit the pattern; including it would make the mean too low.',['6.5 cm³.','Reason given.'])]
      ],
      hot:[
        ['Explain the anomaly','Suggest two practical reasons why one 60 % repeat collected much less gas than the others.',K('Possible causes','A leak at the bung or syringe; a stuck plunger; too little time to acclimatise; or the pondweed was moved.',['Two specific causes.'])],
        ['Is 100 % really higher?','The 80 % and 100 % means differ by 0.2 cm³. Repeats at each brightness vary by about 0.5 cm³. How sure can you be that 100 % gives more gas?',K('Within the variation','Not sure: the difference is smaller than the spread of the repeats. The curve has about levelled off. More repeats would help.',['Compares difference and spread.','Levelled off.'])]
      ]
    },
    interpret:{
      start:[
        ['Cover half the graph','Cover the right half with your hand. Describe only the left part: what happens to the volume between 0 % and 40 % light?',K('Left part','The volume rises steeply, from 0 to 5.7 cm³ at 40 %. More light gives more gas.',['Rises steeply.','Quotes 5.7 cm³.'])],
        ['Limiting-factor stem','Complete: “A limiting factor is the factor in ___ supply. Increasing it ___ the rate.”',K('Stem completed','A limiting factor is the factor in shortest supply. Increasing it increases the rate.',['Shortest supply.','Increases the rate.'])]
      ],
      understand:[
        ['The test that decides','On the 0.5 % plateau, what happened when the CO₂ supply rose to 1.0 %? What does that show was limiting?',K('CO₂ was limiting','The volume rose higher, to about 9.2 cm³ at 100 % light. So CO₂ concentration was limiting on the plateau.',['Volume rose.','CO₂ limiting.'])],
        ['Name the factor alone','Close this panel. For each section of the 0.5 % curve, write the limiting factor and your evidence.',K('Two sections','Rising: light, because more light raises the volume. Plateau: CO₂, because more CO₂ raised it.',['Rising: light.','Plateau: CO₂ with evidence.'])]
      ],
      hot:[
        ['Dim light','At 20 % light the 0.5 % and 1.0 % curves almost overlap (3.5 and 3.6 cm³). The 0.1 % curve is a little lower (2.9 cm³). Explain both.',A([m('Light limits in dim light','At 20 % light, light is the limiting factor, so extra CO₂ hardly helps: 3.5 v 3.6 cm³.'),m('Why 0.1 % is lower','With so little CO₂, CO₂ also limits, even in dim light, so the volume is lower (2.9 cm³).')],[c('Success criteria',['Light limits at 20 %.','Extra CO₂ hardly helps.','0.1 %: CO₂ also limits.'])])],
        ['A warmer curve','Predict how the 1.0 % curve would change at 30 °C instead of 25 °C. Explain using enzymes.',K('Higher plateau','The plateau rises (about 10.7 v 9.2 cm³, simulated): 30 °C is the simulated optimum, so enzymes work fastest. Low-light values barely change (3.6 cm³ at 20 %).',['Higher plateau.','Enzymes at the optimum.','Little change in dim light.'])]
      ]
    },
    temperature:{
      start:[
        ['Three temperatures first','Choose a prediction, then run 10 °C, 30 °C and 50 °C. Write each volume. Which is largest?',K('Three runs','Repeat 1, simulated: 10 °C 2.8 cm³; 30 °C 8.3 cm³; 50 °C 0.0 cm³. 30 °C is largest.',['Three values.','30 °C largest.'])],
        ['Pre-teach: denature','Denatured: the active site has changed shape, so the substrate no longer fits. Complete: “Above the optimum, enzymes ___ and the rate ___.”',K('Stem completed','Above the optimum, enzymes denature and the rate falls.',['Denature.','Falls.'])]
      ],
      understand:[
        ['Chain for the rise','Use this chain: more kinetic energy → more collisions → more enzyme–substrate complexes. Write two sentences for 10 °C to 30 °C.',K('Rise explained','Molecules gain kinetic energy and collide more often. More enzyme–substrate complexes form each second, so the rate rises.',['Kinetic energy.','More complexes.'])],
        ['The fall alone','Close this panel. Explain why the volume falls from 30 °C to 45 °C, in three linked steps.',K('Fall explained','Enzymes denature: bonds break and the active site changes shape. The substrate no longer fits, so fewer complexes form.',['Denature.','Active site shape.','Fewer complexes.'])]
      ],
      hot:[
        ['Temperature in dim light','Grade 8–9: press Fixed conditions and set Light 20 %. Rerun 10, 20 and 30 °C. Explain why temperature now has a smaller effect.',K('Light limits','At 20 % light, light is limiting. Faster enzymes cannot raise the rate much: about 2.2 to 3.6 cm³, not 2.8 to 8.3.',['Light limiting.','Smaller rise.'])],
        ['Optima differ','The simulated optimum is about 30 °C. Explain why a pondweed from a cold lake could have a lower optimum.',K('Adapted enzymes','Optima vary between species. Its enzymes may keep their shape and work fastest at lower temperatures.',['Optima vary.','Links to enzymes.'])]
      ]
    },
    graphModel:{
      start:[
        ['Describe means numbers','A describe answer says what the line does, with values and units. Complete: “The volume rises to ___ cm³ at ___ % light, then ___.”',K('Description','The volume rises to 5.7 cm³ at 40 % light, then levels off at about 7.0 cm³.',['Values with units.','Rise, then level off.'])],
        ['Explain means because','For the rising part, complete: “The volume rises because light is the ___ factor.”',K('Rise explained','The volume rises because light is the limiting factor: more light energy, faster photosynthesis.',['Limiting.','Light energy.'])]
      ],
      understand:[
        ['Fix the rejected line','Rewrite “the plant gets tired” as a scientific sentence about the plateau.',K('Better line','On the plateau another factor, CO₂ concentration, is limiting, so more light does not raise the rate.',['Names a factor.','Explains no rise.'])],
        ['Four lines alone','Close this panel. Write four lines for the 1.0 % curve: describe with data, explain the rise, explain the plateau, name the factor.',K('1.0 % curve','Rises to 8.4 cm³ at 60 %, then levels off near 9.2 cm³. Light limits the rise; on the plateau another factor limits, such as temperature.',['Two values.','Rise and plateau explained.'])]
      ],
      hot:[
        ['Describe or explain?','Sort: “levels off at 7.0 cm³” · “CO₂ is limiting” · “rises from 0 to 5.7 cm³” · “light energy is in short supply”. Which describe? Which explain?',K('Sorted','Describe: levels off at 7.0 cm³; rises from 0 to 5.7 cm³. Explain: CO₂ is limiting; light energy is in short supply.',['Two describe.','Two explain.'])],
        ['Which factor, really?','On the 0.5 % plateau, CO₂ or temperature could limit. Design a quick test in the lab to decide.',A([m('One factor at a time','Keep light at 100 %. Raise NaHCO₃ to 1.0 % (7.0 → 9.2 cm³); separately raise the bath to 30 °C (7.0 → 8.4 cm³).'),m('What it shows','Each raises the volume, so at 25 °C CO₂ and temperature were both in short supply. A graph that changes only CO₂ lets you name only CO₂.')],[c('Success criteria',['One factor at a time.','Compare volumes.','Both limit here.'])])]
      ]
    }
  };

  window.LESSON={
    number:2,unit:'Photosynthesis and plant gas exchange',unitLesson:2,spec:'Pearson 4XBI1',
    title:'Limiting factors of photosynthesis',
    question:'What stops a plant photosynthesising faster?',
    path:['Predict','Test in the pondweed lab','Explain the graph'],
    outcomes:[
      ['Explain how light intensity, carbon dioxide concentration and temperature affect the rate of photosynthesis.','2.20'],
      ['Describe how to investigate the rate of photosynthesis by measuring the oxygen given off by pondweed, and control the variables.','2.23 · practical (oxygen evolution)'],
      ['Identify the limiting factor on different parts of a graph and explain your choice.','2.20 · data analysis']
    ],
    vocabulary:[
      ['Rate of photosynthesis','How fast photosynthesis happens. Here: volume of gas collected in 5 minutes.'],
      ['Limiting factor','The factor in shortest supply. It stops the rate going higher. Increasing it increases the rate.'],
      ['Light intensity','How bright the light is. Here: lamp brightness as a % of maximum.'],
      ['Sodium hydrogencarbonate','NaHCO₃. Dissolved in the water, it supplies carbon dioxide to the pondweed.'],
      ['Acclimatise','Leave the pondweed about 5 minutes at a new condition before measuring.'],
      ['Gas syringe','Collects gas and measures its volume in cm³.'],
      ['Independent variable','The variable you change, e.g. light intensity.'],
      ['Dependent variable','The variable you measure, e.g. volume of gas in 5 minutes.'],
      ['Control variable','Kept the same so the test is fair, e.g. temperature.'],
      ['Mean','Add the repeats, then divide by how many there are. Leave out anomalies.'],
      ['Anomaly','A result that does not fit the pattern of the others.'],
      ['Plateau','The flat part of a graph: the value stays about the same.'],
      ['Optimum temperature','The temperature at which an enzyme-controlled process is fastest.'],
      ['Denatured','The active site has changed shape, so the substrate no longer fits. Never “killed”.'],
      ['Simulated data','Numbers made by a computer model, not measured from a real plant.']
    ],
    resourcePages:[
      {heading:'Ready to learn',text:'Write everything in your book or on the results sheet.',items:['Book, pen, sharp pencil, ruler','Calculator for means','Your device for the pondweed lab']},
      {heading:'Pondweed lab',text:'The simulator, for your own device. It shows measurements only: you record and calculate.',href:'02%20Resources/Pondweed%20lab.html',linkLabel:'Open the pondweed lab'},
      {heading:'Results sheet',text:'Results table, graph grid, CORMMSS planner and analysis questions.',href:'02%20Resources/Pondweed%20results%20sheet.html',linkLabel:'Open the results sheet'},
      {heading:'Limiting factors reading',text:'Revisit the teaching input after the lesson.',href:'02%20Resources/Limiting%20factors%20reading.html',linkLabel:'Open the reading'},
      {heading:'Exam-style questions',text:'The lesson’s exam questions plus homework practice.',href:'02%20Resources/Exam-style%20questions.html',linkLabel:'Open the question sheet'}
    ],
    modelPages:[
      {heading:'The method',text:'Pondweed set-up, step by step.',action:{id:'method-model',label:'Open the method'}},
      {heading:'Pondweed lab',text:'Collect three repeats at each brightness.',action:{id:'collect',label:'Open the lab'}},
      {heading:'Temperature',text:'Predict, then test 10–50 °C.',action:{id:'temperature',label:'Open the temperature test'}},
      {heading:'The limiting-factor graph',text:'Rising section, plateau, CO₂ test.',action:{id:'interpret',label:'Open the graph'}}
    ],
    checkPages:[
      {heading:'Limiting-factor check',text:'What limits the rate at point X?',action:{id:'limiting-hinge',label:'Open the hinge'}},
      {heading:'Describe and explain',text:'UAE greenhouse graph [5].',action:{id:'graph-independent',label:'Open the exam question'}},
      {heading:'Exit check',text:'Two quick answers [4].',action:{id:'exit',label:'Open the exit check'}}
    ],
    ai:{
      factors:{
        prompt:'In your own words, explain what happens to the rate when the light intensity doubles from 40 % to 80 %.',
        claim:'Double the light, double the rate.',
        checks:['Compare the 40 % and 80 % means.','Where does the curve level off?','Rewrite the claim correctly.'],
        answer:K('Only while light limits','False. The simulated means are 5.7 cm³ at 40 % and 6.8 cm³ at 80 %, not 11.4. More light helps only while light is the limiting factor.',['Rejects the claim.','Quotes two means.','Uses “limiting factor”.'])
      },
      investigation:{
        prompt:'Explain why the method collects gas in a gas syringe.',
        claim:'Counting bubbles is just as accurate.',
        checks:['Are all bubbles the same size?','What does a syringe measure?','Rewrite the claim correctly.'],
        answer:K('Bubbles vary','False. Bubble size varies, so a count does not give the volume of gas. A gas syringe measures the volume in cm³. Counting is quicker but less accurate.',['Rejects the claim.','Bubble size varies.','Syringe measures volume.'])
      },
      graphs:{
        prompt:'Explain why the 0.5 % curve levels off.',
        claim:'A plateau means maximum speed.',
        checks:['What did the 1.0 % CO₂ test show?','Is the plateau really a maximum?','Rewrite with “limiting factor”.'],
        answer:K('Not a maximum','False. With 1.0 % NaHCO₃ the volume rose to 9.2 cm³, so 7.0 cm³ was not the plant’s maximum. Another factor, CO₂, was limiting. Evidence: the CO₂ test.',['Rejects “maximum”.','Uses the 1.0 % evidence.','Names the limiting factor.'])
      }
    },
    uae:{
      label:'Food security',
      pages:[
        {heading:'Food Security Strategy 2051',text:'Its aims include leading the Global Food Security Index by 2051, enhancing local production and using modern technologies for sustainable food production.',source:'https://u.ae/en/about-the-uae/strategies-initiatives-and-awards/strategies-plans-and-visions/environment-and-energy/national-food-security-strategy-2051',sourceLabel:'Read the strategy on u.ae',note:'Official UAE Government source · checked 16 Oct 2026'},
        {heading:'Cool it or add CO₂?',text:'In summer a UAE greenhouse can reach 45 °C. Explain why cooling it could increase the tomato yield more than adding extra CO₂.',note:'Hypothetical scenario',answer:A([m('Temperature limits','45 °C is above the optimum. Enzymes denature: their active sites change shape, so the rate falls. Temperature is the limiting factor.'),m('So cool first','Extra CO₂ cannot raise the rate while temperature limits it. Cooling towards the optimum lets enzymes work, so photosynthesis and yield rise.')],[c('Success criteria',['Above the optimum.','Enzymes denature.','CO₂ not limiting.'])])},
        {heading:'LEDs in a vertical farm',text:'A Dubai vertical farm grows lettuce indoors at 25 °C with extra CO₂. Explain why the LED brightness, not more CO₂, may now limit growth.',note:'Hypothetical scenario',answer:A([m('Light is now short','With extra CO₂ and a good temperature, light is the factor in shortest supply. Brighter LEDs would raise the rate.'),m('More CO₂ wastes money','Adding more CO₂ does not raise the rate while light is limiting.')],[c('Success criteria',['Light is limiting.','CO₂ no longer limiting.','Brighter LEDs help.'])])},
        {heading:'Test an advert',text:'An advert says: “Our CO₂ generator boosts growth in any greenhouse, day or night.” Evaluate the claim.',note:'Hypothetical scenario',answer:A([m('Not at night','At night there is no light, so no photosynthesis: extra CO₂ does nothing.'),m('Only if CO₂ limits','By day it helps only when CO₂ is the limiting factor, not when light or temperature limits. The claim is false as written.')],[c('Success criteria',['Night: no light.','Only when CO₂ limits.','Clear judgement.'])])}
      ]
    },
    phases:[
      p('title','Title','title','Limiting factors of photosynthesis','factors'),
      p('outcomes','Learning outcome','outcome','What will you be able to do?','factors',{nav:'Learning outcomes',mins:1}),
      p('do-now','Do now','content','Retrieve Lesson 1 and the enzymes unit','factors',{nav:'Do now',mins:4,lead:'From memory. No notes.',items:['<strong>1</strong> Write the balanced symbol equation for photosynthesis.','<strong>2</strong> What does <strong>optimum temperature</strong> mean for an enzyme?','<strong>3</strong> Sketch an enzyme’s rate–temperature curve. Label the optimum.','<strong>4</strong> Which raw material for photosynthesis enters the leaf from the air?'],doThis:['Write 1–4 in your book.','Mark in green when answers are shown.']}),
      p('predict','Thinking','content','Predict: brighter light?','factors',{nav:'Predict',mins:5,diagram:'predictAxes',secondaryDiagram:true,caption:'Blank axes: your prediction, before any data.',support:support.predict,text:'A lamp shining on pondweed gets <strong>brighter</strong>, from 0&nbsp;% to 100&nbsp;%. What happens to the <strong>rate of photosynthesis</strong>?',items:['Commit to a prediction now. You test it later.'],doThis:['Sketch your line and write one reason in your book.','Hold up your sketch when asked.']}),
      p('method-model','Input','model','The pondweed investigation','investigation',{nav:'Method',mins:5,diagram:'pondweedSetup',caption:'Schematic set-up. Not to scale.',support:support.method,steps:['<strong>Pondweed</strong>, stem cut under water, cut end up, in <strong>sodium hydrogencarbonate</strong> solution (supplies CO₂).','Stand the tube in a <strong>water bath</strong> at 25 °C. Check with a thermometer.','<strong>LED lamp</strong> at a fixed distance; set the brightness. Wait 5 min to <strong>acclimatise</strong>.','Collect gas in a <strong>gas syringe</strong> for 5 min. Repeat ×3; calculate a mean.','<strong>CORMMSS:</strong> light · same weed · ×3 · gas volume · syringe, 5 min · temp. · NaHCO₃.'],safety:'Hot lamp. Keep water away from electrics. Wash hands after handling pondweed.',doThis:['Number steps 1–5; label IV, DV, CVs. Then open the lab: check it says Investigate: Light.']}),
      p('collect','Thinking','model3d','Collect your results','investigation',{nav:'Pondweed lab',mins:10,model:'pondweed',fallback:'pondweedFallback',modelState:{investigate:'light'},support:support.collect,caption:'Simulated data. On your device: <a href="02%20Resources/Pondweed%20lab.html#light" target="_blank" rel="noopener">open the pondweed lab</a>.',doThis:['Predict; run 3 repeats per brightness; record each volume.','Calculate each mean; leave out any anomaly.']}),
      p('interpret','Input','model','What limits the rate?','graphs',{nav:'Limiting factors',mins:5,diagram:'limitingGraph',caption:'Simulated data: means of three repeats, 25 °C.',support:support.interpret,steps:['<strong>Rising:</strong> more light energy, faster photosynthesis. Light is the <strong>limiting factor</strong>.','<strong>Plateau:</strong> more light makes little difference. Another factor limits: CO₂ or temperature.','<strong>Predict, then test:</strong> what will 1.0 % NaHCO₃ do? Try it in the lab (Fixed conditions).','<strong>Limiting factor:</strong> the factor in shortest supply. More CO₂ raised the plateau.'],ladder:[['Secure','Rising: light limits.'],['Strong','Plateau: names a factor, with evidence.'],['Grade 8–9','Explains the low-light overlap.']],doThis:['Name each section’s limiting factor. Correct your sketch in green, plus one sentence.']}),
      p('temperature','Thinking','model3d','Test temperature','factors',{nav:'Temperature test',mins:4,model:'pondweed',fallback:'tempCurve',modelState:{investigate:'temperature',I:100},support:support.temperature,caption:'Simulated data, 100 % light, 0.5 % NaHCO₃. Optima vary between species. On your device: <a href="02%20Resources/Pondweed%20lab.html#temperature" target="_blank" rel="noopener">open the temperature lab</a>.',doThis:['Predict, then run 10–50 °C at light 100 %.','Explain the fall above 30 °C: denature.']}),
      p('limiting-hinge','Assess','hinge','What limits the rate at X?','graphs',{nav:'Hinge: limiting factor',mins:3,secure:true,lead:'Graph: step 4 of “What limits the rate?”. Both curves at 25 °C. With 0.1 % NaHCO₃ the volume levels off at about 3.9 cm³; with 1.0 % it reaches 9.2 cm³. X is on the 0.1 % plateau at 80 % light.',options:['Light intensity','Carbon dioxide concentration','Temperature','Nothing: the plant is at its maximum rate'],correct:1,task:'Use the graph only. Which factor does it show is limiting at X? Choose a letter and give the evidence.'}),
      p('graph-model','Input','model','Describe, then explain a curve','graphs',{nav:'Model answer: graphs',mins:3,label:'Worked example · describe and explain',diagram:'graphModel',caption:'Simulated means, 0.5 % NaHCO₃, 25 °C.',support:support.graphModel,steps:['<strong>Describe with data:</strong> the volume rises to 5.7 cm³ at 40 % light, then levels off at about 7.0 cm³.','<strong>Explain the rise:</strong> more light energy, faster photosynthesis. Light is limiting.','<strong>Explain the plateau:</strong> more light makes little difference, so another factor limits.','<strong>Name it:</strong> CO₂ concentration. Evidence: more CO₂ raised the plateau.','<strong>Rejected:</strong> “the plant gets tired”. It names no factor and uses no evidence.'],doThis:['Copy the four creditworthy lines.','Cross out the rejected line; write why.']}),
      p('graph-independent','Assess','content','A UAE greenhouse [5]','graphs',{nav:'Independent exam question',label:'Original exam-style question · 5 marks',mins:5,secure:true,timer:4,diagram:'greenhouseGraph',secondaryDiagram:true,caption:'Hypothetical scenario · illustrative data.',lead:'A UAE grower measures photosynthesis in two greenhouses, 25 °C.',items:['<strong>(a)</strong> <strong>Describe</strong> both curves. Use data. <strong>[2]</strong>','<strong>(b)</strong> <strong>Explain</strong> the shape of the 400 ppm curve. <strong>[2]</strong>','<strong>(c)</strong> Which factor limits at high light at 400 ppm? <strong>[1]</strong>'],doThis:['Work alone for 4 minutes, in full sentences.','Then tick in green with the mark scheme; rewrite one line.']}),
      p('exit','Assess','content','Exit: two quick answers','factors',{nav:'Exit check',label:'Exit check · 4 marks',mins:2,secure:true,items:['<strong>1</strong> On a temperature curve, why does the rate fall above about 30 °C? <strong>[2]</strong>','<strong>2</strong> A lamp is moved very close to the pondweed, with no water bath. Suggest why the results could become unreliable. <strong>[2]</strong>'],doThis:['Answer in your book, without notes.']})
    ]
  };
})();
