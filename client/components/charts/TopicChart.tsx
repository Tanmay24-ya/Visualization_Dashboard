"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";
import { Insight } from "@/types/insight";

export default function TopicChart({
  data,
  onTopicSelect,
}: {
  data: Insight[];
  onTopicSelect?: (topic: string) => void;
}) {
  const topicMap: Record<string, { total: number; count: number }> = {};
  data.forEach((item) => {
    if (!item.topic) return;
    if (!topicMap[item.topic]) topicMap[item.topic] = { total: 0, count: 0 };
    topicMap[item.topic].total += item.intensity || 0;
    topicMap[item.topic].count += 1;
  });

  const chartData = Object.entries(topicMap)
    .map(([topic, v]) => ({ topic, intensity: v.total / v.count }))
    .sort((a, b) => b.intensity - a.intensity)
    .slice(0, 10);

  return (
    <div className="h-[400px] rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md p-6 shadow-lg shadow-slate-950/20 hover:border-slate-700/80 transition-all duration-300">
      <h2 className="mb-1 text-lg font-semibold">Intensity by Topic</h2>
      <p className="mb-4 text-xs text-slate-500">Click a bar to filter by topic</p>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart
          data={chartData}
          onClick={(e: any) => {
            const name = e?.activePayload?.[0]?.payload?.topic;
            if (name && onTopicSelect) onTopicSelect(name);
          }}
        >
          <XAxis dataKey="topic" tick={{ fill: "#94a3b8", fontSize: 10 }} />
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
          <Bar dataKey="intensity" fill="#6366f1" radius={[6, 6, 0, 0]} cursor="pointer" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
