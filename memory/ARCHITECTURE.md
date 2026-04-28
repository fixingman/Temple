# 🟁 Temple — Architecture (v0.6)

## Stack
React 18 · Vite · recharts · idb-keyval · Netlify · Google Drive API (OAuth 2.0)

## Files
```
src/main.jsx          React root + SW registration (prod only)
src/tokens.js         T object + C = T.color alias
src/data.js           DEFAULT_EXERCISES, constants, uid, fmt, est1RM, displayWeight, toKg
src/hooks.js          useAppData (idb-keyval), usePWA
src/useGoogleDrive.js Google Drive backup/restore hook
src/App.jsx           All components, pages, root (~1250 lines)
```

## Data Model
```typescript
AppData {
  exercises: Exercise[]       // id, name, muscle, equipment, category, yt
  sets:      WorkoutSet[]     // id, name, exerciseIds[], sets[]{weight,reps}
  sessions:  Session[]        // id, setId, date, duration, entries[]{exerciseId, sets[]{weight,reps}}
  prs:       Record<id, PR>   // maxWeight, maxReps, maxVolume, date
  settings:  { unit: "kg"|"lbs" }
}
```
Weights stored in kg. Display conversion via `displayWeight(kg, unit)` / `toKg(val, unit)`.

## Component Tree
```
Temple (root)
├── GlobalStyles
├── Splash (loading)
├── InstallBanner
├── Header (logo + save dot)
├── LibraryPage
│   ├── ExerciseCard + ExerciseForm
│   └── FilterBar (muscle | equipment | category)
├── SetsPage
│   └── SetCard + ExercisePickerModal
├── SessionPage
│   └── ExerciseEntryCard (weight/reps inputs, logged summary)
├── ProgressPage
│   └── PRCard (recharts LineChart inline)
├── SettingsPage
│   └── GoogleDriveCard
└── Shared: Card, Btn, ConfirmDialog, ErrorBanner
```

## Key Patterns
- `useAppData` — loads idb-keyval on mount (1.2s min splash), saves with `setSaving` indicator
- `useGoogleDrive` — lazy-loads GIS + GAPI scripts, token client, backup/restore via Drive API
- Data migration on load: backfills `equipment`/`category`, merges new default exercises
- `est1RM(weight, reps)` — Epley formula, shown in PR cards (purple)
- `isBodyweight` / `isMobility` flags in SessionPage control input visibility and log validation
