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
    fraudScore: 0.18,
    scores: { gnn: 0.12, vae: 0.18, indicBert: 0.21, ml: 0.16 },
    stats: {
      totalTxns: 2000,
      fraudTxns: 0,
      fraudPct: 0,
      shellTxns: 0,
      gstMismatches: 0,
      avgScore: 0.18,
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
        text: "Baseline filing — all 2,000 transactions clear, no anomalies detected",
        detail: "Per-transaction anomaly scores all below 0.50 threshold",
      },
      {
        severity: "INFO",
        text: "100% GSTR-1 / 2A / 3B reconciliation — zero credit mismatch",
        detail: "All 1,742 GST-applicable transactions tied out cleanly",
      },
      {
        severity: "LOW",
        text: "Routine variance in 12 XBRL tags — within Ind AS materiality tolerance",
        detail: "Mean variance 0.4% on TradePayables, RevenueFromOperations",
      },
      {
        severity: "INFO",
        text: "IndicBERT: Hindi disclosure — no risk keywords detected",
        detail: "Mean classification confidence 0.93",
      },
    ],
    recommendations: [
      { text: "Maintain current compliance posture — no action required.", icon: "check" },
      { text: "Continue federated audit participation for benchmark contribution.", icon: "users" },
    ],
    narrative:
      "Q1 FY 2024 is a clean baseline: 2,000 transactions, zero fraud signals, full statutory reconciliation, and Hindi disclosures pass IndicBERT with 0.93 confidence. The cohort-average anomaly score of 0.18 is well below the 0.20 review threshold. No further action is required.",
    explainer: {
      headline: "This quarter looks healthy.",
      paragraph:
        "Apex Retail's Q1 FY24 filing passed every check the system runs. All 2,000 transactions reconciled cleanly, no shell entities turned up in the transaction graph, and the Hindi-language disclosures matched the balance sheet exactly. The composite anomaly score of 0.18 is comfortably below the 0.20 review threshold.",
      whyGood: [
        "Zero fraud transactions out of 2,000 (0%).",
        "GSTR-1 / 2A / 3B reconciled to the rupee — no mismatches.",
        "Transaction graph is a textbook hub-and-spoke — no shell entities, no circular payments.",
        "All 287 SEBI XBRL tags validate against the v2024 schema.",
        "Hindi disclosures classified as benign with 0.93 IndicBERT confidence.",
      ],
      whyConcerning: [],
      bottomLine:
        "No action required. Maintain the existing quarterly audit cadence.",
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
    fraudScore: 0.18,
    scores: { gnn: 0.13, vae: 0.19, indicBert: 0.2, ml: 0.16 },
    stats: {
      totalTxns: 2000,
      fraudTxns: 0,
      fraudPct: 0,
      shellTxns: 0,
      gstMismatches: 0,
      avgScore: 0.18,
    },
    compliance: { sebiXbrl: true, gst: true, indAs: "REVIEWED" },
    features: {
      debtRatio: 1.3,
      profitMarginQoQ: "+2.4%",
      languages: ["Hindi", "English"],
      pages: 41,
      xbrlTags: 294,
    },
    findings: [
      {
        severity: "INFO",
        text: "Second clean quarter — fraud signal flat at 0%",
        detail: "Quarter-over-quarter delta vs Q1 FY24: ±0.0% on every model",
      },
      {
        severity: "LOW",
        text: "Seasonal revenue uplift +2.4% QoQ — within Ind AS 18 tolerance",
        detail: "VAE reconstruction error 0.029 (well below 0.06 threshold)",
      },
      {
        severity: "INFO",
        text: "All 1,803 GST-applicable transactions reconciled",
        detail: "GSTR-1 vs 3B delta ₹0; GSTR-2A vs 3B delta ₹0",
      },
    ],
    recommendations: [
      { text: "Maintain current compliance posture.", icon: "check" },
      { text: "Continue routine quarterly audit cadence.", icon: "file" },
    ],
    narrative:
      "Q2 FY 2024 mirrors Q1 — a stable, fraud-free quarter with healthy 2.4% QoQ revenue growth and full GST reconciliation. The model ensemble produces an average anomaly score of 0.18, identical to the prior quarter, indicating consistent operational behaviour.",
    explainer: {
      headline: "Another healthy quarter.",
      paragraph:
        "Q2 FY24 looks just like Q1 — zero fraud signals, modest 2.4% QoQ revenue growth, and full GST reconciliation. Two consecutive clean quarters establish a strong baseline of normal behaviour for the firm; this is the pattern the model uses to spot deviations later.",
      whyGood: [
        "Zero fraud transactions for the second quarter in a row.",
        "Revenue growth of 2.4% sits well within the Ind AS 18 expected band.",
        "All 1,803 GST-applicable transactions reconciled — zero rupee gap.",
        "Same hub-and-spoke topology as Q1 — no new vendors flagged.",
        "Per-model scores effectively unchanged from Q1, indicating stable operations.",
      ],
      whyConcerning: [],
      bottomLine:
        "No action required. Two clean quarters establish a strong baseline.",
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
        text: "Debt ratio rising — 1.3 → 1.6 QoQ (still below 2.0 trigger)",
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
        "Debt ratio rising 1.3 → 1.6 QoQ — VAE marks it 1.2σ off the firm's own baseline.",
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
