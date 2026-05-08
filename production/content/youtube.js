"use strict";
const CONTENT_SELECTORS = [
    "ytd-browse[page-subtype='home']",
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
  `;
    if (!existingStyle) {
        document.documentElement.append(style);
    }
}
function setFocusMode(focusMode) {
    document.documentElement.dataset.feedRemoverFocusMode = String(focusMode);
    applyShortsFilter(focusMode);
    syncAutoplayMode(focusMode);
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
    applyShortsFilter(focusMode);
    syncAutoplayMode(focusMode);
});
observer.observe(document.documentElement, {
    childList: true,
    subtree: true
});
