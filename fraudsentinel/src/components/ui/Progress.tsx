import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

type Tone = "cyan" | "amber" | "emerald" | "rose" | "violet" | "ink";

const toneFill: Record<Tone, string> = {
  cyan: "from-cyan/80 to-cyan",
  amber: "from-amber/80 to-amber",
  emerald: "from-emerald/80 to-emerald",
  rose: "from-rose/80 to-rose",
  violet: "from-violet-500/80 to-violet-500",
  ink: "from-ink-faint to-ink-muted",
};

interface Props {
  value: number;
  max?: number;
  tone?: Tone;
  height?: number;
  showValue?: boolean;
  label?: string;
  className?: string;
  animate?: boolean;
}

export function Progress({
  value,
  max = 1,
  tone = "cyan",
  height = 6,
  showValue = false,
  label,
  className,
  animate = true,
}: Props) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={cn("w-full", className)}>
      {(label || showValue) && (
        <div className="mb-1 flex items-center justify-between text-[11px] text-ink-muted font-mono">
          {label ? <span>{label}</span> : null}
          {showValue ? <span>{value.toFixed(2)}</span> : null}
        </div>
      )}
      <div
        className="relative w-full overflow-hidden rounded-full bg-bg-800/80 ring-1 ring-line"
        style={{ height }}
      >
        <motion.div
          className={cn(
            "absolute inset-y-0 left-0 rounded-full bg-gradient-to-r",
            toneFill[tone],
          )}
          initial={animate ? { width: 0 } : { width: `${pct}%` }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}

export function MiniScoreBar({
  label,
  value,
  tone = "cyan",
}: {
  label: string;
  value: number;
  tone?: Tone;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
          {label}
        </span>
        <span className="font-mono text-[15px] font-semibold tabular-nums text-ink">
          {value.toFixed(2)}
        </span>
      </div>
      <Progress value={value} tone={tone} height={5} className="mt-1.5" />
    </div>
  );
}
