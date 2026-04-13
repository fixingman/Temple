# 🟁 Temple — Changelog

## v0.5 (Current)

### Training Flow
- Pre-fill weight/reps from last session
- Set-by-set flow: Log Set → auto 90s rest → REST DONE flash → next set
- Chunky centered inputs, completed sets as summary lines

### Exercise Library
- Expanded 24 → 50 exercises (25 weighted, 25 bodyweight, 36 strength, 14 mobility)
- New fields: `equipment` (weighted/bodyweight), `category` (strength/mobility)
- Grouped filter bar: muscle pills (solid) | separator | equipment toggle (outline) | separator | category toggle (outline)
- BW/MOB tags shown on exercise cards
- Data migration: backfills equipment/category on load, merges new default exercises
- Added: Push-up, Pull-up, Dip, Lunge, Pistol Squat, Dead Hang, Cat-Cow, Thoracic Rotation, Hip Circle, 90/90 Hip Stretch, World's Greatest Stretch, and more

### Progress & Stats
- Replaced day streak with weekly consistency (THIS WEEK + WEEKS ACTIVE X/4)
- Muscle group volume breakdown (💪 Muscles tab, horizontal bars)
- Per-exercise progress chart (inline expanding PR cards with recharts line chart + session log)
- Repeat session from history (▶ Repeat This Workout)
- Muscle activation highlight in set creator (teal pills for covered groups)
- PR cards: accordion expand with spring-eased +/× icon, no content shift
- PRs count moved to volume card, no longer in stat grid
- Encouragement copy aligned with philosophy: quiet, acknowledging, no emojis or exclamation marks

### Motion & Polish
- Loading screen: 🟁 spring spin (0.6s) + staggered text fade-in, 1.2s minimum splash
- CSS animation system: t-logo-spin, t-text-in, t-fade-in, t-scale-in, t-pulse
- Easing curves tokenised: default, enter, exit, spring
- All `transition: all` replaced with specific properties
- Confirm dialogs: backdrop fade + modal scale-in
- Rest timer/flash/completion screen fade in
- Saving indicator: pulsing dot, no text, absolute-positioned
- Number input spinners hidden, tap highlights removed
- Header centered

### UX
- Sets page: ghost "+ New Set" when sets exist, hidden in empty state
- Exercise create/edit: equipment + category segmented toggles

### Infrastructure
- ErrorBoundary wraps entire app
- Save loading state (saving boolean in useAppData)
- runDataTests() for CI (not user-facing)
- GlobalStyles component for keyframes + CSS resets
- Data migration on load for backward compatibility
- Product philosophy documented (research-backed, PRODUCT.md)
- Premium quality principles documented (DESIGN.md Section 7.6)

---

## v0.4
- PWA: service worker, manifest, Apple meta tags, install prompt (sandbox-safe)
- Bug fixes: delete exercise cleans PRs, bare catch blocks, C.overlay self-reference

## v0.3
- Custom exercise CRUD (cascades to sets + PRs)
- Exercise reordering (▲▼), Settings tab (units, export/import, reset)

## v0.2
- Design token system (T object, DESIGN.md), rebranded to Temple (🟁), 9 bug fixes

## v0.1
- Exercise library, workout sets, session player, PR detection, progress dashboard
