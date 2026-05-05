import React, { useState, useEffect, useCallback, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { T, C } from "./tokens";
import {
  MUSCLE_GROUPS, MUSCLE_GROUPS_NO_ALL, MUSCLE_ICONS,
  EQUIPMENT_TYPES, CATEGORY_TYPES, DEFAULT_REST, DEFAULT_SETTINGS,
  uid, fmtDate, fmtDateFull, fmt, mkDefault,
  displayWeight, toKg, weightLabel, est1RM,
} from "./data";
import { useAppData, usePWA } from "./hooks";
import { useGoogleDrive } from "./useGoogleDrive";
import { useCoach, coachError, prompts } from "./useCoach";

// ─── Shared Components ───
function Tabs({ active, onChange }) {
  const tabs = [
    { id: "library", icon: "📖", label: "Library" },
    { id: "sets", icon: "📋", label: "Sets" },
    { id: "session", icon: "▶️", label: "Train" },
    { id: "progress", icon: "📊", label: "Progress" },
    { id: "settings", icon: "⚙️", label: "Settings" },
  ];
  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: C.surface, borderTop: `1px solid ${C.border}`, display: "flex", zIndex: T.z.tabBar, paddingBottom: "env(safe-area-inset-bottom)" }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)} style={{ flex: 1, border: "none", background: "none", padding: "10px 0 8px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: T.space.xs, color: active === t.id ? C.accent : C.textDim, transition: `color ${T.transition.fast}` }}>
          <span style={{ fontSize: T.size.tabIcon }}>{t.icon}</span>
          <span style={{ fontSize: T.fontSize.xxs, fontWeight: T.fontWeight.semi, letterSpacing: T.letterSpacing.label, textTransform: "uppercase" }}>{t.label}</span>
        </button>
      ))}
    </div>
  );
}

function Card({ children, style, onClick, className }) {
  return <div className={className} onClick={onClick} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: T.radius.xl, padding: T.space.xl, ...style, cursor: onClick ? "pointer" : "default", transition: `border-color ${T.transition.fast}, background ${T.transition.fast}` }}>{children}</div>;
}

function Btn({ children, variant = "primary", style, disabled, onClick, ...props }) {
  const v = { primary: { background: C.accent, color: C.textOnAccent, fontWeight: T.fontWeight.bold }, secondary: { background: C.accentDim, color: C.accent, fontWeight: T.fontWeight.semi }, danger: { background: C.dangerDim, color: C.danger, fontWeight: T.fontWeight.semi }, ghost: { background: "transparent", color: C.textDim, fontWeight: T.fontWeight.medium } };
  return <button {...props} disabled={disabled} onClick={disabled ? undefined : onClick} style={{ border: "none", borderRadius: T.radius.lg, padding: "10px 18px", fontSize: T.fontSize.bodySmall, cursor: disabled ? "not-allowed" : "pointer", transition: `opacity ${T.transition.fast}`, opacity: disabled ? T.opacity.disabled : 1, ...v[variant], ...style }}>{children}</button>;
}

function Input({ label, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: T.space.sm }}>
      {label && <label style={{ fontSize: T.fontSize.small, color: C.textDim, fontWeight: T.fontWeight.semi, textTransform: "uppercase", letterSpacing: T.letterSpacing.uppercase }}>{label}</label>}
      <input {...props} onFocus={e => { setFocused(true); props.onFocus?.(e); }} onBlur={e => { setFocused(false); props.onBlur?.(e); }} style={{ background: C.bg, border: `1px solid ${focused ? C.accent : C.border}`, borderRadius: T.radius.lg, padding: "10px 12px", color: C.text, fontSize: T.fontSize.h3, outline: "none", transition: `border-color ${T.transition.fast}`, ...props.style }} />
    </div>
  );
}

function YTButton({ query, label }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)} style={{ display: "inline-flex", alignItems: "center", gap: T.space.sm, background: C.youtubeDim, color: C.youtube, border: "none", borderRadius: T.radius.md, padding: "5px 10px", fontSize: T.fontSize.xs, fontWeight: T.fontWeight.bold, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>▶ Form</button>
      {open && <VideoSheet query={query} label={label} onClose={() => setOpen(false)} />}
    </>
  );
}

