import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import * as page from '../netlify/functions/lib/seo-page.mjs';
const root=new URL('../',import.meta.url),read=path=>fs.readFile(new URL(path,root),'utf8');
const heroes=JSON.parse(await read('public/data/heroes.json'));
for(const hero of heroes){const html=await read(`public/guide/heroes/${hero.id}/index.html`);assert(html.includes(hero.passiveGuide.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;')));assert(html.includes(`<link rel="canonical" href="${page.SITE}/guide/heroes/${hero.id}/">`));assert(html.includes('lang="uz"'));assert(!html.includes('NEXUS ochilmoqda'))}
const itemPage=await read('public/guide/items/index.html');assert(itemPage.includes('Warrior Boots'));assert(itemPage.includes('Jangchi etiklari'));const paths=JSON.parse(await read('public/data/seo-paths.json'));assert.equal(new Set(paths).size,138);assert(paths.every(path=>path.startsWith('/')&&!path.includes('#')));assert((await read('public/robots.txt')).includes('/sitemap.xml'));
const news={public:{title:'Haqiqiy yangilik',published:true,summary:'<script>alert(1)</script>',sourceUrl:'https://www.mobilelegends.com/'},draft:{title:'Maxfiy qoralama',published:false}};
const db={collection:kind=>({where(){return this},limit(){return this},async get(){return {docs:kind==='news'?[{id:'public',data:()=>news.public}]:[{id:'build-1',data:()=>({name:'Build',hero:'aamon',items:['warrior-boots'],description:'Sinash mumkin.'})}]}},doc:id=>({async get(){return {exists:!!news[id],data:()=>news[id]}}})})};
const context=vm.createContext({URL,Response,console}),cache=new Map();
function synthetic(name,exports){const module=new vm.SyntheticModule(Object.keys(exports),function(){for(const [key,value]of Object.entries(exports))this.setExport(key,value)},{context});cache.set(name,module);return module}
synthetic('./lib/db.mjs',{services:()=>({db})});synthetic('./lib/seo-page.mjs',page);synthetic('node:fs/promises',await import('node:fs/promises'));
const url=new URL('netlify/functions/seo.mjs',root).href;const module=new vm.SourceTextModule(await read('netlify/functions/seo.mjs'),{context,identifier:url,initializeImportMeta:meta=>meta.url=url});await module.link(spec=>cache.get(spec));await module.evaluate();
const call=path=>module.namespace.default({url:'https://nexus-mlbb.netlify.app/.netlify/functions/seo?path='+encodeURIComponent(path)});
const draft=await call('/guide/news/draft/');assert.equal(draft.status,404);const result=await call('/guide/news/public/');assert.equal(result.status,200);const html=await result.text();assert(html.includes('&lt;script&gt;'));assert(!html.includes('<script>alert'));const sitemap=await call('/sitemap.xml');assert.equal(sitemap.status,200);const xml=await sitemap.text();assert(xml.includes(page.SITE+'/guide/news/public/'));assert(xml.includes(page.SITE+'/guide/build/build-1/'));assert(!xml.includes('/draft/'));assert.equal((await call('/guide/news/../../')).status,404);
console.log('OK: 132 static hero guides; translated equipment catalogue; clean canonicals; sitemap includes public news/builds; drafts excluded; HTML escaped; Netlify rewrite path works.');
