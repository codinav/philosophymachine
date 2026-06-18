import type { Dimension, FullVector } from '@/types';
import { DIMENSIONS } from '@/types';
import { DIMENSION_META } from './dossier';
import { VISIBLE_PHILOSOPHERS, PHILOSOPHER_BY_SLUG } from './data/philosophers';
import { buildResultFromVector } from './scoring';

// Comparison Mode (docs/01-viral-growth.md §5) — "You and Maya agree on 81%."

export interface DimAgreement {
  key: Dimension;
  label: string;
  agreement: number; // 0..100
  aPole: string;
  bPole: string;
}

export interface Comparison {
  agreementPct: number;
  dimensions: DimAgreement[];
  biggestClash: { label: string; aPhrase: string; bPhrase: string };
  sharedPhilosopher: string | null;
  bridgeThinker: string;
}

export function compareVectors(a: FullVector, b: FullVector): Comparison {
  const dims: DimAgreement[] = (DIMENSIONS as readonly Dimension[]).map((key) => {
    const meta = DIMENSION_META[key];
    const dist = Math.abs(a[key] - b[key]); // 0..2
    return {
      key,
      label: meta.label,
      agreement: Math.round((1 - dist / 2) * 100),
      aPole: a[key] >= 0 ? meta.posPole : meta.negPole,
      bPole: b[key] >= 0 ? meta.posPole : meta.negPole,
    };
  });

  const agreementPct = Math.round(dims.reduce((s, d) => s + d.agreement, 0) / dims.length);

  // biggest clash = dimension with the largest gap
  const clash = [...dims].sort((x, y) => x.agreement - y.agreement)[0];
  const clashMeta = DIMENSION_META[clash.key];
  const biggestClash = {
    label: clash.label,
    aPhrase: a[clash.key] >= 0 ? clashMeta.pos : clashMeta.neg,
    bPhrase: b[clash.key] >= 0 ? clashMeta.pos : clashMeta.neg,
  };

  // shared philosopher: appears in both blends, highest combined share
  const blendA = buildResultFromVector(a, 0, false, 18).blend;
  const blendB = buildResultFromVector(b, 0, false, 18).blend;
  const setB = new Map(blendB.map((x) => [x.slug, x.pct]));
  let sharedPhilosopher: string | null = null;
  let bestShared = -1;
  for (const x of blendA) {
    if (setB.has(x.slug)) {
      const combined = x.pct + (setB.get(x.slug) ?? 0);
      if (combined > bestShared) {
        bestShared = combined;
        sharedPhilosopher = x.slug;
      }
    }
  }

  // bridge thinker: the philosopher closest to BOTH (maximize the worse closeness)
  let bridge = VISIBLE_PHILOSOPHERS[0].slug;
  let bestMin = -Infinity;
  for (const p of VISIBLE_PHILOSOPHERS) {
    const closeness = (v: FullVector) => {
      let d = 0;
      for (const k of DIMENSIONS as readonly Dimension[]) {
        const diff = v[k] - (p.vector[k] ?? 0);
        d += diff * diff;
      }
      return -Math.sqrt(d);
    };
    const m = Math.min(closeness(a), closeness(b));
    if (m > bestMin) {
      bestMin = m;
      bridge = p.slug;
    }
  }

  return { agreementPct, dimensions: dims, biggestClash, sharedPhilosopher, bridgeThinker: bridge };
}

export function philosopherName(slug: string | null): string {
  return slug ? PHILOSOPHER_BY_SLUG[slug]?.name ?? '—' : '—';
}
