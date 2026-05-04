import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Banknote,
  Brain,
  CheckCircle2,
  FileSearch,
  Layers,
  Languages,
  Network,
  ScrollText,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sigma,
  TriangleAlert,
  Users,
} from "lucide-react";
import { Card, CardBody, CardHeader } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Separator } from "../ui/Separator";
import { MiniScoreBar, Progress } from "../ui/Progress";
import { ScoreGauge } from "../reports/ScoreGauge";
import { FindingItem } from "../reports/FindingItem";
import { ScoreBreakdown } from "../charts/ScoreBreakdown";
import { ShapChart } from "../charts/ShapChart";
import { RocCurve } from "../charts/RocCurve";
import {
  GraphLegend,
  TransactionGraph,
} from "../graph/TransactionGraph";
import { GRAPHS } from "../../data/graphData";
import { type FraudReport } from "../../data/reports";
import { verdictColor } from "../../lib/utils";

const recIconMap = {
  shield: ShieldCheck,
  search: Search,
  file: FileSearch,
  alert: ShieldAlert,
  scale: Shield,
  users: Users,
  check: CheckCircle2,
} as const;

interface Props {
  report: FraudReport;
}

export function ResultsSection({ report }: Props) {
  const meta = verdictColor(report.verdict);
  const verdictBg =
    report.verdict === "ESCALATE"
      ? "bg-rose/10"
      : report.verdict === "REVIEW"
        ? "bg-amber/10"
        : "bg-emerald/10";

  const VerdictIcon =
    report.verdict === "ESCALATE"
      ? ShieldAlert
      : report.verdict === "REVIEW"
        ? TriangleAlert
        : ShieldCheck;

  return (
    <div className="space-y-6">
      {/* ── Quarter overview ───────────────────────────────────────── */}
      <Card>
        <div className="flex flex-col gap-6 px-6 py-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[11px] text-ink">
                {report.fileName}
              </span>
              <span className="font-mono text-[11px] text-ink-dim">·</span>
              <span className="font-mono text-[11px] text-ink-dim">
                Filed {report.reportDate}
              </span>
            </div>
            <h2 className="font-display text-[26px] font-semibold tracking-tight text-ink">
              {report.quarter} {report.fiscalYear} ·{" "}
              <span className="text-ink-muted">{report.company}</span>
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={report.compliance.sebiXbrl ? "emerald" : "rose"} size="xs">
                SEBI XBRL {report.compliance.sebiXbrl ? "✓" : "✗"}
              </Badge>
              <Badge tone={report.compliance.gst ? "emerald" : "rose"} size="xs">
                GST {report.compliance.gst ? "Filed ✓" : "✗"}
              </Badge>
              <Badge
                tone={
                  report.compliance.indAs === "REVIEWED"
                    ? "emerald"
                    : report.compliance.indAs === "REVIEW REQUIRED"
                      ? "amber"
                      : "muted"
                }
                size="xs"
              >
                Ind AS {report.compliance.indAs}
              </Badge>
              <Badge tone="muted" size="xs">
                {report.features.languages.join(" · ")}
              </Badge>
              <Badge tone="muted" size="xs">
                {report.features.xbrlTags} XBRL tags
              </Badge>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 lg:items-end">
            <ScoreGauge score={report.fraudScore} />
            <div
              className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 font-mono text-[11px] uppercase tracking-widest ${meta.text} ${verdictBg} ${meta.ringSoft}`}
            >
              <VerdictIcon className="h-3.5 w-3.5" />
              Verdict · {report.verdict}
            </div>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-4 px-6 py-4 md:grid-cols-5">
          <BigStat
            label="Total transactions"
            value={report.stats.totalTxns.toLocaleString("en-IN")}
            tone="ink"
          />
          <BigStat
            label="Fraud transactions"
            value={`${report.stats.fraudTxns} · ${report.stats.fraudPct}%`}
            tone={
              report.stats.fraudPct >= 10
                ? "rose"
                : report.stats.fraudPct > 0
                  ? "amber"
                  : "emerald"
            }
          />
          <BigStat
            label="Shell-entity transfers"
            value={String(report.stats.shellTxns)}
            tone={
              report.stats.shellTxns >= 100
                ? "rose"
                : report.stats.shellTxns > 0
                  ? "amber"
                  : "emerald"
            }
          />
          <BigStat
            label="GST mismatches"
            value={String(report.stats.gstMismatches)}
            tone={
              report.stats.gstMismatches >= 100
                ? "rose"
                : report.stats.gstMismatches > 0
                  ? "amber"
                  : "emerald"
            }
          />
          <BigStat
            label="Avg anomaly score"
            value={report.stats.avgScore.toFixed(2)}
            tone={meta.text === "text-rose" ? "rose" : meta.text === "text-amber" ? "amber" : "emerald"}
            hint="threshold 0.20 / 0.225"
          />
        </div>
      </Card>

      {/* ── Score breakdown + per-model ────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Per-model contributions"
            subtitle="S = 0.4·S_GNN + 0.2·S_VAE + 0.3·S_BERT + 0.1·S_ML"
            right={
              <span className="font-mono text-[10.5px] uppercase tracking-widest text-ink-dim">
                weighted ensemble
              </span>
            }
          />
          <CardBody>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-center">
              <ScoreBreakdown scores={report.scores} />
              <div className="space-y-3">
                <MiniScoreBar label="GNN Score" value={report.scores.gnn} tone="cyan" />
                <MiniScoreBar label="VAE Score" value={report.scores.vae} tone="emerald" />
                <MiniScoreBar
                  label="IndicBERT Score"
                  value={report.scores.indicBert}
                  tone="amber"
                />
                <MiniScoreBar
                  label="ML Baseline Score"
                  value={report.scores.ml}
                  tone="violet"
                />
              </div>
            </div>
            <div className="mt-4 rounded-md border border-line bg-bg-800/40 p-3 font-mono text-[11.5px] text-ink-muted">
              S = 0.4×{report.scores.gnn.toFixed(2)} + 0.2×
              {report.scores.vae.toFixed(2)} + 0.3×
              {report.scores.indicBert.toFixed(2)} + 0.1×
              {report.scores.ml.toFixed(2)}
              <br />
              S ={" "}
              {(report.scores.gnn * 0.4).toFixed(3)} +{" "}
              {(report.scores.vae * 0.2).toFixed(3)} +{" "}
              {(report.scores.indicBert * 0.3).toFixed(3)} +{" "}
              {(report.scores.ml * 0.1).toFixed(3)}{" "}
              ={" "}
              <span className={`font-semibold ${meta.text}`}>
                {(
                  report.scores.gnn * 0.4 +
                  report.scores.vae * 0.2 +
                  report.scores.indicBert * 0.3 +
                  report.scores.ml * 0.1
                ).toFixed(3)}
              </span>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Llama-3 audit narrative"
            subtitle="Auto-generated · Ind AS-compliant"
            right={
              <Badge tone="violet" size="xs" pulse>
                AI-DRAFTED
              </Badge>
            }
          />
          <CardBody>
            <p className="text-[13px] leading-relaxed text-ink">
              {report.narrative}
            </p>
            <div className="mt-3 flex items-center gap-2 font-mono text-[10.5px] text-ink-dim">
              <span>614 ms</span>
              <span>·</span>
              <span>184 tokens</span>
              <span>·</span>
              <span>conf. 0.93</span>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* ── Findings + Recommendations ─────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Findings"
            subtitle={`${report.findings.length} items · severity-ranked`}
            right={
              <span className="font-mono text-[10.5px] uppercase tracking-widest text-ink-dim">
                72-field schema
              </span>
            }
          />
          <CardBody>
            <ul className="flex flex-col gap-2">
              {report.findings.map((f, i) => (
                <FindingItem key={i} finding={f} index={i} />
              ))}
            </ul>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Recommendations"
            subtitle="Actionable next steps"
          />
          <CardBody>
            <ol className="flex flex-col gap-2">
              {report.recommendations.map((r, i) => {
                const Icon = recIconMap[r.icon ?? "check"];
                return (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-start gap-3 rounded-lg border border-line bg-bg-800/40 px-3 py-2.5"
                  >
                    <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-line bg-bg-700 text-cream">
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-widest text-ink-dim">
                        Step {i + 1}
                      </div>
                      <p className="text-[13px] text-ink">{r.text}</p>
                    </div>
                  </motion.li>
                );
              })}
            </ol>
          </CardBody>
        </Card>
      </div>

      {/* ── Transaction graph (kept neon) ──────────────────────────── */}
      <Card glow={report.verdict === "ESCALATE"}>
        <CardHeader
          title="Transaction graph"
          subtitle={GRAPHS[report.id].meta.gcnSpec}
          right={<GraphLegend />}
        />
        <CardBody>
          <div className="grid gap-4 lg:grid-cols-[1fr_220px] lg:items-center">
            <div className="rounded-lg border border-line bg-bg-900/50 p-2">
              <TransactionGraph data={GRAPHS[report.id]} key={report.id} />
            </div>
            <div className="space-y-2 font-mono text-[11.5px]">
              <GraphStat k="Nodes" v={String(GRAPHS[report.id].meta.nodeCount)} />
              <GraphStat k="Edges" v={String(GRAPHS[report.id].meta.edgeCount)} />
              <GraphStat
                k="Suspicious edges"
                v={String(GRAPHS[report.id].meta.suspiciousEdges)}
                tone={
                  GRAPHS[report.id].meta.suspiciousEdges >= 5
                    ? "rose"
                    : GRAPHS[report.id].meta.suspiciousEdges > 0
                      ? "amber"
                      : "ink"
                }
              />
              <GraphStat
                k="Edge prune τ"
                v={GRAPHS[report.id].meta.threshold.toFixed(2)}
              />
              <GraphStat k="GCN" v="2-layer · 128 → 64" />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* ── SHAP + ROC ─────────────────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="SHAP · feature attribution"
            subtitle="Relative influence of each signal on the ensemble risk score"
            right={
              <span className="font-mono text-[10.5px] uppercase tracking-widest text-ink-dim">
                hover rows
              </span>
            }
          />
          <CardBody>
            <ShapChart reportId={report.id} />
          </CardBody>
        </Card>
        <Card>
          <CardHeader
            title="ROC · validation benchmark"
            subtitle="False positive rate vs true positive rate"
            right={
              <span className="font-mono text-[10.5px] uppercase tracking-widest text-cream">
                AUC 0.96
              </span>
            }
          />
          <CardBody>
            <RocCurve />
          </CardBody>
        </Card>
      </div>

      {/* ── Compliance posture ─────────────────────────────────────── */}
      <Card>
        <CardHeader
          title="Compliance posture"
          subtitle="SEBI XBRL · GST · Ind AS · MCA · FIU-IND cross-checks"
        />
        <CardBody>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <CheckTile
              label="SEBI XBRL Schema"
              detail={`v2024 · ${report.features.xbrlTags} tags parsed`}
              status={report.compliance.sebiXbrl ? "ok" : "fail"}
              icon={ScrollText}
            />
            <CheckTile
              label="GST Reconciliation"
              detail={`GSTR-1/2A/3B · ${report.stats.gstMismatches} mismatches`}
              status={
                report.stats.gstMismatches === 0
                  ? "ok"
                  : report.stats.gstMismatches >= 100
                    ? "fail"
                    : "warn"
              }
              icon={Banknote}
            />
            <CheckTile
              label="Ind AS Compliance"
              detail="18 (Revenue) · 24 (Related Party)"
              status={
                report.compliance.indAs === "REVIEWED"
                  ? "ok"
                  : report.compliance.indAs === "REVIEW REQUIRED"
                    ? "warn"
                    : "fail"
              }
              icon={Layers}
            />
            <CheckTile
              label="MCA / FIU-IND Cross-Reference"
              detail={`${report.stats.shellTxns} shell-entity transfers`}
              status={
                report.verdict === "ESCALATE"
                  ? "fail"
                  : report.verdict === "REVIEW"
                    ? "warn"
                    : "ok"
              }
              icon={Users}
            />
          </div>

          <div className="mt-5">
            <Progress
              value={
                report.verdict === "ESCALATE"
                  ? 0.36
                  : report.verdict === "REVIEW"
                    ? 0.66
                    : 0.96
              }
              tone={
                report.verdict === "ESCALATE"
                  ? "rose"
                  : report.verdict === "REVIEW"
                    ? "amber"
                    : "emerald"
              }
              label="Overall regulatory compliance posture"
            />
          </div>
        </CardBody>
      </Card>

      {/* ── Pipeline summary ───────────────────────────────────────── */}
      <Card>
        <CardHeader
          title="Pipeline summary"
          subtitle="Where every score in this report came from"
        />
        <CardBody>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <PipelineStep
              icon={Network}
              title="GNN · graph anomalies"
              body={`${GRAPHS[report.id].meta.suspiciousEdges} suspicious edges across ${GRAPHS[report.id].meta.nodeCount} nodes.`}
              score={report.scores.gnn}
              tone="cyan"
            />
            <PipelineStep
              icon={Activity}
              title="VAE · numerical anomalies"
              body={`Debt ratio ${report.features.debtRatio}, profit margin ${report.features.profitMarginQoQ}.`}
              score={report.scores.vae}
              tone="emerald"
            />
            <PipelineStep
              icon={Languages}
              title="IndicBERT · disclosures"
              body={`${report.features.languages.join(" · ")} · ${report.features.pages} pages.`}
              score={report.scores.indicBert}
              tone="amber"
            />
            <PipelineStep
              icon={Brain}
              title="ML baseline"
              body="XGBoost on 20 hand-crafted statistical features."
              score={report.scores.ml}
              tone="violet"
            />
          </div>

          <div className="mt-4 flex flex-col items-start justify-between gap-2 rounded-lg border border-line bg-bg-800/40 px-4 py-3 md:flex-row md:items-center">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-cream/30 bg-cream/10 text-cream">
                <Sigma className="h-3.5 w-3.5" />
              </span>
              <span className="font-mono text-[12px] text-ink-muted">
                Final composite score:{" "}
                <span className={`font-semibold ${meta.text}`}>
                  {report.fraudScore.toFixed(3)}
                </span>{" "}
                — verdict {report.verdict}
              </span>
            </div>
            <a
              href="#upload"
              className="inline-flex items-center gap-1.5 rounded-md border border-line bg-bg-700 px-3 py-1.5 font-mono text-[11.5px] uppercase tracking-widest text-ink-muted transition hover:text-ink"
            >
              Analyze another file
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

/* ─────────────────────────── Subcomponents ─────────────────────────── */

function BigStat({
  label,
  value,
  tone = "ink",
  hint,
}: {
  label: string;
  value: string;
  tone?: "ink" | "rose" | "amber" | "emerald";
  hint?: string;
}) {
  const colorMap = {
    ink: "text-ink",
    rose: "text-rose",
    amber: "text-amber",
    emerald: "text-emerald",
  } as const;
  return (
    <div>
      <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink-dim">
        {label}
      </div>
      <div
        className={`mt-1 font-display text-[20px] font-semibold tabular-nums ${colorMap[tone]}`}
      >
        {value}
      </div>
      {hint ? (
        <div className="font-mono text-[10.5px] text-ink-dim">{hint}</div>
      ) : null}
    </div>
  );
}

function GraphStat({
  k,
  v,
  tone = "ink",
}: {
  k: string;
  v: string;
  tone?: "ink" | "rose" | "amber";
}) {
  const colorMap = { ink: "text-ink", rose: "text-rose", amber: "text-amber" } as const;
  return (
    <div className="flex items-baseline justify-between rounded border border-line bg-bg-800/40 px-2.5 py-1.5">
      <span className="text-[10px] uppercase tracking-widest text-ink-dim">
        {k}
      </span>
      <span className={`tabular-nums ${colorMap[tone]}`}>{v}</span>
    </div>
  );
}

function CheckTile({
  label,
  detail,
  status,
  icon: Icon,
}: {
  label: string;
  detail: string;
  status: "ok" | "warn" | "fail";
  icon: typeof ScrollText;
}) {
  const map = {
    ok: { tone: "emerald" as const, text: "PASS", iconColor: "text-emerald" },
    warn: { tone: "amber" as const, text: "REVIEW", iconColor: "text-amber" },
    fail: { tone: "rose" as const, text: "FAIL", iconColor: "text-rose" },
  };
  const s = map[status];
  return (
    <div className="rounded-lg border border-line bg-bg-800/40 p-3">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-[12.5px] text-ink">
          <Icon className={`h-3.5 w-3.5 ${s.iconColor}`} />
          {label}
        </span>
        <Badge tone={s.tone} size="xs">
          {s.text}
        </Badge>
      </div>
      <p className="mt-1 font-mono text-[10.5px] text-ink-muted">{detail}</p>
    </div>
  );
}

function PipelineStep({
  icon: Icon,
  title,
  body,
  score,
  tone,
}: {
  icon: typeof Network;
  title: string;
  body: string;
  score: number;
  tone: "cyan" | "emerald" | "amber" | "violet";
}) {
  const TONE_TEXT = {
    cyan: "text-cyan",
    emerald: "text-emerald",
    amber: "text-amber",
    violet: "text-[#bca8e0]",
  } as const;
  const TONE_BORDER = {
    cyan: "border-cyan/30",
    emerald: "border-emerald/30",
    amber: "border-amber/30",
    violet: "border-violet-500/30",
  } as const;
  return (
    <div className={`rounded-lg border ${TONE_BORDER[tone]} bg-bg-800/40 p-3.5`}>
      <div className="flex items-center justify-between">
        <span
          className={`inline-flex h-7 w-7 items-center justify-center rounded-md border ${TONE_BORDER[tone]} bg-bg-700 ${TONE_TEXT[tone]}`}
        >
          <Icon className="h-3.5 w-3.5" />
        </span>
        <span className={`font-mono text-[12px] tabular-nums ${TONE_TEXT[tone]}`}>
          {score.toFixed(2)}
        </span>
      </div>
      <h4 className="mt-2 font-display text-[13.5px] font-semibold text-ink">
        {title}
      </h4>
      <p className="mt-0.5 text-[11.5px] text-ink-muted">{body}</p>
    </div>
  );
}
