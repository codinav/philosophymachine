'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import type { ResultPayload } from '@/types';
import type { Unlock } from '@/lib/unlocks';
import { PHILOSOPHER_BY_SLUG } from '@/lib/data/philosophers';
import { TRIBES } from '@/lib/data/tribes';
import { Portrait } from '@/components/ui/Portrait';
import { accentVars } from '@/components/ui/primitives';
import { BlendBars } from './BlendBars';
import { RarityBadge } from './RarityBadge';
import { ShareSheet } from './ShareSheet';
import { Dossier } from './Dossier';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { takeRevealUnlocks } from '@/lib/session';

type FullResult = ResultPayload & { unlocks: Unlock[] };

const ease = [0.22, 1, 0.36, 1] as const;

export function ResultView({ result, code, name }: { result: FullResult; code: string; name?: string }) {
  const params = useSearchParams();
  const isReveal = params.get('reveal') === '1';
  const primary = PHILOSOPHER_BY_SLUG[result.primary];
  const nq = name ? `?n=${encodeURIComponent(name)}` : '';
  const tribe = TRIBES[result.tribe];
  const [unlocks, setUnlocks] = useState<Unlock[]>(result.unlocks ?? []);
  const [shareOpen, setShareOpen] = useState(true);

  useEffect(() => {
    // Fresh reveals carry the rich unlock blurbs through session storage.
    const fresh = takeRevealUnlocks(code);
    if (fresh && fresh.length) setUnlocks(fresh);
  }, [code]);

  const philosopherUnlocks = unlocks.filter((u) => u.kind === 'philosopher');
  const otherUnlocks = unlocks.filter((u) => u.kind !== 'philosopher');

  return (
    <main className="mx-auto max-w-2xl px-5 pb-28 pt-8" style={accentVars(primary.accent, primary.accentSoft)}>
      <Link href="/" className="mb-6 inline-block text-sm text-muted transition-colors hover:text-chalk">
        ← The Philosophy Machine
      </Link>

      {/* Hero / reveal */}
      <motion.section
        initial={isReveal ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        className="glass-strong relative overflow-hidden rounded-[2rem] p-7 text-center sm:p-10"
      >
        <div
          className="pointer-events-none absolute inset-x-0 -top-1/3 h-2/3"
          style={{ background: 'radial-gradient(50% 60% at 50% 50%, var(--accent-soft), transparent 70%)', opacity: 0.6 }}
        />
        <motion.div
          className="relative flex justify-center"
          initial={isReveal ? { scale: 0.6, opacity: 0, filter: 'blur(12px)' } : false}
          animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.9, ease }}
        >
          <Portrait sigil={primary.sigil} accent={primary.accent} accentSoft={primary.accentSoft} size="xl" />
        </motion.div>

        <motion.p
          initial={isReveal ? { opacity: 0, y: 10 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: isReveal ? 0.5 : 0, duration: 0.6 }}
          className="relative mt-6 text-xs uppercase tracking-[0.3em] text-muted"
        >
          {name ? `${name}, you think like` : 'You think like'}
        </motion.p>
        <motion.h1
          initial={isReveal ? { opacity: 0, y: 14 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: isReveal ? 0.7 : 0, duration: 0.7, ease }}
          className="relative mt-1 font-display text-5xl font-semibold sm:text-6xl"
          style={{ color: primary.accent }}
        >
          {primary.name}
        </motion.h1>
        <motion.p
          initial={isReveal ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ delay: isReveal ? 0.95 : 0 }}
          className="relative mx-auto mt-3 max-w-md font-display text-lg italic text-chalk/80"
        >
          {primary.oneLiner}
        </motion.p>

        <motion.div
          initial={isReveal ? { opacity: 0, y: 12 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: isReveal ? 1.1 : 0 }}
          className="relative mx-auto mt-8 max-w-md"
        >
          <BlendBars blend={result.blend} animate={isReveal} />
        </motion.div>

        <motion.div
          initial={isReveal ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ delay: isReveal ? 1.6 : 0 }}
          className="relative mt-7 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            href={`/tribe/${tribe.slug}`}
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs uppercase tracking-widest transition-transform hover:-translate-y-0.5"
            style={{ borderColor: tribe.accent, color: tribe.accent }}
          >
            <span>{tribe.sigil}</span> {tribe.name} tribe
          </Link>
          <RarityBadge pct={result.rarityPct} tier={result.rarityTier} />
        </motion.div>
      </motion.section>

      {/* Unlock banners — the rare drops */}
      <AnimatePresence>
        {philosopherUnlocks.map((u) => {
          const ph = PHILOSOPHER_BY_SLUG[u.id];
          return (
            <motion.div
              key={u.id}
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: isReveal ? 1.9 : 0.1, duration: 0.6, ease }}
              className="mt-4 overflow-hidden rounded-3xl border p-6"
              style={{ ...accentVars(ph?.accent ?? '#fff', ph?.accentSoft ?? 'rgba(255,255,255,0.4)'), borderColor: ph?.accent }}
            >
              <p className="text-xs uppercase tracking-[0.3em] accent-text">✦ Hidden philosopher unlocked · only {u.rate}</p>
              <h3 className="mt-2 font-display text-2xl font-semibold">{u.label}</h3>
              <p className="mt-2 leading-relaxed text-chalk/85">{u.blurb}</p>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {otherUnlocks.map((u) => (
        <motion.div
          key={u.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4"
        >
          <p className="text-sm">
            <span className="accent-text">{u.kind === 'ending' ? '🜂 Secret ending' : '◈ Badge'} · {u.label}</span>
            <span className="text-muted"> — {u.blurb}</span>
          </p>
        </motion.div>
      ))}

      {/* Primary actions */}
      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <button
          onClick={() => setShareOpen((o) => !o)}
          className="flex-1 rounded-full bg-chalk py-3.5 text-sm font-medium text-ink transition-colors hover:bg-white"
        >
          {shareOpen ? 'Hide share card' : 'Share my result'}
        </button>
        <a href="#dossier" className="flex-1 rounded-full glass py-3.5 text-center text-sm transition-colors hover:bg-white/[0.08]">
          See full dossier ↓
        </a>
      </div>

      {/* Share sheet */}
      <AnimatePresence>{shareOpen && <div className="mt-4"><ShareSheet result={result} code={code} name={name} /></div>}</AnimatePresence>

      {/* Next actions — keep the loop spinning */}
      <section className="mt-6 grid grid-cols-2 gap-3">
        {[
          { href: `/compare/invite/${code}${nq}`, t: 'Compare with a friend', d: 'How aligned are you really?', icon: '⇄' },
          { href: `/chat/${primary.slug}?r=${code}${name ? `&n=${encodeURIComponent(name)}` : ''}`, t: `Chat with ${primary.name}`, d: 'Ask your philosopher anything', icon: '✉' },
          { href: '/battles', t: 'Battle Mode', d: 'Nietzsche vs Buddha — pick a side', icon: '⚔' },
          { href: '/daily', t: 'Daily Dilemma', d: 'Come back tomorrow. Build a streak.', icon: '◷' },
        ].map((a) => (
          <Link key={a.href} href={a.href} className="glass rounded-2xl p-4 transition-transform hover:-translate-y-0.5">
            <span className="text-xl accent-text">{a.icon}</span>
            <p className="mt-2 font-medium leading-tight">{a.t}</p>
            <p className="mt-1 text-xs text-muted">{a.d}</p>
          </Link>
        ))}
      </section>

      {/* Dossier */}
      <div id="dossier" className="scroll-mt-6">
        <Dossier result={result} code={code} name={name} />
      </div>

      <div className="mt-8 text-center">
        <Link href="/quiz" className="text-sm text-muted underline-offset-4 transition-colors hover:text-chalk hover:underline">
          Retake — try the Deep Dive, or see if your mind has changed →
        </Link>
      </div>

      <SiteFooter />
    </main>
  );
}
