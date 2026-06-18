import type { FullVector, RarityTier } from '@/types';
import { atypicality, PRIMARY_PRIORS } from './data/priors';

// "You are rarer than X% of respondents." (docs/05 §6)
// Headline rarity = percentile of your vector's *atypicality* (distance from
// the population centroid). We map an atypicality z to a percentile via a
// smooth CDF-like curve calibrated so the median user lands ~50–60%.

function percentileFromAtypicality(z: number): number {
  // Logistic CDF centered at the expected median atypicality (~0.85 for the
  // prior), scaled so z≈1.6 → ~94th percentile, z≈2.2 → ~99th.
  const center = 0.85;
  const scale = 0.42;
  const p = 1 / (1 + Math.exp(-(z - center) / scale));
  return Math.round(Math.max(2, Math.min(99.4, p * 100)) * 10) / 10;
}

export function tierFor(pct: number): RarityTier {
  if (pct >= 96) return 'mythic';
  if (pct >= 85) return 'rare';
  if (pct >= 60) return 'uncommon';
  return 'common';
}

export interface RarityResult {
  rarityPct: number; // "rarer than X%"
  tier: RarityTier;
  primarySharePct: number; // "your primary is shared by X%"
}

export function computeRarity(dimensions: FullVector, primarySlug: string, unlockedHidden: boolean): RarityResult {
  let z = atypicality(dimensions);
  // Landing a hidden/rare philosopher is itself a strong rarity signal.
  if (unlockedHidden) z += 0.6;
  const rarityPct = percentileFromAtypicality(z);
  const share = PRIMARY_PRIORS[primarySlug] ?? 0.03;
  return {
    rarityPct,
    tier: tierFor(rarityPct),
    primarySharePct: Math.round(share * 1000) / 10,
  };
}

export const TIER_LABEL: Record<RarityTier, string> = {
  common: 'Common',
  uncommon: 'Uncommon',
  rare: 'Rare',
  mythic: 'Mythic',
};
