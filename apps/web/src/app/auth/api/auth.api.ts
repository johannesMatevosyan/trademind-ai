import { LoginRequest, LoginResponse } from '../types/auth.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function loginUser(
  payload: LoginRequest
): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to login');
  }

  return response.json();
}
