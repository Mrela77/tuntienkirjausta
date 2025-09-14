const CACHE = 'yritys-cache-v1';
const ASSETS = [
  'yritys.html',
  'yrityksen-tiedot.html',
  'tyontekijat.html',
  'tuntihallinta.html',
  'raportit.html',
  'manifest.webmanifest'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(()=> self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => k!==CACHE && caches.delete(k)))).then(()=> self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  e.respondWith(
    caches.match(req).then(res => res || fetch(req).then(r=>{
      // dynaaminen välimuisti
      const copy = r.clone();
      caches.open(CACHE).then(c=> c.put(req, copy)).catch(()=>{});
      return r;
    }).catch(()=> caches.match('yritys.html')))
  );
});