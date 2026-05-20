# Temple — Backlog

Status tags: `[shipped]` = deployed untested · `[tested]` = verified on device · `[wip]` = in progress

## Up Next
— nothing queued, pick from Feature Backlog below —

## Recently Shipped
| Feature | Status |
|---------|--------|
| Active session indicator on tab | `[shipped]` |
| Gap analysis (undertrained muscles) | `[shipped]` |
| Exercise swap mid-session | `[shipped]` |
| Post-session recovery tip (Sonnet) | `[shipped]` |
| Session detail view | `[shipped]` |
| Google Drive permanent auth (refresh tokens) | `[shipped]` |
| AI muscle group analysis + map highlights | `[shipped]` |
| YouTube Shorts filter | `[shipped]` |
| VideoSheet: direct to first video, portal fix | `[shipped]` |
| Session: comma key for half-kg entry | `[shipped]` |
| Session: edit/delete logged sets | `[shipped]` |
| SPA redirect fix (production 404) | `[shipped]` |
| v0.9.3 bug fixes | `[tested]` |
| YouTube in-app search + player | `[tested]` |
| Session delete + PR recalc | `[tested]` |

## Feature Backlog
| Feature | Priority | Notes |
|---------|----------|-------|
| Session detail view | Medium | tap history entry → full breakdown |
| Post-session recovery tip | Medium | prompt written, needs UI |
| Session notes + RPE | Medium | — |
| Superset / circuit mode | Medium | — |
| Weekly/monthly volume charts | Medium | — |
| Calendar heatmap | Low | — |

## Technical Debt
- recharts 537KB gzip — acceptable, needs lighter lib to fix
- Timezone-naive week calculation
- No accessibility (aria, keyboard nav)
- Google OAuth in testing mode (publish app in Google Cloud Console to remove warning)
