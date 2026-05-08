"use strict";
const HIDDEN_SELECTORS = [
    "ytd-app > #content",
    "ytd-mini-guide-renderer",
    "ytd-guide-renderer",
    "tp-yt-app-drawer",
    "ytd-masthead #guide-button",
    "ytd-masthead #voice-search-button",
    "ytd-masthead #start > *:not(ytd-topbar-logo-renderer)"
];
const STYLE_ID = "social-media-feed-remover-youtube";
function installFeedBlocker() {
    if (document.getElementById(STYLE_ID)) {
        return;
    }
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
    ${HIDDEN_SELECTORS.join(",\n    ")} {
      display: none !important;
    }

    ytd-masthead {
      display: flex !important;
      visibility: visible !important;
    }

    ytd-app {
      background: var(--yt-spec-base-background, #fff) !important;
    }
  `;
    document.documentElement.append(style);
}
installFeedBlocker();
