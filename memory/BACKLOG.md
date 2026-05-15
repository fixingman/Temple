# 🟁 Temple — Backlog

Status tags: `[shipped]` = deployed untested · `[tested]` = verified on device · `[wip]` = in progress

## Up Next
1. **Test YouTube** — verify on production (API key set, redirect in netlify.toml) — enable for all Netlify contexts
2. **Test AI features** — add Anthropic key in Settings → create a set with 3+ exercises → verify AI ordering works
3. **Verify Google Drive** — token persistence working, no reconnect needed per session
4. **Session detail view** — tap history entry → full breakdown
5. **Post-session recovery tip** — auto-surface using prompts.recoveryTip (Haiku)
6. **Custom rest timer** — configurable in Settings

## Recently Shipped
| Feature | Status |
|---------|--------|
| v0.9.3 bug fixes (fmtDate, liveCalories, MUSCLE_ICONS, build error) | `[shipped]` |
| Google Drive token persistence | `[shipped]` |
| Inline SVG logo (mobile fix) | `[shipped]` |
| YouTube netlify.toml routing | `[shipped]` |
| Error dot top-right (scrolls) | `[shipped]` |
| Set CTA spacing + swap button style | `[shipped]` |
| Code split into page files | `[tested]` |
| Error monitor dot | `[tested]` |
| Session delete + PR recalc | `[tested]` |
| YouTube in-app search + player | `[shipped]` |

## Feature Backlog
| Feature | Priority | Status |
|---------|----------|--------|
| Exercise swap mid-session | High | prompts written, needs UI |
| Gap analysis (undertrained muscles) | High | prompts written, needs UI |
| Session detail view | Medium | — |
| Custom rest timer | Medium | — |
| Post-session recovery tip | Medium | prompt written, needs UI |
| Session notes + RPE | Medium | — |
| Superset / circuit mode | Medium | — |
| Active session indicator on tab | Low | — |
| Weekly/monthly volume charts | Medium | — |
| Calendar heatmap | Low | — |

## Technical Debt
- S style helpers added but not yet applied to existing code (would reduce tokens further)
- recharts 537KB gzip — acceptable, needs lighter lib to fix
- Timezone-naive week calculation
- No accessibility (aria, keyboard nav)
- Google OAuth in testing mode
