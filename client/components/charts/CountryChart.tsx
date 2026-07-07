"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Insight } from "@/types/insight";

export default function CountryChart({
  data,
  onCountrySelect,
}: {
  data: Insight[];
  onCountrySelect?: (country: string) => void;
}) {
  const counts: Record<string, number> = {};
  data.forEach((item) => {
    if (!item.country) return;
    counts[item.country] = (counts[item.country] || 0) + 1;
  });

  const chartData = Object.entries(counts)
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return (
    <div className="h-[400px] rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md p-6 shadow-lg shadow-slate-950/20 hover:border-slate-700/80 transition-all duration-300">
      <h2 className="mb-1 text-lg font-semibold">Top Countries</h2>
      <p className="mb-4 text-xs text-slate-500">Click a bar to filter by country</p>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ left: 20, right: 20 }}
          onClick={(e: any) => {
            const name = e?.activePayload?.[0]?.payload?.country;
            if (name && onCountrySelect) onCountrySelect(name);
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis type="number" tick={{ fill: "#94a3b8" }} />
          <YAxis
            dataKey="country"
            type="category"
            width={150}
            tick={{ fill: "#94a3b8", fontSize: 11 }}
          />
          <Tooltip
            contentStyle={{
              background: "#0f172a",
              border: "1px solid #334155",
              borderRadius: "8px",
              color: "#f8fafc",
            }}
            cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
          />
          <Bar
            dataKey="count"
            fill="#ec4899"
            radius={[0, 6, 6, 0]}
            cursor="pointer"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
