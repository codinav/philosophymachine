import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BATTLES, BATTLE_BY_SLUG, SEED_VOTES } from '@/lib/data/battles';
import { Eyebrow } from '@/components/ui/primitives';
import { BattleVote } from '@/components/BattleVote';

export function generateStaticParams() {
  return BATTLES.map((b) => ({ slug: b.slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const b = BATTLE_BY_SLUG[slug];
  if (!b) return { title: 'Battle' };
  return { title: b.title, description: b.prompt };
}

export default async function BattlePage({ params }: Params) {
  const { slug } = await params;
  const b = BATTLE_BY_SLUG[slug];
  if (!b) notFound();
  const seed = SEED_VOTES[slug] ?? { a: 1, b: 1 };

  return (
    <main className="mx-auto max-w-2xl px-5 pb-28 pt-10">
      <Link href="/battles" className="text-sm text-muted transition-colors hover:text-chalk">← All battles</Link>
      <div className="mt-10 text-center">
        <Eyebrow>Battle Mode</Eyebrow>
        <h1 className="mt-2 font-display text-display font-semibold">{b.title}</h1>
        <p className="mx-auto mt-3 max-w-md text-muted">{b.prompt}</p>
      </div>
      <div className="mt-10">
        <BattleVote battle={b} seed={seed} />
      </div>
    </main>
  );
}
