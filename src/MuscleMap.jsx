import { C } from "./tokens";

// #1a1a1a — body parts that aren't muscle zones (head, forearms, shins)
const NEUTRAL = "#1a1a1a";

function muscleFill(name, highlighted, volume, maxVol) {
  if (highlighted) return highlighted === name ? C.accent : C.border;
  if (!volume || !volume[name]) return C.border;
  const ratio = volume[name] / maxVol;
  if (ratio > 0.66) return C.accent;
  if (ratio > 0.33) return "rgba(200,255,0,0.5)";
  return "rgba(200,255,0,0.2)";
}

// viewBox: 0 0 150 175  (front figure 0–65, gap, back figure 85–150)
export function MuscleMap({ highlighted, volume, size = 100 }) {
  const maxVol = volume ? Math.max(...Object.values(volume), 1) : 1;
  const f = (m) => muscleFill(m, highlighted, volume, maxVol);

  const h = Math.round(size * 175 / 150);

  return (
    <svg
      viewBox="0 0 150 175"
      width={size}
      height={h}
      style={{ display: "block", margin: "0 auto" }}
      aria-hidden="true"
    >
      {/* ── FRONT FIGURE (x 0–65, centered at 32) ── */}

      {/* Head + neck — neutral, not a muscle zone */}
      <circle cx="32" cy="12" r="10" fill={NEUTRAL} />
      <rect x="28" y="22" width="8" height="7" rx="1" fill={NEUTRAL} />

      {/* Shoulders (front deltoid) — shoulder caps, overlap arm tops */}
      <ellipse cx="11" cy="33" rx="10" ry="7" fill={f("Shoulders")} />
      <ellipse cx="53" cy="33" rx="10" ry="7" fill={f("Shoulders")} />

      {/* Chest — upper torso block */}
      <rect x="16" y="28" width="32" height="20" rx="4" fill={f("Chest")} />

      {/* Arms — biceps (upper arm front) */}
      <rect x="1" y="28" width="11" height="26" rx="5" fill={f("Arms")} />
      <rect x="52" y="28" width="11" height="26" rx="5" fill={f("Arms")} />

      {/* Forearms — neutral */}
      <rect x="2" y="56" width="9" height="20" rx="4" fill={NEUTRAL} />
      <rect x="53" y="56" width="9" height="20" rx="4" fill={NEUTRAL} />

      {/* Core — mid-torso */}
      <rect x="19" y="50" width="26" height="24" rx="4" fill={f("Core")} />

      {/* Hips — neutral connector between torso and legs */}
      <rect x="16" y="75" width="32" height="10" rx="3" fill={NEUTRAL} />

      {/* Legs — quads (front thigh) */}
      <rect x="16" y="87" width="14" height="44" rx="6" fill={f("Legs")} />
      <rect x="33" y="87" width="14" height="44" rx="6" fill={f("Legs")} />

      {/* Shins — neutral */}
      <rect x="16" y="133" width="14" height="34" rx="6" fill={NEUTRAL} />
      <rect x="33" y="133" width="14" height="34" rx="6" fill={NEUTRAL} />


      {/* ── BACK FIGURE (translate 85 — same inner coords) ── */}
      <g transform="translate(85, 0)">
        {/* Head + neck — neutral */}
        <circle cx="32" cy="12" r="10" fill={NEUTRAL} />
        <rect x="28" y="22" width="8" height="7" rx="1" fill={NEUTRAL} />

        {/* Shoulders (rear deltoid) */}
        <ellipse cx="11" cy="33" rx="10" ry="7" fill={f("Shoulders")} />
        <ellipse cx="53" cy="33" rx="10" ry="7" fill={f("Shoulders")} />

        {/* Back — traps (top-center) + lats (wider block below) */}
        <rect x="20" y="28" width="24" height="10" rx="3" fill={f("Back")} />
        <rect x="14" y="39" width="36" height="34" rx="4" fill={f("Back")} />

        {/* Arms — triceps (upper arm back) */}
        <rect x="1" y="28" width="11" height="26" rx="5" fill={f("Arms")} />
        <rect x="52" y="28" width="11" height="26" rx="5" fill={f("Arms")} />

        {/* Forearms — neutral */}
        <rect x="2" y="56" width="9" height="20" rx="4" fill={NEUTRAL} />
        <rect x="53" y="56" width="9" height="20" rx="4" fill={NEUTRAL} />

        {/* Glutes */}
        <rect x="16" y="75" width="32" height="16" rx="8" fill={f("Glutes")} />

        {/* Legs — hamstrings (back thigh) */}
        <rect x="16" y="93" width="14" height="38" rx="6" fill={f("Legs")} />
        <rect x="33" y="93" width="14" height="38" rx="6" fill={f("Legs")} />

        {/* Shins — neutral */}
        <rect x="16" y="133" width="14" height="34" rx="6" fill={NEUTRAL} />
        <rect x="33" y="133" width="14" height="34" rx="6" fill={NEUTRAL} />
      </g>
    </svg>
  );
}
