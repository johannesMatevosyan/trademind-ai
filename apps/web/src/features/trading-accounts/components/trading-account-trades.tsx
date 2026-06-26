import { Trade } from "@/features/trades/types/trade.types";
import { AccountTradesList } from "./account-trades-list";

interface TradingAccountTradesProps {
  trades: Trade[];
  isLoading: boolean;
  isError: boolean;
}

export function TradingAccountTrades({ trades, isLoading, isError }: TradingAccountTradesProps) {

    if (isLoading) {
        return (
            <div className="mx-auto max-w-6xl text-sm text-slate-500">
                Loading trades...
            </div>
        );
    }

    if (isError) {
        return (
            <div className="mx-auto max-w-6xl text-sm text-slate-500">
                Error loading trades.
            </div>
        );
    }

    if(trades.length === 0) {
        return <p className="text-sm text-red-600">No trades found for this account.</p>;
    }

    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Recent Trades</h2>

            <p className="mt-1 text-sm text-slate-500">
                Recent trades for this trading account.
            </p>

            {trades.length === 0 ? (
                <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500">
                No trades found for this account.
                </div>
            ) : (
                <AccountTradesList trades={trades} />
            )}
        </section>
    );
}
