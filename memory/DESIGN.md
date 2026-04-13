# 🟁 Temple — Design System

> All visual decisions are tokenised. No magic numbers in components.
> Change a token here → update `T` in `temple.jsx` → every usage updates.

---

## 1. Color Tokens

### 1.1 Backgrounds
| Token               | Value                        | Usage                                    |
|----------------------|------------------------------|------------------------------------------|
| `color.bg`           | `#0a0a0f`                    | Page background, inset wells             |
| `color.surface`      | `#12121c`                    | Cards, modals, tab bar, segmented controls |
| `color.surfaceHover` | `#1a1a28`                    | Hover/pressed state for surfaces         |

### 1.2 Borders & Dividers
| Token               | Value                        | Usage                                    |
|----------------------|------------------------------|------------------------------------------|
| `color.border`       | `#1e1e2e`                    | Card borders, input borders, dividers    |

### 1.3 Text
| Token               | Value                        | Usage                                    |
|----------------------|------------------------------|------------------------------------------|
| `color.text`         | `#e8e8ef`                    | Primary text, headings, input values     |
| `color.textDim`      | `#6b6b80`                    | Secondary text, labels, placeholders     |
| `color.textOnAccent` | `#0a0a0f`                    | Text on primary accent buttons           |

### 1.4 Accent (Primary — Teal)
| Token               | Value                        | Usage                                    |
|----------------------|------------------------------|------------------------------------------|
| `color.accent`       | `#00e5c8`                    | Primary buttons, active tabs, stats, logo |
| `color.accentDim`    | `rgba(0,229,200,0.12)`       | Accent tinted backgrounds, active pills  |
| `color.accentBorder` | `rgba(0,229,200,0.2)`        | Encouragement card borders               |

### 1.5 PR / Achievement (Purple)
| Token               | Value                        | Usage                                    |
|----------------------|------------------------------|------------------------------------------|
| `color.pr`           | `#7c5cfc`                    | PR badges, PR stats, achievement text    |
| `color.prDim`        | `rgba(124,92,252,0.12)`      | PR card backgrounds                      |
| `color.prBorder`     | `rgba(124,92,252,0.2)`       | PR card borders                          |

### 1.6 Danger
| Token               | Value                        | Usage                                    |
|----------------------|------------------------------|------------------------------------------|
| `color.danger`       | `#ff4466`                    | Delete buttons, cancel actions           |
| `color.dangerDim`    | `rgba(255,68,102,0.12)`      | Danger button backgrounds                |
| `color.dangerBorder` | `rgba(255,68,102,0.2)`       | Validation error banner borders          |

### 1.7 YouTube
| Token               | Value                        | Usage                                    |
|----------------------|------------------------------|------------------------------------------|
| `color.youtube`      | `#ff4444`                    | YouTube button text                      |
| `color.youtubeDim`   | `rgba(255,0,0,0.12)`         | YouTube button background                |

### 1.8 Overlay
| Token               | Value                        | Usage                                    |
|----------------------|------------------------------|------------------------------------------|
| `color.overlay`      | `rgba(0,0,0,0.7)`           | Modal/dialog backdrop                    |

---

## 2. Typography Tokens

### 2.1 Font Family
| Token               | Value                                                        | Usage        |
|----------------------|--------------------------------------------------------------|--------------|
| `font.body`          | `-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif` | All text     |
| `font.mono`          | `"SF Mono", "Fira Code", "Consolas", monospace`              | Timers, stats |

### 2.2 Font Sizes
| Token           | Value  | Usage                                          |
|-----------------|--------|-------------------------------------------------|
| `fontSize.hero` | `48px` | Completion screen emoji                         |
| `fontSize.timer`| `40px` | Rest timer countdown                            |
| `fontSize.icon` | `36px` | Empty state icons/emoji                         |
| `fontSize.stat` | `28px` | Large stat numbers (total volume)               |
| `fontSize.statMd`| `24px`| Medium stat numbers (sessions, streak, PRs)     |
| `fontSize.h1`   | `22px` | Page titles                                     |
| `fontSize.h2`   | `18px` | Section titles, exercise name in session        |
| `fontSize.h3`   | `17px` | Workout set name on card                        |
| `fontSize.body` | `15px` | Body text, exercise names, input values         |
| `fontSize.bodySmall`| `14px`| Buttons, encouragement title, sub-items      |
| `fontSize.caption`| `13px`| Subtitle counts, history meta                 |
| `fontSize.small` | `12px`| Labels, meta text, muscle group, rest buttons  |
| `fontSize.xs`    | `11px`| Pill tags, YouTube button, checkbox labels, column headers |
| `fontSize.xxs`   | `10px`| Tab labels, stat unit labels                   |
| `fontSize.micro` | `9px` | PR card stat labels (MAX KG, MAX REPS, etc.)   |

