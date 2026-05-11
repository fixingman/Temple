import { useState, useEffect, useCallback, useRef } from "react";
import { T, C } from "../tokens";
import { DEFAULT_REST, uid, fmt, displayWeight, toKg, weightLabel } from "../data";
import { Card, Btn, ConfirmDialog, YTButton } from "../components";
import { coachError, prompts } from "../useCoach";

// ─── Recovery / Body Check Sheet ───
const BODY_AREAS = [
  "Neck", "Shoulder", "Upper back", "Lower back",
  "Chest", "Elbow", "Wrist", "Hip",
  "Glute", "Quad", "Hamstring", "Knee", "Calf", "Ankle",
];

function RecoverySheet({ onClose, recentExercises = [], coach, onGoToSettings }) {
  const [area, setArea] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const consult = useCallback(async () => {
    if (!area || !description.trim()) return;
    setLoading(true); setError(""); setResult("");
    const { text, error: err } = await coach.ask(
      prompts.bodyCheck(area, description.trim(), recentExercises),
      { maxTokens: 800, model: "claude-sonnet-4-6" }
    );
    if (err) setError(coachError(err));
    else setResult(text);
    setLoading(false);
  }, [area, description, coach, recentExercises]);

  const renderResult = (text) => text.split("\n").map((line, i) => {
    // Strip any real HTML tags first, then apply our safe bold replacement
    const safe = line.replace(/<[^>]*>/g, "");
    const html = safe.replace(/\*\*(.*?)\*\*/g, (_, m) => `<strong>${m}</strong>`);
    return <p key={i} style={{ margin: `0 0 ${T.space.base}px`, lineHeight: 1.6, fontSize: T.fontSize.bodySmall }} dangerouslySetInnerHTML={{ __html: html }} />;
  });

  const noKey = !coach.hasKey;

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: C.overlay, zIndex: T.z.modal + 10, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <div className="t-slide-up" onClick={e => e.stopPropagation()} style={{ background: C.surface, borderRadius: `${T.radius.xl}px ${T.radius.xl}px 0 0`, maxHeight: "92vh", display: "flex", flexDirection: "column" }}>

        {/* Header */}
        <div style={{ padding: `${T.space.xl}px ${T.space.xl}px ${T.space.base}px`, borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: T.fontSize.body, fontWeight: T.fontWeight.bold }}>Body Check</div>
              <div style={{ fontSize: T.fontSize.xs, color: C.textDim, marginTop: 2 }}>Post-training discomfort guidance</div>
            </div>
            <button onClick={onClose} style={{ background: C.bg, border: "none", color: C.textDim, cursor: "pointer", borderRadius: T.radius.full, width: 28, height: 28, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: T.space.xl }}>
          {noKey ? (
            <div style={{ display: "flex", flexDirection: "column", gap: T.space.xl, paddingTop: T.space.xl }}>
              <div style={{ background: C.bg, borderRadius: T.radius.xl, padding: T.space["2xl"], textAlign: "center" }}>
                <div style={{ fontSize: T.fontSize.h3, fontWeight: T.fontWeight.bold, marginBottom: T.space.base }}>API Key Required</div>
                <div style={{ fontSize: T.fontSize.bodySmall, color: C.textDim, lineHeight: 1.6, marginBottom: T.space.xl }}>
                  Body Check uses Claude AI. Add your own Anthropic API key in Settings — your key stays on your device and is sent directly to Anthropic.
                </div>
                <Btn variant="secondary" onClick={() => { onClose(); onGoToSettings?.(); }} style={{ width: "100%" }}>Go to Settings to add key</Btn>
              </div>
              <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer" style={{ textAlign: "center", fontSize: T.fontSize.xs, color: C.textDim, textDecoration: "none" }}>
                Get a free API key at console.anthropic.com →
              </a>
            </div>
          ) : !result ? (
            <div style={{ display: "flex", flexDirection: "column", gap: T.space.xl }}>
              <div>
                <label style={{ fontSize: T.fontSize.small, color: C.textDim, fontWeight: T.fontWeight.semi, textTransform: "uppercase", letterSpacing: T.letterSpacing.uppercase, display: "block", marginBottom: T.space.base }}>Where does it hurt?</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: T.space.sm }}>
                  {BODY_AREAS.map(a => (
                    <button key={a} onClick={() => setArea(a)} style={{ border: `1px solid ${area === a ? C.accent : C.border}`, borderRadius: T.radius.full, padding: "6px 14px", fontSize: T.fontSize.small, fontWeight: T.fontWeight.semi, cursor: "pointer", background: area === a ? C.accentDim : "transparent", color: area === a ? C.accent : C.textDim, transition: `all ${T.transition.fast}` }}>{a}</button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: T.fontSize.small, color: C.textDim, fontWeight: T.fontWeight.semi, textTransform: "uppercase", letterSpacing: T.letterSpacing.uppercase, display: "block", marginBottom: T.space.base }}>Describe what you're feeling</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g. sharp pain when I extend my arm, started during the last set of bench press..." rows={4}
                  style={{ width: "100%", boxSizing: "border-box", background: C.bg, border: `1px solid ${C.border}`, borderRadius: T.radius.lg, padding: "12px 14px", color: C.text, fontSize: T.fontSize.h3, outline: "none", resize: "none", fontFamily: "inherit", lineHeight: 1.5 }} />
              </div>

              {recentExercises.length > 0 && (
                <div style={{ background: C.bg, borderRadius: T.radius.lg, padding: "10px 14px" }}>
                  <div style={{ fontSize: T.fontSize.xs, color: C.textDim, marginBottom: T.space.xs }}>From your last session</div>
                  <div style={{ fontSize: T.fontSize.small, color: C.textDim }}>{recentExercises.join(", ")}</div>
                </div>
              )}

              {error && <div style={{ background: C.dangerDim, border: `1px solid ${C.dangerBorder}`, borderRadius: T.radius.lg, padding: "10px 14px", fontSize: T.fontSize.small, color: C.danger }}>{error}</div>}

              <Btn onClick={consult} disabled={!area || !description.trim() || loading} style={{ width: "100%", padding: 14 }}>
                {loading ? "Getting guidance..." : "Get Guidance"}
              </Btn>

              <p style={{ fontSize: T.fontSize.xs, color: C.textDim, textAlign: "center", margin: 0, lineHeight: 1.5 }}>
                General fitness guidance only — not medical advice. For serious pain, see a professional.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: T.space.xl }}>
              <div style={{ background: C.bg, borderRadius: T.radius.lg, padding: "10px 14px", display: "flex", gap: T.space.base }}>
                <span style={{ fontSize: T.fontSize.small, color: C.textDim }}>Area:</span>
                <span style={{ fontSize: T.fontSize.small, fontWeight: T.fontWeight.semi, color: C.accent }}>{area}</span>
              </div>
              <div style={{ color: C.text }}>{renderResult(result)}</div>
              <Btn variant="secondary" onClick={() => { setResult(""); setError(""); }} style={{ width: "100%" }}>Ask about another issue</Btn>
            </div>
          )}
        </div>

        <div style={{ height: "env(safe-area-inset-bottom)", background: C.surface, flexShrink: 0 }} />
      </div>
    </div>
  );
}



