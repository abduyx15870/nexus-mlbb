import {queueRefresh} from './lib/refresh-dispatch.mjs';
export default async()=>{try{await queueRefresh('schedule')}catch(e){console.error('NEXUS scheduled refresh failed:',e.message)}};
export const config={schedule:'0 */6 * * *'};
