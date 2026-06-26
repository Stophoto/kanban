# Kanban

A shared grocery & replenishment list for **Chris & Carmyn** — two phones, one live list.
Named for the Japanese *kanban* method: a card moves from "stocked" to "need to buy" and back.

Every product you buy lives in your **Needs list** (your master library). When you run low
on something, you tap it onto the **Shopping list** for the next trip. In the store you check
things off as you go; checking something off quietly returns it to the Needs list for next time.

---

## 📱 Install it on your iPhone

1. Open the app link in **Safari** (it has to be Safari, not Chrome):
   **https://stophoto.github.io/Kanban/**
   *(This goes live once GitHub Pages is turned on — see [SETUP.md](SETUP.md). Confirm the exact
   address under the repo's **Settings → Pages**.)*
2. Tap the **Share** button (the square with an up-arrow).
3. Scroll down and tap **Add to Home Screen**.
4. Name it **Kanban** and tap **Add**.
5. Launch it from the new home-screen icon — it opens full-screen, like a real app.

Do this on **both** phones. Once shared sync is on (below), both phones show the same live list.

---

## 🔐 Signing in

Kanban is private to your two Google accounts — **carmyn.pre@gmail.com** and
**prefontainech@gmail.com**. Nobody else can open the list.

- When you open the app, tap **Continue with Google** and choose your Gmail.
- You stay signed in after that — it won't ask every time.
- Pick the wrong account and it'll tell you that account isn't on the list; just tap
  **Try a different account**.
- **To sign out:** tap the little status pill in the top-right corner (the one that says SYNCED).

> The login only appears once shared sync is set up (see [SETUP.md](SETUP.md)). Before that, the app
> runs on this phone only and doesn't ask you to sign in.
>
> To add or remove a person later, change the two email addresses in **both** `index.html` (the
> `ALLOWED` line near the top of the script) and `firestore.rules`, then save. Details in SETUP.md.

---

## 🔄 Is it syncing between our phones yet?

Look at the little dot in the top-right corner of the app:

| It says… | Meaning |
|---|---|
| **SYNCED** (teal dot) | ✅ Both phones share one live list. You're all set. |
| **THIS DEVICE** (grey dot) | The app works, but changes stay on *this* phone only. Shared sync isn't turned on yet. |
| **OFFLINE** (orange dot) | No internet right now. You can still see your list; changes sync when you're back online. |

If it says **THIS DEVICE**, that's expected until the one-time Firebase step is done.
It takes about 5 minutes and it's free — the steps are in **[SETUP.md](SETUP.md)**.

---

## 🛒 How to use it

- **Two tabs at the top:** *Needs list* (everything you ever buy) and *Shopping list* (this trip).
  The number on *Shopping list* is how many items are on it right now.
- **Add something to the trip:** on the Needs list, tap the circle on the right of an item — it
  fills teal. It's now on your Shopping list.
- **Find anything fast:** use the search bar at the bottom. Type a few letters, tap to add.
- **Add a brand-new product:** tap **+ NEW** in the bottom bar. Choose whether it goes straight
  onto the Shopping list now, or just into the Needs list for later. Either way it's saved forever.
- **Check off in the store:** on the Shopping list, tap the circle on the *left*. It marks the item
  bought and tucks it back into the Needs list. Tapped something by accident? Hit **Undo**.
- **Edit an item:** tap its name. You can change the name, store, where you can buy it, how many to
  buy, a brand/detail, and a shopping note. You can also remove it from the list or delete it.
- **Stores & aisles:** items are grouped by store (Grocery, Costco, Liquor, Shoppers, Household) and
  then by department. Tap a department header to collapse/expand it. Use the chips up top to filter
  to one store.
- **The tags:** *Only here* = must buy at that store (e.g. liquor). *Ideally Costco* = best there,
  but you can grab it elsewhere. No tag = grab it anywhere.

---

## ✏️ Making changes to the app itself

The whole app is files in this GitHub repo. The important ones:

- **`index.html`** — the entire app (look, feel, and logic all in one file).
- **`firebase-config.js`** — where your sync keys go (see SETUP).
- **`icons/`** — the home-screen icon (a plain teal "P" for now; swap in a Fratello icon anytime,
  keep the same file names).

When you change a file on GitHub and save it to the **main** branch, the app **redeploys
automatically** in about a minute (via the workflow in `.github/workflows/deploy.yml`). Refresh the
app on your phone to get the update.

> If a change doesn't show up after a redeploy, the phone may be holding an old cached copy. Open
> `sw.js` and change `pantry-v1` to `pantry-v2` (then `v3`, etc.) and save — that forces every phone
> to refresh the app shell on next launch.

---

## 🎨 Design

Kanban follows the **Fratello Coffee Roasters** brand — Montserrat type, a single teal accent on
white, no clutter. The full design notes are in [`docs/DESIGN_TOKENS.md`](docs/DESIGN_TOKENS.md).

---

## What's where (for the curious)

| File | What it is |
|---|---|
| `index.html` | The app. |
| `firebase-config.js` | Your Firebase keys (turns on shared sync). |
| `manifest.webmanifest` | Makes it installable as a home-screen app. |
| `sw.js` | Service worker — offline support + install. |
| `firestore.rules` | The database security rules to publish in Firebase. |
| `SETUP.md` | One-time setup: turn on sync + go live. |
| `icons/` | App icons. |
| `app/`, `docs/`, `README_BUILD_BRIEF.md` | The original prototype and build notes (reference). |
