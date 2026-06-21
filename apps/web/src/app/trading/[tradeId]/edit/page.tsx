'use client';

import { useAuthRedirect } from '@/features/auth/hooks/use-auth-redirect';
import { EditTradeForm } from '@/features/trades/components/edit-trade-form';
import { useTradeDetails } from '@/features/trades/hooks/use-trade-details';
import { useParams } from 'next/navigation';

export default function EditTradePage() {
  useAuthRedirect();

  const params = useParams<{ tradeId: string }>();
  const tradeId = params.tradeId;

  const {
    data: trade,
    isLoading,
    isError,
  } = useTradeDetails(tradeId);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-app-bg p-8">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm text-slate-500">Loading trade...</p>
        </div>
      </main>
    );
  }

  if (isError || !trade) {
    return (
      <main className="min-h-screen bg-app-bg p-8">
        <div className="mx-auto max-w-4xl rounded-2xl border border-red-200 bg-red-50 p-6">
          <p className="text-sm text-red-700">
            Could not load trade for editing.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-app-bg p-8">
      <div className="mx-auto max-w-4xl">
        <EditTradeForm trade={trade} />
      </div>
    </main>
  );
}
