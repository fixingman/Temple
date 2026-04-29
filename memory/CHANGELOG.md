# 🟁 Temple — Changelog

## v0.7.1 (Current)
- Exercise search in set builder — live filter across all exercises, overrides muscle pill filter
- Exercises listed alphabetically in picker (always, including search results)
- Empty search state: "No exercises found for X"
- SW fix: network-first for index.html — new deploys take effect immediately, no more black screen on refresh
- SW: separate asset cache (content-hashed files stay cached forever)
- SW cache names now versioned to match app version (temple-v0.7.1)

## v0.7
- New icon: pyramid with T in negative space (triple reading: pyramid · barbell plates · T for Temple)
- Google Drive connected user card: avatar, name, email, fallback initial, robust to ad blockers
- Lean memory system: all 7 files rewritten compact (~320 lines / 14KB)
- RULES.md: start + end of session routines, standing rules, deployment, versioning
- BACKLOG.md: shipped/tested tracking tags
- HOUSEKEEPING.md: 5 smoke test scenarios added

## v0.6
- Google Drive backup/restore (OAuth 2.0, drive.file scope, useGoogleDrive.js)
- Bodyweight exercises: hide weight input · Mobility: "Seconds" label
- Timer format: zero-padding · Removed shadowed fmt() · manifest.json PNG refs removed
- Vite project split · idb-keyval · netlify.toml + _headers + _redirects + .gitignore

## v0.5
- Training flow: pre-fill · set-by-set log → 90s rest → flash → next
- 51 exercises · filters · Progress: WEEKS ACTIVE X/4 · PR charts · repeat session
- Loading splash · CSS animation system · ErrorBoundary · save indicator

## v0.4
- PWA: service worker · manifest · Apple meta · install prompt

## v0.3
- Custom exercise CRUD · reordering · Settings (units, export/import, reset)

## v0.2
- Design token system (T object) · rebrand to Temple 🟁 · 9 bug fixes

## v0.1
- Exercise library · workout sets · session player · PR detection · progress dashboard
