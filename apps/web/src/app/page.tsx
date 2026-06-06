'use client';

import { MarketStatusCard, NotificationBell } from '@org/shared-ui';
import { AnalyticsOverview } from './components/analytics-overview';
import { TopNavigation } from './components/top-navigation';
import { TopbarClock } from './components/topbar-clock';


export default function Index() {
  const accessToken = '';

  const notifications = [
    {
      id: 1,
      message: 'Trade closed successfully',
    },
  ];

  return (
    <main className="min-h-screen bg-app-bg p-8">
      <div className="mx-auto max-w-4xl flex flex-col gap-8">
        <TopNavigation />
        <TopbarClock />
        <NotificationBell  hasUnread={notifications.length > 0} />
        <MarketStatusCard />
        <AnalyticsOverview
          accessToken={accessToken}
        />
      </div>
    </main>
  );
}
