# 🟁 Temple — Backlog

Status tags: `[shipped]` = deployed untested · `[tested]` = verified on device · `[wip]` = in progress

## Up Next
1. **Run smoke tests S1–S8** — user testing today, update HOUSEKEEPING with results
2. **Session detail view** — tap history entry → full breakdown (exercises, sets, volume, duration)
3. **Post-session recovery tip** — auto-surface after session using prompts.recoveryTip (Haiku)
4. **Custom rest timer** — configurable duration in Settings (default 90s)
5. **Exercise swap** — mid-session injury replacement using prompts.exerciseSwap (UI needed)
6. **Gap analysis** — undertrained muscle suggestions using prompts.gapAnalysis (UI needed)

## Recently Shipped
| Feature | Status |
|---------|--------|
| Body Check (AI pain guidance) | `[shipped]` |
| useCoach + prompts system | `[shipped]` |
| Exercise order suggestion | `[shipped]` |
| Set builder UX rewrite | `[shipped]` |
| YouTube bottom sheet | `[shipped]` |
| Bundle split 613KB→94KB | `[shipped]` |
| Security headers | `[shipped]` |
| 4 new bugs found and fixed (B21–B24) | `[shipped]` |
| SW black screen fix | `[tested]` |

## Feature Backlog
| Feature | Priority | Status |
|---------|----------|--------|
| Exercise swap mid-session | High | prompts written, needs UI |
| Gap analysis (undertrained muscles) | High | prompts written, needs UI |
| Session detail view | Medium | — |
| Custom rest timer | Medium | — |
| Session notes + RPE | Medium | — |
| Active session indicator on tab | Low | — |
| Superset / circuit mode | Medium | — |
| Weekly/monthly volume charts | Medium | — |
| Rest timer audio alert | Low | — |
| Calendar heatmap | Low | — |
| Workout sharing | Low | — |

## Technical Debt
- App.jsx ~1590 lines — consider splitting pages into files
- recharts 537KB gzip — acceptable, needs lighter lib to fix
- Timezone-naive week calculation
- No accessibility (aria, keyboard nav)
- Google OAuth in testing mode — needs verification to go public
