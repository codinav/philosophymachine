import type {
  Answer,
  BlendEntry,
  Dimension,
  DimVector,
  FullVector,
  Philosopher,
  Question,
  ResultPayload,
  TribeSlug,
} from '@/types';
import { DIMENSIONS } from '@/types';
import { PHILOSOPHERS, PHILOSOPHER_BY_SLUG, VISIBLE_PHILOSOPHERS } from './data/philosophers';
import { QUESTION_BY_ID } from './data/questions';
import { TRIBES, TRIBE_LIST } from './data/tribes';
import { computeRarity } from './rarity';
import { evaluateUnlocks, unlockedPhilosophers, type Unlock } from './unlocks';
import { encodeResult } from './codec';

// ── tuning constants (see docs/05-scoring-algorithm.md) ──
const W_COS = 0.65; // weight on direction agreement
const W_DIST = 0.35; // weight on intensity/magnitude match
const TAU = 0.13; // softmax temperature — lower = more decisive headline
const SIGNAL_SCALE = 1.6; // contribution magnitude that maps to a "strong" stance
const MIN_BLEND_PCT = 3; // drop blend slivers below this
const MAX_BLEND = 5; // keep at most this many in the blend

// ── vector helpers ──
function dense(v: DimVector): FullVector {
  const out = {} as FullVector;
  for (const d of DIMENSIONS as readonly Dimension[]) out[d] = v[d] ?? 0;
  return out;
}

function emptyFull(): FullVector {
  const out = {} as FullVector;
  for (const d of DIMENSIONS as readonly Dimension[]) out[d] = 0;
  return out;
}

/** Salience-weighted cosine + magnitude similarity, blended. Returns ~[-? ,1]. */
function similarity(user: FullVector, phil: FullVector): number {
  let dot = 0;
  let uNorm = 0;
  let pNorm = 0;
  let wDistSq = 0;
  let wDistDen = 0;
  for (const d of DIMENSIONS as readonly Dimension[]) {
    const w = 0.5 + Math.abs(user[d]); // dimensions the user cares about count more
    const u = user[d];
    const p = phil[d];
    dot += w * u * p;
    uNorm += w * u * u;
    pNorm += w * p * p;
    const diff = u - p;
    wDistSq += w * diff * diff;
    wDistDen += w * 4; // max squared diff per dim is (1-(-1))^2 = 4
  }
  const cos = uNorm > 0 && pNorm > 0 ? dot / Math.sqrt(uNorm * pNorm) : 0;
  const normDist = wDistDen > 0 ? Math.sqrt(wDistSq / wDistDen) : 1;
  return W_COS * cos + W_DIST * (1 - normDist);
}

function softmaxBlend(scored: { slug: string; raw: number }[]): BlendEntry[] {
  const max = Math.max(...scored.map((s) => s.raw));
  const exps = scored.map((s) => ({ slug: s.slug, e: Math.exp((s.raw - max) / TAU) }));
  const sum = exps.reduce((a, b) => a + b.e, 0);
  let blend = exps
    .map((x) => ({ slug: x.slug, pct: (x.e / sum) * 100 }))
    .sort((a, b) => b.pct - a.pct)
    .slice(0, MAX_BLEND)
    .filter((b, i) => i === 0 || b.pct >= MIN_BLEND_PCT);

  // renormalize the kept components to sum to 100, then round cleanly.
  const total = blend.reduce((a, b) => a + b.pct, 0);
  blend = blend.map((b) => ({ slug: b.slug, pct: Math.round((b.pct / total) * 100) }));
  // fix rounding drift so it sums to exactly 100.
  const drift = 100 - blend.reduce((a, b) => a + b.pct, 0);
  if (blend.length) blend[0].pct += drift;
  return blend;
}

