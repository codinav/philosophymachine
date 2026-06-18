'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { Battle } from '@/types';
import { PHILOSOPHER_BY_SLUG } from '@/lib/data/philosophers';
import { Portrait } from '@/components/ui/Portrait';

export function BattleVote({ battle, seed }: { battle: Battle; seed: { a: number; b: number } }) {
  const a = PHILOSOPHER_BY_SLUG[battle.sideA];
  const c = PHILOSOPHER_BY_SLUG[battle.sideB];
  const key = `pm:battle:${battle.slug}`;

  const [votes, setVotes] = useState(seed);
  const [chosen, setChosen] = useState<'a' | 'b' | null>(null);

  useEffect(() => {
    // Votes now persist server-side and are included in `seed`, so we only
    // restore the "already voted" UI state here (no optimistic +1, or we'd
    // double-count the returning voter's own vote).
    try {
      const prev = localStorage.getItem(key) as 'a' | 'b' | null;
      if (prev) setChosen(prev);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const vote = (side: 'a' | 'b') => {
    if (chosen) return;
    setChosen(side);
    setVotes((v) => ({ ...v, [side]: v[side] + 1 }));
    try {
      localStorage.setItem(key, side);
    } catch {}
    // best-effort persist; works without a backend (docs/03 §API).
    fetch('/api/battle/vote', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ battleSlug: battle.slug, side }),
    }).catch(() => {});
  };

  const total = votes.a + votes.b || 1;
  const pctA = Math.round((votes.a / total) * 100);
  const pctB = 100 - pctA;

  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        {([
          { side: 'a' as const, p: a, pct: pctA },
          { side: 'b' as const, p: c, pct: pctB },
        ]).map(({ side, p, pct }) => (
          <button
            key={side}
            onClick={() => vote(side)}
            disabled={!!chosen}
            className={`glass relative overflow-hidden rounded-3xl p-6 text-center transition-all ${chosen ? '' : 'hover:-translate-y-1'} ${chosen === side ? 'ring-2' : ''}`}
            style={{ ['--accent' as string]: p.accent, ['--accent-soft' as string]: p.accentSoft, ...(chosen === side ? { boxShadow: `0 0 40px -8px ${p.accentSoft}` } : {}) }}
          >
            <div className="flex justify-center">
              <Portrait sigil={p.sigil} accent={p.accent} accentSoft={p.accentSoft} size="md" />
            </div>
            <p className="mt-4 font-display text-xl font-semibold" style={{ color: p.accent }}>{p.name}</p>
            <p className="mt-1 text-xs text-muted">{p.oneLiner}</p>
            {chosen && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 font-display text-4xl font-semibold">
                {pct}%
              </motion.p>
            )}
          </button>
        ))}
      </div>

      {chosen ? (
        <div className="mt-6 text-center">
          <p className="text-muted">
            You sided with <span className="accent-text" style={{ color: (chosen === 'a' ? a : c).accent }}>{(chosen === 'a' ? a : c).name}</span>. {total.toLocaleString()} minds have voted.
          </p>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`${a.name} vs ${c.name} — I sided with ${(chosen === 'a' ? a : c).name}. Which side are you on? `)}`}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex rounded-full bg-chalk px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-white"
          >
            Recruit your side →
          </a>
        </div>
      ) : (
        <p className="mt-6 text-center text-sm text-muted">Tap a thinker to cast your vote.</p>
      )}
    </div>
  );
}
