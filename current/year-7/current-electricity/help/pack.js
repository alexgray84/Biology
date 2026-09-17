'use strict';
const $=id=>document.getElementById(id);
$('size').addEventListener('change',event=>document.documentElement.style.setProperty('--size',event.target.value+'px'));
$('colour').addEventListener('change',event=>document.body.dataset.colour=event.target.value);
$('print').addEventListener('click',()=>window.print());
const speechAvailable='speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
let activeButton=null;
function stopReading(){if(speechAvailable)window.speechSynthesis.cancel();if(activeButton){activeButton.textContent='Listen to this section';activeButton=null;} $('speech-status').textContent='';}
$('stop').addEventListener('click',stopReading);
function readableText(section){const copy=section.cloneNode(true);copy.querySelectorAll('button, details:not([open]), [hidden], .card-top, svg, .draw-box').forEach(el=>el.remove());return copy.textContent.replace(/\s+/g,' ').trim();}
document.querySelectorAll('.listen').forEach(button=>{
 if(!speechAvailable){button.disabled=true;button.textContent='Read-aloud unavailable';return;}
 button.addEventListener('click',()=>{stopReading();const utterance=new SpeechSynthesisUtterance(readableText(button.closest('.card')));utterance.lang='en-GB';utterance.rate=Number($('rate').value);activeButton=button;button.textContent='Reading…';$('speech-status').textContent='Reading this section. Use Stop reading to stop.';utterance.onend=()=>{if(activeButton===button){button.textContent='Listen to this section';activeButton=null;$('speech-status').textContent='Finished reading.';}};utterance.onerror=()=>{if(activeButton===button){button.textContent='Listen to this section';activeButton=null;$('speech-status').textContent='Reading could not start. You can use your device’s text reader or ask someone to read with you.';}};window.speechSynthesis.speak(utterance);});
});
if(!speechAvailable){$('stop').disabled=true;$('speech-status').textContent='Built-in read-aloud is unavailable in this browser. Text remains selectable for your device’s reader.';}
document.querySelectorAll('[data-group]').forEach(button=>button.addEventListener('click',()=>{stopReading();const group=button.dataset.group;document.querySelectorAll('[data-group]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));let count=0;document.querySelectorAll('[data-word-group]').forEach(card=>{card.hidden=group!=='all'&&card.dataset.wordGroup!==group;if(!card.hidden)count++;});$('word-count').textContent=count+' words shown. Print includes only the selected words.';}));
window.addEventListener('pagehide',stopReading);
