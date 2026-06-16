type StatCardProps = {
  title: string;
  value: string | number;
  change?: string;
};

export function StatCard({
  title,
  value,
  change,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-800/60 bg-slate-800/60 p-5">
      <p className="text-sm text-slate-400">
        {title}
      </p>

      <h3 className="mt-2 text-2xl font-bold text-white">
        {value}
      </h3>

      {change && (
        <p className="mt-2 text-sm text-emerald-400">
          {change}
        </p>
      )}
    </div>
  );
}
