// Pantry service worker — makes the app installable and work offline.
//
// CRITICAL: never cache Firebase / Firestore / Google traffic, or live sync breaks.
// The fetch handler passes all of that straight through to the network.
//
// Cache strategy:
//   • HTML + firebase-config.js : network-first (so new deploys + new keys show up),
//                                 falling back to the cached copy when offline.
//   • icons / manifest          : cache-first (they rarely change).
//
// Bump CACHE ('pantry-v1' -> 'pantry-v2' ...) any time you want to force every
// phone to drop the old cached shell on next launch.

const CACHE = 'pantry-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function networkFirst(req) {
  return fetch(req)
    .then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {}); return res; })
    .catch(() => caches.match(req));
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Firebase / Firestore / Google CDNs — always go to the network, never cache.
  if (url.hostname.includes('firebase') || url.hostname.includes('firestore') ||
      url.hostname.includes('googleapis') || url.hostname.includes('gstatic') ||
      url.hostname.includes('google')) {
    return; // default browser handling
  }

  // Only manage requests to our own origin.
  if (url.origin !== self.location.origin) return;

  // Config can change when keys are added — always try the network first.
  if (url.pathname.endsWith('/firebase-config.js')) { e.respondWith(networkFirst(req)); return; }

  // App shell / navigations — network-first so deploys appear; cached shell offline.
  if (req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html')) {
    e.respondWith(networkFirst(req).then(r => r || caches.match('./index.html')));
    return;
  }

  // Everything else same-origin (icons, manifest) — cache-first.
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
      return res;
    }))
  );
});
