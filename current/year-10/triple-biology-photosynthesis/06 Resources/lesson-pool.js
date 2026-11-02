/* Pooled class table for the pondweed counts. Stations read out their counts; pupils work out the means and the
   teacher types only the three class means on the projected table, which the Interpret screen then shows. Values are kept in memory for this page only: nothing is saved,
   stored or sent. Counts are class data, not pupil responses. */
(()=>{
  const V={};
  const num=x=>{const n=parseFloat(String(x).replace(',','.'));return Number.isFinite(n)?n:null;};
  // Round 3: stations read out their counts; the teacher types only the class mean for each distance.
  const mean=d=>num(V['mean-'+d]);
  const show=x=>x===null?'–':(Math.round(x*10)/10).toFixed(1);
  function paint(root=document){
    for(const el of root.querySelectorAll('input.pool-input')){const k=el.dataset.pool;if(document.activeElement!==el&&(V[k]??'')!==el.value)el.value=V[k]??'';}
    for(const el of root.querySelectorAll('[data-pool-mean]')){const t=show(mean(el.dataset.poolMean));if(el.textContent!==t)el.textContent=t;}
    for(const el of root.querySelectorAll('[data-pool-show]')){const d=el.dataset.poolShow.split('-')[1];const t=mean(d)===null?'…':show(mean(d));if(el.textContent!==t)el.textContent=t;}
  }
  document.addEventListener('input',e=>{const el=e.target.closest&&e.target.closest('input.pool-input');if(!el)return;V[el.dataset.pool]=el.value.trim();paint();});
  // Keys typed into the table must not move the lesson on.
  document.addEventListener('keydown',e=>{if(e.target.closest&&e.target.closest('input.pool-input'))e.stopPropagation();},true);
  const start=()=>{paint();new MutationObserver(()=>paint()).observe(document.body,{childList:true,subtree:true});};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
  window.LessonPool={values:()=>({...V}),mean,set:(k,v)=>{V[k]=String(v);paint();}};
})();
