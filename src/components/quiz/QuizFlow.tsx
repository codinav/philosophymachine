'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import type { Answer, Question } from '@/types';
import { questionsForLen, QUIZ_MODES, type QuizMode } from '@/lib/data/questions';
import { score } from '@/lib/scoring';
import { takeColdOpen, stashReveal, getName, setName as persistName } from '@/lib/session';
import { cleanName } from '@/lib/name';

const SLIDER_LABELS = ['Strongly disagree', 'Disagree', 'Lean disagree', 'Unsure', 'Lean agree', 'Agree', 'Strongly agree'];

function labelForValue(v: number): string {
  const idx = Math.round(((v + 1) / 2) * (SLIDER_LABELS.length - 1));
  return SLIDER_LABELS[Math.max(0, Math.min(SLIDER_LABELS.length - 1, idx))];
}

function ConstellationProgress({ total, index }: { total: number; index: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="h-1.5 rounded-full transition-all duration-500"
          style={{
            width: i === index ? 22 : 8,
            background: i <= index ? 'var(--accent)' : 'rgba(255,255,255,0.14)',
            boxShadow: i <= index ? '0 0 12px -2px var(--accent-soft)' : 'none',
          }}
        />
      ))}
    </div>
  );
}

// ── Intro: who are you + how deep do you want to go ──────────────────────────
function Intro({ onBegin, comparing }: { onBegin: (name: string, mode: QuizMode) => void; comparing: boolean }) {
  const [name, setName] = useState('');
  const [mode, setMode] = useState<QuizMode>(QUIZ_MODES[1]);

  // Load a previously entered name after mount (avoids hydration mismatch).
  useEffect(() => {
    const n = getName();
    if (n) setName(n);
  }, []);

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-2xl flex-col justify-center px-5 py-10">
      <motion.div initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0)' }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
        <Link href="/" className="text-sm text-muted transition-colors hover:text-chalk">← Home</Link>

        {comparing && (
          <p className="mt-6 inline-flex rounded-full border border-white/15 px-3 py-1 text-xs text-muted">⇄ You’ll be compared with a friend at the end</p>
        )}

        <p className="mt-8 text-xs uppercase tracking-[0.3em] text-muted">Before we begin</p>
        <h1 className="mt-3 font-display text-display font-semibold">What should the machine call you?</h1>
        <p className="mt-2 text-muted">It’s reading a mind. It helps to know whose.</p>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && name.trim()) onBegin(cleanName(name), mode); }}
          maxLength={24}
          autoFocus
          placeholder="Your name"
          className="mt-6 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 font-display text-2xl outline-none transition-colors placeholder:text-muted/60 focus:border-[var(--accent)]"
          style={{ ['--accent' as string]: '#6366f1' }}
        />

        <p className="mt-10 text-xs uppercase tracking-[0.3em] text-muted">Choose your journey</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {QUIZ_MODES.map((m) => {
            const active = m.id === mode.id;
            return (
              <button
                key={m.id}
                onClick={() => setMode(m)}
                className={`rounded-2xl border p-4 text-left transition-all ${active ? 'border-[var(--accent)] bg-white/[0.06]' : 'border-white/10 hover:border-white/25'}`}
                style={{ ['--accent' as string]: '#6366f1', boxShadow: active ? '0 0 30px -8px rgba(99,102,241,0.5)' : 'none' }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl" style={{ color: active ? '#818cf8' : '#8A8AA0' }}>{m.sigil}</span>
                  <span className="text-xs text-muted">{m.len} · {m.time}</span>
                </div>
                <p className="mt-2 font-display text-lg font-semibold">{m.label}</p>
                <p className="mt-1 text-xs leading-snug text-muted">{m.blurb}</p>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onBegin(cleanName(name) || 'Seeker', mode)}
          className="mt-8 w-full rounded-full bg-chalk py-4 font-medium text-ink transition-all hover:bg-white active:scale-[0.99]"
        >
          {name.trim() ? `Read my mind, ${cleanName(name)} →` : 'Begin the mapping →'}
        </button>
        <p className="mt-3 text-center text-xs text-muted">No signup · your answers never leave your device unless you share them.</p>
      </motion.div>
    </div>
  );
}

export function QuizFlow() {
  const router = useRouter();
  const params = useSearchParams();
  const compareWith = params.get('compare');

  const [phase, setPhase] = useState<'intro' | 'quiz'>('intro');
  const [name, setName] = useState('');
  const [len, setLen] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [index, setIndex] = useState(0);
  const [slider, setSlider] = useState(0);
  const [computing, setComputing] = useState(false);
  const startedAt = useRef(Date.now());

  const begin = (chosenName: string, mode: QuizMode) => {
    persistName(chosenName);
    setName(chosenName);
    setLen(mode.len);
    const qs = questionsForLen(mode.len);
    setQuestions(qs);
    // Carry the landing-page cold-open answer in, and skip re-asking it.
    const cold = takeColdOpen();
    const initial: Record<string, Answer> = {};
    let start = 0;
    if (cold) {
      initial[cold.questionId] = cold;
      if (qs[0]?.id === cold.questionId) start = 1;
    }
    setAnswers(initial);
    setIndex(start);
    startedAt.current = Date.now();
    setPhase('quiz');
  };

  if (phase === 'intro') {
    return <Intro onBegin={begin} comparing={!!compareWith} />;
  }

  const current = questions[index];
  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / questions.length) * 100);

  const finish = (finalAnswers: Record<string, Answer>) => {
    setComputing(true);
    const result = score(Object.values(finalAnswers));
    stashReveal(result);
    // fire-and-forget analytics for the admin dashboard (no PII, derived only)
    fetch('/api/event', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ type: 'quiz_completed', primary: result.primary, tribe: result.tribe, tier: result.rarityTier, len }),
    }).catch(() => {});
    const n = name ? `&n=${encodeURIComponent(name)}` : '';
    const dest = compareWith
      ? `/compare/${compareWith}/${result.code}`
      : `/result/${result.code}?reveal=1${n}`;
    setTimeout(() => router.push(dest), 1100);
  };

  const commit = (value: number, refused = false) => {
    const ans: Answer = { questionId: current.id, value, refused, ms: Date.now() - startedAt.current };
    const next = { ...answers, [current.id]: ans };
    setAnswers(next);
    setSlider(0);
    startedAt.current = Date.now();
    if (index + 1 >= questions.length) finish(next);
    else setIndex((i) => i + 1);
  };

  if (computing) {
    return (
      <div className="grid min-h-[70vh] place-items-center">
        <div className="text-center">
          <motion.div className="mx-auto mb-6 h-16 w-16 rounded-full border-2 border-white/20 border-t-[var(--accent)]" style={{ ['--accent' as string]: '#818cf8' }} animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} />
          <p className="font-display text-2xl">{name ? `Reading you, ${name}…` : 'The machine is deciding…'}</p>
          <p className="mt-2 text-sm text-muted">Mapping you against 9 dimensions of belief.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-2xl flex-col px-5 py-6" style={{ ['--accent' as string]: '#818cf8', ['--accent-soft' as string]: 'rgba(129,140,248,0.4)' }}>
      <div className="flex items-center justify-between">
        <Link href="/" className="text-muted transition-colors hover:text-chalk" aria-label="Exit quiz">✕</Link>
        <ConstellationProgress total={questions.length} index={index} />
        <span className="w-10 text-right text-sm tabular-nums text-muted">{Math.min(index + 1, questions.length)}/{questions.length}</span>
      </div>

      <div className="flex flex-1 flex-col justify-center py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -18, filter: 'blur(8px)' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-muted">{progress}% mapped</p>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-snug sm:text-4xl">{current.prompt}</h2>

            {current.format === 'binary' ? (
              <div className="mt-10 flex flex-col gap-3">
                <button onClick={() => commit(-1)} className="glass rounded-2xl p-5 text-left text-lg transition-all hover:bg-white/[0.08] active:scale-[0.99]">{current.options[0].label}</button>
                <button onClick={() => commit(1)} className="glass rounded-2xl p-5 text-left text-lg transition-all hover:bg-white/[0.08] active:scale-[0.99]">{current.options[1].label}</button>
              </div>
            ) : (
              <div className="mt-12">
                <div className="mb-3 flex justify-between text-xs text-muted"><span>Strongly disagree</span><span>Strongly agree</span></div>
                <input type="range" min={-100} max={100} value={slider * 100} onChange={(e) => setSlider(Number(e.target.value) / 100)} className="intensity w-full" aria-label={current.prompt} />
                <p className="mt-5 text-center font-display text-xl accent-text">{labelForValue(slider)}</p>
                <button onClick={() => commit(slider)} className="mt-8 w-full rounded-full bg-chalk py-4 font-medium text-ink transition-all hover:bg-white active:scale-[0.99]">Continue →</button>
              </div>
            )}

            <button onClick={() => commit(0, true)} className="mx-auto mt-6 block text-sm text-muted underline-offset-4 transition-colors hover:text-chalk hover:underline">It&apos;s complicated · I refuse the question</button>

            {current.reaction && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-8 text-center text-sm italic text-muted">· {current.reaction} ·</motion.p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
