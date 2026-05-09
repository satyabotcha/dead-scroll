{
const LINKEDIN_SETTINGS_KEY = "focusMode";
const LINKEDIN_DEFAULT_FOCUS_MODE = true;
const STYLE_ID = "social-media-feed-remover-linkedin";
const HIDDEN_ATTRIBUTE = "data-feed-remover-linkedin-hidden";

const FEED_PATH_PREFIXES = ["/feed"] as const;
const NOTIFICATIONS_PATH_PREFIXES = ["/notifications"] as const;

const GLOBAL_DISTRACTION_SELECTORS = [
  ".global-nav__primary-item:has(a[href*='/feed/'])",
  ".global-nav__primary-item:has(a[href*='/notifications/'])",
  ".global-nav__primary-item:has([data-test-global-nav-link='feed'])",
  ".global-nav__primary-item:has([data-test-global-nav-link='notifications'])",
  ".global-nav__primary-item:has([aria-label*='Home'])",
  ".global-nav__primary-item:has([aria-label*='Notifications'])",
  ".global-nav__primary-item:has(button[aria-label*='Home'])",
  ".global-nav__primary-item:has(button[aria-label*='Notifications'])",
  "li:has(> a[href*='/feed/'])",
  "li:has(> a[href*='/notifications/'])",
  "[data-test-global-nav-link='feed']",
  "[data-test-global-nav-link='notifications']",
  "a[href*='/feed/'][aria-label*='Home']",
  "a[href*='/notifications/'][aria-label*='Notifications']",
  "button[aria-label*='Home']",
  "button[aria-label*='Notifications']",
  "a[href*='/premium/redeem/']"
] as const;

const FEED_PAGE_SELECTORS = [
  "main",
  "main[role='main']",
  ".scaffold-layout",
  ".scaffold-layout__main",
  ".scaffold-layout__sidebar",
  ".scaffold-layout__aside",
  ".share-box-feed-entry",
  "aside",
  ".msg-overlay-list-bubble"
] as const;

const FEED_SURFACE_SELECTORS = [
  ".share-box-feed-entry",
  ".feed-shared-update-v2",
  ".fie-impression-container",
  "[data-finite-scroll-hotkey-item]",
  "[data-urn*='urn:li:activity']",
  "[data-id*='urn:li:activity']",
  ".update-components-actor"
] as const;

const NOTIFICATIONS_PAGE_SELECTORS = [
  "main",
  ".scaffold-layout__main",
  ".notifications"
] as const;

const GLOBAL_DISTRACTION_HEADINGS = [
  "add to your feed",
  "based on your profile",
  "linkedin news",
  "people you may know",
  "promoted",
  "recommended for you",
  "today's puzzles",
  "who viewed your profile",
  "profile viewers",
  "today's news"
] as const;

const FEED_DISTRACTION_HEADINGS = ["suggested"] as const;

const DISTRACTION_CONTAINER_SELECTOR = [
  "section",
  "aside",
  "article",
  "menu",
  ".artdeco-card",
  ".feed-shared-update-v2",
  ".fie-impression-container",
  ".scaffold-finite-scroll",
  ".scaffold-layout__aside",
  ".scaffold-layout__sidebar",
  ".mn-pymk-list",
  ".pymk-card"
].join(",");

type LinkedInStorageResult = {
  [LINKEDIN_SETTINGS_KEY]?: boolean;
};

function installFeedBlocker(): void {
  const existingStyle = document.getElementById(STYLE_ID);
  const style = existingStyle ?? document.createElement("style");

  style.id = STYLE_ID;
  style.textContent = `
    html[data-feed-remover-linkedin-focus-mode="true"] ${GLOBAL_DISTRACTION_SELECTORS.join(
      ",\n    html[data-feed-remover-linkedin-focus-mode=\"true\"] "
    )} {
      display: none !important;
    }

    html[data-feed-remover-linkedin-focus-mode="true"][data-feed-remover-linkedin-page="feed"] ${FEED_PAGE_SELECTORS.join(
      ",\n    html[data-feed-remover-linkedin-focus-mode=\"true\"][data-feed-remover-linkedin-page=\"feed\"] "
    )} {
      display: none !important;
    }

    html[data-feed-remover-linkedin-focus-mode="true"][data-feed-remover-linkedin-page="notifications"] ${NOTIFICATIONS_PAGE_SELECTORS.join(
      ",\n    html[data-feed-remover-linkedin-focus-mode=\"true\"][data-feed-remover-linkedin-page=\"notifications\"] "
    )} {
      display: none !important;
    }
  `;

  if (!existingStyle) {
    document.documentElement.append(style);
  }
}

function pathStartsWith(prefixes: readonly string[]): boolean {
  return prefixes.some((prefix) => location.pathname === prefix || location.pathname.startsWith(`${prefix}/`));
}

function hasFeedSurface(): boolean {
  return FEED_SURFACE_SELECTORS.some((selector) => document.querySelector(selector));
}

function updatePageMarker(): void {
  if (pathStartsWith(FEED_PATH_PREFIXES) || (location.pathname === "/" && hasFeedSurface())) {
    document.documentElement.dataset.feedRemoverLinkedinPage = "feed";
    return;
  }

  if (pathStartsWith(NOTIFICATIONS_PATH_PREFIXES)) {
    document.documentElement.dataset.feedRemoverLinkedinPage = "notifications";
    return;
  }

  delete document.documentElement.dataset.feedRemoverLinkedinPage;
}

function setFocusMode(focusMode: boolean): void {
  document.documentElement.dataset.feedRemoverLinkedinFocusMode = String(focusMode);
  updatePageMarker();
  applyLinkedInCleanup(focusMode);
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

function isFeedPage(): boolean {
  return document.documentElement.dataset.feedRemoverLinkedinPage === "feed";
}

function hasDistractingHeading(element: Element): boolean {
  const text = normalizedText(element);
  const headings = isFeedPage()
    ? [...GLOBAL_DISTRACTION_HEADINGS, ...FEED_DISTRACTION_HEADINGS]
    : GLOBAL_DISTRACTION_HEADINGS;

  return headings.some((heading) => text === heading || text.startsWith(`${heading} `));
}

function hideDistractingModule(labelElement: Element): void {
  const container = labelElement.closest(DISTRACTION_CONTAINER_SELECTOR);

  if (container instanceof HTMLElement) {
    hideElement(container);
  }
}

function applyTextBasedCleanup(focusMode: boolean): void {
  if (!focusMode) {
    showPreviouslyHiddenElements();
    return;
  }

  // LinkedIn changes class names often, so headings are the most stable hook for small vanity modules.
  document.querySelectorAll("h2, h3, header, span, div[role='heading']").forEach((element) => {
    if (hasDistractingHeading(element)) {
      hideDistractingModule(element);
    }
  });
}

function applyLinkedInCleanup(focusMode: boolean): void {
  if (!focusMode) {
    showPreviouslyHiddenElements();
    return;
  }

  applyTextBasedCleanup(focusMode);
}

function loadSettings(): void {
  chrome.storage.sync.get(LINKEDIN_SETTINGS_KEY, (result: LinkedInStorageResult) => {
    const storedValue = result[LINKEDIN_SETTINGS_KEY];
    setFocusMode(typeof storedValue === "boolean" ? storedValue : LINKEDIN_DEFAULT_FOCUS_MODE);
  });
}

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== "sync" || !(LINKEDIN_SETTINGS_KEY in changes)) {
    return;
  }

  setFocusMode(changes[LINKEDIN_SETTINGS_KEY].newValue !== false);
});

setFocusMode(LINKEDIN_DEFAULT_FOCUS_MODE);
installFeedBlocker();
loadSettings();

const observer = new MutationObserver(() => {
  const focusMode = document.documentElement.dataset.feedRemoverLinkedinFocusMode === "true";

  updatePageMarker();
  applyLinkedInCleanup(focusMode);
});

observer.observe(document.documentElement, {
  childList: true,
  subtree: true
});
}
