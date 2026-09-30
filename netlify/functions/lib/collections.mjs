import {HttpError,id,isAdmin} from './db.mjs';
export async function listRecords(db,kind,query,options,user){
 const rawLimit=options.limit===undefined?60:Number(options.limit);
 if(!Number.isInteger(rawLimit)||rawLimit<1||rawLimit>200)throw new HttpError(400,'Sahifa hajmi 1–200 oralig‘idagi butun son bo‘lsin.');
 const visible=value=>!(kind==='news'&&!isAdmin(user)&&value.published!==true)&&!(kind==='officialMatches'&&(value.active===false||value.schemaVersion!==2));
 // Ordered News is filtered on the server: no published+date composite index required.
 if(options.cursor){const cursor=await db.collection(kind).doc(id(options.cursor)).get();if(!cursor.exists)throw new HttpError(400,'Sahifa kursori eskirgan.');query=query.startAfter(cursor)}
 const items=[];let last=null,more=false;
 for(let page=0;page<10&&items.length<rawLimit;page++){
  const batchSize=Math.max(50,rawLimit-items.length),snap=await query.limit(batchSize).get();
  if(!snap.docs.length){more=false;break}
  let consumed=0;
  for(const doc of snap.docs){last=doc;consumed++;if(visible(doc.data()))items.push({id:doc.id,...doc.data()});if(items.length===rawLimit)break}
  more=consumed<snap.docs.length||snap.docs.length===batchSize;
  if(!more||items.length===rawLimit)break;
  query=query.startAfter(last);
 }
 return {items,nextCursor:more&&last?last.id:null};
}
export function aggregateBuildLikes(builds){
 const people=new Map();
 for(const b of builds){if(!b.ownerId||b.ownerId==='source')continue;const likes=Math.max(0,Number(b.likes)||0),old=people.get(b.ownerId)||{id:b.ownerId,nickname:b.authorName||'Player',value:0};old.value+=likes;people.set(b.ownerId,old)}
 return [...people.values()].filter(p=>p.value>0);
}
