"use client";

import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Insight } from "@/types/insight";

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ec4899", "#06b6d4", "#8b5cf6", "#ef4444"];

export default function SectorChart({
  data,
  onSectorSelect,
}: {
  data: Insight[];
  onSectorSelect?: (sector: string) => void;
}) {
  const counts: Record<string, number> = {};
  data.forEach((item) => {
    if (!item.sector) return;
    counts[item.sector] = (counts[item.sector] || 0) + 1;
  });

  const chartData = Object.entries(counts)
    .map(([sector, value]) => ({ name: sector, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 7);

  return (
    <div className="h-[400px] rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md p-6 shadow-lg shadow-slate-950/20 hover:border-slate-700/80 transition-all duration-300">
      <h2 className="mb-1 text-lg font-semibold">Sector Distribution</h2>
      <p className="mb-2 text-xs text-slate-500">Click a slice to filter by sector</p>
      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={3}
            cursor="pointer"
            onClick={(entry) => onSectorSelect?.(entry.name)}
          >
            {chartData.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
