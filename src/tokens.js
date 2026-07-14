// Single source of truth for the app version.
// public/sw.js cache names are kept in sync by scripts/sync-version.mjs (runs on prebuild).
export const APP_VERSION = "1.4";

// Theme palettes — the only place literal theme colors live. GlobalStyles emits these
// as `--c-*` CSS variables per `:root[data-theme]`; T.color values below are var()
// references, so every existing inline-style call site resolves live on theme switch.
export const PALETTES = {
  dark: {
    bg: "#000000", surface: "#111111", border: "#222222",
    text: "#ffffff", textDim: "#666666", textOnAccent: "#000000",
    accent: "#c8ff00", accentDim: "rgba(200,255,0,0.10)", accentBorder: "rgba(200,255,0,0.25)",
    accentMid: "rgba(200,255,0,0.35)", accentSoft: "rgba(200,255,0,0.5)", accentFaint: "rgba(200,255,0,0.2)",
    pr: "#ffffff", prDim: "rgba(255,255,255,0.08)", prBorder: "rgba(255,255,255,0.20)",
    danger: "#ff4455", dangerDim: "rgba(255,68,85,0.12)", dangerBorder: "rgba(255,68,85,0.20)",
    youtube: "#ff4444", youtubeDim: "rgba(255,0,0,0.12)",
    overlay: "rgba(0,0,0,0.85)",
    videoOverlay: "rgba(0,0,0,0.7)",
    inputBg: "#181818",
    mapNeutral: "#1a1a1a",
  },
  light: {
    bg: "#f5f5f4", surface: "#ffffff", border: "#e0e0de",
    text: "#1a1a1a", textDim: "#8a8a86", textOnAccent: "#ffffff",
    accent: "#5f7d00", accentDim: "rgba(95,125,0,0.10)", accentBorder: "rgba(95,125,0,0.30)",
    accentMid: "rgba(95,125,0,0.30)", accentSoft: "rgba(95,125,0,0.45)", accentFaint: "rgba(95,125,0,0.15)",
    pr: "#1a1a1a", prDim: "rgba(0,0,0,0.06)", prBorder: "rgba(0,0,0,0.18)",
    danger: "#d92638", dangerDim: "rgba(217,38,56,0.10)", dangerBorder: "rgba(217,38,56,0.25)",
    youtube: "#e02222", youtubeDim: "rgba(224,34,34,0.10)",
    overlay: "rgba(0,0,0,0.45)",
    videoOverlay: "rgba(0,0,0,0.7)",
    inputBg: "#efefed",
    mapNeutral: "#e2e2e0",
  },
};

// T.color keys mirror the palette keys; values are live CSS variable references.
const colorVars = Object.fromEntries(
  Object.keys(PALETTES.dark).map((k) => [k, `var(--c-${k})`])
);

export const T = {
  color: colorVars,
  font: {
    body: `"Space Grotesk", system-ui, sans-serif`,
    mono: `"DM Mono", "SF Mono", "Fira Code", monospace`,
  },
  fontSize: { display: 72, hero: 48, timer: 40, icon: 36, stat: 28, statMd: 24, h1: 22, h2: 18, h3: 17, body: 15, bodySmall: 14, caption: 13, small: 12, xs: 11, xxs: 10, micro: 9 },
  fontWeight: { black: 700, heavy: 700, bold: 700, semi: 600, medium: 500 },
  letterSpacing: { tight: "-0.03em", label: "0.08em", uppercase: "0.08em" },
  space: { xs: 2, sm: 4, md: 6, base: 8, lg: 12, xl: 16, "2xl": 20, "3xl": 32, "4xl": 40 },
  radius: { sm: 2, base: 4, md: 6, lg: 10, xl: 10, full: 9999 },
  size: { checkbox: 20, setColumn: 32, progressBar: 3, maxWidth: 480, tabIcon: 22, scrollList: 340, iconBtn: 28 },
  z: { tabBar: 100, header: 50, modal: 200, toast: 300 },
  // Framer Motion spring presets — pass as `transition` prop
  motion: {
    snap:    { type: "spring", stiffness: 500, damping: 35 },
    default: { type: "spring", stiffness: 400, damping: 30 },
    gentle:  { type: "spring", stiffness: 250, damping: 28 },
  },
  easing: {
    default: "cubic-bezier(0.4, 0, 0.2, 1)",
    enter: "cubic-bezier(0, 0, 0.2, 1)",
    exit: "cubic-bezier(0.4, 0, 1, 1)",
    spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  },
  duration: { fast: "0.15s", medium: "0.25s", slow: "0.35s" },
  transition: {
    fast: "0.15s cubic-bezier(0.4, 0, 0.2, 1)",
    medium: "0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    slow: "0.35s cubic-bezier(0.4, 0, 0.2, 1)",
    spring: "0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
    enter: "0.25s cubic-bezier(0, 0, 0.2, 1)",
    exit: "0.2s cubic-bezier(0.4, 0, 1, 1)",
  },
  opacity: { disabled: 0.35, muted: 0.6, subtle: 0.5 },
};

export const C = T.color;

// Style shorthands — reduce JSX verbosity
export const S = {
  col:     (gap = T.space.xl) => ({ display: "flex", flexDirection: "column", gap }),
  row:     (gap = T.space.base, align = "center") => ({ display: "flex", gap, alignItems: align }),
  between: (gap = 0) => ({ display: "flex", justifyContent: "space-between", alignItems: "center", gap: gap || undefined }),
  label:   { fontSize: T.fontSize.small, color: T.color.textDim, fontWeight: T.fontWeight.bold, textTransform: "uppercase", letterSpacing: T.letterSpacing.label },
  title:   { fontSize: T.fontSize.body, fontWeight: T.fontWeight.bold },
  mono:    { fontFamily: T.font.mono },
  ellipsis:{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
};
