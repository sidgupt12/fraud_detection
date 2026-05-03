import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

export function Table({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-x-auto rounded-lg border border-line bg-bg-800/40",
        className,
      )}
    >
      <table className="w-full border-collapse text-left font-mono text-[12.5px]">
        {children}
      </table>
    </div>
  );
}

export function THead({ children }: { children: ReactNode }) {
  return (
    <thead className="bg-bg-700/60 text-[11px] uppercase tracking-wider text-ink-muted">
      {children}
    </thead>
  );
}

export function TBody({ children }: { children: ReactNode }) {
  return <tbody>{children}</tbody>;
}

export function TR({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <tr className={cn("border-t border-line/60 hover:bg-cyan/5", className)}>
      {children}
    </tr>
  );
}

export function TH({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <th className={cn("px-4 py-2.5 font-medium text-ink-muted", className)}>
      {children}
    </th>
  );
}

export function TD({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <td className={cn("px-4 py-2.5 text-ink", className)}>{children}</td>
  );
}
