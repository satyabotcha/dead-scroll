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
const CALM_CANVAS_MAX_DEVICE_PIXEL_RATIO = 1.5;
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
let autoplayWasDisabledByFocusMode = false;
let lastAutoplayToggleClickAt = 0;
let adWasBeingSpedThrough = false;
let playbackRateBeforeAd = 1;
let mutedBeforeAd = false;
let calmCanvasAnimationFrame = 0;
let calmCanvasResizeObserver: ResizeObserver | null = null;
let calmCanvasLastFrameAt = 0;
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

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function smoothstep(edge0: number, edge1: number, value: number): number {
  const x = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return x * x * (3 - 2 * x);
}

function getVisibleConstellationStarCount(days: number): number {
  const progress = clamp(days, 0, 365) / 365;

  // Keep the first days sparse and sacred; fullness should arrive as depth, not visual noise.
  return Math.round(4 + 156 * Math.pow(progress, 0.82));
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
  const THRESHOLD = 0.118;

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
      .slice(0, 2)
      .forEach(({ j, dist }) => {
        const shouldConnect = seededRand(i * 97 + j * 13) > 0.38;

        if (shouldConnect) {
          cachedEdges.push({ i, j, a: (1 - dist / THRESHOLD) * 0.18 });
        }
      });
  });
}

