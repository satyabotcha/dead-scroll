const POPUP_SETTINGS_KEY = "focusMode";
const POPUP_DEFAULT_FOCUS_MODE = true;

type PopupStorageResult = {
  [POPUP_SETTINGS_KEY]?: boolean;
};

const focusModeToggle = document.querySelector<HTMLInputElement>("#focus-mode");

if (focusModeToggle) {
  chrome.storage.sync.get(POPUP_SETTINGS_KEY, (result: PopupStorageResult) => {
    focusModeToggle.checked = result[POPUP_SETTINGS_KEY] ?? POPUP_DEFAULT_FOCUS_MODE;
  });

  focusModeToggle.addEventListener("change", () => {
    chrome.storage.sync.set({
      [POPUP_SETTINGS_KEY]: focusModeToggle.checked
    });
  });
}
