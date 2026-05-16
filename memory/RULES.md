# 🟁 Temple — Rules

---

## Where We Left Off
```
Version:     v1.1.1
Date:        2026-05-16
Shipped:     Athletic UI overhaul (v1.1) — Phosphor icons, Framer Motion, Tone.js sound ·
             UI polish — exercise 3-dots menu, token audit & fix ·
             Google Drive silent reconnect — no manual re-auth each session
Tested:      Build passes (confirm after this session)
Next:        Test Google Drive silent reconnect on real device ·
             Test YouTube on production ·
             Test AI features (Anthropic key in Settings) ·
             Session detail view · post-session recovery tip
Open issues: Google OAuth still in testing mode (OAuth consent screen)
             YouTube may 503 on dev previews if YOUTUBE_API_KEY not set for all contexts
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

### Tier 2 — Read when task requires
| Task | Read |
|------|------|
| Data model / storage | `ARCHITECTURE.md` |
| UI components / layout | `DESIGN.md` |
| Product goals / user flow | `PRODUCT.md` |
| Routine checks | `HOUSEKEEPING.md` |

---

## Start of Session
1. Read RULES.md (this file)
2. Read CHANGELOG.md + BACKLOG.md + BUGS.md
3. `git clone https://github.com/fixingman/Temple.git`
4. Check version in App.jsx About card + SW cache names both match CHANGELOG
5. Tell user: "On v[X]. Last: [summary]. Next: [top backlog item]. Open issues: [none/list]."

## End of Session
1. Bump version in App.jsx About card
2. Bump SW cache names in `public/sw.js` (`temple-vX.X`)
3. CHANGELOG.md → new version at top, list everything shipped
4. BACKLOG.md → remove completed, add discovered, update tags
5. BUGS.md → move fixed to Fixed table, add newly discovered
6. ARCHITECTURE.md → update if structure/data model/files changed
7. Housekeeping checks (HOUSEKEEPING.md) — run all, update Last Run
8. `npm run build` — must pass zero errors
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

| Layer | Z-Index | Element |
|-------|---------|---------|
| Base | 1 | Normal content |
| Sticky header | 10 | App header bar |
| Sheet/drawer | 100 | Bottom sheets, side panels |
| Modal | 200 | Confirmation dialogs |
| Toast/notification | 300 | Error dot, toasts |
| Full-screen overlay | 500 | Video sheet, full-screen modals |
| Top-level | 999 | Any intentional top-of-stack element |

---

## File Structure
```
index.html · vite.config.js · package.json · netlify.toml · .gitignore
public/   manifest.json · sw.js · icon.svg · _headers · _redirects
src/      main.jsx · tokens.js · data.js · hooks.js
          useGoogleDrive.js · useCoach.js
          App.jsx · components.jsx
          pages/  LibraryPage.jsx · SetsPage.jsx · SessionPage.jsx
                  ProgressPage.jsx · SettingsPage.jsx
netlify/functions/  coach.js · youtube.js
memory/   RULES.md · PRODUCT.md · ARCHITECTURE.md · DESIGN.md
          CHANGELOG.md · BACKLOG.md · BUGS.md · HOUSEKEEPING.md
```

---

## Versioning

**Auto-bump logic — run at the start of every end-of-session routine:**

```
Read current version from App.jsx About card.
Count what shipped this session:

  Any crash / data loss fix          → PATCH bump (e.g. 0.9 → 0.9.1)
  Any bug fix or minor UX improvement → PATCH bump
  Any new user-facing feature         → MINOR bump (e.g. 0.9.1 → 1.0)
  Major architectural rewrite         → MAJOR bump (e.g. 0.9 → 1.0)

If BOTH bugs AND features shipped → use the highest applicable bump.
If only memory/docs changed with no code change → no bump, add .md suffix note only.

Apply the bump to:
  1. App.jsx About card  →  🟁 Temple vX.X
  2. public/sw.js        →  temple-vX.X  (both CACHE and ASSETS_CACHE)

Commit format: "vX.X — one-line summary of what shipped"
```

**Current series:** `0.9.x` — patch fixes · `1.0` — first feature-complete minor

---

## Standing Code Rules

**Storage:** idb-keyval only. Key: `"temple-data"`. Weights always in kg internally.

**Styling:** Inline styles via `T` tokens. No raw hex outside `tokens.js`. No `transition: all`.

**Privacy:** Fetch only in `useCoach.js` + `useGoogleDrive.js` + `sw.js` + VideoSheet (`/api/youtube`). No analytics. Export/import = local only.

**AI:** All calls via `useCoach`. `MODELS.fast` (Haiku) for structured tasks. `MODELS.smart` (Sonnet) for nuanced judgment. All prompts in `useCoach.js`.

**React:** `useCallback` on async functions. `useMemo` on expensive computations. No useState after early returns. `dangerouslySetInnerHTML` only in `renderResult` (strips HTML first).

**Copy:** No exclamation marks. No forward pressure. No emojis in UI text (motivational or system).

---

## Deployment
- Build: `npm run build` → `dist/` · Host: Netlify · publish dir: `dist`
- Bundle: app ~94KB gzip · recharts ~154KB gzip (separate chunk)
- Google OAuth Client ID: `186862100308-4lfr928avpodulpf4d70m9jteh1qgm2r.apps.googleusercontent.com`
- Authorized origins: `https://tmple.netlify.app` · `http://localhost:5173`
- **Netlify env vars needed:** `YOUTUBE_API_KEY` (YouTube Data API v3)
