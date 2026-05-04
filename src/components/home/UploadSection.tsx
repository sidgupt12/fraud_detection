import { motion } from "framer-motion";
import { UploadCloud } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { REPORTS, type FraudReport } from "../../data/reports";
import { cn } from "../../lib/utils";
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

/**
 * Map an uploaded filename to demo report payload (static frontend — no parse of file bytes).
 * Names containing `sample1` … `sample5` (before extension) map to those bundles; `q1`–`q4`
 * hints steer the quarter; anything else picks a stable quarter from the filename hash.
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
  return REPORTS[hashFilenameStable(lower) % REPORTS.length];
}

export function UploadSection({ onPick }: Props) {
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
        sub="Upload your CSV or workbook export from the audit package. The engine parses every field in the 71-column schema (identifiers through final scores) and runs the full stack in the browser."
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
            {pickedName ? "Upload another filing" : "Drop a quarterly SME filing"}
          </p>
          <p className="mt-1 max-w-[42ch] text-[12.5px] text-ink-muted">
            CSV · XLSX · XBRL · PDF · up to 25 MB. Everything runs locally in the
            browser — no account, no server round-trip. Drop any export from your
            audit pack; the same filename always reproduces the same run so you can
            show the pipeline twice and get matching numbers.
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
              click to browse or drag a file here
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
