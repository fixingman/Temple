import { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { get, set } from 'idb-keyval';
import { STORAGE_KEY, DEFAULT_SETTINGS, DEFAULT_EXERCISES, mkDefault } from './data';
import { PALETTES } from './tokens';

// Applies the theme to <html data-theme> and keeps <meta name="theme-color"> in sync.
// themeSetting: "dark" | "light" | "system". "system" tracks prefers-color-scheme live.
export function useTheme(themeSetting) {
  const [resolved, setResolved] = useState(() =>
    themeSetting === 'system' || !themeSetting
      ? (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
      : themeSetting
  );

  // Layout effect: data-theme must be set before first paint or the initial frame
  // renders with unresolved --c-* variables (broken colors for one frame).
  useLayoutEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const apply = () => {
      const theme = themeSetting === 'system' || !themeSetting
        ? (mq.matches ? 'light' : 'dark')
        : themeSetting;
      document.documentElement.dataset.theme = theme;
      // Static media-query metas from index.html would fight the manual override —
      // collapse to one JS-owned meta (media attr must go or the meta is ignored
      // whenever its query doesn't match).
      document.querySelectorAll('meta[name="theme-color"]').forEach((m, i) => { if (i > 0) m.remove(); });
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) { meta.removeAttribute('media'); meta.setAttribute('content', PALETTES[theme].bg); }
      setResolved(theme);
    };
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [themeSetting]);

  return resolved;
}

export function useAppData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const minSplash = new Promise(r => setTimeout(r, 1200));
      let loaded;
      try {
        const raw = await get(STORAGE_KEY);
        if (raw) {
          const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
          if (!parsed.settings) parsed.settings = DEFAULT_SETTINGS;
          // Backfill any missing settings keys
          Object.keys(DEFAULT_SETTINGS).forEach(k => {
            if (parsed.settings[k] === undefined) parsed.settings[k] = DEFAULT_SETTINGS[k];
          });
          // Migrate: backfill equipment/category
          const defaultMap = {};
          DEFAULT_EXERCISES.forEach(e => { defaultMap[e.id] = e; });
          parsed.exercises = parsed.exercises.map(e => {
            if (!e.equipment || !e.category) {
              const def = defaultMap[e.id];
              return { ...e, equipment: e.equipment || def?.equipment || "weighted", category: e.category || def?.category || "strength" };
            }
            return e;
          });
          // Merge new defaults
          const existingIds = new Set(parsed.exercises.map(e => e.id));
          DEFAULT_EXERCISES.forEach(de => {
            if (!existingIds.has(de.id)) parsed.exercises.push(de);
          });
          loaded = parsed;
        } else {
          loaded = mkDefault();
        }
      } catch (e) {
        loaded = mkDefault();
      }
      await minSplash;
      setData(loaded);
      setLoading(false);
    })();
  }, []);

  const save = useCallback(async (newData) => {
    setData(newData);
    setSaving(true);
    try { await set(STORAGE_KEY, newData); } catch (e) { console.error(e); }
    setSaving(false);
  }, []);

  return { data, loading, saving, save };
}

export function usePWA() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handler = (e) => { e.preventDefault(); setInstallPrompt(e); };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const install = async () => {
    if (!installPrompt) return;
    try {
      installPrompt.prompt();
      const r = await installPrompt.userChoice;
      if (r.outcome === 'accepted') setInstallPrompt(null);
    } catch (e) { /* ignore */ }
  };
  const dismiss = () => { setDismissed(true); setInstallPrompt(null); };

  return { canInstall: !!installPrompt && !dismissed, install, dismiss };
}
