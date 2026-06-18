'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

async function action(payload: Record<string, unknown>) {
  await fetch('/api/admin/action', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export interface AdminBattle {
  slug: string;
  title: string;
  nameA: string;
  nameB: string;
  total: number;
  pctA: number;
  active: boolean;
}

export function AdminBattles({ battles }: { battles: AdminBattle[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState('');

  const run = async (slug: string, payload: Record<string, unknown>) => {
    setBusy(slug);
    await action(payload);
    router.refresh();
    setBusy('');
  };

  return (
    <div className="flex flex-col gap-3">
      {battles.map((b) => (
        <div key={b.slug} className="glass rounded-2xl p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-medium">{b.title}</p>
            <span className={`rounded-full px-2 py-0.5 text-xs ${b.active ? 'bg-emerald-500/15 text-emerald-300' : 'bg-white/10 text-muted'}`}>
              {b.active ? 'active' : 'inactive'}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-sm">
            <span className="w-32 truncate">{b.nameA} {b.pctA}%</span>
            <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
              <div className="absolute inset-y-0 left-0 bg-indigo-400" style={{ width: `${b.pctA}%` }} />
            </div>
            <span className="w-32 truncate text-right">{100 - b.pctA}% {b.nameB}</span>
          </div>
          <p className="mt-1 text-xs text-muted">{b.total.toLocaleString()} votes</p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => run(b.slug, { action: 'toggleBattle', slug: b.slug, active: !b.active })}
              disabled={busy === b.slug}
              className="rounded-full glass px-3 py-1.5 text-xs transition-colors hover:bg-white/[0.08] disabled:opacity-50"
            >
              {b.active ? 'Deactivate' : 'Activate'}
            </button>
            <button
              onClick={() => { if (confirm(`Reset votes for ${b.title}? (seed votes remain)`)) run(b.slug, { action: 'resetBattle', slug: b.slug }); }}
              disabled={busy === b.slug}
              className="rounded-full glass px-3 py-1.5 text-xs text-red-300 transition-colors hover:bg-white/[0.08] disabled:opacity-50"
            >
              Reset live votes
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export function AdminDaily({
  date,
  current,
  options,
}: {
  date: string;
  current: string;
  options: { id: string; prompt: string }[];
}) {
  const router = useRouter();
  const [val, setVal] = useState(current);
  const [busy, setBusy] = useState(false);

  const save = async (questionId: string) => {
    setVal(questionId);
    setBusy(true);
    await action({ action: 'setDailyOverride', date, questionId });
    router.refresh();
    setBusy(false);
  };

  return (
    <div className="glass rounded-2xl p-4">
      <p className="text-sm text-muted">Today’s dilemma ({date}) — override the auto-pick:</p>
      <select
        value={val}
        onChange={(e) => save(e.target.value)}
        disabled={busy}
        className="mt-3 w-full rounded-xl border border-white/10 bg-ink-700 px-3 py-2.5 text-sm outline-none"
      >
        <option value="">Auto (by date)</option>
        {options.map((o) => (
          <option key={o.id} value={o.id}>{o.prompt.slice(0, 70)}</option>
        ))}
      </select>
    </div>
  );
}

export function AdminLogout() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await fetch('/api/admin/login', { method: 'DELETE' });
        router.push('/admin/login');
      }}
      className="rounded-full glass px-4 py-2 text-xs text-muted transition-colors hover:text-chalk"
    >
      Log out
    </button>
  );
}
