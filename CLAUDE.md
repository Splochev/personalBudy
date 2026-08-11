# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack & Constraints

- **No build step, no npm.** Pure HTML/CSS/JS only. All dependencies are loaded from CDN.
- **Alpine.js v3** loaded as an ES module from `https://cdn.jsdelivr.net/npm/alpinejs@3/dist/module.esm.js`.
- **Firebase JS SDK v12** loaded from `https://www.gstatic.com/firebasejs/12.12.1/` via CDN imports.
- **Firebase Auth only** in this repo. No Firestore reads or writes happen here — the hub only authenticates.
- **Hosted on GitHub Pages** at `https://splochev.github.io/personalBudy/`. No server-side code.
- The five standalone tool pages (`catan.html`, `yu-gi-oh.html`, `card-translator.html`, `tax-aggregator.html`, `debt-calculator.html`) use **zero Firebase** and are fully self-contained.

## Dual Role: Hub + Shared Infrastructure

This repo does two distinct things:

1. **Authenticated dashboard hub** — `index.html` is the sign-in page and app launcher that links to all other buddy apps after auth.
2. **Shared infrastructure host** — `js/` contains files that the three sub-app repos (`budgetBuddy`, `DietBudy`, `GymBudy`) import directly from this repo's GitHub Pages URL.

## Shared Infrastructure Files

These two files are **public contracts**. Breaking them breaks all three sub-apps simultaneously.

### `js/firebase-config.js`
Exports `sharedFirebaseConfig` with five fields:
- `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`

**Do not change the field values.** They point to the shared Firebase project used by all four apps. Do not add or remove fields without updating all sub-app `firebase.js` files.

### `js/shared-utils.js`
Exports three named functions:
- `generateId()` — short random ID string
- `debounce(fn, delay)` — standard debounce wrapper
- `friendlyAuthError(code, t)` — maps Firebase Auth error codes to localized strings; `t` is a translation function

**Do not change function signatures.** Sub-apps import these by name. This file must remain Firebase-agnostic — no Firebase SDK imports allowed here.

Sub-apps import via:
```
import { generateId, debounce, friendlyAuthError }
  from 'https://splochev.github.io/personalBudy/js/shared-utils.js';
```

### `js/nav.js`
Plain (non-module) IIFE script. Injects a cross-app nav bar by reading `data-active` from its own `<script>` tag. Valid `data-active` values: `home`, `budget`, `diet`, `gym`.

Currently **not injected** into the three sub-apps — they have their own inline nav. Available for future pages in this repo that lack built-in cross-app nav. Load it as a plain `<script src="...">`, not as a module.

## SSO Mechanism

All four apps share:
- Firebase project: `personalbudy-2f735`
- `authDomain`: `personalbudy-2f735.firebaseapp.com`
- Origin: `splochev.github.io`

Firebase Auth stores the session in **IndexedDB scoped to the browser origin**. Because all repos deploy to the same GitHub Pages origin (`splochev.github.io`), the session is visible to all of them — this is the SSO mechanism. **Moving any app to a custom domain silently breaks SSO.**

## Hub Dashboard (`index.html`)

- Alpine store name: `pb`
- Auth states: `loading` | `unauthenticated` | `authenticated`
- Auth method: email/password only (`signInWithEmailAndPassword`)
- Language toggle (EN/BG) persisted to `localStorage` under key `personalbuddy-lang`
- No Firestore reads — the hub only calls Firebase Auth APIs

App card order in the dashboard grid:
1. Budget (budgetBuddy)
2. Meal Planner (DietBudy)
3. Workouts (GymBudy)
4. Food Manager (DietBudy)
5. Weight Tracker (DietBudy)
6. Catan Board Generator (local)
7. Yu-Gi-Oh! LP Calculator (local)
8. Card Translator (local)
9. Tax Aggregator (local)
10. Debt Calculator (local)

## Standalone Tools (No Firebase, No Alpine Store)

| File | What it does | Key tech |
|---|---|---|
| `catan.html` | Randomizes Settlers of Catan boards; supports 4- and 6-player setups | Canvas API |
| `yu-gi-oh.html` | Life points counter for Yu-Gi-Oh! duels; mobile-optimized, has PWA manifest (`manifest.ygo.json`) | Vanilla JS |
| `card-translator.html` | Upload card images, add translated text, generate a printable PDF | Calls local Ollama API (`http://localhost:11434`) |
| `tax-aggregator.html` | Parses Trading 212 CSV exports and generates Bulgarian NAP tax reports | CSV parsing, vanilla JS |
| `debt-calculator.html` | Models fixed loan payoff against a savings/investment plan; finds the month a compounding pot could clear remaining debt | Vanilla JS, compound-interest projections |

All five share the same CSS design tokens (`--bg`, `--surface`, `--accent`, etc.) defined inline in each file.

## Shared Infrastructure Contract

The three sub-app repos import from these exact URLs — **do not rename or move these files**:
```
https://splochev.github.io/personalBudy/js/firebase-config.js
https://splochev.github.io/personalBudy/js/shared-utils.js
```

Any rename, path change, or breaking signature change requires simultaneous updates to the `firebase.js` and `utils.js` files in all three sub-app repos.

## Adding New Shared Utilities

Add as named exports to `js/shared-utils.js`. Keep it Firebase-agnostic. Sub-apps can re-export from their own `utils.js` as needed. Never import from Firebase SDK inside `shared-utils.js`.

## Admin Restriction

`DietBudy/admin-food-merge.html` is restricted to `stanislav.plochev@codery.bg` via an email allowlist check. It is a data-migration tool, not a user-facing feature. No equivalent file exists in this repo.

## Design Tokens

All pages use the same dark-theme CSS custom properties defined inline per page:
- `--bg: #0f1117` — page background
- `--surface: #1a1d27` — card/panel background
- `--accent: #22c55e` — green primary action color
- `--danger: #ef4444` — error/destructive color
- `--radius: 10px`, `--radius-sm: 6px` — border radii
