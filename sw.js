/* Studio Tefi — mode hors connexion (cache de l'application, jamais des données GitHub) */
const CACHE='studio-tefi-v4';
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(['./','./index.html'])).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;const url=new URL(req.url);
  if(url.hostname.includes('github'))return;
  if(req.mode==='navigate'){e.respondWith(fetch(req).then(r=>{const cp=r.clone();caches.open(CACHE).then(c=>c.put('./index.html',cp));return r;}).catch(()=>caches.match('./index.html')));return;}
  if(url.origin===location.origin||url.hostname.endsWith('fonts.googleapis.com')||url.hostname.endsWith('fonts.gstatic.com')){
    e.respondWith(caches.match(req).then(hit=>{const net=fetch(req).then(r=>{if(r&&r.status===200){const cp=r.clone();caches.open(CACHE).then(c=>c.put(req,cp));}return r;}).catch(()=>hit);return hit||net;}));}
});
