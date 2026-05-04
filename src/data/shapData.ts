export interface ShapFeature {
  feature: string;
  impact: number;
  category: "high" | "medium" | "low";
  description: string;
}

/**
 * SHAP-style feature rows per report id (distinct profile per filing in the demo).
 */
export const SHAP_BY_REPORT_ID: Record<string, ShapFeature[]> = {
  sample1: [
    {
      feature: "Revenue variance vs Ind AS band",
      impact: 0.12,
      category: "medium",
      description: "Q1 opening quarter — mild YoY noise, within materiality.",
    },
    {
      feature: "GSTR-1 / 2A / 3B tie-out",
      impact: 0.1,
      category: "medium",
      description: "Perfect reconciliation; low residual anomaly.",
    },
    {
      feature: "IndicBERT · Hindi MD&A",
      impact: 0.09,
      category: "low",
      description: "Narrative matches published numbers; no loan-risk lexemes.",
    },
    {
      feature: "Graph · two-anchor procurement hub",
      impact: 0.08,
      category: "low",
      description: "Tight hub-and-spoke; no lateral payment rails.",
    },
    {
      feature: "Trade Payables · XBRL",
      impact: 0.07,
      category: "low",
      description: "Immaterial rounding vs trial balance.",
    },
    {
      feature: "Inventory / COGS coherence",
      impact: 0.06,
      category: "low",
      description: "Stock-led quarter; VAE manifold distance small.",
    },
    {
      feature: "Vendor concentration (known distributors)",
      impact: 0.06,
      category: "low",
      description: "High share but stable KYC history.",
    },
    {
      feature: "Statutory filing latency",
      impact: 0.04,
      category: "low",
      description: "GST & MCA filed inside tolerance windows.",
    },
  ],
  sample2: [
    {
      feature: "B2B credit-note velocity",
      impact: 0.11,
      category: "medium",
      description: "Festival returns; all notes matched in GSTR-2A within 48h.",
    },
    {
      feature: "New logistics GSTIN (30-day age)",
      impact: 0.1,
      category: "medium",
      description: "Single freight corridor; passes MCA + PAN screen.",
    },
    {
      feature: "Festival SKU revenue mix",
      impact: 0.09,
      category: "low",
      description: "+2.4% QoQ uplift; VAE treats as healthy seasonal drift.",
    },
    {
      feature: "Receivables vs GSTR-1 outward",
      impact: 0.08,
      category: "low",
      description: "Higher A/R explained by return timing; not a mismatch flag.",
    },
    {
      feature: "WIP / capex XBRL facts (+14 tags)",
      impact: 0.08,
      category: "low",
      description: "Showroom fit-out capitalization walk is documented.",
    },
    {
      feature: "Punjabi footnote · numerical tie-out",
      impact: 0.07,
      category: "low",
      description: "Subsidiary text expands without contradicting ledger.",
    },
    {
      feature: "Graph · third vendor spoke (acyclic)",
      impact: 0.06,
      category: "low",
      description: "Extra edge; no closed cycles detected.",
    },
    {
      feature: "XBRL tag delta vs Q1",
      impact: 0.05,
      category: "low",
      description: "More facts, not errors — explains higher page count.",
    },
  ],
  sample3: [
    {
      feature: "Shell-entity edge fan-in",
      impact: 0.28,
      category: "high",
      description: "Four new entities, shared registration cluster — GNN signal.",
    },
    {
      feature: "GST mismatch · TaxLiability",
      impact: 0.24,
      category: "high",
      description: "₹4.8 L cumulative gap vs GSTR-3B.",
    },
    {
      feature: 'Text · Hindi "अप्रकाशित ऋण"',
      impact: 0.21,
      category: "high",
      description: "IndicBERT picks up unreported-loan phrasing first time this FY.",
    },
    {
      feature: "Debt ratio Δ QoQ",
      impact: 0.18,
      category: "medium",
      description: "1.28 → 1.6; VAE flags as elevated vs firm baseline.",
    },
    {
      feature: "New vendor cluster (shared address)",
      impact: 0.16,
      category: "medium",
      description: "60 transfers to thin-file counterparties.",
    },
    {
      feature: "Graph · four new lateral spokes",
      impact: 0.14,
      category: "medium",
      description: "Topology departs from Q1–Q2 fingerprint.",
    },
    {
      feature: "Trade Payables velocity",
      impact: 0.1,
      category: "medium",
      description: "Stretches vs historical seasonal curve.",
    },
    {
      feature: "Late-night transfer window",
      impact: 0.08,
      category: "low",
      description: "Emerging after-hours RTGS pattern.",
    },
  ],
  sample4: [
    {
      feature: "Closed circular payment cycles (GNN)",
      impact: 0.33,
      category: "high",
      description: "Three Firm → Shell → Firm rings, ~₹5 L each.",
    },
    {
      feature: "Shell transfer volume",
      impact: 0.29,
      category: "high",
      description: "120 flagged transactions; 8 shell nodes.",
    },
    {
      feature: "GST cumulative gap",
      impact: 0.25,
      category: "high",
      description: "₹12.8 L unresolved across TradePayables & TaxLiability.",
    },
    {
      feature: "Bengali disclosure vs Borrowings tag",
      impact: 0.22,
      category: "high",
      description: "Loan balance language inconsistent with XBRL fact table.",
    },
    {
      feature: "Debt ratio trajectory",
      impact: 0.19,
      category: "medium",
      description: "Leverage stack crosses internal policy band.",
    },
    {
      feature: "Intercompany round-trip timing (<14d)",
      impact: 0.17,
      category: "medium",
      description: "Settlement cadence typical of round-tripping.",
    },
    {
      feature: "New vendor email-domain cluster",
      impact: 0.13,
      category: "medium",
      description: "23 vendors; 9 share registrant email.",
    },
    {
      feature: "XBRL Borrowings vs bank statements",
      impact: 0.11,
      category: "medium",
      description: "Footnote omits drawdown visible in feeds.",
    },
  ],
  sample5: [
    {
      feature: "Revenue spike z-score (β-VAE)",
      impact: 0.35,
      category: "high",
      description: "+28% QoQ → 4.1σ off firm-specific manifold.",
    },
    {
      feature: "Six closed GNN rings",
      impact: 0.32,
      category: "high",
      description: "Distinct circular payment circuits; ₹42.8 L cycle volume.",
    },
    {
      feature: "Shell-entity count (14)",
      impact: 0.3,
      category: "high",
      description: "31% of new vendors trace to one registration cluster.",
    },
    {
      feature: "GST · ₹2.1 Cr TaxLiability gap",
      impact: 0.27,
      category: "high",
      description: "GSTR-3B vs ledger on 8.2% of lines.",
    },
    {
      feature: "Tamil · loan risk (IndicBERT fine-tuned)",
      impact: 0.24,
      category: "high",
      description: "கடன் / contingent phrasing surfaces at 0.91 textual risk.",
    },
    {
      feature: "Undisclosed related-party legs",
      impact: 0.2,
      category: "medium",
      description: "42 legs missing Ind AS 24 cross-links.",
    },
    {
      feature: "After-midnight RTGS burst",
      impact: 0.15,
      category: "medium",
      description: "14-day streak of post-23:00 IST settlements.",
    },
    {
      feature: "TradeReceivables vs GSTR-1",
      impact: 0.12,
      category: "medium",
      description: "A/R build not explained by filed outward supplies.",
    },
  ],
};

export function getShapFeaturesForReport(reportId: string): ShapFeature[] {
  return SHAP_BY_REPORT_ID[reportId] ?? SHAP_BY_REPORT_ID.sample1;
}
