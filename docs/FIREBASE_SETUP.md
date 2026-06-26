# Firebase Firestore — Setup & Integration

This is the core of the build: replacing the prototype's per-device `localStorage` with a shared, real-time Firestore database so both phones see the same live data.

---

## Part A — Create the Firebase project

> **Note on ownership:** Chris may prefer to own this project under his own Google account so it's his long-term. If so, walk him through these steps or have him create it and hand you the config. Either way, the project is free-tier and costs nothing at this scale.

1. Go to <https://console.firebase.google.com> and click **Add project**. Name it something like `pantry-prefontaine`. Disable Google Analytics (not needed).
2. In the project, go to **Build → Firestore Database → Create database**.
   - Start in **production mode** (we'll set rules below).
   - Pick a region close to Calgary (e.g. `us-west1` or `northamerica-northeast1`).
3. Register a **Web app**: Project settings (gear icon) → **Your apps** → Web (`</>`). Give it a nickname (`pantry-web`). You do **not** need Firebase Hosting checkbox unless you choose to host there. Copy the `firebaseConfig` object it shows you — you'll paste it into the app.

The config looks like this:

```js
const firebaseConfig = {
  apiKey: "AIza…",
  authDomain: "pantry-prefontaine.firebaseapp.com",
  projectId: "pantry-prefontaine",
  storageBucket: "pantry-prefontaine.appspot.com",
  messagingSenderId: "…",
  appId: "1:…:web:…"
};
```

> These keys are not secret in the sensitive sense — Firebase web config is meant to ship in client code. Access is controlled by Firestore **security rules**, below. Still, don't paste them into a public chat; keep them in the repo only.

---

## Part B — Firestore security rules

Because there's no login, we use a simple shared model. For a two-person private household tool, the pragmatic options are:

**Option 1 (simplest — open read/write to the one collection).** Acceptable for a private, unadvertised URL with a low-value dataset (a grocery list). Risk: anyone who discovers the project ID could read/write the grocery list. Low stakes, but not zero.

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /items/{itemId} {
      allow read, write: if true;
    }
  }
}
```

**Option 2 (recommended — shared secret).** Require a known value so random traffic can't write. Simplest version: anonymous auth (Firebase signs every device in invisibly, no user-facing login) and restrict to signed-in requests.

1. In Firebase: **Build → Authentication → Get started → Sign-in method → Anonymous → Enable.**
2. In the app, after init, call `signInAnonymously(auth)` once on load before reading/writing.
3. Rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /items/{itemId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**Recommendation:** Use **Option 2**. It's barely more code (a single `signInAnonymously` call) and keeps anonymous internet traffic out without ever showing Chris or Carmyn a login screen. Document whichever you ship.

Publish rules in the Firestore **Rules** tab.

---

## Part C — Wire it into the app

The prototype keeps all items in an in-memory array called `items`, and the render functions read from it. Your job: keep that pattern, but make `items` a mirror of Firestore that updates live.

### C.1 Add the Firebase SDK (modular, via CDN — no build step)

In the app, before your main script, use the modular SDK from the CDN so there's no npm/bundler:

```html
<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
  import { getFirestore, collection, doc, setDoc, deleteDoc, onSnapshot, getDocs, writeBatch }
    from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
  import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

  const firebaseConfig = { /* paste from Part A */ };
  const fbApp = initializeApp(firebaseConfig);
  const db = getFirestore(fbApp);
  const auth = getAuth(fbApp);

  // expose what the app script needs
  window.PantryDB = { db, collection, doc, setDoc, deleteDoc, onSnapshot, getDocs, writeBatch };
  window.PantryAuth = { auth, signInAnonymously };
</script>
```

> The existing app script is a normal (non-module) `<script>`. The cleanest approach: convert the app logic to run after auth + first snapshot resolve. Either move the app code into the module above, or have the module call a global `bootPantry()` defined in the classic script once data is ready. Pick whichever is cleaner; document it.

### C.2 Replace `load()` / `save()`

**Current prototype (localStorage):**
```js
function load(){ /* reads pantry_v2 from localStorage */ }
function save(){ localStorage.setItem('pantry_v2', JSON.stringify(items)); }
```

**New model:**

- `items` is still the in-memory array the renderers read.
- A real-time `onSnapshot` listener on the `items` collection keeps `items` in sync with Firestore and re-renders on any change (including changes from the other phone).
- Instead of one big `save()` that writes the whole array, **write per-item** when something changes (add, edit, toggle on/off list, check off, qty change, delete). This is cheaper and avoids clobbering the other device's concurrent edits.

Replacement pattern:

```js
const itemsCol = window.PantryDB.collection(db, 'items');

