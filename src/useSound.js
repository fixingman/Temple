import { useCallback, useRef } from "react";
import { get, set } from "idb-keyval";
import { useState, useEffect } from "react";

const STORAGE_KEY = "temple-sound";

// Lazily creates Tone.js synths on first use — AudioContext must start after a user gesture.
let toneReady = false;
let synths = null;

async function initTone() {
  if (toneReady) return;
  const Tone = await import("tone");
  await Tone.start();
  synths = {
    membrane: new Tone.MembraneSynth({ envelope: { attack: 0.001, decay: 0.04, sustain: 0, release: 0.1 } }).toDestination(),
    metal:    new Tone.MetalSynth({ envelope: { attack: 0.001, decay: 0.08, release: 0.05 } }).toDestination(),
    pluck:    new Tone.PluckSynth().toDestination(),
    synth:    new Tone.Synth({ oscillator: { type: "sine" }, envelope: { attack: 0.01, decay: 0.1, sustain: 0.3, release: 0.4 } }).toDestination(),
  };
  // Keep volumes tasteful
  synths.membrane.volume.value = -12;
  synths.metal.volume.value    = -16;
  synths.pluck.volume.value    = -14;
  synths.synth.volume.value    = -18;
  toneReady = true;
}

const SOUNDS = {
  logSet: async () => {
    synths.membrane.triggerAttackRelease("C2", "32n");
  },
  restDone: async () => {
    const Tone = await import("tone");
    const now = Tone.now();
    synths.metal.triggerAttackRelease("E4", "16n", now);
    synths.metal.triggerAttackRelease("G4", "16n", now + 0.09);
  },
  pr: async () => {
    const Tone = await import("tone");
    const now = Tone.now();
    synths.pluck.triggerAttackRelease("C4", "8n", now);
    synths.pluck.triggerAttackRelease("E4", "8n", now + 0.08);
    synths.pluck.triggerAttackRelease("G4", "8n", now + 0.16);
  },
  sessionDone: async () => {
    const Tone = await import("tone");
    const now = Tone.now();
    synths.synth.triggerAttackRelease("C3", "8n", now);
    synths.synth.triggerAttackRelease("E3", "8n", now + 0.12);
    synths.synth.triggerAttackRelease("G3", "4n", now + 0.24);
  },
};

export function useSound() {
  const [enabled, setEnabled] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    get(STORAGE_KEY).then(v => { if (v) setEnabled(true); });
  }, []);

  const toggle = useCallback(async () => {
    const next = !enabled;
    setEnabled(next);
    await set(STORAGE_KEY, next);
  }, [enabled]);

  const play = useCallback(async (event) => {
    if (!enabled) return;
    if (!initialized.current) {
      await initTone();
      initialized.current = true;
    }
    if (!toneReady || !SOUNDS[event]) return;
    try { await SOUNDS[event](); } catch { /* audio context may be suspended */ }
  }, [enabled]);

  return { play, enabled, toggle };
}
