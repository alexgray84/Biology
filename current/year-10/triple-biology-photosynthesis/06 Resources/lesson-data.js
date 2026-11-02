/* What does a plant need, and how do we know? · Year 10 Triple Biology · Pearson 4XBI1 2.23 and 2.22.
   Built 29 October 2026 from the teacher-confirmed evidence-lesson design (Confirmed at stage 6, 29 October 2026). Original classroom material. Public content only: no pupil names,
   identifiers or needs. No feedback codes in this lesson (they start on 11 Nov).
   Every screen points to the matching box on the printed handout and shows the same table or frame, so the
   lesson also works without printing. Every task, support recheck and depth box has its own hidden review.
   No expected live bubble counts are quoted: counts are measured in the lesson. Fallback values are labelled. */
(() => {
  const m=(heading,text)=>({heading,text});
  const c=(heading,items)=>({heading,items});
  const A=(models,criteria,marks=null)=>({models,criteria,marks});
  const K=(heading,text,items)=>A([m(heading,text)],[c('Success criteria',items)]);
  const W=(heading,text,answer,extra={})=>({heading,text,answer,...extra});
  const p=(id,family,type,title,topic,extra={})=>({id,family,type,title,topic,...extra});
  const R='06%20Resources/';
  const resource=(label,file,anchor='')=>({label,href:R+encodeURIComponent(file)+anchor});
  const blank=(w='')=>`<span class="blank${w?' '+w:''}"></span>`;
  const H=(side,box)=>`Handout side ${side} · ${box}`;

  /* ---------- Numbers (recomputed by check-l6e.mjs) ---------- */
  const DATA={
    distances:[10,20,40],
    // light intensity ∝ 1/d², relative to 10 cm = 100. 40 cm is left blank for A1.
    sim:{intensity:[20,40,80,100],volume:[3.6,6.6,9.0,9.2],
      label:'Simulated data (Lesson 2 pondweed lab): light intensity %, gas volume cm³ in 5 min, 1.0 % NaHCO₃, 25 °C'},
    cucumber:{rows:[['complete','12.0','dark green'],['no magnesium','7.2','yellow between the veins'],['no nitrate','4.8','small and pale']]}
  };
  DATA.relative=DATA.distances.map(d=>100*(10/d)**2);              // 100, 25, 6.25
  DATA.relativeShown=DATA.relative.map((x,i)=>i<2?String(x):'');     // 40 cm blank (A1)
  DATA.sim.ratio20to80=Math.round(DATA.sim.volume[2]/DATA.sim.volume[0]*100)/100; // 2.5

  /* ---------- Shared tables and frames (the handout builder uses the same functions) ---------- */
  const table=(head,rows,cls='',caption='')=>`<table class="science-table ${cls}">${caption?`<caption>${caption}</caption>`:''}<thead><tr>${head.map(h=>`<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((x,i)=>i===0?`<th scope="row">${x}</th>`:`<td>${x}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  const RESULT_HEAD=['Distance / cm','Relative light intensity','Bubbles per min: teacher','Station 1','Station 2','Mean','Temp. before / after count °C'];
  const input=(key,label)=>`<input class="pool-input" type="text" inputmode="decimal" maxlength="5" data-pool="${key}" aria-label="${label}">`;
  const poolTable=caption=>table(RESULT_HEAD,DATA.distances.map((d,i)=>[d,DATA.relativeShown[i]||'A1','','','',
      input('mean-'+d,`Class mean at ${d} cm, bubbles per minute`),' / ']),'pool-table',caption);
  const simTable=table(['Light intensity / %',...DATA.sim.intensity.map(String)],[['Gas volume in 5 min / cm³',...DATA.sim.volume.map(x=>x.toFixed(1))]],'sim-table',DATA.sim.label);
  const intensityStrip=table(['Distance / cm','10','20','40'],[['Relative light intensity','100','25','A1: '+blank('short')]],'strip-table');
  const meansStrip=`<p class="data-strip">Class means, bubbles per min: 10 cm <output data-pool-show="mean-10">…</output> · 20 cm <output data-pool-show="mean-20">…</output> · 40 cm <output data-pool-show="mean-40">…</output></p>`;
  const simStrip=`<p class="data-strip">Simulated: 20 % 3.6 · 40 % 6.6 · 80 % 9.0 · 100 % 9.2 cm³ in 5 min</p>`;
  const FRAMES={
    A2:`From ${blank('short')} cm to ${blank('short')} cm, the mean went from ${blank('short')} to ${blank('short')} bubbles per minute. Further away, the light intensity is ${blank()}, so ${blank()} light energy is absorbed by chlorophyll, so ${blank('long')}, so ${blank()} oxygen is released.`,
    A2sim:`As the light intensity increased from ${blank('short')} % to ${blank('short')} %, the gas volume rose from ${blank('short')} to ${blank('short')} cm³. With more light, ${blank()} light energy is absorbed by chlorophyll, so ${blank('long')}, so ${blank()} oxygen is released.`,
    A3:`The lamp also ${blank()} the water. Temperature affects ${blank()}, so without the shield a change in bubbles could be caused by ${blank()} as well as ${blank()}. The temperatures show ${blank('long')}.`,
    A3sim:`The simulator held the temperature at 25 °C. In a real tube, the lamp also ${blank()} the water. Temperature affects ${blank()}, so without a heat shield a change could be caused by ${blank()} as well as ${blank()}.`
  };
  const Q={
    doNow:['<strong>1</strong> Iodine solution turns from ___ to ___ with starch. Why does a leaf store glucose as starch?','<strong>2</strong> Give the route CO₂ takes from the air to a palisade cell.','<strong>3</strong> Why is collecting the gas in a syringe a better measure of the rate than counting bubbles?'],
    A1:'<strong>A1</strong> For a small lamp, light intensity is roughly proportional to 1 ÷ distance². What is it at 40 cm?',
    A2:'<strong>A2</strong> Describe the pattern in the mean bubble counts and explain it.',
    A3:'<strong>A3</strong> Use the temperature readings. Why was the beaker of water placed between the lamp and the tube?',
    A4:'<strong>A4</strong> (grade 7–9) For a small lamp, moving it from 20 cm to 10 cm makes the light roughly four times as intense. Did the mean bubble count rise four times? If not, suggest why.',
    countRule:'Lamps on at 10 cm from the start. Count bubbles from the cut end for 1 minute, then move the lamp (30 s), wait 2 minutes and count again. Read the thermometer before and after each count.',
    A4sim:'<strong>A4</strong> (grade 7–9) In the simulated data, 20 % → 80 % is four times the light. Did the gas volume rise four times? If not, suggest why.',
    B1destarch:`Before step 1: destarch the plant (about 48 hours in the dark) because ${blank('long')}.`,
    C2:'<strong>C2</strong> Which missing ion would most directly reduce the starch made in a leaf? Why?'
  };
  const STARCH_STEPS=[
    ['1 · Boil in water, about 1 minute','because it kills the cells and denatures the enzymes, so reactions stop.'],
    ['2 · Warm in ethanol in a hot water bath (no flame)','because '+blank('long')],
    ['3 · Rinse in warm water','because '+blank('long')],
    ['4 · Add iodine solution','because '+blank('long')]
  ];
  const starchStrip=`<ol class="step-strip">${STARCH_STEPS.map(([a,b])=>`<li><strong>${a}</strong> ${b}</li>`).join('')}</ol>`;
  const YN=['Light','CO₂','Chlorophyll'];
  const grid=(left,right,cells,claim)=>table(['Condition',left,right,'Differs?'],YN.map((r,i)=>[r,...(cells?cells[i]:['','',''])]),'pair-grid')+(claim!==undefined?`<p class="claim-line"><strong>So:</strong> ${claim}</p>`:'');
  const GRIDS={
    foil:grid('Uncovered green','Covered green',[['Yes','No','Yes'],['Yes','Yes','No'],['Yes','Yes','No']],'only light differs, so light is needed for photosynthesis.'),
    variegated:grid('Green part','White part',null,blank('long')),
    sodaLime:`<p class="claim-line">The two leaves differ only in ${blank()}, so ${blank('long')}. The bag without soda lime shows that ${blank('long')}.</p>`
  };
  const DEF_HEAD=['Ion','Needed to make','So photosynthesis or starch …','So growth …','Leaf symptom'];
  const deficiency=table(DEF_HEAD,[['magnesium','chlorophyll',`${blank('short')} light absorbed, so ${blank('short')} glucose and starch`,blank(),'yellow between the veins'],['nitrate',blank(),blank(),blank(),blank()]],'deficiency-table');
  const cucumber=table(['Solution','Mean dry mass / g','Leaves'],DATA.cucumber.rows,'cucumber-table','Illustrative results, not real data.');
  const EXAM={
    stem:'A hydroponic greenhouse near Al Ain grows cucumber seedlings in nutrient solutions for 4 weeks.',
    a:'<strong>(a)</strong> Explain why the seedlings without magnesium had a lower dry mass. <strong>[3]</strong>',
    aUnpack:'“Explain … dry mass”: a chain that ends at mass.',
    b:'<strong>(b)</strong> The grower destarched a no-magnesium seedling, left it in light for a day, then starch-tested a leaf. The yellow areas stayed orange-brown; the green areas turned blue-black. The grower says: “This shows that light is needed for photosynthesis.” Evaluate this conclusion. <strong>[2]</strong>',
    bUnpack:'“Evaluate”: does the claim fit the evidence, why, and what would test it?'
  };
  const FRESH={
    q1:'<strong>1</strong> To test whether light is needed, a student destarches two plants. Leaf P is a green leaf on plant 1, left in light. Leaf Q is a variegated leaf (green and white) on plant 2, kept in a dark cupboard. After a day both are starch-tested. The student says: “Comparing P and Q shows that light is needed.” Explain why P and Q are not a fair pair, and name a better leaf to compare with P. <strong>[2]</strong>',
    q2:'<strong>2</strong> Pondweed in a sealed tube gives off gas into a gas syringe for 5 minutes at each lamp distance (results in the table, illustrative). <strong>(a)</strong> Describe the pattern and explain it using light intensity. <strong>[2]</strong> <strong>(b)</strong> Use the temperatures to explain why the student cannot be sure that all of the difference was caused by light. <strong>[1]</strong>',
    q2rows:[['10 cm','6.2','21 → 25'],['30 cm','2.1','21 → 21']],
    q3:'<strong>3</strong> A student did not destarch a plant. They covered part of a leaf with foil, left it in light for a day, and the covered part turned blue-black. Explain why this result does not show that light is unnecessary. <strong>[1]</strong>',
    q4:'<strong>4</strong> A lettuce grower supplies plenty of magnesium. Some plants stay small and their older leaves turn pale. Name the ion most likely in short supply and explain why these plants grow less. <strong>[2]</strong>',
  };
  FRESH.q2table=`<table class="science-table fresh-table"><caption>Illustrative results, not real data.</caption><thead><tr><th scope="col">Lamp distance</th><th scope="col">Gas in 5 min / cm³</th><th scope="col">Water temperature / °C</th></tr></thead><tbody>${FRESH.q2rows.map(r=>`<tr><th scope="row">${r[0]}</th><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('')}</tbody></table>`;


  const CRITERIA=[
    '<strong>1 · Oxygen as evidence of rate:</strong> I use pooled bubble counts to describe how distance from the lamp affects the rate, explain it with light intensity, and say why the heat shield is needed (so only light changes).',
    '<strong>2 · One difference, one claim:</strong> I pick the two parts or leaves that differ in only one condition (light, CO₂ or chlorophyll), claim only what that difference shows, and give the reason for each starch-test step I use.',
    '<strong>3 · Ion → molecule → growth:</strong> magnesium → chlorophyll → less light absorbed → less glucose; nitrate → amino acids → proteins → growth. Mineral ions are not food: they release no energy.'
  ];
  const KEYWORDS=[['destarch','keep the plant in the dark (about 48 hours) so it uses up its stored starch'],['variegated','a leaf with green parts and white parts; the white parts have no chlorophyll'],['deficiency','not enough of something the plant needs'],['soda lime','a solid that absorbs carbon dioxide'],['heat shield','a beaker of water between the lamp and the tube that absorbs heat'],['relative intensity','light intensity compared with the brightest position, set at 100']];

  /* ---------- Support cards (Adaptation tabs; same scaffolds as the handout; each with a recheck) ---------- */
  const chainHtml=`<p class="frame-card"><strong>A2 frame:</strong> ${FRAMES.A2}</p><ol class="causal-chain"><li>distance from the lamp <strong>up</strong></li><li>light intensity ${blank('short')}</li><li>light energy absorbed by chlorophyll ${blank('short')}</li><li>rate of photosynthesis ${blank('short')}</li><li>oxygen released ${blank('short')}</li></ol>`;
  const shieldHtml=`<p class="frame-card"><strong>A3 frame:</strong> ${FRAMES.A3}</p>`+table(['I changed on purpose','What else could change','How it was stopped','Evidence it stayed the same'],[['light intensity (distance)',blank(),blank(),blank()]],'shield-table');
  const stepsHtml=`<ol class="step-strip"><li><strong>1 · Boil</strong> → kills cells, denatures enzymes (given)</li><li><strong>2 · Ethanol, hot water bath</strong> → removes ${blank('short')} so ${blank()}; water bath because ethanol is ${blank('short')}</li><li><strong>3 · Rinse</strong> → ${blank()}</li><li><strong>4 · Iodine</strong> → ${blank('short')} where starch, ${blank('short')} where none</li></ol>`;
  const gridHtml=grid('Part 1','Part 2',null,'A fair pair differs in exactly one row.');
  const ionHtml=`<p class="causal-chain-line">ion → needed to make ${blank('short')} → so in the plant ${blank()} → so growth ${blank()}</p><p class="causal-chain-line">magnesium → chlorophyll → ${blank('short')} light absorbed → ${blank('short')} glucose → ${blank('short')} growth</p>`;
  const commandHtml=`<dl class="support-word-map"><dt>Explain … dry mass</dt><dd>a chain of “so” links that ends at mass</dd><dt>Evaluate</dt><dd>does the claim fit the evidence? why? what would test it?</dd><dt>[3]</dt><dd>about three linked points</dd></dl>`;
  const SUPPORT={
    chain:[
      W('Chain frame','Each arrow means “so”. Fill each link, then copy the chain into your sentence.',K('Using the chain frame','Distance up → light intensity lower → less light energy absorbed by chlorophyll → rate of photosynthesis lower → less oxygen released, so fewer bubbles.',['Every link filled in order.','The chain reaches the rate of photosynthesis and oxygen.','No “the plant has less energy”.']),{html:chainHtml,href:R+'support-cards.html#chain',linkLabel:'Open the chain frame on your device'}),
      W('Chain frame · recheck (new case)','Close the card first. A pupil writes: “Further from the lamp there were fewer bubbles because the plant has less energy.” Correct the claim using the chain.',K('Recheck model','It is not about the plant’s energy. Further away the light intensity is lower, so less light energy is absorbed by chlorophyll, so the rate of photosynthesis is lower, so less oxygen is released, so there are fewer bubbles.',['“Less energy” replaced by the light-intensity reason.','Light absorbed by chlorophyll → rate of photosynthesis → oxygen, in order.']),{note:'Answer in your book with the card closed.'}),
    ],
    shield:[
      W('What else changed?','Fill one row: what you changed on purpose, what else could change, how it was stopped, and the evidence.',K('Using the two-variable check','Changed: light intensity. Else: temperature, because the lamp heats the water. Stopped by: a beaker of water touching the tube (heat shield). Evidence: the start and end temperatures stayed about the same.',['Temperature named as the second variable.','The shield as the method.','The thermometer readings as evidence.']),{html:shieldHtml,href:R+'support-cards.html#shield',linkLabel:'Open this card on your device'}),
      W('What else changed? · recheck (new case)','Close the card first. You are planning a lamp experiment with pondweed. Name the variable, other than light, that you must monitor, say how you would measure it, and say what result would show your heat shield worked.',K('Recheck model','Temperature of the water in the tube: read a thermometer (or probe) in the tube before and after each count. The shield worked if the temperature stays about the same (within about 1 °C) at every distance.',['Temperature named as the variable to monitor.','A method: thermometer in the tube, before and after each count.','A success result: about the same at every distance.']),{note:'Answer in your book with the card closed.'})
    ],
    steps:[
      W('Step strip','Each step has a reason. The first is given. Fill the rest.',K('Using the step strip','Ethanol removes the chlorophyll so the colour change can be seen; a hot water bath because ethanol is highly flammable. Rinsing softens the brittle leaf. Iodine turns blue-black where there is starch and stays orange-brown where there is none.',['Ethanol removes chlorophyll (not “iodine sticks to green”).','Water bath because ethanol is flammable.','Both iodine colours with their meaning.']),{html:stepsHtml,href:R+'support-cards.html#steps',linkLabel:'Open the step strip on your device'}),
      W('Step strip · recheck (new case)','Close the card first. A pupil skips the ethanol step and adds iodine to a green leaf. What will they see, and why?',K('Recheck model','The colour is hard to see: the green chlorophyll is still in the leaf and hides any blue-black, so they cannot tell where starch is.',['Chlorophyll still present.','It hides the colour change.']),{note:'Answer in your book with the card closed.'})
    ],
    grid:[
      W('Comparison grid','Write Yes or No for each part. A fair pair differs in exactly one row: that row is what the result shows.',K('Using the comparison grid','For each pair, the grid shows one row different. That condition is the only one the result can show is needed.',['Yes or No in every cell.','Exactly one row differs.','The claim names only that condition.']),{html:gridHtml,href:R+'support-cards.html#grid',linkLabel:'Open the grid on your device'}),
      W('Comparison grid · recheck (new case)','Close the card first. Three green leaves on one destarched plant, all in light: leaf 1 uncovered; leaf 2 inside a black paper bag; leaf 3 inside a clear plastic bag of the same size. To test whether light is needed, which leaf is the best control for leaf 2? Use the grid.',K('Recheck model','Leaf 3. Leaves 2 and 3 are both bagged, so any effect of the bag itself (on CO₂, humidity or temperature) is the same; only light differs. Leaf 1 differs from leaf 2 in two things: light and the bag.',['Leaf 3 chosen.','The reason: only light differs between leaves 2 and 3.','Why not leaf 1: two differences (light and the bag).']),{note:'Answer in your book with the card closed.'})
    ],
    ions:[
      W('Ion chain','Ion → the molecule it makes → what that does → growth. Fill the gaps.',K('Using the ion chain','Magnesium → chlorophyll → less light absorbed → less glucose → slower growth. Nitrate → amino acids → proteins → new cells → growth.',['Each chain reaches growth.','The molecule is named.','Ions are not called food.']),{html:ionHtml,href:R+'support-cards.html#ions',linkLabel:'Open the ion chain on your device'}),
      W('Ion chain · recheck (new case)','Close the card first. Wheat is growing in soil that is short of magnesium. The farmer adds only nitrate fertiliser. Will the wheat recover? Explain.',K('Recheck model','No. Nitrate cannot do magnesium’s job: the wheat still cannot make enough chlorophyll, so it absorbs less light, photosynthesises less and makes less glucose for growth. Each ion is used to make a different molecule.',['No recovery, with the reason.','Magnesium → chlorophyll → light → glucose.','Ions have different jobs; they are not interchangeable food.']),{note:'Answer in your book with the card closed.'})
    ],
    command:[
      W('Command words','What the words in the exam question ask you to do.',K('Using the command words','(a) needs a chain of three links ending at dry mass. (b) needs a judgement, a reason from the evidence, and a test that would work.',['(a) ends at mass.','(b) judges, gives the reason and a test.']),{html:commandHtml,href:R+'support-cards.html#command',linkLabel:'Open the command words on your device'}),
      W('Command words · recheck (new case)','Close the card first. “Evaluate the claim that more bubbles at 10 cm prove the plant photosynthesised faster.” Write the three things your answer must do.',K('Recheck model','Say whether the claim fits (it supports it); give a reason from the evidence (bubbles vary in size, and temperature must be controlled); and say what would test it better (measure the gas volume, with a heat shield and repeats).',['A judgement.','A reason from the evidence.','A better test.']),{note:'Answer in your book with the card closed.'})
    ]
  };
  const access={
    words:{heading:'Plain words',text:'Plain-English meanings for today’s key words.',html:`<dl class="support-word-map">${KEYWORDS.map(([a,b])=>`<dt>${a}</dt><dd>${b}</dd>`).join('')}</dl>`,href:R+'support-cards.html#access',linkLabel:'Open read-aloud and larger text'},
    colours:{heading:'Colour words',text:'Every colour has a word. Iodine solution is orange-brown. Blue-black means starch. Orange-brown means no starch. In the pondweed diagram, teal labels oxygen and grey labels carbon dioxide.'}
  };

  /* ---------- Depth boxes (A5, B5): a counterexample each; opened on evidence, never for speed ---------- */
  const A5=W('A5 (depth) · Daylight you cannot remove','The blinds in the lab are broken, so daylight reaches every tube as well as the lamp light. Explain why daylight changes the 40 cm count more, in proportion, than the 10 cm count. Then suggest how to allow for it.',A([
      m('Why 40 cm is affected more','Daylight adds roughly the same amount of light to every tube. At 40 cm the lamp light is weak, so daylight is a much bigger share of the total there; the 40 cm rate is higher than lamp light alone predicts, and the pattern looks flatter than 1 ÷ distance² suggests.'),
      m('How to allow for it','Count bubbles with the lamp off (daylight only) and subtract that rate from each count, or put the same cardboard hood around every tube so the daylight is the same small amount everywhere.')
    ],[c('Depth criteria',['Daylight adds about the same amount to each tube.','It is a bigger fraction of the light at 40 cm, so the pattern flattens.','A workable allowance: a lamp-off control to subtract, or the same shading for every tube.'])]),{href:R+'depth-cards.html#a5',linkLabel:'Open on your device',note:'Handout side 2 · depth box A5. Changed constraint.'});
  const B5=W('B5 (depth) · Nothing turned blue-black','A variegated leaf on a destarched plant is sealed in a bag with soda lime, in light. The whole leaf stays orange-brown. “So chlorophyll makes no difference: green and white both stayed orange-brown.” Explain why this cannot test chlorophyll, and change the set-up so it can.',A([
      m('Why it cannot test chlorophyll','They still differ only in chlorophyll, but CO₂ is missing from both, so neither can photosynthesise and the chlorophyll difference cannot show.'),
      m('The change','Remove the soda lime (or compare with a leaf in a bag without soda lime), so the green and white parts differ only in chlorophyll.')
    ],[c('Depth criteria',['Missing CO₂ named: neither part can photosynthesise.','Why the chlorophyll difference cannot show, even though it is the only difference.','A set-up change that gives both parts CO₂.'])]),{href:R+'depth-cards.html#b5',linkLabel:'Open on your device',note:'Handout side 2 · B5. Counterexample.'});
  const depth=[A5,B5];

  const sup=(keys,acc,hot=[])=>{const s={};for(const k of keys)s[k]=SUPPORT[k];s.access=acc.map(k=>access[k]);if(hot.length)s.hot=hot;return s;};
  const hotNote='Open A5 once your A2 and A3 match the mark points on the pondweed-check screen. Open B5 once your B4 choice matches the answer shown on the pair-check screen. You do not need to wait for your teacher. It is not for finishing first.';

  /* ---------- Teacher-only data switch on the pool and interpret screens ---------- */
  const poolModes={
    live:{modeLabel:'Live counts',label:`Pool · live counts, today · ${H(1,'Table A')}`,html:poolTable('Live counts: stations read out their counts; your teacher types only the three means. Nothing is saved.')},
    backup:{modeLabel:'Technician back-up (real)',label:`Pool · real back-up counts · ${H(1,'Table A')}`,html:poolTable('Real data, recorded 08:00 by the technician. Your teacher types only the three means.')},
    sim:{modeLabel:'Simulated (fallback)',label:`Pool · simulated data · ${H(1,'Table A')}`,lead:'Too few bubbles today, so use these. Copy the 20 %, 80 % and 100 % values into the Data line under Table A (not into Table A). They are % light intensity, not distance.',html:simTable}
  };
  const interpretModes={
    live:{modeLabel:'Live counts',html:meansStrip,items:[Q.A2,Q.A3,Q.A4]},
    backup:{modeLabel:'Technician back-up (real)',html:meansStrip,items:[Q.A2,Q.A3,Q.A4]},
    sim:{modeLabel:'Simulated (fallback)',html:simStrip,items:[Q.A2,Q.A3,Q.A4sim]}
  };

  /* ---------- Exam-style mark scheme (original, not from an exam board; projected by the teacher) ---------- */
  const markA=A([
    m('1','Magnesium is needed to make chlorophyll (this point must be one of the three).'),
    m('2','Less chlorophyll means less light is absorbed, so less photosynthesis (this point must also be one of the three).'),
    m('3','Less photosynthesis, so less glucose is made.'),
    m('4','Less glucose to make cellulose, proteins and other substances for growth, so lower dry mass.')
  ],[c('Marking',['Any three points, one mark each; the three must include point 1 and point 2.','Do not credit: “magnesium is food”, “magnesium gives energy”, or “magnesium makes it green” with no link onward.'])],3);
  const markB=A([
    m('1','The yellow and green areas differ in chlorophyll, not light (they had the same light), so the result supports “chlorophyll is needed”, not “light is needed”.'),
    m('2','A correct test for light: cover part of a green area with foil (or black card) and compare it with an uncovered green area.')
  ],[c('Marking',['One mark each.','Do not credit: “green parts take up iodine better”.'])],2);
  const dontCredit=A([
    m('(a)','“Magnesium is food.” “Magnesium gives the plant energy.” “Magnesium makes it green” with nothing after it.'),
    m('(b)','“Green parts take up iodine better”: the ethanol removed the chlorophyll before the iodine went on.')
  ],[c('Why these lose the mark',['Ions release no energy and are not food.','The chain must go on from chlorophyll to light, glucose and mass.'])]);
  const pondA2=A([m('1','The pattern, with two means quoted and the unit (bubbles per minute).'),m('2','Further away, the light intensity is lower.'),m('3','So less light energy is absorbed by chlorophyll, so the rate of photosynthesis is lower.'),m('4','So less oxygen is released: fewer bubbles.')],[c('Do not credit',['“The plant has less energy.”','“Weaker light makes fewer bubbles” with no photosynthesis link.'])]);
  const pondA3=A([m('1','The lamp also heats the water.'),m('2','Temperature affects the enzymes, so the rate of photosynthesis.'),m('3','Without the shield, a change in bubbles could be caused by temperature as well as light.'),m('4','The temperatures before and after (quoted) stayed about the same, so only light changed.')],[c('Credit',['If the temperatures did change, saying so and that the comparison is weaker earns point 4.'])]);
  const pondPanels=[{title:'A2 · mark points',short:'A2 points',answer:pondA2},{title:'A3 · mark points',short:'A3 points',answer:pondA3}];
  const starchB1=A([m('Before 1 · Destarch','so any starch found was made during the experiment.'),m('1 · Boil','kills the cells and denatures the enzymes (given).'),m('2 · Ethanol','removes the chlorophyll, so the iodine colour can be seen.'),m('2 · Hot water bath','ethanol is highly flammable: no flame.'),m('3 · Rinse','softens the brittle leaf.'),m('4 · Iodine','blue-black where there is starch; orange-brown where there is none.')],[c('Do not credit',['“Iodine sticks to the green parts.”','“Ethanol kills the leaf” as the reason for ethanol.'])]);
  const starchPanels=[{title:'B1 · the reasons',short:'B1 reasons',answer:starchB1}];
  const modelHtml=`<div class="worked-answer"><p><strong>Answer:</strong> “At 5 °C the enzymes that control photosynthesis work slowly, <u>so</u> photosynthesis is slower, <u>so</u> fewer new cells and leaves can be made, <u>so</u> the seedlings are shorter, with a smaller leaf area.”</p><ol class="decisions"><li><strong>Start</strong> with what the factor does in the plant.</li><li><strong>Each “so”</strong> adds one link: each correct link can earn a mark.</li><li><strong>End</strong> at what the question asks: height.</li></ol></div>`;
  const selfPanels=[{title:'(a) · 3 marks',short:'(a) mark points',answer:markA},{title:'(b) · 2 marks',short:'(b) mark points',answer:markB},{title:'Do not credit',short:'do not credit',answer:dontCredit}];

  window.LESSON={
    number:6,unitLesson:6,unit:'Photosynthesis and plant gas exchange',spec:'Spec',
    title:'What does a plant need, and how do we know?',
    question:'What does a plant need to photosynthesise, and what evidence shows it?',
    path:['Do now','Pondweed','Starch evidence','Minerals','Exam-style question','Fresh check'],
    optionLetters:'WXYZ',
    learningIntention:'Use evidence from a water plant and from starch tests to decide what photosynthesis needs, by checking that only one condition differs in each comparison, and explain why plants need magnesium and nitrate ions to grow.',
    specificationPoints:[
      {code:'2.23',text:'practical: investigate the evolution of oxygen from a water plant, the production of starch, and the requirements of light, carbon dioxide and chlorophyll for photosynthesis'},
      {code:'2.22',text:'understand how a plant uses mineral ions: magnesium ions for chlorophyll and nitrate ions for amino acids'}
    ],
    outcomes:[
      ['Oxygen as evidence of rate: the pooled counts, explained by light intensity, with the heat shield keeping temperature the same.','2.23: oxygen from a water plant'],
      ['One difference, one claim: the fair pair for light, CO₂ or chlorophyll, and the reason for each starch-test step.','2.23: starch and the requirements'],
      ['Ion → molecule → growth: magnesium for chlorophyll, nitrate for amino acids and proteins.','2.22: mineral ions']
    ],
    criteria:CRITERIA,
    vocabulary:KEYWORDS.map(([a,b])=>({heading:a[0].toUpperCase()+a.slice(1),text:b})),
    resourcePages:[
      {heading:'Handout (two sides)',text:'The printed handout for this lesson: the same boxes as the screens. No answers.',href:R+encodeURIComponent('Handout - What does a plant need.html'),linkLabel:'Open the handout'},
      {heading:'Handout, large print',text:'The same handout in large print.',href:R+encodeURIComponent('Handout - What does a plant need (large print).html'),linkLabel:'Open the large-print handout'},
      {heading:'Fresh check slip, large print',text:'The fresh check on one large-print sheet.',href:R+encodeURIComponent('Fresh check slip (large print).html'),linkLabel:'Open the large-print slip'},
      {heading:'Fresh check slip',text:'The fresh check on its own slip. Your teacher hands it out face down.',href:R+encodeURIComponent('Fresh check slip.html'),linkLabel:'Open the slip'},
      {heading:'Handout on your device (typed answers)',text:'The same questions for typing, with read-aloud and larger text. Nothing is saved.',href:R+'handout-device.html',linkLabel:'Open the typed handout'},
      {heading:'Support cards',text:'Chain frame, what else changed, step strip, comparison grid, ion chain and command words, each with a recheck. No answers.',href:R+'support-cards.html',linkLabel:'Open the support cards'},
      {heading:'Depth boxes',text:'Depth boxes A5 and B5 on your device. No answers.',href:R+'depth-cards.html',linkLabel:'Open the depth boxes'}
    ],
    modelPages:[
      {heading:'Pondweed set-up',text:'LED lamp, heat shield, tube with pondweed in sodium hydrogencarbonate solution, thermometer, metre rule.',action:{id:'pondweed-question',label:'Return to the set-up'}},
      {heading:'Foil-strip leaf',text:'The worked comparison: covered and uncovered green.',action:{id:'foil-model',label:'Return to the foil-strip leaf'}}
    ],
    checkPages:[
      {heading:'Pair check',text:'Which two regions show that light is needed?',action:{id:'quick-check',label:'Open the pair check'}},
      {heading:'Exam-style question',text:'Cucumbers near Al Ain, 5 marks. Not from an exam board.',action:{id:'exam',label:'Open the question'}},
      {heading:'Fresh check',text:'8 marks, unaided, on your slip.',action:{id:'fresh-check',label:'Open the fresh check'}}
    ],
    ai:{pages:[]},
    uae:{label:'Al Ain greenhouse',pages:[]},
    phases:[
      p('do-now','Do now','content','Do now: three from earlier','retrieve',{nav:'Do now',mins:2,label:`Do now · from memory · ${H(1,'Do now')}`,lead:'Answer on the handout, unaided. Then correct in a different pen. The pondweed lamps are on at 10 cm from now.',items:Q.doNow,doThis:['Write all three before the answers are shown.']}),
      p('outcomes','Learning outcome','outcome','What will your work show?','outcomes',{nav:'Outcomes and criteria',mins:0.5,lead:'One goal for everyone. Three criteria, also at the top of handout side 1.',criteria:null,task:'Today: pondweed counts → starch evidence → minerals → exam-style question → fresh check.',resources:[resource('Open the handout','Handout - What does a plant need.html'),resource('Open the typed handout','handout-device.html')]}),
      p('pondweed-question','Input','content','Pondweed: what changes, what stays the same?','pondweed',{nav:'Pondweed: the question',mins:1,label:`Part A · ${H(1,'A1')}`,diagram:'pondweed-setup',caption:'Think: why the beaker of water? (No answer yet.) Schematic, not to scale; the shield touches the tube at every distance.',html:intensityStrip,items:[Q.A1],support:sup(['shield'],['words','colours'])}),
      p('pondweed-counts','Thinking','content','Count the bubbles: three distances','pondweed',{nav:'Pondweed: counts',mins:8.5,timer:8,label:`Part A · counts · ${H(1,'Table A')}`,lead:'Station pupils count. Everyone else watches the teacher’s station on the visualiser and writes its count in the “teacher” column of Table A.',items:['<strong>The rule:</strong> '+Q.countRule,'<strong>10 cm:</strong> count now (the lamp has been on since the start).','<strong>20 cm, then 40 cm:</strong> move the lamp (30 s), wait 2 min, count for 1 min.','<strong>During each 2-minute wait (everyone not counting):</strong> finish A1, then write your A2 prediction: how will the count change at 40 cm, and why?','<strong>After the 40 cm count:</strong> your teacher switches every lamp off at once.'],safety:'Lamps and leads stay on the far side of the tray, away from the water. Move the lamp by its base. Dry hands. Do not move the leads.',support:sup(['chain'],['words','colours'])}),
      p('pool','Thinking','content','Pool the counts','pondweed',{nav:'Pool the counts',mins:1.5,defaultMode:'live',modes:poolModes,lead:'Each station reads out its three counts. Copy them into Table A and work out each mean; your teacher types the means to check. Do the stations agree?',support:sup(['chain'],['words','colours'])}),
      p('interpret','Thinking','content','What do the counts show?','pondweed',{nav:'Interpret the counts',mins:5,defaultMode:'live',modes:interpretModes,label:`Part A · ${H(1,'A2, A3 and A4')}`,lead:'A2, A3 and A4, alone. You check A2 and A3 against the mark points on the next screen.',support:sup(['chain','shield'],['words','colours'])}),
      p('pondweed-check','Thinking','panels','Check A2 and A3, then revise','pondweed',{nav:'Check A2 and A3',mins:2,label:`Mark points · ${H(1,'A2 and A3 revision lines')}`,lead:'Tick each point you made. Add your weakest missing link on the revision line, in a different pen. Full marks on A2 and A3? Open depth box A5 (HOT) now.',panels:pondPanels,panelSets:{a2:[0],a3:[1]},panelButtons:[['a2','Show A2 mark points'],['a3','Show A3 mark points']],support:sup(['chain','shield'],['words','colours'],[A5]),hotNote}),
      p('starch-recap','Input','content','The starch test: why each step?','starch',{nav:'Starch test steps',mins:2,label:`Part B · ${H(2,'B1')}`,html:`<figure tabindex="0" aria-label="Scientific diagram" class="bio-figure strip-figure">${window.BioDiagrams.render('starch-steps',{})}<figcaption>Schematic. Fill each “because” first; the safety reason is shown with the answers.</figcaption></figure><p>${Q.B1destarch}</p>`,doThis:['Fill each “because” on the handout. Whiteboards: why ethanol? Why a water bath? Why destarch?'],support:sup(['steps'],['words','colours'])}),
      p('starch-check','Thinking','panels','Check your B1 reasons, then revise','starch',{nav:'Check B1 reasons',mins:0.5,label:`Reasons · ${H(2,'B1')}`,lead:'Tick each reason you gave. Correct any missing one in a different pen. Keep your first attempt.',panels:starchPanels,panelSets:{b1:[0]},panelButtons:[['b1','Show the B1 reasons']],support:sup(['steps'],['words','colours'])}),
      p('foil-model','Input','model','Worked example: the foil-strip leaf','starch',{nav:'Worked example: foil strip',mins:1.5,label:`Part B · ${H(2,'B2')} · filled in for you`,diagram:'foil-leaf',caption:'Schematic. Illustrative result, not real data.',steps:[
        '<strong>Set-up.</strong> A destarched leaf has a foil strip across both sides. It is left in light for a day, then starch-tested. Predict: which part will be blue-black?',
        '<strong>Result (illustrative).</strong> The covered strip is orange-brown: no starch. The uncovered green parts are blue-black: starch.',
        '<strong>Pick the pair.</strong> Covered green vs uncovered green. Both have chlorophyll and CO₂. Only light differs.',
        '<strong>Claim only that.</strong> Light is needed for photosynthesis. Not “the foil killed the leaf”: the strip is living leaf that simply made no starch.',
        '<strong>How strong?</strong> One leaf only. Repeat with several leaves on several plants.'],html:GRIDS.foil,support:sup(['grid','steps'],['words','colours'])}),
      p('guided-variegated','Thinking','content','Your turn: the variegated leaf','starch',{nav:'Pair 1: variegated leaf',mins:2,label:`Part B · ${H(2,'B3, pair 1')} · grid given`,diagram:'variegated-leaf',caption:'Schematic. Illustrative result, not real data.',text:'A variegated leaf (green centre, white edge) was in light. After the starch test: green part blue-black, white part orange-brown.',html:GRIDS.variegated,doThis:['With a partner: fill the grid, then write the claim.'],support:sup(['grid'],['words','colours'])}),
      p('quick-check','Assess','hinge','Pair check: which two regions show light is needed?','check',{nav:'Pair check',mins:1.5,secure:true,label:`Everyone at once · ${H(2,'B4')}`,diagram:'hinge-leaf',caption:'A destarched variegated leaf with a foil strip across its middle, left in light.',lead:'Which two regions should you compare to show that <strong>light</strong> is needed?',options:['green uncovered and white uncovered','green covered and white covered','green uncovered and green covered','green uncovered and white covered'],task:'Whiteboards up: your letter (W, X, Y or Z) and why. Most boards right (about 8 in 10): we move on. Otherwise we check with the grid on the next screen. Then write it in box B4.'}),
      p('pair-grid','Input','table','Check the pair, then a new leaf','check',{nav:'Check the pair, then CO₂',mins:2,label:`Recheck · ${H(2,'B4')}`,lead:'<strong>If most boards were right, skip the grid; anyone who was not uses the comparison-grid card.</strong> Otherwise your teacher reveals the foil-leaf grid row by row: a fair pair differs in exactly one row.',columns:['Foil leaf region','Light?','Chlorophyll?'],rows:[['green, uncovered','Yes','Yes'],['green, covered','No','Yes'],['white, uncovered','Yes','No'],['white, covered','No','No']],reveal:true,task:`<strong>Then the recheck, for everyone, on whiteboards:</strong> two variegated leaves on one destarched plant are sealed in clear bags in light, one with soda lime and one without (the control). <strong>(a)</strong> Which two regions test whether <strong>CO₂</strong> is needed? <strong>(b)</strong> Why is no white region any use for this test?<figure class="bio-figure strip-figure" tabindex="0" aria-label="Scientific diagram">${window.BioDiagrams.render('co2-recheck',{})}<figcaption>Schematic. No result is shown.</figcaption></figure>`,support:sup(['grid'],['words','colours'],[B5]),hotNote}),
      p('minerals','Input','model','Minerals: not food, but needed','minerals',{nav:'Minerals: explain',mins:1.5,label:'Part C · listen and look',diagram:'mineral-trays',caption:'Illustrative trays, not real results.',steps:[
        '<strong>Where ions come from.</strong> Mineral ions are dissolved in soil water and absorbed through the roots. They are not food: they release no energy.',
        '<strong>Magnesium.</strong> Magnesium is part of the chlorophyll molecule. Less chlorophyll → leaves yellow between the veins → less light absorbed → less photosynthesis → less glucose.',
        '<strong>Nitrate.</strong> Nitrate supplies nitrogen for amino acids → proteins (including enzymes) for new cells. Without it, some glucose and starch are still made, but less as the leaves pale (chlorophyll and enzymes contain nitrogen). Growth is limited mainly because proteins cannot be made.'],support:sup(['ions'],['words','colours'])}),
      p('deficiency','Thinking','content','Complete the deficiency table','minerals',{nav:'Deficiency table and C2',mins:2.5,label:`Part C · ${H(2,'C1 and C2')}`,lead:'Finish the magnesium row. Then do the nitrate row alone. Each row must reach growth.',html:deficiency,items:[Q.C2],doThis:['C2: answer aloud when asked; write it on the lines if there is time.','Last 30 seconds: your teacher shows the answers. Tick, and correct C1 and C2 in a different pen.'],support:sup(['ions'],['words'])}),
      p('exam-model','Input','content','What a developed answer does','exam',{nav:'A developed answer',mins:0.5,label:'A worked answer for a different factor',lead:'Read this answer to a different question: “Explain why seedlings kept at 5 °C were shorter. [3]”',html:modelHtml,doThis:['Your question is about magnesium: use the same moves, not the same words.'],support:sup(['command'],['words'])}),
      p('exam','Assess','content','Exam-style question: cucumbers near Al Ain','exam',{nav:'Exam-style question',mins:5,label:`Part D · not from an exam board · 5 marks · ${H(2,'D')}`,text:EXAM.stem,html:cucumber,items:[EXAM.a+`<br><em>${EXAM.aUnpack}</em>`,EXAM.b+`<br><em>${EXAM.bUnpack}</em>`],doThis:['Fold the handout so Part C is hidden, then answer alone.'],support:sup(['command','grid'],['words','colours'],[A5,B5]),hotNote}),
      p('self-check','Thinking','panels','Check, then revise','revise',{nav:'Self-check and revise',mins:2,label:`Mark points · not from an exam board · ${H(2,'D')}`,lead:'Tick each point you earned. Add your weakest missing link in a different pen. Keep your first attempt.',panels:selfPanels,panelSets:{a:[0],b:[1],dont:[2]},panelButtons:[['a','Show (a) mark points'],['b','Show (b) mark points'],['dont','Show do not credit']],support:sup(['command','ions','grid'],['words','colours'],[A5,B5]),hotNote}),
      p('fresh-check','Assess','content','Fresh check 1: alone, on your slip','fresh',{nav:'Fresh check 1 (unaided)',mins:1.5,timer:5.5,secure:true,hideMins:true,timerGroup:'fresh',label:'Fresh check · unaided · one 5½-minute clock for both screens · 1 of 2 · 2 marks',items:[FRESH.q1],doThis:['Turn your handout face down. Notes and cards stay closed; your access arrangements stay.','Write on your slip. No slip? Write in your book.']}),
      p('fresh-check-2','Assess','content','Fresh check 2: gas, a step and an ion','fresh',{nav:'Fresh check 2 (unaided)',mins:4,timer:5.5,secure:true,hideMins:true,timerGroup:'fresh',label:'Fresh check · unaided · the same clock carries on from screen 1 · 2 of 2 · 6 marks (Q2 3, Q3 1, Q4 2)',html:FRESH.q2table,items:[FRESH.q2,FRESH.q3,FRESH.q4],doThis:['Write on your slip. Then turn it face down.']})
    ]
  };
  window.LESSON.phases[1].criteria=window.LESSON.criteria;
  window.L6ETeacher={cutOrder:['The developed-answer screen (0.5 min): skip it.','Depth boxes: drop the depth window (they stay on the handout and the depth-card page).','C2 is already answered aloud by default.','A4: take it orally, only as a last resort (about 1.5 min of Interpret).'],anchor:'Start the fresh check by minute 43.5 whatever happens (C2 is already answered aloud).',neverCut:'Never cut: A3 and the A2/A3 check, the pair check, the exam-style question, the self-check and revision, the fresh check.'};
  window.L6E={DATA,Q,FRAMES,FRESH,EXAM,CRITERIA,KEYWORDS,STARCH_STEPS,GRIDS,SUPPORT,access,depth,A5,B5,RESULT_HEAD,DEF_HEAD,YN,poolModes,interpretModes,
    markA,markB,dontCredit,pondA2,pondA3,starchB1,modelHtml,tables:{poolTable,simTable,intensityStrip,deficiency,cucumber,starchStrip,grid},blank,H};
})();
