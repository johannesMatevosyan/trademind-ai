'use client';

import { useAuthRedirect } from '@/features/auth/hooks/use-auth-redirect';
import { TradesTable } from '@/features/trades/components/trades-table';
import { useTrades } from '@/features/trades/hooks/use-trades';


export default function TradingPage() {
  useAuthRedirect();

  const { data: trades = [], isLoading, isError } = useTrades();

  return (
    <main className="min-h-screen bg-app-bg p-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">Trade Journal</h1>
          <p className="mt-1 text-sm text-gray-400">
            Review your recorded trades and trading performance history.
          </p>
        </div>

        {isLoading && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-gray-400">
            Loading trades...
          </div>
        )}

        {isError && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-sm text-red-300">
            Failed to load trades.
          </div>
        )}

        {!isLoading && !isError && <TradesTable trades={trades} />}
      </div>
    </main>
  );
}
