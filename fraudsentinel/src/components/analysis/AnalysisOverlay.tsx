import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import { useEffect, useMemo } from "react";
import {
  type AnalysisStep,
  useAnalysisSimulation,
} from "../../hooks/useAnalysisSimulation";
import { type FraudReport } from "../../data/reports";
import { Badge } from "../ui/Badge";
import { StepProgress } from "./StepProgress";
import { cn, verdictColor } from "../../lib/utils";

interface Props {
  report: FraudReport | null;
  onClose: () => void;
  /** Fired the first time the user clicks "View result" after the simulation completes. */
  onComplete?: (report: FraudReport) => void;
}

function buildSteps(report: FraudReport): AnalysisStep[] {
  const langs = report.features.languages.join(" + ");
  const sus = report.findings.find((f) => f.severity === "HIGH");

  return [
    {
      id: "preprocess",
      title: "Step 1 · Preprocessing",
      subtitle: "MinMax scaling · IndicBERT tokenizer · Graph builder",
      durationMs: 1500,
      lines: [
        `[00:01] Loading ${report.fileName} (${report.features.pages} pages, ${report.features.xbrlTags} XBRL tags)`,
        `[00:02] Normalizing 20 numerical features via MinMaxScaler...`,
        `[00:03] Tokenizing multilingual text with IndicBERT (${langs})`,
        `[00:04] Building transaction graph (${report.stats.totalTxns.toLocaleString("en-IN")} transactions)`,
        `[00:04] Edge pruning threshold: 0.05`,
      ],
    },
    {
      id: "gnn",
      title: "Step 2 · GNN Analysis",
      subtitle: "2-layer GCN · 128-dim hidden · 64-dim embedding",
      durationMs: 1500,
      lines: [
        `[00:05] Graph Convolutional Network: 2-layer GCN (128 → 64)`,
        `[00:06] Computing message-passing across pruned edges...`,
        `[00:06] Detecting anomalous subgraphs / circular payment paths...`,
        `[00:07] Suspicious edges flagged: ${
          sus
            ? "circular cycles + shell fan-out"
            : "0 — clean topology"
        }`,
        `[00:07] S_GNN = ${report.scores.gnn.toFixed(3)}`,
      ],
    },
    {
      id: "vae",
      title: "Step 3 · VAE Numerical Scan",
      subtitle: "β-VAE encoder 20 → 64 → 32 → 8 (latent)",
      durationMs: 1500,
      lines: [
        `[00:08] β-VAE Encoder: 20 → 64 → 32 → 8 (latent dim)`,
        `[00:09] Reconstruction error: computing on 20-D feature vector...`,
        `[00:10] Profit margin Δ QoQ: ${report.features.profitMarginQoQ}`,
        `[00:10] Debt ratio: ${report.features.debtRatio.toFixed(1)}`,
        `[00:10] S_VAE = ${report.scores.vae.toFixed(3)}`,
      ],
    },
    {
      id: "bert",
      title: "Step 4 · IndicBERT Textual",
      subtitle: "12-language disclosure & risk-keyword extraction",
      durationMs: 1500,
      lines: [
        `[00:11] IndicBERT (multilingual): scanning 200-word disclosure...`,
        `[00:11] Language detected: ${langs}`,
        `[00:12] Token-level attention pooling on 256 tokens...`,
        `[00:12] Risk keywords identified: ${
          report.fraudScore >= 0.2
            ? '"unreported", "contingent"'
            : "none"
        }`,
        `[00:13] S_IndicBERT = ${report.scores.indicBert.toFixed(3)}`,
      ],
    },
    {
      id: "regulatory",
      title: "Step 5 · Regulatory Fusion",
      subtitle: "SEBI XBRL · GST · Ind AS",
      durationMs: 1000,
      lines: [
        `[00:14] SEBI XBRL Schema v2024: parsing ${report.features.xbrlTags} tags...`,
        `[00:15] GST reconciliation: ${report.stats.gstMismatches} mismatches`,
        `[00:15] Ind AS 18 / 24 compliance check: ${report.compliance.indAs}`,
        `[00:15] Shell-entity transfers: ${report.stats.shellTxns}`,
      ],
    },
    {
      id: "score",
      title: "Step 6 · Score Computation",
      subtitle: "Weighted ensemble · S = 0.4·S_GNN + 0.2·S_VAE + 0.3·S_BERT + 0.1·S_ML",
      durationMs: 1000,
      lines: [
        `[00:16] S = 0.4×${report.scores.gnn.toFixed(2)} + 0.2×${report.scores.vae.toFixed(2)} + 0.3×${report.scores.indicBert.toFixed(2)} + 0.1×${report.scores.ml.toFixed(2)}`,
        `[00:16] Avg anomaly score: ${report.stats.avgScore.toFixed(2)}`,
        `[00:17] VERDICT: ${report.verdict}`,
      ],
    },
  ];
}

