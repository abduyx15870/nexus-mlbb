import {getApps,initializeApp,cert} from 'firebase-admin/app';
import {getAuth} from 'firebase-admin/auth';
import {getFirestore,FieldValue} from 'firebase-admin/firestore';
import {getStorage} from 'firebase-admin/storage';
export const OWNER_UID='4R73sZiJTMVt6Vg3dF0jYzKb66V2';
export class HttpError extends Error{constructor(status,message){super(message);this.status=status}}
export function services(){if(!getApps().length){let credentials;try{credentials=JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT||'null')}catch{throw new HttpError(503,'Serverdagi Firebase sozlamasi yaroqsiz.')}if(!credentials)throw new HttpError(503,'Firebase server ulanishi hali sozlanmagan.');if(credentials.project_id!=='nexus-mlbb')throw new HttpError(503,'Firebase loyiha mos emas.');initializeApp({credential:cert(credentials),storageBucket:'nexus-mlbb.firebasestorage.app'})}return {db:getFirestore(),auth:getAuth(),storage:getStorage()}}
export async function identity(request,required=false){const token=request.headers.get('authorization')?.match(/^Bearer (.+)$/)?.[1];if(!token){if(required)throw new HttpError(401,'Avval hisobingizga kiring.');return null}try{const {auth,db}=services();const u=await auth.verifyIdToken(token,true);const status=await db.collection('accountStatus').doc(u.uid).get();if(status.data()?.suspended&&u.uid!==OWNER_UID)throw new HttpError(403,'Hisob vaqtincha to‘xtatilgan.');if(u.uid===OWNER_UID){if(u.role!=='owner'){const account=await auth.getUser(u.uid);await auth.setCustomUserClaims(u.uid,{...account.customClaims,role:'owner'})}u.role='owner'}return u}catch(e){if(e.status)throw e;throw new HttpError(401,'Sessiya tugagan. Qayta kiring.')}}
export const now=()=>new Date().toISOString();
export const id=v=>{if(typeof v!=='string'||! /^[a-zA-Z0-9_-]{1,128}$/.test(v))throw new HttpError(400,'ID yaroqsiz.');return v};
export const str=(v,max=3000)=>{if(typeof v!=='string')return '';return v.trim().slice(0,max)};
export const num=(v,min=0,max=100000)=>{const n=Number(v);if(!Number.isFinite(n)||n<min||n>max)throw new HttpError(400,'Son ruxsat etilgan chegaradan tashqarida.');return n};
export const requireFields=(o,ks)=>{for(const k of ks)if(o[k]===undefined||o[k]===null||o[k]==='')throw new HttpError(400,`${k}: qiymat kiriting.`)};
export const isAdmin=u=>['owner','admin'].includes(u?.role);
export function allowRole(u,roles){if(!u||!['owner','admin',...roles].includes(u.role))throw new HttpError(403,'Bu amal uchun huquq yo‘q.')}
export async function limited(u,key,max=20,seconds=60){const {db}=services();const bucket=Math.floor(Date.now()/(seconds*1000));const ref=db.collection('rateLimits').doc(`${u.uid}_${key}_${bucket}`);await db.runTransaction(async t=>{const d=await t.get(ref);if((d.data()?.count||0)>=max)throw new HttpError(429,'So‘rovlar chegarasiga yetdingiz. Biroz kuting.');t.set(ref,{count:(d.data()?.count||0)+1,expiresAt:new Date((bucket+2)*seconds*1000)})})}
export async function notify(uid,type,text,target=''){if(!uid)return;const {db}=services();await db.collection('notifications').add({ownerId:uid,type,text,target,read:false,createdAt:now()})}
export async function audit(u,action,target){await services().db.collection('audit').add({actorId:u.uid,action,target,createdAt:now()})}
export function publicProfile(d){const {id,uid,nickname,bio,rank,mainRole,favoriteHero,avatar,cover,level=1,xp=0,achievements=[],createdAt}=d;return {role:(id||uid)===OWNER_UID?'owner':d.role||'user',id:id||uid,uid:id||uid,nickname,bio,rank,mainRole,favoriteHero,avatar,cover,level,xp,achievements,createdAt}}
export async function award(uid,amount,badge){const ref=services().db.collection('profiles').doc(uid);await services().db.runTransaction(async t=>{const p=await t.get(ref);const d=p.data()||{};const xp=(d.xp||0)+amount;t.set(ref,{xp,level:Math.min(100,1+Math.floor(xp/250)),...(badge?{achievements:[...new Set([...(d.achievements||[]),badge])]}:{})},{merge:true})})}
export {FieldValue};
