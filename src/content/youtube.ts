const CONTENT_SELECTORS = [
  "ytd-app > #content",
  "#page-manager",
  "ytd-browse",
  "ytd-watch-flexy",
  "ytd-search",
  "ytd-mini-guide-renderer",
  "ytd-guide-renderer",
  "tp-yt-app-drawer"
] as const;

const HEADER_CLUTTER_SELECTORS = [
  "ytd-masthead #guide-button",
  "ytd-masthead #voice-search-button",
  "ytd-masthead #start > *:not(ytd-topbar-logo-renderer)"
] as const;

const STYLE_ID = "social-media-feed-remover-youtube";
const HIDDEN_ATTRIBUTE = "data-feed-remover-hidden";

function getMasthead(): Element | null {
  return document.querySelector("ytd-masthead, #masthead-container");
}

function hideElement(element: Element): void {
  if (element instanceof HTMLElement) {
    element.dataset.feedRemoverHidden = "true";
    element.style.setProperty("display", "none", "important");
  }
}

function hideOnlyWhenOutsideMasthead(selector: string, masthead: Element): void {
  document.querySelectorAll(selector).forEach((element) => {
    if (element.contains(masthead) || masthead.contains(element)) {
      return;
    }

    hideElement(element);
  });
}

function applyMinimalYouTube(): void {
  const masthead = getMasthead();

  if (!masthead) {
    return;
  }

  CONTENT_SELECTORS.forEach((selector) => hideOnlyWhenOutsideMasthead(selector, masthead));
  HEADER_CLUTTER_SELECTORS.forEach((selector) => {
    document.querySelectorAll(selector).forEach(hideElement);
  });
}

function installFeedBlocker(): void {
  if (document.getElementById(STYLE_ID)) {
    return;
  }

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    [${HIDDEN_ATTRIBUTE}="true"] {
      display: none !important;
    }

    html,
    body,
    ytd-app {
      min-height: 100% !important;
      background: var(--yt-spec-base-background, #fff) !important;
    }

    #masthead-container,
    ytd-masthead {
      opacity: 1 !important;
      visibility: visible !important;
      pointer-events: auto !important;
    }

    ytd-masthead #start,
    ytd-masthead #center,
    ytd-masthead #end {
      opacity: 1 !important;
      visibility: visible !important;
    }
  `;

  document.documentElement.append(style);
}

installFeedBlocker();
applyMinimalYouTube();

const observer = new MutationObserver(applyMinimalYouTube);
observer.observe(document.documentElement, {
  childList: true,
  subtree: true
});
