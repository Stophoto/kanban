# Seed Data Reference

The prototype ships with **131 starter items** parsed from Chris & Carmyn's real grocery, Costco, and Shoppers Drug Mart lists, de-duplicated, with a store, department, and routing assigned to each. They're embedded in `app/pantry-prototype.html` as a JS array named `SEED`.

**You do not need to retype these.** Use the embedded `SEED` array as-is for the one-time Firestore seeding (see `FIREBASE_SETUP.md` Part D).

---

## Totals

- **131 items total**
- **By store:** Grocery 55 · Shoppers 34 · Liquor 19 · Household 14 · Costco 9
- **By routing:** Anywhere 97 · Only-here (locked) 25 · Best-here (wait) 9

## Departments present per store

| Store | Departments (aisles) |
|---|---|
| **Grocery** | Produce, Dairy, Meat, Frozen, Snacks, Condiments, Dry, Breakfast, Baking, Beverages, General |
| **Costco** | Dairy, Meat |
| **Liquor** | Spirits, Wine, Beer & Cider |
| **Shoppers** | Health, Toiletries, Cosmetics |
| **Household** | Laundry, Cleaning, Paper, Kitchen, General |

## Department display order

The prototype renders departments in this fixed order (the `DEPT_ORDER` array). Preserve it:

```
Produce, Dairy, Meat, Frozen, Bakery, Snacks, Condiments, Dry, Breakfast, Baking,
Beverages, Spirits, Wine, Beer & Cider, Health, Toiletries, Cosmetics,
Laundry, Cleaning, Paper, Kitchen, General
```

> This is a generic shelf order. Chris mentioned he may later want each store's aisle order to match the **physical layout of his actual stores** (the order he walks them). That's a future refinement — for now `DEPT_ORDER` is shared across all stores. If he provides a per-store walk order, you'd swap the single `DEPT_ORDER` for a per-store map.

---

## Routing decisions baked into the seed (so you understand the logic)

- **Liquor → all `locked`.** Alberta law: must be a liquor store. None of it floats.
- **Costco → all `wait` ("Ideally Costco").** Bulk items the couple prefers to buy at Costco but will sometimes grab elsewhere — exactly the "wait for the Costco run, but might cave" case.
- **Safeway-only items** (Earls dry ribs, fig jam, choc mug cake, Whisps, nonalcoholic cider) and **Superstore-only sour cream** → `locked` to Grocery with a "Safeway only"/"Superstore only" detail note.
- **Shoppers everyday items** (deodorant, Advil, toothpaste, etc.) → `anywhere` — the couple might grab them at a grocery store instead of a dedicated Shoppers trip.
- **Shoppers cosmetics** (Clinique, La Roche-Posay) → also `anywhere` for now. Chris may later want some locked to Shoppers — leave editable.
- **Grocery + Household staples** → `anywhere`.

De-duplication: items that appeared on multiple source lists (cottage cheese, yogurt, popcorn, Halloween candy, Aleve, allergy meds, body wash, etc.) were merged to a single item on their best-fit store.

---

## Item shape in the seed

Each `SEED` entry has only the authored fields; the seeding code fills the rest (`note:''`, `qty:1`, `onList:false`, `checked:false`):

```js
{ name:"Peanut butter", store:"grocery", routing:"anywhere", dept:"Condiments", detail:"Adams natural" }
```

Valid `store` values: `grocery` · `costco` · `liquor` · `shoppers` · `household`
Valid `routing` values: `locked` · `wait` · `anywhere`

---

## If Chris wants to start empty instead

If at handoff Chris prefers a clean slate rather than the 131 seeded items, simply **don't run the seed** — the app works fine with an empty collection (it shows the empty-state prompts) and he adds items via the **+ NEW** button. Ask him which he wants. Default: seed the 131, since they're his real recurring items and make the app useful on day one.
