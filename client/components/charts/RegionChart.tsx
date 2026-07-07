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

export default function RegionChart({ data }: { data: Insight[] }) {
  const counts: Record<string, number> = {};

  data.forEach((item) => {
    if (!item.region) return;
    counts[item.region] = (counts[item.region] || 0) + 1;
  });

  const chartData = Object.entries(counts)
    .map(([region, count]) => ({ region, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return (
    <div className="h-[400px] rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="mb-6 text-lg font-semibold">Regional Distribution</h2>

      <ResponsiveContainer width="100%" height="85%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ left: 40, right: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis type="number" tick={{ fill: "#94a3b8" }} />
          <YAxis
            dataKey="region"
            type="category"
            width={120}
            tick={{ fill: "#94a3b8", fontSize: 11 }}
          />
          <Tooltip />
          <Bar dataKey="count" fill="#22c55e" radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
