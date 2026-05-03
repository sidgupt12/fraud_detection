import { Cell, Label, Pie, PieChart, ResponsiveContainer } from "recharts";
import { FRAUD_DISTRIBUTION } from "../../data/chartData";

export function FraudDonut() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-baseline justify-between">
        <div>
          <h3 className="font-display text-[14px] font-semibold text-ink">
            Fraud Distribution by Filing Type
          </h3>
          <p className="text-[11.5px] text-ink-muted">
            SEBI 2023–24 reference data · n = 5,300
          </p>
        </div>
      </div>

      <div className="mt-2 grid flex-1 grid-cols-1 items-center gap-3 sm:grid-cols-[1fr_auto]">
        <div className="h-44 min-h-[176px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={FRAUD_DISTRIBUTION}
                dataKey="value"
                innerRadius={48}
                outerRadius={72}
                paddingAngle={3}
                stroke="#0a0f1e"
                strokeWidth={2}
                isAnimationActive
                animationDuration={1100}
              >
                {FRAUD_DISTRIBUTION.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
                <Label
                  position="center"
                  content={({ viewBox }) => {
                    if (
                      !viewBox ||
                      typeof (viewBox as { cx?: number }).cx !== "number"
                    ) {
                      return null;
                    }
                    const { cx, cy } = viewBox as { cx: number; cy: number };
                    return (
                      <g>
                        <text
                          x={cx}
                          y={cy - 6}
                          textAnchor="middle"
                          fontFamily="JetBrains Mono"
                          fontSize="11"
                          fill="#94a3b8"
                        >
                          FRAUD RATE
                        </text>
                        <text
                          x={cx}
                          y={cy + 14}
                          textAnchor="middle"
                          fontFamily="Sora"
                          fontWeight={700}
                          fontSize="20"
                          fill="#00e5ff"
                        >
                          10%
                        </text>
                      </g>
                    );
                  }}
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <ul className="flex flex-col gap-1.5 self-center text-[12px]">
          {FRAUD_DISTRIBUTION.map((d) => (
            <li
              key={d.name}
              className="flex items-center justify-between gap-3"
            >
              <span className="flex items-center gap-2 text-ink">
                <span
                  aria-hidden
                  className="inline-block h-2.5 w-2.5 rounded-sm"
                  style={{ backgroundColor: d.color }}
                />
                {d.name}
              </span>
              <span className="font-mono tabular-nums text-ink-muted">
                {d.value}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
