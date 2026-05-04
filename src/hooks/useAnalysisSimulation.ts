import { useEffect, useRef, useState } from "react";

export interface AnalysisStep {
  id: string;
  title: string;
  subtitle: string;
  durationMs: number;
  /** Console-style lines that print progressively while the step is active. */
  lines: string[];
}

export type StepStatus = "pending" | "active" | "done";

interface Options {
  steps: AnalysisStep[];
  start: boolean;
  onComplete?: () => void;
}

export interface SimulationState {
  currentIndex: number;
  statuses: StepStatus[];
  /** 0..1 progress within the currently active step. */
  stepProgress: number;
  /** Number of console lines that have been "printed" for the current step. */
  printedLines: number;
  totalElapsedMs: number;
  done: boolean;
}

/** Interval for UI updates while the tab is active (background tabs throttle this). */
const TICK_MS = 100;

/**
 * Drives a multi-step analysis animation on the frontend.
 * Uses wall-clock time (performance.now), not requestAnimationFrame, so switching browser
 * tabs does not freeze the run — timers still advance (throttled while hidden, e.g. ~1/s),
 * and we also sync when the tab becomes visible again so state catches up instantly.
 */
export function useAnalysisSimulation({
  steps,
  start,
  onComplete,
}: Options): SimulationState {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stepProgress, setStepProgress] = useState(0);
  const [printedLines, setPrintedLines] = useState(0);
  const [done, setDone] = useState(false);
  const [totalElapsedMs, setTotalElapsedMs] = useState(0);
  const onCompleteRef = useRef(onComplete);
  const completedRef = useRef(false);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!start) return;

    completedRef.current = false;
    setCurrentIndex(0);
    setStepProgress(0);
    setPrintedLines(0);
    setDone(false);
    setTotalElapsedMs(0);

    if (steps.length === 0) {
      setDone(true);
      onCompleteRef.current?.();
      return;
    }

    const simStart = performance.now();

    const sync = () => {
      const now = performance.now();
      let cursor = simStart;

      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        const end = cursor + step.durationMs;
        if (now < end) {
          const elapsed = now - cursor;
          const p = Math.min(1, elapsed / step.durationMs);
          const linesShown = Math.min(
            step.lines.length,
            Math.floor(p * step.lines.length) + (p > 0 ? 1 : 0),
          );
          setCurrentIndex(i);
          setStepProgress(p);
          setPrintedLines(linesShown);
          setTotalElapsedMs(Math.max(0, now - simStart));
          setDone(false);
          return;
        }
        cursor = end;
      }

      if (completedRef.current) return;

      completedRef.current = true;
      const last = steps[steps.length - 1];
      setCurrentIndex(steps.length - 1);
      setStepProgress(1);
      setPrintedLines(last.lines.length);
      setTotalElapsedMs(Math.max(0, now - simStart));
      setDone(true);
      onCompleteRef.current?.();
    };

    sync();
    const intervalId = window.setInterval(sync, TICK_MS);
    const onVis = () => {
      if (document.visibilityState === "visible") sync();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [steps, start]);

  const statuses: StepStatus[] = steps.map((_, i) => {
    if (done || i < currentIndex) return "done";
    if (i === currentIndex) return "active";
    return "pending";
  });

  return {
    currentIndex,
    statuses,
    stepProgress,
    printedLines,
    totalElapsedMs,
    done,
  };
}
