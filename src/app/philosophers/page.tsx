import type { Metadata } from 'next';
import Link from 'next/link';
import { PHILOSOPHERS } from '@/lib/data/philosophers';
import { accentVars, Eyebrow } from '@/components/ui/primitives';
import { Portrait } from '@/components/ui/Portrait';

export const metadata: Metadata = {
  title: 'The Thinkers',
  description: '17 philosophers and spiritual thinkers across East and West, from Socrates to Nietzsche to the Buddha.',
};

export default function PhilosophersPage() {
  return (
    <main className="mx-auto max-w-5xl px-5 pb-28 pt-10">
      <Link href="/" className="text-sm text-muted transition-colors hover:text-chalk">← Home</Link>
      <Eyebrow className="mt-8">East and West · 17 minds</Eyebrow>
      <h1 className="mt-2 font-display text-hero font-semibold">The Thinkers</h1>
      <p className="mt-4 max-w-xl text-lg text-muted">The cast the machine maps you against. Two remain hidden — reachable only by the rarest answers.</p>

      <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {PHILOSOPHERS.map((p) => (
          <Link
            key={p.slug}
            href={`/philosopher/${p.slug}`}
            className="glass rounded-3xl p-5 transition-transform hover:-translate-y-1"
            style={accentVars(p.accent, p.accentSoft)}
          >
            <div className="flex items-center gap-4">
              <Portrait sigil={p.sigil} accent={p.accent} accentSoft={p.accentSoft} size="sm" />
              <div>
                <p className="font-display text-lg font-semibold">{p.name}{p.hidden && <span className="ml-2 text-xs text-muted">hidden</span>}</p>
                <p className="text-xs text-muted">{p.tradition} · {p.era}</p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-snug text-chalk/75">{p.oneLiner}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
