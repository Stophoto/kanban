# Design Tokens — Fratello / Pantry

These are already implemented in the prototype's `:root` block and throughout its CSS. **Do not change them.** This file is a reference so that if you split the CSS into its own file, or build any new UI, you match the existing system exactly.

The app follows the **Fratello Coffee Roasters** brand. If Chris supplies `fratello-design-skill.md`, that is the canonical source; this is the subset the app uses.

---

## Palette (exact values from the prototype)

```css
:root{
  /* Fratello palette */
  --black:#1A1A1A; --white:#FFFFFF; --cream:#F6F1E9; --teal:#36B3AF; --teal-bright:#00D4C8;
  --slate:#4A4A4A; --grey:#908F8A; --grey-light:#C4C3C0; --fog:#E8E4DE;
  --divider:#E0E0E0; --card-light:#F5F0E8;
  --teal-tint:#E4F4F3; --teal-tint2:#D5EEEC;
  --need:#C2502F; --need-tint:#F6E9E4;
  --bg:#FFFFFF; --surface:#FFFFFF;
  --radius:14px; --radius-lg:18px;
  --font:'Montserrat',-apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif;
}
```

| Token | Hex | Role |
|---|---|---|
| `--teal` | `#36B3AF` | **The accent.** Eyebrows, underlines, on-list fill, NEW button, quantity badges, active states. ~10% of the surface, never a large background. |
| `--teal-bright` | `#00D4C8` | Digital-only brighter teal (e.g. the Undo link on the dark toast). |
| `--teal-tint` | `#E4F4F3` | Soft teal fill for the "N BUY" quantity badge and the "Ideally [store]" tag. |
| `--black` | `#1A1A1A` | Headings, primary text, the wordmark, the search dock, primary buttons. |
| `--white` | `#FFFFFF` | Background and surface. |
| `--slate` | `#4A4A4A` | Secondary/body text. |
| `--grey` | `#908F8A` | Captions, inactive tabs/chips, meta labels. |
| `--grey-light` | `#C4C3C0` | Borders on idle circles, checked-off text. |
| `--divider` | `#E0E0E0` | Hairline row dividers and the department-section rules' lighter lines. |
| `--need` | `#C2502F` | The one warm-warning color — "Only here" locked tags, the shopping-count badge, destructive actions. Used sparingly. |
| `--need-tint` | `#F6E9E4` | Soft fill behind "Only here" tags. |
| `--cream` | `#F6F1E9` | Row active/press state. |

**Brand rule — no rainbow.** The Fratello skill bans multi-color palettes. Earlier prototype versions color-coded each store; that was removed. Everything runs on the **single teal accent** plus the warm `--need` for warnings. Do not reintroduce per-store colors.

**60-30-10 discipline:** ~60% white/neutral background, ~30% black/slate text, ~10% teal accent. When a layout feels busy, remove a teal element rather than adding one.

---

## Typography

- **Family:** Montserrat only (Google Fonts), loaded in `<head>`:
  ```html
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  ```
- **Weights in use:** 900 (wordmark), 800 (department headers, page titles, quantity numbers, buttons/labels), 700 (section eyebrows, tags, tabs, chips), 600 (item names, subheads), 500 (body, inputs), 400 (fine print).
- **Uppercase tracking:** all-caps labels (eyebrows, tags, tabs, chips, button text) carry `letter-spacing` ~0.5–1.5px. Lowercase needs zero tracking.
- **Hierarchy via contrast:** big bold department headers (20px/800) against small grey meta (11px/700) is the structure. Don't flatten it.

---

## Component conventions (as built)

- **Department header:** bold black 20px/800, with a 2.5px teal bottom rule. Tap toggles collapse; a teal chevron rotates. This is the one loud element.
- **Item row:** no card, no shadow — just name + optional detail/note, a hairline `--divider` underneath. The row is the tap target (opens the editor). Quiet.
- **Tags (lozenges):** small uppercase, rounded 6px, tinted fills — `--teal-tint`/teal for "Ideally [store]", `--need-tint`/need for "Only here", `--fog`/slate for "Usually [store]". Only shown when they carry information (a plain "anywhere" item shows no tag).
- **On-list indicator (needs list):** a circle that fills **solid teal** with a 4px teal halo when the item is on the shopping list — deliberately bold so it can't be missed.
- **Quantity badge (shopping list):** teal-tinted rounded rect, big teal number + tiny "BUY" label.
- **Search dock:** fixed bottom, black pill, teal magnifier, persistent teal **"+ NEW"** button on the right; turns into clear/add controls when typing.
- **Bottom sheet (editor/new):** white, rounded top, slide-up. Segmented buttons fill teal when selected.
- **Radii:** rows/cards `--radius` (14px); pills/dock larger. Keep corners soft, not sharp.
- **Motion:** short cubic-bezier(.32,.72,0,1) slides/collapses. Respect `prefers-reduced-motion` if you add anything new.

---

## What not to do

- No gradients, no drop shadows on text, no bevels/glows (Fratello banned list).
- No second typeface.
- No per-store colors.
- No emoji in the UI.
- Don't make tags louder or add more of them — restraint is the brand.
