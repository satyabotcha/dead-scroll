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
let calmWebGLRenderer: CalmWebGLRenderer | null = null;

type CalmWebGLRenderer = {
  gl: WebGLRenderingContext;
  program: WebGLProgram;
  positionBuffer: WebGLBuffer;
  texture: WebGLTexture;
  positionLocation: number;
  textureCount: number;
  textureWidth: number;
  textureHeight: number;
  canvasWidth: number;
  canvasHeight: number;
  uniforms: {
    resolution: WebGLUniformLocation;
    lens: WebGLUniformLocation;
    mass: WebGLUniformLocation;
    time: WebGLUniformLocation;
  };
};

const BLACK_HOLE_VERTEX_SHADER = `
  attribute vec2 a_position;
  varying vec2 v_uv;

  void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const BLACK_HOLE_FRAGMENT_SHADER = `
  precision mediump float;

  uniform sampler2D u_texture;
  uniform vec2 u_resolution;
  uniform vec2 u_lens;
  uniform float u_mass;
  uniform float u_time;
  varying vec2 v_uv;

  void main() {
    vec2 uv = v_uv;
    vec2 delta = uv - u_lens;
    float aspect = u_resolution.x / u_resolution.y;
    vec2 aspectDelta = vec2(delta.x * aspect, delta.y);
    float dist = length(aspectDelta) + 0.018;
    float pull = u_mass / (dist * dist);
    vec2 tangent = vec2(-delta.y, delta.x);
    vec2 warped = uv - normalize(delta + 0.0001) * pull * 0.016;

    warped += tangent * pull * (0.012 + sin(u_time * 0.16) * 0.004);
    warped += sin((uv.yx + u_time * 0.018) * 22.0) * pull * 0.0016;
    warped = clamp(warped, 0.001, 0.999);

    vec3 color = texture2D(u_texture, warped).rgb;
    float eventHorizon = smoothstep(0.12, 0.065, dist);
    float ring = exp(-pow((dist - 0.155) / 0.026, 2.0));
    float outerRing = exp(-pow((dist - 0.245) / 0.07, 2.0));
    vec3 warmRing = vec3(0.96, 0.74, 0.42) * ring * 0.42;
    vec3 blueRing = vec3(0.32, 0.62, 0.92) * outerRing * 0.12;

    color += warmRing + blueRing;

    for (int i = 0; i < 3; i++) {
      float fi = float(i);
      float period = 11.0 + fi * 4.0;
      float phase = mod(u_time + fi * 3.7, period) / period;
      vec2 start = vec2(0.12 + fract(sin(fi * 42.13 + 3.1) * 43758.5453) * 0.72, 0.12 + fract(sin(fi * 17.41 + 8.4) * 43758.5453) * 0.28);
      vec2 direction = normalize(vec2(0.78, 0.24 + fi * 0.07));
      vec2 head = start + direction * phase * 0.86;
      vec2 toPixel = uv - head;
      float along = dot(toPixel, -direction);
      float across = length(toPixel + direction * along);
      float trail = smoothstep(0.18, 0.0, along) * smoothstep(0.0, 0.018, along) * smoothstep(0.012, 0.0, across);
      float life = phase < 0.18 ? sin(phase / 0.18 * 3.14159265) : 0.0;

      color += vec3(0.88, 0.94, 1.0) * trail * life * 0.95;
    }

    color = mix(color, vec3(0.0, 0.0, 0.015), eventHorizon * 0.95);
    color *= 0.88 + smoothstep(0.06, 0.48, dist) * 0.16;

    float vignette = smoothstep(0.92, 0.22, length(uv - 0.5));
    color *= 0.78 + vignette * 0.28;

    gl_FragColor = vec4(color, 1.0);
  }
