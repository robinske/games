// Offline support for Spider Solitaire.
// The page itself is fetched fresh whenever the phone is online (falling back to the saved copy
// offline), so updates show up on the next launch. Other files are served from the cache and
// refreshed in the background.
const CACHE = 'spider-v2';
const FILES = ['./', 'index.html', 'three.min.js', 'manifest.webmanifest', 'icon-180.png', 'icon-192.png', 'icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE)
    .then(c => c.addAll(FILES.map(f => new Request(f, { cache: 'reload' }))))
    .then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

function fromNetwork(req, cache) {
  return fetch(req, { cache: 'no-cache' }).then(res => {
    if (res && res.ok) cache.put(req, res.clone());
    return res;
  });
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const isPage = req.mode === 'navigate';
  e.respondWith(caches.open(CACHE).then(async cache => {
    if (isPage) {
      // Network first, but don't keep a slow connection waiting more than 3 seconds.
      const net = fromNetwork(req, cache).catch(() => null);
      const timeout = new Promise(r => setTimeout(() => r(null), 3000));
      const res = await Promise.race([net, timeout]);
      if (res && res.ok) return res;
      return (await cache.match(req, { ignoreSearch: true })) || (await cache.match('index.html')) || (await net) || Response.error();
    }
    const cached = await cache.match(req, { ignoreSearch: true });
    const fresh = fromNetwork(req, cache).catch(() => null);
    if (cached) { e.waitUntil(fresh); return cached; }
    return (await fresh) || Response.error();
  }));
});
