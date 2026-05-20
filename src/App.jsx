import React, { useState, useEffect, useCallback, useRef, lazy, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { T, C } from "./tokens";
import { uid } from "./data";
import { useAppData, usePWA } from "./hooks";
import { useGoogleDrive } from "./useGoogleDrive";
import { useCoach } from "./useCoach";
import { GlobalStyles, Tabs, InstallBanner, Logo, LogoIcon } from "./components";
import { LibraryPage } from "./pages/LibraryPage";
import { SetsPage } from "./pages/SetsPage";
import { SessionPage } from "./pages/SessionPage";
import { SettingsPage } from "./pages/SettingsPage";

// Lazy — recharts only loads when Progress tab is first opened
const ProgressPage = lazy(() => import("./pages/ProgressPage").then(m => ({ default: m.ProgressPage })));

// ─── Error Monitor ───
// Captures console.error, unhandled rejections, and app errors.
// Shows as a dot in the corner — grey when clean, red when errors exist.
function useErrorMonitor() {
  const [logs, setLogs] = useState([]);
  const add = useCallback((type, message) => {
    const entry = { id: uid(), type, message: String(message), time: new Date().toLocaleTimeString() };
    setLogs(prev => [...prev.slice(-49), entry]); // keep last 50
  }, []);

  useEffect(() => {
    const origError = console.error.bind(console);
    const origWarn = console.warn.bind(console);

    console.error = (...args) => { add("error", args.map(String).join(" ")); origError(...args); };
    console.warn = (...args) => { add("warn", args.map(String).join(" ")); origWarn(...args); };

    const onError = (e) => add("error", `${e.message} (${e.filename}:${e.lineno})`);
    const onUnhandled = (e) => add("error", `Unhandled: ${e.reason}`);

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onUnhandled);

    return () => {
      console.error = origError;
      console.warn = origWarn;
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onUnhandled);
    };
  }, [add]);

  return { logs, clear: () => setLogs([]) };
}

function ErrorDot({ logs, onClick }) {
  const hasErrors = logs.some(l => l.type === "error");
  const hasLogs = logs.length > 0;
  if (!hasLogs) return null;
  return (
    <button
      onClick={onClick}
      style={{
        position: "absolute", top: T.space.xl, right: T.space.xl,
        width: 10, height: 10, borderRadius: "50%",
        background: hasErrors ? C.danger : C.textDim,
        border: "none", cursor: "pointer", padding: 0, zIndex: T.z.modal - 1,
        boxShadow: hasErrors ? `0 0 0 3px ${C.dangerDim}` : "none",
        transition: `background ${T.transition.fast}, box-shadow ${T.transition.fast}`,
        flexShrink: 0,
      }}
    />
  );
}

