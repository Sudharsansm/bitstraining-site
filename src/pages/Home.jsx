import React, { useState, useMemo } from "react";
import {
  Zap, Github, ArrowUpRight, ArrowRight, Ban, Workflow, Layers, Cloud, FileText,
} from "lucide-react";
import { Reveal, Cmd, CopyButton, highlight, CountUp, Marquee, HeroMachine } from "../components.jsx";
import { REPO, PYPI, VERSION } from "../data.js";

/* ---------------- Hero visual ---------------- */
function PlanVisual() {
  const rows = [
    ["QLoRA", 38, "fits", "ok"],
    ["LoRA", 62, "fits", "ok"],
    ["Full fine-tune", 100, "too big", "no"],
  ];
  return (
    <div className="bp-visual" aria-hidden="true">
      <div className="bp-ring a" /><div className="bp-ring b" />
      <div className="bp-visual-stage">
        <div className="bp-vcard main">
          <div className="row"><span>bt plan</span><span>illustrative</span></div>
          <div className="term"><span className="p">$</span> bt plan -c run.yaml</div>
          <div className="plans">
            {rows.map(([n, w, t, k], i) => (
              <div className="plan" key={n}>
                <div className="pl-top"><b>{i + 1}. {n}</b><span className={`pl-tag ${k}`}>{t}</span></div>
                <div className="pl-bar"><i style={{ width: `${w}%` }} className={k} /></div>
              </div>
            ))}
          </div>
          <div className="pay-btn">Run top plan</div>
          <div className="tmr">confidence: low — until probed</div>
        </div>
        <div className="bp-vcard tag t1"><span className="dot" /> <span>doctor <b>~30 checks</b></span></div>
        <div className="bp-vcard tag t2"><span className="dot" /> <span>eval gate <b>on</b></span></div>
        <div className="bp-vcard tag t3"><span className="dot" /> <span>GPU <b>optional to plan</b></span></div>
      </div>
    </div>
  );
}

/* ---------------- Interactive: build a run.yaml ---------------- */

const q = (s) => (/^[\w./:@-]+$/.test(s) ? s : JSON.stringify(s));

