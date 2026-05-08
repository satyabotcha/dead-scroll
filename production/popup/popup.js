"use strict";
const POPUP_SETTINGS_KEY = "focusMode";
const POPUP_DEFAULT_FOCUS_MODE = true;
const focusModeToggle = document.querySelector("#focus-mode");
if (focusModeToggle) {
    chrome.storage.sync.get(POPUP_SETTINGS_KEY, (result) => {
        focusModeToggle.checked = result[POPUP_SETTINGS_KEY] ?? POPUP_DEFAULT_FOCUS_MODE;
    });
    focusModeToggle.addEventListener("change", () => {
        chrome.storage.sync.set({
            [POPUP_SETTINGS_KEY]: focusModeToggle.checked
        });
    });
}