export function AnalysisOverlay({ report, onClose, onComplete }: Props) {
  const open = !!report;
  const steps = useMemo(
    () => (report ? buildSteps(report) : []),
    [report],
  );

  const sim = useAnalysisSimulation({
    steps,
    start: open && steps.length > 0,
  });

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const meta = report ? verdictColor(report.verdict) : null;

  return (
    <AnimatePresence>
      {open && report && meta && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 px-4 py-6 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-5xl overflow-hidden rounded-2xl border border-cream/20 bg-surface-elevated shadow-card"
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-3">
              <div className="flex items-center gap-3">
                <span className="relative inline-flex h-2 w-2">
                  <span className="absolute inset-0 animate-ping rounded-full bg-cream opacity-50" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-cream" />
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-cream">
                  Live analysis · {report.fileName}
                </span>
                <Badge tone="muted" size="xs">
                  {report.quarter} {report.fiscalYear}
                </Badge>
              </div>
              <button
                onClick={onClose}
                aria-label="Close analysis"
                className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-line text-ink-muted transition hover:border-cream/40 hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-0 lg:grid-cols-[420px_1fr]">
              <div className="border-b border-line px-5 py-5 lg:border-b-0 lg:border-r">
                <StepProgress
                  steps={steps.map((s) => ({
                    id: s.id,
                    title: s.title,
                    subtitle: s.subtitle,
                  }))}
                  statuses={sim.statuses}
                  currentIndex={sim.currentIndex}
                  stepProgress={sim.stepProgress}
                />
              </div>

              <div className="px-5 py-5">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">
                    Console · {steps[sim.currentIndex]?.title.replace(/^Step \d · /, "") ?? "Done"}
                  </span>
                  <span className="font-mono text-[11px] tabular-nums text-ink-dim">
                    elapsed {(sim.totalElapsedMs / 1000).toFixed(1)}s
                  </span>
                </div>

                <div className="relative h-[340px] overflow-y-auto rounded-lg border border-line bg-bg-900 p-3 font-mono text-[12.5px] leading-relaxed text-ink-muted">
                  <ConsoleStream steps={steps} sim={sim} />
                </div>

                {sim.done ? (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className={cn(
                      "mt-4 flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between",
                      report.verdict === "ESCALATE"
                        ? "border-rose/40 bg-rose/[0.06]"
                        : report.verdict === "REVIEW"
                          ? "border-amber/40 bg-amber/[0.06]"
                          : "border-emerald/40 bg-emerald/[0.06]",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-md font-display text-[12.5px] font-bold tabular-nums",
                          report.verdict === "ESCALATE"
                            ? "bg-rose/15 text-rose"
                            : report.verdict === "REVIEW"
                              ? "bg-amber/15 text-amber"
                              : "bg-emerald/15 text-emerald",
                        )}
                      >
                        {report.fraudScore.toFixed(2)}
                      </div>
                      <div>
                        <div
                          className={cn(
                            "font-display text-[14px] font-semibold",
                            report.verdict === "ESCALATE"
                              ? "text-rose"
                              : report.verdict === "REVIEW"
                                ? "text-amber"
                                : "text-emerald",
                          )}
                        >
                          {report.verdict === "ESCALATE"
                            ? "Escalate to FIU-IND"
                            : report.verdict === "REVIEW"
                              ? "Manual review required"
                              : "Clear · no material risk"}
                        </div>
                        <div className="text-[12px] text-ink-muted">
                          {report.quarter} {report.fiscalYear} ·{" "}
                          {report.stats.fraudTxns} of{" "}
                          {report.stats.totalTxns.toLocaleString("en-IN")} flagged
                          ({report.stats.fraudPct}%)
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        onComplete?.(report);
                        onClose();
                      }}
                      className={cn(
                        "inline-flex items-center justify-center gap-1.5 rounded-md border px-3 py-2 font-mono text-[12px] uppercase tracking-widest transition",
                        report.verdict === "ESCALATE"
                          ? "border-rose/50 bg-rose/10 text-rose hover:bg-rose/15"
                          : report.verdict === "REVIEW"
                            ? "border-amber/50 bg-amber/10 text-amber hover:bg-amber/15"
                            : "border-emerald/50 bg-emerald/10 text-emerald hover:bg-emerald/15",
                      )}
                    >
                      View full report
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </motion.div>
                ) : null}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ConsoleStream({
  steps,
  sim,
}: {
  steps: AnalysisStep[];
  sim: ReturnType<typeof useAnalysisSimulation>;
}) {
  const elements: React.ReactNode[] = [];
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    const status = sim.statuses[i];
    if (status === "pending") continue;
    const linesToShow =
      status === "done" ? step.lines.length : sim.printedLines;
    elements.push(
      <div key={step.id} className="mb-2">
        <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-cream/70">
          ── {step.title}
        </div>
        {step.lines.slice(0, linesToShow).map((line, j) => (
          <motion.div
            key={j}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.18 }}
            className={cn(
              "whitespace-pre-wrap break-words text-ink-muted",
              line.includes("ESCALATE")
                ? "text-rose"
                : line.includes("CLEAR")
                  ? "text-emerald"
                  : line.includes("REVIEW")
                    ? "text-amber"
                    : undefined,
            )}
          >
            <span className="text-cream/70">›</span> {line}
          </motion.div>
        ))}
      </div>,
    );
  }
  return <>{elements}</>;
}
