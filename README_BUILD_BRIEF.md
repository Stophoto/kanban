# Pantry — Claude Code Build Brief

**Project:** A two-person household replenishment app ("Pantry") for Chris & Carmyn Prefontaine.
**Your job:** Take the working single-file prototype in `app/pantry-prototype.html` and turn it into a deployed, real-time-synced Progressive Web App that both people install on their iPhone home screens and that always shows the same shared data.

**Read this whole document before writing any code.** The prototype is feature-complete on UX and logic — do not redesign it. Your work is plumbing: swap local storage for Firebase, make it installable, and deploy it.

---

## 1. What this app is (one paragraph)

It's a digital version of a physical kanban replenishment system the couple already uses at home. Every product they buy lives in a **Needs list** (the master library). When they run low on something, they add it to the **Shopping list** for the next trip. The shopping list is organized by store, then by department/aisle, with items they always buy at a given store pinned to the top of each aisle and "grab-anywhere" items shown below. In the store, they check items off as they go; checking off returns the item to dormant in the needs list. Two people, two phones, one shared live list.

---

## 2. The single most important requirement: shared real-time sync

Chris and Carmyn each install the app on their own iPhone. **They must see the same data, updated live.** When Chris adds peanut butter to the shopping list, it appears on Carmyn's phone within ~1 second. When Carmyn checks it off in the store, it disappears from Chris's list.

The prototype currently uses `localStorage` (per-device, not shared). **Your primary task is to replace that with Firebase Firestore** so the data is shared. See `docs/FIREBASE_SETUP.md` for the exact integration.

There is no login/user-account system and none is wanted. Both people share one household data set. Access control is "whoever has the URL + installs it." Keep it that simple unless Chris later asks otherwise.

---

## 3. Tech stack (keep it minimal — this is deliberate)

- **Single-page app, vanilla HTML/CSS/JS.** No framework, no build step, no bundler. The prototype is one self-contained file and should stay that way (or split into at most `index.html` + `app.js` + `styles.css` if you prefer — but a single file is acceptable and arguably better here).
- **Firebase Firestore** for the shared database (free tier is more than enough — this is two users and ~150 documents).
- **PWA**: a web manifest + a service worker so it installs to the home screen, runs full-screen, and works offline.
- **Hosting**: GitHub Pages (Chris uses GitHub). Firebase Hosting is an acceptable alternative if it's simpler for you given the Firebase dependency — your call, document whichever you choose.

Do **not** introduce React, Vue, Tailwind, npm packages, TypeScript, or a backend server. The whole point is that Chris (a non-developer) can later open the file and roughly follow it.

---

## 4. What's already done (don't rebuild these)

The prototype implements all of this. Preserve every behavior exactly:

- **Two tabs:** "Needs list" (master library) and "Shopping list" (current trip), with a live count badge on the shopping-list tab.
- **Store filter chips:** All · Grocery · Costco · Liquor · Shoppers · Household.
- **Departments as collapsible sections** within each store, bold headers with a teal underline rule, tap to collapse/expand, state persists. "Collapse all / Expand all" control when filtered to one store.
- **Three routing types per item**, shown as tags:
  - `locked` ("Only here") — shows only under its store. e.g. liquor (Alberta law), Safeway-only items.
  - `wait` ("Best here" / "Ideally Costco") — lives under its store but appears as a reminder elsewhere; user decides to wait or grab now.
  - `anywhere` — floats into every store's "grab anyway" list.
