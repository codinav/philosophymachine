import { promises as fs } from 'node:fs';
import path from 'node:path';

// Lightweight server-side store for admin analytics + persisted battle/daily
// state. JSON-file backed (.data/store.json) — works immediately on a single
// instance / local dev. NOTE: serverless (Vercel) has an ephemeral filesystem,
// so production-scale aggregation needs the Postgres layer (Phase 3, docs/04).
// The accessor API below is what /admin and the API routes call, so swapping
// the backend later is a localized change.

export interface QuizRecord {
  ts: number;
  primary: string;
  tribe: string;
  tier: string;
  len: number;
}

export interface Store {
  quizzes: {
    total: number;
    byPrimary: Record<string, number>;
    byTribe: Record<string, number>;
    byTier: Record<string, number>;
    byLen: Record<string, number>;
    recent: QuizRecord[]; // capped
  };
  daily: Record<string, { agree: number; disagree: number }>;
  dailyOverride: Record<string, string>; // date -> questionId
  battles: Record<string, { a: number; b: number; active?: boolean }>;
  chats: number;
  startedAt: number;
}

const FILE = path.join(process.cwd(), '.data', 'store.json');
const RECENT_CAP = 100;

function empty(): Store {
  return {
    quizzes: { total: 0, byPrimary: {}, byTribe: {}, byTier: {}, byLen: {}, recent: [] },
    daily: {},
    dailyOverride: {},
    battles: {},
    chats: 0,
    startedAt: Date.now(),
  };
}

let cache: Store | null = null;

async function load(): Promise<Store> {
  if (cache) return cache;
  try {
    const raw = await fs.readFile(FILE, 'utf8');
    cache = { ...empty(), ...JSON.parse(raw) };
  } catch {
    cache = empty();
  }
  return cache!;
}

let writeQueue: Promise<void> = Promise.resolve();
async function persist(): Promise<void> {
  const data = JSON.stringify(cache);
  writeQueue = writeQueue.then(async () => {
    try {
      await fs.mkdir(path.dirname(FILE), { recursive: true });
      await fs.writeFile(FILE, data, 'utf8');
    } catch {
      // best-effort: read-only FS (serverless) keeps the in-memory cache only
    }
  });
  return writeQueue;
}

// ── writes ──
const inc = (m: Record<string, number>, k: string) => (m[k] = (m[k] ?? 0) + 1);

export async function recordQuiz(r: Omit<QuizRecord, 'ts'>): Promise<void> {
  const s = await load();
  s.quizzes.total++;
  inc(s.quizzes.byPrimary, r.primary);
  inc(s.quizzes.byTribe, r.tribe);
  inc(s.quizzes.byTier, r.tier);
  inc(s.quizzes.byLen, String(r.len));
  s.quizzes.recent.unshift({ ...r, ts: Date.now() });
  s.quizzes.recent = s.quizzes.recent.slice(0, RECENT_CAP);
  await persist();
}

export async function recordDaily(date: string, choice: 'agree' | 'disagree'): Promise<void> {
  const s = await load();
  s.daily[date] ??= { agree: 0, disagree: 0 };
  s.daily[date][choice]++;
  await persist();
}

export async function recordChat(): Promise<void> {
  const s = await load();
  s.chats++;
  await persist();
}

export async function voteBattle(slug: string, side: 'a' | 'b'): Promise<{ a: number; b: number }> {
  const s = await load();
  s.battles[slug] ??= { a: 0, b: 0 };
  s.battles[slug][side]++;
  await persist();
  return { a: s.battles[slug].a, b: s.battles[slug].b };
}

export async function resetBattle(slug: string): Promise<void> {
  const s = await load();
  s.battles[slug] = { a: 0, b: 0, active: s.battles[slug]?.active };
  await persist();
}

export async function setBattleActive(slug: string, active: boolean): Promise<void> {
  const s = await load();
  s.battles[slug] ??= { a: 0, b: 0 };
  s.battles[slug].active = active;
  await persist();
}

export async function setDailyOverride(date: string, questionId: string): Promise<void> {
  const s = await load();
  if (questionId) s.dailyOverride[date] = questionId;
  else delete s.dailyOverride[date];
  await persist();
}

// ── reads ──
export async function getStore(): Promise<Store> {
  return load();
}

export async function getBattleExtra(slug: string): Promise<{ a: number; b: number; active?: boolean }> {
  const s = await load();
  return s.battles[slug] ?? { a: 0, b: 0 };
}

export async function getDailyOverride(date: string): Promise<string | undefined> {
  const s = await load();
  return s.dailyOverride[date];
}

export async function getDailySplit(date: string): Promise<{ agree: number; disagree: number } | undefined> {
  const s = await load();
  return s.daily[date];
}
