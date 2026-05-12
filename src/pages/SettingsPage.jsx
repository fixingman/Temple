import { useState, useEffect } from "react";
import { T, C } from "../tokens";
import { DEFAULT_SETTINGS, mkDefault } from "../data";
import { Card, Btn, ConfirmDialog, ErrorBanner, Logo } from "../components";

function ApiKeyInput({ value, onChange }) {
  const [show, setShow] = useState(false);
  const [draft, setDraft] = useState(value);
  const dirty = draft !== value;

  // Sync if value changes externally (import/restore)
  useEffect(() => { setDraft(value); }, [value]);

  const save = () => onChange(draft.trim());
  const clear = () => { setDraft(""); onChange(""); };

  const isSaved = value && !dirty;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: T.space.base }}>
      <div style={{ display: "flex", gap: T.space.base }}>
        <input
          type={show ? "text" : "password"}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          name="api-key" placeholder="sk-ant-..."
          style={{ flex: 1, background: C.bg, border: `1px solid ${isSaved ? C.accentBorder : draft ? C.border : C.border}`, borderRadius: T.radius.lg, padding: "10px 12px", color: C.text, fontSize: T.fontSize.h3, outline: "none", fontFamily: T.font.mono, transition: `border-color ${T.transition.fast}` }}
        />
        <button onClick={() => setShow(s => !s)} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: T.radius.lg, color: C.textDim, cursor: "pointer", padding: "10px 12px", fontSize: T.fontSize.small, flexShrink: 0 }}>{show ? "Hide" : "Show"}</button>
      </div>

      {isSaved ? (
        /* Key is saved and unchanged — show confirmation state */
        <div style={{ display: "flex", gap: T.space.base, alignItems: "center" }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: T.space.base, padding: "12px 16px", background: C.accentDim, border: `1px solid ${C.accentBorder}`, borderRadius: T.radius.lg }}>
            <span style={{ color: C.accent, fontWeight: T.fontWeight.bold, fontSize: T.fontSize.body }}>✓</span>
            <div>
              <div style={{ fontSize: T.fontSize.small, color: C.accent, fontWeight: T.fontWeight.semi }}>Key saved</div>
              <div style={{ fontSize: T.fontSize.xs, color: C.textDim, fontFamily: T.font.mono }}>{value.slice(0, 10)}···{value.slice(-4)}</div>
            </div>
          </div>
          <Btn variant="danger" onClick={clear}>Remove</Btn>
        </div>
      ) : (
        /* Unsaved or dirty — show save button */
        <Btn onClick={save} disabled={!dirty || !draft.trim()} style={{ width: "100%" }}>
          Save Key
        </Btn>
      )}
    </div>
  );
}



