# START HERE — Pantry Handoff Package

This package contains everything needed to turn the working Pantry prototype into a deployed, real-time-synced iPhone app for Chris & Carmyn.

## If you are Claude Code (or any developer)

Read in this order:

1. **`README_BUILD_BRIEF.md`** ← start here. The full build brief: what to build, what's already done, your task list, and acceptance criteria.
2. **`docs/FIREBASE_SETUP.md`** — the core work: replacing local storage with shared real-time Firestore. Includes drop-in code patterns.
3. **`docs/PWA_AND_DEPLOY.md`** — manifest, service worker, and GitHub Pages deploy. Includes the actual manifest + service worker code.
4. **`docs/DESIGN_TOKENS.md`** — the Fratello design system already in the app. Don't restyle; match this if you split CSS.
5. **`docs/SEED_DATA.md`** — the 131 starter items and the routing logic behind them.

The app to convert is **`app/pantry-prototype.html`** — open it in a browser to see it working (it currently saves per-device via localStorage; your job is to make it shared via Firestore).

## The one-line summary

Two people, two iPhones, one shared live grocery/replenishment list. The prototype is feature- and design-complete. Convert its storage from `localStorage` to Firebase Firestore so both phones sync, make it a home-screen-installable PWA, and deploy it to GitHub Pages. Don't redesign it; don't add features beyond what's listed.

## If you are Chris

Hand this whole folder (or the zip) to Claude Code and say "build this." The build brief is written for it. Once it's deployed, you'll get a URL — open it in Safari on each phone and "Add to Home Screen." The `docs/PWA_AND_DEPLOY.md` Part E has the exact install steps, and Claude Code will give you a plain-English README too.

A few decisions Claude Code may ask you about (your call):
- **Who owns the Firebase project** — you (under your Google account, recommended for the long term) or set up fresh.
- **Security rules** — recommended is invisible anonymous auth so no login screen but random traffic is kept out.
- **Seed or empty** — start with your 131 real items (recommended) or a clean slate.
- **Per-store aisle order** — later, if you want each store's department order to match how you physically walk it.
