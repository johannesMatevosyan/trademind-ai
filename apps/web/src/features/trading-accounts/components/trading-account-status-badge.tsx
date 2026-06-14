import type { TradingAccountStatus } from '../types/trading-account.types';

interface TradingAccountStatusBadgeProps {
  status?: TradingAccountStatus | null;
}

export function TradingAccountStatusBadge({
  status,
}: TradingAccountStatusBadgeProps) {
  const normalizedStatus = status?.toUpperCase() ?? 'UNKNOWN';

  const styles: Record<string, string> = {
    ACTIVE: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    INACTIVE: 'border-slate-200 bg-slate-50 text-slate-600',
    ARCHIVED: 'border-amber-200 bg-amber-50 text-amber-700',
    UNKNOWN: 'border-slate-200 bg-slate-50 text-slate-500',
  };

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${
        styles[normalizedStatus] ?? styles.UNKNOWN
      }`}
    >
      {status ?? '—'}
    </span>
  );
}
