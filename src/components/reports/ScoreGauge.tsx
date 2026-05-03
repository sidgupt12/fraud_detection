import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CircularProgressbarWithChildren, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { scoreColor } from "../../lib/utils";

interface Props {
  score: number;
  size?: number;
}

export function ScoreGauge({ score, size = 168 }: Props) {
  const [animated, setAnimated] = useState(0);
  const meta = scoreColor(score);

  useEffect(() => {
    setAnimated(0);
    const id = window.setTimeout(() => setAnimated(score), 80);
    return () => window.clearTimeout(id);
  }, [score]);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0"
      >
        <CircularProgressbarWithChildren
          value={animated * 100}
          maxValue={100}
          strokeWidth={7}
          styles={buildStyles({
            pathColor: meta.hex,
            trailColor: "rgba(148,163,184,0.14)",
            pathTransitionDuration: 1.4,
            strokeLinecap: "round",
          })}
        >
          <div className="text-center">
            <div className="font-mono text-[10.5px] uppercase tracking-widest text-ink-muted">
              Fraud Score
            </div>
            <div
              className="font-display text-[34px] font-bold leading-tight tabular-nums"
              style={{ color: meta.hex }}
            >
              {score.toFixed(3)}
            </div>
            <div
              className="font-mono text-[11px] uppercase tracking-widest"
              style={{ color: meta.hex }}
            >
              {meta.label}
            </div>
            <div className="mt-1 text-[10px] text-ink-dim">threshold 0.70</div>
          </div>
        </CircularProgressbarWithChildren>
      </motion.div>

      {score >= 0.7 && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-2 animate-pulse-ring rounded-full"
        />
      )}
    </div>
  );
}
