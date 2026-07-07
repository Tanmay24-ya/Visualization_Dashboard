"use client";

import { useEffect, useState, useMemo } from "react";
import { RotateCcw, Search, ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

export interface DashboardFilters {
  start_year: string;
  end_year: string;
  topic: string;
  sector: string;
  region: string;
  pestle: string;
  source: string;
  country: string;
  minIntensity: string;
  maxIntensity: string;
  minLikelihood: string;
  minRelevance: string;
  search: string;
}

interface Props {
  filters: DashboardFilters;
  setFilters: React.Dispatch<React.SetStateAction<DashboardFilters>>;
  allData: any[];
}

interface FilterOptions {
  end_year: string[];
  topic: string[];
  sector: string[];
  region: string[];
  pestle: string[];
  source: string[];
  country: string[];
}

export default function FilterBar({ filters, setFilters, allData }: Props) {
  const [options, setOptions] = useState<FilterOptions | null>(null);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/filters`)
      .then((res) => res.json())
      .then((result) => setOptions(result.data))
      .catch(console.error);
  }, []);

  const startYearOptions = useMemo(() => {
    const years = new Set<string>();
    allData.forEach((d) => {
      if (d.start_year) years.add(String(d.start_year));
    });
    return Array.from(years).sort();
  }, [allData]);

  const handleChange = (field: keyof DashboardFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const resetFilters = () => {
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

  if (!options) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-md animate-pulse text-slate-400 text-sm">
        Loading interactive filter engine...
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/45 p-6 backdrop-blur-md shadow-xl">
      {/* Search and Primary Filters */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Search */}
        <div className="flex flex-1 items-center gap-3 rounded-xl border border-slate-700/60 bg-slate-950/60 px-4 py-2.5 text-sm transition-all focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/30">
          <Search size={15} className="text-slate-400" />
          <input
            value={filters.search}
            onChange={(e) => handleChange("search", e.target.value)}
            placeholder="Search signals by keyword, title, source, or country..."
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 outline-none text-sm"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowMore(!showMore)}
            className={`flex items-center gap-2 rounded-xl border px-4.5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${showMore
              ? "border-indigo-500 bg-indigo-500/15 text-indigo-300 shadow-md shadow-indigo-500/5"
              : "border-slate-700/80 bg-slate-800/80 text-slate-300 hover:bg-slate-700"
              }`}
          >
            <SlidersHorizontal size={13} />
            {showMore ? "Fewer Filters" : "More Filters"}
            {showMore ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
          <button
            onClick={resetFilters}
            className="flex items-center gap-2 rounded-xl border border-slate-700/80 bg-slate-850/50 px-4.5 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-400 transition hover:bg-slate-800 hover:text-white cursor-pointer"
          >
            <RotateCcw size={13} />
            Reset
          </button>
        </div>
      </div>

      {/* Main Filter Dropdowns */}
      <div className="grid gap-4 mt-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {/* Start / End Years */}
        <div>
          <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-400">Date Range</label>
          <div className="grid grid-cols-2 gap-2">
            <select
              value={filters.start_year}
              onChange={(e) => handleChange("start_year", e.target.value)}
              className="w-full rounded-xl border border-slate-700/60 bg-slate-950/50 px-3 py-2 text-xs text-slate-200 outline-none transition hover:border-slate-600 focus:border-indigo-500"
            >
              <option value="">Start</option>
              {startYearOptions.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <select
              value={filters.end_year}
              onChange={(e) => handleChange("end_year", e.target.value)}
              className="w-full rounded-xl border border-slate-700/60 bg-slate-950/50 px-3 py-2 text-xs text-slate-200 outline-none transition hover:border-slate-600 focus:border-indigo-500"
            >
              <option value="">End</option>
              {options.end_year.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Country */}
        <div>
          <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-400">Country</label>
          <select
            value={filters.country}
            onChange={(e) => handleChange("country", e.target.value)}
            className="w-full rounded-xl border border-slate-700/60 bg-slate-950/50 px-3 py-2.5 text-xs text-slate-200 outline-none transition hover:border-slate-600 focus:border-indigo-500"
          >
            <option value="">All Countries</option>
            {options.country.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Region */}
        <div>
          <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-400">Region</label>
          <select
            value={filters.region}
            onChange={(e) => handleChange("region", e.target.value)}
            className="w-full rounded-xl border border-slate-700/60 bg-slate-950/50 px-3 py-2.5 text-xs text-slate-200 outline-none transition hover:border-slate-600 focus:border-indigo-500"
          >
            <option value="">All Regions</option>
            {options.region.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        {/* Sector */}
        <div>
          <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-400">Sector</label>
          <select
            value={filters.sector}
            onChange={(e) => handleChange("sector", e.target.value)}
            className="w-full rounded-xl border border-slate-700/60 bg-slate-950/50 px-3 py-2.5 text-xs text-slate-200 outline-none transition hover:border-slate-600 focus:border-indigo-500"
          >
            <option value="">All Sectors</option>
            {options.sector.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Topic */}
        <div>
          <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-400">Topic</label>
          <select
            value={filters.topic}
            onChange={(e) => handleChange("topic", e.target.value)}
            className="w-full rounded-xl border border-slate-700/60 bg-slate-950/50 px-3 py-2.5 text-xs text-slate-200 outline-none transition hover:border-slate-600 focus:border-indigo-500"
          >
            <option value="">All Topics</option>
            {options.topic.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Advanced Sliders & Extra Fields (Collapsible) */}
      {showMore && (
        <div className="grid gap-6 border-t border-slate-800/80 pt-5 mt-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {/* PESTLE */}
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-400">PESTLE</label>
            <select
              value={filters.pestle}
              onChange={(e) => handleChange("pestle", e.target.value)}
              className="w-full rounded-xl border border-slate-700/60 bg-slate-950/50 px-3 py-2.5 text-xs text-slate-200 outline-none transition hover:border-slate-600 focus:border-indigo-500"
            >
              <option value="">All PESTLE</option>
              {options.pestle.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Source */}
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-400">Source</label>
            <select
              value={filters.source}
              onChange={(e) => handleChange("source", e.target.value)}
              className="w-full rounded-xl border border-slate-700/60 bg-slate-950/50 px-3 py-2.5 text-xs text-slate-200 outline-none transition hover:border-slate-600 focus:border-indigo-500"
            >
              <option value="">All Sources</option>
              {options.source.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Intensity Range */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Min Intensity</label>
              <span className="text-xs font-semibold text-indigo-400">{filters.minIntensity || "0"}</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={filters.minIntensity || "0"}
              onChange={(e) => handleChange("minIntensity", e.target.value)}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-indigo-500"
            />
          </div>

          {/* Likelihood Range */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Min Likelihood</label>
              <span className="text-xs font-semibold text-cyan-400">{filters.minLikelihood || "0"}</span>
            </div>
            <input
              type="range"
              min="0"
              max="5"
              step="1"
              value={filters.minLikelihood || "0"}
              onChange={(e) => handleChange("minLikelihood", e.target.value)}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-cyan-500"
            />
          </div>

          {/* Relevance Range */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Min Relevance</label>
              <span className="text-xs font-semibold text-green-400">{filters.minRelevance || "0"}</span>
            </div>
            <input
              type="range"
              min="0"
              max="5"
              step="1"
              value={filters.minRelevance || "0"}
              onChange={(e) => handleChange("minRelevance", e.target.value)}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-green-500"
            />
          </div>
        </div>
      )}
    </div>
  );
}
