import {readFile} from 'node:fs/promises';
export const COUNTER_SOURCE='https://mlbbhub.com/matchups';
const normalize=s=>String(s).toLowerCase().replace(/[^a-z0-9]/g,'');
function array(html,key){const text=html.replaceAll('\\"','"');const marker=`"${key}":`;let start=text.indexOf(marker);if(start<0)throw new Error('Counter manbasi formati o‘zgargan.');start+=marker.length;while(/\s/.test(text[start]||''))start++;if(text[start]!=='[')throw new Error('Counter array topilmadi.');let depth=0,quoted=false,escaped=false;for(let i=start;i<text.length;i++){const c=text[i];if(quoted){if(escaped)escaped=false;else if(c==='\\')escaped=true;else if(c==='"')quoted=false;continue}if(c==='"')quoted=true;else if(c==='[')depth++;else if(c===']'&&!--depth)return JSON.parse(text.slice(start,i+1))}throw new Error('Counter array to‘liq emas.')}
export function parseCounters(html,catalogue,retrievedAt){
 const heroes=array(html,'heroes'),edges=array(html,'edges'),directions=array(html,'directions');
 if(heroes.length<100||heroes.length>200||edges.length!==heroes.length||directions.length!==heroes.length)throw new Error('Counter matrix hajmi yaroqsiz.');
 for(const rows of [edges,directions])if(rows.some(row=>!Array.isArray(row)||row.length!==heroes.length||row.some(value=>!Number.isFinite(value)||Math.abs(value)>100)))throw new Error('Counter matrix qiymati yaroqsiz.');
 const byName=new Map(catalogue.map(h=>[normalize(h.name),h.id])),index=new Map(heroes.map((h,i)=>[normalize(h.name),i]));
 const result=[];
 for(const h of catalogue){const i=index.get(normalize(h.name));if(i===undefined)continue;const details=[];
  for(let j=0;j<heroes.length;j++){const id=byName.get(normalize(heroes[j].name));if(!id||id===h.id)continue;const edge=edges[i][j],direction=directions[i][j];if(edge<0||(edge===0&&direction<0))details.push({id,evidenceType:edge<0?'measured':'counter-list',edge:edge<0?Math.abs(edge):null})}
  details.sort((a,b)=>(b.edge||0)-(a.edge||0)||a.id.localeCompare(b.id));
  if(details.length)result.push({id:h.id,counters:details.map(x=>x.id),counterDetails:details,counterSource:COUNTER_SOURCE,counterUpdatedAt:retrievedAt});
 }
 if(result.length<catalogue.length*.95)throw new Error('Herolar uchun counter qamrovi yetarli emas.');
 return {heroes:result,sourceUrl:COUNTER_SOURCE,retrievedAt};
}
export async function refreshCounters(db,trustedFetch,result,now){try{const ref=db.collection('system').doc('counterSnapshot');const previous=(await ref.get()).data();if(previous?.retrievedAt&&Date.now()-Date.parse(previous.retrievedAt)<6*3600000){result.skipped++;return}const catalogue=JSON.parse(await readFile(new URL('../../../public/data/heroes.json',import.meta.url),'utf8').catch(()=>readFile('public/data/heroes.json','utf8')));result.sourcesChecked++;const response=await trustedFetch(COUNTER_SOURCE);const snapshot=parseCounters(response.text,catalogue,now());await ref.set(snapshot);result.updated+=snapshot.heroes.length}catch(error){result.errors.push({source:'Counter matrix',error:error.message})}}