`;

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
  calmWebGLRenderer = null;
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

function drawUniverseFallback(canvas: HTMLCanvasElement, timestamp: number): void {
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
  bg.addColorStop(0, "#060a14");
  bg.addColorStop(0.6, "#080e1c");
  bg.addColorStop(1, "#0b1222");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  // Milky Way band — subtle diagonal luminosity
  const mwGrad = ctx.createRadialGradient(
    width * 0.55, height * 0.45, 0,
    width * 0.55, height * 0.45, width * 0.55
  );
  mwGrad.addColorStop(0, "rgba(90, 110, 175, 0.055)");
  mwGrad.addColorStop(0.5, "rgba(70, 90, 155, 0.025)");
  mwGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = mwGrad;
  ctx.fillRect(0, 0, width, height);

  // Nebula clouds — emerge as count grows
  const nebulaOpacity = Math.min(count / 25, 1) * 0.14;

  if (nebulaOpacity > 0.005) {
    const nebulae = [
      { nx: 0.18, ny: 0.32, r: 0.38, rgb: "130, 70, 210", phase: 0 },
      { nx: 0.76, ny: 0.58, r: 0.32, rgb: "35, 150, 195", phase: 1.9 },
      { nx: 0.52, ny: 0.14, r: 0.28, rgb: "210, 65, 115", phase: 3.6 },
      { nx: 0.88, ny: 0.22, r: 0.26, rgb: "60, 110, 220", phase: 5.2 },
    ];

    nebulae.forEach(({ nx, ny, r, rgb, phase }) => {
      const cx = width * nx + Math.sin(t * 0.055 + phase) * 18 * ratio;
      const cy = height * ny + Math.cos(t * 0.042 + phase) * 12 * ratio;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * Math.min(width, height));
      grad.addColorStop(0, `rgba(${rgb}, ${nebulaOpacity})`);
      grad.addColorStop(0.45, `rgba(${rgb}, ${nebulaOpacity * 0.35})`);
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    });
  }

  if (count < 1) {
    ctx.fillStyle = "rgba(140, 170, 220, 0.36)";
    ctx.font = `${Math.round(15 * ratio)}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText("Your constellation awaits", width / 2, height * 0.52);
    return;
  }

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

  // Stars
  cachedStars.forEach((star, i) => {
    const twinkle = 0.75 + Math.sin(t * star.s + i * 2.3) * 0.25;
    const alpha = star.b * twinkle;
    const sx = star.x * width;
    const sy = star.y * height;
    const size = (0.75 + star.b * 1.6) * ratio;

    // Core
    ctx.beginPath();
    ctx.arc(sx, sy, size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 250, 235, ${alpha})`;
    ctx.fill();

    // Outer glow
    if (star.b > 0.65) {
      ctx.beginPath();
      ctx.arc(sx, sy, size * 3.8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(185, 215, 255, ${alpha * 0.1})`;
      ctx.fill();
    }

    // 4-point sparkle cross for the very brightest
    if (star.b > 0.86) {
      const armLen = size * 5.5 * (0.82 + Math.sin(t * star.s * 0.5 + i) * 0.18);
      ctx.strokeStyle = `rgba(255, 252, 240, ${alpha * 0.38})`;
      ctx.lineWidth = 0.6 * ratio;
      ctx.beginPath();
      ctx.moveTo(sx - armLen, sy);
      ctx.lineTo(sx + armLen, sy);
      ctx.moveTo(sx, sy - armLen);
      ctx.lineTo(sx, sy + armLen);
      ctx.stroke();
    }
  });

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
      // Ring behind planet (top arc)
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

    // Planet body
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

    // Atmosphere rim
    ctx.beginPath();
    ctx.arc(px, py, pr * 1.18, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${rgb}, ${fadeIn * 0.06})`;
    ctx.fill();

    if (ring) {
      // Ring in front of planet (bottom arc)
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

  // Shooting star — fires every ~14 seconds
  const shootPeriod = 14;
  const shootSeed = Math.floor(t / shootPeriod);
  const shootPhase = (t % shootPeriod) / shootPeriod;

  if (shootPhase < 0.065) {
    const progress = shootPhase / 0.065;
    const sx0 = seededRand(shootSeed * 4) * width;
    const sy0 = seededRand(shootSeed * 4 + 1) * height * 0.5;
    const angle = 0.18 + seededRand(shootSeed * 4 + 2) * 0.22;
    const len = (90 + seededRand(shootSeed * 4 + 3) * 110) * ratio;

    const headX = sx0 + Math.cos(angle) * len * progress;
    const headY = sy0 + Math.sin(angle) * len * progress;
    const tailX = headX - Math.cos(angle) * len * Math.min(progress * 1.6, 1) * 0.55;
    const tailY = headY - Math.sin(angle) * len * Math.min(progress * 1.6, 1) * 0.55;

    const shootAlpha = progress < 0.65 ? progress / 0.65 : (1 - progress) / 0.35;
    const shootGrad = ctx.createLinearGradient(tailX, tailY, headX, headY);
    shootGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
    shootGrad.addColorStop(1, `rgba(255, 255, 255, ${shootAlpha * 0.92})`);

    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.lineTo(headX, headY);
    ctx.strokeStyle = shootGrad;
    ctx.lineWidth = 1.4 * ratio;
    ctx.stroke();
  }

  // Focus day count
  ctx.fillStyle = "rgba(125, 160, 210, 0.48)";
  ctx.font = `${Math.round(13 * ratio)}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText(
    count === 1 ? "1 focus day" : `${count} focus days`,
    width / 2,
    height - 20 * ratio
  );
}

