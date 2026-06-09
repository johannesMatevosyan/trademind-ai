type MarketBadgeProps = {
  symbol: string;
};

export function MarketBadge({ symbol }: MarketBadgeProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-slate-800/60 bg-slate-800/60 px-3 py-1.5 text-sm text-slate-300">
      <span className="h-2 w-2 rounded-full bg-emerald-400" />
      <span className="text-slate-500">Market:</span>
      <span className="font-medium text-white">{symbol}</span>
    </div>
  );
}
