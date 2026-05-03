import { motion } from "framer-motion";
import { Check, ShieldAlert, ShieldCheck, TriangleAlert, X } from "lucide-react";
import { type FraudReport } from "../../data/reports";
import { verdictColor } from "../../lib/utils";
import { Card } from "../ui/Card";

interface Props {
  report: FraudReport;
}

const VERDICT_TITLE: Record<FraudReport["verdict"], string> = {
  CLEAR: "Clear · No material risk",
  REVIEW: "Manual review required",
  ESCALATE: "Escalate to FIU-IND",
};

export function ExecutiveSummary({ report }: Props) {
  const meta = verdictColor(report.verdict);
  const Icon =
    report.verdict === "ESCALATE"
      ? ShieldAlert
      : report.verdict === "REVIEW"
        ? TriangleAlert
        : ShieldCheck;
  const verdictBg =
    report.verdict === "ESCALATE"
      ? "bg-rose/[0.06]"
      : report.verdict === "REVIEW"
        ? "bg-amber/[0.06]"
        : "bg-emerald/[0.06]";

  return (
    <Card>
      <div
        className={`relative overflow-hidden rounded-t-xl border-b border-line px-6 py-6 ${verdictBg}`}
      >
        <div
          aria-hidden
          className="absolute left-0 top-0 h-full w-[3px]"
          style={{ background: meta.hex }}
        />
        <div className="flex items-start gap-4">
          <div
            className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-md border ${meta.ringSoft}`}
            style={{ background: `${meta.hex}1a` }}
          >
            <Icon className={`h-5 w-5 ${meta.text}`} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-3">
              <span
                className={`font-mono text-[10.5px] uppercase tracking-[0.2em] ${meta.text}`}
              >
                Verdict
              </span>
              <span className={`font-display text-[18px] font-semibold ${meta.text}`}>
                {VERDICT_TITLE[report.verdict]}
              </span>
            </div>
            <h3 className="mt-1 font-display text-[22px] font-semibold tracking-tight text-ink">
              {report.explainer.headline}
            </h3>
            <p className="mt-2 max-w-[78ch] text-[14px] leading-relaxed text-ink">
              {report.explainer.paragraph}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-2">
        <ReasonColumn
          tone="good"
          title="What looks good"
          icon={Check}
          items={report.explainer.whyGood}
          empty="—"
        />
        <ReasonColumn
          tone="bad"
          title="What raised flags"
          icon={X}
          items={report.explainer.whyConcerning}
          empty="No flags — quarter is clean."
        />
      </div>

      <div className="border-t border-line bg-bg-800/40 px-6 py-3.5 text-[13px]">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-ink-dim">
          Bottom line
        </span>
        <p className="mt-1 text-ink">{report.explainer.bottomLine}</p>
      </div>
    </Card>
  );
}

function ReasonColumn({
  tone,
  title,
  icon: Icon,
  items,
  empty,
}: {
  tone: "good" | "bad";
  title: string;
  icon: typeof Check;
  items: string[];
  empty: string;
}) {
  const colorClass =
    tone === "good"
      ? "text-emerald border-emerald/30 bg-emerald/10"
      : "text-rose border-rose/30 bg-rose/10";
  const headingColor = tone === "good" ? "text-emerald" : "text-rose";
  return (
    <div className="border-line px-6 py-5 [&:not(:first-child)]:border-t lg:[&:not(:first-child)]:border-l lg:[&:not(:first-child)]:border-t-0">
      <div className="flex items-center gap-2">
        <span
          className={`inline-flex h-6 w-6 items-center justify-center rounded-md border ${colorClass}`}
        >
          <Icon className="h-3.5 w-3.5" />
        </span>
        <h4
          className={`font-mono text-[10.5px] uppercase tracking-[0.2em] ${headingColor}`}
        >
          {title}
        </h4>
      </div>
      {items.length ? (
        <ul className="mt-3 space-y-2">
          {items.map((it, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-start gap-2 text-[13px] leading-relaxed text-ink"
            >
              <span
                className={`mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full ${
                  tone === "good" ? "bg-emerald" : "bg-rose"
                }`}
              />
              <span>{it}</span>
            </motion.li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-[13px] italic text-ink-muted">{empty}</p>
      )}
    </div>
  );
}
