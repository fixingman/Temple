# Temple — Design System

**Direction: Athletic (B)**
Pure black + electric lime. Confident, physical, readable at a glance. Like a premium sport app.

---

## Principles

1. **Purposeful feedback** — every animation, sound, and icon confirms an action, not decorates it
2. **Data at a glance** — numbers big, labels small, no hunting for information
3. **Physical weight** — spring physics everywhere; nothing floats or eases out lazily
4. **Minimal chrome** — UI recedes, your workout data is the content
5. **Earned celebration** — PRs, completions, and streaks get a moment; tapping a button does not

---

## Palette (`T.color` / `C`)

```
bg           #000000      Page background
surface      #111111      Cards, tab bar, sheets
border       #222222      Card/input borders
text         #ffffff      Primary text
textDim      #666666      Labels, secondary info
textOnAccent #000000      Text on lime buttons

accent       #c8ff00      Electric lime — CTAs, active states, highlights
accentDim    rgba(200,255,0,0.10)
accentBorder rgba(200,255,0,0.25)

pr           #ffffff      PR achievements (monochrome, no separate color)
prDim        rgba(255,255,255,0.08)
prBorder     rgba(255,255,255,0.20)

danger       #ff4455      Destructive actions only
dangerDim    rgba(255,68,85,0.12)
dangerBorder rgba(255,68,85,0.20)

youtube      #ff4444
youtubeDim   rgba(255,0,0,0.12)
overlay      rgba(0,0,0,0.85)
```

---

## Typography

**Body font:** `"Space Grotesk"` — Google Fonts variable 300–700. Strong, modern, slightly wide.
**Mono font:** `"DM Mono"` — Google Fonts 400/500. Timers, weights, reps, all numeric data.

```
Weights: black=700  heavy=700  bold=700  semi=600  medium=500
(Space Grotesk caps at 700 — black/heavy render at max)

Letter spacing:
  tight     -0.03em   Headings, stat numbers
  label     +0.08em   Uppercase labels, tab text, pill filters
  uppercase +0.08em   (alias for label)
```

Size scale unchanged: `micro=9 xxs=10 xs=11 small=12 caption=13 bodySmall=14 body=15 h3=17 h2=18 h1=22 statMd=24 stat=28 icon=36 timer=40 hero=48`

---

## Layout

```
Radius: sm=2 base=4 md=6 lg=10 xl=10 full=9999
Card padding: 16px (T.space.xl)
Page padding: 16px horizontal
Max content width: 480px
```

Spacing philosophy: tight rhythm within components, generous gap between sections. Primary training UI fits one screen — no scroll during active session.

Spacing scale unchanged: `xs=2 sm=4 md=6 base=8 lg=12 xl=16 2xl=20 3xl=32 4xl=40`

---

## Icon System — Phosphor Icons

**Package:** `@phosphor-icons/react`
**Default weight:** `bold` — navigation, actions
**Active weight:** `fill` — selected tab, checked state
**Sizes:** 22px nav · 20px inline actions · 18px inline secondary

All icons imported via `src/icons.jsx`. No direct Phosphor imports in pages.

| Context | Phosphor name |
|---|---|
| Library tab | `BookOpen` |
| Sets tab | `Stack` |
| Train tab | `PlayCircle` |
| Progress tab | `ChartBar` |
| Settings tab | `Gear` |
| Add | `Plus` |
| Delete | `Trash` |
| Edit | `PencilSimple` |
| Close / X | `X` |
| Done / log set | `Check` |
| Rest timer | `Timer` |
| PR / achievement | `Trophy` |
| Weight / exercise | `Barbell` |
| Form video | `YoutubeLogo` |
| Warning | `Warning` |
| Coach / AI | `Sparkle` |
| Google Drive | `CloudArrowUp` |
| Streak / energy | `Fire` |
| Navigation back | `ArrowLeft` |

**Rule:** no emoji in system UI. Emoji only in user-generated content (names created by users).

---

## Illustration System

### SVG Muscle Map (inline React component)
Minimal front/back anatomical silhouette. Targeted muscles highlight in `#c8ff00`.
Used on: exercise detail, session summary, muscles-worked screen.
Implementation: inline SVG with named path IDs per muscle group, `fill` toggled via props.

