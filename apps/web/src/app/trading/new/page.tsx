'use client';

import Link from 'next/link';

import { useAuthRedirect } from '@/features/auth/hooks/use-auth-redirect';
import { TradeForm } from '@/features/trades/components/trade-form';
import { useTradingAccounts } from '@/features/trading-accounts/hooks/use-trading-accounts';

export default function NewTradePage() {
  useAuthRedirect();

  const {
    data: tradingAccounts = [],
    isLoading,
    isError,
  } = useTradingAccounts();

  return (
    <main className="min-h-screen bg-app-bg p-8">
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <Link
          href="/trading"
          className="text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          ← Back to Trade Journal
        </Link>

        {isLoading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            Loading trading accounts...
          </div>
        )}

        {isError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">
            Failed to load trading accounts.
          </div>
        )}

        {!isLoading && !isError && tradingAccounts.length === 0 && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-800 shadow-sm">
            You need at least one trading account before creating a trade.
          </div>
        )}

        {!isLoading && !isError && tradingAccounts.length > 0 && (
          <TradeForm tradingAccounts={tradingAccounts} />
        )}
      </div>
    </main>
  );
}
