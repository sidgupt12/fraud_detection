export type LogLevel = "info" | "ok" | "warn" | "bad";

export interface LogTemplate {
  level: LogLevel;
  template: string;
}

/**
 * Pool of log lines used by the live activity feed on the dashboard.
 * Tokens like {AMOUNT}, {SCORE}, {LANG}, {TAG} are randomized at render time.
 */
export const LOG_TEMPLATES: LogTemplate[] = [
  { level: "info", template: "Parsed XBRL tag: {TAG} → {AMOUNT}" },
  { level: "ok", template: "GST reconciliation check: PASSED ({TAG})" },
  { level: "warn", template: "GST mismatch detected on {TAG}: delta {AMOUNT}" },
  { level: "info", template: "GNN edge anomaly score: {SCORE} (safe)" },
  { level: "warn", template: "GNN edge anomaly score: {SCORE} (suspicious)" },
  { level: "info", template: "IndicBERT: {LANG} disclosure — no risk keywords" },
  { level: "bad", template: 'IndicBERT: {LANG} risk phrase "{KEYWORD}" — score {SCORE}' },
  { level: "info", template: "VAE reconstruction error: {SCORE} (normal)" },
  { level: "warn", template: "VAE reconstruction error: {SCORE} (elevated)" },
  { level: "ok", template: "Federated round {ROUND}/7 — gradients aggregated" },
  { level: "info", template: "MinMax scaling 20 numerical features for {FIRM}" },
  { level: "info", template: "Llama-3 narrative draft: {WORDS} words ({MS} ms)" },
  { level: "ok", template: "SEBI XBRL schema v2024 validated for {FIRM}" },
  { level: "info", template: "Edge pruned: weight {SCORE} below threshold (0.05)" },
  { level: "warn", template: "Ind AS 24 review trigger — related-party {AMOUNT}" },
  { level: "ok", template: "Report finalized: {FIRM} score {SCORE}" },
];

export const FIRMS = [
  "Apex Retail",
  "Madurai Cotton",
  "Trilytics IT",
  "BengalEx",
  "Vasundhara Pharma",
  "Coastal Logistics",
  "Saraswati Foods",
  "Konark Steels",
];

export const TAGS = [
  "RevenueFromOperations",
  "Borrowings",
  "TradePayables",
  "TaxLiability",
  "RelatedPartyTransactions",
  "InventoryValue",
  "FinanceCostsTotal",
];

export const LANGS = ["Hindi", "Tamil", "Bengali", "Telugu", "Marathi", "English"];

export const KEYWORDS = [
  "unreported",
  "contingent",
  "अप्रकाशित ऋण",
  "kaDan",
  "ঋণ",
  "deferred payable",
  "off-balance",
];

export const AMOUNTS = [
  "₹1,20,000",
  "₹2,34,50,000",
  "₹4,80,000",
  "₹18,40,000",
  "₹3,50,000",
  "₹12,00,000",
  "₹5,00,000",
  "₹38,40,000",
];

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function rscore(): string {
  return Math.random().toFixed(3);
}

export function renderLogTemplate(t: LogTemplate): string {
  return t.template
    .replace("{AMOUNT}", pick(AMOUNTS))
    .replace("{SCORE}", rscore())
    .replace("{LANG}", pick(LANGS))
    .replace("{TAG}", pick(TAGS))
    .replace("{KEYWORD}", pick(KEYWORDS))
    .replace("{ROUND}", String(1 + Math.floor(Math.random() * 7)))
    .replace("{FIRM}", pick(FIRMS))
    .replace("{WORDS}", String(120 + Math.floor(Math.random() * 200)))
    .replace("{MS}", String(220 + Math.floor(Math.random() * 600)));
}
