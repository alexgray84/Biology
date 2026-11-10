(() => {
 const picks = new Map(); let minutes=50;
 function apply(){
  for(const p of LESSON.phases){p.mins=p['mins'+minutes]??p.mins;if(p.timer)p.timer=p['timer'+minutes]??p.timer;}
  const label=document.querySelector('#seed-length');if(label)label.value=String(minutes);
 }
 function install(){
  if(!document.querySelector('.seed-duration')){
   const host=document.querySelector('.lesson-nav');
   if(host){const box=document.createElement('div');box.className='seed-duration';box.innerHTML='<label for="seed-length">Period</label><select id="seed-length" aria-label="Lesson period length"><option value="50">50 minutes</option><option value="40">40 minutes</option></select>';host.insertBefore(box,document.querySelector('#next-screen'));box.querySelector('select').onchange=e=>{minutes=+e.target.value;apply();if(window.LessonDebug)LessonDebug.go(LessonDebug.index());};}
  }
  document.querySelectorAll('[data-seed-match]').forEach(s=>{if(picks.has(s.dataset.seedMatch))s.value=picks.get(s.dataset.seedMatch);s.onchange=()=>picks.set(s.dataset.seedMatch,s.value);});
  const workspace=document.querySelector('.workspace');if(workspace)workspace.dataset.seedMainReview=String(!!document.querySelector('[data-action="answers"][aria-expanded="true"]'));
  if(window.LessonDebug){
   const s=LessonDebug.state(),wind=document.getElementById('seed-wind'),fresh=document.getElementById('seed-fresh');
   if(wind&&wind.dataset.rendered!==String(s.windStep??0)){
    const i=s.windStep??0,step=LESSON.windSteps[i];wind.dataset.rendered=String(i);
    wind.innerHTML='<h3>'+step.heading+'</h3>'+step.html+'<div class="seed-step-controls"><button class="seed-step-button" type="button" data-wind-step="-1" '+(i===0?'disabled':'')+'>← Back</button><span>Step '+(i+1)+' / '+LESSON.windSteps.length+'</span><button class="seed-step-button" type="button" data-wind-step="1" '+(i===LESSON.windSteps.length-1?'disabled':'')+'>Next step →</button></div>';
   }
   if(fresh&&fresh.dataset.rendered!==String(s.freshPart??0)){fresh.dataset.rendered=String(s.freshPart??0);fresh.innerHTML=LESSON.freshParts[s.freshPart??0];}
  }
 }
 apply();document.addEventListener('DOMContentLoaded',install);new MutationObserver(install).observe(document.documentElement,{childList:true,subtree:true});
 document.addEventListener('click',e=>{const b=e.target.closest('[data-seed-specimen]');if(!b)return;const frame=document.getElementById('animal-model');if(frame){frame.src='10 Resources/model.html?specimen='+b.dataset.seedSpecimen+'&view=observe';document.querySelectorAll('[data-seed-specimen]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));}});
 document.addEventListener('click',e=>{const w=e.target.closest('[data-wind-step]'),f=e.target.closest('[data-fresh-part]');if(!window.LessonDebug)return;const s=LessonDebug.state();if(w){s.windStep=Math.max(0,Math.min(LESSON.windSteps.length-1,(s.windStep??0)+Number(w.dataset.windStep)));install();}if(f){s.freshPart=Number(f.dataset.freshPart);install();}});
 window.SeedLesson={getDuration:()=>minutes,selectDuration:n=>{minutes=n===40?40:50;apply();if(window.LessonDebug)LessonDebug.go(LessonDebug.index());}};
})();