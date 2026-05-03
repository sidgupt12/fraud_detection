export interface ShapFeature {
  feature: string;
  impact: number;
  category: "high" | "medium" | "low";
  description: string;
}

export const SHAP_FEATURES: ShapFeature[] = [
  {
    feature: "Fund Transfers",
    impact: 0.31,
    category: "high",
    description:
      "Volume and topology of intercompany fund transfers (GNN edge feature).",
  },
  {
    feature: 'Text: "unreported loans"',
    impact: 0.28,
    category: "high",
    description:
      "IndicBERT token-level evidence of unreported / contingent liabilities in disclosure.",
  },
  {
    feature: "Debt Ratio",
    impact: 0.22,
    category: "high",
    description: "Total liabilities / equity ratio normalized to sector decile.",
  },
  {
    feature: "Profit Margin",
    impact: 0.19,
    category: "medium",
    description: "Quarter-over-quarter profit-margin deviation, flagged by β-VAE.",
  },
  {
    feature: "GST Mismatch",
    impact: 0.14,
    category: "medium",
    description:
      "GSTR-2A vs GSTR-3B reconciliation gap on TaxLiability XBRL tag.",
  },
  {
    feature: "Trade Payables",
    impact: 0.11,
    category: "medium",
    description:
      "TradePayables tag inconsistency vs GSTR-1 outward supplies.",
  },
  {
    feature: "Revenue Variance",
    impact: 0.09,
    category: "low",
    description: "Quarterly revenue variance vs Ind AS 18 expected band.",
  },
  {
    feature: "Late Filing",
    impact: 0.06,
    category: "low",
    description: "Days delayed past statutory GST/MCA deadline.",
  },
];
