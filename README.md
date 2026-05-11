# Dead Scroll

Dead Scroll is a Chrome extension for using YouTube intentionally. It removes addictive feed surfaces while preserving search, direct navigation, and video watching.

The extension currently focuses on YouTube.

## Replaces 7 Extensions

| Extension | What Dead Scroll does instead |
|---|---|
| Unhook | Hides home feed, recommendation sidebar, end-screen suggestions, and Shorts everywhere |
| uBlock Origin / AdBlock | Hides masthead/in-feed/overlay ads; auto-skips skippable ads and speeds through unskippable ones at 10x |
| SponsorBlock | Skips all pre-roll and mid-roll ads (not sponsor segments) |
| Dark Reader | Forces dark mode from the first pixel, with no white flash |
| Autoplay Stopper | Disables autoplay on watch pages; restores it when Focus Mode is off |
| Theater Mode Default | Auto-enables theater mode on every video |
| DF YouTube | Hides comments, sidebar, mini guide, home feed header, and chip filters |

## What It Adds

- Replaces the YouTube home feed with a universe scene teeming with meteors.
- Lets you toggle Focus Mode by pressing the cat icon in the extension toolbar.

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

After making changes, run `npm run build`, then reload the unpacked extension from `chrome://extensions`.

## Project Structure

```text
src/              TypeScript source and static extension assets
production/       Generated Chrome extension output
manifest.json     Source extension manifest
tsconfig.json     TypeScript compiler config
```

## Privacy

Dead Scroll does not use a backend and does not collect analytics. It stores only the Focus Mode setting using Chrome extension storage.

## License

MIT
