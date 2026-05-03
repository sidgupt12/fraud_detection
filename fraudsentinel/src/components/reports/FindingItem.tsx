import { motion } from "framer-motion";
import { AlertTriangle, Info, ShieldAlert, ShieldCheck } from "lucide-react";
import type { Finding } from "../../data/reports";
import { severityStyles } from "../../lib/utils";

interface Props {
  finding: Finding;
  index: number;
}

const iconFor = {
  HIGH: ShieldAlert,
  MEDIUM: AlertTriangle,
  LOW: ShieldCheck,
  INFO: Info,
} as const;

export function FindingItem({ finding, index }: Props) {
  const meta = severityStyles[finding.severity];
  const Icon = iconFor[finding.severity];
  return (
    <motion.li
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: "easeOut" }}
      className="flex items-start gap-3 rounded-lg border border-line/60 bg-bg-800/40 px-3.5 py-2.5"
    >
      <div
        className={`mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border ${meta.badge}`}
      >
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center rounded border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest ${meta.badge}`}
          >
            {meta.label}
          </span>
          <p className="text-[13px] text-ink">{finding.text}</p>
        </div>
        {finding.detail ? (
          <p className="mt-1 font-mono text-[11.5px] text-ink-muted">
            {finding.detail}
          </p>
        ) : null}
      </div>
    </motion.li>
  );
}
