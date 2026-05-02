
const CACHE_NAME = "AUDIT ANGGARAN REPUBLIK INDONESIA (OPEN SOURCE)";
const URLS_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./service-worker.js",
  // favicon/icon external (may or may not be cachable depending on CORS)
  "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjPSYbGbqqmiyhQBECCR60-2HeqYLl_d3PdT8SCSM44h4S7IVvxM8QqeBt1u2G6nj6uSUbDVhVNVqutHbs22zHX1ZKAFDX0w6wIPFDpC8hmw1gkICe19Xxa8U_incAcBnDieoDJa0v0Lik8DK7pk080NcF2dYALJog0nvKhIXFPxgc5RVJP5Qu85f7Qh14/s1600/android-chrome-192x192.png",
  // app iframe URLs (may be rejected by remote server for caching)
  "https://nemesis.assai.id/?refresh=1",
  "https://nemesis.assai.id/?refresh=1"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(URLS_TO_CACHE.map(url => new Request(url, {mode: 'no-cors'})))
        .catch(err => {
          // Some cross-origin requests may fail due to CORS - that's expected.
          console.warn("Some resources failed to cache (likely cross-origin/CORS):", err);
          return Promise.resolve();
        });
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map(k => {
        if (k !== CACHE_NAME) return caches.delete(k);
      }));
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // Try cache first, then network
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).catch(err => {
        // network failed
        return new Response('<h1>Offline</h1><p>Content is not available offline.</p>', {
          headers: { 'Content-Type': 'text/html' }
        });
      });
    })
  );
});
