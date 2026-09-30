import {randomUUID} from 'node:crypto';
import {HttpError,id,str,limited,OWNER_UID,now} from './db.mjs';
export const PLAYER_ACTIONS=['build-folders','training-progress','data-issue','match-reminder'];
export async function playerAction(action,d,u,db,load){
 if(action==='build-folders'){
  const ref=db.collection('buildFolders').doc(u.uid),operation=d.operation||'list';
  if(operation==='list')return {folders:(await ref.get()).data()?.folders||[]};
  await limited(u,'folders',30);let folders;
  await db.runTransaction(async tx=>{const old=(await tx.get(ref)).data();folders=old?.folders||[];
   if(operation==='create'){const name=str(d.name,40);if(!name)throw new HttpError(400,'Papka nomini kiriting.');if(folders.length>=20)throw new HttpError(400,'Ko‘pi bilan 20 ta papka.');if(folders.some(f=>f.name.toLowerCase()===name.toLowerCase()))throw new HttpError(409,'Bu nomli papka bor.');folders.push({id:randomUUID(),name})}
   else if(operation==='rename'||operation==='delete'){const folder=folders.find(f=>f.id===d.folderId);if(!folder)throw new HttpError(404,'Papka topilmadi.');if(operation==='delete')folders=folders.filter(f=>f.id!==d.folderId);else{const name=str(d.name,40);if(!name)throw new HttpError(400,'Nom bo‘sh bo‘lmasin.');if(folders.some(f=>f.id!==folder.id&&f.name.toLowerCase()===name.toLowerCase()))throw new HttpError(409,'Bu nomli papka bor.');folder.name=name}}
   else if(operation==='move'){if(d.folderId&&!folders.some(f=>f.id===d.folderId))throw new HttpError(404,'Papka topilmadi.');const favorite=db.collection('favorites').doc(id(d.favoriteId));const saved=(await tx.get(favorite)).data();if(saved?.ownerId!==u.uid||saved.kind!=='builds')throw new HttpError(403,'Faqat o‘zingiz saqlagan build.');tx.update(favorite,{folderId:d.folderId||'',updatedAt:now()})}
   else throw new HttpError(400,'Papka amali yaroqsiz.');tx.set(ref,{folders,updatedAt:now()});
  });return {folders};
 }
 if(action==='training-progress'){
  const hero=(await load('heroes')).find(h=>h.id===d.hero);if(!hero)throw new HttpError(404,'Hero topilmadi.');const ref=db.collection('trainingProgress').doc(u.uid+'_'+hero.id);
  if(d.completed!==undefined){await limited(u,'training',30);if(!Array.isArray(d.completed)||d.completed.some(n=>!Number.isInteger(n)||n<0||n>3))throw new HttpError(400,'Mashq bosqichi yaroqsiz.');await ref.set({ownerId:u.uid,hero:hero.id,completed:[...new Set(d.completed)],selfReported:true,updatedAt:now()})}return {progress:(await ref.get()).data()||{hero:hero.id,completed:[]}};
 }
 if(action==='data-issue'){
  await limited(u,'data-issue',5,3600);const reason=str(d.reason,1200);if(reason.length<10)throw new HttpError(400,'Xatoni kamida 10 belgi bilan tushuntiring.');const type=str(d.kind,30),target=id(d.targetId);
  if(['heroes','items'].includes(type)){if(!(await load(type)).some(row=>row.id===target))throw new HttpError(404,'Katalog yozuvi topilmadi.')}
  else if(['builds','news','patches'].includes(type)){const row=(await db.collection(type).doc(target).get()).data();if(!row||(['news','patches'].includes(type)&&!row.published))throw new HttpError(404,'Ochiq yozuv topilmadi.')}
  else throw new HttpError(400,'Xato bo‘limi yaroqsiz.');
  const issue=db.collection('dataIssues').doc();await issue.set({ownerId:u.uid,authorName:str(u.name||'Player',40),kind:type,targetId:target,reason,status:'open',createdAt:now()});await db.collection('notifications').doc('issue_'+issue.id).set({ownerId:OWNER_UID,type:'data-issue',text:'Ma’lumot xatosi: '+type+' / '+target,target:'admin/Corrections',read:false,createdAt:now()});return {ok:true};
 }
 if(action==='match-reminder'){
  if(d.operation==='list'){const snap=await db.collection('matchReminders').where('ownerId','==',u.uid).limit(200).get();return {items:snap.docs.map(doc=>({id:doc.id,...doc.data()}))}}
  await limited(u,'match-reminder',30);const matchId=id(d.matchId),ref=db.collection('matchReminders').doc(u.uid+'_'+matchId);
  if(d.operation==='cancel'){await ref.delete();return {ok:true}}
  const match=(await db.collection('officialMatches').doc(matchId).get()).data();const minutes=Number(d.minutes||30);
  if(![5,15,30,60].includes(minutes))throw new HttpError(400,'5, 15, 30 yoki 60 daqiqa tanlang.');if(!match||match.active===false||match.status==='finished'||!Number.isFinite(Date.parse(match.date))||Date.parse(match.date)<=Date.now())throw new HttpError(400,'Kelgusi rasmiy o‘yinni tanlang.');
  await ref.set({ownerId:u.uid,matchId,minutes,matchDate:match.date,remindAt:new Date(Math.max(Date.now(),Date.parse(match.date)-minutes*60000)).toISOString(),status:'pending',createdAt:now()});return {ok:true};
 }
}
