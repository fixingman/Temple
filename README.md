# 🟁 Temple

**Your body is a temple. Train it.**

A free, private workout app that tracks your progress without making you feel bad about it. No accounts, no subscriptions, no social pressure. Your data stays on your device.

---

## Why Temple

Most fitness apps produce shame and demotivation. They count your failures, break your streaks, and push algorithmic targets. [Research shows](https://bpspsychub.onlinelibrary.wiley.com/doi/10.1111/bjhp.70026) this makes people quit — the opposite of what a workout app should do.

Temple is built on a different belief: **measurement is a mirror, not a judge.** Every data point exists to show you how far you've come. Nothing in the app tells you you're behind.

### Principles

- **Showing up is the win.** No deficit warnings. No "you're falling behind."
- **Measure to celebrate, not to judge.** PRs, volume charts, progress lines — all backward-looking at growth.
- **Your data is yours alone.** No accounts, no server, no tracking. Privacy is architecture, not a toggle.
- **Premium feel communicates respect.** Your effort deserves a polished tool, not a cheap interface.
- **Quiet confidence over loud motivation.** "Your body is a temple" — not "CRUSH IT BRO."

---

## Features

**📖 Exercise Library** — 51 exercises across 8 muscle groups. Filter by muscle, equipment (weighted/bodyweight), and type (strength/mobility). Add your own. YouTube form-check links on every exercise.

**📋 Workout Sets** — Build named sets from the library. See which muscles you're covering. Reorder exercises. Start training with one tap.

**▶️ Training** — Guided set-by-set flow. Pre-fills weight and reps from your last session. Auto rest timer. PR reference while you lift. Workout clock.

**📊 Progress** — Weekly consistency (not streaks). Per-exercise progress charts with estimated 1RM. Muscle volume breakdown. Session history with repeat.

**⚙️ Settings** — kg/lbs toggle. Export and import your data as JSON. Reset if needed.

---

## Tech

- React 18, single-file PWA (~1450 lines)
- Design token system for consistent styling and motion
- Recharts for per-exercise progress visualization
- All data stored locally — no backend, no API calls
- Offline-capable with service worker

## Privacy

Temple has no server. There is no account creation, no authentication, no analytics, no tracking pixels, no third-party scripts. Your workout data exists only on your device. Export produces a local JSON file. The YouTube links open a search query in a new tab — no user data is transmitted.

## Status

**v0.5** — functional prototype. Built as a Claude artifact, preparing for standalone deploy to Netlify.

### Roadmap
- Deploy to Netlify (Vite + React, IndexedDB, real PWA)
- Real-world testing (5+ sessions, friction audit)
- Branding and tonality refinement
- Session notes and RPE rating
- Optional Google Drive backup (user's own account, zero data on our side)

---

## License

MIT

---

*Temple was designed with a simple belief: people who train deserve a tool that respects their effort. No guilt. No noise. Just your progress, presented honestly.*