function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);

  if (!shader) {
    return null;
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function createBlackHoleProgram(gl: WebGLRenderingContext): WebGLProgram | null {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, BLACK_HOLE_VERTEX_SHADER);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, BLACK_HOLE_FRAGMENT_SHADER);

  if (!vertexShader || !fragmentShader) {
    return null;
  }

  const program = gl.createProgram();

  if (!program) {
    return null;
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }

  return program;
}

function drawConstellationTexture(context: CanvasRenderingContext2D, width: number, height: number, count: number): void {
  const ratio = 1;

  context.clearRect(0, 0, width, height);

  const bg = context.createLinearGradient(0, 0, 0, height);
  bg.addColorStop(0, "#040812");
  bg.addColorStop(0.54, "#071022");
  bg.addColorStop(1, "#09172b");
  context.fillStyle = bg;
  context.fillRect(0, 0, width, height);

  const nebulaOpacity = 0.08 + Math.min(count / 120, 1) * 0.16;
  const nebulae = [
    { nx: 0.2, ny: 0.32, r: 0.42, rgb: "116, 78, 220" },
    { nx: 0.72, ny: 0.58, r: 0.34, rgb: "42, 165, 198" },
    { nx: 0.5, ny: 0.16, r: 0.28, rgb: "207, 70, 120" }
  ];

  nebulae.forEach(({ nx, ny, r, rgb }) => {
    const cx = width * nx;
    const cy = height * ny;
    const grad = context.createRadialGradient(cx, cy, 0, cx, cy, r * Math.min(width, height));
    grad.addColorStop(0, `rgba(${rgb}, ${nebulaOpacity})`);
    grad.addColorStop(0.45, `rgba(${rgb}, ${nebulaOpacity * 0.34})`);
    grad.addColorStop(1, "rgba(0, 0, 0, 0)");
    context.fillStyle = grad;
    context.fillRect(0, 0, width, height);
  });

  const dustCount = 180;

  for (let i = 0; i < dustCount; i += 1) {
    const x = seededRand(2000 + i * 3) * width;
    const y = seededRand(2001 + i * 3) * height;
    const alpha = 0.12 + seededRand(2002 + i * 3) * 0.18;

    context.beginPath();
    context.arc(x, y, 0.55 + seededRand(2100 + i) * 0.8, 0, Math.PI * 2);
    context.fillStyle = `rgba(190, 215, 255, ${alpha})`;
    context.fill();
  }

  const starCount = Math.max(24, count);
  buildConstellationGeometry(starCount);

  cachedEdges.forEach(({ i, j, a }) => {
    const sa = cachedStars[i];
    const sb = cachedStars[j];
    context.beginPath();
    context.moveTo(sa.x * width, sa.y * height);
    context.lineTo(sb.x * width, sb.y * height);
    context.strokeStyle = `rgba(150, 195, 255, ${a * Math.min(count / 45, 1)})`;
    context.lineWidth = 0.55 * ratio;
    context.stroke();
  });

  cachedStars.forEach((star) => {
    const sx = star.x * width;
    const sy = star.y * height;
    const alpha = count < 1 ? star.b * 0.28 : star.b;
    const size = 0.7 + star.b * 1.55;

    context.beginPath();
    context.arc(sx, sy, size, 0, Math.PI * 2);
    context.fillStyle = `rgba(255, 250, 235, ${alpha})`;
    context.fill();

    if (star.b > 0.72) {
      context.beginPath();
      context.arc(sx, sy, size * 3.6, 0, Math.PI * 2);
      context.fillStyle = `rgba(185, 215, 255, ${alpha * 0.08})`;
      context.fill();
    }
  });

  context.fillStyle = "rgba(145, 178, 225, 0.52)";
  context.font = "18px system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
  context.textAlign = "center";
  context.fillText(count < 1 ? "Your constellation awaits" : count === 1 ? "1 focus day" : `${count} focus days`, width / 2, height - 34);
}