- **Anchored-on-top ordering:** within each department, items anchored to the current store (locked/wait) sort to the top, then an "or grab here anyway" divider, then the rest.
- **Shopping list rows** show a bold teal **"N BUY"** quantity badge and any **shopping note** (teal, pencil icon) under the item name.
- **Add anytime:** a persistent teal **"+ NEW"** button in the bottom search dock. Opens a new-product form with a destination toggle — "Needs list" (save dormant) or "Shopping list now" (add straight to this trip). Either way it's saved to the needs list permanently.
- **Always-on search:** the bottom dock. Type to find any item across all stores; tap to add/remove from shopping list. If no match, a **+** offers to create a new product with that name.
- **Item editor:** tap any item's name to edit name, store/section, routing, quantity-to-buy, detail/brand, and shopping note; add/remove from shopping list; or delete from needs list.
- **Check-off behavior:** checking an item on the shopping list marks it restocked after a short delay (with an Undo toast), removing it from the list and returning it to dormant in the needs list.
- **131 seeded items** parsed from the couple's real grocery/Costco/Shoppers lists, de-duplicated, with store + department + routing assigned. See `docs/SEED_DATA.md`.

---

## 5. The data model

Every item is one object. In the prototype these live in a JS array in `localStorage` under the key `pantry_v2`. **In your version, each item becomes one Firestore document** in a collection (see Firebase doc for the exact path).

```js
{
  id:       "i...",        // unique string id (keep the prototype's uid() or use Firestore doc ids)
  name:     "Peanut butter",
  store:    "grocery",      // one of: grocery | costco | liquor | shoppers | household
  routing:  "anywhere",     // one of: locked | wait | anywhere
  dept:     "Condiments",   // department/aisle label (free text, but see DEPT_ORDER list)
  detail:   "Adams natural",// optional brand/detail string
  note:     "",             // optional shopping note, surfaces on the shopping list
  qty:      1,              // quantity to buy each time
  onList:   false,          // true = currently on the shopping list
  checked:  false           // true = checked off in-store (transient)
}
```

Two other tiny pieces of persisted state in the prototype:
- `pantry_mode` — which tab is active (`'catalog'` internally = Needs list, or `'list'` = Shopping list). This is a **per-device UI preference**, NOT shared data — keep it in localStorage, do not sync it.
- `pantry_collapsed` — which departments are collapsed (a list of `"store|dept"` keys). Also a **per-device UI preference** — keep local, do not sync.

> Important distinction: the **items** are shared (Firestore). The **UI preferences** (active tab, collapsed sections) are per-device (localStorage). Don't sync the UI preferences or the two phones will fight over each other's view state.

---

## 6. Your task list, in order

