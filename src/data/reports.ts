import type { Severity } from "../lib/utils";

export type Verdict = "CLEAR" | "REVIEW" | "ESCALATE";

export interface Finding {
  severity: Severity;
  text: string;
  detail?: string;
}

export interface Recommendation {
  text: string;
  icon?: "shield" | "search" | "file" | "alert" | "scale" | "users" | "check";
}

export interface ScoreBreakdown {
  gnn: number;
  vae: number;
  indicBert: number;
  ml: number;
}

export interface QuarterStats {
  totalTxns: number;
  fraudTxns: number;
  fraudPct: number;
  shellTxns: number;
  gstMismatches: number;
  avgScore: number;
}

export interface ReportExplainer {
  /** 1-line plain-English summary, e.g. "This quarter looks healthy." */
  headline: string;
  /** 2-3 sentence plain-English paragraph explaining the verdict. */
  paragraph: string;
  /** Bullets describing what looks good (always present, even on ESCALATE). */
  whyGood: string[];
  /** Bullets describing what raised concerns (empty on a fully clean quarter). */
  whyConcerning: string[];
  /** Bottom-line recommended action for the auditor. */
  bottomLine: string;
}

export interface FraudReport {
  id: string;
  fileName: string;
  company: string;
  quarter: string;
  fiscalYear: string;
  reportDate: string;
  verdict: Verdict;
  /** Composite quarter risk on a 0..1 scale (used for score gauge). */
  fraudScore: number;
  scores: ScoreBreakdown;
  stats: QuarterStats;
  compliance: {
    sebiXbrl: boolean;
    gst: boolean;
    indAs: "REVIEWED" | "REVIEW REQUIRED" | "PENDING";
  };
  features: {
    debtRatio: number;
    profitMarginQoQ: string;
    languages: string[];
    pages: number;
    xbrlTags: number;
  };
  findings: Finding[];
  recommendations: Recommendation[];
  narrative: string;
  explainer: ReportExplainer;
}

const COMPANY = "Apex Retail Networks Pvt. Ltd.";

