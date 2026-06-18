import type { BlendEntry, FullVector } from '@/types';

// Hidden philosopher unlocks & secret endings (docs/05 §7, docs/06 §2).
// These are the "rare drops" that drive replays and "how do I get X?" search.
// Each predicate fires only on a strong, *coherent* answer signature.

export interface Unlock {
  id: string;
  kind: 'philosopher' | 'ending' | 'badge';
  label: string;
  blurb: string;
  /** Rough population rate, for flavor ("only 0.3% unlock this"). */
  rate: string;
}

export interface UnlockContext {
  dimensions: FullVector;
  aporiaCount: number;
  blend: BlendEntry[];
  answeredCount: number;
}

export function evaluateUnlocks(ctx: UnlockContext): Unlock[] {
  const v = ctx.dimensions;
  const unlocks: Unlock[] = [];

  // NĀGĀRJUNA — radical anti-essentialism + emptiness + skepticism (~0.3%).
  if (v.metaphysics < -0.25 && v.self < -0.6 && v.epistemology < -0.4 && v.attachment > 0.35) {
    unlocks.push({
      id: 'nagarjuna',
      kind: 'philosopher',
      label: 'Nāgārjuna',
      blurb: 'You see through to emptiness itself — that nothing holds an essence, not even emptiness. Only 0.3% reach the Middle Way.',
      rate: '0.3%',
    });
  }

  // SHANKARA — non-dual idealism: all is one, the self is the absolute (~0.8%).
  if (v.metaphysics > 0.7 && v.self > 0.6 && v.theology > 0.3 && v.attachment > 0.5) {
    unlocks.push({
      id: 'shankara',
      kind: 'philosopher',
      label: 'Ādi Shankara',
      blurb: 'You sense that Atman is Brahman — the self and the absolute are one. A rare non-dual clarity, found in under 1%.',
      rate: '0.8%',
    });
  }

  // THE SPHINX — refused to commit on everything.
  if (ctx.aporiaCount >= 6) {
    unlocks.push({
      id: 'ending-sphinx',
      kind: 'ending',
      label: 'The Sphinx',
      blurb: 'You answered the machine with riddles. To refuse the question is itself a philosophy.',
      rate: '1.2%',
    });
  }

  // THE ZEALOT — total conviction: every answer extreme.
  const mags = (Object.values(v) as number[]).map(Math.abs);
  const minMag = Math.min(...mags);
  if (minMag > 0.62 && ctx.aporiaCount === 0) {
    unlocks.push({
      id: 'ending-zealot',
      kind: 'ending',
      label: 'The Zealot',
      blurb: 'Total conviction. You met every dilemma with a definite, forceful answer. Certainty is your signature — and your risk.',
      rate: '2.0%',
    });
  }

  // THE POLYMATH — 5+ philosophers above 10% in the blend.
  if (ctx.blend.filter((b) => b.pct >= 10).length >= 5) {
    unlocks.push({
      id: 'badge-polymath',
      kind: 'badge',
      label: 'Polymath',
      blurb: 'Your worldview draws meaningfully from five or more traditions at once. A rare synthesis.',
      rate: '4%',
    });
  }

  return unlocks;
}

/** Which unlocked entries are hidden philosophers (affects blend + rarity). */
export function unlockedPhilosophers(unlocks: Unlock[]): string[] {
  return unlocks.filter((u) => u.kind === 'philosopher').map((u) => u.id);
}
