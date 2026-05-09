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
] as const;

const END_OF_VIDEO_SELECTORS = [
  ".html5-endscreen",
  ".ytp-ce-element.ytp-ce-element",
  ".ytp-fullscreen-grid-stills-container",
  ".ytp-endscreen-content",
  ".ytp-videowall-still",
  ".ytp-suggestion-set"
] as const;

const COMMENTS_SELECTORS = [
  "ytd-watch-flexy #comments",
  "ytd-watch-flexy #comment-teaser",
  "ytd-comments-entry-point-header-renderer",
  "ytd-engagement-panel-section-list-renderer[target-id='engagement-panel-comments-section']"
] as const;

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
] as const;

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
] as const;

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
] as const;

const INVISIBLE_LAYOUT_SELECTORS = [
  "ytd-masthead #guide-button",
  "ytd-masthead #voice-search-button"
] as const;

const STYLE_ID = "social-media-feed-remover-youtube";
const LEGACY_VISUAL_SHELL_ID = "monk-mode-visual-shell";
const CALM_CANVAS_ID = "feed-remover-calm-canvas";
const YOUTUBE_SETTINGS_KEY = "focusMode";
const CONSTELLATION_PREVIEW_KEY = "constellationPreviewDays";
const CONSTELLATION_FOCUS_DAYS_KEY = "constellationFocusDays";
const CONSTELLATION_LAST_DATE_KEY = "constellationLastDate";
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
let calmCanvasResizeObserver: ResizeObserver | null = null;
let effectiveStarCount = 0;
let cachedGeometryCount = -1;
let cachedStars: Array<{ x: number; y: number; b: number; s: number }> = [];
let cachedEdges: Array<{ i: number; j: number; a: number }> = [];