### 2.3 Font Weights
| Token             | Value | Usage                                       |
|-------------------|-------|----------------------------------------------|
| `fontWeight.black` | `900` | Logo/brand                                  |
| `fontWeight.heavy` | `800` | Page titles, stat numbers, exercise headers, PR badge |
| `fontWeight.bold`  | `700` | Buttons (primary), card titles, timer, set numbers |
| `fontWeight.semi`  | `600` | Buttons (secondary), labels, tab labels, pills |
| `fontWeight.medium`| `500` | Ghost buttons                               |

### 2.4 Letter Spacing
| Token                    | Value     | Usage                              |
|--------------------------|-----------|-------------------------------------|
| `letterSpacing.tight`    | `-0.02em` | Logo, page titles                   |
| `letterSpacing.label`    | `0.04em`  | Tab labels                          |
| `letterSpacing.uppercase`| `0.05em`  | Uppercase labels, PR badge, section headers |

---

## 3. Spacing Tokens

| Token         | Value  | Usage                                         |
|---------------|--------|------------------------------------------------|
| `space.xs`    | `2px`  | Tab icon-to-label gap                          |
| `space.sm`    | `4px`  | Label-to-input gap, pill gap, subtitle margin  |
| `space.md`    | `6px`  | Pill wrap gap, list item gap                   |
| `space.base`  | `8px`  | Card gap, button row gap, grid gap, stat grid  |
| `space.lg`    | `12px` | Section margins, card content spacing, checkbox row gap |
| `space.xl`    | `16px` | Page section gap, card padding, content padding |
| `space.2xl`   | `20px` | Header padding, completion section padding     |
| `space.3xl`   | `32px` | Empty state padding                            |
| `space.4xl`   | `40px` | Empty state card padding, hero section         |

---

## 4. Radius Tokens

| Token            | Value  | Usage                                |
|------------------|--------|---------------------------------------|
| `radius.sm`      | `2px`  | Progress bar                          |
| `radius.base`    | `4px`  | Checkbox                              |
| `radius.md`      | `6px`  | Inline inputs, pill tags, YouTube button, inner stat boxes |
| `radius.lg`      | `8px`  | Buttons, text inputs, segmented control |
| `radius.xl`      | `12px` | Cards                                 |
| `radius.full`    | `20px` | Pill filters, PR badge                |

---

## 5. Sizing Tokens

| Token              | Value  | Usage                              |
|--------------------|--------|------------------------------------|
| `size.checkbox`    | `20px` | Exercise selector checkbox         |
| `size.setColumn`   | `32px` | Set number + remove button columns |
| `size.progressBar` | `3px`  | Session progress bar height        |
| `size.maxWidth`    | `480px`| Content area max-width             |
| `size.tabIcon`     | `18px` | Tab bar icon font size             |
| `size.scrollList`  | `340px`| Exercise picker scrollable area    |

---

## 6. Z-Index Tokens

| Token        | Value | Usage                    |
|--------------|-------|--------------------------|
| `z.tabBar`   | `100` | Bottom tab navigation    |
| `z.header`   | `50`  | Sticky top bar           |
| `z.modal`    | `200` | Confirm dialogs, overlays |

---

## 7. Motion System

### 7.1 Easing Curves
| Token               | Value                                | Usage                              |
|----------------------|--------------------------------------|------------------------------------|
| `easing.default`     | `cubic-bezier(0.4, 0, 0.2, 1)`      | Standard — most interactions, state changes |
| `easing.enter`       | `cubic-bezier(0, 0, 0.2, 1)`        | Decelerate — elements arriving, progress bars growing |
| `easing.exit`        | `cubic-bezier(0.4, 0, 1, 1)`        | Accelerate — elements leaving      |
| `easing.spring`      | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Overshoot — playful emphasis, icon rotations |

### 7.2 Durations
| Token               | Value    | Usage                                |
|----------------------|----------|---------------------------------------|
| `duration.fast`      | `0.15s`  | Micro-interactions: color, opacity, borders |
| `duration.medium`    | `0.25s`  | State changes: expanding, progress bars |
| `duration.slow`      | `0.35s`  | Complex transitions: page-level changes |

### 7.3 Composed Transitions (convenience)
| Token               | Value                                      | Usage                              |
|----------------------|--------------------------------------------|------------------------------------|
| `transition.fast`    | `0.15s cubic-bezier(0.4, 0, 0.2, 1)`      | Buttons, tabs, pills, cards        |
| `transition.medium`  | `0.25s cubic-bezier(0.4, 0, 0.2, 1)`      | State changes, expanding sections  |
| `transition.slow`    | `0.35s cubic-bezier(0.4, 0, 0.2, 1)`      | Complex or dramatic transitions    |
| `transition.spring`  | `0.3s cubic-bezier(0.34, 1.56, 0.64, 1)`  | Playful emphasis: expand/collapse icon |
| `transition.enter`   | `0.25s cubic-bezier(0, 0, 0.2, 1)`        | Elements appearing, bars filling   |
| `transition.exit`    | `0.2s cubic-bezier(0.4, 0, 1, 1)`         | Elements dismissing                |

