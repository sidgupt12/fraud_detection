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

/**
 * Drives a multi-step analysis animation entirely on the frontend.
 * Each step animates a progress bar from 0 → 1 over its `durationMs`,
 * progressively reveals its console lines, then advances to the next step.
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
  const stepStartRef = useRef<number | null>(null);
  const startTsRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!start) return;
    setCurrentIndex(0);
    setStepProgress(0);
    setPrintedLines(0);
    setDone(false);
    setTotalElapsedMs(0);
    stepStartRef.current = null;
    startTsRef.current = null;

    let idx = 0;

    const tick = (ts: number) => {
      if (startTsRef.current == null) startTsRef.current = ts;
      if (stepStartRef.current == null) stepStartRef.current = ts;

      const step = steps[idx];
      if (!step) return;
      const elapsed = ts - stepStartRef.current;
      const total = ts - startTsRef.current;
      const p = Math.min(1, elapsed / step.durationMs);

      setStepProgress(p);
      setTotalElapsedMs(total);

      const linesShown = Math.min(
        step.lines.length,
        Math.floor(p * step.lines.length) + (p > 0 ? 1 : 0),
      );
      setPrintedLines(linesShown);

      if (p >= 1) {
        const next = idx + 1;
        if (next < steps.length) {
          idx = next;
          setCurrentIndex(next);
          stepStartRef.current = ts;
          setStepProgress(0);
          setPrintedLines(0);
          rafRef.current = requestAnimationFrame(tick);
        } else {
          setDone(true);
          onCompleteRef.current?.();
        }
      } else {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
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
