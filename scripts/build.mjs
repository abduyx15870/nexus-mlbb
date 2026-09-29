import {spawnSync} from 'node:child_process';
const check=spawnSync(process.execPath,['scripts/check.mjs'],{stdio:'inherit'});if(check.status!==0)process.exit(check.status||1);console.log('NEXUS static frontend and Netlify Functions ready.');
