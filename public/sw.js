const CACHE = 'temple-v0.7';
const ASSETS_CACHE = 'temple-assets-v0.7';

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(['/'])).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(
        ks.filter((k) => k !== CACHE && k !== ASSETS_CACHE).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // JS/CSS assets have content hashes — cache-first, safe forever
  if (url.pathname.startsWith('/assets/')) {
    e.respondWith(
      caches.open(ASSETS_CACHE).then((cache) =>
        cache.match(e.request).then((cached) => {
          if (cached) return cached;
          return fetch(e.request).then((res) => {
            cache.put(e.request, res.clone());
            return res;
          });
        })
      )
    );
    return;
  }

  // HTML (index.html / navigation) — network-first so deploys take effect immediately
  if (e.request.mode === 'navigate' || url.pathname === '/') {
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, clone));
          return res;
        })
        .catch(() => caches.match('/'))
    );
    return;
  }

  // Everything else — cache-first with network fallback
  e.respondWith(
    caches.match(e.request).then((r) => r || fetch(e.request).catch(() => caches.match('/')))
  );
});
