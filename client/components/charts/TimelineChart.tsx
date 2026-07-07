"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { Insight } from "@/types/insight";

export default function TimelineChart({
  data,
  onYearSelect,
}: {
  data: Insight[];
  onYearSelect?: (year: string) => void;
}) {
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
    <div className="h-[400px] rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md p-6 shadow-lg shadow-slate-950/20 hover:border-slate-700/80 transition-all duration-300">
      <h2 className="mb-1 text-lg font-semibold">Intelligence Timeline</h2>
      <p className="mb-4 text-xs text-slate-500">Click a data point to filter by year</p>
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart
          data={chartData}
          onClick={(e: any) => {
            const year = e?.activePayload?.[0]?.payload?.year;
            if (year && onYearSelect) onYearSelect(year);
          }}
        >
          <defs>
            <linearGradient id="colorTimeline" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="year" tick={{ fill: "#94a3b8" }} />
          <YAxis tick={{ fill: "#94a3b8" }} />
          <Tooltip
            contentStyle={{
              background: "#0f172a",
              border: "1px solid #334155",
              borderRadius: "8px",
              color: "#f8fafc",
            }}
          />
          <Area
            type="monotone"
            dataKey="insights"
            stroke="#f59e0b"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorTimeline)"
            cursor="pointer"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
