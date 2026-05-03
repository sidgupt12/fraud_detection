import clsx, { type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]): string {
  return clsx(...inputs);
}

/** Format a number as Indian Rupees (₹) using the lakh/crore grouping. */
export function formatINR(amount: number): string {
  const sign = amount < 0 ? "-" : "";
  const abs = Math.abs(Math.round(amount));
  const str = abs.toString();
  if (str.length <= 3) return `${sign}₹${str}`;
  const last3 = str.slice(-3);
  const rest = str.slice(0, -3);
  const formattedRest = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return `${sign}₹${formattedRest},${last3}`;
}

/** Round a number to a fixed number of decimals. */
export function round(value: number, decimals = 2): number {
  const f = Math.pow(10, decimals);
  return Math.round(value * f) / f;
}

/** Pad a number to two digits. */
export function pad2(n: number): string {
  return n.toString().padStart(2, "0");
}

export function nowHHMMSS(): string {
  const d = new Date();
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
}

export type Severity = "HIGH" | "MEDIUM" | "LOW" | "INFO";

export const severityStyles: Record<
  Severity,
  { badge: string; ring: string; dot: string; label: string }
> = {
  HIGH: {
    badge: "bg-rose/10 text-rose border-rose/40",
    ring: "ring-rose/30",
    dot: "bg-rose",
    label: "HIGH",
  },
  MEDIUM: {
    badge: "bg-amber/10 text-amber border-amber/40",
    ring: "ring-amber/30",
    dot: "bg-amber",
    label: "MEDIUM",
  },
  LOW: {
    badge: "bg-emerald/10 text-emerald border-emerald/40",
    ring: "ring-emerald/30",
    dot: "bg-emerald",
    label: "LOW",
  },
  INFO: {
    badge: "bg-cyan/10 text-cyan border-cyan/40",
    ring: "ring-cyan/30",
    dot: "bg-cyan",
    label: "INFO",
  },
};

export type VerdictLabel = "ESCALATE" | "REVIEW" | "CLEAR";

/**
 * Map a 0..1 quarter-aggregated risk score onto a verdict colour scheme.
 * Thresholds are tuned for the cross-quarter range of average anomaly
 * scores (≈0.18–0.27) so the gauge actually moves.
 */
export function scoreColor(score: number): {
  text: string;
  bg: string;
  ring: string;
  label: VerdictLabel;
  hex: string;
} {
  if (score >= 0.225) {
    return {
      text: "text-rose",
      bg: "bg-rose",
      ring: "ring-rose/40",
      label: "ESCALATE",
      hex: "#d9695a",
    };
  }
  if (score >= 0.2) {
    return {
      text: "text-amber",
      bg: "bg-amber",
      ring: "ring-amber/40",
      label: "REVIEW",
      hex: "#e0a050",
    };
  }
  return {
    text: "text-emerald",
    bg: "bg-emerald",
    ring: "ring-emerald/40",
    label: "CLEAR",
    hex: "#7eb27e",
  };
}

export function verdictColor(verdict: VerdictLabel): {
  text: string;
  bg: string;
  ringSoft: string;
  hex: string;
} {
  if (verdict === "ESCALATE") {
    return {
      text: "text-rose",
      bg: "bg-rose",
      ringSoft: "border-rose/30",
      hex: "#d9695a",
    };
  }
  if (verdict === "REVIEW") {
    return {
      text: "text-amber",
      bg: "bg-amber",
      ringSoft: "border-amber/30",
      hex: "#e0a050",
    };
  }
  return {
    text: "text-emerald",
    bg: "bg-emerald",
    ringSoft: "border-emerald/30",
    hex: "#7eb27e",
  };
}
