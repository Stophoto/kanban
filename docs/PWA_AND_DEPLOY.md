# PWA & Deployment

Two goals: make the app **installable to the iPhone home screen** (full-screen, with an icon, offline-capable), and **deploy it to a live HTTPS URL** (required for Firestore + service workers).

---

## Part A — Web App Manifest

Create `manifest.webmanifest` next to the HTML:

```json
{
  "name": "Pantry",
  "short_name": "Pantry",
  "description": "Household replenishment list for Chris & Carmyn",
  "start_url": "./index.html",
  "scope": "./",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#FFFFFF",
  "theme_color": "#FFFFFF",
  "icons": [
    { "src": "icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "icons/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

Link it in `<head>` (the prototype already has the theme-color and apple-web-app meta tags — keep them):

```html
<link rel="manifest" href="manifest.webmanifest">
<link rel="apple-touch-icon" href="icons/icon-192.png">
```

### Icons

Make two PNGs: `icons/icon-192.png` and `icons/icon-512.png`.

**Placeholder (fine for v1):** a teal `#36B3AF` rounded square with a bold white "P" (Montserrat 800), centered. You can generate these with a few lines of Python (PIL) or any image tool. The maskable version should keep the "P" within the safe center ~80% so iOS/Android masking doesn't clip it.

**Later:** Chris can supply a Fratello-branded icon (the LL mark or a custom Pantry mark). Leave the filenames stable so swapping is a drop-in.

---

## Part B — Service Worker (installability + offline shell)

iOS requires a registered service worker for true home-screen app behavior and offline loading. Create `sw.js`:

```js
const CACHE = 'pantry-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  // Never cache Firebase/Firestore/Google traffic — always go to network so sync works.
  if (url.hostname.includes('firebase') || url.hostname.includes('firestore') ||
      url.hostname.includes('googleapis') || url.hostname.includes('gstatic')) {
    return; // let the browser handle it normally
  }
  // App shell: cache-first, fall back to network.
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request))
  );
});
```

> **Critical:** the fetch handler must NOT cache or intercept Firebase/Firestore/googleapis/gstatic requests, or live sync breaks. The guard above passes those straight through.

Register it from the app (in the main script, after load):

```js
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(console.error);
  });
}
```

**Bumping the cache:** when you deploy a new version of the HTML, change `CACHE = 'pantry-v1'` to `'pantry-v2'` etc., so the old shell is cleared. Note this in the README so Chris knows why.

---

## Part C — Deploy to GitHub Pages

Chris uses GitHub, so this is the default. (Firebase Hosting is a fine alternative — see Part D.)

1. Create a repo, e.g. `pantry`. Put the app at the repo root:
   ```
   index.html               (the converted app — rename pantry-prototype.html to this)
   app.js / styles.css       (only if you split them; single-file index.html is fine)
   manifest.webmanifest
   sw.js
   icons/icon-192.png
   icons/icon-512.png
   README.md                 (the non-technical one for Chris)
   ```
2. Commit and push to `main`.
3. Repo **Settings → Pages → Build and deployment → Source: Deploy from a branch → `main` / `root` → Save.**
4. Wait ~1 minute. The URL appears: `https://<chris-username>.github.io/pantry/`.
5. Open that URL on the iPhone in **Safari** (not Chrome — iOS only installs PWAs from Safari).

### Path note
GitHub Pages serves the repo at a subpath (`/pantry/`). All asset paths in the manifest, service worker, and HTML are written **relative** (`./…`) above so they work under that subpath. If you hardcode absolute paths (`/icons/…`), they'll 404 on Pages — keep everything relative.

---

## Part D — Alternative: Firebase Hosting

Since the app already depends on Firebase, hosting it there keeps everything in one place and serves from the domain root (no subpath issue):

```
npm install -g firebase-tools     # one-time, on your machine
firebase login
firebase init hosting             # pick the existing project, public dir = the folder with index.html, single-page app = No
firebase deploy
```

Gives `https://pantry-prefontaine.web.app`. Either host is fine — **document which one you chose** and put that URL in the README. GitHub Pages is the default ask because Chris already lives in GitHub.

---

## Part E — Installing on iPhone (for the README)

For Chris and Carmyn, each on their own phone:

1. Open the live URL in **Safari**.
2. Tap the **Share** button (square with an up arrow).
3. Scroll down, tap **Add to Home Screen**.
4. Name it "Pantry", tap **Add**.
5. Launch it from the home-screen icon — it opens full-screen like a native app.

Both phones installed this way talk to the same Firestore, so they share one live list.

---

## Part F — Deploy checklist

- [ ] App renamed to `index.html` at repo root, all paths relative.
- [ ] `firebaseConfig` pasted in and Firestore rules published.
- [ ] `manifest.webmanifest` linked; icons present at the referenced paths.
- [ ] `sw.js` registered; Firebase/gstatic traffic excluded from caching.
- [ ] Pushed to `main`; GitHub Pages enabled on `main`/root (or Firebase Hosting deployed).
- [ ] Live HTTPS URL loads on desktop.
- [ ] On iPhone Safari: Add to Home Screen installs with icon; launches full-screen.
- [ ] Two-device sync verified (see acceptance criteria in the build brief).
