# 🟁 Temple — Changelog

## v0.9 (Current)
- Logo hidden by default — only appears sliding in from top during pull-to-refresh gesture
- Pull-to-refresh: 🟁 TEMPLE slides down tracking your finger, spins on release, reloads page
- Safe area header fixed — content no longer hidden behind iPhone notch/Dynamic Island
- YouTube in-app search: real results via YouTube Data API v3 (Netlify function)
- YouTube in-app player: tap result to play embedded video, prev/next navigation, "X of 8" counter
- iOS zoom fix: viewport maximum-scale=1, all inputs ≥17px (T.fontSize.h3)
- Google Drive persistent connection: user info stored in idb-keyval, silent token refresh on load
- API key input: "Save Key" button replaced with ✓ teal card once saved
- Auto AI exercise ordering: triggers 1.2s after selection stabilises (2+ exercises), silent, resets on change
- Token fixes: #000/#fff in VideoSheet replaced with C.bg/C.text
- Netlify function: youtube.js — proxies YouTube Data API, caches 1hr

## v0.8.2
- Tokenisation audit · VideoSheet handle fix · Start button disabled state
- ApiKeyInput draft sync · Body Check navigation · useMemo on ProgressPage
- Bundle split 613KB→94KB · security headers · bugs B21–B24 fixed

## v0.8.1
- useCoach hook · MODELS (Haiku/Sonnet) · all prompts in useCoach.js
- Exercise order suggestion · Body Check uses Sonnet
- User API key in Settings · anthropicKey in DEFAULT_SETTINGS

## v0.8
- Body Check: post-workout pain guidance via Claude AI
- Stable two-zone set builder · YouTube bottom sheet · exercise search
- Session: rest timer ±30s · exercise progress strip · calm completion screen
- ConfirmDialog labels · Input focus border

## v0.7.1
- SW black screen fix: network-first HTML · versioned cache names
- Exercise search + alphabetical sort in set builder

## v0.7
- New icon: pyramid with T in negative space
- Google Drive connected user card · lean memory system · RULES.md

## v0.6
- Google Drive backup/restore · Vite split · idb-keyval

## v0.5
- Training flow · 51 exercises · Progress · loading splash · ErrorBoundary

## v0.4 — PWA: service worker · manifest · Apple meta
## v0.3 — Custom exercise CRUD · reordering · Settings
## v0.2 — Design token system · rebrand to Temple 🟁
## v0.1 — Exercise library · workout sets · session player · PR detection
