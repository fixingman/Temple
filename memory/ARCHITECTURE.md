# 🟁 Temple — Architecture (v0.9.1)

## Stack
React 18 · Vite · recharts · idb-keyval · Netlify · Google Drive API · Anthropic API (via proxy)

## File Structure
```
src/
  App.jsx          Root component + ErrorMonitor (~280 lines)
  components.jsx   Shared UI: Tabs, Card, Btn, Input, ConfirmDialog,
                   ErrorBanner, PillFilter, InstallBanner, YTButton, VideoSheet, GlobalStyles
  tokens.js        T object + C alias + S style shorthand helpers
  data.js          DEFAULT_EXERCISES, constants, uid, fmt, est1RM, displayWeight, toKg
  hooks.js         useAppData (idb-keyval), usePWA
  useGoogleDrive.js Google Drive OAuth + backup/restore
  useCoach.js      useCoach hook, MODELS, coachError, prompts (all AI prompts)
  pages/
    LibraryPage.jsx  Exercise library + CRUD + FilterBar (~170 lines)
    SetsPage.jsx     Workout set builder + AI ordering (~275 lines)
    SessionPage.jsx  Training flow + RecoverySheet + body check (~470 lines)
    ProgressPage.jsx Stats + PRs + charts + history + MuscleBar + PRBadge (~310 lines)
    SettingsPage.jsx Settings + Google Drive card + ApiKeyInput (~245 lines)

netlify/functions/
  coach.js    Anthropic API proxy (avoids CORS, forwards user key)
  youtube.js  YouTube Data API v3 proxy (caches 1hr)
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
useCoach(apiKey) → { ask(prompt, opts) → { text, error }, hasKey }
  Routes through /api/coach (Netlify function) to avoid CORS

MODELS = { fast: "haiku", smart: "sonnet" }

prompts (all in useCoach.js):
  exerciseOrder(exercises)              → Haiku, JSON array
  recoveryTip(exercises, volume)        → Haiku, 2-3 sentences
  exerciseSwap(exercise, area, avail)   → Haiku, JSON [{name, reason}]
  gapAnalysis(muscleVolume, sets)       → Sonnet, JSON [{setName, exercises, reason}]
  bodyCheck(area, description, recent)  → Sonnet, structured markdown
```

## Token Footprint (lines)
- Full read (all src): ~1470 lines
- App.jsx only: 280 lines
- Single page: 170–470 lines
- Previously: single 1972-line App.jsx
