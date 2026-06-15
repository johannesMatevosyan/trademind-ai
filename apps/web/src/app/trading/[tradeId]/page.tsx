'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import { useAuthRedirect } from '@/features/auth/hooks/use-auth-redirect';
import { TradeDetailsCard } from '@/features/trades/components/trade-details-card';
import { useTradeDetails } from '@/features/trades/hooks/use-trade-details';

export default function TradeDetailsPage() {
  useAuthRedirect();

  const params = useParams<{ tradeId: string }>();
  const tradeId = params.tradeId;

  const {
    data: trade,
    isLoading,
    isError,
  } = useTradeDetails(tradeId);

  return (
    <main className="min-h-screen bg-app-bg p-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <Link
          href="/trading"
          className="text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          ← Back to Trade Journal
        </Link>

        {isLoading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            Loading trade details...
          </div>
        )}

        {isError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">
            Failed to load trade details.
          </div>
        )}

        {!isLoading && !isError && trade && (
          <TradeDetailsCard trade={trade} />
        )}
      </div>
    </main>
  );
}
