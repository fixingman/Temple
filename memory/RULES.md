# 🟁 Temple — Rules

## Start of Session
1. Read RULES.md (this file)
2. Read CHANGELOG.md + BACKLOG.md
3. `git clone https://github.com/fixingman/Temple.git`
4. Check version string in App.jsx About card matches CHANGELOG
5. Tell user: "On v[X]. Last: [summary]. Next: [top backlog item]. Open issues: [none/list]."

## End of Session
1. Bump version in App.jsx About card + PRODUCT.md header
2. CHANGELOG.md → new version at top, list everything shipped + tested status
3. BACKLOG.md → remove completed, add discovered, update tags
4. ARCHITECTURE.md → update if structure/data model changed
5. Housekeeping checks (HOUSEKEEPING.md) — run all, update Last Run
6. `npm run build` — must pass zero errors
7. Commit: `"v0.X — one-line summary"`
8. Push → confirm Netlify deploy → run smoke tests → update results
9. **Update "Where We Left Off" below — mandatory**

**Never close with:** stale memory files · failing build · uncommitted changes · Where We Left Off not updated

**Memory drift rule:** If any memory file is touched during a session, it must be committed in the same push as the code. Memory files are code.

---

## Where We Left Off
```
Version:     v0.7
Date:        2026-04-29
Shipped:     New icon (pyramid + T negative space) · Google Drive UI fix · lean memory system · RULES.md
Tested:      Not yet — needs real device smoke test
Next:        Test with real data (5+ sessions) · session detail view · custom rest timer
Open issues: Google OAuth still in testing mode (add users manually in Cloud Console)
             Smoke tests not yet run on live site
```

---

## File Structure
```
index.html · vite.config.js · package.json · netlify.toml · .gitignore
public/   manifest.json · sw.js · icon.svg · _headers · _redirects
src/      main.jsx · tokens.js · data.js · hooks.js · useGoogleDrive.js · App.jsx
memory/   RULES.md · PRODUCT.md · ARCHITECTURE.md · DESIGN.md · CHANGELOG.md · BACKLOG.md · HOUSEKEEPING.md
```

---

## Versioning
- **Patch** (0.7.1): bug fixes · **Minor** (0.8): features · **Major** (1.0): rewrites
- Commit format: `"v0.X — one-line summary"`

---

## Standing Code Rules

**Storage:** idb-keyval only. Key: `"temple-data"`. Weights always in kg internally.

**Styling:** Inline styles via `T` tokens. `T.space.*` for spacing. `T.color.*`/`C.*` for color. No raw hex outside `tokens.js`. No `transition: all`.

**Privacy:** Fetch only in `useGoogleDrive.js` + `sw.js`. No analytics. Export/import = clipboard or local file only.

**React:** `useCallback` on save. Clean up intervals in useEffect return. No `dangerouslySetInnerHTML`, `eval()`, `innerHTML`.

**Copy:** No exclamation marks in encouragement. No forward pressure. No emojis in motivational text.

---

## Deployment
- Build: `npm run build` → `dist/` · Host: Netlify · publish dir: `dist`
- Google OAuth Client ID: `186862100308-4lfr928avpodulpf4d70m9jteh1qgm2r.apps.googleusercontent.com`
- Authorized origins: `https://tmple.netlify.app` · `http://localhost:5173`
