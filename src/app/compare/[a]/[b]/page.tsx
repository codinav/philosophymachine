import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { decodeResult } from '@/lib/codec';
import { buildResultFromVector } from '@/lib/scoring';
import { compareVectors, philosopherName } from '@/lib/compare';
import { PHILOSOPHER_BY_SLUG } from '@/lib/data/philosophers';
import { Eyebrow, LinkButton } from '@/components/ui/primitives';

type Params = { params: Promise<{ a: string; b: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { a, b } = await params;
  const da = decodeResult(a);
  const db = decodeResult(b);
  if (!da || !db) return { title: 'Compare' };
  const cmp = compareVectors(da.dimensions, db.dimensions);
  return {
    title: `${cmp.agreementPct}% aligned`,
    description: `Two worldviews compared on the Philosophy Machine — ${cmp.agreementPct}% aligned.`,
  };
}

export default async function ComparePage({ params }: Params) {
  const { a, b } = await params;
  const da = decodeResult(a);
  const db = decodeResult(b);
  if (!da || !db) notFound();

  const ra = buildResultFromVector(da.dimensions, da.aporiaCount, da.isDeep, 18);
  const rb = buildResultFromVector(db.dimensions, db.aporiaCount, db.isDeep, 18);
  const cmp = compareVectors(da.dimensions, db.dimensions);
  const pa = PHILOSOPHER_BY_SLUG[ra.primary];
  const pb = PHILOSOPHER_BY_SLUG[rb.primary];

  return (
    <main className="mx-auto max-w-2xl px-5 pb-28 pt-10">
      <Link href="/" className="text-sm text-muted transition-colors hover:text-chalk">← Home</Link>

      <div className="mt-10 text-center">
        <Eyebrow>Two minds compared</Eyebrow>
        <div className="mt-6 flex items-center justify-center gap-3 sm:gap-6">
          <div className="flex-1 text-center sm:flex-none">
            <p className="font-display text-lg font-semibold sm:text-xl" style={{ color: pa.accent }}>{pa.name}</p>
            <p className="text-xs text-muted">Mind A</p>
          </div>
          <div className="relative grid h-24 w-24 shrink-0 place-items-center rounded-full glass-strong sm:h-28 sm:w-28">
            <span className="font-display text-3xl font-semibold sm:text-4xl">{cmp.agreementPct}%</span>
          </div>
          <div className="flex-1 text-center sm:flex-none">
            <p className="font-display text-lg font-semibold sm:text-xl" style={{ color: pb.accent }}>{pb.name}</p>
            <p className="text-xs text-muted">Mind B</p>
          </div>
        </div>
        <p className="mt-5 font-display text-2xl">You agree on <span className="accent-text">{cmp.agreementPct}%</span> of your worldview.</p>
      </div>

      <section className="glass mt-10 rounded-3xl p-6">
        <Eyebrow className="mb-4">Agreement by dimension</Eyebrow>
        <div className="flex flex-col gap-3">
          {cmp.dimensions.map((d) => (
            <div key={d.key} className="flex items-center gap-3 text-sm">
              <span className="w-24 shrink-0 text-muted">{d.label}</span>
              <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${d.agreement}%`, background: d.agreement > 60 ? '#34d399' : d.agreement > 35 ? '#f59e0b' : '#ef4444' }} />
              </div>
              <span className="w-10 text-right tabular-nums">{d.agreement}%</span>
            </div>
          ))}
        </div>
      </section>

      <section className="glass mt-5 rounded-3xl p-6">
        <p className="text-xs uppercase tracking-[0.25em] text-muted">⚡ Where you clash hardest</p>
        <h3 className="mt-2 font-display text-xl font-semibold">{cmp.biggestClash.label}</h3>
        <p className="mt-2 text-sm text-chalk/80">Mind A: {cmp.biggestClash.aPhrase}.</p>
        <p className="mt-1 text-sm text-chalk/80">Mind B: {cmp.biggestClash.bPhrase}.</p>
      </section>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="glass rounded-3xl p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-muted">Shared thinker</p>
          <p className="mt-2 font-display text-lg font-semibold">{philosopherName(cmp.sharedPhilosopher)}</p>
        </div>
        <div className="glass rounded-3xl p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-muted">Your bridge</p>
          <p className="mt-2 font-display text-lg font-semibold">{philosopherName(cmp.bridgeThinker)}</p>
        </div>
      </div>

      <div className="mt-10 text-center">
        <LinkButton href="/quiz" variant="accent">Compare with someone else →</LinkButton>
      </div>
    </main>
  );
}
