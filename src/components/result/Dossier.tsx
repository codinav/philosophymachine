'use client';

import { motion } from 'framer-motion';
import type { ResultPayload } from '@/types';
import { PHILOSOPHER_BY_SLUG } from '@/lib/data/philosophers';
import { readDimensions, coreTension, shadowPhilosopher, shadowBlurb } from '@/lib/dossier';
import { Portrait } from '@/components/ui/Portrait';
import { accentVars } from '@/components/ui/primitives';
import { isPremium } from '@/lib/entitlements';
import { DeepReportView } from './DeepReportView';

export function Dossier({ result, code, name }: { result: ResultPayload; code: string; name?: string }) {
  const premium = isPremium();
  const dims = readDimensions(result.dimensions);
  const tension = coreTension(result.dimensions);
  const shadow = PHILOSOPHER_BY_SLUG[shadowPhilosopher(result.dimensions)];
  const primary = PHILOSOPHER_BY_SLUG[result.primary];

  return (
    <div className="mt-6 flex flex-col gap-5">
      {/* dimension map */}
      <section className="glass rounded-3xl p-6">
        <h3 className="font-display text-xl font-semibold">Your worldview, decoded</h3>
        <p className="mt-1 text-sm text-muted">Where you sit on the nine axes of belief.</p>
        <div className="mt-6 flex flex-col gap-4">
          {dims.map((d, i) => (
            <div key={d.key}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="text-muted">{d.label}</span>
                <span className="font-medium accent-text">{d.pole}</span>
              </div>
              <div className="relative h-2 rounded-full bg-white/[0.06]">
                <div className="absolute left-1/2 top-1/2 h-3 w-px -translate-y-1/2 bg-white/20" />
                <motion.div
                  className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full"
                  style={{
                    background: 'var(--accent)',
                    left: d.value >= 0 ? '50%' : `${50 + d.value * 50}%`,
                    boxShadow: '0 0 14px -2px var(--accent-soft)',
                  }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${Math.abs(d.value) * 50}%` }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
              <p className="mt-1.5 text-xs leading-snug text-muted">{d.phrase}.</p>
            </div>
          ))}
        </div>
      </section>

      {/* core tension */}
      <section className="glass rounded-3xl p-6">
        <p className="text-xs uppercase tracking-[0.25em] text-muted">⚡ Your core tension</p>
        <h3 className="mt-3 font-display text-2xl font-semibold">{tension.title}</h3>
        <p className="mt-2 leading-relaxed text-chalk/85">{tension.body}</p>
      </section>

      {/* signature quote */}
      <section className="glass rounded-3xl p-6 text-center" style={accentVars(primary.accent, primary.accentSoft)}>
        <p className="font-display text-2xl italic leading-snug">“{primary.quote}”</p>
        <p className="mt-3 text-sm text-muted">— {primary.name}, your closest thinker</p>
      </section>

      {/* shadow philosopher */}
      <section className="glass rounded-3xl p-6" style={accentVars(shadow.accent, shadow.accentSoft)}>
        <div className="flex items-center gap-4">
          <Portrait sigil={shadow.sigil} accent={shadow.accent} accentSoft={shadow.accentSoft} size="md" />
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-muted">🌑 Your shadow</p>
            <h3 className="mt-1 font-display text-xl font-semibold">{shadow.name}</h3>
          </div>
        </div>
        <p className="mt-3 leading-relaxed text-chalk/80">{shadowBlurb(shadow.slug)}</p>
      </section>

      {/* reading list */}
      <section className="glass rounded-3xl p-6">
        <p className="text-xs uppercase tracking-[0.25em] text-muted">📖 Read next</p>
        <h3 className="mt-2 font-display text-xl font-semibold">To go deeper into {primary.name}</h3>
        <ul className="mt-3 flex flex-col gap-2">
          {primary.reading.map((r) => (
            <li key={r} className="flex items-center gap-2 text-sm text-chalk/85">
              <span className="accent-text">›</span> {r}
            </li>
          ))}
        </ul>
      </section>

      {/* Deep report — unlocked for everyone during the Launch Festival */}
      {premium ? (
        <DeepReportView result={result} code={code} name={name} />
      ) : (
        <section className="relative overflow-hidden rounded-3xl border border-white/10 p-6">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 to-transparent" />
          <div className="relative">
            <p className="text-xs uppercase tracking-[0.25em] text-muted">The Academy · premium</p>
            <h3 className="mt-2 font-display text-2xl font-semibold">Your deep psychological report</h3>
            <p className="mt-2 max-w-lg leading-relaxed text-chalk/70">
              A long-form analysis of your tensions and growth edges, a tailored reading & reflection roadmap,
              unlimited chat with your philosopher, a downloadable PDF, and relationship-compatibility decoding.
            </p>
            <a href="/academy" className="mt-5 inline-flex rounded-full bg-chalk px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-white">
              Unlock the full dossier →
            </a>
          </div>
        </section>
      )}
    </div>
  );
}
