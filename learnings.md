# learnings.md

*Updated by the agent after every meaningful task. Check this before starting any task.*
*If this exceeds 5kb, summarise older entries and delete them — keep it lean.*

---

## Format

```
### [YYYY-MM-DD] What happened
**Context:** What we were trying to do
**Learning:** What went wrong or what we discovered
```

---

## Entries

### 2026-05-08 YouTube masthead got hidden
**Context:** We tried to leave only the YouTube header visible.
**Learning:** Avoid pure CSS `display: none` on broad YouTube containers; depending on the active DOM, they can hide the masthead too. Use guarded DOM logic that first finds the masthead and never hides a container that contains it.

### 2026-05-08 YouTube header layout shifted
**Context:** The masthead survived, but logo/search/account spacing no longer matched YouTube.
**Learning:** Do not `display: none` header controls when we want native layout. Use `visibility: hidden` for unwanted masthead controls so their space is preserved, and hide feed/content children instead of outer layout containers.

### 2026-05-08 Extension reload kept stale CSS
**Context:** Brave still showed the old broken masthead layout after newer extension builds.
**Learning:** Content scripts can leave an injected style tag in an already-open tab. Do not return when the extension style id exists; replace its text so reloads clear stale CSS.

### 2026-05-08 Content hiding left filter chrome visible
**Context:** The header layout was fixed, but YouTube search still showed filter chips and left guide/footer chrome.
**Learning:** Treat guide renderers and filter chip bars as page content, not masthead layout. They can be hidden directly without disturbing the top bar.

### 2026-05-08 Search should stay usable
**Context:** The extension needs to remove passive feeds but still let users search for videos.
**Learning:** Do not hide `ytd-search` result containers. Hide home/browse feeds and the watch-page secondary recommendation rail, while leaving search results and the watch-page primary video intact.

### 2026-05-08 Shorts need DOM filtering
**Context:** Shorts can appear inside normal YouTube search results rather than only in dedicated shelves.
**Learning:** Use a default-on setting plus both CSS `:has(a[href^='/shorts/'])` selectors and a MutationObserver DOM pass that hides the closest result card for `/shorts/` links.

### 2026-05-08 YouTube search shelves can be too broad
**Context:** We tried hiding YouTube's newer Shorts shelf container in search results.
**Learning:** `grid-shelf-view-model` and generic sibling walking can cover more of the page than the visible shelf. Do not hide those broad containers without a precise live-DOM guard; prefer narrower Shorts links/cards until the shelf component can be targeted safely.
