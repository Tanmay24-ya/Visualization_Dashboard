"use client";

import { useMemo } from "react";
import { Insight } from "@/types/insight";
import { X, Calendar, MapPin, Award, Activity, ExternalLink } from "lucide-react";

interface DrillDownDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  type: "sector" | "topic" | "region" | "country" | "pestle" | "";
  value: string;
  allData: Insight[];
}

export default function DrillDownDrawer({
  isOpen,
  onClose,
  type,
  value,
  allData,
}: DrillDownDrawerProps) {
  const details = useMemo(() => {
    if (!isOpen || !type || !value) return null;

    // Filter data for this item
    const filtered = allData.filter((item) => {
      if (type === "sector") return item.sector === value;
      if (type === "topic") return item.topic === value;
      if (type === "region") return item.region === value;
      if (type === "country") return item.country === value;
      if (type === "pestle") return item.pestle === value;
      return false;
    });

    const total = filtered.length;
    const avgIntensity = total 
      ? filtered.reduce((s, i) => s + (i.intensity || 0), 0) / total 
      : 0;
    const avgLikelihood = total 
      ? filtered.reduce((s, i) => s + (i.likelihood || 0), 0) / total 
      : 0;
    const avgRelevance = total 
      ? filtered.reduce((s, i) => s + (i.relevance || 0), 0) / total 
      : 0;

    // Get distribution of other fields
    const topics: Record<string, number> = {};
    const regions: Record<string, number> = {};
    const sectors: Record<string, number> = {};

    filtered.forEach((item) => {
      if (item.topic) topics[item.topic] = (topics[item.topic] || 0) + 1;
      if (item.region) regions[item.region] = (regions[item.region] || 0) + 1;
      if (item.sector) sectors[item.sector] = (sectors[item.sector] || 0) + 1;
    });

    const getSortedList = (obj: Record<string, number>) =>
      Object.entries(obj)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    return {
      filtered,
      total,
      avgIntensity,
      avgLikelihood,
      avgRelevance,
      topTopics: getSortedList(topics),
      topRegions: getSortedList(regions),
      topSectors: getSortedList(sectors),
    };
  }, [isOpen, type, value, allData]);

  if (!isOpen || !type || !value || !details) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Slide-out Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col border-l border-slate-800 bg-slate-900 text-white shadow-2xl transition-transform duration-300 translate-x-0">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 p-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
              Drill-Down Analysis ({type})
            </span>
            <h2 className="mt-1 text-2xl font-bold text-slate-100">{value}</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-800 p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Main stats grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
              <span className="text-xs text-slate-400">Total Signals</span>
              <p className="mt-1 text-2xl font-bold text-indigo-400">{details.total}</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
              <span className="text-xs text-slate-400">Avg Intensity</span>
              <p className="mt-1 text-2xl font-bold text-amber-400">
                {details.avgIntensity.toFixed(1)}
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
              <span className="text-xs text-slate-400">Avg Likelihood</span>
              <p className="mt-1 text-2xl font-bold text-cyan-400">
                {details.avgLikelihood.toFixed(1)}
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
              <span className="text-xs text-slate-400">Avg Relevance</span>
              <p className="mt-1 text-2xl font-bold text-green-400">
                {details.avgRelevance.toFixed(1)}
              </p>
            </div>
          </div>

          {/* Breakdown lists */}
          <div className="space-y-4">
            {type !== "topic" && details.topTopics.length > 0 && (
              <div>
                <h3 className="mb-2 text-sm font-semibold text-slate-300">Top Topics</h3>
                <div className="space-y-2">
                  {details.topTopics.map(([name, count]) => (
                    <div key={name} className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">{name}</span>
                      <span className="rounded bg-slate-800 px-2 py-0.5 font-medium text-slate-300">
                        {count} signals
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {type !== "region" && details.topRegions.length > 0 && (
              <div className="pt-2">
                <h3 className="mb-2 text-sm font-semibold text-slate-300">Top Regions</h3>
                <div className="space-y-2">
                  {details.topRegions.map(([name, count]) => (
                    <div key={name} className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">{name}</span>
                      <span className="rounded bg-slate-800 px-2 py-0.5 font-medium text-slate-300">
                        {count} signals
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {type !== "sector" && details.topSectors.length > 0 && (
              <div className="pt-2">
                <h3 className="mb-2 text-sm font-semibold text-slate-300">Top Sectors</h3>
                <div className="space-y-2">
                  {details.topSectors.map(([name, count]) => (
                    <div key={name} className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">{name}</span>
                      <span className="rounded bg-slate-800 px-2 py-0.5 font-medium text-slate-300">
                        {count} signals
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Recent Signals List */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-300">Recent Signals</h3>
            <div className="space-y-3">
              {details.filtered.slice(0, 5).map((item) => (
                <div
                  key={item._id}
                  className="rounded-xl border border-slate-800 bg-slate-950/20 p-4 text-xs space-y-2 hover:border-slate-700 transition-colors"
                >
                  <p className="font-medium text-slate-200 leading-relaxed">{item.title}</p>
                  <div className="flex flex-wrap items-center gap-3 text-slate-400">
                    {item.published && (
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {item.published.split(" ")[0]}
                      </span>
                    )}
                    {item.region && (
                      <span className="flex items-center gap-1">
                        <MapPin size={12} />
                        {item.region}
                      </span>
                    )}
                    {item.source && (
                      <span className="flex items-center gap-1">
                        <Award size={12} />
                        {item.source}
                      </span>
                    )}
                  </div>
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 hover:underline pt-1"
                    >
                      Read full source <ExternalLink size={10} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
