import { motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef, type ReactNode } from "react";
import { cn } from "../../lib/utils";

interface CardProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  glow?: boolean;
  interactive?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, glow = false, interactive = false, children, ...rest },
  ref,
) {
  return (
    <motion.div
      ref={ref}
      whileHover={
        interactive
          ? { y: -2, boxShadow: "0 0 24px rgba(0, 229, 255, 0.18)" }
          : undefined
      }
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className={cn(
        "relative rounded-xl border border-line bg-surface/55 backdrop-blur-md shadow-card",
        glow && "shadow-glow border-cyan/30",
        className,
      )}
      {...rest}
    >
      {children}
    </motion.div>
  );
});

export function CardHeader({
  title,
  subtitle,
  right,
  className,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  right?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 border-b border-line/60 px-5 py-4",
        className,
      )}
    >
      <div className="min-w-0">
        <h3 className="font-display text-[15px] font-semibold tracking-tight text-ink">
          {title}
        </h3>
        {subtitle ? (
          <p className="mt-0.5 text-[12px] text-ink-muted">{subtitle}</p>
        ) : null}
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );
}

export function CardBody({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("px-5 py-4", className)}>{children}</div>;
}
