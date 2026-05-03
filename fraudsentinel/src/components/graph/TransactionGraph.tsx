import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  type GraphDataset,
  type GraphEdge,
  type GraphNode,
  NODE_KIND_STYLES,
} from "../../data/graphData";
import { cn } from "../../lib/utils";

interface Props {
  data: GraphDataset;
  width?: number;
  height?: number;
  className?: string;
}

interface PositionedNode extends GraphNode {
  px: number;
  py: number;
}

const EDGE_COLORS: Record<GraphEdge["kind"], string> = {
  normal: "#10b981",
  amber: "#f59e0b",
  suspicious: "#ef4444",
};

export function TransactionGraph({
  data,
  width = 720,
  height = 480,
  className,
}: Props) {
  const positioned = useMemo<PositionedNode[]>(() => {
    return data.nodes.map((n, i) => {
      // If node has explicit x/y in unit space, use it; otherwise distribute on a circle.
      const ux =
        n.x ??
        0.5 + 0.36 * Math.cos((i / data.nodes.length) * Math.PI * 2);
      const uy =
        n.y ??
        0.5 + 0.36 * Math.sin((i / data.nodes.length) * Math.PI * 2);
      return {
        ...n,
        px: ux * width,
        py: uy * height,
      };
    });
  }, [data.nodes, width, height]);

  const byId = useMemo(() => {
    const m = new Map<string, PositionedNode>();
    positioned.forEach((n) => m.set(n.id, n));
    return m;
  }, [positioned]);

  const [hover, setHover] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    node: PositionedNode;
  } | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Continuous "flowing" dash offset for suspicious edges
  const [dashOffset, setDashOffset] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => {
      setDashOffset((v) => (v - 1) % 1000);
    }, 40);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className={cn("relative w-full", className)}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full select-none"
        role="img"
        aria-label="Transaction graph"
      >
        <defs>
          <marker
            id="arrow-normal"
            viewBox="0 0 10 10"
            refX="8.5"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="#10b981" />
          </marker>
          <marker
            id="arrow-amber"
            viewBox="0 0 10 10"
            refX="8.5"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="#f59e0b" />
          </marker>
          <marker
            id="arrow-suspicious"
            viewBox="0 0 10 10"
            refX="8.5"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="#ef4444" />
          </marker>
          <radialGradient id="node-glow-rose" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(239,68,68,0.55)" />
            <stop offset="100%" stopColor="rgba(239,68,68,0)" />
          </radialGradient>
          <radialGradient id="node-glow-cyan" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(0,229,255,0.4)" />
            <stop offset="100%" stopColor="rgba(0,229,255,0)" />
          </radialGradient>
        </defs>

        {/* Faint internal grid */}
        <g opacity="0.18">
          {Array.from({ length: 12 }).map((_, i) => (
            <line
              key={`v${i}`}
              x1={(width / 12) * i}
              y1={0}
              x2={(width / 12) * i}
              y2={height}
              stroke="rgba(148,163,184,0.5)"
              strokeWidth={0.5}
            />
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <line
              key={`h${i}`}
              x1={0}
              y1={(height / 8) * i}
              x2={width}
              y2={(height / 8) * i}
              stroke="rgba(148,163,184,0.5)"
              strokeWidth={0.5}
            />
          ))}
        </g>

        {/* Edges */}
        <g>
          {data.edges.map((e, i) => {
            const a = byId.get(e.source);
            const b = byId.get(e.target);
            if (!a || !b) return null;
            const stroke = EDGE_COLORS[e.kind];
            const isSus = e.kind === "suspicious";
            const isAmber = e.kind === "amber";
            const marker = isSus
              ? "url(#arrow-suspicious)"
              : isAmber
                ? "url(#arrow-amber)"
                : "url(#arrow-normal)";

            // Curve slightly so circular edges are visible
            const dx = b.px - a.px;
            const dy = b.py - a.py;
            const mx = (a.px + b.px) / 2;
            const my = (a.py + b.py) / 2;
            const ortho = { x: -dy, y: dx };
            const len = Math.hypot(ortho.x, ortho.y) || 1;
            const curveAmount = isSus ? 24 : 14;
            const cx = mx + (ortho.x / len) * curveAmount;
            const cy = my + (ortho.y / len) * curveAmount;
            const path = `M ${a.px},${a.py} Q ${cx},${cy} ${b.px},${b.py}`;

            return (
              <g key={i}>
                <motion.path
                  d={path}
                  fill="none"
                  stroke={stroke}
                  strokeWidth={isSus ? 2.2 : 1.5}
                  strokeOpacity={isSus ? 0.95 : 0.85}
                  strokeLinecap="round"
                  strokeDasharray={isSus ? "6 6" : isAmber ? "4 4" : undefined}
                  strokeDashoffset={isSus ? dashOffset : undefined}
                  markerEnd={marker}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{
                    duration: 0.9,
                    delay: 0.05 * i + 0.3,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
                <motion.text
                  x={cx}
                  y={cy - 4}
                  textAnchor="middle"
                  fontSize="10"
                  fontFamily="JetBrains Mono"
                  fill={isSus ? "#fca5a5" : isAmber ? "#fcd34d" : "#cbd5e1"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.05 * i + 0.9 }}
                >
                  {e.amount}
                  {e.label ? ` · ${e.label}` : ""}
                </motion.text>
              </g>
            );
          })}
        </g>

        {/* Nodes */}
        <g>
          {positioned.map((n, i) => {
            const style = NODE_KIND_STYLES[n.kind];
            const isHigh = n.risk >= 0.6;
            const isShell = n.kind === "Shell";
            const isFocus = isHigh || isShell;
            return (
              <g
                key={n.id}
                transform={`translate(${n.px} ${n.py})`}
                onMouseEnter={(e) => {
                  setHover(n.id);
                  const r = svgRef.current?.getBoundingClientRect();
                  if (!r) return;
                  setTooltip({
                    x:
                      ((e.clientX - r.left) / r.width) * width,
                    y:
                      ((e.clientY - r.top) / r.height) * height,
                    node: n,
                  });
                }}
                onMouseMove={(e) => {
                  const r = svgRef.current?.getBoundingClientRect();
                  if (!r) return;
                  setTooltip({
                    x:
                      ((e.clientX - r.left) / r.width) * width,
                    y:
                      ((e.clientY - r.top) / r.height) * height,
                    node: n,
                  });
                }}
                onMouseLeave={() => {
                  setHover(null);
                  setTooltip(null);
                }}
                style={{ cursor: "pointer" }}
              >
                {/* Pulse halo for suspicious */}
                {isFocus && (
                  <motion.circle
                    r={36}
                    fill={isShell ? "url(#node-glow-rose)" : "url(#node-glow-cyan)"}
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{
                      scale: [0.85, 1.15, 0.85],
                      opacity: [0.4, 0.9, 0.4],
                    }}
                    transition={{
                      duration: 2.2,
                      ease: "easeInOut",
                      repeat: Infinity,
                      delay: 0.06 * i,
                    }}
                  />
                )}

                <motion.circle
                  r={hover === n.id ? 24 : 20}
                  fill={style.fill}
                  stroke={style.stroke}
                  strokeWidth={2}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 320,
                    damping: 18,
                    delay: 0.06 * i,
                  }}
                />

                <motion.text
                  textAnchor="middle"
                  dy="0.35em"
                  fontSize="10"
                  fontFamily="JetBrains Mono"
                  fontWeight={600}
                  fill={style.stroke}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.06 * i + 0.2 }}
                >
                  {n.label.length > 11 ? n.label.slice(0, 11) + "…" : n.label}
                </motion.text>

                <motion.text
                  textAnchor="middle"
                  y={36}
                  fontSize="9"
                  fontFamily="JetBrains Mono"
                  fill="#64748b"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.06 * i + 0.3 }}
                >
                  {n.kind} · risk {n.risk.toFixed(2)}
                </motion.text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Tooltip overlay */}
      {tooltip && (
        <div
          className="pointer-events-none absolute z-10 rounded-md border border-cyan/30 bg-bg-800/95 px-2.5 py-2 font-mono text-[11px] shadow-glow backdrop-blur"
          style={{
            left: `${(tooltip.x / width) * 100}%`,
            top: `${(tooltip.y / height) * 100}%`,
            transform: "translate(12px, -120%)",
          }}
        >
          <div className="text-cyan">{tooltip.node.label}</div>
          <div className="text-ink-muted">
            Type: {NODE_KIND_STYLES[tooltip.node.kind].label}
          </div>
          <div className="text-ink-muted">
            Risk: {tooltip.node.risk.toFixed(3)}{" "}
            {tooltip.node.risk >= 0.6 ? "(elevated)" : "(low)"}
          </div>
        </div>
      )}
    </div>
  );
}

export function GraphLegend() {
  return (
    <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] text-ink-muted">
      <LegendDot color="#10b981" label="Normal flow" />
      <LegendDot color="#f59e0b" label="Caution" />
      <LegendDot color="#ef4444" label="Suspicious" />
      <span className="mx-1 h-3 w-px bg-line" />
      <LegendNode stroke="#00e5ff" label="SME" />
      <LegendNode stroke="#94a3b8" label="Vendor" />
      <LegendNode stroke="#ef4444" label="Shell" />
      <LegendNode stroke="#f59e0b" label="NBFC" />
      <LegendNode stroke="#10b981" label="Bank" />
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span
        className="inline-block h-2.5 w-6 rounded-full"
        style={{ backgroundColor: color }}
      />
      {label}
    </span>
  );
}

function LegendNode({ stroke, label }: { stroke: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span
        className="inline-block h-3 w-3 rounded-full bg-bg-800"
        style={{ boxShadow: `inset 0 0 0 2px ${stroke}` }}
      />
      {label}
    </span>
  );
}
