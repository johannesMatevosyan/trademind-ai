type MarketStatusIndicatorProps = {
  isOpen?: boolean;
};

export function MarketStatusIndicator({
  isOpen = true,
}: MarketStatusIndicatorProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-slate-800/60 bg-slate-800/60 px-3 py-1.5 text-sm">
      <span
        className={`h-2 w-2 rounded-full ${
          isOpen ? 'bg-emerald-400' : 'bg-red-400'
        }`}
      />

      <span className="text-slate-500">
        Market
      </span>

      <span
        className={
          isOpen
            ? 'font-medium text-emerald-400'
            : 'font-medium text-red-400'
        }
      >
        {isOpen ? 'OPEN' : 'CLOSED'}
      </span>
    </div>
  );
}
