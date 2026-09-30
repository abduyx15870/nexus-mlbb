import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import {numberSkillQuestion} from '../public/js/quiz-labels.js';
import {parseCounters} from '../netlify/functions/lib/counter-updater.mjs';
const root=new URL('../',import.meta.url);
const read=path=>fs.readFile(new URL(path,root),'utf8');
const heroes=JSON.parse(await read('public/data/heroes.json')),items=JSON.parse(await read('public/data/items.json')),quiz=JSON.parse(await read('public/data/quiz-data.json'));
const valid=new Set(heroes.map(h=>h.id));
for(const item of items){const bytes=await fs.readFile(new URL('public'+item.image,root));assert.equal(bytes.subarray(0,4).toString(),'RIFF');assert.equal(bytes.subarray(8,12).toString(),'WEBP');assert(item.description.length>20&&item.when.length>10)}
for(const h of heroes){assert(h.passive&&h.passiveGuide.length>30);assert(h.counters.length>0);assert(h.counters.every(id=>id!==h.id&&valid.has(id)));assert.equal(new Set(h.counters).size,h.counters.length)}
assert(heroes.find(h=>h.id==='fanny').counters.includes('khufra'));
assert(heroes.find(h=>h.id==='cyclops').counters.includes('lolita'));
assert(!heroes.find(h=>h.id==='lolita').counters.includes('cyclops'));
for(const q of quiz){const numbered=numberSkillQuestion(q,heroes);assert.equal(new Set(numbered.options).size,4);assert(numbered.correct>=0&&numbered.correct<4);if(q.category==='Skills')assert(!/«[A-Z]/.test(numbered.question))}
const imported={question:'Miyaning «Moon Arrow» skilli qaysi vazifani bajaradi?',options:['A','B','C','D'],correct:0,explanation:'Moon Arrow: keng zarba.'};assert(numberSkillQuestion(imported,heroes).question.includes('1-skill'));assert(!numberSkillQuestion(imported,heroes).explanation.includes('Moon Arrow'));
const matrixNames=heroes.map(h=>({name:h.name})),matrix=heroes.map(()=>heroes.map(()=>0));matrix[0][1]=-3;matrix[1][0]=3;
// Reject sparse or malformed refreshes before an existing full cache can be replaced.
assert.throws(()=>parseCounters(JSON.stringify({heroes:matrixNames,edges:matrix,directions:matrix}),heroes,'2026-09-30T10:00:00Z'));
const listeners=new Map(),state={heroes,items},forms=[];
const context=vm.createContext({document:{addEventListener:(name,fn)=>listeners.set(name,fn)},console});
function synthetic(exports){return new vm.SyntheticModule(Object.keys(exports),function(){for(const [k,v]of Object.entries(exports))this.setExport(k,v)},{context})}
const core=synthetic({state,esc:s=>String(s??'').replaceAll('"','&quot;'),modal:(...args)=>forms.push(args)}),data=synthetic({hero:id=>heroes.find(h=>h.id===id)});
const equipment=new vm.SourceTextModule(await read('public/js/equipment.js'),{context});const guideData=new vm.SourceTextModule(await read('public/js/equipment-data.js'),{context});await equipment.link(spec=>spec.includes('core')?core:spec.includes('equipment-data')?guideData:data);await equipment.evaluate();
assert(equipment.namespace.itemStrip(['warrior-boots','immortality'],true).includes('/assets/items/immortality.webp'));assert(equipment.namespace.itemPicker('item0','warrior-boots').includes('name="item0"'));assert(equipment.namespace.passiveSection(heroes[0]).includes(heroes[0].passiveGuide));
let preview={innerHTML:''},description={textContent:''},details={open:true,querySelector:()=>description};const form={elements:{item0:{value:''}},querySelector:()=>preview},pick={dataset:{pickItem:'warrior-boots',slot:'item0'},closest:selector=>selector==='form'?form:details};listeners.get('click')({target:{closest:()=>pick}});assert.equal(form.elements.item0.value,'warrior-boots');assert(preview.innerHTML.includes('/assets/items/warrior-boots.webp'));assert(description.textContent.includes('Warrior Boots'));assert.equal(details.open,false);
const button={dataset:{itemInfo:'immortality'}};listeners.get('click')({target:{closest:selector=>selector==='[data-item-info]'?button:null}});assert.equal(forms[0][0],'Immortality');assert(forms[0][1].includes('Qayta')||forms[0][1].includes('qayta'));
// Exercise the real identity function with verified-token Firebase substitutes.
let tokenUser={uid:'stranger',role:'user'},suspended=false,claimChanges=[];
const auth={verifyIdToken:async()=>({...tokenUser}),getUser:async uid=>({uid,customClaims:{keep:true}}),setCustomUserClaims:async(uid,claims)=>claimChanges.push({uid,claims})};
const authModule=synthetic({getAuth:()=>auth});const appModule=synthetic({getApps:()=>[{}],initializeApp:()=>{},cert:()=>{}});const firestore=synthetic({getFirestore:()=>({collection:()=>({doc:()=>({get:async()=>({data:()=>({suspended})})})})}),FieldValue:{}});const storage=synthetic({getStorage:()=>({})});
const db=new vm.SourceTextModule(await read('netlify/functions/lib/db.mjs'),{context});await db.link(spec=>spec.endsWith('/app')?appModule:spec.endsWith('/auth')?authModule:spec.endsWith('/firestore')?firestore:storage);await db.evaluate();
const request={headers:{get:()=> 'Bearer verified-token'}};assert.equal((await db.namespace.identity(request,true)).role,'user');assert.equal(claimChanges.length,0);tokenUser={uid:db.namespace.OWNER_UID,role:'user'};assert.equal((await db.namespace.identity(request,true)).role,'owner');assert.equal(claimChanges[0].claims.keep,true);assert.equal(claimChanges[0].claims.role,'owner');tokenUser={uid:'stranger',role:'user'};suspended=true;await assert.rejects(db.namespace.identity(request,true),e=>e.status===403);
console.log(`OK: ${items.length} original item icons and descriptions; ${heroes.length} passives and counter coverage; correct counter direction; unique numbered quizzes; picker selection and menus; verified UID owner promotion, preserved claims, other accounts denied.`);
