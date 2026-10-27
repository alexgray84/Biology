/* Task-specific reviews remain separate from pupil-facing support. */
window.LessonWidgetAnswers=(()=>{
 const pick=r=>Array.isArray(r)?r[2]:r?.answer;
 function get(widget,p,l,tab,page){
  const s=p.support||{};
  if(widget==='adaptation'){const keys=['language','route','explanation'].filter(k=>s[k]?.length);return pick((s[keys[tab]]||[])[page])||null;}
  if(widget==='hot')return pick((s.hot||[])[page])||null;
  if(widget==='uae')return pick((l.uae?.pages||[])[page])||null;
  return null;
 }
 return {get};
})();
