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
    "ytd-masthead #guide-button",
    "ytd-masthead #voice-search-button"
];
const STYLE_ID = "social-media-feed-remover-youtube";
const LEGACY_VISUAL_SHELL_ID = "monk-mode-visual-shell";
const CALM_CANVAS_ID = "feed-remover-calm-canvas";
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
const SEARCH_SHORTS_FILTER_SELECTOR = [
    "ytd-feed-filter-chip-bar-renderer yt-chip-cloud-chip-renderer",
    "ytd-feed-filter-chip-bar-renderer yt-formatted-string",
    "yt-chip-cloud-chip-renderer",
    "yt-chip-cloud-chip-renderer yt-formatted-string",
    "tp-yt-paper-tab",
    "[role='tab']"
].join(",");
let autoplayWasDisabledByFocusMode = false;
let lastAutoplayToggleClickAt = 0;
let adWasBeingSpedThrough = false;
let playbackRateBeforeAd = 1;
let mutedBeforeAd = false;
let calmCanvasAnimationFrame = 0;
let calmCanvasResizeObserver = null;
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

    #${CALM_CANVAS_ID} {
      position: fixed;
      inset: 56px 0 0 0;
      z-index: 0;
      pointer-events: none;
      overflow: hidden;
      background:
        radial-gradient(circle at 22% 26%, rgba(210, 232, 226, 0.52), transparent 26rem),
        radial-gradient(circle at 78% 36%, rgba(209, 225, 244, 0.42), transparent 28rem),
        linear-gradient(180deg, #ffffff 0%, #f7fbff 48%, #f1faf5 100%);
    }

    #${CALM_CANVAS_ID} canvas {
      display: block;
      width: 100%;
      height: 100%;
    }
  `;
    if (!existingStyle) {
        document.documentElement.append(style);
    }
}
function removeLegacyVisualShell() {
    document.getElementById(LEGACY_VISUAL_SHELL_ID)?.remove();
    delete document.documentElement.dataset.monkModeView;
}
function isYouTubeHomeRoute() {
    return location.pathname === "/";
}
function removeCalmCanvas() {
    if (calmCanvasAnimationFrame) {
        cancelAnimationFrame(calmCanvasAnimationFrame);
        calmCanvasAnimationFrame = 0;
    }
    calmCanvasResizeObserver?.disconnect();
    calmCanvasResizeObserver = null;
    document.getElementById(CALM_CANVAS_ID)?.remove();
}
function resizeCalmCanvas(canvas) {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.floor(canvas.clientWidth * ratio));
    const height = Math.max(1, Math.floor(canvas.clientHeight * ratio));
    if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
    }
}
function drawCalmCanvas(canvas, timestamp) {
    const context = canvas.getContext("2d");
    if (!context) {
        return;
    }
    resizeCalmCanvas(canvas);
    const width = canvas.width;
    const height = canvas.height;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const t = timestamp / 1000;
    context.clearRect(0, 0, width, height);
    const background = context.createLinearGradient(0, 0, 0, height);
    background.addColorStop(0, "#ffffff");
    background.addColorStop(0.55, "#f6fbff");
    background.addColorStop(1, "#eff9f4");
    context.fillStyle = background;
    context.fillRect(0, 0, width, height);
    const haze = context.createRadialGradient(width * 0.5, height * 0.2, 0, width * 0.5, height * 0.2, width * 0.65);
    haze.addColorStop(0, "rgba(223, 238, 246, 0.52)");
    haze.addColorStop(0.55, "rgba(233, 247, 239, 0.32)");
    haze.addColorStop(1, "rgba(255, 255, 255, 0)");
    context.fillStyle = haze;
    context.fillRect(0, 0, width, height);
    context.save();
    context.globalCompositeOperation = "multiply";
    const centers = [
        [0.22, 0.28, 0],
        [0.74, 0.36, 2.1],
        [0.46, 0.72, 4.3]
    ];
    centers.forEach(([x, y, offset], centerIndex) => {
        const centerX = width * x + Math.sin(t * 0.09 + offset) * 18 * ratio;
        const centerY = height * y + Math.cos(t * 0.075 + offset) * 14 * ratio;
        const maxRadius = Math.min(width, height) * (0.22 + centerIndex * 0.035);
        for (let ringIndex = 0; ringIndex < 6; ringIndex += 1) {
            const progress = (t * 0.045 + ringIndex / 6 + centerIndex * 0.18) % 1;
            const radius = maxRadius * (0.18 + progress * 0.88);
            const alpha = (1 - progress) * 0.13;
            context.beginPath();
            context.arc(centerX, centerY, radius, 0, Math.PI * 2);
            context.strokeStyle = `rgba(96, 154, 165, ${alpha})`;
            context.lineWidth = (1.1 + (1 - progress) * 1.7) * ratio;
            context.stroke();
        }
    });
    for (let lineIndex = 0; lineIndex < 9; lineIndex += 1) {
        const baseY = height * (0.2 + lineIndex * 0.075);
        const drift = Math.sin(t * 0.11 + lineIndex * 0.7) * 10 * ratio;
        context.beginPath();
        for (let x = -40 * ratio; x <= width + 40 * ratio; x += 28 * ratio) {
            const y = baseY + drift + Math.sin(x * 0.006 + t * 0.28 + lineIndex) * 8 * ratio;
            if (x === -40 * ratio) {
                context.moveTo(x, y);
            }
            else {
                context.lineTo(x, y);
            }
        }
        context.strokeStyle = `rgba(128, 178, 165, ${0.035 + lineIndex * 0.004})`;
        context.lineWidth = 1 * ratio;
        context.stroke();
    }
    context.restore();
    context.fillStyle = "rgba(80, 116, 112, 0.58)";
    context.font = `${Math.round(18 * ratio)}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
    context.textAlign = "center";
    context.fillText("Take a breath", width / 2, Math.min(height * 0.46, 330 * ratio));
}
function startCalmCanvas(canvas) {
    const shouldReduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (shouldReduceMotion) {
        drawCalmCanvas(canvas, 0);
        return;
    }
    const tick = (timestamp) => {
        if (!document.getElementById(CALM_CANVAS_ID)) {
            calmCanvasAnimationFrame = 0;
            return;
        }
        drawCalmCanvas(canvas, timestamp);
        calmCanvasAnimationFrame = requestAnimationFrame(tick);
    };
    calmCanvasAnimationFrame = requestAnimationFrame(tick);
}
function ensureCalmCanvas(focusMode) {
    if (!focusMode || !isYouTubeHomeRoute()) {
        removeCalmCanvas();
        return;
    }
    if (document.getElementById(CALM_CANVAS_ID)) {
        return;
    }
    const shell = document.createElement("div");
    const canvas = document.createElement("canvas");
    shell.id = CALM_CANVAS_ID;
    shell.setAttribute("aria-hidden", "true");
    shell.append(canvas);
    document.body.append(shell);
    calmCanvasResizeObserver = new ResizeObserver(() => resizeCalmCanvas(canvas));
    calmCanvasResizeObserver.observe(shell);
    startCalmCanvas(canvas);
}
function setFocusMode(focusMode) {
    document.documentElement.dataset.feedRemoverFocusMode = String(focusMode);
    removeLegacyVisualShell();
    ensureCalmCanvas(focusMode);
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
function hideShortSearchFilterOption(element) {
    if (location.pathname !== "/results" || element.textContent?.trim().toLowerCase() !== "shorts") {
        return;
    }
    const filterOption = element.closest("yt-chip-cloud-chip-renderer, tp-yt-paper-tab, [role='tab'], button");
    if (filterOption instanceof HTMLElement) {
        hideShortElement(filterOption);
    }
}
function applyShortsFilter(focusMode) {
    if (!focusMode) {
        showPreviouslyHiddenShorts();
        return;
    }
    document.querySelectorAll("a[href^='/shorts/']").forEach(hideShortContainerForLink);
    document.querySelectorAll("h2, h3, yt-formatted-string").forEach(hideShortShelfForHeading);
    document.querySelectorAll(SEARCH_SHORTS_FILTER_SELECTOR).forEach(hideShortSearchFilterOption);
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
    removeLegacyVisualShell();
    ensureCalmCanvas(focusMode);
    applyShortsFilter(focusMode);
    syncAutoplayMode(focusMode);
    processPlayerAds(focusMode);
});
observer.observe(document.documentElement, {
    childList: true,
    subtree: true
});
