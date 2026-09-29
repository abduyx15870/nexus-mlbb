import vm from 'node:vm';import fs from 'node:fs/promises';import path from 'node:path';
const cache=new Map();async function get(file){file=path.resolve(file);if(cache.has(file))return cache.get(file);const m=new vm.SourceTextModule(await fs.readFile(file,'utf8'),{identifier:file});cache.set(file,m);return m}
const main=await get('public/js/app.js');await main.link((spec,parent)=>{if(!spec.startsWith('.'))throw new Error('Unexpected static import: '+spec);return get(path.resolve(path.dirname(parent.identifier),spec))});console.log('ES modules linked successfully');
