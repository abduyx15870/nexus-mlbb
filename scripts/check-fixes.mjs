import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import {listRecords,aggregateBuildLikes} from '../netlify/functions/lib/collections.mjs';
import {selectQuizQuestions} from '../netlify/functions/lib/quiz-selection.mjs';
import * as dbExports from '../netlify/functions/lib/db.mjs';
const raw=Array.from({length:75},(_,i)=>({id:String(i).padStart(3,'0'),published:i>=60,title:'News '+i}));
const snapshots=raw.map(value=>({id:value.id,exists:true,data:()=>value}));
const seen=[];
function query(offset=0,count=200){return {startAfter(doc){assert.equal(typeof doc.data,'function');seen.push(doc.id);return query(snapshots.findIndex(d=>d.id===doc.id)+1,count)},limit(n){return query(offset,n)},async get(){return {docs:snapshots.slice(offset,offset+count)}}}}
const database={collection(){return {doc(id){return {async get(){return snapshots.find(d=>d.id===id)||{exists:false}}}}}}};
const first=await listRecords(database,'news',query(),{limit:3},null);assert.deepEqual(first.items.map(x=>x.id),['060','061','062']);assert.equal(first.nextCursor,'062');assert(first.items.every(x=>x.published));
const second=await listRecords(database,'news',query(),{limit:3,cursor:first.nextCursor},null);assert.deepEqual(second.items.map(x=>x.id),['063','064','065']);assert.equal(new Set([...first.items,...second.items].map(x=>x.id)).size,6);
const staff=await listRecords(database,'news',query(),{limit:2},{role:'owner'});assert.deepEqual(staff.items.map(x=>x.id),['000','001']);
await assert.rejects(listRecords(database,'news',query(),{limit:2.5},null));await assert.rejects(listRecords(database,'news',query(),{limit:2,cursor:'missing'},null));
const likes=aggregateBuildLikes([{ownerId:'a',authorName:'A',likes:3},{ownerId:'a',authorName:'A',likes:5},{ownerId:'b',authorName:'B',likes:2},{ownerId:'source',likes:900}]);assert.equal(likes.length,2);assert.equal(likes.find(x=>x.id==='a').value,8);assert(!likes.some(x=>x.id==='source'));
const bank=JSON.parse(await fs.readFile(new URL('../public/data/quiz-data.json',import.meta.url),'utf8'));const opts={daily:true,difficulty:'all',category:'all'};const day=Date.parse('2026-09-30T03:00:00Z');const daily=selectQuizQuestions(bank,opts,day);assert.equal(daily.length,10);assert.deepEqual(daily.map(q=>q.id),selectQuizQuestions(bank,opts,day+3600000).map(q=>q.id));assert.notDeepEqual(daily.map(q=>q.id),selectQuizQuestions(bank,opts,day+86400000).map(q=>q.id));assert.equal(selectQuizQuestions(bank,{count:20,difficulty:'hard'}).length,20);await assert.rejects(async()=>selectQuizQuestions(bank,{count:-1}));
// Execute real frontend collection helpers against disconnected and empty DOM containers.
const elements=new Map();const element={isConnected:true,innerHTML:'',querySelector(){return null}};elements.set('#list',element);elements.set('#auth-button',{textContent:''});let fetchImpl=async()=>Response.json({items:[]});
const context=vm.createContext({navigator:{onLine:true},document:{querySelector:s=>elements.get(s)||null,querySelectorAll:()=>[],dispatchEvent(){}},window:{},location:{origin:'https://nexus.example'},Event,fetch:(...args)=>fetchImpl(...args),AbortSignal,Response,Request,setTimeout,clearTimeout,console});
const core=new vm.SourceTextModule(await fs.readFile(new URL('../public/js/core.js',import.meta.url),'utf8'),{context,identifier:'core'});await core.link(()=>{});await core.evaluate();
let renders=0;await core.namespace.mountCollection('#list','builds',rows=>{renders++;assert.equal(rows.length,0);return '<p>Empty build filters ready</p>'});assert.equal(renders,1);assert.equal(element.innerHTML,'<p>Empty build filters ready</p>');assert.equal(core.namespace.date('invalid-date'),'—');assert.equal(core.namespace.date(null),'—');assert.equal(core.namespace.date('2026-09-30T20:00:00Z'),'1 okt 2026');assert.equal((await core.namespace.mountCollection('#missing','news',()=>'' )).length,0);
element.isConnected=false;await core.namespace.mountCollection('#list','news',()=>{throw new Error('Disconnected renderer ran')});element.isConnected=true;
// Auth data must stay cleared if an old profile request finishes after sign-out.
let authCallback,resolveProfile;
const sdk={getAuth:()=>({}),onAuthStateChanged(_auth,callback){authCallback=callback}};
const sdkModule=new vm.SyntheticModule(Object.keys(sdk),function(){for(const [k,v]of Object.entries(sdk))this.setExport(k,v)},{context});await sdkModule.link(()=>{});await sdkModule.evaluate();
const appModule=new vm.SyntheticModule(['initializeApp'],function(){this.setExport('initializeApp',()=>({}))},{context});await appModule.link(()=>{});await appModule.evaluate();
const config=new vm.SyntheticModule(['firebaseConfig'],function(){this.setExport('firebaseConfig',{})},{context});await config.link(()=>{});await config.evaluate();
const auth=new vm.SourceTextModule(await fs.readFile(new URL('../public/js/auth.js',import.meta.url),'utf8'),{context,identifier:'auth',importModuleDynamically:async spec=>spec.includes('firebase-app')?appModule:sdkModule});await auth.link(spec=>spec.includes('config')?config:core);await auth.evaluate();await auth.namespace.initAuth();
fetchImpl=()=>new Promise(resolve=>resolveProfile=resolve);
const pending=authCallback({uid:'first',email:'first@example.com',getIdToken:async()=> 'token',getIdTokenResult:async()=>({claims:{role:'owner'}})});for(let i=0;i<8&&!resolveProfile;i++)await Promise.resolve();assert(resolveProfile);await authCallback(null);resolveProfile(Response.json({profile:{nickname:'Old account',heroPool:['aamon'],favorites:['x']}}));await pending;assert.equal(core.namespace.state.user,null);assert.equal(core.namespace.state.profile,null);assert.equal(core.namespace.state.pool.length,0);assert.equal(core.namespace.state.favorites.length,0);assert.equal(elements.get('#auth-button').textContent,'Kirish');
console.log('OK: public News visibility without composite index; ordered snapshot pagination; grouped build likes; deterministic Daily Quiz; empty/disconnected views; invalid dates; sign-out race isolation.');
// Run the real API with a Firestore/Auth substitute to exercise complete actions.
const apiContext=vm.createContext({URL,Request,Response,console,process,Buffer,AbortSignal});
let currentUser={uid:'tester',role:'owner',name:'Tester'},counter=0;
const records=new Map(),notifications=[],audit=[];
function reference(kind,id){return {id,kind,async get(){const value=records.get(kind+'/'+id);return {id,exists:!!value,ref:this,data:()=>value}},async set(value,options){records.set(kind+'/'+id,options?.merge?{...records.get(kind+'/'+id),...value}:value)},async update(value){await this.set(value,{merge:true})},async delete(){records.delete(kind+'/'+id)}}}
function dbQuery(kind,conditions=[],order=null,offset=0,limit=200){return {
 doc(id){return reference(kind,id||'record-'+(++counter))},
 where(key,op,value){return dbQuery(kind,[...conditions,{key,op,value}],order,offset,limit)},
 orderBy(key,dir='asc'){assert(!conditions.some(c=>c.key==='published')||key!=='sourcePublishedAt','Composite News index still required');return dbQuery(kind,conditions,{key,dir},offset,limit)},
 limit(n){return dbQuery(kind,conditions,order,offset,n)},
 startAfter(doc){return dbQuery(kind,conditions,order,allRows().findIndex(r=>r.id===doc.id)+1,limit)},
 async add(value){const ref=reference(kind,'record-'+(++counter));await ref.set(value);return ref},
 async get(){const docs=allRows().slice(offset,offset+limit);return {docs,empty:docs.length===0,forEach:fn=>docs.forEach(fn)}},
 };
 function allRows(){let rows=[...records].filter(([key])=>key.startsWith(kind+'/')).map(([key,value])=>({id:key.slice(kind.length+1),exists:true,ref:reference(kind,key.slice(kind.length+1)),data:()=>value}));rows=rows.filter(r=>conditions.every(c=>c.op==='=='?r.data()[c.key]===c.value:c.op==='>='?r.data()[c.key]>=c.value:c.op==='<='?r.data()[c.key]<=c.value:true));if(order)rows.sort((a,b)=>String(a.data()[order.key]??'').localeCompare(String(b.data()[order.key]??''))*(order.dir==='desc'?-1:1));else rows.sort((a,b)=>a.id.localeCompare(b.id));return rows}
}
const db={collection:kind=>dbQuery(kind),async runTransaction(fn){return fn({get:r=>r.get(),set:(r,v,o)=>r.set(v,o),update:(r,v)=>r.update(v),delete:r=>r.delete()})}};
const roleChanges=[];const roleAuth={getUser:async uid=>({uid,customClaims:{keep:true}}),setCustomUserClaims:async(uid,claims)=>roleChanges.push({uid,claims})};
const services=()=>({db,auth:roleAuth,storage:{}});
const injected={...dbExports,services,identity:async()=>currentUser,limited:async()=>{},notify:async(...args)=>notifications.push(args),audit:async(...args)=>audit.push(args),award:async()=>{}};
async function synthetic(exports){const module=new vm.SyntheticModule(Object.keys(exports),function(){for(const [key,value]of Object.entries(exports))this.setExport(key,value)},{context:apiContext});await module.link(()=>{});await module.evaluate();return module}
const links=new Map([
 ['./lib/db.mjs',await synthetic(injected)],
 ['./lib/updater.mjs',await synthetic({createBuildAI:async()=>{},createMatchPrediction:async()=>{},askAI:async()=>{},aiConfigured:()=>true})],
 ['./lib/refresh-dispatch.mjs',await synthetic({queueRefresh:async()=>({queued:true})})],
 ['./lib/collections.mjs',await synthetic({listRecords,aggregateBuildLikes})],
 ['./lib/quiz-selection.mjs',await synthetic({selectQuizQuestions})],
 ['node:fs/promises',await synthetic(await import('node:fs/promises'))],
 ['node:crypto',await synthetic(await import('node:crypto'))]
]);
const apiURL=new URL('../netlify/functions/api.mjs',import.meta.url).href;
const apiModule=new vm.SourceTextModule(await fs.readFile(new URL(apiURL),'utf8'),{context:apiContext,identifier:apiURL,initializeImportMeta:meta=>meta.url=apiURL});await apiModule.link(spec=>links.get(spec));await apiModule.evaluate();
async function call(action,body={}){const response=await apiModule.namespace.default(new Request('https://nexus.example/api/'+action,{method:'POST',body:JSON.stringify(body)}));return {status:response.status,body:await response.json()}}
const profile=await call('profile');assert.equal(profile.status,200);assert.equal(profile.body.profile.xp,0);records.get('profiles/tester').xp=40;await call('profile');assert.equal(records.get('profiles/tester').xp,40);
const saved=await call('update-profile',{nickname:'Chosen nickname',heroPool:['aamon','invalid','aamon']});assert.equal(saved.status,200);assert.equal(records.get('profiles/tester').nickname,'Chosen nickname');assert.deepEqual(Array.from(records.get('profiles/tester').heroPool),['aamon']);assert.equal((await call('update-profile',{heroPool:'aamon'})).status,400);
records.set('news/draft',{published:false,title:'Private draft',sourcePublishedAt:'2026-09-30'});records.set('news/public',{published:true,title:'Visible news',sourcePublishedAt:'2026-09-29'});currentUser=null;const news=await call('list',{kind:'news',limit:1});assert.equal(news.status,200);assert.equal(news.body.items.length,1);assert.equal(news.body.items[0].title,'Visible news');assert.equal((await call('get',{kind:'news',id:'draft'})).status,404);
currentUser={uid:'tester',role:'owner',name:'Tester'};records.set('builds/build-1',{ownerId:'author',published:true});const comment=await call('comments',{kind:'builds',id:'build-1',text:'Useful build'});assert.equal(comment.status,200);assert.equal(notifications.at(-1)[3],'build/build-1');
records.set('reports/report-1',{ownerId:'reporter',kind:'builds',targetId:'build-1',status:'open'});const warning=await call('moderate',{id:'report-1',operation:'warn'});assert.equal(warning.status,200);assert.equal(notifications.at(-1)[0],'author');assert.equal((await call('moderate',{id:'report-1',operation:'wrong'})).status,400);
const heroes=JSON.parse(await fs.readFile(new URL('../public/data/heroes.json',import.meta.url))),items=JSON.parse(await fs.readFile(new URL('../public/data/items.json',import.meta.url)));
const build={name:'Test build',hero:heroes[0].id,items:items.slice(0,6).map(i=>i.id),emblem:'Assassin',spell:'Retribution',aiGenerated:true};assert.equal((await call('save',{kind:'builds',data:{...build,hero:'fake'}})).status,400);assert.equal((await call('save',{kind:'builds',data:{...build,items:Array(6).fill(items[0].id)}})).status,400);const created=await call('save',{kind:'builds',data:build});assert.equal(created.status,200);assert.equal(records.get('builds/'+created.body.id).aiGenerated,undefined);
const session=await call('quiz-start',{daily:true,count:10,difficulty:'all',category:'all'});assert.equal(session.status,200);assert.equal(session.body.questions.length,10);const answers=session.body.questions.map(q=>q.correct);const submitted=await call('quiz-submit',{id:session.body.id,answers,time:10});assert.equal(submitted.status,200);const xp=records.get('profiles/tester').xp;await call('quiz-submit',{id:session.body.id,answers,time:10});assert.equal(records.get('profiles/tester').xp,xp);assert(records.has('quizResults/'+session.body.id));
console.log('OK: API profile creation without reset; nickname/pool validation; public News filtering; build comment route; correct moderation recipient; catalog validation; real Daily Quiz save and idempotent XP.');

currentUser={uid:'tester',role:'admin',name:'Tester'};assert.equal((await call('grant-role',{uid:'another',role:'admin'})).status,403);currentUser={uid:'tester',role:'owner',name:'Tester'};assert.equal((await call('grant-role',{uid:dbExports.OWNER_UID,role:'user'})).status,403);assert.equal((await call('grant-role',{uid:'another',role:'owner'})).status,400);const grant=await call('grant-role',{uid:'another',role:'admin'});assert.equal(grant.status,200);assert.equal(roleChanges.at(-1).claims.role,'admin');assert.equal(roleChanges.at(-1).claims.keep,true);assert.equal(records.get('profiles/another').role,'admin');console.log('OK: only Owner grants roles; designated owner cannot be demoted; arbitrary owner grants rejected; admin claim preserved and profile synchronized.');
