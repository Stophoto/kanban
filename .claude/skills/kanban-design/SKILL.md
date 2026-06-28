---
name: kanban-design
description: The visual design system for the Kanban grocery/replenishment app (the "Fratello" look — teal + cream + warm-red, Montserrat, hairline lists, rounded pills, bottom sheets). Use whenever building, restyling, or extending Kanban's UI, or creating any new screen/component/page that should match its look. Provides exact color tokens, type scale, spacing, motion, icon style, and copy-paste component recipes, plus the do/don't rules that keep it consistent.
---

# Kanban design system ("Fratello")

A calm, editorial, mobile-first look: warm off-white surfaces, a single teal accent, bold Montserrat headings, and quiet hairline lists. No cards, no shadows on content, no gradients, no second color. Think a print-magazine "hub" page, not a colorful consumer app. The live source of truth is [`index.html`](../../../index.html) `:root` + `<style>`; this skill is the canonical reference for matching it.

**One-line feel:** *warm-neutral canvas → bold black type → one teal accent → terracotta only for warnings.*

---

## 1. Design tokens

Paste these into `:root`. They are the exact values used by the app (also kept in [`tokens.css`](tokens.css)).

```css
:root{
  /* Fratello palette */
  --black:#1A1A1A; --white:#FFFFFF; --cream:#F6F1E9; --teal:#36B3AF; --teal-bright:#00D4C8;
  --slate:#4A4A4A; --grey:#908F8A; --grey-light:#C4C3C0; --fog:#E8E4DE;
  --divider:#E0E0E0; --card-light:#F5F0E8;
  --teal-tint:#E4F4F3; --teal-tint2:#D5EEEC;
  --need:#C2502F; --need-tint:#F6E9E4;       /* warm warning / destructive */
  --save-red:#D93A2C; --save-green:#2E9E5B;  /* primary Save: red → green on press */
  --bg:#FFFFFF; --surface:#FFFFFF;
  --radius:14px; --radius-lg:18px;
  --safe-top:env(safe-area-inset-top,0px); --safe-bottom:env(safe-area-inset-bottom,0px);
  --font:'Montserrat',-apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif;
}
```

### Color roles

| Token | Hex | Role |
|---|---|---|
| `--teal` | `#36B3AF` | **The accent.** Eyebrows, underlines, on-list fill, active tabs/pills, chevrons, NEW button, qty badges. ~10% of the surface — never a big background. |
| `--teal-bright` | `#00D4C8` | Brighter teal for one digital touch (the Undo link on the dark toast). |
| `--teal-tint` / `--teal-tint2` | `#E4F4F3` / `#D5EEEC` | Soft teal fills: the resting category pill, "Ideally [store]" tag, qty badge, on-list halo, menu hover. |
| `--black` | `#1A1A1A` | Headings, body, wordmark, search dock, secondary buttons. |
| `--white` / `--surface` | `#FFFFFF` | Background and sheet/menu surfaces. |
| `--cream` | `#F6F1E9` | Row press state; soft warm fill. |
| `--slate` | `#4A4A4A` | Secondary/body text, menu items. |
| `--grey` | `#908F8A` | Captions, inactive tabs/chips, meta labels, placeholder. |
| `--grey-light` | `#C4C3C0` | Idle circle borders, checked-off (struck-through) text. |
| `--divider` | `#E0E0E0` | Hairline row dividers, menu borders. |
| `--fog` | `#E8E4DE` | "Usually [store]" tag fill, photo letterbox, neutral press. |
| `--card-light` | `#F5F0E8` | Inactive mode-toggle pill, close-button bg. |
| `--need` / `--need-tint` | `#C2502F` / `#F6E9E4` | The one warm warning: "Only here" tags, shopping-count badge, Delete text. Sparingly. |
| `--save-red` / `--save-green` | `#D93A2C` / `#2E9E5B` | Primary Save button: **red at rest, green on press / just after saving.** |

**No rainbow.** Single teal accent + warm `--need` for warnings. Never color-code categories or stores. **60-30-10:** ~60% white/neutral, ~30% black/slate text, ~10% teal. If a screen feels busy, *remove* a teal element rather than add one.

---

## 2. Typography

- **One family: Montserrat** (Google Fonts). Load in `<head>`:
  ```html
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  ```
- **Weights:** 900 wordmark · 800 dept headers, titles, qty numbers, buttons/labels, active tabs · 700 eyebrows, tags, chips, tabs · 600 item names, subheads, menu items · 500 body & inputs · 400 fine print.
- **All-caps labels** (eyebrows, tags, tabs, chips, buttons) use `letter-spacing` ~0.5–2px. Sentence/lowercase text uses ~0 tracking (tight headings go slightly negative, e.g. `-0.3px` to `-1px`).
- **Hierarchy = contrast:** big bold dept header (20px/800, near-black) against small grey meta (11–12px/700). Don't flatten it.

