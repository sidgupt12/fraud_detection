import { motion } from "framer-motion";
import {
  Activity,
  Languages,
  Network,
  ScrollText,
  Sigma,
} from "lucide-react";

interface Step {
  no: string;
  title: string;
  body: string;
  icon: typeof Network;
  badge: string;
}

const STEPS: Step[] = [
  {
    no: "01",
    title: "Graph reasoning",
    body: "A 2-layer GCN walks the transaction network, finding circular payment rings, shell-entity fan-out and intercompany cycles invisible to row-by-row checks.",
    icon: Network,
    badge: "GNN · S_GNN",
  },
  {
    no: "02",
    title: "Numerical anomalies",
    body: "A β-VAE learns the latent shape of healthy financials and flags reconstruction errors on profit margin, debt ratio and revenue deviation.",
    icon: Activity,
    badge: "VAE · S_VAE",
  },
  {
    no: "03",
    title: "Multilingual disclosures",
    body: "IndicBERT reads the narrative — Hindi, Tamil, Bengali, Telugu and 8 other Indic languages — and surfaces risk phrases like \u201Cunreported\u201D or \u201Cঋণ\u201D with token-level attribution.",
    icon: Languages,
    badge: "BERT · S_IndicBERT",
  },
  {
    no: "04",
    title: "Regulatory context",
    body: "Findings are cross-checked against the SEBI XBRL v2024 schema, GSTR-1/2A/3B reconciliation, Ind AS 18/24 triggers and MCA registration data.",
    icon: ScrollText,
    badge: "Fusion · Ω_reg",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-20">
      <SectionHeading
        eyebrow="Architecture"
        title="One pipeline. Four lenses."
        sub="The score on every quarter is the weighted ensemble of four orthogonal models — each catches a different kind of fraud."
      />

      <div className="mt-10 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {STEPS.map((s, i) => (
          <motion.div
            key={s.no}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: i * 0.06, duration: 0.45 }}
            className="rounded-xl border border-line bg-surface/55 p-5 shadow-card backdrop-blur transition hover:bg-surface/75"
          >
            <div className="flex items-start justify-between">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-line bg-bg-700 text-cream">
                <s.icon className="h-4 w-4" />
              </span>
              <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink-dim">
                {s.no}
              </span>
            </div>
            <h3 className="mt-4 font-display text-[16px] font-semibold tracking-tight text-ink">
              {s.title}
            </h3>
            <p className="mt-1.5 text-[13px] leading-relaxed text-ink-muted">
              {s.body}
            </p>
            <div className="mt-4 inline-flex items-center gap-1.5 rounded border border-line bg-bg-800/60 px-2 py-0.5 font-mono text-[10.5px] uppercase tracking-widest text-ink-muted">
              {s.badge}
            </div>
          </motion.div>
        ))}
      </div>

      <FormulaCallout />
    </section>
  );
}

function FormulaCallout() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="mt-6 flex flex-col items-start justify-between gap-3 rounded-xl border border-line bg-bg-800/40 px-5 py-4 md:flex-row md:items-center"
    >
      <div className="flex items-center gap-3">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-cream/30 bg-cream/10 text-cream">
          <Sigma className="h-4 w-4" />
        </span>
        <div>
          <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink-dim">
            Weighted ensemble
          </div>
          <div className="font-mono text-[13.5px] text-ink">
            S = 0.4·S<span className="text-ink-muted">GNN</span> + 0.2·S
            <span className="text-ink-muted">VAE</span> + 0.3·S
            <span className="text-ink-muted">IndicBERT</span> + 0.1·S
            <span className="text-ink-muted">ML</span>
          </div>
        </div>
      </div>
      <div className="font-mono text-[11px] text-ink-muted">
        thresholds <span className="text-emerald">CLEAR &lt; 0.20</span> ·{" "}
        <span className="text-amber">REVIEW 0.20 – 0.225</span> ·{" "}
        <span className="text-rose">ESCALATE ≥ 0.225</span>
      </div>
    </motion.div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  sub,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  sub?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "text-center" : ""}>
      <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-bg-800/50 px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">
        {eyebrow}
      </span>
      <h2 className="mt-3 font-display text-[28px] font-semibold tracking-tight text-ink md:text-[34px]">
        {title}
      </h2>
      {sub ? (
        <p className="mt-2 max-w-[68ch] text-[14px] leading-relaxed text-ink-muted">
          {sub}
        </p>
      ) : null}
    </div>
  );
}
