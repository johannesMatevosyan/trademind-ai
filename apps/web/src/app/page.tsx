'use client';

import { useAuthRedirect } from '@/features/auth/hooks/use-auth-redirect';
import { DashboardLayout, MarketBadge, MarketStatusCard, NotificationBell, StatCard, UserAvatar } from '@org/shared-ui';
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
    <DashboardLayout>
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


          <div className="grid gap-4 md:grid-cols-4">
            <StatCard
              title="Total PnL"
              value="$1,250"
              change="+12%"
            />

            <StatCard
              title="Win Rate"
              value="63%"
            />

            <StatCard
              title="Trades"
              value="42"
            />

            <StatCard
              title="Accounts"
              value="3"
            />
          </div>

        <AnalyticsOverview />
    </DashboardLayout>
  );
}
