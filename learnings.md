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
**Learning:** Do not hide broad YouTube containers unless guarded by live DOM context; broad CSS can hide the masthead, shift header controls, or remove valid search results. Prefer native masthead/search/account controls, replace stale injected style text on reload, hide feed children instead of layout shells, gate search cleanup by route, and use targeted DOM filtering for Shorts because Shorts appear inside normal search cards and shelves.

### 2026-05-08 YouTube visual takeover was too brittle
**Context:** We tried a custom scenic/Momentum-style YouTube home canvas.
**Learning:** The cleaner product direction is to leave YouTube's native white masthead and page chrome alone, then remove only distracting feed surfaces. Avoid page-canvas takeovers unless explicitly reintroduced.

### 2026-05-09 Multiple content scripts share TypeScript script scope
**Context:** We added a LinkedIn content script alongside the existing YouTube script.
**Learning:** Plain `.ts` content scripts without imports/exports are typechecked in one global script scope. Wrap each standalone content script in a top-level block or another local scope to avoid duplicate `const` and function names without emitting module syntax.

### 2026-05-09 X profile routes reuse timeline labels
**Context:** We added X support while preserving profiles and direct post pages.
**Learning:** X can expose profile pages under generic labels like `Home timeline`, so never hide timeline-shaped DOM based on accessibility labels alone. Mark the current route first, then apply feed/removal selectors only on feed routes like `/home`, `/explore`, and `/notifications`.

### 2026-05-09 X left nav search is Explore
**Context:** The first X cleanup hid too much nav and left the page feeling half-erased.
**Learning:** In the user's logged-in X layout, the magnifying-glass left-nav item is labeled `Explore` but functions as the search entry. Preserve that item, then remove route content/trends separately.

### 2026-05-09 LinkedIn feed selectors need route and DOM fallbacks
**Context:** The first LinkedIn blocker worked on an assumed fixture but missed the user's real feed.
**Learning:** LinkedIn feed classes drift quickly and the logged-in feed can appear from `/` as well as `/feed/`. Hide feed pages by route plus feed-surface signatures like activity URNs, finite-scroll items, impression containers, and actor components.
