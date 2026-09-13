/* Adapts authored review content to the existing split-pane renderer. */
window.LessonAnswers=(()=>{
  const D=LessonAnswerData;
  D.l1.outcomes=D.answer([
    D.m('Differentiation','Specialised cells develop different structures/functions and work together in tissues and organs.'),
    D.m('Medical comparison','Stem-cell sources differ in the cell types they can produce. Suitability, rejection, growth control and embryo ethics affect a medical evaluation.'),
    D.m('Cell evidence','A combination of nuclear organisation, wall material and whole-organism features supports classification.')
  ],[D.c('Three outcomes',['Explain why differentiation matters, not just its meaning.','Compare advantages and disadvantages in the medical context.','Use decisive cell evidence.'])]);
  D.l2.outcomes=D.answer([D.m('Osmosis','Net water moves from more dilute to more concentrated solution across a partially permeable membrane.'),D.m('Tissue and measurement','Use water direction to explain mass/turgor changes. Percentage mass change is (final − initial) ÷ initial × 100; control conditions to compare concentrations.')],[D.c('Three outcomes',['Give a correct membrane-and-water explanation.','Link the mechanism to tissue changes.','Use the formula and explain valid controls.'])]);
  const main=(p,l)=>(l.number===1?D.l1:D.l2)[p.id];
  const has=(p,l)=>Boolean(main(p,l));
  const widget=(id,p,l,tab,page)=>LessonWidgetAnswers.get(id,p,l,tab,page);
  function panel(p,l,s,context){
    let entry=context?widget(context.widget,p,l,context.tab,context.page):main(p,l);
    if(!context&&p.id==='osmosis-model'){
      const i={0:0,15:1,5:2}[s.scenario];
      entry={...entry,models:[entry.models[i]],criteria:[D.c('Current model prediction',['Use the displayed outside concentration and 5% inside.','Give net water direction and the partially permeable membrane.','At equal concentration explain balanced, continuing molecular movement.'])]};
    }
    const note=entry.marks===null?'Unmarked task · success criteria':`${entry.marks} marks · original classroom mark scheme`;
    return {title:'Model answer & mark scheme',subtitle:context?'Review this widget task.':(p.nav||p.title),tabs:[
      {id:'model',label:'Model answer',pages:entry.models.map(page=>({...page,note:'One model response · equivalent wording is valid'}))},
      {id:'marking',label:'Mark scheme',pages:entry.criteria.map(page=>({...page,note}))}
    ]};
  }
  return {has,panel,widget};
})();