| Element | Size / weight / tracking |
|---|---|
| Wordmark | 25px / 900 / -1px / UPPER |
| Sheet title (`h2`) | 23px / 800 / -0.5px |
| Dept header | 20px / 800 / -0.3px |
| Item name | 16px / 600 / -0.1px / line-height 1.3 |
| Body input | 16px / 500 (16px avoids iOS zoom) |
| Detail / note | 12.5px / 500–600 |
| Store eyebrow | 12px / 700 / 2px / UPPER / teal |
| Field label | 10.5px / 800 / 1px / UPPER / grey |
| Tag (lozenge) | 10px / 800 / 0.5px / UPPER |

---

## 3. Spacing, shape, elevation, motion

- **Radii:** rows/inputs/cards `14px` (`--radius`); larger surfaces `18px`; pills & dock `999px`; tags `6px`; small buttons/menu items `9–13px`. Corners soft, never sharp.
- **Hairlines over boxes:** separate list items with a 1px `--divider` bottom border — *no cards, no per-item shadows*.
- **Elevation:** only floating layers get shadow — bottom sheet, dropdown menu (`0 18px 44px rgba(0,0,0,.20)`), toast, active teal pill (`0 5px 16px rgba(54,179,175,.40)`). Content stays flat.
- **Row rhythm:** item rows `padding:11px 2px` (~44px tap target). Don't go tighter.
- **Motion:** quick, springy slides/collapses with `cubic-bezier(.32,.72,0,1)`, ~0.18–0.34s. Color transitions ~0.12–0.15s. Wrap purely-decorative motion in `@media (prefers-reduced-motion: reduce)`.

---

## 4. Shell & layout

- Mobile-first PWA. Content column `max-width:480px; margin:0 auto; padding:0 20px` with generous bottom padding (~170px) so the floating dock never covers the last row.
- **Sticky white header** (`z-index:40`, 1px divider bottom): wordmark + sync badge row, then the mode toggle, then the store chips, then the category filter.
- Honor safe areas: `padding-top:var(--safe-top)` on body; `var(--safe-bottom)` in fixed bottom elements.
- **Floating search dock** pinned to the bottom (black pill).

---

## 5. Icons

Inline SVG, **outline/stroke style** — never filled shapes:
`viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"`, `stroke-width` 2–2.4 (heavier ~3.4 only for the check mark). Size 13–18px inline, ~26–28px for empty-state/add affordances. Color via `currentColor` so they inherit teal/white/grey. **No emoji in the UI.**

---

## 6. Component recipes

Copy these patterns; they are the built components.

**Mode toggle (segmented pills)** — inactive = `--card-light` grey text; active = solid teal, white, 900, soft teal shadow.
```css
.toggle button{background:var(--card-light);padding:11px 18px;border-radius:999px;font-weight:800;font-size:13.5px;
  text-transform:uppercase;color:var(--grey);border:none;}
.toggle button.active{background:var(--teal);color:var(--white);font-weight:900;box-shadow:0 5px 16px rgba(54,179,175,.40);}
```

**Filter chips (underline tabs)** — text-only; selected goes black with a 2.5px teal underline.
```css
.chip{font-size:12px;font-weight:700;letter-spacing:.6px;text-transform:uppercase;color:var(--grey);padding:2px 0 7px;position:relative;}
.chip.sel{color:var(--black);}
.chip.sel::after{content:"";position:absolute;left:0;right:0;bottom:0;height:2.5px;background:var(--teal);}
```

**Pill + custom dropdown** — teal-tint pill (funnel + label + chevron) that goes solid teal when a filter is active; opens a white rounded menu with a **sticky bold pinned item** at the top and a scrim behind. (Custom, not native `<select>`, so the pinned/bold "all" item is possible.)
```css
.catselect{background:var(--teal-tint);border:1.5px solid var(--teal-tint2);border-radius:999px;padding:9px 13px;}
.catselect.active{background:var(--teal);border-color:var(--teal);}  /* label/icons flip to white */
.catmenu{border-radius:14px;box-shadow:0 18px 44px rgba(0,0,0,.20);max-height:50vh;overflow-y:auto;padding:0 6px 6px;}
.catmenu-item.pinned{position:sticky;top:0;background:var(--white);font-weight:800;text-transform:uppercase;
  border-bottom:1.5px solid var(--divider);}            /* stays at top while the list scrolls */
.catmenu-item.sel{color:var(--teal);font-weight:800;}
```

