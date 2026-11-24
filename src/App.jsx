import React, { useState, useEffect, useRef } from "react";
import { Github, ExternalLink, ArrowUpRight, Menu, X, Sun, Moon, Monitor } from "lucide-react";
import { Logo } from "./components.jsx";
import { PAGES, DOCS_PAGES, REPO, PYPI, VERSION } from "./data.js";
import HomePage from "./pages/Home.jsx";
import HowPage from "./pages/How.jsx";
import FeaturesPage from "./pages/Features.jsx";
import ComputePage from "./pages/Compute.jsx";
import QuickstartPage from "./pages/Quickstart.jsx";
import DocsPage from "./pages/Docs.jsx";

const hashParts = () => (typeof window === "undefined" ? "" : window.location.hash.replace("#", "")).split("/");
const hashToPage = () => { const b = hashParts()[0]; return PAGES[b] ? b : "home"; };
const hashToDoc = () => { const [p, d] = hashParts(); return p === "docs" && DOCS_PAGES[d] ? d : null; };

const safeGet = (k, d) => { try { return localStorage.getItem(k) || d; } catch { return d; } };
const safeSet = (k, v) => { try { localStorage.setItem(k, v); } catch { /* storage blocked */ } };
const prefersDark = () => typeof window !== "undefined" && !!window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

export default function App() {
  const [page, setPage] = useState(hashToPage);
  const [initialDoc, setInitialDoc] = useState(hashToDoc);
  const [installer, setInstaller] = useState("pip");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState(() => safeGet("bitstraining-theme", "system"));
  const [themeOpen, setThemeOpen] = useState(false);
  const [systemDark, setSystemDark] = useState(prefersDark);

  const barRef = useRef(null);
  useEffect(() => {
    let raf = 0;
    const upd = () => {
      raf = 0;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (barRef.current) barRef.current.style.transform = `scaleX(${h > 0 ? Math.min(1, window.scrollY / h) : 0})`;
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(upd); };
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    upd();
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); };
  }, [page]);

  const resolved = theme === "system" ? (systemDark ? "dark" : "light") : theme;

  useEffect(() => {
    safeSet("bitstraining-theme", theme);
    document.documentElement.style.colorScheme = resolved;
  }, [theme, resolved]);

  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const on = () => setSystemDark(mq.matches);
    mq.addEventListener?.("change", on);
    return () => mq.removeEventListener?.("change", on);
  }, []);

  useEffect(() => {
    const onHash = () => { setPage(hashToPage()); setInitialDoc(hashToDoc()); };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    const label = PAGES[page]?.label;
    document.title = page === "home" ? "Bitstraining — Train. Fine-tune. Optimize. Deploy." : `${label} — Bitstraining`;
  }, [page]);

  useEffect(() => {
    if (!mobileOpen) { document.body.style.overflow = ""; return; }
    document.body.style.overflow = "hidden";
    const onKey = (e) => { if (e.key === "Escape") setMobileOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; document.removeEventListener("keydown", onKey); };
  }, [mobileOpen]);

  const go = (p) => {
    setPage(p);
    setMobileOpen(false);
    window.location.hash = p === "home" ? "top" : p;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const themeIcon = resolved === "dark" ? <Moon size={16} /> : <Sun size={16} />;

  return (
    <div className="bp-app" data-theme={resolved}>
      <a href="#main" style={{ position: "absolute", left: -9999 }} onFocus={(e) => (e.target.style.left = "8px")} onBlur={(e) => (e.target.style.left = "-9999px")}>Skip to content</a>

      <div className="bp-progress" ref={barRef} aria-hidden="true" />
      <header className="bp-nav">
        <div className="bp-nav-inner">
          <button className="bp-brand" onClick={() => go("home")} aria-label="Bitstraining home"><Logo size={32} /></button>

          <nav className="bp-navlinks" aria-label="Primary">
            {Object.entries(PAGES).map(([k, v]) => (
              <button key={k} className={page === k ? "active" : ""} aria-current={page === k ? "page" : undefined} onClick={() => go(k)}>{v.label}</button>
            ))}
          </nav>

          <div className="bp-nav-actions">
            <a className="bp-round" href={REPO} target="_blank" rel="noreferrer" aria-label="Bitstraining on GitHub" title="GitHub"><Github size={17} /></a>
            <a className="bp-round" href={PYPI} target="_blank" rel="noreferrer" aria-label="Bitstraining on PyPI" title="PyPI"><span className="bp-pypi-mark">Py</span></a>
            <div className="bp-theme">
              <button className="bp-round" onClick={() => setThemeOpen((v) => !v)} aria-label="Choose appearance" aria-expanded={themeOpen}>{themeIcon}</button>
              {themeOpen && (
                <div className="bp-theme-menu">
                  {[["light", "Light", Sun], ["dark", "Dark", Moon], ["system", "System", Monitor]].map(([v, l, Icon]) => (
                    <button key={v} className={theme === v ? "active" : ""} onClick={() => { setTheme(v); setThemeOpen(false); }}><Icon size={14} /> {l}</button>
                  ))}
                </div>
              )}
            </div>
            <button className="bp-menu-btn" onClick={() => { setThemeOpen(false); setMobileOpen((v) => !v); }}
              aria-label={mobileOpen ? "Close navigation" : "Open navigation"} aria-expanded={mobileOpen} aria-controls="bp-drawer">
              {mobileOpen ? <X size={17} /> : <Menu size={17} />}<span>{mobileOpen ? "Close" : "Menu"}</span>
            </button>
          </div>
        </div>

        <div className={`bp-overlay ${mobileOpen ? "open" : ""}`} onClick={() => setMobileOpen(false)} aria-hidden="true" />
        <div id="bp-drawer" className={`bp-drawer ${mobileOpen ? "open" : ""}`} aria-hidden={!mobileOpen}>
          <div className="bp-drawer-intro"><span>Explore Bitstraining</span><small>Hardware-aware LLM fine-tuning</small></div>
          <nav aria-label="Mobile">
            {Object.entries(PAGES).map(([k, v], i) => (
              <button key={k} className={`bp-drawer-link ${page === k ? "active" : ""}`} onClick={() => go(k)} tabIndex={mobileOpen ? 0 : -1}>
                <span className="idx">{String(i + 1).padStart(2, "0")}</span><span className="lbl">{v.label}</span><ArrowUpRight size={17} />
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main id="main">
        {page === "home" && <HomePage go={go} installer={installer} setInstaller={setInstaller} />}
        {page === "how" && <HowPage go={go} />}
        {page === "features" && <FeaturesPage go={go} />}
        {page === "compute" && <ComputePage go={go} />}
        {page === "quickstart" && <QuickstartPage go={go} installer={installer} setInstaller={setInstaller} />}
        {page === "docs" && <DocsPage go={go} initialDoc={initialDoc} />}
      </main>

      <footer className="bp-footer">
        <div className="bp-container bp-footer-inner">
          <div>
            <div className="bp-brand" style={{ cursor: "default" }}><Logo size={28} /></div>
            <small>Apache-2.0 · v{VERSION} · Alpha. Predictions are unvalidated until calibrated on your hardware.</small>
          </div>
          <div className="bp-footer-links">
            <a href={REPO} target="_blank" rel="noreferrer"><Github size={14} /> Repository</a>
            <a href={PYPI} target="_blank" rel="noreferrer"><ExternalLink size={14} /> PyPI</a>
            <a href={`${REPO}/issues`} target="_blank" rel="noreferrer">Issues</a>
            <a href={`${REPO}/blob/main/LICENSE`} target="_blank" rel="noreferrer">License</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
