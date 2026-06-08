'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { useLogin } from '../hooks/use-login';

export function LoginForm() {
  const router = useRouter();
  const loginMutation = useLogin();

  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          router.push('/');
        },
      }
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full max-w-sm flex-col gap-4 rounded-xl border p-6"
    >
      <div>
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Access your TradeMind AI dashboard
        </p>
      </div>

      <label className="flex flex-col gap-1 text-sm">
        Email
        <input
          className="rounded-md border px-3 py-2"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Password
        <input
          className="rounded-md border px-3 py-2"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </label>

      {loginMutation.isError && (
        <p className="text-sm text-red-500">
          Login failed. Please check your credentials.
        </p>
      )}

      <button
        type="submit"
        disabled={loginMutation.isPending}
        className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-60"
      >
        {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  );
}
