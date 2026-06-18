import type { Battle } from '@/types';

// Curated head-to-heads for Battle Mode (docs/01-viral-growth.md §6).
// Evergreen, low-effort to share, and a recurring reason to return.
export const BATTLES: Battle[] = [
  {
    slug: 'nietzsche-vs-buddha',
    title: 'Nietzsche vs Buddha',
    prompt: 'Embrace desire and become who you are — or extinguish craving and find peace?',
    sideA: 'nietzsche',
    sideB: 'buddha',
    active: true,
  },
  {
    slug: 'kant-vs-krishna',
    title: 'Kant vs Krishna',
    prompt: 'Do your duty because reason demands it — or because it is your sacred dharma?',
    sideA: 'kant',
    sideB: 'krishna',
    active: true,
  },
  {
    slug: 'camus-vs-sartre',
    title: 'Camus vs Sartre',
    prompt: 'Revolt against the absurd — or build meaning through radical freedom?',
    sideA: 'camus',
    sideB: 'sartre',
    active: true,
  },
  {
    slug: 'plato-vs-hume',
    title: 'Plato vs Hume',
    prompt: 'Is truth grasped by pure reason — or only ever traced from experience?',
    sideA: 'plato',
    sideB: 'hume',
    active: true,
  },
  {
    slug: 'confucius-vs-laotzu',
    title: 'Confucius vs Lao Tzu',
    prompt: 'Cultivate order through ritual and role — or yield to the natural Way?',
    sideA: 'confucius',
    sideB: 'lao-tzu',
    active: true,
  },
  {
    slug: 'aristotle-vs-nietzsche',
    title: 'Aristotle vs Nietzsche',
    prompt: 'Flourish through the golden mean — or overcome yourself through the will to power?',
    sideA: 'aristotle',
    sideB: 'nietzsche',
    active: false,
  },
];

export const BATTLE_BY_SLUG: Record<string, Battle> = Object.fromEntries(
  BATTLES.map((b) => [b.slug, b]),
);

// Seeded vote tallies so the leaderboard looks alive pre-launch (replaced by DB).
export const SEED_VOTES: Record<string, { a: number; b: number }> = {
  'nietzsche-vs-buddha': { a: 14820, b: 19340 },
  'kant-vs-krishna': { a: 8210, b: 7640 },
  'camus-vs-sartre': { a: 11200, b: 6980 },
  'plato-vs-hume': { a: 5430, b: 9120 },
  'confucius-vs-laotzu': { a: 4120, b: 8870 },
  'aristotle-vs-nietzsche': { a: 0, b: 0 },
};
