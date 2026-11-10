const C='kt-v1';
self.addEventListener('install',e=>{self.skipWaiting();
  e.waitUntil(caches.open(C).then(c=>Promise.all(['./','index.html','data.json'].map(u=>c.add(u).catch(()=>{})))))});
self.addEventListener('activate',e=>e.waitUntil(clients.claim()));
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url),same=u.origin===location.origin,font=/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname);
  if(!same&&!font)return;
  const keep=n=>{if(n.ok||n.type==='opaque'){const k=n.clone();caches.open(C).then(c=>c.put(r,k))}};
  if(font||/\/img\//.test(u.pathname)){            // gambar & font: pakai salinan lokal, perbarui di latar belakang
    e.respondWith(caches.match(r).then(m=>{const f=fetch(r).then(n=>{keep(n);return n}).catch(()=>m);return m||f}));
  }else{                                            // halaman & data: utamakan jaringan, cadangan salinan lokal
    e.respondWith(fetch(r).then(n=>{keep(n);return n}).catch(()=>caches.match(r)));
  }
});
