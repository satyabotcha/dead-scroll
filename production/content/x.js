"use strict";
{
    const X_SETTINGS_KEY = "focusMode";
    const X_DEFAULT_FOCUS_MODE = true;
    const STYLE_ID = "social-media-feed-remover-x";
    const HIDDEN_ATTRIBUTE = "data-feed-remover-x-hidden";
    const DISTRACTING_PRIMARY_NAV_SELECTORS = [
        "nav[aria-label='Primary']",
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
    ];
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
    ];
    const HOME_PAGE_SELECTORS = [
        "main [role='tablist']",
        "main [role='status']",
        "main [data-testid='cellInnerDiv']:has(article)",
        "main article",
        "main [data-testid='trend']",
        "main [data-testid='UserCell']"
    ];
    const EXPLORE_PAGE_SELECTORS = [
        "main [role='tablist']",
        "main [data-testid='cellInnerDiv']:has(article)",
        "main article",
        "main [data-testid='trend']",
        "main [data-testid='UserCell']",
        "main [aria-label='Trending']"
    ];
    const NOTIFICATIONS_PAGE_SELECTORS = [
        "main [role='tablist']",
        "main [role='status']",
        "main [data-testid='cellInnerDiv']",
        "main article",
        "main section"
    ];
    const ROUTE_NAMES = [
        "home",
        "explore",
        "notifications",
        "search",
        "compose",
        "profile",
        "post",
        "other"
    ];
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
    ];
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
    function installFeedBlocker() {
        const existingStyle = document.getElementById(STYLE_ID);
        const style = existingStyle ?? document.createElement("style");
        style.id = STYLE_ID;
        style.textContent = `
    html[data-feed-remover-x-focus-mode="true"] ${DISTRACTING_PRIMARY_NAV_SELECTORS.join(",\n    html[data-feed-remover-x-focus-mode=\"true\"] ")} {
      display: none !important;
    }

    html[data-feed-remover-x-focus-mode="true"] ${GLOBAL_DISTRACTION_SELECTORS.join(",\n    html[data-feed-remover-x-focus-mode=\"true\"] ")} {
      display: none !important;
    }

    html[data-feed-remover-x-focus-mode="true"][data-feed-remover-x-page="home"] ${HOME_PAGE_SELECTORS.join(",\n    html[data-feed-remover-x-focus-mode=\"true\"][data-feed-remover-x-page=\"home\"] ")} {
      display: none !important;
    }

    html[data-feed-remover-x-focus-mode="true"][data-feed-remover-x-page="explore"] ${EXPLORE_PAGE_SELECTORS.join(",\n    html[data-feed-remover-x-focus-mode=\"true\"][data-feed-remover-x-page=\"explore\"] ")} {
      display: none !important;
    }

    html[data-feed-remover-x-focus-mode="true"][data-feed-remover-x-page="notifications"] ${NOTIFICATIONS_PAGE_SELECTORS.join(",\n    html[data-feed-remover-x-focus-mode=\"true\"][data-feed-remover-x-page=\"notifications\"] ")} {
      display: none !important;
    }
  `;
        if (!existingStyle) {
            document.documentElement.append(style);
        }
    }
    function normalizedPath() {
        const path = location.pathname.replace(/\/+$/, "");
        return path === "" ? "/" : path;
    }
    function firstRouteSegment(path) {
        return path.split("/").filter(Boolean)[0]?.toLowerCase() ?? "";
    }
    function isProfileRoute(path) {
        const [handle, suffix, extra] = path.split("/").filter(Boolean);
        if (!handle || X_INTERNAL_ROUTE_SEGMENTS.has(handle.toLowerCase())) {
            return false;
        }
        return (!suffix ||
            (["with_replies", "media", "highlights", "articles"].includes(suffix) && !extra));
    }
    function isPostRoute(path) {
        const [, status, id] = path.split("/").filter(Boolean);
        return status === "status" && Boolean(id);
    }
    function getRouteName() {
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
    function updatePageMarker() {
        document.documentElement.dataset.feedRemoverXPage = getRouteName();
    }
    function setFocusMode(focusMode) {
        document.documentElement.dataset.feedRemoverXFocusMode = String(focusMode);
        updatePageMarker();
        applyTextBasedCleanup(focusMode);
    }
    function showPreviouslyHiddenElements() {
        document.querySelectorAll(`[${HIDDEN_ATTRIBUTE}="true"]`).forEach((element) => {
            if (element instanceof HTMLElement) {
                element.style.removeProperty("display");
                element.removeAttribute(HIDDEN_ATTRIBUTE);
            }
        });
    }
    function hideElement(element) {
        element.setAttribute(HIDDEN_ATTRIBUTE, "true");
        element.style.setProperty("display", "none", "important");
    }
    function normalizedText(element) {
        return element.textContent?.replace(/\s+/g, " ").trim().toLowerCase() ?? "";
    }
    function hasDistractingHeading(element) {
        const text = normalizedText(element);
        return DISTRACTING_HEADINGS.some((heading) => text === heading || text.startsWith(`${heading} `));
    }
    function isVariableRewardStatus(element) {
        const text = normalizedText(element);
        return text.startsWith("see new posts") || /^show [0-9,.]+ posts?$/.test(text) || text === "show more";
    }
    function hideDistractingModule(labelElement) {
        const container = labelElement.closest(DISTRACTION_CONTAINER_SELECTOR);
        if (container instanceof HTMLElement) {
            hideElement(container);
        }
    }
    function hideDistractingPrimaryNavItems() {
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
    function applyTextBasedCleanup(focusMode) {
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
    function loadSettings() {
        chrome.storage.sync.get(X_SETTINGS_KEY, (result) => {
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
