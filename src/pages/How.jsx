import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { PageHeader, Reveal, CodeBlock, FlowDiagram } from "../components.jsx";
import { FLOW, TOGGLES, CODE_RUN, CODE_FLOW, CODE_COMPUTE, CODE_EVAL } from "../data.js";
import { ICONS } from "../components.jsx";

const TABS = [
  { key: "cfg", label: "run.yaml", cap: "describe the run once", code: CODE_RUN, note: "Base model, data, goal and compute in one file. objective can be time, cost or memory, and budget_usd caps spend." },
  { key: "cli", label: "workflow", cap: "from config to a tracked run", code: CODE_FLOW, note: "Each step is a command. train --tune folds planning, checks and autotune into one go." },
  { key: "compute", label: "compute", cap: "choose where it runs", code: CODE_COMPUTE, note: "Swap the provider line and the same config runs on your machine, over SSH, in a container, or in a notebook." },
  { key: "eval", label: "after training", cap: "audit, document, serve", code: CODE_EVAL, note: "The eval gate blocks export on regressions; the model card records the data hash and lineage." },
];

export default function HowPage({ go }) {
  const [tab, setTab] = useState("cfg");
  const t = TABS.find((x) => x.key === tab);
  return (
    <>
      <PageHeader eyebrow="PAGE 02 — HOW IT WORKS" title="Plan first, train second, gate before you ship"
        sub="Bitstraining plans, checks and tracks. The training itself runs in the engine you already trust." onHome={() => go("home")} />

      <div className="bp-section">
        <div className="bp-container">
          <Reveal>
            <div className="bp-tabs">
              {TABS.map((x) => (
                <button key={x.key} className={`bp-tab ${tab === x.key ? "active" : ""}`} onClick={() => setTab(x.key)}>{x.label}</button>
              ))}
            </div>
            <CodeBlock code={t.code} caption={t.cap} bar={<div className="bp-codebox-note">{t.note}</div>} />
          </Reveal>
        </div>
      </div>

      <section className="bp-stripe">
        <div className="bp-section">
          <div className="bp-container">
            <div className="bp-eyebrow">THE SHAPE OF A RUN</div>
            <Reveal>
              <div className="bp-sectionhead">
                <h2>Four stages, from a YAML file to a gated model</h2>
                <div className="sub">Condensed from the README pipeline. The dashed green box is everything you can do without a GPU.</div>
              </div>
            </Reveal>
            <Reveal>
              <div className="bp-flow">
                {FLOW.map((f, i) => (
                  <div className="bp-flow-step" key={f.title}>
                    <div className="bp-flow-num">{String(i + 1).padStart(2, "0")}</div>
                    <h4>{f.title}</h4><p>{f.body}</p>
                    {i < FLOW.length - 1 && <div className="bp-flow-arrow"><ArrowRight size={12} /></div>}
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal style={{ marginTop: 28 }}><FlowDiagram /></Reveal>
          </div>
        </div>
      </section>

      <div className="bp-section">
        <div className="bp-container">
          <div className="bp-eyebrow">WHEN SOMETHING IS OFF</div>
          <Reveal>
            <div className="bp-panel-card">
              <h3 style={{ fontSize: 18, marginBottom: 6 }}>Built to say "not yet" instead of guessing</h3>
              <p style={{ color: "var(--ink-dim)", fontSize: 13.8, margin: 0, maxWidth: "62ch", lineHeight: 1.6 }}>
                Each situation below has a built-in answer — a command that surfaces it and a fix to try.
              </p>
              <div className="bp-toggle-grid">
                {TOGGLES.map((t) => {
                  const Icon = ICONS[t.icon];
                  return (
                    <div className="bp-toggle-row" key={t.label}>
                      <Icon className="ic" size={18} />
                      <div><div className="t-label">{t.label}</div><div className="t-sub">{t.sub}</div></div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </>
  );
}
