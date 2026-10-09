(function(root){
 const normalize=s=>String(s).split('').sort().join('');
 const api={
 grade(q,selected){return normalize(q.answer)===normalize(selected.join(''));},
 queue(questions,type,mode,wrong){
  const ids=new Set(wrong);
  const pool=questions.filter(q=>!q.missing&&(type==='全部'||q.type===type)&&(mode!=='错题'||ids.has(q.id)));
  if(mode==='随机')for(let i=pool.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}
  return pool;
 }
 };
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 else root.QuizCore=api;
})(typeof window==='undefined'?globalThis:window);
