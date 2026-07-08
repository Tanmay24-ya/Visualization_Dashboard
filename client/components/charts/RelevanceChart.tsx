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

export default function RelevanceChart({
  data,
  onTopicSelect,
}: {
  data: Insight[];
  onTopicSelect?: (topic: string) => void;
}) {
  const chartData = data
    .filter((item) => item.likelihood && item.relevance && item.intensity)
    .map((item) => ({
      likelihood: item.likelihood,
      relevance: item.relevance,
      intensity: item.intensity,
      topic: item.topic,
    }));

  return (
    <div className="h-[400px] rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md p-6 shadow-lg shadow-slate-950/20 hover:border-slate-700/80 transition-all duration-300">
      <h2 className="mb-1 text-lg font-semibold">Likelihood vs Relevance</h2>
      <p className="mb-4 text-xs text-slate-500">Click a bubble to filter by its topic</p>
      <ResponsiveContainer width="100%" height="85%">
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--recharts-grid)" />
          <XAxis
            type="number"
            dataKey="likelihood"
            name="Likelihood"
            tick={{ fill: "#94a3b8" }}
            domain={["auto", "auto"]}
          />
          <YAxis
            type="number"
            dataKey="relevance"
            name="Relevance"
            tick={{ fill: "#94a3b8" }}
            domain={["auto", "auto"]}
          />
          <ZAxis
            type="number"
            dataKey="intensity"
            range={[50, 450]}
            name="Intensity"
          />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            contentStyle={{
              background: "var(--recharts-tooltip-bg)",
              border: "1px solid var(--recharts-tooltip-border)",
              borderRadius: "8px",
              color: "var(--recharts-tooltip-text)",
            }}
          />
          <Scatter
            name="Insights"
            data={chartData}
            fill="#06b6d4"
            cursor="pointer"
            onClick={(entry: any) => {
              if (entry.topic && onTopicSelect) {
                onTopicSelect(entry.topic);
              }
            }}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
