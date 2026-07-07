"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Insight } from "@/types/insight";

export default function PestleChart({
  data,
  onPestleSelect,
}: {
  data: Insight[];
  onPestleSelect?: (pestle: string) => void;
}) {
  const counts: Record<string, number> = {};
  data.forEach((item) => {
    if (!item.pestle) return;
    counts[item.pestle] = (counts[item.pestle] || 0) + 1;
  });

  const chartData = Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="h-[400px] rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md p-6 shadow-lg shadow-slate-950/20 hover:border-slate-700/80 transition-all duration-300">
      <h2 className="mb-1 text-lg font-semibold">PESTLE Distribution</h2>
      <p className="mb-4 text-xs text-slate-500">Click a bar to filter by PESTLE</p>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart
          data={chartData}
          onClick={(e: any) => {
            const name = e?.activePayload?.[0]?.payload?.name;
            if (name && onPestleSelect) onPestleSelect(name);
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} />
          <YAxis tick={{ fill: "#94a3b8" }} />
          <Tooltip
            contentStyle={{
              background: "#0f172a",
              border: "1px solid #334155",
              borderRadius: "8px",
              color: "#f8fafc",
            }}
            cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
          />
          <Bar dataKey="count" fill="#8b5cf6" radius={[6, 6, 0, 0]} cursor="pointer" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
