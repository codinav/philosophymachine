import type { Dimension, FullVector } from '@/types';
import { DIMENSIONS } from '@/types';

// Pre-launch population model for the RARITY system (docs/05 §6).
// Before we have real users, rarity is computed against this hand-tuned prior:
//  • `centroid` — where the "average" respondent sits. Humans skew toward
//    common positions: mild free-will belief, some theism, moderate ethics.
//  • `spread` — typical std-dev per dimension. Smaller spread => being far out
//    on that axis is rarer.
// Post-launch, a nightly job replaces these with real distribution stats.

export const POPULATION_CENTROID: FullVector = {
  metaphysics: 0.12, // slight lean to "something more than matter"
  epistemology: 0.0,
  ethics: 0.18, // most people are soft deontologists in surveys
  freeWill: 0.45, // strong folk belief in free will
  meaning: 0.1,
  theology: 0.25, // global skew theist
  self: 0.4, // strong folk belief in a real self
  politics: 0.05,
  attachment: 0.0,
};

export const POPULATION_SPREAD: FullVector = {
  metaphysics: 0.42,
  epistemology: 0.4,
  ethics: 0.4,
  freeWill: 0.38,
  meaning: 0.4,
  theology: 0.5,
  self: 0.38,
  politics: 0.42,
  attachment: 0.4,
};

// Expected share of users whose PRIMARY is each philosopher (sums ~1 over
// visible philosophers). Drives "your primary is shared by X%". Common,
// relatable thinkers are weighted higher; austere/extreme ones lower.
export const PRIMARY_PRIORS: Record<string, number> = {
  aristotle: 0.13,
  socrates: 0.11,
  kant: 0.1,
  buddha: 0.1,
  'lao-tzu': 0.07,
  camus: 0.07,
  hume: 0.06,
  confucius: 0.06,
  nietzsche: 0.06,
  sartre: 0.05,
  rawls: 0.05,
  plato: 0.05,
  krishna: 0.04,
  descartes: 0.03,
  vivekananda: 0.02,
  // hidden ones are intentionally tiny
  shankara: 0.005,
  nagarjuna: 0.003,
};

/** Mahalanobis-style atypicality: per-dimension z, RMS-combined. */
export function atypicality(v: FullVector): number {
  let sumSq = 0;
  for (const d of DIMENSIONS as readonly Dimension[]) {
    const z = (v[d] - POPULATION_CENTROID[d]) / POPULATION_SPREAD[d];
    sumSq += z * z;
  }
  return Math.sqrt(sumSq / DIMENSIONS.length);
}
