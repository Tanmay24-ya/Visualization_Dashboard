"use client";

import { useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";

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

interface Props {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
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

export default function FilterBar({ filters, setFilters }: Props) {
  const [options, setOptions] = useState<FilterOptions | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/filters`)
      .then((res) => res.json())
      .then((result) => setOptions(result.data))
      .catch(console.error);
  }, []);

  const handleChange = (field: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const resetFilters = () => {
    setFilters({
      end_year: "",
      topic: "",
      sector: "",
      region: "",
      pestle: "",
      source: "",
      country: "",
    });
  };

  if (!options) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        Loading filters...
      </div>
    );
  }

  const filterConfig = [
    { label: "End Year", field: "end_year" as keyof Filters, values: options.end_year },
    { label: "Topic",    field: "topic"    as keyof Filters, values: options.topic    },
    { label: "Sector",   field: "sector"   as keyof Filters, values: options.sector   },
    { label: "Region",   field: "region"   as keyof Filters, values: options.region   },
    { label: "PESTLE",   field: "pestle"   as keyof Filters, values: options.pestle   },
    { label: "Source",   field: "source"   as keyof Filters, values: options.source   },
    { label: "Country",  field: "country"  as keyof Filters, values: options.country  },
  ];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-semibold">Dashboard Filters</h2>
          <p className="text-sm text-slate-400">Filter all dashboard visualizations</p>
        </div>
        <button
          onClick={resetFilters}
          className="flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm transition hover:bg-slate-800"
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        {filterConfig.map((filter) => (
          <div key={filter.field}>
            <label className="mb-1 block text-xs text-slate-400">{filter.label}</label>
            <select
              value={filters[filter.field]}
              onChange={(e) => handleChange(filter.field, e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            >
              <option value="">All</option>
              {filter.values?.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
