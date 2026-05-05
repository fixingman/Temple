# 🟁 Temple — Architecture (v0.8)

## Stack
React 18 · Vite · recharts · idb-keyval · Netlify · Google Drive API · Anthropic API

## Files
```
src/main.jsx          React root + SW registration (prod only)
src/tokens.js         T object + C = T.color alias
src/data.js           DEFAULT_EXERCISES, constants, uid, fmt, est1RM, displayWeight, toKg
src/hooks.js          useAppData (idb-keyval), usePWA — settings migration backfills missing keys
src/useGoogleDrive.js Google Drive backup/restore hook
src/useCoach.js       useCoach hook · MODELS · coachError · prompts (all AI prompts)
src/App.jsx           All components, pages, root (~1590 lines)
```

## Data Model
```typescript
AppData {
  exercises: Exercise[]       // id, name, muscle, equipment, category, yt
  sets:      WorkoutSet[]     // id, name, exerciseIds[], createdAt
  sessions:  Session[]        // id, setId, date, duration, entries[]{exerciseId, sets[]{weight,reps}}
  prs:       Record<id, PR>   // maxWeight, maxReps, maxVolume, date
  settings:  { unit: "kg"|"lbs", anthropicKey: string }
}
```
Weights stored in kg. Display via `displayWeight(kg, unit)` / `toKg(val, unit)`.

## AI Architecture
```
useCoach(apiKey)
  ├── ask(prompt, { maxTokens, model }) → { text, error }
  ├── hasKey: boolean
  └── MODELS = { fast: "haiku", smart: "sonnet" }

prompts (all in useCoach.js)
  ├── exerciseOrder(exercises) → Haiku — JSON array of names
  ├── recoveryTip(exercises, volume) → Haiku — 2-3 sentences
  ├── exerciseSwap(exercise, area, available) → Haiku — JSON [{name, reason}]
  ├── gapAnalysis(muscleVolume, existingSets) → Sonnet — JSON [{setName, exercises, reason}]
  └── bodyCheck(area, description, recentExercises) → Sonnet — structured markdown
```

## Component Tree
```
Temple (root — useCoach initialised here)
├── GlobalStyles (CSS animations)
├── Splash (loading)
├── InstallBanner
├── Header (logo + save dot)
├── LibraryPage
├── SetsPage (coach prop — exerciseOrder suggestion)
│   └── ExercisePickerModal (search + muscle filter)
├── SessionPage (coach prop — RecoverySheet × 2)
│   ├── VideoSheet (YouTube in-app bottom sheet)
│   └── RecoverySheet (body check AI — no-key state → Settings nav)
├── ProgressPage (useMemo on heavy computations)
│   └── PRCard (recharts LineChart)
├── SettingsPage
│   ├── ApiKeyInput (draft sync on external change)
│   └── GoogleDriveCard
└── Shared: Card, Btn, Input, ConfirmDialog, ErrorBanner, PillFilter, ApiKeyInput
```

## Bundle
- App chunk: ~94KB gzip (split via vite manualChunks)
- recharts chunk: ~154KB gzip (loads on demand when Progress/PRs rendered)
- vendor-react: inlined into app chunk
