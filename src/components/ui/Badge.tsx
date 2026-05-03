import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

type Tone =
  | "default"
  | "cyan"
  | "amber"
  | "emerald"
  | "rose"
  | "violet"
  | "muted";

const toneStyles: Record<Tone, string> = {
  default: "bg-bg-800/80 text-ink border-line",
  cyan: "bg-cyan/10 text-cyan border-cyan/40",
  amber: "bg-amber/10 text-amber border-amber/40",
  emerald: "bg-emerald/10 text-emerald border-emerald/40",
  rose: "bg-rose/10 text-rose border-rose/40",
  violet: "bg-violet-500/10 text-[#c4b5fd] border-violet-500/40",
  muted: "bg-bg-800/60 text-ink-muted border-line",
};

interface Props {
  children: ReactNode;
  tone?: Tone;
  size?: "xs" | "sm";
  className?: string;
  pulse?: boolean;
  uppercase?: boolean;
}

export function Badge({
  children,
  tone = "default",
  size = "sm",
  className,
  pulse,
  uppercase = true,
}: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border font-mono tracking-wider",
        uppercase && "uppercase",
        size === "xs"
          ? "px-1.5 py-0.5 text-[10px]"
          : "px-2 py-0.5 text-[11px]",
        toneStyles[tone],
        className,
      )}
    >
      {pulse ? (
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inset-0 animate-ping rounded-full bg-current opacity-50" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
        </span>
      ) : null}
      {children}
    </span>
  );
}
