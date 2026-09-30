// Keep imported/admin questions consistent with the numbered skill catalogue.
export function numberSkillQuestion(q,heroes){
 const h=[...heroes].sort((a,b)=>b.name.length-a.name.length).find(h=>String(q.question).startsWith(h.name));
 if(!h)return q;
 const labels={...h.skillLabels};
 (h.activeSkills||[]).forEach((s,i)=>labels[s.name]=`${i+1}-skill`);
 const fourth=['fredrinn','lunox','sun','yu-zhong','zhask'].includes(h.id);
 if(h.ultimate)labels[h.ultimate]=`${fourth?4:3}-skill`;
 if(/ultimate’i yoki maxsus skill rejimi qaysi/.test(q.question))return {...q,question:`${h.name}ning ${h.id==='julian'?'kuchayadigan uchinchi skill':'ultimate'} tugmasi qaysi raqamli skill?`,options:['1-skill','2-skill','3-skill','4-skill'],correct:fourth?3:2,explanation:`Bu ${fourth?4:3}-skill tugmasi. Passive raqamlangan faol skilllarga kirmaydi.`};
 const replace=text=>Object.entries(labels).filter(([name])=>name).sort((a,b)=>b[0].length-a[0].length).reduce((text,[name,label])=>text.replaceAll(name,label),String(text||''));
 const options=(q.options||[]).map(replace);
 // Ambiguous imported choices must retain distinct answers, never merge them.
 return {...q,question:replace(q.question),explanation:replace(q.explanation),options:new Set(options).size===options.length?options:q.options};
}
