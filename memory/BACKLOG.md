# Temple — Backlog

Status tags: `[shipped]` = deployed untested · `[tested]` = verified on device · `[wip]` = in progress

## Up Next
— nothing queued, pick from Feature Backlog below —

## Recently Shipped
| Feature | Status |
|---------|--------|
| Dark/light mode + Auto (follow OS) | `[shipped]` |
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
| Session notes + RPE | Medium | — |
| Superset / circuit mode | Medium | — |
| Weekly/monthly volume charts | Medium | — |
| Calendar heatmap | Low | — |

## Watch Decisions
Choices that need a future check-in — don't relitigate before the trigger.
| Decision | Trigger | Check |
|----------|---------|-------|
| AI recovery tip — Wallpaper Test | Day 14 of real use (~2026-06-30) | Does it say something fresh each session, or repeat? If predictable → cut or rework. |
| AI gap analysis — Wallpaper Test | Day 14 | Same: undertrained-muscle output must change as training changes. |
| AI muscle map — Wallpaper Test | Day 14 | Highlights must reflect recent sessions, not a static-feeling diagram. |

## Not Implementing
Explicit rejections — kept so they aren't re-proposed.
| Idea | Why not |
|------|---------|
| Conventional-commit prefixes (`feat:`/`fix:`) | Existing `Subject — detail` em-dash style is consistent across history; churn with no gain. |
| Split ARCHITECTURE.md into Data.md / Sync.md | Single doc already covers schema + Drive merge; fragmenting hurts the Tier-2 read model. |
| Two-audience changelog (user + dev) | No in-app changelog surface exists to maintain a second voice for. Revisit if one is added. |

## Technical Debt
- recharts 537KB gzip — acceptable, needs lighter lib to fix
- Timezone-naive week calculation
- Accessibility: tab `aria-label`s + reduced-motion now in place; still no keyboard nav / focus management
- Google OAuth in testing mode (publish app in Google Cloud Console to remove warning)
