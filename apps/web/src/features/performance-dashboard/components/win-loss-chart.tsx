'use client';

import {
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from 'recharts';
import type { WinLossData } from '../types/performance-dashboard.types';

interface WinLossChartProps {
  data?: WinLossData;
  isLoading?: boolean;
  isError?: boolean;
}

const CHART_COLORS = ['#10b981', '#ef4444', '#94a3b8'];

export function WinLossChart({ data, isLoading, isError }: WinLossChartProps) {

    if (!data) {
        return null;
    }

    if (isLoading) {
        return (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="h-72 animate-pulse rounded-xl bg-slate-100" />
        </section>
        );
    }

    if (isError) {
        return (
        <section className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            Could not load win/loss chart.
        </section>
        );
    }

    const chartData = [
        {
            name: 'Winning',
            value: data?.winningTrades ?? 0,
        },
        {
            name: 'Losing',
            value: data?.losingTrades ?? 0,
        },
        {
            name: 'Breakeven',
            value: data?.breakevenTrades ?? 0,
        },
    ].filter((item) => item.value > 0);

    if (chartData.length === 0) {
        return (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-950">
                Win/Loss Chart
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                Visual distribution of completed trades.
                </p>

                <div className="mt-6 flex h-72 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
                No completed trades yet.
                </div>
            </section>
        );
    }

    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">Win/Loss Chart</h2>

        <p className="mt-1 text-sm text-slate-500">
            Visual distribution of completed trades.
        </p>

        <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Tooltip />

                <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
                >
                {chartData.map((entry, index) => (
                    <Cell
                    key={entry.name}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                    />
                ))}
                </Pie>
            </PieChart>
            </ResponsiveContainer>
        </div>
        </section>
    );
}
