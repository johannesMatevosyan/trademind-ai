'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useUpdateTrade } from '../hooks/use-update-trade';
import type { Trade } from '../types/trade.types';

interface EditTradeFormProps {
  trade: Trade;
}

export function EditTradeForm({ trade }: EditTradeFormProps) {
  const router = useRouter();
  const updateTradeMutation = useUpdateTrade({ tradeId: trade.id });

  const [side, setSide] = useState(trade.side);
  const [status, setStatus] = useState(trade.status);
  const [entryPrice, setEntryPrice] = useState(String(trade.entryPrice));
  const [exitPrice, setExitPrice] = useState(
    trade.exitPrice === null ? '' : String(trade.exitPrice)
  );
  const [quantity, setQuantity] = useState(String(trade.quantity));
  const [openedAt, setOpenedAt] = useState(trade.openedAt?.slice(0, 16) ?? '');
  const [closedAt, setClosedAt] = useState(trade.closedAt?.slice(0, 16) ?? '');
  const [notes, setNotes] = useState(trade.notes ?? '');

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    updateTradeMutation.mutate(
      {
        side,
        status,
        entryPrice,
        exitPrice: exitPrice || null,
        quantity,
        openedAt: openedAt ? new Date(openedAt).toISOString() : trade.openedAt,
        closedAt: closedAt ? new Date(closedAt).toISOString() : null,
        notes: notes || null,
      },
      {
        onSuccess: () => {
          router.push(`/trading/${trade.id}`);
        },
      }
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-950">
          Edit Trade
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Update trade execution details.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Side
          <select
            value={side}
            onChange={(event) => setSide(event.target.value as Trade['side'])}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
          >
            <option value="BUY">BUY</option>
            <option value="SELL">SELL</option>
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Status
          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as Trade['status'])
            }
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
          >
            <option value="OPEN">OPEN</option>
            <option value="CLOSED">CLOSED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Entry Price
          <input
            value={entryPrice}
            onChange={(event) => setEntryPrice(event.target.value)}
            type="number"
            step="0.01"
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Exit Price
          <input
            value={exitPrice}
            onChange={(event) => setExitPrice(event.target.value)}
            type="number"
            step="0.01"
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Quantity
          <input
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            type="number"
            step="0.01"
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Opened At
          <input
            value={openedAt}
            onChange={(event) => setOpenedAt(event.target.value)}
            type="datetime-local"
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Closed At
          <input
            value={closedAt}
            onChange={(event) => setClosedAt(event.target.value)}
            type="datetime-local"
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 md:col-span-2">
          Notes
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={4}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
          />
        </label>
      </div>

      {updateTradeMutation.isError && (
        <p className="mt-4 text-sm text-red-600">
          Could not update trade. Please try again.
        </p>
      )}

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.push(`/trading/${trade.id}`)}
          className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={updateTradeMutation.isPending}
          className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-medium text-white disabled:opacity-50"
        >
          {updateTradeMutation.isPending ? 'Saving...' : 'Save changes'}
        </button>
      </div>
    </form>
  );
}
