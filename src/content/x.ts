{
const X_SETTINGS_KEY = "focusMode";
const X_DEFAULT_FOCUS_MODE = true;
const STYLE_ID = "social-media-feed-remover-x";
const HIDDEN_ATTRIBUTE = "data-feed-remover-x-hidden";

const DISTRACTING_PRIMARY_NAV_SELECTORS = [
  "nav[aria-label='Primary']",
  "header[role='banner'] a[href='/compose/post']",
  "[data-testid='AppTabBar_Home_Link']",
  "[data-testid='AppTabBar_Explore_Link']",
  "[data-testid='AppTabBar_Notifications_Link']",
  "[data-testid='AppTabBar_Messages_Link']",
  "[data-testid='AppTabBar_Bookmarks_Link']",
  "[data-testid='AppTabBar_Communities_Link']",
  "nav[aria-label='Primary'] a[href='/home']",
  "nav[aria-label='Primary'] a[href='/explore']",
  "nav[aria-label='Primary'] a[href^='/i/connect_people']",
  "nav[aria-label='Primary'] a[href^='/notifications']",
  "nav[aria-label='Primary'] a[href^='/messages']",
  "nav[aria-label='Primary'] a[href^='/i/bookmarks']",
  "nav[aria-label='Primary'] a[href^='/i/communities']",
  "nav[aria-label='Primary'] a[href^='/i/grok']",
  "nav[aria-label='Primary'] a[href^='/jobs']",
  "nav[aria-label='Primary'] a[href^='/i/articles']",
  "nav[aria-label='Primary'] a[href^='/i/premium']",
  "nav[aria-label='Primary'] a[href^='/settings']"
] as const;

const GLOBAL_DISTRACTION_SELECTORS = [
  "button[aria-label='Skip to trending']",
  "[data-testid='sidebarColumn'] section",
  "[data-testid='sidebarColumn'] [aria-label='Trending']",
  "[data-testid='sidebarColumn'] [aria-label='Who to follow']",
  "[data-testid='sidebarColumn'] [aria-label='Relevant people']",
  "[data-testid='sidebarColumn'] [aria-label*='Timeline: Trending' i]",
  "[data-testid='sidebarColumn'] [data-testid='trend']",
  "[data-testid='sidebarColumn'] [data-testid='UserCell']",
  "[data-testid='sidebarColumn'] nav[aria-label='Footer']",
  "[data-testid='sidebarColumn'] section:has(a[href='/i/flow/signup'])",
  "[aria-label='Trending']",
  "[data-testid='DMDrawer']",
  "[data-testid='DMDrawerHeader']",
  "[data-testid='GrokDrawer']",
  "[data-testid='GrokDrawer_Button']",
  "button[aria-label='Grok']",
  "button[aria-label='Messages']",
  "button[aria-label='Open Grok']"
] as const;

const HOME_PAGE_SELECTORS = [
  "main [role='tablist']",
  "main [role='status']",
  "main [data-testid='cellInnerDiv']:has(article)",
  "main article",
  "main [data-testid='trend']",
  "main [data-testid='UserCell']"
] as const;

const EXPLORE_PAGE_SELECTORS = [
  "main [role='tablist']",
  "main [data-testid='cellInnerDiv']:has(article)",
  "main article",
  "main [data-testid='trend']",
  "main [data-testid='UserCell']",
  "main [aria-label='Trending']"
] as const;

const NOTIFICATIONS_PAGE_SELECTORS = [
  "main [role='tablist']",
  "main [role='status']",
  "main [data-testid='cellInnerDiv']",
  "main article",
  "main section"
] as const;

const ROUTE_NAMES = [
  "home",
  "explore",
  "notifications",
  "search",
  "compose",
  "profile",
  "post",
  "other"
] as const;

const X_INTERNAL_ROUTE_SEGMENTS = new Set([
  "compose",
  "explore",
  "home",
  "i",
  "jobs",
  "messages",
  "notifications",
  "search",
  "settings"
]);

const DISTRACTING_HEADINGS = [
  "creators for you",
  "discover more",
  "live on x",
  "new to x?",
  "people you may know",
  "premium",
  "relevant people",
  "subscribe to premium",
  "trending",
  "trends for you",
  "what's happening",
  "what’s happening",
  "who to follow",
  "you might like"
] as const;

const DISTRACTING_PRIMARY_NAV_LABELS = new Set([
  "articles",
  "chat",
  "explore",
  "follow",
  "grok",
  "home",
  "more",
  "notifications",
  "profile",
  "premium"
]);

const TEXT_CLEANUP_SELECTOR = [
  "h1",
  "h2",
  "h3",
  "div[role='heading']",
  "span",
  "div[role='status']"
].join(",");

const DISTRACTION_CONTAINER_SELECTOR = [
  "[data-testid='sidebarColumn'] section",
  "[data-testid='sidebarColumn'] [aria-label]",
  "[aria-label='Trending']",
  "aside",
  "section",
  "article"
].join(",");

type XRouteName = (typeof ROUTE_NAMES)[number];

type XStorageResult = {
  [X_SETTINGS_KEY]?: boolean;
};

function installFeedBlocker(): void {
  const existingStyle = document.getElementById(STYLE_ID);
  const style = existingStyle ?? document.createElement("style");

  style.id = STYLE_ID;
  style.textContent = `
    html[data-feed-remover-x-focus-mode="true"] ${DISTRACTING_PRIMARY_NAV_SELECTORS.join(
      ",\n    html[data-feed-remover-x-focus-mode=\"true\"] "
    )} {
      display: none !important;
    }

    html[data-feed-remover-x-focus-mode="true"] body {
      overflow-x: hidden !important;
    }

    html[data-feed-remover-x-focus-mode="true"] header[role="banner"] {
      width: 0 !important;
      min-width: 0 !important;
      flex-basis: 0 !important;
      z-index: auto !important;
    }

    html[data-feed-remover-x-focus-mode="true"] header[role="banner"] a[aria-label="X"] {
      display: flex !important;
      position: fixed !important;
      top: 12px !important;
      left: 28px !important;
      z-index: 2147483646 !important;
    }

    html[data-feed-remover-x-focus-mode="true"] header[role="banner"] button[aria-label="Account menu"] {
      display: flex !important;
      position: fixed !important;
      top: 10px !important;
      right: 28px !important;
      z-index: 2147483646 !important;
      width: auto !important;
      min-width: 0 !important;
      background: transparent !important;
    }

    html[data-feed-remover-x-focus-mode="true"] [data-testid="sidebarColumn"] {
      width: 0 !important;
      min-width: 0 !important;
      flex-basis: 0 !important;
      margin: 0 !important;
    }

    html[data-feed-remover-x-focus-mode="true"] [data-testid="sidebarColumn"] [role="search"] {
      display: block !important;
      position: fixed !important;
      top: 12px !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      width: min(560px, 46vw) !important;
      z-index: 2147483646 !important;
    }

    html[data-feed-remover-x-focus-mode="true"] main[role="main"] {
      margin-top: 72px !important;
    }

    html[data-feed-remover-x-focus-mode="true"] ${GLOBAL_DISTRACTION_SELECTORS.join(
      ",\n    html[data-feed-remover-x-focus-mode=\"true\"] "
    )} {
      display: none !important;
    }

    html[data-feed-remover-x-focus-mode="true"][data-feed-remover-x-page="home"] ${HOME_PAGE_SELECTORS.join(
      ",\n    html[data-feed-remover-x-focus-mode=\"true\"][data-feed-remover-x-page=\"home\"] "
    )} {
      display: none !important;
    }

    html[data-feed-remover-x-focus-mode="true"][data-feed-remover-x-page="explore"] ${EXPLORE_PAGE_SELECTORS.join(
      ",\n    html[data-feed-remover-x-focus-mode=\"true\"][data-feed-remover-x-page=\"explore\"] "
    )} {
      display: none !important;
    }

    html[data-feed-remover-x-focus-mode="true"][data-feed-remover-x-page="notifications"] ${NOTIFICATIONS_PAGE_SELECTORS.join(
      ",\n    html[data-feed-remover-x-focus-mode=\"true\"][data-feed-remover-x-page=\"notifications\"] "
    )} {
      display: none !important;
    }
  `;

  if (!existingStyle) {
    document.documentElement.append(style);
  }
}

function normalizedPath(): string {
  const path = location.pathname.replace(/\/+$/, "");
  return path === "" ? "/" : path;
}

function firstRouteSegment(path: string): string {
  return path.split("/").filter(Boolean)[0]?.toLowerCase() ?? "";
}

function isProfileRoute(path: string): boolean {
  const [handle, suffix, extra] = path.split("/").filter(Boolean);

  if (!handle || X_INTERNAL_ROUTE_SEGMENTS.has(handle.toLowerCase())) {
    return false;
  }

  return (
    !suffix ||
    (["with_replies", "media", "highlights", "articles"].includes(suffix) && !extra)
  );
}

function isPostRoute(path: string): boolean {
  const [, status, id] = path.split("/").filter(Boolean);
  return status === "status" && Boolean(id);
}

function getRouteName(): XRouteName {
  const path = normalizedPath();
  const firstSegment = firstRouteSegment(path);

  if (path === "/" || path === "/home") {
    return "home";
  }

  if (path === "/explore" || path.startsWith("/explore/") || path.startsWith("/i/trends")) {
    return "explore";
  }

  if (path === "/notifications" || path.startsWith("/notifications/")) {
    return "notifications";
  }

  if (path === "/search" || path.startsWith("/search/")) {
    return "search";
  }

  if (path === "/compose/post") {
    return "compose";
  }

  if (isPostRoute(path)) {
    return "post";
  }

  if (firstSegment && isProfileRoute(path)) {
    return "profile";
  }

  return "other";
}

function updatePageMarker(): void {
  document.documentElement.dataset.feedRemoverXPage = getRouteName();
}

function setFocusMode(focusMode: boolean): void {
  document.documentElement.dataset.feedRemoverXFocusMode = String(focusMode);
  updatePageMarker();
  applyTextBasedCleanup(focusMode);
}

function showPreviouslyHiddenElements(): void {
  document.querySelectorAll(`[${HIDDEN_ATTRIBUTE}="true"]`).forEach((element) => {
    if (element instanceof HTMLElement) {
      element.style.removeProperty("display");
      element.removeAttribute(HIDDEN_ATTRIBUTE);
    }
  });
}

function hideElement(element: HTMLElement): void {
  element.setAttribute(HIDDEN_ATTRIBUTE, "true");
  element.style.setProperty("display", "none", "important");
}

function normalizedText(element: Element): string {
  return element.textContent?.replace(/\s+/g, " ").trim().toLowerCase() ?? "";
}

function hasDistractingHeading(element: Element): boolean {
  const text = normalizedText(element);

  return DISTRACTING_HEADINGS.some((heading) => text === heading || text.startsWith(`${heading} `));
}

function isVariableRewardStatus(element: Element): boolean {
  const text = normalizedText(element);

  return text.startsWith("see new posts") || /^show [0-9,.]+ posts?$/.test(text) || text === "show more";
}

function hideDistractingModule(labelElement: Element): void {
  const container = labelElement.closest(DISTRACTION_CONTAINER_SELECTOR);

  if (container instanceof HTMLElement) {
    hideElement(container);
  }
}

function hideDistractingPrimaryNavItems(): void {
  document.querySelectorAll("nav[aria-label='Primary'] a, nav[aria-label='Primary'] button").forEach((element) => {
    if (!DISTRACTING_PRIMARY_NAV_LABELS.has(normalizedText(element))) {
      return;
    }

    // Some logged-in X layouts changed routes but kept stable visible nav labels.
    if (element instanceof HTMLElement) {
      hideElement(element);
    }
  });
}

function applyTextBasedCleanup(focusMode: boolean): void {
  if (!focusMode) {
    showPreviouslyHiddenElements();
    return;
  }

  hideDistractingPrimaryNavItems();

  document.querySelectorAll(TEXT_CLEANUP_SELECTOR).forEach((element) => {
    if (hasDistractingHeading(element) || isVariableRewardStatus(element)) {
      // X ships frequent class churn, so stable visible labels are safer than layout-class guesses here.
      hideDistractingModule(element);
    }
  });
}

function loadSettings(): void {
  chrome.storage.sync.get(X_SETTINGS_KEY, (result: XStorageResult) => {
    const storedValue = result[X_SETTINGS_KEY];
    setFocusMode(typeof storedValue === "boolean" ? storedValue : X_DEFAULT_FOCUS_MODE);
  });
}

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== "sync" || !(X_SETTINGS_KEY in changes)) {
    return;
  }

  setFocusMode(changes[X_SETTINGS_KEY].newValue !== false);
});

setFocusMode(X_DEFAULT_FOCUS_MODE);
installFeedBlocker();
loadSettings();

const observer = new MutationObserver(() => {
  const focusMode = document.documentElement.dataset.feedRemoverXFocusMode === "true";

  updatePageMarker();
  applyTextBasedCleanup(focusMode);
});

observer.observe(document.documentElement, {
  childList: true,
  subtree: true
});
}
