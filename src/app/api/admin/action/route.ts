import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin-auth';
import { resetBattle, setBattleActive, setDailyOverride } from '@/lib/store';
import { BATTLE_BY_SLUG } from '@/lib/data/battles';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  try {
    switch (body.action) {
      case 'resetBattle':
        if (BATTLE_BY_SLUG[body.slug]) await resetBattle(body.slug);
        break;
      case 'toggleBattle':
        if (BATTLE_BY_SLUG[body.slug]) await setBattleActive(body.slug, !!body.active);
        break;
      case 'setDailyOverride':
        await setDailyOverride(String(body.date), String(body.questionId || ''));
        break;
      default:
        return NextResponse.json({ error: 'unknown action' }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: 'action failed' }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
