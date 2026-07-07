interface Props {
  title: string;
  value: string;
  sub?: string;
  detail?: string;
  icon?: React.ReactNode;
  accent?: string;
}

export default function StatCard({ title, value, sub, detail, icon, accent = "#6366f1" }: Props) {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-md transition-all duration-350 hover:-translate-y-0.5 hover:border-slate-700/80"
      style={{ 
        boxShadow: `0 0 20px -5px ${accent}05, 0 0 0 1px ${accent}08`
      }}
    >
      {/* Dynamic ambient color glow */}
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-20"
        style={{ background: accent }}
      />
      <div
        className="pointer-events-none absolute -right-4 -top-4 h-16 w-16 rounded-full opacity-5 blur-xl transition-all duration-500 group-hover:scale-125"
        style={{ background: accent }}
      />

      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
        {icon && (
          <div 
            className="flex h-8 w-8 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
            style={{ background: `${accent}15`, color: accent }}
          >
            {icon}
          </div>
        )}
      </div>

      <p className="mt-3 text-3xl font-bold tracking-tight text-white transition-all group-hover:text-slate-100">
        {value}
      </p>

      {sub && (
        <p className="mt-1.5 text-xs font-medium text-slate-300 flex items-center gap-1.5">
          <span className="h-1 w-1 rounded-full" style={{ backgroundColor: accent }} />
          {sub}
        </p>
      )}

      {detail && (
        <div className="mt-4 border-t border-slate-850 pt-3 text-[11px] font-medium text-slate-500 transition-colors group-hover:text-slate-400">
          {detail}
        </div>
      )}
    </div>
  );
}
