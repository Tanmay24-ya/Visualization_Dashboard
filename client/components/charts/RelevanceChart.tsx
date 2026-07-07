"use client";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { Insight } from "@/types/insight";

export default function RelevanceChart({ data }: { data: Insight[] }) {
  const chartData = data
    .filter((item) => item.likelihood && item.relevance && item.intensity)
    .map((item) => ({
      likelihood: item.likelihood,
      relevance: item.relevance,
      intensity: item.intensity,
      topic: item.topic,
    }));

  return (
    <div className="h-[400px] rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="mb-6 text-lg font-semibold">Likelihood vs Relevance</h2>
      <ResponsiveContainer width="100%" height="85%">
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis
            type="number"
            dataKey="likelihood"
            name="Likelihood"
            tick={{ fill: "#94a3b8" }}
          />
          <YAxis
            type="number"
            dataKey="relevance"
            name="Relevance"
            tick={{ fill: "#94a3b8" }}
          />
          <ZAxis
            type="number"
            dataKey="intensity"
            range={[50, 500]}
            name="Intensity"
          />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          <Scatter name="Insights" data={chartData} fill="#06b6d4" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
