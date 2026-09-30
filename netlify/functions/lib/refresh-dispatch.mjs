import {createHmac,randomUUID,timingSafeEqual} from 'node:crypto';
import {HttpError} from './db.mjs';

function signature(body){
  const secret=process.env.FIREBASE_SERVICE_ACCOUNT;
  if(!secret)throw new HttpError(503,'Firebase server ulanishi sozlanmagan.');
  return createHmac('sha256',secret).update(body).digest('hex');
}

export function verifyRefresh(body,provided){
  if(typeof provided!=='string'||! /^[a-f0-9]{64}$/.test(provided))return false;
  let event;
  try{event=JSON.parse(body)}catch{return false}
  if(!Number.isFinite(event.timestamp)||Math.abs(Date.now()-event.timestamp)>300000)return false;
  return timingSafeEqual(Buffer.from(provided,'hex'),Buffer.from(signature(body),'hex'));
}

export async function queueRefresh(trigger='admin'){
  const base=new URL(process.env.URL||'https://nexus-mlbb.netlify.app');
  if(base.protocol!=='https:'||!base.hostname.endsWith('.netlify.app'))throw new HttpError(503,'Netlify URL sozlamasi yaroqsiz.');
  const body=JSON.stringify({timestamp:Date.now(),nonce:randomUUID(),trigger});
  const response=await fetch(new URL('/.netlify/functions/refresh-background',base),{
    method:'POST',headers:{'Content-Type':'application/json','X-Nexus-Refresh':signature(body)},body,
    signal:AbortSignal.timeout(9000)
  });
  if(!response.ok)throw new HttpError(502,'Fon yangilash ishga tushmadi ('+response.status+'). Netlify deployni tekshiring.');
  return {queued:true,status:'queued'};
}
