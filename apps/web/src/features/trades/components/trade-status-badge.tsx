import type { TradeStatus } from '../types/trade.types';

interface TradeStatusBadgeProps {
  status: TradeStatus | null;
}

export function TradeStatusBadge({ status }: TradeStatusBadgeProps) {
  const isOpen = status === 'OPEN';

  return (
    <span
      className={[
        'inline-flex rounded-full px-2 py-1 text-xs font-medium',
        isOpen
          ? 'bg-blue-500/10 text-blue-400'
          : 'bg-green-500/10 text-green-400',
      ].join(' ')}
    >
      {status}
    </span>
  );
}
