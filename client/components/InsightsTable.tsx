"use client";

import { useState, useMemo } from "react";
import { Insight } from "@/types/insight";
import { Search, Download, ArrowUpDown, ExternalLink } from "lucide-react";

const PAGE_SIZE = 10;

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
  const [sortKey, setSortKey] = useState<SortKey>("intensity");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return data.filter(
      (d) =>
        (d.title || "").toLowerCase().includes(q) ||
        (d.topic || "").toLowerCase().includes(q) ||
        (d.country || "").toLowerCase().includes(q)
    );
  }, [data, search]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const av = a[sortKey] ?? 0;
      const bv = b[sortKey] ?? 0;
      return sortDir === "desc" ? Number(bv) - Number(av) : Number(av) - Number(bv);
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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
    <button onClick={() => toggleSort(k)} className="ml-1 inline-flex opacity-60 hover:opacity-100">
      <ArrowUpDown size={12} />
    </button>
  );

  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-slate-800 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Insights Table</h2>
          <p className="text-xs text-slate-400">{filtered.length} records</p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm">
            <Search size={14} className="text-slate-400" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search title, topic, country…"
              className="w-48 bg-transparent text-white placeholder-slate-500 outline-none"
            />
          </div>
          <button
            onClick={() => exportCSV(sorted)}
            className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm hover:bg-slate-700 transition-colors"
          >
            <Download size={14} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-950 text-slate-400">
            <tr>
              <th className="p-4 font-medium">Title</th>
              <th className="p-4 font-medium">Topic</th>
              <th className="p-4 font-medium">Country</th>
              <th className="p-4 font-medium">
                Intensity <SortBtn k="intensity" />
              </th>
              <th className="p-4 font-medium">
                Likelihood <SortBtn k="likelihood" />
              </th>
              <th className="p-4 font-medium">
                Relevance <SortBtn k="relevance" />
              </th>
              <th className="p-4 font-medium">Source</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-10 text-center text-slate-500">
                  No matching insights found.
                </td>
              </tr>
            ) : (
              paginated.map((item) => (
                <tr
                  key={item._id}
                  className="border-t border-slate-800 transition-colors hover:bg-slate-800/50"
                >
                  <td className="max-w-xs p-4">
                    <span title={item.title} className="line-clamp-2 block">
                      {item.title || "—"}
                    </span>
                  </td>
                  <td className="p-4 text-slate-300">{item.topic || "N/A"}</td>
                  <td className="p-4 text-slate-300">{item.country || "Global"}</td>
                  <td className="p-4">
                    <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-xs font-medium text-indigo-300">
                      {item.intensity || 0}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-xs font-medium text-cyan-300">
                      {item.likelihood || 0}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-300">
                      {item.relevance || 0}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400">
                    {item.url ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-indigo-400 transition-colors"
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
      <div className="flex items-center justify-between border-t border-slate-800 px-6 py-4">
        <p className="text-xs text-slate-400">
          Showing {Math.min((page - 1) * PAGE_SIZE + 1, sorted.length)}–
          {Math.min(page * PAGE_SIZE, sorted.length)} of {sorted.length}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs disabled:opacity-40 hover:bg-slate-800 transition-colors"
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
                className={`rounded-lg px-3 py-1.5 text-xs transition-colors ${
                  p === page
                    ? "bg-indigo-600 text-white"
                    : "border border-slate-700 hover:bg-slate-800"
                }`}
              >
                {p}
              </button>
            );
          })}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs disabled:opacity-40 hover:bg-slate-800 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
