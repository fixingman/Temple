# 🟁 Temple — Changelog

## v1.3 (Current)
- **Tooling**: Single `APP_VERSION` source of truth in `tokens.js` — `scripts/sync-version.mjs` rewrites sw.js cache names on `prebuild` (fixes version drift that left SettingsPage stuck at v0.9.3)
- **Tooling**: Automated Playwright smoke test (`npm run test:smoke`) — boots the built app, visits every tab, fails on any uncaught error; catches the boot-crash class (B33–B35) that `npm run build` misses
- **Motion**: Looping pulse moved from CSS `infinite` to a WAAPI `<Pulse>` component — no keyframe-0 flash on display toggle (mobile wake / tab switch)
- **Accessibility**: `prefers-reduced-motion` honoured app-wide (`MotionConfig reducedMotion="user"` + reduced-motion CSS + `<Pulse>` opt-out); tab buttons given `aria-label`s
- **Gap analysis**: AI identifies undertrained muscle groups from session history — JSON parse fix (greedy regex + markdown fence stripping)
- **Session detail view**: Tap any history entry to expand full exercise/set breakdown
- **Post-session recovery tip**: Auto-surfaces on workout completion screen (Sonnet for quality)
- **Active session indicator**: Pulsing dot on session tab while workout is in progress
- **API key UX**: Key input hidden after save — shows preview + Remove button only
- **Bug fix**: Google Drive userinfo 401 — added `openid profile email` to OAuth scope
- **SW cache**: Bumped to `temple-v1.3`

## v1.2
- **Google Drive**: Permanent auth via refresh tokens — no re-auth needed across sessions
- **AI muscle map**: Body diagram highlights trained muscles from recent sessions
- **YouTube**: Shorts filter — exclude short-form videos from workout search results
- **Session editing**: Edit/delete logged sets within a session
- **SW cache**: Bumped to `temple-v1.2`

## v1.1.1
- **Google Drive**: Silent token reconnect on app open — no manual "Connect" needed each session when token is expired but Google account session is still active
- **UI polish**: Exercise 3-dots menu (edit/delete behind per-card toggle), token audit & fix
- **SW cache**: Bumped to `temple-v1.1.1`

## v1.1
- **UI overhaul**: Athletic Direction B redesign — Phosphor icons, Framer Motion animations, Tone.js sound feedback
- **SW cache**: Bumped to `temple-v1.1`

## v0.9.3
- **Bug fix**: `fmtDate` missing import in SessionPage → crash on Train tab
- **Bug fix**: `liveCalories` temporal dead zone → crash on workout completion screen
- **Bug fix**: `MUSCLE_ICONS` missing import in ProgressPage → crash on Progress tab
- **Bug fix**: JSX syntax error in pull-to-refresh text removal → build failure
- **Google Drive**: Token persisted to idb-keyval — no reconnect needed each session
- **Google Drive**: UI correctly shows "Authorization required" when token expired vs "connected"
- **Logo**: Replaced `🟁` emoji with inline SVG `Logo`/`LogoIcon` components — fixes blank logo on mobile
- **Error dot**: Moved to top-right, `position:absolute` — scrolls with content, not fixed
- **Sets**: Margin added between Start and Edit/Delete buttons
- **Swap button**: Styled with `C.surface` background to match card
- **Pull-to-refresh**: Text labels removed, logo animation kept
- **YouTube**: `netlify.toml` explicit `/api/youtube → /.netlify/functions/youtube` redirect added
- **YouTube**: SPA `/*` catch-all redirect added to `netlify.toml`
- **YouTube**: Better error messages from API (shows reason code)
- **Vite**: Dev proxy for `/api/youtube` → `netlify dev`
- **SW cache**: Bumped to `temple-v0.9.3`

## v0.9.2
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
