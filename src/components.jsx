import React, { useState, useEffect, useRef } from "react";
import {
  Cpu, Gauge, Stethoscope, Zap, Database, Cloud, History, ClipboardCheck, Rocket,
  ShieldCheck, Copy, Check, ArrowRight, Layers,
} from "lucide-react";

export const ICONS = { Cpu, Gauge, Stethoscope, Zap, Database, Cloud, History, ClipboardCheck, Rocket, ShieldCheck };

/* ---------------- Brand ---------------- */

export function LogoMark({ size = 32 }) {
  return <img className="bp-logo-img" src="/logo.png" alt="" width={size} height={size} style={{ width: size, height: size }} />;
}

export function Logo({ size = 32 }) {
  return (
    <>
      <LogoMark size={size} />
      <span className="bp-brand-word">bits<b>training</b></span>
    </>
  );
}

/* ---------------- Utilities ---------------- */

export function Reveal({ children, className = "", style }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") { setInView(true); return; }
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return <div ref={ref} className={`bp-reveal ${inView ? "in" : ""} ${className}`} style={style}>{children}</div>;
}

export function CopyButton({ text, label = "Copy" }) {
  const [copied, setCopied] = useState(false);
  const doCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch (e) { /* clipboard blocked — nothing to do */ }
  };
  return (
    <button className={`bp-copybtn ${copied ? "copied" : ""}`} onClick={doCopy} aria-label={copied ? "Copied" : label} title={label}>
      {copied ? <Check size={15} /> : <Copy size={15} />}
    </button>
  );
}

