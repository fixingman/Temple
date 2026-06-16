# 🟁 Temple — Bug Tracker

Status: `[open]` · `[fixed]` · `[unverified]` (fix shipped, not yet confirmed on device)
Severity: `[crit]` crash · `[high]` broken feature · `[med]` degraded UX · `[low]` cosmetic

**Open / unverified entry format** (full detail; the compact `Fixed (vX.X)` tables below are history, leave them as-is):
```
### BUG-NNN [sev] — one-line title
- **Symptom:** what the user sees
- **Root cause:** what actually causes it
- **Fix:** version + what changed
- **Verify:** exact reproduction + expected result
- **Verified fixed:** ☐
```
Numbering is sequential, never reused.

---

## Open
*None currently known.*

## Unverified (fix shipped, awaiting device confirmation)
All v1.2/v1.3 fixes are shipped but untested on a real device (RULES.md "Where We Left Off"). When verifying, record each as the format above and tick **Verified fixed: ☑** once confirmed.

---

## Fixed (v0.9.3)
| # | Sev | Description | Fixed |
|---|-----|-------------|-------|
| B35 | `[crit]` | `liveCalories` TDZ — crash on workout completion screen | v0.9.3 |
| B34 | `[crit]` | `fmtDate` missing import in SessionPage — crash on Train tab | v0.9.3 |
| B33 | `[crit]` | `MUSCLE_ICONS` missing import in ProgressPage — crash on Progress tab | v0.9.3 |
| B32 | `[crit]` | JSX syntax error `{false && (<div>)}` — Netlify build failure | v0.9.3 |
| B31 | `[high]` | Google Drive popup blocked on load (silent reconnect) | v0.9.3 |
| B30 | `[high]` | Google Drive buttons unclickable — token missing but UI showed connected | v0.9.3 |

## Fixed (v0.9.2)
| # | Sev | Description | Fixed |
|---|-----|-------------|-------|
| B29 | `[low]` | `recovery.js` dead Netlify function still deployed | v0.9.2 |
| B28 | `[low]` | Raw `padding: "8px 0"` in PR chart table | v0.9.2 |
| B27 | `[high]` | `ASSETS_CACHE` stuck at `temple-assets-v0.7.1` — old files never evicted | v0.9.2 |
| B26 | `[low]` | `#fff` on play button icon in YouTube results | v0.9 |
| B25 | `[low]` | `#000` raw hex in YouTube video player background | v0.9 |
| B24 | `[low]` | MuscleBar unit prop destructure causing silent wrong display | v0.8.2 |
| B23 | `[low]` | DEFAULT_EXERCISES unused import | v0.8.2 |
| B22 | `[med]` | Bodyweight logged sets showed "0kg × N reps" | v0.8.2 |
| B21 | `[crit]` | showRecoveryMid useState after early returns — hooks violation | v0.8.2 |
| B20 | `[low]` | SW cache name mismatch v0.7 vs v0.7.1 | v0.7.1 |
| B19 | `[low]` | Edit/delete 4px tap target in library | v0.8 |
| B18 | `[low]` | BW/MOB tags at 9px — unreadable | v0.8 |
| B17 | `[low]` | #000 raw hex in VideoSheet background | v0.8.2 |
| B16 | `[low]` | Rest timer nudge no minimum — could go negative | v0.8.2 |
| B15 | `[med]` | manifest.json referenced non-existent PNG icons | v0.6 |
| B14 | `[med]` | renderResult injected raw HTML — XSS risk | v0.8.1 |
| B13 | `[med]` | ConfirmDialog "No"/"Yes" ambiguous labels | v0.8 |
| B12 | `[med]` | Set builder layout shifted on exercise select | v0.8 |
| B11 | `[med]` | VideoSheet drag handle wrong position | v0.8.2 |
| B10 | `[med]` | ApiKeyInput draft didn't sync on external change | v0.8.2 |
| B09 | `[med]` | Settings migration didn't backfill missing keys | v0.8.1 |
| B08 | `[med]` | fmt() shadowed in SessionPage | v0.8.1 |
| B07 | `[high]` | Body Check "Go to Settings" didn't navigate | v0.8.2 |
| B06 | `[high]` | Start button not disabled with all exercises deleted | v0.8.2 |
| B05 | `[high]` | SW cache-first for index.html — PWA black screen | v0.7.1 |
| B04 | `[high]` | SW cache stuck at temple-v0.5 — deploys black screen | v0.7.1 |
| B03 | `[high]` | Bodyweight exercises blocked logging | v0.8 |
| B02 | `[crit]` | useState called conditionally in completion screen | v0.8.1 |
| B01 | `[crit]` | MAX_TOKENS undefined — all AI calls crashed | v0.8.1 |
