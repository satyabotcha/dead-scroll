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
const CALM_CANVAS_MAX_DEVICE_PIXEL_RATIO = 2;
const CALM_CANVAS_FRAME_INTERVAL_MS = 1000 / 24;
const YOUTUBE_MASTHEAD_HEIGHT_PX = 56;
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
let bgImage: HTMLImageElement | null = null;
let autoplayWasDisabledByFocusMode = false;
let lastAutoplayToggleClickAt = 0;
let adWasBeingSpedThrough = false;
let playbackRateBeforeAd = 1;
let mutedBeforeAd = false;
let calmCanvasAnimationFrame = 0;
let calmCanvasResizeObserver: ResizeObserver | null = null;
let calmCanvasLastFrameAt = 0;
let effectiveStarCount = 0;

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

    html[data-feed-remover-focus-mode="true"] ytd-app > #content > #frosted-glass {
      display: none !important;
    }

    #${CALM_CANVAS_ID} {
      position: fixed;
      top: ${YOUTUBE_MASTHEAD_HEIGHT_PX}px;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 0;
      pointer-events: none;
      overflow: hidden;
      background: #060a14;
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
  calmCanvasLastFrameAt = 0;
  document.getElementById(CALM_CANVAS_ID)?.remove();
}

function resizeCalmCanvas(canvas: HTMLCanvasElement): void {
  const ratio = Math.min(window.devicePixelRatio || 1, CALM_CANVAS_MAX_DEVICE_PIXEL_RATIO);
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


function drawCalmCanvas(canvas: HTMLCanvasElement, timestamp: number): void {
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return;
  }

  resizeCalmCanvas(canvas);

  const { width, height } = canvas;
  const ratio = Math.min(window.devicePixelRatio || 1, CALM_CANVAS_MAX_DEVICE_PIXEL_RATIO);
  const t = timestamp / 1000;

  ctx.clearRect(0, 0, width, height);

  // ── Background ───────────────────────────────────────────────────────────
  if (bgImage) {
    // Cover scaling: fill the canvas without stretching, keeping aspect ratio.
    // Use the larger of the two candidate scales so no empty space shows.
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    const scaleX = width  / bgImage.naturalWidth;
    const scaleY = height / bgImage.naturalHeight;
    const scale  = Math.max(scaleX, scaleY);
    const drawW  = bgImage.naturalWidth  * scale;
    const drawH  = bgImage.naturalHeight * scale;

    // Black hole sits at ~(62%, 52%) of the source image.
    // Map that point to the canvas center, then apply gentle parallax drift.
    const focalX = bgImage.naturalWidth  * 0.62;
    const focalY = bgImage.naturalHeight * 0.52;
    const driftX = Math.sin(t * 0.042) * 10 * ratio;
    const driftY = Math.cos(t * 0.031) *  6 * ratio;
    const drawX  = width  * 0.5 - focalX * scale + driftX;
    const drawY  = height * 0.5 - focalY * scale + driftY;

    ctx.drawImage(bgImage, drawX, drawY, drawW, drawH);
    ctx.fillStyle = "rgba(0, 0, 0, 0.22)";
    ctx.fillRect(0, 0, width, height);
  } else {
    // Fallback gradient while the image loads
    const bg = ctx.createLinearGradient(0, 0, width, height);
    bg.addColorStop(0,    "#02050d");
    bg.addColorStop(0.42, "#030816");
    bg.addColorStop(0.72, "#020611");
    bg.addColorStop(1,    "#01030a");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);
  }

  // ── Accretion disk pulse ─────────────────────────────────────────────────
  // Warm orange-gold ring breathes around the black hole (~12-second cycle).
  // The inner gradient is transparent so the dark core stays dark.
  if (bgImage) {
    const bhX    = width  * 0.625;
    const bhY    = height * 0.415;
    const bhMin  = Math.min(width, height);
    const bhWave = Math.sin(t * 0.52) * 0.5 + 0.5;   // 0 → 1, period ~12 s
    const bhAlpha = 0.065 + bhWave * 0.045;
    const bhGrad = ctx.createRadialGradient(bhX, bhY, bhMin * 0.034, bhX, bhY, bhMin * 0.21);
    bhGrad.addColorStop(0,    "rgba(0,0,0,0)");
    bhGrad.addColorStop(0.22, `rgba(225, 145, 55, ${bhAlpha * 0.7})`);
    bhGrad.addColorStop(0.42, `rgba(205, 105, 30, ${bhAlpha})`);
    bhGrad.addColorStop(0.68, `rgba(155,  70, 20, ${bhAlpha * 0.35})`);
    bhGrad.addColorStop(1,    "rgba(0,0,0,0)");
    ctx.fillStyle = bhGrad;
    ctx.fillRect(0, 0, width, height);
  }

  // ── Meteors ──────────────────────────────────────────────────────────────
  // One regular meteor + one occasional second, so you almost never see two
  // at once (~96% of meteor-visible time is solo). Each crosses at least
  // half the screen before fading. Alpha = sin(π·progress) for smooth ends.

  // Helper: draw a single meteor given all parameters
  const drawMeteor = (
    seedBase: number, seed: number,
    progress: number, alpha: number,
    lineW: number
  ) => {
    const mx0   = width  * (0.08 + seededRand(seedBase + seed * 6)     * 0.82);
    const my0   = height * (0.04 + seededRand(seedBase + seed * 6 + 1) * 0.54);
    const angle = 0.12   + seededRand(seedBase + seed * 6 + 2) * 0.23;
    const len   = (115   + seededRand(seedBase + seed * 6 + 3) * 145) * ratio;
    const speed = 0.82   + seededRand(seedBase + seed * 6 + 4) * 0.36;

    const headX     = mx0 + Math.cos(angle) * len * progress * speed;
    const headY     = my0 + Math.sin(angle) * len * progress * speed;
    const trailFrac = Math.min(progress * 1.6, 1) * 0.52;
    const tailX     = headX - Math.cos(angle) * len * trailFrac;
    const tailY     = headY - Math.sin(angle) * len * trailFrac;

    const trailGrad = ctx.createLinearGradient(tailX, tailY, headX, headY);
    trailGrad.addColorStop(0,    "rgba(255,255,255,0)");
    trailGrad.addColorStop(0.55, `rgba(185, 212, 255, ${alpha * 0.30})`);
    trailGrad.addColorStop(1,    `rgba(255, 255, 255, ${alpha * 0.78})`);
    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.lineTo(headX, headY);
    ctx.strokeStyle = trailGrad;
    ctx.lineWidth   = lineW * ratio;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(headX, headY, 1.4 * ratio, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.85})`;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(headX, headY, 4.5 * ratio, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(185, 215, 255, ${alpha * 0.12})`;
    ctx.fill();
  };

  // Regular meteor — fires every ~20s
  {
    const period     = 20;
    const activeFrac = 0.18;
    const seed       = Math.floor(t / period);
    const phase      = (t % period) / period;
    if (phase <= activeFrac) {
      const progress = phase / activeFrac;
      drawMeteor(3000, seed, progress, Math.sin(progress * Math.PI), 0.9);
    }
  }

  // Occasional second meteor — fires every ~52s, offset so rarely overlaps
  {
    const period     = 52;
    const activeFrac = 0.14;
    const tOff       = t + 23;
    const seed       = Math.floor(tOff / period);
    const phase      = (tOff % period) / period;
    if (phase <= activeFrac) {
      const progress = phase / activeFrac;
      drawMeteor(3600, seed, progress, Math.sin(progress * Math.PI), 0.75);
    }
  }

  // ── Rare long meteors (2) ────────────────────────────────────────────────
  // Dramatic, slow, nearly full-width. Two independent cycles so they
  // don't always coincide.
  const drawRareMeteor = (seedBase: number, seed: number, progress: number, alpha: number) => {
    const mx0   = width  * (0.16 + seededRand(seedBase + seed * 5)     * 0.55);
    const my0   = height * (0.12 + seededRand(seedBase + seed * 5 + 1) * 0.36);
    const angle = 0.06   + seededRand(seedBase + seed * 5 + 2) * 0.13;
    const len   = (190   + seededRand(seedBase + seed * 5 + 3) * 160) * ratio;
    const headX = mx0 + Math.cos(angle) * len * progress;
    const headY = my0 + Math.sin(angle) * len * progress;
    const tailX = headX - Math.cos(angle) * len * Math.min(progress * 1.4, 1) * 0.60;
    const tailY = headY - Math.sin(angle) * len * Math.min(progress * 1.4, 1) * 0.60;

    const trailGrad = ctx.createLinearGradient(tailX, tailY, headX, headY);
    trailGrad.addColorStop(0,    "rgba(255,255,255,0)");
    trailGrad.addColorStop(0.45, `rgba(170, 205, 255, ${alpha * 0.36})`);
    trailGrad.addColorStop(1,    `rgba(255, 255, 255, ${alpha * 0.90})`);
    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.lineTo(headX, headY);
    ctx.strokeStyle = trailGrad;
    ctx.lineWidth   = 1.4 * ratio;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(headX, headY, 2.0 * ratio, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.90})`;
    ctx.fill();
  };

  { // Rare long #1 — ~65s cycle
    const period     = 65;
    const activeFrac = 0.042;
    const seed       = Math.floor(t / period);
    const phase      = (t % period) / period;
    if (phase <= activeFrac) {
      const progress = phase / activeFrac;
      drawRareMeteor(4200, seed, progress, Math.sin(progress * Math.PI));
    }
  }

  { // Rare long #2 — ~90s cycle, offset so the two rares aren't in sync
    const period     = 90;
    const activeFrac = 0.038;
    const tOff       = t + 38;
    const seed       = Math.floor(tOff / period);
    const phase      = (tOff % period) / period;
    if (phase <= activeFrac) {
      const progress = phase / activeFrac;
      drawRareMeteor(4800, seed, progress, Math.sin(progress * Math.PI));
    }
  }

  // ── Vignette ─────────────────────────────────────────────────────────────
  const vignette = ctx.createRadialGradient(
    width * 0.5, height * 0.5, Math.min(width, height) * 0.3,
    width * 0.5, height * 0.5, Math.max(width, height) * 0.72
  );
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(0,0,0,0.52)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);
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

    if (document.visibilityState === "visible" && timestamp - calmCanvasLastFrameAt >= CALM_CANVAS_FRAME_INTERVAL_MS) {
      calmCanvasLastFrameAt = timestamp;
      drawCalmCanvas(canvas, timestamp);
    }

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

function loadBgImage(): void {
  const img = new Image();
  img.src = chrome.runtime.getURL("assets/universe_background.png");
  img.onload = () => { bgImage = img; };
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
loadBgImage();

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
