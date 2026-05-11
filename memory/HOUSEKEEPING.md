# 🟁 Temple — Housekeeping

Run before every deploy. Update Last Run when done.

## Checklist

**Syntax:** No bare `catch{}` · default export present · no duplicate exercise IDs · SW cache names match app version · no unused imports · no useState after early returns

**Tokens:** No raw hex outside `tokens.js` · `T.space.*` for all spacing · no `transition: all`

**Dead code:** No unused functions, variables, or props

**Privacy:**
- Storage: idb-keyval only — no `localStorage`, `window.storage`
- Fetch: only in `useCoach.js`, `useGoogleDrive.js`, `sw.js`, and VideoSheet (`/api/youtube` Netlify function)
- No analytics or tracking scripts
- Export/import: clipboard or local file only
- User API key: never sent to any Temple server

**Performance:** `useCallback` on async functions · `useMemo` on expensive computations · intervals cleaned up on unmount

**Data integrity:** Migration backfills all missing `settings` keys · delete cascades to sets + PRs

**Security:** `dangerouslySetInnerHTML` only in `renderResult` (HTML stripped) · no `eval()` · external links use `rel="noopener noreferrer"` · security headers in netlify.toml

**Memory files:** All reflect current code · CHANGELOG current · BUGS.md updated · total under 40KB

## Smoke Tests

| # | Scenario | Steps | Expected |
|---|----------|-------|----------|
| S1 | **Weighted set** | Sets → Train → weight + reps → Log Set | Logs · rest timer starts |
| S2 | **Bodyweight exercise** | Add Push-up → Train → enter reps | Weight input hidden |
| S3 | **Mobility exercise** | Add Cat-Cow → Train → enter seconds | Label "Seconds" |
| S4 | **Google Drive backup** | Settings → Connect → Back Up Now | User card shows · success |
| S5 | **Export + import** | Export → Reset → Import | All data restored |
| S6 | **Body Check** | Add API key → Train → "Feeling pain?" → describe | Response renders |
| S7 | **Auto exercise order** | New Set → add 3 exercises → wait 1.2s | List reorders · "✦ AI ordered" |
| S8 | **YouTube sheet** | Library → ▶ Form → tap result | Video plays in-app |
| S9 | **Pull-to-refresh** | Scroll to top → pull down | Logo slides in · releases to reload |
| S10 | **iOS zoom** | Tap any input on iPhone | No zoom |

## Last Run
- **Date**: 2026-05-10
- **Smoke tests**: Not run
- **Code checks**: 2 token violations fixed (B25, B26) · fetch in VideoSheet documented as acceptable (Netlify function)

## Last Run (updated)
- **Date**: 2026-05-11
- **Smoke tests**: Not run
- **Code checks**: B27–B29 fixed · ASSETS_CACHE bumped · recovery.js removed · all pages split · build clean
