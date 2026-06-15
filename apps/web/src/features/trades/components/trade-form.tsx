'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

import type { TradingAccount } from '@/features/trading-accounts/types/trading-account.types';
import { useCreateTrade } from '../hooks/use-create-trade';

interface TradeFormProps {
  tradingAccounts: TradingAccount[];
}

export function TradeForm({ tradingAccounts }: TradeFormProps) {
  const router = useRouter();
  const createTradeMutation = useCreateTrade();

  const [tradingAccountId, setTradingAccountId] = useState(
    tradingAccounts[0]?.id ?? ''
  );
  const [symbol, setSymbol] = useState('');
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY');
  const [status, setStatus] = useState<'OPEN' | 'CLOSED'>('OPEN');
  const [entryPrice, setEntryPrice] = useState('');
  const [exitPrice, setExitPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [pnl, setPnl] = useState('');
  const [notes, setNotes] = useState('');
  const [openedAt, setOpenedAt] = useState('');
  const [closedAt, setClosedAt] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await createTradeMutation.mutateAsync({
      tradingAccountId,
      symbol: symbol.trim().toUpperCase(),
      side,
      status,
      entryPrice,
      quantity,
      ...(exitPrice ? { exitPrice } : {}),
      ...(pnl ? { pnl } : {}),
      ...(notes ? { notes } : {}),
      ...(openedAt ? { openedAt: new Date(openedAt).toISOString() } : {}),
      ...(closedAt ? { closedAt: new Date(closedAt).toISOString() } : {}),
    });

    router.push('/trading');
  }

  const isSubmitDisabled =
    createTradeMutation.isPending ||
    !tradingAccountId ||
    !symbol ||
    !entryPrice ||
    !quantity;

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Create Trade
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Add a new trade to your journal.
        </p>
      </div>

      {createTradeMutation.isError && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Failed to create trade. Please check the form and try again.
        </div>
      )}

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <FormField label="Trading Account">
          <select
            value={tradingAccountId}
            onChange={(event) => setTradingAccountId(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400"
          >
            <option value="">Select account</option>
            {tradingAccounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name ?? account.id}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Symbol">
          <input
            value={symbol}
            onChange={(event) => setSymbol(event.target.value.toUpperCase())}
            placeholder="AAPL"
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400"
          />
        </FormField>

        <FormField label="Side">
          <select
            value={side}
            onChange={(event) => setSide(event.target.value as 'BUY' | 'SELL')}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400"
          >
            <option value="BUY">BUY</option>
            <option value="SELL">SELL</option>
          </select>
        </FormField>

        <FormField label="Status">
          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as 'OPEN' | 'CLOSED')
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400"
          >
            <option value="OPEN">OPEN</option>
            <option value="CLOSED">CLOSED</option>
          </select>
        </FormField>

        <FormField label="Entry Price">
          <input
            value={entryPrice}
            onChange={(event) => setEntryPrice(event.target.value)}
            placeholder="100"
            inputMode="decimal"
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400"
          />
        </FormField>

        <FormField label="Exit Price">
          <input
            value={exitPrice}
            onChange={(event) => setExitPrice(event.target.value)}
            placeholder="120"
            inputMode="decimal"
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400"
          />
        </FormField>

        <FormField label="Quantity">
          <input
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            placeholder="1"
            inputMode="decimal"
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400"
          />
        </FormField>

        <FormField label="PNL">
          <input
            value={pnl}
            onChange={(event) => setPnl(event.target.value)}
            placeholder="20"
            inputMode="decimal"
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400"
          />
        </FormField>

        <FormField label="Opened At">
          <input
            type="datetime-local"
            value={openedAt}
            onChange={(event) => setOpenedAt(event.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400"
          />
        </FormField>

        <FormField label="Closed At">
          <input
            type="datetime-local"
            value={closedAt}
            onChange={(event) => setClosedAt(event.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400"
          />
        </FormField>
      </div>

      <div className="mt-5">
        <FormField label="Notes">
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Trade context, setup, mistake, lesson..."
            rows={4}
            className="w-full resize-none rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400"
          />
        </FormField>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.push('/trading')}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitDisabled}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          {createTradeMutation.isPending ? 'Creating...' : 'Create Trade'}
        </button>
      </div>
    </form>
  );
}

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </span>
      {children}
    </label>
  );
}
