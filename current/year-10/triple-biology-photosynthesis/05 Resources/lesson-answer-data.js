/* Lesson 5 · A plan that convinces a sceptic · hidden reviews for original classroom practice.
   Each screen, the quick check and every code recheck, support recheck and depth card has its own
   model and subject-quality criteria. The exam-style question is original and not from an exam board;
   the mark scheme is a classroom scheme. pH values are illustrative. Answers are revealed by the teacher. */
window.LessonAnswerData=(()=>{
  const m=(heading,text)=>({heading,text});
  const c=(heading,items)=>({heading,items});
  const A=(models,criteria,marks=null)=>({models,criteria,marks});
  const S=(heading,text,items)=>A([m(heading,text)],[c('Success criteria',items)]);
  const L=window.L5Cards||{};
  const named=L.named||(k=>k);
  const main={
    'do-now':A([
      m('1 · Filament lamp (Lesson 2)','Light intensity increases, and temperature increases: a filament lamp heats the plant as it gets closer.'),
      m('2 · Indicator colours (Lesson 4)','Air level: orange-red. More CO₂: yellow. Less CO₂: purple. The indicator shows CO₂ change only; it is not an O₂ test.')
    ],[c('What to check',['1: both factors, each with a direction: the lamp also heats.','2: all three colours the right way round.'])]),
    outcomes:S('What today’s work will show','A changed line in a different pen and a recheck for your circled code; the flaw → fix → why line; an 8-mark exam-style plan with a revised point; and an unaided fresh check.',['A plan someone could follow.','Every choice justified with how and why.','A number, not a colour, and the control used to judge a claim.']),
    'code-board':A([
      ...['R','S','L','J','H','T'].map(k=>m(named(k),(L.CODES?.[k]?.meaning||'')+' Board activity: '+String(L.ACTIVITY?.[k]||'').replace(/<[^>]+>/g,''))),
      m('Codes are not grades','A code names the next step. The marks are in the teacher’s record; the book shows codes only.')
    ],[c('Success criteria',['Each pupil can find the circled code and say its words.','No changes are made before the examples.'])]),
    'code-examples':A([
      m('Example 1 · R, both rates','“At 3.3 the rate of photosynthesis equals the rate of respiration (P = R), so there is no net exchange of CO₂. Both processes continue.”'),
      m('Example 1 · its recheck','Duckweed, P = 6 and R = 6: the answer is withheld here, because it is the recheck for anyone with this code.'),
      m('Example 2 · J, judge the claim','“The evidence supports, at most, net CO₂ uptake (photosynthesis faster than respiration). With no control, the indicator might have changed by itself, so it does not prove it. To make it stronger: add a no-leaf control and use a colorimeter.”'),
      m('What the examples show','Each code points to one change. The changed line is in a different pen, and the first attempt stays visible.')
    ],[c('Success criteria',['The board activity is done on the coded answer, not a new one.','The rewrite does what the code says.','Neither example is a pupil’s answer.'])]),
    respond:A([
      ...['R','S','L','J','H'].map(k=>m(named(k),L.codeCards?.[k]?.[0]?.answer?.models?.[0]?.text||'')),
      m(named('T'),'The ceiling (a) is answered in the book; its model answer is in the HOT drawer.')
    ],[c('What to check (sample the changed line, not the whole answer)',['The board activity is done on the coded item.','A different pen; the first attempt is kept.','The changed line now does what the code says: both rates compared (R), sign turned into a direction (S), a factor named from the conditions (L), the claim matched to the evidence and the control (J), an action with a value plus a why (H).'])]),
    rechecks:A(['R','S','L','J','H','T'].flatMap(k=>(L.RECHECK_A?.[k]?.models||[]).map(x=>m(named(k)+(x.heading&&x.heading!=='Recheck model'?' · '+x.heading:''),x.text))),[c('Success criteria',['The recheck is answered with the card closed.','It uses the new values given, not the revised line.','Marked in a different pen once the answers are shown.'])]),
    'recheck-answers':S('Marking your own recheck','All six recheck answers are shown together by the teacher. A matching answer is ticked with its reason. A wrong answer is corrected in a different pen and shown to the teacher.',['The tick or correction is in a different pen.','The correction does what the code asks.','Anyone still unsure shows the teacher.']),
    debug:A([
      m('Filament lamp','Fix: an LED, or a water heat shield, with a thermometer. Why: heat changes the rates of both processes and can shift the indicator itself.'),
      m('10 minutes','Fix: about 60 minutes, or readings at intervals. Why: a change too small to see is not “no effect”.'),
      m('Indicator straight from the bottle','Fix: bubble room air through it until it is a steady orange-red. Why: otherwise the start colours differ for reasons other than the leaf.'),
      m('No control','Fix: a no-leaf tube at each light condition. Why: it shows any change not caused by the leaf.'),
      m('One tube each','Fix: three per condition, with a mean. Why: an odd tube can be spotted.'),
      m('Leaf “in” the tube, unclear','Fix: on gauze above the indicator, sealed. Why: no contact contamination, and the gas exchanged stays in the tube.'),
      m('“Under tissue”','Fix: a measured intensity (LED distance or a light meter). Why: light must be a value.'),
      m('By eye','Fix: a colorimeter or pH probe. Why: a number that does not depend on who is looking.')
    ],[c('Success criteria',['Each flaw has a fix that is an action.','Each why names what else would change the CO₂.','The most damaging flaw is chosen and justified (heat, time or equilibration).'])]),
    'live-model':A([
      m('Step 1','Same stock, same volume, equilibrated with air first, so every tube starts at the same CO₂ level.'),
      m('Step 2','Same plant, same number and size of discs, above the indicator, sealed.'),
      m('Step 3, the self-correction','“Keep the temperature the same” is rejected: no action, no reason. The rewrite gives the method (LED, a water tank, a thermometer) and the why (temperature changes both rates, and warming can change the indicator).'),
      m('Systematic error','Repeating a warm-tube method repeats the same bias; repeats reduce random variation only. A biased instrument is fixed by calibrating it against a known value.'),
      m('Tube count','3 leaf tubes at each of 3 distances (9) + 3 foil tubes = 12 leaf tubes; + 3 no-leaf controls, one at each distance = 15 tubes.')
    ],[c('Success criteria',['Each modelled step has an action, a value and a reason.','The vague step is replaced, not added to.','Repeatable is told apart from valid before the quick check.','The model is covered before pupils write.'])]),
    'quick-check':A([
      m('Best answer: 2','A water-filled heat shield removes the heating that comes with moving the lamp closer, so the only difference between the tubes is light. That improves validity.'),
      m('If you chose 1','Repeats make results repeatable, not valid. The heat from the lamp is there in every repeat, so repeating a biased method repeats the bias.'),
      m('If you chose 3','A brighter filament bulb gives off more heat, so it makes the heat problem worse. A faster colour change is not the same as a valid comparison.'),
      m('If you chose 4','Sensible, but it leaves the heat problem in place. The same person reading every tube does not stop temperature changing the CO₂.'),
      m('A different explanation','If the bathroom-scale example from the live model did not land: a ruler with the first centimetre cut off reads every length 1 cm short, however many times you measure. Repeating a biased method repeats the bias.'),
      m('Recheck','The recheck (a probe 0.3 too high) is on the screen; its answer has its own reveal there.')
    ],[c('Success criteria',['Option 2, with heat named as what else changes.','Repeatable and valid told apart.','The recheck: no, it is systematic; calibrate.'])]),
    'exam-plan':A([
      m('Strong answer to (a)',L.strongA||''),
      ...(L.markA?.models||[]).map(x=>m('(a) point '+x.heading,x.text)),
      m('(a) do not credit',(L.dontA?.models||[]).map(x=>x.text).join(' ')),
      ...(L.markB?.models||[]).map(x=>m(x.heading,x.text))
    ],[c('Marking',['(a) any six mark points, one mark each. For 6 out of 6, at least one mark must come from points 2, 4 or 7.','(b) 1 mark: plants differ, so their rates differ for reasons other than light. 1 mark: one plant, one cork borer, discs shared across all the intensities. Do not credit “repeat it” or “use more discs” with no link to the same plant.'])],8),
    'self-check':A([
      m('A revised point','Before: “Keep the temperature the same.” After, in a different pen: “Stand a glass tank of water between the LED and the tubes and check a thermometer beside them, because temperature changes the rates of photosynthesis and respiration.”'),
      m('Another example','Before: “Look at the colours after 10 minutes.” After: “Measure each tube’s pH with a probe at the start and after 60 minutes, because a small change may not be visible and a number does not depend on who is looking.”'),
      m('The control question','The no-leaf control at the same distance: if the leaf tube changed and its control did not, the leaf changed the CO₂, not the indicator on its own.'),
      m('Support rechecks','If you used a support card, mark your recheck against the projected answers in a different pen.')
    ],[c('Success criteria',['The added point is an action with a value, plus a why.','It is the weakest missing point, not the easiest.','The first attempt is kept; the revision is in a different pen.'])]),
    'fresh-check':A([
      m('1 [4]','Any two improvements, each with its reason (1 + 1 each). Best: monitor and control temperature (a thermometer, a water bath or shield), because an LED still warms the tubes a little and the room can change, and temperature changes both rates. Beads from one batch, mixed and shared across the distances, because batches can differ in the amount or activity of algae, so a difference could come from the batch rather than the light. A start reading for every tube, because the change in pH is the evidence and tubes may not start at the same pH. Equilibrate the indicator with air first, so every tube starts at the same pH. Also credit: three tubes per distance with a mean (anomalies detected); a no-bead control at each distance (shows change not due to the algae).'),
      m('Reason rule','A reason must name what else could change the result. Do not credit a reason that just repeats the improvement.')
    ],[c('Marking',['Out of 4 on this screen; the fresh check is out of 6 in all.','Two different improvements; each reason earns its own mark.','Credit “equilibrate the indicator first, so every tube starts at the same pH” as an improvement with its reason.','Do not credit “use an LED” (it already does).','Your teacher marks this and returns it in Lesson 6 with codes.'])],4),
    'fresh-check-2':A([
      m('2, first mark','The dark tube’s pH fell (8.3 → 7.9), so the beads respire and release CO₂. At 40 cm there was almost no change (8.3 → 8.4), so photosynthesis must have roughly balanced respiration: the algae were photosynthesising, and the claim is wrong.'),
      m('2, second mark','The 40 cm change (0.1) is tiny, from one tube, so it is too small to claim net uptake either; repeats are needed.')
    ],[c('Marking',['Out of 2 on this screen; the fresh check is out of 6 in all.','Do not credit “no change means nothing happened”.','The no-bead control (8.3, unchanged) shows the indicator did not change by itself.'])],2)
  };
  return {main};
})();
