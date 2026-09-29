import {readFile} from 'node:fs/promises';
import {services,now} from '../netlify/functions/lib/db.mjs';
const {db}=services();
const heroes=JSON.parse(await readFile(new URL('../public/data/heroes.json',import.meta.url),'utf8'));
const questions=JSON.parse(await readFile(new URL('../public/data/quiz-data.json',import.meta.url),'utf8'));
const sources=[{id:'official-mlbb',name:'Official Mobile Legends',url:'https://www.mobilelegends.com/news/',type:'news',format:'html',enabled:true,trusted:true,autoPublish:false}];
const challenges=[{id:'aamon-15',name:'Shard hunter',description:'Aamon bilan bitta matchda 15 yoki undan ko‘p kill oling.',period:'Daily',difficulty:'Hard'},{id:'tank-20',name:'Jamoa tayanchi',description:'Tank bilan bitta matchda 20 assist qayd eting.',period:'Daily',difficulty:'Medium'},{id:'marksman-clean',name:'Toza o‘yin',description:'Marksman bilan 0 death natijada matchni yakunlang.',period:'Daily',difficulty:'Hard'},{id:'three-wins',name:'Uchta g‘alaba',description:'Hafta davomida ketma-ket 3 match yuting.',period:'Weekly',difficulty:'Medium'},{id:'five-heroes',name:'Keng hero pool',description:'Hafta davomida 5 xil hero bilan g‘alaba qozoning.',period:'Weekly',difficulty:'Medium'},{id:'objective',name:'Objective first',description:'Jungler bilan Turtle yoki Lord uchun xavfsiz zoning va secure rejasini mashq qiling.',period:'Daily',difficulty:'Easy'}];
let added=0,skipped=0;
for(const [kind,rows] of [['heroes',heroes],['quizQuestions',questions],['sources',sources],['challenges',challenges]]){
 for(let offset=0;offset<rows.length;offset+=300){const batch=db.batch();for(const row of rows.slice(offset,offset+300)){const ref=db.collection(kind).doc(String(row.id));if((await ref.get()).exists){skipped++;continue}const {id,...data}=row;batch.set(ref,{...data,createdAt:now(),ownerId:'seed'});added++}await batch.commit()}
}
console.log(`Added ${added}; existing preserved ${skipped}. No fake members, Crew, news, meta or activity was seeded.`);
