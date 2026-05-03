import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import type { StepStatus } from "../../hooks/useAnalysisSimulation";
import { cn } from "../../lib/utils";

interface Step {
  id: string;
  title: string;
  subtitle: string;
}

interface Props {
  steps: Step[];
  statuses: StepStatus[];
  currentIndex: number;
  stepProgress: number;
}

export function StepProgress({
  steps,
  statuses,
  currentIndex,
  stepProgress,
}: Props) {
  return (
    <ol className="flex flex-col gap-1">
      {steps.map((s, i) => {
        const status = statuses[i] ?? "pending";
        const active = status === "active";
        const done = status === "done";
        const showProgress = active;
        const fill = done ? 100 : active ? stepProgress * 100 : 0;
        const isLast = i === steps.length - 1;

        return (
          <li key={s.id} className="relative">
            <div className="grid grid-cols-[28px_1fr] items-start gap-3">
              <div className="relative flex flex-col items-center">
                <motion.div
                  initial={false}
                  animate={{
                    backgroundColor: done
                      ? "rgba(16,185,129,0.15)"
                      : active
                        ? "rgba(0,229,255,0.18)"
                        : "rgba(20,33,65,0.6)",
                    borderColor: done
                      ? "rgba(16,185,129,0.55)"
                      : active
                        ? "rgba(0,229,255,0.55)"
                        : "rgba(148,163,184,0.18)",
                  }}
                  className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full border"
                >
                  {done ? (
                    <Check className="h-3.5 w-3.5 text-emerald" />
                  ) : active ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-cyan" />
                  ) : (
                    <span className="font-mono text-[10px] text-ink-dim">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  )}
                </motion.div>
                {!isLast && (
                  <span
                    className={cn(
                      "absolute left-1/2 top-7 h-[calc(100%+12px)] w-px -translate-x-1/2 bg-line",
                      done && "bg-emerald/40",
                      active && "bg-cyan/40",
                    )}
                  />
                )}
              </div>

              <div className="min-w-0 pb-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div
                      className={cn(
                        "font-display text-[13px] font-semibold tracking-tight",
                        active
                          ? "text-cyan"
                          : done
                            ? "text-emerald"
                            : "text-ink-muted",
                      )}
                    >
                      {s.title}
                    </div>
                    <div className="text-[11.5px] text-ink-muted">
                      {s.subtitle}
                    </div>
                  </div>
                  <span
                    className={cn(
                      "font-mono text-[10.5px] uppercase tracking-widest",
                      active && "text-cyan",
                      done && "text-emerald",
                      !active && !done && "text-ink-dim",
                    )}
                  >
                    {done ? "DONE" : active ? "RUNNING" : "PENDING"}
                  </span>
                </div>

                {(showProgress || done) && (
                  <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-bg-800/80 ring-1 ring-line/60">
                    <motion.div
                      className={cn(
                        "h-full rounded-full",
                        done
                          ? "bg-gradient-to-r from-emerald/80 to-emerald"
                          : "bg-gradient-to-r from-cyan/80 to-cyan",
                      )}
                      animate={{ width: `${fill}%` }}
                      transition={{ ease: "linear", duration: 0.1 }}
                    />
                  </div>
                )}

                {active && (
                  <div
                    className={cn(
                      "mt-2 inline-flex items-center gap-1 font-mono text-[11px] text-cyan",
                      "tabular-nums",
                    )}
                  >
                    <span>{(stepProgress * 100).toFixed(0).padStart(3, " ")}%</span>
                    <span className="ml-1 inline-block h-3 w-2 bg-cyan animate-blink" />
                  </div>
                )}
                {i === currentIndex && (
                  <span className="sr-only">currently running</span>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