**Section headers** — *store* = small teal eyebrow (12px/700/2px caps). *Department* = the one loud element: 20px/800 near-black with a 2.5px teal bottom rule, a rotating teal chevron, tap-to-collapse.
```css
.store-h .sh-name{font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--teal);}
.deptbar{border-bottom:2.5px solid var(--teal);padding:14px 0 9px;}
.deptbar .db-name{font-size:20px;font-weight:800;letter-spacing:-.3px;color:var(--black);}
.deptbar .db-chev{color:var(--teal);transition:transform .24s cubic-bezier(.32,.72,0,1);}
.deptbar.collapsed .db-chev{transform:rotate(-90deg);}
```

**Item row** — flat, hairline divider, the whole row is the tap target. Name + optional grey detail + teal note. `:active` → cream wash. On a needs list, a circle that fills **solid teal with a 4px halo** when on the shopping list. Checked-off items: struck-through grey-light.
```css
.row{display:flex;align-items:center;gap:14px;padding:11px 2px;border-bottom:1px solid var(--divider);}
.row:active{background:var(--cream);}
.r-name{font-size:16px;font-weight:600;line-height:1.3;}
.r-add.done{background:var(--teal);border-color:var(--teal);color:#fff;box-shadow:0 0 0 4px var(--teal-tint);}
```

**Tags (lozenges)** — tiny uppercase, 6px radius, tinted fills; show **only when informative**: `--teal-tint`/teal = "Ideally [store]"; `--need-tint`/need = "Only here"; `--fog`/slate = "Usually [store]". A plain anywhere item shows no tag.

**Quantity badge** — teal-tint rounded rect: big teal number + tiny "BUY".

**Bottom sheet (add/edit editor)** — white, `border-radius:24px 24px 0 0`, slide up with `transform`+`cubic-bezier(.32,.72,0,1)`, scrim behind (`rgba(26,26,26,.4)` + blur). Grab handle, round close ×.
- **Fields:** label (10.5px/800 caps grey) over the control. Text inputs `1.5px solid --divider`, 12px radius, 16px text, focus border → teal.
- **Segmented control** (`.seg .opt`): bordered pills that fill **solid teal** when selected.
- **Custom select** (category): native `<select>` styled with a teal chevron overlay, OR the pinned-dropdown pattern above.
- **Stepper:** `− value +`, buttons go teal on press.

**Buttons** — full-width, 13px radius, 800 uppercase, ~1px tracking.
```css
.save{background:var(--black);color:#fff;}                 /* secondary (e.g. Add to shopping list) */
#saveBtn{background:var(--save-red);transition:background .12s;}        /* PRIMARY: red at rest */
#saveBtn:active,#saveBtn.ok{background:var(--save-green);}              /* → green on press / after save */
.save.cancel{background:none;color:var(--grey);}           /* text-only, with breathing room above */
.save.ghost{background:none;color:var(--need);}            /* destructive (Delete) */
```
Order in the editor: **Save (red→green) → secondary (black) → Cancel → Delete → (Photo field last)**. Give Cancel clear top margin so it can't be mis-tapped near Save.

**In-app confirm dialog** — replaces `window.confirm()` (iOS PWAs suppress it). Centered white card on a dim blur scrim: bold title, grey body, red "Delete forever" + ghost "Keep it".

**Photo** — optional per-item. Empty state: dashed box + teal camera icon + "Add a photo". Filled: image at natural ratio (`object-fit:contain`, never cropped) on a `--fog` letterbox, with a round dark × to remove; tap → full-screen viewer (`rgba(0,0,0,.93)`, contain). Images are downscaled client-side to ~1200px before storing.

**Toast** — dark pill, bottom-center, slides up, auto-hides; optional teal-bright Undo.

**Search dock** — fixed bottom black pill: teal magnifier, input, persistent teal "+ NEW" button.

**Loading / empty / banner / auth gate** — loading = three pulsing teal dots; empty = faint outline icon + slate copy + optional black button; banner = cream info / `--need-tint` error strip (hidden via `[hidden]`); auth gate = centered wordmark + black "Continue with Google" pill.

---

## 7. Do / Don't

**Do:** keep it flat and quiet; lead with bold black type; use teal as a small accent; use hairlines not cards; keep one typeface; soft corners; short springy motion; honor safe areas; use 16px inputs (no iOS zoom).

**Don't:** add gradients, content shadows, bevels, or glows · introduce a second font · color-code stores/categories · add or louden tags · use emoji in the UI · make teal a large background · use native browser dialogs (build the in-app card).

---

*Source of truth:* [`index.html`](../../../index.html) (`:root` + `<style>`) and [`docs/DESIGN_TOKENS.md`](../../../docs/DESIGN_TOKENS.md). If those ever drift from this skill, the live CSS wins — update this file to match.
