import { NextRequest, NextResponse } from 'next/server';
import { recordQuiz, recordDaily } from '@/lib/store';

export const runtime = 'nodejs';

// Anonymous, aggregate-only event capture for admin analytics. No PII — we
// record derived outcomes (which philosopher/tribe/tier), never raw answers.
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  try {
    if (body.type === 'quiz_completed') {
      await recordQuiz({
        primary: String(body.primary ?? 'unknown'),
        tribe: String(body.tribe ?? 'unknown'),
        tier: String(body.tier ?? 'common'),
        len: Number(body.len ?? 0),
      });
    } else if (body.type === 'daily_answer') {
      const choice = body.choice === 'agree' ? 'agree' : 'disagree';
      await recordDaily(String(body.date ?? new Date().toISOString().slice(0, 10)), choice);
    }
  } catch {
    // analytics must never break the user experience
  }
  return NextResponse.json({ ok: true });
}
