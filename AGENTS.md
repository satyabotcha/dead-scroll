# AGENTS.md

## What This Project Is

Dead Scroll is a Chrome Extension for people who want to use YouTube intentionally without getting pulled into addictive feed surfaces. It removes feeds, recommendations, Shorts, comments, ads, autoplay, and similar loops while preserving direct navigation, search, account access, and video watching.

The current product scope is YouTube only. X/Twitter and LinkedIn experiments existed in earlier work, but they are not part of the current extension.

## Product Philosophy

- Remove feeds, not the whole site. Preserve intentional use.
- Prefer native YouTube controls where possible instead of rebuilding YouTube.
- Keep the extension small: no backend, no analytics, no database, no bundled framework.
- Avoid outside dependencies and npm packages wherever possible. Build from scratch by default to reduce supply-chain risk, spyware exposure, and credential-leak surface area.
- Hand-written source lives in `src/`; Chrome-loadable output lives in `production/`.
- If a selector or hide rule risks breaking search, masthead, account controls, or direct video watching, narrow it.

## Tech Stack

- **Language:** TypeScript
- **Extension platform:** Chrome Extension Manifest V3
- **Runtime:** MV3 background service worker plus YouTube content scripts
- **Build:** `scripts/build.js` copies static files and runs `tsc`
- **Bundler:** None
- **Backend/database:** None
- **State:** `chrome.storage.sync` stores the `focusMode` boolean

## How It Works

The source manifest is `manifest.json`. The Chrome-uploadable manifest is generated at `production/manifest.json`.

There are three runtime pieces:

- `src/background.ts` runs as the MV3 service worker. It toggles Focus Mode when the toolbar icon is clicked, stores the setting under `focusMode`, and swaps the focused/distracted toolbar icon.
- `src/content/youtube-dark.ts` runs at `document_start`. It stamps `html[dark]` before YouTube paints so there is no white flash.
- `src/content/youtube.ts` runs at `document_idle`. It installs the main CSS rules, observes YouTube's SPA DOM, applies Focus Mode, hides Shorts/feed surfaces, manages autoplay/theater mode, handles player ads, and injects the calm home canvas.

The early CSS file `src/content/youtube-early.css` also runs at `document_start` to set a near-black page background before YouTube's own CSS loads.

## Current YouTube Behavior

When Focus Mode is on by default, Dead Scroll:

- Hides the YouTube home feed, feed header, chips, guide drawers, mini guide, watch-page recommendations, comments, end-screen suggestions, Shorts shelves/cards/filters, and common ad surfaces.
- Keeps direct URLs, search results, search input, masthead/account controls, and video playback usable.
- Forces a dark YouTube shell and preserves dark mode if YouTube tries to remove `html[dark]`.
- Replaces the YouTube home feed with a calm full-window visual canvas below the masthead.
- Rotates calm background wallpapers daily from `assets/backgrounds/*.webp`.
- Auto-enables theater mode on watch pages.
- Disables autoplay while Focus Mode is on, then restores it only if Dead Scroll disabled it.
- Closes/skips ads where possible and temporarily speeds active player ads to `10x` while muted, restoring the user's previous playback state afterward.

## File Structure

```text
.
├── AGENTS.md                         Agent/contributor operating guide
├── README.md                         Human-facing project overview and install steps
├── soul.md                           Project values; read before work, do not edit without asking
├── learnings.md                      Session notes and codebase gotchas
├── manifest.json                     Source MV3 manifest
├── package.json                      npm scripts and TypeScript dependency
├── package-lock.json                 Locked npm dependency tree
├── tsconfig.json                     TypeScript config; emits JS into production/
├── scripts/
│   └── build.js                      Deletes/recreates production/, copies assets/CSS/manifest, runs tsc
├── src/
│   ├── background.ts                 Toolbar toggle and Focus Mode storage/icon state
│   ├── chrome.d.ts                   Minimal Chrome extension API typings
│   ├── assets/                       Source icons and extension images
│   │   └── backgrounds/              Calm home wallpapers, shipped as WebP
│   └── content/
│       ├── youtube.ts                Main YouTube Focus Mode implementation
│       ├── youtube-dark.ts           First-paint dark-mode attribute stamp
│       └── youtube-early.css         First-paint background color
├── production/                       Generated Chrome-loadable extension output
└── universe_background.png           Older standalone image asset; not referenced by manifest/build
```

Ignored local folders may exist:

- `node_modules/` from `npm install`
- `launch/` and `screenshots/` for local marketing/release media
- `.DS_Store`, `*.zip`, and local agent note variants

## Build And Load

Use Node.js and npm.

```bash
npm install
npm run typecheck
npm run build
```

`npm run build` removes `production/`, recreates it, copies `manifest.json`, copies `src/assets/`, copies `src/content/youtube-early.css`, and runs `tsc` to emit JavaScript into `production/`.

Load the extension in Chrome from `chrome://extensions` by enabling Developer mode and choosing **Load unpacked** on the `production/` folder. After changes, rebuild and reload the unpacked extension.

## Development Rules

Read `soul.md` and `learnings.md` before every task.

Before changing behavior:

- Ask one clarifying question if the task is ambiguous.
- Keep source edits in `src/`, `manifest.json`, `scripts/`, or docs as appropriate.
- Do not hand-edit generated JavaScript in `production/`; change source and rebuild.
- If adding new extension asset folders, include them in `manifest.json` `web_accessible_resources` when content scripts need to render them on YouTube.

Blast radius:

- 1-2 files: proceed.
- 3-5 files: inform the user and add tests for affected functions where practical.
- 5+ files: stop, confirm with the user, add full tests, and do not commit until approved.

After changes:

- Run `npm run typecheck`.
- Run `npm run build` if runtime extension output should change.
- Commit only files you edited, with a message like `[type]: short description`.
- Update `learnings.md` only if you hit a bug, failed approach, or durable codebase discovery.
- Update this file only for context that a future first-time contributor could not quickly infer from the repo.

## Codebase Gotchas

- Content scripts and the background worker are plain scripts, not modules. Top-level names can collide across TypeScript files during typechecking, so wrap standalone extension scripts in a top-level block or another local scope when needed.
- YouTube is a SPA with unstable DOM. Prefer narrow selectors and live DOM checks over broad container hiding.
- Do not hide broad YouTube containers unless guarded by route or context; this can remove masthead/search/account controls or valid search results.
- Search cleanup must stay route-aware. Search results should remain usable.
- Shorts appear inside normal shelves, search cards, and filters, so use both CSS selectors and DOM filtering.
- The calm canvas is anchored below the `56px` masthead. Avoid reintroducing old feed/chipbar offsets.
- Calm wallpapers should be high-quality WebP and kept lean enough for the extension package.
- The in-app browser does not reliably open `file://` previews. Serve local prototypes over `localhost` if previewing standalone HTML.

## Privacy

Dead Scroll has no backend and collects no analytics. The only extension state is the Focus Mode preference stored through Chrome extension storage.

---

*Living document. Keep it lean: add only context that helps the next person understand or safely change the project.*
