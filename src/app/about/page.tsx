import type { Metadata } from 'next';
import Link from 'next/link';
import { DIMENSION_META } from '@/lib/dossier';
import { DIMENSIONS } from '@/types';
import type { Dimension } from '@/types';
import { Eyebrow, GlassCard, LinkButton } from '@/components/ui/primitives';
import { SiteFooter } from '@/components/layout/SiteFooter';

export const metadata: Metadata = {
  title: 'The Method',
  description: 'How the Philosophy Machine maps your worldview — the nine dimensions, the scoring, and why it’s real philosophy.',
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 pb-28 pt-10">
      <Link href="/" className="text-sm text-muted transition-colors hover:text-chalk">← Home</Link>
      <Eyebrow className="mt-8">Methodology</Eyebrow>
      <h1 className="mt-2 font-display text-hero font-semibold">This is real philosophy.</h1>
      <p className="mt-5 text-lg leading-relaxed text-muted">
        Most "which philosopher are you" quizzes are vibes. This one is built on a transparent model. Your
        answers are projected onto nine axes of belief — the same axes on which we’ve placed seventeen
        thinkers from real positions in metaphysics, epistemology, ethics, and theology. Your result is the
        nearest match in that space, plus the blend and the tensions that make you you.
      </p>

      <section className="mt-12">
        <Eyebrow className="mb-5">The nine dimensions</Eyebrow>
        <div className="grid gap-3 sm:grid-cols-2">
          {(DIMENSIONS as readonly Dimension[]).map((d) => {
            const m = DIMENSION_META[d];
            return (
              <GlassCard key={d} className="p-5">
                <p className="font-display text-lg font-semibold">{m.label}</p>
                <p className="mt-1 text-sm text-muted">
                  <span className="accent-text">{m.negPole}</span> ↔ <span className="accent-text">{m.posPole}</span>
                </p>
              </GlassCard>
            );
          })}
        </div>
      </section>

      <section className="mt-12">
        <Eyebrow className="mb-4">How scoring works</Eyebrow>
        <ol className="flex flex-col gap-3 text-chalk/85">
          <li><span className="accent-text font-medium">1.</span> Each answer adds weighted signal to the dimensions it touches; we compress the totals so strong, repeated convictions approach the extremes while incidental leanings stay near the center.</li>
          <li><span className="accent-text font-medium">2.</span> We compare your vector to each thinker using a salience-weighted blend of direction (cosine) and intensity (distance) — you match most on what you care about most.</li>
          <li><span className="accent-text font-medium">3.</span> A softmax turns those scores into your percentage blend. Your tribe is the nearest archetype; your rarity is how far you sit from the human average.</li>
          <li><span className="accent-text font-medium">4.</span> The whole computation is deterministic and runs in your browser. The same answers always give the same result — no black box.</li>
        </ol>
        <p className="mt-5 text-sm text-muted">
          The placements are defensible readings, not dogma. We publish them openly (see the repo’s
          <code className="mx-1 rounded bg-white/10 px-1.5 py-0.5">docs/06-philosopher-mapping.md</code>) and welcome argument — that’s the point.
        </p>
      </section>

      <div className="mt-12 text-center">
        <LinkButton href="/quiz" variant="accent">Map your worldview →</LinkButton>
      </div>

      <SiteFooter />
    </main>
  );
}
