# 🟁 Temple — Changelog

## v0.6 (Current)
- Google Drive backup/restore (OAuth, drive.file scope, `useGoogleDrive.js`)
- Bodyweight exercises: hide weight input, reps only
- Mobility exercises: "Seconds" label, hide weight
- Timer format: consistent zero-padding ("02:05")
- Removed shadowed `fmt()` in SessionPage
- manifest.json: removed missing PNG icon refs
- Removed dead `runDataTests()`
- Vite project split: tokens.js · data.js · hooks.js · useGoogleDrive.js · App.jsx · main.jsx
- idb-keyval replaces window.storage
- netlify.toml + _headers + _redirects + .gitignore

## v0.5
- Training flow: pre-fill from last session · set-by-set log → 90s rest → flash → next
- Exercise library: 51 exercises · equipment/category fields + filters · BW/MOB tags
- Progress: WEEKS ACTIVE X/4 · muscle volume bars · PR inline charts · repeat session
- Motion: loading splash · CSS animation system · spring easing tokens
- ErrorBoundary · save indicator · data migration

## v0.4
- PWA: service worker · manifest · Apple meta · install prompt

## v0.3
- Custom exercise CRUD · reordering · Settings (units, export/import, reset)

## v0.2
- Design token system (T object) · rebrand to Temple 🟁 · 9 bug fixes

## v0.1
- Exercise library · workout sets · session player · PR detection · progress dashboard
