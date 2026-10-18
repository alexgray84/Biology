/* Lesson 1 · Digestive-enzyme graphs · Year 10 Double Science (Biology) · Pearson Edexcel IGCSE Science (Double Award) 4XBI1 2.11, 2.13
   (2.10 and 2.29 retrieved). Pupil-facing content only. All data are illustrative. No printing: pupils write on desks or
   mini-whiteboards, and every scaffold is on screen or on pupils' devices. Every widget prompt carries its own review as the third
   element. The Graph toolkit (4-step reading routine, rate = 1 ÷ time key presses, sentence frames, key-word pictures) appears as its
   own screen, as support pages on every graph screen and as a device page. The last Get started and Build understanding page on
   every screen fades the help ("Now try without the frame."). Key-fact wording matches the class home-learning page (Week 8). */
(() => {
  const m=(heading,text)=>({heading,text});
  const c=(heading,items)=>({heading,items});
  const A=(models,criteria,marks=null)=>({models,criteria,marks});
  const K=(heading,text,items)=>A([m(heading,text)],[c('Success criteria',items)]);
  const p=(id,family,type,title,topic,extra={})=>({id,family,type,title,topic,...extra});
  const TK=part=>`<a href="01%20Resources/Graph%20toolkit.html" target="_blank" rel="noopener">Graph toolkit ${part}</a>`;
  const IC=n=>window.BioDiagrams.render(n,{}).replace('<svg ','<svg width="66" height="50" style="vertical-align:middle;margin:0 2px" ');
  const STEPS='<strong>1</strong> axes and units · <strong>2</strong> one small square = difference ÷ squares · <strong>3</strong> rule up to the curve, then across · <strong>4</strong> value with its unit.';

  const support={
    toolkit:{
      start:[
        ['Toolkit (a): say the 4 steps','Say them to your partner: '+STEPS,K('The 4 steps','1 Read both axis labels and units. 2 Work out one small square. 3 Rule up to the curve, then across. 4 Write the value with its unit.',['Four steps in order.','Unit in step 4.'])],
        ['4 steps from memory','Now try without the frame. Close this panel. Write the 4 steps on your whiteboard.',K('Steps recalled','Axes and units; one small square; rule up, then across; value with its unit.',['Four steps.','Correct order.'])]
      ],
      understand:[
        ['Toolkit (b): 1 ÷ 120','Worked: 1 ÷ 9 0 = gives 0.011111… → 0.011 s⁻¹. Now press 1 ÷ 1 2 0 =. Keep 2 digits from the first digit that is not 0.',K('1 ÷ 120','0.008333… = 0.0083 s⁻¹.',['0.0083.','Unit s⁻¹.'])],
        ['Round 1 ÷ 30 alone','Now try without the frame. Calculate 1 ÷ 30. Round to 2 significant figures. Add the unit.',K('1 ÷ 30','0.03333… = 0.033 s⁻¹.',['0.033.','Unit s⁻¹.'])]
      ],
      hot:[
        ['Which step stops most mistakes?','Decide which of the 4 steps stops the most mistakes. Justify it with an example of a wrong answer it prevents.',K('A step with a reason','Either, with an example. Step 2: if you think one square is 0.001, you read 0.0074, not 0.0067. Step 4: “0.0067” with no unit loses the mark.',['A step chosen.','A matching wrong answer.'])],
        ['Why remove the frames?','A pupil says: “Frames are cheating.” Give one reason frames help now and one reason we remove them later.',K('Frames, then none','Frames show the shape of a full answer while it is new. We remove them so you can write it alone in the exam.',['Helps now: shows the shape.','Removed: exam is unaided.'])]
      ]
    },
    keyWords:{
      start:[
        ['Toolkit (d): picture match',IC('kwEnzyme')+' enzyme '+IC('kwSubstrate')+' substrate '+IC('kwActiveSite')+' active site. Find each one on the model. Point to it.',K('Three parts found','Enzyme: the large teal shape. Substrate: the gold piece. Active site: the gold-rimmed gap where the substrate fits.',['Enzyme found.','Substrate found.','Active site found.'])],
        ['Name the fit alone','Now try without the frame. Go to step 2. Say the name of the enzyme and substrate fitted together.',K('The fitted pair','The substrate fitted in the active site is an enzyme–substrate complex.',['Says “enzyme–substrate complex”.'])]
      ],
      understand:[
        ['Fill two words','Complete on your whiteboard: “The substrate fits into the ___ ___. Together they make an enzyme–___ complex.”',K('Frame completed','The substrate fits into the active site. Together they make an enzyme–substrate complex.',['Active site.','Substrate.'])],
        ['Say the stages alone','Now try without the frame. Say the three stages to your partner in order. Use the bold words.',K('Three stages','The substrate moves to the active site. It fits: an enzyme–substrate complex. Products leave; the enzyme is unchanged.',['Three stages in order.','Uses the bold words.'])]
      ],
      hot:[
        ['Same shape or fitting shape?','A pupil says: “The substrate is the same shape as the active site.” Use a key and its lock as a counterexample. Then correct the sentence.',K('Fits, not the same','A key is not the same shape as its lock; it fits into it. The substrate’s shape fits the active site: it is complementary.',['Uses key and lock.','Says “fits” or “complementary”.'])],
        ['Which one changes?','Decide which molecule is changed by the reaction: the enzyme or the substrate. Justify your decision with step 3 of the model.',K('The substrate changes','The substrate is broken into products. The enzyme is unchanged, so it is used again. Evidence: step 3.',['Substrate changes.','Enzyme unchanged.','Uses step 3.'])]
      ]
    },
    readGraph:{
      start:[
        ['Toolkit (a) for this graph','Say each step as the line moves: '+STEPS,K('Steps for 30 °C','Temperature / °C and rate / s⁻¹. One square 0.0005 s⁻¹. Up from 30 °C, then across. About 0.0067 s⁻¹.',['All 4 steps used.','Value with s⁻¹.'])],
        ['Gold scale numbers','The scale numbers are gold. Complete: (0.004 − 0.002) ÷ 4 squares = ___ s⁻¹ per square.',K('One small square','0.002 ÷ 4 = 0.0005 s⁻¹ per small square.',['0.0005.','Unit s⁻¹.'])],
        ['Read 50 °C alone','Now try without the frame. Rule a line up from 50 °C in your head, then across. Write the rate with its unit. Then check with the gold dot.',K('Rate at 50 °C','About 0.0056 s⁻¹. Accept 0.0055 to 0.0060 s⁻¹.',['Value in range.','Unit s⁻¹.'])]
      ],
      understand:[
        ['Toolkit (b): 1 ÷ 150','Key presses: 1 ÷ 1 5 0 =. The screen shows 0.006666… Round to 2 significant figures: 0.0067. Write it with the unit: ___.',K('Rate at 30 °C','1 ÷ 150 = 0.0067 s⁻¹. It matches the graph reading.',['0.0067.','Unit s⁻¹.'])],
        ['Calculate 1 ÷ 450 alone','Now try without the frame. The 10 °C end-point time was 450 s. Calculate the rate. Give 2 significant figures and the unit.',K('Rate at 10 °C','1 ÷ 450 = 0.00222… = 0.0022 s⁻¹.',['0.0022.','Unit s⁻¹.'])]
      ],
      hot:[
        ['Who read it better?','At 30 °C, Pupil P writes 0.0065 s⁻¹ and Pupil Q writes 0.0070 s⁻¹. Decide who is closer. Justify it using one small square.',K('Pupil P is closer','The curve meets the axis just above 0.0065: 0.0067. P is 0.0002 away; Q is 0.0003 away, over half a square.',['P chosen.','Uses 0.0005 per square.'])],
        ['Choose a better scale','A graph has labelled lines at 0 and 0.010, with 5 squares between them. Decide if 0.0067 is easy to read. Justify your decision.',K('Squares too big','Hard to read. One square is 0.010 ÷ 5 = 0.002, so 0.0067 falls inside a square. Smaller squares, e.g. 0.0005, are better.',['Works out 0.002 per square.','Suggests smaller squares.'])]
      ]
    },
    yourTurn:{
      start:[
        ['(a) in a picture',''+window.BioDiagrams.render('hint20',{}).replace('<svg ','<svg width="240" height="137" style="display:block;margin:2px 0 4px" ')+'Part (a), started: it lands just above 0.004.',K('Reading the picture','The line meets the axis just above 0.004: about 0.0042 s⁻¹.',['Just above 0.004.','Unit s⁻¹.'])],
        ['First line done for you','Ruler upright on 20 °C. Slide up to the curve, then across. You land just above the gold 0.004. Each square is 0.0005. Write the value and unit.',K('(a) completed','About 0.0042 s⁻¹. Accept 0.0040 to 0.0045 s⁻¹.',['Value in range.','Unit s⁻¹ written.'])],
        ['Find the peak alone','Now try without the frame. For (b), put your finger on the highest point of the curve. Read straight down. Write the temperature.',K('(b) the optimum','The highest point is above 40 °C. The optimum is about 40 °C.',['About 40 °C.','Read from the peak.'])]
      ],
      understand:[
        ['Toolkit (b): key presses for (c)','Type 1 ÷ 2 4 0 =. The screen shows 0.0041666… Keep two digits after the zeros: 4 and 1. The next digit is 6, so round up: 0.004 ___ s⁻¹.',K('(c) rounded','0.0041666… = 0.0042 s⁻¹.',['0.0042.','Unit s⁻¹.'])],
        ['Round 1 ÷ 180 alone','Now try without the frame. Calculate 1 ÷ 180. Round to 2 significant figures. Add the unit.',K('1 ÷ 180','0.005555… = 0.0056 s⁻¹.',['0.0056.','Unit s⁻¹.'])]
      ],
      hot:[
        ['The 60 °C point','At 60 °C there was no end-point within 600 s. A pupil writes the rate as 1 ÷ 600 = 0.0017 s⁻¹. Decide if this is right. Justify it.',K('Not a real time','Not right. 600 s is not an end-point time: the starch was never broken down. The rate is below 0.0017 s⁻¹, about 0.',['Rejects 0.0017 s⁻¹.','No end-point reached.','Rate about 0.'])],
        ['Could it be 38 °C?','The fastest result was at 40 °C. Could the true optimum be 38 °C? Decide. Say which extra temperatures you would test.',K('Test smaller steps','Yes. Only 10 °C steps were tested, so the optimum could be between 30 and 50 °C. Test every 2 °C from 34 to 46 °C.',['Says yes, with a reason.','Smaller steps near 40 °C.'])]
      ]
    },
    explain:{
      start:[
        ['Toolkit (c): describe frame','Complete: “As the temperature increases from ___ to ___ °C, the rate ___ from ___ to ___ s⁻¹.”',K('Describe frame completed','As the temperature increases from 10 to 40 °C, the rate increases from 0.0022 to 0.011 s⁻¹.',['Two temperatures.','Two rates with units.','Says “increases”.'])],
        ['Toolkit (d): two key pictures',IC('kwOptimum')+' <strong>optimum</strong>: where the rate is fastest. '+IC('kwDenatured')+' <strong>denatured</strong>: active site changed shape for good. Point to each region on the graph.',K('Regions matched','Optimum: region 2, the peak, about 40 °C. Denatured: region 3, the falling part.',['Optimum = region 2.','Denatured = region 3.'])],
        ['Describe the fall alone','Now try without the frame. Describe what happens from 40 °C to 60 °C. Use two numbers.',K('The fall described','As the temperature increases from 40 to 60 °C, the rate decreases from 0.011 s⁻¹ to about 0.',['40 and 60 °C.','Decreases to about 0.'])]
      ],
      understand:[
        ['Toolkit (c): rising frame','Words: <strong>kinetic energy</strong> · <strong>collide</strong> · <strong>enzyme–substrate complexes</strong>. Complete: “The molecules have more ___, so they ___ more often and form more ___.”',K('Rising frame completed','The molecules have more kinetic energy, so they collide more often and form more enzyme–substrate complexes.',['Kinetic energy.','Collide more often.','More complexes.'])],
        ['Explain the fall alone','Now try without the frame. Explain why the rate falls above the optimum. Use three bold words from the screen.',K('Fall explained','Above the optimum the active site changes shape. The substrate no longer fits. The enzyme is denatured.',['Active site changes shape.','Substrate no longer fits.','Denatured.'])]
      ],
      hot:[
        ['Which graph shows it is permanent?','Heat amylase to 60 °C, then cool it to 40 °C. Graph A: the rate comes back. Graph B: it stays near 0. Decide which shows denaturation. Justify it.',K('Graph B','Graph B. Denaturing is permanent: the active site stays changed, so cooling does not bring the rate back. In A it was not denatured.',['Chooses B.','Permanent shape change.','Explains why not A.'])],
        ['A hot-spring enzyme','A bacterium lives in a hot spring at about 80 °C. Predict how its enzyme’s graph differs from amylase’s. Justify your prediction.',K('Peak moves right','Its optimum is near 80 °C, so the peak moves right. Its active site keeps its shape at higher temperatures.',['Peak near 80 °C.','Shape stays at high temperature.'])]
      ]
    },
    ph:{
      start:[
        ['Toolkit (c): pH frame','Pepsin is done for you. Complete for amylase: “At pH ___ the active site has the right shape, so this is the optimum pH.” Then check on the model.',K('Amylase frame','At pH 7 the active site has the right shape, so this is the optimum pH.',['pH 7.','Uses the frame.'])],
        ['Find trypsin’s peak alone','Now try without the frame. Choose Trypsin. Move the slider one step at a time. Write the pH with the highest rate. If it says denatured, press New enzyme first.',K('Trypsin optimum','Trypsin is fastest at about pH 8.',['About pH 8.'])]
      ],
      understand:[
        ['Part-done: trypsin at pH 2',IC('kwDenatured')+' Complete: “At pH 2 trypsin’s ___ ___ has changed shape. The substrate no longer ___. The rate is about ___.”',K('Trypsin at pH 2','At pH 2 trypsin’s active site has changed shape. The substrate no longer fits. The rate is about 0.',['Active site.','Fits.','About 0.'])],
        ['Explain amylase at pH 2 alone','Now try without the frame. Explain why amylase hardly works at pH 2. Test it on the model.',K('Amylase at pH 2','pH 2 is far from amylase’s optimum, about pH 7. Its active site changes shape, so starch no longer fits. It is denatured.',['Far from pH 7.','Active site changes shape.','Substrate no longer fits.'])]
      ],
      hot:[
        ['One pH for all three?','A food company wants one pH where pepsin, amylase and trypsin all work fast. Decide if this is possible. Justify it with the optima.',K('No single best pH','No. The optima are about pH 2, 7 and 8. At pH 2 amylase and trypsin barely work; at pH 7–8 pepsin barely works.',['Clear decision: no.','Quotes the optima.','Names an enzyme that fails.'])],
        ['The buffer runs out','In a test at pH 8 the buffer runs out. The pH drifts to 6. Predict the effect on trypsin’s rate. Explain.',K('Rate falls','The rate falls. pH 6 is further from trypsin’s optimum, about 8. The active site changes shape, so fewer complexes form.',['Rate falls.','Away from the optimum.','Active site shape.'])]
      ]
    },
    selfCheck:{
      start:[
        ['A before → after fix','Before: “It goes down because it gets too hot.” After: “Above 37 °C the <strong>active site changes shape</strong>, so the substrate no longer fits.” Find one line of yours like Before.',K('Line chosen','You chose a line with no science word, then added one. The after line names the active site and the fit.',['A line chosen.','A bold science word added.'])],
        ['Toolkit (c): falling frame','Use the frame for (d): “Above the <strong>optimum</strong>, the <strong>active site changes shape</strong>. The substrate no longer fits. The enzyme is <strong>denatured</strong>.” Write it for 37 °C.',K('Frame for (d)','Above 37 °C, the optimum, the active site changes shape. The substrate no longer fits. The enzyme is denatured.',['Uses 37 °C.','Three bold ideas.'])],
        ['Fix a line alone','Now try without the frame. Rewrite your weakest line in green pen. Use one bold word from the toolkit.',K('Your green fix','The new line uses a key word correctly, e.g. denatured, active site or optimum, and is linked to the graph.',['Rewritten in green.','A key word used correctly.'])]
      ],
      understand:[
        ['Toolkit (a) step 4: units','Before: “Rate = 0.02.” After: “Rate = 0.02 s⁻¹.” Check every number you wrote. Add its unit.',K('Units added','Every value has a unit: °C for temperature, arbitrary units for the graph rate, s⁻¹ for 1 ÷ time.',['°C on temperatures.','Units on every rate.'])],
        ['Re-answer the hardest part','Now try without the frame. Close the toolkit. Re-answer the part you found hardest in one sentence.',K('Hardest part again','Your sentence matches the mark scheme for that part, with a unit or a key word.',['Matches the mark scheme.','No frame used.'])]
      ],
      hot:[
        ['Mark this answer','A pupil wrote for (d): “Fewer collisions, so the rate falls.” Award a mark out of 2. Justify your decision.',K('0 out of 2','0 marks. Above the optimum, molecules collide more, not less. Credit needs: the active site changes shape and the enzyme is denatured.',['Awards 0.','Collisions increase.','Names the creditworthy points.'])],
        ['Change the enzyme','An enzyme from a hot-spring bacterium has an optimum of 70 °C. Rewrite (d) for this enzyme, from 70 °C to 90 °C.',K('Changed optimum','From 70 to 90 °C the rate falls. Above 70 °C the active site changes shape, so the substrate no longer fits: denatured.',['Uses 70 °C.','Active site changes shape.','Denatured.'])]
      ]
    }
  };

  window.LESSON={
    course:'Year 10 Double Science (Biology)',
    number:1,unit:'Digestive enzymes',unitLesson:1,spec:'Pearson IGCSE Science (Double Award) · Biology',
    title:'Digestive-enzyme graphs',
    question:'What can an enzyme graph tell us, and why does it go up and then down?',
    path:['Check what you know','Read the graph','Explain the shape'],
    outcomes:[
      ['Read values, the optimum and a rate from an enzyme graph, with units.','2.11, 2.13 · maths skills'],
      ['Explain how temperature affects enzyme activity, including denaturation.','2.11'],
      ['Explain how pH affects enzyme activity by changing the active site.','2.13']
    ],
    vocabulary:[
      ['Enzyme','A biological catalyst. It speeds up a reaction and is not used up.'],
      ['Catalyst','Speeds up a reaction; not used up.'],
      ['Substrate','The molecule that fits the enzyme. Example: starch for amylase.'],
      ['Active site','The place where the substrate fits.'],
      ['Enzyme–substrate complex','The substrate fitted in the active site.'],
      ['Optimum','Where the rate is fastest: the optimum temperature or optimum pH.'],
      ['Denatured','Active site changed shape for good. The substrate no longer fits. Never “killed”: enzymes are not alive.'],
      ['Rate','How fast the reaction goes. Rate = 1 ÷ time. The unit is s⁻¹.'],
      ['Time','Measured in seconds (s). A shorter time means a faster rate.'],
      ['Kinetic energy','Energy of moving. More means more collisions.'],
      ['Amylase · maltose','Amylase: starch → maltose. Maltose is the sugar made when amylase digests starch.'],
      ['Pepsin · trypsin','Two proteases. Pepsin’s optimum is about pH 2, trypsin’s about pH 8.'],
      ['Axis · scale · unit','Axis: a line of the graph. Scale: what each square is worth. Unit: for example °C or s⁻¹.'],
      ['Arbitrary units','A relative scale for comparing rates. Write “arbitrary units” as the unit.']
    ],
    resourcePages:[
      {heading:'Ready to learn',text:'On your desk now.',items:['Mini-whiteboard, pen and green pen','Calculator','Your device: only for model screens, when asked']},
      {heading:'Graph toolkit',text:'Keep it open on your device: 4 steps, rate = 1 ÷ time, sentence frames and key words.',href:'01%20Resources/Graph%20toolkit.html',linkLabel:'Open the Graph toolkit'},
      {heading:'Lipase question frames',text:'Only after 2 minutes alone on the lipase question. One frame for each part.',href:'01%20Resources/Lipase%20question%20frames.html',linkLabel:'Open the frames'},
      {heading:'Enzyme graphs practice',text:'Three more graphs: worked, part-done, then on your own.',href:'01%20Resources/Enzyme%20graphs%20practice.html',linkLabel:'Open the practice'}
    ],
    modelPages:[
      {heading:'Key words model',text:'Enzyme, substrate, active site, complex.',action:{id:'key-words',label:'Open the key words model'}},
      {heading:'Graph toolkit',text:'4 steps, rate, frames, key words.',action:{id:'toolkit',label:'Open the toolkit'}},
      {heading:'Graph reader',text:'Drag to read the amylase graph.',action:{id:'read-graph',label:'Open the graph reader'}},
      {heading:'Explain the shape',text:'Describe, rising, optimum, falling.',action:{id:'explain-model',label:'Open the frame'}},
      {heading:'pH model',text:'Pepsin, then trypsin.',action:{id:'ph-pair',label:'Open the pH model'}}
    ],
    checkPages:[
      {heading:'Starting-point check',text:'Six quick answers.',action:{id:'do-now',label:'Open the check'}},
      {heading:'Your turn: read',text:'Rate at 20 °C, optimum, 1 ÷ 240.',action:{id:'your-turn-read',label:'Open your turn'}},
      {heading:'Graph check',text:'Why does the rate fall?',action:{id:'graph-hinge',label:'Open the hinge'}},
      {heading:'Lipase question',text:'Teacher-marked [6].',action:{id:'marked-question',label:'Open the question'}},
      {heading:'Exit check',text:'Three answers on your own [4].',action:{id:'exit',label:'Open the exit check'}}
    ],
    ai:{
      graphs:{
        prompt:'In your own words, explain how you find the optimum on a rate–temperature graph.',
        claim:'Optimum = highest temperature.',
        checks:['Find the highest point of the curve.','Read down to the temperature axis.','Rewrite the claim correctly.'],
        answer:K('Highest rate, not highest temperature','False. The optimum is where the rate is fastest: the peak, about 40 °C. The highest temperature, 60 °C, has a rate of about 0.',['Rejects the claim.','Optimum = fastest rate.','Quotes 40 °C and 60 °C.'])
      },
      temperature:{
        prompt:'In your own words, explain why an enzyme works slowly at 10 °C.',
        claim:'Cold kills enzymes.',
        checks:['Are enzymes alive?','Is the active site changed at 10 °C?','Rewrite the claim correctly.'],
        answer:K('Cold only slows','False. Enzymes are not alive, so they cannot be killed. Cold slows enzymes but does not denature them: less kinetic energy, fewer collisions. Warmed, they work again.',['Rejects “kills”.','Fewer collisions.','Not denatured.'])
      },
      ph:{
        prompt:'In your own words, explain why pepsin works fast at pH 2.',
        claim:'All enzymes work best at pH 7.',
        checks:['Test pepsin on the model.','Test trypsin on the model.','Rewrite the claim correctly.'],
        answer:K('Optima differ','False. Pepsin works best at about pH 2 and trypsin at about pH 8. Each enzyme has its own optimum pH. Evidence: the pH model.',['Rejects the claim.','A counterexample with its pH.','Names the evidence.'])
      }
    },
    uae:{
      label:'Food safety',
      pages:[
        {heading:'Dubai Food Code',text:'Dubai Municipality calls 5–60 °C the <strong>temperature danger zone</strong>: most harmful bacteria multiply fast. High-risk food should be at 5 °C or below, or 60 °C or above.',source:'https://dmpmedia.dm.gov.ae/uploads/2024/10/Food-Code-2013-English.pdf',sourceLabel:'Read the Food Code (Dubai Municipality, PDF)',note:'Official Dubai Municipality source · PDF page 34 (printed page 33), §3.2.3.1 · checked 18 Oct 2026'},
        {heading:'Why faster in summer?',text:'A box of chicken is left in a car at 45 °C for an hour. Use enzymes to explain why it spoils faster than in a cool kitchen.',note:'Hypothetical classroom scenario',answer:A([m('Warmth speeds enzymes','Bacteria use enzymes to grow and to break down food. Warmer means more kinetic energy and more collisions, so the enzymes work faster.'),m('So more spoiling','Bacteria multiply faster, and enzymes in the food break it down faster. The chicken spoils sooner.')],[c('Success criteria',['Enzymes in bacteria and food.','More kinetic energy, collisions.','Faster spoiling.'])])},
        {heading:'Fridge at 5 °C',text:'A shop keeps milk at 5 °C or below. Explain how this slows spoiling. Then explain why the milk spoils again if it is left out.',note:'Hypothetical classroom scenario',answer:A([m('Cold slows enzymes','At 5 °C molecules have less kinetic energy. They collide less often, so enzymes in microorganisms and the milk work slowly.'),m('Not denatured','Cold slows enzymes but does not denature them. If the milk warms up, they work faster again, so it spoils.')],[c('Success criteria',['Less kinetic energy, fewer collisions.','Not denatured.','Warming: spoils again.'])])},
        {heading:'Test a claim',text:'A post says: “The fridge kills the enzymes in food, so food in the fridge never spoils.” Evaluate the claim.',note:'Hypothetical classroom scenario',answer:A([m('Two errors','Enzymes are not alive, so they are not killed. Cold only slows them.'),m('Judgement','False. Food in a fridge still spoils, just more slowly. Use it by its date.')],[c('Success criteria',['Rejects “kills”.','Cold slows, not stops.','Clear judgement.'])])}
      ]
    },
    phases:[
      p('title','Title','title','Digestive-enzyme graphs','graphs'),
      p('welcome','Learning outcome','content','Welcome to Double Biology','graphs',{nav:'Welcome',mins:1,lead:'This is how we work together.',items:['<strong>3, 2, 1, show me:</strong> everyone holds up their whiteboard together.','<strong>Try first.</strong> Then use the support on the screen.','<strong>Green pen</strong> to improve an answer.','<strong>Devices</strong> only for the model screens, when asked.'],doThis:['Put your whiteboard, pen and green pen on the desk.','On your device, the lesson is on the 10/Bio/Dblx class page → Class resources.']}),
      p('outcomes','Learning outcome','outcome','What will you be able to do?','graphs',{nav:'Learning outcomes',mins:1}),
      p('do-now','Do now','content','Starting-point check','graphs',{nav:'Starting-point check',mins:5,items:['<strong>1</strong> An <strong>enzyme</strong> is a biological ___.','<strong>2</strong> <strong>Amylase</strong> breaks down starch into ___.','<strong>3</strong> <strong>Proteases</strong> make ___.','<strong>4</strong> <strong>Lipases</strong> make ___ and ___.','<strong>5</strong> The part of an enzyme where the substrate fits is the ___.','<strong>6</strong> “<strong>Denatured</strong>” means: <strong>A</strong> died · <strong>B</strong> active site changed shape for good · <strong>C</strong> cold.'],doThis:['No help first. Write each answer on your whiteboard. 3, 2, 1, show me.','Mark it in green. Show fist-of-five.']}),
      p('key-words','Input','model3d','Key words: how an enzyme works','temperature',{nav:'Key words model',mins:3,model:'enzyme',fallback:'enzymeFallback',modelState:{mode:'bind'},support:support.keyWords,caption:'Schematic model. Teal = enzyme. Gold = substrate. Drag to rotate.',steps:['The <strong>substrate</strong> moves to the <strong>active site</strong>: the place in the <strong>enzyme</strong> where it fits.','The substrate fits the active site. This is an <strong>enzyme–substrate complex</strong>.','The products have left. The enzyme is not changed. A new substrate can fit.'],stepStates:[{stage:0},{stage:1},{stage:3}],doThis:['Point to the active site. Say the word to your partner.']}),
      p('toolkit','Input','model','Your Graph toolkit','graphs',{nav:'Graph toolkit',mins:1,diagram:'toolkitCard',caption:'Graph toolkit. Also on your device: '+TK('(open in a new tab)')+'.',support:support.toolkit,steps:['<strong>(a) Read a graph</strong> in 4 steps. We use them on every graph today.','<strong>(b) Rate = 1 ÷ time.</strong> Press 1 ÷ 9 0 =. Round to 2 significant figures. Add s⁻¹.','<strong>(c) Sentence frames.</strong> Describe first. Then explain the rising and falling parts.','<strong>(d) Key words</strong> with pictures. Meanings: Resources → Key words.'],doThis:['Say the 4 steps of (a) with your partner.']}),
      p('read-graph','Input','model3d','Read a value from a graph','graphs',{nav:'Graph reader',label:'Worked example',mins:5,model:'graphReader',fallback:'readGraph',modelState:{temp:30,guide:0,touched:false},support:support.readGraph,caption:'Illustrative data: amylase. Rate = 1 ÷ end-point time. Drag or tap the graph.',steps:['<strong>1 · Axes.</strong> Read both labels and units. Across: temperature in °C. Up: <strong>rate</strong> in s⁻¹.','<strong>2 · One small square.</strong> Labels 0.002 and 0.004. Difference: 0.002. There are 4 squares. 0.002 ÷ 4 = 0.0005 s⁻¹.','<strong>3 · Rule a line.</strong> Go up from 30 °C to the curve. Then go across to the rate axis.','<strong>4 · Value and unit.</strong> The line meets the axis just above 0.0065. Write: about 0.0067 s⁻¹.','<strong>Rate = 1 ÷ time.</strong> At 40 °C the end-point took 90 s. 1 ÷ 90 = 0.011 s⁻¹.'],stepStates:[{temp:30,guide:0,touched:false},{temp:30,guide:1,touched:false},{temp:30,guide:2,touched:false},{temp:30,guide:3,touched:false},{temp:40,guide:4,touched:false}],doThis:['Step 2: 3, 2, 1, show me one square. After step 5, watch the board: 50 °C.']}),
      p('your-turn-read','Thinking','content','Your turn: read the graph','graphs',{nav:'Your turn: read',mins:4,diagram:'yourTurnGraph',caption:'Same graph, no reader. Illustrative data.',support:support.yourTurn,items:['<strong>(a)</strong> Rate at 20 °C = ___ s⁻¹','<strong>(b)</strong> The <strong>optimum</strong> is about ___ °C.','<strong>(c)</strong> 1 ÷ 240 = ___ s⁻¹ (2 significant figures)'],doThis:['Alone for 2 minutes. Then 3, 2, 1, show me.']}),
      p('explain-model','Input','model','Describe, then explain the shape','temperature',{nav:'Explain the shape',label:'Worked example · describe and explain',mins:5,diagram:'explainFrame',caption:'Illustrative data: amylase.',support:support.explain,steps:['<strong>Describe.</strong> As the temperature increases from 10 to 40 °C, the rate increases from 0.0022 to 0.011 s⁻¹. Then it falls.','<strong>1 Rising:</strong> more <strong>kinetic energy</strong>, so more <strong>collisions</strong>, so more <strong>enzyme–substrate complexes</strong>.','<strong>2 Optimum.</strong> The rate is fastest at about 40 °C. This is the <strong>optimum</strong>. Many human enzymes: about 37–40 °C.','<strong>3 Falling.</strong> The <strong>active site changes shape</strong>; the substrate no longer fits. More and more molecules are <strong>denatured</strong>: permanent.','<strong>Rejected:</strong> “the enzyme is killed”. Enzymes are not alive. Say <strong>denatured</strong>.'],ladder:[['Secure','Describe: use data.'],['Strong','Explain the rise.'],['Grade 8–9','Fall is permanent.']],doThis:['Write the falling line. 3, 2, 1, show me its key word.']}),
      p('graph-hinge','Assess','hinge','Why does the rate fall above the optimum?','temperature',{nav:'Hinge: the fall',mins:3,secure:true,lead:'Amylase: from 40 °C to 60 °C the rate falls to almost 0.',options:['The molecules move more slowly, so there are fewer collisions.','The active site changes shape, so the substrate no longer fits. The enzyme is denatured.','The heat kills the enzyme.','All the substrate has been used up.'],correct:1,task:'3, 2, 1, show me A, B, C or D. Then say why.'}),
      p('ph-pair','Thinking','model3d','pH: worked, then your turn','ph',{nav:'pH model',mins:6,model:'enzyme',fallback:'phGraph',modelState:{mode:'ph',enzyme:'pepsin',ph:2},support:support.ph,caption:'Also predict trypsin’s pH 2 rate, then 3, 2, 1, show me. Schematic model.',lead:'<strong>Worked, pepsin:</strong> “At pH 2 the active site has the right shape, so this is the <strong>optimum pH</strong>.”',doThis:['Predict trypsin’s optimum. Test it.']}),
      p('marked-question','Assess','content','Lipase question [6]','graphs',{nav:'Lipase question',label:'Original exam-style question',mins:8,secure:true,timer:8,diagram:'lipaseGraph',secondaryDiagram:true,caption:'<strong>Lipase</strong> digests lipids. Illustrative data.',items:['<strong>(a)</strong> Optimum temperature? <strong>[1]</strong>','<strong>(b)</strong> Rate at 20 °C, with unit? <strong>[1]</strong>','<strong>(c)</strong> Time at 30 °C: 50 s. Calculate the rate in s⁻¹. <strong>[2]</strong>','<strong>(d)</strong> Explain the change in rate from 37 °C to 60 °C. <strong>[2]</strong>'],doThis:['Close the Graph toolkit. Try every part alone for 2 minutes.','Stuck after 2 minutes? Open the <a href="01%20Resources/Lipase%20question%20frames.html" target="_blank" rel="noopener">frame for your part</a>. Write F next to that part.','Keep your board until it is marked.']}),
      p('self-check','Assess','content','Check, then fix in green','graphs',{nav:'Self-check',mins:3,diagram:'lipaseGraph',secondaryDiagram:true,caption:'Illustrative data: lipase.',support:support.selfCheck,text:'Tick each line you did in the lipase question.',items:['<strong>Read:</strong> my values have units.','<strong>Calculate:</strong> I wrote 1 ÷ 50 and the unit s⁻¹.','<strong>Describe:</strong> in (d) I said the rate falls to 0.','<strong>Explain:</strong> I used active site, fits and denatured.'],doThis:['Open the mark scheme. Tick each part. Fix one line in green.']}),
      p('exit','Assess','content','Exit: on your own','ph',{nav:'Exit check',label:'Exit check · 4 marks',mins:3,secure:true,diagram:'lipaseGraph',secondaryDiagram:true,caption:'Illustrative data: lipase.',lead:'No frames. On your device, show only <a href="01%20Resources/Graph%20toolkit.html#key-words" target="_blank" rel="noopener">toolkit part (d), Key words</a>.',items:['<strong>1</strong> Pepsin is put in pH 8. Explain why it stops working. <strong>[2]</strong>','<strong>2</strong> Use the graph. Give the rate at 45 °C, with its unit. <strong>[1]</strong>','<strong>3</strong> Next Monday you will heat amylase to different temperatures. Predict the temperature with the shortest end-point time. <strong>[1]</strong>'],doThis:['Answer on your whiteboard, on your own.']})
    ]
  };
})();
