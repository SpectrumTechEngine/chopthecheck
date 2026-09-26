// Chop the Check service worker.
// The page itself is fetched fresh whenever there's internet, so new versions
// uploaded to GitHub show up straight away. The cached copy is only a fallback.
const CACHE = "chopthecheck-v3";
const SHELL = ["./", "index.html", "manifest.webmanifest", "ste-logo.png",
  "icon-192.png", "icon-512.png", "apple-touch-icon.png", "favicon-32.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Firebase's code files never change for a given version, so keep a copy.
  if (url.hostname === "www.gstatic.com" && url.pathname.startsWith("/firebasejs/")) {
    e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((res) => {
      const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); return res;
    })));
    return;
  }
  if (url.origin !== location.origin) return; // leave the live database alone

  // Our own files: try the internet first, fall back to the saved copy.
  e.respondWith(fetch(req).then((res) => {
    const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); return res;
  }).catch(() => caches.match(req).then((hit) => hit || caches.match("index.html"))));
});
