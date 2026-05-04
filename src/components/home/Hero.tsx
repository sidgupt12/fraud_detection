import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-12 md:pt-20">
      <div className="grid items-center gap-10 md:grid-cols-[1.2fr_1fr]">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-bg-700/60 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-cream" />
            Regulatory-Aware Fraud Intelligence
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
            className="mt-5 font-display text-[40px] font-semibold leading-[1.05] tracking-[-0.02em] text-ink md:text-[58px]"
          >
            Catch fraud the way{" "}
            <span className="serif italic text-cream">a forensic auditor</span>{" "}
            would — at the speed of an algorithm.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-5 max-w-[58ch] text-[15px] leading-relaxed text-ink-muted text-balance"
          >
            FraudSentinel reads quarterly SME submissions across all{" "}
            <span className="text-ink">71 transaction fields</span>, blends
            graph topology, multilingual disclosures and statutory cross-checks
            against SEBI XBRL, GST and Ind&nbsp;AS, and surfaces a clear verdict:
            <span className="ml-1 text-emerald">Clear</span>,
            <span className="ml-1 text-amber">Review</span> or
            <span className="ml-1 text-rose">Escalate</span>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-7 flex flex-wrap items-center gap-3"
          >
            <a
              href="#upload"
              className="group inline-flex items-center gap-2 rounded-md border border-cream/30 bg-cream/10 px-4 py-2 text-[13.5px] font-medium text-cream transition hover:bg-cream/15"
            >
              Upload a filing
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#how"
              className="rounded-md border border-line bg-bg-800/50 px-4 py-2 text-[13.5px] text-ink-muted transition hover:text-ink"
            >
              How it works
            </a>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-10 grid max-w-md grid-cols-3 gap-6"
          >
            <Stat n="91%" l="F1 Score" hint="95% CI 89–93%" />
            <Stat n="0.96" l="ROC AUC" hint="vs 0.93 LightGBM" />
            <Stat n="71" l="Fields parsed" hint="per transaction" />
          </motion.dl>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}

function Stat({ n, l, hint }: { n: string; l: string; hint: string }) {
  return (
    <div>
      <div className="font-display text-[26px] font-semibold tabular-nums text-ink">
        {n}
      </div>
      <div className="text-[12px] text-ink-muted">{l}</div>
      <div className="font-mono text-[10.5px] text-ink-dim">{hint}</div>
    </div>
  );
}

/**
 * Decorative collage panel — references the product without heavy neon:
 * a stack of file-cards (Q1..Q5) with verdict pill and a faint network
 * embellishment. The card subtly rotates / floats.
 */
function HeroVisual() {
  const cards = [
    { q: "Q1 FY24", verdict: "CLEAR", tone: "emerald" as const, fraud: "0%", detail: "baseline · 0.181 avg" },
    { q: "Q2 FY24", verdict: "CLEAR", tone: "emerald" as const, fraud: "0%", detail: "festival mix · 0.166 avg" },
    { q: "Q3 FY24", verdict: "REVIEW", tone: "amber" as const, fraud: "6%", detail: "first shells" },
    { q: "Q4 FY24", verdict: "ESCALATE", tone: "rose" as const, fraud: "12%", detail: "round-trips" },
    { q: "Q1 FY25", verdict: "ESCALATE", tone: "rose" as const, fraud: "18%", detail: "peak risk" },
  ];
  const toneTextMap = {
    emerald: "text-emerald",
    amber: "text-amber",
    rose: "text-rose",
  } as const;
  const toneRingMap = {
    emerald: "border-emerald/30",
    amber: "border-amber/30",
    rose: "border-rose/30",
  } as const;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      className="relative isolate hidden md:block"
    >
      {/* Faint warm halo */}
      <div
        aria-hidden
        className="absolute -inset-8 -z-10 rounded-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(216,196,163,0.08), transparent 70%)",
        }}
      />

      <div className="relative ml-auto w-full max-w-[460px] rounded-2xl border border-line bg-surface/70 p-5 shadow-card backdrop-blur">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink-dim">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald" />
            Apex Retail · illustrative trajectory
          </div>
          <span className="font-mono text-[10.5px] text-ink-dim">
            cross-quarter
          </span>
        </div>

        <div className="mt-4 space-y-2">
          {cards.map((c, i) => (
            <motion.div
              key={c.q}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.07 }}
              className={`flex items-center justify-between rounded-md border bg-bg-800/40 px-3 py-2 ${toneRingMap[c.tone]}`}
            >
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="rounded-sm border border-line bg-bg-700 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-ink-muted">
                    {c.q}
                  </span>
                  <span className="text-[12.5px] text-ink">2,000 txns</span>
                </div>
                <span className="pl-0 font-mono text-[10px] text-ink-dim">{c.detail}</span>
              </div>
              <div className="flex items-center gap-3 font-mono text-[11px]">
                <span className="text-ink-muted tabular-nums">
                  {c.fraud} fraud
                </span>
                <span
                  className={`rounded px-1.5 py-0.5 text-[10.5px] uppercase tracking-widest ${toneTextMap[c.tone]}`}
                >
                  {c.verdict}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trend line */}
        <div className="mt-4 rounded-md border border-line bg-bg-800/30 p-3">
          <div className="mb-2 flex items-center justify-between font-mono text-[10.5px] uppercase tracking-widest text-ink-dim">
            <span>fraud transaction rate</span>
            <span>0% → 18%</span>
          </div>
          <svg viewBox="0 0 200 60" className="h-12 w-full">
            <defs>
              <linearGradient id="trend-fill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="rgba(217,105,90,0.4)" />
                <stop offset="100%" stopColor="rgba(217,105,90,0)" />
              </linearGradient>
            </defs>
            <motion.path
              d="M 0 56 L 40 56 L 80 56 L 120 40 L 160 22 L 200 6 L 200 60 L 0 60 Z"
              fill="url(#trend-fill)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            />
            <motion.path
              d="M 0 56 L 40 56 L 80 56 L 120 40 L 160 22 L 200 6"
              fill="none"
              stroke="#d8c4a3"
              strokeWidth="1.6"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.5, duration: 1.1 }}
            />
            {[
              [0, 56],
              [40, 56],
              [80, 56],
              [120, 40],
              [160, 22],
              [200, 6],
            ].slice(1).map(([x, y], i) => (
              <motion.circle
                key={i}
                cx={x}
                cy={y}
                r={2.5}
                fill="#d8c4a3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 + i * 0.08 }}
              />
            ))}
          </svg>
        </div>
      </div>
    </motion.div>
  );
}
