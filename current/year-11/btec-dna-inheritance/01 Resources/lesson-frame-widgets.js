/* The six Arcadia widgets. Content is authored per screen in lesson-data.js (support, aiTopic) and per lesson (resources, vocabulary, ai, uae). */
window.LessonWidgets=(()=>{
  const pages=rows=>(rows||[]).map(r=>Array.isArray(r)?{heading:r[0],text:r[1]}:{heading:r.heading,text:r.text,items:r.items});
  function ai(current,lesson){
    const set=(lesson.ai||{})[current.aiTopic||current.topic];
    if(!set)return [{id:'verify',label:'Check a claim',pages:[{heading:'Think first',text:'Explain the idea on this screen in your own words before you check any claim.'}]}];
    return [{id:'verify',label:'Check a claim',pages:[
      {heading:'Think first',text:set.prompt,note:'Write your own explanation first'},
      {heading:'Inspect the claim',quote:'“'+set.claim+'”',note:'Prepared AI-style claim',text:'This statement was written for this checking task. Confident wording is not evidence.'},
      {heading:'Check against the science',items:set.checks||['Identify a specific error or missing condition.','Use the lesson’s model, table or graph as evidence.','Rewrite the explanation in your own words.']},
      {heading:'Explain your check',text:'What did you verify before accepting or rejecting the claim? Name the evidence you used.',note:'No live AI tool or personal information is needed'}
    ]}];
  }
  function uae(current,lesson){
    const u=lesson.uae||{label:'Local context',pages:[]};
    return [{id:'connect',label:u.label,pages:u.pages.map(pg=>{const {answer,...rest}=pg;return rest;})}];
  }
  function panel(id,current,lesson){
    const s=current.support||{start:[],understand:[],hot:[]};
    const definitions={
      resources:{title:'Resources',subtitle:'Use a reference, then return to the task.',tabs:[{id:'kit',label:'Resources',pages:lesson.resourcePages},{id:'words',label:'Key words',pages:pages(lesson.vocabulary)},{id:'models',label:'Models',pages:lesson.modelPages}]},
      assessments:{title:'Assessments',subtitle:'Choose a check and show your reasoning.',tabs:[{id:'checks',label:'Checks',pages:lesson.checkPages}]},
      adaptation:{title:'Adaptation',subtitle:'Support for Students of Determination — a foothold first, then work on your own.',tabs:[{id:'start',label:'Get started',pages:pages(s.start)},{id:'understand',label:'Build understanding',pages:pages(s.understand)}]},
      hot:{title:'Higher-order thinking',subtitle:'Explain a limit, test a claim or transfer an idea.',tabs:[{id:'reason',label:'Go further',pages:pages(s.hot)}]},
      ai:{title:'AI literacy',subtitle:'Think first. Check the claim against evidence.',tabs:ai(current,lesson)},
      uae:{title:'UAE National Agenda',subtitle:'Use the science in a local context.',tabs:uae(current,lesson)}
    };
    return definitions[id];
  }
  return {panel};
})();
