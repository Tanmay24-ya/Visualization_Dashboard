import { Insight } from "@/types/insight";

export default function InsightsTable({ data }: { data: Insight[] }) {
  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
      <div className="border-b border-slate-800 p-6">
        <h2 className="text-lg font-semibold">Latest Insights</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-950 text-slate-400">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Topic</th>
              <th className="p-4">Country</th>
              <th className="p-4">Intensity</th>
              <th className="p-4">Likelihood</th>
              <th className="p-4">Relevance</th>
            </tr>
          </thead>

          <tbody>
            {data.slice(0, 10).map((item) => (
              <tr
                key={item._id}
                className="border-t border-slate-800 hover:bg-slate-800/50 transition-colors"
              >
                <td className="max-w-md p-4">{item.title}</td>
                <td className="p-4">{item.topic || "N/A"}</td>
                <td className="p-4">{item.country || "Global"}</td>
                <td className="p-4">{item.intensity || 0}</td>
                <td className="p-4">{item.likelihood || 0}</td>
                <td className="p-4">{item.relevance || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
