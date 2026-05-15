import { useState, useEffect, useCallback } from "react";
import { T, C } from "./tokens";

export function GlobalStyles() {
  return (
    <style>{`
      *, *::before, *::after { box-sizing: border-box; margin: 0; -webkit-tap-highlight-color: transparent; }
      body { background: ${C.bg}; color: ${C.text}; font-family: ${T.font.body}; -webkit-font-smoothing: antialiased; overscroll-behavior: none; }
      input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
      input[type=number] { -moz-appearance: textfield; }
      ::-webkit-scrollbar { display: none; }
      @keyframes temple-logo-spin { 0% { transform: rotate(0deg) scale(0.8); opacity: 0; } 40% { opacity: 1; } 100% { transform: rotate(360deg) scale(1); opacity: 1; } }
      @keyframes temple-text-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes temple-fade-in { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes temple-pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
      @keyframes temple-scale-in { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
      @keyframes temple-slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
      .t-fade-in { animation: temple-fade-in 0.25s cubic-bezier(0,0,0.2,1) both; }
      .t-scale-in { animation: temple-scale-in 0.2s cubic-bezier(0,0,0.2,1) both; }
      .t-slide-up { animation: temple-slide-up 0.32s cubic-bezier(0.34,1.56,0.64,1) both; }
      .t-logo-spin { animation: temple-logo-spin 0.8s cubic-bezier(0.34,1.56,0.64,1) forwards; }
      .t-text-in { animation: temple-text-in 0.4s cubic-bezier(0,0,0.2,1) both; }
      .t-pulse { animation: temple-pulse 1.5s ease-in-out infinite; }
    `}</style>
  );
}

export function Tabs({ active, onChange }) {
  const tabs = [
    { id: "library", icon: "📖", label: "Library" },
    { id: "sets",    icon: "📋", label: "Sets" },
    { id: "session", icon: "▶️",  label: "Train" },
    { id: "progress",icon: "📊", label: "Progress" },
    { id: "settings",icon: "⚙️", label: "Settings" },
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

export function Card({ children, style, onClick, className }) {
  return <div className={className} onClick={onClick} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: T.radius.xl, padding: T.space.xl, ...style, cursor: onClick ? "pointer" : "default", transition: `border-color ${T.transition.fast}` }}>{children}</div>;
}

export function Btn({ children, variant = "primary", style, disabled, onClick, ...props }) {
  const v = {
    primary:   { background: C.accent,     color: C.textOnAccent, fontWeight: T.fontWeight.bold },
    secondary: { background: C.accentDim,  color: C.accent,       fontWeight: T.fontWeight.semi },
    danger:    { background: C.dangerDim,  color: C.danger,       fontWeight: T.fontWeight.semi },
    ghost:     { background: "transparent",color: C.textDim,      fontWeight: T.fontWeight.medium },
  };
  return <button {...props} disabled={disabled} onClick={disabled ? undefined : onClick} style={{ border: "none", borderRadius: T.radius.lg, padding: "10px 18px", fontSize: T.fontSize.bodySmall, cursor: disabled ? "not-allowed" : "pointer", transition: `opacity ${T.transition.fast}`, opacity: disabled ? T.opacity.disabled : 1, ...v[variant], ...style }}>{children}</button>;
}

export function Input({ label, clearable, onClear, ...props }) {
  const [focused, setFocused] = useState(false);
  const showClear = clearable && props.value?.length > 0;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: T.space.sm }}>
      {label && <label style={{ fontSize: T.fontSize.small, color: C.textDim, fontWeight: T.fontWeight.semi, textTransform: "uppercase", letterSpacing: T.letterSpacing.uppercase }}>{label}</label>}
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        <input {...props}
          onFocus={e => { setFocused(true); props.onFocus?.(e); }}
          onBlur={e => { setFocused(false); props.onBlur?.(e); }}
          style={{ background: C.bg, border: `1px solid ${focused ? C.accent : C.border}`, borderRadius: T.radius.lg, padding: `10px ${showClear ? 36 : 12}px 10px 12px`, color: C.text, fontSize: T.fontSize.h3, outline: "none", transition: `border-color ${T.transition.fast}`, width: "100%", boxSizing: "border-box", ...props.style }} />
        {showClear && (
          <button onMouseDown={e => { e.preventDefault(); onClear?.(); }} style={{ position: "absolute", right: 10, background: "none", border: "none", color: C.textDim, cursor: "pointer", fontSize: T.fontSize.small, padding: `${T.space.xs}px ${T.space.sm}px`, lineHeight: 1 }}>✕</button>
        )}
      </div>
    </div>
  );
}