function ErrorMonitor({ logs, onClear, open, setOpen }) {
  return (
    <>

      {/* Log sheet */}
      {open && (
        <div className="t-fade-in" style={{ position: "fixed", inset: 0, background: C.overlay, zIndex: T.z.modal + 20, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}
          onClick={() => setOpen(false)}>
          <div className="t-slide-up" onClick={e => e.stopPropagation()}
            style={{ background: C.surface, borderRadius: `${T.radius.xl}px ${T.radius.xl}px 0 0`, maxHeight: "70vh", display: "flex", flexDirection: "column" }}>
            {/* Handle */}
            <div style={{ width: 36, height: 4, borderRadius: T.radius.sm, background: C.border, margin: `${T.space.base}px auto` }} />
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: `0 ${T.space.xl}px ${T.space.base}px`, borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
              <div style={{ fontSize: T.fontSize.bodySmall, fontWeight: T.fontWeight.bold }}>
                Console · {logs.length} {logs.length === 1 ? "entry" : "entries"}
              </div>
              <div style={{ display: "flex", gap: T.space.base }}>
                {logs.length > 0 && (
                  <button onClick={() => { onClear(); }} style={{ background: "none", border: "none", color: C.textDim, cursor: "pointer", fontSize: T.fontSize.small }}>Clear</button>
                )}
                <button onClick={() => setOpen(false)} style={{ background: C.bg, border: "none", color: C.textDim, cursor: "pointer", borderRadius: T.radius.full, width: T.size.iconBtn, height: T.size.iconBtn, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
              </div>
            </div>
            {/* Log entries */}
            <div style={{ flex: 1, overflowY: "auto", padding: T.space.base }}>
              {logs.length === 0 ? (
                <div style={{ textAlign: "center", color: C.textDim, fontSize: T.fontSize.small, padding: T.space["2xl"] }}>No errors logged</div>
              ) : (
                [...logs].reverse().map(l => (
                  <div key={l.id} style={{ marginBottom: T.space.base, padding: `${T.space.sm}px ${T.space.base}px`, background: C.bg, borderRadius: T.radius.md, borderLeft: `3px solid ${l.type === "error" ? C.danger : C.textDim}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: T.space.xs }}>
                      <span style={{ fontSize: T.fontSize.xs, fontWeight: T.fontWeight.bold, color: l.type === "error" ? C.danger : C.textDim, textTransform: "uppercase" }}>{l.type}</span>
                      <span style={{ fontSize: T.fontSize.xs, color: C.textDim }}>{l.time}</span>
                    </div>
                    <div style={{ fontSize: T.fontSize.xs, color: C.text, fontFamily: T.font.mono, lineHeight: 1.5, wordBreak: "break-all" }}>{l.message}</div>
                  </div>
                ))
              )}
              <div style={{ height: "env(safe-area-inset-bottom)" }} />
            </div>
          </div>
        </div>
      )}
    </>
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

export default function Temple() {
  const { data, loading, saving, save } = useAppData();
  const [tab, setTab] = useState("sets");
  const [activeSet, setActiveSet] = useState(null);
  const pwa = usePWA();
  const drive = useGoogleDrive();
  const coach = useCoach(data?.settings?.anthropicKey || "");
  const errorMonitor = useErrorMonitor();
  const [errorOpen, setErrorOpen] = useState(false);

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
        <div className="t-logo-spin" style={{ marginBottom: T.space.xl, display: "inline-block" }}><LogoIcon size={64} /></div>
        <div className="t-text-in" style={{ fontWeight: T.fontWeight.black, fontSize: T.fontSize.h1, color: C.accent, letterSpacing: T.letterSpacing.tight, animationDelay: "0.3s", fontFamily: T.font.body }}>TEMPLE</div>
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
        {/* Pull-to-refresh logo — only visible when pulling, slides in from top */}
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: T.z.header + 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pointerEvents: "none",
          // Slides down from above: starts hidden above screen, follows pull
          transform: pullY > 0 || refreshing
            ? `translateY(calc(env(safe-area-inset-top) + ${refreshing ? 20 : Math.max(pullY - 32, 0)}px))`
            : `translateY(calc(env(safe-area-inset-top) - 60px))`,
          transition: pulling ? "none" : `transform 0.4s ${T.easing.spring}`,
          opacity: pullProgress > 0.1 || refreshing ? 1 : 0,
        }}>
          <div style={{ fontWeight: T.fontWeight.black, fontSize: T.fontSize.h2, letterSpacing: T.letterSpacing.tight, color: C.accent, display: "flex", alignItems: "center", gap: T.space.sm, userSelect: "none" }}>
            <span style={{
              display: "inline-block",
              transform: refreshing ? "scale(1.2)" : `rotate(${logoRotate}deg) scale(${logoScale})`,
              transition: pulling ? "none" : `transform 0.4s ${T.easing.spring}`,
              animation: refreshing ? "temple-logo-spin 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards" : "none",
            }}><LogoIcon size={28} /></span>
            TEMPLE
          </div>
        </div>

        {/* Safe area spacer — no visible header */}
        <div style={{ height: "env(safe-area-inset-top)", flexShrink: 0, background: C.bg }} />

        {/* Scrollable content */}
        <div
          ref={scrollRef}
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            WebkitOverflowScrolling: "touch",
            transform: pullY > 0 ? `translateY(${pullY * 0.5}px)` : "none",
            transition: pulling ? "none" : `transform 0.35s ${T.easing.spring}`,
          }}
        >
          <div style={{ padding: `${T.space.xl}px ${T.space.xl}px`, paddingBottom: "calc(env(safe-area-inset-bottom) + 90px)", maxWidth: T.size.maxWidth, margin: "0 auto", position: "relative" }}>
            <ErrorDot logs={errorMonitor.logs} onClick={() => setErrorOpen(o => !o)} />
            {saving && (
              <div style={{ position: "fixed", top: "calc(env(safe-area-inset-top) + 8px)", right: T.space.xl, zIndex: T.z.header }}>
                <div className="t-pulse" style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent }} />
              </div>
            )}
            {pwa.canInstall && <div style={{ marginBottom: T.space.xl }}><InstallBanner onInstall={pwa.install} onDismiss={pwa.dismiss} /></div>}
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={T.motion.gentle}
              >
                {tab === "library" && <LibraryPage data={data} save={save} coach={coach} />}
                {tab === "sets" && <SetsPage data={data} save={save} onStartSession={handleStartSession} coach={coach} />}
                {tab === "session" && <SessionPage data={data} save={save} activeSet={activeSet} setActiveSet={setActiveSet} setTab={setTab} coach={coach} />}
                {tab === "progress" && <Suspense fallback={<div style={{ padding: T.space["3xl"], textAlign: "center", color: C.textDim }}>Loading...</div>}><ProgressPage data={data} save={save} onRepeatSession={handleStartSession} coach={coach} /></Suspense>}
                {tab === "settings" && <SettingsPage data={data} save={save} drive={drive} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <Tabs active={tab} onChange={setTab} hasActiveSession={!!activeSet} />
        <ErrorMonitor logs={errorMonitor.logs} onClear={errorMonitor.clear} open={errorOpen} setOpen={setErrorOpen} />
      </div>
    </ErrorBoundary>
  );
}
