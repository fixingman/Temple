# 🟁 Temple — Backlog

Status tags: `[shipped]` = deployed untested · `[tested]` = verified on device · `[wip]` = in progress

## Up Next
1. **Run smoke tests S1–S8** — update HOUSEKEEPING with results
2. **YouTube API key setup** — add YOUTUBE_API_KEY to Netlify env vars (console.cloud.google.com → same project as Google Drive → enable YouTube Data API v3 → create API key)
3. **Session detail view** — tap history entry → full breakdown
4. **Post-session recovery tip** — auto-surface using prompts.recoveryTip (Haiku)
5. **Custom rest timer** — configurable in Settings

## Recently Shipped
| Feature | Status |
|---------|--------|
| Logo hidden, pull-to-refresh reveal | `[shipped]` |
| YouTube in-app search + player | `[shipped]` |
| YouTube prev/next navigation | `[shipped]` |
| iOS zoom fix | `[shipped]` |
| Google Drive persistent connection | `[shipped]` |
| API key saved state (checkmark) | `[shipped]` |
| Auto AI exercise ordering | `[shipped]` |
| Body Check + useCoach system | `[shipped]` |
| Bundle split 613KB→94KB | `[shipped]` |
| SW black screen fix | `[tested]` |

## Feature Backlog
| Feature | Priority | Status |
|---------|----------|--------|
| Exercise swap mid-session | High | prompts written, needs UI |
| Gap analysis (undertrained muscles) | High | prompts written, needs UI |
| Session detail view | Medium | — |
| Custom rest timer | Medium | — |
| Session notes + RPE | Medium | — |
| Post-session recovery tip | Medium | prompt written, needs UI |
| Active session indicator on tab | Low | — |
| Superset / circuit mode | Medium | — |
| Weekly/monthly volume charts | Medium | — |
| Rest timer audio alert | Low | — |
| Calendar heatmap | Low | — |
| Workout sharing | Low | — |

## Technical Debt
- App.jsx ~1780 lines — consider splitting pages
- recharts 537KB gzip — acceptable for now
- Timezone-naive week calculation
- No accessibility (aria, keyboard nav)
- Google OAuth in testing mode — needs verification to go public
- YouTube API key needs to be added to Netlify env vars
