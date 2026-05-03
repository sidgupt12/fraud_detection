# 🛡️ FraudSentinel AI

**Regulatory-Aware AI Fraud Detection for Indian SMEs** — a fully self-contained React + Tailwind + Framer Motion frontend showcase.

A polished, single-page operational terminal that fuses GNNs, β-VAEs and IndicBERT with the SEBI XBRL schema, GST reconciliation and Ind AS compliance to surface fraud signals specific to Indian SME filings.

> Built as a static demo for an academic project showcase. Every chart, every log line, every score is driven by hardcoded data designed to mirror the architecture in the paper. No backend, no auth, no API calls.

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to ./dist
npm run preview  # serve the production bundle
```

Requires Node ≥ 20.

---

## Tech stack

| Concern             | Choice                                         |
| ------------------- | ---------------------------------------------- |
| Build tool          | Vite 8                                         |
| UI                  | React 19 + TypeScript                          |
| Styling             | Tailwind CSS 3 (custom dark, neon-accent theme) |
| Animations          | Framer Motion                                  |
| Charts              | Recharts                                       |
| Score gauges        | react-circular-progressbar                     |
| Iconography         | lucide-react                                   |
| Routing             | react-router-dom                               |

---

## Pages

| Path               | What it does                                                                                                |
| ------------------ | ----------------------------------------------------------------------------------------------------------- |
| `/`                | **Dashboard** — animated counters, typewriter init log, live activity feed, fraud distribution donut.       |
| `/analyze`         | **Upload & Analyze** — pick one of 5 sample filings; triggers a 6-step inference overlay (~8 s).            |
| `/reports`         | **Report Viewer** — fraud score gauge, model contributions, severity-tagged findings, audit narrative.     |
| `/graph`           | **Transaction Graph** — animated SVG force layout with pulsing suspicious nodes and ₹-denominated edges.   |
| `/explainability`  | **Explainability** — SHAP feature importance, ROC curve vs 4 baselines, ablation table, sensitivity table. |
| `/architecture`    | **System Architecture** — animated end-to-end pipeline with sequential module highlight + federated strip. |

---

## Project layout

```
src/
  components/
    layout/    Navbar · Sidebar · StatusBar · AnimatedBackground · AppShell
    ui/        Card · Badge · Progress · Tabs · Tooltip · Separator · Alert · Table
    charts/    FraudDonut · ShapChart · RocCurve · F1Comparison · ScoreBreakdown
    graph/     TransactionGraph (custom SVG, animated)
    analysis/  AnalysisOverlay · StepProgress (6-step pipeline animation)
    reports/   ScoreGauge · FindingItem · ReportCard
    pages/     Dashboard · UploadAnalyze · ReportViewer · TransactionGraphPage · Explainability · Architecture
  data/        reports · graphData · shapData · chartData · terminalLogs
  hooks/       useCountUp · useTypewriter · useAnalysisSimulation
  lib/         utils (Indian rupee formatter, severity styles, score-color helper)
```

---

## Sample data

Five curated filings cover the verdict spectrum:

| ID         | Firm                              | Region    | Sector          | Score | Verdict     |
| ---------- | --------------------------------- | --------- | --------------- | ----- | ----------- |
| sample1    | Apex Retail Networks              | Delhi     | E-commerce      | 0.757 | FRAUD       |
| sample2    | Madurai Cotton Finance            | Mumbai    | Textile NBFC    | 0.821 | FRAUD       |
| sample3    | Trilytics IT Services             | Bengaluru | IT / SaaS       | 0.234 | CLEAN       |
| sample4    | BengalEx Trading                  | Kolkata   | Wholesale       | 0.631 | SUSPICIOUS  |
| sample5    | Vasundhara Pharma Labs            | Hyderabad | Pharma SME      | 0.312 | CLEAN       |

All five have unique transaction graphs, multilingual evidence (Hindi, Tamil, Bengali, Telugu, English), Llama-3 narratives and severity-ranked findings.

---

## Score formula

The weighted ensemble exposed throughout the UI:

```
S = 0.4·S_GNN + 0.2·S_VAE + 0.3·S_IndicBERT + 0.1·S_ML
```

Threshold: **0.70**. Scores between 0.50 and 0.70 are flagged as `SUSPICIOUS`.

---

## License

Academic showcase — content and visuals belong to the project authors.
