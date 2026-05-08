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
const AD_CLEANUP_SELECTORS = [
    "#masthead-ad",
    "ytd-mealbar-promo-renderer",
    "ytd-carousel-ad-renderer",
    ".ytd-display-ad-renderer",
    "ytd-ad-slot-renderer",
    "ytd-action-companion-ad-renderer",
    "ytd-engagement-panel-section-list-renderer[target-id='engagement-panel-ads']",
    "ytd-promoted-video-renderer",
    "ytd-promoted-sparkles-web-renderer",
    "ytd-in-feed-ad-layout-renderer",
    "ytm-companion-ad-renderer",
    "ytm-promoted-sparkles-web-renderer"
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
    "ytd-masthead #voice-search-button"
];
const STYLE_ID = "social-media-feed-remover-youtube";
const VISUAL_SHELL_ID = "monk-mode-visual-shell";
const YOUTUBE_SETTINGS_KEY = "focusMode";
const YOUTUBE_DEFAULT_FOCUS_MODE = true;
const AUTOPLAY_TOGGLE_SELECTOR = ".ytp-autonav-toggle-button[aria-checked]";
const AUTOPLAY_CLICK_COOLDOWN_MS = 750;
const AD_SKIP_BUTTON_SELECTOR = [
    ".ytp-ad-skip-button",
    ".ytp-ad-skip-button-modern",
    ".ytp-skip-ad-button",
    ".ytp-skip-ad button"
].join(",");
const AD_OVERLAY_CLOSE_BUTTON_SELECTOR = ".ytp-ad-overlay-close-button";
const ACTIVE_PLAYER_AD_SELECTOR = [
    ".ytp-ad-player-overlay-instream-info",
    ".ytp-ad-button-icon"
].join(",");
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
let adWasBeingSpedThrough = false;
let playbackRateBeforeAd = 1;
let mutedBeforeAd = false;
function installFeedBlocker() {
    const existingStyle = document.getElementById(STYLE_ID);
    const style = existingStyle ?? document.createElement("style");
    const backgroundImageUrl = chrome.runtime.getURL("assets/monk-mode-background.png");
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

    html[data-feed-remover-focus-mode="true"] ${AD_CLEANUP_SELECTORS.join(",\n    html[data-feed-remover-focus-mode=\"true\"] ")} {
      display: none !important;
    }

    html[data-feed-remover-focus-mode="true"] ${INVISIBLE_LAYOUT_SELECTORS.join(",\n    html[data-feed-remover-focus-mode=\"true\"] ")} {
      visibility: hidden !important;
      pointer-events: none !important;
    }

    html[data-feed-remover-focus-mode="true"] ${SHORTS_CSS_SELECTORS.join(",\n    html[data-feed-remover-focus-mode=\"true\"] ")} {
      display: none !important;
    }

    #${VISUAL_SHELL_ID} {
      display: none;
      position: fixed;
      inset: 0;
      z-index: 0;
      pointer-events: none;
      overflow: hidden;
      background: #fff;
      font-family: Georgia, "Times New Roman", Times, serif;
    }

    #${VISUAL_SHELL_ID}::before {
      content: "";
      position: absolute;
      inset: -1.4%;
      background-image:
        linear-gradient(180deg, rgba(255, 255, 255, 0.74) 0%, rgba(255, 255, 255, 0.34) 15%, rgba(255, 255, 255, 0.04) 50%, rgba(255, 255, 255, 0.14) 100%),
        url("${backgroundImageUrl}");
      background-size: cover;
      background-position: center 50%;
      opacity: 1;
      transform: scale(1.01);
      animation: monk-mode-scenic-drift 96s ease-in-out infinite alternate;
      will-change: transform, background-position;
    }

    #${VISUAL_SHELL_ID}::after {
      content: "";
      position: absolute;
      inset: 0;
      background:
        linear-gradient(105deg, transparent 30%, rgba(255, 255, 255, 0.08) 44%, transparent 58%),
        radial-gradient(ellipse at 50% 34%, rgba(255, 255, 255, 0.84), rgba(255, 255, 255, 0.4) 24%, transparent 50%),
        linear-gradient(90deg, rgba(255, 255, 255, 0.24), rgba(255, 255, 255, 0.02) 30%, rgba(255, 255, 255, 0.02) 70%, rgba(255, 255, 255, 0.24));
      background-size: 220% 100%, 100% 100%, 100% 100%;
      animation: monk-mode-light-drift 140s linear infinite;
      will-change: background-position;
    }

    @keyframes monk-mode-scenic-drift {
      0% {
        transform: scale(1.01) translate3d(-0.45%, -0.12%, 0);
        background-position: 49% 50%;
      }

      100% {
        transform: scale(1.035) translate3d(0.45%, 0.14%, 0);
        background-position: 51% 50%;
      }
    }

    @keyframes monk-mode-light-drift {
      0% {
        background-position: -120% 0, center, center;
      }

      100% {
        background-position: 160% 0, center, center;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      #${VISUAL_SHELL_ID}::before,
      #${VISUAL_SHELL_ID}::after {
        animation: none !important;
      }
    }

    #${VISUAL_SHELL_ID} .monk-mode-home-title {
      display: none;
      width: min(1280px, calc(100vw - 72px));
      position: absolute;
      top: 45%;
      left: 50%;
      z-index: 1;
      transform: translate(-50%, -50%);
      margin: 0;
      color: rgba(25, 31, 32, 0.92);
      font-size: 72px;
      font-weight: 500;
      line-height: 1.04;
      letter-spacing: 0;
      text-align: center;
      text-wrap: balance;
      white-space: pre-line;
      text-shadow: 0 2px 24px rgba(255, 255, 255, 0.9);
    }

    #${VISUAL_SHELL_ID} .monk-mode-search-note,
    #${VISUAL_SHELL_ID} .monk-mode-watch-note {
      display: none;
      position: fixed;
      z-index: 1;
      color: rgba(42, 57, 60, 0.48);
      font-size: 14px;
      font-weight: 600;
      letter-spacing: 0;
    }

    html[data-feed-remover-focus-mode="true"] ytd-app {
      position: relative !important;
      z-index: 1 !important;
    }

    html[data-monk-mode-view="home"] body,
    html[data-monk-mode-view="home"] ytd-app,
    html[data-monk-mode-view="home"] ytd-page-manager,
    html[data-monk-mode-view="home"] ytd-browse[page-subtype="home"] {
      background: transparent !important;
      background-color: transparent !important;
    }

    html[data-monk-mode-view="home"] #${VISUAL_SHELL_ID} {
      display: block;
    }

    html[data-monk-mode-view="home"] #${VISUAL_SHELL_ID} .monk-mode-home-title {
      display: block;
    }

    html[data-monk-mode-view="home"] ytd-browse[page-subtype="home"] {
      display: none !important;
    }

    html[data-monk-mode-view="home"] ytd-masthead {
      background: transparent !important;
      backdrop-filter: none;
      border-bottom: 0 !important;
      box-shadow: none !important;
      min-height: 80px !important;
    }

    html[data-monk-mode-view="home"] ytd-masthead #background,
    html[data-monk-mode-view="home"] ytd-masthead > #container {
      background: transparent !important;
      background-color: transparent !important;
    }

    html[data-monk-mode-view="home"] ytd-masthead > #container {
      height: 80px !important;
      min-height: 80px !important;
      align-items: center !important;
    }

    html[data-monk-mode-view="home"] ytd-masthead #center {
      width: min(780px, calc(100vw - 520px)) !important;
      min-width: 0 !important;
      max-width: 780px !important;
      position: static !important;
      transform: none !important;
      pointer-events: auto !important;
      visibility: visible !important;
      opacity: 1 !important;
    }

    html[data-monk-mode-view="home"] ytd-masthead #center #container,
    html[data-monk-mode-view="home"] ytd-masthead #center #search-form {
      width: 100% !important;
      max-width: none !important;
      min-height: 46px !important;
      height: 46px !important;
      border-color: rgba(208, 208, 208, 0.98) !important;
      border-radius: 999px !important;
      background: rgba(255, 255, 255, 0.96) !important;
      box-shadow: none !important;
      backdrop-filter: none;
    }

    html[data-monk-mode-view="home"] ytd-masthead #center input {
      font-size: 18px !important;
      font-weight: 400 !important;
    }

    html[data-monk-mode-view="home"] ytd-masthead #end {
      pointer-events: auto !important;
      visibility: visible !important;
      opacity: 1 !important;
    }

    html[data-monk-mode-view="home"] ytd-masthead #voice-search-button {
      display: none !important;
    }

    html[data-monk-mode-view="home"] ytd-masthead #start,
    html[data-monk-mode-view="home"] ytd-masthead #end *,
    html[data-monk-mode-view="home"] ytd-masthead #center * {
      visibility: visible !important;
      opacity: 1 !important;
    }

    html[data-monk-mode-view="home"] ytd-masthead #guide-button,
    html[data-monk-mode-view="home"] ytd-masthead ytd-notification-topbar-button-renderer {
      display: none !important;
    }

    @media (max-width: 1240px) {
      #${VISUAL_SHELL_ID} .monk-mode-home-title {
        font-size: 60px;
      }
    }

    @media (max-width: 920px) {
      #${VISUAL_SHELL_ID} .monk-mode-home-title {
        white-space: normal;
        top: 42%;
        font-size: 42px;
      }

      html[data-monk-mode-view="home"] ytd-masthead #center {
        width: min(560px, calc(100vw - 148px)) !important;
      }
    }

    html[data-monk-mode-view="search"] #${VISUAL_SHELL_ID} {
      display: block;
      height: 210px;
      inset: 56px 0 auto;
      opacity: 0.52;
      -webkit-mask-image: linear-gradient(180deg, #000 0%, rgba(0, 0, 0, 0.72) 42%, transparent 100%);
      mask-image: linear-gradient(180deg, #000 0%, rgba(0, 0, 0, 0.72) 42%, transparent 100%);
    }

    html[data-monk-mode-view="search"] #${VISUAL_SHELL_ID}::before {
      background-position: center 42%;
    }

    html[data-monk-mode-view="search"] #${VISUAL_SHELL_ID} .monk-mode-search-note {
      display: block;
      top: 116px;
      left: max(248px, calc(50vw - 510px));
    }

    html[data-monk-mode-view="watch"] #${VISUAL_SHELL_ID} {
      display: block;
      inset: 56px 0 0 auto;
      width: min(440px, 32vw);
      opacity: 0.58;
      -webkit-mask-image: linear-gradient(90deg, transparent 0%, rgba(0, 0, 0, 0.74) 32%, #000 100%);
      mask-image: linear-gradient(90deg, transparent 0%, rgba(0, 0, 0, 0.74) 32%, #000 100%);
    }

    html[data-monk-mode-view="watch"] #${VISUAL_SHELL_ID}::before {
      background-position: 72% center;
    }

    html[data-monk-mode-view="watch"] #${VISUAL_SHELL_ID} .monk-mode-watch-note {
      display: block;
      top: 118px;
      right: 64px;
    }

    html[data-monk-mode-view="search"] ytd-app,
    html[data-monk-mode-view="watch"] ytd-app {
      background: rgba(255, 255, 255, 0.92) !important;
    }

    html[data-monk-mode-view="search"] ytd-masthead,
    html[data-monk-mode-view="watch"] ytd-masthead {
      background: rgba(255, 255, 255, 0.84) !important;
      backdrop-filter: blur(12px);
    }
  `;
    if (!existingStyle) {
        document.documentElement.append(style);
    }
}
function getMonkModeView(focusMode) {
    if (!focusMode) {
        return "off";
    }
    if (location.pathname === "/" || location.pathname === "/feed/recommended") {
        return "home";
    }
    if (location.pathname === "/results") {
        return "search";
    }
    if (location.pathname === "/watch") {
        return "watch";
    }
    return "off";
}
function createVisualShell() {
    const shell = document.createElement("section");
    const homeTitle = document.createElement("h1");
    const searchNote = document.createElement("p");
    const watchNote = document.createElement("p");
    shell.id = VISUAL_SHELL_ID;
    shell.setAttribute("aria-hidden", "true");
    homeTitle.className = "monk-mode-home-title";
    homeTitle.textContent = "What are you\nhere to learn?";
    searchNote.className = "monk-mode-search-note";
    searchNote.textContent = "Intentional results";
    watchNote.className = "monk-mode-watch-note";
    watchNote.textContent = "Recommendations hidden";
    shell.append(homeTitle, searchNote, watchNote);
    return shell;
}
function syncVisualShell(focusMode) {
    const view = getMonkModeView(focusMode);
    document.documentElement.dataset.monkModeView = view;
    if (view === "off") {
        document.getElementById(VISUAL_SHELL_ID)?.remove();
        return;
    }
    if (!document.getElementById(VISUAL_SHELL_ID)) {
        document.documentElement.append(createVisualShell());
    }
}
function setFocusMode(focusMode) {
    document.documentElement.dataset.feedRemoverFocusMode = String(focusMode);
    syncVisualShell(focusMode);
    applyShortsFilter(focusMode);
    syncAutoplayMode(focusMode);
    processPlayerAds(focusMode);
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
function clickVisibleElements(selector) {
    let clicked = false;
    document.querySelectorAll(selector).forEach((element) => {
        if (element.offsetParent) {
            element.click();
            clicked = true;
        }
    });
    return clicked;
}
function isPlayerAdActive() {
    return Array.from(document.querySelectorAll(ACTIVE_PLAYER_AD_SELECTOR)).some((element) => {
        return getComputedStyle(element).display !== "none";
    });
}
function restorePlayerAfterAd(video) {
    if (!adWasBeingSpedThrough) {
        return;
    }
    video.playbackRate = playbackRateBeforeAd;
    video.muted = mutedBeforeAd;
    adWasBeingSpedThrough = false;
}
function processPlayerAds(focusMode) {
    const video = document.querySelector("video");
    if (!focusMode) {
        if (video instanceof HTMLVideoElement) {
            restorePlayerAfterAd(video);
        }
        return;
    }
    clickVisibleElements(AD_OVERLAY_CLOSE_BUTTON_SELECTOR);
    if (clickVisibleElements(AD_SKIP_BUTTON_SELECTOR)) {
        return;
    }
    if (!(video instanceof HTMLVideoElement)) {
        return;
    }
    if (!isPlayerAdActive()) {
        restorePlayerAfterAd(video);
        return;
    }
    if (!adWasBeingSpedThrough) {
        // Remember the user's player state so our ad fast-forward does not leak into the real video.
        playbackRateBeforeAd = video.playbackRate;
        mutedBeforeAd = video.muted;
        adWasBeingSpedThrough = true;
    }
    video.playbackRate = 10;
    video.muted = true;
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
    syncVisualShell(focusMode);
    applyShortsFilter(focusMode);
    syncAutoplayMode(focusMode);
    processPlayerAds(focusMode);
});
observer.observe(document.documentElement, {
    childList: true,
    subtree: true
});
