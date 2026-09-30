import {createHash} from 'node:crypto';
import {elementByClass,plainText} from './news-updater.mjs';
export function parseOfficialMatches(html,clock=Date.now()){
 const starts=[...html.matchAll(/<div\b[^>]*class=["']schedule-item\s[^"']*["'][^>]*>/gi)];
 const rows=new Map();
 for(let i=0;i<starts.length;i++){
  const start=starts[i].index,block=html.slice(start,starts[i+1]?.index||html.length);
  const dates=[...html.slice(0,start).matchAll(/<div[^>]*class=["']match-category-day(?:\s[^"']*)?["'][^>]*>([^<]+)/gi)];
  const day=dates.at(-1)?.[1]?.trim(),time=plainText(block.match(/font-size:\s*0\.9rem;[^>]*>([^<]+)/i)?.[1]);
  if(!day||!time)continue;
  const stamp=new Date(day+' '+time+' GMT+0800');
  if(!Number.isFinite(+stamp)||+stamp<clock-30*86400000||+stamp>clock+7*86400000)continue;
  const teams=[...block.matchAll(/class=["']team-name["'][^>]*>([\s\S]*?)<\/div>/gi)].slice(0,2).map(x=>plainText(x[1]));
  if(teams.length!==2)continue;
  const score=plainText(block.match(/font-size:\s*1\.5rem;[^>]*>([\s\S]*?)<\/div>/i)?.[1]);
  const completed=/^\d+\s*:\s*\d+$/.test(score);
  const candidate=block.match(/href=["'](https:\/\/ph-mpl\.com\/data\/match\/[^"']+)/)?.[1];
  const sourceUrl=candidate||'https://ph-mpl.com/schedule';
  const id=createHash('sha256').update(day+time+teams.join(':')).digest('hex');
  rows.set(id,{id,teamA:teams[0],teamB:teams[1],score:completed?score.replace(/\s+/g,' '):'',status:completed?'finished':'scheduled',date:stamp.toISOString(),league:'MPL Philippines',sourceUrl,sourceName:'MPL PH (rasmiy)',official:true});
 }
 return [...rows.values()];
}
export async function refreshEsports(db,fetchText,result,now){
 result.sourcesChecked++;
 try{
  const rows=parseOfficialMatches((await fetchText('https://ph-mpl.com/schedule')).text);
  if(!rows.length)throw new Error('Rasmiy sahifada o‘qiladigan yangi natija topilmadi.');
  const batch=db.batch();for(const {id,...row} of rows)batch.set(db.collection('officialMatches').doc(id),{...row,updatedAt:now()},{merge:true});
  await batch.commit();result.matchesUpdated=rows.length;
 }catch(e){result.errors.push({source:'MPL rasmiy o‘yinlar',error:e.message})}
}
