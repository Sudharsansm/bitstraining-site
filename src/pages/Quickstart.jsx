import React from "react";
import { FlaskConical } from "lucide-react";
import { PageHeader, Reveal, Cmd } from "../components.jsx";
import { REQUIREMENTS } from "../data.js";

export default function QuickstartPage({ go, installer, setInstaller }) {
  return (
    <>
      <PageHeader eyebrow="PAGE 05 — QUICKSTART" title="From pip install to a planned run"
        sub="A few commands, start to finish. The first one needs no GPU." onHome={() => go("home")} />
      <div className="bp-section">
        <div className="bp-container">
          <Reveal>
            <div className="bp-req-grid">
              {REQUIREMENTS.map((r) => (
                <div className="bp-req-card" key={r.lbl}><div className="lbl">{r.lbl}</div><div className="val">{r.val}</div></div>
              ))}
            </div>
          </Reveal>

          <Reveal style={{ marginTop: 40 }}>
            <div className="bp-install-row" style={{ marginBottom: 40 }}>
              <div className="bp-pillswitch">
                <button className={installer === "pip" ? "active" : ""} onClick={() => setInstaller("pip")}>pip</button>
                <button className={installer === "uv" ? "active" : ""} onClick={() => setInstaller("uv")}>uv</button>
              </div>
              <Cmd>{installer === "pip" ? "pip install bitstraining" : "uv add bitstraining"}</Cmd>
            </div>
          </Reveal>

          <Reveal>
            <div className="bp-steps">
              <div className="bp-step"><div className="bp-step-num">1</div>
                <div><h4>Create and activate a virtual environment</h4><Cmd>python3 -m venv venv &amp;&amp; source venv/bin/activate</Cmd></div></div>
              <div className="bp-step"><div className="bp-step-num">2</div>
                <div><h4>Install bitstraining (add [train] when you are ready to really fine-tune)</h4><Cmd>pip install "bitstraining[train]"</Cmd></div></div>
              <div className="bp-step"><div className="bp-step-num">3</div>
                <div><h4>Try the whole pipeline with no GPU</h4><Cmd>bitstraining quickstart</Cmd></div></div>
              <div className="bp-step"><div className="bp-step-num">4</div>
                <div><h4>Create a starter config, then inspect your data</h4><Cmd>bitstraining init --template chat -o run.yaml &amp;&amp; bitstraining data inspect data/train.jsonl</Cmd></div></div>
              <div className="bp-step"><div className="bp-step-num">5</div>
                <div><h4>Plan, check, and train</h4><Cmd>bitstraining plan -c run.yaml &amp;&amp; bitstraining doctor -c run.yaml &amp;&amp; bitstraining train -c run.yaml --tune</Cmd>
                  <div className="bp-step-bonus"><FlaskConical size={14} />Then audit the result: <b>bitstraining eval</b> gates the export, <b>bitstraining card</b> writes the model card.</div></div></div>
            </div>
          </Reveal>
        </div>
      </div>
    </>
  );
}