export function Cmd({ children }) {
  return (
    <div className="bp-cmd">
      <code><span className="prompt">$</span> {children}</code>
      <CopyButton text={children} label="Copy command" />
    </div>
  );
}

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* Single-pass tokenizer so spans are never nested or corrupted. */
export function highlight(code) {
  const re = /(#[^\n]*)|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*')|\b(import|from|with|as|def|for|in|return|class)\b/g;
  let out = "", last = 0, m;
  while ((m = re.exec(code))) {
    out += esc(code.slice(last, m.index));
    const cls = m[1] ? "tok-comment" : m[2] ? "tok-string" : "tok-kw";
    out += `<span class="${cls}">${esc(m[0])}</span>`;
    last = m.index + m[0].length;
  }
  return out + esc(code.slice(last));
}

export function CodeBlock({ code, caption, bar }) {
  return (
    <div className="bp-codebox">
      <div className="bp-codebox-bar"><span>{caption}</span><CopyButton text={code} /></div>
      <pre><code dangerouslySetInnerHTML={{ __html: highlight(code) }} /></pre>
      {bar}
    </div>
  );
}

export function PageHeader({ eyebrow, title, sub, onHome }) {
  return (
    <div className="bp-pagehead">
      <div className="bp-container">
        <div className="bp-crumb">
          <button onClick={onHome}>Home</button><span>/</span><span>{title}</span>
        </div>
        <div className="bp-eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        {sub && <p>{sub}</p>}
      </div>
    </div>
  );
}

export function DocTable({ head, rows, pills }) {
  return (
    <div className="bp-table-wrap">
      <table>
        <thead><tr>{head.map((h) => <th key={h}>{h}</th>)}</tr></thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((c, j) => (
                <td key={j}>
                  {j === 0 ? <code>{c}</code>
                    : pills && j === row.length - 1 ? <span className={`bp-pill ${String(c).toLowerCase().split(" ")[0]}`}>{c}</span>
                    : c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DocBlock({ b }) {
  if (b.type === "p") return <p className="bp-doc-p">{b.text}</p>;
  if (b.type === "code") return (
    <div className="bp-doc-code">
      {b.caption && <div className="cap">{b.caption}</div>}
      <pre><code dangerouslySetInnerHTML={{ __html: highlight(b.code) }} /></pre>
    </div>
  );
  if (b.type === "table") return <div className="bp-doctable"><DocTable head={b.head} rows={b.rows} pills={b.head[b.head.length - 1] === "Status"} /></div>;
  if (b.type === "list") return (
    <ul className="bp-doc-list">{b.items.map((it, i) => <li key={i}><ArrowRight size={13} /><span>{it}</span></li>)}</ul>
  );
  if (b.type === "callout") return <div className="bp-doc-callout"><Layers size={16} className="ic" /><p>{b.text}</p></div>;
  return null;
}

/* ---------------- Pipeline diagram ---------------- */

export function FlowDiagram() {
  const Box = ({ x, y, w = 170, h = 62, title, sub, strong, t = 0 }) => (
    <g>
      <rect className="bt-node" style={{ animationDelay: `${(t * 12).toFixed(2)}s` }} x={x} y={y} width={w} height={h} rx={8} fill={strong ? "var(--brand-tint)" : "var(--bg)"} stroke={strong ? "var(--brand)" : "var(--line-strong)"} strokeWidth="1.3" />
      <text x={x + w / 2} y={y + h / 2 - 3} textAnchor="middle" fontSize="13" fontWeight="600" fill="var(--ink)" fontFamily="var(--font-body)">{title}</text>
      <text x={x + w / 2} y={y + h / 2 + 15} textAnchor="middle" fontSize="10" fill="var(--ink-dim)" fontFamily="var(--font-mono)">{sub}</text>
    </g>
  );
  const Arrow = ({ x1, y1, x2, y2 }) => (
    <line className="bt-flow" x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--ink-dim)" strokeWidth="1.5" strokeDasharray="4 4" markerEnd="url(#bt-arrow)" />
  );
  const Bend = ({ d }) => (
    <path className="bt-flow" d={d} fill="none" stroke="var(--ink-dim)" strokeWidth="1.5" strokeDasharray="5 4" markerEnd="url(#bt-arrow)" />
  );
  return (
    <div className="bp-diagram">
      <svg viewBox="0 0 760 420" role="img" aria-label="Pipeline: goal and constraints, hardware profile, cost model and ranked plans; then doctor, probe and autotune, compute and engine; then tracked run, eval gate, model card and deploy.">
        <defs>
          <marker id="bt-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0L10 5L0 10z" fill="var(--ink-dim)" />
          </marker>
        </defs>

        <rect x="2" y="18" width="756" height="104" rx="12" fill="none" stroke="var(--green)" strokeWidth="1.2" strokeDasharray="6 5" />
        <text x="14" y="112" fontSize="10.5" fill="var(--green)" fontFamily="var(--font-mono)" letterSpacing="1">PLANNING — NO GPU REQUIRED</text>

        <Box x={10} y={34} t={0} title="Goal + constraints" sub="run.yaml" />
        <Box x={200} y={34} t={0.061} title="Hardware profile" sub="profile / --gpu" />
        <Box x={390} y={34} t={0.122} title="Cost model" sub="memory · speed · $" />
        <Box x={580} y={34} t={0.183} title="Ranked plans" sub="time · cost · memory" strong />
        <Arrow x1={180} y1={65} x2={198} y2={65} />
        <Arrow x1={370} y1={65} x2={388} y2={65} />
        <Arrow x1={560} y1={65} x2={578} y2={65} />

        <Bend d="M665 96 V148 H95 V168" />

        <Box x={10} y={170} t={0.409} title="Doctor" sub="~30 pre-flight checks" />
        <Box x={200} y={170} t={0.47} title="Probe / autotune" sub="calibrates the plan" strong />
        <Box x={390} y={170} t={0.53} title="Compute" sub="local · ssh · docker · notebook" />
        <Box x={580} y={170} t={0.59} title="Engine" sub="PEFT · Unsloth · MLX" />
        <Arrow x1={180} y1={201} x2={198} y2={201} />
        <Arrow x1={370} y1={201} x2={388} y2={201} />
        <Arrow x1={560} y1={201} x2={578} y2={201} />

        <Bend d="M665 232 V284 H95 V304" />

        <Box x={10} y={306} t={0.817} title="Tracked run" sub="SQLite · lineage" />
        <Box x={200} y={306} t={0.878} title="Eval gate" sub="blocks regressions" strong />
        <Box x={390} y={306} t={0.939} title="Model card" sub="data hash · lineage" />
        <Box x={580} y={306} t={0.99} title="Deploy" sub="merge · GGUF · serve" />
        <Arrow x1={180} y1={337} x2={198} y2={337} />
        <Arrow x1={370} y1={337} x2={388} y2={337} />
        <Arrow x1={560} y1={337} x2={578} y2={337} />

        <circle className="bt-ember" r="5" fill="var(--amber)">
          <animateMotion dur="12s" repeatCount="indefinite" path="M95,65 H665 V148 H95 V201 H665 V284 H95 V337 H665" />
        </circle>
        <text x="380" y="402" textAnchor="middle" fontSize="11" fill="var(--ink-dim)" fontFamily="var(--font-mono)">engines and compute providers are plugins</text>
      </svg>
    </div>
  );
}

/* ---------------- Motion helpers ---------------- */

export function CountUp({ to, prefix = "", suffix = "", dur = 1200 }) {
  const ref = useRef(null);
  const [v, setV] = useState(0);
  useEffect(() => {
    const el = ref.current;
    const reduce = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!el || reduce || typeof IntersectionObserver === "undefined") { setV(to); return; }
    let raf;
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      const t0 = performance.now();
      const tick = (t) => {
        const k = Math.min(1, (t - t0) / dur);
        setV(Math.round(to * (1 - Math.pow(1 - k, 3))));
        if (k < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    obs.observe(el);
    return () => { obs.disconnect(); cancelAnimationFrame(raf); };
  }, [to, dur]);
  return <span ref={ref}>{prefix}{v}{suffix}</span>;
}

const WORKS_WITH = ["PyTorch", "Transformers", "PEFT", "Unsloth", "MLX", "llama.cpp", "vLLM", "Hugging Face", "Colab", "Kaggle", "Docker", "SSH"];

export function Marquee() {
  const row = (k) => WORKS_WITH.map((w) => <span className="bp-chip" key={k + w}>{w}</span>);
  return (
    <div className="bp-marquee" aria-label="Works with PyTorch, Transformers, PEFT, Unsloth, MLX, llama.cpp, vLLM, Hugging Face, Colab, Kaggle, Docker and SSH">
      <div className="bp-marquee-track" aria-hidden="true">{row("a")}{row("b")}</div>
    </div>
  );
}

/* Hero: a run.yaml card slides into the machine, an ember line runs the
   deck, the progress bar fills and the epoch counter ticks 01 -> 03. */
export function HeroMachine() {
  return (
    <div className="bp-visual bt-machine" aria-hidden="true">
      <svg viewBox="0 0 520 440" role="presentation">
        <polygon points="30,330 260,435 490,330 260,225" fill="var(--bg-alt)" stroke="var(--line-strong)" strokeWidth="1.3" />
        <path className="bt-deckline" d="M70,330 L170,305 M350,305 L450,330" stroke="var(--line-strong)" strokeWidth="2" fill="none" />
        <path id="bt-track" d="M80,322 L170,300 L260,345 L350,300 L440,322" fill="none" stroke="var(--amber)" strokeWidth="2.5" strokeDasharray="6 6" className="bt-track" opacity=".9" />
        <circle r="6" fill="var(--amber)" className="bt-spark">
          <animateMotion dur="4.5s" repeatCount="indefinite"
            path="M80,322 L170,300 L260,345 L350,300 L440,322" />
        </circle>

        <g className="bt-unit">
          <polygon points="170,190 260,145 350,190 260,235" fill="var(--surface)" stroke="var(--line-strong)" strokeWidth="1.3" />
          <polygon points="170,190 260,235 260,330 170,285" fill="var(--navy)" />
          <polygon points="260,235 350,190 350,285 260,330" fill="var(--teal)" opacity=".85" />
          <g transform="matrix(1 .5 0 1 170 190)">
            <rect x="10" y="12" width="70" height="52" rx="4" fill="#04344d" />
            <text x="16" y="28" fontSize="8.5" fill="#eaf6fa" fontFamily="var(--font-mono)">$ bt train</text>
            <text className="bt-ep e1" x="16" y="42" fontSize="8.5" fill="var(--amber)" fontFamily="var(--font-mono)">epoch 01/03</text>
            <text className="bt-ep e2" x="16" y="42" fontSize="8.5" fill="var(--amber)" fontFamily="var(--font-mono)">epoch 02/03</text>
            <text className="bt-ep e3" x="16" y="42" fontSize="8.5" fill="var(--amber)" fontFamily="var(--font-mono)">epoch 03/03</text>
            <rect x="16" y="50" width="58" height="5" rx="2.5" fill="#1d5a78" />
            <rect className="bt-bar" x="16" y="50" width="58" height="5" rx="2.5" fill="var(--amber)" />
          </g>
        </g>

        <g className="bt-card">
          <rect x="30" y="248" width="86" height="54" rx="8" fill="var(--surface)" stroke="var(--brand)" strokeWidth="1.5" />
          <text x="42" y="270" fontSize="11" fontWeight="600" fill="var(--ink)" fontFamily="var(--font-mono)">run.yaml</text>
          <rect x="42" y="278" width="52" height="4" rx="2" fill="var(--line-strong)" />
          <rect x="42" y="287" width="36" height="4" rx="2" fill="var(--line-strong)" />
        </g>

        <g className="bt-out">
          <rect x="396" y="262" width="96" height="58" rx="8" fill="var(--surface)" stroke="var(--green)" strokeWidth="1.5" />
          <text x="408" y="283" fontSize="11" fontWeight="600" fill="var(--ink)" fontFamily="var(--font-mono)">./output</text>
          <text x="408" y="303" fontSize="10" fill="var(--green)" fontFamily="var(--font-mono)">gate passed ✓</text>
        </g>
      </svg>
      <div className="bp-vcard tag t1"><span className="dot" /> <span>doctor <b>~30 checks</b></span></div>
      <div className="bp-vcard tag t3"><span className="dot" /> <span>GPU <b>optional to plan</b></span></div>
    </div>
  );
}
