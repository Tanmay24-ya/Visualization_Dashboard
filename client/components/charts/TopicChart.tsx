"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { Insight } from "@/types/insight";

export default function TopicChart({
  data,
}: {
  data: Insight[];
}) {
  const topicMap: Record<string, { total: number; count: number }> = {};

  data.forEach((item) => {
    if (!item.topic) return;
    if (!topicMap[item.topic]) {
      topicMap[item.topic] = { total: 0, count: 0 };
    }
    topicMap[item.topic].total += item.intensity || 0;
    topicMap[item.topic].count += 1;
  });

  const chartData = Object.entries(topicMap)
    .map(([topic, values]) => ({
      topic,
      intensity: values.total / values.count,
    }))
    .sort((a, b) => b.intensity - a.intensity)
    .slice(0, 10);

  return (
    <div className="h-[400px] rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="mb-6 text-lg font-semibold">Intensity by Topic</h2>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={chartData}>
          <XAxis dataKey="topic" tick={{ fill: "#94a3b8" }} />
          <YAxis tick={{ fill: "#94a3b8" }} />
          <Tooltip />
          <Bar dataKey="intensity" fill="#6366f1" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
