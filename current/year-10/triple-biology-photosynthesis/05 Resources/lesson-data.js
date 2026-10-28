/* Lesson 5 · A plan that convinces a sceptic · Pearson 4XBI1 (2.45B; return of 2.41B, 2.44B; L3 books).
   Built 28 October 2026 from the teacher-confirmed design (Confirmed at stage 6, 28 October 2026).
   Original classroom material. Public content only: no pupil names, identifiers or needs.
   Feedback codes are introduced here for the first time. The teacher codes the work; pupils never self-code.
   Every code always appears with its words beside the letter. Board activities are fixed; rechecks use new values.
   Plan support is named in words (plain-words key); the teacher confirms and rechecks.
   Every task, code recheck, support recheck, depth card and fresh-check item has its own hidden review.
   14 timed screens = 47 core minutes; collect (1) and slack (2) are on the teacher route only. */
(() => {
  const m=(heading,text)=>({heading,text});
  const c=(heading,items)=>({heading,items});
  const A=(models,criteria,marks=null)=>({models,criteria,marks});
  const K=(heading,text,items)=>A([m(heading,text)],[c('Success criteria',items)]);
  const W=(heading,text,answer,extra={})=>({heading,text,answer,...extra});
  const p=(id,family,type,title,topic,extra={})=>({id,family,type,title,topic,...extra});
  const resource=(label,file,anchor='')=>({label,href:'05%20Resources/'+encodeURIComponent(file)+anchor});

  /* ---------- Numbers used on screen (all illustrative; re-checked by the build check) ---------- */
  const DATA={
    // Fresh check 2: illustrative pH after 60 min; every tube started at pH 8.3
    freshPH:{start:8.3,tubes:['10 cm','40 cm','dark','no beads, 10 cm'],pH:[9.0,8.4,7.9,8.3]},
    // Strong plan: 3 leaf tubes at each of 3 distances + 3 foil tubes; one no-leaf control at each distance
    plan:{distances:[10,20,40],repeats:3,darkTubes:3,controls:3,discs:5,volume:10,minutes:60},
    // Hinge recheck: a probe that reads 0.3 too high in every tube (illustrative)
    probeOffset:0.3
  };
  DATA.freshPH.change=DATA.freshPH.pH.map(x=>Math.round((x-DATA.freshPH.start)*10)/10);
  DATA.plan.leafTubes=DATA.plan.distances.length*DATA.plan.repeats+DATA.plan.darkTubes;
  DATA.plan.totalTubes=DATA.plan.leafTubes+DATA.plan.controls;
  const fmt=n=>n>0?'+'+n.toFixed(1):n<0?'−'+Math.abs(n).toFixed(1):'0.0';
  const dataTable=(rows,caption='')=>`<table class="science-table data-table">${caption?`<caption>${caption}</caption>`:''}<thead><tr>${rows[0].map(h=>`<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rows.slice(1).map(r=>`<tr>${r.map((x,i)=>i===0?`<th scope="row">${x}</th>`:`<td>${x}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  const F=DATA.freshPH;
  const phTable=dataTable([['Tube',...F.tubes],['pH after 60 min',...F.pH.map(x=>x.toFixed(1))]],'Illustrative pH readings, not real data. Every tube started at pH 8.3. Higher pH = less CO₂.');

  /* ---------- The unit's feedback codes (agreed 28 Oct; same letters all unit; words always beside the letter) ---------- */
  const CODES={
    R:{words:'Both rates',meaning:'Name both processes and say which is faster.'},
    S:{words:'Sign and direction',meaning:'Say which way the gas moves overall, for the gas asked, and why (the sign or the gradient).'},
    L:{words:'Limiting factor',meaning:'Say light is no longer limiting and name the factor that is, using the conditions given.'},
    J:{words:'Judge the claim',meaning:'Match the claim to the evidence: the indicator shows CO₂ only; use the control; say how strong.'},
    H:{words:'How and why',meaning:'Turn a vague step into an action with a value (how), and say what else would change the result if you didn’t (why).'},
    T:{words:'Take it further',meaning:'Your answer is secure: extend it.'}
  };
  const ORDER=['R','S','L','J','H','T'];
  const chip=k=>`<span class="code-chip"><b>${k}</b> ${CODES[k].words}</span>`;
  const named=k=>`${k} · ${CODES[k].words}`;
  const plain=t=>String(t).replace(/<[^>]+>/g,'').replace(/&gt;/g,'>').replace(/&lt;/g,'<').replace(/&amp;/g,'&');
  const board=(texts,title,caption)=>`<figure class="bio-figure code-board-figure">${window.BioDiagrams.render('code-board',{cells:ORDER.map(k=>[k,CODES[k].words,plain(texts[k])]),title})}<figcaption>${caption}</figcaption></figure>`;

  // Fixed board activities (the same every time a code is used)
  const ACTIVITY={
    R:'Budget card: write <strong>P __ R</strong> (&gt;, &lt; or =). Rewrite: “___ is faster than ___, so overall ___.”',
    S:'Write <strong>net = in − out</strong>, with its sign. Then: “[gas] moves ___ overall because ___.”',
    L:'Graph strip: mark the region. Then: “Light is no longer limiting; ___ now limits photosynthesis.”',
    J:'Claim ladder: proves, supports or cannot tell. Use the control. Give one way to make it stronger.',
    H:'Fair-test row: <strong>Factor</strong> | <strong>How</strong> (action + value) | <strong>Why</strong> (what else would change it if you didn’t).',
    T:'Depth card in HOT: <em>The ceiling</em>, part (a). Then its recheck.'
  };
  // Rechecks for this return: new values, answered in books with the card closed
  const RECHECK={
    R:'Duckweed in dim light: P = 6, R = 6 (a.u. per hour). A pupil writes: “The plant has stopped respiring.” Correct it using both rates.',
    S:'Lesson 4: moss, O₂ produced 2, used 5. Net O₂ and direction? Lesson 3: a leaf wrapped in foil at midday. Which way does CO₂ move, and by what route?',
    L:'Seaweed at a constant 25 °C: net O₂ production is the same at light 40 and 60. Explain why.',
    J:'Bright light: a leaf tube went orange-red → purple; its no-leaf control stayed orange-red; one tube. Claim, and how strong?',
    H:'“Keep the temperature the same” in a lamp experiment. Rewrite it with how and why.',
    T:'Bright light: a leaf tube is still orange-red after 6 hours; its no-leaf control is unchanged. Did the leaf do nothing? Explain.'
  };
  const RECHECK_A={
    T:K('Recheck model','No. Respiration continues all the time. Orange-red means no net change, so photosynthesis was roughly balancing respiration: another factor (for example CO₂ concentration, or an old or damaged leaf) limited photosynthesis even in bright light. A probe at intervals could show small changes that the eye cannot.',['Respiration continues.','No net change read as the rates balancing, not “nothing”.','A reason photosynthesis was limited, and a better measure.']),
    R:K('Recheck model','Respiration has not stopped: it continues all the time. P and R are equal (6 and 6), so there is no net exchange of CO₂, but both processes are still happening.',['Respiration continues.','Both rates named and compared: equal.','No net exchange, not “nothing happening”.']),
    S:A([m('Lesson 4 version','Net O₂ = 2 − 5 = −3: the moss takes in O₂ overall, 3 a.u. per hour, because respiration uses O₂ faster than photosynthesis produces it.'),m('Lesson 3 version','In the dark the leaf only respires, so CO₂ builds up in the air spaces and is higher there than outside. CO₂ diffuses from the cells into the air spaces and out through the stomata, down its concentration gradient.')],[c('Success criteria',['The sign worked out and turned into a direction for the gas asked.','The reason: which rate is faster, or which way the gradient runs.','Lesson 3: the route in order, outwards, down the gradient.'])]),
    L:K('Recheck model','Light is no longer the limiting factor. Another factor now limits, such as CO₂ concentration, or temperature even though it is held at 25 °C. Respiration is unchanged.',['Light named as no longer limiting.','Another factor named: CO₂ concentration, or temperature (constant does not mean optimal).','Respiration unchanged.']),
    J:K('Recheck model','The result supports net CO₂ uptake: photosynthesis was faster than respiration. The control rules out the indicator changing by itself. The claim is weak: one tube, judged by eye, so repeat it or use a probe.',['“Supports”, not “proves”.','The control used.','A limit and one way to strengthen it.']),
    H:K('Recheck model','Put a water-filled glass tank between the lamp and the tubes, or use an LED, and check with a thermometer beside the tubes, because temperature changes the rates of photosynthesis and respiration.',['An action with a method (tank, LED, thermometer).','A why: temperature changes both rates.','Not “keep it fair”.'])
  };

  /* ---------- Code scaffolds (Adaptation tabs on the response screens; the code-board device page) ---------- */
  const frame=s=>`<p class="code-frame">${s}</p>`;
  const ladderHtml='<ol class="claim-ladder"><li><b>proves</b> no other explanation is possible</li><li><b>supports</b> fits the evidence, with a control</li><li><b>cannot tell</b> the evidence cannot decide</li></ol>';
  const rowTable=(rows,blank=true)=>`<table class="science-table fair-test"><thead><tr><th scope="col">Factor</th><th scope="col">How (action + value)</th><th scope="col">Why (what else would change the CO₂)</th></tr></thead><tbody>${rows.map(([f,h,w])=>`<tr><th scope="row">${f}</th><td>${h??(blank?'<span class="blank"></span>':'')}</td><td>${w??(blank?'<span class="blank"></span>':'')}</td></tr>`).join('')}</tbody></table>`;
  const SCAFFOLD={
    R:{text:'Two arrows, one net. Compare the two rates first.',diagram:'co2-budget-blank',html:frame('P <span class="blank"></span> R &nbsp; (&gt;, &lt; or =)')+frame('“___ is faster than ___, so overall ___.”')},
    S:{text:'Work out the sign, then turn it into a direction for the gas the question asks about.',html:frame('net = in − out = <span class="blank"></span> &nbsp; sign: + or −')+frame('“[gas] moves ___ overall because ___.”')+frame('For a route: higher concentration in ___ → lower in ___, so the gas moves ___.')},
    L:{text:'Find the flat part of the graph. Read the conditions given before you name a factor.',diagram:'region-strip',html:frame('“Light is no longer limiting; ___ now limits photosynthesis.”')},
    J:{text:'Pick the rung that fits the evidence, then use that word.',html:ladderHtml+frame('“The evidence ___ the claim, because the control ___.”')+frame('“To make it stronger: ___.”')},
    H:{text:'One row for the vague step. Fill in how (an action with a value) and why.',html:rowTable([['Your step',null,null]])}
  };
  const codeCards={};
  for(const k of ['R','S','L','J','H']){
    codeCards[k]=[
      W(named(k),`${CODES[k].meaning} ${SCAFFOLD[k].text}`,K('Using the board activity',`Board activity: ${ACTIVITY[k].replace(/<[^>]+>/g,'')} The changed line is written in a different pen, on the answer that was coded.`,['The board activity is done on the coded answer.','A different pen; the first attempt is kept.','The changed line now does what the code says.']),{diagram:SCAFFOLD[k].diagram,html:`<p><strong>Board activity:</strong> ${ACTIVITY[k]}</p>`+SCAFFOLD[k].html,href:'05%20Resources/code-board.html#'+k,linkLabel:'Open this code on your device'}),
      W(named(k)+' · recheck (new values)','Close the card first. '+RECHECK[k],RECHECK_A[k],{note:'Answer in your book with the card closed.'})
    ];
  }

  /* ---------- Plan support (handed out in words; the reasoning stays with the pupil) ---------- */
  const fairTest=[
    W('Fair-test table','For each factor, write how (an action with a value) and why (what else would change the CO₂ if you didn’t). The first row is an example: it is sensible, but it earns no mark.',K('Using the fair-test table','Each row names an action with a value and a reason about CO₂. For example: Temperature | LED plus a water tank, checked with a thermometer | warming changes the rates of photosynthesis and respiration and can change the indicator.',['Each “how” is an action with a value, not “keep it the same”.','Each “why” says what else would change the CO₂.','The example row is not counted as a mark.']),{html:rowTable([['Who reads the colour','The same person reads every tube','Sensible, but no mark: it does not stop anything else changing the CO₂'],['Indicator',null,null],['Temperature',null,null],['Leaf',null,null],['Time',null,null],['Seal',null,null],['Control',null,null],['Repeats',null,null]]),href:'05%20Resources/support-cards.html#fairtest',linkLabel:'Open the fair-test table on your device'}),
    W('Fair-test table · recheck (new case)','Close the card first. Woodlice above indicator in water baths at 15 °C and 25 °C: give how and why for the number of woodlice.',K('Recheck model','The same number and total mass of woodlice in every tube (for example 5, weighed), because more animal tissue respires more CO₂.',['Same number and mass.','Why: more tissue, more CO₂.']),{note:'Answer in your book with the card closed.'})
  ];
  const skeleton=[
    W('Plan skeleton','Numbered starters. Write each step as an action with a value. After two steps are right, turn to the faded version.',K('Using the plan skeleton','Each finished step is an action someone else could follow, with a value and, for a kept-the-same step, a reason. For example: “Change the light by placing an LED at 10, 20 and 40 cm from the tubes.”',['Each step is numbered and is an action.','Values are given.','“Keep … the same” steps say how and why.']),{html:'<ol class="frame-list"><li>Set up … (what, how much, from where)</li><li>Change the light by … (values)</li><li>Keep ___ the same by …, because …</li><li>Control: …</li><li>Measure … at the start and after …</li><li>Repeat … and calculate …</li></ol>',href:'05%20Resources/support-cards.html#skeleton',linkLabel:'Open the plan skeleton on your device'}),
    W('Plan skeleton · faded','After two correct steps, use this version: only the first word of each step is left.',K('Using the faded skeleton','The steps still give actions with values and reasons; the skeleton now gives only the first word.',['Steps written with the faded skeleton.','Each step still has a value or a reason.']),{html:'<ol class="frame-list"><li>Set up …</li><li>Change …</li><li>Keep … because …</li><li>Control …</li><li>Measure …</li><li>Repeat …</li></ol>'}),
    W('Plan skeleton · recheck (new case)','Close the card first. In a plan on the effect of <strong>temperature</strong> on a leaf’s net gas exchange, write the step that changes the temperature, with values.',K('Recheck model','“Place the tubes in water baths at 15, 20, 25 and 30 °C, checked with a thermometer.”',['An action with values.','Temperature is the changed variable.']),{note:'Answer in your book with the card closed.'}),
  ];
  const unpacker=[
    W('Question unpacker','What the words in the question ask you to do.',K('Using the unpacker','“Describe how you could investigate” wants numbered steps someone else could follow. “Valid” means only light differs between the tubes. “Quantitative” means a number, not a colour word.',['Steps, not a paragraph about fairness.','Every other factor controlled, with a method.','A number from an instrument.']),{html:'<dl class="support-word-map"><dt>“Describe how you could investigate”</dt><dd>numbered steps someone else could follow</dd><dt>“valid”</dt><dd>only light differs between the tubes</dd><dt>“quantitative”</dt><dd>a number, not a colour word</dd><dt>“net gas exchange”</dt><dd>the overall CO₂ change from photosynthesis and respiration together</dd></dl>',href:'05%20Resources/support-cards.html#unpacker',linkLabel:'Open the unpacker on your device'}),
    W('Question unpacker · recheck (new case)','Close the card first. “Valid results for the effect of temperature on respiration of germinating seeds”: name two variables to control, each with a method.',K('Recheck model','Any two, each with a method: the same mass of seeds (weigh 10 g); the same volume of indicator (10 cm³ by syringe); the same time (a timer, 20 minutes); in the dark (wrap in foil, so no photosynthesis from any shoots).',['Two controlled variables.','A method for each, not just “keep the same”.']),{note:'Answer in your book with the card closed.'})
  ];
  const glossary=[['equilibrate','bubble air through the indicator until its colour stops changing, so every tube starts the same'],['systematic error','an error that shifts every reading the same way; repeats do not remove it'],['repeatable','similar results when you repeat the method'],['valid','the results answer the question: only the factor you changed affects them'],['quantitative','measured as a number'],['colorimeter','a machine that measures colour as a number'],['calibrate','check an instrument against a standard of known value, then correct it'],['control','a tube set up the same way, with no leaf'],['indicator','hydrogencarbonate indicator changes colour with CO₂; it is not an O₂ test'],['net','the overall result of photosynthesis and respiration together']];
  const access={
    colours:{heading:'Colour words',text:'Every colour has a word. Read the word as well as the colour. The indicator shows CO₂ change only: it is not an O₂ test.',diagram:'indicator-list'},
    words:{heading:'Key words',text:'Plain-English meanings. Read-aloud and larger text are on the device page.',html:`<dl class="support-word-map">${glossary.map(([a,b])=>`<dt>${a}</dt><dd>${b}</dd>`).join('')}</dl>`,href:'05%20Resources/support-cards.html#access',linkLabel:'Open read-aloud and larger text'}
  };
  const SUPPORT={fairTest,skeleton,unpacker};

  /* ---------- Depth cards (changed condition or counterexample; never for speed) ---------- */
  const repeatable=W('Repeatable but wrong','A group repeats its filament-lamp experiment five times and gets the same colours every time. They say: “Our results are repeatable, so they are valid.”',A([
      m('(a) The LED result','No, it supports it but does not prove it. Repeating the filament-lamp method only repeated its systematic heat error. An LED gives off much less heat, so a gradient that remains is better evidence that light causes a difference. But the temperature was not measured, the colours were judged by eye, and without a no-leaf control at each distance the indicator could have changed by itself. It supports the claim; a thermometer, controls and probe readings would make it stronger.'),
      m('(b) A test for heat','Run the same distances twice: once as before, and once with a water shield between the lamp and the tubes, or with every tube in a water bath held at a measured, constant temperature. Compare the colour (or pH) gradient across distances. If the gradient shrinks when the temperature is held constant, heat was contributing to it; any gradient left is the effect of light.'),
      m('What a no-leaf tube can and cannot show','A no-leaf tube at each distance checks only whether the indicator itself changes with heat. It cannot show how much heat changed the leaf’s photosynthesis and respiration.')
    ],[c('Depth criteria',['(a) “Supports”, not “proves”: the LED removes most, not all, of the heat, and temperature was not measured.','(a) Repeatable is told apart from valid: the repeats only repeated a systematic error.','(a) A named way to strengthen the evidence.','(b) The test keeps the same distances and holds temperature constant (water shield or water baths), then compares the gradients.','(b) A smaller gradient at constant temperature is stated as the result that shows heat was contributing.','The no-leaf tube is described as an indicator check only.'])]),{items:['<strong>(a)</strong> They switch to an LED and the gradient remains. Does that prove light caused it?','<strong>(b)</strong> Design a test that separates the effect of light from the effect of heat. Say which result would show that heat was contributing.'],href:'05%20Resources/depth-cards.html#repeatable',linkLabel:'Open on your device',note:'Changed condition: a different lamp. Repeatable is not the same as valid.'});
  const ceiling=W('The ceiling','A Dubai vertical farm tests lettuce leaves under LED grow lights. A technician leaves bright and dim tubes for 18 hours; both end deep purple.',A([
      m('Why the effect is hidden','The indicator has a limited range. In a sealed tube photosynthesis lowers the CO₂ until CO₂ limits it, so both tubes reach the same end-point. The difference in rate is lost.'),
      m('A better timing plan','Take readings at set intervals (for example every 10 minutes) with a pH or CO₂ probe in the tube, and compare the rate of change in the early period, before either tube reaches the limit.')
    ],[c('Depth criteria',['The range limit or CO₂ depletion named.','Why the difference disappears explained.','The new plan compares rate over an early window, with a reason.'])]),{items:['<strong>(a)</strong> Explain why this hides the effect of light.','<strong>(b)</strong> Justify a better timing plan.'],href:'05%20Resources/depth-cards.html#ceiling',linkLabel:'Open on your device',note:'Changed constraint, UAE context. A hypothetical test with no claim about a real farm.',uae:true});
  const depth=[repeatable,ceiling];
  const ceilingT={...ceiling,uae:false,note:'For T · Take it further on the response screens: part (a), then the T recheck. Changed constraint.'};

  const sup=(keys,acc,hot=[])=>{const s={};for(const k of keys)s[k]=k.startsWith('code')?codeCards[k.slice(4)]:SUPPORT[k];s.access=acc.map(k=>access[k]);if(hot.length)s.hot=hot;return s;};
  const codeTabs=['codeR','codeS','codeL','codeJ','codeH'];
  const planKey='<strong>Stuck?</strong> Not sure what the question wants → Question unpacker. Not sure how to write a step → Plan skeleton. Know the step but not the reason → Fair-test table. Your teacher will check.';

  /* ---------- Exam-style question (not from an exam board) ---------- */
  const stem='Hydrogencarbonate indicator changes colour with the concentration of carbon dioxide.';
  const qa='<strong>(a)</strong> Describe an investigation to find the effect of light intensity on the net gas exchange of a leaf, using hydrogencarbonate indicator. Your method should give valid, quantitative results. <strong>[6]</strong>';
  const qb='<strong>(b)</strong> A student cuts the leaf discs for each light intensity from a different plant. Explain why this could make the conclusion invalid, and describe one improvement. <strong>[2]</strong>';
  const markA=A([
    m('1','Leaf (same species and area, for example the same number of discs) on gauze <strong>above</strong> the indicator, in a sealed tube.'),
    m('2','The same volume of indicator from one stock, <strong>equilibrated with air first</strong> (bubble air through it), so all tubes start the same.'),
    m('3','Light intensity changed as a <strong>measured value</strong>: an LED at stated distances (for example 10, 20, 30, 40 cm) or measured with a light meter; plus a dark (foil) tube.'),
    m('4','Temperature controlled <strong>by a method</strong>: an LED and/or a water heat shield or water bath, monitored with a thermometer.'),
    m('5','A no-leaf control at each light condition (accept: at the brightest).'),
    m('6','The same stated time, long enough to see a change (for example 30–60 min), or readings at set intervals.'),
    m('7','A <strong>quantitative reading</strong>: a pH or CO₂ probe in the tube, or samples taken into cuvettes for a colorimeter, compared with each tube’s start reading (accept: matched against standards of known pH).'),
    m('8','Three repeats per intensity, with a mean.'),
    m('9','Interpretation: towards yellow / lower pH = net CO₂ release; towards purple / higher pH = net uptake.')
  ],[c('Marking',['Any six mark points, one mark each.','For 6 out of 6, at least one mark must come from points 2, 4 or 7.'])],6);
  const dontA=A([
    m('','“Keep it fair” or “same temperature” with no method.'),
    m('','“Same amount of light”: light is the variable.'),
    m('','“Measure the oxygen with the indicator.”'),
    m('','“The same person reads the colours”: sensible, but no mark.'),
    m('','A leaf immersed in the indicator, for a land leaf.')
  ],[c('Why these lose the mark',['Each one gives no method, misreads the variable or the indicator, or would harm the leaf result.'])]);
  const markB=A([
    m('(b) 1','Different plants can differ in leaf age, thickness and chlorophyll, so their rates of photosynthesis and respiration differ; a difference between intensities may be caused by the plant, not by light alone.'),
    m('(b) 2','Cut every disc from the same plant (leaves of the same age) with one cork borer, and share the discs from each leaf across all the light intensities.')
  ],[c('Do not credit',['“Repeat it.”','“Use more discs” with no link to the same plant.','“Some plants are bigger” with no effect on the rates.'])],2);
  const strongA='Bubble room air through a stock of hydrogencarbonate indicator until it is a steady orange-red. Put 10 cm³ into each of 15 boiling tubes. Cut discs from one plant with a cork borer and place 5 discs on a gauze platform above the indicator in 12 tubes; seal all tubes with bungs. Place three leaf tubes at each of 10, 20 and 40 cm from an LED lamp, with a glass tank of water between the lamp and the tubes, and a thermometer to check the temperature stays the same; wrap three leaf tubes in foil. Put a no-leaf control tube at each distance: 15 tubes in all (12 leaf tubes and 3 controls). Record each tube’s starting pH with a pH probe through the bung (or take a small sample into a cuvette for a colorimeter), then measure again after 60 minutes. Calculate the mean change for each intensity: a change towards purple shows net CO₂ uptake, towards yellow net release.';

  /* All three support rechecks, projected together at the end of the self-check */
  const criterion3=A([m('The control tube','The no-leaf control at the same distance, set up the same way. If the leaf tube changed and its control did not, the leaf changed the CO₂, not the indicator on its own (heat, a leak or an unequilibrated start). If the control changed too, the claim about the leaf is weaker.')],[c('Check',['The no-leaf control named.','Compared with the leaf tube at the same light.','What a changed control would mean.'])]);
  const supportRecheckAnswers=A([fairTest[1],skeleton[2],unpacker[1]].map(r=>m(r.heading.replace(' · recheck (new case)',''),r.answer.models.map(x=>x.text).join(' '))),[c('Mark your own recheck',['Tick it if it matches, with the reason.','Wrong? Fix it in a different pen.'])]);
  /* All code recheck answers, one panel per code, shown by the teacher */
  const allRecheckAnswers=A(ORDER.flatMap(k=>RECHECK_A[k].models.map(x=>m(named(k)+(x.heading&&x.heading!=='Recheck model'?' · '+x.heading:''),x.text))),[c('Mark your own recheck',['Find your code. Tick it if it matches, with the reason.','Wrong? Correct it in a different pen and show your teacher.'])]);

  window.LESSON={
    number:5,unitLesson:5,unit:'Photosynthesis and plant gas exchange',spec:'Spec',
    title:'A plan that convinces a sceptic',
    question:'Your tubes changed colour. What would it take to convince a sceptic that light caused it?',
    path:['Codes','Respond','Debug a method','Live model','Exam-style plan','Check and revise','Fresh check'],
    learningIntention:'Plan an investigation of the effect of light intensity on a leaf’s net gas exchange using hydrogencarbonate indicator, justify every design choice by what else could change the CO₂, and evaluate a method and a claim.',
    specificationPoints:[
      {code:'2.45B',text:'practical: investigate the effect of light on net gas exchange from a leaf, using hydrogen-carbonate indicator'},
      {code:'2.44B',text:'understand how respiration continues during the day and night, but that the net exchange of carbon dioxide and oxygen depends on the intensity of light'},
      {code:'2.41B',text:'understand gas exchange (of carbon dioxide and oxygen) in relation to respiration and photosynthesis'}
    ],
    outcomes:[
      ['A plan someone could follow: numbered steps, light as a measured value, a sealed tube, a control, repeats, the same reading after the same time.','2.45B: the light and gas exchange practical'],
      ['Every choice justified: equilibration, time, lamp heat, the control and repeats, each with how and why.','2.45B, with 2.20: what changes the rate'],
      ['A number, not a colour: an instrument reading, and the control used to judge how strong a claim is.','2.45B, with 2.44B: evidence for net gas exchange']
    ],
    criteria:[
      '<strong>1 · A plan someone could follow:</strong> numbered steps; light changed as a measurable value; the leaf held above the indicator in a sealed tube; a no-leaf control; repeats; the reading taken the same way after the same time.',
      '<strong>2 · Every choice justified:</strong> for equilibration, time, lamp heat, the control and repeats, I say how and why: what else would change the CO₂ if I didn’t. I know repeats make results repeatable but cannot remove a systematic error such as heat.',
      '<strong>3 · A number, not a colour:</strong> I explain how a colorimeter or a pH or CO₂ probe gives an observer-independent quantitative result, and I use the control or start reading to judge how strong a claim is.'
    ],
    codes:CODES,
    vocabulary:glossary.map(([a,b])=>({heading:a[0].toUpperCase()+a.slice(1),text:b})),
    resourcePages:[
      {heading:'Code board',text:'The six codes, each with its words, its board activity and its recheck. Read-aloud and larger text. No answers: your teacher shows them.',href:'05%20Resources/code-board.html',linkLabel:'Open the code board'},
      {heading:'Support cards',text:'Fair-test table, plan skeleton and question unpacker, each with a recheck, plus colour words and key words. Read-aloud and larger text. No answers: your teacher shows them.',href:'05%20Resources/support-cards.html',linkLabel:'Open the support cards'},
      {heading:'Depth cards',text:'Repeatable but wrong; The ceiling. Read-aloud and larger text. No answers: your teacher shows them.',href:'05%20Resources/depth-cards.html',linkLabel:'Open the depth cards'},
      {heading:'Gas exchange lab (optional, after the lesson)',text:'The Lesson 4 model of the indicator tubes. It fixes the temperature and starts every tube equilibrated, so it cannot test those choices. Model output is never measured data.',href:'04%20Resources/Gas%20exchange%20lab.html',linkLabel:'Open the gas exchange lab'}
    ],
    modelPages:[
      {heading:'The model set-up',text:'Equilibrated stock, a sealed tube with discs on gauze, an LED behind a water tank, a thermometer.',action:{id:'live-model',label:'Return to the live model'}},
      {heading:'The flawed method',text:'A pupil’s method, not yours, drawn as described.',action:{id:'debug',label:'Return to the flawed method'}}
    ],
    checkPages:[
      {heading:'Exam-style plan',text:'Light and net gas exchange, 8 marks. Not from an exam board.',action:{id:'exam-plan',label:'Open the question'}},
      {heading:'Quick check',text:'Which change most improves validity?',action:{id:'quick-check',label:'Open the quick check'}},
      {heading:'Fresh check',text:'Algal beads and pH, 6 marks, unaided.',action:{id:'fresh-check',label:'Open the fresh check'}}
    ],
    ai:{pages:[]},
    uae:{label:'Dubai vertical farm',pages:[{heading:'Lettuce under LED grow lights',text:ceiling.text,items:ceiling.items,note:'Hypothetical test, illustrative. The same task is a depth card.',href:'05%20Resources/depth-cards.html#ceiling',linkLabel:'Open on your device',answer:ceiling.answer}]},
    phases:[
      p('do-now','Do now','content','Do now: two from earlier','retrieve',{nav:'Do now',mins:1.5,label:'Do now · from memory',lead:'Books on desks, open at your coded page. Do now in your book, unaided; then correct in a different pen.',items:['<strong>1</strong> A filament lamp is moved closer to a plant. Name <strong>two</strong> factors that change, and say how.','<strong>2</strong> What colour is hydrogencarbonate indicator at the air level of CO₂, with <strong>more</strong> CO₂ and with <strong>less</strong> CO₂?'],doThis:['Write both before the answers are shown.']}),
      p('outcomes','Learning outcome','outcome','What will your work show?','outcomes',{nav:'Outcomes and criteria',mins:0.5,lead:'One goal for everyone. Three criteria.',criteria:null,task:'Today: codes → respond → debug a method → live model → exam-style plan → check and revise → fresh check.',resources:[resource('Open the code board','code-board.html'),resource('Open the support cards','support-cards.html')]}),
      p('code-board','Input','content','Six codes: each one names your next step','codes',{nav:'The six codes',mins:1.5,label:'Codes · your next step, not a grade',html:board(Object.fromEntries(ORDER.map(k=>[k,CODES[k].meaning])),'The six codes and what each means','Your Lesson 4 and Lesson 3 fresh checks are coded. The circled code is today’s job. Find it; change nothing yet.'),support:sup([],['words'])}),
      p('code-examples','Input','model','How a code works: two examples','codes',{nav:'Two coded examples',mins:2.5,label:'Codes · the code, its board activity, its recheck',diagram:'coded-line',caption:'Both examples were written for this lesson. Neither is anyone’s answer.',support:sup([],['words']),steps:[
        '<strong>Example 1</strong>, on the sunflower graph: “At 3.3 nothing is happening.” Coded '+chip('R')+': name both processes and say which is faster.',
        'Board activity for '+chip('R')+', done live: P __ R becomes <strong>P = R</strong>, then the sentence is rewritten with both rates, in a different pen. Its recheck uses new values: duckweed, P = 6 and R = 6.',
        '<strong>Example 2</strong>: one leaf tube went purple in bright light, with no control. “This proves the leaf photosynthesised.” Coded '+chip('J')+': match the claim to the evidence.',
        'Board activity for '+chip('J')+', done live: the rung is <strong>supports</strong> at most; one sentence on the missing control; one way to make it stronger. Its recheck: a new tube with a control.']}),
      p('respond','Thinking','content','Respond: do your circled code','respond',{nav:'Respond: board activity',mins:5,label:'Respond · on the coded answer, in a different pen',html:board(ACTIVITY,'Board activity for each code','Keep your first attempt. Each code’s scaffold is in Adaptation and on the code board page.'),support:sup(codeTabs,['colours','words'],[ceilingT]),supportNote:'Your teacher has circled your code. Open the tab with the same letter and words.',hotNote:'For T · Take it further: your answer is secure. Extend it with this depth card.'}),
      p('rechecks','Thinking','content','Recheck: the same code, new values','respond',{nav:'Respond: recheck',mins:3,label:'Recheck · your circled code, alone, card closed',html:board(RECHECK,'Recheck for each code, with new values','New values, so you cannot copy your revision. Your teacher shows the answers next.'),support:sup(codeTabs,['colours','words'],[ceilingT]),supportNote:'Use the card only if your teacher says so. The recheck is done with the card closed.',hotNote:'For T · Take it further: your answer is secure. Extend it with this depth card.'}),
      p('recheck-answers','Thinking','panels','Mark your recheck','respond',{nav:'Respond: mark the recheck',mins:1,label:'Recheck answers · shown by your teacher',support:sup([],['words'],[ceilingT]),hotNote:'For T · Take it further: your answer is secure. Extend it with this depth card.',lead:'Your teacher shows all six answers together. Find your code and mark your recheck in a different pen.',panels:[{title:'All six recheck answers',short:'all six recheck answers',answer:allRecheckAnswers}],panelSets:{all:[0]},panelButtons:[['all','Show all six recheck answers']],doThis:['Right? Tick it. Wrong? Correct it in a different pen and show your teacher.']}),
      p('debug','Thinking','content','Debug a method','debug',{nav:'Debug a method',mins:4,label:'Thinking · a pupil’s method, not yours',diagram:'method-flawed',caption:'Drawn from the written method, not from your practical.',support:sup(['fairTest','unpacker'],['colours','words']),html:'<style>[data-phase="debug"] .method-quote{font-size:1em;line-height:1.25;padding:10px 16px;margin:2px 0 6px}[data-phase="debug"] .bio-list li{padding-top:3px;padding-bottom:3px;line-height:1.25}</style><blockquote class="bio-quote method-quote">“I put the indicator straight from the bottle into three tubes. I put a leaf in each: one under a desk lamp (filament bulb) 10 cm away, one under tissue, one in foil. After 10 minutes I looked at the colours.”</blockquote>',items:['<strong>1</strong> Alone, list every flaw (2 min). <strong>2</strong> Compare with a neighbour (1 min).','<strong>3</strong> In your book: the worst flaw as <strong>flaw → fix → why</strong> (1 min).']}),
      p('live-model','Input','model','Live model: three steps, one rewritten','model',{nav:'Live model',mins:4,label:'Live model · an action, a value and a reason',diagram:'method-model',caption:'Schematic set-up, one step at a time. Not to scale. You will plan without this model on screen.',support:sup(['skeleton'],['colours','words']),steps:[
        '<strong>Step 1.</strong> “Add 10 cm³ of hydrogencarbonate indicator from the same stock to each of 15 boiling tubes. First bubble room air through the stock until it is a steady orange-red, so every tube starts at the same CO₂ level.”',
        '<strong>Step 2.</strong> “Place one leaf-disc set (5 discs, same plant, cut with one cork borer) on a gauze platform above the indicator; seal with a bung.”',
        '<strong>Step 3, first draft.</strong> “Keep the temperature the same.” <strong>Stop.</strong> That isn’t an action, and it doesn’t say why.',
        '<strong>Step 3, rewritten: how.</strong> “Use an LED and stand a glass tank of water between the lamp and the tubes; check a thermometer in a water-filled tube beside them.”',
        '<strong>Step 3, rewritten: why.</strong> “Temperature changes the rates of photosynthesis and respiration, and warming the indicator can change its colour without a leaf.”','<strong>Step 3, one more line.</strong> “Repeating this would give the same warm-tube bias every time: a systematic error. Repeats help with random variation, not with this.”','<strong>Why repeats cannot fix it.</strong> A bathroom scale that reads 2 kg heavy gives the same wrong mass every time. The fix is to check it against a known mass and correct it: <strong>calibrate</strong>. For a pH probe, the known value is a buffer of known pH.'],modelState:{sequence:[0,1,2,3,3,3,3]}}),
      p('quick-check','Assess','hinge','Quick check: which change most improves validity?','quick',{nav:'Quick check',mins:2,secure:true,label:'Quick check · everyone at once',lead:'A group used a filament lamp at 5, 10, 20 and 40 cm. Which change most improves the <strong>validity</strong> of their conclusion?',options:['Repeat each distance three times.','Put a water-filled heat shield between the lamp and the tubes.','Use a brighter filament bulb so the colour changes faster.','Have the same person read every tube.'],task:'Show your number on your whiteboard when asked, then write why in your book.',recheck:{question:'<strong>Recheck (new case):</strong> A pH probe reads 0.3 too high in every tube (illustrative). Will five repeats fix this? What will?',answer:'No. It is a systematic error, so every repeat is 0.3 too high. Calibrate the probe against a buffer of known pH, then correct the readings.'}}),
      p('exam-plan','Assess','content','Exam-style: plan the investigation','exam',{nav:'Exam-style plan',mins:11,label:'Exam-style question · not from an exam board · 8 marks',support:sup(['fairTest','skeleton','unpacker'],['colours','words'],[repeatable,ceiling]),hotNote:'Depth cards open once your teacher sees four or more plan points, including heat or time with a reason.',text:stem,items:[qa,qb],doThis:['Answer alone in your book, as numbered steps.',planKey]}),
      p('self-check','Thinking','panels','Check, then revise','revise',{nav:'Self-check and revise',mins:6,label:'Exam-style mark scheme · not from an exam board',support:sup(['fairTest','skeleton','unpacker'],['colours','words'],[repeatable,ceiling]),hotNote:'Depth cards open once your teacher sees four or more plan points, including heat or time with a reason.',lead:'Tick each mark point you earned. Add your weakest missing point, with how and why, in a different pen. Then: which tube shows the leaf, not the indicator, changed the CO₂?',doThis:[planKey],panels:[{title:'(a) · mark points 1 to 5',short:'points 1–5',answer:A(markA.models.slice(0,5),[c('Marking',markA.criteria[0].items)],null)},{title:'(a) · mark points 6 to 9',short:'points 6–9',answer:A(markA.models.slice(5),[c('Marking',markA.criteria[0].items)],null)},{title:'(a) · do not credit',short:'do not credit',answer:dontA},{title:'(b) · 2 marks',short:'(b)',answer:markB},{title:'Which tube shows the leaf changed the CO₂?',short:'the control question',answer:criterion3},{title:'Support recheck answers · mark your own',short:'support recheck answers',answer:supportRecheckAnswers}],panelSets:{p1:[0],p2:[1,2,3],c3:[4],rechecks:[5]},panelButtons:[['p1','Show points 1–5'],['p2','Show points 6–9, do not credit and (b)'],['c3','Show the control answer'],['rechecks','Show support recheck answers']]}),
      p('fresh-check','Assess','content','Fresh check 1: alone, in your book','fresh',{nav:'Fresh check 1 (unaided)',mins:3,timer:5,secure:true,hideMins:true,label:'Fresh check · unaided · one 5-minute clock for both screens · 1 of 2 · 4 marks',text:'Algal beads (algae trapped in jelly balls) are placed <strong>in</strong> hydrogencarbonate indicator in sealed tubes.',items:['<strong>1</strong> A student plans: “LED at 10, 20 and 40 cm, no thermometer. Beads from a different batch at each distance. Leave 60 minutes, then read each tube’s pH once.” Give <strong>two</strong> improvements that would most strengthen the evidence, each with its reason. <strong>[4]</strong>'],doThis:['Cards, notes and the lab stay closed; your access arrangements stay.']}),
      p('fresh-check-2','Assess','content','Fresh check 2: evidence and a claim','fresh',{nav:'Fresh check 2 (unaided)',mins:2,timer:5,secure:true,hideMins:true,label:'Fresh check · unaided · same 5-minute clock · 2 of 2 · 2 marks',text:'Same number of beads in every tube; one tube at each; an LED with a heat shield.',html:phTable,items:['<strong>2</strong> A student concludes: “At 40 cm the algae were not photosynthesising.” Use the data to evaluate this claim. <strong>[2]</strong>']})
    ]
  };
  window.LESSON.phases[1].criteria=window.LESSON.criteria;
  window.L5Cards={planKey,CODES,ORDER,ACTIVITY,RECHECK,RECHECK_A,SCAFFOLD,codeCards,chip,named,SUPPORT,access,depth,glossary,markA,dontA,markB,strongA,stem,qa,qb};
  window.L5Data=DATA;
  window.L5Fmt=fmt;
})();
