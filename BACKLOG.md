# 🟁 Temple — Backlog

## Big Three (Next Milestones)

### 1. Deploy to Netlify
- Scaffold Vite + React project, split ~1400-line file into modules
- Swap `window.storage` → IndexedDB via `idb-keyval`
- Real manifest.json + service worker files
- CI: run runDataTests() as build validation
- Pick domain (temple.fit, templeapp.dev, etc.)

### 2. Test the App — Use It & Write Backlog
- Complete 5+ real sessions, note every friction point
- Test on iOS Safari + Android Chrome
- Write findings directly into this backlog

### 3. High Quality Branding & Tonality
- **Voice**: confident, minimal, never cheesy. Aligned with product philosophy (PRODUCT.md).
- **Copy audit**: every string — buttons, empty states, encouragement, errors
- **Loading screen**: 🟁 spin is live — evaluate if duration/motion feel right ✓
- **Bottom nav**: reconsider 5 tabs. Settings may not need a permanent slot.
- **Top nav**: reconsider what lives in the header. Settings gear? Session status?
- **Consider**: custom wordmark/logo, app icon, onboarding flow

---

## Missing Features

| # | Feature | Priority |
|---|---------|----------|
| 1 | Session detail view (tap history to expand) | Medium |
| 2 | Estimated 1RM calculation | Medium |
| 3 | Session notes + RPE rating | Medium |
| 4 | Custom rest timer duration in settings | Medium |
| 5 | Active session indicator on tab | Low |

## Suggested Improvements

### Medium
- Superset / circuit mode
- Swap exercise mid-session
- Weekly/monthly volume charts

### Low
- Exercise illustrations
- Haptic feedback on PR
- Workout sharing (generate image/text summary)
- Light theme toggle
- Rest timer audio alert
- Calendar heatmap

### Technical Debt
- Single-file ~1400 lines — split for deploy
- Timezone-naive week calculation
- No accessibility (aria, keyboard nav)
