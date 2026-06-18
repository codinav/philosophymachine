import { NextRequest, NextResponse } from 'next/server';
import { chatWithPhilosopher, type ChatMessage } from '@/lib/ai';
import { PHILOSOPHER_BY_SLUG } from '@/lib/data/philosophers';
import { isPremium } from '@/lib/entitlements';

export const runtime = 'nodejs';
export const maxDuration = 30;

// Free tier: 3 messages/day (docs/00 §monetization). Enforced per anon id;
// trivially spoofable client-side but fine for MVP — real gating happens once
// auth + DB land. Kept in-memory per instance.
const FREE_DAILY = 3;
const counts = new Map<string, { day: string; n: number }>();

export async function POST(req: NextRequest) {
  let body: { philosopher?: string; messages?: ChatMessage[]; resultCode?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  const { philosopher, messages, resultCode } = body;
  if (!philosopher || !PHILOSOPHER_BY_SLUG[philosopher]) {
    return NextResponse.json({ error: 'unknown philosopher' }, { status: 400 });
  }
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: 'messages required' }, { status: 400 });
  }

  // During the Launch Festival, chat is unlimited for everyone (docs/entitlements).
  const unlimited = isPremium();

  // crude per-anon rate limit (skipped while premium/promo is active)
  const anon = req.cookies.get('pm_anon')?.value ?? req.headers.get('x-forwarded-for') ?? 'anon';
  const day = new Date().toISOString().slice(0, 10);
  const rec = counts.get(anon);
  const n = rec && rec.day === day ? rec.n : 0;
  if (!unlimited && n >= FREE_DAILY) {
    return NextResponse.json(
      { error: 'limit', message: 'You’ve reached today’s free messages. Upgrade to The Academy for unlimited dialogue.' },
      { status: 429 },
    );
  }

  const result = await chatWithPhilosopher({
    philosopherSlug: philosopher,
    messages: messages.slice(-12), // cap history
    resultCode,
  });

  if (!unlimited) counts.set(anon, { day, n: n + 1 });
  return NextResponse.json({
    reply: result.reply,
    mocked: result.mocked,
    remaining: unlimited ? null : FREE_DAILY - (n + 1),
  });
}
