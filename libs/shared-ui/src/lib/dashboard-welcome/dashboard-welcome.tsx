import { useEffect, useState } from 'react';

type DashboardWelcomeProps = {
  name: string;
};

export function DashboardWelcome({
  name,
}: DashboardWelcomeProps) {
  const [greeting, setGreeting] = useState('Welcome back');

  useEffect(() => {
    const hour = new Date().getHours();

    setGreeting(
      hour < 12
        ? 'Good morning'
        : hour < 18
        ? 'Good afternoon'
        : 'Good evening'
    );
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-white">
        {greeting}, {name} 👋
      </h1>

      <p className="mt-2 text-slate-400">
        Welcome back to TradeMind AI
      </p>
    </div>
  );
}
