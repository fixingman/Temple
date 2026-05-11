import { useState } from "react";
import { T, C } from "../tokens";
import { MUSCLE_GROUPS, MUSCLE_GROUPS_NO_ALL, MUSCLE_ICONS, EQUIPMENT_TYPES, CATEGORY_TYPES, uid } from "../data";
import { Card, Btn, Input, ConfirmDialog, ErrorBanner, PillFilter, YTButton } from "../components";

function FilterBar({ muscle, onMuscle, equipment, onEquipment, category, onCategory, small }) {
  const pillStyle = (active) => ({
    border: "none", borderRadius: T.radius.full,
    padding: small ? "5px 12px" : "6px 14px",
    fontSize: small ? T.fontSize.xs : T.fontSize.small,
    fontWeight: T.fontWeight.semi, cursor: "pointer",
    transition: `background ${T.transition.fast}, color ${T.transition.fast}`,
    background: active ? C.accentDim : C.surface,
    color: active ? C.accent : C.textDim,
  });
  const outlineStyle = (active) => ({
    border: `1px solid ${active ? C.accent : C.border}`, borderRadius: T.radius.full,
    padding: small ? "4px 11px" : "5px 13px",
    fontSize: small ? T.fontSize.xs : T.fontSize.small,
    fontWeight: T.fontWeight.semi, cursor: "pointer",
    transition: `background ${T.transition.fast}, color ${T.transition.fast}, border-color ${T.transition.fast}`,
    background: active ? C.accentDim : "transparent",
    color: active ? C.accent : C.textDim,
  });
  const sep = { width: 1, alignSelf: "stretch", background: C.border, margin: `0 ${T.space.xs}px`, flexShrink: 0 };

  return (
    <div style={{ display: "flex", gap: T.space.md, flexWrap: "wrap", alignItems: "center" }}>
      {MUSCLE_GROUPS.map(g => (
        <button key={g} onClick={() => onMuscle(g)} style={pillStyle(muscle === g)}>{g}</button>
      ))}
      <div style={sep} />
      {EQUIPMENT_TYPES.map(g => (
        <button key={g} onClick={() => onEquipment(equipment === g ? null : g)} style={outlineStyle(equipment === g)}>{g}</button>
      ))}
      <div style={sep} />
      {CATEGORY_TYPES.map(g => (
        <button key={g} onClick={() => onCategory(category === g ? null : g)} style={outlineStyle(category === g)}>{g}</button>
      ))}
    </div>
  );
}



