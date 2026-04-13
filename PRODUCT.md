# 🟁 Temple — Product (v0.5)

## Philosophy

### Why Temple Exists
Most fitness apps make you feel bad. A 2025 UCL study of 60,000 social media posts found that popular tracking apps frequently produce shame, disappointment, and demotivation — the opposite of their stated purpose. Users become preoccupied with hitting algorithmic targets, maintaining streaks, and quantifying failure rather than recognizing progress.

Temple takes the opposite stance: **measurement is a mirror, not a judge.** Research consistently shows that people who track their training objectively perform better than those who rely on feeling alone — but they often *feel* worse about it because the apps frame data as targets to hit rather than progress to acknowledge.

### Core Beliefs

**1. Showing up is the win.**
You trained today. That's it. Temple never tells you you're behind, you missed a target, or you should have done more. There are no red numbers, no deficit warnings, no "you're falling behind" notifications.

**2. Measure to celebrate, not to judge.**
Every data point exists to show you how far you've come. PR detection, volume charts, progress lines — they all look backward at growth, never forward at what you haven't done yet.

**3. Your data is yours alone.**
No accounts, no social comparison, no leaderboards, no sharing pressure. Privacy isn't a feature — it's architecture. Temple can't see your data because there's no server to send it to.

**4. Premium feel communicates respect.**
The polish, the animations, the considered interactions — these aren't decoration. They say: "your effort matters enough to build something beautiful around it." A cheap interface around hard work feels disrespectful.

**5. Quiet confidence over loud motivation.**
Temple's voice is warm, minimal, never performative. "Your body is a temple" — not "CRUSH YOUR GOALS" or "NO EXCUSES." Encouragement is soft. Achievements are acknowledged, not shouted.

### Design Implications
- **Streaks**: replaced with weekly consistency (THIS WEEK + WEEKS ACTIVE X/4). No consecutive day counter. ✓
- **Encouragement banners**: celebrate what you've done, never imply what you haven't. No emojis, no exclamation marks.
- **Empty states**: warm and inviting, never guilt-inducing. "No sessions yet" not "You haven't trained in 3 days."
- **PR detection**: frame as discovery, not obligation. "New Personal Records" not "Can you beat it next time?"
- **Completion screen**: "Workout Complete" — calm acknowledgement, not celebration theatre.
- **Tonality rules**: no exclamation marks in encouragement copy. No forward-looking pressure ("X more to go"). No emojis in motivational text. Periods, not exclamation marks.
- **Voice**: confident, soft, human. Like a good training partner who notices your progress without being annoying about it.

---

## Overview
Free, private workout PWA. Custom exercise sets, guided training sessions, PR tracking. No accounts, no backend, data stays on device.

**Tech**: React 18 single-file JSX (~1300 lines), recharts, `T` token system, `window.storage` API.

## Navigation
- **Top**: centered 🟁 TEMPLE logo, pulsing save dot
- **Bottom tabs**: Library · Sets · Train · Progress · Settings

## Features

### Library (📖)
50 default exercises, 8 muscle groups. Custom CRUD (cascades to sets + PRs). Search + grouped filter bar (muscle | equipment | category). YouTube form-check links. BW/MOB tags on cards.

### Sets (📋)
Exercise picker with reordering (▲▼). Muscle activation highlight. Edit/delete with confirmation. Ghost CTA when sets exist.

### Train (▶️)
Pre-fills from last session. Log Set → auto 90s rest → REST DONE flash → next set. Chunky inputs, PR reference, completed set summaries. Workout timer + progress bar.

### Progress (📊)
Stats grid, three sub-tabs: 🏆 PRs (inline expanding with recharts chart), 💪 Muscles (volume bars), 📅 History (with repeat).

### Settings (⚙️)
Unit toggle (kg/lbs). Export/import/reset. Data summary. About.

## Data
Single JSON blob (`temple-data`): exercises, sets, sessions, prs, settings. Weights in kg. See ARCHITECTURE.md.

## Infrastructure
ErrorBoundary, save indicator, PWA (graceful fallback), install prompt, `runDataTests()` for CI, GlobalStyles animations.