function createConstellationTextureSource(canvas: HTMLCanvasElement, count: number): HTMLCanvasElement | null {
  const source = document.createElement("canvas");
  const maxTextureSize = 1400;
  const aspect = Math.max(canvas.clientWidth / Math.max(canvas.clientHeight, 1), 0.6);

  source.width = Math.round(Math.min(maxTextureSize, Math.max(720, maxTextureSize * Math.min(aspect, 1.6) / 1.6)));
  source.height = Math.round(source.width / aspect);

  const context = source.getContext("2d");

  if (!context) {
    return null;
  }

  drawConstellationTexture(context, source.width, source.height, count);
  return source;
}

function uploadBlackHoleTexture(renderer: CalmWebGLRenderer, source: HTMLCanvasElement): void {
  const { gl, texture } = renderer;

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);

  renderer.textureCount = effectiveStarCount;
  renderer.textureWidth = source.width;
  renderer.textureHeight = source.height;
}

function createBlackHoleRenderer(canvas: HTMLCanvasElement): CalmWebGLRenderer | null {
  const gl = canvas.getContext("webgl", {
    alpha: false,
    antialias: true,
    depth: false,
    stencil: false
  });

  if (!gl) {
    return null;
  }

  const program = createBlackHoleProgram(gl);
  const positionBuffer = gl.createBuffer();
  const texture = gl.createTexture();

  if (!program || !positionBuffer || !texture) {
    return null;
  }

  const resolution = gl.getUniformLocation(program, "u_resolution");
  const lens = gl.getUniformLocation(program, "u_lens");
  const mass = gl.getUniformLocation(program, "u_mass");
  const time = gl.getUniformLocation(program, "u_time");

  if (!resolution || !lens || !mass || !time) {
    return null;
  }

  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      -1, -1,
      1, -1,
      -1, 1,
      -1, 1,
      1, -1,
      1, 1
    ]),
    gl.STATIC_DRAW
  );

  const positionLocation = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
  gl.uniform1i(gl.getUniformLocation(program, "u_texture"), 0);

  return {
    gl,
    program,
    positionBuffer,
    texture,
    positionLocation,
    textureCount: -1,
    textureWidth: 0,
    textureHeight: 0,
    canvasWidth: 0,
    canvasHeight: 0,
    uniforms: {
      resolution,
      lens,
      mass,
      time
    }
  };
}

function drawBlackHoleCanvas(canvas: HTMLCanvasElement, timestamp: number): boolean {
  resizeCalmCanvas(canvas);

  const renderer = calmWebGLRenderer ?? createBlackHoleRenderer(canvas);

  if (!renderer) {
    return false;
  }

  calmWebGLRenderer = renderer;

  if (
    renderer.textureCount !== effectiveStarCount ||
    renderer.canvasWidth !== canvas.width ||
    renderer.canvasHeight !== canvas.height
  ) {
    const source = createConstellationTextureSource(canvas, effectiveStarCount);

    if (!source) {
      return false;
    }

    uploadBlackHoleTexture(renderer, source);
    renderer.canvasWidth = canvas.width;
    renderer.canvasHeight = canvas.height;
  }

  const { gl, program, positionBuffer, positionLocation, uniforms } = renderer;
  const t = timestamp / 1000;
  const mass = 0.0018 + Math.min(effectiveStarCount, 365) / 365 * 0.0011;
  const lensX = 0.5 + Math.sin(t * 0.035) * 0.18 + Math.sin(t * 0.011) * 0.08;
  const lensY = 0.48 + Math.cos(t * 0.029) * 0.12;

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, renderer.texture);
  gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
  gl.uniform2f(uniforms.lens, lensX, lensY);
  gl.uniform1f(uniforms.mass, mass);
  gl.uniform1f(uniforms.time, t);
  gl.drawArrays(gl.TRIANGLES, 0, 6);

  return true;
}

function drawCalmCanvas(canvas: HTMLCanvasElement, timestamp: number): void {
  if (drawBlackHoleCanvas(canvas, timestamp)) {
    return;
  }

  drawUniverseFallback(canvas, timestamp);
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
