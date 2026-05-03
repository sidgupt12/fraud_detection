import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { cn } from "../../lib/utils";

interface NavLinkSpec {
  href: string;
  label: string;
}

const LINKS: NavLinkSpec[] = [
  { href: "#how", label: "How it works" },
  { href: "#upload", label: "Analyze" },
  { href: "#schema", label: "Schema" },
  { href: "#about", label: "About" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-bg/75 backdrop-blur-xl">
      <div className="mx-auto flex h-14 w-full max-w-[1240px] items-center justify-between gap-6 px-5">
        <motion.a
          href="#top"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="group flex items-center gap-2"
        >
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-line bg-bg-700 text-cream">
            <ShieldCheck className="h-3.5 w-3.5" />
          </span>
          <span className="font-display text-[15px] font-semibold tracking-tight text-ink">
            FraudSentinel
          </span>
          <span className="hidden font-mono text-[10.5px] text-ink-dim sm:inline">
            v1.4
          </span>
        </motion.a>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-md px-3 py-1.5 text-[13px] text-ink-muted transition-colors hover:text-ink",
              )}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <span className="font-mono text-[11px] text-ink-dim">
            Indian SME Framework
          </span>
        </div>
      </div>
    </header>
  );
}
