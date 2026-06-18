'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eyebrow } from '@/components/ui/primitives';

export default function AdminLogin() {
  const router = useRouter();
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr('');
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ password: pw }),
    });
    setBusy(false);
    if (res.ok) router.push('/admin');
    else setErr('Incorrect password.');
  };

  return (
    <main className="grid min-h-[100dvh] place-items-center px-5">
      <form onSubmit={submit} className="glass-strong w-full max-w-sm rounded-3xl p-8">
        <Eyebrow>The Philosophy Machine</Eyebrow>
        <h1 className="mt-2 font-display text-2xl font-semibold">Admin access</h1>
        <input
          type="password"
          autoFocus
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="Password"
          className="mt-6 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none focus:border-indigo-400"
        />
        {err && <p className="mt-3 text-sm text-red-400">{err}</p>}
        <button
          type="submit"
          disabled={busy}
          className="mt-5 w-full rounded-full bg-chalk py-3 text-sm font-medium text-ink transition-colors hover:bg-white disabled:opacity-50"
        >
          {busy ? 'Checking…' : 'Enter'}
        </button>
        <p className="mt-4 text-center text-xs text-muted">Set ADMIN_PASSWORD in .env.local (defaults to “philosopher”).</p>
      </form>
    </main>
  );
}
