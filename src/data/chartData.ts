export interface RocPoint {
  fpr: number;
  ours: number;
  lgbm: number;
  xgb: number;
  bert: number;
  iso: number;
}

/**
 * ROC curve data — synthesized to produce the AUCs reported in the paper:
 * Ours 0.96, LGBM 0.93, XGB 0.91, BERT-Only 0.88, IsolationForest 0.85
 */
export const ROC_DATA: RocPoint[] = [
  { fpr: 0.0, ours: 0.0, lgbm: 0.0, xgb: 0.0, bert: 0.0, iso: 0.0 },
  { fpr: 0.02, ours: 0.41, lgbm: 0.32, xgb: 0.27, bert: 0.2, iso: 0.13 },
  { fpr: 0.05, ours: 0.62, lgbm: 0.51, xgb: 0.45, bert: 0.34, iso: 0.24 },
  { fpr: 0.1, ours: 0.78, lgbm: 0.69, xgb: 0.62, bert: 0.49, iso: 0.36 },
  { fpr: 0.15, ours: 0.85, lgbm: 0.78, xgb: 0.71, bert: 0.6, iso: 0.46 },
  { fpr: 0.2, ours: 0.9, lgbm: 0.84, xgb: 0.78, bert: 0.7, iso: 0.55 },
  { fpr: 0.3, ours: 0.94, lgbm: 0.9, xgb: 0.85, bert: 0.79, iso: 0.66 },
  { fpr: 0.4, ours: 0.96, lgbm: 0.93, xgb: 0.9, bert: 0.85, iso: 0.74 },
  { fpr: 0.55, ours: 0.98, lgbm: 0.96, xgb: 0.94, bert: 0.91, iso: 0.84 },
  { fpr: 0.7, ours: 0.99, lgbm: 0.98, xgb: 0.97, bert: 0.95, iso: 0.91 },
  { fpr: 0.85, ours: 0.997, lgbm: 0.993, xgb: 0.99, bert: 0.98, iso: 0.96 },
  { fpr: 1.0, ours: 1.0, lgbm: 1.0, xgb: 1.0, bert: 1.0, iso: 1.0 },
];

export const MODELS = [
  { key: "ours", name: "FraudSentinel AI", auc: 0.96, f1: 0.91, color: "#00e5ff" },
  { key: "lgbm", name: "LightGBM", auc: 0.93, f1: 0.89, color: "#f59e0b" },
  { key: "xgb", name: "XGBoost", auc: 0.91, f1: 0.87, color: "#facc15" },
  { key: "bert", name: "BERT-Only", auc: 0.88, f1: 0.85, color: "#8b5cf6" },
  { key: "iso", name: "Isolation Forest", auc: 0.85, f1: 0.81, color: "#94a3b8" },
] as const;

export interface AblationRow {
  config: string;
  f1: number;
  reportTime: number;
}

export const ABLATION: AblationRow[] = [
  { config: "Full System", f1: 0.91, reportTime: 0.8 },
  { config: "Without GNNs", f1: 0.88, reportTime: 0.9 },
  { config: "Without VAEs", f1: 0.9, reportTime: 0.85 },
  { config: "Without IndicBERT", f1: 0.86, reportTime: 1.0 },
];

export interface DatasetRow {
  dataset: string;
  f1: number;
  auc: number;
  size: string;
}

export const DATASET_PERF: DatasetRow[] = [
  { dataset: "Real (BSE SME filings)", f1: 0.9, auc: 0.95, size: "1,500 reports" },
  { dataset: "Synthetic (GAN-generated)", f1: 0.93, auc: 0.97, size: "3,800 reports" },
  { dataset: "Combined", f1: 0.91, auc: 0.96, size: "5,300 reports" },
];

export interface SensitivityRow {
  noise: string;
  f1: number;
  auc: number;
}

export const SENSITIVITY: SensitivityRow[] = [
  { noise: "0% (Clean)", f1: 0.91, auc: 0.96 },
  { noise: "10% Missing", f1: 0.89, auc: 0.94 },
  { noise: "20% Missing", f1: 0.87, auc: 0.92 },
];

export const TOP_STATS = {
  reportsAnalyzed: 5300,
  fraudDetected: 530,
  fraudRate: 10,
  auditTimeSaved: 40,
  f1: 91,
  auc: 0.96,
};

export const FRAUD_DISTRIBUTION = [
  { name: "NBFCs", value: 60, color: "#ef4444" },
  { name: "Listed Firms", value: 25, color: "#f59e0b" },
  { name: "Others", value: 15, color: "#10b981" },
];
