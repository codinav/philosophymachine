import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { TRIBES, TRIBE_LIST } from '@/lib/data/tribes';
import { PHILOSOPHER_BY_SLUG } from '@/lib/data/philosophers';
import { accentVars, Eyebrow, LinkButton } from '@/components/ui/primitives';
import { Portrait } from '@/components/ui/Portrait';
import { PRIMARY_PRIORS } from '@/lib/data/priors';
import type { TribeSlug } from '@/types';

export function generateStaticParams() {
  return TRIBE_LIST.map((t) => ({ slug: t.slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const t = TRIBES[slug as TribeSlug];
  if (!t) return { title: 'Tribe' };
  return { title: `${t.name} Tribe`, description: t.essence };
}

export default async function TribePage({ params }: Params) {
  const { slug } = await params;
  const t = TRIBES[slug as TribeSlug];
  if (!t) notFound();
  const pop = Math.round(t.anchors.reduce((s, a) => s + (PRIMARY_PRIORS[a] ?? 0), 0) * 100);

  return (
    <main className="mx-auto max-w-3xl px-5 pb-28 pt-10" style={accentVars(t.accent, t.accentSoft)}>
      <Link href="/tribes" className="text-sm text-muted transition-colors hover:text-chalk">← All tribes</Link>

      <div className="mt-10 text-center">
        <div className="text-7xl" style={{ color: t.accent }}>{t.sigil}</div>
        <Eyebrow className="mt-6">The {t.name} tribe · ~{pop}% of minds</Eyebrow>
        <h1 className="mt-3 font-display text-hero font-semibold" style={{ color: t.accent }}>{t.name}</h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-chalk/80">{t.essence}</p>
      </div>

      <section className="glass mt-12 rounded-3xl p-8 text-center">
        <Eyebrow>The manifesto</Eyebrow>
        <p className="mt-4 font-display text-2xl italic leading-relaxed">{t.manifesto}</p>
      </section>

      <section className="mt-10">
        <Eyebrow className="mb-5">Thinkers of this tribe</Eyebrow>
        <div className="grid gap-3 sm:grid-cols-2">
          {t.anchors.map((slug) => {
            const p = PHILOSOPHER_BY_SLUG[slug];
            if (!p) return null;
            return (
              <Link key={slug} href={`/philosopher/${slug}`} className="glass flex items-center gap-4 rounded-2xl p-4 transition-transform hover:-translate-y-0.5" style={accentVars(p.accent, p.accentSoft)}>
                <Portrait sigil={p.sigil} accent={p.accent} accentSoft={p.accentSoft} size="sm" />
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-xs text-muted">{p.tradition}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <div className="mt-12 text-center">
        <p className="mb-4 text-muted">Don&apos;t know your tribe yet?</p>
        <LinkButton href="/quiz" variant="accent">Take the test →</LinkButton>
      </div>
    </main>
  );
}
