import { AnimatePresence, motion } from "framer-motion";
import {
  type ReactNode,
  useId,
  useState,
} from "react";
import { cn } from "../../lib/utils";

interface Props {
  content: ReactNode;
  children: ReactNode;
  side?: "top" | "bottom";
  className?: string;
}

export function Tooltip({ content, children, side = "top", className }: Props) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      aria-describedby={open ? id : undefined}
    >
      {children}
      <AnimatePresence>
        {open && (
          <motion.span
            id={id}
            role="tooltip"
            initial={{ opacity: 0, y: side === "top" ? 4 : -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: side === "top" ? 4 : -4 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "pointer-events-none absolute z-40 max-w-[260px] rounded-md border border-cyan/30 bg-bg-800/95 px-2.5 py-1.5 font-mono text-[11px] leading-snug text-ink shadow-glow backdrop-blur",
              side === "top"
                ? "bottom-full left-1/2 mb-2 -translate-x-1/2"
                : "top-full left-1/2 mt-2 -translate-x-1/2",
              className,
            )}
          >
            {content}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
