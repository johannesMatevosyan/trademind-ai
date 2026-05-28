'use client';

import { useEffect, useState } from 'react';

function formatUtcTime(date: Date) {
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
  }).format(date);
}

export function TopbarClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(new Date());
    }, 1000 * 30);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div className="rounded-xl bg-card-bg px-4 py-2 text-sm text-slate-300">
      <span className="text-slate-500">NYSE</span>{' '}
      <span className="font-medium text-white">{formatUtcTime(now)}</span>{' '}
      <span className="text-slate-500">UTC</span>
    </div>
  );
}
