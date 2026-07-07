"use client";

import {
  Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { Insight } from "@/types/insight";

export default function RegionChart({
  data,
  onRegionSelect,
}: {
  data: Insight[];
  onRegionSelect?: (region: string) => void;
}) {
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
    <div className="h-[400px] rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md p-6 shadow-lg shadow-slate-950/20 hover:border-slate-700/80 transition-all duration-300">
      <h2 className="mb-1 text-lg font-semibold">Regional Distribution</h2>
      <p className="mb-4 text-xs text-slate-500">Click a bar to filter by region</p>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ left: 40, right: 20 }}
          onClick={(e) => {
            const name = e?.activePayload?.[0]?.payload?.region;
            if (name && onRegionSelect) onRegionSelect(name);
          }}
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
          <Bar dataKey="count" fill="#22c55e" radius={[0, 6, 6, 0]} cursor="pointer" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
