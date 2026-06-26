# Kanban — One-Time Setup

Two short jobs, both free:

1. **Go live** — put the app on the internet (GitHub Pages).
2. **Turn on shared sync** — so both phones share one live list (Firebase).

You can do #1 first and start using the app in single-device mode immediately, then do #2 whenever.

---

## 1. Go live (GitHub Pages)

The repo already includes an auto-deploy workflow (`.github/workflows/deploy.yml`). You just have to
switch Pages on once:

1. Merge this app into the **main** branch (merge the pull request that shipped it).
2. In the repo on GitHub: **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **GitHub Actions**.
4. That's it. Every time `main` changes, the app rebuilds and redeploys in about a minute.
5. Your live address appears on that same Pages screen — it'll look like:
   **https://stophoto.github.io/Kanban/**

Open that link on your iPhone in **Safari** and follow the install steps in [README.md](README.md).

> Prefer the simpler "Deploy from a branch" option? That works too: **Settings → Pages → Source:
> Deploy from a branch → `main` / `root`**. The included workflow is just the more modern, hands-off
> way. Either is fine.

At this point the app works, but the sync dot says **THIS DEVICE** — each phone keeps its own copy.
Do step 2 to make them share.

---

## 2. Turn on shared sync + private login (Firebase) — ~5 minutes, free

This makes Chris's phone and Carmyn's phone show the **same live list**, and locks that list to
just your two Google accounts so no one else can get in.

### 2a. Create the Firebase project
1. Go to **https://console.firebase.google.com** and click **Add project**.
   - Sign in with the Google account you want to **own** this long-term (Chris's is fine).
   - Name it something like `kanban-prefontaine`.
   - Turn **off** Google Analytics (not needed). Create the project.

### 2b. Create the database
2. In the left menu: **Build → Firestore Database → Create database**.
   - Choose **Start in production mode** (we set the rules in 2e).
   - Pick a location close to Calgary — **`northamerica-northeast1`** (Montréal) or **`us-west1`**.

### 2c. Turn on Google sign-in
3. **Build → Authentication → Get started → Sign-in method:**
   - Click **Google**, toggle **Enable**, choose a **Project support email** (Chris's), and **Save**.
   - Then open the **Settings** tab → **Authorized domains** → **Add domain**, and add your live
     site's domain: **`stophoto.github.io`**. (Leave `localhost` there too.)
   - ⚠️ Without that authorized domain, Google sign-in will refuse to run on the published app.
   - The app only lets **carmyn.pre@gmail.com** and **prefontainech@gmail.com** in — that list lives
     in `index.html` (`ALLOWED`) and is enforced by `firestore.rules` (next steps).

### 2d. Get your keys
4. Click the gear icon → **Project settings → Your apps → Web** (the `</>` icon).
   - Nickname it `pantry-web`. **Don't** check "Firebase Hosting." Click **Register app**.
   - Firebase shows you a `firebaseConfig` block. Keep it on screen for the next step.

### 2e. Paste the keys into the app
5. In this repo, open **`firebase-config.js`** (Edit ✏️ on GitHub) and copy each value from the
   Firebase screen into the matching field. It should end up looking like:

   ```js
   export const firebaseConfig = {
     apiKey:            "AIzaSy...your-real-key...",
     authDomain:        "kanban-prefontaine.firebaseapp.com",
     projectId:         "kanban-prefontaine",
     storageBucket:     "kanban-prefontaine.appspot.com",
     messagingSenderId: "1234567890",
     appId:             "1:1234567890:web:abc123..."
   };
   ```
   Commit the change to **main**. The app auto-redeploys.

### 2f. Publish the security rules
6. Back in Firebase: **Firestore Database → Rules**. Replace what's there with the contents of this
   repo's **`firestore.rules`** file, then click **Publish**. These rules only allow the two Google
   accounts listed in the file — the same two as the app's `ALLOWED` list. (If you change who has
   access, update the emails in **both** `firestore.rules` and `index.html`, then re-publish.)

### 2g. First sign-in seeds your 131 items
7. Open the live app, tap **Continue with Google**, and sign in with one of the two allowed Gmail
   accounts. On that first sign-in to an empty database it writes your **131 starter items**
   automatically (then never again). The sync dot turns **SYNCED**.

> Already opened the app in single-device mode before this? Each phone had its own local copy. After
> sync is on, the shared Firestore list is the source of truth — just use the app normally from here.

---

## 3. Check that sync works

1. Open the app on two phones (or two browser windows) and sign in on each with an allowed account.
2. On phone A, tap an item onto the Shopping list → it appears on phone B within ~2 seconds.
3. On phone B, check it off → it disappears on both.
4. Change an item's quantity on A → the **N BUY** badge updates on B.

If all four work, you're done. 🎉

---

## Good to know

- **Cost:** Two people and ~150 items sit far inside Firebase's free tier (50k reads / 20k writes a
  day). You won't be billed. If Firebase ever warns about quota, something is looping — tell whoever
  maintains the app.
- **Start empty instead of 131 items?** Don't want the seeded list? Before step 2g, delete the seed
  block isn't necessary — just delete the `items` collection in Firebase any time and add your own
  with **+ NEW**. The seed only runs when the collection is completely empty.
- **Wipe and re-seed:** delete the `items` collection in the Firebase console, then reload the app —
  it re-seeds the original 131.
- **New phone / new person:** just open the live link in Safari and Add to Home Screen. Same list.
- **Swap the icon later:** drop a new `icon-192.png` and `icon-512.png` into `icons/` (same names),
  commit to main. Keep them square.
- **Forced refresh after a big change:** bump `pantry-v1` → `pantry-v2` in `sw.js` (see README).
