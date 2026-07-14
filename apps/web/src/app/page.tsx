'use client';

import { useAuthRedirect } from '@/features/auth/hooks/use-auth-redirect';
import { PerformanceDashboard } from '@/features/performance-dashboard/components/performance-dashboard';
import { DashboardLayout, DashboardWelcome, MarketBadge, MarketStatusCard, MarketStatusIndicator, NotificationBell, StatCard, UserAvatar } from '@org/shared-ui';
import { useEffect, useState } from 'react';
import { AnalyticsOverview } from './components/analytics-overview';
import { TopNavigation } from './components/top-navigation';
import { TopbarClock } from './components/topbar-clock';


export default function Index() {

  useAuthRedirect();

  const [hourUtc, setHourUtc] = useState<number | null>(null);

  useEffect(() => {
    setHourUtc(new Date().getUTCHours());
  }, []);

  const notifications = [
    {
      id: 1,
      message: 'Trade closed successfully',
    },
  ];

  const isOpen = hourUtc !== null && hourUtc >= 13 && hourUtc < 20;

  return (
    <DashboardLayout>
        <header className="bg-section-bg flex items-center justify-between p-5 rounded-2xl">

          <TopNavigation />

          <div className="flex items-center gap-3">
            <MarketBadge symbol="BTC/USDT" />

            <MarketStatusIndicator  isOpen={isOpen} />

            <TopbarClock />

            <NotificationBell
              hasUnread={notifications.length > 0}
            />
            <UserAvatar initials="HM" />
          </div>
        </header>

        <MarketStatusCard />

        <DashboardWelcome name="Hovhannes" />

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
        <PerformanceDashboard />
    </DashboardLayout>
  );
}
