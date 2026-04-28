# 🟁 Temple — Product (v0.6)

## Philosophy
Most fitness apps make you feel bad. Temple's stance: **measurement is a mirror, not a judge.**

**Core beliefs:**
1. Showing up is the win — no deficit warnings, no red numbers
2. Measure to celebrate, not judge — all data looks backward at growth
3. Your data is yours alone — no accounts, no server, no social comparison
4. Premium feel communicates respect — polish says "your effort matters"
5. Quiet confidence over loud motivation — warm, minimal, never performative

**Tone rules:** No exclamation marks in encouragement. No forward pressure ("X more to go"). No emojis in motivational text. Calm acknowledgement: "Workout Complete." not "Workout Complete! 🎉". Streaks → weekly consistency (WEEKS ACTIVE X/4).

## Features

**Library (📖)** — 51 exercises, 8 muscle groups. Custom CRUD. Search + filter (muscle / equipment / category). YouTube form-check links. BW/MOB tags.

**Sets (📋)** — Exercise picker, reordering (▲▼), muscle activation highlight. Edit/delete with confirm.

**Train (▶️)** — Pre-fills from last session. Log Set → 90s rest → REST DONE → next. Chunky inputs, PR reference bar, completed set summaries, workout timer.

**Progress (📊)** — Stats grid. Sub-tabs: 🏆 PRs (recharts chart inline), 💪 Muscles (volume bars), 📅 History (repeat session).

**Settings (⚙️)** — Unit toggle (kg/lbs). Google Drive backup/restore. Export/import JSON. Reset. Data summary.

## Data
Single JSON blob `"temple-data"` via idb-keyval: `exercises[]`, `sets[]`, `sessions[]`, `prs{}`, `settings{}`. Weights stored in kg. See ARCHITECTURE.md.