// Renders the pyramid mark without background — use for inline / text contexts
export function Logo({ size = 20, style }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="12 20 76 60" width={size} height={size * 0.6} style={style}>
      <rect x="34" y="20" width="12" height="12" fill={C.accent}/>
      <rect x="54" y="20" width="12" height="12" fill={C.accent}/>
      <rect x="23" y="44" width="23" height="12" fill={C.accent}/>
      <rect x="54" y="44" width="23" height="12" fill={C.accent}/>
      <rect x="12" y="68" width="34" height="12" fill={C.accent}/>
      <rect x="54" y="68" width="34" height="12" fill={C.accent}/>
    </svg>
  );
}

// Renders the mark with rounded dark background — use for splash / pull-to-refresh
export function LogoIcon({ size = 40, style }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width={size} height={size} style={style}>
      <rect width="100" height="100" rx="20" fill="#0a0a0f"/>
      <rect x="34" y="20" width="12" height="12" fill={C.accent}/>
      <rect x="54" y="20" width="12" height="12" fill={C.accent}/>
      <rect x="23" y="44" width="23" height="12" fill={C.accent}/>
      <rect x="54" y="44" width="23" height="12" fill={C.accent}/>
      <rect x="12" y="68" width="34" height="12" fill={C.accent}/>
      <rect x="54" y="68" width="34" height="12" fill={C.accent}/>
    </svg>
  );
}

export function ConfirmDialog({ message, onConfirm, onCancel, confirmLabel = "Delete", cancelLabel = "Cancel" }) {
  return (
    <div className="t-fade-in" style={{ position: "fixed", inset: 0, background: C.overlay, display: "flex", alignItems: "center", justifyContent: "center", zIndex: T.z.modal, padding: T.space.xl }}>
      <div className="t-scale-in" style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: T.radius.xl, padding: T.space["2xl"], maxWidth: 320, width: "100%" }}>
        <div style={{ fontSize: T.fontSize.body, fontWeight: T.fontWeight.semi, marginBottom: T.space.xl, lineHeight: 1.5 }}>{message}</div>
        <div style={{ display: "flex", gap: T.space.base }}>
          <Btn variant="ghost"  onClick={onCancel}  style={{ flex: 1 }}>{cancelLabel}</Btn>
          <Btn variant="danger" onClick={onConfirm} style={{ flex: 1 }}>{confirmLabel}</Btn>
        </div>
      </div>
    </div>
  );
}

export function ErrorBanner({ message }) {
  if (!message) return null;
  return <div style={{ background: C.dangerDim, border: `1px solid ${C.dangerBorder}`, borderRadius: T.radius.lg, padding: "10px 14px", fontSize: T.fontSize.small, color: C.danger }}>{message}</div>;
}

export function PillFilter({ options, active, onChange, small }) {
  return (
    <div style={{ display: "flex", gap: T.space.sm, overflowX: "auto", paddingBottom: T.space.sm }}>
      {options.map(g => (
        <button key={g} onClick={() => onChange(g)} style={{ flexShrink: 0, border: `1px solid ${active === g ? C.accent : C.border}`, borderRadius: T.radius.full, padding: small ? "4px 12px" : "6px 16px", fontSize: T.fontSize.small, fontWeight: T.fontWeight.semi, cursor: "pointer", background: active === g ? C.accentDim : "transparent", color: active === g ? C.accent : C.textDim, transition: `all ${T.transition.fast}`, whiteSpace: "nowrap" }}>{g}</button>
      ))}
    </div>
  );
}

