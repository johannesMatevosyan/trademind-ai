'use client';

import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { PnlHistoryItem } from '../types/performance-dashboard.types';


interface PnlHistoryChartProps {
  data: PnlHistoryItem[];
  isLoading?: boolean;
  isError?: boolean;
}

function formatMoney(value: number) {
  return new Intl.NumberFormat(undefined, {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}


function isValidDate(value: string | null) {
  if (!value) return false;

  return !Number.isNaN(new Date(value).getTime());
}

export function PnlHistoryChart({
  data,
  isLoading,
  isError,
}: PnlHistoryChartProps) {

    const chartData = data
        .filter((item) => isValidDate(item.date))
        .map((item) => ({
            ...item,
            displayDate: new Date(item.date as string).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
            }),
        }));

    if (chartData.length === 0) {
        return (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-950">
                    P&L History
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    Realized P&L from closed trades.
                </p>

                <div className="mt-6 flex h-72 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50">
                    <div className="text-center">
                        <p className="text-sm font-medium text-slate-700">
                            No P&amp;L history available
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                            Close a trade to see your realized profit and loss over time.
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    if (isLoading) {
        return (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="h-64 animate-pulse rounded-xl bg-slate-100" />
        </section>
        );
    }

    if (isError) {
        return (
        <section className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            Could not load P&amp;L history.
        </section>
        );
    }

    if (data.length === 0) {
        return (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">P&amp;L History</h2>
            <p className="mt-6 text-sm text-slate-500">No closed trades yet.</p>
        </section>
        );
    }

    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">P&amp;L History</h2>

            <p className="mt-1 text-sm text-slate-500">
                Realized P&amp;L from closed trades.
            </p>

            <div className="mt-6 h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={chartData}
                        margin={{
                            top: 10,
                            right: 5,
                            left: -1,
                            bottom: 5,
                        }}
                        >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="displayDate"
                            padding={{ left: 0, right: 0 }}
                            tickFormatter={(value) =>
                                new Date(value).toLocaleDateString(undefined, {
                                    month: 'short',
                                    day: 'numeric',
                                })
                            }
                            tick={{
                                fontSize: 12,
                                fill: '#64748b',
                            }}
                        />
                        <YAxis
                            width={38}
                            tickFormatter={formatMoney}
                            tick={{
                            fontSize: 12,
                            fill: '#64748b',
                            }}
                        />
                        <Tooltip />
                        <Line
                            dataKey="pnl"
                            strokeWidth={3}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                            type="monotone"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </section>
    );
}
