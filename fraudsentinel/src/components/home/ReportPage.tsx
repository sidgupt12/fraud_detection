import { motion } from "framer-motion";
import {
  ArrowLeft,
  Download,
  FileText,
  Printer,
  Share2,
} from "lucide-react";
import { useState } from "react";
import { type FraudReport } from "../../data/reports";
import { downloadReportHtml } from "../../lib/reportToHtml";
import { ExecutiveSummary } from "./ExecutiveSummary";
import { ResultsSection } from "./ResultsSection";

interface Props {
  report: FraudReport;
  onBack: () => void;
}

export function ReportPage({ report, onBack }: Props) {
  const [shared, setShared] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const text = `${report.company} · ${report.quarter} ${report.fiscalYear} · Verdict ${report.verdict} · score ${report.fraudScore.toFixed(2)} — FraudSentinel audit`;
    const url = window.location.href;
    if (
      typeof navigator !== "undefined" &&
      typeof navigator.share === "function"
    ) {
      try {
        await navigator.share({ title: "FraudSentinel Audit", text, url });
        return;
      } catch {
        /* user cancelled — fall through to clipboard */
      }
    }
    try {
      await navigator.clipboard?.writeText(`${text} — ${url}`);
      setShared(true);
      window.setTimeout(() => setShared(false), 1800);
    } catch {
      /* no-op */
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-6"
      data-print-root
    >
      {/* Action bar */}
      <div className="flex flex-col items-stretch gap-3 border-b border-line pb-4 sm:flex-row sm:items-center sm:justify-between print:hidden">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 rounded-md border border-line bg-bg-800/60 px-3 py-1.5 font-mono text-[11.5px] uppercase tracking-widest text-ink-muted transition hover:border-cream/40 hover:text-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to home
          </button>
          <span className="hidden text-line sm:inline">|</span>
          <div className="flex items-baseline gap-2">
            <FileText className="h-3.5 w-3.5 text-ink-dim" />
            <span className="font-mono text-[11.5px] text-ink-muted">
              {report.fileName}
            </span>
            <span className="font-mono text-[11.5px] text-ink-dim">·</span>
            <span className="font-mono text-[11.5px] text-ink-muted">
              {report.quarter} {report.fiscalYear}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 rounded-md border border-line bg-bg-800/60 px-3 py-1.5 font-mono text-[11.5px] uppercase tracking-widest text-ink-muted transition hover:border-cream/40 hover:text-ink"
          >
            <Share2 className="h-3.5 w-3.5" />
            {shared ? "Copied!" : "Share"}
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-md border border-line bg-bg-800/60 px-3 py-1.5 font-mono text-[11.5px] uppercase tracking-widest text-ink-muted transition hover:border-cream/40 hover:text-ink"
          >
            <Printer className="h-3.5 w-3.5" />
            Print / PDF
          </button>
          <button
            type="button"
            onClick={() => downloadReportHtml(report)}
            className="inline-flex items-center gap-1.5 rounded-md border border-cream/40 bg-cream/10 px-3 py-1.5 font-mono text-[11.5px] uppercase tracking-widest text-cream transition hover:bg-cream/15"
          >
            <Download className="h-3.5 w-3.5" />
            Download report
          </button>
        </div>
      </div>

      <header className="flex flex-col gap-1">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-dim">
          Audit Report · {report.id.toUpperCase()}
        </span>
        <h1 className="font-display text-[28px] font-semibold tracking-tight text-ink md:text-[34px]">
          {report.company}
        </h1>
        <p className="text-[13.5px] text-ink-muted">
          {report.quarter} {report.fiscalYear} · Filed {report.reportDate} ·
          Generated {new Date().toLocaleDateString("en-IN")}
        </p>
      </header>

      <ExecutiveSummary report={report} />

      <ResultsSection report={report} />

      <div className="flex flex-col items-center gap-3 border-t border-line pt-8 print:hidden">
        <p className="text-center text-[13px] text-ink-muted">
          Want to download a print-ready copy of this audit?
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => downloadReportHtml(report)}
            className="inline-flex items-center gap-1.5 rounded-md border border-cream/40 bg-cream/10 px-4 py-2 font-mono text-[12px] uppercase tracking-widest text-cream transition hover:bg-cream/15"
          >
            <Download className="h-3.5 w-3.5" />
            Download .html
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-md border border-line bg-bg-800/60 px-4 py-2 font-mono text-[12px] uppercase tracking-widest text-ink-muted transition hover:text-ink"
          >
            <Printer className="h-3.5 w-3.5" />
            Save as PDF
          </button>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="mt-2 inline-flex items-center gap-1.5 text-[12.5px] text-ink-muted transition hover:text-ink"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to all samples
        </button>
      </div>
    </motion.div>
  );
}
