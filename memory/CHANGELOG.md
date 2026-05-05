# 🟁 Temple — Changelog

## v0.8.2 (Current)
- Tokenisation audit: all raw hex and pixel values replaced with T tokens
- VideoSheet: handle bar positioning fixed · background #000 → C.bg
- Reorder + rest timer buttons: fontSize/padding tokenised
- Tab switcher: padding tokenised
- Start button: disabled when set has no valid exercises
- ApiKeyInput: draft syncs when value changes externally (import/restore)
- Body Check: "Go to Settings" now navigates and closes sheet
- Performance: ProgressPage computations in useMemo
- Performance: consult() in RecoverySheet wrapped in useCallback
- Performance: vite manualChunks splits recharts (app chunk 613KB → 94KB gzip)
- netlify.toml: security headers · SW served with no-cache
- Bug B21: showRecoveryMid useState after early returns — React hooks violation fixed
- Bug B22: Bodyweight logged sets showed "0kg × N reps" — now shows reps only
- Bug B23: DEFAULT_EXERCISES unused import removed
- Bug B24: MuscleBar unit prop destructure rename causing silent wrong display

## v0.8.1
- useCoach: central AI hook — ask(prompt, opts) → { text, error }
- MODELS: { fast: haiku, smart: sonnet } — per-feature model selection
- prompts: exerciseOrder · recoveryTip · exerciseSwap · gapAnalysis · bodyCheck
- RecoverySheet refactored to use coach prop + prompts
- Exercise order suggestion in set builder (✦ Suggest order — Haiku)
- Body Check uses Sonnet · exercise ordering uses Haiku
- ApiKeyInput in Settings — show/hide, save/remove, key preview
- anthropicKey in DEFAULT_SETTINGS + migration backfills existing users
- Bug fixes: MAX_TOKENS undefined · conditional useState crash · fmt() shadow · renderResult XSS

## v0.8
- Body Check: post-workout pain guidance via Claude AI (bottom sheet)
- Stable two-zone set builder layout (no jump on exercise select)
- YouTube form guide in bottom sheet (stays in-app)
- ConfirmDialog: "Cancel"/"Delete" labels
- Input: accent border on focus
- Library: larger tap targets · result count · readable BW/MOB tags
- Session: rest timer ±30s nudge · exercise progress strip · cancel demoted to text link
- Session: bodyweight hides weight input · mobility shows "Seconds"
- Completion: 🎉 removed, calm tone

## v0.7.1
- Exercise search in set builder · alphabetical sort
- SW black screen fix: network-first for index.html · versioned cache names

## v0.7
- New icon: pyramid with T in negative space
- Google Drive connected user card fix · lean memory system · RULES.md

## v0.6
- Google Drive backup/restore · bodyweight/mobility session handling
- Vite split · idb-keyval · netlify.toml

## v0.5
- Training flow · 51 exercises · Progress · loading splash · ErrorBoundary

## v0.4 — PWA: service worker · manifest · Apple meta
## v0.3 — Custom exercise CRUD · reordering · Settings
## v0.2 — Design token system · rebrand to Temple 🟁 · 9 bug fixes
## v0.1 — Exercise library · workout sets · session player · PR detection · progress
