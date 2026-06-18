import type { Metadata } from 'next';
import Link from 'next/link';
import { TRIBE_LIST } from '@/lib/data/tribes';
import { PHILOSOPHER_BY_SLUG } from '@/lib/data/philosophers';
import { accentVars, Eyebrow } from '@/components/ui/primitives';
import { PRIMARY_PRIORS } from '@/lib/data/priors';

export const metadata: Metadata = {
  title: 'The Eight Tribes',
  description: 'Rationalist, Mystic, Stoic, Existentialist, Idealist, Skeptic, Vitalist, Dharma Seeker — which worldview claims you?',
};

function tribePopulation(anchors: string[]): number {
  const sum = anchors.reduce((s, slug) => s + (PRIMARY_PRIORS[slug] ?? 0), 0);
  return Math.round(sum * 100);
}

export default function TribesPage() {
  return (
    <main className="mx-auto max-w-5xl px-5 pb-28 pt-10">
      <Link href="/" className="text-sm text-muted transition-colors hover:text-chalk">← Home</Link>
      <Eyebrow className="mt-8">Eight worldviews</Eyebrow>
      <h1 className="mt-2 font-display text-hero font-semibold">The Tribes</h1>
      <p className="mt-4 max-w-xl text-lg text-muted">
        Above the seventeen thinkers sit eight archetypes — coarser, more tribal identities. Every result
        belongs to one. Which claims you?
      </p>

      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {TRIBE_LIST.map((t) => (
          <Link
            key={t.slug}
            href={`/tribe/${t.slug}`}
            className="glass group rounded-3xl p-6 transition-transform hover:-translate-y-1"
            style={accentVars(t.accent, t.accentSoft)}
          >
            <div className="flex items-center justify-between">
              <span className="text-4xl" style={{ color: t.accent }}>{t.sigil}</span>
              <span className="text-xs text-muted">~{tribePopulation(t.anchors)}% of minds</span>
            </div>
            <h2 className="mt-4 font-display text-2xl font-semibold">{t.name}</h2>
            <p className="mt-2 text-sm leading-relaxed text-chalk/75">{t.essence}</p>
            <p className="mt-4 text-xs text-muted">
              {t.anchors.map((s) => PHILOSOPHER_BY_SLUG[s]?.name).filter(Boolean).join(' · ')}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