1. **Stand up Firebase.** Follow `docs/FIREBASE_SETUP.md`. Create the project, enable Firestore, get the config object.
2. **Replace the storage layer.** In the prototype, find `load()`, `save()`, and every call to them. Replace with Firestore reads/writes + a real-time listener (`onSnapshot`) so changes from the other phone appear live. Keep the in-memory `items` array as the working copy that the render functions read from; the listener updates that array and re-renders. The setup doc gives you a drop-in pattern.
3. **Seed the database once.** On first run with an empty Firestore collection, write the 131 seed items (they're already embedded in the prototype as the `SEED` array). Guard it so it only seeds when the collection is empty — never on every load.
4. **Make it a PWA.** Add `manifest.webmanifest` and a service worker. See `docs/PWA_AND_DEPLOY.md`. Use the app icon described there (or generate a simple one — a teal rounded square with a white "P" is fine as a placeholder; Chris can supply a Fratello-branded icon later).
5. **Deploy.** Push to a GitHub repo, enable GitHub Pages, confirm the HTTPS URL loads on mobile. (Firestore and service workers require HTTPS — GitHub Pages provides it.)
6. **Test the shared-sync acceptance criteria** in section 8 below.
7. **Write a short README** for Chris: the live URL, how to install on iPhone (Share → Add to Home Screen), and how to edit/redeploy. Keep it non-technical.

---

## 7. Design system — match Fratello exactly

The prototype is already styled to the Fratello brand. **Do not restyle it.** If you split CSS into its own file, preserve every value. The full token reference is in `docs/DESIGN_TOKENS.md`. The essentials:

- **Font:** Montserrat (Google Fonts), weights 400–900. It's the only typeface. Already linked in the prototype `<head>`.
- **Accent:** teal `#36B3AF` — used as a disciplined ~10% accent (eyebrows, underlines, the "on-list" fill, the NEW button, quantity badges). Never as a large background. **No per-store rainbow colors** — the brand bans multi-color palettes; everything runs on the single teal accent.
- **Background:** white `#FFFFFF`. Text: near-black `#1A1A1A`, secondary grey `#908F8A`.
- **Bold department headers + thin teal rule** are the one prominent visual element; everything else stays quiet (clean rows, hairline dividers).

If Chris has supplied (or later supplies) the file `fratello-design-skill.md`, treat it as the source of truth for any visual decision beyond what the prototype already shows.

---

## 8. Acceptance criteria (the app is done when all of these pass)

**Sync:**
- [ ] Open the app on two devices (or two browsers). Add an item to the shopping list on device A; it appears on device B within ~2 seconds without refresh.
- [ ] Check an item off on device B; it disappears from both within ~2 seconds.
- [ ] Edit an item's quantity on A; the new "N BUY" badge updates on B.
- [ ] Closing and reopening the app shows the current shared state (data persists in Firestore, not just memory).

**Add-anytime:**
- [ ] The "+ NEW" button is visible in the bottom dock on every screen.
- [ ] Adding a new product with "Shopping list now" puts it on the shopping list immediately AND saves it to the needs list.
- [ ] Adding with "Needs list" saves it dormant; it does not appear on the shopping list until added.

**PWA:**
- [ ] On iPhone Safari, "Add to Home Screen" installs it with the app icon.
- [ ] Launched from the home screen, it runs full-screen (no Safari chrome).
- [ ] It opens and shows last-synced data when offline (writes can fail gracefully offline; Firestore offline persistence is a bonus if easy).

**Preserved behavior:**
- [ ] All 131 seed items present, correctly grouped by store and department.
- [ ] Routing tags (Only here / Ideally [store] / Usually [store]) render correctly per context.
- [ ] Department collapse/expand works and persists per device.
- [ ] Notes and quantity badges show on shopping-list rows.

---

## 9. Things to watch out for (lessons from building the prototype)

- **Don't sync UI state.** Active tab and collapsed-section state are per-device. Only items sync.
- **Seed guard.** Seeding must check for an empty collection first. A naive seed-on-load will duplicate all 131 items every launch.
- **The render functions read from an in-memory `items` array.** Keep that pattern. The Firestore listener's job is to keep that array fresh and call the existing `render()` / `renderNeedsList()` / `renderShoppingList()` functions. Don't rewrite the renderers to read from Firestore directly.
- **HTTPS is mandatory** for both Firestore and service workers. Test on the deployed GitHub Pages URL, not `file://` or `localhost` without HTTPS.
- **Two people writing at once** is rare here but Firestore handles it (last-write-wins per field is fine for this use case). No need for transactions or conflict resolution beyond Firestore defaults.
- **iOS PWA quirks:** the app already includes `apple-mobile-web-app-capable` and viewport-fit=cover with safe-area insets. Preserve those. Test the home-screen launch specifically on iOS, not just Android/desktop.

---

## 10. Out of scope (do NOT build unless Chris asks)

- User accounts / login / multi-household support
- Barcode scanning (discussed as a future idea, not for v1)
- Retailer integrations / deep links to Instacart/Amazon/Costco
- Push notifications
- Analytics / tracking
- Any backend server or API beyond Firebase

---

## 11. Deliverables back to Chris

When done, provide:
1. The live URL (GitHub Pages).
2. The GitHub repo.
3. A short non-technical README: install steps for iPhone, how to add/edit items, how to make changes and redeploy.
4. Confirmation that the section 8 acceptance criteria pass.
5. The Firebase project details (or instructions, if Chris needs to create the project under his own account — see the Firebase doc; he may prefer to own the project).

---

*Package contents: `app/pantry-prototype.html` (the working app to convert), plus the `docs/` folder: Firebase setup, PWA + deploy, design tokens, and seed-data reference.*
