/* Adapts authored review content to the split-pane renderer. Answers stay hidden until the pupil opens the review. */
window.LessonAnswers=(()=>{
  const D=window.LessonAnswerData;
  const main=p=>D.main[p.id];
  const has=p=>Boolean(main(p));
  const widget=(id,p,l,tab,page)=>LessonWidgetAnswers.get(id,p,l,tab,page);
  function resolve(entry,s){
    if(entry&&entry.stateKey&&entry.variants){const v=entry.variants[String(s[entry.stateKey])];if(v)return v;}
    return entry;
  }
  function panel(p,l,s,context){
    const entry=resolve(context?widget(context.widget,p,l,context.tab,context.page):main(p),s);
    const note=entry.marks===null||entry.marks===undefined?'Unmarked task · success criteria':`${entry.marks} mark${entry.marks===1?'':'s'} · original classroom mark scheme`;
    return {title:'Model answer & mark scheme',subtitle:context?'Review this widget task.':(p.nav||p.title),tabs:[
      {id:'model',label:'Model answer',pages:entry.models.map(page=>({...page,note:page.note||'One model response · equivalent wording is valid'}))},
      {id:'marking',label:entry.marks===null||entry.marks===undefined?'Success criteria':'Mark scheme',pages:entry.criteria.map(page=>({...page,note}))}
    ]};
  }
  return {has,panel,widget};
})();
