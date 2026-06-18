import type { Metadata } from 'next';
import Link from 'next/link';
import { DAILY_POOL, QUESTION_BY_ID } from '@/lib/data/questions';
import { VISIBLE_PHILOSOPHERS } from '@/lib/data/philosophers';
import { getDailyOverride, getDailySplit } from '@/lib/store';
import { DIMENSIONS } from '@/types';
import type { Dimension } from '@/types';
import { Eyebrow } from '@/components/ui/primitives';
import { DailyDilemma } from '@/components/DailyDilemma';

export const metadata: Metadata = {
  title: 'Daily Dilemma',
  description: 'One dilemma a day. See how the world answered. Build your streak.',
};

export const dynamic = 'force-dynamic'; // the dilemma rotates by date

function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export default async function DailyPage() {
  const today = new Date().toISOString().slice(0, 10);
  const sliders = DAILY_POOL.filter((q) => q.format === 'slider');
  // Admin can override today's dilemma; otherwise it's auto-picked by date.
  const override = await getDailyOverride(today);
  const question = (override && QUESTION_BY_ID[override]) || sliders[hashStr(today) % sliders.length];

  // agree-direction weights → which thinkers would side with "agree"
  const w = question.options[0].weights;
  const scored = VISIBLE_PHILOSOPHERS.map((p) => {
    let dot = 0;
    for (const d of DIMENSIONS as readonly Dimension[]) dot += (w[d] ?? 0) * (p.vector[d] ?? 0);
    return { name: p.name, dot };
  });
  const agreeAllies = [...scored].sort((a, b) => b.dot - a.dot).slice(0, 2).map((x) => x.name);
  const disagreeAllies = [...scored].sort((a, b) => a.dot - b.dot).slice(0, 2).map((x) => x.name);
  // Use the real recorded split once enough people have answered; else a stable estimate.
  const split = await getDailySplit(today);
  const realTotal = split ? split.agree + split.disagree : 0;
  const globalAgreePct = realTotal >= 5 ? Math.round((split!.agree / realTotal) * 100) : 35 + (hashStr(question.id) % 31);

  return (
    <main className="mx-auto max-w-2xl px-5 pb-28 pt-10">
      <Link href="/" className="text-sm text-muted transition-colors hover:text-chalk">← Home</Link>
      <Eyebrow className="mt-8">Every day, one question</Eyebrow>
      <h1 className="mt-2 font-display text-hero font-semibold">Daily Dilemma</h1>
      <p className="mt-4 max-w-lg text-lg text-muted">A single dilemma, the same for everyone, every day. Answer it, see where the world stands, and keep your streak burning.</p>

      <div className="mt-10">
        <DailyDilemma
          question={question}
          today={today}
          globalAgreePct={globalAgreePct}
          agreeAllies={agreeAllies}
          disagreeAllies={disagreeAllies}
        />
      </div>
    </main>
  );
}
