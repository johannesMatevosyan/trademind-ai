'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: 'Dashboard', href: '/' },
  { label: 'Analytics', href: '/analytics' },
  { label: 'Trading', href: '/trading' },
];

export function TopNavigation() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1 rounded-2xl bg-white/40 p-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-xl px-4 py-2 text-sm transition ${
              isActive
                ? 'bg-white text-slate-950 shadow-sm'
                : 'text-slate-500 hover:bg-white/60 hover:text-slate-900'
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
