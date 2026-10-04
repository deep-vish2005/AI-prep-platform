import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useMemo, useState } from "react";

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-lg border border-line bg-surface px-3 py-2 shadow-lg">
      <p className="text-xs font-medium text-muted">{label}</p>
      <p className="mt-1 text-sm font-bold text-brand-700">
        {payload[0].value}/10
      </p>
    </div>
  );
}

function PerformanceChart({ data = [] }) {
  const [period, setPeriod] = useState("6-sessions");

  const filteredData = useMemo(() => {
    if (period === "all") {
      return data;
    }

    if (period === "6-sessions") {
      return data.slice(-6);
    }

    const numberOfDays = period === "30-days" ? 30 : 90;
    const cutoff = new Date();

    cutoff.setDate(cutoff.getDate() - numberOfDays);

    return data.filter((item) => {
      if (!item.date) {
        return true;
      }

      return new Date(item.date) >= cutoff;
    });
  }, [data, period]);
  return (
    <section className="rounded-xl border border-line bg-surface p-5 shadow-sm lg:p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-semibold text-ink">
            Interview Score Progression
          </h2>
          <p className="mt-1 text-sm text-muted">
            Your average performance across recent sessions
          </p>
        </div>

        <select
          aria-label="Chart period"
          value={period}
          onChange={(event) => setPeriod(event.target.value)}
          className="h-9 rounded-lg border border-line bg-surface px-3 text-sm text-slate-600 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
        >
          <option value="6-sessions">Last 6 sessions</option>
          <option value="30-days">Last 30 days</option>
          <option value="3-months">Last 3 months</option>
          <option value="all">All sessions</option>
        </select>
      </div>

      {filteredData.length === 0 && (
        <div className="mt-6 flex h-72 items-center justify-center rounded-lg border border-dashed border-line bg-slate-50">
          <p className="text-sm font-medium text-muted">
            No completed interviews in this period.
          </p>
        </div>
      )}

      <div
        className={[
          "mt-6 h-72 w-full",
          filteredData.length === 0 ? "hidden" : "",
        ].join(" ")}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={filteredData}
            margin={{ top: 10, right: 15, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              vertical={false}
              stroke="#e2e8f0"
              strokeDasharray="4 4"
            />

            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 12 }}
              dy={10}
            />

            <YAxis
              domain={[0, 10]}
              ticks={[0, 2, 4, 6, 8, 10]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 12 }}
            />

            <Tooltip content={<ChartTooltip />} cursor={false} />

            <Line
              type="monotone"
              dataKey="score"
              stroke="#2563eb"
              strokeWidth={3}
              dot={{
                fill: "#ffffff",
                stroke: "#2563eb",
                strokeWidth: 2,
                r: 4,
              }}
              activeDot={{
                fill: "#2563eb",
                stroke: "#ffffff",
                strokeWidth: 3,
                r: 6,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default PerformanceChart;
