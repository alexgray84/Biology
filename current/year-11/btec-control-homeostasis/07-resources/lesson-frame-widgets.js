/* The six Arcadia widgets. Content is authored per screen in lesson-data.js (support, aiTopic) and per lesson (resources, vocabulary, ai, uae). */
window.LessonWidgets=(()=>{
  const pages=rows=>(rows||[]).map(r=>Array.isArray(r)?{heading:r[0],text:r[1]}:{heading:r.heading,text:r.text,items:r.items});
  function ai(){return [{id:'authorship',label:'Your own work',pages:[{heading:'Independent authorship',text:'There is no AI activity in this lesson. During PSA work, no AI may be used. Use approved sources and write your own response; acknowledge the sources with Harvard citations.'}]}];}
  function uae(current,lesson){
    const u=lesson.uae||{label:'Local context',pages:[]};
    return [{id:'connect',label:u.label,pages:u.pages.map(pg=>{const {answer,...rest}=pg;return rest;})}];
  }
  function panel(id,current,lesson){
    const s=current.support||{start:[],understand:[],hot:[]};
    const definitions={
      resources:{title:'Resources',subtitle:'Use a reference, then return to the task.',tabs:[{id:'kit',label:'Resources',pages:lesson.resourcePages},{id:'words',label:'Key words',pages:pages(lesson.vocabulary)},{id:'models',label:'Models',pages:lesson.modelPages}]},
      assessments:{title:'Assessments',subtitle:'Choose a check and show your reasoning.',tabs:[{id:'checks',label:'Checks',pages:lesson.checkPages}]},
      adaptation:{title:'Adaptation',subtitle:'Use a foothold after your first attempt; then work without content prompts.',tabs:[{id:'start',label:'Get started',pages:pages(s.start)},{id:'understand',label:'Build understanding',pages:pages(s.understand)}]},
      hot:{title:'Higher-order thinking',subtitle:'Explain a limit, test a claim or transfer an idea.',tabs:[{id:'reason',label:'Go further',pages:pages(s.hot)}]},
      ai:{title:'AI literacy',subtitle:'Keep assessed work your own.',tabs:ai(current,lesson)},
      uae:{title:'UAE National Agenda',subtitle:'Use the science in a local context.',tabs:uae(current,lesson)}
    };
    return definitions[id];
  }
  return {panel};
})();
