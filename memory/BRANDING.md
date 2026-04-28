# 🟁 Temple — Branding Research

Status: **Initial exploration complete. Full implementation pending.**

---

## The Concept

"Your body is a temple." The brand doesn't need to show a temple building — it needs to feel like what Temple *means*: strength, discipline, something sacred and personal.

**The mark**: A pyramid of three horizontal bars, cut vertically through the center by a negative space T.

Triple reading:
- **Training pyramid** — the actual methodology. Wide base = volume, narrow peak = intensity
- **Barbell plates** — the vertical cut reads as the bar running through stacked plates
- **T for Temple** — the T is found in negative space, not forced as a monogram

This is the Pentagram move: one shape, multiple simultaneous true readings.

---

## Icon Exploration Journey

**What we rejected and why:**

| Direction | Why rejected |
|-----------|--------------|
| Classical Greek temple facade (pillars + pediment) | Reads as bank, government building, ancient history — not fitness |
| T monogram + pillars | Decorative, not conceptual |
| Gateway/arch | Too abstract, loses the fitness connection |
| Diamond/gem | Too jewellery-brand |
| Shield + flame | Leans gaming/esports |
| 4-bar pyramid with opacity fade | Better, but still purely decorative — no concept |

**What we landed on:**
3-bar pyramid, flat-ended bars, negative space T cut through all bars. Inspired by Pentagram's approach of finding the idea before the aesthetic.

---

## Design Principles (from research)

**Pentagram's approach (primary inspiration):**
- Concept before aesthetic — the form emerges from meaning
- One strong idea, expressed purely geometrically
- Marks that have a double or triple reading
- Confidence through reduction — nothing decorative
- The silhouette must work at stamp size (16px)
- Mathematical precision — module-based spacing, not guessing

**2025/2026 icon trends (supporting research):**
- Dynamic minimalism: simplified iconography with bold color contrast
- Single dominant element over complex compositions
- Must read at 16px and 1024px equally
- Design for dark and light contexts from the start
- Bold geometric icons: strong grids, consistent proportions

---

## Current Icon

File: `public/icon.svg`

```
3 bars, flat-ended (rx=0)
Module = 12px (bar height = gap = 12px)
Stack height = 60px, centered in 100×100
Bar widths: 32 / 54 / 76 (step = 22px, centered at x=50)
T cut: 8px wide, centered at x=50 (x=46 to x=54)
Background: #0a0a0f (rx=20)
Mark: #00e5c8
```

Works on: dark bg (primary) · teal bg · light bg · white mark on dark

---

## What's Pending

Full branding implementation — this is a separate milestone. When we do it:

**Identity system to build:**
- Wordmark — custom or selected typeface for "TEMPLE" or "🟁 Temple"
- Lockup — icon + wordmark horizontal and stacked
- Color system — primary, secondary, backgrounds (already in tokens.js)
- Typography — consider a display/heading typeface beyond system sans
- Motion identity — how the mark animates (splash screen, loading, transitions)
- App icon PNGs — generate 192×192 and 512×512 from the SVG for manifest.json

**Look & feel audit:**
- Current UI uses system sans throughout — consider a branded typeface
- Header "🟁 TEMPLE" logotype — refine the lockup
- Bottom nav icons — currently emoji, could be custom SVG glyphs
- Empty states — currently emoji, could use the mark
- Completion screen — branded moment, currently generic

**References to revisit:**
- Pentagram portfolio — especially fitness/health/lifestyle identity work
- Whoop, Strava, Whoop — premium fitness app aesthetics
- Architectural/geometric brands: Montblanc, Bang & Olufsen — restraint + precision
