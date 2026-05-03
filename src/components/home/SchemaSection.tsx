import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { SCHEMA_GROUPS, TOTAL_FIELDS } from "../../data/schemaFields";
import { cn } from "../../lib/utils";
import { SectionHeading } from "./HowItWorks";

const ACCENT_BORDER = {
  cyan: "border-cyan/30",
  amber: "border-amber/30",
  emerald: "border-emerald/30",
  violet: "border-violet-500/30",
  cream: "border-cream/30",
  rose: "border-rose/30",
} as const;

const ACCENT_TEXT = {
  cyan: "text-cyan",
  amber: "text-amber",
  emerald: "text-emerald",
  violet: "text-[#bca8e0]",
  cream: "text-cream",
  rose: "text-rose",
} as const;

const ACCENT_BG = {
  cyan: "bg-cyan/8",
  amber: "bg-amber/8",
  emerald: "bg-emerald/8",
  violet: "bg-violet-500/8",
  cream: "bg-cream/8",
  rose: "bg-rose/8",
} as const;

const TYPE_TONES: Record<string, string> = {
  id: "text-cream",
  text: "text-ink-muted",
  number: "text-cyan",
  boolean: "text-emerald",
  enum: "text-amber",
  date: "text-cream",
  currency: "text-cyan",
};

export function SchemaSection() {
  const [open, setOpen] = useState<string | null>("identifiers");

  return (
    <section id="schema" className="scroll-mt-20">
      <SectionHeading
        eyebrow="Schema reference"
        title={`All ${TOTAL_FIELDS} fields the model reads — grouped by AI module.`}
        sub="Every quarter is described by 71 columns across 10 functional groups. Each group feeds a specific model component; the table below is colour-coded the same way as the audit Excel's reference tab."
      />

      <div className="mt-6 grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-5">
        {SCHEMA_GROUPS.map((g) => (
          <a
            key={g.id}
            href={`#schema-${g.id}`}
            className={cn(
              "rounded-md border bg-surface/40 px-2.5 py-2 text-[11px] backdrop-blur transition hover:bg-surface/70",
              ACCENT_BORDER[g.accent],
            )}
          >
            <div className="flex items-center justify-between">
              <span className={cn("font-mono uppercase tracking-widest", ACCENT_TEXT[g.accent])}>
                {g.module}
              </span>
              <span className="font-mono text-ink-dim tabular-nums">
                {g.count}
              </span>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-6 space-y-2.5">
        {SCHEMA_GROUPS.map((g) => {
          const isOpen = open === g.id;
          return (
            <motion.div
              key={g.id}
              id={`schema-${g.id}`}
              layout
              className={cn(
                "scroll-mt-24 overflow-hidden rounded-xl border bg-surface/55 backdrop-blur",
                ACCENT_BORDER[g.accent],
              )}
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : g.id)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-bg-800/30"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "inline-flex h-9 w-9 items-center justify-center rounded-md border bg-bg-700",
                      ACCENT_BORDER[g.accent],
                      ACCENT_TEXT[g.accent],
                    )}
                  >
                    <g.icon className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-[15px] font-semibold tracking-tight text-ink">
                        {g.name}
                      </h3>
                      <span
                        className={cn(
                          "rounded px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest",
                          ACCENT_BG[g.accent],
                          ACCENT_TEXT[g.accent],
                        )}
                      >
                        {g.module}
                      </span>
                    </div>
                    <p className="font-mono text-[11px] text-ink-muted">
                      {g.count} fields
                    </p>
                  </div>
                </div>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-ink-muted transition-transform",
                    isOpen && "rotate-180 text-ink",
                  )}
                />
              </button>

              <motion.div
                initial={false}
                animate={{ height: isOpen ? "auto" : 0 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden border-t border-line"
                style={{ height: isOpen ? "auto" : 0 }}
              >
                <div className="grid grid-cols-1 gap-x-6 gap-y-1.5 border-line/60 px-4 py-3 sm:grid-cols-2 lg:grid-cols-3">
                  {g.fields.map((f) => (
                    <div
                      key={f.name}
                      className="flex items-baseline justify-between gap-3 border-b border-line/40 py-1.5 last:border-b-0"
                    >
                      <span className="font-mono text-[12px] text-ink">
                        {f.name}
                      </span>
                      <span className="flex items-baseline gap-2 text-right">
                        {f.hint ? (
                          <span className="font-mono text-[10.5px] text-ink-dim">
                            {f.hint}
                          </span>
                        ) : null}
                        <span
                          className={cn(
                            "rounded border border-line bg-bg-800/50 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest",
                            TYPE_TONES[f.type],
                          )}
                        >
                          {f.type}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
