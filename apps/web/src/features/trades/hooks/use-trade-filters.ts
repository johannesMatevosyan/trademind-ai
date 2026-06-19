'use client';

import { useMemo, useState } from 'react';
import type { Trade } from '../types/trade.types';

export interface TradeFiltersState {
  symbol: string;
  status: string;
  side: string;
  accountId: string;
}

const initialFilters: TradeFiltersState = {
  symbol: '',
  status: 'ALL',
  side: 'ALL',
  accountId: 'ALL',
};

export function useTradeFilters(trades: Trade[]) {
  const [filters, setFilters] = useState<TradeFiltersState>(initialFilters);

  const filteredTrades = useMemo(() => {
    return trades.filter((trade) => {
      const symbolCode = trade.symbol?.code?.toLowerCase() ?? '';
      const symbolMatch =
        !filters.symbol ||
        symbolCode.includes(filters.symbol.toLowerCase().trim());

      const statusMatch =
        filters.status === 'ALL' || trade.status === filters.status;

      const sideMatch = filters.side === 'ALL' || trade.side === filters.side;

      const accountMatch =
        filters.accountId === 'ALL' ||
        trade.tradingAccountId === filters.accountId;

      return symbolMatch && statusMatch && sideMatch && accountMatch;
    });
  }, [trades, filters]);

  function updateFilter<K extends keyof TradeFiltersState>(
    key: K,
    value: TradeFiltersState[K]
  ) {
    setFilters((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function resetFilters() {
    setFilters(initialFilters);
  }

  return {
    filters,
    filteredTrades,
    updateFilter,
    resetFilters,
  };
}
