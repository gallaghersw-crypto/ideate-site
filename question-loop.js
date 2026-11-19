(() => {
const questions=[{"question": "We've changed the strategy three times. Why is nothing actually changing?", "href": "question-uncertainty.html"}, {"question": "Do I have the right leadership team for where we're trying to go?", "href": "question-people.html"}, {"question": "How much longer can we ask our people to do more with less?", "href": "question-capacity.html"}, {"question": "Everyone agrees in the meeting. Why does everything unravel afterward?", "href": "question-culture.html"}, {"question": "Are we investing in AI because it makes sense, or because we're afraid of falling behind?", "href": "question-ai.html"}, {"question": "What if the person holding us back is me?", "href": "question-honesty.html"}, {"question": "I know something needs to change. I'm not sure what we're willing to lose.", "href": "question-values.html"}];
const link=document.getElementById('question-link');if(!link)return;
const number=document.getElementById('question-number'), pause=document.getElementById('pause-questions');
const area=document.querySelector('.question-loop');
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
let index=0,paused=reduced.matches,timer=null,hover=false,focused=false;
function schedule(){clearTimeout(timer);if(!paused&&!hover&&!focused&&!document.hidden)timer=setTimeout(()=>show(index+1),7000);}
function show(next){index=(next+questions.length)%questions.length;link.textContent=questions[index].question;link.href=questions[index].href;number.textContent=String(index+1).padStart(2,'0')+' / '+String(questions.length).padStart(2,'0');link.classList.remove('question-arrives');void link.offsetWidth;link.classList.add('question-arrives');schedule();}
function updatePause(){pause.textContent=paused?'Play':'Pause';pause.setAttribute('aria-label',paused?'Play question loop':'Pause question loop');}
pause.addEventListener('click',()=>{paused=!paused;updatePause();schedule();});
document.getElementById('previous-question').addEventListener('click',()=>show(index-1));
document.getElementById('next-question').addEventListener('click',()=>show(index+1));
area.addEventListener('mouseenter',()=>{hover=true;schedule();});area.addEventListener('mouseleave',()=>{hover=false;schedule();});
area.addEventListener('focusin',()=>{focused=true;schedule();});area.addEventListener('focusout',event=>{focused=area.contains(event.relatedTarget);schedule();});
document.addEventListener('visibilitychange',schedule);
reduced.addEventListener('change',event=>{if(event.matches){paused=true;updatePause();schedule();}});
updatePause();schedule();
})();