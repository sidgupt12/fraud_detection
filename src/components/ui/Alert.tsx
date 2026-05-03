import type { ReactNode } from "react";
import { AlertCircle, CheckCircle2, Info, ShieldAlert } from "lucide-react";
import { cn } from "../../lib/utils";

type Tone = "info" | "success" | "warning" | "danger";

const toneMap: Record<
  Tone,
  { ring: string; icon: typeof Info; iconColor: string; bg: string }
> = {
  info: {
    ring: "border-cyan/40",
    icon: Info,
    iconColor: "text-cyan",
    bg: "bg-cyan/5",
  },
  success: {
    ring: "border-emerald/40",
    icon: CheckCircle2,
    iconColor: "text-emerald",
    bg: "bg-emerald/5",
  },
  warning: {
    ring: "border-amber/40",
    icon: AlertCircle,
    iconColor: "text-amber",
    bg: "bg-amber/5",
  },
  danger: {
    ring: "border-rose/40",
    icon: ShieldAlert,
    iconColor: "text-rose",
    bg: "bg-rose/5",
  },
};

interface Props {
  tone?: Tone;
  title?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export function Alert({ tone = "info", title, children, className }: Props) {
  const { ring, icon: Icon, iconColor, bg } = toneMap[tone];
  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-3 rounded-lg border px-3.5 py-3",
        ring,
        bg,
        className,
      )}
    >
      <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", iconColor)} />
      <div className="min-w-0 flex-1">
        {title ? (
          <div className="font-display text-[13px] font-semibold text-ink">
            {title}
          </div>
        ) : null}
        {children ? (
          <div className="text-[12.5px] text-ink-muted">{children}</div>
        ) : null}
      </div>
    </div>
  );
}
