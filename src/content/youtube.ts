const CONTENT_SELECTORS = [
  "ytd-browse #contents > *",
  "ytd-rich-grid-renderer #contents > *",
  "ytd-search #contents > *",
  "ytd-two-column-browse-results-renderer #contents > *",
  "ytd-watch-flexy #primary-inner > *",
  "ytd-watch-flexy #secondary-inner > *",
  "ytd-mini-guide-renderer > *",
  "ytd-guide-renderer #items > *",
  "tp-yt-app-drawer #items > *"
] as const;

const INVISIBLE_LAYOUT_SELECTORS = [
  "ytd-masthead #guide-button",
  "ytd-masthead #voice-search-button",
  "ytd-masthead #start > *:not(ytd-topbar-logo-renderer)"
] as const;

const STYLE_ID = "social-media-feed-remover-youtube";

function installFeedBlocker(): void {
  if (document.getElementById(STYLE_ID)) {
    return;
  }

  const style = document.createElement("style");
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

  document.documentElement.append(style);
}

installFeedBlocker();
