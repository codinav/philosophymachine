'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { Question } from '@/types';
import { bumpStreak, getStreak } from '@/lib/session';

export function DailyDilemma({
  question,
  today,
  globalAgreePct,
  agreeAllies,
  disagreeAllies,
}: {
  question: Question;
  today: string;
  globalAgreePct: number;
  agreeAllies: string[];
  disagreeAllies: string[];
}) {
  const [answered, setAnswered] = useState<null | 'agree' | 'disagree'>(null);
  const [streak, setStreak] = useState(0);
  const key = `pm:daily:${today}`;

  useEffect(() => {
    try {
      const prev = localStorage.getItem(key) as 'agree' | 'disagree' | null;
      if (prev) setAnswered(prev);
    } catch {}
    setStreak(getStreak().count);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const answer = (choice: 'agree' | 'disagree') => {
    if (answered) return;
    setAnswered(choice);
    try {
      localStorage.setItem(key, choice);
    } catch {}
    setStreak(bumpStreak(today).count);
    // record for admin analytics + real global split (no PII)
    fetch('/api/event', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ type: 'daily_answer', date: today, choice }),
    }).catch(() => {});
  };

  const youAgree = answered === 'agree';
  const youPct = youAgree ? globalAgreePct : 100 - globalAgreePct;
  const allies = youAgree ? agreeAllies : disagreeAllies;

  return (
    <div>
      <div className="glass-strong rounded-3xl p-7 sm:p-9">
        <p className="text-xs uppercase tracking-[0.3em] text-muted">Today&apos;s dilemma · {today}</p>
        <h2 className="mt-4 font-display text-3xl font-semibold leading-snug sm:text-4xl">{question.prompt}</h2>

        {!answered ? (
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button onClick={() => answer('disagree')} className="glass flex-1 rounded-2xl py-4 text-lg transition-all hover:bg-white/[0.08]">
              Disagree
            </button>
            <button onClick={() => answer('agree')} className="flex-1 rounded-2xl py-4 text-lg font-medium text-ink transition-all hover:brightness-110" style={{ background: 'var(--accent)' }}>
              Agree
            </button>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
            <div className="flex items-center justify-between text-sm">
              <span>You {answered}d</span>
              <span className="text-muted">{globalAgreePct}% of all minds agreed</span>
            </div>
            <div className="mt-2 flex h-3 overflow-hidden rounded-full bg-white/[0.06]">
              <div style={{ width: `${globalAgreePct}%`, background: 'var(--accent)' }} />
            </div>
            <p className="mt-5 text-sm text-muted">
              You&apos;re with the <span className="accent-text">{youPct}%</span>. Thinkers who&apos;d take your side:{' '}
              <span className="text-chalk">{allies.join(', ')}</span>.
            </p>
          </motion.div>
        )}
      </div>

      <div className="mt-5 flex items-center justify-center gap-3 text-center">
        <span className="text-2xl">🔥</span>
        <div>
          <p className="font-display text-2xl font-semibold">{streak} day{streak === 1 ? '' : 's'}</p>
          <p className="text-xs text-muted">{answered ? 'Come back tomorrow to keep your streak alive.' : 'Answer to start your streak.'}</p>
        </div>
      </div>
    </div>
  );
}
