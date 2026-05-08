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
