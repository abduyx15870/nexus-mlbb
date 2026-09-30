import {spawnSync} from 'node:child_process';
for(const file of ['scripts/cache-equipment-images.mjs','scripts/generate-seo.mjs','scripts/check.mjs']){const result=spawnSync(process.execPath,[file],{stdio:'inherit'});if(result.status!==0)process.exit(result.status||1)}console.log('NEXUS static frontend and Netlify Functions ready.');
