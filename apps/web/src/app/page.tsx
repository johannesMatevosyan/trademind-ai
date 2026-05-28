import { MarketStatusCard } from '@org/shared-ui';
import { TopNavigation } from './components/top-navigation';
import { TopbarClock } from './components/topbar-clock';

export default function Index() {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.tailwind file.
   */
  return (
    <main className="min-h-screen bg-app-bg p-8">
      <div className="mx-auto max-w-4xl flex flex-col gap-8">
        <TopNavigation />
        <TopbarClock />
        <MarketStatusCard />

      </div>
    </main>
  );
}