export const REPORTS: FraudReport[] = [
  {
    id: "sample1",
    fileName: "sample1.csv",
    company: COMPANY,
    quarter: "Q1",
    fiscalYear: "FY 2024",
    reportDate: "30 Jun 2023",
    verdict: "CLEAR",
    fraudScore: 0.176,
    scores: { gnn: 0.12, vae: 0.17, indicBert: 0.22, ml: 0.15 },
    stats: {
      totalTxns: 2000,
      fraudTxns: 0,
      fraudPct: 0,
      shellTxns: 0,
      gstMismatches: 0,
      avgScore: 0.181,
    },
    compliance: { sebiXbrl: true, gst: true, indAs: "REVIEWED" },
    features: {
      debtRatio: 1.2,
      profitMarginQoQ: "+1.8%",
      languages: ["Hindi", "English"],
      pages: 38,
      xbrlTags: 287,
    },
    findings: [
      {
        severity: "INFO",
        text: "FY opening quarter: 2,000 posted lines — cohort risk floor at 0.18",
        detail: "Inventory-led quarter; anchor vendor share 62% of procurement INR",
      },
      {
        severity: "INFO",
        text: "Full GSTR-1 / 2A / 3B tie-out — ₹0 unreconciled ITC",
        detail: "1,742 GST lines; zero credit-note pendency older than 30 days",
      },
      {
        severity: "LOW",
        text: "12 XBRL tags show immaterial rounding vs trial balance (≤0.35%)",
        detail: "TradePayables, InventoryFinishedGoods — within Ind AS materiality memo",
      },
      {
        severity: "INFO",
        text: "IndicBERT: Hindi MD&A aligns with published numbers — no loan-risk lexemes",
        detail: "Mean clause confidence 0.93; no related-party ambiguity phrases",
      },
    ],
    recommendations: [
      { text: "File this quarter as the signed statistical baseline for downstream models.", icon: "check" },
      { text: "Keep vendor onboarding tied to MCA + GSTIN legal-name match in SAP.", icon: "shield" },
    ],
    narrative:
      "Q1 FY24 establishes the firm’s operational fingerprint: procurement is concentrated in two anchor distributors, sell-through is split across three metro anchors, and the Hindi management commentary matches the XBRL fact table line-for-line. The ensemble sits at 0.176 — comfortably under the 0.20 review rail — with GNN topology showing a textbook SME hub without lateral payment circuits.",
    explainer: {
      headline: "Clean opening quarter — the model learns what “normal” looks like.",
      paragraph:
        "This is the first full quarter after fiscal roll-forward. Cash and stock patterns are boring in the right way: predictable vendor concentration, no new shell entities, and disclosures that read the same in Hindi and in XBRL. That low, stable score becomes the reference curve that Q3–Q5 later break away from.",
      whyGood: [
        "Zero fraud-flagged transactions across all 2,000 rows.",
        "GST ledgers tie to the rupee; no ageing credit notes in suspense.",
        "Graph is a tight hub-and-spoke — only vetted suppliers and core customers.",
        "287 XBRL facts validate against SEBI taxonomy v2024 without overrides.",
        "Narrative tone matches statutory numbers — textual risk sits near neutral.",
      ],
      whyConcerning: [],
      bottomLine:
        "Sign off as routine. Freeze this quarter as the baseline embedding for anomaly scoring.",
    },
  },
  {
    id: "sample2",
    fileName: "sample2.csv",
    company: COMPANY,
    quarter: "Q2",
    fiscalYear: "FY 2024",
    reportDate: "30 Sep 2023",
    verdict: "CLEAR",
    fraudScore: 0.172,
    scores: { gnn: 0.11, vae: 0.16, indicBert: 0.2, ml: 0.14 },
    stats: {
      totalTxns: 2000,
      fraudTxns: 0,
      fraudPct: 0,
      shellTxns: 0,
      gstMismatches: 0,
      avgScore: 0.166,
    },
    compliance: { sebiXbrl: true, gst: true, indAs: "REVIEWED" },
    features: {
      debtRatio: 1.28,
      profitMarginQoQ: "+2.4%",
      languages: ["Hindi", "English", "Punjabi"],
      pages: 44,
      xbrlTags: 301,
    },
    findings: [
      {
        severity: "INFO",
        text: "Festival trade mix: +2.4% QoQ revenue with stable gross margin band",
        detail: "VAE manifold distance 0.9σ from Q1 centroid — still inside “healthy drift”",
      },
      {
        severity: "LOW",
        text: "New Tier-2 logistics vendor onboarded (GSTIN 30 days old) — passes KYC + MCA screen",
        detail: "Single corridor of ₹2.4 L avg weekly freight; no round-trip pattern yet",
      },
      {
        severity: "INFO",
        text: "B2B return credit notes (+ ₹18.2 L) fully matched in GSTR-2A within 48h",
        detail: "Explains temporary spike in TradeReceivables tag vs Q1",
      },
      {
        severity: "LOW",
        text: "301 XBRL facts (+14 vs Q1) after capitalization of showroom fit-out WIP",
        detail: "Borrowings tag flat QoQ — no hidden leverage language in Punjabi footnote",
      },
    ],
    recommendations: [
      { text: "Keep enhanced vendor monitoring on the new logistics GSTIN for 90 days.", icon: "search" },
      { text: "No audit modification — document the WIP capitalization walk in working papers.", icon: "file" },
    ],
    narrative:
      "Q2 FY24 is still unambiguously clean, but it is not a photocopy of Q1: festive SKU mix pulls receivables higher, a third logistics counter-party appears on the wire file (fully KYC’d), and the Punjabi subsidiary footnote expands while staying numerically consistent. The blended score dips to 0.166 — marginally lower than Q1 — because graph diversity increases without introducing suspicious loops.",
    explainer: {
      headline: "Still clear — different economic story from Q1.",
      paragraph:
        "Quarter two looks healthy, but for different reasons than quarter one. You should see more counter-party labels on the map, heavier return-note traffic in GST, and a few extra XBRL facts tied to capex — not fraud signals, just seasonality and a new freight vendor that passed documentary checks. The models reward that honesty with an even slightly lower blended risk than Q1.",
      whyGood: [
        "Zero transactions breach the 0.70 per-line fraud threshold.",
        "Logistics vendor is new yet traceable — PAN/GSTIN/MCA all align.",
        "Credit-note choreography is tight; nothing sits unmatched in 2A.",
        "Textual disclosures add Punjabi detail without contradicting the ledger.",
        "Graph gains one spoke but keeps acyclic cash paths (no rings).",
      ],
      whyConcerning: [],
      bottomLine:
        "Routine sign-off. Note the operational drift for comparison when Q3 spikes.",
    },
  },
  {
    id: "sample3",
    fileName: "sample3.csv",
    company: COMPANY,
    quarter: "Q3",
    fiscalYear: "FY 2024",
    reportDate: "31 Dec 2023",
    verdict: "REVIEW",
    fraudScore: 0.21,
    scores: { gnn: 0.32, vae: 0.27, indicBert: 0.41, ml: 0.24 },
    stats: {
      totalTxns: 2000,
      fraudTxns: 120,
      fraudPct: 6,
      shellTxns: 60,
      gstMismatches: 51,
      avgScore: 0.21,
    },
    compliance: { sebiXbrl: true, gst: true, indAs: "REVIEW REQUIRED" },
    features: {
      debtRatio: 1.6,
      profitMarginQoQ: "+5.7%",
      languages: ["Hindi", "English"],
      pages: 46,
      xbrlTags: 308,
    },
    findings: [
      {
        severity: "HIGH",
        text: "60 transactions to 4 newly-onboarded shell entities — total ₹38,40,000",
        detail: "All 4 entities share registration address in East Delhi; MCA records < 90 days old",
      },
      {
        severity: "HIGH",
        text: "51 GSTR-1 / 3B mismatches — cumulative gap ₹4,80,000",
        detail: "Concentrated on TaxLiability and TradePayables XBRL tags",
      },
      {
        severity: "MEDIUM",
        text: "120 transactions flagged by GNN with anomaly score > 0.70",
        detail: "Cluster-1 fan-out from Firm → Vendor X → 4 new shells",
      },
      {
        severity: "MEDIUM",
        text: 'Hindi disclosure introduces risk phrase "अप्रकाशित ऋण" (unreported loans)',
        detail: "IndicBERT token-level attention concentrated on tokens 142–158",
      },
      {
        severity: "LOW",
        text: "Debt ratio rising — 1.28 → 1.6 QoQ (still below 2.0 trigger)",
        detail: "VAE z-score 1.2σ on debt manifold",
      },
    ],
    recommendations: [
      { text: "Initiate MCA / FIU-IND lookup for the 4 newly-flagged shell entities.", icon: "search" },
      { text: "File revised GSTR-1 to close the ₹4.8 L reconciliation gap.", icon: "file" },
      { text: "Schedule manual review of all 120 flagged transactions.", icon: "shield" },
      { text: "Verify Hindi disclosure of unreported liabilities per Ind AS 24.", icon: "scale" },
    ],
    narrative:
      "Q3 FY 2024 marks the first emergence of fraud signals after two clean quarters. 6% of transactions (120 of 2,000) flag above the 0.70 anomaly threshold — concentrated on transfers to four newly-onboarded entities sharing a single registration address. A ₹4.8 L GST mismatch and a Hindi disclosure introducing 'अप्रकाशित ऋण' point toward unreported related-party exposure. Recommended action: targeted review before Q4 close.",
    explainer: {
      headline: "Something has changed — a quiet warning.",
      paragraph:
        "After two perfectly clean quarters, Q3 FY24 is the first time fraud signals appear. The numbers are still small — only 6% of transactions are flagged — but the pattern matters more than the magnitude: four brand-new vendors, all sharing the same East-Delhi registration address, are receiving 60 transfers totalling ₹38.4 L. That, combined with a ₹4.8 L GST gap and a Hindi disclosure that introduces the phrase 'unreported loans', is the early shape of a layered fraud scheme.",
      whyGood: [
        "94% of transactions (1,880 of 2,000) still look completely normal.",
        "Banking and customer flows match Q1 / Q2 baselines exactly.",
        "Most XBRL tags continue to validate cleanly.",
      ],
      whyConcerning: [
        "120 transactions to 4 newly-onboarded entities sharing one PAN-registration address — a classic shell-pattern signature.",
        "₹4.8 L cumulative GST mismatch on TaxLiability and TradePayables tags.",
        "IndicBERT picks up 'अप्रकाशित ऋण' (unreported loans) for the first time.",
        "Debt ratio rising 1.28 → 1.6 QoQ — VAE marks it 1.2σ off the firm's own baseline.",
      ],
      bottomLine:
        "Manual review recommended before Q4 close. Run MCA / FIU-IND lookups on the four new entities and reconcile the GST gap.",
    },
  },
  {
    id: "sample4",
    fileName: "sample4.csv",
    company: COMPANY,
    quarter: "Q4",
    fiscalYear: "FY 2024",
    reportDate: "31 Mar 2024",
    verdict: "ESCALATE",
    fraudScore: 0.24,
    scores: { gnn: 0.55, vae: 0.46, indicBert: 0.59, ml: 0.42 },
    stats: {
      totalTxns: 2000,
      fraudTxns: 240,
      fraudPct: 12,
      shellTxns: 120,
      gstMismatches: 86,
      avgScore: 0.24,
    },
    compliance: { sebiXbrl: true, gst: true, indAs: "REVIEW REQUIRED" },
    features: {
      debtRatio: 2.0,
      profitMarginQoQ: "+12.4%",
      languages: ["Hindi", "English", "Bengali"],
      pages: 53,
      xbrlTags: 321,
    },
    findings: [
      {
        severity: "HIGH",
        text: "120 transactions to 8 shell entities (up from 4 in Q3) — fan-out doubling",
        detail: "5 of 8 shells trace to the same PAN registration cluster",
      },
      {
        severity: "HIGH",
        text: "GNN circular subgraph detected: Firm → 3 Shell Cos → Firm (₹5,00,000 / cycle)",
        detail: "3 distinct closed cycles, each settling within 14 days",
      },
      {
        severity: "HIGH",
        text: "86 GST mismatches — cumulative gap ₹12,80,000 (2.7× Q3)",
        detail: "GSTR-1 outward supplies overstated vs e-way bill volumes",
      },
      {
        severity: "HIGH",
        text: "VAE flags 14 days of late-night transfers (after 23:00 IST)",
        detail: "Reconstruction error 0.078 — outside 99% confidence band",
      },
      {
        severity: "MEDIUM",
        text: 'Bengali disclosure inconsistent with balance sheet — "ঋণ" (loan) variance',
        detail: "Disclosed loan obligation ≠ Borrowings tag value (delta ₹38,40,000)",
      },
      {
        severity: "MEDIUM",
        text: "23 new vendors onboarded — no MCA history > 6 months",
        detail: "Spike vs Q3 baseline of 7; 9 share single email domain",
      },
    ],
    recommendations: [
      { text: "Freeze intercompany transfers pending forensic audit.", icon: "shield" },
      { text: "File a Suspicious Activity Report (SAR) with FIU-IND within 7 days.", icon: "alert" },
      { text: "Cross-check the 8 shell entities against MCA struck-off registry.", icon: "search" },
      { text: "Engage external auditor for Ind AS 24 related-party review.", icon: "scale" },
    ],
    narrative:
      "Q4 FY 2024 escalates sharply: fraud transaction rate doubles to 12%, shell-entity fan-out grows 4 → 8, and the GNN surfaces three closed payment cycles each settling ₹5 L in under two weeks. Cumulative GST mismatch reaches ₹12.8 L, late-night transfer anomalies appear for 14 days, and a Bengali disclosure shows loan-balance inconsistency. The pattern matches a layered round-tripping scheme. Immediate FIU-IND escalation is recommended.",
    explainer: {
      headline: "The pattern is clear — escalate now.",
      paragraph:
        "What was a quiet warning in Q3 is no longer ambiguous. The fraud transaction rate has doubled to 12%, the shell-entity count has doubled (4 → 8), and the model has detected three closed payment cycles — money leaving Apex Retail, hopping through a shell company, and returning within 14 days. This is the textbook shape of round-tripping. The GST gap, late-night transfer windows, and Bengali disclosure inconsistency all point in the same direction.",
      whyGood: [
        "88% of transactions (1,760 of 2,000) still look like ordinary business.",
        "The bank line and main customer relationships are unchanged from baseline.",
        "SEBI XBRL schema still validates structurally — fraud is hidden inside otherwise well-formed tags.",
      ],
      whyConcerning: [
        "240 fraud transactions (12% of the quarter, 2× Q3).",
        "8 shell entities, 5 of them tracing to the same registration cluster.",
        "Three closed Firm → Shell → Firm payment cycles, each settling ~₹5 L.",
        "₹12.8 L cumulative GST mismatch — 2.7× Q3.",
        "VAE flags 14 consecutive days of after-23:00 IST transfer activity.",
        "Bengali disclosure shows ₹38.4 L loan-balance vs. Borrowings tag mismatch.",
        "23 newly onboarded vendors with no MCA history — 9 share one email domain.",
      ],
      bottomLine:
        "Escalate. File a SAR with FIU-IND within 7 days, freeze intercompany transfers, and engage an external auditor for an Ind AS 24 review.",
    },
  },
  {
    id: "sample5",
    fileName: "sample5.csv",
    company: COMPANY,
    quarter: "Q1",
    fiscalYear: "FY 2025",
    reportDate: "30 Jun 2024",
    verdict: "ESCALATE",
    fraudScore: 0.27,
    scores: { gnn: 0.71, vae: 0.62, indicBert: 0.73, ml: 0.58 },
    stats: {
      totalTxns: 2000,
      fraudTxns: 360,
      fraudPct: 18,
      shellTxns: 180,
      gstMismatches: 164,
      avgScore: 0.27,
    },
    compliance: { sebiXbrl: true, gst: true, indAs: "REVIEW REQUIRED" },
    features: {
      debtRatio: 2.4,
      profitMarginQoQ: "+28.1%",
      languages: ["Hindi", "Bengali", "Tamil", "English"],
      pages: 62,
      xbrlTags: 342,
    },
    findings: [
      {
        severity: "HIGH",
        text: "180 transactions to 14 shell entities — fan-out indicates loan stacking",
        detail: "Star topology centered on 2 vendor hubs feeding 14 leaves",
      },
      {
        severity: "HIGH",
        text: "6 distinct circular payment rings detected (vs 3 in Q4)",
        detail: "Ring length ranges 3–5 hops; cumulative cycle volume ₹42,80,000",
      },
      {
        severity: "HIGH",
        text: "164 GST mismatches — cumulative gap ₹2,10,40,000",
        detail: "TaxLiability vs GSTR-3B reconciliation broken on 8.2% of filings",
      },
      {
        severity: "HIGH",
        text: "Revenue Δ QoQ +28.1% — VAE z-score 4.1σ on PnL manifold",
        detail: "Reconstruction error 0.124 — far outside 99.9% confidence band",
      },
      {
        severity: "HIGH",
        text: 'Tamil disclosure: "kaDan" (கடன்) misclassified initially — post fine-tune LOAN_RISK 0.91',
        detail: "Domain-adapted IndicBERT improved confidence 0.41 → 0.91",
      },
      {
        severity: "MEDIUM",
        text: "31% of new vendors share a single PAN registration address",
        detail: "57 of 184 onboarded vendors map to the same East Delhi premises",
      },
      {
        severity: "MEDIUM",
        text: "42 undisclosed related-party transactions — Ind AS 24 violation",
        detail: "Cumulative undisclosed exposure ₹1,84,20,000",
      },
    ],
    recommendations: [
      { text: "Immediate SAR escalation to FIU-IND — within 24 hours.", icon: "alert" },
      { text: "Initiate forensic audit per Companies Act §143(12).", icon: "search" },
      { text: "Freeze all new vendor onboarding until audit closes.", icon: "shield" },
      { text: "SEBI NBFC liability and listed-entity disclosure review.", icon: "scale" },
      { text: "Re-examine multilingual disclosures with certified auditor.", icon: "users" },
    ],
    narrative:
      "Q1 FY 2025 is the peak: fraud transaction rate climbs to 18%, shell-entity count grows to 14, six distinct circular payment rings emerge, and the cumulative GST mismatch reaches ₹2.1 Cr. A 28% QoQ revenue spike sits at 4.1σ on the VAE manifold — anomalous beyond doubt. A Tamil-language loan-risk phrase, masked in raw IndicBERT, surfaces clearly after domain fine-tuning. The full evidence stack — graph, numerical and textual — supports immediate FIU-IND escalation and a forensic audit under Companies Act §143(12).",
    explainer: {
      headline: "Systematic round-tripping. Escalate immediately.",
      paragraph:
        "Q1 FY25 is the peak of the escalation. 18% of all transactions are fraudulent, the shell-entity count has reached 14, and the GNN has detected six distinct circular payment rings. The numerical model places the revenue spike at 4.1σ off the firm's own baseline — statistically impossible without orchestrated activity — and a Tamil-language loan-risk phrase, hidden behind a misclassification in the base model, surfaces clearly once fine-tuned. Graph, numerical, and textual evidence all converge on the same conclusion.",
      whyGood: [
        "82% of transactions (1,640 of 2,000) still represent normal commerce.",
        "Bank financing line is unchanged — no obvious external funding stress.",
        "SEBI XBRL filings remain structurally well-formed — schema not abused.",
      ],
      whyConcerning: [
        "360 fraud transactions (18% of the quarter, 3× Q3).",
        "14 shell entities — 31% of new vendors share a single registration address.",
        "6 distinct closed payment rings, cumulative cycle volume ₹42.8 L.",
        "₹2.1 Cr cumulative GST gap — TaxLiability vs GSTR-3B broken on 8.2% of filings.",
        "Revenue spike of +28.1% QoQ → VAE z-score 4.1σ (essentially impossible by chance).",
        "Tamil 'kaDan' (கடன் — loan) disclosure, hidden in the base IndicBERT, surfaces at 0.91 risk after domain fine-tuning.",
        "42 undisclosed related-party transactions — direct Ind AS 24 violation.",
      ],
      bottomLine:
        "Escalate to FIU-IND within 24 hours. Initiate a forensic audit under Companies Act §143(12), freeze new vendor onboarding, and trigger an SEBI listed-entity disclosure review.",
    },
  },
];

export function getReport(id: string): FraudReport | undefined {
  return REPORTS.find((r) => r.id === id);
}

/** Cross-quarter trend rows for the result-page summary chart. */
export const QUARTER_TREND = REPORTS.map((r) => ({
  id: r.id,
  label: `${r.quarter} ${r.fiscalYear.replace("FY ", "FY")}`,
  fraudPct: r.stats.fraudPct,
  shellTxns: r.stats.shellTxns,
  gstMismatches: r.stats.gstMismatches,
  avgScore: r.stats.avgScore,
  verdict: r.verdict,
}));
