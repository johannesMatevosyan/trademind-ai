'use client';

import { useAuthRedirect } from '@/features/auth/hooks/use-auth-redirect';
import { TradeFilters } from '@/features/trades/components/trade-filters';
import { TradePagination } from '@/features/trades/components/trade-pagination';
import { TradesTable } from '@/features/trades/components/trades-table';
import { useTradeFilters } from '@/features/trades/hooks/use-trade-filters';
import { useTradePagination } from '@/features/trades/hooks/use-trade-pagination';
import { useTrades } from '@/features/trades/hooks/use-trades';
import { TradingAccountsList } from '@/features/trading-accounts/components/trading-accounts-list';
import { useTradingAccounts } from '@/features/trading-accounts/hooks/use-trading-accounts';
import { useRouter } from 'next/navigation';


export default function TradingPage() {
  useAuthRedirect();

  const router = useRouter();

  const {
    data: trades = [],
    isLoading,
    isError,
  } = useTrades();

  const {
    data: tradingAccounts = [],
    isLoading: isAccountsLoading,
    isError: isAccountsError,
  } = useTradingAccounts();

  const {
    filters,
    filteredTrades,
    updateFilter,
    resetFilters,
  } = useTradeFilters(trades);

  const pagination =
    useTradePagination(filteredTrades);

  return (
    <main className="min-h-screen bg-app-bg px-4 py-6 md:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        {/* Existing page header/actions — keep your current markup here */}
        <section className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Trade Journal
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Review your trades, accounts, and trading performance.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
              Filters
            </button>

            <button
              onClick={() => router.push('/trading/new')}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm"
            >
              + Add Trade
            </button>
          </div>
        </section>

        {/* New Trading Accounts section */}
        <TradingAccountsList
          accounts={tradingAccounts}
          isLoading={isAccountsLoading}
          isError={isAccountsError}
        />

        {/* Existing Trade Journal table */}
        {
          isLoading && <div className="rounded-2xl border border-slate-200 bg-white p-6">
            Loading trades...
          </div>
        }

        {
          isError && <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
            Failed to load trades.
          </div>
        }

        <TradeFilters
          filters={filters}
          tradingAccounts={tradingAccounts}
          onFilterChange={updateFilter}
          onReset={resetFilters}
        />

        {!isLoading && !isError && <TradesTable trades={pagination.paginatedItems} />}

        <TradePagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          pageSize={pagination.pageSize}
          totalItems={pagination.totalItems}
          startItem={pagination.startItem}
          endItem={pagination.endItem}
          onNext={pagination.nextPage}
          onPrevious={pagination.previousPage}
          onPageSizeChange={pagination.setPageSize}
        />
      </div>
    </main>
  );
}
