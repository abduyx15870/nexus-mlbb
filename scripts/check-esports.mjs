import assert from 'node:assert/strict';
import {parseOfficialMatches,parseMalaysiaMatches,parseIndonesiaMatches,inMatchWindow,refreshEsports} from '../netlify/functions/lib/esports-updater.mjs';
import {predictionContext,validatePrediction,predictMatch,refreshPredictions} from '../netlify/functions/lib/match-predictions.mjs';
const clock=Date.parse('2026-09-30T03:00:00Z'),DAY=86400000;
const ph=`<div class="match-category-day ml-auto">Saturday, 26 September 2026</div><div class="schedule-item live position-relative"><div style="font-size: 0.9rem;">7:30 PM</div><div class="team-name">FLCN</div><div style="font-size: 1.5rem;">2 : 1</div><div class="team-name">ONIC</div><a href="https://ph-mpl.com/data/match/flcn-onic-20260926">Data</a></div>`;
const myCard=(date,done=false)=>`<div class="match-card position-relative ${done?'match-done':''}"><div class="team-name">SRG</div><div class="team-score">${done?'2':''}</div><div class="team-score winner">${done?'0':''}</div><div class="team-name">RRQ</div><div class="match-date">${date}</div><div class="match-time">17:00</div><a href="https://my.mpl.mobilelegends.com/detail/test">Detail</a></div>`;
const my='Date: 14 August - 18 October 2026\n'+myCard('20 Sep',true)+myCard('8 Oct')+myCard('8 Oct')+myCard('20 Oct');
const id=`<div class="match position-relative py-2 px-3"><div class="name">EVOS</div><div class="score font-primary"></div><div class="score font-primary"></div><div class="name">RRQ</div><a href="https://calendar.google.com/calendar/render?action=TEMPLATE&amp;dates=20261008T080000/20261008T090000">Calendar</a></div>`;
const a=parseOfficialMatches(ph,clock),b=parseMalaysiaMatches(my,clock),c=parseIndonesiaMatches(id,clock);
assert.equal(a.length,1);assert.equal(a[0].date,'2026-09-26T11:30:00.000Z');assert.equal(a[0].score,'2 : 1');
assert.equal(b.length,2);assert.equal(b[1].date,'2026-10-08T09:00:00.000Z');assert.equal(b[1].score,'');assert.equal(b[1].status,'scheduled');assert.equal(parseMalaysiaMatches(my.replace('2026',''),clock).length,0);
assert.equal(c.length,1);assert.equal(c[0].date,'2026-10-08T08:00:00.000Z');
assert(!inMatchWindow(new Date(clock-16*DAY).toISOString(),clock));assert(!inMatchWindow(new Date(clock+16*DAY).toISOString(),clock));assert(inMatchWindow(new Date(clock+15*DAY).toISOString(),clock));
const actual=Date.now(),stamp=()=>new Date().toISOString();
const target={id:'test-match',teamA:'A',teamB:'B',leagueKey:'my',league:'MPL Malaysia',schemaVersion:2,official:true,status:'scheduled',date:new Date(actual+DAY).toISOString(),updatedAt:stamp(),sourceUrl:'https://my.mpl.mobilelegends.com/schedule'};
const history=Array.from({length:5},(_,i)=>({...target,id:'history-'+i,status:'finished',score:'2 : 0',date:new Date(actual-(i+1)*DAY).toISOString(),sourceUrl:'https://my.mpl.mobilelegends.com/detail/'+i}));
const future={...target,id:'future',status:'finished',score:'0 : 2',date:new Date(actual+2*DAY).toISOString()};
const otherLeague={...history[0],id:'wrong-league',leagueKey:'ph'};
const info=predictionContext(target,[...history,future,otherLeague]);assert(info.enough);assert.equal(info.context.teamA.wins,5);assert.equal(info.context.teamB.losses,5);assert.equal(info.context.headToHead.length,3);
assert.equal(info.hash,predictionContext(target,[...history]).hash);assert(!predictionContext(target,history.slice(0,2)).enough);
assert(validatePrediction({id:target.id,favorite:'A',analysis:'Yaqindagi natijalar A jamoasini ustun ko‘rsatmoqda.'},target));assert(!validatePrediction({id:target.id,favorite:'Fake',analysis:'Yaqindagi natijalar jamoani ustun ko‘rsatmoqda.'},target));assert(!validatePrediction({id:target.id,favorite:'A',analysis:'A jamoasi uchun 100% g‘alaba kafolati mavjud.'},target));
const records=new Map([target,...history].map(r=>[r.id,r]));
const db={
 collection(){
  return {
   where(){return this},limit(){return this},
   async get(){return {docs:[...records].map(([id,v])=>({id,data:()=>v}))}},
   doc(id){return {
    id,
    async get(){return {exists:records.has(id),data:()=>records.get(id)}},
    async set(v){records.set(id,{...records.get(id),...v})}
   }}
  };
 }
};
let calls=0;const model=async messages=>{calls++;return JSON.stringify(JSON.parse(messages[1].content).map(ctx=>({id:ctx.match.id,favorite:'A',analysis:'A jamoasining yaqindagi natijalari yaxshiroq. Bu ehtiyotkor taxmin, draft va tarkib o‘zgarishi hisobga olinmagan.'})))};
const prediction=await predictMatch(db,model,stamp,target.id);assert.equal(prediction.prediction.favorite,'A');assert.equal(prediction.prediction.teamA.wins,5);assert.equal(prediction.prediction.aiGenerated,true);await predictMatch(db,model,stamp,target.id);assert.equal(calls,1);
records.set(target.id,{...records.get(target.id),status:'finished'});await assert.rejects(predictMatch(db,model,stamp,target.id),/kelgusi/);
records.set(target.id,{...target,updatedAt:new Date(actual-3*DAY).toISOString()});await assert.rejects(predictMatch(db,model,stamp,target.id),/eskirgan/);
records.clear();records.set(target.id,target);const insufficient=await predictMatch(db,model,stamp,target.id);assert.equal(insufficient.prediction.status,'insufficient');assert.equal(insufficient.prediction.favorite,null);assert.equal(calls,1);
console.log('OK: three official league parsers; timezone conversion; deduplication; +/-15-day boundaries; forecast history isolation; validation; cache; insufficient-data, stale and completed-match handling.');
