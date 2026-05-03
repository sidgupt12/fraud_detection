import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { About } from "../home/About";
import { Hero } from "../home/Hero";
import { HowItWorks } from "../home/HowItWorks";
import { ReportPage } from "../home/ReportPage";
import { SchemaSection } from "../home/SchemaSection";
import { UploadSection } from "../home/UploadSection";
import { AnalysisOverlay } from "../analysis/AnalysisOverlay";
import { REPORTS, type FraudReport } from "../../data/reports";

const REPORT_PATH_RE = /^\/?report\/(.+)$/;
const REPORT_HASH_RE = /^#?\/?report\/(.+)$/;

function parseReportFromLocation(): FraudReport | null {
  if (typeof window === "undefined") return null;
  const path = window.location.pathname.replace(/\/+$/, "");
  const m = path.match(REPORT_PATH_RE);
  if (m) {
    const r = REPORTS.find((r) => r.id === m[1]);
    if (r) return r;
  }
  const hash = window.location.hash || "";
  const hm = hash.match(REPORT_HASH_RE);
  if (hm) {
    const r = REPORTS.find((r) => r.id === hm[1]);
    if (r) return r;
  }
  return null;
}

export function Home() {
  const [analyzing, setAnalyzing] = useState<FraudReport | null>(null);
  const [active, setActive] = useState<FraudReport | null>(() =>
    parseReportFromLocation(),
  );

  // Sync state with browser history (Back / Forward / direct URL).
  useEffect(() => {
    const onPop = () => {
      setActive(parseReportFromLocation());
    };
    window.addEventListener("popstate", onPop);
    window.addEventListener("hashchange", onPop);
    return () => {
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("hashchange", onPop);
    };
  }, []);

  // Always start at the top when switching between landing and report views.
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [active]);

  const goHome = () => {
    if (typeof window !== "undefined") {
      try {
        window.history.pushState({}, "", "/");
      } catch {
        window.location.hash = "";
      }
    }
    setActive(null);
  };

  const goToReport = (r: FraudReport) => {
    if (typeof window !== "undefined") {
      try {
        window.history.pushState({ reportId: r.id }, "", `/report/${r.id}`);
      } catch {
        window.location.hash = `#/report/${r.id}`;
      }
    }
    setActive(r);
  };

  const onPick = (r: FraudReport) => {
    setAnalyzing(r);
  };

  const onAnalysisComplete = (r: FraudReport) => {
    goToReport(r);
    setAnalyzing(null);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {active ? (
          <motion.div
            key={`report-${active.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <ReportPage report={active} onBack={goHome} />
          </motion.div>
        ) : (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-24"
            id="top"
          >
            <Hero />
            <HowItWorks />
            <UploadSection onPick={onPick} activeId={null} />
            <SchemaSection />
            <About />
          </motion.div>
        )}
      </AnimatePresence>

      <AnalysisOverlay
        report={analyzing}
        onClose={() => setAnalyzing(null)}
        onComplete={onAnalysisComplete}
      />
    </>
  );
}
