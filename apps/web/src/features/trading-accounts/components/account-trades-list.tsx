import { Trade } from "@/features/trades/types/trade.types";
import Link from "next/link";


export function AccountTradesList({ trades }: { trades: Trade[] }) {


    return (
        <div className="mt-5 grid gap-3">
            {trades.map((trade) => (
                <Link
                    key={trade.id}
                    href={`/trading/${trade.id}`}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm transition hover:bg-white hover:shadow-sm"
                    >
                    <div className="flex items-center justify-between gap-4">
                        <span className="font-medium text-slate-900">
                            {trade.symbol?.code ?? trade.symbolId}
                        </span>

                        <span className="text-slate-500">
                            {trade.status}
                        </span>
                    </div>

                    <div className="mt-2 text-slate-500">
                        Qty: {trade.quantity} · Entry: {trade.entryPrice} · Exit:{' '}
                        {trade.exitPrice ?? '—'}
                    </div>
                </Link>
            ))}
        </div>
    );
}
