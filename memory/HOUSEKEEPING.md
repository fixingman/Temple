# 🟁 Temple — Housekeeping

Run before every deploy. Update "Last Run" when done.

## Checklist

**Syntax:** No bare `catch{}` · default export present · no duplicate exercise IDs

**Tokens:** No raw hex outside `tokens.js` · `T.space.*` for all spacing · no `transition: all` · no unused tokens

**Dead code:** No unused functions, variables, or props

**Privacy:**
- Storage: idb-keyval only — no `localStorage`, no `window.storage`
- Fetch: only in `useGoogleDrive.js` (Google APIs) and `sw.js` (cache handler)
- No analytics, tracking pixels, or extra third-party scripts
- Export/import: clipboard or local file only — never a server
- YouTube URLs: static `yt` field only, no user input in URLs

**Performance:** `useCallback` on save · intervals cleaned up on unmount · no heavy computation in render

**Data integrity:** Migration backfills `equipment`/`category` · delete exercise cascades to sets + PRs · export/import validates required fields

**Motion:** No content shift on expand · elements animate in (no instant pop) · no input spinners or tap highlights

**Security:** No `dangerouslySetInnerHTML` · no `eval()` · no `innerHTML` assignment · external links use `rel="noopener noreferrer"`

**Memory files:** All files reflect current code · CHANGELOG has "(Current)" on latest · no completed items in BACKLOG · total memory under 40KB

## Last Run
- **Date**: 2026-04-28
- **Result**: 3 issues fixed — removed duplicate `runDataTests`, updated privacy rules (idb-keyval, fetch policy), updated architecture docs
