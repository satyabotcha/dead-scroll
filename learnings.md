# learnings.md

*Updated by the agent after every meaningful task. Check this before starting any task.*
*If this exceeds 5kb, summarise older entries and delete them - keep it lean.*

---

## Format

```
### [YYYY-MM-DD] What happened
**Context:** What we were trying to do
**Learning:** What went wrong or what we discovered
```

---

## Entries

### 2026-05-08 YouTube cleanup summary
**Context:** We iterated on preserving intentional YouTube use while removing feeds, Shorts, ads, comments, autoplay, endscreen suggestions, and recommendation rails.
**Learning:** Do not hide broad YouTube containers unless guarded by live DOM context; broad CSS can hide masthead/search/account, shift header controls, or remove valid search results. Prefer native masthead/search/account controls, replace stale injected style text on reload, gate search cleanup by route, and use targeted DOM filtering for Shorts because Shorts appear inside normal search cards and shelves.

### 2026-05-09 Content scripts share TypeScript script scope
**Context:** We added more site scripts alongside YouTube.
**Learning:** Plain `.ts` content scripts without imports/exports are typechecked in one global script scope. Wrap each standalone content script in a top-level block or another local scope to avoid duplicate names without emitting module syntax.

### 2026-05-09 X support removed
**Context:** We tried several X cleanup approaches, but the product direction moved away from supporting X for now.
**Learning:** There is currently no X/Twitter content script or manifest match. If X returns later, start from fresh live Chrome DOM inspection rather than reviving the removed implementation.

### 2026-05-09 LinkedIn feed route and DOM quirks
**Context:** LinkedIn feed cleanup missed real logged-in layouts.
**Learning:** LinkedIn feed classes drift quickly and the feed can appear from `/` as well as `/feed/`. Treat the bare root as a feed route. Real feed pages can nest profile/sidebar, composer, feed cards, and news rails under multiple `main` wrappers, so start from stable surfaces and climb carefully instead of assuming a flat layout.

### 2026-05-09 LinkedIn top-chrome direction
**Context:** The user marked the exact LinkedIn surfaces to keep.
**Learning:** On LinkedIn feed, keep only top chrome for search, My Network, Jobs, Messaging, Me, and For Business. Hide the feed body entirely, including composer, sidebars, news, puzzles, floating messaging drawer, Home, Notifications, and Sales Nav.

### 2026-05-09 YouTube calm canvas offset
**Context:** YouTube home showed a large empty gap between the masthead and the injected calm canvas.
**Learning:** The canvas was using an old `148px` top offset that included removed feed/chipbar space, and YouTube can keep a blank `#frosted-glass.with-chipbar` layer above the page after chip content is hidden. Anchor home canvas visuals to the `56px` masthead height and collapse the frosted chipbar layer in focus mode.

### 2026-05-09 Local prototype browser preview
**Context:** We previewed standalone HTML canvas prototypes from Codex.
**Learning:** The in-app browser blocks direct `file://` loads. Serve prototype HTML from the repo with a small local HTTP server, then open it through `localhost`.

### 2026-05-09 Zodiac art source of truth
**Context:** We prototyped zodiac progression after generating a reference image.
**Learning:** Hand-coded constellation paths can validate reveal mechanics but drift from the generated art direction. For visual approval, use the generated board itself as the day-30 target and layer progression masks over it before translating anything into production canvas code.

### 2026-05-10 Zodiac progression should be drawn, not masked
**Context:** The image-mask prototype matched the generated board composition but made progression feel like a fade reveal.
**Learning:** The progression prototype needs real vector data: stars unlock by day, curved strokes draw between them, and the generated image only guides the day-30 composition. Avoid image fades for this interaction.
