import { motion } from "framer-motion";
import { Tooltip } from "../ui/Tooltip";
import { SHAP_FEATURES, type ShapFeature } from "../../data/shapData";

const colorFor: Record<ShapFeature["category"], string> = {
  high: "#ef4444",
  medium: "#f59e0b",
  low: "#10b981",
};

export function ShapChart() {
  const max = Math.max(...SHAP_FEATURES.map((f) => f.impact));
  return (
    <div className="space-y-2.5">
      {SHAP_FEATURES.map((f, i) => {
        const widthPct = (f.impact / max) * 100;
        return (
          <div key={f.feature} className="grid grid-cols-[200px_1fr_64px] items-center gap-3">
            <Tooltip
              content={
                <span>
                  <span className="text-cyan">{f.feature}</span>
                  <br />
                  This feature contributed{" "}
                  <span className="text-amber">{f.impact.toFixed(2)}</span> to
                  the fraud probability for this report.
                  <br />
                  <span className="text-ink-muted">{f.description}</span>
                </span>
              }
            >
              <span className="cursor-help truncate text-[12.5px] text-ink">
                {f.feature}
              </span>
            </Tooltip>
            <div className="relative h-5 overflow-hidden rounded-md bg-bg-800/80 ring-1 ring-line">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-md"
                style={{ backgroundColor: colorFor[f.category], opacity: 0.85 }}
                initial={{ width: 0 }}
                animate={{ width: `${widthPct}%` }}
                transition={{
                  duration: 1.0,
                  delay: 0.08 * i,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
              <motion.div
                className="absolute inset-y-0 left-0 w-px"
                style={{ backgroundColor: "rgba(255,255,255,0.35)" }}
                initial={{ x: 0 }}
                animate={{ x: `${widthPct}%` }}
                transition={{
                  duration: 1.0,
                  delay: 0.08 * i,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            </div>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.08 * i + 0.4 }}
              className="text-right font-mono text-[12.5px] tabular-nums text-ink-muted"
            >
              {f.impact.toFixed(2)}
            </motion.span>
          </div>
        );
      })}
    </div>
  );
}
