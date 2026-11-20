# 🟁 Temple — Rules

---

## Where We Left Off
```
Version:     v1.7
Date:        2026-11-20
Release:     v1.7 pushed to dev/main — History calories, Netlify badge blocked via CSP,
             docs refresh. (v1.6: iPhone workouts pass duration to a Shortcuts Log Workout action)
Tested:      Build clean · automated test results in HOUSEKEEPING.md ·
             Apple Health write and installed-PWA deep link pending iPhone test
             Both themes verified headless previously (2026-07-14) ·
             NOT yet tested on real device (v1.2–v1.4 all pending device pass)
Next:        Manual device pass of v1.2–v1.7 (S1–S10 + theme + muscle period + Health) ·
             Day-14 Wallpaper Test on AI surfaces (overdue — was ~2026-06-30) ·
             Session notes + RPE · Superset/circuit mode
Open issues: Google OAuth still in testing mode (OAuth consent screen)
             YouTube may 503 on dev previews if YOUTUBE_API_KEY not set for all contexts
             Documented Netlify URL still served v1.1.1 after v1.6 push; deploy pending
             Netlify badge block unconfirmed on the live site until a deploy succeeds
             Memory docs ~60KB vs 40KB budget (HOUSEKEEPING.md)
```

---

## File Guide

### Tier 1 — Always read at session start
| File | Purpose |
|------|---------|
| `RULES.md` | Critical constraints (this file) |
| `CHANGELOG.md` | Recent changes |
| `BACKLOG.md` | Pending work |
| `BUGS.md` | Known bugs & status |
| `design/ProductThinking.md` | North star, what not to build, core principles, decision log |

### Tier 2 — Read when task requires
| Task | Read |
|------|------|
| Data model / storage | `ARCHITECTURE.md` |
| UI components / layout | `DESIGN.md` |
| Product goals / user flow | `PRODUCT.md` |
| Routine checks | `HOUSEKEEPING.md` |
| Perf / security baseline | `Performance-audit.md` |
| Icon / identity work | `BRANDING.md` |

---

## Start of Session
1. Read RULES.md (this file)
2. Read CHANGELOG.md + BACKLOG.md + BUGS.md
3. `git clone https://github.com/fixingman/Temple.git`
4. Check `APP_VERSION` in `src/tokens.js` matches CHANGELOG top entry (sw.js auto-syncs from it)
5. Tell user: "On v[X]. Last: [summary]. Next: [top backlog item]. Open issues: [none/list]."

## End of Session
1. Bump `APP_VERSION` in `src/tokens.js` (single source — SettingsPage About card + sw.js cache names both derive from it)
2. `npm run build` auto-runs `scripts/sync-version.mjs` → rewrites sw.js cache names to match
3. CHANGELOG.md → new version at top, list everything shipped
4. BACKLOG.md → remove completed, add discovered, update tags
5. BUGS.md → move fixed to Fixed table, add newly discovered
6. ARCHITECTURE.md → update if structure/data model/files changed
7. Housekeeping checks (HOUSEKEEPING.md) — run all, update Last Run
8. `npm run build` — zero errors — **and** `npm run test:smoke` — must pass
9. Commit: `"vX.X — one-line summary"`
10. Push → confirm Netlify deploy → run smoke tests → update results
11. **Update "Where We Left Off" above — mandatory**
12. **Memory review:** ask "Does anything shipped this session affect documented behavior?" Update relevant memory files in the same commit as the code.

**Never close with:** stale memory files · failing build · uncommitted changes · Where We Left Off not updated

---

## Non-Delegation Zones

These areas are error-prone — always read the relevant file and double-check logic before touching them:

| Zone | Why | Reference |
|------|-----|-----------|
| idb-keyval read/write | Single source of truth — corrupt write = data loss | `ARCHITECTURE.md` |
| Google Drive sync merge | Merge must be additive, not overwrite | `ARCHITECTURE.md` |
| Weight unit conversion | All weights stored in kg internally; display converts | `ARCHITECTURE.md` |
| AI call routing | `useCoach` is the only fetch boundary — must not bypass | `ARCHITECTURE.md` |
| `useCoach.js` prompts | Prompt changes affect all AI features silently | `ARCHITECTURE.md` |
| SW cache version | Must match app version or users get stale builds | Versioning section |
| Sound calls | All sound calls go through `useSound` hook — never import Tone.js directly in pages | `src/useSound.js` |

---

## Z-Index Stack

Source of truth: `T.z` in `tokens.js`. Never hardcode a `zIndex` number in a component.

| Layer | Token | Value |
|-------|-------|-------|
| Base | — | 1 |
| Sticky header | `T.z.header` | 50 |
| Tab bar | `T.z.tabBar` | 100 |
| Modal / confirm dialog | `T.z.modal` | 200 |
| Sheets (video, app sheets) | `T.z.modal + 10` / `+ 20` | 210 / 220 |
| Toast / error dot | `T.z.toast` | 300 |

---

