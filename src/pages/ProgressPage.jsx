import { useState, useCallback } from "react";
import React from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { T, C } from "../tokens";
import { fmtDateFull, displayWeight, weightLabel, est1RM, uid } from "../data";
import { Card, Btn, ConfirmDialog } from "../components";
import { IcTrophy, IcClose } from "../icons";
import { MuscleMap } from "../MuscleMap";
import { coachError, prompts } from "../useCoach";

function PRBadge() { return <span style={{ background: C.prDim, color: C.pr, fontSize: T.fontSize.xxs, fontWeight: T.fontWeight.heavy, padding: "2px 8px", borderRadius: T.radius.full, letterSpacing: T.letterSpacing.label, display: "inline-flex", alignItems: "center", gap: 3 }}><IcTrophy size={10} /> PR</span>; }

function MuscleBar({ label, value, max, icon, unit }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div style={{ marginBottom: T.space.lg }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: T.space.sm }}>
        <span style={{ fontSize: T.fontSize.bodySmall, fontWeight: T.fontWeight.semi }}>{label}</span>
        <span style={{ fontSize: T.fontSize.small, color: C.accent, fontWeight: T.fontWeight.bold }}>{displayWeight(value, unit).toLocaleString()} {weightLabel(unit)}</span>
      </div>
      <div style={{ height: 8, background: C.bg, borderRadius: T.radius.base, overflow: "hidden" }}>
        <div style={{ height: "100%", background: C.accent, width: `${pct}%`, borderRadius: T.radius.base, transition: `width ${T.duration.medium} ${T.easing.enter}` }} />
      </div>
    </div>
  );
}


