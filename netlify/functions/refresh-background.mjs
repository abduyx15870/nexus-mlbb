import {verifyRefresh} from './lib/refresh-dispatch.mjs';
import {refreshSources} from './lib/updater.mjs';

export const config={background:true};
export default async request=>{
  if(request.method!=='POST')return new Response(null,{status:405});
  const body=await request.text();
  if(body.length>2048||!verifyRefresh(body,request.headers.get('X-Nexus-Refresh')))return new Response(null,{status:403});
  try{await refreshSources()}catch(e){console.error('NEXUS background refresh:',e.message)}
  return new Response(null,{status:200});
};
