const API_URL =
    process.env.NEXT_PUBLIC_API_URL ??
    'http://localhost:3000/api';

export const ACCESS_TOKEN_STORAGE_KEY =
    'trademind_access_token';

interface ApiFetchOptions extends RequestInit {
    skipAuthRedirect?: boolean;
}

export async function apiFetch(
  path: string,
  options: ApiFetchOptions = {},
): Promise<Response> {
    const {
      skipAuthRedirect = false,
      headers: providedHeaders,
      ...requestOptions
    } = options;

    const headers = new Headers(providedHeaders);

    const isFormData =
      typeof FormData !== 'undefined' &&
      requestOptions.body instanceof FormData;

    if (
      requestOptions.body &&
      !isFormData &&
      !headers.has('Content-Type')
    ) {
      headers.set('Content-Type', 'application/json');
    }

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(
        ACCESS_TOKEN_STORAGE_KEY,
      );

      if (token) {
        headers.set(
          'Authorization',
          `Bearer ${token}`,
        );
      }
    }

    const response = await fetch(`${API_URL}${path}`, {
      ...requestOptions,
      headers,
    });

    if (
      response.status === 401 &&
      !skipAuthRedirect &&
      typeof window !== 'undefined'
    ) {
      localStorage.removeItem(
        ACCESS_TOKEN_STORAGE_KEY,
      );

      window.location.href = '/login';
    }

    return response;
}
