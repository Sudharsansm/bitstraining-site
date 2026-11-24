import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PageHeader, DocBlock } from "../components.jsx";
import { DOC_NAV, DOCS_PAGES } from "../data.js";

const ORDER = DOC_NAV.flatMap((g) => g.pages);

export default function DocsPage({ go, initialDoc }) {
  const [docKey, setDocKey] = useState(initialDoc || "getting-started");
  useEffect(() => { if (initialDoc && DOCS_PAGES[initialDoc]) setDocKey(initialDoc); }, [initialDoc]);

  const select = (key) => {
    setDocKey(key);
    window.location.hash = `docs/${key}`;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const doc = DOCS_PAGES[docKey];
  const i = ORDER.indexOf(docKey);
  const prev = ORDER[i - 1], next = ORDER[i + 1];

  return (
    <>
      <PageHeader eyebrow="PAGE 06 — DOCS" title="Documentation"
        sub="A guided tour of the planner, data tools, compute providers and CLI. The repository's docs/ folder is the full reference." onHome={() => go("home")} />
      <div className="bp-section tight">
        <div className="bp-container bp-docs">
          <nav className="bp-docs-nav" aria-label="Documentation">
            {DOC_NAV.map((g) => (
              <div className="bp-docs-group" key={g.group}>
                <h5>{g.group}</h5>
                {g.pages.map((p) => (
                  <button key={p} className={docKey === p ? "active" : ""} onClick={() => select(p)}>{DOCS_PAGES[p].title}</button>
                ))}
              </div>
            ))}
          </nav>

          <div>
            <div className="bp-docs-mobile" style={{ marginBottom: 20 }}>
              <label htmlFor="doc-select" style={{ position: "absolute", left: -9999 }}>Choose a doc page</label>
              <select id="doc-select" value={docKey} onChange={(e) => select(e.target.value)}>
                {DOC_NAV.map((g) => (
                  <optgroup label={g.group} key={g.group}>
                    {g.pages.map((p) => <option key={p} value={p}>{DOCS_PAGES[p].title}</option>)}
                  </optgroup>
                ))}
              </select>
            </div>

            <article className="bp-doc">
              <div className="bp-eyebrow">{doc.tag}</div>
              <h2>{doc.title}</h2>
              <p className="tagline">{doc.tagline}</p>
              {doc.blocks.map((b, k) => <DocBlock key={k} b={b} />)}
              <div className="bp-doc-pager">
                {prev && <button onClick={() => select(prev)}><small><ArrowLeft size={11} /> Previous</small>{DOCS_PAGES[prev].title}</button>}
                {next && <button className="next" onClick={() => select(next)}><small>Next <ArrowRight size={11} /></small>{DOCS_PAGES[next].title}</button>}
              </div>
            </article>
          </div>
        </div>
      </div>
    </>
  );
}
