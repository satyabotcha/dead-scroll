# AGENTS.md

## What is this and who is it for?
This is a Chrome extension for people who want social sites without addictive feeds. It starts with YouTube and removes feed surfaces while leaving direct navigation, search, and video watching intact.

## Product Philosophy
- Remove feeds, not the whole site — preserve intentional use.
- Keep hand-written source in TypeScript under `src/`; generated JavaScript belongs in `production/`.
- The Chrome-uploadable output folder is `production/`.

---

## Tech Stack
- **Language:** TypeScript
- **Extension:** Chrome Extension Manifest V3
- **Runtime:** Content scripts
- **Build:** TypeScript compiler to `production/`
- **Backend:** None
- **Database:** None

## Map
- `src/` — hand-written TypeScript extension source.
- `production/` — compiled Chrome extension output to load or package.

---

## Instructions

**Before starting:** Read `soul.md` and `learnings.md` before every task.

**During:**
- Ask one clarifying question if the task is ambiguous — don't just start building
- Blast radius: 1-2 files → proceed. 3-5 files → inform me + add tests for affected functions. 5+ files → stop, confirm with me, add full tests, and do NOT commit until I approve
- Add comments on non-obvious logic — explain *why*, not *what*

**After:**
- Commit only files you edited: `[type]: short description`
- Update `learnings.md` if you hit a bug or a failed approach
- Update this file if you learn something about the codebase worth remembering

---

*Living document. Keep it lean — add only what can't be figured out from reading the code.*
