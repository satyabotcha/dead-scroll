"use strict";
const CONTENT_SELECTORS = [
    "ytd-browse[page-subtype='home'] ytd-rich-grid-renderer > #contents",
    "ytd-watch-flexy #related",
    "ytd-watch-next-secondary-results-renderer",
    "ytd-mini-guide-renderer",
    "ytd-guide-renderer",
    "tp-yt-app-drawer",
    "ytd-browse[page-subtype='home'] #header",
    "ytd-browse[page-subtype='home'] #chips",
    "ytd-browse[page-subtype='home'] #chips-wrapper",
    "ytd-browse[page-subtype='home'] yt-chip-cloud-renderer",
    "ytd-browse[page-subtype='home'] ytd-feed-filter-chip-bar-renderer"
];
const END_OF_VIDEO_SELECTORS = [
    ".html5-endscreen",
    ".ytp-ce-element.ytp-ce-element",
    ".ytp-fullscreen-grid-stills-container",
    ".ytp-endscreen-content",
    ".ytp-videowall-still",
    ".ytp-suggestion-set"
];
const COMMENTS_SELECTORS = [
    "ytd-watch-flexy #comments",
    "ytd-watch-flexy #comment-teaser",
    "ytd-comments-entry-point-header-renderer",
    "ytd-engagement-panel-section-list-renderer[target-id='engagement-panel-comments-section']"
];
const SEARCH_CLEANUP_SELECTORS = [
    "div.sbdd_a",
    ".searchbox-dropdown",
    ".ytSearchboxComponentSuggestionsContainer",
    "yt-searchbox-suggestions",
    "yt-searchbox [role='listbox']",
    "ytd-search ytd-search-pyv-renderer",
    "ytd-search ytd-ad-slot-renderer",
    "ytd-search ytd-promoted-video-renderer",
    "ytd-search ytd-promoted-sparkles-web-renderer",
    "ytd-search ytd-in-feed-ad-layout-renderer",
    "ytd-search ytd-carousel-ad-renderer",
    "ytd-search ytd-display-ad-renderer"
];
const SHORTS_CSS_SELECTORS = [
    "ytd-reel-shelf-renderer",
    "ytd-reel-video-renderer",
    "grid-shelf-view-model:has(a[href^='/shorts/']) > yt-section-header-view-model",
    "grid-shelf-view-model:has(a[href^='/shorts/']) > div:has(a[href^='/shorts/'])",
    "grid-shelf-view-model:has(a[href^='/shorts/']) > div.ytGridShelfViewModel",
    "grid-shelf-view-model:has(a[href^='/shorts/']) button",
    "yt-horizontal-list-renderer:has(a[href^='/shorts/'])",
    "ytd-shelf-renderer:has(a[href^='/shorts/'])",
    "ytd-rich-section-renderer:has(a[href^='/shorts/'])",
    "ytd-rich-item-renderer:has(a[href^='/shorts/'])",
    "ytd-video-renderer:has(a[href^='/shorts/'])",
    "ytd-grid-video-renderer:has(a[href^='/shorts/'])",
    "ytd-compact-video-renderer:has(a[href^='/shorts/'])",
    "ytd-playlist-video-renderer:has(a[href^='/shorts/'])",
    "yt-lockup-view-model:has(a[href^='/shorts/'])",
    "a[href^='/shorts/']"
];
const INVISIBLE_LAYOUT_SELECTORS = [
    "ytd-masthead #guide-button",
    "ytd-masthead #voice-search-button",
    "ytd-masthead #start > *:not(ytd-topbar-logo-renderer)"
];
const STYLE_ID = "social-media-feed-remover-youtube";
const HOME_FOCUS_ID = "feed-remover-home-focus";
const YOUTUBE_SETTINGS_KEY = "focusMode";
const YOUTUBE_DEFAULT_FOCUS_MODE = true;
const AUTOPLAY_TOGGLE_SELECTOR = ".ytp-autonav-toggle-button[aria-checked]";
const AUTOPLAY_CLICK_COOLDOWN_MS = 750;
const SHORTS_HIDDEN_ATTRIBUTE = "data-feed-remover-shorts-hidden";
const SHORTS_CONTAINER_SELECTOR = [
    "ytd-video-renderer",
    "ytd-rich-item-renderer",
    "ytd-grid-video-renderer",
    "ytd-compact-video-renderer",
    "ytd-playlist-video-renderer",
    "ytd-reel-video-renderer",
    "ytd-reel-shelf-renderer",
    "yt-horizontal-list-renderer",
    "ytd-shelf-renderer",
    "ytd-rich-section-renderer"
].join(",");
let autoplayWasDisabledByFocusMode = false;
let lastAutoplayToggleClickAt = 0;
function installFeedBlocker() {
    const existingStyle = document.getElementById(STYLE_ID);
    const style = existingStyle ?? document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
    html[data-feed-remover-focus-mode="true"] ${CONTENT_SELECTORS.join(",\n    html[data-feed-remover-focus-mode=\"true\"] ")} {
      display: none !important;
    }

    html[data-feed-remover-focus-mode="true"] ${END_OF_VIDEO_SELECTORS.join(",\n    html[data-feed-remover-focus-mode=\"true\"] ")} {
      display: none !important;
    }

    html[data-feed-remover-focus-mode="true"] ${COMMENTS_SELECTORS.join(",\n    html[data-feed-remover-focus-mode=\"true\"] ")} {
      display: none !important;
    }

    html[data-feed-remover-focus-mode="true"] ${SEARCH_CLEANUP_SELECTORS.join(",\n    html[data-feed-remover-focus-mode=\"true\"] ")} {
      display: none !important;
    }

    html[data-feed-remover-focus-mode="true"] ${INVISIBLE_LAYOUT_SELECTORS.join(",\n    html[data-feed-remover-focus-mode=\"true\"] ")} {
      visibility: hidden !important;
      pointer-events: none !important;
    }

    html[data-feed-remover-focus-mode="true"] ${SHORTS_CSS_SELECTORS.join(",\n    html[data-feed-remover-focus-mode=\"true\"] ")} {
      display: none !important;
    }

    #${HOME_FOCUS_ID} {
      display: none;
      position: fixed;
      inset: 0;
      overflow: hidden;
      z-index: 1;
      isolation: isolate;
      pointer-events: none;
      background:
        radial-gradient(ellipse at 50% 108%, rgba(239, 250, 243, 0.86), transparent 34%),
        radial-gradient(ellipse at 22% 22%, rgba(113, 186, 196, 0.5), transparent 34%),
        linear-gradient(180deg, #eef8f6 0%, #78aeb8 46%, #123d4a 100%);
      color: #fff;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    html[data-feed-remover-home-focus="true"],
    html[data-feed-remover-home-focus="true"] body {
      background: transparent !important;
    }

    html[data-feed-remover-home-focus="true"] ytd-app {
      position: relative !important;
      z-index: 2 !important;
      background: transparent !important;
    }

    html[data-feed-remover-home-focus="true"] ytd-app #content,
    html[data-feed-remover-home-focus="true"] ytd-app #page-manager,
    html[data-feed-remover-home-focus="true"] ytd-page-manager,
    html[data-feed-remover-home-focus="true"] ytd-browse[page-subtype="home"] {
      background: transparent !important;
    }

    html[data-feed-remover-home-focus="true"] #${HOME_FOCUS_ID} {
      display: block;
    }

    html[data-feed-remover-home-focus="true"] ytd-masthead {
      position: relative !important;
      z-index: 3 !important;
      background: transparent !important;
      box-shadow: none !important;
    }

    html[data-feed-remover-home-focus="true"] ytd-masthead #start {
      visibility: hidden !important;
      pointer-events: none !important;
    }

    html[data-feed-remover-home-focus="true"] ytd-masthead #center {
      width: min(720px, calc(100vw - 48px)) !important;
      max-width: min(720px, calc(100vw - 48px)) !important;
      min-width: 0 !important;
      position: fixed !important;
      top: 48vh !important;
      left: 50vw !important;
      z-index: 4 !important;
      transform: translate(-50%, -50%) !important;
      margin: 0 !important;
      padding: 0 !important;
    }

    html[data-feed-remover-home-focus="true"] ytd-masthead #center #container,
    html[data-feed-remover-home-focus="true"] ytd-masthead #center #search-form {
      width: 100% !important;
      max-width: none !important;
    }

    html[data-feed-remover-home-focus="true"] ytd-masthead #center input {
      font-size: 18px !important;
    }

    #${HOME_FOCUS_ID} video {
      width: 100%;
      height: 100%;
      object-fit: cover;
      position: absolute;
      inset: 0;
      opacity: 0.82;
      z-index: 0;
    }

    #${HOME_FOCUS_ID} video[data-feed-remover-video-missing="true"] {
      display: none;
    }

    #${HOME_FOCUS_ID}::before {
      content: "";
      position: absolute;
      inset: 0;
      z-index: 1;
      background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.16), rgba(3, 28, 36, 0.48)),
        radial-gradient(ellipse at 50% 80%, rgba(255, 255, 255, 0.18), transparent 42%);
    }

    #${HOME_FOCUS_ID}::after {
      content: "";
      width: 130%;
      height: 34%;
      position: absolute;
      left: -15%;
      bottom: -14%;
      z-index: 2;
      border-radius: 50%;
      background:
        linear-gradient(90deg, rgba(255, 255, 255, 0.62), rgba(185, 229, 222, 0.48), rgba(255, 255, 255, 0.5));
      filter: blur(24px);
    }

    @media (max-width: 640px) {
      html[data-feed-remover-home-focus="true"] ytd-masthead #center {
        width: calc(100vw - 32px) !important;
        max-width: calc(100vw - 32px) !important;
      }
    }
  `;
    if (!existingStyle) {
        document.documentElement.append(style);
    }
}
function setFocusMode(focusMode) {
    document.documentElement.dataset.feedRemoverFocusMode = String(focusMode);
    syncHomeFocus(focusMode);
    applyShortsFilter(focusMode);
    syncAutoplayMode(focusMode);
}
function isOnHomePage() {
    return location.pathname === "/" || location.pathname === "/feed/recommended";
}
function createHomeFocus() {
    const container = document.createElement("section");
    const video = document.createElement("video");
    container.id = HOME_FOCUS_ID;
    container.setAttribute("aria-label", "Focus Mode home screen");
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.src = chrome.runtime.getURL("assets/ocean-focus.mp4");
    video.addEventListener("error", () => {
        video.dataset.feedRemoverVideoMissing = "true";
    });
    container.append(video);
    return container;
}
function syncHomeFocus(focusMode) {
    const existingFocus = document.getElementById(HOME_FOCUS_ID);
    const shouldShowHomeFocus = focusMode && isOnHomePage();
    document.documentElement.dataset.feedRemoverHomeFocus = String(shouldShowHomeFocus);
    if (!shouldShowHomeFocus) {
        existingFocus?.remove();
        return;
    }
    if (existingFocus) {
        return;
    }
    document.documentElement.append(createHomeFocus());
}
function showPreviouslyHiddenShorts() {
    document.querySelectorAll(`[${SHORTS_HIDDEN_ATTRIBUTE}="true"]`).forEach((element) => {
        if (element instanceof HTMLElement) {
            element.style.removeProperty("display");
            element.removeAttribute(SHORTS_HIDDEN_ATTRIBUTE);
        }
    });
}
function hideShortElement(element) {
    element.setAttribute(SHORTS_HIDDEN_ATTRIBUTE, "true");
    element.style.setProperty("display", "none", "important");
}
function hideShortContainerForLink(link) {
    const container = link.closest(SHORTS_CONTAINER_SELECTOR);
    if (container instanceof HTMLElement) {
        hideShortElement(container);
    }
}
function hideShortShelfForHeading(heading) {
    if (!heading.textContent?.trim().toLowerCase().startsWith("shorts")) {
        return;
    }
    if (heading.closest("ytd-guide-renderer, ytd-mini-guide-renderer")) {
        return;
    }
    const shelf = heading.closest("ytd-reel-shelf-renderer, yt-horizontal-list-renderer, ytd-shelf-renderer, ytd-rich-section-renderer");
    if (shelf instanceof HTMLElement) {
        hideShortElement(shelf);
    }
}
function applyShortsFilter(focusMode) {
    if (!focusMode) {
        showPreviouslyHiddenShorts();
        return;
    }
    document.querySelectorAll("a[href^='/shorts/']").forEach(hideShortContainerForLink);
    document.querySelectorAll("h2, h3, yt-formatted-string").forEach(hideShortShelfForHeading);
}
function clickAutoplayToggle(toggle) {
    const now = Date.now();
    if (now - lastAutoplayToggleClickAt < AUTOPLAY_CLICK_COOLDOWN_MS) {
        return false;
    }
    lastAutoplayToggleClickAt = now;
    toggle.click();
    return true;
}
function syncAutoplayMode(focusMode) {
    const autoplayToggle = document.querySelector(AUTOPLAY_TOGGLE_SELECTOR);
    if (!autoplayToggle) {
        return;
    }
    const autoplayEnabled = autoplayToggle.getAttribute("aria-checked") === "true";
    if (focusMode && autoplayEnabled) {
        // Clicking the native player toggle keeps YouTube's own UI and autoplay state in sync.
        autoplayWasDisabledByFocusMode = clickAutoplayToggle(autoplayToggle);
        return;
    }
    if (!focusMode && autoplayWasDisabledByFocusMode && !autoplayEnabled) {
        if (clickAutoplayToggle(autoplayToggle)) {
            autoplayWasDisabledByFocusMode = false;
        }
    }
}
function loadSettings() {
    chrome.storage.sync.get(YOUTUBE_SETTINGS_KEY, (result) => {
        const storedValue = result[YOUTUBE_SETTINGS_KEY];
        setFocusMode(typeof storedValue === "boolean" ? storedValue : YOUTUBE_DEFAULT_FOCUS_MODE);
    });
}
chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== "sync" || !(YOUTUBE_SETTINGS_KEY in changes)) {
        return;
    }
    setFocusMode(changes[YOUTUBE_SETTINGS_KEY].newValue !== false);
});
setFocusMode(YOUTUBE_DEFAULT_FOCUS_MODE);
installFeedBlocker();
loadSettings();
const observer = new MutationObserver(() => {
    const focusMode = document.documentElement.dataset.feedRemoverFocusMode === "true";
    syncHomeFocus(focusMode);
    applyShortsFilter(focusMode);
    syncAutoplayMode(focusMode);
});
observer.observe(document.documentElement, {
    childList: true,
    subtree: true
});
