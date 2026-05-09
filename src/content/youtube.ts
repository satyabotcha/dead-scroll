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

    #${CALM_CANVAS_ID} {
      position: fixed;
      inset: 0;
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

function drawBlackHole(
  ctx: CanvasRenderingContext2D,
  bx: number,
  by: number,
  br: number,
  t: number,
  fadeIn: number,
  ratio: number
): void {
  const tilt = 0.14 + Math.sin(t * 0.007) * 0.035;
  const inner = br * 1.28;
  const outer = br * 3.5;
  const rings = 12;
  const flatY = 0.22;

  // Ambient warm halo
  const halo = ctx.createRadialGradient(bx, by, br * 0.8, bx, by, br * 5.5);
  halo.addColorStop(0, `rgba(255, 130, 35, ${fadeIn * 0.07})`);
  halo.addColorStop(0.35, `rgba(190, 75, 15, ${fadeIn * 0.03})`);
  halo.addColorStop(1, "rgba(0,0,0,0)");
  ctx.beginPath();
  ctx.arc(bx, by, br * 5.5, 0, Math.PI * 2);
  ctx.fillStyle = halo;
  ctx.fill();

  // Back half of accretion disk — dimmer, top arc
  ctx.save();
  ctx.translate(bx, by);
  ctx.rotate(tilt);
  ctx.scale(1, flatY);

  for (let ri = rings - 1; ri >= 0; ri -= 1) {
    const frac = ri / (rings - 1);
    const radius = inner + frac * (outer - inner);
    const r = Math.round(255 - frac * 75);
    const g = Math.round(230 - frac * 155);
    const b = Math.round(175 - frac * 155);
    const a = Math.pow(1 - frac, 0.82) * 0.45 * fadeIn;

    ctx.beginPath();
    ctx.arc(0, 0, radius, Math.PI, 0, false);
    ctx.strokeStyle = `rgba(${r},${g},${b},${a})`;
    ctx.lineWidth = br * 0.4;
    ctx.stroke();
  }

  ctx.restore();

  // Event horizon with photon sphere rim
  const bodyGrad = ctx.createRadialGradient(bx, by, br * 0.35, bx, by, br * 1.1);
  bodyGrad.addColorStop(0, `rgba(0,0,6,${fadeIn})`);
  bodyGrad.addColorStop(0.88, `rgba(0,0,10,${fadeIn})`);
  bodyGrad.addColorStop(1, `rgba(95,145,225,${fadeIn * 0.55})`);
  ctx.beginPath();
  ctx.arc(bx, by, br * 1.1, 0, Math.PI * 2);
  ctx.fillStyle = bodyGrad;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(bx, by, br, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(0,0,0,${fadeIn})`;
  ctx.fill();

  // Front half of accretion disk — brighter, bottom arc
  ctx.save();
  ctx.translate(bx, by);
  ctx.rotate(tilt);
  ctx.scale(1, flatY);

  for (let ri = rings - 1; ri >= 0; ri -= 1) {
    const frac = ri / (rings - 1);
    const radius = inner + frac * (outer - inner);
    const r = Math.round(255 - frac * 55);
    const g = Math.round(242 - frac * 168);
    const b = Math.round(192 - frac * 172);
    const a = Math.pow(1 - frac, 0.72) * 0.96 * fadeIn;

    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI, false);
    ctx.strokeStyle = `rgba(${r},${g},${b},${a})`;
    ctx.lineWidth = br * 0.4;
    ctx.stroke();
  }

  ctx.restore();

  // Relativistic Doppler hotspot — brighter on approaching side
  const hotX = bx + br * 0.9;
  const hotY = by + br * 0.08;
  const hot = ctx.createRadialGradient(hotX, hotY, 0, hotX, hotY, br * 1.15);
  hot.addColorStop(0, `rgba(255, 235, 155, ${fadeIn * 0.52})`);
  hot.addColorStop(0.38, `rgba(255, 150, 45, ${fadeIn * 0.18})`);
  hot.addColorStop(1, "rgba(0,0,0,0)");
  ctx.beginPath();
  ctx.arc(hotX, hotY, br * 1.15, 0, Math.PI * 2);
  ctx.fillStyle = hot;
  ctx.fill();

  // Subtle lensing arc above the black hole (top photon capture ring)
  ctx.save();
  ctx.translate(bx, by);
  ctx.rotate(tilt);
  ctx.scale(1, flatY * 0.65);
  ctx.beginPath();
  ctx.arc(0, 0, br * 1.22, Math.PI * 0.15, Math.PI * 0.85, false);
  ctx.strokeStyle = `rgba(200, 220, 255, ${fadeIn * 0.35})`;
  ctx.lineWidth = ratio * 1.2;
  ctx.stroke();
  ctx.restore();

  // Very faint relativistic jet perpendicular to disk
  const jetLen = br * 2.8;
  const jetAngle = tilt - Math.PI / 2;
  const jGrad = ctx.createLinearGradient(bx, by, bx + Math.cos(jetAngle) * jetLen, by + Math.sin(jetAngle) * jetLen);
  jGrad.addColorStop(0, `rgba(160, 190, 255, ${fadeIn * 0.18})`);
  jGrad.addColorStop(1, "rgba(100, 140, 255, 0)");
  ctx.beginPath();
  ctx.moveTo(bx, by);
  ctx.lineTo(bx + Math.cos(jetAngle) * jetLen, by + Math.sin(jetAngle) * jetLen);
  ctx.strokeStyle = jGrad;
  ctx.lineWidth = ratio * 1.8;
  ctx.stroke();

  const jGrad2 = ctx.createLinearGradient(bx, by, bx - Math.cos(jetAngle) * jetLen, by - Math.sin(jetAngle) * jetLen);
  jGrad2.addColorStop(0, `rgba(160, 190, 255, ${fadeIn * 0.18})`);
  jGrad2.addColorStop(1, "rgba(100, 140, 255, 0)");
  ctx.beginPath();
  ctx.moveTo(bx, by);
  ctx.lineTo(bx - Math.cos(jetAngle) * jetLen, by - Math.sin(jetAngle) * jetLen);
  ctx.strokeStyle = jGrad2;
  ctx.lineWidth = ratio * 1.8;
  ctx.stroke();
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
  const count = effectiveStarCount;

  ctx.clearRect(0, 0, width, height);

  // Deep space background
  const bg = ctx.createLinearGradient(0, 0, 0, height);
  bg.addColorStop(0, "#050810");
  bg.addColorStop(0.55, "#070c1a");
  bg.addColorStop(1, "#0a1020");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  // Galactic core glow — off-centre warm haze
  const coreGrad = ctx.createRadialGradient(
    width * 0.58, height * 0.42, 0,
    width * 0.58, height * 0.42, width * 0.5
  );
  coreGrad.addColorStop(0, "rgba(100, 115, 185, 0.06)");
  coreGrad.addColorStop(0.45, "rgba(75, 90, 160, 0.028)");
  coreGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = coreGrad;
  ctx.fillRect(0, 0, width, height);

  // Nebula clouds — breathe in and out, emerge as count grows
  const nebulaBase = Math.min(count / 25, 1) * 0.15;

  if (nebulaBase > 0.004) {
    const nebulae = [
      { nx: 0.18, ny: 0.32, r: 0.38, rgb: "128, 65, 215", phase: 0 },
      { nx: 0.76, ny: 0.58, r: 0.32, rgb: "30, 148, 198", phase: 1.9 },
      { nx: 0.52, ny: 0.14, r: 0.28, rgb: "215, 60, 110", phase: 3.6 },
      { nx: 0.88, ny: 0.24, r: 0.26, rgb: "55, 108, 225", phase: 5.2 },
    ];

    nebulae.forEach(({ nx, ny, r, rgb, phase }) => {
      const pulse = 1 + Math.sin(t * 0.19 + phase) * 0.09;
      const opacity = nebulaBase * pulse;
      const cx = width * nx + Math.sin(t * 0.052 + phase) * 16 * ratio;
      const cy = height * ny + Math.cos(t * 0.04 + phase) * 11 * ratio;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * Math.min(width, height));
      grad.addColorStop(0, `rgba(${rgb}, ${opacity})`);
      grad.addColorStop(0.45, `rgba(${rgb}, ${opacity * 0.32})`);
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    });
  }

  // Background dust field — always visible, makes space feel deep
  for (let i = 0; i < 240; i += 1) {
    const dx = seededRand(5000 + i * 4) * width;
    const dy = seededRand(5001 + i * 4) * height;
    const da = 0.07 + seededRand(5002 + i * 4) * 0.16;
    const ds = (0.28 + seededRand(5003 + i * 4) * 0.42) * ratio;
    ctx.beginPath();
    ctx.arc(dx, dy, ds, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(195, 215, 255, ${da})`;
    ctx.fill();
  }

  if (count < 1) {
    ctx.fillStyle = "rgba(140, 170, 220, 0.38)";
    ctx.font = `${Math.round(15 * ratio)}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText("Your constellation awaits", width / 2, height * 0.52);
  } else {
    buildConstellationGeometry(count);

    // Constellation edges
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

    // Constellation stars — colour temperature + dual-frequency twinkle
    cachedStars.forEach((star, i) => {
      const tw = Math.sin(t * star.s + i * 2.3) * 0.16 + Math.sin(t * star.s * 1.73 + i * 0.9) * 0.09;
      const twinkle = 0.75 + tw;
      const alpha = star.b * twinkle;
      const sx = star.x * width;
      const sy = star.y * height;
      const size = (0.72 + star.b * 1.65) * ratio;

      // Colour temperature: cool stars warm-yellow, hot stars blue-white
      const temp = seededRand(i * 4 + 5);
      const sr = Math.round(255 - temp * 28);
      const sg = Math.round(248 - temp * 6);
      const sb2 = Math.round(218 + temp * 37);

      ctx.beginPath();
      ctx.arc(sx, sy, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${sr}, ${sg}, ${sb2}, ${alpha})`;
      ctx.fill();

      // Outer glow
      if (star.b > 0.62) {
        ctx.beginPath();
        ctx.arc(sx, sy, size * 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${sr}, ${sg}, ${sb2}, ${alpha * 0.09})`;
        ctx.fill();
      }

      // 8-point sparkle for very brightest
      if (star.b > 0.85) {
        const arm = size * 5.8 * (0.8 + Math.sin(t * star.s * 0.48 + i) * 0.2);
        const diag = arm * 0.6;
        ctx.strokeStyle = `rgba(${sr}, ${sg}, ${sb2}, ${alpha * 0.36})`;
        ctx.lineWidth = 0.55 * ratio;
        ctx.beginPath();
        ctx.moveTo(sx - arm, sy); ctx.lineTo(sx + arm, sy);
        ctx.moveTo(sx, sy - arm); ctx.lineTo(sx, sy + arm);
        ctx.moveTo(sx - diag, sy - diag); ctx.lineTo(sx + diag, sy + diag);
        ctx.moveTo(sx + diag, sy - diag); ctx.lineTo(sx - diag, sy + diag);
        ctx.stroke();
      }
    });

    // Focus day count label
    ctx.fillStyle = "rgba(125, 160, 210, 0.46)";
    ctx.font = `${Math.round(13 * ratio)}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText(
      count === 1 ? "1 focus day" : `${count} focus days`,
      width / 2,
      height - 20 * ratio
    );
  }

  // Black hole — appears at 14 focus days, drifts very slowly
  if (count >= 14) {
    const bhFadeIn = Math.min((count - 14) / 18, 1);
    const bhR = Math.min(width, height) * 0.12;
    const bhX = width * 0.50
      + Math.sin(t * 0.016) * width * 0.13
      + Math.sin(t * 0.006) * width * 0.055;
    const bhY = height * 0.44
      + Math.cos(t * 0.013) * height * 0.11
      + Math.cos(t * 0.005) * height * 0.045;

    drawBlackHole(ctx, bhX, bhY, bhR, t, bhFadeIn, ratio);
  }

  // Planets — appear at focus day thresholds
  const planetSpecs = [
    { threshold: 7,  rgb: "255, 195, 130", darkRgb: "105, 50, 15",  baseR: 13, ring: false },
    { threshold: 30, rgb: "150, 215, 255", darkRgb: "22, 70, 135",  baseR: 11, ring: false },
    { threshold: 90, rgb: "225, 192, 148", darkRgb: "72, 42, 12",   baseR: 22, ring: true  },
  ];

  planetSpecs.forEach(({ threshold, rgb, darkRgb, baseR, ring }, pi) => {
    if (count < threshold) {
      return;
    }

    const fadeIn = Math.min((count - threshold) / 12, 1);
    const pr = baseR * ratio;
    const px = width * (0.14 + seededRand(800 + pi) * 0.72) + Math.sin(t * 0.018 + pi * 2.4) * 9 * ratio;
    const py = height * (0.12 + seededRand(801 + pi) * 0.72) + Math.cos(t * 0.013 + pi * 2.4) * 6 * ratio;

    if (ring) {
      ctx.save();
      ctx.translate(px, py);
      ctx.scale(1, 0.28);
      ctx.beginPath();
      ctx.arc(0, 0, pr * 2.5, Math.PI, 0, false);
      ctx.strokeStyle = `rgba(205, 172, 118, ${fadeIn * 0.42})`;
      ctx.lineWidth = pr * 0.48;
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
    ctx.fillStyle = `rgba(${rgb}, ${fadeIn * 0.06})`;
    ctx.fill();

    if (ring) {
      ctx.save();
      ctx.translate(px, py);
      ctx.scale(1, 0.28);
      ctx.beginPath();
      ctx.arc(0, 0, pr * 2.5, 0, Math.PI, false);
      ctx.strokeStyle = `rgba(215, 185, 128, ${fadeIn * 0.62})`;
      ctx.lineWidth = pr * 0.48;
      ctx.stroke();
      ctx.restore();
    }
  });

  // Meteors — 3 independent slots on staggered periods
  const meteorSlots = [
    { period: 11, seedBase: 3000 },
    { period: 17, seedBase: 3100 },
    { period: 23, seedBase: 3200 },
  ] as const;

  meteorSlots.forEach(({ period, seedBase }) => {
    const seed = Math.floor(t / period);
    const phase = (t % period) / period;

    if (phase >= 0.07) {
      return;
    }

    const progress = phase / 0.07;
    const mx0 = seededRand(seedBase + seed * 4) * width;
    const my0 = seededRand(seedBase + seed * 4 + 1) * height * 0.55;
    const angle = 0.14 + seededRand(seedBase + seed * 4 + 2) * 0.28;
    const len = (95 + seededRand(seedBase + seed * 4 + 3) * 125) * ratio;

    const headX = mx0 + Math.cos(angle) * len * progress;
    const headY = my0 + Math.sin(angle) * len * progress;
    const trailFrac = Math.min(progress * 1.9, 1) * 0.5;
    const tailX = headX - Math.cos(angle) * len * trailFrac;
    const tailY = headY - Math.sin(angle) * len * trailFrac;

    const alpha = progress < 0.55 ? progress / 0.55 : (1 - progress) / 0.45;

    // Trail
    const trailGrad = ctx.createLinearGradient(tailX, tailY, headX, headY);
    trailGrad.addColorStop(0, "rgba(255,255,255,0)");
    trailGrad.addColorStop(0.6, `rgba(200, 220, 255, ${alpha * 0.45})`);
    trailGrad.addColorStop(1, `rgba(255, 255, 255, ${alpha * 0.92})`);
    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.lineTo(headX, headY);
    ctx.strokeStyle = trailGrad;
    ctx.lineWidth = 1.6 * ratio;
    ctx.stroke();

    // Glowing head
    ctx.beginPath();
    ctx.arc(headX, headY, 2.2 * ratio, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.95})`;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(headX, headY, 5.5 * ratio, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(200, 225, 255, ${alpha * 0.22})`;
    ctx.fill();

    // Spark particles at head
    for (let sp = 0; sp < 4; sp += 1) {
      const sparkAngle = angle + (sp - 1.5) * 0.38 + seededRand(seedBase + seed * 20 + sp) * 0.22;
      const sparkLen = (7 + seededRand(seedBase + seed * 20 + sp + 10) * 11) * ratio * alpha;
      ctx.beginPath();
      ctx.moveTo(headX, headY);
      ctx.lineTo(headX - Math.cos(sparkAngle) * sparkLen, headY - Math.sin(sparkAngle) * sparkLen);
      ctx.strokeStyle = `rgba(255, 245, 210, ${alpha * 0.52})`;
      ctx.lineWidth = 0.75 * ratio;
      ctx.stroke();
    }
  });

  // Vignette — focus the eye inward
  const vignette = ctx.createRadialGradient(
    width * 0.5, height * 0.5, Math.min(width, height) * 0.3,
    width * 0.5, height * 0.5, Math.max(width, height) * 0.72
  );
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(0,0,0,0.42)");
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
