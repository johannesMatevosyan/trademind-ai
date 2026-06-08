import { getAccessToken, removeAccessToken } from '@/features/auth/storage/token.storage';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ApiFetchOptions extends RequestInit {
  skipAuthRedirect?: boolean;
}

export async function apiFetch(
  path: string,
  init?: ApiFetchOptions
) {
  const token = getAccessToken();
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });

  if (response.status === 401 && !init?.skipAuthRedirect) {
    removeAccessToken();

    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  return response;
}
