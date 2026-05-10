"use strict";
// Runs at document_start — stamps html[dark] before the first paint so
// YouTube's built-in dark-mode CSS is active from the very first pixel.
// The MutationObserver in youtube.ts re-stamps it if YouTube's own
// initialisation removes it based on account preferences.
document.documentElement.setAttribute("dark", "");
