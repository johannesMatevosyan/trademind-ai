import { TradingActivityItem } from "../types/performance-dashboard.types";

const TRADING_ACTIVITY_DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  timeZone: 'UTC',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
});

interface TradingActivityPlaceholderProps {
  data: TradingActivityItem[];
  isLoading?: boolean;
  isError?: boolean;
}

function formatDate(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return TRADING_ACTIVITY_DATE_FORMATTER.format(parsedDate);
}

export function TradingActivityPlaceholder({
  data,
  isLoading,
  isError,
}: TradingActivityPlaceholderProps) {
  if (isLoading) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="h-40 animate-pulse rounded-xl bg-slate-100" />
      </section>
    );
  }

  if (isError) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        Could not load trading activity.
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-950">
        Trading Activity
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        Number of trades opened per day.
      </p>

      {data.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-sm text-slate-500">
          No trading activity yet.
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {data.slice(-7).map((item) => (
            <div
              key={item.date}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
            >
              <span className="text-slate-600">{formatDate(item.date)}</span>

              <span className="font-semibold text-slate-900">
                {item.trades} trade{item.trades === 1 ? '' : 's'}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
