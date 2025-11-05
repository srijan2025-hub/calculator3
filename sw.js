// Offline cache for /calculator3/
const CACHE_NAME = "calc3-cache-v1";

const ASSETS = [
  "/calculator3/",
  "/calculator3/index.html",
  "/calculator3/manifest.webmanifest",
  "/calculator3/sw.js",
  "/calculator3/icons/icon-192.png",
  "/calculator3/icons/icon-512.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => (k === CACHE_NAME ? null : caches.delete(k))))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request)
        .then(resp => {
          const copy = resp.clone();
          caches.open(CACHE_NAME).then(c => c.put(e.request, copy));
          return resp;
        })
        .catch(() => caches.match("/calculator3/index.html"));
    })
  );
});
