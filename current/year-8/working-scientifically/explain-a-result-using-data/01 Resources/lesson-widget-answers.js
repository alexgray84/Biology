/* Reviews for the actual adaptation, HOT, AI and UAE prompts. Each prompt carries its own answer in lesson-data.js. */
window.LessonWidgetAnswers=(()=>{
  const pick=row=>Array.isArray(row)?row[2]:row&&row.answer;
  function get(widget,p,l,tab,page){
    const s=p.support||{};
    if(widget==='adaptation')return pick(((tab===0?s.start:s.understand)||[])[page])||null;
    if(widget==='hot')return pick((s.hot||[])[page])||null;
    if(widget==='ai'){const set=(l.ai||{})[p.aiTopic||p.topic];return set?set.answer:null;}
    if(widget==='uae'){const pg=((l.uae||{}).pages||[])[page];return pg&&pg.answer||null;}
    return null;
  }
  return {get};
})();
