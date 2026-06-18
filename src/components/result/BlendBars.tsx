'use client';

import { motion } from 'framer-motion';
import type { BlendEntry } from '@/types';
import { PHILOSOPHER_BY_SLUG } from '@/lib/data/philosophers';

export function BlendBars({ blend, animate = true }: { blend: BlendEntry[]; animate?: boolean }) {
  return (
    <div className="flex flex-col gap-3">
      {blend.map((b, i) => {
        const p = PHILOSOPHER_BY_SLUG[b.slug];
        if (!p) return null;
        return (
          <div key={b.slug} className="flex items-center gap-3">
            <span className="w-28 shrink-0 text-sm text-chalk/90 sm:w-32" title={p.name}>
              {p.name}
            </span>
            <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ background: p.accent, boxShadow: `0 0 18px -2px ${p.accentSoft}` }}
                initial={animate ? { width: 0 } : false}
                animate={{ width: `${b.pct}%` }}
                transition={{ delay: 0.2 + i * 0.12, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <span className="w-10 shrink-0 text-right font-display text-sm tabular-nums text-chalk">{b.pct}%</span>
          </div>
        );
      })}
    </div>
  );
}
