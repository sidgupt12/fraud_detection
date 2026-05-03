import { motion } from "framer-motion";
import {
  ArrowRight,
  FileSpreadsheet,
  ShieldAlert,
  ShieldCheck,
  TriangleAlert,
  UploadCloud,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { REPORTS, type FraudReport } from "../../data/reports";
import { cn, verdictColor } from "../../lib/utils";
import { SectionHeading } from "./HowItWorks";

interface Props {
  onPick: (report: FraudReport) => void;
  activeId: string | null;
}

/**
 * Map a user-supplied filename to the closest matching demo sample.
 *  - exact match on `sample{1..5}.xlsx`/`.xbrl`/`.pdf` first
 *  - else any token like Q1/Q2/.../Q5 (FY24/25)
 *  - else fall back to sample1
 */
function pickReportByFilename(name: string): FraudReport {
  const lower = name.toLowerCase();
  for (const r of REPORTS) {
    const stem = r.fileName.replace(/\.[^.]+$/, "").toLowerCase();
    if (lower.includes(stem)) return r;
  }
  if (lower.includes("q1") && lower.includes("25")) return REPORTS[4];
  if (lower.includes("q4")) return REPORTS[3];
  if (lower.includes("q3")) return REPORTS[2];
  if (lower.includes("q2")) return REPORTS[1];
  if (lower.includes("q1")) return REPORTS[0];
  return REPORTS[0];
}

export function UploadSection({ onPick, activeId }: Props) {
  const [hover, setHover] = useState(false);
  const [pickedName, setPickedName] = useState<string | null>(null);
  const dropRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFile = (file: File) => {
    setPickedName(file.name);
    onPick(pickReportByFilename(file.name));
  };

  const openPicker = () => {
    inputRef.current?.click();
  };

  // Drag/drop wiring — accepts the first dropped file.
  useEffect(() => {
    const el = dropRef.current;
    if (!el) return;
    const onOver = (e: DragEvent) => {
      e.preventDefault();
      setHover(true);
    };
    const onLeave = () => setHover(false);
    const onDrop = (e: DragEvent) => {
      e.preventDefault();
      setHover(false);
      const file = e.dataTransfer?.files?.[0];
      if (file) handleFile(file);
      else onPick(REPORTS[0]);
    };
    el.addEventListener("dragover", onOver);
    el.addEventListener("dragleave", onLeave);
    el.addEventListener("drop", onDrop);
    return () => {
      el.removeEventListener("dragover", onOver);
      el.removeEventListener("dragleave", onLeave);
      el.removeEventListener("drop", onDrop);
    };
    // handleFile reads only refs/setters and doesn't need to be in deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onPick]);

  return (
    <section id="upload" className="scroll-mt-20">
      <SectionHeading
        eyebrow="Upload"
        title="Drop in a quarter — get a verdict in under 8 seconds."
        sub="Five real-shape sample filings are pre-loaded so you can play the cross-quarter story end-to-end. Each file carries the full 71-field schema."
      />

      <div className="mt-8 grid items-stretch gap-4 lg:grid-cols-[1fr_1.4fr]">
        <motion.div
          ref={dropRef}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          onClick={openPicker}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openPicker();
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Upload a quarterly filing"
          className={cn(
            "group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-surface/40 px-6 py-10 text-center backdrop-blur outline-none transition-colors",
            "focus-visible:ring-2 focus-visible:ring-cream/40",
            hover
              ? "border-cream bg-cream/[0.05]"
              : "border-line hover:border-cream/50 hover:bg-surface/60",
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".csv,.xlsx,.xls,.xbrl,.xml,.pdf,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/pdf"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              // Allow the same file to be re-selected.
              e.target.value = "";
            }}
          />
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-md border border-line bg-bg-700 text-cream transition group-hover:border-cream/40">
            <UploadCloud className="h-5 w-5" />
          </div>
          <p className="mt-4 font-display text-[15px] font-semibold text-ink">
            {pickedName ? "Re-upload a filing" : "Drop a quarterly SME filing"}
          </p>
          <p className="mt-1 max-w-[42ch] text-[12.5px] text-ink-muted">
            CSV · XLSX · XBRL · PDF · up to 25 MB. Compatible with the SEBI
            XBRL v2024 schema and GSTR-1 / 2A / 3B exports.
          </p>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openPicker();
            }}
            className="mt-4 inline-flex items-center gap-1.5 rounded-md border border-cream/30 bg-cream/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-cream transition hover:bg-cream/15"
          >
            <UploadCloud className="h-3.5 w-3.5" />
            Browse files
          </button>
          {pickedName ? (
            <p className="mt-3 max-w-[40ch] truncate font-mono text-[11px] text-cream">
              {pickedName}
            </p>
          ) : (
            <p className="mt-3 font-mono text-[10.5px] text-ink-dim">
              click to browse, drop a file, or pick a sample on the right
            </p>
          )}
        </motion.div>

        <div>
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">
              Sample filings · Apex Retail · 5 quarters
            </span>
            <span className="font-mono text-[11px] text-ink-dim">
              {REPORTS.length} files · 10,000 transactions total
            </span>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {REPORTS.map((r, i) => (
              <SampleTile
                key={r.id}
                report={r}
                index={i}
                active={activeId === r.id}
                onPick={() => onPick(r)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SampleTile({
  report,
  index,
  active,
  onPick,
}: {
  report: FraudReport;
  index: number;
  active: boolean;
  onPick: () => void;
}) {
  const meta = verdictColor(report.verdict);
  const Icon =
    report.verdict === "ESCALATE"
      ? ShieldAlert
      : report.verdict === "REVIEW"
        ? TriangleAlert
        : ShieldCheck;
  const verdictBg =
    report.verdict === "ESCALATE"
      ? "bg-rose/10"
      : report.verdict === "REVIEW"
        ? "bg-amber/10"
        : "bg-emerald/10";

  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.04 * index, duration: 0.45 }}
      whileHover={{ y: -2 }}
      onClick={onPick}
      className={cn(
        "group flex flex-col gap-2.5 rounded-lg border bg-surface/55 p-3.5 text-left backdrop-blur transition",
        active
          ? "border-cream/60 ring-1 ring-cream/30"
          : `${meta.ringSoft} hover:bg-surface/80`,
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-line bg-bg-700 text-cream">
            <FileSpreadsheet className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <div className="font-mono text-[11px] text-ink-dim">
              {report.fileName}
            </div>
            <div className="truncate font-display text-[13.5px] font-semibold text-ink">
              {report.quarter} {report.fiscalYear} ·{" "}
              <span className="text-ink-muted">
                {report.stats.totalTxns.toLocaleString("en-IN")} txns
              </span>
            </div>
          </div>
        </div>
        <span
          className={cn(
            "rounded px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest",
            verdictBg,
            meta.text,
          )}
        >
          {report.verdict}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-1.5 font-mono text-[11px]">
        <Mini
          label="Fraud"
          value={`${report.stats.fraudPct}%`}
          tone={
            report.stats.fraudPct >= 10
              ? "rose"
              : report.stats.fraudPct > 0
                ? "amber"
                : "default"
          }
        />
        <Mini
          label="Shell"
          value={String(report.stats.shellTxns)}
          tone={
            report.stats.shellTxns >= 100
              ? "rose"
              : report.stats.shellTxns > 0
                ? "amber"
                : "default"
          }
        />
        <Mini
          label="GST gap"
          value={String(report.stats.gstMismatches)}
          tone={
            report.stats.gstMismatches >= 100
              ? "rose"
              : report.stats.gstMismatches > 0
                ? "amber"
                : "default"
          }
        />
      </div>

      <div className="flex items-center justify-between">
        <span className={cn("flex items-center gap-1.5 text-[11.5px]", meta.text)}>
          <Icon className="h-3.5 w-3.5" />
          avg score {report.stats.avgScore.toFixed(2)}
        </span>
        <span className="inline-flex items-center gap-1 font-mono text-[10.5px] uppercase tracking-widest text-ink-muted group-hover:text-cream">
          Run analysis
          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </motion.button>
  );
}

function Mini({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "amber" | "rose";
}) {
  const colorMap = {
    default: "text-ink",
    amber: "text-amber",
    rose: "text-rose",
  } as const;
  return (
    <div className="rounded border border-line bg-bg-800/30 px-2 py-1">
      <div className="text-[9.5px] uppercase tracking-widest text-ink-dim">
        {label}
      </div>
      <div className={`font-mono ${colorMap[tone]}`}>{value}</div>
    </div>
  );
}
