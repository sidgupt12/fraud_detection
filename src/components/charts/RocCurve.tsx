import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { MODELS, ROC_DATA } from "../../data/chartData";

export function RocCurve() {
  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={ROC_DATA}
          margin={{ top: 10, right: 24, left: 4, bottom: 4 }}
        >
          <CartesianGrid stroke="rgba(148,163,184,0.08)" strokeDasharray="3 4" />
          <XAxis
            dataKey="fpr"
            type="number"
            domain={[0, 1]}
            ticks={[0, 0.2, 0.4, 0.6, 0.8, 1]}
            tickFormatter={(v) => v.toFixed(1)}
            stroke="#64748b"
            label={{
              value: "False Positive Rate",
              position: "insideBottom",
              offset: -2,
              fill: "#94a3b8",
              fontSize: 11,
              fontFamily: "JetBrains Mono",
            }}
          />
          <YAxis
            domain={[0, 1]}
            ticks={[0, 0.2, 0.4, 0.6, 0.8, 1]}
            tickFormatter={(v) => v.toFixed(1)}
            stroke="#64748b"
            label={{
              value: "True Positive Rate",
              angle: -90,
              position: "insideLeft",
              offset: 16,
              fill: "#94a3b8",
              fontSize: 11,
              fontFamily: "JetBrains Mono",
            }}
          />
          <Tooltip
            cursor={{ stroke: "rgba(0,229,255,0.3)" }}
            formatter={(v) => Number(v ?? 0).toFixed(3)}
            labelFormatter={(v) => `FPR ${Number(v ?? 0).toFixed(2)}`}
          />
          <Legend
            verticalAlign="top"
            align="right"
            wrapperStyle={{ fontSize: 11, paddingBottom: 4 }}
            iconType="plainline"
          />
          <ReferenceLine
            segment={[
              { x: 0, y: 0 },
              { x: 1, y: 1 },
            ]}
            stroke="rgba(148,163,184,0.4)"
            strokeDasharray="4 4"
            ifOverflow="extendDomain"
          />
          {MODELS.map((m) => (
            <Line
              key={m.key}
              dataKey={m.key}
              name={`${m.name} · AUC ${m.auc.toFixed(2)}`}
              stroke={m.color}
              strokeWidth={m.key === "ours" ? 2.6 : 1.6}
              dot={false}
              activeDot={{ r: 4, fill: m.color, stroke: "#0a0f1e" }}
              isAnimationActive
              animationDuration={1300}
              type="monotone"
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
