import { useEffect, useState } from "react";

export function StatusBar() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const fmt = time.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return (
    <footer className="sticky bottom-0 z-20 border-t border-line bg-bg/80 backdrop-blur-xl">
      <div className="mx-auto flex h-9 w-full max-w-[1240px] items-center gap-5 overflow-x-auto whitespace-nowrap px-5 font-mono text-[11px] text-ink-muted">
        <span className="flex items-center gap-1.5">
          <span className="relative inline-flex h-1.5 w-1.5">
            <span className="absolute inset-0 animate-ping rounded-full bg-emerald opacity-50" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald" />
          </span>
          <span className="uppercase tracking-widest text-emerald">Online</span>
        </span>
        <Divider />
        <span>Inference &lt;1s/report</span>
        <Divider />
        <span>16 GB RAM optimized</span>
        <Divider />
        <span>71-field schema · v1.4</span>
        <span className="ml-auto flex items-center gap-2 text-ink">
          <span className="text-ink-dim uppercase tracking-widest text-[10px]">
            IST
          </span>
          <span className="tabular-nums">{fmt}</span>
        </span>
      </div>
    </footer>
  );
}

function Divider() {
  return <span className="text-line">|</span>;
}