export function SettingsPage({ data, save, drive }) {
  const [confirmReset, setConfirmReset] = useState(false);
  const [importText, setImportText] = useState("");
  const [importStatus, setImportStatus] = useState("");
  const [showImport, setShowImport] = useState(false);
  const [confirmRestore, setConfirmRestore] = useState(false);
  const unit = data.settings?.unit || "kg";

  const setUnit = (u) => save({ ...data, settings: { ...data.settings, unit: u } });

  const [exportDone, setExportDone] = useState("");

  const exportData = () => {
    const json = JSON.stringify(data, null, 2);
    try {
      navigator.clipboard.writeText(json).then(() => {
        setExportDone("Copied to clipboard. Paste into a file to save.");
        setTimeout(() => setExportDone(""), 3000);
      }).catch(() => tryDownload(json));
    } catch (e) { tryDownload(json); }
  };
  const tryDownload = (json) => {
    try {
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `temple-backup.json`;
      a.click(); URL.revokeObjectURL(url);
    } catch (e) {
      setExportDone("Copy failed. Use Import on another device to transfer data.");
      setTimeout(() => setExportDone(""), 4000);
    }
  };

  const doImport = () => {
    try {
      const parsed = JSON.parse(importText);
      if (!parsed.exercises || !parsed.sets || !parsed.sessions) { setImportStatus("Invalid format: missing exercises, sets, or sessions."); return; }
      if (!parsed.settings) parsed.settings = DEFAULT_SETTINGS;
      if (!parsed.prs) parsed.prs = {};
      save(parsed);
      setImportStatus(""); setShowImport(false); setImportText("");
    } catch (e) { setImportStatus("Invalid JSON. Paste the full contents of a Temple backup file."); }
  };

  const doRestore = async () => {
    setConfirmRestore(false);
    const restored = await drive.restore();
    if (restored) {
      if (!restored.exercises || !restored.sets || !restored.sessions) return;
      if (!restored.settings) restored.settings = DEFAULT_SETTINGS;
      if (!restored.prs) restored.prs = {};
      delete restored._backedUpAt;
      save(restored);
    }
  };

  const resetAll = () => { save(mkDefault()); setConfirmReset(false); };

  const driveReady = drive.status === "ready";
  const driveBusy = drive.status === "syncing" || drive.status === "signing-in";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: T.space.xl }}>
      {confirmReset && <ConfirmDialog message="Erase all data? This will delete all exercises, sets, sessions, and PRs. This cannot be undone." onConfirm={resetAll} onCancel={() => setConfirmReset(false)} />}
      {confirmRestore && <ConfirmDialog message="Restore from Google Drive? This will replace all current data with the backup." onConfirm={doRestore} onCancel={() => setConfirmRestore(false)} />}
      <h2 style={{ fontSize: T.fontSize.h1, fontWeight: T.fontWeight.heavy, margin: 0 }}>Settings</h2>

      {/* Weight settings — unit + bodyweight together */}
      <Card>
        <div style={{ fontSize: T.fontSize.body, fontWeight: T.fontWeight.bold, marginBottom: T.space.lg }}>Weight</div>

        {/* kg / lbs toggle */}
        <div style={{ display: "flex", gap: T.space.sm, background: C.bg, borderRadius: T.radius.lg, padding: 3, marginBottom: T.space.xl }}>
          {[{ v: "kg", l: "Kilograms (kg)" }, { v: "lbs", l: "Pounds (lbs)" }].map(o => (
            <button key={o.v} onClick={() => setUnit(o.v)} style={{ flex: 1, border: "none", borderRadius: T.radius.md, padding: "10px 0", fontSize: T.fontSize.caption, fontWeight: T.fontWeight.semi, cursor: "pointer", background: unit === o.v ? C.accentDim : "transparent", color: unit === o.v ? C.accent : C.textDim, transition: `background ${T.transition.fast}, color ${T.transition.fast}` }}>{o.l}</button>
          ))}
        </div>

        {/* Bodyweight */}
        <label style={{ fontSize: T.fontSize.small, color: C.textDim, fontWeight: T.fontWeight.semi, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: T.space.base }}>Your Bodyweight</label>
        <div style={{ display: "flex", gap: T.space.base, alignItems: "center", marginBottom: T.space.base }}>
          <input
            type="number" inputMode="decimal" min="0" name="bodyweight"
            placeholder={unit === "kg" ? "e.g. 80" : "e.g. 176"}
            value={unit === "kg" ? (data.settings?.bodyweightKg || "") : (data.settings?.bodyweightKg ? Math.round(Number(data.settings.bodyweightKg) * 2.20462) : "")}
            onChange={e => {
              const val = e.target.value;
              const kg = unit === "kg" ? val : val ? String(Math.round(Number(val) / 2.20462)) : "";
              save({ ...data, settings: { ...data.settings, bodyweightKg: kg } });
            }}
            style={{ flex: 1, background: C.bg, border: `1px solid ${C.border}`, borderRadius: T.radius.lg, padding: "10px 14px", color: C.text, fontSize: T.fontSize.h3, outline: "none", textAlign: "center" }}
          />
          <span style={{ fontSize: T.fontSize.body, color: C.textDim, fontWeight: T.fontWeight.semi, minWidth: 28 }}>{unit}</span>
        </div>
        <div style={{ fontSize: T.fontSize.xs, color: C.textDim, lineHeight: 1.5 }}>Used to estimate calories burnt per session. Stored locally, never shared.</div>
      </Card>

      {/* Google Drive Backup */}
      <Card>
        <div style={{ fontSize: T.fontSize.body, fontWeight: T.fontWeight.bold, marginBottom: T.space.sm }}>Google Drive Backup</div>
        <div style={{ fontSize: T.fontSize.xs, color: C.textDim, marginBottom: T.space.lg, lineHeight: 1.5 }}>
          Back up your workouts to Google Drive. Restore on any device, or protect against accidental data loss.
        </div>

        {!drive.user ? (
          <Btn onClick={drive.signIn} disabled={driveBusy} style={{ width: "100%" }}>
            {drive.status === "signing-in" ? "Signing in..." : "Connect Google Drive"}
          </Btn>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: T.space.base }}>
            {/* Connected user */}
            <div style={{ display: "flex", alignItems: "center", gap: T.space.lg, padding: "12px 14px", background: drive.connected ? C.accentDim : C.surface, borderRadius: T.radius.lg, border: `1px solid ${drive.connected ? C.accentBorder : C.border}`, opacity: drive.connected ? 1 : 0.7 }}>
              {drive.user.picture
                ? <img src={drive.user.picture} alt="" style={{ width: 36, height: 36, borderRadius: "50%", flexShrink: 0 }} />
                : <div style={{ width: 36, height: 36, borderRadius: "50%", background: drive.connected ? C.accent : C.textDim, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: T.fontSize.body, fontWeight: T.fontWeight.bold, color: C.bg }}>
                    {(drive.user.name || drive.user.email || "G")[0].toUpperCase()}
                  </div>
              }
              <div style={{ flex: 1, minWidth: 0 }}>
                {drive.user.name && <div style={{ fontSize: T.fontSize.bodySmall, fontWeight: T.fontWeight.bold, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{drive.user.name}</div>}
                {drive.user.email && <div style={{ fontSize: T.fontSize.xs, color: C.textDim, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{drive.user.email}</div>}
                {!drive.user.name && !drive.user.email && <div style={{ fontSize: T.fontSize.bodySmall, color: drive.connected ? C.accent : C.textDim, fontWeight: T.fontWeight.semi }}>{drive.connected ? "Google Drive connected" : "Google Drive"}</div>}
                {!drive.connected && <div style={{ fontSize: T.fontSize.xs, color: C.textDim, marginTop: 2 }}>Authorization required</div>}
              </div>
            </div>

            {drive.lastSync && (
              <div style={{ fontSize: T.fontSize.xs, color: C.textDim }}>Last backup: {drive.lastSync.toLocaleString()}</div>
            )}

            {drive.connected ? (
              <div style={{ display: "flex", gap: T.space.base }}>
                <Btn onClick={() => drive.backup(data)} disabled={driveBusy} style={{ flex: 1 }}>
                  {drive.status === "syncing" ? "Saving..." : "Back Up Now"}
                </Btn>
                <Btn variant="secondary" onClick={() => setConfirmRestore(true)} disabled={driveBusy} style={{ flex: 1 }}>
                  Restore
                </Btn>
              </div>
            ) : (
              <Btn onClick={drive.signIn} disabled={driveBusy} style={{ width: "100%" }}>
                {driveBusy ? "Signing in..." : "Authorize to Back Up"}
              </Btn>
            )}

            <Btn variant="danger" onClick={drive.signOut} style={{ width: "100%" }}>
              Disconnect Google Drive
            </Btn>
          </div>
        )}

        {drive.message && (
          <div style={{ fontSize: T.fontSize.small, color: drive.message.includes("fail") || drive.message.includes("failed") ? C.danger : C.accent, fontWeight: T.fontWeight.semi, marginTop: T.space.base }}>
            {drive.message}
          </div>
        )}
      </Card>

      {/* AI Features */}
      <Card>
        <div style={{ fontSize: T.fontSize.body, fontWeight: T.fontWeight.bold, marginBottom: T.space.sm }}>AI Features</div>
        <div style={{ fontSize: T.fontSize.xs, color: C.textDim, marginBottom: T.space.lg, lineHeight: 1.5 }}>
          Used for Body Check — post-workout pain guidance. Your key is stored on this device only and sent directly to Anthropic.
        </div>
        <ApiKeyInput
          value={data.settings?.anthropicKey || ""}
          onChange={key => save({ ...data, settings: { ...data.settings, anthropicKey: key } })}
        />
        <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer" style={{ display: "block", marginTop: T.space.lg, fontSize: T.fontSize.xs, color: C.textDim, textDecoration: "none" }}>
          Get a free API key at console.anthropic.com →
        </a>
      </Card>

      {/* Data Management */}
      <Card>
        <div style={{ fontSize: T.fontSize.body, fontWeight: T.fontWeight.bold, marginBottom: T.space.lg }}>Data Management</div>
        <div style={{ display: "flex", flexDirection: "column", gap: T.space.base }}>
          <Btn variant="secondary" onClick={exportData} style={{ width: "100%" }}>Export Data (JSON)</Btn>
          {exportDone && <div style={{ fontSize: T.fontSize.small, color: C.accent, fontWeight: T.fontWeight.semi }}>{exportDone}</div>}
          <Btn variant="secondary" onClick={() => setShowImport(!showImport)} style={{ width: "100%" }}>{showImport ? "Cancel Import" : "Import Data"}</Btn>
          {showImport && (
            <div style={{ display: "flex", flexDirection: "column", gap: T.space.base }}>
              <textarea value={importText} onChange={e => { setImportText(e.target.value); setImportStatus(""); }} name="import-data" placeholder="Paste your Temple backup JSON here..." rows={6} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: T.radius.lg, padding: "10px 12px", color: C.text, fontSize: T.fontSize.h3, outline: "none", resize: "vertical", fontFamily: T.font.mono }} />
              {importStatus && <ErrorBanner message={importStatus} />}
              <Btn onClick={doImport} disabled={!importText.trim()}>Import & Replace All Data</Btn>
            </div>
          )}
          <Btn variant="danger" onClick={() => setConfirmReset(true)} style={{ width: "100%" }}>Reset All Data</Btn>
        </div>
      </Card>

      {/* Stats */}
      <Card>
        <div style={{ fontSize: T.fontSize.body, fontWeight: T.fontWeight.bold, marginBottom: T.space.lg }}>Data Summary</div>
        <div style={{ display: "flex", flexDirection: "column", gap: T.space.sm, fontSize: T.fontSize.caption, color: C.textDim }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}><span>Exercises</span><span style={{ color: C.text, fontWeight: T.fontWeight.semi }}>{data.exercises.length}</span></div>
          <div style={{ display: "flex", justifyContent: "space-between" }}><span>Workout Sets</span><span style={{ color: C.text, fontWeight: T.fontWeight.semi }}>{data.sets.length}</span></div>
          <div style={{ display: "flex", justifyContent: "space-between" }}><span>Sessions Logged</span><span style={{ color: C.text, fontWeight: T.fontWeight.semi }}>{data.sessions.length}</span></div>
          <div style={{ display: "flex", justifyContent: "space-between" }}><span>PRs Set</span><span style={{ color: C.text, fontWeight: T.fontWeight.semi }}>{Object.keys(data.prs).length}</span></div>
        </div>
      </Card>

      {/* About */}
      <Card>
        <div style={{ fontSize: T.fontSize.body, fontWeight: T.fontWeight.bold, marginBottom: T.space.base }}>About</div>
        <div style={{ fontSize: T.fontSize.caption, color: C.textDim, lineHeight: 1.5 }}>
          <strong style={{ color: C.accent, display: "inline-flex", alignItems: "center", gap: 6 }}><Logo size={16} />Temple v0.9.2</strong><br />
          Your body is a temple. Train it.<br /><br />
          Built to replace subscription-gated workout apps. Free, private, all data stays on your device.
        </div>
      </Card>
    </div>
  );
}


