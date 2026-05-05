# 🟁 Temple — Changelog

## v0.8.2 (Current)
- Tokenisation audit: all raw hex and pixel values replaced with T tokens
- VideoSheet: handle bar positioning fixed (was broken with position:absolute)
- VideoSheet: background #000 → C.bg (token compliant)
- Reorder buttons: fontSize/padding tokenised
- Tab switcher: padding tokenised
- Start button: disabled when set has no valid exercises (all deleted from library)
- ApiKeyInput: draft syncs when value changes externally (import/restore)
- Body Check: "Go to Settings" now navigates to Settings tab and closes sheet
- Rest timer: nudge buttons padding tokenised
- Performance: ProgressPage computations wrapped in useMemo
- Performance: consult() in RecoverySheet wrapped in useCallback
- Performance: vite manualChunks splits recharts into separate chunk (613KB → 94KB app chunk)
- netlify.toml: security headers (X-Content-Type-Options, X-Frame-Options, Referrer-Policy)
- netlify.toml: SW served with no-cache header
- All memory files updated, HOUSEKEEPING smoke tests expanded to S1–S8

## v0.8.1
- useCoach: central AI hook — all AI features route through ask(prompt, opts)
- MODELS: { fast: haiku, smart: sonnet } — per-feature model selection
- prompts: exerciseOrder · recoveryTip · exerciseSwap · gapAnalysis · bodyCheck
- RecoverySheet refactored to use coach prop + prompts (removed direct fetch)
- Exercise order suggestion in set builder (✦ Suggest order — Haiku)
- Body Check uses Sonnet, exercise ordering uses Haiku
- Removed Netlify function — user provides own API key, sent direct to Anthropic
- ApiKeyInput component in Settings — show/hide, save/remove, key preview
- anthropicKey added to DEFAULT_SETTINGS + migration backfills existing users
- Bug fixes: MAX_TOKENS undefined crash · conditional useState in completion screen · fmt() shadow in SessionPage · settings migration missing key backfill · renderResult HTML sanitisation

## v0.8
- Body Check: post-workout pain/discomfort guidance via Claude AI (bottom sheet)
- Stable two-zone set builder layout (no content jump on exercise select)
- YouTube form guide opens in bottom sheet (stays in-app, slide-up animation)
- Exercise search in set builder: live filter, overrides muscle pills
- Exercises sorted alphabetically in picker
- ConfirmDialog: "Cancel"/"Delete" labels instead of "No"/"Yes"
- Input: accent border on focus
- Library: larger tap targets for edit/delete, result count, readable BW/MOB tags
- Session: rest timer ±30s nudge buttons
- Session: exercise progress strip (all exercises shown as pills, active/done states)
- Session: "Cancel workout" demoted to quiet text link
- Session: bodyweight exercises hide weight input · mobility shows "Seconds" label
- Completion: 🎉 removed, calm tone per product philosophy
- Session: "Feeling pain?" link → Body Check available mid-workout and post-session

## v0.7.1
- Exercise search in set builder · alphabetical sort
- SW black screen fix: network-first for index.html
- SW cache versioning: cache names match app version

## v0.7
- New icon: pyramid with T in negative space (triple reading)
- Google Drive connected user card: avatar, name, email, initial fallback
- Lean memory system: all 7 files rewritten compact
- RULES.md: start/end routines, smoke tests, shipped/tested tracking

## v0.6
- Google Drive backup/restore (OAuth 2.0, drive.file scope)
- Bodyweight/mobility session handling
- Vite project split · idb-keyval · netlify.toml + headers + redirects

## v0.5
- Training flow · 51 exercises · Progress · loading splash · ErrorBoundary

## v0.4
- PWA: service worker · manifest · Apple meta · install prompt

## v0.3
- Custom exercise CRUD · reordering · Settings

## v0.2
- Design token system · rebrand to Temple 🟁 · 9 bug fixes

## v0.1
- Exercise library · workout sets · session player · PR detection · progress
