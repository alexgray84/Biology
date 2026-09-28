/* Lesson 2 · Enzymes, temperature and pH — main-screen model answers and original classroom mark schemes.
   Hidden until the pupil opens “Model answer & mark scheme”. All questions are original; data are illustrative.
   Pages are kept short so the non-scrolling drawer never clips at 1280×720. */
window.LessonAnswerData=(()=>{
  const m=(heading,text)=>({heading,text});
  const c=(heading,items)=>({heading,items});
  const A=(models,criteria,marks=null)=>({models,criteria,marks});
  const S=(heading,text,items)=>A([m(heading,text)],[c('What a successful response includes',items)]);

  const rejects=c('Do not accept',['“The enzyme is killed” or “dies”.','“Denatured by cold.”','“The active site is destroyed.”']);

  /* temperature-model: the review follows the model’s derived `denatured` state */
  const tempBase=A([
    m('Low and optimum','At 10 °C molecules collide less often: slow, not denatured. At 37 °C more kinetic energy means more collisions, so more complexes form.'),
    m('At 65 °C','Bonds holding the shape break; the active site changes shape. The substrate no longer fits: the enzyme is denatured.'),
    m('The cool-back test','Cooling to 37 °C does not restore the rate. Denaturation is permanent; cold only slows an enzyme.')
  ],[
    c('Success criteria',['Cold: fewer collisions; not denatured.','Warmer: more collisions, more complexes.','Hot: active site changes shape.']),
    c('Success criteria · continued',['Cooling back: no recovery.','Denaturation is permanent.']),
    rejects
  ]);
  tempBase.stateKey='denatured';
  tempBase.variants={
    false:A([
      m('Not denatured','Cold: the active site keeps its shape; the enzyme is slow because collisions are less frequent. Above about 45 °C the shape starts to change.'),
      m('Towards the optimum','Warming gives more kinetic energy: more collisions, so more enzyme–substrate complexes each second. The rate rises.'),
      m('Next','Step to 65 °C, then cool back to 37 °C.')
    ],[
      c('Success criteria',['Cold: slow, not denatured.','Warming: more collisions.','More complexes per second.']),
      rejects
    ]),
    true:A([
      m('Denatured','Bonds holding the shape broke; the active site changed shape. The substrate no longer fits, so no complexes form.'),
      m('The cool-back result','Cooling to 37 °C does not restore the shape: the rate stays near zero. Denaturation is permanent.'),
      m('Grade 8–9 link','Above the optimum, a growing proportion of enzyme molecules is denatured, so the rate falls progressively.')
    ],[
      c('Success criteria',['Active site changed shape.','Substrate no longer fits.','Cooling does not reverse it.']),
      rejects
    ])
  };

  /* specificity: follows the chosen substrate */
  const specBase=A([
    m('Complementary substrate','Its shape is complementary to the active site, so it binds, forms a complex and becomes products.'),
    m('Different substrate','Its shape is not complementary, so it cannot bind. No complex forms: no reaction.'),
    m('The rule','Each enzyme is specific: it catalyses only the reaction whose substrate fits its active site.')
  ],[c('Success criteria',['Complementary shape binds.','Different shape cannot bind.','Uses “specific”.'])]);
  specBase.stateKey='substrate';
  specBase.variants={
    match:A([m('It fits','The substrate is complementary to the active site, so it binds. An enzyme–substrate complex forms and products are released.'),m('Now switch','Choose Different shape. Predict before you press Try it.')],[c('Success criteria',['Uses “complementary”.','Complex forms.','Products released.'])]),
    other:A([m('It does not fit','This shape is not complementary to the active site, so it cannot bind. No complex forms, so it is not broken down.'),m('The rule','An enzyme is specific: only a complementary substrate binds.')],[c('Success criteria',['Not complementary.','No complex, no reaction.','Enzyme is specific.'])])
  };

  /* pH: follows the chosen enzyme on the model screen */
  const phBase=A([
    m('Three optima','Pepsin about pH 2; salivary amylase about pH 7; trypsin about pH 8. Values are approximate.'),
    m('Away from the optimum','Bonds holding the shape are altered, so the active site changes shape. Fewer complexes form: the rate falls.'),
    m('Extreme pH','Far from the optimum the enzyme is denatured, permanently.')
  ],[c('Success criteria',['Optimum read from the peak.','Active site changes shape.','Extreme pH denatures.'])]);
  phBase.stateKey='enzyme';
  const phVariant=(name,opt,where)=>A([
    m(`${name} · about pH ${opt}`,`${name} works fastest near pH ${opt}, ${where}. There its active site is complementary to its substrate.`),
    m('Away from the optimum','The active site changes shape, the substrate fits less well and fewer complexes form: the rate falls.'),
    m('Far from the optimum','At extreme pH the enzyme is denatured. Returning to the optimum does not restore it.')
  ],[c('Success criteria',[`Optimum about pH ${opt}.`,'Active site changes shape.','Extreme pH: permanent.'])]);
  phBase.variants={
    amylase:phVariant('Salivary amylase','7','the pH of saliva'),
    pepsin:phVariant('Pepsin','2','the acidic stomach'),
    trypsin:phVariant('Trypsin','8','the alkaline small intestine')
  };

  const main={
    outcomes:S('What success looks like','Explain enzyme action and specificity; explain temperature and pH effects using denaturation; plan and evaluate the amylase practical.',['Explain, do not just define.','Rate = 1 ÷ time, in s⁻¹.']),

    'do-now':A([
      m('Answers 1–2','1 Amino acids. 2 Iodine solution: orange-brown → blue-black.'),
      m('Answers 3–4','3 Benedict’s test, in a hot water bath. 4 Faster at 37 °C: at 80 °C amylase, a protein, is denatured.')
    ],[
      c('Mark scheme · 4 marks',['1 Amino acids [1]','2 Iodine; orange-brown → blue-black [1]','3 Benedict’s [1]','4 37 °C with a reason [1]']),
      c('Notes',['2: reject “turns black” alone.','4: a reasoned wrong prediction is fine today.'])
    ],4),

    catalyst:A([
      m('An enzyme','A protein made by cells that acts as a biological catalyst. It speeds up metabolic reactions without being used up.'),
      m('Two examples','Breakdown: starch → maltose in digestion. Build-up: glucose → glycogen in the liver and muscles.')
    ],[c('Success criteria',['Protein; biological catalyst.','Not used up.','Breakdown and build-up examples.'])]),

    'active-site':A([
      m('Stages 1–2','The substrate’s shape is complementary to the active site, so it binds: an enzyme–substrate complex forms.'),
      m('Stages 3–4','The reaction happens; products are released. The enzyme is unchanged, so it binds another substrate.')
    ],[c('Success criteria',['Complementary active site.','Enzyme–substrate complex.','Products released; enzyme reused.'])]),

    specificity:specBase,

    digestive:A([
      m('Rows 1–2','Amylase: starch → maltose. Maltase: maltose → glucose. Together they digest starch to glucose.'),
      m('Rows 3–4','Protease: protein → amino acids. Lipase: lipids → fatty acids and glycerol, the units from Monday.')
    ],[c('Success criteria',['Four correct substrates.','Maltose (not glucose) from amylase.','Amylase and maltase circled.'])]),

    'specificity-hinge':A([
      m('B · not complementary','The protease’s active site is complementary to protein, not starch. Starch cannot bind, so no complex forms.'),
      m('Next move','If you chose A, C or D, retest both shapes in the specificity model.')
    ],[c('What each wrong choice reveals',['A: amylase digests starch, so size is not it.','C: heat or pH denature enzymes.','D: catalysts are not used up.'])]),

    'temperature-model':tempBase,

    'temp-graph':A([
      m('Describe','The rate rises to a peak at about 40 °C, the optimum, then falls to zero by about 60 °C.'),
      m('Below the optimum','More kinetic energy → faster movement → more collisions → more enzyme–substrate complexes per second.'),
      m('Above the optimum','Active sites change shape; a growing proportion of molecules is denatured, so the rate falls. This is permanent.')
    ],[c('Success criteria',['Describe: rise, 40 °C peak, fall.','Rise: more collisions.','Fall: active sites change shape.'])]),

    ph:phBase,
    'ph-model':phBase,

    'graph-hinge':A([
      m('C · active site changes shape','Heat breaks bonds holding amylase’s shape. The active site changes shape, so starch no longer fits: denatured.'),
      m('Next move','Rerun the cool-back test in the temperature model.')
    ],[c('What each wrong choice reveals',['A: enzymes are not alive.','B: faster molecules collide more.','D: the enzyme is denatured, not starch.'])]),

    'method-model':A([
      m('Steps 1–3','Iodine in each well. Warm 2 cm³ starch and 2 cm³ amylase separately for 5 minutes. Mix; start the stopwatch.'),
      m('Steps 4–6','Every 30 s, test a drop with iodine. End-point: stays orange-brown. Repeat three times; mean; rate = 1 ÷ time.'),
      m('Why pre-warm?','Both solutions reach the chosen temperature before mixing.')
    ],[c('Success criteria',['Six steps in order.','Pre-warming explained.','Safety: eye protection; skin contact.'])]),

    'virtual-investigation':A([
      m('Results · illustrative','20 °C: 240 s, 0.0042 s⁻¹. 40 °C: 90 s, 0.011 s⁻¹. 60 °C: no end-point by 600 s, rate about 0.'),
      m('What they show','The rate rises from 20 °C to 40 °C: more collisions. At 60 °C amylase is denatured, so starch remains.')
    ],[c('Success criteria',['Headings with units.','Correct times and rates.','60 °C: denatured.'])]),

    'rate-calc':A([
      m('(a) Rates','40 °C: 1 ÷ 90 = 0.011 s⁻¹. 20 °C: 1 ÷ 240 = 0.0042 s⁻¹.'),
      m('(b) Precision','Sampling was every 30 s, so the starch could have run out any time from 60 to 90 s. Known only to 30 s: a third of 90 s.')
    ],[
      c('(a) · 2 marks',['0.011 s⁻¹ [1]','0.0042 s⁻¹ [1]','Accept 1.1 × 10⁻² and 4.2 × 10⁻³.']),
      c('(b) · 2 marks',['End-point up to 30 s earlier [1]','Known only to 30 s; large vs 90 s [1]','Reject “repeats make it accurate”.'])
    ],4),

    'plan-model':A([
      m('C, O, R','Buffers set pH 4–9 in steps of 1. Amylase from one stock. Three repeats at each pH; calculate a mean.'),
      m('M, M','Mix starch and buffer with amylase. Every 30 s test a drop with iodine. Time until it stays orange-brown.'),
      m('S, S','Keep 37 °C with a water bath. Keep volumes and concentrations the same. Rate = 1 ÷ time.')
    ],[
      c('Indicative content (1)',['pH range using buffers [1]','Same amylase source [1]','Iodine sampled regularly [1]']),
      c('Indicative content (2)',['Time to orange-brown [1]','Temperature controlled [1]','Repeats and mean [1]']),
      c('Marking note',['Maximum 6 marks.','Also credit: same starch volume.'])
    ],6),

    'plan-independent':A([
      m('Set up','Put equal volumes of casein and protease in separate tubes in a 20 °C water bath for 5 minutes. Mix; start a stopwatch.'),
      m('Measure','Time until the mixture goes clear, e.g. a cross behind the tube becomes visible. Rate = 1 ÷ time.'),
      m('Range and control','Repeat at 30, 40, 50 and 60 °C, three times each; use the mean. Buffer the pH. Same protease source.')
    ],[
      c('How this is marked',['1 mark per point, maximum 6.','Any order.','Reject “the protease dies”.']),
      c('Creditworthy points (1)',['Five temperatures; water baths [1]','Pre-warm separately [1]','Time until clear [1]']),
      c('Creditworthy points (2)',['Same casein volume/concentration [1]','Same protease volume/source [1]','Same pH (buffer) [1]']),
      c('Creditworthy points (3)',['Three repeats; mean [1]','Rate = 1 ÷ time [1]'])
    ],6),

    'data-analysis':A([
      m('(a) and (b)','Anomaly: 300 s. Mean = (60 + 120) ÷ 2 = 90 s. Rate = 1 ÷ 90 = 0.011 s⁻¹.'),
      m('(c) 60 °C','Amylase is denatured: its active site changes shape, so starch no longer fits. Starch remains, so no end-point.')
    ],[
      c('(a) and (b) · 3 marks',['Excludes 300 s [1]','Mean 90 s [1]','Rate 0.011 s⁻¹ [1]']),
      c('(c) · 3 marks',['Denatured [1]','Active site changes shape; no fit [1]','Starch not broken down [1]']),
      c('Do not accept',['Mean of all three: 160 s.','“Killed”; “starch is denatured”.'])
    ],6),

    exit:A([
      m('1 · Active site','The region of an enzyme with a specific shape, complementary to its substrate.'),
      m('2 · Boiled amylase','Boiling changed the active-site shape. This is permanent, so cooling does not restore it.'),
      m('3 · Pepsin','Its optimum is about pH 2, like the stomach. At about pH 8 its active site changes shape.')
    ],[
      c('Mark scheme · 5 marks',['1 Complementary region; substrate binds [1]','2 Denatured; shape changed [1]','2 Permanent; not reversed [1]']),
      c('Mark scheme · continued',['3 Optimum about pH 2 / acidic [1]','3 Intestine alkaline; shape changes [1]','Reject “killed”.'])
    ],5)
  };
  return {main};
})();
