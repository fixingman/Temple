# 🟁 Temple — Backlog

Status tags: `[shipped]` = deployed untested · `[tested]` = verified on device · `[wip]` = in progress

## Up Next
1. **Add YOUTUBE_API_KEY to Netlify** — console.cloud.google.com → same project as Drive → enable YouTube Data API v3 → create API key → Netlify env vars
2. **Test AI features** — add Anthropic key in Settings → create a set with 3+ exercises → verify AI ordering works + ✦ AI ordered appears
3. **Session detail view** — tap history entry → full breakdown
4. **Post-session recovery tip** — auto-surface using prompts.recoveryTip (Haiku)
5. **Custom rest timer** — configurable in Settings

## Recently Shipped
| Feature | Status |
|---------|--------|
| Code split into page files | `[shipped]` |
| Style helpers (S object) | `[shipped]` |
| Performance: customTooltip, est1RM, getLastSessionData | `[shipped]` |
| Error monitor dot | `[shipped]` |
| Session delete + PR recalc | `[shipped]` |
| Sets ··· menu | `[shipped]` |
| Search clear ✕ | `[shipped]` |
| AI CORS fix (coach.js proxy) | `[shipped]` |
| YouTube in-app search + player | `[shipped]` |
| SW black screen fix | `[tested]` |

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
