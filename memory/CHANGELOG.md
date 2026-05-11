# 🟁 Temple — Changelog

## v0.9.2 (Current)
- **Code split**: App.jsx (1972 lines) → 7 files, ~280 lines each
  - `src/components.jsx` — shared UI (Tabs, Card, Btn, Input, VideoSheet, YTButton, etc.)
  - `src/pages/LibraryPage.jsx`, `SetsPage.jsx`, `SessionPage.jsx`, `ProgressPage.jsx`, `SettingsPage.jsx`
- **Style helpers**: `S` object added to `tokens.js` — `S.col()`, `S.row()`, `S.between()`, `S.label`
- **Performance**: `customTooltip` extracted from `.map()` → memoized with `useCallback`
- **Performance**: `est1RM` moved into `useMemo` as precomputed `best1RMByExercise` map
- **Performance**: `getLastSessionData` memoized with `useCallback`
- **Bug B27**: `ASSETS_CACHE` stuck at `temple-assets-v0.7.1` → bumped to match version
- **Bug B28**: Raw `padding: "8px 0"` in PR chart table → `T.space.base`
- **Bug B29**: `recovery.js` orphan Netlify function removed
- Error monitor: red dot captures console.error, unhandled rejections, window.onerror
- Session delete: remove a session from history, PRs auto-recalculated from remaining
- Sets `···` menu: edit/delete hidden behind per-card toggle
- Search clear `✕`: inline clear button on all search fields
- AI CORS fix: all AI calls via `/api/coach` Netlify proxy (coach.js)
- Auto exercise ordering: fixed nonstop loop (fingerprint-based, `coach.hasKey` in deps)
- `recovery.js` dead Netlify function deleted

## v0.9.1
- AI CORS fix: coach.js proxy · ordering loop fix · ordering error feedback
- Session delete with PR recalculation · Sets ··· menu · search clear ✕
- Error monitor dot (red/grey/invisible)

## v0.9
- Logo hidden — only appears sliding from top during pull-to-refresh
- YouTube in-app search + player (YouTube Data API) · prev/next navigation
- iOS zoom fix (viewport + input ≥17px) · Google Drive persistent connection
- API key saved state (✓ checkmark) · auto AI exercise ordering

## v0.8.2
- Tokenisation audit · bundle split 613KB→94KB · security headers
- useMemo on ProgressPage · useCallback on consult() · bugs B21–B24 fixed

## v0.8.1
- useCoach hook · MODELS (Haiku/Sonnet) · all prompts in useCoach.js
- Exercise order suggestion · Body Check uses Sonnet

## v0.8
- Body Check AI · stable set builder · YouTube bottom sheet
- Session: rest ±30s · exercise strip · bodyweight handling · calm completion

## v0.7.1 — SW black screen fix · exercise search + sort
## v0.7 — New icon · Google Drive card · lean memory · RULES.md
## v0.6 — Google Drive backup · Vite split · idb-keyval
## v0.5 — Training flow · 51 exercises · Progress · splash · ErrorBoundary
## v0.4 — PWA · v0.3 — Settings · v0.2 — Tokens · v0.1 — Core
