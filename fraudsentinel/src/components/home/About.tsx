import { motion } from "framer-motion";
import {
  Boxes,
  Cpu,
  Database,
  Languages,
  Lock,
  Sparkles,
} from "lucide-react";
import { SectionHeading } from "./HowItWorks";

interface Fact {
  icon: typeof Cpu;
  title: string;
  body: string;
}

const FACTS: Fact[] = [
  {
    icon: Database,
    title: "5,300 filings ingested",
    body: "1,500 real BSE SME filings + 3,800 GAN-synthesized; 91% F1 on the combined corpus.",
  },
  {
    icon: Languages,
    title: "12 Indic languages",
    body: "IndicBERT fine-tuned on Indian SME disclosures: Hindi, Tamil, Bengali, Telugu, Marathi, and more.",
  },
  {
    icon: Cpu,
    title: "Runs on a 16 GB GPU",
    body: "Edge pruning at 0.05 cuts memory 20%. Inference under a second per report on an RTX 3060.",
  },
  {
    icon: Lock,
    title: "Privacy-preserving",
    body: "Federated learning via Flower v1.7 across 5 SME nodes — gradients move, raw filings don't.",
  },
  {
    icon: Boxes,
    title: "Built for regulators",
    body: "Native parsers for SEBI XBRL v2024, GSTR-1 / 2A / 3B, Ind AS 18 / 24 and MCA cross-reference.",
  },
  {
    icon: Sparkles,
    title: "Audit-grade narrative",
    body: "Llama-3 generator emits an Ind AS-compliant audit story citing every flagged XBRL tag.",
  },
];

export function About() {
  return (
    <section id="about" className="scroll-mt-20">
      <SectionHeading
        eyebrow="About"
        title="A regulatory-aware framework, not just another model."
        sub="FraudSentinel is built around the constraints Indian SMEs actually face: multilingual disclosures, a complex statutory stack, and modest compute."
      />

      <div className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {FACTS.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: 0.05 * i, duration: 0.45 }}
            className="rounded-xl border border-line bg-surface/55 p-5 shadow-card backdrop-blur"
          >
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-line bg-bg-700 text-cream">
              <f.icon className="h-4 w-4" />
            </div>
            <h3 className="mt-3 font-display text-[15px] font-semibold text-ink">
              {f.title}
            </h3>
            <p className="mt-1 text-[12.5px] leading-relaxed text-ink-muted">
              {f.body}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 grid gap-3 rounded-xl border border-line bg-surface/40 p-6 backdrop-blur md:grid-cols-3">
        <Footnote label="F1 vs LightGBM" value="+0.020" hint="95% CI [0.011, 0.029] · p < 0.001" />
        <Footnote label="AUC vs LightGBM" value="+0.030" hint="95% CI [0.018, 0.041] · p < 0.001" />
        <Footnote label="F1 95% CI (ours)" value="0.91" hint="[0.89, 0.93] · n = 5,300" />
      </div>

      <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-line pt-6 text-[12px] text-ink-dim md:flex-row md:items-center">
        <span>
          © FraudSentinel · Academic showcase · {new Date().getFullYear()}
        </span>
        <span className="font-mono">
          SEBI XBRL v2024 · GST · Ind AS 18 / 24 · MCA · FIU-IND
        </span>
      </div>
    </section>
  );
}

function Footnote({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div>
      <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink-dim">
        {label}
      </div>
      <div className="mt-1 font-display text-[20px] font-semibold tabular-nums text-cream">
        {value}
      </div>
      <div className="font-mono text-[11px] text-ink-muted">{hint}</div>
    </div>
  );
}
