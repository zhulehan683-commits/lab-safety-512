const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const key='safeexam512-wrong-v1';
let wrong=new Set(),pool=[],index=0,selected=[],submitted=false,correct=0;
try{const saved=JSON.parse(localStorage.getItem(key)||'[]');if(Array.isArray(saved))wrong=new Set(saved.filter(x=>Number.isInteger(x)&&examQuestions.some(q=>q.id===x&&!q.missing)));}catch(_){}
function savedCount(){$('#saved').textContent=`错题本：${wrong.size} 道`;}
function persist(){try{localStorage.setItem(key,JSON.stringify([...wrong]));}catch(_){}savedCount();}
function choices(q){return q.type==='判断题'?[{value:'正确',text:'正确'},{value:'错误',text:'错误'}]:q.options.map((text,i)=>({value:'ABCD'[i],text})).filter(x=>x.text);}
function render(){
 const q=pool[index];
 $('#stats').textContent=`第 ${index+1} / ${pool.length} 道 · 已答 ${index+(submitted?1:0)} 道 · 答对 ${correct} 道`;
 $('#progress').max=pool.length;$('#progress').value=index+(submitted?1:0);
 $('#question').innerHTML=`<div class="meta">原题第 ${q.id} 题 · ${esc(q.type)}${q.type==='多选题'?' · 请选择全部正确选项':''}</div><h2>${esc(q.question)}</h2><div class="choices">${choices(q).map(o=>{
 const on=selected.includes(o.value),right=submitted&&(q.type==='判断题'?q.answer===o.value:q.answer.includes(o.value));
 return `<label class="option${on?' selected':''}${right?' right':submitted&&on?' wrong':''}"><input type="${q.type==='多选题'?'checkbox':'radio'}" name="answer" value="${esc(o.value)}" ${on?'checked':''} ${submitted?'disabled':''}><span>${esc(o.text)}${right?' ✓':''}</span></label>`;
 }).join('')}</div>${submitted?`<div class="feedback${QuizCore.grade(q,selected)?'':' bad'}" role="status"><strong>${QuizCore.grade(q,selected)?'回答正确 ✓':'回答错误'}</strong>\n你的答案：${esc(selected.join('、'))}\n正确答案：${esc(q.answer)}</div>${q.explanation?`<div class="analysis"><strong>原题解析：</strong>${esc(q.explanation)}</div>`:''}`:''}<div class="actions">${submitted?`<button class="primary" id="next">${index===pool.length-1?'查看本轮结果':'下一题 →'}</button>`:'<button class="primary" id="submit" disabled>提交答案</button>'}</div>`;
}
function start(){
 pool=QuizCore.queue(examQuestions,$('#type').value,$('#mode').value,[...wrong]);index=0;selected=[];submitted=false;correct=0;
 $('#practice').hidden=!pool.length;$('#message').textContent=pool.length?'':($('#mode').value==='错题'?'此题型暂无错题，换个题型或开始顺序练习。':'暂无可练习的题目。');
 if(pool.length)render();
}
$('#start').addEventListener('click',start);
$('#question').addEventListener('change',ev=>{
 if(submitted||!ev.target.matches('input[name="answer"]'))return;
 selected=[...$('#question').querySelectorAll('input:checked')].map(x=>x.value);
 $('#submit').disabled=selected.length===0;
 $('#question').querySelectorAll('.option').forEach(x=>x.classList.toggle('selected',x.querySelector('input').checked));
});
$('#question').addEventListener('click',ev=>{
 if(ev.target.closest('#submit')){
  if(submitted||!selected.length)return;
  submitted=true;const q=pool[index];if(QuizCore.grade(q,selected)){correct++;wrong.delete(q.id);}else wrong.add(q.id);
  persist();render();
 }else if(ev.target.closest('#next')){
  if(!submitted)return;
  if(index===pool.length-1){$('#question').innerHTML=`<div class="summary"><h2>本轮练习完成</h2><strong>${correct} / ${pool.length}</strong><p>正确率 ${Math.round(correct/pool.length*100)}% · 本轮答错 ${pool.length-correct} 道</p><button id="retry" class="primary">重做错题</button><p class="note">也可以在上方选择题型，开始新一轮练习。</p></div>`;return;}
  index++;selected=[];submitted=false;render();$('#practice').scrollIntoView({behavior:'smooth',block:'start'});
 }else if(ev.target.closest('#retry')){$('#mode').value='错题';start();}
});
savedCount();
