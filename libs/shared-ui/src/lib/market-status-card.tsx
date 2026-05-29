"use client";

import { useEffect, useState } from "react";
import { Skeleton } from './skeleton/skeleton';

type MarketTicker = {
  symbol: string;
  price: number;
  direction: 'up' | 'down';
};

const tickers: MarketTicker[] = [
  {
    symbol: 'BTC/USD',
    price: 68420,
    direction: 'up',
  },
  {
    symbol: 'ETH/USD',
    price: 3120,
    direction: 'down',
  },
];

export function MarketStatusCard() {
  const [isLoading, setIsLoading] = useState(true);
  const [updatedAt, setUpdatedAt] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setUpdatedAt(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  if (isLoading) {
    return (
      <div className="skeleton-wrapper rounded-2xl border border-slate-800 bg-card-bg p-5">
        <Skeleton className="mb-4 h-6 w-40" />
        <Skeleton className="mb-3 h-12 w-full" />
        <Skeleton className="mb-3 h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-card-bg p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">
            Market Status
          </h3>

          <p className="text-sm text-slate-400">
            Updated {updatedAt.toLocaleTimeString()}s ago
          </p>
        </div>

        <div className="flex items-center gap-2 text-emerald-400 text-sm">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          Live
        </div>
      </div>

      <div className="space-y-3">
        {tickers.map((ticker) => (
          <div
            key={ticker.symbol}
            className="flex items-center justify-between rounded-xl bg-slate-800/60 px-4 py-3"
          >
            <span className="text-slate-200">
              {ticker.symbol}
            </span>

            <span
              className={
                ticker.direction === 'up'
                  ? 'text-emerald-400'
                  : 'text-red-400'
              }
            >
              {ticker.direction === 'up' ? '↑' : '↓'} {ticker.price}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MarketStatusCard;
