"use client";

import { useEffect, useMemo, useState } from "react";
import { Insight } from "@/types/insight";
import { BarChart2, Download, Globe, Layers, TrendingUp, Users, Sliders } from "lucide-react";

import StatCard      from "./StatCard";
import FilterBar     from "./FilterBar";
import ActiveFilters from "./ActiveFilters";
import KeyInsights   from "./KeyInsights";
import InsightsTable from "./InsightsTable";
import DrillDownDrawer from "./DrillDownDrawer";

import TopicChart    from "./charts/TopicChart";
import RegionChart   from "./charts/RegionChart";
import SectorChart   from "./charts/SectorChart";
import PestleChart   from "./charts/PestleChart";
import RelevanceChart from "./charts/RelevanceChart";
import TimelineChart from "./charts/TimelineChart";
import CountryChart  from "./charts/CountryChart";
import DataCoverage  from "./charts/DataCoverage";
import HeatmapChart  from "./charts/HeatmapChart";
import CorrelationMatrix from "./charts/CorrelationMatrix";

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

function exportCSV(data: Insight[]) {
  const headers = ["Title","Topic","Sector","Country","Region","Intensity","Likelihood","Relevance","Source"];
  const rows = data.map((d) => [
    `"${(d.title||"").replace(/"/g,'""')}"`,
    d.topic||"", d.sector||"", d.country||"", d.region||"",
    d.intensity??"", d.likelihood??"", d.relevance??"", d.source||"",
  ]);
  const csv = [headers,...rows].map((r)=>r.join(",")).join("\n");
  const blob = new Blob([csv],{type:"text/csv"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href=url; a.download="insights_export.csv"; a.click();
  URL.revokeObjectURL(url);
}

export default function Dashboard() {
  const [allData, setAllData] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  // Drill-down drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerType, setDrawerType] = useState<"sector" | "topic" | "region" | "country" | "pestle" | "">("");
  const [drawerValue, setDrawerValue] = useState("");

  const [filters, setFilters] = useState<DashboardFilters>({
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

  // Fetch all insights on mount once
  useEffect(() => {
    const loadAllData = async () => {
      try {
        const res = await fetch(`${API_URL}/api/insights`);
        const result = await res.json();
        setAllData(result.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadAllData();
  }, []);

  // Initialize filters from URL parameters on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      setFilters({
        start_year: searchParams.get("start_year") || "",
        end_year: searchParams.get("end_year") || "",
        topic: searchParams.get("topic") || "",
        sector: searchParams.get("sector") || "",
        region: searchParams.get("region") || "",
        pestle: searchParams.get("pestle") || "",
        source: searchParams.get("source") || "",
        country: searchParams.get("country") || "",
        minIntensity: searchParams.get("minIntensity") || "",
        maxIntensity: searchParams.get("maxIntensity") || "",
        minLikelihood: searchParams.get("minLikelihood") || "",
        minRelevance: searchParams.get("minRelevance") || "",
        search: searchParams.get("search") || "",
      });
    }
  }, []);

  // Synchronize filters state to URL parameters
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => {
        if (v !== "") params.append(k, v);
      });
      const queryString = params.toString();
      const newUrl = queryString ? `?${queryString}` : window.location.pathname;
      window.history.replaceState(null, "", newUrl);
    }
  }, [filters]);

  // Client-side filtering logic
  const filteredData = useMemo(() => {
    return allData.filter((item) => {
      if (filters.start_year && String(item.start_year) !== filters.start_year) return false;
      if (filters.end_year && String(item.end_year) !== filters.end_year) return false;
      if (filters.topic && item.topic !== filters.topic) return false;
      if (filters.sector && item.sector !== filters.sector) return false;
      if (filters.region && item.region !== filters.region) return false;
      if (filters.pestle && item.pestle !== filters.pestle) return false;
      if (filters.source && item.source !== filters.source) return false;
      if (filters.country && item.country !== filters.country) return false;

      if (filters.minIntensity && (item.intensity || 0) < Number(filters.minIntensity)) return false;
      if (filters.maxIntensity && (item.intensity || 0) > Number(filters.maxIntensity)) return false;
      if (filters.minLikelihood && (item.likelihood || 0) < Number(filters.minLikelihood)) return false;
      if (filters.minRelevance && (item.relevance || 0) < Number(filters.minRelevance)) return false;

      if (filters.search) {
        const q = filters.search.toLowerCase();
        const match =
          (item.title || "").toLowerCase().includes(q) ||
          (item.topic || "").toLowerCase().includes(q) ||
          (item.country || "").toLowerCase().includes(q) ||
          (item.source || "").toLowerCase().includes(q) ||
          (item.insight || "").toLowerCase().includes(q) ||
          (item.sector || "").toLowerCase().includes(q) ||
          (item.region || "").toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [allData, filters]);

  // Global KPIs from filtered data
  const stats = useMemo(() => {
    if (!filteredData.length) {
      return { total: 0, intensity: 0, likelihood: 0, relevance: 0, countries: 0, highRelevancePct: "0", maxIntensity: 0, minLikelihood: 0, maxLikelihood: 0 };
    }
    const intensity  = filteredData.reduce((s, i) => s + (i.intensity || 0), 0) / filteredData.length;
    const likelihood = filteredData.reduce((s, i) => s + (i.likelihood || 0), 0) / filteredData.length;
    const relevance  = filteredData.reduce((s, i) => s + (i.relevance || 0), 0) / filteredData.length;
    const maxIntensity = Math.max(...filteredData.map((d) => d.intensity || 0));
    const minLikelihood = Math.min(...filteredData.filter((d) => d.likelihood).map((d) => d.likelihood));
    const maxLikelihood = Math.max(...filteredData.map((d) => d.likelihood || 0));
    const countries  = new Set(filteredData.map((d) => d.country).filter(Boolean)).size;
    const highRelevancePct = ((filteredData.filter((d) => d.relevance >= 4).length / filteredData.length) * 100).toFixed(0);
    return {
      total: filteredData.length, intensity, likelihood, relevance, countries, highRelevancePct,
      maxIntensity, minLikelihood, maxLikelihood
    };
  }, [filteredData]);

  // Click handler linking chart select → set filter state AND open detail drawer
  const selectFilterAndDrillDown = (key: "sector" | "topic" | "region" | "country" | "pestle") => (value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setDrawerType(key);
    setDrawerValue(value);
    setDrawerOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-indigo-500/30 selection:text-indigo-200">

      {/* ── Top Header ── */}
      <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-600/20">
              <BarChart2 size={18} />
            </div>
            <div>
              <h1 className="text-sm font-bold uppercase tracking-wider text-slate-100 leading-tight">
                BlackCoffer Intelligence Platform
              </h1>
              <p className="text-xs text-slate-400">Global Intelligence Overview</p>
            </div>
          </div>
          <button
            onClick={() => exportCSV(filteredData)}
            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:border-slate-600 transition-all"
          >
            <Download size={13} />
            Export CSV
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] space-y-8 p-6">

        {/* ── Filter Engine ── */}
        <FilterBar filters={filters} setFilters={setFilters} allData={allData} />

        {/* ── Active filter chips ── */}
        <ActiveFilters filters={filters} setFilters={setFilters} />

        {/* ── KPI Cards ── */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Insights"
            value={stats.total.toLocaleString()}
            sub={`${stats.countries} countries covered`}
            icon={<Layers size={16} />}
            accent="#6366f1"
          />
          <StatCard
            title="Avg Intensity"
            value={stats.intensity.toFixed(1)}
            sub={`Peak: ${stats.maxIntensity}`}
            detail="Higher score represents stronger signals"
            icon={<TrendingUp size={16} />}
            accent="#f59e0b"
          />
          <StatCard
            title="Avg Likelihood"
            value={stats.likelihood.toFixed(1)}
            sub={`Range: ${stats.minLikelihood || 0} – ${stats.maxLikelihood || 0}`}
            icon={<Globe size={16} />}
            accent="#06b6d4"
          />
          <StatCard
            title="Avg Relevance"
            value={stats.relevance.toFixed(1)}
            sub={`High relevance (≥4): ${stats.highRelevancePct}%`}
            icon={<Users size={16} />}
            accent="#22c55e"
          />
        </div>

        {/* ── Executive Summary ── */}
        <KeyInsights data={filteredData} />

        {/* ── Main Content Grid ── */}
        {loading ? (
          <div className="grid gap-6 xl:grid-cols-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-[400px] animate-pulse rounded-2xl border border-slate-800 bg-slate-900" />
            ))}
          </div>
        ) : filteredData.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 py-20 text-slate-400">
            <Sliders size={40} className="mb-4 opacity-30 text-indigo-500 animate-bounce" />
            <p className="text-lg font-medium text-slate-200">No data matches your filters</p>
            <p className="mt-1 text-sm text-slate-500">Try adjusting or resetting your filter fields above</p>
          </div>
        ) : (
          <div className="space-y-12">
            
            {/* 1. TREND ANALYSIS */}
            <section className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 border-b border-slate-850 pb-2">
                Trend Analysis
              </h2>
              <div className="grid gap-6 xl:grid-cols-2">
                <TimelineChart data={filteredData} onYearSelect={selectFilterAndDrillDown("end_year")} />
                <RelevanceChart data={filteredData} onTopicSelect={selectFilterAndDrillDown("topic")} />
              </div>
            </section>

            {/* 2. MARKET LANDSCAPE */}
            <section className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 border-b border-slate-850 pb-2">
                Market Landscape
              </h2>
              <div className="grid gap-6 xl:grid-cols-3">
                <div className="xl:col-span-2">
                  <HeatmapChart
                    data={filteredData}
                    onTopicSelect={selectFilterAndDrillDown("topic")}
                    onRegionSelect={selectFilterAndDrillDown("region")}
                  />
                </div>
                <CorrelationMatrix data={filteredData} />
              </div>
            </section>

            {/* 3. STRATEGIC ANALYSIS */}
            <section className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 border-b border-slate-850 pb-2">
                Strategic Analysis
              </h2>
              <div className="grid gap-6 xl:grid-cols-2">
                <SectorChart   data={filteredData} onSectorSelect={selectFilterAndDrillDown("sector")} />
                <PestleChart   data={filteredData} onPestleSelect={selectFilterAndDrillDown("pestle")} />
              </div>
              <div className="grid gap-6 xl:grid-cols-2">
                <CountryChart  data={filteredData} onCountrySelect={selectFilterAndDrillDown("country")} />
                <DataCoverage  data={filteredData} />
              </div>
            </section>

            {/* 4. SIGNAL EXPLORER */}
            <section className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 border-b border-slate-850 pb-2">
                Signal Explorer
              </h2>
              <InsightsTable data={filteredData} />
            </section>

          </div>
        )}

      </main>

      {/* Drill-down side drawer */}
      <DrillDownDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        type={drawerType}
        value={drawerValue}
        allData={allData}
      />
    </div>
  );
}
