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
import { MODELS } from "../../data/chartData";

const data = MODELS.map((m) => ({
  name: m.name,
  f1: m.f1,
  color: m.color,
}));

export function F1Comparison() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 16, right: 16, left: 4, bottom: 4 }}
          barSize={28}
        >
          <CartesianGrid stroke="rgba(148,163,184,0.08)" strokeDasharray="3 4" vertical={false} />
          <XAxis
            dataKey="name"
            stroke="#64748b"
            tick={{ fontSize: 11 }}
            interval={0}
          />
          <YAxis
            stroke="#64748b"
            domain={[0.6, 1]}
            ticks={[0.6, 0.7, 0.8, 0.9, 1]}
            tickFormatter={(v) => v.toFixed(2)}
            tick={{ fontSize: 11 }}
          />
          <Tooltip
            formatter={(v) => Number(v ?? 0).toFixed(2)}
            cursor={{ fill: "rgba(0,229,255,0.06)" }}
          />
          <Bar dataKey="f1" radius={[6, 6, 0, 0]} isAnimationActive animationDuration={1100}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
            <LabelList
              dataKey="f1"
              position="top"
              fill="#cbd5e1"
              fontSize={11}
              fontFamily="JetBrains Mono"
              formatter={(v: unknown) => Number(v).toFixed(2)}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