// 1. Live listener — keeps in-memory `items` fresh, re-renders on any change
function startSync(){
  window.PantryDB.onSnapshot(itemsCol, (snap) => {
    items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    render();              // existing top-level render dispatcher
    updateListCount();     // existing badge updater
  });
}

// 2. Write one item (add or update) — call this wherever the prototype called save() after changing ONE item
async function persistItem(item){
  await window.PantryDB.setDoc(window.PantryDB.doc(db, 'items', item.id), stripId(item));
}
function stripId(i){ const { id, ...rest } = i; return rest; }

// 3. Delete one item
async function removeItem(id){
  await window.PantryDB.deleteDoc(window.PantryDB.doc(db, 'items', id));
}
```

Then update the action functions. Each spot in the prototype that mutates an item and calls `save()` becomes a `persistItem(thatItem)` call. Examples of the functions to update (names from the prototype):

- `toggleList(id)` / `searchAdd(id)` — set `onList`, then `persistItem`.
- `toggleCheck(id)` — set `checked`, and on restock set `onList=false`, then `persistItem`. (The Undo path re-sets and persists.)
- `stepQty(id, d)` — change `qty`, then `persistItem`.
- `saveItem()` — for a new product, build the object and `persistItem`; for an edit, mutate and `persistItem`.
- `deleteItem()` — `removeItem(editingId)`.
- `listToggleFromSheet()` — mutate then `persistItem`.

Because the `onSnapshot` listener re-renders on every change, you can often **drop the explicit `render()` calls** that followed `save()` in the prototype — the listener handles it. But leaving an optimistic local `render()` in for snappiness is fine; the snapshot will reconcile. Document your choice.

### C.3 IDs

The prototype generates ids with `uid()`. Keep using those as the Firestore **document id** (`setDoc(doc(db,'items', item.id), …)`). That keeps the existing id references intact. Alternatively use `addDoc` and let Firestore assign ids — but then you must update the in-memory id handling. Keeping `uid()` is the lower-risk path.

---

## Part D — Seeding the 131 items (once)

The prototype already contains the full seed as a JS array named `SEED` (≈131 objects). On first run against an **empty** Firestore collection, write them all. Guard against re-seeding.

```js
async function seedIfEmpty(){
  const snap = await window.PantryDB.getDocs(itemsCol);
  if (!snap.empty) return;                 // already seeded — do nothing
  const batch = window.PantryDB.writeBatch(db);
  SEED.forEach(s => {
    const id = uid();
    const ref = window.PantryDB.doc(db, 'items', id);
    batch.set(ref, {
      name: s.name, store: s.store, routing: s.routing,
      dept: s.dept || 'General', detail: s.detail || '', note: '',
      qty: 1, onList: false, checked: false
    });
  });
  await batch.commit();
}
```

**Boot order:**
```js
async function boot(){
  await window.PantryAuth.signInAnonymously(window.PantryAuth.auth); // if using Option 2 rules
  await seedIfEmpty();   // runs real work only on the very first launch ever
  startSync();           // begins live updates + first render
}
boot();
```

> After the first successful launch the collection is populated, so `seedIfEmpty` short-circuits forever after. If Chris ever wants to wipe and re-seed, he deletes the `items` collection in the Firebase console and reloads.

---

## Part E — Offline (nice-to-have, not required)

Firestore can cache offline so the app still reads when there's no signal:

```js
import { enableIndexedDbPersistence } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
enableIndexedDbPersistence(db).catch(()=>{ /* multiple tabs or unsupported — safe to ignore */ });
```

This is a bonus. If it adds friction, skip it — the acceptance criteria only require that the app *opens and shows last-synced data* offline, which the service-worker cache + Firestore memory cache largely cover.

---

## Part F — Cost reality

Two users, ~150 documents, a handful of reads/writes per shopping trip. This sits far inside Firestore's free **Spark** plan (50k reads, 20k writes, 1 GiB storage per day). No billing setup required. If Chris ever sees a quota prompt, something is looping — check the seed guard.