function drawBlackHole(
  ctx: CanvasRenderingContext2D,
  bx: number,
  by: number,
  br: number,
  t: number,
  fadeIn: number,
  ratio: number
): void {
  const tilt = -0.03 + Math.sin(t * 0.018) * 0.012;
  const inner = br * 1.18;
  const outer = br * 2.25;
  const rings = 9;
  const flatY = 0.27;

  const blueWash = ctx.createRadialGradient(bx - br * 1.7, by + br * 0.8, 0, bx, by, br * 5.1);
  blueWash.addColorStop(0, `rgba(70, 82, 170, ${fadeIn * 0.1})`);
  blueWash.addColorStop(0.46, `rgba(44, 63, 145, ${fadeIn * 0.045})`);
  blueWash.addColorStop(1, "rgba(0,0,0,0)");
  ctx.beginPath();
  ctx.arc(bx - br * 1.1, by + br * 0.55, br * 4.7, 0, Math.PI * 2);
  ctx.fillStyle = blueWash;
  ctx.fill();

  const halo = ctx.createRadialGradient(bx, by, br * 0.9, bx, by, br * 3.4);
  halo.addColorStop(0, `rgba(255, 222, 165, ${fadeIn * 0.08})`);
  halo.addColorStop(0.32, `rgba(210, 155, 95, ${fadeIn * 0.05})`);
  halo.addColorStop(0.64, `rgba(130, 92, 70, ${fadeIn * 0.018})`);
  halo.addColorStop(1, "rgba(0,0,0,0)");
  ctx.beginPath();
  ctx.arc(bx, by, br * 3.4, 0, Math.PI * 2);
  ctx.fillStyle = halo;
  ctx.fill();

  const diskGradient = ctx.createLinearGradient(bx - br * 2.7, by, bx + br * 2.7, by);
  diskGradient.addColorStop(0, `rgba(205, 185, 145, ${fadeIn * 0.02})`);
  diskGradient.addColorStop(0.38, `rgba(255, 231, 188, ${fadeIn * 0.15})`);
  diskGradient.addColorStop(0.58, `rgba(238, 177, 100, ${fadeIn * 0.12})`);
  diskGradient.addColorStop(1, `rgba(170, 115, 72, ${fadeIn * 0.02})`);

  ctx.save();
  ctx.translate(bx, by);
  ctx.rotate(tilt);
  ctx.scale(1, flatY);

  for (let ri = rings - 1; ri >= 0; ri -= 1) {
    const frac = ri / (rings - 1);
    const radius = inner + frac * (outer - inner);

    ctx.beginPath();
    ctx.arc(0, 0, radius, Math.PI, 0, false);
    ctx.strokeStyle = diskGradient;
    ctx.globalAlpha = Math.pow(1 - frac, 0.85) * fadeIn * 0.42;
    ctx.lineWidth = br * 0.26;
    ctx.stroke();
  }

  ctx.restore();
  ctx.globalAlpha = 1;

  const bodyGrad = ctx.createRadialGradient(bx, by, br * 0.35, bx, by, br * 1.1);
  bodyGrad.addColorStop(0, `rgba(0,0,6,${fadeIn})`);
  bodyGrad.addColorStop(0.86, `rgba(0,0,9,${fadeIn})`);
  bodyGrad.addColorStop(1, `rgba(72,88,134,${fadeIn * 0.4})`);
  ctx.beginPath();
  ctx.arc(bx, by, br * 1.1, 0, Math.PI * 2);
  ctx.fillStyle = bodyGrad;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(bx, by, br, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(0,0,0,${fadeIn})`;
  ctx.fill();

  ctx.save();
  ctx.translate(bx, by);
  ctx.rotate(tilt);
  ctx.scale(1, flatY);

  for (let ri = rings - 1; ri >= 0; ri -= 1) {
    const frac = ri / (rings - 1);
    const radius = inner + frac * (outer - inner);

    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI, false);
    ctx.strokeStyle = diskGradient;
    ctx.globalAlpha = Math.pow(1 - frac, 0.72) * fadeIn * 0.76;
    ctx.lineWidth = br * 0.29;
    ctx.stroke();
  }

  ctx.restore();
  ctx.globalAlpha = 1;

  ctx.save();
  ctx.translate(bx, by);
  ctx.rotate(tilt);
  ctx.scale(1, flatY * 0.7);
  ctx.beginPath();
  ctx.arc(0, 0, br * 1.22, Math.PI * 0.15, Math.PI * 0.85, false);
  ctx.strokeStyle = `rgba(210, 225, 255, ${fadeIn * 0.2})`;
  ctx.lineWidth = ratio * 0.9;
  ctx.stroke();
  ctx.restore();
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
  const days = clamp(effectiveStarCount, 0, 365);
  const habitProgress = smoothstep(0, 365, days);
  const starCount = getVisibleConstellationStarCount(days);
  const constellationProgress = smoothstep(1, 120, days);
  const nebulaDepth = 0.018 + smoothstep(7, 365, days) * 0.075;

  ctx.clearRect(0, 0, width, height);

  const bg = ctx.createLinearGradient(0, 0, width, height);
  bg.addColorStop(0, "#02050d");
  bg.addColorStop(0.42, "#030816");
  bg.addColorStop(0.72, "#020611");
  bg.addColorStop(1, "#01030a");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  const nebulae = [
    { nx: 0.72, ny: 0.34, r: 0.36, rgb: "34, 108, 155", phase: 1.7, base: 0.72 },
    { nx: 0.2, ny: 0.55, r: 0.38, rgb: "54, 60, 155", phase: 0.2, base: 0.74 },
    { nx: 0.51, ny: 0.82, r: 0.29, rgb: "132, 42, 92", phase: 3.4, base: 0.45 },
    { nx: 0.47, ny: 0.4, r: 0.26, rgb: "38, 70, 130", phase: 5.1, base: 0.36 },
  ];

  nebulae.forEach(({ nx, ny, r, rgb, phase, base }) => {
    const pulse = 1 + Math.sin(t * 0.055 + phase) * 0.055;
    const cx = width * nx + Math.sin(t * 0.012 + phase) * 9 * ratio;
    const cy = height * ny + Math.cos(t * 0.01 + phase) * 7 * ratio;
    const opacity = nebulaDepth * base * pulse;
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * Math.min(width, height));

    grad.addColorStop(0, `rgba(${rgb}, ${opacity})`);
    grad.addColorStop(0.42, `rgba(${rgb}, ${opacity * 0.34})`);
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  });

  const dustCount = Math.round(45 + habitProgress * 80);

  for (let i = 0; i < dustCount; i += 1) {
    const dx = seededRand(5000 + i * 4) * width;
    const dy = seededRand(5001 + i * 4) * height;
    const da = (0.018 + seededRand(5002 + i * 4) * 0.06) * (0.6 + habitProgress * 0.34);
    const ds = (0.24 + seededRand(5003 + i * 4) * 0.46) * ratio;
    ctx.beginPath();
    ctx.arc(dx, dy, ds, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(195, 215, 255, ${da})`;
    ctx.fill();
  }

  buildConstellationGeometry(starCount);

  cachedEdges.forEach(({ i, j, a }) => {
    const sa = cachedStars[i];
    const sb = cachedStars[j];
    const alpha = a * (0.1 + constellationProgress * 0.72);

    ctx.beginPath();
    ctx.moveTo(sa.x * width, sa.y * height);
    ctx.lineTo(sb.x * width, sb.y * height);
    ctx.strokeStyle = `rgba(110, 152, 218, ${alpha})`;
    ctx.lineWidth = 0.4 * ratio;
    ctx.stroke();
  });

  cachedStars.forEach((star, i) => {
    const tw = Math.sin(t * (0.055 + star.s * 0.052) + i * 2.3) * 0.075;
    const twinkle = 0.86 + tw;
    const alpha = (0.2 + star.b * 0.68) * twinkle * (0.68 + constellationProgress * 0.32);
    const parallax = (seededRand(i * 4 + 6) - 0.5) * 5 * ratio;
    const sx = star.x * width + Math.sin(t * 0.008 + i) * parallax;
    const sy = star.y * height + Math.cos(t * 0.007 + i * 0.7) * parallax;
    const size = (0.46 + star.b * 1.05) * ratio;
    const temp = seededRand(i * 4 + 5);
    const sr = Math.round(246 - temp * 18);
    const sg = Math.round(246 - temp * 2);
    const sb2 = Math.round(225 + temp * 26);

    if (star.b > 0.55) {
      ctx.beginPath();
      ctx.arc(sx, sy, size * (4.8 + habitProgress * 1.8), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${sr}, ${sg}, ${sb2}, ${alpha * 0.065})`;
      ctx.fill();
    }

    ctx.beginPath();
    ctx.arc(sx, sy, size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${sr}, ${sg}, ${sb2}, ${alpha})`;
    ctx.fill();
  });

  const bhFadeIn = smoothstep(21, 28, days);

  if (bhFadeIn > 0) {
    const bhScale = 0.085 + smoothstep(28, 365, days) * 0.035;
    const bhR = Math.min(width, height) * bhScale;
    const bhX = width * 0.29 + Math.sin(t * 0.006) * width * 0.01;
    const bhY = height * 0.53 + Math.cos(t * 0.005) * height * 0.012;

    drawBlackHole(ctx, bhX, bhY, bhR, t, bhFadeIn, ratio);
  }

  const planetSpecs = [
    { threshold: 60, rgb: "140, 196, 238", darkRgb: "23, 61, 114", baseR: 7, ring: false, nx: 0.77, ny: 0.38 },
    { threshold: 140, rgb: "226, 191, 148", darkRgb: "80, 49, 22", baseR: 10, ring: true, nx: 0.84, ny: 0.68 },
    { threshold: 240, rgb: "198, 170, 235", darkRgb: "58, 44, 110", baseR: 8, ring: false, nx: 0.18, ny: 0.28 },
  ];

  planetSpecs.forEach(({ threshold, rgb, darkRgb, baseR, ring, nx, ny }, pi) => {
    if (days < threshold) {
      return;
    }

    const fadeIn = smoothstep(threshold, threshold + 24, days) * 0.7;
    const pr = baseR * ratio;
    const px = width * nx + Math.sin(t * 0.006 + pi * 2.4) * 4 * ratio;
    const py = height * ny + Math.cos(t * 0.005 + pi * 2.4) * 3 * ratio;

    if (ring) {
      ctx.save();
      ctx.translate(px, py);
      ctx.scale(1, 0.28);
      ctx.beginPath();
      ctx.arc(0, 0, pr * 2.5, Math.PI, 0, false);
      ctx.strokeStyle = `rgba(205, 172, 118, ${fadeIn * 0.3})`;
      ctx.lineWidth = pr * 0.34;
      ctx.stroke();
      ctx.restore();
    }

    const bodyGrad = ctx.createRadialGradient(
      px - pr * 0.32, py - pr * 0.36, pr * 0.04,
      px + pr * 0.08, py + pr * 0.12, pr * 1.25
    );
    bodyGrad.addColorStop(0, `rgba(${rgb}, ${fadeIn})`);
    bodyGrad.addColorStop(0.58, `rgba(${darkRgb}, ${fadeIn * 0.88})`);
    bodyGrad.addColorStop(1, `rgba(0, 0, 0, ${fadeIn * 0.55})`);
    ctx.beginPath();
    ctx.arc(px, py, pr, 0, Math.PI * 2);
    ctx.fillStyle = bodyGrad;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(px, py, pr * 1.18, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${rgb}, ${fadeIn * 0.05})`;
    ctx.fill();

    if (ring) {
      ctx.save();
      ctx.translate(px, py);
      ctx.scale(1, 0.28);
      ctx.beginPath();
      ctx.arc(0, 0, pr * 2.5, 0, Math.PI, false);
      ctx.strokeStyle = `rgba(215, 185, 128, ${fadeIn * 0.42})`;
      ctx.lineWidth = pr * 0.34;
      ctx.stroke();
      ctx.restore();
    }
  });

  const meteorSlots = [
    { threshold: 14, period: 41, seedBase: 3000 },
    { threshold: 180, period: 67, seedBase: 3100 },
  ] as const;

  meteorSlots.forEach(({ threshold, period, seedBase }) => {
    if (days < threshold) {
      return;
    }

    const seed = Math.floor(t / period);
    const phase = (t % period) / period;

    if (phase >= 0.045) {
      return;
    }

    const progress = phase / 0.045;
    const mx0 = width * (0.33 + seededRand(seedBase + seed * 4) * 0.48);
    const my0 = height * (0.2 + seededRand(seedBase + seed * 4 + 1) * 0.42);
    const angle = 0.05 + seededRand(seedBase + seed * 4 + 2) * 0.18;
    const len = (85 + seededRand(seedBase + seed * 4 + 3) * 90) * ratio;

    const headX = mx0 + Math.cos(angle) * len * progress;
    const headY = my0 + Math.sin(angle) * len * progress;
    const trailFrac = Math.min(progress * 1.9, 1) * 0.5;
    const tailX = headX - Math.cos(angle) * len * trailFrac;
    const tailY = headY - Math.sin(angle) * len * trailFrac;

    const alpha = progress < 0.55 ? progress / 0.55 : (1 - progress) / 0.45;

    // Trail
    const trailGrad = ctx.createLinearGradient(tailX, tailY, headX, headY);
    trailGrad.addColorStop(0, "rgba(255,255,255,0)");
    trailGrad.addColorStop(0.6, `rgba(200, 220, 255, ${alpha * 0.3})`);
    trailGrad.addColorStop(1, `rgba(255, 255, 255, ${alpha * 0.72})`);
    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.lineTo(headX, headY);
    ctx.strokeStyle = trailGrad;
    ctx.lineWidth = 1.15 * ratio;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(headX, headY, 1.6 * ratio, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.78})`;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(headX, headY, 4.4 * ratio, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(200, 225, 255, ${alpha * 0.16})`;
    ctx.fill();
  });

  const vignette = ctx.createRadialGradient(
    width * 0.5, height * 0.5, Math.min(width, height) * 0.3,
    width * 0.5, height * 0.5, Math.max(width, height) * 0.72
  );
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(0,0,0,0.48)");
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