### 7.4 Motion Guidelines

**Principles:**
- Motion should feel responsive, not decorative. Every transition earns its place.
- Faster is almost always better — if a transition feels right, try making it 30% shorter.
- Use `easing.default` for 90% of cases. Only reach for `spring` or `enter`/`exit` when the interaction type clearly calls for it.

**When to use each curve:**
- **default** → toggling states (active/inactive pills, tabs, button hover)
- **enter** → something growing or arriving (progress bars, expanding content)
- **exit** → something shrinking or leaving (dismissing alerts, closing)
- **spring** → single elements that should feel lively (rotate, scale, badge pop)

**What NOT to animate:**
- Text content changes (swap instantly)
- Layout reflows (heights, widths of containers) — only animate inner content like progress bars
- Colors on large surfaces — only on small elements (pills, icons, borders)

**Property specificity:**
- Never use `transition: all`. Always list specific properties: `background, color, border-color`.
- For transforms, transition `transform` alone: `transition: transform ${T.transition.spring}`
- Compose duration + easing from tokens when you need custom combos: `${T.duration.medium} ${T.easing.enter}`

### 7.5 CSS Animation Classes
| Class         | Keyframes                              | Duration | Usage                              |
|---------------|----------------------------------------|----------|------------------------------------|
| `t-logo-spin` | rotate 0→360°, scale 0.8→1, opacity 0→1 | 0.6s spring | Loading screen logo — plays once |
| `t-text-in`   | opacity 0→1, translateY 6px→0          | 0.4s enter | Loading screen text — staggered after spin |
| `t-fade-in`   | opacity 0→1, translateY 4px→0          | 0.25s enter | Elements appearing: rest timer, rest done flash, completion screen |
| `t-scale-in`  | opacity 0→1, scale 0.96→1             | 0.2s enter | Modal dialogs appearing            |
| `t-pulse`     | opacity 0.4→1→0.4                     | 1.5s infinite | Saving indicator dot            |

### 7.6 Premium Quality Principles

These are non-negotiable. Every UI decision should pass these checks:

1. **No content shifting** — when an element expands, collapses, or changes state, surrounding content must not visually jump or shift sideways. Expanded content appears below at the same horizontal alignment.
2. **No popping** — nothing appears or disappears instantly. State changes use `t-fade-in` or CSS transitions. Exception: text content swaps (values, labels) change instantly.
3. **No cheap tells** — remove number input spinners, tap highlight colors, and visible focus rings. These scream "web app" not "app."
4. **Consistent spacing** — all spacing comes from `T.space.*`. Never introduce a one-off pixel value. If a new value is needed, add it to the scale first.
5. **Consistent borders** — card borders are `1px solid ${C.border}`. Active/expanded states use accent border. Never mix border widths or introduce raw border colors.
6. **Quiet transitions** — prefer opacity and color changes over position/scale. Only use transform for intentional emphasis (the expand icon's spring rotation). Movement should feel like breathing, not bouncing.
7. **Visual hierarchy through weight, not decoration** — use font weight and color contrast to create hierarchy. Avoid underlines, shadows, gradients, or decorative borders.

---

## 8. Opacity Tokens

| Token              | Value  | Usage                                |
|--------------------|--------|---------------------------------------|
| `opacity.disabled` | `0.35` | Disabled buttons, inactive prev/next  |

---

## 9. Iconography

| Context      | Icon | Notes                      |
|-------------|------|----------------------------|
| Brand/Logo   | 🟁   | Header + loading screen    |
| Library tab  | 📖   |                            |
| Sets tab     | 📋   |                            |
| Train tab    | ▶️   |                            |
| Progress tab | 📊   |                            |
| Settings tab | ⚙️   |                            |
| PR badge     | 🏆   |                            |
| Empty sets   | 🏋️   |                            |
| Train ready  | 🟁   |                            |
| Completion   | 🎉   |                            |
| Rest done    | 💪   |                            |
| Encouragement| 🔥 💪 🏆 | Tiered by session count |

### Muscle Group Icons
| Group     | Icon |
|-----------|------|
| Chest     | 🫁   |
| Back      | 🔙   |
| Shoulders | 💪   |
| Legs      | 🦵   |
| Arms      | 💪   |
| Core      | 🎯   |
| Glutes    | 🍑   |
