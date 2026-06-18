import clsx from 'clsx';
import type { RarityTier } from '@/types';
import { TIER_LABEL } from '@/lib/rarity';

const TIER_STYLE: Record<RarityTier, string> = {
  common: 'text-muted border-white/10',
  uncommon: 'text-cyan-200 border-cyan-300/30',
  rare: 'text-violet-200 border-violet-300/40',
  mythic: 'text-amber-200 border-amber-300/50',
};

export function RarityBadge({ pct, tier, className }: { pct: number; tier: RarityTier; className?: string }) {
  return (
    <div
      className={clsx(
        'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium tracking-wide',
        TIER_STYLE[tier],
        tier === 'mythic' && 'animate-pulse-slow',
        className,
      )}
    >
      <span aria-hidden>✦</span>
      <span className="uppercase tracking-[0.2em]">{TIER_LABEL[tier]}</span>
      <span className="text-chalk/60">·</span>
      <span>rarer than {pct}%</span>
    </div>
  );
}
