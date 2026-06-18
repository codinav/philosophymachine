import type { Dimension, FullVector } from '@/types';
import { DIMENSIONS } from '@/types';
import { PHILOSOPHER_BY_SLUG, VISIBLE_PHILOSOPHERS } from './data/philosophers';

// Turns the abstract belief vector into human-readable insight (docs/02 Stage 3).
// Depth here = credibility; credibility = trust = shares + upgrades.

interface DimMeta {
  label: string;
  negPole: string;
  posPole: string;
  neg: string; // phrase when value < 0
  pos: string; // phrase when value > 0
}

export const DIMENSION_META: Record<Dimension, DimMeta> = {
  metaphysics: {
    label: 'Reality',
    negPole: 'Material',
    posPole: 'Ideal',
    neg: 'you take reality to be fundamentally physical — matter all the way down',
    pos: 'you sense reality is, at bottom, mind or spirit; matter is the shadow it casts',
  },
  epistemology: {
    label: 'Knowledge',
    negPole: 'Empirical',
    posPole: 'Rational',
    neg: 'you trust experience and evidence over abstract reasoning',
    pos: 'you believe reason can reach truths the senses never could',
  },
  ethics: {
    label: 'Morality',
    negPole: 'Consequence',
    posPole: 'Duty',
    neg: 'you judge actions by their outcomes — results are what matter',
    pos: 'you hold that some duties and principles bind regardless of outcome',
  },
  freeWill: {
    label: 'Free Will',
    negPole: 'Determined',
    posPole: 'Free',
    neg: 'you suspect our choices are the output of causes we never chose',
    pos: 'you believe your will is genuinely free and your choices truly yours',
  },
  meaning: {
    label: 'Meaning',
    negPole: 'Given',
    posPole: 'Created',
    neg: 'you feel meaning is objective — woven into the world, waiting to be found',
    pos: 'you hold that meaning is not found but made; we author it ourselves',
  },
  theology: {
    label: 'The Divine',
    negPole: 'Naturalist',
    posPole: 'Theist',
    neg: 'you see no need for the divine; nature is enough',
    pos: 'you sense a sacred dimension to reality beyond the physical',
  },
  self: {
    label: 'The Self',
    negPole: 'No-Self',
    posPole: 'Substantial',
    neg: 'you suspect the unified "self" is a useful fiction over constant flux',
    pos: 'you experience a real, continuous self beneath all your changing',
  },
  politics: {
    label: 'Society',
    negPole: 'Individual',
    posPole: 'Collective',
    neg: 'you prize individual freedom over the claims of the group',
    pos: 'you value harmony, duty, and the good of the community',
  },
  attachment: {
    label: 'Desire',
    negPole: 'Embrace',
    posPole: 'Renounce',
    neg: 'you say yes to desire, striving, and the fullness of worldly life',
    pos: 'you seek peace by loosening the grip of craving and attachment',
  },
};

export interface DimensionReading {
  key: Dimension;
  label: string;
  value: number; // -1..1
  pole: string;
  phrase: string;
  strength: number; // 0..1
}

export function readDimensions(v: FullVector): DimensionReading[] {
  return (DIMENSIONS as readonly Dimension[]).map((key) => {
    const meta = DIMENSION_META[key];
    const value = v[key];
    return {
      key,
      label: meta.label,
      value,
      pole: value >= 0 ? meta.posPole : meta.negPole,
      phrase: value >= 0 ? meta.pos : meta.neg,
      strength: Math.abs(value),
    };
  });
}

// Hand-authored tension rules: the contradictions that make a worldview
// interesting (and make the reader feel *seen*). First match wins.
const TENSION_RULES: { test: (v: FullVector) => boolean; title: string; body: string }[] = [
  {
    test: (v) => v.meaning > 0.4 && v.theology < -0.3,
    title: 'The existentialist’s burden',
    body: 'You crave meaning yet refuse the divine — so you must forge significance with your own hands, in a universe that offers none. It is the heaviest freedom there is.',
  },
  {
    test: (v) => v.self < -0.3 && v.freeWill > 0.4,
    title: 'The free ghost',
    body: 'You doubt there is a fixed self — yet you insist your will is free. Who, then, is the one choosing? You hold the no-self and radical freedom in the same hand.',
  },
  {
    test: (v) => v.ethics > 0.4 && v.epistemology < -0.3,
    title: 'Rules without foundations',
    body: 'You believe some duties are absolute — yet you trust only experience, not pure reason. You feel the moral law firmly, even as you doubt where its certainty comes from.',
  },
  {
    test: (v) => v.theology > 0.4 && v.epistemology < -0.3,
    title: 'Faith past the evidence',
    body: 'You sense the sacred, yet you anchor knowledge in experience. Your deepest convictions reach beyond what evidence alone could ever justify — and you are at peace with that.',
  },
  {
    test: (v) => v.attachment > 0.4 && v.politics < -0.3,
    title: 'The detached individualist',
    body: 'You seek to loosen desire and ego, yet you guard individual freedom fiercely. You want both to let go and to stand apart — renunciation on your own terms.',
  },
  {
    test: (v) => v.metaphysics > 0.4 && v.theology < -0.2,
    title: 'Spirit without God',
    body: 'You feel reality is more than matter, yet you don’t reach for a deity to explain it. Yours is a sacredness without scripture — mind, or form, or the One.',
  },
];

export function coreTension(v: FullVector): { title: string; body: string } {
  const hit = TENSION_RULES.find((r) => r.test(v));
  if (hit) return hit;
  // fallback: name the user's two strongest convictions as a synthesis.
  const sorted = readDimensions(v).sort((a, b) => b.strength - a.strength);
  return {
    title: 'A coherent core',
    body: `Your worldview holds together with unusual consistency. Its center of gravity: ${sorted[0].phrase}, and ${sorted[1].phrase}.`,
  };
}

/** The philosopher you are FURTHEST from — your "shadow". */
export function shadowPhilosopher(v: FullVector): string {
  let worst = VISIBLE_PHILOSOPHERS[0].slug;
  let maxDist = -1;
  for (const p of VISIBLE_PHILOSOPHERS) {
    let d = 0;
    for (const k of DIMENSIONS as readonly Dimension[]) {
      const diff = v[k] - (p.vector[k] ?? 0);
      d += diff * diff;
    }
    if (d > maxDist) {
      maxDist = d;
      worst = p.slug;
    }
  }
  return worst;
}

export function shadowBlurb(slug: string): string {
  const p = PHILOSOPHER_BY_SLUG[slug];
  return `Your worldview is furthest from ${p.name}. Where you stand, ${p.name} would object most strongly — which is exactly why reading them would stretch you. Growth lives in your shadow.`;
}
