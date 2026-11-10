/* The six Arcadia widgets. Content is authored per screen in lesson-data.js (support, aiTopic) and per lesson (resources, vocabulary, ai, uae). */
window.LessonWidgets=(()=>{
  const pages=rows=>(rows||[]).map(r=>Array.isArray(r)?{heading:r[0],text:r[1]}:{heading:r.heading,text:r.text,items:r.items});
  function ai(current,lesson){
    const available=['l10-feedback','l10-revise'].includes(current.id)?lesson.aiPages:[lesson.aiHeldPage];
    return [{id:'prompt',label:'Write and check',pages:available.map(({answer,...p})=>p)}];
  }
  function uae(current,lesson){
    const u=lesson.uae||{label:'Local context',pages:[]};
    return [{id:'connect',label:u.label,pages:u.pages.map(pg=>{const {answer,...rest}=pg;return rest;})}];
  }
  function panel(id,current,lesson){
    const s=current.support||{start:[],understand:[],hot:[]};
    const definitions={
      resources:{title:'Resources',subtitle:'Find what you need. Then return to the question.',tabs:[{id:'kit',label:'Resources',pages:lesson.resourcePages.filter(p=>!p.afterAttempt||['l10-feedback','l10-revise'].includes(current.id))},{id:'words',label:'Key words',pages:pages(lesson.vocabulary)},{id:'models',label:'Models',pages:lesson.modelPages}]},
      assessments:{title:'Check your learning',subtitle:'Choose a question. Explain your answer.',tabs:[{id:'checks',label:'Checks',pages:lesson.checkPages}]},
      adaptation:{title:'Help',subtitle:'Choose the part you need help with. Keep the tools you normally use.',tabs:[{id:'start',label:'Start here',pages:pages(s.start)},{id:'understand',label:'Build an explanation',pages:pages(s.understand)}]},
      hot:{title:'Think further',subtitle:'What could change? Would it always work?',tabs:[{id:'reason',label:'Test your idea',pages:pages(s.hot)}]},
      ai:{title:'AI thinking',subtitle:'Think first. Check a prepared AI answer.',tabs:ai(current,lesson)},
      uae:{title:'Science in the UAE',subtitle:'Use your science in a place you know.',tabs:uae(current,lesson)}
    };
    return definitions[id];
  }
  return {panel};
})();
