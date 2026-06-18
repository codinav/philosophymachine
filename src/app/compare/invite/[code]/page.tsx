import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { decodeResult } from '@/lib/codec';
import { buildResultFromVector } from '@/lib/scoring';
import { PHILOSOPHER_BY_SLUG } from '@/lib/data/philosophers';
import { TRIBES } from '@/lib/data/tribes';
import { accentVars, Eyebrow, LinkButton } from '@/components/ui/primitives';
import { Portrait } from '@/components/ui/Portrait';
import { cleanName } from '@/lib/name';

type Params = { params: Promise<{ code: string }>; searchParams: Promise<{ n?: string }> };

export async function generateMetadata({ params, searchParams }: Params): Promise<Metadata> {
  const { code } = await params;
  const name = cleanName((await searchParams).n);
  const d = decodeResult(code);
  if (!d) return { title: 'Compare' };
  const r = buildResultFromVector(d.dimensions, d.aporiaCount, d.isDeep, 18);
  const p = PHILOSOPHER_BY_SLUG[r.primary];
  const who = name || 'A friend';
  return {
    title: `Compare your worldview with ${name || `a ${p.name}`}`,
    description: `${who} thinks like ${p.name}. How aligned are you? Take the test and find out.`,
  };
}

export default async function CompareInvitePage({ params, searchParams }: Params) {
  const { code } = await params;
  const name = cleanName((await searchParams).n);
  const d = decodeResult(code);
  if (!d) notFound();
  const r = buildResultFromVector(d.dimensions, d.aporiaCount, d.isDeep, 18);
  const p = PHILOSOPHER_BY_SLUG[r.primary];
  const tribe = TRIBES[r.tribe];

  return (
    <main className="mx-auto max-w-xl px-5 pb-28 pt-12 text-center" style={accentVars(p.accent, p.accentSoft)}>
      <Eyebrow>{name ? `${name} wants to compare worldviews` : 'Someone wants to compare worldviews'}</Eyebrow>
      <div className="mt-8 flex justify-center">
        <Portrait sigil={p.sigil} accent={p.accent} accentSoft={p.accentSoft} size="lg" />
      </div>
      <h1 className="mt-6 font-display text-display font-semibold">
        {name || 'They'} think{name ? 's' : ''} like <span style={{ color: p.accent }}>{p.name}</span>.
      </h1>
      <p className="mt-3 text-muted">
        {tribe.name} tribe · {r.blend.slice(0, 3).map((b) => `${b.pct}% ${PHILOSOPHER_BY_SLUG[b.slug].name}`).join(' · ')}
      </p>
      <p className="mx-auto mt-6 max-w-sm text-lg text-chalk/80">
        How aligned are <em>you</em>? Take the test — the moment you finish, you&apos;ll see exactly how much your
        worldviews agree.
      </p>
      <div className="mt-8">
        <LinkButton href={`/quiz?compare=${code}`} variant="accent">Take the test & compare →</LinkButton>
      </div>
      <p className="mt-4 text-xs text-muted">~3 minutes · no signup</p>
      <Link href="/" className="mt-10 inline-block text-sm text-muted hover:text-chalk">What is the Philosophy Machine?</Link>
    </main>
  );
}
