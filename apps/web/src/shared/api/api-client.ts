import { getAccessToken } from '@/features/auth/storage/token.storage';

export async function apiFetch(
  input: string,
  init?: RequestInit
) {
  const token = getAccessToken();

  return fetch(input, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
      ...init?.headers,
    },
  });
}
