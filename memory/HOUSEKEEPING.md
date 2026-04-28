# 🟁 Temple — Housekeeping

Run this checklist periodically (before deploys, after major feature work, or when things feel off).

## 1. Syntax & Structure
- [ ] Brace balance (no mismatch)
- [ ] No bare `catch {}` blocks (ES2019 — crashes artifact transpiler)
- [ ] Default export present
- [ ] No duplicate exercise IDs in DEFAULT_EXERCISES

## 2. Token Compliance
- [ ] No raw hex colors outside `T.color` definition
- [ ] No raw pixel values in margins/padding (use `T.space.*`)
- [ ] No `transition: all` (list specific properties)
- [ ] All easing curves reference `T.easing.*` or `T.transition.*`
- [ ] No unused tokens in `T` (remove dead ones, keep scale tokens for future use)

## 3. Unused Code
- [ ] No unused functions or variables
- [ ] No unused component props
- [ ] No dead constants

## 4. Privacy
- [ ] No `localStorage` usage (must use `idb-keyval`)
- [ ] No `navigator.geolocation` or location access
- [ ] No analytics, tracking pixels, or third-party scripts beyond Google APIs (Drive backup)
- [ ] No `sendBeacon` or external data transmission beyond Google Drive backup
- [ ] YouTube links only use search queries, no user data in URLs
- [ ] Export/import only touches clipboard or local file download — never a server
- [ ] Google Drive fetch calls only in `useGoogleDrive.js` — no other external fetch

## 5. Performance
- [ ] No inline style objects created inside `.map()` renders (extract to variables or constants)
- [ ] `useCallback` on `save` function to prevent re-render cascades
- [ ] Rest timer interval cleaned up on unmount (useEffect return)
- [ ] Workout timer interval cleaned up on unmount
- [ ] No synchronous heavy computation in render path

## 6. Data Integrity
- [ ] Data migration handles missing `equipment`/`category` fields on load
- [ ] Data migration merges new default exercises on load
- [ ] Delete exercise cascades to sets (removes from exerciseIds) and PRs
- [ ] Session with deleted exercises doesn't crash (filters invalid IDs)
- [ ] Export produces valid JSON that can be re-imported
- [ ] Google Drive backup/restore validates required fields before saving

## 7. Motion & Polish (per DESIGN.md Section 7.6)
- [ ] No content shifting on expand/collapse
- [ ] Nothing pops in without animation (use `t-fade-in`, `t-scale-in`)
- [ ] No number input spinners visible
- [ ] No tap highlight colors
- [ ] Consistent card border patterns (1px solid border, accent when active)

## Automated Audit Script

Run this in the repo to catch the mechanical issues:

```javascript
// Checks: braces, bare catch, duplicate IDs, raw hex, raw margins,
// unused vars, privacy leaks, localStorage, analytics
// See: the audit script used in the build session (CHANGELOG v0.5)
```

## Last Run
- **Date**: 2026-04-28
- **Result**: 3 issues found, all fixed
- **Fixes applied**:
  - `runDataTests()` still present in drive-session App.jsx — removed
  - Privacy section referenced `window.storage` instead of `idb-keyval` — updated
  - Privacy rule "no fetch outside SW" obsolete — updated to allow `useGoogleDrive.js`

---

## 8. Memory File Hygiene
Run at the start or end of each session to prevent context drift.
- [ ] Every memory file reflects the current state of the code (not a past version)
- [ ] No completed features still listed in BACKLOG.md
- [ ] No stale component names or data model fields in ARCHITECTURE.md
- [ ] CHANGELOG.md updated with everything shipped in this session
- [ ] No duplicate information across files (e.g. PROJECT merged into PRODUCT — don't re-create it)
- [ ] Total memory size stays under ~35KB / 700 lines. Trim aggressively if growing.

## 9. Architecture Drift Review
After major features or long sessions, check that the code still matches the plan.
- [ ] Component tree in ARCHITECTURE.md matches actual components in code
- [ ] Data model interfaces match actual shape of stored data
- [ ] Token values in DESIGN.md match actual `T` object in code
- [ ] No half-finished migrations (old pattern AND new pattern coexisting)
- [ ] No feature partway through (e.g. data field added but UI not wired up)

## 10. Security
- [ ] No `dangerouslySetInnerHTML` usage
- [ ] YouTube URLs constructed from static `yt` field — no user input directly in URLs without encoding
- [ ] Import/export only parses JSON, never evaluates code
- [ ] No `eval()`, `Function()`, or `innerHTML` assignment
- [ ] Service worker only caches — never modifies request/response bodies
- [ ] External links use `rel="noopener noreferrer"`

## 11. Context Continuity
Practices for keeping the AI effective across sessions.
- [ ] Start each session by reading relevant memory files before writing code
- [ ] After each feature, update memory files immediately (don't batch at end — you'll forget)
- [ ] If a feature takes 3+ failed attempts, stop and reconsider the approach rather than patching
- [ ] Keep the codebase in one consistent pattern — don't introduce a second way to do something the code already does (e.g. two different filter components, two different animation approaches)
- [ ] When in doubt, rebuild from scratch rather than keep patching. The cost of rebuilding is low; the cost of accumulated patches is high.

## 12. Vibe Coding Process (community best practices)
Patterns the community has converged on for AI-coded prototypes.

### File Size Ceiling
- Single-file apps start breaking down around 500-800 lines. We're at ~1450.
- The AI is more likely to introduce regressions in large files because it can't hold the full context.
- Splitting into modules (Netlify deploy) is more urgent than it looks — treat as infrastructure, not a nice-to-have.

### Version Snapshots
- No version control means no rollback. A bad change can't be undone.
- Before major features: export a working snapshot (Settings → Export).
- At deploy time: set up Git. Every working state gets a commit.

### Refactor After Features
- Don't just build and move on. After every 2-3 features, do a dedicated cleanup pass.
- Ask: "clean up what we just built without changing functionality."
- This prevents the gradual decay that makes prompts produce unpredictable results.

### Test With Real Data
- An empty app and a 50-session app surface different bugs.
- Before real-world testing (Big Three #2): seed realistic test data — multiple sets, sessions across weeks, PRs, mixed exercise types.
- Edge cases to test: session with deleted exercises, set with 0 exercises after deletions, import of malformed JSON.

### The "Can a Human Dev Understand This" Test
- Every memory file should pass: could a developer who's never seen this project read the docs and understand the architecture?
- The code itself should pass: could someone navigate the single file and find what they need?
- If either answer is no, restructure before adding more features.

### Know When to Stop Vibing
- Warning signs: prompts produce unexpected results, the AI "forgets" patterns established earlier, features break other features.
- When this happens: stop adding features. Restructure, split files, update memory docs, then resume.
- The community says: "use AI for the 80% it does well, bring in rigour for the 20% where the cost of getting it wrong is too high."

### Copy Review as Part of Feature Work
- Every user-facing string should be checked against product philosophy (PRODUCT.md).
- No exclamation marks in encouragement. No forward-looking pressure. Periods, not exclamation marks.
- Run the tone audit script after any feature that adds or changes copy.
