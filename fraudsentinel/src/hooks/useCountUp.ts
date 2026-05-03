import { useEffect, useRef, useState } from "react";

interface Options {
  from?: number;
  to: number;
  duration?: number;
  decimals?: number;
  start?: boolean;
}

/**
 * Smoothly animates a number from `from` to `to` over `duration` ms.
 * Uses `requestAnimationFrame` and an ease-out cubic for a tactile feel.
 */
export function useCountUp({
  from = 0,
  to,
  duration = 1400,
  decimals = 0,
  start = true,
}: Options): number {
  const [value, setValue] = useState<number>(from);
  const startTsRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!start) return;
    startTsRef.current = null;

    const tick = (ts: number) => {
      if (startTsRef.current == null) startTsRef.current = ts;
      const elapsed = ts - startTsRef.current;
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = from + (to - from) * eased;
      const f = Math.pow(10, decimals);
      setValue(Math.round(next * f) / f);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [from, to, duration, decimals, start]);

  return value;
}
