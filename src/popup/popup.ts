const POPUP_SETTINGS_KEY = "focusMode";
const POPUP_DEFAULT_FOCUS_MODE = true;
const POPUP_CONSTELLATION_PREVIEW_KEY = "constellationPreviewDays";

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

const previewSlider = document.querySelector<HTMLInputElement>("#preview-days");
const previewCount = document.querySelector<HTMLElement>("#preview-count");

if (previewSlider && previewCount) {
  chrome.storage.local.get(POPUP_CONSTELLATION_PREVIEW_KEY, (result) => {
    const val = (result[POPUP_CONSTELLATION_PREVIEW_KEY] as number | undefined) ?? 0;
    previewSlider.value = String(val);
    previewCount.textContent = String(val);
  });

  previewSlider.addEventListener("input", () => {
    const val = Number(previewSlider.value);
    previewCount.textContent = String(val);
    chrome.storage.local.set({ [POPUP_CONSTELLATION_PREVIEW_KEY]: val });
  });
}
