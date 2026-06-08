'use client';

import { useRouter } from 'next/navigation';
import { removeAccessToken } from '../storage/token.storage';

export function LogoutButton() {
  const router = useRouter();

  function handleLogout() {
    removeAccessToken();
    router.replace('/login');
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-md border px-3 py-2 text-sm"
    >
      Logout
    </button>
  );
}
