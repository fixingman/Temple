# Temple — Product Thinking

---

## 1. North Star

**Temple owns the 90 seconds between sets** — the moment when the workout is live, the clock is running, and the only job is to know what comes next without thinking about it.

Everything else (library, progress, history, AI) exists to make that moment frictionless or to make the next one slightly better.

---

## 2. What this product is not

| What | Why not |
|---|---|
| **A social platform** | Comparison is a mirror that judges. Temple's mirror shows only your own history. No accounts, no leaderboards, no sharing — by architecture, not by setting. |
| **A motivational tool** | Motivation is forward pressure. Temple doesn't tell you what to do next, remind you to show up, or warn you that you're falling behind. "Workout Complete." is the ceiling of enthusiasm. |
| **A program or plan** | Prescriptive programs move authority from the user to the app. Temple pre-fills from your last session and gets out of the way. What you do with that information is yours. |
| **A health dashboard** | Calories, steps, sleep, heart rate — each would expand scope without making the 90-second moment better. The data Temple tracks (sets, weight, volume, PRs) is the minimum sufficient to answer "did I improve?" |
| **An analytics product** | Progress exists, but it looks backward at growth. Nothing in Temple surfaces deficits, warns about gaps, or turns your data against you. Even the AI gap analysis is opt-in and states what's been missed, not what you owe. |

---

## 3. Core design principles

**1. The data looks backward, never forward.**
Every stat, chart, and AI output describes what happened. Nothing projects targets, predicts failure, or generates forward obligations. *Check: does this feature create pressure to act? If yes, don't ship it.*

**2. Friction during a session is a product bug.**
Session UI is optimized for one-hand, between-set use: chunky inputs, auto-prefill from last session, 90s rest timer, PR bar visible without navigating. Any feature that adds a tap or decision to the active session requires a strong justification. *Check: does this appear during training? Would someone mid-set notice it?*

**3. Privacy is structural, not a setting.**
Data lives in idb-keyval on device. Network calls exist in exactly four places: `useCoach.js`, `useGoogleDrive.js`, `sw.js`, and the YouTube proxy. No analytics, no telemetry, no accounts. New features that require a server-side user identity are architecturally excluded. *Check: does implementing this require storing user data off-device? If yes, needs explicit re-evaluation of the data model.*

**4. Consistency is weekly, not daily.**
The only streak-like metric is WEEKS ACTIVE X/4 — not a daily streak, not a "you haven't trained in N days" warning. Missing a day isn't a data event. Missing three weeks of a four-week window is a fact, stated calmly. *Check: does this feature punish gaps or reward unbroken chains? If yes, it contradicts the "measurement is a mirror" stance.*

**5. Polish communicates respect.**
Spring physics on every interaction, mono font on every number, no number spinners, no focus rings — the level of craft says "your effort matters." This is not decoration; it's tone. A rough, utilitarian interface in a fitness app implicitly devalues the work happening in front of it. *Check: does this element look like it was finished? Would it embarrass a premium app?*

---

## 4. The recurring surface test

> **Would this deliver something the screen doesn't already show — on Day 14 — if the user trained consistently?**

Day 1 is not the test. On Day 1, everything is novel. The Wallpaper Test fires on Day 14, when the pattern is established and the output is predictable.

A surface passes if every appearance delivers: **new information**, **an action worth taking now**, or **a feeling that is genuinely fresh** given the user's current data. It fails if the output shape is the same regardless of input — same trigger, same structure, same takeaway.

The failure mode isn't cognitive load (a quiet line is cheap to ignore) — it's that a surface that doesn't pay rent teaches the user to stop looking, and takes neighbouring features down with it.

**Currently on watch:** AI recovery tip, AI gap analysis, AI muscle map highlights — all scheduled for a Day 14 review that is now overdue (~2026-06-30). If they say roughly the same thing each session, cut or rework.

---

## 5. Decision log

| Area | Decision | Reason |
|---|---|---|
| Data storage | idb-keyval, single blob, no server | Privacy is structural. Server-side storage requires accounts, which requires comparison, which contradicts the core stance. |
| Consistency metric | Weeks active (X/4), not daily streak | Daily streaks punish life. A weekly window treats a rest day as normal. |
| Motivational copy tone | No exclamation marks, no forward pressure, no emoji in system text | "Workout Complete!" is a judgment. "Workout Complete." is an acknowledgment. |
| AI features | Opt-in, behind user-supplied API key | AI surfaces are high Wallpaper Test risk. Keeping them opt-in limits exposure to users who actively chose them. |
| Sound | Off by default | Gym environments. Respects the user's context before asking permission. |
| Weight unit | Stored in kg, converted for display | Single representation avoids drift and rounding errors across unit toggles. |
| Looping animations | WAAPI only, never CSS `infinite` | CSS infinite loops restart from keyframe 0 on display toggle — visible flash on mobile wake/tab switch. WAAPI survives it. |
| Theme | Auto (follow OS) as default | Most conventional; forces zero choice on new users. Manual overrides available in Settings. |
| No push notifications | Not implemented | Reminders are forward pressure. Temple doesn't tell you to show up. |
| No goals or targets | Not implemented | Goals create deficits. A target you miss is data turned against you — contradicts "measurement is a mirror." |

---

**Gap/tension to watch:** The consistency card (ProgressPage, lines 140–143) shows an accent-highlighted message when weeksActive ≥ 3 ("You've been consistent"). This is mild positive reinforcement — backward-looking, stated calmly, no streak pressure — but it is the one place Temple edges toward motivation. It passes the current principles, but any expansion of that pattern (more conditions, more urgency, "keep it going") would cross the line.
