# 🟁 Temple — Performance & Security Audit

Refresh after significant versions or when something feels slow. Re-measure every number against current source — don't trust stale figures.

**Baseline date:** 2026-06-16 · **Version:** v1.3

---

## Bundle & Load
From `npm run build` (gzip):

| Chunk | Raw | Gzip | Notes |
|-------|-----|------|-------|
| `index` (app entry) | 340 KB | ~81 KB | Core app + React + framer-motion + tone |
| `index` (vendor/second) | 451 KB | ~133 KB | Shared vendor chunk |
| `ProgressPage` (lazy) | 415 KB | ~114 KB | recharts — only loads when Progress tab first opened |
| `index.html` | 1.1 KB | 0.6 KB | |

- recharts is correctly code-split (lazy import in `App.jsx`) — not paid on first load.
- **Gap:** vendor chunk (~133 KB gzip) is large; framer-motion + tone are both heavy. Acceptable for now.

## Runtime
- **Timers:** rest-timer `setInterval` (SessionPage, cleared on unmount/pause) · pull-to-refresh `setTimeout` before reload (App.jsx) · `<Pulse>` WAAPI loops (cancelled on unmount). No known accumulating timers.
- **Animation sites:** all looping animation goes through one WAAPI `<Pulse>` component. One-shot CSS keyframes only otherwise (no CSS `infinite`).
- **Storage:** single idb-keyval blob `"temple-data"`, read once on load, written on each `save()`. No per-keystroke writes.
- **DOM:** inline-style based, no CSS-in-JS runtime; no virtualization needed (lists are short).

## Security
- **XSS:** `dangerouslySetInnerHTML` used only in `renderResult` (`SessionPage.jsx`) — strips all HTML tags, then allows only `**bold**` → `<strong>`. No other raw HTML injection.
- **Secrets:** Anthropic key stored client-side (user-provided), sent only to `/api/coach` Netlify proxy — never to a Temple server beyond the proxy. `YOUTUBE_API_KEY` is server-only (Netlify env, `youtube.js` function). No keys in the client bundle.
- **Network:** fetch only in `useCoach.js`, `useGoogleDrive.js`, `sw.js`, VideoSheet (`/api/youtube`). Security headers in `netlify.toml`.
- **CSP:** not yet set — **gap**.

## Privacy
- All workout data local (idb-keyval). Optional Google Drive backup is user-initiated. No analytics, no tracking.

## Known Gaps
| Gap | Severity |
|-----|----------|
| No Content-Security-Policy header | Medium |
| Vendor chunk ~133 KB gzip (framer-motion + tone) | Low |
| Timezone-naive week calculation | Low |
| No keyboard nav / focus management | Low |

## Scorecard
| Area | Status |
|------|--------|
| Bundle/load | ✅ (recharts split, app reasonable) |
| Runtime/timers | ✅ (all cleaned up) |
| XSS | ✅ (single escaped sink) |
| Secrets | ✅ (server-side / proxied) |
| CSP | ⚠️ (not set) |
| Privacy | ✅ (local-first, no analytics) |
| Accessibility | ⚠️ (aria-labels + reduced-motion done; no keyboard nav) |
