"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { Insight } from "@/types/insight";

export default function TimelineChart({ data }: { data: Insight[] }) {
  const yearCounts: Record<string, number> = {};

  data.forEach((item) => {
    if (!item.published) return;
    const match = item.published.match(/\d{4}/);
    if (!match) return;
    const year = match[0];
    yearCounts[year] = (yearCounts[year] || 0) + 1;
  });

  const chartData = Object.entries(yearCounts)
    .map(([year, insights]) => ({ year, insights }))
    .sort((a, b) => Number(a.year) - Number(b.year));

  return (
    <div className="h-[400px] rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="mb-6 text-lg font-semibold">Insights Timeline</h2>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="year" tick={{ fill: "#94a3b8" }} />
          <YAxis tick={{ fill: "#94a3b8" }} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="insights"
            stroke="#f59e0b"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
