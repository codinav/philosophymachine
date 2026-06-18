'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getLastResult, getStreak, type LastResult } from '@/lib/session';
import { PHILOSOPHER_BY_SLUG } from '@/lib/data/philosophers';
import { Eyebrow, GlassCard, LinkButton, accentVars } from '@/components/ui/primitives';
import { Portrait } from '@/components/ui/Portrait';
import { SiteFooter } from '@/components/layout/SiteFooter';

// Achievement badges (docs/01 §6). Locked = silhouette → replay/return incentive.
const BADGES = [
  { id: 'first-light', name: 'First Light', desc: 'Complete your first mapping.' },
  { id: 'daily-7', name: 'Devotee', desc: 'Keep a 7-day daily streak.' },
  { id: 'nagarjuna', name: 'The Empty Mirror', desc: 'Unlock Nāgārjuna.' },
  { id: 'shankara', name: 'Non-Dual', desc: 'Unlock Shankara.' },
  { id: 'ending-sphinx', name: 'The Sphinx', desc: 'Answer in riddles.' },
  { id: 'badge-polymath', name: 'Polymath', desc: 'Match 5+ thinkers above 10%.' },
];

function levelFor(xp: number): { title: string; level: number } {
  const titles = ['Initiate', 'Seeker', 'Adept', 'Sage', 'Oracle'];
  const level = Math.min(5, Math.floor(xp / 200) + 1);
  return { title: titles[level - 1], level };
}

export default function MePage() {
  const [last, setLast] = useState<LastResult | null>(null);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    setLast(getLastResult());
    setStreak(getStreak().count);
  }, []);

  const unlocked = new Set(last?.unlocked ?? []);
  if (last) unlocked.add('first-light');
  if (streak >= 7) unlocked.add('daily-7');
  const xp = (last ? 100 : 0) + streak * 15 + unlocked.size * 25;
  const { title, level } = levelFor(xp);
  const primary = last ? PHILOSOPHER_BY_SLUG[last.primary] : null;

  return (
    <main className="mx-auto max-w-3xl px-5 pb-28 pt-10" style={primary ? accentVars(primary.accent, primary.accentSoft) : undefined}>
      <Link href="/" className="text-sm text-muted transition-colors hover:text-chalk">← Home</Link>
      <Eyebrow className="mt-8">Your dossier</Eyebrow>
      <h1 className="mt-2 font-display text-hero font-semibold">Level {level} · {title}</h1>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <GlassCard className="p-5 text-center">
          <p className="font-display text-3xl font-semibold">{xp}</p>
          <p className="mt-1 text-xs text-muted">XP</p>
        </GlassCard>
        <GlassCard className="p-5 text-center">
          <p className="font-display text-3xl font-semibold">🔥 {streak}</p>
          <p className="mt-1 text-xs text-muted">day streak</p>
        </GlassCard>
        <GlassCard className="p-5 text-center">
          <p className="font-display text-3xl font-semibold">{unlocked.size}</p>
          <p className="mt-1 text-xs text-muted">badges earned</p>
        </GlassCard>
      </div>

      {last && primary ? (
        <Link href={`/result/${last.code}`} className="mt-6 block">
          <GlassCard className="flex items-center gap-4 p-5 transition-transform hover:-translate-y-0.5">
            <Portrait sigil={primary.sigil} accent={primary.accent} accentSoft={primary.accentSoft} size="sm" />
            <div className="flex-1">
              <p className="text-xs text-muted">Your latest result</p>
              <p className="font-display text-lg font-semibold" style={{ color: primary.accent }}>You think like {primary.name}</p>
            </div>
            <span className="text-muted">→</span>
          </GlassCard>
        </Link>
      ) : (
        <GlassCard className="mt-6 p-6 text-center">
          <p className="text-muted">You haven’t taken the test yet.</p>
          <LinkButton href="/quiz" variant="accent" className="mt-4">Begin the mapping →</LinkButton>
        </GlassCard>
      )}

      <section className="mt-10">
        <Eyebrow className="mb-4">Achievements</Eyebrow>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {BADGES.map((b) => {
            const got = unlocked.has(b.id);
            return (
              <GlassCard key={b.id} className={`p-5 ${got ? '' : 'opacity-50'}`}>
                <p className="text-2xl">{got ? '◈' : '🔒'}</p>
                <p className="mt-2 font-medium">{got ? b.name : '???'}</p>
                <p className="mt-1 text-xs text-muted">{b.desc}</p>
              </GlassCard>
            );
          })}
        </div>
      </section>

      <section className="mt-10">
        <Eyebrow className="mb-4">Referrals</Eyebrow>
        <GlassCard className="p-6">
          <p className="text-sm text-chalk/85">Invite 3 friends to unlock your deep dossier and one hidden philosopher.</p>
          <div className="mt-4 flex items-center gap-2">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-0 rounded-full" style={{ background: 'var(--accent, #6366f1)' }} />
            </div>
            <span className="text-sm text-muted">0 / 3</span>
          </div>
          <p className="mt-3 text-xs text-muted">Referral attribution wires up with accounts in Phase 3 (docs/07).</p>
        </GlassCard>
      </section>

      <SiteFooter />
    </main>
  );
}
