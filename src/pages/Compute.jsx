import React from "react";
import { Check, Folder, File } from "lucide-react";
import { PageHeader, Reveal, DocTable, CodeBlock } from "../components.jsx";
import { PROVIDERS, EXTRAS, OPS_ITEMS, REPO_TREE, STATUS, CODE_COMPUTE, CODE_NOTEBOOK } from "../data.js";

export default function ComputePage({ go }) {
  return (
    <>
      <PageHeader eyebrow="PAGE 04 — COMPUTE" title="Run it on whatever you have"
        sub="Your own GPU, a rented one, a container, or a free notebook — chosen with one line of config." onHome={() => go("home")} />

      <div className="bp-section">
        <div className="bp-container">
          <div className="bp-eyebrow">PROVIDERS</div>
          <Reveal>
            <div className="bp-sectionhead">
              <h2>Five providers, one config</h2>
              <div className="sub">The status column is the project's own honesty note — see the full table below.</div>
            </div>
            <DocTable head={["Provider", "What it is", "Notes", "Status"]} rows={PROVIDERS} pills />
          </Reveal>
          <Reveal style={{ marginTop: 28 }}><CodeBlock code={CODE_COMPUTE} caption="provider examples in run.yaml" /></Reveal>
          <Reveal style={{ marginTop: 20 }}><CodeBlock code={CODE_NOTEBOOK} caption="free Colab / Kaggle round trip" /></Reveal>
        </div>
      </div>

      <section className="bp-stripe">
        <div className="bp-section">
          <div className="bp-container">
            <div className="bp-eyebrow">INSTALL OPTIONS</div>
            <Reveal>
              <div className="bp-sectionhead"><h2>Pay only for the weight you need</h2>
                <div className="sub">The core needs just PyYAML. Heavy dependencies arrive as extras.</div></div>
              <DocTable head={["Extra", "Adds", "Use it for"]} rows={EXTRAS.map((e) => [e.name, e.adds, e.needs])} />
            </Reveal>
          </div>
        </div>
      </section>

      <div className="bp-section">
        <div className="bp-container">
          <div className="bp-eyebrow">STATUS & HONESTY</div>
          <Reveal>
            <div className="bp-sectionhead"><h2>What's verified, and what isn't</h2>
              <div className="sub">Bitstraining 0.1.0 is Alpha. This mirrors the project's own status table.</div></div>
            <DocTable head={["Area", "Status"]} rows={STATUS} pills />
          </Reveal>
        </div>
      </div>

      <section className="bp-stripe">
        <div className="bp-section">
          <div className="bp-container">
            <div className="bp-eyebrow">WHAT SHIPS FOR OPERATIONS</div>
            <Reveal>
              <div className="bp-check-list">
                {OPS_ITEMS.map((d) => <div className="bp-check-item" key={d}><Check size={16} /><span>{d}</span></div>)}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <div className="bp-section">
        <div className="bp-container">
          <div className="bp-eyebrow">THE REPOSITORY</div>
          <Reveal>
            <div className="bp-sectionhead"><h2>What's in the repo</h2><div className="sub">Top-level layout as listed on GitHub.</div></div>
            <div className="bp-tree">
              {REPO_TREE.map((r) => (
                <div className={`bp-tree-row ${r.type}`} key={r.name}>
                  {r.type === "folder" ? <Folder size={15} /> : <File size={15} />}
                  <span>{r.name}</span>{r.note && <span className="note">— {r.note}</span>}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </>
  );
}
