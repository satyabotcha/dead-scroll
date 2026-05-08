const CONTENT_SELECTORS = [
  "ytd-browse #contents > *",
  "ytd-rich-grid-renderer #contents > *",
  "ytd-watch-flexy #secondary-inner > *",
  "ytd-watch-flexy #secondary",
  "ytd-watch-next-secondary-results-renderer",
  "ytd-mini-guide-renderer",
  "ytd-guide-renderer",
  "tp-yt-app-drawer",
  "ytd-browse #header",
  "ytd-browse #chips",
  "ytd-browse #chips-wrapper",
  "ytd-browse yt-chip-cloud-renderer",
  "ytd-browse ytd-feed-filter-chip-bar-renderer"
] as const;

const INVISIBLE_LAYOUT_SELECTORS = [
  "ytd-masthead #guide-button",
  "ytd-masthead #voice-search-button",
  "ytd-masthead #start > *:not(ytd-topbar-logo-renderer)"
] as const;

const STYLE_ID = "social-media-feed-remover-youtube";

function installFeedBlocker(): void {
  const existingStyle = document.getElementById(STYLE_ID);
  const style = existingStyle ?? document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    ${CONTENT_SELECTORS.join(",\n    ")} {
      display: none !important;
    }

    ${INVISIBLE_LAYOUT_SELECTORS.join(",\n    ")} {
      visibility: hidden !important;
      pointer-events: none !important;
    }
  `;

  if (!existingStyle) {
    document.documentElement.append(style);
  }
}

installFeedBlocker();
