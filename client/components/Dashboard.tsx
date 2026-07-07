"use client";

import { useEffect, useMemo, useState } from "react";
import { Insight } from "@/types/insight";

import StatCard from "./StatCard";
import FilterBar from "./FilterBar";
import InsightsTable from "./InsightsTable";

import TopicChart from "./charts/TopicChart";
import RegionChart from "./charts/RegionChart";
import SectorChart from "./charts/SectorChart";
import PestleChart from "./charts/PestleChart";
import RelevanceChart from "./charts/RelevanceChart";
import TimelineChart from "./charts/TimelineChart";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Filters {
  end_year: string;
  topic: string;
  sector: string;
  region: string;
  pestle: string;
  source: string;
  country: string;
}

export default function Dashboard() {
  const [data, setData] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<Filters>({
    end_year: "",
    topic: "",
    sector: "",
    region: "",
    pestle: "",
    source: "",
    country: "",
  });

  const fetchData = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    try {
      const response = await fetch(`${API_URL}/api/insights?${params}`);
      const result = await response.json();
      setData(result.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  const stats = useMemo(() => {
    if (!data.length) {
      return { total: 0, intensity: 0, likelihood: 0, relevance: 0 };
    }
    return {
      total: data.length,
      intensity: data.reduce((sum, i) => sum + (i.intensity || 0), 0) / data.length,
      likelihood: data.reduce((sum, i) => sum + (i.likelihood || 0), 0) / data.length,
      relevance: data.reduce((sum, i) => sum + (i.relevance || 0), 0) / data.length,
    };
  }, [data]);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-[1600px] p-6">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">BlackCoffer Analytics</h1>
          <p className="mt-2 text-slate-400">
            Global insights and trends visualization dashboard
          </p>
        </div>

        {/* Filters */}
        <FilterBar filters={filters} setFilters={setFilters} />

        {/* KPI Cards */}
        <div className="my-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total Insights"  value={stats.total.toString()} />
          <StatCard title="Avg Intensity"   value={stats.intensity.toFixed(1)} />
          <StatCard title="Avg Likelihood"  value={stats.likelihood.toFixed(1)} />
          <StatCard title="Avg Relevance"   value={stats.relevance.toFixed(1)} />
        </div>

        {/* Charts */}
        {loading ? (
          <div className="py-20 text-center text-slate-400">Loading dashboard...</div>
        ) : (
          <>
            <div className="grid gap-6 xl:grid-cols-2">
              <TopicChart    data={data} />
              <RelevanceChart data={data} />
              <RegionChart   data={data} />
              <SectorChart   data={data} />
              <TimelineChart data={data} />
              <PestleChart   data={data} />
            </div>

            {/* Table */}
            <InsightsTable data={data} />
          </>
        )}

      </div>
    </main>
  );
}
