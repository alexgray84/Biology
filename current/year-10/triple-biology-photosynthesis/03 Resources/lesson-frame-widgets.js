/* Pupil-safe contextual support. Access preferences are independent of these content pathways. */
window.LessonWidgets=(()=>{
  const pages=rows=>(rows||[]).map(r=>Array.isArray(r)?{heading:r[0],text:r[1]}:(()=>{const {answer,...page}=r;return page;})());
  const supportTabs=s=>['language','route','explanation'].filter(k=>s[k]?.length).map(k=>({id:k,label:{language:'Understand the question',route:'Trace the route',explanation:'Build the explanation'}[k],pages:pages(s[k])}));
  const panel=(id,p,l)=>{
    const s=p.support||{};
    const definitions={
      resources:{title:'Resources',subtitle:'Open a reference or task. Return to this screen afterwards.',tabs:[{id:'kit',label:'Resources',pages:l.resourcePages},{id:'words',label:'Key words',pages:pages(l.vocabulary)},{id:'models',label:'Models',pages:l.modelPages}]},
      assessments:{title:'Assessments',subtitle:'Use the check your teacher has selected.',tabs:[{id:'checks',label:'Checks',pages:l.checkPages}]},
      adaptation:{title:'Adaptation',subtitle:'Choose help for this task, or use the support your teacher recommends.',tabs:supportTabs(s)},
      hot:{title:'Higher-order thinking',subtitle:'Use a changed condition in your explanation. Keep any access support you need.',tabs:[{id:'reason',label:'Go further',pages:pages(s.hot)}]},
      ai:{title:'AI literacy',subtitle:'Keep the scientific reasoning your own.',tabs:[{id:'decision',label:'Today’s decision',pages:[{heading:'Explain it yourself',text:'Use the leaf model and scientific evidence to build and check your own explanation. There is no live AI task in this lesson. Return to your current task.'}]}]},
      uae:{title:'UAE National Agenda',subtitle:'Apply the science to a hypothetical shade-house decision.',tabs:[{id:'connect',label:l.uae?.label||'Shade-house decision',pages:pages(l.uae?.pages||[])}]}
    };
    const result=definitions[id];
    if(result)result.tabs=result.tabs.filter(t=>t.pages?.length);
    return result;
  };
  return {panel,supportTabs};
})();
