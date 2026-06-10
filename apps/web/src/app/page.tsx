'use client';

import { useAuthRedirect } from '@/features/auth/hooks/use-auth-redirect';
import { MarketBadge, MarketStatusCard, NotificationBell, UserAvatar } from '@org/shared-ui';
import { AnalyticsOverview } from './components/analytics-overview';
import { TopNavigation } from './components/top-navigation';
import { TopbarClock } from './components/topbar-clock';


export default function Index() {

  useAuthRedirect();

  const notifications = [
    {
      id: 1,
      message: 'Trade closed successfully',
    },
  ];

  return (
    <main className="min-h-screen bg-app-bg p-8">
      <div className="mx-auto flex max-w-4xl flex-col gap-8">
        <div className="flex items-center justify-between">
          <TopNavigation />

          <div className="flex items-center gap-3">
            <MarketBadge symbol="BTC/USDT" />
            <TopbarClock />
            <NotificationBell
              hasUnread={notifications.length > 0}
            />
            <UserAvatar initials="HM" />
          </div>
        </div>

        <MarketStatusCard />

        <AnalyticsOverview />
      </div>
    </main>
  );
}
