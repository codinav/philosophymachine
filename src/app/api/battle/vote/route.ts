import { NextRequest, NextResponse } from 'next/server';
import { BATTLE_BY_SLUG, SEED_VOTES } from '@/lib/data/battles';
import { voteBattle } from '@/lib/store';

export const runtime = 'nodejs';

// Votes persist to the store (seed counts + real votes). docs/04 uses a
// battle_votes table + edge-KV counters in production; this is the local
// single-instance equivalent.
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
  const live = await voteBattle(battleSlug, side);
  return NextResponse.json({ a: seed.a + live.a, b: seed.b + live.b });
}
