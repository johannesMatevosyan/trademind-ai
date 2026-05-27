import { MarketStatusCard } from '@org/shared-ui';
import { TopNavigation } from './components/top-navigation';

export default function Index() {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.tailwind file.
   */
  return (
    <main className="min-h-screen bg-app-bg p-8">
      <div className="mx-auto max-w-4xl">
        <TopNavigation />
        <MarketStatusCard />
      </div>
    </main>
  );
}
