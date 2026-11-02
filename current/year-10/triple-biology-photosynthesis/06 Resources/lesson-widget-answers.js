/* Task-specific reviews remain separate from pupil-facing support. */
window.LessonWidgetAnswers=(()=>{
 const pick=r=>r?.answer;
 function get(widget,p,l,tab,page){
  const s=p.support||{};
  if(widget==='adaptation'){const keys=LessonWidgets.supportKeys(s);return pick((s[keys[tab]]||[])[page])||null;}
  if(widget==='hot')return pick((s.hot||[])[page])||null;
  if(widget==='uae')return pick((l.uae?.pages||[])[page])||null;
  if(widget==='ai')return pick((l.ai?.pages||[])[page])||null;
  return null;
 }
 return {get};
})();
