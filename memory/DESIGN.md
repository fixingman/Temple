# 🟁 Temple — Design System

All visual decisions live in `T` (tokens.js). No magic numbers in components.

## Colors (`T.color` / `C`)
```
bg           #0a0a0f      Page background
surface      #12121c      Cards, tab bar
border       #1e1e2e      Card/input borders
text         #e8e8ef      Primary text
textDim      #6b6b80      Labels, secondary
textOnAccent #0a0a0f      Text on accent buttons

accent       #00e5c8      Primary buttons, active tabs, logo
accentDim    rgba(0,229,200,0.12)
accentBorder rgba(0,229,200,0.2)

pr           #7c5cfc      PR badges, est1RM
prDim        rgba(124,92,252,0.12)
prBorder     rgba(124,92,252,0.2)

danger       #ff4466      Delete, cancel
dangerDim    rgba(255,68,102,0.12)
dangerBorder rgba(255,68,102,0.2)

youtube      #ff4444      YouTube button
youtubeDim   rgba(255,0,0,0.12)
overlay      rgba(0,0,0,0.7)  Modal backdrop
```

## Typography
Fonts: `body` = system sans · `mono` = SF Mono/Fira Code

Sizes (px): `micro=9 xxs=10 xs=11 small=12 caption=13 bodySmall=14 body=15 h3=17 h2=18 h1=22 statMd=24 stat=28 icon=36 timer=40 hero=48`

Weights: `black=900 heavy=800 bold=700 semi=600 medium=500`

Letter spacing: `tight=-0.02em label=0.04em uppercase=0.05em`

## Spacing (`T.space`)
`xs=2 sm=4 md=6 base=8 lg=12 xl=16 2xl=20 3xl=32 4xl=40`

## Radius (`T.radius`)
`sm=2 base=4 md=6 lg=8 xl=12 full=20`

## Sizing (`T.size`)
`checkbox=20 setColumn=32 progressBar=3 maxWidth=480 tabIcon=18 scrollList=340`

## Z-index: `tabBar=100 header=50 modal=200`
## Opacity: `disabled=0.35`

## Motion
Easing: `default=cubic-bezier(0.4,0,0.2,1) enter=(0,0,0.2,1) exit=(0.4,0,1,1) spring=(0.34,1.56,0.64,1)`

Durations: `fast=0.15s medium=0.25s slow=0.35s`

Composed: `T.transition.fast/medium/slow/spring/enter/exit`

CSS animations: `t-logo-spin` (splash) · `t-text-in` (splash text) · `t-fade-in` (elements) · `t-scale-in` (modals) · `t-pulse` (save dot)

## Quality Principles
1. No content shifting on expand/collapse
2. Nothing appears instantly — use `t-fade-in` or transitions
3. No number spinners, no tap highlights, no focus rings
4. All spacing from `T.space.*` — no one-off values
5. Card borders: `1px solid ${C.border}` — active state uses accent border
6. Prefer opacity/color transitions over position/scale
7. Hierarchy via font weight + color contrast — no shadows, gradients, decorative borders

## Iconography
Brand: 🟁 · Tabs: 📖📋▶️📊⚙️ · PR: 🏆 · Completion: 🎉 · Rest done: 💪
Muscles: Chest=🫁 Back=🔙 Shoulders/Arms=💪 Legs=🦵 Core=🎯 Glutes=🍑
