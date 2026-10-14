// Shortcuts is the bridge from the PWA to Health on an iPhone or iPad.
// Only the workout duration is sent; Temple's exercise history stays local.
export const HEALTH_SHORTCUT_NAME = "Temple Health";

export function isAppleMobile() {
  return /iPhone|iPad|iPod/.test(navigator.userAgent)
    || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

export function healthShortcutUrl(session) {
  if (!session || !Number.isFinite(session.duration) || session.duration <= 0) return null;
  const payload = JSON.stringify({ durationMinutes: Number((session.duration / 60).toFixed(2)) });
  return `shortcuts://run-shortcut?name=${encodeURIComponent(HEALTH_SHORTCUT_NAME)}&input=text&text=${encodeURIComponent(payload)}`;
}
