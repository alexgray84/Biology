/* Lesson 4 · Hidden reviews for original classroom practice.
   Each screen, hinge and widget task has its own model and subject-quality criteria.
   Exam-style questions are original and not from an exam board; the mark schemes are classroom schemes. */
window.LessonAnswerData=(()=>{
  const m=(heading,text)=>({heading,text});
  const c=(heading,items)=>({heading,items});
  const A=(models,criteria,marks=null)=>({models,criteria,marks});
  const S=(heading,text,items)=>A([m(heading,text)],[c('Success criteria',items)]);
  const interpretA=A([
    m('Example: back-up set, bright tube','Observed (back-up set, started earlier): purple. Expected: purple. Explained: CO₂ fell, so photosynthesis used CO₂ faster than respiration released it. Limitation: one tube, colour judged by eye, and a different time from the class tubes.'),
    m('Own tubes after 10–15 min','A small or no colour change is likely in this time. Say so: “little change so far, so I cannot yet tell the net direction”. Little change is not the same as no activity.'),
    m('Always','Name the source of each observation: own tubes or back-up set. The indicator shows CO₂ change only; O₂ is inferred from the processes, not observed.')
  ],[c('Success criteria',['Source named.','Colour read as a CO₂ change.','Net result explained from both rates.','One valid limitation.'])]);
  const interpretB=A([
    m('Example: illustrative bright tube','Observed (illustrative, not observed in this lesson): purple. Expected: purple. Explained: CO₂ fell, so photosynthesis used CO₂ faster than respiration released it. Limitation: illustrative data, not our measurement; one tube; colour judged by eye.'),
    m('Illustrative dim tube','Orange-red: little net CO₂ change over this time. This is consistent with similar rates; it does not prove they were exactly equal, and a real dim tube could go either way.'),
    m('Dark and control','Dark: yellow, so CO₂ rose: respiration only, no photosynthesis. Control: stayed orange-red, so the colour changes in the leaf tubes can be linked to the leaves.')
  ],[c('Success criteria',['Source named: demo set or illustrative.','Colour read as a CO₂ change.','Net result explained from both rates.','One valid limitation.'])]);
  const main={
    'do-now':A([
      m('1 · Route','Air → open stomata → air spaces → moist mesophyll surface → cell, by diffusion down a concentration gradient.'),
      m('2 · Pre-check (not marked)','Yes. Respiration continues in the dark; photosynthesis needs light, so it stops. This is used only to decide how much to stress respiration next.')
    ],[c('What to check',['Route in order, through open stomata.','Pre-check: respiration named as the source of CO₂ in the dark. Not scored.'])]),
    outcomes:S('What today’s evidence will show','Your own predictions, a plan answering an exam-style question (not from an exam board), an interpretation with its source, a rewritten sentence, a revised plan line and an unaided fresh check.',['Net exchange from two rates.','Indicator read as CO₂ change, with the control.','Fair plan with how, why, control and repeats.']),
    'l3-return':A([
      m('O · Order','Air → open stomatal pore → air spaces → moist mesophyll surface → cell. Not through the cuticle or the xylem.'),
      m('Y · Direction','Name the higher side: CO₂ is higher in the outside air than inside, so net diffusion is inward.'),
      m('J · Named only','Add the physical effect: e.g. thin leaf → short diffusion distance → gases reach cells quickly.')
    ],[c('What to check',['The revision matches the code.','Made in a different pen; first attempt kept.','The teacher samples at least six books and checks the changed line.'])]),
    'route-item':A([m('Model','Outside air → open stomata → air spaces → moist mesophyll surface → cell. O₂ diffuses in, from the higher concentration outside (21%) to the lower concentration inside (18%). The cells keep using O₂ in respiration, which keeps the inside concentration lower. Feature, any one: many stomata on the lower surface give many entry points; air spaces in the spongy mesophyll let the gas reach the cells; a thin leaf gives a short diffusion distance; moist cell surfaces let O₂ dissolve and diffuse in.')],[c('Success criteria',['Route in the correct order.','Higher concentration outside, lower inside.','One feature named with how it helps (not just named).','Credit, not required: continued use in respiration maintains the gradient.'])]),
    'two-rates':A([
      m('Whiteboard check','In bright light, both processes happen: photosynthesis and respiration.'),
      m('The rule','Respiration releases CO₂ in all living cells, light and dark. Photosynthesis uses CO₂ only in light. Net = compare the two rates. Energy is released by respiration, not created.'),
      m('Dim light','Dim light can give net release, net uptake or little change. It depends on the two rates for that leaf; it does not guarantee a balance.')
    ],[c('Success criteria',['Both processes in bright light.','Respiration never stops in living cells.','Net from comparing rates, not from light alone.'])]),
    compare:A([m('Completed table','Photosynthesis needs light, uses CO₂, releases O₂, happens only in light, in cells with chloroplasts. Respiration does not need light, releases CO₂, uses O₂, happens all the time in all living cells.')],[c('Success criteria',['All five rows correct for both processes.','Respiration “all the time”, not “at night”.'])]),
    indicator:A([
      m('The scale','Yellow = more CO₂ than air. Orange-red = about the air level. Purple = less CO₂ than air. It shows CO₂ change only; it is not an O₂ test.'),
      m('The control','A tube with no leaf, set up the same way. If it stays orange-red, colour changes in the leaf tubes can be linked to the leaf rather than to leaks, contamination or light on the indicator.'),
      m('Safe actions','Eye protection on; hands off the indicator and the inside of tubes; lamps fixed with water away from leads; wash hands after leaves; no sucking on straws.')
    ],[c('Success criteria',['Colours matched to CO₂ change in the right direction.','Purpose of the control stated.','One safe action shown.'])]),
    predictions:A([
      m('Bright','Purple is likely: photosynthesis can be faster than respiration, so net CO₂ uptake.'),
      m('Dark','Yellow: respiration only, no photosynthesis, so net CO₂ release.'),
      m('Dim','It depends on the two rates. Any direction or little change is possible. A conditional answer is expected: “If photosynthesis is slower than respiration, then yellow-ish…”.'),
      m('No-leaf control','Stays near its starting orange-red, if it is clean and sealed.')
    ],[c('Success criteria',['Every tube has a reason naming the process or processes.','Dim is conditional, not “exactly equal”.','No claim that respiration stops in the light.'])]),
    setup:{stateKey:'mode',variants:{
      A:A([m('Mode A · setup check','Leaves on the mesh, not touching the indicator; bungs in; the common start time recorded; the no-leaf control in the light; lamps away from liquid.')],[c('What to check',['Control present.','Roles followed; no measuring or cutting.','Each pupil still writes their own work.'])]),
      B:A([m('Mode B · annotation','Changed factor: light (bright / muslin dim / foil dark). Control: tube 4, no leaf, in the light. Kept the same, for example: volume and starting colour of indicator; leaf species and size; time; temperature (LED at a fixed distance); same tubes and bungs.')],[c('Success criteria',['One changed factor named.','Control labelled.','Two kept-same factors named.'])])
    }},
    plan:A([
      m('Question A · model plan','Put the same volume (e.g. 10 cm³) of hydrogencarbonate indicator, from the same stock and the same orange-red starting colour, into four boiling tubes. Place a leaf of the same species and similar size on a gauze platform above the indicator so it does not touch it, and seal with a bung. Leave one tube uncovered (bright), wrap one in muslin (dim) and one in foil (dark), all at the same distance from an LED lamp so the temperature stays the same. Set up a no-leaf control tube in the light. Leave them all for the same time, e.g. one hour, then compare the colours against a colour chart: yellow = more CO₂, purple = less CO₂. Repeat each condition, e.g. three tubes.'),
      m('Question B · model','It shows whether the indicator changes colour without a leaf (1), so any change in the leaf tubes can be linked to the leaf’s gas exchange, not to leaks, contamination or light on the indicator (1).')
    ],[c('Question A mark scheme (1 each, max 6)',['Leaves in sealed tubes of indicator, held above it (gauze or mesh) so they do not touch it.','Light changed in a stated way: dark (foil), dim (muslin), bright; or LED at fixed distance steps.','Same volume of indicator from the same stock, same starting colour.','Same species, similar size or age of leaf; or same temperature (heat filter or LED at a fixed distance); or same tube size and seal.','A no-leaf control tube for each light condition (or at least one in the light).','Same stated time, then compare with a colour chart (yellow = more CO₂, purple = less CO₂).','Repeat each condition, e.g. three tubes.']),c('Do not credit',['“Keep everything the same” without naming a factor.','Measuring O₂ with the indicator.']),c('Question B mark scheme (2)',['Shows whether the indicator changes without a leaf (1).','So the change can be linked to the leaf, not leaks, contamination or light on the indicator (1).'])],8),
    interpret:{stateKey:'mode',variants:{A:interpretA,B:interpretB}},
    'sim-test':A([
      m('Dark','Respiration releases CO₂ and there is no photosynthesis, so net CO₂ release (the tube heads to yellow).'),
      m('Dim and bright','Dim: it depends on the two rates. In the lab, 2 layers of muslin is close to balance and looks orange-red; 3 layers gives a small net release (orange); 1 layer gives a small net uptake. Compare the two rate bars, not just the colour. Bright: photosynthesis is much faster, so net uptake (towards purple).'),
      m('Transfer','Bright for 30 minutes: photosynthesis is faster than respiration, so net uptake and the tube turns purple. Then dark: photosynthesis stops but respiration continues, so net release and the CO₂ rises again. At 60 minutes the model shows orange (about 546 illustrative ppm): more CO₂ than at the start.'),
      m('Model vs real tubes','For example: the model uses illustrative units and a fixed temperature, and it assumes a clean control; real tubes also depend on time, tube volume, leaf size and indicator sensitivity.')
    ],[c('Success criteria',['Explanation from both rates, in one sentence.','Transfer prediction written before the reveal.','One valid model–real difference.','Recorded as model output, not measured data.'])]),
    hinge:A([
      m('Best supported: A, cautiously','Little net CO₂ change is consistent with similar rates over this time. It is not proof of exact balance: one tube, one time and the indicator’s sensitivity limit the inference.'),
      m('If you chose B','One tube over one time cannot prove the rates were exactly equal; the indicator may not show a very small change. “Consistent with” is as far as the evidence goes.'),
      m('If you chose C','Respiration never stops in living cells, and it happens in every light. No net change is not the same as no activity.'),
      m('If you chose D','The control stayed stable, and the same indicator changed colour in the other tubes, so there is no evidence it failed. A failed indicator would not respond to a known CO₂ change, e.g. breath.')
    ],[c('Response table',['A with a rate-comparison reason: secure.','A with no rate reason: ask “compare which two rates?”.','B or D: card H.','C: card B.'])]),
    'hinge-recheck':S('Recheck model','The purple tube shows a net CO₂ uptake, so photosynthesis was faster than respiration. Respiration still happened. The stable control links the change to the leaf.',['Net uptake.','Photosynthesis faster than respiration.','Respiration still happens.']),
    rewrite:S('An improved sentence','“The dim tube stayed orange-red, like the clean control, so there was little net CO₂ change: the photosynthesis and respiration rates may have been similar over this time, but this does not prove they were exactly equal.”',['Uses both rates (criterion 1).','Uses the colour as a CO₂ change and the control (criterion 2).','Claim at the right strength.']),
    'peer-check':A([m('An example comment and revision','Reviewer: “Say all tubes use the same volume of indicator from the same stock.” Writer: checks it is on the scheme, then adds: “Use 10 cm³ of indicator from the same stock in each tube, so any colour difference is caused by the leaf and the light, not by different amounts of indicator.”')],[c('What the teacher checks',['The comment names one exact mark point from the scheme.','The changed line is correct.','A “why” is given.','No grades given by peers.'])]),
    'fresh-check':A([
      m('1 · Criterion 2 [3]','CO₂ fell in both tubes, because both turned purple (1). The change cannot be linked to the leaf, because the control changed without a leaf (1). A named cause, such as contamination of the control tube or indicator that did not start at the air level, so repeat with a clean control before concluding (1). Do not credit: the leaf made oxygen, or respiration stopped.'),
      m('2 · Criterion 1 [3]','Net CO₂ release of 3 units per hour (1), because respiration is faster than photosynthesis (1). Net O₂ uptake, because respiration uses O₂ faster than photosynthesis releases it (1).'),
      m('3 · Criterion 3 [2]','Flaw and fix, any one (1): only one tube per bulb, so repeat with three tubes for each; the 60 W bulb also heats its tube, so use a heat filter or LEDs; 10 minutes may be too short for a colour change, so leave a stated longer time; no no-leaf control, so add a tube without pondweed under each bulb. Why it matters, matched to the flaw (1): for example, without repeats an odd tube cannot be spotted; heat changes both rates, so the difference cannot be put down to light alone. Do not credit: “make it fair” with no factor named.')
    ],[c('Record per item',['Unaided / access only / not yet.','Scientific quality and help used are recorded separately.','Classroom evidence, not a protected exam.'])],8)
  };
  return {main};
})();
