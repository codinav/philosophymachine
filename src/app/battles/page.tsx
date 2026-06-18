import type { Metadata } from 'next';
import Link from 'next/link';
import { BATTLES, SEED_VOTES } from '@/lib/data/battles';
import { PHILOSOPHER_BY_SLUG } from '@/lib/data/philosophers';
import { getStore } from '@/lib/store';
import { Eyebrow } from '@/components/ui/primitives';

export const metadata: Metadata = {
  title: 'Battle Mode',
  description: 'Nietzsche vs Buddha. Kant vs Krishna. Camus vs Sartre. The world is voting. Pick a side.',
};

export const dynamic = 'force-dynamic'; // live tallies

export default async function BattlesPage() {
  const store = await getStore();
  const tally = (slug: string) => {
    const s = SEED_VOTES[slug] ?? { a: 0, b: 0 };
    const l = store.battles[slug] ?? { a: 0, b: 0 };
    return { a: s.a + l.a, b: s.b + l.b };
  };
  const ranked = [...BATTLES].sort((a, b) => {
    const va = tally(a.slug);
    const vb = tally(b.slug);
    return vb.a + vb.b - (va.a + va.b);
  });

  return (
    <main className="mx-auto max-w-3xl px-5 pb-28 pt-10">
      <Link href="/" className="text-sm text-muted transition-colors hover:text-chalk">← Home</Link>
      <Eyebrow className="mt-8">The world is voting</Eyebrow>
      <h1 className="mt-2 font-display text-hero font-semibold">Battle Mode</h1>
      <p className="mt-4 max-w-xl text-lg text-muted">Two worldviews enter. You decide. New marquee battle every week.</p>

      <div className="mt-12 flex flex-col gap-4">
        {ranked.map((b) => {
          const a = PHILOSOPHER_BY_SLUG[b.sideA];
          const c = PHILOSOPHER_BY_SLUG[b.sideB];
          const votes = tally(b.slug);
          const total = votes.a + votes.b || 1;
          const pctA = Math.round((votes.a / total) * 100);
          return (
            <Link key={b.slug} href={`/battle/${b.slug}`} className="glass rounded-3xl p-6 transition-transform hover:-translate-y-0.5">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl font-semibold">{b.title}</h2>
                {!b.active && <span className="text-xs text-muted">finished</span>}
              </div>
              <p className="mt-1 text-sm text-muted">{b.prompt}</p>
              <div className="mt-4 flex items-center gap-3 text-sm">
                <span style={{ color: a.accent }}>{a.name} {pctA}%</span>
                <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                  <div className="absolute inset-y-0 left-0" style={{ width: `${pctA}%`, background: a.accent }} />
                  <div className="absolute inset-y-0 right-0" style={{ width: `${100 - pctA}%`, background: c.accent }} />
                </div>
                <span style={{ color: c.accent }}>{100 - pctA}% {c.name}</span>
              </div>
              <p className="mt-2 text-xs text-muted">{total.toLocaleString()} votes</p>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
