# 🟁 Temple — Architecture (v1.6)

## Stack
React 18 · Vite 6 · recharts · framer-motion · Tone.js · Phosphor icons · idb-keyval · Netlify (static + functions) · Google Drive API · Anthropic API (via proxy) · Playwright (tests)

## File Structure
```
src/
  main.jsx         Entry
  App.jsx          Root component, tab routing, ErrorMonitor, pull-to-refresh, <MotionConfig>
  components.jsx   Shared UI: Tabs, Card, Btn, Input, ConfirmDialog, ErrorBanner, PillFilter,
                   InstallBanner, YTButton, VideoSheet, Pulse (WAAPI loop), GlobalStyles (emits --c-* vars)
  tokens.js        APP_VERSION (single version source), PALETTES (dark/light literals), T / C (var() refs), S helpers
  data.js          DEFAULT_EXERCISES, DEFAULT_SETTINGS, MET + calcCalories, uid, fmt, est1RM, displayWeight, toKg
  hooks.js         useAppData (idb-keyval + settings backfill), usePWA, useTheme
  icons.jsx        Only import point for Phosphor icons
  MuscleMap.jsx    Front/back SVG body map, themed via tokens
  useSound.js      Tone.js sound hook (only place Tone is imported)
  useGoogleDrive.js Google Drive OAuth + backup/restore (refresh tokens via google-token function)
  useCoach.js      useCoach hook, MODELS, coachError, prompts (all AI prompts)
  appleHealth.js   Workout-duration Shortcuts URL builder, iOS detection
  pages/
    LibraryPage.jsx  Exercise library + CRUD + filters
    SetsPage.jsx     Workout set builder + AI ordering
    SessionPage.jsx  Training flow, rest timer, RecoverySheet, body check, completion screen
    ProgressPage.jsx Stats, PRs, charts, muscle summary (all time / month), history + session detail
    SettingsPage.jsx Units, Appearance, bodyweight, Google Drive, API key, export/import

netlify/functions/
  coach.js         Anthropic API proxy (avoids CORS, forwards user key)
  youtube.js       YouTube Data API v3 proxy (needs YOUTUBE_API_KEY, caches 1hr)
  google-token.js  Google OAuth code/refresh-token exchange (needs GOOGLE_CLIENT_SECRET; returns 503 if unset)

scripts/sync-version.mjs     prebuild: rewrites sw.js cache names from APP_VERSION
scripts/netlify-headers.mjs  postbuild (Netlify only): appends a script-src-elem CSP to dist/_headers to block Netlify's injected badge script
tests/                       smoke.spec.js · workout.spec.js · muscles.spec.js · netlify-headers.spec.js (Playwright)
```

## Data Model
```typescript
AppData {
  exercises: Exercise[]       // id, name, muscle, equipment, category, yt
  sets:      WorkoutSet[]     // id, name, exerciseIds[], createdAt
  sessions:  Session[]        // id, setId, date, duration (s), entries[]{exerciseId, sets[]{weight,reps}}
  prs:       Record<id, PR>   // maxWeight, maxReps, maxVolume, date
  settings:  {
    unit: "kg"|"lbs",
    anthropicKey: string,
    bodyweightKg: string|number,        // optional; calories shown only when set
    theme: "dark"|"light"|"system"      // default "system"
  }
}
```
Key `"temple-data"` in idb-keyval. Weights stored in kg. Display via `displayWeight(kg, unit)` / `toKg(val, unit)`. `useAppData` backfills any missing `settings` key from `DEFAULT_SETTINGS` on load, so new settings need a default there.

## Calories
`calcCalories(exerciseIds, exercises, durationSeconds, bodyweightKg)` → `round(avgMET × kg × hours)`. MET is 5.0 for strength and 2.5 for mobility, averaged across the session's exercises. Returns `null` without a positive bodyweight or duration. It is an estimate, not a measurement. Shown live in Session, on the completion screen, and in History (list row and detail).

## Theming
Literal colors live only in `PALETTES` (`tokens.js`). `GlobalStyles` emits them as `--c-*` variables per `:root[data-theme]`; `T.color` values are `var()` references. `useTheme` sets `data-theme` before paint and syncs `<meta name="theme-color">`. See DESIGN.md.

## Muscle summary period (v1.5)
ProgressPage groups sessions by local calendar month. The Period select (All time default, then recorded months newest first) scopes the muscle map, volume bars and gap analysis. Months follow the device calendar; years stay distinct.

## Apple Health handoff
`SessionPage` keeps the just-completed session in component state and generates a `shortcuts://run-shortcut` link only for a positive duration on iPhone/iPad. The URL carries JSON containing `durationMinutes` only. A user-created `Temple Health` Shortcut parses it and uses the iOS `Log Workout` action to write to Health. There is no HealthKit call, server request, automatic sync, or confirmation callback to Temple. The logged date is the Shortcut run time unless the user extends the Shortcut. The handoff must be checked on an iPhone before marking device-tested.

## AI Architecture
```
useCoach(apiKey) → { ask(prompt, opts) → { text, error }, hasKey }
  Routes through /api/coach (Netlify function) to avoid CORS

MODELS = { fast: "haiku", smart: "sonnet" }

prompts (all in useCoach.js):
  exerciseOrder(exercises)              → Haiku, JSON array
  recoveryTip(exercises, volume)        → Sonnet (passed by SessionPage), 2-3 sentences
  exerciseSwap(exercise, area, avail)   → Haiku, JSON [{name, reason}]
  gapAnalysis(muscleVolume, sets)       → Sonnet, JSON [{setName, exercises, reason}]
  bodyCheck(area, description, recent)  → Sonnet, structured markdown
```
`ask()` defaults to `MODELS.fast`; callers pass `MODELS.smart` explicitly where quality matters (recovery tip, gap analysis, body check).

## Bundle (v1.6, gzip)
App entry ~81 KB · vendor chunk ~135 KB · ProgressPage chunk (recharts, lazy) ~114 KB. Measured 2026-11-19 from `npm run build`.
