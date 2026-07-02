/* The House · service worker — network-first, quiet offline memory */
const C = "house-v1";
self.addEventListener("install", e => {
  e.waitUntil(caches.open(C).then(c => c.addAll(["index.html","map.html","insights.html"]).catch(()=>{})).then(()=>self.skipWaiting()));
});
self.addEventListener("activate", e => { e.waitUntil(self.clients.claim()); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request).then(r => {
      try { if (e.request.url.startsWith(self.location.origin)) { const cl = r.clone(); caches.open(C).then(c => c.put(e.request, cl)); } } catch(_){}
      return r;
    }).catch(() => caches.match(e.request).then(m => m || caches.match("index.html")))
  );
});