export function InstallBanner({ onInstall, onDismiss }) {
  return (
    <div style={{ background: C.accentDim, border: `1px solid ${C.accentBorder}`, borderRadius: T.radius.xl, padding: T.space.xl, display: "flex", gap: T.space.base, alignItems: "center" }}>
      <div style={{ flex: 1, fontSize: T.fontSize.small, color: C.text }}>Add Temple to your home screen for the best experience.</div>
      <Btn onClick={onInstall} style={{ flexShrink: 0 }}>Install</Btn>
      <button onClick={onDismiss} style={{ background: "none", border: "none", color: C.textDim, cursor: "pointer", fontSize: 18 }}>✕</button>
    </div>
  );
}

export function VideoSheet({ query, label, onClose }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(null);
  const selected = selectedIndex !== null ? videos[selectedIndex] : null;
  const fallback = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

  useEffect(() => {
    let cancelled = false;
    setLoading(true); setError(""); setVideos([]);
    fetch(`/api/youtube?q=${encodeURIComponent(query)}`)
      .then(r => r.json())
      .then(d => { if (!cancelled) { setVideos(d.videos || []); if (d.error) setError(d.error); setLoading(false); } })
      .catch(() => { if (!cancelled) { setError("Could not load videos."); setLoading(false); } });
    return () => { cancelled = true; };
  }, [query]);

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: C.overlay, zIndex: T.z.modal + 10, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <div className="t-slide-up" onClick={e => e.stopPropagation()} style={{ background: C.surface, borderRadius: `${T.radius.xl}px ${T.radius.xl}px 0 0`, maxHeight: "92vh", display: "flex", flexDirection: "column" }}>
        <div style={{ width: 36, height: 4, borderRadius: T.radius.sm, background: C.border, margin: `${T.space.base}px auto`, flexShrink: 0 }} />
        <div style={{ padding: `0 ${T.space.xl}px ${T.space.base}px`, display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: T.fontSize.h3, fontWeight: T.fontWeight.bold }}>{label || "Form Guide"}</div>
            <div style={{ fontSize: T.fontSize.xs, color: C.textDim, marginTop: 2 }}>{selectedIndex !== null ? `${selectedIndex + 1} of ${videos.length}` : `${videos.length || ""} results`}</div>
          </div>
          <div style={{ display: "flex", gap: T.space.base, alignItems: "center" }}>
            {selectedIndex !== null && <button onClick={() => setSelectedIndex(null)} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: T.radius.md, color: C.textDim, cursor: "pointer", padding: `${T.space.sm}px ${T.space.lg}px`, fontSize: T.fontSize.small }}>← List</button>}
            <button onClick={onClose} style={{ background: C.bg, border: "none", color: C.textDim, cursor: "pointer", borderRadius: T.radius.full, width: 28, height: 28, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
          </div>
        </div>

        {selectedIndex !== null ? (
          <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column" }}>
            <iframe key={selected?.id} src={`https://www.youtube.com/embed/${selected?.id}?autoplay=1&rel=0&modestbranding=1`} style={{ flex: 1, width: "100%", border: "none", minHeight: 260 }} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title={selected?.title} />
            <div style={{ background: C.surface, padding: `${T.space.lg}px ${T.space.xl}px`, display: "flex", flexDirection: "column", gap: T.space.base }}>
              <div style={{ fontSize: T.fontSize.small, fontWeight: T.fontWeight.semi, lineHeight: 1.4 }}>{selected?.title}</div>
              <div style={{ fontSize: T.fontSize.xs, color: C.textDim }}>{selected?.channel}</div>
              <div style={{ display: "flex", gap: T.space.base }}>
                <button onClick={() => setSelectedIndex(i => Math.max(0, i - 1))} disabled={selectedIndex === 0} style={{ flex: 1, background: C.bg, border: `1px solid ${C.border}`, borderRadius: T.radius.lg, padding: "12px", color: selectedIndex === 0 ? C.border : C.text, cursor: selectedIndex === 0 ? "default" : "pointer", fontSize: T.fontSize.body, fontWeight: T.fontWeight.bold }}>← Prev</button>
                <button onClick={() => setSelectedIndex(i => Math.min(videos.length - 1, i + 1))} disabled={selectedIndex === videos.length - 1} style={{ flex: 1, background: C.bg, border: `1px solid ${C.border}`, borderRadius: T.radius.lg, padding: "12px", color: selectedIndex === videos.length - 1 ? C.border : C.accent, cursor: selectedIndex === videos.length - 1 ? "default" : "pointer", fontSize: T.fontSize.body, fontWeight: T.fontWeight.bold }}>Next →</button>
              </div>
            </div>
            <div style={{ height: "env(safe-area-inset-bottom)", background: C.surface }} />
          </div>
        ) : (
          <div style={{ flex: 1, overflowY: "auto", padding: T.space.base }}>
            {loading && [1,2,3,4].map(i => (
              <div key={i} style={{ display: "flex", gap: T.space.lg, alignItems: "center", marginBottom: T.space.base }}>
                <div style={{ width: 120, height: 68, borderRadius: T.radius.md, background: C.border, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ height: 14, background: C.border, borderRadius: T.radius.sm, width: "80%", marginBottom: T.space.sm }} />
                  <div style={{ height: 12, background: C.border, borderRadius: T.radius.sm, width: "50%" }} />
                </div>
              </div>
            ))}
            {error && <div style={{ padding: T.space.xl, textAlign: "center" }}><div style={{ color: C.danger, fontSize: T.fontSize.small, marginBottom: T.space.xl }}>{error}</div><a href={fallback} target="_blank" rel="noopener noreferrer" style={{ color: C.accent, fontSize: T.fontSize.small }}>Open YouTube →</a></div>}
            {!loading && !error && videos.map((v, i) => (
              <button key={v.id} onClick={() => setSelectedIndex(i)} style={{ width: "100%", background: "none", border: "none", display: "flex", gap: T.space.lg, alignItems: "center", padding: `${T.space.base}px ${T.space.sm}px`, borderRadius: T.radius.lg, cursor: "pointer", textAlign: "left", marginBottom: T.space.sm }}>
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <img src={v.thumbnail} alt="" style={{ width: 120, height: 68, borderRadius: T.radius.md, objectFit: "cover", display: "block", background: C.border }} />
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: 28, height: 28, background: "rgba(0,0,0,0.7)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ color: C.text, fontSize: 10, paddingLeft: 2 }}>▶</span>
                    </div>
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: T.fontSize.small, fontWeight: T.fontWeight.semi, lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{v.title}</div>
                  <div style={{ fontSize: T.fontSize.xs, color: C.textDim, marginTop: T.space.xs }}>{v.channel}</div>
                </div>
              </button>
            ))}
            {!loading && !error && videos.length === 0 && <div style={{ padding: T.space.xl, textAlign: "center" }}><div style={{ color: C.textDim, fontSize: T.fontSize.small, marginBottom: T.space.xl }}>No videos found.</div><a href={fallback} target="_blank" rel="noopener noreferrer" style={{ color: C.accent, fontSize: T.fontSize.small }}>Search on YouTube →</a></div>}
            <div style={{ height: "env(safe-area-inset-bottom)" }} />
          </div>
        )}
      </div>
    </div>
  );
}

export function YTButton({ query, label }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)} style={{ display: "inline-flex", alignItems: "center", gap: T.space.sm, background: C.youtubeDim, color: C.youtube, border: "none", borderRadius: T.radius.md, padding: "5px 10px", fontSize: T.fontSize.xs, fontWeight: T.fontWeight.bold, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>▶ Form</button>
      {open && <VideoSheet query={query} label={label} onClose={() => setOpen(false)} />}
    </>
  );
}
