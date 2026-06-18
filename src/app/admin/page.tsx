import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { isAdmin, usingDefaultPassword } from '@/lib/admin-auth';
import { getStore } from '@/lib/store';
import { QUESTIONS, DAILY_POOL } from '@/lib/data/questions';
import { PHILOSOPHERS, VISIBLE_PHILOSOPHERS, PHILOSOPHER_BY_SLUG } from '@/lib/data/philosophers';
import { TRIBE_LIST, TRIBES } from '@/lib/data/tribes';
import { BATTLES, SEED_VOTES } from '@/lib/data/battles';
import { promoActive, promoDaysLeft } from '@/lib/entitlements';
import { Eyebrow, GlassCard } from '@/components/ui/primitives';
import { AdminBattles, AdminDaily, AdminLogout, type AdminBattle } from '@/components/admin/AdminControls';

export const metadata: Metadata = { title: 'Admin', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

function chatProvider(): string {
  if (process.env.ANTHROPIC_API_KEY) return 'Anthropic Claude';
  if (process.env.GEMINI_API_KEY) return `Gemini · ${process.env.GEMINI_MODEL || 'gemini-2.5-flash'}`;
  if (process.env.GROQ_API_KEY) return 'Groq';
  if (process.env.OLLAMA_BASE_URL) return 'Ollama (local)';
  return 'Mock (no key set)';
}

function Stat({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <GlassCard className="p-5">
      <p className="font-display text-3xl font-semibold">{value}</p>
      <p className="mt-1 text-sm text-chalk/85">{label}</p>
      {sub && <p className="mt-0.5 text-xs text-muted">{sub}</p>}
    </GlassCard>
  );
}

function Dist({ title, data, nameOf }: { title: string; data: Record<string, number>; nameOf: (k: string) => string }) {
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
  const total = entries.reduce((s, [, n]) => s + n, 0);
  const max = Math.max(1, ...entries.map(([, n]) => n));
  return (
    <GlassCard className="p-5">
      <p className="text-xs uppercase tracking-[0.25em] text-muted">{title}</p>
      {entries.length === 0 ? (
        <p className="mt-3 text-sm text-muted">No data yet — take a quiz to populate this.</p>
      ) : (
        <div className="mt-3 flex flex-col gap-2">
          {entries.map(([k, n]) => (
            <div key={k} className="flex items-center gap-3 text-sm">
              <span className="w-32 shrink-0 truncate">{nameOf(k)}</span>
              <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                <div className="absolute inset-y-0 left-0 rounded-full bg-indigo-400" style={{ width: `${(n / max) * 100}%` }} />
              </div>
              <span className="w-16 shrink-0 text-right tabular-nums text-muted">
                {n} · {total ? Math.round((n / total) * 100) : 0}%
              </span>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
}

export default async function AdminPage() {
  if (!(await isAdmin())) redirect('/admin/login');
  const store = await getStore();
  const today = new Date().toISOString().slice(0, 10);

  const battles: AdminBattle[] = BATTLES.map((b) => {
    const seed = SEED_VOTES[b.slug] ?? { a: 0, b: 0 };
    const live = store.battles[b.slug] ?? { a: 0, b: 0 };
    const a = seed.a + live.a;
    const tot = a + seed.b + live.b;
    return {
      slug: b.slug,
      title: b.title,
      nameA: PHILOSOPHER_BY_SLUG[b.sideA]?.name ?? b.sideA,
      nameB: PHILOSOPHER_BY_SLUG[b.sideB]?.name ?? b.sideB,
      total: tot,
      pctA: tot ? Math.round((a / tot) * 100) : 50,
      active: store.battles[b.slug]?.active ?? b.active,
    };
  });

  const dailyOptions = DAILY_POOL.filter((q) => q.format === 'slider').map((q) => ({ id: q.id, prompt: q.prompt }));
  const todaySplit = store.daily[today];
  const lenLabel = (k: string) => ({ '10': 'Quick (10)', '15': 'Sitting (15)' } as Record<string, string>)[k] ?? `Deep (${k})`;

  return (
    <main className="mx-auto max-w-4xl px-5 pb-28 pt-10">
      <div className="flex items-center justify-between">
        <div>
          <Eyebrow>Admin · The Philosophy Machine</Eyebrow>
          <h1 className="mt-1 font-display text-3xl font-semibold">Dashboard</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/" className="text-sm text-muted hover:text-chalk">View site →</Link>
          <AdminLogout />
        </div>
      </div>

      {usingDefaultPassword() && (
        <div className="mt-5 rounded-2xl border border-amber-400/40 bg-amber-500/10 p-3 text-sm text-amber-200">
          ⚠ Using the default password. Set <code className="rounded bg-black/30 px-1">ADMIN_PASSWORD</code> in <code className="rounded bg-black/30 px-1">.env.local</code> before deploying.
        </div>
      )}

      {/* Overview */}
      <section className="mt-8">
        <Eyebrow className="mb-3">Overview</Eyebrow>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Quizzes completed" value={store.quizzes.total} sub="since first run" />
          <Stat label="AI chat replies" value={store.chats} />
          <Stat label="Daily answers (today)" value={(todaySplit?.agree ?? 0) + (todaySplit?.disagree ?? 0)} />
          <Stat label="Launch Festival" value={promoActive() ? 'ON' : 'off'} sub={promoActive() ? `${promoDaysLeft()} days left` : 'reverted to freemium'} />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Questions" value={QUESTIONS.length} />
          <Stat label="Philosophers" value={PHILOSOPHERS.length} sub={`${VISIBLE_PHILOSOPHERS.length} visible · ${PHILOSOPHERS.length - VISIBLE_PHILOSOPHERS.length} hidden`} />
          <Stat label="Tribes" value={TRIBE_LIST.length} />
          <Stat label="Chat engine" value={chatProvider().split(' ')[0]} sub={chatProvider()} />
        </div>
      </section>

      {/* Analytics */}
      <section className="mt-10">
        <Eyebrow className="mb-3">Analytics {store.quizzes.total === 0 && <span className="text-muted">· awaiting data</span>}</Eyebrow>
        <div className="grid gap-3 md:grid-cols-2">
          <Dist title="Primary philosopher" data={store.quizzes.byPrimary} nameOf={(k) => PHILOSOPHER_BY_SLUG[k]?.name ?? k} />
          <Dist title="Tribe" data={store.quizzes.byTribe} nameOf={(k) => TRIBES[k as keyof typeof TRIBES]?.name ?? k} />
          <Dist title="Rarity tier" data={store.quizzes.byTier} nameOf={(k) => k} />
          <Dist title="Test length chosen" data={store.quizzes.byLen} nameOf={lenLabel} />
        </div>
        <p className="mt-3 text-xs text-muted">
          Local single-instance analytics (JSON store). Production-scale aggregation across users wants the Postgres layer (docs/04, Phase 3).
        </p>
      </section>

      {/* Battles control */}
      <section className="mt-10">
        <Eyebrow className="mb-3">Battles · control</Eyebrow>
        <AdminBattles battles={battles} />
      </section>

      {/* Daily control */}
      <section className="mt-10">
        <Eyebrow className="mb-3">Daily dilemma · control</Eyebrow>
        <AdminDaily date={today} current={store.dailyOverride[today] ?? ''} options={dailyOptions} />
        {todaySplit && (
          <p className="mt-3 text-sm text-muted">
            Today’s real split: <span className="text-chalk">{todaySplit.agree} agree</span> · <span className="text-chalk">{todaySplit.disagree} disagree</span>
          </p>
        )}
      </section>
    </main>
  );
}
