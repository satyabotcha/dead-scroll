{
const SETTINGS_KEY = "focusMode";
const DEFAULT_FOCUS_MODE = true;

const ICON_FOCUSED = { "16": "assets/icon_focused_16.png", "32": "assets/icon_focused_32.png" };
const ICON_DISTRACTED = { "16": "assets/icon_distracted_16.png", "32": "assets/icon_distracted_32.png" };

type StorageResult = { [key: string]: boolean | undefined };

function applyIcon(focusMode: boolean): void {
  chrome.action.setIcon({ path: focusMode ? ICON_FOCUSED : ICON_DISTRACTED });
}

function setFocusMode(focusMode: boolean): void {
  chrome.storage.sync.set({ [SETTINGS_KEY]: focusMode });
}

chrome.storage.sync.get(SETTINGS_KEY, (result: StorageResult) => {
  applyIcon(result[SETTINGS_KEY] ?? DEFAULT_FOCUS_MODE);
});

chrome.action.onClicked.addListener(() => {
  chrome.storage.sync.get(SETTINGS_KEY, (result: StorageResult) => {
    setFocusMode(!(result[SETTINGS_KEY] ?? DEFAULT_FOCUS_MODE));
  });
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && SETTINGS_KEY in changes) {
    applyIcon((changes[SETTINGS_KEY].newValue as boolean) ?? DEFAULT_FOCUS_MODE);
  }
});
}