export function ProgressPage({ data, save, onRepeatSession, coach }) {
  const [view, setView] = useState("prs");
  const [selectedExId, setSelectedExId] = useState(null);
  const [confirmDeleteSession, setConfirmDeleteSession] = useState(null);
  const [gapOpen, setGapOpen] = useState(false);
  const [expandedSession, setExpandedSession] = useState(null);
  const unit = data.settings?.unit || "kg";
  const wl = weightLabel(unit);

  // Delete a session and recalculate all PRs from remaining sessions
  const deleteSession = (sessionId) => {
    const remaining = data.sessions.filter(s => s.id !== sessionId);
    // Recalculate PRs from scratch using remaining sessions
    const newPrs = {};
    remaining.forEach(s => {
      s.entries.forEach(e => {
        const maxW = Math.max(...e.sets.map(st => st.weight), 0);
        const maxR = Math.max(...e.sets.map(st => st.reps), 0);
        const vol = e.sets.reduce((a, st) => a + st.reps * st.weight, 0);
        const prev = newPrs[e.exerciseId] || { maxWeight: 0, maxReps: 0, maxVolume: 0, date: 0 };
        newPrs[e.exerciseId] = {
          maxWeight: Math.max(maxW, prev.maxWeight),
          maxReps: Math.max(maxR, prev.maxReps),
          maxVolume: Math.max(vol, prev.maxVolume),
          date: Math.max(s.date, prev.date),
        };
      });
    });
    save({ ...data, sessions: remaining, prs: newPrs });
    setConfirmDeleteSession(null);
  };

  const { prEntries, totalSessions, totalVol, weeksActive, thisWeekSessions, muscleEntries, best1RMByExercise } = React.useMemo(() => {
    const prEntries = Object.entries(data.prs).map(([eid, pr]) => {
      const ex = data.exercises.find(e => e.id === eid);
      return { ...pr, exerciseId: eid, exerciseName: ex?.name || "Unknown", muscle: ex?.muscle || "" };
    }).sort((a, b) => (b.date || 0) - (a.date || 0));

    const totalSessions = data.sessions.length;
    const totalVol = data.sessions.reduce((a, s) => a + s.entries.reduce((b, e) => b + e.sets.reduce((c, st) => c + st.reps * st.weight, 0), 0), 0);

    const now = new Date();
    const weekStart = (weeksAgo) => {
      const d = new Date(now); d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - d.getDay() + 1 - (weeksAgo * 7));
      return d.getTime();
    };
    let thisWeekSessions = 0, weeksActive = 0;
    for (let w = 0; w < 4; w++) {
      const start = weekStart(w);
      const end = w === 0 ? Date.now() : weekStart(w - 1);
      const count = data.sessions.filter(s => s.date >= start && s.date < end).length;
      if (count > 0) weeksActive++;
      if (w === 0) thisWeekSessions = count;
    }

    const muscleVol = {};
    data.sessions.forEach(s => {
      s.entries.forEach(e => {
        const ex = data.exercises.find(x => x.id === e.exerciseId);
        if (!ex) return;
        const vol = e.sets.reduce((a, st) => a + st.reps * st.weight, 0);
        muscleVol[ex.muscle] = (muscleVol[ex.muscle] || 0) + vol;
      });
    });
    const muscleEntries = Object.entries(muscleVol).sort((a, b) => b[1] - a[1]);

    // Precompute best est1RM per exercise to avoid per-render loops
    const best1RMByExercise = {};
    data.sessions.forEach(s => {
      s.entries.forEach(e => {
        e.sets.forEach(st => {
          const v = est1RM(st.weight, st.reps);
          if (v > (best1RMByExercise[e.exerciseId] || 0)) best1RMByExercise[e.exerciseId] = v;
        });
      });
    });

    return { prEntries, totalSessions, totalVol, weeksActive, thisWeekSessions, muscleEntries, best1RMByExercise };
  }, [data.sessions, data.prs, data.exercises]);

  const maxMuscleVol = Math.max(...muscleEntries.map(([, v]) => v), 1);

  const prTooltip = useCallback(({ active, payload }) => {
    if (!active || !payload?.[0]) return null;
    const d = payload[0].payload;
    return (
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: T.radius.lg, padding: "10px 14px", fontSize: T.fontSize.small }}>
        <div style={{ fontWeight: T.fontWeight.bold, color: C.text, marginBottom: T.space.sm }}>{d.date}</div>
        <div style={{ color: C.accent }}>Max: {d.weight} {wl}</div>
        <div style={{ color: C.pr }}>Est 1RM: {d.e1rm} {wl}</div>
        <div style={{ color: C.textDim }}>{d.sets} sets · {d.reps} best reps</div>
        <div style={{ color: C.textDim }}>Vol: {d.volume} {wl}</div>
      </div>
    );
  }, [wl]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: T.space.xl }}>
      <h2 style={{ fontSize: T.fontSize.h1, fontWeight: T.fontWeight.heavy, margin: 0 }}>Progress</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: T.space.base }}>
        <Card style={{ textAlign: "center", padding: T.space.lg }}><div style={{ fontSize: T.fontSize.stat, fontWeight: T.fontWeight.heavy, color: C.accent, fontFamily: T.font.mono, letterSpacing: T.letterSpacing.tight, lineHeight: 1 }}>{totalSessions}</div><div style={{ fontSize: T.fontSize.xxs, color: C.textDim, fontWeight: T.fontWeight.bold, letterSpacing: T.letterSpacing.label, marginTop: T.space.sm }}>SESSIONS</div></Card>
        <Card style={{ textAlign: "center", padding: T.space.lg }}><div style={{ fontSize: T.fontSize.stat, fontWeight: T.fontWeight.heavy, color: C.accent, fontFamily: T.font.mono, letterSpacing: T.letterSpacing.tight, lineHeight: 1 }}>{thisWeekSessions}</div><div style={{ fontSize: T.fontSize.xxs, color: C.textDim, fontWeight: T.fontWeight.bold, letterSpacing: T.letterSpacing.label, marginTop: T.space.sm }}>THIS WEEK</div></Card>
        <Card style={{ textAlign: "center", padding: T.space.lg }}><div style={{ fontSize: T.fontSize.stat, fontWeight: T.fontWeight.heavy, color: weeksActive >= 3 ? C.accent : C.pr, fontFamily: T.font.mono, letterSpacing: T.letterSpacing.tight, lineHeight: 1 }}>{weeksActive}<span style={{ fontSize: T.fontSize.small, fontWeight: T.fontWeight.semi }}>/4</span></div><div style={{ fontSize: T.fontSize.xxs, color: C.textDim, fontWeight: T.fontWeight.bold, letterSpacing: T.letterSpacing.label, marginTop: T.space.sm }}>ACTIVE WKS</div></Card>
      </div>
      {totalVol > 0 && <Card style={{ textAlign: "center", padding: T.space.lg }}>
        <div style={{ fontSize: T.fontSize.xs, color: C.textDim, fontWeight: T.fontWeight.semi, marginBottom: T.space.sm }}>TOTAL VOLUME LIFTED</div>
        <div style={{ fontSize: T.fontSize.stat, fontWeight: T.fontWeight.heavy, color: C.accent }}>{displayWeight(totalVol, unit).toLocaleString()} <span style={{ fontSize: T.fontSize.bodySmall, fontWeight: T.fontWeight.semi, color: C.textDim }}>{wl}</span></div>
        {prEntries.length > 0 && <div style={{ fontSize: T.fontSize.xs, color: C.pr, fontWeight: T.fontWeight.semi, marginTop: T.space.base }}>{prEntries.length} personal {prEntries.length === 1 ? "record" : "records"} set</div>}
      </Card>}
      {weeksActive >= 3 && <Card style={{ background: C.accentDim, border: `1px solid ${C.accentBorder}`, padding: 14 }}><div style={{ fontSize: T.fontSize.bodySmall, fontWeight: T.fontWeight.bold, color: C.accent }}>You've been consistent</div><div style={{ fontSize: T.fontSize.small, color: C.textDim, marginTop: T.space.xs }}>{weeksActive} of the last 4 weeks. That's what builds real progress.</div></Card>}
      {totalSessions > 0 && totalSessions < 5 && <Card style={{ background: C.accentDim, border: `1px solid ${C.accentBorder}`, padding: 14 }}><div style={{ fontSize: T.fontSize.bodySmall, fontWeight: T.fontWeight.bold, color: C.accent }}>Good start</div><div style={{ fontSize: T.fontSize.small, color: C.textDim, marginTop: T.space.xs }}>{totalSessions} {totalSessions === 1 ? "session" : "sessions"} logged. Every one counts.</div></Card>}
      {totalSessions >= 5 && totalSessions < 20 && weeksActive < 3 && <Card style={{ background: C.accentDim, border: `1px solid ${C.accentBorder}`, padding: 14 }}><div style={{ fontSize: T.fontSize.bodySmall, fontWeight: T.fontWeight.bold, color: C.accent }}>Building a foundation</div><div style={{ fontSize: T.fontSize.small, color: C.textDim, marginTop: T.space.xs }}>{totalSessions} sessions in. You're finding your rhythm.</div></Card>}
      {totalSessions >= 20 && weeksActive < 3 && <Card style={{ background: C.prDim, border: `1px solid ${C.prBorder}`, padding: 14 }}><div style={{ fontSize: T.fontSize.bodySmall, fontWeight: T.fontWeight.bold, color: C.pr }}>{totalSessions} sessions</div><div style={{ fontSize: T.fontSize.small, color: C.textDim, marginTop: T.space.xs }}>That's real commitment. Your body knows.</div></Card>}

      {/* Tab switcher */}
      <div style={{ display: "flex", gap: T.space.sm, background: C.surface, borderRadius: T.radius.lg, padding: T.space.xs }}>
        {[["prs", "PRs"], ["muscles", "Muscles"], ["history", "History"]].map(([v, l]) => (
          <button key={v} onClick={() => setView(v)} style={{ flex: 1, border: "none", borderRadius: T.radius.md, padding: "9px 0", fontSize: T.fontSize.xs, fontWeight: T.fontWeight.bold, letterSpacing: T.letterSpacing.label, textTransform: "uppercase", cursor: "pointer", background: view === v ? C.accentDim : "transparent", color: view === v ? C.accent : C.textDim, transition: `background ${T.transition.fast}, color ${T.transition.fast}`, borderBottom: view === v ? `2px solid ${C.accent}` : "2px solid transparent" }}>{l}</button>
        ))}
      </div>

      {/* PRs tab */}
      {view === "prs" && (
        <div style={{ display: "flex", flexDirection: "column", gap: T.space.base }}>
          {prEntries.length === 0 && <Card style={{ textAlign: "center", padding: T.space["3xl"], color: C.textDim }}>Complete a workout to see your PRs here</Card>}
          {prEntries.map((pr, i) => {
            const isOpen = selectedExId === pr.exerciseId;
            const exercise = data.exercises.find(e => e.id === pr.exerciseId);

            // Build chart data when expanded
            let chartData = [];
            let best1RM = 0;
            if (isOpen) {
              data.sessions.forEach(s => {
                const entry = s.entries.find(e => e.exerciseId === pr.exerciseId);
                if (!entry || entry.sets.length === 0) return;
                const maxW = Math.max(...entry.sets.map(st => st.weight));
                const totalVol = entry.sets.reduce((a, st) => a + st.reps * st.weight, 0);
                const maxR = Math.max(...entry.sets.map(st => st.reps));
                const session1RM = Math.max(...entry.sets.map(st => est1RM(st.weight, st.reps)));
                if (session1RM > best1RM) best1RM = session1RM;
                chartData.push({ date: new Date(s.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }), rawDate: s.date, weight: displayWeight(maxW, unit), volume: displayWeight(totalVol, unit), reps: maxR, sets: entry.sets.length, e1rm: displayWeight(session1RM, unit) });
              });
              chartData.sort((a, b) => a.rawDate - b.rawDate);
            }

            const customTooltip = prTooltip;

            return (
              <Card key={i} style={{ border: isOpen ? `1px solid ${C.accent}` : undefined }}>
                {/* Header — always visible, tappable */}
                <div onClick={() => setSelectedExId(isOpen ? null : pr.exerciseId)} style={{ cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1, minWidth: 0, paddingRight: T.space.base }}>
                    <div style={{ fontWeight: T.fontWeight.heavy, fontSize: T.fontSize.h3, letterSpacing: T.letterSpacing.tight }}>{pr.exerciseName}</div>
                    <div style={{ fontSize: T.fontSize.xs, color: C.textDim, fontWeight: T.fontWeight.bold, letterSpacing: T.letterSpacing.label, textTransform: "uppercase", marginTop: T.space.xs }}>{pr.muscle}</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: T.space.xs, flexShrink: 0 }}>
                    <div style={{ fontSize: T.fontSize.statMd, fontWeight: T.fontWeight.heavy, color: C.accent, fontFamily: T.font.mono, letterSpacing: T.letterSpacing.tight, lineHeight: 1 }}>{displayWeight(pr.maxWeight, unit)} <span style={{ fontSize: T.fontSize.small, color: C.textDim, fontFamily: T.font.body }}>{wl}</span></div>
                    <div style={{ display: "flex", gap: T.space.base, alignItems: "center" }}>
                      <PRBadge />
                      <motion.span animate={{ rotate: isOpen ? 45 : 0 }} transition={T.motion.snap} style={{ color: C.textDim, fontSize: T.fontSize.h2, lineHeight: 1, display: "inline-block" }}>+</motion.span>
                    </div>
                  </div>
                </div>

                {/* Stats row */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: T.space.sm, marginTop: T.space.lg }}>
                  {[["maxWeight", `${wl.toUpperCase()}`], ["maxReps", "REPS"], ["maxVolume", "VOL"], ["est1rm", "1RM"]].map(([k, l]) => {
                    let val;
                    if (k === "maxReps") val = pr[k];
                    else if (k === "est1rm") {
                      const best = best1RMByExercise[pr.exerciseId] || 0;
                      val = best > 0 ? displayWeight(best, unit) : "—";
                    } else val = displayWeight(pr[k], unit);
                    return (
                      <div key={k} style={{ background: C.bg, borderRadius: T.radius.md, padding: "8px 6px", textAlign: "center" }}>
                        <div style={{ fontSize: T.fontSize.h3, fontWeight: T.fontWeight.heavy, color: k === "est1rm" ? C.pr : C.text, fontFamily: T.font.mono, letterSpacing: T.letterSpacing.tight }}>{val}</div>
                        <div style={{ fontSize: T.fontSize.micro, color: C.textDim, fontWeight: T.fontWeight.bold, letterSpacing: T.letterSpacing.label, marginTop: T.space.xs }}>{l}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Expanded: chart + session log */}
                {isOpen && (
                  <div style={{ marginTop: T.space.xl, borderTop: `1px solid ${C.border}`, paddingTop: T.space.xl }}>
                    {/* Chart */}
                    {chartData.length >= 2 ? (
                      <div style={{ width: "100%", height: 200 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                            <XAxis dataKey="date" tick={{ fill: C.textDim, fontSize: T.fontSize.micro }} tickLine={false} axisLine={{ stroke: C.border }} />
                            <YAxis tick={{ fill: C.textDim, fontSize: T.fontSize.micro }} tickLine={false} axisLine={{ stroke: C.border }} domain={["dataMin - 5", "dataMax + 5"]} />
                            <Tooltip content={customTooltip} cursor={{ stroke: C.accent, strokeDasharray: "3 3" }} />
                            <Line type="monotone" dataKey="weight" stroke={C.accent} strokeWidth={2} dot={{ fill: C.accent, r: 4, strokeWidth: 0 }} activeDot={{ fill: C.accent, r: 6, strokeWidth: 2, stroke: C.bg }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    ) : chartData.length === 1 ? (
                      <div style={{ fontSize: T.fontSize.small, color: C.textDim }}>One session logged. Your progress chart will appear after the next one.</div>
                    ) : null}

                    {/* Session log */}
                    {chartData.length > 0 && (
                      <div style={{ marginTop: chartData.length >= 2 ? T.space.xl : 0 }}>
                        {[...chartData].reverse().map((d, j) => (
                          <div key={j} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: `${T.space.base}px 0`, borderBottom: j < chartData.length - 1 ? `1px solid ${C.border}` : "none" }}>
                            <div>
                              <div style={{ fontSize: T.fontSize.bodySmall, fontWeight: T.fontWeight.semi }}>{d.date}</div>
                              <div style={{ fontSize: T.fontSize.xs, color: C.textDim }}>{d.sets} sets · best {d.reps} reps</div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <div style={{ fontSize: T.fontSize.body, fontWeight: T.fontWeight.heavy, color: C.accent }}>{d.weight} {wl}</div>
                              <div style={{ fontSize: T.fontSize.xs, color: C.pr }}>1RM: {d.e1rm} {wl}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Muscles tab */}
      {view === "muscles" && (
        <>
          {muscleEntries.length > 0 && (
            <MuscleMap volume={Object.fromEntries(muscleEntries)} size={110} />
          )}
          <Card>
            {muscleEntries.length === 0 && <div style={{ textAlign: "center", padding: T.space["2xl"], color: C.textDim }}>Complete a workout to see muscle breakdown</div>}
            {muscleEntries.map(([muscle, vol]) => (
              <MuscleBar key={muscle} label={muscle} value={vol} max={maxMuscleVol} unit={unit} />
            ))}
            {muscleEntries.length > 0 && (
              <div style={{ fontSize: T.fontSize.xs, color: C.textDim, marginTop: T.space.base, textAlign: "center" }}>Total volume across all sessions</div>
            )}
          </Card>
          {coach?.hasKey && muscleEntries.length > 0 && (
            <Btn variant="secondary" onClick={() => setGapOpen(true)} style={{ width: "100%" }}>✦ Analyse Training Gaps</Btn>
          )}
          {gapOpen && (
            <GapSheet
              muscleEntries={muscleEntries}
              existingSets={data.sets}
              exercises={data.exercises}
              coach={coach}
              onCreateSet={(newSet) => {
                save({ ...data, sets: [...data.sets, newSet] });
                setGapOpen(false);
              }}
              onClose={() => setGapOpen(false)}
            />
          )}
        </>
      )}

      {/* History tab */}
      {view === "history" && (
        <div style={{ display: "flex", flexDirection: "column", gap: T.space.base }}>
          {confirmDeleteSession && (
            <ConfirmDialog
              message="Delete this session? PRs will be recalculated from your remaining sessions."
              confirmLabel="Delete"
              cancelLabel="Cancel"
              onConfirm={() => deleteSession(confirmDeleteSession)}
              onCancel={() => setConfirmDeleteSession(null)}
            />
          )}
          {data.sessions.length === 0 && <Card style={{ textAlign: "center", padding: T.space["3xl"], color: C.textDim }}>No sessions yet</Card>}
          {[...data.sessions].reverse().map(s => {
            const set = data.sets.find(ws => ws.id === s.setId);
            const vol = s.entries.reduce((a, e) => a + e.sets.reduce((b, st) => b + st.reps * st.weight, 0), 0);
            const isExpanded = expandedSession === s.id;
            const sessionMuscleVol = {};
            if (isExpanded) {
              s.entries.forEach(e => {
                const ex = data.exercises.find(x => x.id === e.exerciseId);
                if (!ex) return;
                const v = e.sets.reduce((a, st) => a + st.reps * st.weight, 0);
                sessionMuscleVol[ex.muscle] = (sessionMuscleVol[ex.muscle] || 0) + v;
              });
            }
            return (
              <Card key={s.id} style={{ border: isExpanded ? `1px solid ${C.accent}` : undefined }}>
                {/* Header row — tappable */}
                <div onClick={() => setExpandedSession(isExpanded ? null : s.id)} style={{ cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: T.fontWeight.bold, fontSize: T.fontSize.body }}>{set?.name || "Deleted Set"}</div>
                    <div style={{ fontSize: T.fontSize.small, color: C.textDim }}>{fmtDateFull(s.date)} {s.duration ? `· ${s.duration < 60 ? "<1min" : `${Math.floor(s.duration / 60)}min`}` : ""}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: T.space.sm, flexShrink: 0 }}>
                    <motion.span animate={{ rotate: isExpanded ? 45 : 0 }} transition={T.motion.snap} style={{ color: C.textDim, fontSize: T.fontSize.h2, lineHeight: 1, display: "inline-block" }}>+</motion.span>
                    <button
                      onClick={e => { e.stopPropagation(); setConfirmDeleteSession(s.id); }}
                      style={{ background: "none", border: "none", color: C.textDim, cursor: "pointer", padding: `${T.space.xs}px ${T.space.sm}px`, opacity: T.opacity.muted, display: "flex", alignItems: "center" }}
                    ><IcClose size={14} /></button>
                  </div>
                </div>

                {/* Summary row */}
                <div style={{ display: "flex", gap: T.space.xl, marginTop: T.space.base, fontSize: T.fontSize.small, color: C.textDim }}>
                  <span>{s.entries.length} exercises</span>
                  <span>{s.entries.reduce((a, e) => a + e.sets.length, 0)} sets</span>
                  <span style={{ color: C.accent, fontWeight: T.fontWeight.bold }}>{displayWeight(vol, unit).toLocaleString()} {wl}</span>
                </div>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="t-fade-in" style={{ marginTop: T.space.xl, borderTop: `1px solid ${C.border}`, paddingTop: T.space.xl, display: "flex", flexDirection: "column", gap: T.space.xl }}>
                    <MuscleMap volume={sessionMuscleVol} size={90} />
                    <div style={{ display: "flex", flexDirection: "column", gap: T.space.lg }}>
                      {s.entries.map((e, ei) => {
                        const ex = data.exercises.find(x => x.id === e.exerciseId);
                        const isBodyweight = ex?.equipment === "bodyweight";
                        const isMobility = ex?.category === "mobility";
                        const exVol = e.sets.reduce((a, st) => a + st.reps * st.weight, 0);
                        return (
                          <div key={ei}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: T.space.sm }}>
                              <div style={{ fontWeight: T.fontWeight.semi, fontSize: T.fontSize.bodySmall }}>{ex?.name || "Unknown"}</div>
                              {!isBodyweight && !isMobility && exVol > 0 && (
                                <div style={{ fontSize: T.fontSize.xs, color: C.textDim, fontFamily: T.font.mono }}>{displayWeight(exVol, unit)} {wl}</div>
                              )}
                            </div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: T.space.sm }}>
                              {e.sets.map((st, si) => (
                                <span key={si} style={{ fontSize: T.fontSize.xs, padding: "3px 10px", borderRadius: T.radius.full, background: C.bg, color: C.textDim, border: `1px solid ${C.border}`, fontFamily: T.font.mono }}>
                                  {isBodyweight || isMobility
                                    ? `${st.reps}${isMobility ? "s" : " reps"}`
                                    : `${displayWeight(st.weight, unit)} × ${st.reps}`}
                                </span>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {set && (
                      <Btn variant="secondary" onClick={() => onRepeatSession(set)} style={{ width: "100%", fontSize: T.fontSize.small }}>Repeat This Workout</Btn>
                    )}
                  </div>
                )}

                {/* Collapsed repeat button */}
                {!isExpanded && set && (
                  <div style={{ marginTop: T.space.lg }}>
                    <Btn variant="secondary" onClick={() => onRepeatSession(set)} style={{ width: "100%", fontSize: T.fontSize.small }}>Repeat This Workout</Btn>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}



// ─── Gap Analysis Sheet ───
function GapSheet({ muscleEntries, existingSets, exercises, coach, onCreateSet, onClose }) {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const runAnalysis = async () => {
    setLoading(true); setError(""); setResults(null);
    const muscleVol = Object.fromEntries(muscleEntries.map(([m, v]) => [m, Math.round(v)]));
    const setNames = existingSets.map(s => s.name);
    const { text, error: err } = await coach.ask(
      prompts.gapAnalysis(muscleVol, setNames),
      { maxTokens: 600, model: "claude-sonnet-4-6" }
    );
    if (err) { setError(coachError(err)); setLoading(false); return; }
    try {
      const match = text.match(/\[[\s\S]*?\]/);
      setResults(JSON.parse(match[0]));
    } catch { setError("Could not parse suggestions. Try again."); }
    setLoading(false);
  };

  // Auto-run on open
  React.useEffect(() => { runAnalysis(); }, []);

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: C.overlay, zIndex: T.z.modal + 10, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <div className="t-slide-up" onClick={e => e.stopPropagation()} style={{ background: C.surface, borderRadius: `${T.radius.xl}px ${T.radius.xl}px 0 0`, maxHeight: "85vh", display: "flex", flexDirection: "column" }}>
        <div style={{ width: 36, height: 4, borderRadius: T.radius.sm, background: C.border, margin: `${T.space.base}px auto`, flexShrink: 0 }} />
        <div style={{ padding: `0 ${T.space.xl}px ${T.space.base}px`, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: T.fontSize.h3, fontWeight: T.fontWeight.bold }}>Training Gap Analysis</div>
            <div style={{ fontSize: T.fontSize.xs, color: C.textDim, marginTop: T.space.xs }}>Based on your session history</div>
          </div>
          <button onClick={onClose} style={{ background: C.bg, border: "none", color: C.textDim, cursor: "pointer", borderRadius: T.radius.full, width: T.size.iconBtn, height: T.size.iconBtn, display: "flex", alignItems: "center", justifyContent: "center" }}><IcClose size={16} /></button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: T.space.xl, display: "flex", flexDirection: "column", gap: T.space.xl }}>
          {loading && (
            <div style={{ textAlign: "center", padding: T.space["3xl"], color: C.textDim }}>
              <div className="t-pulse" style={{ fontSize: T.fontSize.h2, marginBottom: T.space.lg }}>✦</div>
              <div style={{ fontSize: T.fontSize.small }}>Analysing your training history...</div>
            </div>
          )}
          {error && (
            <div style={{ display: "flex", flexDirection: "column", gap: T.space.xl }}>
              <div style={{ fontSize: T.fontSize.small, color: C.danger, textAlign: "center" }}>{error}</div>
              <Btn onClick={runAnalysis} style={{ width: "100%" }}>Try Again</Btn>
            </div>
          )}
          {results && results.map((r, i) => {
            const exerciseIds = r.exercises
              .map(name => exercises.find(e => e.name.toLowerCase() === name.toLowerCase())?.id)
              .filter(Boolean);
            const canCreate = exerciseIds.length > 0;
            return (
              <Card key={i}>
                <div style={{ fontWeight: T.fontWeight.bold, fontSize: T.fontSize.body, marginBottom: T.space.sm }}>{r.setName}</div>
                <div style={{ fontSize: T.fontSize.small, color: C.textDim, marginBottom: T.space.lg, lineHeight: 1.5 }}>{r.reason}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: T.space.sm, marginBottom: T.space.xl }}>
                  {r.exercises.map((name, j) => {
                    const found = exercises.find(e => e.name.toLowerCase() === name.toLowerCase());
                    return (
                      <span key={j} style={{ fontSize: T.fontSize.xs, padding: "3px 10px", borderRadius: T.radius.full, background: found ? C.accentDim : C.bg, color: found ? C.accent : C.textDim, border: `1px solid ${found ? C.accentBorder : C.border}` }}>
                        {name}{!found && " *"}
                      </span>
                    );
                  })}
                </div>
                {!canCreate && <div style={{ fontSize: T.fontSize.xs, color: C.textDim, marginBottom: T.space.base }}>* Not in your library. Add them first to create this set.</div>}
                <Btn onClick={() => onCreateSet({ id: uid(), name: r.setName, exerciseIds, supersets: [], createdAt: Date.now() })} disabled={!canCreate} style={{ width: "100%" }}>
                  + Add to My Sets
                </Btn>
              </Card>
            );
          })}
          <div style={{ height: "env(safe-area-inset-bottom)" }} />
        </div>
      </div>
    </div>
  );
}
