'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { getAccessToken } from '../storage/token.storage';

export function useAuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    const token = getAccessToken();

    if (!token) {
      router.replace('/login');
    }
  }, [router]);
}
