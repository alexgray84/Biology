/* Pupil-safe contextual support for "What does a plant need, and how do we know?".
   No feedback codes in this lesson. The teacher chooses help from what is seen on whiteboards and the handout;
   pupils are never asked to name their own barrier. Support cards match the handout scaffolds, each with a recheck.
   Access tools stay available throughout. Depth boxes (A5, B5) appear only where the design opens them. */
window.LessonWidgets=(()=>{
  const ORDER=['chain','shield','steps','grid','ions','command','access'];
  const LABEL={chain:'Chain frame',shield:'What else changed?',steps:'Step strip',grid:'Comparison grid',ions:'Ion chain',command:'Command words',access:'Access and words'};
  const pages=rows=>(rows||[]).map(r=>{const {answer,...page}=r;return page;});
  const supportKeys=s=>ORDER.filter(k=>s[k]?.length);
  const supportTabs=s=>supportKeys(s).map(k=>({id:k,label:LABEL[k],pages:pages(s[k])}));
  const panel=(id,p,l)=>{
    const s=p.support||{};
    const definitions={
      resources:{title:'Resources',subtitle:'The handout, the slip and the device pages. Return to this screen afterwards.',tabs:[{id:'kit',label:'Resources',pages:l.resourcePages},{id:'words',label:'Plain words',pages:pages(l.vocabulary)},{id:'models',label:'Diagrams',pages:l.modelPages}]},
      assessments:{title:'Assessments',subtitle:'Use the check your teacher has selected.',tabs:[{id:'checks',label:'Checks',pages:l.checkPages}]},
      adaptation:{title:'Adaptation',subtitle:p.supportNote||'Your teacher may point you to a card. Each one matches a box on your handout. Keep any access tools you use.',tabs:supportTabs(s)},
      hot:{title:'Higher-order thinking',subtitle:p.hotNote||'Depth boxes: a counterexample.',tabs:[{id:'depth',label:'Depth boxes',pages:pages(s.hot)}]},
      ai:{title:'AI literacy',subtitle:'',tabs:[{id:'decision',label:'AI literacy',pages:pages(l.ai?.pages||[])}]},
      uae:{title:'UAE National Agenda',subtitle:'',tabs:[{id:'connect',label:l.uae?.label||'UAE context',pages:pages(l.uae?.pages||[])}]}
    };
    const result=definitions[id];
    if(result)result.tabs=result.tabs.filter(t=>t.pages?.length);
    return result;
  };
  const available=(id,p,l)=>Boolean(panel(id,p,l)?.tabs?.length);
  return {panel,supportTabs,supportKeys,available,LABEL};
})();
