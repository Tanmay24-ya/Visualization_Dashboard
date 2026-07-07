"use client";

import { useState, useMemo } from "react";
import { Insight } from "@/types/insight";
import { Search, Download, ArrowUpDown, ExternalLink } from "lucide-react";

type SortKey = "intensity" | "likelihood" | "relevance";

function exportCSV(data: Insight[]) {
  const headers = ["Title", "Topic", "Sector", "Country", "Region", "Intensity", "Likelihood", "Relevance", "Source"];
  const rows = data.map((d) => [
    `"${(d.title || "").replace(/"/g, '""')}"`,
    d.topic || "",
    d.sector || "",
    d.country || "",
    d.region || "",
    d.intensity ?? "",
    d.likelihood ?? "",
    d.relevance ?? "",
    d.source || "",
  ]);
  const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "insights_export.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export default function InsightsTable({ data }: { data: Insight[] }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortKey, setSortKey] = useState<SortKey>("intensity");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return data.filter(
      (d) =>
        (d.title || "").toLowerCase().includes(q) ||
        (d.topic || "").toLowerCase().includes(q) ||
        (d.country || "").toLowerCase().includes(q) ||
        (d.source || "").toLowerCase().includes(q)
    );
  }, [data, search]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const av = a[sortKey] ?? 0;
      const bv = b[sortKey] ?? 0;
      return sortDir === "desc" ? Number(bv) - Number(av) : Number(av) - Number(bv);
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
    setPage(1);
  };

  const SortBtn = ({ k }: { k: SortKey }) => (
    <button onClick={() => toggleSort(k)} className="ml-1 inline-flex opacity-60 hover:opacity-100 cursor-pointer">
      <ArrowUpDown size={12} />
    </button>
  );

  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md shadow-xl">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-slate-800/80 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-100">Signal Explorer</h2>
          <p className="text-xs text-slate-400">Reviewing {filtered.length} matches from {data.length} total signals</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Page size selector */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Show:</span>
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
              className="rounded-lg border border-slate-700/60 bg-slate-950 px-2 py-1.5 text-xs text-slate-300 outline-none focus:border-indigo-500"
            >
              <option value={10}>10 rows</option>
              <option value={25}>25 rows</option>
              <option value={50}>50 rows</option>
            </select>
          </div>

          {/* Table search */}
          <div className="flex items-center gap-2 rounded-xl border border-slate-700/60 bg-slate-950/60 px-3 py-1.5 text-xs">
            <Search size={13} className="text-slate-400" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Filter list..."
              className="w-36 bg-transparent text-slate-100 placeholder-slate-500 outline-none"
            />
          </div>

          {/* Export CSV button */}
          <button
            onClick={() => exportCSV(sorted)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700/80 bg-slate-800/80 px-3.5 py-1.5 text-xs font-semibold hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
          >
            <Download size={13} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/70 text-slate-450 uppercase tracking-wider text-[10px] font-bold">
            <tr>
              <th className="p-4 font-bold border-b border-slate-800">Title</th>
              <th className="p-4 font-bold border-b border-slate-800">Topic</th>
              <th className="p-4 font-bold border-b border-slate-800">Country</th>
              <th className="p-4 font-bold border-b border-slate-800">
                Intensity <SortBtn k="intensity" />
              </th>
              <th className="p-4 font-bold border-b border-slate-800">
                Likelihood <SortBtn k="likelihood" />
              </th>
              <th className="p-4 font-bold border-b border-slate-800">
                Relevance <SortBtn k="relevance" />
              </th>
              <th className="p-4 font-bold border-b border-slate-800">Source</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-850">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-12 text-center text-slate-500 text-sm">
                  No signals found matching your current query.
                </td>
              </tr>
            ) : (
              paginated.map((item) => (
                <tr
                  key={item._id}
                  className="transition-colors hover:bg-slate-800/25"
                >
                  <td className="max-w-xs p-4">
                    <span title={item.title} className="line-clamp-2 font-medium text-slate-200">
                      {item.title || "—"}
                    </span>
                  </td>
                  <td className="p-4 text-slate-300 font-semibold">{item.topic || "N/A"}</td>
                  <td className="p-4 text-slate-350">{item.country || "Global"}</td>
                  <td className="p-4">
                    <span className="inline-block rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-bold text-indigo-300 border border-indigo-500/10">
                      {item.intensity || 0}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="inline-block rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-[10px] font-bold text-cyan-300 border border-cyan-500/10">
                      {item.likelihood || 0}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="inline-block rounded-full bg-green-500/10 px-2.5 py-0.5 text-[10px] font-bold text-green-300 border border-green-500/10">
                      {item.relevance || 0}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400">
                    {item.url ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 hover:text-indigo-400 transition-colors underline decoration-slate-700 hover:decoration-indigo-400"
                      >
                        {item.source || "Link"} <ExternalLink size={11} />
                      </a>
                    ) : (
                      item.source || "—"
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col gap-4 items-center justify-between border-t border-slate-800/80 px-6 py-4 sm:flex-row">
        <p className="text-xs text-slate-400">
          Showing {Math.min((page - 1) * pageSize + 1, sorted.length)}–
          {Math.min(page * pageSize, sorted.length)} of {sorted.length} records
        </p>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-lg border border-slate-700/60 px-3 py-1.5 text-xs font-semibold text-slate-300 disabled:opacity-40 hover:bg-slate-800 transition-all cursor-pointer"
          >
            Previous
          </button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const start = Math.max(1, Math.min(page - 2, totalPages - 4));
            const p = start + i;
            return (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  p === page
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-650/20"
                    : "border border-slate-700/60 text-slate-300 hover:bg-slate-800"
                }`}
              >
                {p}
              </button>
            );
          })}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="rounded-lg border border-slate-700/60 px-3 py-1.5 text-xs font-semibold text-slate-300 disabled:opacity-40 hover:bg-slate-800 transition-all cursor-pointer"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
