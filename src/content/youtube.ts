const FEED_SELECTORS = [
  "ytd-rich-grid-renderer",
  "ytd-browse[page-subtype='home'] #contents",
  "ytd-browse[page-subtype='subscriptions'] #contents",
  "ytd-watch-next-secondary-results-renderer",
  "ytd-reel-shelf-renderer",
  "ytd-shorts"
] as const;

const STYLE_ID = "social-media-feed-remover-youtube";

function installFeedBlocker(): void {
  if (document.getElementById(STYLE_ID)) {
    return;
  }

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    ${FEED_SELECTORS.join(",\n    ")} {
      display: none !important;
    }
  `;

  document.documentElement.append(style);
}

installFeedBlocker();
