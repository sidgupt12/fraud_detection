import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Banknote,
  Brain,
  Calendar,
  CircuitBoard,
  Fingerprint,
  Languages,
  Network,
  ScrollText,
  Users,
} from "lucide-react";

export interface SchemaField {
  name: string;
  type: "id" | "text" | "number" | "boolean" | "enum" | "date" | "currency";
  hint?: string;
}

export interface SchemaGroup {
  id: string;
  name: string;
  count: number;
  module:
    | "Identifiers"
    | "Date/Time"
    | "Counterparty"
    | "Transaction"
    | "Regulatory"
    | "IndicBERT"
    | "GNN"
    | "VAE"
    | "ML Baseline"
    | "Final Score";
  icon: LucideIcon;
  /** Tailwind-safe accent class for the group header. */
  accent: "cyan" | "amber" | "emerald" | "violet" | "cream" | "rose";
  fields: SchemaField[];
}

export const SCHEMA_GROUPS: SchemaGroup[] = [
  {
    id: "identifiers",
    name: "Identifiers",
    count: 7,
    module: "Identifiers",
    icon: Fingerprint,
    accent: "cream",
    fields: [
      { name: "transaction_id", type: "id", hint: "Primary key" },
      { name: "firm_name", type: "text" },
      { name: "firm_cin", type: "id", hint: "Corporate Identity Number" },
      { name: "firm_pan", type: "id" },
      { name: "firm_gstin", type: "id" },
      { name: "reporting_quarter", type: "enum", hint: "Q1 FY24 … Q1 FY25" },
      { name: "report_batch", type: "id" },
    ],
  },
  {
    id: "datetime",
    name: "Date & Time",
    count: 5,
    module: "Date/Time",
    icon: Calendar,
    accent: "cream",
    fields: [
      { name: "transaction_date", type: "date" },
      { name: "value_date", type: "date" },
      { name: "fiscal_month", type: "enum" },
      { name: "day_of_week", type: "enum" },
      { name: "is_weekend", type: "boolean" },
    ],
  },
  {
    id: "counterparty",
    name: "Counterparty",
    count: 9,
    module: "Counterparty",
    icon: Users,
    accent: "cyan",
    fields: [
      { name: "counterparty_name", type: "text" },
      { name: "counterparty_type", type: "enum", hint: "Shell · Vendor · Related Party · …" },
      { name: "pan", type: "id" },
      { name: "gstin", type: "id" },
      { name: "bank", type: "text" },
      { name: "ifsc", type: "id" },
      { name: "account", type: "id" },
      { name: "city", type: "text" },
      { name: "state", type: "text" },
    ],
  },
  {
    id: "transaction",
    name: "Transaction",
    count: 14,
    module: "Transaction",
    icon: Banknote,
    accent: "cyan",
    fields: [
      { name: "transaction_type", type: "enum" },
      { name: "payment_mode", type: "enum", hint: "NEFT · RTGS · UPI · IMPS · …" },
      { name: "debit_credit", type: "enum" },
      { name: "amount_inr", type: "currency" },
      { name: "gst_rate_pct", type: "number" },
      { name: "gst_declared_inr", type: "currency" },
      { name: "gst_actual_inr", type: "currency" },
      { name: "gst_mismatch_inr", type: "currency" },
      { name: "gst_status", type: "enum", hint: "OK · MISMATCH · MISSING" },
      { name: "tds_deducted_inr", type: "currency" },
      { name: "net_amount_inr", type: "currency" },
      { name: "invoice_number", type: "id" },
      { name: "invoice_date", type: "date" },
      { name: "goods_receipt_note", type: "id" },
    ],
  },
  {
    id: "regulatory",
    name: "XBRL / Regulatory",
    count: 8,
    module: "Regulatory",
    icon: ScrollText,
    accent: "amber",
    fields: [
      { name: "xbrl_tag", type: "enum", hint: "RevenueFromOperations · Borrowings · …" },
      { name: "xbrl_value_inr", type: "currency" },
      { name: "xbrl_variance_inr", type: "currency" },
      { name: "xbrl_status", type: "enum" },
      { name: "sebi_flag", type: "boolean" },
      { name: "gstr1_filed", type: "boolean" },
      { name: "gstr3b_filed", type: "boolean" },
      { name: "ind_as_section", type: "enum", hint: "18 · 24 · 109 · …" },
    ],
  },
  {
    id: "indicbert",
    name: "IndicBERT / Textual",
    count: 5,
    module: "IndicBERT",
    icon: Languages,
    accent: "amber",
    fields: [
      { name: "disclosure_language", type: "enum" },
      { name: "textual_disclosure", type: "text", hint: "Raw Hindi / English / Tamil / Bengali" },
      { name: "risk_keywords_detected", type: "text" },
      { name: "indicbert_risk_score", type: "number", hint: "0..1" },
      { name: "indicbert_classification", type: "enum" },
    ],
  },
  {
    id: "gnn",
    name: "GNN / Graph",
    count: 7,
    module: "GNN",
    icon: Network,
    accent: "cyan",
    fields: [
      { name: "is_shell_entity", type: "boolean" },
      { name: "is_related_party", type: "boolean" },
      { name: "circular_payment_flag", type: "boolean" },
      { name: "graph_node_id", type: "id" },
      { name: "graph_edge_weight", type: "number" },
      { name: "gnn_anomaly_score", type: "number", hint: "0..1" },
      { name: "is_intercompany", type: "boolean" },
    ],
  },
  {
    id: "vae",
    name: "VAE / Numerical",
    count: 5,
    module: "VAE",
    icon: Activity,
    accent: "emerald",
    fields: [
      { name: "profit_margin_pct", type: "number" },
      { name: "debt_ratio", type: "number" },
      { name: "revenue_deviation_pct", type: "number" },
      { name: "vae_reconstruction_error", type: "number" },
      { name: "vae_anomaly_flag", type: "boolean" },
    ],
  },
  {
    id: "mlbase",
    name: "ML Baseline",
    count: 6,
    module: "ML Baseline",
    icon: CircuitBoard,
    accent: "violet",
    fields: [
      { name: "transaction_frequency_30d", type: "number" },
      { name: "amount_zscore", type: "number" },
      { name: "late_night_flag", type: "boolean" },
      { name: "round_amount_flag", type: "boolean" },
      { name: "new_vendor_flag", type: "boolean" },
      { name: "xgboost_risk_score", type: "number", hint: "0..1" },
    ],
  },
  {
    id: "final",
    name: "Final Scores",
    count: 5,
    module: "Final Score",
    icon: Brain,
    accent: "rose",
    fields: [
      { name: "fraud_label", type: "enum", hint: "CLEAR · REVIEW · ESCALATE" },
      { name: "fraud_confidence", type: "number" },
      { name: "anomaly_type", type: "enum" },
      { name: "weighted_fraud_score", type: "number" },
      { name: "audit_recommendation", type: "text" },
    ],
  },
];

export const TOTAL_FIELDS = SCHEMA_GROUPS.reduce((s, g) => s + g.count, 0);
