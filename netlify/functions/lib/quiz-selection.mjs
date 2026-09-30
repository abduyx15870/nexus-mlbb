import {randomInt} from 'node:crypto';
import {HttpError} from './db.mjs';
export function selectQuizQuestions(bank,options,clock=Date.now()){
 const daily=options.daily===true;
 const count=daily?10:options.count==='endless'?1000:Number(options.count??10);
 if(![10,20,50,100,1000].includes(count))throw new HttpError(400,'Savollar sonini ro‘yxatdan tanlang.');
 const selected=bank.filter(q=>(!options.difficulty||options.difficulty==='all'||q.difficulty===options.difficulty)&&(!options.category||options.category==='all'||q.category===options.category));
 if(!selected.length)throw new HttpError(400,'Ushbu filtrda savol yo‘q.');
 let seed=Number(new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Tashkent',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(clock)).replaceAll('-',''))>>>0;
 for(let i=selected.length-1;i>0;i--){seed=(seed*1664525+1013904223)>>>0;const j=daily?seed%(i+1):randomInt(i+1);[selected[i],selected[j]]=[selected[j],selected[i]]}
 return selected.slice(0,Math.min(count,selected.length));
}
