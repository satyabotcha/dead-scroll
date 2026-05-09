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

### 2026-05-09 X home needs shell cleanup
**Context:** X home still looked wrong after feed cards were removed.
**Learning:** Feed-card selectors are not enough on X home; the composer, `Home timeline` shell, right-rail parent, and floating Grok/messages drawers can survive and make the page feel broken. Hide those only on the home route or with narrow global drawer/sidebar selectors.

### 2026-05-09 X search belongs in the right rail
**Context:** Chrome verification showed the live logged-in page still felt wrong after the first X fixes.
**Learning:** Preserve the right-rail search column and hide only its trend/recommendation modules. The left `Explore` nav opens a rabbit-hole surface, so remove it when the right search box is available.

### 2026-05-09 X keep only explicit creation/search affordances
**Context:** The user marked the exact X surfaces to preserve.
**Learning:** On X home, keep only the logo, home composer, right search field, left Post button, and account menu. Hide the primary nav and feed/tabs, but do not hide composer controls or the right search column.

### 2026-05-09 LinkedIn feed selectors need route and DOM fallbacks
**Context:** The first LinkedIn blocker worked on an assumed fixture but missed the user's real feed.
**Learning:** LinkedIn feed classes drift quickly and the logged-in feed can appear from `/` as well as `/feed/`. Hide feed pages by route plus feed-surface signatures like activity URNs, finite-scroll items, impression containers, and actor components.

### 2026-05-09 LinkedIn composer is intentional use
**Context:** Feed blocking hid the post composer along with feed updates.
**Learning:** Keep `.share-box-feed-entry`/Start a post available. It is creation, not consumption. Hide update cards and feed rails, but avoid broad feed-page selectors like `main` or `.scaffold-layout__main`.

### 2026-05-09 LinkedIn feed cleanup needs a composer allowlist
**Context:** Preserving the composer let the feed, news rail, puzzles, and profile cards reappear.
**Learning:** On LinkedIn feed pages, treat the composer as the allowlisted main content and hide later siblings under `main`, plus side rails. This is safer than relying only on drifting feed-card class names.

### 2026-05-09 LinkedIn nests the feed layout under multiple mains
**Context:** Chrome testing against the real logged-in LinkedIn feed still showed sidebars and posts.
**Learning:** The real feed can nest profile/sidebar, composer, feed cards, and news rails under nested `main` wrappers. Start from the composer and climb upward, hiding sibling branches around the composer until the feed layout root instead of assuming a flat main.

### 2026-05-09 LinkedIn feed should be top chrome only
**Context:** The user marked the exact LinkedIn surfaces to keep.
**Learning:** On LinkedIn feed, keep only the top chrome for search, My Network, Jobs, Messaging, Me, and For Business. Hide the feed body entirely, including composer, sidebars, news, puzzles, floating messaging drawer, Home, Notifications, and Sales Nav.
