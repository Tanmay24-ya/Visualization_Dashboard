"use client";

import { useMemo } from "react";
import { Insight } from "@/types/insight";

const COLORS = [
  "rgba(99,102,241,",   // indigo
  "rgba(34,197,94,",    // green
  "rgba(245,158,11,",   // amber
  "rgba(6,182,212,",    // cyan
  "rgba(236,72,153,",   // pink
  "rgba(139,92,246,",   // violet
];

export default function HeatmapChart({
  data,
  onTopicSelect,
  onRegionSelect,
}: {
  data: Insight[];
  onTopicSelect?: (t: string) => void;
  onRegionSelect?: (r: string) => void;
}) {
  const { topics, regions, matrix, maxVal } = useMemo(() => {
    const topicCounts: Record<string, number> = {};
    const regionCounts: Record<string, number> = {};
    const matrix: Record<string, Record<string, number>> = {};

    data.forEach((item) => {
      if (!item.topic || !item.region) return;
      topicCounts[item.topic] = (topicCounts[item.topic] || 0) + 1;
      regionCounts[item.region] = (regionCounts[item.region] || 0) + 1;
      if (!matrix[item.region]) matrix[item.region] = {};
      matrix[item.region][item.topic] = (matrix[item.region][item.topic] || 0) + 1;
    });

    const topics = Object.entries(topicCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([t]) => t);

    const regions = Object.entries(regionCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 7)
      .map(([r]) => r);

    const maxVal = Math.max(
      1,
      ...regions.flatMap((r) => topics.map((t) => matrix[r]?.[t] || 0))
    );

    return { topics, regions, matrix, maxVal };
  }, [data]);

  if (!topics.length || !regions.length) {
    return (
      <div className="flex h-[420px] items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-slate-500">
        Not enough data for heatmap
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="mb-1 text-lg font-semibold">Topic × Region Intelligence</h2>
      <p className="mb-5 text-xs text-slate-500">
        Click a cell's topic header or region label to filter
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="pb-3 pr-3 text-left text-slate-500 font-normal w-[130px]">Region ↓ / Topic →</th>
              {topics.map((t, ti) => (
                <th key={t} className="pb-3 px-1 text-center font-medium min-w-[70px]">
                  <button
                    onClick={() => onTopicSelect?.(t)}
                    className="text-slate-300 hover:text-indigo-400 transition-colors"
                    title={t}
                  >
                    {t.length > 10 ? t.slice(0, 10) + "…" : t}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {regions.map((r, ri) => (
              <tr key={r}>
                <td className="py-1 pr-3">
                  <button
                    onClick={() => onRegionSelect?.(r)}
                    className="text-left text-slate-300 hover:text-green-400 transition-colors"
                    title={r}
                  >
                    {r.length > 18 ? r.slice(0, 18) + "…" : r}
                  </button>
                </td>
                {topics.map((t, ti) => {
                  const val = matrix[r]?.[t] || 0;
                  const intensity = val / maxVal;
                  const colorBase = COLORS[ti % COLORS.length];
                  return (
                    <td key={t} className="py-1 px-1">
                      <div
                        className="flex h-8 items-center justify-center rounded text-center font-medium transition-transform hover:scale-110 cursor-default"
                        style={{
                          background: val > 0 ? `${colorBase}${Math.max(0.08, intensity)})` : "var(--slate-900)",
                          color: intensity > 0.5 ? "#fff" : "var(--slate-200)",
                          border: val > 0 ? `1px solid ${colorBase}0.3)` : "1px solid transparent",
                        }}
                        title={`${r} × ${t}: ${val}`}
                      >
                        {val || ""}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
        <span>Low</span>
        <div className="flex gap-0.5">
          {[0.1, 0.25, 0.45, 0.65, 0.85, 1].map((o) => (
            <div
              key={o}
              className="h-3 w-5 rounded-sm"
              style={{ background: `rgba(99,102,241,${o})` }}
            />
          ))}
        </div>
        <span>High</span>
      </div>
    </div>
  );
}
