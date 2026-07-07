"use client";

import { X } from "lucide-react";
import { DashboardFilters } from "./FilterBar";

const LABELS: Record<keyof DashboardFilters, string> = {
  start_year: "Start Year",
  end_year: "End Year",
  topic: "Topic",
  sector: "Sector",
  region: "Region",
  pestle: "PESTLE",
  source: "Source",
  country: "Country",
  minIntensity: "Min Intensity",
  maxIntensity: "Max Intensity",
  minLikelihood: "Min Likelihood",
  minRelevance: "Min Relevance",
  search: "Keyword",
};

interface Props {
  filters: DashboardFilters;
  setFilters: React.Dispatch<React.SetStateAction<DashboardFilters>>;
}

export default function ActiveFilters({ filters, setFilters }: Props) {
  const active = Object.entries(filters).filter(([key, value]) => {
    if (value === "") return false;
    if (key.startsWith("min") && value === "0") return false;
    return true;
  });

  if (!active.length) return null;

  const remove = (key: keyof DashboardFilters) => {
    setFilters((prev) => ({ ...prev, [key]: "" }));
  };

  const clearAll = () => {
    setFilters({
      start_year: "",
      end_year: "",
      topic: "",
      sector: "",
      region: "",
      pestle: "",
      source: "",
      country: "",
      minIntensity: "",
      maxIntensity: "",
      minLikelihood: "",
      minRelevance: "",
      search: "",
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3">
      <span className="text-xs font-medium text-slate-400">Active:</span>
      {active.map(([key, value]) => (
        <span
          key={key}
          className="flex items-center gap-1.5 rounded-full border border-indigo-500/40 bg-indigo-500/10 px-3 py-1 text-xs text-indigo-300"
        >
          {LABELS[key as keyof DashboardFilters]}: <strong>{value}</strong>
          <button onClick={() => remove(key as keyof DashboardFilters)} className="hover:text-white transition-colors">
            <X size={12} />
          </button>
        </span>
      ))}
      <button
        onClick={clearAll}
        className="ml-auto text-xs text-slate-400 hover:text-white transition-colors underline underline-offset-2"
      >
        Clear All
      </button>
    </div>
  );
}
