"use client";

import { Insight } from "@/types/insight";

const FIELDS: { key: keyof Insight; label: string }[] = [
  { key: "country",  label: "Country"  },
  { key: "region",   label: "Region"   },
  { key: "sector",   label: "Sector"   },
  { key: "topic",    label: "Topic"    },
  { key: "end_year", label: "End Year" },
  { key: "impact",   label: "Impact"   },
];

const COLORS = [
  "#6366f1",
  "#22c55e",
  "#f59e0b",
  "#ec4899",
  "#06b6d4",
  "#8b5cf6",
];

export default function DataCoverage({ data }: { data: Insight[] }) {
  if (!data.length) return null;

  const coverages = FIELDS.map(({ key, label }) => {
    const filled = data.filter((d) => {
      const v = d[key];
      return v !== "" && v !== null && v !== undefined && v !== 0;
    }).length;
    return { label, pct: Math.round((filled / data.length) * 100) };
  });

  return (
    <div className="h-[400px] rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="mb-1 text-lg font-semibold">Data Coverage</h2>
      <p className="mb-5 text-xs text-slate-500">Field completeness in current dataset</p>
      <div className="flex flex-col gap-4 overflow-y-auto" style={{ maxHeight: "300px" }}>
        {coverages.map(({ label, pct }, i) => (
          <div key={label}>
            <div className="mb-1 flex justify-between text-xs">
              <span className="text-slate-300">{label}</span>
              <span className="font-medium" style={{ color: COLORS[i % COLORS.length] }}>
                {pct}%
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${pct}%`,
                  background: COLORS[i % COLORS.length],
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
