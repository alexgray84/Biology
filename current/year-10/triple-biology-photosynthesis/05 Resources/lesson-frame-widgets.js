/* Pupil-safe contextual support for L5 "A plan that convinces a sceptic".
   Feedback codes: the teacher codes the work and circles one code; pupils never self-code. On the response
   screens the Adaptation tabs are the codes, each named with its letter AND its words.
   Plan support is named in words from a plain-words key (as in L4); the teacher confirms and rechecks.
   Access tools stay available throughout. Depth cards appear only where the design opens them. */
window.LessonWidgets=(()=>{
  const ORDER=['codeR','codeS','codeL','codeJ','codeH','fairTest','skeleton','unpacker','access'];
  const C=(window.L5Cards||{}).CODES||{};
  const LABEL={fairTest:'Fair-test table',skeleton:'Plan skeleton',unpacker:'Question unpacker',access:'Access and words'};
  for(const k of ['R','S','L','J','H'])LABEL['code'+k]=k+' · '+(C[k]?.words||'');
  const pages=rows=>(rows||[]).map(r=>{const {answer,...page}=r;return page;});
  const supportKeys=s=>ORDER.filter(k=>s[k]?.length);
  const supportTabs=s=>supportKeys(s).map(k=>({id:k,label:LABEL[k],pages:pages(s[k])}));
  const panel=(id,p,l)=>{
    const s=p.support||{};
    const definitions={
      resources:{title:'Resources',subtitle:'Open a reference or task. Return to this screen afterwards.',tabs:[{id:'kit',label:'Resources',pages:l.resourcePages},{id:'words',label:'Key words',pages:pages(l.vocabulary)},{id:'models',label:'Models',pages:l.modelPages}]},
      assessments:{title:'Assessments',subtitle:'Use the check your teacher has selected.',tabs:[{id:'checks',label:'Checks',pages:l.checkPages}]},
      adaptation:{title:'Adaptation',subtitle:p.supportNote||'Pick the card that matches where you’re stuck, or your teacher will point you to one. Keep any access tools you use.',tabs:supportTabs(s)},
      hot:{title:'Higher-order thinking',subtitle:p.hotNote||'Depth cards: a changed condition or a counterexample.',tabs:[{id:'depth',label:'Depth cards',pages:pages(s.hot)}]},
      ai:{title:'AI literacy',subtitle:'You decide what is supported by the evidence.',tabs:[{id:'decision',label:'AI literacy',pages:pages(l.ai?.pages||[])}]},
      uae:{title:'UAE National Agenda',subtitle:'Apply the timing problem to a UAE vertical farm.',tabs:[{id:'connect',label:l.uae?.label||'UAE context',pages:s.hot?.some(d=>d.uae)?pages(l.uae?.pages||[]):[]}]}
    };
    const result=definitions[id];
    if(result)result.tabs=result.tabs.filter(t=>t.pages?.length);
    return result;
  };
  // A drawer button is shown only when its drawer has at least one page on this screen.
  const available=(id,p,l)=>Boolean(panel(id,p,l)?.tabs?.length);
  return {panel,supportTabs,supportKeys,available};
})();
