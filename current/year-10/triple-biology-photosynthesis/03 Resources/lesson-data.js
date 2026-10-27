/* Lesson 3 · Leaf structure, light and gas exchange · Pearson 4XBI1.
   Original classroom practice. Public content only. Support pages carry their own hidden review.
   Scientific quality and content assistance are separate; these are flexible tools, not pupil tiers. */
(() => {
  const m=(heading,text)=>({heading,text});
  const c=(heading,items)=>({heading,items});
  const A=(models,criteria)=>({models,criteria,marks:null});
  const K=(heading,text,items)=>A([m(heading,text)],[c('Success criteria',items)]);
  const W=(heading,text,answer,extra={})=>({heading,text,answer,...extra});
  const p=(id,family,type,title,topic,extra={})=>({id,family,type,title,topic,...extra});
  const resource=(label,file,anchor='')=>({label,href:'03%20Resources/'+encodeURIComponent(file)+anchor});
  const criteria=[
    'Locate the structures accurately and trace the gas route.',
    'Explain two light adaptations: what the feature changes and why that helps.',
    'Explain two gas adaptations, including why the gas moves in that direction.'
  ];

  const shadeAnswer=A([
    m('The decision','More stomata do not supply light. Here light is limiting, so the extra pores alone do not establish a faster photosynthesis rate.'),
    m('When extra pores could matter','If CO₂ entry limits the rate and light and other conditions permit a higher rate, more open stomata may increase CO₂ supply. It is a conditional prediction.'),
    m('Keep the four links','Light: a broad surface intercepts light; transparent epidermis or chloroplast-rich palisade tissue supports light reaching/being absorbed by cells. Gas: pores connect air and internal spaces; a short path/internal mesophyll surfaces support diffusion.')
  ],[c('Depth criteria',['Use the supplied light limitation.','Explain why a gas pathway does not remove a light limit.','Give a defensible condition when CO₂ entry could matter.','Retain two light and two gas structure–function links.'])]);
  const floatingAnswer=A([
    m('Light features','Use the supplied arrangement: a broad upper surface intercepts light; the transparent upper epidermis lets light reach chloroplast-rich palisade tissue. Give two distinct links.'),
    m('Gas features','Upper stomata connect internal air spaces directly to air. Connected spaces and a short path allow gases to reach mesophyll surfaces. Net direction depends on each gas’s concentration gradient.'),
    m('Evaluate the submerged-pore proposal','Pores only on the submerged surface do not provide the same direct air pathway. Gases diffuse much more slowly through water. Stomata need not be underneath in every kind of leaf.')
  ],[c('Depth criteria',['Use air above and water below.','Explain two light and two gas features.','Use the supplied water/air diffusion fact.','Judge the proposed change with a mechanism, not a universal rule.'])]);
  const depth=[
    W('A shade-house decision','Hypothetical UAE nursery: A and B have equal exposed leaf area. B has more stomata per unit area. Light is limiting: extra CO₂ alone does not raise the rate; increasing light can. A grower says B must always photosynthesise faster. Explain your decision using two light and two gas links. After committing your judgement, answer the follow-up probe: when could extra open stomata matter?',shadeAnswer,{href:'03%20Resources/Adaptive%20practice.html#shade-house',linkLabel:'Open the shade-house design',note:'Use 45 seconds of the same 12-minute block for silent thinking. Commit your judgement before the probe. Keep language support if useful.'}),
    W('A floating-leaf design','The upper surface is in air; the lower surface is submerged. Gas diffusion is much slower through water than through air. First explain two light and two gas features in this supplied design. Then answer the follow-up probe: should all its stomata be on the submerged surface? Justify your judgement.',floatingAnswer,{diagram:'floating-leaf',href:'03%20Resources/Adaptive%20practice.html#floating-leaf',linkLabel:'Open the floating-leaf design',note:'Use 45 seconds of the same 12-minute block for silent thinking. Commit your feature links before the probe. Keep language support if useful.'})
  ];

  const lightSupport={
    language:[
      W('Understand the diagram words','Match each word to the diagram. Then complete: “Transparent means ___; the epidermis is ___.”',K('Terms in context','Transparent means light can pass through. The epidermis is a surface layer of cells. Palisade mesophyll is a layer inside the leaf; chloroplasts contain chlorophyll, which absorbs light.',['Meaning of transparent.','Epidermis located as a surface layer.']),{html:'<dl class="support-word-map"><dt>Transparent</dt><dd>Lets light pass through.</dd><dt>Epidermis</dt><dd>A surface layer of cells.</dd><dt>Mesophyll</dt><dd>Tissue inside the leaf.</dd><dt>Adaptation</dt><dd>A feature that helps a function.</dd></dl>',href:'03%20Resources/Adaptive%20practice.html#language',linkLabel:'Open the word map'}),
      W('Unpack “explain”','A name alone is not an explanation. Use the three empty boxes for one feature, in your book or on the sheet.',K('A complete link','For example: transparent upper epidermis → light passes through → chlorophyll in chloroplasts below can absorb light for photosynthesis.',['Name a precise property.','Include the physical effect.','Link that effect to photosynthesis.']),{html:'<ol class="causal-strip"><li>Feature: ___</li><li>What it changes: ___</li><li>Why that matters: ___</li></ol>'})
    ],
    route:[
      W('Follow light through the section','Use the supplied first arrow. Add the next destination and the place where light is absorbed.',K('Light route','Incoming light → transparent upper surface/epidermis → palisade cells → chlorophyll in chloroplasts absorbs light. The cuticle is a surface layer, not a gas-pumping structure.',['Route reaches photosynthesising cells.','Chlorophyll absorbs light.']),{diagram:'leaf-section',html:'<p class="partial-route">Incoming light → upper epidermis → ___ cells → ___ in chloroplasts</p>'})
    ],
    explanation:[
      W('Build one light explanation','Use one row. Supply the missing physical effect rather than adding “it helps photosynthesis”.',K('One possible completion','Transparent upper epidermis / light passes through it to cells below / chlorophyll absorbs light for photosynthesis.',['A feature and property.','A real effect on light.','A biological link.']),{html:'<table class="science-table"><thead><tr><th>Feature</th><th>Physical effect</th><th>Biological benefit</th></tr></thead><tbody><tr><td>Transparent upper epidermis</td><td>___</td><td>Light reaches chloroplasts below</td></tr><tr><td>Your different feature: ___</td><td>___</td><td>___</td></tr></tbody></table>',href:'03%20Resources/Adaptive%20practice.html#explanation',linkLabel:'Open the causal planner'}),
      W('Reduce the prompts','Close the worked row. Explain a different light feature using only these connectors. Brief private rehearsal or first-language notes may help you plan.',K('A different feature','For example: many chloroplasts in palisade cells near the illuminated surface allow light to be absorbed for photosynthesis. A broad lamina intercepts light over a large area.',['A different feature.','Its physical effect.','An accurate photosynthesis link.']),{html:'<p>The feature is ___. This allows ___. This matters because ___.</p>'})
    ],
    hot:depth
  };

  const gasSupport={
    language:[
      W('Separate the pore from its cells','Use the crop. Circle the opening and place one dot on a cell beside it.',K('Pore and guard cells','The stoma is the opening. The two guard cells border the opening and regulate its width. Stomata is the plural of stoma. Guard cells do not pump gases through the pore.',['Opening identified.','A bordering guard cell identified.']),{diagram:'stomata',html:'<dl class="support-word-map"><dt>Stoma</dt><dd>One pore/opening.</dd><dt>Guard cells</dt><dd>Cells bordering and regulating the pore.</dd><dt>Stomata</dt><dd>More than one stoma.</dd></dl>',href:'03%20Resources/Adaptive%20practice.html#stoma',linkLabel:'Open the large pore crop'}),
      W('Separate “route” from “direction”','Route means the places a gas passes through. Direction depends on the concentration difference. In your answer, underline the route and circle the concentration comparison.',K('Two different parts','The route includes a stomatal pore, internal air spaces and mesophyll surfaces. Net diffusion is from higher to lower concentration of that gas. A named pathway alone does not explain direction.',['A continuous route.','A separate concentration comparison.']),{html:'<p><strong>Route:</strong> Where does it pass?</p><p><strong>Direction:</strong> Where is this gas more concentrated?</p>',href:'03%20Resources/Adaptive%20practice.html#language',linkLabel:'Open the word map'})
    ],
    route:[
      W('Complete the CO₂ pathway','For a leaf with CO₂ higher outside, use the first two places supplied. Add the internal spaces and the receiving surface. Trace the same route on your outline.',K('CO₂ pathway','Outside air → open stomatal pore → internal air spaces → moist mesophyll surface → into the cell. CO₂ moves net inwards down its stated concentration gradient.',['Correct sequence.','Mesophyll surface/cell reached.','Higher outside to lower inside.']),{diagram:'route-scaffold',html:'<p class="partial-route">Outside air → open pore → ___ → ___ surface → cell</p>',href:'03%20Resources/Adaptive%20practice.html#route',linkLabel:'Open the partial route'}),
      W('Use the concentration difference','Imagine equal-size boxes with 8 CO₂ particles outside and 3 inside. Draw one net arrow, then explain it. The numbers are an illustrative comparison.',K('Net direction','The net arrow points from the outside box with 8 particles to the inside box with 3: higher to lower concentration. Individual particles still move both ways.',['Net direction follows the concentration difference.','Does not claim molecules move only one way.']),{html:'<div class="concentration-pair"><p><strong>Outside, same volume:</strong> ● ● ● ● ● ● ● ●</p><p><strong>Inside, same volume:</strong> ● ● ●</p></div><p>Net arrow: ___ because ___.</p>'}),
      W('Close the route strip','Keep enlargement/reading access, but close the content route. O₂ is higher inside than outside. Trace its net route on your own diagram and explain the direction.',K('Different gas and direction','Mesophyll → internal air spaces → open stoma → outside. O₂ diffuses net outwards because its concentration is higher inside than outside.',['Route reversed appropriately.','Uses the O₂ gradient.']),{note:'A different recheck after using support; not an extra compulsory worksheet.'})
    ],
    explanation:[
      W('Complete the air-space link','Use the partly completed row. Then explain a short diffusion path in a second row.',K('Connected spaces and short paths','Connected air spaces link open pores with mesophyll surfaces, allowing gases to diffuse between them. A shorter path reduces diffusion distance and can allow faster exchange under otherwise comparable conditions.',['Connection to cell surfaces.','A separate distance explanation.']),{html:'<table class="science-table"><thead><tr><th>Feature</th><th>Physical effect</th><th>Why it helps</th></tr></thead><tbody><tr><td>Connected air spaces</td><td>Link pores to ___</td><td>Gases can ___</td></tr><tr><td>Short diffusion path</td><td>___</td><td>___</td></tr></tbody></table>',href:'03%20Resources/Adaptive%20practice.html#explanation',linkLabel:'Open the causal planner'}),
      W('Keep the science; reduce the writing prompts','Use the empty connectors for a feature of your choice. Close the worked content first. Then try a different feature with fewer connectors.',K('An accurate causal chain','For example: the leaf is thin → gases have a short diffusion distance → gases can exchange with mesophyll cells more quickly under otherwise comparable conditions. Equivalent labelled chains are acceptable.',['Feature is specific.','Physical effect explains how.','Direction, if stated, uses the relevant gradient.']),{html:'<p>The feature is ___. This changes ___. Therefore ___.</p>',note:'Language support can stay available during demanding reasoning.'})
    ],
    hot:depth
  };

  const modelSupport={
    language:[lightSupport.language[1],gasSupport.language[1]],
    route:gasSupport.route,
    explanation:[
      W('Find the missing middle','Compare these two chains. Complete only the empty middle box, then improve the near-miss sentence.',K('The missing middle','Light can pass through the transparent epidermis to photosynthesising cells below. That is the physical link missing from “it is good for photosynthesis”.',['Names the physical effect.','Improves the explanation rather than making it longer.']),{html:'<p><strong>Near-miss:</strong> transparent epidermis → ___ → helps photosynthesis</p><p><strong>Useful chain:</strong> feature → physical effect → biological benefit</p>'}),
      ...gasSupport.explanation
    ],
    hot:depth
  };

  /* Page the scientific source separately from its existing task in projection view.
     Shared arrays are changed once; each source and task retains its own hidden review.
     Looking at the source is part of the same task and working time, not added practice. */
  const sourcePages={
    'leaf-section':()=>W('Leaf section: source','Locate the upper surface and palisade layer.',K('Source observation','The upper epidermis forms the upper surface cell layer. Palisade mesophyll lies below it in this typical terrestrial broad-leaf section.',['Locate the surface layer.','Locate the palisade tissue below it.']),{diagram:'leaf-section'}),
    stomata:()=>W('Pore and cells: source','Find the opening and its two bordering cells.',K('Source observation','The stoma is the opening between the two guard cells. An opening is not itself a guard cell.',['Opening located.','Bordering cells distinguished from the opening.']),{diagram:'stomata'}),
    'route-scaffold':()=>W('CO₂ pathway: source','Locate the supplied outside-air and pore anchors.',K('Source observation','The first anchor is outside air. The next is the open stomatal pore connecting the outside with the internal spaces.',['Identify outside air.','Identify the open pore.']),{diagram:'route-scaffold'}),
    'floating-leaf':()=>W('Floating leaf: source','Locate the air-exposed and submerged surfaces.',K('Source observation','The upper surface is exposed to air and the lower surface is submerged. The supplied drawing places stomata on the air-exposed upper surface.',['Use the supplied orientation.','Distinguish air exposure from submergence.']),{diagram:'floating-leaf'})
  };
  const pagedArrays=new Set(),pagedSources=new WeakMap();
  for(const support of [lightSupport,gasSupport,modelSupport]){
    for(const pages of Object.values(support)){
      if(pagedArrays.has(pages))continue;
      pagedArrays.add(pages);
      const split=pages.flatMap(page=>{
        if(!sourcePages[page.diagram])return [page];
        if(!pagedSources.has(page)){
          const {diagram,...taskPage}=page;
          pagedSources.set(page,[sourcePages[diagram](),taskPage]);
        }
        return pagedSources.get(page);
      });
      pages.splice(0,pages.length,...split);
    }
  }

  window.LESSON={
    number:3,unitLesson:3,unit:'Photosynthesis and plant gas exchange',spec:'Pearson 4XBI1',
    title:'The leaf: light and gases',
    question:'How does a leaf get light and gases to its cells?',
    path:['Annotate','Explain','Review and revise','Try a new example'],
    aiDecision:'considered-not-used',
    aiRationale:'Use your own scientific model, explanations, checks and revisions. No live AI task is needed in this lesson.',
    learningIntention:'Explain how leaf structures help light reach cells and gases move between those cells and air.',
    specificationPoints:[
      {code:'2.21',text:'describe the structure of the leaf and explain how it is adapted for photosynthesis'},
      {code:'2.40B',text:'understand the role of diffusion in gas exchange'},
      {code:'2.42B',text:'understand how the structure of the leaf is adapted for gas exchange'},
      {code:'2.43B',text:'describe the role of stomata in gas exchange'}
    ],
    outcomes:[
      ['Locate leaf structures and trace a gas route.','2.21 · 2.43B'],
      ['Explain how two leaf features support light capture.','2.21'],
      ['Explain gas-exchange features and the direction of net diffusion.','2.40B · 2.42B · 2.43B']
    ],
    criteria,
    vocabulary:[
      ['Adaptation','A feature that helps a structure carry out its function.'],
      ['Transparent','Light can pass through.'],
      ['Epidermis','A surface layer of cells.'],
      ['Mesophyll','Tissue inside a leaf; palisade and spongy mesophyll contain photosynthesising cells.'],
      ['Chloroplast','A cell structure containing chlorophyll, which absorbs light.'],
      ['Stoma / stomata','One pore / more than one pore in the epidermis.'],
      ['Guard cells','Cells that regulate the opening of a stomatal pore. They do not pump gases.'],
      ['Diffusion','Net movement of particles from higher to lower concentration.'],
      ['Concentration gradient','A difference in the concentration of a substance between places.'],
      ['Net','The overall result after movement in both directions is considered.'],
      ['Diffusion distance','The length of the path a diffusing substance travels.'],
      ['Xylem / phloem','Xylem carries water and mineral ions; phloem transports dissolved sugars.']
    ],
    resourcePages:[
      {heading:'Your working copy',text:'Use your book and the supplied outline, or the designed typed/annotated equivalent. Keep your first attempt and show revisions.',href:'03%20Resources/Leaf%20response%20sheet.html',linkLabel:'Open the leaf response sheet'},
      {heading:'Reading and enlargement',text:'The same science in a clear reading view, with a large section and diagram-linked vocabulary.',href:'03%20Resources/Leaf%20reading.html',linkLabel:'Open the reading view'},
      {heading:'Use the leaf model',text:'A schematic typical terrestrial broad leaf. Explore the section and pore; the model does not calculate photosynthesis rates.',href:'03%20Resources/Leaf%20model.html',linkLabel:'Open the leaf model'},
      {heading:'Matched practice tools',text:'Word map, pore crop, partial route, causal planner and changed-condition designs. Select a tool from the barrier in your current work.',href:'03%20Resources/Adaptive%20practice.html',linkLabel:'Open the practice tools'}
    ],
    modelPages:[
      {heading:'Where light reaches cells',text:'Locate the upper surface, palisade layer and chloroplasts.',action:{id:'leaf-light',label:'Return to the light model'}},
      {heading:'Where gases move',text:'Connect the stomatal pore, air spaces and mesophyll surfaces.',action:{id:'leaf-gas',label:'Return to the gas model'}},
      {heading:'Explain how a feature works',text:'Compare the near-miss with a causal explanation.',action:{id:'explanation-model',label:'Return to the worked comparison'}}
    ],
    checkPages:[
      {heading:'CO₂ route check',text:'Choose a route and justify it using the stated concentration difference.',action:{id:'co2-hinge',label:'Open the route check'}},
      {heading:'Your independent product',text:'Annotated section, two light explanations and two gas explanations.',action:{id:'independent',label:'Open the independent task'}},
      {heading:'Fresh individual check',text:'A different section and a new stated condition. Close content help before answering.',action:{id:'fresh-check',label:'Open the fresh check'}}
    ],
    ai:{},
    uae:{
      label:'A shade-house decision',
      pages:[{heading:'Which leaf design helps here?',text:depth[0].text,note:depth[0].note+' Hypothetical nursery; not measured data or a claim about a particular species.',href:'03%20Resources/Adaptive%20practice.html#shade-house',linkLabel:'Open the shade-house design',answer:shadeAnswer}]
    },
    phases:[
      p('do-now','Do now','content','Retrieve the science you will need','leaf',{nav:'Do now',mins:4,lead:'Answer individually from memory, in your book or on your whiteboard.',items:['<strong>1</strong> Name two substances used and two made in photosynthesis.','<strong>2</strong> Where in a cell does photosynthesis happen? What does chlorophyll do?','<strong>3</strong> A gas is more concentrated in A than B. State its net diffusion direction.'],doThis:['Show all three responses when asked.','After review, correct one gap.']}),
      p('outcomes','Learning outcome','outcome','What will your explanations show?','leaf',{nav:'Outcomes and criteria',mins:1,lead:'Read the learning intention and criteria. Locate where you will record your work.',criteria,task:'Use the response outline with your book or typed equivalent: annotate → explain → review → new example.',resources:[resource('Open the response sheet','Leaf response sheet.html')]}),
      p('leaf-light','Input','model3d','How does light reach the cells?','leaf',{nav:'Leaf and light',mins:5,model:'leaf',fallback:'leaf-section',modelState:{view:'section',focus:'light',labels:true,route:false},caption:'Typical terrestrial leaf section. Not to scale.',support:lightSupport,steps:['Locate the <strong>cuticle</strong> and <strong>upper epidermis</strong>. Light passes through to cells below. The cuticle also reduces water loss.','Find <strong>palisade mesophyll</strong> near the illuminated surface. Its many <strong>chloroplasts</strong> contain chlorophyll, which absorbs light.','Find a <strong>vein</strong>: xylem delivers water; phloem carries dissolved sugars away.','Label the outline and draw incoming light. <strong>Which epidermis property lets light through?</strong>'],criteria:['Labels point to the named structures.','Link a property to what happens to light.'],doThis:['Label the supplied outline; add the light arrow.','Explain how transparency lets light reach cells.'],resources:[resource('Explore the model','Leaf model.html'),resource('Read the explanation','Leaf reading.html')]}),
      p('leaf-gas','Input','model3d','How does a gas reach mesophyll cells?','gas',{nav:'Leaf and gases',mins:4,model:'leaf',fallback:'leaf-section',modelState:{view:'section',focus:'gas',labels:true,route:false},caption:'Leaf section: spaces, surfaces and pores. Not to scale.',support:gasSupport,steps:['Find <strong>spongy mesophyll</strong> and connected <strong>air spaces</strong>. They expose cell surfaces to air. Gases dissolve in moisture before entering cells.','Find the <strong>lower epidermis</strong>, <strong>stomatal pore</strong> and <strong>guard cells</strong>. Guard cells regulate the opening; they do not pump gases.','CO₂ is higher outside than inside. Net diffusion follows this <strong>gradient</strong> inward through the pore and air spaces. The <strong>pore</strong> provides access.','Trace CO₂ from outside air to a mesophyll cell on your outline. Explain why its net movement is inward here.'],criteria:['Trace a continuous route to a cell.','Use the stated concentration difference.'],doThis:['Add the labels and gas route.','Use concentration to explain direction.'],resources:[resource('Open the response sheet','Leaf response sheet.html')]}),
      p('stoma-check','Thinking','content','Can you distinguish the pore and cells?','gas',{nav:'Pore or cell?',mins:1,diagram:'stomata',secondaryDiagram:true,caption:'Surface view of one stomatal pore and its guard cells; schematic.',modelState:{labels:false,route:false},support:gasSupport,items:['Circle the <strong>opening</strong> on the supplied crop.','Put a small dot on <strong>one guard cell</strong>.','State what guard cells regulate.'],criteria:['Distinguish an opening from the cells beside it.'],doThis:['Show your own response when asked.']}),
      p('explanation-model','Input','model','What is missing from this explanation?','explain',{nav:'Model a causal explanation',mins:5,diagram:'leaf-section',caption:'Use the diagram to explain a physical link, not to copy a paragraph.',support:modelSupport,steps:['Read the near-miss: <strong>“The upper epidermis is transparent, so it is good for photosynthesis.”</strong> What physical link is missing?','I started with <strong>“good for photosynthesis”</strong>. That hides how. I correct it: <strong>“The transparent upper epidermis lets light pass to palisade cells, where chlorophyll in chloroplasts absorbs it for photosynthesis.”</strong>','Locate <strong>feature → physical effect → biological benefit</strong> in the corrected explanation. Explain why the near-miss needs a link, not simply more words.'],criteria:['Identify the missing physical mechanism.','Connect that mechanism to the leaf’s function.'],doThis:['Underline the physical effect in the supplied comparison.','Explain the missing link in your own words.']}),
      p('guided-airspaces','Thinking','content','Complete the air-space explanation','explain',{nav:'Guided: connected spaces',mins:2,diagram:'route-scaffold',secondaryDiagram:true,caption:'Use the partial route to connect outside air and cell surfaces.',support:modelSupport,text:'Complete the supplied chain in your book or on the response sheet.',items:['<strong>Air spaces connect ___ to ___.</strong>','<strong>This allows gases to ___.</strong>'],criteria:['Identify what the spaces connect.','Explain a physical effect on gas movement.'],doThis:['Complete the chain, then explain one arrow.','Use a labelled causal diagram if it expresses the same science.'],resources:[resource('Open the partial route','Adaptive practice.html','#route')]}),
      p('guided-thin','Thinking','content','Explain a different feature','explain',{nav:'Guided: diffusion distance',mins:2,label:'Original exam-style practice · 2 marks',support:gasSupport,lead:'Try this without the completed air-space example.',text:'<strong>Explain</strong> how a thin leaf is adapted for gas exchange. <strong>[2]</strong>',criteria:['Name the physical consequence of thinness.','Connect that consequence to gas exchange.'],doThis:['Write an explanation or a labelled causal chain.','Keep necessary access tools; reduce content prompts when ready.']}),
      p('co2-hinge','Assess','hinge','How does CO₂ enter this leaf?','gas',{nav:'CO₂ route check',mins:3,secure:true,lead:'CO₂ concentration is lower in the mesophyll than in outside air. Choose the main route and explain its net direction.',options:['Through the waxy cuticle directly to the cells.','Through open stomata and internal air spaces, by diffusion.','Up the xylem from the roots as the leaf’s CO₂ supply.','Guard cells pump CO₂ into the leaf.'],correct:1,task:'Choose A–D. Give a short reason in your book. Show your response when asked.'}),
      p('route-recheck','Assess','content','Use a different gas to recheck','gas',{nav:'Route recheck if directed',mins:2,optional:true,contingency:true,secure:true,label:'Adaptive reserve · if directed',lead:'O₂ concentration is higher inside this leaf than outside.',items:['Trace its net route out of the leaf on your own outline.','Explain what causes this net direction.'],doThis:['Close the answer-bearing route strip.','Keep enlargement, reading and appropriate response tools.']}),
      p('independent','Assess','content','Build your four explanations','explain',{nav:'Independent product',mins:12,label:'Individual practice · content help recorded separately',diagram:'leaf-outline',secondaryDiagram:true,modelState:{labels:false,route:false},allowRoute:false,routeReveal:false,caption:'Use the supplied outline. Do not spend this time copying a complete section.',support:modelSupport,criteria,lead:'Work individually in your book or on the designed response sheet.',items:['<strong>1</strong> Complete the labels. Trace CO₂ from air to a mesophyll cell; CO₂ is higher outside.','<strong>2</strong> Explain <strong>two light</strong> features.','<strong>3</strong> Explain <strong>two gas-exchange</strong> features.','<strong>4</strong> Check how each feature works.'],doThis:['Keep your first attempt and note content help.','Depth may replace familiar practice; retain language support.'],resources:[resource('Open the response sheet','Leaf response sheet.html')]}),
      p('review-gap','Thinking','content','Find a scientific link to improve','explain',{nav:'Review one explanation',mins:2,support:modelSupport,lead:'Choose one explanation. Keep your first attempt visible.',items:['Use the criteria to identify a specific scientific gap.','Open its model only after your attempt.','Choose one change: add a physical effect, explain the direction, or state a condition.'],criteria:['Point to evidence in your own work.','Identify a precise scientific improvement.'],doThis:['Mark the sentence or arrow you will improve.','If it is already sound, strengthen its precision or condition.']}),
      p('revision','Thinking','cases','Make the feedback change your work','explain',{nav:'Revise and check',mins:4,support:modelSupport,cases:[['Feature named; effect missing','Add what the feature changes physically.'],['Route drawn; direction unexplained','Add which concentration is higher and why the net movement follows.'],['Mechanism sound; claim too broad','State a condition under which the prediction holds.']],criteria:['Show a visible scientific change.','Use the improved link in a second explanation where possible.'],doThis:['Revise in a different colour or mark the changed text.','Show the changed link when asked. Keep both versions.']}),
      p('fresh-check','Assess','content','Apply the idea to a new condition','gas',{nav:'Fresh individual check',mins:3,secure:true,label:'Fresh check · individual response',diagram:'leaf-transfer',secondaryDiagram:true,modelState:{labels:false,route:false},allowRoute:false,routeReveal:false,caption:'New orientation and a longer-path comparison. Schematic, not to scale.',lead:'CO₂ is higher inside than outside. Use this stated difference; you need not explain why it arose. B has the same surface area and number of open pores as A, but a longer internal diffusion path. Other conditions are the same.',items:['<strong>1</strong> Trace the net CO₂ route in A. Explain its direction.','<strong>2</strong> Explain how B’s longer path could affect gas exchange.'],doThis:['Answer separately, without content hints, worked examples or models.','Keep necessary enlargement, reading and appropriate response tools.']})
    ]
  };
})();
