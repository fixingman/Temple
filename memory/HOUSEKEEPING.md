# 🟁 Temple — Housekeeping

Run before every deploy. Update Last Run when done.

## Checklist

**Syntax:** No bare `catch{}` · default export present · no duplicate exercise IDs · SW cache names match app version

**Tokens:** No raw hex outside `tokens.js` · `T.space.*` for all spacing · no `transition: all` · no unused tokens

**Dead code:** No unused functions, variables, or props

**Privacy:**
- Storage: idb-keyval only — no `localStorage`, `window.storage`
- Fetch: only in `useCoach.js`, `useGoogleDrive.js`, `sw.js`
- No analytics, tracking pixels, or extra third-party scripts
- Export/import: clipboard or local file only
- User API key: never sent to any Temple server, stored in idb-keyval only

**Performance:** `useCallback` on async functions · `useMemo` on expensive list computations · intervals cleaned up on unmount

**Data integrity:** Migration backfills all missing `settings` keys · delete cascades to sets + PRs · export/import validates required fields

**Motion:** No content shift on expand · elements animate in · no input spinners or tap highlights

**Security:** No bare `dangerouslySetInnerHTML` (only `renderResult` with sanitisation) · no `eval()` · no `innerHTML` · external links use `rel="noopener noreferrer"` · security headers in netlify.toml

**Memory files:** All reflect current code · CHANGELOG has "(Current)" on latest · no completed items in BACKLOG · total memory under 40KB

## Smoke Tests

Run on live site after every deploy. Mark pass/fail in Last Run.

| # | Scenario | Steps | Expected |
|---|----------|-------|----------|
| S1 | **Log a weighted set** | Sets → pick set → Train → weight + reps → Log Set | Logs correctly · rest timer starts |
| S2 | **Log a bodyweight exercise** | Add Push-up to set → Train → enter reps (no weight field shown) → Log Set | Weight input hidden · logs · PR detected if applicable |
| S3 | **Log a mobility exercise** | Add Cat-Cow → Train → enter seconds → Log Set | Weight hidden · label says "Seconds" |
| S4 | **Google Drive backup** | Settings → Connect Google Drive → Back Up Now | User card shows · success message · no console errors |
| S5 | **Export + import round-trip** | Export → Reset All → Import | All data restored correctly |
| S6 | **Body Check** | Settings → add API key → Train → "Feeling pain?" → select area → describe → Get Guidance | Response renders with bold sections |
| S7 | **Exercise order suggestion** | New Set → select 3+ exercises → "✦ Suggest order" | List reorders · no crash |
| S8 | **YouTube sheet** | Library → ▶ Form button | Sheet slides up · embed loads · closes on backdrop tap |

## Last Run
- **Date**: 2026-05-05
- **Smoke tests**: Not run — user testing today
- **Code checks**: All clean
  - Token violations: 0
  - Fetch policy: clean (useCoach + useGoogleDrive + sw.js only)
  - Dead code: 0
  - Security: dangerouslySetInnerHTML sanitised · security headers added
  - Performance: useMemo on ProgressPage · useCallback on consult() · recharts split
