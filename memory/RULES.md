# 🟁 Temple — Rules

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
11. **Update "Where We Left Off" below — mandatory**

**Never close with:** stale memory files · failing build · uncommitted changes · Where We Left Off not updated

**Memory drift rule:** Memory files committed in the same push as code.

---

## Where We Left Off
```
Version:     v0.9
Date:        2026-05-10
Shipped:     Logo hidden (pull-to-refresh reveal) · YouTube in-app search/player
             prev/next navigation · iOS zoom fix · Google Drive persistent
             connection · API key saved state (checkmark) · auto AI exercise
             ordering · token fixes B25–B26
Tested:      Not yet — smoke tests S1–S10 needed
Next:        Add YOUTUBE_API_KEY to Netlify env vars · run smoke tests ·
             session detail view · post-session recovery tip
Open issues: Google OAuth still in testing mode
             YouTube API key not yet added to Netlify (S8 will fail without it)
```

---

## File Structure
```
index.html · vite.config.js · package.json · netlify.toml · .gitignore
public/   manifest.json · sw.js · icon.svg · _headers · _redirects
src/      main.jsx · tokens.js · data.js · hooks.js
          useGoogleDrive.js · useCoach.js · App.jsx
netlify/functions/  youtube.js
memory/   RULES.md · PRODUCT.md · ARCHITECTURE.md · DESIGN.md
          CHANGELOG.md · BACKLOG.md · BUGS.md · HOUSEKEEPING.md
```

---

## Versioning
- **Patch** (0.9.1): bug fixes · **Minor** (1.0): features · **Major** (1.0): launch-ready
- Commit format: `"vX.X — one-line summary"`
- SW cache names must always match the version

---

## Standing Code Rules

**Storage:** idb-keyval only. Key: `"temple-data"`. Weights always in kg internally.

**Styling:** Inline styles via `T` tokens. No raw hex outside `tokens.js`. No `transition: all`.

**Privacy:** Fetch only in `useCoach.js` + `useGoogleDrive.js` + `sw.js` + VideoSheet (`/api/youtube`). No analytics. Export/import = local only.

**AI:** All calls via `useCoach`. `MODELS.fast` (Haiku) for structured tasks. `MODELS.smart` (Sonnet) for nuanced judgment. All prompts in `useCoach.js`.

**React:** `useCallback` on async functions. `useMemo` on expensive computations. No useState after early returns. `dangerouslySetInnerHTML` only in `renderResult` (strips HTML first).

**Copy:** No exclamation marks. No forward pressure. No emojis in motivational text.

---

## Deployment
- Build: `npm run build` → `dist/` · Host: Netlify · publish dir: `dist`
- Bundle: app ~94KB gzip · recharts ~154KB gzip (separate chunk)
- Google OAuth Client ID: `186862100308-4lfr928avpodulpf4d70m9jteh1qgm2r.apps.googleusercontent.com`
- Authorized origins: `https://tmple.netlify.app` · `http://localhost:5173`
- **Netlify env vars needed:** `YOUTUBE_API_KEY` (YouTube Data API v3)