### Rive (add when needed)
**Package:** `@rive-app/react-canvas`
GPU-accelerated canvas animations, 2–20kb files, state-machine driven.
Planned: session complete ring, PR trophy, rest timer ring.
Do not use Lottie (heavier, After Effects dependency).

---

## Motion System — Framer Motion

**Package:** `framer-motion`
Spring physics everywhere. Duration ≤ 300ms. Nothing floats.

### Spring Presets (`T.motion.*`)

```js
snap:    { type: "spring", stiffness: 500, damping: 35 }   // button press, toggle
default: { type: "spring", stiffness: 400, damping: 30 }   // list items, cards
gentle:  { type: "spring", stiffness: 250, damping: 28 }   // page / tab transitions
```

### Interaction Map

| Event | Animation | Preset |
|---|---|---|
| Log a set | Card enters `y:8→0, opacity:0→1` | `default` |
| Tab switch | `opacity:0→1, y:4→0` | `gentle` |
| Rest timer end | Pulse `scale:1→1.04→1` | CSS keyframe |
| PR achieved | Badge `scale:0→1.15→1` | `snap` |
| Button tap | `whileTap:{ scale:0.96 }` | instant |
| Modal/sheet open | `y:100%→0` slide-up | `gentle` |
| Item delete | `x:0→-40, opacity:1→0` | `default` |

Use `<AnimatePresence>` on all list renders so exit animations play on removal.

---

## Sound System — Tone.js

**Package:** `tone`
Synthesized in code — no audio files, no loading, procedural feel.
All sounds gated by `"temple-sound"` key in storage (default: off).

### Sound Map

| Event | Sound | Implementation |
|---|---|---|
| Log a set | Percussive thud | `MembraneSynth`, 40ms, C2 |
| Rest complete | Two-note ping | `MetalSynth`, E4→G4, 80ms each |
| PR achieved | Rising chime | `PluckSynth`, C4→E4→G4, staggered |
| Session done | Low-to-high swell | `Synth` with envelope, 400ms |

Architecture: `src/useSound.js` hook exports `{ play, enabled, toggle }`.
AudioContext starts on first user gesture (browser requirement).
All synths created lazily on first `play()` call.

### Settings Toggle UI Pattern

```jsx
const { enabled: soundEnabled, toggle: toggleSound } = useSound();

// Pill-style toggle (same pattern as kg/lbs):
<div style={{ display: "flex", gap: T.space.sm, background: C.bg, borderRadius: T.radius.lg, padding: 3 }}>
  {[{ v: false, l: "OFF" }, { v: true, l: "ON" }].map(o => (
    <button key={String(o.v)} onClick={toggleSound}
      style={{ background: soundEnabled === o.v ? C.accentDim : "transparent",
               color: soundEnabled === o.v ? C.accent : C.textDim, ... }}>
      {o.l}
    </button>
  ))}
</div>
```

---

## Z-Index Stack

| Layer | Token | Value |
|---|---|---|
| Base content | — | 1 |
| Sticky headers | `T.z.header` | 50 |
| Tab bar | `T.z.tabBar` | 100 |
| Modals / sheets | `T.z.modal` | 200 |
| Toasts / debug | `T.z.toast` | 300 |

---

## Implementation Notes

- **Input-within-card background:** `#181818` — used inline for session weight/reps fields. Cards are `#111111`, page bg is `#000`. Not a token, intentional one-off.
- **Framer Motion import:** always `import { motion, AnimatePresence } from "framer-motion"`. Never inline spring configs — use `T.motion.*` presets.
- **`Btn` is `motion.button`** with `whileTap={{ scale: 0.96 }}`. No `whileHover` — mobile-first, no hover states.
- **Tab buttons are `motion.button`** with `whileTap={{ scale: 0.88 }}` — slightly stronger press than Btn to match smaller tap target.
- **Icons in pages:** import from `src/icons.jsx` only. No direct `@phosphor-icons/react` imports in pages.

---

## Quality Rules

1. No content shifting on expand/collapse
2. Nothing appears instantly — Framer Motion or `t-fade-in` on all mounts
3. No number spinners, no tap highlights, no focus rings
4. All spacing from `T.space.*` — no one-off pixel values
5. Card borders: `1px solid ${C.border}` — active/focused state uses `C.accentBorder`
6. Hierarchy via font weight + color contrast — no decorative gradients or shadows
7. Mono font (`T.font.mono`) only for numeric data: timers, weights, reps, distances