## File Structure
```
index.html · vite.config.js · package.json · netlify.toml · .gitignore
              playwright.config.js
public/   manifest.json · sw.js · icon.svg · _headers · _redirects
src/      main.jsx · tokens.js (APP_VERSION, PALETTES) · data.js · hooks.js
          useGoogleDrive.js · useCoach.js · useSound.js · appleHealth.js
          App.jsx · components.jsx (Pulse) · icons.jsx · MuscleMap.jsx
          pages/  LibraryPage.jsx · SetsPage.jsx · SessionPage.jsx
                  ProgressPage.jsx · SettingsPage.jsx
scripts/  sync-version.mjs · netlify-headers.mjs
tests/    smoke.spec.js · workout.spec.js · muscles.spec.js · netlify-headers.spec.js
netlify/functions/  coach.js · youtube.js · google-token.js
memory/   RULES.md · PRODUCT.md · ARCHITECTURE.md · DESIGN.md
          CHANGELOG.md · BACKLOG.md · BUGS.md · HOUSEKEEPING.md
          BRANDING.md · Performance-audit.md
design/   ProductThinking.md
```

---

## Versioning

**Auto-bump logic — run at the start of every end-of-session routine:**

```
Read current version from APP_VERSION in src/tokens.js.
Count what shipped this session:

  Any crash / data loss fix          → PATCH bump (e.g. 1.6 → 1.6.1)
  Any bug fix or minor UX improvement → PATCH bump
  Any new user-facing feature         → MINOR bump (e.g. 1.6 → 1.7)
  Major architectural rewrite         → MAJOR bump (e.g. 1.6 → 2.0)

If BOTH bugs AND features shipped → use the highest applicable bump.
If only memory/docs changed with no code change → no bump; note it in CHANGELOG as a dated entry (no version change).

Apply the bump to:
  1. APP_VERSION in src/tokens.js  (the only hand-edited place)
  2. package.json "version"        (keep in step, e.g. "1.6.0")
  3. public/sw.js                  (auto: scripts/sync-version.mjs rewrites it on build)

Commit format: "vX.X — one-line summary of what shipped"
```

**Single source of truth:** `APP_VERSION` in `src/tokens.js`. SettingsPage About card imports it; `public/sw.js` cache names are rewritten to match by `scripts/sync-version.mjs` on `prebuild`. Never hardcode the version anywhere else.

**Current series:** `1.x` — features bump MINOR, fixes bump PATCH.

---

## Standing Code Rules

**Storage:** idb-keyval only. Key: `"temple-data"`. Weights always in kg internally. New `settings` keys need a default in `DEFAULT_SETTINGS` (`data.js`) so the load-time backfill covers existing users.

**Styling:** Inline styles via `T` tokens. No raw hex outside `tokens.js`. No `transition: all`.

**Theming:** Literal colors live only in `PALETTES` (`tokens.js`); `T.color` values are `var(--c-*)` references resolved by GlobalStyles per `:root[data-theme]`. New colors must be added to *both* palettes. Theme applied by `useTheme` (`hooks.js`) — never set `data-theme` elsewhere.

**Privacy:** Fetch only in `useCoach.js` + `useGoogleDrive.js` (incl. `/api/google-token`) + `sw.js` + VideoSheet (`/api/youtube`). No analytics. Export/import = local only.

**AI:** All calls via `useCoach`. `MODELS.fast` (Haiku) for structured tasks. `MODELS.smart` (Sonnet) for nuanced judgment. All prompts in `useCoach.js`.

**React:** `useCallback` on async functions. `useMemo` on expensive computations. No useState after early returns. `dangerouslySetInnerHTML` only in `renderResult` (strips HTML first).

**Motion:** Looping animations (`iterations: Infinity`) → WAAPI via the `<Pulse>` component, never CSS `infinite` (CSS loops flash on display toggle). One-shots → CSS is fine. App root wraps `<MotionConfig reducedMotion="user">`; `<Pulse>` honours reduced motion. See DESIGN.md → Motion System.

**Scripts:** Netlify's injected badge is blocked by a build-generated CSP (`scripts/netlify-headers.mjs` → `dist/_headers`) that allows `<script>` elements only from the deployment's `/assets/` and `EXTERNAL_SCRIPTS` in that file. Any new external script (or inline `<script>` in `index.html`) must be added there, or it is blocked in production. Local `vite preview` does not apply the policy, so check a Netlify deploy preview.

**Copy:** No exclamation marks. No forward pressure. No emojis in UI text (motivational or system).

---

## Deployment
- Build: `npm run build` → `dist/` · Host: Netlify · publish dir: `dist`
- Bundle (gzip, v1.6): app ~81KB · vendor ~135KB · recharts/ProgressPage ~114KB (lazy chunk)
- Google OAuth Client ID: `186862100308-4lfr928avpodulpf4d70m9jteh1qgm2r.apps.googleusercontent.com`
- Authorized origins: `https://tmple.netlify.app` · `http://localhost:5173`
- **Netlify env vars needed:** `YOUTUBE_API_KEY` (YouTube Data API v3) · `GOOGLE_CLIENT_SECRET` (`google-token.js`; Drive refresh tokens)
