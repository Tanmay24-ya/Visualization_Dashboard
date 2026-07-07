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
      className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-6 transition-all hover:border-slate-700"
      style={{ boxShadow: `0 0 0 1px ${accent}10` }}
    >
      {/* accent glow top-right */}
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-10 blur-2xl"
        style={{ background: accent }}
      />

      {icon && (
        <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl"
          style={{ background: `${accent}20`, color: accent }}>
          {icon}
        </div>
      )}

      <p className="text-sm text-slate-400">{title}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight" style={{ color: accent }}>
        {value}
      </p>
      {sub && <p className="mt-1 text-xs text-slate-400">{sub}</p>}
      {detail && (
        <p className="mt-2 border-t border-slate-800 pt-2 text-xs text-slate-500">{detail}</p>
      )}
    </div>
  );
}
