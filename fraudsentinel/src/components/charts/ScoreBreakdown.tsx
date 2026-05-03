import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ScoreBreakdown as ScoreType } from "../../data/reports";

const WEIGHTS = { gnn: 0.4, vae: 0.2, indicBert: 0.3, ml: 0.1 } as const;

interface Props {
  scores: ScoreType;
}

export function ScoreBreakdown({ scores }: Props) {
  const data = [
    {
      name: "GNN",
      raw: scores.gnn,
      weighted: scores.gnn * WEIGHTS.gnn,
      color: "#00e5ff",
    },
    {
      name: "VAE",
      raw: scores.vae,
      weighted: scores.vae * WEIGHTS.vae,
      color: "#10b981",
    },
    {
      name: "IndicBERT",
      raw: scores.indicBert,
      weighted: scores.indicBert * WEIGHTS.indicBert,
      color: "#f59e0b",
    },
    {
      name: "ML Baseline",
      raw: scores.ml,
      weighted: scores.ml * WEIGHTS.ml,
      color: "#8b5cf6",
    },
  ];

  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 18, right: 24, left: 4, bottom: 4 }}
          barSize={36}
          barGap={6}
        >
          <CartesianGrid stroke="rgba(148,163,184,0.08)" strokeDasharray="3 4" vertical={false} />
          <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
          <YAxis
            stroke="#64748b"
            domain={[0, 1]}
            ticks={[0, 0.2, 0.4, 0.6, 0.8, 1]}
            tick={{ fontSize: 11 }}
          />
          <Tooltip
            formatter={(v) => Number(v ?? 0).toFixed(3)}
            cursor={{ fill: "rgba(0,229,255,0.06)" }}
            labelFormatter={(label, payload) => {
              const d = payload?.[0]?.payload as
                | { raw: number; weighted: number }
                | undefined;
              if (!d) return String(label ?? "");
              return `${label} · raw ${d.raw.toFixed(2)} → weighted ${d.weighted.toFixed(3)}`;
            }}
          />
          <Bar
            dataKey="weighted"
            name="Weighted contribution"
            radius={[6, 6, 0, 0]}
            isAnimationActive
            animationDuration={1100}
          >
            {data.map((d, i) => (
              <Cell key={i} fill={d.color} />
            ))}
            <LabelList
              dataKey="weighted"
              position="top"
              fill="#cbd5e1"
              fontSize={11}
              fontFamily="JetBrains Mono"
              formatter={(v: unknown) => Number(v).toFixed(3)}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
