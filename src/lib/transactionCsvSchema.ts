/**
 * Expected header row for quarterly transaction CSV exports (71 columns).
 * Matches the audit / sample bundle schema (e.g. sample5.csv).
 */
export const TRANSACTION_CSV_COLUMNS = [
  "transaction_id",
  "firm_name",
  "firm_cin",
  "firm_pan",
  "firm_gstin",
  "reporting_quarter",
  "report_batch",
  "transaction_date",
  "value_date",
  "fiscal_month",
  "day_of_week",
  "is_weekend",
  "counterparty_name",
  "counterparty_type",
  "counterparty_pan",
  "counterparty_gstin",
  "counterparty_bank",
  "counterparty_ifsc",
  "counterparty_account",
  "counterparty_city",
  "counterparty_state",
  "transaction_type",
  "payment_mode",
  "debit_credit",
  "amount_inr",
  "gst_rate_pct",
  "gst_declared_inr",
  "gst_actual_inr",
  "gst_mismatch_inr",
  "gst_status",
  "tds_deducted_inr",
  "net_amount_inr",
  "invoice_number",
  "invoice_date",
  "goods_receipt_note",
  "xbrl_tag",
  "xbrl_value_inr",
  "xbrl_variance_inr",
  "xbrl_status",
  "sebi_flag",
  "gstr1_filed",
  "gstr3b_filed",
  "ind_as_section",
  "disclosure_language",
  "textual_disclosure",
  "risk_keywords_detected",
  "indicbert_risk_score",
  "indicbert_classification",
  "is_intercompany",
  "is_related_party",
  "is_shell_entity",
  "circular_payment_flag",
  "graph_node_id",
  "graph_edge_weight",
  "gnn_anomaly_score",
  "profit_margin_pct",
  "debt_ratio",
  "revenue_deviation_pct",
  "vae_reconstruction_error",
  "vae_anomaly_flag",
  "transaction_frequency_30d",
  "amount_zscore",
  "late_night_flag",
  "round_amount_flag",
  "new_vendor_flag",
  "xgboost_risk_score",
  "fraud_label",
  "fraud_confidence",
  "anomaly_type",
  "weighted_fraud_score",
  "audit_recommendation",
] as const;

export type TransactionCsvColumn = (typeof TRANSACTION_CSV_COLUMNS)[number];

export function transactionCsvTemplateBlob(): Blob {
  const header = TRANSACTION_CSV_COLUMNS.join(",") + "\n";
  return new Blob([header], { type: "text/csv;charset=utf-8" });
}

/** First line of CSV only; trims BOM; does not parse quoted commas in headers (schema names have none). */
export function parseCsvHeaderRow(prefix: string): string[] {
  const normalized = prefix.replace(/^\uFEFF/, "");
  const line =
    normalized.split(/\r?\n/, 1)[0]?.trim().replace(/\r$/, "") ?? "";
  if (!line) return [];
  return line.split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
}

export function validateTransactionCsvHeaders(
  headers: string[],
): { ok: true } | { ok: false; missing: string[] } {
  const set = new Set(headers);
  const missing = TRANSACTION_CSV_COLUMNS.filter((c) => !set.has(c));
  if (missing.length > 0) return { ok: false, missing };
  return { ok: true };
}

/** CSV-only uploads: trust the `.csv` extension so odd browser MIME types still work. */
export function isCsvFile(file: File): boolean {
  return file.name.toLowerCase().endsWith(".csv");
}