function VideoSheet({ query, label, onClose }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(null);
  const selectedVideo = selectedIndex !== null ? videos[selectedIndex] : null;

  useEffect(() => {
    let cancelled = false;
    setLoading(true); setError(""); setVideos([]);
    fetch(`/api/youtube?q=${encodeURIComponent(query)}`)
      .then(r => r.json())
      .then(data => {
        if (cancelled) return;
        if (data.error) { setError(data.error); }
        else { setVideos(data.videos || []); }
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) { setError("Could not load videos. Check your connection."); setLoading(false); }
      });
    return () => { cancelled = true; };
  }, [query]);

  const fallbackUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: C.overlay, zIndex: T.z.modal + 10, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <div className="t-slide-up" onClick={e => e.stopPropagation()} style={{ background: C.surface, borderRadius: `${T.radius.xl}px ${T.radius.xl}px 0 0`, maxHeight: "92vh", display: "flex", flexDirection: "column" }}>

        {/* Handle */}
        <div style={{ width: 36, height: 4, borderRadius: T.radius.sm, background: C.border, margin: `${T.space.base}px auto ${T.space.base}px`, flexShrink: 0 }} />

        {/* Header */}
        <div style={{ padding: `0 ${T.space.xl}px ${T.space.base}px`, display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: T.fontSize.h3, fontWeight: T.fontWeight.bold }}>{label || "Form Guide"}</div>
            <div style={{ fontSize: T.fontSize.xs, color: C.textDim, marginTop: 2 }}>
              {selectedIndex !== null ? `${selectedIndex + 1} of ${videos.length}` : `${videos.length > 0 ? videos.length : ""} results`}
            </div>
          </div>
          <div style={{ display: "flex", gap: T.space.base, alignItems: "center" }}>
            {selectedIndex !== null && (
              <button onClick={() => setSelectedIndex(null)} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: T.radius.md, color: C.textDim, cursor: "pointer", padding: `${T.space.sm}px ${T.space.lg}px`, fontSize: T.fontSize.small }}>← List</button>
            )}
            <button onClick={onClose} style={{ background: C.bg, border: "none", color: C.textDim, cursor: "pointer", borderRadius: T.radius.full, width: 28, height: 28, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
          </div>
        </div>

        {/* Content */}
        {selectedIndex !== null ? (
          /* Video player with prev/next */
          <div style={{ flex: 1, background: "#000", display: "flex", flexDirection: "column" }}>
            <iframe
              key={selectedVideo?.id}
              src={`https://www.youtube.com/embed/${selectedVideo?.id}?autoplay=1&rel=0&modestbranding=1`}
              style={{ flex: 1, width: "100%", border: "none", minHeight: 260 }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={selectedVideo?.title || label}
            />
            {/* Title + nav */}
            <div style={{ background: C.surface, padding: `${T.space.lg}px ${T.space.xl}px`, display: "flex", flexDirection: "column", gap: T.space.base }}>
              <div style={{ fontSize: T.fontSize.small, fontWeight: T.fontWeight.semi, color: C.text, lineHeight: 1.4 }}>{selectedVideo?.title}</div>
              <div style={{ fontSize: T.fontSize.xs, color: C.textDim }}>{selectedVideo?.channel}</div>
              <div style={{ display: "flex", gap: T.space.base }}>
                <button
                  onClick={() => setSelectedIndex(i => Math.max(0, i - 1))}
                  disabled={selectedIndex === 0}
                  style={{ flex: 1, background: C.bg, border: `1px solid ${C.border}`, borderRadius: T.radius.lg, padding: "12px", color: selectedIndex === 0 ? C.border : C.text, cursor: selectedIndex === 0 ? "default" : "pointer", fontSize: T.fontSize.body, fontWeight: T.fontWeight.bold }}
                >← Prev</button>
                <button
                  onClick={() => setSelectedIndex(i => Math.min(videos.length - 1, i + 1))}
                  disabled={selectedIndex === videos.length - 1}
                  style={{ flex: 1, background: C.bg, border: `1px solid ${C.border}`, borderRadius: T.radius.lg, padding: "12px", color: selectedIndex === videos.length - 1 ? C.border : C.accent, cursor: selectedIndex === videos.length - 1 ? "default" : "pointer", fontSize: T.fontSize.body, fontWeight: T.fontWeight.bold }}
                >Next →</button>
              </div>
            </div>
            <div style={{ height: "env(safe-area-inset-bottom)", background: C.surface }} />
          </div>
        ) : (
          /* Search results list */
          <div style={{ flex: 1, overflowY: "auto", padding: T.space.base }}>
            {loading && (
              <div style={{ display: "flex", flexDirection: "column", gap: T.space.base, padding: T.space.base }}>
                {[1,2,3,4].map(i => (
                  <div key={i} style={{ display: "flex", gap: T.space.lg, alignItems: "center" }}>
                    <div style={{ width: 120, height: 68, borderRadius: T.radius.md, background: C.border, flexShrink: 0 }} />
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: T.space.sm }}>
                      <div style={{ height: 14, background: C.border, borderRadius: T.radius.sm, width: "80%" }} />
                      <div style={{ height: 12, background: C.border, borderRadius: T.radius.sm, width: "50%" }} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {error && (
              <div style={{ padding: T.space.xl, textAlign: "center" }}>
                <div style={{ color: C.danger, fontSize: T.fontSize.small, marginBottom: T.space.xl }}>{error}</div>
                <a href={fallbackUrl} target="_blank" rel="noopener noreferrer" style={{ color: C.accent, fontSize: T.fontSize.small }}>Open YouTube instead →</a>
              </div>
            )}

            {!loading && !error && videos.map((v, i) => (
              <button key={v.id} onClick={() => setSelectedIndex(i)} style={{ width: "100%", background: selectedIndex === i ? C.accentDim : "none", border: `1px solid ${selectedIndex === i ? C.accentBorder : "transparent"}`, display: "flex", gap: T.space.lg, alignItems: "center", padding: `${T.space.base}px ${T.space.sm}px`, borderRadius: T.radius.lg, cursor: "pointer", textAlign: "left", marginBottom: T.space.sm }}>
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <img src={v.thumbnail} alt="" style={{ width: 120, height: 68, borderRadius: T.radius.md, objectFit: "cover", display: "block", background: C.border }} />
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: 28, height: 28, background: "rgba(0,0,0,0.7)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ color: "#fff", fontSize: 10, paddingLeft: 2 }}>▶</span>
                    </div>
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: T.fontSize.small, fontWeight: T.fontWeight.semi, color: C.text, lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{v.title}</div>
                  <div style={{ fontSize: T.fontSize.xs, color: C.textDim, marginTop: T.space.xs }}>{v.channel}</div>
                </div>
              </button>
            ))}

            {!loading && !error && videos.length === 0 && (
              <div style={{ padding: T.space.xl, textAlign: "center" }}>
                <div style={{ color: C.textDim, fontSize: T.fontSize.small, marginBottom: T.space.xl }}>No videos found.</div>
                <a href={fallbackUrl} target="_blank" rel="noopener noreferrer" style={{ color: C.accent, fontSize: T.fontSize.small }}>Search on YouTube →</a>
              </div>
            )}

            <div style={{ height: "env(safe-area-inset-bottom)", flexShrink: 0 }} />
          </div>
        )}
      </div>
    </div>
  );
}
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
          placeholder="sk-ant-..."
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

function PRBadge() { return <span style={{ background: C.prDim, color: C.pr, fontSize: T.fontSize.xxs, fontWeight: T.fontWeight.heavy, padding: "2px 8px", borderRadius: T.radius.full, letterSpacing: T.letterSpacing.uppercase }}>🏆 PR</span>; }

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

function ConfirmDialog({ message, onConfirm, onCancel, confirmLabel = "Delete", cancelLabel = "Cancel" }) {
  return (
    <div className="t-fade-in" style={{ position: "fixed", inset: 0, background: C.overlay, display: "flex", alignItems: "center", justifyContent: "center", zIndex: T.z.modal, padding: T.space.xl }}>
      <div className="t-scale-in" style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: T.radius.xl, padding: T.space["2xl"], maxWidth: 320, width: "100%" }}>
        <div style={{ fontSize: T.fontSize.body, fontWeight: T.fontWeight.semi, marginBottom: T.space.xl, color: C.text, lineHeight: 1.5 }}>{message}</div>
        <div style={{ display: "flex", gap: T.space.base }}><Btn variant="ghost" onClick={onCancel} style={{ flex: 1 }}>{cancelLabel}</Btn><Btn variant="danger" onClick={onConfirm} style={{ flex: 1 }}>{confirmLabel}</Btn></div>
      </div>
    </div>
  );
}

function ErrorBanner({ message }) {
  if (!message) return null;
  return <div style={{ background: C.dangerDim, border: `1px solid ${C.dangerBorder}`, borderRadius: T.radius.lg, padding: "10px 14px", fontSize: T.fontSize.small, color: C.danger, fontWeight: T.fontWeight.semi }}>{message}</div>;
}

function PillFilter({ options, active, onChange, small }) {
  return (
    <div style={{ display: "flex", gap: T.space.md, flexWrap: "wrap" }}>
      {options.map(g => (
        <button key={g} onClick={() => onChange(g)} style={{ border: "none", borderRadius: T.radius.full, padding: small ? "5px 12px" : "6px 14px", fontSize: small ? T.fontSize.xs : T.fontSize.small, fontWeight: T.fontWeight.semi, cursor: "pointer", transition: `background ${T.transition.fast}, color ${T.transition.fast}, border-color ${T.transition.fast}`, background: active === g ? C.accentDim : C.surface, color: active === g ? C.accent : C.textDim }}>{g}</button>
      ))}
    </div>
  );
}

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

// ─── Library Page (with CRUD) ───
function LibraryPage({ data, save }) {
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
      <Input placeholder="Search exercises..." value={search} onChange={e => setSearch(e.target.value)} />
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

// ─── Sets Page (with reordering) ───
function SetsPage({ data, save, onStartSession, coach }) {
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");
  const [selected, setSelected] = useState([]);
  const [muscleFilter, setMuscleFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [error, setError] = useState("");
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState("");

  const startCreate = () => { setCreating(true); setEditingId(null); setName(""); setSelected([]); setMuscleFilter("All"); setSearch(""); setError(""); };
  const startEdit = (s) => { setCreating(true); setEditingId(s.id); setName(s.name); setSelected([...s.exerciseIds]); setMuscleFilter("All"); setSearch(""); setError(""); };
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

  const suggestOrder = async () => {
    if (selected.length < 2) return;
    setOrderLoading(true); setOrderError("");
    const exercises = selected.map(id => data.exercises.find(e => e.id === id)).filter(Boolean);
    const { text, error: err } = await coach.ask(
      prompts.exerciseOrder(exercises),
      { maxTokens: 300, model: "claude-haiku-4-5-20251001" }
    );
    if (err) { setOrderError(coachError(err)); setOrderLoading(false); return; }
    try {
      // Parse JSON array of names from response
      const match = text.match(/\[[\s\S]*?\]/);
      if (!match) throw new Error("no json");
      const names = JSON.parse(match[0]);
      // Reorder selected to match suggested order
      const nameToId = {};
      exercises.forEach(e => { nameToId[e.name.toLowerCase()] = e.id; });
      const reordered = names
        .map(n => nameToId[n.toLowerCase()])
        .filter(Boolean);
      // Add any exercises not in the suggestion at the end
      const missing = selected.filter(id => !reordered.includes(id));
      setSelected([...reordered, ...missing]);
    } catch {
      setOrderError("Could not parse suggestion. Try again.");
    }
    setOrderLoading(false);
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
                  <button
                    onClick={suggestOrder}
                    disabled={orderLoading}
                    style={{ flexShrink: 0, marginLeft: T.space.base, background: "none", border: `1px solid ${C.border}`, borderRadius: T.radius.md, color: orderLoading ? C.textDim : C.accent, cursor: orderLoading ? "default" : "pointer", fontSize: T.fontSize.xs, fontWeight: T.fontWeight.semi, padding: "5px 10px", whiteSpace: "nowrap", transition: `color ${T.transition.fast}` }}
                  >
                    {orderLoading ? "Ordering..." : "✦ Suggest order"}
                  </button>
                )}
              </div>
              {orderError && <div style={{ fontSize: T.fontSize.xs, color: C.danger, marginBottom: T.space.base }}>{orderError}</div>}
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
          <input
            type="text"
            placeholder="Search exercises..."
            value={search}
            onChange={e => { setSearch(e.target.value); if (e.target.value) setMuscleFilter("All"); }}
            style={{ width: "100%", boxSizing: "border-box", background: C.surface, border: `1px solid ${search ? C.accent : C.border}`, borderRadius: T.radius.lg, padding: "10px 14px", color: C.text, fontSize: T.fontSize.h3, outline: "none", marginTop: T.space.base, marginBottom: T.space.base, transition: `border-color ${T.transition.fast}` }}
          />

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
        return (
          <Card key={s.id}>
            <div style={{ marginBottom: T.space.base }}>
              <div style={{ fontWeight: T.fontWeight.heavy, fontSize: T.fontSize.h3 }}>{s.name}</div>
              <div style={{ fontSize: T.fontSize.small, color: C.textDim, marginTop: T.space.xs }}>{exNames.length} exercises · {sessionCount} sessions</div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: T.space.sm, marginBottom: T.space.lg }}>
              {exNames.slice(0, 5).map((n, i) => <span key={i} style={{ fontSize: T.fontSize.xs, background: C.bg, padding: "3px 8px", borderRadius: T.radius.md, color: C.textDim }}>{n}</span>)}
              {exNames.length > 5 && <span style={{ fontSize: T.fontSize.xs, color: C.textDim, padding: "3px 4px" }}>+{exNames.length - 5} more</span>}
            </div>
            <div style={{ display: "flex", gap: T.space.base }}>
              <Btn variant="primary" onClick={() => onStartSession(s)} disabled={validCount === 0} style={{ flex: 1 }}>▶ Start</Btn>
              <Btn variant="secondary" onClick={() => startEdit(s)}>Edit</Btn>
              <Btn variant="danger" onClick={() => setConfirmDelete(s.id)}>✕</Btn>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

// ─── Session Page (redesigned training flow) ───

function SessionPage({ data, save, activeSet, setActiveSet, setTab, coach }) {
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
  const intervalRef = useRef(null);
  const restRef = useRef(null);
  const unit = data.settings?.unit || "kg";
  const wl = weightLabel(unit);

  // Find last session for this set to pre-fill values
  const getLastSessionData = (setId, exerciseIds) => {
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
  };

  useEffect(() => {
    if (activeSet) {
      const validIds = activeSet.exerciseIds.filter(eid => data.exercises.some(e => e.id === eid));
      if (validIds.length === 0) { setActiveSet(null); return; }
      const lastData = getLastSessionData(activeSet.id, validIds);
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
            <div style={{ display: "flex", gap: T.space.lg }}>
              {!isBodyweight && !isMobility && (
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: T.fontSize.xs, color: C.textDim, fontWeight: T.fontWeight.semi, textTransform: "uppercase", marginBottom: T.space.sm, display: "block" }}>Weight ({wl})</label>
                  <input type="number" inputMode="decimal" min="0" value={currentSet.weight} onChange={e => updateCurrentSet("weight", e.target.value)} placeholder="0"
                    style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: T.radius.lg, padding: "14px 16px", color: C.text, fontSize: T.fontSize.h2, fontWeight: T.fontWeight.bold, outline: "none", width: "100%", boxSizing: "border-box", textAlign: "center" }} />
                </div>
              )}
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: T.fontSize.xs, color: C.textDim, fontWeight: T.fontWeight.semi, textTransform: "uppercase", marginBottom: T.space.sm, display: "block" }}>{isMobility ? "Seconds" : "Reps"}</label>
                <input type="number" inputMode="numeric" min="0" value={currentSet.reps} onChange={e => updateCurrentSet("reps", e.target.value)} placeholder="0"
                  style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: T.radius.lg, padding: "14px 16px", color: C.text, fontSize: T.fontSize.h2, fontWeight: T.fontWeight.bold, outline: "none", width: "100%", boxSizing: "border-box", textAlign: "center" }} />
              </div>
            </div>

            {/* Log Set — the primary action */}
            <Btn onClick={logSet} disabled={!canLogCurrent} style={{ width: "100%", padding: 18, fontSize: T.fontSize.body, marginTop: T.space.xl }}>
              Log Set {entry.logged.length + 1}
            </Btn>
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

