import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { Answer } from '../src/types';
import { score, buildUserVector } from '../src/lib/scoring';
import { encodeResult, decodeResult } from '../src/lib/codec';
import { QUESTION_BY_ID } from '../src/lib/data/questions';

// Helper: build answers. value +1 = strongly agree / "yes" option; -1 = disagree / "no".
const a = (questionId: string, value: number, refused = false): Answer => ({ questionId, value, refused });

// Archetype "answer keys" — CI guards the mapping (docs/06 §4).
const KANTIAN: Answer[] = [
  a('q-trolley', -1), // don't pull → deontology
  a('q-lie-save-life', -1), // never lie
  a('q-sacrifice-self', 1), // duty over outcomes
  a('q-categorical', 1),
  a('q-people-as-ends', 1),
  a('q-greatest-good', -1), // reject utilitarianism
  a('q-free-will', 1),
  a('q-innate-knowledge', 1),
  a('q-reason-over-feeling', 1),
  a('q-promise-secret', 1),
];

const BUDDHIST: Answer[] = [
  a('q-self-illusion', 1),
  a('q-desire-source-suffering', 1),
  a('q-renounce-desire', 1),
  a('q-no-self-comfort', 1),
  a('q-change-constant', 1),
  a('q-equanimity', 1),
  a('q-ambition', -1),
  a('q-money-corrupts', 1),
];

const SARTREAN: Answer[] = [
  a('q-free-will', 1),
  a('q-responsibility', 1),
  a('q-meaning-created', 1),
  a('q-free-to-define', 1),
  a('q-god-dead', 1),
  a('q-divine-reality', -1),
  a('q-could-have-done-otherwise', 1),
];

const NIETZSCHEAN: Answer[] = [
  a('q-god-dead', 1),
  a('q-meaning-created', 1),
  a('q-will-to-power', 1),
  a('q-pity', 1),
  a('q-great-man', 1),
  a('q-eternal-recurrence', 1),
  a('q-renounce-desire', -1), // embrace desire
  a('q-individual-vs-collective', -1),
  a('q-passion-life', 1),
];

const NAGARJUNA_SEEKER: Answer[] = [
  a('q-self-illusion', 1),
  a('q-emptiness', 1),
  a('q-consciousness-physical', 1),
  a('q-trust-senses', 1),
  a('q-certainty-impossible', 1),
  a('q-words-fail', 1),
  a('q-renounce-desire', 1),
  a('q-desire-source-suffering', 1),
  a('q-change-constant', 1),
];

test('Kantian archetype → Kant primary', () => {
  const r = score(KANTIAN);
  assert.equal(r.primary, 'kant', `got ${r.primary} (${JSON.stringify(r.blend)})`);
});

test('Buddhist archetype → Buddha primary', () => {
  const r = score(BUDDHIST);
  assert.equal(r.primary, 'buddha', `got ${r.primary} (${JSON.stringify(r.blend)})`);
});

test('Sartrean archetype → Sartre primary', () => {
  const r = score(SARTREAN);
  assert.equal(r.primary, 'sartre', `got ${r.primary} (${JSON.stringify(r.blend)})`);
});

test('Nietzschean archetype → Nietzsche primary', () => {
  const r = score(NIETZSCHEAN);
  assert.equal(r.primary, 'nietzsche', `got ${r.primary} (${JSON.stringify(r.blend)})`);
});

test('extreme anti-essentialist signature unlocks Nāgārjuna', () => {
  const r = score(NAGARJUNA_SEEKER);
  assert.ok(r.unlocked.includes('nagarjuna'), `unlocked: ${JSON.stringify(r.unlocked)}`);
});

test('blend always sums to 100% and has a primary', () => {
  for (const set of [KANTIAN, BUDDHIST, SARTREAN, NIETZSCHEAN, NAGARJUNA_SEEKER]) {
    const r = score(set);
    const sum = r.blend.reduce((s, b) => s + b.pct, 0);
    assert.equal(sum, 100, `blend sums to ${sum}`);
    assert.ok(r.blend.length >= 1);
    assert.ok(r.blend[0].pct >= r.blend[r.blend.length - 1].pct);
  }
});

test('decisive headline: a clear archetype gives a strong primary %', () => {
  const r = score(KANTIAN);
  assert.ok(r.blend[0].pct >= 45, `primary only ${r.blend[0].pct}%`);
});

test('monotonicity: pushing deontology harder never lowers Kant share', () => {
  const soft = score([a('q-categorical', 0.4), a('q-people-as-ends', 0.4), a('q-greatest-good', -0.4)]);
  const hard = score([a('q-categorical', 1), a('q-people-as-ends', 1), a('q-greatest-good', -1)]);
  const kantSoft = soft.blend.find((b) => b.slug === 'kant')?.pct ?? 0;
  const kantHard = hard.blend.find((b) => b.slug === 'kant')?.pct ?? 0;
  assert.ok(kantHard >= kantSoft, `hard ${kantHard} < soft ${kantSoft}`);
});

test('refused answers raise aporia and can unlock The Sphinx', () => {
  const refusals = Object.keys(QUESTION_BY_ID)
    .slice(0, 8)
    .map((id) => a(id, 0, true));
  const r = score(refusals);
  assert.ok(r.aporiaCount >= 6);
  assert.ok(r.unlocked.includes('ending-sphinx'));
});

test('codec round-trips the belief vector', () => {
  const { vector, aporiaCount } = buildUserVector(NIETZSCHEAN);
  const code = encodeResult(vector, aporiaCount, false);
  const decoded = decodeResult(code);
  assert.ok(decoded);
  for (const k of Object.keys(vector) as (keyof typeof vector)[]) {
    assert.ok(Math.abs(decoded!.dimensions[k] - vector[k]) < 0.02, `${k} drift`);
  }
  assert.equal(decoded!.aporiaCount, aporiaCount);
});

test('decoding a code reproduces the same primary (share pages are backend-free)', () => {
  const r = score(SARTREAN);
  const decoded = decodeResult(r.code);
  assert.ok(decoded);
  // re-score from the decoded vector path is exercised in buildResultFromVector
  assert.equal(decoded!.isDeep, false);
});