export function SessionPage({ data, save, activeSet, setActiveSet, setTab, coach }) {
  const [sessionData, setSessionData] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [currentSetIdx, setCurrentSetIdx] = useState(0);
  const [timer, setTimer] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [restTimer, setRestTimer] = useState(0);
  const [resting, setResting] = useState(false);
  const [restDone, setRestDone] = useState(false);
  const [finished, setFinished] = useState(false);
  const [newPRs, setNewPRs] = useState([]);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  const [showRecoveryMid, setShowRecoveryMid] = useState(false);
  const [mobCountdown, setMobCountdown] = useState(null); // null = idle, N = counting down
  const [mobRunning, setMobRunning] = useState(false);
  const intervalRef = useRef(null);
  const restRef = useRef(null);
  const mobRef = useRef(null);
  const unit = data.settings?.unit || "kg";
  const wl = weightLabel(unit);

  // Find last session for this set to pre-fill values
  const getLastSessionData = useCallback((setId) => {
    const lastSession = [...data.sessions].reverse().find(s => s.setId === setId);
    if (!lastSession) return null;
    const lookup = {};
    lastSession.entries.forEach(e => {
      if (e.sets.length > 0) {
        lookup[e.exerciseId] = e.sets.map(s => ({
          weight: String(displayWeight(s.weight, unit)),
          reps: String(s.reps),
        }));
      }
    });
    return lookup;
  }, [data.sessions, unit]);

  useEffect(() => {
    if (activeSet) {
      const validIds = activeSet.exerciseIds.filter(eid => data.exercises.some(e => e.id === eid));
      if (validIds.length === 0) { setActiveSet(null); return; }
      const lastData = getLastSessionData(activeSet.id);
      const entries = validIds.map(eid => {
        const prev = lastData?.[eid];
        if (prev) return { exerciseId: eid, sets: prev, logged: [] };
        return { exerciseId: eid, sets: [{ weight: "", reps: "" }], logged: [] };
      });
      setSessionData(entries);
      setCurrentIdx(0); setCurrentSetIdx(0); setTimer(0); setTimerRunning(true);
      setFinished(false); setNewPRs([]); setResting(false); setRestTimer(0); setRestDone(false);
    } else { setSessionData(null); setTimerRunning(false); }
  }, [activeSet]);

  useEffect(() => {
    if (timerRunning) { intervalRef.current = setInterval(() => setTimer(t => t + 1), 1000); }
    else clearInterval(intervalRef.current);
    return () => clearInterval(intervalRef.current);
  }, [timerRunning]);

  useEffect(() => {
    if (resting) {
      restRef.current = setInterval(() => {
        setRestTimer(t => {
          if (t <= 1) { setResting(false); setRestDone(true); return 0; }
          return t - 1;
        });
      }, 1000);
    } else clearInterval(restRef.current);
    return () => clearInterval(restRef.current);
  }, [resting]);

  // Auto-dismiss "REST DONE" after 3 seconds
  useEffect(() => {
    if (restDone) {
      const t = setTimeout(() => setRestDone(false), 3000);
      return () => clearTimeout(t);
    }
  }, [restDone]);

  // Mobility countdown — ticks down, auto-logs at 0
  useEffect(() => {
    if (mobRunning) {
      mobRef.current = setInterval(() => {
        setMobCountdown(t => {
          if (t <= 1) {
            setMobRunning(false);
            return 0; // logMobility called via separate effect when mobRunning→false at 0
          }
          return t - 1;
        });
      }, 1000);
    } else {
      clearInterval(mobRef.current);
    }
    return () => clearInterval(mobRef.current);
  }, [mobRunning]);

  // ── Empty state ──
  if (!activeSet) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: T.space.xl }}>
        <h2 style={{ fontSize: T.fontSize.h1, fontWeight: T.fontWeight.heavy, margin: 0 }}>Train</h2>
        <Card style={{ textAlign: "center", padding: T.space["4xl"] }}>
          <div style={{ fontSize: T.fontSize.icon, marginBottom: T.space.lg }}>🟁</div>
          <div style={{ fontWeight: T.fontWeight.bold, fontSize: T.fontSize.body, marginBottom: T.space.sm }}>Ready to train?</div>
          <div style={{ color: C.textDim, fontSize: T.fontSize.caption, marginBottom: T.space.xl }}>Pick a workout set to begin</div>
          <Btn onClick={() => setTab("sets")}>Go to Sets</Btn>
        </Card>
        {data.sessions.length > 0 && (
          <div>
            <h3 style={{ fontSize: T.fontSize.bodySmall, fontWeight: T.fontWeight.bold, color: C.textDim, marginBottom: T.space.base, textTransform: "uppercase", letterSpacing: T.letterSpacing.uppercase }}>Recent Sessions</h3>
            {data.sessions.slice(-3).reverse().map(s => {
              const set = data.sets.find(ws => ws.id === s.setId);
              return <Card key={s.id} style={{ marginBottom: T.space.base }}><div style={{ display: "flex", justifyContent: "space-between" }}><div style={{ fontWeight: T.fontWeight.bold }}>{set?.name || "Deleted Set"}</div><div style={{ fontSize: T.fontSize.small, color: C.textDim }}>{fmtDate(s.date)}</div></div><div style={{ fontSize: T.fontSize.small, color: C.textDim, marginTop: T.space.sm }}>{s.entries.length} exercises · {s.entries.reduce((a, e) => a + e.sets.length, 0)} sets</div></Card>;
            })}
          </div>
        )}
      </div>
    );
  }

  // ── Completion screen ──
  if (finished) {
    const totalSets = sessionData.reduce((a, e) => a + e.logged.length, 0);
    const totalVol = sessionData.reduce((a, e) => a + e.logged.reduce((b, s) => b + (Number(s.reps) || 0) * (Number(s.weight) || 0), 0), 0);
    const volDisplay = displayWeight(totalVol, unit);
    const completedExercises = sessionData
      .filter(e => e.logged.length > 0)
      .map(e => data.exercises.find(ex => ex.id === e.exerciseId)?.name)
      .filter(Boolean);
    return (
      <div className="t-fade-in" style={{ display: "flex", flexDirection: "column", gap: T.space.xl }}>
        {showRecovery && <RecoverySheet onClose={() => setShowRecovery(false)} recentExercises={completedExercises} coach={coach} onGoToSettings={() => { setActiveSet(null); setTab("settings"); }} />}
        <div style={{ textAlign: "center", padding: `${T.space["2xl"]}px 0` }}>
          <h2 style={{ fontSize: T.fontSize.statMd, fontWeight: T.fontWeight.heavy, margin: 0, color: C.accent }}>Workout Complete</h2>
          <p style={{ color: C.textDim, marginTop: T.space.sm }}>{activeSet.name} · {fmt(timer)}</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: T.space.base }}>
          <Card style={{ textAlign: "center" }}><div style={{ fontSize: T.fontSize.stat, fontWeight: T.fontWeight.heavy, color: C.accent }}>{totalSets}</div><div style={{ fontSize: T.fontSize.xs, color: C.textDim, fontWeight: T.fontWeight.semi }}>SETS</div></Card>
          <Card style={{ textAlign: "center" }}><div style={{ fontSize: T.fontSize.stat, fontWeight: T.fontWeight.heavy, color: C.accent }}>{volDisplay.toLocaleString()}</div><div style={{ fontSize: T.fontSize.xs, color: C.textDim, fontWeight: T.fontWeight.semi }}>VOLUME ({wl})</div></Card>
        </div>
        {newPRs.length > 0 && (
          <Card style={{ border: `1px solid ${C.pr}`, background: C.prDim }}>
            <div style={{ fontWeight: T.fontWeight.heavy, fontSize: T.fontSize.body, color: C.pr, marginBottom: T.space.base }}>🏆 New Personal Records</div>
            {newPRs.map((pr, i) => { const ex = data.exercises.find(e => e.id === pr.exerciseId); return <div key={i} style={{ fontSize: T.fontSize.caption, color: C.text, marginBottom: T.space.sm }}><strong>{ex?.name}</strong>: {pr.type === "weight" ? `${displayWeight(pr.value, unit)} ${wl}` : pr.type === "reps" ? `${pr.value} reps` : `${displayWeight(pr.value, unit)} ${wl} vol`}</div>; })}
          </Card>
        )}
        <Btn onClick={() => { setActiveSet(null); setTab("progress"); }} style={{ width: "100%", padding: 18 }}>View Progress</Btn>
        <Btn variant="secondary" onClick={() => setActiveSet(null)} style={{ width: "100%" }}>Done</Btn>
        <button onClick={() => setShowRecovery(true)} style={{ background: "none", border: "none", color: C.textDim, fontSize: T.fontSize.small, cursor: "pointer", padding: `${T.space.sm}px 0`, textAlign: "center" }}>Feeling pain or discomfort? →</button>
      </div>
    );
  }

  if (!sessionData) return null;
  const entry = sessionData[currentIdx];
  const exercise = data.exercises.find(e => e.id === entry.exerciseId);
  const prData = data.prs[entry.exerciseId];
  const isBodyweight = exercise?.equipment === "bodyweight";
  const isMobility = exercise?.category === "mobility";

  // Current set being edited (the pending one)
  const currentSet = currentSetIdx < entry.sets.length
    ? entry.sets[currentSetIdx]
    : { weight: entry.logged.length > 0 ? String(entry.logged[entry.logged.length - 1].weight) : "", reps: entry.logged.length > 0 ? String(entry.logged[entry.logged.length - 1].reps) : "" };

  const updateCurrentSet = (field, val) => {
    if (val !== "" && (isNaN(Number(val)) || Number(val) < 0)) return;
    const nd = [...sessionData];
    if (currentSetIdx < entry.sets.length) {
      nd[currentIdx] = { ...nd[currentIdx], sets: nd[currentIdx].sets.map((s, i) => i === currentSetIdx ? { ...s, [field]: val } : s) };
    } else {
      const newSets = [...nd[currentIdx].sets, { ...currentSet, [field]: val }];
      nd[currentIdx] = { ...nd[currentIdx], sets: newSets };
    }
    setSessionData(nd);
  };

  const logSet = () => {
    const w = Number(currentSet.weight);
    const r = Number(currentSet.reps);
    if (isBodyweight || isMobility) {
      if (!r || r <= 0) return;
    } else {
      if (!w || w <= 0 || !r || r <= 0) return;
    }
    const nd = [...sessionData];
    nd[currentIdx] = { ...nd[currentIdx], logged: [...nd[currentIdx].logged, { weight: w, reps: r }] };
    setSessionData(nd);
    setCurrentSetIdx(prev => prev + 1);
    setRestTimer(DEFAULT_REST);
    setResting(true);
    setRestDone(false);
  };

  const goNextExercise = () => {
    if (currentIdx < sessionData.length - 1) {
      setCurrentIdx(i => i + 1);
      setCurrentSetIdx(0);
      setResting(false); setRestTimer(0); setRestDone(false);
      setMobCountdown(null); setMobRunning(false);
    }
  };

  const finishSession = () => {
    const clean = sessionData.map(e => ({
      exerciseId: e.exerciseId,
      sets: e.logged.map(s => ({ reps: s.reps, weight: toKg(s.weight, unit) })),
    })).filter(e => e.sets.length > 0);
    if (clean.length === 0) { setActiveSet(null); return; }
    const prs = { ...data.prs }; const found = [];
    clean.forEach(e => {
      const maxW = Math.max(...e.sets.map(s => s.weight));
      const maxR = Math.max(...e.sets.map(s => s.reps));
      const vol = e.sets.reduce((a, s) => a + s.reps * s.weight, 0);
      const prev = prs[e.exerciseId] || { maxWeight: 0, maxReps: 0, maxVolume: 0 };
      if (maxW > prev.maxWeight) found.push({ exerciseId: e.exerciseId, type: "weight", value: maxW });
      if (maxR > prev.maxReps) found.push({ exerciseId: e.exerciseId, type: "reps", value: maxR });
      if (vol > prev.maxVolume) found.push({ exerciseId: e.exerciseId, type: "volume", value: vol });
      prs[e.exerciseId] = { maxWeight: Math.max(maxW, prev.maxWeight), maxReps: Math.max(maxR, prev.maxReps), maxVolume: Math.max(vol, prev.maxVolume), date: Date.now() };
    });
    save({ ...data, sessions: [...data.sessions, { id: uid(), setId: activeSet.id, date: Date.now(), duration: timer, entries: clean }], prs });
    setNewPRs(found); setTimerRunning(false); setFinished(true);
  };

  const isLastExercise = currentIdx >= sessionData.length - 1;
  const canLogCurrent = (isBodyweight || isMobility)
    ? Number(currentSet.reps) > 0
    : Number(currentSet.weight) > 0 && Number(currentSet.reps) > 0;

  // ── Training UI ──
  const midSessionExercises = sessionData
    .map(e => data.exercises.find(ex => ex.id === e.exerciseId)?.name)
    .filter(Boolean);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: T.space.xl }}>
      {showRecoveryMid && <RecoverySheet onClose={() => setShowRecoveryMid(false)} recentExercises={midSessionExercises} coach={coach} onGoToSettings={() => setTab("settings")} />}
      {confirmCancel && <ConfirmDialog message="Cancel this workout? All progress will be lost." onConfirm={() => { setActiveSet(null); setConfirmCancel(false); }} onCancel={() => setConfirmCancel(false)} confirmLabel="Cancel workout" cancelLabel="Keep going" />}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ fontSize: T.fontSize.h2, fontWeight: T.fontWeight.heavy, margin: 0 }}>{activeSet.name}</h2>
          <p style={{ color: C.textDim, fontSize: T.fontSize.small, margin: 0 }}>Exercise {currentIdx + 1} of {sessionData.length}</p>
        </div>
        <div style={{ display: "flex", gap: T.space.base, alignItems: "center" }}>
          <span style={{ fontFamily: T.font.mono, fontSize: T.fontSize.h2, fontWeight: T.fontWeight.bold, color: timerRunning ? C.accent : C.textDim }}>{fmt(timer)}</span>
          <button onClick={() => setTimerRunning(!timerRunning)} style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: T.radius.md, color: C.text, padding: "6px 10px", cursor: "pointer", fontSize: T.fontSize.body }}>{timerRunning ? "⏸" : "▶"}</button>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: T.size.progressBar, background: C.border, borderRadius: T.radius.sm, overflow: "hidden" }}>
        <div style={{ height: "100%", background: C.accent, width: `${((currentIdx + 1) / sessionData.length) * 100}%`, transition: `width ${T.duration.medium} ${T.easing.enter}`, borderRadius: T.radius.sm }} />
      </div>

      {/* Rest Done flash */}
      {restDone && (
        <div className="t-fade-in" style={{ background: C.accent, color: C.textOnAccent, borderRadius: T.radius.xl, padding: `${T.space.xl}px ${T.space["2xl"]}px`, textAlign: "center", fontWeight: T.fontWeight.heavy, fontSize: T.fontSize.h2, letterSpacing: T.letterSpacing.tight }}>
          💪 REST DONE — GO!
        </div>
      )}

      {/* Rest Timer */}
      {resting && (
        <Card className="t-fade-in" style={{ textAlign: "center", border: `1px solid ${C.accent}`, background: C.accentDim }}>
          <div style={{ fontSize: T.fontSize.xs, color: C.accent, fontWeight: T.fontWeight.bold, textTransform: "uppercase", letterSpacing: T.letterSpacing.uppercase }}>Rest</div>
          <div style={{ fontSize: T.fontSize.timer, fontWeight: T.fontWeight.heavy, fontFamily: T.font.mono, color: C.accent, margin: `${T.space.base}px 0` }}>{fmt(restTimer)}</div>
          <div style={{ display: "flex", gap: T.space.base, justifyContent: "center", alignItems: "center" }}>
            <button onClick={() => setRestTimer(t => Math.max(0, t - 30))} style={{ background: "none", border: `1px solid ${C.accentBorder}`, borderRadius: T.radius.md, color: C.accent, cursor: "pointer", fontSize: T.fontSize.small, padding: `${T.space.md}px ${T.space.lg}px` }}>−30s</button>
            <Btn variant="ghost" onClick={() => { setResting(false); setRestTimer(0); setRestDone(false); }} style={{ color: C.textDim, fontSize: T.fontSize.small, padding: "8px 16px" }}>Skip</Btn>
            <button onClick={() => setRestTimer(t => t + 30)} style={{ background: "none", border: `1px solid ${C.accentBorder}`, borderRadius: T.radius.md, color: C.accent, cursor: "pointer", fontSize: T.fontSize.small, padding: `${T.space.md}px ${T.space.lg}px` }}>+30s</button>
          </div>
        </Card>
      )}

      {/* Exercise Card */}
      <Card style={{ padding: T.space["2xl"] }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: T.space.xl }}>
          <div style={{ flex: 1, minWidth: 0, marginRight: T.space.base }}>
            <div style={{ fontWeight: T.fontWeight.heavy, fontSize: T.fontSize.h2 }}>{exercise?.name}</div>
            <div style={{ fontSize: T.fontSize.small, color: C.textDim }}>{exercise?.muscle}</div>
          </div>
          <YTButton query={exercise?.yt} label={exercise?.name} />
        </div>

        {/* PR reference */}
        {prData && (
          <div style={{ background: C.bg, borderRadius: T.radius.lg, padding: "10px 14px", marginBottom: T.space.xl, display: "flex", gap: T.space.xl, fontSize: T.fontSize.small }}>
            <span style={{ color: C.textDim }}>PR: <strong style={{ color: C.pr }}>{displayWeight(prData.maxWeight, unit)} {wl}</strong></span>
            <span style={{ color: C.textDim }}>Best Vol: <strong style={{ color: C.pr }}>{displayWeight(prData.maxVolume, unit)} {wl}</strong></span>
          </div>
        )}

        {/* Logged sets history for this exercise */}
        {entry.logged.length > 0 && (
          <div style={{ marginBottom: T.space.xl }}>
            <div style={{ fontSize: T.fontSize.xs, color: C.textDim, fontWeight: T.fontWeight.semi, textTransform: "uppercase", marginBottom: T.space.base }}>Completed</div>
            {entry.logged.map((s, i) => (
              <div key={i} style={{ display: "flex", gap: T.space.xl, padding: "6px 0", borderBottom: `1px solid ${C.border}`, fontSize: T.fontSize.bodySmall, color: C.textDim }}>
                <span style={{ color: C.accent, fontWeight: T.fontWeight.bold, width: 28 }}>#{i + 1}</span>
                <span>{isBodyweight || isMobility ? `${s.reps} ${isMobility ? "sec" : "reps"}` : `${s.weight} ${wl} × ${s.reps} reps`}</span>
                {!isBodyweight && !isMobility && <span style={{ color: C.textDim, marginLeft: "auto" }}>{s.weight * s.reps} {wl}</span>}
              </div>
            ))}
          </div>
        )}

        {/* Current set input */}
        {!resting && (
          <div>
            <div style={{ fontSize: T.fontSize.xs, color: C.accent, fontWeight: T.fontWeight.semi, textTransform: "uppercase", letterSpacing: T.letterSpacing.uppercase, marginBottom: T.space.lg }}>Set {entry.logged.length + 1}</div>
            {isMobility ? (
              /* Mobility: countdown timer UI */
              <div style={{ display: "flex", flexDirection: "column", gap: T.space.lg }}>
                {mobRunning || mobCountdown === 0 ? (
                  /* Active/done countdown */
                  <div style={{ textAlign: "center" }}>
                    <div style={{
                      fontSize: 72, fontWeight: T.fontWeight.heavy, fontFamily: T.font.mono,
                      color: mobCountdown === 0 ? C.accent : mobCountdown <= 5 ? C.danger : C.text,
                      lineHeight: 1, marginBottom: T.space.base,
                      transition: `color ${T.transition.fast}`,
                    }}>{mobCountdown}</div>
                    <div style={{ fontSize: T.fontSize.small, color: C.textDim }}>seconds remaining</div>
                  </div>
                ) : (
                  /* Idle: show adjustable target */
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 72, fontWeight: T.fontWeight.heavy, fontFamily: T.font.mono, color: C.textDim, lineHeight: 1, marginBottom: T.space.base }}>
                      {Number(currentSet.reps) || 30}
                    </div>
                    <div style={{ fontSize: T.fontSize.small, color: C.textDim }}>seconds</div>
                    {/* ±5s nudge buttons */}
                    <div style={{ display: "flex", justifyContent: "center", gap: T.space.base, marginTop: T.space.lg }}>
                      <button onClick={() => updateCurrentSet("reps", String(Math.max(5, (Number(currentSet.reps) || 30) - 5)))} style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: T.radius.md, color: C.textDim, cursor: "pointer", fontSize: T.fontSize.small, padding: `${T.space.sm}px ${T.space.lg}px` }}>−5s</button>
                      <button onClick={() => updateCurrentSet("reps", String((Number(currentSet.reps) || 30) + 5))} style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: T.radius.md, color: C.textDim, cursor: "pointer", fontSize: T.fontSize.small, padding: `${T.space.sm}px ${T.space.lg}px` }}>+5s</button>
                    </div>
                  </div>
                )}
                <div style={{ display: "flex", gap: T.space.base }}>
                  {mobRunning ? (
                    <Btn variant="secondary" onClick={() => {
                      setMobRunning(false);
                      const elapsed = (Number(currentSet.reps) || 30) - mobCountdown;
                      if (elapsed > 0) {
                        // Log with elapsed time
                        const nd = [...sessionData];
                        nd[currentIdx] = { ...nd[currentIdx], logged: [...nd[currentIdx].logged, { weight: 0, reps: elapsed }] };
                        setSessionData(nd); setCurrentSetIdx(p => p + 1);
                        setRestTimer(DEFAULT_REST); setResting(true); setRestDone(false);
                        setMobCountdown(null);
                      }
                    }} style={{ flex: 1, padding: 16 }}>Stop & Log</Btn>
                  ) : mobCountdown === 0 ? (
                    <Btn onClick={() => {
                      // Auto-log the full target seconds
                      const target = Number(currentSet.reps) || 30;
                      const nd = [...sessionData];
                      nd[currentIdx] = { ...nd[currentIdx], logged: [...nd[currentIdx].logged, { weight: 0, reps: target }] };
                      setSessionData(nd); setCurrentSetIdx(p => p + 1);
                      setRestTimer(DEFAULT_REST); setResting(true); setRestDone(false);
                      setMobCountdown(null);
                    }} style={{ flex: 1, padding: 16 }}>Log Set {entry.logged.length + 1}</Btn>
                  ) : (
                    <Btn onClick={() => {
                      const target = Number(currentSet.reps) || 30;
                      updateCurrentSet("reps", String(target));
                      setMobCountdown(target);
                      setMobRunning(true);
                    }} style={{ flex: 1, padding: 16, fontSize: T.fontSize.body }}>▶ Start Timer</Btn>
                  )}
                </div>
              </div>
            ) : (
              /* Weighted / bodyweight inputs */
              <div style={{ display: "flex", gap: T.space.lg }}>
                {!isBodyweight && (
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: T.fontSize.xs, color: C.textDim, fontWeight: T.fontWeight.semi, textTransform: "uppercase", marginBottom: T.space.sm, display: "block" }}>Weight ({wl})</label>
                    <input type="number" inputMode="decimal" min="0" value={currentSet.weight} onChange={e => updateCurrentSet("weight", e.target.value)} placeholder="0"
                      style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: T.radius.lg, padding: "14px 16px", color: C.text, fontSize: T.fontSize.h2, fontWeight: T.fontWeight.bold, outline: "none", width: "100%", boxSizing: "border-box", textAlign: "center" }} />
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: T.fontSize.xs, color: C.textDim, fontWeight: T.fontWeight.semi, textTransform: "uppercase", marginBottom: T.space.sm, display: "block" }}>Reps</label>
                  <input type="number" inputMode="numeric" min="0" value={currentSet.reps} onChange={e => updateCurrentSet("reps", e.target.value)} placeholder="0"
                    style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: T.radius.lg, padding: "14px 16px", color: C.text, fontSize: T.fontSize.h2, fontWeight: T.fontWeight.bold, outline: "none", width: "100%", boxSizing: "border-box", textAlign: "center" }} />
                </div>
              </div>
            )}

            {/* Log Set — non-mobility only (mobility has its own flow above) */}
            {!isMobility && (
              <Btn onClick={logSet} disabled={!canLogCurrent} style={{ width: "100%", padding: 18, fontSize: T.fontSize.body, marginTop: T.space.xl }}>
                Log Set {entry.logged.length + 1}
              </Btn>
            )}
          </div>
        )}
      </Card>

      {/* Remaining exercises */}
      {sessionData.length > 1 && (
        <div style={{ display: "flex", gap: T.space.sm, flexWrap: "wrap" }}>
          {sessionData.map((e, i) => {
            const ex = data.exercises.find(ex => ex.id === e.exerciseId);
            const done = e.logged.length > 0;
            const active = i === currentIdx;
            return (
              <div key={e.exerciseId} style={{ fontSize: T.fontSize.xs, padding: "4px 10px", borderRadius: T.radius.full, fontWeight: T.fontWeight.semi, background: active ? C.accentDim : done ? C.bg : C.bg, color: active ? C.accent : done ? C.textDim : C.border, border: `1px solid ${active ? C.accent : done ? C.border : C.border}`, textDecoration: done && !active ? "line-through" : "none" }}>
                {ex?.name || "?"}
              </div>
            );
          })}
        </div>
      )}

      {/* Exercise Navigation */}
      <div style={{ display: "flex", gap: T.space.base }}>
        <Btn variant="ghost" onClick={() => { setCurrentIdx(i => Math.max(0, i - 1)); setCurrentSetIdx(0); setResting(false); setRestTimer(0); }} disabled={currentIdx === 0} style={{ flex: 1, padding: 16, opacity: currentIdx === 0 ? T.opacity.disabled : 1 }}>← Prev</Btn>
        {isLastExercise ? (
          <Btn onClick={finishSession} disabled={sessionData.every(e => e.logged.length === 0)} style={{ flex: 2, padding: 16, fontSize: T.fontSize.body }}>Finish Workout</Btn>
        ) : (
          <Btn variant="secondary" onClick={goNextExercise} style={{ flex: 1, padding: 16 }}>Next →</Btn>
        )}
      </div>
      <button onClick={() => setConfirmCancel(true)} style={{ background: "none", border: "none", color: C.textDim, fontSize: T.fontSize.small, padding: `${T.space.sm}px 0`, cursor: "pointer", textAlign: "center", opacity: 0.6 }}>Cancel workout</button>
      <button onClick={() => setShowRecoveryMid(true)} style={{ background: "none", border: "none", color: C.textDim, fontSize: T.fontSize.small, padding: `${T.space.sm}px 0 ${T.space.xl}px`, cursor: "pointer", textAlign: "center", opacity: 0.5 }}>Feeling pain? Body check →</button>
    </div>
  );
}


