'use client';

import { useMutation } from '@tanstack/react-query';
import { loginUser } from '../api/auth.api';
import { saveAccessToken } from '../storage/token.storage';
import { LoginRequest } from '../types/auth.types';

export function useLogin() {
  return useMutation({
    mutationFn: (payload: LoginRequest) => loginUser(payload),
    onSuccess: (data) => {
      saveAccessToken(data.token.accessToken);
    },
  });
}
