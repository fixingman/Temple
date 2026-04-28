# 🟁 Temple — Backlog

## Up Next
1. **Test with real data** — 5+ sessions, note friction · iOS Safari + Android Chrome
2. **Session detail view** — tap history entry → full breakdown (exercises, sets, volume, duration)
3. **Custom rest timer** — user-configurable duration in Settings (default 90s)
4. **Branding & copy audit** — every string vs PRODUCT.md tone rules · nav reconsider

## Feature Backlog
| Feature | Priority |
|---------|----------|
| Session notes + RPE rating | Medium |
| Active session indicator on tab | Low |
| Superset / circuit mode | Medium |
| Swap exercise mid-session | Medium |
| Weekly/monthly volume charts | Medium |
| Rest timer audio alert | Low |
| Calendar heatmap | Low |
| Haptic feedback on PR | Low |
| Workout sharing (image/text) | Low |
| Light theme | Low |

## Technical Debt
- App.jsx ~1250 lines — consider splitting pages into files
- Timezone-naive week calculation
- No accessibility (aria, keyboard nav)
- Google OAuth in testing mode — needs verification to go public
