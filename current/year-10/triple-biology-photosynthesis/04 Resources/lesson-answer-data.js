/* Lesson 4 · Two rates, one net · hidden reviews for original classroom practice.
   Each screen, the Quick check and every support, depth and widget task has its own model and
   subject-quality criteria. Exam-style questions are original and not from an exam board;
   the mark schemes are classroom schemes. Values are illustrative arbitrary units. */
window.LessonAnswerData=(()=>{
  const m=(heading,text)=>({heading,text});
  const c=(heading,items)=>({heading,items});
  const A=(models,criteria,marks=null)=>({models,criteria,marks});
  const S=(heading,text,items)=>A([m(heading,text)],[c('Success criteria',items)]);
  const L=window.L4Cards||{};
  const main={
    'do-now':A([
      m('1 · Route (Lesson 3)','Through a stoma → air spaces in the spongy mesophyll → dissolves in the moist surface of the cell → diffuses into the cell, down a concentration gradient.'),
      m('2 · Indicator','More CO₂ than air: yellow. Less CO₂ than air: purple. Orange-red is about the air level.'),
      m('3 · Plateau (Lesson 2)','Light is no longer the limiting factor. Another factor, such as CO₂ concentration or temperature, now limits the rate.')
    ],[c('What to check',['Route in order, through the stomata, ending in diffusion down a gradient.','Both colours the right way round.','The plateau names another limiting factor, not “photosynthesis stops”.'])]),
    outcomes:S('What today’s work will show','Your tube reading and dark-tube answer, a corrected respiration answer, the worked bright row and your plotted graph, the 8-mark exam-style answer with a revised region, and an unaided fresh check.',['Net from two rates.','Each region of the graph explained with both rates.','Evidence judged: colour as net CO₂ change, the control, claim strength and a number from a probe.']),
    'our-tubes':A([
      m('1 · CO₂ change','Bright (purple): CO₂ fell. Dark (yellow): CO₂ rose. No leaf (orange-red): about the same as air, so the colour changes can be linked to the leaves. Dim (orange-red in this illustrative set): about the same as air.'),
      m('The dim tube is conditional','A real dim tube could be orange, orange-red or red-purple, depending on the leaf and how much shade. Dim light does not guarantee that the rates balance.'),
      m('2 · Dark tube','The leaf’s cells respired and released CO₂. With no light there was no photosynthesis to use it, so CO₂ built up.'),
      m('If your answer was different','Keep it. The next screens test it, and you will correct it in a different pen.')
    ],[c('Success criteria',['Each colour read as a CO₂ change, the right way round.','The control used.','Dark-tube CO₂ from respiration, with no photosynthesis to use it.'])]),
    'how-sure':A([
      m('How sure?','Not very sure. The colour is judged by eye, and orange and orange-red are next to each other on the strip, so two observers can disagree. A small change in CO₂ over 1 hour may not be visible.'),
      m('A stronger measure','A colorimeter (absorbance), a pH probe or a CO₂ sensor gives a number. It does not depend on who is looking, so small differences can be compared and repeated.')
    ],[c('Success criteria',['The claim is limited: “cannot tell” or “supports”, not “proves”.','The reason is the observer’s judgement of colour.','A quantitative measure named, with why it is better.'])]),
    respiration:A([
      m('(a) False','Plant cells respire all the time, in light and in dark.'),
      m('Energy','Respiration releases energy stored in glucose. Energy is not made.'),
      m('(b) True','In bright light both processes happen in the same cell at the same time.'),
            m('Corrected dark-tube answer','The dark tube’s CO₂ came from respiration in the leaf’s cells. There was no light, so no photosynthesis used it.')
    ],[c('Success criteria',['Both true/false answers correct.','Respiration releases energy (it is not made), as in the equation.','The dark-tube answer names respiration and the missing photosynthesis, in a different pen.'])]),
    'worked-example':A([
      m('Dusk row','Net uptake = 3 − 4 = −1. Negative: respiration is faster than photosynthesis, so the leaf releases CO₂ overall, even in some light.'),
      m('Bright row','Net uptake = 10 − 4 = +6. Positive: photosynthesis is faster than respiration, so the leaf takes in CO₂ overall and the tube turns purple.'),
      m('Oxygen','O₂ is the reverse: in bright light, photosynthesis gives out O₂ faster than respiration uses it, so O₂ is given out overall.'),
      m('The common slip','Writing 4 − 0 = 4 for the dark row. Net uptake is always P − R, so it is 0 − 4 = −4: negative uptake means release.')
    ],[c('Success criteria',['Dusk −1 and bright +6, each sign explained.','Both rates compared; respiration still happening.','Dim and dusk are not “balanced”: the sign shows release.','Bright: purple, and O₂ given out overall.'])]),
    'plot-net':A([
      m('Reading the graph','Points (0, −4), (2, −2), (10, +6), (14, +6). Below zero: respiration faster than photosynthesis. Zero at light 4: the rates are equal; both processes continue. Rising: light limits photosynthesis from 0 up to the plateau. Plateau: another factor, such as CO₂ concentration, limits photosynthesis.'),
      m('Balance points differ','This leaf balances at light 4. Other plants, and other light conditions, give other crossing points, so a dim tube can be yellower, unchanged or more purple.'),
      m('Region sentence','A strong sentence names both processes, says which is faster and gives the net result. “Photosynthesis increases” alone earns nothing.')
    ],[c('Success criteria',['Zero read as rates equal; the plateau read as another limiting factor.','Rising read as light limiting photosynthesis from 0 up to the plateau.','The copied sentence pattern compares the two rates.'])]),
    'quick-check':A([
      m('Best answer: 3','Net uptake = P − R = 3 − 5 = −2. Negative uptake means the leaf gives out CO₂ overall: respiration is faster than photosynthesis.'),
      m('If you chose 1','You subtracted the wrong way round. Net uptake is always P − R (photosynthesis minus respiration). 3 − 5 = −2: a negative uptake is a release.'),
      m('If you chose 2','The rates are not equal (3 and 5), so they do not cancel. Even when they are equal, both processes still happen; only the net change is zero.'),
      m('If you chose 4','Photosynthesis has not stopped: P = 3. Both processes happen; respiration is just faster.'),
      m('Recheck','The recheck (P = 6, R = 10) is on the screen; its answer has its own reveal there.'),
      m('Evidence check','The rung that fits is “supports” or “cannot tell”, because a colour judged by eye cannot show a small change and two observers disagreed. “Proves” is too strong.')
    ],[c('Success criteria',['Option 3, with net = P − R and the sign explained as release.','Both processes named as happening.','The evidence line uses “supports” or “cannot tell”.'])]),
    'exam-ab':A([L.markAB.models[0]],[c('Do not credit',['−2 with no meaning, or “+2”.','“The leaf takes in CO₂”.'])],1),
    'exam-c':A([L.markAB.models[1],...L.markC.models,m('Do not credit',L.dontC.models.map(x=>x.text).join(' '))],[c('Marking',['(b) 1 mark: about 3.3 (accept 3.0 to 3.5).',...L.markC.criteria[0].items])],7),
    'self-check':A([
      m('A revised region','Before: “At 3.3 nothing happens.” After, in a different pen: “At about 3.3 the rate of photosynthesis equals the rate of respiration, so there is no net exchange of CO₂.”'),
      m('Another example','Before: “It levels off because the plant has enough light.” After: “Above about 10, light is no longer the limiting factor; CO₂ concentration limits the rate of photosynthesis, while respiration continues at 5.”'),
      m('Support rechecks','If you used a support card, mark your recheck against the projected answers in a different pen.')
    ],[c('Success criteria',['The revised line compares both rates, or names the limiting factor.','Any support recheck is marked against the projected answers.','It fixes the weakest region, not the easiest.','The first attempt is kept; the revision is in a different pen.'])]),
    'fresh-check':A([
      m('1(a) [1]','Net O₂ exchange = 3 − 4 = −1 as O₂ released, <strong>and</strong> the direction: the plant takes in O₂ overall (both needed). Accept a correct magnitude with a correct direction stated, whatever sign convention is used, for example “1 a.u. per hour of O₂ taken in”.'),
      m('1(b) [2]','Between 10 and 30 (1). The rate of photosynthesis equals the rate of respiration (1). Do not credit “no gas exchange” or “the processes stop”.'),
      m('1(c) [2]','Light is no longer the limiting factor (1). Another named factor, such as CO₂ concentration, limits photosynthesis while respiration is unchanged (1). Do not credit “enzymes denature”: the temperature is constant.')
    ],[c('Marking',['Out of 5 on this screen; the fresh check is out of 8 in all.','Both parts are needed where it says “both needed”.','Your teacher marks this and returns it next lesson.'])],5),
    'fresh-check-2':A([
      m('2 [2]','Claim: the leaf probably took in CO₂ overall (photosynthesis faster than respiration), because its tube changed further than the control (1). The claim is weak: the control also changed, so something other than the leaf changed the CO₂ (for example, heat from the lamp driving CO₂ out of solution, a contaminated indicator, or indicator not equilibrated with air at the start); the leaf’s share cannot be judged by eye, so repeat with a control that stays orange-red or measure with a colorimeter (1).'),
      m('3 [1]','Respiration continues in the dark and uses O₂; with no light there is no photosynthesis to produce O₂, so there is net uptake (both needed).')
    ],[c('Marking',['Out of 3 on this screen; the fresh check is out of 8 in all.','Q2 second mark needs the control’s change used to limit the claim.','Q3 needs both respiration using O₂ and no photosynthesis.'])],3)
  };
  return {main};
})();