// ─── Progress Page ───
function MuscleBar({ label, value, max, icon, unit }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div style={{ marginBottom: T.space.lg }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: T.space.sm }}>
        <span style={{ fontSize: T.fontSize.bodySmall, fontWeight: T.fontWeight.semi }}>{icon} {label}</span>
        <span style={{ fontSize: T.fontSize.small, color: C.accent, fontWeight: T.fontWeight.bold }}>{displayWeight(value, unit).toLocaleString()} {weightLabel(unit)}</span>
      </div>
      <div style={{ height: 8, background: C.bg, borderRadius: T.radius.base, overflow: "hidden" }}>
        <div style={{ height: "100%", background: C.accent, width: `${pct}%`, borderRadius: T.radius.base, transition: `width ${T.duration.medium} ${T.easing.enter}` }} />
      </div>
    </div>
  );
}

function ProgressPage({ data, onRepeatSession }) {
  const [view, setView] = useState("prs");
  const [selectedExId, setSelectedExId] = useState(null);
  const unit = data.settings?.unit || "kg";
  const wl = weightLabel(unit);

  const { prEntries, totalSessions, totalVol, weeksActive, thisWeekSessions, muscleEntries } = React.useMemo(() => {
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

    return { prEntries, totalSessions, totalVol, weeksActive, thisWeekSessions, muscleEntries };
  }, [data.sessions, data.prs, data.exercises]);

  const maxMuscleVol = Math.max(...muscleEntries.map(([, v]) => v), 1);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: T.space.xl }}>
      <h2 style={{ fontSize: T.fontSize.h1, fontWeight: T.fontWeight.heavy, margin: 0 }}>Progress</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: T.space.base }}>
        <Card style={{ textAlign: "center", padding: T.space.lg }}><div style={{ fontSize: T.fontSize.statMd, fontWeight: T.fontWeight.heavy, color: C.accent }}>{totalSessions}</div><div style={{ fontSize: T.fontSize.xxs, color: C.textDim, fontWeight: T.fontWeight.semi }}>SESSIONS</div></Card>
        <Card style={{ textAlign: "center", padding: T.space.lg }}><div style={{ fontSize: T.fontSize.statMd, fontWeight: T.fontWeight.heavy, color: C.accent }}>{thisWeekSessions}</div><div style={{ fontSize: T.fontSize.xxs, color: C.textDim, fontWeight: T.fontWeight.semi }}>THIS WEEK</div></Card>
        <Card style={{ textAlign: "center", padding: T.space.lg }}><div style={{ fontSize: T.fontSize.statMd, fontWeight: T.fontWeight.heavy, color: weeksActive >= 3 ? C.accent : C.pr }}>{weeksActive}<span style={{ fontSize: T.fontSize.xs, fontWeight: T.fontWeight.semi }}>/4</span></div><div style={{ fontSize: T.fontSize.xxs, color: C.textDim, fontWeight: T.fontWeight.semi }}>WEEKS ACTIVE</div></Card>
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
        {[["prs", "🏆 PRs"], ["muscles", "💪 Muscles"], ["history", "📅 History"]].map(([v, l]) => (
          <button key={v} onClick={() => setView(v)} style={{ flex: 1, border: "none", borderRadius: T.radius.md, padding: "8px 0", fontSize: T.fontSize.caption, fontWeight: T.fontWeight.semi, cursor: "pointer", background: view === v ? C.bg : "transparent", color: view === v ? C.text : C.textDim, transition: `background ${T.transition.fast}, color ${T.transition.fast}, border-color ${T.transition.fast}` }}>{l}</button>
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

            const customTooltip = ({ active, payload }) => {
              if (!active || !payload || !payload[0]) return null;
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
            };

            return (
              <Card key={i} style={{ border: isOpen ? `1px solid ${C.accent}` : undefined }}>
                {/* Header — always visible, tappable */}
                <div onClick={() => setSelectedExId(isOpen ? null : pr.exerciseId)} style={{ cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: T.fontWeight.heavy, fontSize: T.fontSize.body }}>{pr.exerciseName}</div>
                    <div style={{ fontSize: T.fontSize.xs, color: C.textDim }}>{MUSCLE_ICONS[exercise?.muscle] || ""} {pr.muscle}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: T.space.base }}>
                    <PRBadge />
                    <span style={{ color: C.textDim, fontSize: T.fontSize.h2, lineHeight: 1, transition: `transform ${T.transition.spring}`, transform: isOpen ? "rotate(45deg)" : "none" }}>+</span>
                  </div>
                </div>

                {/* Stats — always visible */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: T.space.sm, marginTop: T.space.lg }}>
                  {[["maxWeight", `MAX ${wl.toUpperCase()}`], ["maxReps", "MAX REPS"], ["maxVolume", "VOLUME"], ["est1rm", "EST 1RM"]].map(([k, l]) => {
                    let val;
                    if (k === "maxReps") val = pr[k];
                    else if (k === "est1rm") {
                      // Compute from best set across all sessions
                      let best = 0;
                      data.sessions.forEach(s => {
                        const entry = s.entries.find(e => e.exerciseId === pr.exerciseId);
                        if (!entry) return;
                        entry.sets.forEach(st => { const e = est1RM(st.weight, st.reps); if (e > best) best = e; });
                      });
                      val = best > 0 ? displayWeight(best, unit) : "—";
                    } else val = displayWeight(pr[k], unit);
                    return (
                      <div key={k} style={{ background: C.bg, borderRadius: T.radius.md, padding: "6px 8px", textAlign: "center" }}>
                        <div style={{ fontSize: T.fontSize.bodySmall, fontWeight: T.fontWeight.heavy, color: k === "est1rm" ? C.pr : C.accent }}>{val}</div>
                        <div style={{ fontSize: T.fontSize.micro, color: C.textDim, fontWeight: T.fontWeight.semi }}>{l}</div>
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
                          <div key={j} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: j < chartData.length - 1 ? `1px solid ${C.border}` : "none" }}>
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
        <Card>
          {muscleEntries.length === 0 && <div style={{ textAlign: "center", padding: T.space["2xl"], color: C.textDim }}>Complete a workout to see muscle breakdown</div>}
          {muscleEntries.map(([muscle, vol]) => (
            <MuscleBar key={muscle} label={muscle} value={vol} max={maxMuscleVol} icon={MUSCLE_ICONS[muscle] || ""} unit={unit} />
          ))}
          {muscleEntries.length > 0 && (
            <div style={{ fontSize: T.fontSize.xs, color: C.textDim, marginTop: T.space.base, textAlign: "center" }}>Total volume across all sessions</div>
          )}
        </Card>
      )}

      {/* History tab */}
      {view === "history" && (
        <div style={{ display: "flex", flexDirection: "column", gap: T.space.base }}>
          {data.sessions.length === 0 && <Card style={{ textAlign: "center", padding: T.space["3xl"], color: C.textDim }}>No sessions yet</Card>}
          {[...data.sessions].reverse().map(s => {
            const set = data.sets.find(ws => ws.id === s.setId);
            const vol = s.entries.reduce((a, e) => a + e.sets.reduce((b, st) => b + st.reps * st.weight, 0), 0);
            return (
              <Card key={s.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: T.fontWeight.bold, fontSize: T.fontSize.body }}>{set?.name || "Deleted Set"}</div>
                    <div style={{ fontSize: T.fontSize.small, color: C.textDim }}>{fmtDateFull(s.date)} {s.duration ? `· ${Math.floor(s.duration / 60)}min` : ""}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: T.space.xl, marginTop: T.space.base, fontSize: T.fontSize.small, color: C.textDim }}>
                  <span>{s.entries.length} exercises</span>
                  <span>{s.entries.reduce((a, e) => a + e.sets.length, 0)} sets</span>
                  <span style={{ color: C.accent, fontWeight: T.fontWeight.bold }}>{displayWeight(vol, unit).toLocaleString()} {wl}</span>
                </div>
                {set && (
                  <div style={{ marginTop: T.space.lg }}>
                    <Btn variant="secondary" onClick={() => onRepeatSession(set)} style={{ width: "100%", fontSize: T.fontSize.small }}>▶ Repeat This Workout</Btn>
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

// ─── Settings Page ───
function SettingsPage({ data, save, drive }) {
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

      {/* Unit */}
      <Card>
        <div style={{ fontSize: T.fontSize.body, fontWeight: T.fontWeight.bold, marginBottom: T.space.lg }}>Weight Unit</div>
        <div style={{ display: "flex", gap: T.space.sm, background: C.bg, borderRadius: T.radius.lg, padding: 3 }}>
          {[{ v: "kg", l: "Kilograms (kg)" }, { v: "lbs", l: "Pounds (lbs)" }].map(o => (
            <button key={o.v} onClick={() => setUnit(o.v)} style={{ flex: 1, border: "none", borderRadius: T.radius.md, padding: "10px 0", fontSize: T.fontSize.caption, fontWeight: T.fontWeight.semi, cursor: "pointer", background: unit === o.v ? C.accentDim : "transparent", color: unit === o.v ? C.accent : C.textDim, transition: `background ${T.transition.fast}, color ${T.transition.fast}, border-color ${T.transition.fast}` }}>{o.l}</button>
          ))}
        </div>
        <div style={{ fontSize: T.fontSize.xs, color: C.textDim, marginTop: T.space.base }}>All weights are stored in kg internally. Changing this only affects display.</div>
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
            <div style={{ display: "flex", alignItems: "center", gap: T.space.lg, padding: "12px 14px", background: C.accentDim, borderRadius: T.radius.lg, border: `1px solid ${C.accentBorder}` }}>
              {drive.user.picture
                ? <img src={drive.user.picture} alt="" style={{ width: 36, height: 36, borderRadius: "50%", flexShrink: 0 }} />
                : <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.accent, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: T.fontSize.body, fontWeight: T.fontWeight.bold, color: C.bg }}>
                    {(drive.user.name || drive.user.email || "G")[0].toUpperCase()}
                  </div>
              }
              <div style={{ flex: 1, minWidth: 0 }}>
                {drive.user.name && <div style={{ fontSize: T.fontSize.bodySmall, fontWeight: T.fontWeight.bold, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{drive.user.name}</div>}
                {drive.user.email && <div style={{ fontSize: T.fontSize.xs, color: C.textDim, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{drive.user.email}</div>}
                {!drive.user.name && !drive.user.email && <div style={{ fontSize: T.fontSize.bodySmall, color: C.accent, fontWeight: T.fontWeight.semi }}>Google Drive connected</div>}
              </div>
            </div>

            {drive.lastSync && (
              <div style={{ fontSize: T.fontSize.xs, color: C.textDim }}>Last backup: {drive.lastSync.toLocaleString()}</div>
            )}

            <div style={{ display: "flex", gap: T.space.base }}>
              <Btn onClick={() => drive.backup(data)} disabled={driveBusy} style={{ flex: 1 }}>
                {drive.status === "syncing" ? "Saving..." : "Back Up Now"}
              </Btn>
              <Btn variant="secondary" onClick={() => setConfirmRestore(true)} disabled={driveBusy} style={{ flex: 1 }}>
                Restore
              </Btn>
            </div>

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
              <textarea value={importText} onChange={e => { setImportText(e.target.value); setImportStatus(""); }} placeholder="Paste your Temple backup JSON here..." rows={6} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: T.radius.lg, padding: "10px 12px", color: C.text, fontSize: T.fontSize.h3, outline: "none", resize: "vertical", fontFamily: T.font.mono }} />
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
          <strong style={{ color: C.accent }}>🟁 Temple v0.8.2</strong><br />
          Your body is a temple. Train it.<br /><br />
          Built to replace subscription-gated workout apps. Free, private, all data stays on your device.
        </div>
      </Card>
    </div>
  );
}

function InstallBanner({ onInstall, onDismiss }) {
  return (
    <div style={{ background: C.accentDim, border: `1px solid ${C.accentBorder}`, borderRadius: T.radius.xl, padding: T.space.xl, display: "flex", alignItems: "center", gap: T.space.lg }}>
      <div style={{ fontSize: T.fontSize.statMd }}>🟁</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: T.fontWeight.bold, fontSize: T.fontSize.bodySmall, color: C.text }}>Install Temple</div>
        <div style={{ fontSize: T.fontSize.xs, color: C.textDim, marginTop: T.space.xs }}>Add to home screen for the full app experience</div>
      </div>
      <div style={{ display: "flex", gap: T.space.sm, flexShrink: 0 }}>
        <Btn variant="ghost" onClick={onDismiss} style={{ padding: "6px 10px", fontSize: T.fontSize.xs }}>Later</Btn>
        <Btn onClick={onInstall} style={{ padding: "6px 12px", fontSize: T.fontSize.xs }}>Install</Btn>
      </div>
    </div>
  );
}

// ─── Error Boundary ───
class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ fontFamily: T.font.body, color: C.text, background: C.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: T.space.xl }}>
          <div style={{ textAlign: "center", maxWidth: 360 }}>
            <div style={{ fontSize: T.fontSize.timer, marginBottom: T.space.lg }}>⚠️</div>
            <div style={{ fontWeight: T.fontWeight.heavy, fontSize: T.fontSize.h2, marginBottom: T.space.base }}>Something went wrong</div>
            <div style={{ fontSize: T.fontSize.caption, color: C.textDim, marginBottom: T.space.xl, lineHeight: 1.5 }}>{this.state.error?.message || "An unexpected error occurred."}</div>
            <button onClick={() => this.setState({ hasError: false, error: null })} style={{ background: C.accent, color: C.textOnAccent, border: "none", borderRadius: T.radius.lg, padding: "12px 24px", fontSize: T.fontSize.body, fontWeight: T.fontWeight.bold, cursor: "pointer" }}>Try Again</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── App ───
const GlobalStyles = () => (
  <style>{`
    @keyframes temple-logo-spin { 0% { transform: rotate(0deg) scale(0.8); opacity: 0; } 40% { opacity: 1; } 100% { transform: rotate(360deg) scale(1); opacity: 1; } }
    @keyframes temple-text-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes temple-fade-in { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes temple-fade-out { from { opacity: 1; } to { opacity: 0; } }
    @keyframes temple-pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
    @keyframes temple-scale-in { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
    @keyframes temple-slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
    .t-fade-in { animation: temple-fade-in 0.25s cubic-bezier(0, 0, 0.2, 1) both; }
    .t-scale-in { animation: temple-scale-in 0.2s cubic-bezier(0, 0, 0.2, 1) both; }
    .t-slide-up { animation: temple-slide-up 0.32s cubic-bezier(0.34, 1.56, 0.64, 1) both; }    .t-pulse { animation: temple-pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
    .t-logo-spin { animation: temple-logo-spin 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
    .t-text-in { animation: temple-text-in 0.4s cubic-bezier(0, 0, 0.2, 1) both; }
    input[type="number"]::-webkit-inner-spin-button,
    input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
    input[type="number"] { -moz-appearance: textfield; }
    * { -webkit-tap-highlight-color: transparent; }
  `}</style>
);

export default function Temple() {
  const { data, loading, saving, save } = useAppData();
  const [tab, setTab] = useState("sets");
  const [activeSet, setActiveSet] = useState(null);
  const pwa = usePWA();
  const drive = useGoogleDrive();
  const coach = useCoach(data?.settings?.anthropicKey || "");

  // ── Pull-to-refresh ──
  const [pullY, setPullY] = useState(0);
  const [pulling, setPulling] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const touchStartY = useRef(null);
  const scrollRef = useRef(null);
  const THRESHOLD = 72;

  const onTouchStart = useCallback((e) => {
    if (scrollRef.current?.scrollTop === 0) {
      touchStartY.current = e.touches[0].clientY;
    }
  }, []);

  const onTouchMove = useCallback((e) => {
    if (touchStartY.current === null || refreshing) return;
    if (scrollRef.current?.scrollTop > 0) { touchStartY.current = null; return; }
    const dy = e.touches[0].clientY - touchStartY.current;
    if (dy > 0) {
      e.preventDefault();
      const damped = dy < 40 ? dy : 40 + (dy - 40) * 0.3;
      setPullY(Math.min(damped, THRESHOLD + 20));
      setPulling(true);
    }
  }, [refreshing]);

  const onTouchEnd = useCallback(() => {
    if (!pulling) return;
    if (pullY >= THRESHOLD) {
      setRefreshing(true);
      setPullY(0);
      setTimeout(() => window.location.reload(), 600);
    } else {
      setPullY(0);
    }
    setPulling(false);
    touchStartY.current = null;
  }, [pulling, pullY]);

  const handleStartSession = (set) => { setActiveSet(set); setTab("session"); };

  const pullProgress = Math.min(pullY / THRESHOLD, 1);
  const logoRotate = pulling ? pullProgress * 180 : 0;
  const logoScale = 1 + pullProgress * 0.35;
  const logoOpacity = 0.5 + pullProgress * 0.5;

  if (loading) return (
    <div style={{ fontFamily: T.font.body, color: C.text, background: C.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <GlobalStyles />
      <div style={{ textAlign: "center" }}>
        <div className="t-logo-spin" style={{ fontSize: T.fontSize.hero, marginBottom: T.space.xl, display: "inline-block" }}>🟁</div>
        <div className="t-text-in" style={{ fontWeight: T.fontWeight.heavy, fontSize: T.fontSize.h1, color: C.accent, letterSpacing: T.letterSpacing.tight, animationDelay: "0.3s" }}>TEMPLE</div>
      </div>
    </div>
  );

  return (
    <ErrorBoundary>
      <GlobalStyles />
      <div
        style={{ fontFamily: T.font.body, color: C.text, background: C.bg, height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column" }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Header — safe-area aware, logo animates on pull */}
        <div style={{
          paddingTop: "calc(env(safe-area-inset-top) + 12px)",
          paddingBottom: T.space.base,
          paddingLeft: T.space.xl,
          paddingRight: T.space.xl,
          display: "flex", justifyContent: "center", alignItems: "center",
          background: C.bg, zIndex: T.z.header, flexShrink: 0,
          transform: pullY > 0 ? `translateY(${pullY * 0.4}px)` : "none",
          transition: pulling ? "none" : `transform 0.35s ${T.easing.spring}`,
          position: "relative",
        }}>
          <div style={{ fontWeight: T.fontWeight.black, fontSize: T.fontSize.h2, letterSpacing: T.letterSpacing.tight, color: C.accent, display: "flex", alignItems: "center", gap: T.space.sm, userSelect: "none" }}>
            <span style={{
              display: "inline-block",
              transform: refreshing ? "scale(1.3)" : `rotate(${logoRotate}deg) scale(${pulling ? logoScale : 1})`,
              opacity: pulling ? logoOpacity : 1,
              transition: pulling ? "none" : `transform 0.4s ${T.easing.spring}, opacity 0.25s`,
              animation: refreshing ? "temple-logo-spin 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards" : "none",
            }}>🟁</span>
            TEMPLE
          </div>

          {/* Pull hint */}
          {pulling && pullY > 8 && (
            <div style={{ position: "absolute", bottom: -T.space.lg, fontSize: T.fontSize.xs, color: C.textDim, opacity: pullProgress, letterSpacing: T.letterSpacing.label, textTransform: "uppercase" }}>
              {pullY >= THRESHOLD ? "Release" : "Pull to refresh"}
            </div>
          )}

          {saving && (
            <div style={{ position: "absolute", right: T.space.xl, display: "flex", alignItems: "center", gap: T.space.sm }}>
              <div className="t-pulse" style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent }} />
            </div>
          )}
        </div>

        {/* Scrollable content */}
        <div
          ref={scrollRef}
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            WebkitOverflowScrolling: "touch",
            transform: pullY > 0 ? `translateY(${pullY * 0.6}px)` : "none",
            transition: pulling ? "none" : `transform 0.35s ${T.easing.spring}`,
          }}
        >
          <div style={{ padding: `${T.space.base}px ${T.space.xl}px`, paddingBottom: "calc(env(safe-area-inset-bottom) + 90px)", maxWidth: T.size.maxWidth, margin: "0 auto" }}>
            {pwa.canInstall && <div style={{ marginBottom: T.space.xl }}><InstallBanner onInstall={pwa.install} onDismiss={pwa.dismiss} /></div>}
            {tab === "library" && <LibraryPage data={data} save={save} />}
            {tab === "sets" && <SetsPage data={data} save={save} onStartSession={handleStartSession} coach={coach} />}
            {tab === "session" && <SessionPage data={data} save={save} activeSet={activeSet} setActiveSet={setActiveSet} setTab={setTab} coach={coach} />}
            {tab === "progress" && <ProgressPage data={data} onRepeatSession={handleStartSession} />}
            {tab === "settings" && <SettingsPage data={data} save={save} drive={drive} />}
          </div>
        </div>

        <Tabs active={tab} onChange={setTab} />
      </div>
    </ErrorBoundary>
  );
}
