import {services,FieldValue} from './lib/db.mjs';
export async function sendDueReminders(db,clock=Date.now()){
 const stamp=new Date(clock).toISOString();const rows=await db.collection('matchReminders').where('remindAt','<=',stamp).limit(500).get();let sent=0;
 for(const doc of rows.docs){if(doc.data().status!=='pending')continue;await db.runTransaction(async tx=>{
  const ref=doc.ref||db.collection('matchReminders').doc(doc.id),reminder=(await tx.get(ref)).data();if(reminder?.status!=='pending')return;
  const match=(await tx.get(db.collection('officialMatches').doc(reminder.matchId))).data();
  if(!match||match.active===false||match.status==='finished'||!Number.isFinite(Date.parse(match.date))||Date.parse(match.date)<=clock){tx.update(ref,{status:'expired',remindAt:FieldValue.delete()});return}
  const due=Date.parse(match.date)-reminder.minutes*60000;if(due>clock){tx.update(ref,{matchDate:match.date,remindAt:new Date(due).toISOString()});return}
  const notification=db.collection('notifications').doc('match_'+doc.id),old=await tx.get(notification);if(!old.exists){tx.set(notification,{ownerId:reminder.ownerId,type:'match-reminder',text:match.teamA+' — '+match.teamB+' o‘yini yaqinlashmoqda.',target:'official',matchDate:match.date,read:false,createdAt:stamp});sent++}tx.update(ref,{status:'sent',sentAt:stamp,remindAt:FieldValue.delete()});
 })}return {sent};
}
export default async()=>{try{return Response.json(await sendDueReminders(services().db))}catch{return Response.json({error:'Eslatmalar hozir yuborilmadi.'},{status:503})}};
export const config={schedule:'*/5 * * * *'};
