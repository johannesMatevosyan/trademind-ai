'use client';

import Link from 'next/link';

import { CsvImportPanel } from '@/features/csv-import/components/csv-import-panel';

// Replace this path with the existing trading account query hook.
import { useTradingAccounts } from '@/features/trading-accounts/hooks/use-trading-accounts';

export default function TradingImportPage() {
    const {
        data: tradingAccounts = [],
        isLoading,
        isError,
    } = useTradingAccounts();

    const accountOptions = tradingAccounts.map((account) => ({
        id: account.id,
        name: account.name?.trim() || 'Unnamed account',
        broker: account.broker ?? null,
        currency: account.currency ?? undefined,
    }));

    return (
        <main className="min-h-screen bg-app-bg px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
            <div>
            <Link
                href="/trading"
                className="text-sm font-medium text-slate-600 hover:text-slate-900"
            >
                ← Back to Trading
            </Link>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">
                Import Trades
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-slate-600">
                Upload a TradeMind-format CSV, review
                validation issues, and import valid rows
                into one trading account.
            </p>
            </div>

            <RequiredFormatCard />

            <CsvImportPanel
                tradingAccounts={accountOptions}
                isLoadingAccounts={isLoading}
                accountsError={
                    isError
                    ? 'Trading accounts could not be loaded'
                    : null
                }
            />
        </div>
        </main>
    );
}

function RequiredFormatCard() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-base font-semibold text-slate-900">
        Required CSV format
      </h2>

      <p className="mt-2 text-sm text-slate-600">
        The first row must contain these headers in
        the documented TradeMind format.
      </p>

      <code className="mt-4 block overflow-x-auto rounded-lg bg-slate-950 p-4 text-xs text-slate-100">
        symbol,side,status,quantity,entryPrice,exitPrice,openedAt,closedAt,notes
      </code>

      <p className="mt-4 text-sm font-medium text-slate-800">
        Example
      </p>

      <code className="mt-2 block overflow-x-auto rounded-lg bg-slate-950 p-4 text-xs text-slate-100">
        AAPL,BUY,CLOSED,3,104,114,2026-06-12T10:00:00.000Z,2026-06-13T14:00:00.000Z,Good
        breakout trade
      </code>

      <div className="mt-4 text-sm text-slate-600">
        <p>
          Required: symbol, side, status, quantity,
          entryPrice, openedAt.
        </p>

        <p className="mt-1">
          CLOSED trades also require exitPrice and
          closedAt.
        </p>
      </div>
    </section>
  );
}
