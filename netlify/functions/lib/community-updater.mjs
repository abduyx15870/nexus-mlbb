import {createHash} from 'node:crypto';
import {XMLParser} from 'fast-xml-parser';

const BASE='https://mlbbdex.com';
const hash=value=>createHash('sha256').update(value).digest('hex');
const trim=value=>String(value||'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
const stamp=value=>{if(!value)return null;const t=new Date(value);return Number.isFinite(+t)&&+t>Date.UTC(2020,0,1)&&+t<Date.now()+86400000?t.toISOString():null};
const rate=value=>value===null||value===undefined||value===''?NaN:Number(value);
const recent=(value,days=90)=>value&&Date.now()-new Date(value).getTime()<days*86400000;
const itemLink=value=>typeof value==='string'?value:value?.['#text']||value?.['@_href'];
const sourceLink=value=>{try{const url=new URL(value);return url.protocol==='https:'&&url.hostname==='mlbbdex.com'?url.href:null}catch{return null}};

// The feed is editorial content. Store a short excerpt and always link to the author.
export async function refreshCommunityNews(db,fetchText,result,now){
  const name='MLBBDex';
  try{
    const response=await fetchText(BASE+'/feed.xml');
    result.sourcesChecked++;
    const parser=new XMLParser({ignoreAttributes:false,processEntities:false});
    const feed=parser.parse(response.text);
    const entries=feed.rss?.channel?.item||feed.feed?.entry||[];
    const rows=Array.isArray(entries)?entries:[entries];
    if(!rows.length)throw new Error('RSS bo‘sh.');
    for(const row of rows.slice(0,5)){
      const url=sourceLink(itemLink(row.link));
      const title=trim(row.title).slice(0,180);
      const date=stamp(row.pubDate||row.published||row.updated);
      const summary=trim(row.description||row.summary).slice(0,320);
      if(!url||!title||!date||!recent(date)||!summary){result.skipped++;continue}
      const key=hash(url.split('#')[0]);
      const patch=/\bpatch\s+\d+\.\d+\.\d+/i.test(title);
      const ref=db.collection('news').doc(key);
      if(!(await ref.get()).exists){
        await ref.set({title,summary,category:patch?'Patch':'Update',sourceName:name,sourceUrl:url,sourcePublishedAt:date,nexusAddedAt:now(),updatedAt:date,titleHash:hash(title.toLowerCase()),verified:true,aiGenerated:false,published:true,ownerId:'source'});
        result.added++;
      }else result.skipped++;
      if(patch){
        const patchRef=db.collection('patches').doc(key);
        if(!(await patchRef.get()).exists){
          await patchRef.set({title,patch:title.match(/\bpatch\s+(\d+\.\d+\.\d+)/i)?.[1],summary,sourceName:name,sourceUrl:url,sourcePublishedAt:date,updatedAt:date,published:true,ownerId:'source',createdAt:now()});
          result.added++;
        }
      }
    }
  }catch(e){result.errors.push({source:name+' RSS',error:e.message})}
}

// Rankings need measured rates and a source date. Unknown patch versions stay unknown.
// This prevents an old measurement from appearing as a current meta recommendation.
export async function refreshCommunityMeta(db,fetchText,result,now){
  const name='MLBBDex';
  try{
    const previous=await db.collection('meta').get();
    const oldRows=new Map(previous.docs.map(doc=>[doc.id,doc.data()]));
    const expired=db.batch();
    let expiredCount=0;
    for(const [slug,old] of oldRows){
      if(old.ownerId==='source'&&old.sourceName===name&&old.published&&!recent(stamp(old.updatedAt),21)){
        expired.set(db.collection('meta').doc(slug),{published:false},{merge:true});
        expiredCount++;
      }
    }
    if(expiredCount){await expired.commit();result.expired=(result.expired||0)+expiredCount}
    const response=await fetchText(BASE+'/api/v1/rankings');
    result.sourcesChecked++;
    const payload=JSON.parse(response.text);
    const data=payload.data||{};
    const rows=Array.isArray(data)?data:Array.isArray(data.heroes)?data.heroes:[];
    if(!rows.length)throw new Error('Rankings API bo‘sh yoki formati o‘zgargan.');
    let valid=0,updates=0;
    const batch=db.batch();
    for(const row of rows.slice(0,150)){
      const slug=String(row.heroSlug||row.slug||row.hero?.slug||'').toLowerCase();
      const date=stamp(row.recordedAt||row.updatedAt||data.measuredAt||payload.recordedAt||payload.updatedAt);
      const rawPatch=String(row.patch||data.patch||payload.patch||'').trim();
      const patch=/^\d+\.\d+\.\d+$/.test(rawPatch)?rawPatch:'';
      const win=rate(row.winRate??row.win_rate),pick=rate(row.pickRate??row.pick_rate),ban=rate(row.banRate??row.ban_rate);
      if(!/^[a-z0-9-]+$/.test(slug)||!date||!recent(date,21)||![win,pick,ban].every(v=>Number.isFinite(v)&&v>=0&&v<=100)){result.skipped++;continue}
      valid++;
      const rank=String(row.rank||payload.rank||'All ranks').slice(0,40);
      const ref=db.collection('meta').doc(slug),old=oldRows.get(slug);
      if(old&&old.ownerId!=='source'){result.skipped++;continue}
      if(old?.updatedAt&&new Date(old.updatedAt)>=new Date(date)){result.skipped++;continue}
      const trend=!old?'Stable':win>old.winRate+.3?'Rising':win<old.winRate-.3?'Falling':'Stable';
      batch.set(ref,{heroId:slug,heroName:trim(row.name||slug),winRate:win,pickRate:pick,banRate:ban,rank,patch,patchKnown:!!patch,updatedAt:date,sourceName:name,sourceUrl:BASE+'/en/statistics',trend,published:true,ownerId:'source',lowSample:!!row.lowSample,attributionName:'Mobile Legends Wiki',attributionUrl:'https://mobilelegends.fandom.com',license:'CC BY-SA',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/'}, {merge:true});
      updates++;
    }
    if(!valid)throw new Error('Sanasi va statistikasi bor yangi satr topilmadi; meta e’lon qilinmadi.');
    if(updates){await batch.commit();result.added+=updates}
  }catch(e){result.errors.push({source:name+' meta',error:e.message})}
}
