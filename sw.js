const C='sauerteig-v34',F=['./','index.html','styles.css','app.js','i18n.js','extra-breads.js','hanz.js','voice.js','manifest.webmanifest','icon.svg','icon-192.png','icon-512.png','badge-96.png','apple-touch-icon.png','datenschutz.html'];
// Jede Datei einzeln speichern: fehlt eine, darf das nicht das ganze Update blockieren
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>Promise.all(F.map(f=>c.add(f).catch(()=>{})))));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(u.origin!==location.origin||e.request.method!=='GET')return;
e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));return r}).catch(()=>caches.match(e.request)))});
self.addEventListener('notificationclick',e=>{e.notification.close();const done=e.action==='done';
e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(l=>{
if(l.length){if(done)l[0].postMessage({type:'done'});return l[0].focus()}
return clients.openWindow(done?'./?done=1':'./')}))});
self.addEventListener('push',e=>{let d={};try{d=e.data.json()}catch{}
e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(l=>{
if(l.some(c=>c.visibilityState==='visible'))return; // App offen: sie meldet sich selbst
const ac=d.kind==='end'?[{action:'done',title:(self.navigator.language||'de').startsWith('de')?'Erledigt':'Done'}]:[];
return self.registration.showNotification(d.title||'LilDough',{actions:ac,data:{kind:d.kind||null},body:d.body||'',icon:new URL('icon-192.png',self.registration.scope).href,badge:new URL('badge-96.png',self.registration.scope).href,tag:'step',renotify:true,requireInteraction:true,vibrate:[300,150,300,150,300]})}))});


