// ─────────────────────────────────────────────────────────────────────────
// THE PHILOSOPHY MACHINE — shared types
// The 9-dimension belief space is the lingua franca: questions write to it,
// philosophers are points in it, the dossier reads from it.
// See docs/05-scoring-algorithm.md and docs/06-philosopher-mapping.md.
// ─────────────────────────────────────────────────────────────────────────

export const DIMENSIONS = [
  'metaphysics', // materialism (-1) … idealism/spirit (+1)
  'epistemology', // empiricism/doubt (-1) … rationalism/innate truth (+1)
  'ethics', // consequentialist (-1) … deontology/virtue (+1)
  'freeWill', // determinism (-1) … libertarian free will (+1)
  'meaning', // given/objective (-1) … created/absent (+1)
  'theology', // naturalist/atheist (-1) … theist/divine (+1)
  'self', // no-self/flux (-1) … substantial self (+1)
  'politics', // individualist (-1) … collectivist/harmony (+1)
  'attachment', // embrace world/desire (-1) … renounce/transcend (+1)
] as const;

export type Dimension = (typeof DIMENSIONS)[number];

/** A vector in belief-space. Missing keys are treated as 0. */
export type DimVector = Partial<Record<Dimension, number>>;

/** A vector where every dimension is present (used internally after normalize). */
export type FullVector = Record<Dimension, number>;

export interface QuestionOption {
  id: string;
  label: string;
  /** Sparse weights this option contributes when chosen / agreed-with. */
  weights: DimVector;
}

export type QuestionFormat = 'slider' | 'binary';
export type QuestionTag = 'core' | 'deep' | 'daily' | 'battle';

export interface Question {
  id: string;
  /** The dilemma, phrased as a vivid first-person stake. */
  prompt: string;
  format: QuestionFormat;
  tags: QuestionTag[];
  /** Up-weight sharp diagnostic dilemmas (0.5–1.5). */
  confidence: number;
  /**
   * For sliders: a single `agree` option whose weights scale by the slider
   * value v ∈ [-1,1]. For binary: exactly two options (index 0 = "no/left",
   * 1 = "yes/right"); choosing one applies its weights at full strength.
   */
  options: QuestionOption[];
  /** Reaction line shown by "the machine" after answering (flavor). */
  reaction?: string;
}

/** A user's answer to one question. value ∈ [-1,1]; 0 (with refused) = aporia. */
export interface Answer {
  questionId: string;
  value: number;
  refused?: boolean;
  ms?: number; // time taken, for analytics
}

export interface Philosopher {
  slug: string;
  name: string;
  tradition: string;
  era: string;
  tribe: TribeSlug;
  accent: string; // hex
  accentSoft: string; // rgba glow
  sigil: string; // single glyph used as a lightweight portrait/sigil
  bio: string;
  oneLiner: string; // "You think like X" subtitle
  quote: string;
  quoteAttribution?: string;
  reading: string[];
  vector: DimVector;
  /** Hidden philosophers only surface via unlock predicates. */
  hidden?: boolean;
}

export type TribeSlug =
  | 'rationalist'
  | 'skeptic'
  | 'stoic'
  | 'existentialist'
  | 'idealist'
  | 'mystic'
  | 'hedonist'
  | 'dharma';

export interface Tribe {
  slug: TribeSlug;
  name: string;
  essence: string;
  accent: string;
  accentSoft: string;
  sigil: string;
  manifesto: string;
  anchors: string[]; // philosopher slugs
}

export interface BlendEntry {
  slug: string;
  pct: number;
}

export type RarityTier = 'common' | 'uncommon' | 'rare' | 'mythic';

export interface ResultPayload {
  code: string;
  blend: BlendEntry[];
  primary: string; // philosopher slug
  tribe: TribeSlug;
  tribeConfidence: number;
  dimensions: FullVector;
  rarityPct: number; // "rarer than X%"
  rarityTier: RarityTier;
  unlocked: string[]; // hidden philosopher slugs / ending ids
  aporiaCount: number;
  isDeep: boolean;
}

export interface Battle {
  slug: string;
  title: string;
  prompt: string;
  sideA: string; // philosopher slug
  sideB: string;
  active: boolean;
}
