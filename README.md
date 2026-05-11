# Dead Scroll

Dead Scroll is a Chrome extension for using YouTube intentionally. It removes addictive feed surfaces while preserving search, direct navigation, and video watching.

The extension currently focuses on YouTube.

## What It Does

- Hides the YouTube home feed, recommendation rails, Shorts surfaces, comments, end-screen suggestions, and common ad surfaces.
- Keeps the YouTube search box, search results, account controls, and direct video pages usable.
- Adds a calm focus canvas on the YouTube home page instead of a feed.
- Lets you toggle Focus Mode from the extension toolbar icon or popup.

## Requirements

- Google Chrome or another Chromium browser that supports Manifest V3 extensions.
- Node.js and npm.

## Install From Source

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
3. Click the Dead Scroll toolbar icon to toggle Focus Mode on or off.
4. You can also open the extension popup and use the **Focus** switch.

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
