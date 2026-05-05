import { motion } from "framer-motion";
import { Download, UploadCloud } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { REPORTS, type FraudReport } from "../../data/reports";
import {
  isCsvFile,
  parseCsvHeaderRow,
  transactionCsvTemplateBlob,
  validateTransactionCsvHeaders,
} from "../../lib/transactionCsvSchema";
import { cn } from "../../lib/utils";
import { Alert } from "../ui/Alert";
import { SectionHeading } from "./HowItWorks";

interface Props {
  onPick: (report: FraudReport) => void;
}

function hashFilenameStable(name: string): number {
  let h = 2166136261;
  for (let i = 0; i < name.length; i++) {
    h ^= name.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/** Chooses which quarterly bundle to analyse from the uploaded filename. */
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
  return REPORTS[hashFilenameStable(lower) % REPORTS.length];
}

const CSV_HEADER_READ_BYTES = 262_144;

export function UploadSection({ onPick }: Props) {
  const [hover, setHover] = useState(false);
  const [pickedName, setPickedName] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const dropRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const processFile = useCallback(
    async (file: File) => {
      if (!isCsvFile(file)) {
        setUploadError(
          "Only CSV files are supported. Please choose a file that ends with .csv.",
        );
        return;
      }
      try {
        const head = await file.slice(0, CSV_HEADER_READ_BYTES).text();
        const headers = parseCsvHeaderRow(head);
        const result = validateTransactionCsvHeaders(headers);
        if (!result.ok) {
          setUploadError(
            "Invalid data: this CSV does not include every column the engine expects. Use Download template for the correct header row, then try again.",
          );
          return;
        }
      } catch {
        setUploadError(
          "We could not read that file. Make sure it is a valid CSV and try again.",
        );
        return;
      }
      setUploadError(null);
      setPickedName(file.name);
      onPick(pickReportByFilename(file.name));
    },
    [onPick],
  );

  const openPicker = () => {
    inputRef.current?.click();
  };

  const downloadTemplate = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setUploadError(null);
    const blob = transactionCsvTemplateBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transaction_upload_template.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
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
      if (file) void processFile(file);
    };
    el.addEventListener("dragover", onOver);
    el.addEventListener("dragleave", onLeave);
    el.addEventListener("drop", onDrop);
    return () => {
      el.removeEventListener("dragover", onOver);
      el.removeEventListener("dragleave", onLeave);
      el.removeEventListener("drop", onDrop);
    };
  }, [processFile]);

  return (
    <section id="upload" className="scroll-mt-20">
      <SectionHeading
        eyebrow="Upload"
        title="Drop in a quarter — get a verdict in under 8 seconds."
        sub="Submit your quarterly transaction ledger in CSV. FraudSentinel expects the standard 71-field regulatory schema—use the template to align exports from your ERP or audit workbook."
      />

      <div className="mt-8">
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
            "group relative mx-auto flex max-w-xl cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-surface/40 px-6 py-12 text-center backdrop-blur outline-none transition-colors md:py-14",
            "focus-visible:ring-2 focus-visible:ring-cream/40",
            hover
              ? "border-cream bg-cream/[0.05]"
              : "border-line hover:border-cream/50 hover:bg-surface/60",
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".csv,text/csv"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void processFile(file);
              // Allow the same file to be re-selected.
              e.target.value = "";
            }}
          />
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-md border border-line bg-bg-700 text-cream transition group-hover:border-cream/40">
            <UploadCloud className="h-5 w-5" />
          </div>
          <p className="mt-4 font-display text-[15px] font-semibold text-ink">
            {pickedName ? "Upload another filing" : "Drop a quarterly SME filing"}
          </p>
          <p className="mt-1 max-w-[42ch] text-[12.5px] text-ink-muted">
            Accepted format: CSV. Processing stays in an isolated client
            environment—your ledger is not sent to shared infrastructure. Headers
            must match the schema; non-conforming files are blocked before
            scoring.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openPicker();
              }}
              className="inline-flex items-center gap-1.5 rounded-md border border-cream/30 bg-cream/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-cream transition hover:bg-cream/15"
            >
              <UploadCloud className="h-3.5 w-3.5" />
              Browse files
            </button>
            <button
              type="button"
              onClick={downloadTemplate}
              className="inline-flex items-center gap-1.5 rounded-md border border-line bg-surface/60 px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-ink-muted transition hover:border-cream/30 hover:text-cream"
            >
              <Download className="h-3.5 w-3.5" />
              Download template
            </button>
          </div>
          {pickedName ? (
            <p className="mt-3 max-w-[40ch] truncate font-mono text-[11px] text-cream">
              {pickedName}
            </p>
          ) : (
            <p className="mt-3 font-mono text-[10.5px] text-ink-dim">
              click to browse or drag a file here
            </p>
          )}
        </motion.div>
        {uploadError ? (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mt-4 max-w-xl"
          >
            <Alert tone="danger" title="Upload blocked">
              {uploadError}
            </Alert>
          </motion.div>
        ) : null}
      </div>
    </section>
  );
}
