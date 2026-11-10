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
    const note=entry.marks===null||entry.marks===undefined?'Practice task · use these checks':`${entry.marks} mark${entry.marks===1?'':'s'} · question written for our lesson`;
    return {title:'Answers and checks',subtitle:context?'Check this question.':(p.nav||p.title),tabs:[
      {id:'model',label:'Example answer',pages:entry.models.map(page=>({...page,note:page.note||'One example · your correct words may be different'}))},
      {id:'marking',label:entry.marks===null||entry.marks===undefined?'Success criteria':'Marking guide',pages:entry.criteria.map(page=>({...page,note:page.note||note}))}
    ]};
  }
  return {has,panel,widget};
})();
