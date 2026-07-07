"use client";

import { useEffect, useState, useMemo } from "react";
import { RotateCcw, Search, ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
  allData: any[]; // To derive dynamic options like start_years
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
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 animate-pulse text-slate-400">
        Loading interactive filter engine...
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
      {/* Search and Primary Filters */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Search */}
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm">
          <Search size={16} className="text-slate-400" />
          <input
            value={filters.search}
            onChange={(e) => handleChange("search", e.target.value)}
            placeholder="Search signals by keyword, title, source, or country..."
            className="w-full bg-transparent text-white placeholder-slate-500 outline-none"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowMore(!showMore)}
            className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
              showMore 
                ? "border-indigo-500 bg-indigo-500/10 text-indigo-300" 
                : "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            <SlidersHorizontal size={15} />
            {showMore ? "Fewer Filters" : "More Filters"}
            {showMore ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          <button
            onClick={resetFilters}
            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-850 px-4 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <RotateCcw size={15} />
            Reset
          </button>
        </div>
      </div>

      {/* Main Filter Dropdowns */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {/* Start / End Years */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Date Range</label>
          <div className="grid grid-cols-2 gap-2">
            <select
              value={filters.start_year}
              onChange={(e) => handleChange("start_year", e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs outline-none focus:border-indigo-500"
            >
              <option value="">Start</option>
              {startYearOptions.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <select
              value={filters.end_year}
              onChange={(e) => handleChange("end_year", e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs outline-none focus:border-indigo-500"
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
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Country</label>
          <select
            value={filters.country}
            onChange={(e) => handleChange("country", e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-xs outline-none focus:border-indigo-500"
          >
            <option value="">All Countries</option>
            {options.country.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Region */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Region</label>
          <select
            value={filters.region}
            onChange={(e) => handleChange("region", e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-xs outline-none focus:border-indigo-500"
          >
            <option value="">All Regions</option>
            {options.region.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        {/* Sector */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Sector</label>
          <select
            value={filters.sector}
            onChange={(e) => handleChange("sector", e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-xs outline-none focus:border-indigo-500"
          >
            <option value="">All Sectors</option>
            {options.sector.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Topic */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Topic</label>
          <select
            value={filters.topic}
            onChange={(e) => handleChange("topic", e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-xs outline-none focus:border-indigo-500"
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
        <div className="grid gap-6 border-t border-slate-800 pt-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {/* PESTLE */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">PESTLE</label>
            <select
              value={filters.pestle}
              onChange={(e) => handleChange("pestle", e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-xs outline-none focus:border-indigo-500"
            >
              <option value="">All PESTLE</option>
              {options.pestle.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Source */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Source</label>
            <select
              value={filters.source}
              onChange={(e) => handleChange("source", e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-xs outline-none focus:border-indigo-500"
            >
              <option value="">All Sources</option>
              {options.source.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Intensity Range */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Min Intensity ({filters.minIntensity || "0"})
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={filters.minIntensity || "0"}
              onChange={(e) => handleChange("minIntensity", e.target.value)}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-850 accent-indigo-500"
            />
          </div>

          {/* Likelihood Range */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Min Likelihood ({filters.minLikelihood || "0"})
            </label>
            <input
              type="range"
              min="0"
              max="5"
              step="1"
              value={filters.minLikelihood || "0"}
              onChange={(e) => handleChange("minLikelihood", e.target.value)}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-850 accent-cyan-500"
            />
          </div>

          {/* Relevance Range */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Min Relevance ({filters.minRelevance || "0"})
            </label>
            <input
              type="range"
              min="0"
              max="5"
              step="1"
              value={filters.minRelevance || "0"}
              onChange={(e) => handleChange("minRelevance", e.target.value)}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-850 accent-green-500"
            />
          </div>
        </div>
      )}
    </div>
  );
}
