import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

const BOOT_LINES = [
  "init › fraudsentinel kernel",
  "load › sebi xbrl schema v2024",
  "load › indicbert multilingual · 12 lang",
  "load › gnn anomaly detector",
  "load › β-vae numerical engine",
  "sync › regulatory fusion module",
  "ready › awaiting filings",
];

interface Props {
  onDone: () => void;
  /** Total time (ms) the preloader stays on screen before exiting. */
  duration?: number;
}

/**
 * Cinematic boot curtain shown on first paint.
 * The shield mark draws itself, the wordmark fades in (Fraunces serif),
 * a few terminal-style boot lines type out, a thin cream bar fills,
 * then the curtain splits horizontally to reveal the app.
 *
 * Skips automatically after the user has seen it once per session.
 */
export function Preloader({ onDone, duration = 3200 }: Props) {
  const [stage, setStage] = useState<"booting" | "fading" | "splitting" | "gone">(
    "booting",
  );
  const [progress, setProgress] = useState(0);
  const [lineIndex, setLineIndex] = useState(0);
  const startedAt = useRef<number | null>(null);

  // Lock body scroll while curtain is up.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Boot animation timeline.
  useEffect(() => {
    startedAt.current = performance.now();
    let raf = 0;

    const step = (now: number) => {
      const t = Math.min(1, (now - (startedAt.current ?? now)) / duration);
      // Ease-out cubic so the bar finishes confidently rather than stalling.
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(eased);
      // Reveal one boot line per chunk of progress.
      setLineIndex(Math.min(BOOT_LINES.length, Math.ceil(eased * BOOT_LINES.length)));
      if (t < 1) raf = requestAnimationFrame(step);
      else setStage("fading");
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [duration]);

  // Stage transitions: fade content → split curtain → unmount.
  useEffect(() => {
    if (stage === "fading") {
      const t = window.setTimeout(() => setStage("splitting"), 320);
      return () => window.clearTimeout(t);
    }
    if (stage === "splitting") {
      const t = window.setTimeout(() => {
        setStage("gone");
        onDone();
      }, 760);
      return () => window.clearTimeout(t);
    }
  }, [stage, onDone]);

  const skip = () => {
    setStage("fading");
  };

  const pct = useMemo(() => Math.round(progress * 100), [progress]);

  return (
    <AnimatePresence>
      {stage !== "gone" && (
        <motion.div
          key="preloader"
          className="pointer-events-auto fixed inset-0 z-[100]"
          aria-hidden="true"
          initial={false}
          exit={{ opacity: 0, transition: { duration: 0.001 } }}
        >
          {/* === Curtain halves (split horizontally on exit) ============ */}
          <motion.div
            className="absolute inset-x-0 top-0 h-1/2 bg-bg"
            initial={{ y: 0 }}
            animate={{ y: stage === "splitting" ? "-100%" : 0 }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <CurtainGrain align="bottom" />
          </motion.div>
          <motion.div
            className="absolute inset-x-0 bottom-0 h-1/2 bg-bg"
            initial={{ y: 0 }}
            animate={{ y: stage === "splitting" ? "100%" : 0 }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <CurtainGrain align="top" />
          </motion.div>

          {/* === Hairline that lives at the seam ======================= */}
          <motion.div
            className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{
              scaleX: stage === "booting" ? 1 : 1,
              opacity: stage === "splitting" ? 0 : 1,
            }}
            transition={{
              scaleX: { duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.15 },
              opacity: { duration: 0.4 },
            }}
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(216,196,163,0.45) 35%, rgba(216,196,163,0.55) 50%, rgba(216,196,163,0.45) 65%, transparent 100%)",
              transformOrigin: "center",
            }}
          />

          {/* === Centered content ====================================== */}
          <motion.div
            className="relative z-10 flex h-full w-full flex-col items-center justify-center px-6"
            animate={{ opacity: stage === "booting" ? 1 : 0 }}
            transition={{ duration: 0.32, ease: "easeOut" }}
          >
            {/* Top label */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="font-mono text-[10.5px] uppercase tracking-[0.32em] text-ink-dim"
            >
              Regulatory · Aware · Intelligence
            </motion.div>

            {/* Mark + wordmark */}
            <div className="mt-5 flex items-center gap-4">
              <ShieldMark />
              <motion.div
                initial={{ opacity: 0, x: -8, filter: "blur(6px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                transition={{ delay: 0.55, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="serif text-[42px] font-medium leading-none tracking-tight text-ink md:text-[58px]"
              >
                Fraud<span className="text-cream">Sentinel</span>
              </motion.div>
            </div>

            {/* Subline */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.95, duration: 0.5 }}
              className="mt-4 max-w-md text-center text-[12.5px] leading-relaxed text-ink-muted"
            >
              An AI audit terminal for Indian SME filings — graph, numerical, and
              multilingual evidence, fused under SEBI XBRL.
            </motion.div>

            {/* Boot log */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.5 }}
              className="mt-9 w-full max-w-md rounded-md border border-line/80 bg-bg-800/60 px-4 py-3 font-mono text-[11px] text-ink-muted shadow-card backdrop-blur"
            >
              <div className="flex items-center gap-2 border-b border-line/60 pb-2">
                <span className="inline-flex gap-1">
                  <span className="h-2 w-2 rounded-full bg-rose/70" />
                  <span className="h-2 w-2 rounded-full bg-amber/70" />
                  <span className="h-2 w-2 rounded-full bg-emerald/80" />
                </span>
                <span className="ml-1 text-[10px] uppercase tracking-[0.2em] text-ink-dim">
                  fraudsentinel · boot
                </span>
                <span className="ml-auto text-[10px] tabular-nums text-ink-dim">
                  {String(pct).padStart(3, "0")}%
                </span>
              </div>
              <ul className="mt-2.5 space-y-1.5">
                {BOOT_LINES.map((line, i) => {
                  const visible = i < lineIndex;
                  const isLast = i === lineIndex - 1;
                  return (
                    <motion.li
                      key={line}
                      initial={false}
                      animate={{ opacity: visible ? 1 : 0.18 }}
                      transition={{ duration: 0.25 }}
                      className="flex items-center gap-2"
                    >
                      <span
                        className={
                          visible
                            ? i < BOOT_LINES.length - 1
                              ? "text-emerald"
                              : "text-cream"
                            : "text-ink-dim"
                        }
                      >
                        {visible && !isLast ? "✓" : visible && isLast ? "›" : "·"}
                      </span>
                      <span className={visible ? "text-ink" : "text-ink-dim"}>
                        {line}
                      </span>
                      {isLast && visible && (
                        <span className="ml-1 inline-block h-3 w-[6px] animate-pulse bg-cream/80" />
                      )}
                    </motion.li>
                  );
                })}
              </ul>

              {/* Progress bar */}
              <div className="mt-3 h-px w-full overflow-hidden bg-line/60">
                <div
                  className="h-px bg-cream"
                  style={{
                    width: `${pct}%`,
                    transition: "width 60ms linear",
                  }}
                />
              </div>
            </motion.div>

            {/* Skip */}
            <button
              type="button"
              onClick={skip}
              className="absolute bottom-6 right-6 font-mono text-[10.5px] uppercase tracking-[0.2em] text-ink-dim transition hover:text-cream"
            >
              skip ›
            </button>
            <div className="absolute bottom-6 left-6 font-mono text-[10.5px] uppercase tracking-[0.2em] text-ink-dim">
              v1.4
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Subtle warm vignette + grain on each curtain half so they don't read as flat black. */
function CurtainGrain({ align }: { align: "top" | "bottom" }) {
  const grad =
    align === "top"
      ? "radial-gradient(60% 80% at 50% 0%, rgba(216,196,163,0.06), transparent 60%)"
      : "radial-gradient(60% 80% at 50% 100%, rgba(216,196,163,0.06), transparent 60%)";
  return (
    <>
      <div className="absolute inset-0" style={{ background: grad }} />
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E\")",
        }}
      />
    </>
  );
}

/** Geometric shield mark drawn with stroke-path-on-mount animation. */
function ShieldMark() {
  return (
    <motion.svg
      width="56"
      height="64"
      viewBox="0 0 56 64"
      fill="none"
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Soft cream halo */}
      <motion.circle
        cx="28"
        cy="32"
        r="22"
        fill="url(#halo)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      />
      <defs>
        <radialGradient id="halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#d8c4a3" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#d8c4a3" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Outer shield */}
      <motion.path
        d="M28 4 L50 12 V30 C50 44 41 54 28 60 C15 54 6 44 6 30 V12 Z"
        stroke="#d8c4a3"
        strokeWidth="1.4"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      />
      {/* Inner shield */}
      <motion.path
        d="M28 12 L42 17 V30 C42 40.5 35.5 48 28 52 C20.5 48 14 40.5 14 30 V17 Z"
        stroke="#d8c4a3"
        strokeOpacity="0.35"
        strokeWidth="1"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.25, duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
      />
      {/* Crosshair */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.5 }}
      >
        <line x1="28" y1="22" x2="28" y2="42" stroke="#d8c4a3" strokeWidth="1" />
        <line x1="18" y1="32" x2="38" y2="32" stroke="#d8c4a3" strokeWidth="1" />
        <circle cx="28" cy="32" r="2.4" fill="#d8c4a3" />
      </motion.g>
    </motion.svg>
  );
}
