interface TradeSideBadgeProps {
  side?: string | null;
}

export function TradeSideBadge({
  side,
}: TradeSideBadgeProps) {
  const normalizedSide = side?.toUpperCase();

  const styles = {
    BUY: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    SELL: 'border-red-200 bg-red-50 text-red-700',
  };

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${
        styles[normalizedSide as keyof typeof styles] ??
        'border-slate-200 bg-slate-50 text-slate-600'
      }`}
    >
      {side ?? '—'}
    </span>
  );
}
