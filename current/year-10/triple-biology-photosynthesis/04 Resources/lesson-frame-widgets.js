/* Pupil-safe contextual support for L4. One shared task, three dials:
   support cards chosen from the barrier seen in the work (B I K H Q; L3 return O Y J),
   access arrangements kept separately, and depth cards open to anyone whose core is secure. */
window.LessonWidgets=(()=>{
  const ORDER=['key','O','Y','J','B','I','K','H','Q'];
  const LABEL={key:'Which card?',O:'Card O',Y:'Card Y',J:'Card J',B:'Card B',I:'Card I',K:'Card K',H:'Card H',Q:'Card Q'};
  const pages=rows=>(rows||[]).map(r=>{const {answer,...page}=r;return page;});
  const supportKeys=s=>ORDER.filter(k=>s[k]?.length);
  const supportTabs=s=>supportKeys(s).map(k=>({id:k,label:LABEL[k],pages:pages(s[k])}));
  const panel=(id,p,l)=>{
    const s=p.support||{};
    const definitions={
      resources:{title:'Resources',subtitle:'Open a reference or task. Return to this screen afterwards.',tabs:[{id:'kit',label:'Resources',pages:l.resourcePages},{id:'words',label:'Key words',pages:pages(l.vocabulary)},{id:'models',label:'Models',pages:l.modelPages}]},
      assessments:{title:'Assessments',subtitle:'Use the check your teacher has selected.',tabs:[{id:'checks',label:'Checks',pages:l.checkPages}]},
      adaptation:{title:'Adaptation',subtitle:'Pick the card that matches what you see in your work. Keep any access tools you use.',tabs:supportTabs(s)},
      hot:{title:'Higher-order thinking',subtitle:'Depth cards: open to anyone whose core work is secure.',tabs:[{id:'depth',label:'Depth cards',pages:pages(s.hot)}]},
      ai:{title:'AI literacy',subtitle:'You decide what is supported by the evidence.',tabs:[{id:'decision',label:'Prepared AI conclusion',pages:pages(l.ai?.pages||[])}]},
      uae:{title:'UAE National Agenda',subtitle:'Apply net gas exchange to a hypothetical UAE greenhouse decision.',tabs:[{id:'connect',label:l.uae?.label||'Hot greenhouse decision',pages:pages(l.uae?.pages||[])}]}
    };
    const result=definitions[id];
    if(result)result.tabs=result.tabs.filter(t=>t.pages?.length);
    return result;
  };
  return {panel,supportTabs,supportKeys};
})();
