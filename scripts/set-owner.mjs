import {services} from '../netlify/functions/lib/db.mjs';
const uid=process.argv[2];
if(!uid||!/^[a-zA-Z0-9_-]{1,128}$/.test(uid))throw new Error('Usage: npm run owner -- FIREBASE_USER_UID');
const {auth}=services();const user=await auth.getUser(uid);await auth.setCustomUserClaims(uid,{...user.customClaims,role:'owner'});console.log('Owner role assigned. Sign out and sign in again.');
