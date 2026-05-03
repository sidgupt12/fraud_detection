import { useEffect, useState } from "react";

interface Options {
  lines: readonly string[];
  charDelay?: number;
  lineDelay?: number;
  startDelay?: number;
  loop?: boolean;
}

/**
 * Types each line out one character at a time. After all lines complete,
 * stays on the final state (or, if `loop`, restarts from the top).
 */
export function useTypewriter({
  lines,
  charDelay = 18,
  lineDelay = 220,
  startDelay = 200,
  loop = false,
}: Options): { rendered: string[]; done: boolean } {
  const [rendered, setRendered] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const out: string[] = [];

    async function run() {
      await new Promise((r) => setTimeout(r, startDelay));
      while (!cancelled) {
        for (let i = 0; i < lines.length; i++) {
          if (cancelled) return;
          const line = lines[i];
          out[i] = "";
          setRendered([...out]);
          for (let c = 0; c < line.length; c++) {
            if (cancelled) return;
            out[i] = line.slice(0, c + 1);
            setRendered([...out]);
            await new Promise((r) => setTimeout(r, charDelay));
          }
          await new Promise((r) => setTimeout(r, lineDelay));
        }
        setDone(true);
        if (!loop) return;
        out.length = 0;
        setRendered([]);
        setDone(false);
        await new Promise((r) => setTimeout(r, 1500));
      }
    }
    run();

    return () => {
      cancelled = true;
    };
  }, [lines, charDelay, lineDelay, startDelay, loop]);

  return { rendered, done };
}
