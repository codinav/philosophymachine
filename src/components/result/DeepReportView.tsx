'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { ResultPayload } from '@/types';
import { deepReport } from '@/lib/deepReport';
import { promoDaysLeft } from '@/lib/entitlements';

export function DeepReportView({ result, code, name }: { result: ResultPayload; code: string; name?: string }) {
  const r = deepReport(result);
  const daysLeft = promoDaysLeft();
  const nq = name ? `?n=${encodeURIComponent(name)}` : '';

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative overflow-hidden rounded-3xl border border-white/10 p-6 sm:p-8"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 to-transparent" />
      <div className="relative">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs uppercase tracking-[0.25em] text-violet-300">The Academy · Deep Report</p>
          <span className="rounded-full border border-violet-300/40 px-3 py-1 text-xs text-violet-200">
            ✦ Unlocked free · Launch Festival{daysLeft ? ` · ${daysLeft}d left` : ''}
          </span>
        </div>

        <h3 className="mt-3 font-display text-2xl font-semibold">Your deep psychological report</h3>
        <p className="mt-3 leading-relaxed text-chalk/85">{r.summary}</p>

        <div className="mt-6 flex flex-col gap-5">
          {r.sections.map((s) => (
            <div key={s.title}>
              <h4 className="font-display text-lg font-semibold accent-text">{s.title}</h4>
              <p className="mt-1.5 leading-relaxed text-chalk/80">{s.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="glass rounded-2xl p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Your strengths</p>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-chalk/85">
              {r.strengths.map((s, i) => <li key={i} className="flex gap-2"><span className="text-emerald-300">+</span>{s}</li>)}
            </ul>
          </div>
          <div className="glass rounded-2xl p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-amber-300">Your growth edges</p>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-chalk/85">
              {r.growthEdges.map((s, i) => <li key={i} className="flex gap-2"><span className="text-amber-300">→</span>{s}</li>)}
            </ul>
          </div>
        </div>

        {/* Growth roadmap */}
        <div className="mt-8">
          <p className="text-xs uppercase tracking-[0.25em] text-muted">🗺 Your 4-week growth roadmap</p>
          <div className="mt-4 flex flex-col gap-3">
            {r.roadmap.map((step) => (
              <div key={step.phase} className="glass rounded-2xl p-5">
                <p className="font-display font-semibold accent-text">{step.phase}</p>
                <p className="mt-1 text-sm text-chalk/85">{step.focus}</p>
                <p className="mt-2 text-sm text-muted"><span className="text-chalk/70">Practice:</span> {step.practice}</p>
                {step.reading && <p className="mt-1 text-sm text-muted"><span className="text-chalk/70">Read:</span> {step.reading}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Compatibility */}
        <div className="mt-8 glass rounded-2xl p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-muted">💞 Relationship compatibility</p>
          <p className="mt-3 leading-relaxed text-chalk/85">{r.compatibility.note}</p>
          <p className="mt-3 text-sm">
            Best match: <span className="accent-text">{r.compatibility.bestTribe}</span> ·
            Hardest: <span className="accent-text"> {r.compatibility.hardestTribe}</span>
          </p>
          <Link href={`/compare/invite/${code}`} className="mt-4 inline-flex rounded-full glass px-5 py-2.5 text-sm transition-colors hover:bg-white/[0.08]">
            Compare with your partner →
          </Link>
        </div>

        {/* Download PDF */}
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={`/result/${code}/report${nq}`}
            className="inline-flex rounded-full bg-chalk px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-white"
          >
            Download PDF report ↓
          </Link>
          <Link href={`/chat/${result.primary}?r=${code}${name ? `&n=${encodeURIComponent(name)}` : ''}`} className="inline-flex rounded-full glass px-6 py-3 text-sm transition-colors hover:bg-white/[0.08]">
            Discuss it with your philosopher →
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
