export const T = {
  color: {
    bg: "#0a0a0f", surface: "#12121c", border: "#1e1e2e",
    text: "#e8e8ef", textDim: "#6b6b80", textOnAccent: "#0a0a0f",
    accent: "#00e5c8", accentDim: "rgba(0,229,200,0.12)", accentBorder: "rgba(0,229,200,0.2)",
    pr: "#7c5cfc", prDim: "rgba(124,92,252,0.12)", prBorder: "rgba(124,92,252,0.2)",
    danger: "#ff4466", dangerDim: "rgba(255,68,102,0.12)", dangerBorder: "rgba(255,68,102,0.2)",
    youtube: "#ff4444", youtubeDim: "rgba(255,0,0,0.12)",
    overlay: "rgba(0,0,0,0.7)",
  },
  font: { body: `-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`, mono: `"SF Mono", "Fira Code", "Consolas", monospace` },
  fontSize: { hero: 48, timer: 40, icon: 36, stat: 28, statMd: 24, h1: 22, h2: 18, h3: 17, body: 15, bodySmall: 14, caption: 13, small: 12, xs: 11, xxs: 10, micro: 9 },
  fontWeight: { black: 900, heavy: 800, bold: 700, semi: 600, medium: 500 },
  letterSpacing: { tight: "-0.02em", label: "0.04em", uppercase: "0.05em" },
  space: { xs: 2, sm: 4, md: 6, base: 8, lg: 12, xl: 16, "2xl": 20, "3xl": 32, "4xl": 40 },
  radius: { sm: 2, base: 4, md: 6, lg: 8, xl: 12, full: 20 },
  size: { checkbox: 20, setColumn: 32, progressBar: 3, maxWidth: 480, tabIcon: 18, scrollList: 340 },
  z: { tabBar: 100, header: 50, modal: 200 },
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
  opacity: { disabled: 0.35 },
};

export const C = T.color;
