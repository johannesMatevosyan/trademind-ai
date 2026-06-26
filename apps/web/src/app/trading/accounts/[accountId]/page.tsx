'use client';

import { useAuthRedirect } from '@/features/auth/hooks/use-auth-redirect';
import { TradingAccountHeader } from '@/features/trading-accounts/components/trading-account-header';
import { TradingAccountStats } from '@/features/trading-accounts/components/trading-account-stats';
import { TradingAccountSummary } from '@/features/trading-accounts/components/trading-account-summary';
import { TradingAccountTrades } from '@/features/trading-accounts/components/trading-account-trades';
import { useTradingAccountDetails } from '@/features/trading-accounts/hooks/use-trading-account-details';
import { useParams } from 'next/navigation';

export default function TradingAccountDetailsPage() {
  useAuthRedirect();

  const params = useParams<{ accountId: string }>();
  const accountId = params.accountId;

  const { data: account, isLoading, isError } =
    useTradingAccountDetails(accountId);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-app-bg p-8">
        <div className="mx-auto max-w-6xl text-sm text-slate-500">
          Loading account...
        </div>
      </main>
    );
  }

  if (isError || !account) {
    return (
      <main className="min-h-screen bg-app-bg p-8">
        <div className="mx-auto max-w-6xl rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          Could not load trading account.
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-app-bg p-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <TradingAccountHeader account={account} />
        <TradingAccountSummary account={account} />
        <TradingAccountStats />
        <TradingAccountTrades />
      </div>
    </main>
  );
}
