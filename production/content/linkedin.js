"use strict";
{
    const LINKEDIN_SETTINGS_KEY = "focusMode";
    const LINKEDIN_DEFAULT_FOCUS_MODE = true;
    const STYLE_ID = "social-media-feed-remover-linkedin";
    const HIDDEN_ATTRIBUTE = "data-feed-remover-linkedin-hidden";
    const FEED_PATH_PREFIXES = ["/feed"];
    const NOTIFICATIONS_PATH_PREFIXES = ["/notifications"];
    const GLOBAL_DISTRACTION_SELECTORS = [
        ".global-nav__primary-item:has(a[href*='/notifications/'])",
        "li:has(> a[href*='/notifications/'])",
        "a[href*='/notifications/'][aria-label*='Notifications']"
    ];
    const FEED_PAGE_SELECTORS = [
        ".share-box-feed-entry",
        ".feed-shared-update-v2",
        ".scaffold-finite-scroll",
        ".scaffold-layout__sidebar",
        ".scaffold-layout__aside",
        "aside"
    ];
    const NOTIFICATIONS_PAGE_SELECTORS = [
        "main",
        ".scaffold-layout__main",
        ".notifications"
    ];
    const GLOBAL_DISTRACTION_HEADINGS = [
        "linkedin news",
        "people you may know",
        "add to your feed",
        "who viewed your profile",
        "profile viewers",
        "today's news"
    ];
    const FEED_DISTRACTION_HEADINGS = ["suggested"];
    const DISTRACTION_CONTAINER_SELECTOR = [
        "section",
        "aside",
        "article",
        ".artdeco-card",
        ".feed-shared-update-v2",
        ".scaffold-layout__aside",
        ".scaffold-layout__sidebar",
        ".mn-pymk-list",
        ".pymk-card"
    ].join(",");
    function installFeedBlocker() {
        const existingStyle = document.getElementById(STYLE_ID);
        const style = existingStyle ?? document.createElement("style");
        style.id = STYLE_ID;
        style.textContent = `
    html[data-feed-remover-linkedin-focus-mode="true"] ${GLOBAL_DISTRACTION_SELECTORS.join(",\n    html[data-feed-remover-linkedin-focus-mode=\"true\"] ")} {
      display: none !important;
    }

    html[data-feed-remover-linkedin-focus-mode="true"][data-feed-remover-linkedin-page="feed"] ${FEED_PAGE_SELECTORS.join(",\n    html[data-feed-remover-linkedin-focus-mode=\"true\"][data-feed-remover-linkedin-page=\"feed\"] ")} {
      display: none !important;
    }

    html[data-feed-remover-linkedin-focus-mode="true"][data-feed-remover-linkedin-page="notifications"] ${NOTIFICATIONS_PAGE_SELECTORS.join(",\n    html[data-feed-remover-linkedin-focus-mode=\"true\"][data-feed-remover-linkedin-page=\"notifications\"] ")} {
      display: none !important;
    }
  `;
        if (!existingStyle) {
            document.documentElement.append(style);
        }
    }
    function pathStartsWith(prefixes) {
        return prefixes.some((prefix) => location.pathname === prefix || location.pathname.startsWith(`${prefix}/`));
    }
    function updatePageMarker() {
        if (pathStartsWith(FEED_PATH_PREFIXES)) {
            document.documentElement.dataset.feedRemoverLinkedinPage = "feed";
            return;
        }
        if (pathStartsWith(NOTIFICATIONS_PATH_PREFIXES)) {
            document.documentElement.dataset.feedRemoverLinkedinPage = "notifications";
            return;
        }
        delete document.documentElement.dataset.feedRemoverLinkedinPage;
    }
    function setFocusMode(focusMode) {
        document.documentElement.dataset.feedRemoverLinkedinFocusMode = String(focusMode);
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
    function isFeedPage() {
        return document.documentElement.dataset.feedRemoverLinkedinPage === "feed";
    }
    function hasDistractingHeading(element) {
        const text = normalizedText(element);
        const headings = isFeedPage()
            ? [...GLOBAL_DISTRACTION_HEADINGS, ...FEED_DISTRACTION_HEADINGS]
            : GLOBAL_DISTRACTION_HEADINGS;
        return headings.some((heading) => text === heading || text.startsWith(`${heading} `));
    }
    function hideDistractingModule(labelElement) {
        const container = labelElement.closest(DISTRACTION_CONTAINER_SELECTOR);
        if (container instanceof HTMLElement) {
            hideElement(container);
        }
    }
    function applyTextBasedCleanup(focusMode) {
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
    function loadSettings() {
        chrome.storage.sync.get(LINKEDIN_SETTINGS_KEY, (result) => {
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
        applyTextBasedCleanup(focusMode);
    });
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
}
