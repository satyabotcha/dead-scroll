# Dead Scroll

Dead Scroll is a Chrome extension for using YouTube intentionally. It removes addictive feed surfaces while preserving search, direct navigation, account access, and video watching.

The extension currently focuses on YouTube.

## What It Replaces

| Extension | What Dead Scroll does instead |
|---|---|
| Unhook | Hides home feed, recommendation sidebar, end-screen suggestions, and Shorts everywhere |
| uBlock Origin / AdBlock | Hides common YouTube ad surfaces; auto-skips skippable ads and speeds through active player ads at 10x |
| Dark Reader | Forces dark mode from the first pixel, with no white flash |
| Autoplay Stopper | Disables autoplay on watch pages; restores it when Focus Mode is off |
| Theater Mode Default | Auto-enables theater mode on every video |
| DF YouTube | Hides comments, sidebar, mini guide, home feed header, and chip filters |

## What It Adds

- Replaces the YouTube home feed with a calm visual scene below the masthead.
- Rotates bundled WebP wallpapers, currently including universe and desert scenes.
- Lets you toggle Focus Mode by pressing the cat icon in the extension toolbar.
- Stores only the Focus Mode preference through Chrome extension storage.

## Install From Source

> Requires Chrome/Chromium (MV3) and Node.js + npm.

1. Clone the repository:

   ```bash
   git clone https://github.com/satyabotcha/dead-scroll.git
   cd dead-scroll
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Build the extension:

   ```bash
   npm run build
   ```

4. Open Chrome and go to:

   ```text
   chrome://extensions
   ```

5. Turn on **Developer mode**.

6. Click **Load unpacked**.

7. Select the `production/` folder from this repository.

The `production/` folder is the Chrome-loadable extension output.

## Using Dead Scroll

1. Visit [youtube.com](https://www.youtube.com/).
2. Focus Mode is on by default.
3. Press the cat icon in the extension toolbar to toggle Focus Mode on or off.

When Focus Mode is on, YouTube remains usable for intentional search and watching, but feed-like surfaces are hidden.

## Development

Hand-written source lives in `src/`. Generated JavaScript and packaged extension output live in `production/`.

Useful commands:

```bash
npm run typecheck
npm run build
```

After making changes, run `npm run typecheck`, then `npm run build`, then reload the unpacked extension from `chrome://extensions`.

Do not edit generated JavaScript in `production/` directly. Update the TypeScript source, rebuild, and load the regenerated `production/` folder.

## Project Structure

```text
.
├── manifest.json                     Source Chrome Extension MV3 manifest
├── package.json                      npm scripts and TypeScript dependency
├── scripts/
│   └── build.js                      Rebuilds production/ from source files
├── src/
│   ├── background.ts                 Toolbar toggle, icon state, and Focus Mode storage
│   ├── chrome.d.ts                   Minimal Chrome API typings used by the extension
│   ├── assets/                       Source icons and bundled images
│   │   └── backgrounds/              Calm home wallpapers served to YouTube pages
│   └── content/
│       ├── youtube.ts                Main YouTube cleanup and calm canvas logic
│       ├── youtube-dark.ts           First-paint dark-mode stamp
│       └── youtube-early.css         First-paint near-black background
├── production/                       Generated Chrome-loadable extension output
└── tsconfig.json                     TypeScript compiler config
```

The build script deletes and recreates `production/`, copies the source manifest/assets/CSS, and runs `tsc` so Chrome can load the compiled extension.

## Notes For Contributors

- Read `AGENTS.md` before making non-trivial changes.
- YouTube's DOM shifts often. Prefer narrow selectors and live DOM checks over broad container hiding.
- Keep direct navigation, search results, account controls, and video playback intact.
- If new assets need to be rendered inside YouTube, add them to `manifest.json` `web_accessible_resources`.

## Privacy

Dead Scroll does not use a backend and does not collect analytics. It stores only the Focus Mode setting using Chrome extension storage.

## License

MIT
