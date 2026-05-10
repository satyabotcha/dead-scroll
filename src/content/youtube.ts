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
let bgImageLoaded = false;
let calmCanvasShell: HTMLDivElement | null = null;
let autoplayWasDisabledByFocusMode = false;
let theaterModeAppliedForUrl = "";
let lastAutoplayToggleClickAt = 0;
let adWasBeingSpedThrough = false;
let playbackRateBeforeAd = 1;
let mutedBeforeAd = false;
let calmCanvasAnimationFrame = 0;
let calmCanvasResizeObserver: ResizeObserver | null = null;
let calmCanvasLastFrameAt = 0;

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

    /* ── Dark mode ────────────────────────────────────────────────────────── */
    /* Force near-black backgrounds on every page so the whole experience     */
    /* feels consistent — no jarring white flash when navigating.             */
    html[data-feed-remover-focus-mode="true"] ytd-app,
    html[data-feed-remover-focus-mode="true"] #page-manager,
    html[data-feed-remover-focus-mode="true"] ytd-browse,
    html[data-feed-remover-focus-mode="true"] ytd-search,
    html[data-feed-remover-focus-mode="true"] ytd-watch-flexy,
    html[data-feed-remover-focus-mode="true"] #below,
    html[data-feed-remover-focus-mode="true"] #secondary,
    html[data-feed-remover-focus-mode="true"] ytd-comments,
    html[data-feed-remover-focus-mode="true"] #masthead-container {
      background-color: #0a0a0a !important;
    }

    /* Watch page: the column holding the player and metadata */
    html[data-feed-remover-focus-mode="true"] #primary,
    html[data-feed-remover-focus-mode="true"] #primary-inner {
      background-color: #0a0a0a !important;
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
      background-color: #060a14;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: 62% 52%;
    }

    /* Gradient fade from masthead into the wallpaper — no hard edge */
    #${CALM_CANVAS_ID}::before {
      content: "";
      position: absolute;
      inset: 0;
      height: 72px;
      background: linear-gradient(to bottom, #0a0a0a 0%, transparent 100%);
      z-index: 2;
      pointer-events: none;
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

function isYouTubeWatchRoute(): boolean {
  return location.pathname === "/watch";
}

// Silently enables theater mode on watch pages so the video fills the full
// width and the empty sidebar void disappears. YouTube remembers the choice
// across sessions, so this only needs to fire once per URL.
function tryEnableTheaterMode(): void {
  if (!isYouTubeWatchRoute()) {
    theaterModeAppliedForUrl = "";
    return;
  }

  const currentUrl = location.href;
  if (theaterModeAppliedForUrl === currentUrl) return;

  // If YouTube already entered theater mode (e.g. from its own saved pref),
  // just record the URL so we don't redundantly click the button.
  const watchEl = document.querySelector("ytd-watch-flexy");
  if (watchEl?.hasAttribute("theater")) {
    theaterModeAppliedForUrl = currentUrl;
    return;
  }

  const btn = document.querySelector<HTMLButtonElement>(".ytp-size-button");
  if (btn) {
    btn.click();
    theaterModeAppliedForUrl = currentUrl;
  }
}

function removeCalmCanvas(): void {
  if (calmCanvasAnimationFrame) {
    cancelAnimationFrame(calmCanvasAnimationFrame);
    calmCanvasAnimationFrame = 0;
  }

  calmCanvasResizeObserver?.disconnect();
  calmCanvasResizeObserver = null;
  calmCanvasLastFrameAt = 0;
  calmCanvasShell = null;
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
  // The image is rendered via CSS background-image on the shell div, which
  // gives native DPR quality (no canvas scaling artifacts). We just nudge
  // background-position each frame for parallax, then draw a darkening
  // overlay on the canvas so the animation layers stay readable.
  if (bgImageLoaded && calmCanvasShell) {
    const driftX = Math.sin(t * 0.042) * 0.55;  // percent — ~8px on a 1440px viewport
    const driftY = Math.cos(t * 0.031) * 0.40;
    calmCanvasShell.style.backgroundPosition = `${62 + driftX}% ${52 + driftY}%`;
    ctx.fillStyle = "rgba(0, 0, 0, 0.22)";
    ctx.fillRect(0, 0, width, height);
  }

  // ── Accretion disk pulse ─────────────────────────────────────────────────
  // Warm orange-gold ring breathes around the black hole (~12-second cycle).
  // The inner gradient is transparent so the dark core stays dark.
  if (bgImageLoaded) {
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
  // All meteors originate from the upper-left zone (x: 2–50%, y: 2–28%) so
  // they cross the sky above/around the black hole rather than through it.
  // Alpha = sin(π·progress) — smooth fade-in and fade-out, no hard cuts.

  // One regular meteor every ~35 s — infrequent enough to feel like a moment
  {
    const period     = 35;
    const activeFrac = 0.13;
    const seed       = Math.floor(t / period);
    const phase      = (t % period) / period;
    if (phase <= activeFrac) {
      const progress = phase / activeFrac;
      const alpha    = Math.sin(progress * Math.PI);
      const mx0   = width  * (0.02 + seededRand(3000 + seed * 5)     * 0.48); // left half
      const my0   = height * (0.02 + seededRand(3001 + seed * 5 + 1) * 0.26); // upper quarter
      const angle = 0.12   + seededRand(3002 + seed * 5 + 2) * 0.23;
      const len   = (110   + seededRand(3003 + seed * 5 + 3) * 70) * ratio; // tighter range
      const speed = 0.52   + seededRand(3004 + seed * 5 + 4) * 0.08; // slow, consistent
      const headX     = mx0 + Math.cos(angle) * len * progress * speed;
      const headY     = my0 + Math.sin(angle) * len * progress * speed;
      const trailFrac = Math.min(progress * 1.8, 1) * 0.54;
      const tailX     = headX - Math.cos(angle) * len * trailFrac;
      const tailY     = headY - Math.sin(angle) * len * trailFrac;
      const trailGrad = ctx.createLinearGradient(tailX, tailY, headX, headY);
      trailGrad.addColorStop(0,    "rgba(255,255,255,0)");
      trailGrad.addColorStop(0.58, `rgba(185, 212, 255, ${alpha * 0.32})`);
      trailGrad.addColorStop(1,    `rgba(255, 255, 255, ${alpha * 0.76})`);
      ctx.beginPath(); ctx.moveTo(tailX, tailY); ctx.lineTo(headX, headY);
      ctx.strokeStyle = trailGrad; ctx.lineWidth = 0.9 * ratio; ctx.stroke();
      ctx.beginPath(); ctx.arc(headX, headY, 1.35 * ratio, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.82})`; ctx.fill();
      ctx.beginPath(); ctx.arc(headX, headY, 4.2 * ratio, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(185, 215, 255, ${alpha * 0.13})`; ctx.fill();
    }
  }

  // ── Rare long meteors (2) ────────────────────────────────────────────────
  // Dramatic, slower, longer — also start from the upper-left zone.
  { // Rare #1 — ~65s cycle
    const period     = 65;
    const activeFrac = 0.042;
    const rareSeed   = Math.floor(t / period);
    const phase      = (t % period) / period;
    if (phase <= activeFrac) {
      const progress = phase / activeFrac;
      const alpha    = Math.sin(progress * Math.PI);
      const mx0   = width  * (0.02 + seededRand(4200 + rareSeed * 4)     * 0.44);
      const my0   = height * (0.02 + seededRand(4201 + rareSeed * 4) * 0.24);
      const angle = 0.06   + seededRand(4202 + rareSeed * 4) * 0.13;
      const len   = (190   + seededRand(4203 + rareSeed * 4) * 160) * ratio;
      const headX = mx0 + Math.cos(angle) * len * progress;
      const headY = my0 + Math.sin(angle) * len * progress;
      const tailX = headX - Math.cos(angle) * len * Math.min(progress * 1.5, 1) * 0.62;
      const tailY = headY - Math.sin(angle) * len * Math.min(progress * 1.5, 1) * 0.62;
      const trailGrad = ctx.createLinearGradient(tailX, tailY, headX, headY);
      trailGrad.addColorStop(0,    "rgba(255,255,255,0)");
      trailGrad.addColorStop(0.48, `rgba(170, 205, 255, ${alpha * 0.34})`);
      trailGrad.addColorStop(1,    `rgba(255, 255, 255, ${alpha * 0.86})`);
      ctx.beginPath(); ctx.moveTo(tailX, tailY); ctx.lineTo(headX, headY);
      ctx.strokeStyle = trailGrad; ctx.lineWidth = 1.25 * ratio; ctx.stroke();
      ctx.beginPath(); ctx.arc(headX, headY, 1.9 * ratio, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.86})`; ctx.fill();
    }
  }

  { // Rare #2 — ~90s cycle, offset so the two rares never coincide
    const period     = 90;
    const activeFrac = 0.038;
    const tOff       = t + 38;
    const rareSeed   = Math.floor(tOff / period);
    const phase      = (tOff % period) / period;
    if (phase <= activeFrac) {
      const progress = phase / activeFrac;
      const alpha    = Math.sin(progress * Math.PI);
      const mx0   = width  * (0.02 + seededRand(4800 + rareSeed * 4)     * 0.44);
      const my0   = height * (0.02 + seededRand(4801 + rareSeed * 4) * 0.24);
      const angle = 0.06   + seededRand(4802 + rareSeed * 4) * 0.13;
      const len   = (190   + seededRand(4803 + rareSeed * 4) * 160) * ratio;
      const headX = mx0 + Math.cos(angle) * len * progress;
      const headY = my0 + Math.sin(angle) * len * progress;
      const tailX = headX - Math.cos(angle) * len * Math.min(progress * 1.5, 1) * 0.62;
      const tailY = headY - Math.sin(angle) * len * Math.min(progress * 1.5, 1) * 0.62;
      const trailGrad = ctx.createLinearGradient(tailX, tailY, headX, headY);
      trailGrad.addColorStop(0,    "rgba(255,255,255,0)");
      trailGrad.addColorStop(0.48, `rgba(170, 205, 255, ${alpha * 0.34})`);
      trailGrad.addColorStop(1,    `rgba(255, 255, 255, ${alpha * 0.86})`);
      ctx.beginPath(); ctx.moveTo(tailX, tailY); ctx.lineTo(headX, headY);
      ctx.strokeStyle = trailGrad; ctx.lineWidth = 1.25 * ratio; ctx.stroke();
      ctx.beginPath(); ctx.arc(headX, headY, 1.9 * ratio, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.86})`; ctx.fill();
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

  const shell = document.createElement("div") as HTMLDivElement;
  const canvas = document.createElement("canvas");

  shell.id = CALM_CANVAS_ID;
  shell.setAttribute("aria-hidden", "true");
  shell.append(canvas);
  document.body.append(shell);
  calmCanvasShell = shell;

  // If the image already loaded before this canvas was created, apply it now
  if (bgImageLoaded) {
    shell.style.backgroundImage = `url("${chrome.runtime.getURL("assets/universe_background.png")}")`;
  }

  calmCanvasResizeObserver = new ResizeObserver(() => resizeCalmCanvas(canvas));
  calmCanvasResizeObserver.observe(shell);

  startCalmCanvas(canvas);
}

function loadBgImage(): void {
  const url = chrome.runtime.getURL("assets/universe_background.png");
  const img = new Image();
  img.src = url;
  img.onload = () => {
    bgImageLoaded = true;
    // Set background-image on the shell so the browser renders it at native
    // DPR quality — far sharper than canvas drawImage scaling.
    if (calmCanvasShell) {
      calmCanvasShell.style.backgroundImage = `url("${url}")`;
    }
  };
}

function setFocusMode(focusMode: boolean): void {
  document.documentElement.dataset.feedRemoverFocusMode = String(focusMode);
  removeLegacyVisualShell();
  ensureCalmCanvas(focusMode);
  applyShortsFilter(focusMode);
  syncAutoplayMode(focusMode);
  processPlayerAds(focusMode);
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
});

// youtube-dark.ts (document_start) stamps html[dark] before first paint.
// This observer re-stamps it if YouTube's own initialisation removes it
// (which happens when the account preference is "Light" or "Device theme").
const darkAttributeObserver = new MutationObserver(() => {
  if (!document.documentElement.hasAttribute("dark")) {
    document.documentElement.setAttribute("dark", "");
  }
});
darkAttributeObserver.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ["dark"],
});

setFocusMode(YOUTUBE_DEFAULT_FOCUS_MODE);
installFeedBlocker();
loadSettings();
loadBgImage();
tryEnableTheaterMode();

const observer = new MutationObserver(() => {
  const focusMode = document.documentElement.dataset.feedRemoverFocusMode === "true";

  removeLegacyVisualShell();
  ensureCalmCanvas(focusMode);
  applyShortsFilter(focusMode);
  syncAutoplayMode(focusMode);
  processPlayerAds(focusMode);
  tryEnableTheaterMode();
});

observer.observe(document.documentElement, {
  childList: true,
  subtree: true,
});
