import {refreshSources} from './lib/updater.mjs';
export default async()=>{try{await refreshSources()}catch(e){console.error('NEXUS scheduled refresh failed:',e.message)}};
export const config={schedule:'0 */6 * * *'};
