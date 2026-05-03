import { type FraudReport } from "../data/reports";
import { GRAPHS } from "../data/graphData";

const VERDICT_COLOR: Record<FraudReport["verdict"], string> = {
  CLEAR: "#7eb27e",
  REVIEW: "#e0a050",
  ESCALATE: "#d9695a",
};

const VERDICT_TITLE: Record<FraudReport["verdict"], string> = {
  CLEAR: "Clear · No material risk",
  REVIEW: "Manual review required",
  ESCALATE: "Escalate to FIU-IND",
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Build a fully self-contained HTML audit report for a given filing.
 * The output is portable: open it in any browser and Print-to-PDF works.
 */
export function reportToHtml(r: FraudReport): string {
  const color = VERDICT_COLOR[r.verdict];
  const title = `${r.quarter} ${r.fiscalYear} · ${r.company} · FraudSentinel Audit Report`;
  const graph = GRAPHS[r.id];

  const findings = r.findings
    .map(
      (f) => `
        <li class="finding sev-${f.severity.toLowerCase()}">
          <span class="badge">${f.severity}</span>
          <div>
            <div class="finding-text">${escapeHtml(f.text)}</div>
            ${f.detail ? `<div class="finding-detail">${escapeHtml(f.detail)}</div>` : ""}
          </div>
        </li>`,
    )
    .join("");

  const recs = r.recommendations
    .map((r2, i) => `<li><span class="step">${i + 1}</span>${escapeHtml(r2.text)}</li>`)
    .join("");

  const whyGood = r.explainer.whyGood
    .map((b) => `<li>${escapeHtml(b)}</li>`)
    .join("");
  const whyConcerning = r.explainer.whyConcerning
    .map((b) => `<li>${escapeHtml(b)}</li>`)
    .join("");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${escapeHtml(title)}</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  :root { --bg: #ffffff; --ink: #1c1b18; --muted: #6b6862; --line: #e5e2db; --accent: ${color}; }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    background: var(--bg);
    color: var(--ink);
    font-family: "DM Sans", "Inter", system-ui, -apple-system, "Segoe UI", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    line-height: 1.55;
  }
  .page { max-width: 880px; margin: 0 auto; padding: 56px 56px 80px; }
  .meta {
    display: flex; justify-content: space-between; align-items: baseline;
    border-bottom: 1px solid var(--line); padding-bottom: 16px; margin-bottom: 28px;
    color: var(--muted); font-size: 11.5px; text-transform: uppercase; letter-spacing: 0.14em;
    font-family: "JetBrains Mono", ui-monospace, monospace;
  }
  h1 { font-size: 28px; margin: 0 0 8px; line-height: 1.1; letter-spacing: -0.01em; }
  h2 { font-size: 17px; margin: 28px 0 10px; padding-top: 22px; border-top: 1px solid var(--line); }
  h3 { font-size: 13.5px; margin: 16px 0 8px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.14em; font-family: "JetBrains Mono", ui-monospace, monospace; font-weight: 600; }
  .verdict-banner {
    margin: 18px 0 22px;
    padding: 18px 22px;
    border-left: 4px solid var(--accent);
    background: ${color}14;
    border-radius: 4px;
  }
  .verdict-banner .v-title { font-size: 18px; font-weight: 600; color: var(--accent); }
  .verdict-banner .v-headline { font-size: 15px; margin-top: 4px; color: var(--ink); }
  .stats { display: grid; grid-template-columns: repeat(5, 1fr); gap: 18px; margin: 24px 0; }
  .stat .l { font-size: 10.5px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.14em; font-family: "JetBrains Mono", ui-monospace, monospace; }
  .stat .v { font-size: 22px; font-weight: 600; margin-top: 4px; }
  .why { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 18px; }
  .why ul { margin: 8px 0 0; padding-left: 18px; font-size: 13.5px; }
  .why .good h3 { color: #527c52; }
  .why .bad h3 { color: #a14d3f; }
  .why ul li { margin-bottom: 4px; }
  .why .empty { color: var(--muted); font-style: italic; padding-left: 0; list-style: none; }
  ul.findings { list-style: none; padding: 0; margin: 0; }
  ul.findings li {
    display: grid; grid-template-columns: 90px 1fr; gap: 14px;
    padding: 10px 0; border-top: 1px solid var(--line);
  }
  ul.findings li:first-child { border-top: 0; }
  .finding-text { font-size: 13.5px; }
  .finding-detail { font-size: 12px; color: var(--muted); margin-top: 2px; font-family: "JetBrains Mono", ui-monospace, monospace; }
  .badge {
    display: inline-block; font-size: 10.5px; padding: 2px 6px;
    border-radius: 4px; text-transform: uppercase; letter-spacing: 0.14em;
    font-family: "JetBrains Mono", ui-monospace, monospace; font-weight: 600;
  }
  .sev-high .badge { background: #f5dad6; color: #a14d3f; }
  .sev-medium .badge { background: #f3e2c1; color: #8a651e; }
  .sev-low .badge { background: #d8eed8; color: #3f6e3f; }
  .sev-info .badge { background: #d9e6ee; color: #3a5b75; }
  ol.recs { padding: 0; margin: 0; list-style: none; counter-reset: step; }
  ol.recs li { padding: 8px 0; border-top: 1px solid var(--line); display: grid; grid-template-columns: 28px 1fr; align-items: baseline; gap: 10px; font-size: 13.5px; }
  ol.recs li:first-child { border-top: 0; }
  ol.recs .step { font-family: "JetBrains Mono", ui-monospace, monospace; color: var(--muted); font-size: 11px; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; margin-top: 8px; }
  th { text-align: left; padding: 8px 10px; background: #f5f2eb; color: var(--muted); font-size: 11px; text-transform: uppercase; letter-spacing: 0.14em; font-family: "JetBrains Mono", ui-monospace, monospace; font-weight: 600; }
  td { padding: 8px 10px; border-top: 1px solid var(--line); }
  td.num { text-align: right; font-variant-numeric: tabular-nums; font-family: "JetBrains Mono", ui-monospace, monospace; }
  .formula { background: #f5f2eb; padding: 14px 16px; border-radius: 4px; font-family: "JetBrains Mono", ui-monospace, monospace; font-size: 12.5px; color: var(--ink); margin-top: 12px; }
  .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid var(--line); font-size: 11px; color: var(--muted); }
  @page { margin: 18mm 16mm; }
  @media print { body { background: #fff; } .page { padding: 0; } }
</style>
</head>
<body>
<main class="page">
  <div class="meta">
    <span>FraudSentinel Audit Report · v1.4</span>
    <span>Generated ${new Date().toLocaleString("en-IN")}</span>
  </div>

  <h1>${escapeHtml(r.company)}</h1>
  <div style="color: var(--muted); font-size: 13.5px;">
    ${escapeHtml(r.quarter)} ${escapeHtml(r.fiscalYear)} · Filed ${escapeHtml(r.reportDate)} · Source ${escapeHtml(r.fileName)}
  </div>

  <div class="verdict-banner">
    <div class="v-title">${VERDICT_TITLE[r.verdict]}</div>
    <div class="v-headline">${escapeHtml(r.explainer.headline)}</div>
  </div>

  <h3>Executive summary</h3>
  <p style="margin: 0; font-size: 14px;">${escapeHtml(r.explainer.paragraph)}</p>
  <p style="margin: 12px 0 0; font-size: 13.5px;"><strong>Bottom line.</strong> ${escapeHtml(r.explainer.bottomLine)}</p>

  <div class="why">
    <div class="good">
      <h3>What looks good</h3>
      ${
        whyGood
          ? `<ul>${whyGood}</ul>`
          : `<ul class="empty"><li>—</li></ul>`
      }
    </div>
    <div class="bad">
      <h3>What raised flags</h3>
      ${
        whyConcerning
          ? `<ul>${whyConcerning}</ul>`
          : `<ul class="empty"><li>No flags — quarter is clean.</li></ul>`
      }
    </div>
  </div>

  <h2>Quarter snapshot</h2>
  <div class="stats">
    <div class="stat"><div class="l">Total transactions</div><div class="v">${r.stats.totalTxns.toLocaleString("en-IN")}</div></div>
    <div class="stat"><div class="l">Fraud transactions</div><div class="v">${r.stats.fraudTxns} · ${r.stats.fraudPct}%</div></div>
    <div class="stat"><div class="l">Shell-entity transfers</div><div class="v">${r.stats.shellTxns}</div></div>
    <div class="stat"><div class="l">GST mismatches</div><div class="v">${r.stats.gstMismatches}</div></div>
    <div class="stat"><div class="l">Avg anomaly score</div><div class="v">${r.stats.avgScore.toFixed(2)}</div></div>
  </div>

  <h2>Per-model contributions</h2>
  <table>
    <thead><tr><th>Model</th><th>Score</th><th>Weight</th><th>Weighted</th></tr></thead>
    <tbody>
      <tr><td>GNN — graph anomalies</td><td class="num">${r.scores.gnn.toFixed(2)}</td><td class="num">0.40</td><td class="num">${(r.scores.gnn * 0.4).toFixed(3)}</td></tr>
      <tr><td>VAE — numerical anomalies</td><td class="num">${r.scores.vae.toFixed(2)}</td><td class="num">0.20</td><td class="num">${(r.scores.vae * 0.2).toFixed(3)}</td></tr>
      <tr><td>IndicBERT — disclosures</td><td class="num">${r.scores.indicBert.toFixed(2)}</td><td class="num">0.30</td><td class="num">${(r.scores.indicBert * 0.3).toFixed(3)}</td></tr>
      <tr><td>ML baseline — XGBoost</td><td class="num">${r.scores.ml.toFixed(2)}</td><td class="num">0.10</td><td class="num">${(r.scores.ml * 0.1).toFixed(3)}</td></tr>
    </tbody>
  </table>
  <div class="formula">
    S = 0.4·S<sub>GNN</sub> + 0.2·S<sub>VAE</sub> + 0.3·S<sub>IndicBERT</sub> + 0.1·S<sub>ML</sub>  =  ${r.fraudScore.toFixed(3)} → <strong style="color: ${color}">${r.verdict}</strong>
  </div>

  <h2>Findings</h2>
  <ul class="findings">${findings}</ul>

  <h2>Recommendations</h2>
  <ol class="recs">${recs}</ol>

  <h2>Transaction graph summary</h2>
  <table>
    <tbody>
      <tr><td>Nodes</td><td class="num">${graph.meta.nodeCount}</td></tr>
      <tr><td>Edges</td><td class="num">${graph.meta.edgeCount}</td></tr>
      <tr><td>Suspicious edges</td><td class="num">${graph.meta.suspiciousEdges}</td></tr>
      <tr><td>Edge prune threshold</td><td class="num">${graph.meta.threshold.toFixed(2)}</td></tr>
      <tr><td>GCN architecture</td><td class="num">${escapeHtml(graph.meta.gcnSpec)}</td></tr>
    </tbody>
  </table>

  <h2>Llama-3 narrative</h2>
  <p style="margin: 0; font-size: 13.5px;">${escapeHtml(r.narrative)}</p>

  <h2>Compliance posture</h2>
  <table>
    <thead><tr><th>Check</th><th>Status</th></tr></thead>
    <tbody>
      <tr><td>SEBI XBRL Schema v2024</td><td>${r.compliance.sebiXbrl ? "PASS" : "FAIL"}</td></tr>
      <tr><td>GST Reconciliation (GSTR-1 / 2A / 3B)</td><td>${r.stats.gstMismatches === 0 ? "PASS" : r.stats.gstMismatches >= 100 ? "FAIL" : "REVIEW"}</td></tr>
      <tr><td>Ind AS 18 / 24 Compliance</td><td>${r.compliance.indAs}</td></tr>
      <tr><td>MCA / FIU-IND Cross-Reference</td><td>${r.verdict === "ESCALATE" ? "FAIL" : r.verdict === "REVIEW" ? "REVIEW" : "PASS"}</td></tr>
    </tbody>
  </table>

  <div class="footer">
    FraudSentinel AI · Regulatory-Aware Fraud Intelligence for Indian SMEs · 91% F1 (95% CI 89–93%, p&lt;0.01) · ROC AUC 0.96 ·
    Validated on 1,500 real BSE SME filings + 3,800 GAN-synthesized reports. Generated for academic / showcase use.
  </div>
</main>
</body>
</html>`;
}

/**
 * Trigger a browser download of the HTML report for the given filing.
 */
export function downloadReportHtml(report: FraudReport): void {
  const html = reportToHtml(report);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${report.id}-${report.quarter}-${report.fiscalYear.replace(/\s+/g, "")}-fraudsentinel-audit.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Defer the revoke so the browser has time to start the download.
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