function installFeedBlocker(): void {
  const existingStyle = document.getElementById(STYLE_ID);
  const style = existingStyle ?? document.createElement("style");

  style.id = STYLE_ID;
  style.textContent = `
    html[data-feed-remover-focus-mode="true"] ${CONTENT_SELECTORS.join(
      ",\n    html[data-feed-remover-focus-mode=\"true\"] "
    )} {
      display: none !important;
    }

    html[data-feed-remover-focus-mode="true"] ${END_OF_VIDEO_SELECTORS.join(
      ",\n    html[data-feed-remover-focus-mode=\"true\"] "
    )} {
      display: none !important;
    }

    html[data-feed-remover-focus-mode="true"] ${COMMENTS_SELECTORS.join(
      ",\n    html[data-feed-remover-focus-mode=\"true\"] "
    )} {
      display: none !important;
    }

    html[data-feed-remover-focus-mode="true"] ${SEARCH_CLEANUP_SELECTORS.join(
      ",\n    html[data-feed-remover-focus-mode=\"true\"] "
    )} {
      display: none !important;
    }

    html[data-feed-remover-focus-mode="true"] ${AD_CLEANUP_SELECTORS.join(
      ",\n    html[data-feed-remover-focus-mode=\"true\"] "
    )} {
      display: none !important;
    }

    html[data-feed-remover-focus-mode="true"] ${INVISIBLE_LAYOUT_SELECTORS.join(
      ",\n    html[data-feed-remover-focus-mode=\"true\"] "
    )} {
      visibility: hidden !important;
      pointer-events: none !important;
    }

    html[data-feed-remover-focus-mode="true"] ${SHORTS_CSS_SELECTORS.join(
      ",\n    html[data-feed-remover-focus-mode=\"true\"] "
    )} {
      display: none !important;
    }

    #${CALM_CANVAS_ID} {
      position: fixed;
      inset: 56px 0 0 0;
      z-index: 0;
      pointer-events: none;
      overflow: hidden;
      background: #080c18;
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

function removeLegacyVisualShell(): void {
  document.getElementById(LEGACY_VISUAL_SHELL_ID)?.remove();
  delete document.documentElement.dataset.monkModeView;
}

function isYouTubeHomeRoute(): boolean {
  return location.pathname === "/";
}

function removeCalmCanvas(): void {
  if (calmCanvasAnimationFrame) {
    cancelAnimationFrame(calmCanvasAnimationFrame);
    calmCanvasAnimationFrame = 0;
  }

  calmCanvasResizeObserver?.disconnect();
  calmCanvasResizeObserver = null;
  document.getElementById(CALM_CANVAS_ID)?.remove();
}

function resizeCalmCanvas(canvas: HTMLCanvasElement): void {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.max(1, Math.floor(canvas.clientWidth * ratio));
  const height = Math.max(1, Math.floor(canvas.clientHeight * ratio));

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
}

function seededRand(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function buildConstellationGeometry(count: number): void {
  if (count === cachedGeometryCount) {
    return;
  }

  cachedGeometryCount = count;
  cachedStars = Array.from({ length: count }, (_, i) => ({
    x: seededRand(i * 4),
    y: seededRand(i * 4 + 1),
    b: 0.35 + seededRand(i * 4 + 2) * 0.65,
    s: 0.4 + seededRand(i * 4 + 3) * 1.2,
  }));

  cachedEdges = [];
  const THRESHOLD = 0.18;

  cachedStars.forEach((star, i) => {
    const neighbors: Array<{ j: number; dist: number }> = [];

    cachedStars.forEach((other, j) => {
      if (j <= i) {
        return;
      }

      const dx = star.x - other.x;
      const dy = star.y - other.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < THRESHOLD) {
        neighbors.push({ j, dist });
      }
    });

    neighbors
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 3)
      .forEach(({ j, dist }) => {
        cachedEdges.push({ i, j, a: (1 - dist / THRESHOLD) * 0.35 });
      });
  });
}

function drawCalmCanvas(canvas: HTMLCanvasElement, timestamp: number): void {
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return;
  }

  resizeCalmCanvas(canvas);

  const { width, height } = canvas;
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  const t = timestamp / 1000;

  ctx.clearRect(0, 0, width, height);

  const bg = ctx.createLinearGradient(0, 0, 0, height);
  bg.addColorStop(0, "#080c18");
  bg.addColorStop(1, "#0d1525");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  const count = effectiveStarCount;

  if (count < 1) {
    ctx.fillStyle = "rgba(140, 170, 220, 0.38)";
    ctx.font = `${Math.round(15 * ratio)}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText("Your constellation awaits", width / 2, height / 2);
    return;
  }

  buildConstellationGeometry(count);

  cachedEdges.forEach(({ i, j, a }) => {
    const sa = cachedStars[i];
    const sb = cachedStars[j];

    ctx.beginPath();
    ctx.moveTo(sa.x * width, sa.y * height);
    ctx.lineTo(sb.x * width, sb.y * height);
    ctx.strokeStyle = `rgba(150, 195, 255, ${a})`;
    ctx.lineWidth = 0.55 * ratio;
    ctx.stroke();
  });

  cachedStars.forEach((star, i) => {
    const twinkle = 0.75 + Math.sin(t * star.s + i * 2.3) * 0.25;
    const alpha = star.b * twinkle;
    const sx = star.x * width;
    const sy = star.y * height;
    const size = (0.8 + star.b * 1.5) * ratio;

    ctx.beginPath();
    ctx.arc(sx, sy, size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 250, 235, ${alpha})`;
    ctx.fill();

    if (star.b > 0.7) {
      ctx.beginPath();
      ctx.arc(sx, sy, size * 3.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(190, 215, 255, ${alpha * 0.12})`;
      ctx.fill();
    }
  });

  ctx.fillStyle = "rgba(130, 165, 215, 0.5)";
  ctx.font = `${Math.round(13 * ratio)}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText(
    count === 1 ? "1 focus day" : `${count} focus days`,
    width / 2,
    height - 20 * ratio
  );
}

function startCalmCanvas(canvas: HTMLCanvasElement): void {
  const shouldReduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (shouldReduceMotion) {
    drawCalmCanvas(canvas, 0);
    return;
  }

  const tick = (timestamp: number) => {
    if (!document.getElementById(CALM_CANVAS_ID)) {
      calmCanvasAnimationFrame = 0;
      return;
    }

    drawCalmCanvas(canvas, timestamp);
    calmCanvasAnimationFrame = requestAnimationFrame(tick);
  };

  calmCanvasAnimationFrame = requestAnimationFrame(tick);
}

function ensureCalmCanvas(focusMode: boolean): void {
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

function trackFocusDay(): void {
  const today = new Date().toISOString().slice(0, 10);

  chrome.storage.local.get([CONSTELLATION_FOCUS_DAYS_KEY, CONSTELLATION_LAST_DATE_KEY], (result) => {
    if (result[CONSTELLATION_LAST_DATE_KEY] === today) {
      return;
    }

    const newCount = ((result[CONSTELLATION_FOCUS_DAYS_KEY] as number | undefined) ?? 0) + 1;

    chrome.storage.local.set({
      [CONSTELLATION_FOCUS_DAYS_KEY]: newCount,
      [CONSTELLATION_LAST_DATE_KEY]: today,
    });
  });
}

function loadConstellationStarCount(): void {
  chrome.storage.local.get([CONSTELLATION_PREVIEW_KEY, CONSTELLATION_FOCUS_DAYS_KEY], (result) => {
    const preview = result[CONSTELLATION_PREVIEW_KEY];
    const real = (result[CONSTELLATION_FOCUS_DAYS_KEY] as number | undefined) ?? 0;

    effectiveStarCount = typeof preview === "number" ? preview : real;
  });
}

function setFocusMode(focusMode: boolean): void {
  document.documentElement.dataset.feedRemoverFocusMode = String(focusMode);
  removeLegacyVisualShell();
  ensureCalmCanvas(focusMode);
  applyShortsFilter(focusMode);
  syncAutoplayMode(focusMode);
  processPlayerAds(focusMode);

  if (focusMode) {
    trackFocusDay();
  }
}

function showPreviouslyHiddenShorts(): void {
  document.querySelectorAll(`[${SHORTS_HIDDEN_ATTRIBUTE}="true"]`).forEach((element) => {
    if (element instanceof HTMLElement) {
      element.style.removeProperty("display");
      element.removeAttribute(SHORTS_HIDDEN_ATTRIBUTE);
    }
  });
}

function hideShortElement(element: HTMLElement): void {
  element.setAttribute(SHORTS_HIDDEN_ATTRIBUTE, "true");
  element.style.setProperty("display", "none", "important");
}

function hideShortContainerForLink(link: HTMLAnchorElement): void {
  const container = link.closest(SHORTS_CONTAINER_SELECTOR);

  if (container instanceof HTMLElement) {
    hideShortElement(container);
  }
}

function hideShortShelfForHeading(heading: Element): void {
  if (!heading.textContent?.trim().toLowerCase().startsWith("shorts")) {
    return;
  }

  if (heading.closest("ytd-guide-renderer, ytd-mini-guide-renderer")) {
    return;
  }

  const shelf = heading.closest(
    "ytd-reel-shelf-renderer, yt-horizontal-list-renderer, ytd-shelf-renderer, ytd-rich-section-renderer"
  );

  if (shelf instanceof HTMLElement) {
    hideShortElement(shelf);
  }
}

function hideShortSearchFilterOption(element: Element): void {
  if (location.pathname !== "/results" || element.textContent?.trim().toLowerCase() !== "shorts") {
    return;
  }

  const filterOption = element.closest("yt-chip-cloud-chip-renderer, tp-yt-paper-tab, [role='tab'], button");

  if (filterOption instanceof HTMLElement) {
    hideShortElement(filterOption);
  }
}

function applyShortsFilter(focusMode: boolean): void {
  if (!focusMode) {
    showPreviouslyHiddenShorts();
    return;
  }

  document.querySelectorAll<HTMLAnchorElement>("a[href^='/shorts/']").forEach(hideShortContainerForLink);
  document.querySelectorAll("h2, h3, yt-formatted-string").forEach(hideShortShelfForHeading);
  document.querySelectorAll(SEARCH_SHORTS_FILTER_SELECTOR).forEach(hideShortSearchFilterOption);
}

function clickAutoplayToggle(toggle: HTMLElement): boolean {
  const now = Date.now();

  if (now - lastAutoplayToggleClickAt < AUTOPLAY_CLICK_COOLDOWN_MS) {
    return false;
  }

  lastAutoplayToggleClickAt = now;
  toggle.click();
  return true;
}

function syncAutoplayMode(focusMode: boolean): void {
  const autoplayToggle = document.querySelector<HTMLElement>(AUTOPLAY_TOGGLE_SELECTOR);

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

function clickVisibleElements(selector: string): boolean {
  let clicked = false;

  document.querySelectorAll<HTMLElement>(selector).forEach((element) => {
    if (element.offsetParent) {
      element.click();
      clicked = true;
    }
  });

  return clicked;
}

function isPlayerAdActive(): boolean {
  return Array.from(document.querySelectorAll<HTMLElement>(ACTIVE_PLAYER_AD_SELECTOR)).some((element) => {
    return getComputedStyle(element).display !== "none";
  });
}

function restorePlayerAfterAd(video: HTMLVideoElement): void {
  if (!adWasBeingSpedThrough) {
    return;
  }

  video.playbackRate = playbackRateBeforeAd;
  video.muted = mutedBeforeAd;
  adWasBeingSpedThrough = false;
}

function processPlayerAds(focusMode: boolean): void {
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

function loadSettings(): void {
  chrome.storage.sync.get(YOUTUBE_SETTINGS_KEY, (result) => {
    const storedValue = result[YOUTUBE_SETTINGS_KEY];
    setFocusMode(typeof storedValue === "boolean" ? storedValue : YOUTUBE_DEFAULT_FOCUS_MODE);
  });
}

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "sync" && YOUTUBE_SETTINGS_KEY in changes) {
    setFocusMode(changes[YOUTUBE_SETTINGS_KEY].newValue !== false);
  }

  if (areaName === "local" && (CONSTELLATION_PREVIEW_KEY in changes || CONSTELLATION_FOCUS_DAYS_KEY in changes)) {
    loadConstellationStarCount();
  }
});

setFocusMode(YOUTUBE_DEFAULT_FOCUS_MODE);
installFeedBlocker();
loadSettings();
loadConstellationStarCount();

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
