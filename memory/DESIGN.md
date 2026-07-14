# Temple — Design System

**Direction: Athletic (B)**
Pure black + electric lime (dark) · warm off-white + olive-lime (light). Confident, physical, readable at a glance. Like a premium sport app.

---

## Theming (v1.4+)

Two themes — **dark** (original) and **light** — plus an **Auto** setting that follows the OS (`prefers-color-scheme`). Setting lives in `settings.theme` (`"dark" | "light" | "system"`, default `"system"`).

**How it works:** literal colors live only in `PALETTES` (`src/tokens.js`). `GlobalStyles` emits them as `--c-*` CSS variables per `:root[data-theme]`; `T.color` values are `var(--c-*)` references, so all inline-style call sites resolve live — theme switches are pure CSS, no re-render. `useTheme` (`src/hooks.js`) sets `<html data-theme>` (useLayoutEffect, pre-paint), tracks the OS via `matchMedia` when on Auto, and keeps `<meta name="theme-color">` in sync.

**Rules:**
- Never hardcode a theme-specific literal outside `PALETTES`. New colors → add a key to *both* palettes.
- `public/manifest.json` colors stay dark (static file, governs install splash only).
- `index.html` pre-boot bg uses a `prefers-color-scheme` media query; manual-override users may see one wrong-color frame on cold start (setting is in idb-keyval, unreadable pre-JS) — accepted.

---

## Principles

1. **Purposeful feedback** — every animation, sound, and icon confirms an action, not decorates it
2. **Data at a glance** — numbers big, labels small, no hunting for information
3. **Physical weight** — spring physics everywhere; nothing floats or eases out lazily
4. **Minimal chrome** — UI recedes, your workout data is the content
5. **Earned celebration** — PRs, completions, and streaks get a moment; tapping a button does not

---

## Palette (`T.color` / `C` — values are `var(--c-*)`; literals live in `PALETTES`)

| Token | Dark | Light | Usage |
|---|---|---|---|
| bg | `#000000` | `#f5f5f4` | Page background |
| surface | `#111111` | `#ffffff` | Cards, tab bar, sheets |
| border | `#222222` | `#e0e0de` | Card/input borders |
| text | `#ffffff` | `#1a1a1a` | Primary text |
| textDim | `#666666` | `#8a8a86` | Labels, secondary info |
| textOnAccent | `#000000` | `#ffffff` | Text on accent buttons |
| accent | `#c8ff00` | `#5f7d00` | CTAs, active states (lime → olive-lime: lime is unreadable as text on white) |
| accentDim | lime α.10 | olive α.10 | Accent fills |
| accentBorder | lime α.25 | olive α.30 | Accent borders |
| accentMid / accentSoft / accentFaint | lime α.35/.5/.2 | olive α.30/.45/.15 | MuscleMap volume gradations |
| pr / prDim / prBorder | white / α.08 / α.20 | near-black / α.06 / α.18 | PR achievements (monochrome) |
| danger | `#ff4455` | `#d92638` | Destructive actions only |
| youtube | `#ff4444` | `#e02222` | Form-video buttons |
| overlay | black α.85 | black α.45 | Sheet backdrops |
| videoOverlay | black α.7 | black α.7 | Video player |
| inputBg | `#181818` | `#efefed` | Inputs within cards |
| mapNeutral | `#1a1a1a` | `#e2e2e0` | MuscleMap non-muscle zones |

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
| Loading / saving pulse | Opacity loop `0.4→1→0.4` | `<Pulse>` (WAAPI) |
| PR achieved | Badge `scale:0→1.15→1` | `snap` |
| Button tap | `whileTap:{ scale:0.96 }` | instant |
| Modal/sheet open | `y:100%→0` slide-up | `gentle` |
| Item delete | `x:0→-40, opacity:1→0` | `default` |

Use `<AnimatePresence>` on all list renders so exit animations play on removal.

### Looping animations → WAAPI, never CSS `infinite`

**Hard rule:** any animation that loops (`iterations: Infinity`) must use WAAPI (`el.animate(...)`), not a CSS `infinite` keyframe. A CSS infinite animation restarts from keyframe 0 on every `display:none/block` repaint cycle (mobile wake, tab toggle, panel open) — a visible flash that suppress/restore cannot fix. A WAAPI timeline survives display toggles untouched.

- The only looping animation in Temple is the pulse (loading/saving/active-session dots). It lives in the shared `<Pulse>` component (`src/components.jsx`) — WAAPI, gated on `useReducedMotion()`.
- **One-shots stay CSS** (`t-fade-in`, `t-scale-in`, `t-slide-up`, `t-logo-spin`, `t-text-in`) — they clear mid-flight, never loop, so the flash never applies.

### Reduced motion

- App root is wrapped in `<MotionConfig reducedMotion="user">` — all Framer Motion animations collapse to instant when the OS requests reduced motion.
- `<Pulse>` skips its WAAPI loop entirely under reduced motion.
- `GlobalStyles` includes a `@media (prefers-reduced-motion: reduce)` block neutralizing CSS animation/transition durations.

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

- **Input-within-card background:** `C.inputBg` — used for session weight/reps fields, sits between surface and bg in both themes.
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
