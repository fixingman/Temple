# 🟁 Temple — Bug Tracker

Status tags: `[open]` · `[in progress]` · `[fixed]` · `[wontfix]`
Severity: `[crit]` crash or data loss · `[high]` broken feature · `[med]` degraded UX · `[low]` cosmetic

Add new bugs at the top. Move to Fixed when done — don't delete, keeps history.

---

## Open

*None currently known. User testing in progress — add findings here.*

---

## Fixed (this version)

| # | Severity | Description | Fixed in |
|---|----------|-------------|----------|
| B21 | `[crit]` | `showRecoveryMid` useState declared after early returns in SessionPage — React hooks violation | v0.8.2 |
| B22 | `[med]` | Logged sets in session showed `0kg × N reps` for bodyweight exercises instead of just reps | v0.8.2 |
| B23 | `[low]` | `DEFAULT_EXERCISES` imported but never used in App.jsx — dead import | v0.8.2 |
| B24 | `[low]` | `MuscleBar` prop `unit: wl` renamed wl locally, causing displayWeight to receive string not unit value — silent wrong calculation | v0.8.2 |

---

## Fixed (this version)

| # | Severity | Description | Fixed in |
|---|----------|-------------|----------|
| B01 | `[crit]` | `MAX_TOKENS` undefined in useCoach — crashed every AI call | v0.8.1 |
| B02 | `[crit]` | `useState` called conditionally in completion screen — React hooks violation | v0.8.1 |
| B03 | `[high]` | Bodyweight/mobility exercises showed weight input and blocked logging with weight=0 | v0.8 |
| B04 | `[high]` | SW cache stuck at `temple-v0.5` — new deploys caused black screen (stale JS bundle) | v0.7.1 |
| B05 | `[high]` | SW cache-first for index.html — PWA showed black screen, force refresh required | v0.7.1 |
| B06 | `[high]` | Start button didn't disable when all exercises in a set were deleted from library | v0.8.2 |
| B07 | `[high]` | Body Check "Go to Settings" button only closed sheet, didn't navigate | v0.8.2 |
| B08 | `[med]` | `fmt()` shadowed inside SessionPage — inconsistent timer format | v0.8.1 |
| B09 | `[med]` | Settings migration didn't backfill missing keys — existing users missed `anthropicKey` | v0.8.1 |
| B10 | `[med]` | `ApiKeyInput` draft state didn't sync on external change (import/restore) | v0.8.2 |
| B11 | `[med]` | VideoSheet drag handle: `position:absolute` on non-relative parent — rendered wrong | v0.8.2 |
| B12 | `[med]` | Set builder layout shifted on exercise select — search input jumped down the page | v0.8 |
| B13 | `[med]` | ConfirmDialog used "No"/"Yes" labels — ambiguous for destructive actions | v0.8 |
| B14 | `[med]` | `renderResult` injected Claude response as raw HTML — XSS risk | v0.8.1 |
| B15 | `[low]` | manifest.json referenced non-existent icon-192.png and icon-512.png — 404 errors | v0.6 |
| B16 | `[low]` | Rest timer nudge buttons had no minimum — could go negative | v0.8.2 |
| B17 | `[low]` | `#000` raw hex in VideoSheet embed background — token violation | v0.8.2 |
| B18 | `[low]` | BW/MOB tags in library at 9px — unreadable on device | v0.8 |
| B19 | `[low]` | Edit/delete buttons in library had 4px tap target — untappable on mobile | v0.8 |
| B20 | `[low]` | SW cache name version mismatch (v0.7 not v0.7.1) | v0.7.1 |
