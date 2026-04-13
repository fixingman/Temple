import { useState, useEffect, useCallback } from 'react';
import { get, set } from 'idb-keyval';
import { STORAGE_KEY, DEFAULT_SETTINGS, DEFAULT_EXERCISES, mkDefault } from './data';

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
