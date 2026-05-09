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
