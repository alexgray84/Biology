/* Pupil-safe contextual support for L4 "Two rates, one net".
   No feedback codes and no letters. Pupils pick a card from a plain-words key (approved by the teacher,
   28 Oct), or the teacher points them to one; the teacher confirms and rechecks. Access tools stay available throughout. Depth cards appear only
   on the screens where the design opens them (exam-style (c) and the self-check). */
window.LessonWidgets=(()=>{
  const ORDER=['budget','regions','frame','ladder','access'];
  const LABEL={budget:'Budget card',regions:'Graph-region strip',frame:'Explanation frame',ladder:'Claim ladder',access:'Access and words'};
  const pages=rows=>(rows||[]).map(r=>{const {answer,...page}=r;return page;});
  const supportKeys=s=>ORDER.filter(k=>s[k]?.length);
  const supportTabs=s=>supportKeys(s).map(k=>({id:k,label:LABEL[k],pages:pages(s[k])}));
  const panel=(id,p,l)=>{
    const s=p.support||{};
    const definitions={
      resources:{title:'Resources',subtitle:'Open a reference or task. Return to this screen afterwards.',tabs:[{id:'kit',label:'Resources',pages:l.resourcePages},{id:'words',label:'Key words',pages:pages(l.vocabulary)},{id:'models',label:'Models',pages:l.modelPages}]},
      assessments:{title:'Assessments',subtitle:'Use the check your teacher has selected.',tabs:[{id:'checks',label:'Checks',pages:l.checkPages}]},
      adaptation:{title:'Adaptation',subtitle:'Pick the card that matches where you’re stuck, or your teacher will point you to one. Keep any access tools you use.',tabs:supportTabs(s)},
      hot:{title:'Higher-order thinking',subtitle:'Depth cards: open once mark points 3 to 6 are secure in your answer.',tabs:[{id:'depth',label:'Depth cards',pages:pages(s.hot)}]},
      ai:{title:'AI literacy',subtitle:'You decide what is supported by the evidence.',tabs:[{id:'decision',label:'AI literacy',pages:pages(l.ai?.pages||[])}]},
      uae:{title:'UAE National Agenda',subtitle:'Apply net gas exchange to a UAE crop over a whole day.',tabs:[{id:'connect',label:l.uae?.label||'UAE context',pages:s.hot?.length?pages(l.uae?.pages||[]):[]}]}
    };
    const result=definitions[id];
    if(result)result.tabs=result.tabs.filter(t=>t.pages?.length);
    return result;
  };
  // A drawer button is shown only when its drawer has at least one page on this screen.
  const available=(id,p,l)=>Boolean(panel(id,p,l)?.tabs?.length);
  return {panel,supportTabs,supportKeys,available};
})();
