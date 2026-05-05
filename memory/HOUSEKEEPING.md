# 🟁 Temple — Housekeeping

Run before every deploy. Update Last Run when done.

## Checklist

**Syntax:** No bare `catch{}` · default export present · no duplicate exercise IDs · SW cache names match app version · no unused imports

**Tokens:** No raw hex outside `tokens.js` · `T.space.*` for all spacing · no `transition: all` · no unused tokens

**Dead code:** No unused functions, variables, or props

**Privacy:**
- Storage: idb-keyval only — no `localStorage`, `window.storage`
- Fetch: only in `useCoach.js`, `useGoogleDrive.js`, `sw.js`
- No analytics or tracking scripts
- Export/import: clipboard or local file only
- User API key: never sent to any Temple server

**Performance:** `useCallback` on async functions · `useMemo` on expensive list computations · intervals cleaned up on unmount · no useState after early returns

**Data integrity:** Migration backfills all missing `settings` keys · delete cascades to sets + PRs · export/import validates required fields

**Motion:** No content shift on expand · elements animate in · no input spinners or tap highlights

**Security:** `dangerouslySetInnerHTML` only in `renderResult` (HTML stripped before use) · no `eval()` · external links use `rel="noopener noreferrer"` · security headers in netlify.toml

**Memory files:** All reflect current code · CHANGELOG current · BUGS.md updated · total memory under 40KB

## Smoke Tests

Run on live site after every deploy. Mark pass/fail in Last Run.

| # | Scenario | Steps | Expected |
|---|----------|-------|----------|
| S1 | **Weighted set** | Sets → Train → weight + reps → Log Set | Logs · rest timer starts |
| S2 | **Bodyweight exercise** | Add Push-up → Train → enter reps | Weight input hidden · logs correctly |
| S3 | **Mobility exercise** | Add Cat-Cow → Train → enter seconds | Weight hidden · label "Seconds" |
| S4 | **Google Drive backup** | Settings → Connect → Back Up Now | User card shows · success message |
| S5 | **Export + import** | Export → Reset → Import | All data restored |
| S6 | **Body Check** | Add API key → Train → "Feeling pain?" → describe | Response with bold sections |
| S7 | **Exercise order** | New Set → 3+ exercises → ✦ Suggest order | List reorders · no crash |
| S8 | **YouTube sheet** | Library → ▶ Form | Sheet slides up · closes on backdrop tap |

## Last Run
- **Date**: 2026-05-05
- **Smoke tests**: Not run — user testing today
- **Code checks**: All clean — 4 new bugs found and fixed (B21–B24)
