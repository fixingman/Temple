# 🟁 Temple — Housekeeping

Run before every deploy. Update Last Run when done.

## Before every commit
- [ ] `npm run build` — zero errors (auto-syncs sw.js version via `scripts/sync-version.mjs`)
- [ ] `npm run test:smoke` — Playwright boot test passes (catches render/boot crashes the build misses)
- [ ] No debug `console.log` left in · no hardcoded test values
- [ ] `APP_VERSION` in `src/tokens.js` matches CHANGELOG top entry

## Per-version checklist (every version ship, not just session end)
1. Bump `APP_VERSION` in `src/tokens.js` (sw.js cache names auto-sync on build)
2. Add entry to `memory/CHANGELOG.md`
3. Update affected memory docs — ask: "Does this change documented behavior?"
4. `npm run build` + `npm run test:smoke` before committing
5. Update RULES.md "Where We Left Off"

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

**Automated (`npm run test:smoke`):** Playwright runs both the tab-render smoke test (`tests/smoke.spec.js`) and workout regression (`tests/workout.spec.js`) against the built app. The workout test creates a workout through the UI, logs two weighted sets (including a fractional weight) and one bodyweight set, finishes it, and checks exact history values plus a single session before and after reload. It uses real IndexedDB in an isolated browser context and blocks external services and service workers. Both tests fail on uncaught runtime errors. Run `npm run build` first so tests cover current code; run before every commit touching `src/` or `tests/`.

**Manual (device, the table below):** automated coverage now logs sets and verifies persistence, but does not exercise real-device behavior (iOS zoom, lock/wake, Drive auth, YouTube) or service-worker updates/offline behavior. Run these by hand before a release.

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
- **Date**: 2026-09-22 — workout regression coverage
- **Build**: clean; sw.js already at temple-v1.4 (no application changes)
- **Automated tests**: `npm run test:smoke` — 2 passed (11.1s), including full workout → exact history → reload persistence; no runtime errors
- **Environment**: installed the Chromium browser required by the existing Playwright dependency
- **Manual device tests**: Still pending; browser automation does not mark v1.2–v1.4 device-tested

## Previous Run
- **Date**: 2026-05-10
- **Smoke tests**: Not run
- **Code checks**: 2 token violations fixed (B25, B26) · fetch in VideoSheet documented as acceptable (Netlify function)

## Last Run (updated)
- **Date**: 2026-05-11
- **Smoke tests**: Not run
- **Code checks**: B27–B29 fixed · ASSETS_CACHE bumped · recovery.js removed · all pages split · build clean

## Last Run (2026-07-14 — v1.4 dark/light mode)
- **Automated smoke test**: ✅ passing · **Build**: clean, sw.js synced to temple-v1.4
- **Theme verification (headless)**: ✅ Auto follows OS both ways · manual override flips instantly + persists across reload · theme-color meta collapses to one and syncs · light-mode Settings/Library visually checked via screenshots
- **Token check**: no raw hex outside tokens.js/PALETTES (MuscleMap literals tokenized this session)
- **Manual device smoke tests (S1–S10 + theme toggle)**: Still not run — v1.2–v1.4 need a device pass

## Last Run (2026-06-16 — standards adoption)
- **Automated smoke test**: ✅ passing (Playwright boot test added — visits all 5 tabs, asserts no page errors; verified it fails on an injected render crash)
- **Build**: clean · prebuild version-sync confirmed
- **Changes**: single `APP_VERSION` source · WAAPI `<Pulse>` replaces CSS infinite pulse · `prefers-reduced-motion` gating · tab `aria-label`s · Performance-audit.md added
- **Manual device smoke tests (S1–S10)**: Still not run — needs a real device pass for v1.2/v1.3 features
