import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PHILOSOPHERS, PHILOSOPHER_BY_SLUG } from '@/lib/data/philosophers';
import { TRIBES } from '@/lib/data/tribes';
import { DIMENSION_META } from '@/lib/dossier';
import { DIMENSIONS } from '@/types';
import type { Dimension } from '@/types';
import { accentVars, Eyebrow, LinkButton } from '@/components/ui/primitives';
import { Portrait } from '@/components/ui/Portrait';

export function generateStaticParams() {
  return PHILOSOPHERS.map((p) => ({ slug: p.slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = PHILOSOPHER_BY_SLUG[slug];
  if (!p) return { title: 'Thinker' };
  return { title: p.name, description: p.oneLiner };
}

export default async function PhilosopherPage({ params }: Params) {
  const { slug } = await params;
  const p = PHILOSOPHER_BY_SLUG[slug];
  if (!p) notFound();
  const tribe = TRIBES[p.tribe];

  // strongest positions for a quick "where they stand"
  const positions = (DIMENSIONS as readonly Dimension[])
    .map((d) => ({ d, v: p.vector[d] ?? 0 }))
    .filter((x) => Math.abs(x.v) > 0.3)
    .sort((a, b) => Math.abs(b.v) - Math.abs(a.v))
    .slice(0, 5);

  return (
    <main className="mx-auto max-w-3xl px-5 pb-28 pt-10" style={accentVars(p.accent, p.accentSoft)}>
      <Link href="/philosophers" className="text-sm text-muted transition-colors hover:text-chalk">← All thinkers</Link>

      <div className="mt-10 flex flex-col items-center text-center">
        <Portrait sigil={p.sigil} accent={p.accent} accentSoft={p.accentSoft} size="xl" />
        <Eyebrow className="mt-6">{p.tradition} · {p.era}</Eyebrow>
        <h1 className="mt-3 font-display text-hero font-semibold" style={{ color: p.accent }}>{p.name}</h1>
        <p className="mt-3 max-w-md text-lg text-chalk/80">{p.bio}</p>
        <Link href={`/tribe/${tribe.slug}`} className="mt-5 inline-flex rounded-full border px-3 py-1.5 text-xs uppercase tracking-widest" style={{ borderColor: tribe.accent, color: tribe.accent }}>
          {tribe.sigil} {tribe.name} tribe
        </Link>
      </div>

      <section className="glass mt-12 rounded-3xl p-8 text-center">
        <p className="font-display text-2xl italic leading-snug">“{p.quote}”</p>
      </section>

      <section className="mt-8">
        <Eyebrow className="mb-4">Where {p.name.split(' ').slice(-1)} stands</Eyebrow>
        <div className="flex flex-col gap-3">
          {positions.map((x) => {
            const meta = DIMENSION_META[x.d];
            return (
              <div key={x.d} className="glass rounded-2xl p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">{meta.label}</span>
                  <span className="font-medium accent-text">{x.v >= 0 ? meta.posPole : meta.negPole}</span>
                </div>
                <p className="mt-1 text-xs text-muted">{x.v >= 0 ? meta.pos : meta.neg}.</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-8">
        <Eyebrow className="mb-3">Read</Eyebrow>
        <ul className="flex flex-col gap-2">
          {p.reading.map((r) => (
            <li key={r} className="text-sm text-chalk/85"><span className="accent-text">›</span> {r}</li>
          ))}
        </ul>
      </section>

      <div className="mt-12 text-center">
        <p className="mb-4 text-muted">Are you closer to {p.name.split(' ')[0]} than you think?</p>
        <div className="flex flex-wrap justify-center gap-3">
          <LinkButton href="/quiz" variant="accent">Find out — take the test</LinkButton>
          <LinkButton href={`/chat/${p.slug}`} variant="ghost">Chat with {p.name.split(' ')[0]} →</LinkButton>
        </div>
      </div>
    </main>
  );
}
