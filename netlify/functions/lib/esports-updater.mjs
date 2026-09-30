import {createHash} from 'node:crypto';
import {elementByClass,plainText} from './news-updater.mjs';
export const LEAGUES=[
 {key:'ph',name:'MPL Philippines',sourceName:'MPL PH (rasmiy)',url:'https://ph-mpl.com/schedule'},
 {key:'my',name:'MPL Malaysia',sourceName:'MPL MY (rasmiy)',url:'https://my.mpl.mobilelegends.com/schedule'},
 {key:'id',name:'MPL Indonesia',sourceName:'MPL ID (rasmiy)',url:'https://id-mpl.com/schedule'}
];
const DAY=86400000;
export const inMatchWindow=(date,clock=Date.now(),past=15,future=15)=>Number.isFinite(Date.parse(date))&&Date.parse(date)>=clock-past*DAY&&Date.parse(date)<=clock+future*DAY;
const values=(html,name)=>[...html.matchAll(new RegExp('<div\\b[^>]*class=["\'][^"\']*\\b'+name+'\\b[^"\']*["\'][^>]*>([\\s\\S]*?)<\\/div>','gi'))].map(m=>plainText(m[1]));
function videoLink(html){const candidate=html.match(/href=["'](https:\/\/(?:www\.)?youtube\.com\/watch\?[^"']+|https:\/\/youtu\.be\/[^"']+)["']/i)?.[1];return candidate?candidate.replace(/&amp;/g,'&'):''}
function record(key,date,teams,score,done,sourceUrl,videoUrl='',id=''){
 const league=LEAGUES.find(l=>l.key===key),teamA=teams[0],teamB=teams[1];
 if(!teamA||!teamB||!Number.isFinite(Date.parse(date)))return null;
 const validScore=done&&score.length===2&&score.every(n=>/^\d{1,2}$/.test(n))&&score[0]!==score[1];
 return {id:id||createHash('sha256').update([key,date,teamA,teamB].join('|')).digest('hex'),teamA,teamB,score:validScore?score.join(' : '):'',status:validScore?'finished':'scheduled',date,league:league.name,leagueKey:key,sourceName:league.sourceName,sourceUrl,videoUrl,official:true,schemaVersion:2,active:true};
}
export function parseOfficialMatches(html,clock=Date.now(),past=15,future=15){
 const starts=[...html.matchAll(/<div\b[^>]*class=["']schedule-item\s[^"']*["'][^>]*>/gi)],rows=new Map();
 for(let i=0;i<starts.length;i++){
  const start=starts[i].index,block=html.slice(start,starts[i+1]?.index||html.length);
  const dates=[...html.slice(0,start).matchAll(/<div[^>]*class=["']match-category-day(?:\s[^"']*)?["'][^>]*>([^<]+)/gi)];
  const day=dates.at(-1)?.[1]?.trim(),time=plainText(block.match(/font-size:\s*0\.9rem;[^>]*>([^<]+)/i)?.[1]);
  if(!day||!time)continue;
  const stamp=new Date(day+' '+time+' GMT+0800');if(!Number.isFinite(+stamp)||!inMatchWindow(stamp.toISOString(),clock,past,future))continue;
  const teams=values(block,'team-name').slice(0,2),raw=plainText(block.match(/font-size:\s*1\.5rem;[^>]*>([\s\S]*?)<\/div>/i)?.[1]);
  const score=raw.split(/\s*:\s*/),done=/^\d+\s*:\s*\d+$/.test(raw);
  const sourceUrl=block.match(/href=["'](https:\/\/ph-mpl\.com\/data\/match\/[^"']+)/)?.[1]||LEAGUES[0].url;
  const id=createHash('sha256').update(day+time+teams.join(':')).digest('hex');
  const row=record('ph',stamp.toISOString(),teams,score,done,sourceUrl,videoLink(block),id);if(row)rows.set(row.id,row);
 }
 return [...rows.values()];
}
export function parseMalaysiaMatches(html,clock=Date.now(),past=15,future=15){
 const year=html.match(/Date:\s*[^<\n]*\b(20\d{2})\b/)?.[1];if(!year)return [];
 const starts=[...html.matchAll(/<div\b[^>]*class=["']match-card\s[^"']*["'][^>]*>/gi)],rows=new Map();
 for(let i=0;i<starts.length;i++){
  const block=html.slice(starts[i].index,starts[i+1]?.index||html.length),day=plainText(elementByClass(block,'match-date')),time=plainText(elementByClass(block,'match-time'));
  const stamp=new Date(day+' '+year+' '+time+' GMT+0800');if(!day||!time||!Number.isFinite(+stamp)||!inMatchWindow(stamp.toISOString(),clock,past,future))continue;
  const teams=values(block,'team-name').slice(0,2),score=values(block,'team-score').slice(0,2),done=starts[i][0].includes('match-done');
  const sourceUrl=block.match(/href=["'](https:\/\/my\.mpl\.mobilelegends\.com\/detail\/[^"']+)/)?.[1]||LEAGUES[1].url;
  const row=record('my',stamp.toISOString(),teams,score,done,sourceUrl,videoLink(block));if(row)rows.set(row.id,row);
 }
 return [...rows.values()];
}
export function parseIndonesiaMatches(html,clock=Date.now(),past=15,future=15){
 const starts=[...html.matchAll(/<div\b[^>]*class=["']match position-relative\s[^"']*["'][^>]*>/gi)],rows=new Map();
 for(let i=0;i<starts.length;i++){
  const block=html.slice(starts[i].index,starts[i+1]?.index||html.length);
  // Official calendar supplies an unambiguous UTC date, including its year.
  const utc=block.match(/(?:dates=)(\d{8}T\d{6})\//)?.[1];if(!utc)continue;
  const date=utc.slice(0,4)+'-'+utc.slice(4,6)+'-'+utc.slice(6,8)+'T'+utc.slice(9,11)+':'+utc.slice(11,13)+':'+utc.slice(13,15)+'Z';
  if(!inMatchWindow(date,clock,past,future))continue;
  const teams=values(block,'name').slice(0,2),score=values(block,'score').slice(0,2),done=/openMatchDetail\(\d+\)/.test(block);
  const row=record('id',new Date(date).toISOString(),teams,score,done,LEAGUES[2].url,videoLink(block));if(row)rows.set(row.id,row);
 }
 return [...rows.values()];
}
export async function refreshEsports(db,fetchText,result,now){
 const parsers={ph:parseOfficialMatches,my:parseMalaysiaMatches,id:parseIndonesiaMatches};
 await Promise.all(LEAGUES.map(async league=>{
  result.sourcesChecked++;
  try{
   // Keep recent history for forecasts; the public view always shows +/-15 days.
   const response=await fetchText(league.url),rows=parsers[league.key](response.text,Date.now(),90,15);
   if(!rows.length)throw new Error('Rasmiy sahifada sanasi tekshiriladigan o‘yin topilmadi.');
   const batch=db.batch(),ids=new Set(rows.map(row=>row.id)),stamp=now();
   const old=await db.collection('officialMatches').where('date','>=',new Date(Date.now()-90*DAY).toISOString()).limit(500).get();
   for(const doc of old.docs){const value=doc.data();if(value.leagueKey===league.key&&!ids.has(doc.id)&&value.schemaVersion===2)batch.set(doc.ref||db.collection('officialMatches').doc(doc.id),{active:false,updatedAt:stamp},{merge:true})}
   for(const {id,...row} of rows){const existing=old.docs.find(d=>d.id===id)?.data();batch.set(db.collection('officialMatches').doc(id),{...row,updatedAt:stamp,...(existing?.date!==row.date||existing?.status!==row.status||existing?.score!==row.score?{prediction:null}:{})},{merge:true})}
   await batch.commit();result.matchesUpdated=(result.matchesUpdated||0)+rows.length;
  }catch(e){result.errors.push({source:league.sourceName,error:e.message})}
 }));
}