export function LibraryPage({ data, save }) {
  const [filter, setFilter] = useState("All");
  const [eqFilter, setEqFilter] = useState(null);
  const [catFilter, setCatFilter] = useState(null);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [exName, setExName] = useState("");
  const [exMuscle, setExMuscle] = useState("Chest");
  const [exEquipment, setExEquipment] = useState("weighted");
  const [exCategory, setExCategory] = useState("strength");
  const [exYt, setExYt] = useState("");
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filtered = data.exercises.filter(e => {
    if (filter !== "All" && e.muscle !== filter) return false;
    if (eqFilter && (e.equipment || "weighted") !== eqFilter.toLowerCase()) return false;
    if (catFilter && (e.category || "strength") !== catFilter.toLowerCase()) return false;
    if (search && !e.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const startNew = () => { setEditing("new"); setExName(""); setExMuscle("Chest"); setExEquipment("weighted"); setExCategory("strength"); setExYt(""); setError(""); };
  const startEdit = (ex) => { setEditing(ex); setExName(ex.name); setExMuscle(ex.muscle); setExEquipment(ex.equipment || "weighted"); setExCategory(ex.category || "strength"); setExYt(ex.yt); setError(""); };
  const cancelEdit = () => setEditing(null);

  const saveExercise = () => {
    if (!exName.trim()) { setError("Give the exercise a name."); return; }
    const ytQuery = exYt.trim() || exName.trim().toLowerCase().replace(/\s+/g, "+") + "+form";
    if (editing === "new") {
      const ex = { id: "ex_" + uid(), name: exName.trim(), muscle: exMuscle, equipment: exEquipment, category: exCategory, yt: ytQuery };
      save({ ...data, exercises: [...data.exercises, ex] });
    } else {
      save({ ...data, exercises: data.exercises.map(e => e.id === editing.id ? { ...e, name: exName.trim(), muscle: exMuscle, equipment: exEquipment, category: exCategory, yt: ytQuery } : e) });
    }
    setEditing(null);
  };

  const deleteExercise = (id) => {
    const newSets = data.sets.map(s => ({ ...s, exerciseIds: s.exerciseIds.filter(eid => eid !== id) }));
    const newPrs = { ...data.prs };
    delete newPrs[id];
    save({ ...data, exercises: data.exercises.filter(e => e.id !== id), sets: newSets, prs: newPrs });
    setConfirmDelete(null);
  };

  if (editing) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: T.space.xl }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: T.fontSize.h1, fontWeight: T.fontWeight.heavy, margin: 0 }}>{editing === "new" ? "New" : "Edit"} Exercise</h2>
          <Btn variant="ghost" onClick={cancelEdit}>Cancel</Btn>
        </div>
        <Input label="Exercise Name" placeholder="e.g. Dumbbell Fly" value={exName} onChange={e => { setExName(e.target.value); setError(""); }} />
        <div>
          <label style={{ fontSize: T.fontSize.small, color: C.textDim, fontWeight: T.fontWeight.semi, textTransform: "uppercase", letterSpacing: T.letterSpacing.uppercase, marginBottom: T.space.base, display: "block" }}>Muscle Group</label>
          <PillFilter options={MUSCLE_GROUPS_NO_ALL} active={exMuscle} onChange={setExMuscle} small />
        </div>
        <div style={{ display: "flex", gap: T.space.xl }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: T.fontSize.small, color: C.textDim, fontWeight: T.fontWeight.semi, textTransform: "uppercase", letterSpacing: T.letterSpacing.uppercase, marginBottom: T.space.base, display: "block" }}>Equipment</label>
            <div style={{ display: "flex", gap: T.space.md }}>
              {[["weighted", "Weighted"], ["bodyweight", "Bodyweight"]].map(([v, l]) => (
                <button key={v} onClick={() => setExEquipment(v)} style={{ flex: 1, border: `1px solid ${exEquipment === v ? C.accent : C.border}`, borderRadius: T.radius.lg, padding: "8px 0", fontSize: T.fontSize.xs, fontWeight: T.fontWeight.semi, cursor: "pointer", background: exEquipment === v ? C.accentDim : "transparent", color: exEquipment === v ? C.accent : C.textDim, transition: `background ${T.transition.fast}, color ${T.transition.fast}, border-color ${T.transition.fast}` }}>{l}</button>
              ))}
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: T.fontSize.small, color: C.textDim, fontWeight: T.fontWeight.semi, textTransform: "uppercase", letterSpacing: T.letterSpacing.uppercase, marginBottom: T.space.base, display: "block" }}>Type</label>
            <div style={{ display: "flex", gap: T.space.md }}>
              {[["strength", "Strength"], ["mobility", "Mobility"]].map(([v, l]) => (
                <button key={v} onClick={() => setExCategory(v)} style={{ flex: 1, border: `1px solid ${exCategory === v ? C.accent : C.border}`, borderRadius: T.radius.lg, padding: "8px 0", fontSize: T.fontSize.xs, fontWeight: T.fontWeight.semi, cursor: "pointer", background: exCategory === v ? C.accentDim : "transparent", color: exCategory === v ? C.accent : C.textDim, transition: `background ${T.transition.fast}, color ${T.transition.fast}, border-color ${T.transition.fast}` }}>{l}</button>
              ))}
            </div>
          </div>
        </div>
        <Input label="YouTube Search (optional)" placeholder="Auto-generated if blank" value={exYt} onChange={e => setExYt(e.target.value)} />
        <ErrorBanner message={error} />
        <Btn onClick={saveExercise} style={{ width: "100%", padding: 14 }}>{editing === "new" ? "Add" : "Update"} Exercise</Btn>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: T.space.xl }}>
      {confirmDelete && <ConfirmDialog message={`Delete "${data.exercises.find(e => e.id === confirmDelete)?.name}"? It will be removed from all sets.`} onConfirm={() => deleteExercise(confirmDelete)} onCancel={() => setConfirmDelete(null)} />}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ fontSize: T.fontSize.h1, fontWeight: T.fontWeight.heavy, margin: 0, letterSpacing: T.letterSpacing.tight }}>Exercise Library</h2>
          <p style={{ color: C.textDim, fontSize: T.fontSize.caption, margin: `${T.space.sm}px 0 0` }}>{filtered.length} of {data.exercises.length} exercises</p>
        </div>
        <Btn onClick={startNew}>+ New</Btn>
      </div>
      <Input placeholder="Search exercises..." value={search} onChange={e => setSearch(e.target.value)} clearable onClear={() => setSearch("")} />
      <FilterBar muscle={filter} onMuscle={setFilter} equipment={eqFilter} onEquipment={setEqFilter} category={catFilter} onCategory={setCatFilter} small />
      <div style={{ display: "flex", flexDirection: "column", gap: T.space.base }}>
        {filtered.map(ex => (
          <Card key={ex.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: `${T.space.lg}px ${T.space.xl}px` }}>
            <div style={{ flex: 1, minWidth: 0, marginRight: T.space.base }}>
              <div style={{ fontWeight: T.fontWeight.bold, fontSize: T.fontSize.body }}>{ex.name}</div>
              <div style={{ display: "flex", gap: T.space.base, alignItems: "center", marginTop: T.space.xs }}>
                <span style={{ fontSize: T.fontSize.small, color: C.textDim }}>{MUSCLE_ICONS[ex.muscle] || ""} {ex.muscle}</span>
                {(ex.equipment === "bodyweight" || ex.category === "mobility") && (
                  <span style={{ fontSize: T.fontSize.xs, color: C.textDim, background: C.bg, padding: "2px 8px", borderRadius: T.radius.base }}>
                    {ex.equipment === "bodyweight" ? "BW" : ""}{ex.equipment === "bodyweight" && ex.category === "mobility" ? " · " : ""}{ex.category === "mobility" ? "MOB" : ""}
                  </span>
                )}
              </div>
            </div>
            <div style={{ display: "flex", gap: T.space.sm, alignItems: "center" }}>
              <YTButton query={ex.yt} label={ex.name} />
              <button onClick={() => startEdit(ex)} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: T.radius.md, color: C.textDim, cursor: "pointer", fontSize: T.fontSize.body, padding: "6px 10px", lineHeight: 1 }}>✎</button>
              <button onClick={() => setConfirmDelete(ex.id)} style={{ background: C.dangerDim, border: `1px solid ${C.dangerBorder}`, borderRadius: T.radius.md, color: C.danger, cursor: "pointer", fontSize: T.fontSize.body, padding: "6px 10px", lineHeight: 1 }}>✕</button>
            </div>
          </Card>
        ))}
        {filtered.length === 0 && <p style={{ color: C.textDim, textAlign: "center", padding: T.space["3xl"] }}>No exercises found</p>}
      </div>
    </div>
  );
}