function Playground() {
  const [f, setF] = useState({
    name: "support-bot", base: "meta-llama/Llama-3.1-8B-Instruct", train: "./data/train.jsonl",
    epochs: "3", batch: "16", objective: "time", budget: "20", provider: "local", gpu: "", price: "",
  });
  const [tab, setTab] = useState("yaml");
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));

  const errors = {};
  if (!/^[A-Za-z0-9._-]{1,64}$/.test(f.name.trim())) errors.name = "Letters, digits, . _ - only";
  if (!f.base.trim()) errors.base = "Base model is required";
  if (!f.train.trim()) errors.train = "Training file is required";
  if (!/^[1-9]\d{0,3}$/.test(f.epochs)) errors.epochs = "Whole number ≥ 1";
  if (!/^[1-9]\d{0,5}$/.test(f.batch)) errors.batch = "Whole number ≥ 1";
  if (f.budget !== "" && !/^\d{1,6}(\.\d{1,2})?$/.test(f.budget)) errors.budget = "A number, or leave blank";
  if (f.price !== "" && !/^\d{1,4}(\.\d{1,2})?$/.test(f.price)) errors.price = "USD per hour";
  const ok = Object.keys(errors).length === 0;

  const compute = useMemo(() => {
    switch (f.provider) {
      case "ssh": return "{ provider: ssh, options: { host: user@host, gpu: a100-80gb, price_per_hour: 1.9 } }";
      case "docker": return "{ provider: docker, options: { image: pytorch/pytorch:2.4.0-cuda12.1-cudnn9-runtime } }";
      case "notebook": return "{ provider: notebook, options: { target: colab } }";
      default: return "{ provider: local }";
    }
  }, [f.provider]);

  const yaml = useMemo(() => {
    const goal = [`task: sft`, `epochs: ${f.epochs}`, `global_batch_size: ${f.batch}`, `objective: ${f.objective}`];
    if (f.budget !== "") goal.push(`budget_usd: ${f.budget}`);
    return `name: ${f.name.trim()}
model: { base: ${q(f.base.trim())} }
data:  { train: ${q(f.train.trim())}, max_length: 1024, eval_split: 0.05 }
goal:  { ${goal.join(", ")} }
compute: ${compute}
output: ./output`;
  }, [f, compute]);

  const whatIf = f.gpu.trim() ? ` --gpu ${f.gpu.trim()}${f.price ? ` --price ${f.price}` : ""}` : "";
  const cli = `bitstraining init --template chat -o run.yaml   # then paste the YAML
bitstraining plan -c run.yaml${whatIf}
bitstraining doctor -c run.yaml
bitstraining train -c run.yaml --tune`;
  const view = tab === "yaml" ? yaml : cli;

  const field = ({ id, label, k, mode }) => (
    <div className={`bp-field ${errors[k] ? "bad" : ""}`}>
      <label htmlFor={id}>{label}</label>
      <input id={id} value={f[k]} onChange={set(k)} spellCheck={false} autoComplete="off" inputMode={mode} />
      {errors[k] && <div className="err">{errors[k]}</div>}
    </div>
  );

  return (
    <div className="bp-play">
      <div className="bp-play-form">
        {field({ id: "pp-name", label: "Run name", k: "name" })}
        {field({ id: "pp-base", label: "Base model", k: "base" })}
        {field({ id: "pp-train", label: "Training file", k: "train" })}
        <div className="bp-field-row">
          {field({ id: "pp-ep", label: "Epochs", k: "epochs", mode: "numeric" })}
          {field({ id: "pp-bs", label: "Global batch size", k: "batch", mode: "numeric" })}
        </div>
        <div className="bp-field-row">
          <div className="bp-field">
            <label htmlFor="pp-obj">Optimize for</label>
            <select id="pp-obj" value={f.objective} onChange={set("objective")}>
              <option value="time">time</option><option value="cost">cost</option><option value="memory">memory</option>
            </select>
          </div>
          {field({ id: "pp-bud", label: "Budget (USD)", k: "budget", mode: "decimal" })}
        </div>
        <div className="bp-field">
          <label htmlFor="pp-prov">Compute provider</label>
          <select id="pp-prov" value={f.provider} onChange={set("provider")}>
            <option value="local">local</option><option value="ssh">ssh</option>
            <option value="docker">docker</option><option value="notebook">notebook (Colab / Kaggle)</option>
          </select>
        </div>
        <div className="bp-field-row">
          <div className="bp-field">
            <label htmlFor="pp-gpu">What-if GPU (optional)</label>
            <input id="pp-gpu" value={f.gpu} onChange={set("gpu")} placeholder="a100-80gb" spellCheck={false} autoComplete="off" />
          </div>
          {field({ id: "pp-price", label: "$ / hour (optional)", k: "price", mode: "decimal" })}
        </div>
        <p style={{ margin: 0, fontSize: 12.5, color: "var(--ink-dim)", lineHeight: 1.6 }}>
          Runs entirely in your browser. It writes the config and commands — it doesn't estimate
          anything. Real predictions come from <code>bitstraining plan</code>.
        </p>
      </div>

      <div className="bp-play-out">
        <div>
          <div className="bp-tabs" style={{ borderColor: "#1d5a78", marginBottom: 10, borderBottom: "1px solid #1d5a78", borderRadius: 8 }}>
            {[["yaml", "run.yaml"], ["cli", "Commands"]].map(([k, l]) => (
              <button key={k} className={`bp-tab ${tab === k ? "active" : ""}`} style={tab === k ? { background: "#F7AD19", color: "#053F5C", borderColor: "#F7AD19" } : { background: "transparent", color: "#9fc3d3", borderColor: "#1d5a78" }} onClick={() => setTab(k)}>{l}</button>
            ))}
          </div>
          <div className={`bp-uri ${ok ? "" : "dim"}`}>
            <pre style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word", font: "inherit" }}><code dangerouslySetInnerHTML={{ __html: highlight(view) }} /></pre>
            <CopyButton text={view} />
          </div>
          {!ok && <div style={{ color: "#ff9a7a", fontSize: 12.5, marginTop: 8 }}>Fix the highlighted fields — the output stays dimmed until they validate.</div>}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Page ---------------- */

export default function HomePage({ go, installer, setInstaller }) {
  return (
    <>
      <section className="bp-section bp-hero">
        <div className="bp-grid-bg" />
        <div className="bp-container">
          <div className="bp-hero-grid">
            <div>
              <div className="bp-maintainer">Open source · <b>Apache-2.0</b> · Alpha</div>
              <h1>Train. Fine-tune. <span className="accent">Optimize.</span> Deploy.</h1>
              <p className="lead">
                Bitstraining is a hardware-aware layer for fine-tuning language models. Give it a goal
                and your constraints — it profiles your hardware, ranks the ways to train, checks the
                run before you start, and tracks everything after. Even with a modest GPU.
              </p>
              <div className="bp-badgerow">
                <span className="bp-badge"><b>v{VERSION}</b> · Apache-2.0</span>
                <span className="bp-badge">Python <b>&ge;3.10</b></span>
                <span className="bp-badge"><b>1</b> core dependency</span>
              </div>
              <div className="bp-install-row">
                <div className="bp-pillswitch">
                  <button className={installer === "pip" ? "active" : ""} onClick={() => setInstaller("pip")}>pip</button>
                  <button className={installer === "uv" ? "active" : ""} onClick={() => setInstaller("uv")}>uv</button>
                </div>
                <Cmd>{installer === "pip" ? "pip install bitstraining" : "uv add bitstraining"}</Cmd>
              </div>
              <div className="bp-cta-links">
                <button className="bp-textlink" onClick={() => go("quickstart")}>Read the quickstart <ArrowUpRight size={14} /></button>
                <div className="bp-resources">
                  <a className="bp-round" href={REPO} target="_blank" rel="noreferrer" aria-label="Bitstraining on GitHub" title="GitHub"><Github size={17} /></a>
                  <a className="bp-round" href={PYPI} target="_blank" rel="noreferrer" aria-label="Bitstraining on PyPI" title="PyPI"><span className="bp-pypi-mark">Py</span></a>
                </div>
              </div>
            </div>
            <HeroMachine />
          </div>
        </div>
      </section>

      <div className="bp-works"><div className="bp-eyebrow" style={{ textAlign: "center" }}>WORKS WITH</div><Marquee /></div>

      <section className="bp-stripe">
        <div className="bp-section">
          <div className="bp-container">
            <div className="bp-eyebrow">FIG. 01 — PLAN BEFORE YOU SPEND</div>
            <Reveal>
              <div className="bp-sectionhead">
                <h2>It wraps the engines you trust, and adds the judgment around them</h2>
                <div className="sub">No new trainer to learn. PyTorch/PEFT, Unsloth and MLX stay in charge of training.</div>
              </div>
            </Reveal>
            <Reveal>
              <div className="bp-stat3">
                <div className="bp-stat-card"><div className="num"><CountUp to={30} prefix="~" /></div><div className="lbl">pre-flight checks in the doctor — config, schema, truncation, duplicates, leakage and resource fit.</div></div>
                <div className="bp-stat-card"><div className="num"><CountUp to={5} /></div><div className="lbl">compute providers — local, ssh, docker, notebook for Colab / Kaggle, and a planning-only price catalog.</div></div>
                <div className="bp-stat-card"><div className="num">0</div><div className="lbl">GPUs needed to plan, inspect data, or run the simulated quickstart.</div></div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <div className="bp-section">
        <div className="bp-container">
          <div className="bp-eyebrow">FIG. 02 — TRY IT</div>
          <Reveal>
            <div className="bp-sectionhead">
              <h2>Describe a run, get the config</h2>
              <div className="sub">Fill in the form to generate a run.yaml and the commands to plan, check and train it.</div>
            </div>
          </Reveal>
          <Reveal><Playground /></Reveal>
        </div>
      </div>

      <section className="bp-stripe">
        <div className="bp-section">
          <div className="bp-container">
            <div className="bp-eyebrow">FIG. 03 — EXPLORE</div>
            <Reveal>
              <div className="bp-sectionhead">
                <h2>Five pages, each going deeper</h2>
                <div className="sub">Everything here traces back to the PyPI listing and the GitHub repository.</div>
              </div>
            </Reveal>
            <Reveal>
              <div className="bp-explore-grid">
                {[
                  ["how", Workflow, "How it works", "From a run.yaml to a gated, tracked, deployable model."],
                  ["features", Layers, "Features", "Planner, doctor, autotune, data tools, tracking, eval gate and deploy."],
                  ["compute", Cloud, "Compute", "Local, SSH, Docker, Colab and Kaggle — plus what's verified and what isn't."],
                  ["quickstart", Zap, "Quickstart", "From pip install to a planned run in a few commands."],
                  ["docs", FileText, "Docs", "Guides, CLI reference, status, plugins, FAQ and changelog."],
                ].map(([k, Icon, t, d]) => (
                  <button key={k} className="bp-explore-card" onClick={() => go(k)}>
                    <div className="ic"><Icon size={17} /></div>
                    <h3>{t}</h3><p>{d}</p>
                    <span className="go">Read more <ArrowRight size={13} /></span>
                  </button>
                ))}
                <a className="bp-explore-card" href={REPO} target="_blank" rel="noreferrer">
                  <div className="ic"><Github size={17} /></div>
                  <h3>Source on GitHub</h3>
                  <p>Read the code directly — core package, docs, examples and CPU test suite.</p>
                  <span className="go">Open repository <ArrowUpRight size={13} /></span>
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <div className="bp-section tight">
        <div className="bp-container">
          <Reveal>
            <div className="bp-callout">
              <Ban className="ic" size={26} />
              <div>
                <h3>Alpha, and honest about it</h3>
                <p>
                  The planner, data pipeline, tracking, eval gate and local provider are covered by CPU tests.
                  The GPU engines and the ssh and docker providers are written but not yet run on real hardware,
                  and the planner's predictions are unvalidated until <code>autotune</code> calibrates them on yours.
                  See the <button className="bp-textlink" onClick={() => go("docs")} style={{ display: "inline" }}>status table</button> before relying on it.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      <section className="bp-cta-band">
        <div className="bp-container">
          <Reveal>
            <h2>Plan your first fine-tune</h2>
            <p>One <code>pip install</code>, one <code>quickstart</code>, no GPU required.</p>
            <div className="bp-cta-actions">
              <a className="bp-btn-primary" href={PYPI} target="_blank" rel="noreferrer">Get bitstraining <ArrowUpRight size={16} /></a>
              <button className="bp-btn-secondary" onClick={() => go("quickstart")}>Read the quickstart</button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
