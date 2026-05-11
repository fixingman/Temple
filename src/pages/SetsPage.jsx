import { useState, useEffect } from "react";
import { T, C } from "../tokens";
import { MUSCLE_GROUPS, MUSCLE_ICONS, uid } from "../data";
import { Card, Btn, Input, ConfirmDialog, PillFilter } from "../components";
import { useCoach, coachError, prompts, MODELS } from "../useCoach";

export function SetsPage({ data, save, onStartSession, coach }) {
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");
  const [selected, setSelected] = useState([]);
  const [muscleFilter, setMuscleFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [expandedSet, setExpandedSet] = useState(null);
  const [error, setError] = useState("");
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [lastOrderedKey, setLastOrderedKey] = useState("");
  const selectionKey = [...selected].sort().join(",");

  const startCreate = () => { setCreating(true); setEditingId(null); setName(""); setSelected([]); setMuscleFilter("All"); setSearch(""); setError(""); setOrderError(""); setLastOrderedKey(""); };
  const startEdit = (s) => { setCreating(true); setEditingId(s.id); setName(s.name); setSelected([...s.exerciseIds]); setMuscleFilter("All"); setSearch(""); setError(""); setOrderError(""); setLastOrderedKey([...s.exerciseIds].sort().join(",")); };

  // Auto-suggest order when selection changes, retries if key becomes available
  useEffect(() => {
    if (!coach.hasKey || selected.length < 2) return;
    if (selectionKey === lastOrderedKey) return;
    setOrderError("");
    const run = async () => {
      setOrderLoading(true);
      const exercises = selected.map(id => data.exercises.find(e => e.id === id)).filter(Boolean);
      const { text, error: err } = await coach.ask(
        prompts.exerciseOrder(exercises),
        { maxTokens: 300, model: "claude-haiku-4-5-20251001" }
      );
      if (err) {
        setOrderError(coachError(err));
        setLastOrderedKey(selectionKey); // don't retry same selection on error
      } else {
        try {
          const match = text.match(/\[[\s\S]*?\]/);
          if (!match) throw new Error("no match");
          const names = JSON.parse(match[0]);
          const nameToId = {};
          exercises.forEach(e => { nameToId[e.name.toLowerCase()] = e.id; });
          const reordered = names.map(n => nameToId[n.toLowerCase()]).filter(Boolean);
          const missing = selected.filter(id => !reordered.includes(id));
          setSelected([...reordered, ...missing]);
          setLastOrderedKey(selectionKey);
        } catch (e) { setLastOrderedKey(selectionKey); }
      }
      setOrderLoading(false);
    };
    const t = setTimeout(run, 1200);
    return () => clearTimeout(t);
  }, [selectionKey, coach.hasKey]);
  const saveSet = () => {
    if (!name.trim() && selected.length === 0) { setError("Give your set a name and select at least one exercise."); return; }
    if (!name.trim()) { setError("Give your set a name."); return; }
    if (selected.length === 0) { setError("Select at least one exercise."); return; }
    setError("");
    const newSets = editingId
      ? data.sets.map(s => s.id === editingId ? { ...s, name: name.trim(), exerciseIds: selected } : s)
      : [...data.sets, { id: uid(), name: name.trim(), exerciseIds: selected, createdAt: Date.now() }];
    save({ ...data, sets: newSets });
    setCreating(false);
  };
  const deleteSet = (id) => { save({ ...data, sets: data.sets.filter(s => s.id !== id) }); setConfirmDelete(null); };
  const toggle = (id) => {
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
    setError("");
  };

  const moveUp = (id) => {
    const idx = selected.indexOf(id);
    if (idx <= 0) return;
    const ns = [...selected];
    [ns[idx - 1], ns[idx]] = [ns[idx], ns[idx - 1]];
    setSelected(ns);
  };
  const moveDown = (id) => {
    const idx = selected.indexOf(id);
    if (idx < 0 || idx >= selected.length - 1) return;
    const ns = [...selected];
    [ns[idx], ns[idx + 1]] = [ns[idx + 1], ns[idx]];
    setSelected(ns);
  };
  const removeFromSelected = (id) => { setSelected(s => s.filter(x => x !== id)); };
  const filteredEx = data.exercises
    .filter(e => {
      if (search.trim()) return e.name.toLowerCase().includes(search.trim().toLowerCase());
      return muscleFilter === "All" || e.muscle === muscleFilter;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  if (creating) {
    const selectedExercises = selected.map(id => data.exercises.find(e => e.id === id)).filter(Boolean);
    const muscles = {};
    selectedExercises.forEach(ex => { muscles[ex.muscle] = (muscles[ex.muscle] || 0) + 1; });

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: T.space.lg }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: T.fontSize.h1, fontWeight: T.fontWeight.heavy, margin: 0 }}>{editingId ? "Edit" : "New"} Set</h2>
          <Btn variant="ghost" onClick={() => setCreating(false)}>Cancel</Btn>
        </div>

        {/* Name input */}
        <Input label="Set Name" placeholder="e.g. Push Day" value={name} onChange={e => { setName(e.target.value); setError(""); }} />

        {/* Selected summary — fixed height, never shifts layout */}
        <div style={{ background: C.surface, border: `1px solid ${selected.length > 0 ? C.accentBorder : C.border}`, borderRadius: T.radius.xl, padding: `${T.space.lg}px ${T.space.xl}px`, minHeight: 64, transition: `border-color ${T.transition.fast}` }}>
          {selected.length === 0 ? (
            <div style={{ color: C.textDim, fontSize: T.fontSize.caption, lineHeight: 1.5 }}>
              No exercises selected yet. Search or browse below.
            </div>
          ) : (
            <div>
              {/* Muscle chips + suggest button */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: T.space.base }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: T.space.sm, flex: 1 }}>
                  {Object.entries(muscles).map(([m, count]) => (
                    <div key={m} style={{ padding: "3px 10px", borderRadius: T.radius.full, fontSize: T.fontSize.xs, fontWeight: T.fontWeight.semi, background: C.accentDim, color: C.accent, border: `1px solid ${C.accentBorder}` }}>
                      {m}{count > 1 ? ` ×${count}` : ""}
                    </div>
                  ))}
                </div>
                {coach.hasKey && selected.length >= 2 && (
                  <div style={{ flexShrink: 0, marginLeft: T.space.base, fontSize: T.fontSize.xs, display: "flex", alignItems: "center", gap: T.space.xs }}>
                    {orderLoading
                      ? <span style={{ color: C.accent }}><span className="t-pulse" style={{ display: "inline-block" }}>✦</span> Ordering...</span>
                      : orderError
                      ? <span style={{ color: C.danger }}>✦ {orderError}</span>
                      : lastOrderedKey
                      ? <span style={{ color: C.textDim }}>✦ AI ordered</span>
                      : null}
                  </div>
                )}
              </div>
              {/* Selected exercise rows with reorder + remove */}
              <div style={{ display: "flex", flexDirection: "column", gap: T.space.sm }}>
                {selectedExercises.map((ex, idx) => (
                  <div key={ex.id} style={{ display: "flex", alignItems: "center", gap: T.space.base }}>
                    <span style={{ fontSize: T.fontSize.xs, color: C.accent, fontWeight: T.fontWeight.bold, width: 16, textAlign: "center", flexShrink: 0 }}>{idx + 1}</span>
                    <div style={{ flex: 1, fontSize: T.fontSize.bodySmall, fontWeight: T.fontWeight.semi }}>{ex.name}</div>
                    <div style={{ display: "flex", gap: 2, flexShrink: 0 }}>
                      <button onClick={() => moveUp(ex.id)} disabled={idx === 0} style={{ background: "none", border: "none", color: idx === 0 ? C.border : C.textDim, cursor: idx === 0 ? "default" : "pointer", fontSize: T.fontSize.caption, padding: `${T.space.xs}px ${T.space.sm}px`, lineHeight: 1 }}>▲</button>
                      <button onClick={() => moveDown(ex.id)} disabled={idx === selected.length - 1} style={{ background: "none", border: "none", color: idx === selected.length - 1 ? C.border : C.textDim, cursor: idx === selected.length - 1 ? "default" : "pointer", fontSize: T.fontSize.caption, padding: `${T.space.xs}px ${T.space.sm}px`, lineHeight: 1 }}>▼</button>
                      <button onClick={() => removeFromSelected(ex.id)} style={{ background: "none", border: "none", color: C.danger, cursor: "pointer", fontSize: T.fontSize.caption, padding: `${T.space.xs}px ${T.space.sm}px`, lineHeight: 1 }}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Picker — stable, never moves */}
        <div>
          <label style={{ fontSize: T.fontSize.small, color: C.textDim, fontWeight: T.fontWeight.semi, textTransform: "uppercase", letterSpacing: T.letterSpacing.uppercase }}>
            Add Exercises {selected.length > 0 && <span style={{ color: C.accent }}>· {selected.length} selected</span>}
          </label>

          {/* Search */}
          <div style={{ position: "relative", marginTop: T.space.base, marginBottom: T.space.base }}>
            <input
              type="text"
              placeholder="Search exercises..."
              value={search}
              onChange={e => { setSearch(e.target.value); if (e.target.value) setMuscleFilter("All"); }}
              style={{ width: "100%", boxSizing: "border-box", background: C.surface, border: `1px solid ${search ? C.accent : C.border}`, borderRadius: T.radius.lg, padding: `10px ${search ? 36 : 14}px 10px 14px`, color: C.text, fontSize: T.fontSize.h3, outline: "none", transition: `border-color ${T.transition.fast}` }}
            />
            {search.length > 0 && (
              <button
                onMouseDown={e => { e.preventDefault(); setSearch(""); setMuscleFilter("All"); }}
                style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: C.textDim, cursor: "pointer", fontSize: T.fontSize.small, padding: `${T.space.xs}px ${T.space.sm}px`, lineHeight: 1, borderRadius: T.radius.base }}
              >✕</button>
            )}
          </div>

          {/* Muscle filter — always reserves same space */}
          <div style={{ marginBottom: T.space.base, opacity: search ? 0.3 : 1, pointerEvents: search ? "none" : "auto", transition: `opacity ${T.transition.fast}` }}>
            <PillFilter options={MUSCLE_GROUPS} active={muscleFilter} onChange={setMuscleFilter} small />
          </div>

          {/* Exercise list — fixed scroll container, never changes height */}
          <div style={{ display: "flex", flexDirection: "column", gap: T.space.sm, maxHeight: 320, overflowY: "auto" }}>
            {filteredEx.length === 0 && (
              <div style={{ textAlign: "center", color: C.textDim, fontSize: T.fontSize.caption, padding: `${T.space["2xl"]}px 0` }}>
                {search ? `No exercises found for "${search}"` : "No exercises in this category."}
              </div>
            )}
            {filteredEx.map(ex => {
              const isSel = selected.includes(ex.id);
              return (
                <div key={ex.id} onClick={() => toggle(ex.id)} style={{ display: "flex", alignItems: "center", gap: T.space.lg, padding: "10px 12px", borderRadius: T.radius.lg, background: isSel ? C.accentDim : C.surface, border: `1px solid ${isSel ? C.accent : C.border}`, cursor: "pointer", transition: `background ${T.transition.fast}, border-color ${T.transition.fast}` }}>
                  <div style={{ width: 20, height: 20, borderRadius: T.radius.base, border: `2px solid ${isSel ? C.accent : C.textDim}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: isSel ? C.accent : "transparent", color: C.textOnAccent, fontSize: T.fontSize.small, fontWeight: T.fontWeight.black, transition: `background ${T.transition.fast}, border-color ${T.transition.fast}` }}>{isSel ? "✓" : ""}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: T.fontWeight.semi, fontSize: T.fontSize.bodySmall }}>{ex.name}</div>
                    <div style={{ fontSize: T.fontSize.xs, color: C.textDim }}>{ex.muscle}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <ErrorBanner message={error} />
        <Btn onClick={saveSet} style={{ width: "100%", padding: 14 }}>
          {editingId ? "Update" : "Create"} Set{selected.length > 0 ? ` (${selected.length})` : ""}
        </Btn>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: T.space.xl }}>
      {confirmDelete && <ConfirmDialog message={`Delete "${data.sets.find(s => s.id === confirmDelete)?.name}"? This cannot be undone.`} onConfirm={() => deleteSet(confirmDelete)} onCancel={() => setConfirmDelete(null)} />}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ fontSize: T.fontSize.h1, fontWeight: T.fontWeight.heavy, margin: 0 }}>Workout Sets</h2>
          <p style={{ color: C.textDim, fontSize: T.fontSize.caption, margin: `${T.space.sm}px 0 0` }}>{data.sets.length} sets</p>
        </div>
        {data.sets.length > 0 && <Btn variant="ghost" onClick={startCreate} style={{ color: C.accent }}>+ New Set</Btn>}
      </div>
      {data.sets.length === 0 && (
        <Card style={{ textAlign: "center", padding: T.space["4xl"] }}>
          <div style={{ fontSize: T.fontSize.icon, marginBottom: T.space.lg }}>🏋️</div>
          <div style={{ fontWeight: T.fontWeight.bold, fontSize: T.fontSize.body, marginBottom: T.space.sm }}>No workout sets yet</div>
          <div style={{ color: C.textDim, fontSize: T.fontSize.caption, marginBottom: T.space.xl }}>Create your first set to start training</div>
          <Btn onClick={startCreate}>Create Set</Btn>
        </Card>
      )}
      {data.sets.map(s => {
        const exNames = s.exerciseIds.map(id => data.exercises.find(e => e.id === id)?.name).filter(Boolean);
        const validCount = s.exerciseIds.filter(eid => data.exercises.some(e => e.id === eid)).length;
        const sessionCount = data.sessions.filter(ss => ss.setId === s.id).length;
        const expanded = expandedSet === s.id;
        return (
          <Card key={s.id}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: T.space.base }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: T.fontWeight.heavy, fontSize: T.fontSize.h3 }}>{s.name}</div>
                <div style={{ fontSize: T.fontSize.small, color: C.textDim, marginTop: T.space.xs }}>{exNames.length} exercises · {sessionCount} sessions</div>
              </div>
              {/* ··· toggle */}
              <button
                onClick={() => setExpandedSet(expanded ? null : s.id)}
                style={{ background: "none", border: "none", color: expanded ? C.accent : C.textDim, cursor: "pointer", fontSize: 18, padding: `0 ${T.space.sm}px`, lineHeight: 1, flexShrink: 0, letterSpacing: 1 }}
              >···</button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: T.space.sm, marginBottom: T.space.lg }}>
              {exNames.slice(0, 5).map((n, i) => <span key={i} style={{ fontSize: T.fontSize.xs, background: C.bg, padding: "3px 8px", borderRadius: T.radius.md, color: C.textDim }}>{n}</span>)}
              {exNames.length > 5 && <span style={{ fontSize: T.fontSize.xs, color: C.textDim, padding: "3px 4px" }}>+{exNames.length - 5} more</span>}
            </div>
            {/* Primary action */}
            <Btn variant="primary" onClick={() => onStartSession(s)} disabled={validCount === 0} style={{ width: "100%" }}>▶ Start</Btn>
            {/* Edit + Delete — only visible when expanded */}
            {expanded && (
              <div className="t-fade-in" style={{ display: "flex", gap: T.space.base, marginTop: T.space.base }}>
                <Btn variant="secondary" onClick={() => { startEdit(s); setExpandedSet(null); }} style={{ flex: 1 }}>Edit</Btn>
                <Btn variant="danger" onClick={() => { setConfirmDelete(s.id); setExpandedSet(null); }} style={{ flex: 1 }}>Delete</Btn>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}