/** Build the normalized 9-dim belief vector from raw answers. */
export function buildUserVector(
  answers: Answer[],
  questions: Record<string, Question> = QUESTION_BY_ID,
): { vector: FullVector; aporiaCount: number } {
  const contrib = emptyFull();
  let aporiaCount = 0;

  for (const a of answers) {
    const q = questions[a.questionId];
    if (!q) continue;
    if (a.refused) {
      aporiaCount++;
      continue;
    }
    if (q.format === 'slider') {
      const w = q.options[0]?.weights ?? {};
      for (const d of DIMENSIONS as readonly Dimension[]) {
        const wd = w[d] ?? 0;
        if (wd !== 0) contrib[d] += a.value * wd * q.confidence;
      }
    } else {
      // binary: the chosen option's weights apply at full strength.
      const chosen = a.value >= 0 ? q.options[1] : q.options[0];
      const cw = chosen?.weights ?? {};
      for (const d of DIMENSIONS as readonly Dimension[]) {
        const cwd = cw[d] ?? 0;
        if (cwd !== 0) contrib[d] += cwd * q.confidence;
      }
    }
  }

  // tanh compression of the accumulated signal: weak/incidental side-weights
  // stay near 0, while a dimension pushed hard & repeatedly approaches ±1.
  // (Normalizing by touched-weight would wrongly saturate any touched dim.)
  const vector = emptyFull();
  for (const d of DIMENSIONS as readonly Dimension[]) {
    vector[d] = Math.tanh(contrib[d] / SIGNAL_SCALE);
  }
  return { vector, aporiaCount };
}

function matchBlend(user: FullVector, pool: Philosopher[]): BlendEntry[] {
  const scored = pool.map((p) => ({ slug: p.slug, raw: similarity(user, dense(p.vector)) }));
  return softmaxBlend(scored);
}

function assignTribe(user: FullVector, primarySlug: string): { tribe: TribeSlug; confidence: number } {
  // path 1: tribe of the primary philosopher
  const byPrimary = PHILOSOPHER_BY_SLUG[primarySlug]?.tribe;

  // path 2: nearest tribe centroid (mean of anchor vectors)
  let best: { tribe: TribeSlug; sim: number } | null = null;
  let second = -Infinity;
  for (const tribe of TRIBE_LIST) {
    const centroid = emptyFull();
    let n = 0;
    for (const slug of tribe.anchors) {
      const ph = PHILOSOPHER_BY_SLUG[slug];
      if (!ph) continue;
      const dv = dense(ph.vector);
      for (const d of DIMENSIONS as readonly Dimension[]) centroid[d] += dv[d];
      n++;
    }
    if (n > 0) for (const d of DIMENSIONS as readonly Dimension[]) centroid[d] /= n;
    const sim = similarity(user, centroid);
    if (!best || sim > best.sim) {
      second = best?.sim ?? -Infinity;
      best = { tribe: tribe.slug, sim };
    } else if (sim > second) {
      second = sim;
    }
  }

  const margin = best ? best.sim - second : 0;
  // prefer the centroid tribe when its lead is decisive; else keep headline coherent.
  if (best && (margin > 0.06 || !byPrimary)) {
    return { tribe: best.tribe, confidence: Math.min(1, 0.5 + margin * 4) };
  }
  return { tribe: byPrimary ?? best!.tribe, confidence: 0.6 };
}

/**
 * Reconstruct a full result from a belief vector (used by both fresh scoring
 * and decoding a share code). Deterministic and side-effect free.
 */
export function buildResultFromVector(
  dimensions: FullVector,
  aporiaCount: number,
  isDeep: boolean,
  answeredCount: number,
): ResultPayload & { unlocks: Unlock[] } {
  const baseBlend = matchBlend(dimensions, VISIBLE_PHILOSOPHERS);
  const unlocks = evaluateUnlocks({ dimensions, aporiaCount, blend: baseBlend, answeredCount });
  const hidden = unlockedPhilosophers(unlocks);

  const pool = hidden.length
    ? [...VISIBLE_PHILOSOPHERS, ...hidden.map((s) => PHILOSOPHER_BY_SLUG[s]).filter(Boolean)]
    : VISIBLE_PHILOSOPHERS;
  const blend = matchBlend(dimensions, pool);
  const primary = blend[0]?.slug ?? 'socrates';
  const { tribe, confidence } = assignTribe(dimensions, primary);
  const rarity = computeRarity(dimensions, primary, hidden.length > 0);

  return {
    code: encodeResult(dimensions, aporiaCount, isDeep),
    blend,
    primary,
    tribe,
    tribeConfidence: confidence,
    dimensions,
    rarityPct: rarity.rarityPct,
    rarityTier: rarity.tier,
    unlocked: unlocks.map((u) => u.id),
    aporiaCount,
    isDeep,
    unlocks,
  };
}

/** Top-level: score a set of answers into a complete result. */
export function score(answers: Answer[], opts?: { isDeep?: boolean }): ResultPayload & { unlocks: Unlock[] } {
  const { vector, aporiaCount } = buildUserVector(answers);
  return buildResultFromVector(vector, aporiaCount, !!opts?.isDeep, answers.length);
}

export { TRIBES };
export const ALL_PHILOSOPHERS = PHILOSOPHERS;
