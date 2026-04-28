# 🟁 Temple — Rules

## Start of Session
1. Read RULES.md (this file)
2. Read CHANGELOG.md → current version + what shipped
3. Read BACKLOG.md → what's next
4. `git clone https://github.com/fixingman/Temple.git`
5. Check version string in App.jsx About card matches CHANGELOG
6. Tell user: "On v[X]. Last shipped: [summary]. Next: [top backlog item]."

## End of Session
1. Bump version in App.jsx About card + PRODUCT.md header
2. CHANGELOG.md → new version at top, list everything shipped
3. BACKLOG.md → remove completed, add discovered
4. ARCHITECTURE.md → update if structure/data model changed
5. Housekeeping checks:
   - No `window.storage` / `localStorage` / `runDataTests`
   - No fetch outside `useGoogleDrive.js` + `sw.js`
   - No `dangerouslySetInnerHTML`, `eval()`, `transition: all`
   - No raw hex outside `tokens.js`, no dead functions
   - Update "Last Run" date in HOUSEKEEPING.md
6. `npm run build` — must pass zero errors
7. Commit: `"v0.X — one-line summary"`
8. Push → confirm Netlify deploy → hard refresh + smoke test
9. Update "Where We Left Off" below

**Never close with:** stale memory files, failing build, uncommitted changes.

---

## Where We Left Off
**Version**: v0.6 — live at https://tmple.netlify.app
**Repo**: https://github.com/fixingman/Temple.git · branch: `main`

**Last shipped (v0.6):** Google Drive backup/restore · bodyweight/mobility session fixes · Vite project split · idb-keyval storage · netlify.toml/headers/redirects · removed runDataTests

**Next:** Test app with real data · session detail view · custom rest timer · branding audit

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
- **Patch** (0.6.1): bug fixes only · **Minor** (0.7): features · **Major** (1.0): rewrites
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
