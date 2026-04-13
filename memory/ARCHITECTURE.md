# 🟁 Temple — Architecture (v0.5)

## Tech Stack
- **Framework**: React 18 (JSX artifact, single-file)
- **Charts**: recharts (LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid)
- **Styling**: Inline styles via `T` token object + `C` color alias. CSS animations via injected `<style>` (GlobalStyles component).
- **Storage**: `window.storage` API (persistent key-value, artifact runtime). Migration to IndexedDB via idb-keyval planned for Netlify deploy.

## File Structure
```
temple.jsx              — Single-file React app (~1450 lines)
memory/
  PROJECT.md            — Project overview and current state
  PRODUCT.md            — Feature documentation
  DESIGN.md             — Design system (tokens, recipes, motion, quality principles)
  ARCHITECTURE.md       — This file
  CHANGELOG.md          — Version history
  BACKLOG.md            — Remaining work and Big Three milestones
```

## Data Model

Single JSON blob under storage key `temple-data`:

```typescript
interface AppData {
  exercises: Exercise[];
  sets: WorkoutSet[];
  sessions: Session[];
  prs: Record<string, PRRecord>;
  settings: { unit: "kg" | "lbs" };
}

interface Exercise {
  id: string;        // "e1" (default) or "ex_" + uid() (custom)
  name: string;
  muscle: string;    // "Chest" | "Back" | "Shoulders" | "Legs" | "Arms" | "Core" | "Glutes"
  equipment: string; // "weighted" | "bodyweight"
  category: string;  // "strength" | "mobility"
  yt: string;        // YouTube search query
}

interface WorkoutSet {
  id: string;        // uid()
  name: string;
  exerciseIds: string[];
  createdAt: number;
}

interface Session {
  id: string;
  setId: string;
  date: number;
  duration: number;  // seconds
  entries: SessionEntry[];
}

interface SessionEntry {
  exerciseId: string;
  sets: { reps: number; weight: number }[];  // weight always stored in kg
}

interface PRRecord {
  maxWeight: number;  // kg
  maxReps: number;
  maxVolume: number;  // kg (sum of reps × weight)
  date: number;
}
```

## Component Tree

```
Temple (root, default export)
├── GlobalStyles              — Injected <style> with @keyframes + CSS resets
├── ErrorBoundary             — Class component, catches render errors
├── Tabs                      — Fixed bottom nav (5 tabs)
├── InstallBanner             — PWA install prompt (conditional)
├── LibraryPage               — Exercise CRUD + search + filter
├── SetsPage                  — Set CRUD + exercise picker + reorder + muscle highlight
├── SessionPage               — Training flow (pre-fill, log set, auto-rest, completion)
├── ProgressPage              — Stats, PRs (expandable), muscles (bars), history (repeat)
│   └── MuscleBar             — Horizontal volume bar
└── SettingsPage              — Units, export/import, reset, about
```

## Shared Components

| Component       | Props                                | Purpose                              |
|-----------------|--------------------------------------|--------------------------------------|
| `Card`          | children, style, onClick, className  | Surface container with border        |
| `Btn`           | variant, children, style, disabled, onClick | Button (primary/secondary/danger/ghost) |
| `Input`         | label, ...inputProps                 | Labeled text input                   |
| `Tabs`          | active, onChange                     | Bottom tab bar (5 tabs)              |
| `YTButton`      | query                                | Red YouTube link button              |
| `PRBadge`       | (none)                               | Purple "🏆 PR" pill                  |
| `ConfirmDialog` | message, onConfirm, onCancel         | Modal confirmation with backdrop     |
| `ErrorBanner`   | message                              | Inline danger-colored validation message |
| `PillFilter`    | options, active, onChange, small      | Reusable pill toggle group           |
| `FilterBar`     | muscle, onMuscle, equipment, onEquipment, category, onCategory, small | Grouped filter: muscle pills + equipment/category toggles |
| `MuscleBar`     | label, value, max, icon, unit        | Horizontal progress bar for muscle volume |
| `InstallBanner` | onInstall, onDismiss                 | PWA install prompt                   |

## Key Patterns

### State Management
- **`useAppData()` hook** — loads from storage on mount, `save()` writes to state + storage simultaneously. Tracks `loading` and `saving` booleans.
- **`usePWA()` hook** — manages service worker registration, manifest injection, install prompt. All operations wrapped in try-catch for sandbox safety.
- **Page-level local state** — each page owns its UI state (filters, forms, expanded items)
- **No global state library** — prop drilling from root is sufficient

### Unit System
- All weights stored internally as kg
- `displayWeight(kg, unit)` converts for display
- `toKg(val, unit)` converts input back for storage
- `weightLabel(unit)` returns "kg" or "lbs"

### Training Flow (SessionPage)
- `getLastSessionData()` looks up most recent session for pre-fill
- `sessionData[].sets[]` = pre-filled values from history
- `sessionData[].logged[]` = actually completed sets (separate array)
- `logSet()` moves current input to logged, auto-starts rest timer
- `finishSession()` converts logged data to kg, detects PRs, saves

### PR Detection
- Runs in `finishSession()` against `data.prs[exerciseId]`
- Three independent checks: max weight, max reps, total volume
- New PRs collected into `newPRs[]` for completion screen display

### Exercise CRUD Cascading
- Deleting an exercise removes it from all sets' `exerciseIds[]` and deletes its PR record
- Starting a session filters out deleted exercise IDs

### Animation System
- `GlobalStyles` component injects `@keyframes` + CSS utility classes
- Classes: `t-logo-spin`, `t-text-in`, `t-fade-in`, `t-scale-in`, `t-pulse`
- All animation timings use easing curves from `T.easing.*`

## Constants
- `DEFAULT_EXERCISES` — 51 exercises (25 weighted, 26 bodyweight, 37 strength, 14 mobility)
- `MUSCLE_GROUPS` / `MUSCLE_GROUPS_NO_ALL` — filter options
- `EQUIPMENT_TYPES` — `["Weighted", "Bodyweight"]`
- `CATEGORY_TYPES` — `["Strength", "Mobility"]`
- `MUSCLE_ICONS` — emoji per muscle group
- `KG_TO_LBS` — 2.20462
- `DEFAULT_REST` — 90 (seconds)
- `DEFAULT_SETTINGS` — `{ unit: "kg" }`
- `STORAGE_KEY` — `"temple-data"`

## Constraints
- **Single file** — ~1450 lines. Will split into modules for Netlify deploy.
- **Artifact sandbox** — service worker registration from Blob URLs fails; PWA features degrade gracefully.
- **No external CSS** — all styling inline or via injected `<style>` tag.
- **No localStorage** — artifact runtime blocks it; must use `window.storage` API.
- **recharts** — only external dependency beyond React.
