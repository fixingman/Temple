# 🟁 Temple — Rules

## Start of Session
1. Read RULES.md (this file)
2. Read CHANGELOG.md + BACKLOG.md + BUGS.md
3. `git clone https://github.com/fixingman/Temple.git`
4. Check version in App.jsx About card + SW cache names both match CHANGELOG
5. Tell user: "On v[X]. Last: [summary]. Next: [top backlog item]. Open issues: [none/list]."

## End of Session
1. Bump version in App.jsx About card
2. Bump SW cache names in `public/sw.js` (`temple-vX.X` + `temple-assets-vX.X`)
3. CHANGELOG.md → new version at top, list everything shipped
4. BACKLOG.md → remove completed, add discovered, update tags
5. BUGS.md → move fixed bugs to Fixed table, add newly discovered bugs
6. ARCHITECTURE.md → update if structure/data model/files changed
7. Housekeeping checks (HOUSEKEEPING.md) — run all, update Last Run
8. `npm run build` — must pass zero errors
9. Commit: `"vX.X — one-line summary"`
10. Push → confirm Netlify deploy → run smoke tests → update results
11. **Update "Where We Left Off" below — mandatory**

**Never close with:** stale memory files · failing build · uncommitted changes · Where We Left Off not updated

**Memory drift rule:** Memory files must be committed in the same push as code.

---

## Where We Left Off
```
Version:     v0.8.2
Date:        2026-05-05
Shipped:     4 bugs fixed (B21–B24) · tokenisation audit · performance
             (bundle split 613KB→94KB · useMemo · useCallback) ·
             security headers · BUGS.md created with full history
Tested:      Not yet — user testing today (smoke tests S1–S8)
Next:        Run smoke tests · session detail view · post-session recovery
             tip · exercise swap UI · gap analysis UI
Open issues: Google OAuth still in testing mode
             All v0.8.x features shipped, none tested on real device yet
```

---

## File Structure
```
index.html · vite.config.js · package.json · netlify.toml · .gitignore
public/   manifest.json · sw.js · icon.svg · _headers · _redirects
src/      main.jsx · tokens.js · data.js · hooks.js
          useGoogleDrive.js · useCoach.js · App.jsx
memory/   RULES.md · PRODUCT.md · ARCHITECTURE.md · DESIGN.md
          CHANGELOG.md · BACKLOG.md · BUGS.md · HOUSEKEEPING.md
```

---

## Versioning
- **Patch** (0.8.3): bug fixes · **Minor** (0.9): features · **Major** (1.0): rewrites
- Commit format: `"vX.X — one-line summary"`
- SW cache names must always match the version

---

## Standing Code Rules

**Storage:** idb-keyval only. Key: `"temple-data"`. Weights always in kg internally.

**Styling:** Inline styles via `T` tokens. `T.space.*` for spacing. `T.color.*`/`C.*` for color. No raw hex outside `tokens.js`. No `transition: all`.

**Privacy:** Fetch only in `useCoach.js` + `useGoogleDrive.js` + `sw.js`. No analytics. Export/import = clipboard or local file only.

**AI:** All calls via `useCoach`. `MODELS.fast` (Haiku) for structured tasks. `MODELS.smart` (Sonnet) for nuanced judgment. All prompts in `useCoach.js`.

**React:** `useCallback` on async functions. `useMemo` on expensive computations. No useState after early returns. Clean up intervals in useEffect return. `dangerouslySetInnerHTML` only in `renderResult` (strips HTML first).

**Copy:** No exclamation marks. No forward pressure. No emojis in motivational text.

---

## Deployment
- Build: `npm run build` → `dist/` · Host: Netlify · publish dir: `dist`
- Bundle: app ~94KB gzip · recharts ~154KB gzip (separate chunk)
- Google OAuth Client ID: `186862100308-4lfr928avpodulpf4d70m9jteh1qgm2r.apps.googleusercontent.com`
- Authorized origins: `https://tmple.netlify.app` · `http://localhost:5173`
