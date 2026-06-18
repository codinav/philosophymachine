import { NextRequest, NextResponse } from 'next/server';
import { BATTLE_BY_SLUG, SEED_VOTES } from '@/lib/data/battles';

export const runtime = 'nodejs';

// In-memory tally on top of the seeds (docs/04: real impl uses battle_votes +
// edge-KV counters). Persists for the life of the server instance — enough for
// the MVP to feel live; survives to DB in Phase 3.
const live: Record<string, { a: number; b: number }> = {};

export async function POST(req: NextRequest) {
  let body: { battleSlug?: string; side?: 'a' | 'b' };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }
  const { battleSlug, side } = body;
  if (!battleSlug || !BATTLE_BY_SLUG[battleSlug] || (side !== 'a' && side !== 'b')) {
    return NextResponse.json({ error: 'bad request' }, { status: 400 });
  }
  const seed = SEED_VOTES[battleSlug] ?? { a: 0, b: 0 };
  const cur = live[battleSlug] ?? { a: 0, b: 0 };
  cur[side] += 1;
  live[battleSlug] = cur;
  return NextResponse.json({ a: seed.a + cur.a, b: seed.b + cur.b });
}
