import React, { useState } from "react";
import { Check } from "lucide-react";
import { PageHeader, Reveal, ICONS, highlight } from "../components.jsx";
import { FEATURES, CODE_PLAN, CODE_FLOW, CODE_COMPUTE, CODE_EVAL } from "../data.js";

const CODES = { plan: CODE_PLAN, flow: CODE_FLOW, compute: CODE_COMPUTE, eval: CODE_EVAL };

export default function FeaturesPage({ go }) {
  const [key, setKey] = useState(FEATURES[0].key);
  const f = FEATURES.find((x) => x.key === key);
  return (
    <>
      <PageHeader eyebrow="PAGE 03 — FEATURES" title="Eight parts, one small core"
        sub="The core needs only PyYAML; training engines come in as extras. Pick a part to see what's included." onHome={() => go("home")} />
      <div className="bp-section">
        <div className="bp-container">
          <Reveal>
            <div className="bp-cap-grid">
              <div className="bp-cap-list" role="tablist" aria-label="Features">
                {FEATURES.map((x) => {
                  const Icon = ICONS[x.icon];
                  return (
                    <button key={x.key} role="tab" aria-selected={key === x.key} className={`bp-cap-item ${key === x.key ? "active" : ""}`} onClick={() => setKey(x.key)}>
                      <span className="ic"><Icon size={14} /></span>{x.label}
                    </button>
                  );
                })}
              </div>
              <div className="bp-cap-panel" role="tabpanel">
                <h3>{f.label}</h3>
                <p className="desc">{f.desc}</p>
                <ul className="bp-feature-list">
                  {f.items.map((it) => <li key={it}><Check size={14} /><span>{it}</span></li>)}
                </ul>
                {f.code && (
                  <div className="bp-cap-code">
                    <pre><code dangerouslySetInnerHTML={{ __html: highlight(CODES[f.code]) }} /></pre>
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </>
  );
}
