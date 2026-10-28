/* Lesson 4 · Hidden reviews for original classroom practice.
   Each screen, the Quick check and every widget task has its own model and subject-quality criteria.
   Exam-style questions are original and not from an exam board; the mark schemes are classroom schemes. */
window.LessonAnswerData=(()=>{
  const m=(heading,text)=>({heading,text});
  const c=(heading,items)=>({heading,items});
  const A=(models,criteria,marks=null)=>({models,criteria,marks});
  const S=(heading,text,items)=>A([m(heading,text)],[c('Success criteria',items)]);
  const interpretA=A([
    m('Example: back-up set, bright tube','Observed (back-up set, started earlier): purple. Expected: purple. Explained: CO₂ fell, so photosynthesis used CO₂ faster than respiration released it. Limitation: one tube, colour judged by eye, and a different time from the class tubes.'),
    m('Own tubes after about 10 min','A small or no colour change is likely in this time. Say so: “little change so far, so I cannot yet tell the net direction”. Little change is not the same as no activity.'),
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
      m('2 · Pre-check (not marked)','Yes. Respiration continues in the dark; photosynthesis needs light, so it stops. This one is not marked; it shows what you already know.')
    ],[c('What to check',['Route in order, through open stomata.','Pre-check: respiration named as the source of CO₂ in the dark. Not scored.'])]),
    outcomes:S('What today’s evidence will show','Your own predictions, a plan answering an exam-style question (not from an exam board), an interpretation with its source, a rewritten sentence and claim-strength recheck, a revised plan line, depth or revision work and an unaided fresh check.',['Net exchange from two rates.','Indicator read as CO₂ change, with the control.','Fair plan with how, why, control and repeats.']),
    'l3-return':A([
      m('O · Order','Air → open stomatal pore → air spaces → moist mesophyll surface → cell. Not through the cuticle or the xylem.'),
      m('Y · Direction','Name the higher side: CO₂ is higher in the outside air than inside, so net diffusion is inward.'),
      m('J · Named only','Add the physical effect: e.g. thin leaf → short diffusion distance → gases reach cells quickly.')
    ],[c('What to check',['The revision matches the code.','Made in a different pen; first attempt kept.','Your teacher will check some changed lines.'])]),
    'route-item':A([m('Model','Outside air → stomata (still partly open at dusk) → air spaces → moist mesophyll surface → cell. O₂ diffuses in, from the higher concentration outside (21%) to the lower concentration inside (18%). The cells keep using O₂ in respiration, which keeps the inside concentration lower. Feature, any one: many stomata on the lower surface give many entry points; air spaces in the spongy mesophyll let the gas reach the cells; a thin leaf gives a short diffusion distance; moist cell surfaces let O₂ dissolve and diffuse in.')],[c('Success criteria',['Route in the correct order.','Higher concentration outside, lower inside.','One feature named with how it helps (not just named).','Credit, not required: continued use in respiration maintains the gradient.'])]),
    'two-rates':A([
      m('Whiteboard check','In bright light, both processes happen: photosynthesis and respiration.'),
      m('The rule','Respiration releases CO₂ in all living cells, light and dark. Photosynthesis uses CO₂ only in light. Net = compare the two rates. Energy is released by respiration, not created.'),
      m('Dim light','Dim light can give net release, net uptake or little change. It depends on the two rates for that leaf; it does not guarantee a balance.'),
      m('Completed table','Photosynthesis needs light, uses CO₂, releases O₂, happens only in light, in cells with chloroplasts. Respiration does not need light, releases CO₂, uses O₂, happens all the time in all living cells.')
    ],[c('Success criteria',['Both processes in bright light.','Respiration never stops in living cells.','Net from comparing rates, not from light alone.','All five table rows correct, with “all the time” for respiration, not “at night”.'])]),
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
      A:A([m('Real tubes · setup check','Leaves on the gauze, placed with forceps, not touching the indicator; bungs in; the common start time recorded; the no-leaf control in the light; lamps away from liquid.')],[c('What to check',['Control present.','Roles followed; no measuring or cutting.','Each pupil still writes their own work.'])]),
      B:A([m('Demo set · annotation','Changed factor: light (bright / muslin dim / foil dark). Control: tube 4, no leaf, in the light. Kept the same, for example: volume and starting colour of indicator; leaf species and size; time; temperature (LED at a fixed distance); same tubes and bungs.')],[c('Success criteria',['One changed factor named.','Control labelled.','Two kept-same factors named.'])])
    }},
    plan:A([
      m('(a) · model plan','Put the same volume (e.g. 10 cm³) of hydrogencarbonate indicator, from the same stock and the same orange-red starting colour, into four boiling tubes. Place a leaf of the same species and similar size on a gauze platform above the indicator so it does not touch it, and seal with a bung. Leave one tube uncovered (bright), wrap one in muslin (dim) and one in foil (dark), all at the same distance from an LED lamp so the temperature stays the same. Set up a no-leaf control tube in the light. Leave them all for the same time, e.g. one hour, then compare the colours against a colour chart: yellow = more CO₂, purple = less CO₂. Repeat each condition, e.g. three tubes.'),
      m('(b) · model','It shows whether the indicator changes colour without a leaf (1), so any change in the leaf tubes can be linked to the leaf’s gas exchange, not to leaks, contamination or light on the indicator (1).')
    ],[c('(a) mark scheme (1 each, max 6)',['Leaves in sealed tubes of indicator, held above it (gauze or mesh) so they do not touch it.','Light changed in a stated way: dark (foil), dim (muslin), bright; or LED at fixed distance steps.','Same volume of indicator from the same stock, same starting colour.','Same species, similar size or age of leaf; or same temperature (heat filter or LED at a fixed distance); or same tube size and seal.','A no-leaf control tube for each light condition (or at least one in the light).','Same stated time, then compare with a colour chart (yellow = more CO₂, purple = less CO₂).','Repeat each condition, e.g. three tubes.']),c('Do not credit',['“Keep everything the same” without naming a factor.','Measuring O₂ with the indicator.','“The same person reads every tube”: sensible, but not a mark point. It is card K’s example row.']),c('(b) mark scheme (2)',['Shows whether the indicator changes without a leaf (1).','So the change can be linked to the leaf, not leaks, contamination or light on the indicator (1).'])],8),
    interpret:{stateKey:'mode',variants:{A:interpretA,B:interpretB}},
    'board-recap':A([
      m('Dark','Respiration only, so net CO₂ out.'),
      m('Dim (heavy shade)','Respiration is faster than photosynthesis in this illustration, so net CO₂ out. In lighter shade, or with another leaf, the net can be zero or inward.'),
      m('Bright','Photosynthesis is faster, so net CO₂ in, and respiration continues.')
    ],[c('Success criteria',['Names both rates.','Net from comparing them.','No claim that respiration stops.'])]),
    'quick-check':A([
      m('Best supported: 1, cautiously','Little net CO₂ change is consistent with similar rates over this time. One tube, one time and the indicator’s sensitivity mean it is not proof of exact balance.'),
      m('If you chose 2','Little change fits similar rates. One tube, one time and an indicator that may not show a tiny change cannot show “exactly equal”. Use “is consistent with”. Card H.'),
      m('If you chose 3','Respiration never stops in living cells, and a dim leaf still has some light. Unchanged colour means CO₂ given out ≈ CO₂ taken in, not “nothing happening”. Card B.'),
      m('If you chose 4','The same indicator turned yellow with breath, and the clean control behaved as expected. There is no evidence it failed. What result would show a failed indicator? Card H.')
    ],[c('What next',['Option 1 with a rate reason: carry on.','Option 1 with no reason: add which two rates.','Option 2, 3 or 4: do the recheck on the next screen. Card H helps with 2 or 4; card B helps with 3.'])]),
    'rewrite-recheck':A([
      m('An improved sentence','“The dim tube stayed orange-red, like the clean control, so there was little net CO₂ change: the photosynthesis and respiration rates may have been similar over this time, but this does not prove they were exactly equal.”'),
      ...window.L4Cards.claimRecheck.models.map(x=>m('Recheck '+x.heading,x.text))
    ],[c('Rewrite criteria',['Uses both rates (criterion 1).','Uses the colour as a CO₂ change and the control (criterion 2).','Claim at the right strength.']),c('Claim-strength recheck criteria',window.L4Cards.claimRecheck.criteria[0].items),c('After marking',['A pass fades card H or card B for this criterion.','A fail: redo it in the depth-or-revision slot with the line for your number.','Fresh-check item 1 is the unaided retry.'])]),
    'peer-check':A([m('An example comment and revision','Reviewer: “Say all tubes use the same volume of indicator from the same stock.” Writer: checks it is on the scheme, then adds: “Use 10 cm³ of indicator from the same stock in each tube, so any colour difference is caused by the leaf and the light, not by different amounts of indicator.”')],[c('What the teacher checks',['The comment names one exact mark point from the scheme.','The changed line is correct.','A “why” is given.','No grades given by peers.'])]),
    'depth-slot':A([
      m('Route rule','Depth if (i) Quick check option 1 with a rate reason, or a correct claim-strength recheck, and (ii) a plan with at least 4 of 6 mark points ticked after the peer check, including at least 2 points that were not modelled. Revision otherwise. A pupil can keep a support card and still take depth.'),
      m('Be ready to answer','Compensation claim: “What result would make you change your mind about ‘exact’?” Hot greenhouse decision: “Would cooling always be worth paying for? What would you need to know?” Prepared AI conclusion: “Which sentence would still be wrong even if the AI had seen our tubes?”'),
      m('How your work is used','Write it in your book under the plan and tick the card’s criteria. Some answers will be used, without names, at the start of the next lessons. The depth model answers are shown next lesson.')
    ],[c('Depth criteria',['Headed with the card name, under the plan.','30 seconds of silent thinking before writing.','The card’s own criteria ticked by the pupil.']),c('Revision criteria',['One added plan point with how and why.','Any card recheck finished and marked.','A wrong claim-strength recheck redone using the line for that number.'])]),
    'fresh-check':A([
      m('1 · Criterion 2 [3]','CO₂ fell in both tubes, because both turned purple (1). The change cannot be linked to the leaf, because the control changed without a leaf (1). A named cause, such as the lamp heating the tubes, algae or another green contaminant photosynthesising in the control, or indicator that did not start at the air level, so repeat with a clean control before concluding (1). Do not credit: the leaf made oxygen, or respiration stopped.'),
      m('2 · Criterion 1 [3]','Net CO₂ release of 3 units per hour (1), because respiration is faster than photosynthesis (1). Net O₂ uptake, because respiration uses O₂ faster than photosynthesis releases it (1).'),
      m('3 · Criterion 3 [2]','Flaw and fix (1): 2 minutes is too short; leave all tubes for the same, longer stated time, e.g. 1 hour. Why (1): the indicator changes colour only once enough CO₂ has been added or removed, so no visible change after 2 minutes does not show that net gas exchange is the same in light and dark; her conclusion is not supported. Allow for 1 mark only: one tube per condition, so repeat with about three each. Do not credit: temperature or a missing control (both are given as controlled); “make it fair” without a named factor.')
    ],[c('After the check',['Mark each item: unaided / with access tools only / not yet.'])],8)
  };
  return {main};
})();
